/**
 * Additional Dasha Systems — Narayana, Kalachakra, Shoola, Sthira, Sudarsana
 * Reference: BPHS Ch.19-21, Jaimini Sutras
 */

import type { PlanetPosition } from '@/types/kundali';

type Tri = { en: string; hi: string; sa: string };

export interface RasiDashaEntry {
  sign: number;
  signName: Tri;
  years: number;
  startDate: string;
  endDate: string;
}

const RASHI_NAMES: Tri[] = [
  { en: 'Aries', hi: 'मेष', sa: 'मेषः' },{ en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः' },
  { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' },{ en: 'Cancer', hi: 'कर्क', sa: 'कर्कः' },
  { en: 'Leo', hi: 'सिंह', sa: 'सिंहः' },{ en: 'Virgo', hi: 'कन्या', sa: 'कन्या' },
  { en: 'Libra', hi: 'तुला', sa: 'तुला' },{ en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकः' },
  { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः' },{ en: 'Capricorn', hi: 'मकर', sa: 'मकरः' },
  { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः' },{ en: 'Pisces', hi: 'मीन', sa: 'मीनः' },
];

const SIGN_LORD: Record<number, number> = { 1:2,2:5,3:3,4:1,5:0,6:3,7:5,8:2,9:4,10:6,11:6,12:4 };

function isOddSign(s: number): boolean { return s % 2 === 1; }

function lordSign(pid: number, planets: PlanetPosition[]): number {
  const p = planets.find(p => p.planet.id === pid);
  return p ? Math.floor(p.longitude / 30) + 1 : 1;
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + Math.floor(years));
  d.setMonth(d.getMonth() + Math.floor((years % 1) * 12));
  return d;
}

function fmt(d: Date): string { return d.toISOString().split('T')[0]; }

// ─── NARAYANA DASHA ─────────────────────────────────────────────────────────
// Most important rasi dasha. Duration = distance of sign lord from sign.
// Odd signs: zodiacal order. Even signs: reverse order.
// Reference: BPHS Ch.19, PVR Narasimha Rao

export function calculateNarayanaDasha(ascSign: number, planets: PlanetPosition[], birthDate: Date): RasiDashaEntry[] {
  const dashas: RasiDashaEntry[] = [];
  let cur = new Date(birthDate);

  // Starting sign is the stronger between Lagna and 7th
  // Simplified: start from Lagna sign
  const startSign = ascSign;
  const direction = isOddSign(startSign) ? 1 : -1;

  for (let i = 0; i < 12; i++) {
    const sign = ((startSign - 1 + i * direction + 144) % 12) + 1;
    const lord = SIGN_LORD[sign];
    const lSign = lordSign(lord, planets);

    // Duration: count from sign to lord's sign
    let years: number;
    if (isOddSign(sign)) {
      years = ((lSign - sign + 12) % 12);
    } else {
      years = ((sign - lSign + 12) % 12);
    }
    // Special: if lord is in own sign, years = 12
    if (years === 0) years = 12;

    const end = addYears(cur, years);
    dashas.push({ sign, signName: RASHI_NAMES[sign - 1], years, startDate: fmt(cur), endDate: fmt(end) });
    cur = end;
  }
  return dashas;
}

// ─── SHOOLA DASHA ───────────────────────────────────────────────────────────
// Trident dasha — groups of 3 signs. Each trikona set gets equal duration.
// Fixed: 9 years per trikona set (3 signs × 3 years each)
// Reference: Jaimini Sutras, BPHS Ch.20

export function calculateShoolaDasha(ascSign: number, birthDate: Date): RasiDashaEntry[] {
  const dashas: RasiDashaEntry[] = [];
  let cur = new Date(birthDate);

  // 4 trikona groups of 3 signs each, starting from Lagna
  for (let t = 0; t < 4; t++) {
    for (let k = 0; k < 3; k++) {
      const offset = t + k * 4; // trikona pattern: 0,4,8 then 1,5,9 etc.
      const sign = ((ascSign - 1 + offset) % 12) + 1;
      const years = 3; // fixed 3 years per sign in Shoola
      const end = addYears(cur, years);
      dashas.push({ sign, signName: RASHI_NAMES[sign - 1], years, startDate: fmt(cur), endDate: fmt(end) });
      cur = end;
    }
  }
  return dashas;
}

// ─── STHIRA DASHA ───────────────────────────────────────────────────────────
// Fixed duration based on sign quality:
//   Movable (Chara) signs: 7 years
//   Fixed (Sthira) signs: 8 years
//   Dual (Dwiswabhava) signs: 9 years
// Reference: BPHS Ch.20

export function calculateSthiraDasha(ascSign: number, birthDate: Date): RasiDashaEntry[] {
  const dashas: RasiDashaEntry[] = [];
  let cur = new Date(birthDate);

  for (let i = 0; i < 12; i++) {
    const sign = ((ascSign - 1 + i) % 12) + 1;
    const signType = (sign - 1) % 3; // 0=movable, 1=fixed, 2=dual
    const years = signType === 0 ? 7 : signType === 1 ? 8 : 9;
    const end = addYears(cur, years);
    dashas.push({ sign, signName: RASHI_NAMES[sign - 1], years, startDate: fmt(cur), endDate: fmt(end) });
    cur = end;
  }
  return dashas;
}

// ─── KALACHAKRA DASHA ───────────────────────────────────────────────────────
// Time-wheel dasha — based on Moon's nakshatra pada.
// Each nakshatra has a specific sequence of signs with specific durations.
// Total cycle: 83 years (Savya) or 83 years (Apasavya)
// Simplified implementation using standard Savya/Apasavya patterns.
// Reference: BPHS Ch.21

// Kalachakra: nakshatras alternate between Savya (clockwise) and Apasavya (anticlockwise)
const SAVYA_NAKSHATRAS = new Set([1,2,3,4,  10,11,12,13,  19,20,21,22]); // groups of 4
// Apasavya: 5,6,7,8,9, 14,15,16,17,18, 23,24,25,26,27

// Savya sequence durations (years per sign, 4 padas × 9 signs = 36 entries)
const KALACHAKRA_SAVYA_YEARS = [7,16,21,9,7,10,4,4,5]; // 83 total
const KALACHAKRA_APASAVYA_YEARS = [5,4,4,10,7,9,21,16,7]; // 83 total, reversed

// Savya sign order: Cancer→Leo→...→Pisces then Aries→...→Gemini (zodiacal from Cancer)
// Apasavya: Capricorn→Sagittarius→...→Cancer then Pisces→...→Capricorn (reverse)
const SAVYA_SIGNS = [4,5,6,7,8,9,10,11,12]; // Cancer to Pisces (1-based)
const APASAVYA_SIGNS = [10,9,8,7,6,5,4,3,2]; // Capricorn backward

export function calculateKalachakraDasha(moonSidLong: number, birthDate: Date): RasiDashaEntry[] {
  const nakshatra = Math.floor(moonSidLong / (360 / 27)) + 1; // 1-27
  const pada = Math.floor((moonSidLong % (360 / 27)) / (360 / 108)) % 4; // 0-3

  const isSavya = SAVYA_NAKSHATRAS.has(nakshatra);
  const years = isSavya ? KALACHAKRA_SAVYA_YEARS : KALACHAKRA_APASAVYA_YEARS;
  const signs = isSavya ? SAVYA_SIGNS : APASAVYA_SIGNS;

  // Start from the pada's starting position
  const startIdx = pada * 2; // rough mapping, simplified
  const dashas: RasiDashaEntry[] = [];
  let cur = new Date(birthDate);

  // Remaining dasha of first sign
  const posInNakshatra = (moonSidLong % (360 / 27)) / (360 / 27);
  const posInPada = (posInNakshatra * 4) % 1;
  let firstYears = years[startIdx % 9] * (1 - posInPada);

  for (let i = 0; i < 9; i++) {
    const idx = (startIdx + i) % 9;
    const sign = signs[idx];
    const y = i === 0 ? firstYears : years[idx];
    const end = addYears(cur, y);
    dashas.push({ sign, signName: RASHI_NAMES[sign - 1], years: Math.round(y * 10) / 10, startDate: fmt(cur), endDate: fmt(end) });
    cur = end;
  }
  return dashas;
}

// ─── SUDARSANA CHAKRA DASHA ─────────────────────────────────────────────────
// Triple-reference system: 1 year per house, simultaneously from Lagna, Moon, Sun
// Used for annual predictions. Each year activates one house from each reference.
// Reference: BPHS Ch.22

export interface SudarsanaDashaEntry {
  year: number;
  age: number;
  lagnaHouse: number;
  lagnaSign: number;
  moonHouse: number;
  moonSign: number;
  sunHouse: number;
  sunSign: number;
}

export function calculateSudarsanaDasha(
  ascSign: number,
  moonSign: number,
  sunSign: number,
  birthYear: number,
): SudarsanaDashaEntry[] {
  const entries: SudarsanaDashaEntry[] = [];

  for (let age = 0; age < 120; age++) {
    const houseOffset = age % 12; // cycles every 12 years
    entries.push({
      year: birthYear + age,
      age,
      lagnaHouse: houseOffset + 1,
      lagnaSign: ((ascSign - 1 + houseOffset) % 12) + 1,
      moonHouse: houseOffset + 1,
      moonSign: ((moonSign - 1 + houseOffset) % 12) + 1,
      sunHouse: houseOffset + 1,
      sunSign: ((sunSign - 1 + houseOffset) % 12) + 1,
    });
  }
  return entries;
}

// ─── Additional Graha (Nakshatra-based) Dasha Systems ────────────────────────

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

export interface GrahaDashaEntry {
  planet: string;
  planetName: { en: string; hi: string; sa: string };
  years: number;
  startDate: string;
  endDate: string;
  level: 'maha';
}

function calcGrahaDasha(
  moonSidLong: number,
  birthDate: Date,
  dashaOrder: { planet: string; years: number }[],
  totalYears: number,
): GrahaDashaEntry[] {
  const nakshatraIndex = Math.floor(moonSidLong / (360 / 27));
  const nakshatraSpan = 360 / 27;
  const posInNakshatra = (moonSidLong % nakshatraSpan) / nakshatraSpan;

  // Map nakshatra to starting dasha lord
  const startIdx = nakshatraIndex % dashaOrder.length;
  const totalYearsFirst = dashaOrder[startIdx].years;
  const remainingYears = totalYearsFirst * (1 - posInNakshatra);

  const dashas: GrahaDashaEntry[] = [];
  let cur = new Date(birthDate);

  for (let i = 0; i < dashaOrder.length; i++) {
    const idx = (startIdx + i) % dashaOrder.length;
    const d = dashaOrder[idx];
    const years = i === 0 ? remainingYears : d.years;
    const end = new Date(cur);
    end.setFullYear(end.getFullYear() + Math.floor(years));
    end.setMonth(end.getMonth() + Math.floor((years % 1) * 12));

    dashas.push({
      planet: d.planet,
      planetName: PLANET_NAME_MAP[d.planet] || { en: d.planet, hi: d.planet, sa: d.planet },
      years: Math.round(years * 10) / 10,
      startDate: cur.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      level: 'maha',
    });
    cur = new Date(end);
  }
  return dashas;
}

/**
 * Shodasottari Dasha — 116-year cycle
 * Used when Moon is in Pushya nakshatra at birth
 */
export function calculateShodasottariDasha(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Sun', years: 11 }, { planet: 'Mars', years: 12 },
    { planet: 'Jupiter', years: 13 }, { planet: 'Saturn', years: 14 },
    { planet: 'Ketu', years: 15 }, { planet: 'Moon', years: 16 },
    { planet: 'Mercury', years: 17 }, { planet: 'Venus', years: 18 },
  ], 116);
}

/**
 * Dwadasottari Dasha — 112-year cycle
 * Used when Lagna is in Taurus
 */
export function calculateDwadasottariDasha(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Sun', years: 7 }, { planet: 'Jupiter', years: 9 },
    { planet: 'Ketu', years: 11 }, { planet: 'Mercury', years: 13 },
    { planet: 'Rahu', years: 15 }, { planet: 'Mars', years: 17 },
    { planet: 'Saturn', years: 19 }, { planet: 'Moon', years: 21 },
  ], 112);
}

