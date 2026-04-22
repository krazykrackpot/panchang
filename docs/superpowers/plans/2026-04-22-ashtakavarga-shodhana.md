# Ashtakavarga Shodhana Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Trikona Shodhana, Ekadhipatya Shodhana, and Pinda Ashtakavarga computation to the existing Ashtakavarga engine, with UI display on the kundali page.

**Architecture:** Pure computation module (`ashtakavarga-shodhana.ts`) called after existing BAV/SAV calculation. Results stored alongside raw data in `AshtakavargaData`. Existing inline `AshtakavargaTab` extended with a "Raw/Reduced" toggle and Pinda section.

**Tech Stack:** TypeScript, Vitest, React (existing kundali page patterns)

---

### Task 1: Extend AshtakavargaData type

**Files:**
- Modify: `src/types/kundali.ts:147-151`

- [ ] **Step 1: Add reduced fields to AshtakavargaData**

In `src/types/kundali.ts`, replace the existing `AshtakavargaData` interface:

```typescript
export interface AshtakavargaData {
  bpiTable: number[][]; // 7 planets x 12 signs — Bhinnashtakavarga (0-8 per cell)
  savTable: number[];   // 12 signs — Sarvashtakavarga (sum of all planets per sign)
  planetNames: string[];
}
```

with:

```typescript
export interface AshtakavargaData {
  bpiTable: number[][];           // raw 7×12 — Bhinnashtakavarga (0-8 per cell)
  savTable: number[];             // raw 12-element — Sarvashtakavarga
  reducedBpiTable: number[][];    // 7×12 after Trikona + Ekadhipatya Shodhana
  reducedSavTable: number[];      // 12-element — sum of reducedBpiTable columns
  pindaAshtakavarga: number[];    // 7-element — one Pinda value per planet
  planetNames: string[];
}
```

- [ ] **Step 2: Run type check to see what breaks**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | head -20`

Expected: errors in `kundali-calc.ts` where `AshtakavargaData` is constructed without the new fields. This confirms we need Task 2 before tests pass.

- [ ] **Step 3: Commit type change**

```bash
git add src/types/kundali.ts
git commit -m "types: add reduced/pinda fields to AshtakavargaData"
```

---

### Task 2: Implement Trikona Shodhana

**Files:**
- Create: `src/lib/kundali/ashtakavarga-shodhana.ts`
- Create: `src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`

- [ ] **Step 1: Write failing tests for Trikona Shodhana**

Create `src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { trikonaShodhana } from '../ashtakavarga-shodhana';

