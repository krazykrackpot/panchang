/**
 * Vimshopaka Bala  –  Dignity-based strength across divisional charts
 * Reference: BPHS Ch.16
 *
 * Measures how well-placed a planet is across all Shodashavarga (16 divisional charts).
 * Maximum = 20 points per planet. Higher = stronger.
 */

import type { PlanetPosition, DivisionalChart } from '@/types/kundali';
import {
  SIGN_LORDS as SIGN_LORD,
  EXALTATION_SIGNS as EXALTATION,
  DEBILITATION_SIGNS as DEBILITATION,
  OWN_SIGNS,
  MOOLATRIKONA_SIGN as MOOLATRIKONA,
} from '@/lib/constants/dignities';

// Round 2 COMP-5 — friendship from canonical @/lib/constants/friendships.
// Previously this file kept 7-planet local copies (Sun-Saturn).
//
// HISTORICAL BUG (closed by this file's original ENEMIES table): the
// vimshopaka score for "enemy sign" was inflated to "neutral" because no
// ENEMIES table existed and dignityScore() treated the else-case as
// enemy via mutual-asymmetry. Lesson Q: the fix is now centralised in
// @/lib/constants/friendships, so any future correction stays in one
// place.
import { friendsAsSet, enemiesAsSet } from '@/lib/constants/friendships';
const FRIENDS: Record<number, Set<number>> = Object.fromEntries(
  [0, 1, 2, 3, 4, 5, 6, 7, 8].map((id) => [id, friendsAsSet(id)]),
);
const ENEMIES: Record<number, Set<number>> = Object.fromEntries(
  [0, 1, 2, 3, 4, 5, 6, 7, 8].map((id) => [id, enemiesAsSet(id)]),
);

// Shodashavarga (16 charts) weights  –  BPHS Ch.16, Shloka 1-6.
// Exactly 16 vargas with weights summing to 20.
//
// HISTORICAL BUG (now fixed): the weights included D5, D6, D8 which are NOT part
// of the standard Shodashavarga, bringing the total to 19 entries summing to ~21.
// This inflated vimshopaka scores for planets with favourable placements in those
// extra charts and deflated scores for others, since the final score is a weighted
// average (totalWeightedDignity / totalWeight) that is compared against the
// classical 0-20 tier thresholds.
//
// The standard BPHS Shodashavarga and its weights:
//   D1(Rashi)=3.5, D2(Hora)=1.5, D3(Drekkana)=1.5, D4(Chaturthamsha)=1.5,
//   D7(Saptamsha)=1.5, D9(Navamsha)=3, D10(Dashamsha)=1.5, D12(Dwadashamsha)=1.5,
//   D16(Shodashamsha)=1, D20(Vimshamsha)=1, D24(Chaturvimshamsha)=0.5,
//   D27(Saptavimshamsha)=0.5, D30(Trimshamsha)=0.5, D40(Khavedamsha)=0.5,
//   D45(Akshavedamsha)=0.5, D60(Shashtiamsha)=0.5
//   Total = 20
const VARGA_WEIGHTS: Record<string, number> = {
  D1: 3.5, D2: 1.5, D3: 1.5, D4: 1.5,
  D7: 1.5, D9: 3, D10: 1.5, D12: 1.5,
  D16: 1, D20: 1, D24: 0.5, D27: 0.5,
  D30: 0.5, D40: 0.5, D45: 0.5, D60: 0.5,
};

// Dignity points: Exalted=20, Moolatrikona=18, Own=16, Friend=12, Neutral=8, Enemy=4, Debilitated=2
function dignityScore(planetId: number, sign: number): number {
  if (planetId >= 7) return 10; // Rahu/Ketu  –  neutral
  if (EXALTATION[planetId] === sign) return 20;
  if (DEBILITATION[planetId] === sign) return 2;
  if (MOOLATRIKONA[planetId] === sign) return 18;
  if ((OWN_SIGNS[planetId] || []).includes(sign)) return 16;
  const lord = SIGN_LORD[sign];
  if (FRIENDS[planetId]?.has(lord)) return 12; // friend's sign
  // Check explicit natural enemy table first.
  // "Neutral" = not a friend, not an enemy (the residual category).
  if (ENEMIES[planetId]?.has(lord)) return 4; // enemy's sign
  return 8; // neutral sign (residual  –  neither friend nor enemy)
}

export interface VimshopakaBala {
  planetId: number;
  planetName: string;
  total: number;      // 0-20 scale
  perVarga: { varga: string; sign: number; dignity: number; weight: number; contribution: number }[];
  category: 'Poorna' | 'Madhya' | 'Alpa' | 'Ati-Alpa';
}

export function calculateVimshopakaBala(
  planets: PlanetPosition[],
  d1Chart: { ascendantSign: number },
  divisionalCharts: Record<string, DivisionalChart>,
): VimshopakaBala[] {
  const PLANET_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const results: VimshopakaBala[] = [];

  for (const p of planets) {
    const pid = p.planet.id;
    const perVarga: VimshopakaBala['perVarga'] = [];
    let totalWeightedDignity = 0;
    let totalWeight = 0;

    // D1 (from natal)
    const d1Dignity = dignityScore(pid, p.sign);
    const d1Weight = VARGA_WEIGHTS['D1'] || 3.5;
    perVarga.push({ varga: 'D1', sign: p.sign, dignity: d1Dignity, weight: d1Weight, contribution: d1Dignity * d1Weight });
    totalWeightedDignity += d1Dignity * d1Weight;
    totalWeight += d1Weight;

    // All other vargas
    for (const [key, dc] of Object.entries(divisionalCharts)) {
      const weight = VARGA_WEIGHTS[key] || 0.5;
      // Find which sign this planet falls in for this varga
      let planetSign = 1;
      for (let h = 0; h < 12; h++) {
        if (dc.houses[h].includes(pid)) {
          planetSign = ((dc.ascendantSign - 1 + h) % 12) + 1;
          break;
        }
      }
      const dignity = dignityScore(pid, planetSign);
      perVarga.push({ varga: key, sign: planetSign, dignity, weight, contribution: dignity * weight });
      totalWeightedDignity += dignity * weight;
      totalWeight += weight;
    }

    const total = totalWeight > 0 ? Math.round((totalWeightedDignity / totalWeight) * 100) / 100 : 0;
    // BPHS Ch.16 tiers: Poorna (full, >=15), Madhya (medium, 10-15), Alpa (low, 5-10), Ati-Alpa (<5)
    const category: VimshopakaBala['category'] = total >= 15 ? 'Poorna' : total >= 10 ? 'Madhya' : total >= 5 ? 'Alpa' : 'Ati-Alpa';

    results.push({
      planetId: pid,
      planetName: PLANET_NAMES[pid] || `P${pid}`,
      total,
      perVarga,
      category,
    });
  }

  return results;
}
