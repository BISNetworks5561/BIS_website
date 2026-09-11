import type { Metadata } from "next";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import MobileCallBar from "@/components/MobileCallBar";
import Footer from "@/components/Footer";
import Features from "@/components/sections/Features";
import Benefits from "@/components/sections/Benefits";
import Process from "@/components/sections/Process";
import Consult from "@/components/sections/Consult";
import SohoHero from "@/components/soho/SohoHero";
import SohoDetail from "@/components/soho/SohoDetail";
import SohoPricing from "@/components/soho/SohoPricing";
import { sohoNav, sohoFeatures, sohoBenefits, sohoProcess } from "@/lib/content-soho";
import { getVisibleBanners } from "@/lib/banners-server";
import { siteConfig } from "@/site.config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `소호인터넷 | ${siteConfig.brand.name}`,
  description:
    "LG U+ 소호인터넷 — 매장·소규모 사무실용 인터넷. 100M~1G 선택, 가입비·설치비 0원, 인터넷전화·IPTV·CCTV 결합 할인. BIS네트웍스 공식 판매센터.",
  alternates: { canonical: "/soho" },
};

/** 소호인터넷 페이지 — 오피스넷 페이지와 같은 좌측 메뉴 구조 */
export default async function SohoPage() {
  const banners = await getVisibleBanners();
  return (
    <>
      <Header banners={banners} navItems={sohoNav} navLabel="소호인터넷 바로가기" />
      <div className="mx-auto max-w-7xl md:grid md:grid-cols-[176px_minmax(0,1fr)] md:gap-6 md:px-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 lg:px-8">
        <aside className="hidden md:block">
          <SideNav banners={banners} items={sohoNav} />
        </aside>
        {/* 메뉴 순서: 특장점 → 가입혜택 → 상품상세안내 → 요금안내 → 개통절차 → 상담신청 */}
        <main className="min-w-0 pb-20 md:pb-0">
          <SohoHero />
          <Features content={sohoFeatures} />
          <Benefits content={sohoBenefits} />
          <SohoDetail />
          <SohoPricing />
          <Process content={sohoProcess} />
          <Consult product="soho" />
        </main>
      </div>
      <Footer />
      <MobileCallBar />
    </>
  );
}
