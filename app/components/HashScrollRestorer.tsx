"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToCurrentHash() {
  if (!window.location.hash) return;
  let id = window.location.hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // 无效编码保持原值，仍允许浏览器尝试匹配原始 id。
  }
  document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "auto" });
}

export default function HashScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    const timeouts: number[] = [];
    let firstFrame = 0;
    let secondFrame = 0;
    let observer: ResizeObserver | null = null;
    let observerTimeout = 0;

    function scheduleScroll() {
      if (!window.location.hash) return;
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(scrollToCurrentHash);
      });
      for (const delay of [120, 350, 800, 1600, 2800]) {
        timeouts.push(window.setTimeout(scrollToCurrentHash, delay));
      }
      document.fonts?.ready.then(scrollToCurrentHash).catch(() => {});
      observer?.disconnect();
      window.clearTimeout(observerTimeout);
      if ("ResizeObserver" in window) {
        observer = new ResizeObserver(scrollToCurrentHash);
        observer.observe(document.body);
        observerTimeout = window.setTimeout(() => observer?.disconnect(), 4000);
      }
    }

    scheduleScroll();
    window.addEventListener("hashchange", scheduleScroll);
    window.addEventListener("popstate", scheduleScroll);
    return () => {
      window.removeEventListener("hashchange", scheduleScroll);
      window.removeEventListener("popstate", scheduleScroll);
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      for (const timeout of timeouts) window.clearTimeout(timeout);
      observer?.disconnect();
      window.clearTimeout(observerTimeout);
    };
  }, [pathname]);

  return null;
}
