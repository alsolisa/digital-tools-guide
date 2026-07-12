import { allDownloads, type Platform } from "../../data/catalog";
import { PageIntro, PageShell, SectionHeading, VerificationChip } from "../components/SiteChrome";

const platforms: Platform[] = ["Windows", "macOS", "Android", "iOS", "Web"];

export const metadata = {
  title: "官方下载中心",
  description: "按Windows、macOS、Android、iOS和网页分类的ChatGPT、Claude、Gemini、Grok、Perplexity、YouTube、X与TikTok官方入口。",
};

export default function DownloadsPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="下载中心 · 官方来源白名单" title="选设备，再去官方页面下载" lead="本站不保存闭源安装包。按钮只连接产品官网、Microsoft Store、Google Play或Apple App Store，避免旧版本和捆绑软件。" />
      <nav className="platform-nav" aria-label="按系统查看下载">{platforms.map((platform) => <a href={`#${platform.toLowerCase()}`} key={platform}>{platform}</a>)}</nav>
      {platforms.map((platform, index) => {
        const downloads = allDownloads.filter((download) => download.platform === platform);
        return (
          <section className={`content-section download-platform ${index % 2 ? "soft-section" : ""}`} id={platform.toLowerCase()} key={platform}>
            <SectionHeading index={String(index + 1).padStart(2, "0")} title={platform === "Web" ? "网页版入口" : `${platform} 官方下载`} lead={`${downloads.length} 个已经整理的官方入口`} />
            <div className="download-directory">
              {downloads.map((download) => <article key={`${download.product}-${download.url}`}><div><span className="directory-category">{download.category}</span><h2>{download.product}</h2><p>{download.label}</p></div><VerificationChip status={download.status} /><a href={download.url} target="_blank" rel="noopener noreferrer">打开官方来源 ↗</a><a className="guide-link" href={download.category === "AI" ? `/ai/${download.slug}` : `/apps/${download.slug}`}>查看教程</a></article>)}
            </div>
          </section>
        );
      })}
      <section className="content-section security-alert-wide"><span>!</span><div><h2>看到这些情况先不要安装</h2><p>页面要求关闭杀毒软件、安装描述文件、输入Apple ID密码、使用共享账号或从网盘下载“特别版”时，请立即停止。回到本页重新打开官方入口。</p></div></section>
    </PageShell>
  );
}
