import type { Metadata } from "next";
import ProductComingSoon from "@/components/ProductComingSoon";
import { productPages } from "@/lib/content";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `지능형 CCTV | ${siteConfig.brand.name}`,
  description: productPages.cctv.desc,
  alternates: { canonical: "/cctv" },
};

export default function Page() {
  return <ProductComingSoon product="cctv" />;
}
