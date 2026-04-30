import type { LocaleText } from '@/types/panchang';
/**
 * Daily Horoscope Engine — pure, deterministic computation.
 * No external API calls, no LLM. Same (moonSign + date) = same result.
 *
 * Scoring factors:
 *  1. Moon transit house from natal Moon (Chandrabala)
 *  2. Today's tithi quality
 *  3. Today's nakshatra nature
 *  4. Today's yoga auspiciousness
 *  5. Weekday lord compatibility with Moon sign lord
 *  6. Slow planet transits (Saturn, Jupiter, Rahu) relative to Moon sign
 */

import {
  dateToJD, sunLongitude, moonLongitude, toSidereal,
  getRashiNumber, getNakshatraNumber, calculateTithi,
  calculateYoga, getPlanetaryPositions, lahiriAyanamsha,
} from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import {
  TEMPLATES, INSIGHT_GOOD, INSIGHT_MIXED, INSIGHT_CHALLENGING,
  LUCKY_COLORS,
  type BilingualText, type QualityTier, type LifeArea,
} from './templates';

// ─────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────
export interface DailyHoroscope {
  date: string;
  moonSign: number;          // 1-12
  moonSignName: LocaleText;
  overallScore: number;      // 1-10
  areas: {
    career:       { score: number; text: LocaleText };
    love:         { score: number; text: LocaleText };
    health:       { score: number; text: LocaleText };
    finance:      { score: number; text: LocaleText };
    spirituality: { score: number; text: LocaleText };
  };
  insight: LocaleText;
  luckyColor: LocaleText;
  luckyNumber: number;
  luckyTime: string;          // e.g. "10:00 AM - 12:00 PM"
  // Present only when birth nakshatra was supplied (Tara Bala personalization)
  taraBala?: {
    taraGroup: number;        // 0-8 (Janma through Parama Mitra)
    taraName: string;         // e.g. "Sampat"
    isAuspicious: boolean;
    modifier: number;         // actual score delta applied (+0.5 / -0.5 / 0)
  };
}

export interface DailyEngineInput {
  moonSign: number;           // 1-12
  date: string;               // "YYYY-MM-DD"
  nakshatra?: number;         // birth nakshatra 1-27 (optional refinement)
}

// ─────────────────────────────────────────────────────────────
// Deterministic seed from date + moonSign
// ─────────────────────────────────────────────────────────────
function dateSeed(dateStr: string, moonSign: number): number {
  // Simple hash: sum of char codes * moonSign + date components
  const parts = dateStr.split('-').map(Number);
  const base = (parts[0] || 2026) * 10000 + (parts[1] || 1) * 100 + (parts[2] || 1);
  let hash = base * moonSign;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pick<T>(arr: T[], seed: number, offset: number = 0): T {
  return arr[((seed + offset) >>> 0) % arr.length];
}

// ─────────────────────────────────────────────────────────────
// Moon transit house scoring (Chandrabala)
// ─────────────────────────────────────────────────────────────
// House = (currentMoonSign - natalMoonSign + 12) % 12 + 1
// Houses 2,5,9,11 = good (+2); 1,4,7,10 = neutral (0); 3,6,8,12 = challenging (-2)
const HOUSE_SCORE: Record<number, number> = {
  1: 0, 2: 2, 3: -2, 4: 0, 5: 2, 6: -2,
  7: 0, 8: -2, 9: 2, 10: 0, 11: 2, 12: -2,
};

// ─────────────────────────────────────────────────────────────
// Tithi quality score
// ─────────────────────────────────────────────────────────────
// Tithis 1-30; Shukla Panchami(5), Purnima(15) = excellent
// Amavasya(30) = low; Ekadashi(11,26) = spiritual boost
function tithiScore(tithiNum: number): number {
  // Great tithis
  if ([2, 3, 5, 7, 10, 11, 13, 15].includes(tithiNum)) return 2;
  if ([17, 18, 20, 22, 25, 26, 28].includes(tithiNum)) return 1;
  // Challenging tithis
  if ([4, 8, 9, 14, 19, 23, 24, 29, 30].includes(tithiNum)) return -1;
  return 0;
}

// ─────────────────────────────────────────────────────────────
// Nakshatra nature score
// ─────────────────────────────────────────────────────────────
function nakshatraNatureScore(nakshatraId: number): number {
  const nak = NAKSHATRAS[nakshatraId - 1];
  if (!nak) return 0;
  const nature = nak.nature.en.toLowerCase();
  // Soft, Tender = +1; Light, Swift = +1; Fixed, Stable = 0; Movable = 0; Sharp, Fierce = -1
  if (nature.includes('soft') || nature.includes('tender') || nature.includes('light') || nature.includes('swift')) return 1;
  if (nature.includes('fierce') || nature.includes('severe') || nature.includes('sharp')) return -1;
  return 0;
}

// ─────────────────────────────────────────────────────────────
// Yoga auspiciousness score
// ─────────────────────────────────────────────────────────────
function yogaScore(yogaNum: number): number {
  const yoga = YOGAS[yogaNum - 1];
  if (!yoga) return 0;
  if (yoga.nature === 'auspicious') return 1;
  if (yoga.nature === 'inauspicious') return -1;
  return 0;
}

// ─────────────────────────────────────────────────────────────
// Weekday lord compatibility with Moon sign lord
// ─────────────────────────────────────────────────────────────
// Day lords: Sun(0), Moon(1), Mars(2), Mercury(3), Jupiter(4), Venus(5), Saturn(6)
// Sign lords: Aries=Mars, Taurus=Venus, Gemini=Mercury, etc.
const SIGN_LORD: Record<number, string> = {
  1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
  7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter',
};

const DAY_LORD: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter', 5: 'Venus', 6: 'Saturn',
};

