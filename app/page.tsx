import syncStatus from "../data/sync-status.json";
import Image from "next/image";
import Link from "next/link";
import { BrandIcon, BrandNotice, PageShell, SiteFooter, SiteHeader } from "./components/SiteChrome";
import DeviceChooser from "./components/DeviceChooser";
import ActionChecklist from "./components/ActionChecklist";
import BeginnerTroubleshooter from "./components/BeginnerTroubleshooter";
import StructuredData from "./components/StructuredData";
import { networkPlaybook } from "../data/beginner-playbooks";

const releaseVersions: Record<string, string | null> = Object.fromEntries(syncStatus.clients.map((client) => [client.repository, "version" in client && typeof client.version === "string" ? client.version : null]));
const releaseStates: Record<string, string> = Object.fromEntries(syncStatus.clients.map((client) => [client.repository, client.state]));
const syncTime = syncStatus.checkedAt
  ? new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "medium", timeStyle: "short", hour12: false }).format(new Date(syncStatus.checkedAt))
  : "等待首次公开数据同步";

const basePath = process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : "";
const publicSiteUrl = process.env.GITHUB_PAGES === "true" ? "https://alsolisa.github.io/digital-tools-guide" : "http://localhost:3000";

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
    payment: "易支付、USDT-TRC20",
    monthly: "有月付 · 当前可订购",
    ownClient: "未发现明确自研客户端，以第三方客户端为主",
    description: "Silver ¥20/200GiB、Platinum ¥40/400GiB，最高500Mbps；Diamond ¥60/600GiB，最高1000Mbps；Ultimate ¥80/800GiB，最高2000Mbps。",
    caution: "购买页写明仅限个人使用、暂不支持退款；低价不等于适合所有人。",
    bestFor: "低预算、备用线路",
    href: "https://wd-gold.net/aff.php?aff=15433",
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
    href: "https://777.youtu6.shop/register?code=2tr1tmSh",
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
    href: "https://999.boostnet1.com/register?code=3QtbFZIf",
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
    href: "https://nxonearth.com/Main.aspx",
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
    href: "https://tagss.pro/",
    linkLabel: "打开当前入口",
  },
];

const sortedServices = services.filter((service) => service.active !== false).sort((a, b) => a.sortGroup - b.sortGroup || a.sortPrice - b.sortPrice);
const priceReferenceTime = new Date(syncStatus.checkedAt).getTime();
const priceFreshnessWindow = 14 * 24 * 60 * 60 * 1000;
function hasFreshPriceEvidence(service: (typeof services)[number]) {
  if (!service.verifiedAt) return false;
  const verifiedTime = new Date(`${service.verifiedAt}T23:59:59+08:00`).getTime();
  return Number.isFinite(verifiedTime) && priceReferenceTime - verifiedTime <= priceFreshnessWindow;
}
const rankedMonthlyServices = sortedServices.filter((service) => service.sortGroup === 0 && hasFreshPriceEvidence(service));
const monthlyCandidates = sortedServices.filter((service) => service.sortGroup !== 0 || !hasFreshPriceEvidence(service));

