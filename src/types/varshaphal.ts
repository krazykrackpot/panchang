import { Trilingual } from './panchang';
import { KundaliData, PlanetPosition } from './kundali';

export interface MunthaInfo {
  sign: number;
  signName: Trilingual;
  house: number;
  interpretation: Trilingual;
}

export interface SahamData {
  name: Trilingual;
  degree: number;
  sign: number;
  signName: Trilingual;
  house: number;
}

export interface TajikaYoga {
  name: Trilingual;
  type: 'ithasala' | 'ishrafa' | 'nakta' | 'yamaya' | 'manau' | 'conjunction';
  planet1: Trilingual;
  planet2: Trilingual;
  favorable: boolean;
  description: Trilingual;
}

export interface MuddaDashaPeriod {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  durationDays: number;
}

export interface VarsheshvaraInfo {
  planet: string;
  planetName: Trilingual;
  planetId: number;
  strength: number;
  description: Trilingual;
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
  yearSummary: Trilingual;
}
