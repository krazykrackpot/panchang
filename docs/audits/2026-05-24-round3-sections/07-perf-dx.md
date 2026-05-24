# Performance / DX / Build Hygiene Audit — Round 3 — 2026-05-24

Sixth audit on the worktree, performance / DX / build-hygiene lens. Sourced from inline reads at HEAD `b4cd2720` (post Sprint 18–25). Prior Round 1/2 audits did NOT explicitly cover this domain; this fills the gap.

Hunt domains: N+1 query patterns, serial awaits, bundle weight in client components, dead deps, dead exports, dead pages, stale localStorage keys, dead i18n message files, hardcoded URLs, `as any` casts, ESLint disables, console.log noise, TODO/FIXME debt, `force-dynamic` overreach, missing CDN headers, test isolation, file/migration vestiges.

Numbering: `R3-DX-1 …`.

**Total: 22 findings — P1: 8 · P2: 11 · P3: 3.** No P0 in this lens — perf bugs degrade UX, they don't ship wrong data. Each P1 ships a measurable cost in either function-time, bundle bytes, or developer-time.

Top 3 by impact (TL;DR):
1. **R3-DX-2** — `/api/cron/email-alerts` and `/api/cron/weekly-digest` issue **3 sequential queries per user** (`user_profiles` SELECT + `auth.admin.getUserById` + dedup SELECT). At ~50 users this is a few seconds; at 500+ users it blows through the 30s cron `maxDuration` window and silently truncates the send list.
2. **R3-DX-5** — Four heavy client components (`PanchangClient.tsx`, `calendar/Client.tsx`, `YogasTab.tsx`, `NakshatraShareButton.tsx`) statically import constants files totalling **~1.5 MB** of JSON-as-TS (festival-details 426 KB + nakshatra-details 283 KB + yoga-details 229 KB + muhurtas 141 KB), all shipped to the browser on every page they're on. None are tree-shaken because `import { X } from 'big-file'` only narrows the symbol, not the file.
3. **R3-DX-3** — `getUpcomingFestivals` in `generate-notifications` cron is OK now (extracted from the loop in Sprint 21), but `/api/cron/weekly-digest:125` still calls `generateFestivalCalendarV2(year, lat, lng, tz)` **once per user** in the loop. Festival generation is multi-second CPU work; with 100 users on the digest list this is several minutes of unnecessary compute, and the per-user lat/lng variation is at best a 1-day shift in festival date.

---

## P1 findings

### R3-DX-1 — `transit-alerts` cron N+1: dedup SELECT runs per user

- **File:** `src/app/api/cron/transit-alerts/route.ts:109-152`
- **Severity:** P1
- **Evidence:** Outer loop over `snapshots` (all users). For each user: `supabase.from('user_notifications').select('metadata').eq('user_id', snap.user_id).eq('type', 'transit_alert').gte('created_at', sevenDaysAgo)` (one SQL roundtrip per user).
- **Why it's a bug:** At N users the cron makes 1 + N queries when it could make 2: one SELECT scoped `.in('user_id', userIds).eq('type', 'transit_alert').gte('created_at', sevenDaysAgo)` followed by an in-memory bucket by `user_id`. Same correctness, same dedup window, one query instead of N.
- **Cost shape:** ~50 ms × N queries → at 200 users ≈ 10 s of pure network latency in a 30 s `maxDuration` window. Will silently drop alerts once the budget burns through.
- **Fix sketch:** Hoist the SELECT before the loop with `.in('user_id', userIds)`, build a `Map<user_id, Set<planetId>>` of existing alerts, then check the map inside the loop.

### R3-DX-2 — `email-alerts` and `weekly-digest` issue 3 queries per user

- **Files:**
  - `src/app/api/cron/email-alerts/route.ts:44-60` (profile + getUserById + 2× notification SELECTs per user)
  - `src/app/api/cron/weekly-digest/route.ts:50-62` (profile + getUserById per user)
- **Severity:** P1
- **Evidence:**
  ```ts
  for (const snap of users) {
    const { data: profile } = await supabase.from('user_profiles').select(...).eq('id', snap.user_id).maybeSingle();
    const { data: { user: authUser } } = await supabase.auth.admin.getUserById(snap.user_id);
    // ... + dedup SELECT(s) in email-alerts inner branches
  }
  ```
