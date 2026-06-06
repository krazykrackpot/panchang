# Panchang — Vedic Astrology Web Application

## Definition of Done (non-negotiable)

Before claiming any task complete, ALL FIVE must be true:

1. `npx tsc --noEmit -p tsconfig.build-check.json` passes
2. `npx vitest run` passes (or new tests added for the change)
3. `npx next build` succeeds with zero errors
4. The change was **verified in the running browser** — click the button, fill the form, watch the UI respond. (Lesson ZB.)
5. **If touching astronomical/panchang/kundali computation**: spot-check at least 3 computed values against Prokerala or Shubh Panchang for the same date + location. (Lesson K.)

If you skipped any of the five, say so explicitly — never report "done" while a gate failed. For production-visible changes (auth, checkout, DB writes), also run `vercel logs` after deploy.

**NEVER say "verified" or "correct" about astronomical values without showing proof.** Show: (a) the actual computed output (run `npx tsx -e "..."` and paste), (b) the expected reference value (Prokerala / Drik / NASA), (c) side-by-side comparison. If you cannot produce both, say "NOT VERIFIED." Repeatedly violated: Adhika Ashadha (was Jyeshtha), Purnimant Chaitra (was Vaishakha), Ashtami month dates (should be Purnima).

Domain-specific test rules when touching:
- **auth**: signup + Google OAuth + email sign-in flows
- **payments**: checkout on both localhost AND dekhopanchang.com
- **API routes**: meaningful error messages (not generic "Something went wrong")
- **error handling**: independent operations in SEPARATE try/catch blocks — A failing must not skip B

## Domain & Location Assumptions

- **Inception year: 2026.** Do not default to 2024/2025.
- **No hardcoded locations.** Never assume Delhi/IST/India. User is in Corseaux/Vevey, Switzerland; app is global. Read from `stores/location-store` or birth form input.
- **Timezone from coordinates only** — never browser/OS timezone for kundali. Resolve IANA TZ from birth lat/lng.
- **No Drik Panchang references** in public/marketing content — compare against Prokerala/Shubh.
- Derive technical params from inputs (ayanamsha from user prefs, not hardcoded lahiri).

## Tech Stack

Next.js 16 (App Router, React 19, TS) · Tailwind v4 · Zustand · Zod · D3 + custom SVG · Framer Motion · Lucide + custom SVG icons (no emoji) · Supabase (Auth + Postgres + RLS) · Stripe (USD) + Razorpay (INR) · Resend · next-intl (9 visible locales: en/hi/ta/te/bn/gu/kn/mai/mr; `sa` retired) · Vercel · PWA (sw.js with CacheFirst/SWR/NetworkFirst).

Conventions: path alias `@/*` → `./src/*`. `Trilingual` type `{ en, hi, sa }`. Rashi IDs 1-based (1-12); Planet IDs 0-based (0=Sun..8=Ketu). Lahiri ayanamsa default; North Indian diamond chart with South toggle. Meeus algorithms (~0.01° Sun, ~0.5° Moon); all panchang within 1-2 min of reference. All computation server-side (route handlers); no external astrology APIs.

## Styling

- Tailwind v4 arbitrary classes (`bg-[#0a0e27]`, `from-[#2d1b69]/40`) are everywhere. **Never sed/regex across them** — a bracket double-escape broke 128 files; a `tl(`→`t(` regex broke 3,343 non-translation sites.
- Bulk TS edits: ts-morph/jscodeshift, OR dry-run 2-3 files + `npx next build` gate.
- `print-color-adjust: exact` preserves translucent gradients — verify on paper, not just DevTools.
- `invert(1)` behaves differently under Tailwind v4; test in browser.
- Framer Motion `ease` needs `as const` (`ease: 'easeInOut' as const`).

### Color palette (dark-mode only — no light theme)

| Token | Value | Usage |
|---|---|---|
| bg-primary | #0a0e27 | Page background (navy) |
| bg-secondary | #111633 | Cards (legacy flat) |
| gold-primary | #d4a853 | Primary accent |
| gold-light | #f0d48a | Headings, hover |
| gold-dark | #8a6d2b | Borders, subtle |
| text-primary | #e6e2d8 | Body text |
| text-secondary | #8a8478 | Labels, descriptions |

### Card gradient (use everywhere — NEVER `bg-bg-secondary` for new cards)

```
bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12
```

Hover: `hover:border-gold-primary/40`. Rounded: `rounded-2xl` (large), `rounded-xl` (small). Stronger variant: `from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27]`. Used across 30+ components.

### Dark-mode-native colours only

