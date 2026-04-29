# Panchang - Vedic Astrology Web Application

## Definition of Done (non-negotiable)

Before claiming any task complete, ALL FIVE must be true:

1. `npx tsc --noEmit -p tsconfig.build-check.json` passes
2. `npx vitest run` passes (or new tests added for the change)
3. `npx next build` succeeds with zero errors
4. The change was **verified in the running browser** — not just via curl of server HTML. Click the button, fill the form, watch the UI respond.
5. **If touching astronomical/panchang/kundali computation**: spot-check at least 3 computed values against Prokerala or Shubh Panchang for the same date + location. Compare tithi, nakshatra, masa, sunrise, planet positions — whatever the change affects. "It type-checks" is not verification. (See Lesson K.)

If you skipped any of the five, say so explicitly — never report "done" while a gate failed. For production-visible changes (auth, checkout, DB writes), also run `vercel logs` after deploy to confirm no runtime errors.

**NEVER say "verified" or "correct" about astronomical values without showing proof.** When claiming a computation is correct, you MUST show in your response:
- The actual computed output (run `npx tsx -e "..."` and paste the result)
- The expected reference value (from Prokerala, Drik Panchang, or NASA)
- Side-by-side comparison showing they match

"I checked and it's correct" is NOT acceptable. Show the numbers. If you cannot produce both the computed and reference values, say "NOT VERIFIED" instead of "correct." This rule exists because you have repeatedly claimed values were correct without actually checking — Adhika Ashadha (was Jyeshtha), Purnimant Chaitra (was Vaishakha), month dates on Ashtami (should be Purnima). Every one of these would have been caught by running one computation and comparing.

## Domain & Location Assumptions

- **Inception year: 2026.** Do not default to 2024 or 2025.
- **No hardcoded locations.** Do NOT assume Delhi/IST/India for any default — the user is in Corseaux/Vevey, Switzerland, and the app serves a global audience. Always read from the location store (`stores/location-store`) or birth form input.
- **Timezone from coordinates only** — never use browser/OS timezone for kundali calculations. Resolve IANA timezone from birth lat/lng.
- **No Drik Panchang references** — all comparisons use Prokerala / Shubh Panchang for the same location.
- Derive technical parameters from inputs (e.g., ayanamsha from user prefs, not hardcoded lahiri).

## Styling & Build Tooling

- Tailwind v4 — arbitrary value classes like `bg-[#0a0e27]` and `from-[#2d1b69]/40` are common. **Never run sed/regex across these.** A bracket double-escape broke 128 files; a `tl(` → `t(` regex broke 3,343 non-translation call sites.
- For any bulk transformation of TS code: use AST tools (ts-morph, jscodeshift) OR have Claude do a dry run on 2–3 files first and gate on `npx next build` before going wide.
- `print-color-adjust: exact` preserves *every* color including translucent gradients — verify on actual paper output, not just DevTools.
- `invert(1)` and some CSS functions behave differently under Tailwind v4; test in browser.
- Framer Motion `ease` values need `as const` (e.g., `ease: 'easeInOut' as const`).

## Feature Integration (discoverability)

New features must land in **primary navigation**, not as reference links or Quick Link tiles. User expectation: if I built it, I should see it on the dashboard/main nav the moment it ships.

Checklist when shipping a new page/feature:
- [ ] Linked from the navbar if it's a top-level tool
- [ ] Rendered inline on `/dashboard` if it's user-specific (saved charts, remedies, etc.)
- [ ] Added to the `learn` landing REF_GROUPS if it's a curriculum module
- [ ] Added to `/app/sitemap.ts` with multilingual alternates
- [ ] Cross-linked from related pages (kundali ↔ matching, panchang ↔ muhurat, etc.)

An unlinked page is a dead page. This rule has been broken twice (library, saved kundalis) — both times generated visible user frustration.

## Project Overview
A web application for Indian Vedic astrology featuring daily Panchang calculations and Kundali (birth chart) generation with interpretive commentary. All astronomical calculations are done locally using Meeus algorithms — no external astrology APIs.

## Tech Stack
- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **State**: Zustand
- **Validation**: Zod
- **Charts**: D3.js + custom SVG
- **Animation**: Framer Motion
- **Icons**: Lucide React + custom SVG icon system (no emoji icons)
- **Auth**: Supabase Auth (Google OAuth + Email/Password)
- **Database**: Supabase (PostgreSQL) with RLS
- **Payments**: Stripe (USD) + Razorpay (INR)
- **Email**: Resend (transactional + Supabase SMTP)
- **i18n**: next-intl (EN/HI/SA/TA — 4 locales, Tamil added Apr 2026)
- **Deployment**: Vercel (auto-deploy from main)
- **PWA**: Service worker (sw.js) with CacheFirst/SWR/NetworkFirst strategies

