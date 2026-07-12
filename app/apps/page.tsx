import { commonApps } from "../../data/catalog";
import Link from "next/link";
import { PageIntro, PageShell, RegionNotice, SectionHeading, VerificationChip } from "../components/SiteChrome";

export const metadata = {
  title: "常用海外应用教程",
  description: "YouTube、X与TikTok的官方下载、注册登录、语言设置、账号安全和地区提示。",
};

export default function AppsIndexPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="常用应用 · 只连官方商店" title="下载只是第一步，账号安全更重要" lead="YouTube、X和TikTok分别提供官方安装、注册、语言、基础使用与地区说明。不要从网盘、群文件或陌生网站下载修改版。" />
      <section className="content-section">
        <SectionHeading index="01" title="三项常用应用" />
        <div className="app-card-grid">
          {commonApps.map((app) => <article key={app.slug}><div className="app-card-head"><span className="catalog-mark large ink">{app.mark}</span><VerificationChip status="verified" /></div><span className="card-kicker">{app.company}</span><h2>{app.name}</h2><p>{app.tagline}</p><small>{app.summary}</small><div className="platform-pills">{app.downloads.map((download) => <span key={download.platform}>{download.platform}</span>)}</div><Link href={`/apps/${app.slug}`}>查看安装与使用教程 →</Link></article>)}
        </div>
      </section>
      <section className="content-section soft-section"><SectionHeading index="02" title="先理解地区差异" /><RegionNotice>应用能否在商店中看到、账号能否注册、某项功能能否使用，是三个不同问题。本站分别标注，不把“当前网络能打开”写成“中国大陆裸网可用”。</RegionNotice></section>
    </PageShell>
  );
}
