# Panchang - Vedic Astrology Web Application

## Definition of Done (non-negotiable)

Before claiming any task complete, ALL FIVE must be true:

1. `npx tsc --noEmit -p tsconfig.build-check.json` passes
2. `npx vitest run` passes (or new tests added for the change)
3. `npx next build` succeeds with zero errors
4. The change was **verified in the running browser** — not just via curl of server HTML. Click the button, fill the form, watch the UI respond.
5. **If touching astronomical/panchang/kundali computation**: spot-check at least 3 computed values against Prokerala or Shubh Panchang for the same date + location. Compare tithi, nakshatra, masa, sunrise, planet positions — whatever the change affects. "It type-checks" is not verification. (See Lesson K.)

If you skipped any of the five, say so explicitly — never report "done" while a gate failed. For production-visible changes (auth, checkout, DB writes), also run `vercel logs` after deploy to confirm no runtime errors.

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

1. `npx next build` — verify build passes locally
2. `git push origin main` — triggers Vercel auto-deploy
3. `vercel ls` — confirm deployment is Ready (not Error)
4. **Verify after deploy**: Test auth signup, checkout, and any modified API endpoints
5. `vercel logs` — check for runtime errors

## Key Design Decisions
- Lahiri Ayanamsa by default (most widely used in India)
- North Indian diamond chart style (South Indian toggle available)
- Meeus algorithms (~0.01° Sun, ~0.5° Moon accuracy)
- All panchang values verified within 1-2 min of reference panchang sources (Prokerala/Shubh)
- All computation server-side via Next.js route handlers
- No external astrology API dependencies — pure math
- All constant data uses `Trilingual` type: `{ en: string; hi: string; sa: string }`
- Rashi IDs 1-based (1-12), Planet IDs 0-based (0=Sun through 8=Ketu)

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

## Lessons from Real Incidents (Apr 2026)

These were learned from bugs that shipped. Treat as hard rules:

### A. Never silently swallow errors
- `catch { /* silent */ }` in `handleSaveChart` hid RLS failures as a "Saved" indicator that never actually saved.
- `saved-charts` fetch ignored the `error` field of Supabase responses — auth failures rendered as "No saved charts."
- Rule: destructure `{ data, error }`, branch on `error`, log with `console.error('[module] X failed:', err)`, show user-visible feedback.

### B. Single source of truth for shared data
- `layout.tsx` imported a stale flat `messages/en.json` while `request.ts` loaded per-locale dirs. Server translations worked, client ones didn't. Dashboard showed `pages.dashboard.title` as a literal string.
- Rule: if two paths load "the same thing," share one loader.

### C. Every link-to-destination contract must be explicit
- Dashboard saved-chart cards passed `/kundali?n=...&d=...` but the kundali page only read `sessionStorage.kundali_last_result`. Every card opened the last-generated chart.
- Rule: mount effects that read local state must check the URL first and comment the precedence.

### D. Features built but not integrated are dead
- `/dashboard/saved-charts` worked perfectly but was buried behind a Quick Link tile. Users couldn't find it.
- Rule (restated): "An unlinked page is a dead page." Integrate the moment it's built.

### E. Document library limits at the call site
- jsPDF built-in fonts are Latin-1 only; Devanagari strings printed as `A.M-` / `8B0M/` gibberish. No comment, no guard.
- `setTimeout(() => printWindow.print(), 500)` was a blind bet on async Google Font loading. Use `document.fonts.ready`.
- CSS `print-color-adjust: exact` applied globally turned translucent gradients into washed-out purple on white paper.
- Rule: when using an API with a known quirk, either guard in code or comment the limit right above the call.

### F. Loading state must always terminate
- `fetchCharts` had `if (!user) return;` that never flipped `loading=false` — spinner spun forever during auth restore.
- Rule: every branch of a data fetch (including early returns) must set loading to false.

### G. User writes must be idempotent
- No duplicate detection on Save Chart meant repeat clicks / refreshes / tab reopens created dupe rows.
- Rule: dedupe by natural key (trimmed lowercase name + date + time + lat/lng rounded to 4dp) before insert.

