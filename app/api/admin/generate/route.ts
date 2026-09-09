import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";
import {
  BlogPostSchema,
  LENGTH_LABEL,
  PRODUCT_LABEL,
  StudioRequestSchema,
  TONE_LABEL,
} from "@/lib/studio/schema";
import { siteConfig } from "@/site.config";
import { requireAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const maxDuration = 120;

const SYSTEM = `당신은 한국 네이버 블로그 상위노출 경험이 많은 B2B 통신상품 콘텐츠 에디터입니다.
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

export async function POST(req: Request) {
  // 1) 접근 키 확인
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "서버에 ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다. console.anthropic.com 에서 발급 후 Vercel 환경변수에 추가하세요." },
      { status: 503 },
    );
  }

  // 2) 입력 검증
  let input;
  try {
    input = StudioRequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }

  const userPrompt = [
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

  // 3) Claude 호출 (구조화 출력)
  const client = new Anthropic();
  try {
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 16000,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userPrompt }],
      output_config: { format: zodOutputFormat(BlogPostSchema), effort: "medium" },
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { error: `생성이 거부되었습니다 (${response.stop_details?.category ?? "정책"}). 주제를 바꿔 다시 시도하세요.` },
        { status: 422 },
      );
    }
    if (!response.parsed_output) {
      return NextResponse.json({ error: "결과 형식을 해석하지 못했습니다. 다시 시도해 주세요." }, { status: 502 });
    }

    return NextResponse.json({
      post: response.parsed_output,
      usage: { input: response.usage.input_tokens, output: response.usage.output_tokens, model: response.model },
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY 가 유효하지 않습니다." }, { status: 502 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "요청이 많아 잠시 제한되었습니다. 1분 후 다시 시도하세요." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `Claude API 오류 (${error.status}): ${error.message}` }, { status: 502 });
    }
    console.error("[studio] unexpected", error);
    return NextResponse.json({ error: "알 수 없는 오류가 발생했습니다." }, { status: 500 });
  }
}
