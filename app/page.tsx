import syncStatus from "../data/sync-status.json";
import Link from "next/link";
import { aiProducts, commonApps, subscriptionOffers } from "../data/catalog";
import { BrandIcon, BrandNotice, EditorialCoverFeature, FeedbackLink, PageShell, SectionHeading, SiteFooter, SiteHeader } from "./components/SiteChrome";
import DeviceChooser from "./components/DeviceChooser";

const releaseVersions = Object.fromEntries(syncStatus.clients.map((client) => [client.repository, client.version]));
const syncTime = syncStatus.checkedAt
  ? new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "medium", timeStyle: "short", hour12: false }).format(new Date(syncStatus.checkedAt))
  : "等待首次公开数据同步";

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
    accuracy: "2026-07-12 已登录购买页核验；四款均显示可立即订购",
    payment: "易支付、USDT-TRC20",
    monthly: "有月付 · 当前可订购",
    ownClient: "未发现明确自研客户端，以第三方客户端为主",
    description: "Silver ¥20/200GiB；Platinum ¥40/400GiB；Diamond ¥60/600GiB；Ultimate ¥80/800GiB，均为当前月付套餐。",
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
    price: "待实际核验",
    cycle: "",
    traffic: "待复核",
    status: "购买页待核验",
    statusTone: "pending",
    accuracy: "旧资料约 ¥40 已撤下，等待当前购买页实际核验",
    payment: "待付款页实际核验",
    monthly: "是否有当前月付仍待核验",
    ownClient: "有 · Windows / Android / iOS / macOS",
    clientHref: "https://d.yoututz.top/ph/youtu",
    description: "提供 Windows、Android、iOS 与 macOS 使用入口，也支持 Clash 等第三方客户端。",
    bestFor: "希望安装步骤简单",
    href: "https://777.youtu6.shop/register?code=2tr1tmSh",
    linkLabel: "打开推广入口",
  },
  {
    name: "BoostNet",
    sortGroup: 2,
    sortPrice: 0,
    alias: "IEPL 专线",
    tag: "性价比",
    price: "暂无直接月付",
    cycle: "",
    traffic: "20–1500G/月",
    status: "当前计划页已核验",
    statusTone: "verified",
    accuracy: "2026-07-13 当前计划页仅直接展示年付、半年付、季付；不按月付排名",
    payment: "待付款页实际核验",
    monthly: "当前未直接展示可单买月付",
    ownClient: "有 · Windows / macOS / Android 一键客户端",
    clientHref: "https://d.yoututz.top/ph/bst",
    description: "200G ¥260半年；20G ¥200/年；400G ¥220/季；1000G ¥350/季。企业1500G ¥388的周期待确认。",
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
    accuracy: "官方已确认流量档位；旧价格已撤下，等待当前购买页实际核验",
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
    accuracy: "2026-07-12 已登录购买页核验；两款31天套餐当前可购买",
    payment: "支付宝、账户余额",
    monthly: "31 天套餐 · 当前可购买",
    ownClient: "以第三方客户端为主，官方文档提供教程",
    description: "Air ¥74.55/200G；Smart Access ¥123.33/500G，均为31天、2台设备、最高2000Mbps。",
    bestFor: "重视稳定与长期使用",
    href: "https://nexitally-1.gitbook.io/nexitally-wen-dang-zhong-xin",
    linkLabel: "打开官方使用文档",
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
    accuracy: "2026-07-13 已登录 tagss.pro 商店核验；旧入口 tagss04.pro 已被劫持",
    payment: "待付款页实际核验",
    monthly: "有月付 · Silver / Gold / Team 当前可购买",
    ownClient: "待有效订阅后核验 · 官网当前未明确展示",
    description: "Silver ¥114/500G；Gold ¥219/999G；Team ¥658/3000G，均为当前月付套餐。",
    bestFor: "多国家/地区节点需求",
    href: "https://tagss.pro/",
    linkLabel: "打开当前入口",
  },
];

const sortedServices = services.filter((service) => service.active !== false).sort((a, b) => a.sortGroup - b.sortGroup || a.sortPrice - b.sortPrice);

