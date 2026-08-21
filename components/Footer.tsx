import { siteConfig } from "@/src/config/site";

export function Footer() {
  return <footer className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-center text-xs text-stone-500 sm:flex-row sm:justify-between sm:px-8 sm:text-left">
    <p>© {new Intl.NumberFormat("bn-BD", { useGrouping: false }).format(new Date().getFullYear())} {siteConfig.restaurantName}</p><p>আপনার মতামত শুধু আপনি ও আমাদের দলের মধ্যেই গোপন থাকবে।</p>
  </footer>;
}
