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
  | 'agriculture' | 'financial_signing' | 'surgery' | 'relocation'
  // ── Career activities (Phase 1 — see docs/superpowers/specs/
  // 2026-05-27-career-muhurta-design.md). Same `ExtendedActivity`
  // shape as the rest; consumed by the same verdict-engine path.
  | 'job_interview' | 'job_application' | 'salary_negotiation'
  | 'contract_signing' | 'first_day_at_job' | 'resignation'
  | 'business_launch' | 'asking_promotion';

/** Activity IDs belonging to the Career group (drives the UI facet). */
export const CAREER_ACTIVITY_IDS = [
  'job_interview',
  'job_application',
  'salary_negotiation',
  'contract_signing',
  'first_day_at_job',
  'resignation',
  'business_launch',
  'asking_promotion',
] as const satisfies readonly ExtendedActivityId[];

export type CareerActivityId = typeof CAREER_ACTIVITY_IDS[number];

/**
 * High-level grouping of activities for UI facets (Muhurta AI selector,
 * Career landing-page index, learn-module organisation). Order in each
 * group is display order.
 */
export type ActivityCategoryId = 'samskara' | 'career' | 'finance' | 'health' | 'travel' | 'spiritual' | 'other';

export const ACTIVITY_CATEGORIES: Record<ActivityCategoryId, {
  label: LocaleText;
  members: readonly ExtendedActivityId[];
}> = {
  samskara: {
    label: { en: 'Life Ceremonies', hi: 'संस्कार', sa: 'संस्काराः' },
    members: ['marriage', 'engagement', 'namakarana', 'mundan', 'upanayana', 'griha_pravesh'],
  },
  career: {
    label: { en: 'Career', hi: 'करियर', sa: 'व्यवसायः' },
    members: CAREER_ACTIVITY_IDS,
  },
  finance: {
    label: { en: 'Finance & Property', hi: 'धन एवं सम्पत्ति', sa: 'धनसम्पत्तिः' },
    members: ['vehicle', 'property', 'gold_purchase', 'financial_signing', 'business'],
  },
  health: {
    label: { en: 'Health', hi: 'स्वास्थ्य', sa: 'आरोग्यम्' },
    members: ['medical_treatment', 'surgery'],
  },
  travel: {
    label: { en: 'Travel & Relocation', hi: 'यात्रा एवं स्थानांतर', sa: 'यात्रा-स्थानान्तरम्' },
    members: ['travel', 'relocation'],
  },
  spiritual: {
    label: { en: 'Spiritual & Learning', hi: 'आध्यात्मिक एवं शिक्षा', sa: 'आध्यात्मिकं शिक्षणं च' },
    members: ['spiritual_practice', 'education', 'exam', 'agriculture', 'court_case'],
  },
  other: {
    label: { en: 'Other', hi: 'अन्य', sa: 'अन्यानि' },
    members: [],
  },
};

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
  /**
   * Nakshatra hard vetoes  –  window is disqualified (score → 0) if nakshatra matches.
   * Per Muhurta Chintamani Ch. 6 + Jyotirnibandha: strong textual consensus that
   * certain nakshatras are absolutely forbidden for specific samskaras.
   * Venus/Jupiter combustion is a separate hard veto checked in the scanner.
   * See docs/muhurta-rules.md for full citations.
   */
  hardAvoidNakshatras?: number[];
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
  lagna: number;           // 0-8 (MC: most powerful single factor)
  taraBala: number;        // 0-10
  chandraBala: number;     // 0-10
  dashaHarmony: number;    // 0-10
  inauspicious: number;    // 0-10 (subtractive  –  higher = less penalty)
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
  /** Day-level summaries with best window, quality tier, and factor verdicts (overview only) */
  days?: DaySummary[];
  /** Classical restriction notices for the scanned period (overview only) */
  restrictions?: RestrictionNotice[];
  meta: {
    activity: ExtendedActivityId;
    dateRange: [string, string];
    resolution: 'overview' | 'detail';
    personalFactorsUsed: ('taraBala' | 'chandraBala' | 'dashaHarmony')[];
    computeTimeMs: number;
  };
}

export interface FactorVerdict {
  factor: string;       // 'Tithi', 'Nakshatra', 'Yoga', 'Karana', 'Lagna'
  value: string;        // e.g. 'Dwitiya', 'Rohini'
  verdict: 'good' | 'neutral' | 'bad';
  reason: string;       // classical citation, e.g. 'Auspicious for marriage  –  MC Ch. 6'
}

export interface DaySummary {
  date: string;         // YYYY-MM-DD
  bestScore: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  windowCount: number;
  bestWindow?: { startTime: string; endTime: string; score: number };
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
  tithi?: string;
  nakshatra?: string;
  vara?: string;
  factors?: FactorVerdict[];
}

export interface RestrictionNotice {
  type: string;
  label: { en: string; hi: string };
}
