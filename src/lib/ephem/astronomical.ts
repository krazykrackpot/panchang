/**
 * Core astronomical calculation functions.
 * Pure JavaScript implementation for Panchang calculations.
 * Based on Meeus "Astronomical Algorithms" and Surya Siddhanta formulas.
 */

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
 * Sun's mean longitude (geometric, referred to mean equinox of date)
 * Meeus Ch. 25
 */
export function sunLongitude(jd: number): number {
  const t = T(jd);
  // Mean longitude
  const L0 = normalizeDeg(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  // Mean anomaly
  const M = normalizeDeg(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const Mrad = toRad(M);
  // Equation of center
  const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);
  // Sun's true longitude
  const sunTrue = normalizeDeg(L0 + C);
  // Apparent longitude (nutation + aberration)
  const omega = 125.04 - 1934.136 * t;
  const apparent = sunTrue - 0.00569 - 0.00478 * Math.sin(toRad(omega));
  return normalizeDeg(apparent);
}

/**
 * Moon's longitude (simplified)
 * Based on Meeus Ch. 47 (truncated series)
 */
export function moonLongitude(jd: number): number {
  const t = T(jd);

  // Moon's mean longitude
  const Lp = normalizeDeg(218.3164477 + 481267.88123421 * t
    - 0.0015786 * t * t + t * t * t / 538841 - t * t * t * t / 65194000);

  // Moon's mean elongation
  const D = normalizeDeg(297.8501921 + 445267.1114034 * t
    - 0.0018819 * t * t + t * t * t / 545868 - t * t * t * t / 113065000);

  // Sun's mean anomaly
  const M = normalizeDeg(357.5291092 + 35999.0502909 * t
    - 0.0001536 * t * t + t * t * t / 24490000);

  // Moon's mean anomaly
  const Mp = normalizeDeg(134.9633964 + 477198.8675055 * t
    + 0.0087414 * t * t + t * t * t / 69699 - t * t * t * t / 14712000);

  // Moon's argument of latitude
  const F = normalizeDeg(93.2720950 + 483202.0175233 * t
    - 0.0036539 * t * t - t * t * t / 3526000 + t * t * t * t / 863310000);

  const Drad = toRad(D), Mrad = toRad(M), Mprad = toRad(Mp), Frad = toRad(F);

  // Simplified longitude perturbation (main terms)
  let longitude = Lp
    + 6.289 * Math.sin(Mprad)
    + 1.274 * Math.sin(2 * Drad - Mprad)
    + 0.658 * Math.sin(2 * Drad)
    + 0.214 * Math.sin(2 * Mprad)
    - 0.186 * Math.sin(Mrad)
    - 0.114 * Math.sin(2 * Frad)
    + 0.059 * Math.sin(2 * Drad - 2 * Mprad)
    + 0.057 * Math.sin(2 * Drad - Mrad - Mprad)
    + 0.053 * Math.sin(2 * Drad + Mprad)
    + 0.046 * Math.sin(2 * Drad - Mrad)
    - 0.041 * Math.sin(Mrad - Mprad)
    - 0.035 * Math.sin(Drad)
    - 0.031 * Math.sin(Mprad + Mrad);

  return normalizeDeg(longitude);
}

// Lahiri Ayanamsha calculation
export function lahiriAyanamsha(jd: number): number {
  const t = T(jd);
  // Lahiri ayanamsha (approximate formula)
  return 23.85 + 0.0137 * (jd - 2451545.0) / 365.25;
}

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
  const t = T(jd);
  // Simplified sunrise calculation
  const decl = toDeg(Math.asin(Math.sin(toRad(23.44)) * Math.sin(toRad(sunLongitude(jd)))));
  const cosH = (Math.sin(toRad(-0.833)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl)))
    / (Math.cos(toRad(lat)) * Math.cos(toRad(decl)));

  if (cosH > 1 || cosH < -1) return 6; // Polar day/night fallback

  const H = toDeg(Math.acos(cosH));
  const sunrise = 12 - H / 15 - lng / 15; // In UT hours
  return ((sunrise % 24) + 24) % 24;
}

export function approximateSunset(jd: number, lat: number, lng: number): number {
  const decl = toDeg(Math.asin(Math.sin(toRad(23.44)) * Math.sin(toRad(sunLongitude(jd)))));
  const cosH = (Math.sin(toRad(-0.833)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl)))
    / (Math.cos(toRad(lat)) * Math.cos(toRad(decl)));

  if (cosH > 1 || cosH < -1) return 18;

  const H = toDeg(Math.acos(cosH));
  const sunset = 12 + H / 15 - lng / 15;
  return ((sunset % 24) + 24) % 24;
}

// Format decimal hours to HH:MM string
export function formatTime(decimalHours: number, tzOffsetHours: number = 5.5): string {
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
 * Approximate planetary longitudes for the 7 traditional + Rahu/Ketu
 * These are simplified mean longitudes good for display purposes
 */
export function getPlanetaryPositions(jd: number): {
  id: number; longitude: number; speed: number; isRetrograde: boolean
}[] {
  const t = T(jd);

  // Mean longitudes (simplified)
  const sun = sunLongitude(jd);
  const moon = moonLongitude(jd);

  // Mars
  const marsL = normalizeDeg(355.433 + 19140.2993 * t);
  const marsM = normalizeDeg(319.839 + 19139.8585 * t);
  const mars = normalizeDeg(marsL + 6.4 * Math.sin(toRad(marsM)) + 1.0 * Math.sin(toRad(2 * marsM)));

  // Mercury
  const mercL = normalizeDeg(252.251 + 149472.6746 * t);
  const mercM = normalizeDeg(174.795 + 149472.5153 * t);
  const mercury = normalizeDeg(mercL + 23.44 * Math.sin(toRad(mercM)) + 2.9 * Math.sin(toRad(2 * mercM)));

  // Jupiter
  const jupL = normalizeDeg(34.351 + 3034.9057 * t);
  const jupM = normalizeDeg(20.020 + 3034.6872 * t);
  const jupiter = normalizeDeg(jupL + 5.55 * Math.sin(toRad(jupM)) + 0.17 * Math.sin(toRad(2 * jupM)));

  // Venus
  const venL = normalizeDeg(181.979 + 58517.8157 * t);
  const venM = normalizeDeg(50.416 + 58517.8039 * t);
  const venus = normalizeDeg(venL + 0.78 * Math.sin(toRad(venM)));

  // Saturn
  const satL = normalizeDeg(50.077 + 1222.1138 * t);
  const satM = normalizeDeg(317.021 + 1222.1116 * t);
  const saturn = normalizeDeg(satL + 6.4 * Math.sin(toRad(satM)) + 0.9 * Math.sin(toRad(2 * satM)));

  // Rahu (Mean North Node - moves retrograde ~19.3°/year)
  const rahu = normalizeDeg(125.044 - 1934.1362 * t);

  // Ketu (opposite of Rahu)
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
