/**
 * 지능형 CCTV 페이지 카피. 요금·카메라 정보는 site.config.ts 의 pricingCctv 참고.
 * 참고: LG U+ U+지능형CCTV 상품 페이지 (B000000007)
 */

export const cctvNav = [
  { label: "특장점", href: "#features" },
  { label: "상품상세안내", href: "#detail" },
  { label: "서비스구성도", href: "#diagram" },
  { label: "요금안내", href: "#pricing" },
  { label: "개통절차", href: "#process" },
  { label: "상담신청", href: "#consult" },
] as const;

export const cctvHero = {
  eyebrow: "LG U+ 지능형 CCTV",
  title: ["고화질 영상은 클라우드에,", "침입은 AI가 알려드립니다"],
  subtitle:
    "U+지능형CCTV는 별도 저장장치 없이 클라우드에 영상을 보관하고, 사람과 사물을 구분하는 AI가 침입·카메라 훼손을 감지해 스마트폰으로 알립니다. 에스원 긴급출동까지 연계됩니다.",
  bullets: ["Full HD 2MP · 야간 적외선", "클라우드 15일 기본 보관", "AI 침입·훼손 감지 알림", "에스원 월 2회 무료 출동"],
  primaryCta: "무료 상담 신청",
  secondaryCta: "전화 상담",
  note: "매장 평수와 출입구 수만 알려주시면 카메라 대수와 설치 위치를 잡아 드립니다.",
  card: {
    title: "매장·사무실 원격 관제",
    stats: [
      { k: "해상도", v: "1920×1080" },
      { k: "저장", v: "클라우드 15일" },
      { k: "AI 감지", v: "침입 · 훼손" },
      { k: "출동", v: "에스원 월 2회" },
    ],
  },
};

export const cctvFeatures = {
  title: "녹화기만 두는 CCTV와는 다릅니다",
  subtitle: "지능형 CCTV 4대 특장점",
  items: [
    {
      icon: "shield",
      title: "AI 영상분석",
      desc: "사람과 사물을 분류해 오탐이 적습니다. 침입 감지·카메라 훼손 감지는 기본, 배회·유기·불꽃/연기 감지는 선택 추가.",
    },
    {
      icon: "server",
      title: "클라우드 저장",
      desc: "녹화기(NVR)·하드디스크가 필요 없습니다. 기본 15일 보관, 필요하면 30·60·90일 추가. 도난·화재로 영상이 사라질 걱정이 없습니다.",
    },
    {
      icon: "monitor",
      title: "앱 · PC로 어디서나",
      desc: "U+지능형CCTV 앱과 PC 프로그램으로 실시간·녹화 영상 확인. PC에서는 최대 384대 관리, 공유 아이디 5개 기본 제공.",
    },
    {
      icon: "headset",
      title: "에스원 연계 보안",
      desc: "긴급 상황 시 에스원 출동 월 2회 무료(추가 건당 33,000원), 방범 스티커 제공. 프리미엄 가입 시 무제한 출동·침입탐지센서.",
    },
  ],
};

export const cctvDetail = {
  title: "공간에 맞는 카메라를 고르세요",
  subtitle: "상품 상세 안내",
  desc: "실내 돔형부터 실외 뷸렛, 줌이 되는 가변초점, 360도 회전 PTZ까지. 모두 Full HD 2MP · 야간 적외선 · 방수(실외) 사양입니다.",
  cameras: [
    { model: "D-1200D", type: "실내 돔형", spec: "3.6mm · 수평 87°", fit: "매장 홀 · 사무실 내부", badge: "기본" },
    { model: "D-2200WD", type: "실내 광각", spec: "2.8mm · 수평 110°", fit: "좁은 공간을 넓게", badge: "" },
    { model: "D-1200B", type: "실외 뷸렛", spec: "2.8mm · 수평 87° · IP67", fit: "출입구 · 주차장 · 외벽", badge: "인기" },
    { model: "D-2200VD", type: "가변초점 (실내)", spec: "2.7~13.5mm · 광학 5배 줌", fit: "카운터 · 금고 정밀 관찰", badge: "" },
    { model: "D-2200VB", type: "가변초점 (실외)", spec: "2.7~13.5mm · 광학 5배 줌 · IP67", fit: "넓은 외부 · 창고", badge: "" },
    { model: "D-3200PTZD", type: "PTZ (실내)", spec: "360° 회전 · 광학 4배 줌 · 30fps", fit: "넓은 홀 한 대로 커버", badge: "" },
  ],
  commonSpec: [
    { k: "해상도", v: "1920×1080 (2MP)" },
    { k: "프레임", v: "60fps (PTZ 30fps)" },
    { k: "야간 적외선", v: "30~50m 가시거리" },
    { k: "내구성", v: "IP67 방수 · IK10 충격보호 (실외형)" },
  ],
  ai: {
    title: "AI 감지 기능",
    basic: ["침입 감지", "카메라 훼손 감지"],
    paid: ["배회 감지", "유기(방치물) 감지", "불꽃 · 연기 감지"],
    paidNote: "선택 AI 감지는 카메라 1대당 월 2,200원",
  },
  app: {
    title: "앱 · PC 프로그램",
    points: [
      "실시간 영상 · 녹화 영상 확인, 감지 알림 수신",
      "PC 프로그램(cloudcctv.uplus.co.kr)으로 최대 384대 통합 관리",
      "공유 아이디 5개 기본 제공 (직원·가족과 공유)",
      "녹화 영상은 앱·PC에서 다운로드해 보관 가능",
    ],
  },
};