// Natural friendships in Vedic astrology
const FRIENDS: Record<string, string[]> = {
  Sun:     ['Moon', 'Mars', 'Jupiter'],
  Moon:    ['Sun', 'Mercury'],
  Mars:    ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus:   ['Mercury', 'Saturn'],
  Saturn:  ['Mercury', 'Venus'],
};

function dayLordScore(weekday: number, moonSign: number): number {
  const dayL = DAY_LORD[weekday];
  const signL = SIGN_LORD[moonSign];
  if (!dayL || !signL) return 0;
  if (dayL === signL) return 2; // own day
  if (FRIENDS[signL]?.includes(dayL)) return 1;
  if (FRIENDS[dayL]?.includes(signL)) return 1;
  return -1; // enemy or neutral-negative
}

// ─────────────────────────────────────────────────────────────
// Slow planet transit score (Saturn, Jupiter, Rahu relative to Moon sign)
// ─────────────────────────────────────────────────────────────
function slowPlanetScore(planetSiderealSign: number, natalMoonSign: number): number {
  const house = ((planetSiderealSign - natalMoonSign + 12) % 12) + 1;
  return HOUSE_SCORE[house] || 0;
}

// ─────────────────────────────────────────────────────────────
// Quality tier from score
// ─────────────────────────────────────────────────────────────
function scoreToTier(score: number): QualityTier {
  if (score >= 6.5) return 'good';
  if (score >= 4) return 'mixed';
  return 'challenging';
}

// ─────────────────────────────────────────────────────────────
// Per-area modifiers (each area is influenced slightly differently)
// ─────────────────────────────────────────────────────────────
const AREA_WEIGHTS: Record<LifeArea, { house: number; tithi: number; nak: number; yoga: number; dayLord: number; slow: number }> = {
  career:       { house: 1.0, tithi: 0.5, nak: 0.4, yoga: 0.5, dayLord: 0.8, slow: 0.8 },
  love:         { house: 0.8, tithi: 0.7, nak: 0.6, yoga: 0.6, dayLord: 0.5, slow: 0.5 },
  health:       { house: 0.7, tithi: 0.4, nak: 0.5, yoga: 0.5, dayLord: 0.6, slow: 0.9 },
  finance:      { house: 1.0, tithi: 0.6, nak: 0.3, yoga: 0.7, dayLord: 0.7, slow: 1.0 },
  spirituality: { house: 0.5, tithi: 0.9, nak: 0.8, yoga: 0.9, dayLord: 0.4, slow: 0.4 },
};

// ─────────────────────────────────────────────────────────────
// Lucky time slots (deterministic from seed)
// ─────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  '6:00 AM - 8:00 AM', '8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM', '8:00 PM - 10:00 PM',
];

