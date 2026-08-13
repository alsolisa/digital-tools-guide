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

function decodeHtml(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:x27|39);/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function metricNumber(value) {
  const normalized = value.replace(/[$,*]/g, "").trim();
  if (!normalized || normalized === "--") return null;
  const number = Number(normalized);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function parseArtificialAnalysisLeaderboard(html) {
  const bodies = [...html.matchAll(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/gi)].map((match) => match[1]);
  const leaderboardBody = bodies.find((body) => body.includes("font-semibold border-l-4") && body.includes("text-center"));
  if (!leaderboardBody) return [];

  const rows = [];
  for (const rowMatch of leaderboardBody.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const row = rowMatch[1];
    const modelMatch = row.match(/<div[^>]*class="[^"]*font-semibold\s+border-l-4[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    const providerMatch = row.match(/<img[^>]*alt="([^"]+)"[^>]*>/i);
    const metrics = [...row.matchAll(/<div[^>]*class="[^"]*text-center[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)].map((match) => decodeHtml(match[1]));
    if (!modelMatch || !providerMatch || metrics.length < 6) continue;

    const intelligence = metricNumber(metrics[1]);
    const outputTokensPerSecond = metricNumber(metrics[3]);
    const latencySeconds = metricNumber(metrics[4]);
    const totalResponseSeconds = metricNumber(metrics[5]);
    if (intelligence === null || intelligence > 100 || outputTokensPerSecond === null || latencySeconds === null || totalResponseSeconds === null) continue;

    rows.push({
      rank: rows.length + 1,
      model: decodeHtml(modelMatch[1]),
      company: decodeHtml(providerMatch[1]),
      contextWindow: metrics[0],
      intelligence,
      priceUsdPerMillion: metricNumber(metrics[2]),
      outputTokensPerSecond,
      latencySeconds,
      totalResponseSeconds,
    });
  }

  return rows;
}

export function parseGamsgoPrice(html, options = {}) {
  const text = normalizePageText(html);
  let result = null;

  if (options.embeddedProduct) {
    const embeddedProduct = html.match(
      /"service_ids":\d+\}[\s\S]{0,260}?"([0-9]+(?:[.,][0-9]+)?)","([0-9]+(?:[.,][0-9]+)?)","([0-9]+(?:[.,][0-9]+)?)","\$","USD\(\$\)"/i,
    );
    if (embeddedProduct) {
      const specialValue = Number(embeddedProduct[1].replace(",", "."));
      const officialTotal = Number(embeddedProduct[2].replace(",", "."));
      const durationMonths = Number(embeddedProduct[3].replace(",", "."));
      if (specialValue > 0 && officialTotal > 0 && Number.isInteger(durationMonths) && durationMonths > 0 && durationMonths <= 36) {
        result = {
          official: { currency: "USD", value: Math.round((officialTotal / durationMonths) * 100) / 100 },
          special: { currency: "USD", value: specialValue },
          period: "month",
          offerDurationMonths: durationMonths,
        };
      }
    }
  }

  const match = text.match(
    /Official Price\s*(US\$|S\$|\$|€|£)?\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*month\s*vs\s*GamsGo Special\s*(US\$|S\$|\$|€|£)?\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*month/i,
  );
  if (!result && match) {
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

  if (!result) {
    const chineseComparison = text.match(
      /对比官网价格\s*(US\$|S\$|\$|€|£)?\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*月[，,\s]*GamsGo特价\s*(US\$|S\$|\$|€|£)?\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*月/i,
    );
    if (chineseComparison) {
      const officialValue = Number(chineseComparison[2].replace(",", "."));
      const specialValue = Number(chineseComparison[4].replace(",", "."));
      if (officialValue > 0 && specialValue > 0) {
        result = {
          official: { currency: CURRENCY_MARKS[chineseComparison[1] || "$"] || "USD", value: officialValue },
          special: { currency: CURRENCY_MARKS[chineseComparison[3] || "$"] || "USD", value: specialValue },
          period: "month",
        };
      }
    }
  }

  if (!result) return null;

  const observed = [result.special.value, ...(options.conflictPatterns || []).flatMap((pattern) =>
    [...text.matchAll(pattern)].map((item) => Number(item[1]?.replace(",", "."))).filter((value) => Number.isFinite(value) && value > 0),
  )];
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
  const retainedPublished = previous.published ? { published: previous.published } : {};
  if (!nextPrice) return { ...retainedPublished, state: "unreadable", candidate: null, candidateSeenCount: 0 };
  if (!previous.published) return { state: "ok", published: nextPrice, candidate: null, candidateSeenCount: 0 };

  const same = previous.published.currency === nextPrice.currency && previous.published.value === nextPrice.value;
  if (same) return { ...retainedPublished, state: "ok", candidate: null, candidateSeenCount: 0 };

  const changeRatio = Math.abs(nextPrice.value - previous.published.value) / previous.published.value;
  if (changeRatio < 0.5) {
    return { state: "ok", published: nextPrice, candidate: null, candidateSeenCount: 0 };
  }

  const candidateMatches = previous.candidate?.currency === nextPrice.currency && previous.candidate?.value === nextPrice.value;
  const candidateSeenCount = candidateMatches ? (previous.candidateSeenCount || 0) + 1 : 1;
  if (candidateSeenCount >= 2) {
    return { state: "price-changed", published: nextPrice, candidate: null, candidateSeenCount: 0 };
  }
  return { ...retainedPublished, state: "price-change-pending", candidate: nextPrice, candidateSeenCount };
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

export function parseLatestReleaseUrl(url, repository) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.toLowerCase() !== "github.com") return null;
    const prefix = `/${repository}/releases/tag/`;
    if (!parsed.pathname.toLowerCase().startsWith(prefix.toLowerCase())) return null;
    const encodedVersion = parsed.pathname.slice(prefix.length);
    return encodedVersion ? decodeURIComponent(encodedVersion) : null;
  } catch {
    return null;
  }
}

