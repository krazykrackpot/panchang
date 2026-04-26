/**
 * Tropical vs Sidereal Comparison Engine
 *
 * Powers the "Global-Vibe" feature — a side-by-side view of Western (tropical)
 * and Vedic (sidereal) zodiac positions for all 9 planets.
 *
 * The comparison is simple math:
 *   tropical longitude  = what getPlanetaryPositions() returns (ecliptic, J2000 frame)
 *   sidereal longitude  = tropical - ayanamsha (currently ~24.2° Lahiri)
 *   isShifted           = true when the two sign numbers differ (getRashiNumber)
 *
 * Precession rate: ~50.3 arcsec/year = ~0.013972°/year (Lahiri / Chitrapaksha).
 * Ayanamsha was 0° around 285 AD (vernal equinox coincided with sidereal Aries 0°).
 */

import {
  getPlanetaryPositions,
  getAyanamsha,
  normalizeDeg,
  getRashiNumber,
  getNakshatraNumber,
  type AyanamshaType,
} from './astronomical';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import type { LocaleText } from '@/types/panchang';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PlanetComparison {
  /** Planet ID (0=Sun … 8=Ketu) */
  id: number;
  /** Multilingual planet name */
  name: LocaleText;
  /** Tropical (Western) ecliptic longitude in degrees [0, 360) */
  tropicalLongitude: number;
  /** Sidereal (Vedic) ecliptic longitude in degrees [0, 360) */
  siderealLongitude: number;
  /** Tropical zodiac sign number (1–12) */
  tropicalSign: number;
  /** Sidereal zodiac sign number (1–12) */
  siderealSign: number;
  /** Multilingual tropical sign name */
  tropicalSignName: LocaleText;
  /** Multilingual sidereal sign name */
  siderealSignName: LocaleText;
  /** True when tropical and sidereal sign differ — the "reveal moment" */
  isShifted: boolean;
  /** Nakshatra data for Sun (id=0) and Moon (id=1); undefined for other planets */
  nakshatra?: {
    number: number;   // 1–27
    name: LocaleText;
  };
}

export interface PrecessionData {
  /** Current ayanamsha value in degrees */
  currentAyanamsha: number;
  /** Year when ayanamsha was last ~0° (vernal equinox coincided with sidereal Aries 0°) */
  zeroYear: number;
  /** Approximate precession rate in degrees per year */
  yearlyRate: number;
  /** The ayanamsha system used */
  ayanamshaType: AyanamshaType;
}

export interface ComparisonResult {
  /** One entry per planet, in planet ID order (0=Sun … 8=Ketu) */
  planets: PlanetComparison[];
  /** How many planets shifted sign between the two systems */
  shiftedCount: number;
  /** Viral one-liner for sharing — non-empty */
  hookLine: string;
  /** Precession data for the interactive "time slider" */
  precessionData: PrecessionData;
}

// ── Constants ─────────────────────────────────────────────────────────────────

/** Lahiri precession rate in degrees per year (~50.3 arcsec/yr) */
const LAHIRI_YEARLY_RATE = 50.3 / 3600; // ≈ 0.013972°/year

/**
 * Approximate year when Lahiri ayanamsha was 0°.
 * Using the Meeus polynomial: 23.85306 + 1.39722*t + ... at t=0 (J2000.0 = 2000.0),
 * ayanamsha ≈ 23.85°. Extrapolating back: 23.85 / (1.39722/100) ≈ 1706 centuries
 * before 2000 → year ~285 AD.
 */
const LAHIRI_ZERO_YEAR = 285;

// Planet names in Western / tropical convention — used in the hook line
const WESTERN_SIGN_NAMES: Record<number, string> = {
  1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer', 5: 'Leo', 6: 'Virgo',
  7: 'Libra', 8: 'Scorpio', 9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces',
};

// ── Engine ────────────────────────────────────────────────────────────────────

/**
 * Compute tropical vs sidereal comparison for all 9 Jyotish planets.
 *
 * @param jd         Julian Day number (UT)
 * @param ayanamshaType  Ayanamsha system (default: 'lahiri')
 * @returns ComparisonResult
 */
