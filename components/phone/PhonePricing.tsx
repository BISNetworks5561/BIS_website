import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { phonePricingCopy as copy } from "@/lib/content-phone";
import { krw, siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

export default function PhonePricing() {
  const { plans, callRates, fees, vatNote } = siteConfig.pricingPhone;
  return (
    <Section id="pricing" eyebrow={copy.subtitle} title={copy.title} desc={vatNote}>
      {/* 유형별 기본료 */}
      <ul className="grid gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <li key={p.key} className={cn("relative flex flex-col rounded-3xl border bg-white p-6 shadow-card md:p-8", p.popular ? "border-2 border-uplus" : "border-line")}>
            {p.badge && <span className="absolute -top-3 left-6 rounded-full bg-uplus px-3 py-1 text-xs font-bold text-white">{p.badge}</span>}
            <p className="text-xl font-black">{p.name}</p>
            <p className="mt-1 text-sm text-muted">{p.target}</p>
            <p className="mt-5 text-xs font-bold text-muted">회선당 기본료</p>
            <p>
              <span className="text-3xl font-black text-brand-dark">{krw(p.baseFee)}</span>
              <span className="text-sm text-muted"> /월</span>
              {"baseFeeNote" in p && p.baseFeeNote && <span className="ml-1 text-xs text-muted">({p.baseFeeNote})</span>}
            </p>
            {p.baseFeeBundled != null && (
              <p className="mt-1 text-sm font-bold text-uplus">U+ 인터넷 결합 시 {krw(p.baseFeeBundled)} /월</p>
            )}
            <ul className="mt-5 flex-1 space-y-1.5 text-sm text-muted">
              {p.calls.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                  {c}
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

      {/* 통화료 · 기타 비용 */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-surface p-6">
          <p className="text-sm font-bold text-brand-dark">통화료 (공통)</p>
          <dl className="mt-3 divide-y divide-line text-sm">
            {callRates.map((r) => (
              <div key={r.label} className="flex items-center justify-between py-2">
                <dt className="text-muted">{r.label}</dt>
                <dd className="font-bold">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-3xl bg-surface p-6">
          <p className="text-sm font-bold text-brand-dark">설치비 · 기타</p>
          <dl className="mt-3 divide-y divide-line text-sm">
            {fees.map((r) => (
              <div key={r.label} className="flex items-center justify-between py-2">
                <dt className="text-muted">{r.label}</dt>
                <dd className="font-bold">{r.value}</dd>
              </div>
            ))}
          </dl>
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
