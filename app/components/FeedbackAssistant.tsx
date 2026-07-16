"use client";

import { useMemo, useState } from "react";

const issueUrl = "https://github.com/alsolisa/digital-tools-guide/issues/new";

export default function FeedbackAssistant() {
  const [type, setType] = useState("入口打不开");
  const [page, setPage] = useState("");
  const [network, setNetwork] = useState("未说明");
  const [detail, setDetail] = useState("");
  const [copied, setCopied] = useState(false);
  const template = useMemo(() => [
    `问题类型：${type}`,
    `页面或产品：${page || "请填写"}`,
    `网络环境：${network}`,
    `发生时间：${new Date().toLocaleString("zh-CN")}`,
    `看到的情况：${detail || "请填写"}`,
    "隐私确认：未包含密码、验证码、Cookie、订阅链接或付款信息。",
  ].join("\n"), [type, page, network, detail]);

  async function copyTemplate() {
    await navigator.clipboard.writeText(template);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  function openIssue() {
    const query = new URLSearchParams({ title: `[资料反馈] ${type}`, body: template });
    window.open(`${issueUrl}?${query.toString()}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="feedback-assistant">
      <div className="feedback-form">
        <label>问题类型<select value={type} onChange={(event) => setType(event.target.value)}><option>入口打不开</option><option>价格或套餐变化</option><option>付款方式变化</option><option>下载按钮错误</option><option>教程看不懂</option><option>其他问题</option></select></label>
        <label>页面或产品<input value={page} onChange={(event) => setPage(event.target.value)} placeholder="例如：Nexitally、ChatGPT下载页" /></label>
        <label>当时使用的网络<select value={network} onChange={(event) => setNetwork(event.target.value)}><option>未说明</option><option>中国大陆家庭宽带（未开代理）</option><option>中国大陆手机流量（未开代理）</option><option>已使用代理或境外网络</option><option>不确定</option></select></label>
        <label>你看到的情况<textarea value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="写清点击了什么、出现了什么提示。不要粘贴账号密码、验证码或订阅链接。" rows={5} /></label>
      </div>
      <aside className="feedback-preview"><span>自动整理后的反馈</span><pre>{template}</pre><div><button type="button" onClick={copyTemplate}>{copied ? "已复制" : "复制反馈文字"}</button><button type="button" className="secondary-feedback" onClick={openIssue}>打开公开反馈页 ↗</button></div><small>复制不等于已经提交。公开反馈页需要GitHub账号；没有账号时，可把复制内容发给网站维护者。本站不会自动上传你填写的内容。</small></aside>
    </div>
  );
}