// ─────────────────────────────────────────────────────────────
// Tara Bala scoring
// ─────────────────────────────────────────────────────────────
// Tara number = (currentNakshatra - birthNakshatra + 27) % 27, 0-indexed tara group = floor(tara / 3)
// Groups (0=Janma, 2=Vipath, 4=Pratyari, 6=Naidhana) are inauspicious → -5 score modifier
// Groups (1=Sampat, 3=Kshema, 5=Sadhaka, 7=Mitra, 8=Parama Mitra) are auspicious → +5 modifier
const INAUSPICIOUS_TARA_GROUPS = new Set([0, 2, 4, 6]);
const AUSPICIOUS_TARA_GROUPS   = new Set([1, 3, 5, 7, 8]);
const TARA_NAMES = ['Janma', 'Sampat', 'Vipath', 'Kshema', 'Pratyari', 'Sadhaka', 'Naidhana', 'Mitra', 'Parama Mitra'];

function taraBalaModifier(currentNakshatra: number, birthNakshatra: number): number {
  // Both are 1-indexed (1-27); convert to 0-indexed for the formula
  const tara = (currentNakshatra - birthNakshatra + 27) % 27;
  const group = Math.floor(tara / 3);
  if (AUSPICIOUS_TARA_GROUPS.has(group))   return  5;
  if (INAUSPICIOUS_TARA_GROUPS.has(group)) return -5;
  return 0;
}

