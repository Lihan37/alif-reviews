# Alif Restaurant Feedback

A private, mobile-first customer feedback app built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase PostgreSQL. Visitors can submit multiple reviews from one browser and return to view or edit their own reviews. Only authenticated restaurant administrators can see all reviews and customer contact details.

## Local installation

Requirements: Node.js 20.9 or newer and a Supabase project.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Admin login is at `http://localhost:3000/admin`.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the SQL files in `supabase/migrations` in numeric order. Existing installations that already ran migration 001 must run `002_allow_multiple_owner_reviews.sql`.
4. Copy the project URL and service-role key from the API settings into `.env.local`.

Row Level Security is enabled and no `anon` or `authenticated` policies are created. All review access happens in server actions/server components with the service-role key. Never expose `SUPABASE_SERVICE_ROLE_KEY` through a `NEXT_PUBLIC_` variable.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (safe to expose; used only server-side here) |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged database key; server-only |
| `ADMIN_PHONE_1` | First approved admin number |
| `ADMIN_PHONE_2` | Second approved admin number |
| `ADMIN_PASSWORD_HASH` | Shared bcrypt password/PIN hash |
| `OWNER_TOKEN_SECRET` | Secret of 32+ characters used to HMAC ownership tokens |
| `ADMIN_SESSION_SECRET` | Different 32+ character secret used to sign admin sessions |
| `BUSINESS_TIME_ZONE` | IANA timezone for dashboard dates; defaults to `Asia/Dhaka` |

Generate independent secrets with `openssl rand -base64 48` or an equivalent cryptographically secure password generator.

### Admin credentials

Set exactly two approved phone numbers in `ADMIN_PHONE_1` and `ADMIN_PHONE_2`. Bangladesh local numbers such as `01XXXXXXXXX` and international numbers such as `+8801XXXXXXXXX` are normalized before comparison.

Generate the bcrypt hash interactively:

```bash
npm run hash-password
```

Copy the complete `ADMIN_PASSWORD_HASH=...` line printed by the script into `.env.local`. The script escapes bcrypt's dollar signs because Next.js otherwise interprets them as environment-variable references. The password itself is never stored in source or environment variables. This single hash is the shared password for both approved admin phone numbers.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Vercel deployment

1. Push the repository to your Git provider and import it in Vercel.
2. Add all variables from `.env.example` under **Project Settings → Environment Variables** for Production (and Preview if desired).
3. Use the standard Next.js build command, `npm run build`.
4. Deploy, then verify `/`, `/admin`, owner editing, and admin review visibility on the production URL.

Supabase needs no public table policy for this architecture. Keep the project URL and service-role key current in Vercel, enable database backups appropriate for your plan, and rotate the service-role key and application secrets if exposure is suspected.

## Security and ownership

On first submission, the server generates a random 256-bit ownership token. Only its keyed SHA-256 hash is saved in PostgreSQL; the raw value is stored in a secure HTTP-only, same-site browser cookie for one year. The same token can own multiple reviews. Edits require both the requested review ID and a matching ownership-token hash, so an ID alone grants no access. Admin sessions are signed HTTP-only cookies with an eight-hour expiry. Login and review submission have best-effort in-process rate limits; for multi-region, high-volume deployments, replace this layer with a shared Redis-compatible rate limiter.

Known limitation: if a customer clears this ownership cookie or browser data, the app can no longer associate that browser with their previous reviews, so they cannot view or edit them.

## Branding

Restaurant text and contact placeholders live in `src/config/site.ts`; replace the temporary phone number, address, and `public/logo-mark.svg` before launch.
