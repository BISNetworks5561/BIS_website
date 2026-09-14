/** 쿠팡파트너스 등 제휴 링크 삽입 옵션 (클라이언트/서버 공용) */

export type AffiliateLink = {
  id: string;
  /** 상품명 또는 링크 문구 */
  title: string;
  url: string;
  /** 한 줄 추천 이유 (선택) */
  note?: string;
};

export type AffiliatePosition = "end" | "afterFirst" | "beforeFaq";

export type AffiliateOptions = {
  enabled: boolean;
  heading: string;
  position: AffiliatePosition;
  links: AffiliateLink[];
  /** 고지 문구 포함 여부 — 쿠팡파트너스 약관상 필수, 기본 켬 */
  disclosure: boolean;
};

/** 쿠팡파트너스 운영원칙에 따른 필수 고지 문구 */
export const COUPANG_DISCLOSURE = "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

export const AFFILIATE_POSITION_LABEL: Record<AffiliatePosition, string> = {
  end: "본문 끝 (마무리 문단 앞)",
  afterFirst: "첫 번째 소제목 섹션 뒤",
  beforeFaq: "자주 묻는 질문 앞",
};

export const DEFAULT_AFFILIATE: AffiliateOptions = {
  enabled: false,
  heading: "함께 보면 좋은 상품",
  position: "end",
  links: [],
  disclosure: true,
};

export const AFFILIATE_LS_KEY = "bis-studio-affiliate";

const COUPANG_HOSTS = ["link.coupang.com", "coupa.ng", "www.coupang.com", "coupang.com", "m.coupang.com"];

/** http(s) URL 이면 정규화된 문자열, 아니면 null */
export function normalizeUrl(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function isCoupangUrl(url: string): boolean {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return COUPANG_HOSTS.some((c) => h === c || h.endsWith(`.${c}`));
  } catch {
    return false;
  }
}

/** 실제로 삽입할 링크만 (URL 유효, 제목 있음) */
export function activeLinks(opts: AffiliateOptions): AffiliateLink[] {
  if (!opts.enabled) return [];
  return opts.links
    .map((l) => ({ ...l, url: normalizeUrl(l.url) ?? "", title: l.title.trim() }))
    .filter((l) => l.url && l.title);
}
