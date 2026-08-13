import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const subscriptionPricing = JSON.parse(await readFile(new URL("../data/subscription-pricing.json", import.meta.url), "utf8"));
const autoSync = JSON.parse(await readFile(new URL("../data/auto-sync.json", import.meta.url), "utf8"));
const syncedUsdCnyRate = Number(autoSync.exchange?.rates?.CNY);
const expectedUsdCnyRate = Number.isFinite(syncedUsdCnyRate) && syncedUsdCnyRate > 0 ? syncedUsdCnyRate : subscriptionPricing.usdCnyRate;

function expectedCny(usd, suffix = "") {
  return `¥${(usd * expectedUsdCnyRate).toFixed(2)}人民币${suffix.replace(" / ", "/")}`;
}

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
  assert.match(home, /先弄清楚/);
  assert.match(home, /不替你喊“最好用”/);
  for (const text of ["第一次看到“机场”和“节点”", "拿自己的事试一次", "榜单可以参考"]) assert.match(home, new RegExp(text));
  for (const text of ["程序负责盯变化", "每 6 小时", "人工编辑"]) assert.match(home, new RegExp(text));
  for (const removedArtwork of ["network-journey-home-v2", "ai-assistant-home-v2", "model-benchmarks-home-v2"]) assert.doesNotMatch(home, new RegExp(removedArtwork));
  assert.doesNotMatch(home, /先看懂五个词，再选择服务|按预算直接选/);
  const nodes = await (await render("/nodes")).text();
  for (const term of ["VPN", "机场", "节点", "客户端", "订阅链接"]) assert.match(nodes, new RegExp(term));
  assert.match(nodes, /为什么提供这几家/);
  const subscriptions = await (await render("/subscriptions")).text();
  assert.match(subscriptions, /先看清买到什么，再决定在哪儿买/);
  for (const text of ["下单前，先问清四件事", "什么情况下会考虑第三方购买", "支付宝", "最后一眼看实际金额"]) assert.match(subscriptions, new RegExp(text));
  assert.doesNotMatch(subscriptions, /最高可节省 85%|1000 万\+/);
  for (const removed of ["先判断要不要买，再决定去哪里买", "GamsGo是什么？为什么有人会选择它？", "为什么首批选择这六项？"]) assert.doesNotMatch(subscriptions, new RegExp(removed.replace(/[?？]/g, ".")));
  assert.doesNotMatch(subscriptions, /付款前先算价值|这个会员对你真的值得吗|id="before-buy"/);
  const ai = await (await render("/ai")).text();
  assert.match(ai, /第一次用 AI，先别急着研究模型/);
  assert.match(ai, /入口检查/);
  assert.match(ai, /(?:自动检查|待复核|读取异常)/);
  assert.doesNotMatch(ai, /先免费体验，再决定付费|只想先选一款|按你的任务选择，不按广告口号选择/);
  const downloads = await (await render("/downloads")).text();
  assert.match(downloads, /网络客户端不是网络套餐/);
  const methodology = await (await render("/methodology")).text();
  assert.match(methodology, /目前不称为实时同步/);
});

