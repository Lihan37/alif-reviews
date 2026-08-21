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
  shortName: "Alif",
  description: "Share your experience with Alif Restaurant.",
  logoPath: "/logo-mark.svg",
  phone: "+880 1XXX-XXXXXX",
  address: "Your restaurant address",
  businessTimeZone: resolveBusinessTimeZone(),
} as const;
