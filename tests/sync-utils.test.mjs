import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { cnyValue, decidePublishedPrice, describeExecError, hasCompleteReleaseAsset, isAllowedOfficialDownload, mapWithConcurrency, normalizePriceToUsd, parseArtificialAnalysisLeaderboard, parseGamsgoPrice, parseLatestReleaseUrl, retainGamsgoSnapshot, retainReleaseSnapshot } from "../scripts/sync-utils.mjs";

test("订阅美元价格只维护一份数据，人民币换算使用同步汇率并覆盖全部购买链接", async () => {
  const pricing = JSON.parse(await readFile(new URL("../data/subscription-pricing.json", import.meta.url), "utf8"));
  assert.equal(pricing.usdCnyRate, 6.823);
  const offers = Object.values(pricing.offers);
  const options = offers.flatMap((offer) => offer.options || []);
  assert.equal(pricing.offers.claude.options, undefined, "Claude旧商品页迁移后不得保留过期人工套餐");
  assert.ok(options.length >= 11);
  for (const option of options) {
    assert.ok(option.usd > 0);
    assert.equal(new URL(option.url).hostname, "www.gamsgo.com");
    assert.match(option.url, /partner\/(?:BTzCM|2MGZTK)/);
  }
  const syncSource = await readFile(new URL("../scripts/sync-public-data.mjs", import.meta.url), "utf8");
  assert.match(syncSource, /loadSubscriptionPurchaseLinks/);
  assert.match(syncSource, /subscription-purchase/);
  assert.match(syncSource, /mapWithConcurrency\(gamsgoLinks, 2/);
  assert.match(syncSource, /mapWithConcurrency\(gamsgoOffers, 1/);
  assert.match(syncSource, /--http1\.1/);
  const catalogSource = await readFile(new URL("../data/catalog.ts", import.meta.url), "utf8");
  assert.match(catalogSource, /autoSync\.exchange\?\.rates\?\.CNY/);
  assert.match(catalogSource, /subscriptionPricing\.usdCnyRate/);
});

test("手机端AI与应用卡片的最终规则保持单列", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const desktopRule = css.lastIndexOf(".ai-card-grid { grid-template-columns: repeat(3,minmax(0,1fr)); }");
  const mobileRule = css.lastIndexOf(".ai-card-grid,.app-card-grid,.common-app-feature-grid");
  assert.ok(desktopRule >= 0);
  assert.ok(mobileRule > desktopRule, "手机单列规则必须位于最后的桌面三列规则之后");
  assert.match(css.slice(mobileRule), /grid-template-columns:\s*minmax\(0,1fr\)\s*!important/);
  assert.match(css.slice(mobileRule), /word-break:\s*normal/);
});

test("Artificial Analysis 榜单解析会同时读取能力、成本、速度和延迟", () => {
  const html = `<table><tbody>
    <tr><td><div class="font-semibold border-l-4 pl-2">Model A<span><svg></svg></span></div></td><td><div class="text-center">1M</div></td><td><img alt="Company A" /></td><td><div class="text-center">60</div></td><td><div class="text-center">$7.70</div></td><td><div class="text-center">66</div></td><td><div class="text-center">148.11</div></td><td><div class="text-center">155.74</div></td></tr>
    <tr><td><div class="font-semibold border-l-4 pl-2">Model B</div></td><td><div class="text-center">500k</div></td><td><img alt="Company B" /></td><td><div class="text-center">57</div></td><td><div class="text-center">$2.31</div></td><td><div class="text-center">62</div></td><td><div class="text-center">1.99</div></td><td><div class="text-center">42.30</div></td></tr>
  </tbody></table>`;
  assert.deepEqual(parseArtificialAnalysisLeaderboard(html), [
    { rank: 1, model: "Model A", company: "Company A", contextWindow: "1M", intelligence: 60, priceUsdPerMillion: 7.7, outputTokensPerSecond: 66, latencySeconds: 148.11, totalResponseSeconds: 155.74 },
    { rank: 2, model: "Model B", company: "Company B", contextWindow: "500k", intelligence: 57, priceUsdPerMillion: 2.31, outputTokensPerSecond: 62, latencySeconds: 1.99, totalResponseSeconds: 42.3 },
  ]);
});

test("价格解析同时校验币种、周期与正数", () => {
  const html = "<div>Official Price $30.00 /month vs GamsGo Special $6.17 /month</div>";
  assert.deepEqual(parseGamsgoPrice(html), {
    official: { currency: "USD", value: 30 },
    special: { currency: "USD", value: 6.17 },
    period: "month",
  });
  assert.equal(parseGamsgoPrice("Official Price $30 /year vs GamsGo Special $6 /year"), null);
  assert.equal(parseGamsgoPrice("Official Price $30 /month vs GamsGo Special $0 /month"), null);
});

test("同一商家页面出现多个互相冲突的月付价时停止自动发布", () => {
  const html = '<script>"service_ids":1247},86,"Grok","grok","image.webp","15.00","90.00","3.00","$","USD($)"</script><p>GamsGo SuperGrok $18.99/月</p><p>GamsGo 购买的价格为 18.99 美元/月</p>';
  const parsed = parseGamsgoPrice(html, {
    embeddedProduct: true,
    conflictPatterns: [/GamsGo SuperGrok\s*\$\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*月/gi, /GamsGo 购买的价格为\s*([0-9]+(?:[.,][0-9]+)?)\s*美元\s*\/\s*月/gi],
  });
  assert.equal(parsed.conflict, true);
  assert.deepEqual(parsed.observedValues, [15, 18.99]);
});

test("嵌入商品数据优先读取月价、官方总价与套餐月数", () => {
  const samples = [
    ['"service_ids":1244},"5.00","60.00","3.00","$","USD($)"', 5, 20, 3],
    ['"service_ids":1177},"claude","87.99","120.00","1.00","$","USD($)"', 87.99, 120, 1],
    ['"service_ids":1238},145,"gemini","image.webp","2.25","79.99","12.00","$","USD($)"', 2.25, 6.67, 12],
  ];
  for (const [html, special, official, months] of samples) {
    assert.deepEqual(parseGamsgoPrice(html, { embeddedProduct: true }), {
      official: { currency: "USD", value: official },
      special: { currency: "USD", value: special },
      period: "month",
      offerDurationMonths: months,
    });
  }
});

test("新版Nuxt结构化数据会读取页面最低月付价并按公开汇率统一为美元", () => {
  const payload = JSON.stringify([
    { type_name: 1, detail_route: 2, min_price: 3, original_price: 4, min_price_sku_month: 5, currency_icon1: 6, currency_icon2: 7 },
    "ChatGPT", "chatgpt", "795", "9542", "477", "￥", "JPY(￥)",
  ]);
  const parsed = parseGamsgoPrice(`<script type="application/json" id="__NUXT_DATA__">${payload}</script>`, {
    embeddedProduct: true,
    detailRoute: "chatgpt",
    official: { currency: "USD", value: 20 },
  });
  assert.deepEqual(parsed, {
    official: { currency: "USD", value: 20 },
    special: { currency: "JPY", value: 795 },
    period: "month",
    offerDurationMonths: 1,
    sourceMethod: "nuxt-structured-min-price",
  });
  const exchange = { state: "ok", rates: { CNY: 6.7227, JPY: 159.12 } };
  assert.deepEqual(normalizePriceToUsd(parsed.special, exchange), { currency: "USD", value: 5 });
  assert.equal(cnyValue(parsed.special, exchange), 33.61);
});

test("可用产品专用语句读取公开月付价", () => {
  const parsed = parseGamsgoPrice("Buy ChatGPT Plus subscription for just $17.99 per month", {
    specialPattern: /ChatGPT Plus(?: subscription| plan)?\s*(?:on GamsGo\s*)?(?:for just|costs just|costs)?\s*(US\$|S\$|\$|€|£)?\s*([0-9]+(?:[.,][0-9]+)?)\s*(?:per month|\/\s*month)/i,
    official: { currency: "USD", value: 20 },
  });
  assert.deepEqual(parsed, {
    official: { currency: "USD", value: 20 },
    special: { currency: "USD", value: 17.99 },
    period: "month",
  });
});

test("价格暴涨或暴跌必须连续两次一致才发布", () => {
  const previous = { state: "ok", published: { currency: "USD", value: 20 }, candidate: null, candidateSeenCount: 0 };
  const first = decidePublishedPrice(previous, { currency: "USD", value: 6 });
  assert.equal(first.state, "price-change-pending");
  assert.deepEqual(first.published, previous.published);
  const second = decidePublishedPrice(first, { currency: "USD", value: 6 });
  assert.equal(second.state, "price-changed");
  assert.deepEqual(second.published, { currency: "USD", value: 6 });
});

test("价格重新读取成功后清除上次失败的诊断字段", () => {
  const previous = {
    state: "unreadable",
    published: { currency: "USD", value: 5 },
    error: "Error; code=28",
    note: "页面读取失败",
    checkedAt: "2026-08-09T00:00:00.000Z",
  };
  const next = decidePublishedPrice(previous, { currency: "USD", value: 5 });
  assert.deepEqual(next, {
    state: "ok",
    published: { currency: "USD", value: 5 },
    candidate: null,
    candidateSeenCount: 0,
  });
});

test("页面失效或字段缺失时标记不可读", () => {
  const previous = { state: "ok", published: { currency: "USD", value: 10 } };
  const next = decidePublishedPrice(previous, null);
  assert.equal(next.state, "unreadable");
});

test("官方下载白名单阻止第三方安装包", () => {
  assert.equal(isAllowedOfficialDownload("https://play.google.com/store/apps/details?id=com.openai.chatgpt"), true);
  assert.equal(isAllowedOfficialDownload("https://claude.com/download"), true);
  assert.equal(isAllowedOfficialDownload("https://github.com/clash-verge-rev/clash-verge-rev/releases/latest"), true);
  assert.equal(isAllowedOfficialDownload("https://example-download.invalid/app.apk"), false);
});

test("GitHub发布接口受限时可从官方Latest跳转恢复版本", () => {
  assert.equal(parseLatestReleaseUrl("https://github.com/2dust/v2rayN/releases/tag/7.24.4", "2dust/v2rayN"), "7.24.4");
  assert.equal(parseLatestReleaseUrl("https://github.com/hiddify/hiddify-app/releases/tag/v4.1.1", "hiddify/hiddify-app"), "v4.1.1");
  assert.equal(parseLatestReleaseUrl("https://example.com/2dust/v2rayN/releases/tag/7.24.4", "2dust/v2rayN"), null);
});

test("GitHub接口临时受限时保留同版本最近一次可信文件", () => {
  const previous = {
    repository: "owner/project",
    state: "ok",
    version: "v1.2.3",
    releaseUrl: "https://github.com/owner/project/releases/tag/v1.2.3",
    assetName: "project.exe",
    assetSize: 123,
    assetUrl: "https://github.com/owner/project/releases/download/v1.2.3/project.exe",
    assetSha256: "A".repeat(64),
    assetVerifiedAt: "2026-08-09T00:00:00.000Z",
  };
  assert.equal(hasCompleteReleaseAsset(previous), true);
  const retained = retainReleaseSnapshot(previous, {
    repository: "owner/project",
    version: "v1.2.3",
    releaseUrl: previous.releaseUrl,
    error: "API rate limited",
  });
  assert.equal(retained.state, "stale");
  assert.equal(retained.assetUrl, previous.assetUrl);
  assert.equal(retained.assetSha256, previous.assetSha256);
});

test("检测到新版本但拿不到文件元数据时阻止沿用旧版本发布", () => {
  const previous = {
    repository: "owner/project",
    state: "ok",
    version: "v1.2.3",
    assetName: "project.exe",
    assetSize: 123,
    assetUrl: "https://github.com/owner/project/releases/download/v1.2.3/project.exe",
    assetSha256: "B".repeat(64),
  };
  const retained = retainReleaseSnapshot(previous, {
    repository: "owner/project",
    version: "v1.2.4",
    releaseUrl: "https://github.com/owner/project/releases/tag/v1.2.4",
  });
  assert.equal(retained.state, "error");
  assert.equal(retained.version, "v1.2.3");
  assert.equal(retained.detectedVersion, "v1.2.4");
});

test("批量链接检查限制并发并保持原顺序", async () => {
  let active = 0;
  let maximumActive = 0;
  const values = await mapWithConcurrency([1, 2, 3, 4, 5], 2, async (value) => {
    active += 1;
    maximumActive = Math.max(maximumActive, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active -= 1;
    return value * 2;
  });
  assert.deepEqual(values, [2, 4, 6, 8, 10]);
  assert.equal(maximumActive, 2);
});

test("命令失败会保留可诊断信息并清除敏感地址", () => {
  const detail = describeExecError({
    name: "Error",
    code: 28,
    signal: "SIGTERM",
    stderr: "curl: (28) timed out at https://example.com/path?token=secret\n",
  });
  assert.match(detail, /Error; code=28; signal=SIGTERM; curl: \(28\) timed out at \[url\]/);
  assert.doesNotMatch(detail, /secret|example\.com/);
});

test("商家整批拦截时最多保留7天内最近可信价格", () => {
  const previous = {
    slug: "chatgpt-recharge",
    state: "ok",
    published: { currency: "USD", value: 5 },
    cny: 33.74,
    checkedAt: "2026-08-09T10:00:00.000Z",
    period: "month",
    offerDurationMonths: 3,
  };
  const failed = {
    slug: "chatgpt-recharge",
    state: "unreadable",
    published: previous.published,
    checkedAt: "2026-08-09T12:00:00.000Z",
    error: "Error; code=22; curl: (22) HTTP 403",
  };
  const retained = retainGamsgoSnapshot(previous, failed, Date.parse(failed.checkedAt));
  assert.equal(retained.state, "stale");
  assert.equal(retained.lastSuccessfulAt, previous.checkedAt);
  assert.deepEqual(retained.published, previous.published);
  assert.match(retained.note, /最近一次成功核验/);

  const expired = retainGamsgoSnapshot(previous, failed, Date.parse(previous.checkedAt) + 8 * 24 * 60 * 60 * 1000);
  assert.equal(expired.state, "unreadable");
});

test("页面可以打开但结构变化导致价格解析失败时仍保留7天内最近可信价格", () => {
  const previous = {
    slug: "gemini",
    state: "ok",
    published: { currency: "USD", value: 2.25 },
    cny: 15.17,
    checkedAt: "2026-08-11T10:00:00.000Z",
    period: "month",
    offerDurationMonths: 12,
  };
  const unreadable = {
    slug: "gemini",
    state: "unreadable",
    published: previous.published,
    checkedAt: "2026-08-13T10:00:00.000Z",
    note: "公开页未稳定展示可校验的月付价格",
  };
  const retained = retainGamsgoSnapshot(previous, unreadable, Date.parse(unreadable.checkedAt));
  assert.equal(retained.state, "stale");
  assert.deepEqual(retained.published, previous.published);
  assert.equal(retained.lastSuccessfulAt, previous.checkedAt);
  assert.match(retained.note, /能打开商家页面/);
});

test("连续读取失败不会重复追加价格冲突说明", () => {
  const previous = {
    slug: "grok",
    state: "conflict",
    checkedAt: "2026-08-11T10:00:00.000Z",
    observedValues: [15, 18.99],
    note: "同一公开页面出现多个互相冲突的月付价格，已隐藏数字并转入人工复核；本轮没有提取出稳定价格，保留最近一次冲突证据；本轮没有提取出稳定价格，保留最近一次冲突证据",
  };
  const current = {
    slug: "grok",
    state: "unreadable",
    checkedAt: "2026-08-13T10:00:00.000Z",
    note: "公开页未稳定展示可校验的月付价格",
  };
  const retained = retainGamsgoSnapshot(previous, current, Date.parse(current.checkedAt));
  assert.equal(retained.state, "conflict");
  assert.equal((retained.note.match(/本轮没有提取出稳定价格/g) || []).length, 1);
});

test("定时发布在构建前执行文案与资料新鲜度门禁", async () => {
  const workflow = await readFile(new URL("../.github/workflows/deploy-github-pages.yml", import.meta.url), "utf8");
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const copyGate = await readFile(new URL("../scripts/lint-editorial-copy.mjs", import.meta.url), "utf8");
  const preflightGate = await readFile(new URL("../scripts/preflight-publication.mjs", import.meta.url), "utf8");
  assert.match(workflow, /cron: "17 \*\/6 \* \* \*"/);
  assert.ok(workflow.indexOf("npm run lint:copy") < workflow.indexOf("npm run build"));
  assert.match(packageJson.scripts["verify:publish"], /lint:copy/);
  assert.match(copyGate, /发布上限为 45 天/);
  assert.match(copyGate, /推广入口已自动核验/);
  assert.match(preflightGate, /link\.kind === "client"/);
  assert.match(preflightGate, /客户端直链未通过安全核验，禁止发布/);
  assert.match(preflightGate, /证书域名不匹配的旧客户端下载地址/);
  const syncSource = await readFile(new URL("../scripts/sync-public-data.mjs", import.meta.url), "utf8");
  assert.match(syncSource, /https:\/\/666\.youtu6\.shop\/#downloads/);
  assert.doesNotMatch(syncSource, /d\.yoututz\.top/);
});
