/**
 * Argala — Planetary Intervention System (Jaimini)
 * Determines which planets actively support or obstruct each house.
 * Reference: BPHS Ch.31, Jaimini Sutras
 */

import type { PlanetPosition } from '@/types/kundali';

type Tri = { en: string; hi: string; sa: string };

export interface ArgalaResult {
  house: number;
  sign: number;
  argalas: ArgalaEntry[];      // Planets creating Argala (support)
  virodha: ArgalaEntry[];      // Planets creating Virodha Argala (counter/obstruction)
  netEffect: 'supported' | 'obstructed' | 'neutral';
}

export interface ArgalaEntry {
  planetId: number;
  planetName: Tri;
  fromHouse: number;           // Which house the planet is in (relative to target)
  type: 'primary' | 'secondary' | 'special';
  nature: 'benefic' | 'malefic';
  strength: 'strong' | 'moderate' | 'weak';
}

const PLANET_NAMES: Record<number, Tri> = {
  0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
  1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
  2: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' },
  3: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
  4: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' },
  5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
  6: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
  7: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' },
  8: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
};

const BENEFICS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus

/**
 * Calculate Argala for all 12 houses.
 *
 * Rules (BPHS Ch.31):
 * - Planets in 2nd, 4th, 11th from a sign CREATE Argala (intervention)
 * - Planets in 12th, 10th, 3rd respectively COUNTER (Virodha) that Argala
 * - 5th house creates secondary Argala; 9th house counters it
 * - Malefic planets in 3rd also create Argala (special)
 * - Argala is neutralized if the Virodha house has MORE planets than the Argala house
 *   OR if the Virodha planets are stronger
 */
export function calculateArgala(planets: PlanetPosition[], ascSign: number): ArgalaResult[] {
  const results: ArgalaResult[] = [];

  // Map planets to houses
  const housePlanets: Record<number, PlanetPosition[]> = {};
  for (let h = 1; h <= 12; h++) housePlanets[h] = [];
  for (const p of planets) {
    if (p.house >= 1 && p.house <= 12) {
      housePlanets[p.house].push(p);
    }
  }

  // Argala pairs: [argala_offset, virodha_offset]
  // BPHS Ch.31 + Jaimini Sutras + Sanjay Rath commentary
  const ARGALA_PAIRS: [number, number, 'primary' | 'secondary'][] = [
    [2, 12, 'primary'],   // 2nd creates, 12th counters
    [4, 10, 'primary'],   // 4th creates, 10th counters
    [11, 3, 'primary'],   // 11th creates, 3rd counters
    [5, 9, 'secondary'],  // 5th creates, 9th counters
    [8, 6, 'secondary'],  // 8th creates, 6th counters (Sanjay Rath / Jaimini commentaries)
  ];

  // Find Ketu's house for reversal rule
  const ketuPlanet = planets.find(p => p.planet.id === 8);
  const ketuHouse = ketuPlanet?.house || 0;

  for (let targetHouse = 1; targetHouse <= 12; targetHouse++) {
    const targetSign = ((ascSign - 1 + targetHouse - 1) % 12) + 1;
    const argalas: ArgalaEntry[] = [];
    const virodha: ArgalaEntry[] = [];

    // Ketu reversal: for the sign Ketu occupies, Argala is reckoned in reverse
    // 10th, 12th, 3rd become Argala; 4th, 2nd, 11th become Virodha
    const isKetuReversed = targetHouse === ketuHouse;

    for (const [argOffset, virOffset, type] of ARGALA_PAIRS) {
      // Apply Ketu reversal: swap argala and virodha offsets
      const effectiveArgOffset = isKetuReversed ? virOffset : argOffset;
      const effectiveVirOffset = isKetuReversed ? argOffset : virOffset;

      const argHouse = ((targetHouse - 1 + effectiveArgOffset - 1) % 12) + 1;
      const virHouse = ((targetHouse - 1 + effectiveVirOffset - 1) % 12) + 1;

      const argPlanets = housePlanets[argHouse];
      const virPlanets = housePlanets[virHouse];

      // Cancellation rule (Jaimini: "Na nyuna vibalascha"):
      // Argala cancelled ONLY when Virodha house has STRICTLY more planets
      // Equal count = Argala prevails (borderline, but not cancelled)
      const argalaCancelled = virPlanets.length > argPlanets.length;

      // Argala created by planets in argala house
      for (const p of argPlanets) {
        const isBenefic = BENEFICS.has(p.planet.id);
        argalas.push({
          planetId: p.planet.id,
          planetName: PLANET_NAMES[p.planet.id] || PLANET_NAMES[0],
          fromHouse: effectiveArgOffset,
          type,
          nature: isBenefic ? 'benefic' : 'malefic',
          strength: argalaCancelled ? 'weak' : 'strong',
        });
      }

      // Virodha (counter) by planets in virodha house
      for (const p of virPlanets) {
        const isBenefic = BENEFICS.has(p.planet.id);
        virodha.push({
          planetId: p.planet.id,
          planetName: PLANET_NAMES[p.planet.id] || PLANET_NAMES[0],
          fromHouse: effectiveVirOffset,
          type,
          nature: isBenefic ? 'benefic' : 'malefic',
          strength: argalaCancelled ? 'strong' : 'weak',
        });
      }
    }

    // Special: 3+ malefics in 3rd from target create UNOBSTRUCTABLE Argala
    // (Jaimini Sutra: Nirabhasargala — requires more than 2 malefics)
    const thirdHouse = ((targetHouse - 1 + 2) % 12) + 1;
    const thirdMalefics = housePlanets[thirdHouse].filter(p => !BENEFICS.has(p.planet.id));
    if (thirdMalefics.length >= 3) {
      for (const p of thirdMalefics) {
        argalas.push({
          planetId: p.planet.id,
          planetName: PLANET_NAMES[p.planet.id] || PLANET_NAMES[0],
          fromHouse: 3,
          type: 'special',
          nature: 'malefic',
          strength: 'strong', // Unobstructable — always strong
        });
      }
    }

    // Determine net effect
    const beneficArgalas = argalas.filter(a => a.nature === 'benefic' && a.strength !== 'weak').length;
    const maleficArgalas = argalas.filter(a => a.nature === 'malefic' && a.strength !== 'weak').length;
    const strongVirodha = virodha.filter(v => v.strength === 'strong').length;

    let netEffect: 'supported' | 'obstructed' | 'neutral' = 'neutral';
    if (beneficArgalas > strongVirodha && beneficArgalas > maleficArgalas) netEffect = 'supported';
    else if (maleficArgalas > beneficArgalas || strongVirodha > argalas.length) netEffect = 'obstructed';

    results.push({ house: targetHouse, sign: targetSign, argalas, virodha, netEffect });
  }

  return results;
}
