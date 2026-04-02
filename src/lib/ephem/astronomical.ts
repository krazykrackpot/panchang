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

  return new Date(year, month - 1, day);
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

export type AyanamshaType = 'lahiri' | 'raman' | 'kp' | 'bv_raman' | 'yukteshwar' | 'jn_bhasin';

/**
 * Calculate ayanamsha for different systems.
 * All based on polynomial fits to published tables.
 */
export function getAyanamsha(jd: number, type: AyanamshaType = 'lahiri'): number {
  const t = (jd - 2451545.0) / 36525.0;
  switch (type) {
    case 'lahiri':
      return 23.85306 + 1.39722 * t + 0.00018 * t * t - 0.000005 * t * t * t;
    case 'raman':
      // CV Raman: 22°27'37.7" at J2000.0 — slower precession rate
      return 22.46047 + 1.38472 * t + 0.00015 * t * t;
    case 'kp':
      // KP (Krishnamurti): very close to Lahiri, ~6 arcmin difference
      return 23.76056 + 1.39722 * t + 0.00018 * t * t;
    case 'bv_raman':
      // BV Raman: 22°22'40" at J2000.0
      return 22.37778 + 1.38250 * t + 0.00015 * t * t;
    case 'yukteshwar':
      // Sri Yukteshwar: 21°46'0" at J2000.0
      return 21.76667 + 1.38472 * t;
    case 'jn_bhasin':
      // JN Bhasin: 23°09'06" at J2000.0
      return 23.15167 + 1.39722 * t + 0.00018 * t * t;
    default:
      return lahiriAyanamsha(jd);
  }
}

export const AYANAMSHA_OPTIONS: { value: AyanamshaType; label: { en: string; hi: string; sa: string } }[] = [
  { value: 'lahiri', label: { en: 'Lahiri (Chitrapaksha)', hi: 'लाहिरी (चित्रपक्ष)', sa: 'लाहिरी (चित्रपक्षः)' } },
  { value: 'kp', label: { en: 'KP (Krishnamurti)', hi: 'केपी (कृष्णमूर्ति)', sa: 'केपी (कृष्णमूर्तिः)' } },
  { value: 'raman', label: { en: 'CV Raman', hi: 'सी.वी. रमन', sa: 'सी.वी. रमणः' } },
  { value: 'bv_raman', label: { en: 'BV Raman', hi: 'बी.वी. रमन', sa: 'बी.वी. रमणः' } },
  { value: 'yukteshwar', label: { en: 'Sri Yukteshwar', hi: 'श्री युक्तेश्वर', sa: 'श्री युक्तेश्वरः' } },
  { value: 'jn_bhasin', label: { en: 'JN Bhasin', hi: 'जे.एन. भसीन', sa: 'जे.एन. भसीनः' } },
];