test("机场指南按证据新鲜度分开月付价格与非月付方案", async () => {
  const html = await (await render("/nodes")).text();
  const names = ["WestData", "Nexitally", "TAG", "悠兔 Youtu", "BoostNet"];
  assert.match(html, /https:\/\/nxonearth\.com\/Main\.aspx/);
  assert.match(html, /打开官方入口/);
  for (const name of names) {
    assert.equal((html.match(new RegExp(`<h3>${name}</h3>`, "g")) || []).length, 1, `${name} 应且只应出现一次`);
  }
  const nonMonthlyHeading = html.indexOf("悠兔与 BoostNet 的最近记录为季付、半年付和年付");
  assert.ok(nonMonthlyHeading >= 0);
  for (const name of ["WestData", "Nexitally", "TAG"]) {
    assert.ok(html.indexOf(`<h3>${name}</h3>`) < nonMonthlyHeading, `${name} 不应被归入非月付分组`);
  }
  assert.ok(html.indexOf("<h3>悠兔 Youtu</h3>", nonMonthlyHeading) > nonMonthlyHeading, "悠兔应列在非月付分组");
  assert.ok(html.indexOf("<h3>BoostNet</h3>", nonMonthlyHeading) > html.indexOf("<h3>悠兔 Youtu</h3>", nonMonthlyHeading), "非月付方案应保持稳定顺序");
  if (html.includes("人工核验已超过14天")) {
    assert.match(html, /月付价格待重新核验/);
    assert.match(html, /不会被误写成已经停止月付/);
  }
  assert.match(html, /先看核验状态，再按预算和购买周期缩小范围/);
  assert.match(html, /入口已自动核验/);
  assert.match(html, /入口受防护 · 可手动打开/);
  assert.doesNotMatch(html, /人工核验已超过14天/);
  assert.match(html, /悠兔与 BoostNet 的最近记录为季付、半年付和年付/);
  assert.match(html, /不能据此断言今天仍然暂停月付/);
  assert.match(html, /其中“当前”“可购买”等表述只代表当次页面状态/);
  assert.match(html, /月付暂停/);
  assert.doesNotMatch(html, /已登录购买页核验；四款均显示可立即订购/);
  assert.doesNotMatch(html, /当前计划页仅直接展示年付、半年付、季付/);
  assert.doesNotMatch(html, /截图用来证明|\/guides\/nodes\/tag-shop\.png|\/guides\/nodes\/youtu-client-proof\.png/);
  assert.match(html, /服务仅限中国大陆，海外及新疆不可用/);
  assert.match(html, /易支付（支付宝）、USDT-TRC20/);
});

