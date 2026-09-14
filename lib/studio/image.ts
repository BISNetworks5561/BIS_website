import "server-only";
import { listGeminiModels, ProviderError } from "@/lib/studio/providers";
import { PRODUCT_LABEL, type StudioRequest } from "@/lib/studio/schema";
import { IMAGE_ASPECTS, IMAGE_STYLES, type ImageAspect, type ImageStyle } from "@/lib/studio/image-options";

export { IMAGE_ASPECTS, IMAGE_STYLES };
export type { ImageAspect, ImageStyle };

/** 상품별 장면 힌트 — 모델이 엉뚱한 사물을 그리지 않도록 */
const PRODUCT_SCENE: Record<StudioRequest["product"], string> = {
  officenet: "a bright modern small office with desks, monitors and a Wi-Fi router / network switch",
  soho: "a cozy small shop or cafe counter with a Wi-Fi router, tablet POS and a friendly owner",
  phone: "a desk with a modern IP desk phone and headset in a small office, a person taking a call",
  cctv: "a small store or office with a dome security camera on the ceiling and a smartphone showing the live view",
  other: "a small business owner in a tidy office or shop using internet, phone and security devices",
};

export function buildImagePrompt(opts: { scene: string; product: StudioRequest["product"]; style: ImageStyle; title?: string }): string {
  const style = IMAGE_STYLES[opts.style] ?? IMAGE_STYLES.clay;
  return [
    style.prompt,
    `Main scene (described in Korean, interpret faithfully): ${opts.scene.trim() || PRODUCT_SCENE[opts.product]}.`,
    `Context: a Korean blog post about ${PRODUCT_LABEL[opts.product]}${opts.title ? ` titled "${opts.title}"` : ""}. Typical setting: ${PRODUCT_SCENE[opts.product]}.`,
    "Color palette: deep blue (#1160b8) and navy (#0b2a6b) as the main colors with warm pastel accents (cream, soft orange, mint). Clean, uncluttered composition with a simple background and open space suitable for overlaying a title later.",
    "Absolutely no text, letters, numbers, logos, brand marks, watermarks or signage in the image. No realistic human faces in close-up.",
  ].join("\n");
}

/* ─────────────────────────── Gemini 이미지 생성 ─────────────────────────── */

export type ImageResult = { mimeType: string; base64: string; model: string; prompt: string };

/** 404(모델 없음) 시 순서대로 시도할 후보 */
const IMAGE_FALLBACKS = ["gemini-3.6-flash-image", "gemini-3-pro-image-preview", "gemini-2.5-flash-image", "gemini-flash-latest-image"];

class GeminiImageNotFound extends Error {
  constructor(public detail: string) {
    super(detail);
  }
}

export function defaultImageModel(): string {
  return process.env.GEMINI_IMAGE_MODEL || IMAGE_FALLBACKS[0];
}

/** Gemini 이미지 생성 모델로 1장 생성. 404 시 후보 모델 → 계정 모델 목록 순으로 재시도 */
export async function generateImage(prompt: string, aspect: ImageAspect, model?: string): Promise<ImageResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new ProviderError("GEMINI_API_KEY 환경변수가 없습니다. 이미지 생성은 Gemini 키가 필요합니다.", 503);

  const tried = new Set<string>();
  const details: string[] = [];
  const attempt = async (m: string) => {
    if (!m || tried.has(m)) return null;
    tried.add(m);
    try {
      return await callGeminiImage(prompt, aspect, m, key, true);
    } catch (e) {
      if (e instanceof GeminiImageNotFound) {
        details.push(`${m}: ${e.detail}`);
        console.warn(`[studio/image] 404 ${m}: ${e.detail}`);
        return null;
      }
      throw e;
    }
  };

  for (const m of [(model ?? "").trim() || defaultImageModel(), ...IMAGE_FALLBACKS]) {
    const r = await attempt(m);
    if (r) return r;
  }
  // 계정에서 쓸 수 있는 이미지 생성 모델 탐색 (imagen 은 별도 API라 제외)
  const available = await listGeminiModels(key).catch(() => [] as string[]);
  const candidates = available
    .filter((n) => /image/i.test(n) && !/^imagen/i.test(n) && !/embedding|segmentation/i.test(n) && !tried.has(n))
    .sort((a, b) => rankImage(b) - rankImage(a))
    .slice(0, 4);
  for (const m of candidates) {
    const r = await attempt(m);
    if (r) return r;
  }
  throw new ProviderError(
    `이미지 생성 모델을 찾지 못했습니다. 시도: ${[...tried].join(", ")}. 구글 응답: ${details[0] ?? "(없음)"} — 환경변수 GEMINI_IMAGE_MODEL 에 사용 가능한 이미지 모델명을 지정하세요.`,
    502,
  );
}

function rankImage(n: string): number {
  const m = n.match(/gemini-(\d+(?:\.\d+)?)/);
  const v = m ? parseFloat(m[1]) : 0;
  return v * 10 + (/flash/.test(n) ? 2 : /pro/.test(n) ? 1 : 0) + (/exp/.test(n) ? -5 : 0);
}

async function callGeminiImage(prompt: string, aspect: ImageAspect, model: string, key: string, withAspect: boolean): Promise<ImageResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const generationConfig: Record<string, unknown> = { responseModalities: ["TEXT", "IMAGE"] };
  if (withAspect) generationConfig.imageConfig = { aspectRatio: aspect };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let detail = "";
    try {
      detail = (JSON.parse(body) as { error?: { message?: string } }).error?.message ?? "";
    } catch {
      detail = body.slice(0, 200);
    }
    if (res.status === 404) throw new GeminiImageNotFound(detail || "(상세 없음)");
    // 구형 모델이 imageConfig 를 모르면 비율 없이 한 번 더
    if (res.status === 400 && withAspect && /imageConfig|aspect_ratio|aspectRatio|Unknown name/i.test(detail)) {
      return callGeminiImage(prompt, aspect, model, key, false);
    }
    if (res.status === 400 || res.status === 403) throw new ProviderError(`Gemini 인증/요청 오류 (${res.status}): ${detail}`, 502);
    if (res.status === 429) throw new ProviderError("Gemini 요청 한도 초과. 잠시 후 다시 시도하세요.", 429);
    throw new ProviderError(`Gemini 이미지 API 오류 (${res.status}): ${detail}`, 502);
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string; inlineData?: { mimeType?: string; data?: string } }[] }; finishReason?: string }[];
    promptFeedback?: { blockReason?: string };
  };
  if (data.promptFeedback?.blockReason) {
    throw new ProviderError(`Gemini가 요청을 차단했습니다 (${data.promptFeedback.blockReason}). 장면 설명을 바꿔 보세요.`, 422);
  }
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img?.inlineData?.data) {
    const reason = data.candidates?.[0]?.finishReason;
    const text = parts
      .map((p) => p.text ?? "")
      .join(" ")
      .trim()
      .slice(0, 160);
    throw new ProviderError(`이미지가 생성되지 않았습니다${reason ? ` (${reason})` : ""}. ${text || "장면 설명을 바꿔 다시 시도하세요."}`, 502);
  }
  return { mimeType: img.inlineData.mimeType || "image/png", base64: img.inlineData.data, model, prompt };
}
