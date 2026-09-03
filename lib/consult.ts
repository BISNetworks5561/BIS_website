export type ConsultState = {
  ok: boolean | null;
  message: string;
  errors?: Partial<Record<string, string>>;
};

export const initialConsultState: ConsultState = { ok: null, message: "" };
