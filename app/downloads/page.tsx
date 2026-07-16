import { allDownloads, type Platform } from "../../data/catalog";
import syncStatus from "../../data/sync-status.json";
import Link from "next/link";
import { BrandIcon, BrandNotice, PageIntro, PageShell, QuickSummary, SectionHeading, VerificationChip } from "../components/SiteChrome";
import DeviceChooser from "../components/DeviceChooser";

const platforms: Platform[] = ["Windows", "macOS", "Android", "iOS", "Web"];
const releaseChecks: Record<string, (typeof syncStatus.clients)[number]> = Object.fromEntries(syncStatus.clients.map((client) => [client.repository, client]));

const mirrorDownloads = [
  {
    product: "Clash Verge Rev", platform: "Windows普通电脑", version: "v2.5.1", repository: "clash-verge-rev/clash-verge-rev",
    file: "Clash.Verge_2.5.1_x64-setup.exe", size: "44.9 MB", sha256: "203BF29F7A5F0DC5FBC5E42772DE6A474501603A19120C2F1259BB27C067DF51",
    project: "https://github.com/clash-verge-rev/clash-verge-rev", official: "https://github.com/clash-verge-rev/clash-verge-rev/releases/tag/v2.5.1", license: "https://github.com/clash-verge-rev/clash-verge-rev/blob/dev/LICENSE",
  },
  {
    product: "FlClash", platform: "多数近年Android手机", version: "v0.8.94", repository: "chen08209/FlClash",
    file: "FlClash-0.8.94-android-arm64-v8a.apk", size: "51.6 MB", sha256: "2B0F058A79BD584FDE8BBB46452F3539E92563CBF5070C2626C3BE3C900E807B",
    project: "https://github.com/chen08209/FlClash", official: "https://github.com/chen08209/FlClash/releases/tag/v0.8.94", license: "https://github.com/chen08209/FlClash/blob/main/LICENSE",
  },
];

export const metadata = {
  title: "官方下载中心",
  description: "按Windows、macOS、Android、iOS和网页分类的ChatGPT、Claude、Gemini、Grok、Perplexity、YouTube、X与TikTok官方入口。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/downloads/` },
};

