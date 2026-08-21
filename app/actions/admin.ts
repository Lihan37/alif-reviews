"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminLoginSchema, normalizePhone } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { requestFingerprint } from "@/lib/security/owner";
import { clearAdminSession, createAdminSession, getAdminSession } from "@/lib/security/admin";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { ActionState, ReviewStatus } from "@/lib/types";

export async function adminLoginAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = adminLoginSchema.safeParse({ phone: formData.get("phone"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: "সঠিক ফোন নম্বর ও পাসওয়ার্ড লিখুন।" };

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(`admin:${requestFingerprint(ip, headerStore.get("user-agent") || "unknown")}`, 6)) {
    return { ok: false, message: "অনেকবার লগইনের চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" };
  }

  const phone = normalizePhone(parsed.data.phone);
  const approvedPhones = [process.env.ADMIN_PHONE_1, process.env.ADMIN_PHONE_2]
    .filter((value): value is string => Boolean(value)).map(normalizePhone);
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const passwordApproved = hash ? await bcrypt.compare(parsed.data.password, hash) : false;
  if (!approvedPhones.includes(phone) || !passwordApproved) {
    return { ok: false, message: "ফোন নম্বর অথবা পাসওয়ার্ড সঠিক নয়।" };
  }

  await createAdminSession(phone);
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function setReviewStatusAction(formData: FormData) {
  if (!(await getAdminSession())) redirect("/admin");
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString() as ReviewStatus;
  if (!id || !["published", "hidden"].includes(status)) return;
  const { error } = await getSupabaseAdmin().from("reviews").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/dashboard");
}
