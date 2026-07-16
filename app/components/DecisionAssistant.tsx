"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Goal = "network" | "ai" | "subscription" | "download";

const goals: { id: Goal; label: string; note: string }[] = [
  { id: "network", label: "了解VPN和机场", note: "先判断要不要买，再选服务与客户端" },
  { id: "ai", label: "选一款AI", note: "按真实任务选，不背模型名称" },
  { id: "subscription", label: "购买AI会员", note: "比较官方与第三方购买风险" },
  { id: "download", label: "安全下载软件", note: "按设备进入官方来源" },
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
    { id: "google", label: "Google资料与服务" },
    { id: "realtime", label: "X和实时话题" },
    { id: "image", label: "专业图片创作" },
  ],
  subscription: [
    { id: "unsure", label: "不知道是否需要付费" },
    { id: "official", label: "重视账号与隐私" },
    { id: "payment", label: "官方付款不方便" },
    { id: "cheap", label: "主要想降低价格" },
  ],
  download: [
    { id: "windows", label: "Windows电脑" },
    { id: "macos", label: "Mac电脑" },
    { id: "android", label: "Android手机" },
    { id: "ios", label: "iPhone或iPad" },
  ],
};

const priorityOptions = [
  { id: "safe", label: "安全和账号归属" },
  { id: "easy", label: "操作尽量简单" },
  { id: "cost", label: "控制花费" },
  { id: "power", label: "功能和能力" },
];

type Result = { title: string; reason: string; caution: string; href: string; action: string };

function getResult(goal: Goal, need: string, priority: string): Result {
  if (goal === "network") {
    if (need === "budget") return { title: "先比较 WestData 的已核验月付", reason: "当前已核验的最低月付样本是 ¥20/200G，适合低预算或备用线路。", caution: "这只是价格与套餐证据，不代表速度第一；先看退款、倍率、设备数和售后。", href: "/nodes#services", action: "查看月付证据" };
    if (need === "coverage") return { title: "先看 TAG 的多地区路线", reason: "TAG 当前月付与流量已核验，收录理由是多国家/地区覆盖需求。", caution: "节点多不等于每个节点都快；大陆裸网可访问性和付款方式仍要按页面状态核对。", href: "/nodes#services", action: "查看TAG核验信息" };
    if (need === "easy") return { title: "先了解悠兔的自有客户端，再决定是否买", reason: "它提供多平台客户端入口，配置路线相对直观。", caution: "当前月付价格、流量和付款方式尚未完成实际复核，因此不建议只凭旧价下单。", href: "/nodes#pending", action: "查看待核验字段" };
    return { title: "先比较 Nexitally 的31天套餐", reason: "购买页已核验两档31天套餐，设备数和流量口径较清楚，适合重视长期使用的人先比较。", caution: "“老牌”不是永久稳定保证；先买最短周期，不一次购买很长时间。", href: "/nodes#services", action: "查看Nexitally资料" };
  }

  if (goal === "ai") {
    const map: Record<string, Result> = {
      general: { title: "先用 ChatGPT 免费版", reason: "覆盖问答、文件、图片、语音和办公，适合作为第一款综合型AI。", caution: "AI会出错；重要数字、引用和决定仍要自己核对。", href: "/ai/chatgpt", action: "打开ChatGPT小白教程" },
      writing: { title: "先用同一份长文测试 Claude", reason: "长文档、自然写作与持续协作是Claude的代表场景。", caution: "可用地区和用量会变化，先确认官网与账号地区。", href: "/ai/claude", action: "打开Claude小白教程" },
      research: { title: "先试 Perplexity 的带来源搜索", reason: "回答旁能直接打开引用，适合查资料、比较产品和建立研究入口。", caution: "有引用不等于结论正确，必须打开原文检查。", href: "/ai/perplexity", action: "打开Perplexity教程" },
      google: { title: "先试 Gemini", reason: "更靠近Google搜索、Gmail、Drive与Android生态。", caution: "连接邮箱或云盘前先检查授权范围，不要把所有资料一次性交出去。", href: "/ai/gemini", action: "打开Gemini教程" },
      realtime: { title: "先试 Grok 的实时内容能力", reason: "它更靠近X平台与公开实时话题。", caution: "热度、转发量和模型回答都不是事实证明。", href: "/ai/grok", action: "打开Grok教程" },
      image: { title: "持续做专业图片时再考虑 Midjourney", reason: "它的重点是图片与视频创作、风格控制、编辑和素材整理。", caution: "官方当前需要订阅；作品默认公开范围、商业条款和套餐自动续费都要先看。", href: "/ai/midjourney", action: "打开Midjourney教程" },
    };
    return map[need] || map.general;
  }

  if (goal === "subscription") {
    if (need === "unsure" || priority === "cost") return { title: "先不买：免费版连续试3—7天", reason: "只有经常碰到用量、模型或功能限制，会员才可能真正节省时间。", caution: "低价如果来自交付账号或共享网页，不能与本人官方订阅直接比较。", href: "/subscriptions#before-buy", action: "做购买前判断" };
    if (need === "official" || priority === "safe") return { title: "优先本人账号和官方订阅", reason: "账号、聊天记录、续费、找回和售后关系最直接。", caution: "付款前仍要检查地区、币种、税费、自动续费和取消入口。", href: "/subscriptions#offers", action: "比较官方与第三方" };
    return { title: "第三方只作为支付障碍下的替代方案", reason: "GamsGo可能提供不同付款与交付方式，但多了一层账号、隐私和售后关系。", caution: "下单前必须确认本人账号充值、独立账号还是共享网页；不要提供邮箱密码或验证码。", href: "/subscriptions#offers", action: "查看风险分级" };
  }

  const deviceMap: Record<string, { label: string; hash: string }> = {
    windows: { label: "Windows官方下载", hash: "windows" },
    macos: { label: "macOS官方下载", hash: "macos" },
    android: { label: "Android官方下载", hash: "android" },
    ios: { label: "iPhone与iPad官方下载", hash: "ios" },
  };
  const device = deviceMap[need] || deviceMap.windows;
  return { title: `进入${device.label}`, reason: "下载中心只连接官网、官方项目、Microsoft Store、Google Play或Apple App Store。", caution: "商店搜不到通常与网络、账号地区或设备兼容有关；不要改用网盘破解版或共享账号。", href: `/downloads#${device.hash}`, action: "按设备查看入口" };
}

