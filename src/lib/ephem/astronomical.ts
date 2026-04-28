import type { LocaleText } from '@/types/panchang';
/**
 * Core astronomical calculation functions.
 * Uses Swiss Ephemeris (sweph) when available for sub-arcsecond accuracy.
 * Falls back to Meeus "Astronomical Algorithms" if sweph is not installed.
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

// Julian Day Number from calendar date
export function dateToJD(year: number, month: number, day: number, hour: number = 0): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
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

// Normalize angle to 0-360
export function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

// Degrees to radians
export function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

// Radians to degrees
export function toDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

// Centuries from J2000.0
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

function _meesusSunLongitude(jd: number): number {
  const t = T(jd);
  const L0 = normalizeDeg(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  const M = normalizeDeg(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const Mrad = toRad(M);
  const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);
  const sunTrue = normalizeDeg(L0 + C);
  const omega = 125.04 - 1934.136 * t;
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
function _meeusMoonLongitude(jd: number): number {
  const t = T(jd);

  // Fundamental arguments (degrees)
  const Lp = normalizeDeg(218.3164477 + 481267.88123421 * t
    - 0.0015786 * t * t + t * t * t / 538841 - t * t * t * t / 65194000);
  const D = normalizeDeg(297.8501921 + 445267.1114034 * t
    - 0.0018819 * t * t + t * t * t / 545868 - t * t * t * t / 113065000);
  const M = normalizeDeg(357.5291092 + 35999.0502909 * t
    - 0.0001536 * t * t + t * t * t / 24490000);
  const Mp = normalizeDeg(134.9633964 + 477198.8675055 * t
    + 0.0087414 * t * t + t * t * t / 69699 - t * t * t * t / 14712000);
  const F = normalizeDeg(93.2720950 + 483202.0175233 * t
    - 0.0036539 * t * t - t * t * t / 3526000 + t * t * t * t / 863310000);

  // Eccentricity of Earth's orbit
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

  // Additional corrections
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

function _meeeusLahiriAyanamsha(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
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
      // These need Swiss Eph for accuracy — fallback to Lahiri as approximation
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

// Get rashi (sign) number from sidereal longitude (1-12)
export function getRashiNumber(sidLong: number): number {
  return Math.floor(sidLong / 30) + 1;
}

// Get nakshatra number from sidereal longitude (1-27)
export function getNakshatraNumber(sidLong: number): number {
  return Math.floor(sidLong / (360 / 27)) + 1;
}

// Get pada (quarter) within nakshatra (1-4)
export function getNakshatraPada(sidLong: number): number {
  const nakshatraSpan = 360 / 27; // 13.333...
  const posInNakshatra = sidLong % nakshatraSpan;
  return Math.floor(posInNakshatra / (nakshatraSpan / 4)) + 1;
}

/**
 * Calculate Tithi (1-30)
 * Tithi = Moon-Sun longitude difference / 12
 */
export function calculateTithi(jd: number): { number: number; degree: number } {
  const sunSid = toSidereal(sunLongitude(jd), jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);
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
 * Calculate Karana (1-11, cycles through)
 * Karana is half a tithi, there are 60 karanas in a lunar month
 */
export function calculateKarana(jd: number): number {
  const { degree } = calculateTithi(jd);
  const karanaIndex = Math.floor(degree / 6);
  // Map to the 11 karanas (7 chara + 4 sthira, cycling pattern)
  if (karanaIndex === 0) return 11; // Kimstughna (first half of S1)
  // Last 3 fixed karanas: Shakuni(8), Chatushpada(9), Naga(10) — 1-based IDs
  // Bounds check: karanaIndex can be at most 59 (degree < 360), but clamp defensively
  if (karanaIndex >= 57) return [8, 9, 10][Math.min(karanaIndex - 57, 2)];
  return ((karanaIndex - 1) % 7) + 1; // Chara karanas cycle
}

/**
 * Approximate sunrise time for a location
 * Returns hours from midnight (UT)
 */
export function approximateSunrise(jd: number, lat: number, lng: number): number | null {
  if (isSwissEphAvailable()) {
    return swissSunrise(jd, lat, lng);
  }
  // Meeus improved: actual obliquity + EoT correction
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
  return ((solarNoon - H / 15) % 24 + 24) % 24;
}

export function approximateSunset(jd: number, lat: number, lng: number): number | null {
  if (isSwissEphAvailable()) {
    return swissSunset(jd, lat, lng);
  }
  // Meeus improved: actual obliquity + EoT correction
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

// Format decimal hours to HH:MM string
export function formatTime(decimalHours: number, tzOffsetHours: number = 0): string {
  const totalHours = ((decimalHours + tzOffsetHours) % 24 + 24) % 24;
  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculate Rahu Kaal based on weekday and sunrise/sunset
 */
export function calculateRahuKaal(sunrise: number, sunset: number, weekday: number): { start: number; end: number } {
  // Segment order imported from shared constants (Lesson Q — single source of truth)
  const duration = (sunset - sunrise) / 8;
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
export function getPlanetaryPositions(jd: number): {
  id: number; longitude: number; latitude: number; distance: number; speed: number; isRetrograde: boolean
}[] {
  // Try Swiss Ephemeris first
  if (isSwissEphAvailable()) {
    const result = swissAllPlanets(jd);
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
  return _meeusPlanetaryPositions(jd).map(p => ({ ...p, latitude: 0, distance: 0 }));
}

function _meeusPlanetaryPositions(jd: number): {
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
  // Explanatory Supplement).  Amplitude is in degrees.
  const trueNodeCorr =
    - 1.4979 * Math.sin(toRad(2 * (nD - nF)))
    - 0.1500 * Math.sin(toRad(nM))
    - 0.1226 * Math.sin(toRad(2 * nD))
    + 0.1176 * Math.sin(toRad(2 * nF))
    - 0.0801 * Math.sin(toRad(2 * (nMp - nF)));
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

// Format degrees as DD°MM'SS"
export function formatDegrees(deg: number): string {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return `${d}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
}

/**
 * Compute the ascendant (lagna) degree for a given JD and geographic coordinates.
 * Returns tropical longitude of the ascending point (0-360).
 * To get sidereal: subtract lahiriAyanamsha(jd).
 */
export function calcAscendant(jd: number, lat: number, lng: number): number {
  const T2 = (jd - 2451545.0) / 36525.0;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T2 * T2 - T2 * T2 * T2 / 38710000;
  const lst = normalizeDeg(gmst + lng);
  const eps = 23.4393 - 0.013 * T2;
  const epsRad = eps * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;
  const y = -Math.cos(lstRad);
  const x = Math.sin(epsRad) * Math.tan(latRad) + Math.cos(epsRad) * Math.sin(lstRad);
  return normalizeDeg(Math.atan2(y, x) * 180 / Math.PI);
}
