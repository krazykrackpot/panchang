# Ashtakavarga Shodhana — Design Spec

**Date:** 2026-04-22
**Status:** Draft
**Scope:** Computation engine + type extensions + kundali integration + UI grid

---

## 1. Problem

The app computes raw Bhinnashtakavarga (BAV, 7 planets × 12 signs) and Sarvashtakavarga (SAV, 12-sign totals) but does not apply the classical BPHS reductions (Trikona Shodhana, Ekadhipatya Shodhana) or compute Pinda Ashtakavarga. Without reductions, the BAV/SAV scores overcount and cannot be used for accurate transit timing or prediction. Every major Jyotish software (JHora, Parashara's Light, Astrosage) provides reduced Ashtakavarga.

Additionally, there is no UI component that lets users see the BAV/SAV grids. The data is computed and used internally by transit components but never shown directly.

## 2. Background — Classical Rules

### 2.1 Trikona Shodhana (BPHS Ch.66)

For each planet's 12-sign BAV row, group signs into 4 trikona sets:
- Set A: signs 1, 5, 9 (Aries, Leo, Sagittarius)
- Set B: signs 2, 6, 10 (Taurus, Virgo, Capricorn)
- Set C: signs 3, 7, 11 (Gemini, Libra, Aquarius)
- Set D: signs 4, 8, 12 (Cancer, Scorpio, Pisces)

For each set: find the minimum value among the 3 signs, subtract it from all 3. This "levels" each trikona group so the weakest sign in the group becomes 0.

**Example:** If Sun's BAV has Aries=5, Leo=3, Sagittarius=4 → min=3 → reduced to 2, 0, 1.

Apply to all 7 planet BAV rows independently.

### 2.2 Ekadhipatya Shodhana (BPHS Ch.67)

Applied AFTER Trikona Shodhana, to the Trikona-reduced BAV.

Five sign pairs share a lord:
| Pair | Lord | Signs (1-indexed) |
|------|------|-------------------|
| Aries–Scorpio | Mars | 1, 8 |
| Taurus–Libra | Venus | 2, 7 |
| Gemini–Virgo | Mercury | 3, 6 |
| Sagittarius–Pisces | Jupiter | 9, 12 |
| Capricorn–Aquarius | Saturn | 10, 11 |

Sun (Leo=5) and Moon (Cancer=4) own one sign each — no pair, no reduction.

**Reduction rules per pair (for each planet's BAV row):**

1. If one sign in the pair is **occupied by its lord** and the other is not: retain both values (no reduction).
2. If **both signs are occupied** by the lord (impossible — lord is one planet, can only be in one sign): retain both (degenerate case).
3. If **neither sign is occupied** by the lord:
   - If one sign is occupied by **Rahu or Ketu**: retain the value of the Rahu/Ketu-occupied sign, zero the other.
   - If **both or neither** have Rahu/Ketu: retain the **higher** value, zero the **lower**. If equal, zero the sign that comes later in zodiacal order.

These rules follow the BPHS mainstream reading as implemented in JHora.

### 2.3 Pinda Ashtakavarga (BPHS Ch.69)

After both reductions, compute a single Pinda number per planet:

For each planet `p`:
```
pinda[p] = sum over 12 signs of: reducedBAV[p][sign] × rashiGuna[sign] × grahaGuna[p]
```

**Rashi Guna weights** (per sign element):
- Fire signs (1, 5, 9): 7
- Earth signs (2, 6, 10): 5
- Air signs (3, 7, 11): 6
- Water signs (4, 8, 12): 8

**Graha Guna weights** (per planet):
- Sun: 5, Moon: 5, Mars: 8, Mercury: 5, Jupiter: 10, Venus: 7, Saturn: 5

The Pinda value indicates the planet's overall strength for delivering results during its dasha/transit periods.

### 2.4 Ordering

Parashari standard (BPHS chapter sequence): **Trikona first → Ekadhipatya second → Pinda last.** This matches JHora, Parashara's Light, and is the most widely accepted ordering.

## 3. Architecture

### 3.1 New File: `src/lib/kundali/ashtakavarga-shodhana.ts`

Pure functions, no side effects, no imports beyond types and astronomical helpers.

```typescript
// --- Trikona Shodhana ---
// Input: raw 7×12 BAV table
// Output: Trikona-reduced 7×12 BAV table
export function trikonaShodhana(bpiTable: number[][]): number[][]

// --- Ekadhipatya Shodhana ---
// Input: Trikona-reduced 7×12 BAV table + planet positions (to know where lords sit)
// Output: fully reduced 7×12 BAV table
export function ekadhipatyaShodhana(
  bpiTable: number[][],
  planetSigns: number[], // planet id → sign (1-12)
): number[][]

// --- Pinda Ashtakavarga ---
// Input: fully reduced 7×12 BAV table
// Output: 7-element array of Pinda values
export function computePindaAshtakavarga(reducedBpi: number[][]): number[]

// --- Combined entry point ---
export function applyFullShodhana(
  rawBpi: number[][],
  rawSav: number[],
  planetSigns: number[],
): {
  reducedBpiTable: number[][];
  reducedSavTable: number[];
  pindaAshtakavarga: number[];
}
```

### 3.2 Type Extension: `src/types/kundali.ts`

```typescript
export interface AshtakavargaData {
  bpiTable: number[][];           // raw 7×12 (existing)
  savTable: number[];             // raw 12-element (existing)
  reducedBpiTable: number[][];    // after Trikona + Ekadhipatya (NEW)
  reducedSavTable: number[];      // sum of reducedBpi columns (NEW)
  pindaAshtakavarga: number[];    // 7-element, one per planet (NEW)
  planetNames: string[];          // existing
}
```

### 3.3 Integration: `src/lib/ephem/kundali-calc.ts`

After the existing `calculateAshtakavarga()` call (~line 732), call `applyFullShodhana()` with the raw BAV/SAV and planet sign positions. Merge the result into the `AshtakavargaData` object.

```typescript
const rawAshtakavarga = calculateAshtakavarga(planets, ascSign);
const planetSigns = planets.map(p => Math.floor(p.longitude / 30) + 1);
const shodhana = applyFullShodhana(
  rawAshtakavarga.bpiTable,
  rawAshtakavarga.savTable,
  planetSigns,
);
const ashtakavarga: AshtakavargaData = {
  ...rawAshtakavarga,
  ...shodhana,
};
```

### 3.4 UI: Ashtakavarga Tab on Kundali Page

**Component:** `src/components/kundali/AshtakavargaTab.tsx` (lazy-loaded like existing PatrikaTab, SphutasTab).

**Layout (3 sections):**

**Section A — BAV Grid**
- 7-row × 12-column grid. Rows = planets (Sun through Saturn). Columns = signs (Aries through Pisces).
- Toggle: "Raw" / "Reduced" to switch between `bpiTable` and `reducedBpiTable`.
- Cell colors: 0 = dark/empty, 1-3 = dim gold, 4-5 = medium gold, 6-8 = bright gold/green.
- Row totals (sum of 12 cells) shown at right edge.
- Column totals = SAV (or reduced SAV) shown at bottom.

**Section B — SAV Bar Chart**
- 12 vertical bars (one per sign). Dual-bar: raw SAV (outline) overlaid with reduced SAV (filled).
- Sign names below each bar.
- Color: bars above 28 = green, 25-28 = gold, below 25 = red.

**Section C — Pinda Summary**
- 7 cards (one per planet), each showing:
  - Planet icon + name
  - Pinda value (large number)
  - Qualitative label: High (>200) / Medium (100-200) / Low (<100) — thresholds from standard Jyotish practice

**Tab registration:** Add to the kundali page's tab system alongside existing Patrika, Sphutas, Jaimini tabs. Label: "Ashtakavarga" / "अष्टकवर्ग".

## 4. Constants

```typescript
// Trikona groups (0-indexed sign indices)
const TRIKONA_GROUPS = [
  [0, 4, 8],   // Aries, Leo, Sagittarius
  [1, 5, 9],   // Taurus, Virgo, Capricorn
  [2, 6, 10],  // Gemini, Libra, Aquarius
  [3, 7, 11],  // Cancer, Scorpio, Pisces
];

// Ekadhipatya sign pairs (0-indexed)
// [signA, signB, lordPlanetId]
const EKADHIPATYA_PAIRS: [number, number, number][] = [
  [0, 7, 2],   // Aries–Scorpio, Mars
  [1, 6, 5],   // Taurus–Libra, Venus
  [2, 5, 3],   // Gemini–Virgo, Mercury
  [8, 11, 4],  // Sagittarius–Pisces, Jupiter
  [9, 10, 6],  // Capricorn–Aquarius, Saturn
];

// Rashi Guna weights by element (sign index % 4 → element)
// Fire(0)=7, Earth(1)=5, Air(2)=6, Water(3)=8
const RASHI_GUNA = [7, 5, 6, 8]; // index = signIndex % 4

// Graha Guna weights (planet id 0-6)
const GRAHA_GUNA = [5, 5, 8, 5, 10, 7, 5];
// Sun=5, Moon=5, Mars=8, Mercury=5, Jupiter=10, Venus=7, Saturn=5
```

## 5. Edge Cases

1. **All three trikona signs have the same BAV value:** min = that value, all reduce to 0. Correct behavior — the trikona is "balanced" with no relative advantage.

2. **Both signs in an Ekadhipatya pair are 0 after Trikona:** No further reduction. Both stay 0.

3. **Rahu (id=7) or Ketu (id=8) in an Ekadhipatya sign:** The `planetSigns` array must include Rahu/Ketu positions (indices 7 and 8). The function checks occupancy of ALL planets in the pair signs, not just 0-6.

4. **Lord occupies one of its own pair signs:** Retain both values (rule 1 above). E.g., Mars in Aries means Aries-Scorpio pair is not reduced.

5. **Equal values in Ekadhipatya pair (neither lord nor Rahu/Ketu present):** Zero the later sign (higher index). This is the JHora convention.

## 6. Testing Strategy

### 6.1 Unit Tests (`src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`)

**Trikona Shodhana:**
- Test with a known BAV row. Verify each trikona group reduces by its minimum.
- Test edge: all-zero row → remains all-zero.
- Test edge: identical values in trikona → all reduce to zero.

**Ekadhipatya Shodhana:**
- Test each of the 5 dual-lord pairs independently.
- Test: lord in one sign → both retained.
- Test: Rahu in one sign → that sign retained, other zeroed.
- Test: neither lord nor Rahu → higher retained, lower zeroed.
- Test: equal values, neither occupied → later sign zeroed.

**Pinda Ashtakavarga:**
- Test with hand-computed values from a known chart.
- Verify element weights cycle correctly: sign 0=fire(7), sign 1=earth(5), sign 2=air(6), sign 3=water(8), sign 4=fire(7), etc.

**Integration:**
- Call `applyFullShodhana()` with real planet positions.
- Verify `reducedSavTable` = column sums of `reducedBpiTable`.
- Verify raw BAV/SAV remain unchanged (no mutation).

### 6.2 Reference Validation
- Use a verified JHora chart (specific birth data + Lahiri ayanamsha) to compare raw BAV, reduced BAV, and Pinda values. Document the reference chart in the test file.

## 7. Files Changed

| File | Change |
|------|--------|
| `src/lib/kundali/ashtakavarga-shodhana.ts` | NEW — Shodhana engine |
| `src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts` | NEW — Unit tests |
| `src/types/kundali.ts` | MODIFY — Add reduced fields to AshtakavargaData |
| `src/lib/ephem/kundali-calc.ts` | MODIFY — Call Shodhana after BAV computation |
| `src/components/kundali/AshtakavargaTab.tsx` | NEW — UI grid component |
| `src/app/[locale]/kundali/page.tsx` | MODIFY — Register new tab |

## 8. Deferred Elements

| # | Item | Rationale | Dependency |
|---|------|-----------|------------|
| D1 | Switch transit components (`TransitRadar`, `TransitCountdown`, `PersonalizedHoroscope`, `TransitForecastWidget`, `LifeTimeline`) from raw SAV to reduced SAV | Requires verifying each consumer's threshold logic still works with reduced values (reduced SAV has lower numbers) | This spec complete |
| D2 | BAV-based transit quality per planet (use individual planet BAV score for the sign being transited, not just SAV total) | Part of Gochara framework spec | This spec + Gochara spec |
| D3 | Kakshya transit subdivisions (8 sub-periods within each sign based on Ashtakavarga planet ownership) | Advanced feature, low user demand, needs Shodhana as prerequisite | This spec |
| D4 | Ashtakavarga-based Dasha predictions (BPHS Ch.70 — predict dasha outcomes from BAV scores in dasha lord's sign) | Requires both Shodhana and Dasha display integration | This spec |
| D5 | Update Ashtakavarga learn page with Shodhana educational content and interactive examples | Educational enhancement, not functional | This spec |
| D6 | Sarvashtakavarga Shodhana (apply Trikona+Ekadhipatya to the SAV row itself, separate from per-planet reductions) | Some texts prescribe this as an additional step; JHora does not do it by default | This spec |
| D7 | Export/print BAV grid as PDF | UX feature, depends on UI grid existing | This spec |

## 9. Success Criteria

1. `applyFullShodhana()` produces correct reduced BAV/SAV/Pinda matching JHora output for a reference chart
2. Existing raw BAV/SAV data is preserved (non-breaking change)
3. All existing tests pass (2556+)
4. New unit tests cover all Shodhana rules and edge cases
5. UI grid displays both raw and reduced tables with correct values
6. `npx tsc --noEmit`, `npx vitest run`, `npx next build` all pass
