# V18 证据图谱：生成、筛选与发布规范

更新日期：2026-08-11

## 目标

六张核心插图必须像同一套编辑系统，而不是六张互不相关的 AI 图片。共同语法为：深海军蓝仪器框、暖米白证据面、薄荷绿有效路径、淡蓝辅助测量、琥珀色只表示风险。所有图为 1536×1024、3:2、无品牌、无可读文字、无人物、无机器人。

## 共同生成提示

```text
Use case: infographic-diagram
Asset type: premium editorial website section illustration, landscape 3:2
Style reference: V18 subscription-choice master; preserve palette, line weight, frame, paper texture, calibrated geometry and restrained depth, but create a new composition.
Scene: warm ivory evidence field inside a precise midnight-navy instrument frame.
Style: exceptional editorial information design; refined technical atlas; flat-to-subtly-dimensional printed paper; engraved hairlines; calibration marks; evidence dots; restrained tactile depth.
Palette: midnight navy #0b2b45, warm ivory #f4f0e6, mint #78d9bd, pale blue #9bb8c8; amber #d6a85c only for risk.
Constraints: no readable text, letters, numbers, logos, trademarks, UI screenshots, people, faces, hands, robots, neural networks, watermarks or decorative gradients. Keep important content inside the central 84% and legible at 700px web width.
Avoid: paper-cut toy style, clay render, generic 3D cards, cartoon icons, bubbly rounded rectangles, excessive shadows, visual clutter and stock illustration language.
```

## 六张图的内容提示

- `subscription-choice-v3-refined.webp`：一份账号凭证分成本人账号充值、独立账号和共享使用三条路径；共享路径使用唯一的琥珀风险标记。账号身份只用校准圆环、密钥缺口和点阵表达，不使用人物头像。
- `official-downloads-v3.webp`：官方来源证明 → 来源与完整性检查 → 笔记本、台式机、平板、手机四类设备及对应文件。
- `model-benchmarks-v3.webp`：左侧匿名两两回答偏好，右侧把能力、输出速度、首段延迟和成本分开测量；两侧不得汇成一个总分。
- `ai-assistant-v3.webp`：对话、文档、资料检索、写作编辑、图片和音频六类输入汇入工作台，输出再通过独立复核节点。
- `media-apps-v3.webp`：长内容时间轴、实时公开讨论串、竖屏短内容序列三个并列舱，用时间尺度与格式区分，不使用平台标志。
- `network-journey-v3.webp`：设备 → 客户端 → 订阅配置 → 三个可选节点 → 目标服务；五个阶段必须看出不同职责。

## 定点修正

AI 工作台初稿的最终复核点误用了人物头像，只把该头像替换为抽象校验章。媒体节奏初稿的讨论串误用了五个人物头像，只把它们替换为不同的匿名几何来源标记。订阅图的账号凭证也去掉了人物轮廓，改为不可冒充真实身份的校准令牌。其余构图、路径、纹理和裁切保持不变。

## 生产门禁

- 源页面必须引用 V3 文件，重新引用同名 V2 旧图时停止发布。
- 每张图必须为 1536×1024 WebP，体积保持在 60–180KB。
- 替代文本必须描述图中流程，而不是写“精美插图”或重复图注。
- 3:2 头图不得裁掉主流程；网络图桌面端也必须完整保留仪器框和五段流程，不用超宽裁切换取视觉冲击。
- 发布前执行 `npm run verify:publish`，同时做桌面与 390px 手机实测。
