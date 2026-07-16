import { PageIntro, PageShell, SectionHeading } from "../components/SiteChrome";

export const metadata = { title: "更新记录", description: "数字工具指南的重要内容、功能、视觉、核验和发布更新记录。" };

const updates = [
  { date: "2026-07-16", title: "新手决策、状态透明与第六项AI教程", items: ["首页加入三问选择助手，根据用途、设备与优先级给出一条有证据的起步路线。", "主要页面加入30秒结论，AI与应用详情把官方界面参考和实际操作路线分开说明。", "新增Midjourney完整教程，并使用其官方文档中的Create与编辑界面图。", "机场页加入隐私处理后的TAG商店与悠兔客户端页面证据；更新WestData限制、TAG自有客户端与地区限制。", "新增Apple App Store与Google Play地区教程、公开状态页、关于页和不自动上传的反馈助手。", "Grok商家页面出现多项冲突价格后自动隐藏数字；ChatGPT与Perplexity公开月付价增加专用校验规则。", "下载中心增加Windows SHA-256逐步校验说明，并在官方版本读取失败时自动隐藏本站下载。"] },
  { date: "2026-07-13", title: "专业教程、官方截图与备用下载升级", items: ["五项AI与三项常用应用重写为零基础完整教程，增加适合人群、真实场景、第一次使用、付费判断、隐私与常见误区。", "每个AI和应用页面加入三张官方高清商店截图，并逐屏标注新手应该看的位置。", "机场价格榜严格分为三家已核验月付与两家候选服务，Nexitally改为直接打开官方入口。", "下载中心增加两项许可证允许再分发的开源客户端备用文件，并公开版本、大小、源码、许可证与SHA-256校验值。", "发布命令、静态资源、站内链接、电脑和手机显示均通过自动测试与浏览器实际检查。"] },
  { date: "2026-07-12", title: "迁移到稳定公开地址", items: ["迁移至GitHub Pages并启用HTTPS。", "建立每6小时链接检查、每日价格与汇率同步。", "增加静态页面、站内链接和资源完整性测试。"] },
  { date: "2026-07-11", title: "A版可信编辑风格", items: ["统一数字工具指南品牌、导航和三大频道。", "建立机场、AI订阅、AI教程、常用应用和下载中心。", "明确推广、地区、付款和账号风险边界。"] },
];

export default function ChangelogPage() {
  return <PageShell><PageIntro eyebrow="更新记录 · 重要变化可追溯" title="资料在变化，网站也必须留下记录" lead="这里记录会影响用户判断的重要变化；自动同步的细小数据更新保留在公开项目历史中。" /><section className="content-section"><SectionHeading index="01" title="主要版本记录" /><div className="changelog-list">{updates.map((update) => <article key={update.date}><time>{update.date}</time><div><h2>{update.title}</h2><ul>{update.items.map((item) => <li key={item}>{item}</li>)}</ul></div></article>)}</div></section></PageShell>;
}
