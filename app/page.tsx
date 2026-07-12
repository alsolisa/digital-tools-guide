import syncStatus from "../data/sync-status.json";
import Link from "next/link";
import { aiProducts, commonApps, subscriptionOffers } from "../data/catalog";
import { BrandIcon, BrandNotice, PageShell, SectionHeading, SiteFooter, SiteHeader } from "./components/SiteChrome";

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
  { service: "Nexitally", result: "官方文档可打开", access: "当前网络已访问", tone: "review" },
  { service: "WgetCloud", result: "永久入口会跳转", access: "官方入口已确认", tone: "review" },
  { service: "TAG", result: "tagss04.pro 已劫持；已换 tagss.pro", access: "当前官网与商店已核验", tone: "review" },
  { service: "BoostNet", result: "邀请码可自动写入", access: "当前网络已访问", tone: "review" },
  { service: "悠兔 Youtu", result: "注册入口进入登录页", access: "当前网络已访问", tone: "review" },
  { service: "WestData", result: "旧域名跳转到新域名", access: "当前网络已访问", tone: "review" },
  { service: "GamsGo", result: "推广参数已保留", access: "当前网络已访问", tone: "review" },
];

export function NodeGuidePage() {
  return (
    <>
      <SiteHeader />
      <main>
      <nav className="node-local-nav" aria-label="机场指南本页目录">
        <strong>本页目录</strong><a href="#guide">新手入门</a><a href="#services">服务对比</a><a href="#downloads">客户端下载</a><a href="#status">地址状态</a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> 持续核验，不照搬宣传</div>
          <h1>第一次也能看懂的<br /><em>网络服务指南</em></h1>
          <p className="hero-lead">官网、套餐、付款方式、客户端和访问状态集中整理。每一条信息都标注来源与核验程度，帮助你少走弯路。</p>
          <div className="hero-actions">
            <a className="button primary" href="#guide">新手三分钟入门 <span>→</span></a>
            <a className="button secondary" href="#services">查看服务对比</a>
          </div>
          <p className="hero-footnote">部分按钮包含推广关系，但不会影响排序与核验结论。</p>
        </div>
        <aside className="editorial-card" aria-label="今日核验概览">
          <div className="editorial-heading"><div><span className="card-kicker">TODAY&apos;S CHECK</span><h2>今日核验概览</h2></div><span className="live-badge"><i /> 整理中</span></div>
          <div className="overview-list">
            <div><span>网络服务</span><strong>{sortedServices.length} 家</strong><small>当前启用服务，已核验月付优先</small></div>
            <div><span>客户端</span><strong>8 款</strong><small>均连接官方发布页或应用商店</small></div>
            <div><span>访问状态</span><strong>7 项</strong><small>不冒充大陆裸网测试</small></div>
          </div>
          <div className="editor-note"><span className="quote-mark">“</span><p>“能打开”“官方现价”“大陆普通网络可用”是三件不同的事，页面会分开标注。</p></div>
          <div className="verified-line"><span>公开数据同步</span><b>{syncTime}</b></div>
        </aside>
      </section>

      <section className="metrics" aria-label="网站数据状态">
        <div><span className="metric-dot green" /><strong>{sortedServices.length}</strong><p>当前启用服务</p></div>
        <div><span className="metric-dot blue" /><strong>8</strong><p>客户端官方入口</p></div>
        <div><span className="metric-dot gold" /><strong>4</strong><p>用户推广入口</p></div>
        <div className="metric-wide"><span>更新原则</span><p>官方来源优先 · 登录价格与公开价格分开 · 异常变化人工复核</p></div>
      </section>

      <section className="section services-section" id="services">
        <div className="section-heading">
          <div><span className="section-index">01 / 服务对比</span><h2>已核验月付优先，再按起价排序</h2></div>
          <p>当前展示 {sortedServices.length} 家。只有购买页确认可单独月付的套餐才进入价格排序；暂停使用、待核验和暂无直接月付的服务不进入正式排名。</p>
        </div>
        <div className="sort-note"><strong>排序口径</strong><span>当前可单独购买的月付或约31天套餐</span><i />已核验 <i className="review-dot" />待复核</div>
        <div className="service-grid">
          {sortedServices.map((service, index) => (
            <article className="service-card" key={service.name}>
              <div className="service-topline"><span className="service-tag">#{index + 1} · {service.tag}</span><span className={`status-pill ${service.statusTone}`}><i />{service.status}</span></div>
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

      <section className="section guide-section" id="guide">
        <div className="guide-intro">
          <span className="section-index light">02 / 新手入门</span><h2>为什么购买后<br />还需要客户端？</h2>
          <p>服务商给你的是一串“订阅信息”，客户端把它变成手机或电脑能使用的连接。可以理解为：套餐是车票，客户端是检票并带你上车的工具。</p>
          <a href="#downloads" className="button light-button">按设备选择客户端 →</a>
        </div>
        <div className="steps">
          <article><span>01</span><div><small>第一步</small><h3>在正确入口购买</h3><p>先核对域名和推广码，再选择套餐。付款前确认周期、流量和退款规则。</p></div></article>
          <article><span>02</span><div><small>第二步</small><h3>安装官方客户端</h3><p>Windows、安卓和苹果设备使用的软件不同，只从项目主页或应用商店下载。</p></div></article>
          <article><span>03</span><div><small>第三步</small><h3>复制订阅并导入</h3><p>订阅链接等同个人钥匙，不要发给别人，也不要截图公开。导入后更新节点即可。</p></div></article>
        </div>
      </section>

      <section className="section downloads-section" id="downloads">
        <div className="section-heading compact">
          <div><span className="section-index">03 / 客户端下载</span><h2>按设备选，按钮可以直接用</h2></div>
          <p>开源软件进入 GitHub 的 Latest Release；苹果付费软件进入 App Store；不提供来历不明的安装包或 IPA。</p>
        </div>
        <BrandNotice />
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
        <div className="section-heading compact"><div><span className="section-index">04 / 地址状态</span><h2>能打开，不等于大陆裸网可用</h2></div><p>当前环境是否经过代理未知，所以不会标绿色“大陆可用”。只有真实普通网络测试后才升级状态。</p></div>
        <div className="status-table" role="table" aria-label="地址核验状态">
          <div className="status-row table-head" role="row"><span>服务</span><span>跳转结果</span><span>访问状态</span><span>结论</span></div>
          {addresses.map((item) => <div className="status-row" role="row" key={item.service}><strong>{item.service}</strong><span>{item.result}</span><span className={`status-pill ${item.tone}`}><i />{item.access}</span><span className="table-note">暂不标记大陆裸网可用</span></div>)}
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
  const verifiedNodeCount = sortedServices.filter((service) => service.statusTone === "verified").length;
  return (
    <PageShell>
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <span className="eyebrow">三个频道 · 一套核验标准</span>
          <h1>第一次也能看懂的<br /><em>数字工具指南</em></h1>
          <p>机场、AI订阅、主流AI与常用应用集中整理。我们把官方入口、真实价格、账号风险和小白教程放在同一个可信框架里。</p>
          <div className="hero-actions"><Link className="button primary" href="/ai">从 AI 工具开始 <span>→</span></Link><Link className="button secondary" href="/methodology">查看核验方法</Link></div>
          <small>面向中国大陆新手 · 不保存账号、密码、访问密钥或付款信息</small>
        </div>
        <aside className="portal-proof">
          <span>LIVE EDITORIAL</span><h2>资料有来源，变化有记录</h2>
          <div><strong>{verifiedNodeCount}</strong><small>家机场已核验</small></div>
          <div><strong>{aiProducts.length}</strong><small>项主流 AI</small></div>
          <div><strong>{subscriptionOffers.length}</strong><small>项订阅风险分级</small></div>
          <div><strong>{commonApps.length}</strong><small>项常用应用教程</small></div>
          <p>公开入口每6小时检查；价格、模型和评测数据独立标注来源与更新时间。</p>
        </aside>
      </section>

      <section className="portal-section">
        <SectionHeading index="01" title="三个核心频道" lead="先解决“去哪里”，再解决“怎么买、怎么下载、怎么用”。" />
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
    </PageShell>
  );
}
