# Ayanamsha Consistency + Muhurta Rules Integration — Hardening Spec

**Date:** 2026-05-04
**Goal:** Claim "Green" on tithi/nakshatra timing accuracy and close the trust gap with Drik Panchang on muhurta recommendations.

---

## Problem Statement

Two "Yellow" areas prevent us from claiming computational parity with Drik Panchang:

1. **Ayanamsha inconsistency.** Two independent modules compute ayanamsha (`astronomy/ayanamsa.ts` with 3 types, `ephem/astronomical.ts` with 11 types). Several consumers are hardwired to `lahiriAyanamsha()` and ignore the user's chosen ayanamsha system. Yoga calculation in `panchang-calc.ts` doesn't pass `userAyanamsha` at all. Hardcoded approximations exist in two files.

2. **Muhurta scoring is blind to three computed inauspicious/auspicious periods.** The V2 scanner (`scanDateRangeV2`) checks Rahu Kaal, Yamaganda, Gulika, and Vishti — but does NOT check Durmuhurtam, Abhijit Muhurta, or Varjyam. All three are already computed in `panchang-calc.ts` and displayed on panchang pages, but the muhurta AI doesn't use them. This means the muhurta AI can recommend a 12:15 window as 85/100 while the panchang page simultaneously shows "Durmuhurtam 12:00-12:48" for the same day.

Neither problem requires new astronomical computation. Both are integration/consistency gaps in existing code.

---

## Phase 1: Ayanamsha Consolidation

### 1.1 Current State

| Module | File | Types | Used By |
|--------|------|-------|---------|
| A | `src/lib/astronomy/ayanamsa.ts` | 3 (`lahiri`, `krishnamurti`, `raman`) | `panchang/calculator.ts`, `kundali/chart.ts`, `AyanamshaComparison.tsx` |
| B | `src/lib/ephem/astronomical.ts` | 11 (full set including `true_chitra`, `yukteshwar`, etc.) | Everything else (~20 files) |

Both modules use identical Lahiri polynomial constants (`23.85306 + 1.39722t + ...`). Module B delegates to Swiss Ephemeris when available, falling back to the polynomial. Module A is always polynomial-only.

### 1.2 Bugs to Fix

**Bug 1 — Yoga ignores user ayanamsha** (`panchang-calc.ts:936`)
```typescript
// BEFORE (bug):
const yogaNum = calculateYoga(jdSunrise);
// AFTER:
const yogaNum = calculateYoga(jdSunrise, userAyanamshaValue);
```
Note: `calculateYoga()` already accepts an optional `ayanamshaValue` parameter. The call site simply doesn't pass it.

**Bug 2 — Lagna table hardwired to Lahiri** (`panchang-calc.ts:1586`)
```typescript
// BEFORE (bug):
const lagnaAyanamsha = lahiriAyanamsha(jdSunrise);
// AFTER:
const lagnaAyanamsha = userAyanamshaValue ?? lahiriAyanamsha(jdSunrise);
```
The `userAyanamsha` value is already available in scope from the function parameters.

**Bug 3 — Output ayanamsha field always Lahiri** (`panchang-calc.ts:1253`)
```typescript
// BEFORE (bug):
const ayanamsha = lahiriAyanamsha(jdSunrise);
// AFTER:
const ayanamsha = userAyanamshaValue ?? lahiriAyanamsha(jdSunrise);
```
The output should reflect the ayanamsha value that was actually used for the sidereal conversions.

### 1.3 Module Consolidation

**Deprecate Module A** (`astronomy/ayanamsa.ts`). Redirect its 3 consumers to Module B (`ephem/astronomical.ts`):

| Consumer | Change |
|----------|--------|
| `panchang/calculator.ts` | Import `getAyanamsha`, `toSidereal` from `@/lib/ephem/astronomical` |
| `kundali/chart.ts` | Import `getAyanamsha`, `toSidereal` from `@/lib/ephem/astronomical` |
| `AyanamshaComparison.tsx` | Import `getAyanamsha` from `@/lib/ephem/astronomical` |

