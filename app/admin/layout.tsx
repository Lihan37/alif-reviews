import type { Metadata } from "next";

export const metadata: Metadata = { title: "অ্যাডমিন | আলিফ রেস্টুরেন্ট", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) { return children; }
