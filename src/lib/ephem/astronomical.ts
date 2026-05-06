import type { LocaleText } from '@/types/panchang';
/**
 * Core astronomical calculation functions for Vedic astrology (Jyotish).
 *
 * This module provides the foundational astronomical computations needed by
 * the panchang (daily almanac) and kundali (birth chart) engines:
 *   - Solar and lunar tropical longitudes
 *   - Ayanamsha (precession correction) for sidereal conversion
 *   - Panchanga elements: tithi, yoga, karana, nakshatra
 *   - Sunrise/sunset for any geographic location
 *   - Planetary positions for all 9 Vedic grahas (Sun through Ketu)
 *   - Hindu calendar elements: masa, ritu, samvatsara, ayana
 *
 * DUAL-ENGINE ARCHITECTURE:
 *   When Swiss Ephemeris (sweph) is available, it provides sub-arcsecond
 *   accuracy for all computations. When unavailable, the module falls back
 *   to algorithms from Jean Meeus's "Astronomical Algorithms" (2nd ed., 1998).
 *   Meeus accuracy: Sun ±0.01°, Moon ±0.5°, planets ±1-5°. These limits are
 *   acceptable for panchang (daily almanac) use but insufficient for precise
 *   eclipse prediction or sub-degree planetary work. See individual function
 *   comments for specific accuracy bounds.
 *
 * COORDINATE CONVENTIONS:
 *   - All longitudes are ecliptic, measured eastward from the vernal equinox (tropical)
 *     or from the sidereal Aries point (sidereal, after ayanamsha subtraction).
 *   - Degrees use the range [0°, 360°).
 *   - Julian Day numbers are in Universal Time (UT), not local time.
 *   - Rashi IDs are 1-based: 1=Aries (Mesha) through 12=Pisces (Meena).
 *   - Nakshatra IDs are 1-based: 1=Ashwini through 27=Revati.
 *   - Planet IDs are 0-based: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *     5=Venus, 6=Saturn, 7=Rahu, 8=Ketu.
 *   - Weekdays from JD: Math.floor(jd + 1.5) % 7 gives 0=Sunday (Lesson O).
 *
 * CLASSICAL TEXT REFERENCES:
 *   - Surya Siddhanta (SS) — ancient Indian astronomical text
 *   - BPHS (Brihat Parashara Hora Shastra) — foundational Jyotish text
 *   - Meeus — Jean Meeus, "Astronomical Algorithms", 2nd ed., Willmann-Bell, 1998
 *   - IAE — Indian Astronomical Ephemeris (Government of India)
 */

import {
  isSwissEphAvailable,
  swissAllPlanets,
  swissAyanamsha,
  swissJulDay,
  swissPlanetLongitude,
  swissSunrise,
  swissSunset,
} from './swiss-ephemeris';
import { RAHU_ORDER } from '@/lib/constants/inauspicious-orders';

/**
 * Convert a Gregorian calendar date to Julian Day Number (JD).
 *
 * The Julian Day is a continuous day count used in astronomy since
 * Joseph Scaliger (1583). JD 0.0 = 1 January 4713 BCE, 12:00 UT (Julian proleptic).
 * JD 2451545.0 = 1 January 2000, 12:00 UT (the J2000.0 epoch).
 *
 * Algorithm: Meeus Ch.7, valid for all Gregorian dates (after 15 Oct 1582).
 * The Gregorian correction (variables A, B) accounts for the 10-day gap
 * introduced by Pope Gregory XIII and the modified leap year rule.
 *
 * @param year  - Gregorian year (negative for BCE: -4712 = 4713 BCE)
 * @param month - Month 1-12
 * @param day   - Day of month (may include fractional days)
 * @param hour  - Hour in UT (0-24, may be fractional). Default 0 = midnight UT.
 * @returns Julian Day Number (fractional). Integer part = noon UT.
 */
export function dateToJD(year: number, month: number, day: number, hour: number = 0): number {
  // Meeus convention: Jan/Feb are treated as months 13/14 of the previous year.
  // This simplifies the leap year calculation in the main formula.
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  // Gregorian correction: A = century, B = leap century adjustment
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  // The constant 4716 shifts the epoch to 4713 BCE; 1524.5 adjusts to midnight start.
  // hour/24 converts UT hours to fractional days.
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + hour / 24 + B - 1524.5;
}

// JD to calendar date
// NOTE: Uses Date.UTC to avoid local timezone bias. JD is UT-based, so the
// resulting Date should represent UT, not the server's local time.
// HISTORICAL BUG (now fixed): used `new Date(year, month-1, day)` which
// created a local-timezone Date. On a server in UTC+2, JD noon UT on Apr 24
// would produce a Date showing Apr 23 22:00 UTC — correct getDate() by
// accident of the local timezone but wrong .toISOString() output.
export function jdToDate(jd: number): Date {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e) + f;
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;

  const intDay = Math.floor(day);
  const fracHours = (day - intDay) * 24;
  const hours = Math.floor(fracHours);
  const minutes = Math.floor((fracHours - hours) * 60);
  const seconds = Math.floor(((fracHours - hours) * 60 - minutes) * 60);
  return new Date(Date.UTC(year, month - 1, intDay, hours, minutes, seconds));
}

/**
 * Normalize an angle to the range [0°, 360°).
 * Handles negative values and values exceeding 360° by wrapping.
 */
export function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Convert degrees to radians. */
export function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

/** Convert radians to degrees. */
export function toDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

/**
 * Compute Julian centuries from the J2000.0 epoch (JD 2451545.0 = 1 Jan 2000, 12h UT).
 *
 * This is the standard time argument "T" used in Meeus's polynomial expressions
 * for planetary positions, precession, nutation, etc. One Julian century = 36525 days.
 *
 * @param jd - Julian Day number in UT
 * @returns Fractional Julian centuries since J2000.0
 */
