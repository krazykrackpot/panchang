# Audit Round 5 — 2026-05-11 (Fresh Eyes Deep Scan)

**Approach:** Looked for NEW categories of bugs that previous 4 rounds missed: race conditions, hydration mismatches, data validation at boundaries, stale closures, accessibility, edge cases, email/notification bugs, PWA, third-party failures.

**Result: 29 issues (5 High, 13 Medium, 11 Low)**

---

## HIGH (5)

### H1-H4: `new Date()` in 4 Server Components — hydration mismatch
- **Files:**
  - `src/app/[locale]/horoscope/page.tsx:13` — hub page H1 includes today's date
  - `src/app/[locale]/horoscope/[rashi]/page.tsx:23-24` — rashi page H1
  - `src/app/[locale]/horoscope/[rashi]/weekly/page.tsx:18-19` — week range in H1
  - `src/app/[locale]/horoscope/[rashi]/monthly/page.tsx:17-24` — month label in H1
- **Issue:** These are Server Components (no `'use client'`). `new Date()` runs at server render time. If ISR cache serves HTML from 23:50 and client hydrates after midnight, the date in the H1 mismatches → React hydration error. No `suppressHydrationWarning` on these elements.
- **Impact:** Visible React errors at date boundaries for all horoscope pages.

### H5: ipapi.co free-tier exhaustion — duplicated calls, no shared cache
- **Files:**
  - `src/stores/location-store.ts:95`
  - `src/app/[locale]/calendar/page.tsx:197`
  - `src/app/[locale]/panchang/PanchangClient.tsx:353`
- **Issue:** Multiple pages independently call `ipapi.co/json/` (free tier: 1000 req/day). No shared cache across pages. With >1000 unique visitors/day, ALL location detection fails silently — users get no location, panchang can't load.
- **Impact:** Complete location detection failure at scale.

---

## MEDIUM (13)

### M1: 6+ components fetch without AbortController
- **Files:** TodayPanchangWidget, HubClient, HoroscopeClient, eclipses page, kundali page, PersonalEclipseInsight
- **Issue:** Stale fetch responses call setState on unmounted components. Only 2 components (caesarean, muhurta scanner) use AbortController.

### M2: matching/route.ts — `request.json()` not in try-catch
- **File:** `src/app/api/matching/route.ts:18`
- **Issue:** Non-JSON body crashes with 500.

### M3: kundali/route.ts — day 31 accepted for all months
- **File:** `src/app/api/kundali/route.ts:49`
- **Issue:** `date: "2024-02-31"` passes validation. `dateToJD` silently computes March 2 chart.

### M4: panchang/route.ts — lat/lng default to 0,0
- **File:** `src/app/api/panchang/route.ts:41-42`
- **Issue:** Missing coordinates default to Gulf of Guinea. Silently wrong panchang.

### M5: weekly-digest hardcodes Delhi for all users' festivals
- **File:** `src/app/api/cron/weekly-digest/route.ts:101`
- **Issue:** All users worldwide get festival dates computed for Delhi.

### M6: weekly-digest naive nakshatra approximation
- **File:** `src/app/api/cron/weekly-digest/route.ts:69-70`
- **Issue:** Assumes Moon advances exactly 1 nakshatra/day. By day 7, off by 1-2 nakshatras.

### M7: email-alerts N+1 query pattern
- **File:** `src/app/api/cron/email-alerts/route.ts:30-38`
- **Issue:** 2+ DB queries per user. 1000 users = 2000+ round-trips. May exceed Vercel timeout.

### M8: onboarding-drip reads email from user_profiles, not auth.users
- **File:** `src/app/api/cron/onboarding-drip/route.ts:26`
- **Issue:** If email column not synced with auth.users, emails fail silently.

### M9: horoscope/route.ts — setInterval + Map in serverless
- **File:** `src/app/api/horoscope/route.ts:10-20`
- **Issue:** In-memory cache + setInterval in serverless function. Cold starts lose cache. Interval leaks. Two instances = duplicate Claude calls.

### M10: tithi-pravesha — `new Date().getFullYear()` at module level
- **File:** `src/app/[locale]/tithi-pravesha/page.tsx:97`
- **Issue:** Evaluated once at module load. Stale year after Jan 1 on long-lived server.