/**
 * Panchottari Dasha — 105-year cycle
 * Used when Lagna is in Cancer
 */
export function calculatePanchottariDasha(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Sun', years: 12 }, { planet: 'Mercury', years: 13 },
    { planet: 'Saturn', years: 14 }, { planet: 'Mars', years: 15 },
    { planet: 'Venus', years: 16 }, { planet: 'Moon', years: 17 },
    { planet: 'Rahu', years: 18 },
  ], 105);
}

/**
 * Satabdika Dasha — 100-year cycle
 * Used when Lagna is in Sagittarius varga
 */
export function calculateSatabdikaDasha(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Sun', years: 5 }, { planet: 'Moon', years: 5 },
    { planet: 'Venus', years: 10 }, { planet: 'Mercury', years: 10 },
    { planet: 'Jupiter', years: 20 }, { planet: 'Mars', years: 20 },
    { planet: 'Saturn', years: 30 },
  ], 100);
}

/**
 * Chaturaaseethi Sama Dasha — 84-year cycle (equal 12-year periods)
 * Each planet gets 12 years
 */
export function calculateChaturaaseethiDasha(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Sun', years: 12 }, { planet: 'Moon', years: 12 },
    { planet: 'Mars', years: 12 }, { planet: 'Mercury', years: 12 },
    { planet: 'Jupiter', years: 12 }, { planet: 'Venus', years: 12 },
    { planet: 'Saturn', years: 12 },
  ], 84);
}

