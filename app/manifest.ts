import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "数字工具指南",
    short_name: "工具指南",
    description: "机场介绍与下载、AI订阅与常用应用、主流模型评测解读的零基础指南。",
    id: "./",
    start_url: "./",
    scope: "./",
    lang: "zh-CN",
    display: "standalone",
    background_color: "#f5f2e9",
    theme_color: "#0c5f4b",
    icons: [
      { src: "./favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "./icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "./icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "./icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
