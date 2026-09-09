"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { nav } from "@/lib/content";
import { siteConfig, telHref } from "@/site.config";
import { cn } from "@/lib/utils";

/** 데스크톱 좌측 고정 메뉴 — 현재 보고 있는 섹션을 자동 강조 */
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
    <div className="sticky top-28 space-y-6">
      <nav aria-label="섹션 메뉴" className="border-l border-line">
        {nav.map((n) => {
          const isActive = active === n.href;
          return (
            <a
              key={n.href}
              href={n.href}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-2.5 pl-4 text-[15px] transition-colors",
                isActive
                  ? "border-brand font-bold text-brand"
                  : "border-transparent font-medium text-ink/70 hover:border-line hover:text-ink",
              )}
            >
              {n.label}
            </a>
          );
        })}
      </nav>

      <div className="rounded-2xl bg-brand-gradient p-4 text-white">
        <p className="text-[11px] font-medium opacity-80">대표전화 · {siteConfig.contact.hours.split(" (")[0]}</p>
        <a href={telHref(siteConfig.contact.phone)} className="mt-1 flex items-center gap-1.5 text-xl font-black">
          <Icon name="phone" className="h-4 w-4" />
          {siteConfig.contact.phoneDisplay}
        </a>
        <a
          href="#consult"
          className="mt-3 flex h-9 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-dark"
        >
          무료 상담 신청
        </a>
      </div>
    </div>
  );
}