export const cctvDiagram = {
  title: "카메라에서 스마트폰까지, 이렇게 연결됩니다",
  subtitle: "서비스 구성도",
  desc: "매장에 설치한 카메라가 인터넷을 통해 U+지능형CCTV 클라우드 플랫폼으로 영상을 보내고, 사장님은 앱·PC로 언제든 확인합니다.",
  nodes: [
    { icon: "camera", title: "고객사 카메라", desc: "실내·실외 카메라 최대 16대", tag: "매장 · 사무실" },
    { icon: "server", title: "PoE 스위치 · 인터넷", desc: "U+ 소호/오피스넷 또는 타사 인터넷", tag: "연결" },
    { icon: "shield", title: "U+지능형CCTV 플랫폼", desc: "클라우드 저장 15일 · AI 영상분석", tag: "LG U+ 클라우드" },
    { icon: "monitor", title: "앱 · PC 프로그램", desc: "실시간 · 녹화 확인, 침입 알림", tag: "사장님" },
  ],
  side: [
    { icon: "headset", title: "에스원 긴급출동", desc: "감지 알림 → 출동 요청 → 현장 확인 · 관공서 신고" },
    { icon: "phone", title: "장애 접수 1544-8585", desc: "카메라·회선 장애 시 LG U+ 장애센터" },
  ],
  note: "인터넷이 이미 있으면 영업일 기준 5일 내 설치, 인터넷 신규 개통 시 개통 후 1~2일 내 설치됩니다.",
};

export const cctvPricingCopy = {
  title: "약정 기간에 따라 카메라 1대당 월 요금이 달라집니다",
  subtitle: "요금 안내",
  cta: "이 요금으로 상담받기",
  notes: [
    "표시 요금은 LG U+ 공시 기준(부가세 포함), 카메라 1대당 월 요금이며 최대 16대까지 가입할 수 있습니다.",
    "설치비(실내·실외)는 BIS네트웍스 가입 시 지원됩니다.",
    "요금은 월납만 가능하며, 녹화 영상은 15일 경과 후 자동 삭제됩니다(보관 연장 부가서비스 선택 가능).",
    "U+ 인터넷이 없는 지역도 타사 인터넷으로 설치할 수 있습니다.",
  ],
};

export const cctvProcess = {
  title: "상담부터 설치까지 전담 담당자가 함께합니다",
  subtitle: "개통 절차 4단계",
  steps: [
    { title: "전화 · 온라인 상담", desc: "매장 평수, 출입구·사각지대, 실내/실외 여부를 확인합니다." },
    { title: "카메라 구성 · 견적", desc: "카메라 종류와 대수, 약정 기간에 맞춘 월 요금과 설치비를 당일 안내합니다." },
    { title: "계약 · 설치 일정", desc: "인터넷 여부를 확인하고(없으면 함께 개통) 설치일을 예약합니다." },
    { title: "설치 · 앱 세팅", desc: "카메라 설치, 앱 로그인, 감지 구역·알림 설정, 공유 아이디까지 마무리합니다." },
  ],
  leadTime: "평균 설치 소요: 인터넷 기설치 시 영업일 5일 내 · 신규 인터넷 개통 시 개통 후 1~2일",
};
