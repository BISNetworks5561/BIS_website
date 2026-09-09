import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { BlogPostSchema, LENGTH_LABEL, PRODUCT_LABEL, TONE_LABEL, type BlogPost, type StudioRequest } from "@/lib/studio/schema";
import { siteConfig } from "@/site.config";

export type Provider = "claude" | "gemini" | "ollama";

export const DEFAULT_MODELS: Record<Provider, string> = {
  claude: "claude-opus-5",
  gemini: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  ollama: process.env.OLLAMA_MODEL || "gemma3:12b",
};

/** 어떤 엔진이 설정되어 있는지 (UI 표시용) */
export function providerStatus() {
  return {
    claude: { ready: !!process.env.ANTHROPIC_API_KEY, model: DEFAULT_MODELS.claude, hint: "ANTHROPIC_API_KEY" },
    gemini: { ready: !!process.env.GEMINI_API_KEY, model: DEFAULT_MODELS.gemini, hint: "GEMINI_API_KEY" },
    ollama: {
      ready: !!(process.env.OLLAMA_BASE_URL || process.env.OLLAMA_API_KEY),
      model: DEFAULT_MODELS.ollama,
      hint: "OLLAMA_BASE_URL (+OLLAMA_MODEL)",
    },
  };
}

export class ProviderError extends Error {
  constructor(
    message: string,
    public status = 502,
  ) {
    super(message);
  }
}

/* ─────────────────────────── 공통 프롬프트 ─────────────────────────── */

export const SYSTEM_PROMPT = `당신은 한국 네이버 블로그 상위노출 경험이 많은 B2B 통신상품 콘텐츠 에디터입니다.
글쓴이는 "${siteConfig.brand.name}" — ${siteConfig.brand.tagline}(LG유플러스 통신위탁판매대행업자)입니다.

[글의 목표]
- 사무실·매장 운영자가 검색으로 들어와 끝까지 읽고, 자연스럽게 상담을 문의하게 만드는 정보성 글.
- 광고 문구를 나열하지 말고, 독자의 실제 고민(속도 저하, 고정IP, 요금, 개통 절차, 장애 대응 등)을 구체적으로 풀어 줄 것.

[네이버 블로그 SEO 규칙]
- 제목: 핵심 키워드를 앞쪽에, 25~40자, 낚시성·특수문자·이모지 금지.
- 첫 문단에 핵심 키워드를 자연스럽게 1회 포함. 본문 전체에서 키워드를 억지로 반복하지 말 것(2~4회면 충분).
- 소제목은 결론이나 질문형 문장으로, 소제목만 읽어도 흐름이 보이게.
- 문단은 2~4문장으로 짧게. 표·과한 이모지 대신 불릿으로 핵심 정리.
- 타 사이트 문장을 그대로 옮기지 말고 고유한 표현으로 작성(유사문서 방지).

[사실 관계 원칙 — 매우 중요]
- LG U+ 상품의 확정되지 않은 요금·혜택·약정 조건을 단정하지 말 것. 숫자가 필요하면 "예: ", "약", "상담 시 확인" 식으로 완충.
- "최저가", "무조건", "100% 보장" 같은 과장·단정 표현 금지. 비교 시 타사 비방 금지.
- 아래 회사 정보 외의 전화번호·주소를 만들어내지 말 것. 마무리 문단에는 전화번호를 쓰지 말 것(시스템이 자동 삽입).

[회사 정보]
- 상호: ${siteConfig.company.legalName} / 브랜드: ${siteConfig.brand.name}
- 대표전화 ${siteConfig.contact.phoneDisplay}, 담당 ${siteConfig.contact.manager.name} ${siteConfig.contact.manager.phone}
- 상담시간 ${siteConfig.contact.hours}
- 주요 상품: 오피스넷(기업인터넷, PC 대수 무제한, 고정IP 최대 20개, 최대 10Gbps), 소호인터넷, 기업 인터넷전화·AI전화, 지능형 CCTV
- 가입 혜택(공통 안내 가능): 가입비·설치비 0원, 기가 와이파이 공유기 무상 지원, 인터넷전화 결합 시 전화기 무상 지원, 사무실 네트워크 공사 지원, 요금 맞춤 설계

[문체]
- 존댓말. 문장은 짧고 명확하게. 어려운 용어(고정IP, L2 스위치, 대칭 속도 등)는 한 줄로 쉽게 풀어 설명.
- 대표이미지 문구(thumbnailTitle)는 검색 결과 썸네일에서 눈에 띄도록 짧고 강하게, 2줄 이내.`;

