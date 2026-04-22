/**
 * Reading Trajectory Engine
 *
 * Stores domain scores monthly and computes trends, sparklines, and
 * correlative insights linking score movements to dasha/transit events.
 */

import type { LocaleText } from '@/types/panchang';
import type { DomainType, PersonalReading } from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single monthly snapshot of all 8 domain scores + metadata. */
export interface TrajectoryPoint {
  /** Month identifier, e.g. "2026-04". */
  date: string;
  /** Scores keyed by domain, each 0–10. */
  scores: Record<DomainType, number>;
  /** Name of the running Maha Dasha lord. */
  mahaDasha: string;
  /** Name of the running Antar Dasha lord. */
  antarDasha: string;
  /** Whether Sade Sati is active this month. */
  sadeSatiActive: boolean;
  /** Optional label describing a significant event this month. */
  triggerEvent?: string;
}

/** Trajectory analysis for a single domain. */
export interface DomainTrajectory {
  domain: DomainType;
  /** Current month's score. */
  current: number;
  /** Previous month's score (or current if no history). */
  previous: number;
  /** Direction of movement relative to recent average. */
  trend: 'rising' | 'falling' | 'stable';
  /** Absolute change from previous month. */
  delta: number;
  /** Array of scores for the last N months (oldest first). */
  sparkline: number[];
  /** Bilingual insight correlating the trend with astrological events. */
  insight: LocaleText;
}

/** Complete trajectory analysis across all domains. */
export interface FullTrajectory {
  /** Per-domain trajectory analysis. */
  domains: DomainTrajectory[];
  /** Overall direction across all domains. */
  overallTrend: 'improving' | 'declining' | 'mixed' | 'stable';
  /** Domain with the largest positive delta, or null if none positive. */
  biggestGain: { domain: DomainType; delta: number } | null;
  /** Domain with the largest negative delta, or null if none negative. */
  biggestDrop: { domain: DomainType; delta: number } | null;
  /** Bilingual summary of the overall trajectory. */
  summary: LocaleText;
  /** True when at least 2 monthly data points exist (real trend data). */
  hasHistory: boolean;
}

// ---------------------------------------------------------------------------
// The 8 scoreable domains (excludes 'currentPeriod')
// ---------------------------------------------------------------------------

const SCORED_DOMAINS: DomainType[] = [
  'health', 'wealth', 'career', 'marriage',
  'children', 'family', 'spiritual', 'education',
];

// ---------------------------------------------------------------------------
// Domain display names (for insight generation)
// ---------------------------------------------------------------------------

