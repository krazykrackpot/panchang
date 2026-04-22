# Gochara (Transit) Framework — Design Spec

**Date:** 2026-04-22
**Status:** Draft
**Scope:** Classical Gochara Vedha engine + Double Transit Theory + BAV-based transit quality

---

## 1. Problem

The app has transit sign-change detection and personal transit analysis using SAV scores, but lacks:
1. **Classical Gochara Vedha** — specific vedha (obstruction) pairs that nullify transit benefits
2. **Double Transit Theory** — Jupiter + Saturn jointly activating a house for event manifestation
3. **BAV-based per-planet transit quality** — individual planet's BAV score for the transited sign (not just aggregate SAV)

These are standard features in professional Jyotish software and are referenced in the existing learn/gochar page.

## 2. Solution

### 2.1 Gochara Vedha Engine

Per BPHS / Phaladeepika Ch.26, each planet transiting from the Moon has specific auspicious houses AND vedha points that can nullify the benefit.

**Classical Vedha Table (transit house from Moon → vedha house):**

| Planet | Good Houses | Vedha House for each Good House |
|--------|------------|-------------------------------|
| Sun | 3, 6, 10, 11 | 9, 12, 4, 5 |
| Moon | 1, 3, 6, 7, 10, 11 | 5, 9, 12, 2, 4, 8 |
| Mars | 3, 6, 11 | 12, 9, 5 |
| Mercury | 2, 4, 6, 8, 10, 11 | 5, 3, 9, 1, 8, 12 |
| Jupiter | 2, 5, 7, 9, 11 | 12, 4, 3, 10, 8 |
| Venus | 1, 2, 3, 4, 5, 8, 9, 11, 12 | 8, 7, 1, 10, 9, 5, 11, 6, 3 |
| Saturn | 3, 6, 11 | 12, 9, 5 |

**Rule:** If planet P is transiting a good house H from Moon, AND another planet occupies the vedha house V corresponding to H, then the good transit is NULLIFIED (vedha = obstruction).

**Exception:** Sun and Saturn do NOT cause vedha to each other (father-son exemption per Phaladeepika).

### 2.2 Double Transit Theory

A house's significations manifest when BOTH Jupiter AND Saturn aspect or occupy that house simultaneously. This is a fundamental timing technique.

**Check:** For a target house H from Moon (or Lagna):
- Jupiter transiting H, or aspecting H from its current sign (5th, 7th, 9th aspects)
- Saturn transiting H, or aspecting H from its current sign (3rd, 7th, 10th aspects)
- Both conditions met = Double Transit active for house H

### 2.3 BAV-based Transit Quality

With Ashtakavarga Shodhana now implemented, each planet has a reduced BAV score per sign. When planet P transits sign S:
- `bavScore = reducedBpiTable[planetIndex][signIndex]`
- High BAV (4+) = strong positive transit
- Medium BAV (2-3) = moderate
- Low BAV (0-1) = weak or adverse transit

This is more precise than the aggregate SAV score currently used.

## 3. Architecture

### 3.1 New File: `src/lib/transit/gochara-engine.ts`

Pure functions. No UI, no side effects.

```typescript
export interface GocharaResult {
  planet: number;          // planet id (0-6)
  transitSign: number;     // current sign (1-12)
  houseFromMoon: number;   // house from natal Moon
  isGoodHouse: boolean;    // is this a classically favorable house?
  vedhaActive: boolean;    // is a vedha planet nullifying this transit?
  vedhaPlanet?: number;    // which planet is causing vedha
  vedhaHouse?: number;     // from which house
  bavScore: number;        // individual planet BAV score for this sign
  quality: 'strong' | 'moderate' | 'weak' | 'adverse'; // derived from isGoodHouse + vedha + BAV
}

export interface DoubleTransitResult {
  house: number;           // house from Moon (1-12)
  jupiterActivates: boolean;
  saturnActivates: boolean;
  doubleTransitActive: boolean;
  signification: string;   // what this house represents
}

// Analyze all 7 planet transits from natal Moon
export function analyzeGochara(
  transitPositions: { id: number; sign: number }[],  // current planet positions
  natalMoonSign: number,
  reducedBav?: number[][],  // optional: 7x12 reduced BAV table
): GocharaResult[]

// Check double transit for all 12 houses
export function analyzeDoubleTransit(
  jupiterSign: number,
  saturnSign: number,
  natalMoonSign: number,
): DoubleTransitResult[]
```

