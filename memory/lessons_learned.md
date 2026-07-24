# Lessons Learned

> A living log of errors encountered, how they were fixed, and what was discovered.
> This file makes the system stronger over time.

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