export default function DecisionAssistant() {
  const [goal, setGoal] = useState<Goal>("ai");
  const [need, setNeed] = useState("general");
  const [priority, setPriority] = useState("safe");
  const result = useMemo(() => getResult(goal, need, priority), [goal, need, priority]);

  function chooseGoal(next: Goal) {
    setGoal(next);
    setNeed(needs[next][0].id);
  }

  return (
    <div className="decision-assistant">
      <div className="decision-assistant-head"><span>不用注册 · 选择只保存在当前页面</span><h2>回答三个小问题，得到一条起步路线</h2><p>它不会代替你付款，也不会收集账号信息。结论来自本站已经公开的核验资料。</p></div>
      <div className="decision-question"><strong><b>1</b>你现在最想解决什么？</strong><div>{goals.map((item) => <button type="button" key={item.id} aria-pressed={goal === item.id} onClick={() => chooseGoal(item.id)}><span>{item.label}</span><small>{item.note}</small></button>)}</div></div>
      <div className="decision-question"><strong><b>2</b>哪一种情况最接近你？</strong><div>{needs[goal].map((item) => <button type="button" key={item.id} aria-pressed={need === item.id} onClick={() => setNeed(item.id)}><span>{item.label}</span></button>)}</div></div>
      <div className="decision-question"><strong><b>3</b>你最在意什么？</strong><div>{priorityOptions.map((item) => <button type="button" key={item.id} aria-pressed={priority === item.id} onClick={() => setPriority(item.id)}><span>{item.label}</span></button>)}</div></div>
      <section className="decision-result" aria-live="polite"><div><span>根据你的选择，建议先做</span><h3>{result.title}</h3><p>{result.reason}</p></div><aside><strong>先注意</strong><p>{result.caution}</p><Link href={result.href}>{result.action} →</Link></aside></section>
    </div>
  );
}
