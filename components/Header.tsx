"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
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
        "sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur transition-shadow",
        scrolled ? "border-line shadow-sm" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label={siteConfig.brand.name + " 홈"}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-black tracking-tight text-white">
            {siteConfig.brand.logoText}
          </span>
          <span className="leading-tight">
            <span className="block text-base font-black">{siteConfig.brand.name}</span>
            <span className="block text-[11px] font-medium text-muted">{siteConfig.brand.tagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="주요 메뉴">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-ink/80 hover:text-brand">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telHref(siteConfig.contact.phone)}
            className="hidden items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-white transition-colors hover:bg-brand-dark md:flex"
          >
            <Icon name="phone" className="h-4 w-4" />
            <span className="text-[11px] font-medium leading-none opacity-90">대표전화</span>
            <span className="text-lg font-black leading-none tracking-tight">{siteConfig.contact.phoneDisplay}</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface lg:hidden"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-white px-5 py-4 lg:hidden">
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
          <a
            href={telHref(siteConfig.contact.phone)}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-brand py-4 text-lg font-black text-white"
          >
            <Icon name="phone" className="h-5 w-5" /> {siteConfig.contact.phoneDisplay}
          </a>
          <p className="mt-3 text-center text-xs text-muted">{siteConfig.contact.hours}</p>
        </div>
      )}
    </header>
  );
}