export function computeComparison(
  jd: number,
  ayanamshaType: AyanamshaType = 'lahiri',
): ComparisonResult {
  // Compute ayanamsha once (single call for all 9 planets)
  const ayanamsha = getAyanamsha(jd, ayanamshaType);

  // Tropical positions from the ephemeris engine
  const rawPositions = getPlanetaryPositions(jd);

  // Build planet comparison entries
  const planets: PlanetComparison[] = rawPositions.map((p) => {
    const tropicalLong = normalizeDeg(p.longitude);
    const siderealLong = normalizeDeg(tropicalLong - ayanamsha);

    const tropicalSign = getRashiNumber(tropicalLong);
    const siderealSign = getRashiNumber(siderealLong);

    // RASHIS array is 0-indexed internally but IDs are 1-based (id 1 = index 0)
    const tropicalSignObj = RASHIS[tropicalSign - 1];
    const siderealSignObj = RASHIS[siderealSign - 1];

    const isShifted = tropicalSign !== siderealSign;

    // Nakshatra only for Sun (id=0) and Moon (id=1)
    let nakshatra: PlanetComparison['nakshatra'];
    if (p.id === 0 || p.id === 1) {
      const nakshatraNum = getNakshatraNumber(siderealLong);
      // NAKSHATRAS array is 0-indexed, IDs are 1-based
      const nakshatraObj = NAKSHATRAS[nakshatraNum - 1];
      nakshatra = {
        number: nakshatraNum,
        name: nakshatraObj.name,
      };
    }

    const grahaObj = GRAHAS[p.id];

    return {
      id: p.id,
      name: grahaObj.name,
      tropicalLongitude: tropicalLong,
      siderealLongitude: siderealLong,
      tropicalSign,
      siderealSign,
      tropicalSignName: tropicalSignObj.name,
      siderealSignName: siderealSignObj.name,
      isShifted,
      nakshatra,
    };
  });

  const shiftedCount = planets.filter((p) => p.isShifted).length;

  // Generate hook line — viral sentence for social sharing
  const hookLine = generateHookLine(planets, shiftedCount);

  // Precession data for the interactive slider
  const precessionData: PrecessionData = {
    currentAyanamsha: ayanamsha,
    zeroYear: LAHIRI_ZERO_YEAR,
    yearlyRate: LAHIRI_YEARLY_RATE,
    ayanamshaType,
  };

  return { planets, shiftedCount, hookLine, precessionData };
}

// ── Hook Line Generator ───────────────────────────────────────────────────────

/**
 * Generate a viral "hook line" sentence for the comparison result.
 *
 * Strategy:
 *  - If Sun and/or Moon shifted: lead with the most relatable planets.
 *  - If many planets shifted: "Your entire chart is…"
 *  - Fall back to a general precession fact if nothing shifted.
 */
function generateHookLine(planets: PlanetComparison[], shiftedCount: number): string {
  if (shiftedCount === 0) {
    // Edge case: no planets shifted (very rare — would require ayanamsha near a boundary)
    return `All your planets are in the same signs in both Western and Vedic astrology — you're a rare cosmic alignment.`;
  }

  const sun = planets.find((p) => p.id === 0);
  const moon = planets.find((p) => p.id === 1);

  const sunShifted = sun?.isShifted ?? false;
  const moonShifted = moon?.isShifted ?? false;

  if (shiftedCount >= 7) {
    return `Surprise: almost your entire birth chart shifts when you switch from Western to Vedic astrology — ${shiftedCount} out of 9 planets land in different signs.`;
  }

  if (sunShifted && moonShifted) {
    const wSun = WESTERN_SIGN_NAMES[sun!.tropicalSign];
    const vSun = sun!.siderealSignName.en;
    const vMoon = moon!.siderealSignName.en;
    return `You think you're a ${wSun}? In Vedic astrology your Sun is actually ${vSun} — and your Moon shifts too, landing in ${vMoon}.`;
  }

  if (sunShifted && sun) {
    const wSun = WESTERN_SIGN_NAMES[sun.tropicalSign];
    const vSun = sun.siderealSignName.en;
    return `You call yourself a ${wSun}, but the ancient Vedic sky says your Sun is actually in ${vSun} — ${shiftedCount} planet${shiftedCount > 1 ? 's' : ''} shift sign when you look through a 24° different lens.`;
  }

  if (moonShifted && moon) {
    const vMoon = moon.siderealSignName.en;
    return `Your Moon sign shifts to ${vMoon} in Vedic astrology — along with ${shiftedCount - 1} other planet${shiftedCount > 2 ? 's' : ''} — because a 24° precession gap separates the two zodiac systems.`;
  }

  // Generic — shifted planets but not Sun or Moon
  const shiftedNames = planets
    .filter((p) => p.isShifted)
    .slice(0, 3)
    .map((p) => p.name.en)
    .join(', ');
  return `${shiftedCount} of your planets — ${shiftedNames} — land in completely different signs in Vedic astrology due to a ~24° precession shift since the zodiac was first mapped.`;
}
