# BIS네트웍스 기업인터넷 랜딩 사이트

LG U+ 오피스넷 판매센터 **BIS네트웍스** 원페이지 랜딩 사이트.

- **스택**: Next.js 15 (App Router) · Tailwind CSS v4 · Supabase · Vercel
- **섹션**: 헤더 → 히어로 → 핵심 특장점 → 고객 고민 해결 → 업종별 추천 → 요금표 → 가입 혜택 → 개통 절차 → 신뢰 지표/수상 → 고객 후기 → 추천 결합상품 → FAQ → 상담신청 폼 → 푸터

## 1. 회사 정보 수정 (가장 먼저 할 일)

전화번호·상호·주소·사업자번호·요금·실적 수치는 **모두 [`site.config.ts`](./site.config.ts) 한 파일**에 있습니다.
`TODO` 주석이 달린 값이 자리표시자입니다. 이 파일만 고치면 사이트 전체에 반영됩니다.

섹션별 마케팅 문구는 [`lib/content.ts`](./lib/content.ts) 에 있습니다.

## 2. 로컬 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

## 3. Supabase 설정 (상담신청 저장)

프로젝트: `gptxhbyzmsmqpyjnuqho`

1. Supabase 대시보드 → **SQL Editor** → [`supabase/migrations/20260903000000_consult_requests.sql`](./supabase/migrations/20260903000000_consult_requests.sql) 내용을 붙여넣고 실행
2. **Project Settings → API Keys** 에서 `sb_secret_...` (또는 구형 `service_role`) 키 복사
3. `.env.local` 및 Vercel 환경변수에 아래 값 등록

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gptxhbyzmsmqpyjnuqho.supabase.co` |
| `SUPABASE_SECRET_KEY` | 서버 전용 비밀 키 (`sb_secret_...`). 구형 키면 `SUPABASE_SERVICE_ROLE_KEY`에 넣어도 됨 |
| `NEXT_PUBLIC_SITE_URL` | 배포 도메인 (OG·sitemap 용) |

`consult_requests` 테이블은 RLS가 켜져 있고 정책이 없어서 공개(anon) 키로는 읽기·쓰기가 불가능합니다.
폼 제출은 서버 액션([`app/actions/consult.ts`](./app/actions/consult.ts))에서 비밀 키로만 INSERT 합니다.
접수 내역은 Supabase 대시보드 **Table Editor → consult_requests** 에서 확인하세요.

## 4. Vercel 배포

1. Vercel(BISNetworks 계정) → **Add New Project** → GitHub `BISNetworks5561/BIS_website` import
2. Framework: Next.js (자동 감지), Root Directory: `/`
3. **Environment Variables** 에 위 3개 변수 등록 → Deploy
4. 도메인 연결 후 `NEXT_PUBLIC_SITE_URL` 을 실제 도메인으로 변경

## 구조

```
site.config.ts          # 회사 정보·요금·실적 (자리표시자)
lib/content.ts          # 섹션별 카피
app/
  layout.tsx            # 폰트·메타데이터
  page.tsx              # 섹션 조립
  actions/consult.ts    # 상담신청 서버 액션 → Supabase INSERT
components/
  Header.tsx            # 로고 + 메뉴 + 우측 대표전화(tel:)
  MobileCallBar.tsx     # 모바일 하단 고정 전화/상담 버튼
  ConsultForm.tsx       # 상담신청 폼 (useActionState)
  Footer.tsx            # 사업자정보
  sections/*.tsx        # 각 섹션
supabase/migrations/    # consult_requests 테이블 SQL
```
