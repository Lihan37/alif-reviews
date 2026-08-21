"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { MyReview } from "@/components/MyReview";
import { ReviewForm } from "@/components/ReviewForm";
import type { Review } from "@/lib/types";

export function MyReviews({ reviews }: { reviews: Review[] }) {
  const [adding, setAdding] = useState(false);

  if (adding) {
    return <section>
      <div className="mb-7"><p className="eyebrow">Another visit</p><h2 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Submit another review</h2></div>
      <ReviewForm onCancel={() => setAdding(false)} onSuccess={() => setAdding(false)} />
    </section>;
  }

  return <section>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="eyebrow">Your feedback</p><h2 className="mt-1 font-serif text-2xl font-semibold">Your reviews</h2><p className="mt-1 text-sm text-stone-500">{reviews.length} review{reviews.length === 1 ? "" : "s"} from this browser</p></div>
      <button type="button" onClick={() => setAdding(true)} className="button-primary shrink-0"><Plus className="size-4" />Submit another review</button>
    </div>
    <div className="grid gap-4">{reviews.map((review) => <MyReview key={review.id} review={review} />)}</div>
  </section>;
}