const clients = [
  {
    slug: "clash-verge",
    platform: "Windows / macOS / Linux",
    app: "Clash Verge Rev",
    version: releaseVersions["clash-verge-rev/clash-verge-rev"] || "v2.5.1",
    note: "新手首选。Windows 普通电脑通常选 x64；Mac 要区分 Apple 芯片与 Intel。",
    tone: "blue",
    download: "https://github.com/clash-verge-rev/clash-verge-rev/releases/latest",
    project: "https://github.com/clash-verge-rev/clash-verge-rev",
  },
  {
    slug: "v2rayn",
    platform: "Windows",
    app: "v2rayN",
    version: releaseVersions["2dust/v2rayN"] || "v7.23.3",
    note: "功能较多，适合需要更多协议的人。旧版存在安全风险，请只用当前正式版。",
    tone: "purple",
    download: "https://github.com/2dust/v2rayN/releases/latest",
    project: "https://github.com/2dust/v2rayN",
  },
  {
    slug: "flclash",
    platform: "Android",
    app: "FlClash",
    version: releaseVersions["chen08209/FlClash"] || "v0.8.94",
    note: "多数新安卓手机选择 arm64-v8a 安装包；不确定时先看手机处理器类型。",
    tone: "green",
    download: "https://github.com/chen08209/FlClash/releases/latest",
    project: "https://github.com/chen08209/FlClash",
  },
  {
    slug: "hiddify",
    platform: "Android / iOS / macOS",
    app: "Hiddify",
    version: releaseVersions["hiddify/hiddify-app"] || "v4.1.1",
    note: "界面相对直观，覆盖多平台；下载时按照自己的设备系统选择文件。",
    tone: "green",
    download: "https://github.com/hiddify/hiddify-app/releases/latest",
    project: "https://github.com/hiddify/hiddify-app",
  },
  {
    slug: "shadowrocket",
    platform: "iPhone / iPad / Apple TV",
    app: "Shadowrocket",
    version: "App Store",
    note: "付费软件。只前往苹果商店，不提供第三方 IPA 或共享账号。",
    tone: "orange",
    download: "https://apps.apple.com/us/app/shadowrocket/id932747118",
  },
  {
    slug: "quantumult-x",
    platform: "iPhone / iPad / Mac",
    app: "Quantumult X",
    version: "App Store",
    note: "功能强但设置较多，适合愿意学习规则配置的进阶用户。",
    tone: "orange",
    download: "https://apps.apple.com/us/app/quantumult-x/id1443988620",
  },
  {
    slug: "stash",
    platform: "iPhone / iPad / Mac",
    app: "Stash",
    version: "App Store",
    note: "规则型客户端，界面清晰；购买前先确认服务商是否提供兼容订阅。",
    tone: "orange",
    download: "https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349",
  },
  {
    slug: "surge",
    platform: "macOS / iOS",
    app: "Surge",
    version: "官方网站",
    note: "专业网络工具，价格较高、学习成本也更高，不建议纯新手盲目购买。",
    tone: "purple",
    download: "https://nssurge.com/",
  },
];

const addresses = [
  { service: "Nexitally", result: "官方文档可打开", access: "当前环境可访问", tone: "review" },
  { service: "WgetCloud", result: "永久入口会跳转", access: "已确认入口，暂停使用", tone: "review" },
  { service: "TAG", result: "tagss04.pro 已劫持；已换 tagss.pro", access: "当前官网与商店已核验", tone: "review" },
  { service: "BoostNet", result: "邀请码可自动写入", access: "当前环境可访问", tone: "review" },
  { service: "悠兔 Youtu", result: "注册入口进入登录页", access: "当前环境可访问", tone: "review" },
  { service: "WestData", result: "旧域名跳转到新域名", access: "当前环境可访问", tone: "review" },
  { service: "GamsGo", result: "推广参数已保留", access: "当前环境可访问", tone: "review" },
];

const serviceSelectionReasons = [
  { name: "WestData", reason: "提供当前已核验的低价月付档位，可作为低预算或备用线路样本。", evidence: "已登录购买页核验" },
  { name: "Nexitally", reason: "提供31天套餐、明确设备数和速度说明，可代表价格较高、重视长期使用的一类服务。", evidence: "购买页与官方文档" },
  { name: "TAG", reason: "当前月付流量较大，并以多国家和地区覆盖为主要特点，适合展示广覆盖需求。", evidence: "已登录当前商店" },
  { name: "悠兔 Youtu", reason: "提供多平台自有客户端，适合观察“希望少配置”的新手路线；价格仍待复核。", evidence: "客户端入口已确认" },
  { name: "BoostNet", reason: "提供自有客户端和多种周期，可作为非月付、偏性价比方案的对照。", evidence: "当前计划页已核验" },
];

