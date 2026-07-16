"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Goal = "network" | "ai" | "subscription" | "download";
type Device = "windows" | "macos" | "android" | "ios";
type Experience = "first" | "used" | "confident";

const goals: { id: Goal; label: string; note: string }[] = [
  { id: "network", label: "了解 VPN 和机场", note: "先判断需不需要，再看服务与客户端" },
  { id: "ai", label: "选一款 AI", note: "按真实任务选，不背模型名称" },
  { id: "subscription", label: "判断要不要买 AI 会员", note: "比较免费、官方与第三方方案" },
  { id: "download", label: "安全下载软件", note: "按设备进入官方来源并核对版本" },
];

const needs: Record<Goal, { id: string; label: string }[]> = {
  network: [
    { id: "budget", label: "预算低，先能用" },
    { id: "stable", label: "更重视长期使用" },
    { id: "coverage", label: "需要更多地区" },
    { id: "easy", label: "最怕安装配置" },
  ],
  ai: [
    { id: "general", label: "日常问答与办公" },
    { id: "writing", label: "长文档与写作" },
    { id: "research", label: "查资料并看来源" },
    { id: "google", label: "Google 资料与服务" },
    { id: "realtime", label: "X 和实时话题" },
    { id: "image", label: "专业图片创作" },
  ],
  subscription: [
    { id: "unsure", label: "不知道是否需要付费" },
    { id: "official", label: "重视账号与隐私" },
    { id: "payment", label: "官方付款不方便" },
    { id: "cheap", label: "主要想降低价格" },
  ],
  download: [
    { id: "first", label: "不知道应该下载哪个" },
    { id: "blocked", label: "官方入口打不开" },
    { id: "latest", label: "想确认是不是最新版" },
    { id: "verify", label: "已经下载，想检查安全" },
  ],
};

const deviceOptions: { id: Device; label: string }[] = [
  { id: "windows", label: "Windows 电脑" },
  { id: "macos", label: "Mac 电脑" },
  { id: "android", label: "Android 手机" },
  { id: "ios", label: "iPhone / iPad" },
];

const experienceOptions: { id: Experience; label: string; note: string }[] = [
  { id: "first", label: "完全第一次", note: "需要一步一步解释" },
  { id: "used", label: "用过一点", note: "知道账号和应用商店" },
  { id: "confident", label: "能自己排查", note: "更需要证据和最新版" },
];

const priorityOptions = [
  { id: "safe", label: "安全和账号归属" },
  { id: "easy", label: "操作尽量简单" },
  { id: "cost", label: "控制花费" },
  { id: "power", label: "功能和能力" },
];

type Result = {
  title: string;
  reason: string;
  caution: string;
  href: string;
  action: string;
  alternative: string;
  whyNot: string;
  steps: string[];
  evidence: string;
};

