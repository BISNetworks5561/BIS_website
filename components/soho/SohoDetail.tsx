import Section from "@/components/ui/Section";
import Icon, { type IconName } from "@/components/ui/Icon";
import { sohoDetail as d } from "@/lib/content-soho";
import { siteConfig } from "@/site.config";

/** 상품 상세 안내: 속도별 추천 → 기본 제공 → 결합 서비스 → 오피스넷 비교 */
export default function SohoDetail() {
  return (
    <Section id="detail" tone="surface" eyebrow={d.subtitle} title={d.title} desc={d.desc}>
      {/* 속도별 추천 업종 */}
      <ul className="grid gap-4 md:grid-cols-3">
        {siteConfig.pricingSoho.plans.map((p) => (
          <li key={p.speed} className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black">{p.speed}</span>
              {p.badge && <span className="rounded-full bg-uplus px-2 py-0.5 text-[11px] font-bold text-white">{p.badge}</span>}
            </div>
            <p className="mt-1 text-sm font-bold text-brand-dark">{p.desc}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {p.fit.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-brand" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* 기본 제공 */}
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm font-bold text-brand">{d.included.title}</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {d.included.items.map((it) => (
              <li key={it.name} className="flex items-start gap-3 rounded-2xl bg-surface p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-card">
                  <Icon name={it.icon as IconName} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-black">{it.name}</p>
                  <p className="text-xs text-muted">{it.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* 결합 서비스 */}
        <div className="rounded-3xl border-2 border-uplus bg-white p-6 shadow-card">
          <p className="text-sm font-bold text-uplus">{d.addons.title}</p>
          <ul className="mt-3 space-y-3">
            {d.addons.items.map((it) => (
              <li key={it.name} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-uplus">
                  <Icon name={it.icon as IconName} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-black">{it.name}</p>
                  <p className="text-xs text-muted">{it.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 오피스넷 비교 */}
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-card">
        <p className="px-6 pt-6 text-sm font-bold text-brand-dark">{d.compare.title}</p>
        <table className="mt-3 w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th className="px-6 py-3 font-semibold">구분</th>
              <th className="px-6 py-3 font-bold text-brand">소호인터넷</th>
              <th className="px-6 py-3 font-semibold">오피스넷 (기업인터넷)</th>
            </tr>
          </thead>
          <tbody>
            {d.compare.rows.map((r) => (
              <tr key={r.label} className="border-b border-line last:border-0">
                <th scope="row" className="px-6 py-3 font-semibold text-muted">
                  {r.label}
                </th>
                <td className="px-6 py-3 font-bold">{r.soho}</td>
                <td className="px-6 py-3 text-ink/80">{r.office}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-6 pb-6 pt-3 text-xs text-muted">
          {d.compare.note}{" "}
          <a href="/" className="font-bold text-brand underline underline-offset-4">
            오피스넷 자세히 보기
          </a>
        </p>
      </div>
    </Section>
  );
}
