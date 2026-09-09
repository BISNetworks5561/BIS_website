import { z } from "zod";

/** 글 생성 요청 (클라이언트 → API) */
export const StudioRequestSchema = z.object({
  topic: z.string().min(2).max(200),
  keywords: z.array(z.string().min(1).max(40)).max(10).default([]),
  product: z.enum(["officenet", "soho", "phone", "cctv", "other"]).default("officenet"),
  tone: z.enum(["friendly", "professional", "casual"]).default("friendly"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  audience: z.string().max(100).optional().default(""),
  region: z.string().max(60).optional().default(""),
  notes: z.string().max(1500).optional().default(""),
});
export type StudioRequest = z.infer<typeof StudioRequestSchema>;

/** Claude 구조화 출력 스키마 */
export const BlogPostSchema = z.object({
  title: z.string().describe("네이버 블로그 제목. 핵심 키워드를 앞쪽에 배치, 25~40자, 특수문자·이모지 없이"),
  altTitles: z.array(z.string()).describe("대안 제목 2개"),
  thumbnailTitle: z
    .string()
    .describe("대표이미지에 크게 들어갈 문구. 줄바꿈(\\n)으로 최대 2줄, 한 줄 12자 이내, 임팩트 있게"),
  thumbnailSub: z.string().describe("대표이미지 보조 문구 1줄, 18자 이내"),
  intro: z.string().describe("도입부 2~3문장. 독자의 고민을 짚고 이 글에서 얻을 것을 제시. 첫 문장에 핵심 키워드 포함"),
  sections: z
    .array(
      z.object({
        heading: z.string().describe("소제목. 번호 없이, 궁금증을 자극하거나 결론을 담은 문장형"),
        paragraphs: z.array(z.string()).describe("문단 1~3개, 각 2~4문장. 구체적 사례·숫자·비교 포함"),
        bullets: z.array(z.string()).describe("핵심 요약 불릿 0~5개, 없으면 빈 배열"),
      }),
    )
    .describe("본문 소제목 섹션 3~5개"),
  faq: z
    .array(z.object({ q: z.string(), a: z.string() }))
    .describe("자주 묻는 질문 2~3개. 질문은 실제 검색어처럼"),
  closing: z.string().describe("마무리 2~3문장. 요약 + 부담 없는 상담 유도. 전화번호는 넣지 말 것(자동 삽입)"),
  hashtags: z.array(z.string()).describe("해시태그 10~15개, # 없이 단어만. 핵심 키워드·지역·상품명 포함"),
  seoKeywords: z.array(z.string()).describe("본문에 자연스럽게 녹인 SEO 키워드 목록"),
  imagePrompt: z.string().describe("대표이미지용 사진 컨셉을 한 문장으로 (사람이 참고용). 한국어"),
});
export type BlogPost = z.infer<typeof BlogPostSchema>;

export const PRODUCT_LABEL: Record<StudioRequest["product"], string> = {
  officenet: "LG U+ 오피스넷 (기업인터넷)",
  soho: "LG U+ 소호인터넷 (매장·소상공인 인터넷)",
  phone: "LG U+ 기업 인터넷전화 · AI 전화",
  cctv: "LG U+ 지능형 CCTV",
  other: "LG U+ 기업통신상품 전반",
};

export const TONE_LABEL: Record<StudioRequest["tone"], string> = {
  friendly: "친절한 존댓말 (사장님께 설명하듯, 부드럽고 신뢰감 있게)",
  professional: "전문적인 존댓말 (담당자·총무 대상, 정확하고 간결하게)",
  casual: "편안한 구어체 존댓말 (블로그 이웃에게 이야기하듯)",
};

export const LENGTH_LABEL: Record<StudioRequest["length"], string> = {
  short: "1,200~1,600자 (섹션 3개)",
  medium: "1,800~2,500자 (섹션 4개)",
  long: "2,800~3,500자 (섹션 5개)",
};
