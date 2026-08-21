import "server-only";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { hashOwnerToken, OWNER_COOKIE } from "@/lib/security/owner";
import type { Review } from "@/lib/types";

const reviewColumns = "id,rating,review_text,name,phone,stay_anonymous,status,created_at,updated_at";

export async function getOwnedReviews(): Promise<Review[]> {
  const token = (await cookies()).get(OWNER_COOKIE)?.value;
  if (!token) return [];

  const { data, error } = await getSupabaseAdmin()
    .from("reviews")
    .select(reviewColumns)
    .eq("owner_token_hash", hashOwnerToken(token))
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Review[];
}

export async function getAllReviews(): Promise<Review[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("reviews")
    .select(reviewColumns)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Review[];
}