- **Why it's a bug:** Same N+1 shape as R3-DX-1, but **three** queries per user, one of which is `auth.admin.getUserById` (separate API surface — not subject to the same connection pool).
- **Cost shape:** ~3 × 80 ms × N. At 100 users this is 24 s in a 30 s budget. At 200 users it overruns and Vercel cuts the cron mid-stream — partial sends, no error visibility on the truncation.
- **Fix sketch:** Hoist `user_profiles` SELECT with `.in('id', userIds)`; hoist `auth.admin.listUsers({ page, perPage })` paginated like `daily-panchang/route.ts:55-70` already does; build two Maps and look up inside the loop.

### R3-DX-3 — `weekly-digest` recomputes `generateFestivalCalendarV2` per user

- **File:** `src/app/api/cron/weekly-digest/route.ts:121-130`
- **Severity:** P1
- **Evidence:**
  ```ts
  for (const snap of users) {
    // ...
    const festEntries = generateFestivalCalendarV2(thisYear, festLat, festLng, festTz);
    // ... filtered to upcoming 7 days
  }
  ```
- **Why it's a bug:** Festival generation walks the whole year of tithi-table + festival defs and rejects 358 days to keep 7. The lat/lng/tz argument variation barely shifts a date — for the 7-day upcoming-week filter, the variation is below the day boundary in almost every case.
- **Cost shape:** Festival calendar generation is ~50–200 ms (1 year). At 100 users in the digest list this is 5–20 s of pure compute *per cron run*.
- **Fix sketch:** Hoist `generateFestivalCalendarV2(thisYear, 28.6, 77.2, 'Asia/Kolkata')` outside the loop (same default the `generate-notifications` cron uses since Sprint 21). If per-location accuracy is actually needed, group users by timezone first and compute once per timezone.

### R3-DX-4 — Synthesis loop in `/api/tippanni` runs three sections serially when they're independent

- **File:** `src/app/api/tippanni/route.ts:258-351`
- **Severity:** P1
- **Evidence:** Three sequential `await Promise.all(…)` blocks: planet insights → yogas → doshas. Each block parallelises within itself but waits for the prior block to finish before starting.
- **Why it's a bug:** No data flow between sections (they don't share state, each section reads from `baseTippanni` and writes a section variable). They could run as one outer `Promise.all([planetsWork, yogasWork, doshasWork])`, cutting wall-clock LLM time by ~3× when all three are enabled.
- **Cost shape:** This is the path behind the Tippanni AI button; current wall-clock ~6–9 s could become ~2–3 s.
- **Fix sketch:** Wrap each section in an `async () => {…}` IIFE and `await Promise.all([sectionA, sectionB, sectionC])` at the end. The shadowed `enhancedPlanets/Yogas/Doshas` variables become destructured tuple returns.

### R3-DX-5 — Massive constants files shipped to client bundles

- **Files (client components statically importing huge constants):**
  - `src/app/[locale]/calendar/Client.tsx:37` imports `FESTIVAL_DETAILS` (~426 KB) — `'use client'`
  - `src/app/[locale]/panchang/PanchangClient.tsx:27` imports `NAKSHATRA_DETAILS` (~283 KB) — `'use client'`
  - `src/app/[locale]/panchang/PanchangClient.tsx:26` imports `MUHURTA_DATA` (~141 KB) — `'use client'`
  - `src/components/kundali/YogasTab.tsx:8` imports `YOGA_DETAIL_DATA` (~229 KB) — `'use client'`
  - `src/components/shareable/NakshatraShareButton.tsx:6` imports `NAKSHATRA_DETAILS` again
  - `src/components/kundali/LayeredCommentary.tsx:6` imports `YOGA_DETAIL_DATA` again
