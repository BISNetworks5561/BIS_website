import { cn } from "@/lib/utils";

/** LG U+ 공동 브랜딩 표기 — 마젠타 포인트는 이 컴포넌트를 통해서만 사용 */
export default function UplusBadge({ children = "LG U+ 오피스넷", className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-uplus/60 bg-white px-2.5 py-1 text-xs font-bold text-uplus",
        className,
      )}
    >
      <span className="rounded-sm bg-uplus px-1 text-[10px] font-black leading-4 text-white">U+</span>
      {children}
    </span>
  );
}
