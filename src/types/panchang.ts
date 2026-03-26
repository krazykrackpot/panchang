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

export interface TransitionInfo {
  endTime: string;       // "HH:MM" when current element ends
  nextName: Trilingual;  // name of the next element
  nextNumber: number;    // index/number of the next element
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
  // Transition times
  tithiTransition?: TransitionInfo;
  nakshatraTransition?: TransitionInfo;
  yogaTransition?: TransitionInfo;
  karanaTransition?: TransitionInfo;
  // Choghadiya
  choghadiya?: ChoghadiyaSlot[];
  // Hora (planetary hours)
  hora?: HoraSlot[];
  // Special time windows
  amritKalam?: { start: string; end: string };
  varjyam?: { start: string; end: string };
  // Named muhurtas
  brahmaMuhurta?: { start: string; end: string };
  godhuli?: { start: string; end: string };
  sandhyaKaal?: { morning: { start: string; end: string }; evening: { start: string; end: string } };
  nishitaKaal?: { start: string; end: string };
  // Disha Shool & Sarvartha Siddhi
  dishaShool?: DishaShoolInfo;
  sarvarthaSiddhi?: boolean;
}

export interface ChoghadiyaSlot {
  name: Trilingual;
  type: 'amrit' | 'shubh' | 'labh' | 'char' | 'rog' | 'kaal' | 'udveg';
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  startTime: string;
  endTime: string;
  period: 'day' | 'night';
}

export interface HoraSlot {
  planet: Trilingual;
  planetId: number;
  startTime: string;
  endTime: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
}

export interface DishaShoolInfo {
  direction: Trilingual;
  remedy: Trilingual;
}

export interface BalamResult {
  chandrabalam: {
    house: number;
    favorable: boolean;
    description: Trilingual;
  };
  tarabalam: {
    tara: number;
    taraName: Trilingual;
    favorable: boolean;
    description: Trilingual;
  };
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
