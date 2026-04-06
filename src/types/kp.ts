import { Trilingual } from './panchang';
import { BirthData, PlanetPosition, HouseCusp, ChartData, DashaEntry } from './kundali';

export interface SubLordInfo {
  degree: number;
  signLord: { id: number; name: Trilingual };
  starLord: { id: number; name: Trilingual };
  subLord: { id: number; name: Trilingual };
  subSubLord: { id: number; name: Trilingual };
}

export interface CuspalSubLordAnalysis {
  house: number;
  subLordName: Trilingual;
  subSubLordName: Trilingual;
  signifiedHouses: number[];
  favorable: boolean;
  interpretation: Trilingual;
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
  ascSignLord: { id: number; name: Trilingual };
  ascStarLord: { id: number; name: Trilingual };
  moonSignLord: { id: number; name: Trilingual };
  moonStarLord: { id: number; name: Trilingual };
  dayLord: { id: number; name: Trilingual };
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
