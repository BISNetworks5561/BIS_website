/**
 * 섹션별 마케팅 카피. 회사 실제 정보(전화·상호·요금 등)는 site.config.ts 참고.
 */
import { siteConfig } from "@/site.config";

export const nav = [
  { label: "특장점", href: "#features" },
  { label: "요금안내", href: "#pricing" },
  { label: "가입혜택", href: "#benefits" },
  { label: "개통절차", href: "#process" },
  { label: "고객후기", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "상담신청", href: "#consult" },
];

export const hero = {
  eyebrow: siteConfig.brand.tagline,
  title: ["아직도 PC 대수 늘었다고", "인터넷 요금 더 내십니까?"],
  subtitle:
    "LG U+ 오피스넷은 PC 대수 무제한, 고정IP 최대 20개, 광케이블 최대 10Gbps. 사무실 전용 기업인터넷을 가입비·설치비 0원으로 시작하세요.",
  bullets: ["PC 대수 무제한", "고정IP 최대 20개", "광케이블 최대 10Gbps", "가입비·설치비 0원"],
  primaryCta: "무료 상담 신청",
  secondaryCta: "전화 상담",
  note: "전화 한 통이면 당일 맞춤 견적을 받아보실 수 있습니다.",
};

export const features = {
  title: "일반 인터넷과는 차원이 다릅니다",
  subtitle: "LG U+ 오피스넷 4대 핵심 특장점",
  items: [
    {
      icon: "zap",
      title: "광케이블 전용망",
      desc: "사무실까지 광케이블을 직접 구성해 최대 10Gbps. 업로드·다운로드 대칭 속도로 클라우드·화상회의도 끊김 없이.",
    },
    {
      icon: "monitor",
      title: "PC 대수 무제한",
      desc: "PC를 몇 대 연결하든 추가 요금 0원. 직원이 늘어도 회선 하나로 충분합니다.",
    },
    {
      icon: "server",
      title: "고정IP 최대 20개",
      desc: "서버·CCTV·VPN·원격접속에 필수인 고정IP를 최대 20개까지 제공합니다.",
    },
    {
      icon: "headset",
      title: "365일 24시간 장애센터",
      desc: "기업 전담 장애센터가 연중무휴 대기. 장애 발생 시 우선 출동으로 업무 중단을 최소화합니다.",
    },
  ],
};

export const concerns = {
  title: "이런 고민, 오피스넷이 해결합니다",
  subtitle: "고객 고민 해결",
  items: [
    {
      q: "PC를 늘렸더니 인터넷이 느려졌어요",
      a: "가정용 회선은 단말 수에 제한이 있습니다. 오피스넷은 PC 대수 제한 없이 무제한으로 연결하세요.",
    },
    {
      q: "IP가 자꾸 바뀌어 서버 접속이 안 돼요",
      a: "고정IP를 최대 20개까지 제공해 서버·CCTV·VPN 원격접속이 안정적으로 유지됩니다.",
    },
    {
      q: "장애가 나면 언제 올지 모릅니다",
      a: "기업 전담 장애센터가 365일 24시간 운영되며, 기업 고객 우선 출동으로 빠르게 복구합니다.",
    },
    {
      q: "기업인터넷 요금이 얼마인지 모르겠어요",
      a: "사무실 규모와 용도에 맞춰 월 요금을 투명하게 설계해 드립니다. 결합 시 추가 할인까지.",
    },
  ],
};

export const industries = {
  title: "업종별로 오피스넷을 활용하는 방법이 다릅니다",
  subtitle: "업종별 추천",
  items: [
    {
      icon: "building",
      name: "일반 기업 · 사무실",
      desc: "직원 PC 다수 연결, 그룹웨어·클라우드 협업",
      rec: "500M 유동IP",
    },
    {
      icon: "code",
      name: "IT · 스타트업 · 무역",
      desc: "개발 서버, VPN, 대용량 파일 송수신",
      rec: "1G 고정IP",
    },
    {
      icon: "hospital",
      name: "병원 · 금융 · 학원",
      desc: "EMR·POS 안정성, CCTV 원격 관제",
      rec: "500M 고정IP",
    },
    {
      icon: "truck",
      name: "건설 · 유통 · 물류",
      desc: "현장 사무실 개통, 창고 CCTV, 다지점 연결",
      rec: "100M~500M + CCTV 결합",
    },
  ],
};