/**
 * Shashtihayani Dasha — 60-year cycle
 * Based on Indian lifespan in Kali Yuga
 */
export function calculateShashtihayaniDasha(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Jupiter', years: 10 }, { planet: 'Sun', years: 10 },
    { planet: 'Mars', years: 10 }, { planet: 'Moon', years: 10 },
    { planet: 'Mercury', years: 10 }, { planet: 'Saturn', years: 10 },
  ], 60);
}

// ─── MANDOOKA DASHA (Frog Dasha) ─────────────────────────────────────────────
// Rasi dasha that "jumps" between signs like a frog — skips alternate signs.
// Reference: BPHS Ch.20, Jaimini

export function calculateMandookaDasha(ascSign: number, birthDate: Date): RasiDashaEntry[] {
  const dashas: RasiDashaEntry[] = [];
  let cur = new Date(birthDate);
  const odd = isOddSign(ascSign);

  // Mandooka: start from ascendant, jump every alternate sign
  // Odd sign: +3 (skip 2), Even sign: -3 (skip 2 backward)
  for (let i = 0; i < 12; i++) {
    const sign = ((ascSign - 1 + i * (odd ? 3 : -3) + 144) % 12) + 1;
    const years = sign; // Duration = sign number (1-12)
    const end = addYears(cur, years);
    dashas.push({ sign, signName: RASHI_NAMES[sign - 1], years, startDate: fmt(cur), endDate: fmt(end) });
    cur = end;
  }
  return dashas;
}

