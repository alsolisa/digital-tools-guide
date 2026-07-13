import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "design-assets", "v3-editorial-system");
await mkdir(outDir, { recursive: true });

const products = [
  ["chatgpt", "ChatGPT", "OpenAI", "chatgpt.com"],
  ["claude", "Claude", "Anthropic", "claude.ai"],
  ["gemini", "Gemini", "Google", "gemini.google.com"],
  ["grok", "Grok", "xAI", "grok.com"],
  ["perplexity", "Perplexity", "Perplexity AI", "perplexity.ai"],
];

const icons = Object.fromEntries(await Promise.all(products.map(async ([slug]) => {
  const bytes = await readFile(path.join(root, "public", "brands", `${slug}.jpg`));
  return [slug, bytes.toString("base64")];
})));

const sharedDefs = `<defs>
  <filter id="paper" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="7" result="noise"/>
    <feColorMatrix in="noise" type="saturate" values="0" result="gray"/>
    <feComponentTransfer in="gray" result="faded"><feFuncA type="table" tableValues="0 0.025"/></feComponentTransfer>
    <feBlend in="SourceGraphic" in2="faded" mode="multiply"/>
  </filter>
  <style>
    .sans{font-family:"Noto Sans SC","Microsoft YaHei",sans-serif}
    .serif{font-family:"Noto Serif SC","SimSun",serif}
    .latin{font-family:Arial,"Noto Sans SC",sans-serif}
  </style>
</defs>`;

const brandHeader = `<g transform="translate(72 54)">
  <circle cx="31" cy="31" r="31" fill="#102f42"/>
  <text x="31" y="41" text-anchor="middle" class="serif" font-size="25" font-weight="800" fill="#fff">数</text>
  <text x="79" y="26" class="sans" font-size="23" font-weight="800" fill="#102f42">数字工具指南</text>
  <text x="79" y="51" class="sans" font-size="13" font-weight="650" fill="#718087" letter-spacing="2">独立核验 · 小白友好</text>
</g>`;

const sourceMark = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">
  <circle cx="58" cy="58" r="55" fill="none" stroke="#102f42" stroke-width="2"/>
  <circle cx="58" cy="58" r="31" fill="none" stroke="#0b7b61" stroke-width="2"/>
  <line x1="58" y1="0" x2="58" y2="23" stroke="#102f42" stroke-width="2"/>
  <line x1="58" y1="93" x2="58" y2="116" stroke="#102f42" stroke-width="2"/>
  <line x1="0" y1="58" x2="23" y2="58" stroke="#102f42" stroke-width="2"/>
  <line x1="93" y1="58" x2="116" y2="58" stroke="#102f42" stroke-width="2"/>
  <circle cx="58" cy="58" r="13" fill="#0b7b61"/>
  <path d="M51 58l5 5 10-12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</g>`;

const cover = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  ${sharedDefs}
  <g filter="url(#paper)">
    <rect width="1080" height="1350" fill="#f4f0e7"/>
    <rect width="18" height="1350" fill="#0b7b61"/>
    ${brandHeader}
    <text x="1008" y="75" text-anchor="end" class="latin" font-size="13" font-weight="800" fill="#0b7b61" letter-spacing="2">EDITORIAL GUIDE / 01</text>
    <line x1="72" y1="150" x2="1008" y2="150" stroke="#c8c0b2"/>

    <text x="72" y="258" class="sans" font-size="16" font-weight="800" fill="#0b7b61" letter-spacing="3">官方下载 · 来源识别</text>
    ${sourceMark(820, 212, 1.18)}
    <text x="888" y="383" text-anchor="middle" class="latin" font-size="12" font-weight="800" fill="#102f42" letter-spacing="2">SOURCE VERIFIED</text>

    <text x="72" y="440" class="serif" font-size="82" font-weight="720" fill="#102f42">别从陌生链接</text>
    <text x="72" y="552" class="serif" font-size="82" font-weight="720" fill="#102f42">下载 AI 软件</text>
    <rect x="72" y="604" width="136" height="6" fill="#b58532"/>
    <text x="72" y="680" class="sans" font-size="24" font-weight="450" fill="#56666e">安全下载的关键，不是找到文件，</text>
    <text x="72" y="720" class="sans" font-size="24" font-weight="650" fill="#102f42">而是确认它来自谁。</text>

    <g transform="translate(72 858)">
      <line x1="0" y1="0" x2="936" y2="0" stroke="#c8c0b2"/>
      <g transform="translate(0 54)"><text class="latin" font-size="52" font-weight="700" fill="#102f42">05</text><text x="0" y="82" class="sans" font-size="15" font-weight="700" fill="#647178">常用 AI</text></g>
      <g transform="translate(306 54)"><text class="latin" font-size="52" font-weight="700" fill="#102f42">03</text><text x="0" y="82" class="sans" font-size="15" font-weight="700" fill="#647178">官方来源</text></g>
      <g transform="translate(612 54)"><text class="latin" font-size="52" font-weight="700" fill="#102f42">04</text><text x="0" y="82" class="sans" font-size="15" font-weight="700" fill="#647178">核验步骤</text></g>
      <line x1="0" y1="178" x2="936" y2="178" stroke="#c8c0b2"/>
    </g>

    <g transform="translate(72 1124)">
      <text x="0" y="0" class="sans" font-size="13" font-weight="800" fill="#0b7b61" letter-spacing="2">官方来源</text>
      <text x="0" y="45" class="latin" font-size="19" font-weight="700" fill="#102f42">WEBSITE</text>
      <text x="205" y="45" class="latin" font-size="19" font-weight="700" fill="#102f42">APP STORE</text>
      <text x="430" y="45" class="latin" font-size="19" font-weight="700" fill="#102f42">GOOGLE PLAY</text>
      <text x="936" y="45" text-anchor="end" class="latin" font-size="13" font-weight="800" fill="#b58532">DTG-DL-001</text>
    </g>
    <rect x="72" y="1248" width="936" height="50" fill="#dcece6"/>
    <rect x="72" y="1248" width="10" height="50" fill="#0b7b61"/>
    <text x="102" y="1280" class="sans" font-size="15" font-weight="800" fill="#102f42">资料核验 2026-07-13</text>
    <text x="978" y="1280" text-anchor="end" class="sans" font-size="14" font-weight="650" fill="#5e6e75">不保存账号、密码或付款信息</text>
  </g>
