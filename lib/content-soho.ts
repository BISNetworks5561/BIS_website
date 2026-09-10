/**
 * 소호인터넷 페이지 카피. 요금은 site.config.ts 의 pricingSoho 참고.
 */

export const sohoNav = [
  { label: "특장점", href: "#features" },
  { label: "가입혜택", href: "#benefits" },
  { label: "상품상세안내", href: "#detail" },
  { label: "요금안내", href: "#pricing" },
  { label: "개통절차", href: "#process" },
  { label: "상담신청", href: "#consult" },
] as const;

export const sohoHero = {
  eyebrow: "LG U+ 소호인터넷",
  title: ["매장 · 소규모 사무실 인터넷,", "필요한 만큼만 합리적으로"],
  subtitle:
    "LG U+ 소호인터넷은 100M~1G 속도를 부담 없는 요금으로 제공합니다. POS·CCTV·손님 Wi-Fi까지 한 회선으로, 가입비·설치비 0원.",
  bullets: ["100M~1G 선택", "가입비·설치비 0원", "전화·IPTV·CCTV 결합 할인", "기가 와이파이 무상"],
  primaryCta: "무료 상담 신청",
  secondaryCta: "전화 상담",
  note: "매장 주소만 알려주시면 개통 가능 여부와 요금을 바로 안내해 드립니다.",
  card: {
    title: "소상공인 전용 인터넷",
    stats: [
      { k: "속도", v: "100M~1G" },
      { k: "가입·설치비", v: "0원" },
      { k: "결합 할인", v: "전화·TV·CCTV" },
      { k: "Wi-Fi 공유기", v: "무상" },
    ],
  },
};

export const sohoFeatures = {
  title: "우리 매장에 딱 맞는 인터넷, 이유가 있습니다",
  subtitle: "소호인터넷 4대 특장점",
  items: [
    {
      icon: "zap",
      title: "속도 선택의 자유",
      desc: "카드단말만 쓰는 매장은 100M, 손님 Wi-Fi가 많은 카페는 500M, 대용량 업로드가 잦은 스튜디오는 1G. 필요한 만큼만 고르세요.",
    },
    {
      icon: "gift",
      title: "초기 비용 0원",
      desc: "가입비·설치비·기본 공사비가 없습니다. 오픈 준비로 지출이 많은 시기에 부담을 줄여 드립니다.",
    },
    {
      icon: "wifi",
      title: "기가 와이파이 무상 제공",
      desc: "손님용·직원용 Wi-Fi를 분리할 수 있는 기가급 공유기를 무상으로 드립니다.",
    },
    {
      icon: "headset",
      title: "장애 시 빠른 출동",
      desc: "인터넷이 멈추면 매출이 멈춥니다. LG U+ 장애센터 접수와 판매센터 전담 관리로 빠르게 복구합니다.",
    },
  ],
};

export const sohoBenefits = {
  title: "소호인터넷 가입 시 드리는 혜택",
  subtitle: "가입 혜택",
  items: [
    { icon: "gift", title: "가입비 · 설치비 0원", desc: "초기 비용 없이 월 요금만 납부하세요." },
    { icon: "wifi", title: "기가 와이파이 공유기 무상", desc: "손님용 Wi-Fi 분리 설정까지 도와드립니다." },
    { icon: "phone", title: "인터넷전화 결합 시 전화기 무상", desc: "매장 대표번호용 IP 전화기를 무상 제공합니다." },
    { icon: "camera", title: "CCTV 결합 할인", desc: "지능형 CCTV와 함께 가입하면 월 요금이 추가로 할인됩니다." },
    { icon: "chart", title: "요금 맞춤 설계", desc: "업종·좌석 수·단말 수를 보고 과하지 않은 요금제를 제안합니다." },
  ],
  note: "혜택은 가입 상품·지역·프로모션 기간에 따라 달라질 수 있습니다. 자세한 내용은 상담 시 안내드립니다.",
};

export const sohoDetail = {
  title: "소호인터넷, 이렇게 구성됩니다",
  subtitle: "상품 상세 안내",
  desc: "속도별 추천 업종과 제공 장비, 함께 쓰면 좋은 결합 서비스를 정리했습니다.",
  included: {
    title: "기본 제공",
    items: [
      { icon: "wifi", name: "기가 와이파이 공유기", desc: "손님용 · 직원용 SSID 분리" },
      { icon: "server", name: "모뎀 · 설치 공사", desc: "매장 내 배선 정리 포함" },
      { icon: "headset", name: "장애 접수 · 출동", desc: "LG U+ 장애센터 + 전담 관리" },
      { icon: "shield", name: "유동IP 1개", desc: "고정IP 필요 시 추가 가능" },
    ],
  },
  addons: {
    title: "함께 쓰면 좋은 결합 서비스",
    items: [
      { icon: "phone", name: "인터넷전화 · 대표번호", desc: "착신전환 · 통화녹음 · 전화기 무상" },
      { icon: "camera", name: "지능형 CCTV", desc: "스마트폰 실시간 확인 · 클라우드 저장" },
      { icon: "monitor", name: "IPTV", desc: "매장용 채널 · 음악 서비스" },
    ],
  },
  compare: {
    title: "오피스넷(기업인터넷)과 무엇이 다른가요?",
    rows: [
      { label: "추천 대상", soho: "매장 · 1~10인 소규모 사무실", office: "10인 이상 사무실 · 서버 운영 기업" },
      { label: "속도", soho: "100M ~ 1G", office: "100M ~ 10G (대칭)" },
      { label: "고정IP", soho: "필요 시 추가", office: "최대 20개" },
      { label: "PC 연결", soho: "일반 사용 기준", office: "대수 무제한" },
      { label: "장애 대응", soho: "장애센터 접수 · 출동", office: "기업 전담 장애센터 365일 24시간" },
    ],
    note: "서버·VPN·다수 고정IP가 필요하면 오피스넷을 권장합니다. 상담 시 매장 환경에 맞춰 안내드립니다.",
  },
};

export const sohoPricingCopy = {
  title: "매장 규모에 맞는 요금을 고르세요",
  subtitle: "요금 안내",
  /** 탭은 site.config.pricingSoho.products 에서 가져옴 */
  cta: "이 요금으로 상담받기",
  notes: [
    "고정IP가 필요한 경우(외부에서 CCTV·POS 서버 접속 등) 추가 요금으로 신청할 수 있어요.",
    "개통 후 매장을 이전하면 이전 설치로 약정을 유지할 수 있어요. 이전 설치비는 상담 시 안내드립니다.",
    "표시 요금은 3년 약정 기준이며, 1년·2년 약정은 요금이 달라집니다.",
    "인터넷전화, IPTV, CCTV 중 1개 이상 함께 가입하면 결합 할인이 적용됩니다.",
  ],
};

export const sohoProcess = {
  title: "오픈 일정에 맞춰 개통해 드립니다",
  subtitle: "개통 절차 4단계",
  steps: [
    { title: "전화 · 온라인 상담", desc: "매장 주소와 업종, 필요한 서비스를 확인합니다." },
    { title: "요금 설계 · 개통 가능 확인", desc: "건물 회선 여부를 확인하고 당일 견적을 드립니다." },
    { title: "계약 · 설치 일정 예약", desc: "비대면 계약 후 오픈 일정에 맞춰 설치일을 잡습니다." },
    { title: "설치 · 와이파이 세팅", desc: "공유기 설치와 손님용 Wi-Fi 설정까지 마무리합니다." },
  ],
  leadTime: "평균 개통 소요: 신청 후 2~4 영업일 (지역·건물 환경에 따라 상이)",
};