export function NodeGuidePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
      <nav className="node-local-nav" aria-label="机场指南本页目录">
        <strong>本页目录</strong><a href="#basics">先认识概念</a><a href="#guide">实际怎么用</a><a href="#choose">怎么选择</a><a href="#services">服务对比</a><a href="#downloads">客户端下载</a><a href="#status">地址状态</a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> 持续核验，不照搬宣传</div>
          <h1>先弄懂VPN和“机场”，<br /><em>再决定要不要购买</em></h1>
          <p className="hero-lead">从“它是什么、能做什么、为什么还要安装软件”讲起，再比较套餐、付款方式、客户端和入口状态。</p>
          <div className="hero-actions">
            <a className="button primary" href="#basics">从第一个概念开始 <span>→</span></a>
            <a className="button secondary" href="#services">我已经懂了，直接比较</a>
          </div>
          <p className="hero-footnote">部分按钮包含推广关系，但不会影响排序与核验结论。</p>
        </div>
        <aside className="editorial-card" aria-label="今日核验概览">
          <div className="editorial-heading"><div><span className="card-kicker">今天检查了什么</span><h2>今日资料概览</h2></div><span className="live-badge"><i /> 整理中</span></div>
          <div className="overview-list">
            <div><span>网络服务</span><strong>{sortedServices.length} 家</strong><small>当前启用服务，已核验月付优先</small></div>
            <div><span>客户端</span><strong>8 款</strong><small>均连接官方发布页或应用商店</small></div>
            <div><span>访问状态</span><strong>7 项</strong><small>不冒充大陆裸网测试</small></div>
          </div>
          <div className="editor-note"><span className="quote-mark">“</span><p>“能打开”“官方现价”“大陆普通网络可用”是三件不同的事，页面会分开标注。</p></div>
          <div className="verified-line"><span>公开数据同步</span><b>{syncTime}</b></div>
        </aside>
      </section>

      <EditorialCoverFeature slug="nodes" title="网络连接服务：第一次使用指南" lead="先解释VPN、机场、节点、客户端和订阅链接，再进入服务与价格对比。" />

      <section className="section node-basics-section" id="basics">
        <div className="section-heading"><div><span className="section-index">01 / 先认识概念</span><h2>五个词，第一次看到也能懂</h2></div><p>这些词不是一回事。先分清它们，后面的购买和安装才不会混乱。</p></div>
        <div className="plain-term-grid">
          <article><span>VPN</span><h3>一种建立网络连接的技术或服务</h3><p>通常通过加密通道把设备的网络流量发送到另一台服务器。商业VPN一般提供自己的App，具体隐私和可用范围取决于服务商。</p></article>
          <article><span>机场</span><h3>中文互联网中的非正式叫法</h3><p>通常指提供多个代理服务器“节点”和订阅链接的服务商。它不等同于所有VPN，也不是航空机场。</p></article>
          <article><span>节点</span><h3>连接出去时经过的服务器</h3><p>节点常按国家或地区区分。不同节点的出口、速度和可访问服务可能不同，但不能保证解锁所有平台。</p></article>
          <article><span>客户端</span><h3>安装在手机或电脑上的连接软件</h3><p>Clash Verge、v2rayN、Shadowrocket等属于客户端。它们负责读取订阅并建立连接，本身通常不包含可用套餐。</p></article>
          <article><span>订阅链接</span><h3>把套餐和节点导入客户端的个人钥匙</h3><p>购买后由服务商提供。不要发给别人、公开截图或提交给陌生网站，否则可能造成流量被盗用。</p></article>
        </div>
        <div className="connection-diagram" aria-label="机场服务使用流程"><div><small>第1步</small><strong>购买服务</strong><p>获得自己的订阅链接</p></div><i>→</i><div><small>第2步</small><strong>安装客户端</strong><p>只从官方来源下载</p></div><i>→</i><div><small>第3步</small><strong>导入订阅</strong><p>客户端读取节点列表</p></div><i>→</i><div><small>第4步</small><strong>选择节点</strong><p>建立网络连接</p></div></div>
        <div className="can-cannot-grid"><article><h3>它可能帮助你</h3><ul><li>连接服务商提供的境外网络节点</li><li>按需要选择不同地区的出口</li><li>在跨境网络质量合适时改善连接体验</li></ul></article><article className="warning-card"><h3>它不能向你保证</h3><ul><li>完全匿名、绝对安全或永不记录</li><li>所有网站、账号地区和付款方式都能使用</li><li>任何时间、任何网络都保持同样速度</li></ul></article></div>
      </section>

      <section className="section guide-section" id="guide">
        <div className="guide-intro">
          <span className="section-index light">02 / 实际怎么用</span><h2>为什么买完以后<br />还要安装客户端？</h2>
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

      <section className="section node-choice-section" id="choose">
        <div className="section-heading"><div><span className="section-index">03 / 怎么选择</span><h2>先看需求，不要先看广告词</h2></div><p>“IEPL、家宽、专线、稳定”可能来自商家描述。没有持续的多网络实测时，本站不会把它们当成独立性能结论。</p></div>
        <div className="selection-check-grid"><article><span>设备</span><h3>要在哪些设备上用？</h3><p>确认Windows、Mac、Android或iPhone，以及允许同时连接多少台设备。</p></article><article><span>用途</span><h3>主要打开哪些服务？</h3><p>不同服务对地区、IP质量和账号地区的要求不同，不能只看节点数量。</p></article><article><span>流量</span><h3>每月大约使用多少？</h3><p>视频和大文件更耗流量；还要确认流量何时重置、是否存在倍率。</p></article><article><span>售后</span><h3>出问题找谁处理？</h3><p>付款前查看工单、客服、退款、试用和失联后的处理方式。</p></article></div>
        <div className="selection-disclosure"><strong>为什么目前只展示这几家？</strong><p>它们来自当前已经获得入口、后台资料或可持续核验来源的候选服务，并覆盖低预算、长期使用、多地区、自有客户端和非月付等不同情况。它们不是“全市场前五名”，收录也不等于无条件推荐。</p></div>
        <div className="service-reason-grid">{serviceSelectionReasons.map((item) => <article key={item.name}><span>{item.evidence}</span><h3>{item.name}</h3><p>{item.reason}</p></article>)}</div>
      </section>

      <section className="metrics" aria-label="网站数据状态">
        <div><span className="metric-dot green" /><strong>{sortedServices.length}</strong><p>当前启用服务</p></div>
        <div><span className="metric-dot blue" /><strong>8</strong><p>客户端官方入口</p></div>
        <div><span className="metric-dot gold" /><strong>4</strong><p>用户推广入口</p></div>
        <div className="metric-wide"><span>更新原则</span><p>官方来源优先 · 登录价格与公开价格分开 · 异常变化人工复核</p></div>
      </section>

      <section className="section services-section" id="services">
        <div className="section-heading">
          <div><span className="section-index">04 / 服务对比</span><h2>已核验月付优先，再按起价排序</h2></div>
          <p>当前展示 {sortedServices.length} 家。这里只按明确的月付规则排列，不是速度、稳定性或综合质量排行榜。</p>
        </div>
        <div className="sort-note"><strong>排序口径</strong><span>当前可单独购买的月付或约31天套餐</span><i />已核验 <i className="review-dot" />待复核</div>
        <div className="service-grid">
          {sortedServices.map((service, index) => (
            <article className="service-card" key={service.name}>
              <div className="service-topline"><span className="service-tag">展示 {index + 1} · {service.tag}</span><span className={`status-pill ${service.statusTone}`}><i />{service.status}</span></div>
              <div className="service-title"><h3>{service.name}</h3><span>{service.alias}</span></div>
              <p className="service-description">{service.description}</p>
              <div className="service-stats"><div><small>可比参考价格</small><strong>{service.price}</strong><span>{service.cycle}</span></div><div><small>参考流量</small><strong>{service.traffic}</strong></div></div>
              <p className="accuracy-note">{service.accuracy}</p>
              <div className="fact-line"><span>月付</span>{service.monthly}</div>
              <div className="fact-line"><span>客户端</span>{service.ownClient}{service.clientHref && <a href={service.clientHref} target="_blank" rel="noopener noreferrer">自有客户端下载 ↗</a>}</div>
              <div className="payment-line"><span>付款</span>{service.payment}</div>
              <div className="best-for"><span>适合</span>{service.bestFor}</div>
              <a href={service.href} target="_blank" rel="sponsored noopener" className="card-action">{service.linkLabel} <span>↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="section downloads-section" id="downloads">
        <div className="section-heading compact">
          <div><span className="section-index">05 / 客户端下载</span><h2>按设备选，按钮可以直接用</h2></div>
          <p>开源软件进入 GitHub 的 Latest Release；苹果付费软件进入 App Store；不提供来历不明的安装包或 IPA。</p>
        </div>
        <BrandNotice />
        <DeviceChooser context="network" />
        <div className="client-grid">
          {clients.map((client) => (
            <article className="client-card" key={`${client.platform}-${client.app}`}>
              <BrandIcon slug={client.slug} name={client.app} size="large" /><div className="client-platform">{client.platform}</div><h3>{client.app}</h3>
              <div className="version-row"><span>{client.version}</span><small>2026-07-12 核验</small></div><p>{client.note}</p>
              <div className="client-actions"><a href={client.download} target="_blank" rel="noopener noreferrer">官方下载 <span>↗</span></a>{client.project && <a className="muted-action" href={client.project} target="_blank" rel="noopener noreferrer">项目主页</a>}</div>
            </article>
          ))}
        </div>
        <div className="security-alert"><span className="alert-icon">!</span><div><strong>安全提醒</strong><p>下载页可能同时提供多种系统和芯片版本。看不懂文件名时先不要安装；本站后续会补充逐设备截图教程。</p></div><span className="alert-date">所有入口均为官方来源</span></div>
      </section>

      <section className="section status-section" id="status">
        <div className="section-heading compact"><div><span className="section-index">06 / 地址状态</span><h2>能打开，不等于大陆裸网可用</h2></div><p>当前环境是否经过代理未知，所以不会标绿色“大陆可用”。只有真实普通网络测试后才升级状态。</p></div>
        <div className="status-table" role="table" aria-label="地址核验状态">
          <div className="status-row table-head" role="row"><span>服务</span><span>跳转结果</span><span>访问状态</span><span>结论</span></div>
          {addresses.map((item) => <div className="status-row" role="row" key={item.service}><strong>{item.service}</strong><span>{item.result}</span><span className={`status-pill ${item.tone}`}><i />{item.access}</span><span className="table-note">暂不标记大陆裸网可用</span></div>)}
        </div>
      </section>

      <section className="section pending-section" id="pending">
        <div className="section-heading compact"><div><span className="section-index">07 / 待复核清单</span><h2>证据不足的字段，公开列出来</h2></div><p>这些内容不会靠旧宣传资料补齐。完成实际购买页或大陆普通网络测试后才更新。</p></div>
        <div className="verification-queue"><article><span>悠兔 Youtu</span><strong>月付价格、流量与付款方式</strong><p>需要在当前计划页和结算页逐项确认；旧资料约¥40已撤下。</p></article><article><span>TAG</span><strong>付款方式与自有客户端</strong><p>月付套餐已核验，自有客户端仍需有效订阅后确认。</p></article><article><span>BoostNet</span><strong>直接月付是否恢复</strong><p>当前计划页以季付、半年付和年付为主，不按月付价格排序。</p></article><article><span>中国大陆普通网络</span><strong>入口实际可访问性</strong><p>需要关闭代理后分别用家庭宽带和移动网络测试，当前统一标为未核验。</p></article></div>
        <div className="manual-test-note"><strong>安全测试方式</strong><p>只记录“能否打开、是否跳转、时间和网络类型”，不记录账号、密码、Cookie、订阅地址或付款信息。</p><FeedbackLink label="提交实测结果或失效入口" /></div>
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
  const verifiedNodeCount = sortedServices.filter((service) => service.statusTone === "verified").length;
  return (
    <PageShell>
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <span className="eyebrow">先解释是什么，再告诉你怎么选</span>
          <h1>不知道从哪里开始，<br /><em>也能一步一步看懂</em></h1>
          <p>这里不默认你懂VPN、机场、节点、AI模型或第三方订阅。先用普通话解释它们能做什么、是否适合你，再提供价格、官方下载和购买风险。</p>
          <div className="hero-actions"><Link className="button primary" href="#start">我是第一次来 <span>→</span></Link><Link className="button secondary" href="/faq">先看常见问题</Link></div>
          <small>面向中国大陆新手 · 不保存账号、密码、访问密钥或付款信息</small>
        </div>
        <aside className="portal-proof">
          <span>当前资料状态</span><h2>资料有来源，变化有记录</h2>
          <div><strong>{verifiedNodeCount}</strong><small>家机场已核验</small></div>
          <div><strong>{aiProducts.length}</strong><small>项主流 AI</small></div>
          <div><strong>{subscriptionOffers.length}</strong><small>项订阅风险分级</small></div>
          <div><strong>{commonApps.length}</strong><small>项常用应用教程</small></div>
          <p>公开入口每6小时检查；价格、模型和评测数据独立标注来源与更新时间。</p>
        </aside>
      </section>

      <section className="portal-section beginner-start" id="start">
        <SectionHeading index="从这里开始" title="先选你现在想解决的问题" lead="不需要先认识专业名词。找到最接近你的情况，再进入对应教程。" />
        <div className="beginner-choice-grid">
          <Link href="/nodes#basics"><span>01</span><h2>我想了解VPN和“机场”</h2><p>先看它们是什么、有什么区别、为什么还要安装客户端，以及购买前要确认什么。</p><strong>从基本概念开始 →</strong></Link>
          <Link href="/ai#choose"><span>02</span><h2>我想找一款适合自己的AI</h2><p>按写作、查资料、长文档、Google生态、实时内容和图片创作来选择，第一次先用免费版。</p><strong>按用途选择AI →</strong></Link>
          <Link href="/subscriptions#before-buy"><span>03</span><h2>我在考虑购买AI会员</h2><p>先分清官方订阅、本人账号充值、交付账号和共享网页，再判断第三方价格是否值得。</p><strong>先判断要不要买 →</strong></Link>
          <Link href="/downloads"><span>04</span><h2>我只想安全下载软件</h2><p>先选Windows、Mac、Android或iPhone，再前往官网、应用商店或官方项目发布页。</p><strong>按设备找官方下载 →</strong></Link>
        </div>
        <div className="plain-language-rule"><strong>本站的讲解顺序</strong><span>它是什么</span><i>→</i><span>能做什么</span><i>→</i><span>你是否需要</span><i>→</i><span>风险是什么</span><i>→</i><span>怎么选择和操作</span></div>
      </section>

      <section className="portal-section">
        <SectionHeading index="01" title="三条主要学习路线" lead="先理解，再比较；能用免费版时先不急着付费。" />
        <div className="portal-channel-grid">
          <Link href="/nodes" className="channel-card channel-nodes"><span>网络服务</span><h2>机场指南</h2><p>价格、流量、付款、客户端和入口状态分开核验。</p><strong>查看 {sortedServices.length} 家当前服务 →</strong></Link>
          <Link href="/subscriptions" className="channel-card channel-subscriptions"><span>推广与风险</span><h2>AI订阅</h2><p>把官方价、GamsGo公开价和账号交付风险讲清楚。</p><strong>比较 {subscriptionOffers.length} 项订阅 →</strong></Link>
          <Link href="/ai" className="channel-card channel-ai"><span>安装与使用</span><h2>主流 AI 教程</h2><p>按平台提供官方下载、首次使用、提示词和隐私提醒。</p><strong>学习 {aiProducts.length} 项 AI →</strong></Link>
        </div>
      </section>

      <section className="portal-section soft-section">
        <SectionHeading index="02" title="主流 AI，先看适合做什么" lead="不做一个虚假的总排名；根据任务、平台和风险选择。" />
        <BrandNotice />
        <div className="mini-product-grid">
          {aiProducts.map((product) => <Link href={`/ai/${product.slug}`} key={product.slug}><BrandIcon slug={product.slug} name={product.name} /><div><strong>{product.name}</strong><small>{product.company}</small><p>{product.tagline}</p></div><b>教程 →</b></Link>)}
        </div>
      </section>

      <section className="portal-section split-callouts">
        <div><span className="eyebrow">官方下载</span><h2>只连接官网和应用商店</h2><p>Windows、macOS、Android、iOS和网页版分开显示，不提供来历不明的安装包。</p><Link href="/downloads">打开下载中心 →</Link></div>
        <div><span className="eyebrow">常用海外应用</span><h2>YouTube · X · TikTok</h2><p>包含安装、注册、语言、基础使用、账号安全和地区提示。</p><Link href="/apps">查看应用教程 →</Link></div>
      </section>

      <section className="portal-section utility-section">
        <SectionHeading index="03" title="查资料，也要看它什么时候更新" lead="搜索、常见问题、隐私说明和更新记录都公开放在站内。" />
        <div className="utility-link-grid">
          <Link href="/search"><span>快速查找</span><h2>全站搜索</h2><p>按产品、教程、下载、风险或付款关键词查找。</p><strong>开始搜索 →</strong></Link>
          <Link href="/faq"><span>小白问题</span><h2>常见问题</h2><p>先解释最容易混淆的网络、账号、套餐和下载问题。</p><strong>查看回答 →</strong></Link>
          <Link href="/changelog"><span>公开记录</span><h2>更新日志</h2><p>查看价格、入口、模型和页面功能的修改记录。</p><strong>查看变化 →</strong></Link>
        </div>
      </section>
    </PageShell>
  );
}