describe('trikonaShodhana', () => {
  it('reduces each trikona group by its minimum', () => {
    // Single planet row: signs 0-11
    // Trikona A (0,4,8): values 5,3,4 → min=3 → 2,0,1
    // Trikona B (1,5,9): values 2,6,4 → min=2 → 0,4,2
    // Trikona C (2,6,10): values 3,3,3 → min=3 → 0,0,0
    // Trikona D (3,7,11): values 7,1,5 → min=1 → 6,0,4
    const input = [[5, 2, 3, 7, 3, 6, 3, 1, 4, 4, 3, 5]];
    const result = trikonaShodhana(input);
    expect(result[0]).toEqual([2, 0, 0, 6, 0, 4, 0, 0, 1, 2, 0, 4]);
  });

  it('handles all-zero row', () => {
    const input = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    const result = trikonaShodhana(input);
    expect(result[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('handles identical values in trikona — all reduce to zero', () => {
    const input = [[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]];
    const result = trikonaShodhana(input);
    expect(result[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('processes all 7 planet rows independently', () => {
    const input = [
      [5, 2, 3, 7, 3, 6, 3, 1, 4, 4, 3, 5], // Sun
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // Moon (uniform → all zero)
      [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Mars
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Mercury
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Jupiter (uniform)
      [4, 2, 3, 5, 3, 1, 2, 4, 2, 0, 1, 3], // Venus
      [6, 4, 5, 3, 2, 3, 4, 1, 1, 2, 3, 2], // Saturn
    ];
    const result = trikonaShodhana(input);
    expect(result).toHaveLength(7);
    // Moon: all same → all zero
    expect(result[1]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    // Jupiter: all same → all zero
    expect(result[4]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('does not mutate the input', () => {
    const input = [[5, 2, 3, 7, 3, 6, 3, 1, 4, 4, 3, 5]];
    const inputCopy = input.map(r => [...r]);
    trikonaShodhana(input);
    expect(input).toEqual(inputCopy);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`

Expected: FAIL — module not found.

- [ ] **Step 3: Implement trikonaShodhana**

Create `src/lib/kundali/ashtakavarga-shodhana.ts`:

```typescript
/**
 * Ashtakavarga Shodhana — Classical Reductions
 * Trikona Shodhana (BPHS Ch.66), Ekadhipatya Shodhana (BPHS Ch.67),
 * Pinda Ashtakavarga (BPHS Ch.69).
 * Ordering: Trikona → Ekadhipatya → Pinda (Parashari standard).
 */

// Trikona groups (0-indexed sign indices)
const TRIKONA_GROUPS = [
  [0, 4, 8],   // Aries, Leo, Sagittarius (Fire)
  [1, 5, 9],   // Taurus, Virgo, Capricorn (Earth)
  [2, 6, 10],  // Gemini, Libra, Aquarius (Air)
  [3, 7, 11],  // Cancer, Scorpio, Pisces (Water)
];

/**
 * Trikona Shodhana (BPHS Ch.66)
 * For each planet's BAV row, subtract the minimum of each trikona group from all 3 signs.
 * Input: raw 7×12 BAV table. Output: Trikona-reduced 7×12 BAV table.
 * Does NOT mutate the input.
 */
export function trikonaShodhana(bpiTable: number[][]): number[][] {
  return bpiTable.map(row => {
    const reduced = [...row];
    for (const group of TRIKONA_GROUPS) {
      const min = Math.min(...group.map(i => reduced[i]));
      for (const i of group) reduced[i] -= min;
    }
    return reduced;
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`

Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/ashtakavarga-shodhana.ts src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts
git commit -m "feat: implement Trikona Shodhana with tests"
```

---

### Task 3: Implement Ekadhipatya Shodhana

**Files:**
- Modify: `src/lib/kundali/ashtakavarga-shodhana.ts`
- Modify: `src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`

- [ ] **Step 1: Write failing tests for Ekadhipatya Shodhana**

Append to `src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`:

```typescript
import { ekadhipatyaShodhana } from '../ashtakavarga-shodhana';

describe('ekadhipatyaShodhana', () => {
  // planetSigns: index = planet id (0=Sun..8=Ketu), value = sign (1-12)
  // For these tests, place planets in neutral positions unless testing occupancy

  const neutralSigns = [5, 4, 1, 3, 9, 2, 10, 6, 12];
  // Sun=Leo(5), Moon=Cancer(4), Mars=Aries(1), Mercury=Gemini(3), Jupiter=Sag(9),
  // Venus=Taurus(2), Saturn=Cap(10), Rahu=Virgo(6), Ketu=Pisces(12)

  it('retains both values when lord occupies one of its own pair signs', () => {
    // Mars(id=2) in Aries(sign=1). Pair: Aries(0)–Scorpio(7).
    // Mars is in Aries → rule 1: retain both.
    const input = [[3, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0]]; // Aries=3, Scorpio=5
    const signs = [5, 4, 1, 3, 9, 2, 10, 6, 12]; // Mars in sign 1 (Aries)
    const result = ekadhipatyaShodhana(input, signs);
    expect(result[0][0]).toBe(3); // Aries retained
    expect(result[0][7]).toBe(5); // Scorpio retained
  });

  it('retains Rahu-occupied sign, zeros the other when lord absent', () => {
    // Pair: Aries(0)–Scorpio(7), lord Mars(2) NOT in either.
    // Rahu(id=7) in Aries(sign=1 → index 0).
    const input = [[4, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0]]; // Aries=4, Scorpio=2
    const signs = [5, 4, 6, 3, 9, 2, 10, 1, 12]; // Mars=Virgo(6), Rahu=Aries(1)
    const result = ekadhipatyaShodhana(input, signs);
    expect(result[0][0]).toBe(4); // Aries (Rahu) retained
    expect(result[0][7]).toBe(0); // Scorpio zeroed
  });

  it('retains higher value when neither lord nor Rahu/Ketu present', () => {
    // Pair: Taurus(1)–Libra(6), lord Venus(5) NOT in either.
    // No Rahu/Ketu in either.
    const input = [[0, 3, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0]]; // Taurus=3, Libra=5
    const signs = [5, 4, 1, 3, 9, 8, 10, 6, 12]; // Venus=Scorpio(8)
    const result = ekadhipatyaShodhana(input, signs);
    expect(result[0][1]).toBe(0); // Taurus (lower) zeroed
    expect(result[0][6]).toBe(5); // Libra (higher) retained
  });

  it('zeros later sign when values are equal and no occupancy', () => {
    // Pair: Gemini(2)–Virgo(5), lord Mercury(3) NOT in either.
    // Both have value 4 → zero later sign (Virgo, index 5).
    const input = [[0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0]]; // Gemini=4, Virgo=4
    const signs = [5, 4, 1, 7, 9, 2, 10, 6, 12]; // Mercury=Libra(7)
    const result = ekadhipatyaShodhana(input, signs);
    expect(result[0][2]).toBe(4); // Gemini retained (earlier)
    expect(result[0][5]).toBe(0); // Virgo zeroed (later)
  });

  it('handles all 5 pairs on a full 7-planet table', () => {
    // All planets in neutral positions (no lord in own pair sign, no Rahu/Ketu in pair signs)
    const input = [
      [3, 2, 4, 1, 5, 4, 2, 6, 3, 5, 3, 2], // Sun row
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Moon (all zero — no change)
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Mars (all 1s)
      [2, 3, 5, 4, 6, 3, 7, 1, 2, 4, 3, 5], // Mercury
      [4, 2, 3, 5, 1, 6, 2, 3, 7, 2, 4, 1], // Jupiter
      [5, 1, 2, 3, 4, 5, 6, 2, 3, 1, 2, 4], // Venus
      [3, 4, 1, 2, 5, 3, 4, 6, 2, 5, 3, 1], // Saturn
    ];
    // Place all planets in non-pair signs, Rahu=Virgo(6→idx5), Ketu=Pisces(12→idx11)
    const signs = [5, 4, 10, 4, 9, 2, 7, 6, 12]; // Mars=Cap(10), no lord in own pair
    const result = ekadhipatyaShodhana(input, signs);
    expect(result).toHaveLength(7);
    // Sun row pair Aries(0)–Scorpio(7): 3 vs 6 → retain 6, zero 3
    expect(result[0][0]).toBe(0);
    expect(result[0][7]).toBe(6);
  });

  it('does not mutate the input', () => {
    const input = [[3, 2, 4, 1, 5, 4, 2, 6, 3, 5, 3, 2]];
    const copy = input.map(r => [...r]);
    ekadhipatyaShodhana(input, neutralSigns);
    expect(input).toEqual(copy);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`

Expected: FAIL — `ekadhipatyaShodhana` not exported.

- [ ] **Step 3: Implement ekadhipatyaShodhana**

Append to `src/lib/kundali/ashtakavarga-shodhana.ts`:

```typescript
// Ekadhipatya sign pairs (0-indexed sign indices)
// [signA, signB, lordPlanetId]
const EKADHIPATYA_PAIRS: [number, number, number][] = [
  [0, 7, 2],   // Aries–Scorpio, Mars
  [1, 6, 5],   // Taurus–Libra, Venus
  [2, 5, 3],   // Gemini–Virgo, Mercury
  [8, 11, 4],  // Sagittarius–Pisces, Jupiter
  [9, 10, 6],  // Capricorn–Aquarius, Saturn
];

/**
 * Ekadhipatya Shodhana (BPHS Ch.67)
 * For each dual-lord sign pair, apply reduction rules based on occupancy.
 * Applied AFTER Trikona Shodhana.
 * @param bpiTable - Trikona-reduced 7×12 BAV table
 * @param planetSigns - planet id (0-8) → sign (1-12)
 * Does NOT mutate the input.
 */
export function ekadhipatyaShodhana(
  bpiTable: number[][],
  planetSigns: number[],
): number[][] {
  // Build set of occupied sign indices (0-based) for quick lookup
  const occupiedBy = new Map<number, number[]>(); // signIndex → list of planet ids
  planetSigns.forEach((sign, pid) => {
    const idx = sign - 1; // convert 1-based to 0-based
    if (!occupiedBy.has(idx)) occupiedBy.set(idx, []);
    occupiedBy.get(idx)!.push(pid);
  });

  return bpiTable.map(row => {
    const reduced = [...row];
    for (const [signA, signB, lordId] of EKADHIPATYA_PAIRS) {
      const lordSign = planetSigns[lordId] - 1; // 0-based
      const lordInA = lordSign === signA;
      const lordInB = lordSign === signB;

      // Rule 1 & 2: lord occupies one or both → retain both
      if (lordInA || lordInB) continue;

      // Rule 3: lord absent — check Rahu(7)/Ketu(8) occupancy
      const planetsInA = occupiedBy.get(signA) || [];
      const planetsInB = occupiedBy.get(signB) || [];
      const rahuKetuInA = planetsInA.some(pid => pid === 7 || pid === 8);
      const rahuKetuInB = planetsInB.some(pid => pid === 7 || pid === 8);

      if (rahuKetuInA && !rahuKetuInB) {
        // Retain A (Rahu/Ketu occupied), zero B
        reduced[signB] = 0;
      } else if (rahuKetuInB && !rahuKetuInA) {
        // Retain B (Rahu/Ketu occupied), zero A
        reduced[signA] = 0;
      } else {
        // Both or neither have Rahu/Ketu → retain higher, zero lower
        // If equal, zero the later sign (higher index) per JHora convention
        if (reduced[signA] > reduced[signB]) {
          reduced[signB] = 0;
        } else if (reduced[signB] > reduced[signA]) {
          reduced[signA] = 0;
        } else {
          // Equal → zero the later sign
          if (signA < signB) reduced[signB] = 0;
          else reduced[signA] = 0;
        }
      }
    }
    return reduced;
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/ashtakavarga-shodhana.ts src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts
git commit -m "feat: implement Ekadhipatya Shodhana with tests"
```

---

### Task 4: Implement Pinda Ashtakavarga and applyFullShodhana

**Files:**
- Modify: `src/lib/kundali/ashtakavarga-shodhana.ts`
- Modify: `src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`

- [ ] **Step 1: Write failing tests for Pinda and full Shodhana**

Append to test file:

```typescript
import { computePindaAshtakavarga, applyFullShodhana } from '../ashtakavarga-shodhana';

describe('computePindaAshtakavarga', () => {
  it('computes weighted sum per planet using Rashi and Graha Guna', () => {
    // Single planet (Sun, graha guna = 5)
    // All values 1 in each sign.
    // Pinda = sum of (1 × rashiGuna × 5) for each sign
    // rashiGuna cycle: 7,5,6,8,7,5,6,8,7,5,6,8 → sum = 78
    // Pinda = 78 × 5 = 390... wait, formula is reducedBAV[p][sign] × rashiGuna[sign] × grahaGuna[p]
    // = sum(1 × [7,5,6,8,7,5,6,8,7,5,6,8]) × 5 = 78 × 5 = 390
    const input = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]; // only Sun row
    const result = computePindaAshtakavarga(input);
    expect(result[0]).toBe(390); // Sun: 78 × 5
  });

  it('returns zero for all-zero row', () => {
    const input = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const result = computePindaAshtakavarga(input);
    expect(result).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it('applies correct Graha Guna per planet', () => {
    // Each planet has value 1 only in Aries (index 0, rashiGuna = 7)
    // Pinda = 1 × 7 × grahaGuna[p]
    const input = Array.from({ length: 7 }, () => {
      const row = new Array(12).fill(0);
      row[0] = 1; // only Aries
      return row;
    });
    const result = computePindaAshtakavarga(input);
    // grahaGuna: Sun=5, Moon=5, Mars=8, Mercury=5, Jupiter=10, Venus=7, Saturn=5
    expect(result).toEqual([35, 35, 56, 35, 70, 49, 35]);
  });
});

describe('applyFullShodhana', () => {
  it('returns reduced BPI, reduced SAV, and Pinda', () => {
    const rawBpi = [
      [5, 2, 3, 7, 3, 6, 3, 1, 4, 4, 3, 5],
      [3, 4, 2, 5, 1, 6, 4, 3, 2, 5, 3, 4],
      [4, 3, 5, 2, 6, 1, 3, 4, 5, 2, 4, 3],
      [2, 5, 4, 3, 4, 5, 6, 2, 3, 4, 5, 1],
      [6, 1, 3, 4, 5, 2, 4, 3, 6, 1, 3, 4],
      [3, 4, 5, 1, 2, 6, 3, 5, 4, 3, 2, 6],
      [4, 3, 2, 6, 3, 4, 5, 2, 3, 5, 4, 1],
    ];
    const rawSav = new Array(12).fill(0);
    for (let s = 0; s < 12; s++) {
      for (let p = 0; p < 7; p++) rawSav[s] += rawBpi[p][s];
    }
    const planetSigns = [5, 4, 1, 3, 9, 2, 10, 6, 12];

    const result = applyFullShodhana(rawBpi, rawSav, planetSigns);

    expect(result.reducedBpiTable).toHaveLength(7);
    expect(result.reducedBpiTable[0]).toHaveLength(12);
    expect(result.reducedSavTable).toHaveLength(12);
    expect(result.pindaAshtakavarga).toHaveLength(7);

    // Reduced SAV must equal column sums of reduced BPI
    for (let s = 0; s < 12; s++) {
      const colSum = result.reducedBpiTable.reduce((sum, row) => sum + row[s], 0);
      expect(result.reducedSavTable[s]).toBe(colSum);
    }

    // All reduced values must be >= 0
    for (const row of result.reducedBpiTable) {
      for (const val of row) expect(val).toBeGreaterThanOrEqual(0);
    }

    // Pinda values must be non-negative
    for (const p of result.pindaAshtakavarga) expect(p).toBeGreaterThanOrEqual(0);
  });

  it('does not mutate raw BPI input', () => {
    const rawBpi = [[5, 2, 3, 7, 3, 6, 3, 1, 4, 4, 3, 5]];
    const copy = rawBpi.map(r => [...r]);
    const rawSav = [5, 2, 3, 7, 3, 6, 3, 1, 4, 4, 3, 5];
    applyFullShodhana(rawBpi, rawSav, [5, 4, 1, 3, 9, 2, 10, 6, 12]);
    expect(rawBpi).toEqual(copy);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`

Expected: FAIL — functions not exported.

- [ ] **Step 3: Implement computePindaAshtakavarga and applyFullShodhana**

Append to `src/lib/kundali/ashtakavarga-shodhana.ts`:

```typescript
// Rashi Guna weights by element (sign index → element: 0=fire,1=earth,2=air,3=water)
// Fire=7, Earth=5, Air=6, Water=8
const RASHI_GUNA = [7, 5, 6, 8];

// Graha Guna weights (planet id 0-6: Sun,Moon,Mars,Mercury,Jupiter,Venus,Saturn)
const GRAHA_GUNA = [5, 5, 8, 5, 10, 7, 5];

/**
 * Pinda Ashtakavarga (BPHS Ch.69)
 * For each planet: sum of (reducedBAV[sign] × rashiGuna[sign] × grahaGuna[planet])
 * @param reducedBpi - fully reduced 7×12 BAV table
 * @returns 7-element array of Pinda values
 */
export function computePindaAshtakavarga(reducedBpi: number[][]): number[] {
  return reducedBpi.map((row, planetIdx) => {
    const grahaWeight = GRAHA_GUNA[planetIdx] ?? 5;
    let sum = 0;
    for (let s = 0; s < 12; s++) {
      const rashiWeight = RASHI_GUNA[s % 4];
      sum += row[s] * rashiWeight * grahaWeight;
    }
    return sum;
  });
}

/**
 * Apply full Shodhana pipeline: Trikona → Ekadhipatya → Pinda
 * @param rawBpi - raw 7×12 BAV table (not mutated)
 * @param rawSav - raw 12-element SAV (not used in computation, kept for symmetry)
 * @param planetSigns - planet id (0-8) → sign (1-12)
 */
export function applyFullShodhana(
  rawBpi: number[][],
  rawSav: number[],
  planetSigns: number[],
): {
  reducedBpiTable: number[][];
  reducedSavTable: number[];
  pindaAshtakavarga: number[];
} {
  // Step 1: Trikona Shodhana
  const afterTrikona = trikonaShodhana(rawBpi);

  // Step 2: Ekadhipatya Shodhana
  const reducedBpiTable = ekadhipatyaShodhana(afterTrikona, planetSigns);

  // Step 3: Reduced SAV = column sums
  const reducedSavTable = new Array(12).fill(0);
  for (let s = 0; s < 12; s++) {
    for (let p = 0; p < reducedBpiTable.length; p++) {
      reducedSavTable[s] += reducedBpiTable[p][s];
    }
  }

  // Step 4: Pinda Ashtakavarga
  const pindaAshtakavarga = computePindaAshtakavarga(reducedBpiTable);

  return { reducedBpiTable, reducedSavTable, pindaAshtakavarga };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts`

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/ashtakavarga-shodhana.ts src/lib/kundali/__tests__/ashtakavarga-shodhana.test.ts
git commit -m "feat: implement Pinda Ashtakavarga and full Shodhana pipeline"
```

---

### Task 5: Integrate Shodhana into kundali-calc

**Files:**
- Modify: `src/lib/ephem/kundali-calc.ts`

- [ ] **Step 1: Add import and call Shodhana after existing BAV computation**

In `src/lib/ephem/kundali-calc.ts`, add the import near the top (with other kundali imports):

```typescript
import { applyFullShodhana } from '@/lib/kundali/ashtakavarga-shodhana';
```

Then find the line where `calculateAshtakavarga(planets, ascSign)` is called and its result is assigned. Replace:

```typescript
const ashtakavarga = calculateAshtakavarga(planets, ascSign);
```

with:

```typescript
const rawAshtakavarga = calculateAshtakavarga(planets, ascSign);
const allPlanetSigns = planets.map(p => p.sign);
const shodhanaResult = applyFullShodhana(
  rawAshtakavarga.bpiTable,
  rawAshtakavarga.savTable,
  allPlanetSigns,
);
const ashtakavarga: AshtakavargaData = {
  ...rawAshtakavarga,
  ...shodhanaResult,
};
```

Note: `planets` already includes Rahu (id=7) and Ketu (id=8) with `.sign` populated, so `allPlanetSigns` will be a 9-element array (ids 0-8), exactly what `ekadhipatyaShodhana` expects.

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | head -20`

Expected: 0 errors (the type now requires the new fields, and we're providing them).

- [ ] **Step 3: Run full test suite**

Run: `npx vitest run 2>&1 | tail -10`

Expected: all tests pass (existing tests + new Shodhana tests).

- [ ] **Step 4: Commit**

```bash
git add src/lib/ephem/kundali-calc.ts
git commit -m "feat: integrate Shodhana into kundali generation pipeline"
```

---

### Task 6: Extend AshtakavargaTab with Reduced view and Pinda section

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx` (the inline `AshtakavargaTab` function, starting ~line 2753)

- [ ] **Step 1: Add "Raw / Reduced" toggle and Pinda section**

The existing `AshtakavargaTab` already has `viewMode: 'sav' | 'bpi'`. Extend it to `'sav' | 'bpi' | 'reduced'` and add a Pinda summary section.

Find the `AshtakavargaTab` function (around line 2753). Make these changes:

**a)** Change the viewMode state type:

Replace:
```typescript
const [viewMode, setViewMode] = useState<'sav' | 'bpi'>('sav');
```
with:
```typescript
const [viewMode, setViewMode] = useState<'sav' | 'bpi' | 'reduced'>('sav');
```

**b)** Find where the existing BPI grid is rendered (the section that shows individual planet BAV tables when `viewMode === 'bpi'`). After the BPI grid section, add the reduced view. The exact location is after the `{viewMode === 'bpi' && (` block.

Add a new block for `viewMode === 'reduced'`:

```tsx
{viewMode === 'reduced' && ashtakavarga.reducedBpiTable && (
  <div className="space-y-4">
    <p className="text-text-secondary text-xs">
      {locale === 'en' || isTamil
        ? 'After Trikona & Ekadhipatya Shodhana (BPHS Ch.66-67). Reduced values show relative planetary strength per sign.'
        : 'त्रिकोण और एकाधिपत्य शोधन (BPHS अ.66-67) के बाद। शोधित मान प्रति राशि ग्रह का सापेक्ष बल दर्शाते हैं।'}
    </p>
    {ashtakavarga.reducedBpiTable.map((row, pIdx) => (
      <div key={pIdx} className="rounded-lg border border-gold-primary/10 p-3">
        <div className="text-gold-light text-sm font-semibold mb-2">{ashtakavarga.planetNames[pIdx]}</div>
        <div className="grid grid-cols-12 gap-1">
          {row.map((val, sIdx) => (
            <div key={sIdx} className={`text-center text-xs font-mono rounded py-1 ${val === 0 ? 'bg-white/[0.02] text-white/20' : val <= 2 ? 'bg-gold-primary/10 text-gold-dark' : val <= 4 ? 'bg-gold-primary/20 text-gold-light' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {val}
            </div>
          ))}
        </div>
        <div className="text-right text-xs text-text-secondary mt-1">
          {locale === 'en' || isTamil ? 'Total' : 'कुल'}: {row.reduce((a, b) => a + b, 0)}
        </div>
      </div>
    ))}
    {/* Reduced SAV comparison */}
    <div className="rounded-lg border border-gold-primary/15 p-4 mt-4">
      <div className="text-gold-light text-sm font-semibold mb-3">
        {locale === 'en' || isTamil ? 'Reduced SAV (Shodhita Sarvashtakavarga)' : 'शोधित सर्वाष्टकवर्ग'}
      </div>
      <div className="grid grid-cols-12 gap-1">
        {ashtakavarga.reducedSavTable.map((val, sIdx) => (
          <div key={sIdx} className="text-center">
            <div className="text-[9px] text-text-secondary mb-0.5">{RASHIS[sIdx]?.name?.en?.slice(0, 3)}</div>
            <div className="h-16 relative bg-white/[0.03] rounded overflow-hidden">
              {/* Raw SAV bar (outline) */}
              <div className="absolute bottom-0 w-full border border-gold-primary/20 rounded-sm" style={{ height: `${Math.min(100, (ashtakavarga.savTable[sIdx] / 40) * 100)}%` }} />
              {/* Reduced SAV bar (filled) */}
              <div className={`absolute bottom-0 w-full rounded-sm ${val >= 20 ? 'bg-emerald-500/40' : val >= 14 ? 'bg-gold-primary/30' : 'bg-red-500/30'}`} style={{ height: `${Math.min(100, (val / 40) * 100)}%` }} />
            </div>
            <div className="text-[10px] font-mono text-gold-light mt-0.5">{val}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-2 text-[9px] text-text-secondary">
        <span className="flex items-center gap-1"><span className="w-3 h-2 border border-gold-primary/20 rounded-sm inline-block" /> {locale === 'en' || isTamil ? 'Raw SAV' : 'मूल SAV'}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 bg-gold-primary/30 rounded-sm inline-block" /> {locale === 'en' || isTamil ? 'Reduced SAV' : 'शोधित SAV'}</span>
      </div>
    </div>
  </div>
)}
```

**c)** Add Pinda section (always visible at the bottom of the tab, after all view modes):

```tsx
{/* Pinda Ashtakavarga */}
{ashtakavarga.pindaAshtakavarga && (
  <div className="mt-6">
    <h4 className="text-gold-light text-sm font-bold mb-3">
      {locale === 'en' || isTamil ? 'Pinda Ashtakavarga (BPHS Ch.69)' : 'पिण्ड अष्टकवर्ग (BPHS अ.69)'}
    </h4>
    <p className="text-text-secondary text-xs mb-3">
      {locale === 'en' || isTamil
        ? 'Weighted composite strength per planet. Higher Pinda = stronger capacity to deliver results during dasha and transit periods.'
        : 'प्रति ग्रह भारित समग्र बल। उच्च पिण्ड = दशा और गोचर काल में फल देने की अधिक क्षमता।'}
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {ashtakavarga.pindaAshtakavarga.map((pinda, pIdx) => {
        const label = pinda > 200 ? 'High' : pinda > 100 ? 'Medium' : 'Low';
        const labelHi = pinda > 200 ? 'उच्च' : pinda > 100 ? 'मध्यम' : 'न्यून';
        const color = pinda > 200 ? 'text-emerald-400 border-emerald-500/20' : pinda > 100 ? 'text-gold-light border-gold-primary/20' : 'text-red-400 border-red-500/20';
        return (
          <div key={pIdx} className={`rounded-xl border p-3 text-center ${color}`}>
            <div className="text-text-secondary text-xs mb-1">{ashtakavarga.planetNames[pIdx]}</div>
            <div className="text-2xl font-bold font-mono">{pinda}</div>
            <div className="text-xs mt-1 opacity-70">{locale === 'en' || isTamil ? label : labelHi}</div>
          </div>
        );
      })}
    </div>
  </div>
)}
```

**d)** Add "Reduced" button to the existing view mode toggle. Find the existing toggle buttons (the ones for SAV/BPI) and add a third button:

```tsx
<button
  onClick={() => setViewMode('reduced')}
  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'reduced' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-white border border-white/5'}`}
>
  {locale === 'en' || isTamil ? 'Reduced (Shodhana)' : 'शोधित'}
</button>
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | head -10`

Expected: 0 errors.

- [ ] **Step 3: Run full test suite and build**

Run: `npx vitest run 2>&1 | tail -10`

Then: `npx next build 2>&1 | grep -E 'Compiled|Generating'`

Expected: all tests pass, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/kundali/page.tsx
git commit -m "feat: add Reduced view and Pinda section to Ashtakavarga tab"
```

---

### Task 7: Final verification

**Files:** None — verification only.

- [ ] **Step 1: Run all three gates**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx vitest run
npx next build
```

Expected: 0 type errors, all tests pass, build succeeds with 2188 pages.

- [ ] **Step 2: Verify in browser**

Start dev server: `npx next dev`

1. Navigate to `/en/kundali`
2. Generate a chart (any birth data)
3. Click the "Ashtakavarga" tab
4. Verify the "SAV", "BPI", and "Reduced (Shodhana)" toggle works
5. In "Reduced" view, verify values are lower than or equal to raw values
6. Verify the SAV comparison bars show raw (outline) vs reduced (filled)
7. Verify the Pinda section shows 7 planet cards with numeric values and High/Medium/Low labels
8. Switch locale to Hindi — verify labels change

- [ ] **Step 3: Commit any final polish**

```bash
git add -A
git commit -m "feat: Ashtakavarga Shodhana — complete implementation"
```
