/** 대표이미지 배경 라이브러리 — 타입·기본 프리셋 (클라이언트/서버 공용) */

export const BG_CATEGORIES = [
  { key: "common", label: "공통" },
  { key: "officenet", label: "오피스넷" },
  { key: "soho", label: "소호인터넷" },
  { key: "phone", label: "인터넷전화" },
  { key: "cctv", label: "CCTV" },
] as const;
export type BgCategory = (typeof BG_CATEGORIES)[number]["key"];

export type Background = {
  id: string;
  name: string;
  category: BgCategory;
  url: string;
  /** 밝은 배경이면 true (어두운 글자 기본) */
  light: boolean;
  builtin?: boolean;
  /** 스토리지 경로 (업로드 이미지만) */
  path?: string;
};

/** 기본 제공 배경 5종 */
export const BUILTIN_BACKGROUNDS: Background[] = [
  { id: "bg-blue", name: "BIS 블루", category: "common", url: "/studio/bg-blue.png", light: false, builtin: true },
  { id: "bg-navy", name: "네이비", category: "common", url: "/studio/bg-navy.png", light: false, builtin: true },
  { id: "bg-uplus", name: "U+ 포인트", category: "common", url: "/studio/bg-uplus.png", light: false, builtin: true },
  { id: "bg-sky", name: "스카이", category: "common", url: "/studio/bg-sky.png", light: true, builtin: true },
  { id: "bg-white", name: "화이트", category: "common", url: "/studio/bg-white.png", light: true, builtin: true },
];

/** admin_settings 의 "thumb-backgrounds" 값 */
export type BackgroundLibrary = {
  items: Background[];
  /** 카테고리별 기본 배경 id */
  defaults: Partial<Record<BgCategory, string>>;
};

export const EMPTY_LIBRARY: BackgroundLibrary = { items: [], defaults: {} };

/** 글의 상품 → 배경 카테고리 */
export function productToCategory(product: string): BgCategory {
  switch (product) {
    case "officenet":
    case "soho":
    case "phone":
    case "cctv":
      return product;
    default:
      return "common";
  }
}

/** 카테고리에 맞는 배경 자동 선택: 지정 기본 → 그 카테고리 첫 항목 → 공통 기본 → 첫 프리셋 */
export function pickBackground(lib: BackgroundLibrary, category: BgCategory): Background {
  const all = [...lib.items, ...BUILTIN_BACKGROUNDS];
  const byId = (id?: string) => (id ? all.find((b) => b.id === id) : undefined);
  return (
    byId(lib.defaults[category]) ??
    all.find((b) => b.category === category) ??
    byId(lib.defaults.common) ??
    BUILTIN_BACKGROUNDS[0]
  );
}
