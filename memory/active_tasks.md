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

<!-- Template:
## [TASK NAME]
- **Started:** YYYY-MM-DD
- **Goal:** ...
- **Status:** In Progress / Blocked
- **Notes:** ...
-->
