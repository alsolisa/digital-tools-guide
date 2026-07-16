import assert from "node:assert/strict";
import test from "node:test";
import { decidePublishedPrice, isAllowedOfficialDownload, parseGamsgoPrice } from "../scripts/sync-utils.mjs";

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
