import "server-only";
import { getServiceClient } from "@/lib/supabase/server";
import { mergeBanners, visibleBanners, type Banner, type BannerSettings } from "@/lib/banners";

export const BANNER_SETTINGS_KEY = "sidebar-banners";

/** 저장된 배너 설정 (없거나 읽기 불가하면 기본값) */
export async function loadBannerSettings(): Promise<Banner[]> {
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return mergeBanners(null);
  const supabase = getServiceClient();
  if (!supabase) return mergeBanners(null);
  try {
    const { data, error } = await supabase.from("admin_settings").select("value").eq("key", BANNER_SETTINGS_KEY).maybeSingle();
    if (error) return mergeBanners(null);
    return mergeBanners((data?.value ?? null) as Partial<BannerSettings> | null);
  } catch {
    return mergeBanners(null);
  }
}

/** 공개 페이지용: 현재 노출할 배너 */
export async function getVisibleBanners(): Promise<Banner[]> {
  return visibleBanners(await loadBannerSettings());
}
