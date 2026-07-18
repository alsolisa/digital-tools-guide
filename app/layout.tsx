import type { Metadata } from "next";
import "@fontsource-variable/noto-serif-sc/wght.css";
import "@fontsource-variable/noto-sans-sc/wght.css";
import "./globals.css";
import StructuredData from "./components/StructuredData";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const publicBasePath = isGitHubPages ? "/digital-tools-guide" : "";

export const metadata: Metadata = {
  metadataBase: new URL(isGitHubPages ? "https://alsolisa.github.io" : "http://localhost:3000"),
  title: {
    default: "数字工具指南｜机场、AI与模型评测的零基础教程",
    template: "%s｜数字工具指南",
  },
  description: "三个清晰项目：机场介绍与客户端下载、AI订阅与常用应用、主流AI模型评测解读。",
  manifest: `${publicBasePath}/manifest.webmanifest`,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "数字工具指南",
    title: "数字工具指南｜第一次也能看懂",
    description: "机场、AI订阅与应用、主流模型评测，先解释是什么，再告诉你怎么选。",
    images: [{ url: `${publicBasePath}/og-v11.png`, width: 1536, height: 1024, alt: "数字工具指南：机场、AI与应用、模型评测" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "数字工具指南",
    description: "机场介绍与下载、AI订阅与应用、模型评测的零基础指南。",
    images: [`${publicBasePath}/og-v11.png`],
  },
  icons: {
    icon: `${publicBasePath}/favicon.svg`,
    shortcut: `${publicBasePath}/favicon.svg`,
  },
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
      <body><StructuredData data={websiteJsonLd} />{children}</body>
    </html>
  );
}
