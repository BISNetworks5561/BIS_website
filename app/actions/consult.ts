"use server";

import { headers } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";

import type { ConsultState } from "@/lib/consult";

const PLAN_TYPES = new Set(["standalone", "bundle", "unknown"]);
const IP_TYPES = new Set(["dynamic", "static", "unknown"]);

function str(fd: FormData, key: string, max = 200) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function submitConsult(
  _prev: ConsultState,
  formData: FormData,
): Promise<ConsultState> {
  // 허니팟: 봇이 채우는 숨김 필드
  if (str(formData, "website")) {
    return { ok: true, message: "상담 신청이 접수되었습니다." };
  }

  const name = str(formData, "name", 50);
  const company = str(formData, "company", 100);
  const phoneRaw = str(formData, "phone", 30);
  const email = str(formData, "email", 100);
  const region = str(formData, "region", 100);
  const planTypeRaw = str(formData, "plan_type", 20);
  const speed = str(formData, "speed", 10);
  const ipTypeRaw = str(formData, "ip_type", 20);
  const message = str(formData, "message", 2000);
  const agree = formData.get("agree_privacy") === "on";

  const errors: Record<string, string> = {};
  const phone = phoneRaw.replace(/[^\d]/g, "");

  if (name.length < 2) errors.name = "담당자명을 입력해 주세요.";
  if (!/^0\d{8,10}$/.test(phone)) errors.phone = "연락처를 정확히 입력해 주세요. (예: 010-1234-5678)";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "이메일 형식이 올바르지 않습니다.";
  if (!agree) errors.agree_privacy = "개인정보 수집·이용에 동의해 주세요.";

  if (Object.keys(errors).length) {
    return { ok: false, message: "입력 내용을 확인해 주세요.", errors };
  }

  const supabase = getServiceClient();
  if (!supabase) {
    console.error("[consult] Supabase env vars are not set.");
    return {
      ok: false,
      message: "일시적인 오류로 접수하지 못했습니다. 전화로 문의해 주세요.",
    };
  }

  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : null;

  const { error } = await supabase.from("consult_requests").insert({
    name,
    company: company || null,
    phone: formatPhone(phone),
    email: email || null,
    region: region || null,
    plan_type: PLAN_TYPES.has(planTypeRaw) ? planTypeRaw : "unknown",
    speed: speed || null,
    ip_type: IP_TYPES.has(ipTypeRaw) ? ipTypeRaw : "unknown",
    message: message || null,
    agree_privacy: agree,
    source: h.get("referer"),
    user_agent: h.get("user-agent")?.slice(0, 500) ?? null,
    ip,
  });

  if (error) {
    console.error("[consult] insert failed:", error.message);
    return {
      ok: false,
      message: "일시적인 오류로 접수하지 못했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요.",
    };
  }

  return {
    ok: true,
    message: "상담 신청이 접수되었습니다. 영업시간 내 담당자가 빠르게 연락드리겠습니다.",
  };
}

function formatPhone(digits: string) {
  if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  if (digits.length === 10) {
    return digits.startsWith("02")
      ? digits.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3")
      : digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  if (digits.length === 9) return digits.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
  return digits;
}
