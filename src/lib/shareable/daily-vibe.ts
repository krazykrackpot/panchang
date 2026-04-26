/**
 * Daily Vibe Generation Engine
 *
 * Deterministic mapping of PanchangData → shareable "energy weather" data.
 * No AI/LLM — vibe titles come from a fixed lookup of nakshatra nature +
 * yoga quality + transit patterns.
 */

import type { PanchangData, LocaleText } from '@/types/panchang';
import { getNakshatraActivity } from '@/lib/constants/nakshatra-activities';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DailyVibeData {
  date: string;                        // "26 April 2026"
  vibeTitle: { en: string; hi: string };
  keyTransit: string;                  // "Moon in Rohini (Exalted)"
  secondaryInfluence: string;          // "Rahu Aspect Active"
  bestFor: string[];                   // ["First dates", "Brainstorming"]
  avoid: string[];                     // ["Signing contracts"]
  energyScore: number;                 // 0-100
  moonSign: string;                    // "Rohini"
  dominantEnergy: string;              // "Creative" / "Disciplined" / etc.
}

// ---------------------------------------------------------------------------
// Vibe title definitions (~20 combos)
// ---------------------------------------------------------------------------

interface VibeTitle {
  en: string;
  hi: string;
  energy: string;
}

const VIBE_TITLES = {
  creativeAbundance: { en: 'Creative Abundance', hi: 'सृजनात्मक समृद्धि', energy: 'Creative' },
  creativeChaos:     { en: 'Creative Chaos', hi: 'सृजनात्मक उथल-पुथल', energy: 'Intense' },
  deepFocus:         { en: 'Deep Focus', hi: 'गहन एकाग्रता', energy: 'Disciplined' },
  goldenWindow:      { en: 'Golden Window', hi: 'सुनहरा अवसर', energy: 'Auspicious' },
  navigateCarefully: { en: 'Navigate Carefully', hi: 'सावधानी से चलें', energy: 'Cautious' },
  wisdomRising:      { en: 'Wisdom Rising', hi: 'ज्ञान का उदय', energy: 'Expansive' },
  heartCentered:     { en: 'Heart-Centered', hi: 'हृदय-केन्द्रित', energy: 'Loving' },
  boldMomentum:      { en: 'Bold Momentum', hi: 'साहसिक गति', energy: 'Energetic' },
  deepReflection:    { en: 'Deep Reflection', hi: 'गहन चिन्तन', energy: 'Reflective' },
  steadyFlow:        { en: 'Steady Flow', hi: 'स्थिर प्रवाह', energy: 'Balanced' },
  mixedCurrents:     { en: 'Mixed Currents', hi: 'मिश्रित धाराएँ', energy: 'Variable' },
  spiritualPulse:    { en: 'Spiritual Pulse', hi: 'आध्यात्मिक स्पन्दन', energy: 'Spiritual' },
  electricShift:     { en: 'Electric Shift', hi: 'विद्युत परिवर्तन', energy: 'Transformative' },
  gentleGrace:       { en: 'Gentle Grace', hi: 'कोमल कृपा', energy: 'Graceful' },
  fieryDrive:        { en: 'Fiery Drive', hi: 'अग्नि प्रेरणा', energy: 'Fiery' },
  protectedPath:     { en: 'Protected Path', hi: 'सुरक्षित मार्ग', energy: 'Supportive' },
  powerSurge:        { en: 'Power Surge', hi: 'शक्ति लहर', energy: 'Powerful' },
  innerQuiet:        { en: 'Inner Quiet', hi: 'आन्तरिक शान्ति', energy: 'Calm' },
  radiantDay:        { en: 'Radiant Day', hi: 'प्रकाशमान दिवस', energy: 'Bright' },
  cautiousAdvance:   { en: 'Cautious Advance', hi: 'सतर्क प्रगति', energy: 'Measured' },
} as const;

// ---------------------------------------------------------------------------
// Nakshatra classification helpers
// ---------------------------------------------------------------------------

// Sharp/fierce nakshatras (Tikshna + Ugra)
const SHARP_NAKSHATRAS = new Set([6, 9, 18, 19]); // Ardra, Ashlesha, Jyeshtha, Moola

// Venus nakshatras (Bharani, Purva Phalguni, Purva Ashadha)
const VENUS_NAKSHATRAS = new Set([2, 11, 20]);

// Mars nakshatras (Mrigashira, Chitra, Dhanishta)
const MARS_NAKSHATRAS = new Set([5, 14, 23]);

// Gentle/soft nakshatras (Mridu)
const GENTLE_NAKSHATRAS = new Set([4, 5, 7, 13, 17, 22, 26, 27]); // Rohini, Mrigashira, Punarvasu, Hasta, Anuradha, Shravana, U.Bhadra, Revati

// Water signs: Cancer(4), Scorpio(8), Pisces(12)
const WATER_SIGNS = new Set([4, 8, 12]);

// Saturn weekday: Saturday = 6
const SATURN_DAY = 6;
// Jupiter weekday: Thursday = 4
const JUPITER_DAY = 4;

