import syncStatus from "../data/sync-status.json";
import "./award-system.css";
import promotionManifest from "../data/promotion-links.json";
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandIcon, BrandNotice, PageShell, SiteFooter, SiteHeader } from "./components/SiteChrome";
import DeviceChooser from "./components/DeviceChooser";
import StructuredData from "./components/StructuredData";
import BeginnerTroubleshooter from "./components/BeginnerTroubleshooter";
import { networkPlaybook } from "../data/beginner-playbooks";

const releaseVersions: Record<string, string | null> = Object.fromEntries(syncStatus.clients.map((client) => [client.repository, "version" in client && typeof client.version === "string" ? client.version : null]));
const releaseChecks: Record<string, (typeof syncStatus.clients)[number]> = Object.fromEntries(syncStatus.clients.map((client) => [client.repository, client]));
const linkChecks: Record<string, (typeof syncStatus.links)[number]> = Object.fromEntries(syncStatus.links.map((link) => [link.id, link]));
const promotionUrls = Object.fromEntries(promotionManifest.links.map((link) => [link.id, link.url])) as Record<string, string>;
const syncTime = syncStatus.checkedAt
  ? new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "medium", timeStyle: "short", hour12: false }).format(new Date(syncStatus.checkedAt))
  : "等待首次公开数据同步";

const basePath = process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : "";
const publicSiteUrl = process.env.GITHUB_PAGES === "true" ? "https://alsolisa.github.io/digital-tools-guide" : "http://localhost:3000";

