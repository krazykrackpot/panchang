import type { LocaleText } from '@/types/panchang';

export interface InterpretationSection {
  title: LocaleText;
  content: LocaleText;
  importance: 'high' | 'medium' | 'low';
}

export interface YogaResult {
  name: LocaleText;
  type: 'raja' | 'dhana' | 'arishta' | 'special';
  present: boolean;
  description: LocaleText;
  planets: string[];
  strength: number; // 0-100
}

export interface DoshaResult {
  name: LocaleText;
  present: boolean;
  severity: 'mild' | 'moderate' | 'severe' | 'none';
  description: LocaleText;
  remedies: LocaleText[];
}

export interface LifeAreaAnalysis {
  area: LocaleText;
  icon: string;
  summary: LocaleText;
  details: InterpretationSection[];
  rating: number; // 1-10
}

export interface TippanniData {
  personality: {
    lagnaAnalysis: InterpretationSection;
    moonSignAnalysis: InterpretationSection;
    sunSignAnalysis: InterpretationSection;
    summary: LocaleText;
  };
  houseAnalysis: {
    house: number;
    name: LocaleText;
    signLord: LocaleText;
    planets: string[];
    interpretation: LocaleText;
  }[];
  yogas: YogaResult[];
  doshas: DoshaResult[];
  dashaAnalysis: {
    currentDasha: LocaleText;
    currentAnalysis: LocaleText;
    upcomingTransitions: { period: LocaleText; analysis: LocaleText }[];
  };
  lifeAreas: {
    career: LifeAreaAnalysis;
    wealth: LifeAreaAnalysis;
    marriage: LifeAreaAnalysis;
    health: LifeAreaAnalysis;
    education: LifeAreaAnalysis;
  };
  remedies: {
    gemstones: { name: LocaleText; planet: string; description: LocaleText }[];
    mantras: { text: LocaleText; planet: string; count: number }[];
    charities: { description: LocaleText; planet: string; day: LocaleText }[];
  };
}
