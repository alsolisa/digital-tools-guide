"use client";

import { useState } from "react";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const temporary = document.createElement("textarea");
      temporary.value = code;
      temporary.setAttribute("readonly", "");
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.appendChild(temporary);
      temporary.select();
      document.execCommand("copy");
      temporary.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="promo-code-box" aria-label="优惠码">
      <code>{code}</code>
      <button type="button" onClick={copyCode} aria-live="polite">
        {copied ? "已复制" : "复制优惠码"}
      </button>
    </div>
  );
}
