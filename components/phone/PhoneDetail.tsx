import Image from "next/image";
import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import { phoneDetail as d } from "@/lib/content-phone";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

/** 상품 상세: 유형 3종 → 단말기 IP-520GA → 부가서비스 */
export default function PhoneDetail() {
  return (
    <Section id="detail" tone="surface" eyebrow={d.subtitle} title={d.title} desc={d.desc}>
      {/* 유형 3종 */}
      <ul className="grid gap-4 md:grid-cols-3">
        {d.types.map((t) => (
          <li key={t.key} className={cn("relative rounded-3xl bg-white p-6 shadow-card", t.badge && "border-2 border-uplus")}>
            {t.badge && <span className="absolute -top-3 left-6 rounded-full bg-uplus px-3 py-1 text-xs font-bold text-white">{t.badge}</span>}
            <p className="text-xl font-black">{t.name}</p>
            <p className="mt-1 text-sm font-bold text-brand-dark">{t.target}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {t.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                  {pt}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* 단말기 */}
      <div className="mt-6 grid gap-4 rounded-3xl bg-white p-6 shadow-card md:grid-cols-[1fr_1.1fr] md:p-8">
        <div>
          <Image
            src={siteConfig.pricingPhone.deviceImage}
            alt="IP-520GA 인터넷전화 단말기"
            width={1000}
            height={760}
            className="h-auto w-full rounded-2xl bg-surface"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-brand">{d.device.title}</p>
          <dl className="mt-3 grid grid-cols-2 gap-3">
            {d.device.specs.map((s) => (
              <div key={s.k} className="rounded-2xl bg-surface p-3">
                <dt className="text-xs text-muted">{s.k}</dt>
                <dd className="mt-0.5 text-sm font-black">{s.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs font-bold text-muted">그 외 선택 가능 단말기</p>
          <ul className="mt-1 divide-y divide-line text-sm">
            {d.device.others.map((o) => (
              <li key={o.model} className="flex items-center justify-between py-2">
                <span>
                  <span className="font-bold">{o.model}</span>
                  <span className="text-muted"> · {o.desc}</span>
                </span>
                <span className="whitespace-nowrap font-bold text-brand-dark">{o.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 부가서비스 */}
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-card">
        <p className="px-6 pt-6 text-sm font-bold text-brand-dark">{d.addons.title}</p>
        <table className="mt-3 w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th className="px-6 py-3 font-semibold">서비스</th>
              <th className="px-6 py-3 font-semibold">월 요금</th>
              <th className="px-6 py-3 font-semibold">비고</th>
            </tr>
          </thead>
          <tbody>
            {d.addons.items.map((a) => (
              <tr key={a.name} className="border-b border-line last:border-0">
                <td className="px-6 py-3 font-bold">{a.name}</td>
                <td className="px-6 py-3">{a.price}</td>
                <td className="px-6 py-3 text-muted">{a.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-6 pb-6 pt-3 text-xs text-muted">부가서비스 요금은 LG U+ 공시 기준(부가세 포함)이며 변경될 수 있습니다.</p>
      </div>
    </Section>
  );
}
