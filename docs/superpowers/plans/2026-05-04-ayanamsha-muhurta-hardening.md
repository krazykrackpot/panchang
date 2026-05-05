# Ayanamsha Consistency + Muhurta Rules Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate ayanamsha to one canonical module, fix 3 bugs where user ayanamsha is ignored, and integrate Durmuhurtam/Abhijit/Varjyam into the muhurta scoring engine so it no longer recommends windows during known inauspicious periods.

**Architecture:** Phase 1 merges the duplicate `astronomy/ayanamsa.ts` into the canonical `ephem/astronomical.ts`, fixes 3 call sites in `panchang-calc.ts` that ignore user ayanamsha, and removes 2 hardcoded approximations. Phase 2 extracts Dur Muhurtam and Varjyam tables into shared constants, wires them into the muhurta inauspicious-period checker, adds an Abhijit bonus to timing scoring, and fixes Vishti double-counting.

**Tech Stack:** TypeScript, Vitest, Next.js (build check only — no UI changes)

**Spec:** `docs/superpowers/specs/2026-05-04-ayanamsha-muhurta-hardening-design.md`

---

## File Map

### Phase 1 — Ayanamsha Consolidation

| Action | File | Responsibility |
|--------|------|----------------|
| Delete | `src/lib/astronomy/ayanamsa.ts` | Duplicate ayanamsha module (3 types, polynomial-only) |
| Modify | `src/lib/ephem/panchang-calc.ts` | Fix 3 bugs: yoga, lagna table, output field |
| Modify | `src/lib/kundali/chart.ts` | Redirect imports from Module A → Module B |
| Modify | `src/lib/kundali/types.ts` | Redirect `AyanamsaType` import |
| Modify | `src/lib/panchang/calculator.ts` | Redirect imports |
| Modify | `src/lib/kp/kp-chart.ts` | Redirect `getAyanamsa` import |
| Modify | `src/components/kundali/AyanamshaComparison.tsx` | Redirect imports |
| Modify | `src/app/[locale]/sky-map/page.tsx` | Redirect imports |
| Modify | `src/lib/kundali/domain-synthesis/transit-activation.ts` | Replace hardcoded linear approximation |
| Modify | `src/lib/kundali/chart-narrative.ts` | Replace magic `24.18` fallback |

### Phase 2 — Muhurta Rules Integration

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/lib/constants/dur-muhurtam.ts` | Shared Dur Muhurtam lookup tables (Kaala Prakashika + Nirnaya Sindhu) |
| Create | `src/lib/constants/varjyam.ts` | Shared Varjyam + Amrit Kalam ghati offset tables |
| Modify | `src/lib/ephem/panchang-calc.ts` | Import tables from shared constants instead of inline |
| Modify | `src/lib/muhurta/ai-recommender.ts` | Add `moonSid` to `PanchangSnapshot`, add Abhijit bonus to `scoreTimingFactors()` |
| Modify | `src/lib/muhurta/inauspicious-periods.ts` | Add Dur Muhurtam + Varjyam checks, fix Vishti penalty |
| Modify | `src/lib/muhurta/time-window-scanner.ts` | Pass `moonSid` to `computeInauspiciousForWindow()` |
| Create | `src/lib/__tests__/muhurta-integration.test.ts` | Integration tests for new scoring factors |

---

## Task 1: Fix 3 Ayanamsha Bugs in panchang-calc.ts

**Files:**
- Modify: `src/lib/ephem/panchang-calc.ts:936` (yoga), `:1253` (output), `:1586` (lagna)

- [ ] **Step 1: Fix yoga calculation to pass user ayanamsha**

In `src/lib/ephem/panchang-calc.ts`, find line 936:
```typescript
const yogaNum = calculateYoga(jdSunrise);
```
Replace with:
```typescript
const yogaNum = calculateYoga(jdSunrise, userAyanamsha);
```
The variable `userAyanamsha` is already destructured at line 882 from `input.ayanamshaValue`. The function `calculateYoga` already accepts an optional `ayanamshaValue` parameter (see `astronomical.ts:326`).

- [ ] **Step 2: Fix output ayanamsha field to reflect actual value used**

In `src/lib/ephem/panchang-calc.ts`, find line 1253:
```typescript
const ayanamsha = lahiriAyanamsha(jdSunrise);
```
Replace with:
```typescript
const ayanamsha = userAyanamsha ?? lahiriAyanamsha(jdSunrise);
```

- [ ] **Step 3: Fix lagna table to use user ayanamsha**

In `src/lib/ephem/panchang-calc.ts`, find line 1586:
```typescript
const lagnaAyanamsha = lahiriAyanamsha(jdSunrise);
```
Replace with:
```typescript
const lagnaAyanamsha = userAyanamsha ?? lahiriAyanamsha(jdSunrise);
```

- [ ] **Step 4: Run tests and build**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json
```
Expected: all pass — these are one-line changes that don't change Lahiri behaviour (the default).

- [ ] **Step 5: Commit**

```bash
git add src/lib/ephem/panchang-calc.ts
git commit -m "fix: pass user ayanamsha to yoga calc, lagna table, and output field

Three call sites in computePanchang() were hardwired to Lahiri,
ignoring the user's ayanamsha choice (KP, Raman, etc.):
- calculateYoga() called without ayanamshaValue
- lagna table used lahiriAyanamsha() directly
- output ayanamsha field always showed Lahiri value

No change for default Lahiri users (~95%). KP/Raman users now
get consistent yoga, lagna, and reported ayanamsha values."
```

