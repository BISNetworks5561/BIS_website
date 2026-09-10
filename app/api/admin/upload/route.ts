import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "studio";
const FOLDERS: Record<string, { maxWidth: number }> = { banners: { maxWidth: 800 }, misc: { maxWidth: 1600 } };

/** 범용 이미지 업로드 (multipart: file, folder) → 공개 URL */
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    return NextResponse.json({ error: "이미지 업로드에는 SUPABASE_SECRET_KEY 가 필요합니다.", fallback: true }, { status: 503 });
  }
  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ error: "Supabase 설정 없음", fallback: true }, { status: 503 });

  const form = await req.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "misc");
  const spec = FOLDERS[folder];
  if (!spec) return NextResponse.json({ error: "folder 가 올바르지 않습니다." }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "이미지 파일이 없습니다." }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "10MB 이하 이미지만 올릴 수 있습니다." }, { status: 400 });

  let buf: Buffer;
  let ext = "jpg";
  let contentType = "image/jpeg";
  try {
    const img = sharp(Buffer.from(await file.arrayBuffer())).rotate();
    const meta = await img.metadata();
    const resized = img.resize({ width: spec.maxWidth, withoutEnlargement: true });
    if (meta.hasAlpha) {
      buf = await resized.png({ compressionLevel: 9 }).toBuffer();
      ext = "png";
      contentType = "image/png";
    } else {
      buf = await resized.jpeg({ quality: 88 }).toBuffer();
    }
  } catch {
    return NextResponse.json({ error: "이미지를 읽을 수 없습니다. PNG/JPG/WebP 파일인지 확인하세요." }, { status: 400 });
  }

  try {
    const { data: bucket } = await supabase.storage.getBucket(BUCKET);
    if (!bucket) {
      const { error } = await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: "10MB" });
      if (error && !/already exists/i.test(error.message)) throw new Error(error.message);
    }
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, buf, { contentType, upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
  } catch (e) {
    return NextResponse.json({ error: `업로드 실패: ${e instanceof Error ? e.message : String(e)}` }, { status: 502 });
  }
}
