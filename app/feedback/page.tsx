import "../content-styles";
import FeedbackAssistant from "../components/FeedbackAssistant";
import { PageIntro, PageShell, QuickSummary, SectionHeading } from "../components/SiteChrome";

export const metadata = {
  title: "反馈与纠错助手",
  description: "不用懂技术，也能把入口失效、价格变化、下载错误或教程问题整理成安全、清楚的反馈。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/feedback/` },
};

export default function FeedbackPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="反馈助手 · 不自动上传" title="把问题说清楚，不要把隐私一起发出去" lead="填写内容只在当前浏览器页面中整理。你可以复制文字，或自行打开公开反馈页提交；本站不会读取账号、密码、验证码、Cookie或订阅链接。" />
      <QuickSummary title="反馈先确认这五件事" points={["哪一个页面或产品出了问题", "你点击后看到什么提示", "大概时间与网络类型", "大陆裸网实测必须确认已经关闭代理", "不要提供任何账号、付款或订阅隐私"]} />
      <section className="content-section">
        <SectionHeading index="01" title="生成一份可以直接发送的反馈" lead="如果是大陆网络访问问题，请明确写家庭宽带或手机流量，并确认测试时没有开启代理。" />
        <FeedbackAssistant />
      </section>
      <section className="content-section network-sample-rules">
        <SectionHeading index="02" title="什么样的大陆网络结果才会被采用" lead="一条能打开或打不开的反馈，不足以代表全国。本站先检查样本是否真实、完整和仍在有效期内。" />
        <div className="network-sample-rule-grid"><article><span>必须填写</span><h2>运营商与连接方式</h2><p>至少说明电信、联通、移动、广电或其他，以及家庭宽带还是手机流量。</p></article><article><span>必须确认</span><h2>测试时已经关闭代理</h2><p>无法确认是否关闭VPN、代理或机场客户端的结果，只能作为线索，不能标成大陆裸网实测。</p></article><article><span>隐私边界</span><h2>只到省或城市</h2><p>不要填写IP地址、精确住址、手机号、账号、订阅链接或包含这些内容的截图。</p></article><article><span>发布门槛</span><h2>两份独立样本才形成趋势</h2><p>单个样本会公开为个例；同一状态至少需要两份独立且30天内的合格样本，才显示趋势。</p></article></div>
      </section>
      <section className="content-section soft-section">
        <SectionHeading index="03" title="这些内容绝对不要提交" />
        <div className="privacy-checklist"><strong>隐私红线</strong><ul><li>邮箱密码、短信验证码、二次验证代码</li><li>完整身份证件、银行卡和付款凭证号码</li><li>机场订阅链接、访问密钥、Cookie</li><li>包含姓名、住址或公司机密的截图</li></ul></div>
      </section>
    </PageShell>
  );
}
