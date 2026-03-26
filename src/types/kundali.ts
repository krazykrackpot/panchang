import { Graha, Nakshatra, Rashi, Trilingual } from './panchang';

export interface BirthData {
  name: string;
  date: string; // ISO date
  time: string; // HH:mm
  place: string;
  lat: number;
  lng: number;
  timezone: string;
  ayanamsha: 'lahiri' | 'raman' | 'kp';
}

export interface HouseCusp {
  house: number;
  degree: number;
  sign: number;
  signName: Trilingual;
  lord: string;
  lordName: Trilingual;
}

export interface PlanetPosition {
  planet: Graha;
  longitude: number;
  latitude: number;
  speed: number;
  sign: number;
  signName: Trilingual;
  house: number;
  nakshatra: Nakshatra;
  pada: number;
  degree: string; // formatted DD°MM'SS"
  isRetrograde: boolean;
  isCombust: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  isOwnSign: boolean;
}

export interface DashaEntry {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  level: 'maha' | 'antar' | 'pratyantar';
  subPeriods?: DashaEntry[];
}

export interface ShadBala {
  planet: string;
  planetName: Trilingual;
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
  ascendant: { degree: number; sign: number; signName: Trilingual };
  planets: PlanetPosition[];
  houses: HouseCusp[];
  chart: ChartData;
  navamshaChart: ChartData;
  bhavChalitChart?: ChartData;
  divisionalCharts?: Record<string, DivisionalChart>;
  ashtakavarga?: AshtakavargaData;
  dashas: DashaEntry[];
  shadbala: ShadBala[];
  ayanamshaValue: number;
  julianDay: number;
}

export interface DivisionalChart extends ChartData {
  division: string; // 'D1' | 'D3' | 'D9' | 'D10' | 'D12' | 'bhav_chalit'
  label: { en: string; hi: string; sa: string };
}

export interface AshtakavargaData {
  bpiTable: number[][]; // 7 planets x 12 signs — Bhinnashtakavarga (0-8 per cell)
  savTable: number[];   // 12 signs — Sarvashtakavarga (sum of all planets per sign)
  planetNames: string[];
}

export type ChartStyle = 'north' | 'south';
