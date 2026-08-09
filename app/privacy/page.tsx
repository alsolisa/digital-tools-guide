import "../content-styles";
import { PageIntro, PageShell, SectionHeading } from "../components/SiteChrome";

export const metadata = { title: "隐私说明", description: "数字工具指南的数据收集边界、第三方链接、自动核验和用户安全说明。", alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/privacy/` } };

export default function PrivacyPage() {
  return <PageShell><PageIntro eyebrow="隐私说明 · 最少收集" title="你不需要把账号交给这个网站" lead="数字工具指南是公开资料与教程网站，不提供登录、付款或代操作功能。使用本站不需要提交个人账号、密码、验证码、订阅链接或付款信息。" />
    <section className="content-section"><SectionHeading index="01" title="本站不会收集" /><div className="two-column-cards"><article><span>NO</span><h3>账号与密钥</h3><p>不收集邮箱密码、短信验证码、二次验证代码、访问密钥、订阅链接、Cookie或浏览器登录状态。</p></article><article><span>NO</span><h3>付款与证件</h3><p>不收集银行卡、支付账号、身份证件或订单付款。所有购买发生在第三方网站。</p></article></div></section>
    <section className="content-section soft-section"><SectionHeading index="02" title="浏览器中的本地功能" /><div className="two-column-cards"><article><span>LOCAL</span><h3>站内搜索与价值计算</h3><p>搜索词和订阅价值计算只在当前页面处理，不发送到本站服务器。</p></article><article><span>DEVICE</span><h3>教程进度清单</h3><p>勾选进度只保存在这台设备的浏览器中，可以随时清空；本站不会读取或上传。</p></article><article><span>LINK</span><h3>外部链接</h3><p>点击官网、应用商店、GitHub或推广链接后，将适用对应第三方的隐私政策与条款。</p></article></div></section>
    <section className="content-section disclosure-page"><SectionHeading index="03" title="你应当保护的信息" /><ul><li>不要在截图中公开邮箱、订单号、订阅地址或二维码。</li><li>不要把验证码、密码或二次验证备份码交给陌生客服。</li><li>共享或交付账号中不要保存公司资料、身份证件、私人照片和重要聊天。</li><li>打开外部网站前核对域名；付款前核对商品、周期、币种、交付和退款规则。</li></ul></section>
  </PageShell>;
}
