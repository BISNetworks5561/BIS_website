import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const hasSecret = () => !!(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);

/** 상담 접수 목록 (최근 200건) */
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasSecret()) {
    return NextResponse.json(
      {
        error:
          "상담 내역 조회에는 서버 전용 Supabase 비밀 키가 필요합니다. Vercel 환경변수에 SUPABASE_SECRET_KEY(sb_secret_...)를 Secret으로 추가 후 재배포하세요. 그 전까지는 Supabase 대시보드 Table Editor에서 확인할 수 있습니다.",
      },
      { status: 503 },
    );
  }
  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase 설정이 없습니다." }, { status: 503 });

  const { data, error } = await supabase
    .from("consult_requests")
    .select("id, created_at, name, company, phone, email, region, plan_type, speed, ip_type, message, status, memo")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  return NextResponse.json({ rows: data ?? [] });
}

const PatchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "closed"]).optional(),
  memo: z.string().max(2000).optional(),
});

/** 상태·메모 수정 */
export async function PATCH(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasSecret()) return NextResponse.json({ error: "SUPABASE_SECRET_KEY 가 필요합니다." }, { status: 503 });
  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase 설정이 없습니다." }, { status: 503 });

  let body;
  try {
    body = PatchSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }
  const { id, ...patch } = body;
  const { error } = await supabase.from("consult_requests").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  return NextResponse.json({ ok: true });
}