## Architecture
```
src/
├── app/[locale]/          # Pages (142 across 3 locales)
├── app/api/               # 14 API routes
├── components/            # React components
│   ├── auth/              # AuthModal, UserMenu, OnboardingModal
│   ├── icons/             # Custom SVG icons (Rashi, Nakshatra, Graha, Panchang)
│   ├── kundali/           # Chart components (North, South, BirthForm)
│   ├── layout/            # Navbar, Footer
│   └── panchang/          # TodayPanchangWidget, cards
├── lib/
│   ├── astronomy/         # Core engine (Julian Day, Sun/Moon, sunrise/sunset)
│   ├── ephem/             # Ephemeris (panchang-calc, kundali-calc, astronomical)
│   ├── panchang/          # Panchang calculator
│   ├── kundali/           # Birth chart (27 modules: dashas, yogas, shadbala, etc.)
│   ├── calendar/          # Tithi table, festival engine, eclipses
│   ├── constants/         # Trilingual data (nakshatras, tithis, rashis, grahas, etc.)
│   ├── matching/          # Ashta Kuta 36-point compatibility
│   ├── subscription/      # Tier config, access control
│   ├── supabase/          # Client (browser) + Server (service role)
│   └── email/             # Resend client + templates
├── stores/                # Zustand stores (auth, location, charts)
├── types/                 # TypeScript interfaces (panchang.ts, kundali.ts)
└── messages/              # i18n locale files (en.json, hi.json, sa.json)
```

## Database Migrations (CRITICAL)

**Every schema change MUST have a migration file in `supabase/migrations/`.**

- Migrations are numbered: `001_name.sql`, `002_name.sql`, etc.
- Apply to live DB via: `npx supabase db query --linked "SQL HERE"`
- All triggers on `auth.users` MUST use `SECURITY DEFINER` and `SET search_path = public`
- All triggers MUST have `EXCEPTION WHEN OTHERS THEN RETURN NEW` — never block auth
- All INSERT triggers MUST use `ON CONFLICT ... DO NOTHING` for idempotency
- After changing triggers: verify signup works (`curl -X POST .../auth/v1/signup`)
- RLS policies: users read own data, service_role manages everything
- Run `npx supabase db query --linked "SELECT * FROM auth.users"` to verify user state

## Color Palette (Dark Mode Only)

| Token           | Value     | Usage                    |
|-----------------|-----------|--------------------------|
| bg-primary      | #0a0e27   | Page background (navy)   |
| bg-secondary    | #111633   | Cards, elevated surfaces |
| gold-primary    | #d4a853   | Primary accent           |
| gold-light      | #f0d48a   | Headings, hover          |
| gold-dark       | #8a6d2b   | Borders, subtle          |
| text-primary    | #e6e2d8   | Body text                |
| text-secondary  | #8a8478   | Labels, descriptions     |

No light theme — dark mode is forced. Removed the theme toggle.

### Card Gradient (Purple Mega Card Style)

All cards and elevated surfaces MUST use the purple mega card gradient, NOT plain `bg-bg-secondary`:

```
bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12
```

- **Never use `bg-bg-secondary` for cards on new pages.** That's the old flat style.
- Hover state: `hover:border-gold-primary/40`
- Rounded corners: `rounded-2xl` for large cards, `rounded-xl` for smaller elements
- This gradient is used across 30+ components (mega cards, modals, dashboards, learn sections)
- Stronger variant for emphasis: `from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27]`

## Development Commands

```bash
npx next dev --turbopack     # Dev server (port 3000)
npx next dev                 # Fallback: webpack mode if Turbopack loops/crashes
rm -rf .next                 # Clear stale chunks if dev server renders garbage
npx next build               # Production build (verify before push)
npx vitest run               # Run all tests
npx vitest run src/lib/__tests__/auth-regression.test.ts  # Specific test file
npx supabase db query --linked "SQL"   # Run SQL on live Supabase
vercel ls                    # Check deployment status
vercel logs                  # View production logs
```

**Dev server notes**: Turbopack is unstable — if you see stale chunks, `MODULE_NOT_FOUND` for files that exist, or repeated OOM crashes, clear `.next` and fall back to webpack mode (`npx next dev` without `--turbopack`).

## Deployment Workflow

1. `npx next build` → 2. `git push origin main` (Vercel auto-deploy) → 3. `vercel ls` (confirm Ready) → 4. Test auth/checkout/modified endpoints → 5. `vercel logs` (check runtime errors)

