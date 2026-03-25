import {
  dateToJD, sunLongitude, moonLongitude, toSidereal,
  getRashiNumber, getNakshatraNumber, getNakshatraPada,
  getPlanetaryPositions, lahiriAyanamsha, normalizeDeg, formatDegrees,
} from './astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { GRAHAS } from '@/lib/constants/grahas';
import type { KundaliData, BirthData, PlanetPosition, HouseCusp, ChartData, DashaEntry, ShadBala } from '@/types/kundali';

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
  const planets: PlanetPosition[] = rawPlanets.map((p) => {
    const graha = GRAHAS[p.id];
    const sidLong = toSidereal(p.longitude, jd);
    const sign = getRashiNumber(sidLong);
    const nakNum = getNakshatraNumber(sidLong);
    const pada = getNakshatraPada(sidLong);
    const house = getHouse(sidLong, cuspDegrees);
    const rashi = RASHIS[sign - 1];
    const nak = NAKSHATRAS[nakNum - 1];

    return {
      planet: graha,
      longitude: sidLong,
      latitude: 0,
      speed: p.speed,
      sign,
      signName: rashi.name,
      house,
      nakshatra: nak,
      pada,
      degree: formatDegrees(sidLong % 30),
      isRetrograde: p.isRetrograde,
      isCombust: false,
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

  // Dasha
  const moonPlanet = planets.find((p) => p.planet.id === 1);
  const moonSidLong = moonPlanet?.longitude || 0;
  const birthDate = new Date(year, month - 1, day, hour, minute);
  const dashas = calculateVimshottariDasha(moonSidLong, birthDate);

  // Shadbala
  const shadbala = calculateShadbala(planets);

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
    dashas,
    shadbala,
    ayanamshaValue,
    julianDay: jd,
  };
}
