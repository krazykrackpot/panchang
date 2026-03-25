import type { Locale } from '@/types/panchang';

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
}

export interface YogaInsight {
  name: string;
  present: boolean;
  type: string;
  description: string;
  implications: string;
  strength: 'Strong' | 'Moderate' | 'Weak';
}

export interface DoshaInsight {
  name: string;
  present: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  description: string;
  remedies: string;
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

export interface TippanniContent {
  personality: PersonalitySection;
  planetInsights: PlanetInsight[];
  yogas: YogaInsight[];
  doshas: DoshaInsight[];
  lifeAreas: LifeAreaSection;
  dashaInsight: DashaInsightSection;
  remedies: RemedySection;
  strengthOverview: StrengthEntry[];
}
