/**
 * Daily Energy Score Engine
 *
 * Computes a 0–100 energy score from a PanchangData object using a
 * weighted formula across five panchang elements:
 *
 *   score = moonPhase(40%) + nakshatraQuality(30%) + yogaQuality(15%)
 *           + karanaQuality(10%) + vara(5%)
 *
 * The scoring uses Vedic tradition's classification of natures
 * (Kshipra, Sthira, Ugra, Mrdu, Mishra) and the classical list of
 * auspicious / inauspicious yogas and karanas.
 */

import type { PanchangData } from '@/types/panchang';
import { getNakshatraActivity } from '@/lib/constants/nakshatra-activities';

export interface DailyEnergy {
  score: number;           // 0–100 (clamped integer)
  label: string;           // "High" | "Moderate" | "Low"
  dominantFactor: string;  // name of the element contributing most to the score
  bestFor: string[];       // Top 3 activities
  avoid: string[];         // Top 2 things to avoid
}

// ─────────────────────────────────────────────
// Component scores
// ─────────────────────────────────────────────

/**
 * Moon phase score (0–100), weighted 40% of total.
 *
 * Shukla Paksha (waxing): Pratipada=40 → Purnima=100, linear.
 * Krishna Paksha (waning): Pratipada=90 → Amavasya (tithi 15)=20, linear.
 *
 * tithiNumber is 1–15 for both pakshas.
 */
function moonPhaseScore(tithiNumber: number, paksha: 'shukla' | 'krishna'): number {
  const n = Math.max(1, Math.min(15, tithiNumber));
  if (paksha === 'shukla') {
    // 40 at Pratipada (n=1), 100 at Purnima (n=15) — linear interpolation
    return 40 + ((n - 1) / 14) * 60;
  } else {
    // 90 at Krishna Pratipada (n=1), 20 at Amavasya (n=15) — linear descent
    return 90 - ((n - 1) / 14) * 70;
  }
}

// Nakshatra nature classification → base score (0–100)
// Drawn from classical Muhurta nature groupings.
// nakshatraId: 1=Ashwini … 27=Revati
const NAKSHATRA_SCORE: Record<number, number> = {
  // Kshipra / Swift (Laghu) — high energy: Ashwini(1), Pushya(8), Hasta(13)
  1: 85,   // Ashwini  — Kshipra/Swift, healing momentum
  8: 82,   // Pushya   — Laghu/Swift, most auspicious
  13: 80,  // Hasta    — Laghu/Swift, skilled execution

  // Chara / Movable — high-ish energy: Punarvasu(7), Swati(15), Shravana(22), Dhanishtha(23), Shatabhisha(24)
  7: 80,   // Punarvasu  — Chara, restoration
  15: 78,  // Swati      — Chara, independent movement
  22: 78,  // Shravana   — Chara, receptive learning
  23: 75,  // Dhanishtha — Chara, wealth-building
  24: 72,  // Shatabhisha — Chara, healing

  // Mrdu / Soft-Tender — high energy: Mrigashira(5), Chitra(14), Anuradha(17), Revati(27)
  5: 82,   // Mrigashira — Mrdu, gentle search
  14: 80,  // Chitra     — Mrdu, creative brilliance
  17: 80,  // Anuradha   — Mrdu, devotion and loyalty
  27: 78,  // Revati     — Mrdu, compassionate completion

  // Sthira / Fixed — moderate energy: Rohini(4), Uttara Phalguni(12), Uttara Ashadha(21), Uttara Bhadrapada(26)
  4: 65,   // Rohini            — Sthira, fertile stability
  12: 62,  // Uttara Phalguni   — Sthira, lasting commitment
  21: 63,  // Uttara Ashadha    — Sthira, final victory
  26: 60,  // Uttara Bhadrapada — Sthira, deep wisdom

  // Mishra / Mixed — moderate: Krittika(3), Vishakha(16)
  3: 60,   // Krittika — Sharp-Soft mix, purifying fire
  16: 58,  // Vishakha — Sharp-Soft mix, purposeful striving

  // Ugra / Tikshna (Sharp, Fierce) — lower energy for general use
  2: 40,   // Bharani         — Ugra, transformation/consequence
  6: 35,   // Ardra           — Tikshna, stormy disruption
  9: 32,   // Ashlesha        — Tikshna, serpentine caution
  10: 38,  // Magha           — Ugra, ancestral authority
  11: 40,  // Purva Phalguni  — Ugra, intense pleasure
  18: 35,  // Jyeshtha        — Tikshna, protective edge
  19: 30,  // Mula            — Tikshna, radical root
  20: 42,  // Purva Ashadha   — Ugra, purifying momentum
  25: 38,  // Purva Bhadrapada — Ugra, fierce transformation
};

