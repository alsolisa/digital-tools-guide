"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SearchEntry } from "../../data/search-index";

function normalized(value: string) {
  return value.toLocaleLowerCase("zh-CN").replace(/\s+/g, "");
}

export default function SiteSearch({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const categories = ["全部", ...Array.from(new Set(entries.map((entry) => entry.category)))];
  const results = useMemo(() => {
    const keyword = normalized(query);
    return entries.filter((entry) => {
      const categoryMatches = category === "全部" || entry.category === category;
      const haystack = normalized([entry.title, entry.description, ...entry.keywords].join(" "));
      return categoryMatches && (!keyword || haystack.includes(keyword));
    });
  }, [category, entries, query]);

  return (
    <div className="site-search">
      <label htmlFor="site-search-input">输入产品、系统、问题或服务名称</label>
      <div className="site-search-bar"><input id="site-search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：ChatGPT、月付、iPhone、Clash、账号交付" autoComplete="off" /><button type="button" onClick={() => setQuery("")} disabled={!query}>清空</button></div>
      <div className="search-categories" aria-label="筛选栏目">{categories.map((item) => <button type="button" aria-pressed={category === item} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <p className="search-count" aria-live="polite">找到 {results.length} 项内容</p>
      <div className="search-results">{results.map((entry) => <Link href={entry.href} key={`${entry.href}-${entry.title}`}><span>{entry.category}</span><strong>{entry.title}</strong><p>{entry.description}</p><b>打开内容 →</b></Link>)}</div>
      {!results.length && <div className="search-empty"><strong>没有找到匹配内容</strong><p>可以缩短关键词，或者前往常见问题和反馈入口。</p><Link href="/faq">查看常见问题 →</Link></div>}
    </div>
  );
}
