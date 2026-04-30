/**
 * Panchavargeya Bala — Varahamihira's 5-chart dignity score
 *
 * A planet earns points based on its dignity in 5 divisional charts:
 *   Rashi (D1) = 3 pts, Hora (D2) = 1.5 pts, Drekkana (D3) = 1 pts,
 *   Navamsha (D9) = 1.5 pts, Dwadashamsha (D12) = 0.5 pts
 *
 * Dignity multipliers:
 *   Own/Moolatrikona = 100%, Exalted = 100% + 0.5 bonus,
 *   Friend = 75%, Neutral = 50%, Enemy = 25%, Debilitated = 0%
 *
 * Maximum per planet: 3 + 1.5 + 1 + 1.5 + 0.5 + bonuses = ~8 pts
 * Reference: Brihat Jataka, Chapter 1 (Varahamihira)
 */

import { SIGN_LORDS, EXALTATION_SIGNS, DEBILITATION_SIGNS, OWN_SIGNS } from '@/lib/constants/dignities';

/** Full points per divisional chart */
const CHART_WEIGHTS = {
  D1: 3,    // Rashi
  D2: 1.5,  // Hora
  D3: 1,    // Drekkana
  D9: 1.5,  // Navamsha
  D12: 0.5, // Dwadashamsha
} as const;

type ChartKey = keyof typeof CHART_WEIGHTS;

/** Dignity multiplier */
function dignityMultiplier(planetId: number, signId: number): { mult: number; bonus: number } {
  // Exalted
  if (EXALTATION_SIGNS[planetId] === signId) return { mult: 1, bonus: 0.5 };
  // Debilitated
  if (DEBILITATION_SIGNS[planetId] === signId) return { mult: 0, bonus: 0 };
  // Own sign / Moolatrikona
  if (OWN_SIGNS[planetId]?.includes(signId)) return { mult: 1, bonus: 0 };
  // Friend/Neutral/Enemy — simplified: sign lord relationship
  const signLord = SIGN_LORDS[signId];
  if (signLord === planetId) return { mult: 1, bonus: 0 }; // own sign
  // Use a simplified friendship table for the 5 classical dignity levels
  const friends = FRIENDSHIP_MAP[planetId];
  if (friends?.friends.includes(signLord)) return { mult: 0.75, bonus: 0 };
  if (friends?.enemies.includes(signLord)) return { mult: 0.25, bonus: 0 };
  return { mult: 0.5, bonus: 0 }; // neutral
}

/** Simplified friendship map — BPHS Ch.3 natural friendships */
const FRIENDSHIP_MAP: Record<number, { friends: number[]; enemies: number[] }> = {
  0: { friends: [1, 2, 4], enemies: [5, 6] },       // Sun
  1: { friends: [0, 3], enemies: [] },                // Moon
  2: { friends: [0, 1, 4], enemies: [3] },            // Mars
  3: { friends: [0, 5], enemies: [1] },               // Mercury
  4: { friends: [0, 1, 2], enemies: [3, 5] },         // Jupiter
  5: { friends: [3, 6], enemies: [0, 1] },            // Venus
  6: { friends: [3, 5], enemies: [0, 1, 2] },         // Saturn
  7: { friends: [3, 5, 6], enemies: [0, 1, 2] },      // Rahu (treated like Saturn)
  8: { friends: [0, 1, 2], enemies: [3, 5] },          // Ketu (treated like Mars)
};

export interface PanchavargeyaResult {
  planetId: number;
  scores: Record<ChartKey, number>;
  total: number;
  maxPossible: number; // 7.5 base + up to 2.5 bonus
  percentage: number;
  verdict: 'strong' | 'moderate' | 'weak';
}

/**
 * Compute Panchavargeya Bala for all planets.
 * @param planetSigns - for each planet (0-8), the sign (1-12) in each varga chart
 */
export function computePanchavargeyaBala(
  planetSigns: { planetId: number; D1: number; D2: number; D3: number; D9: number; D12: number }[]
): PanchavargeyaResult[] {
  const maxBase = Object.values(CHART_WEIGHTS).reduce((s, v) => s + v, 0); // 7.5

  return planetSigns.map(({ planetId, ...charts }) => {
    const scores: Record<string, number> = {};
    let total = 0;

    for (const [chart, weight] of Object.entries(CHART_WEIGHTS) as [ChartKey, number][]) {
      const signId = charts[chart];
      const { mult, bonus } = dignityMultiplier(planetId, signId);
      const score = weight * mult + bonus;
      scores[chart] = Math.round(score * 100) / 100;
      total += score;
    }

    total = Math.round(total * 100) / 100;
    const percentage = Math.round((total / maxBase) * 100);

    return {
      planetId,
      scores: scores as Record<ChartKey, number>,
      total,
      maxPossible: maxBase,
      percentage,
      verdict: percentage >= 65 ? 'strong' : percentage >= 40 ? 'moderate' : 'weak',
    };
  });
}
