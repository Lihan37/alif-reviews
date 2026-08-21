"use client";

import { useState } from "react";
import { CalendarDays, Pencil, Star } from "lucide-react";
import { ReviewForm } from "@/components/ReviewForm";
import type { Review } from "@/lib/types";

export function MyReview({ review }: { review: Review }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6"><ReviewForm review={review} onCancel={() => setEditing(false)} onSuccess={() => setEditing(false)} /></div>;
  const updated = new Date(review.updated_at).getTime() - new Date(review.created_at).getTime() > 1000;
  return (
    <article className="rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div><p className="eyebrow">Your review</p><h2 className="mt-1 font-serif text-xl font-semibold">{review.stay_anonymous ? "Anonymous" : review.name || "Guest"}</h2></div>
        <div className="flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1.5 font-semibold text-amber-800"><Star className="size-4 fill-gold text-gold" />{review.rating}/5</div>
      </div>
      <blockquote className="whitespace-pre-wrap text-lg leading-8 text-stone-700">“{review.review_text}”</blockquote>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-stone-200 pt-5 text-sm text-stone-500">
        <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" />Submitted {formatDate(review.created_at)}</span>
        {updated && <span>Updated {formatDate(review.updated_at)}</span>}
      </div>
      <button type="button" onClick={() => setEditing(true)} className="button-secondary mt-5 w-full sm:w-auto"><Pencil className="size-4" />Edit review</button>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}
