-- Allow one secure browser ownership token to own multiple reviews.
alter table public.reviews
  drop constraint if exists reviews_owner_token_hash_key;

create index if not exists reviews_owner_token_hash_idx
  on public.reviews (owner_token_hash);
