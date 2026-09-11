import Section from "@/components/ui/Section";
import Icon, { type IconName } from "@/components/ui/Icon";
import { cctvDiagram as d } from "@/lib/content-cctv";
import { cn } from "@/lib/utils";

/** 서비스 구성도: 카메라 → PoE·인터넷 → U+ 클라우드 플랫폼 → 앱/PC */
export default function CctvDiagram() {
  return (
    <Section id="diagram" eyebrow={d.subtitle} title={d.title} desc={d.desc}>
      <div className="rounded-3xl bg-surface p-5 md:p-8">
        <ol className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {d.nodes.map((n, i) => (
            <li key={n.title} className="contents">
              <div className={cn("flex flex-col rounded-2xl p-5 shadow-card", i === 2 ? "bg-brand-gradient text-white" : "bg-white")}>
                <span className={cn("w-fit rounded-full px-2.5 py-1 text-[11px] font-bold", i === 2 ? "bg-white/15 ring-1 ring-white/30" : "border border-brand/40 text-brand")}>
                  {n.tag}
                </span>
                <span className={cn("mt-3 flex h-12 w-12 items-center justify-center rounded-xl", i === 2 ? "bg-white/15 ring-1 ring-white/30" : "bg-brand-light text-brand")}>
                  <Icon name={n.icon as IconName} className="h-6 w-6" />
                </span>
                <p className="mt-3 font-black">{n.title}</p>
                <p className={cn("mt-0.5 text-xs", i === 2 ? "text-white/80" : "text-muted")}>{n.desc}</p>
              </div>
              {i < d.nodes.length - 1 && (
                <div className="flex items-center justify-center text-brand" aria-hidden>
                  <Icon name="arrow" className="h-6 w-6 rotate-90 lg:rotate-0" />
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {d.side.map((s) => (
            <div key={s.title} className="flex items-start gap-3 rounded-2xl border border-dashed border-uplus/50 bg-white p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-uplus">
                <Icon name={s.icon as IconName} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black">{s.title}</p>
                <p className="text-xs text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-medium text-muted">
        <Icon name="check" className="h-4 w-4 text-brand" strokeWidth={2.5} />
        {d.note}
      </p>
    </Section>
  );
}
