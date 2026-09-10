import { siteConfig } from "@/site.config";

/** 사이드 배너(위젯) — 홈 좌측 메뉴 아래 · 모바일 메뉴 안에 표시 */
export type Banner = {
  id: string;
  enabled: boolean;
  /** 배너 종류: 이미지 카드 / 텍스트 카드(이미지 없이 빠르게 만드는 이벤트·광고) */
  kind: "image" | "text";
  /** 이미지 배너: 이미지 URL (권장 340×506, 2:3) */
  image?: string;
  /** 텍스트 배너 내용 */
  title: string;
  subtitle?: string;
  cta?: string;
  /** 텍스트 배너 배경 프리셋 */
  theme?: "blue" | "green" | "magenta" | "dark" | "white";
  /** 링크 (비우면 클릭 불가) */
  href: string;
  newTab: boolean;
  /** 우측 상단 뱃지 (예: 준비중, NEW, 이벤트) */
  badge?: string;
  /** 노출 기간 (선택, YYYY-MM-DD) */
  startsAt?: string;
  endsAt?: string;
  builtin?: boolean;
};

export type BannerSettings = { items: Banner[] };

export const BANNER_THEMES: Record<NonNullable<Banner["theme"]>, { label: string; className: string; text: string }> = {
  blue: { label: "블루", className: "bg-brand-gradient", text: "text-white" },
  green: { label: "그린", className: "bg-gradient-to-br from-emerald-400 to-teal-600", text: "text-white" },
  magenta: { label: "마젠타", className: "bg-gradient-to-br from-uplus to-[#8a0050]", text: "text-white" },
  dark: { label: "다크", className: "bg-gradient-to-br from-slate-800 to-slate-950", text: "text-white" },
  white: { label: "화이트", className: "bg-white border border-line", text: "text-ink" },
};

/** 기본 배너 2종 (백오피스에서 끄거나 순서 변경 가능) */
export const DEFAULT_BANNERS: Banner[] = [
  {
    id: "app",
    enabled: true,
    kind: "image",
    image: "/banner-app.png",
    title: "BIS오프닝 APP 다운/접속하기",
    href: siteConfig.links.openingSignup,
    newTab: true,
    badge: "준비중",
    builtin: true,
  },
  {
    id: "blog",
    enabled: true,
    kind: "image",
    image: "/banner-blog.png",
    title: "BISnetworks 공식 블로그 이웃추가하고 소통하기",
    href: siteConfig.links.blog,
    newTab: true,
    builtin: true,
  },
];

/** 저장값 + 기본값 병합 (저장된 항목 순서 우선, 새 기본 배너는 뒤에 추가) */
export function mergeBanners(saved?: Partial<BannerSettings> | null): Banner[] {
  const items = Array.isArray(saved?.items) ? saved!.items : [];
  const known = new Set(items.map((b) => b.id));
  const missing = DEFAULT_BANNERS.filter((d) => !known.has(d.id));
  return [...items.map((b) => ({ ...DEFAULT_BANNERS.find((d) => d.id === b.id), ...b })), ...missing] as Banner[];
}

/** 지금 노출할 배너만 (켜짐 + 기간 내) */
export function visibleBanners(all: Banner[], now = new Date()): Banner[] {
  const today = now.toISOString().slice(0, 10);
  return all.filter((b) => b.enabled && (!b.startsAt || b.startsAt <= today) && (!b.endsAt || b.endsAt >= today));
}
