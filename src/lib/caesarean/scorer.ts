// src/lib/caesarean/scorer.ts

/**
 * Caesarean Birth Time Scorer  –  5-Pillar Classical Framework
 *
 * Evaluates a candidate birth moment across:
 *   1. Lagna Strength (30 pts)  –  BPHS Ch.6-7
 *   2. Moon Strength (25 pts)  –  Muhurta Chintamani
 *   3. Benefic/Malefic Distribution (20 pts)  –  Prasna Marga Ch.9
 *   4. Dasha Trajectory (15 pts)  –  BPHS dasha chapters
 *   5. Structural Defects (10 pts base, deducted)  –  multiple sources
 *
 * Input: pre-computed chart snapshot (not raw BirthData  –  the scanner handles
 * the expensive kundali computation and passes the relevant data here).
 *
 * This scorer is a PURE FUNCTION  –  no side effects, no I/O.
 */

import type { LocaleText } from '@/types/panchang';
import type {
  ScoredBirthSlot, PillarBreakdown, ChartDefect, ChartStrength,
  BirthDashaInfo, SlotGrade,
} from './types';
import {
  isInGandanta, MOON_HOUSE_SCORE, LAGNA_LORD_HOUSE_SCORE,
  NAKSHATRA_GANA, NATURAL_BENEFICS, NATURAL_MALEFICS,
  DASHA_LORD_BIRTH_SCORE, JANMA_NAKSHATRA_DOSHAS,
  COMBUSTION_ORBS, getBadhakeshPlanet,
} from './constants';
import { SIGN_LORDS, isExalted, isDebilitated, isOwnSign, MOOLATRIKONA } from '@/lib/constants/dignities';
import { isInPushkarNavamsha } from '@/lib/constants/pushkar-bhaga';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';

// ─── Scorer Input ───────────────────────────────────────────────────────────

/** Lightweight chart snapshot  –  the minimum data needed to score a slot */
export interface ChartSnapshot {
  lagnaSign: number;           // 1-12
  lagnaDegreesInSign: number;  // 0-30 degrees within sign
  lagnaLordId: number;         // 0-8 planet ID
  lagnaLordSign: number;       // 1-12 sign the lord is in
  lagnaLordHouse: number;      // 1-12 house from lagna (whole-sign)
  moonSign: number;            // 1-12
  moonHouse: number;           // 1-12 from lagna
  moonSidDeg: number;          // 0-360 sidereal longitude
  moonNakshatraId: number;     // 1-27
  moonNakshatraPada: number;   // 1-4
  planets: Array<{
    id: number;                // 0=Sun..8=Ketu
    sign: number;              // 1-12
    house: number;             // 1-12
    longitude: number;         // sidereal degrees
    isRetrograde: boolean;
  }>;
  tithiNumber: number;         // 1-30
  yogaNumber: number;          // 1-27
  karanaNumber: number;        // 1-11
  sunSidDeg: number;           // Sun's sidereal longitude (for combustion checks)
}

// ─── Vimshottari Dasha Data ─────────────────────────────────────────────────
// Canonical 27-entry nakshatra→lord string array — audit P4b #13.

import { NAKSHATRA_LORDS } from '@/lib/constants/nakshatras';

const DASHA_TOTAL_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

const LORD_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

// ─── Main Scorer ────────────────────────────────────────────────────────────

