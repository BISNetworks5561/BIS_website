import Image from "next/image";
import UplusBadge from "@/components/ui/UplusBadge";
import { siteConfig, telHref } from "@/site.config";

export default function Footer() {
  const c = siteConfig.company;
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <Image src={siteConfig.brand.logoFullSrc} alt={siteConfig.brand.nameEn} width={966} height={240} className="h-12 w-auto" />
            <p className="mt-3"><UplusBadge>{siteConfig.brand.tagline}</UplusBadge></p>
            <a href={telHref(siteConfig.contact.phone)} className="mt-4 block text-2xl font-black text-brand-dark">
              {siteConfig.contact.phoneDisplay}
            </a>
            <p className="mt-1 text-sm text-muted">{siteConfig.contact.hours}</p>
            <p className="mt-2 text-sm text-muted">
              {siteConfig.contact.manager.name}{" "}
              <a href={telHref(siteConfig.contact.manager.phone)} className="font-semibold text-ink hover:text-brand">
                {siteConfig.contact.manager.phone}
              </a>
            </p>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs text-muted md:text-sm">
            <dt className="font-semibold">상호</dt>
            <dd>{c.legalName}</dd>
            <dt className="font-semibold">대표</dt>
            <dd>{c.ceo}</dd>
            <dt className="font-semibold">사업자등록번호</dt>
            <dd>{c.bizNumber}</dd>
            <dt className="font-semibold">주소</dt>
            <dd>{c.address}</dd>
            <dt className="font-semibold">이메일</dt>
            <dd>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-brand">
                {siteConfig.contact.email}
              </a>
            </dd>
            <dt className="font-semibold">개인정보책임자</dt>
            <dd>{c.privacyOfficer}</dd>
          </dl>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.brand.nameEn}. All rights reserved.
          </p>
          <p>
            본 사이트는 LG U+ 기업통신상품 공식 판매센터인 {siteConfig.brand.name}에서 운영하며, LG유플러스의 통신위탁판매대행업자입니다. 상품·요금·A/S는 LG U+ 기준을 따릅니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
