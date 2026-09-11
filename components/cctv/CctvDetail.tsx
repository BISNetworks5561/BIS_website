import Image from "next/image";
import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import { cctvDetail as d } from "@/lib/content-cctv";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

/** 상품 상세: 카메라 6종 → 공통 사양 → AI 감지 → 앱/PC */
export default function CctvDetail() {
  return (
    <Section id="detail" tone="surface" eyebrow={d.subtitle} title={d.title} desc={d.desc}>
      {/* 대표 제품 사진 */}
      <div className="mb-6 flex flex-col items-center gap-5 rounded-3xl bg-white p-6 shadow-card md:flex-row md:p-8">
        <div className="overflow-hidden rounded-2xl border border-line" style={{ backgroundColor: siteConfig.pricingCctv.cameraImageBg }}>
          <Image
            src={siteConfig.pricingCctv.cameraImage}
            alt="LG U+ 지능형 CCTV 실내 돔형 카메라"
            width={siteConfig.pricingCctv.cameraImageSize.width}
            height={siteConfig.pricingCctv.cameraImageSize.height}
            className="h-36 w-auto md:h-40"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-brand">U+지능형CCTV 카메라</p>
          <p className="mt-1 text-xl font-black">Full HD 2MP · 야간 적외선 · 클라우드 저장</p>
          <p className="mt-2 text-sm text-muted">
            실내 돔형(D-1200D)을 기본으로, 공간과 목적에 따라 아래 6종 중에서 고릅니다. 모든 카메라는 U+ 클라우드에 영상을 저장하고 AI 침입·훼손 감지를 기본 제공합니다.
          </p>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {d.cameras.map((c) => (
          <li key={c.model} className={cn("relative rounded-3xl bg-white p-6 shadow-card", c.badge === "인기" && "border-2 border-uplus")}>
            {c.badge && (
              <span className={cn("absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-bold text-white", c.badge === "인기" ? "bg-uplus" : "bg-brand-dark")}>
                {c.badge}
              </span>
            )}
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand">
                <Icon name="camera" className="h-6 w-6" />
              </span>
              <div>
                <p className="text-lg font-black">{c.type}</p>
                <p className="text-xs text-muted">{c.model}</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-brand-dark">{c.spec}</p>
            <p className="mt-1 text-sm text-muted">추천: {c.fit}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm font-bold text-brand">공통 사양</p>
          <dl className="mt-3 space-y-2">
            {d.commonSpec.map((s) => (
              <div key={s.k} className="flex items-start justify-between gap-3 rounded-2xl bg-surface px-3 py-2 text-sm">
                <dt className="text-muted">{s.k}</dt>
                <dd className="text-right font-bold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-3xl border-2 border-uplus bg-white p-6 shadow-card">
          <p className="text-sm font-bold text-uplus">{d.ai.title}</p>
          <p className="mt-3 text-xs font-bold text-muted">기본 제공</p>
          <ul className="mt-1 space-y-1 text-sm">
            {d.ai.basic.map((a) => (
              <li key={a} className="flex items-center gap-2 font-bold">
                <Icon name="check" className="h-4 w-4 text-uplus" strokeWidth={2.5} />
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-bold text-muted">선택 추가</p>
          <ul className="mt-1 space-y-1 text-sm text-ink/80">
            {d.ai.paid.map((a) => (
              <li key={a} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-brand" strokeWidth={2.5} />
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">{d.ai.paidNote}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm font-bold text-brand">{d.app.title}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/80">
            {d.app.points.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
