import { z } from "zod";

const optionalTrimmed = (max: number) =>
  z.string().trim().max(max).optional().transform((value) => value || null);

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "একটি রেটিং নির্বাচন করুন।").max(5, "একটি রেটিং নির্বাচন করুন।"),
  reviewText: z.string().trim().min(3, "কমপক্ষে ৩টি অক্ষর লিখুন।").max(1000, "রিভিউটি ১,০০০ অক্ষরের মধ্যে রাখুন।"),
  name: optionalTrimmed(80),
  phone: optionalTrimmed(30).refine(
    (value) => !value || /^[+0-9()\-\s]{7,30}$/.test(value),
    "সঠিক ফোন নম্বর লিখুন।"
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
