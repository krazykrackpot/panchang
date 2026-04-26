;
import type { LocaleText } from '@/types/panchang';
import { BirthData } from './kundali';

export interface ScoreBreakdown {
  panchangScore: number;  // 0-25
  transitScore: number;   // 0-25
  timingScore: number;    // 0-25
  personalScore: number;  // 0-25
}

export interface ScoredTimeWindow {
  date: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  breakdown: ScoreBreakdown;
  keyFactors: LocaleText[];
  panchangaShuddhi?: number; // 0-5 count of favorable panchanga elements
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
}

export type ExtendedActivityId =
  | 'marriage' | 'griha_pravesh' | 'mundan' | 'vehicle' | 'travel'
  | 'property' | 'business' | 'education'
  | 'namakarana' | 'upanayana' | 'engagement' | 'gold_purchase'
  | 'medical_treatment' | 'court_case' | 'exam' | 'spiritual_practice'
  | 'agriculture' | 'financial_signing' | 'surgery' | 'relocation';

export interface ExtendedActivity {
  id: ExtendedActivityId;
  label: LocaleText;
  goodTithis: number[];
  goodNakshatras: number[];
  goodWeekdays: number[];
  avoidTithis: number[];
  avoidNakshatras: number[];
  goodHoras: number[];
  relevantHouses: number[];
}

export interface MuhurtaAIResult {
  activity: ExtendedActivityId;
  activityLabel: LocaleText;
  dateRange: { start: string; end: string };
  topRecommendations: ScoredTimeWindow[];
  summary: LocaleText;
}

// --- Muhurta Scanner V2 types ---

export interface ScanOptionsV2 {
  startDate: string;       // YYYY-MM-DD
  endDate: string;         // YYYY-MM-DD
  activity: ExtendedActivityId;
  lat: number;
  lng: number;
  tz: number;
  windowMinutes: number;   // 120 for overview, 15 for detail
  preSunriseHours: number; // hours before sunrise to include (e.g. 2)
  postSunsetHours: number; // hours after sunset to include (e.g. 3)
  birthNakshatra?: number;
  birthRashi?: number;
  dashaLords?: { maha: number; antar: number; pratyantar: number };
}

export interface DetailBreakdown {
  tithi: number;           // 0-20
  nakshatra: number;       // 0-20
  yoga: number;            // 0-20
  karana: number;          // 0-10
  taraBala: number;        // 0-10
  chandraBala: number;     // 0-10
  dashaHarmony: number;    // 0-10
  inauspicious: number;    // 0-10 (subtractive — higher = less penalty)
}

export interface InauspiciousPeriod {
  name: string;
  startTime: string;       // HH:MM
  endTime: string;         // HH:MM
  active: boolean;
}

export interface HeatmapCell {
  date: string;
  timeSlot: number;
  startTime: string;
  endTime: string;
  score: number;           // 0-100 normalized
  rawScore: number;
}

export interface DetailWindow {
  date: string;
  startTime: string;
  endTime: string;
  score: number;
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

export interface MuhurtaScanResponse {
  windows: HeatmapCell[] | DetailWindow[];
  meta: {
    activity: ExtendedActivityId;
    dateRange: [string, string];
    resolution: 'overview' | 'detail';
    personalFactorsUsed: ('taraBala' | 'chandraBala' | 'dashaHarmony')[];
    computeTimeMs: number;
  };
}
