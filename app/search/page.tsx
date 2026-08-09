import "../content-styles";
import { searchEntries } from "../../data/search-index";
import SiteSearch from "../components/SiteSearch";
import { PageIntro, PageShell } from "../components/SiteChrome";

export const metadata = { title: "站内搜索", description: "搜索数字工具指南中的机场、AI订阅、AI教程、常用应用和官方下载内容。", alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/search/` } };

export default function SearchPage() {
  return <PageShell><PageIntro eyebrow="站内搜索 · 不记录搜索内容" title="从一个关键词找到正确入口" lead="搜索在你的浏览器中完成，不上传搜索词。可以搜索产品、设备、套餐、客户端或常见问题。" /><section className="content-section"><SiteSearch entries={searchEntries} /></section></PageShell>;
}