// ---------------------------------------------------------------------------
// Tithi / Yoga / Karana quality helpers
// ---------------------------------------------------------------------------

// Auspicious tithis: 2 (Dwitiya), 3 (Tritiya), 5 (Panchami), 7 (Saptami),
// 10 (Dashami), 11 (Ekadashi), 13 (Trayodashi), Purnima(15)
const GOOD_TITHIS = new Set([2, 3, 5, 7, 10, 11, 13, 15]);

// Good karanas: Bava(1), Balava(2), Kaulava(3), Taitila(4), Garija(5), Vanija(6)
const GOOD_KARANAS = new Set([1, 2, 3, 4, 5, 6]);

// Moon exaltation: Rashi 2 (Taurus), specifically Rohini(4) / early Mrigashira(5)
function isMoonExalted(moonSign?: { rashi: number; nakshatra: number }): boolean {
  if (!moonSign) return false;
  return moonSign.rashi === 2; // Moon in Taurus = exalted
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateDailyVibe(panchang: PanchangData, locale: string): DailyVibeData {
  // 1. Determine vibe title by priority rules
  const vibe = resolveVibeTitle(panchang);

  // 2. Build key transit string
  const moonNakName = panchang.nakshatra?.name?.en || 'Unknown';
  const moonExalted = isMoonExalted(panchang.moonSign);
  const keyTransit = moonExalted
    ? `Moon in ${moonNakName} (Exalted)`
    : `Moon in ${moonNakName}`;

  // 3. Build secondary influence
  const secondaryInfluence = resolveSecondaryInfluence(panchang);

  // 4. Best For / Avoid from nakshatra activities
  const activity = getNakshatraActivity(panchang.nakshatra?.id ?? 1);
  const bestFor = activity
    ? activity.goodFor.map((g) => (locale === 'hi' ? g.hi : g.en))
    : ['General activities'];
  const avoid = buildAvoidList(panchang, activity, locale);

  // 5. Compute energy score (0-100)
  const energyScore = computeEnergyScore(panchang);

  // 6. Format date
  const date = formatVibeDate(panchang.date, locale);

  return {
    date,
    vibeTitle: { en: vibe.en, hi: vibe.hi },
    keyTransit,
    secondaryInfluence,
    bestFor,
    avoid,
    energyScore: Math.max(0, Math.min(100, energyScore)),
    moonSign: moonNakName,
    dominantEnergy: vibe.energy,
  };
}

// ---------------------------------------------------------------------------
// Vibe title resolution (priority cascade)
// ---------------------------------------------------------------------------

function resolveVibeTitle(p: PanchangData): VibeTitle {
  const nId = p.nakshatra?.id ?? 0;
  const yogaGood = p.yoga?.nature === 'auspicious';
  const yogaBad = p.yoga?.nature === 'inauspicious';
  const moonExalted = isMoonExalted(p.moonSign);
  const moonRashi = p.moonSign?.rashi ?? 0;
  const varaDay = p.vara?.day ?? 0;
  const hasSarvarthaSiddhi = p.sarvarthaSiddhi === true;
  const hasAmritKalam = !!p.amritKalam;
  const hasVarjyam = !!p.varjyam;
  const hasRahuKaal = !!p.rahuKaal;
  const hasAmritSiddhi = p.amritSiddhiYoga === true;

  // Priority 1: Multiple auspicious signals → "Golden Window"
  if ((hasSarvarthaSiddhi || hasAmritSiddhi) && yogaGood) {
    return VIBE_TITLES.goldenWindow;
  }

  // Priority 2: Moon exalted + good yoga → "Creative Abundance"
  if (moonExalted && yogaGood) {
    return VIBE_TITLES.creativeAbundance;
  }

  // Priority 3: Sharp nakshatra + inauspicious yoga → "Creative Chaos"
  if (SHARP_NAKSHATRAS.has(nId) && yogaBad) {
    return VIBE_TITLES.creativeChaos;
  }

  // Priority 4: Saturn day + saturn-like energy → "Deep Focus"
  if (varaDay === SATURN_DAY) {
    return VIBE_TITLES.deepFocus;
  }

  // Priority 5: Varjyam active + inauspicious → "Navigate Carefully"
  if (hasVarjyam && yogaBad) {
    return VIBE_TITLES.navigateCarefully;
  }

  // Priority 6: Jupiter day + benefic yoga → "Wisdom Rising"
  if (varaDay === JUPITER_DAY && yogaGood) {
    return VIBE_TITLES.wisdomRising;
  }

  // Priority 7: Venus nakshatras → "Heart-Centered"
  if (VENUS_NAKSHATRAS.has(nId)) {
    return VIBE_TITLES.heartCentered;
  }

  // Priority 8: Mars nakshatras → "Bold Momentum"
  if (MARS_NAKSHATRAS.has(nId)) {
    return VIBE_TITLES.boldMomentum;
  }

  // Priority 9: Moon in water sign + gentle nakshatra → "Deep Reflection"
  if (WATER_SIGNS.has(moonRashi) && GENTLE_NAKSHATRAS.has(nId)) {
    return VIBE_TITLES.deepReflection;
  }

  // Priority 10: Moon in water sign (any nakshatra) → "Inner Quiet"
  if (WATER_SIGNS.has(moonRashi)) {
    return VIBE_TITLES.innerQuiet;
  }

  // Priority 11: Sarvartha Siddhi alone → "Radiant Day"
  if (hasSarvarthaSiddhi) {
    return VIBE_TITLES.radiantDay;
  }

  // Priority 12: Amrit Kalam active → "Protected Path"
  if (hasAmritKalam && !hasVarjyam) {
    return VIBE_TITLES.protectedPath;
  }

  // Priority 13: Sharp nakshatra but good yoga → "Electric Shift"
  if (SHARP_NAKSHATRAS.has(nId) && yogaGood) {
    return VIBE_TITLES.electricShift;
  }

  // Priority 14: Good yoga overall → "Steady Flow"
  if (yogaGood) {
    return VIBE_TITLES.steadyFlow;
  }

  // Priority 15: Gentle nakshatra → "Gentle Grace"
  if (GENTLE_NAKSHATRAS.has(nId)) {
    return VIBE_TITLES.gentleGrace;
  }

  // Priority 16: Cautious day (varjyam present or rahu kaal heavy)
  if (hasVarjyam && hasRahuKaal) {
    return VIBE_TITLES.cautiousAdvance;
  }

  // Fallback
  return VIBE_TITLES.mixedCurrents;
}

// ---------------------------------------------------------------------------
// Secondary influence
// ---------------------------------------------------------------------------

function resolveSecondaryInfluence(p: PanchangData): string {
  // Check for notable conditions in priority
  if (p.dagdhaTithi) return 'Dagdha Tithi Active';
  if (p.gandaMoola?.active) return 'Ganda Moola Active';
  if (p.panchaka?.active) return 'Panchaka Active';
  if (p.amritSiddhiYoga) return 'Amrit Siddhi Yoga';
  if (p.sarvarthaSiddhi) return 'Sarvartha Siddhi Yoga';
  if (p.raviYoga) return 'Ravi Yoga Active';

  // Fallback to yoga meaning
  const yogaMeaning = p.yoga?.meaning?.en;
  if (yogaMeaning) return `${p.yoga?.name?.en ?? 'Yoga'} — ${yogaMeaning}`;

  return 'Panchang Elements Balanced';
}

// ---------------------------------------------------------------------------
// Build avoid list
// ---------------------------------------------------------------------------

function buildAvoidList(
  p: PanchangData,
  activity: ReturnType<typeof getNakshatraActivity>,
  locale: string
): string[] {
  const items: string[] = [];

  // Nakshatra-specific avoids
  if (activity) {
    for (const a of activity.avoidFor) {
      items.push(locale === 'hi' ? a.hi : a.en);
    }
  }

  // Add inauspicious-period warnings
  if (p.varjyam) {
    items.push(locale === 'hi' ? 'वर्ज्यम् काल में कार्य' : 'Activities during Varjyam');
  }
  if (p.dagdhaTithi) {
    items.push(locale === 'hi' ? 'शुभ कार्य (दग्ध तिथि)' : 'Auspicious events (Dagdha Tithi)');
  }

  // If no avoids at all, provide a generic one
  if (items.length === 0) {
    items.push(locale === 'hi' ? 'कोई विशेष परहेज नहीं' : 'No specific cautions');
  }

  return items.slice(0, 4); // max 4 items for card space
}

// ---------------------------------------------------------------------------
// Energy score (0-100)
// ---------------------------------------------------------------------------

function computeEnergyScore(p: PanchangData): number {
  let score = 50; // baseline

  // Tithi quality: +15 for auspicious
  if (GOOD_TITHIS.has(p.tithi?.number ?? 0)) score += 15;

  // Nakshatra quality: +20 for gentle/auspicious nature
  if (GENTLE_NAKSHATRAS.has(p.nakshatra?.id ?? 0)) score += 20;

  // Yoga quality: +15 for auspicious, -10 for inauspicious
  if (p.yoga?.nature === 'auspicious') score += 15;
  else if (p.yoga?.nature === 'inauspicious') score -= 10;

  // Karana quality: +10 for good karana
  if (GOOD_KARANAS.has(p.karana?.number ?? 0)) score += 10;

  // Sarvartha Siddhi: +20
  if (p.sarvarthaSiddhi) score += 20;

  // Amrit Siddhi Yoga: +15
  if (p.amritSiddhiYoga) score += 15;

  // Amrit Kalam present: +10
  if (p.amritKalam) score += 10;

  // Rahu Kaal penalty: -10
  if (p.rahuKaal) score -= 10;

  // Varjyam penalty: -10
  if (p.varjyam) score -= 10;

  // Dagdha tithi penalty: -10
  if (p.dagdhaTithi) score -= 10;

  // Panchaka penalty: -5
  if (p.panchaka?.active) score -= 5;

  return score;
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
];

function formatVibeDate(dateStr: string, locale: string): string {
  // dateStr is "YYYY-MM-DD"
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = locale === 'hi' ? MONTHS_HI : MONTHS_EN;
  return `${d} ${months[m - 1]} ${y}`;
}
