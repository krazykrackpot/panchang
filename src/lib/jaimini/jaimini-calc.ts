/**
 * Jaimini Astrology System
 * - Chara Karakas (variable significators based on degree)
 * - Karakamsha (navamsha sign of Atmakaraka)
 * - Arudha Padas (A1-A12)
 * - Chara Dasha (sign-based dasha)
 * Reference: Jaimini Sutras, BPHS Ch.32-34
 */

import { normalizeDeg } from '@/lib/ephem/astronomical';
import type { PlanetPosition } from '@/types/kundali';

export interface CharaKaraka {
  planet: number;
  planetName: { en: string; hi: string; sa: string };
  karaka: string;
  karakaName: { en: string; hi: string; sa: string };
  degree: number;
}

export interface ArudhaPada {
  house: number;
  sign: number;
  signName: { en: string; hi: string; sa: string };
  label: { en: string; hi: string; sa: string };
}

export interface CharaDashaEntry {
  sign: number;
  signName: { en: string; hi: string; sa: string };
  years: number;
  startDate: string;
  endDate: string;
}

export interface JaiminiData {
  charaKarakas: CharaKaraka[];
  karakamsha: { sign: number; signName: { en: string; hi: string; sa: string } };
  arudhaPadas: ArudhaPada[];
  charaDasha: CharaDashaEntry[];
}

const KARAKA_ORDER = [
  { key: 'AK', name: { en: 'Atmakaraka (Self)', hi: 'आत्मकारक', sa: 'आत्मकारकः' } },
  { key: 'AmK', name: { en: 'Amatyakaraka (Minister)', hi: 'अमात्यकारक', sa: 'अमात्यकारकः' } },
  { key: 'BK', name: { en: 'Bhratrikaraka (Siblings)', hi: 'भ्रातृकारक', sa: 'भ्रातृकारकः' } },
  { key: 'MK', name: { en: 'Matrikaraka (Mother)', hi: 'मातृकारक', sa: 'मातृकारकः' } },
  { key: 'PK', name: { en: 'Putrakaraka (Children)', hi: 'पुत्रकारक', sa: 'पुत्रकारकः' } },
  { key: 'GK', name: { en: 'Gnatikaraka (Relatives)', hi: 'ज्ञातिकारक', sa: 'ज्ञातिकारकः' } },
  { key: 'DK', name: { en: 'Darakaraka (Spouse)', hi: 'दारकारक', sa: 'दारकारकः' } },
];

