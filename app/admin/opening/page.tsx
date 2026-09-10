import type { Metadata } from "next";
import OpeningGuideClient from "@/components/admin/OpeningGuideClient";

export const metadata: Metadata = {
  title: "BIS opening 사용법 | BIS네트웍스 백오피스",
};

export default function AdminOpeningPage() {
  return <OpeningGuideClient />;
}
