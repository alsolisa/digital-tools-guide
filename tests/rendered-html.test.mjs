import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("全部公开页面与详情页都能正常打开", async () => {
  const routes = [
    "/", "/nodes", "/subscriptions", "/ai", "/ai/chatgpt", "/ai/claude", "/ai/gemini",
    "/ai/grok", "/ai/perplexity", "/apps", "/apps/youtube", "/apps/x", "/apps/tiktok",
    "/downloads", "/methodology",
  ];
  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, `${route} 应返回200`);
    const html = await response.text();
    assert.match(html, /数字工具指南/, `${route} 应显示统一品牌`);
  }
});

test("机场指南按已核验实际月付优先排序并保留待核验标记", async () => {
  const html = await (await render("/nodes")).text();
  const names = ["WestData", "Nexitally", "TAG", "悠兔 Youtu", "BoostNet"];
  let previous = -1;
  for (const name of names) {
    const position = html.indexOf(name);
    assert.ok(position > previous, `${name} 应按价格顺序出现`);
    previous = position;
  }
  assert.match(html, /已核验月付优先，再按起价排序/);
  assert.match(html, /购买页待核验/);
  assert.match(html, /暂无直接月付/);
});

test("GamsGo价格与账号风险分栏，读取失败时不沿用旧价", async () => {
  const html = await (await render("/subscriptions")).text();
  for (const name of ["ChatGPT Plus 充值", "Claude Pro / Max", "Gemini / Google AI Pro", "SuperGrok", "Perplexity Pro", "Midjourney"]) {
    assert.match(html, new RegExp(name.replace(/[+\/]/g, "\\$&")));
  }
  assert.match(html, /US\$6\.17 \/ 月公开起价/);
  assert.match(html, /暂时无法核验/);
  assert.doesNotMatch(html, /US\$17\.99 \/ 月公开参考/);
  assert.match(html, /推广链接/);
  assert.match(html, /账号归属/);
  assert.match(html, /隐私/);
});

test("下载中心只链接允许的官方域名且没有空链接", async () => {
  const html = await (await render("/downloads")).text();
  const externalLinks = [...html.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["']/g)].map((match) => match[1]);
  assert.ok(externalLinks.length >= 15, "应展示多平台官方下载入口");
  const allowed = [
    "chatgpt.com", "claude.ai", "gemini.google.com", "grok.com", "perplexity.ai",
    "youtube.com", "x.com", "tiktok.com", "play.google.com", "apps.apple.com",
  ];
  for (const link of externalLinks) {
    const host = new URL(link).hostname;
    assert.ok(allowed.some((domain) => host === domain || host.endsWith(`.${domain}`)), `非官方软件下载域名：${host}`);
  }
  assert.doesNotMatch(html, /href=["']#["']/);
});

test("AI详情页包含模型、下载、提示词、隐私和评测来源", async () => {
  for (const slug of ["chatgpt", "claude", "gemini", "grok", "perplexity"]) {
    const html = await (await render(`/ai/${slug}`)).text();
    for (const text of ["普通用户能看到的主流模型", "官方下载与网页版", "五组可以直接复制的提示词", "隐私", "Arena", "Artificial Analysis"]) {
      assert.match(html, new RegExp(text), `${slug} 缺少 ${text}`);
    }
  }
});

test("应用教程分开显示Google Play与Apple App Store", async () => {
  for (const slug of ["youtube", "x", "tiktok"]) {
    const html = await (await render(`/apps/${slug}`)).text();
    assert.match(html, /Google Play/);
    assert.match(html, /Apple App Store/);
    assert.match(html, /设置中文/);
    assert.match(html, /账号安全/);
  }
});
