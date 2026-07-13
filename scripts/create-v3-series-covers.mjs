import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "design-assets", "v3-series");
await mkdir(outDir, { recursive: true });

const items = [
  { slug: "chatgpt", name: "ChatGPT", company: "OpenAI", domain: "chatgpt.com", issue: "AI TUTORIAL / 01", accent: "#0b7b61", title: "小白使用指南", subtitle: "官方下载 · 注册安装 · 套餐模型 · 隐私设置", chapters: ["官方入口", "注册与安装", "模型与套餐", "隐私设置", "常用提示词"] },
  { slug: "claude", name: "Claude", company: "Anthropic", domain: "claude.ai", issue: "AI TUTORIAL / 02", accent: "#c76847", title: "长文与写作指南", subtitle: "官方下载 · 账号地区 · 文档分析 · 隐私安全", chapters: ["官方入口", "注册与地区", "主流模型", "文档与写作", "隐私设置"] },
  { slug: "gemini", name: "Gemini", company: "Google", domain: "gemini.google.com", issue: "AI TUTORIAL / 03", accent: "#3f6fb5", title: "Google AI 使用指南", subtitle: "网页与App · Google账号 · 模型能力 · 数据授权", chapters: ["官方入口", "Google账号", "模型与套餐", "生态连接", "数据权限"] },
  { slug: "grok", name: "Grok", company: "xAI", domain: "grok.com", issue: "AI TUTORIAL / 04", accent: "#34495e", title: "实时信息使用指南", subtitle: "网页与App · X账号 · 实时搜索 · 图像与语音", chapters: ["官方入口", "账号与地区", "模型与套餐", "实时搜索", "账号安全"] },
  { slug: "perplexity", name: "Perplexity", company: "Perplexity AI", domain: "perplexity.ai", issue: "AI TUTORIAL / 05", accent: "#168f92", title: "带引用搜索指南", subtitle: "官方下载 · 来源核查 · 深度研究 · 文件分析", chapters: ["官方入口", "注册与安装", "引用核查", "研究模式", "隐私设置"] },
  { slug: "youtube", name: "YouTube", company: "Google", domain: "youtube.com", issue: "APP GUIDE / 01", accent: "#c4312f", title: "安装与使用指南", subtitle: "官方下载 · 注册登录 · 中文设置 · 账号安全", chapters: ["官方下载", "注册登录", "中文设置", "基础使用", "地区与安全"] },
  { slug: "x", name: "X", company: "X Corp.", domain: "x.com", issue: "APP GUIDE / 02", accent: "#34404a", title: "安装与使用指南", subtitle: "官方下载 · 注册登录 · 中文设置 · 账号安全", chapters: ["官方下载", "注册登录", "中文设置", "基础使用", "地区与安全"] },
  { slug: "tiktok", name: "TikTok", company: "TikTok Pte. Ltd.", domain: "tiktok.com", issue: "APP GUIDE / 03", accent: "#0d8c8d", title: "安装与使用指南", subtitle: "官方下载 · 账号地区 · 中文设置 · 隐私安全", chapters: ["官方下载", "注册登录", "中文设置", "基础使用", "地区与安全"] },
  { slug: "nodes", name: "机场与客户端", company: "网络服务新手指南", domain: "价格 · 流量 · 客户端", issue: "NETWORK GUIDE / 01", accent: "#0b7b61", title: "第一次使用指南", subtitle: "什么是机场 · 为什么要搭载客户端 · 如何保护订阅链接", chapters: ["机场是什么", "月付价格", "客户端搭载", "订阅链接安全", "大陆网络状态"], custom: "network" },
  { slug: "subscriptions", name: "AI 订阅", company: "第三方购买风险指南", domain: "账号 · 交付 · 隐私", issue: "SUBSCRIPTION / 01", accent: "#a87322", title: "购买前先看账号归属", subtitle: "官方价与商家价分开 · 推广关系公开 · 风险分级", chapters: ["官方价与商家价", "本人账号充值", "交付账号风险", "共享网页隐私", "续费与售后"], custom: "account" },
];

