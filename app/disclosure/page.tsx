import { PageIntro, PageShell, SectionHeading } from "../components/SiteChrome";

export const metadata = { title: "推广关系说明", description: "数字工具指南的推广链接、排序、佣金、核验和购买责任说明。", alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/disclosure/` } };

export default function DisclosurePage() {
  return <PageShell><PageIntro eyebrow="推广说明 · 推荐与收益分开" title="有推广关系，也必须把风险说清楚" lead="部分机场和GamsGo按钮包含推广参数。合作关系会影响哪些服务拥有推广入口，但不能改变价格核验、风险等级和排序原则；本站展示的也不是全市场完整名单。" />
    <section className="content-section"><SectionHeading index="01" title="推广链接如何标注" /><div className="method-levels"><article><span>按钮附近</span><h2>直接说明</h2><p>购买按钮附近显示“推广链接”，不把广告伪装成普通资料来源。</p></article><article><span>排序依据</span><h2>核验优先</h2><p>机场先按实际可购买月付和核验状态排序，不按佣金高低排序。</p></article><article><span>价格口径</span><h2>分开显示</h2><p>官方订阅价、商家公开价、API成本和人民币参考价使用不同字段。</p></article><article><span>异常处理</span><h2>隐藏可疑值</h2><p>读取失败或价格剧烈变化时隐藏具体数字，不继续沿用旧宣传价。</p></article></div></section>
    <section className="content-section soft-section disclosure-page"><SectionHeading index="02" title="购买前需要理解" /><ul><li>本站不是服务商或AI产品官方，不代收款，也不能替代商家售后。</li><li>第三方账号交付、共享网页和访问密钥可能带来账号所有权与隐私风险。</li><li>最终价格、税费、支付手续费、退款和交付方式以结算页及商家条款为准。</li><li>品牌图标只用于识别产品，不代表品牌方认可、合作或推荐本站。</li></ul></section>
  </PageShell>;
}