export function buildUserPrompt(input: StudioRequest): string {
  return [
    `[주제] ${input.topic}`,
    input.keywords.length ? `[핵심 키워드] ${input.keywords.join(", ")} — 첫 번째가 가장 중요` : "",
    `[상품] ${PRODUCT_LABEL[input.product]}`,
    `[톤] ${TONE_LABEL[input.tone]}`,
    `[분량] ${LENGTH_LABEL[input.length]}`,
    input.audience ? `[독자] ${input.audience}` : "[독자] 사무실·매장을 운영하는 대표 또는 총무 담당자",
    input.region ? `[지역] ${input.region} — 제목이나 본문·해시태그에 자연스럽게 1~2회 반영` : "",
    input.notes ? `[추가 요청·참고 내용]\n${input.notes}` : "",
    "",
    "위 조건으로 네이버 블로그 글을 작성해 구조화된 형식으로 반환하세요.",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Gemini/Ollama용 JSON 스키마 (zod → JSON Schema) */
const JSON_SCHEMA = z.toJSONSchema(BlogPostSchema);

const JSON_INSTRUCTION = `반드시 아래 JSON 스키마에 맞는 JSON 객체 하나만 출력하세요. 코드펜스, 설명, 앞뒤 문장 없이 JSON만.
각 필드의 description을 지켜서 작성하세요.
${JSON.stringify(JSON_SCHEMA)}`;

/* ─────────────────────────── 결과 파싱 ─────────────────────────── */

function parseJsonLoose(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch {}
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {}
  }
  throw new ProviderError("모델이 JSON 형식으로 답하지 않았습니다. 다시 시도하거나 다른 모델을 선택하세요.", 502);
}

function validate(raw: unknown): BlogPost {
  const r = BlogPostSchema.safeParse(raw);
  if (r.success) return r.data;
  // 일부 필드 누락은 기본값으로 보정
  const obj = (raw ?? {}) as Record<string, unknown>;
  const fixed = BlogPostSchema.safeParse({
    altTitles: [],
    faq: [],
    seoKeywords: [],
    hashtags: [],
    thumbnailSub: "",
    imagePrompt: "",
    ...obj,
    sections: Array.isArray(obj.sections)
      ? (obj.sections as Record<string, unknown>[]).map((s) => ({ bullets: [], paragraphs: [], ...s }))
      : [],
  });
  if (fixed.success) return fixed.data;
  throw new ProviderError("모델 응답이 요구 형식과 달라 해석하지 못했습니다. 다시 시도해 주세요.", 502);
}

/* ─────────────────────────── 엔진별 구현 ─────────────────────────── */

export type GenerateResult = { post: BlogPost; usage: { input: number; output: number; model: string } };

async function withClaude(input: StudioRequest, model: string): Promise<GenerateResult> {
  if (!process.env.ANTHROPIC_API_KEY) throw new ProviderError("ANTHROPIC_API_KEY 환경변수가 없습니다.", 503);
  const client = new Anthropic();
  try {
    const response = await client.messages.parse({
      model,
      max_tokens: 16000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: buildUserPrompt(input) }],
      output_config: { format: zodOutputFormat(BlogPostSchema), effort: "medium" },
    });
    if (response.stop_reason === "refusal") {
      throw new ProviderError(`생성이 거부되었습니다 (${response.stop_details?.category ?? "정책"}). 주제를 바꿔 다시 시도하세요.`, 422);
    }
    if (!response.parsed_output) throw new ProviderError("결과 형식을 해석하지 못했습니다. 다시 시도해 주세요.", 502);
    return {
      post: response.parsed_output,
      usage: { input: response.usage.input_tokens, output: response.usage.output_tokens, model: response.model },
    };
  } catch (error) {
    if (error instanceof ProviderError) throw error;
    if (error instanceof Anthropic.AuthenticationError) throw new ProviderError("ANTHROPIC_API_KEY 가 유효하지 않습니다.", 502);
    if (error instanceof Anthropic.RateLimitError) throw new ProviderError("요청이 많아 잠시 제한되었습니다. 1분 후 다시 시도하세요.", 429);
    if (error instanceof Anthropic.APIError) throw new ProviderError(`Claude API 오류 (${error.status}): ${error.message}`, 502);
    throw error;
  }
}

