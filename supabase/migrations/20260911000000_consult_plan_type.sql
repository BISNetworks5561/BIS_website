-- 상담신청 관심상품 값 확장: 오피스넷/소호인터넷/인터넷전화/CCTV
-- 실행: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run

alter table public.consult_requests drop constraint if exists consult_requests_plan_type_check;
alter table public.consult_requests
  add constraint consult_requests_plan_type_check
  check (plan_type in ('officenet', 'soho', 'phone', 'cctv', 'standalone', 'bundle', 'unknown'));
