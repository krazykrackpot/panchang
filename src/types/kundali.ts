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
  dashas: DashaEntry[];
  shadbala: ShadBala[];
  ayanamshaValue: number;
  julianDay: number;
}

export type ChartStyle = 'north' | 'south';
