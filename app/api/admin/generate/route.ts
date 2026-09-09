import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { StudioRequestSchema } from "@/lib/studio/schema";
import { generatePost, ProviderError, providerStatus, type Provider } from "@/lib/studio/providers";

export const runtime = "nodejs";
export const maxDuration = 300;

const BodySchema = StudioRequestSchema.extend({
  provider: z.enum(["claude", "gemini", "ollama"]).default("gemini"),
  model: z.string().max(80).optional(),
});

/** 사용 가능한 엔진 목록 */
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json({ providers: providerStatus() });
}

/** 블로그 글 생성 */
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }
  const { provider, model, ...input } = body;

  try {
    const result = await generatePost(input, provider as Provider, model);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ProviderError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[studio] unexpected", error);
    return NextResponse.json({ error: "알 수 없는 오류가 발생했습니다." }, { status: 500 });
  }
}
