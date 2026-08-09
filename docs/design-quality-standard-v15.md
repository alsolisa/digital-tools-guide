# V15 设计质量与发布门禁

更新日期：2026-08-09

## 设计目标

数字工具指南采用原创的高端编辑型视觉系统：暖纸色背景、深海军蓝信息层、薄荷绿行动色、宋体标题与系统无衬线正文。设计服务于理解，不复制 Apple、Awwwards 获奖站或任何现成品牌布局。

## 不可回退的质量门禁

- 首页移动端与桌面端 Lighthouse 四项分数均不低于 95：Performance、Accessibility、Best Practices、SEO。
- 首页必须保持静态优先：只加载一份关键样式，不加载 React hydration 运行时；JSON-LD 结构化数据必须保留。
- 320、390、768、1440 像素四档不得产生页面级横向滚动。
- 每个公开页面必须只有一个 H1；图片必须有合适的替代文本或明确标记为装饰图。
- 键盘焦点可见，支持 `prefers-reduced-motion`，关键操作目标不小于 44 像素；正文内联链接按 WCAG 例外处理。
- 发布前必须运行 `npm run verify:publish`，任何价格冲突、下载来源越权、推广入口失效或构建失败都阻止发布。
- 不能把自动抓取失败写成“已核验”；不能用历史价格冒充当前价格。

## 社交分享图

最终文件：`public/og-award-v2.jpg`，1200×630，内置 ImageGen 生成后裁切并压缩。

最终提示词：

```text
Use case: ads-marketing
Asset type: premium landscape social-preview card for the Chinese website “数字工具指南”, 3:2 composition suitable for link unfurls
Primary request: Create one complete, highly polished editorial brand image that matches a high-end Chinese digital guide website. It should feel calm, trustworthy, intelligent and contemporary, with strong art direction and generous negative space. Do not imitate any specific company or copyrighted website.
Scene/backdrop: deep midnight navy architectural space with subtle warm off-white paper texture, fine grid points and restrained luminous mint-green paths connecting three abstract destinations
Subject: a refined tactile paper-cut / soft 3D composition representing three topics—network routes and devices, an AI assistant and documents, and model benchmarking charts—unified into one elegant visual system; no brand logos
Style/medium: premium editorial design, tactile paper relief, precise Swiss-inspired composition, cinematic but restrained, museum-catalog quality
Composition/framing: landscape; text block clear on the left; distinctive connected visual system on the right; generous safe margins for social cropping
Lighting/mood: soft directional studio light, subtle depth, calm confidence, no dramatic glare
Color palette: midnight navy #08283E, deep ink #10283B, luminous mint #7DE0C0, warm paper #F5F3ED, tiny restrained amber accents
Text (verbatim): “数字工具指南”
Text (verbatim): “复杂的数字工具，先看懂，再决定。”
Text (verbatim): “网络服务 · AI与应用 · 模型评测”
Typography: elegant high-contrast Chinese editorial typography; all Chinese text must be rendered exactly, legibly and without invented characters
Constraints: complete final social card, coherent hierarchy, excellent mobile-thumbnail readability, no logos, no UI mockup frames, no people, no watermark
Avoid: Apple logos, copied Apple layouts, excessive glassmorphism, neon cyberpunk, clutter, illegible tiny text, random English, extra text, misspelled Chinese
```

## 评价边界

Lighthouse 是实验室测试，不等同于真实用户 28 天的 Core Web Vitals 数据；“获奖级目标”也不等同于已经获得外部评委奖项。上线后的真实访问数据和外部评审仍需单独验证。