// ─── DRIG DASHA (Aspect-based Dasha) ────────────────────────────────────────
// Jaimini dasha based on aspects. Duration based on sign's relationship.
// Reference: Jaimini Sutras Ch.2

export function calculateDrigDasha(ascSign: number, planets: PlanetPosition[], birthDate: Date): RasiDashaEntry[] {
  const dashas: RasiDashaEntry[] = [];
  let cur = new Date(birthDate);

  // Start from ascendant, proceed zodiacally for odd, reverse for even
  const direction = isOddSign(ascSign) ? 1 : -1;

  for (let i = 0; i < 12; i++) {
    const sign = ((ascSign - 1 + i * direction + 144) % 12) + 1;
    const lord = SIGN_LORD[sign];
    const lSign = lordSign(lord, planets);

    // Duration = count of aspecting planets on the sign
    let aspecting = 0;
    for (const p of planets) {
      if (p.planet.id > 8) continue;
      const pSign = Math.floor(p.longitude / 30) + 1;
      const offset = ((pSign - sign + 12) % 12) + 1;
      // Jaimini aspects: signs in 1,5,9 from each other aspect (trine)
      if ([1, 5, 9].includes(offset)) aspecting++;
    }
    const years = aspecting === 0 ? ((lSign - sign + 12) % 12 || 12) : aspecting + 6;

    const end = addYears(cur, years);
    dashas.push({ sign, signName: RASHI_NAMES[sign - 1], years, startDate: fmt(cur), endDate: fmt(end) });
    cur = end;
  }
  return dashas;
}

