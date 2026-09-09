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

## 5. 도메인 연결 (bisnetworks.co.kr, 카페24 → Vercel)

1. Vercel 프로젝트 → **Settings → Domains** 에 `bisnetworks.co.kr` 과 `www.bisnetworks.co.kr` 추가
2. 카페24 **도메인 관리 → DNS 관리** 에서 아래 레코드 설정 (기존 카페24 호스팅용 A/CNAME 레코드는 삭제)

| 타입 | 호스트 | 값 |
| --- | --- | --- |
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

3. 전파(수 분~수 시간) 후 Vercel Domains 화면에서 Valid Configuration 확인
4. Vercel 환경변수 `NEXT_PUBLIC_SITE_URL=https://www.bisnetworks.co.kr` 로 설정 후 재배포

## 로고 교체

현재 `public/logo-mark.svg`(육각 마크), `public/logo.svg`(가로형 풀 로고)는 원본 로고를 참고해 만든 SVG 근사본입니다.
원본 파일이 있으면 같은 파일명으로 덮어쓰거나, `site.config.ts` 의 `brand.logoSrc` / `brand.logoFullSrc` 경로를 바꿔 주세요.

## 6. 백오피스 (`/admin`)

메뉴에 없는 내부용 페이지입니다. 접근 키로 잠겨 있고 검색엔진 색인에서 제외됩니다.

- **콘텐츠 스튜디오** (`/admin/studio`): 주제·키워드 → Claude(`claude-opus-5`)가 네이버 블로그 글 작성 → 서식 복사. 고정 배경 위에 문구만 바꿔 대표이미지 PNG 생성.
- **상담 접수 현황** (`/admin/consults`): 홈페이지 상담 신청 목록, 상태(신규/연락함/완료)·메모 관리. `SUPABASE_SECRET_KEY` 필요.

환경변수 (Vercel → Settings → Environment Variables, 아래 셋은 **Secret** 타입 권장):

| 변수 | 설명 |
| --- | --- |
| `ADMIN_PASSCODE` | 백오피스 접근 키. 아무 문자열이나 정해서 넣고 로그인 화면에 같은 값 입력 |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com → API Keys 에서 발급 (글 생성용) |
| `SUPABASE_SECRET_KEY` | Supabase → Project Settings → API Keys 의 `sb_secret_...` (상담 내역 조회·바로가기 저장용) |

바로가기(+)를 팀 공용으로 저장하려면 `supabase/migrations/20260909000000_admin_settings.sql` 을 SQL Editor에서 한 번 실행하세요. 없으면 브라우저별 저장으로 동작합니다.

**글 생성 엔진 선택**: 스튜디오 화면에서 Claude / Gemini / Ollama 중 고를 수 있습니다. 설정된 엔진만 활성(●)으로 표시됩니다.

| 엔진 | 환경변수 | 비고 |
| --- | --- | --- |
| Claude | `ANTHROPIC_API_KEY` | 기본 `claude-opus-5`, 구조화 출력으로 가장 안정적 |
| Gemini | `GEMINI_API_KEY` (선택 `GEMINI_MODEL`) | 기본 `gemini-2.5-flash`, aistudio.google.com 발급 |
| Ollama | `OLLAMA_BASE_URL`, `OLLAMA_MODEL` (선택 `OLLAMA_API_KEY`) | 로컬 `http://localhost:11434` 는 개발 서버에서만 동작. Vercel에서 쓰려면 외부 접근 가능한 Ollama 서버 또는 ollama.com 클라우드 필요 |

배경 이미지는 `public/studio/thumb-bg-*.png` 프리셋 또는 브라우저에서 올린 내 이미지를 씁니다(브라우저에만 저장).
