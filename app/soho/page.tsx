import type { Metadata } from "next";
import ProductComingSoon from "@/components/ProductComingSoon";
import { productPages } from "@/lib/content";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `소호인터넷 | ${siteConfig.brand.name}`,
  description: productPages.soho.desc,
  alternates: { canonical: "/soho" },
};

export default function Page() {
  return <ProductComingSoon product="soho" />;
}
