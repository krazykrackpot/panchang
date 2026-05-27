// src/lib/kundali/health-diagnosis/types.ts
import type { LocaleText } from '@/types/panchang';
import type { ScoringFactor, Rating } from '@/lib/kundali/domain-synthesis/types';
import type { PrakritiResult } from '@/lib/medical/prakriti';
import type { BodyRegionResult } from '@/lib/medical/body-map';
import type { DiseaseProfileResult } from '@/lib/medical/disease-profile';
import type { HealthWindow } from '@/lib/medical/health-timeline';

export type ElementId =
  | 'vitality' | 'mental' | 'digestive' | 'cardiac' | 'respiratory'
  | 'nervous' | 'skeletal' | 'muscular' | 'skin' | 'eyes'
  | 'reproductive' | 'endocrine' | 'immunity' | 'chronic'
  | 'accidents' | 'surgery' | 'psychiatric' | 'addictions' | 'sleep'
  | 'allergies' | 'cancer' | 'longevity';

export type ElementCategory = 'physical' | 'mental' | 'systemic' | 'longevity';
export type ElementBadge = 'classical' | 'inferential' | 'mixed';

export interface ElementSignificators {
  /** Planet IDs (0=Sun..8=Ketu) that primarily score this element. */
  planets: number[];
  /** House numbers (1-12) that primarily score this element. */
  houses: number[];
  /** Sign IDs (1-12) that contextually matter. May be empty. */
  signs?: number[];
}

export interface ElementMetadata {
  id: ElementId;
  name: LocaleText;
  category: ElementCategory;
  badge: ElementBadge;
  defaultVisible: boolean;       // false → opt-in (extended) only
  requiresDisclaimer: boolean;   // 4.17, 4.21, 4.22 → true
  primarySignificators: ElementSignificators;
  /** Citation codes, e.g. ['BPHS-24', 'Saravali-5'] */
  sources: string[];
}

export interface ClassicalSignature {
  id: string;
  name: LocaleText;
  source: string;
}

export interface NatalElement {
  id: ElementId;
  name: LocaleText;
  category: ElementCategory;
  badge: ElementBadge;
  natalScore: number;            // 0–100 vulnerability
  rating: Rating;
  factors: ScoringFactor[];
  classicalSignatures: ClassicalSignature[];
  requiresDisclaimer: boolean;
}

export interface ElementMultipliers {
  dashaContribution: number;     // [0, 0.5]
  transitContribution: number;   // [0, 0.5], includes Sade Sati component
  sadeSatiActive: boolean;
  lifeStageGate: number;         // [0.5, 1.5]
}

export interface DisplayedElement {
  id: ElementId;
  /** Score with Layer 3 applied, clamped to [0, 100] for UI. */
  displayedScore: number;
  trend: 'improving' | 'stable' | 'worsening';
  nextInflectionDate: string | null;  // ISO date or null
}

/**
 * Internal extension of DisplayedElement that carries the unclamped score
 * used by the Layer 3 engine for trend / inflection comparison.
 * NOT part of the public HealthDiagnosis contract — do not include in
 * the returned `displayedElements` array.
 *
 * The engine computes this internally, uses it for delta math, then
 * strips it to produce the public DisplayedElement.
 */
export interface InternalDisplayedElement extends DisplayedElement {
  /** Score before [0, 100] clamping. May exceed 100. Used for trend computation. */
  unclampedScore: number;
}

export interface DisclaimerEntry {
  scope: ElementId[];
  text: LocaleText;
}

export interface HealthDiagnosis {
  natalElements: NatalElement[];
  prakriti: PrakritiResult;
  modeNote: LocaleText;
  currentMultipliers: Record<ElementId, ElementMultipliers>;
  displayedElements: DisplayedElement[];
  overall: { rating: Rating; summary: LocaleText };
  bodyMap: BodyRegionResult[];
  diseaseProfile: DiseaseProfileResult;
  timeline: HealthWindow[];
  disclaimers: DisclaimerEntry[];
  optedInToExtended: boolean;
  hiddenElements: ElementId[];
}

export interface HealthDiagnosisOptions {
  /** When true, includes allergies + cancer + longevity in natalElements. */
  extended?: boolean;
  /** Reference date for Layer 3 activation. Defaults to now. */
  today?: Date;
  /** User age in years; used for life-stage gating. If omitted, treat as adult (1.0 gate). */
  age?: number;
  /** User gender for §4.10 Eyes laterality interpretation. Optional. */
  gender?: 'male' | 'female' | 'other' | undefined;
}
