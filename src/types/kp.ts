;
import type { LocaleText } from '@/types/panchang';
import { BirthData, PlanetPosition, HouseCusp, ChartData, DashaEntry } from './kundali';

export interface SubLordInfo {
  degree: number;
  signLord: { id: number; name: LocaleText };
  starLord: { id: number; name: LocaleText };
  subLord: { id: number; name: LocaleText };
  subSubLord: { id: number; name: LocaleText };
}

export interface CuspalSubLordAnalysis {
  house: number;
  subLordName: LocaleText;
  subSubLordName: LocaleText;
  signifiedHouses: number[];
  favorable: boolean;
  interpretation: LocaleText;
}

export interface KPCusp extends HouseCusp {
  subLordInfo: SubLordInfo;
}

export interface KPPlanet extends PlanetPosition {
  subLordInfo: SubLordInfo;
}

export interface SignificatorEntry {
  house: number;
  level1: number[]; // planet ids in star of occupants
  level2: number[]; // planet ids occupying the house
  level3: number[]; // planet ids in star of house lord
  level4: number[]; // house lord
  combined: number[];
}

export interface RulingPlanets {
  ascSignLord: { id: number; name: LocaleText };
  ascStarLord: { id: number; name: LocaleText };
  moonSignLord: { id: number; name: LocaleText };
  moonStarLord: { id: number; name: LocaleText };
  dayLord: { id: number; name: LocaleText };
}

export interface KPChartData {
  birthData: BirthData;
  cusps: KPCusp[];
  planets: KPPlanet[];
  significators: SignificatorEntry[];
  cuspalAnalysis: CuspalSubLordAnalysis[];
  rulingPlanets: RulingPlanets;
  chart: ChartData;
  ayanamshaValue: number;
  julianDay: number;
}
