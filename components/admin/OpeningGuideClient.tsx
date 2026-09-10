"use client";

import { useState } from "react";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

type TabId = "overview" | "process" | "documents" | "templates" | "faq";

interface TabItem {
  id: TabId;
  label: string;
  icon: string;
  badge?: string;
}

const TABS: TabItem[] = [
  { id: "overview", label: "시작하기 & 계정", icon: "🚀" },
  { id: "process", label: "청약·개통 프로세스", icon: "🔄", badge: "5단계" },
  { id: "documents", label: "구비서류 & 체크리스트", icon: "📑" },
  { id: "templates", label: "실무 문자 템플릿", icon: "💬", badge: "복사" },
  { id: "faq", label: "비상연락망 & FAQ", icon: "☎️" },
];

export default function OpeningGuideClient() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  return (
    <div className="p-5 md:p-8">
      {/* 상단 헤더 & 바로가기 히어로 카드 */}
      <div className="mb-6 rounded-3xl border border-brand/20 bg-gradient-to-br from-brand-light/70 via-white to-brand-light/30 p-6 md:p-8 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-sm">
              <span>BIZ 오프닝 시스템</span>
              <span className="h-1 w-1 rounded-full bg-white/60"></span>
              <span className="font-normal opacity-90">실무 매뉴얼</span>
            </div>
            <h1 className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">
              BIS opening 사용법 및 개통 가이드
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
              기업인터넷(오피스넷·소호) 및 결합상품 청약, 서류 심사, 현장 인입 실사부터 최종 개통까지 
              실무 담당자와 영업 파트너를 위한 통합 운영 매뉴얼입니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={siteConfig.links.openingApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-5 py-3.5 text-sm font-black text-white shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>비즈오프닝 앱 열기</span>
              <span className="text-xs">↗</span>
            </a>
            <button
              type="button"
              onClick={() => setPwaModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-line bg-white px-4 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-brand hover:text-brand"
            >
              <span>📱 모바일 홈화면 추가</span>
            </button>
          </div>
        </div>

        {/* 빠른 요약 바 */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-brand/10 pt-5 sm:grid-cols-4">
          <div className="rounded-xl bg-white/80 p-3">
            <span className="text-xs text-muted">앱 정식 주소</span>
            <p className="mt-0.5 font-mono text-xs font-bold text-brand md:text-sm">app.bisnetworks.co.kr</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3">
            <span className="text-xs text-muted">단축 경로</span>
            <p className="mt-0.5 font-mono text-xs font-bold text-slate-700 md:text-sm">/opening 또는 /app</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3">
            <span className="text-xs text-muted">평균 개통 소요</span>
            <p className="mt-0.5 text-xs font-bold text-slate-700 md:text-sm">영업일 기준 3~5일</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3">
            <span className="text-xs text-muted">기업 장애센터</span>
            <p className="mt-0.5 text-xs font-bold text-accent md:text-sm">1544-8585 (24시간)</p>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-6 flex overflow-x-auto rounded-2xl border border-line bg-white p-1.5 shadow-sm">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all md:text-sm",
                active
                  ? "bg-brand text-white shadow-sm"
                  : "text-slate-600 hover:bg-surface hover:text-slate-900"
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    active ? "bg-white/20 text-white" : "bg-brand-light text-brand-dark"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="space-y-6">
        {activeTab === "overview" && <OverviewTab onOpenPwaModal={() => setPwaModalOpen(true)} />}
        {activeTab === "process" && <ProcessTab onCopy={copyToClipboard} copiedId={copiedId} />}
        {activeTab === "documents" && <DocumentsTab />}
        {activeTab === "templates" && <TemplatesTab onCopy={copyToClipboard} copiedId={copiedId} />}
        {activeTab === "faq" && <FaqTab />}
      </div>

      {/* 모바일 홈 화면 추가(PWA) 안내 모달 */}
      {pwaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-base font-black text-slate-900">📱 모바일 홈 화면에 앱 추가하기</h3>
              <button
                type="button"
                onClick={() => setPwaModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-600">
              <div className="rounded-2xl bg-surface p-3.5">
                <p className="font-bold text-slate-900">🍎 iPhone (Safari 브라우저)</p>
                <ol className="mt-1.5 list-decimal space-y-1 pl-4">
                  <li>Safari로 <span className="font-mono text-brand">app.bisnetworks.co.kr</span> 접속</li>
                  <li>하단 중앙의 <strong>공유 아이콘 (네모 위 화살표)</strong> 클릭</li>
                  <li>메뉴 목록에서 <strong>[홈 화면에 추가]</strong> 선택</li>
                  <li>우측 상단 <strong>[추가]</strong>를 누르면 바탕화면에 바로가기 아이콘 생성</li>
                </ol>
              </div>

              <div className="rounded-2xl bg-surface p-3.5">
                <p className="font-bold text-slate-900">🤖 Android (Chrome 브라우저)</p>
                <ol className="mt-1.5 list-decimal space-y-1 pl-4">
                  <li>Chrome으로 <span className="font-mono text-brand">app.bisnetworks.co.kr</span> 접속</li>
                  <li>우측 상단 <strong>더보기 버튼 (점 세 개 ⋮)</strong> 클릭</li>
                  <li><strong>[홈 화면에 추가]</strong> 또는 <strong>[앱 설치]</strong> 선택</li>
                  <li>안내 팝업에서 <strong>[추가]</strong> 클릭 시 앱 형태로 등록 완료</li>
                </ol>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPwaModalOpen(false)}
              className="mt-5 h-11 w-full rounded-2xl bg-brand font-bold text-white shadow-sm"
            >
              확인했습니다
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   1. 시작하기 & 계정 안내 탭
   ========================================================================= */
function OverviewTab({ onOpenPwaModal }: { onOpenPwaModal: () => void }) {
  return (
    <div className="space-y-6">
      {/* 기본 소개 & 접속 카드 */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-lg font-bold text-brand">
              🌐
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">비즈오프닝 시스템 개요</h2>
              <p className="text-xs text-muted">BIS Networks Opening Management Platform</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-600 md:text-sm">
            <strong>BIZ 오프닝</strong>은 LG U+ 기업통신 공식 판매센터 BIS네트웍스의 현장 청약·개통 전용 웹앱입니다.
            고객의 가입 상담 건부터 전산 청약서 접수, 회선 인입 현장 실사, 설치 기사 배정, 개통 확인 서명까지
            실시간으로 상태를 추적하고 협업할 수 있습니다.
          </p>

          <div className="mt-5 space-y-2 rounded-2xl bg-surface p-4 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">공식 웹앱 주소</span>
              <a
                href={siteConfig.links.openingApp}
                target="_blank"
                rel="noreferrer"
                className="font-mono font-bold text-brand hover:underline"
              >
                https://app.bisnetworks.co.kr
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">웹사이트 간편 주소</span>
              <span className="font-mono font-bold text-slate-700">bisnetworks.co.kr/opening</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">지원 환경</span>
              <span className="font-medium text-slate-700">모바일(iOS/Android), PC Chrome, Edge</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-lg font-bold text-brand">
              👤
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">계정 생성 및 로그인 가이드</h2>
              <p className="text-xs text-muted">신규 파트너 / 임직원 계정 등록 안내</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-3 rounded-2xl border border-line/60 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                1
              </span>
              <div>
                <p className="font-bold text-slate-900">회원가입 페이지 접속</p>
                <p className="mt-0.5 text-muted">
                  앱 로그인 화면 하단의 <strong>[회원가입]</strong> 버튼을 누르거나{" "}
                  <a
                    href="https://app.bisnetworks.co.kr/signup"
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand hover:underline"
                  >
                    /signup
                  </a>{" "}
                  경로로 이동합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-line/60 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                2
              </span>
              <div>
                <p className="font-bold text-slate-900">기본 정보 입력 (실명 기반)</p>
                <p className="mt-0.5 text-muted">
                  이름(실명), 업무용 휴대폰, 이메일, 비밀번호(영문·숫자·특수문자 조합 8자 이상)를 입력합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-line/60 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                3
              </span>
              <div>
                <p className="font-bold text-slate-900">비밀번호 분실 시 재설정</p>
                <p className="mt-0.5 text-muted">
                  로그인 화면의 <strong>[비밀번호 찾기]</strong>에서 가입한 이메일을 입력하면 비밀번호 재설정 링크가 발송됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 현장 업무 최적화 배너 */}
      <div className="rounded-3xl border border-dashed border-brand/40 bg-brand-light/30 p-5 md:p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 md:text-base">
              💡 현장 영업 및 외근 담당자를 위한 팁: 홈 화면 바로가기(PWA)
            </h3>
            <p className="text-xs text-slate-600">
              스마트폰 바탕화면에 앱 아이콘을 등록해 두면 별도 앱 설치 없이 터치 한 번으로 즉시 열리고 전산 조회가 가능합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenPwaModal}
            className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-dark"
          >
            설정 방법 보기
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. 청약 ~ 개통 프로세스 (5단계) 탭
   ========================================================================= */
function ProcessTab({ onCopy, copiedId }: { onCopy: (text: string, id: string) => void; copiedId: string | null }) {
  const steps = [
    {
      step: 1,
      title: "고객 상담 & 상품 사양 확정",
      badge: "상담 단계",
      desc: "고객사의 사업장 환경 및 네트워크 요구사항을 파악하여 최적의 상품과 IP 사양을 제안합니다.",
      items: [
        "회선 유형 선택: 대규모 트래픽/무제한 PC → 오피스넷, 소규모 단독매장 → 소호인터넷",
        "대역폭 속도 결정: 100M / 500M(가성비) / 1G(추천) / 2.5G / 5G / 10G",
        "IP 유형 선택: 일반 사무용(유동IP) vs 방화벽/VPN/서버/그룹웨어 운용(고정IP 개수)",
        "결합 부가서비스: 기업 인터넷전화(DCS/IP-Centrex), 안심 CCTV, 무선 AP",
      ],
      tip: "💡 고정IP는 1회선당 최대 20개까지 추가 가능하며, 개당 월 5,500원(부가세 별도)입니다.",
    },
    {
      step: 2,
      title: "서류 수합 & 청약서 전산 등록",
      badge: "청약 단계",
      desc: "계약에 필요한 구비서류를 수합하고 비즈오프닝 앱에 청약 데이터를 등록합니다.",
      items: [
        "개인사업자: 사업자등록증 사본, 대표자 신분증 사본, 자동이체 통장 사본",
        "법인사업자: 사업자등록증, 법인인감증명서, 법인 통장사본, 위임장 및 대리인 신분증",
        "비즈오프닝 앱에 고객 기본정보, 설치 주소, 납부정보 정확히 입력",
        "고객 서명(전자서명 또는 청약서 원본 날인) 완료 후 전산 심사 요청",
      ],
      tip: "⚠️ 주소 오입력 시 실사 일정이 2~3일 지연되므로 도로명주소 및 호수를 정확히 기재하세요.",
    },
    {
      step: 3,
      title: "인입 선로 검토 & 현장 실사",
      badge: "실사 단계",
      desc: "LG U+ 통신망 선로 및 고객사 건물 구내 통신 환경(MDF/IDF)을 점검합니다.",
      items: [
        "외벽 광케이블 인입 가능 여부 및 관로 포설 상태 확인",
        "건물 내 통신단자함(MDF실/층별 IDF실) 위치 및 전원 콘센트 유무 확인",
        "건물주 또는 관리사무소 공사 협의(타공 또는 관로 통과 동의) 필요 여부 점검",
        "단독 건물 및 노후 상가의 경우 인입 공사 승인 절차 진행",
      ],
      tip: "💡 관로가 막혀 있거나 옥상 인입이 필요한 경우 건물 관리실과의 사전 협의가 필수입니다.",
    },
    {
      step: 4,
      title: "방문 설치 & 통신 장비 세팅",
      badge: "개통 공사",
      desc: "LG U+ 개통 전담 엔지니어가 방문하여 광모뎀 및 네트워크 장비를 설치합니다.",
      items: [
        "광케이블 포설 및 전용 광모뎀(ONT / L2 스위치) 단자함 또는 랙 마운트 거치",
        "고정IP 바인딩 설정 및 라우터/방화벽 WAN 포트 연결 테스트",
        "기업 인터넷전화 및 무선 AP 결합 시 장비 등록 및 내선 번호 설정",
        "고객사 전산 담당자 입회 하에 포트별 연결 상태 대조",
      ],
      tip: "⚠️ 고객사 내부 LAN 공사(자리별 랜선 포설)는 기본 제공 항목이 아니므로 사전 안내 필수!",
    },
    {
      step: 5,
      title: "품질 검증 & 개통 완료 등록",
      badge: "개통 완료",
      desc: "최종 속도 및 핑 테스트를 완료하고 비즈오프닝 앱의 상태를 '개통 완료'로 전환합니다.",
      items: [
        "다운로드/업로드 속도 측정 및 지연시간(RTT/Ping) 정상 범위 검증",
        "고정IP 할당 고객사의 경우 외부 접근 및 도메인 바인딩 정상 작동 확인",
        "개통 확인서 고객 전자서명 날인 및 사본 교부",
        "비즈오프닝 앱에서 [개통 완료]로 상태 변경 후 사후 유지보수 안내",
      ],
      tip: "🎉 개통 완료 즉시 고객사에게 장애 접수 24시간 센터(1544-8585) 연락처를 문자로 안내하세요.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-base font-black text-slate-900">청약부터 개통까지 5단계 표준 흐름도</h2>
        <p className="mt-1 text-xs text-muted">
          각 단계를 클릭하거나 순서대로 검토하여 지연 요소를 사전에 방지하세요.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((s) => (
          <div
            key={s.step}
            className="rounded-3xl border border-line bg-white p-5 md:p-6 shadow-card transition-all hover:border-brand/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand font-mono text-sm font-black text-white shadow-sm">
                  {s.step}
                </span>
                <h3 className="text-base font-black text-slate-900">{s.title}</h3>
              </div>
              <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                {s.badge}
              </span>
            </div>

            <p className="mt-3 text-xs font-medium text-slate-600 md:text-sm">{s.desc}</p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {s.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 rounded-xl bg-surface p-2.5 text-xs text-slate-700">
                  <span className="text-brand font-bold">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl bg-amber-50/70 border border-amber-200/60 p-3 text-xs text-amber-900">
              {s.tip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   3. 구비서류 & 현장 체크리스트 탭
   ========================================================================= */
function DocumentsTab() {
  return (
    <div className="space-y-6">
      {/* 사업자 유형별 구비서류 카드 */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h2 className="text-base font-black text-slate-900">1. 사업자 유형별 청약 구비서류</h2>
        <p className="mt-1 text-xs text-muted">서류가 누락되거나 유효기간이 지난 경우 전산 청약이 반려될 수 있습니다.</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {/* 개인사업자 */}
          <div className="rounded-2xl border border-brand/20 bg-brand-light/10 p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">개인사업자</span>
              <span className="text-[11px] text-muted">간편 서류 수합</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand"></span>
                <span><strong>사업자등록증 사본</strong> (최근 발급본 또는 출력본)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand"></span>
                <span><strong>대표자 신분증 사본</strong> (주민등록증 / 운전면허증 앞면)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand"></span>
                <span><strong>자동이체 계좌 통장 사본</strong> (대표자 명의 또는 사업자 통장)</span>
              </li>
              <li className="flex items-center gap-2 text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                <span>대리인 신청 시: 대리인 신분증, 대표자 위임장 및 인감증명서 추가</span>
              </li>
            </ul>
          </div>

          {/* 법인사업자 */}
          <div className="rounded-2xl border border-slate-200 bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-white">법인사업자</span>
              <span className="text-[11px] text-muted">법인 증빙 필수</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-800"></span>
                <span><strong>사업자등록증 사본</strong> (최근 갱신본)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-800"></span>
                <span><strong>법인 인감증명서</strong> (최근 3개월 이내 발급본 원본)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-800"></span>
                <span><strong>법인 명의 통장 사본</strong> (요금 자동이체 계좌)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-800"></span>
                <span><strong>대리인 구비서류:</strong> 법인인감 날인된 위임장, 대리인 신분증 사본</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 현장 실사 및 사전 환경 체크리스트 */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h2 className="text-base font-black text-slate-900">2. 현장 인입 & 설치 전 사전 점검 체크리스트</h2>
        <p className="mt-1 text-xs text-muted">설치 기사 방문 전 고객사 현장에 아래 5가지가 준비되어 있는지 확인합니다.</p>

        <div className="mt-4 space-y-2.5">
          {[
            {
              title: "건물 통신단자함(MDF/IDF) 접근 권한",
              desc: "지하 또는 층별 통신실 잠금 해제 및 관리사무소(방재실) 협의 여부",
              level: "필수",
            },
            {
              title: "단자함 내 220V 전원 콘센트 여부",
              desc: "광모뎀(ONT) 및 스위칭 허브 구동을 위한 상시 전원 공급 콘센트 필수",
              level: "필수",
            },
            {
              title: "고객사 내부 네트워크 장비 위치 (허브랙/서버실)",
              desc: "인터넷 인입선이 도달할 허브랙, 공유기, 서버 장비의 위치 사전 확정",
              level: "권장",
            },
            {
              title: "고정IP 사용 고객사: 사전 네트워크 파라미터 준비",
              desc: "방화벽/서버의 서브넷 마스크, 게이트웨이, DNS IP 설정 계획 수립",
              level: "고정IP 전용",
            },
            {
              title: "구내 배선(LAN 공사) 별도 시공 여부 확인",
              desc: "통신사는 모뎀까지의 인입을 담당하므로 책상별 랜선 포설 필요 시 사전 공사 진행",
              level: "사전 안내",
            },
          ].map((c, i) => (
            <div key={i} className="flex items-start justify-between rounded-2xl border border-line p-3.5 hover:bg-surface">
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light text-[11px] font-bold text-brand">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900 md:text-sm">{c.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{c.desc}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {c.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. 실무 문자 템플릿 탭
   ========================================================================= */
function TemplatesTab({ onCopy, copiedId }: { onCopy: (text: string, id: string) => void; copiedId: string | null }) {
  const templates = [
    {
      id: "doc_request",
      title: "📄 [청약 전] 고객 구비서류 요청 문자",
      desc: "상담 완료 후 청약 서류 접수를 위한 안내 문자입니다.",
      content: `[BIS네트웍스] LG U+ 기업인터넷 청약 구비서류 안내

안녕하세요, 고객님. BIS네트웍스입니다.
신청해 주신 상품의 원활한 전산 등록 및 개통을 위해 아래 구비서류를 회신 부탁드립니다.

■ 개인사업자
1. 사업자등록증 사본
2. 대표자 신분증 사본 (앞면)
3. 자동이체 통장 사본

■ 법인사업자
1. 사업자등록증 사본
2. 법인인감증명서 (최근 3개월 이내)
3. 법인 통장 사본
4. 대리인 신청 시: 위임장(인감 날인) 및 대리인 신분증 사본

■ 회신 방법: 본 문자 또는 이메일(bisnetworks@kakao.com)
■ 문의: 02-6956-9999 / 한진우 프로 (010-5856-5561)`,
    },
    {
      id: "survey_schedule",
      title: "🛠️ [실사/설치] 기사 방문 일정 사전 안내 문자",
      desc: "현장 실사 및 광케이블 포설 일정이 잡혔을 때 발송하는 문자입니다.",
      content: `[BIS네트웍스] LG U+ 개통 기사 방문 일정 안내

안녕하세요, 고객님.
LG U+ 기업인터넷 설치를 위한 엔지니어 방문 일정이 확정되어 안내드립니다.

■ 방문 예정 일시: [ O월 O일(요일) OO:OO경 ]
■ 방문 엔지니어: LG U+ 기업 전담 기사
■ 점검 사항:
- 건물 통신단자함(MDF실/IDF실) 개방 및 관리실 사전 협조
- 통신단자함 내 상시 220V 전원 콘센트 확인
- 설치 장소 내 모뎀/공유기 거치 위치 확인

당일 기사님이 방문 전 사전 연락드릴 예정입니다.
■ 문의: 02-6956-9999 / 한진우 프로 (010-5856-5561)`,
    },
    {
      id: "complete_notice",
      title: "🎉 [개통 완료] 서비스 정상 개통 및 장애센터 안내 문자",
      desc: "개통 완료 후 고객사 담당자에게 전송하는 공식 완료 문자입니다.",
      content: `[BIS네트웍스] LG U+ 기업인터넷 개통 완료 안내

고객님의 LG U+ 기업인터넷 서비스가 정상적으로 개통되었습니다.
저희 BIS네트웍스를 믿고 가입해 주셔서 진심으로 감사드립니다.

■ 가입 상품: LG U+ 오피스넷
■ 약정 기간: 3년 약정
■ 장애 접수 및 A/S 센터 (365일 24시간):
- LG U+ 기업 장애센터: ☎ 1544-8585
■ 요금 및 계약 문의:
- BIS네트웍스 고객센터: ☎ 02-6956-9999
- 담당 프로 직통: ☎ 010-5856-5561 (한진우 프로)

앞으로도 안정적이고 빠른 고품질 통신 서비스를 제공할 수 있도록 최선을 다하겠습니다.`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-base font-black text-slate-900">실무 문자 템플릿 (원클릭 복사)</h2>
        <p className="mt-1 text-xs text-muted">
          고객사 소통 시 가장 많이 사용하는 3종 표준 양식입니다. [복사하기] 버튼을 눌러 바로 활용하세요.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {templates.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between rounded-3xl border border-line bg-white p-5 shadow-card"
          >
            <div>
              <h3 className="text-sm font-black text-slate-900">{t.title}</h3>
              <p className="mt-1 text-xs text-muted">{t.desc}</p>
              <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-surface p-3.5 font-sans text-xs leading-relaxed text-slate-700">
                {t.content}
              </pre>
            </div>
            <button
              type="button"
              onClick={() => onCopy(t.content, t.id)}
              className={cn(
                "mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all shadow-sm",
                copiedId === t.id
                  ? "bg-emerald-600 text-white"
                  : "bg-brand text-white hover:bg-brand-dark"
              )}
            >
              <span>{copiedId === t.id ? "✓ 복사 완료!" : "📋 텍스트 복사하기"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   5. 비상연락망 & FAQ 탭
   ========================================================================= */
function FaqTab() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Q. 비즈오프닝 앱에 로그인이 되지 않거나 계정을 잊어버렸을 때 어떻게 하나요?",
      a: "로그인 페이지 하단의 [비밀번호 찾기]를 통해 가입 시 입력한 이메일 주소로 재설정 메일을 발송할 수 있습니다. 만약 가입 이메일을 분실했거나 승인 권한이 필요한 경우 BIS네트웍스 총괄 담당자(한진우 프로, 010-5856-5561)에게 문의하시면 확인 후 조치해 드립니다.",
    },
    {
      q: "Q. 오피스넷과 소호인터넷의 개통 소요 기간은 얼마나 걸리나요?",
      a: "오피스넷은 인근 통신 전주/맨홀에서 고객 건물까지 1:1 전용 광케이블을 직접 인입하므로 통상 신청 후 약 5영업일(건물 인입 난이도에 따라 7~10일)이 소요됩니다. 소호인터넷은 구내 기설치 인프라가 있는 경우 2~3일 내 빠른 개통이 가능합니다.",
    },
    {
      q: "Q. 개통 후 고정IP를 추가하거나 변경하려면 어떻게 하나요?",
      a: "개통 완료 후에도 고정IP를 추가(월 5,500원/개, 최대 20개)하거나 유동IP를 고정IP로 변경할 수 있습니다. 비즈오프닝 앱에서 변경 신청을 등록하시거나 BIS 고객센터(02-6956-9999)로 연락 주시면 전산 변경 후 원격 장비 바인딩을 진행합니다.",
    },
    {
      q: "Q. 건물주나 관리사무소에서 벽 타공 또는 인입 공사를 반대할 때는 어떻게 대처하나요?",
      a: "대부분의 지식산업센터나 상가는 옥상 또는 지하 MDF 통신관로를 통해 기존 관로로 무타공 인입이 가능합니다. 현장 실사 기사 방문 시 동행하여 관리소장님께 '건물 훼손 없는 기존 관로 통과' 방식을 설명드리고, 필요 시 통신사 공사 협조 공문을 발송해 드립니다.",
    },
    {
      q: "Q. 개통 후 통신 장애가 발생했을 때 접수 창구는 어디인가요?",
      a: "기업 통신 장애는 LG U+ 기업 전담 장애센터(☎ 1544-8585, 365일 24시간 운영)로 회선 번호 또는 사업자번호를 불러주시면 원격 신호 점검 및 긴급 출동이 접수됩니다. 신속한 처리를 위해 BIS네트웍스 담당자에게도 알려주시면 이중으로 모니터링합니다.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 긴급 비상 연락망 카드 */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h2 className="text-base font-black text-slate-900">비상 연락망 및 담당 창구</h2>
        <p className="mt-1 text-xs text-muted">상황별 신속한 처리를 위한 직통 연락처 목록입니다.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
            <span className="text-xs font-bold text-accent">긴급 통신 장애 접수 (24시간)</span>
            <p className="mt-1 text-lg font-black text-slate-900">1544-8585</p>
            <p className="mt-1 text-xs text-slate-600">LG U+ 기업 통신 장애전담 관제센터</p>
          </div>

          <div className="rounded-2xl border border-brand/20 bg-brand-light/20 p-4">
            <span className="text-xs font-bold text-brand">청약·개통 총괄 담당자</span>
            <p className="mt-1 text-lg font-black text-slate-900">010-5856-5561</p>
            <p className="mt-1 text-xs text-slate-600">한진우 프로 (직통 문의/서류 승인)</p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4">
            <span className="text-xs font-bold text-slate-700">BIS네트웍스 고객센터</span>
            <p className="mt-1 text-lg font-black text-slate-900">02-6956-9999</p>
            <p className="mt-1 text-xs text-slate-600">평일 09:00 ~ 18:00 (대표상담)</p>
          </div>
        </div>
      </div>

      {/* 자주 묻는 질문 아코디언 */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h2 className="text-base font-black text-slate-900">자주 묻는 질문 (FAQ)</h2>
        <p className="mt-1 text-xs text-muted">현장 업무 시 자주 발생하는 질문과 해결 방법입니다.</p>

        <div className="mt-4 space-y-3">
          {faqs.map((faq, idx) => {
            const open = openIdx === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-line bg-white transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left text-xs font-bold text-slate-900 md:text-sm hover:bg-surface"
                >
                  <span>{faq.q}</span>
                  <span className="ml-2 text-base text-muted">{open ? "▲" : "▼"}</span>
                </button>
                {open && (
                  <div className="border-t border-line/60 bg-surface/60 p-4 text-xs leading-relaxed text-slate-600 md:text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