function nakshatraScore(nakshatraId: number): number {
  return NAKSHATRA_SCORE[nakshatraId] ?? 55; // fallback: neutral
}

// Yoga quality score (0–100)
// Auspicious = 80+, Neutral = 50, Inauspicious = 20–35
// yogaNumber: 1=Vishkambha … 27=Vaidhriti
const YOGA_SCORE: Record<number, number> = {
  1: 20,  // Vishkambha — inauspicious, obstacle
  2: 85,  // Priti — auspicious, love
  3: 85,  // Ayushman — auspicious, long life
  4: 88,  // Saubhagya — auspicious, fortune
  5: 82,  // Shobhana — auspicious, splendor
  6: 25,  // Atiganda — inauspicious, great danger
  7: 83,  // Sukarma — auspicious, good deeds
  8: 82,  // Dhriti — auspicious, firmness
  9: 30,  // Shula — inauspicious, pain
  10: 28, // Ganda — inauspicious, danger
  11: 85, // Vriddhi — auspicious, growth
  12: 85, // Dhruva — auspicious, constant
  13: 22, // Vyaghata — inauspicious, calamity
  14: 83, // Harshana — auspicious, joy
  15: 28, // Vajra — inauspicious, thunderbolt
  16: 92, // Siddhi — auspicious, accomplishment
  17: 20, // Vyatipata — inauspicious, misfortune
  18: 80, // Variyan — auspicious, excellent
  19: 25, // Parigha — inauspicious, obstruction
  20: 87, // Shiva — auspicious, auspicious
  21: 90, // Siddha — auspicious, accomplished
  22: 83, // Sadhya — auspicious, achievable
  23: 85, // Shubha — auspicious, auspicious
  24: 85, // Shukla — auspicious, bright
  25: 85, // Brahma — auspicious, divine
  26: 87, // Indra — auspicious, powerful
  27: 18, // Vaidhriti — inauspicious, inauspicious
};

function yogaScore(yogaNumber: number): number {
  return YOGA_SCORE[yogaNumber] ?? 50;
}

// Karana quality score (0–100)
// Movable karanas: 50–70; Sthira karanas: 25–35
// karanaNumber: 1–11 (matches KARANAS constant)
// Type: 1–7 = chara (movable), 8–10 = sthira (fixed), 11 = special
const KARANA_SCORE: Record<number, number> = {
  1: 65,  // Bava     — chara, good for most activities
  2: 62,  // Balava   — chara, supportive
  3: 60,  // Kaulava  — chara, family focus
  4: 58,  // Taitila  — chara, practical
  5: 60,  // Garaja   — chara, movement and commerce
  6: 70,  // Vanija   — chara, merchant energy (best movable)
  7: 20,  // Vishti   — chara, inauspicious (Bhadra)
  8: 25,  // Shakuni  — sthira, fixed cunning
  9: 30,  // Chatushpada — sthira, earthy/mixed
  10: 28, // Naga     — sthira, serpentine depth
  11: 55, // Kimstughna — special, transitional
};

function karanaScore(karanaNumber: number): number {
  return KARANA_SCORE[karanaNumber] ?? 50;
}

