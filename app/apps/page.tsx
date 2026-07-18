import { commonApps } from "../../data/catalog";
import { getAppEditorialGuide } from "../../data/editorial-guides";
import Link from "next/link";
import { BrandIcon, BrandNotice, PageIntro, PageShell, RegionNotice, SectionHeading, VerificationChip } from "../components/SiteChrome";

export const metadata = {
  title: "常用海外应用教程",
  description: "YouTube、X与TikTok的官方下载、注册登录、语言设置、账号安全和地区提示。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/apps/` },
};

export default function AppsIndexPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="常用海外应用 · 从用途开始" title="先知道它是做什么的，再决定要不要安装" lead="首批选择YouTube、X和TikTok，是因为它们分别代表长视频与学习、实时公开信息、短视频与创作三种常见需求。本站不把收录理解成无条件推荐。" artwork={{ src: "/illustrations/media-apps-v1.webp", alt: "长视频、实时讨论和手机短视频三种内容形态相互连接的原创纸艺插画", caption: "原创插画 · 三种应用对应三种内容节奏" }} />
      <section className="content-section app-scope-section">
        <SectionHeading index="01" title="为什么先介绍这三项？" lead="它们使用人数多、地区差异明显，也最容易出现商店搜不到、账号地区不一致和下载到修改版等问题。" />
        <div className="selection-check-grid"><article><span>YouTube</span><h3>长视频、学习和创作者内容</h3><p>适合观看教程、课程、音乐、直播和订阅频道。</p></article><article><span>X</span><h3>实时信息和公开讨论</h3><p>适合关注新闻、趋势、专业账号和社区讨论；公开内容仍需要核实来源。</p></article><article><span>TikTok</span><h3>短视频、娱乐和内容创作</h3><p>适合短视频浏览与发布；它与中国大陆的抖音不是同一产品。</p></article><article><span>收录范围</span><h3>这是第一批，不是完整名单</h3><p>后续是否加入其他应用，要看用户需求、官方入口、地区说明和教程资料是否能够可靠核验。</p></article></div>
      </section>
      <section className="content-section">
        <SectionHeading index="02" title="三项常用应用" />
        <BrandNotice />
        <div className="app-card-grid">
          {commonApps.map((app) => <article key={app.slug}><div className="app-card-head"><BrandIcon slug={app.slug} name={app.name} size="large" /><VerificationChip status="verified" /></div><span className="card-kicker">{app.company}</span><h2>{app.name}</h2><p>{app.tagline}</p><small>{getAppEditorialGuide(app.slug)?.verdict || app.summary}</small><div className="platform-pills">{app.downloads.map((download) => <span key={download.platform}>{download.platform}</span>)}</div><Link href={`/apps/${app.slug}`}>查看完整使用教程 →</Link></article>)}
        </div>
      </section>
      <section className="content-section soft-section">
        <SectionHeading index="03" title="三款应用不是互相替代：按内容形态选择" />
        <div className="choice-matrix app-choice-matrix" role="table" aria-label="常用应用选择对照"><div className="choice-row choice-head" role="row"><span>产品</span><span>内容重点</span><span>更适合</span><span>主要风险</span></div><div className="choice-row" role="row"><strong>YouTube</strong><span>长视频、课程、直播</span><span>系统学习和长期订阅频道</span><span>推荐沉迷、错误教程、破解版</span></div><div className="choice-row" role="row"><strong>X</strong><span>实时公开信息与讨论</span><span>跟踪当事方、行业和新闻动态</span><span>假账号、断章取义、私信钓鱼</span></div><div className="choice-row" role="row"><strong>TikTok</strong><span>短视频、趋势、创作</span><span>内容发现和国际短视频表达</span><span>地区差异、时长、未成年人隐私</span></div></div>
      </section>
      <section className="content-section"><SectionHeading index="04" title="下载前先理解地区差异" /><RegionNotice>应用能否在商店中看到、账号能否注册、某项功能能否使用，是三个不同问题。本站分别标注，不把“当前网络能打开”写成“中国大陆裸网可用”。</RegionNotice><Link className="feedback-link" href="/stores">查看Apple与Google应用商店地区教程 →</Link></section>
    </PageShell>
  );
}