### H. Never bulk find/replace `t(...)` calls with regex/sed
- A `tl(` → `t(` sweep broke 3,343 call sites — matched Tailwind arbitrary values (`t-*`), plain `t()` functions, and other things.
- A sed double-escape broke Tailwind bracket syntax across 128 files.
- Rule: for bulk transformations in TypeScript, use AST tools (ts-morph, jscodeshift) or Claude with a verified 2-3 file dry run + `npx next build` gate before proceeding.
- Rule: if you MUST regex, print match count + 5 sample before/afters and get confirmation before applying globally.

### I. When migrating translation calls, verify both sides
- `panchang/page.tsx` was migrated from `msg('todaysMuhurtas', locale)` + JSON import to `useTranslations('pages.panchangInline')` — but the `panchangInline` namespace was never added to any locale's `pages.json`. Result: 6 runtime `MISSING_MESSAGE` errors + a TypeError cascade.
- Rule: any PR that changes how translation keys are referenced MUST grep the new keys against every locale's message JSON and fail if any are missing.
- Rule: `next-intl` should be configured with `onError` to log (not swallow) missing keys so they surface in dev.

### J. Locale fallback is non-negotiable
- Several locale JSONs had English-copied placeholders for regional languages; a later migration that assumed "real translations everywhere" broke at runtime.
- Rule: every locale file must have an English fallback safety net. If a regional translation is missing, render English — never render `undefined` or the key path.

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
- After presenting any design section, immediately review it with fresh eyes before moving on.
- Identify flaws, gaps, missing edge cases, and enhancement opportunities.
- Address them in the same message — don't wait for the user to find problems.
- This applies to: architecture proposals, API designs, data models, UI layouts, pattern definitions, and any non-trivial technical decision.

### GENERAL
- Prefer editing existing files over creating new ones when possible.
- Compare astronomical calculations with Prokerala/Shubh Panchang for same location (NOT Drik — removed all Drik references).
- Never default location to Delhi/India — require user location.
- When asked for analysis or assessment: explore code first, don't ask clarifying questions.
- For multi-step work: save task list, don't rely on conversation history.
- After any refactoring: search for ALL references to changed variables/functions.

## Lessons from Audit (Apr 24, 2026) — 52 bugs found across 3 rounds

These shipped to production and affected real users. Treat as absolute rules.

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
- The page was 7100 lines — extracted to ~5500 via lazy-loaded tab components:
  - `PatrikaTab.tsx` (3400 lines) — lazy loaded
  - `SphutasTab.tsx` (664 lines) — direct import
  - `JaiminiTab.tsx` (728 lines) — direct import
  - `TransitRadar`, `ChartChatTab`, `LifeTimeline` — lazy loaded
- Module-level constants (HOUSE_THEMES, NARAYANA_SIGN_PROFILES, etc.) extracted from render path.
- Inline data structures inside `.map()` loops are a **critical performance bug** — always hoist to module level.

### Subscription Model (Current)
- **All features are FREE** — no paywall gates, no usage limits (except AI calls).
- AI calls restricted: `ai_chat` (2/day free), `muhurta_ai` (2/month free).
- PaywallGate component still exists but is not used on any page.
- Navbar "Upgrade" button removed. Pricing page still exists but is informational.

### Chart Components (Transit Overlay)
- `ChartNorth` and `ChartSouth` accept optional `transitData?: ChartData` prop.
- Transit planets rendered with distinct style: outlined dots, 65% opacity, smaller text.
- Only slow planets (Jupiter, Saturn, Rahu, Ketu) overlaid — fast planets change too quickly.

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
- Home page Framer Motion replaced with CSS animations (`animate-fade-in-up`, `stagger-children`)
- Heavy widgets lazy-loaded via `next/dynamic` with `ssr: false` (TodayPanchangWidget, TransitForecastWidget, EclipseAlert)
- Suspense boundaries around each dynamic widget with meaningful fallbacks
- `optimizePackageImports` for `framer-motion` + `lucide-react` in `next.config.ts`
- All 8 font families use `next/font/google` with `display: 'swap'`
- Server-side panchang computation using Vercel geo headers (eliminates client-side fetch waterfall for LCP)
- Home page panchang widget uses CSS stagger animations instead of framer-motion
