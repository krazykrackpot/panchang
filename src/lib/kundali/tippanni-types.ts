import type { Locale } from '@/types/panchang';
import type { DashaSynthesis } from '@/lib/tippanni/dasha-synthesis-types';

// ============================================================
// Classical References (RAG)
// ============================================================

export interface ClassicalCitation {
  textName: string;
  textFullName: string;
  chapter: number | null;
  verseRange: string;
  sanskritExcerpt: string | null;
  translationExcerpt: string;
  relevanceNote: string;
}

export interface ClassicalReferencesSection {
  summary: string;
  citations: ClassicalCitation[];
  confidence: 'high' | 'medium' | 'low';
}

// ============================================================
// Core Tippanni Types
// ============================================================

export interface PersonalitySection {
  lagna: InterpBlock;
  moonSign: InterpBlock;
  sunSign: InterpBlock;
  summary: string;
}

export interface InterpBlock {
  title: string;
  content: string;
  implications: string;
}

export interface PlanetInsight {
  planetId: number;
  planetName: string;
  planetColor: string;
  house: number;
  signName: string;
  description: string;
  implications: string;
  prognosis: string;
  dignity: string | null;
  retrogradeEffect: string | null;
  classicalReferences?: ClassicalReferencesSection | null;
}

export interface YogaInsight {
  name: string;
  present: boolean;
  type: string;
  description: string;
  implications: string;
  strength: 'Strong' | 'Moderate' | 'Weak';
  classicalReferences?: ClassicalReferencesSection | null;
}

export interface CancellationCondition {
  condition: string;
  met: boolean;
  source?: string; // BPHS chapter reference
}

export interface DoshaInsight {
  name: string;
  present: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  effectiveSeverity?: 'full' | 'partial' | 'cancelled';
  description: string;
  remedies: string;
  cancellationConditions?: CancellationCondition[];
  activeDasha?: string; // "This dosha activates during X Mahadasha"
  classicalReferences?: ClassicalReferencesSection | null;
}

export interface LifeArea {
  label: string;
  icon: string;
  rating: number;
  summary: string;
  details: string;
}

export interface LifeAreaSection {
  career: LifeArea;
  wealth: LifeArea;
  marriage: LifeArea;
  health: LifeArea;
  education: LifeArea;
}

export interface DashaInsightSection {
  currentMaha: string;
  currentMahaAnalysis: string;
  currentAntar: string;
  currentAntarAnalysis: string;
  upcoming: string;
  classicalReferences?: ClassicalReferencesSection | null;
}

export interface RemedyItem {
  name: string;
  planet: string;
  description: string;
}

export interface RemedySection {
  gemstones: RemedyItem[];
  mantras: RemedyItem[];
  practices: RemedyItem[];
}

export interface StrengthEntry {
  planetName: string;
  planetColor: string;
  strength: number;
  status: string;
}

export interface YearEvent {
  type: 'sade_sati' | 'jupiter_transit' | 'rahu_ketu' | 'dasha_transition';
  title: string;
  description: string;
  period: string;
  impact: 'favorable' | 'mixed' | 'challenging';
  remedies?: string;
}

export interface QuarterForecast {
  quarter: string;
  outlook: 'favorable' | 'mixed' | 'challenging';
  summary: string;
}

export interface YearPredictionSection {
  year: number;
  overview: string;
  events: YearEvent[];
  quarters: QuarterForecast[];
  keyAdvice: string;
}

export interface TippanniContent {
  yearPredictions: YearPredictionSection;
  personality: PersonalitySection;
  planetInsights: PlanetInsight[];
  yogas: YogaInsight[];
  doshas: DoshaInsight[];
  lifeAreas: LifeAreaSection;
  dashaInsight: DashaInsightSection;
  remedies: RemedySection;
  strengthOverview: StrengthEntry[];

  dashaSynthesis?: DashaSynthesis;

  // RAG metadata
  ragEnabled?: boolean;
  ragTimestamp?: string;
  ragError?: string | null;
}
