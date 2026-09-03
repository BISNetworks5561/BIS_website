/**
 * ─────────────────────────────────────────────────────────────
 *  BIS네트웍스 사이트 설정 (단일 진실 공급원)
 *
 *  회사 실제 정보(전화번호·상호·주소·사업자번호·요금·실적 수치)는
 *  모두 이 파일에서만 관리합니다. 아래 값들은 자리표시자이며
 *  실제 정보 확정 후 이 파일만 수정하면 사이트 전체에 반영됩니다.
 *
 *  TODO 표시된 항목이 자리표시자입니다.
 * ─────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  /** 브랜드 */
  brand: {
    name: "BIS네트웍스",
    nameEn: "BIS Networks",
    /** 헤더/히어로에 노출되는 부제 */
    tagline: "LG U+ 오피스넷 공식 판매센터",
    /** 로고 이미지가 없을 때 사용하는 텍스트 로고 */
    logoText: "BIS",
    /** public/ 아래 로고 파일 경로 (없으면 텍스트 로고 사용) */
    logoSrc: "/logo.svg",
  },

  /** 연락처 */
  contact: {
    /** TODO 대표전화 (tel: 링크용, 숫자와 하이픈만) */
    phone: "0000-0000",
    /** 화면 표시용 */
    phoneDisplay: "0000-0000",
    /** TODO 장애 접수 전화 (LG U+ 기업 장애센터) */
    faultPhone: "1544-0000",
    /** TODO 이메일 */
    email: "contact@example.com",
    /** TODO 카카오톡 채널 URL (없으면 빈 문자열) */
    kakaoUrl: "",
    /** 상담 가능 시간 */
    hours: "평일 09:00 ~ 18:00 (주말·공휴일 휴무)",
  },

  /** 사업자 정보 (푸터) */
  company: {
    /** TODO 상호 */
    legalName: "주식회사 비아이에스네트웍스",
    /** TODO 대표자 */
    ceo: "홍길동",
    /** TODO 사업자등록번호 */
    bizNumber: "000-00-00000",
    /** TODO 통신판매업 신고번호 */
    telecomSalesNumber: "제 0000-서울○○-0000 호",
    /** TODO 사업장 주소 */
    address: "서울특별시 ○○구 ○○로 00, 0층 (우 00000)",
    /** TODO 개인정보보호 책임자 */
    privacyOfficer: "홍길동",
    /** 설립연도 (신뢰 지표 "SINCE" 표기용) */
    since: 2014,
  },

  /** 사이트 메타 */
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bis-website.vercel.app",
    title: "BIS네트웍스 | LG U+ 오피스넷 기업인터넷 판매센터",
    description:
      "PC 대수 무제한, 고정IP, 광케이블 최대 10Gbps. LG U+ 오피스넷 기업인터넷 가입비·설치비 0원, 월 요금 맞춤 설계. 전화 한 통으로 당일 견적.",
    keywords: [
      "기업인터넷",
      "LG U+ 오피스넷",
      "사무실 인터넷",
      "고정IP 인터넷",
      "기업 전용회선",
      "BIS네트웍스",
    ],
  },

  /**
   * 요금표 (TODO 실제 요금 확정 후 수정)
   * 단위: 원 / 월, 부가세 별도. 값이 null이면 "상담 문의"로 표시됩니다.
   */
  pricing: {
    vatNote: "부가세 별도 · 3년 약정 기준 · 지역 및 건물 환경에 따라 달라질 수 있습니다.",
    /** 오피스넷 단독 가입 */
    standalone: [
      { speed: "100M", dynamic: 28000, static: 38000, popular: false },
      { speed: "500M", dynamic: 40000, static: 45000, popular: true, badge: "가성비 1위" },
      { speed: "1G", dynamic: 45000, static: 55000, popular: true, badge: "BEST" },
      { speed: "2.5G", dynamic: 50000, static: 55000, popular: false },
      { speed: "5G", dynamic: 70000, static: 70000, popular: false },
      { speed: "10G", dynamic: 100000, static: 105000, popular: false },
    ],
    /** 결합 가입 (인터넷전화·와이파이·CCTV 등 2개 이상 결합 시) */
    bundle: [
      { speed: "100M", dynamic: 22000, static: 32000, popular: false },
      { speed: "500M", dynamic: 34000, static: 39000, popular: true, badge: "가성비 1위" },
      { speed: "1G", dynamic: 39000, static: 49000, popular: true, badge: "BEST" },
      { speed: "2.5G", dynamic: 44000, static: 49000, popular: false },
      { speed: "5G", dynamic: 64000, static: 64000, popular: false },
      { speed: "10G", dynamic: 94000, static: 99000, popular: false },
    ],
    bundleNote: "결합 요금은 기업인터넷전화·와이파이오피스·지능형 CCTV 중 1개 이상 함께 가입 시 적용되는 예시 요금입니다.",
    /** 고정IP 추가 시 개당 요금 (TODO) */
    extraStaticIp: 5500,
    maxStaticIp: 20,
  },

  /** 신뢰 지표 (TODO 실제 수치로 교체) */
  stats: [
    { value: 18800, suffix: "+", label: "누적 기업 고객" },
    { value: 83800, suffix: "회", label: "전문 컨설팅" },
    { value: 12, suffix: "년", label: "LG U+ 기업통신 전문" },
    { value: 24, suffix: "시간", label: "기업 전담 장애센터" },
  ],

  /** 수상 / 인증 (TODO) */
  awards: [
    "LG U+ 기업부문 우수 판매센터 (0000년)",
    "LG U+ 소호·기업 3관왕 수상 (0000년)",
    "2년 연속 전국 1등 기업센터",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
export type PricingRow = (typeof siteConfig.pricing.standalone)[number];

/** tel: 링크용 — 숫자만 남김 */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** 원화 포맷 */
export const krw = (n: number | null | undefined) =>
  n == null ? "상담 문의" : `${n.toLocaleString("ko-KR")}원`;
