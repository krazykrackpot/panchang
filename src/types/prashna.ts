;
import type { LocaleText } from '@/types/panchang';
import { KundaliData } from './kundali';

export interface AshtamangalaObject {
  id: number;
  name: LocaleText;
  planetRuler: number; // planet id
  planetName: LocaleText;
  element: LocaleText;
  symbolism: LocaleText;
}

export interface PrashnaYoga {
  name: LocaleText;
  type: 'mrityu' | 'bandha' | 'subha' | 'asubha' | 'chandra';
  planets: LocaleText[];
  favorable: boolean;
  description: LocaleText;
}

export type QuestionCategory =
  | 'health' | 'wealth' | 'siblings' | 'property' | 'children' | 'enemies'
  | 'marriage' | 'longevity' | 'fortune' | 'career' | 'gains' | 'loss';

export interface PrashnaInterpretation {
  verdict: 'favorable' | 'unfavorable' | 'mixed';
  summary: LocaleText;
  timing: LocaleText;
  remedies: LocaleText[];
}

export interface AshtamangalaPrashnaData {
  numbers: [number, number, number];
  objects: [AshtamangalaObject, AshtamangalaObject, AshtamangalaObject];
  arudaHouses: [number, number, number];
  category: QuestionCategory;
  prashnaChart: KundaliData;
  yogas: PrashnaYoga[];
  interpretation: PrashnaInterpretation;
  castTime: string;
}
