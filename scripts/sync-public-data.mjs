import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { cnyValue, decidePublishedPrice, isAllowedOfficialDownload, mapWithConcurrency, parseArtificialAnalysisLeaderboard, parseGamsgoPrice, parseLatestReleaseUrl, retainReleaseSnapshot, validatePublicPrice } from "./sync-utils.mjs";

const execFileAsync = promisify(execFile);
const curl = process.platform === "win32" ? "curl.exe" : "curl";
const nullDevice = process.platform === "win32" ? "NUL" : "/dev/null";
const dataDirectory = new URL("../data/", import.meta.url);
const autoSyncPath = new URL("../data/auto-sync.json", import.meta.url);
const syncStatusPath = new URL("../data/sync-status.json", import.meta.url);
const promotionManifest = JSON.parse(await readFile(new URL("../data/promotion-links.json", import.meta.url), "utf8"));
const promotionLinks = promotionManifest.links;

const staticLinks = [
  { id: "youtu-client", url: "https://d.yoututz.top/ph/youtu", kind: "client" },
  { id: "wgetcloud", url: "https://wgetcloud.ltd/", kind: "official" },
  { id: "surge", url: "https://nssurge.com/", kind: "client" },
  { id: "arena", url: "https://arena.ai/leaderboard/text", kind: "benchmark" },
  { id: "artificial-analysis", url: "https://artificialanalysis.ai/leaderboards/models", kind: "benchmark" },
  { id: "chatgpt-download", url: "https://chatgpt.com/download/", kind: "download" },
  { id: "claude-download", url: "https://claude.ai/download", kind: "download" },
  { id: "gemini-web", url: "https://gemini.google.com/", kind: "download" },
  { id: "grok-web", url: "https://grok.com/", kind: "download" },
  { id: "perplexity-platforms", url: "https://www.perplexity.ai/platforms", kind: "download" },
];

const gamsgoOffers = [
  {
    slug: "chatgpt-recharge",
    url: "https://www.gamsgo.com/details/chatgpt",
    parseOptions: {
      embeddedProduct: true,
      official: { currency: "USD", value: 20 },
    },
  },
  { slug: "claude", url: "https://www.gamsgo.com/details/claude", parseOptions: { embeddedProduct: true } },
  { slug: "gemini", url: "https://www.gamsgo.com/details/gemini", parseOptions: { embeddedProduct: true } },
  {
    slug: "grok",
    url: "https://www.gamsgo.com/details/grok",
    parseOptions: {
      embeddedProduct: true,
      conflictPatterns: [/GamsGo SuperGrok\s*\$\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*月/gi, /GamsGo 购买的价格为\s*([0-9]+(?:[.,][0-9]+)?)\s*美元\s*\/\s*月/gi],
    },
  },
  {
    slug: "perplexity",
    url: "https://www.gamsgo.com/details/Perplexity_AI",
    parseOptions: {
      embeddedProduct: true,
      specialPattern: /(?:in\s+)?GamsGo(?:\s+only)?\s*(US\$|S\$|\$|€|£)?\s*([0-9]+(?:[.,][0-9]+)?)\s*(?:per month|\/\s*month)/i,
      official: { currency: "USD", value: 16.66 },
    },
  },
  { slug: "midjourney", url: "https://www.gamsgo.com/details/midjourney_official/partner/2MGZTK", parseOptions: { embeddedProduct: true } },
];

const repositories = [
  { repository: "clash-verge-rev/clash-verge-rev", assetPattern: "^Clash\\.Verge_[0-9.]+_x64-setup\\.exe$" },
  { repository: "2dust/v2rayN", assetPattern: "^v2rayN-windows-64-desktop\\.zip$" },
  { repository: "chen08209/FlClash", assetPattern: "^FlClash-[0-9.]+-android-arm64-v8a\\.apk$" },
  { repository: "hiddify/hiddify-app", assetPattern: "^Hiddify-Windows-Setup-x64(?:-v?[0-9.]+)?\\.exe$" },
];

async function loadCatalogOfficialLinks() {
  const source = await readFile(new URL("../data/catalog.ts", import.meta.url), "utf8");
  const urls = [...source.matchAll(/(?:url|officialUrl):\s*"(https?:\/\/[^"\s]+)"/g)].map((match) => match[1]);
  return [...new Set(urls)]
    .filter((url) => isAllowedOfficialDownload(url))
    .map((url, index) => ({ id: `catalog-official-${index + 1}`, url, kind: "download-source" }));
}