</svg>`;

const productRows = products.map(([slug, name, company, domain], index) => {
  const col = index % 2;
  const row = Math.floor(index / 2);
  const x = 72 + col * 468;
  const y = 340 + row * 150;
  return `<g transform="translate(${x} ${y})">
    <line x1="0" y1="0" x2="404" y2="0" stroke="#c8c0b2"/>
    <circle cx="43" cy="68" r="38" fill="#fffdfa" stroke="#d5cec0" stroke-width="2"/>
    <image href="data:image/jpeg;base64,${icons[slug]}" x="15" y="40" width="56" height="56" clip-path="url(#content-${slug})" preserveAspectRatio="xMidYMid slice"/>
    <clipPath id="content-${slug}"><circle cx="43" cy="68" r="28"/></clipPath>
    <text x="104" y="58" class="latin" font-size="22" font-weight="700" fill="#102f42">${name}</text>
    <text x="104" y="87" class="sans" font-size="14" font-weight="600" fill="#758087">${company}</text>
    <text x="404" y="72" text-anchor="end" class="latin" font-size="13" font-weight="700" fill="#0b7b61">${domain}</text>
  </g>`;
}).join("");

const checks = [
  ["01", "确认域名", "优先打开官网或官方帮助中心，不从搜索广告直接付款。"],
  ["02", "确认开发者", "商店中的开发者名称必须与产品公司一致。"],
  ["03", "确认设备", "Windows、Mac、Android 与 iPhone 安装包不能混用。"],
  ["04", "拒绝网盘包", "闭源软件不从群聊、网盘或陌生下载站安装。"],
].map(([number, title, copy], index) => {
  const y = 876 + index * 91;
  return `<g transform="translate(72 ${y})">
    <text x="0" y="27" class="latin" font-size="17" font-weight="800" fill="#b58532">${number}</text>
    <text x="62" y="27" class="sans" font-size="22" font-weight="800" fill="#102f42">${title}</text>
    <text x="254" y="27" class="sans" font-size="15" fill="#647178">${copy}</text>
    <line x1="0" y1="55" x2="936" y2="55" stroke="#d5cec0"/>
  </g>`;
}).join("");

const content = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  ${sharedDefs}
  <g filter="url(#paper)">
    <rect width="1080" height="1350" fill="#f4f0e7"/>
    <rect width="18" height="1350" fill="#0b7b61"/>
    ${brandHeader}
    <text x="1008" y="75" text-anchor="end" class="latin" font-size="13" font-weight="800" fill="#0b7b61" letter-spacing="2">CHECKLIST / 02</text>
    <line x1="72" y1="150" x2="1008" y2="150" stroke="#c8c0b2"/>
    <text x="72" y="230" class="serif" font-size="48" font-weight="720" fill="#102f42">先确认来源，再点击下载</text>
    <text x="72" y="280" class="sans" font-size="19" fill="#647178">产品名称相同，不代表下载页面和开发者一定可信。</text>
    ${sourceMark(900, 196, .72)}
    ${productRows}
    <g transform="translate(540 640)">
      <line x1="0" y1="0" x2="404" y2="0" stroke="#c8c0b2"/>
      <text x="0" y="42" class="latin" font-size="12" font-weight="800" fill="#0b7b61" letter-spacing="2">SOURCE RULE</text>
      <text x="0" y="78" class="sans" font-size="18" font-weight="800" fill="#102f42">只认可三类入口</text>
      <text x="0" y="112" class="latin" font-size="13" font-weight="700" fill="#647178">WEBSITE  ·  APP STORE  ·  GOOGLE PLAY</text>
    </g>
    <text x="72" y="825" class="sans" font-size="13" font-weight="800" fill="#0b7b61" letter-spacing="2">04 步核验</text>
    ${checks}
    <g transform="translate(72 1240)">
      <rect width="936" height="58" fill="#102f42"/>
      <circle cx="31" cy="29" r="14" fill="#0b7b61"/>
      <path d="M24 29l5 5 10-12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="58" y="36" class="sans" font-size="16" font-weight="800" fill="#fff">官网 · Apple App Store · Google Play</text>
      <text x="906" y="36" text-anchor="end" class="latin" font-size="13" font-weight="800" fill="#8fd4c1">DTG-DL-001</text>
    </g>
  </g>
</svg>`;

for (const [name, svg] of [["01-cover", cover], ["02-checklist", content]]) {
  const svgPath = path.join(outDir, `${name}.svg`);
  const pngPath = path.join(outDir, `${name}.png`);
  await writeFile(svgPath, svg, "utf8");
  await sharp(Buffer.from(svg)).png({ quality: 100 }).toFile(pngPath);
  console.log(pngPath);
}
