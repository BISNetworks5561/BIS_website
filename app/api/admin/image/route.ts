import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { ProviderError } from "@/lib/studio/providers";
import { buildImagePrompt, defaultImageModel, generateImage } from "@/lib/studio/image";
import { IMAGE_ASPECTS, IMAGE_STYLE_KEYS } from "@/lib/studio/image-options";

export const runtime = "nodejs";
export const maxDuration = 180;

const BodySchema = z.object({
  scene: z.string().max(1200).default(""),
  title: z.string().max(120).optional(),
  product: z.enum(["officenet", "soho", "phone", "cctv", "other"]).default("officenet"),
  style: z.enum(IMAGE_STYLE_KEYS).default("clay"),
  aspect: z.enum(IMAGE_ASPECTS).default("16:9"),
  model: z.string().max(80).optional(),
  /** true 면 scene 을 완성된 프롬프트로 그대로 사용 */
  raw: z.boolean().default(false),
});

/** 이미지 생성 가능 여부 (UI 표시용) */
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json({ ready: !!process.env.GEMINI_API_KEY, model: defaultImageModel(), hint: "GEMINI_API_KEY" });
}

/** 글 내용에 맞는 대표이미지 1장 생성 (Gemini 이미지 모델) */
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }
  const prompt = body.raw && body.scene.trim() ? body.scene.trim() : buildImagePrompt(body);
  try {
    const r = await generateImage(prompt, body.aspect, body.model);
    return NextResponse.json({ dataUrl: `data:${r.mimeType};base64,${r.base64}`, model: r.model, prompt: r.prompt });
  } catch (error) {
    if (error instanceof ProviderError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[studio/image] unexpected", error);
    return NextResponse.json({ error: "알 수 없는 오류가 발생했습니다." }, { status: 500 });
  }
}
