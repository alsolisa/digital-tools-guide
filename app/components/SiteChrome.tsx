import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import type { DownloadLink, OfficialScreenshot, RiskLevel, VerificationStatus } from "../../data/catalog";

const officialIcons: Record<string, string> = {
  chatgpt: "/brands/chatgpt.jpg",
  claude: "/brands/claude.jpg",
  gemini: "/brands/gemini.jpg",
  grok: "/brands/grok.jpg",
  perplexity: "/brands/perplexity.jpg",
  midjourney: "/brands/midjourney.jpg",
  youtube: "/brands/youtube.jpg",
  x: "/brands/x.jpg",
  tiktok: "/brands/tiktok.jpg",
  "clash-verge": "/clients/clash-verge.png",
  v2rayn: "/clients/v2rayn.png",
  flclash: "/clients/flclash.png",
  hiddify: "/clients/hiddify.svg",
  shadowrocket: "/clients/shadowrocket.jpg",
  "quantumult-x": "/clients/quantumult-x.jpg",
  stash: "/clients/stash.jpg",
  surge: "/clients/surge.jpg",
};

function publicAsset(path: string) {
  return `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}${path}`;
}

const navItems = [
  ["首页", "/"],
  ["新手入门", "/#start"],
  ["网络连接", "/nodes"],
  ["AI怎么选", "/ai"],
  ["AI订阅", "/subscriptions"],
  ["常用应用", "/apps"],
  ["下载中心", "/downloads"],
];

