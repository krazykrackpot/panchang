import { Trilingual } from './panchang';
import { KundaliData } from './kundali';

export interface AshtamangalaObject {
  id: number;
  name: Trilingual;
  planetRuler: number; // planet id
  planetName: Trilingual;
  element: Trilingual;
  symbolism: Trilingual;
}

export interface PrashnaYoga {
  name: Trilingual;
  type: 'mrityu' | 'bandha' | 'subha' | 'asubha' | 'chandra';
  planets: Trilingual[];
  favorable: boolean;
  description: Trilingual;
}

export type QuestionCategory =
  | 'health' | 'wealth' | 'siblings' | 'property' | 'children' | 'enemies'
  | 'marriage' | 'longevity' | 'fortune' | 'career' | 'gains' | 'loss';

export interface PrashnaInterpretation {
  verdict: 'favorable' | 'unfavorable' | 'mixed';
  summary: Trilingual;
  timing: Trilingual;
  remedies: Trilingual[];
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
