# Lessons Learned

> A living log of errors encountered, how they were fixed, and what was discovered.
> This file makes the system stronger over time.

---

## [2026-07-28] — `npm audit` findings: all 5 vulnerabilities require a Next.js major upgrade
- **Context:** After installing ESLint, `npm audit` reported 5 vulnerabilities (4 high, 1 critical).
- **Findings:**
  - CRITICAL: `next` (0.9.9 - 16.3.0-canary.5) — no patched 14.x release
  - HIGH: `postcss` (<=8.5.17) — fix chained through next
  - HIGH: `@next/eslint-plugin-next`, `eslint-config-next`, `glob` — fix chained through eslint-config-next@16.2.12
- **Decision:** NOT auto-fixed. The only fix npm offers is `next@16.2.12` (and `eslint-config-next@16.2.12`) — a semver-major jump requiring React 19 and API changes (params/searchParams become Promises, etc.). Forcing it risks breaking a live production store. **Ask Michael before attempting the major upgrade.**
- **Watch out for:** `npm audit` also takes 5+ minutes on this machine — use a 600s+ timeout and dump JSON to a temp file.

---

## [2026-07-28] — ESLint install made `next build` exceed 15-minute timeout
- **Context:** Installed eslint + eslint-config-next@14.2.15 so the build would lint
- **Error:** `next build` timed out at 900s and again at 600s during `npm install` (this machine is slow)
- **Root cause:** (1) `npm install` on this machine takes 9+ minutes; (2) once ESLint is installed, `next build` runs the lint phase internally, adding several minutes to every build.
- **Fix:** Retried install with a 900,000 ms timeout (completed in ~9m). For builds, give at least 30 minutes (1,800,000 ms).
- **Also fixed (real bug surfaced by lint):** `QuickViewModal.tsx` called `useState` after an early `return null` (Rules of Hooks violation). Restructured into a wrapper component + inner `QuickViewModalContent` that always receives a non-null `Product`, with `key={product.id}` to reset state on product switch.
- **Fixed (build-blocking lint errors):** All `react/no-unescaped-entities` errors in Navbar, Footer, contact page, QuickViewModal (apostrophes → `&apos;`, quotes → `&ldquo;/&rdquo;`).
- **Workflow updated?** No
- **Tool updated?** No
- **Watch out for:** Remaining lint warnings are `@next/next/no-img-element` (intentional — many images are admin-uploaded base64/remote, `next/image` would need fill/sizes config) and two pre-existing `react-hooks/exhaustive-deps` warnings (product detail + shop). Warnings do not fail the build.

---

## [2026-07-28] — `npm run build` exceeds 5-minute default timeout on this machine
- **Context:** Verifying the light-theme changes compiled after editing 26 files
- **Error:** First build attempt was killed after the 120s (default) and then the 300s tool timeout with no output beyond "Creating an optimized production build ..."
- **Root cause:** This machine builds Next.js slowly. The first invocation also likely had to rebuild the whole `.next` cache after many file changes.
- **Fix:** Re-ran with a 600,000 ms (10 min) timeout — build completed successfully, all 11 routes generated.
- **Workflow updated?** No
- **Tool updated?** No
- **Watch out for:** Always give `npm run build` at least 10 minutes of timeout on this machine. Also note ESLint isn't installed locally — build skips the lint step (pre-existing, not an error).

---

## [2026-07-24] — Build fails when Google Fonts can't be reached
- **Context:** Running `next build` to verify the site compiles
- **Error:** `FetchError: request to https://fonts.googleapis.com/css2 failed, reason: getaddrinfo ENOTFOUND fonts.googleapis.com`
- **Root cause:** `next/font/google` downloads fonts at build time. If the machine has no internet or DNS can't resolve Google domains, the build hangs indefinitely.
- **Fix:** Not resolved yet. Two options: (1) fix DNS/network on the machine, (2) switch to self-hosted local fonts by downloading `.woff2` files and using `next/font/local` instead.
- **Workflow updated?** No
- **Tool updated?** No
- **Watch out for:** Any Next.js project using `next/font/google` will have this problem in offline/airgapped environments.

---

