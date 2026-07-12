import syncStatus from "../../data/sync-status.json";
import { PageIntro, PageShell, SectionHeading } from "../components/SiteChrome";

export const metadata = {
  title: "核验方法与推广说明",
  description: "数字工具指南的数据来源、自动同步、第三方评测、风险分级、推广关系与隐私边界。",
};

export default function MethodologyPage() {
  const checkedAt = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "long", timeStyle: "short", hour12: false }).format(new Date(syncStatus.checkedAt));
  return (
    <PageShell>
      <PageIntro eyebrow="公开方法 · 让结论可以被检查" title="先看证据，再看推荐" lead="推广链接可能带来收益，但不能改变事实。重要字段都保留来源、核验时间、风险状态和自动更新规则。" aside={<><strong>最近公开入口同步</strong><p>{checkedAt}</p><small>{syncStatus.links.length}个入口 · {syncStatus.clients.length}个开源项目</small></>} />
      <section className="content-section"><SectionHeading index="01" title="资料来源优先级" /><div className="method-levels"><article><span>一级</span><h2>官方当前页面</h2><p>官网、官方帮助中心、官方价格页、官方应用商店和官方GitHub。</p></article><article><span>二级</span><h2>已登录购买页</h2><p>用于核验必须登录后才能看到的套餐、付款和交付信息，记录核验日期。</p></article><article><span>三级</span><h2>第三方评测</h2><p>Arena与Artificial Analysis只作为模型评测来源，不替代官方功能和套餐事实。</p></article><article><span>四级</span><h2>商家宣传</h2><p>GamsGo等商家页面单独标注；与官方冲突时以官方为准。</p></article></div></section>
      <section className="content-section soft-section"><SectionHeading index="02" title="自动同步如何工作" /><div className="sync-flow"><article><strong>每6小时</strong><p>检查官网、推广入口、商店与下载地址是否能访问、是否发生跳转。</p></article><article><strong>每日</strong><p>读取公开价格、汇率、官方模型页面和第三方评测快照。</p></article><article><strong>防错误</strong><p>币种、周期、产品名和来源域名必须通过校验；字段缺失时隐藏数字，不沿用可疑值。</p></article><article><strong>大幅变价</strong><p>连续两次读取一致后自动发布，并显示明显变化提示。</p></article></div></section>
      <section className="content-section"><SectionHeading index="03" title="两个评测源，不做自制总分" /><div className="two-column-cards"><article><span>A</span><h3>Arena</h3><p>Text/Overall用于真人盲测偏好；Agent榜只用于工具调用和任务完成能力。排名随样本和时间变化。</p><a href="https://arena.ai/" target="_blank" rel="noopener noreferrer">打开Arena ↗</a></article><article><span>AA</span><h3>Artificial Analysis</h3><p>引用智能指数、输出速度、延迟和API成本。API成本不是会员订阅价，API速度也不是手机App速度。</p><a href="https://artificialanalysis.ai/" target="_blank" rel="noopener noreferrer">打开Artificial Analysis ↗</a></article></div></section>
      <section className="content-section soft-section"><SectionHeading index="04" title="风险和状态标签" /><div className="label-guide"><div><span className="verify-chip verified"><i />官方已核验</span><p>当前官方页面或已登录页面有明确证据。</p></div><div><span className="verify-chip automatic"><i />自动核验</span><p>公开入口或结构化数据由定时任务读取。</p></div><div><span className="verify-chip pending"><i />待复核</span><p>证据不足、必须登录或页面存在冲突。</p></div><div><span className="risk-badge risk-medium">中风险</span><p>可能涉及访问密钥、本人账号授权或续费问题。</p></div><div><span className="risk-badge risk-high">高风险</span><p>账号交付、共享环境或恢复权不完全掌握在购买者手中。</p></div></div></section>
      <section className="content-section"><SectionHeading index="05" title="品牌图标从哪里来" lead="图标只用于帮助识别产品，不代表官方合作或推荐。" /><div className="two-column-cards"><article><span>APP</span><h3>官方应用条目</h3><p>ChatGPT、Claude、Gemini、Grok、Perplexity、YouTube、X、TikTok及苹果网络客户端图标，均核对应用名、开发者和应用标识后取自官方商店条目。</p><a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">了解 App Store ↗</a></article><article><span>DEV</span><h3>品牌与项目仓库</h3><p>Midjourney采用官方商标政策中的图形；开源客户端采用其官方GitHub仓库资源。所有图标保持原比例和颜色，不用作本站品牌。</p><a href="https://openai.com/brand/" target="_blank" rel="noopener noreferrer">查看品牌规范示例 ↗</a></article></div></section>
      <section className="content-section disclosure-page"><SectionHeading index="06" title="推广、隐私与边界" /><ul><li>GamsGo及部分机场按钮包含推广关系，按钮附近明确写明。</li><li>推广收益不会改变排序、风险标签或核验结论。</li><li>本站不销售服务，不代收付款，不保存账号、密码、验证码、订阅链接或访问密钥。</li><li>人民币金额只是汇率参考，不含税费和支付手续费。</li><li>网络与应用可用性应遵守用户所在地法律、平台条款和组织规定。</li></ul></section>
    </PageShell>
  );
}
