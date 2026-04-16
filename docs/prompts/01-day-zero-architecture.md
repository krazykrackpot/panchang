# 01 — Day-zero architecture

Use this **immediately after** the product brainstorm settles (file `00`),
before writing any code. Goal: turn the 1-page product spec into a concrete
architecture that encodes the non-negotiable rules from the start.

---

I'm building **`<PROJECT NAME>`** — `<ONE-SENTENCE DESCRIPTION>`. The product
spec is in `docs/PRODUCT-SPEC.md` (or paste it inline). I want to do Day-0
architectural planning before writing any code. Treat this as a design
conversation, not an implementation.

## Product scope (MVP, `<N>` weeks)

1. `<FEATURE 1 — concrete acceptance criteria, not a description>`
2. `<FEATURE 2 — ...>`
3. `<FEATURE 3 — ...>`

**Out of scope:** `<LIST EXPLICITLY — payments, admin, analytics, etc.>`.
Plan for them but do not build.

## Non-functional requirements (hard gates)

- **Correctness target:** `<e.g., calculations within X of reference Y>`
- **Internationalization:** `<LIST LOCALES>` day 1, architecture supports
  more WITHOUT schema changes. ONE central loader imported by both server
  and client. No flat fallback file.
- **Timezone:** every datetime resolved from an IANA timezone derived from
  coordinates. Tests include DST pressure from ≥3 zones.
- **Performance budget:** `<LCP < X, TTI < Y, API p95 < Z>` — measurable.
- **Accessibility:** WCAG AA minimum on public pages.
- **No `<EXTERNAL DEPENDENCIES YOU WANT TO AVOID>`.**

## Tech stack (opinionated — pick these)

- Framework: `<Next.js 16 App Router, React 19, TypeScript strict>`
- Styling: `<Tailwind CSS v4 with @theme>`
- State: `<Zustand>`
- Validation: `<Zod>`
- Auth/DB: `<Supabase with RLS on all user-owned tables>`
- Testing: `<Vitest unit + Playwright E2E>`
- Deploy: `<Vercel / Railway / Fly>`

## Architecture principles (non-negotiable)

Encode these as the spine. All from real incidents:

1. **Single source of truth.** Shared data has ONE loader. Never duplicated.
2. **Errors are visible.** No empty catches, no ignored `error` fields.
3. **Features integrate the moment they ship.** Unlinked page = dead page.
4. **Writes are idempotent.** Dedupe by natural key before insert.
5. **Loading state always terminates.** Every branch flips loading=false.
6. **URL > local state > cache.** Documented in comments at consumers.
7. **Library limits documented at call sites.** No "I'll remember."
8. **Never `setTimeout` for events.** Use real readiness signals.
9. **Never bulk-regex TS or class names.** AST tools or dry-run + build-gate.
10. **Destructive ops require explicit intent.** Confirm blast radius first.

## Definition of Done

Every task: type-check passes, tests pass, build passes, **in-browser
verified** (not just curl). If any gate fails, say so explicitly.

## Give me back

1. Proposed `src/` folder structure + 2–3 sentence rationale per directory.
2. Core data types as TypeScript interfaces with relationships.
3. Testing strategy: what's unit vs integration vs E2E. Which ≥3 fixture
   points to pick for correctness regression testing.
4. First 5 PRs in order, each ~1 day of work. Format per PR:
   goal / files touched / Definition of Done.
5. 10 most load-bearing architecture decisions + 1-sentence "why" for each.
   I want to push back on any I disagree with BEFORE we build.
6. Top 5 risks and how the architecture mitigates each.

**Do not write code yet.** Iterate on this until I'm satisfied. When code
starts, every feature follows the Definition of Done.
