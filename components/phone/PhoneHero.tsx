import Image from "next/image";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import UplusBadge from "@/components/ui/UplusBadge";
import { phoneHero as hero } from "@/lib/content-phone";
import { siteConfig, telHref } from "@/site.config";

export default function PhoneHero() {
  const p = siteConfig.pricingPhone;
  return (
    <section className="relative overflow-hidden border-b border-line bg-white md:mt-6 md:rounded-3xl md:border">
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-brand-light blur-3xl md:h-[640px] md:w-[640px]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="animate-fade-up">
          <p className="mb-4">
            <UplusBadge>{hero.eyebrow}</UplusBadge>
          </p>
          <h1 className="text-3xl font-black leading-[1.2] tracking-tight md:text-4xl md:leading-[1.15] lg:text-5xl">
            {hero.title[0]}
            <br />
            <span className="text-brand-gradient">{hero.title[1]}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted md:text-lg">{hero.subtitle}</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {hero.bullets.map((b) => (
              <li key={b} className="flex items-center gap-1.5 text-sm font-semibold">
                <Icon name="check" className="h-4 w-4 text-brand" strokeWidth={2.5} />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#consult" size="lg">
              {hero.primaryCta}
              <Icon name="arrow" className="h-5 w-5" />
            </Button>
            <a
              href={telHref(siteConfig.contact.phone)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-brand-dark px-8 text-base font-bold text-brand-dark hover:bg-brand-dark hover:text-white"
            >
              <Icon name="phone" className="h-5 w-5" />
              {hero.secondaryCta} {siteConfig.contact.phoneDisplay}
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">{hero.note}</p>
        </div>

        {/* 단말기 카드 */}
        <div className="animate-fade-up [animation-delay:120ms]">
          <div className="relative rounded-3xl border border-line bg-white p-6 shadow-card md:p-8">
            <span className="absolute right-6 top-6 rounded-full bg-uplus px-3 py-1 text-xs font-bold text-white">{hero.device.badge}</span>
            <UplusBadge>기본 제공 단말기</UplusBadge>
            <div className="mt-4 overflow-hidden rounded-2xl" style={{ backgroundColor: p.deviceImageBg }}>
              <Image
                src={p.deviceImage}
                alt={`LG U+ 인터넷전화 단말기 ${hero.device.model}`}
                width={p.deviceImageSize.width}
                height={p.deviceImageSize.height}
                priority
                className="mx-auto h-auto w-full max-w-md"
              />
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-2xl font-black">{hero.device.model}</p>
                <p className="text-sm text-muted">{hero.device.caption}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">일반형 기본료</p>
                <p className="text-xl font-black text-brand-dark">
                  월 {p.plans[0].baseFee.toLocaleString("ko-KR")}원
                  <span className="text-xs font-medium text-muted"> 부터</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
