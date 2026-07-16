const CURRENCY_MARKS = {
  "S$": "SGD",
  "US$": "USD",
  "$": "USD",
  "€": "EUR",
  "£": "GBP",
};

export function normalizePageText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseGamsgoPrice(html, options = {}) {
  const text = normalizePageText(html);
  const match = text.match(
    /Official Price\s*(US\$|S\$|\$|€|£)?\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*month\s*vs\s*GamsGo Special\s*(US\$|S\$|\$|€|£)?\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*month/i,
  );
  let result = null;
  if (match) {
    const officialValue = Number(match[2].replace(",", "."));
    const specialValue = Number(match[4].replace(",", "."));
    if (Number.isFinite(officialValue) && Number.isFinite(specialValue) && officialValue > 0 && specialValue > 0) {
      result = {
        official: { currency: CURRENCY_MARKS[match[1] || "$"] || "USD", value: officialValue },
        special: { currency: CURRENCY_MARKS[match[3] || "$"] || "USD", value: specialValue },
        period: "month",
      };
    }
  }

  if (!result && options.specialPattern) {
    const fallback = text.match(options.specialPattern);
    if (fallback) {
      const value = Number(fallback[2].replace(",", "."));
      if (Number.isFinite(value) && value > 0) {
        result = {
          official: options.official || null,
          special: { currency: CURRENCY_MARKS[fallback[1] || "$"] || "USD", value },
          period: "month",
        };
      }
    }
  }

  if (!result) return null;

  const observed = (options.conflictPatterns || []).flatMap((pattern) =>
    [...text.matchAll(pattern)].map((item) => Number(item[1]?.replace(",", "."))).filter((value) => Number.isFinite(value) && value > 0),
  );
  const distinctObserved = [...new Set(observed.map((value) => value.toFixed(2)))];
  if (distinctObserved.length > 1) {
    return { ...result, conflict: true, observedValues: distinctObserved.map(Number) };
  }

  return result;
}

export function validatePublicPrice(price, expectedDomain) {
  return Boolean(
    price &&
      Number.isFinite(price.value) &&
      price.value > 0 &&
      ["USD", "SGD", "EUR", "GBP"].includes(price.currency) &&
      expectedDomain === "www.gamsgo.com",
  );
}

export function decidePublishedPrice(previous = {}, nextPrice) {
  if (!nextPrice) return { ...previous, state: "unreadable", candidate: null, candidateSeenCount: 0 };
  if (!previous.published) return { state: "ok", published: nextPrice, candidate: null, candidateSeenCount: 0 };

  const same = previous.published.currency === nextPrice.currency && previous.published.value === nextPrice.value;
  if (same) return { ...previous, state: "ok", candidate: null, candidateSeenCount: 0 };

  const changeRatio = Math.abs(nextPrice.value - previous.published.value) / previous.published.value;
  if (changeRatio < 0.5) {
    return { state: "ok", published: nextPrice, candidate: null, candidateSeenCount: 0 };
  }

  const candidateMatches = previous.candidate?.currency === nextPrice.currency && previous.candidate?.value === nextPrice.value;
  const candidateSeenCount = candidateMatches ? (previous.candidateSeenCount || 0) + 1 : 1;
  if (candidateSeenCount >= 2) {
    return { state: "price-changed", published: nextPrice, candidate: null, candidateSeenCount: 0 };
  }
  return { ...previous, state: "price-change-pending", candidate: nextPrice, candidateSeenCount };
}

export function cnyValue(price, exchange) {
  if (!price || !exchange?.rates?.CNY) return null;
  const usdValue = price.currency === "USD" ? price.value : price.currency === "SGD" ? price.value / exchange.rates.SGD : null;
  return usdValue === null ? null : Math.round(usdValue * exchange.rates.CNY * 100) / 100;
}

export function isAllowedOfficialDownload(url) {
  const hostname = new URL(url).hostname.toLowerCase();
  return [
    "chatgpt.com", "openai.com", "claude.ai", "anthropic.com", "support.claude.com",
    "gemini.google.com", "google.com", "support.google.com", "grok.com", "x.ai", "x.com",
    "perplexity.ai", "youtube.com", "www.youtube.com", "tiktok.com", "www.tiktok.com",
    "play.google.com", "apps.apple.com", "apps.microsoft.com", "github.com", "one.google.com",
    "midjourney.com", "nssurge.com",
  ].some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}
