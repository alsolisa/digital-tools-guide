import { notFound } from "next/navigation";
import Link from "next/link";
import { aiProducts, getAiProduct, subscriptionOffers } from "../../../data/catalog";
import { BrandIcon, Breadcrumbs, DownloadButtons, EditorialCover, FeedbackLink, OfficialScreenshotGallery, PageShell, RegionNotice, SectionHeading, SourceList, TutorialPath, VerificationChip } from "../../components/SiteChrome";

export function generateStaticParams() {
  return aiProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getAiProduct(slug);
  const basePath = process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : "";
  return product ? { title: `${product.name}小白教程`, description: product.summary, openGraph: { images: [`${basePath}/editorial/${product.slug}.png`] } } : { title: "AI教程" };
}

export default async function AiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getAiProduct(slug);
  if (!product) notFound();
  const offer = subscriptionOffers.find((item) => item.productSlug === product.slug);
  const howToJsonLd = { "@context": "https://schema.org", "@type": "HowTo", name: `${product.name}第一次使用教程`, description: product.summary, step: product.setupSteps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: `第${index + 1}步`, text: step })) };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd).replace(/</g, "\\u003c") }} />
      <Breadcrumbs items={[{ label: "首页", href: "/" }, { label: "AI怎么选", href: "/ai" }, { label: product.name }]} />
      <section className="detail-hero detail-hero-with-cover">
        <div className="detail-hero-copy"><div className="detail-title-row"><BrandIcon slug={product.slug} name={product.name} size="hero" /><div><span className="eyebrow">{product.company} · 小白完整教程</span><h1>{product.name}</h1></div></div>
        <p>{product.summary}</p>
        <div className="detail-meta"><VerificationChip status="verified" /><span>官方资料优先</span><span>核验 {product.verifiedAt}</span><span>模型参数量：官方未公开</span></div></div>
        <EditorialCover slug={product.slug} name={product.name} />
      </section>

      <section className="content-section detail-overview">
        <SectionHeading index="01" title="先判断它适不适合你" />
        <div className="pros-cons-grid">
          <article><h2>适合</h2><ul>{product.bestFor.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><h2>优势</h2><ul>{product.strengths.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="warning-card"><h2>不适合 / 局限</h2><ul>{[...product.notFor, ...product.limitations].map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
        <div className="capability-strip">{product.capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div>
      </section>

      {product.slug === "chatgpt" && <section className="content-section soft-section plan-guide-section">
        <SectionHeading index="选择" title="免费版、Plus 还是 Pro？" lead="先按实际使用量选择，不建议新手一开始就购买最高套餐。Plus 与 API 是两套独立计费，互不通用。" />
        <div className="plan-guide-grid">
          <article><span>先体验</span><h2>免费版</h2><p>适合确认网页、文件、图片和语音是否符合你的需求。偶尔使用时先不必付费。</p><strong>推荐：第一次使用的人</strong></article>
          <article className="recommended"><span>大多数个人用户</span><h2>Plus</h2><p>官方公开价为 US$20/月；用量和具体模型入口会变化，付款前仍应查看官方结算页。</p><strong>推荐：稳定日常使用</strong></article>
          <article><span>高强度专业使用</span><h2>Pro</h2><p>适合确实需要更高用量和高级模型的人。先记录一周使用量，再判断是否值得升级。</p><strong>不建议仅为尝鲜购买</strong></article>
        </div>
        <p className="plan-guide-note">付款前检查：登录的是本人账号、结算币种和税费、是否自动续费、取消入口在哪里。<a href="https://chatgpt.com/pricing/" target="_blank" rel="noopener noreferrer">查看官方套餐页 ↗</a></p>
      </section>}

      {product.slug !== "chatgpt" && offer && <section className="content-section soft-section plan-guide-section">
        <SectionHeading index="选择" title="免费版、官方订阅还是第三方购买？" lead="先用免费版完成真实任务；需要更多用量或功能时，再比较官方与第三方。" />
        <div className="plan-guide-grid">
          <article><span>先体验</span><h2>免费版</h2><p>{offer.freeAdvice}</p><strong>推荐：第一次使用的人</strong></article>
          <article className="recommended"><span>长期和重要资料</span><h2>官方订阅</h2><p>{offer.officialPrice}。账号、续费和售后关系更直接，适合保存长期资料。</p><a href={offer.officialUrl} target="_blank" rel="noopener noreferrer">查看官方方案 ↗</a></article>
          <article><span>替代购买渠道</span><h2>第三方方案</h2><p>{offer.deliveryType}。价格可能不同，但要额外检查账号归属、隐私和到期后的控制权。</p><Link href="/subscriptions">先看第三方购买风险 →</Link></article>
        </div>
      </section>}

      <section className="content-section soft-section">
        <SectionHeading index="02" title="普通用户能看到的主流模型" lead="“模型”可以理解成AI产品内部使用的不同引擎。这里只整理网页或App中的常用型号，不要求新手记住名称。" />
        <div className="model-table" role="table" aria-label={`${product.name}模型说明`}>
          <div className="model-row model-head" role="row"><span>模型</span><span>可用范围</span><span>上下文</span><span>说明</span></div>
          {product.models.map((model) => <div className="model-row" role="row" key={model.name}><strong>{model.name}</strong><span>{model.availability}</span><span>{model.context}</span><div><p>{model.note}</p><small>{model.inputs.join(" · ")}</small></div></div>)}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading index="03" title="官方下载与网页版" lead="不保存闭源安装包；按钮直达官网、Google Play或Apple App Store。" />
        <DownloadButtons downloads={product.downloads} />
        <RegionNotice>{product.regionNote}</RegionNotice>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="04" title="第一次使用，按这五步" />
        <ol className="setup-steps">{product.setupSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
        <TutorialPath name={product.name} slug={product.slug} steps={product.setupSteps} />
      </section>

      <section className="content-section">
        <SectionHeading index="05" title="官方应用界面示意" lead="图片来自官方应用商店条目，并配有中文解释；不是第三方软件截图。" />
        <OfficialScreenshotGallery name={product.name} screenshots={product.screenshots} />
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="06" title="五组可以直接复制的提示词" />
        <div className="prompt-grid">{product.prompts.map((prompt, index) => <article key={prompt.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{prompt.title}</h3><p>{prompt.text}</p></article>)}</div>
      </section>

      <section className="content-section">
        <SectionHeading index="07" title="隐私与第三方评测" />
        <div className="privacy-benchmark-grid"><article><h2>隐私检查</h2><ul>{product.privacy.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h2>第三方评测</h2>{product.benchmarks.map((benchmark) => <div className="benchmark-item" key={benchmark.source}><strong>{benchmark.source}</strong><span>{benchmark.scope}</span><p>{benchmark.summary}</p><a href={benchmark.url} target="_blank" rel="noopener noreferrer">查看来源 ↗</a></div>)}</article></div>
      </section>

      <section className="content-section soft-section sources-section"><SectionHeading index="08" title="官方资料来源" /><SourceList sources={product.officialSources} /><FeedbackLink /></section>
    </PageShell>
  );
}
