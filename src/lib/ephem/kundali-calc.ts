import type { LocaleText } from '@/types/panchang';
import {
  dateToJD, sunLongitude, moonLongitude, toSidereal,
  getRashiNumber, getNakshatraNumber, getNakshatraPada,
  getPlanetaryPositions, lahiriAyanamsha, getAyanamsha, normalizeDeg, formatDegrees, approximateSunrise,
} from './astronomical';
import { computeFullCoordinates, computeCombust } from './coordinates';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { GRAHAS } from '@/lib/constants/grahas';
import type { KundaliData, BirthData, PlanetPosition, HouseCusp, ChartData, DashaEntry, ShadBala, DivisionalChart, AshtakavargaData, GrahaDetail, UpagrahaPosition } from '@/types/kundali';
import { resolveTimezone } from '@/lib/utils/timezone';
import { calculateJaimini } from '@/lib/jaimini/jaimini-calc';
import { calculateAshtottariDashas as calculateAshtottariDashaFull } from '@/lib/kundali/ashtottari-dasha';
import { calculateYoginiDashas as calculateYoginiDashaFull } from '@/lib/kundali/yogini-dasha';
import { calculateFullShadbala } from '@/lib/kundali/shadbala';
import { calculateBhavabala } from '@/lib/kundali/bhavabala';
import { detectAllYogas } from '@/lib/kundali/yogas-complete';
import { analyzeSadeSati } from '@/lib/kundali/sade-sati-analysis';
import { calculateSpecialLagnas } from '@/lib/kundali/special-lagnas';
import { calculateVimshopakaBala } from '@/lib/kundali/vimshopaka';
import { calculateNarayanaDasha, calculateShoolaDasha, calculateSthiraDasha, calculateKalachakraDasha, calculateSudarsanaDasha, calculateShodasottariDasha, calculateDwadasottariDasha, calculatePanchottariDasha, calculateSatabdikaDasha, calculateChaturaaseethiDasha, calculateShashtihayaniDasha, calculateMandookaDasha, calculateDrigDasha, calculateMoolaDasha, calculateNavamshaDasha, calculateNaisargikaDasha, calculateTaraDasha, calculateTithiAshtottariDasha, calculateYogaVimsottariDasha, calculateBuddhiGathiDasha } from '@/lib/kundali/additional-dashas';
import { calculateAvasthas } from '@/lib/kundali/avasthas';
import { calculateArgala } from '@/lib/kundali/argala';
import { calculateSphutas } from '@/lib/kundali/sphutas';
import { detectGrahaYuddha } from '@/lib/kundali/graha-yuddha';
import { calculateFunctionalNature } from '@/lib/kundali/functional-nature';

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
  asc = normalizeDeg(asc + 180);

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

