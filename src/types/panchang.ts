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
  startTime: string;     // "HH:MM" when current element started
  startDate: string;     // "YYYY-MM-DD" date of start
  endTime: string;       // "HH:MM" when current element ends
  endDate: string;       // "YYYY-MM-DD" date of end
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
  // Enhanced Drikpanchang-style fields
  vikramSamvat?: number;
  shakaSamvat?: number;
  purnimantMasa?: Trilingual;
  amantMasa?: Trilingual;
  ayanamsha?: number;
  sunSign?: { rashi: number; nakshatra: number };
  moonSign?: { rashi: number; nakshatra: number; pada: number };
  dinamana?: string;  // day duration HH:MM
  ratrimana?: string; // night duration HH:MM
  madhyahna?: string; // midday time HH:MM
  // New fields — Drik Panchang additions
  vijayaMuhurta?: { start: string; end: string };
  durMuhurtam?: { start: string; end: string }[];
  gandaMoola?: { active: boolean; nakshatra?: Trilingual };
  anandadiYoga?: { number: number; name: Trilingual; nature: 'auspicious' | 'inauspicious' };
  raviYoga?: boolean;
  kaliAhargana?: number;
  kaliyugaYear?: number;
  julianDay?: number;
  panchaka?: { active: boolean; type?: Trilingual };
  shivaVaas?: { name: Trilingual; nature: 'auspicious' | 'inauspicious' | 'neutral' | 'mixed'; tithis: number[] };
  agniVaas?: { name: Trilingual; nature: 'auspicious' | 'inauspicious' | 'neutral' | 'mixed'; validUntil?: string };
  chandraVaas?: { name: Trilingual; direction: Trilingual; nature: 'auspicious' | 'inauspicious' | 'neutral' | 'mixed' };
  rahuVaas?: { direction: Trilingual };
  udayaLagna?: { rashi: number; name: Trilingual; start: string; end: string }[];
  tamilYoga?: { name: Trilingual; nature: 'auspicious' | 'inauspicious' };
  mantriMandala?: { king: { planet: number; role: Trilingual }; minister: { planet: number; role: Trilingual } };
  homahuti?: { direction: Trilingual; deity: Trilingual };
  dagdhaTithi?: boolean;
  amritSiddhiYoga?: boolean;
  vishaGhatika?: { start: string; end: string };
  // Festivals & Vrats for this date
  festivals?: {
    name: Trilingual;
    type: string;
    category: string;
    description: Trilingual;
    slug?: string;
    pujaMuhurat?: { start: string; end: string; name: string };
    paranaStart?: string;
    paranaEnd?: string;
    paranaDate?: string;
  }[];
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
