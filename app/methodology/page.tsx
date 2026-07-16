import syncStatus from "../../data/sync-status.json";
import { PageIntro, PageShell, SectionHeading } from "../components/SiteChrome";

export const metadata = {
  title: "核验方法与推广说明",
  description: "数字工具指南的数据来源、自动同步、第三方评测、风险分级、推广关系与隐私边界。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/methodology/` },
};

export default function MethodologyPage() {
  const checkedAt = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "long", timeStyle: "short", hour12: false }).format(new Date(syncStatus.checkedAt));
  return (
    <PageShell>
      <PageIntro eyebrow="公开方法 · 让结论可以被检查" title="先看证据，再看推荐" lead="推广链接可能带来收益，但不能改变事实。重要字段都保留来源、核验时间、风险状态和自动更新规则。" aside={<><strong>最近公开入口同步</strong><p>{checkedAt}</p><small>{syncStatus.links.length}个入口 · {syncStatus.clients.length}个开源项目</small></>} />
      <section className="content-section"><SectionHeading index="01" title="资料来源优先级" /><div className="method-levels"><article><span>一级</span><h2>官方当前页面</h2><p>官网、官方帮助中心、官方价格页、官方应用商店和官方GitHub。</p></article><article><span>二级</span><h2>已登录购买页</h2><p>用于核验必须登录后才能看到的套餐、付款和交付信息，记录核验日期。</p></article><article><span>三级</span><h2>第三方评测</h2><p>Arena与Artificial Analysis只作为模型评测来源，不替代官方功能和套餐事实。</p></article><article><span>四级</span><h2>商家宣传</h2><p>GamsGo等商家页面单独标注；与官方冲突时以官方为准。</p></article></div></section>
      <section className="content-section soft-section"><SectionHeading index="02" title="为什么收录，又为什么可能移除" /><div className="method-levels"><article><span>入口</span><h2>有可核验来源</h2><p>至少能够找到当前官网、官方文档、购买页或官方项目来源。</p></article><article><span>信息</span><h2>关键字段不靠猜</h2><p>价格、周期、交付、付款和客户端证据不足时明确写待复核。</p></article><article><span>范围</span><h2>不是全市场排名</h2><p>收录是当前可持续核验的样本，不代表绝对最好或适合所有人。</p></article><article><span>移除</span><h2>失效与风险优先</h2><p>入口被劫持、长期失联、资料冲突或无法继续核验时会暂停展示。</p></article></div></section>
      <section className="content-section"><SectionHeading index="03" title="自动检查实际上做什么" /><div className="sync-flow"><article><strong>每6小时</strong><p>检查公开官网、推广入口、商店、下载页和跳转结果。</p></article><article><strong>同步数据</strong><p>读取部分GamsGo公开价格、汇率和开源客户端最新版本。</p></article><article><strong>不会冒充自动</strong><p>登录后价格、AI模型资料和评测具体分数仍需人工核对，目前不称为实时同步。</p></article><article><strong>防错误</strong><p>价格大幅变化需连续两次一致；页面读不到时隐藏数字，不沿用可疑旧值。</p></article></div></section>
      <section className="content-section soft-section"><SectionHeading index="04" title="两个评测源，不做自制总分" /><div className="two-column-cards"><article><span>A</span><h3>Arena</h3><p>Text/Overall用于真人盲测偏好；Agent榜只用于工具调用和任务完成能力。当前本站只提供来源与阅读方法，不声称自动同步完整排名。</p><a href="https://arena.ai/" target="_blank" rel="noopener noreferrer">打开Arena ↗</a></article><article><span>AA</span><h3>Artificial Analysis</h3><p>用于查看智能指数、速度、延迟和API成本。API成本不是会员订阅价，当前具体数值仍需打开来源核对。</p><a href="https://artificialanalysis.ai/" target="_blank" rel="noopener noreferrer">打开Artificial Analysis ↗</a></article></div></section>
      <section className="content-section"><SectionHeading index="05" title="风险和状态标签" /><div className="label-guide"><div><span className="verify-chip verified"><i />已核对资料</span><p>当前官方页面或已登录页面有明确证据，不代表获得品牌官方认可。</p></div><div><span className="verify-chip automatic"><i />自动检查</span><p>公开入口、价格或软件版本由定时任务读取。</p></div><div><span className="verify-chip pending"><i />待复核</span><p>证据不足、必须登录或页面存在冲突。</p></div><div><span className="risk-badge risk-medium">中风险</span><p>可能涉及访问密钥、本人账号授权或续费问题。</p></div><div><span className="risk-badge risk-high">高风险</span><p>账号交付、共享环境或恢复权不完全掌握在购买者手中。</p></div></div></section>
      <section className="content-section soft-section"><SectionHeading index="06" title="品牌图标从哪里来" lead="图标只用于帮助识别产品，不代表官方合作或推荐。" /><div className="two-column-cards"><article><span>APP</span><h3>官方应用条目</h3><p>ChatGPT、Claude、Gemini、Grok、Perplexity、YouTube、X、TikTok及苹果网络客户端图标，均核对应用名、开发者和应用标识后取自官方商店条目。</p><a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">了解 App Store ↗</a></article><article><span>DEV</span><h3>品牌与项目仓库</h3><p>Midjourney采用官方商标政策中的图形；开源客户端采用其官方GitHub仓库资源。所有图标保持原比例和颜色，不用作本站品牌。</p><a href="https://openai.com/brand/" target="_blank" rel="noopener noreferrer">查看品牌规范示例 ↗</a></article></div></section>
      <section className="content-section disclosure-page"><SectionHeading index="07" title="推广、隐私与边界" /><ul><li>GamsGo及部分机场按钮包含推广关系，按钮附近明确写明。</li><li>推广关系可能影响哪些服务有合作入口，但不会改变价格排序、风险标签或核验结论。</li><li>本站不销售服务，不代收付款，不保存账号、密码、验证码、订阅链接或访问密钥。</li><li>人民币金额只是汇率参考，不含税费和支付手续费。</li><li>网络与应用可用性应遵守用户所在地法律、平台条款和组织规定。</li></ul></section>
    </PageShell>
  );
}