// Vara (weekday) score (0–100)
// vara.day in PanchangData: 0=Sunday, 1=Monday, ..., 6=Saturday
// Matches JS/JD convention: Math.floor(jd + 1.5) % 7 → 0=Sunday
const VARA_SCORE: Record<number, number> = {
  0: 50, // Sunday    — Solar, neutral to positive
  1: 65, // Monday    — Lunar, slight boost (emotional/creative)
  2: 35, // Tuesday   — Martial, slight penalty
  3: 65, // Wednesday — Mercurial, slight boost
  4: 50, // Thursday  — Jovial, neutral (wisdom days are calm)
  5: 68, // Friday    — Venusian, boost (beauty/pleasure)
  6: 30, // Saturday  — Saturnine, slight penalty
};

function varaScore(dayOfWeek: number): number {
  return VARA_SCORE[dayOfWeek] ?? 50;
}

// ─────────────────────────────────────────────
// Activity recommendations by component quality
// ─────────────────────────────────────────────

function moonPhaseBestFor(tithiNumber: number, paksha: 'shukla' | 'krishna'): string[] {
  if (paksha === 'shukla') {
    if (tithiNumber <= 5) return ['New initiatives', 'Planting seeds of intention', 'Light activity'];
    if (tithiNumber <= 10) return ['Building projects', 'Exercise', 'Social connections'];
    if (tithiNumber === 11) return ['Fasting', 'Meditation', 'Spiritual study'];
    if (tithiNumber === 15) return ['Celebration', 'Community', 'Acts of generosity'];
    return ['Completing tasks', 'Ceremonies', 'Creative work'];
  } else {
    if (tithiNumber <= 5) return ['Review and refinement', 'Completing started projects', 'Rest'];
    if (tithiNumber <= 10) return ['Releasing what no longer serves', 'Charity', 'Study'];
    if (tithiNumber === 11) return ['Full fasting', 'Deep meditation', 'Scripture reading'];
    if (tithiNumber === 15) return ['Ancestor offerings', 'Introspection', 'New Moon setting of intentions'];
    return ['Closure activities', 'Spiritual practice', 'Ancestral work'];
  }
}

function moonPhaseAvoid(tithiNumber: number, paksha: 'shukla' | 'krishna'): string[] {
  if (paksha === 'shukla' && tithiNumber <= 3) return ['Major surgery', 'Overly ambitious launches'];
  if (paksha === 'shukla' && tithiNumber >= 13) return ['Starting long-term plans', 'Beginning new commitments'];
  if (paksha === 'krishna' && tithiNumber >= 13) return ['Auspicious ceremonies', 'New ventures'];
  return ['Pushing through exhaustion', 'Ignoring rest signals'];
}

function nakshatraBestFor(id: number): string[] {
  const score = nakshatraScore(id);
  if (score >= 80) return ['Starting ventures', 'Travel', 'Health activities'];
  if (score >= 65) return ['Sustained work', 'Commitments', 'Creative projects'];
  if (score >= 50) return ['Mixed activities', 'Commerce', 'Routine tasks'];
  return ['Purification', 'Intense inner work', 'Addressing difficult matters'];
}

function yogaBestFor(number: number): string[] {
  const score = yogaScore(number);
  if (score >= 85) return ['All auspicious activities', 'Ceremonies', 'Major decisions'];
  if (score >= 60) return ['Professional work', 'Learning', 'Moderate ventures'];
  return ['Internal work', 'Completing existing tasks', 'Spiritual practice'];
}

function yogaAvoid(number: number): string[] {
  const score = yogaScore(number);
  if (score < 35) return ['New ventures', 'Travel', 'Auspicious ceremonies'];
  if (score < 60) return ['Major launches', 'Important decisions'];
  return [];
}

// ─────────────────────────────────────────────
// Main function
// ─────────────────────────────────────────────

/**
 * Compute a daily energy score and recommendations from a PanchangData object.
 *
 * Scoring weights:
 *   moonPhase    40%
 *   nakshatra    30%
 *   yoga         15%
 *   karana       10%
 *   vara          5%
 */