- Never `bg-red-50`, `bg-red-100` → use `bg-red-500/10`, `bg-red-500/20`.
- Never dynamic Tailwind classes (`` `text-${color}-600` ``) — Tailwind can't statically analyse.
- Prefer opacity tokens: `bg-gold-primary/15`, `border-gold-primary/20`. Use `text-gold-light` / `text-text-secondary` / `text-text-primary` — never hardcoded hex.

## Feature Integration (discoverability)

New features land in **primary navigation**, not buried in reference links or Quick Link tiles. Checklist when shipping a page/feature:

- [ ] Linked from navbar (top-level tools)
- [ ] Rendered inline on `/dashboard` (user-specific: saved charts, remedies)
- [ ] Added to learn landing REF_GROUPS (curriculum)
- [ ] In `/app/sitemap.ts` with multilingual alternates
- [ ] Cross-linked from related pages (kundali ↔ matching, panchang ↔ muhurat)

**An unlinked page is a dead page.** Broken twice (library, saved kundalis), both visibly frustrating.

**No dead clicks**: every clickable element does something visible. If functionality isn't ready, hide the button entirely OR show it disabled with explanation. Never: silent failures, buttons that do nothing, links that go nowhere.

## Database Migrations

Every schema change MUST have a numbered file in `supabase/migrations/` (`001_name.sql`, `002_name.sql`, …). Apply via `npx supabase db query --linked "SQL"`.

- All `auth.users` triggers: `SECURITY DEFINER`, `SET search_path = public`, `EXCEPTION WHEN OTHERS THEN RETURN NEW` (never block auth).
- INSERT triggers: `ON CONFLICT ... DO NOTHING` (idempotency).
- After trigger changes: verify signup (`curl -X POST .../auth/v1/signup`).
- RLS: users read own data; service_role manages everything.
- Never assume a column exists — verify schema first.

## Development Commands

```bash
npx next dev --turbopack    # Dev (port 3000)
npx next dev                # Webpack fallback if Turbopack loops/crashes
rm -rf .next                # Clear stale chunks
npx next build              # Verify before push
npx vitest run              # All tests
npx vitest run path/to/test # Specific file
npx supabase db query --linked "SQL"
vercel ls; vercel logs
```

Turbopack notes: if you see stale chunks, `MODULE_NOT_FOUND` for files that exist, or repeated OOM crashes — clear `.next` and use webpack mode.

## Git & Deployment

**NEVER commit directly to `main` during a work session.** Every push to `main` = ~9-min Vercel build. 20 small pushes = 180 min wasted.

1. `git checkout -b feat/<topic>` or `fix/<topic>` at session start.
2. Commit freely on the branch — local commits are free.
3. When the batch is tested → squash-merge to `main` → ONE build.
4. `gh pr create` for review, or merge directly for autonomous work.
5. `vercel-ignore-build.sh` already skips builds for docs/scripts/markdown-only.

```bash
git checkout main && git merge --squash feat/my-feature && git commit -m "feat: description"
git push origin main
```

### Deploy policy (2026-06-06 onward) — **on-demand prebuilt from laptop**

After 2026-06-05's session-long Vercel runner hang (Turbopack AND webpack
both hung silently on a 4-core/8GB Vercel runner that local builds finished
in ~3 min), all production deploys now build locally and upload the
prebuilt artifact via `vercel deploy --prebuilt`. Vercel's runner is
bypassed entirely. No automatic deploys.

```bash
npm run deploy          # full path: vitest → vercel pull → vercel build --prod → vercel deploy --prebuilt --prod
npm run deploy:fast     # skip vitest (use only when you've JUST run it)
```

