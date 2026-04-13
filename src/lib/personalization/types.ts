import type { LocaleText,} from '@/types/panchang';

export interface PersonalizedDay {
  // Tara Bala
  taraBala: {
    taraNumber: number;        // 1-9
    taraName: LocaleText;
    isFavorable: boolean;
    description: LocaleText;
  };
  // Chandra Bala
  chandraBala: {
    houseFromMoon: number;     // 1-12
    isFavorable: boolean;
    description: LocaleText;
  };
  // Day quality
  dayQuality: 'excellent' | 'good' | 'neutral' | 'caution' | 'challenging';
  dayQualityDescription: LocaleText;

  // Current dasha
  currentDasha: {
    maha: { planet: string; planetName: LocaleText; startDate: string; endDate: string };
    antar?: { planet: string; planetName: LocaleText; startDate: string; endDate: string };
  } | null;

  // Transit alerts
  transitAlerts: TransitAlert[];
}

export interface TransitAlert {
  type: 'sade_sati' | 'jupiter_transit' | 'rahu_ketu_transit' | 'retrograde' | 'planet_return';
  severity: 'info' | 'notable' | 'significant';
  planet: string;
  description: LocaleText;
}

export interface UserSnapshot {
  moonSign: number;
  moonNakshatra: number;
  moonNakshatraPada: number;
  sunSign: number;
  ascendantSign: number;
  planetPositions: unknown[];
  dashaTimeline: unknown[];
  sadeSati: unknown;
}