function networkResult(need: string, device: Device, experience: Experience): Result {
  const deviceStep = device === "ios"
    ? "先确认 Apple ID 地区，再看服务是否支持 Shadowrocket、Stash 等 iOS 客户端"
    : device === "android"
      ? "先确认服务支持 Android 客户端，再从官方项目页下载"
      : `先确认服务支持 ${device === "windows" ? "Windows" : "macOS"} 客户端，再导入订阅`;
  const basics = experience === "first" ? "先读懂 VPN、机场、节点和客户端四个概念" : "先确认你真正需要的地区、流量和设备数";
  if (need === "budget") return {
    title: "先比较 WestData 的已核验月付",
    reason: "当前已核验的最低月付样本是 ¥20/200G，适合作为低预算或备用线路的起点。",
    caution: "它不代表速度第一；购买页写明暂不支持退款，先检查倍率、设备数与使用限制。",
    href: "/nodes#services", action: "查看月付证据", alternative: "如果更怕安装，先看悠兔的自有客户端说明。",
    whyNot: "不先推荐更贵的服务，因为你把预算放在第一位，而稳定性仍需要自己短期实测。",
    steps: [basics, "只购买最短周期，不一次购买很长时间", deviceStep], evidence: "购买页人工核验 + 价格按实际月付排序",
  };
  if (need === "coverage") return {
    title: "先看 TAG 的多地区线路",
    reason: "TAG 的当前月付与流量已经核验，收录重点是多国家和地区覆盖。",
    caution: "节点多不等于每个节点都快；商店还写明服务仅限中国大陆，海外及新疆不可用。",
    href: "/nodes#services", action: "查看 TAG 核验资料", alternative: "如果主要看长期稳定而不是覆盖数量，再比较 Nexitally。",
    whyNot: "不按宣传中的节点数量直接判定最好，真实速度还受到时间、地区和本地网络影响。",
    steps: [basics, "先列出你必须使用的 2—3 个地区", deviceStep], evidence: "登录后商店人工核验 + 风险限制原文整理",
  };
  if (need === "easy") return {
    title: "先了解悠兔的自有客户端，再决定是否购买",
    reason: "后台已经确认 Windows、Android、iOS 与 macOS 客户端入口，配置路线相对直观。",
    caution: "当前月付价格、流量和付款方式仍待实际核验，所以不能只凭旧价下单。",
    href: "/nodes#pending", action: "查看待核验字段", alternative: "如果你愿意使用第三方客户端，可先看已核验月付服务。",
    whyNot: "有自有客户端只说明安装可能更简单，不等于套餐、速度和售后已经核验。",
    steps: [basics, deviceStep, "进入结算页后再确认周期、流量、退款与付款方式"], evidence: "登录后台已确认客户端；价格证据仍明确标为待核验",
  };
  return {
    title: "先比较 Nexitally 的 31 天套餐",
    reason: "购买页已经核验两档 31 天套餐，设备数、流量和周期口径比较清楚。",
    caution: "老牌不等于永久稳定；先买最短周期，在你自己的网络和常用时间测试。",
    href: "/nodes#services", action: "查看 Nexitally 资料", alternative: "需要更多地区时，改看 TAG；预算优先时，改看 WestData。",
    whyNot: "本站不会用品牌历史代替当前实测，也不会保证未来稳定。",
    steps: [basics, "对比 200G 与 500G 是否真的需要", deviceStep], evidence: "登录后购买页人工核验 + 套餐周期统一换算",
  };
}

function aiResult(need: string, device: Device): Result {
  const map: Record<string, Pick<Result, "title" | "reason" | "caution" | "href" | "action" | "alternative" | "whyNot">> = {
    general: { title: "先用 ChatGPT 免费版", reason: "它覆盖问答、文件、图片、语音和日常办公，适合当作第一款综合型 AI。", caution: "AI 会出错；重要数字、引用与决定仍要自己核对。", href: "/ai/chatgpt", action: "打开 ChatGPT 小白教程", alternative: "如果主要处理长文档，可同时用同一份材料测试 Claude。", whyNot: "不先按模型榜单选择，因为新手更需要稳定入口和完整的日常功能。" },
    writing: { title: "用同一份长文测试 Claude", reason: "长文档、自然写作与持续协作是 Claude 的代表场景。", caution: "可用地区和用量会变化，先确认官网与账号地区。", href: "/ai/claude", action: "打开 Claude 小白教程", alternative: "如果还需要语音、图片与综合工具，再比较 ChatGPT。", whyNot: "不直接说 Claude 一定最好；只有用你的真实文档对比，才知道写作风格是否合适。" },
    research: { title: "先试 Perplexity 的带来源搜索", reason: "回答旁能直接打开引用，适合查资料、比较产品和建立研究入口。", caution: "有引用不等于结论正确，必须打开原文检查。", href: "/ai/perplexity", action: "打开 Perplexity 教程", alternative: "需要继续写作或整理文件时，再把已核对资料交给 ChatGPT 或 Claude。", whyNot: "它更像研究入口，不应该替代原始来源或专业判断。" },
    google: { title: "先试 Gemini", reason: "它更靠近 Google 搜索、Gmail、Drive 与 Android 生态。", caution: "连接邮箱或云盘前先检查授权范围。", href: "/ai/gemini", action: "打开 Gemini 教程", alternative: "如果不依赖 Google 服务，用 ChatGPT 做综合对比。", whyNot: "生态整合是主要理由，不代表每一类任务的回答都更好。" },
    realtime: { title: "先试 Grok 的实时内容能力", reason: "它更靠近 X 平台与公开实时话题。", caution: "热度、转发量和模型回答都不是事实证明。", href: "/ai/grok", action: "打开 Grok 教程", alternative: "需要可打开的引用来源时，再用 Perplexity 复核。", whyNot: "实时更快不等于更准确，必须再找可靠来源交叉确认。" },
    image: { title: "持续做专业图片时再考虑 Midjourney", reason: "它专注图片与视频创作、风格控制、编辑和素材整理。", caution: "官方当前需要订阅；公开范围、商业条款和自动续费都要先看。", href: "/ai/midjourney", action: "打开 Midjourney 教程", alternative: "只偶尔生成图片时，先用已有综合 AI 的图片功能。", whyNot: "不建议只为尝鲜增加一个付费订阅。" },
  };
  const selected = map[need] || map.general;
  const deviceName = deviceOptions.find((item) => item.id === device)?.label || "当前设备";
  return { ...selected, steps: ["先用免费版完成一个真实任务", `优先在${deviceName}使用网页版或官方商店入口`, "对照教程核对结果、隐私与地区限制"], evidence: "官方功能资料 + 官方下载入口 + 独立第三方评测分开呈现" };
}

