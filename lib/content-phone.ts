/**
 * 기업 인터넷전화 페이지 카피. 요금·단말 정보는 site.config.ts 의 pricingPhone 참고.
 * 참고: LG U+ 기업 인터넷전화 상품 페이지 (B000000149)
 */

export const phoneNav = [
  { label: "특장점", href: "#features" },
  { label: "가입혜택", href: "#benefits" },
  { label: "상품상세안내", href: "#detail" },
  { label: "요금안내", href: "#pricing" },
  { label: "개통절차", href: "#process" },
  { label: "상담신청", href: "#consult" },
] as const;

export const phoneHero = {
  eyebrow: "LG U+ 기업 인터넷전화",
  title: ["일반 전화보다 최대 30% 저렴한", "기업 전용 인터넷전화"],
  subtitle:
    "업종과 규모에 맞춰 일반형 · 센트릭스 · 교환기 설치형 중 고를 수 있습니다. 기존 번호 그대로, U+ 인터넷전화 가입자끼리는 무제한 무료 통화.",
  bullets: ["기존 번호 그대로 사용", "U+ 가입자 간 무료 통화", "IP-520GA 전화기 무료 제공", "인터넷 결합 시 기본료 50% 할인"],
  primaryCta: "무료 상담 신청",
  secondaryCta: "전화 상담",
  note: "회선 수와 업종만 알려주시면 가장 저렴한 구성으로 당일 견적을 드립니다.",
  device: {
    model: "IP-520GA",
    caption: "컬러 LCD · 단축 60개 · 기가 지원",
    badge: "전화기 무료 제공",
  },
};

export const phoneFeatures = {
  title: "사무실 전화, 인터넷전화로 바꾸면 달라지는 것",
  subtitle: "기업 인터넷전화 4대 특장점",
  items: [
    {
      icon: "chart",
      title: "통화료 최대 30% 절감",
      desc: "일반 전화 대비 시내·시외 통화료가 저렴하고, U+ 인터넷전화 가입자끼리는 무제한 무료입니다. 지점·거래처가 U+면 통화료가 0원.",
    },
    {
      icon: "phone",
      title: "기존 번호 그대로",
      desc: "쓰던 대표번호·직통번호를 번호이동으로 그대로 가져옵니다. 명함·간판을 바꿀 필요가 없습니다.",
    },
    {
      icon: "server",
      title: "규모별 3가지 유형",
      desc: "1~5명은 일반형, 5~30명은 내선·당겨받기가 되는 센트릭스, 30회선 이상 다지점은 교환기 설치형. 커지면 바꾸면 됩니다.",
    },
    {
      icon: "headset",
      title: "기업 전담 A/S",
      desc: "기업 인터넷전화 시장 매출 1위(KRG 25년 하반기) LG U+ 망과 전담 장애센터. 교환기는 3년간 무료 유지보수.",
    },
  ],
};

export const phoneBenefits = {
  title: "BIS네트웍스로 가입하시면 드리는 혜택",
  subtitle: "가입 혜택",
  items: [
    { icon: "phone", title: "IP-520GA 전화기 무료 제공", desc: "컬러 LCD · 단축 60개 · 기가 지원 단말을 회선 수만큼 무료로 드립니다." },
    { icon: "gift", title: "인터넷 결합 시 기본료 50% 할인", desc: "U+ 인터넷(오피스넷·소호)과 함께 쓰면 일반형 기본료 월 2,200원 → 1,100원." },
    { icon: "tools", title: "설치 · 내선 세팅 지원", desc: "전화기 배치, 내선번호, 착신전환까지 설치 당일 세팅해 드립니다." },
    { icon: "zap", title: "번호이동 대행", desc: "타사 번호 그대로 옮기는 절차를 대신 처리합니다." },
    { icon: "shield", title: "전담 담당자 사후 관리", desc: "회선 추가·이전·부가서비스 변경을 전화 한 통으로." },
  ],
  note: "혜택은 가입 유형·회선 수·프로모션 기간에 따라 달라질 수 있습니다. 자세한 내용은 상담 시 안내드립니다.",
};

