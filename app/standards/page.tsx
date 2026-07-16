import syncStatus from "../../data/sync-status.json";
import autoSync from "../../data/auto-sync.json";
import { aiProducts, allDownloads, commonApps, subscriptionOffers } from "../../data/catalog";
import Link from "next/link";
import { FeedbackLink, PageIntro, PageShell, QuickSummary, SectionHeading } from "../components/SiteChrome";

export const metadata = {
  title: "证据与编辑标准",
  description: "公开数字工具指南的证据等级、资料新鲜度、自动失效规则、编辑边界、纠错时限和上线门槛。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/standards/` },
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "long", timeStyle: "short", hour12: false }).format(new Date(value));
}

export default function StandardsPage() {
  const linkCounts = syncStatus.links.reduce<Record<string, number>>((counts, item) => {
    counts[item.state] = (counts[item.state] || 0) + 1;
    return counts;
  }, {});
  const readablePrices = autoSync.gamsgo.filter((item) => item.state === "ok").length;
  const guardedPrices = autoSync.gamsgo.length - readablePrices;
  const sourceCount = aiProducts.reduce((sum, item) => sum + item.officialSources.length, 0) + commonApps.reduce((sum, item) => sum + item.officialSources.length, 0);

  return (
    <PageShell>
      <PageIntro eyebrow="证据与编辑标准 · 公开质量门槛" title="不要求你相信一句“已核验”，而是让你看见核验边界" lead="这一页说明每类资料由谁核对、多久重新检查、什么情况下必须撤下，以及本站还没有能力证明什么。标准公开，才能长期复核。" aside={<><strong>最近一次自动检查</strong><p>{formatTime(syncStatus.checkedAt)}</p><small>北京时间 · 公开入口、下载版本、价格与汇率分开检查</small></>} />

      <QuickSummary title="可信不等于永远正确，而是错误能被发现、隔离和修正" points={["官方资料与商家宣传分开记录", "登录后价格不能假装实时自动同步", "读取冲突时先隐藏数字，不沿用可疑旧价", "推广佣金不能改变排序和风险等级"]} action={{ label: "查看当前公开状态", href: "/status" }} />

      <section className="content-section">
        <SectionHeading index="01" title="现在覆盖到什么程度" lead="这里只显示系统能直接计算的事实，不把页面数量包装成质量分数。" />
        <div className="evidence-metrics">
          <article><span>公开入口</span><strong>{syncStatus.links.length}</strong><p>{linkCounts.ok || 0} 个可直接读取 · {linkCounts.protected || 0} 个受防护但不等于失效</p></article>
          <article><span>AI与应用</span><strong>{aiProducts.length + commonApps.length}</strong><p>{sourceCount} 条官方资料来源，第三方评测单独展示</p></article>
          <article><span>官方下载条目</span><strong>{allDownloads.length}</strong><p>按系统、商店、来源状态和核验时间记录</p></article>
          <article><span>第三方订阅</span><strong>{subscriptionOffers.length}</strong><p>{readablePrices} 项当前可稳定读取 · {guardedPrices} 项已触发保护</p></article>
        </div>
        <p className="metric-note">“受防护”通常表示网站拒绝自动程序访问，不代表普通浏览器一定打不开；“可读取”也不代表中国大陆所有运营商都能访问。</p>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="02" title="四级证据：从结论到原始页面" lead="页面上的每一类结论，都应该能落到以下一种证据，不混用。" />
        <div className="evidence-level-grid">
          <article><span>LEVEL 1</span><h2>官方原始资料</h2><p>官网、帮助中心、官方应用商店、官方 GitHub、服务条款和结算页。用于说明功能、支持平台、版本、官方价格与限制。</p><strong>最高优先级，但仍标注日期</strong></article>
          <article><span>LEVEL 2</span><h2>登录后人工核验</h2><p>公开页看不到的套餐、周期、流量、客户端和付款方式，由已登录页面人工核对，并保存去除个人信息的证据。</p><strong>不能伪装成实时数据</strong></article>
          <article><span>LEVEL 3</span><h2>自动状态检查</h2><p>每 6 小时检查入口状态、跳转、开源客户端版本和公开价格。403 等防护状态与真正失效分开处理。</p><strong>用于发现异常，不代替购买测试</strong></article>
          <article><span>LEVEL 4</span><h2>独立第三方评测</h2><p>Arena 只表示真人盲测偏好；Artificial Analysis 分别表示智能、速度、延迟与 API 成本。本站不合成自制总分。</p><strong>不能冒充官方功能或会员价格</strong></article>
        </div>
      </section>

      <section className="content-section freshness-section">
        <SectionHeading index="03" title="资料多久算过期" lead="不同信息变化速度不同，不能统一贴一个“最近更新”。" />
        <div className="freshness-table" role="table" aria-label="资料新鲜度标准">
          <div className="freshness-row freshness-head" role="row"><span>资料类型</span><span>检查频率</span><span>过期处理</span><span>页面怎么显示</span></div>
          <div className="freshness-row" role="row"><strong>公开入口与开源版本</strong><span>每 6 小时</span><span>连续异常后转为待复核</span><p>保留最后正常时间，不把 403 直接写成失效</p></div>
          <div className="freshness-row" role="row"><strong>公开价格与汇率</strong><span>每 6 小时</span><span>大幅变化需连续两次一致</span><p>冲突或缺字段时隐藏具体数字</p></div>
          <div className="freshness-row" role="row"><strong>登录后套餐与付款</strong><span>人工复核，目标 14 天内</span><span>超过窗口即撤下“当前已核验”</span><p>显示核验日期，并提醒以结算页为准</p></div>
          <div className="freshness-row" role="row"><strong>AI模型、功能与套餐</strong><span>重大更新后 + 至少每 30 天</span><span>与官方冲突时立即修正</span><p>官方未公开的参数明确写“未公开”</p></div>
          <div className="freshness-row" role="row"><strong>教程截图</strong><span>至少每 90 天抽查</span><span>界面变化但路线仍有效时加说明</span><p>官方宣传图与本站操作示意明确区分</p></div>
        </div>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="04" title="什么情况下必须停止自动发布" lead="宁可暂时少一个数字，也不让一个看似精确的错误继续误导购买。" />
        <div className="stop-rule-grid">
          <article><strong>价格突然变化</strong><p>币种、周期或金额大幅变化时，必须连续两次读取一致；等待期间显示“价格明显变动”。</p></article>
          <article><strong>同页出现多个金额</strong><p>无法确认哪一个对应月付与目标商品时，隐藏价格并进入人工复核，不选一个最像的数字。</p></article>
          <article><strong>来源域名改变</strong><p>跳转到未列入白名单的域名、陌生下载站或网盘时，不继续展示下载按钮。</p></article>
          <article><strong>登录信息过期</strong><p>套餐、付款或客户端证据超过人工复核窗口后，不能继续标成“当前已核验”。</p></article>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading index="05" title="编辑独立与推广边界" lead="商业关系必须出现在用户做决定之前，而不是藏在页脚。" />
        <div className="editorial-standard-grid">
          <article><span>收录</span><h2>有推广链接，不等于优先收录</h2><p>必须先有明确用途、公开入口、可解释的套餐或风险资料。缺失字段保持待核验，不用旧数据补齐。</p></article>
          <article><span>排序</span><h2>按用户问题排序</h2><p>机场先排实际月付和核验状态；AI先按任务适配；下载先按设备与官方来源。佣金高低不进入排序字段。</p></article>
          <article><span>措辞</span><h2>事实、商家说法与编辑判断分开</h2><p>“官网写明”“购买页显示”“本站建议”代表三种不同证据。稳定、最好、永久等绝对用语不能无证据出现。</p></article>
        </div>
      </section>

      <section className="content-section soft-section release-gates">
        <SectionHeading index="06" title="每次正式发布前的质量门槛" lead="这些检查必须通过；任何一项失败，都不能把版本称为已完成。" />
        <ol>
          <li><span>01</span><div><strong>内容</strong><p>新手能在 30 秒内知道“是什么、是否需要、风险和下一步”；重要结论有来源与日期。</p></div></li>
          <li><span>02</span><div><strong>功能</strong><p>导航、返回、筛选、下载、推广与反馈入口实际点击；没有空链接和错误锚点。</p></div></li>
          <li><span>03</span><div><strong>安全</strong><p>官方下载域名白名单、外链新窗口保护、价格冲突保护与隐私边界自动测试通过。</p></div></li>
          <li><span>04</span><div><strong>体验</strong><p>电脑与手机无横向溢出；键盘可操作；焦点可见；减少动画和高对比模式可用。</p></div></li>
          <li><span>05</span><div><strong>发布</strong><p>静态构建、站内链接、资源完整性和线上抽查全部通过，并留下可回退的版本记录。</p></div></li>
        </ol>
      </section>

      <section className="content-section correction-section">
        <SectionHeading index="07" title="发现错误后多久处理" lead="这是公开处理目标，不是隐瞒失败的承诺；超过目标仍未完成时，应在状态页说明原因。" />
        <div className="correction-sla-grid">
          <article><span>立即隔离</span><h2>下载或安全风险</h2><p>发现未知域名、文件校验不一致、入口疑似劫持或可能泄露隐私时，目标是在确认后立即隐藏相关按钮，再调查原因。</p><strong>先停止传播，再复核</strong></article>
          <article><span>24小时目标</span><h2>价格、入口与交付错误</h2><p>能够重现并有购买页、官方页面或清楚截图的错误，目标在24小时内修正或改为“待复核”。</p><strong>不能确认时不继续展示旧结论</strong></article>
          <article><span>3个工作日目标</span><h2>教程、措辞与无障碍问题</h2><p>不直接影响付款与安全的问题进入编辑队列；优先修复会让新手走错步骤或无法操作的内容。</p><strong>重要程度高于页面美化</strong></article>
        </div>
      </section>

      <section className="content-section limitation-section">
        <SectionHeading index="08" title="现在仍不能替你证明的事情" lead="达到高标准也不等于拥有不存在的检测能力。下面这些结论必须继续诚实标注。" />
        <div className="limitation-callout"><strong>本站不能代表全国所有网络环境</strong><p>自动检查不等于中国大陆电信、联通、移动和不同地区的真实访问结果；节点速度、解锁与稳定性也会随时间和本地网络变化。购买前只选最短周期，并在自己的网络实测。</p></div>
        <div className="standards-actions"><a href="https://github.com/alsolisa/digital-tools-guide" target="_blank" rel="noopener noreferrer">查看公开项目与历史 ↗</a><Link href="/methodology">查看详细核验方法 →</Link><FeedbackLink label="发现证据过期或结论不清楚？" /></div>
      </section>
    </PageShell>
  );
}
