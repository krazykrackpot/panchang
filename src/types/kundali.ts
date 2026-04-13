import type { LocaleText } from '@/types/panchang';
import { Graha, Nakshatra, Rashi } from './panchang';

export interface BirthData {
  name: string;
  date: string; // ISO date
  time: string; // HH:mm
  place: string;
  lat: number;
  lng: number;
  timezone: string;
  ayanamsha: string; // AyanamshaType from astronomical.ts
}

export interface HouseCusp {
  house: number;
  degree: number;
  sign: number;
  signName: LocaleText;
  lord: string;
  lordName: LocaleText;
}

export interface PlanetPosition {
  planet: Graha;
  longitude: number;
  latitude: number;
  speed: number;
  sign: number;
  signName: LocaleText;
  house: number;
  nakshatra: Nakshatra;
  pada: number;
  degree: string; // formatted DD°MM'SS"
  isRetrograde: boolean;
  isCombust: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  isOwnSign: boolean;
  isVargottama?: boolean;
  isMrityuBhaga?: boolean;
  isPushkarNavamsha?: boolean;
  isPushkarBhaga?: boolean;
}

export interface BhriguBindu {
  longitude: number;  // sidereal 0-360
  sign: number;       // 1-12
  degree: string;     // formatted
}

export interface DashaEntry {
  planet: string;
  planetName: LocaleText;
  startDate: string;
  endDate: string;
  level: 'maha' | 'antar' | 'pratyantar';
  subPeriods?: DashaEntry[];
}

export interface ShadBala {
  planet: string;
  planetName: LocaleText;
  totalStrength: number;
  sthanaBala: number;
  digBala: number;
  kalaBala: number;
  cheshtaBala: number;
  naisargikaBala: number;
  drikBala: number;
}

export interface ChartData {
  houses: number[][]; // house index -> planet ids in that house
  ascendantDeg: number;
  ascendantSign: number;
}

export interface KundaliData {
  birthData: BirthData;
  ascendant: { degree: number; sign: number; signName: LocaleText };
  planets: PlanetPosition[];
  houses: HouseCusp[];
  chart: ChartData;
  navamshaChart: ChartData;
  bhavChalitChart?: ChartData;
  divisionalCharts?: Record<string, DivisionalChart>;
  ashtakavarga?: AshtakavargaData;
  dashas: DashaEntry[];
  yoginiDashas?: DashaEntry[];
  ashtottariDashas?: DashaEntry[];
  shadbala: ShadBala[];
  ayanamshaValue: number;
  julianDay: number;
  // Extended data for new tabs
  grahaDetails?: GrahaDetail[];
  upagrahas?: UpagrahaPosition[];
  fullShadbala?: import('@/lib/kundali/shadbala').ShadBalaComplete[];
  bhavabala?: import('@/lib/kundali/bhavabala').BhavaBalaResult[];
  yogasComplete?: import('@/lib/kundali/yogas-complete').YogaComplete[];
  vimshopakaBala?: import('@/lib/kundali/vimshopaka').VimshopakaBala[];
  specialLagnas?: import('@/lib/kundali/special-lagnas').SpecialLagnas;
  narayanaDasha?: import('@/lib/kundali/additional-dashas').RasiDashaEntry[];
  shoolaDasha?: import('@/lib/kundali/additional-dashas').RasiDashaEntry[];
  sthiraDasha?: import('@/lib/kundali/additional-dashas').RasiDashaEntry[];
  kalachakraDasha?: import('@/lib/kundali/additional-dashas').RasiDashaEntry[];
  sudarsanaDasha?: import('@/lib/kundali/additional-dashas').SudarsanaDashaEntry[];
  shodasottariDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  dwadasottariDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  panchottariDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  satabdikaDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  chaturaaseethiDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  shashtihayaniDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  mandookaDasha?: import('@/lib/kundali/additional-dashas').RasiDashaEntry[];
  drigDasha?: import('@/lib/kundali/additional-dashas').RasiDashaEntry[];
  moolaDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  navamshaDasha?: import('@/lib/kundali/additional-dashas').RasiDashaEntry[];
  naisargikaDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  taraDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  tithiAshtottariDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  yogaVimsottariDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  buddhiGathiDasha?: import('@/lib/kundali/additional-dashas').GrahaDashaEntry[];
  sadeSati?: import('@/lib/kundali/sade-sati-analysis').SadeSatiAnalysis;
  avasthas?: import('@/lib/kundali/avasthas').PlanetAvasthas[];
  argala?: import('@/lib/kundali/argala').ArgalaResult[];
  sphutas?: import('@/lib/kundali/sphutas').SphuataResults;
  warnings?: string[];
  bhriguBindu?: BhriguBindu;
  grahaYuddha?: import('@/lib/kundali/graha-yuddha').GrahaYuddhaResult[];
  functionalNature?: import('@/lib/kundali/functional-nature').FunctionalNatureResult;
  jaimini?: {
    charaKarakas: { planet: number; planetName: LocaleText; karaka: string; karakaName: LocaleText; degree: number }[];
    karakamsha: { sign: number; signName: LocaleText };
    arudhaPadas: { house: number; sign: number; signName: LocaleText; label: LocaleText }[];
    charaDasha: { sign: number; signName: LocaleText; years: number; startDate: string; endDate: string }[];
    grahaArudhas?: { planetId: number; planetName: LocaleText; arudhaSign: number; arudhaSignName: LocaleText }[];
    rajayogas?: import('@/lib/jaimini/jaimini-calc').JaiminiRajayoga[];
  };
}

export interface DivisionalChart extends ChartData {
  division: string;
  label: LocaleText;
  meaning?: LocaleText;
}

export interface AshtakavargaData {
  bpiTable: number[][]; // 7 planets x 12 signs — Bhinnashtakavarga (0-8 per cell)
  savTable: number[];   // 12 signs — Sarvashtakavarga (sum of all planets per sign)
  planetNames: string[];
}

export type ChartStyle = 'north' | 'south';

// Extended types for new tabs
export type { ShadBalaComplete } from '@/lib/kundali/shadbala';
export type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
export type { YogaComplete } from '@/lib/kundali/yogas-complete';

export interface GrahaDetail {
  planetId: number;
  planetName: LocaleText;
  isRetrograde: boolean;
  isCombust: boolean;
  longitude: number;
  signDegree: string;
  sign: number;
  signName: LocaleText;
  nakshatra: number;
  nakshatraName: LocaleText;
  nakshatraLord: LocaleText;
  nakshatraPada: number;
  latitude: number;
  rightAscension: number;
  declination: number;
  speed: number;
}

export interface UpagrahaPosition {
  name: LocaleText;
  longitude: number;
  sign: number;
  signName: LocaleText;
  degree: string;
  nakshatra: LocaleText;
}
