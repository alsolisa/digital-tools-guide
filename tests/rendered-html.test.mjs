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
    "/ai/grok", "/ai/perplexity", "/ai/midjourney", "/apps", "/apps/youtube", "/apps/x", "/apps/tiktok",
    "/downloads", "/benchmarks", "/stores", "/status", "/standards", "/feedback", "/about", "/methodology", "/search", "/faq", "/privacy", "/disclosure", "/changelog",
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
  assert.match(home, /机场怎么选、AI怎么用/);
  for (const text of ["看懂机场，选择服务并安装客户端", "了解AI、比较订阅、下载常用应用", "看懂当前主流模型和评测结果"]) assert.match(home, new RegExp(text));
  assert.doesNotMatch(home, /先看懂五个词，再选择服务|按预算直接选/);
  const nodes = await (await render("/nodes")).text();
  for (const term of ["VPN", "机场", "节点", "客户端", "订阅链接"]) assert.match(nodes, new RegExp(term));
  assert.match(nodes, /为什么提供这几家/);
  const subscriptions = await (await render("/subscriptions")).text();
  assert.match(subscriptions, /GamsGo是什么/);
  assert.match(subscriptions, /能官方购买时，优先官方/);
  assert.match(subscriptions, /为什么首批选择这六项/);
  const ai = await (await render("/ai")).text();
  assert.match(ai, /第一次使用AI，不需要先懂模型/);
  assert.doesNotMatch(ai, /先免费体验，再决定付费|只想先选一款|按你的任务选择，不按广告口号选择/);
  const downloads = await (await render("/downloads")).text();
  assert.match(downloads, /网络客户端不是网络套餐/);
  const methodology = await (await render("/methodology")).text();
  assert.match(methodology, /目前不称为实时同步/);
});

test("机场指南按已核验月付排序并清楚分开非月付方案", async () => {
  const html = await (await render("/nodes")).text();
  const names = ["WestData", "Nexitally", "TAG", "悠兔 Youtu", "BoostNet"];
  assert.match(html, /https:\/\/nxonearth\.com\/Main\.aspx/);
  assert.match(html, /打开官方入口/);
  let previous = -1;
  for (const name of names) {
    const position = html.indexOf(`<h3>${name}</h3>`);
    assert.ok(position > previous, `${name} 应按价格顺序出现`);
    previous = position;
  }
  assert.match(html, /按预算直接选/);
  assert.match(html, /悠兔与 BoostNet 暂以季付、半年付和年付为主/);
  assert.match(html, /月付暂停/);
  assert.doesNotMatch(html, /已登录购买页核验；四款均显示可立即订购/);
  assert.doesNotMatch(html, /当前计划页仅直接展示年付、半年付、季付/);
  assert.doesNotMatch(html, /截图用来证明|\/guides\/nodes\/tag-shop\.png|\/guides\/nodes\/youtu-client-proof\.png/);
  assert.match(html, /服务仅限中国大陆，海外及新疆不可用/);
});