function subscriptionResult(need: string, priority: string): Result {
  if (need === "unsure" || priority === "cost") return {
    title: "先不买：免费版连续试 3—7 天", reason: "只有经常碰到用量、模型或功能限制，会员才可能真正节省时间。", caution: "低价如果来自交付账号或共享网页，不能与本人官方订阅直接比较。", href: "/subscriptions#before-buy", action: "做购买前判断", alternative: "记录一周使用次数，再用页面里的价值计算器判断。", whyNot: "省下 100% 不需要的会员费，比买到低价会员更划算。", steps: ["选一个真实任务连续使用免费版", "记录碰到限制的次数和节省的时间", "只在价值明显高于月费时购买最短周期"], evidence: "官方价格与第三方交付方式分栏，价格冲突时自动隐藏",
  };
  if (need === "official" || priority === "safe") return {
    title: "优先本人账号与官方订阅", reason: "账号、聊天记录、续费、找回和售后关系最直接。", caution: "付款前仍要检查地区、币种、税费、自动续费和取消入口。", href: "/subscriptions#offers", action: "比较官方与第三方", alternative: "官方付款确实无法完成时，再看本人账号充值，并核对授权方式。", whyNot: "第三方多一层账号、隐私与售后关系，不适合保存敏感或长期资料。", steps: ["先确认免费版不够用", "打开官方结算页核对最终金额", "付款后立即检查续费和取消入口"], evidence: "官方价、第三方公开价、人民币参考价和账号风险分别记录",
  };
  return {
    title: "第三方只作为付款障碍下的替代方案", reason: "GamsGo 可能提供不同付款与交付方式，但也增加账号、隐私和售后关系。", caution: "必须确认本人账号充值、独立账号还是共享网页；不要提供邮箱密码或验证码。", href: "/subscriptions#offers", action: "查看风险分级", alternative: "能官方购买时，仍优先官方本人账号。", whyNot: "价格差不能抵消账号找回、聊天隐私、功能不完整和售后风险。", steps: ["先打开商品资料页确认交付方式", "在结算页核对周期、币种和自动续费", "只买最短周期，不存放敏感资料"], evidence: "推广关系公开；风险等级不因佣金改变",
  };
}

function downloadResult(need: string, device: Device, experience: Experience): Result {
  const deviceName = deviceOptions.find((item) => item.id === device)?.label || "当前设备";
  const deviceMap: Record<Device, string> = { windows: "windows", macos: "macos", android: "android", ios: "ios" };
  const blockedAdvice = device === "ios" || device === "android" ? "商店搜不到时，先检查账号地区和设备兼容，不要改下陌生安装包。" : "官网打不开时，本站只为已校验开源项目提供固定版本备份；闭源软件仍不提供未知安装包。";
  return {
    title: `进入 ${deviceName} 官方下载区`, reason: "下载中心只连接官网、官方项目、Microsoft Store、Google Play 或 Apple App Store，并标出核验时间。", caution: need === "blocked" ? blockedAdvice : "不要下载破解版、网盘修改版或陌生人提供的共享账号。", href: `/downloads#${deviceMap[device]}`, action: "按设备查看入口", alternative: need === "latest" || experience === "confident" ? "开源客户端可同时核对项目地址、版本号与 SHA-256。" : "不知道选哪个时，先用网页版；确认需要后再安装。", whyNot: "本站不保存闭源安装包，因为脱离官方更新链后很难持续证明来源和完整性。", steps: ["确认产品名称、系统和官方开发者", "比较页面标注的版本与更新时间", need === "verify" ? "按页面教程计算 SHA-256 并与本站记录核对" : "下载后先扫描文件，再安装并检查权限"], evidence: "官方域名白名单 + 自动版本检查 + 开源固定版本校验值",
  };
}

