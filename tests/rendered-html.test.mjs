import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const autoSync = JSON.parse(await readFile(new URL("../data/auto-sync.json", import.meta.url), "utf8"));

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
    "/downloads", "/methodology", "/search", "/faq", "/privacy", "/disclosure", "/changelog",
  ];
  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, `${route} 应返回200`);
    const html = await response.text();
    assert.match(html, /数字工具指南/, `${route} 应显示统一品牌`);
  }
});

test("全站按零基础用户顺序先解释再比较", async () => {
  const home = await (await render("/")).text();
  assert.match(home, /先选你现在想解决的问题/);
  assert.match(home, /它是什么/);
  const nodes = await (await render("/nodes")).text();
  for (const term of ["VPN", "机场", "节点", "客户端", "订阅链接"]) assert.match(nodes, new RegExp(term));
  assert.match(nodes, /它们不是“全市场前五名”/);
  const subscriptions = await (await render("/subscriptions")).text();
  assert.match(subscriptions, /GamsGo是什么/);
  assert.match(subscriptions, /能官方购买时，优先官方/);
  assert.match(subscriptions, /为什么首批选择这六项/);
  const ai = await (await render("/ai")).text();
  assert.match(ai, /第一次使用AI，不需要先懂模型/);
  assert.match(ai, /先免费体验，再决定付费/);
  const downloads = await (await render("/downloads")).text();
  assert.match(downloads, /网络客户端不是网络套餐/);
  const methodology = await (await render("/methodology")).text();
  assert.match(methodology, /目前不称为实时同步/);
});

test("机场指南按已核验实际月付优先排序并保留待核验标记", async () => {
  const html = await (await render("/nodes")).text();
  const names = ["WestData", "Nexitally", "TAG", "悠兔 Youtu", "BoostNet"];
  assert.match(html, /https:\/\/nxonearth\.com\/Main\.aspx/);
  assert.match(html, /打开官方入口/);
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
  const grokHeading = html.indexOf("<h2>SuperGrok</h2>");
  const grokCardStart = html.lastIndexOf("<article", grokHeading);
  const grokCardEnd = html.indexOf("</article>", grokHeading);
  const grokCard = html.slice(grokCardStart, grokCardEnd);
  const grokSync = autoSync.gamsgo.find((item) => item.slug === "grok");
  assert.ok(grokSync, "应存在Grok同步状态");
  if (["ok", "price-changed"].includes(grokSync.state) && grokSync.published) {
    const currency = grokSync.published.currency === "SGD" ? "S$" : grokSync.published.currency === "USD" ? "US$" : grokSync.published.currency;
    assert.ok(grokCard.includes(`${currency}${grokSync.published.value.toFixed(2)} / 月公开起价`), "页面应显示当前已发布的Grok价格");
  } else {
    assert.match(grokCard, /暂时无法核验/);
    assert.match(grokCard, /以购买页实时显示为准/);
  }
  assert.match(html, /暂时无法核验/);
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
    "github.com", "nssurge.com",
  ];
  for (const link of externalLinks) {
    const host = new URL(link).hostname;
    assert.ok(allowed.some((domain) => host === domain || host.endsWith(`.${domain}`)), `非官方软件下载域名：${host}`);
  }
  assert.doesNotMatch(html, /href=["']#["']/);
});

test("AI详情页包含模型、下载、官方截图、提示词、隐私和评测来源", async () => {
  for (const slug of ["chatgpt", "claude", "gemini", "grok", "perplexity"]) {
    const html = await (await render(`/ai/${slug}`)).text();
    for (const text of ["普通用户能看到的主流模型", "官方下载与网页版", "官方应用界面示意", "五组可以直接复制的提示词", "隐私", "Arena", "Artificial Analysis"]) {
      assert.match(html, new RegExp(text), `${slug} 缺少 ${text}`);
    }
    assert.match(html, new RegExp(`/guides/${slug}/store-1\\.(?:png|jpg)`), `${slug} 缺少官方商店截图`);
    assert.match(html, new RegExp(`/editorial/${slug}\\.png`), `${slug} 缺少V3编辑封面`);
  }
});

test("应用教程分开显示Google Play与Apple App Store", async () => {
  for (const slug of ["youtube", "x", "tiktok"]) {
    const html = await (await render(`/apps/${slug}`)).text();
    assert.match(html, /Google Play/);
    assert.match(html, /Apple App Store/);
    assert.match(html, /设置中文/);
    assert.match(html, /账号安全/);
    assert.match(html, /官方应用界面示意/);
    assert.match(html, new RegExp(`/guides/${slug}/store-1\\.(?:png|jpg)`), `${slug} 缺少官方商店截图`);
    assert.match(html, new RegExp(`/editorial/${slug}\\.png`), `${slug} 缺少V3编辑封面`);
  }
});

test("机场与AI订阅页面接入对应V3视觉指南", async () => {
  const nodes = await (await render("/nodes")).text();
  assert.match(nodes, /网络连接服务：第一次使用指南/);
  assert.match(nodes, /\/editorial\/nodes\.png/);
  const subscriptions = await (await render("/subscriptions")).text();
  assert.match(subscriptions, /AI订阅：购买前先看账号归属/);
  assert.match(subscriptions, /\/editorial\/subscriptions\.png/);
});

test("设备选择助手、搜索、FAQ和运营说明均可用", async () => {
  const downloads = await (await render("/downloads")).text();
  assert.match(downloads, /先选你的设备/);
  assert.match(downloads, /Windows ARM/);
  const search = await (await render("/search")).text();
  assert.match(search, /从一个关键词找到正确入口/);
  const faq = await (await render("/faq")).text();
  assert.match(faq, /为什么购买后还要安装客户端/);
  const disclosure = await (await render("/disclosure")).text();
  assert.match(disclosure, /推广关系/);
  const privacy = await (await render("/privacy")).text();
  assert.match(privacy, /不收集/);
  const changelog = await (await render("/changelog")).text();
  assert.match(changelog, /主要版本记录/);
});

test("不存在的页面返回友好的404说明", async () => {
  const response = await render("/this-page-does-not-exist");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /这个入口可能已经变化/);
});
