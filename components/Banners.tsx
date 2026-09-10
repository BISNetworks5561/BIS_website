import Image from "next/image";
import { BANNER_THEMES, type Banner } from "@/lib/banners";
import { cn } from "@/lib/utils";

/** 사이드 배너 렌더링 (홈 좌측 메뉴 아래 / 모바일 메뉴) */
export default function Banners({ banners, layout = "stack", onNavigate }: { banners: Banner[]; layout?: "stack" | "grid"; onNavigate?: () => void }) {
  if (!banners.length) return null;
  return (
    <div className={cn(layout === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3")}>
      {banners.map((b) => (
        <BannerCard key={b.id} banner={b} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

function BannerCard({ banner: b, onNavigate }: { banner: Banner; onNavigate?: () => void }) {
  const Wrapper = b.href ? "a" : "div";
  const linkProps = b.href
    ? { href: b.href, target: b.newTab ? "_blank" : undefined, rel: b.newTab ? "noopener noreferrer" : undefined, onClick: onNavigate }
    : {};
  return (
    <Wrapper
      {...linkProps}
      className="group relative block overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {b.kind === "image" && b.image ? (
        <Image
          src={b.image}
          alt={b.title}
          width={340}
          height={506}
          unoptimized={b.image.startsWith("http")}
          className="h-auto w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      ) : (
        <TextBanner b={b} />
      )}
      {b.badge && (
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-black text-amber-300 shadow-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          <span>{b.badge}</span>
        </div>
      )}
    </Wrapper>
  );
}

function TextBanner({ b }: { b: Banner }) {
  const theme = BANNER_THEMES[b.theme ?? "blue"];
  return (
    <div className={cn("flex aspect-[2/3] flex-col justify-between p-4", theme.className, theme.text)}>
      <p className="text-[11px] font-bold opacity-80">BISnetworks</p>
      <div>
        <p className="whitespace-pre-line text-lg font-black leading-tight">{b.title}</p>
        {b.subtitle && <p className="mt-2 whitespace-pre-line text-xs leading-relaxed opacity-85">{b.subtitle}</p>}
      </div>
      {b.cta && (
        <span
          className={cn(
            "inline-flex h-8 items-center justify-center rounded-full px-3 text-xs font-bold",
            theme.text === "text-white" ? "bg-white/90 text-ink" : "bg-brand text-white",
          )}
        >
          {b.cta} ›
        </span>
      )}
    </div>
  );
}
