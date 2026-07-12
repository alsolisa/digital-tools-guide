import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "数字工具指南｜机场、AI订阅与主流应用小白教程",
    template: "%s｜数字工具指南",
  },
  description: "面向中国大陆新手，独立核验机场、AI订阅、主流AI、常用应用与官方下载入口。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "数字工具指南",
    title: "数字工具指南｜机场、AI订阅与主流应用小白教程",
    description: "官方入口、真实价格、账号风险和小白教程集中整理。",
    images: [{ url: `${publicBasePath}/og-digital-tools.png`, width: 1536, height: 1024, alt: "数字工具指南" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "数字工具指南",
    description: "机场、AI订阅、官方下载与小白教程。",
    images: [`${publicBasePath}/og-digital-tools.png`],
  },
  icons: {
    icon: `${publicBasePath}/favicon.svg`,
    shortcut: `${publicBasePath}/favicon.svg`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
