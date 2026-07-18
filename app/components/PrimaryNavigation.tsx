"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export type NavigationItem = readonly [label: string, href: string, matchers?: readonly string[]];

function pathMatches(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  const cleanHref = href.split("#")[0];
  if (!cleanHref) return false;
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

function isCurrentPath(pathname: string, href: string, matchers: readonly string[] = []) {
  return pathMatches(pathname, href) || matchers.some((matcher) => pathMatches(pathname, matcher));
}

const aiChannelItems = [
  ["AI介绍", "/ai"],
  ["AI订阅", "/subscriptions"],
  ["常用应用", "/apps"],
  ["下载中心", "/downloads"],
] as const;

export default function PrimaryNavigation({ items }: { items: readonly NavigationItem[] }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isAiChannel = aiChannelItems.some(([, href]) => pathMatches(pathname, href));

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <>
      <nav className="global-nav" aria-label="全站导航">
        {items.map(([label, href, matchers]) => (
          <Link href={href} key={href} aria-current={isCurrentPath(pathname, href, matchers) ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>

      <button className="mobile-menu-button" type="button" onClick={() => dialogRef.current?.showModal()} aria-haspopup="dialog">
        <span aria-hidden="true">☰</span> 菜单
      </button>
      <dialog className="mobile-menu-dialog" ref={dialogRef} aria-label="网站菜单" onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}>
        <div className="mobile-menu-panel">
          <header>
            <div><span>数字工具指南</span><strong>你想先解决什么？</strong></div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="关闭菜单">×</button>
          </header>
          <nav aria-label="手机端全站导航">
            {items.map(([label, href, matchers], index) => (
              <Link href={href} key={href} aria-current={isCurrentPath(pathname, href, matchers) ? "page" : undefined}>
                <span>{String(index + 1).padStart(2, "0")}</span>{label}<i aria-hidden="true">→</i>
              </Link>
            ))}
          </nav>
          <p>按 Esc 或点击菜单外侧也可以关闭。本站不会在菜单中收集任何信息。</p>
        </div>
      </dialog>

      {isAiChannel && (
        <nav className="ai-channel-nav" aria-label="AI与应用项目导航">
          <strong>项目 02</strong>
          {aiChannelItems.map(([label, href]) => (
            <Link href={href} key={href} aria-current={pathMatches(pathname, href) ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
      )}
    </>
  );
}
