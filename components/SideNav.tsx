"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { nav } from "@/lib/content";
import { siteConfig, telHref } from "@/site.config";
import { cn } from "@/lib/utils";

/** 데스크톱 좌측 고정 메뉴 — 현재 보고 있는 섹션을 자동 강조 (LG U+ 상품 페이지 스타일) */
export default function SideNav() {
  const [active, setActive] = useState<string>(nav[0].href);

  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive("#" + visible[0].target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-24 max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-4 pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <nav aria-label="섹션 메뉴">
        <ul className="space-y-1">
          {nav.map((n) => {
            const isActive = active === n.href;
            return (
              <li key={n.href}>
                <a
                  href={n.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-block py-2 text-[15px] transition-colors",
                    isActive
                      ? "font-bold text-brand underline decoration-2 underline-offset-[6px]"
                      : "font-medium text-ink/80 hover:text-brand",
                  )}
                >
                  {n.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="my-5 border-t border-line" />

      {/* 배너 바로가기: BIS오프닝 APP (준비중) & 공식 블로그 */}
      <div className="space-y-3">
        <a
          href={siteConfig.links.openingSignup}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="relative">
            <Image
              src="/banner-app.png"
              alt="BIS오프닝 APP 다운/접속하기 (준비중)"
              width={170}
              height={253}
              className="h-auto w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
            {/* 준비중 뱃지 */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-black text-amber-300 shadow-md backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>준비중</span>
            </div>
          </div>
        </a>
        <a
          href={siteConfig.links.blog}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <Image
            src="/banner-blog.png"
            alt="BISnetworks 공식 블로그 이웃추가하고 소통하기"
            width={170}
            height={253}
            className="h-auto w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </a>
      </div>

      <div className="my-5 border-t border-line" />

      <p className="text-xs font-medium text-muted">대표전화</p>
      <a href={telHref(siteConfig.contact.phone)} className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-lg font-black text-brand-dark lg:text-xl">
        <Icon name="phone" className="h-4 w-4 text-brand" />
        {siteConfig.contact.phoneDisplay}
      </a>
      <p className="mt-1 text-xs text-muted">{siteConfig.contact.hours}</p>
      <a
        href="#consult"
        className="mt-4 flex h-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white shadow-sm"
      >
        무료 상담 신청
      </a>
    </div>
  );
}