const RASHI_NAMES: { en: string; hi: string; sa: string }[] = [
  { en: 'Aries', hi: 'मेष', sa: 'मेषः' },
  { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः' },
  { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' },
  { en: 'Cancer', hi: 'कर्क', sa: 'कर्कः' },
  { en: 'Leo', hi: 'सिंह', sa: 'सिंहः' },
  { en: 'Virgo', hi: 'कन्या', sa: 'कन्या' },
  { en: 'Libra', hi: 'तुला', sa: 'तुला' },
  { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकः' },
  { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः' },
  { en: 'Capricorn', hi: 'मकर', sa: 'मकरः' },
  { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः' },
  { en: 'Pisces', hi: 'मीन', sa: 'मीनः' },
];

const PLANET_NAMES: Record<number, { en: string; hi: string; sa: string }> = {
  0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
  1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
  2: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' },
  3: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
  4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' },
  5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
  6: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
  7: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' },
  8: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
};

// Sign lord mapping (1-12)
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

/**
 * Calculate Chara Karakas — planets sorted by degree within sign (highest = AK)
 * Only 7 planets: Sun through Saturn (exclude Rahu/Ketu)
 */
export function calculateCharaKarakas(planets: PlanetPosition[]): CharaKaraka[] {
  const sevenPlanets = planets.filter(p => p.planet.id >= 0 && p.planet.id <= 6);
  // Sort by degree within sign (descending — highest degree = Atmakaraka)
  const sorted = sevenPlanets
    .map(p => ({
      planet: p.planet.id,
      degree: p.longitude % 30,
    }))
    .sort((a, b) => b.degree - a.degree);

  return sorted.map((p, i) => ({
    planet: p.planet,
    planetName: PLANET_NAMES[p.planet],
    karaka: KARAKA_ORDER[i]?.key || 'DK',
    karakaName: KARAKA_ORDER[i]?.name || KARAKA_ORDER[6].name,
    degree: Math.round(p.degree * 100) / 100,
  }));
}

/**
 * Calculate Karakamsha — the navamsha sign occupied by Atmakaraka
 */
export function calculateKarakamsha(atmakarakaLong: number): { sign: number; signName: { en: string; hi: string; sa: string } } {
  // Navamsha: divide each sign into 9 parts (3°20' each)
  const navamshaIndex = Math.floor((atmakarakaLong % 360) / (360 / 108)); // 108 navamshas
  const navamshaSign = (navamshaIndex % 12) + 1;
  return { sign: navamshaSign, signName: RASHI_NAMES[navamshaSign - 1] };
}

/**
 * Calculate Arudha Padas (A1-A12)
 * Arudha of house H = count from lord's position to H, then same count from lord
 */
export function calculateArudhaPadas(ascSign: number, planets: PlanetPosition[]): ArudhaPada[] {
  const padas: ArudhaPada[] = [];
  const ARUDHA_LABELS: { en: string; hi: string; sa: string }[] = [
    { en: 'Arudha Lagna (AL)', hi: 'आरूढ़ लग्न', sa: 'आरूढलग्नम्' },
    { en: 'Dhana Pada (A2)', hi: 'धन पद', sa: 'धनपदम्' },
    { en: 'Vikrama Pada (A3)', hi: 'विक्रम पद', sa: 'विक्रमपदम्' },
    { en: 'Matri Pada (A4)', hi: 'मातृ पद', sa: 'मातृपदम्' },
    { en: 'Mantra Pada (A5)', hi: 'मन्त्र पद', sa: 'मन्त्रपदम्' },
    { en: 'Shatru Pada (A6)', hi: 'शत्रु पद', sa: 'शत्रुपदम्' },
    { en: 'Dara Pada (A7)', hi: 'दार पद', sa: 'दारपदम्' },
    { en: 'Mrityu Pada (A8)', hi: 'मृत्यु पद', sa: 'मृत्युपदम्' },
    { en: 'Pitri Pada (A9)', hi: 'पितृ पद', sa: 'पितृपदम्' },
    { en: 'Karma Pada (A10)', hi: 'कर्म पद', sa: 'कर्मपदम्' },
    { en: 'Labha Pada (A11)', hi: 'लाभ पद', sa: 'लाभपदम्' },
    { en: 'Upapada (UL)', hi: 'उपपद', sa: 'उपपदम्' },
  ];

  for (let h = 0; h < 12; h++) {
    const houseSign = ((ascSign - 1 + h) % 12) + 1; // sign of house h+1
    const lord = SIGN_LORD[houseSign];
    // Find lord's sign position
    const lordPlanet = planets.find(p => p.planet.id === lord);
    const lordSign = lordPlanet ? Math.floor(lordPlanet.longitude / 30) + 1 : houseSign;
    // Count from house sign to lord sign
    const countForward = ((lordSign - houseSign + 12) % 12);
    // Arudha = count same distance from lord sign
    let arudhaSign = ((lordSign - 1 + countForward) % 12) + 1;
    // Exception: if arudha falls in same sign or 7th, advance by 10 signs
    if (arudhaSign === houseSign) arudhaSign = ((houseSign - 1 + 9) % 12) + 1;
    padas.push({
      house: h + 1,
      sign: arudhaSign,
      signName: RASHI_NAMES[arudhaSign - 1],
      label: ARUDHA_LABELS[h],
    });
  }
  return padas;
}

/**
 * Chara Dasha — sign-based dasha system
 * Duration based on sign lord's distance from sign
 */
export function calculateCharaDasha(ascSign: number, planets: PlanetPosition[], birthDate: Date): CharaDashaEntry[] {
  const dashas: CharaDashaEntry[] = [];
  let currentDate = new Date(birthDate);

  // Odd signs: count zodiacally from sign; Even signs: count reverse
  const isOddSign = (s: number) => s % 2 === 1;

  for (let i = 0; i < 12; i++) {
    const sign = ((ascSign - 1 + i) % 12) + 1;
    const lord = SIGN_LORD[sign];
    const lordPlanet = planets.find(p => p.planet.id === lord);
    const lordSign = lordPlanet ? Math.floor(lordPlanet.longitude / 30) + 1 : sign;

    let years: number;
    if (isOddSign(sign)) {
      years = ((lordSign - sign + 12) % 12);
    } else {
      years = ((sign - lordSign + 12) % 12);
    }
    if (years === 0) years = 12;

    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + years);

    dashas.push({
      sign,
      signName: RASHI_NAMES[sign - 1],
      years,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
    currentDate = new Date(endDate);
  }
  return dashas;
}

/**
 * Full Jaimini analysis
 */
export function calculateJaimini(planets: PlanetPosition[], ascSign: number, birthDate: Date): JaiminiData {
  const charaKarakas = calculateCharaKarakas(planets);
  const ak = charaKarakas[0]; // Atmakaraka
  const akPlanet = planets.find(p => p.planet.id === ak.planet);
  const karakamsha = calculateKarakamsha(akPlanet?.longitude || 0);
  const arudhaPadas = calculateArudhaPadas(ascSign, planets);
  const charaDasha = calculateCharaDasha(ascSign, planets, birthDate);

  return { charaKarakas, karakamsha, arudhaPadas, charaDasha };
}
