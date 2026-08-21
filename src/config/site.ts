export const siteConfig = {
  restaurantName: "Alif Restaurant",
  shortName: "Alif",
  description: "Share your experience with Alif Restaurant.",
  logoPath: "/logo-mark.svg",
  phone: "+880 1XXX-XXXXXX",
  address: "Your restaurant address",
  businessTimeZone: process.env.BUSINESS_TIME_ZONE || "Asia/Dhaka",
} as const;
