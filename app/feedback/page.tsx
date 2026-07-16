import FeedbackAssistant from "../components/FeedbackAssistant";
import { PageIntro, PageShell, QuickSummary, SectionHeading } from "../components/SiteChrome";

export const metadata = {
  title: "反馈与纠错助手",
  description: "不用懂技术，也能把入口失效、价格变化、下载错误或教程问题整理成安全、清楚的反馈。",
};

export default function FeedbackPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="反馈助手 · 不自动上传" title="把问题说清楚，不要把隐私一起发出去" lead="填写内容只在当前浏览器页面中整理。你可以复制文字，或自行打开公开反馈页提交；本站不会读取账号、密码、验证码、Cookie或订阅链接。" />
      <QuickSummary title="反馈只需要四件事" points={["哪一个页面或产品出了问题", "你点击后看到什么提示", "大概时间与网络类型", "不要提供任何账号、付款或订阅隐私"]} />
      <section className="content-section">
        <SectionHeading index="01" title="生成一份可以直接发送的反馈" lead="如果是大陆网络访问问题，请明确写家庭宽带或手机流量，并确认测试时没有开启代理。" />
        <FeedbackAssistant />
      </section>
      <section className="content-section soft-section">
        <SectionHeading index="02" title="这些内容绝对不要提交" />
        <div className="privacy-checklist"><strong>隐私红线</strong><ul><li>邮箱密码、短信验证码、二次验证代码</li><li>完整身份证件、银行卡和付款凭证号码</li><li>机场订阅链接、访问密钥、Cookie</li><li>包含姓名、住址或公司机密的截图</li></ul></div>
      </section>
    </PageShell>
  );
}
