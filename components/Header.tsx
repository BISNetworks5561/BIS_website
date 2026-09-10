"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/Logo";
import ProductNav from "@/components/ProductNav";
import UplusBadge from "@/components/ui/UplusBadge";
import { nav } from "@/lib/content";
import { siteConfig, telHref } from "@/site.config";
import { cn } from "@/lib/utils";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      id="top"
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-white transition-shadow",
        scrolled ? "border-line shadow-sm" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <div className="flex items-center gap-4 lg:gap-8">
          <Logo />
          <ProductNav />
        </div>

        <div className="flex items-center gap-2">
          <a
            href={telHref(siteConfig.contact.phone)}
            className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-brand-gradient px-4 py-2.5 text-white shadow-[0_8px_20px_-8px_rgba(17,96,184,0.6)] transition-all hover:brightness-110 md:flex"
          >
            <Icon name="phone" className="h-4 w-4" />
            <span className="text-[11px] font-medium leading-none opacity-90">대표전화</span>
            <span className="whitespace-nowrap text-lg font-black leading-none tracking-tight">{siteConfig.contact.phoneDisplay}</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-brand-dark hover:bg-surface md:hidden"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-line bg-white px-5 py-4 md:hidden">
          <p className="pb-3">
            <UplusBadge>{siteConfig.brand.tagline}</UplusBadge>
          </p>
          <ProductNav variant="mobile" />
          <p className="mt-5 mb-1 text-xs font-bold text-muted">오피스넷 바로가기</p>
          <nav className="flex flex-col" aria-label="모바일 메뉴">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-base font-medium"
              >
                {n.label}
              </a>
            ))}
          </nav>

          {/* 배너 바로가기: BIS오프닝 APP & 공식 블로그 */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href={siteConfig.links.openingApp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="group block overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:opacity-95"
            >
              <Image
                src="/banner-app.png"
                alt="BIS오프닝 APP 다운/접속하기"
                width={170}
                height={253}
                className="h-auto w-full object-cover"
              />
            </a>
            <a
              href={siteConfig.links.blog}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="group block overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:opacity-95"
            >
              <Image
                src="/banner-blog.png"
                alt="BISnetworks 공식 블로그 이웃추가하고 소통하기"
                width={170}
                height={253}
                className="h-auto w-full object-cover"
              />
            </a>
          </div>
          <a
            href={telHref(siteConfig.contact.phone)}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-brand-gradient py-4 text-lg font-black text-white"
          >
            <Icon name="phone" className="h-5 w-5" /> {siteConfig.contact.phoneDisplay}
          </a>
          <p className="mt-3 text-center text-xs text-muted">{siteConfig.contact.hours}</p>
        </div>
      )}
    </header>
  );
}