const imageCache = {};
for (const item of items.filter((item) => !item.custom)) {
  const bytes = await readFile(path.join(root, "public", "brands", `${item.slug}.jpg`));
  imageCache[item.slug] = bytes.toString("base64");
}

const customIcon = (kind, accent) => kind === "network"
  ? `<g transform="translate(72 228)"><circle cx="68" cy="68" r="66" fill="#fffdfa" stroke="#d5cec0" stroke-width="2"/><circle cx="68" cy="68" r="15" fill="${accent}"/><circle cx="30" cy="38" r="10" fill="#102f42"/><circle cx="106" cy="38" r="10" fill="#102f42"/><circle cx="30" cy="101" r="10" fill="#102f42"/><circle cx="106" cy="101" r="10" fill="#102f42"/><path d="M38 43l21 17M98 43L77 60M38 96l21-17M98 96L77 79" fill="none" stroke="#102f42" stroke-width="5" stroke-linecap="round"/></g>`
  : `<g transform="translate(72 228)"><circle cx="68" cy="68" r="66" fill="#fffdfa" stroke="#d5cec0" stroke-width="2"/><circle cx="68" cy="51" r="22" fill="none" stroke="#102f42" stroke-width="6"/><path d="M30 108c5-25 20-38 38-38s33 13 38 38" fill="none" stroke="#102f42" stroke-width="6" stroke-linecap="round"/><circle cx="103" cy="92" r="18" fill="${accent}"/><path d="M95 92l6 6 11-14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`;

const sourceMark = (accent) => `<g transform="translate(884 246)">
  <circle cx="54" cy="54" r="51" fill="none" stroke="#102f42" stroke-width="2"/>
  <circle cx="54" cy="54" r="28" fill="none" stroke="${accent}" stroke-width="2"/>
  <line x1="54" y1="0" x2="54" y2="20" stroke="#102f42" stroke-width="2"/><line x1="54" y1="88" x2="54" y2="108" stroke="#102f42" stroke-width="2"/>
  <line x1="0" y1="54" x2="20" y2="54" stroke="#102f42" stroke-width="2"/><line x1="88" y1="54" x2="108" y2="54" stroke="#102f42" stroke-width="2"/>
  <circle cx="54" cy="54" r="12" fill="${accent}"/><path d="M48 54l4 4 9-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</g>`;

