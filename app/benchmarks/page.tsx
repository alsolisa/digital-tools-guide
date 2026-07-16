import Link from "next/link";
import { PageIntro, PageShell, QuickSummary, SectionHeading } from "../components/SiteChrome";
import StructuredData from "../components/StructuredData";

const arenaSnapshot = "2026-07-13";
const artificialSnapshot = "2026-07-16";

const modelFamilies = [
  { family: "Claude", company: "Anthropic", arena: "第 1 名 · 1508±7", arenaModel: "Claude Fable 5", analysis: "指数 60", analysisModel: "Claude Fable 5（含回退）", takeaway: "当前两套榜单都处于第一梯队，适合重点关注复杂推理、长文档与高要求写作。" },
  { family: "GPT", company: "OpenAI", arena: "第 10 名 · 1484±11", arenaModel: "GPT-5.6 Sol xhigh", analysis: "指数 59", analysisModel: "GPT-5.6 Sol max", takeaway: "综合能力、工具生态和通用性突出，适合需要一款主力AI的普通用户。" },
  { family: "Gemini", company: "Google", arena: "第 8 名 · 1486±4", arenaModel: "Gemini 3.1 Pro Preview", analysis: "指数 50 · 161 token/s", analysisModel: "Gemini 3.5 Flash", takeaway: "高阶型号偏能力，Flash偏速度；Google生态和多模态使用者值得优先比较。" },
  { family: "Grok", company: "xAI", arena: "第 19 名 · 1474±5", arenaModel: "Grok 4.20 beta1", analysis: "指数 54 · 125 token/s", analysisModel: "Grok 4.5 high", takeaway: "当前能力与速度均有竞争力，适合关注实时信息和X平台生态的人。" },
  { family: "Qwen", company: "Alibaba", arena: "第 16 名 · 1475±10", arenaModel: "Qwen3.7 Max Preview", analysis: "指数 46", analysisModel: "Qwen3.7 Max", takeaway: "中文、开源生态和模型规格选择丰富；预览型号的名次仍可能明显变化。" },
  { family: "GLM", company: "Z.ai", arena: "第 25 名 · 1472±5", arenaModel: "GLM-5.1", analysis: "指数 51 · 146 token/s", analysisModel: "GLM-5.2 max", takeaway: "兼顾较强能力、速度和API成本，是值得持续追踪的开放权重路线。" },
  { family: "Kimi", company: "Moonshot", arena: "第 37 名 · 1462±5", arenaModel: "Kimi K2.6", analysis: "本轮不列精确值", analysisModel: "避免混用不同版本", takeaway: "中文和长上下文体验具有代表性，但型号更新快，使用时要核对产品内实际版本。" },
  { family: "DeepSeek", company: "DeepSeek", arena: "第 42 名 · 1457±5", arenaModel: "DeepSeek V4 Pro Thinking", analysis: "指数 44", analysisModel: "DeepSeek V4 Pro max", takeaway: "开放权重、中文与价格优势明显；不要只凭旧型号名判断当前能力。" },
];

export const metadata = {
  title: "主流AI模型评测解读",
  description: "用普通人能理解的方式分别解读Arena真人盲测与Artificial Analysis能力、速度、延迟和API成本数据。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/benchmarks/` },
};

