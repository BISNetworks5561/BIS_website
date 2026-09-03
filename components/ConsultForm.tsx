"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitConsult } from "@/app/actions/consult";
import { initialConsultState } from "@/lib/consult";
import { consult } from "@/lib/content";
import { cn } from "@/lib/utils";

const input =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20";
const label = "mb-1.5 block text-sm font-bold";

function Field({ name, error, children }: { name: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs font-medium text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ConsultForm() {
  const [state, action, pending] = useActionState(submitConsult, initialConsultState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  if (state.ok) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl font-black text-white">
          ✓
        </span>
        <p className="mt-5 text-xl font-black">접수 완료</p>
        <p className="mt-2 max-w-sm text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  const e = state.errors ?? {};

  return (
    <form ref={formRef} action={action} className="space-y-5" noValidate>
      {/* 허니팟 — 사람은 보지 못함 */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          웹사이트 <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" error={e.name}>
          <label htmlFor="name" className={label}>
            담당자명 <span className="text-brand">*</span>
          </label>
          <input id="name" name="name" required className={cn(input, e.name && "border-accent")} placeholder="홍길동" />
        </Field>
        <Field name="phone" error={e.phone}>
          <label htmlFor="phone" className={label}>
            연락처 <span className="text-brand">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            className={cn(input, e.phone && "border-accent")}
            placeholder="010-1234-5678"
          />
        </Field>
        <Field name="company">
          <label htmlFor="company" className={label}>
            회사명
          </label>
          <input id="company" name="company" className={input} placeholder="(주)회사명" />
        </Field>
        <Field name="email" error={e.email}>
          <label htmlFor="email" className={label}>
            이메일
          </label>
          <input id="email" name="email" type="email" className={cn(input, e.email && "border-accent")} placeholder="name@company.com" />
        </Field>
        <Field name="region">
          <label htmlFor="region" className={label}>
            설치 지역
          </label>
          <input id="region" name="region" className={input} placeholder="예: 서울 강남구" />
        </Field>
        <Field name="plan_type">
          <label htmlFor="plan_type" className={label}>
            관심 상품
          </label>
          <select id="plan_type" name="plan_type" className={input} defaultValue="unknown">
            <option value="unknown">선택 안 함</option>
            <option value="standalone">오피스넷 단독</option>
            <option value="bundle">결합 (인터넷전화·Wi-Fi·CCTV)</option>
          </select>
        </Field>
        <Field name="speed">
          <label htmlFor="speed" className={label}>
            희망 속도
          </label>
          <select id="speed" name="speed" className={input} defaultValue="">
            <option value="">잘 모르겠어요</option>
            {consult.speeds.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field name="ip_type">
          <label htmlFor="ip_type" className={label}>
            IP 유형
          </label>
          <select id="ip_type" name="ip_type" className={input} defaultValue="unknown">
            <option value="unknown">잘 모르겠어요</option>
            <option value="dynamic">유동IP</option>
            <option value="static">고정IP</option>
          </select>
        </Field>
      </div>

      <Field name="message">
        <label htmlFor="message" className={label}>
          문의 내용
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={input}
          placeholder="PC 대수, 현재 사용 중인 통신사, 희망 개통 시기 등을 적어주시면 더 정확한 견적이 가능합니다."
        />
      </Field>

      <Field name="agree_privacy" error={e.agree_privacy}>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="agree_privacy" className="mt-0.5 h-4 w-4 accent-brand" />
          <span>
            <span className="font-bold">
              개인정보 수집·이용에 동의합니다. <span className="text-brand">*</span>
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-muted">{consult.privacy}</span>
          </span>
        </label>
      </Field>

      {state.ok === false && !state.errors && (
        <p role="alert" className="rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-14 w-full items-center justify-center rounded-full bg-brand text-base font-black text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "접수 중..." : "무료 상담 신청하기"}
      </button>
    </form>
  );
}