function getResult(goal: Goal, need: string, device: Device, experience: Experience, priority: string) {
  if (goal === "network") return networkResult(need, device, experience);
  if (goal === "ai") return aiResult(need, device);
  if (goal === "subscription") return subscriptionResult(need, priority);
  return downloadResult(need, device, experience);
}

export default function DecisionAssistant() {
  const [goal, setGoal] = useState<Goal>("ai");
  const [need, setNeed] = useState("general");
  const [device, setDevice] = useState<Device>("windows");
  const [experience, setExperience] = useState<Experience>("first");
  const [priority, setPriority] = useState("safe");
  const result = useMemo(() => getResult(goal, need, device, experience, priority), [device, experience, goal, need, priority]);

  function chooseGoal(next: Goal) {
    setGoal(next);
    setNeed(needs[next][0].id);
  }

  function reset() {
    setGoal("ai"); setNeed("general"); setDevice("windows"); setExperience("first"); setPriority("safe");
  }

  return (
    <div className="decision-assistant">
      <div className="decision-assistant-head"><span>不用注册 · 不上传 · 可以随时重选</span><h2>回答五个小问题，得到一条能直接照做的路线</h2><p>它不会替你付款，也不会收集账号信息。推荐来自本站公开证据，并同时说明“为什么这样选”和“为什么不先选别的”。</p></div>

      <fieldset className="decision-question"><legend><b>1</b>你现在最想解决什么？</legend><div>{goals.map((item) => <button type="button" key={item.id} aria-pressed={goal === item.id} onClick={() => chooseGoal(item.id)}><span>{item.label}</span><small>{item.note}</small></button>)}</div></fieldset>
      <fieldset className="decision-question"><legend><b>2</b>哪一种情况最接近你？</legend><div>{needs[goal].map((item) => <button type="button" key={item.id} aria-pressed={need === item.id} onClick={() => setNeed(item.id)}><span>{item.label}</span></button>)}</div></fieldset>
      <fieldset className="decision-question compact"><legend><b>3</b>你主要使用哪台设备？</legend><div>{deviceOptions.map((item) => <button type="button" key={item.id} aria-pressed={device === item.id} onClick={() => setDevice(item.id)}><span>{item.label}</span></button>)}</div></fieldset>
      <fieldset className="decision-question"><legend><b>4</b>你对这些工具熟悉吗？</legend><div>{experienceOptions.map((item) => <button type="button" key={item.id} aria-pressed={experience === item.id} onClick={() => setExperience(item.id)}><span>{item.label}</span><small>{item.note}</small></button>)}</div></fieldset>
      <fieldset className="decision-question compact"><legend><b>5</b>你最在意什么？</legend><div>{priorityOptions.map((item) => <button type="button" key={item.id} aria-pressed={priority === item.id} onClick={() => setPriority(item.id)}><span>{item.label}</span></button>)}</div></fieldset>

      <section className="decision-result" aria-live="polite">
        <div className="decision-result-main"><span>根据你的选择，建议先做</span><h3>{result.title}</h3><p>{result.reason}</p><ol>{result.steps.map((step, index) => <li key={step}><b>{index + 1}</b><span>{step}</span></li>)}</ol><Link className="decision-primary-action" href={result.href}>{result.action} <span aria-hidden="true">→</span></Link></div>
        <aside><div><strong>先注意</strong><p>{result.caution}</p></div><div><strong>为什么不先选别的</strong><p>{result.whyNot}</p></div><div><strong>备选路线</strong><p>{result.alternative}</p></div><small>证据口径：{result.evidence}</small><button type="button" onClick={reset}>重新回答</button></aside>
      </section>
    </div>
  );
}
