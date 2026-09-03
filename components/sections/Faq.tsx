import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import { faq } from "@/lib/content";

export default function Faq() {
  return (
    <Section id="faq" tone="surface" eyebrow={faq.subtitle} title={faq.title}>
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-3xl bg-white shadow-card">
        {faq.items.map((f, i) => (
          <details key={f.q} className="group px-6 md:px-8" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-bold marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="flex gap-3">
                <span className="text-brand">Q.</span>
                {f.q}
              </span>
              <Icon name="chevron" className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-6 pl-8 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
