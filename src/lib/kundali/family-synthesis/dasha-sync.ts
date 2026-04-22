/**
 * Dasha Synchronicity -- are both charts' dasha periods activating
 * relationship-relevant houses simultaneously?
 *
 * Marriage context: checks if current dashas activate 7th, 1st, 2nd houses.
 * Children context: parent checks 5th, 9th; child checks 1st, 4th, 9th.
 *
 * Sign lordship: {1:Mars(2), 2:Venus(5), 3:Mercury(3), 4:Moon(1), 5:Sun(0),
 *   6:Mercury(3), 7:Venus(5), 8:Mars(2), 9:Jupiter(4), 10:Saturn(6),
 *   11:Saturn(6), 12:Jupiter(4)}
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';
import type { DashaSyncAnalysis } from './types';

// Planet name -> id mapping
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

// Sign lordship: sign (1-12) -> planet id
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

type Context = 'marriage' | 'children';

/** Helper: extract planet id from a PlanetPosition-like object. */
function getPid(p: Record<string, unknown>): number {
  if (typeof p.id === 'number') return p.id;
  if (p.planet && typeof (p.planet as Record<string, unknown>).id === 'number') {
    return (p.planet as Record<string, unknown>).id as number;
  }
  return -1;
}

/** Find the currently active Mahadasha. DashaEntry.level can be 'maha'/0. */
function getCurrentDasha(dashas: DashaEntry[]): DashaEntry | null {
  const now = Date.now();
  // Handle both string levels ('maha') and numeric (0) from test fixtures
  const mahadashas = dashas.filter(d => {
    const level = d.level as unknown;
    return level === 'maha' || level === 0;
  });
  return mahadashas.find(d => {
    const start = new Date(d.startDate).getTime();
    const end = new Date(d.endDate).getTime();
    return now >= start && now <= end;
  }) ?? mahadashas[0] ?? null;
}

/** Find the currently active Antardasha (level 'antar'/1). */
function getCurrentAntardasha(dashas: DashaEntry[]): DashaEntry | null {
  const now = Date.now();
  const antardashas = dashas.filter(d => {
    const level = d.level as unknown;
    return level === 'antar' || level === 1;
  });
  return antardashas.find(d => {
    const start = new Date(d.startDate).getTime();
    const end = new Date(d.endDate).getTime();
    return now >= start && now <= end;
  }) ?? null;
}

/** Get houses activated by a dasha lord (house it lords + house it occupies). */
function getActivatedHouses(kundali: KundaliData, planetName: string): number[] {
  const pid = PLANET_NAME_TO_ID[planetName];
  if (pid === undefined) return [];

  const houses: number[] = [];
  const ascSign = kundali.ascendant.sign;

  // House the planet occupies (whole sign)
  const planets = kundali.planets as unknown as Array<Record<string, unknown>>;
  const planet = planets.find(p => getPid(p) === pid);
  if (planet) {
    const pSign = planet.sign as number;
    const occupiedHouse = ((pSign - ascSign + 12) % 12) + 1;
    houses.push(occupiedHouse);
  }

  // Houses the planet lords (by sign lordship)
  for (let h = 1; h <= 12; h++) {
    const houseSign = ((ascSign - 1 + h - 1) % 12) + 1;
    if (SIGN_LORD[houseSign] === pid) {
      houses.push(h);
    }
  }

  return [...new Set(houses)];
}

/** Check if any of the activated houses match relationship-relevant houses. */
function hasRelationshipActivation(activatedHouses: number[], context: Context, isSecondChart: boolean): string[] {
  const relevantHouses = context === 'marriage'
    ? [7, 1, 2]
    : isSecondChart
      ? [1, 4, 9] // child's developmental houses
      : [5, 9];   // parent's children/blessing houses

  const matches: string[] = [];
  for (const h of activatedHouses) {
    if (relevantHouses.includes(h)) {
      matches.push(`${h}th`);
    }
  }
  return matches;
}

/**
 * Compute dasha synchronicity between two charts.
 */
