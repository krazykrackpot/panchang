/**
 * Varga Cross-Read -- D9 (Navamsha) and D7 (Saptamsha) cross-chart analysis.
 *
 * D9 for marriage: compares navamsha placements between spouses.
 * D7 for children: compares saptamsha placements between parent and child.
 *
 * Scoring factors:
 * - Varga lagna compatibility (same/friendly/neutral/enemy signs)
 * - Venus placement harmony (D9) or Jupiter placement harmony (D7)
 * - Moon compatibility in varga (emotional resonance)
 * - Lord exchange between varga ascendants
 * - Target house lord compatibility (7th for D9, 5th for D7)
 */

import type { KundaliData } from '@/types/kundali';
import type { VargaCrossRead } from './types';
import { getSignRelation } from '@/lib/comparison/synastry-engine';

// Sign lordship mapping: sign (1-12) -> planet id (0=Sun..6=Saturn)
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// Sign relation scoring (matches SignRelation type from synastry-engine)
const RELATION_SCORE: Record<string, number> = {
  same: 10, trine: 8, neutral: 5, difficult: 3,
};

/** Helper: extract planet id from a PlanetPosition-like object (handles both real and fixture shapes). */
function getPlanetId(p: Record<string, unknown>): number {
  // Real PlanetPosition has p.planet.id; test fixtures may have p.id directly
  if (typeof p.id === 'number') return p.id;
  if (p.planet && typeof (p.planet as Record<string, unknown>).id === 'number') {
    return (p.planet as Record<string, unknown>).id as number;
  }
  return -1;
}

/**
 * Get the varga chart planets with their varga signs.
 *
 * ChartData stores planet ids per house (houses: number[][]) and ascendantSign,
 * but not a full planets array. When navamshaChart/divisionalCharts are available,
 * we use the house-to-planet mapping to derive each planet's varga sign.
 * Otherwise we compute varga signs from the main chart longitudes.
 */
function getVargaPlanets(kundali: KundaliData, vargaType: 'D9' | 'D7') {
  // Try to derive varga signs from ChartData house mapping
  const chartData = vargaType === 'D9'
    ? kundali.navamshaChart
    : (kundali.divisionalCharts?.D7 ?? null);

  if (chartData && chartData.houses?.length) {
    // Build a planet-id -> varga-sign map from house data
    const pidToVargaSign = new Map<number, number>();
    for (let houseIdx = 0; houseIdx < chartData.houses.length; houseIdx++) {
      // Whole sign: house 1 sign = ascendantSign, house 2 = asc+1, etc.
      const houseSign = ((chartData.ascendantSign - 1 + houseIdx) % 12) + 1;
      for (const pid of (chartData.houses[houseIdx] ?? [])) {
        pidToVargaSign.set(pid, houseSign);
      }
    }
    if (pidToVargaSign.size > 0) {
      const planets = kundali.planets as unknown as Array<Record<string, unknown>>;
      return planets.map(p => ({
        ...p,
        sign: pidToVargaSign.get(getPlanetId(p)) ?? (p.sign as number),
      }));
    }
  }

  // Fallback: compute varga sign from longitude
  // D9: Each navamsha = 3deg20' (3.333deg). D7: Each saptamsha = 30/7 deg.
  const planets = kundali.planets as unknown as Array<Record<string, unknown>>;
  return planets.map(p => ({
    ...p,
    sign: vargaType === 'D9'
      ? (Math.floor((p.longitude as number) / (10 / 3)) % 12) + 1
      : (Math.floor((p.longitude as number) / (30 / 7)) % 12) + 1,
  }));
}

/**
 * Get the varga ascendant sign. Uses ChartData.ascendantSign when available,
 * otherwise computes from main ascendant longitude.
 */
function getVargaAscSign(kundali: KundaliData, vargaType: 'D9' | 'D7'): number {
  const chartData = vargaType === 'D9'
    ? kundali.navamshaChart
    : (kundali.divisionalCharts?.D7 ?? null);

  if (chartData?.ascendantSign) {
    return chartData.ascendantSign;
  }
  const ascLongitude = kundali.ascendant.degree + (kundali.ascendant.sign - 1) * 30;
  return computeVargaSign(ascLongitude, vargaType);
}

function computeVargaSign(longitude: number, vargaType: 'D9' | 'D7'): number {
  if (vargaType === 'D9') {
    return (Math.floor(longitude / (10 / 3)) % 12) + 1;
  }
  return (Math.floor(longitude / (30 / 7)) % 12) + 1;
}

/**
 * Compute D9 or D7 cross-chart compatibility.
 */