// ─────────────────────────────────────────────────────────────
// Main engine
// ─────────────────────────────────────────────────────────────
export function generateDailyHoroscope(input: DailyEngineInput): DailyHoroscope {
  const { moonSign, date } = input;
  const seed = dateSeed(date, moonSign);

  // Parse date
  const [year, month, day] = date.split('-').map(Number);
  const jd = dateToJD(year, month, day, 6); // ~6 AM for "today"

  // Current transit Moon
  const moonTropical = moonLongitude(jd);
  const moonSidereal = toSidereal(moonTropical, jd);
  const currentMoonSign = getRashiNumber(moonSidereal);
  const currentNakshatraId = getNakshatraNumber(moonSidereal);

  // Tithi & Yoga
  const tithiResult = calculateTithi(jd);
  const yogaNum = calculateYoga(jd);

  // Weekday — local timezone is correct: weekday is a calendar concept, not astronomical.
  // Same date = same weekday regardless of server timezone. (See Lesson L/O in CLAUDE.md)
  const dateObj = new Date(year, month - 1, day);
  const weekday = dateObj.getDay(); // 0=Sun

  // Planetary positions (tropical -> sidereal for slow planets)
  const planets = getPlanetaryPositions(jd);
  const ayanamsha = lahiriAyanamsha(jd);

  const getSiderealSign = (planetId: number): number => {
    const p = planets.find(pl => pl.id === planetId);
    if (!p) return 1;
    const sid = ((p.longitude - ayanamsha) % 360 + 360) % 360;
    return Math.floor(sid / 30) + 1;
  };

  // Raw factor scores
  const houseFromMoon = ((currentMoonSign - moonSign + 12) % 12) + 1;
  const rawHouse = HOUSE_SCORE[houseFromMoon] || 0;
  const rawTithi = tithiScore(tithiResult.number);
  const rawNak = nakshatraNatureScore(currentNakshatraId);
  const rawYoga = yogaScore(yogaNum);
  const rawDayLord = dayLordScore(weekday, moonSign);

  // Slow planets: Jupiter(4), Saturn(6), Rahu(7)
  const jupSign = getSiderealSign(4);
  const satSign = getSiderealSign(6);
  const rahSign = getSiderealSign(7);
  const rawSlow = (
    slowPlanetScore(jupSign, moonSign) +
    slowPlanetScore(satSign, moonSign) +
    slowPlanetScore(rahSign, moonSign)
  ) / 3; // average

  // Compute per-area scores (normalized to 1-10)
  const areas: Record<LifeArea, { score: number; text: BilingualText }> = {} as typeof areas;
  const AREA_NAMES: LifeArea[] = ['career', 'love', 'health', 'finance', 'spirituality'];

  for (let i = 0; i < AREA_NAMES.length; i++) {
    const area = AREA_NAMES[i];
    const w = AREA_WEIGHTS[area];

    // Weighted sum: each raw factor is in [-2, 2] range
    const weighted =
      rawHouse * w.house +
      rawTithi * w.tithi +
      rawNak * w.nak +
      rawYoga * w.yoga +
      rawDayLord * w.dayLord +
      rawSlow * w.slow;

    // Max possible weighted sum for normalization
    const maxPossible = 2 * (w.house + w.tithi + w.nak + w.yoga + w.dayLord + w.slow);

    // Normalize to 1-10 (5.5 is neutral center)
    const normalized = 5.5 + (weighted / maxPossible) * 4.5;
    const score = Math.max(1, Math.min(10, Math.round(normalized * 10) / 10));

    // Pick text template
    const tier = scoreToTier(score);
    const pool = TEMPLATES[area][tier];
    const text = pick(pool, seed, i * 7);

    areas[area] = { score, text };
  }

  // Overall score: weighted average of area scores
  const overallRaw = (
    areas.career.score * 0.25 +
    areas.love.score * 0.20 +
    areas.health.score * 0.20 +
    areas.finance.score * 0.20 +
    areas.spirituality.score * 0.15
  );

  // Tara Bala refinement: when birth nakshatra is provided, apply ±5 modifier
  // to the raw per-area scores (on 1-100 scale → ±0.5 on 1-10 scale).
  // Modifier is applied before final clamp so it can shift borderline days.
  const taraMod = input.nakshatra ? taraBalaModifier(currentNakshatraId, input.nakshatra) / 10 : 0;
  const overallScore = Math.max(1, Math.min(10, Math.round((overallRaw + taraMod) * 10) / 10));

  // Overall tier for insight
  const overallTier = scoreToTier(overallScore);
  const insightPool = overallTier === 'good' ? INSIGHT_GOOD : overallTier === 'mixed' ? INSIGHT_MIXED : INSIGHT_CHALLENGING;
  const insight = pick(insightPool, seed, 31);

  // Lucky color based on Moon sign lord + day variation
  const luckyColor = pick(LUCKY_COLORS, seed, moonSign * 3 + weekday);

  // Lucky number: 1-9 based on seed
  const luckyNumber = (seed % 9) + 1;

  // Lucky time
  const luckyTime = pick(TIME_SLOTS, seed, moonSign + weekday);

  // Rashi name
  const rashi = RASHIS[moonSign - 1];
  const moonSignName = rashi
    ? { en: rashi.name.en, hi: rashi.name.hi }
    : { en: 'Unknown', hi: 'अज्ञात', sa: 'अज्ञात', mai: 'अज्ञात', mr: 'अज्ञात', ta: 'அறியாத', te: 'తెలియని', bn: 'অজানা', kn: 'ಅಜ್ಞಾತ', gu: 'અજ્ઞાત' };

  // Build Tara Bala metadata when birth nakshatra was supplied
  let taraBala: DailyHoroscope['taraBala'];
  if (input.nakshatra) {
    const tara = (currentNakshatraId - input.nakshatra + 27) % 27;
    const group = Math.floor(tara / 3);
    taraBala = {
      taraGroup: group,
      taraName: TARA_NAMES[group] ?? 'Janma',
      isAuspicious: AUSPICIOUS_TARA_GROUPS.has(group),
      modifier: taraMod,
    };
  }

  return {
    date,
    moonSign,
    moonSignName,
    overallScore,
    areas: {
      career:       { score: areas.career.score,       text: { en: areas.career.text.en,       hi: areas.career.text.hi } },
      love:         { score: areas.love.score,         text: { en: areas.love.text.en,         hi: areas.love.text.hi } },
      health:       { score: areas.health.score,       text: { en: areas.health.text.en,       hi: areas.health.text.hi } },
      finance:      { score: areas.finance.score,      text: { en: areas.finance.text.en,      hi: areas.finance.text.hi } },
      spirituality: { score: areas.spirituality.score, text: { en: areas.spirituality.text.en, hi: areas.spirituality.text.hi } },
    },
    insight,
    luckyColor,
    luckyNumber,
    luckyTime,
    ...(taraBala ? { taraBala } : {}),
  };
}
