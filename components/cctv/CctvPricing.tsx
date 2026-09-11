"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { cctvPricingCopy as copy } from "@/lib/content-cctv";
import { krw, siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

export default function CctvPricing() {
  const { terms, install, addons, safety, vatNote, maxCameras } = siteConfig.pricingCctv;
  const defaultTerm = terms.find((t) => t.popular) ?? terms[0];
  const [months, setMonths] = useState<number>(defaultTerm.months);
  const [count, setCount] = useState(2);
  const term = terms.find((t) => t.months === months) ?? defaultTerm;
  const monthly = term.price * count;

  return (
    <Section id="pricing" tone="surface" eyebrow={copy.subtitle} title={copy.title} desc={vatNote}>
      {/* 약정별 요금 */}
      <div className="overflow-x-auto rounded-3xl bg-white shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th className="px-6 py-4 font-semibold">약정 기간</th>
              <th className="px-6 py-4 font-semibold">카메라 1대당 월 요금</th>
              <th className="px-6 py-4 font-semibold">비고</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((t) => (
              <tr key={t.term} className={cn("border-b border-line last:border-0", t.popular && "shadow-[inset_3px_0_0_0_var(--color-uplus)]")}>
                <th scope="row" className="px-6 py-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-lg font-black">{t.term}</span>
                    {t.badge && <span className="rounded-full bg-uplus px-2 py-0.5 text-[11px] font-bold text-white">{t.badge}</span>}
                  </div>
                </th>
                <td className="px-6 py-4">
                  <span className="text-lg font-black">{krw(t.price)}</span>
                  <span className="text-xs text-muted"> /월</span>
                </td>
                <td className="px-6 py-4 text-muted">{t.months >= 36 ? "설치비 프로모션 적용" : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 간단 계산기 */}
      <div className="mt-6 grid gap-4 rounded-3xl bg-white p-6 shadow-card md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <p className="text-sm font-bold text-brand-dark">예상 월 요금 계산</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="text-sm">
              약정
              <select value={months} onChange={(e) => setMonths(Number(e.target.value))} className="ml-2 rounded-xl border border-line px-3 py-2 text-sm">
                {terms.map((t) => (
                  <option key={t.term} value={t.months}>
                    {t.term}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              카메라
              <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="ml-2 rounded-xl border border-line px-3 py-2 text-sm">
                {Array.from({ length: maxCameras }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}대
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-2 text-xs text-muted">기본 요금만 계산한 값이며 부가서비스·설치비는 별도입니다.</p>
        </div>
        <div className="rounded-2xl bg-brand-gradient p-5 text-white md:min-w-[220px] md:text-right">
          <p className="text-xs opacity-80">
            {term.term} · 카메라 {count}대
          </p>
          <p className="text-3xl font-black">
            {krw(monthly)}
            <span className="text-sm font-medium opacity-80"> /월</span>
          </p>
        </div>
      </div>

      {/* 설치비 · 부가서비스 · 안심서비스 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm font-bold text-brand-dark">설치비</p>
          <ul className="mt-3 space-y-3 text-sm">
            {install.map((i) => (
              <li key={i.label} className="rounded-2xl bg-surface p-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted">{i.label}</span>
                  <span className="font-bold">{i.value}</span>
                </div>
                <p className="mt-1 text-xs font-bold text-uplus">{i.promo}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm font-bold text-brand-dark">부가서비스 (월)</p>
          <ul className="mt-3 divide-y divide-line text-sm">
            {addons.map((a) => (
              <li key={a.name} className="py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">{a.name}</span>
                  <span className="whitespace-nowrap">{a.price}</span>
                </div>
                <p className="text-xs text-muted">{a.note}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm font-bold text-brand-dark">안심서비스 · 에스원 (월)</p>
          <ul className="mt-3 divide-y divide-line text-sm">
            {safety.map((a) => (
              <li key={a.name} className="py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">{a.name}</span>
                  <span className="whitespace-nowrap">{a.price}</span>
                </div>
                <p className="text-xs text-muted">{a.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-xl bg-surface p-3 text-xs text-muted">
            에스원 긴급출동 {siteConfig.pricingCctv.s1.freeDispatch} · {siteConfig.pricingCctv.s1.extraDispatch}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-ink/80">
        {copy.notes.map((n) => (
          <p key={n} className="flex gap-2">
            <span className="text-muted">·</span>
            {n}
          </p>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button href="#consult" size="lg">
          {copy.cta}
        </Button>
      </div>
    </Section>
  );
}
