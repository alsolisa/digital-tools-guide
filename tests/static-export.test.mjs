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
  const routes = ["/", "/nodes/", "/subscriptions/", "/ai/", "/ai/chatgpt/", "/ai/claude/", "/ai/gemini/", "/ai/grok/", "/ai/perplexity/", "/ai/midjourney/", "/apps/", "/apps/youtube/", "/apps/x/", "/apps/tiktok/", "/downloads/", "/stores/", "/status/", "/feedback/", "/about/", "/methodology/", "/search/", "/faq/", "/privacy/", "/disclosure/", "/changelog/"];
  for (const route of routes) assert.equal(await exists(path.join(root, route, "index.html")), true, `缺少导出页面 ${route}`);
});

test("静态导出包含搜索引擎、PWA与教程图片资源", async () => {
  for (const file of ["sitemap.xml", "robots.txt", "manifest.webmanifest"]) {
    assert.equal(await exists(path.join(root, file)), true, `缺少 ${file}`);
  }
  for (const slug of ["chatgpt", "claude", "gemini", "grok", "perplexity", "midjourney", "youtube", "x", "tiktok"]) {
    const directory = path.join(root, "guides", slug);
    assert.equal(await exists(directory), true, `缺少${slug}教程图片目录`);
  }
  for (const slug of ["chatgpt", "claude", "gemini", "grok", "perplexity", "midjourney", "youtube", "x", "tiktok", "nodes", "subscriptions"]) {
    assert.equal(await exists(path.join(root, "editorial", `${slug}.png`)), true, `缺少${slug}编辑封面`);
  }
  for (const file of ["tag-shop.png", "youtu-client-proof.png"]) {
    assert.equal(await exists(path.join(root, "guides", "nodes", file)), true, `缺少机场核验证据 ${file}`);
  }
  for (const file of ["Clash.Verge_2.5.1_x64-setup.exe", "FlClash-0.8.94-android-arm64-v8a.apk"]) {
    assert.equal(await exists(path.join(root, "mirror", file)), true, `缺少本站备用安装包 ${file}`);
  }
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
  assert.match(home, /https:\/\/alsolisa\.github\.io\/digital-tools-guide\/og-v4\.png/);
});
