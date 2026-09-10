import type { NextConfig } from "next";
import { siteConfig } from "./site.config";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // 비즈오프닝 앱 바로가기: bisnetworks.co.kr/opening → app.bisnetworks.co.kr/signup (신규회원 가입/접속)
      { source: "/opening", destination: siteConfig.links.openingSignup, permanent: false },
      { source: "/app", destination: siteConfig.links.openingSignup, permanent: false },
    ];
  },
};

export default nextConfig;
