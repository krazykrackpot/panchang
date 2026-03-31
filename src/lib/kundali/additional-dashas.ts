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
