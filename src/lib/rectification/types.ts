/**
 * Birth Time Rectification — Type Definitions
 *
 * Data model for the rectification engine that scores candidate birth times
 * against known life events using Vimshottari Dasha house activations.
 */

export interface LifeEvent {
  type:
    | 'marriage'
    | 'child_birth'
    | 'career_change'
    | 'illness'
    | 'parent_death'
    | 'relocation'
    | 'financial_gain'
    | 'financial_loss'
    | 'education';
  date: string; // YYYY-MM-DD
  description?: string;
}

export interface RectificationInput {
  birthDate: string; // YYYY-MM-DD
  birthLat: number;
  birthLng: number;
  birthTimezone: number; // UTC offset in hours (e.g. 5.5 for IST)
  approximateTime?: string; // "10:30" or null/undefined
  timeRange?: { from: string; to: string }; // "08:00" to "12:00"
  events: LifeEvent[];
}

export interface RectificationCandidate {
  birthTime: string; // "10:22"
  lagnaSign: number; // 1-12
  lagnaSignName: { en: string; hi: string };
  lagnaDegree: number; // 0-360
  confidence: number; // 0-100
  totalScore: number; // raw sum of event scores
  eventMatches: EventMatch[];
}

export interface EventMatch {
  event: LifeEvent;
  score: number; // 0-10
  reason: { en: string; hi: string };
}

export interface RectificationResult {
  candidates: RectificationCandidate[]; // Top 3
  searchWindow: { from: string; to: string };
  candidatesEvaluated: number;
  strength: 'strong' | 'moderate' | 'ambiguous' | 'insufficient';
}
