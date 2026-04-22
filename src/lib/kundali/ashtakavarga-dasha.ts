/**
 * Ashtakavarga-Based Dasha Predictions
 *
 * Per BPHS Ch.70, the quality of a Maha Dasha period can be predicted from
 * the dasha lord's Ashtakavarga scores. A planet with high BAV total across
 * 12 signs will deliver better results during its dasha.
 *
 * Rahu/Ketu don't have their own BAV rows (BAV covers planets 0-6 only).
 * Rahu dasha uses Saturn's BAV (Rahu acts like Saturn per classical texts).
 * Ketu dasha uses Mars's BAV (Ketu acts like Mars per classical texts).
 */

import type { DashaEntry } from '@/types/kundali';

export interface AshtakavargaDashaPrediction {
  planet: string;
  planetId: number;
  dashaPeriod: { start: string; end: string };
  bavTotal: number;        // sum of reduced BAV across 12 signs for this planet
  pindaScore: number;      // Pinda Ashtakavarga value
  strongSigns: number[];   // signs (1-12) where this planet has 4+ BAV
  weakSigns: number[];     // signs (1-12) where BAV = 0-1
  prediction: 'highly_favorable' | 'favorable' | 'moderate' | 'challenging';
  description: string;
}

/** Map planet name (as stored in DashaEntry.planet) to planet id */
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6,
  Rahu: 7, Ketu: 8,
};

/**
 * For Rahu/Ketu, we use a proxy planet's BAV row since they don't have
 * their own Bhinnashtakavarga.
 * Rahu → Saturn(6), Ketu → Mars(2) per classical convention.
 */
function getBavRowIndex(planetId: number): number {
  if (planetId === 7) return 6; // Rahu → Saturn
  if (planetId === 8) return 2; // Ketu → Mars
  return planetId;
}

/** Prediction thresholds description text */
const PREDICTION_DESCRIPTIONS: Record<string, string> = {
  highly_favorable:
    'This dasha period is highly favorable. The dasha lord commands strong Ashtakavarga support across the zodiac, indicating material success, good health, and overall prosperity during this period.',
  favorable:
    'This dasha period is generally favorable. The dasha lord has adequate Ashtakavarga support, suggesting positive outcomes with some areas of moderate challenge.',
  moderate:
    'This dasha period brings mixed results. The dasha lord has average Ashtakavarga scores, indicating both opportunities and obstacles in roughly equal measure.',
  challenging:
    'This dasha period may be challenging. The dasha lord has low Ashtakavarga support, suggesting obstacles and delays. Remedial measures for this planet are recommended.',
};

/**
 * Classify BAV total into prediction level.
 * Thresholds: 40+ highly_favorable, 30-39 favorable, 20-29 moderate, <20 challenging
 */
function classifyBavTotal(bavTotal: number): AshtakavargaDashaPrediction['prediction'] {
  if (bavTotal >= 40) return 'highly_favorable';
  if (bavTotal >= 30) return 'favorable';
  if (bavTotal >= 20) return 'moderate';
  return 'challenging';
}

/**
 * Predict Maha Dasha quality using Ashtakavarga scores.
 *
 * @param dashas      - Array of DashaEntry (all levels — filtered to maha internally)
 * @param reducedBpi  - 7×12 reduced Bhinnashtakavarga table (after Shodhana)
 * @param pinda       - 7-element Pinda Ashtakavarga array (one per planet 0-6)
 */
export function predictDashaFromAshtakavarga(
  dashas: DashaEntry[],
  reducedBpi: number[][],
  pinda: number[],
): AshtakavargaDashaPrediction[] {
  // Filter to maha-level dashas only
  const mahaDashas = dashas.filter(d => d.level === 'maha');

  return mahaDashas.map(dasha => {
    const planetId = PLANET_NAME_TO_ID[dasha.planet];
    if (planetId === undefined) {
      // Unknown planet name — return a neutral prediction
      // Guard: log so we notice if this happens (per CLAUDE.md rule: never silently swallow)
      console.error(`[ashtakavarga-dasha] Unknown planet name in dasha: "${dasha.planet}"`);
      return {
        planet: dasha.planet,
        planetId: -1,
        dashaPeriod: { start: dasha.startDate, end: dasha.endDate },
        bavTotal: 0,
        pindaScore: 0,
        strongSigns: [],
        weakSigns: [],
        prediction: 'moderate' as const,
        description: PREDICTION_DESCRIPTIONS.moderate,
      };
    }

    const bavRowIndex = getBavRowIndex(planetId);
    const bavRow = reducedBpi[bavRowIndex] ?? new Array(12).fill(0);
    const bavTotal = bavRow.reduce((sum, v) => sum + v, 0);

    // Pinda score — Rahu/Ketu use their proxy planet's pinda too
    const pindaScore = pinda[bavRowIndex] ?? 0;

    // Strong signs: BAV >= 4 (1-based sign numbers)
    const strongSigns: number[] = [];
    const weakSigns: number[] = [];
    for (let i = 0; i < 12; i++) {
      const score = bavRow[i] ?? 0;
      if (score >= 4) strongSigns.push(i + 1);
      if (score <= 1) weakSigns.push(i + 1);
    }

    const prediction = classifyBavTotal(bavTotal);

    return {
      planet: dasha.planet,
      planetId,
      dashaPeriod: { start: dasha.startDate, end: dasha.endDate },
      bavTotal,
      pindaScore,
      strongSigns,
      weakSigns,
      prediction,
      description: PREDICTION_DESCRIPTIONS[prediction],
    };
  });
}
