"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Eye, EyeOff, Search, Star, X } from "lucide-react";
import { setReviewStatusAction } from "@/app/actions/admin";
import type { Review } from "@/lib/types";

type RatingFilter = "all" | "1" | "2" | "3" | "4" | "5";
type SortOrder = "newest" | "oldest";

const PAGE_SIZE = 10;

export function AdminDashboard({ reviews, timeZone, todayDateKey, todayLabel }: { reviews: Review[]; timeZone: string; todayDateKey: string; todayLabel: string }) {
  const [rating, setRating] = useState<RatingFilter>("all");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayDateKey);
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => reviews
    .filter((review) => rating === "all" || review.rating === Number(rating))
    .filter((review) => `${review.name || ""} ${review.phone || ""}`.toLowerCase().includes(search.toLowerCase()))
    .filter((review) => !selectedDate || formatDateKey(review.created_at, timeZone) === selectedDate)
    .sort((a, b) => sort === "newest"
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()), [reviews, rating, sort, search, selectedDate, timeZone]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginatedReviews = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function updateRating(value: RatingFilter) { setRating(value); setPage(1); }
  function updateSearch(value: string) { setSearch(value); setPage(1); }
  function updateSort(value: SortOrder) { setSort(value); setPage(1); }
  function updateDate(value: string) { setSelectedDate(value); setPage(1); }

  return <>
    <section className="mb-4 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5" aria-label="রিভিউয়ের তারিখ">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-burgundy/8 text-burgundy"><CalendarDays className="size-5" /></div>
        <div><p className="text-xs font-semibold tracking-wide text-stone-400">আজ</p><p className="mt-0.5 font-serif text-lg font-semibold sm:text-xl">{todayLabel}</p></div>
      </div>
      <div className="flex flex-col gap-2 min-[430px]:flex-row min-[430px]:items-center">
        <label className="sr-only" htmlFor="review-date">রিভিউয়ের তারিখ নির্বাচন করুন</label>
        <input id="review-date" type="date" value={selectedDate} max={todayDateKey} onChange={(event) => updateDate(event.target.value)} className="field min-h-11 py-2.5 sm:w-auto" />
        {selectedDate && <button type="button" onClick={() => updateDate("")} className="button-secondary min-h-11 px-3.5 py-2.5"><X className="size-4" />সব তারিখ</button>}
      </div>
    </section>

    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" /><input className="field py-2.5 pl-9" value={search} onChange={(e) => updateSearch(e.target.value)} placeholder="নাম বা ফোন নম্বর খুঁজুন" aria-label="রিভিউ খুঁজুন" /></div>
      <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0" aria-label="রেটিং অনুযায়ী ফিল্টার করুন">
        {(["all", "5", "4", "3", "2", "1"] as RatingFilter[]).map((value) => <button key={value} type="button" onClick={() => updateRating(value)} className={`filter-chip ${rating === value ? "filter-chip-active" : ""}`}>{value === "all" ? "সব" : `${toBanglaNumber(Number(value))} তারকা`}</button>)}
      </div>
      <select className="field w-full py-2.5 lg:w-auto" value={sort} onChange={(e) => updateSort(e.target.value as SortOrder)} aria-label="রিভিউ সাজান"><option value="newest">নতুনগুলো আগে</option><option value="oldest">পুরোনোগুলো আগে</option></select>
    </div>

    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-stone-500"><p>{filtered.length ? `${toBanglaNumber(pageStart + 1)}–${toBanglaNumber(Math.min(pageStart + PAGE_SIZE, filtered.length))}, মোট ${toBanglaNumber(filtered.length)}টি রিভিউ` : "কোনো রিভিউ নেই"}</p><p>{selectedDate ? `${formatSelectedDate(selectedDate)} তারিখের রিভিউ` : "সব তারিখের রিভিউ"}</p></div>
    {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-stone-500">এই ফিল্টারের সঙ্গে মিলে এমন কোনো রিভিউ নেই।</div> : <>
      <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm lg:block">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="bg-stone-50 text-xs tracking-wide text-stone-500"><tr><th className="w-24 px-5 py-4">রেটিং</th><th className="px-5 py-4">রিভিউ</th><th className="w-48 px-5 py-4">গ্রাহক</th><th className="w-52 px-5 py-4">জমার সময়</th><th className="w-32 px-5 py-4">অবস্থা</th></tr></thead>
          <tbody className="divide-y divide-stone-100">{paginatedReviews.map((review) => <tr key={review.id} className="align-top hover:bg-stone-50/70">
            <td className="px-5 py-5"><span className="inline-flex items-center gap-1 font-semibold"><Star className="size-4 fill-gold text-gold" />{toBanglaNumber(review.rating)}</span></td>
            <td className="px-5 py-5"><p className="whitespace-pre-wrap break-words leading-6 text-stone-700">{review.review_text}</p><p className="mt-2 text-xs text-stone-400">হালনাগাদ {formatDateTime(review.updated_at, timeZone)}</p></td>
            <td className="px-5 py-5"><Customer review={review} /></td>
            <td className="px-5 py-5 text-stone-600">{formatDateTime(review.created_at, timeZone)}</td>
            <td className="px-5 py-5"><StatusControl review={review} /></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="grid gap-4 lg:hidden">{paginatedReviews.map((review) => <article key={review.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between"><span className="inline-flex items-center gap-1 font-semibold"><Star className="size-4 fill-gold text-gold" />{toBanglaNumber(review.rating)}/৫</span><StatusControl review={review} /></div>
        <p className="whitespace-pre-wrap break-words leading-7 text-stone-700">{review.review_text}</p>
        <div className="mt-5 grid gap-3 border-t border-stone-100 pt-4 text-sm"><Customer review={review} /><div className="text-stone-500"><span className="block text-xs font-semibold tracking-wide text-stone-400">জমা দিয়েছেন</span>{formatDateTime(review.created_at, timeZone)}</div><div className="text-stone-500"><span className="block text-xs font-semibold tracking-wide text-stone-400">হালনাগাদ</span>{formatDateTime(review.updated_at, timeZone)}</div></div>
      </article>)}</div>
      {totalPages > 1 && <nav className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-3 sm:justify-end" aria-label="রিভিউ পেজিনেশন">
        <button type="button" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="button-secondary min-h-10 px-3 py-2"><ChevronLeft className="size-4" /><span className="hidden min-[430px]:inline">আগের পৃষ্ঠা</span></button>
        <span className="min-w-24 text-center text-sm font-medium text-stone-600">পৃষ্ঠা {toBanglaNumber(currentPage)}/{toBanglaNumber(totalPages)}</span>
        <button type="button" onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="button-secondary min-h-10 px-3 py-2"><span className="hidden min-[430px]:inline">পরের পৃষ্ঠা</span><ChevronRight className="size-4" /></button>
      </nav>}
    </>}
  </>;
}

function Customer({ review }: { review: Review }) {
  return <div className="space-y-1 text-stone-600"><p className="font-medium text-charcoal">{review.name || "নাম দেওয়া হয়নি"}</p><p>{review.phone || "ফোন দেওয়া হয়নি"}</p>{review.stay_anonymous && <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">নাম গোপন রেখেছেন</span>}</div>;
}

function StatusControl({ review }: { review: Review }) {
  const hiding = review.status === "published";
  return <form action={setReviewStatusAction}><input type="hidden" name="id" value={review.id} /><input type="hidden" name="status" value={hiding ? "hidden" : "published"} />
    <button className={`status-button ${hiding ? "status-published" : "status-hidden"}`} title={hiding ? "রিভিউ লুকান" : "রিভিউ প্রকাশ করুন"}>{hiding ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}{hiding ? "প্রকাশিত" : "লুকানো"}</button>
  </form>;
}

function formatDateTime(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium", timeStyle: "short", timeZone }).format(new Date(value));
}

function formatDateKey(value: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", timeZone }).formatToParts(new Date(value));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function formatSelectedDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("bn-BD", { dateStyle: "long" }).format(new Date(Date.UTC(year, month - 1, day)));
}

function toBanglaNumber(value: number) {
  return value.toLocaleString("bn-BD", { useGrouping: false });
}
