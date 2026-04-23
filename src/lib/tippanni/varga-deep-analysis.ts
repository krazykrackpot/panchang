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
// Narrative builder — synthesize human-readable insight from analysis factors
// ---------------------------------------------------------------------------

function buildNarrative(
  chartId: string,
  domain: VargaDomain,
  cross: CrossCorrelation,
  pd: PromiseDeliveryScore,
  vargottamaPlanets: number[],
  pushkaraCount: number,
  gandantaCount: number,
  yogas: { name: string }[],
): LocaleText {
  const parts: string[] = [];
  const partsHi: string[] = [];
  const partsTa: string[] = [];
  const partsBn: string[] = [];

  // Human-friendly domain labels
  const DOMAIN_LABEL: Record<string, { en: string; hi: string; ta: string; bn: string }> = {
    marriage: { en: 'your marriage and partnerships', hi: 'आपके विवाह और साझेदारी', ta: 'உங்கள் திருமணம் மற்றும் கூட்டாண்மை', bn: 'আপনার বিবাহ এবং অংশীদারিত্ব' },
    career: { en: 'your career and professional life', hi: 'आपके करियर और व्यावसायिक जीवन', ta: 'உங்கள் தொழில் மற்றும் தொழில்முறை வாழ்க்கை', bn: 'আপনার কর্মজীবন এবং পেশাদার জীবন' },
    children: { en: 'children and creative fulfillment', hi: 'संतान और रचनात्मक पूर्ति', ta: 'குழந்தைகள் மற்றும் படைப்பாற்றல் நிறைவு', bn: 'সন্তান এবং সৃজনশীল পরিপূর্ণতা' },
    wealth: { en: 'your financial prospects', hi: 'आपकी आर्थिक संभावनाएं', ta: 'உங்கள் நிதி வாய்ப்புகள்', bn: 'আপনার আর্থিক সম্ভাবনা' },
    spiritual: { en: 'your spiritual growth', hi: 'आपकी आध्यात्मिक प्रगति', ta: 'உங்கள் ஆன்மீக வளர்ச்சி', bn: 'আপনার আধ্যাত্মিক বিকাশ' },
    health: { en: 'your health and vitality', hi: 'आपका स्वास्थ्य और जीवन शक्ति', ta: 'உங்கள் ஆரோக்கியம் மற்றும் உயிர்ச்சக்தி', bn: 'আপনার স্বাস্থ্য এবং জীবনীশক্তি' },
    family: { en: 'family life and home environment', hi: 'पारिवारिक जीवन और गृह वातावरण', ta: 'குடும்ப வாழ்க்கை மற்றும் இல்ல சூழல்', bn: 'পারিবারিক জীবন এবং গৃহ পরিবেশ' },
    education: { en: 'education and learning', hi: 'शिक्षा और विद्या', ta: 'கல்வி மற்றும் கற்றல்', bn: 'শিক্ষা এবং বিদ্যা' },
  };
  const dl = DOMAIN_LABEL[domain] || { en: domain, hi: domain, ta: domain, bn: domain };

  // Planet names for plain-language references
  const PNAME: Record<number, { en: string; hi: string; ta: string; bn: string; role: string; roleTa: string; roleBn: string }> = {
    0: { en: 'Sun', hi: 'सूर्य', ta: 'சூரியன்', bn: 'সূর্য', role: 'authority and confidence', roleTa: 'அதிகாரம் மற்றும் தன்னம்பிக்கை', roleBn: 'কর্তৃত্ব এবং আত্মবিশ্বাস' },
    1: { en: 'Moon', hi: 'चन्द्र', ta: 'சந்திரன்', bn: 'চন্দ্র', role: 'emotions and intuition', roleTa: 'உணர்ச்சிகள் மற்றும் உள்ளுணர்வு', roleBn: 'আবেগ এবং অন্তর্জ্ঞান' },
    2: { en: 'Mars', hi: 'मंगल', ta: 'செவ்வாய்', bn: 'মঙ্গল', role: 'drive and courage', roleTa: 'உந்துதல் மற்றும் தைரியம்', roleBn: 'উদ্যম এবং সাহস' },
    3: { en: 'Mercury', hi: 'बुध', ta: 'புதன்', bn: 'বুধ', role: 'communication and intellect', roleTa: 'தொடர்பு மற்றும் அறிவு', roleBn: 'যোগাযোগ এবং বুদ্ধিমত্তা' },
    4: { en: 'Jupiter', hi: 'गुरु', ta: 'குரு', bn: 'গুরু', role: 'wisdom and good fortune', roleTa: 'ஞானம் மற்றும் நல்ல அதிர்ஷ்டம்', roleBn: 'জ্ঞান এবং সৌভাগ্য' },
    5: { en: 'Venus', hi: 'शुक्र', ta: 'சுக்கிரன்', bn: 'শুক্র', role: 'love, comfort and beauty', roleTa: 'அன்பு, ஆறுதல் மற்றும் அழகு', roleBn: 'প্রেম, আরাম এবং সৌন্দর্য' },
    6: { en: 'Saturn', hi: 'शनि', ta: 'சனி', bn: 'শনি', role: 'discipline and endurance', roleTa: 'ஒழுக்கம் மற்றும் சகிப்புத்தன்மை', roleBn: 'শৃঙ্খলা এবং সহনশীলতা' },
    7: { en: 'Rahu', hi: 'राहु', ta: 'ராகு', bn: 'রাহু', role: 'ambition and unconventional growth', roleTa: 'லட்சியம் மற்றும் மரபுக்கு மாறான வளர்ச்சி', roleBn: 'উচ্চাকাঙ্ক্ষা এবং অপ্রচলিত বৃদ্ধি' },
    8: { en: 'Ketu', hi: 'केतु', ta: 'கேது', bn: 'কেতু', role: 'detachment and spiritual insight', roleTa: 'பற்றின்மை மற்றும் ஆன்மீக அறிவு', roleBn: 'বিচ্ছিন্নতা এবং আধ্যাত্মিক অন্তর্দৃষ্টি' },
  };

  // 1. Big picture — what does this mean for the user?
  if (pd.d1Promise >= 70 && pd.dxxDelivery >= 70) {
    parts.push(`Your chart shows strong natural talent for ${dl.en}, and the deeper analysis confirms this will translate into real results. This is one of your life's genuine strengths — lean into it.`);
    partsHi.push(`आपकी कुण्डली ${dl.hi} के लिए प्रबल प्राकृतिक प्रतिभा दर्शाती है, और गहन विश्लेषण पुष्टि करता है कि यह वास्तविक परिणामों में बदलेगा। यह आपके जीवन की एक वास्तविक शक्ति है।`);
    partsTa.push(`உங்கள் ஜாதகம் ${dl.ta} க்கு வலுவான இயற்கை திறமையைக் காட்டுகிறது, மேலும் ஆழமான பகுப்பாய்வு இது உண்மையான முடிவுகளில் மாறும் என்பதை உறுதிப்படுத்துகிறது. இது உங்கள் வாழ்க்கையின் உண்மையான பலம்.`);
    partsBn.push(`আপনার জাতক ${dl.bn} জন্য শক্তিশালী প্রাকৃতিক প্রতিভা দেখায়, এবং গভীর বিশ্লেষণ নিশ্চিত করে যে এটি বাস্তব ফলাফলে রূপান্তরিত হবে। এটি আপনার জীবনের প্রকৃত শক্তি।`);
  } else if (pd.d1Promise >= 70) {
    parts.push(`You have strong potential for ${dl.en}, but turning that potential into results will require patience and the right timing. Don't be discouraged by slow progress — the foundation is solid, and the right planetary period will accelerate things.`);
    partsHi.push(`${dl.hi} के लिए आपमें प्रबल क्षमता है, किन्तु इसे फल में बदलने के लिए धैर्य और सही समय चाहिए। धीमी प्रगति से निराश न हों — नींव मज़बूत है।`);
    partsTa.push(`${dl.ta} க்கு உங்களிடம் வலுவான திறன் உள்ளது, ஆனால் அந்த திறனை முடிவுகளாக மாற்ற பொறுமையும் சரியான நேரமும் தேவை. மெதுவான முன்னேற்றத்தால் சோர்வடையாதீர்கள் — அடித்தளம் உறுதியானது.`);
    partsBn.push(`${dl.bn} জন্য আপনার মধ্যে শক্তিশালী সম্ভাবনা রয়েছে, তবে সেই সম্ভাবনাকে ফলাফলে রূপান্তরিত করতে ধৈর্য এবং সঠিক সময় প্রয়োজন। ধীর অগ্রগতিতে নিরুৎসাহিত হবেন না — ভিত্তি মজবুত।`);
  } else if (pd.dxxDelivery >= 70) {
    parts.push(`While ${dl.en} may not be the first thing people notice about your chart, the deeper analysis reveals hidden support. When the right planetary period activates, you may surprise yourself with what you achieve here.`);
    partsHi.push(`हालाँकि ${dl.hi} आपकी कुण्डली की पहली दृष्टि में स्पष्ट नहीं, गहन विश्लेषण छिपा सहयोग दर्शाता है। सही ग्रह काल में आप स्वयं चकित हो सकते हैं।`);
    partsTa.push(`${dl.ta} உங்கள் ஜாதகத்தில் முதலில் தெளிவாக தெரியாவிட்டாலும், ஆழமான பகுப்பாய்வு மறைந்த ஆதரவை வெளிப்படுத்துகிறது. சரியான கிரக காலம் செயல்படும்போது, நீங்கள் இங்கு அடைவதை பார்த்து ஆச்சரியப்படலாம்.`);
    partsBn.push(`যদিও ${dl.bn} আপনার জাতকে প্রথমে স্পষ্ট নয়, গভীর বিশ্লেষণ লুকানো সহায়তা প্রকাশ করে। সঠিক গ্রহ কাল সক্রিয় হলে, আপনি এখানে যা অর্জন করেন তা দেখে নিজেই অবাক হতে পারেন।`);
  } else {
    parts.push(`For ${dl.en}, your chart indicates a steady but measured path. Don't expect fireworks — instead, consistent effort over time will yield meaningful results. Focus on building skills and relationships in this area.`);
    partsHi.push(`${dl.hi} के लिए आपकी कुण्डली स्थिर किन्तु मापित मार्ग दर्शाती है। धमाकेदार परिणाम की अपेक्षा न करें — निरंतर प्रयास से सार्थक फल मिलेंगे।`);
    partsTa.push(`${dl.ta} க்கு, உங்கள் ஜாதகம் நிலையான ஆனால் அளவிடப்பட்ட பாதையை சுட்டிக்காட்டுகிறது. வெடிப்பான முடிவுகளை எதிர்பார்க்காதீர்கள் — பதிலாக, காலப்போக்கில் தொடர்ந்த முயற்சி அர்த்தமுள்ள முடிவுகளை தரும்.`);
    partsBn.push(`${dl.bn} এর জন্য, আপনার জাতক একটি স্থির কিন্তু পরিমিত পথ নির্দেশ করে। বিস্ফোরক ফলাফল আশা করবেন না — পরিবর্তে, সময়ের সাথে ধারাবাহিক প্রচেষ্টা অর্থপূর্ণ ফলাফল দেবে।`);
  }

  // 2. Planets that are your allies in this domain
  if (vargottamaPlanets.length > 0) {
    const allies = vargottamaPlanets.map(pid => {
      const p = PNAME[pid] || { en: 'a planet', hi: 'एक ग्रह', ta: 'ஒரு கிரகம்', bn: 'একটি গ্রহ', role: 'influence', roleTa: 'செல்வாக்கு', roleBn: 'প্রভাব' };
      return { en: `${p.en} (${p.role})`, hi: `${p.hi} (${p.role})`, ta: `${p.ta} (${p.roleTa})`, bn: `${p.bn} (${p.roleBn})` };
    });
    if (allies.length === 1) {
      parts.push(`${allies[0].en} is especially powerful for ${dl.en} — this planet occupies the same strong position in both your birth chart and this specialized chart, meaning its influence is dependable and consistent.`);
      partsHi.push(`${allies[0].hi} ${dl.hi} के लिए विशेष रूप से शक्तिशाली है — यह ग्रह दोनों चार्ट में समान बलवान स्थिति में है।`);
      partsTa.push(`${allies[0].ta} ${dl.ta} க்கு விசேஷமாக வலுவானது — இந்த கிரகம் உங்கள் ஜன்ம ஜாதகம் மற்றும் இந்த சிறப்பு ஜாதகம் இரண்டிலும் ஒரே வலுவான நிலையில் உள்ளது.`);
      partsBn.push(`${allies[0].bn} ${dl.bn} এর জন্য বিশেষভাবে শক্তিশালী — এই গ্রহটি আপনার জন্ম জাতক এবং এই বিশেষ জাতক উভয়তেই একই শক্তিশালী অবস্থানে রয়েছে।`);
    } else {
      const enList = allies.map(a => a.en).join(' and ');
      parts.push(`${enList} are especially powerful for ${dl.en} — these planets hold consistent strength across multiple chart layers, making their influence reliable.`);
      partsHi.push(`${allies.map(a => a.hi).join(' और ')} ${dl.hi} के लिए विशेष रूप से शक्तिशाली हैं।`);
      partsTa.push(`${allies.map(a => a.ta).join(' மற்றும் ')} ${dl.ta} க்கு விசேஷமாக வலுவானவை — இந்த கிரகங்கள் பல ஜாதக அடுக்குகளில் தொடர்ந்து வலிமையை கொண்டுள்ளன.`);
      partsBn.push(`${allies.map(a => a.bn).join(' এবং ')} ${dl.bn} এর জন্য বিশেষভাবে শক্তিশালী — এই গ্রহগুলি একাধিক জাতক স্তরে ধারাবাহিক শক্তি ধারণ করে।`);
    }
  }

  // 3. Tailwinds and headwinds — what's working for/against you
  if (pushkaraCount > 0 && gandantaCount === 0) {
    parts.push(`You have natural good fortune backing ${dl.en} — like a tailwind that makes effort go further. Take advantage of this during favorable planetary periods.`);
    partsHi.push(`${dl.hi} में आपके पास प्राकृतिक सौभाग्य का सहारा है — अनुकूल ग्रह काल में इसका लाभ उठाएं।`);
    partsTa.push(`${dl.ta} க்கு இயற்கையான நல்ல அதிர்ஷ்டம் ஆதரவாக உள்ளது — சாதகமான கிரக காலங்களில் இதை பயன்படுத்திக் கொள்ளுங்கள்.`);
    partsBn.push(`${dl.bn} এর পেছনে প্রাকৃতিক সৌভাগ্য সহায়তা করছে — অনুকূল গ্রহ কালে এর সুবিধা নিন।`);
  } else if (gandantaCount > 0 && pushkaraCount === 0) {
    parts.push(`There's a karmic knot around ${dl.en} that may create periods of confusion or setbacks. These are growth moments, not permanent blocks — working through them builds lasting strength.`);
    partsHi.push(`${dl.hi} के आसपास एक कार्मिक गांठ है जो भ्रम या बाधा उत्पन्न कर सकती है। ये विकास के क्षण हैं, स्थायी अवरोध नहीं।`);
    partsTa.push(`${dl.ta} மேல் ஒரு கார்மிக் முடிச்சு உள்ளது, இது குழப்பம் அல்லது தடைகளை உருவாக்கலாம். இவை வளர்ச்சி நேரங்கள், நிரந்தர தடைகள் அல்ல.`);
    partsBn.push(`${dl.bn} এর চারপাশে একটি কার্মিক গ্রন্থি রয়েছে যা বিভ্রান্তি বা বাধার সময়কাল তৈরি করতে পারে। এগুলি বৃদ্ধির মুহূর্ত, স্থায়ী বাধা নয়।`);
  } else if (pushkaraCount > 0 && gandantaCount > 0) {
    parts.push(`Interestingly, ${dl.en} shows both natural blessings and karmic challenges. You'll experience phases of ease alternating with periods that test your resolve. The blessings ultimately outweigh the challenges.`);
    partsHi.push(`रोचक बात यह है कि ${dl.hi} में प्राकृतिक आशीर्वाद और कार्मिक चुनौतियां दोनों हैं। सहजता और परीक्षा के दौर बारी-बारी आएंगे।`);
    partsTa.push(`சுவாரஸ்யமான விஷயம் என்னவென்றால், ${dl.ta} இயற்கையான ஆசீர்வாதங்களையும் கார்மிக் சவால்களையும் இரண்டையும் காட்டுகிறது. எளிமையின் கட்டங்கள் உங்கள் உறுதியை சோதிக்கும் காலங்களுடன் மாறி மாறி வரும்.`);
    partsBn.push(`আকর্ষণীয়ভাবে, ${dl.bn} প্রাকৃতিক আশীর্বাদ এবং কার্মিক চ্যালেঞ্জ উভয়ই দেখায়। সহজতার পর্যায়গুলি আপনার সংকল্প পরীক্ষা করার সময়কালের সাথে পর্যায়ক্রমে আসবে।`);
  }

  // 4. Special combinations — in plain language
  if (yogas.length > 0) {
    const count = yogas.length;
    if (count >= 3) {
      parts.push(`Multiple special planetary combinations (${count} found) strengthen this area of your life — this is above average and suggests natural talent or fortunate circumstances.`);
      partsHi.push(`अनेक विशेष ग्रह संयोजन (${count}) इस जीवन क्षेत्र को सुदृढ़ करते हैं — यह औसत से ऊपर है और प्राकृतिक प्रतिभा का संकेत है।`);
      partsTa.push(`பல சிறப்பு கிரக சேர்க்கைகள் (${count} கண்டறியப்பட்டன) உங்கள் வாழ்க்கையின் இந்த பகுதியை வலுப்படுத்துகின்றன — இது சராசரிக்கு மேலே மற்றும் இயற்கையான திறமையை சுட்டிக்காட்டுகிறது.`);
      partsBn.push(`একাধিক বিশেষ গ্রহ সংমিশ্রণ (${count}টি পাওয়া গেছে) আপনার জীবনের এই ক্ষেত্রটিকে শক্তিশালী করে — এটি গড়ের উপরে এবং প্রাকৃতিক প্রতিভার ইঙ্গিত দেয়।`);
    } else {
      parts.push(`A special planetary combination supports ${dl.en}, adding an extra boost during its activation period.`);
      partsHi.push(`एक विशेष ग्रह संयोजन ${dl.hi} को सहयोग करता है, सक्रियण काल में अतिरिक्त बल देता है।`);
      partsTa.push(`ஒரு சிறப்பு கிரக சேர்க்கை ${dl.ta} க்கு ஆதரவளிக்கிறது, அதன் செயல்படுத்தல் காலத்தில் கூடுதல் உந்துதல் சேர்க்கிறது.`);
      partsBn.push(`একটি বিশেষ গ্রহ সংমিশ্রণ ${dl.bn} কে সমর্থন করে, এর সক্রিয়করণ সময়কালে একটি অতিরিক্ত শক্তি যোগ করে।`);
    }
  }

  // 5. Hidden strengths or gaps
  const improvements = cross.dignityShifts.filter(d => d.shift === 'improved');
  const declines = cross.dignityShifts.filter(d => d.shift === 'declined');
  if (improvements.length > declines.length) {
    parts.push(`The deeper chart reveals hidden strengths that aren't obvious from a surface reading — you may find that ${dl.en} improves in ways you didn't initially expect.`);
    partsHi.push(`गहन चार्ट ऐसी छिपी शक्तियां दर्शाता है जो सतही पढ़ने से स्पष्ट नहीं — ${dl.hi} अप्रत्याशित रूप से सुधर सकता है।`);
    partsTa.push(`ஆழமான ஜாதகம் மேற்பரப்பு வாசிப்பில் தெளிவாக தெரியாத மறைந்த பலங்களை வெளிப்படுத்துகிறது — ${dl.ta} நீங்கள் ஆரம்பத்தில் எதிர்பார்க்காத வழிகளில் மேம்படலாம்.`);
    partsBn.push(`গভীর জাতক এমন লুকানো শক্তি প্রকাশ করে যা পৃষ্ঠীয় পাঠে স্পষ্ট নয় — ${dl.bn} এমনভাবে উন্নত হতে পারে যা আপনি প্রাথমিকভাবে প্রত্যাশা করেননি।`);
  } else if (declines.length > improvements.length) {
    parts.push(`Some of the promise visible in your birth chart faces friction when examined more deeply. This doesn't negate the potential, but suggests that ${dl.en} will require more deliberate effort than it might initially appear.`);
    partsHi.push(`जन्म कुण्डली में दिखने वाली कुछ संभावनाएं गहन परीक्षा में बाधा दर्शाती हैं। ${dl.hi} के लिए प्रत्याशा से अधिक सचेत प्रयास की आवश्यकता होगी।`);
    partsTa.push(`உங்கள் ஜன்ம ஜாதகத்தில் தெரியும் சில வாக்குறுதிகள் ஆழமாக ஆராயும்போது தடையை எதிர்கொள்கின்றன. ${dl.ta} க்கு ஆரம்பத்தில் தோன்றுவதை விட அதிக வேண்டுமென்றே முயற்சி தேவைப்படும்.`);
    partsBn.push(`আপনার জন্ম জাতকে দৃশ্যমান কিছু প্রতিশ্রুতি আরও গভীরভাবে পরীক্ষা করলে ঘর্ষণের সম্মুখীন হয়। ${dl.bn} এর জন্য প্রাথমিকভাবে মনে হওয়ার চেয়ে বেশি ইচ্ছাকৃত প্রচেষ্টার প্রয়োজন হবে।`);
  }

  return {
    en: parts.join('\n\n'),
    hi: partsHi.join('\n\n'),
    ta: partsTa.join('\n\n'),
    bn: partsBn.join('\n\n'),
  };
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function buildDeepVargaAnalysis(
  kundali: KundaliData,
  chartId: string,
): DeepVargaResult | null {
  // Get the divisional chart — D9 may live on navamshaChart rather than divisionalCharts
  let dxxChart = kundali.divisionalCharts?.[chartId] ?? null;
  if (!dxxChart && chartId === 'D9' && kundali.navamshaChart) {
    // navamshaChart is ChartData; synthesise a DivisionalChart-compatible object
    dxxChart = {
      ...kundali.navamshaChart,
      division: 'D9',
      label: { en: 'D9 Navamsha', hi: 'D9 नवांश' },
    } as DivisionalChart;
  }
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

  // Build a meaningful narrative from the analysis data
  const narrative = buildNarrative(
    chartId, domain, crossCorrelation, promiseDelivery,
    vargottamaPlanets, pushkaraCount, gandantaCount, yogasInChart,
  );

  return {
    chartId,
    domain,
    crossCorrelation,
    promiseDelivery,
    narrative,
  };
}

// ---------------------------------------------------------------------------
// Factor 16: Combustion in Divisional Charts
// ---------------------------------------------------------------------------

/** Combustion orbs in degrees from Sun (classical values) */
const COMBUSTION_ORBS: Record<number, number> = {
  1: 12, // Moon
  2: 17, // Mars
  3: 14, // Mercury (12° when retrograde — handled in function)
  4: 11, // Jupiter
  5: 10, // Venus (8° when retrograde — handled in function)
  6: 15, // Saturn
};

/** Planets excluded from combustion check: Sun (0), Rahu (7), Ketu (8) */
const COMBUSTION_EXCLUDED = new Set([0, 7, 8]);

const COMBUSTION_NARRATIVES: Record<number, { en: string; hi: string }> = {
  1: {
    en: 'Moon is combust — emotional significations are overshadowed by ego. Mental peace requires conscious detachment from self-image.',
    hi: 'चन्द्र अस्त — भावनात्मक अर्थ अहंकार से ढके हैं। मानसिक शांति के लिए आत्म-छवि से सचेत विरक्ति आवश्यक है।',
  },
  2: {
    en: 'Mars is combust — courage and initiative are filtered through ego. Assertiveness may manifest as aggression or be suppressed entirely.',
    hi: 'मंगल अस्त — साहस और पहल अहंकार से छनकर आते हैं। दृढ़ता आक्रामकता बन सकती है या पूर्णतः दब सकती है।',
  },
  3: {
    en: 'Mercury is combust — intellect and communication are coloured by self-interest. Objective analysis requires deliberate effort.',
    hi: 'बुध अस्त — बुद्धि और संवाद स्वार्थ से रंगे हैं। वस्तुनिष्ठ विश्लेषण के लिए सचेत प्रयास आवश्यक है।',
  },
  4: {
    en: 'Jupiter is combust — wisdom and expansion are filtered through ego. Dharmic growth requires conscious humility.',
    hi: 'गुरु अस्त — ज्ञान और विस्तार अहंकार से छनते हैं। धार्मिक विकास के लिए सचेत विनम्रता आवश्यक है।',
  },
  5: {
    en: 'Venus is combust — spouse-related significations are overshadowed by ego. The partner may feel eclipsed by your personality.',
    hi: 'शुक्र अस्त — जीवनसाथी से जुड़े अर्थ अहंकार से ढके हैं। साथी आपके व्यक्तित्व से ग्रसित महसूस कर सकता है।',
  },
  6: {
    en: 'Saturn is combust — discipline and karmic lessons are tangled with self-image. Authority issues surface in this domain.',
    hi: 'शनि अस्त — अनुशासन और कर्म-पाठ आत्म-छवि से उलझे हैं। इस क्षेत्र में अधिकार के मुद्दे उभरते हैं।',
  },
};

/**
 * Detect combustion status for each planet.
 * Combustion is a natal condition (planet too close to Sun) that persists
 * across all divisional charts and weakens the planet's significations.
 *
 * Uses PlanetPosition.isCombust flag if available; otherwise computes
 * from longitude difference with Sun.
 */
export function computeCombustionInDxx(
  planets: PlanetPosition[],
): { planetId: number; isCombust: boolean; orb: number; narrative: { en: string; hi: string } }[] {
  const results: { planetId: number; isCombust: boolean; orb: number; narrative: { en: string; hi: string } }[] = [];

  // Find Sun's longitude for fallback computation
  const sunPlanet = planets.find(p => p.planet.id === 0);
  const sunLng = sunPlanet?.longitude ?? 0;

  for (const pp of planets) {
    const pid = pp.planet.id;
    if (COMBUSTION_EXCLUDED.has(pid)) continue;

    const maxOrb = COMBUSTION_ORBS[pid];
    if (maxOrb === undefined) continue;

    // Adjust orb for retrograde Mercury/Venus
    let effectiveOrb = maxOrb;
    if (pid === 3 && pp.isRetrograde) effectiveOrb = 12;
    if (pid === 5 && pp.isRetrograde) effectiveOrb = 8;

    // Use the flag if available; otherwise compute from longitude
    let combust = pp.isCombust;
    let orbDistance = 0;

    if (pp.longitude !== undefined && sunPlanet) {
      // Compute angular separation (shortest arc)
      let diff = Math.abs(pp.longitude - sunLng);
      if (diff > 180) diff = 360 - diff;
      orbDistance = diff;

      // If flag not set, compute from orb
      if (combust === undefined || combust === null) {
        combust = orbDistance <= effectiveOrb;
      }
    }

    const narrative = combust && COMBUSTION_NARRATIVES[pid]
      ? COMBUSTION_NARRATIVES[pid]
      : { en: '', hi: '' };

    results.push({
      planetId: pid,
      isCombust: !!combust,
      orb: Math.round(orbDistance * 100) / 100,
      narrative,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Factor 17: Retrogression in Divisional Charts
// ---------------------------------------------------------------------------

/** Only classical planets can be meaningfully retrograde (Sun/Moon never, Rahu/Ketu always — ignored) */
const RETRO_ELIGIBLE = new Set([2, 3, 4, 5, 6]);

const RETRO_NARRATIVES: Record<number, { en: string; hi: string }> = {
  2: {
    en: 'Mars retrograde — assertiveness is internalized. In this domain, anger simmers beneath the surface rather than erupting. Actions are deliberate but delayed.',
    hi: 'मंगल वक्री — दृढ़ता अंतर्मुखी हो जाती है। इस क्षेत्र में क्रोध सतह के नीचे सुलगता है, विस्फोट नहीं होता। कार्य सोच-समझकर पर विलंबित होते हैं।',
  },
  3: {
    en: 'Mercury retrograde — communication follows non-linear paths. Revisiting past decisions and re-evaluating commitments is natural.',
    hi: 'बुध वक्री — संवाद अरेखीय मार्गों से होता है। पिछले निर्णयों पर पुनर्विचार और प्रतिबद्धताओं का पुनर्मूल्यांकन स्वाभाविक है।',
  },
  4: {
    en: 'Jupiter retrograde — wisdom is introspective. Growth comes through inner reflection rather than outward expansion. Unconventional dharmic path.',
    hi: 'गुरु वक्री — ज्ञान अंतर्मुखी है। विकास बाहरी विस्तार के बजाय आंतरिक चिंतन से आता है। अपरंपरागत धार्मिक मार्ग।',
  },
  5: {
    en: 'Venus retrograde — relationships and aesthetics are experienced internally. Past-life romantic patterns resurface. Artistic expression is deeply personal.',
    hi: 'शुक्र वक्री — रिश्ते और सौंदर्य आंतरिक रूप से अनुभव होते हैं। पूर्वजन्म के प्रेम प्रतिरूप पुनः उभरते हैं। कलात्मक अभिव्यक्ति गहन व्यक्तिगत है।',
  },
  6: {
    en: 'Saturn retrograde — karmic lessons are self-imposed rather than externally enforced. Discipline comes from within but career path is non-linear.',
    hi: 'शनि वक्री — कर्म-पाठ बाहरी बाध्यता के बजाय स्वयं-आरोपित हैं। अनुशासन भीतर से आता है पर कैरियर पथ अरेखीय है।',
  },
};

/**
 * Detect retrogression status for eligible planets.
 * Retrograde planets express their energy INWARD and UNCONVENTIONALLY
 * in the divisional domain. This is a natal condition that persists across
 * all divisional charts.
 *
 * Only Mars(2), Mercury(3), Jupiter(4), Venus(5), Saturn(6) are checked.
 * Sun/Moon never retrograde; Rahu/Ketu always retrograde (conventionally ignored).
 */
export function computeRetroInDxx(
  planets: PlanetPosition[],
): { planetId: number; isRetrograde: boolean; narrative: { en: string; hi: string } }[] {
  const results: { planetId: number; isRetrograde: boolean; narrative: { en: string; hi: string } }[] = [];

  for (const pp of planets) {
    const pid = pp.planet.id;
    if (!RETRO_ELIGIBLE.has(pid)) continue;

    const retro = !!pp.isRetrograde;
    const narrative = retro && RETRO_NARRATIVES[pid]
      ? RETRO_NARRATIVES[pid]
      : { en: '', hi: '' };

    results.push({
      planetId: pid,
      isRetrograde: retro,
      narrative,
    });
  }

  return results;
}