function coverSvg(item) {
  const visual = item.custom
    ? customIcon(item.custom, item.accent)
    : `<g transform="translate(72 228)"><circle cx="68" cy="68" r="66" fill="#fffdfa" stroke="#d5cec0" stroke-width="2"/><image href="data:image/jpeg;base64,${imageCache[item.slug]}" x="20" y="20" width="96" height="96" clip-path="url(#productIcon)" preserveAspectRatio="xMidYMid slice"/><clipPath id="productIcon"><circle cx="68" cy="68" r="48"/></clipPath></g>`;
  const titleSize = item.name.length > 12 ? 58 : item.name.length > 9 ? 66 : 78;
  const chapterRows = item.chapters.map((chapter, index) => {
    const y = 882 + index * 72;
    return `<g transform="translate(72 ${y})"><text x="0" y="28" class="latin" font-size="15" font-weight="800" fill="${item.accent}">${String(index + 1).padStart(2, "0")}</text><text x="62" y="28" class="sans" font-size="21" font-weight="750" fill="#102f42">${chapter}</text><line x1="0" y1="51" x2="936" y2="51" stroke="#d5cec0"/></g>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
    <defs><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="11" result="noise"/><feColorMatrix in="noise" type="saturate" values="0" result="gray"/><feComponentTransfer in="gray" result="fade"><feFuncA type="table" tableValues="0 0.022"/></feComponentTransfer><feBlend in="SourceGraphic" in2="fade" mode="multiply"/></filter><style>.sans{font-family:"Noto Sans SC","Microsoft YaHei",sans-serif}.serif{font-family:"Noto Serif SC","SimSun",serif}.latin{font-family:Arial,"Noto Sans SC",sans-serif}</style></defs>
    <g filter="url(#paper)">
      <rect width="1080" height="1350" fill="#f4f0e7"/><rect width="18" height="1350" fill="${item.accent}"/>
      <g transform="translate(72 54)"><circle cx="31" cy="31" r="31" fill="#102f42"/><text x="31" y="41" text-anchor="middle" class="serif" font-size="25" font-weight="800" fill="#fff">数</text><text x="79" y="26" class="sans" font-size="23" font-weight="800" fill="#102f42">数字工具指南</text><text x="79" y="51" class="sans" font-size="13" font-weight="650" fill="#718087" letter-spacing="2">独立核验 · 小白友好</text></g>
      <text x="1008" y="75" text-anchor="end" class="latin" font-size="13" font-weight="800" fill="${item.accent}" letter-spacing="2">${item.issue}</text><line x1="72" y1="150" x2="1008" y2="150" stroke="#c8c0b2"/>
      ${visual}${sourceMark(item.accent)}
      <text x="72" y="410" class="latin" font-size="15" font-weight="800" fill="${item.accent}" letter-spacing="2">OFFICIAL SOURCE · VERIFIED GUIDE</text>
      <text x="72" y="515" class="${item.custom ? "serif" : "latin"}" font-size="${titleSize}" font-weight="750" fill="#102f42">${item.name}</text>
      <text x="72" y="610" class="serif" font-size="54" font-weight="700" fill="#102f42">${item.title}</text>
      <rect x="72" y="654" width="122" height="6" fill="${item.accent}"/><text x="72" y="714" class="sans" font-size="20" fill="#5b6a71">${item.subtitle}</text>
      <g transform="translate(72 774)"><text class="sans" font-size="13" font-weight="800" fill="${item.accent}" letter-spacing="2">官方识别</text><text x="190" class="sans" font-size="14" font-weight="700" fill="#102f42">${item.company}</text><text x="936" text-anchor="end" class="latin" font-size="14" font-weight="700" fill="#102f42">${item.domain}</text><line x1="0" y1="32" x2="936" y2="32" stroke="#c8c0b2"/></g>
      ${chapterRows}
      <rect x="72" y="1270" width="936" height="28" fill="#dcece6"/><rect x="72" y="1270" width="9" height="28" fill="${item.accent}"/><text x="98" y="1290" class="latin" font-size="11" font-weight="800" fill="#102f42">DTG-${item.issue.split("/")[0].trim().replaceAll(" ", "-")}-${item.issue.split("/")[1].trim()}</text><text x="986" y="1290" text-anchor="end" class="sans" font-size="11" font-weight="700" fill="#5d6d74">资料核验 2026-07-13</text>
    </g>
  </svg>`;
}

for (const item of items) {
  const svg = coverSvg(item);
  const svgPath = path.join(outDir, `${item.slug}.svg`);
  const pngPath = path.join(outDir, `${item.slug}.png`);
  await writeFile(svgPath, svg, "utf8");
  await sharp(Buffer.from(svg)).png({ quality: 100 }).toFile(pngPath);
  console.log(pngPath);
}

const previews = await Promise.all(items.map(async (item, index) => ({
  input: await sharp(path.join(outDir, `${item.slug}.png`)).resize(194, 243, { fit: "fill" }).png().toBuffer(),
  left: 17 + (index % 5) * 210,
  top: 17 + Math.floor(index / 5) * 259,
})));
await sharp({ create: { width: 1080, height: 535, channels: 4, background: "#102f42" } })
  .composite(previews)
  .png()
  .toFile(path.join(outDir, "contact-sheet.png"));
