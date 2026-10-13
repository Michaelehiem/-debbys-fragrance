# Active Tasks

> Tasks currently in progress. Move to `completed_projects.md` when done.

---

## Cavan Feature Port → Debby's Fragrance (COMPLETED 2026-10-12)

- **Started:** 2026-10-10 — **Completed:** 2026-10-12 (moved to `completed_projects.md`)
- **Goal:** Port selected features from sibling project `Cavan` into Debby's Fragrance: SEO+PWA, order tracking, admin dashboard, customer accounts + saved cart, AI support chat, storefront polish.
- **Decision (Michael, 2026-10-11):** Use a **NEW Supabase project** (org `AlphaTNX Technologies`, name `Debby,s Fragrance`, ref **`qxktqbiqfatkoazijdte`**, region **eu-central-1 / Frankfurt**, Free plan, status Healthy). Products/catalogue migrate server-side so admin edits are visible to customers.
- **Status:** ✅ DONE — schema deployed, keys in `.env.local`, code tsc/lint clean. Full `next build` + live UI smoke-test still to run (dev server is agonizingly slow on this machine).
- **Done (no-backend, 2026-10-10):** storefront polish (digital clock, rating stars, qty stepper, empty states); SEO + PWA pack via route handlers (apostrophe-path workaround).
- **Done (backend code, 2026-10-11):** full server layer, API routes, admin dashboard, order tracking, customer accounts + saved cart, AI chat — see `completed_projects.md`.
- **Done (deployment, 2026-10-12):**
  - Project provisioned by Michael; `.env.local` got `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (pb/secret `sb_secret_…`), `ADMIN_SESSION_SECRET`, `ADMIN_PASSWORD=debbyfragrance2026`, `GEMINI_MODEL` (+ empty `GEMINI_API_KEY`).
  - Migration `supabase/migrations/20261011000000_initial_schema.sql` **applied via Management API** (`POST /v1/projects/{ref}/database/query` — CLI `db push` unusable here: direct DB is IPv6-only + pooler "tenant not found" flap). Verified: all 6 tables exist; `schema_migrations` recorded; `supabase/.temp/linked-project.json` repointed to the new ref.
  - Secret key verified working from Node via the real supabase-js client (products read = 0 rows until first store read auto-seeds from `INITIAL_PRODUCTS`).
- **Blocked on:** Nothing. (Last known blockers — pooler/IPv6/DNS — all bypassed via the Management API.)
- **Remaining after this:** full `npm run build` (~30 min on this machine; or let Vercel build on push); live smoke-test `/api/products` seed, admin login (`/admin` after search keyword `babydebby`, password `debbyfragrance2026`), order → `/order/[id]`, account register/login + saved-cart sync, chat fallback. Delete temp token files in `%TEMP%\opencode\`.
- **Notes:** Direct DB host is IPv6-only on new Supabase projects (this PC has no IPv6); the pooler needs frequent retries on brand-new projects. PowerShell 5.1 `ConvertTo-Json` corrupts multi-line strings — build API JSON payloads manually or use `curl --data-binary @file`.

---

## Storefront Polish Round 3 — Luxury Product Cards + Verified Imagery (COMPLETED 2026-10-13)

- **Started:** 2026-10-13 — **Completed:** 2026-10-13
- **Goal:** Address feedback — product cards looked out of place, mobile drawer too big, want more luxury/modern + beautiful imagery.
- **Done:** Rewrote `ProductCard.tsx` (luxury layout, quick-view, quiet size chips, aligned price/Add), slimmed the mobile drawer, installed 12 distinct verified Pexels photos (seed + Supabase `products` table via REST PATCH), refreshed Instagram rail. Commits `0ebd166` (header/credentials) + `5a1541b` (cards/imagery) pushed. Local `next build` + `tsc` both clean.
- **Open follow-ups:**
  - [x] **Admin password `mikeybaby` is LIVE (2026-10-13)** — set via Supabase `store_settings.admin_password` (DB value takes precedence over env; verified live `{"ok":true}`). Vercel Production env `ADMIN_PASSWORD` still holds the old value as a harmless fallback — reconcile/clear for hygiene (needs a Vercel token; none on this machine).
  - [ ] Dashboard bug: `/api/dashboard` reports `orderCount: 0` while `/api/orders` has 1 — cause unknown.
  - [ ] Replace branded placeholder photos (Chanel/Tom Ford/Burberry/Nautica from Pexels) with Debby's real bottle shots when available.
  - [ ] Delete temp secrets: `%TEMP%\opencode\` (owner PAT + DB password + token files).
  - [ ] Optional: `next/image` + `remotePatterns` for `images.pexels.com` if optimizer adoption is wanted (currently all `<img>`).

## Storefront Overhaul + Feminine "Rose & Cream" Redesign (CODE COMPLETE 2026-10-13)

- **Started:** 2026-10-13 — **Completed (code + deploy):** 2026-10-13 (commit `60f93f3` pushed)
- **Goal:** Admin easy-nav, draggable chat, bold store name, homepage wallpaper, New Arrivals/Top Deals/Discount instead of categories, "Add to Cart" under price — then a feminine "Rose & cream romantic" restyle.
- **Done:**
  - Homepage: New Arrivals (N°01) + Top Deals (N°02, real `originalPrice` deals) + Discount band; categories section removed; fixed soft wallpaper layer.
  - ProductCard: "Add to Cart" under price, rounded card, rose accents. SupportChat: draggable. Navbar: bold + script wordmark, **blush rose header background**, numbering removed. Admin: sidebar nav shell.
  - Theme: `gold` scale repointed to **rose-gold** (themes the whole app), blush cream paper/plum ink, full `rose` palette, `script` font (Great Vibes) + real Playfair italic, rose `eyebrow`/`section-num`/selection/scrollbar, rounded soft components.
  - Verified: `tsc --noEmit` ✅ clean; `next build --no-lint` ✅ BUILD_EXIT=0, 14/14 static pages.
- **Open follow-ups:**
  - [x] Committed + pushed to `master` (`60f93f3`) — Vercel auto-deploying.
  - [ ] Dashboard bug: `/api/dashboard` `orderCount: 0` vs `/api/orders` has 1.
  - [ ] Replace branded placeholder Pexels photos with Debby's real bottle shots.
  - [ ] `%TEMP%\opencode\` still holds Supabase secrets to delete (owner PAT + DB password + tokens).
  - [ ] Vercel Production `ADMIN_PASSWORD` fallback trap (reconcile/clear).

## Gendered Homepage, Flexible Sizes & Layout Cleanup (DONE 2026-10-13)

- **Started:** 2026-10-13 — **Completed (code + verify):** 2026-10-13
- **Goal:** Feminine vs masculine homepage sections; compact admin product area; replace "curated compositions" badge; add "Powered by AlphaTNX Digital"; delete About/"Our Story"; admin-selectable sizes; fix uploaded product not appearing; delivery → 1–3 days; remove floating "View Bag"; remove "join the club".
- **Done:**
  - Homepage `For Her` (blush/script) + `For Him` (dark/italic) showcase panels; hero badge → "1–3 day nationwide delivery"; "Our story" CTA + newsletter club section removed; New Arrivals now newest-first.
  - `types/index.ts` gained `BottleSize` (5/10/25/30/50/100ml); `AdminProducts` per-size checkbox+price (All/Clear) and a compact grid.
  - Footer: dropped Fragrance Club column, added "Powered by AlphaTNX Digital". Navbar: removed Our Story. Deleted `app/about` + sitemap entry. CartToast: removed floating View Bag.
  - **Product-visibility fix:** shop price ceiling now auto-fits the live catalogue (nullable `maxPrice`, `Math.min(sizes)`) so new/expensive products are never hidden.
  - Delivery copy → 1–3 business days (contact FAQ, product detail, chat prompt).
- **Verified:** `tsc --noEmit` clean; `next build --no-lint` BUILD_EXIT=0, 13 static pages.
- **Status:** ✅ Committed + pushed (`6889d23`) — Vercel auto-deploying.
- **Open follow-ups:** Dashboard `orderCount: 0` bug; swap placeholder Pexels photos for real bottle shots; delete `%TEMP%\opencode\` secrets; Vercel `ADMIN_PASSWORD` fallback reconciliation.

<!-- Template:
## [TASK NAME]
- **Started:** YYYY-MM-DD
- **Goal:** ...
- **Status:** In Progress / Blocked
- **Notes:** ...
-->
