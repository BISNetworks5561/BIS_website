import Section from "@/components/ui/Section";
import Icon, { type IconName } from "@/components/ui/Icon";
import { bundles } from "@/lib/content";
import { krw, siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

export default function Bundles() {
  return (
    <Section id="bundles" eyebrow={bundles.subtitle} title={bundles.title} desc={siteConfig.bundlePackagesNote}>
      {/* 실제 결합 패키지 요금 */}
      <ul className="grid gap-5 md:grid-cols-3">
        {siteConfig.bundlePackages.map((p) => (
          <li
            key={p.name}
            className={cn(
              "relative flex flex-col rounded-3xl border p-6 shadow-card md:p-8",
              p.popular ? "border-2 border-uplus bg-white" : "border-line",
            )}
          >
            {p.popular && (
              <span className="absolute -top-3 left-6 rounded-full bg-uplus px-3 py-1 text-xs font-bold text-white">
                가장 많이 찾는 구성
              </span>
            )}
            <h3 className="text-lg font-black">{p.name}</h3>
            <ul className="mt-4 space-y-1.5 text-sm text-muted">
              {p.items.map((it) => (
                <li key={it} className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-brand" strokeWidth={2.5} />
                  {it}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex-1" />
            <p className="text-xs text-muted line-through">정상가 {krw(p.regularPrice)}</p>
            <p className="mt-0.5">
              <span className="text-3xl font-black text-brand-dark">{krw(p.price)}</span>
              <span className="text-sm text-muted"> /월</span>
            </p>
            <a
              href="#consult"
              className={cn(
                "mt-5 inline-flex h-11 items-center justify-center rounded-full text-sm font-bold",
                p.popular ? "bg-brand-gradient text-white hover:brightness-110" : "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white",
              )}
            >
              이 구성으로 상담받기
            </a>
          </li>
        ))}
      </ul>

      {/* 결합 가능한 서비스 */}
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {bundles.items.map((b) => (
          <li key={b.name} className="flex items-start gap-4 rounded-2xl bg-surface p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-card">
              <Icon name={b.icon as IconName} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold text-brand">{b.tag}</p>
              <p className="font-black">{b.name}</p>
              <p className="mt-1 text-sm text-muted">{b.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
