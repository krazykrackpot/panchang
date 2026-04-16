# Dekho Panchang — Day-1 Prompt (retrospective)

This is the prompt we **wish** had been written on Day 1 of this project. It
encodes everything we've learned the hard way through ~220 commits,
documents the non-negotiable architectural principles, and sets the scope
gates that would have prevented most of the bugs that shipped.

Keep this file as:
- A reference for anyone onboarding (read this before touching anything)
- A template for spawning sibling projects (e.g., a matching-only or
  muhurat-only app)
- A checklist when adding major new features — any time you'd be tempted
  to short-cut a rule here, re-read the "why it matters" notes

The generic (non-panchang-specific) version lives at
`~/.claude/prompts/day-zero-architecture.md` and should be copied into any
new repo at Day 0.

---

I'm building **Dekho Panchang** — a Vedic astrology web app that gives
daily Panchang, birth charts (Kundali), and horary / interpretive tools in
multiple Indian languages, with astronomical calculations done locally
(no external astrology APIs). I want to do Day-1 planning before writing
code. Treat this as a brainstorm + architecture session, not an
implementation.

## Product scope (MVP, 4 weeks)

1. **Daily Panchang page** — for a given lat/lng/date, show tithi, nakshatra,
   yoga, karana, sunrise/sunset, Rahu Kaal, Abhijit muhurat, and vedic-time
   conversion. Accuracy target: within 2 minutes of Prokerala (and Shubh
   Panchang) for the same location. No Drik Panchang references.

2. **Kundali (birth chart) page** — North Indian diamond layout, with a
   South Indian toggle. Lahiri ayanamsha by default. Shows planets (9
   grahas, 0-indexed Sun→Ketu), nakshatras, 12 houses (1-indexed signs),
   and a Vimshottari mahadasha timeline. D9 navamsha as a second chart.

3. **Ashta Kuta matching** — given two birth datetimes + locations, compute
   the 36-point compatibility score with per-kuta breakdown.

**Out of scope for MVP:** payments (Stripe/Razorpay), tippanni
interpretations, learn pages, PDF export, AI chat, rectification tool,
muhurta-AI, prashna. Design for them in the architecture but do not build.

## Non-functional requirements (hard gates)

- **Accuracy:** every panchang/kundali element within 2 minutes of
  Prokerala/Shubh Panchang for 3 reference locations: Bern (CET/CEST with
  DST), Delhi (IST no DST), Seattle (PST/PDT). Regression vectors live in
  `src/lib/__tests__/fixtures/` and are hand-verified.

- **Internationalization:** EN/HI/SA from day 1 with architecture to add
  TA/TE/BN/KN/MR/GU/MAI and beyond WITHOUT schema changes. Per-locale JSON
  at `src/messages/<locale>/{global,pages,components,learn}.json`. ONE
  central loader (`src/lib/i18n/request.ts`) imported by both
  `getRequestConfig` (server) and the client `NextIntlClientProvider` via
  `layout.tsx`. **No flat fallback file.** No duplicate loaders.

- **Timezone correctness:** every datetime calculation uses an IANA
  timezone resolved from coordinates (`tz-lookup` or equivalent). Never
  the browser/OS timezone. Tests include DST pressure cases (spring
  forward, fall back) for each of the 3 reference locations.

- **No external astrology APIs.** All math is local Meeus-derived.

- **No hardcoded default location.** Never default to Delhi/India/IST.
  The user may be in Switzerland, the US, anywhere — require explicit
  location input.

- **Performance:** home-page LCP < 2.5s on 4G. Route-level code splitting
  for heavy pages (kundali tabs use `next/dynamic`).

## Tech stack (opinionated, pick these)

- Next.js 16 App Router + React 19 + TypeScript strict mode
- Tailwind CSS v4 with `@theme` CSS variables (dark mode forced —
  no light theme)
- Zustand for state (auth, location, charts, birth-data)
- Zod for runtime validation of API boundaries
- Supabase for auth + Postgres with RLS on every user-owned table
- Vitest for unit tests + Playwright for E2E
- Deploy to Vercel (auto-deploy from main)

## Architecture principles (non-negotiable)

These come from incidents that actually happened on this project.
Violating them costs hours; following them costs nothing.

1. **Single source of truth.** The i18n loader (`request.ts`) is imported
   by BOTH the server `getRequestConfig` and the client provider in
   `layout.tsx`. No flat `messages/<locale>.json` fallback file.
   Same rule applies to any other shared loader (user profile, current
   panchang, current kundali).

2. **Errors are visible.** No `catch { /* silently fail */ }`. No
   destructuring only `{ data }` from Supabase responses. Every failure
   logs with `console.error('[module] op failed:', err)` AND surfaces to
   the user (alert/toast/banner), unless the catch has a comment
   explaining why silence is correct.

3. **Features integrate the moment they ship.** New page → added to:
   navbar (if top-level), inline on `/dashboard` (if user-specific),
   learn landing REF_GROUPS (if curriculum), `app/sitemap.ts` with
   multilingual alternates, cross-linked from related pages. An unlinked
   page is a dead page.

4. **User writes are idempotent.** `saved_charts`, `user_profiles`,
   `kundali_snapshots` — every insert checks for a natural-key duplicate
   first (trim + lowercase name + date + time + lat/lng rounded to 4dp).
   Button is disabled during save AND we dedupe — both, not either.

