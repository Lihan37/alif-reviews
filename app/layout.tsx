import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "Alif Restaurant Feedback | আলিফ রেস্টুরেন্ট মতামত",
  description: siteConfig.description,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fbf6eb" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
