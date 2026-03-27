import { Trilingual } from './panchang';
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
  keyFactors: Trilingual[];
}

export type ExtendedActivityId =
  | 'marriage' | 'griha_pravesh' | 'mundan' | 'vehicle' | 'travel'
  | 'property' | 'business' | 'education'
  | 'namakarana' | 'upanayana' | 'engagement' | 'gold_purchase'
  | 'medical_treatment' | 'court_case' | 'exam' | 'spiritual_practice'
  | 'agriculture' | 'financial_signing' | 'surgery' | 'relocation';

export interface ExtendedActivity {
  id: ExtendedActivityId;
  label: Trilingual;
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
  activityLabel: Trilingual;
  dateRange: { start: string; end: string };
  topRecommendations: ScoredTimeWindow[];
  summary: Trilingual;
}
