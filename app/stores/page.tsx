import "../content-styles";
import Link from "next/link";
import { PageIntro, PageShell, QuickSummary, RegionNotice, SectionHeading, SourceList } from "../components/SiteChrome";

export const metadata = {
  title: "Apple App Store与Google Play地区教程",
  description: "解释为什么应用商店搜不到软件、账号地区与网络有什么区别，以及如何只从官方商店安全下载。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/stores/` },
};

const sources = [
  { label: "Apple：更改Apple账户国家或地区", url: "https://support.apple.com/en-la/118283" },
  { label: "Apple：优先从App Store安装应用", url: "https://support.apple.com/en-us/118128" },
  { label: "Google Play：更改国家或地区", url: "https://support.google.com/googleplay/answer/7431675" },
  { label: "Google Play：查找与下载应用", url: "https://support.google.com/googleplay/answer/113409" },
];

export default function StoresPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="应用商店与地区 · 小白教程" title="商店搜不到，不等于软件不存在" lead="网络能否打开、账号属于哪个地区、应用是否在该地区上架、设备是否兼容，是四件不同的事。先分清原因，不要急着下载来历不明的安装包。" />
      <QuickSummary title="最安全的处理顺序" points={["先用本站的官方商店直达按钮", "确认登录的是自己的Apple或Google账号", "检查账号地区与设备兼容性", "仍搜不到就先用官方网页版，不下载破解版"]} action={{ label: "按设备打开下载中心", href: "/downloads" }} />

      <section className="content-section">
        <SectionHeading index="01" title="先判断卡在哪一层" lead="同一个‘打不开’，可能是完全不同的原因。" />
        <div className="store-layer-grid">
          <article><span>网络</span><h2>网页或商店能不能连接</h2><p>网络层只回答是否能加载，不代表账号或商品对你的地区开放。</p></article>
          <article><span>账号地区</span><h2>商店把你当作哪个地区用户</h2><p>Apple账户与Google Play国家/地区会影响商店内容、付款与订阅。</p></article>
          <article><span>产品上架</span><h2>开发者是否在该地区提供应用</h2><p>即使商店能打开，某个应用仍可能不在当前地区展示。</p></article>
          <article><span>设备兼容</span><h2>系统版本和设备是否支持</h2><p>过旧系统、非Android设备或公司管理设备都可能无法安装。</p></article>
        </div>
      </section>

      <section className="content-section soft-section" id="apple">
        <SectionHeading index="02" title="iPhone与iPad：先检查Apple账户地区" lead="更改地区会影响余额、订阅、家庭共享和部分已购内容，不要为了下载一款应用就仓促切换。" />
        <div className="store-guide-layout"><ol className="setup-steps"><li><span>01</span><p>打开“设置”→ 点自己的名字 →“媒体与购买项目”→“查看账户”。</p></li><li><span>02</span><p>查看“国家/地区”，确认它是否与自己真实居住和付款信息一致。</p></li><li><span>03</span><p>如果必须更改，先用完账户余额、处理阻止切换的订阅，并退出可能冲突的家庭共享。</p></li><li><span>04</span><p>按Apple官方提示填写新地区的有效付款方式和账单地址；不要购买陌生共享Apple ID。</p></li></ol><aside><strong>不要这样做</strong><ul><li>在陌生网站输入Apple ID密码</li><li>安装来历不明的IPA或描述文件</li><li>使用商家共享账号登录iCloud</li><li>忽略余额、订阅和家庭共享影响</li></ul></aside></div>
      </section>

      <section className="content-section" id="google-play">
        <SectionHeading index="03" title="Android：Google Play国家/地区不是随时能改" lead="Google官方当前说明：首次设置后和后续切换之间通常至少要等待90天；设置新地区还需要位于当地并有当地付款方式，家庭组成员也会受限制。" />
        <div className="store-guide-layout"><ol className="setup-steps"><li><span>01</span><p>打开Google Play → 头像 →“设置”→“常规”→“账号和设备偏好设置”。</p></li><li><span>02</span><p>在“国家/地区和个人资料”查看当前地区；没有切换选项时，不要反复清空或购买陌生账号。</p></li><li><span>03</span><p>确认手机已经登录正确的本人Google账号，并且设备本身支持Google Play。</p></li><li><span>04</span><p>应用仍不显示时，优先使用产品官方网页版，或等待官方在当前地区上架。</p></li></ol><aside><strong>切换前知道</strong><ul><li>旧地区余额不会自动转到新地区</li><li>部分应用、图书与订阅可能消失</li><li>更新可能需要最多48小时</li><li>家庭组可能阻止切换</li></ul></aside></div>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="04" title="本站能提供什么，不能承诺什么" />
        <RegionNotice>本站提供官方商店与官网入口，并自动检查链接状态；但不能代替你改变账号地区，也不能承诺中国大陆普通网络一定能打开海外商店。闭源应用不会由本站重新打包。</RegionNotice>
        <div className="store-actions"><Link href="/downloads">打开官方下载中心 →</Link><Link href="/status">查看当前入口状态 →</Link></div>
      </section>

      <section className="content-section sources-section"><SectionHeading index="05" title="官方资料来源" /><SourceList sources={sources} /></section>
    </PageShell>
  );
}
