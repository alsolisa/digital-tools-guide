import autoSync from "./auto-sync.json";

export type Platform = "Web" | "Windows" | "macOS" | "Android" | "iOS";
export type VerificationStatus = "verified" | "automatic" | "pending" | "error" | "paused";
export type RiskLevel = "low" | "medium" | "high";

export interface DownloadLink {
  platform: Platform;
  label: string;
  url: string;
  source: "official" | "app-store" | "google-play" | "microsoft-store";
  status: VerificationStatus;
  verifiedAt: string;
}

export interface ModelProfile {
  name: string;
  availability: string;
  context: string;
  inputs: string[];
  note: string;
}

export interface BenchmarkSnapshot {
  source: "Arena" | "Artificial Analysis";
  url: string;
  scope: string;
  summary: string;
  verifiedAt: string;
}

export interface ProductProfile {
  slug: string;
  name: string;
  company: string;
  mark: string;
  tone: string;
  tagline: string;
  summary: string;
  bestFor: string[];
  notFor: string[];
  strengths: string[];
  limitations: string[];
  capabilities: string[];
  models: ModelProfile[];
  downloads: DownloadLink[];
  officialSources: { label: string; url: string }[];
  benchmarks: BenchmarkSnapshot[];
  setupSteps: string[];
  prompts: { title: string; text: string }[];
  privacy: string[];
  regionNote: string;
  verifiedAt: string;
}

export interface SubscriptionOffer {
  slug: string;
  name: string;
  productSlug: string;
  mark: string;
  useCase: string;
  officialPrice: string;
  officialCny: string;
  gamsgoPrice: string;
  gamsgoCny: string;
  priceNote: string;
  deliveryType: "本人账号充值" | "独立账号交付" | "共享网页使用" | "多种方式";
  risk: RiskLevel;
  riskLabel: string;
  ownership: string;
  privacy: string;
  renewal: string;
  support: string;
  payment: string;
  region: string;
  sourceUrl: string;
  affiliateUrl: string;
  verifiedAt: string;
}

export interface AppProfile {
  slug: string;
  name: string;
  company: string;
  mark: string;
  tagline: string;
  summary: string;
  downloads: DownloadLink[];
  setupSteps: string[];
  languageSteps: string[];
  safety: string[];
  regionNote: string;
  officialSources: { label: string; url: string }[];
  verifiedAt: string;
}

const checkedAt = "2026-07-13";