export function hasCompleteReleaseAsset(client, repository = client?.repository) {
  if (!client || !repository || client.repository !== repository || !client.version) return false;
  if (!client.assetName || !Number.isFinite(client.assetSize) || client.assetSize <= 0) return false;
  if (!/^[A-F0-9]{64}$/.test(client.assetSha256 || "")) return false;
  return client.assetUrl?.startsWith(`https://github.com/${repository}/releases/download/`) === true;
}

export function retainReleaseSnapshot(previous, { repository, version = null, releaseUrl = null, error = "release metadata unavailable" }) {
  if (!hasCompleteReleaseAsset(previous, repository)) {
    return { repository, state: "error", version, releaseUrl, error };
  }

  const sameVersion = Boolean(version && previous.version === version);
  return {
    ...previous,
    repository,
    state: sameVersion ? "stale" : "error",
    ...(sameVersion && releaseUrl ? { releaseUrl } : {}),
    detectedVersion: version,
    error,
  };
}

export function describeExecError(error) {
  const name = typeof error?.name === "string" && error.name ? error.name : "Error";
  const code = error?.code !== undefined && error?.code !== null ? `code=${String(error.code)}` : null;
  const signal = typeof error?.signal === "string" && error.signal ? `signal=${error.signal}` : null;
  const stderr = typeof error?.stderr === "string"
    ? error.stderr
      .replace(/Authorization:\s*Bearer\s+\S+/gi, "Authorization: Bearer [redacted]")
      .replace(/https?:\/\/\S+/gi, "[url]")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 220)
    : "";
  return [name, code, signal, stderr || null].filter(Boolean).join("; ");
}

export function retainGamsgoSnapshot(previous, current, nowMs = Date.now(), maxAgeMs = 7 * 24 * 60 * 60 * 1000) {
  if (!current || current.state !== "unreadable") return current;
  const evidenceAt = previous?.lastSuccessfulAt || previous?.checkedAt;
  const evidenceTime = evidenceAt ? Date.parse(evidenceAt) : Number.NaN;
  const evidenceIsFresh = Number.isFinite(evidenceTime) && nowMs >= evidenceTime && nowMs - evidenceTime <= maxAgeMs;
  if (!evidenceIsFresh) return current;

  if (previous?.state === "conflict" && Array.isArray(previous.observedValues) && previous.observedValues.length > 1) {
    const conflictNote = (previous.note || "同一公开页面出现多个互相冲突的月付价格，已隐藏数字并转入人工复核")
      .replace(/(?:；本轮没有提取出稳定价格，保留最近一次冲突证据)+$/u, "");
    return {
      ...previous,
      lastAttemptedAt: current.checkedAt,
      ...(current.error ? { error: current.error } : {}),
      note: `${conflictNote}；本轮没有提取出稳定价格，保留最近一次冲突证据`,
    };
  }

  if (!["ok", "price-changed", "stale"].includes(previous?.state) || !previous?.published) return current;
  return {
    ...current,
    state: "stale",
    published: previous.published,
    cny: previous.cny ?? null,
    officialObserved: previous.officialObserved,
    period: previous.period,
    offerDurationMonths: previous.offerDurationMonths,
    lastSuccessfulAt: evidenceAt,
    note: `本轮能打开商家页面，但没有提取出稳定价格；展示 ${evidenceAt.slice(0, 10)} 最近一次成功核验的价格，结算前请打开购买页确认`,
  };
}

export async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workerCount = Math.max(1, Math.min(items.length, Math.floor(limit) || 1));

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}
