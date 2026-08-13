import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const editorialFiles = [
  "app/page.tsx",
  "app/layout.tsx",
  "app/ai/page.tsx",
  "app/apps/page.tsx",
  "app/downloads/page.tsx",
  "app/subscriptions/page.tsx",
  "app/benchmarks/page.tsx",
  "data/editorial-guides.ts",
];

const forbidden = [
  { pattern: /赋能|颠覆|一站式|无缝衔接|极致体验|海量资源|轻松实现|智能升级/g, reason: "空泛营销词" },
  { pattern: /打开我的推广购买页|推广入口已自动核验|推广码已保留/g, reason: "面向内部的推广核验文案" },
  { pattern: /最高可节省\s*85%|1000\s*万\+|7\s*年数字订阅服务经验/g, reason: "脱离上下文的商家宣传数字" },
  { pattern: /原创纸艺插画|原创插画\s*·/g, reason: "只强调制作方式、没有帮助读者理解内容的图注" },
];

const failures = [];

function readJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > buffer.length) return null;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) return null;
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) };
    }
    offset += length;
  }
  return null;
}

function readWebpDimensions(buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") return null;
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const type = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (data + size > buffer.length) return null;
    if (type === "VP8X" && size >= 10) {
      return { width: 1 + buffer.readUIntLE(data + 4, 3), height: 1 + buffer.readUIntLE(data + 7, 3) };
    }
    if (type === "VP8 " && size >= 10 && buffer[data + 3] === 0x9d && buffer[data + 4] === 0x01 && buffer[data + 5] === 0x2a) {
      return { width: buffer.readUInt16LE(data + 6) & 0x3fff, height: buffer.readUInt16LE(data + 8) & 0x3fff };
    }
    if (type === "VP8L" && size >= 5 && buffer[data] === 0x2f) {
      const b1 = buffer[data + 1];
      const b2 = buffer[data + 2];
      const b3 = buffer[data + 3];
      const b4 = buffer[data + 4];
      return { width: 1 + b1 + ((b2 & 0x3f) << 8), height: 1 + ((b2 & 0xc0) >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10) };
    }
    offset = data + size + (size % 2);
  }
  return null;
}

for (const relative of editorialFiles) {
  const source = await readFile(path.join(root, relative), "utf8");
  for (const rule of forbidden) {
    for (const match of source.matchAll(rule.pattern)) {
      const line = source.slice(0, match.index).split("\n").length;
      failures.push(`${relative}:${line} ${rule.reason}：${match[0]}`);
    }
  }
}

const catalog = await readFile(path.join(root, "data/catalog.ts"), "utf8");
const manualReviewDate = catalog.match(/const checkedAt = "(\d{4}-\d{2}-\d{2})"/)?.[1];
if (!manualReviewDate) {
  failures.push("data/catalog.ts 缺少人工资料复核日期");
} else {
  const ageDays = Math.floor((Date.now() - Date.parse(`${manualReviewDate}T00:00:00+08:00`)) / 86_400_000);
  if (ageDays < 0 || ageDays > 45) failures.push(`人工编辑资料已 ${ageDays} 天未复核；发布上限为 45 天`);
}

const home = await readFile(path.join(root, "app/page.tsx"), "utf8");
for (const oldArtwork of ["network-journey-home-v2", "ai-assistant-home-v2", "model-benchmarks-home-v2"]) {
  if (home.includes(oldArtwork)) failures.push(`首页仍在使用重复的旧路线插画：${oldArtwork}`);
}
if (!home.includes("程序负责盯变化") || !home.includes("每 6 小时")) failures.push("首页没有清楚区分自动检查与人工判断");

const evidenceArtwork = [
  ["app/page.tsx", "network-journey-v3.webp", "network-journey-v2.webp"],
  ["app/subscriptions/page.tsx", "subscription-choice-v3-refined.webp", "subscription-choice-v2.webp"],
  ["app/ai/page.tsx", "ai-assistant-v3.webp", "ai-assistant-v2.webp"],
  ["app/apps/page.tsx", "media-apps-v3.webp", "media-apps-v2.webp"],
  ["app/downloads/page.tsx", "official-downloads-v3.webp", "official-downloads-v2.webp"],
  ["app/benchmarks/page.tsx", "model-benchmarks-v3.webp", "model-benchmarks-v2.webp"],
];

for (const [sourceRelative, artworkName, oldArtworkName] of evidenceArtwork) {
  const source = await readFile(path.join(root, sourceRelative), "utf8");
  if (!source.includes(artworkName)) failures.push(`${sourceRelative} 没有引用统一的 V18 证据图谱：${artworkName}`);
  if (source.includes(oldArtworkName)) failures.push(`${sourceRelative} 仍在引用旧纸艺插图：${oldArtworkName}`);
  const artworkPath = path.join(root, "public", "illustrations", artworkName);
  const artwork = await stat(artworkPath).catch(() => null);
  if (!artwork || artwork.size < 60_000 || artwork.size > 180_000) {
    failures.push(`${artworkName} 缺失或体积不在 60–180KB 门禁内`);
    continue;
  }
  const dimensions = readWebpDimensions(await readFile(artworkPath));
  if (!dimensions || dimensions.width !== 1536 || dimensions.height !== 1024) {
    failures.push(`${artworkName} 必须为 1536×1024，当前为 ${dimensions ? `${dimensions.width}×${dimensions.height}` : "无法读取"}`);
  }
}

const layout = await readFile(path.join(root, "app/layout.tsx"), "utf8");
const ogRelative = "public/og-evidence-ledger-v17-refined.jpg";
if (!layout.includes(path.basename(ogRelative))) failures.push("社交分享元数据没有使用 V17 精修证据档案图");
const ogPath = path.join(root, ogRelative);
const og = await stat(ogPath).catch(() => null);
if (!og || og.size < 100_000 || og.size > 400_000) {
  failures.push("V17 精修社交分享图缺失或体积不在 100–400KB 门禁内");
} else {
  const dimensions = readJpegDimensions(await readFile(ogPath));
  if (!dimensions || dimensions.width !== 1200 || dimensions.height !== 630) {
    failures.push(`V17 精修社交分享图必须为 1200×630，当前为 ${dimensions ? `${dimensions.width}×${dimensions.height}` : "无法读取"}`);
  }
}

const css = await readFile(path.join(root, "app/award-system.css"), "utf8");
if (!css.includes("V17 — evidence ledger") || !css.includes("[class] small")) failures.push("V17 视觉系统或小字号保护规则缺失");
if (!css.includes("V18 — evidence atlas") || !css.includes("grid-template-columns: repeat(4, minmax(0, 1fr))")) failures.push("V18 统一插图系统或手机端 AI 导航修复缺失");

if (failures.length) {
  console.error("编辑质量门禁未通过：");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`编辑质量门禁通过：检查 ${editorialFiles.length} 个核心内容文件、${evidenceArtwork.length} 张 V18 证据图谱；人工资料复核日 ${manualReviewDate}。`);