export const aiProducts: ProductProfile[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    company: "OpenAI",
    mark: "C",
    tone: "green",
    tagline: "覆盖写作、学习、图片、文件和编程的综合型 AI 助手",
    summary: "适合作为大多数人的第一款 AI。它能解释问题、整理文件、生成图片、进行语音对话，也能处理较复杂的研究和编程任务。",
    bestFor: ["日常问答与学习", "写作、翻译和办公", "图片与文件分析", "编程与复杂任务"],
    notFor: ["要求答案绝对正确且无需核实", "把 Plus 会员当作 API 额度", "输入不应上传的机密资料"],
    strengths: ["功能覆盖面广", "网页和多平台客户端完整", "语音、图片、文件与深度研究集中在一个产品"],
    limitations: ["功能和用量会随套餐变化", "重要事实仍需核对来源", "部分地区的注册、付款和下载可能受限制"],
    capabilities: ["联网搜索", "文件上传", "图片理解与生成", "语音对话", "数据分析", "自定义 GPT", "深度研究", "编程"],
    models: [
      { name: "GPT-5.5 Instant", availability: "ChatGPT 默认快速模式；具体限额随套餐变化", context: "官方未给个人套餐统一固定值", inputs: ["文本", "图片", "音频"], note: "适合日常问答；复杂任务可能自动切换到更高推理档位。" },
      { name: "GPT-5.6 Sol", availability: "Plus：Medium / High；Pro 等套餐可用更多档位", context: "官方未给个人套餐统一固定值", inputs: ["文本", "图片", "文件"], note: "面向复杂推理、研究、编程和多步骤工作；仍在分批开放时应以账号内模型选择器为准。" },
      { name: "GPT-5.6 Sol Pro", availability: "Pro、Business、Enterprise 等符合条件的套餐", context: "官方未给个人套餐统一固定值", inputs: ["文本", "图片", "文件"], note: "面向困难任务和更长时间的复杂工作；Plus 标准对话不包含 Pro 档位。" },
    ],
    downloads: [
      { platform: "Web", label: "打开 ChatGPT 网页版", url: "https://chatgpt.com/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Windows", label: "Windows 官方下载", url: "https://chatgpt.com/download/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "macOS", label: "macOS 官方下载", url: "https://chatgpt.com/download/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.openai.chatgpt", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/chatgpt/id6448311069", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "ChatGPT 官方下载", url: "https://chatgpt.com/download/" },
      { label: "ChatGPT 套餐与模型", url: "https://chatgpt.com/pricing/" },
      { label: "ChatGPT Plus 官方说明", url: "https://help.openai.com/en/articles/6950777-what-is-chatgpt" },
      { label: "GPT-5.6 在 ChatGPT 中的使用说明", url: "https://help.openai.com/en/articles/20001354-gpt-56-in-chatgpt" },
    ],
    benchmarks: [
      { source: "Arena", url: "https://arena.ai/leaderboard/text", scope: "真人盲测偏好", summary: "查看当前 GPT 系列在 Text 榜的相对偏好；不同日期分数不可直接横向拼接。", verifiedAt: checkedAt },
      { source: "Artificial Analysis", url: "https://artificialanalysis.ai/", scope: "模型智能、速度与 API 成本", summary: "用于理解 API 模型表现，不代表 ChatGPT Plus 的会员价格或手机 App 速度。", verifiedAt: checkedAt },
    ],
    setupSteps: ["确认访问的是 chatgpt.com 或官方商店页面。", "使用自己的邮箱、Google、Apple 或其他官方支持方式注册。", "进入设置检查语言、隐私和数据控制选项。", "先用免费版完成一次文字问答、一次文件上传，再决定是否订阅。", "购买 Plus 后再次确认登录的是原来的本人账号。"],
    prompts: [
      { title: "解释概念", text: "请把【主题】解释给完全没有基础的人，先给结论，再用生活中的例子说明。" },
      { title: "整理材料", text: "请阅读这份材料，按‘结论、关键数据、待确认问题、下一步’整理。" },
      { title: "写作修改", text: "请保留我的原意，把下面内容改得自然、清楚、可信，不要使用夸张宣传词。" },
      { title: "方案比较", text: "请比较【方案A】和【方案B】，列出成本、风险、适合人群，并给出推荐。" },
      { title: "核查答案", text: "请标出回答中可能过时或需要外部核实的部分，并给我核查清单。" },
    ],
    privacy: ["不要上传密码、验证码、银行卡或完整身份证件。", "订阅链接和访问密钥相当于账号钥匙，不要截图公开。", "健康、法律和财务问题应把 AI 当作辅助说明，不替代专业人士。"],
    regionNote: "中国大陆的网页访问、账号注册、付款和应用商店展示可能受网络与账号地区影响；页面只标注实际核验结果，不保证所有地区可用。",
    verifiedAt: checkedAt,
  },
  {
    slug: "claude",
    name: "Claude",
    company: "Anthropic",
    mark: "A",
    tone: "sand",
    tagline: "擅长长文档、写作、分析和编程协作的思考型助手",
    summary: "Claude 的强项是阅读长材料、保持上下文、写出自然文字并与用户一起逐步推理，适合文档、研究和代码工作。",
    bestFor: ["长文档总结", "写作与表达", "代码理解和修改", "复杂问题拆解"],
    notFor: ["把回答当作无需验证的事实", "需要在所有地区稳定注册", "共享含隐私的账号"],
    strengths: ["长内容处理清晰", "文字自然", "适合持续对话和复杂项目"],
    limitations: ["免费和付费用量均有限制", "不同型号和功能随套餐变化", "部分国家与地区不可用"],
    capabilities: ["网页搜索", "文件与图片分析", "长文档", "语音输入", "代码", "Google 服务连接", "桌面扩展"],
    models: [
      { name: "Claude Sonnet 5", availability: "Claude 各套餐按用量和开放范围提供", context: "以产品内显示为准", inputs: ["文本", "图片", "文件"], note: "当前 Sonnet 主力型号，适合推理、工具使用、编程和知识工作。" },
      { name: "Claude Opus 4.8", availability: "高阶套餐与部分功能", context: "以产品内显示为准", inputs: ["文本", "图片", "文件"], note: "适合高难度推理与复杂任务；用量和开放范围随套餐变化。" },
      { name: "Claude Haiku 4.5", availability: "部分产品入口", context: "以产品内显示为准", inputs: ["文本", "图片"], note: "偏向快速和轻量任务。" },
    ],
    downloads: [
      { platform: "Web", label: "打开 Claude 网页版", url: "https://claude.ai/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Windows", label: "Claude Desktop", url: "https://claude.ai/download", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "macOS", label: "Claude Desktop", url: "https://claude.ai/download", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.anthropic.claude", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/claude-by-anthropic/id6473753684", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "Claude 支持的使用平台", url: "https://support.anthropic.com/en/articles/8114487-what-interfaces-can-i-use-to-access-claude" },
      { label: "Claude 套餐选择", url: "https://support.claude.com/en/articles/11049762-choose-a-claude-plan" },
      { label: "Claude 官方更新记录", url: "https://support.claude.com/en/articles/12138966-release-notes" },
    ],
    benchmarks: [
      { source: "Arena", url: "https://arena.ai/leaderboard/text", scope: "真人盲测偏好", summary: "用于观察 Claude 各型号的用户偏好变化。", verifiedAt: checkedAt },
      { source: "Artificial Analysis", url: "https://artificialanalysis.ai/", scope: "智能、速度、成本", summary: "API测试数据与 Claude Pro/Max 订阅价格分开显示。", verifiedAt: checkedAt },
    ],
    setupSteps: ["从 claude.ai 或官方商店进入。", "确认所在国家和账号地区受支持。", "注册后先完成一段文字问答。", "上传不含隐私的短文件测试总结效果。", "需要更高用量时再比较 Pro 与 Max。"],
    prompts: [
      { title: "长文总结", text: "请先给出一页摘要，再按章节列出论点、证据、风险和未解决问题。" },
      { title: "文章润色", text: "请保持作者语气，删除重复和空话，并解释三处最重要的修改。" },
      { title: "代码审查", text: "请先解释这段代码的目标，再找出错误、风险和最小修改方案。" },
      { title: "项目规划", text: "把这个目标拆成可执行阶段，每阶段列出输入、产出、风险和验收标准。" },
      { title: "反方检查", text: "请站在反方审查我的结论，指出证据不足、隐藏假设和可能失败的地方。" },
    ],
    privacy: ["不要把公司机密直接上传到个人账号。", "连接邮箱或云盘前先理解授权范围。", "第三方交付账号可能存在所有权和找回风险。"],
    regionNote: "Claude 对可用国家和地区有要求；如果官网或商店不展示，不建议通过未知安装包绕过。",
    verifiedAt: checkedAt,
  },
  {
    slug: "gemini",
    name: "Gemini",
    company: "Google",
    mark: "G",
    tone: "blue",
    tagline: "与 Google 搜索、Gmail、Drive 和移动助手结合紧密",
    summary: "Gemini 适合已经使用 Google 生态的人，可处理文字、图片、文件、研究和创作任务，并能与多项 Google 服务连接。",
    bestFor: ["Google 生态用户", "资料搜索与整理", "图片、视频和多模态", "学习与办公"],
    notFor: ["没有可用 Google 账号或地区", "不愿授权任何 Google 服务", "要求所有功能在所有国家一致"],
    strengths: ["Google 生态连接", "多模态能力完整", "Android 端可作为移动助手"],
    limitations: ["地区、语言和账号类型影响功能", "部分高级功能只在付费计划或特定国家开放", "Android 上会替代部分 Google Assistant 功能"],
    capabilities: ["Google 搜索", "文件上传", "图片和视频", "Gemini Live", "Deep Research", "Gmail / Drive / Docs", "NotebookLM", "代码"],
    models: [
      { name: "Flash-Lite", availability: "Gemini App 的高效率模式", context: "产品端未统一公布固定单一值", inputs: ["文本", "图片", "文件", "音频", "视频"], note: "适合总结、头脑风暴等日常快速任务。" },
      { name: "Flash", availability: "Gemini App 的平衡模式", context: "具体上下文和限额以产品内为准", inputs: ["文本", "图片", "文件", "音频", "视频"], note: "兼顾速度与推理，覆盖从简单到复杂的多类任务。" },
      { name: "Pro", availability: "高级能力和使用额度随 Google AI 套餐变化", context: "具体上下文和限额以产品内为准", inputs: ["文本", "图片", "文件", "音频", "视频"], note: "面向复杂数学、编程、学习与长内容；界面可能同时显示具体版本号。" },
    ],
    downloads: [
      { platform: "Web", label: "打开 Gemini 网页版", url: "https://gemini.google.com/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.google.android.apps.bard", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/google-gemini/id6477489729", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "Gemini 帮助中心", url: "https://support.google.com/gemini/" },
      { label: "Gemini App 模型选择说明", url: "https://support.google.com/gemini/answer/13275745" },
      { label: "Google AI 套餐", url: "https://one.google.com/about/google-ai-plans/" },
    ],
    benchmarks: [
      { source: "Arena", url: "https://arena.ai/leaderboard/text", scope: "真人盲测偏好", summary: "观察 Gemini 主流模型的用户偏好，不替代实际使用体验。", verifiedAt: checkedAt },
      { source: "Artificial Analysis", url: "https://artificialanalysis.ai/", scope: "智能、速度、API成本", summary: "仅用于模型 API 层面的量化参考。", verifiedAt: checkedAt },
    ],
    setupSteps: ["准备可用的个人 Google 账号。", "从 gemini.google.com 或官方商店进入。", "检查账号地区、年龄和语言是否满足要求。", "Android 用户确认是否要把 Gemini 设为主要助手。", "连接 Gmail 或 Drive 前逐项阅读授权范围。"],
    prompts: [
      { title: "搜索整理", text: "请围绕【主题】整理最新资料，区分事实、观点和仍需确认的信息。" },
      { title: "学习计划", text: "根据我的基础和时间，为【目标】制定四周学习计划，并给每天的练习。" },
      { title: "邮件草稿", text: "把这些要点整理成一封简洁、礼貌、有明确下一步的邮件。" },
      { title: "图片分析", text: "请描述图片中的关键信息、可能的异常，并说明哪些判断不确定。" },
      { title: "资料比较", text: "比较这几份资料的共同结论、冲突点、证据强弱和更新时间。" },
    ],
    privacy: ["Google 服务连接会扩大可访问数据范围，应按需授权。", "不要上传账号恢复码或付款凭证。", "工作和学校账号可能受管理员策略限制。"],
    regionNote: "Gemini 功能、套餐和商店可用性随国家、语言、年龄和账号类型变化；以当前账号页面为准。",
    verifiedAt: checkedAt,
  },
  {
    slug: "grok",
    name: "Grok",
    company: "xAI",
    mark: "X",
    tone: "ink",
    tagline: "强调实时网页与 X 信息、语音和图像视频创作",
    summary: "Grok 适合关注即时信息、X 平台内容和多媒体创作的人，也提供搜索、推理、文件分析和语音功能。",
    bestFor: ["实时新闻和 X 内容", "搜索与趋势", "图片、视频和语音", "开放式创意对话"],
    notFor: ["把即时信息当成已核实事实", "不希望内容与 X 生态关联", "需要所有地区完全一致"],
    strengths: ["实时网页与 X 搜索", "语音、图片和视频集中", "Web、iOS、Android 同步"],
    limitations: ["实时内容仍可能错误", "高级功能和用量依赖套餐", "部分型号或地区会分阶段开放"],
    capabilities: ["实时网页搜索", "X 搜索", "深度推理", "语音", "图片生成", "视频生成", "文件分析", "代码"],
    models: [
      { name: "Grok 4.5", availability: "SuperGrok 及官方相关产品", context: "官方消费者页面未公开统一单一值", inputs: ["文本", "图片", "文件", "音频"], note: "当前官方主推的复杂任务与知识工作模型。" },
      { name: "Grok 快速模式", availability: "Grok 产品内按当前设置提供", context: "以产品内显示为准", inputs: ["文本", "图片"], note: "偏向快速问答和实时搜索。" },
    ],
    downloads: [
      { platform: "Web", label: "打开 Grok 网页版", url: "https://grok.com/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=ai.x.grok", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/grok-ai/id6670324846", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "Grok 官方介绍", url: "https://x.ai/grok" },
      { label: "Grok 官方套餐", url: "https://x.ai/pricing" },
      { label: "Grok 使用文档", url: "https://docs.x.ai/grok/overview" },
    ],
    benchmarks: [
      { source: "Arena", url: "https://arena.ai/leaderboard/text", scope: "真人盲测偏好", summary: "用于对比 Grok 文本模型的相对偏好。", verifiedAt: checkedAt },
      { source: "Artificial Analysis", url: "https://artificialanalysis.ai/", scope: "智能、速度、API成本", summary: "不把 API 数据当作 SuperGrok 会员体验。", verifiedAt: checkedAt },
    ],
    setupSteps: ["从 grok.com 或官方商店进入。", "使用本人 X、Google、Apple 或邮箱账号登录。", "检查搜索和历史记录设置。", "先测试普通问答与实时搜索。", "需要更高用量时再对比 SuperGrok。"],
    prompts: [
      { title: "趋势速览", text: "请总结【主题】最近的主要动态，按时间列出，并区分已证实与传闻。" },
      { title: "X 内容分析", text: "请概括这组帖子表达的主要观点、证据和争议，不要把热度当真实性。" },
      { title: "创意脚本", text: "为【主题】写一个30秒短视频脚本，包含开头钩子、画面和旁白。" },
      { title: "事实核查", text: "请为这条说法寻找相反证据，并列出最需要核实的三个来源。" },
      { title: "技术解释", text: "用小白能懂的方式解释【技术问题】，再给进阶版本和实际例子。" },
    ],
    privacy: ["实时平台内容不等于权威事实。", "不要在提示词中提交 X 账号恢复信息。", "订阅应确认是本人账号充值还是他人账号交付。"],
    regionNote: "Grok 网页、应用商店和订阅选项会随地区变化；X Premium 与 SuperGrok 也不是同一项订阅。",
    verifiedAt: checkedAt,
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    company: "Perplexity AI",
    mark: "P",
    tone: "teal",
    tagline: "把搜索、引用来源和多模型回答组合在一起的研究型 AI",
    summary: "Perplexity 的核心价值是先搜索再回答，并把引用来源放在答案旁边，适合查资料、做比较和快速建立研究脉络。",
    bestFor: ["带来源的资料搜索", "快速研究与比较", "文件和网页总结", "需要多模型选择"],
    notFor: ["认为有引用就一定正确", "只需要纯创意聊天", "不愿检查原始来源"],
    strengths: ["答案带引用", "搜索体验直接", "可切换多家主流模型"],
    limitations: ["引用可能不完全支持结论", "高级模型和研究有用量限制", "不同套餐可用模型会变化"],
    capabilities: ["实时搜索", "引用来源", "文件上传", "Research", "多模型", "图片和视频", "Create files and apps", "Comet"],
    models: [
      { name: "Sonar 2", availability: "Perplexity 自有搜索模型", context: "消费者产品未公开统一单一值", inputs: ["文本", "网页"], note: "偏向联网搜索与带来源回答。" },
      { name: "Claude Sonnet / Gemini Pro 等", availability: "Pro/Max 可选范围会更新", context: "取决于被调用模型和产品限制", inputs: ["文本", "图片", "文件"], note: "同一订阅可访问多家模型，但额度并非无限。" },
    ],
    downloads: [
      { platform: "Web", label: "打开 Perplexity 网页版", url: "https://www.perplexity.ai/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Windows", label: "Windows 官方下载", url: "https://www.perplexity.ai/platforms", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "macOS", label: "macOS 官方下载", url: "https://www.perplexity.ai/platforms", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=ai.perplexity.app.android", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "Perplexity 平台下载", url: "https://www.perplexity.ai/platforms" },
      { label: "Perplexity Pro 说明", url: "https://www.perplexity.ai/help-center/en/articles/9385876-what-is-perplexity-pro" },
      { label: "Perplexity Pro 套餐", url: "https://www.perplexity.ai/pro" },
    ],
    benchmarks: [
      { source: "Arena", url: "https://arena.ai/leaderboard/text", scope: "底层模型偏好参考", summary: "Perplexity 会组合多种模型，榜单分数不能直接代表整个产品。", verifiedAt: checkedAt },
      { source: "Artificial Analysis", url: "https://artificialanalysis.ai/", scope: "底层 API 模型", summary: "只用于理解被选模型，不代表 Perplexity 搜索和引用质量。", verifiedAt: checkedAt },
    ],
    setupSteps: ["从 perplexity.ai 或官方商店进入。", "先用免费搜索体验引用格式。", "打开两到三个引用确认是否支持结论。", "测试文件上传和后续追问。", "需要更多研究和模型选择时再考虑 Pro。"],
    prompts: [
      { title: "资料入门", text: "请为【主题】建立入门资料包，优先官方和一手来源，并解释每个来源的价值。" },
      { title: "产品比较", text: "比较【产品A】与【产品B】的官方价格、功能和限制，每条结论附来源。" },
      { title: "新闻核查", text: "核查这条消息，列出最早来源、独立证据、反方信息和当前不确定点。" },
      { title: "研究提纲", text: "为【主题】设计研究提纲，列出需要回答的问题和推荐检索关键词。" },
      { title: "引用审查", text: "逐条检查当前回答的引用是否真正支持对应结论，并指出不匹配之处。" },
    ],
    privacy: ["引用存在不等于结论一定正确，应打开原文。", "不要上传包含账号密码的文件。", "使用第三方底层模型时仍应理解其数据处理规则。"],
    regionNote: "网页和移动应用的套餐、模型与支付选项可能因地区变化；教育优惠等需要资格验证。",
    verifiedAt: checkedAt,
  },
];

const baseSubscriptionOffers: SubscriptionOffer[] = [
  {
    slug: "chatgpt-recharge", name: "ChatGPT Plus 充值", productSlug: "chatgpt", mark: "C", useCase: "在本人 ChatGPT 账号上开通 Plus，保留原有对话与设置。",
    officialPrice: "US$20 / 月", officialCny: "约 ¥135.49", gamsgoPrice: "购买页实时显示", gamsgoCny: "待公开页读取", priceNote: "官方 Plus 美国参考价；GamsGo公开详情页未稳定展示单一结算价。",
    deliveryType: "本人账号充值", risk: "medium", riskLabel: "中风险 · 涉及访问密钥", ownership: "账号仍归购买者本人", privacy: "不应提供邮箱密码；访问密钥同样属于敏感信息", renewal: "确认是一次性代充还是自动续费", support: "GamsGo订单与在线客服", payment: "Visa、Mastercard、Apple Pay、Google Pay等；以结算页为准", region: "账号与付款地区可能影响开通",
    sourceUrl: "https://www.gamsgo.com/details/chatgpt-recharge", affiliateUrl: "https://www.gamsgo.com/partner/BTzCM", verifiedAt: checkedAt,
  },
  {
    slug: "claude", name: "Claude Pro / Max", productSlug: "claude", mark: "A", useCase: "获得更高的 Claude 使用额度、模型和付费功能。",
    officialPrice: "Pro US$20 / 月", officialCny: "约 ¥135.49", gamsgoPrice: "购买页实时显示", gamsgoCny: "待公开页读取", priceNote: "Claude官方美国月付参考价；地区税费和应用商店价格可能不同。",
    deliveryType: "多种方式", risk: "high", riskLabel: "高风险 · 先确认账号归属", ownership: "可能是独立账号交付，不一定是本人原账号", privacy: "交付账号应立即检查恢复邮箱、二次验证和密码修改权限", renewal: "确认到期后账号能否继续使用", support: "依赖GamsGo订单售后", payment: "以GamsGo结算页为准", region: "Claude本身有支持地区限制",
    sourceUrl: "https://www.gamsgo.com/details/claude", affiliateUrl: "https://www.gamsgo.com/partner/BTzCM", verifiedAt: checkedAt,
  },
  {
    slug: "gemini", name: "Gemini / Google AI Pro", productSlug: "gemini", mark: "G", useCase: "获得Gemini高级功能、更多用量及Google生态权益。",
    officialPrice: "US$19.99 / 月参考", officialCny: "约 ¥135.42", gamsgoPrice: "S$4.52 / 月公开参考", gamsgoCny: "约 ¥23.72", priceNote: "GamsGo页面展示的是地区公开参考价，具体账号类型和结算价可能不同。",
    deliveryType: "独立账号交付", risk: "high", riskLabel: "高风险 · Google账号归属", ownership: "通常交付新的Google账号资料", privacy: "不建议把私人Gmail、照片或云盘资料迁入来源不明的交付账号", renewal: "确认云存储和订阅到期后的数据处理", support: "GamsGo售后，Google官方不一定处理第三方交付问题", payment: "以GamsGo结算页为准", region: "权益和存储容量随地区与产品变化",
    sourceUrl: "https://www.gamsgo.com/details/gemini", affiliateUrl: "https://www.gamsgo.com/partner/BTzCM", verifiedAt: checkedAt,
  },
  {
    slug: "grok", name: "SuperGrok", productSlug: "grok", mark: "X", useCase: "提升Grok模型、搜索、图片视频与高级功能的使用额度。",
    officialPrice: "US$30 / 月", officialCny: "约 ¥203.24", gamsgoPrice: "US$17.99 / 月公开参考", gamsgoCny: "约 ¥121.87", priceNote: "GamsGo同时存在账号交付和本人账号充值页面，下单前必须确认类型。",
    deliveryType: "多种方式", risk: "medium", riskLabel: "中风险 · 优先本人账号充值", ownership: "充值型归本人；账号交付型需核查恢复权限", privacy: "不要把X账号密码交给不明页面", renewal: "确认SuperGrok与X Premium不是同一订阅", support: "GamsGo订单售后", payment: "以GamsGo结算页为准", region: "Grok与商店可用性随地区变化",
    sourceUrl: "https://www.gamsgo.com/details/grok", affiliateUrl: "https://www.gamsgo.com/partner/BTzCM", verifiedAt: checkedAt,
  },
  {
    slug: "perplexity", name: "Perplexity Pro", productSlug: "perplexity", mark: "P", useCase: "获得更多研究、文件分析、模型选择和高级搜索能力。",
    officialPrice: "US$17 / 月（年付折算）", officialCny: "约 ¥115.17", gamsgoPrice: "US$1.92 / 月公开参考", gamsgoCny: "约 ¥13.01", priceNote: "官方参考为年付折算；GamsGo低价产品可能是交付账号，不能当作本人账号充值。",
    deliveryType: "独立账号交付", risk: "high", riskLabel: "高风险 · 账号交付", ownership: "账号通常由平台提供，不等同于本人原账号", privacy: "不要在交付账号中保存敏感研究、公司文件或个人资料", renewal: "确认到期后历史记录能否导出", support: "GamsGo订单售后", payment: "以GamsGo结算页为准", region: "模型和用量随地区、套餐变化",
    sourceUrl: "https://www.gamsgo.com/details/Perplexity_AI", affiliateUrl: "https://www.gamsgo.com/partner/BTzCM", verifiedAt: checkedAt,
  },
  {
    slug: "midjourney", name: "Midjourney", productSlug: "midjourney", mark: "M", useCase: "生成高质量图片，适合创意、设计、营销和视觉探索。",
    officialPrice: "以Midjourney计划页为准", officialCny: "未稳定读取", gamsgoPrice: "US$24.99 / 月公开参考", gamsgoCny: "约 ¥169.30", priceNote: "GamsGo公开页同时提供独立账号与共享网页方式，两者体验和风险不同。",
    deliveryType: "多种方式", risk: "high", riskLabel: "高风险 · 共享与独立需分清", ownership: "独立账号与共享网页的账号控制权不同", privacy: "共享环境不要上传私人图片或商业机密素材", renewal: "确认Fast/Relax额度和到期处理", support: "GamsGo订单售后", payment: "以GamsGo结算页为准", region: "官方平台和Discord功能可能受地区影响",
    sourceUrl: "https://www.gamsgo.com/details/midjourney_official/partner/2MGZTK", affiliateUrl: "https://www.gamsgo.com/partner/BTzCM", verifiedAt: checkedAt,
  },
];

function syncedSubscriptionOffer(offer: SubscriptionOffer): SubscriptionOffer {
  const synced = autoSync.gamsgo.find((item) => item.slug === offer.slug);
  const usdMatch = offer.officialPrice.match(/US\$(\d+(?:\.\d+)?)/);
  const officialCny = usdMatch && autoSync.exchange.state === "ok"
    ? `约 ¥${(Number(usdMatch[1]) * autoSync.exchange.rates.CNY).toFixed(2)}`
    : offer.officialCny;
  const offerWithCurrentExchange = { ...offer, officialCny };
  if (!synced) return offerWithCurrentExchange;

  if (!["ok", "price-changed"].includes(synced.state) || !synced.published) {
    return {
      ...offerWithCurrentExchange,
      gamsgoPrice: "暂时无法核验",
      gamsgoCny: "以购买页实时显示为准",
      priceNote: synced.state === "price-change-pending"
        ? "读取到价格明显变化，正在等待第二次一致结果；为避免误导，暂时隐藏具体数字。"
        : "公开页面暂时无法稳定读取月付价格；不要把旧价格当作当前价格。",
      verifiedAt: autoSync.checkedAt.slice(0, 10),
    };
  }

  const currencyLabel = synced.published.currency === "SGD" ? "S$" : synced.published.currency === "USD" ? "US$" : synced.published.currency;
  return {
    ...offerWithCurrentExchange,
    gamsgoPrice: `${currencyLabel}${synced.published.value.toFixed(2)} / 月公开起价`,
    gamsgoCny: synced.cny ? `约 ¥${synced.cny.toFixed(2)}` : "人民币参考价待核验",
    priceNote: `${synced.note}${synced.state === "price-changed" ? "；价格明显变动，已连续两次读取一致" : ""}。`,
    verifiedAt: synced.checkedAt.slice(0, 10),
  };
}

export const subscriptionOffers: SubscriptionOffer[] = baseSubscriptionOffers.map(syncedSubscriptionOffer);

export const commonApps: AppProfile[] = [
  {
    slug: "youtube", name: "YouTube", company: "Google", mark: "Y", tagline: "视频、音乐、直播与创作者内容平台", summary: "用于观看和发布视频、订阅频道、直播以及使用YouTube Premium。",
    downloads: [
      { platform: "Web", label: "YouTube 网页版", url: "https://www.youtube.com/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.google.android.youtube", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/youtube/id544007664", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    setupSteps: ["只从Google Play或Apple App Store安装。", "使用本人Google账号登录。", "在设置中检查历史记录、自动播放和通知。", "需要离线观看时确认所在地区与Premium权益。"],
    languageSteps: ["点击头像进入Settings。", "在Language或App language中选择简体中文。", "内容地区与界面语言是两项不同设置。"],
    safety: ["不要安装所谓去广告破解版。", "订阅家庭组前确认成员地区和家庭组规则。", "儿童使用应配置家长监督。"],
    regionNote: "YouTube及Premium并非所有地区都提供相同功能；离线内容只能在官方App内播放。",
    officialSources: [{ label: "YouTube 官方安装说明", url: "https://support.google.com/youtube/answer/3227660" }], verifiedAt: checkedAt,
  },
  {
    slug: "x", name: "X", company: "X Corp.", mark: "X", tagline: "实时信息、公共讨论、创作者与社区平台", summary: "适合关注新闻、趋势、专业账号和公开讨论，也与Grok实时信息能力结合。",
    downloads: [
      { platform: "Web", label: "X 网页版", url: "https://x.com/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.twitter.android", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/x/id333903271", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    setupSteps: ["从x.com或官方商店进入。", "使用本人邮箱或手机号注册并保存恢复方式。", "开启二次验证并保存备份码。", "调整隐私、私信和敏感内容设置。"],
    languageSteps: ["进入Settings and privacy。", "选择Accessibility, display, and languages。", "在Languages中设置界面和内容语言。"],
    safety: ["不要把热帖当作已核实新闻。", "警惕假客服、假认证和私信钓鱼链接。", "卸载前保存尚未发布的草稿和二次验证备份码。"],
    regionNote: "X应用与部分内容可能受地区、年龄和商店政策影响；X Premium与SuperGrok为不同产品。",
    officialSources: [{ label: "X 官方下载说明", url: "https://help.x.com/en/using-x/download-the-x-app" }], verifiedAt: checkedAt,
  },
  {
    slug: "tiktok", name: "TikTok", company: "TikTok Ltd.", mark: "T", tagline: "短视频、直播、创作和内容发现平台", summary: "用于发现和发布短视频、直播、互动以及创作者内容。",
    downloads: [
      { platform: "Web", label: "TikTok 网页版", url: "https://www.tiktok.com/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/tiktok/id835599320", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    setupSteps: ["从TikTok官网或官方商店进入。", "使用本人邮箱、手机号或官方支持的第三方账号注册。", "设置用户名、生日与隐私选项。", "检查评论、私信、下载和推荐权限。"],
    languageSteps: ["进入Profile后打开Settings and privacy。", "选择Language。", "分别设置App language和Preferred languages。"],
    safety: ["不要安装修改版APK或共享陌生账号。", "警惕直播、私信和评论中的付款链接。", "未成年人应配置Family Pairing与使用时长。"],
    regionNote: "TikTok与中国大陆的抖音是不同产品；账号地区、SIM卡、商店地区和网络环境都可能影响功能。",
    officialSources: [{ label: "TikTok 官方网站", url: "https://www.tiktok.com/" }], verifiedAt: checkedAt,
  },
];

export const allDownloads = [
  ...aiProducts.flatMap((product) => product.downloads.map((download) => ({ ...download, product: product.name, slug: product.slug, category: "AI" as const }))),
  ...commonApps.flatMap((app) => app.downloads.map((download) => ({ ...download, product: app.name, slug: app.slug, category: "常用应用" as const }))),
];

export function getAiProduct(slug: string) {
  return aiProducts.find((product) => product.slug === slug);
}

export function getCommonApp(slug: string) {
  return commonApps.find((app) => app.slug === slug);
}
