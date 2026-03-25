export interface Trilingual {
  en: string;
  hi: string;
  sa: string;
}

export type Locale = 'en' | 'hi' | 'sa';

export interface Tithi {
  number: number;
  name: Trilingual;
  paksha: 'shukla' | 'krishna';
  deity: Trilingual;
  endTime?: Date;
}

export interface Nakshatra {
  id: number;
  name: Trilingual;
  deity: Trilingual;
  ruler: string;
  rulerName: Trilingual;
  startDeg: number;
  endDeg: number;
  pada?: number;
  symbol: string;
  nature: Trilingual;
}

export interface Yoga {
  number: number;
  name: Trilingual;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  meaning: Trilingual;
}

export interface Karana {
  number: number;
  name: Trilingual;
  type: 'chara' | 'sthira' | 'special';
}

export interface Rashi {
  id: number;
  name: Trilingual;
  symbol: string;
  element: Trilingual;
  ruler: string;
  rulerName: Trilingual;
  startDeg: number;
  endDeg: number;
  quality: Trilingual;
}

export interface Graha {
  id: number;
  name: Trilingual;
  symbol: string;
  color: string;
  longitude?: number;
  latitude?: number;
  speed?: number;
  rashi?: number;
  nakshatra?: number;
  isRetrograde?: boolean;
}

export interface PanchangData {
  date: string;
  location: { lat: number; lng: number; name: string };
  tithi: Tithi;
  nakshatra: Nakshatra;
  yoga: Yoga;
  karana: Karana;
  vara: { day: number; name: Trilingual; ruler: Trilingual };
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rahuKaal: { start: string; end: string };
  yamaganda: { start: string; end: string };
  gulikaKaal: { start: string; end: string };
  muhurtas: Muhurta[];
  abhijitMuhurta: { start: string; end: string };
  planets: Graha[];
  masa: Trilingual;
  samvatsara: Trilingual;
  ritu: Trilingual;
  ayana: Trilingual;
}

export interface Muhurta {
  number: number;
  name: Trilingual;
  startTime: string;
  endTime: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
}

export interface Eclipse {
  type: 'solar' | 'lunar';
  date: string;
  maxTime: string;
  magnitude: number;
  visibility: string;
  description: Trilingual;
}

export interface Samvatsara {
  number: number;
  name: Trilingual;
  startYear: number;
}