export const pricing = {
  title: "부담 없는 비용으로 누리는 기업 전용망",
  subtitle: "요금 안내",
  tabs: [
    { key: "standalone", label: "오피스넷 단독" },
    { key: "bundle", label: "결합 요금" },
  ] as const,
  ipHelp: {
    dynamic: "IP가 주기적으로 바뀜. 일반 사무 업무·웹·클라우드 사용에 적합",
    static: "IP가 고정됨. 서버·CCTV·VPN·원격접속이 필요할 때 필수",
  },
  cta: "이 요금으로 상담받기",
};

export const benefits = {
  title: `${siteConfig.brand.name}로 가입하시면 추가 혜택까지 드립니다`,
  subtitle: "가입 혜택",
  items: [
    {
      icon: "gift",
      title: "초기 비용 부담 제로",
      desc: "가입비·설치비·초기 공사비 0원. 첫 달부터 월 요금만 납부하세요.",
    },
    {
      icon: "wifi",
      title: "기가 와이파이 공유기 무상 지원",
      desc: "기가급 무선 공유기 및 장비랙을 무상으로 지원해 드립니다.",
    },
    {
      icon: "chart",
      title: "요금 최적화 맞춤 설계",
      desc: "PC 수·업종·건물 환경을 분석해 과하지도 부족하지도 않은 요금제를 설계합니다.",
    },
    {
      icon: "tools",
      title: "사무실 네트워크 공사 지원",
      desc: "랜 공사·배선 정리·스위치 구성까지 전문 엔지니어가 함께합니다.",
    },
  ],
  note: "혜택은 가입 상품·지역·프로모션 기간에 따라 달라질 수 있습니다. 자세한 내용은 상담 시 안내드립니다.",
};

export const process = {
  title: "전화 한 통이면 됩니다",
  subtitle: "개통 절차 4단계",
  steps: [
    { title: "전화 · 온라인 상담", desc: "사무실 환경과 필요 사항을 확인합니다." },
    { title: "최적 요금 맞춤 설계", desc: "속도·IP·결합 여부를 반영한 견적을 당일 제안합니다." },
    { title: "계약 및 개통 신청", desc: "비대면 계약 후 LG U+ 개통 일정을 잡아 드립니다." },
    { title: "설치 완료 · 사후 관리", desc: "설치 후에도 장애·변경·이전 모두 저희가 처리합니다." },
  ],
  leadTime: "평균 개통 소요: 신청 후 3~5 영업일 (지역·건물 환경에 따라 상이)",
};

export const trust = {
  title: "믿고 맡기셔도 됩니다",
  subtitle: "신뢰 지표 · 수상",
  points: [
    `SINCE ${siteConfig.company.since} · LG U+ 기업통신 서비스 전문`,
    "최적의 네트워크 환경 및 통신 요금 설계",
    "네트워크 통신 장비 재고 보유 · 즉시 대응",
    "설치부터 사후지원까지 한 번에",
  ],
};

export const reviews = {
  title: "고객이 직접 말하는 오피스넷",
  subtitle: "고객 후기",
  items: [
    {
      name: "건설사 A사 · 총무팀",
      industry: "건설",
      rating: 5,
      text: "현장 사무실마다 개통이 번거로웠는데 한 곳에서 다 처리해 주니 편합니다. 고정IP로 CCTV 관제도 안정적이에요.",
    },
    {
      name: "IT 컨설팅 B사 · 대표",
      industry: "IT",
      rating: 5,
      text: "1G 고정IP로 바꾸고 개발 서버 접속과 화상회의 끊김이 사라졌습니다. 요금은 오히려 줄었어요.",
    },
    {
      name: "물류센터 C사 · 관리자",
      industry: "물류",
      rating: 5,
      text: "PC 30대 넘게 물려도 추가 요금이 없다는 게 제일 좋습니다. 장애 문의 시 응대가 빠릅니다.",
    },
    {
      name: "학원 D · 원장",
      industry: "교육",
      rating: 5,
      text: "인터넷·전화·CCTV를 결합했더니 월 통신비가 확 줄었습니다. 설치 기사님도 친절했어요.",
    },
  ],
};