export function computeDashaSynchronicity(
  chartA: KundaliData,
  chartB: KundaliData,
  context: Context,
): DashaSyncAnalysis {
  const dashaA = getCurrentDasha(chartA.dashas);
  const dashaB = getCurrentDasha(chartB.dashas);
  const antarA = getCurrentAntardasha(chartA.dashas);
  const antarB = getCurrentAntardasha(chartB.dashas);

  const yourDashaLabel = dashaA
    ? `${dashaA.planet}${antarA ? `-${antarA.planet}` : ''}`
    : 'Unknown';
  const theirDashaLabel = dashaB
    ? `${dashaB.planet}${antarB ? `-${antarB.planet}` : ''}`
    : 'Unknown';

  // Check activation
  const yourActivation: string[] = [];
  const theirActivation: string[] = [];

  if (dashaA) {
    yourActivation.push(...hasRelationshipActivation(
      getActivatedHouses(chartA, dashaA.planet), context, false,
    ));
    if (antarA) {
      yourActivation.push(...hasRelationshipActivation(
        getActivatedHouses(chartA, antarA.planet), context, false,
      ));
    }
  }

  if (dashaB) {
    theirActivation.push(...hasRelationshipActivation(
      getActivatedHouses(chartB, dashaB.planet), context, true,
    ));
    if (antarB) {
      theirActivation.push(...hasRelationshipActivation(
        getActivatedHouses(chartB, antarB.planet), context, true,
      ));
    }
  }

  const uniqueYours = [...new Set(yourActivation)];
  const uniqueTheirs = [...new Set(theirActivation)];
  const inSync = uniqueYours.length > 0 && uniqueTheirs.length > 0;

  // Narrative
  const contextLabel = context === 'marriage' ? 'relationship' : 'parenting';
  const contextLabelHi = context === 'marriage' ? 'वैवाहिक' : 'पालन-पोषण';

  let en: string;
  let hi: string;

  if (inSync) {
    en = `Dasha periods are synchronized for ${contextLabel}. Your ${yourDashaLabel} period activates ${uniqueYours.join(', ')} houses, while their ${theirDashaLabel} period activates ${uniqueTheirs.join(', ')} houses. Both charts are in a phase of ${contextLabel} activation.`;
    hi = `${contextLabelHi} के लिए दशा काल समन्वित हैं। आपकी ${yourDashaLabel} दशा ${uniqueYours.join(', ')} भावों को सक्रिय कर रही है, जबकि उनकी ${theirDashaLabel} दशा ${uniqueTheirs.join(', ')} भावों को सक्रिय कर रही है।`;
  } else if (uniqueYours.length > 0) {
    en = `Your ${yourDashaLabel} dasha activates ${contextLabel} houses (${uniqueYours.join(', ')}), but their ${theirDashaLabel} dasha is focused elsewhere. You may feel more invested in the ${contextLabel} than they do right now.`;
    hi = `आपकी ${yourDashaLabel} दशा ${contextLabelHi} भावों (${uniqueYours.join(', ')}) को सक्रिय कर रही है, लेकिन उनकी ${theirDashaLabel} दशा कहीं और केंद्रित है।`;
  } else if (uniqueTheirs.length > 0) {
    en = `Their ${theirDashaLabel} dasha activates ${contextLabel} houses (${uniqueTheirs.join(', ')}), while your ${yourDashaLabel} dasha is focused elsewhere. They may need more from the ${contextLabel} right now.`;
    hi = `उनकी ${theirDashaLabel} दशा ${contextLabelHi} भावों (${uniqueTheirs.join(', ')}) को सक्रिय कर रही है, जबकि आपकी ${yourDashaLabel} दशा कहीं और केंद्रित है।`;
  } else {
    en = `Neither dasha period is directly activating ${contextLabel} houses. This is a neutral period -- the ${contextLabel} dynamic runs on its established rhythm.`;
    hi = `कोई भी दशा काल सीधे ${contextLabelHi} भावों को सक्रिय नहीं कर रहा है। यह एक तटस्थ अवधि है।`;
  }

  return {
    inSync,
    yourDasha: yourDashaLabel,
    theirDasha: theirDashaLabel,
    yourActivation: uniqueYours,
    theirActivation: uniqueTheirs,
    narrative: { en, hi },
  };
}
