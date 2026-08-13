import "../content-styles";
import { aiProducts, commonApps } from "../../data/catalog";
import { getAiEditorialGuide, getAppEditorialGuide } from "../../data/editorial-guides";
import { getLiveLinkStatus, liveLinkCheckLabel } from "../../data/live-verification";
import Link from "next/link";
import { BrandIcon, PageIntro, PageShell, SectionHeading, VerificationChip } from "../components/SiteChrome";

export const metadata = {
  title: "第一次用AI：从真实任务开始",
  description: "不先追模型名次。用一件真实任务比较ChatGPT、Claude、Gemini、Grok与Perplexity，再查看官方入口、免费版边界和使用风险。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/ai/` },
};

export default function AiIndexPage() {
  const beginnerAiProducts = aiProducts.filter((product) => product.slug !== "midjourney");

  return (
    <PageShell>
      <PageIntro
        eyebrow="AI 工具 · 先拿自己的事试一次"
        title="第一次用 AI，先别急着研究模型"
        lead="找一件你本来就要做的事：解释一段难懂的文字、整理一份文件，或者查一组资料。用同一件事试两款产品，比先背参数更容易找到适合自己的。"
        artwork={{ src: "/illustrations/ai-assistant-v3.webp", alt: "对话、文档、资料检索、写作、图片和音频六类任务汇入同一工作台，输出再经过复核", caption: "同一个入口，可以处理六类常见任务；重要结果仍要自己核对" }}
      />

      <nav className="ai-channel-overview" aria-label="AI与应用四个入口">
        <Link href="/ai" aria-current="page"><span>01</span><strong>AI介绍</strong><small>先看每款AI擅长什么</small></Link>
        <Link href="/subscriptions"><span>02</span><strong>AI订阅</strong><small>比较GamsGo方案与价格</small></Link>
        <Link href="/apps"><span>03</span><strong>常用应用</strong><small>YouTube、X、TikTok教程</small></Link>
        <Link href="/downloads"><span>04</span><strong>下载中心</strong><small>按设备找官方入口</small></Link>
      </nav>

      <section className="content-section ai-basics" id="choose">
        <SectionHeading index="01" title="先看AI能做什么，也要知道它不能保证什么" />
        <div className="can-cannot-grid"><article><h2>适合拿来辅助</h2><ul><li>把复杂内容解释成容易理解的话</li><li>整理文件、会议记录和学习材料</li><li>起草文字、比较方案和寻找思路</li><li>搜索资料并帮助建立研究提纲</li></ul></article><article className="warning-card"><h2>不要完全交给AI</h2><ul><li>医疗、法律和财务等重要决定</li><li>未经核对的新闻、数字和引用</li><li>密码、验证码、身份证和公司机密</li><li>代替本人承担工作或考试责任</li></ul></article></div>
      </section>

      <section className="content-section soft-section ai-chooser-section" aria-label="AI工具列表">
        <div className="ai-card-grid">
          {beginnerAiProducts.map((product) => (
            <article className="ai-card" key={product.slug}>
              <div className="ai-card-top"><BrandIcon slug={product.slug} name={product.name} size="large" /><VerificationChip status={getLiveLinkStatus(product.downloads)} /></div>
              <span className="card-kicker">{product.company}</span><h2>{product.name}</h2><p className="card-tagline">{getAiEditorialGuide(product.slug)?.verdict || product.tagline}</p>
              <div className="tag-row">{product.bestFor.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
              <ul>{product.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="ai-card-limit"><strong>不适合：</strong>{product.notFor[0]}</p>
              <div className="ai-card-foot"><small>入口检查 {liveLinkCheckLabel}</small><Link href={`/ai/${product.slug}`}>查看完整教程 →</Link></div>
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

      <section className="content-section soft-section common-app-showcase" id="apps" aria-label="三项常用应用介绍">
        <SectionHeading index="03" title="三项常用应用：先按你想看的内容选择" lead="YouTube偏长视频与系统学习，X偏实时公开信息，TikTok偏短视频与创作。它们不是AI模型，也不是互相替代的同一类产品。" />
        <div className="ai-card-grid common-app-feature-grid">
          {commonApps.map((app) => {
            const guide = getAppEditorialGuide(app.slug);
            return (
              <article className={`ai-card common-app-feature-card common-app-${app.slug}`} key={app.slug}>
                <div className="ai-card-top"><BrandIcon slug={app.slug} name={app.name} size="large" /><VerificationChip status={getLiveLinkStatus(app.downloads)} /></div>
                <span className="card-kicker">常用应用 · {app.company}</span>
                <h2>{app.name}</h2>
                <p className="card-tagline">{guide?.verdict || app.tagline}</p>
                <div className="tag-row">{(guide?.whyUse || []).slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
                <ul>{(guide?.coreAreas || []).slice(0, 3).map((area) => <li key={area.name}><strong>{area.name}：</strong>{area.plain}</li>)}</ul>
                <p className="ai-card-limit"><strong>先注意：</strong>{guide?.notFor[0] || app.regionNote}</p>
                <div className="ai-card-foot"><small>入口检查 {liveLinkCheckLabel}</small><Link href={`/apps/${app.slug}`}>查看完整教程 →</Link></div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
