/**
 * Ashtakavarga Shodhana — Trikona, Ekadhipatya, Pinda
 *
 * This module implements the two classical reduction passes applied to raw
 * Bhinnashtakavarga (BAV) tables and computes Pinda Ashtakavarga per planet.
 *
 * References: Brihat Parashara Hora Shastra (BPHS), Ch. 66-69
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Trikona groups — each tuple is the three 0-based sign indices that share
 * the same element (Fire, Earth, Air, Water).
 */
const TRIKONA_GROUPS: [number, number, number][] = [
  [0, 4, 8],   // Fire:  Aries, Leo, Sagittarius
  [1, 5, 9],   // Earth: Taurus, Virgo, Capricorn
  [2, 6, 10],  // Air:   Gemini, Libra, Aquarius
  [3, 7, 11],  // Water: Cancer, Scorpio, Pisces
];

/**
 * Ekadhipatya (dual-rulership) pairs — [sign-index-A, sign-index-B, lord-planet-id].
 * Sign indices are 0-based (Aries=0 … Pisces=11).
 * Rahu id=7, Ketu id=8 are checked separately.
 *
 * Monoruled signs (Sun→Leo, Moon→Cancer) have no dual and are skipped.
 */
const EKADHIPATYA_PAIRS: [number, number, number][] = [
  [0,  7,  2],  // Aries(0)  & Scorpio(7)   → Mars(2)
  [1,  6,  5],  // Taurus(1) & Libra(6)     → Venus(5)
  [2,  5,  3],  // Gemini(2) & Virgo(5)     → Mercury(3)
  [8,  11, 4],  // Sag(8)    & Pisces(11)   → Jupiter(4)
  [9,  10, 6],  // Cap(9)    & Aquarius(10) → Saturn(6)
];

/**
 * Graha Guna (planet weight) for Pinda computation.
 * Index = planet id: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
 */
const GRAHA_GUNA = [5, 5, 8, 5, 10, 7, 5] as const;

/**
 * Rashi Guna by element index (signIndex % 4).
 * Fire=7, Earth=5, Air=6, Water=8
 * Pattern repeats: Aries(0)→Fire, Taurus(1)→Earth, Gemini(2)→Air, Cancer(3)→Water, Leo(4)→Fire, …
 */
const RASHI_GUNA = [7, 5, 6, 8] as const;

// ---------------------------------------------------------------------------
// Task 2 — Trikona Shodhana
// ---------------------------------------------------------------------------

/**
 * Trikona Shodhana: for each planet's 12-sign BAV row, find the minimum
 * value within each of the four trikona groups (Fire/Earth/Air/Water) and
 * subtract it from every cell in that group.
 *
 * Does not mutate the input; returns a new 7×12 table.
 */
export function trikonaShodhana(bpiTable: number[][]): number[][] {
  return bpiTable.map(row => {
    const reduced = [...row];
    for (const group of TRIKONA_GROUPS) {
      const min = Math.min(reduced[group[0]], reduced[group[1]], reduced[group[2]]);
      for (const idx of group) {
        reduced[idx] -= min;
      }
    }
    return reduced;
  });
}

// ---------------------------------------------------------------------------
// Task 3 — Ekadhipatya Shodhana
// ---------------------------------------------------------------------------

/**
 * Ekadhipatya Shodhana: for each dual-lordship pair, apply reduction rules.
 *
 * Rules (applied per planet's BAV row):
 *   1. If the pair's lord occupies either sign in the pair → retain both (no reduction).
 *   2. If Rahu(7) or Ketu(8) is in one sign of the pair and the lord is absent from the pair
 *      → retain the sign where Rahu/Ketu sits, zero the other.
 *   3. Otherwise (neither lord nor Rahu/Ketu in either sign) → retain the sign with the
 *      higher value, zero the lower. If equal, zero the later sign (higher index).
 *
 * @param bpiTable   Raw or Trikona-reduced 7×12 BAV table (not mutated).
 * @param planetSigns Planet id (0–8) → current sign 1-based (1=Aries … 12=Pisces).
 */
