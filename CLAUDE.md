# Panchang - Vedic Astrology Web Application

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
npx next build               # Production build (verify before push)
npx vitest run               # Run all tests
npx vitest run src/lib/__tests__/auth-regression.test.ts  # Specific test file
npx supabase db query --linked "SQL"   # Run SQL on live Supabase
vercel ls                    # Check deployment status
vercel logs                  # View production logs
```

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
- All panchang values verified within 1-2 min of Drik Panchang
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
- Regression tests cover: auth config, checkout env trimming, panchang accuracy vs Drik, vedic time, signup trigger safety
- Panchang accuracy target: within 2 min of Drik Panchang for all elements

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
