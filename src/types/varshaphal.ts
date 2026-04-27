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
  type: TajikaYogaType;
  planet1: LocaleText;
  planet2: LocaleText;
  favorable: boolean;
  description: LocaleText;
  /** Planet IDs (0-8) for the two planets involved */
  planet1Id?: number;
  planet2Id?: number;
  /** Angular orb of the aspect (degrees) */
  orb?: number;
  /** Strength score 0-100 computed from dignity, orb tightness, retrograde */
  strength?: number;
  /** Strength category derived from score */
  strengthLabel?: 'strong' | 'moderate' | 'weak';
  /** For Radda: which negative yoga this cancels */
  cancels?: string;
}

export type TajikaYogaType =
  | 'ithasala' | 'ishrafa' | 'easarapha' | 'nakta' | 'yamaya' | 'manau' | 'manahoo'
  | 'conjunction' | 'khallasara' | 'dutthottha'
  | 'ikkabal' | 'induvara' | 'tambira' | 'kuttha'
  | 'durupha' | 'radda' | 'kamboola' | 'gairi-kamboola' | 'muthashila';

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
  /** Monthly solar return charts (Maasaphal) — present when generated */
  maasaphal?: import('@/lib/varshaphal/maasaphal').MaasaphalChart[];
  /** Varshesha Dasha periods — present when generated */
  varsheshaDasha?: import('@/lib/varshaphal/varshesha-dasha').VarsheshaDashaPeriod[];
  /** Patyayini Dasha periods — present when generated */
  patyayiniDasha?: import('@/lib/varshaphal/patyayini-dasha').PatyayiniDashaPeriod[];
}
