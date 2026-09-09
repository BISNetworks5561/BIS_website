import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/site.config";

/** 헤더 로고 — 원본 가로형 로고(마크 + 워드마크) */
export default function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label={siteConfig.brand.nameEn + " 홈"}>
      <Image
        src={siteConfig.brand.logoFullSrc}
        alt={siteConfig.brand.nameEn}
        width={966}
        height={240}
        priority
        className="h-9 w-auto md:h-11"
      />
    </Link>
  );
}