---

## Task 2: Consolidate Ayanamsha Module A into Module B

**Files:**
- Delete: `src/lib/astronomy/ayanamsa.ts`
- Modify: `src/lib/kundali/chart.ts:10`
- Modify: `src/lib/kundali/types.ts:2`
- Modify: `src/lib/panchang/calculator.ts:15-16`
- Modify: `src/lib/kp/kp-chart.ts:17`
- Modify: `src/components/kundali/AyanamshaComparison.tsx:4`
- Modify: `src/app/[locale]/sky-map/page.tsx:11`

- [ ] **Step 1: Update `src/lib/kundali/chart.ts` imports**

Find line 10:
```typescript
import { getAyanamsa, tropicalToSidereal, type AyanamsaType } from '../astronomy/ayanamsa';
```
Replace with:
```typescript
import { getAyanamsha as getAyanamsa, toSidereal as tropicalToSidereal, type AyanamshaType as AyanamsaType } from '../ephem/astronomical';
```
Note: Module B uses `getAyanamsha` (with 'h'), `toSidereal`, and `AyanamshaType` (with 'h'). We alias to preserve the existing variable names used throughout this file so we don't have to rename every call site.

- [ ] **Step 2: Update `src/lib/kundali/types.ts` import**

Find line 2:
```typescript
import type { AyanamsaType } from '../astronomy/ayanamsa';
```
Replace with:
```typescript
import type { AyanamshaType as AyanamsaType } from '../ephem/astronomical';
```

- [ ] **Step 3: Update `src/lib/panchang/calculator.ts` imports**

Find lines 15-16:
```typescript
import { getAyanamsa, tropicalToSidereal } from '../astronomy/ayanamsa';
import type { AyanamsaType } from '../astronomy/ayanamsa';
```
Replace with:
```typescript
import { getAyanamsha as getAyanamsa, toSidereal as tropicalToSidereal, type AyanamshaType as AyanamsaType } from '../ephem/astronomical';
```

- [ ] **Step 4: Update `src/lib/kp/kp-chart.ts` import**

Find line 17:
```typescript
import { getAyanamsa } from '@/lib/astronomy/ayanamsa';
```
Replace with:
```typescript
import { getAyanamsha as getAyanamsa } from '@/lib/ephem/astronomical';
```

- [ ] **Step 5: Update `src/components/kundali/AyanamshaComparison.tsx` import**

Find line 4:
```typescript
import { getAyanamsa, type AyanamsaType } from '@/lib/astronomy/ayanamsa';
```
Replace with:
```typescript
import { getAyanamsha as getAyanamsa, type AyanamshaType as AyanamsaType } from '@/lib/ephem/astronomical';
```

- [ ] **Step 6: Update `src/app/[locale]/sky-map/page.tsx` import**

Find line 11:
```typescript
import { getAyanamsa, tropicalToSidereal } from '@/lib/astronomy/ayanamsa';
```
Replace with:
```typescript
import { getAyanamsha as getAyanamsa, toSidereal as tropicalToSidereal } from '@/lib/ephem/astronomical';
```

- [ ] **Step 7: Delete the old module**

```bash
rm src/lib/astronomy/ayanamsa.ts
```

- [ ] **Step 8: Run tests and build to verify no broken imports**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json && npx next build
```
Expected: all pass. The polynomial constants are identical between the two modules, so results are unchanged. Module B also delegates to Swiss Ephemeris when available (an upgrade for consumers that previously only had polynomial).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: consolidate ayanamsha into single canonical module

Deleted src/lib/astronomy/ayanamsa.ts (3 types, polynomial-only).
All 6 consumers now import from src/lib/ephem/astronomical.ts
(11 types, Swiss Ephemeris when available, polynomial fallback).

Import aliases preserve existing variable names (getAyanamsa,
tropicalToSidereal, AyanamsaType) to minimise diff."
```

---

## Task 3: Clean Up Hardcoded Ayanamsha Approximations

**Files:**
- Modify: `src/lib/kundali/domain-synthesis/transit-activation.ts:22-26,88-89`
- Modify: `src/lib/kundali/chart-narrative.ts:196`

- [ ] **Step 1: Fix transit-activation.ts — replace linear approximation with canonical function**

In `src/lib/kundali/domain-synthesis/transit-activation.ts`, find the imports (around line 13):
```typescript
import { dateToJD } from '@/lib/astronomy/julian';
```
Add the ayanamsha import after it:
```typescript
import { lahiriAyanamsha } from '@/lib/ephem/astronomical';
```

Then find lines 22-26:
```typescript
/** Lahiri Ayanamsha at J2000.0 (degrees). */
const AYANAMSHA_J2000 = 23.85;

/** Rate of precession (degrees per Julian year). */
const AYANAMSHA_RATE = 0.01396;
```
Delete these 4 lines (the constants).

Then find the usage (around line 88-89):
```typescript
  const ayanamsha = AYANAMSHA_J2000 + AYANAMSHA_RATE * years;
```
Replace with:
```typescript
  const ayanamsha = lahiriAyanamsha(jd);
```
The variable `jd` is already in scope (passed as the function parameter). After this change, check if `years` (line `const years = days / 365.25;`) is still used elsewhere in the function. If not, remove it and `days` too if unused.

