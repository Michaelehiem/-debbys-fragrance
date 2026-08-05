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

<!-- Template:
## [YYYY-MM-DD] — [Brief Error Title]
- **Context:** What task was being run when this happened
- **Error:** What went wrong (paste error message or description)
- **Root cause:** Why it happened
- **Fix:** What was changed to resolve it
- **Workflow updated?** Yes/No — [which workflow]
- **Tool updated?** Yes/No — [which tool]
- **Watch out for:** Any related edge cases to be aware of
-->
