import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const executable = process.execPath;
const nextCli = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

const result = spawnSync(executable, [nextCli, "build"], {
  stdio: "inherit",
  env: { ...process.env, GITHUB_PAGES: "true" },
});

if (result.error) throw result.error;
if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1);

// The homepage has no stateful widgets: links, anchor scrolling and the mobile
// menu all work as native HTML. Shipping the App Router runtime there would add
// hundreds of kilobytes and delay first paint without adding user value. Keep
// JSON-LD, remove hydration scripts, and let content pages retain full React
// interactivity for search, filters, checklists and troubleshooting tools.
const homePath = path.join(process.cwd(), "out", "index.html");
const homeHtml = await readFile(homePath, "utf8");
const hydrationFreeHome = homeHtml
  .replace(/<link\b(?=[^>]*\bas=["']script["'])[^>]*>/gi, "")
  .replace(/<script\b(?![^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace("</head>", "<!-- hydration-free static homepage --></head>");
await writeFile(homePath, hydrationFreeHome, "utf8");
