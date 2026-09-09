import type { Metadata } from "next";
import ProductComingSoon from "@/components/ProductComingSoon";
import { productPages } from "@/lib/content";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `기업 인터넷전화 | ${siteConfig.brand.name}`,
  description: productPages.phone.desc,
  alternates: { canonical: "/phone" },
};

export default function Page() {
  return <ProductComingSoon product="phone" />;
}
