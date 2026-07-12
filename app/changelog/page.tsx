import { PageIntro, PageShell, SectionHeading } from "../components/SiteChrome";

export const metadata = { title: "更新记录", description: "数字工具指南的重要内容、功能、视觉、核验和发布更新记录。" };

const updates = [
  { date: "2026-07-13", title: "官方视觉与教程体系升级", items: ["AI、常用应用和网络客户端改用官方来源图标。", "加入官方应用商店界面图、中文说明与来源链接。", "增加设备选择、站内搜索、常见问题、隐私、推广说明、更新记录和反馈入口。", "修正ChatGPT、Claude与Gemini的现行产品模型说明。"] },
  { date: "2026-07-12", title: "迁移到稳定公开地址", items: ["迁移至GitHub Pages并启用HTTPS。", "建立每6小时链接检查、每日价格与汇率同步。", "增加静态页面、站内链接和资源完整性测试。"] },
  { date: "2026-07-11", title: "A版可信编辑风格", items: ["统一数字工具指南品牌、导航和三大频道。", "建立机场、AI订阅、AI教程、常用应用和下载中心。", "明确推广、地区、付款和账号风险边界。"] },
];

export default function ChangelogPage() {
  return <PageShell><PageIntro eyebrow="更新记录 · 重要变化可追溯" title="资料在变化，网站也必须留下记录" lead="这里记录会影响用户判断的重要变化；自动同步的细小数据更新保留在公开项目历史中。" /><section className="content-section"><SectionHeading index="01" title="主要版本记录" /><div className="changelog-list">{updates.map((update) => <article key={update.date}><time>{update.date}</time><div><h2>{update.title}</h2><ul>{update.items.map((item) => <li key={item}>{item}</li>)}</ul></div></article>)}</div></section></PageShell>;
}