export function ekadhipatyaShodhana(
  bpiTable: number[][],
  planetSigns: number[],
): number[][] {
  // Deep copy so we don't mutate the input
  const result: number[][] = bpiTable.map(row => [...row]);

  // Convert 1-based planetSigns to 0-based sign indices for comparison
  const signIdx = planetSigns.map(s => s - 1); // planet-id → 0-based sign index

  for (const [signA, signB, lordId] of EKADHIPATYA_PAIRS) {
    const lordSign = signIdx[lordId]; // 0-based sign where this lord sits

    // Rule 1: lord is in one of its own pair signs → no reduction
    if (lordSign === signA || lordSign === signB) {
      continue;
    }

    // Rule 2: Rahu(7) or Ketu(8) in one of the pair signs (lord absent from pair)
    const rahuSign = signIdx[7];
    const ketuSign = signIdx[8];
    const rahuInA = rahuSign === signA;
    const rahuInB = rahuSign === signB;
    const ketuInA = ketuSign === signA;
    const ketuInB = ketuSign === signB;

    // Rules 2 & 3 are applied PER PLANET ROW (each planet's BAV is independent)
    for (const row of result) {
      if (rahuInA || ketuInA) {
        // Rule 2: Rahu/Ketu in signA → retain signA, zero signB
        row[signB] = 0;
      } else if (rahuInB || ketuInB) {
        // Rule 2: Rahu/Ketu in signB → retain signB, zero signA
        row[signA] = 0;
      } else {
        // Rule 3: neither lord nor Rahu/Ketu → retain higher, zero lower
        const valA = row[signA];
        const valB = row[signB];
        if (valA > valB) {
          row[signB] = 0;
        } else if (valB > valA) {
          row[signA] = 0;
        } else {
          // Equal: zero the later (higher-index) sign
          row[signB] = 0;
        }
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Task 4 — Pinda Ashtakavarga
// ---------------------------------------------------------------------------

/**
 * Compute Pinda Ashtakavarga for each of the 7 planets.
 *
 * Formula: Pinda[p] = Σ (reducedBAV[p][s] × rashiGuna[s % 4] × grahaGuna[p])
 *          summed over all 12 sign indices s.
 *
 * Does not mutate input.
 */
export function computePindaAshtakavarga(reducedBpiTable: number[][]): number[] {
  return reducedBpiTable.map((row, p) => {
    const gGuna = GRAHA_GUNA[p];
    let pinda = 0;
    for (let s = 0; s < 12; s++) {
      pinda += row[s] * RASHI_GUNA[s % 4] * gGuna;
    }
    return pinda;
  });
}

// ---------------------------------------------------------------------------
// Sarvashtakavarga Trikona Shodhana
// ---------------------------------------------------------------------------

/**
 * Apply Trikona Shodhana to the Sarvashtakavarga (SAV) row.
 * This is an OPTIONAL additional step — JHora does not do this by default,
 * but some texts prescribe it for transit timing.
 *
 * Same trikona logic as per-planet, but applied to the single 12-element SAV row.
 */
export function shodhitaSarvashtakavarga(savTable: number[]): number[] {
  const reduced = [...savTable];
  for (const group of TRIKONA_GROUPS) {
    const min = Math.min(...group.map(i => reduced[i]));
    for (const i of group) reduced[i] -= min;
  }
  return reduced;
}

// ---------------------------------------------------------------------------
// Full Shodhana pipeline
// ---------------------------------------------------------------------------

export interface ShodhanaResult {
  reducedBpiTable: number[][];
  reducedSavTable: number[];
  pindaAshtakavarga: number[];
  shodhitaSav: number[];
}

/**
 * Apply the full Ashtakavarga Shodhana pipeline:
 *   1. Trikona Shodhana
 *   2. Ekadhipatya Shodhana
 *   3. Compute reduced Sarvashtakavarga (column sums)
 *   4. Compute Pinda Ashtakavarga
 *
 * @param bpiTable    Raw 7×12 Bhinnashtakavarga table (not mutated).
 * @param planetSigns Planet id (0–8) → sign 1-based (1=Aries … 12=Pisces).
 */
export function applyFullShodhana(
  bpiTable: number[][],
  planetSigns: number[],
): ShodhanaResult {
  const afterTrikona = trikonaShodhana(bpiTable);
  const reducedBpiTable = ekadhipatyaShodhana(afterTrikona, planetSigns);

  // Reduced Sarvashtakavarga: column sums of reducedBpiTable
  const reducedSavTable: number[] = new Array(12).fill(0);
  for (let s = 0; s < 12; s++) {
    for (let p = 0; p < reducedBpiTable.length; p++) {
      reducedSavTable[s] += reducedBpiTable[p][s];
    }
  }

  const pindaAshtakavarga = computePindaAshtakavarga(reducedBpiTable);
  const shodhitaSav = shodhitaSarvashtakavarga(reducedSavTable);

  return { reducedBpiTable, reducedSavTable, pindaAshtakavarga, shodhitaSav };
}
