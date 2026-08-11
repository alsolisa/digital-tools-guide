# V16 设计质量与发布门禁

更新日期：2026-08-09

研究依据：[`reference-study-v16.md`](./reference-study-v16.md)

## 设计命题

数字工具指南 V16 的原创母题是“证据坐标系”：复杂工具像未知区域，官方来源提供坐标，自动检查提供校准点，清楚的下一步把用户带到目的地。

这不是 Apple、Stripe、Linear 或任何获奖站的复刻。它把这些参考中与本站任务相符的原则——单一焦点、证据可视化、精准网格、连续叙事——重新组合成面向中文新手的轻量信息系统。

## 视觉规则

- 主色仍为深海军蓝、暖纸白和薄荷绿；新增极少量电光蓝用于“动态数据”，琥珀色只表示需要注意。
- 首页不再以通用 AI 纸艺图作为首屏主视觉；首屏使用真实状态、路径与坐标构成品牌图形。
- 标题以编辑型宋体负责“命题”，正文以系统无衬线负责“行动”；同一区域最多三个字号层级。
- 普通正文桌面端不低于 15px，手机端不低于 14px；关键辅助信息不低于 11px。8–10px 仅允许用于非关键装饰序号且必须有更大的同义文本。
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
- 发布构建必须通过安全扫描、lint、自动测试、静态导出和 GitHub Pages 页面测试。
- 自动价格、版本、榜单、推广入口和下载文件检查失败时，必须降级为诚实状态；不得将读取失败写成已核验。
- 实验室 Lighthouse 四项以 95 为最低门禁，但最终报告必须把它与真实 28 天 Core Web Vitals 分开。

## 社交分享图

最终文件：`public/og-evidence-atlas-v16.jpg`，1200×630，105KB。内置 ImageGen 一次生成，随后只做等比例标准化与 JPEG 压缩；没有二次生成或局部重绘。

验收结果：三行中文正确；缩略图仍能识别站名与主命题；视觉与首页“证据坐标系”一致；没有品牌标志、人物、水印、通用机器人或纸艺图标。

最终提示词：

```text
Use case: website social preview / Open Graph image.
Create one finished premium 1200×630 landscape social card for the Chinese editorial website “数字工具指南”.

Art direction: original “evidence atlas” visual system. Deep midnight navy architectural field, subtle precise coordinate grid, thin calibration axes, three luminous evidence points connected by restrained mint-green and pale electric-blue paths, concentric measurement rings and small verification markers. It should feel like a museum-grade information design artifact: rigorous, calm, intelligent, high-trust, contemporary, distinctive, and clearly related to verification and decision-making. Flat editorial graphic with subtle dimensional light only; no generic paper-cut craft, no clay icons, no robot, no brain, no people, no device mockups, no brand logos.

Composition: generous safe margins. Left 54% is a strong, clean typography zone; right 46% contains the evidence-coordinate visual. Excellent hierarchy at small social-thumbnail size. High contrast and crisp edges. Do not imitate Apple, Stripe, Linear, Vercel, Awwwards winners, or any existing brand layout.

Render exactly these three Chinese text lines and no other visible text:
“数字工具指南”
“先找到证据，再做决定”
“网络服务 · AI与应用 · 模型评测”

Typography: elegant, highly legible Chinese editorial typography; render every Chinese character exactly with correct punctuation; no invented glyphs, no random English, no tiny text. The second line is the dominant headline. Warm off-white typography with the phrase “找到证据” accented in luminous mint.

Palette: midnight navy #071F32, deep ink #10283B, warm paper #F5F3ED, mint #8CE6C9, pale electric blue #7AC4F4; no neon cyberpunk saturation.

Output: complete final social card, no watermark, no border outside the canvas, no extra text, no UI chrome.
```

## 严格验收问题

- 删除品牌名称后，是否仍能凭坐标、校验点和排版识别本站？
- 每一屏是否推进了一个明确决定？
- 重要来源、时间、状态是否比装饰更醒目？
- 手机用户是否能比 V15 更快到达真实内容？
- 动效关闭后是否仍完整、清楚？
- 每一个“当前”“已核验”“直接下载”是否都有可追溯证据？

只要其中任何一项不能肯定回答，就不能声称达到 V16 最高质量目标。
