import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const publicBasePath = isGitHubPages ? "/digital-tools-guide" : "";

export const metadata: Metadata = {
  metadataBase: new URL(isGitHubPages ? "https://alsolisa.github.io" : "http://localhost:3000"),
  title: {
    default: "数字工具指南｜从VPN、AI到安全下载的零基础教程",
    template: "%s｜数字工具指南",
  },
  description: "面向第一次使用的人，从VPN和机场是什么讲起，解释AI怎么选、会员怎么买以及软件如何安全下载。",
  manifest: `${publicBasePath}/manifest.webmanifest`,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "数字工具指南",
    title: "数字工具指南｜第一次也能看懂",
    description: "先解释是什么，再告诉你是否需要、有什么风险和下一步怎么做。",
    images: [{ url: `${publicBasePath}/og-v4.png`, width: 1536, height: 1024, alt: "数字工具指南：第一次来也能一步一步看懂" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "数字工具指南",
    description: "VPN、机场、AI选择、会员风险和官方下载的零基础指南。",
    images: [`${publicBasePath}/og-v4.png`],
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
    description: "面向中国大陆新手的网络连接、AI选择、订阅风险与官方下载指南。",
    publisher: { "@type": "Organization", name: "数字工具指南", url: siteUrl },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}search/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}><StructuredData data={websiteJsonLd} />{children}</body>
    </html>
  );
}