### M11: dateToJD accepts any numbers — garbage in, plausible garbage out
- **File:** `src/lib/ephem/astronomical.ts:69`
- **Issue:** `dateToJD(2024, 2, 30, 0)` returns a valid JD for March 1. No input validation.

### M12: text-gold-dark (#8a6d2b) on #0a0e27 fails WCAG AA
- **File:** BirthForm.tsx and others using `text-gold-dark`
- **Issue:** Contrast ratio ~3.2:1, requires 4.5:1. Affects form labels.

### M13: Modal overlays lack keyboard accessibility
- **Files:** AuthModal.tsx:71, SearchModal.tsx:172, SectionNav.tsx:75
- **Issue:** Backdrop `div` with `onClick` but no `role="button"`, `tabIndex`, `onKeyDown`. Can't dismiss via keyboard.

---

## LOW (11)

### L1: HoroscopeClient stale closure on locale
- **File:** `src/app/[locale]/horoscope/[rashi]/HoroscopeClient.tsx:340`
- **Issue:** useEffect for personalized fetch has `[isOwnSign]` dep but reads `locale` from closure. Locale switch uses stale value.

### L2: HubClient 12 parallel fetches without cancellation
- **File:** `src/app/[locale]/horoscope/HubClient.tsx:314-320`
- **Issue:** Promise.all of 12 fetches. Unmount during flight → setState on unmounted component.

### L3: kundali API accepts "9999-99-99"
- **File:** `src/app/api/kundali/route.ts:35`
- **Issue:** Regex `^\d{4}-\d{2}-\d{2}$` matches invalid dates. Month/day range check catches most but not all.

### L4: checkout `req.json()` not in dedicated try-catch
- **File:** `src/app/api/checkout/route.ts:16`
- **Issue:** Outer catch handles it but error message is misleading.

### L5: Journal API: NaN from unparseable query params
- **File:** `src/app/api/journal/route.ts:193-203`
- **Issue:** `parseInt('abc')` → NaN → Supabase `.eq('field', NaN)` → empty results.

### L6: Ayanamsha accuracy outside 1900-2100
- **File:** `src/lib/ephem/astronomical.ts:378`
- **Issue:** Panchang API accepts years up to 2200 but Meeus polynomial degrades after 2100.

### L7: Sunrise returns null at polar latitudes
- **File:** `src/lib/ephem/astronomical.ts:596`
- **Issue:** Some callers may not handle null. `approximateSunriseSafe` wrapper exists but not all paths use it.

### L8: Kundali page tables no scroll indicator on mobile
- **File:** `src/app/[locale]/kundali/page.tsx:1332`
- **Issue:** `overflow-x-auto` with no visual hint that table extends.

### L9: SW panchang cache never versioned
- **File:** `public/sw.js:8`
- **Issue:** `dp-panchang-v1` is hardcoded. Format changes won't purge stale cache.

### L10: SW trimCache evicts by insertion order, not age
- **File:** `public/sw.js:176-180`
- **Issue:** Frequently accessed old entries survive while recent entries get evicted.

### L11: Nominatim failure shows coordinates as location name
- **File:** `src/stores/location-store.ts:82-90`
- **Issue:** Location name falls back to "28.61, 77.21" — ugly in emails but functional.

---

## Previously Fixed (verified clean)
- Browser timezone for birth charts — FIXED (resolveBirthTimezone)
- Timezone fallback tests — FIXED (27/27 pass)
- Sign-shift wrong TZ function — FIXED
- All 12 rate-limited API routes — FIXED
- Unbounded Maps — FIXED (eviction intervals added)
- Silent catches in crons/engines — FIXED
- Hardcoded module counts — FIXED (dynamic imports)

---

## Priority Fix Order
1. **H1-H4** — Hydration mismatches on horoscope pages (add `suppressHydrationWarning` or move date to client)
2. **H5** — ipapi.co exhaustion (centralise IP geolocation to location store only, remove duplicate calls)
3. **M3** — Kundali date validation (validate month/day combinations)
4. **M5-M6** — Weekly digest Delhi hardcode + naive nakshatra
5. **M12** — WCAG contrast (brighten text-gold-dark)
6. Everything else in severity order