export default function BenchmarksPage() {
  const publicSiteUrl = process.env.GITHUB_PAGES === "true" ? "https://alsolisa.github.io/digital-tools-guide" : "http://localhost:3000";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "主流AI模型评测解读快照",
    description: "Arena真人盲测与Artificial Analysis公开指标的分开展示。",
    url: `${publicSiteUrl}/benchmarks/`,
    dateModified: artificialSnapshot,
    isBasedOn: ["https://arena.ai/leaderboard/text", "https://artificialanalysis.ai/leaderboards/models"],
  };

  return (
    <PageShell>
      <StructuredData data={structuredData} />
      <PageIntro eyebrow="项目 03 · 模型评测" title="榜单不是答案，但能帮你看懂当前主流模型" lead="这里不制作一个来源不明的总分。Arena反映真人盲测偏好；Artificial Analysis反映标准化能力、速度、延迟和API成本。两套结果分开看，最后再结合自己的任务选择。" />
      <QuickSummary title="普通人先记住四件事" points={["同一家公司会有多个型号和推理档位，不要只看品牌名", "Arena名次代表用户偏好，不等于每项任务都更准确", "Artificial Analysis的价格是API成本，不是ChatGPT或Claude会员费", "Preview、Beta和样本较少的型号，名次可能快速变化"]} />

      <section className="content-section benchmark-methods">
        <SectionHeading index="01" title="两套评测分别回答什么问题" lead="它们测量的不是同一件事，所以不合并成本站自制总分。" />
        <div className="benchmark-method-grid">
          <article><span>真人选择</span><h2>Arena</h2><p>匿名展示两份回答，让用户投票选择更喜欢的一份，再根据大量对战计算排名。适合观察回答质量、风格和综合偏好。</p><ul><li>重点看：Text / Overall</li><li>优势：真实用户、开放问题</li><li>局限：偏好会受语言、风格与样本构成影响</li></ul><a href="https://arena.ai/leaderboard/text" target="_blank" rel="noopener noreferrer">打开 Arena 原榜单 ↗</a></article>
          <article><span>能力与效率</span><h2>Artificial Analysis</h2><p>把多项标准化测试组合成 Intelligence Index，并同时记录输出速度、首字延迟、总响应时间和API价格。</p><ul><li>重点看：能力、速度、延迟分别看</li><li>优势：便于比较性能与成本</li><li>局限：API环境不等于普通会员产品体验</li></ul><a href="https://artificialanalysis.ai/leaderboards/models" target="_blank" rel="noopener noreferrer">打开 Artificial Analysis 原榜单 ↗</a></article>
        </div>
      </section>

      <section className="content-section soft-section" id="snapshot">
        <SectionHeading index="02" title="第一版收录八个主流模型家族" lead={`Arena 快照 ${arenaSnapshot}；Artificial Analysis 读取 ${artificialSnapshot}。每个家族只选一个有代表性的当前型号，避免同一家公司的多个档位挤满页面。`} />
        <div className="benchmark-family-table" role="table" aria-label="主流AI模型家族评测快照">
          <div className="benchmark-family-row benchmark-family-head" role="row"><span role="columnheader">模型家族</span><span role="columnheader">Arena代表结果</span><span role="columnheader">Artificial Analysis代表结果</span><span role="columnheader">普通人怎么理解</span></div>
          {modelFamilies.map((item) => <div className="benchmark-family-row" role="row" key={item.family}><div role="cell"><strong>{item.family}</strong><small>{item.company}</small></div><div role="cell"><strong>{item.arena}</strong><small>{item.arenaModel}</small></div><div role="cell"><strong>{item.analysis}</strong><small>{item.analysisModel}</small></div><p role="cell">{item.takeaway}</p></div>)}
        </div>
        <p className="benchmark-caveat">名次只对应上面写明的具体型号与快照日期，不代表整个品牌永久排名。带 Preview、Beta 或样本量较少的结果，应当视为阶段性信号。</p>
      </section>

      <section className="content-section benchmark-decisions">
        <SectionHeading index="03" title="不想研究参数，可以这样选" lead="先按任务缩小范围，再去对应产品页试用免费版。" />
        <div className="benchmark-decision-grid">
          <article><span>综合主力</span><h2>GPT、Claude、Gemini</h2><p>三者都有成熟产品和多平台入口。写作与复杂任务先比较Claude和GPT；Google生态与多模态需求重点看Gemini。</p></article>
          <article><span>实时与社交内容</span><h2>Grok</h2><p>适合希望结合X平台和实时内容的人，但实时不代表自动准确，仍需核对原始来源。</p></article>
          <article><span>中文与开放生态</span><h2>DeepSeek、Qwen、GLM、Kimi</h2><p>适合中文任务、开放模型与成本敏感场景。具体体验取决于使用的平台、部署版本和是否启用推理模式。</p></article>
        </div>
        <div className="benchmark-product-note"><strong>为什么没有把 Perplexity 和 Midjourney 放进文本模型榜？</strong><p>Perplexity是以搜索与引用为核心的产品，底层可能调用不同模型；Midjourney主要生成图像。它们都值得介绍，但与文本大模型放在同一张综合排行榜会误导普通人。</p><nav><Link href="/ai/perplexity">查看 Perplexity 教程 →</Link><Link href="/ai/midjourney">查看 Midjourney 教程 →</Link></nav></div>
      </section>
    </PageShell>
  );
}