function T(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

/**
 * Sun's tropical longitude.
 * Swiss Ephemeris when available (~0.001° accuracy), Meeus fallback (~0.01°).
 */
export function sunLongitude(jd: number): number {
  if (isSwissEphAvailable()) {
    return swissPlanetLongitude(jd, 0).longitude;
  }
  return _meesusSunLongitude(jd);
}

/**
 * Sun's apparent tropical longitude via Meeus Ch.25 (low-precision solar coordinates).
 *
 * ALGORITHM:
 *   1. Compute geometric mean longitude L0 and mean anomaly M of the Sun.
 *   2. Apply the equation of centre C (elliptical orbit correction) using
 *      the first 3 terms of the Kepler series.
 *   3. Add C to L0 to get the Sun's true geometric longitude.
 *   4. Apply the nutation + aberration correction (~-0.00569° nutation,
 *      ~-0.00478° × sin(Ω) aberration) to get apparent longitude.
 *
 * Accuracy: ±0.01° (36 arcseconds) — sufficient for panchang tithi/yoga
 * computation where the Sun moves ~1°/day. Not sufficient for eclipse
 * prediction (which needs ~1 arcsecond).
 *
 * @param jd - Julian Day in UT
 * @returns Apparent tropical longitude in degrees [0, 360)
 */
function _meesusSunLongitude(jd: number): number {
  const t = T(jd);
  // L0: geometric mean longitude of the Sun, referred to the mean equinox of date
  const L0 = normalizeDeg(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  // M: mean anomaly — angle from perihelion along the orbit
  const M = normalizeDeg(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const Mrad = toRad(M);
  // C: equation of centre — correction for Earth's elliptical orbit (eccentricity ~0.017)
  // The dominant term (1.9146°) reflects the maximum difference between true and mean anomaly.
  const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);
  // True geometric longitude (still needs nutation + aberration)
  const sunTrue = normalizeDeg(L0 + C);
  // Ω: longitude of the ascending node of the Moon's orbit — used for nutation
  const omega = 125.04 - 1934.136 * t;
  // Apparent longitude: correct for nutation in longitude (-0.00569°) and aberration
  // Aberration (-0.00478° × sin Ω) accounts for the finite speed of light.
  const apparent = sunTrue - 0.00569 - 0.00478 * Math.sin(toRad(omega));
  return normalizeDeg(apparent);
}

/**
 * Moon's tropical longitude.
 * Swiss Ephemeris when available (~0.001°), Meeus fallback (~0.5°).
 */
export function moonLongitude(jd: number): number {
  if (isSwissEphAvailable()) {
    return swissPlanetLongitude(jd, 1).longitude;
  }
  return _meeusMoonLongitude(jd);
}

/**
 * Meeus simplified planetary formulas — accuracy limits:
 *   Sun: ±0.01°  |  Moon: ±0.5°  |  Inner planets (Venus, Mars): ±1°
 *   Outer planets (Jupiter, Saturn): ±1-3°  |  Mercury: ±5° near greatest elongation
 * For production accuracy, Swiss Ephemeris is recommended.
 * When Swiss Ephemeris is available (isSwissEphAvailable()), these fallbacks are not used.
 */
/**
 * Moon's apparent tropical longitude via Meeus Ch.47 (high-precision lunar theory).
 *
 * This implements the ELP-2000/82 simplified theory with the 60 most significant
 * periodic terms from Meeus Table 47.A, plus 3 additive corrections (A1 for Venus,
 * A2 for Jupiter, A3 for a long-period term).
 *
 * ALGORITHM:
 *   1. Compute 4 fundamental arguments: Lp (mean longitude), D (mean elongation),
 *      M (Sun's mean anomaly), Mp (Moon's mean anomaly), F (argument of latitude).
 *   2. Compute Earth's orbital eccentricity E (needed to correct terms involving M).
 *   3. Sum 60 periodic terms: each is sin(linear combination of D,M,Mp,F) × coefficient.
 *   4. Add planetary corrections A1 (Venus perturbation), A2 (Jupiter), A3.
 *   5. Convert sum from 10⁻⁶ degrees to degrees and add to mean longitude.
 *
 * Accuracy: ±0.5° (1800 arcseconds). The full ELP-2000/82 has ~500 terms and
 * achieves ~10 arcsecond accuracy, but the 60-term truncation is adequate for
 * panchang nakshatra determination where each nakshatra spans 13°20'.
 *
 * @param jd - Julian Day in UT
 * @returns Apparent tropical longitude in degrees [0, 360)
 */
function _meeusMoonLongitude(jd: number): number {
  const t = T(jd);

  // ── Fundamental arguments (Meeus Ch.47, degrees) ──
  // Lp: Moon's mean longitude (referred to mean equinox of date)
  const Lp = normalizeDeg(218.3164477 + 481267.88123421 * t
    - 0.0015786 * t * t + t * t * t / 538841 - t * t * t * t / 65194000);
  // D: Moon's mean elongation from the Sun
  const D = normalizeDeg(297.8501921 + 445267.1114034 * t
    - 0.0018819 * t * t + t * t * t / 545868 - t * t * t * t / 113065000);
  // M: Sun's mean anomaly (same definition as in solar longitude)
  const M = normalizeDeg(357.5291092 + 35999.0502909 * t
    - 0.0001536 * t * t + t * t * t / 24490000);
  // Mp: Moon's mean anomaly — angular distance from lunar perigee
  const Mp = normalizeDeg(134.9633964 + 477198.8675055 * t
    + 0.0087414 * t * t + t * t * t / 69699 - t * t * t * t / 14712000);
  // F: Moon's argument of latitude — angular distance from ascending node
  const F = normalizeDeg(93.2720950 + 483202.0175233 * t
    - 0.0036539 * t * t - t * t * t / 3526000 + t * t * t * t / 863310000);

  // E: eccentricity of Earth's orbit — decreasing slowly over millennia.
  // Terms involving the Sun's anomaly M are multiplied by E (or E² for |M|=2)
  // because the Sun's gravitational perturbation on the Moon depends on
  // Earth's orbital eccentricity. (Meeus Ch.47)
  const E = 1 - 0.002516 * t - 0.0000074 * t * t;
  const E2 = E * E;

  const dr = toRad(D), mr = toRad(M), mpr = toRad(Mp), fr = toRad(F);

  // Table 47.A — all 60 longitude terms [D, M, Mp, F, coeff (1e-6 deg)]
  // Each row: [D_mult, M_mult, Mp_mult, F_mult, sinCoeff]
  const LR: [number, number, number, number, number][] = [
    [0,0,1,0,6288774], [2,0,-1,0,1274027], [2,0,0,0,658314], [0,0,2,0,213618],
    [0,1,0,0,-185116], [0,0,0,2,-114332], [2,0,-2,0,58793], [2,-1,-1,0,57066],
    [2,0,1,0,53322], [2,-1,0,0,45758], [0,1,-1,0,-40923], [1,0,0,0,-34720],
    [0,1,1,0,-30383], [2,0,0,-2,15327], [0,0,1,2,-12528], [0,0,1,-2,10980],
    [4,0,-1,0,10675], [0,0,3,0,10034], [4,0,-2,0,8548], [2,1,-1,0,-7888],
    [2,1,0,0,-6766], [1,0,-1,0,-5163], [1,1,0,0,4987], [2,-1,1,0,4036],
    [2,0,2,0,3994], [4,0,0,0,3861], [2,0,-3,0,3665], [0,1,-2,0,-2689],
    [2,0,-1,2,-2602], [2,-1,-2,0,2390], [1,0,1,0,-2348], [2,-2,0,0,2236],
    [0,1,2,0,-2120], [0,2,0,0,-2069], [2,-2,-1,0,2048], [2,0,1,-2,-1773],
    [2,0,0,2,-1595], [4,-1,-1,0,1215], [0,0,2,2,-1110], [3,0,-1,0,-892],
    [2,1,1,0,-810], [4,-1,-2,0,759], [0,2,-1,0,-713], [2,2,-1,0,-700],
    [2,1,-2,0,691], [2,-1,0,-2,596], [4,0,1,0,549], [0,0,4,0,537],
    [4,-1,0,0,520], [1,0,-2,0,-487], [2,1,0,-2,-399], [0,0,2,-2,-381],
    [1,1,1,0,351], [3,0,-2,0,-340], [4,0,-3,0,330], [2,-1,2,0,327],
    [0,2,1,0,-323], [1,1,-1,0,299], [2,0,3,0,294], [2,0,-1,-2,0],
  ];

  let sumL = 0;
  for (const [cd, cm, cmp, cf, sl] of LR) {
    const arg = cd * dr + cm * mr + cmp * mpr + cf * fr;
    let coeff = sl;
    // Apply eccentricity correction for terms involving Sun's anomaly
    const absM = Math.abs(cm);
    if (absM === 1) coeff *= E;
    else if (absM === 2) coeff *= E2;
    sumL += coeff * Math.sin(arg);
  }

  // Additional corrections for planetary perturbations not captured by the main table.
  // A1: Venus's gravitational perturbation on the Moon (~3958 × 10⁻⁶ degrees max)
  // A2: Jupiter's perturbation (~1962 × 10⁻⁶ degrees max)
  // A3: Long-period term related to the Moon's nodal precession
  const A1 = toRad(normalizeDeg(119.75 + 131.849 * t));  // Venus
  const A2 = toRad(normalizeDeg(53.09 + 479264.290 * t)); // Jupiter
  const A3 = toRad(normalizeDeg(313.45 + 481266.484 * t));

  sumL += 3958 * Math.sin(A1)
        + 1962 * Math.sin(toRad(Lp) - fr)
        + 318 * Math.sin(A2);

  // Convert from 1e-6 degrees to degrees
  const longitude = Lp + sumL / 1000000;

  return normalizeDeg(longitude);
}

/**
 * Lahiri Ayanamsha — accurate polynomial (Lahiri/Chitrapaksha)
 * Based on IAU precession with Spica (Chitra) at 180° sidereal.
 * Accuracy: ~1 arcsecond for dates 1900-2100.
 */
export function lahiriAyanamsha(jd: number): number {
  if (isSwissEphAvailable()) {
    return swissAyanamsha(jd);
  }
  return _meeeusLahiriAyanamsha(jd);
}

/**
 * Polynomial fit for Lahiri (Chitrapaksha) ayanamsha.
 *
 * Based on IAU precession with the fixed star Spica (Chitra) anchored at
 * exactly 180° sidereal longitude (0° Libra). This is the official standard
 * adopted by the Indian government for all almanacs (panchangs).
 *
 * The polynomial coefficients are derived from the general precession in
 * longitude (~50.29 arcsec/year) with the Lahiri epoch offset.
 * At J2000.0 (t=0): ayanamsha ≈ 23.853°.
 *
 * Accuracy: ±1 arcsecond for dates 1900-2100. Degrades outside this range
 * due to higher-order precession terms and nutation being omitted.
 *
 * @param jd - Julian Day in UT
 * @returns Ayanamsha in degrees
 */
function _meeeusLahiriAyanamsha(jd: number): number {
  // t = Julian centuries from J2000.0
  const t = (jd - 2451545.0) / 36525.0;
  // Polynomial: 23.853° + 1.397°/century + higher-order terms
  // The linear rate ~1.397°/century ≈ 50.29"/year matches IAU precession.
  return 23.85306 + 1.39722 * t + 0.00018 * t * t - 0.000005 * t * t * t;
}

export type AyanamshaType = 'lahiri' | 'true_chitra' | 'true_revati' | 'raman' | 'kp' | 'bv_raman' | 'yukteshwar' | 'jn_bhasin' | 'fagan_bradley' | 'true_pushya' | 'galactic_center';

/**
 * Calculate ayanamsha for different systems.
 * Uses Swiss Ephemeris when available (sub-arcsecond, any date).
 * Falls back to polynomial fits for Meeus-only environments.
 *
 * Systems:
 *   lahiri          — Chitrapaksha (Indian govt standard, Spica at 180°)
 *   true_chitra     — True Chitrapaksha (tracks Spica's ACTUAL current position)
 *   true_revati     — True Revati (zeta Piscium at 0° Aries)
 *   true_pushya     — True Pushya (delta Cancri anchored)
 *   kp              — Krishnamurti (~6 arcmin from Lahiri)
 *   raman / bv_raman — BV Raman (galactic center theory)
 *   yukteshwar      — Sri Yukteshwar (Holy Science)
 *   jn_bhasin       — JN Bhasin
 *   fagan_bradley   — Western sidereal (Fagan-Bradley)
 *   galactic_center — Galactic center at 0° Sagittarius
 */
export function getAyanamsha(jd: number, type: AyanamshaType = 'lahiri'): number {
  // Swiss Ephemeris: use for ALL systems when available (sub-arcsecond accuracy)
  if (isSwissEphAvailable()) {
    return swissAyanamsha(jd, type);
  }

  // Meeus polynomial fallback (±1 arcsecond for 1900-2100, degrades outside)
  const t = (jd - 2451545.0) / 36525.0;
  switch (type) {
    case 'lahiri':
    case 'true_chitra': // True Chitra ~= Lahiri within 0.03° (polynomial can't distinguish)
      return _meeeusLahiriAyanamsha(jd);
    case 'kp':
      return 23.76056 + 1.39722 * t + 0.00018 * t * t;
    case 'raman':
    case 'bv_raman':
      return 22.37778 + 1.38250 * t + 0.00015 * t * t;
    case 'yukteshwar':
      return 21.76667 + 1.38472 * t;
    case 'jn_bhasin':
      return 23.15167 + 1.39722 * t + 0.00018 * t * t;
    case 'fagan_bradley':
      return 24.04222 + 1.39722 * t + 0.00018 * t * t;
    case 'true_revati':
    case 'true_pushya':
    case 'galactic_center':
      // These need Swiss Eph for accuracy — fallback to Lahiri as approximation.
      // Warn so developers/users know the system they requested is not being used.
      console.warn(`[ayanamsha] ${type} requested but Swiss Ephemeris unavailable — falling back to Lahiri approximation`);
      return _meeeusLahiriAyanamsha(jd);
    default:
      return _meeeusLahiriAyanamsha(jd);
  }
}

export const AYANAMSHA_OPTIONS: { value: AyanamshaType; label: LocaleText }[] = [
  { value: 'lahiri', label: { en: 'Lahiri (Chitrapaksha)', hi: 'लाहिरी (चित्रपक्ष)', sa: 'लाहिरी (चित्रपक्षः)' } },
  { value: 'kp', label: { en: 'KP (Krishnamurti)', hi: 'केपी (कृष्णमूर्ति)', sa: 'केपी (कृष्णमूर्तिः)' } },
  { value: 'raman', label: { en: 'CV Raman', hi: 'सी.वी. रमन', sa: 'सी.वी. रमणः' } },
  { value: 'bv_raman', label: { en: 'BV Raman', hi: 'बी.वी. रमन', sa: 'बी.वी. रमणः' } },
  { value: 'yukteshwar', label: { en: 'Sri Yukteshwar', hi: 'श्री युक्तेश्वर', sa: 'श्री युक्तेश्वरः' } },
  { value: 'jn_bhasin', label: { en: 'JN Bhasin', hi: 'जे.एन. भसीन', sa: 'जे.एन. भसीनः' } },
];

/**
 * Convert tropical longitude to sidereal.
 *
 * @param tropicalLong - Tropical ecliptic longitude in degrees
 * @param jd - Julian Day number
 * @param ayanamshaValue - Optional pre-computed ayanamsha in degrees. When provided,
 *   used instead of the default Lahiri value, so callers with a user-selected
 *   ayanamsha (KP, Raman, etc.) get consistent results. Defaults to Lahiri
 *   (Indian government standard), which is the traditional choice for panchang
 *   elements (tithi, nakshatra, yoga).
 */
export function toSidereal(tropicalLong: number, jd: number, ayanamshaValue?: number): number {
  const aya = ayanamshaValue ?? lahiriAyanamsha(jd);
  return normalizeDeg(tropicalLong - aya);
}

/**
 * Determine the rashi (zodiac sign) from sidereal longitude.
 * Each rashi spans exactly 30° of the ecliptic.
 * 1=Mesha (Aries), 2=Vrishabha (Taurus), ..., 12=Meena (Pisces).
 *
 * @param sidLong - Sidereal longitude in degrees [0, 360)
 * @returns Rashi number 1-12
 */
export function getRashiNumber(sidLong: number): number {
  return Math.floor(sidLong / 30) + 1;
}

/**
 * Determine the nakshatra from sidereal longitude.
 * The 27 nakshatras divide the ecliptic into equal arcs of 13°20' (360°/27).
 * This equal division is the standard Vedic system (as opposed to the
 * unequal-star-span system sometimes used in Kerala tradition).
 *
 * @param sidLong - Sidereal longitude in degrees [0, 360)
 * @returns Nakshatra number 1-27 (1=Ashwini, ..., 27=Revati)
 */
export function getNakshatraNumber(sidLong: number): number {
  return Math.floor(sidLong / (360 / 27)) + 1;
}

/**
 * Determine the pada (quarter) within the current nakshatra.
 * Each nakshatra is divided into 4 equal padas of 3°20' each.
 * Padas are important for:
 *   - Navamsha (D9) sign determination (each pada maps to one navamsha)
 *   - Baby name syllable selection (each pada has assigned syllables)
 *   - Dasha balance calculation (pada position = fraction elapsed)
 *
 * @param sidLong - Sidereal longitude in degrees [0, 360)
 * @returns Pada number 1-4
 */
export function getNakshatraPada(sidLong: number): number {
  const nakshatraSpan = 360 / 27; // 13.333... degrees
  const posInNakshatra = sidLong % nakshatraSpan;
  return Math.floor(posInNakshatra / (nakshatraSpan / 4)) + 1;
}

/**
 * Calculate the current tithi at a given Julian Day.
 *
 * A tithi is a lunar day — 1/30th of a synodic month (new moon to new moon).
 * It is defined as each 12° increment of the Moon-Sun elongation:
 *   Tithi = floor((Moon_sid - Sun_sid) / 12°) + 1
 *
 * The 30 tithis are divided into two pakshas:
 *   Shukla Paksha (waxing): tithis 1-15 (Pratipada to Purnima)
 *   Krishna Paksha (waning): tithis 16-30 (Pratipada to Amavasya)
 *
 * Tithi duration varies from ~19 to ~26 hours because the Moon's orbital
 * speed is not constant (elliptical orbit). A tithi that starts and ends
 * within one sunrise-to-sunrise day without being active at either sunrise
 * is called a kshaya (omitted) tithi. A tithi spanning two sunrises is
 * called vriddhi (adhika/doubled).
 *
 * Classical source: Surya Siddhanta Ch.14; BPHS Ch.3.
 *
 * @param jd - Julian Day in UT
 * @returns Object with:
 *   - number: tithi 1-30
 *   - degree: raw Moon-Sun elongation in degrees [0, 360)
 */
export function calculateTithi(jd: number): { number: number; degree: number } {
  const sunSid = toSidereal(sunLongitude(jd), jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);
  // Moon-Sun elongation: 0° at new moon, 180° at full moon
  const diff = normalizeDeg(moonSid - sunSid);
  const tithiNum = Math.floor(diff / 12) + 1;
  return { number: tithiNum, degree: diff };
}

/**
 * Calculate Yoga (1-27)
 * Yoga = (Sun_sidereal + Moon_sidereal) / (360/27)
 *
 * @param jd Julian Day
 * @param ayanamshaValue Optional pre-computed ayanamsha in degrees. When provided,
 *   used instead of the hardcoded Lahiri value, so callers with a user-selected
 *   ayanamsha (KP, Raman, etc.) get consistent results.  Defaults to Lahiri.
 */
export function calculateYoga(jd: number, ayanamshaValue?: number): number {
  const aya = ayanamshaValue ?? lahiriAyanamsha(jd);
  const sunSid = normalizeDeg(sunLongitude(jd) - aya);
  const moonSid = normalizeDeg(moonLongitude(jd) - aya);
  const sum = normalizeDeg(sunSid + moonSid);
  return Math.floor(sum / (360 / 27)) + 1;
}

/**
 * Calculate the current karana at a given Julian Day.
 *
 * A karana is half a tithi — each 6° increment of Moon-Sun elongation.
 * There are 60 karanas in a lunar month (2 per tithi × 30 tithis).
 *
 * The 11 karana types follow a specific pattern (Surya Siddhanta Ch.14):
 *   - 4 sthira (fixed) karanas appear only once per month:
 *     Kimstughna(11) — first half of Shukla Pratipada
 *     Shakuni(8), Chatushpada(9), Naga(10) — last 3 half-tithis of Krishna Paksha
 *   - 7 chara (movable) karanas cycle through the remaining 56 half-tithis:
 *     Bava(1), Balava(2), Kaulava(3), Taitila(4), Garaja(5), Vanija(6), Vishti/Bhadra(7)
 *
 * Vishti (Bhadra) karana (ID 7) is considered inauspicious for muhurta selection.
 * The sthira karanas Shakuni, Chatushpada, and Naga are also inauspicious (Lesson BB).
 *
 * @param jd - Julian Day in UT
 * @returns Karana number 1-11
 */
export function calculateKarana(jd: number): number {
  const { degree } = calculateTithi(jd);
  // karanaIndex: 0-59, each representing a 6° arc of elongation
  const karanaIndex = Math.floor(degree / 6);
  // Map to the 11 karanas (7 chara + 4 sthira, cycling pattern)
  if (karanaIndex === 0) return 11; // Kimstughna — first half of Shukla Pratipada (special position)
  // Last 3 fixed karanas: Shakuni(8), Chatushpada(9), Naga(10) — 1-based IDs
  // These occupy indices 57, 58, 59 (second half of Krishna Chaturdashi + Amavasya)
  if (karanaIndex >= 57) return [8, 9, 10][Math.min(karanaIndex - 57, 2)];
  // The 7 chara karanas cycle through indices 1-56 (56 = 7 × 8 complete cycles)
  return ((karanaIndex - 1) % 7) + 1; // Chara karanas cycle
}

/**
 * Compute approximate sunrise time for a geographic location.
 *
 * ALGORITHM (Meeus Ch.15 + EoT correction):
 *   1. Compute the Sun's declination from its ecliptic longitude and obliquity.
 *   2. Solve the sunrise hour angle H from the spherical trigonometry formula:
 *        cos(H) = (sin(-0.8333°) - sin(lat) × sin(decl)) / (cos(lat) × cos(decl))
 *      where -0.8333° accounts for atmospheric refraction (34') + solar semidiameter (16').
 *   3. Compute the Equation of Time (EoT) to convert mean solar time to apparent solar time.
 *      The EoT arises from two effects: (a) Earth's orbital eccentricity and (b) the
 *      obliquity of the ecliptic. Maximum deviation is ~16 minutes (early November).
 *   4. Solar noon UT = (720 - 4×longitude - EoT) / 60. Sunrise = noon - H/15.
 *
 * Returns null at polar latitudes when the Sun doesn't rise (perpetual night).
 *
 * Accuracy: ±2 minutes for latitudes below 65°. Swiss Ephemeris path achieves ±10 seconds.
 *
 * @param jd  - Julian Day number (used to determine the date)
 * @param lat - Geographic latitude in degrees (positive = North)
 * @param lng - Geographic longitude in degrees (positive = East)
 * @returns UT decimal hours from midnight (0-24), or null if Sun doesn't rise
 */
export function approximateSunrise(jd: number, lat: number, lng: number): number | null {
  if (isSwissEphAvailable()) {
    return swissSunrise(jd, lat, lng);
  }
  // Meeus improved: actual obliquity + EoT correction
  const T = (jd - 2451545.0) / 36525;
  // Mean obliquity of the ecliptic (Meeus Ch.22) — the tilt of Earth's axis
  const obliquity = 23.4393 - 0.0130 * T;
  const sunLong = _meesusSunLongitude(jd);
  // Sun's declination: the angular distance north/south of the celestial equator
  const decl = toDeg(Math.asin(Math.sin(toRad(obliquity)) * Math.sin(toRad(sunLong))));

  // Hour angle at sunrise: how far before solar noon the Sun crosses the horizon.
  // -0.8333° = standard altitude for the centre of the Sun at apparent sunrise,
  // accounting for atmospheric refraction (~34 arcmin) and solar semidiameter (~16 arcmin).
  const cosH = (Math.sin(toRad(-0.8333)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl)))
    / (Math.cos(toRad(lat)) * Math.cos(toRad(decl)));
  // Polar latitude: Sun never rises (cosH > 1) or never sets (cosH < -1)
  if (cosH > 1 || cosH < -1) return null;
  const H = toDeg(Math.acos(cosH));

  // Equation of Time (simplified Meeus Ch.28):
  // Converts mean solar time to apparent solar time.
  // y2 = tan²(ε/2) where ε is the obliquity — a convenient parameter for the EoT formula.
  const y2 = Math.tan(toRad(obliquity / 2)) ** 2;
  const L0 = toRad(280.46646 + 36000.76983 * T);
  const M = toRad(357.52911 + 35999.05029 * T);
  const e = 0.016708634 - 0.000042037 * T; // orbital eccentricity
  // EoT result is in minutes of time
  const eot = toDeg(y2 * Math.sin(2 * L0) - 2 * e * Math.sin(M)
    + 4 * e * y2 * Math.sin(M) * Math.cos(2 * L0)
    - 0.5 * y2 * y2 * Math.sin(4 * L0)
    - 1.25 * e * e * Math.sin(2 * M)) * 4; // in minutes

  // Solar noon in UT hours: 720 minutes = 12:00, adjusted by longitude (4 min/degree) and EoT
  const solarNoon = (720 - 4 * lng - eot) / 60; // in hours UT
  // Sunrise = solar noon minus half the day arc (H in degrees, 15°/hour conversion)
  return ((solarNoon - H / 15) % 24 + 24) % 24;
}

/**
 * Compute approximate sunset time for a geographic location.
 * Same algorithm as approximateSunrise but adds H/15 to solar noon instead of subtracting.
 * Returns null at polar latitudes when the Sun doesn't set (perpetual day / midnight sun).
 *
 * @param jd  - Julian Day number
 * @param lat - Geographic latitude in degrees (positive = North)
 * @param lng - Geographic longitude in degrees (positive = East)
 * @returns UT decimal hours from midnight (0-24), or null if Sun doesn't set
 */
export function approximateSunset(jd: number, lat: number, lng: number): number | null {
  if (isSwissEphAvailable()) {
    return swissSunset(jd, lat, lng);
  }
  // Same computation as sunrise — see approximateSunrise for detailed algorithm notes
  const T = (jd - 2451545.0) / 36525;
  const obliquity = 23.4393 - 0.0130 * T;
  const sunLong = _meesusSunLongitude(jd);
  const decl = toDeg(Math.asin(Math.sin(toRad(obliquity)) * Math.sin(toRad(sunLong))));

  const cosH = (Math.sin(toRad(-0.8333)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl)))
    / (Math.cos(toRad(lat)) * Math.cos(toRad(decl)));
  // Polar latitude: Sun never rises (cosH > 1) or never sets (cosH < -1)
  if (cosH > 1 || cosH < -1) return null;
  const H = toDeg(Math.acos(cosH));

  // Equation of Time (simplified Meeus)
  const y2 = Math.tan(toRad(obliquity / 2)) ** 2;
  const L0 = toRad(280.46646 + 36000.76983 * T);
  const M = toRad(357.52911 + 35999.05029 * T);
  const e = 0.016708634 - 0.000042037 * T;
  const eot = toDeg(y2 * Math.sin(2 * L0) - 2 * e * Math.sin(M)
    + 4 * e * y2 * Math.sin(M) * Math.cos(2 * L0)
    - 0.5 * y2 * y2 * Math.sin(4 * L0)
    - 1.25 * e * e * Math.sin(2 * M)) * 4; // in minutes

  const solarNoon = (720 - 4 * lng - eot) / 60; // in hours UT
  return ((solarNoon + H / 15) % 24 + 24) % 24;
}

