;
import type { LocaleText } from '@/types/panchang';
import { KundaliData, PlanetPosition } from './kundali';

export interface MunthaInfo {
  sign: number;
  signName: LocaleText;
  house: number;
  interpretation: LocaleText;
}

export interface SahamData {
  name: LocaleText;
  degree: number;
  sign: number;
  signName: LocaleText;
  house: number;
}

export interface TajikaYoga {
  name: LocaleText;
  type: 'ithasala' | 'ishrafa' | 'nakta' | 'yamaya' | 'manau' | 'conjunction' | 'khallasara' | 'dutthottha';
  planet1: LocaleText;
  planet2: LocaleText;
  favorable: boolean;
  description: LocaleText;
}

export interface MuddaDashaPeriod {
  planet: string;
  planetName: LocaleText;
  startDate: string;
  endDate: string;
  durationDays: number;
}

export interface VarsheshvaraInfo {
  planet: string;
  planetName: LocaleText;
  planetId: number;
  strength: number;
  description: LocaleText;
}

export interface VarshaphalData {
  natalData: KundaliData;
  solarReturnMoment: string; // ISO date-time
  solarReturnJD: number;
  year: number;
  age: number;
  chart: KundaliData;
  muntha: MunthaInfo;
  varsheshvara: VarsheshvaraInfo;
  sahams: SahamData[];
  tajikaYogas: TajikaYoga[];
  muddaDasha: MuddaDashaPeriod[];
  yearSummary: LocaleText;
}
