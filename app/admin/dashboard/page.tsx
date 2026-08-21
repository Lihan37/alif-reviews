import { CalendarClock, LogOut, MessageSquareText, Star } from "lucide-react";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/admin";
import { AdminDashboard } from "@/components/AdminDashboard";
import { BilingualText } from "@/components/BilingualText";
import { getAllReviews } from "@/lib/reviews";
import { getAdminSession } from "@/lib/security/admin";
import { siteConfig } from "@/src/config/site";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");
  const reviews = await getAllReviews();
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const todayKey = new Intl.DateTimeFormat("en-CA", { timeZone: siteConfig.businessTimeZone }).format(new Date());
  const todayLabelEn = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: siteConfig.businessTimeZone }).format(new Date());
  const todayLabelBn = new Intl.DateTimeFormat("bn-BD", { dateStyle: "full", timeZone: siteConfig.businessTimeZone }).format(new Date());
  const today = reviews.filter((review) => new Intl.DateTimeFormat("en-CA", { timeZone: siteConfig.businessTimeZone }).format(new Date(review.created_at)) === todayKey).length;
  const stats = [
    { label: "Total reviews · মোট রিভিউ", value: `${reviews.length} · ${reviews.length.toLocaleString("bn-BD")}`, icon: MessageSquareText },
    { label: "Average rating · গড় রেটিং", value: reviews.length ? `${average.toFixed(1)} · ${average.toLocaleString("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}` : "—", icon: Star },
    { label: "5-star reviews · ৫ তারকা রিভিউ", value: `${reviews.filter((review) => review.rating === 5).length} · ${reviews.filter((review) => review.rating === 5).length.toLocaleString("bn-BD")}`, icon: Star },
    { label: "Received today · আজকের রিভিউ", value: `${today} · ${today.toLocaleString("bn-BD")}`, icon: CalendarClock },
  ];
  return <main className="min-h-screen bg-stone-100">
    <header className="border-b border-stone-200 bg-white"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-5 sm:px-8"><div><p className="eyebrow"><BilingualText compact en={siteConfig.restaurantName} bn={siteConfig.restaurantNameBn} /></p><h1 className="mt-1 font-serif text-2xl font-semibold"><BilingualText en="Feedback dashboard" bn="মতামত ড্যাশবোর্ড" /></h1></div><form action={logoutAction}><button className="button-secondary min-h-10 px-3.5 py-2"><LogOut className="size-4" /><span className="hidden sm:inline"><BilingualText compact en="Log out" bn="লগআউট" /></span></button></form></div></header>
    <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-10">
      <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5" aria-label="Review summary · রিভিউ সারসংক্ষেপ">{stats.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex size-9 items-center justify-center rounded-xl bg-burgundy/8 text-burgundy"><Icon className="size-4.5" /></div><p className="text-2xl font-bold sm:text-3xl">{value}</p><p className="mt-1 text-xs text-stone-500 sm:text-sm">{label}</p></article>)}</section>
      <AdminDashboard reviews={reviews} timeZone={siteConfig.businessTimeZone} todayDateKey={todayKey} todayLabelEn={todayLabelEn} todayLabelBn={todayLabelBn} />
    </div>
  </main>;
}
