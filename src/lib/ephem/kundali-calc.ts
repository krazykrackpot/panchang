import {
  dateToJD, sunLongitude, moonLongitude, toSidereal,
  getRashiNumber, getNakshatraNumber, getNakshatraPada,
  getPlanetaryPositions, lahiriAyanamsha, normalizeDeg, formatDegrees,
} from './astronomical';
import { computeFullCoordinates, computeCombust } from './coordinates';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { GRAHAS } from '@/lib/constants/grahas';
import type { KundaliData, BirthData, PlanetPosition, HouseCusp, ChartData, DashaEntry, ShadBala, DivisionalChart, AshtakavargaData, GrahaDetail, UpagrahaPosition } from '@/types/kundali';
import { calculateJaimini } from '@/lib/jaimini/jaimini-calc';
import { calculateFullShadbala } from '@/lib/kundali/shadbala';
import { calculateBhavabala } from '@/lib/kundali/bhavabala';
import { detectAllYogas } from '@/lib/kundali/yogas-complete';

/**
 * Calculate the Ascendant (Lagna) degree
 * Simplified calculation using sidereal time
 */
function calculateAscendant(jd: number, lat: number, lng: number): number {
  // Local Sidereal Time
  const T = (jd - 2451545.0) / 36525.0;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T - T * T * T / 38710000;
  const lst = normalizeDeg(gmst + lng);

  // Obliquity of ecliptic
  const eps = 23.4393 - 0.013 * T;
  const epsRad = eps * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;

  // Ascendant formula
  const y = -Math.cos(lstRad);
  const x = Math.sin(epsRad) * Math.tan(latRad) + Math.cos(epsRad) * Math.sin(lstRad);
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  asc = normalizeDeg(asc);

  return asc;
}

/**
 * Calculate house cusps using Equal House system
 */
function calculateHouses(ascDeg: number): number[] {
  const cusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    cusps.push(normalizeDeg(ascDeg + i * 30));
  }
  return cusps;
}

/**
 * Determine which house a planet falls in
 */