### 3.2 Integration Points

- `src/lib/transit/personal-transits.ts` — extend `computePersonalTransits()` to include Gochara vedha and BAV scores
- `src/components/kundali/TransitRadar.tsx` — can consume vedha data to show obstructed transits
- `src/components/dashboard/TransitCountdown.tsx` — can show BAV-based quality instead of just SAV

These UI integrations are deferred (D1-D3 below). The engine is built first.

### 3.3 Constants

```typescript
// Vedha table: planet id → { goodHouse → vedhaHouse }
const VEDHA_TABLE: Record<number, Record<number, number>> = {
  0: { 3: 9, 6: 12, 10: 4, 11: 5 },           // Sun
  1: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 }, // Moon
  2: { 3: 12, 6: 9, 11: 5 },                    // Mars
  3: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 }, // Mercury
  4: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },       // Jupiter
  5: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 }, // Venus
  6: { 3: 12, 6: 9, 11: 5 },                    // Saturn
};

// Sun-Saturn mutual vedha exemption
const VEDHA_EXEMPT_PAIRS: [number, number][] = [[0, 6]]; // Sun-Saturn

// House significations for Double Transit display
const HOUSE_SIGNIFICATIONS: Record<number, string> = {
  1: 'Self, health, new beginnings',
  2: 'Wealth, family, speech',
  // ... etc
};
```

## 4. Testing

### `src/lib/transit/__tests__/gochara-engine.test.ts`

**Vedha tests:**
- Jupiter in 2nd from Moon (good) + no planet in 12th (vedha house) → vedhaActive=false
- Jupiter in 2nd + Mars in 12th → vedhaActive=true, vedhaPlanet=Mars
- Sun in 3rd + Saturn in 9th → vedhaActive=false (Sun-Saturn exemption)
- Planet in bad house → isGoodHouse=false, no vedha check needed

**Double Transit tests:**
- Jupiter in sign 5 from Moon, Saturn aspecting 5th from its sign → doubleTransitActive=true
- Jupiter in 5th, Saturn NOT aspecting 5th → doubleTransitActive=false

**BAV quality tests:**
- Good house + no vedha + BAV 4+ → quality='strong'
- Good house + vedha active → quality='adverse' (vedha overrides)
- Bad house + BAV 4+ → quality='moderate' (BAV can't make a bad house good, but high BAV reduces harm)

## 5. Files Changed

| File | Change |
|------|--------|
| `src/lib/transit/gochara-engine.ts` | NEW — Vedha + Double Transit + BAV quality |
| `src/lib/transit/__tests__/gochara-engine.test.ts` | NEW — Tests |

## 6. Deferred

| # | Item | Rationale |
|---|------|-----------|
| D1 | Integrate Gochara into TransitRadar component | UI change, depends on engine |
| D2 | Integrate BAV scores into TransitCountdown | UI change, depends on engine |
| D3 | Integrate into personal-transits.ts | Extends existing transit API |
| D4 | Transit-to-natal aspect analysis (transiting Saturn conjunct natal Moon etc.) | More advanced, beyond Gochara |
| D5 | Kakshya sub-transit timing within signs | Depends on Ashtakavarga Shodhana (done) |
| D6 | Retrograde transit handling (re-entry into signs) | Transit calendar enhancement |

## 7. Success Criteria

1. `analyzeGochara()` correctly applies vedha table for all 7 planets
2. Sun-Saturn vedha exemption works
3. `analyzeDoubleTransit()` correctly checks Jupiter + Saturn aspects
4. BAV scores integrate with transit quality rating
5. All existing tests pass
6. `npx tsc`, `npx vitest run`, `npx next build` all pass