/**
 * Safe wrappers that fall back to 6:00/18:00 when sunrise/sunset is null (polar latitudes).
 * Use these in callers where null handling is impractical (festivals, calendars, etc.).
 * The raw approximateSunrise/approximateSunset should be used in panchang-calc where
 * polar warnings are surfaced to the user.
 */
export function approximateSunriseSafe(jd: number, lat: number, lng: number): number {
  return approximateSunrise(jd, lat, lng) ?? 6;
}

export function approximateSunsetSafe(jd: number, lat: number, lng: number): number {
  return approximateSunset(jd, lat, lng) ?? 18;
}

/**
 * Compute Delta T (TT - UT) in seconds.
 * Uses polynomial approximation from Espenak & Meeus (2006).
 * Valid for 1900-2100 with ~1 second accuracy.
 *
 * Delta T is the difference between Terrestrial Time (TT, uniform atomic
 * time used in ephemeris calculations) and Universal Time (UT, tied to
 * Earth's variable rotation). Planetary longitude tables (Meeus) are
 * computed in TT, so for precise positions one should adjust:
 *   jdTT = jdUT + deltaT(year) / 86400
 *
 * NOTE: Swiss Ephemeris handles Delta T internally — only apply this
 * correction to the Meeus fallback path. Integration into sunLongitude()
 * and moonLongitude() Meeus paths is deferred to avoid regression risk;
 * the current Meeus accuracy (~0.01° Sun, ~0.5° Moon) already exceeds
 * the Delta T effect (~1 arcsecond) for the 2000-2050 range.
 */