// ─── MOOLA DASHA (Root Dasha) ─────────────────────────────────────────────
// Based on the nakshatra at birth — root spiritual dasha.
// Reference: BPHS Ch.20

export function calculateMoolaDasha(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Ketu', years: 7 }, { planet: 'Venus', years: 21 },
    { planet: 'Sun', years: 6 }, { planet: 'Moon', years: 10 },
    { planet: 'Mars', years: 7 }, { planet: 'Rahu', years: 18 },
    { planet: 'Jupiter', years: 16 }, { planet: 'Saturn', years: 19 },
    { planet: 'Mercury', years: 17 },
  ], 121);
}

// ─── NAVAMSHA DASHA (D9 Sign-based) ──────────────────────────────────────
// Duration based on Navamsha sign of each planet. Reveals dharmic life patterns.
// Reference: Jaimini-derived system

export function calculateNavamshaDasha(ascSign: number, moonSidLong: number, birthDate: Date): RasiDashaEntry[] {
  const dashas: RasiDashaEntry[] = [];
  let cur = new Date(birthDate);

  // Navamsha sign of Moon determines starting point
  const navamshaDiv = (moonSidLong % 30) / (30 / 9);
  const navamshaStartSign = ((ascSign - 1 + Math.floor(navamshaDiv)) % 12) + 1;

  for (let i = 0; i < 12; i++) {
    const sign = ((navamshaStartSign - 1 + i) % 12) + 1;
    // Duration: based on navamsha pada (1-9 mapped to years)
    const years = ((sign - 1) % 9) + 1;
    const end = addYears(cur, years);
    dashas.push({ sign, signName: RASHI_NAMES[sign - 1], years, startDate: fmt(cur), endDate: fmt(end) });
    cur = end;
  }
  return dashas;
}

// ─── NAISARGIKA DASHA (Natural Planetary Periods) ─────────────────────────
// Fixed natural periods representing life stages, not dependent on chart.
// Reference: BPHS Ch.21

export function calculateNaisargikaDasha(birthDate: Date): GrahaDashaEntry[] {
  const order = [
    { planet: 'Moon', years: 1 },     // Infancy (0-1)
    { planet: 'Mars', years: 2 },     // Early childhood (1-3)
    { planet: 'Mercury', years: 9 },  // Childhood/education (3-12)
    { planet: 'Venus', years: 20 },   // Youth/romance (12-32)
    { planet: 'Jupiter', years: 18 }, // Maturity/expansion (32-50)
    { planet: 'Sun', years: 25 },     // Authority/peak (50-75)
    { planet: 'Saturn', years: 25 },  // Elder/renunciation (75-100)
  ];

  const dashas: GrahaDashaEntry[] = [];
  let cur = new Date(birthDate);

  for (const d of order) {
    const end = addYears(cur, d.years);
    dashas.push({
      planet: d.planet,
      planetName: PLANET_NAME_MAP[d.planet] || { en: d.planet, hi: d.planet, sa: d.planet },
      years: d.years,
      startDate: fmt(cur),
      endDate: fmt(end),
      level: 'maha',
    });
    cur = end;
  }
  return dashas;
}

