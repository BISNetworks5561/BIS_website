-- 백오피스 설정 저장소 (바로가기 목록 등) — key/value(jsonb)
-- 실행: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run

create table if not exists public.admin_settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

comment on table public.admin_settings is 'BIS 백오피스 설정 (서버 secret 키로만 접근)';

alter table public.admin_settings enable row level security;
revoke all on public.admin_settings from anon, authenticated;