test("GamsGo订阅卡片提供清楚价格、付款、售后与推广购买入口", async () => {
  const html = await (await render("/subscriptions")).text();
  for (const name of ["ChatGPT Plus", "Claude Pro / Max", "Gemini / Google AI Pro", "SuperGrok", "Perplexity Pro"]) {
    assert.match(html, new RegExp(name.replace(/[+\/]/g, "\\$&")));
  }
  for (const label of ["共享使用", "独享账号", "本人账号充值"]) assert.match(html, new RegExp(label));
  assert.match(html, /https:\/\/www\.gamsgo\.com\/details\/chatgpt\/partner\/BTzCM/);
  assert.match(html, /https:\/\/www\.gamsgo\.com\/details\/chatgpt-recharge\/partner\/BTzCM/);
  assert.match(html, /\/qr\/gamsgo-chatgpt-account\.png/);
  assert.match(html, /\/qr\/gamsgo-chatgpt-recharge\.png/);
  assert.match(html, /Visa、Mastercard、Apple Pay、Google Pay、银联、支付宝等；以GamsGo结算页为准/);
  assert.match(html, /共享订阅：1个月订阅暂不支持支付宝，3个月、6个月均支持支付宝付款/);
  assert.match(html, /使用中国大陆网络直接访问时通常只显示1个月/);
  assert.match(html, /使用境外网络（需要连接机场或VPN）时可能显示1个月、3个月和6个月/);
  assert.match(html, /联系客服处理 · 7×24小时/);
  assert.match(html, /可能是独立账号交付，不一定是本人原账号/);
  assert.equal((html.match(/class="promotion-price-action"[^>]*>打开购买页面<\/a>/g) || []).length, 5, "五张订阅卡片都应提供统一的主购买按钮");
  assert.doesNotMatch(html, /打开我的推广购买页|推广入口已自动核验|推广码已保留/);
  const claudeSync = autoSync.gamsgo.find((item) => item.slug === "claude");
  if (["ok", "price-changed", "stale"].includes(claudeSync?.state) && claudeSync?.published) {
    assert.match(html, /Max方案 US\$[0-9.]+ \/ 月公开起价/);
    assert.match(html, /GamsGo 原 Claude 商品页现已转到市场中心/);
  }
  assert.match(html, new RegExp(`1 USD = ¥<!-- -->${expectedUsdCnyRate.toFixed(3).replace(".", "\\.")}`));
  for (const [slug, offer] of Object.entries(subscriptionPricing.offers)) {
    if (slug === "midjourney") continue;
    if (offer.officialUsd) assert.ok(html.includes(expectedCny(offer.officialUsd)), `官方价格应使用同步汇率换算：${offer.officialUsd}`);
  }
  for (const oldPrice of ["$5.77", "$8.99", "$24.49", "$10.49", "$27.99", "$45.99", "$34.99", "$58.99", "$98.99", "$89.99", "$171.99"]) {
    assert.doesNotMatch(html, new RegExp(oldPrice.replace("$", "\\$")), `过期人工价格不应继续显示：${oldPrice}`);
  }
  assert.equal((html.match(/class="price-option-link"/g) || []).length, 0, "超过14天的人工套餐按钮应隐藏");
  for (const synced of autoSync.gamsgo.filter((item) => ["ok", "price-changed", "stale"].includes(item.state) && item.published && item.slug !== "midjourney")) {
    const currency = synced.published.currency === "USD" ? "US$" : synced.published.currency === "SGD" ? "S$" : synced.published.currency;
    assert.ok(html.includes(`${currency}${synced.published.value.toFixed(2)} / 月公开起价`), `${synced.slug} 应显示本轮安全读取到的公开起价`);
  }
  const visibleSyncedOffers = autoSync.gamsgo.filter((item) => item.slug !== "midjourney");
  const stateMessages = [
    ["conflict", /同一公开页面出现多个互相冲突的月付价格；本站已隐藏数字/],
    ["unreadable", /公开页面暂时无法稳定读取月付价格；不要把旧价格当作当前价格/],
    ["price-change-pending", /读取到价格明显变化，正在等待第二次一致结果；为避免误导，暂时隐藏具体数字/],
    ["stale", /本轮能打开商家页面，但没有提取出稳定价格；展示 .+ 最近一次成功核验的价格/],
  ];
  for (const [state, message] of stateMessages) {
    if (visibleSyncedOffers.some((item) => item.state === state)) assert.match(html, message);
    else assert.doesNotMatch(html, message);
  }
  assert.match(html, /https:\/\/x\.ai\/pricing/);
  assert.match(html, /https:\/\/www\.gamsgo\.com\/zh\/details\/gemini\/partner\/BTzCM/);
  assert.match(html, /https:\/\/www\.gamsgo\.com\/zh\/details\/perplexity_ai\/partner\/BTzCM/);
  for (const text of ["市场中心是什么？", "市场中心是多卖家交易区", "GamsGo 当前购买页", "比较不同商品与卖家"]) {
    assert.match(html, new RegExp(text.replace(/[.$?]/g, "\\$&")));
  }
  assert.match(html, /https:\/\/www\.gamsgo\.com\/zh\/accounts\/claude\/partner\/BTzCM/);
  assert.doesNotMatch(html, /https:\/\/www\.gamsgo\.com\/zh\/details\/claude\/partner\/BTzCM/);
  for (const text of ["准备一个能够正常接收验证码的邮箱", "用自己能够长期访问的邮箱", "先领优惠，再完成首次登录", "RWSY8", "复制优惠码", "在“我的订阅”找到订单", "选择邮箱登录", "获取链接/代码", "输入验证码，完成登录"]) {
    assert.match(html, new RegExp(text.replace(/[?？]/g, ".")));
  }
  for (const image of ["gamsgo-coupon-entry.png", "gamsgo-coupon-checkout.png", "gamsgo-get-code.png", "chatgpt-email-login.png", "chatgpt-password.png", "chatgpt-verification.png", "gamsgo-hidden-code.png"]) {
    assert.match(html, new RegExp(`/guides/subscriptions/${image.replace(".", "\\.")}`));
  }
  assert.match(html, /什么情况下会考虑第三方购买？/);
  assert.doesNotMatch(html, /为什么有人通过 GamsGo 订阅？/);
  assert.doesNotMatch(html, /id="before-buy"|付款前先算价值|下单前逐项确认|这个会员对你真的值得吗/);
  const zoomLinks = html.match(/<a[^>]+class="figure-zoom-link"[^>]+>点击查看大图 ↗<\/a>/g) || [];
  assert.equal(zoomLinks.length, 7);
  for (const link of zoomLinks) {
    assert.match(link, /href="[^\"]*\/guides\/subscriptions\/[^\"]+\.png"/);
    assert.match(link, /target="_blank"/);
  }
  assert.doesNotMatch(html, /class="official-action" href="https:\/\/grok\.com\/"/);
  assert.doesNotMatch(html, /<h2>Midjourney<\/h2>|中风险 · 涉及访问密钥|高风险 ·|先看产品教程|<dt>地区<\/dt>|下单前必须确认|未作独立审计|<small class="inline-disclosure">|三种交付方式，使用体验不同|付款前一分钟检查|安全购买流程/);
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

test("站点地图使用分页面更新时间，PWA清单包含标准与maskable图标", async () => {
  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  const lastModifiedValues = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]);
  assert.ok(lastModifiedValues.length >= 20, "站点地图应为主要页面提供更新时间");
  assert.ok(new Set(lastModifiedValues).size >= 3, "站点地图不应给所有页面写同一个更新时间");

  const manifestResponse = await render("/manifest.webmanifest");
  assert.equal(manifestResponse.status, 200);
  const manifest = await manifestResponse.text();
  for (const icon of ["icon-192.png", "icon-512.png", "icon-maskable-512.png"]) assert.match(manifest, new RegExp(icon.replace(".", "\\.")));
  assert.match(manifest, /maskable/);
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
    assert.match(html, /入口检查/);
    assert.match(html, /资料复核/);
    assert.match(html, /TechArticle/);
  }
  const midjourney = await (await render("/ai/midjourney")).text();
  for (const text of ["三个真实使用场景", "选择你的设备，只走官方入口", "先看官方界面", "模型与评测：需要时再看", "五组可以直接复制的提示词", "隐私", "Midjourney Docs"]) {
    assert.match(midjourney, new RegExp(text), `midjourney 缺少 ${text}`);
  }
  assert.match(midjourney, /\/guides\/midjourney\/official-1\.png/);
  assert.match(midjourney, /\/editorial\/midjourney\.webp/);
  assert.match(midjourney, /Midjourney V8\.2/);
  assert.doesNotMatch(midjourney, /Midjourney V8\.1/);

  const chatgpt = await (await render("/ai/chatgpt")).text();
  assert.match(chatgpt, /ChatGPT Instant（动态更新）/);
  assert.match(chatgpt, /GPT-5\.6 Sol/);
  assert.doesNotMatch(chatgpt, /GPT-5\.5 Instant|GPT-5\.6 Sol Pro/);

  const claude = await (await render("/ai/claude")).text();
  for (const model of ["Claude Fable 5", "Claude Opus 5", "Claude Sonnet 5", "Claude Haiku 4.5"]) assert.match(claude, new RegExp(model.replace(".", "\\.")));
  assert.doesNotMatch(claude, /Claude Opus 4\.8/);

  const perplexity = await (await render("/ai/perplexity")).text();
  for (const model of ["GPT-5.6 Terra / Sol", "Gemini 3.1 Pro", "Claude Sonnet 5 / Opus 5"]) assert.match(perplexity, new RegExp(model.replaceAll(".", "\\.")));
});

