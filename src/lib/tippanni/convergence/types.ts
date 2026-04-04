// src/lib/tippanni/convergence/types.ts

import type { Trilingual } from '@/types/panchang';

// ─── Enums ───────────────────────────────────────────────────────────────────

export type PatternTheme = 'career' | 'relationship' | 'wealth' | 'health' | 'spiritual' | 'family';
export type Significance = 1 | 2 | 3 | 4 | 5;
export type Tone = 'growth' | 'pressure' | 'transformation' | 'quiet' | 'mixed';
export type TemporalFrame = 'lifetime' | 'multi-year' | 'this-year' | 'this-month';
export type FlagIcon = 'warning' | 'opportunity' | 'transition';
export type FlagSeverity = 1 | 2 | 3;

export enum TippanniSection {
  Personality = 'personality',
  PlanetInsights = 'planet-insights',
  Yogas = 'yogas',
  Doshas = 'doshas',
  LifeAreas = 'life-areas',
  DashaSynthesis = 'dasha-synthesis',
  Strength = 'strength',
  YearPredictions = 'year-predictions',
}

// ─── Input ───────────────────────────────────────────────────────────────────

export interface RelationshipMap {
  houseRulers: Record<number, number>;
  planetHouses: Record<number, number>;
  planetSigns: Record<number, number>;
  transitHouses: Record<number, number>;
  dashaLord: number;
  antarLord: number;
}

export interface ConvergenceInput {
  ascendant: number;
  moonSign: number;
  planets: {
    id: number;
    house: number;
    sign: number;
    isRetrograde: boolean;
    isCombust: boolean;
    isExalted: boolean;
    isDebilitated: boolean;
    isOwnSign: boolean;
    shadbala: number;
  }[];
  houses: { house: number; sign: number; lordId: number }[];
  dashaLord: number;
  antarLord: number;
  yogaIds: string[];
  doshaIds: string[];
  transits: { planetId: number; sign: number; isRetrograde: boolean }[];
  ashtakavargaSAV: number[];
  ashtakavargaBPI: number[][];
  relationships: RelationshipMap;
  dashaTransitionWithin6Months: boolean;
  navamshaConfirmations: Record<string, boolean>;
}

// ─── Pattern Conditions ──────────────────────────────────────────────────────

export type PlanetFilter = number | 'malefic' | 'benefic' | 'any';

export type PatternCondition =
  | { type: 'natal'; check: 'planet-in-house'; planet: PlanetFilter; house: number; weight?: number }
  | { type: 'natal'; check: 'lord-strong'; house: number; weight?: number }
  | { type: 'natal'; check: 'lord-afflicted'; house: number; weight?: number }
  | { type: 'natal'; check: 'yoga-present'; yogaId: string; weight?: number }
  | { type: 'natal'; check: 'dosha-present'; doshaId: string; weight?: number }
  | { type: 'natal'; check: 'benefic-aspect-to-house'; house: number; weight?: number }
  | { type: 'transit'; check: 'planet-in-house-from-moon'; planet: number; house: number; weight?: number }
  | { type: 'dasha'; check: 'lord-rules-or-occupies'; house: number; weight?: number }
  | { type: 'dasha'; check: 'lord-is-planet'; planet: number; weight?: number }
  | { type: 'retro'; check: 'planet-retrograde'; planet: number; weight?: number }
  | { type: 'combust'; check: 'planet-combust'; planet: number; weight?: number };

// ─── Pattern Definition ──────────────────────────────────────────────────────

export interface ConvergencePattern {
  id: string;
  theme: PatternTheme;
  significance: Significance;
  conditions: PatternCondition[];
  mutuallyExclusive?: string[];
  text: {
    full: { en: string; hi: string };
    mild: { en: string; hi: string };
  };
  advice: { en: string; hi: string };
  laypersonNote: { en: string; hi: string };
  relatedSections: TippanniSection[];
}

// ─── Matched Pattern ─────────────────────────────────────────────────────────

export interface MatchedPattern {
  patternId: string;
  theme: PatternTheme;
  matchCount: number;
  totalConditions: number;
  isFullMatch: boolean;
  finalScore: number;
  text: { en: string; hi: string };
  advice: { en: string; hi: string };
  laypersonNote: { en: string; hi: string };
  relatedSections: TippanniSection[];
}

// ─── Meta-Interaction ────────────────────────────────────────────────────────

export interface MetaRule {
  id: string;
  trigger: (patterns: MatchedPattern[], input: ConvergenceInput) => boolean;
  generate: (patterns: MatchedPattern[], input: ConvergenceInput, locale: 'en' | 'hi') => MetaInsight | null;
}

export interface MetaInsight {
  ruleId: string;
  text: { en: string; hi: string };
  severity: FlagSeverity;
}

// ─── Output ──────────────────────────────────────────────────────────────────

export interface ExecutiveInsight {
  theme: string;
  themeIcon: PatternTheme;
  summary: { en: string; hi: string };
  laypersonNote: { en: string; hi: string };
  temporalFrame: TemporalFrame;
  matchCount: string;
  relatedPatterns: string[];
  expandedDetail: { en: string; hi: string };
  advice: { en: string; hi: string };
}

export interface UrgentFlag {
  severity: FlagSeverity;
  icon: FlagIcon;
  message: { en: string; hi: string };
  expiresAt: string;
  relatedPatterns: string[];
}

export interface TransitInsight {
  planetId: number;
  transitSign: number;
  houseFromMoon: number;
  isRetrograde: boolean;
  ashtakavargaBindus: number;
  effect: { en: string; hi: string };
}

export interface AshtakHighlight {
  planetId: number;
  sign: number;
  bindus: number;
  text: { en: string; hi: string };
}

export interface ConvergenceResult {
  version: string;
  computedAt: string;

  executive: {
    activation: number;
    favorability: number;
    tone: Tone;
    insights: ExecutiveInsight[];
    urgentFlags: UrgentFlag[];
    metaInsights: MetaInsight[];
  };

  patterns: MatchedPattern[];
  sectionMarkers: Partial<Record<TippanniSection, string[]>>;

  transitOverlay: {
    snapshot: TransitInsight[];
    retroStatus: { planetId: number; effect: { en: string; hi: string } }[];
    combustStatus: { planetId: number; effect: { en: string; hi: string } }[];
    ashtakavargaHighlights: AshtakHighlight[];
  };
}

export const CONVERGENCE_VERSION = '1.0.0';
