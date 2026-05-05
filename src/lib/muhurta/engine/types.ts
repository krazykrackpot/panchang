/**
 * Muhurta Engine — Core Type Definitions
 *
 * Three-layer architecture:
 *   Layer 1: Rule Registry — self-contained rule objects
 *   Layer 2: Evaluator — cancellation resolution, scoring
 *   Layer 3: Reasoning — human-readable verdicts with citations
 */

import type { LocaleText } from '@/types/panchang';
import type { ExtendedActivityId, ExtendedActivity, InauspiciousPeriod } from '@/types/muhurta-ai';
import type { PanchangSnapshot } from '@/lib/muhurta/ai-recommender';

// Layer 1: Rule Registry Types

export type RuleScope = 'day' | 'window';
export type RuleEffect = 'veto' | 'penalty' | 'bonus' | 'info';

export type RuleCategory =
  | 'panchanga'
  | 'graha'
  | 'kaala'
  | 'lagna'
  | 'yoga-special'
  | 'period'
  | 'personal';

export type AuthorityTier = 0 | 1 | 2 | 3 | 4;
// Tier 0 (Absolute): Hard vetoes — combustion, Adhika, Chaturmas, forbidden nakshatras. CANNOT be cancelled.
// Tier 1 (Override): Godhuli Lagna — cancels everything except Tier 0.
// Tier 2 (Major): Strong lagna, special yogas, Pushkar Navamsha — can cancel Tier 4 defects.
// Tier 3 (Standard): All panchanga factors, timing factors.
// Tier 4 (Cancellable): Weak karana, inauspicious yoga, Dur Muhurtam, Gulika — can be cancelled by Tier 2.

export interface MuhurtaRule {
  id: string;
  name: LocaleText;
  category: RuleCategory;
  scope: RuleScope;
  effect: RuleEffect;
  tier: AuthorityTier;
  appliesTo: ExtendedActivityId[] | 'all';
  source?: string;
  evaluate: (ctx: RuleContext) => RuleAssessment | null;
}

export interface RuleContext {
  date: string;
  jdNoon: number;
  sunriseUT: number;
  sunsetUT: number;
  weekday: number; // 0=Sunday

  windowStartUT: number;
  windowEndUT: number;
  midpointJD: number;
  snap: PanchangSnapshot;
  lagnaSign?: number;
  navamshaSign?: number;

  activity: ExtendedActivityId;
  activityRules: ExtendedActivity;

  lat: number;
  lng: number;
  tz: number;

  birthNakshatra?: number;
  birthRashi?: number;
  dashaLords?: { maha: number; antar: number; pratyantar: number };

  planets?: Array<{ id: number; longitude: number; isRetrograde: boolean }>;
  combustion?: { vetoed: boolean; planets: string[]; details: Array<{ planet: string; distance: number; orb: number; severity: 'full' | 'partial' }> };
  lunarMasa?: { masaIdx: number; name: string; isAdhika: boolean };
}

export type AssessmentSeverity = 'critical' | 'major' | 'moderate' | 'minor' | 'positive';

export interface RuleAssessment {
  ruleId: string;
  ruleName: LocaleText;
  category: RuleCategory;
  tier: AuthorityTier;
  points: number;
  maxPoints: number;
  vetoed?: boolean;
  severity: AssessmentSeverity;
  reason: LocaleText;
  source?: string;
  cancels?: string[];
  cancelledBy?: string[];
}

// Layer 2: Evaluator Types

export interface ResolvedAssessment extends RuleAssessment {
  cancelled: boolean;
  cancelledByRuleId?: string;
  effectivePoints: number;
}

export interface Cancellation {
  cancellerRuleId: string;
  cancellerReason: LocaleText;
  cancelledRuleId: string;
  cancelledReason: LocaleText;
  source?: string;
}

export type MuhurtaGrade = 'excellent' | 'good' | 'fair' | 'marginal' | 'poor';

export interface WindowBreakdown {
  panchanga: number;
  graha: number;
  kaala: number;
  lagna: number;
  special: number;
  personal: number;
}

export interface EvaluationResult {
  score: number;
  rawScore: number;
  grade: MuhurtaGrade;
  breakdown: WindowBreakdown;
  assessments: ResolvedAssessment[];
  vetoes: RuleAssessment[];
  cancellations: Cancellation[];
  activeSpecialYogas: string[];
}

// Layer 3: Reasoning Types

export interface VerdictPoint {
  factor: LocaleText;
  assessment: LocaleText;
  source?: string;
  severity: AssessmentSeverity;
  cancelled?: boolean;
  cancelledBy?: string;
}

export interface MuhurtaVerdict {
  headline: LocaleText;
  grade: MuhurtaGrade;
  summary: LocaleText;
  strengths: VerdictPoint[];
  concerns: VerdictPoint[];
  mitigations: VerdictPoint[];
  recommendation: LocaleText;
}
