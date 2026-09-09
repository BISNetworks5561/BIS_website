import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import MobileCallBar from "@/components/MobileCallBar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Concerns from "@/components/sections/Concerns";
import Benefits from "@/components/sections/Benefits";
import Diagram from "@/components/sections/Diagram";
import Industries from "@/components/sections/Industries";
import Pricing from "@/components/sections/Pricing";
import Bundles from "@/components/sections/Bundles";
import Process from "@/components/sections/Process";
import Trust from "@/components/sections/Trust";
import Reviews from "@/components/sections/Reviews";
import Faq from "@/components/sections/Faq";
import Consult from "@/components/sections/Consult";
import { siteConfig } from "@/site.config";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.brand.name,
    description: siteConfig.site.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    url: siteConfig.site.url,
    address: { "@type": "PostalAddress", streetAddress: siteConfig.company.address, addressCountry: "KR" },
    openingHours: "Mo-Fr 09:00-18:00",
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 lg:px-8">
        {/* 좌측 고정 메뉴 (데스크톱) */}
        <aside className="hidden lg:block">
          <SideNav />
        </aside>

        {/* 메뉴 순서: 특장점 → 가입혜택 → 구성도 → 요금안내 → 개통절차 → 고객후기 → FAQ → 상담신청 */}
        <main className="min-w-0 pb-20 md:pb-0">
          <Hero />
          <Features />
          <Concerns />
          <Benefits />
          <Diagram />
          <Industries />
          <Pricing />
          <Bundles />
          <Process />
          <Trust />
          <Reviews />
          <Faq />
          <Consult />
        </main>
      </div>
      <Footer />
      <MobileCallBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
