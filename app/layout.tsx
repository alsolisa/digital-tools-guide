import type { Metadata, Viewport } from "next";
import "./site.css";
import StructuredData from "./components/StructuredData";
import HashScrollRestorer from "./components/HashScrollRestorer";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const publicBasePath = isGitHubPages ? "/digital-tools-guide" : "";

export const metadata: Metadata = {
  metadataBase: new URL(isGitHubPages ? "https://alsolisa.github.io" : "http://localhost:3000"),
  title: {
    default: "数字工具指南｜把来源、变化和下一步说清楚",
    template: "%s｜数字工具指南",
  },
  description: "网络服务、AI与常用应用、模型评测：先看原始来源，再确认变化和风险，最后找到可以直接执行的下一步。",
  referrer: "strict-origin-when-cross-origin",
  manifest: `${publicBasePath}/manifest.webmanifest`,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "数字工具指南",
    title: "数字工具指南｜先查清楚，再决定",
    description: "不替你喊最好用。把网络服务、AI与应用、模型评测的来源、变化、风险和下一步放在一起说清楚。",
    images: [{ url: `${publicBasePath}/og-live-proof-v19.jpg`, width: 1200, height: 630, alt: "数字工具指南：先弄清楚，再决定" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "数字工具指南",
    description: "网络服务、AI与应用、模型评测：来源、变化、风险和下一步都说明白。",
    images: [`${publicBasePath}/og-live-proof-v19.jpg`],
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
    description: "面向第一次接触网络服务、AI与常用应用、模型评测的读者，解释来源、变化、风险和下一步。",
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
