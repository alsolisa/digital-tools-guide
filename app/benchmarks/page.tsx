import "../content-styles";
import autoSync from "../../data/auto-sync.json";
import { PageIntro, PageShell, QuickSummary, SectionHeading } from "../components/SiteChrome";
import StructuredData from "../components/StructuredData";

type LeaderboardRow = {
  rank: number;
  model: string;
  company: string;
  contextWindow: string;
  intelligence: number;
  priceUsdPerMillion: number | null;
  outputTokensPerSecond: number;
  latencySeconds: number;
  totalResponseSeconds: number;
};

type LeaderboardSnapshot = {
  source: string;
  url: string;
  state: "ok" | "stale" | "error";
  checkedAt: string;
  lastSuccessfulAt?: string;
  methodologyVersion?: string;
  rows: LeaderboardRow[];
};

const artificialAnalysis = (autoSync as { artificialAnalysisLeaderboard?: LeaderboardSnapshot }).artificialAnalysisLeaderboard;
const leaderboardRows = artificialAnalysis?.rows?.slice(0, 10) || [];
const representativeRows = (artificialAnalysis?.rows || []).reduce<LeaderboardRow[]>((selected, row) => {
  if (!selected.some((item) => item.company === row.company)) selected.push(row);
  return selected;
}, []).slice(0, 7);

