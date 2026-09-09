import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const hasSecret = () => !!(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
const KeySchema = z.string().regex(/^[a-z0-9_-]{1,40}$/);

/** 설정 조회: GET /api/admin/settings?key=shortcuts */
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const key = KeySchema.safeParse(new URL(req.url).searchParams.get("key"));
  if (!key.success) return NextResponse.json({ error: "key 가 올바르지 않습니다." }, { status: 400 });
  if (!hasSecret()) return NextResponse.json({ error: "SUPABASE_SECRET_KEY 없음", fallback: true }, { status: 503 });
  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase 설정 없음", fallback: true }, { status: 503 });

  const { data, error } = await supabase.from("admin_settings").select("value").eq("key", key.data).maybeSingle();
  if (error) {
    // 테이블 미생성 등 → 클라이언트가 로컬 저장으로 전환
    return NextResponse.json({ error: error.message, fallback: true }, { status: 503 });
  }
  return NextResponse.json({ value: data?.value ?? null });
}

const PutSchema = z.object({ key: KeySchema, value: z.unknown() });

/** 설정 저장: PUT /api/admin/settings  { key, value } */
export async function PUT(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasSecret()) return NextResponse.json({ error: "SUPABASE_SECRET_KEY 없음", fallback: true }, { status: 503 });
  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase 설정 없음", fallback: true }, { status: 503 });

  let body;
  try {
    body = PutSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }
  const { error } = await supabase
    .from("admin_settings")
    .upsert({ key: body.key, value: body.value as object, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message, fallback: true }, { status: 503 });
  return NextResponse.json({ ok: true });
}
