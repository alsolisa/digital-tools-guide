import autoSync from "../../data/auto-sync.json";
import syncStatus from "../../data/sync-status.json";
import { FeedbackLink, PageIntro, PageShell, QuickSummary, SectionHeading } from "../components/SiteChrome";

export const metadata = {
  title: "入口、价格与同步状态",
  description: "查看公开入口、客户端版本、GamsGo公开价格与评测来源最近一次检查结果和价格变化记录。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/status/` },
};

const stateLabels: Record<string, string> = {
  ok: "读取正常",
  protected: "网站有访问保护",
  error: "检查失败",
  stale: "上次核验版本（本轮失败）",
  unreadable: "暂时无法稳定读取",
  "price-change-pending": "价格大幅变化，等待复核",
  "price-changed": "价格明显变化",
  conflict: "同页价格冲突，已隐藏",
};

function timeLabel(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "medium", timeStyle: "short", hour12: false }).format(new Date(value));
}

export default function StatusPage() {
  const counts = syncStatus.links.reduce<Record<string, number>>((total, item) => ({ ...total, [item.state]: (total[item.state] || 0) + 1 }), {});
  const latestHistory = [...autoSync.history].reverse().slice(0, 12);
  return (
    <PageShell>
      <PageIntro eyebrow="公开状态 · 最近一次自动检查" title="把“能打开”“能读取”和“大陆裸网可用”分开" lead={`最近检查：${timeLabel(syncStatus.checkedAt)}。自动检查从当前服务器网络执行，不等于中国大陆家庭宽带或手机流量实测。`} />
      <QuickSummary title="现在应该怎样理解这些状态" points={[`${counts.ok || 0}个公开入口返回正常`, `${counts.protected || 0}个入口有登录、防护或频率限制`, `${counts.error || 0}个入口本轮检查失败`, "受保护或失败不等于服务永久失效；付款前仍要亲自打开确认"]} action={{ label: "提交大陆裸网实测", href: "/feedback" }} />

      <section className="content-section">
        <SectionHeading index="01" title="六项GamsGo公开价格读取状态" lead="只有产品名、币种、正数价格、月付周期和来源域名都通过校验，数字才会显示；同页冲突会直接隐藏。" />
        <div className="public-status-grid">{autoSync.gamsgo.map((item) => <article key={item.slug} className={`public-state-${item.state}`}><div><span>{item.slug}</span><strong>{stateLabels[item.state] || item.state}</strong></div><p>{item.note}</p><small>检查 {timeLabel(item.checkedAt)}</small><a href={item.url} target="_blank" rel="sponsored noopener">打开商家资料页 ↗</a></article>)}</div>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="02" title="客户端官方版本" lead="这里检查的是官方项目的Latest Release，不代表本站备份文件已经自动替换。" />
        <div className="client-version-table">{syncStatus.clients.map((item) => { const version = "version" in item && typeof item.version === "string" ? item.version : null; const releaseUrl = "releaseUrl" in item && typeof item.releaseUrl === "string" ? item.releaseUrl : `https://github.com/${item.repository}/releases/latest`; return <div key={item.repository}><strong>{item.repository}</strong><span>{version ? `${version} · ${stateLabels[item.state] || item.state}` : "本轮读取失败"}</span><a href={releaseUrl} target="_blank" rel="noopener noreferrer">官方发布页 ↗</a></div>; })}</div>
      </section>

      <section className="content-section">
        <SectionHeading index="03" title="公开价格变化历史" lead="历史只记录自动程序实际发布过的变化；页面读取失败不会沿用可疑数字。" />
        <div className="status-history">{latestHistory.length ? latestHistory.map((item, index) => <article key={`${item.changedAt}-${item.slug}-${index}`}><time>{timeLabel(item.changedAt)}</time><strong>{item.slug}</strong><p>{item.before ? `${item.before.currency} ${item.before.value}` : "首次记录"}<span>→</span>{item.after.currency} {item.after.value}</p><a href={item.sourceUrl} target="_blank" rel="sponsored noopener">来源 ↗</a></article>) : <p>还没有已发布的价格变化。</p>}</div>
      </section>

      <section className="content-section soft-section"><SectionHeading index="04" title="怎样把状态变得更可靠" /><div className="manual-test-note"><strong>欢迎提交实测</strong><p>只记录能否打开、跳转结果、时间与网络类型；不要提交账号、密码、Cookie、订阅链接或付款信息。</p><FeedbackLink label="使用安全反馈助手" /></div></section>
    </PageShell>
  );
}