- **Severity:** P1
- **Evidence:** `find src/lib/constants -size +50k -type f -name "*.ts"` confirms file sizes; `'use client'` directive on top of consumer files confirms bundle inclusion.
- **Why it's a bug:** Tree-shaking can drop *unused exports*, but each of these files exports a single giant object (`FESTIVAL_DETAILS`, `NAKSHATRA_DETAILS`, etc.) consumed wholesale. The entire data file is pulled into the route's client JS chunk. Slim total: ~1.5 MB of static data shipped to the browser on calendar/panchang/kundali landings.
- **Fix sketch:** Three options, pick by route urgency:
  1. **Server-side prop pass** — move the constant import to the server component wrapper (`page.tsx`), select only the entries needed for the current view (e.g. today's nakshatra), pass to `'use client'` as a prop. Drops 280+ KB from PanchangClient.
  2. **JSON fetch** — convert constants to `public/data/*.json` and fetch on demand; lets HTTP cache hold the payload across visits.
  3. **Lazy code-split** — wrap consumer with `next/dynamic` so the constant doesn't enter the route's initial chunk.

### R3-DX-6 — `@anthropic-ai/sdk` is in devDependencies but imported by 3 production code paths

- **Files:**
  - `src/lib/llm/llm-client.ts:6` — `import Anthropic from '@anthropic-ai/sdk'`
  - `src/lib/rag/synthesizer.ts:8` — same
  - `src/lib/brihaspati/narration/inference.ts:19` — same
  - `package.json:60` — listed under `devDependencies`
- **Severity:** P1
- **Why it's a bug:** Production code paths (AI reading, Tippanni LLM, Brihaspati narration — all API routes that ship behind paid tiers) import a package that's marked dev-only. Vercel currently happens to install devDependencies for the build, so functions work today — but anyone running `npm ci --omit=dev` or `NODE_ENV=production npm install` gets a "Cannot find module '@anthropic-ai/sdk'" runtime crash on the first AI request.
- **Fix sketch:** Move `@anthropic-ai/sdk` from `devDependencies` to `dependencies` in `package.json`. One-line patch.

### R3-DX-7 — Duplicate migration number 032

- **Files:**
  - `supabase/migrations/032_self_chart_drop_onboarding_gate.sql`
  - `supabase/migrations/032_user_progress_and_badges.sql`
- **Severity:** P1 (will silently break a fresh `db push` order under some clients)
- **Why it's a bug:** Two distinct migrations share prefix `032_`. The Supabase CLI sorts by filename, so the order between them is whatever lexicographic order of the remaining filename — `self_chart_drop_onboarding_gate.sql` < `user_progress_and_badges.sql` — which happens to work today, but a future migration tool change or rename could swap order and break dependencies. CLAUDE.md explicitly says migrations are numbered `001_, 002_, …`.
- **Fix sketch:** Rename one to `032b_…` or renumber to `015_…` (the 015–019 gap is unused). After rename, verify by running `npx supabase db push --dry-run`.

### R3-DX-8 — `force-dynamic` + `revalidate = 0` + `s-maxage=60` conflict on `/api/sky/positions`

- **File:** `src/app/api/sky/positions/route.ts:12-13` and `:39-42`
- **Severity:** P1
- **Evidence:**
  ```ts
  export const dynamic = 'force-dynamic';
  export const revalidate = 0;
  // ...
  headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
  ```
- **Why it's a bug:** `force-dynamic` opts out of Next.js's data cache and ISR; `revalidate = 0` is the same. The `Cache-Control: public, s-maxage=60` header *is* respected by Vercel's edge CDN — but the conflicting Next.js-layer directives make the intent unclear and any future refactor will lose the CDN cache silently. The comment at `:41` says "Cache at CDN edge for 60s" so the *intent* is the CDN edge cache; the Next.js directives are no-ops at best.
- **Fix sketch:** Remove `dynamic = 'force-dynamic'` and `revalidate = 0`. The `Cache-Control` header is the source of truth; Next.js will infer dynamic from `request.nextUrl.searchParams.get(...)`.

---

## P2 findings

### R3-DX-9 — 171 inline copies of the BASE_URL pattern despite a shared helper

- **Pattern:** `(process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim()`
- **Count:** `grep -rn "process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com'" src/ | wc -l` → **171**
- **Helper that exists but is unused:** `src/lib/utils/base-url.ts` → `getInternalBaseUrl()`
- **Severity:** P2 (Lesson Q — duplicate constant)
- **Why it's a bug:** 171 places to update when the domain changes (or when sanitisation rules evolve — e.g. the helper handles "no protocol" cases the inline copies don't). The helper already exists; nobody reaches for it because the inline pattern is short.
- **Fix sketch:** One AST-codemod pass replacing the literal pattern with `getInternalBaseUrl()` (or a separate `getPublicBaseUrl()` for layouts that always want the canonical https URL). Dry-run on 3 files + `npx next build` per Lesson H before going wide.

### R3-DX-10 — Heavy hardcoded URLs scattered across API routes

- **Files (sampled):** `src/app/api/feed/route.ts:3`, `src/app/api/cron/email-alerts/route.ts:98,170`, `src/app/api/whatsapp/route.ts:60,69,176,252,300`, `src/app/api/calendar/export/route.ts:101,286`
- **Severity:** P2
- **Why it's a bug:** Many `https://dekhopanchang.com` literals without env fallback. Local dev that hits these returns links pointing at production; future white-label / staging migration requires touching all of them.
- **Fix sketch:** Same `getInternalBaseUrl()` swap as R3-DX-9.

