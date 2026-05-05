/**
 * Eclipse Impact on Natal Chart Engine
 *
 * Analyzes how eclipses affect a person's birth chart by computing:
 * - Which house the eclipse activates
 * - Which natal planets are conjunct or in the eclipsed house
 * - Whether the natal Rahu-Ketu axis is triggered
 * - Intensity scoring (high / moderate / low)
 * - Interpretive guidance including remedies
 *
 * Eclipse longitude is computed from the Sun's sidereal position on the
 * eclipse date using the same Meeus/Swiss Ephemeris engine as the rest of
 * the app. Lunar eclipses occur opposite the Sun (Moon's longitude = Sun + 180).
 */

import type { KundaliData } from '@/types/kundali';
import type { EclipseData } from '@/lib/calendar/eclipse-data';
import { ECLIPSE_TABLE } from '@/lib/calendar/eclipse-data';
import type { LocaleText } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { dateToJD, sunLongitude, normalizeDeg } from '@/lib/ephem/astronomical';
import { HOUSE_SIGNIFICATIONS, ECLIPSE_INTERPRETATIONS } from './eclipse-interpretations';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface EclipseImpact {
  eclipse: EclipseData;
  /** Sidereal longitude of the eclipse point (0-360) */
  eclipseLongitude: number;
  /** 1-12 house number the eclipse falls in */
  houseActivated: number;
  /** Rashi ID 1-12 */
  signActivated: number;
  signName: LocaleText;
  houseSignificance: string[];
  /** Planet IDs of natal planets that reside in the eclipsed house */
  planetsInHouse: number[];
  /** Natal planets within 10° of the eclipse point */
  conjunctNatal: { planetId: number; orb: number }[];
  /** True if eclipse is within 15° of natal Rahu or Ketu */
  isNatalNodeAxis: boolean;
  intensity: 'high' | 'moderate' | 'low';
  interpretation: {
    summary: string;
    lifeAreas: string[];
    advice: string;
    duration: string;
    remedies: string[];
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Compute the sidereal longitude of the eclipse point. */
function computeEclipseLongitude(eclipse: EclipseData, ayanamshaValue: number): number {
  const [y, m, d] = eclipse.date.split('-').map(Number);
  const jd = dateToJD(y, m, d, 12); // noon UTC
  const tropicalSun = sunLongitude(jd);
  const siderealSun = normalizeDeg(tropicalSun - ayanamshaValue);

  if (eclipse.kind === 'solar') {
    // Solar eclipse occurs at Sun's longitude (New Moon — Sun & Moon conjunct)
    return siderealSun;
  }
  // Lunar eclipse occurs opposite Sun (Full Moon — Moon is 180° from Sun)
  return normalizeDeg(siderealSun + 180);
}

/** Absolute angular distance between two points on the zodiac circle (0-180). */
function angularDistance(a: number, b: number): number {
  const d = Math.abs(normalizeDeg(a) - normalizeDeg(b));
  return d > 180 ? 360 - d : d;
}

/**
 * Determine which house a sidereal longitude falls into using chart cusps.
 *
 * Walks the chart.houses array (sorted by house number 1-12). The cusp degree
 * of house N is its start; house N+1's cusp is the end. Handles the zodiacal
 * wrap-around at 360°/0°.
 */
function findHouseForLongitude(longitude: number, houses: KundaliData['houses']): number {
  // Defensive: if houses are missing or empty, fall back to equal-house (sign = house)
  if (!houses || houses.length === 0) {
    return Math.floor(longitude / 30) + 1;
  }

  // Sort by house number to guarantee order
  const sorted = [...houses].sort((a, b) => a.house - b.house);

  for (let i = 0; i < 12; i++) {
    const start = normalizeDeg(sorted[i].degree);
    const end = normalizeDeg(sorted[(i + 1) % 12].degree);

    if (start < end) {
      // Normal span (e.g., 45° to 75°)
      if (longitude >= start && longitude < end) {
        return sorted[i].house;
      }
    } else {
      // Wraps around 360° (e.g., 340° to 10°)
      if (longitude >= start || longitude < end) {
        return sorted[i].house;
      }
    }
  }

  // Fallback: sign-based
  return Math.floor(longitude / 30) + 1;
}

/** Map sign ID (1-12) to the RASHIS entry. */
function getSignFromLongitude(longitude: number): { id: number; name: LocaleText } {
  const signId = Math.floor(normalizeDeg(longitude) / 30) + 1;
  const rashi = RASHIS.find((r) => r.id === signId);
  return {
    id: signId,
    name: rashi ? rashi.name : { en: `Sign ${signId}` },
  };
}

/** Angular houses (kendras): 1, 4, 7, 10. */
const ANGULAR_HOUSES = new Set([1, 4, 7, 10]);

/** Cadent houses: 3, 6, 9, 12. */
const CADENT_HOUSES = new Set([3, 6, 9, 12]);

// Rahu = planet ID 7, Ketu = planet ID 8
const RAHU_ID = 7;
const KETU_ID = 8;

// Benefic planet IDs: Jupiter (4), Venus (5), Mercury (3), Moon (1) — waxing
const BENEFIC_IDS = new Set([1, 3, 4, 5]);

/** Orbs for conjunction and node axis detection */
const CONJUNCTION_ORB = 10; // degrees
const NODE_AXIS_ORB = 15;  // degrees

// ---------------------------------------------------------------------------
// Core analysis
// ---------------------------------------------------------------------------

/**
 * Analyze a single eclipse's impact on a natal chart.
 */
export function analyzeEclipseImpact(
  eclipse: EclipseData,
  chart: KundaliData
): EclipseImpact {
  // chart.ayanamshaValue is the user's chosen ayanamsha system, set during kundali computation
  const ayanamsha = chart.ayanamshaValue;
  const eclipseLong = computeEclipseLongitude(eclipse, ayanamsha);

  // Sign the eclipse falls in
  const sign = getSignFromLongitude(eclipseLong);

  // House the eclipse activates
  const houseNum = findHouseForLongitude(eclipseLong, chart.houses);

  // House significations
  const houseSignificance = HOUSE_SIGNIFICATIONS[houseNum] ?? [];

  // Planets in the activated house
  const planetsInHouse = chart.planets
    .filter((p) => p.house === houseNum)
    .map((p) => p.planet.id);

  // Natal planets conjunct eclipse (within CONJUNCTION_ORB degrees)
  const conjunctNatal: { planetId: number; orb: number }[] = [];
  for (const p of chart.planets) {
    const orb = angularDistance(p.longitude, eclipseLong);
    if (orb <= CONJUNCTION_ORB) {
      conjunctNatal.push({ planetId: p.planet.id, orb: Math.round(orb * 100) / 100 });
    }
  }

  // Natal Rahu/Ketu axis check
  const rahuPlanet = chart.planets.find((p) => p.planet.id === RAHU_ID);
  const ketuPlanet = chart.planets.find((p) => p.planet.id === KETU_ID);
  const isNatalNodeAxis =
    (rahuPlanet != null && angularDistance(rahuPlanet.longitude, eclipseLong) <= NODE_AXIS_ORB) ||
    (ketuPlanet != null && angularDistance(ketuPlanet.longitude, eclipseLong) <= NODE_AXIS_ORB);

  // Intensity scoring
  const intensity = scoreIntensity({
    houseNum,
    conjunctNatal,
    isNatalNodeAxis,
    planetsInHouse,
  });

  // Interpretation lookup
  const eclipseKind = eclipse.kind; // 'solar' | 'lunar'
  const interp = ECLIPSE_INTERPRETATIONS[eclipseKind]?.[houseNum] ?? {
    summary: `Eclipse in house ${houseNum} activates themes of ${houseSignificance.join(', ')}.`,
    lifeAreas: houseSignificance,
    advice: 'Observe the eclipse period with mindfulness and avoid major decisions.',
    duration: 'Effects typically last 6 months.',
    remedies: ['Recite appropriate mantras', 'Practice meditation during the eclipse window'],
  };

  return {
    eclipse,
    eclipseLongitude: Math.round(eclipseLong * 100) / 100,
    houseActivated: houseNum,
    signActivated: sign.id,
    signName: sign.name,
    houseSignificance,
    planetsInHouse,
    conjunctNatal,
    isNatalNodeAxis,
    intensity,
    interpretation: interp,
  };
}

/**
 * Analyze all eclipses for a given year against a natal chart.
 */
export function analyzeAllEclipses(
  year: number,
  chart: KundaliData
): EclipseImpact[] {
  const yearStr = String(year);
  const eclipsesInYear = ECLIPSE_TABLE.filter((e) => e.date.startsWith(yearStr));
  return eclipsesInYear.map((e) => analyzeEclipseImpact(e, chart));
}

// ---------------------------------------------------------------------------
// Intensity scoring
// ---------------------------------------------------------------------------

interface IntensityInput {
  houseNum: number;
  conjunctNatal: { planetId: number; orb: number }[];
  isNatalNodeAxis: boolean;
  planetsInHouse: number[];
}

function scoreIntensity(input: IntensityInput): 'high' | 'moderate' | 'low' {
  const { houseNum, conjunctNatal, isNatalNodeAxis, planetsInHouse } = input;

  // HIGH: conjunct any natal planet, OR on natal node axis, OR angular house with planets
  if (conjunctNatal.length > 0) return 'high';
  if (isNatalNodeAxis) return 'high';
  if (ANGULAR_HOUSES.has(houseNum) && planetsInHouse.length > 0) return 'high';

  // MODERATE: angular house without conjunction, OR aspecting natal benefics in house
  if (ANGULAR_HOUSES.has(houseNum)) return 'moderate';
  const hasBeneficInHouse = planetsInHouse.some((pid) => BENEFIC_IDS.has(pid));
  if (hasBeneficInHouse) return 'moderate';

  // LOW: cadent houses without major aspects
  if (CADENT_HOUSES.has(houseNum) && planetsInHouse.length === 0) return 'low';

  // Default to moderate for succedent houses (2, 5, 8, 11) without planets
  return planetsInHouse.length > 0 ? 'moderate' : 'low';
}
