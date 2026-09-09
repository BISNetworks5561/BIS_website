import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

/** 백오피스 — 메뉴 비노출, 검색엔진 색인 제외, 접근 키 필요 */
export const metadata: Metadata = {
  title: "백오피스 | BIS네트웍스",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
