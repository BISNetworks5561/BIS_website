import Header from "@/components/Header";
import MobileCallBar from "@/components/MobileCallBar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Concerns from "@/components/sections/Concerns";
import Industries from "@/components/sections/Industries";
import Pricing from "@/components/sections/Pricing";
import Benefits from "@/components/sections/Benefits";
import Process from "@/components/sections/Process";
import Trust from "@/components/sections/Trust";
import Reviews from "@/components/sections/Reviews";
import Bundles from "@/components/sections/Bundles";
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
      <main className="pb-20 md:pb-0">
        <Hero />
        <Features />
        <Concerns />
        <Industries />
        <Pricing />
        <Benefits />
        <Process />
        <Trust />
        <Reviews />
        <Bundles />
        <Faq />
        <Consult />
      </main>
      <Footer />
      <MobileCallBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