- [ ] **Step 2: Fix chart-narrative.ts — replace magic 24.18 fallback**

In `src/lib/kundali/chart-narrative.ts`, find line 196:
```typescript
    const moonSidLng = moon.longitude - (kundali.ayanamshaValue || 24.18);
```
Replace with:
```typescript
    // 24.21 = Lahiri ayanamsha for ~2026 — fallback only; ayanamshaValue should always be set
    const moonSidLng = moon.longitude - (kundali.ayanamshaValue ?? 24.21);
```
The `ayanamshaValue` is always set on a fully computed kundali, so this fallback is a safety net. Using `??` (nullish coalesce) instead of `||` (falsy) is correct — ayanamsha can never be 0.

- [ ] **Step 3: Run tests and build**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json
```
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/kundali/domain-synthesis/transit-activation.ts src/lib/kundali/chart-narrative.ts
git commit -m "fix: replace hardcoded ayanamsha approximations with canonical function

transit-activation.ts: replaced linear AYANAMSHA_J2000 + rate*years
with lahiriAyanamsha(jd) from the canonical module.

chart-narrative.ts: replaced stale magic fallback 24.18 with current
approximate value and added comment explaining it's a fallback."
```

---

## Task 4: Extract Shared Dur Muhurtam Constants

**Files:**
- Create: `src/lib/constants/dur-muhurtam.ts`
- Modify: `src/lib/ephem/panchang-calc.ts:1293-1310`

- [ ] **Step 1: Create the shared constant file**

Create `src/lib/constants/dur-muhurtam.ts`:
```typescript
/**
 * Dur Muhurtam (inauspicious muhurta) lookup tables.
 *
 * Each entry is an array of 0-indexed muhurta indices for that weekday.
 * The day is divided into 15 muhurtas from sunrise to sunset.
 * Muhurta duration = (sunset - sunrise) / 15.
 *
 * Sources:
 *   A: Kaala Prakashika / South Indian (matches Prokerala, Drik Panchang)
 *   B: Nirṇaya Sindhu / North Indian (older Dharma Sindhu lineage)
 *
 * Verified against Prokerala Apr 5-11, 2026.
 * Weekday index: 0=Sunday (matches JD weekday convention).
 */

/** Kaala Prakashika tradition (primary — matches modern panchangs) */
export const DUR_MUHURTAM_A: readonly number[][] = [
  [13],    // Sunday    — 14th muhurta
  [8, 11], // Monday    — 9th & 12th muhurta
  [3],     // Tuesday   — 4th muhurta
  [7],     // Wednesday — 8th muhurta
  [5, 11], // Thursday  — 6th & 12th muhurta
  [3, 8],  // Friday    — 4th & 9th muhurta
  [2],     // Saturday  — 3rd muhurta
] as const;

/** Nirṇaya Sindhu tradition (alternate) */
export const DUR_MUHURTAM_B: readonly number[][] = [
  [6, 10], // Sunday    — 7th & 11th muhurta
  [5],     // Monday    — 6th muhurta
  [7],     // Tuesday   — 8th muhurta
  [7],     // Wednesday — 8th muhurta
  [3],     // Thursday  — 4th muhurta
  [4, 8],  // Friday    — 5th & 9th muhurta
  [1],     // Saturday  — 2nd muhurta
] as const;
```

- [ ] **Step 2: Update panchang-calc.ts to import from shared constants**

In `src/lib/ephem/panchang-calc.ts`, add import at top (with other constant imports around line 12):
```typescript
import { DUR_MUHURTAM_A, DUR_MUHURTAM_B } from '@/lib/constants/dur-muhurtam';
```

Then find the inline table definitions (lines 1293-1310) — the block starting with:
```typescript
  const DUR_MUHURTAM_A: number[][] = [ // Kaala Prakashika (verified against Prokerala Apr 5-11 2026)
```
and ending with:
```typescript
  ];
```
Delete both `const DUR_MUHURTAM_A` and `const DUR_MUHURTAM_B` declarations (keep the `formatDurWindows` function and everything after).

- [ ] **Step 3: Run tests and build**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json
```
Expected: all pass — pure extraction, no behaviour change.

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants/dur-muhurtam.ts src/lib/ephem/panchang-calc.ts
git commit -m "refactor: extract Dur Muhurtam tables to shared constants

Moved DUR_MUHURTAM_A (Kaala Prakashika) and DUR_MUHURTAM_B (Nirnaya
Sindhu) from inline definitions in panchang-calc.ts to a shared
constant file. Both panchang display and muhurta scoring will import
from the same source."
```

---

## Task 5: Extract Shared Varjyam Constants

**Files:**
- Create: `src/lib/constants/varjyam.ts`
- Modify: `src/lib/ephem/panchang-calc.ts:358-386`

- [ ] **Step 1: Create the shared constant file**