test("AI与应用列表按要求移除说明条、Midjourney和后续两个冗余章节", async () => {
  const html = await (await render("/ai")).text();
  for (const product of ["ChatGPT", "Claude", "Gemini", "Grok", "Perplexity"]) assert.match(html, new RegExp(product));
  for (const removed of ["品牌图标来自品牌官方资料", "<h2>Midjourney</h2>", "<strong>Midjourney</strong>", "付费前先做一次真实测试", "评测怎么看才不会被误导"]) assert.doesNotMatch(html, new RegExp(removed));
});

test("AI与应用对照表下方提供三项常用应用的完整介绍卡片", async () => {
  const html = await (await render("/ai")).text();
  assert.match(html, /三项常用应用：先按你想看的内容选择/);
  for (const [name, slug] of [["YouTube", "youtube"], ["X", "x"], ["TikTok", "tiktok"]]) {
    assert.match(html, new RegExp(`<h2>${name}</h2>`));
    assert.match(html, new RegExp(`href="/apps/${slug}"`));
  }
  assert.match(html, /YouTube不只是娱乐视频/);
  assert.match(html, /X适合追踪实时公开信息/);
  assert.match(html, /TikTok是面向国际市场的短视频与直播平台/);
  assert.ok(html.indexOf("只看这一张表，也能先做出选择") < html.indexOf("三项常用应用：先按你想看的内容选择"));
});

test("新手决策、商店地区、状态与反馈功能都能解释边界", async () => {
  const home = await (await render("/")).text();
  for (const text of ["第一次看到“机场”和“节点”", "拿自己的事试一次", "榜单可以参考"]) assert.match(home, new RegExp(text));
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
    assert.match(html, /入口检查/);
    assert.match(html, /资料复核/);
  }
});

