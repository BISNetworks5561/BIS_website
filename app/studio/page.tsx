import { redirect } from "next/navigation";

/** 구 주소 → 백오피스 */
export default function StudioRedirect() {
  redirect("/admin/studio");
}