Create `src/lib/constants/varjyam.ts`:
```typescript
/**
 * Varjyam (Thyajyam) and Amrit Kalam ghati offset tables.
 *
 * Source: Prashna Marga Ch.7 (Thyajya Nakshatra Bhoga), WisdomLib edition.
 * Cross-validated against Prokerala Panchang (±1-5 min agreement).
 *
 * IMPORTANT: 1 ghati = 1/60th of the nakshatra's ACTUAL duration (NOT fixed 24 min).
 * Offset formula: nakshatra_start + (ghati / 60) * nakshatra_duration
 * Duration of window: 4 ghatis = (4/60) * nakshatra_duration
 * Accuracy ceiling: ±12 min (inherent to integer-ghati classical tables).
 *
 * Array index: nakshatra number - 1 (0=Ashwini, 26=Revati).
 */

/** Primary Varjyam ghati offset from nakshatra start (0-indexed by nakshatra) */
export const VARJYAM_GHATI: readonly number[] = [
  50, 24, 30, 40, 15,  // Ashwini(1)-Mrigashira(5)
  21, 30, 20, 32, 30,  // Ardra(6)-Magha(10) — Ardra=21, Punarvasu=30, Pushya=20
  20, 18, 22, 20, 14,  // P.Phalguni(11)-Swati(15) — U.Phalguni=18
  14, 10, 14, 20, 24,  // Vishakha(16)-P.Ashadha(20)
  20, 10, 10, 18, 16,  // U.Ashadha(21)-P.Bhadra(25)
  26, 30,              // U.Bhadra(26)-Revati(27)
] as const;

/**
 * Secondary Varjyam offset for nakshatras with dual Thyajyam (Prashna Marga 7.18).
 * -1 means no second window. Only Mula(19) has dual windows at 20 and 56 ghatis.
 */
export const VARJYAM_GHATI_2: readonly number[] = [
  -1, -1, -1, -1, -1,  // Ashwini(1)-Mrigashira(5)
  -1, -1, -1, -1, -1,  // Ardra(6)-Magha(10)
  -1, -1, -1, -1, -1,  // P.Phalguni(11)-Swati(15)
  -1, -1, -1, 56, -1,  // Vishakha(16)-P.Ashadha(20) — Mula(19) dual
  -1, -1, -1, -1, -1,  // U.Ashadha(21)-P.Bhadra(25)
  -1, -1,              // U.Bhadra(26)-Revati(27)
] as const;

/** Amrit Kalam ghati offset from nakshatra start (Prashna Marga Ch.7) */
export const AMRIT_GHATI: readonly number[] = [
  42, 48, 54, 52, 38,  // Ashwini(1)-Mrigashira(5)
  35, 54, 44, 56, 54,  // Ardra(6)-Magha(10)
  44, 42, 45, 44, 38,  // P.Phalguni(11)-Swati(15)
  38, 34, 38, 44, 48,  // Vishakha(16)-P.Ashadha(20)
  38, 34, 43, 42, 40,  // U.Ashadha(21)-P.Bhadra(25)
  49, 54,              // U.Bhadra(26)-Revati(27)
] as const;

/** Duration of Varjyam/Amrit windows in ghatis */
export const WINDOW_DURATION_GHATI = 4;
```

- [ ] **Step 2: Update panchang-calc.ts to import from shared constants**

In `src/lib/ephem/panchang-calc.ts`, add import at top:
```typescript
import { VARJYAM_GHATI, VARJYAM_GHATI_2, AMRIT_GHATI } from '@/lib/constants/varjyam';
```

Then find the inline definitions (lines 358-386) — the block from:
```typescript
const VARJYAM_GHATI: number[] = [
```
through to the end of `AMRIT_GHATI`. Delete all three inline `const` declarations. Keep the `computeAmritVarjyamForNakshatra()` function and the `TimeWindow`/`UTWindow` interfaces.

Note: the function uses `4 * ghatiToHrs` for window duration — this matches `WINDOW_DURATION_GHATI` but doesn't need to import it since it's a simple literal.

- [ ] **Step 3: Run tests and build**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json
```
Expected: all pass — pure extraction.

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants/varjyam.ts src/lib/ephem/panchang-calc.ts
git commit -m "refactor: extract Varjyam and Amrit Kalam tables to shared constants

Moved VARJYAM_GHATI, VARJYAM_GHATI_2, and AMRIT_GHATI from inline
definitions in panchang-calc.ts to src/lib/constants/varjyam.ts.
Both panchang display and muhurta scoring import from this source."
```

---

## Task 6: Add moonSid to PanchangSnapshot

**Files:**
- Modify: `src/lib/muhurta/ai-recommender.ts:18-25,299-319`

- [ ] **Step 1: Add moonSid to the PanchangSnapshot interface**

In `src/lib/muhurta/ai-recommender.ts`, find the interface (lines 18-25):
```typescript
export interface PanchangSnapshot {
  tithi: number;
  nakshatra: number;
  yoga: number;
  karana: number;
  weekday: number;
  moonSign: number;
}
```
Replace with:
```typescript
export interface PanchangSnapshot {
  tithi: number;
  nakshatra: number;
  yoga: number;
  karana: number;
  weekday: number;
  moonSign: number;
  moonSid: number;  // Moon's sidereal longitude (degrees) — needed for Varjyam check
}
```

- [ ] **Step 2: Return moonSid from getPanchangSnapshot()**

Find lines 299-319. The function already computes `moonSid` on line 302 but discards it. Update the return statement to include it:

