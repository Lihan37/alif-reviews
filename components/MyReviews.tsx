"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { MyReview } from "@/components/MyReview";
import { ReviewForm } from "@/components/ReviewForm";
import { BilingualText } from "@/components/BilingualText";
import type { Review } from "@/lib/types";

export function MyReviews({ reviews }: { reviews: Review[] }) {
  const [adding, setAdding] = useState(false);

  if (adding) {
    return <section>
      <div className="mb-7"><p className="eyebrow"><BilingualText en="Another visit" bn="আরেকটি অভিজ্ঞতা" /></p><h2 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl"><BilingualText en="Submit another review" bn="আরেকটি রিভিউ জমা দিন" /></h2></div>
      <ReviewForm onCancel={() => setAdding(false)} onSuccess={() => setAdding(false)} />
    </section>;
  }

  return <section>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="eyebrow"><BilingualText compact en="Your feedback" bn="আপনার মতামত" /></p><h2 className="mt-1 font-serif text-2xl font-semibold"><BilingualText en="Your reviews" bn="আপনার রিভিউসমূহ" /></h2><p className="mt-1 text-sm text-stone-500">{reviews.length} review(s) from this browser · এই ব্রাউজার থেকে {reviews.length.toLocaleString("bn-BD")}টি রিভিউ</p></div>
      <button type="button" onClick={() => setAdding(true)} className="button-primary shrink-0"><Plus className="size-4" /><BilingualText compact en="Another review" bn="আরেকটি রিভিউ" /></button>
    </div>
    <div className="grid gap-4">{reviews.map((review) => <MyReview key={review.id} review={review} />)}</div>
  </section>;
}
