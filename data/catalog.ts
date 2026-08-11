import autoSync from "./auto-sync.json";
import subscriptionPricing from "./subscription-pricing.json";

export type Platform = "Web" | "Windows" | "macOS" | "Android" | "iOS";
export type VerificationStatus = "verified" | "automatic" | "stale" | "pending" | "error" | "paused";
export type RiskLevel = "low" | "medium" | "high";

export interface DownloadLink {
  platform: Platform;
  label: string;
  url: string;
  source: "official" | "app-store" | "google-play" | "microsoft-store";
  status: VerificationStatus;
  verifiedAt: string;
}

export interface OfficialScreenshot {
  src: string;
  title: string;
  caption: string;
  alt: string;
  focus: string[];
  sourceLabel: "Apple App Store" | "Google Play" | "Midjourney Docs";
  sourceUrl: string;
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
  screenshots: OfficialScreenshot[];
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
  whySelected: string;
  freeAdvice: string;
  officialPrice: string;
  officialCny: string;
  officialUrl: string;
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
  paymentNote?: string;
  region: string;
  sourceUrl: string;
  affiliateUrl: string;
  purchaseOptions?: {
    label: string;
    usd: number;
    monthlyUsd?: number;
    suffix?: string;
    note: string;
    url: string;
  }[];
  purchaseChannels?: {
    label: string;
    title: string;
    note: string;
    url: string;
  }[];
  marketplaceSummary?: string;
  purchaseQrCodes?: {
    label: string;
    image: string;
    url: string;
  }[];
  priceVerifiedAt?: string;
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
  screenshots: OfficialScreenshot[];
  setupSteps: string[];
  languageSteps: string[];
  safety: string[];
  regionNote: string;
  officialSources: { label: string; url: string }[];
  verifiedAt: string;
}

const checkedAt = "2026-08-09";
const syncedUsdCnyRate = Number(autoSync.exchange?.rates?.CNY);
const hasSyncedUsdCnyRate = Number.isFinite(syncedUsdCnyRate) && syncedUsdCnyRate > 0;

export const USD_CNY_RATE = hasSyncedUsdCnyRate ? syncedUsdCnyRate : subscriptionPricing.usdCnyRate;
export const USD_CNY_RATE_UPDATED_AT = hasSyncedUsdCnyRate ? autoSync.exchange.date : subscriptionPricing.rateUpdatedAt;

export function formatUsdPrice(usd: number, suffix = "") {
  return `$${usd.toFixed(2)}${suffix}`;
}

export function formatCnyPrice(usd: number, suffix = "") {
  return `¥${(usd * USD_CNY_RATE).toFixed(2)}人民币${suffix.replace(" / ", "/")}`;
}

