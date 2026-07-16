import Link from "next/link";
import type { BeginnerPlaybook } from "../../data/beginner-playbooks";

export default function BeginnerTroubleshooter({ name, playbook }: { name: string; playbook: BeginnerPlaybook }) {
  const feedbackHref = `/feedback?type=${encodeURIComponent("教程看不懂")}&page=${encodeURIComponent(name)}`;
  return (
    <div className="beginner-troubleshooter">
      <div className="troubleshooter-overview">
        <article><span>开始前 30 秒</span><h3>先确认这三件事</h3><ol>{playbook.beforeStart.map((item) => <li key={item}>{item}</li>)}</ol></article>
        <article className="troubleshooter-success"><span>完成标准</span><h3>做到这些才算跑通</h3><ul>{playbook.successSignals.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>
      <div className="troubleshooter-problems">
        {playbook.problems.map((problem, index) => <details key={problem.symptom}><summary><b>{String(index + 1).padStart(2, "0")}</b><span>如果出现：{problem.symptom}</span></summary><div><p><strong>通常先怀疑</strong>{problem.likely}</p><ol>{problem.steps.map((step) => <li key={step}>{step}</li>)}</ol><p className="troubleshooter-stop"><strong>停止条件</strong>{problem.stop}</p></div></details>)}
      </div>
      <div className="troubleshooter-foot"><p>按钮名称会随版本变化。找不到时先回到官方帮助页，不要在陌生网站输入账号资料。</p><Link href={feedbackHref}>这个问题仍没解决？生成安全反馈 →</Link></div>
    </div>
  );
}
