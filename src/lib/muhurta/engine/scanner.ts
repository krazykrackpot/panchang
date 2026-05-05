/**
 * Muhurta Engine — Unified Scanner
 *
 * Replaces 3 legacy scanners with a single function that iterates across
 * a date range, generates scoring windows, evaluates each through the
 * muhurta engine, and returns scored results sorted by score descending.
 *
 * Two-pass mode (twoPass: true): coarse scan at 90-min windows to rank days,
 * then fine scan at the requested windowMinutes on the top N days only.
 */

import { buildDayContext, buildWindowContext } from './context-builder';
import type { DayContext } from './context-builder';
import { evaluateWindow } from './evaluator';
import { generateVerdict } from './reasoning';
import { computeInauspiciousForWindow } from '@/lib/muhurta/inauspicious-periods';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { RASHIS } from '@/lib/constants/rashis';
import type {
  EvaluationResult,
  MuhurtaGrade,
  MuhurtaVerdict,
  WindowBreakdown,
  ResolvedAssessment,
  Cancellation,
  RuleAssessment,
} from './types';
import type { ExtendedActivityId, InauspiciousPeriod } from '@/types/muhurta-ai';

// ─── Public Types ─────────────────────────────────────────────────────────────

export interface UnifiedScanOptions {
  startDate: string;           // YYYY-MM-DD
  endDate: string;
  activity: ExtendedActivityId;
  lat: number;
  lng: number;
  tz: number;
  windowMinutes: number;       // Window size: 15, 90, 120, 180
  preSunriseHours?: number;    // Default 0
  postSunsetHours?: number;    // Default 0
  birthNakshatra?: number;
  birthRashi?: number;
  dashaLords?: { maha: number; antar: number; pratyantar: number };
  maxResults?: number;         // Limit output. Default: unlimited.
  minScore?: number;           // Filter. Default: 0.
  twoPass?: boolean;           // Coarse->fine for large ranges
  twoPassTopDays?: number;     // Default: 5
  includeVerdicts?: boolean;   // Generate reasoning chains
}

