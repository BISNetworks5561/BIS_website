import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  desc?: string;
  className?: string;
  tone?: "white" | "surface" | "brand";
  children: React.ReactNode;
};

export default function Section({ id, eyebrow, title, desc, className, tone = "white", children }: Props) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-16 md:py-24",
        tone === "surface" && "bg-surface",
        tone === "brand" && "bg-brand text-white",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <header className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          {eyebrow && (
            <p className={cn("mb-3 text-sm font-bold tracking-wide", tone === "brand" ? "text-white/80" : "text-brand")}>
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-black leading-tight md:text-4xl">{title}</h2>
          {desc && (
            <p className={cn("mt-4 text-base md:text-lg", tone === "brand" ? "text-white/85" : "text-muted")}>{desc}</p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