export function computeDailyEnergy(panchang: PanchangData): DailyEnergy {
  const { tithi, nakshatra, yoga, karana, vara } = panchang;

  // Determine paksha from tithi.paksha
  const paksha: 'shukla' | 'krishna' = tithi.paksha;

  // Component raw scores (each 0–100)
  const moonRaw     = moonPhaseScore(tithi.number, paksha);
  const nakRaw      = nakshatraScore(nakshatra.id);
  const yogaRaw     = yogaScore(yoga.number);
  const karanaRaw   = karanaScore(karana.number);
  const varaRaw     = varaScore(vara.day);

  // Weighted sum
  const weighted = Math.round(
    moonRaw   * 0.40 +
    nakRaw    * 0.30 +
    yogaRaw   * 0.15 +
    karanaRaw * 0.10 +
    varaRaw   * 0.05,
  );

  // Auspicious/inauspicious modifiers (additive, post-weighting)
  // Fields may be undefined (e.g., in test fixtures) — treat as 0
  let modifier = 0;
  if (panchang.sarvarthaSiddhi) modifier += 8;
  if (panchang.amritSiddhiYoga) modifier += 6;
  if (panchang.amritKalam)      modifier += 4;
  if (panchang.varjyam)         modifier -= 6;
  if (panchang.dagdhaTithi)     modifier -= 8;
  if (panchang.panchaka?.active) modifier -= 4;
  if (panchang.gandaMoola?.active) modifier -= 3;

  // Clamp to 0–100
  const clamped = Math.max(0, Math.min(100, weighted + modifier));

  // Label
  const label = clamped >= 80 ? 'High' : clamped >= 50 ? 'Moderate' : 'Low';

  // Dominant factor — component with highest weighted contribution
  const components = [
    { name: 'Moon Phase',  weighted: moonRaw   * 0.40 },
    { name: 'Nakshatra',   weighted: nakRaw    * 0.30 },
    { name: yoga.name.en ?? 'Yoga', weighted: yogaRaw   * 0.15 },
    { name: 'Karana',      weighted: karanaRaw * 0.10 },
    { name: vara.name.en ?? 'Weekday', weighted: varaRaw   * 0.05 },
  ];
  const dominant = components.reduce((a, b) => (a.weighted >= b.weighted ? a : b));

  // Best-for: BPHS classical nakshatra activities (specific and authoritative)
  const activity = getNakshatraActivity(nakshatra.id);
  let bestFor: string[];
  if (activity && activity.goodFor.length > 0) {
    bestFor = activity.goodFor.slice(0, 3).map(g => g.en);
  } else {
    // Fallback to moon-phase recommendations when nakshatra data unavailable
    bestFor = moonPhaseBestFor(tithi.number, paksha).slice(0, 3);
  }

  // Avoid: nakshatra-specific classical avoids + inauspicious period warnings
  const avoidItems: string[] = [];
  if (activity) {
    for (const a of activity.avoidFor) {
      avoidItems.push(a.en);
    }
  }
  if (panchang.varjyam) avoidItems.push('Activities during Varjyam');
  if (panchang.dagdhaTithi) avoidItems.push('Auspicious events (Dagdha Tithi)');
  // Fallback if no avoids at all
  if (avoidItems.length === 0) {
    const moonAv = moonPhaseAvoid(tithi.number, paksha);
    avoidItems.push(...moonAv);
  }

  return {
    score: clamped,
    label,
    dominantFactor: dominant.name,
    bestFor,
    avoid: avoidItems.slice(0, 3),
  };
}

/**
 * Convenience: compute energy from individual component numbers.
 * Useful in contexts where a full PanchangData is not available.
 */
export function computeEnergyFromComponents(params: {
  tithiNumber: number;
  paksha: 'shukla' | 'krishna';
  nakshatraId: number;
  yogaNumber: number;
  karanaNumber: number;
  dayOfWeek: number; // 0=Sunday ... 6=Saturday
}): number {
  const moonRaw   = moonPhaseScore(params.tithiNumber, params.paksha);
  const nakRaw    = nakshatraScore(params.nakshatraId);
  const yogaRaw   = yogaScore(params.yogaNumber);
  const karanaRaw = karanaScore(params.karanaNumber);
  const varaRaw   = varaScore(params.dayOfWeek);

  const score = Math.round(
    moonRaw   * 0.40 +
    nakRaw    * 0.30 +
    yogaRaw   * 0.15 +
    karanaRaw * 0.10 +
    varaRaw   * 0.05,
  );
  return Math.max(0, Math.min(100, score));
}
