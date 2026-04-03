/**
 * Dasha Synthesis Types — 3-level period analysis (Maha → Antar → Pratyantar)
 * Combines yogas, doshas, transits, house activations, and divisional charts
 * into a coherent period-by-period forecast.
 */

import type { Trilingual } from '@/types/panchang';

export type PeriodAssessment = 'very_favorable' | 'favorable' | 'mixed' | 'challenging' | 'difficult';

export interface DashaSynthesis {
  lifetimeSummary: MahadashaOverview[];
  currentMaha: MahadashaSynthesis | null;
}

export interface MahadashaOverview {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  years: number;
  isCurrent: boolean;
  isPast: boolean;
  theme: string;
}

export interface MahadashaSynthesis {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  years: number;
  overview: string;
  yogasActivated: { name: string; type: string; effect: string }[];
  doshasActivated: { name: string; severity: string; effect: string }[];
  divisionalInsights: { D1: string; D9: string; D10: string; D2: string };
  antardashas: AntardashaSynthesis[];
}

export interface AntardashaSynthesis {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  durationMonths: number;
  isCurrent: boolean;
  lordAnalysis: string;
  interaction: string;
  yogasTriggered: string[];
  doshasTriggered: string[];
  housesActivated: { house: number; theme: string }[];
  transitContext: string;
  lifeAreas: { career: string; relationships: string; health: string; finance: string; spirituality: string };
  divisionalInsights: { D1: string; D9: string; D10: string; D2: string };
  netAssessment: PeriodAssessment;
  summary: string;
  advice: string;
  keyDates: string[];
  pratyantardashas: PratyantardashaSynthesis[];
}

export interface PratyantardashaSynthesis {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  durationDays: number;
  isCritical: boolean;
  netAssessment: PeriodAssessment;
  keyTheme: string;
  advice: string;
  expanded?: {
    lordAnalysis: string;
    divisionalInsights: { D1: string; D9?: string; D10?: string };
    warning?: string;
  };
}
