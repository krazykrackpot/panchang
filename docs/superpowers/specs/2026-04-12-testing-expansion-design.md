# Testing Expansion — Design Spec

**Date:** 2026-04-12
**Goal:** Expand test coverage from 1531 to ~1700+ tests across 4 phases — legacy migration, breadth coverage of untested modules, depth on core engines, and E2E stabilization.

---

## Phase 1: Legacy Migration

Migrate 4 custom-runner test files (using hand-rolled `assert()` + console.log) to vitest `describe/it/expect` format. Remove from vitest config exclude list.

**Files:**
- `src/lib/ephem/__tests__/panchang-calc.test.ts` — tests `computePanchang` for Delhi Jan 15 2025 (all fields: tithi, nakshatra, yoga, karana, vara, times, muhurtas, choghadiya, hora, planets, enhanced fields)
- `src/lib/ephem/__tests__/astronomical.test.ts` — tests JD conversion, sun/moon longitude, ayanamsa
- `src/lib/llm/__tests__/horoscope-prompt.test.ts` — tests prompt building for horoscopes, transit data, fallbacks
- `src/lib/llm/__tests__/chart-chat-prompt.test.ts` — tests chart-chat system prompt, sanitization, fallbacks

**Transform pattern:** Each `assert(name, condition, detail)` becomes `it(name, () => { expect(condition).toBe(true); })` or a more specific matcher. Group related asserts into `describe` blocks.

**Vitest config:** Remove these 4 files from the `exclude` array in `vitest.config.ts`.

---

## Phase 2: Coverage Breadth

Add "smoke + correctness" tests for the 8 highest-risk untested modules. Each test file follows the pattern: import the module, call with known inputs, verify output structure and key values.

### 2A. Muhurta Engine (`src/lib/muhurta/`)

**Test file:** `src/lib/muhurta/__tests__/muhurta-engine.test.ts`

Tests:
- `scorePanchangFactors` returns a number in valid range for known panchang data
- `scoreTransitFactors` returns valid scores
- `scanDateRange` returns an array of scored windows for a 7-day range
- `getExtendedActivity` returns valid activity config for each of the 20 activity types
- `getAllExtendedActivities` returns 20 entries
- `computePersonalScore` produces valid output when given chart data
- Edge: empty date range returns empty array
- Edge: invalid activity type is handled gracefully

### 2B. Prashna System (`src/lib/prashna/`)

**Test file:** `src/lib/prashna/__tests__/prashna-engine.test.ts`

Tests:
- `generatePrashnaResult` produces valid output with all required fields
- `mapNumberToObject` maps 1-108 to valid objects
- `calculateArudaHouse` returns valid house number 1-12
- `analyzePrashna` produces analysis with dignity, strength, aspects
- `generateInterpretation` produces non-empty multilingual text
- `detectPrashnaYogas` returns array of yoga objects
- `calculatePanchaPakshi` returns valid bird/activity
- Edge: boundary numbers (1, 108) for ashtamangala mapping

### 2C. Calendar Generators (`src/lib/calendar/`)

**Test file:** `src/lib/calendar/__tests__/calendar-generators.test.ts`

Tests:
- `buildYearlyTithiTable` for 2026 Delhi returns ~370 entries with valid structure
- `generateFestivalCalendarV2` for 2026 returns festivals with dates in range
- `generateEclipseCalendar` for 2026 returns known eclipses (cross-validate with NASA data)
- `generateRetrogradeCalendar` for 2026 returns retrograde periods for Mercury/Venus/Mars/Jupiter/Saturn
- `generateCombustionCalendar` produces combustion windows
- `computeHinduMonths` for 2026 returns 12-13 months with correct names
- `findMuhuratDates` returns dates within specified range
- Tithi table entry structure validation (all fields present and typed correctly)
- Eclipse data: solar eclipse ~March 29 2025 is in the data (known reference)

### 2D. Notification Engine (`src/lib/notifications/`)

**Test file:** `src/lib/notifications/__tests__/notification-engine.test.ts`

Tests:
- Notification engine produces valid alert structure
- Transit alerts detect slow planet sign changes
- Festival relevance scoring returns scores in range
- Personal panchang alerts structure is valid
- Personal muhurta alerts produce results
- Gochar (transit) analysis returns valid data
- Remedies generator produces non-empty text

### 2E. Forecast Engine (`src/lib/forecast/`)

**Test file:** `src/lib/forecast/__tests__/forecast-engine.test.ts`

Tests:
- `generateAnnualForecast` produces 12 monthly entries
- `generateDashaNarrative` produces non-empty text for known dasha
- `computeYearRating` returns number in valid range (1-10)
- Annual forecast structure: each month has transits, score, narrative
- Edge: year boundaries (Jan/Dec) handled correctly