export default function DownloadsPage() {
  const basePath = process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : "";
  return (
    <PageShell>
      <PageIntro eyebrow="下载中心 · 不需要先看懂文件名" title="先选设备，再去官方页面下载" lead="这里同时整理AI、常用应用和网络客户端。本站不保存闭源安装包，按钮只连接官网、官方项目、Microsoft Store、Google Play或Apple App Store。" />
      <QuickSummary title="下载前只记住三条" points={["先选自己的系统，不要凭文件名猜", "核对官网域名、开发者名称和版本", "商店搜不到时先看地区教程，不下载破解版", "本站备份只覆盖两项开源文件并公开校验值"]} action={{ label: "看应用商店地区教程", href: "/stores" }} />
      <div className="download-brand-note"><BrandNotice /></div>
      <section className="content-section device-section"><DeviceChooser /></section>
      <section className="content-section mirror-section" id="mirror">
        <SectionHeading index="备用下载" title="官方页面打不开时，本站提供两项开源客户端备用文件" lead="文件直接取自项目官方Release，未修改；同时保留版本、大小、源码、许可证和SHA-256校验值。闭源应用不做私自镜像。" />
        <div className="mirror-safety-note"><strong>为什么只有两项？</strong><p>首批只收录许可证允许再分发、文件低于托管限制、并且新手容易选对架构的版本。苹果商店软件、ChatGPT、YouTube等闭源产品仍必须通过官方入口安装。</p></div>
        <div className="mirror-grid">{mirrorDownloads.map((item) => {
          const release = releaseChecks[item.repository];
          const observedVersion = release && "version" in release && typeof release.version === "string" ? release.version : null;
          const currentVersion = release?.state === "ok" ? observedVersion : null;
          const fresh = Boolean(currentVersion) && currentVersion === item.version;
          const versionState = release?.state !== "ok" ? "本轮官方版本检查失败，备用文件暂停" : fresh ? "版本已核对" : "新版已发布，备用文件暂停";
          return <article key={item.product} className={!fresh ? "mirror-stale" : ""}><div className="mirror-head"><span>{item.platform}</span><strong>{versionState}</strong></div><h2>{item.product}</h2><p className="mirror-file">{item.file}</p><dl><div><dt>本站文件</dt><dd>{item.version} · {item.size}</dd></div><div><dt>官方当前版</dt><dd>{currentVersion || (observedVersion ? `${observedVersion}（上次核验）` : "本轮未读取成功")}</dd></div><div><dt>SHA-256</dt><dd><code>{item.sha256}</code></dd></div></dl>{fresh ? <a className="mirror-download" href={`${basePath}/mirror/${item.file}`} download>从本站下载已校验文件 ↓</a> : <p className="mirror-paused">为避免提供无法确认是否最新的文件，本站下载已自动隐藏。请先使用官方发布页。</p>}<div className="mirror-links"><a href={item.official} target="_blank" rel="noopener noreferrer">官方发布页 ↗</a><a href={item.project} target="_blank" rel="noopener noreferrer">源码 ↗</a><a href={item.license} target="_blank" rel="noopener noreferrer">GPL许可证 ↗</a></div></article>;
        })}</div>
        <div className="checksum-help"><strong>SHA-256是什么？</strong><div><p>它像文件的“指纹”。下载后计算出的字符串与页面完全一致，说明文件在传输中没有发生变化；它不能代替杀毒扫描，也不代表软件绝对没有风险。</p><details className="checksum-steps"><summary>Windows小白：展开查看校验步骤</summary><ol><li>打开下载文件所在的文件夹。</li><li>在文件夹地址栏输入 <code>powershell</code> 并按回车。</li><li>输入 <code>Get-FileHash &quot;.\文件名.exe&quot; -Algorithm SHA256</code>，把“文件名”换成实际名称。</li><li>把出现的Hash与本页SHA-256逐字比较；不一致就删除文件，不要安装。</li></ol></details><p className="android-check-note"><strong>Android：</strong>如果不会在手机上校验，优先从官方项目页直接下载，并在安装前让系统安全检查；不要为了安装而关闭所有安全保护。</p></div></div>
      </section>
      <section className="content-section download-explainer"><div className="selection-disclosure"><strong>网络客户端不是网络套餐</strong><p>Clash Verge、v2rayN、Shadowrocket等软件负责建立连接，但通常还需要你从服务商获得自己的订阅链接。只安装软件不会自动获得节点。</p></div></section>
      <nav className="platform-nav" aria-label="按系统查看下载">{platforms.map((platform) => <a href={`#${platform.toLowerCase()}`} key={platform}>{platform}</a>)}</nav>
      {platforms.map((platform, index) => {
        const downloads = allDownloads.filter((download) => download.platform === platform);
        return (
          <section className={`content-section download-platform ${index % 2 ? "soft-section" : ""}`} id={platform.toLowerCase()} key={platform}>
            <SectionHeading index={String(index + 1).padStart(2, "0")} title={platform === "Web" ? "网页版入口" : `${platform} 官方下载`} lead={`${downloads.length} 个已经整理的官方入口`} />
            <div className="download-directory">
              {downloads.map((download) => <article key={`${download.platform}-${download.product}-${download.url}`}><BrandIcon slug={download.slug} name={download.product} size="small" /><div><span className="directory-category">{download.category}</span><h2>{download.product}</h2><p>{download.label}</p></div><VerificationChip status={download.status} /><a href={download.url} target="_blank" rel="noopener noreferrer">打开官方来源 ↗</a><Link className="guide-link" href={download.category === "AI" ? `/ai/${download.slug}` : download.category === "常用应用" ? `/apps/${download.slug}` : "/nodes#downloads"}>{download.category === "网络客户端" ? "先看使用说明" : "查看教程"}</Link></article>)}
            </div>
          </section>
        );
      })}
      <section className="content-section security-alert-wide"><span>!</span><div><h2>看到这些情况先不要安装</h2><p>页面要求关闭杀毒软件、安装描述文件、输入Apple ID密码、使用共享账号或从网盘下载“特别版”时，请立即停止。回到本页重新打开官方入口。</p></div></section>
    </PageShell>
  );
}
