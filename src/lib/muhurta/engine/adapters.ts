/**
 * Muhurta Engine — Adapters
 *
 * Convert unified ScoredWindow[] to the three legacy output formats:
 *   - V1: ScoredTimeWindow[] (used by /api/muhurta-ai)
 *   - V2: ScanV2Window[] (used by /api/muhurta-scan, /api/muhurat/scan)
 *   - SmartSearch: MuhurtaWindow[] (used by /api/muhurta-search, /api/chart-chat)
 */

import type { ScoredWindow } from './scanner';
import type {
  ScoredTimeWindow,
  ScoreBreakdown,
  DetailBreakdown,
  InauspiciousPeriod,
} from '@/types/muhurta-ai';
import type { LocaleText } from '@/types/panchang';
import type { ScanV2Window } from '@/lib/muhurta/time-window-scanner';
import type { MuhurtaWindow } from '@/lib/muhurta/smart-search';

// ─── V1 Adapter ─────────────────────────────────────────────────────────────

/**
 * Convert unified ScoredWindow[] to V1 ScoredTimeWindow[] format.
 * Used by /api/muhurta-ai via scanDateRange().
 */
export function adaptToV1(windows: ScoredWindow[]): ScoredTimeWindow[] {
  return windows.map((w) => {
    // Map WindowBreakdown → ScoreBreakdown (each bucket 0-25)
    const breakdown: ScoreBreakdown = {
      panchangScore: clamp(w.breakdown.panchanga, 0, 25),
      transitScore: clamp(w.breakdown.graha, 0, 25),
      timingScore: clamp(w.breakdown.kaala, 0, 25),
      personalScore: clamp(w.breakdown.personal, 0, 25),
    };

    // Key factors: top 5 positive, non-cancelled assessments
    const keyFactors: LocaleText[] = w.factors
      .filter((f) => !f.cancelled && f.effectivePoints > 0)
      .sort((a, b) => b.effectivePoints - a.effectivePoints)
      .slice(0, 5)
      .map((f) => f.reason);

    // Panchanga Shuddhi: count of positive panchanga assessments
    const panchangaShuddhi = w.factors.filter(
      (f) => f.category === 'panchanga' && !f.cancelled && f.effectivePoints > 0
    ).length;

    return {
      date: w.date,
      startTime: w.startTime,
      endTime: w.endTime,
      totalScore: w.score,
      breakdown,
      keyFactors,
      panchangaShuddhi: clamp(panchangaShuddhi, 0, 5),
      taraBala: w.taraBala,
      chandraBala: w.chandraBala,
    };
  });
}

// ─── V2 Adapter ─────────────────────────────────────────────────────────────

/**
 * Convert unified ScoredWindow[] to V2 ScanV2Window[] format.
 * Used by /api/muhurta-scan and /api/muhurat/scan via scanDateRangeV2().
 */
export function adaptToV2(windows: ScoredWindow[]): ScanV2Window[] {
  return windows.map((w) => {
    // Build DetailBreakdown from assessments
    const breakdown: DetailBreakdown = {
      tithi: normaliseAssessment(w, 'tithi-quality', 20),
      nakshatra: normaliseAssessment(w, 'nakshatra-quality', 20),
      yoga: normaliseAssessment(w, 'yoga-quality', 20),
      karana: normaliseAssessment(w, 'karana-quality', 10),
      lagna: clamp(w.breakdown.lagna, 0, 8),
      taraBala: findPersonalScore(w, 'tara-bala', 10),
      chandraBala: findPersonalScore(w, 'chandra-bala', 10),
      dashaHarmony: findPersonalScore(w, 'dasha-harmony', 10),
      inauspicious: clamp(
        10 - w.inauspiciousPeriods.filter((p) => p.active).length,
        0,
        10
      ),
    };

    return {
      date: w.date,
      timeSlot: w.timeSlot,
      startTime: w.startTime,
      endTime: w.endTime,
      score: w.score,
      rawScore: w.rawScore,
      breakdown,
      inauspiciousPeriods: w.inauspiciousPeriods,
      panchangContext: {
        tithiName: w.panchangContext.tithiName,
        nakshatraName: w.panchangContext.nakshatraName,
        yogaName: w.panchangContext.yogaName,
        karanaName: w.panchangContext.karanaName,
        paksha: w.panchangContext.paksha,
      },
      taraBala: w.taraBala,
      chandraBala: w.chandraBala,
    };
  });
}