export function SiteHeader() {
  return (
    <><a className="skip-link" href="#main-content">跳到主要内容</a><header className="global-header">
      <Link className="global-brand" href="/" aria-label="数字工具指南首页">
        <span className="global-mark">数</span>
        <span><strong>数字工具指南</strong><small>逐项核对 · 第一次也能懂</small></span>
      </Link>
      <nav className="global-nav" aria-label="全站导航">
        {navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
      <details className="mobile-nav">
        <summary aria-label="打开网站菜单">菜单</summary>
        <div>{navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>
      </details>
    </header></>
  );
}

export function SiteFooter() {
  return (
    <footer className="global-footer">
      <div className="global-brand footer-brand">
        <span className="global-mark">数</span>
        <span><strong>数字工具指南</strong><small>把来源放在推荐前面</small></span>
      </div>
      <p>公开资料与新手教程整理站。不销售软件，不保存账号、密码、订阅链接、访问密钥或付款信息。</p>
      <div><Link href="/search">站内搜索</Link><Link href="/faq">常见问题</Link><Link href="/privacy">隐私说明</Link><Link href="/disclosure">推广说明</Link><Link href="/changelog">更新记录</Link><Link href="/methodology">核验方法</Link><Link href="/downloads">官方下载</Link><Link href="/nodes">机场指南</Link></div>
      <small className="footer-disclosure">© 2026 数字工具指南 · 部分链接包含推广关系，最终价格与服务以商家结算页为准。产品标志归各自权利人所有，仅用于识别；不代表品牌方认可或合作。</small>
      <small className="footer-trademark">Midjourney™ is a trademark of Midjourney, Inc. We are not endorsed by or affiliated with Midjourney, Inc.</small>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main className="page-main" id="main-content">{children}</main><SiteFooter /></>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="当前位置">{items.map((item, index) => <span key={`${item.label}-${index}`}>{index > 0 && <i aria-hidden="true">/</i>}{item.href ? <Link href={item.href}>{item.label}</Link> : <strong aria-current="page">{item.label}</strong>}</span>)}</nav>;
}

export function PageIntro({ eyebrow, title, lead, aside }: { eyebrow: string; title: string; lead: string; aside?: ReactNode }) {
  return (
    <section className="page-intro">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{lead}</p></div>
      {aside && <aside>{aside}</aside>}
    </section>
  );
}

export function SectionHeading({ index, title, lead }: { index?: string; title: string; lead?: string }) {
  return <div className="content-heading">{index && <span>{index}</span>}<div><h2>{title}</h2>{lead && <p>{lead}</p>}</div></div>;
}

const verificationLabels: Record<VerificationStatus, string> = {
  verified: "已核对资料",
  automatic: "自动检查",
  pending: "待复核",
  error: "读取异常",
  paused: "已暂停",
};

export function VerificationChip({ status }: { status: VerificationStatus }) {
  return <span className={`verify-chip ${status}`}><i />{verificationLabels[status]}</span>;
}

export function BrandIcon({ slug, name, size = "default" }: { slug: string; name: string; size?: "small" | "default" | "large" | "hero" }) {
  const src = officialIcons[slug];
  if (!src) return <span className={`brand-icon brand-icon-${size} brand-icon-fallback`} aria-hidden="true">{name.slice(0, 1)}</span>;
  return (
    <span className={`brand-icon brand-icon-${size}`} title={`${name} 官方应用图标`}>
      <Image src={publicAsset(src)} alt="" width={96} height={96} unoptimized />
    </span>
  );
}

export function BrandNotice() {
  return <p className="brand-notice">品牌图标来自品牌官方资料、官方应用商店或官方项目仓库，仅用于帮助识别产品；本站不是这些品牌的官方网站，也不代表获得其推荐。</p>;
}

export function EditorialCover({ slug, name }: { slug: string; name: string }) {
  const src = publicAsset(`/editorial/${slug}.png`);
  return <figure className="editorial-cover-figure"><a href={src} target="_blank" rel="noopener noreferrer" aria-label={`打开${name}高清视觉指南`}><Image src={src} alt={`${name}编辑版视觉指南封面`} width={1080} height={1350} unoptimized priority /></a></figure>;
}

export function EditorialCoverFeature({ slug, title, lead }: { slug: string; title: string; lead: string }) {
  const src = publicAsset(`/editorial/${slug}.png`);
  return (
    <section className="editorial-cover-feature">
      <div><span>可保存的视觉版</span><h2>{title}</h2><p>{lead}</p><a href={src} target="_blank" rel="noopener noreferrer">打开高清封面 ↗</a></div>
      <EditorialCover slug={slug} name={title} />
    </section>
  );
}

export function OfficialScreenshotGallery({ name, screenshots }: { name: string; screenshots: OfficialScreenshot[] }) {
  return (
    <div className="official-screenshot-grid">
      {screenshots.map((shot, index) => (
        <figure key={shot.src}>
          <div className="official-screenshot-media">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <Image src={publicAsset(shot.src)} alt={shot.alt} width={720} height={1080} unoptimized />
          </div>
          <figcaption><strong>{shot.title}</strong><p>{shot.caption}</p><a href={shot.sourceUrl} target="_blank" rel="noopener noreferrer">{shot.sourceLabel}官方条目 ↗</a></figcaption>
        </figure>
      ))}
      <p className="screenshot-source-note">{name}官方应用商店截图 · 仅用于识别界面与功能，实际布局、语言、功能和套餐可能随版本及地区变化。</p>
    </div>
  );
}

export function FeedbackLink({ label = "报告错误或失效入口" }: { label?: string }) {
  const href = "https://github.com/alsolisa/digital-tools-guide/issues/new?title=%E8%B5%84%E6%96%99%E6%88%96%E5%85%A5%E5%8F%A3%E9%9C%80%E8%A6%81%E6%9B%B4%E6%96%B0&body=%E9%A1%B5%E9%9D%A2%EF%BC%9A%0A%E9%97%AE%E9%A2%98%EF%BC%9A%0A%E6%88%91%E7%9C%8B%E5%88%B0%E7%9A%84%E6%97%B6%E9%97%B4%EF%BC%9A";
  return <a className="feedback-link" href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>;
}

export function RiskBadge({ level, children }: { level: RiskLevel; children: ReactNode }) {
  return <span className={`risk-badge risk-${level}`}>{children}</span>;
}

export function DownloadButtons({ downloads }: { downloads: DownloadLink[] }) {
  return (
    <div className="download-buttons">
      {downloads.map((download) => (
        <a href={download.url} key={`${download.platform}-${download.url}`} target="_blank" rel="noopener noreferrer" aria-label={`${download.label}，在新窗口打开官方来源`}>
          <span>{download.platform}</span><strong>{download.label}</strong><small>{download.source === "app-store" ? "Apple App Store" : download.source === "google-play" ? "Google Play" : download.source === "microsoft-store" ? "Microsoft Store" : "产品官网"} ↗</small>
        </a>
      ))}
    </div>
  );
}

export function SourceList({ sources }: { sources: { label: string; url: string }[] }) {
  return <ul className="source-list">{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ul>;
}

export function Disclosure() {
  return <div className="disclosure"><strong>推广关系说明</strong><p>本页部分购买按钮包含推广关系。推广收益不会改变排序、风险等级或核验结论。</p></div>;
}

export function RegionNotice({ children }: { children: ReactNode }) {
  return <div className="region-notice"><span>地区提示</span><p>{children}</p></div>;
}

export function TutorialPath({ name, slug, steps }: { name: string; slug: string; steps: string[] }) {
  return (
    <div className="tutorial-path" aria-label={`${name}关键步骤示意`}>
      <div className="tutorial-window-bar"><i /><i /><i /><span>{name} · 关键界面路径</span></div>
      <div className="tutorial-path-body">
        <div className="tutorial-side"><div className="tutorial-brand"><BrandIcon slug={slug} name={name} size="large" /><strong>{name}</strong></div><span>官方入口</span><span>账号与设置</span><span>隐私检查</span></div>
        <ol>{steps.slice(0, 4).map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
      </div>
      <small>界面路径示意 · 产品更新后，按钮名称和位置可能变化，请以官方页面为准。</small>
    </div>
  );
}
