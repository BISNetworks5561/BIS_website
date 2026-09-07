import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/site.config";

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const mark = size === "lg" ? 48 : 40;
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={siteConfig.brand.nameEn + " 홈"}>
      <Image src={siteConfig.brand.logoSrc} alt="" width={mark} height={mark * 1.12} priority className="shrink-0" />
      <span className="leading-none">
        <span className="block text-[17px] font-black tracking-wide text-brand-dark md:text-[19px]">
          {siteConfig.brand.nameEn}
        </span>
        <span className="mt-1 block text-[11px] font-semibold tracking-wide text-brand">
          {siteConfig.brand.domainLabel}
        </span>
      </span>
    </Link>
  );
}
