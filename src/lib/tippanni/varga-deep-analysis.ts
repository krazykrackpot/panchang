/**
 * Varga Deep Cross-Correlation Engine
 *
 * 15-factor analysis comparing D1 (Rasi) with any divisional chart (Dxx).
 * Each factor is an independently testable function.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs: 1-based (1–12)
 */

import type { KundaliData, DivisionalChart, PlanetPosition } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import type {
  CrossCorrelation,
  DignityShift,
  DignityLevel,
  PushkaraCheck,
  GandantaCheck,
  VargaVisesha,
  DispositorChain,
  DispositorNode,
  Parivartana,
  PromiseDeliveryScore,
  DeepVargaResult,
  VargaDomain,
  CHART_DOMAIN_MAP,
} from './varga-tippanni-types-v2';
import { checkPushkara, checkGandanta, classifyVargaVisesha } from './varga-classical-checks';
import { getVerdict } from './varga-promise-delivery';
import { calculateFunctionalNature } from '@/lib/kundali/functional-nature';

// Re-import CHART_DOMAIN_MAP as a value
import { CHART_DOMAIN_MAP as DOMAIN_MAP } from './varga-tippanni-types-v2';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

const EXALTATION: Record<number, number> = {
  0: 1, 1: 2, 2: 10, 3: 6, 4: 4, 5: 12, 6: 7,
};

const DEBILITATION: Record<number, number> = {
  0: 7, 1: 8, 2: 4, 3: 12, 4: 10, 5: 6, 6: 1,
};

const OWN_SIGNS: Record<number, number[]> = {
  0: [5], 1: [4], 2: [1, 8], 3: [3, 6], 4: [9, 12], 5: [2, 7], 6: [10, 11],
};

const MOOLATRIKONA: Record<number, number> = {
  0: 5, 1: 2, 2: 1, 3: 6, 4: 9, 5: 7, 6: 11,
};

const FRIENDS: Record<number, Set<number>> = {
  0: new Set([1, 2, 4]),
  1: new Set([0, 3]),
  2: new Set([0, 1, 4]),
  3: new Set([0, 5]),
  4: new Set([0, 1, 2]),
  5: new Set([3, 6]),
  6: new Set([3, 5]),
};

const ENEMIES: Record<number, Set<number>> = {
  0: new Set([5, 6]),
  1: new Set([]),
  2: new Set([3]),
  3: new Set([1]),
  4: new Set([3, 5]),
  5: new Set([0, 1]),
  6: new Set([0, 1, 2]),
};

