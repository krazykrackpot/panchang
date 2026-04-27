/**
 * Sign Shift Engine — computes personalized Western vs Vedic sign comparison.
 *
 * Can work from existing KundaliData (fast, no re-computation) or from
 * a ComparisonResult (for the standalone tropical-compare flow).
 *
 * The "shift" is caused by the precession of the equinoxes (~24.2° Lahiri
 * as of 2026). Tropical (Western) longitude = sidereal + ayanamsha.
 * When the addition pushes a planet across a sign boundary, the planet
 * is in a DIFFERENT sign in the two systems — that's the "shift".
 */

import { RASHIS } from '@/lib/constants/rashis';
import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { ComparisonResult } from '@/lib/ephem/comparison-engine';
import type { LocaleText } from '@/types/panchang';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SignShiftPlanet {
  planetName: LocaleText;
  tropicalSign: LocaleText;
  siderealSign: LocaleText;
  shifted: boolean;
  tropicalDeg: string; // "15°22'"
  siderealDeg: string;
  tropicalSignId: number;
  siderealSignId: number;
  planetId: number;
}

export interface ElementProfile {
  dominant: string;          // "Fire" / "Water" / etc.
  dominantHi: string;        // "अग्नि" / "जल"
  fire: number; earth: number; air: number; water: number;
}

export interface SignShiftData {
  planets: SignShiftPlanet[];
  shiftCount: number;
  ayanamsha: number;
  hookLine: LocaleText;
  elementContrast: { tropical: ElementProfile; sidereal: ElementProfile; shifted: boolean; contrastLine: LocaleText } | null;
  personName: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function formatDegMin(longitude: number): string {
  const signDeg = longitude % 30;
  const deg = Math.floor(signDeg);
  const min = Math.floor((signDeg - deg) * 60);
  return `${deg}\u00B0${String(min).padStart(2, '0')}'`;
}

function getSignId(longitude: number): number {
  return Math.floor(normalizeDeg(longitude) / 30) + 1;
}

function getSignName(signId: number): LocaleText {
  const rashi = RASHIS.find((r) => r.id === signId);
  return rashi?.name ?? { en: 'Unknown' };
}

// Sign → Element mapping (1-indexed sign IDs)
const SIGN_ELEMENT: Record<number, string> = {
  1: 'Fire', 2: 'Earth', 3: 'Air', 4: 'Water',
  5: 'Fire', 6: 'Earth', 7: 'Air', 8: 'Water',
  9: 'Fire', 10: 'Earth', 11: 'Air', 12: 'Water',
};
const ELEMENT_HI: Record<string, string> = { Fire: 'अग्नि', Earth: 'पृथ्वी', Air: 'वायु', Water: 'जल' };

function computeElementProfile(signIds: number[]): ElementProfile {
  const counts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  for (const id of signIds) {
    const el = SIGN_ELEMENT[id] || 'Fire';
    counts[el as keyof typeof counts]++;
  }
  const dominant = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0])[0];
  return { dominant, dominantHi: ELEMENT_HI[dominant] || dominant, fire: counts.Fire, earth: counts.Earth, air: counts.Air, water: counts.Water };
}

function computeElementContrast(planets: SignShiftPlanet[]): SignShiftData['elementContrast'] {
  // Only use planets 0-6 (Sun through Saturn) for element distribution
  const classicalPlanets = planets.filter(p => p.planetId <= 6);
  const tropicalProfile = computeElementProfile(classicalPlanets.map(p => p.tropicalSignId));
  const siderealProfile = computeElementProfile(classicalPlanets.map(p => p.siderealSignId));
  const shifted = tropicalProfile.dominant !== siderealProfile.dominant;
  const contrastLine: LocaleText = shifted
    ? {
        en: `Western astrology says you're a ${tropicalProfile.dominant} person. Vedic says you're actually ${siderealProfile.dominant}.`,
        hi: `पश्चिमी ज्योतिष कहता है आप ${tropicalProfile.dominantHi} व्यक्ति हैं। वैदिक कहता है आप वास्तव में ${siderealProfile.dominantHi} हैं।`,
      }
    : {
        en: `Both systems agree — you're a ${siderealProfile.dominant} person.`,
        hi: `दोनों प्रणालियाँ सहमत हैं — आप ${siderealProfile.dominantHi} व्यक्ति हैं।`,
      };
  return { tropical: tropicalProfile, sidereal: siderealProfile, shifted, contrastLine };
}

function generateHookLine(shiftCount: number): LocaleText {
  if (shiftCount === 0) {
    return {
      en: 'All 9 planets stay in the same sign in both systems!',
      hi: 'सभी 9 ग्रह दोनों प्रणालियों में एक ही राशि में हैं!',
    };
  }
  if (shiftCount === 9) {
    return {
      en: 'ALL 9 of your planets are in DIFFERENT signs!',
      hi: 'आपके सभी 9 ग्रह अलग-अलग राशियों में हैं!',
    };
  }
  return {
    en: `${shiftCount} of your 9 planets are in DIFFERENT signs!`,
    hi: `आपके 9 में से ${shiftCount} ग्रहों की राशि अलग है!`,
  };
}

// ── Engine (from KundaliData) ─────────────────────────────────────────────────

