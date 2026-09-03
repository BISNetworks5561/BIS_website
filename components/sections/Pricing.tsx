"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { pricing } from "@/lib/content";
import { krw, siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

type TabKey = (typeof pricing.tabs)[number]["key"];

export default function Pricing() {
  const [tab, setTab] = useState<TabKey>("standalone");
  const rows = siteConfig.pricing[tab];

  return (
    <Section id="pricing" tone="surface" eyebrow={pricing.subtitle} title={pricing.title} desc={siteConfig.pricing.vatNote}>
      <div className="mx-auto mb-6 flex w-fit rounded-full bg-white p-1 shadow-card" role="tablist" aria-label="요금 유형">
        {pricing.tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-bold transition-colors md:px-7",
              tab === t.key ? "bg-brand text-white" : "text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-card">
        <table className="w-full min-w-[520px] text-left">
          <thead>
            <tr className="border-b border-line text-sm text-muted">
              <th scope="col" className="px-5 py-4 font-semibold md:px-8">
                속도
              </th>
              <th scope="col" className="px-5 py-4 font-semibold md:px-8">
                <span className="block font-bold text-ink">유동IP</span>
                <span className="hidden text-xs font-normal md:block">{pricing.ipHelp.dynamic}</span>
              </th>
              <th scope="col" className="px-5 py-4 font-semibold md:px-8">
                <span className="block font-bold text-ink">고정IP</span>
                <span className="hidden text-xs font-normal md:block">{pricing.ipHelp.static}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.speed}
                className={cn("border-b border-line last:border-0", r.popular && "bg-brand-light/40")}
              >
                <th scope="row" className="px-5 py-5 md:px-8">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black">{r.speed}</span>
                    {r.popular && (
                      <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">
                        {"badge" in r && r.badge ? r.badge : "인기"}
                      </span>
                    )}
                  </div>
                </th>
                <td className="px-5 py-5 md:px-8">
                  <span className="text-lg font-black">{krw(r.dynamic)}</span>
                  <span className="text-xs text-muted"> /월</span>
                </td>
                <td className="px-5 py-5 md:px-8">
                  <span className="text-lg font-black">{krw(r.static)}</span>
                  <span className="text-xs text-muted"> /월</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-5 space-y-1 text-xs text-muted md:text-sm">
        {tab === "bundle" && <li>· {siteConfig.pricing.bundleNote}</li>}
        <li>
          · 고정IP 추가 시 개당 {krw(siteConfig.pricing.extraStaticIp)}/월, 최대 {siteConfig.pricing.maxStaticIp}개까지
          가능합니다.
        </li>
        <li>· 표시 요금은 예시이며 건물 환경·지역·프로모션에 따라 달라질 수 있습니다. 정확한 견적은 상담을 통해 안내드립니다.</li>
      </ul>

      <div className="mt-8 text-center">
        <Button href="#consult" size="lg">
          {pricing.cta}
        </Button>
      </div>
    </Section>
  );
}