export function scoreBirthSlot(snap: ChartSnapshot): ScoredBirthSlot {
  const strengths: ChartStrength[] = [];
  const defects: ChartDefect[] = [];

  // ── Pillar 5 first: check for hard vetoes ──
  const { defectScore, isVetoed, vetoReason } = scoreDefects(snap, defects);
  if (isVetoed) {
    return buildVetoedSlot(snap, defects, vetoReason!);
  }

  // ── Pillar 1: Lagna Strength (0-30) ──
  const lagnaScore = scoreLagnaPillar(snap, strengths, defects);

  // ── Pillar 2: Moon Strength (0-25) ──
  const moonScore = scoreMoonPillar(snap, strengths);

  // ── Pillar 3: Benefic/Malefic Distribution (0-20) ──
  const distScore = scoreDistribution(snap, strengths);

  // ── Pillar 4: Dasha Trajectory (0-15) ──
  const { dashaScore, dashaInfo } = scoreDasha(snap, strengths);

  const breakdown: PillarBreakdown = {
    lagna: lagnaScore,
    moon: moonScore,
    distribution: distScore,
    dasha: dashaScore,
    defects: defectScore,
  };

  const total = lagnaScore + moonScore + distScore + dashaScore + defectScore;
  const score = Math.max(0, Math.min(100, Math.round(total)));

  return {
    date: '', time: '', endTime: '', // filled by scanner
    score,
    grade: getGrade(score),
    pillarBreakdown: breakdown,
    strengths,
    defects,
    dashaInfo,
    lagnaSign: snap.lagnaSign,
    lagnaSignName: RASHIS[snap.lagnaSign - 1]?.name ?? { en: '?', hi: '?' },
    lagnaLordId: snap.lagnaLordId,
    moonSign: snap.moonSign,
    moonNakshatra: snap.moonNakshatraId,
    moonNakshatraName: NAKSHATRAS[snap.moonNakshatraId - 1]?.name ?? { en: '?', hi: '?' },
    yogas: [], // filled by scanner if full kundali available
    panchang: {
      tithi: { en: '', hi: '' },
      nakshatra: { en: '', hi: '' },
      yoga: { en: '', hi: '' },
      karana: { en: '', hi: '' },
    }, // filled by scanner
    isVetoed: false,
  };
}

// ─── Pillar Scorers ─────────────────────────────────────────────────────────

function scoreLagnaPillar(snap: ChartSnapshot, strengths: ChartStrength[], defects: ChartDefect[]): number {
  let score = 0;

  // 1. Lagna lord dignity (0-10)
  const dignity = getDignityScore(snap.lagnaLordId, snap.lagnaLordSign);
  score += dignity;
  if (dignity >= 8) {
    strengths.push({
      id: 'lagna_lord_strong',
      label: { en: 'Lagna lord in strong dignity', hi: 'लग्नेश बलवान गरिमा में' },
      points: dignity, pillar: 'lagna', source: 'BPHS Ch.3-4',
    });
  }

  // 2. Lagna lord house placement (0-5)
  const houseScore = LAGNA_LORD_HOUSE_SCORE[snap.lagnaLordHouse] ?? 0;
  score += houseScore;
  if (houseScore >= 4) {
    strengths.push({
      id: 'lagna_lord_kendra_trikona',
      label: { en: `Lagna lord in ${ordinal(snap.lagnaLordHouse)} house`, hi: `लग्नेश ${snap.lagnaLordHouse}वें भाव में` },
      points: houseScore, pillar: 'lagna', source: 'BPHS Ch.6',
    });
  }

  // 3. Benefic in lagna (0-5)
  const beneficInLagna = snap.planets.filter(
    p => p.house === 1 && (NATURAL_BENEFICS.has(p.id) || (p.id === 1 && isWaxingMoon(snap.tithiNumber)))
  );
  if (beneficInLagna.length > 0) {
    // Score by the best benefic present: Jupiter=5, Venus=4, Mercury=3, waxing Moon=2
    const best = beneficInLagna[0];
    const pts = best.id === 4 ? 5 : best.id === 5 ? 4 : best.id === 3 ? 3 : 2;
    score += pts;
    strengths.push({
      id: 'benefic_in_lagna',
      label: { en: 'Benefic planet in ascendant', hi: 'शुभ ग्रह लग्न में' },
      points: pts, pillar: 'lagna', source: 'Prasna Marga Ch.9',
    });
  }

  // 4. Malefic in lagna penalty (0 or -4)
  const maleficInLagna = snap.planets.filter(p => p.house === 1 && NATURAL_MALEFICS.has(p.id));
  if (maleficInLagna.length > 0 && beneficInLagna.length === 0) {
    // Check if Jupiter or Venus aspects lagna (full Vedic aspects including special aspects)
    const jupiterAspectsLagna = snap.planets.some(
      p => p.id === 4 && planetAspectsHouse(4, p.house, 1)
    );
    const venusAspectsLagna = snap.planets.some(
      p => p.id === 5 && planetAspectsHouse(5, p.house, 1)
    );
    if (!jupiterAspectsLagna && !venusAspectsLagna) {
      score -= 4;
      defects.push({
        id: 'malefic_in_lagna',
        label: { en: 'Malefic in ascendant without benefic aspect', hi: 'शुभ दृष्टि के बिना अशुभ ग्रह लग्न में' },
        deduction: 4, isVeto: false, source: 'Prasna Marga Ch.9',
      });
    }
  }

  // 5. Pushkar Navamsha lagna (0-3)
  if (isInPushkarNavamsha(snap.lagnaSign, snap.lagnaDegreesInSign)) {
    score += 3;
    strengths.push({
      id: 'pushkar_lagna',
      label: { en: 'Ascendant in Pushkar Navamsha', hi: 'लग्न पुष्कर नवांश में' },
      points: 3, pillar: 'lagna', source: 'Saravali',
    });
  }

  // 6. Sandhi lagna buffer (0-3)
  const distFromBoundary = Math.min(snap.lagnaDegreesInSign, 30 - snap.lagnaDegreesInSign);
  const sandhiScore = distFromBoundary >= 2 ? 3 : distFromBoundary >= 1 ? 1 : 0;
  score += sandhiScore;
  if (sandhiScore === 0) {
    defects.push({
      id: 'sandhi_lagna',
      label: { en: 'Ascendant too close to sign boundary (sandhi)', hi: 'लग्न राशि संधि के बहुत करीब' },
      deduction: 3, isVeto: false, source: 'Practitioner consensus',
    });
  }

  return Math.max(0, Math.min(30, score));
}