### R3-DX-11 — Vestigial retired-locale message files still on disk

- **Files:**
  - `src/messages/sa.json` — 47 KB
  - `src/messages/mr.json` — 55 KB
- **Severity:** P2
- **Evidence:** `src/lib/i18n/config.ts:4-9` lists `sa` and `mr` as retired; middleware 301s them to `en`. No code imports from `src/messages/sa.json` or `mr.json` (grepped — zero hits).
- **Why it's a bug:** 100+ KB of dead JSON kept in source. Newcomers will be confused about whether the locales are active. A future code change might accidentally re-add them to `locales`.
- **Fix sketch:** `git rm src/messages/sa.json src/messages/mr.json` after confirming the middleware redirect is the only path.

### R3-DX-12 — Mixed i18n loading patterns (272 direct JSON imports + 66 `useTranslations` callers)

- **Severity:** P2
- **Evidence:**
  - `grep -rn "from '@/messages" src/ | wc -l` → 272 direct JSON imports
  - `grep -rn "useTranslations\|getTranslations" src/ | wc -l` → 66 callers
  - `src/lib/i18n/request.ts:34` uses **dynamic template** import (`@/messages/${locale}.json`) — but project memory says request.ts should load via static switch/case.
  - Single-file locales (`src/messages/en.json`) co-exist with namespace folders (`src/messages/pages/*.json`).
- **Why it's a bug:** Two parallel translation systems. The 272 direct imports bypass the next-intl machinery (no fallback, no missing-key reporting). The dynamic template import in `request.ts` is harder to tree-shake than a switch/case and may not chunk per locale under Turbopack.
- **Fix sketch:** Either (a) commit to direct JSON imports + provide a typed accessor, or (b) commit to next-intl `useTranslations` and migrate the 272 sites incrementally. Don't ship both. Convert `request.ts:34` to `switch (locale) { case 'en': return (await import('@/messages/en.json')).default; … }` per project memory.

### R3-DX-13 — `pdf-parse` dependency is dead

- **File:** `package.json` (devDependencies: `pdf-parse ^2.4.5`, `@types/pdf-parse ^1.1.5`)
- **Severity:** P2 (dead dep)
- **Evidence:** `grep -rln "pdf-parse" src/ scripts/ --include="*.ts" --include="*.tsx"` → no hits.
- **Why it's a bug:** ~50 MB of devDependency for nothing. Marginal but bloats `node_modules` + Vercel build cache.
- **Fix sketch:** `npm uninstall pdf-parse @types/pdf-parse`.

### R3-DX-14 — `next.config.ts` uses deprecated `images.domains`

- **File:** `next.config.ts:72-75`
- **Severity:** P2
- **Evidence:**
  ```ts
  images: { formats: ['image/avif', 'image/webp'], domains: [] }
  ```
- **Why it's a bug:** `images.domains` is **deprecated** in Next 15+ in favour of `images.remotePatterns`. The current empty array works because no remote images are used, but a future ESLint/Next major bump will fail-or-warn.
- **Fix sketch:** Replace with `remotePatterns: []` (empty array is fine) or remove entirely since no remote images are loaded.

### R3-DX-15 — Resend client swallows exception without tagged log

- **File:** `src/lib/email/resend-client.ts:36-38`
- **Severity:** P2 (Lesson A — error must be tagged)
- **Evidence:**
  ```ts
  } catch (e) {
    return { success: false, error: String(e) };
  }
  ```
- **Why it's a bug:** `e` is stringified and returned as a field, but never `console.error` with a `[resend-client]` prefix. The four crons that depend on this (`daily-panchang`, `onboarding-drip`, `email-alerts`, `weekly-digest`) get a `{ success: false, error }` shape and *some* of them log the returned error string, but the underlying exception (typically a network error or rate-limit) loses its stack trace at the catch boundary.
- **Fix sketch:** Add `console.error('[resend-client] send failed:', e);` before the return.

### R3-DX-16 — 38 `as any` casts; 30+ on Trilingual nav `href` due to next-intl type quirk

