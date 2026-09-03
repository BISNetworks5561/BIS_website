-- 상담신청 테이블
-- Supabase 프로젝트: gptxhbyzmsmqpyjnuqho
-- 실행 방법: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run
--          또는 `supabase db push` (CLI 로그인 필요)

create extension if not exists pgcrypto;

create table if not exists public.consult_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- 신청자 입력
  name          text not null,                       -- 담당자명
  company       text,                                -- 회사명
  phone         text not null,                       -- 연락처
  email         text,
  region        text,                                -- 설치 지역
  plan_type     text not null default 'unknown'
                  check (plan_type in ('standalone', 'bundle', 'unknown')),  -- 단독/결합
  speed         text,                                -- 희망 속도 (100M ~ 10G)
  ip_type       text not null default 'unknown'
                  check (ip_type in ('dynamic', 'static', 'unknown')),       -- 유동/고정 IP
  message       text,                                -- 문의 내용
  agree_privacy boolean not null default false,      -- 개인정보 수집·이용 동의

  -- 운영용
  status        text not null default 'new'
                  check (status in ('new', 'contacted', 'closed')),
  memo          text,                                -- 상담원 메모
  source        text,                                -- 유입 경로 (referrer / utm)
  user_agent    text,
  ip            inet
);

comment on table public.consult_requests is 'BIS네트웍스 랜딩 페이지 상담신청';

create index if not exists consult_requests_created_at_idx
  on public.consult_requests (created_at desc);
create index if not exists consult_requests_status_idx
  on public.consult_requests (status);

-- RLS 활성화. 정책을 만들지 않으므로 anon/authenticated 키로는 읽기·쓰기 모두 불가.
-- 폼 제출은 Next.js 서버 액션에서 secret(service_role) 키로만 INSERT 합니다.
alter table public.consult_requests enable row level security;

revoke all on public.consult_requests from anon, authenticated;