function scoreMoonPillar(snap: ChartSnapshot, strengths: ChartStrength[]): number {
  let score = 0;

  // 1. Moon's house from lagna (0-8)
  const houseScore = MOON_HOUSE_SCORE[snap.moonHouse] ?? 0;
  score += houseScore;
  if (houseScore >= 7) {
    strengths.push({
      id: 'moon_good_house',
      label: { en: `Moon in ${ordinal(snap.moonHouse)} house`, hi: `चन्द्र ${snap.moonHouse}वें भाव में` },
      points: houseScore, pillar: 'moon', source: 'Muhurta Chintamani',
    });
  }

  // 2. Paksha Bala (0-5)
  const pakshaScore = getPakshaScore(snap.tithiNumber);
  score += pakshaScore;

  // 3. Nakshatra gana quality (0-5)
  const gana = NAKSHATRA_GANA[snap.moonNakshatraId] ?? 'manushya';
  const ganaScore = gana === 'deva' ? 5 : gana === 'manushya' ? 3 : 1;
  score += ganaScore;

  // 4. Janma Nakshatra Dosha (0-4)
  // Check severe (specific pada) first, then moderate (general)
  const severeDosha = JANMA_NAKSHATRA_DOSHAS.find(d =>
    d.nakshatraId === snap.moonNakshatraId &&
    d.problematicPada !== null &&
    d.problematicPada === snap.moonNakshatraPada
  );
  const moderateDosha = JANMA_NAKSHATRA_DOSHAS.find(d =>
    d.nakshatraId === snap.moonNakshatraId &&
    d.problematicPada === null
  );
  if (severeDosha) {
    score += 0; // Problematic pada  –  zero points
  } else if (moderateDosha) {
    score += 2; // Moderate  –  dosha present but not in worst pada
  } else {
    score += 4; // No dosha  –  full points
  }

  // 5. Jupiter aspecting Moon (0-3)
  // CRITICAL: uses planetAspectsHouse which includes Jupiter's special 5th/9th aspects
  const jupiterAspectsMoon = snap.planets.some(
    p => p.id === 4 && planetAspectsHouse(4, p.house, snap.moonHouse)
  );
  if (jupiterAspectsMoon) {
    score += 3;
    strengths.push({
      id: 'jupiter_aspects_moon',
      label: { en: 'Jupiter aspects Moon', hi: 'बृहस्पति की चन्द्र पर दृष्टि' },
      points: 3, pillar: 'moon', source: 'Prasna Marga Ch.9',
    });
  }

  return Math.max(0, Math.min(25, score));
}