- **Severity:** P2
- **Evidence:** `grep -rn "as any" src/ | grep -v ".test.ts" | wc -l` → **38**. Sample concentration:
  - 12 in `src/app/[locale]/` page files (mostly `Link href={path as any}`)
  - 7 in `src/components/learn/` (LearnSidebar, LearnPageNav, LearningPath)
  - 6 in `src/app/api/` (predictions, life-events, journal, family-synthesis — all `profile?.x as any` because `user_profiles` row type doesn't declare `panchang_location` / `default_location` / `sade_sati` shapes)
  - 4 in `src/components/kundali/` (TippanniTab — see R3-DX-21)
- **Why it's a bug:** Each `as any` is a TypeScript hole. The 6 API-route ones are documented with `// TODO: extend user_profiles type to include panchang_location shape` — known debt. The `Link href={... as any}` cluster sidesteps next-intl's strict locale-prefixed pathname checking.
- **Fix sketch:** (a) Extend the Supabase row type for `user_profiles` and `kundali_snapshots` to declare nested JSON shapes; resolves 6 of the casts. (b) Use next-intl's typed `Link` properly — this needs the typed-routes pattern enabled.

### R3-DX-17 — 71 ESLint disable comments

- **Severity:** P2
- **Evidence:** `grep -rn "eslint-disable" src/ | wc -l` → **71**. Mix of `@typescript-eslint/no-explicit-any` (matches R3-DX-16 cluster) and `react-hooks/exhaustive-deps` (intentional — auto-fill effects guarded by initialData/store reads).
- **Why it's a bug:** Many `exhaustive-deps` disables don't carry an inline reason. A future refactor lacking the original context can break the guarantee.
- **Fix sketch:** Add a one-line `// eslint-disable: <reason>` after each non-obvious disable. The 30+ `learn/` and `dashboard/` cases without justification are highest priority.

### R3-DX-18 — Dashboard page eagerly imports 30+ components, only one dynamic

- **File:** `src/app/[locale]/dashboard/page.tsx:1-80` (2504-line `'use client'` component)
- **Severity:** P2
- **Evidence:** Lines 17–67 import 30+ named components statically (EclipseAlert, FestivalCountdown, MorningBriefing, PersonalizedHoroscope, SadhakaHero, FamilyCard, FamilyDoshaStrip, JournalCheckinCard, TodaysReading, AtAGlance, DashboardTabs, DailyEmailOptIn, ChartNorth, KeyDatesTimeline, NakshatraShareButton, …). Only `VratTracker` uses `next/dynamic` (line 70).
- **Why it's a bug:** Above-the-fold components (SadhakaHero, AtAGlance) need to be eager — but TodaysReading, KeyDatesTimeline, NakshatraShareButton, FamilyDoshaStrip, CalendarSyncCard are below-the-fold tabs/sections that ship in the initial chunk. Heaviest bundle hit at `/dashboard` for a user who's just signed in.
- **Fix sketch:** Audit which components render above the fold (probably 5–6); leave those static. Wrap the rest with `next/dynamic(() => import('...'), { ssr: false })` and verify the dashboard still works.

### R3-DX-19 — `tithi-grid` and `ganda-mool` API routes return cacheable data without `Cache-Control`

- **Files:**
  - `src/app/api/tithi-grid/route.ts:290` (returns `{year, month, meta, days}` for static year+month — pure compute)
  - `src/app/api/ganda-mool/route.ts:35` (returns `{year, entries}` for static year)
- **Severity:** P2
- **Why it's a bug:** Both endpoints compute deterministic data from primitive inputs. No `Cache-Control` header → every request hits the function. `panchang/route.ts:128` already does the right thing (`'public, s-maxage=43200, stale-while-revalidate=43200'`). These two siblings missed the pattern.
- **Fix sketch:** Add the same `Cache-Control: public, s-maxage=86400, stale-while-revalidate=43200` header. Year+month tuples are stable so the cache hit rate will be ~99%.

---

## P3 findings

### R3-DX-20 — `console.log` in production-path API routes (vs `console.error`)

- **Files:**
  - `src/app/api/cron/youtube-short/route.ts:42,44,54` — 3× `console.log('[youtube-cron] …')` for progress reporting
  - `src/app/api/cron/social-post/route.ts:696,725,758` — 3× `console.log` for media upload + "credentials not configured, skipping"
  - `src/app/api/cron/index-urls/route.ts:48` — 1× `console.log`
  - `src/lib/youtube/upload.ts:137` and `src/lib/youtube/generate-short.ts:169-170` — informational logs
- **Severity:** P3 (Lesson A nuance — these are *informational*, not error-swallowing)
- **Why it's a bug (mild):** Vercel function logs separate stdout from stderr by severity; `console.log` lands at "info" level, `console.error` at "error". The `social-post:725` "Twitter credentials not configured, skipping" is a *configuration warning* and would be better as `console.warn`.
- **Fix sketch:** Promote `console.log("…not configured, skipping")` to `console.warn`; keep the progress logs.

### R3-DX-21 — Dead code with TODO in TippanniTab

- **File:** `src/components/kundali/TippanniTab.tsx:344-353`
- **Severity:** P3
- **Evidence:**
  ```ts
  // TODO: .ratio does not exist on the StrengthOverview type — this is dead code that
  // always falls through to the s.strength branch. Remove the ratio check once confirmed
  // not used elsewhere.
  const ratio = (s as any).ratio as number | undefined;
  return ratio !== undefined ? ratio >= 1.5 : s.strength >= 80;
  ```
- **Why it's a bug:** The TODO is explicit. Two `as any` casts to access a property the type doesn't have. The expression always falls through. Trim it.

### R3-DX-22 — `vi.mock` without `restoreAllMocks` in `muhurta-gandanthara.test.ts`

- **File:** `src/lib/__tests__/muhurta-gandanthara.test.ts:15-19`
- **Severity:** P3 (test isolation)
- **Evidence:** Module-level `vi.mock('@/lib/ephem/astronomical', …)` declares persistent mocks. The file's `beforeEach` resets the return values, but other test files importing `sunLongitude`/`moonLongitude` after this one runs in the same vitest invocation could see the mock leak depending on vitest's module-cache semantics.
- **Why it's a bug (mild):** Vitest hoists `vi.mock` per-file and resets between files in default config, so this is *probably* fine — but adding `afterAll(() => vi.restoreAllMocks())` is defensive and zero-cost.

---

## Cross-cutting themes

1. **N+1 cron pattern repeats across 4 jobs.** `transit-alerts`, `email-alerts`, `weekly-digest`, and (historically) `generate-notifications` all share the "fetch all users → for each, query something else" shape. Sprint 21 fixed `generate-notifications` via foreign-table embed; the same fix has not been ported. **One refactor sprint could collapse 3 × (1+N) queries into 3 × 2 queries — saving an order of magnitude in latency at scale.**

2. **Constants-files-as-bundle-payload is the dominant client-bundle perf hazard.** Four constants files (FESTIVAL_DETAILS, NAKSHATRA_DETAILS, YOGA_DETAIL_DATA, MUHURTA_DATA) totalling ~1.5 MB are statically imported by `'use client'` routes that don't tree-shake them. This is the single biggest first-paint cost on /panchang, /calendar, /kundali. Fix is server-side prop pass for the slice actually needed.

3. **Vestigial state on disk.** Retired-locale JSON (`mr.json`, `sa.json`), duplicate migration `032_`, devDependency `pdf-parse`, deprecated `images.domains`, abandoned `force-dynamic + revalidate = 0` combos — none are bugs today, but each is a future-confusion seed. Sprint 26 candidate: 30-minute "cleanup" PR.

4. **Two i18n systems coexist.** 272 direct JSON imports + 66 `useTranslations` callers + dynamic-template `request.ts` import. Project memory says one path; reality has all three. The split widens every new page.

5. **The "Don't duplicate" rule (Lesson Q) is being routinely broken in small ways.** 171 BASE_URL inlines, 38 `as any` casts, 71 ESLint disables — each individually defensible, but the volume is the message: the codebase grew faster than its shared-helper layer.

---

## Diminishing-returns note

After 6 rounds of auditing across 6 lenses (silent failures, time/tz, security, idempotency, computation, UI, perf/DX), the perf/DX domain is now at the point where:

- **The remaining P1s are all "scale" bugs** — they don't bite at the current ~5–50-user load. R3-DX-1/2/3 only hurt at 100+ active subscribers; R3-DX-5 only hurts users on slow mobile networks (still ~30% of traffic per memory). R3-DX-6 only bites under a `--omit=dev` install path nobody currently uses.
- **No new P0s found in this lens.** Round 1 and 2 between them already surfaced every "ships wrong data / leaks data / loses money" issue; perf/DX is by definition the next tier down.
- **Most P2s are taste/hygiene.** Worth doing in a single batch-cleanup sprint, but not blockers.

Recommendation: do not run a 7th round in another lens. The marginal finding is now P2/P3 hygiene — ship Sprint 26 ("cleanup + bundle slim") and move to feature work.
