import type { Metadata } from "next";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import MobileCallBar from "@/components/MobileCallBar";
import Footer from "@/components/Footer";
import Features from "@/components/sections/Features";
import Process from "@/components/sections/Process";
import Consult from "@/components/sections/Consult";
import CctvHero from "@/components/cctv/CctvHero";
import CctvDetail from "@/components/cctv/CctvDetail";
import CctvDiagram from "@/components/cctv/CctvDiagram";
import CctvPricing from "@/components/cctv/CctvPricing";
import { cctvNav, cctvFeatures, cctvProcess } from "@/lib/content-cctv";
import { getVisibleBanners } from "@/lib/banners-server";
import { siteConfig } from "@/site.config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `지능형 CCTV | ${siteConfig.brand.name}`,
  description:
    "LG U+ 지능형 CCTV — Full HD 카메라, 클라우드 15일 저장, AI 침입·훼손 감지, 에스원 긴급출동. 카메라 1대당 3년 약정 월 13,200원. BIS네트웍스 공식 판매센터.",
  alternates: { canonical: "/cctv" },
};

/** 지능형 CCTV 페이지 — 소호/전화와 같은 좌측 메뉴 구조 */
export default async function CctvPage() {
  const banners = await getVisibleBanners();
  return (
    <>
      <Header banners={banners} navItems={cctvNav} navLabel="CCTV 바로가기" />
      <div className="mx-auto max-w-7xl md:grid md:grid-cols-[176px_minmax(0,1fr)] md:gap-6 md:px-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 lg:px-8">
        <aside className="hidden md:block">
          <SideNav banners={banners} items={cctvNav} />
        </aside>
        {/* 메뉴 순서: 특장점 → 상품상세안내 → 서비스구성도 → 요금안내 → 개통절차 → 상담신청 */}
        <main className="min-w-0 pb-20 md:pb-0">
          <CctvHero />
          <Features content={cctvFeatures} />
          <CctvDetail />
          <CctvDiagram />
          <CctvPricing />
          <Process content={cctvProcess} />
          <Consult />
        </main>
      </div>
      <Footer />
      <MobileCallBar />
    </>
  );
}