The `--prebuilt` flag tells Vercel "I already built this, just register
the routes." Confirmed via the deploy log: `Using prebuilt build artifacts
from .vercel/output`. Total time-to-prod ~10-15 min (3 min local build +
3 min upload of ~1GB compressed + ~7 min Vercel-side extract/register).

What's disabled:
- `.github/workflows/daily-deploy.yml` → renamed to `.disabled`. No more
  daily auto-deploy at 06:00 UTC. Deploys happen only when you run
  `npm run deploy`.
- The `[deploy]` commit-message marker still works (the
  `vercel-ignore-build.sh` script still respects it), but it's now an
  *escape hatch* not the primary path. The primary path is `npm run deploy`.

After deploy: `vercel ls` → confirm Ready → test auth/checkout/modified
endpoints → `vercel logs` for runtime errors.

## Environment Variables

- **Always `.trim()` env vars** in API routes — Vercel values can have trailing newlines/whitespace.
- Never hardcode secrets; use `process.env.VAR_NAME`. Test locally then verify on Vercel.
- Required in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_PRO_MONTHLY/ANNUAL`, `STRIPE_PRICE_JYOTISHI_MONTHLY/ANNUAL`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`.

## Auth Conventions

- Supabase client MUST have: `detectSessionInUrl: true`, `persistSession: true`, `storageKey: 'dekho-panchang-auth'`.
- Google OAuth returns via URL hash — client auto-exchanges.
- Email signup requires confirmation (Resend SMTP).
- Existing-account detection: `user.identities.length === 0` on signup response.
- API routes authenticate via `Authorization: Bearer <token>` header.

## Code Conventions

- `'use client'` only when needed for interactivity/browser APIs.
- API routes in `src/app/api/` (route handlers).
- No emoji icons — use SVG icon system.
- Inline `LABELS` objects for page-specific i18n (not locale files).
- All new pages support every visible locale.
- New page = integrate it: navbar (top-level), learn landing REF_GROUPS (learn/reference), modules index (curriculum), sitemap, cross-links. An unlinked page is a dead page.

## i18n Conventions (next-intl)

- **Namespaces**: `pages.*`, `components.*`, `learn.*` defined in `src/lib/i18n/request.ts`. Files: `src/messages/{locale}/{global,pages,components,learn}.json`.
- Always `useTranslations('ns')` / `getTranslations('ns')`. No inline `lt()` for strings, no `{ en, hi, … }` for translatable strings, no `locale === 'xx' ? … : …` ternaries.
- Add new string to `en/pages.json` FIRST, then propagate to every locale. Run `python3 scripts/check-locale-parity.py`.
- Verify every locale has a namespace before committing: `grep -l "panchangInline" src/messages/*/pages.json` — must return 10 matches.
- Never regex/sed `t(...)` calls (Lesson H).
- 9 visible locales (en/hi/ta/te/bn/gu/kn/mai/mr); `sa` retired (301 → /en/). Regional values may fall back to en/hi — but **the key must exist**.

## Testing

- Vitest. Files in `src/lib/__tests__/*.test.ts` and co-located `*.test.ts`.
- Run before pushing: `npx vitest run`. Pre-push hook runs tsc — if it fails, fix it, don't bypass.
- For large changes (features, refactors, multi-file edits): augment existing tests or write new ones.
- Regression suites cover: auth config, checkout env trimming, panchang accuracy vs Prokerala/Shubh, vedic time, signup trigger safety.
- Panchang accuracy target: within 2 min of reference for all elements.

## Agent Behaviour

- **No permission-asking for execution**: read/write/run/edit. The task IS the permission. Make the best decision when ambiguous and document it. DO prompt for design decisions when multiple valid approaches exist ("modal vs page?") — that's collaboration, not permission-asking.
- **Completion standard**: built, tested, browser-verified, pushed. No half-styled components, missing hover states, or broken responsive layouts.
- Self-review every design section with fresh eyes; address gaps in the same message.
- Prefer editing existing files over creating new ones.
- Explore code first when asked for analysis; save task lists for multi-step work; grep ALL references after refactoring.

---

# Lessons from real incidents

Hard rules from bugs that shipped. Non-negotiable.

## A–J: April 2026

- **A. Never silently swallow errors.** Destructure `{ data, error }`, branch on `error`, log `console.error('[module] X failed:', err)`, surface to user.
- **B. Single source of truth.** Two paths loading "the same thing" → share one loader.
- **C. Link-to-destination contracts explicit.** Mount effects that read local state must check URL first; comment precedence.
- **D. Unlinked pages are dead.** Integrate the moment it's built.
- **E. Document library limits at the call site.** Guard or comment the quirk. Never `setTimeout` as a substitute for a readiness event.
- **F. Loading state always terminates.** Every fetch branch (including early returns) sets loading=false.
- **G. User writes idempotent.** Dedupe by natural key (trimmed lowercase name + date + time + lat/lng rounded to 4dp).
- **H. Never bulk find/replace with regex/sed.** Use AST tools, or dry-run 2-3 files + `npx next build` gate. If you MUST regex: print match count + 5 samples + get confirmation.
- **I. Translation migration verifies both sides.** Grep new keys against every locale JSON. Configure next-intl `onError`.
- **J. Locale fallback non-negotiable.** Render English when missing — never `undefined` or key path.

## K–DD: Full audit (Apr 24, 2026) — 63+ bugs, 6 rounds

- **K. Verify every astronomical value against a reference.** Purnimant was computed as Full Moon - 15 fixed days; actual interval varies 13.9–15.6d → months started on Ashtami. Spot-check 3 dates vs Prokerala/Shubh before shipping any astro computation. Never fixed-interval lunar approximations — the Moon's orbit is elliptical.
- **L. Never `new Date()` without explicit UTC.** Local-time constructor interprets args in the server's TZ. Use `new Date(Date.UTC(y, m-1, d, h, m))` or `.getTime() + ms`. Grep `new Date(` in any computation file before shipping; every instance is `Date.UTC` or has a justifying comment.
- **M. Same data, same source.** Daily panchang masa came from solar `getMasa()` (Sun's sign), festivals used lunar month boundaries → users saw different months on different pages, Adhika Masa missing from daily view. Both paths must call one function.
- **N. Trace the FULL data flow before fixing.** BirthForm "Edit" bug took 2 attempts — first guess added a missing field; the real cause was a `useEffect` overwriting form data, one scroll away. Map: trigger → state → effects → renders. Find useEffects that stomp on the state you're inspecting.
- **O. Weekday formula: `Math.floor(jd + 1.5) % 7` = 0=Sunday** (matches `Date.getUTCDay()`). KP ruling planets shifted by a day from 0=Monday assumption; muhurta had the same. Always comment: `// 0=Sun, 1=Mon, ..., 6=Sat`.
- **P. Fractional years = millisecond arithmetic.** `Math.floor((years % 1) * 12)` months and `setFullYear/setMonth` truncate; over 12+ dasha periods dates drift by months. Only correct: `new Date(date.getTime() + years * 365.25 * 24 * 60 * 60 * 1000)`.
- **Q. Shared constants live in one file.** Pushkar Bhaga degree tables existed twice with different values. All Jyotish constants → `src/lib/constants/`. Grep before creating.
- **R. Midnight-crossing time ranges need wrap-aware compare.** `if (end < start) return now >= start || now < end;`. Three separate "NOW" badge bugs from this. When fixing a pattern bug, grep entire codebase; fix all instances in one commit.
- **S. Canonical BPHS tables defined once and cross-checked everywhere.** Naisargika Maitri existed in 16 files; 5 had errors (Moon-Jupiter "friend" in ashta-kuta vs "neutral" in 11 others; Mercury's friends `[Sun,Moon,Jup,Ven,Sat]` in one but `[Sun,Venus]` in 11). Trusting one file made it worse. Before changing ANY Jyotish constant: grep across entire codebase, count files that agree, align ALL in one commit. The majority reading is almost always right; a single outlier is the bug.
  - **Moon friends**: Sun, Mercury. NOT Jupiter. (BPHS Ch.3)
  - **Moon enemies**: NONE.
  - **Jupiter enemies**: Mercury, Venus. NOT Saturn (Saturn is neutral).
  - **Mercury friends**: Sun, Venus. Not Moon/Jupiter/Saturn.
- **T. Yoga detection = #1 false-positive source.** Four bugs shipped at once: Vasumati `.some()` not `.every()` → 79% trigger rate; Mahabhagya checked lagna LORD's sign instead of lagna SIGN; Gauri reversed aspect direction + KENDRA union → 50% false-positive; Kemadruma missed conjunction cancellation. After writing detection, compute expected frequency: "rare" yoga triggering >20% on random charts = bug. Gajakesari ~25% and Chandra-Mangala ~8% are naturally common; Raja Yogas 5–15%; Mahapurusha <10%. Aspect direction: `houseOffset(FROM, TO)` — Jupiter aspects houses 5/7/9 FROM Jupiter, not from the target.
- **U. Moolatrikona ranges = BPHS Ch.4 exactly.** Moon was Taurus 3-30° in one file and 0-3.33° in another; correct is 4-20°. Canonical:
  - Sun Leo 0-20° · Moon Taurus 4-20° · Mars Aries 0-12°
  - Mercury Virgo 16-20° · Jupiter Sagittarius 0-10°
  - Venus Libra 0-5° · Saturn Aquarius 0-20°
- **V. JD ↔ Date conversion uses `Date.UTC()`.** `jdToDate()` used `new Date(year, month-1, day)` → on UTC+2, JD noon UT on Apr 24 produced Apr 23 22:00 UTC. Specific case of L; `jdToDate()` is called from dozens of places.
- **W. Ketu's speed = Rahu's speed (NOT negated).** Both move retrograde at ~0.053°/day. Negating gave Ketu positive speed → UI showed Ketu as non-retrograde + broke downstream speed-sign consumers. Deriving one body from another: transform position only, not velocity, unless physical reason.
- **X. Combustion orbs reduce when Mercury/Venus retrograde** (Mercury 14°→12°, Venus 10°→8°, per BPHS). `computeCombust()` accepts `isRetrograde`; all call sites pass it.
- **Y. Graha Yuddha winner = higher NORTHERN latitude.** `p1.latitude >= p2.latitude ? p1 : p2` — NOT `Math.abs()`. Per BPHS Ch.3 and Surya Siddhanta.
- **Z. Never change a Jyotish constant without grepping the entire codebase.** Moon-Jupiter was correct (neutral) in 11 files; I trusted one audit, changed it, had to revert after the wrong value was live (Ashta Kuta matching was wrong in that window). If audit claims X but 11 files say otherwise, the audit is wrong. Change ALL files in one commit or change NONE.
- **ZA. Same data renders from ONE component.** 5 panchang cards lived as inline JSX in `PanchangClient.tsx` AND a generic loop in `TodayPanchangWidget.tsx` → fixed one, the other stayed broken (3 rounds of user frustration). Extract shared components; after a display bug, grep for the pattern app-wide and fix all in one commit.
- **ZB. "Type-checks + tests pass" ≠ "works."** Yoga card showed "Ganda" with Shula's time range; visible the instant you opened the page. Every UI change verified in browser before "done." If you cannot browser-test, say so explicitly — never claim complete.
- **ZC. Festival defs use Amant month names — match against `.amanta`.** Generator matched `.purnimanta` while defs used Amant (Prokerala/Drik convention) → during Krishna Paksha, Purnimant is one month ahead → Diwali 30d early, Dussehra 11d early. When adding festivals, verify against Prokerala.
- **AA. API routes log errors AND validate inputs.** Six routes had `catch {}` returning error JSON without logging → undebuggable in prod. `/api/kundali` lacked date/time validation; `/api/transits` didn't validate year; `/api/varshaphal` didn't check timezone. Every catch: `console.error('[route-name] error:', err)` BEFORE the response. Validate format (regex for dates/times) and range (month 1-12, hour 0-23) before computation. Error responses don't leak internal details.
- **BB. Muhurta scoring checks ALL classical inauspicious periods.** Vishti/Bhadra karana, Panchaka (Moon in nakshatras 23-27), sthira karanas (Shakuni/Chatushpada/Naga), Rahu Kaal, Yamaganda, Gulika, inauspicious yogas, Abhijit availability (not Wednesdays). When adding muhurta activity, verify all checks are inherited from base scorer.
- **CC. `useEffect` auto-fill guarded against edit mode.** BirthForm had an effect that overwrote `initialData` with the logged-in user's profile. Any auto-fill effect must check `initialData` and skip if editing existing data.
- **ZD. ISR-cached pages MUST NOT mount clients reading `new Date()` / `todayInTimezone()` at render time.** 2026-05-28, ~80% pageview collapse over 12h: `/choghadiya/[date]`, `/gauri-panchang/[date]`, `/career-muhurta(/[activity])` all embedded `'use client'` components computing "today" in render body or `useMemo`. Server pre-rendered at T1; browser hydrated at T2; when T1 and T2 straddled a day boundary → React #418 hydration mismatch → React killed the tree → analytics events (Vercel Web Analytics, GA, Plausible) silently stopped. Dashboards showed "fewer visitors," not a JS error.

  Rule: a `'use client'` component MUST NOT call `new Date()` / `Date.now()` / `todayInTimezone()` in its render body (top-level JSX, `useMemo` factories, `useState` initialiser, JSX IIFEs) when mounted inside an ISR-cached server page. Restrict those calls to `useEffect`, event handlers, or `useCallback`. SSR text must be byte-identical to hydration text.

  Acceptable patterns when "today" is genuinely needed:
  1. **Remove the mount.** If the parent SSR page already renders the URL date's slots, drop the client embed — it was a duplicate "today" widget (PR #267, #269).
  2. **`export const dynamic = 'force-dynamic'`** removes ISR cache; SSR + hydration agree within ms (PR for `/career-muhurta`).
  3. **`useState<...>([])` + `useEffect` fill** — brief skeleton, no mismatch.

  **Two-layer gates:**
  1. Static auditor `scripts/audit-isr-hydration.ts` walks every ISR `page.tsx`, resolves imported clients, flags render-scope `new Date()` / `Date.now()` / `todayInTimezone(`. Pre-commit + CI; uses baseline `scripts/audit-isr-hydration.baseline.json` (only NEW violations block). Shrink baseline as you fix: `npx tsx scripts/audit-isr-hydration.ts --update-baseline`.
  2. Runtime crawler `e2e/isr-hydration-crawl.spec.ts` (Playwright) — fails on pageerror or hydration-shaped console errors. Do NOT delete/skip either gate to make a PR pass.

  When adding `export const revalidate = N`: run auditor once before commit. When adding a render-time clock call: grep for which server pages import the component; verify none are ISR-cached.
- **DD. Meeus has known accuracy limits.** Jupiter retro stations ~40d late, Saturn ~13d late vs Swiss Ephemeris. When Meeus fallback is active (no Swiss), push a warning to `KundaliData.warnings[]` and surface to users.

## Stripe webhooks (post-incident 2026-05-25)

- **Webhook URLs MUST NEVER contain `www.`.** Vercel 308-redirects `www.dekhopanchang.com` → apex; Stripe doesn't follow redirects (POST body dropped). May 22 incident silently broke every delivery for 3 days; caught only via Stripe's "endpoint failing" email. Use apex: `https://dekhopanchang.com/api/webhooks/stripe`.
- **Audit before each Stripe-stack change**: `STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/audit-stripe-webhooks.ts`. Flags `www.`, non-HTTPS, disabled endpoints, duplicate subscriptions.
- One signing secret per endpoint. Rotate secret + Vercel env in the SAME commit window — drift means every signed delivery fails verification.
- Multiple endpoints on the same event is allowed (Brihaspati's `/api/brihaspati/webhook/stripe` and main `/api/webhooks/stripe` both subscribe to `checkout.session.completed`). Each handler filters by `session.mode` and `session.metadata.*`.
- `process.env.*` in route handlers reads at runtime, not build — webhook secret updates take effect immediately.

---

# Hard rules

## Never duplicate logic or constants

Before writing ANY constant table, computation function, or detection logic:

1. **GREP FIRST**: `grep -rn "CONSTANT_NAME" src/lib/`. If it exists, import — do NOT create a local copy.
2. **Canonical constant files** (always import from these):
   - Dignities (exalt/debilit/moolatrikona/sign lords): `src/lib/constants/dignities.ts`
   - Planet data: `src/lib/constants/grahas.ts`
   - Nakshatra data: `src/lib/constants/nakshatras.ts`
   - Rashi data: `src/lib/constants/rashis.ts`
   - Inauspicious orders (Rahu, Yama, Gulika): `src/lib/muhurta/inauspicious-periods.ts`
3. **Canonical engines** (never reimplement):
   - Tithi / Yoga / Karana: `src/lib/ephem/astronomical.ts`
   - Doshas (Manglik, Kaal Sarpa, Pitru): `src/lib/kundali/tippanni-engine.ts` → `generateTippanni()`
   - Rahu Kaal: `src/lib/ephem/astronomical.ts` → `calculateRahuKaal()`
   - Hora: `src/lib/hora/hora-calculator.ts` → `calculateHoras()`
4. New constant not yet defined → create it in `src/lib/constants/`. Never inline in a feature file.
5. Tech debt log: `docs/tech-debt/duplicate-code-audit.md`.

Origin: 12+ copies of EXALTATION, 40+ copies of PLANET_NAMES, duplicate dosha detection producing different answers for the same chart. Every duplicate is a future bug.

## Pre-ship checklist (computation code)

```
□ Grep `new Date(` — all Date.UTC or justified comment (L, V)
□ Grep `[locale]` in TSX — all use tl() or || .en fallback (J)
□ Grep the constant in other files — no diverging duplicates (Q, S, Z)
□ Time ranges: midnight wrap? (R)
□ Weekday logic: 0=Sunday comment? (O)
□ Dasha periods: millisecond arithmetic? (P)
□ Festivals: `.amanta` (not `.purnimanta`)? (ZC)
□ Muhurta: ALL inauspicious periods (Vishti, Panchaka, sthira karana, Rahu Kaal, Wednesday Abhijit)? (BB)
□ API routes: catch blocks log? Inputs validated? (AA)
□ Auto-fill forms: guarded against edit mode (initialData)? (CC)
□ Yoga detection: expected frequency — >20% for a "rare" yoga = bug (T)
□ Spot-check 3 computed values vs Prokerala for the same date + location (K)
□ npx vitest run · npx tsc --noEmit · browser test (Definition of Done)
```

---

# Subsystems & patterns

## Patterns

- **Trilingual safety**: ALWAYS `tl(obj, locale)` from `@/lib/utils/trilingual.ts`. Never `obj.name[locale]` — non-en returns `undefined` and crashes. `tl()` falls back to `.en`. Pattern: `tl(panchang.tithi.name, locale)`.
- **Service worker (sw.js)**: clone response BEFORE async cache put — `var clone = res.clone(); caches.open(n).then(ca => ca.put(r, clone));`. Never `res.clone()` inside an async `.then()` — body may be consumed. Bump cache version (`dp-v2`, `dp-v3`) after any SW change.
- **Panchang time windows (Varjyam, Amrit Kalam)**: filter against sunrise → next-sunrise bounds — windows from yesterday's nakshatra can fall before today's sunrise.
- **Choghadiya/Hora conflict**: Varjyam and Rahu Kaal override auspicious slots; display amber ⚠. Overlap test: `startA < endB && startB < endA`.
- **Kundali page**: lazy tabs `PatrikaTab`, `TransitRadar`, `ChartChatTab`, `LifeTimeline`; direct `SphutasTab`, `JaiminiTab`. Hoist inline data structures out of `.map()` loops — critical perf bug otherwise.
- **Subscription model**: all features FREE. AI gated: `ai_chat` 2/day, `muhurta_ai` 2/month. PaywallGate exists, unused.
- **Chart transit overlay**: `ChartNorth`/`ChartSouth` accept `transitData?: ChartData`. Only slow planets (Jup/Sat/Rahu/Ketu) overlaid.
- **Performance**: heavy widgets via `next/dynamic` `{ ssr: false }` with Suspense fallbacks. `optimizePackageImports` for `framer-motion` + `lucide-react`. Fonts via `next/font/google` `display: 'swap'`. Server-side panchang via Vercel geo headers; home page uses CSS stagger animations (no framer-motion).

## SEO checklist for new pages

1. Add route to `PAGE_META` in `/lib/seo/metadata.ts`
2. Create `layout.tsx` with `generateMetadata` using `getPageMetadata()`
3. JSON-LD for tool pages (`generateToolLD()` + `generateBreadcrumbLD()`)
4. Add to `/app/sitemap.ts` with multilingual alternates
5. Private pages: `robots: { index: false }`
6. Sensitive: add to `robots.txt` disallow (dashboard, embed, settings)

## Email

Daily panchang email: cron at 00:30 UTC via Vercel Cron. Uses `user_profiles.daily_panchang_email`. Falls back to birth location if panchang location not set. Template: `/lib/email/templates/daily-panchang.ts`.

## Kundali snapshot architecture (no parallel paths)

Single source of truth: `GET /api/user/profile` auto-recomputes if stale.

- **Server routes** → `getFreshSnapshot()` from `src/lib/supabase/get-fresh-snapshot.ts`. NEVER query `kundali_snapshots` directly.
- **Client pages** → `useFreshSnapshot()` from `src/lib/supabase/get-fresh-snapshot-client.ts`. NEVER query `kundali_snapshots` directly.
- **Cron jobs** may read directly but MUST check `isSnapshotStale()` and skip/flag.
- `ENGINE_VERSION` (`src/lib/kundali/engine-version.ts`) auto-generated at build from a hash of 22 computation-pipeline files; any calc change auto-recomputes stale snapshots on next access. After editing pipeline files locally: `npx tsx scripts/compute-engine-hash.ts` (build does this automatically).

## Static page budget (~9,000 max)

Beyond ~9K: builds exceed 10 min or stack overflow. Earlier 4-locale cap was reverted May-25 because dropping Maithili (`mai`) silently demoted `/mai/*` to cold-ISR — ranking model deprioritised, lost 60%+ clicks (Maithili = #1 traffic via `/mai/choghadiya/<date>`).

**Routes MUST return `[]` from `generateStaticParams`** (use ISR):

- `horoscope/[rashi]/[date]`, `horoscope/[rashi]/weekly`, `horoscope/[rashi]/monthly`
- `calendar/[slug]`
- `choghadiya/[date]`
- `muhurta/[type]/[year]/[month]/[city]`
- `panchang/[city]` (800+ cities)
- `festivals/[slug]/[year]`, `festivals/[slug]/[year]/[city]`

`[locale]/layout.tsx` returns ALL 9 `visibleLocales` from `src/lib/i18n/config.ts` — `['en','hi','ta','te','bn','gu','kn','mai','mr']`.

**If a PR adds params back to any must-be-empty route, the build WILL fail.** Reverted 3 times by merges. Re-check after every merge. (Audit 2026-05-25 §D12.)

## Pandit CRM (Jun 2026, big-bang merge)

Optional second persona on top of seeker dashboard. Gated by `user_profiles.account_type='pandit'`. All Pandit surfaces (roster, client detail, alerts inbox, calendar, settings) live under `/dashboard/*`, hidden from seekers via per-route layout guards.

### Two-axis lifecycle (on `pandit_clients`)

- **`link_state`** (platform relationship): `unlinked → invited → linked` (forward), `linked → paused` (recoverable), `unlinked → declined` (terminal). Cap counts `unlinked + invited`; `linked + paused + declined` do NOT count.
- **`engagement_state`** (Pandit's treatment): `prospect | active | past | archived`. Independent of `link_state`.

When changing client-state logic, ask which axis you're touching. Mixing them creates UX confusion ("archived" ≠ "declined").

### Cap enforcement — single source of truth

`FREE_TIER_UNLINKED_CAP = 5` lives in `src/lib/pandit/subscription.ts` AND migration-055 trigger function (`k_free_cap`). Keep in sync in the SAME commit when changing. Banner copy, paywall modals, and Add-Client form all `import { FREE_TIER_UNLINKED_CAP }` — NEVER hardcode "5" (memory rule `feedback_no_hardcoded_counts`).

DB-layer enforcement: `enforce_pandit_unlinked_client_cap()` (BEFORE INSERT OR UPDATE OF link_state). API routes detect `pandit_cap_exceeded:` prefix → return HTTP **402** (client pops paywall). Trigger takes `pg_advisory_xact_lock(hashtextextended(pandit_user_id::text, 0))` before counting — without this, two concurrent inserts each saw pre-insert count and slipped a 6th client past the cap (race fix migration 056).

### Payments

Pandit tiers (`pandit_pro`, `pandit_unlimited`) on the SAME `subscriptions` table as seeker tiers (CHECK constraint admits all 5). Main webhook already trusts `pending_checkouts.tier` (server-bound) → NO webhook changes needed; just constraint relax in migration 055 and a new `/api/pandit/checkout` writing the binding row.

Stripe redirect URLs MUST carry locale prefix (`/{locale}/dashboard/settings`). Both `/api/pandit/checkout` and `/api/pandit/billing-portal` accept `locale` body field validated against 9-locale whitelist (defaults `en` on unknown values — prevents open-redirect via crafted locale).

### Invitation

`POST /api/pandit/clients/[id]/invite` is the ONLY path creating `pandit_client_invitations` rows. **Refuses with 409 if `parent.link_state IN ('linked', 'paused')`** — previous bug silently flipped a linked client back to 'invited', severing the active link.

Email → user_id resolution is **deferred to accept-time**. Do NOT re-introduce a paginated `admin.listUsers` walk at invite-time (up to 50 sequential HTTP requests per invitation). Accept route backfills `invited_user_id` from authenticated user's token.

Accept AND decline use the SAME match logic:
```ts
if (invitation.invited_user_id !== null) {
  isMatch = invitation.invited_user_id === user.id;            // EXACT — no email fallback
} else {
  isMatch = userEmail === invitation.invited_email.toLowerCase(); // Branch B
}
```
The OR-clause shortcut (allowing email fallback when `invited_user_id` is set) is a security bug — lets a coincidentally-matching email accept on behalf of a different account.

### Alerts cron

`fires_at` is the date the alert is meant to FIRE, NOT the underlying event date. Birthday T-7d reminder uses `fires_at = birthday - 7d`; day-of uses `fires_at = birthday`. Otherwise unique `(client_record_id, kind, fires_at)` silently drops the second upsert.

Sade_sati alerts: `fires_at = today` (accurate UX) + per-client 30-day lookback strips candidate if any unacked sade_sati_* alert exists for that client. Do NOT align `fires_at` to fixed-period Unix-epoch boundaries — that makes the Pandit's calendar display detection dates up to 30 days in the past.

### GDPR export

`GET /api/pandit/clients/[id]/export` returns the full client bundle. Every child-table query uses BOTH `client_record_id` AND explicit `pandit_user_id` filter — defence-in-depth against RLS regressions. `_partial_errors` surfaces section names only; raw DB error text stays server-side. Filename sanitised from `full_name`.

### Deliverable seen-at invariant

`pandit_deliverables.client_seen_at` is **immutable once set** — guaranteed by migration-057 BEFORE UPDATE trigger `preserve_first_seen_at`. Any overwrite (including direct SQL) is silently coalesced to the original value. Seeker timeline reads this as "first viewed on…" and depends on it being the FIRST view, not the latest.

### Branch model

Long-lived `feat/pandit-crm` developed against real Supabase + Stripe test mode. Big-bang squash-merge to `main` per the user's explicit directive. 11 phases (P1–P11) plus P12 (E2E QA + merge prep) before squash.
