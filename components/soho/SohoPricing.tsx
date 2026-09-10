"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { sohoPricingCopy as copy } from "@/lib/content-soho";
import { krw, siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

type TabKey = (typeof copy.tabs)[number]["key"];

export default function SohoPricing() {
  const [tab, setTab] = useState<TabKey>("single");
  const { plans, vatNote, bundleNote } = siteConfig.pricingSoho;

  return (
    <Section id="pricing" eyebrow={copy.subtitle} title={copy.title} desc={vatNote}>
      <div className="mx-auto mb-6 flex w-fit rounded-full bg-surface p-1" role="tablist" aria-label="요금 유형">
        {copy.tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn("rounded-full px-5 py-2.5 text-sm font-bold transition-colors md:px-7", tab === t.key ? "bg-brand-gradient text-white" : "text-muted hover:text-ink")}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="grid gap-5 md:grid-cols-3">
        {plans.map((p) => {
          const price = tab === "bundle" ? p.bundlePrice : p.price;
          return (
            <li
              key={p.speed}
              className={cn("relative flex flex-col rounded-3xl border bg-white p-6 shadow-card md:p-8", p.popular ? "border-2 border-uplus" : "border-line")}
            >
              {p.badge && (
                <span className="absolute -top-3 left-6 whitespace-nowrap rounded-full bg-uplus px-3 py-1 text-xs font-bold text-white">{p.badge}</span>
              )}
              <p className="text-3xl font-black">{p.speed}</p>
              <p className="mt-1 text-sm text-muted">{p.desc}</p>
              <p className="mt-5">
                <span className="text-3xl font-black text-brand-dark">{krw(price)}</span>
                <span className="text-sm text-muted"> /월</span>
              </p>
              {tab === "bundle" && <p className="text-xs text-muted line-through">단독 {krw(p.price)}</p>}
              <ul className="mt-5 flex-1 space-y-1.5 text-sm text-muted">
                {p.fit.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Icon name="check" className="h-4 w-4 text-brand" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#consult"
                className={cn(
                  "mt-6 inline-flex h-11 items-center justify-center rounded-full text-sm font-bold",
                  p.popular ? "bg-brand-gradient text-white hover:brightness-110" : "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white",
                )}
              >
                {copy.cta}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 space-y-2 text-sm text-ink/80">
        <p className="flex gap-2">
          <span className="text-muted">·</span>
          {bundleNote}
        </p>
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