### 2F. Kundali Sub-Calculations (`src/lib/kundali/`)

**Test file:** `src/lib/kundali/__tests__/kundali-subcalcs.test.ts`

Tests:
- `calculateAvasthas` returns valid avastha for each planet
- `calculateArgala` returns argala/virodh-argala for houses
- `calculateBhavabala` returns strength values for 12 houses
- `calculateSphutas` returns computed longitudes
- `calculateVimshopakaBala` returns scores in 0-20 range
- `detectGrahaYuddha` returns war results (may be empty for some charts)
- `generateTippanni` produces sections array with expected section types
- `calculateSpecialLagnas` returns Hora, Ghati, Bhava, Varnada lagnas
- Use a known reference chart (Delhi, Jan 15 2025 12:00 as baseline)

### 2G. Transit Module (`src/lib/transit/`)

**Test file:** `src/lib/transit/__tests__/personal-transits.test.ts`

Tests:
- `computePersonalTransits` returns transits for all 9 planets
- Each transit has: planet, fromSign, toSign, date
- `computeUpcomingTransitions` returns future events within date range
- Transit house assignments are valid (1-12)

### 2H. Varshaphal Sub-Functions (`src/lib/varshaphal/`)

**Test file:** `src/lib/varshaphal/__tests__/varshaphal-subs.test.ts`

Tests:
- `calculateMuddaDasha` returns dasha periods that sum to ~365 days
- `calculateSahams` returns array of sensitive points
- `calculateMuntha` returns valid sign (1-12)
- `findSolarReturn` returns JD within expected range
- `detectTajikaYogas` returns array of yoga objects
- `determineVarsheshvara` returns valid planet

---

## Phase 3: Coverage Depth

Deepen tests on core engines with edge cases and cross-validation.

**Test file:** `src/lib/__tests__/depth-edge-cases.test.ts`

### DST Transition Tests
- Panchang for Bern, Switzerland on March 30 2025 (CET→CEST spring forward)
- Panchang for Bern on October 26 2025 (CEST→CET fall back)
- Panchang for Seattle on March 9 2025 (PST→PDT)
- Panchang for Seattle on November 2 2025 (PDT→PST)
- Verify sunrise/sunset times shift correctly across DST boundary
- Verify tithi transitions don't produce invalid times

### Boundary Conditions
- Kshaya tithi detection: find a date where kshaya tithi occurs and verify `isKshaya: true`
- Vriddhi tithi detection: verify `isVriddhi: true` for doubled tithis
- Nakshatra at 0°/360° boundary (Revati→Ashwini transition)
- Amavasya/Purnima exact moment detection
- Midnight crossing: panchang elements that transition around midnight

### Geographic Edge Cases
- Southern hemisphere: Sydney, Australia (reversed seasons, different sunrise patterns)
- High latitude: Reykjavik, Iceland (extreme day length variation)
- Equatorial: Singapore (minimal sunrise variation)
- Date line proximity: Auckland, New Zealand

### Cross-Validation
- Compare 5 reference dates against Prokerala/Shubh Panchang values for same locations
- Verify within 2-minute tolerance for tithi/nakshatra transition times

---

## Phase 4: E2E Stabilization

### Audit and Fix Playwright Suite

**Files:** All 19 specs in `e2e/`

Tasks:
- Read `playwright.config.ts` and verify dev server starts correctly
- Run `npx playwright test --reporter=list` and identify which specs pass/fail
- Replace all `waitForTimeout(N)` calls with proper assertions: `waitForSelector`, `waitForResponse`, `waitForLoadState`
- Fix flaky selectors (prefer `data-testid` or `role` over CSS class selectors)
- Prune specs that test removed features or are fundamentally broken
- Ensure core flows pass reliably: homepage, panchang, kundali generation, matching
- Document: add `scripts` entry in package.json for `test:e2e`

### Core E2E Flows to Guarantee

1. Homepage loads, shows panchang widget, no JS errors
2. Panchang page: loads data, city selector works, date navigation works
3. Kundali page: form submits, chart renders, tippanni loads
4. Matching page: two inputs → score displayed
5. Navigation: all navbar links resolve (no 404s)

---

## Summary

| Phase | New Tests | Effort |
|-------|----------|--------|
| Phase 1: Legacy migration | ~0 new (migrate ~60 existing assertions) | Small |
| Phase 2: Breadth coverage | ~94 new tests across 8 modules | Medium |
| Phase 3: Depth edge cases | ~25 new tests | Medium |
| Phase 4: E2E stabilization | Fix ~19 existing specs | Medium |

**Total new tests:** ~120
**Target total:** ~1650+ vitest tests + stabilized E2E suite
