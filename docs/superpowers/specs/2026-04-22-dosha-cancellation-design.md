# Mangal Dosha & Nadi Dosha Cancellation — Design Spec

**Date:** 2026-04-22
**Status:** Draft
**Scope:** Unified Mangal Dosha engine + Nadi Dosha cancellation extensions + bug fixes

---

## 1. Problem

### Mangal Dosha
Three independent implementations exist with different logic:
- `yogas-complete.ts` — Lagna-only detection, no cancellation, Strong/Moderate/Weak severity
- `detailed-report.ts` — Lagna-only detection, 5 cancellation rules, severe/moderate/mild severity
- `mangal-dosha/page.tsx` — Lagna+Moon+Venus detection, 4 cancellation rules, count-based severity, **CRITICAL BUG: uses Mercury (id=3) instead of Mars (id=2)**

Users get inconsistent results depending on which feature they use. The standalone Mangal Dosha calculator is completely broken (analyzing Mercury's position).

### Nadi Dosha
Only 2 cancellation rules implemented (different rashi lords, same nakshatra different pada). Classical texts (Muhurta Chintamani, Hora Sara) describe additional cancellations that are standard in professional matching software.

## 2. Solution

### 2.1 Mangal Dosha — Unified Engine

**New file:** `src/lib/kundali/mangal-dosha-engine.ts`

Single canonical implementation used by all 3 consumers.

**Detection (per BPHS + South Indian tradition):**
- Mars in houses 1, 2, 4, 7, 8, 12 from THREE reference points: Lagna, Moon, Venus
- `present` = true if Mars falls in a Mangal house from ANY reference point

**Severity — dual model:**
- **House severity** (which house Mars occupies from Lagna):
  - `severe`: house 7, 8
  - `moderate`: house 1, 4
  - `mild`: house 2, 12
  - `none`: all other houses
- **Scope severity** (how many reference points trigger):
  - `severe`: all 3 (Lagna + Moon + Venus)
  - `moderate`: 2 of 3
  - `mild`: 1 of 3
- Final severity = the higher of the two

**Cancellation rules (7 rules):**

| # | Rule | Source | Logic |
|---|------|--------|-------|
| C1 | Mars in own sign | BPHS | Mars in Aries (sign 1) or Scorpio (sign 8) |
| C2 | Mars exalted | BPHS | Mars in Capricorn (sign 10) |
| C3 | Jupiter aspects Mars | Muhurta Chintamani | Jupiter in same house, or 5th/7th/9th from Mars |
| C4 | Venus in 7th house | Phaladeepika | Venus occupies 7th house from Lagna |
| C5 | Mars conjunct benefic | Hora Sara | Mars in same house as Jupiter or Venus |
| C6 | Mars in Mercury sign in 2nd house | Regional tradition | Mars in Gemini (3) or Virgo (6) AND in 2nd house from Lagna |
| C7 | Mutual Manglik | Dharmasindhu | Both partners have Mangal Dosha (matching context only) |

**Cancellation effect:** Each applicable rule is listed. If ANY cancellation applies, the effective severity drops:
- `severe` → `moderate`
- `moderate` → `mild`
- `mild` → `cancelled`
- Multiple cancellations: each additional one drops one more level (but floor is `cancelled`)

```typescript
export interface MangalDoshaResult {
  present: boolean;
  fromLagna: boolean;
  fromMoon: boolean;
  fromVenus: boolean;
  marsHouse: number;        // house from Lagna
  marsSign: number;         // sign (1-12)
  houseSeverity: 'none' | 'mild' | 'moderate' | 'severe';
  scopeSeverity: 'none' | 'mild' | 'moderate' | 'severe';
  effectiveSeverity: 'none' | 'mild' | 'moderate' | 'severe' | 'cancelled';
  cancellations: { rule: string; description: string }[];
  affectedHouses: number[];  // which houses Mars falls in (from all 3 refs)
}

export function analyzeMangalDosha(
  planets: PlanetPosition[],
  ascSign: number,
): MangalDoshaResult

// Matching-context wrapper that also checks mutual cancellation
export function analyzeMangalDoshaForMatching(
  chart1Planets: PlanetPosition[], chart1AscSign: number,
  chart2Planets: PlanetPosition[], chart2AscSign: number,
): { chart1: MangalDoshaResult; chart2: MangalDoshaResult; mutualCancellation: boolean }
```

### 2.2 Nadi Dosha — Extended Cancellations

**Extend in place** in `src/lib/matching/detailed-report.ts`.

**Existing cancellation rules (keep):**
1. Different rashi lords (Moon sign lords differ)
2. Same nakshatra, different padas

**New cancellation rules:**

| # | Rule | Source | Logic |
|---|------|--------|-------|
| N3 | Different Moon signs | Muhurta Chintamani | If boy's Moon rashi ≠ girl's Moon rashi, dosha reduced |
| N4 | Same nakshatra, same pada | Classical override | Same nak + same pada = actually GOOD (genetic similarity). Sets `doshaPresent = false` (complete cancellation, not just mitigation). Score reverts to 8 points. |
| N5 | Navamsha Moon differs | Hora Sara | If Moon's navamsha sign differs between charts, dosha cancelled |

**Cancellation effect:** Each rule adds to the `cancellations: string[]` array. The `doshaPresent` boolean remains true (the dosha technically exists), but the cancellations inform the user and the narrative summary adjusts its tone.

When 2+ cancellations apply, the `healthImplications` text changes from "significant concern" to "mitigated — consult for confirmation."

### 2.3 Bug Fixes

1. **`mangal-dosha/page.tsx` line 108:** `planet.id === 3` → `planet.id === 2` (Mercury → Mars). But since we're replacing the inline analysis with the shared engine, this bug is fixed by elimination.
2. **`ashta-kuta.ts` `manglikWarning` field:** Remove from `MatchResult` interface (dead code, never populated).

## 3. Architecture

### 3.1 New File: `src/lib/kundali/mangal-dosha-engine.ts`

Pure functions. No side effects. Takes planet positions + ascendant sign, returns analysis result.

Helper functions:
- `houseFrom(refSign: number, targetSign: number): number` — 1-based house distance
- `isInMangalHouse(house: number): boolean` — checks against [1,2,4,7,8,12]
- `getHouseSeverity(house: number): Severity` — house-based severity
- `checkCancellations(planets, ascSign, marsHouse, marsSign): Cancellation[]` — applies all 7 rules

### 3.2 Consumer Updates

| Consumer | Change |
|----------|--------|
| `yogas-complete.ts` | Import `analyzeMangalDosha`, use result for `present`, `strength` mapping |
| `detailed-report.ts` | Import `analyzeMangalDoshaForMatching`, replace inline logic |
| `mangal-dosha/page.tsx` | Import `analyzeMangalDosha`, replace inline `analyzeMangalDosha` function |

### 3.3 Nadi Extension

Modify `analyzeNadi()` in `detailed-report.ts` to add 3 new cancellation checks. Needs access to Moon's navamsha sign for rule N5 — compute inline from Moon longitude: `navamshaSign = getD9Sign(moonLongitude)`.

## 4. Testing Strategy

### 4.1 Mangal Dosha Engine (`src/lib/kundali/__tests__/mangal-dosha-engine.test.ts`)

**Detection tests:**
- Mars in house 7 from Lagna → present, fromLagna=true
- Mars NOT in any Mangal house → present=false
- Mars in Mangal house from Moon but not Lagna → fromMoon=true, fromLagna=false
- Mars in Mangal house from all 3 refs → scope severity=severe

**Cancellation tests:**
- C1: Mars in Aries → cancellation applied
- C2: Mars in Capricorn → cancellation applied
- C3: Jupiter 7th from Mars → cancellation applied
- C4: Venus in house 7 → cancellation applied
- C5: Mars conjunct Jupiter → cancellation applied
- C6: Mars in Gemini in 2nd house → cancellation applied
- No cancellation applies → empty array

**Severity cascade:**
- severe + 1 cancellation → moderate
- severe + 2 cancellations → mild
- mild + 1 cancellation → cancelled

**Bug fix verification:**
- Uses planet id 2 (Mars), not 3 (Mercury)

### 4.2 Nadi Dosha (`src/lib/__tests__/nadi-cancellation.test.ts`)

- Same nadi, different Moon signs → N3 cancellation
- Same nadi, same nakshatra, same pada → N4 override
- Same nadi, different navamsha Moon → N5 cancellation
- Same nadi, no cancellation conditions → empty cancellations array

### 4.3 Integration
- Existing detailed-report tests must pass
- Existing yogas-complete tests must pass

## 5. Files Changed

| File | Change |
|------|--------|
| `src/lib/kundali/mangal-dosha-engine.ts` | NEW — Unified Mangal Dosha engine |
| `src/lib/kundali/__tests__/mangal-dosha-engine.test.ts` | NEW — Unit tests |
| `src/lib/__tests__/nadi-cancellation.test.ts` | NEW — Nadi cancellation tests |
| `src/lib/kundali/yogas-complete.ts` | MODIFY — Import from shared engine |
| `src/lib/matching/detailed-report.ts` | MODIFY — Import Mangal engine + extend Nadi cancellations |
| `src/app/[locale]/mangal-dosha/page.tsx` | MODIFY — Import from shared engine (fixes Mercury/Mars bug) |
| `src/lib/matching/ashta-kuta.ts` | MODIFY — Remove dead `manglikWarning` field. Extend `MatchInput` with optional `moonPada?: number` (1-4). Add N4 same-pada override to `computeNadi()` (return 8 instead of 0 when same nak + same pada). |
| `src/types/panchang.ts` or `kundali.ts` | MODIFY if needed — export MangalDoshaResult type |

## 6. Deferred Elements

| # | Item | Rationale | Dependency |
|---|------|-----------|------------|
| D1 | Age-based Mangal Dosha reduction (>28 years = mature Mars) | Requires birth date context, not just chart positions | This spec |
| D2 | Rajju Dosha (South Indian matching) | Separate feature, not part of Ashta Kuta | Independent spec |
| D3 | Display Manglik status on basic matching page (populate `manglikWarning`) | Requires UI change to matching page | This spec |
| D4 | Stree-Deergha compensating factor for Nadi Dosha | Requires implementing Stree-Deergha kuta | Independent feature |
| D5 | Benefic aspect on Moon for Nadi Dosha (Jupiter/Venus) | Requires natal chart access in matching context | This spec |

## 7. Success Criteria

1. Single `analyzeMangalDosha()` function produces correct results for all test cases
2. All 3 consumers (yogas-complete, detailed-report, mangal-dosha page) use the shared engine
3. Mercury/Mars bug eliminated
4. Dead `manglikWarning` field removed
5. Nadi Dosha has 5 cancellation rules (2 existing + 3 new)
6. All existing tests pass
7. New tests cover all cancellation rules and edge cases
8. `npx tsc --noEmit`, `npx vitest run`, `npx next build` all pass