## [2026-08-02] — Stale `.next/types` break `tsc` after deleting a route
- **Context:** Deleted `src/app/account/page.tsx` as part of removing customer auth, then ran `npx tsc --noEmit`.
- **Error:** `error TS2307: Cannot find module '../../../../src/app/account/page.js'` — errors point inside `.next/types/app/account/page.ts`, a generated file.
- **Root cause:** Next.js generates route type stubs into `.next/types`. After deleting a route, the stale stub still exists and tsc resolves it before my source tree.
- **Fix:** Delete the `.next` build cache (`Remove-Item -LiteralPath ".next" -Recurse -Force`) and re-run `tsc`. Exit 0 after clean.
- **Workflow updated?** No
- **Tool updated?** No
- **Watch out for:** Whenever you delete or rename an app route, clear `.next` before type-checking or building. Also `npx tsc --noEmit` on this machine takes ~4 minutes (needs a 420s+ timeout); on the first run it may exceed 180s just resolving npx.

---

## [2026-08-04] — Vercel "changes not live" was a Production Branch config issue, not a code issue
- **Context:** Michael reported the rebrand changes weren't reflected on https://debbys-fragrance.vercel.app even though commit `4b7fd59` was pushed to GitHub.
- **Root cause:** The Vercel GitHub integration WAS connected, but the project's **Production Branch was not `master`**. Every push after 07-26 created a **Preview** deployment (confirmed via GitHub deployments API — environment `Preview`), never Production. The live alias kept serving the last Production build from 07-26 (commit `2d441bb`).
- **Diagnosis:** `git log origin/master..master` empty (commit was pushed); GitHub status API showed commit `4b7fd59` → Vercel deployment "completed"; `/repos/.../deployments` showed all recent deployments as `"environment": "Preview"` with `"production_environment": false`.
- **Fix:** In Vercel dashboard → Project → Settings → Git → **Production Branch** set to `master`, then Promote the latest Preview deployment to Production. Verified new build live after.
- **Watch out for:** When code is pushed but the site looks stale, always check Vercel deployment ENVIRONMENT first (via GitHub deployments API — no auth needed for public repos). The `npx vercel` CLI on this machine has no saved login and its install hangs (slow machine) — use the dashboard instead.
- **Lesson:** The 07-28 "Vercel auto-deploys on push" note in memory was wrong — only the 07-26 manual `npx vercel --prod` ever hit Production.
- **⚠️ Follow-up (08-04, same day):** Despite Michael confirming the dashboard fix, the VERY NEXT push (commit `669683d`) again created a **Preview** deployment (`"environment": "Preview"`, `"production_environment": false`). Either the Production Branch edit never saved, or he only promoted manually without saving the setting. Live site HTML confirmed still old (`p-4`, `w-4`, `px-4`, dark classes). **Promoting a Preview deployment only fixes that one build — the Production Branch setting must be verified saved (`Settings → Git → Production Branch = master`), otherwise EVERY future push lands in Preview again.**

---

## [2026-08-04] — `npx tsc --noEmit` hangs on this machine; call `node_modules\.bin\tsc.cmd` directly
- **Context:** Verifying className-only changes; `npx tsc --noEmit` was killed at 420s and again at 600s with zero output.
- **Root cause:** npx startup + node process spawn is extremely slow on this machine (`tsc --version` alone took ~37s). A full incremental typecheck via npx can exceed 10 minutes.
- **Fix:** Invoke directly: `& ".\node_modules\.bin\tsc.cmd" --noEmit` — completed in ~128s (exit 0). Same for lint: `& ".\node_modules\.bin\next.cmd" lint` (~4.5 min).
- **Workflow updated?** No
- **Tool updated?** No
- **Watch out for:** Always call the local binaries directly on this machine, not via npx. `tsconfig.tsbuildinfo` (incremental) drifts and is uncommitted — fine to ignore.

---