export function computeVargaCrossRead(
  chartA: KundaliData,
  chartB: KundaliData,
  vargaType: 'D9' | 'D7',
): VargaCrossRead {
  const planetsA = getVargaPlanets(chartA, vargaType);
  const planetsB = getVargaPlanets(chartB, vargaType);

  const ascSignA = getVargaAscSign(chartA, vargaType);
  const ascSignB = getVargaAscSign(chartB, vargaType);

  let totalScore = 0;
  let factorCount = 0;

  // Factor 1: Varga ascendant compatibility
  const ascRelation = getSignRelation(ascSignA, ascSignB);
  const ascScore = RELATION_SCORE[ascRelation.relation] ?? 5;
  totalScore += ascScore;
  factorCount++;

  // Factor 2: Key planet placement harmony
  // D9: Venus (id=5) signs compatible? D7: Jupiter (id=4) signs compatible?
  const keyPlanetId = vargaType === 'D9' ? 5 : 4;
  const keyA = (planetsA as Array<Record<string, unknown>>).find(p => getPlanetId(p) === keyPlanetId);
  const keyB = (planetsB as Array<Record<string, unknown>>).find(p => getPlanetId(p) === keyPlanetId);
  if (keyA && keyB) {
    const keyRelation = getSignRelation(keyA.sign as number, keyB.sign as number);
    totalScore += RELATION_SCORE[keyRelation.relation] ?? 5;
    factorCount++;
  }

  // Factor 3: Moon compatibility in varga (emotional resonance)
  const moonA = (planetsA as Array<Record<string, unknown>>).find(p => getPlanetId(p) === 1);
  const moonB = (planetsB as Array<Record<string, unknown>>).find(p => getPlanetId(p) === 1);
  if (moonA && moonB) {
    const moonRelation = getSignRelation(moonA.sign as number, moonB.sign as number);
    totalScore += RELATION_SCORE[moonRelation.relation] ?? 5;
    factorCount++;
  }

  // Factor 4: Lord exchange check (A's asc lord in B's asc sign or vice versa)
  const lordA = SIGN_LORD[ascSignA];
  const lordB = SIGN_LORD[ascSignB];
  const lordAPlanet = (planetsA as Array<Record<string, unknown>>).find(p => getPlanetId(p) === lordA);
  const lordBPlanet = (planetsB as Array<Record<string, unknown>>).find(p => getPlanetId(p) === lordB);
  let lordExchange = false;
  if (lordAPlanet && lordBPlanet) {
    if ((lordAPlanet.sign as number) === ascSignB || (lordBPlanet.sign as number) === ascSignA) {
      lordExchange = true;
      totalScore += 9;
      factorCount++;
    }
  }

  // Factor 5: 7th lord compatibility (D9) or 5th lord (D7)
  const targetHouse = vargaType === 'D9' ? 7 : 5;
  const targetSignA = ((ascSignA + targetHouse - 2) % 12) + 1;
  const targetSignB = ((ascSignB + targetHouse - 2) % 12) + 1;
  const targetLordA = SIGN_LORD[targetSignA];
  const targetLordB = SIGN_LORD[targetSignB];
  const targetPlanetA = (planetsA as Array<Record<string, unknown>>).find(p => getPlanetId(p) === targetLordA);
  const targetPlanetB = (planetsB as Array<Record<string, unknown>>).find(p => getPlanetId(p) === targetLordB);
  if (targetPlanetA && targetPlanetB) {
    const targetRelation = getSignRelation(targetPlanetA.sign as number, targetPlanetB.sign as number);
    totalScore += RELATION_SCORE[targetRelation.relation] ?? 5;
    factorCount++;
  }

  const compatibility = factorCount > 0
    ? Math.round((totalScore / factorCount) * 10) / 10
    : 5;
  const clampedScore = Math.max(0, Math.min(10, compatibility));

  // Generate narrative
  const narrative = generateVargaNarrative(vargaType, clampedScore, ascRelation.relation, lordExchange);

  return { vargaType, compatibility: clampedScore, narrative };
}

function generateVargaNarrative(
  vargaType: 'D9' | 'D7',
  score: number,
  ascRelation: string,
  lordExchange: boolean,
): { en: string; hi: string } {
  const vargaName = vargaType === 'D9' ? 'Navamsha (D9)' : 'Saptamsha (D7)';
  const vargaNameHi = vargaType === 'D9' ? 'नवांश (D9)' : 'सप्तांश (D7)';
  const context = vargaType === 'D9' ? 'marriage' : 'parent-child';
  const contextHi = vargaType === 'D9' ? 'वैवाहिक' : 'माता-पिता-संतान';

  let en = `${vargaName} cross-read shows `;
  let hi = `${vargaNameHi} विश्लेषण दर्शाता है कि `;

  if (score >= 8) {
    en += `strong ${context} compatibility (${score}/10). `;
    hi += `${contextHi} अनुकूलता मज़बूत है (${score}/10)। `;
  } else if (score >= 6) {
    en += `good ${context} compatibility (${score}/10). `;
    hi += `${contextHi} अनुकूलता अच्छी है (${score}/10)। `;
  } else if (score >= 4) {
    en += `moderate ${context} compatibility (${score}/10). `;
    hi += `${contextHi} अनुकूलता मध्यम है (${score}/10)। `;
  } else {
    en += `challenging ${context} dynamics (${score}/10). `;
    hi += `${contextHi} गतिशीलता चुनौतीपूर्ण है (${score}/10)। `;
  }

  if (ascRelation === 'same') {
    en += 'Same varga ascendant sign adds deep resonance. ';
    hi += 'एक ही वर्ग लग्न राशि गहरी प्रतिध्वनि जोड़ती है। ';
  }

  if (lordExchange) {
    en += 'A beneficial lord exchange strengthens the bond. ';
    hi += 'लाभकारी ग्रह विनिमय बंधन को मज़बूत करता है। ';
  }

  return { en: en.trim(), hi: hi.trim() };
}