function scoreDistribution(snap: ChartSnapshot, strengths: ChartStrength[]): number {
  let score = 0;
  const waxing = isWaxingMoon(snap.tithiNumber);

  // 1. Benefics in kendras (0-8)
  const kendras = [1, 4, 7, 10];
  const beneficsInKendras = snap.planets.filter(p =>
    kendras.includes(p.house) && (NATURAL_BENEFICS.has(p.id) || (p.id === 1 && waxing))
  ).length;
  const kendraScore = Math.min(8, beneficsInKendras * 2.5);
  score += kendraScore;
  if (kendraScore >= 5) {
    strengths.push({
      id: 'benefics_kendras',
      label: { en: `${beneficsInKendras} benefic(s) in kendras`, hi: `केन्द्र में ${beneficsInKendras} शुभ ग्रह` },
      points: Math.round(kendraScore), pillar: 'distribution', source: 'BPHS Ch.11',
    });
  }

  // 2. Benefics in trikonas (0-4)
  const trikonas = [5, 9];
  const beneficsInTrikonas = snap.planets.filter(p =>
    trikonas.includes(p.house) && (NATURAL_BENEFICS.has(p.id) || (p.id === 1 && waxing))
  ).length;
  const trikonaScore = Math.min(4, beneficsInTrikonas * 2);
  score += trikonaScore;

  // 3. Malefics in upachaya (0-4)
  const upachaya = [3, 6, 11];
  const maleficsInUpachaya = snap.planets.filter(p =>
    upachaya.includes(p.house) && NATURAL_MALEFICS.has(p.id)
  ).length;
  const upachayaScore = Math.min(4, maleficsInUpachaya * 2);
  score += upachayaScore;

  // 4. 8th house clean (0-4)
  const in8th = snap.planets.filter(p => p.house === 8);
  const eighth = in8th.length === 0 ? 4 : in8th.every(p => NATURAL_BENEFICS.has(p.id)) ? 2 : 0;
  score += eighth;
  if (eighth === 4) {
    strengths.push({
      id: 'clean_8th',
      label: { en: 'Empty 8th house', hi: 'खाली अष्टम भाव' },
      points: 4, pillar: 'distribution', source: 'Muhurta Chintamani',
    });
  }

  return Math.max(0, Math.min(20, score));
}

function scoreDasha(snap: ChartSnapshot, strengths: ChartStrength[]): { dashaScore: number; dashaInfo: BirthDashaInfo } {
  // Determine nakshatra lord = maha dasha lord at birth
  const nakshatraIdx = snap.moonNakshatraId - 1; // 0-indexed
  const lord = NAKSHATRA_LORDS[nakshatraIdx];
  const totalYears = DASHA_TOTAL_YEARS[lord];

  // Remaining dasha = totalYears * (1 - fraction of nakshatra traversed)
  const nakshatraSpan = 360 / 27; // 13.333... degrees per nakshatra
  const nakshatraStartDeg = nakshatraIdx * nakshatraSpan;
  const posInNakshatra = ((snap.moonSidDeg - nakshatraStartDeg + 360) % 360) / nakshatraSpan;
  const remainingYears = totalYears * (1 - posInNakshatra);

  // Base score from lord quality
  const baseScore = DASHA_LORD_BIRTH_SCORE[lord] ?? 3;

  // Balance multiplier: full score only if >= 50% of dasha remains
  const balanceMult = Math.min(1.0, remainingYears / (totalYears * 0.5));

  const dashaScore = Math.min(15, Math.round(baseScore * balanceMult * 1.5));

  if (dashaScore >= 10) {
    strengths.push({
      id: 'strong_dasha',
      label: {
        en: `Starts in ${lord} Mahadasha (${remainingYears.toFixed(1)} yrs)`,
        hi: `${lord} महादशा से प्रारम्भ (${remainingYears.toFixed(1)} वर्ष)`,
      },
      points: dashaScore, pillar: 'dasha', source: 'BPHS Dasha chapters',
    });
  }

  return {
    dashaScore,
    dashaInfo: {
      lord,
      lordId: LORD_NAME_TO_ID[lord] ?? 0,
      totalYears,
      remainingYears: Math.round(remainingYears * 10) / 10,
      score: dashaScore,
    },
  };
}

