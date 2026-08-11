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
  const routes = ["/", "/nodes/", "/subscriptions/", "/ai/", "/ai/chatgpt/", "/ai/claude/", "/ai/gemini/", "/ai/grok/", "/ai/perplexity/", "/ai/midjourney/", "/apps/", "/apps/youtube/", "/apps/x/", "/apps/tiktok/", "/downloads/", "/benchmarks/", "/stores/", "/status/", "/standards/", "/feedback/", "/about/", "/methodology/", "/search/", "/faq/", "/privacy/", "/disclosure/", "/changelog/"];
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
  for (const file of ["Clash.Verge_2.5.2_x64-setup.exe", "FlClash-0.8.94-android-arm64-v8a.apk", "Hiddify-Windows-Setup-x64-v4.1.1.exe"]) {
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

test("全部导出页面满足基础SEO、可访问性与外链安全门禁", async () => {
  for (const file of await htmlFiles()) {
    const html = await readFile(file, "utf8");
    const relative = path.relative(root, file);
    assert.match(html, /<html[^>]*\blang="zh-CN"/i, `${relative} 缺少中文语言标记`);
    assert.match(html, /<title>[^<]+<\/title>/i, `${relative} 缺少页面标题`);
    assert.match(html, /<meta[^>]*\bname="description"[^>]*\bcontent="[^"]+"/i, `${relative} 缺少页面说明`);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${relative} 必须且只能有一个H1`);

    const ids = [...html.matchAll(/\bid="([^"]+)"/gi)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${relative} 存在重复ID`);

    for (const image of html.match(/<img\b[^>]*>/gi) || []) {
      assert.match(image, /\balt="[^"]*"/i, `${relative} 的图片缺少替代文字：${image.slice(0, 120)}`);
    }
    for (const anchor of html.match(/<a\b[^>]*\btarget="_blank"[^>]*>/gi) || []) {
      const rel = anchor.match(/\brel="([^"]+)"/i)?.[1] || "";
      assert.match(rel, /(?:^|\s)noopener(?:\s|$)/i, `${relative} 的新窗口链接缺少noopener`);
    }

    if (!["404.html", path.join("404", "index.html"), path.join("_not-found", "index.html")].includes(relative)) {
      assert.match(html, /<link[^>]*\brel="canonical"[^>]*\bhref="https:\/\/alsolisa\.github\.io\/digital-tools-guide\//i, `${relative} 缺少正式站规范网址`);
    }
  }
});

test("脚本、样式、图片资源均使用正确子目录", async () => {
  const home = await readFile(path.join(root, "index.html"), "utf8");
  const resources = [...home.matchAll(/(?:src|href)=["'](\/[^"']+)["']/g)].map((match) => match[1]);
  assert.ok(resources.length > 0);
  for (const resource of resources) assert.equal(resource.startsWith(basePath), true, `资源地址缺少${basePath}：${resource}`);
  assert.match(home, /https:\/\/alsolisa\.github\.io\/digital-tools-guide\/og-evidence-ledger-v17-refined\.jpg/);
  assert.match(home, /<meta property="og:image:width" content="1200"\/>/);
  assert.match(home, /<meta property="og:image:height" content="630"\/>/);
  assert.equal(await exists(path.join(root, "og-evidence-ledger-v17-refined.jpg")), true, "V17精修社交分享图没有进入静态发布包");
  assert.match(home, /hydration-free static homepage/);
  assert.doesNotMatch(home, /<script[^>]+src=|self\.__next_f/, "纯静态首页不应下载无用的React运行时");
  assert.equal((home.match(/type="application\/ld\+json"/g) || []).length >= 2, true, "移除首页运行时后仍须保留结构化数据");
  assert.equal((home.match(/rel="stylesheet"/g) || []).length, 1, "首页只能加载一份经过拆分的关键样式");
  assert.match(home, /<details class="static-mobile-menu">[\s\S]*?<summary class="mobile-menu-button">/, "无脚本首页必须保留可键盘操作的移动菜单");

  const subscriptions = await readFile(path.join(root, "subscriptions", "index.html"), "utf8");
  assert.equal((subscriptions.match(/>打开购买页面<\/a>/g) || []).length, 5, "订阅页的五个购买按钮文案必须统一");
  assert.doesNotMatch(subscriptions, /打开我的推广购买页|推广入口已自动核验|推广码已保留/);
  for (const qr of ["gamsgo-chatgpt-account.png", "gamsgo-chatgpt-recharge.png"]) {
    assert.match(subscriptions, new RegExp(`${basePath}/qr/${qr.replace(".", "\\.")}`), `${qr} 缺少GitHub Pages子目录`);
    assert.equal(await exists(path.join(root, "qr", qr)), true, `缺少二维码文件 ${qr}`);
  }

  for (const image of ["gamsgo-coupon-entry.png", "gamsgo-coupon-checkout.png", "gamsgo-get-code.png", "chatgpt-email-login.png", "chatgpt-password.png", "chatgpt-verification.png", "gamsgo-hidden-code.png"]) {
    assert.equal(await exists(path.join(root, "guides", "subscriptions", image)), true, `缺少订阅教程截图：${image}`);
  }
});
