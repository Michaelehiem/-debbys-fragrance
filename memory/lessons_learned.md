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