Find:
```typescript
  return {
    tithi: tithiResult.number,
    nakshatra,
    yoga,
    karana,
    weekday,
    moonSign,
  };
```
Replace with:
```typescript
  return {
    tithi: tithiResult.number,
    nakshatra,
    yoga,
    karana,
    weekday,
    moonSign,
    moonSid,
  };
```

- [ ] **Step 3: Run tests and build**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json
```
Expected: all pass — additive change, no existing consumer uses `moonSid` yet.

- [ ] **Step 4: Commit**

```bash
git add src/lib/muhurta/ai-recommender.ts
git commit -m "feat: expose moonSid in PanchangSnapshot for Varjyam scoring

The Moon's sidereal longitude was already computed inside
getPanchangSnapshot() but discarded. Now returned so the muhurta
scanner can check Varjyam overlap from degree position."
```

---

## Task 7: Integrate Dur Muhurtam + Varjyam into Inauspicious Periods, Fix Vishti

**Files:**
- Modify: `src/lib/muhurta/inauspicious-periods.ts`

- [ ] **Step 1: Add Dur Muhurtam computation**

In `src/lib/muhurta/inauspicious-periods.ts`, add import at top:
```typescript
import { DUR_MUHURTAM_A } from '@/lib/constants/dur-muhurtam';
import { VARJYAM_GHATI, VARJYAM_GHATI_2 } from '@/lib/constants/varjyam';
```

After the `computeGulikaKaal()` function (after line 46), add:

```typescript
/**
 * Compute Dur Muhurtam windows for a day.
 * The day is divided into 15 muhurtas from sunrise to sunset.
 * Returns 1-2 TimeRange entries depending on weekday.
 *
 * Source: Kaala Prakashika (matches Prokerala, Drik Panchang).
 * Weekday: 0=Sunday (JD convention).
 */
export function computeDurMuhurtam(sunriseUT: number, sunsetUT: number, weekday: number): TimeRange[] {
  const muhurtaDuration = (sunsetUT - sunriseUT) / 15;
  const indices = DUR_MUHURTAM_A[weekday] || [7];
  return indices.map(idx => ({
    start: sunriseUT + idx * muhurtaDuration,
    end: sunriseUT + (idx + 1) * muhurtaDuration,
  }));
}

/**
 * Check if Moon's current sidereal position falls within Varjyam.
 *
 * Varjyam is defined by ghati offsets within a nakshatra. Since 1 ghati = 1/60th
 * of the nakshatra's extent (13.333°), we convert Moon's degree position within
 * its current nakshatra to a ghati position and check against the table.
 *
 * Accuracy: ±5-10 min (Moon's speed varies ±10% from mean), within the ±12 min
 * accuracy ceiling of the classical integer-ghati tables (Prashna Marga Ch.7).
 *
 * @param moonSid - Moon's sidereal longitude in degrees
 * @returns true if currently in Varjyam window
 */
