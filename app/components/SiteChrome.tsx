import type { ReactNode } from "react";
import Link from "next/link";
import type { DownloadLink, RiskLevel, VerificationStatus } from "../../data/catalog";

const navItems = [
  ["首页", "/"],
  ["机场指南", "/nodes"],
  ["AI订阅", "/subscriptions"],
  ["AI工具", "/ai"],
  ["常用应用", "/apps"],
  ["下载中心", "/downloads"],
  ["核验方法", "/methodology"],
];

export function SiteHeader() {
  return (
    <header className="global-header">
      <Link className="global-brand" href="/" aria-label="数字工具指南首页">
        <span className="global-mark">数</span>
        <span><strong>数字工具指南</strong><small>独立核验 · 小白友好</small></span>
      </Link>
      <nav className="global-nav" aria-label="全站导航">
        {navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
      <details className="mobile-nav">
        <summary aria-label="打开网站菜单">菜单</summary>
        <div>{navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>
      </details>
    </header>
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
      <div><Link href="/methodology">核验方法</Link><Link href="/downloads">官方下载</Link><Link href="/nodes">机场指南</Link></div>
      <small className="footer-disclosure">© 2026 数字工具指南 · 部分链接包含推广关系，最终价格与服务以商家结算页为准。</small>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main className="page-main">{children}</main><SiteFooter /></>;
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
  verified: "官方已核验",
  automatic: "自动核验",
  pending: "待复核",
  error: "读取异常",
  paused: "已暂停",
};

export function VerificationChip({ status }: { status: VerificationStatus }) {
  return <span className={`verify-chip ${status}`}><i />{verificationLabels[status]}</span>;
}

export function RiskBadge({ level, children }: { level: RiskLevel; children: ReactNode }) {
  return <span className={`risk-badge risk-${level}`}>{children}</span>;
}

export function DownloadButtons({ downloads }: { downloads: DownloadLink[] }) {
  return (
    <div className="download-buttons">
      {downloads.map((download) => (
        <a href={download.url} key={`${download.platform}-${download.url}`} target="_blank" rel="noopener noreferrer">
          <span>{download.platform}</span><strong>{download.label}</strong><small>官方来源 ↗</small>
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

export function TutorialPath({ name, steps }: { name: string; steps: string[] }) {
  return (
    <div className="tutorial-path" aria-label={`${name}关键步骤示意`}>
      <div className="tutorial-window-bar"><i /><i /><i /><span>{name} · 关键界面路径</span></div>
      <div className="tutorial-path-body">
        <div className="tutorial-side"><strong>{name}</strong><span>官方入口</span><span>账号与设置</span><span>隐私检查</span></div>
        <ol>{steps.slice(0, 4).map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
      </div>
      <small>界面路径示意 · 产品更新后，按钮名称和位置可能变化，请以官方页面为准。</small>
    </div>
  );
}