test("下载中心提供官方文件直链和带SHA-256的开源备用文件", async () => {
  const html = await (await render("/downloads")).text();
  assert.match(html, /当前版开源客户端，直接给出对应的官方文件/);
  assert.match(html, /Clash\.Verge_2\.5\.2_x64-setup\.exe/);
  assert.match(html, /v2rayN-windows-64-desktop\.zip/);
  assert.match(html, /https:\/\/github\.com\/2dust\/v2rayN\/releases\/download\/7\.24\.4\/v2rayN-windows-64-desktop\.zip/);
  assert.match(html, /FlClash-0\.8\.94-android-arm64-v8a\.apk/);
  assert.match(html, /Hiddify-Windows-Setup-x64-v4\.1\.1\.exe/);
  assert.match(html, /SHA-256/);
  assert.match(html, /许可证/);
});

test("机场页面直接从基础概念进入服务推荐并提供三类下载入口", async () => {
  const nodes = await (await render("/nodes")).text();
  assert.match(nodes, /五个词，第一次看到也能懂/);
  assert.match(nodes, /<h1[^>]*>五个词，第一次看到也能懂<\/h1>/);
  assert.ok(nodes.indexOf("五个词，第一次看到也能懂") < nodes.indexOf("先看核验状态，再按预算和购买周期缩小范围"));
  assert.match(nodes, /本站已校验备用文件/);
  assert.match(nodes, /v2rayN-windows-64-desktop\.zip/);
  assert.match(nodes, /直接下载官方文件/);
  assert.match(nodes, /126\.3 MB/);
  assert.match(nodes, /使用教程/);
  assert.match(nodes, /id="troubleshoot"/);
  assert.match(nodes, /导入、连接或入口异常时，按症状逐步检查/);
  assert.match(nodes, /href="\/mirror\/Clash\.Verge_2\.5\.2_x64-setup\.exe"/);
  assert.doesNotMatch(nodes, /本地下载暂不提供 · 官方文件超过托管限制/);
  for (const removed of ["它可能帮助你", "第一次购买与连接清单", "先看症状，再决定要不要重装", "先看需求，不要先看广告词", "页面证据", "地址状态", "把“证据”放在推荐前面", "GamsGo 内容独立整理"]) {
    assert.doesNotMatch(nodes, new RegExp(removed));
  }
  const subscriptions = await (await render("/subscriptions")).text();
  assert.match(subscriptions, /下单前，先问清四件事/);
  assert.match(subscriptions, /先选产品，再比较购买方式/);
  for (const removed of ["AI订阅：购买前先看账号归属", "本页编辑责任与复核范围", "为什么首批选择这六项", "AI会员付款前清单", "三种交付方式，使用体验不同", "安全购买流程"]) assert.doesNotMatch(subscriptions, new RegExp(removed.replace(/[/.]/g, "\\$&")));
});

test("模型评测页面解释两套榜单并展示自动同步的Artificial Analysis前十", async () => {
  const html = await (await render("/benchmarks")).text();
  for (const text of ["Arena", "Artificial Analysis", "真人盲测", "API成本", "不合并成本站自制总分", "能力指数", "输出速度", "首段延迟", "上下文长度", "自动同步正常", "最近成功读取", "先看每家公司的一个代表模型", "保留原始名次"]) assert.match(html, new RegExp(text));
  const snapshot = JSON.parse(await readFile(new URL("../data/auto-sync.json", import.meta.url), "utf8"));
  const topTen = snapshot.artificialAnalysisLeaderboard.rows.slice(0, 10);
  assert.equal(topTen.length, 10);
  for (const model of topTen) assert.match(html, new RegExp(model.model.replace(/[()\[\].+*?^$|]/g, "\\$&")));
  assert.doesNotMatch(html, /第一版收录八个主流模型家族/);
  assert.doesNotMatch(html, /不想研究参数，可以这样选/);
});

test("全站导航与三个项目一致，AI相关页面归入同一个二级导航", async () => {
  const home = await (await render("/")).text();
  for (const label of ["首页", "机场指南", "AI与应用", "模型评测"]) assert.match(home, new RegExp(`>${label}<`));
  const ai = await (await render("/ai")).text();
  for (const label of ["AI介绍", "AI订阅", "常用应用", "下载中心"]) assert.match(ai, new RegExp(`>${label}<`));
  assert.match(ai, /AI与应用项目导航/);
  assert.match(ai, /AI与应用四个入口/);
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
