"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { sohoPricingCopy as copy } from "@/lib/content-soho";
import { krw, siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

export default function SohoPricing() {
  const { products, vatNote } = siteConfig.pricingSoho;
  const [key, setKey] = useState<(typeof products)[number]["key"]>(products[0].key);
  const product = products.find((p) => p.key === key) ?? products[0];

  return (
    <Section id="pricing" eyebrow={copy.subtitle} title={copy.title} desc={vatNote}>
      <div className="mx-auto mb-3 flex w-fit rounded-full bg-surface p-1" role="tablist" aria-label="상품 유형">
        {products.map((p) => (
          <button
            key={p.key}
            role="tab"
            type="button"
            aria-selected={key === p.key}
            onClick={() => setKey(p.key)}
            className={cn("rounded-full px-5 py-2.5 text-sm font-bold transition-colors md:px-7", key === p.key ? "bg-brand-gradient text-white" : "text-muted hover:text-ink")}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-muted">{product.desc}</p>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {product.plans.map((p) => (
          <li
            key={p.speed}
            className={cn("relative flex flex-col rounded-3xl border bg-white p-6 shadow-card", p.popular ? "border-2 border-uplus" : "border-line")}
          >
            {p.badge && (
              <span className="absolute -top-3 left-6 whitespace-nowrap rounded-full bg-uplus px-3 py-1 text-xs font-bold text-white">{p.badge}</span>
            )}
            <p className="text-3xl font-black">{p.speed}</p>
            <p className="mt-1 text-sm text-muted">{p.desc}</p>
            <p className="mt-5">
              <span className={cn("font-black text-brand-dark", p.price == null ? "text-xl" : "text-3xl")}>{krw(p.price)}</span>
              {p.price != null && <span className="text-sm text-muted"> /월</span>}
            </p>
            <ul className="mt-5 flex-1 space-y-1.5 text-sm text-muted">
              {p.fit.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
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
        ))}
      </ul>

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
