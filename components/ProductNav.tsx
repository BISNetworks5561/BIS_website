"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { productNav } from "@/lib/content";
import { cn } from "@/lib/utils";

/** 상단 가로형 상품 메뉴 (오피스넷 · 소호인터넷 · 전화 · CCTV) */
export default function ProductNav({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const pathname = usePathname();

  if (variant === "mobile") {
    return (
      <nav aria-label="상품 메뉴" className="grid grid-cols-4 gap-2">
        {productNav.map((p) => {
          const active = pathname === p.href;
          return (
            <Link
              key={p.href}
              href={p.href}
              className={cn(
                "rounded-xl border py-2.5 text-center text-sm font-bold",
                active ? "border-brand bg-brand text-white" : "border-line text-ink/80",
              )}
            >
              {p.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="상품 메뉴" className="hidden items-center gap-1 md:flex">
      {productNav.map((p) => {
        const active = pathname === p.href;
        return (
          <Link
            key={p.href}
            href={p.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-full px-3.5 py-2 text-[15px] font-bold transition-colors lg:px-4",
              active ? "text-brand" : "text-ink/75 hover:bg-surface hover:text-ink",
            )}
          >
            {p.label}
            {active && <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand lg:inset-x-4" />}
          </Link>
        );
      })}
    </nav>
  );
}