async function withGemini(input: StudioRequest, model: string): Promise<GenerateResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new ProviderError("GEMINI_API_KEY 환경변수가 없습니다. aistudio.google.com 에서 발급하세요.", 503);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT + "\n\n" + JSON_INSTRUCTION }] },
      contents: [{ role: "user", parts: [{ text: buildUserPrompt(input) }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.8, maxOutputTokens: 8192 },
    }),
    signal: AbortSignal.timeout(110_000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 400 || res.status === 403) throw new ProviderError(`Gemini 인증/요청 오류 (${res.status}): ${body.slice(0, 200)}`, 502);
    if (res.status === 429) throw new ProviderError("Gemini 요청 한도 초과. 잠시 후 다시 시도하세요.", 429);
    throw new ProviderError(`Gemini API 오류 (${res.status})`, 502);
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    promptFeedback?: { blockReason?: string };
  };
  if (data.promptFeedback?.blockReason) throw new ProviderError(`Gemini가 요청을 차단했습니다 (${data.promptFeedback.blockReason}).`, 422);
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text) throw new ProviderError("Gemini 응답이 비어 있습니다.", 502);
  return {
    post: validate(parseJsonLoose(text)),
    usage: { input: data.usageMetadata?.promptTokenCount ?? 0, output: data.usageMetadata?.candidatesTokenCount ?? 0, model },
  };
}

async function withOllama(input: StudioRequest, model: string): Promise<GenerateResult> {
  const base = (process.env.OLLAMA_BASE_URL || (process.env.OLLAMA_API_KEY ? "https://ollama.com" : "")).replace(/\/+$/, "");
  if (!base) throw new ProviderError("OLLAMA_BASE_URL 환경변수가 없습니다. (예: http://localhost:11434 또는 외부에서 접근 가능한 주소)", 503);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.OLLAMA_API_KEY) headers.Authorization = `Bearer ${process.env.OLLAMA_API_KEY}`;
  let res: Response;
  try {
    res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        stream: false,
        format: JSON_SCHEMA, // Ollama 구조화 출력
        options: { temperature: 0.8, num_ctx: 16384 },
        messages: [
          { role: "system", content: SYSTEM_PROMPT + "\n\n" + JSON_INSTRUCTION },
          { role: "user", content: buildUserPrompt(input) },
        ],
      }),
      signal: AbortSignal.timeout(280_000),
    });
  } catch (e) {
    throw new ProviderError(`Ollama 서버(${base})에 연결할 수 없습니다: ${e instanceof Error ? e.message : String(e)}`, 502);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 404) throw new ProviderError(`Ollama에 모델 "${model}" 이(가) 없습니다. 'ollama pull ${model}' 후 다시 시도하세요.`, 502);
    throw new ProviderError(`Ollama 오류 (${res.status}): ${body.slice(0, 200)}`, 502);
  }
  const data = (await res.json()) as {
    message?: { content?: string };
    prompt_eval_count?: number;
    eval_count?: number;
  };
  const text = data.message?.content ?? "";
  if (!text) throw new ProviderError("Ollama 응답이 비어 있습니다.", 502);
  return {
    post: validate(parseJsonLoose(text)),
    usage: { input: data.prompt_eval_count ?? 0, output: data.eval_count ?? 0, model },
  };
}

export async function generatePost(input: StudioRequest, provider: Provider, model?: string): Promise<GenerateResult> {
  const m = (model && model.trim()) || DEFAULT_MODELS[provider];
  switch (provider) {
    case "claude":
      return withClaude(input, m);
    case "gemini":
      return withGemini(input, m);
    case "ollama":
      return withOllama(input, m);
  }
}