export interface ScoredWindow {
  date: string;
  startTime: string;           // HH:MM local time
  endTime: string;
  timeSlot: number;            // 0-based index within the day
  score: number;               // 0-100 normalised
  rawScore: number;
  grade: MuhurtaGrade;
  breakdown: WindowBreakdown;
  panchangContext: {
    tithiName: string;
    nakshatraName: string;
    yogaName: string;
    karanaName: string;
    paksha: 'shukla' | 'krishna';
    lagnaSign?: string;
    horaLord?: string;
  };
  factors: ResolvedAssessment[];
  cancellations: Cancellation[];
  inauspiciousPeriods: InauspiciousPeriod[];
  specialYogas: string[];
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
  verdict?: MuhurtaVerdict;
  dayVetoes?: RuleAssessment[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TARA_NAMES = [
  'Janma', 'Sampat', 'Vipat', 'Kshema', 'Pratyari',
  'Sadhaka', 'Vadha', 'Mitra', 'Atimitra',
];

/**
 * Format fractional hours as HH:MM (local time).
 * Handles negative values and values >= 24 by wrapping.
 */
function formatHour(h: number): string {
  const hh = Math.floor(((h % 24) + 24) % 24);
  const mm = Math.floor(((h - Math.floor(h)) * 60 + 0.5) % 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/**
 * Parse YYYY-MM-DD into { year, month, day }.
 */
function parseDate(s: string): { year: number; month: number; day: number } {
  const [y, m, d] = s.split('-').map(Number);
  return { year: y, month: m, day: d };
}

/**
 * Iterate dates from start to end (inclusive), yielding { year, month, day }.
 */
function* dateRange(
  start: string,
  end: string
): Generator<{ year: number; month: number; day: number; dateStr: string }> {
  const s = new Date(Date.UTC(
    ...(() => { const p = parseDate(start); return [p.year, p.month - 1, p.day] as const; })()
  ));
  const e = new Date(Date.UTC(
    ...(() => { const p = parseDate(end); return [p.year, p.month - 1, p.day] as const; })()
  ));

  while (s <= e) {
    const year = s.getUTCFullYear();
    const month = s.getUTCMonth() + 1;
    const day = s.getUTCDate();
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    yield { year, month, day, dateStr };
    s.setUTCDate(s.getUTCDate() + 1);
  }
}

/**
 * Look up tithi name from the TITHIS constant.
 * Tithi number 1-30: 1-15 = Shukla, 16-30 = Krishna.
 */
function getTithiName(tithi: number): string {
  // TITHIS array has 30 entries, 0-indexed
  const idx = tithi - 1;
  if (idx >= 0 && idx < TITHIS.length) {
    return TITHIS[idx].name.en;
  }
  return `Tithi ${tithi}`;
}

function getPaksha(tithi: number): 'shukla' | 'krishna' {
  return tithi <= 15 ? 'shukla' : 'krishna';
}

function getNakshatraName(nakshatra: number): string {
  const idx = nakshatra - 1;
  if (idx >= 0 && idx < NAKSHATRAS.length) {
    return NAKSHATRAS[idx].name.en;
  }
  return `Nakshatra ${nakshatra}`;
}

function getYogaName(yoga: number): string {
  const idx = yoga - 1;
  if (idx >= 0 && idx < YOGAS.length) {
    return YOGAS[idx].name.en;
  }
  return `Yoga ${yoga}`;
}

function getKaranaName(karana: number): string {
  const idx = karana - 1;
  if (idx >= 0 && idx < KARANAS.length) {
    return KARANAS[idx].name.en;
  }
  return `Karana ${karana}`;
}

function getLagnaSignName(lagnaSign: number | undefined): string | undefined {
  if (lagnaSign === undefined) return undefined;
  const rashi = RASHIS.find((r) => r.id === lagnaSign);
  return rashi?.name.en;
}

// ─── Core Scanner ─────────────────────────────────────────────────────────────

/**
 * Scan a single day, returning all non-vetoed scored windows.
 */
function scanDay(
  dayCtx: DayContext,
  opts: UnifiedScanOptions
): { windows: ScoredWindow[]; dayVetoes: RuleAssessment[] } {
  const {
    activity,
    windowMinutes,
    preSunriseHours = 0,
    postSunsetHours = 0,
    birthNakshatra,
    birthRashi,
    dashaLords,
    includeVerdicts,
  } = opts;

  // Day-level veto check: build a dummy window context at ~2h after sunrise
  const noonStartUT = dayCtx.sunriseUT + 2;
  const noonEndUT = dayCtx.sunriseUT + 3.5;
  const noonCtx = buildWindowContext(dayCtx, noonStartUT, noonEndUT, activity);

  // Inject personal data into the noon context for day-level veto rules
  if (birthNakshatra !== undefined) noonCtx.birthNakshatra = birthNakshatra;
  if (birthRashi !== undefined) noonCtx.birthRashi = birthRashi;
  if (dashaLords) noonCtx.dashaLords = dashaLords;

  const noonResult = evaluateWindow(noonCtx);
  if (noonResult.vetoes.length > 0) {
    return { windows: [], dayVetoes: noonResult.vetoes };
  }

  // Generate windows
  // Normalise sunrise/sunset to local time. For eastern timezones in summer,
  // sunriseUT can be ~23.9 (previous UT day), giving sunriseLocal > 24.
  // For western timezones, sunsetUT can be ~0.5 (next UT day), giving sunsetLocal < 0.
  let sunriseLocal = dayCtx.sunriseUT + dayCtx.tz;
  let sunsetLocal = dayCtx.sunsetUT + dayCtx.tz;
  if (sunriseLocal >= 24) sunriseLocal -= 24;
  if (sunsetLocal <= 0) sunsetLocal += 24;
  // If sunset is still before sunrise (shouldn't happen after normalisation),
  // assume a ~12h day centred on noon as fallback.
  if (sunsetLocal <= sunriseLocal) sunsetLocal = sunriseLocal + 12;
  const rangeStart = sunriseLocal - preSunriseHours;
  const rangeEnd = sunsetLocal + postSunsetHours;
  const stepHours = windowMinutes / 60;

  const windows: ScoredWindow[] = [];
  let slotIndex = 0;

  for (let startH = rangeStart; startH + stepHours <= rangeEnd + 0.001; startH += stepHours) {
    const endH = startH + stepHours;
    const windowStartUT = startH - dayCtx.tz;
    const windowEndUT = endH - dayCtx.tz;

    const ctx = buildWindowContext(dayCtx, windowStartUT, windowEndUT, activity);

    // Inject personal data
    if (birthNakshatra !== undefined) ctx.birthNakshatra = birthNakshatra;
    if (birthRashi !== undefined) ctx.birthRashi = birthRashi;
    if (dashaLords) ctx.dashaLords = dashaLords;

    const result = evaluateWindow(ctx);

    if (result.vetoes.length > 0) {
      slotIndex++;
      continue; // Window-level veto
    }

    const window = buildScoredWindow(
      result,
      ctx,
      dayCtx,
      slotIndex,
      startH,
      endH,
      opts
    );

    if (includeVerdicts) {
      window.verdict = generateVerdict(result, activity);
    }

    windows.push(window);
    slotIndex++;
  }

  return { windows, dayVetoes: [] };
}

/**
 * Build a ScoredWindow from an evaluation result and context.
 */
function buildScoredWindow(
  result: EvaluationResult,
  ctx: import('./types').RuleContext,
  dayCtx: DayContext,
  slotIndex: number,
  startH: number,
  endH: number,
  opts: UnifiedScanOptions
): ScoredWindow {
  const { snap } = ctx;
  const { birthNakshatra, birthRashi } = opts;

  // Panchang context names
  const tithiName = getTithiName(snap.tithi);
  const nakshatraName = getNakshatraName(snap.nakshatra);
  const yogaName = getYogaName(snap.yoga);
  const karanaName = getKaranaName(snap.karana);
  const paksha = getPaksha(snap.tithi);
  const lagnaSign = getLagnaSignName(ctx.lagnaSign);

  // Inauspicious periods (display data)
  const inauspiciousPeriods = computeInauspiciousForWindow(
    ctx.windowStartUT,
    ctx.windowEndUT,
    dayCtx.sunriseUT,
    dayCtx.sunsetUT,
    dayCtx.weekday,
    snap.nakshatra,
    dayCtx.jdNoon,
    dayCtx.tz,
    snap.moonSid
  );

  // Tara Bala
  let taraBala: ScoredWindow['taraBala'];
  if (birthNakshatra) {
    const count = ((snap.nakshatra - birthNakshatra + 27) % 27) + 1;
    const tara = ((count - 1) % 9) + 1;
    taraBala = {
      tara,
      name: TARA_NAMES[tara - 1],
      auspicious: ![3, 5, 7].includes(tara),
    };
  }

  // Chandra Bala — Moon in auspicious house from birth rashi
  // Houses 1, 3, 6, 7, 10, 11 from birth rashi are considered auspicious
  let chandraBala: boolean | undefined;
  if (birthRashi) {
    const house = ((snap.moonSign - birthRashi + 12) % 12) + 1;
    chandraBala = [1, 3, 6, 7, 10, 11].includes(house);
  }

  return {
    date: dayCtx.date,
    startTime: formatHour(startH),
    endTime: formatHour(endH),
    timeSlot: slotIndex,
    score: result.score,
    rawScore: result.rawScore,
    grade: result.grade,
    breakdown: result.breakdown,
    panchangContext: {
      tithiName,
      nakshatraName,
      yogaName,
      karanaName,
      paksha,
      lagnaSign,
    },
    factors: result.assessments,
    cancellations: result.cancellations,
    inauspiciousPeriods,
    specialYogas: result.activeSpecialYogas,
    taraBala,
    chandraBala,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Unified muhurta scanner. Iterates across a date range, evaluates windows,
 * and returns scored results sorted by score descending.
 *
 * @param opts Scan options including date range, activity, location, and filters.
 * @returns Array of ScoredWindow, sorted by score descending, filtered and limited.
 */
export function unifiedScan(opts: UnifiedScanOptions): ScoredWindow[] {
  const {
    startDate,
    endDate,
    minScore = 0,
    maxResults,
    twoPass = false,
    twoPassTopDays = 5,
  } = opts;

  if (twoPass) {
    return twoPassScan(opts, twoPassTopDays);
  }

  let allWindows: ScoredWindow[] = [];

  for (const { year, month, day } of dateRange(startDate, endDate)) {
    const dayCtx = buildDayContext(year, month, day, opts.lat, opts.lng, opts.tz);
    const { windows } = scanDay(dayCtx, opts);
    allWindows.push(...windows);
  }

  // Post-processing
  if (minScore > 0) {
    allWindows = allWindows.filter((w) => w.score >= minScore);
  }

  // Sort by score descending
  allWindows.sort((a, b) => b.score - a.score);

  if (maxResults && maxResults > 0) {
    allWindows = allWindows.slice(0, maxResults);
  }

  return allWindows;
}

/**
 * Two-pass scanning: coarse scan at 90-min windows to rank days,
 * then fine scan at the requested windowMinutes on the top N days.
 */
function twoPassScan(
  opts: UnifiedScanOptions,
  topDays: number
): ScoredWindow[] {
  const { startDate, endDate, minScore = 0, maxResults } = opts;

  // Pass 1: Coarse scan with 90-min windows
  const coarseOpts: UnifiedScanOptions = {
    ...opts,
    windowMinutes: 90,
    twoPass: false,
    includeVerdicts: false,
    maxResults: undefined,
    minScore: 0,
  };

  // Collect best score per day
  const dayScores: Map<string, number> = new Map();

  for (const { year, month, day, dateStr } of dateRange(startDate, endDate)) {
    const dayCtx = buildDayContext(year, month, day, opts.lat, opts.lng, opts.tz);
    const { windows } = scanDay(dayCtx, coarseOpts);

    if (windows.length > 0) {
      const bestScore = Math.max(...windows.map((w) => w.score));
      dayScores.set(dateStr, bestScore);
    }
  }

  // Rank days and pick top N
  const rankedDays = [...dayScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topDays)
    .map(([dateStr]) => dateStr);

  // Pass 2: Fine scan on top days
  let allWindows: ScoredWindow[] = [];

  for (const dateStr of rankedDays) {
    const { year, month, day } = parseDate(dateStr);
    const dayCtx = buildDayContext(year, month, day, opts.lat, opts.lng, opts.tz);
    const { windows } = scanDay(dayCtx, opts);
    allWindows.push(...windows);
  }

  // Post-processing
  if (minScore > 0) {
    allWindows = allWindows.filter((w) => w.score >= minScore);
  }

  allWindows.sort((a, b) => b.score - a.score);

  if (maxResults && maxResults > 0) {
    allWindows = allWindows.slice(0, maxResults);
  }

  return allWindows;
}
