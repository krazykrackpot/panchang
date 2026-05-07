// src/lib/caesarean/types.ts

import type { LocaleText } from '@/types/panchang';

/** Slot grade based on total score */
export type SlotGrade = 'excellent' | 'good' | 'fair' | 'marginal' | 'poor' | 'vetoed';

/** Per-pillar breakdown */
export interface PillarBreakdown {
  lagna: number;       // 0-30
  moon: number;        // 0-25
  distribution: number; // 0-20
  dasha: number;       // 0-15
  defects: number;     // 0-10 (starts at 10, deducted)
}

/** A defect found in the chart */
export interface ChartDefect {
  id: string;
  label: LocaleText;
  deduction: number;
  isVeto: boolean;
  source: string;      // Classical text reference
}

/** A positive factor found in the chart */
export interface ChartStrength {
  id: string;
  label: LocaleText;
  points: number;
  pillar: keyof PillarBreakdown;
  source: string;
}

/** Dasha info for the birth moment */
export interface BirthDashaInfo {
  lord: string;         // 'Jupiter', 'Venus', etc.
  lordId: number;       // Planet ID (0-8)
  totalYears: number;
  remainingYears: number;
  score: number;        // 0-15 final dasha pillar score
}

/** Complete scored slot */
export interface ScoredBirthSlot {
  date: string;          // YYYY-MM-DD
  time: string;          // HH:MM
  endTime: string;       // HH:MM (end of 15-min window)
  score: number;         // 0-100
  grade: SlotGrade;
  pillarBreakdown: PillarBreakdown;
  strengths: ChartStrength[];
  defects: ChartDefect[];
  dashaInfo: BirthDashaInfo;
  lagnaSign: number;     // 1-12
  lagnaSignName: LocaleText;
  lagnaLordId: number;   // 0-8
  moonSign: number;      // 1-12
  moonNakshatra: number; // 1-27
  moonNakshatraName: LocaleText;
  yogas: { name: LocaleText; isAuspicious: boolean }[];
  panchang: {
    tithi: LocaleText;
    nakshatra: LocaleText;
    yoga: LocaleText;
    karana: LocaleText;
  };
  isVetoed: boolean;
  vetoReason?: LocaleText;
}

/** Scanner input */
export interface CaesareanScanInput {
  startDate: string;     // YYYY-MM-DD
  endDate: string;       // YYYY-MM-DD
  lat: number;
  lng: number;
  timezone: string;      // IANA string
  /** Operating hours constraint (24h format) */
  opStart: number;       // e.g. 8 for 8:00 AM
  opEnd: number;         // e.g. 17 for 5:00 PM
  /** Resolution in minutes */
  windowMinutes?: number; // default 15
  /** Max results to return */
  maxResults?: number;    // default 20
}

/** Scanner output */
export interface CaesareanScanResult {
  slots: ScoredBirthSlot[];
  meta: {
    dateRange: { start: string; end: string };
    location: { lat: number; lng: number };
    operatingHours: { start: number; end: number };
    totalSlotsEvaluated: number;
    computeTimeMs: number;
  };
}
