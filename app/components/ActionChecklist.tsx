"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function ActionChecklist({ id, title = "照着做，不容易漏", items }: { id: string; title?: string; items: string[] }) {
  const storageKey = `dtg-checklist-${id}`;
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const loadedRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const value = JSON.parse(saved);
          if (Array.isArray(value)) setChecked(items.map((_, index) => Boolean(value[index])));
        }
      } catch {
        // 浏览器禁用本地存储时，清单仍可在当前页面使用。
      }
      loadedRef.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [items, storageKey]);

  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // 不上传、不报错，也不阻止用户继续操作。
    }
  }, [checked, storageKey]);

  const completed = useMemo(() => checked.filter(Boolean).length, [checked]);
  const percent = Math.round((completed / Math.max(items.length, 1)) * 100);

  return (
    <aside className="action-checklist" aria-label={`${title}操作清单`}>
      <div className="action-checklist-head">
        <div><span>设备本地清单</span><h3>{title}</h3></div>
        <strong aria-live="polite">{completed}/{items.length}</strong>
      </div>
      <progress value={completed} max={items.length} aria-label={`已完成 ${percent}%`} />
      <div className="action-checklist-items">
        {items.map((item, index) => (
          <label key={item}>
            <input type="checkbox" checked={checked[index] || false} onChange={() => setChecked((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} />
            <span>{item}</span>
          </label>
        ))}
      </div>
      <div className="action-checklist-foot">
        <small>勾选只保存在这台设备的浏览器中，不会上传。</small>
        {completed > 0 && <button type="button" onClick={() => setChecked(items.map(() => false))}>重新开始</button>}
      </div>
    </aside>
  );
}
