/**
 * Kundali (Birth Chart) calculator
 * Computes ascendant, planetary positions, house placements
 */

import { dateToJD } from '../astronomy/julian';
import { getSolarPosition, getLST, getObliquity } from '../astronomy/solar';
import { getLunarPosition } from '../astronomy/lunar';
import { getAllPlanetPositions, type PlanetId } from '../astronomy/planets';
import { getAyanamsha as getAyanamsa, toSidereal as _toSidereal, type AyanamshaType as AyanamsaType } from '../ephem/astronomical';
/** Adapter: Module B's toSidereal takes (lon, jd, ayanamsha?) — we have pre-computed ayanamsha. */
const tropicalToSidereal = (lon: number, ayanamsa: number) => _toSidereal(lon, 0, ayanamsa);
import { degToRad, radToDeg, normalizeAngle } from '../astronomy/julian';
import { RASHI_NAMES, RASHI_NAMES_SANSKRIT, NAKSHATRA_DATA } from '../panchang/types';
import { calculateDashas } from './dasha';
import { detectYogas } from './yogas';
import type { KundaliData, GrahaPosition, HouseData, GrahaId } from './types';
import { GRAHA_NAMES, GRAHA_SYMBOLS } from './types';

function getSignIndex(longitude: number): number {
  return Math.floor(longitude / 30) % 12;
}

function getDegreeInSign(longitude: number): number {
  return longitude % 30;
}

function getNakshatraInfo(longitude: number): { index: number; name: string; pada: number } {
  const index = Math.floor(longitude / (360 / 27));
  const nakshatraStart = index * (360 / 27);
  const posInNakshatra = longitude - nakshatraStart;
  const pada = Math.min(Math.floor(posInNakshatra / (360 / 108)) + 1, 4);
  return {
    index,
    name: NAKSHATRA_DATA[index].name,
    pada,
  };
}

/**
 * Calculate the Ascendant (Lagna)
 * @param jd Julian Day (UTC)
 * @param latitude Observer latitude (degrees)
 * @param longitude Observer longitude (degrees)
 */
function calculateAscendant(jd: number, latitude: number, longitude: number): number {
  const lst = getLST(jd, longitude); // degrees
  const obliquity = getObliquity(jd);

  const lstRad = degToRad(lst);
  const oblRad = degToRad(obliquity);
  const latRad = degToRad(latitude);

  // Ascendant formula
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
  let ascendant = radToDeg(Math.atan2(y, x));
  ascendant = normalizeAngle(ascendant);

  return ascendant;
}

/**
 * Calculate Navamsa (D9) chart positions
 * Navamsa divides each sign into 9 parts (3°20' each)
 */
function calculateNavamsa(longitude: number): number {
  const navamsaIndex = Math.floor(longitude / (360 / 108)); // 0-107
  // Navamsa sign: for Aries sign, starts from Aries; Taurus from Capricorn; etc.
  const signIndex = Math.floor(longitude / 30);
  const startSigns = [0, 9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3]; // Navamsa starting signs for each rashi
  const navamsaInSign = Math.floor((longitude % 30) / (30 / 9));
  const navamsaSign = (startSigns[signIndex] + navamsaInSign) % 12;
  return navamsaSign;
}

export interface KundaliInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  placeName: string;
  ayanamsaType?: AyanamsaType;
}

