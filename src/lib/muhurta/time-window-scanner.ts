/**
 * Time Window Scanner — Scans date ranges and scores each window
 *
 * Delegates to the unified muhurta engine and adapts output to legacy formats.
 */

import '@/lib/muhurta/engine'; // ensure rules registered
import { unifiedScan } from '@/lib/muhurta/engine/scanner';
import { adaptToV1, adaptToV2 } from '@/lib/muhurta/engine/adapters';
import { getExtendedActivity } from './activity-rules-extended';
import type { ScoredTimeWindow, ExtendedActivityId, ScanOptionsV2, DetailBreakdown, InauspiciousPeriod } from '@/types/muhurta-ai';

interface ScanOptions {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  activity: ExtendedActivityId;
  lat: number;
  lng: number;
  tz: number;
  birthNakshatra?: number; // 1-27, for Tara Bala
  birthRashi?: number;     // 1-12, for Chandra Bala
}

/**
 * Scan a date range and return scored time windows (V1 format).
 * Delegates to the unified engine and adapts output via adaptToV1().
 */
export function scanDateRange(options: ScanOptions): ScoredTimeWindow[] {
  const { startDate, endDate, activity, lat, lng, tz, birthNakshatra, birthRashi } = options;

  // Guard: return empty for unknown activity (matches legacy behaviour)
  const rules = getExtendedActivity(activity);
  if (!rules) return [];

  const windows = unifiedScan({
    startDate,
    endDate,
    activity,
    lat,
    lng,
    tz,
    windowMinutes: 180,
    maxResults: 20,
    minScore: 40,
    birthNakshatra,
    birthRashi,
  });

  return adaptToV1(windows);
}

// ─── V2 Scanner ──────────────────────────────────────────────────────────────

export interface ScanV2Window {
  date: string;
  timeSlot: number;
  startTime: string;
  endTime: string;
  score: number;        // 0-100 normalized
  rawScore: number;
  breakdown: DetailBreakdown;
  inauspiciousPeriods: InauspiciousPeriod[];
  panchangContext: {
    tithiName: string;
    nakshatraName: string;
    yogaName: string;
    karanaName: string;
    paksha: 'shukla' | 'krishna';
  };
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
}

/**
 * Scan a date range with configurable window size and return ALL windows.
 * V2 — supports inauspicious periods, dasha harmony, and DetailBreakdown.
 * Delegates to the unified engine and adapts output via adaptToV2().
 */
export function scanDateRangeV2(options: ScanOptionsV2): ScanV2Window[] {
  const {
    startDate, endDate, activity, lat, lng, tz,
    windowMinutes, preSunriseHours, postSunsetHours,
    birthNakshatra, birthRashi, dashaLords,
  } = options;

  // Guard: return empty for unknown activity (matches legacy behaviour)
  const rulesV2 = getExtendedActivity(activity);
  if (!rulesV2) return [];

  const windows = unifiedScan({
    startDate,
    endDate,
    activity,
    lat,
    lng,
    tz,
    windowMinutes,
    preSunriseHours,
    postSunsetHours,
    birthNakshatra,
    birthRashi,
    dashaLords,
  });

  return adaptToV2(windows);
}
