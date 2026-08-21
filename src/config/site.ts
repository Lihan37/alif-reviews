function resolveBusinessTimeZone() {
  const configured = (process.env.BUSINESS_TIME_ZONE || "Asia/Dhaka").trim();
  try {
    new Intl.DateTimeFormat("en", { timeZone: configured }).format();
    return configured;
  } catch {
    return "UTC";
  }
}

export const siteConfig = {
  restaurantName: "Alif Restaurant",
  restaurantNameBn: "আলিফ রেস্টুরেন্ট",
  shortName: "Alif",
  shortNameBn: "আলিফ",
  description: "Share your experience with Alif Restaurant. আলিফ রেস্টুরেন্টে আপনার অভিজ্ঞতা আমাদের জানান।",
  logoPath: "/logo-mark.svg",
  phone: "+880 1XXX-XXXXXX",
  address: "রেস্টুরেন্টের ঠিকানা",
  businessTimeZone: resolveBusinessTimeZone(),
} as const;
