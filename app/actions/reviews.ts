"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { reviewSchema, normalizePhone } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { createOwnerToken, hashOwnerToken, OWNER_COOKIE, OWNER_COOKIE_MAX_AGE, requestFingerprint } from "@/lib/security/owner";
import type { ActionState } from "@/lib/types";

export async function saveReviewAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    reviewText: formData.get("reviewText"),
    name: formData.get("name")?.toString(),
    phone: formData.get("phone")?.toString(),
    stayAnonymous: formData.get("stayAnonymous"),
  });
  if (!parsed.success) {
    return { ok: false, message: "চিহ্নিত তথ্যগুলো ঠিক করে দিন।", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const fingerprint = requestFingerprint(ip, headerStore.get("user-agent") || "unknown");
    if (!checkRateLimit(`review:${fingerprint}`)) {
      return { ok: false, message: "অনেকবার চেষ্টা করা হয়েছে। কয়েক মিনিট পর আবার চেষ্টা করুন।" };
    }

    const cookieStore = await cookies();
    const existingToken = cookieStore.get(OWNER_COOKIE)?.value;
    const intent = formData.get("intent")?.toString();
    const reviewId = formData.get("reviewId")?.toString();
    const values = {
      rating: parsed.data.rating,
      review_text: parsed.data.reviewText,
      name: parsed.data.name,
      phone: parsed.data.phone ? normalizePhone(parsed.data.phone) : null,
      stay_anonymous: parsed.data.stayAnonymous,
    };
    const supabase = getSupabaseAdmin();

    if (intent === "update") {
      if (!existingToken || !reviewId) {
        return { ok: false, message: "এই রিভিউটির মালিকানা যাচাই করা যায়নি।" };
      }
      const { data, error } = await supabase.from("reviews")
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq("id", reviewId)
        .eq("owner_token_hash", hashOwnerToken(existingToken)).select("id").maybeSingle();
      if (error) throw error;
      if (data) {
        revalidatePath("/");
        return { ok: true, message: "আপনার রিভিউ হালনাগাদ হয়েছে। ধন্যবাদ!" };
      }
      return { ok: false, message: "এই রিভিউটির মালিকানা যাচাই করা যায়নি।" };
    }

    const token = existingToken || createOwnerToken();
    const { error } = await supabase.from("reviews").insert({ ...values, owner_token_hash: hashOwnerToken(token) });
    if (error) throw error;
    if (!existingToken) {
      cookieStore.set(OWNER_COOKIE, token, {
        httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: OWNER_COOKIE_MAX_AGE,
      });
    }
    revalidatePath("/");
    return { ok: true, message: "আপনার মূল্যবান মতামতের জন্য ধন্যবাদ ❤️" };
  } catch (error) {
    console.error("Review save failed", error);
    return { ok: false, message: "আপনার রিভিউ সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।" };
  }
}