const DOMAIN_NAMES: Record<string, { en: string; hi: string }> = {
  health:    { en: 'Health',    hi: 'स्वास्थ्य' },
  wealth:    { en: 'Wealth',    hi: 'धन' },
  career:    { en: 'Career',    hi: 'करियर' },
  marriage:  { en: 'Marriage',  hi: 'विवाह' },
  children:  { en: 'Children',  hi: 'संतान' },
  family:    { en: 'Family',    hi: 'परिवार' },
  spiritual: { en: 'Spiritual', hi: 'आध्यात्म' },
  education: { en: 'Education', hi: 'शिक्षा' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Average of an array of numbers. Returns 0 for empty arrays. */
function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Round to 1 decimal place. */
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Generate an insight string correlating a domain trend with
 * dasha/transit context from the current reading.
 */
function generateDomainInsight(
  domain: DomainType,
  trend: 'rising' | 'falling' | 'stable',
  delta: number,
  currentPoint: TrajectoryPoint | null,
  locale: string,
): LocaleText {
  const name = DOMAIN_NAMES[domain] || { en: domain, hi: domain };
  const dasha = currentPoint ? `${currentPoint.mahaDasha}-${currentPoint.antarDasha}` : '';
  const sadeSati = currentPoint?.sadeSatiActive ?? false;

  if (trend === 'rising') {
    const en = `${name.en} is on an upward trajectory (+${round1(delta)}).` +
      (dasha ? ` The ${dasha} dasha period is supporting growth in this area.` : '') +
      (sadeSati ? ' This is notable progress despite active Sade Sati.' : '');
    const hi = `${name.hi} में सुधार हो रहा है (+${round1(delta)})।` +
      (dasha ? ` ${dasha} दशा इस क्षेत्र में वृद्धि दे रही है।` : '') +
      (sadeSati ? ' साढ़े साती के बावजूद यह उल्लेखनीय प्रगति है।' : '');
    return { en, hi, sa: en } as LocaleText;
  }

  if (trend === 'falling') {
    const en = `${name.en} has declined (${round1(delta)}).` +
      (sadeSati ? ' Active Sade Sati may be contributing to this pressure.' : '') +
      (dasha ? ` Monitor this area during the ${dasha} dasha period.` : '');
    const hi = `${name.hi} में गिरावट आई है (${round1(delta)})।` +
      (sadeSati ? ' सक्रिय साढ़े साती इस दबाव में योगदान दे सकती है।' : '') +
      (dasha ? ` ${dasha} दशा काल में इस क्षेत्र पर ध्यान दें।` : '');
    return { en, hi, sa: en } as LocaleText;
  }

  // stable
  const en = `${name.en} remains steady.` +
    (dasha ? ` The ${dasha} dasha period is maintaining equilibrium here.` : '');
  const hi = `${name.hi} स्थिर बना हुआ है।` +
    (dasha ? ` ${dasha} दशा यहाँ संतुलन बनाए रख रही है।` : '');
  return { en, hi, sa: en } as LocaleText;
}

// ---------------------------------------------------------------------------
// Main engine
// ---------------------------------------------------------------------------

/**
 * Compute a full trajectory analysis from historical monthly readings
 * and the current PersonalReading.
 *
 * @param history  Array of past monthly snapshots (oldest first).
 * @param currentReading  The current PersonalReading from the domain synthesis engine.
 * @param locale  Current locale string (used for insight text priority).
 * @returns Complete trajectory analysis with per-domain trends, sparklines, and insights.
 */
export function computeTrajectory(
  history: TrajectoryPoint[],
  currentReading: PersonalReading,
  locale: string,
): FullTrajectory {
  // Build current scores from PersonalReading
  const currentScores: Partial<Record<DomainType, number>> = {};
  for (const dr of currentReading.domains) {
    if (SCORED_DOMAINS.includes(dr.domain)) {
      currentScores[dr.domain] = dr.overallRating.score;
    }
  }

  // Build the current TrajectoryPoint for context
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Extract dasha info from current period
  const currentMaha = currentReading.currentPeriod?.dashaSummary?.en?.split(' ')?.[0] ?? '';
  const currentAntar = '';

  const currentPoint: TrajectoryPoint = {
    date: currentMonth,
    scores: {} as Record<DomainType, number>,
    mahaDasha: currentMaha,
    antarDasha: currentAntar,
    sadeSatiActive: false,
  };

  // Fill current scores into the point
  for (const d of SCORED_DOMAINS) {
    currentPoint.scores[d] = currentScores[d] ?? 5;
  }

  // If history has a recent point, extract dasha/sade sati from it for context
  const latestHistoryPoint = history.length > 0 ? history[history.length - 1] : null;
  if (latestHistoryPoint?.sadeSatiActive) {
    currentPoint.sadeSatiActive = latestHistoryPoint.sadeSatiActive;
  }
  if (latestHistoryPoint?.mahaDasha) {
    currentPoint.mahaDasha = latestHistoryPoint.mahaDasha;
  }
  if (latestHistoryPoint?.antarDasha) {
    currentPoint.antarDasha = latestHistoryPoint.antarDasha;
  }

  // Compute per-domain trajectories
  const domainTrajectories: DomainTrajectory[] = [];
  const trendCounts = { rising: 0, falling: 0, stable: 0 };

  for (const domain of SCORED_DOMAINS) {
    const current = currentScores[domain] ?? 5;

    // Extract sparkline from history + current
    const sparkline = history.map(h => h.scores[domain] ?? 5);
    sparkline.push(current);

    // Previous month score
    const previous = history.length > 0
      ? (history[history.length - 1].scores[domain] ?? 5)
      : current;

    // Delta from previous month
    const delta = round1(current - previous);

    // Trend: compare current against average of last 3 months
    const recentHistory = history.slice(-3).map(h => h.scores[domain] ?? 5);
    const recentAvg = recentHistory.length > 0 ? avg(recentHistory) : current;

    let trend: 'rising' | 'falling' | 'stable';
    if (current > recentAvg + 0.5) {
      trend = 'rising';
    } else if (current < recentAvg - 0.5) {
      trend = 'falling';
    } else {
      trend = 'stable';
    }

    trendCounts[trend]++;

    const insight = generateDomainInsight(domain, trend, delta, currentPoint, locale);

    domainTrajectories.push({
      domain,
      current,
      previous,
      trend,
      delta,
      sparkline,
      insight,
    });
  }

  // Find biggest gain and biggest drop
  let biggestGain: { domain: DomainType; delta: number } | null = null;
  let biggestDrop: { domain: DomainType; delta: number } | null = null;

  for (const dt of domainTrajectories) {
    if (dt.delta > 0 && (!biggestGain || dt.delta > biggestGain.delta)) {
      biggestGain = { domain: dt.domain, delta: dt.delta };
    }
    if (dt.delta < 0 && (!biggestDrop || dt.delta < biggestDrop.delta)) {
      biggestDrop = { domain: dt.domain, delta: dt.delta };
    }
  }

  // Overall trend by majority
  let overallTrend: 'improving' | 'declining' | 'mixed' | 'stable';
  if (trendCounts.rising > trendCounts.falling && trendCounts.rising > trendCounts.stable) {
    overallTrend = 'improving';
  } else if (trendCounts.falling > trendCounts.rising && trendCounts.falling > trendCounts.stable) {
    overallTrend = 'declining';
  } else if (trendCounts.rising > 0 && trendCounts.falling > 0) {
    overallTrend = 'mixed';
  } else {
    overallTrend = 'stable';
  }

  // Summary text
  const hasHistory = history.length > 0;
  const summary = hasHistory
    ? generateOverallSummary(overallTrend, biggestGain, biggestDrop, currentPoint)
    : generateSnapshotSummary(currentPoint, domainTrajectories);

  return {
    domains: domainTrajectories,
    overallTrend,
    biggestGain,
    biggestDrop,
    summary,
    hasHistory,
  };
}

// ---------------------------------------------------------------------------
// Summary generation
// ---------------------------------------------------------------------------

function generateOverallSummary(
  overallTrend: FullTrajectory['overallTrend'],
  biggestGain: FullTrajectory['biggestGain'],
  biggestDrop: FullTrajectory['biggestDrop'],
  currentPoint: TrajectoryPoint,
): LocaleText {
  const gainName = biggestGain ? (DOMAIN_NAMES[biggestGain.domain]?.en ?? biggestGain.domain) : '';
  const dropName = biggestDrop ? (DOMAIN_NAMES[biggestDrop.domain]?.en ?? biggestDrop.domain) : '';
  const gainNameHi = biggestGain ? (DOMAIN_NAMES[biggestGain.domain]?.hi ?? biggestGain.domain) : '';
  const dropNameHi = biggestDrop ? (DOMAIN_NAMES[biggestDrop.domain]?.hi ?? biggestDrop.domain) : '';

  const dasha = currentPoint.mahaDasha && currentPoint.antarDasha
    ? `${currentPoint.mahaDasha}-${currentPoint.antarDasha}`
    : currentPoint.mahaDasha || '';

  let en: string;
  let hi: string;

  switch (overallTrend) {
    case 'improving':
      en = 'Your life trajectory is moving upward overall.' +
        (biggestGain ? ` ${gainName} shows the strongest growth (+${round1(biggestGain.delta)}).` : '') +
        (dasha ? ` The ${dasha} dasha period is generally supportive.` : '');
      hi = 'आपकी जीवन दिशा कुल मिलाकर ऊपर की ओर है।' +
        (biggestGain ? ` ${gainNameHi} में सबसे अधिक वृद्धि (+${round1(biggestGain.delta)}) दिख रही है।` : '') +
        (dasha ? ` ${dasha} दशा सामान्यतः सहायक है।` : '');
      break;
    case 'declining':
      en = 'Several life areas are under pressure this period.' +
        (biggestDrop ? ` ${dropName} needs the most attention (${round1(biggestDrop.delta)}).` : '') +
        (dasha ? ` Be mindful during the ${dasha} dasha period.` : '');
      hi = 'इस अवधि में कई जीवन क्षेत्रों पर दबाव है।' +
        (biggestDrop ? ` ${dropNameHi} पर सबसे अधिक ध्यान आवश्यक है (${round1(biggestDrop.delta)})।` : '') +
        (dasha ? ` ${dasha} दशा काल में सावधानी रखें।` : '');
      break;
    case 'mixed':
      en = 'Your trajectory shows a mixed pattern — some domains rising, others falling.' +
        (biggestGain ? ` ${gainName} is your bright spot (+${round1(biggestGain.delta)}).` : '') +
        (biggestDrop ? ` ${dropName} requires attention (${round1(biggestDrop.delta)}).` : '');
      hi = 'आपकी दिशा मिश्रित है — कुछ क्षेत्र बढ़ रहे हैं, कुछ घट रहे हैं।' +
        (biggestGain ? ` ${gainNameHi} सबसे उज्ज्वल बिंदु है (+${round1(biggestGain.delta)})।` : '') +
        (biggestDrop ? ` ${dropNameHi} पर ध्यान आवश्यक है (${round1(biggestDrop.delta)})।` : '');
      break;
    default: // stable
      en = 'Your life trajectory is stable across all domains.' +
        (dasha ? ` The ${dasha} dasha period is maintaining balance.` : '');
      hi = 'आपकी जीवन दिशा सभी क्षेत्रों में स्थिर है।' +
        (dasha ? ` ${dasha} दशा संतुलन बनाए रख रही है।` : '');
  }

  return { en, hi, sa: en } as LocaleText;
}

/**
 * Summary for the first reading when no history exists.
 * Highlights strongest and weakest domains from current scores.
 */
function generateSnapshotSummary(
  currentPoint: TrajectoryPoint,
  domains: DomainTrajectory[],
): LocaleText {
  const sorted = [...domains].sort((a, b) => b.current - a.current);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const strongEn = DOMAIN_NAMES[strongest.domain]?.en ?? strongest.domain;
  const strongHi = DOMAIN_NAMES[strongest.domain]?.hi ?? strongest.domain;
  const weakEn = DOMAIN_NAMES[weakest.domain]?.en ?? weakest.domain;
  const weakHi = DOMAIN_NAMES[weakest.domain]?.hi ?? weakest.domain;

  const dasha = currentPoint.mahaDasha || '';

  const en = `This is your first reading. ${strongEn} (${round1(strongest.current)}/10) is your strongest domain` +
    (strongest.current !== weakest.current ? `, while ${weakEn} (${round1(weakest.current)}/10) needs the most attention` : '') +
    '.' + (dasha ? ` Current dasha: ${dasha}.` : '') +
    ' Generate your chart again next month to see trends over time.';

  const hi = `यह आपका प्रथम पठन है। ${strongHi} (${round1(strongest.current)}/10) आपका सबसे मज़बूत क्षेत्र है` +
    (strongest.current !== weakest.current ? `, जबकि ${weakHi} (${round1(weakest.current)}/10) पर सबसे अधिक ध्यान आवश्यक है` : '') +
    '।' + (dasha ? ` वर्तमान दशा: ${dasha}।` : '') +
    ' प्रवृत्तियाँ देखने के लिए अगले महीने फिर से चार्ट बनाएँ।';

  return { en, hi, sa: en } as LocaleText;
}
