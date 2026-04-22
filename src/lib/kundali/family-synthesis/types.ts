/**
 * Family Synthesis Types
 *
 * Cross-chart relationship analysis for Marriage and Children domains.
 * These types are consumed by the family-synthesis engine modules and
 * the dashboard FamilyCard components.
 */

import type { KundaliData } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Input context
// ---------------------------------------------------------------------------

export interface FamilyContext {
  spouse?: FamilyMember;
  children: FamilyMember[];
}

export interface FamilyMember {
  chartId: string;
  kundali: KundaliData;
  name: string;
  birthOrder?: number;
}

// ---------------------------------------------------------------------------
// Cross-chart analysis results
// ---------------------------------------------------------------------------

export interface SynastryHighlight {
  yourPlanet: string;
  theirPlanet: string;
  aspect: string;
  orb: number;
  nature: 'harmonious' | 'challenging' | 'transformative';
  interpretation: LocaleText;
}

export interface VargaCrossRead {
  vargaType: 'D9' | 'D7';
  compatibility: number;
  narrative: LocaleText;
}

export interface KarmicIndicator {
  type: 'nodal_contact' | 'saturn_aspect' | 'rahu_ketu_axis';
  description: LocaleText;
  strength: number;
}

export interface GunaBreakdown {
  varna: number;
  vashya: number;
  tara: number;
  yoni: number;
  grahaMaitri: number;
  gana: number;
  bhakut: number;
  nadi: number;
}

// ---------------------------------------------------------------------------
// Temporal dynamics
// ---------------------------------------------------------------------------

export interface TransitHit {
  planet: string;
  house: number;
  sign: string;
  effect: LocaleText;
}

export interface TransitRelationshipImpact {
  overallTone: 'supportive' | 'challenging' | 'mixed' | 'neutral';
  yourTransits: TransitHit[];
  theirTransits: TransitHit[];
  narrative: LocaleText;
}

export interface DashaSyncAnalysis {
  inSync: boolean;
  yourDasha: string;
  theirDasha: string;
  yourActivation: string[];
  theirActivation: string[];
  narrative: LocaleText;
}

export interface RelationshipWindow {
  startDate: string;
  endDate: string;
  type: 'bonding' | 'growth' | 'challenge' | 'milestone';
  description: LocaleText;
}

export interface StressPeriod {
  startDate: string;
  endDate: string;
  trigger: string;
  severity: 'mild' | 'moderate' | 'intense';
  guidance: LocaleText;
}

// ---------------------------------------------------------------------------
// Actionable guidance
// ---------------------------------------------------------------------------

export interface ActionItem {
  type: 'do' | 'avoid' | 'watch';
  text: LocaleText;
  timing?: string;
  relevance: number;
}

// ---------------------------------------------------------------------------
// Relationship dynamics (the overlay on a domain)
// ---------------------------------------------------------------------------

export interface RelationshipDynamics {
  synastryHighlights: SynastryHighlight[];
  gunaScore?: number;
  gunaBreakdown?: GunaBreakdown;
  vargaCrossRead: VargaCrossRead;
  karmicIndicators: KarmicIndicator[];
  karakaAnalysis: LocaleText;

  transitImpact: TransitRelationshipImpact;
  dashaSynchronicity: DashaSyncAnalysis;
  upcomingWindows: RelationshipWindow[];
  stressPeriods: StressPeriod[];

  currentDynamic: LocaleText;
  actionItems: ActionItem[];
  monthlyForecast: LocaleText;
}

// ---------------------------------------------------------------------------
// Full family reading payload (cached in family_readings table)
// ---------------------------------------------------------------------------

export interface ChildDynamics {
  childName: string;
  chartId: string;
  dynamics: RelationshipDynamics;
}

export interface FamilyReading {
  marriageDynamics: RelationshipDynamics | null;
  childrenDynamics: ChildDynamics[];
  familySummary: LocaleText;
  computedAt: string;
}
