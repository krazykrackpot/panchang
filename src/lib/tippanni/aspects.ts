/**
 * Graha Drishti (Planetary Aspects) System
 * Based on BPHS Ch.26, Phaladeepika Ch.5
 *
 * All planets aspect the 7th house from their position (full aspect).
 * Special aspects:
 *   Mars: additionally aspects 4th and 8th (full)
 *   Jupiter: additionally aspects 5th and 9th (full)
 *   Saturn: additionally aspects 3rd and 10th (full)
 */

import type { PlanetPosition } from '@/types/kundali';
import type { Locale , LocaleText} from '@/types/panchang';
import { PLANET_NAMES, triLocale } from './utils';

export interface AspectInfo {
  aspectingPlanetId: number;
  aspectingPlanetHouse: number;
  aspectedHouse: number;
  aspectType: 'full' | 'special';
  description: string;
}

/**
 * Get all houses aspected by a planet from its position
 * Returns 1-based house numbers that the planet aspects
 */
export function getPlanetaryAspects(planetId: number, planetHouse: number): number[] {
  const aspected: number[] = [];

  // All planets aspect 7th from their position
  aspected.push(((planetHouse - 1 + 6) % 12) + 1);

  // Special aspects
  if (planetId === 2) {
    // Mars: 4th and 8th
    aspected.push(((planetHouse - 1 + 3) % 12) + 1);
    aspected.push(((planetHouse - 1 + 7) % 12) + 1);
  } else if (planetId === 4) {
    // Jupiter: 5th and 9th
    aspected.push(((planetHouse - 1 + 4) % 12) + 1);
    aspected.push(((planetHouse - 1 + 8) % 12) + 1);
  } else if (planetId === 6) {
    // Saturn: 3rd and 10th
    aspected.push(((planetHouse - 1 + 2) % 12) + 1);
    aspected.push(((planetHouse - 1 + 9) % 12) + 1);
  }

  return aspected;
}

/**
 * Calculate all aspects in a chart
 * Returns which planets aspect which houses (with descriptions)
 */
export function calculateAllAspects(
  planets: PlanetPosition[],
  locale: Locale
): AspectInfo[] {
  const aspects: AspectInfo[] = [];

  for (const planet of planets) {
    const pid = planet.planet.id;
    const pHouse = planet.house;
    const aspectedHouses = getPlanetaryAspects(pid, pHouse);
    const pName = triLocale(PLANET_NAMES[pid] || PLANET_NAMES[0], locale);

    // 7th aspect is always index 0
    for (let i = 0; i < aspectedHouses.length; i++) {
      const aspectedH = aspectedHouses[i];
      const isSpecial = i > 0;
      aspects.push({
        aspectingPlanetId: pid,
        aspectingPlanetHouse: pHouse,
        aspectedHouse: aspectedH,
        aspectType: isSpecial ? 'special' : 'full',
        description: getAspectDescription(pid, pName, aspectedH, isSpecial, locale),
      });
    }
  }

  return aspects;
}

/**
 * Get a descriptive text for an aspect
 */
function getAspectDescription(
  planetId: number,
  planetName: string,
  aspectedHouse: number,
  isSpecial: boolean,
  locale: Locale
): string {
  const influence = getAspectInfluence(planetId);

  if (locale === 'hi') {
    return `${planetName} की दृष्टि ${aspectedHouse}वें भाव पर${isSpecial ? ' (विशेष दृष्टि)' : ''} — ${influence.hi}`;
  }

  return `${planetName} aspects the ${aspectedHouse}${ordinal(aspectedHouse)} house${isSpecial ? ' (special aspect)' : ''} — ${influence.en}`;
}

function ordinal(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

/**
 * Get the nature of a planet's aspectual influence
 */
function getAspectInfluence(planetId: number): LocaleText {
  const influences: Record<number, LocaleText> = {
    0: { en: 'brings authority and vitality', hi: 'अधिकार और जीवन शक्ति लाता है', sa: 'अधिकारं जीवनशक्तिं च आनयति' },
    1: { en: 'brings emotional sensitivity and nurturing', hi: 'भावनात्मक संवेदनशीलता और पोषण लाता है', sa: 'भावनात्मिकसंवेदनशीलतां पोषणं च आनयति' },
    2: { en: 'brings energy, courage, and assertiveness', hi: 'ऊर्जा, साहस और दृढ़ता लाता है', sa: 'ऊर्जां शौर्यं दृढतां च आनयति' },
    3: { en: 'brings intellectual stimulation and communication', hi: 'बौद्धिक उत्तेजना और संवाद लाता है', sa: 'बौद्धिकोत्तेजनां संवादं च आनयति' },
    4: { en: 'brings wisdom, expansion, and blessings', hi: 'ज्ञान, विस्तार और आशीर्वाद लाता है', sa: 'ज्ञानं विस्तारम् आशीर्वादं च आनयति' },
    5: { en: 'brings harmony, beauty, and material comfort', hi: 'सामंजस्य, सौन्दर्य और भौतिक सुख लाता है', sa: 'सामञ्जस्यं सौन्दर्यं भौतिकसुखं च आनयति' },
    6: { en: 'brings discipline, restriction, and delayed results', hi: 'अनुशासन, प्रतिबन्ध और विलम्बित परिणाम लाता है', sa: 'अनुशासनं प्रतिबन्धं विलम्बितफलं च आनयति' },
    7: { en: 'brings unconventional influence and worldly ambition', hi: 'अपरम्परागत प्रभाव और सांसारिक महत्वाकांक्षा लाता है', sa: 'अपरम्परागतप्रभावं सांसारिकमहत्त्वाकाङ्क्षां च आनयति' },
    8: { en: 'brings spiritual detachment and karmic resolution', hi: 'आध्यात्मिक वैराग्य और कार्मिक समाधान लाता है', sa: 'आध्यात्मिकवैराग्यं कार्मिकसमाधानं च आनयति' },
  };
  return influences[planetId] || influences[0];
}

/**
 * Get all planets aspecting a specific house
 */
export function getPlanetsAspectingHouse(
  planets: PlanetPosition[],
  targetHouse: number
): PlanetPosition[] {
  return planets.filter(planet => {
    const aspects = getPlanetaryAspects(planet.planet.id, planet.house);
    return aspects.includes(targetHouse);
  });
}

/**
 * Check if a specific planet aspects a specific house
 */
export function doesPlanetAspectHouse(
  planetId: number,
  planetHouse: number,
  targetHouse: number
): boolean {
  return getPlanetaryAspects(planetId, planetHouse).includes(targetHouse);
}
