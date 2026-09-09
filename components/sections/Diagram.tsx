import Section from "@/components/ui/Section";
import Icon, { type IconName } from "@/components/ui/Icon";
import UplusBadge from "@/components/ui/UplusBadge";
import { diagram } from "@/lib/content";

function Node({
  icon,
  title,
  desc,
  tone = "light",
}: {
  icon: IconName;
  title: string;
  desc: string;
  tone?: "light" | "dark" | "uplus";
}) {
  return (
    <div
      className={
        tone === "dark"
          ? "flex flex-1 items-center gap-4 rounded-2xl bg-brand-gradient p-5 text-white shadow-card"
          : tone === "uplus"
            ? "flex flex-1 items-center gap-4 rounded-2xl border-2 border-uplus bg-white p-5 shadow-card"
            : "flex flex-1 items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card"
      }
    >
      <span
        className={
          tone === "dark"
            ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30"
            : tone === "uplus"
              ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-uplus"
              : "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand"
        }
      >
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="font-black">{title}</p>
        <p className={tone === "dark" ? "mt-0.5 text-xs text-white/80" : "mt-0.5 text-xs text-muted"}>{desc}</p>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center text-brand lg:px-1" aria-hidden>
      <Icon name="arrow" className="h-6 w-6 rotate-90 lg:rotate-0" />
    </div>
  );
}

export default function Diagram() {
  return (
    <Section id="diagram" tone="surface" eyebrow={diagram.subtitle} title={diagram.title} desc={diagram.desc}>
      {/* 백본 → 전용회선 → 사무실 */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        <div className="flex flex-1 flex-col gap-2">
          <UplusBadge className="w-fit">LG U+ 네트워크</UplusBadge>
          <Node tone="uplus" icon="shield" title={diagram.backbone.title} desc={diagram.backbone.desc} />
        </div>
        <Arrow />
        <div className="flex flex-1 flex-col gap-2">
          <span className="w-fit rounded-full border border-brand/40 px-2.5 py-1 text-xs font-bold text-brand">전용 회선</span>
          <Node tone="dark" icon="zap" title={diagram.line.title} desc={diagram.line.desc} />
        </div>
        <Arrow />
        <div className="flex flex-1 flex-col gap-2">
          <span className="w-fit rounded-full border border-brand/40 px-2.5 py-1 text-xs font-bold text-brand">고객 사무실</span>
          <Node icon="server" title={diagram.office.title} desc={diagram.office.desc} />
        </div>
      </div>

      {/* 사무실 내부 단말 */}
      <div className="mt-6 rounded-3xl border border-dashed border-brand/40 bg-white/60 p-5 md:p-6">
        <p className="mb-4 text-center text-sm font-bold text-brand-dark">사무실 내부 연결 (PC 대수 무제한)</p>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {diagram.devices.map((d) => (
            <li key={d.name} className="flex flex-col items-center rounded-2xl bg-white p-4 text-center shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                <Icon name={d.icon as IconName} className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-black">{d.name}</p>
              <p className="mt-0.5 text-xs text-muted">{d.desc}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-medium text-muted">
        <Icon name="headset" className="h-4 w-4 text-brand" />
        {diagram.support}
      </p>
    </Section>
  );
}
