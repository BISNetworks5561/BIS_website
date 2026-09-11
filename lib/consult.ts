export type ConsultState = {
  ok: boolean | null;
  message: string;
  errors?: Partial<Record<string, string>>;
};

export const initialConsultState: ConsultState = { ok: null, message: "" };

/** 상담 폼 관심상품 선택지 (DB plan_type 값) */
export const PRODUCT_OPTIONS = [
  { value: "officenet", label: "오피스넷" },
  { value: "soho", label: "소호인터넷" },
  { value: "phone", label: "인터넷전화" },
  { value: "cctv", label: "CCTV" },
] as const;
export type ProductValue = (typeof PRODUCT_OPTIONS)[number]["value"];