/**
 * Compute sign shift from existing KundaliData.
 * Tropical longitude = sidereal longitude + ayanamsha (simple addition).
 */
export function computeSignShift(kundali: KundaliData): SignShiftData {
  const ayanamsha = kundali.ayanamshaValue;

  const planets: SignShiftPlanet[] = kundali.planets.map((p: PlanetPosition) => {
    const siderealLong = normalizeDeg(p.longitude);
    const tropicalLong = normalizeDeg(siderealLong + ayanamsha);

    const siderealSignId = getSignId(siderealLong);
    const tropicalSignId = getSignId(tropicalLong);

    return {
      planetId: p.planet.id,
      planetName: p.planet.name,
      tropicalSign: getSignName(tropicalSignId),
      siderealSign: getSignName(siderealSignId),
      shifted: tropicalSignId !== siderealSignId,
      tropicalDeg: formatDegMin(tropicalLong),
      siderealDeg: formatDegMin(siderealLong),
      tropicalSignId,
      siderealSignId,
    };
  });

  const shiftCount = planets.filter((p) => p.shifted).length;

  return {
    planets,
    shiftCount,
    ayanamsha,
    hookLine: generateHookLine(shiftCount),
    elementContrast: computeElementContrast(planets),
    personName: kundali.birthData.name || '',
  };
}

// ── Engine (from ComparisonResult) ────────────────────────────────────────────

/**
 * Convert a ComparisonResult (from the comparison engine) into SignShiftData.
 */
export function comparisonToSignShift(
  result: ComparisonResult,
  personName: string = '',
): SignShiftData {
  const planets: SignShiftPlanet[] = result.planets.map((p) => ({
    planetId: p.id,
    planetName: p.name,
    tropicalSign: p.tropicalSignName,
    siderealSign: p.siderealSignName,
    shifted: p.isShifted,
    tropicalDeg: formatDegMin(p.tropicalLongitude),
    siderealDeg: formatDegMin(p.siderealLongitude),
    tropicalSignId: p.tropicalSign,
    siderealSignId: p.siderealSign,
  }));

  const shiftCount = planets.filter((p) => p.shifted).length;

  return {
    planets,
    shiftCount,
    ayanamsha: result.precessionData.currentAyanamsha,
    hookLine: generateHookLine(shiftCount),
    elementContrast: computeElementContrast(planets),
    personName,
  };
}

// ── Serialization (for URL params) ────────────────────────────────────────────

/**
 * Encode SignShiftData to a compact URL-safe string.
 * Format: name|ayanamsha|planet1_tropId_sidId|planet2_tropId_sidId|...
 */
export function encodeSignShiftParams(data: SignShiftData): string {
  const planetParts = data.planets.map(
    (p) => `${p.planetId}_${p.tropicalSignId}_${p.siderealSignId}_${p.tropicalDeg}_${p.siderealDeg}`
  );
  return `${encodeURIComponent(data.personName)}|${data.ayanamsha.toFixed(4)}|${planetParts.join(',')}`;
}

/**
 * Decode SignShiftData from URL params. Returns null if invalid.
 */
export function decodeSignShiftParams(encoded: string): SignShiftData | null {
  try {
    const parts = encoded.split('|');
    if (parts.length < 3) return null;

    const personName = decodeURIComponent(parts[0]);
    const ayanamsha = parseFloat(parts[1]);
    if (isNaN(ayanamsha)) return null;

    const planetStrs = parts[2].split(',');
    const planets: SignShiftPlanet[] = planetStrs.map((ps) => {
      const [pidStr, tropStr, sidStr, tropDeg, sidDeg] = ps.split('_');
      const pid = parseInt(pidStr, 10);
      const tropId = parseInt(tropStr, 10);
      const sidId = parseInt(sidStr, 10);

      // Planet name from RASHIS-adjacent GRAHAS — but we only need the id for lookup
      // We'll use a simple mapping here since we don't import GRAHAS to keep it light
      const planetNames: Record<number, LocaleText> = {
        0: { en: 'Sun', hi: 'सूर्य' },
        1: { en: 'Moon', hi: 'चन्द्र' },
        2: { en: 'Mars', hi: 'मंगल' },
        3: { en: 'Mercury', hi: 'बुध' },
        4: { en: 'Jupiter', hi: 'बृहस्पति' },
        5: { en: 'Venus', hi: 'शुक्र' },
        6: { en: 'Saturn', hi: 'शनि' },
        7: { en: 'Rahu', hi: 'राहु' },
        8: { en: 'Ketu', hi: 'केतु' },
      };

      return {
        planetId: pid,
        planetName: planetNames[pid] ?? { en: `Planet ${pid}` },
        tropicalSign: getSignName(tropId),
        siderealSign: getSignName(sidId),
        shifted: tropId !== sidId,
        tropicalDeg: tropDeg || '0\u00B000\'',
        siderealDeg: sidDeg || '0\u00B000\'',
        tropicalSignId: tropId,
        siderealSignId: sidId,
      };
    });

    const shiftCount = planets.filter((p) => p.shifted).length;

    return {
      planets,
      shiftCount,
      ayanamsha,
      hookLine: generateHookLine(shiftCount),
      elementContrast: computeElementContrast(planets),
      personName,
    };
  } catch {
    return null;
  }
}
