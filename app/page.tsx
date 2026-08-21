import { MessageSquareHeart, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MyReviews } from "@/components/MyReviews";
import { ReviewForm } from "@/components/ReviewForm";
import { getOwnedReviews } from "@/lib/reviews";
import type { Review } from "@/lib/types";
import { siteConfig } from "@/src/config/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let reviews: Review[] = [];
  let setupMissing = false;
  try { reviews = await getOwnedReviews(); } catch { setupMissing = true; }

  return <main className="relative min-h-screen overflow-hidden">
    <div aria-hidden="true" className="absolute -top-36 -right-28 size-80 rounded-full bg-burgundy/[0.05]" />
    <div aria-hidden="true" className="absolute top-72 -left-36 size-72 rounded-full border-[56px] border-gold/[0.07]" />
    <Header />
    <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pt-8 pb-12 sm:px-8 sm:pt-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-20 lg:pt-20 lg:pb-24">
      <div className="relative z-10 max-w-lg">
        <p className="eyebrow">We’re listening</p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl lg:text-6xl">How was your time at <span className="text-burgundy">{siteConfig.shortName}?</span></h1>
        <div className="mt-8 flex flex-col gap-3 text-sm text-stone-600 sm:flex-row sm:gap-6">
          <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-olive" />Private and secure</span>
          <span className="inline-flex items-center gap-2"><MessageSquareHeart className="size-4 text-olive" />Takes about a minute</span>
        </div>
      </div>
      <div className="relative z-10 rounded-[1.75rem] border border-stone-200/80 bg-white/95 p-6 shadow-[0_24px_80px_rgba(73,54,38,0.12)] sm:p-9">
        {setupMissing ? <SetupNotice /> : reviews.length ? <MyReviews reviews={reviews} /> : <><div className="mb-7"><p className="eyebrow">Share your thoughts</p><h2 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Your feedback matters</h2></div><ReviewForm /></>}
      </div>
    </section>
    <Footer />
  </main>;
}

function SetupNotice() {
  return <div className="py-6 text-center"><h2 className="font-serif text-2xl font-semibold">Almost ready</h2><p className="mt-3 leading-7 text-stone-600">Connect Supabase using the environment variables in <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">.env.example</code>, then run the included database migration.</p></div>;
}
