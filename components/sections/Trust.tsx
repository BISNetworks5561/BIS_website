import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import { trust } from "@/lib/content";
import { siteConfig } from "@/site.config";

export default function Trust() {
  return (
    <Section id="trust" eyebrow={trust.subtitle} title={trust.title}>
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {siteConfig.stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-line p-6 text-center">
            <dd className="text-3xl font-black text-brand md:text-4xl">
              {s.value.toLocaleString("ko-KR")}
              <span className="text-xl md:text-2xl">{s.suffix}</span>
            </dd>
            <dt className="mt-2 text-sm font-medium text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <ul className="space-y-3 rounded-3xl bg-surface p-6 md:p-8">
          {trust.points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm font-medium md:text-base">
              <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={2.5} />
              {p}
            </li>
          ))}
        </ul>
        <ul className="space-y-3 rounded-3xl border border-line p-6 md:p-8">
          <li className="mb-2 text-sm font-bold text-brand">수상 · 인증</li>
          {siteConfig.awards.map((a) => (
            <li key={a} className="flex items-start gap-3 text-sm font-medium md:text-base">
              <Icon name="award" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