function getHouse(planetDeg: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const nextI = (i + 1) % 12;
    let start = cusps[i];
    let end = cusps[nextI];

    if (end < start) end += 360;
    let deg = planetDeg;
    if (deg < start) deg += 360;

    if (deg >= start && deg < end) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Check planet dignity states
 */
const EXALTATION: Record<number, number> = { 0: 1, 1: 2, 2: 10, 3: 6, 4: 4, 5: 12, 6: 7 };
const DEBILITATION: Record<number, number> = { 0: 7, 1: 8, 2: 4, 3: 12, 4: 10, 5: 6, 6: 1 };
const OWN_SIGNS: Record<number, number[]> = {
  0: [5], 1: [4], 2: [1, 8], 3: [3, 6], 4: [9, 12], 5: [2, 7], 6: [10, 11],
};

/**
 * Vimshottari Dasha calculation
 */
const DASHA_YEARS: Record<string, number> = {
  'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
  'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17,
};

const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

const PLANET_NAME_MAP: Record<string, { en: string; hi: string; sa: string }> = {
  'Sun': { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
  'Moon': { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
  'Mars': { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' },
  'Mercury': { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
  'Jupiter': { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' },
  'Venus': { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
  'Saturn': { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
  'Rahu': { en: 'Rahu', hi: 'राहु', sa: 'राहुः' },
  'Ketu': { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
};

function calculateVimshottariDasha(moonSidLong: number, birthDate: Date): DashaEntry[] {
  const nakshatraIndex = Math.floor(moonSidLong / (360 / 27));
  const lord = NAKSHATRA_LORDS[nakshatraIndex];
  const lordIndex = DASHA_ORDER.indexOf(lord);

  // Position within nakshatra (fraction completed)
  const nakshatraSpan = 360 / 27;
  const posInNakshatra = (moonSidLong % nakshatraSpan) / nakshatraSpan;

  // Remaining dasha of birth lord
  const totalYears = DASHA_YEARS[lord];
  const remainingYears = totalYears * (1 - posInNakshatra);

  const dashas: DashaEntry[] = [];
  let currentDate = new Date(birthDate);

  for (let i = 0; i < 9; i++) {
    const idx = (lordIndex + i) % 9;
    const planet = DASHA_ORDER[idx];
    const years = i === 0 ? remainingYears : DASHA_YEARS[planet];
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + Math.floor(years));
    endDate.setMonth(endDate.getMonth() + Math.floor((years % 1) * 12));

    // Calculate sub-periods (Antardasha)
    const subPeriods: DashaEntry[] = [];
    let subDate = new Date(currentDate);
    for (let j = 0; j < 9; j++) {
      const subIdx = (idx + j) % 9;
      const subPlanet = DASHA_ORDER[subIdx];
      const subYears = (years * DASHA_YEARS[subPlanet]) / 120;
      const subEnd = new Date(subDate);
      subEnd.setFullYear(subEnd.getFullYear() + Math.floor(subYears));
      subEnd.setMonth(subEnd.getMonth() + Math.floor((subYears % 1) * 12));

      subPeriods.push({
        planet: subPlanet,
        planetName: PLANET_NAME_MAP[subPlanet],
        startDate: subDate.toISOString().split('T')[0],
        endDate: subEnd.toISOString().split('T')[0],
        level: 'antar',
      });
      subDate = new Date(subEnd);
    }

    dashas.push({
      planet,
      planetName: PLANET_NAME_MAP[planet],
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      level: 'maha',
      subPeriods,
    });

    currentDate = new Date(endDate);
  }

  return dashas;
}

/**
 * Yogini Dasha calculation — 36-year cycle based on nakshatra
 */
const YOGINI_DASHAS = [
  { name: 'Mangala', planet: 'Moon', years: 1 },
  { name: 'Pingala', planet: 'Sun', years: 2 },
  { name: 'Dhanya', planet: 'Jupiter', years: 3 },
  { name: 'Bhramari', planet: 'Mars', years: 4 },
  { name: 'Bhadrika', planet: 'Mercury', years: 5 },
  { name: 'Ulka', planet: 'Saturn', years: 6 },
  { name: 'Siddha', planet: 'Venus', years: 7 },
  { name: 'Sankata', planet: 'Rahu', years: 8 },
];
const YOGINI_NAMES: Record<string, { en: string; hi: string; sa: string }> = {
  'Mangala': { en: 'Mangala', hi: 'मंगला', sa: 'मङ्गला' },
  'Pingala': { en: 'Pingala', hi: 'पिंगला', sa: 'पिङ्गला' },
  'Dhanya': { en: 'Dhanya', hi: 'धान्या', sa: 'धान्या' },
  'Bhramari': { en: 'Bhramari', hi: 'भ्रामरी', sa: 'भ्रामरी' },
  'Bhadrika': { en: 'Bhadrika', hi: 'भद्रिका', sa: 'भद्रिका' },
  'Ulka': { en: 'Ulka', hi: 'उल्का', sa: 'उल्का' },
  'Siddha': { en: 'Siddha', hi: 'सिद्धा', sa: 'सिद्धा' },
  'Sankata': { en: 'Sankata', hi: 'संकटा', sa: 'सङ्कटा' },
};

function calculateYoginiDasha(moonSidLong: number, birthDate: Date): DashaEntry[] {
  const nakshatraIndex = Math.floor(moonSidLong / (360 / 27));
  // Yogini lord from nakshatra: (nakshatra + 3) mod 8
  const startIdx = (nakshatraIndex + 3) % 8;
  const nakshatraSpan = 360 / 27;
  const posInNakshatra = (moonSidLong % nakshatraSpan) / nakshatraSpan;
  const totalYears = YOGINI_DASHAS[startIdx].years;
  const remainingYears = totalYears * (1 - posInNakshatra);

  const dashas: DashaEntry[] = [];
  let currentDate = new Date(birthDate);

  for (let i = 0; i < 8; i++) {
    const idx = (startIdx + i) % 8;
    const yogini = YOGINI_DASHAS[idx];
    const years = i === 0 ? remainingYears : yogini.years;
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + Math.floor(years));
    endDate.setMonth(endDate.getMonth() + Math.floor((years % 1) * 12));

    dashas.push({
      planet: yogini.planet,
      planetName: YOGINI_NAMES[yogini.name],
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      level: 'maha',
    });
    currentDate = new Date(endDate);
  }
  return dashas;
}

/**
 * Ashtottari Dasha calculation — 108-year cycle
 */
const ASHTOTTARI_DASHAS = [
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 15 },
  { planet: 'Mars', years: 8 },
  { planet: 'Mercury', years: 17 },
  { planet: 'Saturn', years: 10 },
  { planet: 'Jupiter', years: 19 },
  { planet: 'Rahu', years: 12 },
  { planet: 'Venus', years: 21 },
];
// Ashtottari uses only specific nakshatras (those NOT ruled by Ketu)
const ASHTOTTARI_NAKSHATRA_MAP = [
  0, 1, 2, 3, 4, 5, 6, 7, // Ashvini-Pushya → Sun-Venus cycle
  0, 1, 2, 3, 4, 5, 6, 7,
  0, 1, 2, 3, 4, 5, 6, 7,
  0, 1, 2,
];

function calculateAshtottariDasha(moonSidLong: number, birthDate: Date): DashaEntry[] {
  const nakshatraIndex = Math.floor(moonSidLong / (360 / 27));
  const startIdx = ASHTOTTARI_NAKSHATRA_MAP[nakshatraIndex] || 0;
  const nakshatraSpan = 360 / 27;
  const posInNakshatra = (moonSidLong % nakshatraSpan) / nakshatraSpan;
  const totalYears = ASHTOTTARI_DASHAS[startIdx].years;
  const remainingYears = totalYears * (1 - posInNakshatra);

  const dashas: DashaEntry[] = [];
  let currentDate = new Date(birthDate);

  for (let i = 0; i < 8; i++) {
    const idx = (startIdx + i) % 8;
    const dasha = ASHTOTTARI_DASHAS[idx];
    const years = i === 0 ? remainingYears : dasha.years;
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + Math.floor(years));
    endDate.setMonth(endDate.getMonth() + Math.floor((years % 1) * 12));

    dashas.push({
      planet: dasha.planet,
      planetName: PLANET_NAME_MAP[dasha.planet],
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      level: 'maha',
    });
    currentDate = new Date(endDate);
  }
  return dashas;
}

/**
 * Calculate simplified Shadbala
 */
function calculateShadbala(planets: PlanetPosition[]): ShadBala[] {
  return planets.filter(p => p.planet.id <= 6).map((p) => {
    // Simplified strength calculation
    const sthanaBala = p.isExalted ? 80 : p.isDebilitated ? 20 : p.isOwnSign ? 70 : 50;
    const digBala = Math.random() * 40 + 30; // Would need house-based calc
    const kalaBala = Math.random() * 30 + 35;
    const cheshtaBala = Math.abs(p.speed) > 0.5 ? 60 : 40;
    const naisargikaBala = [60, 51, 17, 25, 34, 42, 8][p.planet.id] || 30;
    const drikBala = Math.random() * 30 + 20;
    const total = (sthanaBala + digBala + kalaBala + cheshtaBala + naisargikaBala + drikBala) / 6;

    return {
      planet: p.planet.name.en,
      planetName: p.planet.name,
      totalStrength: Math.round(total),
      sthanaBala: Math.round(sthanaBala),
      digBala: Math.round(digBala),
      kalaBala: Math.round(kalaBala),
      cheshtaBala: Math.round(cheshtaBala),
      naisargikaBala: Math.round(naisargikaBala),
      drikBala: Math.round(drikBala),
    };
  });
}

/**
 * Generate Navamsha (D9) chart data
 */
function calculateNavamsha(planets: PlanetPosition[], ascDeg: number): ChartData {
  const navAscDeg = normalizeDeg(ascDeg * 9);
  const navAscSign = Math.floor(navAscDeg / 30) + 1;
  const houses: number[][] = Array.from({ length: 12 }, () => []);

  planets.forEach((p) => {
    const navDeg = normalizeDeg((p.longitude % 30) * (360 / 30) * (30 / (360/9)));
    const sidLong = p.longitude;
    // Navamsha sign: each 3°20' = one navamsha
    const navamshaIndex = Math.floor((sidLong % 30) / (30/9));
    const startSign = Math.floor(sidLong / 30);
    // Navamsha sign depends on the rashi element
    const element = startSign % 4; // 0=fire, 1=earth, 2=air, 3=water
    const navSign = ((element * 9 + navamshaIndex) % 12) + 1;
    const houseNum = ((navSign - navAscSign + 12) % 12);
    houses[houseNum].push(p.planet.id);
  });

  return { houses, ascendantDeg: navAscDeg, ascendantSign: navAscSign };
}

/**
 * Bhav Chalit Chart — mid-cusp house system
 * Each house midpoint = cusp degree, so house spans from midpoint-15° to midpoint+15°
 */
function calculateBhavChalit(planets: PlanetPosition[], ascDeg: number): ChartData {
  // In Bhav Chalit, the Ascendant is the midpoint of House 1
  // House 1 spans from (Asc - 15°) to (Asc + 15°)
  const bhavCusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    bhavCusps.push(normalizeDeg(ascDeg - 15 + i * 30));
  }

  const houses: number[][] = Array.from({ length: 12 }, () => []);
  planets.forEach((p) => {
    const house = getHouse(p.longitude, bhavCusps);
    houses[house - 1].push(p.planet.id);
  });

  return { houses, ascendantDeg: ascDeg, ascendantSign: getRashiNumber(ascDeg) };
}

/**
 * Generic Divisional Chart calculator — Parashara Varga system
 * Supports D2-D60 using classical Parashara rules
 */
function getDivisionalSign(sidLong: number, division: number): number {
  const signIndex = Math.floor(sidLong / 30); // 0-based sign (0=Aries)
  const degInSign = sidLong % 30;
  const partSize = 30 / division;
  const part = Math.floor(degInSign / partSize);

  switch (division) {
    case 2: // Hora: odd sign → Sun(Leo=4)/Moon(Cancer=3); even → Moon/Sun
      return signIndex % 2 === 0
        ? (part === 0 ? 5 : 4) // odd sign: Leo then Cancer
        : (part === 0 ? 4 : 5); // even sign: Cancer then Leo
    case 3: { // Drekkana: 1st=same, 2nd=5th, 3rd=9th
      const offsets = [0, 4, 8];
      return ((signIndex + offsets[part]) % 12) + 1;
    }
    case 4: { // Chaturthamsha: movable→same, fixed→4th, dual→7th
      const signType = signIndex % 3; // 0=movable, 1=fixed, 2=dual
      const startOffset = [0, 3, 6][signType];
      return ((signIndex + startOffset + part) % 12) + 1;
    }
    case 5: // Panchamsha (Rishi division) — simplified cyclic
      return ((signIndex + part) % 12) + 1;
    case 6: // Shashthamsha: odd from Aries(0), even from Libra(6)
      return ((signIndex % 2 === 0 ? 0 : 6) + part) % 12 + 1;
    case 7: // Saptamsha: odd from same sign, even from 7th
      return ((signIndex % 2 === 0 ? signIndex : signIndex + 6) + part) % 12 + 1;
    case 8: // Ashtamsha: movable→same, fixed→9th, dual→5th
      return (((signIndex % 3 === 0 ? signIndex : signIndex % 3 === 1 ? signIndex + 8 : signIndex + 4) + part) % 12) + 1;
    case 10: // Dasamsha: odd from same, even from 9th
      return ((signIndex + (signIndex % 2 === 0 ? 0 : 8) + part) % 12) + 1;
    case 12: // Dwadasamsha: from same sign
      return ((signIndex + part) % 12) + 1;
    case 16: { // Shodasamsha: movable→Aries, fixed→Leo, dual→Sagittarius
      const start16 = [0, 4, 8][signIndex % 3];
      return ((start16 + part) % 12) + 1;
    }
    case 20: { // Vimshamsha: movable→Aries, fixed→Sagittarius, dual→Leo
      const start20 = [0, 8, 4][signIndex % 3];
      return ((start20 + part) % 12) + 1;
    }
    case 24: // Chaturvimshamsha: odd from Leo(4), even from Cancer(3)
      return ((signIndex % 2 === 0 ? 4 : 3) + part) % 12 + 1;
    case 27: { // Nakshatramsha: fire→Aries, earth→Cancer, air→Libra, water→Capricorn
      const elem27 = signIndex % 4;
      const start27 = [0, 3, 6, 9][elem27];
      return ((start27 + part) % 12) + 1;
    }
    case 30: { // Trimshamsha: unequal parts (5°,5°,8°,7°,5°) mapped to Mars,Sat,Jup,Merc,Ven signs
      // Odd signs: Mars(Aries=0),Sat(Aqua=10),Jup(Sag=8),Merc(Gem=2),Ven(Libra=6)
      // Even signs: Ven,Merc,Jup,Sat,Mars
      const bounds = [5, 10, 18, 25, 30];
      let p30 = 0;
      for (let b = 0; b < bounds.length; b++) { if (degInSign < bounds[b]) { p30 = b; break; } }
      const oddSigns = [1, 11, 9, 3, 7]; // 1-based
      const evenSigns = [7, 3, 9, 11, 1];
      return signIndex % 2 === 0 ? oddSigns[p30] : evenSigns[p30];
    }
    case 40: // Khavedamsha: odd from Aries, even from Libra
      return ((signIndex % 2 === 0 ? 0 : 6) + part) % 12 + 1;
    case 45: { // Akshavedamsha: movable→Aries, fixed→Leo, dual→Sagittarius
      const start45 = [0, 4, 8][signIndex % 3];
      return ((start45 + part) % 12) + 1;
    }
    case 60: // Shashtiamsha: from same sign (cyclic)
      return ((signIndex + part) % 12) + 1;
    default: // Generic cyclic from same sign
      return ((signIndex + part) % 12) + 1;
  }
}

function calculateDivisionalChart(
  planets: PlanetPosition[],
  ascDeg: number,
  division: number,
): ChartData {
  const divAscSign = getDivisionalSign(normalizeDeg(ascDeg), division);
  const divAscDeg = normalizeDeg(ascDeg * division);

  const houses: number[][] = Array.from({ length: 12 }, () => []);
  planets.forEach((p) => {
    const divSign = getDivisionalSign(p.longitude, division);
    const houseNum = ((divSign - divAscSign + 12) % 12);
    houses[houseNum].push(p.planet.id);
  });

  return { houses, ascendantDeg: divAscDeg, ascendantSign: divAscSign };
}

/**
 * Ashtakavarga — Bhinnashtakavarga + Sarvashtakavarga
 * Each of the 7 planets (Sun-Saturn) gets bindu points (0-8) per sign
 * Based on relative positions from natal planets and ascendant
 */

// Benefic positions (houses from which each planet gives bindu)
// Key: contributing planet -> benefic houses from itself
const ASHTAKAVARGA_RULES: Record<number, Record<number, number[]>> = {
  // Sun's BAV: positions from each planet where Sun gets bindu
  0: {
    0: [1, 2, 4, 7, 8, 9, 10, 11],   // from Sun
    1: [3, 6, 10, 11],                 // from Moon
    2: [1, 2, 4, 7, 8, 9, 10, 11],   // from Mars
    3: [3, 5, 6, 9, 10, 11, 12],     // from Mercury
    4: [5, 6, 9, 11],                 // from Jupiter
    5: [6, 7, 12],                    // from Venus
    6: [1, 2, 4, 7, 8, 9, 10, 11],   // from Saturn
    99: [3, 4, 6, 10, 11, 12],        // from Ascendant
  },
  // Moon's BAV
  1: {
    0: [3, 6, 7, 8, 10, 11],
    1: [1, 3, 6, 7, 10, 11],
    2: [2, 3, 5, 6, 9, 10, 11],
    3: [1, 3, 4, 5, 7, 8, 10, 11],
    4: [1, 4, 7, 8, 10, 11, 12],
    5: [3, 4, 5, 7, 9, 10, 11],
    6: [3, 5, 6, 11],
    99: [3, 6, 10, 11],
  },
  // Mars' BAV
  2: {
    0: [3, 5, 6, 10, 11],
    1: [3, 6, 11],
    2: [1, 2, 4, 7, 8, 10, 11],
    3: [3, 5, 6, 11],
    4: [6, 10, 11, 12],
    5: [6, 8, 11, 12],
    6: [1, 4, 7, 8, 9, 10, 11],
    99: [1, 3, 6, 10, 11],
  },
  // Mercury's BAV
  3: {
    0: [5, 6, 9, 11, 12],
    1: [2, 4, 6, 8, 10, 11],
    2: [1, 2, 4, 7, 8, 9, 10, 11],
    3: [1, 3, 5, 6, 9, 10, 11, 12],
    4: [6, 8, 11, 12],
    5: [1, 2, 3, 4, 5, 8, 9, 11],
    6: [1, 2, 4, 7, 8, 9, 10, 11],
    99: [1, 2, 4, 6, 8, 10, 11],
  },
  // Jupiter's BAV
  4: {
    0: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    1: [2, 5, 7, 9, 11],
    2: [1, 2, 4, 7, 8, 10, 11],
    3: [1, 2, 4, 5, 6, 9, 10, 11],
    4: [1, 2, 3, 4, 7, 8, 10, 11],
    5: [2, 5, 6, 9, 10, 11],
    6: [3, 5, 6, 12],
    99: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  // Venus' BAV
  5: {
    0: [8, 11, 12],
    1: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    2: [3, 5, 6, 9, 11, 12],
    3: [3, 5, 6, 9, 11],
    4: [5, 8, 9, 10, 11],
    5: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    6: [3, 4, 5, 8, 9, 10, 11],
    99: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  // Saturn's BAV
  6: {
    0: [1, 2, 4, 7, 8, 10, 11],
    1: [3, 6, 11],
    2: [3, 5, 6, 10, 11, 12],
    3: [6, 8, 9, 10, 11, 12],
    4: [5, 6, 11, 12],
    5: [6, 11, 12],
    6: [3, 5, 6, 11],
    99: [1, 3, 4, 6, 10, 11],
  },
};

function calculateAshtakavarga(planets: PlanetPosition[], ascSign: number): AshtakavargaData {
  const planetIds = [0, 1, 2, 3, 4, 5, 6]; // Sun through Saturn
  const bpiTable: number[][] = []; // 7 planets x 12 signs

  // Get sign positions of all planets and ascendant
  const signPositions: Record<number, number> = {};
  planets.forEach(p => { signPositions[p.planet.id] = p.sign; });
  signPositions[99] = ascSign; // Ascendant as contributor

  for (const targetPlanet of planetIds) {
    const row: number[] = new Array(12).fill(0);
    const rules = ASHTAKAVARGA_RULES[targetPlanet];

    for (const contributorId of [...planetIds, 99]) {
      const contribSign = signPositions[contributorId];
      if (contribSign === undefined || !rules[contributorId]) continue;

      for (const house of rules[contributorId]) {
        // house is 1-based offset from contributor's sign
        const targetSign = ((contribSign - 1 + house - 1) % 12); // 0-based index
        row[targetSign]++;
      }
    }
    bpiTable.push(row);
  }

  // Sarvashtakavarga: sum across all planets per sign
  const savTable: number[] = new Array(12).fill(0);
  for (let s = 0; s < 12; s++) {
    for (let p = 0; p < 7; p++) {
      savTable[s] += bpiTable[p][s];
    }
  }

  const planetNames = planetIds.map(id => GRAHAS[id].name.en);
  return { bpiTable, savTable, planetNames };
}

/**
 * Main Kundali generation function
 */
export function generateKundali(birthData: BirthData): KundaliData {
  const [year, month, day] = birthData.date.split('-').map(Number);
  const [hour, minute] = birthData.time.split(':').map(Number);
  const decimalHour = hour + minute / 60;

  // Convert local time to UT
  const tzOffset = parseFloat(birthData.timezone) || 5.5;
  const utHour = decimalHour - tzOffset;

  const jd = dateToJD(year, month, day, utHour);
  const ayanamshaValue = lahiriAyanamsha(jd);

  // Ascendant
  const tropicalAsc = calculateAscendant(jd, birthData.lat, birthData.lng);
  const siderealAsc = toSidereal(tropicalAsc, jd);
  const ascSign = getRashiNumber(siderealAsc);

  // House cusps
  const cuspDegrees = calculateHouses(siderealAsc);
  const houses: HouseCusp[] = cuspDegrees.map((deg, i) => {
    const sign = getRashiNumber(deg);
    const rashi = RASHIS[sign - 1];
    return {
      house: i + 1,
      degree: deg,
      sign,
      signName: rashi.name,
      lord: rashi.ruler,
      lordName: rashi.rulerName,
    };
  });

  // Planetary positions
  const rawPlanets = getPlanetaryPositions(jd);
  const sunRawLong = toSidereal(rawPlanets.find(p => p.id === 0)!.longitude, jd);
  const planets: PlanetPosition[] = rawPlanets.map((p) => {
    const graha = GRAHAS[p.id];
    const sidLong = toSidereal(p.longitude, jd);
    const sign = getRashiNumber(sidLong);
    const nakNum = getNakshatraNumber(sidLong);
    const pada = getNakshatraPada(sidLong);
    const house = getHouse(sidLong, cuspDegrees);
    const rashi = RASHIS[sign - 1];
    const nak = NAKSHATRAS[nakNum - 1];
    const coords = computeFullCoordinates(p.id, sidLong, jd);

    return {
      planet: graha,
      longitude: sidLong,
      latitude: coords.latitude,
      speed: p.speed,
      sign,
      signName: rashi.name,
      house,
      nakshatra: nak,
      pada,
      degree: formatDegrees(sidLong % 30),
      isRetrograde: p.isRetrograde,
      isCombust: computeCombust(p.id, sidLong, sunRawLong),
      isExalted: EXALTATION[p.id] === sign,
      isDebilitated: DEBILITATION[p.id] === sign,
      isOwnSign: (OWN_SIGNS[p.id] || []).includes(sign),
    };
  });

  // Build D1 chart data
  const chart: ChartData = {
    houses: Array.from({ length: 12 }, () => [] as number[]),
    ascendantDeg: siderealAsc,
    ascendantSign: ascSign,
  };
  planets.forEach((p) => {
    const houseIndex = p.house - 1;
    chart.houses[houseIndex].push(p.planet.id);
  });

  // Navamsha
  const navamshaChart = calculateNavamsha(planets, siderealAsc);

  // Bhav Chalit
  const bhavChalitChart = calculateBhavChalit(planets, siderealAsc);

  // Divisional Charts — all 16 Parashara Shodashavarga + extras
  const VARGA_DEFS: { key: string; div: number; label: { en: string; hi: string; sa: string }; meaning: { en: string; hi: string } }[] = [
    { key: 'D2', div: 2, label: { en: 'Hora (D2)', hi: 'होरा (D2)', sa: 'होरा (D2)' }, meaning: { en: 'Wealth & financial prosperity', hi: 'धन एवं वित्तीय समृद्धि' } },
    { key: 'D3', div: 3, label: { en: 'Drekkana (D3)', hi: 'द्रेष्काण (D3)', sa: 'द्रेष्काणः (D3)' }, meaning: { en: 'Siblings, courage & co-borns', hi: 'भाई-बहन, साहस एवं सहोदर' } },
    { key: 'D4', div: 4, label: { en: 'Chaturthamsha (D4)', hi: 'चतुर्थांश (D4)', sa: 'चतुर्थांशः (D4)' }, meaning: { en: 'Property, fortune & fixed assets', hi: 'संपत्ति, भाग्य एवं स्थावर संपदा' } },
    { key: 'D5', div: 5, label: { en: 'Panchamsha (D5)', hi: 'पंचमांश (D5)', sa: 'पञ्चमांशः (D5)' }, meaning: { en: 'Fame, authority & spiritual merit', hi: 'यश, अधिकार एवं पुण्य' } },
    { key: 'D6', div: 6, label: { en: 'Shashthamsha (D6)', hi: 'षष्ठांश (D6)', sa: 'षष्ठांशः (D6)' }, meaning: { en: 'Health, disease & enemies', hi: 'स्वास्थ्य, रोग एवं शत्रु' } },
    { key: 'D7', div: 7, label: { en: 'Saptamsha (D7)', hi: 'सप्तमांश (D7)', sa: 'सप्तमांशः (D7)' }, meaning: { en: 'Children & progeny', hi: 'संतान एवं वंशवृद्धि' } },
    { key: 'D8', div: 8, label: { en: 'Ashtamsha (D8)', hi: 'अष्टमांश (D8)', sa: 'अष्टमांशः (D8)' }, meaning: { en: 'Longevity & unexpected events', hi: 'दीर्घायु एवं अप्रत्याशित घटनाएं' } },
    { key: 'D10', div: 10, label: { en: 'Dasamsha (D10)', hi: 'दशांश (D10)', sa: 'दशांशः (D10)' }, meaning: { en: 'Career, profession & public life', hi: 'करियर, व्यवसाय एवं सार्वजनिक जीवन' } },
    { key: 'D12', div: 12, label: { en: 'Dwadasamsha (D12)', hi: 'द्वादशांश (D12)', sa: 'द्वादशांशः (D12)' }, meaning: { en: 'Parents, ancestry & lineage', hi: 'माता-पिता, वंशावली' } },
    { key: 'D16', div: 16, label: { en: 'Shodasamsha (D16)', hi: 'षोडशांश (D16)', sa: 'षोडशांशः (D16)' }, meaning: { en: 'Vehicles, comforts & luxuries', hi: 'वाहन, सुख एवं विलासिता' } },
    { key: 'D20', div: 20, label: { en: 'Vimshamsha (D20)', hi: 'विंशांश (D20)', sa: 'विंशांशः (D20)' }, meaning: { en: 'Spiritual progress & upasana', hi: 'आध्यात्मिक प्रगति एवं उपासना' } },
    { key: 'D24', div: 24, label: { en: 'Chaturvimshamsha (D24)', hi: 'चतुर्विंशांश (D24)', sa: 'चतुर्विंशांशः (D24)' }, meaning: { en: 'Education, learning & knowledge', hi: 'शिक्षा, विद्या एवं ज्ञान' } },
    { key: 'D27', div: 27, label: { en: 'Nakshatramsha (D27)', hi: 'नक्षत्रांश (D27)', sa: 'नक्षत्रांशः (D27)' }, meaning: { en: 'Strengths, vitality & stamina', hi: 'बल, ओज एवं सहनशक्ति' } },
    { key: 'D30', div: 30, label: { en: 'Trimshamsha (D30)', hi: 'त्रिंशांश (D30)', sa: 'त्रिंशांशः (D30)' }, meaning: { en: 'Misfortunes, evils & suffering', hi: 'दुर्भाग्य, पाप एवं कष्ट' } },
    { key: 'D40', div: 40, label: { en: 'Khavedamsha (D40)', hi: 'खवेदांश (D40)', sa: 'खवेदांशः (D40)' }, meaning: { en: 'Auspicious/inauspicious (maternal)', hi: 'शुभाशुभ प्रभाव (मातृपक्ष)' } },
    { key: 'D45', div: 45, label: { en: 'Akshavedamsha (D45)', hi: 'अक्षवेदांश (D45)', sa: 'अक्षवेदांशः (D45)' }, meaning: { en: 'General indications (paternal)', hi: 'सामान्य संकेत (पितृपक्ष)' } },
    { key: 'D60', div: 60, label: { en: 'Shashtiamsha (D60)', hi: 'षष्ट्यंश (D60)', sa: 'षष्ट्यंशः (D60)' }, meaning: { en: 'Past life karma & overall assessment', hi: 'पूर्वजन्म कर्म एवं समग्र मूल्यांकन' } },
  ];
  const divisionalCharts: Record<string, DivisionalChart & { meaning?: { en: string; hi: string } }> = {};
  for (const v of VARGA_DEFS) {
    const chartData = calculateDivisionalChart(planets, siderealAsc, v.div);
    divisionalCharts[v.key] = { ...chartData, division: v.key, label: v.label, meaning: v.meaning };
  }

  // Ashtakavarga
  const ashtakavarga = calculateAshtakavarga(planets, ascSign);

  // Dasha
  const moonPlanet = planets.find((p) => p.planet.id === 1);
  const moonSidLong = moonPlanet?.longitude || 0;
  const birthDate = new Date(year, month - 1, day, hour, minute);
  const dashas = calculateVimshottariDasha(moonSidLong, birthDate);
  const yoginiDashas = calculateYoginiDasha(moonSidLong, birthDate);
  const ashtottariDashas = calculateAshtottariDasha(moonSidLong, birthDate);

  // Shadbala (legacy simplified)
  const shadbala = calculateShadbala(planets);

  // --- Extended calculations for new tabs ---

  // Graha Details (with RA, Declination)
  const grahaDetails: GrahaDetail[] = planets.map(p => {
    const coords = computeFullCoordinates(p.planet.id, p.longitude, jd);
    const nakData = NAKSHATRAS[getNakshatraNumber(p.longitude) - 1];
    return {
      planetId: p.planet.id,
      planetName: p.planet.name,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      longitude: p.longitude,
      signDegree: p.degree,
      sign: p.sign,
      signName: p.signName,
      nakshatra: getNakshatraNumber(p.longitude),
      nakshatraName: p.nakshatra.name,
      nakshatraLord: nakData.rulerName,
      nakshatraPada: p.pada,
      latitude: coords.latitude,
      rightAscension: coords.rightAscension,
      declination: coords.declination,
      speed: p.speed,
    };
  });

  // Upagrahas (based on birth Sun position)
  const sunLong = planets.find(p => p.planet.id === 0)!.longitude;
  const upagrahaCalcs = [
    { nameEn: 'Dhuma', nameHi: 'धूम', nameSa: 'धूमः', long: normalizeDeg(sunLong + 133 + 20 / 60) },
    { nameEn: 'Vyatipata', nameHi: 'व्यतीपात', nameSa: 'व्यतीपातः', long: 0 },
    { nameEn: 'Parivesha', nameHi: 'परिवेष', nameSa: 'परिवेषः', long: 0 },
    { nameEn: 'Chapa', nameHi: 'चाप', nameSa: 'चापः', long: 0 },
    { nameEn: 'Upaketu', nameHi: 'उपकेतु', nameSa: 'उपकेतुः', long: 0 },
  ];
  upagrahaCalcs[1].long = normalizeDeg(360 - upagrahaCalcs[0].long);
  upagrahaCalcs[2].long = normalizeDeg(upagrahaCalcs[1].long + 180);
  upagrahaCalcs[3].long = normalizeDeg(360 - upagrahaCalcs[2].long);
  upagrahaCalcs[4].long = normalizeDeg(upagrahaCalcs[3].long + 16 + 40 / 60);

  const upagrahas: UpagrahaPosition[] = upagrahaCalcs.map(u => {
    const sign = getRashiNumber(u.long);
    const nakNum = getNakshatraNumber(u.long);
    return {
      name: { en: u.nameEn, hi: u.nameHi, sa: u.nameSa },
      longitude: u.long,
      sign,
      signName: RASHIS[sign - 1].name,
      degree: formatDegrees(u.long % 30),
      nakshatra: NAKSHATRAS[nakNum - 1].name,
    };
  });

  // Full Shadbala
  const navChart = navamshaChart;
  const fullShadbala = calculateFullShadbala({
    planets: planets.filter(p => p.planet.id <= 6).map(p => {
      // Compute navamsha sign for this planet
      const sidLong = p.longitude;
      const navamshaIndex = Math.floor((sidLong % 30) / (30 / 9));
      const startSign = Math.floor(sidLong / 30);
      const element = startSign % 4;
      const navSign = ((element * 9 + navamshaIndex) % 12) + 1;
      return {
        id: p.planet.id,
        longitude: p.longitude,
        speed: p.speed,
        house: p.house,
        sign: p.sign,
        isRetrograde: p.isRetrograde,
        isExalted: p.isExalted,
        isDebilitated: p.isDebilitated,
        isOwnSign: p.isOwnSign,
        navamshaSign: navSign,
      };
    }),
    ascendantDeg: siderealAsc,
    julianDay: jd,
    birthDateObj: birthDate,
    latitude: birthData.lat,
    longitude: birthData.lng,
    timezone: tzOffset,
  });

  // Bhavabala
  const shadbalaRupas: Record<number, number> = {};
  fullShadbala.forEach(s => { shadbalaRupas[s.planetId] = s.rupas; });
  const bhavabala = calculateBhavabala({
    houses: houses.map(h => ({ house: h.house, degree: h.degree, sign: h.sign, lord: h.lord })),
    planets: planets.map(p => ({ id: p.planet.id, longitude: p.longitude, house: p.house, sign: p.sign, speed: p.speed })),
    shadbalaRupas,
    ascendantDeg: siderealAsc,
  });

  // Complete Yogas (50+)
  const yogasComplete = detectAllYogas(
    planets.map(p => ({
      id: p.planet.id,
      longitude: p.longitude,
      house: p.house,
      sign: p.sign,
      speed: p.speed,
      isRetrograde: p.isRetrograde,
      isExalted: p.isExalted,
      isDebilitated: p.isDebilitated,
      isOwnSign: p.isOwnSign,
    })),
    ascSign
  );

  return {
    birthData,
    ascendant: {
      degree: siderealAsc,
      sign: ascSign,
      signName: RASHIS[ascSign - 1].name,
    },
    planets,
    houses,
    chart,
    navamshaChart,
    bhavChalitChart,
    divisionalCharts,
    ashtakavarga,
    dashas,
    yoginiDashas,
    ashtottariDashas,
    shadbala,
    ayanamshaValue,
    julianDay: jd,
    grahaDetails,
    upagrahas,
    fullShadbala,
    bhavabala,
    yogasComplete,
    jaimini: calculateJaimini(planets, ascSign, birthDate),
  };
}
