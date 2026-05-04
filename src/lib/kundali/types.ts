import type { PlanetId } from '../astronomy/planets';
import type { AyanamshaType as AyanamsaType } from '../ephem/astronomical';

export type GrahaId = 'sun' | 'moon' | PlanetId;

export interface GrahaPosition {
  id: GrahaId;
  name: string;
  longitude: number;      // Sidereal longitude
  signIndex: number;      // 0-11 (Aries=0)
  sign: string;           // Sign name
  signSanskrit: string;
  degreeInSign: number;   // 0-30
  nakshatra: string;
  nakshatraIndex: number; // 0-26
  pada: number;           // 1-4
  house: number;          // 1-12
  isRetrograde: boolean;
  symbol: string;
}

export interface HouseData {
  number: number;        // 1-12
  sign: string;
  signIndex: number;
  planets: GrahaId[];
}

export interface DashaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  years: number;
  subPeriods?: DashaPeriod[];
}

export interface YogaDetection {
  name: string;
  type: 'Raja' | 'Dhana' | 'Arishta' | 'Pancha Mahapurusha' | 'Other';
  description: string;
  strength: 'Strong' | 'Moderate' | 'Weak';
}

export interface KundaliData {
  birthDetails: {
    date: Date;
    time: string;
    place: string;
    latitude: number;
    longitude: number;
    timezone: number;
  };
  ayanamsa: number;
  ayanamsaType: AyanamsaType;
  ascendant: {
    longitude: number;
    signIndex: number;
    sign: string;
    degreeInSign: number;
  };
  grahas: GrahaPosition[];
  houses: HouseData[];
  dashas: DashaPeriod[];
  yogas: YogaDetection[];
  navamsaHouses: HouseData[];
}

export const GRAHA_NAMES: Record<GrahaId, string> = {
  sun: 'Sun',
  moon: 'Moon',
  mars: 'Mars',
  mercury: 'Mercury',
  jupiter: 'Jupiter',
  venus: 'Venus',
  saturn: 'Saturn',
  rahu: 'Rahu',
  ketu: 'Ketu',
};

export const GRAHA_SANSKRIT: Record<GrahaId, string> = {
  sun: 'Surya',
  moon: 'Chandra',
  mars: 'Mangal',
  mercury: 'Budh',
  jupiter: 'Guru',
  venus: 'Shukra',
  saturn: 'Shani',
  rahu: 'Rahu',
  ketu: 'Ketu',
};

export const GRAHA_SYMBOLS: Record<GrahaId, string> = {
  sun: 'Su',
  moon: 'Mo',
  mars: 'Ma',
  mercury: 'Me',
  jupiter: 'Ju',
  venus: 'Ve',
  saturn: 'Sa',
  rahu: 'Ra',
  ketu: 'Ke',
};
