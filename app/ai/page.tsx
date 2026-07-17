import { aiProducts } from "../../data/catalog";
import { getAiEditorialGuide } from "../../data/editorial-guides";
import Link from "next/link";
import { BrandIcon, PageIntro, PageShell, SectionHeading, VerificationChip } from "../components/SiteChrome";

export const metadata = {
  title: "主流AI小白教程",
  description: "比较ChatGPT、Claude、Gemini、Grok与Perplexity的优势、模型、平台、官方下载和使用方法。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/ai/` },
};

export default function AiIndexPage() {
  const beginnerAiProducts = aiProducts.filter((product) => product.slug !== "midjourney");

  return (
    <PageShell>
      <PageIntro
        eyebrow="AI工具 · 从“它能帮我做什么”开始"
        title="第一次使用AI，不需要先懂模型"
        lead="你可以先把AI理解成一个能对话、整理资料、写作、搜索和处理文件的助手。它会犯错，也不应该替你做重要决定。"
      />

      <section className="content-section ai-basics" id="choose">
        <SectionHeading index="01" title="先看AI能做什么，也要知道它不能保证什么" />
        <div className="can-cannot-grid"><article><h2>适合拿来辅助</h2><ul><li>把复杂内容解释成容易理解的话</li><li>整理文件、会议记录和学习材料</li><li>起草文字、比较方案和寻找思路</li><li>搜索资料并帮助建立研究提纲</li></ul></article><article className="warning-card"><h2>不要完全交给AI</h2><ul><li>医疗、法律和财务等重要决定</li><li>未经核对的新闻、数字和引用</li><li>密码、验证码、身份证和公司机密</li><li>代替本人承担工作或考试责任</li></ul></article></div>
      </section>

      <section className="content-section soft-section ai-chooser-section" aria-label="AI工具列表">
        <div className="ai-card-grid">
          {beginnerAiProducts.map((product) => (
            <article className="ai-card" key={product.slug}>
              <div className="ai-card-top"><BrandIcon slug={product.slug} name={product.name} size="large" /><VerificationChip status="verified" /></div>
              <span className="card-kicker">{product.company}</span><h2>{product.name}</h2><p className="card-tagline">{getAiEditorialGuide(product.slug)?.verdict || product.tagline}</p>
              <div className="tag-row">{product.bestFor.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
              <ul>{product.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="ai-card-limit"><strong>不适合：</strong>{product.notFor[0]}</p>
              <div className="ai-card-foot"><small>核验 {product.verifiedAt}</small><Link href={`/ai/${product.slug}`}>查看完整教程 →</Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section ai-comparison-section">
        <SectionHeading index="02" title="只看这一张表，也能先做出选择" lead="主任务相同的人，也可能因为账号地区、资料隐私和习惯不同而选择不同。" />
        <div className="choice-matrix" role="table" aria-label="五款AI新手选择对照">
          <div className="choice-row choice-head" role="row"><span>产品</span><span>最适合先做</span><span>明显优势</span><span>先注意</span></div>
          <div className="choice-row" role="row"><strong>ChatGPT</strong><span>通用问答、办公、图片和文件</span><span>覆盖最全面，适合第一款AI</span><span>功能与用量随套餐变化</span></div>
          <div className="choice-row" role="row"><strong>Claude</strong><span>长文档、写作、代码与项目</span><span>长内容和持续协作体验清楚</span><span>地区与用量限制</span></div>
          <div className="choice-row" role="row"><strong>Gemini</strong><span>Google资料、研究和多模态</span><span>Gmail、Drive、Android生态</span><span>账号、地区和授权范围</span></div>
          <div className="choice-row" role="row"><strong>Grok</strong><span>X实时话题和多媒体创作</span><span>靠近公开社交内容</span><span>热度不等于事实</span></div>
          <div className="choice-row" role="row"><strong>Perplexity</strong><span>搜索、比较和带来源研究</span><span>引用直接可见</span><span>仍要打开原文核对</span></div>
        </div>
      </section>
    </PageShell>
  );
}
