import "../content-styles";
import { PageIntro, PageShell, QuickSummary, SectionHeading } from "../components/SiteChrome";

export const metadata = {
  title: "关于数字工具指南",
  description: "了解本站是谁整理、为什么收录这些产品、如何处理推广关系、证据不足与更新错误。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/about/` },
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="关于本站 · 独立整理项目" title="先帮新手理解，再谈选择和购买" lead="数字工具指南是一个个人独立整理的公开资料项目，面向第一次接触网络服务、AI、海外应用和数字订阅的人。本站不是任何收录品牌的官方网站。" />
      <QuickSummary title="你可以怎样看待本站" points={["把它当作新手地图，不当作绝对排名", "重要信息都应能回到官方或购买页", "推广链接会公开说明，不改变核验口径", "证据不足时宁可写待核验，也不猜数字"]} />
      <section className="content-section"><SectionHeading index="01" title="这个项目解决什么问题" /><div className="about-principle-grid"><article><span>理解</span><h2>把术语翻成普通话</h2><p>解释VPN、机场、节点、模型、订阅、账号地区和应用商店之间的区别。</p></article><article><span>选择</span><h2>先问需求，再给路线</h2><p>推荐理由必须对应任务、价格证据、账号风险或官方功能，不做空泛“最好”。</p></article><article><span>操作</span><h2>把入口和步骤放在一起</h2><p>官方下载、安装、注册、首次使用、隐私检查和常见错误尽量在一页完成。</p></article><article><span>更新</span><h2>让变化有记录</h2><p>公开入口、版本、价格和评测来源定期检查，冲突时隐藏数字并说明原因。</p></article></div></section>
      <section className="content-section soft-section"><SectionHeading index="02" title="为什么只收录这些产品" lead="收录不是领奖，也不是全市场排名。" /><div className="selection-disclosure"><strong>当前收录门槛</strong><p>产品必须有可核验的官方入口或购买资料，并且代表一种明确的新手需求。网络服务还需要能够说明套餐、客户端、付款或地址状态；AI与应用需要有官方帮助中心或应用商店资料。无法持续核验的项目会暂停或保留为待复核。</p></div></section>
      <section className="content-section"><SectionHeading index="03" title="本站的边界" /><div className="can-cannot-grid"><article><h2>会做</h2><ul><li>整理公开资料与用户已授权查看的购买页信息</li><li>区分官方、商家宣传、第三方评测和本站判断</li><li>链接官方软件，并为少量开源软件提供可校验备份</li><li>公开推广关系、状态与更新时间</li></ul></article><article className="warning-card"><h2>不会做</h2><ul><li>保存用户密码、验证码、Cookie或订阅链接</li><li>把当前代理环境访问结果冒充大陆裸网实测</li><li>重新打包ChatGPT、YouTube等闭源安装包</li><li>保证任何服务永久可用、绝对安全或一定退款</li></ul></article></div></section>
    </PageShell>
  );
}
