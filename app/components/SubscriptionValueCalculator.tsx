"use client";

import { useMemo, useState } from "react";

function numberValue(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export default function SubscriptionValueCalculator() {
  const [monthlyFee, setMonthlyFee] = useState("140");
  const [usesPerWeek, setUsesPerWeek] = useState("4");
  const [minutesSaved, setMinutesSaved] = useState("15");
  const [hourValue, setHourValue] = useState("30");

  const result = useMemo(() => {
    const fee = numberValue(monthlyFee, 140);
    const uses = numberValue(usesPerWeek, 0);
    const minutes = numberValue(minutesSaved, 0);
    const valuePerHour = numberValue(hourValue, 0);
    const hours = uses * 4.33 * minutes / 60;
    const estimatedValue = hours * valuePerHour;
    const ratio = fee > 0 ? estimatedValue / fee : 0;
    if (uses < 2 || hours < 1) return { tone: "wait", title: "先不要买", note: "使用频率还不高。先连续使用免费版 3—7 天，再记录真正碰到的限制。", hours, estimatedValue };
    if (ratio >= 2) return { tone: "good", title: "可能值得进一步比较", note: "估算价值明显高于月费，但仍要检查账号归属、隐私、地区、税费与自动续费。", hours, estimatedValue };
    if (ratio >= 1) return { tone: "maybe", title: "接近值得，先试一个月", note: "价值和月费比较接近。只买最短周期，并在续费前回看实际使用次数。", hours, estimatedValue };
    return { tone: "wait", title: "目前不建议付费", note: "按你的输入，节省的时间价值低于月费。免费版或按需使用更合适。", hours, estimatedValue };
  }, [hourValue, minutesSaved, monthlyFee, usesPerWeek]);

  return (
    <div className="subscription-calculator">
      <div className="subscription-calculator-copy">
        <span>先算价值，再看价格</span>
        <h2>这个会员对你真的值得吗？</h2>
        <p>不用输入收入或账号。这里只按“使用频率 × 每次节省时间”做保守估算，所有数字只在当前页面计算。</p>
      </div>
      <div className="subscription-calculator-form">
        <label>预计月费（元）<input inputMode="decimal" value={monthlyFee} onChange={(event) => setMonthlyFee(event.target.value)} aria-describedby="fee-help" /><small id="fee-help">把结算页最终金额填进来</small></label>
        <label>每周使用（次）<input inputMode="numeric" value={usesPerWeek} onChange={(event) => setUsesPerWeek(event.target.value)} /></label>
        <label>每次节省（分钟）<input inputMode="numeric" value={minutesSaved} onChange={(event) => setMinutesSaved(event.target.value)} /></label>
        <label>每小时价值（元）<input inputMode="decimal" value={hourValue} onChange={(event) => setHourValue(event.target.value)} /><small>不知道时先填 20—30</small></label>
      </div>
      <output className={`subscription-calculator-result result-${result.tone}`} aria-live="polite">
        <div><span>保守估算</span><strong>{result.title}</strong><p>{result.note}</p></div>
        <dl><div><dt>每月节省</dt><dd>{result.hours.toFixed(1)} 小时</dd></div><div><dt>估算价值</dt><dd>约 ¥{Math.round(result.estimatedValue)}</dd></div></dl>
      </output>
      <small className="calculator-disclaimer">这不是收益保证，也不替你做购买决定。AI输出仍需要核对；节省时间只有在结果可用时才成立。</small>
    </div>
  );
}
