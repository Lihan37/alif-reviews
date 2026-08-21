"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, X } from "lucide-react";
import { saveReviewAction } from "@/app/actions/reviews";
import { RatingSelector } from "@/components/RatingSelector";
import type { ActionState, Review } from "@/lib/types";

export function ReviewForm({ review, onCancel, onSuccess }: { review?: Review | null; onCancel?: () => void; onSuccess?: () => void }) {
  const [rating, setRating] = useState(review?.rating || 0);
  const [reviewText, setReviewText] = useState(review?.review_text || "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anonymous, setAnonymous] = useState(review?.stay_anonymous || false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [state, action, pending] = useActionState(async (previousState: ActionState, formData: FormData) => {
    const result = await saveReviewAction(previousState, formData);
    if (result.ok) {
      setDialogOpen(false);
      onSuccess?.();
      router.refresh();
    }
    return result;
  }, { ok: false, message: "" });

  useEffect(() => { if (dialogOpen) dialogRef.current?.showModal(); else dialogRef.current?.close(); }, [dialogOpen]);

  function continueToIdentity() {
    if (rating > 0 && reviewText.trim().length >= 3 && reviewText.length <= 1000) setDialogOpen(true);
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="intent" value={review ? "update" : "create"} />
      {review && <input type="hidden" name="reviewId" value={review.id} />}
      <input type="hidden" name="rating" value={rating} />
      <RatingSelector value={rating} onChange={setRating} />
      {state.errors?.rating && <FieldError>{state.errors.rating[0]}</FieldError>}
      <div>
        <label htmlFor="reviewText" className="mb-2 block text-sm font-semibold text-stone-700">আপনার অভিজ্ঞতা সম্পর্কে বলুন</label>
        <textarea id="reviewText" name="reviewText" value={reviewText} onChange={(event) => setReviewText(event.target.value)} rows={5}
          maxLength={1000} required placeholder="কী ভালো লেগেছে? আমরা আর কীভাবে ভালো করতে পারি?" className="field resize-none" aria-describedby="review-help" />
        <div id="review-help" className="mt-1.5 flex justify-between text-xs text-stone-500"><span>কমপক্ষে ৩টি অক্ষর লিখুন</span><span>{reviewText.length.toLocaleString("bn-BD")}/১০০০</span></div>
        {state.errors?.reviewText && <FieldError>{state.errors.reviewText[0]}</FieldError>}
      </div>
      {state.ok && <div className="success-message" role="status">{state.message}</div>}
      {!state.ok && state.message && <div className="error-message" role="alert">{state.message}</div>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {onCancel && <button type="button" onClick={onCancel} className="button-secondary sm:flex-1">সম্পাদনা বাতিল করুন</button>}
        <button type="button" onClick={continueToIdentity} disabled={!rating || reviewText.trim().length < 3 || reviewText.length > 1000} className="button-primary sm:flex-1">
          {review ? "পরবর্তী ধাপ" : "রিভিউ জমা দিন"}
        </button>
      </div>

      <dialog ref={dialogRef} onCancel={(event) => { event.preventDefault(); if (!pending) setDialogOpen(false); }}
        className="identity-dialog m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-cream p-0 text-charcoal shadow-2xl backdrop:bg-stone-950/55" aria-labelledby="identity-title">
        <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div><p className="eyebrow">আর মাত্র একটি ধাপ</p><h2 id="identity-title" className="mt-1 font-serif text-2xl font-semibold">আপনাকে কী নামে জানব?</h2></div>
            <button type="button" onClick={() => setDialogOpen(false)} disabled={pending} className="icon-button" aria-label="বন্ধ করুন"><X className="size-5" /></button>
          </div>
          <p className="mb-5 text-sm leading-6 text-stone-600">এই তথ্যগুলো দেওয়া ঐচ্ছিক এবং শুধু রেস্টুরেন্টের অ্যাডমিনরা দেখতে পারবেন।</p>
          <div className="space-y-4">
            <div><label htmlFor="name" className="label">নাম <span>ঐচ্ছিক</span></label><input id="name" name="name" defaultValue={review?.name || ""} maxLength={80} className="field" placeholder="আপনার নাম" /></div>
            <div><label htmlFor="phone" className="label">ফোন নম্বর <span>ঐচ্ছিক</span></label><input id="phone" name="phone" type="tel" defaultValue={review?.phone || ""} maxLength={30} className="field" placeholder="01XXXXXXXXX" />{state.errors?.phone && <FieldError>{state.errors.phone[0]}</FieldError>}</div>
            <label className="anonymous-option"><input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} className="size-4 accent-burgundy" />
              <span><strong>নাম গোপন রাখুন</strong><small>আপনার রিভিউতে “নাম প্রকাশে অনিচ্ছুক” দেখানো হবে।</small></span></label>
            <input type="hidden" name="stayAnonymous" value={anonymous ? "true" : "false"} />
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setDialogOpen(false)} disabled={pending} className="button-secondary">বাতিল করুন</button>
            <button type="submit" disabled={pending} className="button-primary">{pending && <LoaderCircle className="size-4 animate-spin" />}{pending ? "সংরক্ষণ হচ্ছে…" : review ? "পরিবর্তন সংরক্ষণ করুন" : "রিভিউ জমা দিন"}</button>
          </div>
        </div>
      </dialog>
    </form>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-sm text-red-700" role="alert">{children}</p>;
}
