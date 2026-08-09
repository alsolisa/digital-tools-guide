import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const curl = process.platform === "win32" ? "curl.exe" : "curl";
const nullDevice = process.platform === "win32" ? "NUL" : "/dev/null";

async function remoteAssetIsReachable(url) {
  try {
    const { stdout } = await execFileAsync(curl, [
      "-fILsS",
      "--connect-timeout", "8",
      "--max-time", "45",
      "-A", "DigitalToolsGuide-Preflight/1.0",
      "-o", nullDevice,
      "-w", "%{http_code}",
      url,
    ], { encoding: "utf8", maxBuffer: 1024 * 1024 });
    const status = Number(stdout.trim());
    return status >= 200 && status < 400;
  } catch {
    return false;
  }
}

const root = new URL("../", import.meta.url);
const [syncStatus, autoSync, promotionManifest, localMirrors, subscriptionPricing, catalogSource] = await Promise.all([
  readFile(new URL("data/sync-status.json", root), "utf8").then(JSON.parse),
  readFile(new URL("data/auto-sync.json", root), "utf8").then(JSON.parse),
  readFile(new URL("data/promotion-links.json", root), "utf8").then(JSON.parse),
  readFile(new URL("data/local-mirrors.json", root), "utf8").then(JSON.parse),
  readFile(new URL("data/subscription-pricing.json", root), "utf8").then(JSON.parse),
  readFile(new URL("data/catalog.ts", root), "utf8"),
]);

const failures = [];
const syncTime = Date.parse(autoSync.checkedAt);
if (!Number.isFinite(syncTime) || Math.abs(Date.now() - syncTime) > 12 * 60 * 60 * 1000) {
  failures.push("自动核验数据不是最近12小时内生成，禁止发布");
}

let trustedPriceCount = 0;
for (const offer of autoSync.gamsgo || []) {
  if (["ok", "price-changed"].includes(offer.state) && offer.published) {
    trustedPriceCount += 1;
    continue;
  }
  if (offer.state === "stale" && offer.published) {
    const evidenceTime = Date.parse(offer.lastSuccessfulAt);
    if (!Number.isFinite(evidenceTime) || syncTime < evidenceTime || syncTime - evidenceTime > 7 * 24 * 60 * 60 * 1000) {
      failures.push(`${offer.slug} 的最近可信价格已超过7天`);
    } else {
      trustedPriceCount += 1;
    }
  }
}
if ((autoSync.gamsgo || []).length < 6) failures.push("订阅价格核验结果不完整");
if (trustedPriceCount < 4) failures.push(`仅 ${trustedPriceCount} 项订阅价格具有当前或7天内最近可信证据`);

const linkById = new Map(syncStatus.links.map((item) => [item.id, item]));
const promotionUrls = new Set(promotionManifest.links.map((item) => item.url));

for (const expected of promotionManifest.links) {
  const actual = linkById.get(expected.id);
  if (!actual) {
    failures.push(`缺少推广或关键入口核验结果：${expected.label}`);
    continue;
  }
  if (actual.url !== expected.url) failures.push(`${expected.label} 的核验地址与清单不一致`);
  if (actual.state === "error") failures.push(`${expected.label} 无法打开（${actual.status || "无状态码"}）`);
  if (expected.tracking && !["verified", "source-only"].includes(actual.trackingState)) {
    failures.push(`${expected.label} 的推广参数未保留`);
  }
}

for (const offer of Object.values(subscriptionPricing.offers || {})) {
  for (const option of offer.options || []) {
    if (!promotionUrls.has(option.url)) failures.push(`套餐购买地址未登记到推广清单：${option.url}`);
  }
}

for (const url of catalogSource.match(/https:\/\/www\.gamsgo\.com\/[^"\s]+\/partner\/(?:BTzCM|2MGZTK)/g) || []) {
  if (!promotionUrls.has(url)) failures.push(`商品卡片推广地址未登记到推广清单：${url}`);
}

for (const client of syncStatus.clients) {
  if (!["ok", "stale"].includes(client.state)) failures.push(`${client.repository} 最新版及可信快照均未通过核验`);
  if (client.state === "stale" && client.detectedVersion !== client.version) {
    failures.push(`${client.repository} 的可信快照版本与最新版本不一致`);
  }
  if (!client.assetName || !client.assetUrl || !client.assetSize || !/^[A-F0-9]{64}$/.test(client.assetSha256 || "")) {
    failures.push(`${client.repository} 缺少可直接下载的官方文件、大小或 SHA-256`);
  }
  if (!client.assetVerifiedAt || Number.isNaN(Date.parse(client.assetVerifiedAt))) {
    failures.push(`${client.repository} 缺少官方文件最近一次可信核验时间`);
  }
  if (client.assetUrl && !client.assetUrl.startsWith(`https://github.com/${client.repository}/releases/download/`)) {
    failures.push(`${client.repository} 的直接下载不是该项目官方 Release`);
  }
}

const remoteAssetChecks = await Promise.all(syncStatus.clients.map(async (client) => ({
  repository: client.repository,
  ok: client.assetUrl ? await remoteAssetIsReachable(client.assetUrl) : false,
})));
for (const result of remoteAssetChecks) {
  if (!result.ok) failures.push(`${result.repository} 的官方文件直链当前无法访问`);
}

for (const mirror of localMirrors) {
  const fileUrl = new URL(`public/mirror/${mirror.file}`, root);
  try {
    const fileInfo = await stat(fileUrl);
    if (fileInfo.size !== mirror.sizeBytes) failures.push(`${mirror.file} 文件大小与清单不一致`);
    const digest = createHash("sha256").update(await readFile(fileUrl)).digest("hex").toUpperCase();
    if (digest !== mirror.sha256) failures.push(`${mirror.file} 的 SHA-256 与清单不一致`);
    const current = syncStatus.clients.find((item) => item.repository === mirror.repository);
    if (current?.version === mirror.version && current.assetSha256 !== mirror.sha256) {
      failures.push(`${mirror.file} 与同版本官方 Release 的 SHA-256 不一致`);
    }
  } catch {
    failures.push(`缺少本站备用文件：${mirror.file}`);
  }
}

if (failures.length) {
  console.error("发布前检查未通过：");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`发布前检查通过：${promotionManifest.links.length} 个推广/关键入口、${syncStatus.clients.length} 个官方直链、${localMirrors.length} 个本站备用文件、${trustedPriceCount} 项当前或最近可信订阅价格均已核对。`);
