import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { cnyValue, decidePublishedPrice, isAllowedOfficialDownload, parseGamsgoPrice, validatePublicPrice } from "./sync-utils.mjs";

const execFileAsync = promisify(execFile);
const curl = process.platform === "win32" ? "curl.exe" : "curl";
const nullDevice = process.platform === "win32" ? "NUL" : "/dev/null";
const dataDirectory = new URL("../data/", import.meta.url);
const autoSyncPath = new URL("../data/auto-sync.json", import.meta.url);

const links = [
  { id: "westdata", url: "https://wd-gold.net/aff.php?aff=15433", kind: "affiliate" },
  { id: "youtu-client", url: "https://d.yoututz.top/ph/youtu", kind: "client" },
  { id: "youtu", url: "https://777.youtu6.shop/register?code=2tr1tmSh", kind: "affiliate" },
  { id: "boostnet", url: "https://999.boostnet1.com/register?code=3QtbFZIf", kind: "affiliate" },
  { id: "wgetcloud", url: "https://wgetcloud.ltd/", kind: "official" },
  { id: "nexitally-docs", url: "https://nexitally-1.gitbook.io/nexitally-wen-dang-zhong-xin", kind: "official" },
  { id: "tag", url: "https://tagss.pro/", kind: "official" },
  { id: "surge", url: "https://nssurge.com/", kind: "client" },
  { id: "gamsgo", url: "https://www.gamsgo.com/partner/BTzCM", kind: "affiliate" },
  { id: "arena", url: "https://arena.ai/leaderboard/text", kind: "benchmark" },
  { id: "artificial-analysis", url: "https://artificialanalysis.ai/", kind: "benchmark" },
  { id: "chatgpt-download", url: "https://chatgpt.com/download/", kind: "download" },
  { id: "claude-download", url: "https://claude.ai/download", kind: "download" },
  { id: "gemini-web", url: "https://gemini.google.com/", kind: "download" },
  { id: "grok-web", url: "https://grok.com/", kind: "download" },
  { id: "perplexity-platforms", url: "https://www.perplexity.ai/platforms", kind: "download" },
];

const gamsgoOffers = [
  { slug: "chatgpt-recharge", url: "https://www.gamsgo.com/details/chatgpt-recharge" },
  { slug: "claude", url: "https://www.gamsgo.com/details/claude" },
  { slug: "gemini", url: "https://www.gamsgo.com/details/gemini" },
  { slug: "grok", url: "https://www.gamsgo.com/details/grok" },
  { slug: "perplexity", url: "https://www.gamsgo.com/details/Perplexity_AI" },
  { slug: "midjourney", url: "https://www.gamsgo.com/details/midjourney_official/partner/2MGZTK" },
];

const repositories = ["clash-verge-rev/clash-verge-rev", "2dust/v2rayN", "chen08209/FlClash", "hiddify/hiddify-app"];

async function loadCatalogOfficialLinks() {
  const source = await readFile(new URL("../data/catalog.ts", import.meta.url), "utf8");
  const urls = [...source.matchAll(/(?:url|officialUrl):\s*"(https?:\/\/[^"\s]+)"/g)].map((match) => match[1]);
  return [...new Set(urls)]
    .filter((url) => isAllowedOfficialDownload(url))
    .map((url, index) => ({ id: `catalog-official-${index + 1}`, url, kind: "download-source" }));
}

async function curlText(args, maxBuffer = 5 * 1024 * 1024) {
  const { stdout } = await execFileAsync(curl, args, { encoding: "utf8", timeout: 35_000, maxBuffer });
  return stdout;
}

async function checkLink(item) {
  try {
    const result = await curlText(["-L", "--connect-timeout", "8", "--max-time", "30", "-A", "DigitalToolsGuide-LinkMonitor/1.0", "-o", nullDevice, "-sS", "-w", "%{http_code}\t%{url_effective}", item.url]);
    const [statusText, finalUrl] = result.trim().split("\t");
    const status = Number(statusText);
    const protectedPage = [401, 403, 429].includes(status);
    return { ...item, state: status >= 200 && status < 400 ? "ok" : protectedPage ? "protected" : "error", status, finalUrl };
  } catch (error) {
    return { ...item, state: "error", status: null, finalUrl: null, error: error.name };
  }
}

