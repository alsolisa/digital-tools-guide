"use client";

import { useEffect, useMemo, useState } from "react";

const issueUrl = "https://github.com/alsolisa/digital-tools-guide/issues/new";
const issueTypes = ["入口打不开", "大陆裸网实测", "价格或套餐变化", "付款方式变化", "下载按钮错误", "教程看不懂", "其他问题"];

export default function FeedbackAssistant() {
  const [type, setType] = useState("入口打不开");
  const [page, setPage] = useState("");
  const [network, setNetwork] = useState("未说明");
  const [detail, setDetail] = useState("");
  const [carrier, setCarrier] = useState("未选择");
  const [connection, setConnection] = useState("未选择");
  const [region, setRegion] = useState("");
  const [accessResult, setAccessResult] = useState("未选择");
  const [proxyOff, setProxyOff] = useState(false);
  const [copied, setCopied] = useState(false);
  const [occurredAt, setOccurredAt] = useState("填写时自动记录");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetType = params.get("type");
    const presetPage = params.get("page");
    const frame = window.requestAnimationFrame(() => {
      if (presetType && issueTypes.includes(presetType)) setType(presetType);
      if (presetPage) setPage(presetPage.slice(0, 100));
      setOccurredAt(new Date().toLocaleString("zh-CN"));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const isNetworkTest = type === "大陆裸网实测";
  const networkTestReady = Boolean(page.trim()) && carrier !== "未选择" && connection !== "未选择" && accessResult !== "未选择" && proxyOff;
  const template = useMemo(() => (isNetworkTest ? [
    "问题类型：大陆裸网实测",
    `实测目标：${page || "请填写"}`,
    `运营商：${carrier}`,
    `连接方式：${connection}`,
    `省/市：${region || "未填写（可选）"}`,
    `访问结果：${accessResult}`,
    `测试时间：${occurredAt}`,
    `补充情况：${detail || "无"}`,
    `代理确认：${proxyOff ? "测试时已关闭VPN、代理和机场客户端" : "尚未确认"}`,
    "隐私确认：未包含IP地址、精确住址、账号、密码、验证码、Cookie、订阅链接或付款信息。",
  ] : [
    `问题类型：${type}`,
    `页面或产品：${page || "请填写"}`,
    `网络环境：${network}`,
    `发生时间：${occurredAt}`,
    `看到的情况：${detail || "请填写"}`,
    "隐私确认：未包含密码、验证码、Cookie、订阅链接或付款信息。",
  ]).join("\n"), [accessResult, carrier, connection, detail, isNetworkTest, network, occurredAt, page, proxyOff, region, type]);

  async function copyTemplate() {
    if (isNetworkTest && !networkTestReady) return;
    await navigator.clipboard.writeText(template);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  function openIssue() {
    if (isNetworkTest && !networkTestReady) return;
    const query = new URLSearchParams({ title: `[资料反馈] ${type}`, body: template });
    window.open(`${issueUrl}?${query.toString()}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="feedback-assistant">
      <div className="feedback-form">
        <label>问题类型<select value={type} onChange={(event) => setType(event.target.value)}>{issueTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>{isNetworkTest ? "实测目标" : "页面或产品"}<input value={page} onChange={(event) => setPage(event.target.value)} placeholder={isNetworkTest ? "例如：Nexitally官方入口" : "例如：Nexitally、ChatGPT下载页"} /></label>
        {isNetworkTest ? <div className="network-test-fields" aria-label="大陆裸网实测必填信息">
          <label>运营商<select value={carrier} onChange={(event) => setCarrier(event.target.value)}><option>未选择</option><option>中国电信</option><option>中国联通</option><option>中国移动</option><option>中国广电</option><option>其他运营商</option></select></label>
          <label>连接方式<select value={connection} onChange={(event) => setConnection(event.target.value)}><option>未选择</option><option>家庭宽带 / Wi-Fi</option><option>手机流量</option></select></label>
          <label>省/市（可选）<input value={region} maxLength={30} onChange={(event) => setRegion(event.target.value)} placeholder="只写省或城市，不写详细地址" /></label>
          <label>访问结果<select value={accessResult} onChange={(event) => setAccessResult(event.target.value)}><option>未选择</option><option>正常打开</option><option>能打开但很慢</option><option>完全打不开</option><option>跳转到陌生页面</option><option>出现防护或验证码</option></select></label>
          <label className="proxy-off-confirm"><input type="checkbox" checked={proxyOff} onChange={(event) => setProxyOff(event.target.checked)} /><span><strong>我确认测试时已经关闭VPN、代理和机场客户端</strong><small>如果不能确认，这条结果不能作为大陆裸网样本。</small></span></label>
        </div> : <label>当时使用的网络<select value={network} onChange={(event) => setNetwork(event.target.value)}><option>未说明</option><option>中国大陆家庭宽带（未开代理）</option><option>中国大陆手机流量（未开代理）</option><option>已使用代理或境外网络</option><option>不确定</option></select></label>}
        <label>{isNetworkTest ? "补充情况（可选）" : "你看到的情况"}<textarea value={detail} onChange={(event) => setDetail(event.target.value)} placeholder={isNetworkTest ? "例如：等待多久、是否出现跳转。不要填写IP地址或精确住址。" : "写清点击了什么、出现了什么提示。不要粘贴账号密码、验证码或订阅链接。"} rows={5} /></label>
      </div>
      <aside className="feedback-preview"><span>自动整理后的反馈</span><pre>{template}</pre>{isNetworkTest && !networkTestReady && <p className="feedback-quality-warning" role="status">请填写目标、运营商、连接方式、访问结果，并确认已关闭代理，才能生成合格样本。</p>}<div><button type="button" disabled={isNetworkTest && !networkTestReady} onClick={copyTemplate}>{copied ? "已复制" : "复制反馈文字"}</button><button type="button" disabled={isNetworkTest && !networkTestReady} className="secondary-feedback" onClick={openIssue}>打开公开反馈页 ↗</button></div><small>复制不等于已经提交。公开反馈页需要GitHub账号；没有账号时，可把复制内容发给网站维护者。本站不会自动上传你填写的内容。</small></aside>
    </div>
  );
}
