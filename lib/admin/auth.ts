import "server-only";
import { NextResponse } from "next/server";

export const ADMIN_HEADER = "x-admin-key";

/** 백오피스 접근 키 (ADMIN_PASSCODE, 구버전 STUDIO_PASSCODE 도 허용) */
export function adminPasscode(): string | undefined {
  return process.env.ADMIN_PASSCODE || process.env.STUDIO_PASSCODE || undefined;
}

/** 요청 헤더의 키를 검증. 실패 시 NextResponse(에러) 반환, 성공 시 null */
export function requireAdmin(req: Request): NextResponse | null {
  const required = adminPasscode();
  if (!required) {
    return NextResponse.json(
      { error: "서버에 ADMIN_PASSCODE 환경변수가 없습니다. Vercel 환경변수에 추가 후 재배포하세요." },
      { status: 503 },
    );
  }
  const provided = req.headers.get(ADMIN_HEADER) ?? "";
  if (provided !== required) {
    return NextResponse.json({ error: "접근 키가 올바르지 않습니다." }, { status: 401 });
  }
  return null;
}
