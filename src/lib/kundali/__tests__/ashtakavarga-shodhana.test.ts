import { describe, it, expect } from 'vitest';
import {
  trikonaShodhana,
  ekadhipatyaShodhana,
  computePindaAshtakavarga,
  applyFullShodhana,
  shodhitaSarvashtakavarga,
} from '@/lib/kundali/ashtakavarga-shodhana';

// ---------------------------------------------------------------------------
// Task 2 — Trikona Shodhana
// ---------------------------------------------------------------------------
describe('trikonaShodhana', () => {
  it('reduces each trikona group by its minimum', () => {
    // Fire [0,4,8]: [5,3,4] → min=3 → [2,0,1]
    // Earth [1,5,9]: [2,6,4] → min=2 → [0,4,2]
    // Air  [2,6,10]: [3,3,3] → min=3 → [0,0,0]
    // Water[3,7,11]: [7,1,5] → min=1 → [6,0,4]
    const input = [[5, 2, 3, 7, 3, 6, 3, 1, 4, 4, 3, 5]];
    const result = trikonaShodhana(input);
    expect(result[0]).toEqual([2, 0, 0, 6, 0, 4, 0, 0, 1, 2, 0, 4]);
  });

  it('all-zero row stays zero', () => {
    const input = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    const result = trikonaShodhana(input);
    expect(result[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('identical values in a trikona group all reduce to zero', () => {
    // All signs = 4: each trikona min=4, all reduce to 0
    const input = [[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]];
    const result = trikonaShodhana(input);
    expect(result[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('processes all 7 planet rows independently', () => {
    const row = [5, 2, 3, 7, 3, 6, 3, 1, 4, 4, 3, 5];
    const input = Array.from({ length: 7 }, () => [...row]);
    const result = trikonaShodhana(input);
    expect(result).toHaveLength(7);
    for (const r of result) {
      expect(r).toEqual([2, 0, 0, 6, 0, 4, 0, 0, 1, 2, 0, 4]);
    }
  });

  it('does not mutate the input', () => {
    const row = [5, 2, 3, 7, 3, 6, 3, 1, 4, 4, 3, 5];
    const input = [[...row]];
    const original = [...row];
    trikonaShodhana(input);
    expect(input[0]).toEqual(original);
  });
});

// ---------------------------------------------------------------------------
// Task 3 — Ekadhipatya Shodhana
// ---------------------------------------------------------------------------
// Dual-lord pairs (0-based sign indices):
//   Mars:    Aries(0)  & Scorpio(7)
//   Venus:   Taurus(1) & Libra(6)
//   Mercury: Gemini(2) & Virgo(5)
//   Jupiter: Sag(8)    & Pisces(11)
//   Saturn:  Cap(9)    & Aquarius(10)
//
// planetSigns: planet id (0-8) → sign 1-12 (1-based)

function makeBpiTable(overrides: Partial<Record<number, number[]>> = {}): number[][] {
  const table: number[][] = [];
  for (let p = 0; p < 7; p++) {
    table.push(overrides[p] ?? new Array(12).fill(3));
  }
  return table;
}

describe('ekadhipatyaShodhana', () => {
  it('lord in own pair sign → both retained', () => {
    // Mars (id=2) in Aries (sign 1, index 0) → both Aries & Scorpio kept
    const planetSigns: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1]; // Sun..Ketu all in sign 1
    // planet 2 = Mars in sign 1 (Aries, index 0) — which is one of Mars's pair signs
    planetSigns[2] = 1; // Mars in Aries (1-based sign 1 → index 0)
    const bpiTable = makeBpiTable({ 2: [4, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0] });
    const result = ekadhipatyaShodhana(bpiTable, planetSigns);
    // Mars row: Aries(0)=4, Scorpio(7)=5 — both retained because Mars is in Aries
    expect(result[2][0]).toBe(4);
    expect(result[2][7]).toBe(5);
  });

  it('Rahu in one pair sign → that sign retained, other zeroed', () => {
    // Venus pair: Taurus(1) & Libra(6). Rahu(id=7) in Taurus(sign 2 → index 1)
    // Venus(id=5) NOT in either pair sign
    const planetSigns: number[] = [3, 3, 3, 3, 3, 3, 3, 2, 3]; // Rahu(7) in sign 2(Taurus)
    const bpiTable = makeBpiTable({ 5: [0, 3, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0] });
    const result = ekadhipatyaShodhana(bpiTable, planetSigns);
    // Rahu in Taurus → retain Taurus(1)=3, zero Libra(6)=0→already 0 but higher would be zeroed
    // Actually: Rahu in Taurus sign, so retain Taurus side, zero Libra side
    expect(result[5][1]).toBe(3);  // Taurus retained (Rahu's sign)
    expect(result[5][6]).toBe(0);  // Libra zeroed
  });

  it('neither lord nor Rahu/Ketu → higher retained, lower zeroed', () => {
    // Saturn pair: Cap(9) & Aquarius(10). Saturn(id=6) not in either.
    // Rahu(7) and Ketu(8) not in either pair sign.
    const planetSigns: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1]; // all in sign 1 (Aries, index 0)
    const bpiTable = makeBpiTable({ 6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4, 0, 0] });
    // Oops: 12 elements needed
    const row6 = new Array(12).fill(0);
    row6[9] = 6;  // Cap
    row6[10] = 4; // Aquarius
    const bpi2 = makeBpiTable({ 6: row6 });
    const result = ekadhipatyaShodhana(bpi2, planetSigns);
    // Cap(9)=6 > Aquarius(10)=4 → retain Cap, zero Aquarius
    expect(result[6][9]).toBe(6);
    expect(result[6][10]).toBe(0);
  });

  it('equal values → later sign zeroed', () => {
    // Mercury pair: Gemini(2) & Virgo(5). Mercury(id=3) not in either.
    const planetSigns: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    const row3 = new Array(12).fill(0);
    row3[2] = 5; // Gemini
    row3[5] = 5; // Virgo — same value, later sign → zeroed
    const bpi = makeBpiTable({ 3: row3 });
    const result = ekadhipatyaShodhana(bpi, planetSigns);
    expect(result[3][2]).toBe(5); // Gemini retained (earlier sign)
    expect(result[3][5]).toBe(0); // Virgo zeroed (later sign)
  });

  it('processes all 7 planet rows in the table', () => {
    const planetSigns: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    const bpiTable = makeBpiTable();
    const result = ekadhipatyaShodhana(bpiTable, planetSigns);
    expect(result).toHaveLength(7);
  });

  it('does not mutate the input', () => {
    const planetSigns: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    const row = new Array(12).fill(3);
    const bpiTable = [row.slice()];
    for (let i = 1; i < 7; i++) bpiTable.push(row.slice());
    const snapshot = bpiTable.map(r => [...r]);
    ekadhipatyaShodhana(bpiTable, planetSigns);
    expect(bpiTable).toEqual(snapshot);
  });
});

// ---------------------------------------------------------------------------
// Task 4 — Pinda Ashtakavarga and full Shodhana pipeline
// ---------------------------------------------------------------------------
// rashiGuna by element index (signIndex % 4): Fire=7, Earth=5, Air=6, Water=8
// RASHI_GUNA = [7, 5, 6, 8]  (index 0=Fire, 1=Earth, 2=Air, 3=Water)
// grahaGuna: [Sun=5, Moon=5, Mars=8, Mercury=5, Jupiter=10, Venus=7, Saturn=5]

describe('computePindaAshtakavarga', () => {
  it('all-1 Sun row = 390 (78 × 5)', () => {
    // All 12 signs = 1 bindu for Sun (planet 0, grahaGuna=5)
    // sum over 12: 1 × rashiGuna[signIdx%4] × 5
    // rashiGuna cycle over 12 signs: [7,5,6,8,7,5,6,8,7,5,6,8] → sum = (7+5+6+8)*3 = 78
    // Pinda = 78 × 5 = 390
    const reducedBpiTable = [
      new Array(12).fill(1), // Sun
      ...Array.from({ length: 6 }, () => new Array(12).fill(0)),
    ];
    const result = computePindaAshtakavarga(reducedBpiTable);
    expect(result[0]).toBe(390);
  });

  it('all-zero table → all zero pinda', () => {
    const reducedBpiTable = Array.from({ length: 7 }, () => new Array(12).fill(0));
    const result = computePindaAshtakavarga(reducedBpiTable);
    expect(result).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it('1 bindu in Aries(signIdx=0,rashiGuna=7) for each planet → [35,35,56,35,70,49,35]', () => {
    // grahaGuna = [5, 5, 8, 5, 10, 7, 5]
    // Aries = index 0, rashiGuna = 7
    // Pinda[p] = 1 × 7 × grahaGuna[p]
    const expected = [5 * 7, 5 * 7, 8 * 7, 5 * 7, 10 * 7, 7 * 7, 5 * 7];
    const reducedBpiTable = Array.from({ length: 7 }, () => {
      const row = new Array(12).fill(0);
      row[0] = 1; // Aries only
      return row;
    });
    const result = computePindaAshtakavarga(reducedBpiTable);
    expect(result).toEqual(expected);
  });

  it('does not mutate input', () => {
    const reducedBpiTable = Array.from({ length: 7 }, () => new Array(12).fill(2));
    const snapshot = reducedBpiTable.map(r => [...r]);
    computePindaAshtakavarga(reducedBpiTable);
    expect(reducedBpiTable).toEqual(snapshot);
  });
});

describe('applyFullShodhana', () => {
  it('reduced SAV = column sums of reduced BPI', () => {
    // Use a simple table where no reduction happens (all same value per trikona)
    // All zeros → reduced is all zeros, SAV all zeros
    const bpiTable = Array.from({ length: 7 }, () => new Array(12).fill(0));
    const planetSigns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const { reducedBpiTable, reducedSavTable } = applyFullShodhana(bpiTable, planetSigns);
    // Verify SAV = column sums of reducedBpiTable
    for (let s = 0; s < 12; s++) {
      const colSum = reducedBpiTable.reduce((acc, row) => acc + row[s], 0);
      expect(reducedSavTable[s]).toBe(colSum);
    }
  });

  it('all values >= 0 after full shodhana', () => {
    // Use the known input that has trikona reduction
    const row = [5, 2, 3, 7, 3, 6, 3, 1, 4, 4, 3, 5];
    const bpiTable = Array.from({ length: 7 }, () => [...row]);
    const planetSigns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const { reducedBpiTable, reducedSavTable, pindaAshtakavarga } = applyFullShodhana(bpiTable, planetSigns);
    for (const row of reducedBpiTable) {
      for (const v of row) expect(v).toBeGreaterThanOrEqual(0);
    }
    for (const v of reducedSavTable) expect(v).toBeGreaterThanOrEqual(0);
    for (const v of pindaAshtakavarga) expect(v).toBeGreaterThanOrEqual(0);
  });

  it('does not mutate input bpiTable', () => {
    const bpiTable = Array.from({ length: 7 }, () => new Array(12).fill(3));
    const snapshot = bpiTable.map(r => [...r]);
    const planetSigns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    applyFullShodhana(bpiTable, planetSigns);
    expect(bpiTable).toEqual(snapshot);
  });

  it('shodhitaSav is included in full shodhana result', () => {
    const bpiTable = Array.from({ length: 7 }, () => new Array(12).fill(3));
    const planetSigns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result = applyFullShodhana(bpiTable, planetSigns);
    expect(result.shodhitaSav).toBeDefined();
    expect(result.shodhitaSav).toHaveLength(12);
    for (const v of result.shodhitaSav) expect(v).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// Sarvashtakavarga Trikona Shodhana
// ---------------------------------------------------------------------------
describe('shodhitaSarvashtakavarga', () => {
  it('reduces trikona groups by their minimum', () => {
    // Fire [0,4,8]: [10, 8, 12] → min=8 → [2, 0, 4]
    // Earth [1,5,9]: [5, 5, 5] → min=5 → [0, 0, 0]
    // Air [2,6,10]: [3, 7, 1] → min=1 → [2, 6, 0]
    // Water [3,7,11]: [6, 4, 9] → min=4 → [2, 0, 5]
    const sav = [10, 5, 3, 6, 8, 5, 7, 4, 12, 5, 1, 9];
    const result = shodhitaSarvashtakavarga(sav);
    expect(result).toEqual([2, 0, 2, 2, 0, 0, 6, 0, 4, 0, 0, 5]);
  });

  it('does not mutate the input', () => {
    const sav = [10, 5, 3, 6, 8, 5, 7, 4, 12, 5, 1, 9];
    const snapshot = [...sav];
    shodhitaSarvashtakavarga(sav);
    expect(sav).toEqual(snapshot);
  });

  it('all-zero SAV stays zero', () => {
    const sav = new Array(12).fill(0);
    const result = shodhitaSarvashtakavarga(sav);
    expect(result).toEqual(new Array(12).fill(0));
  });

  it('uniform values reduce to all zeros', () => {
    const sav = new Array(12).fill(7);
    const result = shodhitaSarvashtakavarga(sav);
    expect(result).toEqual(new Array(12).fill(0));
  });
});