const clients = [
  {
    slug: "clash-verge",
    platform: "Windows / macOS / Linux",
    app: "Clash Verge Rev",
    repository: "clash-verge-rev/clash-verge-rev",
    version: releaseVersions["clash-verge-rev/clash-verge-rev"] || "v2.5.1",
    note: "新手首选。Windows 普通电脑通常选 x64；Mac 要区分 Apple 芯片与 Intel。",
    tone: "blue",
    download: "https://github.com/clash-verge-rev/clash-verge-rev/releases/latest",
    localFile: "Clash.Verge_2.5.1_x64-setup.exe",
    localLabel: "本地下载 · Windows x64",
    tutorial: "https://nexitally-1.gitbook.io/nexitally-wen-dang-zhong-xin/nexitally-wen-dang-dao-hang/clash-verge",
  },
  {
    slug: "v2rayn",
    platform: "Windows",
    app: "v2rayN",
    repository: "2dust/v2rayN",
    version: releaseVersions["2dust/v2rayN"] || "v7.23.4",
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

const addresses = [
  { service: "Nexitally", result: "官方入口可打开", access: "当前环境可访问", tone: "review" },
  { service: "WgetCloud", result: "永久入口会跳转", access: "已确认入口，暂停使用", tone: "review" },
  { service: "TAG", result: "tagss04.pro 已劫持；已换 tagss.pro", access: "当前官网与商店已核验", tone: "review" },
  { service: "BoostNet", result: "邀请码可自动写入", access: "当前环境可访问", tone: "review" },
  { service: "悠兔 Youtu", result: "注册入口进入登录页", access: "当前环境可访问", tone: "review" },
  { service: "WestData", result: "旧域名跳转到新域名", access: "当前环境可访问", tone: "review" },
  { service: "GamsGo", result: "推广参数已保留", access: "当前环境可访问", tone: "review" },
];

function ServiceCard({ service, index, prefix = "月付" }: { service: (typeof services)[number]; index: number; prefix?: string }) {
  const stalePrice = service.sortGroup === 0 && !hasFreshPriceEvidence(service);
  const isMonthly = service.sortGroup === 0;
  return <article className="service-card">
    <div className="service-topline"><span className="service-tag">{prefix} {index + 1} · {service.tag}</span><span className={`status-pill ${stalePrice ? "pending" : service.statusTone}`}><i />{stalePrice ? "人工核验已超过14天" : service.status}</span></div>
    <div className="service-title"><h3>{service.name}</h3><span>{service.alias}</span></div>
    <p className="service-description">{service.description}</p>
    <div className="service-stats"><div><small>{isMonthly ? "可比参考价格" : "当前可选周期"}</small><strong>{service.price}</strong><span>{service.cycle}</span></div><div><small>{isMonthly ? "参考流量" : "月付状态"}</small><strong>{service.traffic}</strong></div></div>
    {"caution" in service && service.caution && <p className="service-caution"><strong>购买前注意</strong>{service.caution}</p>}
    <div className="fact-line"><span>月付</span>{service.monthly}</div>
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
        <div><span className="section-index">{sectionIndex}</span><h2>按预算直接选：月付先看三家，长期方案再看两家</h2></div>
        <p>这几家不是从广告中随便挑选，而是结合实际使用体验、长期观察和购买页面核对后保留下来的代表方案。</p>
      </div>
      <div className="selection-disclosure service-choice-intro">
        <strong>为什么提供这几家？</strong>
        <div><p>选择时主要比较稳定性、延迟、速度、节点覆盖、客户端体验和价格。根据实际使用与评测观察，价格较高的方案通常在线路资源、高峰期稳定性和整体体验上更好；但不同地区、运营商和使用时间仍可能有差异。</p><p>不用把每个专业参数都研究一遍：预算有限或只作备用可先看 WestData；更重视稳定和长期使用可选 Nexitally；需要更多国家和地区节点可看 TAG。根据自己的预算与用途选择即可。</p></div>
      </div>
      <div className="sort-note"><strong>月付排序</strong><span>当前可单独购买的月付或约31天套餐，按起价从低到高</span><i />已核验</div>
      <div className="service-grid">
        {rankedMonthlyServices.map((service, index) => <ServiceCard service={service} index={index} key={service.name} />)}
      </div>
      <div className="candidate-divider"><span>当前不提供独立月付</span><h3>悠兔与 BoostNet 暂以季付、半年付和年付为主</h3><p>受运营安排影响，这两家目前暂停独立月付，是否以及何时恢复尚未明确。现阶段请在购买页查看季付、半年付或年付方案，并按自己能接受的最短周期选择。</p></div>
      <div className="service-grid candidate-service-grid">{monthlyCandidates.map((service, index) => <ServiceCard service={service} index={index} prefix="非月付" key={service.name} />)}</div>
    </section>
  );
}

export function NodeGuidePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
      <nav className="node-local-nav" aria-label="机场指南本页目录">
        <strong>本页目录</strong><a href="#basics">先认识概念</a><a href="#services">机场推荐</a><a href="#guide">实际怎么用</a><a href="#troubleshoot">问题排查</a><a href="#choose">怎么选择</a><a href="#evidence">页面证据</a><a href="#downloads">客户端下载</a><a href="#status">地址状态</a>
      </nav>

      <section className="section node-basics-section" id="basics">
        <div className="section-heading"><div><span className="section-index">01 / 先认识概念</span><h1>五个词，第一次看到也能懂</h1></div><p>这些词不是一回事。先分清它们，后面的购买和安装才不会混乱。</p></div>
        <div className="plain-term-grid">
          <article><span>VPN</span><h3>一种建立网络连接的技术或服务</h3><p>通常通过加密通道把设备的网络流量发送到另一台服务器。商业VPN一般提供自己的App，具体隐私和可用范围取决于服务商。</p></article>
          <article><span>机场</span><h3>中文互联网中的非正式叫法</h3><p>通常指提供多个代理服务器“节点”和订阅链接的服务商。它不等同于所有VPN，也不是航空机场。</p></article>
          <article><span>节点</span><h3>连接出去时经过的服务器</h3><p>节点常按国家或地区区分。不同节点的出口、速度和可访问服务可能不同，但不能保证解锁所有平台。</p></article>
          <article><span>客户端</span><h3>安装在手机或电脑上的连接软件</h3><p>Clash Verge、v2rayN、Shadowrocket等属于客户端。它们负责读取订阅并建立连接，本身通常不包含可用套餐。</p></article>
          <article><span>订阅链接</span><h3>把套餐和节点导入客户端的个人钥匙</h3><p>购买后由服务商提供。不要发给别人、公开截图或提交给陌生网站，否则可能造成流量被盗用。</p></article>
        </div>
        <div className="connection-diagram" aria-label="机场服务使用流程"><div><small>第1步</small><strong>购买服务</strong><p>获得自己的订阅链接</p></div><i>→</i><div><small>第2步</small><strong>安装客户端</strong><p>只从官方来源下载</p></div><i>→</i><div><small>第3步</small><strong>导入订阅</strong><p>客户端读取节点列表</p></div><i>→</i><div><small>第4步</small><strong>选择节点</strong><p>建立网络连接</p></div></div>
        <div className="can-cannot-grid"><article><h3>它可能帮助你</h3><ul><li>连接服务商提供的境外网络节点</li><li>按需要选择不同地区的出口</li><li>在跨境网络质量合适时改善连接体验</li></ul></article><article className="warning-card"><h3>它不能向你保证</h3><ul><li>完全匿名、绝对安全或永不记录</li><li>所有网站、账号地区和付款方式都能使用</li><li>任何时间、任何网络都保持同样速度</li></ul></article></div>
        <ActionChecklist id="network-first-setup" title="第一次购买与连接清单" items={["已经写下必须使用的设备、地区和每月预算", "只选择证据仍在有效期内的最短周期套餐", "已经从官方项目或应用商店安装正确客户端", "订阅链接没有发给别人，也没有出现在截图中", "在自己的常用网络和常用时间连续测试三次", "知道怎样断开连接、关闭系统代理并恢复普通网络"]} />
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

      <section className="section node-troubleshoot-section" id="troubleshoot">
        <div className="section-heading"><div><span className="section-index">04 / 出问题怎么排查</span><h2>先看症状，再决定要不要重装</h2></div><p>连接问题不一定来自同一个地方。订阅、客户端、节点、账号地区和目标网站要分开判断。</p></div>
        <BeginnerTroubleshooter name="VPN与机场连接" playbook={networkPlaybook} />
      </section>

      <section className="section node-choice-section" id="choose">
        <div className="section-heading"><div><span className="section-index">05 / 怎么选择</span><h2>先看需求，不要先看广告词</h2></div><p>“IEPL、家宽、专线、稳定”可能来自商家描述。没有持续的多网络实测时，本站不会把它们当成独立性能结论。</p></div>
        <div className="selection-check-grid"><article><span>设备</span><h3>要在哪些设备上用？</h3><p>确认Windows、Mac、Android或iPhone，以及允许同时连接多少台设备。</p></article><article><span>用途</span><h3>主要打开哪些服务？</h3><p>不同服务对地区、IP质量和账号地区的要求不同，不能只看节点数量。</p></article><article><span>流量</span><h3>每月大约使用多少？</h3><p>视频和大文件更耗流量；还要确认流量何时重置、是否存在倍率。</p></article><article><span>售后</span><h3>出问题找谁处理？</h3><p>付款前查看工单、客服、退款、试用和失联后的处理方式。</p></article></div>
        <div className="selection-disclosure"><strong>最简单的选择方法</strong><p>先按预算选一档，再看自己最在意的是低价备用、长期稳定还是更多地区节点。第一次购买优先选择当前可用的最短周期；实际速度仍要在自己的宽带、手机网络和常用时段测试。</p></div>
      </section>

      <section className="section node-evidence-section" id="evidence">
        <div className="section-heading compact">
          <div><span className="section-index">06 / 页面证据</span><h2>截图用来证明“看到了什么”，不代替你的购买确认</h2></div>
          <p>以下截图来自 2026-07-16 的实际页面。只展示不含账号、订单、订阅密钥和付款资料的区域；价格和客户端证据分开标注。</p>
        </div>
        <div className="node-evidence-grid">
          <figure>
            <div className="node-evidence-media"><Image src={`${basePath}/guides/nodes/tag-shop.png`} alt="TAG 当前商店页面，展示 Special、Team 与私人节点计划" width={1264} height={710} unoptimized /></div>
            <figcaption><span>已登录商店 · 价格证据</span><h3>TAG 当前商店</h3><p>截图可见 Special ¥162/年、Team ¥658/月和私人节点 ¥1500+/月。Silver、Gold 等月付价格已在同一商店逐项读取，页面卡片按可比较月付价格展示。</p><a href="https://tagss.pro/" target="_blank" rel="noopener noreferrer">打开当前入口 ↗</a></figcaption>
          </figure>
          <figure>
            <div className="node-evidence-media"><Image src={`${basePath}/guides/nodes/youtu-client-proof.png`} alt="悠兔后台公告中的多平台客户端说明" width={1000} height={510} unoptimized /></div>
            <figcaption><span>已登录后台 · 客户端证据</span><h3>悠兔多平台客户端</h3><p>后台明确提供 Windows、Android、iOS、macOS 客户端，并说明可使用 Clash 等第三方客户端。这只能证明客户端存在，不能证明当前套餐价格。</p><a href="https://777.youtu6.shop/register?code=2tr1tmSh" target="_blank" rel="sponsored noopener">打开推广入口 ↗</a></figcaption>
          </figure>
        </div>
        <div className="privacy-evidence-note"><strong>为什么没有完整后台截图？</strong><p>完整后台可能含账号昵称、订单、余额或个人订阅链接。为了保护账号安全，WestData 等核验只公开文字结论，不公开带个人信息的原始页面。</p></div>
      </section>

      <section className="section downloads-section" id="downloads">
        <div className="section-heading compact">
          <div><span className="section-index">07 / 客户端下载</span><h2>按设备选，按钮可以直接用</h2></div>
          <p>开源软件进入 GitHub 的 Latest Release；苹果付费软件进入 App Store；不提供来历不明的安装包或 IPA。</p>
        </div>
        <BrandNotice />
        <DeviceChooser context="network" />
        <div className="client-grid">
          {clients.map((client) => (
            <article className="client-card" key={`${client.platform}-${client.app}`}>
              <BrandIcon slug={client.slug} name={client.app} size="large" /><div className="client-platform">{client.platform}</div><h3>{client.app}</h3>
              <div className="version-row"><span>{client.version}</span><small>{"repository" in client && client.repository ? (releaseStates[client.repository] === "ok" ? `${syncTime} 自动核验` : "上次核验版本 · 本轮读取失败") : "进入官方商店或官网确认"}</small></div><p>{client.note}</p>
              <div className="client-actions">
                <a href={client.download} target="_blank" rel="noopener noreferrer">官方下载 <span>↗</span></a>
                {"localFile" in client && client.localFile
                  ? <a className="local-action" href={`${basePath}/mirror/${client.localFile}`} download>{client.localLabel || "本地下载"} <span>↓</span></a>
                  : <span className="local-action unavailable">{"localUnavailable" in client ? client.localUnavailable : "本地下载暂不提供"}</span>}
                <a className="muted-action" href={client.tutorial} target="_blank" rel="noopener noreferrer">使用教程 <span>↗</span></a>
              </div>
            </article>
          ))}
        </div>
        <div className="security-alert"><span className="alert-icon">!</span><div><strong>安全提醒</strong><p>下载页可能同时提供多种系统和芯片版本。看不懂文件名时先不要安装；本站后续会补充逐设备截图教程。</p></div><span className="alert-date">所有入口均为官方来源</span></div>
      </section>

      <section className="section status-section" id="status">
        <div className="section-heading compact"><div><span className="section-index">08 / 地址状态</span><h2>能打开，不等于大陆裸网可用</h2></div><p>当前环境是否经过代理未知，所以不会标绿色“大陆可用”。只有真实普通网络测试后才升级状态。</p></div>
        <div className="status-table" role="table" aria-label="地址核验状态">
          <div className="status-row table-head" role="row"><span role="columnheader">服务</span><span role="columnheader">跳转结果</span><span role="columnheader">访问状态</span><span role="columnheader">结论</span></div>
          {addresses.map((item) => <div className="status-row" role="row" key={item.service}><strong role="cell">{item.service}</strong><span role="cell">{item.result}</span><span role="cell" className={`status-pill ${item.tone}`}><i />{item.access}</span><span role="cell" className="table-note">暂不标记大陆裸网可用</span></div>)}
        </div>
      </section>

      <section className="method-section" id="method">
        <div className="method-copy"><span className="section-index light">我们的核验方法</span><h2>把“证据”放在推荐前面</h2><p>推广链接可能带来收益，但资料可信度不能因此降低。重要字段会保留来源、状态和更新时间。</p></div>
        <div className="method-grid"><div><span>01</span><h3>官方优先</h3><p>官网、用户后台、官方文档、官方 GitHub 或应用商店。</p></div><div><span>02</span><h3>冲突暂停</h3><p>价格出现冲突时标为待复核，不把搜索摘要当官方现价。</p></div><div><span>03</span><h3>分层同步</h3><p>公开入口和版本每 6 小时检查；登录后的深层月付价格进入人工复核。</p></div></div>
      </section>

      <section className="gamsgo-banner"><div><span>AI 与数字订阅</span><h2>GamsGo 内容独立整理</h2><p>与网络服务分区展示，避免新手把两类产品混淆。</p></div><a href="https://www.gamsgo.com/partner/BTzCM" target="_blank" rel="sponsored noopener">查看推广入口 ↗</a></section>

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
    <PageShell>
      <StructuredData data={routeListJsonLd} />
      <section className="project-overview" id="projects">
        <div className="project-overview-copy"><span className="eyebrow">三个项目 · 第一次使用也能看懂</span><h1>机场、AI 与模型评测，<br />分别讲清楚</h1><p>不再用大量选择题挡在前面。先看三个项目分别解决什么问题，再直接进入机场基础概念和推荐列表。</p></div>
        <div className="project-overview-grid">
          <article><span>项目 01</span><h2>机场介绍与下载</h2><p>解释VPN、机场、节点、客户端和订阅链接，再按预算比较服务，提供官方下载、本地下载和使用教程。</p><Link href="/nodes">查看完整机场指南 →</Link></article>
          <article><span>项目 02</span><h2>AI、订阅与常用应用</h2><p>把AI用途、官方入口、GamsGo订阅方式，以及 YouTube、TikTok、X 的下载和使用放在同一条学习路线中。</p><div><Link href="/ai">AI介绍</Link><Link href="/subscriptions">AI订阅</Link><Link href="/apps">常用应用</Link></div></article>
          <article><span>项目 03</span><h2>主流模型评测解读</h2><p>分别解读 Arena 真人盲测和 Artificial Analysis 的能力、速度、延迟与API成本，帮助普通人认识当前主流模型。</p><Link href="/benchmarks">查看模型评测 →</Link></article>
        </div>
      </section>

      <section className="section node-basics-section home-node-start" id="basics">
        <div className="section-heading"><div><span className="section-index">机场入门</span><h2>先看懂五个词，再选择服务</h2></div><p>客户端不是套餐，节点不是机场，订阅链接也不是普通网址。先分清这些概念，购买和安装就不会混乱。</p></div>
        <div className="plain-term-grid">
          <article><span>VPN</span><h3>一种建立网络连接的技术或服务</h3><p>通常通过加密通道把设备的网络流量发送到另一台服务器。具体隐私、速度和可用范围取决于服务商。</p></article>
          <article><span>机场</span><h3>提供节点和订阅链接的服务商</h3><p>“机场”是中文互联网中的非正式叫法。它通常出售可使用的线路套餐，不等于客户端软件。</p></article>
          <article><span>节点</span><h3>连接时经过的服务器</h3><p>节点常按国家或地区区分。出口位置、速度和可访问服务可能不同，也不能保证解锁所有平台。</p></article>
          <article><span>客户端</span><h3>安装在手机或电脑上的连接软件</h3><p>Clash Verge、v2rayN、Shadowrocket 等负责读取订阅并建立连接，本身通常不包含可用套餐。</p></article>
          <article><span>订阅链接</span><h3>把套餐和节点导入客户端的个人钥匙</h3><p>购买后由服务商提供。不要发给别人、公开截图或提交给陌生网站，否则可能造成流量被盗用。</p></article>
        </div>
        <div className="connection-diagram" aria-label="机场服务使用流程"><div><small>第1步</small><strong>购买服务</strong><p>获得自己的订阅链接</p></div><i>→</i><div><small>第2步</small><strong>安装客户端</strong><p>优先官方，本地下载作备用</p></div><i>→</i><div><small>第3步</small><strong>导入订阅</strong><p>客户端读取节点列表</p></div><i>→</i><div><small>第4步</small><strong>选择节点</strong><p>建立网络连接</p></div></div>
      </section>

      <ServiceComparison sectionIndex="机场推荐" />

      <section className="section home-followup">
        <div><span>需要继续操作？</span><h2>选择服务后，再去下载客户端和查看教程</h2><p>完整机场页还包括安装步骤、问题排查、真实页面截图、地址状态和八款客户端。</p></div>
        <nav><Link href="/nodes#downloads">客户端与使用教程 →</Link><Link href="/downloads#mirror">打开本地下载 →</Link></nav>
      </section>
    </PageShell>
  );
}
