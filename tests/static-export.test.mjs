import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve("out");
const basePath = "/digital-tools-guide";

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function htmlFiles(directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(full) : entry.name.endsWith(".html") ? [full] : [];
  }));
  return nested.flat();
}

function exportedTarget(urlPath) {
  const withoutBase = urlPath.slice(basePath.length).split(/[?#]/)[0];
  const decoded = decodeURIComponent(withoutBase || "/");
  if (path.extname(decoded)) return path.join(root, decoded);
  return path.join(root, decoded, "index.html");
}

test("GitHub Pages导出包含全部主要页面", async () => {
  const routes = ["/", "/nodes/", "/subscriptions/", "/ai/", "/ai/chatgpt/", "/ai/claude/", "/ai/gemini/", "/ai/grok/", "/ai/perplexity/", "/apps/", "/apps/youtube/", "/apps/x/", "/apps/tiktok/", "/downloads/", "/methodology/"];
  for (const route of routes) assert.equal(await exists(path.join(root, route, "index.html")), true, `缺少导出页面 ${route}`);
});

test("全部站内链接保留GitHub Pages子目录并指向真实文件", async () => {
  for (const file of await htmlFiles()) {
    const html = await readFile(file, "utf8");
    const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/g)].map((match) => match[1]);
    for (const href of links) {
      if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) continue;
      assert.equal(href.startsWith(basePath), true, `${path.relative(root, file)} 存在未加子目录的链接：${href}`);
      assert.equal(await exists(exportedTarget(href)), true, `${href} 没有对应的静态页面或文件`);
    }
  }
});

test("脚本、样式、图片资源均使用正确子目录", async () => {
  const home = await readFile(path.join(root, "index.html"), "utf8");
  const resources = [...home.matchAll(/(?:src|href)=["'](\/[^"']+)["']/g)].map((match) => match[1]);
  assert.ok(resources.length > 0);
  for (const resource of resources) assert.equal(resource.startsWith(basePath), true, `资源地址缺少${basePath}：${resource}`);
  assert.match(home, /https:\/\/alsolisa\.github\.io\/digital-tools-guide\/og-digital-tools\.png/);
});