function formatTime(value?: string) {
  if (!value) return "暂无成功快照";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function plainLanguageSignals(row: LeaderboardRow) {
  const signals = [];
  if (row.intelligence >= 56) signals.push("能力第一梯队");
  if (row.outputTokensPerSecond >= 100) signals.push("输出很快");
  if (row.latencySeconds <= 5) signals.push("开始回答快");
  if (row.priceUsdPerMillion !== null && row.priceUsdPerMillion <= 2.5) signals.push("API成本较低");
  return signals.length ? signals.slice(0, 3) : ["表现较均衡"];
}

function representativeLabel(row: LeaderboardRow) {
  if (row.intelligence >= 56) return "综合能力领先";
  if (row.intelligence >= 52) return "主流高水平";
  return "效率型主流";
}

export const metadata = {
  title: "AI模型榜单怎么读",
  description: "分清Arena真人偏好与Artificial Analysis的能力、速度、延迟和API成本；保留原榜顺序，并自动更新最近可信快照。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/benchmarks/` },
};

export default function BenchmarksPage() {
  const publicSiteUrl = process.env.GITHUB_PAGES === "true" ? "https://alsolisa.github.io/digital-tools-guide" : "http://localhost:3000";
  const snapshotTime = artificialAnalysis?.lastSuccessfulAt || artificialAnalysis?.checkedAt;
  const snapshotState = artificialAnalysis?.state === "ok"
    ? "自动同步正常"
    : artificialAnalysis?.state === "stale"
      ? "本轮读取失败，显示上次成功快照"
      : "暂时无法核验榜单";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "主流AI模型评测解读与Artificial Analysis榜单快照",
    description: "Arena真人偏好评测与Artificial Analysis公开能力、速度、延迟和API成本指标的分开展示。",
    url: `${publicSiteUrl}/benchmarks/`,
    dateModified: snapshotTime || autoSync.checkedAt,
    isBasedOn: ["https://arena.ai/leaderboard/text", "https://artificialanalysis.ai/leaderboards/models", "https://artificialanalysis.ai/methodology/intelligence-benchmarking"],
  };

  return (
    <PageShell>
      <StructuredData data={structuredData} />
      <PageIntro
        eyebrow="项目 03 · 模型评测"
        title="两个榜单，其实在回答不同的问题"
        lead="想知道真人更喜欢哪份回答，看 Arena；想比较能力、输出速度、等待和API成本，看 Artificial Analysis。两边测的不是一回事，名次也不能直接相加。"
        artwork={{ src: "/illustrations/model-benchmarks-v4.webp", alt: "左侧两份同样匿名的回答等待盲选，右侧四件独立量具分别测量能力、速度、首字等待和成本", caption: "真人偏好与统一测试，回答的是两个问题" }}
      />
      <QuickSummary title="第一次看榜单，先记住四件事" points={["Arena回答“人更喜欢哪份回答”，不是严格的事实准确率考试", "Artificial Analysis把能力、速度、延迟和API成本分开测，不能只看一个数字", "榜单里的API价格是开发者调用模型的成本，不是ChatGPT、Claude等会员月费", "同一品牌会出现多个型号和推理档位；名次对应具体型号，不代表整个品牌永久排名"]} />

      <section className="content-section benchmark-methods">
        <SectionHeading index="01" title="先分清：两个网站分别测什么" lead="最简单的记法是：Arena更接近“真人试吃投票”，Artificial Analysis更接近“实验室分项检测”。两者不合并成本站自制总分。" />
        <div className="benchmark-method-grid">
          <article className="benchmark-method-card arena-method">
            <span>真人盲测 · 回答偏好</span>
            <h2>Arena</h2>
            <p className="benchmark-question">它回答：面对同一道题，真实用户更喜欢哪一个回答？</p>
            <p>系统匿名展示两个模型的回答，投票者在不知道模型名称的情况下选出更喜欢的一份，再用大量两两对比计算排名。Text / Overall 综合了数学、编程、创意写作和开放问答等真实提示词。</p>
            <dl className="benchmark-facts">
              <div><dt>榜单内容</dt><dd>总榜，以及写作、编程、数学、指令遵循、多轮对话、困难提示词等分类榜</dd></div>
              <div><dt>重点看法</dt><dd>同时看名次、分数后的“±”不确定范围，以及是否标记 Preliminary</dd></div>
              <div><dt>不能证明</dt><dd>不能单独证明事实一定正确，也不是专门针对中文或你的个人任务</dd></div>
            </dl>
            <a href="https://arena.ai/leaderboard/text" target="_blank" rel="noopener noreferrer">打开 Arena Text 原榜单 ↗</a>
          </article>
          <article className="benchmark-method-card analysis-method">
            <span>统一测试 · 能力与效率</span>
            <h2>Artificial Analysis</h2>
            <p className="benchmark-question">它回答：在统一测试和API环境下，模型能力、速度、延迟与成本分别怎样？</p>
            <p>它用 Intelligence Index 汇总标准化能力测试，同时把输出速度、首段响应延迟、完整响应时间、上下文长度和API价格独立列出。这样能看见“更强”是否伴随“更慢”或“更贵”。</p>
            <dl className="benchmark-facts">
              <div><dt>能力测试</dt><dd>当前 v4.1 由九项测试组成，涵盖智能体、编程、科学推理和通用能力</dd></div>
              <div><dt>效率测试</dt><dd>输出速度、开始回答前的等待、完整响应时间和每百万token的API成本</dd></div>
              <div><dt>不能证明</dt><dd>英文纯文本测试不等于中文、多模态或会员App的实际体验</dd></div>
            </dl>
            <a href="https://artificialanalysis.ai/leaderboards/models" target="_blank" rel="noopener noreferrer">打开 Artificial Analysis 原榜单 ↗</a>
          </article>
        </div>
        <div className="benchmark-difference" aria-label="两套评测如何选择">
          <strong>普通人怎么用：</strong>
          <span>想看回答读起来是否更好、更符合人类偏好 → 先看 Arena</span>
          <span>想比较能力、速度、等待和API成本 → 先看 Artificial Analysis</span>
          <span>准备长期付费 → 最后仍要用自己的真实任务试一次</span>
        </div>
      </section>

      <section className="content-section soft-section benchmark-metrics">
        <SectionHeading index="02" title="Artificial Analysis 榜单里的六个指标，普通人这样看" lead="不要只追第一名。能力更高、启动更快、输出更快和成本更低，往往不是同一个模型。" />
        <div className="benchmark-metric-grid">
          <article><span>01 · 越高越好</span><h2>能力指数</h2><p>综合推理、知识、数学和编程等标准测试。适合判断文本模型的总体能力层级，但不代表所有任务都更好。</p></article>
          <article><span>02 · 不是会员费</span><h2>API成本</h2><p>开发者调用模型时，每百万输入与输出token的混合参考价。普通用户购买App会员时，不按这个数字付款。</p></article>
          <article><span>03 · 越高越快</span><h2>输出速度</h2><p>模型开始回答后，每秒生成多少token。数值高说明文字吐得快，但不代表开始回答也快。</p></article>
          <article><span>04 · 越低越快</span><h2>首段延迟</h2><p>提交问题到看到第一段内容前的等待时间。它决定“多久开始有反应”，与完整任务耗时不同。</p></article>
          <article><span>05 · 越低越快</span><h2>完整响应</h2><p>从提交问题到完成整段测试回答的总时间。推理更深入的档位可能能力高，但整体等待更久。</p></article>
          <article><span>06 · 容量不是质量</span><h2>上下文长度</h2><p>一次最多可处理的文字、代码或文件容量。窗口更大适合长资料，但不保证对全部内容理解得更准确。</p></article>
        </div>
        <p className="benchmark-methodology-note"><strong>能力指数当前权重：</strong>智能体 34%、编程 24%、科学推理 24%、通用能力 18%。这是 Artificial Analysis 的英文纯文本评测方法，不是本站自制评分。<a href="https://artificialanalysis.ai/methodology/intelligence-benchmarking" target="_blank" rel="noopener noreferrer">查看官方方法说明 ↗</a></p>
      </section>

      <section className="content-section benchmark-live" id="snapshot">
        <SectionHeading index="03" title="先看每家公司的一个代表模型" lead="同一家公司常有多个模型和推理档位。这里按原榜单顺序，每家公司只保留当前能力指数最高的一项，让普通人先认清主流阵营；下面仍完整保留原榜单前十。" />
        <div className={`benchmark-live-status ${artificialAnalysis?.state || "error"}`}>
          <div><span>{snapshotState}</span><strong>最近成功读取：{formatTime(snapshotTime)}</strong></div>
          <p>每 6 小时自动检查；读取失败时保留上次成功快照，不沿用无法验证的新数字。</p>
          <a href="https://artificialanalysis.ai/leaderboards/models" target="_blank" rel="noopener noreferrer">核对原榜单 ↗</a>
        </div>

        {representativeRows.length ? (
          <div className="benchmark-representative-grid" aria-label="每家公司当前代表模型">
            {representativeRows.map((row) => (
              <article key={`${row.company}-${row.model}`}>
                <div><span>原榜第 {row.rank} 名</span><strong>{representativeLabel(row)}</strong></div>
                <small>{row.company}</small>
                <h2>{row.model}</h2>
                <div className="benchmark-scoreline">
                  <span>综合能力指数</span>
                  <meter min="0" max="70" value={row.intelligence} aria-label={`${row.model}综合能力指数 ${row.intelligence}`} />
                  <strong>{row.intelligence}</strong>
                </div>
                <dl>
                  <div><dt>上下文</dt><dd>{row.contextWindow}</dd></div>
                  <div><dt>输出速度</dt><dd>{row.outputTokensPerSecond} token/秒</dd></div>
                  <div><dt>首段延迟</dt><dd>{row.latencySeconds.toFixed(2)} 秒</dd></div>
                  <div><dt>API成本</dt><dd>{row.priceUsdPerMillion === null ? "未提供" : `$${row.priceUsdPerMillion.toFixed(2)}/百万token`}</dd></div>
                </dl>
                <div className="benchmark-signal-list">{plainLanguageSignals(row).map((signal) => <span key={signal}>{signal}</span>)}</div>
              </article>
            ))}
          </div>
        ) : <p className="benchmark-empty">当前没有可用快照，因此暂不生成代表模型视图。</p>}

        <div className="benchmark-raw-heading"><div><span>保留原始名次</span><h2>Artificial Analysis 当前综合能力前十</h2></div><p>同一家公司可能重复出现，因为型号和推理档位不同。这里不合并、不重排，也不把API价格解释成会员月费。</p></div>
        <p className="benchmark-swipe-hint">手机查看：在表格内左右滑动，可以看到成本、速度、延迟和普通人读法。</p>

        {leaderboardRows.length ? (
          <div className="benchmark-ranking-wrap">
            <table className="benchmark-ranking-table" aria-label="Artificial Analysis 综合能力前十模型">
              <thead><tr><th>名次</th><th>具体模型</th><th>能力指数</th><th>上下文</th><th>API成本<br /><small>美元/百万token</small></th><th>输出速度<br /><small>token/秒</small></th><th>首段延迟<br /><small>秒</small></th><th>普通人读法</th></tr></thead>
              <tbody>
                {leaderboardRows.map((row) => (
                  <tr key={`${row.rank}-${row.model}`}>
                    <td><strong className="benchmark-rank">{String(row.rank).padStart(2, "0")}</strong></td>
                    <td><strong className="benchmark-model">{row.model}</strong><small>{row.company}</small></td>
                    <td><strong>{row.intelligence}</strong></td>
                    <td>{row.contextWindow}</td>
                    <td>{row.priceUsdPerMillion === null ? "未提供" : `$${row.priceUsdPerMillion.toFixed(2)}`}</td>
                    <td>{row.outputTokensPerSecond}</td>
                    <td>{row.latencySeconds.toFixed(2)}</td>
                    <td><div className="benchmark-signal-list">{plainLanguageSignals(row).map((signal) => <span key={signal}>{signal}</span>)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="benchmark-empty">榜单当前无法核验，因此暂不展示具体数字。请通过上方原榜单入口查看最新结果。</p>}
        <p className="benchmark-caveat">“能力第一梯队、输出很快、开始回答快、API成本较低”只是帮助新手阅读当前数据的阈值标签，不是本站重新计算的总分。实际会员产品还会受到套餐、地区、联网、工具权限和平台负载影响。</p>
      </section>
    </PageShell>
  );
}
