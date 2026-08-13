import "../content-styles";
import { FeedbackLink, PageIntro, PageShell, RegionNotice, SectionHeading } from "../components/SiteChrome";

export const metadata = { title: "常见问题", description: "机场、AI订阅、账号交付、付款、下载、地区与隐私的新手常见问题。", alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/faq/` } };

const groups = [
  { title: "网络服务与客户端", items: [
    ["VPN是什么？", "可以先把它理解成一种把设备网络连接到另一台服务器的技术或服务。不同VPN的加密、记录政策、服务器和可用范围不同，不能仅凭“VPN”三个字判断是否安全。"],
    ["大家说的“机场”是什么？", "这是中文互联网中的非正式叫法，通常指提供多个代理节点和订阅链接的服务商。机场、商业VPN和客户端不是同一件东西。"],
    ["节点是什么？", "节点是连接时经过的服务器，常按国家或地区显示。选择节点会影响出口地址和连接体验，但不能保证所有网站或账号功能都可用。"],
    ["客户端是什么？只安装客户端就能用吗？", "客户端是手机或电脑上的连接软件。只安装Clash Verge、v2rayN或Shadowrocket通常还不够，还需要从服务商获得自己的订阅链接并导入。"],
    ["为什么购买后还要安装客户端？", "服务商通常提供订阅信息，客户端负责把订阅转换成设备可以使用的连接。可以理解为：套餐是车票，客户端负责检票并建立连接。"],
    ["什么叫大陆裸网可访问？", "指没有开启代理或其他中转时，使用中国大陆普通家庭或移动网络访问。本站的“当前环境可访问”不等于“大多数大陆网络可访问”，两种状态会分开标注。"],
    ["为什么一条大陆裸网反馈不能直接标成“国内可用”？", "一个人的运营商、城市和时间只代表一个样本。结果必须确认关闭代理、填写运营商与连接方式并通过隐私检查；同一状态至少需要两份独立且30天内的合格样本，页面才会显示趋势。即使显示趋势，也不代表全国或未来一直相同。"],
    ["订阅链接能发给别人吗？", "不建议。订阅链接相当于个人钥匙，泄露后可能导致流量被使用、节点被滥用或账号被封。不要公开截图，也不要提交给本站。"],
    ["GitHub里应该下载哪个文件？", "先确认系统和芯片。普通Windows通常选x64；苹果芯片Mac选arm64；多数新Android设备选arm64-v8a。看不懂时不要安装，先使用设备助手。"],
  ]},
  { title: "AI订阅与账号", items: [
    ["GamsGo是AI官网吗？", "不是。它是第三方购买渠道。ChatGPT、Claude、Gemini等产品各自有官方公司和官方购买入口。第三方价格可能不同，但账号、售后和隐私风险也不同。"],
    ["第一次用AI应该马上付费吗？", "通常不需要。先用免费版完成几个真实任务，记录是否经常遇到用量或功能限制，再决定是否购买。"],
    ["本人账号充值和交付账号有什么区别？", "本人账号充值是在你原有账号上开通；交付账号是商家提供一个新账号。后者必须确认密码、恢复邮箱、二次验证和到期后的控制权。"],
    ["共享网页为什么便宜？", "共享方式通常由多人共用环境或通过平台中转，账号控制、隐私、稳定性和功能完整度通常更弱。不要在共享环境保存私人文件或重要聊天。"],
    ["AI会员和API额度是一回事吗？", "不是。ChatGPT Plus、Claude Pro等属于产品会员；API按开发调用计费。第三方评测中的API成本也不能当成会员价格。"],
    ["第三方充值需要提供密码吗？", "优先选择不需要邮箱密码的正规流程。访问密钥、验证码和扫码授权也属于敏感信息，应先确认用途、有效期和撤销方式。"],
  ]},
  { title: "下载、地区与付款", items: [
    ["为什么App Store或Google Play搜不到？", "常见原因包括账号地区、设备系统版本、年龄、商店政策或产品尚未在该地区提供。不要因为搜不到就改用网盘安装包。"],
    ["人民币价格为什么只是参考？", "官方可能以美元、新加坡元等结算，最终金额还受实时汇率、税费、支付通道和银行卡费用影响。本站参考价不等于最终扣款。"],
    ["为什么价格会显示暂时无法核验？", "部分购买页必须登录或使用脚本加载。读取失败、字段冲突或价格大幅变化时，网站会隐藏具体数字，避免继续展示可疑旧价格。"],
    ["能否保证所有入口长期有效？", "不能。服务商和应用入口会调整，本站每6小时检查公开链接，但登录后页面和大陆网络状态仍需要人工复核。"],
  ]},
];

export default function FaqPage() {
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: groups.flatMap((group) => group.items.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } }))) };
  return <PageShell><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} /><PageIntro eyebrow="常见问题 · 小白先看" title="把最容易踩坑的地方提前说清楚" lead="这里用大白话回答新手最常问的问题。涉及账号、付款、隐私和地区差异时，先讲清风险，再说具体怎么做。" />
    {groups.map((group, index) => <section className={`content-section ${index % 2 ? "soft-section" : ""}`} key={group.title}><SectionHeading index={String(index + 1).padStart(2, "0")} title={group.title} /><div className="faq-list">{group.items.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>)}
    <section className="content-section"><RegionNotice>网络、账号与付款规则会变化。重要决定请打开对应官方来源，并在付款前再次核对产品名称、周期、交付方式和退款规则。</RegionNotice><FeedbackLink label="没有找到答案？提交问题" /></section>
  </PageShell>;
}