5. **Loading state always terminates.** Every fetch branch, including
   early returns like `if (!user) return;`, must flip `loading` to false.
   When a page depends on async auth, it waits for
   `useAuthStore().initialized === true` before deciding.

6. **URL > local state > cache priority.** The kundali page mount effect
   reads URL params first (`?n=&d=&t=&la=&lo=&p=`), falls back to
   `sessionStorage.kundali_last_result` ONLY when params are absent.
   Documented in a comment at the consumer.

7. **Library limits documented at call sites.** jsPDF built-in fonts are
   Latin-1 only → PDF generator forces English and regenerates non-en
   tippanni. `print-color-adjust: exact` preserves every color → scoped
   to SVGs only. No comment = no shipping.

8. **No `setTimeout` substitutes for events.** `document.fonts.ready`
   before print. `onload` for async iframes. Animation events for
   transitions. Blind timing bets fail on slow networks.

9. **No bulk regex on TypeScript or Tailwind class names.** A sed on
   `tl(` → `t(` broke 3,343 call sites. A bracket double-escape broke
   128 files. Use ts-morph / jscodeshift, OR dry-run on 2–3 files, OR
   gate on `npx next build` between batches.

10. **All locales required, always.** Every new translatable key lands
    in every locale's JSON on the same commit — no partial rollouts.
    Regional translations may fall back to English (via `tl()` helper)
    but the key must exist. Never render `undefined` or a key path.

## Definition of Done (every task)

A task is complete only when ALL FOUR are true:

1. `npx tsc --noEmit -p tsconfig.build-check.json` passes
2. `npx vitest run` passes (or new tests added for the change)
3. `npx next build` succeeds with zero errors
4. The change was verified in the running browser — click the actual
   button, fill the actual form, watch the UI respond. Not just
   curl-of-server-HTML.

For production-visible changes (auth, checkout, DB writes), also run
`vercel logs` after deploy to confirm no runtime errors.

If any gate fails, say so explicitly — never report "done" while one is
red.

## Before we start writing code

Give me back:

1. A proposed `src/` folder structure with 2–3 sentence rationale per
   top-level directory. Specifically explain the split between
   `lib/astronomy`, `lib/ephem`, `lib/panchang`, `lib/kundali` — I don't
   want a monolithic `lib/math`.

2. The shape of the core data types as TypeScript interfaces:
   `BirthData`, `KundaliData`, `PanchangData`, `LocaleText`,
   `Trilingual extends LocaleText`. Rashi IDs 1-indexed (1–12), planet
   IDs 0-indexed (0=Sun → 8=Ketu).

3. The testing strategy:
   - which correctness checks live as Vitest unit vs. Playwright E2E
   - 3 reference locations for DST regression testing (my choice: Bern,
     Delhi, Seattle — sanity check this)
   - a regression-vector fixture format for panchang accuracy

4. The first 5 PRs in order, each ~1 day of work, formatted as:
   goal / files touched / Definition of Done.

5. A list of the 10 most load-bearing architectural decisions you're
   making and the 1-sentence "why" for each. I want to push back on any
   I disagree with BEFORE we build.

6. The top 5 risks to the project and how the architecture mitigates each.

**Do not write code yet.** This is the planning conversation. We'll
iterate on this until I'm happy, then you'll open a plan file and we
execute. When code starts, every feature follows the Definition of Done
above.

---

## Incidents that shaped these rules

For context on *why* each principle exists — all of these actually
happened on this codebase. They are documented in `CLAUDE.md` under
"Lessons from Real Incidents (Apr 2026)":

- **Principle 1 (single source of truth):** `layout.tsx` imported a
  stale flat `messages/en.json` while `request.ts` loaded per-locale
  dirs. Dashboard showed `pages.dashboard.title` as a literal string for
  weeks before being noticed.
- **Principle 2 (visible errors):** `catch { /* silently fail */ }` in
  `handleSaveChart` made RLS failures invisible; users saw "Saved" but
  no row was created.
- **Principle 3 (integration):** saved-charts subpage worked perfectly
  but was buried behind a Quick Link tile — users couldn't find it.
- **Principle 4 (idempotent writes):** no duplicate check meant repeat
  Save clicks created duplicate chart rows.
- **Principle 5 (loading termination):** `if (!user) return;` without
  `setLoading(false)` spun the spinner forever during auth restore.
- **Principle 6 (URL > cache):** dashboard saved-chart cards passed
  `/kundali?n=X&d=...` but the page only read `sessionStorage`. Every
  card opened the last-generated chart.
- **Principle 7 (library limits):** jsPDF's Latin-1 fonts mangled
  Devanagari into `A.M-` / `8B0M/` gibberish; `print-color-adjust: exact`
  applied globally turned gradients into washed-out purple on paper.
- **Principle 8 (no setTimeout for events):** `setTimeout(print, 500)`
  raced Google Font loading; Hindi print output tofu on slow networks.
- **Principle 9 (no bulk regex):** a `tl(` → `t(` sweep broke 3,343
  non-translation call sites; a Tailwind bracket double-escape broke 128
  files.
- **Principle 10 (all locales always):** migrations that assumed "real
  translations everywhere" broke at runtime when a few locales had
  placeholders.

Every rule is paid for in blood. Don't re-pay for them.