export function formatPurchaseOptionNote(option: NonNullable<SubscriptionOffer["purchaseOptions"]>[number]) {
  const monthly = option.monthlyUsd
    ? `${formatUsdPrice(option.monthlyUsd)}/月 · ${formatCnyPrice(option.monthlyUsd)}/月`
    : "";
  return [monthly, option.note].filter(Boolean).join(" · ");
}

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
      { name: "ChatGPT Instant（动态更新）", availability: "ChatGPT 当前默认快速模式；底层模型快照会持续更新", context: "官方未给个人套餐统一固定值", inputs: ["文本", "图片", "音频"], note: "适合日常问答。不要把某次看到的底层快照名称长期写死，当前名称与限额以产品界面为准。" },
      { name: "GPT-5.6 Sol", availability: "OpenAI API 的旗舰 GPT-5.6 模型；ChatGPT 中的入口与档位以账号界面为准", context: "API 模型卡与 ChatGPT 套餐是两层信息", inputs: ["文本", "图片", "文件"], note: "适合复杂推理、研究、编程和多步骤工作；本站不再推断 Plus、Pro 等套餐与推理档位的固定对应关系。" },
    ],
    downloads: [
      { platform: "Web", label: "打开 ChatGPT 网页版", url: "https://chatgpt.com/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Windows", label: "Windows 官方下载", url: "https://chatgpt.com/download/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "macOS", label: "macOS 官方下载", url: "https://chatgpt.com/download/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.openai.chatgpt", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/chatgpt/id6448311069", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    screenshots: [
      { src: "/guides/chatgpt/official-1.webp", title: "图片生成与继续对话", caption: "在输入框说明想要的画面，也可以上传自己的图片继续修改。", alt: "ChatGPT官方Google Play截图，展示图片生成对话", focus: ["底部“+”号用于添加图片或文件", "输入框写清主体、场景和风格", "生成后可以继续用文字要求修改"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=com.openai.chatgpt", verifiedAt: checkedAt },
      { src: "/guides/chatgpt/official-2.webp", title: "用图文方式辅助学习", caption: "同一个对话里可以组合解释、图片和步骤，适合把抽象内容变得直观。", alt: "ChatGPT官方Google Play截图，展示图文学习示例", focus: ["先告诉它自己的基础和学习目标", "看不懂时继续要求换一种解释", "知识和数字仍要与可靠资料核对"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=com.openai.chatgpt", verifiedAt: checkedAt },
      { src: "/guides/chatgpt/official-3.webp", title: "把目标拆成可执行步骤", caption: "除了问答案，还可以让它根据你的情况制定计划、检查遗漏并逐步调整。", alt: "ChatGPT官方Google Play截图，展示分步骤计划回答", focus: ["问题越具体，计划越贴近你", "要求说明假设和风险", "重要健康建议需由专业人士确认"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=com.openai.chatgpt", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "ChatGPT 官方新手说明", url: "https://help.openai.com/en/articles/12677804-what-is-chatgpt-faq" },
      { label: "ChatGPT 官方下载", url: "https://chatgpt.com/download/" },
      { label: "ChatGPT 套餐与模型", url: "https://chatgpt.com/pricing/" },
      { label: "ChatGPT Plus 官方说明", url: "https://help.openai.com/en/articles/6950777-what-is-chatgpt" },
      { label: "GPT-5.6 在 ChatGPT 中的使用说明", url: "https://help.openai.com/en/articles/20001354-gpt-56-in-chatgpt" },
      { label: "ChatGPT Instant 官方模型说明", url: "https://developers.openai.com/api/docs/models/chat-latest" },
      { label: "GPT-5.6 Sol 官方模型卡", url: "https://developers.openai.com/api/docs/models/gpt-5.6-sol" },
      { label: "ChatGPT 数据控制官方说明", url: "https://help.openai.com/en/articles/7730893-datacontrols-faq" },
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
    privacy: ["不要上传密码、验证码、银行卡或完整身份证件。", "在头像 → 设置 → 数据控制中检查“为所有人改进模型”是否符合你的选择。", "临时聊天不会进入历史记录，也不会用于改进模型；官方说明会在30天后删除，但仍不要提交机密。", "健康、法律和财务问题应把 AI 当作辅助说明，不替代专业人士。"],
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
      { name: "Claude Fable 5", availability: "Anthropic 当前 API 型号；Claude 产品中的开放范围以账号为准", context: "API 型号与消费者套餐分开核对", inputs: ["文本", "图片", "文件"], note: "当前高阶型号之一；实际可选入口、用量和功能以 Claude 产品界面为准。" },
      { name: "Claude Opus 5", availability: "Anthropic 当前 API 型号；高阶使用场景", context: "API 型号与消费者套餐分开核对", inputs: ["文本", "图片", "文件"], note: "适合高难度推理与复杂任务；旧型号名称不再作为当前推荐依据。" },
      { name: "Claude Sonnet 5", availability: "Anthropic 当前 API 型号；Claude 产品中的开放范围以账号为准", context: "以产品内显示为准", inputs: ["文本", "图片", "文件"], note: "当前 Sonnet 主力型号，适合推理、工具使用、编程和知识工作。" },
      { name: "Claude Haiku 4.5", availability: "Anthropic 当前轻量型号；产品入口可能不同", context: "以产品内显示为准", inputs: ["文本", "图片"], note: "偏向快速和轻量任务。" },
    ],
    downloads: [
      { platform: "Web", label: "打开 Claude 网页版", url: "https://claude.ai/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Windows", label: "Claude Desktop", url: "https://claude.ai/download", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "macOS", label: "Claude Desktop", url: "https://claude.ai/download", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.anthropic.claude", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/claude-by-anthropic/id6473753684", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    screenshots: [
      { src: "/guides/claude/official-1.webp", title: "把问题变成有用答案", caption: "Claude可以结合问题、位置和资料整理建议；涉及消费或出行时仍要核对营业信息。", alt: "Claude官方App Store截图，展示带地图的实用回答", focus: ["顶部菜单用于进入历史和设置", "先补充地点、人数、预算等限制", "打开外部来源确认时间与价格"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/claude-by-anthropic/id6473753684", verifiedAt: checkedAt },
      { src: "/guides/claude/official-2.webp", title: "语音模式", caption: "适合移动时连续交流，结束后再把讨论整理成清单或文档。", alt: "Claude官方App Store截图，展示语音模式", focus: ["先允许真正需要的麦克风权限", "涉及专有名词时改用文字确认", "语音额度与开放范围可能变化"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/claude-by-anthropic/id6473753684", verifiedAt: checkedAt },
      { src: "/guides/claude/official-3.webp", title: "工具与资料协作", caption: "可以围绕文件、搜索或连接的工具继续工作，适合项目型任务。", alt: "Claude官方App Store截图，展示工具与资料入口", focus: ["只连接任务真正需要的资料", "先说明最终要交付什么", "查看每个工具的授权范围"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/claude-by-anthropic/id6473753684", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "Claude 官方产品与功能介绍", url: "https://www.anthropic.com/claude" },
      { label: "Claude 支持的使用平台", url: "https://support.anthropic.com/en/articles/8114487-what-interfaces-can-i-use-to-access-claude" },
      { label: "Claude 套餐选择", url: "https://support.claude.com/en/articles/11049762-choose-a-claude-plan" },
      { label: "Claude 当前模型总览", url: "https://platform.claude.com/docs/en/about-claude/models/overview" },
      { label: "Claude 当前套餐与价格", url: "https://claude.com/pricing" },
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
    screenshots: [
      { src: "/guides/gemini/official-1.webp", title: "生成与编辑图片", caption: "输入文字或提供参考图片后继续修改，适合头像、概念图和视觉草案。", alt: "Gemini官方Google Play截图，展示图片生成与编辑", focus: ["顶部模型名称会随账号变化", "底部“+”号可添加素材", "不要上传未经授权的人脸与隐私图片"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.bard", verifiedAt: checkedAt },
      { src: "/guides/gemini/official-2.webp", title: "生成与编辑视频", caption: "部分账号可从文字或图片开始制作视频，具体模型、额度和地区以产品内为准。", alt: "Gemini官方Google Play截图，展示视频生成入口", focus: ["先选择视频相关入口", "描述人物、场景、镜头和节奏", "发布前检查肖像、品牌和版权"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.bard", verifiedAt: checkedAt },
      { src: "/guides/gemini/official-3.webp", title: "连接Google生态完成任务", caption: "在明确授权后，可把搜索和Google服务资料用于整理、研究和创作。", alt: "Gemini官方Google Play截图，展示Google服务协作", focus: ["逐项确认连接的服务", "限定文件、邮件和时间范围", "工作账号可能受管理员限制"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.bard", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "Gemini 帮助中心", url: "https://support.google.com/gemini/" },
      { label: "Deep Research 官方说明", url: "https://support.google.com/gemini/answer/15719111" },
      { label: "Gemini Canvas 官方说明", url: "https://support.google.com/gemini/answer/16047321" },
      { label: "Gems 官方说明", url: "https://support.google.com/gemini/answer/15236321" },
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
    screenshots: [
      { src: "/guides/grok/official-1.webp", title: "Imagine图片与视频创作", caption: "从模板或文字描述开始制作视觉内容，适合快速探索不同创意方向。", alt: "Grok官方Google Play截图，展示Imagine创作入口", focus: ["Ask与Imagine是不同入口", "先选模板或描述画面", "生成结果仍需检查版权与误导风险"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=ai.x.grok", verifiedAt: checkedAt },
      { src: "/guides/grok/official-2.webp", title: "带实时相机的语音模式", caption: "可用语音连续提问，并在支持时让AI结合相机画面交流。", alt: "Grok官方Google Play截图，展示语音与实时相机", focus: ["相机与麦克风权限可随时关闭", "不要拍摄证件、住址和他人隐私", "画面判断可能出错，不用于安全决定"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=ai.x.grok", verifiedAt: checkedAt },
      { src: "/guides/grok/official-3.webp", title: "实时搜索与对话", caption: "适合追踪当前话题，但要把事实、当事方说法和网友观点分开。", alt: "Grok官方Google Play截图，展示实时搜索对话", focus: ["限定时间和来源范围", "要求附上原始帖子或网页", "高热度不等于已证实"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=ai.x.grok", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "X帮助中心：关于Grok", url: "https://help.x.com/en/using-x/about-grok" },
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
      { name: "GPT-5.6 Terra / Sol", availability: "列入 Perplexity 高级模型；具体由 Pro、Max 和模型选择器决定", context: "取决于被调用模型和产品限制", inputs: ["文本", "图片", "文件"], note: "同一订阅中的可用额度并非无限，当前入口以账号内模型选择器为准。" },
      { name: "Gemini 3.1 Pro", availability: "列入 Perplexity 高级模型；套餐开放范围会更新", context: "取决于被调用模型和产品限制", inputs: ["文本", "图片", "文件"], note: "Perplexity 的搜索、引用和文件处理仍是产品层能力，不能只按底层模型评价。" },
      { name: "Claude Sonnet 5 / Opus 5", availability: "列入 Perplexity 高级模型；Opus 等高阶入口可能受 Max 套餐限制", context: "取决于被调用模型和产品限制", inputs: ["文本", "图片", "文件"], note: "可选范围会调整；购买前应打开官方帮助页与自己的模型选择器复核。" },
    ],
    downloads: [
      { platform: "Web", label: "打开 Perplexity 网页版", url: "https://www.perplexity.ai/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Windows", label: "Windows 官方下载", url: "https://www.perplexity.ai/platforms", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "macOS", label: "macOS 官方下载", url: "https://www.perplexity.ai/platforms", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=ai.perplexity.app.android", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    screenshots: [
      { src: "/guides/perplexity/official-1.webp", title: "从一个清楚的问题开始", caption: "把主题、地区、时间和用途说清楚，搜索结果更容易核对。", alt: "Perplexity官方App Store截图，展示搜索问答入口", focus: ["输入框写清范围和日期", "回答中的编号可打开来源", "重要结论不要只看摘要"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334", verifiedAt: checkedAt },
      { src: "/guides/perplexity/official-2.webp", title: "逐条打开引用来源", caption: "Perplexity的核心优势是来源可见，但你仍要检查原文是否真正支持结论。", alt: "Perplexity官方App Store截图，展示带引用的回答", focus: ["优先打开官网或一手资料", "检查发布日期和适用地区", "来源之间冲突时不要强行下结论"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334", verifiedAt: checkedAt },
      { src: "/guides/perplexity/official-3.webp", title: "Research深入研究", caption: "需要完整报告时使用多步研究，再导出、分享或继续修改。", alt: "Perplexity官方App Store截图，展示Research研究功能", focus: ["先限定问题和研究深度", "查看研究过程使用的来源", "导出前复核数字、引文和遗漏观点"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "Perplexity 平台下载", url: "https://www.perplexity.ai/platforms" },
      { label: "Research 模式官方说明", url: "https://www.perplexity.ai/help-center/en/articles/10738684-what-is-research-mode" },
      { label: "Comet 官方帮助中心", url: "https://www.perplexity.ai/help-center/en/collections/18799298-comet" },
      { label: "Perplexity Pro 说明", url: "https://www.perplexity.ai/help-center/en/articles/9385876-what-is-perplexity-pro" },
      { label: "Perplexity 当前高级模型列表", url: "https://www.perplexity.ai/help-center/en/articles/10354919-what-advanced-ai-models-are-included-in-my-subscription" },
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
  {
    slug: "midjourney",
    name: "Midjourney",
    company: "Midjourney, Inc.",
    mark: "M",
    tone: "violet",
    tagline: "专注图片、视频、风格探索与视觉编辑的生成式创作工具",
    summary: "Midjourney适合持续进行图片和视频创作的人。它把文字提示、图片参考、风格控制、局部编辑、放大、素材整理和个性化集中在网页端，也支持Discord工作流。",
    bestFor: ["专业图片与概念视觉", "品牌风格与情绪板", "局部重绘和画面扩展", "图片转视频与视觉探索"],
    notFor: ["只偶尔生成一两张图", "要求作品默认完全私密", "尚未确认商业使用与人物素材授权"],
    strengths: ["视觉质量与风格探索成熟", "网页Create、Edit和Organize工作流完整", "支持图片提示、风格参考、个性化与视频"],
    limitations: ["官方当前需要订阅才能开始主要创作", "作品和素材的可见范围需要主动检查", "Fast、Relax、Stealth等权益随套餐变化"],
    capabilities: ["文字生成图片", "图片提示", "Style Reference", "Omni Reference", "局部重绘", "扩图与缩放", "个性化", "Moodboards", "图片转视频", "素材整理"],
    models: [
      { name: "Midjourney V8.2", availability: "自 2026-07-24 起为 Midjourney 默认版本；网页与 Discord 均以账号设置为准", context: "官方未公开模型参数量或统一上下文窗口", inputs: ["文本", "图片参考"], note: "V8.2 已取代 V8.1 成为默认版本；具体兼容功能与旧版选择方式以 Version 文档为准。" },
    ],
    downloads: [
      { platform: "Web", label: "打开Midjourney官方网页", url: "https://www.midjourney.com/", source: "official", status: "verified", verifiedAt: checkedAt },
    ],
    screenshots: [
      { src: "/guides/midjourney/official-1.png", title: "Imagine输入栏", caption: "在Create页面顶部输入想要的画面；这不是搜索框，而是生成图片的提示词入口。", alt: "Midjourney官方文档截图，展示Imagine提示词输入栏", focus: ["先写主体，再补场景、构图和风格", "右侧设置用于调整默认生成选项", "第一次不要堆太多参数，先看基础结果"], sourceLabel: "Midjourney Docs", sourceUrl: "https://docs.midjourney.com/hc/en-us/articles/33329261836941-Getting-Started-Guide", verifiedAt: checkedAt },
      { src: "/guides/midjourney/official-2.png", title: "Create生成结果", caption: "提交提示词后会得到一组结果，可以继续选择、变化、放大或进入编辑。", alt: "Midjourney官方文档截图，展示Create页面的生成结果", focus: ["先比较构图，再决定是否继续消耗生成时间", "查看结果对应的提示词与设置", "重要项目要保存原图和提示词版本"], sourceLabel: "Midjourney Docs", sourceUrl: "https://docs.midjourney.com/hc/en-us/articles/33329261836941-Getting-Started-Guide", verifiedAt: checkedAt },
      { src: "/guides/midjourney/official-3.webp", title: "继续修改与变化", caption: "选中图片后可以创建变化、缩放、扩展画布或进入Editor继续处理。", alt: "Midjourney官方文档截图，展示图片修改与变化工具", focus: ["Vary用于探索相近版本", "Pan和Zoom Out用于扩展画面", "Editor可局部重绘；导出前检查细节和授权"], sourceLabel: "Midjourney Docs", sourceUrl: "https://docs.midjourney.com/hc/en-us/articles/33329261836941-Getting-Started-Guide", verifiedAt: checkedAt },
    ],
    officialSources: [
      { label: "Midjourney官方入门指南", url: "https://docs.midjourney.com/hc/en-us/articles/33329261836941-Getting-Started-Guide" },
      { label: "Midjourney当前版本说明", url: "https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version" },
      { label: "Midjourney网页功能总览", url: "https://docs.midjourney.com/hc/en-us/articles/33329460426765-Website-Overview" },
      { label: "Midjourney Editor官方说明", url: "https://docs.midjourney.com/hc/en-us/articles/32764383466893-Editor" },
      { label: "Midjourney套餐对比", url: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans" },
      { label: "Midjourney官方文档首页", url: "https://docs.midjourney.com/hc/en-us" },
    ],
    benchmarks: [],
    setupSteps: ["只从midjourney.com进入，并使用自己的账号登录。", "打开Manage Subscription，比较Basic、Standard、Pro与Mega的月付、年付和自动续费。", "订阅后进入Create页面，在Imagine栏输入一个简短、明确的画面描述。", "从生成结果中选择一张，尝试Vary、Zoom Out或Editor，并记录消耗的Fast时间。", "进入Organize整理作品，再检查公开范围、下载、商业使用和自动续费设置。"],
    prompts: [
      { title: "产品概念图", text: "极简桌面上的【产品】，柔和侧光，真实材质，商业摄影，留出标题空间，横向16:9。" },
      { title: "品牌情绪板", text: "为【品牌主题】创建情绪板，关键词：【三个关键词】，统一色彩与材质，不出现文字和商标。" },
      { title: "人物一致性", text: "使用这张参考图保持人物主要特征，改变为【场景】和【服装】，自然光，纪实摄影。" },
      { title: "局部修改", text: "保持整体构图和光线，只把选中区域改成【目标内容】，边缘自然融合。" },
      { title: "安全自检", text: "生成前列出可能涉及的肖像、商标、版权、隐私和误导风险，并给出更安全的替代方案。" },
    ],
    privacy: ["Midjourney社区以公开分享为重要特征，敏感素材上传前先检查可见范围。", "不要上传客户机密、未授权人物照片、证件或未公开产品。", "Stealth只在特定高阶套餐提供，不能把普通套餐默认当作私密。", "商业使用前阅读最新服务条款；品牌、肖像与素材授权仍由使用者负责。"],
    regionNote: "官方主要通过网页和Discord提供服务。注册、订阅、付款与访问能力会受所在地区、网络和付款方式影响；本站不提供第三方客户端或修改版安装包。",
    verifiedAt: checkedAt,
  },
];

const baseSubscriptionOffers: SubscriptionOffer[] = [
  {
    slug: "chatgpt-recharge", name: "ChatGPT Plus", productSlug: "chatgpt", mark: "C", useCase: "提供共享使用、独享账号和本人账号充值三种购买方式，可按预算与账号需求选择。",
    whySelected: "通用能力覆盖最广，适合作为多数人的第一款AI，也最容易遇到官方支付与账号地区问题。", freeAdvice: "第一次使用先体验免费版；只有经常上传文件、生成图片或遇到用量限制时再考虑Plus。",
    officialPrice: "US$20 / 月", officialCny: "约 ¥135.49", gamsgoPrice: "US$5.77 起", gamsgoCny: "共享、独享与本人账号充值价格不同", priceNote: "三种方式的账号归属与使用方式不同；最终价格、周期和库存以GamsGo购买页为准。",
    officialUrl: "https://chatgpt.com/pricing/",
    deliveryType: "多种方式", risk: "medium", riskLabel: "", ownership: "可能是独立账号交付，不一定是本人原账号。选择充值方式时，会员开通在自己的账号上。", privacy: "不同购买方式的记录与隐私范围不同，请按商品说明选择", renewal: "按所选周期续费，具体规则以订单页为准", support: "联系客服处理 · 7×24小时", payment: "Visa、Mastercard、Apple Pay、Google Pay、银联、支付宝等；以GamsGo结算页为准", paymentNote: "共享订阅：1个月订阅暂不支持支付宝，3个月、6个月均支持支付宝付款。页面显示会随访问网络变化：使用中国大陆网络直接访问时通常只显示1个月；使用境外网络（需要连接机场或VPN）时可能显示1个月、3个月和6个月。请以打开购买页后实际显示为准。", region: "",
    sourceUrl: "https://www.gamsgo.com/details/chatgpt", affiliateUrl: "https://www.gamsgo.com/details/chatgpt/partner/BTzCM",
    purchaseQrCodes: [
      { label: "共享 / 独享账号", image: "/qr/gamsgo-chatgpt-account.png", url: "https://www.gamsgo.com/details/chatgpt/partner/BTzCM" },
      { label: "本人账号充值", image: "/qr/gamsgo-chatgpt-recharge.png", url: "https://www.gamsgo.com/details/chatgpt-recharge/partner/BTzCM" },
    ],
    priceVerifiedAt: "2026-07-18", verifiedAt: checkedAt,
  },
  {
    slug: "claude", name: "Claude Pro / Max", productSlug: "claude", mark: "A", useCase: "获得更高的 Claude 使用额度、模型和付费功能。",
    whySelected: "长文档、自然写作和持续对话是它的代表性场景，适合需要阅读与整理大量材料的人。", freeAdvice: "先用免费版测试长文、写作和文件阅读；用量经常不足时再选择Pro，Max不适合只为尝鲜的新手。",
    officialPrice: "Pro US$20 / 月", officialCny: "约 ¥135.49", gamsgoPrice: "暂时无法核验", gamsgoCny: "以购买页实时显示为准", priceNote: "GamsGo 原 Claude 商品页现已转到市场中心；价格、交付方式和售后条件由具体商品与卖家决定，需进入购买页逐项比较。",
    officialUrl: "https://www.anthropic.com/pricing",
    deliveryType: "多种方式", risk: "high", riskLabel: "", ownership: "市场中心可能包含独享、共享、充值或其他交付方式；必须以具体商品说明为准", privacy: "交付账号不要存放公司机密或个人敏感资料；收到账号后检查恢复方式、二次验证和密码权限", renewal: "确认到期后账号能否继续使用，以及卖家保障期覆盖多久", support: "联系客服处理 · 7×24小时", payment: "Visa、Mastercard、Apple Pay、Google Pay、银联、支付宝等；以GamsGo结算页为准", region: "Claude本身有支持地区限制",
    sourceUrl: "https://www.gamsgo.com/zh/accounts/claude", affiliateUrl: "https://www.gamsgo.com/zh/accounts/claude/partner/BTzCM",
    purchaseChannels: [
      { label: "GamsGo 当前购买页", title: "比较不同商品与卖家", note: "查看交付类型、卖家评分、发货速度与保障期", url: "https://www.gamsgo.com/zh/accounts/claude/partner/BTzCM" },
    ],
    marketplaceSummary: "市场中心是多卖家交易区，同一页面可能同时出现独享账号、共享账号、本人账号充值、激活码或API等不同商品。价格、卖家评分、发货时间和保障期各不相同，购买前要先确认商品类型、账号归属与售后条件。",
    priceVerifiedAt: "2026-07-18", verifiedAt: checkedAt,
  },
  {
    slug: "gemini", name: "Gemini / Google AI Pro", productSlug: "gemini", mark: "G", useCase: "获得Gemini高级功能、更多用量及Google生态权益。",
    whySelected: "与Google账号、云盘和办公生态联系紧密，适合已经长期使用Google服务的人。", freeAdvice: "普通问答和简单总结先用免费版；确认确实需要高级模型、研究能力或Google存储权益后再付费。",
    officialPrice: "US$19.99 / 月参考", officialCny: "约 ¥135.42", gamsgoPrice: "US$10.49 / 3个月起", gamsgoCny: "提供3、12、18个月方案", priceNote: "3个月和18个月为本人账号充值；12个月由平台提供账号。最终价格、库存与交付方式以GamsGo购买页为准。",
    officialUrl: "https://one.google.com/about/google-ai-plans/",
    deliveryType: "多种方式", risk: "high", riskLabel: "", ownership: "3个月和18个月充值到本人账号；12个月由平台提供账号", privacy: "本人账号充值更适合保留个人资料；平台提供的账号不要存放私人Gmail、照片或云盘文件", renewal: "确认云存储和订阅到期后的数据处理", support: "联系客服处理 · 7×24小时", payment: "Visa、Mastercard、Apple Pay、Google Pay、银联、支付宝等；以GamsGo结算页为准", region: "权益和存储容量随地区与产品变化",
    sourceUrl: "https://www.gamsgo.com/zh/details/gemini", affiliateUrl: "https://www.gamsgo.com/zh/details/gemini/partner/BTzCM",
    priceVerifiedAt: "2026-07-18", verifiedAt: checkedAt,
  },
  {
    slug: "grok", name: "SuperGrok", productSlug: "grok", mark: "X", useCase: "提升Grok模型、搜索、图片视频与高级功能的使用额度。",
    whySelected: "它与X平台和即时公开内容联系紧密，适合关注实时话题、社交内容和多媒体功能的人。", freeAdvice: "先确认免费入口和X中的Grok是否已满足需求；还要分清SuperGrok与X Premium不是同一订阅。",
    officialPrice: "US$30 / 月", officialCny: "约 ¥203.24", gamsgoPrice: "US$17.99 / 月", gamsgoCny: "充值到自己的账号", priceNote: "GamsGo当前展示为本人账号充值方案；最终价格、库存与开通说明以购买页为准。",
    officialUrl: "https://x.ai/pricing",
    deliveryType: "本人账号充值", risk: "medium", riskLabel: "", ownership: "会员充值到购买者自己的账号", privacy: "不要把X账号密码交给不明页面", renewal: "确认SuperGrok与X Premium不是同一订阅", support: "联系客服处理 · 7×24小时", payment: "Visa、Mastercard、Apple Pay、Google Pay、银联、支付宝等；以GamsGo结算页为准", region: "Grok与商店可用性随地区变化",
    sourceUrl: "https://www.gamsgo.com/details/grok", affiliateUrl: "https://www.gamsgo.com/details/grok/partner/BTzCM",
    priceVerifiedAt: "2026-07-18", verifiedAt: checkedAt,
  },
  {
    slug: "perplexity", name: "Perplexity Pro", productSlug: "perplexity", mark: "P", useCase: "获得更多研究、文件分析、模型选择和高级搜索能力。",
    whySelected: "回答旁边直接显示资料来源，适合查资料、做比较和快速建立研究脉络。", freeAdvice: "先用免费版完成几次带来源的搜索，并打开原文检查引用；需要更深研究和更多模型时再付费。",
    officialPrice: "US$17 / 月（年付折算）", officialCny: "约 ¥115.17", gamsgoPrice: "US$34.99 / 3个月起", gamsgoCny: "提供3、6、12个月方案", priceNote: "三档方案均充值到购买者自己的Perplexity账号；最终价格、库存与开通说明以GamsGo购买页为准。",
    officialUrl: "https://www.perplexity.ai/pro",
    deliveryType: "本人账号充值", risk: "high", riskLabel: "", ownership: "会员充值到购买者自己的Perplexity账号", privacy: "充值前确认订单页面不要求提供账号密码或其他敏感信息", renewal: "确认到期后历史记录能否导出", support: "联系客服处理 · 7×24小时", payment: "Visa、Mastercard、Apple Pay、Google Pay、银联、支付宝等；以GamsGo结算页为准", region: "模型和用量随地区、套餐变化",
    sourceUrl: "https://www.gamsgo.com/zh/details/perplexity_ai", affiliateUrl: "https://www.gamsgo.com/zh/details/perplexity_ai/partner/BTzCM",
    priceVerifiedAt: "2026-07-18", verifiedAt: checkedAt,
  },
  {
    slug: "midjourney", name: "Midjourney", productSlug: "midjourney", mark: "M", useCase: "生成高质量图片，适合创意、设计、营销和视觉探索。",
    whySelected: "它代表专业图片生成场景，与前五项文字和研究型AI形成互补。", freeAdvice: "先确认自己是否真的需要持续生成图片；偶尔做图的人不一定需要长期月付。",
    officialPrice: "以Midjourney计划页为准", officialCny: "未稳定读取", gamsgoPrice: "US$24.99 / 月公开参考", gamsgoCny: "约 ¥169.30", priceNote: "GamsGo公开页同时提供独立账号与共享网页方式，两者体验和风险不同。",
    officialUrl: "https://www.midjourney.com/plans/",
    deliveryType: "多种方式", risk: "high", riskLabel: "", ownership: "独立账号与共享网页的账号控制权不同", privacy: "共享环境不要上传私人图片或商业机密素材", renewal: "确认Fast/Relax额度和到期处理", support: "联系客服处理 · 7×24小时", payment: "Visa、Mastercard、Apple Pay、Google Pay、银联、支付宝等；以GamsGo结算页为准", region: "官方平台和Discord功能可能受地区影响",
    sourceUrl: "https://www.gamsgo.com/details/midjourney_official/partner/2MGZTK", affiliateUrl: "https://www.gamsgo.com/details/midjourney_official/partner/2MGZTK", verifiedAt: checkedAt,
  },
];

function syncedSubscriptionOffer(offer: SubscriptionOffer): SubscriptionOffer {
  const synced = autoSync.gamsgo.find((item) => item.slug === offer.slug);
  const pricing = (subscriptionPricing.offers as Record<string, {
    officialUsd?: number;
    verifiedAt: string;
    options?: NonNullable<SubscriptionOffer["purchaseOptions"]>;
  }>)[offer.slug];
  const referenceTime = new Date(autoSync.checkedAt).getTime();
  const manualVerifiedTime = pricing?.verifiedAt
    ? new Date(`${pricing.verifiedAt}T23:59:59+08:00`).getTime()
    : Number.NaN;
  const manualPricingIsFresh = Number.isFinite(referenceTime)
    && Number.isFinite(manualVerifiedTime)
    && referenceTime >= manualVerifiedTime
    && referenceTime - manualVerifiedTime <= 14 * 24 * 60 * 60 * 1000;
  const syncedEvidenceTime = synced?.lastSuccessfulAt || synced?.checkedAt;
  const syncedEvidenceTimestamp = syncedEvidenceTime ? new Date(syncedEvidenceTime).getTime() : Number.NaN;
  const staleSnapshotIsFresh = synced?.state === "stale"
    && Number.isFinite(referenceTime)
    && Number.isFinite(syncedEvidenceTimestamp)
    && referenceTime >= syncedEvidenceTimestamp
    && referenceTime - syncedEvidenceTimestamp <= 7 * 24 * 60 * 60 * 1000;
  const syncedPricingIsSafe = Boolean(
    synced
    && (["ok", "price-changed"].includes(synced.state) || staleSnapshotIsFresh)
    && synced.published,
  );
  const purchaseOptions = manualPricingIsFresh && syncedPricingIsSafe
    ? pricing?.options?.map((option) => ({ ...option }))
    : undefined;
  const firstOption = purchaseOptions?.[0];
  const officialCny = pricing?.officialUsd !== undefined
    ? formatCnyPrice(pricing.officialUsd)
    : offer.officialCny;
  const offerWithCurrentPricing: SubscriptionOffer = {
    ...offer,
    officialCny,
    purchaseOptions,
    priceVerifiedAt: purchaseOptions?.length ? pricing?.verifiedAt : (synced?.lastSuccessfulAt || synced?.checkedAt)?.slice(0, 10),
    gamsgoPrice: firstOption ? `${formatUsdPrice(firstOption.usd, firstOption.suffix)} 起` : offer.gamsgoPrice,
    gamsgoCny: firstOption ? `${formatCnyPrice(firstOption.usd, firstOption.suffix)} 起` : offer.gamsgoCny,
  };
  if (purchaseOptions?.length) return offerWithCurrentPricing;

  if (!synced || !syncedPricingIsSafe || !synced.published) {
    return {
      ...offerWithCurrentPricing,
      purchaseOptions: undefined,
      gamsgoPrice: "暂时无法核验",
      gamsgoCny: "以购买页实时显示为准",
      priceNote: synced?.state === "price-change-pending"
        ? "读取到价格明显变化，正在等待第二次一致结果；为避免误导，暂时隐藏具体数字。"
        : synced?.state === "conflict"
          ? "同一公开页面出现多个互相冲突的月付价格；本站已隐藏数字，等待商家页面统一或人工复核。"
          : "公开页面暂时无法稳定读取月付价格；不要把旧价格当作当前价格。",
      priceVerifiedAt: synced?.checkedAt.slice(0, 10) || autoSync.checkedAt.slice(0, 10),
    };
  }

  const currencyLabel = synced.published.currency === "SGD" ? "S$" : synced.published.currency === "USD" ? "US$" : synced.published.currency;
  const planLabel = offer.slug === "claude" ? "Max方案 " : "";
  return {
    ...offerWithCurrentPricing,
    gamsgoPrice: `${planLabel}${currencyLabel}${synced.published.value.toFixed(2)} / 月公开起价`,
    gamsgoCny: synced.cny ? `约 ¥${synced.cny.toFixed(2)}` : "人民币参考价待核验",
    priceNote: `${synced.note}${synced.state === "price-changed" ? "；价格明显变动，已连续两次读取一致" : ""}。${offer.priceNote}`,
    purchaseOptions: undefined,
    priceVerifiedAt: (synced.lastSuccessfulAt || synced.checkedAt).slice(0, 10),
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
    screenshots: [
      { src: "/guides/youtube/official-1.jpg", title: "首页与视频播放", caption: "首页由推荐内容组成；有明确目标时，优先搜索或从订阅页开始。", alt: "YouTube官方App Store截图，展示首页与视频", focus: ["顶部搜索用于主动找主题", "频道名称和发布时间比封面更重要", "推荐内容不代表已核实"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/youtube/id544007664", verifiedAt: checkedAt },
      { src: "/guides/youtube/official-2.jpg", title: "Shorts与快速浏览", caption: "短视频适合发现内容，但连续推荐容易占用时间，可在设置中管理提醒。", alt: "YouTube官方App Store截图，展示Shorts界面", focus: ["向上滑动切换内容", "点击频道检查完整资料", "设置观看时长与休息提醒"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/youtube/id544007664", verifiedAt: checkedAt },
      { src: "/guides/youtube/official-3.jpg", title: "订阅与个人资料库", caption: "把真正想长期关注的频道加入订阅，再用播放列表整理学习路径。", alt: "YouTube官方App Store截图，展示订阅与资料库", focus: ["Subscriptions查看主动关注", "You中管理历史和播放列表", "铃铛通知只为少数重要频道开启"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/youtube/id544007664", verifiedAt: checkedAt },
    ],
    setupSteps: ["只从Google Play或Apple App Store安装。", "使用本人Google账号登录。", "在设置中检查历史记录、自动播放和通知。", "需要离线观看时确认所在地区与Premium权益。"],
    languageSteps: ["点击头像进入Settings。", "在Language或App language中选择简体中文。", "内容地区与界面语言是两项不同设置。"],
    safety: ["不要安装所谓去广告破解版。", "订阅家庭组前确认成员地区和家庭组规则。", "儿童使用应配置家长监督。"],
    regionNote: "YouTube及Premium并非所有地区都提供相同功能；离线内容只能在官方App内播放。",
    officialSources: [
      { label: "YouTube 官方安装说明", url: "https://support.google.com/youtube/answer/3227660" },
      { label: "YouTube Premium 官方说明", url: "https://support.google.com/youtube/answer/16475192" },
      { label: "YouTube 直播官方说明", url: "https://support.google.com/youtube/answer/2474026" },
    ], verifiedAt: checkedAt,
  },
  {
    slug: "x", name: "X", company: "X Corp.", mark: "X", tagline: "实时信息、公共讨论、创作者与社区平台", summary: "适合关注新闻、趋势、专业账号和公开讨论，也与Grok实时信息能力结合。",
    downloads: [
      { platform: "Web", label: "X 网页版", url: "https://x.com/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.twitter.android", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/x/id333903271", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    screenshots: [
      { src: "/guides/x/official-1.webp", title: "For You与Following信息流", caption: "For You由系统推荐，Following更接近你主动关注的账号；查资料时不要混用。", alt: "X官方Google Play截图，展示信息流", focus: ["顶部切换两种信息流", "查看账号与帖子发布时间", "高互动不等于内容正确"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=com.twitter.android", verifiedAt: checkedAt },
      { src: "/guides/x/official-2.webp", title: "帖子、图片与公开讨论", caption: "打开完整帖子、引用和外部链接，避免只看被截取的一句话。", alt: "X官方Google Play截图，展示公开帖子与互动", focus: ["点击时间打开原帖", "查看引用帖和上下文", "私信链接与假客服风险更高"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=com.twitter.android", verifiedAt: checkedAt },
      { src: "/guides/x/official-3.webp", title: "Spaces与实时交流", caption: "Spaces用于实时语音讨论，适合听当事方和专业人士交流，但发言仍属于观点。", alt: "X官方Google Play截图，展示Spaces语音空间", focus: ["先看主持人与主题", "区分现场说法和正式公告", "不要在公开空间透露个人信息"], sourceLabel: "Google Play", sourceUrl: "https://play.google.com/store/apps/details?id=com.twitter.android", verifiedAt: checkedAt },
    ],
    setupSteps: ["从x.com或官方商店进入。", "使用本人邮箱或手机号注册并保存恢复方式。", "开启二次验证并保存备份码。", "调整隐私、私信和敏感内容设置。"],
    languageSteps: ["进入Settings and privacy。", "选择Accessibility, display, and languages。", "在Languages中设置界面和内容语言。"],
    safety: ["不要把热帖当作已核实新闻。", "警惕假客服、假认证和私信钓鱼链接。", "卸载前保存尚未发布的草稿和二次验证备份码。"],
    regionNote: "X应用与部分内容可能受地区、年龄和商店政策影响；X Premium与SuperGrok为不同产品。",
    officialSources: [
      { label: "X 官方下载说明", url: "https://help.x.com/en/using-x/download-the-x-app" },
      { label: "X Premium 等级与功能", url: "https://help.x.com/en/using-x/x-premium" },
      { label: "X Lists 官方说明", url: "https://help.x.com/en/using-x/x-lists" },
      { label: "X Spaces 官方说明", url: "https://help.x.com/en/using-x/spaces" },
      { label: "X Communities 官方说明", url: "https://help.x.com/en/using-x/communities" },
    ], verifiedAt: checkedAt,
  },
  {
    slug: "tiktok", name: "TikTok", company: "TikTok Ltd.", mark: "T", tagline: "短视频、直播、创作和内容发现平台", summary: "用于发现和发布短视频、直播、互动以及创作者内容。",
    downloads: [
      { platform: "Web", label: "TikTok 网页版", url: "https://www.tiktok.com/", source: "official", status: "verified", verifiedAt: checkedAt },
      { platform: "Android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically", source: "google-play", status: "verified", verifiedAt: checkedAt },
      { platform: "iOS", label: "Apple App Store", url: "https://apps.apple.com/us/app/tiktok/id835599320", source: "app-store", status: "verified", verifiedAt: checkedAt },
    ],
    screenshots: [
      { src: "/guides/tiktok/official-1.png", title: "TikTok国际版入口", caption: "TikTok与中国大陆的抖音不是同一产品，账号、内容、商店和数据不互通。", alt: "TikTok官方App Store截图，展示国际版界面", focus: ["确认开发者与官方商店条目", "不要使用抖音账号直接套用", "功能会受地区、年龄和设备影响"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/tiktok/id835599320", verifiedAt: checkedAt },
      { src: "/guides/tiktok/official-2.webp", title: "For You推荐流", caption: "推荐会根据停留、互动、搜索和内容信息变化，可以主动训练，也要管理使用时间。", alt: "TikTok官方App Store截图，展示For You短视频流", focus: ["For You与Following用途不同", "长按选择Not interested", "设置屏幕时间和休息提醒"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/tiktok/id835599320", verifiedAt: checkedAt },
      { src: "/guides/tiktok/official-3.webp", title: "拍摄、编辑与发布", caption: "发布前要检查可见范围、评论、下载、合拍以及画面和音乐授权。", alt: "TikTok官方App Store截图，展示短视频创作", focus: ["先保存草稿并备份原素材", "检查人物、地点和版权", "未成年人优先配置Family Pairing"], sourceLabel: "Apple App Store", sourceUrl: "https://apps.apple.com/us/app/tiktok/id835599320", verifiedAt: checkedAt },
    ],
    setupSteps: ["从TikTok官网或官方商店进入。", "使用本人邮箱、手机号或官方支持的第三方账号注册。", "设置用户名、生日与隐私选项。", "检查评论、私信、下载和推荐权限。"],
    languageSteps: ["进入Profile后打开Settings and privacy。", "选择Language。", "分别设置App language和Preferred languages。"],
    safety: ["不要安装修改版APK或共享陌生账号。", "警惕直播、私信和评论中的付款链接。", "未成年人应配置Family Pairing与使用时长。"],
    regionNote: "TikTok与中国大陆的抖音是不同产品；账号地区、SIM卡、商店地区和网络环境都可能影响功能。",
    officialSources: [
      { label: "TikTok 官方网站", url: "https://www.tiktok.com/" },
      { label: "For You 推荐流官方说明", url: "https://support.tiktok.com/en/getting-started/for-you/test-for-you" },
      { label: "未成年人隐私与安全设置", url: "https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/privacy-and-safety-settings-for-users-under-age-18/" },
    ], verifiedAt: checkedAt,
  },
];

export const networkClientDownloads = [
  { platform: "Windows" as Platform, label: "GitHub正式版发布页", url: "https://github.com/clash-verge-rev/clash-verge-rev/releases/latest", source: "official" as const, status: "automatic" as VerificationStatus, verifiedAt: checkedAt, product: "Clash Verge Rev", slug: "clash-verge", category: "网络客户端" as const },
  { platform: "macOS" as Platform, label: "GitHub正式版发布页", url: "https://github.com/clash-verge-rev/clash-verge-rev/releases/latest", source: "official" as const, status: "automatic" as VerificationStatus, verifiedAt: checkedAt, product: "Clash Verge Rev", slug: "clash-verge", category: "网络客户端" as const },
  { platform: "Windows" as Platform, label: "GitHub正式版发布页", url: "https://github.com/2dust/v2rayN/releases/latest", source: "official" as const, status: "automatic" as VerificationStatus, verifiedAt: checkedAt, product: "v2rayN", slug: "v2rayn", category: "网络客户端" as const },
  { platform: "Android" as Platform, label: "GitHub正式版发布页", url: "https://github.com/chen08209/FlClash/releases/latest", source: "official" as const, status: "automatic" as VerificationStatus, verifiedAt: checkedAt, product: "FlClash", slug: "flclash", category: "网络客户端" as const },
  { platform: "Android" as Platform, label: "官方项目发布页", url: "https://github.com/hiddify/hiddify-app/releases/latest", source: "official" as const, status: "automatic" as VerificationStatus, verifiedAt: checkedAt, product: "Hiddify", slug: "hiddify", category: "网络客户端" as const },
  { platform: "macOS" as Platform, label: "官方项目发布页", url: "https://github.com/hiddify/hiddify-app/releases/latest", source: "official" as const, status: "automatic" as VerificationStatus, verifiedAt: checkedAt, product: "Hiddify", slug: "hiddify", category: "网络客户端" as const },
  { platform: "iOS" as Platform, label: "Apple App Store", url: "https://apps.apple.com/us/app/shadowrocket/id932747118", source: "app-store" as const, status: "verified" as VerificationStatus, verifiedAt: checkedAt, product: "Shadowrocket", slug: "shadowrocket", category: "网络客户端" as const },
  { platform: "iOS" as Platform, label: "Apple App Store", url: "https://apps.apple.com/us/app/quantumult-x/id1443988620", source: "app-store" as const, status: "verified" as VerificationStatus, verifiedAt: checkedAt, product: "Quantumult X", slug: "quantumult-x", category: "网络客户端" as const },
  { platform: "iOS" as Platform, label: "Apple App Store", url: "https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349", source: "app-store" as const, status: "verified" as VerificationStatus, verifiedAt: checkedAt, product: "Stash", slug: "stash", category: "网络客户端" as const },
  { platform: "macOS" as Platform, label: "官方网站", url: "https://nssurge.com/", source: "official" as const, status: "verified" as VerificationStatus, verifiedAt: checkedAt, product: "Surge", slug: "surge", category: "网络客户端" as const },
];

export const allDownloads = [
  ...aiProducts.flatMap((product) => product.downloads.map((download) => ({ ...download, product: product.name, slug: product.slug, category: "AI" as const }))),
  ...commonApps.flatMap((app) => app.downloads.map((download) => ({ ...download, product: app.name, slug: app.slug, category: "常用应用" as const }))),
  ...networkClientDownloads,
];

export function getAiProduct(slug: string) {
  return aiProducts.find((product) => product.slug === slug);
}

export function getCommonApp(slug: string) {
  return commonApps.find((app) => app.slug === slug);
}

export function getOfferPriceStatus(slug: string): VerificationStatus {
  const synced = autoSync.gamsgo.find((item) => item.slug === slug);
  if (!synced) return "pending";
  if (synced.state === "ok" || synced.state === "price-changed") return "automatic";
  if (synced.state === "stale") return "stale";
  if (synced.state === "price-change-pending") return "pending";
  return "error";
}