const PLANET_NAMES: Record<number, LocaleText> = {
  0: { en: 'Sun', hi: 'सूर्य' },
  1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' },
  3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' },
  5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' },
  7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

const BENEFICS = new Set([1, 3, 4, 5]);
const MALEFICS = new Set([0, 2, 6, 7, 8]);

/** Domain → primary house numbers in the divisional chart */
const DOMAIN_KEY_HOUSES: Record<VargaDomain, number[]> = {
  marriage: [1, 7, 2],
  career: [1, 10, 7],
  children: [1, 5, 9],
  wealth: [1, 2, 11],
  spiritual: [1, 9, 12],
  health: [1, 6, 8],
  family: [1, 4, 2],
  education: [1, 4, 5],
};

/** Domain → Jaimini karaka keys relevant to this domain */
const DOMAIN_KARAKAS: Record<VargaDomain, string[]> = {
  marriage: ['DK', 'AK'],
  career: ['AmK', 'AK'],
  children: ['PK', 'AK'],
  wealth: ['AK', 'AmK'],
  spiritual: ['AK', 'MK'],
  health: ['AK'],
  family: ['MK', 'AK'],
  education: ['AK', 'GK'],
};

// Aspect patterns for planets (Vedic full aspects)
// Mars: 4,8; Jupiter: 5,9; Saturn: 3,10; All planets: 7th
const SPECIAL_ASPECTS: Record<number, number[]> = {
  2: [4, 8],   // Mars
  4: [5, 9],   // Jupiter
  6: [3, 10],  // Saturn
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the sign (1-12) for a planet placed in a house index of a DivisionalChart. */
export function getPlanetSignInChart(chart: DivisionalChart, houseIndex: number): number {
  return ((chart.ascendantSign - 1 + houseIndex) % 12) + 1;
}

/** Find which house index (0-based) a planet is in within a DivisionalChart. Returns -1 if not found. */
export function findPlanetHouseIndex(chart: DivisionalChart, planetId: number): number {
  for (let h = 0; h < chart.houses.length; h++) {
    if (chart.houses[h].includes(planetId)) return h;
  }
  return -1;
}

/** Get the sign a planet occupies in a DivisionalChart. Returns 0 if not found. */
export function getPlanetSign(chart: DivisionalChart, planetId: number): number {
  const hIdx = findPlanetHouseIndex(chart, planetId);
  if (hIdx < 0) return 0;
  return getPlanetSignInChart(chart, hIdx);
}

/** House number (1-based) for a planet in a chart. Returns 0 if not found. */
export function getPlanetHouse(chart: DivisionalChart, planetId: number): number {
  const hIdx = findPlanetHouseIndex(chart, planetId);
  return hIdx < 0 ? 0 : hIdx + 1;
}

/** Compute dignity of a planet in a given sign. */
export function getDignity(planetId: number, sign: number): DignityLevel {
  if (planetId >= 7) return 'neutral'; // Rahu/Ketu have no classical dignity
  if (sign === 0) return 'neutral';
  if (EXALTATION[planetId] === sign) return 'exalted';
  if (DEBILITATION[planetId] === sign) return 'debilitated';
  if (MOOLATRIKONA[planetId] === sign) return 'own'; // Moolatrikona counts as own for dignity comparison
  if ((OWN_SIGNS[planetId] || []).includes(sign)) return 'own';
  const lord = SIGN_LORD[sign];
  if (FRIENDS[planetId]?.has(lord)) return 'friend';
  if (ENEMIES[planetId]?.has(lord)) return 'enemy';
  return 'neutral';
}

/** Numeric ranking for dignity comparison. Higher = better. */
const DIGNITY_RANK: Record<DignityLevel, number> = {
  exalted: 6,
  own: 5,
  friend: 4,
  neutral: 3,
  enemy: 2,
  debilitated: 1,
};

function classifyShift(d1Dig: DignityLevel, dxxDig: DignityLevel): DignityShift['shift'] {
  const d1R = DIGNITY_RANK[d1Dig];
  const dxxR = DIGNITY_RANK[dxxDig];
  if (dxxR > d1R) return 'improved';
  if (dxxR < d1R) return 'declined';
  return 'same';
}

/** Get the sign of house H (1-based) from a given lagna sign. */
function signOfHouse(lagna: number, house: number): number {
  return ((lagna - 1 + house - 1) % 12) + 1;
}

/** Get house number (1-based) of a sign from a given lagna. */
function houseOfSign(lagna: number, sign: number): number {
  return ((sign - lagna + 12) % 12) + 1;
}

// ---------------------------------------------------------------------------
// Factor 1: D1↔Dxx Dignity Shifts
// ---------------------------------------------------------------------------

export function computeDignityShifts(
  kundali: KundaliData,
  dxxChart: DivisionalChart,
): DignityShift[] {
  const shifts: DignityShift[] = [];
  for (let pid = 0; pid <= 8; pid++) {
    const d1Planet = kundali.planets.find(p => p.planet.id === pid);
    const d1Sign = d1Planet ? d1Planet.sign : 0;
    const dxxSign = getPlanetSign(dxxChart, pid);

    const d1Dignity = getDignity(pid, d1Sign);
    const dxxDignity = getDignity(pid, dxxSign);
    const isVargottama = d1Sign !== 0 && dxxSign !== 0 && d1Sign === dxxSign;
    const shift = classifyShift(d1Dignity, dxxDignity);

    shifts.push({
      planetId: pid,
      planetName: PLANET_NAMES[pid],
      d1Sign,
      dxxSign,
      d1Dignity,
      dxxDignity,
      shift,
      isVargottama,
      narrative: {
        en: `${PLANET_NAMES[pid].en}: ${d1Dignity} in D1 → ${dxxDignity} in Dxx${isVargottama ? ' (Vargottama)' : ''} — ${shift}`,
        hi: `${PLANET_NAMES[pid].hi}: D1 में ${d1Dignity} → Dxx में ${dxxDignity}${isVargottama ? ' (वर्गोत्तम)' : ''} — ${shift}`,
      },
    });
  }
  return shifts;
}

// ---------------------------------------------------------------------------
// Factor 2: Functional Nature per Dxx Lagna
// ---------------------------------------------------------------------------

export function computeFunctionalNatureForDxx(dxxChart: DivisionalChart) {
  return calculateFunctionalNature(dxxChart.ascendantSign);
}

// ---------------------------------------------------------------------------
// Factor 3: Vargottama Detection
// ---------------------------------------------------------------------------

export function detectVargottama(
  kundali: KundaliData,
  dxxChart: DivisionalChart,
): number[] {
  const result: number[] = [];
  for (let pid = 0; pid <= 8; pid++) {
    const d1Planet = kundali.planets.find(p => p.planet.id === pid);
    const d1Sign = d1Planet ? d1Planet.sign : 0;
    const dxxSign = getPlanetSign(dxxChart, pid);
    if (d1Sign !== 0 && dxxSign !== 0 && d1Sign === dxxSign) {
      result.push(pid);
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Factor 4: Pushkara Navamsha/Bhaga
// ---------------------------------------------------------------------------

export function computePushkaraChecks(
  kundali: KundaliData,
  dxxChart: DivisionalChart,
): PushkaraCheck[] {
  // Use D1 longitudes mapped to Dxx signs for Pushkara checks.
  // The actual Pushkara check requires a sidereal longitude, so we use
  // the planet's natal longitude as a proxy (exact Dxx longitude would
  // require the full varga division computation which is chart-specific).
  return kundali.planets.map(p => checkPushkara(p.planet.id, p.longitude));
}

// ---------------------------------------------------------------------------
// Factor 5: Gandanta Detection
// ---------------------------------------------------------------------------

export function computeGandantaChecks(
  kundali: KundaliData,
): GandantaCheck[] {
  return kundali.planets.map(p => checkGandanta(p.planet.id, p.longitude));
}

// ---------------------------------------------------------------------------
// Factor 6: Key House Lordship Tracing
// ---------------------------------------------------------------------------

export function traceKeyHouseLords(
  dxxChart: DivisionalChart,
  domain: VargaDomain,
): CrossCorrelation['keyHouseLords'] {
  const keyHouses = DOMAIN_KEY_HOUSES[domain] || [1, 7];
  const results: CrossCorrelation['keyHouseLords'] = [];

  for (const house of keyHouses) {
    const sign = signOfHouse(dxxChart.ascendantSign, house);
    const lordId = SIGN_LORD[sign];
    const lordSign = getPlanetSign(dxxChart, lordId);
    const lordDignity = getDignity(lordId, lordSign);
    const lordHouse = getPlanetHouse(dxxChart, lordId);

    results.push({
      house,
      lordId,
      lordSign,
      lordDignity,
      narrative: {
        en: `${house}H lord ${PLANET_NAMES[lordId].en} in ${lordSign > 0 ? `sign ${lordSign}` : 'unknown'} (${lordDignity}), house ${lordHouse}`,
        hi: `${house}वें भाव का स्वामी ${PLANET_NAMES[lordId].hi}, राशि ${lordSign} (${lordDignity}), भाव ${lordHouse}`,
      },
    });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Factor 7: Jaimini Karaka Placement
// ---------------------------------------------------------------------------

export function computeJaiminiKarakas(
  kundali: KundaliData,
  dxxChart: DivisionalChart,
  domain: VargaDomain,
): CrossCorrelation['jaiminiKarakas'] {
  if (!kundali.jaimini?.charaKarakas) return [];

  const karakaKeys = DOMAIN_KARAKAS[domain] || ['AK'];
  const results: CrossCorrelation['jaiminiKarakas'] = [];

  for (const kKey of karakaKeys) {
    const ck = kundali.jaimini.charaKarakas.find(c => c.karaka === kKey);
    if (!ck) continue;

    const sign = getPlanetSign(dxxChart, ck.planet);
    const house = getPlanetHouse(dxxChart, ck.planet);

    results.push({
      karaka: kKey,
      planetId: ck.planet,
      sign,
      house,
      narrative: {
        en: `${kKey} (${PLANET_NAMES[ck.planet]?.en ?? 'Planet'}) in house ${house}, sign ${sign}`,
        hi: `${kKey} (${PLANET_NAMES[ck.planet]?.hi ?? 'ग्रह'}) भाव ${house}, राशि ${sign}`,
      },
    });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Factor 8: Argala on Key Houses
// ---------------------------------------------------------------------------

export function computeArgalaOnKeyHouses(
  kundali: KundaliData,
  dxxChart: DivisionalChart,
  domain: VargaDomain,
): CrossCorrelation['argalaOnKeyHouses'] {
  // Use pre-computed argala if available on kundali
  // Otherwise compute a simplified version from the Dxx chart
  const keyHouses = DOMAIN_KEY_HOUSES[domain] || [1, 7];
  const results: CrossCorrelation['argalaOnKeyHouses'] = [];

  // Simplified argala: planets in 2nd, 4th, 11th from house = supporting
  // Planets in 12th, 10th, 3rd from house = obstructing
  for (const house of keyHouses) {
    const supporting: number[] = [];
    const obstructing: number[] = [];

    const supportOffsets = [2, 4, 11]; // houses from target that create argala
    const obstructOffsets = [12, 10, 3]; // houses that create virodha argala

    for (const offset of supportOffsets) {
      const targetHouse = ((house - 1 + offset - 1) % 12); // 0-based house index
      const planetsInHouse = dxxChart.houses[targetHouse] || [];
      supporting.push(...planetsInHouse);
    }

    for (const offset of obstructOffsets) {
      const targetHouse = ((house - 1 + offset - 1) % 12);
      const planetsInHouse = dxxChart.houses[targetHouse] || [];
      obstructing.push(...planetsInHouse);
    }

    results.push({ house, supporting, obstructing });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Factor 9: Vimshopaka Per-Varga Dignity (Varga Visesha)
// ---------------------------------------------------------------------------

export function computeVargaVisesha(
  kundali: KundaliData,
  chartId: string,
): { planetId: number; classification: VargaVisesha }[] {
  const results: { planetId: number; classification: VargaVisesha }[] = [];

  if (!kundali.vimshopakaBala) {
    // Return 'none' for all planets if vimshopaka data unavailable
    for (let pid = 0; pid <= 8; pid++) {
      results.push({ planetId: pid, classification: 'none' });
    }
    return results;
  }

  for (const vb of kundali.vimshopakaBala) {
    // Collect dignities across all vargas for this planet
    const dignities: DignityLevel[] = vb.perVarga.map(pv => {
      const score = pv.dignity;
      if (score >= 20) return 'exalted' as DignityLevel;
      if (score >= 16) return 'own' as DignityLevel;
      if (score >= 12) return 'friend' as DignityLevel;
      if (score >= 8) return 'neutral' as DignityLevel;
      if (score >= 4) return 'enemy' as DignityLevel;
      return 'debilitated' as DignityLevel;
    });

    results.push({
      planetId: vb.planetId,
      classification: classifyVargaVisesha(dignities),
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Factor 10: SAV Bindu Overlay
// ---------------------------------------------------------------------------

export function computeSavOverlay(
  kundali: KundaliData,
  dxxChart: DivisionalChart,
): CrossCorrelation['savOverlay'] {
  if (!kundali.ashtakavarga?.savTable) return [];

  // Find all unique signs occupied by planets in the Dxx chart
  const occupiedSigns = new Set<number>();
  for (let h = 0; h < dxxChart.houses.length; h++) {
    if (dxxChart.houses[h].length > 0) {
      occupiedSigns.add(getPlanetSignInChart(dxxChart, h));
    }
  }

  const results: CrossCorrelation['savOverlay'] = [];
  for (const sign of occupiedSigns) {
    const bindus = kundali.ashtakavarga.savTable[sign - 1] ?? 0; // savTable is 0-indexed by sign-1
    let quality: 'strong' | 'average' | 'weak';
    if (bindus >= 30) quality = 'strong';
    else if (bindus >= 22) quality = 'average';
    else quality = 'weak';

    results.push({ sign, bindus, quality });
  }
  return results.sort((a, b) => a.sign - b.sign);
}

// ---------------------------------------------------------------------------
// Factor 11: Dasha Lord in Dxx
// ---------------------------------------------------------------------------

export function computeDashaLordPlacement(
  kundali: KundaliData,
  dxxChart: DivisionalChart,
): CrossCorrelation['dashaLordPlacement'] {
  if (!kundali.dashas || kundali.dashas.length === 0) return null;

  // Find active Mahadasha (level = 'maha')
  const now = new Date().toISOString().slice(0, 10);
  let activeMaha: typeof kundali.dashas[0] | undefined;

  for (const d of kundali.dashas) {
    if (d.level === 'maha' && d.startDate <= now && d.endDate >= now) {
      activeMaha = d;
      break;
    }
  }

  if (!activeMaha) return null;

  // Map planet name to ID
  const nameToId: Record<string, number> = {
    Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
    Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
  };
  const lordId = nameToId[activeMaha.planet] ?? -1;
  if (lordId < 0) return null;

  const sign = getPlanetSign(dxxChart, lordId);
  const house = getPlanetHouse(dxxChart, lordId);
  const dignity = getDignity(lordId, sign);

  return {
    lordId,
    sign,
    house,
    dignity,
    narrative: {
      en: `Mahadasha lord ${activeMaha.planet} placed in house ${house}, sign ${sign} (${dignity}) in this varga`,
      hi: `महादशा स्वामी ${activeMaha.planetName?.hi ?? activeMaha.planet} भाव ${house}, राशि ${sign} (${dignity})`,
    },
  };
}

// ---------------------------------------------------------------------------
// Factor 12: Yoga Detection in Dxx (simplified)
// ---------------------------------------------------------------------------

export function detectYogasInDxx(
  dxxChart: DivisionalChart,
): CrossCorrelation['yogasInChart'] {
  const yogas: CrossCorrelation['yogasInChart'] = [];
  const ascSign = dxxChart.ascendantSign;

  // Check for Gajakesari Yoga: Jupiter in kendra from Moon
  const moonHIdx = findPlanetHouseIndex(dxxChart, 1);
  const jupHIdx = findPlanetHouseIndex(dxxChart, 4);
  if (moonHIdx >= 0 && jupHIdx >= 0) {
    const offset = ((jupHIdx - moonHIdx + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(offset)) {
      yogas.push({
        name: 'Gajakesari',
        planets: [1, 4],
        significance: {
          en: 'Jupiter in kendra from Moon — fame, wisdom, prosperity',
          hi: 'चन्द्र से केन्द्र में गुरु — यश, ज्ञान, समृद्धि',
        },
      });
    }
  }

  // Check for Budhaditya Yoga: Sun and Mercury in same house
  const sunHIdx = findPlanetHouseIndex(dxxChart, 0);
  const mercHIdx = findPlanetHouseIndex(dxxChart, 3);
  if (sunHIdx >= 0 && mercHIdx >= 0 && sunHIdx === mercHIdx) {
    yogas.push({
      name: 'Budhaditya',
      planets: [0, 3],
      significance: {
        en: 'Sun-Mercury conjunction — intelligence, eloquence',
        hi: 'सूर्य-बुध युति — बुद्धि, वाक्पटुता',
      },
    });
  }

  // Check for Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in kendra in own/exalted sign)
  const mahapurushaPlanets = [2, 3, 4, 5, 6];
  const mahapurushaNames: Record<number, string> = {
    2: 'Ruchaka', 3: 'Bhadra', 4: 'Hamsa', 5: 'Malavya', 6: 'Sasha',
  };
  for (const pid of mahapurushaPlanets) {
    const hIdx = findPlanetHouseIndex(dxxChart, pid);
    if (hIdx < 0) continue;
    const house = hIdx + 1;
    if (![1, 4, 7, 10].includes(house)) continue;
    const sign = getPlanetSignInChart(dxxChart, hIdx);
    const dig = getDignity(pid, sign);
    if (dig === 'exalted' || dig === 'own') {
      yogas.push({
        name: mahapurushaNames[pid],
        planets: [pid],
        significance: {
          en: `${PLANET_NAMES[pid].en} in kendra in ${dig} sign — Mahapurusha yoga`,
          hi: `${PLANET_NAMES[pid].hi} केन्द्र में ${dig} राशि — महापुरुष योग`,
        },
      });
    }
  }

  return yogas;
}

// ---------------------------------------------------------------------------
// Factor 13: Aspect Analysis in Dxx
// ---------------------------------------------------------------------------

export function computeAspectsOnKeyHouses(
  dxxChart: DivisionalChart,
  domain: VargaDomain,
): CrossCorrelation['aspectsOnKeyHouses'] {
  const keyHouses = DOMAIN_KEY_HOUSES[domain] || [1, 7];
  const results: CrossCorrelation['aspectsOnKeyHouses'] = [];

  for (const house of keyHouses) {
    const aspectingPlanets: { id: number; type: 'benefic' | 'malefic' }[] = [];

    for (let pid = 0; pid <= 8; pid++) {
      const pHouse = getPlanetHouse(dxxChart, pid);
      if (pHouse === 0 || pHouse === house) continue; // skip missing or conjunction

      // Vedic "Nth from" counting is 1-based inclusive:
      // planet in house 1, target house 7 → "7th from" = ((7-1+12)%12) + 1 = 7
      const nthFrom = ((house - pHouse + 12) % 12) + 1;

      let aspects = false;
      // All planets have 7th aspect
      if (nthFrom === 7) aspects = true;
      // Special aspects: Mars 4th+8th, Jupiter 5th+9th, Saturn 3rd+10th
      const special = SPECIAL_ASPECTS[pid];
      if (special && special.includes(nthFrom)) aspects = true;

      if (aspects) {
        aspectingPlanets.push({
          id: pid,
          type: BENEFICS.has(pid) ? 'benefic' : 'malefic',
        });
      }
    }

    results.push({ house, aspectingPlanets });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Factor 14: Parivartana Detection
// ---------------------------------------------------------------------------

export function detectParivartana(
  dxxChart: DivisionalChart,
): Parivartana[] {
  const parivartanas: Parivartana[] = [];
  const checked = new Set<string>();

  // Only check real planets (0-6) since Rahu/Ketu don't own signs
  for (let pid1 = 0; pid1 <= 6; pid1++) {
    const sign1 = getPlanetSign(dxxChart, pid1);
    if (sign1 === 0) continue;
    const lord1 = SIGN_LORD[sign1]; // lord of the sign pid1 occupies

    // pid1 is in sign1, whose lord is lord1.
    // If lord1 is in a sign owned by pid1, that's a parivartana.
    const sign2 = getPlanetSign(dxxChart, lord1);
    if (sign2 === 0) continue;
    const lord2 = SIGN_LORD[sign2]; // lord of sign occupied by lord1

    if (lord2 === pid1 && lord1 !== pid1) {
      const key = [Math.min(pid1, lord1), Math.max(pid1, lord1)].join('-');
      if (checked.has(key)) continue;
      checked.add(key);

      parivartanas.push({
        planet1Id: pid1,
        planet2Id: lord1,
        sign1,
        sign2,
        significance: {
          en: `${PLANET_NAMES[pid1].en} and ${PLANET_NAMES[lord1].en} exchange signs (${sign1}↔${sign2})`,
          hi: `${PLANET_NAMES[pid1].hi} और ${PLANET_NAMES[lord1].hi} राशि विनिमय (${sign1}↔${sign2})`,
        },
      });
    }
  }
  return parivartanas;
}

// ---------------------------------------------------------------------------
// Factor 15: Dispositor Chain
// ---------------------------------------------------------------------------

export function buildDispositorChain(
  dxxChart: DivisionalChart,
  startPlanetId: number,
): DispositorChain {
  const chain: DispositorNode[] = [];
  const visited = new Set<number>();
  let current = startPlanetId;
  let isCircular = false;
  let finalDispositor: number | null = null;

  const MAX_DEPTH = 20; // safety limit

  while (chain.length < MAX_DEPTH) {
    const sign = getPlanetSign(dxxChart, current);
    chain.push({ planetId: current, sign });

    if (sign === 0) {
      // Planet not found in chart
      break;
    }

    const lord = SIGN_LORD[sign];

    // Self-disposed: planet is lord of its own sign
    if (lord === current) {
      finalDispositor = current;
      break;
    }

    // Rahu/Ketu don't own signs — treat their dispositor as the sign lord
    if (current >= 7) {
      // Continue to the sign lord
    }

    if (visited.has(lord)) {
      isCircular = true;
      break;
    }

    visited.add(current);
    current = lord;
  }

  return {
    chain,
    finalDispositor,
    isCircular,
    narrative: {
      en: finalDispositor !== null
        ? `Dispositor chain ends at ${PLANET_NAMES[finalDispositor]?.en ?? 'Planet'} (self-disposed)`
        : isCircular
          ? 'Dispositor chain forms a circular loop — no single final dispositor'
          : 'Dispositor chain incomplete',
      hi: finalDispositor !== null
        ? `अधिपति श्रृंखला ${PLANET_NAMES[finalDispositor]?.hi ?? 'ग्रह'} पर समाप्त (स्व-राशि)`
        : isCircular
          ? 'अधिपति श्रृंखला वृत्ताकार — कोई एकल अन्तिम अधिपति नहीं'
          : 'अधिपति श्रृंखला अपूर्ण',
    },
  };
}

// ---------------------------------------------------------------------------
// Promise/Delivery scoring helpers
// ---------------------------------------------------------------------------

function computePromiseDeliveryForChart(
  kundali: KundaliData,
  dxxChart: DivisionalChart,
  domain: VargaDomain,
  vargottamaCount: number,
  pushkaraCount: number,
  gandantaCount: number,
  yogaCount: number,
): PromiseDeliveryScore {
  const keyHouses = DOMAIN_KEY_HOUSES[domain] || [1, 7];
  const primaryHouse = keyHouses[0] === 1 && keyHouses.length > 1 ? keyHouses[1] : keyHouses[0];

  // D1 promise — use natal data
  const d1LagnaSign = kundali.ascendant.sign;
  const d1HouseSign = signOfHouse(d1LagnaSign, primaryHouse);
  const d1HouseLord = SIGN_LORD[d1HouseSign];
  const d1LordPlanet = kundali.planets.find(p => p.planet.id === d1HouseLord);
  const d1LordHouse = d1LordPlanet ? d1LordPlanet.house : 0;

  const d1BeneficOcc = kundali.planets.filter(p =>
    p.house === primaryHouse && BENEFICS.has(p.planet.id)
  ).length;
  const d1MaleficOcc = kundali.planets.filter(p =>
    p.house === primaryHouse && MALEFICS.has(p.planet.id)
  ).length;

  const d1LordDignity = d1LordPlanet ? getDignity(d1LordPlanet.planet.id, d1LordPlanet.sign) : 'neutral' as DignityLevel;

  const d1Promise = 50
    + d1BeneficOcc * 15
    - d1MaleficOcc * 10
    + ([1, 4, 7, 10].includes(d1LordHouse) ? 20 : 0)
    + ([5, 9].includes(d1LordHouse) ? 15 : 0)
    - ([6, 8, 12].includes(d1LordHouse) ? 15 : 0)
    + (DIGNITY_RANK[d1LordDignity] >= 5 ? 15 : DIGNITY_RANK[d1LordDignity] <= 2 ? -10 : 0);

  // Dxx delivery — use divisional chart data
  const dxxHouseSign = signOfHouse(dxxChart.ascendantSign, primaryHouse);
  const dxxHouseLord = SIGN_LORD[dxxHouseSign];
  const dxxLordHouse = getPlanetHouse(dxxChart, dxxHouseLord);
  const dxxLordSign = getPlanetSign(dxxChart, dxxHouseLord);
  const dxxLordDignity = getDignity(dxxHouseLord, dxxLordSign);

  const dxxHouseIndex = primaryHouse - 1;
  const dxxPlanetsInHouse = dxxChart.houses[dxxHouseIndex] || [];
  const dxxBeneficOcc = dxxPlanetsInHouse.filter(pid => BENEFICS.has(pid)).length;
  const dxxMaleficOcc = dxxPlanetsInHouse.filter(pid => MALEFICS.has(pid)).length;

  const dxxDelivery = 50
    + dxxBeneficOcc * 15
    - dxxMaleficOcc * 10
    + ([1, 4, 7, 10].includes(dxxLordHouse) ? 20 : 0)
    + ([5, 9].includes(dxxLordHouse) ? 15 : 0)
    - ([6, 8, 12].includes(dxxLordHouse) ? 15 : 0)
    + (DIGNITY_RANK[dxxLordDignity] >= 5 ? 15 : DIGNITY_RANK[dxxLordDignity] <= 2 ? -10 : 0)
    + yogaCount * 15
    + vargottamaCount * 10
    + pushkaraCount * 10
    - gandantaCount * 15;

  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return getVerdict(clamp(d1Promise), clamp(dxxDelivery));
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function buildDeepVargaAnalysis(
  kundali: KundaliData,
  chartId: string,
): DeepVargaResult | null {
  // Get the divisional chart
  const dxxChart = kundali.divisionalCharts?.[chartId];
  if (!dxxChart) return null;

  const domains = DOMAIN_MAP[chartId] || ['spiritual'];
  const domain = domains[0] as VargaDomain;

  // Factor 1: Dignity Shifts
  const dignityShifts = computeDignityShifts(kundali, dxxChart);

  // Factor 3: Vargottama
  const vargottamaPlanets = detectVargottama(kundali, dxxChart);

  // Factor 4: Pushkara
  const pushkaraChecks = computePushkaraChecks(kundali, dxxChart);

  // Factor 5: Gandanta
  const gandantaChecks = computeGandantaChecks(kundali);

  // Factor 9: Varga Visesha
  const vargaVisesha = computeVargaVisesha(kundali, chartId);

  // Factor 6: Key House Lords
  const keyHouseLords = traceKeyHouseLords(dxxChart, domain);

  // Factor 7: Jaimini Karakas
  const jaiminiKarakas = computeJaiminiKarakas(kundali, dxxChart, domain);

  // Factor 8: Argala
  const argalaOnKeyHouses = computeArgalaOnKeyHouses(kundali, dxxChart, domain);

  // Factor 10: SAV Overlay
  const savOverlay = computeSavOverlay(kundali, dxxChart);

  // Factor 11: Dasha Lord
  const dashaLordPlacement = computeDashaLordPlacement(kundali, dxxChart);

  // Factor 12: Yogas
  const yogasInChart = detectYogasInDxx(dxxChart);

  // Factor 13: Aspects
  const aspectsOnKeyHouses = computeAspectsOnKeyHouses(dxxChart, domain);

  // Factor 14: Parivartana
  const parivartanas = detectParivartana(dxxChart);

  // Factor 15: Dispositor Chain (start from lagna lord)
  const lagnaLord = SIGN_LORD[dxxChart.ascendantSign];
  const dispositorChain = buildDispositorChain(dxxChart, lagnaLord);

  const crossCorrelation: CrossCorrelation = {
    dignityShifts,
    vargottamaPlanets,
    pushkaraChecks,
    gandantaChecks,
    vargaVisesha,
    keyHouseLords,
    jaiminiKarakas,
    argalaOnKeyHouses,
    savOverlay,
    dashaLordPlacement,
    yogasInChart,
    aspectsOnKeyHouses,
    parivartanas,
    dispositorChain,
  };

  // Promise/Delivery
  const pushkaraCount = pushkaraChecks.filter(p => p.isPushkaraNavamsha || p.isPushkaraBhaga).length;
  const gandantaCount = gandantaChecks.filter(g => g.isGandanta).length;
  const promiseDelivery = computePromiseDeliveryForChart(
    kundali,
    dxxChart,
    domain,
    vargottamaPlanets.length,
    pushkaraCount,
    gandantaCount,
    yogasInChart.length,
  );

  return {
    chartId,
    domain,
    crossCorrelation,
    promiseDelivery,
    narrative: {
      en: 'Deep varga analysis computed.',
      hi: 'गहन वर्ग विश्लेषण गणित।',
    },
  };
}