export function deltaT(year: number): number {
  if (year < 1900) return 0; // no reliable polynomial data

  const t = year - 2000;

  if (year < 1920) {
    // Espenak & Meeus 1900-1920
    const u = (year - 1900) / 100;
    return -2.79 + 149.4119 * u - 598.314 * u * u + 6196.6 * u * u * u - 19700.6 * u * u * u * u;
  }
  if (year < 1941) {
    // Espenak & Meeus 1920-1941
    const u = year - 1920;
    return 21.20 + 0.84493 * u - 0.076100 * u * u + 0.0020936 * u * u * u;
  }
  if (year < 1961) {
    // Espenak & Meeus 1941-1961
    const u = year - 1950;
    return 29.07 + 0.407 * u - u * u / 233 + u * u * u / 2547;
  }
  if (year < 1986) {
    // Espenak & Meeus 1961-1986
    const u = year - 1975;
    return 45.45 + 1.067 * u - u * u / 260 - u * u * u / 718;
  }
  if (year < 2005) {
    // Espenak & Meeus 1986-2005 polynomial (t from 2000)
    return 63.86 + 0.3345 * t - 0.060374 * t * t
      + 0.0017275 * t * t * t + 0.000651814 * t * t * t * t
      + 0.00002373599 * t * t * t * t * t;
  }
  // 2005-2050 projection (Espenak & Meeus)
  return 62.92 + 0.32217 * t + 0.005589 * t * t;
}

