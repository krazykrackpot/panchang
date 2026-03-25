import { Trilingual } from './panchang';

export interface InterpretationSection {
  title: Trilingual;
  content: Trilingual;
  importance: 'high' | 'medium' | 'low';
}

export interface YogaResult {
  name: Trilingual;
  type: 'raja' | 'dhana' | 'arishta' | 'special';
  present: boolean;
  description: Trilingual;
  planets: string[];
  strength: number; // 0-100
}

export interface DoshaResult {
  name: Trilingual;
  present: boolean;
  severity: 'mild' | 'moderate' | 'severe' | 'none';
  description: Trilingual;
  remedies: Trilingual[];
}

export interface LifeAreaAnalysis {
  area: Trilingual;
  icon: string;
  summary: Trilingual;
  details: InterpretationSection[];
  rating: number; // 1-10
}

export interface TippanniData {
  personality: {
    lagnaAnalysis: InterpretationSection;
    moonSignAnalysis: InterpretationSection;
    sunSignAnalysis: InterpretationSection;
    summary: Trilingual;
  };
  houseAnalysis: {
    house: number;
    name: Trilingual;
    signLord: Trilingual;
    planets: string[];
    interpretation: Trilingual;
  }[];
  yogas: YogaResult[];
  doshas: DoshaResult[];
  dashaAnalysis: {
    currentDasha: Trilingual;
    currentAnalysis: Trilingual;
    upcomingTransitions: { period: Trilingual; analysis: Trilingual }[];
  };
  lifeAreas: {
    career: LifeAreaAnalysis;
    wealth: LifeAreaAnalysis;
    marriage: LifeAreaAnalysis;
    health: LifeAreaAnalysis;
    education: LifeAreaAnalysis;
  };
  remedies: {
    gemstones: { name: Trilingual; planet: string; description: Trilingual }[];
    mantras: { text: Trilingual; planet: string; count: number }[];
    charities: { description: Trilingual; planet: string; day: Trilingual }[];
  };
}
