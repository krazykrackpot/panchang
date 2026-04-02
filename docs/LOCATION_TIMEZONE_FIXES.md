# Location & Timezone Hardcoding Audit + Fix Plan

**Date:** 2026-04-01
**Status:** Executing

---

## Problem Statement

The codebase defaults to New Delhi, India (28.6139°N, 77.2090°E, IST +5:30) in ~25 files. Users outside India get incorrect astronomical calculations. Additionally, timezone handling uses a broken `Math.round(lng / 15 * 2) / 2` approximation that ignores DST entirely.

---

## A. Hardcoded Delhi Coordinates (17 files)

### RED — Always uses Delhi, no user input

| # | File | Line(s) | Context |
|---|------|---------|---------|
| 1 | `src/app/[locale]/prashna-ashtamangala/page.tsx` | 85 | Hardcoded in fetch body |
| 2 | `src/app/[locale]/kundali/rectify/page.tsx` | 84 | Hardcoded for rectification |
| 3 | `src/app/[locale]/transits/graphic/page.tsx` | 34 | Hardcoded in viz loop |
| 4 | `src/app/[locale]/kaal-nirnaya/page.tsx` | 220 | Hardcoded in fetch URL |

### ORANGE — Delhi as fallback after geolocation fails

| # | File | Line(s) | Context |
|---|------|---------|---------|
| 5 | `src/app/[locale]/panchang/page.tsx` | 96 | Initial state |
| 6 | `src/app/[locale]/muhurta-ai/page.tsx` | 105 | Initial state |
| 7 | `src/app/[locale]/prashna/page.tsx` | 115-116 | Geolocation fallback |
| 8 | `src/components/kundali/BirthForm.tsx` | 26-27 | Form default |

### YELLOW — API route defaults when no params

| # | File | Line(s) | Context |
|---|------|---------|---------|
| 9 | `src/app/api/panchang/route.ts` | 39-43 | `\|\| '28.6139'` |
| 10 | `src/app/api/horoscope/route.ts` | 15-27 | `.default(28.6139)` |
| 11 | `src/app/api/muhurta-ai/route.ts` | 18-19 | Destructuring default |
| 12 | `src/app/api/prashna-ashtamangala/route.ts` | 16-17 | Destructuring default |
| 13 | `src/app/api/muhurat/route.ts` | 8-9 | Query param fallback |
| 14 | `src/app/api/tithi-table/route.ts` | 11-12 | Query param fallback |
| 15 | `src/app/api/festival-compare/route.ts` | 12-14 | Also defaults tz to Asia/Kolkata |

### Library defaults

| # | File | Line(s) | Context |
|---|------|---------|---------|
| 16 | `src/lib/calendar/muhurat-calendar.ts` | 126-127 | Function param defaults |
| 17 | `src/lib/calendar/festivals.ts` | 256 | `DEFAULT_LAT = 28.6139` |

---

## B. Hardcoded IST Timezone (5.5 / Asia/Kolkata) — 14 files

| File | Line(s) |
|------|---------|
| `panchang/page.tsx` | 96 |
| `muhurta-ai/page.tsx` | 105 |
| `prashna/page.tsx` | 115 |
| `prashna-ashtamangala/page.tsx` | 85 |
| `kundali/rectify/page.tsx` | 84 |
| `transits/graphic/page.tsx` | 34 |
| `BirthForm.tsx` | 28 |
| `horoscope/route.ts` | 17 |
| `muhurta-ai/route.ts` | 20 |
| `prashna-ashtamangala/route.ts` | 18 |
| `astronomical.ts` | 317 |
| `festivals.ts` | 258 |
| `festival-compare/route.ts` | 14 |
| `tithi-table/route.ts` | 13 |

---

## C. Timezone / DST Bugs

### C1. Longitude-based timezone approximation (CRITICAL)
`Math.round(lng / 15 * 2) / 2` — ignores DST, wrong for half the year in Europe/USA.
**Files:** sign-calculator, sade-sati, varshaphal, kp-system pages.

### C2. KP chart hardcoded timezone map (CRITICAL)
`src/lib/kp/kp-chart.ts:61-93` — static offsets, never uses DST-aware resolution.

### C3. Sunrise date constructor (HIGH)
`src/lib/astronomy/sunrise.ts:62-67` — uses browser local time, not location timezone.

### C4. Solar return fixed timezone (HIGH)
`src/lib/varshaphal/solar-return.ts:22-110` — uses birth tz for entire year scan.

### C5. BirthForm limited timezone options (MEDIUM)
`src/components/kundali/BirthForm.tsx:144-160` — only 7 hardcoded options, no DST.

### C6. Kundali calc numeric timezone (MEDIUM)
`src/lib/ephem/kundali-calc.ts:584-587` — `parseFloat()`, no DST.

---

## D. What Already Works

- `src/lib/utils/timezone.ts` — DST-aware `getUTCOffsetForDate()` using `Intl.DateTimeFormat`
- `src/stores/location-store.ts` — browser geolocation + IP fallback + reverse geocoding
- `src/components/ui/LocationSearch.tsx` — returns IANA timezone from browser
- `src/lib/ephem/panchang-calc.ts` — supports per-JD timezone resolution

---

## E. Execution Plan

### Phase 1: Location Store — Single Source of Truth
1. Add `timezone: string | null` (IANA) to location-store
2. Populate timezone from browser on detect(), from LocationSearch on select
3. Remove Delhi defaults — use null to indicate "not yet set"
4. Persist to localStorage so returning users keep their location

### Phase 2: Eliminate Delhi Defaults from Pages
5. RED pages (4): Wire up LocationSearch or location store
6. ORANGE pages (4): Replace Delhi fallback with location store
7. API routes (7): Remove Delhi defaults, require lat/lng or return 400
8. Library defaults (2): Make lat/lng required params

### Phase 3: Fix Timezone Handling
9. Kill longitude approximation in all pages — use getUTCOffsetForDate()
10. Fix KP chart static offset map
11. Fix BirthForm — auto-detect timezone from location, IANA-aware
12. Fix sunrise.ts timezone-aware date construction
13. Fix solar-return.ts per-date timezone resolution
14. Fix kundali-calc.ts to accept IANA timezone

### Phase 4: Propagate IANA Timezone
15. Update BirthData interface — timezone as IANA string
16. Update all API routes to prefer IANA timezone
17. LocationSearch to resolve IANA timezone from coordinates
18. Remove IST default from formatTime() and other utils

### Phase 5: UX — Location Gate
19. Show location prompt when store is empty before displaying location-dependent data
20. Persist location to localStorage

---

## F. Files Inventory (complete list to touch)

**Stores:** location-store.ts
**Components:** LocationSearch.tsx, BirthForm.tsx
**Pages (13):** panchang, muhurta-ai, prashna, prashna-ashtamangala, kaal-nirnaya, transits/graphic, kundali/rectify, sign-calculator, sade-sati, varshaphal, kp-system, horoscope, kundali
**API Routes (7):** panchang, horoscope, muhurta-ai, prashna-ashtamangala, muhurat, tithi-table, festival-compare
**Libraries (6):** muhurat-calendar.ts, festivals.ts, kp-chart.ts, sunrise.ts, solar-return.ts, kundali-calc.ts, astronomical.ts
**Types:** kundali.ts
**Utils:** timezone.ts