export const bundles = {
  title: "묶을수록 요금이 내려갑니다",
  subtitle: "추천 결합상품",
  items: [
    {
      icon: "phone",
      name: "기업 인터넷전화",
      desc: "대표번호·착신전환·통화녹음. 인터넷과 결합 시 월 요금 추가 할인.",
      tag: "인터넷 + 전화",
    },
    {
      icon: "wifi",
      name: "와이파이 오피스",
      desc: "사무실 전체 무선 커버리지. 기업용 AP 설치·관리까지 포함.",
      tag: "인터넷 + Wi-Fi",
    },
    {
      icon: "camera",
      name: "지능형 CCTV",
      desc: "고화질 IP 카메라 + 클라우드 저장. 스마트폰으로 실시간 원격 관제.",
      tag: "인터넷 + CCTV",
    },
  ],
};

export const faq = {
  title: "기업인터넷 가입 전, 자주 묻는 질문",
  subtitle: "FAQ",
  items: [
    {
      q: "PC가 몇 대이든 추가 비용 없이 사용할 수 있나요?",
      a: "네. 오피스넷은 단말 수 제한이 없어 PC·노트북·프린터 등 몇 대를 연결하든 추가 요금이 없습니다. 다만 동시 사용량이 많다면 500M 이상 속도를 권장합니다.",
    },
    {
      q: "고정IP와 유동IP 중 무엇을 선택해야 하나요?",
      a: "서버 운영, CCTV 원격 접속, VPN, 사내 시스템 외부 접속이 필요하면 고정IP가 필수입니다. 일반 사무·웹·클라우드 업무만 한다면 유동IP로 충분합니다. 상담 시 용도에 맞게 안내드립니다.",
    },
    {
      q: "가장 저렴하게 가입하는 방법은 무엇인가요?",
      a: "인터넷전화·와이파이·CCTV 중 하나 이상을 결합하면 월 요금이 추가로 할인됩니다. 결합 시 단독 대비 월 최대 8,000원 이상 절감 가능하며, 프로모션에 따라 혜택이 더해질 수 있습니다.",
    },
    {
      q: "인터넷 장애가 나면 A/S 처리는 얼마나 빠른가요?",
      a: "LG U+ 기업 전담 장애센터가 365일 24시간 운영됩니다. 기업 고객은 우선 출동 대상이며, 저희 센터에서도 접수부터 복구 확인까지 함께 관리해 드립니다.",
    },
    {
      q: "약정 기간과 위약금은 어떻게 되나요?",
      a: "기본 3년 약정이며 1년·2년 약정도 선택 가능합니다(요금 상이). 약정 기간 내 해지 시 잔여 기간에 따른 할인반환금이 발생할 수 있으며, 사무실 이전 시에는 이전 설치로 약정을 유지할 수 있습니다.",
    },
    {
      q: "판매센터를 통해 가입하면 어떤 장점이 있나요?",
      a: "LG U+ 공식 요금 그대로 가입하면서 판매센터 자체 혜택(장비 지원·공사 지원 등)을 추가로 받을 수 있습니다. 또한 가입 후 변경·이전·장애 문의를 전담 담당자가 처리해 드립니다.",
    },
  ],
};

export const consult = {
  title: "무료 상담 신청",
  subtitle: "당일 맞춤 설계 제안",
  desc: "간단히 남겨주시면 영업시간 내 담당자가 빠르게 연락드립니다. 급하시면 대표전화로 바로 문의하세요.",
  privacy:
    "수집 항목: 담당자명, 연락처, 회사명, 이메일, 문의내용 / 수집 목적: 상담 및 가입 안내 / 보유 기간: 상담 완료 후 1년 (관련 법령에 따라 보관이 필요한 경우 해당 기간). 동의를 거부할 수 있으나 거부 시 상담 신청이 제한됩니다.",
  speeds: ["100M", "500M", "1G", "2.5G", "5G", "10G"],
};
