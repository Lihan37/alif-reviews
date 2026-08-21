create extension if not exists pgcrypto;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  rating integer not null check (rating between 1 and 5),
  review_text text not null check (char_length(trim(review_text)) between 3 and 1000),
  name text null check (name is null or char_length(name) <= 80),
  phone text null check (phone is null or char_length(phone) <= 30),
  stay_anonymous boolean not null default false,
  owner_token_hash text not null check (char_length(owner_token_hash) = 64),
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);
create index if not exists reviews_rating_idx on public.reviews (rating);
create index if not exists reviews_phone_idx on public.reviews (phone) where phone is not null;
create index if not exists reviews_status_idx on public.reviews (status);
create index if not exists reviews_owner_token_hash_idx on public.reviews (owner_token_hash);

alter table public.reviews enable row level security;

-- There are intentionally no browser-facing policies. The application only accesses
-- reviews from trusted server code using the service-role key, which bypasses RLS.
revoke all on table public.reviews from anon, authenticated;

comment on table public.reviews is 'Private customer feedback. Accessed only by trusted server-side application code.';
comment on column public.reviews.owner_token_hash is 'HMAC-SHA256 of a random token. The raw token exists only in an HTTP-only browser cookie.';
