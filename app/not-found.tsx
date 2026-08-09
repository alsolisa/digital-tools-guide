import "./award-system.css";
import Link from "next/link";
import { PageShell } from "./components/SiteChrome";

export default function NotFound() {
  return (
    <PageShell>
      <section className="page-intro not-found-intro">
        <div><span className="eyebrow">404 · 页面没有找到</span><h1>这个入口可能已经变化</h1><p>链接可能输入有误，或者页面已被调整。我们没有把你自动转到购买页，避免误操作。</p></div>
        <aside><strong>先回到安全入口</strong><small>使用站内搜索或首页导航重新进入。</small></aside>
      </section>
      <section className="content-section soft-section">
        <div className="not-found-actions"><Link className="button primary" href="/search">搜索全站</Link><Link className="button secondary" href="/">返回首页</Link><Link className="button secondary" href="/changelog">查看更新记录</Link></div>
      </section>
    </PageShell>
  );
}
