import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/digital-tools-guide" : "",
  assetPrefix: isGitHubPages ? "/digital-tools-guide/" : undefined,
  trailingSlash: isGitHubPages,
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
