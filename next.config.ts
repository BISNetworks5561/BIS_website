import type { NextConfig } from "next";
import { siteConfig } from "./site.config";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // 비즈오프닝 앱 바로가기: bisnetworks.co.kr/opening → app.bisnetworks.co.kr
      { source: "/opening", destination: siteConfig.links.openingApp, permanent: false },
      { source: "/app", destination: siteConfig.links.openingApp, permanent: false },
    ];
  },
};

export default nextConfig;