function formatFileSize(size: number) {
  return size >= 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(size / 1024)} KB`;
}

export const metadata = { alternates: { canonical: `${basePath}/` } };

const services = [
  {
    name: "WestData",
    sortGroup: 0,
    sortPrice: 20,
    alias: "西部数据",
    tag: "中转 / 备用",
    price: "¥20",
    cycle: "/ 月",
    traffic: "200G",
    status: "购买页已核验",
    statusTone: "verified",
    verifiedAt: "2026-07-16",
    payment: "易支付（支付宝）、USDT-TRC20",
    monthly: "有月付 · 当前可订购",
    ownClient: "未发现明确自研客户端，以第三方客户端为主",
    description: "Silver ¥20/200GiB、Platinum ¥40/400GiB，最高500Mbps；Diamond ¥60/600GiB，最高1000Mbps；Ultimate ¥80/800GiB，最高2000Mbps。",
    caution: "购买页写明仅限个人使用、暂不支持退款；低价不等于适合所有人。",
    bestFor: "低预算、备用线路",
    linkId: "westdata",
    href: promotionUrls.westdata,
    linkLabel: "打开推广入口",
  },
  {
    name: "悠兔 Youtu",
    sortGroup: 1,
    sortPrice: 1,
    alias: "自有客户端",
    tag: "小白友好",
    price: "季付 / 半年付 / 年付",
    cycle: "",
    traffic: "月付暂停",
    status: "非月付方案",
    statusTone: "verified",
    verifiedAt: "2026-07-16",
    payment: "待付款页实际核验",
    monthly: "因运营安排暂时停止月付；当前以季付、半年付和年付为主",
    ownClient: "有 · Windows / Android / iOS / macOS",
    clientHref: "https://d.yoututz.top/ph/youtu",
    description: "提供 Windows、Android、iOS 与 macOS 自有客户端，也支持 Clash、ClashMeta 一键导入及 v2rayN 手动导入。当前主要提供季付、半年付和年付方案。",
    caution: "月付是否恢复暂未明确；购买前请打开当前套餐页确认周期、流量和最终价格。",
    bestFor: "希望安装步骤简单",
    linkId: "youtu",
    href: promotionUrls.youtu,
    linkLabel: "打开推广入口",
  },
  {
    name: "BoostNet",
    sortGroup: 1,
    sortPrice: 2,
    alias: "IEPL 专线",
    tag: "性价比",
    price: "季付 / 半年付 / 年付",
    cycle: "",
    traffic: "月付暂停",
    status: "非月付方案",
    statusTone: "verified",
    verifiedAt: "2026-07-13",
    payment: "待付款页实际核验",
    monthly: "因运营安排暂时停止月付；当前以季付、半年付和年付为主",
    ownClient: "有 · Windows / macOS / Android 一键客户端",
    clientHref: "https://d.yoututz.top/ph/bst",
    description: "当前提供季付、半年付和年付方案，可按预算与所需流量选择；购买前以计划页显示的周期和结算价格为准。",
    caution: "月付是否恢复暂未明确；如果只想短期试用，请先确认自己能接受当前最短购买周期。",
    bestFor: "多平台、重视性价比",
    linkId: "boostnet",
    href: promotionUrls.boostnet,
    linkLabel: "打开推广入口",
  },
  {
    name: "WgetCloud",
    active: false,
    sortGroup: 1,
    sortPrice: 2,
    alias: "原 GaCloud",
    tag: "高端平衡",
    price: "登录后核验",
    cycle: "",
    traffic: "160G 起",
    status: "价格待登录复核",
    statusTone: "pending",
    verifiedAt: null,
    payment: "微信、支付宝、USDT（官方帮助中心）",
    monthly: "有月付 · 官方文档已确认",
    ownClient: "未发现明确自研客户端，官方提供第三方教程",
    description: "官方现分基础、优质、精品三档。月付流量分别为 160G、180G、200G，不再使用旧资料里的 150G。",
    bestFor: "希望兼顾稳定与使用体验",
    href: "https://wgetcloud.ltd/",
    linkLabel: "打开官方永久入口",
  },
  {
    name: "Nexitally",
    sortGroup: 0,
    sortPrice: 74.55,
    alias: "奶昔 / 佩奇",
    tag: "老牌高端",
    price: "¥74.55",
    cycle: "/ 31 天",
    traffic: "200G",
    status: "购买页已核验",
    statusTone: "verified",
    verifiedAt: "2026-07-12",
    payment: "支付宝、账户余额",
    monthly: "31 天套餐 · 当前可购买",
    ownClient: "以第三方客户端为主，官方文档提供教程",
    description: "Air ¥74.55/200G；Smart Access ¥123.33/500G，均为31天、2台设备、最高2000Mbps。",
    bestFor: "重视稳定与长期使用",
    linkId: "nexitally",
    href: promotionUrls.nexitally,
    linkLabel: "打开官方入口",
  },
  {
    name: "TAG",
    sortGroup: 0,
    sortPrice: 114,
    alias: "全球覆盖",
    tag: "多地区节点",
    price: "¥114",
    cycle: "/ 月",
    traffic: "500G",
    status: "当前商店已核验",
    statusTone: "verified",
    verifiedAt: "2026-07-16",
    payment: "待付款页实际核验",
    monthly: "有月付 · Silver / Gold / Team 当前可购买",
    ownClient: "有 · 当前公告推荐内测自有客户端，同时支持第三方客户端",
    description: "Silver ¥114/500G；Gold ¥219/999G；Team ¥658/3000G，均为月付。另有 Bronze ¥185/季与 Special ¥162/年，不混入月付排名。",
    caution: "商店写明服务仅限中国大陆，海外及新疆不可用；不保证 TikTok 可用。覆盖与解锁描述属于商家说明。",
    bestFor: "多国家/地区节点需求",
    linkId: "tag",
    href: promotionUrls.tag,
    linkLabel: "打开当前入口",
  },
];

const sortedServices = services.filter((service) => service.active !== false).sort((a, b) => a.sortGroup - b.sortGroup || a.sortPrice - b.sortPrice);
const priceReferenceTime = new Date(syncStatus.checkedAt).getTime();
const priceFreshnessWindow = 14 * 24 * 60 * 60 * 1000;
function hasFreshPriceEvidence(service: (typeof services)[number]) {
  if (!service.verifiedAt) return false;
  const verifiedTime = new Date(`${service.verifiedAt}T23:59:59+08:00`).getTime();
  return Number.isFinite(priceReferenceTime) && Number.isFinite(verifiedTime) && priceReferenceTime >= verifiedTime && priceReferenceTime - verifiedTime <= priceFreshnessWindow;
}
const rankedMonthlyServices = sortedServices.filter((service) => service.sortGroup === 0 && hasFreshPriceEvidence(service));
const staleMonthlyServices = sortedServices.filter((service) => service.sortGroup === 0 && !hasFreshPriceEvidence(service));
const currentNonMonthlyServices = sortedServices.filter((service) => service.sortGroup !== 0 && hasFreshPriceEvidence(service));
const staleNonMonthlyServices = sortedServices.filter((service) => service.sortGroup !== 0 && !hasFreshPriceEvidence(service));

const clients = [
  {
    slug: "clash-verge",
    platform: "Windows / macOS / Linux",
    app: "Clash Verge Rev",
    repository: "clash-verge-rev/clash-verge-rev",
    version: releaseVersions["clash-verge-rev/clash-verge-rev"] || "v2.5.2",
    note: "新手首选。Windows 普通电脑通常选 x64；Mac 要区分 Apple 芯片与 Intel。",
    tone: "blue",
    download: "https://github.com/clash-verge-rev/clash-verge-rev/releases/latest",
    localFile: "Clash.Verge_2.5.2_x64-setup.exe",
    localVersion: "v2.5.2",
    localLabel: "本地下载 · Windows x64",
    tutorial: "https://nexitally-1.gitbook.io/nexitally-wen-dang-zhong-xin/nexitally-wen-dang-dao-hang/clash-verge",
  },
  {
    slug: "v2rayn",
    platform: "Windows",
    app: "v2rayN",
    repository: "2dust/v2rayN",
    version: releaseVersions["2dust/v2rayN"] || "7.24.4",
    note: "功能较多，适合需要更多协议的人。旧版存在安全风险，请只用当前正式版。",
    tone: "purple",
    download: "https://github.com/2dust/v2rayN/releases/latest",
    localUnavailable: "本地下载暂不提供 · 官方文件超过托管限制",
    tutorial: "https://github.com/2dust/v2rayN/wiki",
  },
  {
    slug: "flclash",
    platform: "Android",
    app: "FlClash",
    repository: "chen08209/FlClash",
    version: releaseVersions["chen08209/FlClash"] || "v0.8.94",
    note: "多数新安卓手机选择 arm64-v8a 安装包；不确定时先看手机处理器类型。",
    tone: "green",
    download: "https://github.com/chen08209/FlClash/releases/latest",
    localFile: "FlClash-0.8.94-android-arm64-v8a.apk",
    localVersion: "v0.8.94",
    localLabel: "本地下载 · Android ARM64",
    tutorial: "https://github.com/chen08209/FlClash#readme",
  },
  {
    slug: "hiddify",
    platform: "Windows / Android / iOS / macOS",
    app: "Hiddify",
    repository: "hiddify/hiddify-app",
    version: releaseVersions["hiddify/hiddify-app"] || "v4.1.1",
    note: "界面相对直观，覆盖多平台；下载时按照自己的设备系统选择文件。",
    tone: "green",
    download: "https://github.com/hiddify/hiddify-app/releases/latest",
    localFile: "Hiddify-Windows-Setup-x64-v4.1.1.exe",
    localVersion: "v4.1.1",
    localLabel: "本地下载 · Windows x64",
    tutorial: "https://hiddify.com/app/How-to-use-Hiddify-app/",
  },
  {
    slug: "shadowrocket",
    platform: "iPhone / iPad / Apple TV",
    app: "Shadowrocket",
    version: "App Store",
    note: "付费软件。只前往苹果商店，不提供第三方 IPA 或共享账号。",
    tone: "orange",
    download: "https://apps.apple.com/us/app/shadowrocket/id932747118",
    localUnavailable: "本地下载不可用 · 必须通过 App Store 安装",
    tutorial: "https://nexitally-1.gitbook.io/nexitally-wen-dang-zhong-xin/nexitally-wen-dang-dao-hang/shadowrocket-xiao-huo-jian",
  },
  {
    slug: "quantumult-x",
    platform: "iPhone / iPad / Mac",
    app: "Quantumult X",
    version: "App Store",
    note: "功能强但设置较多，适合愿意学习规则配置的进阶用户。",
    tone: "orange",
    download: "https://apps.apple.com/us/app/quantumult-x/id1443988620",
    localUnavailable: "本地下载不可用 · 必须通过 App Store 安装",
    tutorial: "https://nexitally-1.gitbook.io/nexitally-wen-dang-zhong-xin/nexitally-wen-dang-dao-hang/quantumult-x",
  },
  {
    slug: "stash",
    platform: "iPhone / iPad / Mac",
    app: "Stash",
    version: "App Store",
    note: "规则型客户端，界面清晰；购买前先确认服务商是否提供兼容订阅。",
    tone: "orange",
    download: "https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349",
    localUnavailable: "本地下载不可用 · 必须通过 App Store 安装",
    tutorial: "https://stash.wiki/",
  },
  {
    slug: "surge",
    platform: "macOS / iOS",
    app: "Surge",
    version: "官方网站",
    note: "专业网络工具，价格较高、学习成本也更高，不建议纯新手盲目购买。",
    tone: "purple",
    download: "https://nssurge.com/",
    localUnavailable: "本地下载不可用 · 闭源软件只使用官方渠道",
    tutorial: "https://manual.nssurge.com/",
  },
];

function ServiceCard({ service, index, prefix = "月付" }: { service: (typeof services)[number]; index: number; prefix?: string }) {
  const stalePrice = !hasFreshPriceEvidence(service);
  const isMonthly = service.sortGroup === 0;
  const linkId = "linkId" in service && typeof service.linkId === "string" ? service.linkId : null;
  const entryCheck = linkId ? linkChecks[linkId] : null;
  const entryTone = entryCheck?.state === "ok" ? "verified" : entryCheck?.state === "protected" ? "review" : "error";
  const entryLabel = entryCheck?.state === "ok" ? "入口已自动核验" : entryCheck?.state === "protected" ? "入口受防护 · 可手动打开" : "入口检查异常";
  return <article className="service-card">
    <div className="service-topline"><span className="service-tag">{prefix} {index + 1} · {service.tag}</span><span className={`status-pill ${entryTone}`}><i />{entryLabel}</span></div>
    <div className="service-title"><h3>{service.name}</h3><span>{service.alias}</span></div>
    {stalePrice && <p className="service-stale-note">以下内容是截至 {service.verifiedAt || "上次核验"} 的历史记录；其中“当前”“可购买”等表述只代表当次页面状态。</p>}
    <p className="service-description">{service.description}</p>
    <div className="service-stats"><div><small>{stalePrice ? (isMonthly ? "最近核验价格" : "最近记录的可选周期") : (isMonthly ? "可比参考价格" : "当前可选周期")}</small><strong>{service.price}</strong><span>{service.cycle}</span></div><div><small>{stalePrice ? (isMonthly ? "最近核验流量" : "最近记录的月付状态") : (isMonthly ? "参考流量" : "月付状态")}</small><strong>{service.traffic}</strong></div></div>
    {"caution" in service && service.caution && <p className="service-caution"><strong>购买前注意</strong>{service.caution}</p>}
    <div className="fact-line"><span>{stalePrice ? "月付记录" : "月付"}</span>{service.monthly}</div>
    <div className="fact-line"><span>客户端</span>{service.ownClient}{"clientHref" in service && service.clientHref && <a href={service.clientHref} target="_blank" rel="noopener noreferrer">自有客户端下载 ↗</a>}</div>
    <div className="payment-line"><span>付款</span>{service.payment}</div>
    <div className="best-for"><span>适合</span>{service.bestFor}</div>
    <a href={service.href} target="_blank" rel="sponsored noopener" className="card-action">{service.linkLabel} <span>↗</span></a>
    <Link className="service-feedback-link" href={`/feedback?type=${encodeURIComponent("价格或套餐变化")}&page=${encodeURIComponent(service.name)}`}>价格、付款或入口变了？告诉我们 →</Link>
  </article>;
}

function ServiceComparison({ sectionIndex = "02 / 机场推荐" }: { sectionIndex?: string }) {
  return (
    <section className="section services-section" id="services">
      <div className="section-heading">
        <div><span className="section-index">{sectionIndex}</span><h2>先看核验状态，再按预算和购买周期缩小范围</h2></div>
        <p>入口状态由发布程序自动检查；价格、流量与周期仍需人工读取。超过 14 天没有新价格证据的方案会退出“当前价格排序”，但可打开的入口仍会明确显示。</p>
      </div>
      <div className="selection-disclosure service-choice-intro">
        <strong>为什么提供这几家？</strong>
        <div><p>选择时主要比较稳定性、延迟、速度、节点覆盖、客户端体验和价格；不同地区、运营商和使用时间都可能造成明显差异，商家的宣传不能替代自己的短期测试。</p><p>先确定预算、设备与最短可接受周期，再打开服务商页面核对当前价格、流量、退款和限制。待复核卡片里的数字只代表最近一次人工记录，不代表今天仍可购买。</p></div>
      </div>
      {rankedMonthlyServices.length > 0
        ? <div className="sort-note"><strong>月付排序</strong><span>14 天内已核验、可单独购买的月付或约31天套餐，按起价从低到高</span><i />已核验</div>
        : <div className="sort-note"><strong>当前排序暂停</strong><span>本轮没有 14 天内的人工价格证据；请在购买页重新核对</span><i />待复核</div>}
      <div className="service-grid">
        {rankedMonthlyServices.map((service, index) => <ServiceCard service={service} index={index} key={service.name} />)}
      </div>
      {staleMonthlyServices.length > 0 && <>
        <div className="candidate-divider"><span>月付价格待重新核验</span><h3>这些服务仍有月付记录，但具体价格证据已超过 14 天</h3><p>它们不会继续混入当前月付价格排序，也不会被误写成已经停止月付。购买前请打开服务商页面重新确认价格、流量与周期。</p></div>
        <div className="service-grid candidate-service-grid">{staleMonthlyServices.map((service, index) => <ServiceCard service={service} index={index} prefix="待复核" key={service.name} />)}</div>
      </>}
      {currentNonMonthlyServices.length > 0 && <>
        <div className="candidate-divider"><span>当前非月付方案</span><h3>最近 14 天内已核验为季付、半年付或年付</h3><p>仍请在结算前确认最短购买周期、流量和最终价格。</p></div>
        <div className="service-grid candidate-service-grid">{currentNonMonthlyServices.map((service, index) => <ServiceCard service={service} index={index} prefix="非月付" key={service.name} />)}</div>
      </>}
      {staleNonMonthlyServices.length > 0 && <>
        <div className="candidate-divider"><span>方案状态待重新核验</span><h3>悠兔与 BoostNet 的最近记录为季付、半年付和年付</h3><p>这些记录已经超过 14 天，不能据此断言今天仍然暂停月付。请打开购买页确认当前是否恢复月付，以及可选周期、流量和最终价格。</p></div>
        <div className="service-grid candidate-service-grid">{staleNonMonthlyServices.map((service, index) => <ServiceCard service={service} index={index} prefix="待复核" key={service.name} />)}</div>
      </>}
    </section>
  );
}

export function NodeGuidePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
      <nav className="node-local-nav" aria-label="机场指南本页目录">
        <strong>本页目录</strong><a href="#basics">先认识概念</a><a href="#services">机场推荐</a><a href="#guide">实际怎么用</a><a href="#downloads">客户端下载</a><a href="#troubleshoot">问题排查</a>
      </nav>

      <section className="section node-basics-section" id="basics">
        <div className="section-heading"><div><span className="section-index">01 / 先认识概念</span><h1>五个词，第一次看到也能懂</h1></div><p>这些词不是一回事。先分清它们，后面的购买和安装才不会混乱。</p></div>
        <figure className="section-artwork-wide node-section-art"><Image src={`${basePath}/illustrations/network-journey-v2.webp`} alt="家庭设备通过多条网络路径和不同节点到达已核验服务的原创纸艺插画" width={1536} height={1024} sizes="(max-width: 700px) 100vw, 1280px" priority unoptimized /><figcaption>原创插画 · 从设备出发，经由节点到达目标服务</figcaption></figure>
        <div className="plain-term-grid">
          <article><span>VPN</span><h2>一种建立网络连接的技术或服务</h2><p>通常通过加密通道把设备的网络流量发送到另一台服务器。商业VPN一般提供自己的App，具体隐私和可用范围取决于服务商。</p></article>
          <article><span>机场</span><h2>中文互联网中的非正式叫法</h2><p>通常指提供多个代理服务器“节点”和订阅链接的服务商。它不等同于所有VPN，也不是航空机场。</p></article>
          <article><span>节点</span><h2>连接出去时经过的服务器</h2><p>节点常按国家或地区区分。不同节点的出口、速度和可访问服务可能不同，但不能保证解锁所有平台。</p></article>
          <article><span>客户端</span><h2>安装在手机或电脑上的连接软件</h2><p>Clash Verge、v2rayN、Shadowrocket等属于客户端。它们负责读取订阅并建立连接，本身通常不包含可用套餐。</p></article>
          <article><span>订阅链接</span><h2>把套餐和节点导入客户端的个人钥匙</h2><p>购买后由服务商提供。不要发给别人、公开截图或提交给陌生网站，否则可能造成流量被盗用。</p></article>
        </div>
        <div className="connection-diagram" aria-label="机场服务使用流程"><div><small>第1步</small><strong>购买服务</strong><p>获得自己的订阅链接</p></div><i>→</i><div><small>第2步</small><strong>安装客户端</strong><p>只从官方来源下载</p></div><i>→</i><div><small>第3步</small><strong>导入订阅</strong><p>客户端读取节点列表</p></div><i>→</i><div><small>第4步</small><strong>选择节点</strong><p>建立网络连接</p></div></div>
      </section>

      <ServiceComparison />

      <section className="section guide-section" id="guide">
        <div className="guide-intro">
          <span className="section-index light">03 / 实际怎么用</span><h2>为什么买完以后<br />还要安装客户端？</h2>
          <p>服务商卖给你的是“套餐和订阅链接”，客户端才是手机或电脑上的连接工具。可以理解为：套餐是车票，客户端负责检票并带你上车。</p>
          <a href="#downloads" className="button light-button">按设备选择客户端 →</a>
        </div>
        <div className="steps">
          <article><span>01</span><div><small>第一步</small><h3>先确认自己是否需要</h3><p>写下要使用的设备、网站、地区、每月预算和大概流量，不要只看“节点多”或“便宜”。</p></div></article>
          <article><span>02</span><div><small>第二步</small><h3>在正确入口购买</h3><p>核对域名、套餐周期、流量、设备数和退款规则；证据不足的字段先不要猜。</p></div></article>
          <article><span>03</span><div><small>第三步</small><h3>安装官方客户端</h3><p>Windows、安卓和苹果设备使用的软件不同，只从官方项目或应用商店下载。</p></div></article>
          <article><span>04</span><div><small>第四步</small><h3>导入订阅并连接</h3><p>把个人订阅链接导入客户端，更新节点后再选择连接；不要公开订阅链接。</p></div></article>
        </div>
      </section>

      <section className="section downloads-section" id="downloads">
        <div className="section-heading compact">
          <div><span className="section-index">04 / 客户端下载</span><h2>按设备选，按钮可以直接用</h2></div>
          <p>开源软件同时提供“官方发布页”和匹配当前版本的官方文件直链；小文件另有本站已校验备份。苹果付费软件仍进入 App Store。</p>
        </div>
        <BrandNotice />
        <DeviceChooser context="network" />
        <div className="client-grid">
          {clients.map((client) => {
            const repository = "repository" in client ? client.repository : undefined;
            const release = repository ? releaseChecks[repository] : undefined;
            const directAssetUrl = release && "assetUrl" in release && typeof release.assetUrl === "string" ? release.assetUrl : null;
            const directAssetName = release && "assetName" in release && typeof release.assetName === "string" ? release.assetName : null;
            const directAssetSize = release && "assetSize" in release && typeof release.assetSize === "number" ? release.assetSize : null;
            const directAssetSha256 = release && "assetSha256" in release && typeof release.assetSha256 === "string" ? release.assetSha256 : null;
            const releaseSnapshotIsCurrent = release?.state === "ok" || (release?.state === "stale" && "detectedVersion" in release && release.detectedVersion === releaseVersions[repository || ""]);
            const localMirrorIsCurrent = Boolean(
              "localFile" in client
              && client.localFile
              && "localVersion" in client
              && client.localVersion
              && repository
              && releaseSnapshotIsCurrent
              && releaseVersions[repository]?.replace(/^v/i, "").toLowerCase() === client.localVersion.replace(/^v/i, "").toLowerCase(),
            );
            return <article className="client-card" key={`${client.platform}-${client.app}`}>
              <BrandIcon slug={client.slug} name={client.app} size="large" /><div className="client-platform">{client.platform}</div><h3>{client.app}</h3>
              <div className="version-row"><span>{client.version}</span><small>{"repository" in client && client.repository ? (releaseSnapshotIsCurrent ? `${syncTime} ${release?.state === "stale" ? "最近可信校验" : "自动核验"}` : "上次核验版本 · 本轮读取失败") : "进入官方商店或官网确认"}</small></div><p>{client.note}</p>
              <div className="client-actions">
                <a href={client.download} target="_blank" rel="noopener noreferrer">查看官方发布页 <span>↗</span></a>
                {directAssetUrl && <a className="official-direct-action" href={directAssetUrl}>直接下载官方文件{directAssetSize ? ` · ${formatFileSize(directAssetSize)}` : ""} <span>↓</span></a>}
                {directAssetName && <small className="client-file-meta" title={directAssetSha256 ? `SHA-256：${directAssetSha256}` : undefined}>{directAssetName}{directAssetSha256 ? ` · SHA-256 ${directAssetSha256.slice(0, 12)}…` : ""}</small>}
                {"localFile" in client && client.localFile
                  ? localMirrorIsCurrent
                    ? <a className="local-action" href={`${basePath}/mirror/${client.localFile}`} download>本站已校验备用文件 · {client.localLabel?.replace("本地下载 · ", "") || "当前设备"} <span>↓</span></a>
                    : <span className="local-action unavailable">新版本已发布或核验失败 · 本地旧版已暂停</span>
                  : !directAssetUrl && <span className="local-action unavailable">{"localUnavailable" in client ? client.localUnavailable : "本地下载暂不提供"}</span>}
                <a className="muted-action" href={client.tutorial} target="_blank" rel="noopener noreferrer">使用教程 <span>↗</span></a>
              </div>
            </article>;
          })}
        </div>
        <div className="security-alert"><span className="alert-icon">!</span><div><strong>安全提醒</strong><p>下载页可能同时提供多种系统和芯片版本。看不懂文件名时先不要安装；本站后续会补充逐设备截图教程。</p></div><span className="alert-date">所有入口均为官方来源</span></div>
      </section>

      <section className="section" id="troubleshoot">
        <div className="section-heading compact">
          <div><span className="section-index">05 / 问题排查</span><h2>导入、连接或入口异常时，按症状逐步检查</h2></div>
          <p>先判断问题出在订阅、客户端、节点还是目标网站；遇到索要验证码、关闭安全软件或安装未知证书时立即停止。</p>
        </div>
        <BeginnerTroubleshooter name="机场连接问题" playbook={networkPlaybook} />
      </section>

      </main>
      <SiteFooter />
    </>
  );
}

export default function Home() {
  const routeListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "数字工具指南三个核心项目",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "机场介绍、选择与客户端", url: `${publicSiteUrl}/nodes/` },
      { "@type": "ListItem", position: 2, name: "AI订阅、AI工具与常用应用", url: `${publicSiteUrl}/ai/` },
      { "@type": "ListItem", position: 3, name: "主流AI模型评测解读", url: `${publicSiteUrl}/benchmarks/` },
    ],
  };
  return (
    <PageShell staticNavigation>
      <StructuredData data={routeListJsonLd} />
      <section className="home-hero" aria-labelledby="home-title">
        <figure className="home-hero-art" aria-hidden="true" style={{ "--hero-image": `url("${basePath}/editorial/digital-atlas-home-v2.webp")` } as CSSProperties} />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <span className="home-kicker"><i />数字生活 · 逐项核对</span>
            <h1 id="home-title"><span>复杂的数字工具，</span><br /><em>先看懂，再决定。</em></h1>
            <p>从网络服务、AI产品到模型评测，把入口、价格、风险和证据整理成普通人能直接行动的中文指南。</p>
            <div className="home-hero-actions"><Link className="home-action-primary" href="#projects">按我的问题开始 <span>↓</span></Link><Link className="home-action-secondary" href="/search" prefetch={false}>搜索一个工具 <span>⌕</span></Link></div>
            <dl className="home-proof-row">
              <div><dt>公开来源</dt><dd>逐项标注</dd></div>
              <div><dt>重要入口</dt><dd>自动检查</dd></div>
              <div><dt>表达方式</dt><dd>新手优先</dd></div>
            </dl>
          </div>
          <aside className="home-route-panel" aria-label="三个项目分别解决什么问题">
            <header><span>Start with a question</span><strong>你现在想解决什么？</strong></header>
            <nav>
              <Link href="/nodes" prefetch={false}><b>01</b><span><strong>需要网络服务</strong><small>看懂机场、节点和客户端</small></span><i>↗</i></Link>
              <Link href="/ai" prefetch={false}><b>02</b><span><strong>想学习或订阅 AI</strong><small>从用途、产品和购买方式开始</small></span><i>↗</i></Link>
              <Link href="/benchmarks" prefetch={false}><b>03</b><span><strong>想了解模型水平</strong><small>分清能力、速度和成本</small></span><i>↗</i></Link>
            </nav>
            <p><i /> 内容会持续核验；无法确认的数字会明确隐藏。</p>
          </aside>
        </div>
        <a className="home-scroll-cue" href="#projects"><span>向下探索</span><i /></a>
      </section>

      <section className="home-promise" aria-label="本站的三个设计与编辑原则">
        <p><span>01</span> 少一点术语，<strong>多一点判断依据。</strong></p>
        <p><span>02</span> 少一点推荐，<strong>多一点适用边界。</strong></p>
        <p><span>03</span> 少一点炫技，<strong>多一点真实速度。</strong></p>
      </section>

      <section className="project-overview" id="projects">
        <header className="home-section-heading"><div><span>Three clear paths</span><h2>三个独立指南，<br />需要哪个就看哪个。</h2></div><p>不需要按顺序阅读，也不用先懂专业名词。每个项目都从“这是什么”开始，到“下一步怎么做”结束。</p></header>
        <div className="project-overview-grid">
          <article className="project-card project-card-network"><Link className="project-card-media" href="/nodes" prefetch={false} aria-label="01 进入机场指南"><Image src={`${basePath}/illustrations/network-journey-home-v2.webp`} width="832" height="555" alt="从设备、客户端到网络服务的纸艺路线插画" unoptimized /><span aria-hidden="true">01</span></Link><div className="project-card-body"><span>项目 01 · 网络服务</span><h3>看懂机场，选择服务并安装客户端</h3><p>适合不知道“机场、节点、订阅链接”是什么的人。按设备给出下载、安装与排错路径。</p><small className="project-card-outcome">理解术语 · 比较服务 · 安装客户端</small><Link className="project-card-primary" href="/nodes" prefetch={false}>进入机场指南 <i>↗</i></Link></div></article>
          <article className="project-card project-card-ai"><Link className="project-card-media" href="/ai" prefetch={false} aria-label="02 进入AI与应用指南"><Image src={`${basePath}/illustrations/ai-assistant-home-v2.webp`} width="832" height="555" alt="围绕对话、文件、语音、图片和搜索的AI助手纸艺插画" unoptimized /><span aria-hidden="true">02</span></Link><div className="project-card-body"><span>项目 02 · AI与应用</span><h3>先选 AI，再决定是否订阅或安装</h3><p>比较 ChatGPT、Claude、Gemini 等产品的用途、下载入口、订阅方式与账号风险。</p><small className="project-card-outcome">选择 AI · 比较订阅 · 找到下载</small><nav className="project-card-links" aria-label="AI与应用子栏目"><Link href="/ai" prefetch={false}>AI介绍</Link><Link href="/subscriptions" prefetch={false}>AI订阅</Link><Link href="/apps" prefetch={false}>常用应用</Link><Link href="/downloads" prefetch={false}>下载中心</Link></nav></div></article>
          <article className="project-card project-card-benchmark"><Link className="project-card-media" href="/benchmarks" prefetch={false} aria-label="03 进入模型评测"><Image src={`${basePath}/illustrations/model-benchmarks-home-v2.webp`} width="832" height="555" alt="展示真人评价、能力、速度与成本的模型评测纸艺插画" unoptimized /><span aria-hidden="true">03</span></Link><div className="project-card-body"><span>项目 03 · 模型评测</span><h3>看懂当前主流模型和评测结果</h3><p>把 Arena 真人评价与 Artificial Analysis 的能力、速度和成本数据分开解释，避免只看一个总分。</p><small className="project-card-outcome">分清榜单 · 认识模型 · 看懂差异</small><Link className="project-card-primary" href="/benchmarks" prefetch={false}>查看模型评测 <i>↗</i></Link></div></article>
        </div>
      </section>

      <section className="home-standard">
        <div><span>Built for trust</span><h2>好看只是开始。<br />可信、清楚、快速，才是完成。</h2><p>我们把设计用在理解上：让重要信息先出现，让风险和来源不躲在小字里，让手机端也能舒服阅读。</p><Link href="/standards">查看本站编辑标准 <i>↗</i></Link></div>
        <ol>
          <li><span>01</span><div><strong>来源在推荐前面</strong><p>关键结论尽量回到官方页面、公开数据或可重复检查的证据。</p></div></li>
          <li><span>02</span><div><strong>不确定性直接写明</strong><p>读取失败、价格冲突和人工资料过期时，不拿旧数字冒充现在。</p></div></li>
          <li><span>03</span><div><strong>性能也是设计</strong><p>不依赖沉重3D和自动播放视频，动效只使用高性能属性并支持减少动态效果。</p></div></li>
        </ol>
      </section>
    </PageShell>
  );
}