// ─── SmartSearch Adapter ────────────────────────────────────────────────────

/**
 * Convert unified ScoredWindow[] to MuhurtaWindow[] format.
 * Used by /api/muhurta-search and /api/chart-chat via smartMuhurtaSearch().
 */
export function adaptToSmartSearch(windows: ScoredWindow[]): MuhurtaWindow[] {
  return windows.map((w) => {
    // Map breakdown
    const breakdown: MuhurtaWindow['breakdown'] = {
      panchang: clamp(w.breakdown.panchanga, 0, 25),
      lagna: clamp(w.breakdown.lagna, 0, 25),
      hora: clamp(w.breakdown.kaala, 0, 25),
      personal: clamp(w.breakdown.personal, 0, 25),
    };

    // Build proof from assessments and panchangContext
    const tithiAssessment = findAssessment(w, 'tithi-quality');
    const nakshatraAssessment = findAssessment(w, 'nakshatra-quality');
    const yogaAssessment = findAssessment(w, 'yoga-quality');
    const dashaAssessment = findAssessment(w, 'dasha-harmony');

    const proof: MuhurtaWindow['proof'] = {
      tithi: {
        name: w.panchangContext.tithiName,
        quality: assessmentQuality(tithiAssessment),
      },
      nakshatra: {
        name: w.panchangContext.nakshatraName,
        quality: assessmentQuality(nakshatraAssessment),
      },
      yoga: {
        name: w.panchangContext.yogaName,
        quality: assessmentQuality(yogaAssessment),
      },
      lagna: {
        sign: w.panchangContext.lagnaSign ?? 'Unknown',
        quality: lagnaQuality(w.breakdown.lagna),
      },
      hora: {
        planet: w.panchangContext.horaLord ?? 'Unknown',
        match: w.breakdown.kaala > 10,
      },
      specialYogas: w.specialYogas,
      ...(dashaAssessment
        ? { dashaHarmony: dashaAssessment.reason.en }
        : {}),
    };

    return {
      date: w.date,
      startTime: w.startTime,
      endTime: w.endTime,
      score: w.score,
      breakdown,
      proof,
    };
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Find an assessment by ruleId prefix. Rules are registered with IDs
 * like 'tithi-quality', 'nakshatra-quality', etc.
 */
function findAssessment(w: ScoredWindow, ruleIdPrefix: string) {
  return w.factors.find((f) => f.ruleId.startsWith(ruleIdPrefix)) ?? null;
}

/**
 * Normalise an assessment's effectivePoints into a 0-maxRange scale.
 * If assessment not found, return a neutral midpoint value.
 */
function normaliseAssessment(
  w: ScoredWindow,
  ruleIdPrefix: string,
  maxRange: number
): number {
  const assessment = findAssessment(w, ruleIdPrefix);
  if (!assessment) return Math.round(maxRange / 2); // neutral default

  // Map effectivePoints (which can be negative) to 0-maxRange
  // Assessment maxPoints gives us the positive ceiling
  const maxPts = Math.max(assessment.maxPoints, 1);
  // Assume symmetric negative range (-maxPts to +maxPts)
  const normalised = ((assessment.effectivePoints + maxPts) / (2 * maxPts)) * maxRange;
  return clamp(Math.round(normalised), 0, maxRange);
}

/**
 * Extract a personal-category assessment score, clamped to 0-maxRange.
 */
function findPersonalScore(
  w: ScoredWindow,
  ruleIdPrefix: string,
  maxRange: number
): number {
  const assessment = findAssessment(w, ruleIdPrefix);
  if (!assessment) return 0;
  return clamp(Math.round(assessment.effectivePoints), 0, maxRange);
}

/**
 * Convert an assessment to a quality string for proof display.
 */
function assessmentQuality(
  assessment: ReturnType<typeof findAssessment>
): string {
  if (!assessment) return 'neutral';
  if (assessment.effectivePoints > 0) {
    return assessment.severity === 'positive' ? 'excellent' : 'auspicious';
  }
  if (assessment.effectivePoints < 0) return 'inauspicious';
  return 'neutral';
}

/**
 * Convert lagna breakdown score to a quality label.
 */
function lagnaQuality(lagnaScore: number): string {
  if (lagnaScore >= 10) return 'Excellent (Fixed/Mutable)';
  if (lagnaScore >= 5) return 'Good';
  if (lagnaScore > 0) return 'Acceptable';
  return 'Unfavourable';
}
