import "server-only";
import { createHash, createHmac, randomBytes } from "node:crypto";

export const OWNER_COOKIE = "alif_review_owner";
export const OWNER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function createOwnerToken() {
  return randomBytes(32).toString("base64url");
}

export function hashOwnerToken(token: string) {
  const secret = process.env.OWNER_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("OWNER_TOKEN_SECRET must contain at least 32 characters.");
  }
  return createHmac("sha256", secret).update(token).digest("hex");
}

export function requestFingerprint(ip: string, userAgent: string) {
  return createHash("sha256").update(`${ip}|${userAgent}`).digest("hex");
}
