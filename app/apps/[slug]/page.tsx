import { notFound } from "next/navigation";
import { commonApps, getCommonApp } from "../../../data/catalog";
import { getAppEditorialGuide } from "../../../data/editorial-guides";
import { BrandIcon, Breadcrumbs, DownloadButtons, EditorialCover, FeedbackLink, OfficialScreenshotGallery, PageShell, QuickSummary, RegionNotice, SectionHeading, SourceList, TutorialPath, VerificationChip } from "../../components/SiteChrome";
import ActionChecklist from "../../components/ActionChecklist";
import StructuredData from "../../components/StructuredData";

export function generateStaticParams() {
  return commonApps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getCommonApp(slug);
  const basePath = process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : "";
  return app ? { title: `${app.name}完整安装与使用教程`, description: app.summary, alternates: { canonical: `${basePath}/apps/${app.slug}/` }, openGraph: { images: [`${basePath}/editorial/${app.slug}.png`] } } : { title: "应用教程" };
}

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getCommonApp(slug);
  const guide = getAppEditorialGuide(slug);
  if (!app || !guide) notFound();
  const webEntry = app.downloads.find((item) => item.platform === "Web");
  const howToJsonLd = { "@context": "https://schema.org", "@type": "HowTo", name: `${app.name}安装与第一次使用教程`, description: app.summary, step: app.setupSteps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: `第${index + 1}步`, text: step })) };
  const softwareJsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: app.name, applicationCategory: "SocialNetworkingApplication", operatingSystem: [...new Set(app.downloads.map((download) => download.platform))].join(", "), description: app.summary, url: webEntry?.url, publisher: { "@type": "Organization", name: app.company } };

  return (
    <PageShell>
      <StructuredData data={[howToJsonLd, softwareJsonLd]} />
      <Breadcrumbs items={[{ label: "首页", href: "/" }, { label: "常用应用", href: "/apps" }, { label: app.name }]} />
      <section className="detail-hero detail-hero-with-cover professional-detail-hero app-detail-hero">
        <div className="detail-hero-copy"><div className="detail-title-row"><BrandIcon slug={app.slug} name={app.name} size="hero" /><div><span className="eyebrow">{app.company} · 从用途到安全设置</span><h1>{app.name}</h1></div></div><p>{guide.verdict}</p><div className="detail-hero-actions">{webEntry && <a className="button primary" href={webEntry.url} target="_blank" rel="noopener noreferrer">先打开网页版 <span>↗</span></a>}<a className="button secondary" href="#screenshots">先看官方界面</a></div><div className="detail-meta"><VerificationChip status="verified" /><span>官方商店入口</span><span>核验 {app.verifiedAt}</span></div></div>
        <EditorialCover slug={app.slug} name={app.name} />
      </section>

      <QuickSummary title={guide.decision} points={[`最适合：${guide.whyUse[0]}`, `常见误区：${guide.notFor[0]}`, "优先使用网页版或官方应用商店", "注册后先检查恢复方式、隐私与通知"]} action={webEntry ? { label: "打开官方网页版", href: webEntry.url } : undefined} />

      <nav className="detail-jump-nav" aria-label={`${app.name}页面目录`}><span>本页顺序</span><a href="#understand">它是什么</a><a href="#features">主要区域</a><a href="#workflows">怎么使用</a><a href="#screenshots">官方截图</a><a href="#start">安装设置</a><a href="#safety">安全检查</a></nav>

      <section className="content-section" id="understand">
        <SectionHeading index="01" title={`先说明白：${app.name}到底是做什么的`} lead="先判断是否符合你的需要，再考虑下载、注册或付费。" />
        <div className="plain-definition"><span>简单理解</span><p>{guide.plainDefinition}</p></div>
        <div className="fit-decision-grid"><article><span className="decision-label good">适合用来</span><h2>它最常见的价值</h2><ul>{guide.whyUse.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="warning-card"><span className="decision-label wait">不要这样用</span><h2>常见误区</h2><ul>{guide.notFor.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
        <div className="editorial-verdict"><strong>编辑结论</strong><p>{guide.decision}</p></div>
      </section>

      <section className="content-section soft-section" id="features">
        <SectionHeading index="02" title="打开应用后，先认识四个主要区域" lead="不用一次学会所有按钮。先知道每个区域解决什么问题。" />
        <div className="feature-explainer-grid">{guide.coreAreas.map((feature) => <article key={feature.name}><span>{feature.name}</span><p>{feature.plain}</p><div><small>新手可以这样用</small><strong>{feature.example}</strong></div></article>)}</div>
      </section>

      <section className="content-section" id="workflows">
        <SectionHeading index="03" title="三个真实用法：从打开到完成一件事" lead="每个场景都包含操作顺序、预期结果和风险提醒。" />
        <div className="workflow-grid">{guide.workflows.map((workflow, index) => <article key={workflow.title}><span className="workflow-number">0{index + 1}</span><small>实际场景</small><h2>{workflow.title}</h2><p className="workflow-situation">{workflow.situation}</p><ol>{workflow.steps.map((step) => <li key={step}>{step}</li>)}</ol><div className="workflow-result"><strong>你会得到</strong><p>{workflow.result}</p></div><div className="workflow-caution"><strong>别忽略</strong><p>{workflow.caution}</p></div></article>)}</div>
      </section>

      <section className="content-section soft-section screenshot-showcase" id="screenshots">
        <SectionHeading index="04" title="官方高清界面图：这一屏应该看哪里" lead="截图来自官方应用商店，中文说明帮助你识别正确产品、主要入口和需要注意的设置。" />
        <OfficialScreenshotGallery name={app.name} screenshots={app.screenshots} />
        <div className="screenshot-to-action"><strong>先认界面，再按路线操作</strong><p>官方宣传截图用于识别产品和功能；下面的路线图说明安装后应该依次检查什么。</p></div>
        <TutorialPath name={app.name} slug={app.slug} steps={app.setupSteps} />
      </section>

      <section className="content-section" id="download">
        <SectionHeading index="05" title="选择设备，进入官方入口" lead="请确认开发者名称和商店页面；不要下载破解版、修改版、网盘包或陌生人提供的共享账号。" />
        <DownloadButtons downloads={app.downloads} /><RegionNotice>{app.regionNote}</RegionNotice>
      </section>

      <section className="content-section soft-section" id="start">
        <SectionHeading index="06" title="第一次打开后的十分钟" lead="先把账号、推荐和隐私设置好，再开始长期使用。" />
        <div className="first-ten-layout"><ol className="first-ten-list">{guide.firstTenMinutes.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol><aside><span>安装与注册顺序</span><ol>{app.setupSteps.map((step) => <li key={step}>{step}</li>)}</ol></aside></div>
        <ActionChecklist id={`app-${app.slug}`} title={`${app.name}安装与安全清单`} items={[...app.setupSteps.slice(0, 4), "确认恢复邮箱或手机号由自己控制", "检查隐私、通知和推荐设置"]} />
      </section>

      <section className="content-section" id="safety">
        <SectionHeading index="07" title="中文、账号与隐私设置" lead="界面语言、内容地区和账号地区是三件不同的事，不要混在一起。" />
        <div className="two-guide-columns"><article><span className="guide-card-label">设置中文</span><ol>{app.languageSteps.map((step) => <li key={step}>{step}</li>)}</ol></article><article className="warning-card"><span className="guide-card-label">账号安全</span><ul>{app.safety.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
      </section>

      <section className="content-section soft-section"><SectionHeading index="08" title="免费版够不够？" /><div className="plain-definition paid-explainer"><span>先看使用频率</span><p>{guide.freeVsPaid}</p></div></section>

      <section className="content-section sources-section"><SectionHeading index="09" title="本页官方资料来源" lead="功能说明来自品牌帮助中心和官方应用商店，页面更新后以官方资料为准。" /><SourceList sources={app.officialSources} /><FeedbackLink /></section>
    </PageShell>
  );
}
