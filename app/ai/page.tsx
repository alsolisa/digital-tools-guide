import { aiProducts } from "../../data/catalog";
import Link from "next/link";
import { BrandIcon, BrandNotice, PageIntro, PageShell, SectionHeading, VerificationChip } from "../components/SiteChrome";

export const metadata = {
  title: "主流AI小白教程",
  description: "比较ChatGPT、Claude、Gemini、Grok与Perplexity的优势、模型、平台、官方下载和使用方法。",
};

export default function AiIndexPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="主流 AI · 普通用户可用模型"
        title="没有“永远第一”，只有更适合你的任务"
        lead="同一个AI在写作、搜索、编程、图片和长文档上的表现不同。这里不制造总分，而是把产品能力、模型范围、官方入口和第三方评测分开。"
        aside={<><strong>第三方评测</strong><p>Arena + Artificial Analysis</p><small>真人偏好与API量化数据分别展示，不混成自制排名。</small></>}
      />

      <section className="content-section">
        <SectionHeading index="01" title="五项主流 AI" lead="点击进入完整安装、注册、提示词和隐私教程。" />
        <BrandNotice />
        <div className="ai-card-grid">
          {aiProducts.map((product) => (
            <article className="ai-card" key={product.slug}>
              <div className="ai-card-top"><BrandIcon slug={product.slug} name={product.name} size="large" /><VerificationChip status="verified" /></div>
              <span className="card-kicker">{product.company}</span><h2>{product.name}</h2><p className="card-tagline">{product.tagline}</p>
              <div className="tag-row">{product.bestFor.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
              <ul>{product.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="ai-card-foot"><small>核验 {product.verifiedAt}</small><Link href={`/ai/${product.slug}`}>查看完整教程 →</Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section soft-section benchmark-explainer">
        <SectionHeading index="02" title="评测怎么看才不会被误导" />
        <div className="two-column-cards">
          <article><span>A</span><h3>Arena：真人盲测偏好</h3><p>用户在不知道模型名称的情况下比较回答。适合观察“人们更喜欢哪个回答”，但会受题目、样本量和时间影响。</p><a href="https://arena.ai/leaderboard/text" target="_blank" rel="noopener noreferrer">打开 Text 榜 ↗</a></article>
          <article><span>AA</span><h3>Artificial Analysis：量化测试</h3><p>提供智能指数、速度、延迟和API成本。它测试的是模型/API，不代表会员App在你手机上的速度或订阅价。</p><a href="https://artificialanalysis.ai/" target="_blank" rel="noopener noreferrer">打开评测站 ↗</a></article>
        </div>
      </section>
    </PageShell>
  );
}
