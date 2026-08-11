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

if (failures.length) {
  console.error("编辑质量门禁未通过：");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`编辑质量门禁通过：检查 ${editorialFiles.length} 个核心内容文件；人工资料复核日 ${manualReviewDate}。`);
