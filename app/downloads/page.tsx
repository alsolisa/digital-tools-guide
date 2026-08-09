import { allDownloads, type Platform } from "../../data/catalog";
import localMirrors from "../../data/local-mirrors.json";
import syncStatus from "../../data/sync-status.json";
import Link from "next/link";
import { BrandIcon, BrandNotice, PageIntro, PageShell, QuickSummary, SectionHeading, VerificationChip } from "../components/SiteChrome";
import DeviceChooser from "../components/DeviceChooser";

const platforms: Platform[] = ["Windows", "macOS", "Android", "iOS", "Web"];
const releaseChecks: Record<string, (typeof syncStatus.clients)[number]> = Object.fromEntries(syncStatus.clients.map((client) => [client.repository, client]));

const mirrorDownloads = localMirrors;
const clientLabels: Record<string, { product: string; platform: string }> = {
  "clash-verge-rev/clash-verge-rev": { product: "Clash Verge Rev", platform: "Windows x64" },
  "2dust/v2rayN": { product: "v2rayN", platform: "Windows x64 桌面版" },
  "chen08209/FlClash": { product: "FlClash", platform: "Android ARM64" },
  "hiddify/hiddify-app": { product: "Hiddify", platform: "Windows x64" },
};

function formatFileSize(size: number) {
  return size >= 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(size / 1024)} KB`;
}

export const metadata = {
  title: "官方下载中心",
  description: "按Windows、macOS、Android、iOS和网页分类的ChatGPT、Claude、Gemini、Grok、Perplexity、YouTube、X与TikTok官方入口。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/downloads/` },
};

export default function DownloadsPage() {
  const basePath = process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : "";
  return (
    <PageShell>
      <PageIntro eyebrow="下载中心 · 不需要先看懂文件名" title="先选设备，再去官方页面下载" lead="这里同时整理AI、常用应用和网络客户端。本站不保存闭源安装包，按钮只连接官网、官方项目、Microsoft Store、Google Play或Apple App Store。" artwork={{ src: "/illustrations/official-downloads-v2.webp", alt: "官方来源经过核验后分流到笔记本、台式电脑、平板和手机的原创纸艺插画", caption: "原创插画 · 先核验来源，再选择与你设备对应的版本" }} />
      <QuickSummary title="下载前只记住三条" points={["先选自己的系统，不要凭文件名猜", "核对官网域名、开发者名称和版本", "商店搜不到时先看地区教程，不下载破解版", "四项开源客户端都有官方文件直链；其中三项另有本站校验备份"]} action={{ label: "看应用商店地区教程", href: "/stores" }} />
      <div className="download-brand-note"><BrandNotice /></div>
      <section className="content-section device-section"><DeviceChooser /></section>
      <section className="content-section mirror-section" id="mirror">
        <SectionHeading index="直接下载" title="当前版开源客户端，直接给出对应的官方文件" lead="发布程序会从每个项目的官方Release自动选中指定设备文件，并核对版本、大小与SHA-256。无需先进入GitHub页面寻找文件。" />
        <div className="official-file-grid">{syncStatus.clients.map((release) => {
          const label = clientLabels[release.repository];
          const assetUrl = "assetUrl" in release && typeof release.assetUrl === "string" ? release.assetUrl : null;
          const assetName = "assetName" in release && typeof release.assetName === "string" ? release.assetName : null;
          const assetSize = "assetSize" in release && typeof release.assetSize === "number" ? release.assetSize : null;
          const assetSha256 = "assetSha256" in release && typeof release.assetSha256 === "string" ? release.assetSha256 : null;
          if (!label || !assetUrl || !assetName || !assetSize || !assetSha256) return null;
          return <article key={release.repository}><div><span>{label.platform}</span><strong>官方文件已自动核验</strong></div><h2>{label.product}</h2><p>{assetName}</p><dl><div><dt>当前版本</dt><dd>{"version" in release ? release.version : "已核验"}</dd></div><div><dt>文件大小</dt><dd>{formatFileSize(assetSize)}</dd></div><div><dt>SHA-256</dt><dd><code>{assetSha256}</code></dd></div></dl><a href={assetUrl}>直接下载官方文件 ↓</a></article>;
        })}</div>
        <div className="mirror-safety-note"><strong>本站备用文件是什么？</strong><p>下方三项文件同样取自项目官方Release，并保存在本站，适合GitHub下载不稳定时使用。v2rayN的Windows文件超过本站单文件限制，所以提供上方的官方ZIP直链；苹果商店软件、ChatGPT、YouTube等闭源产品仍必须通过官方入口安装。</p></div>
        <SectionHeading index="本站备用" title="GitHub下载不稳定时，使用本站三项已校验备份" lead="只有备份版本与本轮官方当前版本完全一致时，下载按钮才会显示。新版发布、读取失败或文件校验不一致都会自动阻止发布。" />
        <div className="mirror-grid">{mirrorDownloads.map((item) => {
          const release = releaseChecks[item.repository];
          const observedVersion = release && "version" in release && typeof release.version === "string" ? release.version : null;
          const sameVersionSnapshot = release?.state === "ok" || (release?.state === "stale" && "detectedVersion" in release && release.detectedVersion === observedVersion);
          const currentVersion = sameVersionSnapshot ? observedVersion : null;
          const fresh = Boolean(currentVersion) && currentVersion === item.version;
          const versionState = !sameVersionSnapshot ? "本轮官方版本检查失败，备用文件暂停" : fresh ? (release?.state === "stale" ? "版本一致 · 使用最近可信校验" : "版本已核对") : "新版已发布，备用文件暂停";
          return <article key={item.product} className={!fresh ? "mirror-stale" : ""}><div className="mirror-head"><span>{item.platform}</span><strong>{versionState}</strong></div><h2>{item.product}</h2><p className="mirror-file">{item.file}</p><dl><div><dt>本站文件</dt><dd>{item.version} · {formatFileSize(item.sizeBytes)}</dd></div><div><dt>官方当前版</dt><dd>{currentVersion || (observedVersion ? `${observedVersion}（上次核验）` : "本轮未读取成功")}</dd></div><div><dt>SHA-256</dt><dd><code>{item.sha256}</code></dd></div></dl>{fresh ? <a className="mirror-download" href={`${basePath}/mirror/${item.file}`} download>从本站下载已校验文件 ↓</a> : <p className="mirror-paused">为避免提供无法确认是否最新的文件，本站下载已自动隐藏。请先使用官方发布页。</p>}<div className="mirror-links"><a href={item.official} target="_blank" rel="noopener noreferrer">官方发布页 ↗</a><a href={item.project} target="_blank" rel="noopener noreferrer">源码 ↗</a><a href={item.license} target="_blank" rel="noopener noreferrer">许可证 ↗</a></div></article>;
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