async function loadSubscriptionPurchaseLinks() {
  const pricing = JSON.parse(await readFile(new URL("../data/subscription-pricing.json", import.meta.url), "utf8"));
  const items = Object.entries(pricing.offers || {}).flatMap(([slug, offer]) =>
    (offer.options || []).map((option, index) => ({
      id: `subscription-${slug}-${index + 1}`,
      url: option.url,
      kind: "subscription-purchase",
    })),
  );
  return [...new Map(items.map((item) => [item.url, item])).values()];
}

async function curlText(args, maxBuffer = 5 * 1024 * 1024) {
  const { stdout } = await execFileAsync(curl, args, { encoding: "utf8", timeout: 35_000, maxBuffer });
  return stdout;
}

async function checkLink(item) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await curlText(["-L", "--connect-timeout", "8", "--max-time", "30", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36", "-H", "Accept-Language: zh-CN,zh;q=0.9,en;q=0.7", "-o", nullDevice, "-sS", "-w", "%{http_code}\t%{url_effective}", item.url]);
      const [statusText, finalUrl] = result.trim().split("\t");
      const status = Number(statusText);
      if (status >= 500 && attempt === 0) continue;
      const protectedPage = [401, 403, 429].includes(status);
      const state = status >= 200 && status < 400 ? "ok" : protectedPage ? "protected" : "error";
      let trackingState;
      if (item.tracking) {
        const sourceUrl = new URL(item.url);
        const sourceCodePresent = item.tracking.sourceParameter
          ? sourceUrl.searchParams.get(item.tracking.sourceParameter) === item.tracking.value
          : sourceUrl.pathname.includes(`/partner/${item.tracking.sourcePathCode}`);
        const final = finalUrl ? new URL(finalUrl) : null;
        const finalCodePresent = !item.tracking.requireOnFinalUrl
          || (final && final.searchParams.get(item.tracking.finalParameter || item.tracking.sourceParameter) === item.tracking.value);
        trackingState = sourceCodePresent && finalCodePresent ? "verified" : sourceCodePresent && state === "protected" ? "source-only" : "error";
      }
      return { ...item, state, status, finalUrl, ...(trackingState ? { trackingState } : {}) };
    } catch (error) {
      lastError = error;
    }
  }
  return { ...item, state: "error", status: null, finalUrl: null, error: lastError?.name || "Error" };
}

async function checkRelease(config, previous) {
  const { repository, assetPattern } = config;
  const releaseApiUrl = `https://api.github.com/repos/${repository}/releases/latest`;
  const latestReleaseUrl = `https://github.com/${repository}/releases/latest`;
  const headers = ["-H", "Accept: application/vnd.github+json"];
  const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (githubToken) headers.push("-H", `Authorization: Bearer ${githubToken}`);
  try {
    const body = await curlText(["-fLsS", "--connect-timeout", "8", "--max-time", "30", "-A", "DigitalToolsGuide-ReleaseMonitor/1.0", ...headers, releaseApiUrl]);
    const release = JSON.parse(body);
    const asset = release.assets?.find((item) => new RegExp(assetPattern, "i").test(item.name));
    if (!asset?.browser_download_url || !asset?.size || !asset?.digest?.startsWith("sha256:")) throw new Error("required release asset missing");
    return {
      repository,
      state: "ok",
      version: release.tag_name,
      releaseUrl: release.html_url,
      assetName: asset.name,
      assetSize: asset.size,
      assetUrl: asset.browser_download_url,
      assetSha256: asset.digest.slice("sha256:".length).toUpperCase(),
      assetVerifiedAt: new Date().toISOString(),
    };
  } catch (error) {
    let version = null;
    let releaseUrl = null;
    try {
      const result = await curlText(["-L", "--connect-timeout", "8", "--max-time", "30", "-A", "DigitalToolsGuide-ReleaseMonitor/1.0", "-o", nullDevice, "-sS", "-w", "%{http_code}\t%{url_effective}", latestReleaseUrl]);
      const [statusText, finalUrl] = result.trim().split("\t");
      const status = Number(statusText);
      version = parseLatestReleaseUrl(finalUrl, repository);
      releaseUrl = status >= 200 && status < 400 ? finalUrl : null;
    } catch {}
    return retainReleaseSnapshot(previous, {
      repository,
      version,
      releaseUrl,
      error: `${error.name || "Error"}: official release asset metadata unavailable`,
    });
  }
}

