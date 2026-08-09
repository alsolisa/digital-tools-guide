import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { decidePublishedPrice, isAllowedOfficialDownload, mapWithConcurrency, parseArtificialAnalysisLeaderboard, parseGamsgoPrice, parseLatestReleaseUrl } from "../scripts/sync-utils.mjs";

test("订阅美元价格只维护一份数据，人民币换算使用同步汇率并覆盖全部购买链接", async () => {
  const pricing = JSON.parse(await readFile(new URL("../data/subscription-pricing.json", import.meta.url), "utf8"));
  assert.equal(pricing.usdCnyRate, 6.823);
  const offers = Object.values(pricing.offers);
  const options = offers.flatMap((offer) => offer.options || []);
  assert.ok(options.length >= 12);
  for (const option of options) {
    assert.ok(option.usd > 0);
    assert.equal(new URL(option.url).hostname, "www.gamsgo.com");
    assert.match(option.url, /partner\/(?:BTzCM|2MGZTK)/);
  }
  const syncSource = await readFile(new URL("../scripts/sync-public-data.mjs", import.meta.url), "utf8");
  assert.match(syncSource, /loadSubscriptionPurchaseLinks/);
  assert.match(syncSource, /subscription-purchase/);
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
  const html = "<div>Official Price $30 /month vs GamsGo Special $6.17 /month</div><p>SuperGrok on GamsGo $18.99 per month</p><p>GamsGo SuperGrok $17.99/month</p>";
  const parsed = parseGamsgoPrice(html, {
    conflictPatterns: [/(?:GamsGo|SuperGrok)[^$]{0,90}\$\s*([0-9]+(?:[.,][0-9]+)?)\s*(?:per month|\/\s*month)/gi],
  });
  assert.equal(parsed.conflict, true);
  assert.deepEqual(parsed.observedValues, [6.17, 18.99, 17.99]);
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

test("页面失效或字段缺失时标记不可读", () => {
  const previous = { state: "ok", published: { currency: "USD", value: 10 } };
  const next = decidePublishedPrice(previous, null);
  assert.equal(next.state, "unreadable");
});

test("官方下载白名单阻止第三方安装包", () => {
  assert.equal(isAllowedOfficialDownload("https://play.google.com/store/apps/details?id=com.openai.chatgpt"), true);
  assert.equal(isAllowedOfficialDownload("https://github.com/clash-verge-rev/clash-verge-rev/releases/latest"), true);
  assert.equal(isAllowedOfficialDownload("https://example-download.invalid/app.apk"), false);
});

test("GitHub发布接口受限时可从官方Latest跳转恢复版本", () => {
  assert.equal(parseLatestReleaseUrl("https://github.com/2dust/v2rayN/releases/tag/7.24.4", "2dust/v2rayN"), "7.24.4");
  assert.equal(parseLatestReleaseUrl("https://github.com/hiddify/hiddify-app/releases/tag/v4.1.1", "hiddify/hiddify-app"), "v4.1.1");
  assert.equal(parseLatestReleaseUrl("https://example.com/2dust/v2rayN/releases/tag/7.24.4", "2dust/v2rayN"), null);
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
