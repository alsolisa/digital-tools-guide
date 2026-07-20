import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

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
  for (const text of ["看懂机场，选择服务并安装客户端", "先选AI，再决定是否订阅或安装", "看懂当前主流模型和评测结果"]) assert.match(home, new RegExp(text));
  assert.doesNotMatch(home, /先看懂五个词，再选择服务|按预算直接选/);
  const nodes = await (await render("/nodes")).text();
  for (const term of ["VPN", "机场", "节点", "客户端", "订阅链接"]) assert.match(nodes, new RegExp(term));
  assert.match(nodes, /为什么提供这几家/);
  const subscriptions = await (await render("/subscriptions")).text();
  assert.match(subscriptions, /先认识 GamsGo，再选择适合自己的 AI 订阅/);
  for (const text of ["最高可节省 85%", "7×24 小时在线客服", "1000 万+", "支付宝", "先看清套餐，再决定购买"]) assert.match(subscriptions, new RegExp(text));
  for (const removed of ["先判断要不要买，再决定去哪里买", "这个会员对你真的值得吗", "GamsGo是什么？为什么有人会选择它？", "为什么首批选择这六项？"]) assert.doesNotMatch(subscriptions, new RegExp(removed.replace(/[?？]/g, ".")));
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
  assert.match(html, /易支付（支付宝）、USDT-TRC20/);
});

test("GamsGo订阅卡片提供清楚价格、付款、售后与推广购买入口", async () => {
  const html = await (await render("/subscriptions")).text();
  for (const name of ["ChatGPT Plus", "Claude Pro / Max", "Gemini / Google AI Pro", "SuperGrok", "Perplexity Pro"]) {
    assert.match(html, new RegExp(name.replace(/[+\/]/g, "\\$&")));
  }
  for (const price of ["$5.77", "$8.99", "$24.49"]) assert.match(html, new RegExp(price.replace("$", "\\$")));
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
  for (const text of ["PRO · 3个月", "$10.49", "$3.50/月 · ¥23.88人民币/月 · 充值到自己的账号", "PRO · 12个月", "$27.99", "$2.34/月 · ¥15.97人民币/月 · 官方提供账号", "PRO · 18个月", "$45.99", "$2.56/月 · ¥17.47人民币/月 · 充值到自己的账号"]) {
    assert.match(html, new RegExp(text.replace(/[.$]/g, "\\$&")));
  }
  for (const text of ["$17.99 / 月", "$34.99", "$11.67/月", "$58.99", "$9.84/月", "$98.99", "$8.25/月"]) {
    assert.match(html, new RegExp(text.replace(/[.$]/g, "\\$&")));
  }
  assert.match(html, /1 USD = ¥<!-- -->6\.823/);
  for (const cny of ["¥136.46人民币", "¥39.37人民币", "¥61.34人民币", "¥167.10人民币", "¥614.00人民币", "¥1173.49人民币", "¥136.39人民币", "¥71.57人民币", "¥190.98人民币", "¥313.79人民币", "¥204.69人民币", "¥122.75人民币\/月", "¥115.99人民币", "¥238.74人民币", "¥402.49人民币", "¥675.41人民币"]) {
    assert.match(html, new RegExp(cny.replace(/[.¥/]/g, "\\$&")));
  }
  assert.doesNotMatch(html, /约 ¥/);
  assert.ok((html.match(/class="price-option-link"/g) || []).length >= 11, "每个套餐价格都应能点击购买");
  assert.match(html, /https:\/\/x\.ai\/pricing/);
  assert.match(html, /https:\/\/www\.gamsgo\.com\/zh\/details\/gemini\/partner\/BTzCM/);
  assert.match(html, /https:\/\/www\.gamsgo\.com\/zh\/details\/perplexity_ai\/partner\/BTzCM/);
  for (const text of ["Max 5x · 独享", "$89.99", "Max 20x · 独享", "$171.99", "市场中心是什么？", "市场中心是多卖家交易区", "购买 Max 5x / Max 20x", "比较不同卖家方案"]) {
    assert.match(html, new RegExp(text.replace(/[.$?]/g, "\\$&")));
  }
  assert.match(html, /https:\/\/www\.gamsgo\.com\/zh\/details\/claude\/partner\/BTzCM/);
  assert.match(html, /https:\/\/www\.gamsgo\.com\/zh\/accounts\/claude\/partner\/BTzCM/);
  for (const text of ["准备一个能够正常接收验证码的邮箱", "Gmail（谷歌邮箱）", "QQ邮箱", "网易163邮箱", "先领优惠，再完成首次登录", "RWSY8", "复制优惠码", "在“我的订阅”找到订单", "选择邮箱登录", "获取链接/代码", "输入验证码，完成登录"]) {
    assert.match(html, new RegExp(text.replace(/[?？]/g, ".")));
  }
  for (const image of ["gamsgo-coupon-entry.png", "gamsgo-coupon-checkout.png", "gamsgo-get-code.png", "chatgpt-email-login.png", "chatgpt-password.png", "chatgpt-verification.png", "gamsgo-hidden-code.png"]) {
    assert.match(html, new RegExp(`/guides/subscriptions/${image.replace(".", "\\.")}`));
  }
  assert.match(html, /为什么要通过 GamsGo 订阅？/);
  assert.doesNotMatch(html, /为什么有人通过 GamsGo 订阅？/);
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
  for (const text of ["看懂机场，选择服务并安装客户端", "先选AI，再决定是否订阅或安装", "看懂当前主流模型和评测结果"]) assert.match(home, new RegExp(text));
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
  assert.match(subscriptions, /GamsGo 官方公开介绍/);
  assert.match(subscriptions, /AI订阅方案：先选产品，再选购买方式/);
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
