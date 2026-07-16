import type { MetadataRoute } from "next";
import { aiProducts, commonApps } from "../data/catalog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://alsolisa.github.io/digital-tools-guide";
  const updated = new Date("2026-07-16T00:00:00+08:00");
  const routes = ["", "/nodes", "/subscriptions", "/ai", "/apps", "/downloads", "/stores", "/status", "/feedback", "/about", "/methodology", "/search", "/faq", "/privacy", "/disclosure", "/changelog"];
  return [
    ...routes.map((route) => ({ url: `${base}${route}/`, lastModified: updated, changeFrequency: route === "" ? "daily" as const : "weekly" as const, priority: route === "" ? 1 : .8 })),
    ...aiProducts.map((product) => ({ url: `${base}/ai/${product.slug}/`, lastModified: updated, changeFrequency: "weekly" as const, priority: .9 })),
    ...commonApps.map((app) => ({ url: `${base}/apps/${app.slug}/`, lastModified: updated, changeFrequency: "monthly" as const, priority: .75 })),
  ];
}
