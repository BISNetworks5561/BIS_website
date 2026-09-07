import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "white" | "ghost" | "uplus";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const variants: Record<Variant, string> = {
  primary: "bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgba(17,96,184,0.6)] hover:brightness-110",
  outline: "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white",
  white: "bg-white text-brand-dark hover:bg-brand-light",
  ghost: "text-brand hover:bg-brand-light",
  uplus: "bg-uplus text-white hover:bg-uplus-dark",
};
const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
};

type Props = {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export default function Button({ href, variant = "primary", size = "md", className, children, ...rest }: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