// Convert tropical longitude to sidereal
export function toSidereal(tropicalLong: number, jd: number): number {
  return normalizeDeg(tropicalLong - lahiriAyanamsha(jd));
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
 */
export function calculateYoga(jd: number): number {
  const sunSid = toSidereal(sunLongitude(jd), jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);
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
  if (karanaIndex >= 57) return [8, 9, 10][karanaIndex - 57]; // Last 3: Shakuni, Chatushpada, Nagava
  return ((karanaIndex - 1) % 7) + 1; // Chara karanas cycle
}

/**
 * Approximate sunrise time for a location
 * Returns hours from midnight (UT)
 */
export function approximateSunrise(jd: number, lat: number, lng: number): number {
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
  if (cosH > 1 || cosH < -1) return 6;
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

export function approximateSunset(jd: number, lat: number, lng: number): number {
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
  if (cosH > 1 || cosH < -1) return 18;
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
  // Rahu Kaal order for each weekday (Sun=0 through Sat=6)
  // Each day is divided into 8 parts, Rahu Kaal is at position:
  const rahuOrder = [8, 2, 7, 5, 6, 4, 3]; // Sun through Sat
  const duration = (sunset - sunrise) / 8;
  const segment = rahuOrder[weekday] - 1;
  return {
    start: sunrise + segment * duration,
    end: sunrise + (segment + 1) * duration,
  };
}

/**
 * All planetary positions (tropical longitudes) for the 9 Grahas.
 * Swiss Ephemeris when available (sub-arcsecond), Meeus fallback (approximate).
 */
export function getPlanetaryPositions(jd: number): {
  id: number; longitude: number; speed: number; isRetrograde: boolean
}[] {
  // Try Swiss Ephemeris first
  if (isSwissEphAvailable()) {
    const result = swissAllPlanets(jd);
    if (result) {
      return result.planets.map(p => ({
        id: p.id,
        longitude: p.tropical,
        speed: p.speed,
        isRetrograde: p.isRetrograde,
      }));
    }
  }

  // Meeus fallback
  return _meeusPlanetaryPositions(jd);
}

function _meeusPlanetaryPositions(jd: number): {
  id: number; longitude: number; speed: number; isRetrograde: boolean
}[] {
  const t = T(jd);

  const sun = _meesusSunLongitude(jd);
  const moon = _meeusMoonLongitude(jd);

  const marsL = normalizeDeg(355.433 + 19140.2993 * t);
  const marsM = normalizeDeg(319.839 + 19139.8585 * t);
  const mars = normalizeDeg(marsL + 6.4 * Math.sin(toRad(marsM)) + 1.0 * Math.sin(toRad(2 * marsM)));

  const mercL = normalizeDeg(252.251 + 149472.6746 * t);
  const mercM = normalizeDeg(174.795 + 149472.5153 * t);
  const mercury = normalizeDeg(mercL + 23.44 * Math.sin(toRad(mercM)) + 2.9 * Math.sin(toRad(2 * mercM)));

  const jupL = normalizeDeg(34.351 + 3034.9057 * t);
  const jupM = normalizeDeg(20.020 + 3034.6872 * t);
  const jupiter = normalizeDeg(jupL + 5.55 * Math.sin(toRad(jupM)) + 0.17 * Math.sin(toRad(2 * jupM)));

  const venL = normalizeDeg(181.979 + 58517.8157 * t);
  const venM = normalizeDeg(50.416 + 58517.8039 * t);
  const venus = normalizeDeg(venL + 0.78 * Math.sin(toRad(venM)));

  const satL = normalizeDeg(50.077 + 1222.1138 * t);
  const satM = normalizeDeg(317.021 + 1222.1116 * t);
  const saturn = normalizeDeg(satL + 6.4 * Math.sin(toRad(satM)) + 0.9 * Math.sin(toRad(2 * satM)));

  const rahu = normalizeDeg(125.044 - 1934.1362 * t);
  const ketu = normalizeDeg(rahu + 180);

  return [
    { id: 0, longitude: sun, speed: 1.0, isRetrograde: false },
    { id: 1, longitude: moon, speed: 13.2, isRetrograde: false },
    { id: 2, longitude: mars, speed: 0.52, isRetrograde: false },
    { id: 3, longitude: mercury, speed: 1.38, isRetrograde: false },
    { id: 4, longitude: jupiter, speed: 0.083, isRetrograde: false },
    { id: 5, longitude: venus, speed: 1.2, isRetrograde: false },
    { id: 6, longitude: saturn, speed: 0.034, isRetrograde: false },
    { id: 7, longitude: rahu, speed: -0.053, isRetrograde: true },
    { id: 8, longitude: ketu, speed: -0.053, isRetrograde: true },
  ];
}

/**
 * Get Hindu lunar month (Masa) name based on Sun's sidereal longitude
 */
export function getMasa(sunSidLong: number): number {
  // Masa is determined by the solar ingress into a rashi
  // Chaitra starts when Sun enters Meena (Pisces) - month index 0
  const rashiIndex = Math.floor(sunSidLong / 30);
  // Mapping: Mesha(0)=Vaishakha, Vrishabha(1)=Jyeshtha, etc.
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

// Get current Samvatsara (60-year Jupiter cycle)
export function getSamvatsara(year: number): number {
  // Approximate: Vikari samvatsara was 2019-2020
  // The cycle: (year - reference) % 60
  return ((year - 1987) % 60 + 60) % 60;
}

export function getRitu(masaIndex: number): number {
  return Math.floor(masaIndex / 2);
}

export function getAyana(sunSidLong: number): { en: string; hi: string; sa: string } {
  if (sunSidLong >= 0 && sunSidLong < 180) {
    return { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायणम्' };
  }
  return { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायनम्' };
}

// Format degrees as DD°MM'SS"
export function formatDegrees(deg: number): string {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return `${d}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
}