async function checkRelease(repository) {
  try {
    const body = await curlText(["-fLsS", "--connect-timeout", "8", "--max-time", "30", "-A", "DigitalToolsGuide-ReleaseMonitor/1.0", "-H", "Accept: application/vnd.github+json", `https://api.github.com/repos/${repository}/releases/latest`]);
    const release = JSON.parse(body);
    return { repository, state: "ok", version: release.tag_name, releaseUrl: release.html_url };
  } catch (error) {
    return { repository, state: "error", error: error.name };
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
  try {
    const html = await curlText(["-fLsS", "--compressed", "--connect-timeout", "8", "--max-time", "30", "-A", "Mozilla/5.0 DigitalToolsGuide-PriceMonitor/1.0", item.url], 15 * 1024 * 1024);
    const parsed = parseGamsgoPrice(html);
    if (!parsed || !validatePublicPrice(parsed.special, new URL(item.url).hostname)) {
      return { ...item, ...decidePublishedPrice(previous, null), checkedAt: new Date().toISOString(), note: "公开页未稳定展示可校验的月付价格" };
    }

    const decision = decidePublishedPrice(previous, parsed.special);
    return {
      ...item,
      ...decision,
      checkedAt: new Date().toISOString(),
      officialObserved: parsed.official,
      period: parsed.period,
      cny: decision.published ? cnyValue(decision.published, exchange) : null,
      note: decision.state === "price-change-pending" ? "价格变化超过50%，等待下一次读取一致后发布" : "公开购买页月付起价；具体交付方式与结算价以下单页为准",
    };
  } catch (error) {
    return { ...item, ...decidePublishedPrice(previous, null), checkedAt: new Date().toISOString(), error: error.name, note: "页面读取失败，隐藏具体数字并提示以购买页为准" };
  }
}

let previousAutoSync = { exchange: null, gamsgo: [], history: [] };
try {
  previousAutoSync = JSON.parse(await readFile(autoSyncPath, "utf8"));
} catch {}

const exchange = await readExchange(previousAutoSync.exchange);
const catalogOfficialLinks = await loadCatalogOfficialLinks();
const allLinks = [...new Map([...links, ...catalogOfficialLinks].map((item) => [item.url, item])).values()];
const [linkResults, clientResults, gamsgoResults] = await Promise.all([
  Promise.all(allLinks.map(checkLink)),
  Promise.all(repositories.map(checkRelease)),
  Promise.all(gamsgoOffers.map((item) => readGamsgoOffer(item, previousAutoSync.gamsgo?.find((offer) => offer.slug === item.slug), exchange))),
]);

const checkedAt = new Date().toISOString();
const history = [...(previousAutoSync.history || [])];
for (const result of gamsgoResults) {
  const before = previousAutoSync.gamsgo?.find((offer) => offer.slug === result.slug)?.published;
  if (result.published && JSON.stringify(before) !== JSON.stringify(result.published)) {
    history.push({ changedAt: checkedAt, type: "gamsgo-price", slug: result.slug, before: before || null, after: result.published, sourceUrl: result.url });
  }
}

const benchmarkResults = linkResults
  .filter((item) => item.kind === "benchmark")
  .map((item) => ({ source: item.id === "arena" ? "Arena" : "Artificial Analysis", url: item.url, state: item.state, checkedAt }));

const autoOutput = { checkedAt, exchange, gamsgo: gamsgoResults, benchmarks: benchmarkResults, history: history.slice(-100) };
const statusOutput = {
  checkedAt,
  policy: { publicLinks: "automatic-6h", clientReleases: "automatic-6h", publicPrices: "automatic-6h-with-guardrails", exchange: "automatic-6h", loginRequiredPrices: "manual-review" },
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
console.log(`同步完成：${linkResults.length} 个公开入口，${clientResults.length} 个客户端项目，${readablePrices}/${gamsgoResults.length} 项公开月付价格可核验。`);
if (hardFailures > 0) console.warn(`${hardFailures} 个入口或客户端版本检查失败，页面会保留异常标记。`);
