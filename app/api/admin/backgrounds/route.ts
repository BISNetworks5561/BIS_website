import { NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";
import { BG_CATEGORIES, EMPTY_LIBRARY, type Background, type BackgroundLibrary, type BgCategory } from "@/lib/studio/backgrounds";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "studio";
const SETTINGS_KEY = "thumb-backgrounds";
const hasSecret = () => !!(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
const CategorySchema = z.enum(BG_CATEGORIES.map((c) => c.key) as [BgCategory, ...BgCategory[]]);

function unavailable() {
  return NextResponse.json(
    { error: "이미지 업로드에는 SUPABASE_SECRET_KEY 와 admin_settings 테이블이 필요합니다. 그 전까지는 브라우저 저장으로 동작합니다.", fallback: true },
    { status: 503 },
  );
}

async function loadLibrary() {
  const supabase = getServiceClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("admin_settings").select("value").eq("key", SETTINGS_KEY).maybeSingle();
  if (error) return null;
  const v = (data?.value ?? {}) as Partial<BackgroundLibrary>;
  return { supabase, lib: { items: Array.isArray(v.items) ? v.items : [], defaults: v.defaults ?? {} } as BackgroundLibrary };
}

async function saveLibrary(supabase: NonNullable<ReturnType<typeof getServiceClient>>, lib: BackgroundLibrary) {
  const { error } = await supabase.from("admin_settings").upsert({ key: SETTINGS_KEY, value: lib, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

async function ensureBucket(supabase: NonNullable<ReturnType<typeof getServiceClient>>) {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (data) return;
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: "10MB" });
  if (error && !/already exists/i.test(error.message)) throw new Error(error.message);
}

/** 라이브러리 조회 */
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasSecret()) return unavailable();
  const loaded = await loadLibrary();
  if (!loaded) return unavailable();
  return NextResponse.json({ library: loaded.lib });
}

/** 업로드 (multipart: file, name, category) */
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasSecret()) return unavailable();
  const loaded = await loadLibrary();
  if (!loaded) return unavailable();
  const { supabase, lib } = loaded;

  const form = await req.formData();
  const file = form.get("file");
  const name = String(form.get("name") ?? "").trim().slice(0, 40) || "내 배경";
  const category = CategorySchema.safeParse(form.get("category"));
  if (!(file instanceof File)) return NextResponse.json({ error: "이미지 파일이 없습니다." }, { status: 400 });
  if (!category.success) return NextResponse.json({ error: "카테고리가 올바르지 않습니다." }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "10MB 이하 이미지만 올릴 수 있습니다." }, { status: 400 });

  // 리사이즈(최대 1600px) + JPEG 변환, 밝기로 light 여부 판단
  let buf: Buffer;
  let light = false;
  try {
    const img = sharp(Buffer.from(await file.arrayBuffer())).rotate();
    const stats = await img.clone().resize(64, 64, { fit: "cover" }).greyscale().stats();
    light = (stats.channels[0]?.mean ?? 0) > 160;
    buf = await img.resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 88 }).toBuffer();
  } catch {
    return NextResponse.json({ error: "이미지를 읽을 수 없습니다. PNG/JPG/WebP 파일인지 확인하세요." }, { status: 400 });
  }

  try {
    await ensureBucket(supabase);
    const id = `bg-${Date.now()}`;
    const path = `backgrounds/${id}.jpg`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, buf, { contentType: "image/jpeg", upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const item: Background = { id, name, category: category.data, url: data.publicUrl, light, path };
    const next: BackgroundLibrary = { ...lib, items: [item, ...lib.items] };
    await saveLibrary(supabase, next);
    return NextResponse.json({ library: next, item });
  } catch (e) {
    return NextResponse.json({ error: `업로드 실패: ${e instanceof Error ? e.message : String(e)}` }, { status: 502 });
  }
}

const PatchSchema = z.object({
  defaults: z.record(CategorySchema, z.string().max(60)).optional(),
  rename: z.object({ id: z.string(), name: z.string().min(1).max(40), category: CategorySchema.optional() }).optional(),
});

/** 카테고리별 기본 배경 지정 / 이름·카테고리 변경 */
export async function PATCH(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasSecret()) return unavailable();
  const loaded = await loadLibrary();
  if (!loaded) return unavailable();
  let body;
  try {
    body = PatchSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }
  const next: BackgroundLibrary = { ...loaded.lib, defaults: { ...loaded.lib.defaults, ...(body.defaults ?? {}) } };
  if (body.rename) {
    next.items = next.items.map((b) =>
      b.id === body.rename!.id ? { ...b, name: body.rename!.name, category: body.rename!.category ?? b.category } : b,
    );
  }
  try {
    await saveLibrary(loaded.supabase, next);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "저장 실패" }, { status: 502 });
  }
  return NextResponse.json({ library: next });
}

/** 삭제 ?id= */
export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasSecret()) return unavailable();
  const loaded = await loadLibrary();
  if (!loaded) return unavailable();
  const id = new URL(req.url).searchParams.get("id") ?? "";
  const target = loaded.lib.items.find((b) => b.id === id);
  if (!target) return NextResponse.json({ error: "항목이 없습니다." }, { status: 404 });
  if (target.path) await loaded.supabase.storage.from(BUCKET).remove([target.path]);
  const defaults = Object.fromEntries(Object.entries(loaded.lib.defaults).filter(([, v]) => v !== id)) as BackgroundLibrary["defaults"];
  const next: BackgroundLibrary = { items: loaded.lib.items.filter((b) => b.id !== id), defaults };
  try {
    await saveLibrary(loaded.supabase, next);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "저장 실패" }, { status: 502 });
  }
  return NextResponse.json({ library: next });
}

export { EMPTY_LIBRARY };