## [2026-08-04] — Removed dark mode entirely (light-only site)
- **Context:** Michael wanted the whole site light-only, no dark mode toggle.
- **Approach:** Removed the `ThemeProvider` + `ThemeContext`, removed the Navbar theme toggle (and `Sun`/`Moon` imports), removed the pre-hydration `<script>` and `dark:bg-zinc-950` body classes from `layout.tsx`, deleted `src/context/ThemeContext.tsx`.
- **Why it's safe:** Tailwind uses `darkMode: "class"` — dark variants only apply when `.dark` is on `<html>`. With the provider/script gone, `.dark` is never added, so ALL `dark:` classes across the codebase are inert. Stale `localStorage.debby_theme` values can no longer force dark mode. Do NOT remove `darkMode: "class"` from `tailwind.config.ts` — Tailwind would fall back to `media` (auto-dark on OS dark mode).
- **Watch out for:** The leftover `dark:` classes are dead CSS but harmless; stripping them all is a large risky diff and was skipped.

---

## [2026-10-10] — `app/robots.ts` / `sitemap.ts` / `manifest.ts` fail to build because the project path contains an apostrophe
- **Context:** Added the Next.js metadata-route conventions (robots.ts, sitemap.ts, manifest.ts, opengraph-image.tsx) to app/ while adding SEO/PWA. `next build` failed.
- **Error:** `Module parse failed: Unexpected token (11:115) ... throw new Error('Default export is missing in "C:\\...\\Debby's Fragrance\\src\\app\\manifest.ts"')` for manifest.ts, robots.ts and sitemap.ts.
- **Root cause:** Next's `next-metadata-route-loader` injects the **absolute file path** into generated single-quoted JS. The apostrophe in the project directory name (`Debby's Fragrance`) prematurely closes the string literal, producing a syntax error. Not a bug in our files — our `export default function` was correct. (The metadata *image* loader used for `opengraph-image.tsx` has the same path-injection hazard.)
- **Fix:** Serve these as ordinary route handlers instead of the metadata file conventions:
  - `src/app/robots.txt/route.ts`, `src/app/sitemap.xml/route.ts`, `src/app/manifest.webmanifest/route.ts` (plain `GET` returning `NextResponse`), and `src/app/og/route.tsx` (`ImageResponse`, `runtime="edge"`).
  - Pointed `openGraph.images`/`twitter.images` at `/og`; kept `manifest: "/manifest.webmanifest"`.
  - Removed `robots.ts`, `sitemap.ts`, `manifest.ts`, `opengraph-image.tsx`.
  - `npx next build --no-lint` then compiled cleanly with all routes.
- **Workflow updated?** No
- **Tool updated?** No
- **Watch out for:** Any Next.js project whose filesystem path contains an apostrophe (or other quote char) cannot use `robots.ts`/`sitemap.ts`/`manifest.ts`/`opengraph-image.tsx`/`icon.tsx`/`apple-icon.tsx` conventions — use route handlers. The cleanest permanent fix is renaming the parent folder to remove the apostrophe (deferred: the folder is the linked Vercel/deploy root and renaming risks breaking the project link).

---

## [2026-10-11] — Supabase Personal Access Token was read-only (403 on project create)
- **Context:** Tried to provision the new `debbys-fragrance` Supabase project via CLI/Management API using the stored PAT.
- **Error:** `POST https://api.supabase.com/v1/projects` → HTTP 403 `{"message":"Forbidden"}`.
- **Root cause:** The token (`sbp_...`, stored in `%TEMP%\opencode\supabase_token.txt`) has read-only scope — it can list orgs/projects but not create them.
- **Fix:** Michael must create the project in the Supabase dashboard (org `fgfyapcpygwrphmigudc`, region West EU/Ireland, Free). Then use `supabase projects api-keys --project-ref <ref>` (read works) to fetch the anon + service_role keys, write them to `.env.local`, and `supabase link` + `db push` with the generated DB password.
- **Workflow updated?** No
- **Tool updated?** No
- **Watch out for:** Don't retry project creation with the same token — it will keep 403'ing. Delete the temp token file once the keys are extracted.

---

## [2026-10-11] — Verify with the local tsc binary, not `npx tsc`
- **Context:** Ran TypeScript checks after adding ~20 new files (server lib, API routes, admin dashboard, contexts).
- **Finding:** `.\node_modules\.bin\tsc.cmd --noEmit` completes in ~2 min and returns clean; `npx tsc --noEmit` re-resolves the binary and frequently times out (>10 min) on this machine.
- **Fix:** Always invoke the local binary directly; give it a 600s timeout.
- **Watch out for:** `npm run lint` (next lint) is also fine and fast here — the only warnings are the pre-existing `@next/next/no-img-element` ones.