const PLANET_NAME_MAP: Record<string, LocaleText> = {
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
    const endDate = new Date(currentDate.getTime() + years * 365.25 * 24 * 60 * 60 * 1000);

    // Calculate sub-periods (Antardasha)
    const subPeriods: DashaEntry[] = [];
    let subDate = new Date(currentDate);
    for (let j = 0; j < 9; j++) {
      const subIdx = (idx + j) % 9;
      const subPlanet = DASHA_ORDER[subIdx];
      const subYears = (years * DASHA_YEARS[subPlanet]) / 120;
      const subEnd = new Date(subDate.getTime() + subYears * 365.25 * 24 * 60 * 60 * 1000);

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
 * Delegates to the full engine in @/lib/kundali/yogini-dasha.ts
 * which has correct classical nakshatra-to-lord mapping and sub-periods.
 */
function calculateYoginiDasha(moonSidLong: number, birthDate: Date): DashaEntry[] {
  const nakshatraIndex = Math.floor(moonSidLong / (360 / 27));
  const nakshatraSpan = 360 / 27;
  const degreeInNakshatra = moonSidLong % nakshatraSpan;
  return calculateYoginiDashaFull(nakshatraIndex, degreeInNakshatra, birthDate);
}

/**
 * Ashtottari Dasha calculation — 108-year cycle
 * Delegates to the full engine in @/lib/kundali/ashtottari-dasha.ts
 * which has correct classical nakshatra-to-lord mapping and sub-periods.
 */
function calculateAshtottariDasha(moonSidLong: number, birthDate: Date): DashaEntry[] {
  const nakshatraIndex = Math.floor(moonSidLong / (360 / 27));
  const nakshatraSpan = 360 / 27;
  const degreeInNakshatra = moonSidLong % nakshatraSpan;
  return calculateAshtottariDashaFull(nakshatraIndex, degreeInNakshatra, birthDate);
}

/**
 * Calculate simplified Shadbala
 */
function calculateShadbala(planets: PlanetPosition[], ascDeg: number): ShadBala[] {
  return planets.filter(p => p.planet.id <= 6).map((p) => {
    // Simplified strength calculation
    const sthanaBala = p.isExalted ? 80 : p.isDebilitated ? 20 : p.isOwnSign ? 70 : 50;
    // Dig Bala: Sun/Mars strong in 10H, Moon/Venus in 4H, Jupiter/Mercury in 1H, Saturn in 7H
    const digBalaHouse = [10, 4, 10, 1, 1, 4, 7][p.planet.id];
    const houseNum = ((Math.floor(p.longitude / 30) - Math.floor(ascDeg / 30) + 12) % 12) + 1;
    const digBala = Math.abs(houseNum - digBalaHouse) <= 1 ? 60 : 30;
    const kalaBala = 35; // simplified deterministic value
    const cheshtaBala = Math.abs(p.speed) > 0.5 ? 60 : 40;
    const naisargikaBala = [60, 51, 17, 25, 34, 42, 8][p.planet.id] || 30;
    const drikBala = 30; // simplified deterministic value
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
  const navAscSign = getDivisionalSign(normalizeDeg(ascDeg), 9);
  const navAscDeg = (navAscSign - 1) * 30; // representative degree for the sign
  const houses: number[][] = Array.from({ length: 12 }, () => []);

  planets.forEach((p) => {
    const navSign = getDivisionalSign(p.longitude, 9);
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
    case 9: { // Navamsha: fire→Ar, earth→Cp, air→Li, water→Cn
      const elem9 = signIndex % 4; // 0=fire, 1=earth, 2=air, 3=water
      const start9 = [0, 9, 6, 3][elem9];
      return ((start9 + part) % 12) + 1;
    }
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
  const divAscDeg = (divAscSign - 1) * 30; // representative degree for the sign

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

  // Convert local time to UT (supports both numeric "5.5" and IANA "Asia/Kolkata" timezone strings)
  const tzOffset = resolveTimezone(birthData.timezone, year, month, day);
  const utHour = decimalHour - tzOffset;

  const jd = dateToJD(year, month, day, utHour);

  // Warn if date is outside the high-accuracy ayanamsha range (1900-2100)
  const warnings: string[] = [];
  if (year < 1900 || year > 2100) {
    warnings.push(`Ayanamsha accuracy degrades for dates outside 1900-2100 (birth year: ${year}). Rashi/nakshatra boundaries may shift by ±1°.`);
  }
  // Use selected ayanamsha system (default: lahiri)
  const ayanamshaType = (birthData.ayanamsha === 'raman' || birthData.ayanamsha === 'kp')
    ? birthData.ayanamsha : 'lahiri';
  const ayanamshaValue = getAyanamsha(jd, ayanamshaType);

  // Ascendant — apply selected ayanamsha
  const tropicalAsc = calculateAscendant(jd, birthData.lat, birthData.lng);
  const siderealAsc = normalizeDeg(tropicalAsc - ayanamshaValue);
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
  // Use selected ayanamsha for all sidereal conversions
  const toSid = (tropLong: number) => normalizeDeg(tropLong - ayanamshaValue);
  const sunRawLong = toSid(rawPlanets.find(p => p.id === 0)!.longitude);
  const planets: PlanetPosition[] = rawPlanets.map((p) => {
    const graha = GRAHAS[p.id];
    const sidLong = toSid(p.longitude);
    const sign = getRashiNumber(sidLong);
    const nakNum = getNakshatraNumber(sidLong);
    const pada = getNakshatraPada(sidLong);
    // Whole-sign house system (Rashi = Bhava): standard Vedic convention (BPHS).
    // Each sign IS a house. House 1 = ascendant sign, house 2 = next sign, etc.
    // Equal-house cusps are used only for Bhav Chalit (separate calculation).
    const house = ((sign - ascSign + 12) % 12) + 1;
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

  // Vargottama — planet occupies the same sidereal sign in both D1 and D9.
  //
  // HOW calculateNavamsha() STORES PLANETS:
  //   navamshaChart.houses is a 12-element array indexed by HOUSE NUMBER (0-based),
  //   where house 0 = the D9 ascendant sign, house 1 = D9 2nd house, etc.
  //   Concretely:  houseOffset = (navSign - navAscSign + 12) % 12
  //   So navamshaChart.houses[k] holds planets in the (D9 Asc + k)th sign from Aries.
  //
  // HISTORICAL BUG (now fixed): the code used signIdx (the loop variable over
  //   navamshaChart.houses) directly as a 0-based sign index from Aries.  This
  //   is only correct when the D9 ascendant is Aries (navAscSign = 1).  For any
  //   other D9 ascendant, signIdx is a house OFFSET, not a sign index, so
  //   Vargottama flags were wrong for the majority of charts.
  //
  // FIX: convert from house offset back to absolute 0-based sign index by adding
  //   the D9 ascendant sign back in:
  //     actualD9SignIdx = (navAscSign - 1 + houseOffset) % 12
  //   where navAscSign is 1-based (from navamshaChart.ascendantSign).
  const navAscSign = navamshaChart.ascendantSign; // 1-based (1=Aries … 12=Pisces)
  const navamshaSignMap = new Map<number, number>(); // planetId → actual D9 sign (0-based from Aries)
  navamshaChart.houses.forEach((planetIds, houseOffset) => {
    // houseOffset 0 = D9 ascendant sign, 1 = next sign clockwise, etc.
    const actualD9SignIdx = (navAscSign - 1 + houseOffset) % 12;
    planetIds.forEach((id) => navamshaSignMap.set(id, actualD9SignIdx));
  });
  planets.forEach((p) => {
    const d1SignIdx = p.sign - 1;                    // D1 sign, 0-based from Aries
    const d9SignIdx = navamshaSignMap.get(p.planet.id);
    // Vargottama: D1 sign index === D9 sign index (both 0-based from Aries)
    p.isVargottama = d9SignIdx !== undefined && d1SignIdx === d9SignIdx;
  });

  // Mrityu Bhaga — one dangerous degree per sign per planet (Narada Purana/BPHS tradition)
  // [planetId][signIndex 0-11] = mrityu bhaga degree within sign
  const MRITYU_BHAGA: number[][] = [
    // Sun:  Ar  Ta  Ge  Ca  Le  Vi  Li  Sc  Sa  Cp  Aq  Pi
    [        16,  6, 19, 26, 28, 22,  9, 19, 29,  3, 20, 23 ],
    // Moon: Ar  Ta  Ge  Ca  Le  Vi  Li  Sc  Sa  Cp  Aq  Pi
    [        26,  9,  3,  5, 16, 22, 28, 27,  1, 22, 21, 28 ],
    // Mars: Ar  Ta  Ge  Ca  Le  Vi  Li  Sc  Sa  Cp  Aq  Pi
    [        17, 29,  4,  6, 13, 20, 29, 28, 22,  8, 11, 20 ],
    // Merc: Ar  Ta  Ge  Ca  Le  Vi  Li  Sc  Sa  Cp  Aq  Pi
    [        22, 17, 29,  9, 22, 24, 16,  6, 14, 21,  7, 23 ],
    // Jup:  Ar  Ta  Ge  Ca  Le  Vi  Li  Sc  Sa  Cp  Aq  Pi
    [        18, 10, 23, 17,  2, 27, 21,  6, 22, 11, 17,  4 ],
    // Ven:  Ar  Ta  Ge  Ca  Le  Vi  Li  Sc  Sa  Cp  Aq  Pi
    [        23,  9, 28, 16, 11,  9, 29, 18, 20,  2, 24, 26 ],
    // Sat:  Ar  Ta  Ge  Ca  Le  Vi  Li  Sc  Sa  Cp  Aq  Pi
    [         8, 17, 26, 23, 12, 19,  7, 23, 20, 24, 29, 11 ],
    // Rahu: same as Saturn (traditional texts use Sat's table for nodes)
    [         8, 17, 26, 23, 12, 19,  7, 23, 20, 24, 29, 11 ],
    // Ketu: same as Mars
    [        17, 29,  4,  6, 13, 20, 29, 28, 22,  8, 11, 20 ],
  ];
  planets.forEach((p) => {
    const signIdx = p.sign - 1; // 0-based
    const degreeInSign = p.longitude % 30;
    const mrityu = MRITYU_BHAGA[p.planet.id]?.[signIdx];
    p.isMrityuBhaga = mrityu !== undefined && Math.abs(degreeInSign - mrityu) <= 1;
  });

  // Pushkar Navamsha — 24 auspicious navamsha positions (Saravali tradition)
  // Each navamsha is encoded as: signIdx(0-11) * 9 + navamshaIdx(0-8)
  // Aries d9-1, Aries d9-5, Taurus d9-5, Taurus d9-9, Gemini d9-3, Gemini d9-7,
  // Cancer d9-1, Cancer d9-7, Leo d9-1, Leo d9-5, Virgo d9-3, Virgo d9-7,
  // Libra d9-1, Libra d9-7, Scorpio d9-3, Scorpio d9-5, Sag d9-5, Sag d9-9,
  // Cap d9-3, Cap d9-7, Aqu d9-1, Aqu d9-7, Pis d9-3, Pis d9-5
  const PUSHKAR_NAV = new Set([
    0,   // Aries(0) navamsha 1(0)
    4,   // Aries(0) navamsha 5(4)
    13,  // Taurus(1) navamsha 5(4)
    17,  // Taurus(1) navamsha 9(8)
    20,  // Gemini(2) navamsha 3(2)
    24,  // Gemini(2) navamsha 7(6)
    27,  // Cancer(3) navamsha 1(0)
    33,  // Cancer(3) navamsha 7(6)
    36,  // Leo(4) navamsha 1(0)
    40,  // Leo(4) navamsha 5(4)
    47,  // Virgo(5) navamsha 3(2)
    51,  // Virgo(5) navamsha 7(6)
    54,  // Libra(6) navamsha 1(0)
    60,  // Libra(6) navamsha 7(6)
    65,  // Scorpio(7) navamsha 3(2)
    67,  // Scorpio(7) navamsha 5(4)
    76,  // Sagittarius(8) navamsha 5(4)
    80,  // Sagittarius(8) navamsha 9(8)
    83,  // Capricorn(9) navamsha 3(2)
    87,  // Capricorn(9) navamsha 7(6)
    90,  // Aquarius(10) navamsha 1(0)
    96,  // Aquarius(10) navamsha 7(6)
    101, // Pisces(11) navamsha 3(2)
    103, // Pisces(11) navamsha 5(4)
  ]);
  planets.forEach((p) => {
    const signIdx = p.sign - 1; // 0-based
    const navamshaIdx = Math.floor((p.longitude % 30) / (30 / 9)); // 0-8
    p.isPushkarNavamsha = PUSHKAR_NAV.has(signIdx * 9 + navamshaIdx);
  });

  // Pushkar Bhaga — most auspicious single degree per sign (Saravali tradition)
  // Orb: ±0.8 degrees
  const PUSHKAR_BHAGA: Record<number, number> = {
    1: 14, 2: 28, 3: 7, 4: 12, 5: 13, 6: 23,
    7: 8,  8: 18, 9: 9, 10: 22, 11: 17, 12: 17,
  };
  planets.forEach((p) => {
    const degInSign = p.longitude % 30;
    const pb = PUSHKAR_BHAGA[p.sign];
    p.isPushkarBhaga = pb !== undefined && Math.abs(degInSign - pb) <= 0.8;
  });

  // Bhav Chalit
  const bhavChalitChart = calculateBhavChalit(planets, siderealAsc);

  // Divisional Charts — all 16 Parashara Shodashavarga + extras
  const VARGA_DEFS: { key: string; div: number; label: LocaleText; meaning: LocaleText }[] = [
    { key: 'D2', div: 2, label: { en: 'D2 Hora', hi: 'D2 होरा', sa: 'D2 होरा' }, meaning: { en: 'Wealth & financial prosperity', hi: 'धन एवं वित्तीय समृद्धि', sa: 'धन एवं वित्तीय समृद्धि', mai: 'धन एवं वित्तीय समृद्धि', mr: 'धन एवं वित्तीय समृद्धि', ta: 'செல்வம் & நிதி வளம்', te: 'సంపద & ఆర్థిక సమృద్ధి', bn: 'ধন ও আর্থিক সমৃদ্ধি', kn: 'ಸಂಪತ್ತು & ಆರ್ಥಿಕ ಸಮೃದ್ಧಿ', gu: 'ધન અને આર્થિક સમૃદ્ધિ' } },
    { key: 'D3', div: 3, label: { en: 'D3 Drekkana', hi: 'D3 द्रेष्काण', sa: 'D3 द्रेष्काणः' }, meaning: { en: 'Siblings, courage & co-borns', hi: 'भाई-बहन, साहस एवं सहोदर', sa: 'भाई-बहन, साहस एवं सहोदर', mai: 'भाई-बहन, साहस एवं सहोदर', mr: 'भाई-बहन, साहस एवं सहोदर', ta: 'உடன்பிறப்புகள், தைரியம் & சகோதரர்கள்', te: 'సోదరులు, ధైర్యం & సహజాతులు', bn: 'ভাই-বোন, সাহস ও সহোদর', kn: 'ಒಡಹುಟ್ಟಿದವರು, ಧೈರ್ಯ & ಸಹೋದರರು', gu: 'ભાઈ-બહેન, સાહસ અને સહોદર' } },
    { key: 'D4', div: 4, label: { en: 'D4 Chaturthamsha', hi: 'D4 चतुर्थांश', sa: 'D4 चतुर्थांशः' }, meaning: { en: 'Property, fortune & fixed assets', hi: 'संपत्ति, भाग्य एवं स्थावर संपदा', sa: 'संपत्ति, भाग्य एवं स्थावर संपदा', mai: 'संपत्ति, भाग्य एवं स्थावर संपदा', mr: 'संपत्ति, भाग्य एवं स्थावर संपदा', ta: 'சொத்து, அதிர்ஷ்டம் & நிலையான சொத்துக்கள்', te: 'ఆస్తి, అదృష్టం & స్థిర ఆస్తులు', bn: 'সম্পত্তি, ভাগ্য ও স্থাবর সম্পদ', kn: 'ಆಸ್ತಿ, ಭಾಗ್ಯ & ಸ್ಥಿರ ಸ್ವತ್ತುಗಳು', gu: 'સંપત્તિ, ભાગ્ય અને સ્થાવર સંપદા' } },
    { key: 'D5', div: 5, label: { en: 'D5 Panchamsha', hi: 'D5 पंचमांश', sa: 'D5 पञ्चमांशः' }, meaning: { en: 'Fame, authority & spiritual merit', hi: 'यश, अधिकार एवं पुण्य', sa: 'यश, अधिकार एवं पुण्य', mai: 'यश, अधिकार एवं पुण्य', mr: 'यश, अधिकार एवं पुण्य', ta: 'புகழ், அதிகாரம் & ஆன்மீகப் புண்ணியம்', te: 'కీర్తి, అధికారం & పుణ్యం', bn: 'যশ, অধিকার ও পুণ্য', kn: 'ಕೀರ್ತಿ, ಅಧಿಕಾರ & ಪುಣ್ಯ', gu: 'યશ, અધિકાર અને પુણ્ય' } },
    { key: 'D6', div: 6, label: { en: 'D6 Shashthamsha', hi: 'D6 षष्ठांश', sa: 'D6 षष्ठांशः' }, meaning: { en: 'Health, disease & enemies', hi: 'स्वास्थ्य, रोग एवं शत्रु', sa: 'स्वास्थ्य, रोग एवं शत्रु', mai: 'स्वास्थ्य, रोग एवं शत्रु', mr: 'स्वास्थ्य, रोग एवं शत्रु', ta: 'ஆரோக்கியம், நோய் & எதிரிகள்', te: 'ఆరోగ్యం, రోగం & శత్రువులు', bn: 'স্বাস্থ্য, রোগ ও শত্রু', kn: 'ಆರೋಗ್ಯ, ರೋಗ & ಶತ್ರುಗಳು', gu: 'સ્વાસ્થ્ય, રોગ અને શત્રુ' } },
    { key: 'D7', div: 7, label: { en: 'D7 Saptamsha', hi: 'D7 सप्तमांश', sa: 'D7 सप्तमांशः' }, meaning: { en: 'Children & progeny', hi: 'संतान एवं वंशवृद्धि', sa: 'संतान एवं वंशवृद्धि', mai: 'संतान एवं वंशवृद्धि', mr: 'संतान एवं वंशवृद्धि', ta: 'குழந்தைகள் & சந்ததி', te: 'సంతానం & వంశవృద్ధి', bn: 'সন্তান ও বংশবৃদ্ধি', kn: 'ಮಕ್ಕಳು & ಸಂತತಿ', gu: 'સંતાન અને વંશવૃદ્ધિ' } },
    { key: 'D8', div: 8, label: { en: 'D8 Ashtamsha', hi: 'D8 अष्टमांश', sa: 'D8 अष्टमांशः' }, meaning: { en: 'Longevity & unexpected events', hi: 'दीर्घायु एवं अप्रत्याशित घटनाएं', sa: 'दीर्घायु एवं अप्रत्याशित घटनाएं', mai: 'दीर्घायु एवं अप्रत्याशित घटनाएं', mr: 'दीर्घायु एवं अप्रत्याशित घटनाएं', ta: 'நீண்ட ஆயுள் & எதிர்பாராத நிகழ்வுகள்', te: 'దీర్ఘాయుష్షు & ఊహించని సంఘటనలు', bn: 'দীর্ঘায়ু ও অপ্রত্যাশিত ঘটনা', kn: 'ದೀರ್ಘಾಯುಷ್ಯ & ಅನಿರೀಕ್ಷಿತ ಘಟನೆಗಳು', gu: 'દીર્ઘાયુ અને અણધારી ઘટનાઓ' } },
    { key: 'D10', div: 10, label: { en: 'D10 Dasamsha', hi: 'D10 दशांश', sa: 'D10 दशांशः' }, meaning: { en: 'Career, profession & public life', hi: 'करियर, व्यवसाय एवं सार्वजनिक जीवन', sa: 'करियर, व्यवसाय एवं सार्वजनिक जीवन', mai: 'करियर, व्यवसाय एवं सार्वजनिक जीवन', mr: 'करियर, व्यवसाय एवं सार्वजनिक जीवन', ta: 'தொழில், வாழ்வாதாரம் & பொது வாழ்க்கை', te: 'వృత్తి, ఉద్యోగం & సామాజిక జీవితం', bn: 'কর্মজীবন, পেশা ও সার্বজনীন জীবন', kn: 'ವೃತ್ತಿ, ಉದ್ಯೋಗ & ಸಾರ್ವಜನಿಕ ಜೀವನ', gu: 'કારકિર્દી, વ્યવસાય અને જાહેર જીવન' } },
    { key: 'D12', div: 12, label: { en: 'D12 Dwadasamsha', hi: 'D12 द्वादशांश', sa: 'D12 द्वादशांशः' }, meaning: { en: 'Parents, ancestry & lineage', hi: 'माता-पिता, वंशावली', sa: 'माता-पिता, वंशावली', mai: 'माता-पिता, वंशावली', mr: 'माता-पिता, वंशावली', ta: 'பெற்றோர், பூர்வீகம் & வம்சாவளி', te: 'తల్లిదండ్రులు, వంశావళి', bn: 'পিতা-মাতা, বংশাবলি', kn: 'ಹೆತ್ತವರು, ಪೂರ್ವಜರು & ವಂಶಾವಳಿ', gu: 'માતા-પિતા, વંશાવળી' } },
    { key: 'D16', div: 16, label: { en: 'D16 Shodasamsha', hi: 'D16 षोडशांश', sa: 'D16 षोडशांशः' }, meaning: { en: 'Vehicles, comforts & luxuries', hi: 'वाहन, सुख एवं विलासिता', sa: 'वाहन, सुख एवं विलासिता', mai: 'वाहन, सुख एवं विलासिता', mr: 'वाहन, सुख एवं विलासिता', ta: 'வாகனங்கள், சுகம் & ஆடம்பரங்கள்', te: 'వాహనాలు, సుఖం & విలాసాలు', bn: 'বাহন, সুখ ও বিলাসিতা', kn: 'ವಾಹನಗಳು, ಸುಖ & ವಿಲಾಸ', gu: 'વાહન, સુખ અને વિલાસ' } },
    { key: 'D20', div: 20, label: { en: 'D20 Vimshamsha', hi: 'D20 विंशांश', sa: 'D20 विंशांशः' }, meaning: { en: 'Spiritual progress & upasana', hi: 'आध्यात्मिक प्रगति एवं उपासना', sa: 'आध्यात्मिक प्रगति एवं उपासना', mai: 'आध्यात्मिक प्रगति एवं उपासना', mr: 'आध्यात्मिक प्रगति एवं उपासना', ta: 'ஆன்மீக முன்னேற்றம் & உபாசனை', te: 'ఆధ్యాత్మిక పురోగతి & ఉపాసన', bn: 'আধ্যাত্মিক প্রগতি ও উপাসনা', kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಪ್ರಗತಿ & ಉಪಾಸನೆ', gu: 'આધ્યાત્મિક પ્રગતિ અને ઉપાસના' } },
    { key: 'D24', div: 24, label: { en: 'D24 Chaturvimshamsha', hi: 'D24 चतुर्विंशांश', sa: 'D24 चतुर्विंशांशः' }, meaning: { en: 'Education, learning & knowledge', hi: 'शिक्षा, विद्या एवं ज्ञान', sa: 'शिक्षा, विद्या एवं ज्ञान', mai: 'शिक्षा, विद्या एवं ज्ञान', mr: 'शिक्षा, विद्या एवं ज्ञान', ta: 'கல்வி, கற்றல் & ஞானம்', te: 'విద్య, అభ్యాసం & జ్ఞానం', bn: 'শিক্ষা, বিদ্যা ও জ্ঞান', kn: 'ಶಿಕ್ಷಣ, ವಿದ್ಯಾಭ್ಯಾಸ & ಜ್ಞಾನ', gu: 'શિક્ષણ, વિદ્યા અને જ્ઞાન' } },
    { key: 'D27', div: 27, label: { en: 'D27 Nakshatramsha', hi: 'D27 नक्षत्रांश', sa: 'D27 नक्षत्रांशः' }, meaning: { en: 'Strengths, vitality & stamina', hi: 'बल, ओज एवं सहनशक्ति', sa: 'बल, ओज एवं सहनशक्ति', mai: 'बल, ओज एवं सहनशक्ति', mr: 'बल, ओज एवं सहनशक्ति', ta: 'பலம், உயிர்ச்சக்தி & சகிப்புத்தன்மை', te: 'బలం, ఓజస్సు & సహనశక్తి', bn: 'বল, ওজ ও সহনশক্তি', kn: 'ಬಲ, ಓಜಸ್ಸು & ಸಹನಶಕ್ತಿ', gu: 'બળ, ઓજ અને સહનશક્તિ' } },
    { key: 'D30', div: 30, label: { en: 'D30 Trimshamsha', hi: 'D30 त्रिंशांश', sa: 'D30 त्रिंशांशः' }, meaning: { en: 'Misfortunes, evils & suffering', hi: 'दुर्भाग्य, पाप एवं कष्ट', sa: 'दुर्भाग्य, पाप एवं कष्ट', mai: 'दुर्भाग्य, पाप एवं कष्ट', mr: 'दुर्भाग्य, पाप एवं कष्ट', ta: 'துர்பாக்கியம், தீமை & துன்பம்', te: 'దుర్భాగ్యం, పాపం & బాధ', bn: 'দুর্ভাগ্য, পাপ ও কষ্ট', kn: 'ದುರ್ಭಾಗ್ಯ, ಪಾಪ & ಕಷ್ಟ', gu: 'દુર્ભાગ્ય, પાપ અને કષ્ટ' } },
    { key: 'D40', div: 40, label: { en: 'D40 Khavedamsha', hi: 'D40 खवेदांश', sa: 'D40 खवेदांशः' }, meaning: { en: 'Auspicious/inauspicious (maternal)', hi: 'शुभाशुभ प्रभाव (मातृपक्ष)', sa: 'शुभाशुभ प्रभाव (मातृपक्ष)', mai: 'शुभाशुभ प्रभाव (मातृपक्ष)', mr: 'शुभाशुभ प्रभाव (मातृपक्ष)', ta: 'சுபாசுபம் (தாய் வழி)', te: 'శుభాశుభ ప్రభావం (మాతృపక్షం)', bn: 'শুভাশুভ প্রভাব (মাতৃপক্ষ)', kn: 'ಶುಭಾಶುಭ ಪ್ರಭಾವ (ಮಾತೃಪಕ್ಷ)', gu: 'શુભાશુભ પ્રભાવ (માતૃપક્ષ)' } },
    { key: 'D45', div: 45, label: { en: 'D45 Akshavedamsha', hi: 'D45 अक्षवेदांश', sa: 'D45 अक्षवेदांशः' }, meaning: { en: 'General indications (paternal)', hi: 'सामान्य संकेत (पितृपक्ष)', sa: 'सामान्य संकेत (पितृपक्ष)', mai: 'सामान्य संकेत (पितृपक्ष)', mr: 'सामान्य संकेत (पितृपक्ष)', ta: 'பொதுக் குறிப்புகள் (தந்தை வழி)', te: 'సామాన్య సంకేతాలు (పితృపక్షం)', bn: 'সাধারণ সংকেত (পিতৃপক্ষ)', kn: 'ಸಾಮಾನ್ಯ ಸಂಕೇತಗಳು (ಪಿತೃಪಕ್ಷ)', gu: 'સામાન્ય સંકેત (પિતૃપક્ષ)' } },
    { key: 'D60', div: 60, label: { en: 'D60 Shashtiamsha', hi: 'D60 षष्ट्यंश', sa: 'D60 षष्ट्यंशः' }, meaning: { en: 'Past life karma & overall assessment', hi: 'पूर्वजन्म कर्म एवं समग्र मूल्यांकन', sa: 'पूर्वजन्म कर्म एवं समग्र मूल्यांकन', mai: 'पूर्वजन्म कर्म एवं समग्र मूल्यांकन', mr: 'पूर्वजन्म कर्म एवं समग्र मूल्यांकन', ta: 'முற்பிறவி வினை & ஒட்டுமொத்த மதிப்பீடு', te: 'పూర్వజన్మ కర్మ & సమగ్ర మూల్యాంకనం', bn: 'পূর্বজন্ম কর্ম ও সমগ্র মূল্যায়ন', kn: 'ಪೂರ್ವಜನ್ಮ ಕರ್ಮ & ಸಮಗ್ರ ಮೌಲ್ಯಮಾಪನ', gu: 'પૂર્વજન્મ કર્મ અને સમગ્ર મૂલ્યાંકન' } },
  ];
  const divisionalCharts: Record<string, DivisionalChart & { meaning?: LocaleText }> = {};
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

  // Shadbala placeholder — populated from fullShadbala below
  let shadbala: ShadBala[] = [];

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

  // Full Shadbala — pass ALL 9 planets so Rahu/Ketu contribute DrikBala aspects;
  // calculateFullShadbala internally filters to 0-6 for the main bala calculation
  const fullShadbala = calculateFullShadbala({
    planets: planets.map(p => {
      // Compute navamsha sign for this planet using the same element-based formula
      const sidLong = p.longitude;
      const navamshaIndex = Math.floor((sidLong % 30) / (30 / 9));
      const startSign = Math.floor(sidLong / 30);
      const element = startSign % 4; // 0=fire→Aries, 1=earth→Cap, 2=air→Libra, 3=water→Cancer
      const navSign = ((element === 1 ? 9 : element === 2 ? 6 : element === 3 ? 3 : 0) + navamshaIndex) % 12 + 1;
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
        // Ecliptic latitude is required for correct Graha Yuddha winner detection
        // (lower absolute latitude wins — BPHS Ch.28). computeFullCoordinates()
        // already stores this on each planet via coords.latitude.
        eclipticLatitude: p.latitude,
      };
    }),
    ascendantDeg: siderealAsc,
    julianDay: jd,
    birthDateObj: birthDate,
    latitude: birthData.lat,
    longitude: birthData.lng,
    timezone: tzOffset,
  });

  // Derive legacy shadbala format from fullShadbala (real data, not hardcoded)
  shadbala = fullShadbala.map(s => {
    const graha = GRAHAS[s.planetId];
    return {
      planet: s.planet,
      planetName: graha?.name || { en: s.planet, hi: s.planet, sa: s.planet },
      totalStrength: Math.round(s.strengthRatio * 50),
      sthanaBala: Math.round(s.sthanaBala),
      digBala: Math.round(s.digBala),
      kalaBala: Math.round(s.kalaBala),
      cheshtaBala: Math.round(s.cheshtaBala),
      naisargikaBala: Math.round(s.naisargikaBala),
      drikBala: Math.round(s.drikBala),
    };
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

  // Sade Sati analysis
  const moonP = planets.find(p => p.planet.id === 1);
  const saturnP = planets.find(p => p.planet.id === 6);
  const currentMahaDasha = dashas.find(d => {
    const now = new Date();
    return new Date(d.startDate) <= now && now <= new Date(d.endDate);
  });
  const currentAntarDasha = currentMahaDasha?.subPeriods?.find(s => {
    const now = new Date();
    return new Date(s.startDate) <= now && now <= new Date(s.endDate);
  });
  const sadeSati = analyzeSadeSati({
    moonSign: moonP?.sign || 1,
    moonNakshatra: moonP ? getNakshatraNumber(moonP.longitude) : undefined,
    moonDegree: moonP?.longitude,
    ascendantSign: ascSign,
    saturnSign: saturnP?.sign,
    saturnHouse: saturnP?.house,
    saturnRetrograde: saturnP?.isRetrograde,
    ashtakavargaSaturnBindus: ashtakavarga?.bpiTable?.[6],
    currentDasha: currentMahaDasha ? { planet: currentMahaDasha.planet, startDate: currentMahaDasha.startDate, endDate: currentMahaDasha.endDate } : undefined,
    currentAntar: currentAntarDasha ? { planet: currentAntarDasha.planet, startDate: currentAntarDasha.startDate, endDate: currentAntarDasha.endDate } : undefined,
  });

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
    sadeSati,
    jaimini: calculateJaimini(planets, ascSign, birthDate),
    vimshopakaBala: calculateVimshopakaBala(planets, chart, divisionalCharts),
    narayanaDasha: calculateNarayanaDasha(ascSign, planets, birthDate),
    shoolaDasha: calculateShoolaDasha(ascSign, birthDate),
    sthiraDasha: calculateSthiraDasha(ascSign, birthDate),
    kalachakraDasha: calculateKalachakraDasha(moonSidLong, birthDate),
    sudarsanaDasha: calculateSudarsanaDasha(ascSign, planets.find(p => p.planet.id === 1)?.sign || 1, planets.find(p => p.planet.id === 0)?.sign || 1, year),
    shodasottariDasha: calculateShodasottariDasha(moonSidLong, birthDate),
    dwadasottariDasha: calculateDwadasottariDasha(moonSidLong, birthDate),
    panchottariDasha: calculatePanchottariDasha(moonSidLong, birthDate),
    satabdikaDasha: calculateSatabdikaDasha(moonSidLong, birthDate),
    chaturaaseethiDasha: calculateChaturaaseethiDasha(moonSidLong, birthDate),
    shashtihayaniDasha: calculateShashtihayaniDasha(moonSidLong, birthDate),
    mandookaDasha: calculateMandookaDasha(ascSign, birthDate),
    drigDasha: calculateDrigDasha(ascSign, planets, birthDate),
    moolaDasha: calculateMoolaDasha(moonSidLong, birthDate),
    navamshaDasha: calculateNavamshaDasha(ascSign, moonSidLong, birthDate),
    naisargikaDasha: calculateNaisargikaDasha(birthDate),
    taraDasha: calculateTaraDasha(moonSidLong, birthDate),
    tithiAshtottariDasha: calculateTithiAshtottariDasha(moonSidLong, birthDate),
    yogaVimsottariDasha: calculateYogaVimsottariDasha(
      planets.find(p => p.planet.id === 0)?.longitude || 0,
      moonSidLong, birthDate
    ),
    buddhiGathiDasha: calculateBuddhiGathiDasha(moonSidLong, birthDate),
    specialLagnas: (() => {
      const sunP = planets.find(p => p.planet.id === 0);
      const sunDeg = sunP?.longitude || 0;
      const sunriseUTApprox = approximateSunrise(jd, birthData.lat, birthData.lng);
      return calculateSpecialLagnas(siderealAsc, sunDeg, moonSidLong, sunriseUTApprox, utHour, ascSign);
    })(),
    avasthas: calculateAvasthas(planets),
    argala: calculateArgala(planets, ascSign),
    bhriguBindu: (() => {
      const rahuP = planets.find(p => p.planet.id === 7);
      const moonP = planets.find(p => p.planet.id === 1);
      if (!rahuP || !moonP) return undefined;
      let mid = (rahuP.longitude + moonP.longitude) / 2;
      // Handle wrap: if the arc between them is > 180°, take the other midpoint
      const diff = Math.abs(rahuP.longitude - moonP.longitude);
      if (diff > 180) { mid = (mid + 180) % 360; }
      mid = ((mid % 360) + 360) % 360;
      const bbSign = Math.floor(mid / 30) + 1;
      return { longitude: mid, sign: bbSign, degree: formatDegrees(mid % 30) };
    })(),
    grahaYuddha: detectGrahaYuddha(
      planets.map(p => ({ id: p.planet.id, longitude: p.longitude, latitude: p.latitude }))
    ),
    functionalNature: calculateFunctionalNature(ascSign),
    sphutas: (() => {
      const sunP = planets.find(p => p.planet.id === 0);
      const jupP = planets.find(p => p.planet.id === 4);
      const venP = planets.find(p => p.planet.id === 5);
      const marP = planets.find(p => p.planet.id === 2);
      return calculateSphutas(
        sunP?.longitude || 0, moonSidLong, siderealAsc,
        jupP?.longitude || 0, venP?.longitude || 0, marP?.longitude || 0
      );
    })(),
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