export const phoneDetail = {
  title: "우리 회사에 맞는 유형을 고르세요",
  subtitle: "상품 상세 안내",
  desc: "직원 수와 통화 방식에 따라 일반형 · 센트릭스 · 교환기 설치형으로 나뉩니다. 단말기는 IP-520GA를 기본 제공합니다.",
  types: [
    {
      key: "basic",
      name: "일반형",
      target: "1~5명 규모 · 전화 수신 위주 소형 매장·사무실",
      points: ["기본료 월 2,200원 (U+ 인터넷 결합 시 1,100원)", "U+ 가입자 간 무제한 무료", "착신전환 · 통화연결음 등 부가서비스 선택"],
      badge: "",
    },
    {
      key: "centrex",
      name: "센트릭스 (고급형)",
      target: "5~30명 규모 중·소 기업",
      points: ["내선통화 · 당겨받기 · 돌려주기 기본 제공", "자유통화 요금제 월 5,500원~ (무료통화 25분~1,700분)", "교환기 없이 사무실 전화 시스템 구축"],
      badge: "추천",
    },
    {
      key: "dcs",
      name: "교환기 설치형 (DCS)",
      target: "30회선 이상 · 다지점 운영 기업·기관",
      points: ["교환기 설치로 대규모 통신 환경 구축", "전수녹취 · 멀티라인 등 DCS 전용 부가서비스", "교환기 3년 무료 유지보수"],
      badge: "",
    },
  ],
  device: {
    title: "기본 제공 단말기 IP-520GA",
    specs: [
      { k: "디스플레이", v: "컬러 LCD" },
      { k: "단축 버튼", v: "60개" },
      { k: "네트워크", v: "기가(GbE) 지원 · PC 연결 포트" },
      { k: "제공 조건", v: "무료 제공 (약정 기준)" },
    ],
    others: [
      { model: "HYC-P1200L", desc: "2.8인치 LCD · 전화번호부 2,000개", price: "무료 제공" },
      { model: "IP-450S", desc: "흑백 LCD · 단축 8개", price: "22,000원" },
      { model: "IP-700S", desc: "3.5인치 컬러 LCD", price: "110,000원" },
      { model: "CPG-4020N", desc: "팩스 · 도어락 연결용 부가기기", price: "월 1,100원 임대" },
    ],
  },
  addons: {
    title: "부가서비스 (월, 부가세 포함)",
    items: [
      { name: "내선통화", price: "무료", note: "고급형 이상" },
      { name: "착신전환", price: "550원", note: "" },
      { name: "통화연결음", price: "2,420원", note: "" },
      { name: "ARS (1단계)", price: "5,500원", note: "" },
      { name: "레터링 (Office형)", price: "3,300~13,200원", note: "" },
      { name: "전수녹취", price: "1,100원", note: "DCS형" },
      { name: "멀티라인", price: "1,100원", note: "DCS형" },
    ],
  },
};

export const phonePricingCopy = {
  title: "기본료와 통화료, 숨김 없이 안내합니다",
  subtitle: "요금 안내",
  cta: "이 요금으로 상담받기",
  notes: [
    "표시 요금은 LG U+ 공시 기준(부가세 포함)이며, 약정·결합 조건과 프로모션에 따라 달라질 수 있습니다.",
    "신규 설치비 22,000원, 이전 설치비 11,000원, 번호이동 수수료 2,000원이 별도이며 프로모션에 따라 지원될 수 있습니다.",
    "자동이체 신청 시 요금의 1%가 할인됩니다.",
    "U+ 인터넷 미가입 시에도 인터넷전화 단독 가입이 가능합니다.",
  ],
};

export const phoneProcess = {
  title: "상담부터 개통까지 전담 담당자가 함께합니다",
  subtitle: "개통 절차 4단계",
  steps: [
    { title: "전화 · 온라인 상담", desc: "회선 수, 업종, 기존 통신사와 번호를 확인합니다." },
    { title: "유형 · 요금 설계", desc: "일반형 / 센트릭스 / DCS 중 맞는 유형과 자유통화 요금제를 제안합니다." },
    { title: "계약 · 번호이동 신청", desc: "비대면 계약 후 번호이동과 개통 일정을 잡습니다." },
    { title: "설치 · 내선 세팅", desc: "IP-520GA 설치, 내선번호·착신전환·통화연결음 설정까지 마무리합니다." },
  ],
  leadTime: "평균 개통 소요: 신청 후 3~5 영업일 (번호이동 포함 시 다소 추가)",
};
