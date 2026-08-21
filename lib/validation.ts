import { z } from "zod";

const optionalTrimmed = (max: number) =>
  z.string().trim().max(max).optional().transform((value) => value || null);

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating.").max(5, "Choose a rating."),
  reviewText: z.string().trim().min(3, "Please write at least 3 characters.").max(1000, "Keep your review under 1,000 characters."),
  name: optionalTrimmed(80),
  phone: optionalTrimmed(30).refine(
    (value) => !value || /^[+0-9()\-\s]{7,30}$/.test(value),
    "Enter a valid phone number."
  ),
  stayAnonymous: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export const adminLoginSchema = z.object({
  phone: z.string().trim().min(7).max(30),
  password: z.string().min(4).max(128),
});

export function normalizePhone(phone: string) {
  const compact = phone.replace(/[\s()-]/g, "");
  if (/^01\d{9}$/.test(compact)) return `+88${compact}`;
  if (/^8801\d{9}$/.test(compact)) return `+${compact}`;
  return compact;
}
