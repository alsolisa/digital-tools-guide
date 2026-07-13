import { notFound } from "next/navigation";
import { commonApps, getCommonApp } from "../../../data/catalog";
import { BrandIcon, DownloadButtons, EditorialCover, FeedbackLink, OfficialScreenshotGallery, PageShell, RegionNotice, SectionHeading, SourceList, TutorialPath, VerificationChip } from "../../components/SiteChrome";

export function generateStaticParams() {
  return commonApps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getCommonApp(slug);
  const basePath = process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : "";
  return app ? { title: `${app.name}安装与使用教程`, description: app.summary, openGraph: { images: [`${basePath}/editorial/${app.slug}.png`] } } : { title: "应用教程" };
}

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getCommonApp(slug);
  if (!app) notFound();
  return (
    <PageShell>
      <section className="detail-hero detail-hero-with-cover app-detail-hero">
        <div className="detail-hero-copy"><div className="detail-title-row"><BrandIcon slug={app.slug} name={app.name} size="hero" /><div><span className="eyebrow">{app.company} · 基础小白教程</span><h1>{app.name}</h1></div></div>
        <p>{app.summary}</p><div className="detail-meta"><VerificationChip status="verified" /><span>官方商店入口</span><span>核验 {app.verifiedAt}</span></div></div>
        <EditorialCover slug={app.slug} name={app.name} />
      </section>
      <section className="content-section"><SectionHeading index="01" title="官方下载" lead="请选择自己的设备，不要下载所谓破解版或修改版。" /><DownloadButtons downloads={app.downloads} /><RegionNotice>{app.regionNote}</RegionNotice></section>
      <section className="content-section soft-section"><SectionHeading index="02" title="官方应用界面示意" lead="用于确认下载到的是正确产品，不代表所有地区都显示相同功能。" /><OfficialScreenshotGallery name={app.name} screenshots={app.screenshots} /></section>
      <section className="content-section"><SectionHeading index="03" title="安装、注册与基础设置" /><ol className="setup-steps">{app.setupSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol></section>
      <section className="content-section soft-section two-guide-columns"><article><SectionHeading index="04" title="设置中文" /><ol>{app.languageSteps.map((step) => <li key={step}>{step}</li>)}</ol></article><article className="warning-card"><SectionHeading index="05" title="账号安全" /><ul>{app.safety.map((item) => <li key={item}>{item}</li>)}</ul></article></section>
      <section className="content-section soft-section"><TutorialPath name={app.name} slug={app.slug} steps={app.setupSteps} /></section>
      <section className="content-section sources-section"><SectionHeading index="06" title="官方资料来源" /><SourceList sources={app.officialSources} /><FeedbackLink /></section>
    </PageShell>
  );
}
