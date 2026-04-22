/**
 * Vimshopaka Bala — Dignity-based strength across divisional charts
 * Reference: BPHS Ch.16
 *
 * Measures how well-placed a planet is across all Shodashavarga (16 divisional charts).
 * Maximum = 20 points per planet. Higher = stronger.
 */

import type { PlanetPosition, DivisionalChart } from '@/types/kundali';

const SIGN_LORD: Record<number, number> = { 1:2,2:5,3:3,4:1,5:0,6:3,7:5,8:2,9:4,10:6,11:6,12:4 };
const EXALTATION: Record<number, number> = { 0:1,1:2,2:10,3:6,4:4,5:12,6:7 };
const DEBILITATION: Record<number, number> = { 0:7,1:8,2:4,3:12,4:10,5:6,6:1 };
const OWN_SIGNS: Record<number, number[]> = { 0:[5],1:[4],2:[1,8],3:[3,6],4:[9,12],5:[2,7],6:[10,11] };
const MOOLATRIKONA: Record<number, number> = { 0:5,1:2,2:1,3:6,4:9,5:7,6:11 };

// Natural friends for each planet (classical Jyotish — BPHS Ch.3)
const FRIENDS: Record<number, Set<number>> = {
  0: new Set([1,2,4]),       // Sun: Moon, Mars, Jupiter
  1: new Set([0,3]),         // Moon: Sun, Mercury
  2: new Set([0,1,4]),       // Mars: Sun, Moon, Jupiter
  3: new Set([0,5]),         // Mercury: Sun, Venus
  4: new Set([0,1,2]),       // Jupiter: Sun, Moon, Mars
  5: new Set([3,6]),         // Venus: Mercury, Saturn
  6: new Set([3,5]),         // Saturn: Mercury, Venus
};

// Natural enemies for each planet (classical Jyotish — BPHS Ch.3)
// HISTORICAL BUG (now fixed): no ENEMIES table existed.  The dignityScore()
// function computed "neutral" as "neither planet considers the other a friend"
// and "enemy" as the else-case — which fired when the SIGN LORD considers the
// PLANET a friend (mutual asymmetry).  This is the opposite of the classical
// rule: a planet is an enemy of another if the OTHER planet lists it as an
// enemy.  Without an explicit enemy table, planets that should score 4 (enemy
// sign) were scoring 8 (neutral), inflating vimshopaka totals.
const ENEMIES: Record<number, Set<number>> = {
  0: new Set([5,6]),         // Sun: Venus, Saturn
  1: new Set([]),            // Moon: none (Moon has no natural enemies)
  2: new Set([3]),           // Mars: Mercury
  3: new Set([1]),           // Mercury: Moon
  4: new Set([3,5]),         // Jupiter: Mercury, Venus
  5: new Set([0,1]),         // Venus: Sun, Moon
  6: new Set([0,1,2]),       // Saturn: Sun, Moon, Mars
};

// Varga weights for Shodashavarga (16 charts) — BPHS Ch.16
// D1=3.5, D2=1, D3=1, D4=0.5, D5=0.5, D6=0.5, D7=0.5, D8=0.5,
// D9=3, D10=0.5, D12=0.5, D16=2, D20=0.5, D24=0.5, D27=0.5, D30=1, D40=0.5, D45=0.5, D60=4
const VARGA_WEIGHTS: Record<string, number> = {
  D1: 3.5, D2: 1, D3: 1, D4: 0.5, D5: 0.5, D6: 0.5, D7: 0.5, D8: 0.5,
  D9: 3, D10: 0.5, D12: 0.5, D16: 2, D20: 0.5, D24: 0.5, D27: 0.5,
  D30: 1, D40: 0.5, D45: 0.5, D60: 4,
};

// Dignity points: Exalted=20, Moolatrikona=18, Own=16, Friend=12, Neutral=8, Enemy=4, Debilitated=2
function dignityScore(planetId: number, sign: number): number {
  if (planetId >= 7) return 10; // Rahu/Ketu — neutral
  if (EXALTATION[planetId] === sign) return 20;
  if (DEBILITATION[planetId] === sign) return 2;
  if (MOOLATRIKONA[planetId] === sign) return 18;
  if ((OWN_SIGNS[planetId] || []).includes(sign)) return 16;
  const lord = SIGN_LORD[sign];
  if (FRIENDS[planetId]?.has(lord)) return 12; // friend's sign
  // Check explicit natural enemy table first.
  // "Neutral" = not a friend, not an enemy (the residual category).
  if (ENEMIES[planetId]?.has(lord)) return 4; // enemy's sign
  return 8; // neutral sign (residual — neither friend nor enemy)
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
