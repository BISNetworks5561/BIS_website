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
    nameEn: "BISNETWORKS",
    /** 로고 아래 도메인 표기 */
    domainLabel: "bisnetworks.co.kr",
    /** 헤더/히어로에 노출되는 부제 */
    tagline: "LG U+ 오피스넷 공식 판매센터",
    /** 로고 이미지가 없을 때 사용하는 텍스트 로고 */
    logoText: "BIS",
    /** 육각 마크 단독 (정사각) */
    logoSrc: "/logo-mark.png",
    /** 가로형 풀 로고 (마크 + BISNETWORKS 워드마크), 비율 4.03:1 */
    logoFullSrc: "/logo-full.png",
    /** 세로형 원본 구성 로고 */
    logoStackedSrc: "/logo-stacked.png",
  },

  /** 연락처 */
  contact: {
    /** 대표전화 (tel: 링크용) — 기존 bisnetworks.co.kr 사이트 기준 */
    phone: "02-6956-9999",
    /** 화면 표시용 */
    phoneDisplay: "02-6956-9999",
    /** 담당 프로 직통 */
    manager: { name: "한진우 프로", phone: "010-5856-5561" },
    /** 장애 접수 전화 (LG U+ 기업 장애센터) */
    faultPhone: "1544-8585",
    /** 이메일 */
    email: "bisnetworks@kakao.com",
    /** TODO 카카오톡 채널 URL (없으면 빈 문자열) */
    kakaoUrl: "",
    /** 상담 가능 시간 */
    hours: "평일 09:00 ~ 18:00 (주말·공휴일 휴무)",
  },

  /** 사업자 정보 (푸터) */
  company: {
    /** 상호 (사업자등록증 기준) */
    legalName: "비아이에스네트웍스",
    /** 대표자 (사업자등록증 기준) */
    ceo: "한진우",
    /** 사업자등록번호 (사업자등록증 기준) */
    bizNumber: "476-01-04248",
    /** 사업장 주소 */
    address: "서울시 강남구 헌릉로569길 21-30 강남드림하이 1층 109호",
    /** 개인정보보호 책임자 */
    privacyOfficer: "한진우",
    /** 개업연도 (사업자등록증 기준) */
    since: 2026,
  },

  /** 사이트 메타 */
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bisnetworks.co.kr",
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
      { speed: "100M", dynamic: 25000, static: 35000, popular: false },
      { speed: "500M", dynamic: 35000, static: 40000, popular: true, badge: "가성비 1위" },
      { speed: "1G", dynamic: 40000, static: 50000, popular: true, badge: "BEST" },
      { speed: "2.5G", dynamic: 50000, static: 55000, popular: false },
      { speed: "5G", dynamic: 70000, static: 70000, popular: false },
      { speed: "10G", dynamic: 100000, static: 105000, popular: false },
    ],
    bundleNote: "결합 요금은 오피스넷에 인터넷전화, IPTV, CCTV 중 1개 이상 함께 가입 시 적용되는 요금입니다.",
    /** 고정IP 추가 시 개당 요금 (TODO) */
    extraStaticIp: 5500,
    maxStaticIp: 20,
  },

  /**
   * 추천 결합 패키지 (기존 bisnetworks.co.kr 게시 가격, 3년 약정·부가세 포함 기준)
   * ※ 현재 사이트에서는 "추천 결합상품" 섹션을 삭제해 미사용. 필요 시 재사용 가능.
   * price 가 null 이면 "상담 문의"로 표시됩니다.
   */
  bundlePackages: [
    {
      name: "인터넷 1G + AI 전화 + CCTV",
      items: ["오피스넷 1G", "U+ AI 전화", "CCTV 에스원 안심 1대"],
      regularPrice: 133100,
      price: 48400,
      popular: true,
    },
    {
      name: "인터넷 100M + AI 전화",
      items: ["오피스넷 100M", "U+ AI 전화"],
      regularPrice: 56100,
      price: 28300,
      popular: false,
    },
    {
      name: "인터넷 1G + AI 전화 + CCTV + IPTV",
      items: ["오피스넷 1G", "U+ AI 전화", "CCTV", "IPTV 프리미엄"],
      regularPrice: 155100,
      price: 68200,
      popular: false,
    },
  ],
  bundlePackagesNote: "3년 약정 · 부가세 포함 월 요금. 정상가 대비 결합 할인 적용 금액이며 프로모션에 따라 달라질 수 있습니다.",

  /** 신뢰 지표 (TODO 실제 수치로 교체) */
  stats: [
    { value: 18800, suffix: "+", label: "누적 기업 고객" },
    { value: 83800, suffix: "회", label: "전문 컨설팅" },
    { value: 5, suffix: "일", label: "평균 개통 소요 (영업일)" },
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