export function isVarjyamActive(moonSid: number): boolean {
  const nakExtent = 360 / 27; // 13.333°
  const degInNak = ((moonSid % nakExtent) + nakExtent) % nakExtent;
  const ghatiPosition = (degInNak / nakExtent) * 60;
  const nakIdx = Math.floor(((moonSid % 360 + 360) % 360) / nakExtent); // 0-26

  if (nakIdx < 0 || nakIdx >= 27) return false;

  // Primary Varjyam window (4 ghatis wide)
  const v1Start = VARJYAM_GHATI[nakIdx];
  if (ghatiPosition >= v1Start && ghatiPosition < v1Start + 4) return true;

  // Secondary Varjyam (dual Thyajyam — only Mula)
  const v2Start = VARJYAM_GHATI_2[nakIdx];
  if (v2Start >= 0 && ghatiPosition >= v2Start && ghatiPosition < v2Start + 4) return true;

  return false;
}
```

- [ ] **Step 2: Update computeInauspiciousForWindow() to include Dur Muhurtam and Varjyam**

Update the function signature to accept `moonSid`:

Find:
```typescript
export function computeInauspiciousForWindow(
  windowStartUT: number,
  windowEndUT: number,
  sunriseUT: number,
  sunsetUT: number,
  weekday: number,
  nakshatra: number,
  jd: number,
  tz: number,
): InauspiciousPeriod[] {
```
Replace with:
```typescript
export function computeInauspiciousForWindow(
  windowStartUT: number,
  windowEndUT: number,
  sunriseUT: number,
  sunsetUT: number,
  weekday: number,
  nakshatra: number,
  jd: number,
  tz: number,
  moonSid?: number,
): InauspiciousPeriod[] {
```
The `moonSid` is optional for backward compatibility — existing callers that don't pass it simply won't get Varjyam checks.

Then, after the Vishti check (after line 120, before the `return periods;`), add:

```typescript
  // Dur Muhurtam — inauspicious muhurta windows (1-2 per day)
  const durWindows = computeDurMuhurtam(sunriseUT, sunsetUT, weekday);
  for (const dw of durWindows) {
    if (rangesOverlap(windowStartUT, windowEndUT, dw.start, dw.end)) {
      periods.push({
        name: 'Dur Muhurtam',
        startTime: formatHour(dw.start, tz),
        endTime: formatHour(dw.end, tz),
        active: true,
      });
      break; // One penalty even if window overlaps two Dur Muhurtam slots
    }
  }

  // Varjyam — "time of poison" from nakshatra-based ghati offsets
  if (moonSid !== undefined && isVarjyamActive(moonSid)) {
    periods.push({
      name: 'Varjyam',
      startTime: formatHour(windowStartUT, tz),
      endTime: formatHour(windowEndUT, tz),
      active: true,
    });
  }
```

- [ ] **Step 3: Fix Vishti double-counting in computeInauspiciousPenalty()**

Find in `computeInauspiciousPenalty()`:
```typescript
      case 'Vishti (Bhadra)': penalty += 4; break;
```
Replace with:
```typescript
      case 'Vishti (Bhadra)': penalty += 1; break; // Reduced: main penalty (-5) is in scorePanchangFactors
```

Add the new period penalties:
```typescript
      case 'Dur Muhurtam': penalty += 3; break;
      case 'Varjyam': penalty += 3; break;
```

The full `computeInauspiciousPenalty` should now look like:
```typescript
export function computeInauspiciousPenalty(periods: InauspiciousPeriod[]): number {
  let penalty = 0;
  for (const p of periods) {
    if (!p.active) continue;
    switch (p.name) {
      case 'Rahu Kaal': penalty += 4; break;
      case 'Yamaganda': penalty += 3; break;
      case 'Gulika Kaal': penalty += 2; break;
      case 'Vishti (Bhadra)': penalty += 1; break; // Reduced: main penalty (-5) is in scorePanchangFactors
      case 'Dur Muhurtam': penalty += 3; break;
      case 'Varjyam': penalty += 3; break;
    }
  }
  return Math.max(0, 10 - penalty);
}
```

- [ ] **Step 4: Run tests and build**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json
```
Expected: all pass. The `moonSid` parameter is optional, so existing callers are unaffected.

- [ ] **Step 5: Commit**

```bash
git add src/lib/muhurta/inauspicious-periods.ts src/lib/constants/dur-muhurtam.ts src/lib/constants/varjyam.ts
git commit -m "feat: integrate Dur Muhurtam + Varjyam into muhurta inauspicious scoring

- computeDurMuhurtam(): converts weekday muhurta indices to time ranges
- isVarjyamActive(): checks Moon's degree position against ghati offsets
- Both now checked in computeInauspiciousForWindow()
- Vishti penalty reduced from -4 to -1 (main -5 already in panchang scoring)
- Dur Muhurtam penalty: -3, Varjyam penalty: -3"
```

---

## Task 8: Add Abhijit Muhurta Bonus to Timing Scoring

**Files:**
- Modify: `src/lib/muhurta/ai-recommender.ts:230-293`

- [ ] **Step 1: Add Abhijit bonus to scoreTimingFactors()**

In `src/lib/muhurta/ai-recommender.ts`, find the `scoreTimingFactors()` function. After the Rahu Kaal check (after line 291, before the `return` statement), add:

```typescript
  // Abhijit Muhurta — 8th daytime muhurta (around midday)
  // Universally auspicious EXCEPT Wednesdays (Muhurta Chintamani, Dharma Sindhu).
  // "On Budha-vara (Wednesday), Abhijit Muhurta is inauspicious and should be avoided."
  const dayMuhurtaDuration = (sunsetLocal - sunriseLocal) / 15;
  const abhijitStartLocal = sunriseLocal + 7 * dayMuhurtaDuration;
  const abhijitEndLocal = abhijitStartLocal + dayMuhurtaDuration;
  const isWednesday = weekday === 3; // 0=Sunday convention

  if (!isWednesday && hourOfDay >= abhijitStartLocal && hourOfDay < abhijitEndLocal) {
    score += 8;
    factors.push({ en: 'Abhijit Muhurta — universally auspicious', hi: 'अभिजित् मुहूर्त — सर्वशुभ', sa: 'अभिजित्मुहूर्तः — सर्वशुभः' });
  }
```

- [ ] **Step 2: Run tests and build**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json
```
Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add src/lib/muhurta/ai-recommender.ts
git commit -m "feat: add Abhijit Muhurta bonus (+8) to muhurta timing scoring

The 8th daytime muhurta (around midday) is universally auspicious
per Muhurta Chintamani, except on Wednesdays. +8 bonus is strong
but doesn't override bad panchang factors (hora=+12, choghadiya=+10
for comparison)."
```

---

## Task 9: Wire moonSid Through the V2 Scanner

**Files:**
- Modify: `src/lib/muhurta/time-window-scanner.ts:416-421`

- [ ] **Step 1: Pass moonSid to computeInauspiciousForWindow()**

In `src/lib/muhurta/time-window-scanner.ts`, find the call to `computeInauspiciousForWindow` (around line 416):

```typescript
      const inauspiciousPeriods = computeInauspiciousForWindow(
        windowStartUT, windowEndUT,
        sunriseUT, sunsetUT,
        snap.weekday, snap.nakshatra,
        jdMid, tz,
      );
```
Replace with:
```typescript
      const inauspiciousPeriods = computeInauspiciousForWindow(
        windowStartUT, windowEndUT,
        sunriseUT, sunsetUT,
        snap.weekday, snap.nakshatra,
        jdMid, tz,
        snap.moonSid,
      );
```

- [ ] **Step 2: Run tests and build**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json
```
Expected: all pass. The V2 scanner now passes `moonSid` from the snapshot, enabling Varjyam scoring.

- [ ] **Step 3: Commit**

```bash
git add src/lib/muhurta/time-window-scanner.ts
git commit -m "feat: wire moonSid through V2 scanner to enable Varjyam scoring

The V2 scanner now passes snap.moonSid to computeInauspiciousForWindow(),
completing the Varjyam integration. Windows during Varjyam now receive
a -3 penalty in the inauspicious scoring bucket."
```

---

## Task 10: Write Integration Tests

**Files:**
- Create: `src/lib/__tests__/muhurta-integration.test.ts`

- [ ] **Step 1: Write the test file**

Create `src/lib/__tests__/muhurta-integration.test.ts`:
```typescript
/**
 * Integration tests for muhurta scoring — Dur Muhurtam, Abhijit, Varjyam, Vishti.
 *
 * These verify that the scoring engine correctly applies bonuses/penalties
 * for periods that were previously computed but not integrated.
 */
import { describe, it, expect } from 'vitest';
import {
  computeInauspiciousForWindow,
  computeInauspiciousPenalty,
  computeDurMuhurtam,
  isVarjyamActive,
} from '@/lib/muhurta/inauspicious-periods';
import { scoreTimingFactors } from '@/lib/muhurta/ai-recommender';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { DUR_MUHURTAM_A } from '@/lib/constants/dur-muhurtam';
import { VARJYAM_GHATI } from '@/lib/constants/varjyam';

describe('Dur Muhurtam integration', () => {
  it('computeDurMuhurtam returns correct number of windows per weekday', () => {
    // Sunday: 1 window (13th muhurta), Monday: 2 windows (8th & 11th)
    const sunday = computeDurMuhurtam(6, 18, 0); // sunrise 6UT, sunset 18UT, Sunday
    expect(sunday).toHaveLength(1);
    const monday = computeDurMuhurtam(6, 18, 1);
    expect(monday).toHaveLength(2);
  });

  it('computeDurMuhurtam windows have correct time ranges', () => {
    // Sunday sunrise 6UT, sunset 18UT → 12h day → muhurta = 48min = 0.8h
    // 13th muhurta (0-indexed) → start = 6 + 13*0.8 = 16.4UT
    const windows = computeDurMuhurtam(6, 18, 0);
    expect(windows[0].start).toBeCloseTo(16.4, 1);
    expect(windows[0].end).toBeCloseTo(17.2, 1);
  });

  it('Dur Muhurtam penalty is applied when window overlaps', () => {
    // Sunday: Dur Muhurtam at 13th muhurta = 16.4-17.2 UT (sunrise 6, sunset 18)
    // Score a window at 16.5-17.0 UT (overlaps)
    const periods = computeInauspiciousForWindow(
      16.5, 17.0,  // window
      6, 18,       // sunrise, sunset
      0,           // Sunday
      1,           // nakshatra (irrelevant here)
      2460800,     // JD (approximate)
      0,           // tz=UTC
    );
    const durPeriod = periods.find(p => p.name === 'Dur Muhurtam');
    expect(durPeriod).toBeDefined();
    expect(durPeriod!.active).toBe(true);
  });

  it('no Dur Muhurtam penalty when window does not overlap', () => {
    // Sunday: Dur Muhurtam at 16.4-17.2. Window at 10-11 UT (no overlap)
    const periods = computeInauspiciousForWindow(
      10, 11,
      6, 18,
      0, 1, 2460800, 0,
    );
    const durPeriod = periods.find(p => p.name === 'Dur Muhurtam');
    expect(durPeriod).toBeUndefined();
  });
});

describe('Varjyam integration', () => {
  it('detects Varjyam when Moon is in the window', () => {
    // Ashwini (nakshatra 1, index 0): Varjyam at ghati 50-54 of 60
    // Ashwini spans 0° to 13.333°. Ghati 50 = 50/60 * 13.333 = 11.111°
    const moonSidInVarjyam = 11.2; // ~ghati 50.4 of Ashwini
    expect(isVarjyamActive(moonSidInVarjyam)).toBe(true);
  });

  it('does not detect Varjyam when Moon is outside the window', () => {
    // Ashwini: Varjyam at ghati 50-54. Ghati 30 = 30/60 * 13.333 = 6.667°
    const moonSidOutside = 6.7; // ~ghati 30 of Ashwini
    expect(isVarjyamActive(moonSidOutside)).toBe(false);
  });

  it('detects secondary Varjyam for Mula (dual Thyajyam)', () => {
    // Mula is nakshatra 19 (index 18). Primary=20, secondary=56.
    // Mula spans (18 * 13.333)° = 240° to 253.333°
    // Secondary ghati 56 = 240 + (56/60)*13.333 = 240 + 12.444 = 252.444°
    const moonSidInSecondary = 252.5; // ~ghati 56.3 of Mula
    expect(isVarjyamActive(moonSidInSecondary)).toBe(true);
  });

  it('Varjyam period added to computeInauspiciousForWindow when moonSid is in Varjyam', () => {
    // Moon in Ashwini Varjyam window
    const moonSid = 11.2;
    const periods = computeInauspiciousForWindow(
      10, 11, 6, 18, 0, 1, 2460800, 0, moonSid,
    );
    const varjyam = periods.find(p => p.name === 'Varjyam');
    expect(varjyam).toBeDefined();
    expect(varjyam!.active).toBe(true);
  });
});

describe('Abhijit Muhurta bonus', () => {
  it('grants +8 bonus during Abhijit on non-Wednesday', () => {
    // Sunrise 6 local, sunset 18 local → muhurta = 0.8h
    // Abhijit (8th muhurta, 0-indexed 7): 6 + 7*0.8 = 11.6 to 12.4 local
    const rules = getExtendedActivity('marriage')!;
    const result = scoreTimingFactors(
      2460800,   // jd
      12.0,      // hourOfDay (noon — inside Abhijit)
      1,         // Monday (not Wednesday)
      6,         // sunriseUT
      18,        // sunsetUT
      0,         // tz=UTC
      rules,
    );
    const hasAbhijit = result.factors.some(f => f.en.includes('Abhijit'));
    expect(hasAbhijit).toBe(true);
  });

  it('does NOT grant bonus on Wednesday', () => {
    const rules = getExtendedActivity('marriage')!;
    const result = scoreTimingFactors(
      2460800, 12.0, 3, 6, 18, 0, rules, // weekday=3=Wednesday
    );
    const hasAbhijit = result.factors.some(f => f.en.includes('Abhijit'));
    expect(hasAbhijit).toBe(false);
  });

  it('does NOT grant bonus outside Abhijit window', () => {
    const rules = getExtendedActivity('marriage')!;
    const result = scoreTimingFactors(
      2460800, 8.0, 1, 6, 18, 0, rules, // 8 AM — well before Abhijit
    );
    const hasAbhijit = result.factors.some(f => f.en.includes('Abhijit'));
    expect(hasAbhijit).toBe(false);
  });
});

describe('Vishti penalty balance', () => {
  it('Vishti inauspicious penalty is reduced to -1 (main penalty is in panchang scoring)', () => {
    // Create a period set with only Vishti active
    const penalty = computeInauspiciousPenalty([
      { name: 'Vishti (Bhadra)', startTime: '10:00', endTime: '11:00', active: true },
    ]);
    // 10 - 1 = 9 (was 10 - 4 = 6 before)
    expect(penalty).toBe(9);
  });

  it('combined inauspicious penalty sums correctly with new periods', () => {
    const penalty = computeInauspiciousPenalty([
      { name: 'Rahu Kaal', startTime: '10:00', endTime: '11:00', active: true },
      { name: 'Dur Muhurtam', startTime: '10:00', endTime: '11:00', active: true },
      { name: 'Varjyam', startTime: '10:00', endTime: '11:00', active: true },
    ]);
    // 10 - 4 - 3 - 3 = 0
    expect(penalty).toBe(0);
  });
});
```

- [ ] **Step 2: Run the tests**

```bash
npx vitest run src/lib/__tests__/muhurta-integration.test.ts
```
Expected: all tests PASS.

- [ ] **Step 3: Run full test suite and build**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json && npx next build
```
Expected: all pass, zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/__tests__/muhurta-integration.test.ts
git commit -m "test: integration tests for Dur Muhurtam, Abhijit, Varjyam, Vishti

Covers:
- Dur Muhurtam: window count per weekday, time ranges, overlap detection
- Varjyam: primary window, secondary (Mula dual), degree-to-ghati mapping
- Abhijit: bonus on non-Wednesday, no bonus on Wednesday/outside window
- Vishti: reduced penalty (-1 vs old -4), combined penalty sums"
```

---

## Task 11: Final Verification

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 3: Production build**

```bash
npx next build
```

- [ ] **Step 4: Spot-check ayanamsha (Lahiri should be unchanged)**

```bash
npx tsx -e "
const { computePanchang } = require('./src/lib/ephem/panchang-calc');
const p = computePanchang({ year: 2026, month: 5, day: 4, lat: 46.46, lng: 6.80, tzOffset: 2 });
console.log('Nakshatra:', p.nakshatra.name.en);
console.log('Yoga:', p.yoga.name.en);
console.log('Ayanamsha:', p.ayanamsha);
console.log('Abhijit:', p.abhijitMuhurta);
console.log('DurMuhurtam:', p.durMuhurtam);
"
```
Compare nakshatra and yoga against Prokerala for 2026-05-04, Corseaux (46.46°N, 6.80°E). Values should match current production.

- [ ] **Step 5: Spot-check muhurta scoring with new factors**

```bash
npx tsx -e "
const { scanDateRangeV2 } = require('./src/lib/muhurta/time-window-scanner');
const results = scanDateRangeV2({
  startDate: '2026-05-04', endDate: '2026-05-04',
  activity: 'marriage', lat: 46.46, lng: 6.80, tz: 2,
  windowMinutes: 90, preSunriseHours: 0, postSunsetHours: 0,
});
for (const w of results.slice(0, 5)) {
  const periods = w.inauspiciousPeriods.filter(p => p.active).map(p => p.name);
  console.log(w.startTime, '-', w.endTime, 'score:', w.score, 'inauspicious:', periods.join(', ') || 'none');
}
"
```
Verify: windows during Dur Muhurtam should show lower scores than adjacent windows. Midday window (if not Wednesday) should show Abhijit bonus.
