import { aiProducts, commonApps, subscriptionOffers } from "./catalog";

export type SearchEntry = { title: string; href: string; category: string; description: string; keywords: string[] };

const coreEntries: SearchEntry[] = [
  { title: "机场与网络服务指南", href: "/nodes", category: "机场指南", description: "套餐、月付价格、流量、付款、客户端、入口和大陆网络核验状态。", keywords: ["机场", "节点", "订阅", "Clash", "客户端", "Nexitally", "TAG", "悠兔", "BoostNet", "WestData"] },
  { title: "GamsGo AI订阅", href: "/subscriptions", category: "AI订阅", description: "官方价格、商家公开价、本人充值、交付账号、共享网页和隐私风险。", keywords: ["GamsGo", "充值", "共享", "账号", "价格", "付款", "退款"] },
  { title: "官方下载中心", href: "/downloads", category: "下载", description: "按Windows、macOS、Android、iOS和网页端查找官方入口。", keywords: ["下载", "Windows", "Mac", "Android", "iPhone", "App Store", "Google Play"] },
  { title: "核验方法", href: "/methodology", category: "网站说明", description: "资料优先级、自动同步、价格保护、评测来源和状态标签。", keywords: ["核验", "来源", "Arena", "Artificial Analysis", "自动同步"] },
  { title: "常见问题", href: "/faq", category: "帮助", description: "新手最常问的网络、账号、付款、安装、地区和隐私问题。", keywords: ["FAQ", "问题", "打不开", "安装", "账号", "地区"] },
  { title: "隐私说明", href: "/privacy", category: "网站说明", description: "本站收集什么、不收集什么，以及访问第三方网站时的隐私边界。", keywords: ["隐私", "密码", "验证码", "统计", "数据"] },
  { title: "推广关系说明", href: "/disclosure", category: "网站说明", description: "推广链接、排序原则、佣金边界与购买责任。", keywords: ["推广", "返佣", "佣金", "合作", "affiliate"] },
  { title: "更新记录", href: "/changelog", category: "网站说明", description: "查看网站的重要内容、设计、数据和发布更新。", keywords: ["更新", "记录", "版本", "变更"] },
];

export const searchEntries: SearchEntry[] = [
  ...coreEntries,
  ...aiProducts.map((item) => ({ title: `${item.name}小白教程`, href: `/ai/${item.slug}`, category: "AI教程", description: item.tagline, keywords: [item.name, item.company, ...item.capabilities, ...item.bestFor] })),
  ...commonApps.map((item) => ({ title: `${item.name}安装与使用`, href: `/apps/${item.slug}`, category: "常用应用", description: item.tagline, keywords: [item.name, item.company, ...item.safety] })),
  ...subscriptionOffers.map((item) => ({ title: item.name, href: "/subscriptions", category: "AI订阅", description: item.useCase, keywords: [item.name, item.deliveryType, item.riskLabel, item.payment] })),
];