test("GamsGo价格与账号风险分栏，读取失败时不沿用旧价", async () => {
  const html = await (await render("/subscriptions")).text();
  assert.match(html, /这个会员对你真的值得吗/);
  assert.match(html, /所有数字只在当前页面计算/);
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

test("主要页面提供规范网址与可理解的结构化数据", async () => {
  const home = await (await render("/")).text();
  assert.match(home, /rel="canonical" href="http:\/\/localhost:3000\/"/);
  assert.match(home, /"@type":"WebSite"/);
  assert.match(home, /"@type":"SearchAction"/);
  assert.match(home, /"@type":"ItemList"/);
  const subscriptions = await (await render("/subscriptions")).text();
  assert.match(subscriptions, /rel="canonical" href="http:\/\/localhost:3000\/subscriptions\/"/);
  const chatgpt = await (await render("/ai/chatgpt")).text();
  assert.match(chatgpt, /"@type":"HowTo"/);
  assert.match(chatgpt, /"@type":"SoftwareApplication"/);
  assert.match(chatgpt, /"@type":"BreadcrumbList"/);
});

test("下载中心只链接允许的官方域名且没有空链接", async () => {
  const html = await (await render("/downloads")).text();
  const externalLinks = [...html.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["']/g)].map((match) => match[1]);
  assert.ok(externalLinks.length >= 15, "应展示多平台官方下载入口");
  const allowed = [
    "chatgpt.com", "claude.ai", "gemini.google.com", "grok.com", "perplexity.ai",
    "youtube.com", "x.com", "tiktok.com", "play.google.com", "apps.apple.com",
    "github.com", "nssurge.com", "midjourney.com",
  ];
  for (const link of externalLinks) {
    const host = new URL(link).hostname;
    assert.ok(allowed.some((domain) => host === domain || host.endsWith(`.${domain}`)), `非官方软件下载域名：${host}`);
  }
  assert.doesNotMatch(html, /href=["']#["']/);
});

test("AI详情页包含真实场景、高清截图、下载、模型、提示词、隐私和评测来源", async () => {
  for (const slug of ["chatgpt", "claude", "gemini", "grok", "perplexity"]) {
    const html = await (await render(`/ai/${slug}`)).text();
    for (const text of ["三个真实使用场景", "选择你的设备，只走官方入口", "先看官方界面", "模型与评测：需要时再看", "五组可以直接复制的提示词", "隐私", "Arena", "Artificial Analysis"]) {
      assert.match(html, new RegExp(text), `${slug} 缺少 ${text}`);
    }
    assert.match(html, new RegExp(`/guides/${slug}/official-1\\.(?:webp|png|jpg)`), `${slug} 缺少高清官方商店截图`);
    assert.match(html, /这一屏重点看/);
    assert.match(html, /设备本地清单/);
    assert.match(html, /不会上传/);
    assert.match(html, /遇到问题时，按症状排查/);
    assert.match(html, /停止条件/);
    assert.match(html, new RegExp(`/editorial/${slug}\\.webp`), `${slug} 缺少轻量编辑封面`);
    assert.match(html, /这页由谁整理，证据能说明到哪里/);
    assert.match(html, /TechArticle/);
  }
  const midjourney = await (await render("/ai/midjourney")).text();
  for (const text of ["三个真实使用场景", "选择你的设备，只走官方入口", "先看官方界面", "模型与评测：需要时再看", "五组可以直接复制的提示词", "隐私", "Midjourney Docs"]) {
    assert.match(midjourney, new RegExp(text), `midjourney 缺少 ${text}`);
  }
  assert.match(midjourney, /\/guides\/midjourney\/official-1\.png/);
  assert.match(midjourney, /\/editorial\/midjourney\.webp/);
});

test("AI与应用列表按要求移除说明条、Midjourney和后续两个冗余章节", async () => {
  const html = await (await render("/ai")).text();
  for (const product of ["ChatGPT", "Claude", "Gemini", "Grok", "Perplexity"]) assert.match(html, new RegExp(product));
  for (const removed of ["品牌图标来自品牌官方资料", "<h2>Midjourney</h2>", "<strong>Midjourney</strong>", "付费前先做一次真实测试", "评测怎么看才不会被误导"]) assert.doesNotMatch(html, new RegExp(removed));
});

test("新手决策、商店地区、状态与反馈功能都能解释边界", async () => {
  const home = await (await render("/")).text();
  for (const text of ["看懂机场，选择服务并安装客户端", "了解AI、比较订阅、下载常用应用", "看懂当前主流模型和评测结果"]) assert.match(home, new RegExp(text));
  const stores = await (await render("/stores")).text();
  assert.match(stores, /至少要等待90天/);
  assert.match(stores, /不要购买陌生共享Apple ID/);
  const status = await (await render("/status")).text();
  assert.match(status, /同页冲突会直接隐藏/);
  assert.match(status, /不等于中国大陆家庭宽带或手机流量实测/);
  assert.match(status, /先分清三层证据/);
  assert.match(status, /服务器正常、真人能打开和线路稳定是三种不同证据/);
  assert.match(status, /待首批合格样本/);
  const feedback = await (await render("/feedback")).text();
  assert.match(feedback, /不会自动上传/);
  assert.match(feedback, /不要粘贴账号密码/);
  assert.match(feedback, /大陆裸网实测/);
  assert.match(feedback, /测试时已经关闭代理/);
  assert.match(feedback, /两份独立样本才形成趋势/);
  const standards = await (await render("/standards")).text();
  assert.match(standards, /资料多久算过期/);
  assert.match(standards, /必须停止自动发布/);
  assert.match(standards, /推广佣金不能改变排序/);
});

test("应用教程分开显示Google Play与Apple App Store", async () => {
  for (const slug of ["youtube", "x", "tiktok"]) {
    const html = await (await render(`/apps/${slug}`)).text();
    assert.match(html, /Google Play/);
    assert.match(html, /Apple App Store/);
    assert.match(html, /设置中文/);
    assert.match(html, /账号安全/);
    assert.match(html, /官方高清界面图/);
    assert.match(html, /三个真实用法/);
    assert.match(html, /遇到打不开、登录或设置问题怎么办/);
    assert.match(html, /停止条件/);
    assert.match(html, new RegExp(`/guides/${slug}/official-1\\.(?:webp|png|jpg)`), `${slug} 缺少高清官方商店截图`);
    assert.match(html, new RegExp(`/editorial/${slug}\\.webp`), `${slug} 缺少轻量编辑封面`);
    assert.match(html, /这页由谁整理，证据能说明到哪里/);
  }
});

test("下载中心提供带版本和SHA-256的开源备用文件", async () => {
  const html = await (await render("/downloads")).text();
  assert.match(html, /本站提供三项开源客户端备用文件/);
  assert.match(html, /Clash\.Verge_2\.5\.1_x64-setup\.exe/);
  assert.match(html, /FlClash-0\.8\.94-android-arm64-v8a\.apk/);
  assert.match(html, /Hiddify-Windows-Setup-x64-v4\.1\.1\.exe/);
  assert.match(html, /SHA-256/);
  assert.match(html, /许可证/);
});

test("机场页面直接从基础概念进入服务推荐并提供三类下载入口", async () => {
  const nodes = await (await render("/nodes")).text();
  assert.match(nodes, /五个词，第一次看到也能懂/);
  assert.match(nodes, /<h1[^>]*>五个词，第一次看到也能懂<\/h1>/);
  assert.ok(nodes.indexOf("五个词，第一次看到也能懂") < nodes.indexOf("按预算直接选"));
  assert.match(nodes, /本地下载 · Windows x64/);
  assert.match(nodes, /使用教程/);
  for (const removed of ["它可能帮助你", "第一次购买与连接清单", "先看症状，再决定要不要重装", "先看需求，不要先看广告词", "页面证据", "地址状态", "把“证据”放在推荐前面", "GamsGo 内容独立整理"]) {
    assert.doesNotMatch(nodes, new RegExp(removed));
  }
  const subscriptions = await (await render("/subscriptions")).text();
  assert.match(subscriptions, /AI订阅：购买前先看账号归属/);
  assert.match(subscriptions, /\/editorial\/subscriptions\.webp/);
  assert.match(subscriptions, /本页编辑责任与复核范围/);
  assert.match(subscriptions, /AI会员付款前清单/);
});

test("模型评测页面解释两套榜单并展示自动同步的Artificial Analysis前十", async () => {
  const html = await (await render("/benchmarks")).text();
  for (const text of ["Arena", "Artificial Analysis", "真人盲测", "API成本", "不合并成本站自制总分", "能力指数", "输出速度", "首段延迟", "上下文长度", "自动同步正常", "最近成功读取"]) assert.match(html, new RegExp(text));
  for (const model of ["Claude Fable 5", "GPT-5.6 Sol", "Kimi K3", "Grok 4.5"]) assert.match(html, new RegExp(model));
  assert.doesNotMatch(html, /第一版收录八个主流模型家族/);
  assert.doesNotMatch(html, /不想研究参数，可以这样选/);
});

test("设备选择助手、搜索、FAQ和运营说明均可用", async () => {
  const downloads = await (await render("/downloads")).text();
  assert.match(downloads, /先选你的设备/);
  assert.match(downloads, /Windows ARM/);
  const search = await (await render("/search")).text();
  assert.match(search, /从一个关键词找到正确入口/);
  assert.match(search, /role="search"/);
  const nodes = await (await render("/nodes")).text();
  assert.match(nodes, /feedback\?type=/);
  assert.match(nodes, /价格、付款或入口变了/);
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