async function readExchange(previousExchange) {
  const sourceUrl = "https://api.frankfurter.app/latest?from=USD&to=CNY,SGD";
  try {
    const body = await curlText(["-fLsS", "--connect-timeout", "8", "--max-time", "30", sourceUrl]);
    const data = JSON.parse(body);
    const valid = Number(data.rates?.CNY) > 0 && Number(data.rates?.SGD) > 0;
    if (!valid) throw new Error("invalid exchange response");
    return { state: "ok", date: data.date, base: "USD", rates: { CNY: data.rates.CNY, SGD: data.rates.SGD }, sourceUrl };
  } catch {
    return { ...previousExchange, state: "error", error: "暂时无法读取最新汇率；人民币参考价会明确标记为待核验" };
  }
}

async function readGamsgoOffer(item, previous, exchange) {
  const { parseOptions, ...publicItem } = item;
  const previousPublic = { ...(previous || {}) };
  delete previousPublic.parseOptions;
  try {
    const html = await curlText(["-fLsS", "--compressed", "--connect-timeout", "8", "--max-time", "30", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36", "-H", "Accept-Language: zh-CN,zh;q=0.9,en;q=0.7", item.url], 15 * 1024 * 1024);
    const parsed = parseGamsgoPrice(html, parseOptions);
    if (parsed?.conflict) {
      return {
        ...publicItem,
        state: "conflict",
        published: null,
        candidate: null,
        candidateSeenCount: 0,
        checkedAt: new Date().toISOString(),
        observedValues: parsed.observedValues,
        note: "同一公开页面出现多个互相冲突的月付价格，已隐藏数字并转入人工复核",
      };
    }
    if (!parsed || !validatePublicPrice(parsed.special, new URL(item.url).hostname)) {
      return { ...publicItem, ...decidePublishedPrice(previousPublic, null), checkedAt: new Date().toISOString(), note: "公开页未稳定展示可校验的月付价格" };
    }

    const decision = decidePublishedPrice(previousPublic, parsed.special);
    return {
      ...publicItem,
      ...decision,
      checkedAt: new Date().toISOString(),
      officialObserved: parsed.official || undefined,
      period: parsed.period,
      offerDurationMonths: parsed.offerDurationMonths || 1,
      cny: decision.published ? cnyValue(decision.published, exchange) : null,
      note: decision.state === "price-change-pending" ? "价格变化超过50%，等待下一次读取一致后发布" : `公开购买页${parsed.offerDurationMonths > 1 ? `${parsed.offerDurationMonths}个月方案折算的` : ""}月付起价；具体交付方式与结算价以下单页为准`,
    };
  } catch (error) {
    return { ...publicItem, ...decidePublishedPrice(previousPublic, null), checkedAt: new Date().toISOString(), error: error.name, note: "页面读取失败，隐藏具体数字并提示以购买页为准" };
  }
}

async function readArtificialAnalysisLeaderboard(previous) {
  const url = "https://artificialanalysis.ai/leaderboards/models";
  const checkedAt = new Date().toISOString();
  try {
    const html = await curlText(["-fLsS", "--compressed", "--connect-timeout", "8", "--max-time", "60", "-A", "Mozilla/5.0 DigitalToolsGuide-BenchmarkMonitor/1.0", url], 20 * 1024 * 1024);
    const rows = parseArtificialAnalysisLeaderboard(html).slice(0, 20);
    if (rows.length < 10 || new Set(rows.map((row) => row.model)).size !== rows.length) throw new Error("invalid leaderboard rows");
    return {
      source: "Artificial Analysis",
      url,
      state: "ok",
      checkedAt,
      lastSuccessfulAt: checkedAt,
      methodologyVersion: "Intelligence Index v4.1",
      rows,
    };
  } catch (error) {
    if (previous?.rows?.length >= 10) {
      return { ...previous, state: "stale", checkedAt, note: "本轮自动读取失败，当前展示上次成功快照", error: error.name };
    }
    return { source: "Artificial Analysis", url, state: "error", checkedAt, rows: [], note: "暂时无法读取榜单，页面不会发布可疑数字", error: error.name };
  }
}

let previousAutoSync = { exchange: null, gamsgo: [], history: [] };
try {
  previousAutoSync = JSON.parse(await readFile(autoSyncPath, "utf8"));
} catch {}

let previousSyncStatus = { clients: [] };
try {
  previousSyncStatus = JSON.parse(await readFile(syncStatusPath, "utf8"));
} catch {}

const exchange = await readExchange(previousAutoSync.exchange);
const catalogOfficialLinks = await loadCatalogOfficialLinks();
const subscriptionPurchaseLinks = await loadSubscriptionPurchaseLinks();
const allLinks = [...new Map([...staticLinks, ...catalogOfficialLinks, ...subscriptionPurchaseLinks, ...promotionLinks].map((item) => [item.url, item])).values()];
const [linkResults, clientResults, gamsgoResults, artificialAnalysisLeaderboard] = await Promise.all([
  mapWithConcurrency(allLinks, 12, checkLink),
  Promise.all(repositories.map((config) => checkRelease(config, previousSyncStatus.clients?.find((client) => client.repository === config.repository)))),
  Promise.all(gamsgoOffers.map((item) => readGamsgoOffer(item, previousAutoSync.gamsgo?.find((offer) => offer.slug === item.slug), exchange))),
  readArtificialAnalysisLeaderboard(previousAutoSync.artificialAnalysisLeaderboard),
]);

const checkedAt = new Date().toISOString();
const history = [...(previousAutoSync.history || [])];
for (const result of gamsgoResults) {
  const before = previousAutoSync.gamsgo?.find((offer) => offer.slug === result.slug)?.published;
  if (result.published && JSON.stringify(before) !== JSON.stringify(result.published)) {
    history.push({ changedAt: checkedAt, type: "gamsgo-price", slug: result.slug, before: before || null, after: result.published, sourceUrl: result.url });
  }
}

const previousTopModel = previousAutoSync.artificialAnalysisLeaderboard?.rows?.[0]?.model;
const currentTopModel = artificialAnalysisLeaderboard.rows?.[0]?.model;
if (currentTopModel && previousTopModel !== currentTopModel) {
  history.push({ changedAt: checkedAt, type: "artificial-analysis-leader", before: previousTopModel || null, after: currentTopModel, sourceUrl: artificialAnalysisLeaderboard.url });
}

const benchmarkResults = linkResults
  .filter((item) => item.kind === "benchmark")
  .map((item) => ({ source: item.id === "arena" ? "Arena" : "Artificial Analysis", url: item.url, state: item.state, checkedAt }));

const autoOutput = { checkedAt, exchange, gamsgo: gamsgoResults, benchmarks: benchmarkResults, artificialAnalysisLeaderboard, history: history.slice(-100) };
const statusOutput = {
  checkedAt,
  policy: { publicLinks: "automatic-6h", promotionTracking: "automatic-before-publish", clientReleases: "automatic-6h-with-direct-assets", publicPrices: "automatic-6h-with-guardrails", benchmarkLeaderboard: "automatic-6h-with-last-good-snapshot", exchange: "automatic-6h", loginRequiredPrices: "manual-review" },
  links: linkResults,
  clients: clientResults,
};

await mkdir(dataDirectory, { recursive: true });
await Promise.all([
  writeFile(new URL("../data/sync-status.json", import.meta.url), `${JSON.stringify(statusOutput, null, 2)}\n`, "utf8"),
  writeFile(autoSyncPath, `${JSON.stringify(autoOutput, null, 2)}\n`, "utf8"),
]);

const hardFailures = linkResults.filter((item) => item.state === "error").length + clientResults.filter((item) => item.state === "error").length;
const readablePrices = gamsgoResults.filter((item) => item.state === "ok" || item.state === "price-changed").length;
console.log(`同步完成：${linkResults.length} 个公开入口，${clientResults.length} 个客户端项目，${readablePrices}/${gamsgoResults.length} 项公开月付价格可核验，Artificial Analysis 读取 ${artificialAnalysisLeaderboard.rows?.length || 0} 个模型。`);
if (hardFailures > 0) console.warn(`${hardFailures} 个入口或客户端版本检查失败，页面会保留异常标记。`);