function scoreDefects(snap: ChartSnapshot, defects: ChartDefect[]): { defectScore: number; isVetoed: boolean; vetoReason?: LocaleText } {
  let base = 10;

  // ── Hard veto: Gandanta Moon ──
  if (isInGandanta(snap.moonSidDeg)) {
    defects.push({
      id: 'gandanta_moon',
      label: { en: 'Moon in Gandanta zone  –  avoid', hi: 'चन्द्र गंडान्त क्षेत्र में  –  टालें' },
      deduction: 10, isVeto: true, source: 'Muhurta Chintamani',
    });
    return {
      defectScore: 0,
      isVetoed: true,
      vetoReason: {
        en: 'Moon in Gandanta  –  birth at water-fire sign junction is classically prohibited',
        hi: 'चन्द्र गंडान्त में  –  जल-अग्नि राशि संधि पर जन्म शास्त्रीय रूप से निषिद्ध',
      },
    };
  }

  // ── Kaal Sarpa check ──
  const rahuKetu = snap.planets.filter(p => p.id === 7 || p.id === 8);
  if (rahuKetu.length === 2) {
    const rahu = rahuKetu.find(p => p.id === 7)!;
    const ketu = rahuKetu.find(p => p.id === 8)!;
    const otherPlanets = snap.planets.filter(p => p.id !== 7 && p.id !== 8);
    if (otherPlanets.length > 0 && isKaalSarpa(rahu.longitude, ketu.longitude, otherPlanets)) {
      base -= 8;
      defects.push({
        id: 'kaal_sarpa',
        label: { en: 'Kaal Sarpa Yoga  –  all planets between Rahu-Ketu axis', hi: 'काल सर्प योग  –  सभी ग्रह राहु-केतु अक्ष के बीच' },
        deduction: 8, isVeto: false, source: 'Multiple classical sources',
      });
    }
  }

  // ── Lagna lord combust (Lesson X: retrograde orbs for Mercury/Venus) ──
  const lagnaLordPlanet = snap.planets.find(p => p.id === snap.lagnaLordId);
  if (lagnaLordPlanet && snap.lagnaLordId !== 0 && snap.lagnaLordId !== 7 && snap.lagnaLordId !== 8) {
    // Sun(0), Rahu(7), Ketu(8) cannot be combust
    const orb = COMBUSTION_ORBS[snap.lagnaLordId] ?? 12;
    // Lesson X: reduced orbs for retrograde Mercury (14->12) and Venus (10->8)
    const adjustedOrb = (snap.lagnaLordId === 3 || snap.lagnaLordId === 5) && lagnaLordPlanet.isRetrograde
      ? orb - 2
      : orb;
    const dist = Math.abs(lagnaLordPlanet.longitude - snap.sunSidDeg);
    const angDist = dist > 180 ? 360 - dist : dist;
    if (angDist < adjustedOrb) {
      base -= 6;
      defects.push({
        id: 'lagna_lord_combust',
        label: { en: 'Lagna lord combust by Sun', hi: 'लग्नेश सूर्य से अस्त' },
        deduction: 6, isVeto: false, source: 'BPHS Ch.3',
      });
    }
  }

  // ── Rahu/Ketu in lagna ──
  const rahuKetuInLagna = snap.planets.filter(p => (p.id === 7 || p.id === 8) && p.house === 1);
  if (rahuKetuInLagna.length > 0) {
    base -= 5;
    defects.push({
      id: 'rahu_ketu_lagna',
      label: { en: 'Rahu/Ketu in ascendant', hi: 'राहु/केतु लग्न में' },
      deduction: 5, isVeto: false, source: 'Prasna Marga',
    });
  }

  // ── Rahu/Ketu in 7th house ──
  const rahuKetuIn7 = snap.planets.filter(p => (p.id === 7 || p.id === 8) && p.house === 7);
  if (rahuKetuIn7.length > 0) {
    base -= 4;
    defects.push({
      id: 'rahu_ketu_7th',
      label: { en: 'Rahu/Ketu in 7th house', hi: 'राहु/केतु सप्तम भाव में' },
      deduction: 4, isVeto: false, source: 'Prasna Marga',
    });
  }

  // ── Saturn in lagna without Jupiter aspect ──
  const saturnInLagna = snap.planets.some(p => p.id === 6 && p.house === 1);
  if (saturnInLagna) {
    const jupAspects = snap.planets.some(p => p.id === 4 && planetAspectsHouse(4, p.house, 1));
    if (!jupAspects) {
      base -= 5;
      defects.push({
        id: 'saturn_in_lagna',
        label: { en: 'Saturn in ascendant without Jupiter\'s aspect', hi: 'बृहस्पति दृष्टि के बिना शनि लग्न में' },
        deduction: 5, isVeto: false, source: 'Prasna Marga Ch.9',
      });
    }
  }

  // ── Vishti (Bhadra) karana ──
  // Karana 7 = Vishti/Bhadra (repeats every 7 in the 60-karana cycle)
  if (snap.karanaNumber === 7) {
    base -= 3;
    defects.push({
      id: 'vishti_karana',
      label: { en: 'Vishti (Bhadra) karana active', hi: 'विष्टि (भद्रा) करण सक्रिय' },
      deduction: 3, isVeto: false, source: 'Kalaprakashika',
    });
  }

  // ── Vyatipata (17) or Vaidhriti (27) yoga ──
  if (snap.yogaNumber === 17 || snap.yogaNumber === 27) {
    base -= 3;
    defects.push({
      id: 'inauspicious_yoga',
      label: { en: 'Vyatipata/Vaidhriti yoga active', hi: 'व्यतिपात/वैधृति योग सक्रिय' },
      deduction: 3, isVeto: false, source: 'Kalaprakashika',
    });
  }

  // ── Badhakesh in lagna or aspecting lagna ──
  // getBadhakeshPlanet requires SIGN_LORDS as parameter (no circular dependency)
  const badhakPlanet = getBadhakeshPlanet(snap.lagnaSign, SIGN_LORDS);
  const badhakInLagnaOrAspecting = snap.planets.some(
    p => p.id === badhakPlanet && (p.house === 1 || planetAspectsHouse(p.id, p.house, 1))
  );
  if (badhakInLagnaOrAspecting) {
    base -= 3;
    defects.push({
      id: 'badhakesh_lagna',
      label: { en: 'Badhakesh (obstruction lord) influences ascendant', hi: 'बाधकेश लग्न को प्रभावित करता है' },
      deduction: 3, isVeto: false, source: 'Practitioner tradition',
    });
  }

  // ── Mars in 8th ──
  if (snap.planets.some(p => p.id === 2 && p.house === 8)) {
    base -= 2;
    defects.push({
      id: 'mars_in_8th',
      label: { en: 'Mars in 8th house', hi: 'मंगल अष्टम भाव में' },
      deduction: 2, isVeto: false, source: 'General classical',
    });
  }

  return { defectScore: Math.max(0, base), isVetoed: false };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDignityScore(planetId: number, sign: number): number {
  if (isExalted(planetId, sign)) return 10;
  const mt = MOOLATRIKONA[planetId];
  if (mt && mt.sign === sign) return 9;
  if (isOwnSign(planetId, sign)) return 8;
  // Friend/neutral/enemy requires full friendship table  –  approximate:
  // For the lagna lord, own/exalted/moolatrikona are the key differentiators.
  if (isDebilitated(planetId, sign)) return 0;
  return 4; // Neutral fallback  –  conservative middle ground
}

function isWaxingMoon(tithiNumber: number): boolean {
  // Tithis 1-15 = Shukla Paksha (waxing)
  return tithiNumber >= 1 && tithiNumber <= 15;
}

function getPakshaScore(tithiNumber: number): number {
  if (tithiNumber >= 2 && tithiNumber <= 10) return 5;   // Shukla Dwitiya-Dashami
  if (tithiNumber >= 11 && tithiNumber <= 15) return 4;  // Shukla Ekadashi-Purnima
  if (tithiNumber >= 16 && tithiNumber <= 20) return 3;  // Krishna Pratipada-Panchami
  if (tithiNumber >= 21 && tithiNumber <= 25) return 1;  // Krishna Shashthi-Dashami
  return 0; // Krishna Ekadashi-Amavasya or Shukla Pratipada
}

/**
 * Full Vedic aspects including Mars (4,8), Jupiter (5,9), Saturn (3,10) special aspects.
 *
 * CRITICAL: Jupiter's 5th and 9th aspects are essential for birth-election scoring  – 
 * a simplified 7th-only check would miss Jupiter aspecting lagna from houses 5 and 9.
 *
 * @param planetId - 0=Sun..8=Ketu
 * @param planetHouse - house the planet occupies (1-12)
 * @param targetHouse - house being aspected (1-12)
 */
function planetAspectsHouse(planetId: number, planetHouse: number, targetHouse: number): boolean {
  // Offset = number of houses from planet to target, counting forward (1-12)
  const offset = ((targetHouse - planetHouse + 12) % 12) || 12;
  if (offset === 7) return true; // All planets aspect the 7th house from themselves
  if (planetId === 2 && (offset === 4 || offset === 8)) return true; // Mars special aspects
  if (planetId === 4 && (offset === 5 || offset === 9)) return true; // Jupiter special aspects
  if (planetId === 6 && (offset === 3 || offset === 10)) return true; // Saturn special aspects
  return false;
}

function isKaalSarpa(rahuLong: number, ketuLong: number, others: Array<{ longitude: number }>): boolean {
  // Check if all planets are on one side of the Rahu-Ketu axis
  const allOnOneSide = others.every(p => isLongitudeBetween(p.longitude, rahuLong, ketuLong))
    || others.every(p => isLongitudeBetween(p.longitude, ketuLong, rahuLong));
  return allOnOneSide;
}

function isLongitudeBetween(deg: number, start: number, end: number): boolean {
  // Handles wrap-around at 0/360 degrees
  if (start < end) return deg >= start && deg <= end;
  return deg >= start || deg <= end;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function getGrade(score: number): SlotGrade {
  if (score >= 75) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 45) return 'fair';
  if (score >= 30) return 'marginal';
  return 'poor';
}

function buildVetoedSlot(snap: ChartSnapshot, defects: ChartDefect[], vetoReason: LocaleText): ScoredBirthSlot {
  return {
    date: '', time: '', endTime: '',
    score: 0,
    grade: 'vetoed',
    pillarBreakdown: { lagna: 0, moon: 0, distribution: 0, dasha: 0, defects: 0 },
    strengths: [],
    defects,
    dashaInfo: { lord: '', lordId: 0, totalYears: 0, remainingYears: 0, score: 0 },
    lagnaSign: snap.lagnaSign,
    lagnaSignName: RASHIS[snap.lagnaSign - 1]?.name ?? { en: '?', hi: '?' },
    lagnaLordId: snap.lagnaLordId,
    moonSign: snap.moonSign,
    moonNakshatra: snap.moonNakshatraId,
    moonNakshatraName: NAKSHATRAS[snap.moonNakshatraId - 1]?.name ?? { en: '?', hi: '?' },
    yogas: [],
    panchang: {
      tithi: { en: '', hi: '' },
      nakshatra: { en: '', hi: '' },
      yoga: { en: '', hi: '' },
      karana: { en: '', hi: '' },
    },
    isVetoed: true,
    vetoReason,
  };
}
