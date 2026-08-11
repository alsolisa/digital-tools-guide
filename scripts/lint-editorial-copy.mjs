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
if (!layout.includes("og-evidence-ledger-v17.jpg")) failures.push("社交分享元数据没有使用 V17 证据档案图");
const og = await stat(path.join(root, "public/og-evidence-ledger-v17.jpg")).catch(() => null);
if (!og || og.size < 100_000) failures.push("V17 社交分享图缺失或文件异常");

const css = await readFile(path.join(root, "app/award-system.css"), "utf8");
if (!css.includes("V17 — evidence ledger") || !css.includes("[class] small")) failures.push("V17 视觉系统或小字号保护规则缺失");

if (failures.length) {
  console.error("编辑质量门禁未通过：");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`编辑质量门禁通过：检查 ${editorialFiles.length} 个核心内容文件；人工资料复核日 ${manualReviewDate}。`);