---

## [2026-10-12] — New Supabase projects: direct DB is IPv6-only, pooler lags, and the Management API is the reliable route
- **Context:** Pushing the initial schema to the brand-new project `qxktqbiqfatkoazijdte` (eu-central-1).
- **Errors observed:**
  - `supabase db push --db-url postgresql://…@db.<ref>.supabase.co:5432/…` → `getaddrinfo ENOTFOUND`. `nslookup <db host> 8.8.8.8` shows only an **AAAA (IPv6)** record on Windows-friendly resolvers; the box has no IPv6 → direct connection impossible from here.
  - IPv4 pooler `aws-0-eu-central-1.pooler.supabase.com` (user `postgres.<ref>`) returned `FATAL: (ENOTFOUND) tenant/user … not found` for ~10 min straight on the freshly provisioned project (tenant config lag), then briefly "Connection terminated unexpectedly" → flapping.
- **Root cause:** (1) Supabase now serves direct DB connections over IPv6 only; (2) hosted-pooler tenant routing for brand-new projects lags behind creation; (3) region must match exactly — `aws-0-eu-west-1` vs `aws-0-eu-central-1` (project card showed Frankfurt, not the requested West EU).
- **Fix that worked (no DB host needed):** created an **owner PAT** in `supabase.com/dashboard/account/tokens`, then applied the migration via `POST https://api.supabase.com/v1/projects/{ref}/database/query` with the body being a JSON **string** (the escaped SQL). Also posted a `create table if not exists supabase_migrations.schema_migrations … insert …` so future `/admin-links` CLI pushes see the migration as applied, and hand-edited `supabase/.temp/linked-project.json` (it still pointed at the old paused project) to `{"ref":"qxktqbiqfatkoazijdte", …}` so no future `supabase db push` accidentally targets the old project.
- **Workflow updated?** No
- **Tool updated?** No
- **Watch out for:** Check the actual region on the project card before guessing a pooler hostname. For one-off migrations on this machine, the Management API `database/query` endpoint is far more reliable than any CLI DB connection. Owner PATs must be deleted after use.

---

## [2026-10-12] — PowerShell 5.1 corrupts JSON payloads two ways; use curl with files
- **Context:** Sending the migration SQL to the Supabase Management API from Windows PowerShell 5.1.
- **Errors observed:**
  - `Invoke-RestMethod` with `$body = 'select 1;' | ConvertTo-Json` → server saw `""select 1;""` (double-nested quotes) and rejected the JSON.
  - `@{ query = $multilineSql } | ConvertTo-Json` → server error `query: Invalid input: expected string, received object`, because PS 5.1 wraps a **multi-line string** as `{ "value": "…" }` instead of a plain JSON string.
- **Root cause:** PS 5.1's `ConvertTo-Json` serialises multi-line strings as an object with a `value` property, and `Invoke-RestMethod` re-quotes string bodies. Both silently mangle otherwise-correct JSON.
- **Fix:** Build the payload file by hand (escape newlines → `\n`, double quotes → `\"`), write it with `Set-Content -Encoding ascii`, and send with `curl.exe -s -X POST … --data-binary @file`. The Management endpoint wants `{"query":"<escaped sql>"}`.
- **Workflow updated?** No
- **Tool updated?** No
- **Watch out for:** Any future API work from this shell: prefer `curl --data-binary @file` over `Invoke-RestMethod` bodies, and never `ConvertTo-Json` a string that contains `\n`. The 5.1+ `/home` fix isn't available (Windows PowerShell 5.1 only).

---

## [YYYY-MM-DD] — [Brief Error Title]
- **Context:** What task was being run when this happened
- **Error:** What went wrong (paste error message or description)
- **Root cause:** Why it happened
- **Fix:** What was changed to resolve it
- **Workflow updated?** Yes/No — [which workflow]
- **Tool updated?** Yes/No — [which tool]
- **Watch out for:** Any related edge cases to be aware of
-->
