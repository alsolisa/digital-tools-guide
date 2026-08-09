import type { Metadata, Viewport } from "next";
import StructuredData from "./components/StructuredData";
import HashScrollRestorer from "./components/HashScrollRestorer";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const publicBasePath = isGitHubPages ? "/digital-tools-guide" : "";

export const metadata: Metadata = {
  metadataBase: new URL(isGitHubPages ? "https://alsolisa.github.io" : "http://localhost:3000"),
  title: {
    default: "数字工具指南｜机场、AI与模型评测的零基础教程",
    template: "%s｜数字工具指南",
  },
  description: "三个清晰项目：机场介绍与客户端下载、AI订阅与常用应用、主流AI模型评测解读。",
  referrer: "strict-origin-when-cross-origin",
  manifest: `${publicBasePath}/manifest.webmanifest`,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "数字工具指南",
    title: "数字工具指南｜第一次也能看懂",
    description: "机场、AI订阅与应用、主流模型评测，先解释是什么，再告诉你怎么选。",
    images: [{ url: `${publicBasePath}/og-award-v2.jpg`, width: 1200, height: 630, alt: "数字工具指南：复杂的数字工具，先看懂，再决定" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "数字工具指南",
    description: "机场介绍与下载、AI订阅与应用、模型评测的零基础指南。",
    images: [`${publicBasePath}/og-award-v2.jpg`],
  },
  icons: {
    icon: [
      { url: `${publicBasePath}/favicon.svg`, type: "image/svg+xml" },
      { url: `${publicBasePath}/icon-192.png`, type: "image/png", sizes: "192x192" },
      { url: `${publicBasePath}/icon-512.png`, type: "image/png", sizes: "512x512" },
    ],
    shortcut: `${publicBasePath}/favicon.svg`,
    apple: [{ url: `${publicBasePath}/icon-192.png`, type: "image/png", sizes: "192x192" }],
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "数字工具指南" },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#0c5f4b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteUrl = isGitHubPages ? "https://alsolisa.github.io/digital-tools-guide/" : "http://localhost:3000/";
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "数字工具指南",
    url: siteUrl,
    inLanguage: "zh-CN",
    description: "面向中国大陆新手的机场、AI订阅与应用、主流模型评测指南。",
    publisher: { "@type": "Organization", name: "数字工具指南", url: siteUrl },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}search/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <html lang="zh-CN">
      <body><StructuredData data={websiteJsonLd} /><HashScrollRestorer />{children}</body>
    </html>
  );
}
