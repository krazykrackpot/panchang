/**
 * Astrological Journal — Pattern Analysis Engine
 *
 * Takes an array of JournalEntry and computes mood/energy correlations
 * with planetary conditions (moon sign, nakshatra, weekday, tithi type,
 * dasha, yoga, sade sati).
 *
 * Thresholds:
 *   - 15 total entries minimum for any patterns
 *   - 3 entries per group minimum
 *   - "strong": >= 10 samples AND |delta| >= 0.5
 *   - "moderate": >= 5 samples AND |delta| >= 0.3
 *   - "emerging": >= 3 samples (below strong/moderate)
 */

import type { JournalEntry } from '@/types/journal';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { tl } from '@/lib/utils/trilingual';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface JournalPattern {
  type: 'moon_sign' | 'nakshatra' | 'weekday' | 'tithi_type' | 'dasha' | 'yoga' | 'sade_sati';
  label: { en: string; hi: string };
  description: { en: string; hi: string };
  /** Average mood when this condition is active */
  avgMood: number;
  /** Average energy when this condition is active */
  avgEnergy: number;
  /** Number of entries matching this condition */
  sampleSize: number;
  /** Deviation from overall average (positive = better, negative = worse) */
  moodDelta: number;
  energyDelta: number;
  /** Statistical strength */
  strength: 'strong' | 'moderate' | 'emerging';
  /** Sentiment classification */
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface JournalInsights {
  patterns: JournalPattern[];
  totalEntries: number;
  overallAvgMood: number;
  overallAvgEnergy: number;
  bestConditions: JournalPattern[];
  worstConditions: JournalPattern[];
  minEntriesForPatterns: number;
  hasEnoughData: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN_TOTAL_ENTRIES = 15;
const MIN_GROUP_SIZE = 3;

const WEEKDAY_LABELS: Array<{ en: string; hi: string }> = [
  { en: 'Sunday', hi: 'रविवार' },
  { en: 'Monday', hi: 'सोमवार' },
  { en: 'Tuesday', hi: 'मंगलवार' },
  { en: 'Wednesday', hi: 'बुधवार' },
  { en: 'Thursday', hi: 'गुरुवार' },
  { en: 'Friday', hi: 'शुक्रवार' },
  { en: 'Saturday', hi: 'शनिवार' },
];

// Weekday rulers for description text
const WEEKDAY_RULERS: Array<{ en: string; hi: string }> = [
  { en: 'Sun', hi: 'सूर्य' },
  { en: 'Moon', hi: 'चन्द्र' },
  { en: 'Mars', hi: 'मंगल' },
  { en: 'Mercury', hi: 'बुध' },
  { en: 'Jupiter', hi: 'बृहस्पति' },
  { en: 'Venus', hi: 'शुक्र' },
  { en: 'Saturn', hi: 'शनि' },
];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface GroupAccumulator {
  moodSum: number;
  moodCount: number;
  energySum: number;
  energyCount: number;
}

function newAccum(): GroupAccumulator {
  return { moodSum: 0, moodCount: 0, energySum: 0, energyCount: 0 };
}

function addEntry(acc: GroupAccumulator, entry: JournalEntry): void {
  if (entry.mood != null) {
    acc.moodSum += entry.mood;
    acc.moodCount += 1;
  }
  if (entry.energy != null) {
    acc.energySum += entry.energy;
    acc.energyCount += 1;
  }
}

function avgOrZero(sum: number, count: number): number {
  return count > 0 ? Math.round((sum / count) * 100) / 100 : 0;
}

function classifyStrength(sampleSize: number, absDelta: number): 'strong' | 'moderate' | 'emerging' {
  if (sampleSize >= 10 && absDelta >= 0.5) return 'strong';
  if (sampleSize >= 5 && absDelta >= 0.3) return 'moderate';
  return 'emerging';
}

function classifySentiment(moodDelta: number): 'positive' | 'negative' | 'neutral' {
  if (moodDelta > 0.2) return 'positive';
  if (moodDelta < -0.2) return 'negative';
  return 'neutral';
}

function buildPattern(
  type: JournalPattern['type'],
  label: { en: string; hi: string },
  description: { en: string; hi: string },
  acc: GroupAccumulator,
  overallMood: number,
  overallEnergy: number,
): JournalPattern | null {
  const sampleSize = Math.max(acc.moodCount, acc.energyCount);
  if (sampleSize < MIN_GROUP_SIZE) return null;

  const avgMood = avgOrZero(acc.moodSum, acc.moodCount);
  const avgEnergy = avgOrZero(acc.energySum, acc.energyCount);
  const moodDelta = Math.round((avgMood - overallMood) * 100) / 100;
  const energyDelta = Math.round((avgEnergy - overallEnergy) * 100) / 100;

  // Use the larger absolute delta for strength classification
  const absDelta = Math.max(Math.abs(moodDelta), Math.abs(energyDelta));

  return {
    type,
    label,
    description,
    avgMood,
    avgEnergy,
    sampleSize,
    moodDelta,
    energyDelta,
    strength: classifyStrength(sampleSize, absDelta),
    sentiment: classifySentiment(moodDelta),
  };
}

// ---------------------------------------------------------------------------
// Pattern detectors
// ---------------------------------------------------------------------------

function detectMoonSignPatterns(
  entries: JournalEntry[],
  overallMood: number,
  overallEnergy: number,
): JournalPattern[] {
  const groups = new Map<number, GroupAccumulator>();

  for (const e of entries) {
    const sign = e.moon_sign;
    if (sign == null || sign < 1 || sign > 12) continue;
    if (!groups.has(sign)) groups.set(sign, newAccum());
    addEntry(groups.get(sign)!, e);
  }

  const patterns: JournalPattern[] = [];
  for (const [signId, acc] of groups) {
    const rashi = RASHIS.find((r) => r.id === signId);
    const name = rashi ? { en: tl(rashi.name, 'en'), hi: tl(rashi.name, 'hi') } : { en: `Sign ${signId}`, hi: `राशि ${signId}` };

    const p = buildPattern(
      'moon_sign',
      { en: `Moon in ${name.en}`, hi: `चन्द्र ${name.hi} में` },
      {
        en: `Your mood when the Moon transits ${name.en}.`,
        hi: `जब चन्द्र ${name.hi} राशि में गोचर करता है तब आपका मनोदशा।`,
      },
      acc,
      overallMood,
      overallEnergy,
    );
    if (p) patterns.push(p);
  }

  return patterns;
}

function detectNakshatraPatterns(
  entries: JournalEntry[],
  overallMood: number,
  overallEnergy: number,
): JournalPattern[] {
  const groups = new Map<number, GroupAccumulator>();

  for (const e of entries) {
    const nak = e.nakshatra_number;
    if (nak == null || nak < 1 || nak > 27) continue;
    if (!groups.has(nak)) groups.set(nak, newAccum());
    addEntry(groups.get(nak)!, e);
  }

  const patterns: JournalPattern[] = [];
  for (const [nakId, acc] of groups) {
    const nakshatra = NAKSHATRAS.find((n) => n.id === nakId);
    const name = nakshatra
      ? { en: tl(nakshatra.name, 'en'), hi: tl(nakshatra.name, 'hi') }
      : { en: `Nakshatra ${nakId}`, hi: `नक्षत्र ${nakId}` };

    const p = buildPattern(
      'nakshatra',
      name,
      {
        en: `Your mood on ${name.en} nakshatra days.`,
        hi: `${name.hi} नक्षत्र के दिनों में आपका मनोदशा।`,
      },
      acc,
      overallMood,
      overallEnergy,
    );
    if (p) patterns.push(p);
  }

  return patterns;
}

function detectWeekdayPatterns(
  entries: JournalEntry[],
  overallMood: number,
  overallEnergy: number,
): JournalPattern[] {
  const groups = new Map<number, GroupAccumulator>();

  for (const e of entries) {
    const wd = e.weekday;
    if (wd == null || wd < 0 || wd > 6) continue;
    if (!groups.has(wd)) groups.set(wd, newAccum());
    addEntry(groups.get(wd)!, e);
  }

  const patterns: JournalPattern[] = [];
  for (const [wd, acc] of groups) {
    const dayLabel = WEEKDAY_LABELS[wd];
    const ruler = WEEKDAY_RULERS[wd];

    const p = buildPattern(
      'weekday',
      dayLabel,
      {
        en: `Your mood on ${dayLabel.en}s (${ruler.en}'s day).`,
        hi: `${dayLabel.hi} (${ruler.hi} का दिन) पर आपका मनोदशा।`,
      },
      acc,
      overallMood,
      overallEnergy,
    );
    if (p) patterns.push(p);
  }

  return patterns;
}

function detectTithiTypePatterns(
  entries: JournalEntry[],
  overallMood: number,
  overallEnergy: number,
): JournalPattern[] {
  // Groups: shukla paksha (1-15), krishna paksha (16-30),
  // plus specific: purnima (15), amavasya (30), ekadashi (11 or 26)
  const shukla = newAccum();
  const krishna = newAccum();
  const purnima = newAccum();
  const amavasya = newAccum();
  const ekadashi = newAccum();

  for (const e of entries) {
    const t = e.tithi_number;
    if (t == null) continue;

    if (t >= 1 && t <= 15) addEntry(shukla, e);
    if (t >= 16 && t <= 30) addEntry(krishna, e);
    if (t === 15) addEntry(purnima, e);
    if (t === 30) addEntry(amavasya, e);
    if (t === 11 || t === 26) addEntry(ekadashi, e);
  }

  const patterns: JournalPattern[] = [];

  const groups: Array<{
    key: string;
    label: { en: string; hi: string };
    desc: { en: string; hi: string };
    acc: GroupAccumulator;
  }> = [
    {
      key: 'shukla',
      label: { en: 'Shukla Paksha', hi: 'शुक्ल पक्ष' },
      desc: { en: 'Your mood during the waxing moon fortnight.', hi: 'शुक्ल पक्ष (बढ़ते चन्द्र) में आपका मनोदशा।' },
      acc: shukla,
    },
    {
      key: 'krishna',
      label: { en: 'Krishna Paksha', hi: 'कृष्ण पक्ष' },
      desc: { en: 'Your mood during the waning moon fortnight.', hi: 'कृष्ण पक्ष (घटते चन्द्र) में आपका मनोदशा।' },
      acc: krishna,
    },
    {
      key: 'purnima',
      label: { en: 'Purnima', hi: 'पूर्णिमा' },
      desc: { en: 'Your mood on Full Moon days.', hi: 'पूर्णिमा (पूर्ण चन्द्र) के दिन आपका मनोदशा।' },
      acc: purnima,
    },
    {
      key: 'amavasya',
      label: { en: 'Amavasya', hi: 'अमावस्या' },
      desc: { en: 'Your mood on New Moon days.', hi: 'अमावस्या (नवचन्द्र) के दिन आपका मनोदशा।' },
      acc: amavasya,
    },
    {
      key: 'ekadashi',
      label: { en: 'Ekadashi', hi: 'एकादशी' },
      desc: { en: 'Your mood on Ekadashi (11th tithi) days.', hi: 'एकादशी के दिन आपका मनोदशा।' },
      acc: ekadashi,
    },
  ];

  for (const g of groups) {
    const p = buildPattern('tithi_type', g.label, g.desc, g.acc, overallMood, overallEnergy);
    if (p) patterns.push(p);
  }

  return patterns;
}

function detectDashaPatterns(
  entries: JournalEntry[],
  overallMood: number,
  overallEnergy: number,
): JournalPattern[] {
  // Group by maha dasha planet
  const mahaGroups = new Map<string, GroupAccumulator>();
  // Group by maha-antar combination
  const comboGroups = new Map<string, { maha: string; antar: string; acc: GroupAccumulator }>();

  for (const e of entries) {
    const maha = e.maha_dasha;
    if (!maha) continue;

    if (!mahaGroups.has(maha)) mahaGroups.set(maha, newAccum());
    addEntry(mahaGroups.get(maha)!, e);

    const antar = e.antar_dasha;
    if (antar) {
      const key = `${maha}-${antar}`;
      if (!comboGroups.has(key)) comboGroups.set(key, { maha, antar, acc: newAccum() });
      addEntry(comboGroups.get(key)!.acc, e);
    }
  }

  const patterns: JournalPattern[] = [];

  for (const [planet, acc] of mahaGroups) {
    const p = buildPattern(
      'dasha',
      { en: `${planet} Mahadasha`, hi: `${planet} महादशा` },
      {
        en: `Your mood during ${planet} Mahadasha period.`,
        hi: `${planet} महादशा काल में आपका मनोदशा।`,
      },
      acc,
      overallMood,
      overallEnergy,
    );
    if (p) patterns.push(p);
  }

  for (const [, { maha, antar, acc }] of comboGroups) {
    const p = buildPattern(
      'dasha',
      { en: `${maha}-${antar} Dasha`, hi: `${maha}-${antar} दशा` },
      {
        en: `Your mood during ${maha} Mahadasha / ${antar} Antardasha.`,
        hi: `${maha} महादशा / ${antar} अन्तर्दशा में आपका मनोदशा।`,
      },
      acc,
      overallMood,
      overallEnergy,
    );
    if (p) patterns.push(p);
  }

  return patterns;
}

function detectYogaPatterns(
  entries: JournalEntry[],
  overallMood: number,
  overallEnergy: number,
): JournalPattern[] {
  const groups = new Map<number, GroupAccumulator>();

  for (const e of entries) {
    const y = e.yoga_number;
    if (y == null || y < 1 || y > 27) continue;
    if (!groups.has(y)) groups.set(y, newAccum());
    addEntry(groups.get(y)!, e);
  }

  const patterns: JournalPattern[] = [];
  for (const [yogaNum, acc] of groups) {
    const yoga = YOGAS.find((y) => y.number === yogaNum);
    const name = yoga
      ? { en: tl(yoga.name, 'en'), hi: tl(yoga.name, 'hi') }
      : { en: `Yoga ${yogaNum}`, hi: `योग ${yogaNum}` };

    const p = buildPattern(
      'yoga',
      { en: `${name.en} Yoga`, hi: `${name.hi} योग` },
      {
        en: `Your mood on ${name.en} Yoga days.`,
        hi: `${name.hi} योग के दिनों में आपका मनोदशा।`,
      },
      acc,
      overallMood,
      overallEnergy,
    );
    if (p) patterns.push(p);
  }

  return patterns;
}

function detectSadeSatiPatterns(
  entries: JournalEntry[],
  overallMood: number,
  overallEnergy: number,
): JournalPattern[] {
  const phaseGroups = new Map<string, GroupAccumulator>();
  const noSadeSati = newAccum();

  for (const e of entries) {
    const phase = e.sade_sati_phase;
    if (phase) {
      if (!phaseGroups.has(phase)) phaseGroups.set(phase, newAccum());
      addEntry(phaseGroups.get(phase)!, e);
    } else {
      addEntry(noSadeSati, e);
    }
  }

  const patterns: JournalPattern[] = [];

  // Overall Sade Sati vs not
  const allSadeSati = newAccum();
  for (const acc of phaseGroups.values()) {
    allSadeSati.moodSum += acc.moodSum;
    allSadeSati.moodCount += acc.moodCount;
    allSadeSati.energySum += acc.energySum;
    allSadeSati.energyCount += acc.energyCount;
  }

  const pAll = buildPattern(
    'sade_sati',
    { en: 'During Sade Sati', hi: 'साढ़े साती के दौरान' },
    {
      en: 'Your mood during the Sade Sati period (Saturn transit over Moon).',
      hi: 'साढ़े साती काल (शनि का चन्द्र पर गोचर) में आपका मनोदशा।',
    },
    allSadeSati,
    overallMood,
    overallEnergy,
  );
  if (pAll) patterns.push(pAll);

  // Individual phases
  const PHASE_LABELS: Record<string, { en: string; hi: string }> = {
    rising: { en: 'Sade Sati (Rising)', hi: 'साढ़े साती (आरोहण)' },
    peak: { en: 'Sade Sati (Peak)', hi: 'साढ़े साती (शिखर)' },
    setting: { en: 'Sade Sati (Setting)', hi: 'साढ़े साती (अवरोहण)' },
  };

  for (const [phase, acc] of phaseGroups) {
    const lbl = PHASE_LABELS[phase] ?? { en: `Sade Sati (${phase})`, hi: `साढ़े साती (${phase})` };
    const p = buildPattern(
      'sade_sati',
      lbl,
      {
        en: `Your mood during the ${phase} phase of Sade Sati.`,
        hi: `साढ़े साती के ${phase} चरण में आपका मनोदशा।`,
      },
      acc,
      overallMood,
      overallEnergy,
    );
    if (p) patterns.push(p);
  }

  return patterns;
}

// ---------------------------------------------------------------------------
// Main analysis function
// ---------------------------------------------------------------------------

export function analyzeJournalPatterns(entries: JournalEntry[]): JournalInsights {
  const totalEntries = entries.length;
  const hasEnoughData = totalEntries >= MIN_TOTAL_ENTRIES;

  // Compute overall averages (skip null mood/energy)
  let moodSum = 0;
  let moodCount = 0;
  let energySum = 0;
  let energyCount = 0;

  for (const e of entries) {
    if (e.mood != null) {
      moodSum += e.mood;
      moodCount += 1;
    }
    if (e.energy != null) {
      energySum += e.energy;
      energyCount += 1;
    }
  }

  const overallAvgMood = avgOrZero(moodSum, moodCount);
  const overallAvgEnergy = avgOrZero(energySum, energyCount);

  if (!hasEnoughData) {
    return {
      patterns: [],
      totalEntries,
      overallAvgMood,
      overallAvgEnergy,
      bestConditions: [],
      worstConditions: [],
      minEntriesForPatterns: MIN_TOTAL_ENTRIES,
      hasEnoughData: false,
    };
  }

  // Run all detectors
  const allPatterns: JournalPattern[] = [
    ...detectMoonSignPatterns(entries, overallAvgMood, overallAvgEnergy),
    ...detectNakshatraPatterns(entries, overallAvgMood, overallAvgEnergy),
    ...detectWeekdayPatterns(entries, overallAvgMood, overallAvgEnergy),
    ...detectTithiTypePatterns(entries, overallAvgMood, overallAvgEnergy),
    ...detectDashaPatterns(entries, overallAvgMood, overallAvgEnergy),
    ...detectYogaPatterns(entries, overallAvgMood, overallAvgEnergy),
    ...detectSadeSatiPatterns(entries, overallAvgMood, overallAvgEnergy),
  ];

  // Sort by absolute mood delta descending
  allPatterns.sort((a, b) => Math.abs(b.moodDelta) - Math.abs(a.moodDelta));

  // Best = positive sentiment, sorted by moodDelta descending
  const positives = allPatterns.filter((p) => p.sentiment === 'positive');
  positives.sort((a, b) => b.moodDelta - a.moodDelta);
  const bestConditions = positives.slice(0, 3);

  // Worst = negative sentiment, sorted by moodDelta ascending (most negative first)
  const negatives = allPatterns.filter((p) => p.sentiment === 'negative');
  negatives.sort((a, b) => a.moodDelta - b.moodDelta);
  const worstConditions = negatives.slice(0, 3);

  return {
    patterns: allPatterns,
    totalEntries,
    overallAvgMood,
    overallAvgEnergy,
    bestConditions,
    worstConditions,
    minEntriesForPatterns: MIN_TOTAL_ENTRIES,
    hasEnoughData: true,
  };
}
