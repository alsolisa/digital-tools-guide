# V17 设计质量与发布门禁

更新日期：2026-08-11

研究依据：[`reference-study-v16.md`](./reference-study-v16.md)

## 设计命题

数字工具指南 V17 的原创母题是“证据档案”：复杂工具的入口、版本、价格和榜单不是装饰数字，而是一份能追溯来源、看见变化、据此行动的公开记录。

这不是 Apple、Stripe、Linear 或任何获奖站的复刻。它把这些参考中与本站任务相符的原则——单一焦点、证据可视化、精准网格、连续叙事——重新组合成面向中文新手的轻量信息系统。

## 视觉规则

- 主色仍为深海军蓝、暖纸白和薄荷绿；新增极少量电光蓝用于“动态数据”，琥珀色只表示需要注意。
- 首页不再以通用 AI 纸艺图作为首屏主视觉；首屏使用真实状态、路径与坐标构成品牌图形。
- 标题以编辑型宋体负责“命题”，正文以系统无衬线负责“行动”；同一区域最多三个字号层级。
- 普通正文桌面端不低于 15px，手机端不低于 14px；所有可见辅助信息不低于 12px。更小字号只允许用于不承载语义的装饰标记。
- 圆角只区分容器层级，不给每个元素都加卡片；正文通过留白、分隔线和对齐形成节奏。
- 任何生成图都必须具有本站独占的坐标、校准、连接与证据隐喻，不使用泛化的机器人、发光大脑或随机 3D 图标。

## 信息架构规则

每个关键页面按以下顺序组织：

1. 这页能解决什么问题。
2. 当前证据与更新时间。
3. 用户如何缩小选择范围。
4. 具体数据、教程或下载。
5. 风险、来源和反馈入口。

首页每个视口章节只能承担一个主要问题；主要行动最多两个。三条核心路径必须在首屏可识别，但完整解释放到后续章节。

## 动效规则

- 动效必须帮助理解路径、层级、状态变化或操作结果；纯装饰动效删除。
- 常规反馈 160–220ms，章节进入 420–650ms；只动画 `transform` 与 `opacity`。
- 不接管滚轮，不隐藏系统光标，不默认播放音频，不要求用户拖拽才能获得核心内容。
- `prefers-reduced-motion: reduce` 下关闭循环、滚动进入和位移动效，信息不能因此缺失。

## 响应式与无障碍门禁

- 320、390、768、1024、1440px 五档不得产生页面级横向滚动。
- 390×844 首屏应完整显示主命题、说明和一个主操作；三条路径至少显示简要入口，不要求完整卡片全部露出。
- 一个页面只有一个 H1；标题顺序不能跳级造成结构误导。
- 文字与背景达到 WCAG 2.2 AA；可点击目标原则上不小于 44×44px。
- 键盘焦点始终可见；所有状态不能只靠颜色；装饰图使用空替代文本，内容图提供具体替代文本。
- 不依赖 hover、声音、精细拖拽或高性能 GPU 才能完成任务。

## 性能与发布门禁

- 首页保持静态优先，不为了动效引入客户端运行时或 WebGL。
- 首屏不自动播放视频；非关键图片延迟加载并提供明确尺寸。
- 发布前必须运行 `npm run verify:publish`。
- 发布构建必须通过安全扫描、文案与资料新鲜度门禁、lint、自动测试、静态导出和 GitHub Pages 页面测试。
- 自动价格、版本、榜单、推广入口和下载文件检查失败时，必须降级为诚实状态；不得将读取失败写成已核验。
- 实验室 Lighthouse 四项以 95 为最低门禁，但最终报告必须把它与真实 28 天 Core Web Vitals 分开。

## 社交分享图

最终文件：`public/og-evidence-ledger-v17.jpg`，1200×630，约 206KB。使用内置 ImageGen 一次生成，随后只做居中裁切、尺寸标准化与 JPEG 压缩；没有二次生成或局部重绘。

验收结果：三行中文逐字正确；缩略图仍能识别站名与主命题；档案、索引卡、校验戳和连续路径与 V17“证据档案”一致；没有品牌标志、人物、水印、通用机器人、霓虹或纸艺 3D 图标。

最终提示词：

```text
Use case: ads-marketing
Asset type: premium social preview card for a Chinese digital field-guide website, 1200×630 landscape
Primary request: create a distinctive editorial brand image for “数字工具指南”, built around the idea of checking evidence before choosing digital tools
Scene/backdrop: deep midnight-navy editorial research desk / evidence archive, flat frontal composition, with precise registration marks, a source ledger, three slim index cards, small verification stamps, file fingerprints, and one continuous mint route line connecting source → check → decision
Style/medium: world-class editorial art direction; tactile printmaking and technical cartography combined with clean modern interface precision; sophisticated, original, restrained; not 3D papercraft
Composition/framing: headline zone on the left, evidence archive composition on the right; excellent balance and strong readability at small thumbnail size
Lighting/mood: calm, trustworthy, human, quietly premium
Color palette: midnight navy, warm paper ivory, mint green, pale electric blue, one restrained amber accent
Text (verbatim): “数字工具指南” and “先查清楚，再决定” and “网络服务 · AI 与应用 · 模型评测”
Typography: render every Chinese character exactly once and verbatim; confident high-contrast Chinese serif for the main line, restrained sans serif for the category line
Constraints: no extra text, no misspelled Chinese, no logos, no watermark, no Apple/Stripe/Linear imitation, no generic AI robot, no chatbot bubbles, no glowing orb, no neon cyberpunk, no glassmorphism, no paper-cut 3D, no decorative gradients; the visual system must feel proprietary to an evidence-first digital guide
```

## 严格验收问题

- 删除品牌名称后，是否仍能凭坐标、校验点和排版识别本站？
- 每一屏是否推进了一个明确决定？
- 重要来源、时间、状态是否比装饰更醒目？
- 手机用户是否能比 V15 更快到达真实内容？
- 动效关闭后是否仍完整、清楚？
- 每一个“当前”“已核验”“直接下载”是否都有可追溯证据？

只要其中任何一项不能肯定回答，就不能声称达到 V17 当前质量门禁。