export function calculateKundali(input: KundaliInput): KundaliData {
  const {
    year, month, day, hour, minute,
    latitude, longitude, timezoneOffset,
    placeName, ayanamsaType = 'lahiri'
  } = input;

  // Convert local time to UTC
  const utcHour = hour - timezoneOffset + minute / 60;
  const jd = dateToJD(year, month, day, utcHour, 0, 0);

  const ayanamsa = getAyanamsa(jd, ayanamsaType);

  // Calculate ascendant
  const tropicalAsc = calculateAscendant(jd, latitude, longitude);
  const siderealAsc = tropicalToSidereal(tropicalAsc, ayanamsa);
  const ascSignIndex = getSignIndex(siderealAsc);

  // Calculate Sun and Moon positions
  const solar = getSolarPosition(jd);
  const lunar = getLunarPosition(jd);
  const sunSidereal = tropicalToSidereal(solar.apparentLongitude, ayanamsa);
  const moonSidereal = tropicalToSidereal(lunar.longitude, ayanamsa);

  // Calculate all other planet positions
  const planets = getAllPlanetPositions(jd);

  // Build graha positions array
  const grahaEntries: Array<{ id: GrahaId; lon: number; retrograde: boolean }> = [
    { id: 'sun', lon: sunSidereal, retrograde: false },
    { id: 'moon', lon: moonSidereal, retrograde: false },
    ...(['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'rahu', 'ketu'] as PlanetId[]).map(p => ({
      id: p as GrahaId,
      lon: tropicalToSidereal(planets[p].longitude, ayanamsa),
      retrograde: planets[p].isRetrograde,
    })),
  ];

  // Map planets to houses (Whole Sign Houses from Ascendant)
  const grahas: GrahaPosition[] = grahaEntries.map(({ id, lon, retrograde }) => {
    const signIndex = getSignIndex(lon);
    const nak = getNakshatraInfo(lon);
    // House number: count from ascendant sign
    let house = ((signIndex - ascSignIndex + 12) % 12) + 1;

    return {
      id,
      name: GRAHA_NAMES[id],
      longitude: lon,
      signIndex,
      sign: RASHI_NAMES[signIndex],
      signSanskrit: RASHI_NAMES_SANSKRIT[signIndex],
      degreeInSign: getDegreeInSign(lon),
      nakshatra: nak.name,
      nakshatraIndex: nak.index,
      pada: nak.pada,
      house,
      isRetrograde: retrograde,
      symbol: GRAHA_SYMBOLS[id],
    };
  });

  // Build houses
  const houses: HouseData[] = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signIndex = (ascSignIndex + i) % 12;
    return {
      number: houseNum,
      sign: RASHI_NAMES[signIndex],
      signIndex,
      planets: grahas.filter(g => g.house === houseNum).map(g => g.id),
    };
  });

  // Build Navamsa houses
  const navamsaAscSign = calculateNavamsa(siderealAsc);
  const navamsaHouses: HouseData[] = Array.from({ length: 12 }, (_, i) => {
    const signIndex = (navamsaAscSign + i) % 12;
    return {
      number: i + 1,
      sign: RASHI_NAMES[signIndex],
      signIndex,
      planets: grahas.filter(g => {
        const navSign = calculateNavamsa(g.longitude);
        const navHouse = ((navSign - navamsaAscSign + 12) % 12) + 1;
        return navHouse === i + 1;
      }).map(g => g.id),
    };
  });

  // Calculate Dashas
  const moonNakIndex = grahas.find(g => g.id === 'moon')!.nakshatraIndex;
  const moonDegInNak = grahas.find(g => g.id === 'moon')!.longitude % (360 / 27);
  // Lesson L: use Date.UTC — birth time components are UT-based from the computation.
  const birthDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const dashas = calculateDashas(moonNakIndex, moonDegInNak, birthDate);

  // Detect yogas
  const yogas = detectYogas(grahas, houses, ascSignIndex);

  return {
    birthDetails: {
      date: birthDate,
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      place: placeName,
      latitude,
      longitude,
      timezone: timezoneOffset,
    },
    ayanamsa,
    ayanamsaType,
    ascendant: {
      longitude: siderealAsc,
      signIndex: ascSignIndex,
      sign: RASHI_NAMES[ascSignIndex],
      degreeInSign: getDegreeInSign(siderealAsc),
    },
    grahas,
    houses,
    dashas,
    yogas,
    navamsaHouses,
  };
}
