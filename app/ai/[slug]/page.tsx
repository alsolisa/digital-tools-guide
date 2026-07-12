import { notFound } from "next/navigation";
import { aiProducts, getAiProduct } from "../../../data/catalog";
import { DownloadButtons, PageShell, RegionNotice, SectionHeading, SourceList, TutorialPath, VerificationChip } from "../../components/SiteChrome";

export function generateStaticParams() {
  return aiProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getAiProduct(slug);
  return product ? { title: `${product.name}小白教程`, description: product.summary } : { title: "AI教程" };
}

export default async function AiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getAiProduct(slug);
  if (!product) notFound();

  return (
    <PageShell>
      <section className="detail-hero">
        <div className="detail-title-row"><span className={`catalog-mark hero-mark ${product.tone}`}>{product.mark}</span><div><span className="eyebrow">{product.company} · 小白完整教程</span><h1>{product.name}</h1></div></div>
        <p>{product.summary}</p>
        <div className="detail-meta"><VerificationChip status="verified" /><span>官方资料优先</span><span>核验 {product.verifiedAt}</span><span>模型参数量：官方未公开</span></div>
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

      <section className="content-section soft-section">
        <SectionHeading index="02" title="普通用户能看到的主流模型" lead="只整理网页或App中的常用型号；API专用型号不混入主要推荐。" />
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
        <TutorialPath name={product.name} steps={product.setupSteps} />
      </section>

      <section className="content-section">
        <SectionHeading index="05" title="五组可以直接复制的提示词" />
        <div className="prompt-grid">{product.prompts.map((prompt, index) => <article key={prompt.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{prompt.title}</h3><p>{prompt.text}</p></article>)}</div>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="06" title="隐私与第三方评测" />
        <div className="privacy-benchmark-grid"><article><h2>隐私检查</h2><ul>{product.privacy.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h2>第三方评测</h2>{product.benchmarks.map((benchmark) => <div className="benchmark-item" key={benchmark.source}><strong>{benchmark.source}</strong><span>{benchmark.scope}</span><p>{benchmark.summary}</p><a href={benchmark.url} target="_blank" rel="noopener noreferrer">查看来源 ↗</a></div>)}</article></div>
      </section>

      <section className="content-section sources-section"><SectionHeading index="07" title="官方资料来源" /><SourceList sources={product.officialSources} /></section>
    </PageShell>
  );
}
