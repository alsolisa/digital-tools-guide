import type { MetadataRoute } from "next";
import { aiProducts, commonApps } from "../data/catalog";
import syncStatus from "../data/sync-status.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://alsolisa.github.io/digital-tools-guide";
  const syncedAt = new Date(syncStatus.checkedAt);
  const routes = [
    { path: "", modified: "2026-08-09", frequency: "weekly" as const, priority: 1 },
    { path: "/nodes", modified: "2026-08-09", frequency: "weekly" as const, priority: .9 },
    { path: "/subscriptions", modified: "2026-08-09", frequency: "weekly" as const, priority: .9 },
    { path: "/ai", modified: "2026-08-09", frequency: "weekly" as const, priority: .9 },
    { path: "/apps", modified: "2026-08-09", frequency: "monthly" as const, priority: .8 },
    { path: "/downloads", modified: syncedAt, frequency: "daily" as const, priority: .85 },
    { path: "/benchmarks", modified: syncedAt, frequency: "daily" as const, priority: .85 },
    { path: "/status", modified: syncedAt, frequency: "daily" as const, priority: .8 },
    { path: "/stores", modified: "2026-07-16", frequency: "monthly" as const, priority: .7 },
    { path: "/standards", modified: "2026-07-16", frequency: "monthly" as const, priority: .65 },
    { path: "/feedback", modified: "2026-07-16", frequency: "monthly" as const, priority: .55 },
    { path: "/about", modified: "2026-07-16", frequency: "monthly" as const, priority: .55 },
    { path: "/methodology", modified: "2026-07-17", frequency: "monthly" as const, priority: .65 },
    { path: "/search", modified: "2026-07-16", frequency: "monthly" as const, priority: .6 },
    { path: "/faq", modified: "2026-07-16", frequency: "monthly" as const, priority: .6 },
    { path: "/privacy", modified: "2026-07-16", frequency: "yearly" as const, priority: .4 },
    { path: "/disclosure", modified: "2026-07-16", frequency: "yearly" as const, priority: .4 },
    { path: "/changelog", modified: "2026-08-09", frequency: "monthly" as const, priority: .55 },
  ];
  return [
    ...routes.map((route) => ({ url: `${base}${route.path}/`, lastModified: route.modified instanceof Date ? route.modified : new Date(`${route.modified}T12:00:00+08:00`), changeFrequency: route.frequency, priority: route.priority })),
    ...aiProducts.map((product) => ({ url: `${base}/ai/${product.slug}/`, lastModified: new Date(`${product.verifiedAt}T12:00:00+08:00`), changeFrequency: "weekly" as const, priority: .9 })),
    ...commonApps.map((app) => ({ url: `${base}/apps/${app.slug}/`, lastModified: new Date(`${app.verifiedAt}T12:00:00+08:00`), changeFrequency: "monthly" as const, priority: .75 })),
  ];
}
