import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "数字工具指南",
    short_name: "工具指南",
    description: "机场、AI订阅、主流AI与常用应用的小白教程和官方入口。",
    start_url: "./",
    display: "standalone",
    background_color: "#f5f2e9",
    theme_color: "#0c5f4b",
    icons: [{ src: "./favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
