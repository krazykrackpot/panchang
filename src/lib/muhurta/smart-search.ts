/**
 * Smart Muhurta Search Engine
 *
 * Delegates to the unified muhurta engine for all scanning logic.
 * This file retains the public API (types + smartMuhurtaSearch) for consumers.
 */

import '@/lib/muhurta/engine'; // ensure rules registered
import { unifiedScan } from '@/lib/muhurta/engine/scanner';
import { adaptToSmartSearch } from '@/lib/muhurta/engine/adapters';
import type { ExtendedActivityId } from '@/types/muhurta-ai';
import type { BirthData } from '@/types/kundali';

// ─── Types ───────────────────────────────────────────────────

export interface MuhurtaWindow {
  date: string;          // "2026-10-14"
  startTime: string;     // "18:15"
  endTime: string;       // "19:30"
  score: number;         // 0-100
  breakdown: {
    panchang: number;    // 0-25
    lagna: number;       // 0-25
    hora: number;        // 0-25
    personal: number;    // 0-25 (0 if not logged in)
  };
  proof: {
    tithi: { name: string; quality: string };
    nakshatra: { name: string; quality: string };
    yoga: { name: string; quality: string };
    lagna: { sign: string; quality: string };
    hora: { planet: string; match: boolean };
    specialYogas: string[];
    dashaHarmony?: string;
  };
}

export interface SearchParams {
  activity: ExtendedActivityId;
  startDate: string;     // "YYYY-MM-DD"
  endDate: string;       // "YYYY-MM-DD"
  lat: number;
  lng: number;
  tzOffset: number;      // hours from UTC (e.g., 5.5 for IST)
}

export interface UserSnapshot {
  birthData: BirthData;
  dashaLords?: { maha: number; antar: number; pratyantar: number };
}

// ─── Main Entry Point ────────────────────────────────────────────

export function smartMuhurtaSearch(
  params: SearchParams,
  userSnapshot?: UserSnapshot,
): MuhurtaWindow[] {
  // Delegate to the unified engine with two-pass mode for performance,
  // then adapt the output to MuhurtaWindow[] format.
  const windows = unifiedScan({
    startDate: params.startDate,
    endDate: params.endDate,
    activity: params.activity,
    lat: params.lat,
    lng: params.lng,
    tz: params.tzOffset,
    windowMinutes: 15,
    twoPass: true,
    twoPassTopDays: 5,
    maxResults: 3,
    minScore: 30,
    dashaLords: userSnapshot?.dashaLords,
  });

  return adaptToSmartSearch(windows);
}