## Key Design Decisions
- Lahiri Ayanamsa default; North Indian diamond chart (South toggle available)
- Meeus algorithms (~0.01° Sun, ~0.5° Moon); all panchang within 1-2 min of Prokerala/Shubh
- All computation server-side via route handlers; no external astrology APIs
- `Trilingual` type: `{ en: string; hi: string; sa: string }`; Rashi IDs 1-based (1-12), Planet IDs 0-based (0=Sun..8=Ketu)

## Environment Variables

**Always `.trim()` env vars in API routes** — Vercel env values can have trailing newlines.

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase client
- `SUPABASE_SERVICE_ROLE_KEY` — Server-side Supabase admin
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` — Payments
- `STRIPE_PRICE_PRO_MONTHLY/ANNUAL`, `STRIPE_PRICE_JYOTISHI_MONTHLY/ANNUAL` — Price IDs
- `STRIPE_WEBHOOK_SECRET` — Webhook verification
- `RESEND_API_KEY` — Email sending

## Code Conventions
- Use `'use client'` only when component needs interactivity/browser APIs
- API routes in `src/app/api/` using route handlers
- Path alias: `@/*` → `./src/*`
- Tailwind v4 with CSS custom properties for theming
- No emoji icons — use custom SVG icon system
- Inline LABELS objects for page-specific i18n (not locale files)
- All new pages must support EN/HI/SA
- **When creating a new page, ALWAYS integrate it**: add to navbar (if top-level), learn landing REF_GROUPS (if learn/reference), modules index (if curriculum module), sitemap, and cross-link from related pages. An unlinked page is a dead page.

## Auth Conventions
- Supabase client MUST have: `detectSessionInUrl: true`, `persistSession: true`, `storageKey: 'dekho-panchang-auth'`
- Google OAuth returns via URL hash — client auto-exchanges
- Email signup requires confirmation (Resend SMTP handles delivery)
- Existing account detection: check `user.identities.length === 0` on signup response
- All API routes authenticate via `Authorization: Bearer <token>` header

## Testing
- Framework: Vitest
- Test files: `src/lib/__tests__/*.test.ts` and `*.test.ts` co-located
- Run before pushing: `npx vitest run`
- Regression tests cover: auth config, checkout env trimming, panchang accuracy vs Prokerala/Shubh, vedic time, signup trigger safety
- Panchang accuracy target: within 2 min of reference panchang sources for all elements

## Lessons from Real Incidents (Apr 2026) — A through J

Hard rules from bugs that shipped. See also global CLAUDE.md for universal versions.

- **A. Never silently swallow errors**: destructure `{ data, error }`, branch on `error`, log with `console.error('[module] X failed:', err)`, show user-visible feedback.
- **B. Single source of truth**: if two paths load "the same thing," share one loader.
- **C. Link-to-destination contracts must be explicit**: mount effects that read local state must check the URL first and comment the precedence.
- **D. Unlinked pages are dead**: integrate the moment it's built (see Feature Integration).
- **E. Document library limits at the call site**: guard in code or comment the quirk. Never `setTimeout` as a substitute for a readiness event.
- **F. Loading state must always terminate**: every branch of a data fetch (including early returns) must set loading to false.
- **G. User writes must be idempotent**: dedupe by natural key (trimmed lowercase name + date + time + lat/lng rounded to 4dp) before insert.
- **H. Never bulk find/replace with regex/sed**: use AST tools or dry-run 2-3 files + `npx next build` gate. If you MUST regex, print match count + 5 samples and get confirmation.
- **I. Translation migration — verify both sides**: grep new keys against every locale's JSON. Configure `next-intl` `onError` to log missing keys.
- **J. Locale fallback is non-negotiable**: render English if regional translation is missing — never `undefined` or key path.

## i18n Conventions (next-intl)

- **Namespaces**: `pages.*`, `components.*`, `learn.*` — defined in `src/lib/i18n/request.ts`. Message files live at `src/messages/{locale}/{global,pages,components,learn}.json`.
- **Translation calls**: always use `useTranslations('namespace')` / `getTranslations('namespace')`. No inline `lt()`, no `{ en, hi, ... }` objects, no conditional `locale === 'xx' ? ... : ...` ternaries for translatable strings.
- **When adding a new translatable string**: add it to `en/pages.json` FIRST, then propagate to every other locale. Script: `python3 scripts/check-locale-parity.py` (create if missing).
- **When using `useTranslations` for a new namespace**: verify every locale has that namespace before committing. `grep -l "panchangInline" src/messages/*/pages.json` — must return 10 matches.
- **Never use regex/sed to rewrite `t(...)` calls** — see Lesson H.
- **Supported locales**: en, hi, sa, ta, te, bn, kn, mr, gu, mai (10 total). Regional-language values may fall back to en or hi when real translations aren't available, but the key must exist.

## Mandatory Development Rules (Prevent Regressions)

### 1. VERIFY BEFORE "DONE"
- Run `npx next build` — must pass with 0 errors
- Run `npx vitest run` — all tests must pass
- Test the actual feature in the browser (not just build)
- Check browser console for errors after every interaction
- If touching auth: test signup, Google OAuth, and sign-in flows
- If touching payments: test checkout on both localhost AND dekhopanchang.com

### 2. NO DEAD CLICKS
- Every clickable element MUST do something visible
- If functionality isn't ready: hide the button entirely, or show it disabled with explanation
- NEVER: silent failures, buttons that do nothing, links that go nowhere
- NEVER: `catch (e) {}` that swallows errors — always show user feedback

### 3. ERROR HANDLING
- Separate independent operations into separate try/catch blocks
- If operation A failing should NOT skip operation B, put them in SEPARATE try blocks
- Always show user-facing error messages, not just console.error
- API errors must return meaningful messages, not generic "Something went wrong"

### 4. DARK THEME STYLING
No light theme exists. All colors must be dark-mode native:
- NEVER use `bg-red-50`, `bg-red-100` etc. — use `bg-red-500/10`, `bg-red-500/20`
- NEVER use dynamic Tailwind classes like `` `text-${color}-600` `` — Tailwind can't statically analyze them
- Use opacity-based colors: `bg-gold-primary/15`, `border-gold-primary/20`
- Use `text-gold-light`, `text-text-secondary`, `text-text-primary` — not hardcoded hex

### 5. ENV VAR SAFETY
- Always `.trim()` env vars in API routes — Vercel env values can have trailing whitespace
- Never hardcode secrets — use `process.env.VAR_NAME`
- Test locally first, then verify on Vercel (env var issues only surface in production)

### 6. DATABASE SAFETY
- All triggers on `auth.users` MUST use `SECURITY DEFINER` + `EXCEPTION WHEN OTHERS`
- After any trigger change: test signup via `curl -X POST .../auth/v1/signup`
- Apply migrations via: `npx supabase db query --linked "SQL"`
- Never assume a column exists — verify schema first

### 7. DEPLOYMENT VERIFICATION
After every `git push`:
1. `vercel ls` — confirm deployment is Ready (not Error)
2. Check `vercel logs` for runtime errors
3. Test critical paths: auth, profile, checkout
4. If Vercel build fails but local passes: check for missing env vars or dependency issues

## Agent Instructions

### NEVER ASK FOR EXECUTION PERMISSION
- When assigned a task, GO. Do not ask "should I proceed?", "would you like me to?", or "shall I?".
- NEVER prompt for permission to read files, write files, run commands, run tests, or make edits. Just do it.
- Execute fully to 100% completion without prompting. The task is the permission.
- If something is ambiguous, make the best decision and document it — don't block on a question.
- DO prompt for design decisions when multiple valid approaches exist ("modal vs page?", "which layout?"). That's collaboration, not permission-asking.

### COMPLETION STANDARD
- Every task must be DONE-done: built, tested, visually verified, pushed.
- UI work must be complete and consistent — no half-styled components, no missing hover states, no broken responsive layouts.
- Check every page/component touched in the browser. Click every button. Resize the window.
- Run `npx next build` before considering anything finished. Zero errors, no exceptions.

### TESTING REQUIREMENTS
- Run `npx vitest run` after every change.
- For large changes (new features, refactors, multi-file edits): augment existing tests or write new ones.
- Run the full test suite AND verify the build before pushing.
- Pre-push hook runs `tsc --noEmit -p tsconfig.build-check.json` — if it fails, fix it, don't bypass it.

### SELF-REVIEW EVERY DESIGN SECTION
- After presenting any design section, review with fresh eyes. Identify flaws, gaps, edge cases. Address in the same message.

### GENERAL
- Prefer editing existing files over creating new ones.
- Compare astronomical calculations with Prokerala/Shubh Panchang (NOT Drik). Never default to Delhi/India.
- Explore code first when asked for analysis. Save task lists for multi-step work. After refactoring, grep ALL references.

## Lessons from Full Audit (Apr 24, 2026) — 63+ bugs found across 6 rounds

These shipped to production and affected real users. 6 rounds of auditing were needed to reach zero new issues. Treat every rule below as non-negotiable.

### K. Every astronomical value must be verified against a reference source
- Purnimant months were computed by subtracting a fixed 15 days from New Moon dates. This is astronomically wrong (Full Moon to New Moon varies 13.9–15.6 days). Months started on Ashtami instead of Purnima. **Would have been caught instantly by comparing one date with Prokerala.**
- Rule: Before shipping ANY astronomical computation (moon phases, tithis, nakshatras, planetary positions, month boundaries, dasha dates), spot-check at least 3 dates against Prokerala or Shubh Panchang. "It type-checks" is not verification.
- Rule: Never use fixed-interval approximations for lunar phenomena. The Moon's orbit is elliptical — all intervals vary.

### L. Never use `new Date()` without explicit UTC
- `new Date(year, month-1, day, hour, minute)` interprets arguments in the **server's local timezone** (UTC on Vercel, but variable in dev). Birth time 10:30 IST became 10:30 UTC. All dasha start/end dates were shifted by the birth timezone offset.
- Rule: Always use `new Date(Date.UTC(y, m-1, d, h, m))` or `date.getTime() + ms` for astronomical date construction. Never use the local-time `new Date(y,m,d,h,m)` constructor in computation code.
- Rule: Grep for `new Date(` in any computation file before shipping. Every instance must either use `Date.UTC` or have a comment explaining why local time is correct.

### M. Same data must come from the same source — or it will drift
- The daily panchang page showed masa from a solar approximation (`getMasa()` — Sun's current sign), while the festival engine used actual lunar month boundaries (New Moon to New Moon). Users saw different months on different pages for the same date. Adhika Masa was completely missing from the daily view.
- Rule: When two features display "the same thing" (month name, tithi, nakshatra), they MUST call the same function. If a solar approximation exists alongside a lunar computation, the solar one must be removed or clearly labeled as a fallback.

### N. Trace the FULL data flow before fixing a bug
- BirthForm "Edit" bug took 2 attempts: first fix added a missing `relationship` field (surface guess), second fix discovered a `useEffect` that unconditionally overwrote form data with the logged-in user's profile. The real bug was one scroll away from the first guess.
- Rule: Before editing any file to fix a bug, trace the complete path: what triggers the action → what state changes → what effects run → what re-renders occur. Check for useEffects that stomp on the state you're looking at.

### O. Weekday conventions: `Math.floor(jd + 1.5) % 7` gives 0=Sunday
- KP ruling planets had weekday lord shifted by one day because the code assumed 0=Monday. The muhurta engine had a similar issue.
- Rule: The JD weekday formula `Math.floor(jd + 1.5) % 7` gives **0=Sunday**, matching `Date.getUTCDay()`. Any code using JD weekdays must use this convention. Add a comment at every weekday computation: `// 0=Sun, 1=Mon, ..., 6=Sat`

### P. Fractional years must use millisecond arithmetic, not month truncation
- `addYears()` used `Math.floor((years % 1) * 12)` months — truncating sub-month fractions. Over 12+ dasha periods, dates drifted by months. A separate `calcGrahaDasha` function used `setFullYear/setMonth` with the same problem.
- Rule: `new Date(date.getTime() + years * 365.25 * 24 * 60 * 60 * 1000)` — this is the ONLY correct pattern for adding fractional years. Never use `setMonth` or `setFullYear` for fractional periods.

### Q. Constants that appear in multiple files must live in one shared file
- Pushkar Bhaga degree tables existed in two files with completely different values. Only one was correct.
- Rule: Any Jyotish constant (lordships, exaltation degrees, friendship tables, karana cycles, nakshatra data) must be defined ONCE in `src/lib/constants/` and imported everywhere. Grep for the constant name before creating a new one.

### R. Midnight-crossing time ranges need wrap-aware comparison
- "NOW" badges never appeared for night choghadiya/hora/muhurta slots that crossed midnight (23:30→01:15). Three separate instances of the same bug.
- Rule: Any time-range comparison `now >= start && now < end` MUST handle midnight wrapping: `if (end < start) return now >= start || now < end;`
- Rule: When fixing a pattern bug, grep the entire codebase for the same pattern. If it appears in 3 places, fix all 3 in one commit.

### S. Canonical BPHS tables must be defined ONCE and cross-checked against ALL consumers
- The Naisargika Maitri (planetary friendship) table existed in **16 separate files**. Five had errors — Moon-Jupiter was "friend" in ashta-kuta but "neutral" in the other 11. Mercury's friends were `[Sun,Moon,Jup,Ven,Sat]` in one file but `[Sun,Venus]` everywhere else. A "fix" that trusted one file without cross-checking the others made it worse.
- Rule: Before changing ANY Jyotish constant (friendships, exaltation, debilitation, moolatrikona, lordship), `grep` for that constant across the ENTIRE codebase. Count how many files define it. Align ALL of them in one commit. The majority reading is almost always correct — a single outlier is the bug.
- Canonical tables (verified Apr 2026, 16-file audit):
  - **Moon friends**: Sun, Mercury. **Not Jupiter.** (BPHS Ch.3)
  - **Moon enemies**: NONE. Moon has no natural enemies.
  - **Jupiter enemies**: Mercury, Venus. **Not Saturn.** Saturn is neutral.
  - **Mercury friends**: Sun, Venus. Not Moon/Jupiter/Saturn.

### T. Yoga detection conditions are the #1 source of false positives
- Four yoga bugs shipped simultaneously, each from a different category of mistake:
  - **Vasumati**: `.some()` instead of `.every()` → triggered in ~79% of charts (should be <5%)
  - **Mahabhagya**: checked lagna LORD's sign instead of lagna SIGN → wrong condition entirely
  - **Gauri**: aspect direction reversed + KENDRA union → 50% false positive rate
  - **Kemadruma**: missing conjunction cancellation → false positives when Moon was conjunct planets
- Rule: After writing any yoga detection, compute the **expected frequency** mentally. If a "rare" yoga triggers in >20% of random charts, the condition is too loose. Gajakesari (~25%) and Chandra-Mangala (~8%) are naturally common; Raja Yogas should be 5-15%; Mahapurusha <10%.
- Rule: Aspect checks must specify direction: `houseOffset(FROM, TO)`, not `houseOffset(TO, FROM)`. Jupiter aspects houses 5/7/9 FROM Jupiter, not from the target.

### U. Moolatrikona ranges must match BPHS Ch.4 exactly — not "close enough"
- Moon's moolatrikona was Taurus 3-30° in one file and 0-3.33° in another. The correct range is 4-20°. Venus was 0-15° and 0-10° — correct is 0-5°. These inflated/deflated dignity scores in tippanni interpretations vs Shadbala.
- Canonical BPHS Ch.4 Moolatrikona ranges (verified Apr 2026):
  - Sun: Leo 0-20° | Moon: Taurus 4-20° | Mars: Aries 0-12°
  - Mercury: Virgo 16-20° | Jupiter: Sagittarius 0-10°
  - Venus: Libra 0-5° | Saturn: Aquarius 0-20°

### V. Julian Day ↔ Date conversion must use Date.UTC, never local timezone
- `jdToDate()` used `new Date(year, month-1, day)` which interprets arguments in the server's local timezone. On a UTC+2 machine, JD noon UT on Apr 24 would produce a Date showing Apr 23 22:00 UTC.
- Rule: All JD↔Date conversions must use `Date.UTC()`. This is a special case of Lesson L but specific to the `jdToDate()` utility that is called from dozens of places.

### W. Swiss Ephemeris node speed: do NOT negate Ketu's speed
- Ketu's longitude is Rahu + 180°, but its speed is the SAME as Rahu (both nodes move retrograde at ~0.053°/day). The code negated Ketu's speed, giving it a positive speed (+0.053°/day = direct motion), which caused the UI to show Ketu as non-retrograde and broke any downstream code using speed sign.
- Rule: When deriving one celestial body from another (Ketu from Rahu), only transform the position, not the velocity, unless there's a physical reason.

### X. Combustion orbs differ for retrograde Mercury and Venus
- BPHS specifies reduced combustion orbs when Mercury or Venus is retrograde: Mercury 14°→12°, Venus 10°→8°. The code used fixed orbs regardless of retrograde status.
- Rule: `computeCombust()` must accept an `isRetrograde` parameter. All call sites must pass it.

### Y. Graha Yuddha winner: higher NORTHERN latitude, not lower absolute latitude
- The code used `Math.abs(p1.latitude) <= Math.abs(p2.latitude)` which could declare a planet at -2° latitude (southern) the winner over one at +1° (northern). Per BPHS Ch.3 and Surya Siddhanta, the planet with greater positive (northward) latitude wins.
- Rule: Winner = `p1.latitude >= p2.latitude ? p1 : p2` (simple comparison, not absolute value).

### Z. Never change a Jyotish constant without grepping the ENTIRE codebase first
- The Moon-Jupiter friendship was correct (neutral) in 11 files. A single audit claim said it should be "friend." I changed it without checking the other 11 files. Then I had to revert — after the wrong value was live. Any user who ran Ashta Kuta matching in that window got a wrong score.
- Rule: Before editing ANY constant (friendship, exaltation, lordship, moolatrikona, yoga condition), run `grep` for that constant name across ALL files. Count how many agree. The majority is almost always right. Change ALL files in one commit or change NONE.
- Rule: If an audit says "X is wrong" but 11 files say otherwise, the audit is wrong.

### ZA. Same data must render from ONE component — never two
- The 5 panchang cards (tithi, nakshatra, yoga, karana, vara) existed as inline JSX in `PanchangClient.tsx` AND as a generic loop in `TodayPanchangWidget.tsx`. When the panchang page cards were fixed, the landing page cards stayed broken. It took 3 rounds of user frustration to align them.
- Rule: When two pages show the same data visualization, extract a shared component. Duplicated rendering code WILL drift — it is not a question of if, but when.
- Rule: After fixing a display bug, grep for the component/pattern across the entire app. If it appears in 2+ places, fix ALL of them in the same commit.

### ZB. "It type-checks" and "tests pass" is NOT "it works"
- The yoga card showed "Ganda" with Shula's time range. TypeScript was happy. Tests passed. The bug was visible the instant you opened the page.
- Rule: Every UI change must be verified in the browser before claiming done. This is Definition of Done item #4 and it is non-negotiable. If you cannot test in browser (Playwright down, no access), say so explicitly — never claim the work is complete.

### ZC. Festival definitions use Amant month names — match against `.amanta`
- Festival generator matched against `.purnimanta` but definitions used Amant convention (which Prokerala, Drik Panchang, and all references use). During Krishna Paksha, Purnimant is one month ahead → Diwali was 30 days early, Dussehra 11 days early.
- Rule: All festival/vrat definitions use Amant month names. Always compare against `e.masa.amanta`, never `.purnimanta`.
- **Proactive check:** When adding a new festival, verify the month name matches Amant convention by checking Prokerala for the expected date.

### AA. API routes must log errors AND validate all inputs
- Six API routes had `catch {}` blocks that returned error JSON but never logged with `console.error` — making production debugging impossible.
- `/api/kundali` lacked date/time format validation. `/api/transits` didn't validate year. `/api/varshaphal` didn't check timezone.
- Rule: Every API catch block must `console.error('[route-name] error:', err)` BEFORE returning the error response.
- Rule: Every API route must validate input format (regex for dates/times) and range (month 1-12, hour 0-23) before calling computation functions.
- **Proactive check:** When creating or modifying an API route: (1) inputs validated, (2) catch blocks log, (3) error responses don't leak internal details.

### BB. Muhurta scoring must check ALL classical inauspicious periods
- Panchaka (Moon in nakshatras 23-27) was not checked. Sthira karanas (Shakuni, Chatushpada, Naga) were not penalized. Abhijit Muhurta was shown as auspicious on Wednesdays.
- Rule: Muhurta scoring must check: Vishti/Bhadra karana, Panchaka, sthira karanas, Rahu Kaal, Yamaganda, Gulika, inauspicious yogas, Abhijit availability (not Wednesdays).
- **Proactive check:** When adding a new muhurta activity, verify all inauspicious period checks are inherited from the base scorer.

### CC. useEffect auto-fill must be guarded against edit mode
- BirthForm had a useEffect that fetched the user's profile and overwrote form data — stomping on initialData when editing a spouse/child chart.
- Rule: Any useEffect that auto-fills form data from a profile/store/API MUST check if `initialData` was provided. If editing existing data, skip the auto-fill.

### DD. Meeus planetary positions have known accuracy limits
- Jupiter retrograde stations ~40 days late, Saturn ~13 days late with Meeus simplified series. Not a code bug, but users see wrong retrograde dates.
- Rule: When Meeus fallback is active (no Swiss Ephemeris), add a warning to `KundaliData.warnings[]`. Surface this to users. Never claim accuracy without testing against Swiss Ephemeris.

## NEVER Duplicate Logic or Constants (Hard Rule)

Before writing ANY constant table, computation function, or detection logic:
1. **GREP FIRST**: `grep -rn "CONSTANT_NAME" src/lib/` — if it exists ANYWHERE, import it. Do NOT create a local copy.
2. **Canonical constant files** (ALWAYS import from these, NEVER redefine):
   - Dignities (exaltation, debilitation, moolatrikona, sign lords): `src/lib/constants/dignities.ts`
   - Planet data (names, ids, symbols): `src/lib/constants/grahas.ts`
   - Nakshatra data: `src/lib/constants/nakshatras.ts`
   - Rashi data: `src/lib/constants/rashis.ts`
   - Inauspicious period orders (Rahu, Yama, Gulika): `src/lib/muhurta/inauspicious-periods.ts`
3. **Computation functions** — use the authoritative engine, never re-implement:
   - Tithi/Yoga/Karana: `src/lib/ephem/astronomical.ts`
   - Doshas (Manglik, Kaal Sarpa, Pitru): `src/lib/kundali/tippanni-engine.ts` → `generateTippanni()`
   - Rahu Kaal: `src/lib/ephem/astronomical.ts` → `calculateRahuKaal()`
   - Hora: `src/lib/hora/hora-calculator.ts` → `calculateHoras()`
4. **If you need a constant that doesn't exist**: create it in the appropriate `src/lib/constants/` file and export it. Never inline it in a feature file.
5. **Known tech debt**: see `docs/tech-debt/duplicate-code-audit.md` for tracked violations being cleaned up incrementally.

This rule exists because we had 12+ copies of the EXALTATION table, 40+ copies of PLANET_NAMES, and duplicate dosha detection that produced different answers for the same chart. Every duplicate is a future bug.

## Proactive Bug Prevention Checklist

Run this checklist BEFORE shipping any change to computation code:

```
□ Grep for `new Date(` in changed files — all must use Date.UTC or have justification
□ Grep for `[locale]` in changed TSX files — all must use tl() or || .en fallback
□ Grep for the same constant/table in other files — no duplicates with different values
□ If touching time ranges: does the comparison handle midnight wrapping?
□ If touching weekday logic: does 0 mean Sunday? Add a comment.
□ If touching dasha periods: does addYears use millisecond arithmetic?
□ If touching festivals: does the month match use .amanta (not .purnimanta)?
□ If touching muhurta: are ALL inauspicious periods checked (Vishti, Panchaka, sthira karana, Rahu Kaal, Abhijit Wednesday)?
□ If touching API routes: do catch blocks log with console.error? Are inputs validated?
□ If touching forms with auto-fill: is the auto-fill guarded against edit mode (initialData)?
□ If touching yoga detection: what is the expected frequency? >20% for a "rare" yoga = bug.
□ Spot-check 3 computed values against Prokerala for the same date + location
□ Run npx vitest run — zero failures
□ Run npx tsc --noEmit — zero errors
□ Test in browser — click the feature, check console for errors
```

## Patterns & Best Practices (Learned from Bug Fixes)

### Trilingual/Locale Safety
- **ALWAYS** use `tl(obj, locale)` from `@/lib/utils/trilingual.ts` when accessing Trilingual objects.
- **NEVER** write `obj.name[locale]` directly — Tamil ('ta') will return `undefined` and crash.
- The `tl()` helper safely falls back to `.en` when the locale key doesn't exist.
- Pattern: `tl(panchang.tithi.name, locale)` NOT `panchang.tithi.name[locale]`
- The panchang page also has a local `tl()` (inline) — both work the same way.

### Service Worker (sw.js)
- **Clone response BEFORE async cache put**: `var clone = res.clone(); caches.open(n).then(ca => ca.put(r, clone));`
- Never call `res.clone()` inside an async `.then()` — by then the body may be consumed.
- Bump cache version (`dp-v2`, `dp-v3`, etc.) after any SW change to force old cache purge.

### Panchang Time Windows (Varjyam, Amrit Kalam)
- Windows computed from nakshatra ghati offsets can fall OUTSIDE the current panchang day.
- **ALWAYS** filter windows against sunrise-to-next-sunrise bounds before displaying.
- A nakshatra starting yesterday can have its Varjyam window before today's sunrise — filter it out.

### Choghadiya/Hora Conflict Detection
- Classical rule: Varjyam and Rahu Kaal **override** auspicious Choghadiya/Hora slots.
- A "Shubh" choghadiya during Varjyam is NOT shubh — display amber ⚠ warning.
- Check overlap: `startA < endB && startB < endA` for time ranges.

### Kundali Page Architecture
- Lazy-loaded tabs: `PatrikaTab`, `TransitRadar`, `ChartChatTab`, `LifeTimeline`. Direct: `SphutasTab`, `JaiminiTab`.
- Inline data structures inside `.map()` loops are a **critical performance bug** — always hoist to module level.

### Subscription Model (Current)
- All features FREE. AI calls restricted: `ai_chat` (2/day), `muhurta_ai` (2/month). PaywallGate exists but unused.

### Chart Components (Transit Overlay)
- `ChartNorth`/`ChartSouth` accept `transitData?: ChartData`. Only slow planets (Jup/Sat/Rahu/Ketu) overlaid.

### SEO Checklist for New Pages
1. Add route to `PAGE_META` in `/lib/seo/metadata.ts`
2. Create `layout.tsx` with `generateMetadata` using `getPageMetadata()`
3. Add JSON-LD if it's a tool page (`generateToolLD()` + `generateBreadcrumbLD()`)
4. Add to sitemap in `/app/sitemap.ts` with multilingual alternates
5. Private pages: add `robots: { index: false }` in metadata
6. Add to `robots.txt` disallow if sensitive (dashboard, embed, settings)

### Email System
- Daily panchang email: cron at 00:30 UTC via Vercel Cron
- Uses `user_profiles.daily_panchang_email` boolean column
- Falls back to birth location if panchang location not set
- Template in `/lib/email/templates/daily-panchang.ts`

### Performance Optimizations (Done)
- Heavy widgets lazy-loaded via `next/dynamic` with `ssr: false`; Suspense boundaries with meaningful fallbacks
- `optimizePackageImports` for `framer-motion` + `lucide-react`; all fonts use `next/font/google` with `display: 'swap'`
- Server-side panchang via Vercel geo headers; home page uses CSS stagger animations (no framer-motion)
