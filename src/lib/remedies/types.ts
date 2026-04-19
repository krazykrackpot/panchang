import type { LocaleText } from '@/types/panchang';

export interface GemstoneData {
  name: LocaleText;
  sanskritName: string;
  color: string;
  associatedPlanetId: number;
  caratRange: string;
}

export interface MantraData {
  vedic: string;           // Sanskrit text
  beejMantra: string;      // Seed syllable
  recitationCount: number;
  bestDay: string;         // weekday
}

export interface WearingRules {
  finger: LocaleText;
  hand: 'right' | 'left';
  metal: LocaleText;
  minimumCarat: number;
  bestDay: string;
  activationMantra: string;
}

export interface GemstoneRecommendation {
  planetId: number;
  planetName: LocaleText;
  needLevel: 'critical' | 'recommended' | 'optional' | 'not_needed';
  needScore: number;          // 0-100
  reasons: string[];
  gemstone: {
    primary: GemstoneData;
    alternatives: GemstoneData[];
  };
  mantra: MantraData;
  wearingRules: WearingRules;
  donation: {
    items: string[];
    bestDay: string;
  };
  cautions: string[];
}
