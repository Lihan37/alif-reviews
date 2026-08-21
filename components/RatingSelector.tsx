"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function RatingSelector({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  const [preview, setPreview] = useState(0);
  const shown = preview || value;
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-stone-700">How was your experience?</legend>
      <div className="flex w-fit gap-1" onMouseLeave={() => setPreview(0)}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button key={rating} type="button" className="rating-star rounded-lg p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
            onClick={() => onChange(rating)} onMouseEnter={() => setPreview(rating)}
            aria-label={`${rating} star${rating > 1 ? "s" : ""}`} aria-pressed={value === rating}>
            <Star className={`size-9 sm:size-10 ${rating <= shown ? "fill-gold text-gold" : "text-stone-300"}`} strokeWidth={1.8} />
          </button>
        ))}
      </div>
      <p className="mt-2 h-5 text-sm text-stone-500" aria-live="polite">
        {shown ? ["", "Not for me", "Could be better", "It was good", "Really enjoyed it", "Excellent"][shown] : "Tap a star to rate"}
      </p>
    </fieldset>
  );
}
