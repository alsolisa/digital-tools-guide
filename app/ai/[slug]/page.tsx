import { notFound } from "next/navigation";
import Link from "next/link";
import { aiProducts, getAiProduct, subscriptionOffers } from "../../../data/catalog";
import { getAiEditorialGuide } from "../../../data/editorial-guides";
import { aiPlaybooks } from "../../../data/beginner-playbooks";
import { BrandIcon, Breadcrumbs, DownloadButtons, EditorialCover, FeedbackLink, OfficialScreenshotGallery, PageShell, QuickSummary, RegionNotice, SectionHeading, SourceList, TutorialPath, VerificationChip } from "../../components/SiteChrome";
import ActionChecklist from "../../components/ActionChecklist";
import BeginnerTroubleshooter from "../../components/BeginnerTroubleshooter";
import StructuredData from "../../components/StructuredData";

export function generateStaticParams() {
  return aiProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getAiProduct(slug);
  const basePath = process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : "";
  return product ? { title: `${product.name}完整小白教程`, description: product.summary, alternates: { canonical: `${basePath}/ai/${product.slug}/` }, openGraph: { images: [`${basePath}/editorial/${product.slug}.png`] } } : { title: "AI教程" };
}

export default async function AiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getAiProduct(slug);
  const guide = getAiEditorialGuide(slug);
  if (!product || !guide) notFound();
  const playbook = aiPlaybooks[slug];
  const offer = subscriptionOffers.find((item) => item.productSlug === product.slug);
  const webEntry = product.downloads.find((item) => item.platform === "Web");
  const howToJsonLd = { "@context": "https://schema.org", "@type": "HowTo", name: `${product.name}第一次使用教程`, description: product.summary, step: product.setupSteps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: `第${index + 1}步`, text: step })) };
  const softwareJsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: product.name, applicationCategory: "BusinessApplication", operatingSystem: [...new Set(product.downloads.map((download) => download.platform))].join(", "), description: product.summary, url: webEntry?.url, publisher: { "@type": "Organization", name: product.company } };

  return (
    <PageShell>
      <StructuredData data={[howToJsonLd, softwareJsonLd]} />
      <Breadcrumbs items={[{ label: "首页", href: "/" }, { label: "AI怎么选", href: "/ai" }, { label: product.name }]} />

      <section className="detail-hero detail-hero-with-cover professional-detail-hero">
        <div className="detail-hero-copy">
          <div className="detail-title-row"><BrandIcon slug={product.slug} name={product.name} size="hero" /><div><span className="eyebrow">{product.company} · 从用途到第一次完成任务</span><h1>{product.name}</h1></div></div>
          <p>{guide.verdict}</p>
          <div className="detail-hero-actions">{webEntry && <a className="button primary" href={webEntry.url} target="_blank" rel="noopener noreferrer">先打开网页版试用 <span>↗</span></a>}<a className="button secondary" href="#screenshots">先看官方界面</a></div>
          <div className="detail-meta"><VerificationChip status="verified" /><span>官方资料优先</span><span>核验 {product.verifiedAt}</span><span>模型参数量：官方未公开</span></div>
        </div>
        <EditorialCover slug={product.slug} name={product.name} />
      </section>

      <QuickSummary title={guide.decision} points={[`最适合：${guide.chooseIf[0]}`, `先别选：${guide.skipIf[0]}`, "第一次先用免费版完成一个真实任务", "重要答案、数字和来源必须自己核对"]} action={webEntry ? { label: "打开官方网页版", href: webEntry.url } : undefined} />

      <nav className="detail-jump-nav" aria-label={`${product.name}页面目录`}>
        <span>本页顺序</span><a href="#understand">先看懂</a><a href="#workflows">真实场景</a><a href="#screenshots">官方截图</a><a href="#start">第一次使用</a><a href="#plans">是否付费</a><a href="#advanced">进阶资料</a>
      </nav>

      <section className="content-section" id="understand">
        <SectionHeading index="01" title={`先用一句普通话讲清楚：${product.name}是什么`} lead="这一部分不讲模型名称，先判断它能不能解决你的实际问题。" />
        <div className="plain-definition"><span>简单理解</span><p>{guide.plainDefinition}</p></div>
        <div className="fit-decision-grid">
          <article><span className="decision-label good">优先选择</span><h2>这些情况更适合</h2><ul>{guide.chooseIf.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="warning-card"><span className="decision-label wait">先比较别款</span><h2>这些情况不必急着选</h2><ul>{guide.skipIf.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
        <div className="editorial-verdict"><strong>编辑结论</strong><p>{guide.decision}</p></div>
      </section>

      <section className="content-section soft-section" id="workflows">
        <SectionHeading index="02" title="它不是只会聊天：三个真实使用场景" lead="每个场景都说明输入、过程、结果和不能忽略的风险。" />
        <div className="workflow-grid">
          {guide.workflows.map((workflow, index) => <article key={workflow.title}><span className="workflow-number">0{index + 1}</span><small>真实场景</small><h2>{workflow.title}</h2><p className="workflow-situation">{workflow.situation}</p><ol>{workflow.steps.map((step) => <li key={step}>{step}</li>)}</ol><div className="workflow-result"><strong>你会得到</strong><p>{workflow.result}</p></div><div className="workflow-caution"><strong>别忽略</strong><p>{workflow.caution}</p></div></article>)}
        </div>
      </section>

      <section className="content-section screenshot-showcase" id="screenshots">
        <SectionHeading index="03" title="先看官方界面，再决定要不要安装" lead="以下是高清官方应用商店截图。每张图都标出新手真正需要看的位置，点击图片可以放大。" />
        <OfficialScreenshotGallery name={product.name} screenshots={product.screenshots} />
        <div className="screenshot-to-action"><strong>这些是官方界面参考，不是完整操作截图</strong><p>下面的路线图把“识别界面”继续连接到“真正怎么做”。按钮位置更新后，以官方界面为准。</p></div>
        <TutorialPath name={product.name} slug={product.slug} steps={product.setupSteps} />
      </section>

      <section className="content-section soft-section" id="download">
        <SectionHeading index="04" title="选择你的设备，只走官方入口" lead="网页版适合先体验；手机商店能否显示会受到网络和账号地区影响。本站不提供闭源软件的未知来源安装包。" />
        <DownloadButtons downloads={product.downloads} />
        <RegionNotice>{product.regionNote}</RegionNotice>
      </section>

      <section className="content-section" id="start">
        <SectionHeading index="05" title="第一次使用：先完成一个真实任务" lead="不要先研究所有按钮。用十分钟完成一个小任务，更容易判断它是否适合你。" />
        <div className="first-use-layout">
          <ol className="setup-steps">{product.setupSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
          <aside className="starter-task"><span>新手测试题</span><h2>{guide.starterTask.title}</h2><p>{guide.starterTask.prompt}</p><strong>完成后检查</strong><ul>{guide.starterTask.check.map((item) => <li key={item}>{item}</li>)}</ul></aside>
        </div>
        <ActionChecklist id={`ai-${product.slug}`} title={`${product.name}第一次使用清单`} items={[...product.setupSteps.slice(0, 4), "用上面的新手测试题完成一次真实任务", "核对结果中的数字、引用和重要结论"]} />
      </section>

      <section className="content-section soft-section" id="troubleshoot">
        <SectionHeading index="06" title="遇到问题时，按症状排查" lead="不要反复点按钮，也不要把验证码交给陌生客服。先找到最像的情况，再按安全顺序处理。" />
        <BeginnerTroubleshooter name={product.name} playbook={playbook} />
      </section>

      <section className="content-section">
        <SectionHeading index="07" title="核心功能，用普通话解释" lead="功能名称会变，但判断方法不变：它能读什么、能做什么、结果要不要核对。" />
        <div className="feature-explainer-grid">{guide.features.map((feature) => <article key={feature.name}><span>{feature.name}</span><p>{feature.plain}</p><div><small>比如这样用</small><strong>{feature.example}</strong></div></article>)}</div>
        <div className="capability-strip" aria-label="能力关键词">{product.capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div>
      </section>

      <section className="content-section plan-guide-section" id="plans">
        <SectionHeading index="08" title={product.slug === "chatgpt" ? "免费版、Plus还是Pro？" : "免费版、官方订阅还是第三方购买？"} lead="先免费完成真实任务；只有经常碰到用量或功能限制时，付费才可能值得。" />
        {product.slug === "chatgpt" ? <>
          <div className="plan-guide-grid"><article><span>先体验</span><h2>免费版</h2><p>适合确认网页、文件、图片和语音是否符合需求。偶尔使用时先不必付费。</p><strong>推荐：第一次使用的人</strong></article><article className="recommended"><span>大多数个人用户</span><h2>Plus</h2><p>官方公开价为US$20/月；用量和模型入口会变化，付款前查看结算页。</p><strong>推荐：稳定日常使用</strong></article><article><span>高强度专业使用</span><h2>Pro</h2><p>面向确实需要更高用量和高级能力的人，不建议仅为尝鲜购买。</p><strong>先记录一周使用量</strong></article></div>
          <p className="plan-guide-note">Plus会员与API是两套独立计费，互不通用。付款前检查本人账号、结算币种、税费、自动续费和取消入口。<a href="https://chatgpt.com/pricing/" target="_blank" rel="noopener noreferrer">查看官方套餐页 ↗</a></p>
        </> : offer && <div className="plan-guide-grid"><article><span>先体验</span><h2>免费版</h2><p>{offer.freeAdvice}</p><strong>推荐：第一次使用的人</strong></article><article className="recommended"><span>长期和重要资料</span><h2>官方订阅</h2><p>{offer.officialPrice}。账号、续费和售后关系更直接，适合保存长期资料。</p><a href={offer.officialUrl} target="_blank" rel="noopener noreferrer">查看官方方案 ↗</a></article><article><span>替代购买渠道</span><h2>第三方方案</h2><p>{offer.deliveryType}。要额外检查账号归属、隐私和到期后的控制权。</p><Link href="/subscriptions">先看第三方购买风险 →</Link></article></div>}
      </section>

      <section className="content-section soft-section" id="advanced">
        <SectionHeading index="09 / 进阶" title="模型与评测：需要时再看" lead="模型可以理解成产品内部的不同引擎。新手不必背名称；界面显示和用量随套餐更新，以本人账号为准。" />
        <details className="advanced-panel"><summary>展开查看当前主流模型说明</summary><div className="model-table" role="table" aria-label={`${product.name}模型说明`}><div className="model-row model-head" role="row"><span>模型</span><span>可用范围</span><span>上下文</span><span>适合什么</span></div>{product.models.map((model) => <div className="model-row" role="row" key={model.name}><strong>{model.name}</strong><span>{model.availability}</span><span>{model.context}</span><div><p>{model.note}</p><small>{model.inputs.join(" · ")}</small></div></div>)}</div></details>
        {product.benchmarks.length > 0 ? <div className="benchmark-cards">{product.benchmarks.map((benchmark) => <article key={benchmark.source}><span>{benchmark.source}</span><strong>{benchmark.scope}</strong><p>{benchmark.summary}</p><a href={benchmark.url} target="_blank" rel="noopener noreferrer">查看来源 ↗</a></article>)}</div> : <p className="benchmark-empty">本产品暂不显示 Arena 或 Artificial Analysis 排名：它们当前主要用于语言模型比较，本站不会把文本榜单强行套用到图片生成产品上。选择时请优先看官方功能、实际作品和授权条款。</p>}
      </section>

      <section className="content-section">
        <SectionHeading index="10" title="五组可以直接复制的提示词" lead="先复制，再把方括号里的内容换成你自己的真实情况。" />
        <div className="prompt-grid">{product.prompts.map((prompt, index) => <article key={prompt.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{prompt.title}</h3><p>{prompt.text}</p></article>)}</div>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="11" title="隐私与安全：输入之前先检查" />
        <div className="privacy-checklist"><strong>以下内容默认不要上传</strong><ul>{product.privacy.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>

      <section className="content-section sources-section"><SectionHeading index="12" title="本页官方资料来源" lead="产品介绍优先参考品牌官网、帮助中心和官方商店；第三方评测与官方资料分开显示。" /><SourceList sources={product.officialSources} /><FeedbackLink /></section>
    </PageShell>
  );
}
