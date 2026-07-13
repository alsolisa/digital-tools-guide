import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "数字工具指南",
    short_name: "工具指南",
    description: "从VPN和机场是什么讲起，提供AI选择、会员风险与官方下载的零基础教程。",
    start_url: "./",
    display: "standalone",
    background_color: "#f5f2e9",
    theme_color: "#0c5f4b",
    icons: [{ src: "./favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