After migration, delete `astronomy/ayanamsa.ts` and update any type imports to use `AyanamshaType` from `ephem/astronomical.ts`.

### 1.4 Hardcoded Approximation Cleanup

**File 1:** `kundali/domain-synthesis/transit-activation.ts` (lines 22-26)
- Replace `AYANAMSHA_J2000 = 23.85` + linear formula with `import { lahiriAyanamsha } from '@/lib/ephem/astronomical'`
- Call `lahiriAyanamsha(jd)` instead of the linear approximation

**File 2:** `kundali/chart-narrative.ts` (line 196)
- Replace magic fallback `|| 24.18` with `|| lahiriAyanamsha(jd)` where `jd` is derived from the kundali's birth time
- Or better: assert that `ayanamshaValue` is always present (it should be, since it's computed during chart generation)

### 1.5 Downstream Hardwired Consumers (Lower Priority)

These files call `lahiriAyanamsha()` directly, ignoring user preference. For the default Lahiri user (>95% of users), this produces identical results. Fixing these is correctness for KP/Raman users:

| File | Current | Fix |
|------|---------|-----|
| `kundali/shadbala.ts` | `lahiriAyanamsha()` | Accept `ayanamshaValue` parameter, plumb from kundali |
| `kundali/sade-sati-analysis.ts` | `lahiriAyanamsha()` | Accept `ayanamshaValue` parameter |
| `horoscope/daily-engine.ts` | `lahiriAyanamsha()` | Accept `ayanamshaValue` parameter |
| `sky/positions.ts` | `lahiriAyanamsha()` | Accept `ayanamshaValue` parameter |
| `SudarshanaTab.tsx` | `lahiriAyanamsha()` | Read from kundali's `ayanamshaValue` |

**Decision:** Fix bugs 1-3 and consolidate modules now. Downstream plumbing can be a follow-up — it only affects the <5% of users who select KP/Raman, and only for secondary features (shadbala, sade-sati, daily horoscope).

### 1.6 What Doesn't Need Fixing

- **Tithi calculation** — uses tropical Sun-Moon difference. Ayanamsha cancels out. Correct as-is.
- **Karana calculation** — derived from tithi. Ayanamsha-independent. Correct as-is.
- **Calendar/festival engine** — `hindu-months.ts` and `retro-combust.ts` correctly use Lahiri always (Hindu calendar is defined by Lahiri by convention, regardless of user preference).

### 1.7 Verification

After changes:
1. `npx tsc --noEmit -p tsconfig.build-check.json` — zero errors
2. `npx vitest run` — all existing tests pass
3. `npx next build` — zero errors
4. Spot-check: compute panchang for 2026-05-04, Corseaux (46.46°N, 6.80°E) with Lahiri. Compare nakshatra, yoga, and lagna table against Prokerala. Values should be identical to current production (this is a refactor, not a computation change for Lahiri users).
5. Spot-check: compute panchang with KP ayanamsha. Yoga and lagna should now differ from Lahiri (they were incorrectly identical before).

---

## Phase 2: Muhurta Rules Integration

### 2.1 Current State of the V2 Scanner

`scanDateRangeV2()` in `time-window-scanner.ts` scores each time window (default 90 minutes) across a date range. It already checks:

| Factor | Checked? | Scoring |
|--------|----------|---------|
| Rahu Kaal | YES | -4 via `computeInauspiciousPenalty` |
| Yamaganda | YES | -3 via `computeInauspiciousPenalty` |
| Gulika Kaal | YES | -2 via `computeInauspiciousPenalty` |
| Vishti/Bhadra | YES | -4 via `computeInauspiciousPenalty` AND -5 via `scorePanchangFactors` |
| **Durmuhurtam** | **NO** | Not checked at all |
| **Abhijit Muhurta** | **NO** | Not checked at all |
| **Varjyam** | **NO** | Not checked at all |

### 2.2 Changes Required

#### 2.2a Integrate Durmuhurtam into inauspicious-periods.ts

Add a `computeDurMuhurtam()` function to `inauspicious-periods.ts` that reuses the same weekday-indexed lookup tables already defined in `panchang-calc.ts` (lines 1293-1315).

**Approach:** Extract the `DUR_MUHURTAM_A` table (Kaala Prakashika, verified against Prokerala) into a shared constant in `src/lib/constants/dur-muhurtam.ts`. Both `panchang-calc.ts` and `inauspicious-periods.ts` import from there.

The function signature:
```typescript
export function computeDurMuhurtam(
  sunriseUT: number,
  sunsetUT: number, 
  weekday: number,  // 0=Sunday
): TimeRange[]
```

Each day has 1-2 Durmuhurtam windows (weekday-dependent). The function converts muhurta indices to absolute times using `dayMuhurtaDuration = (sunsetUT - sunriseUT) / 15`.

**Integration into scanner:** In `computeInauspiciousForWindow()`, check overlap of the scoring window with Durmuhurtam windows. If overlapping, add an `InauspiciousPeriod` entry with `name: 'Dur Muhurtam'`.

**Penalty:** -3 points (less than Rahu Kaal's -4, more than Gulika's -2). Durmuhurtam is a moderate inauspicious period — classically significant but not as severe as Rahu Kaal.

#### 2.2b Integrate Abhijit Muhurta as a Bonus

Abhijit is an auspicious period, not an inauspicious one. It should be a **bonus** in the timing score, not a penalty in the inauspicious score.

**Approach:** Add Abhijit detection to `scoreTimingFactors()` in `ai-recommender.ts`:

```typescript
// Abhijit Muhurta — 8th daytime muhurta (around midday)
// Universally auspicious EXCEPT Wednesdays (Muhurta Chintamani, Dharma Sindhu)
const dayMuhurtaDuration = (sunsetLocal - sunriseLocal) / 15;
const abhijitStartLocal = sunriseLocal + 7 * dayMuhurtaDuration;
const abhijitEndLocal = abhijitStartLocal + dayMuhurtaDuration;
const isWednesday = weekday === 3;

if (!isWednesday && hourOfDay >= abhijitStartLocal && hourOfDay < abhijitEndLocal) {
  score += 8;  // Strong bonus — Abhijit is universally praised in classical texts
  factors.push({ en: 'Abhijit Muhurta — universally auspicious', ... });
}
```

**Bonus value: +8.** This is significant but doesn't single-handedly override bad panchang factors. For context, a matching hora gives +12 and an auspicious choghadiya gives +10.

#### 2.2c Integrate Varjyam into inauspicious-periods.ts

Varjyam is already computed in `panchang-calc.ts:358-430` via nakshatra-based ghati offsets (`VARJYAM_GHATI[]` and `VARJYAM_GHATI_2[]` arrays, sourced from Prashna Marga Ch.7). The full computation requires the exact nakshatra ingress JD, which the V2 scanner doesn't have per-window.

**Key insight:** The ghati tables define Varjyam as "starts at ghati X (of 60) within the nakshatra, lasts 4 ghatis." Since 1 ghati = 1/60th of the nakshatra duration, and the Moon traverses 13.333° per nakshatra, we can check Varjyam from Moon's degree position alone — no ingress time needed:

```typescript
// Moon's position within current nakshatra (0-60 ghatis equivalent)
const degInNak = moonSid % (360 / 27);  // 0 to 13.333°
const ghatiPosition = (degInNak / (360 / 27)) * 60;  // 0 to 60

// Check primary Varjyam window
const varjyamStart = VARJYAM_GHATI[nakIdx];
const isInVarjyam = ghatiPosition >= varjyamStart && ghatiPosition < varjyamStart + 4;

// Check secondary Varjyam (dual Thyajyam — only Mula has this)
const varjyam2Start = VARJYAM_GHATI_2[nakIdx];
const isInVarjyam2 = varjyam2Start >= 0 
  && ghatiPosition >= varjyam2Start && ghatiPosition < varjyam2Start + 4;
```

This is accurate to within ~5-10 minutes (the Moon's speed varies ±10% from average, so the linear degree→ghati mapping isn't perfect). This matches the ±12 min accuracy ceiling documented in the classical integer-ghati tables themselves (see `panchang-calc.ts:352`).

**Integration:** Add `isVarjyamActive()` to `inauspicious-periods.ts`. The V2 scanner calls `getPanchangSnapshot()` which internally computes `moonSid` but discards it (only returns nakshatra number). Two options:

1. **Option A (clean):** Add `moonSid` to the `PanchangSnapshot` return type. The V2 scanner then passes it to `computeInauspiciousForWindow()`.
2. **Option B (minimal):** Compute `moonSid` independently in the scanner loop (one extra `toSidereal(moonLongitude(jdMid), jdMid)` call per window). Duplicates work but avoids changing the snapshot interface.

**Decision:** Option A — add `moonSid` to `PanchangSnapshot`. It's a one-line addition to the return type and avoids redundant computation. The V2 scanner already has the snapshot; just read `snap.moonSid`.

**New parameter for `computeInauspiciousForWindow()`:** Add `moonSid: number` (Moon's sidereal longitude).

**Penalty:** -3 points (same as Durmuhurtam). Varjyam is classically significant — "time of poison" — but varies by tradition in severity.

#### 2.2d Fix Vishti Double-Counting

Currently Vishti/Bhadra is penalised twice:
- `-5` in `scorePanchangFactors()` (line 122-123 of `ai-recommender.ts`) as karana score
- `-4` in `computeInauspiciousPenalty()` via `inauspicious-periods.ts`

**Fix:** Remove the Vishti check from `computeInauspiciousForWindow()`. The karana-based check in `scorePanchangFactors()` is more accurate (it checks the actual karana number, not just a binary flag). Keep the `-5` in panchang scoring, drop the `-4` from inauspicious periods.

Alternatively: keep both but reduce the inauspicious penalty to `-2` so the combined effect is `-7` (severe but not double-penalising at full weight). This approach is cleaner because `computeInauspiciousForWindow()` is also used for UI display — removing Vishti from it would mean the inauspicious periods sidebar no longer shows Vishti.

**Decision:** Keep Vishti in `computeInauspiciousForWindow()` for display purposes but reduce penalty from `-4` to `-1` (awareness flag, not a scoring factor — scoring is handled by `scorePanchangFactors`). Total combined effect: `-6` (was `-9`), which is still severely inauspicious.

### 2.3 Shared Constants Extraction

Move these tables from `panchang-calc.ts` to shared constants:

| Table | From | To |
|-------|------|----|
| `DUR_MUHURTAM_A` (Kaala Prakashika) | `panchang-calc.ts:1293` | `src/lib/constants/dur-muhurtam.ts` |
| `DUR_MUHURTAM_B` (Nirnaya Sindhu) | `panchang-calc.ts:1302` | `src/lib/constants/dur-muhurtam.ts` |
| `VARJYAM_GHATI` + `VARJYAM_GHATI_2` + `AMRIT_GHATI` | `panchang-calc.ts:358-386` | `src/lib/constants/varjyam.ts` |

Both `panchang-calc.ts` (for display) and `inauspicious-periods.ts` (for scoring) import from the shared constant files.

### 2.4 Scanner Consolidation (Deferred)

The codebase has three scanners: `scanDateRange` (V1), `scanDateRangeV2`, and `smartSearch`. Unifying them is desirable but is a separate scope. This spec only integrates the missing periods into the V2 scanner, which is the primary production scanner.

The V1 scanner (`scanDateRange`) and `smartSearch` should receive the same treatment eventually, but deferring avoids a large refactor that blocks the immediate trust gap fix.

### 2.5 Updated Scoring Budget

After integration, the V2 scanner's scoring factors:

| Factor | Range | Notes |
|--------|-------|-------|
| Panchang (tithi+nak+yoga+karana+weekday+panchaka) | 0-25 | Unchanged |
| Transit (benefics/malefics, Pushkar) | 0-25 | Unchanged |
| Timing (hora+choghadiya+Rahu Kaal+**Abhijit**) | 0-25 | +8 bonus for Abhijit added |
| Lagna | -3 to +8 | Unchanged |
| Navamsha Shuddhi | -2 to +4 | Unchanged |
| Krishna Paksha adjustment | 0 to -6 | Unchanged |
| Holashtak | 0 or -8 | Unchanged |
| Tara Bala (personal) | 0 or 10 | Unchanged |
| Chandra Bala (personal) | 0 or 10 | Unchanged |
| Dasha Harmony | 0-10 | Unchanged |
| Inauspicious periods | 0-10 | Now includes Dur Muhurtam (-3), Varjyam (-3). Vishti reduced to -1. |

The `maxRaw` denominator in `scanDateRangeV2` does NOT need to change — the timing factor is already capped at 25, and inauspicious is already scored as 0-10. The Abhijit bonus goes into the timing bucket (capped at 25). The new inauspicious penalties go into the existing inauspicious bucket (capped at 0-10).

### 2.6 Verification

1. `npx tsc --noEmit -p tsconfig.build-check.json` — zero errors
2. `npx vitest run` — all existing tests pass
3. `npx next build` — zero errors
4. **New test:** Add a test in `src/lib/__tests__/muhurta-integration.test.ts` that:
   - Scores a window during Durmuhurtam — verify penalty is applied
   - Scores a window during Abhijit (not Wednesday) — verify bonus is applied
   - Scores a window during Abhijit on Wednesday — verify no bonus
   - Scores a window during Varjyam — verify penalty is applied
   - Scores a window during Vishti — verify combined penalty is -6, not -9
5. **Spot-check:** For 2026-05-04, Corseaux:
   - Look up Durmuhurtam times on panchang page
   - Run muhurta scanner for a window overlapping Durmuhurtam
   - Confirm the score is lower than an adjacent non-Durmuhurtam window
   - Same for Abhijit — midday window should score higher than adjacent windows (if not Wednesday)

---

## Execution Order

1. **Phase 1A** — Fix bugs 1-3 in `panchang-calc.ts` (yoga, lagna, output field)
2. **Phase 1B** — Consolidate Module A into Module B, delete `astronomy/ayanamsa.ts`
3. **Phase 1C** — Clean up hardcoded approximations in `transit-activation.ts` and `chart-narrative.ts`
4. **Phase 2A** — Extract shared constants (Dur Muhurtam tables, Varjyam ghati offsets)
5. **Phase 2B** — Add `computeDurMuhurtam()` to `inauspicious-periods.ts`, integrate into `computeInauspiciousForWindow()`
6. **Phase 2C** — Add Abhijit bonus to `scoreTimingFactors()` in `ai-recommender.ts`
7. **Phase 2D** — Add Varjyam check to `computeInauspiciousForWindow()`
8. **Phase 2E** — Fix Vishti double-counting (reduce inauspicious penalty to -1)
9. **Phase 2F** — Write integration tests
10. **Verify** — full test suite, build, browser check, spot-check against Prokerala

---

## Out of Scope

- Unifying the three scanners (V1, V2, smartSearch) — separate effort
- Plumbing user ayanamsha through all downstream consumers (shadbala, sade-sati, etc.) — follow-up for KP/Raman users
- Godhuli Lagna, Tithi-Gandanthara, planets-in-ascendant override — documented gaps, separate spec
- Formal MuhurtaRule interface / Rule Registry pattern — architectural evolution, not needed for this integration
- V1 festival engine deprecation — separate cleanup

---

## Risk Assessment

- **Phase 1:** Low risk. The three bugs are straightforward one-line fixes. Module consolidation is a rename-and-redirect with identical polynomial constants.
- **Phase 2:** Medium risk. The Varjyam integration requires computing Moon's position within a nakshatra, which is an approximation. Edge cases: nakshatra transitions mid-window, short nakshatras (< 20 hours). Mitigation: use the same approach as `panchang-calc.ts` which is already verified against Prokerala.
- **Scoring balance:** Adding Abhijit (+8) and new penalties (Dur Muhurtam -3, Varjyam -3) changes the score distribution. Existing "good" windows may shift by 5-10 points. This is intentional — the current scores are inaccurate because they ignore these periods. But we should verify that the top-recommended windows still look reasonable (not all suddenly 40/100).