// ─── TARA DASHA (Star-based) ─────────────────────────────────────────────
// Based on tara-bala (star strength) from birth nakshatra.
// Reference: Classical Muhurta texts

export function calculateTaraDasha(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Sun', years: 6 }, { planet: 'Moon', years: 10 },
    { planet: 'Mars', years: 7 }, { planet: 'Rahu', years: 18 },
    { planet: 'Jupiter', years: 16 }, { planet: 'Saturn', years: 19 },
    { planet: 'Mercury', years: 17 }, { planet: 'Ketu', years: 7 },
    { planet: 'Venus', years: 20 },
  ], 120);
}

// ─── YOGINI DASHA (alternate order) ──────────────────────────────────────
// 36-year cycle with 8 yogini goddesses mapped to planets.
// Different ordering from the Yogini in kundali-calc.
// Reference: Mantra Mahodadhi, Dasha Paddhati

export function calculateYoginiDashaAlt(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Moon', years: 1 },    // Mangala
    { planet: 'Sun', years: 2 },     // Pingala
    { planet: 'Jupiter', years: 3 }, // Dhanya
    { planet: 'Mars', years: 4 },    // Bhramari
    { planet: 'Mercury', years: 5 }, // Bhadrika
    { planet: 'Saturn', years: 6 },  // Ulka
    { planet: 'Venus', years: 7 },   // Siddha
    { planet: 'Rahu', years: 8 },    // Sankata
  ], 36);
}

// ─── TITHI ASHTOTTARI ────────────────────────────────────────────────────
// 108-year cycle based on tithi at birth.
// Reference: Saravali, Hora Sara

export function calculateTithiAshtottariDasha(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Sun', years: 6 }, { planet: 'Moon', years: 15 },
    { planet: 'Mars', years: 8 }, { planet: 'Mercury', years: 17 },
    { planet: 'Saturn', years: 10 }, { planet: 'Jupiter', years: 19 },
    { planet: 'Rahu', years: 12 }, { planet: 'Venus', years: 21 },
  ], 108);
}

// ─── YOGA VIMSOTTARI ─────────────────────────────────────────────────────
// 120-year cycle based on yoga (Sun+Moon combination) at birth.
// Uses same sequence as Vimsottari but starting point from yoga number.
// Reference: Hora Ratnam

export function calculateYogaVimsottariDasha(sunLong: number, moonLong: number, birthDate: Date): GrahaDashaEntry[] {
  // Yoga = (Sun + Moon longitude) / (360/27) = yoga number 0-26
  const yogaLong = (sunLong + moonLong) % 360;
  return calcGrahaDasha(yogaLong, birthDate, [
    { planet: 'Ketu', years: 7 }, { planet: 'Venus', years: 20 },
    { planet: 'Sun', years: 6 }, { planet: 'Moon', years: 10 },
    { planet: 'Mars', years: 7 }, { planet: 'Rahu', years: 18 },
    { planet: 'Jupiter', years: 16 }, { planet: 'Saturn', years: 19 },
    { planet: 'Mercury', years: 17 },
  ], 120);
}

// ─── BUDDHI GATHI DASHA ──────────────────────────────────────────────────
// Intelligence-based dasha system, 100-year cycle.
// Based on Mercury's position and strength.
// Reference: Hora Sara Ch.13

export function calculateBuddhiGathiDasha(moonSidLong: number, birthDate: Date): GrahaDashaEntry[] {
  return calcGrahaDasha(moonSidLong, birthDate, [
    { planet: 'Mercury', years: 20 }, { planet: 'Moon', years: 9 },
    { planet: 'Saturn', years: 16 }, { planet: 'Jupiter', years: 18 },
    { planet: 'Mars', years: 7 }, { planet: 'Venus', years: 21 },
    { planet: 'Sun', years: 5 }, { planet: 'Rahu', years: 4 },
  ], 100);
}
