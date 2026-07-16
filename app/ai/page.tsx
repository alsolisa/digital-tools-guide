import { aiProducts } from "../../data/catalog";
import { getAiEditorialGuide } from "../../data/editorial-guides";
import Link from "next/link";
import { BrandIcon, BrandNotice, PageIntro, PageShell, SectionHeading, VerificationChip } from "../components/SiteChrome";

export const metadata = {
  title: "主流AI小白教程",
  description: "比较ChatGPT、Claude、Gemini、Grok、Perplexity与Midjourney的优势、模型、平台、官方下载和使用方法。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/ai/` },
};

export default function AiIndexPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="AI工具 · 从“它能帮我做什么”开始"
        title="第一次使用AI，不需要先懂模型"
        lead="你可以先把AI理解成一个能对话、整理资料、写作、搜索和处理文件的助手。它会犯错，也不应该替你做重要决定。"
        aside={<><strong>新手原则</strong><p>先免费体验，再决定付费</p><small>用自己的真实任务测试三到七天，比只看排行榜更有意义。</small></>}
      />

      <section className="content-section ai-basics" id="choose">
        <SectionHeading index="01" title="先看AI能做什么，也要知道它不能保证什么" />
        <div className="can-cannot-grid"><article><h2>适合拿来辅助</h2><ul><li>把复杂内容解释成容易理解的话</li><li>整理文件、会议记录和学习材料</li><li>起草文字、比较方案和寻找思路</li><li>搜索资料并帮助建立研究提纲</li></ul></article><article className="warning-card"><h2>不要完全交给AI</h2><ul><li>医疗、法律和财务等重要决定</li><li>未经核对的新闻、数字和引用</li><li>密码、验证码、身份证和公司机密</li><li>代替本人承担工作或考试责任</li></ul></article></div>
        <div className="ai-first-choice"><strong>只想先选一款？</strong><p>没有明确需求时，可以先从ChatGPT免费版体验；长文档可试Claude，Google生态可试Gemini，带来源搜索可试Perplexity，X和实时内容可试Grok，持续做专业图片再看Midjourney。</p></div>
      </section>

      <section className="content-section soft-section ai-chooser-section">
        <SectionHeading index="02" title="按你的任务选择，不按广告口号选择" lead="同一款AI不可能在所有任务上都最好。下面先告诉你每款更适合什么，也说明它不适合什么。" />
        <div className="selection-disclosure"><strong>为什么首批选择这六项？</strong><p>它们覆盖通用助手、长文档与写作、Google生态、X实时内容、带来源搜索、专业图片与视频创作六条差异明显的路线，并且都有可核验的官网或官方文档。收录不等于“前六名”，也不代表每个人都需要全部安装。</p></div>
        <BrandNotice />
        <div className="ai-card-grid">
          {aiProducts.map((product) => (
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
        <SectionHeading index="03" title="只看这一张表，也能先做出选择" lead="主任务相同的人，也可能因为账号地区、资料隐私和习惯不同而选择不同。" />
        <div className="choice-matrix" role="table" aria-label="六款AI新手选择对照">
          <div className="choice-row choice-head" role="row"><span>产品</span><span>最适合先做</span><span>明显优势</span><span>先注意</span></div>
          <div className="choice-row" role="row"><strong>ChatGPT</strong><span>通用问答、办公、图片和文件</span><span>覆盖最全面，适合第一款AI</span><span>功能与用量随套餐变化</span></div>
          <div className="choice-row" role="row"><strong>Claude</strong><span>长文档、写作、代码与项目</span><span>长内容和持续协作体验清楚</span><span>地区与用量限制</span></div>
          <div className="choice-row" role="row"><strong>Gemini</strong><span>Google资料、研究和多模态</span><span>Gmail、Drive、Android生态</span><span>账号、地区和授权范围</span></div>
          <div className="choice-row" role="row"><strong>Grok</strong><span>X实时话题和多媒体创作</span><span>靠近公开社交内容</span><span>热度不等于事实</span></div>
          <div className="choice-row" role="row"><strong>Perplexity</strong><span>搜索、比较和带来源研究</span><span>引用直接可见</span><span>仍要打开原文核对</span></div>
          <div className="choice-row" role="row"><strong>Midjourney</strong><span>图片、风格、编辑与视频</span><span>视觉工作流成熟</span><span>需要订阅并检查公开范围</span></div>
        </div>
      </section>

      <section className="content-section ai-try-first">
        <SectionHeading index="04" title="付费前先做一次真实测试" lead="不要因为别人说“最强”就直接购买。" />
        <ol className="purchase-flow"><li><span>01</span><div><strong>准备三个自己的任务</strong><p>例如一份真实文档、一个需要查证的问题和一段需要修改的文字。</p></div></li><li><span>02</span><div><strong>分别用免费版完成</strong><p>观察答案质量、速度、引用、文件处理和你是否真的愿意持续使用。</p></div></li><li><span>03</span><div><strong>记录遇到的限制</strong><p>只有频繁遇到用量、模型或功能限制时，付费才可能有价值。</p></div></li><li><span>04</span><div><strong>再看官方与第三方方案</strong><p>优先本人账号和官方购买；考虑第三方时再检查账号归属与隐私风险。</p></div></li></ol>
      </section>

      <section className="content-section soft-section benchmark-explainer">
        <SectionHeading index="05 / 进阶阅读" title="评测怎么看才不会被误导" lead="第一次使用可以先跳过这一部分。排行榜是参考，不是购买答案。" />
        <div className="two-column-cards">
          <article><span>A</span><h3>Arena：真人盲测偏好</h3><p>用户在不知道模型名称的情况下比较回答。适合观察“人们更喜欢哪个回答”，但会受题目、样本量和时间影响。</p><a href="https://arena.ai/leaderboard/text" target="_blank" rel="noopener noreferrer">打开 Text 榜 ↗</a></article>
          <article><span>AA</span><h3>Artificial Analysis：量化测试</h3><p>提供智能指数、速度、延迟和API成本。它测试的是模型/API，不代表会员App在你手机上的速度或订阅价。</p><a href="https://artificialanalysis.ai/" target="_blank" rel="noopener noreferrer">打开评测站 ↗</a></article>
        </div>
      </section>
    </PageShell>
  );
}
