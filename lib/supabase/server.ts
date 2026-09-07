import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * 서버 전용 Supabase 클라이언트.
 * - SUPABASE_SECRET_KEY(또는 SUPABASE_SERVICE_ROLE_KEY)가 있으면 그 키를 사용 (RLS 우회)
 * - 없으면 NEXT_PUBLIC_SUPABASE_ANON_KEY(publishable) 사용 → RLS의 anon INSERT 정책으로만 저장 가능
 * 클라이언트 컴포넌트에서 절대 import 하지 마세요.
 */
export function getServiceClient(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
