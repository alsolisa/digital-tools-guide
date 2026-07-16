import { aiProducts, commonApps, subscriptionOffers } from "./catalog";

export type SearchEntry = { title: string; href: string; category: string; description: string; keywords: string[] };

const coreEntries: SearchEntry[] = [
  { title: "VPN、机场与网络服务入门", href: "/nodes#basics", category: "网络连接", description: "先解释VPN、机场、节点、订阅链接和客户端，再进入套餐与价格比较。", keywords: ["VPN", "机场是什么", "节点", "订阅链接", "Clash", "客户端", "代理"] },
  { title: "机场服务比较", href: "/nodes#services", category: "网络连接", description: "已核验月付、流量、付款、客户端、入口和待复核字段。", keywords: ["Nexitally", "TAG", "悠兔", "BoostNet", "WestData", "月付", "流量"] },
  { title: "机场连接问题排查", href: "/nodes#troubleshoot", category: "网络连接", description: "按看不到节点、连接后没网、只有部分网站不可用和入口异常逐步排查。", keywords: ["连接失败", "没有节点", "订阅导入", "无法上网", "系统代理", "DNS", "入口跳转"] },
  { title: "GamsGo与AI订阅", href: "/subscriptions#before-buy", category: "AI订阅", description: "GamsGo是什么、为什么有人选择第三方、官方购买和账号交付有什么区别。", keywords: ["GamsGo", "官方购买", "第三方", "充值", "共享", "账号", "价格", "付款", "退款"] },
  { title: "官方下载与开源备用文件中心", href: "/downloads", category: "下载", description: "按Windows、macOS、Android、iOS和网页端查找官方入口；官方页面打不开时，可下载两项已公开版本与SHA-256的开源客户端备用文件。", keywords: ["下载", "备用下载", "安装包", "SHA-256", "Windows", "Mac", "Android", "iPhone", "App Store", "Google Play", "Clash", "FlClash", "Shadowrocket"] },
  { title: "Apple与Google应用商店地区教程", href: "/stores", category: "下载", description: "解释商店搜不到、账号地区、产品上架与设备兼容的区别，以及安全处理顺序。", keywords: ["App Store", "Google Play", "地区", "国家", "账号地区", "商店搜不到", "Apple ID", "Google账号"] },
  { title: "入口、价格与同步状态", href: "/status", category: "网站说明", description: "分开查看服务器自动检查、大陆真人实测、客户端版本和价格变化。", keywords: ["状态", "打不开", "价格冲突", "版本", "自动同步", "大陆网络", "家庭宽带", "手机流量", "电信", "联通", "移动", "历史"] },
  { title: "证据与编辑标准", href: "/standards", category: "网站说明", description: "查看证据等级、资料过期窗口、自动失效规则、推广边界、纠错与上线门槛。", keywords: ["证据", "编辑标准", "可信", "过期", "新鲜度", "纠错", "质量", "核验"] },
  { title: "反馈与大陆裸网实测", href: "/feedback", category: "帮助", description: "安全整理入口失效、价格变化、教程问题或关闭代理后的大陆访问结果，不自动上传。", keywords: ["反馈", "纠错", "失效", "问题", "价格变化", "入口", "裸网实测", "关闭代理", "运营商"] },
  { title: "关于数字工具指南", href: "/about", category: "网站说明", description: "项目目的、收录标准、推广边界、隐私与核验原则。", keywords: ["关于", "作者", "收录", "标准", "推广", "独立整理"] },
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
