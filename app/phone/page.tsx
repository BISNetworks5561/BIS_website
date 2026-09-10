import type { Metadata } from "next";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import MobileCallBar from "@/components/MobileCallBar";
import Footer from "@/components/Footer";
import Features from "@/components/sections/Features";
import Benefits from "@/components/sections/Benefits";
import Process from "@/components/sections/Process";
import Consult from "@/components/sections/Consult";
import PhoneHero from "@/components/phone/PhoneHero";
import PhoneDetail from "@/components/phone/PhoneDetail";
import PhonePricing from "@/components/phone/PhonePricing";
import { phoneNav, phoneFeatures, phoneBenefits, phoneProcess } from "@/lib/content-phone";
import { getVisibleBanners } from "@/lib/banners-server";
import { siteConfig } from "@/site.config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `기업 인터넷전화 | ${siteConfig.brand.name}`,
  description:
    "LG U+ 기업 인터넷전화 — 일반 전화보다 최대 30% 저렴, 기존 번호 그대로, IP-520GA 전화기 무료 제공. 일반형·센트릭스·교환기 설치형. BIS네트웍스 공식 판매센터.",
  alternates: { canonical: "/phone" },
};

/** 기업 인터넷전화 페이지 — 소호/오피스넷과 같은 좌측 메뉴 구조 */
export default async function PhonePage() {
  const banners = await getVisibleBanners();
  return (
    <>
      <Header banners={banners} navItems={phoneNav} navLabel="인터넷전화 바로가기" />
      <div className="mx-auto max-w-7xl md:grid md:grid-cols-[176px_minmax(0,1fr)] md:gap-6 md:px-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 lg:px-8">
        <aside className="hidden md:block">
          <SideNav banners={banners} items={phoneNav} />
        </aside>
        {/* 메뉴 순서: 특장점 → 가입혜택 → 상품상세안내 → 요금안내 → 개통절차 → 상담신청 */}
        <main className="min-w-0 pb-20 md:pb-0">
          <PhoneHero />
          <Features content={phoneFeatures} />
          <Benefits content={phoneBenefits} />
          <PhoneDetail />
          <PhonePricing />
          <Process content={phoneProcess} />
          <Consult />
        </main>
      </div>
      <Footer />
      <MobileCallBar />
    </>
  );
}