/**
 * Convert a Julian Day to a fractional year (for use with deltaT).
 * Approximate — accurate to ~1 day which is sufficient for Delta T lookup.
 */
export function jdToYear(jd: number): number {
  return 2000.0 + (jd - 2451545.0) / 365.25;
}

/**
 * Format decimal hours (UT) to a local-time "HH:MM" string.
 *
 * @param decimalHours  - Time in UT as fractional hours (e.g., 14.5 = 14:30 UT)
 * @param tzOffsetHours - Timezone offset to add (e.g., 5.5 for IST, 1 for CET)
 * @returns Formatted local time string "HH:MM"
 */
export function formatTime(decimalHours: number, tzOffsetHours: number = 0): string {
  const totalHours = ((decimalHours + tzOffsetHours) % 24 + 24) % 24;
  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculate Rahu Kaal — the inauspicious period ruled by Rahu on each weekday.
 *
 * Rahu Kaal is one of the most widely consulted muhurta elements in daily life.
 * It divides the daytime (sunrise to sunset) into 8 equal segments, and assigns
 * one segment to Rahu based on the weekday. Starting new ventures, travel, or
 * important activities during Rahu Kaal is traditionally avoided.
 *
 * The segment order follows the descending Chaldean planetary sequence starting
 * from the day lord: Mon=2, Sat=1, Fri=7, Wed=5, Thu=4, Tue=6, Sun=8 (varies
 * by tradition — this uses the standard Dharma Sindhu / Muhurta Chintamani order).
 *
 * Classical source: Dharma Sindhu, Muhurta Chintamani.
 * Segment order imported from shared constants (Lesson Q — single source of truth).
 *
 * @param sunrise - Sunrise time in UT decimal hours
 * @param sunset  - Sunset time in UT decimal hours
 * @param weekday - Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday
 * @returns Start and end times in UT decimal hours
 */
export function calculateRahuKaal(sunrise: number, sunset: number, weekday: number): { start: number; end: number } {
  // Each segment is 1/8 of the daytime duration (sunrise to sunset)
  const duration = (sunset - sunrise) / 8;
  // RAHU_ORDER[weekday] gives the 1-based segment number for Rahu on that day
  const segment = RAHU_ORDER[weekday] - 1;
  return {
    start: sunrise + segment * duration,
    end: sunrise + (segment + 1) * duration,
  };
}

/**
 * All planetary positions (tropical longitudes) for the 9 Grahas.
 * Swiss Ephemeris when available (sub-arcsecond), Meeus fallback (approximate).
 *
 * NOTE: Meeus simplified series produce retrograde station dates ~13-40 days late
 * for Jupiter and Saturn. Swiss Ephemeris path is accurate. This is a known limitation
 * of the truncated orbital elements — VSOP87 theory would fix but adds significant complexity.
 */
export function getPlanetaryPositions(jd: number, useTrueNode?: boolean): {
  id: number; longitude: number; latitude: number; distance: number; speed: number; isRetrograde: boolean
}[] {
  // Try Swiss Ephemeris first
  if (isSwissEphAvailable()) {
    const result = swissAllPlanets(jd, useTrueNode);
    if (result) {
      return result.planets.map(p => ({
        id: p.id,
        longitude: p.tropical,
        latitude: p.latitude,
        distance: p.distance, // AU
        speed: p.speed,
        isRetrograde: p.isRetrograde,
      }));
    }
  }

  // Meeus fallback — latitude and distance are not computed here (set to 0).
  // NOTE: kundali-calc.ts overrides latitude via computeFullCoordinates() which
  // provides approximate ecliptic latitudes from simplified perturbation theory.
  // Those Meeus-derived latitudes are less precise than Swiss Ephemeris (~0.5°
  // error possible), which can affect Graha Yuddha (planetary war) winner
  // detection since it depends on absolute ecliptic latitude.
  return _meeusPlanetaryPositions(jd, useTrueNode).map(p => ({ ...p, latitude: 0, distance: 0 }));
}

/**
 * Compute all 9 Vedic graha positions using Meeus simplified orbital elements.
 *
 * For each classical planet (Mars through Saturn), uses a 2-term Kepler model:
 *   longitude ≈ L0 + A1×sin(M) + A2×sin(2M)
 * where L0 is the mean longitude and M is the mean anomaly. This captures the
 * primary elliptical correction but omits mutual planetary perturbations.
 *
 * Retrograde detection: positions are computed at jd and jd+1; the speed
 * (degrees/day) is the finite difference. Negative speed = retrograde motion.
 * Sun and Moon are never retrograde. Rahu/Ketu are always retrograde by convention.
 *
 * For the lunar nodes (Rahu/Ketu):
 *   - Mean node: Meeus Ch.22 polynomial for the ascending node Ω
 *   - True node: adds 5 principal nutation-like perturbation terms
 *   - Ketu = Rahu + 180° (diametrically opposite); speed is the SAME as Rahu
 *     (both move retrograde — Lesson W: do NOT negate Ketu's speed)
 *
 * @param jd - Julian Day in UT
 * @param useTrueNode - If true, apply perturbation corrections for true node (vs mean)
 * @returns Array of 9 planets with tropical longitude, speed, and retrograde status
 */
function _meeusPlanetaryPositions(jd: number, useTrueNode?: boolean): {
  id: number; longitude: number; speed: number; isRetrograde: boolean
}[] {
  // We compute positions at jd AND at jd+1 day so we can derive the actual
  // daily speed and therefore infer retrograde status via sign(speed) < 0.
  //
  // HISTORICAL BUG (now fixed): the function previously returned hardcoded
  // average speeds and isRetrograde: false for all 7 classical planets.
  // This meant retrograde status was NEVER reported in the Meeus fallback
  // path (used when Swiss Ephemeris is unavailable), causing:
  //   • Cheshta Bala to give every planet its direct-motion strength
  //   • Yoga detection to miss retro-triggered yogas
  //   • Deeptadi Avastha to miss Vikala (retrograde) avastha
  //   • UI retrograde indicators to never appear
  // Sun and Moon never retrograde. Rahu/Ketu are always retrograde by convention.
  // For the 5 classical planets we compute speed by finite difference.
  const computeLong = (jdEval: number): Record<number, number> => {
    const tv = T(jdEval);

    const sunV = _meesusSunLongitude(jdEval);
    const moonV = _meeusMoonLongitude(jdEval);

    const marsLv = normalizeDeg(355.433 + 19140.2993 * tv);
    const marsMv = normalizeDeg(319.839 + 19139.8585 * tv);
    const marsV = normalizeDeg(marsLv + 6.4 * Math.sin(toRad(marsMv)) + 1.0 * Math.sin(toRad(2 * marsMv)));

    const mercLv = normalizeDeg(252.251 + 149472.6746 * tv);
    const mercMv = normalizeDeg(174.795 + 149472.5153 * tv);
    const mercuryV = normalizeDeg(mercLv + 23.44 * Math.sin(toRad(mercMv)) + 2.9 * Math.sin(toRad(2 * mercMv)));

    const jupLv = normalizeDeg(34.351 + 3034.9057 * tv);
    const jupMv = normalizeDeg(20.020 + 3034.6872 * tv);
    const jupiterV = normalizeDeg(jupLv + 5.55 * Math.sin(toRad(jupMv)) + 0.17 * Math.sin(toRad(2 * jupMv)));

    const venLv = normalizeDeg(181.979 + 58517.8157 * tv);
    const venMv = normalizeDeg(50.416 + 58517.8039 * tv);
    const venusV = normalizeDeg(venLv + 0.78 * Math.sin(toRad(venMv)));

    const satLv = normalizeDeg(50.077 + 1222.1138 * tv);
    const satMv = normalizeDeg(317.021 + 1222.1116 * tv);
    const saturnV = normalizeDeg(satLv + 6.4 * Math.sin(toRad(satMv)) + 0.9 * Math.sin(toRad(2 * satMv)));

    return { 0: sunV, 1: moonV, 2: marsV, 3: mercuryV, 4: jupiterV, 5: venusV, 6: saturnV };
  };

  const t = T(jd);
  const pos0 = computeLong(jd);
  const pos1 = computeLong(jd + 1); // positions 1 day later

  // Speed = longitude change in 1 day; handle 360° wrap-around.
  // A negative speed (retrograde apparent motion) means the planet is
  // moving westward relative to the fixed stars.
  const speed = (id: number): number => {
    let delta = pos1[id] - pos0[id];
    if (delta > 180)  delta -= 360; // crossed 0°/360° boundary going forward
    if (delta < -180) delta += 360; // crossed going backward
    return delta; // degrees per day
  };

  // Sun and Moon never retrograde (their apparent motion is always direct)
  const sunSpeed  = speed(0);  // ~0.985°/day
  const moonSpeed = speed(1);  // ~12-15°/day

  const marsSpeed    = speed(2);   // avg +0.52°/day; retrograde ~80 days/year
  const mercurySpeed = speed(3);   // avg +1.38°/day; retrograde ~21 days/year (3×)
  const jupiterSpeed = speed(4);   // avg +0.083°/day; retrograde ~120 days/year
  const venusSpeed   = speed(5);   // avg +1.2°/day; retrograde ~42 days/year
  const saturnSpeed  = speed(6);   // avg +0.034°/day; retrograde ~138 days/year

  // ── True lunar node (Rahu) ──
  // Mean ascending node (Meeus Ch.22 / Ch.47)
  const meanNode = normalizeDeg(
    125.0445479 - 1934.1362891 * t + 0.0020754 * t * t
    + t * t * t / 467441 - t * t * t * t / 60616000
  );
  // Fundamental arguments for the perturbation terms (degrees → radians)
  // D, M, Mp, F are Moon's mean elongation, Sun's mean anomaly, Moon's mean
  // anomaly, and Moon's argument of latitude — same definitions as in
  // _meeusMoonLongitude but recomputed here to keep the function self-contained.
  const nD  = normalizeDeg(297.8501921 + 445267.1114034 * t
    - 0.0018819 * t * t + t * t * t / 545868 - t * t * t * t / 113065000);
  const nM  = normalizeDeg(357.5291092 + 35999.0502909 * t
    - 0.0001536 * t * t + t * t * t / 24490000);
  const nMp = normalizeDeg(134.9633964 + 477198.8675055 * t
    + 0.0087414 * t * t + t * t * t / 69699 - t * t * t * t / 14712000);
  const nF  = normalizeDeg(93.2720950 + 483202.0175233 * t
    - 0.0036539 * t * t - t * t * t / 3526000 + t * t * t * t / 863310000);
  // Five principal perturbation terms for the true node (Meeus Table 47.C /
  // Explanatory Supplement).  Amplitude is in degrees.  Only applied when
  // useTrueNode is explicitly true; mean node is the default for backwards
  // compatibility with traditional Indian astrology systems.
  const trueNodeCorr = useTrueNode
    ? (- 1.4979 * Math.sin(toRad(2 * (nD - nF)))
       - 0.1500 * Math.sin(toRad(nM))
       - 0.1226 * Math.sin(toRad(2 * nD))
       + 0.1176 * Math.sin(toRad(2 * nF))
       - 0.0801 * Math.sin(toRad(2 * (nMp - nF))))
    : 0;
  const rahu = normalizeDeg(meanNode + trueNodeCorr);
  const ketu = normalizeDeg(rahu + 180);

  return [
    { id: 0, longitude: pos0[0], speed: sunSpeed,     isRetrograde: false },
    { id: 1, longitude: pos0[1], speed: moonSpeed,    isRetrograde: false },
    { id: 2, longitude: pos0[2], speed: marsSpeed,    isRetrograde: marsSpeed    < 0 },
    { id: 3, longitude: pos0[3], speed: mercurySpeed, isRetrograde: mercurySpeed < 0 },
    { id: 4, longitude: pos0[4], speed: jupiterSpeed, isRetrograde: jupiterSpeed < 0 },
    { id: 5, longitude: pos0[5], speed: venusSpeed,   isRetrograde: venusSpeed   < 0 },
    { id: 6, longitude: pos0[6], speed: saturnSpeed,  isRetrograde: saturnSpeed  < 0 },
    { id: 7, longitude: rahu,    speed: -0.053,       isRetrograde: true },  // nodes always retrograde
    { id: 8, longitude: ketu,    speed: -0.053,       isRetrograde: true },
  ];
}

/**
 * Get Hindu lunar month (Masa) name based on Sun's sidereal longitude.
 *
 * IMPORTANT — SOLAR APPROXIMATION: This maps Sun's sidereal sign to a month
 * name, which is a solar-month approximation. True lunar months run from
 * New Moon to New Moon and are named by the Sun's sign at the starting
 * New Moon (see computeHinduMonths() in calendar/hindu-months.ts for the
 * accurate lunar computation). Near Sankranti (solar ingress), this function
 * may disagree with the true lunar month by a day or two.
 *
 * This approximation is adequate for:
 *   - Daily Panchang display (masa label)
 *   - Sankalpa text generation
 *   - Samvat year boundary heuristic
 * For accurate month boundaries (Adhika Masa detection, calendar generation),
 * use computeHinduMonths() instead.
 */
export function getMasa(sunSidLong: number): number {
  // Solar approximation for lunar month (fallback when tithi table unavailable).
  // Classical: Mesha(0)=Vaishakha(1), Meena(11)=Chaitra(0).
  // Chaitra starts when Sun enters Meena (Pisces).
  const rashiIndex = Math.floor(sunSidLong / 30);
  return (rashiIndex + 1) % 12; // 0=Chaitra to 11=Phalguna
}

export const MASA_NAMES = [
  { en: 'Chaitra', hi: 'चैत्र', sa: 'चैत्रः' },
  { en: 'Vaishakha', hi: 'वैशाख', sa: 'वैशाखः' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ', sa: 'ज्येष्ठः' },
  { en: 'Ashadha', hi: 'आषाढ़', sa: 'आषाढः' },
  { en: 'Shravana', hi: 'श्रावण', sa: 'श्रावणः' },
  { en: 'Bhadrapada', hi: 'भाद्रपद', sa: 'भाद्रपदः' },
  { en: 'Ashwina', hi: 'आश्विन', sa: 'आश्विनः' },
  { en: 'Kartika', hi: 'कार्तिक', sa: 'कार्तिकः' },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष', sa: 'मार्गशीर्षः' },
  { en: 'Pausha', hi: 'पौष', sa: 'पौषः' },
  { en: 'Magha', hi: 'माघ', sa: 'माघः' },
  { en: 'Phalguna', hi: 'फाल्गुन', sa: 'फाल्गुनः' },
];

export const RITU_NAMES = [
  { en: 'Vasanta (Spring)', hi: 'वसन्त (बसंत)', sa: 'वसन्तः' },
  { en: 'Grishma (Summer)', hi: 'ग्रीष्म (गर्मी)', sa: 'ग्रीष्मः' },
  { en: 'Varsha (Monsoon)', hi: 'वर्षा (बरसात)', sa: 'वर्षा' },
  { en: 'Sharad (Autumn)', hi: 'शरद् (शरद)', sa: 'शरद्' },
  { en: 'Hemanta (Pre-winter)', hi: 'हेमन्त (शिशिर)', sa: 'हेमन्तः' },
  { en: 'Shishira (Winter)', hi: 'शिशिर (जाड़ा)', sa: 'शिशिरः' },
];

export const SAMVATSARA_NAMES = [
  { en: 'Prabhava', hi: 'प्रभव', sa: 'प्रभवः' },
  { en: 'Vibhava', hi: 'विभव', sa: 'विभवः' },
  { en: 'Shukla', hi: 'शुक्ल', sa: 'शुक्लः' },
  { en: 'Pramodoota', hi: 'प्रमोदूत', sa: 'प्रमोदूतः' },
  { en: 'Prajothpatti', hi: 'प्रजोत्पत्ति', sa: 'प्रजोत्पत्तिः' },
  { en: 'Angirasa', hi: 'आंगिरस', sa: 'आङ्गिरसः' },
  { en: 'Shrimukha', hi: 'श्रीमुख', sa: 'श्रीमुखः' },
  { en: 'Bhava', hi: 'भाव', sa: 'भावः' },
  { en: 'Yuva', hi: 'युव', sa: 'युवा' },
  { en: 'Dhatu', hi: 'धातृ', sa: 'धातृः' },
  { en: 'Ishvara', hi: 'ईश्वर', sa: 'ईश्वरः' },
  { en: 'Bahudhanya', hi: 'बहुधान्य', sa: 'बहुधान्यः' },
  { en: 'Pramathi', hi: 'प्रमाथी', sa: 'प्रमाथी' },
  { en: 'Vikrama', hi: 'विक्रम', sa: 'विक्रमः' },
  { en: 'Vrisha', hi: 'वृष', sa: 'वृषः' },
  { en: 'Chitrabhanu', hi: 'चित्रभानु', sa: 'चित्रभानुः' },
  { en: 'Svabhanu', hi: 'स्वभानु', sa: 'स्वभानुः' },
  { en: 'Tarana', hi: 'तारण', sa: 'तारणः' },
  { en: 'Parthiva', hi: 'पार्थिव', sa: 'पार्थिवः' },
  { en: 'Vyaya', hi: 'व्यय', sa: 'व्ययः' },
  { en: 'Sarvajitu', hi: 'सर्वजित', sa: 'सर्वजित्' },
  { en: 'Sarvadharin', hi: 'सर्वधारी', sa: 'सर्वधारी' },
  { en: 'Virodhi', hi: 'विरोधी', sa: 'विरोधी' },
  { en: 'Vikrita', hi: 'विकृत', sa: 'विकृतः' },
  { en: 'Khara', hi: 'खर', sa: 'खरः' },
  { en: 'Nandana', hi: 'नन्दन', sa: 'नन्दनः' },
  { en: 'Vijaya', hi: 'विजय', sa: 'विजयः' },
  { en: 'Jaya', hi: 'जय', sa: 'जयः' },
  { en: 'Manmatha', hi: 'मन्मथ', sa: 'मन्मथः' },
  { en: 'Durmukhi', hi: 'दुर्मुखी', sa: 'दुर्मुखी' },
  { en: 'Hevilambi', hi: 'हेविलम्बी', sa: 'हेविलम्बी' },
  { en: 'Vilambi', hi: 'विलम्बी', sa: 'विलम्बी' },
  { en: 'Vikari', hi: 'विकारी', sa: 'विकारी' },
  { en: 'Sharvari', hi: 'शार्वरी', sa: 'शार्वरी' },
  { en: 'Plava', hi: 'प्लव', sa: 'प्लवः' },
  { en: 'Shubhakrtu', hi: 'शुभकृत', sa: 'शुभकृत्' },
  { en: 'Shobhakrtu', hi: 'शोभकृत', sa: 'शोभकृत्' },
  { en: 'Krodhi', hi: 'क्रोधी', sa: 'क्रोधी' },
  { en: 'Vishvavasu', hi: 'विश्वावसु', sa: 'विश्वावसुः' },
  { en: 'Parabhava', hi: 'पराभव', sa: 'पराभवः' },
  { en: 'Plavanga', hi: 'प्लवंग', sa: 'प्लवङ्गः' },
  { en: 'Kilaka', hi: 'कीलक', sa: 'कीलकः' },
  { en: 'Saumya', hi: 'सौम्य', sa: 'सौम्यः' },
  { en: 'Sadharana', hi: 'साधारण', sa: 'साधारणः' },
  { en: 'Virodhikrtu', hi: 'विरोधिकृत', sa: 'विरोधिकृत्' },
  { en: 'Paridhavin', hi: 'परिधावी', sa: 'परिधावी' },
  { en: 'Pramadeecha', hi: 'प्रमादीच', sa: 'प्रमादीचः' },
  { en: 'Ananda', hi: 'आनन्द', sa: 'आनन्दः' },
  { en: 'Rakshasa', hi: 'राक्षस', sa: 'राक्षसः' },
  { en: 'Nala', hi: 'नल', sa: 'नलः' },
  { en: 'Pingala', hi: 'पिंगल', sa: 'पिङ्गलः' },
  { en: 'Kalayukti', hi: 'कालयुक्ति', sa: 'कालयुक्तिः' },
  { en: 'Siddharthi', hi: 'सिद्धार्थी', sa: 'सिद्धार्थी' },
  { en: 'Raudra', hi: 'रौद्र', sa: 'रौद्रः' },
  { en: 'Durmathi', hi: 'दुर्मति', sa: 'दुर्मतिः' },
  { en: 'Dundubhi', hi: 'दुन्दुभि', sa: 'दुन्दुभिः' },
  { en: 'Rudhirodgari', hi: 'रुधिरोद्गारी', sa: 'रुधिरोद्गारी' },
  { en: 'Raktakshi', hi: 'रक्ताक्षी', sa: 'रक्ताक्षी' },
  { en: 'Krodhana', hi: 'क्रोधन', sa: 'क्रोधनः' },
  { en: 'Akshaya', hi: 'अक्षय', sa: 'अक्षयः' },
];

// Get current Vikram Samvatsara (60-year Jupiter cycle)
// Used in Sankalpa. Vikram Samvat 2083 (2026 CE) = Siddharthi
//
// NOTE: This uses a Gregorian year approximation. Strictly, the samvatsara
// changes at Chaitra Shukla Pratipada (Hindu New Year, typically March/April).
// For dates in January–March, the samvatsara should technically be based on
// (year - 1) if the date falls before Chaitra Shukla Pratipada of that year.
// This simplified formula treats the Gregorian year boundary as the rollover,
// which may be off by one samvatsara for ~3 months (Jan–Mar).
export function getSamvatsara(year: number): number {
  // Vikram Samvatsara: (gregorian_year + 6) % 60
  // Verified: 2026 → (2026+6)%60 = 52 → Siddharthi
  return ((year + 6) % 60 + 60) % 60;
}

/**
 * Get the Hindu ritu (season) from the masa index.
 *
 * The 12 months pair into 6 ritus of 2 months each:
 *   0 = Vasanta (Spring): Chaitra + Vaishakha
 *   1 = Grishma (Summer): Jyeshtha + Ashadha
 *   2 = Varsha (Monsoon): Shravana + Bhadrapada
 *   3 = Sharad (Autumn): Ashwina + Kartika
 *   4 = Hemanta (Pre-winter): Margashirsha + Pausha
 *   5 = Shishira (Winter): Magha + Phalguna
 *
 * Classical source: Surya Siddhanta Ch.14; also Arthashastra.
 *
 * @param masaIndex - Masa index 0-11 (0=Chaitra)
 * @returns Ritu index 0-5
 */
export function getRitu(masaIndex: number): number {
  return Math.floor(masaIndex / 2);
}

export function getAyana(sunSidLong: number): LocaleText {
  // Uttarayana: Sun moves northward from Makar Sankranti (Capricorn, ~270°)
  // to Karka Sankranti (Cancer, ~90°). i.e., 270° → 360°/0° → 90°
  // Dakshinayana: Sun moves southward from Cancer (90°) to Capricorn (270°)
  if (sunSidLong >= 90 && sunSidLong < 270) {
    return { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायनम्' };
  }
  return { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायणम्' };
}

// ─── Centralized birth sign computation ──────────────────────────────────
// ONE function for computing Sun sign, Moon sign, Moon nakshatra, Moon pada
// from birth details. Every page that needs birth signs must use this —
// no inline dateToJD + moonLongitude + toSidereal chains anywhere else.

import { resolveTimezone } from '@/lib/utils/timezone';

export interface BirthSignResult {
  sunSign: number;        // 1-12
  sunLong: number;        // sidereal degrees 0-360
  moonSign: number;       // 1-12
  moonLong: number;       // sidereal degrees 0-360
  moonNakshatra: number;  // 1-27
  moonPada: number;       // 1-4
  tzOffset: number;       // resolved UTC offset
  ayanamsha: number;      // ayanamsha value used
}

/**
 * Centralised birth sign computation — the SINGLE function for computing
 * Sun sign, Moon sign, Moon nakshatra, and Moon pada from birth details.
 *
 * Every page that needs birth signs MUST use this function — no inline
 * dateToJD + moonLongitude + toSidereal chains elsewhere (Lesson B: single
 * source of truth for shared data).
 *
 * The timezone is resolved from the IANA timezone string, NOT from the browser
 * or a stored offset (Lesson L: timezone from coordinates only). This correctly
 * handles DST transitions for historical birth times.
 *
 * @param date          - Birth date as "YYYY-MM-DD"
 * @param time          - Birth time as "HH:MM" (local time)
 * @param lat           - Birth latitude in degrees
 * @param lng           - Birth longitude in degrees
 * @param timezone      - IANA timezone string (e.g., 'Asia/Kolkata', 'Europe/Zurich') — REQUIRED
 * @param ayanamshaType - Ayanamsha system: 'lahiri' (default), 'raman', or 'kp'
 * @returns BirthSignResult with Sun/Moon signs, nakshatra, pada, and computed ayanamsha
 */
export function computeBirthSigns(
  date: string,       // YYYY-MM-DD
  time: string,       // HH:MM
  lat: number,
  lng: number,
  timezone: string,   // IANA timezone string (e.g. 'Asia/Kolkata') — REQUIRED
  ayanamshaType: 'lahiri' | 'raman' | 'kp' = 'lahiri',
): BirthSignResult {
  const [y, m, d] = date.split('-').map(Number);
  const [h, min] = time.split(':').map(Number);
  const decimalHour = h + min / 60;
  const tzOffset = resolveTimezone(timezone, y, m, d);
  const utHour = decimalHour - tzOffset;
  const jd = dateToJD(y, m, d, utHour);

  const ayan = getAyanamsha(jd, ayanamshaType);
  const sunTrop = sunLongitude(jd);
  const moonTrop = moonLongitude(jd);
  const sunSid = normalizeDeg(sunTrop - ayan);
  const moonSid = normalizeDeg(moonTrop - ayan);

  return {
    sunSign: getRashiNumber(sunSid),
    sunLong: sunSid,
    moonSign: getRashiNumber(moonSid),
    moonLong: moonSid,
    moonNakshatra: getNakshatraNumber(moonSid),
    moonPada: getNakshatraPada(moonSid),
    tzOffset,
    ayanamsha: ayan,
  };
}

/**
 * Format a decimal degree value as DD°MM'SS" (degrees, arcminutes, arcseconds).
 * Used for displaying planet positions within a sign (0-30° range).
 */
export function formatDegrees(deg: number): string {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return `${d}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
}

/**
 * Compute the ascendant (lagna) degree — the ecliptic point rising on the eastern horizon.
 *
 * The ascendant is the most time-sensitive element in Jyotish — it changes sign
 * approximately every 2 hours (exact duration varies by latitude and season).
 * It determines the 1st house of the birth chart and all subsequent house positions.
 *
 * ALGORITHM:
 *   1. Compute Greenwich Mean Sidereal Time (GMST) from JD using the IAU formula.
 *   2. Convert to Local Sidereal Time (LST) by adding geographic longitude.
 *   3. Compute the obliquity of the ecliptic (ε).
 *   4. Apply the ascendant formula:
 *        tan(ASC) = -cos(LST) / (sin(ε)×tan(lat) + cos(ε)×sin(LST))
 *      This is derived from the intersection of the ecliptic plane with the
 *      observer's horizon plane in the equatorial coordinate system.
 *
 * @param jd  - Julian Day in UT (precision matters: 1 minute ≈ 0.25° change in ASC)
 * @param lat - Geographic latitude in degrees
 * @param lng - Geographic longitude in degrees
 * @returns Tropical longitude of the ascendant in degrees [0, 360).
 *          To get sidereal: subtract lahiriAyanamsha(jd).
 */
export function calcAscendant(jd: number, lat: number, lng: number): number {
  const T2 = (jd - 2451545.0) / 36525.0;
  // GMST: Greenwich Mean Sidereal Time (Meeus Ch.12) — the right ascension
  // of the vernal equinox, which rotates ~360.985°/day due to Earth's spin.
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T2 * T2 - T2 * T2 * T2 / 38710000;
  // LST: Local Sidereal Time = GMST + observer's longitude (east positive)
  const lst = normalizeDeg(gmst + lng);
  // ε: obliquity of the ecliptic (~23.44°, decreasing ~0.013°/century)
  const eps = 23.4393 - 0.013 * T2;
  const epsRad = eps * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;
  // Ascendant formula (Meeus Ch.13): atan2(-cos(LST), sin(ε)tan(lat) + cos(ε)sin(LST))
  const y = -Math.cos(lstRad);
  const x = Math.sin(epsRad) * Math.tan(latRad) + Math.cos(epsRad) * Math.sin(lstRad);
  return normalizeDeg(Math.atan2(y, x) * 180 / Math.PI);
}
