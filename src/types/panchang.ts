/** Multilingual text map. en is required, all others optional.
 *  Use tl(obj, locale) to access safely with fallback to en. */
export interface LocaleText {
  en: string;
  [key: string]: string | undefined;
}

/** Constants data with en/hi/sa guaranteed. Extends LocaleText for compatibility. */
export interface Trilingual extends LocaleText {
  hi: string;
  sa: string;
}

/** Locale — re-exported from i18n config. All 10 supported locales. */
export type { Locale } from '@/lib/i18n/config';

export interface Tithi {
  number: number;
  name: LocaleText;
  paksha: 'shukla' | 'krishna';
  deity: LocaleText;
  endTime?: Date;
}

export interface Nakshatra {
  id: number;
  name: LocaleText;
  deity: LocaleText;
  ruler: string;
  rulerName: LocaleText;
  startDeg: number;
  endDeg: number;
  pada?: number;
  symbol: string;
  nature: LocaleText;
}

export interface Yoga {
  number: number;
  name: LocaleText;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  meaning: LocaleText;
}

export interface Karana {
  number: number;
  name: LocaleText;
  type: 'chara' | 'sthira' | 'special';
}

export interface Rashi {
  id: number;
  slug: string;
  name: LocaleText;
  symbol: string;
  element: LocaleText;
  ruler: string;
  rulerName: LocaleText;
  startDeg: number;
  endDeg: number;
  quality: LocaleText;
}

export interface Graha {
  id: number;
  name: LocaleText;
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
  nextName: LocaleText;  // name of the next element
  nextNumber: number;    // index/number of the next element
  startJD?: number;      // raw Julian Day of start (for internal calculations)
  endJD?: number;        // raw Julian Day of end (for internal calculations)
}

export interface PanchangData {
  date: string;
  location: { lat: number; lng: number; name: string };
  tithi: Tithi;
  /** Kshaya (skipped) tithi: a tithi that starts and ends entirely within this panchang day
   *  without being active at either sunrise. It appears between the current and next tithi. */
  kshayaTithi?: { tithi: Tithi; start: string; end: string };
  /** Vriddhi (adhika/doubled) tithi: the current tithi is active at both today's and tomorrow's sunrise. */
  vriddhiTithi?: boolean;
  nakshatra: Nakshatra;
  yoga: Yoga;
  karana: Karana;
  vara: { day: number; name: LocaleText; ruler: LocaleText };
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rahuKaal: { start: string; end: string };
  yamaganda: { start: string; end: string };
  gulikaKaal: { start: string; end: string };
  muhurtas: Muhurta[];
  abhijitMuhurta: { start: string; end: string; available?: boolean };
  planets: Graha[];
  masa: LocaleText;
  samvatsara: LocaleText;
  ritu: LocaleText;
  ayana: LocaleText;
  // Transition times
  tithiTransition?: TransitionInfo;
  nakshatraTransition?: TransitionInfo;
  yogaTransition?: TransitionInfo;
  karanaTransition?: TransitionInfo;
  // Choghadiya
  choghadiya?: ChoghadiyaSlot[];
  // Hora (planetary hours)
  hora?: HoraSlot[];
  // Special time windows (single window for backward compat + arrays for multi-nakshatra display)
  amritKalam?: { start: string; end: string };
  varjyam?: { start: string; end: string };
  amritKalamAll?: { start: string; end: string }[];
  varjyamAll?: { start: string; end: string }[];
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
  purnimantMasa?: LocaleText;
  amantMasa?: LocaleText;
  ayanamsha?: number;
  sunLongitude?: number;  // sidereal Sun longitude 0-360
  sunSign?: { rashi: number; nakshatra: number };
  moonSign?: { rashi: number; nakshatra: number; pada: number };
  dinamana?: string;  // day duration HH:MM
  ratrimana?: string; // night duration HH:MM
  madhyahna?: string; // midday time HH:MM
  // New fields — Drik Panchang additions
  vijayaMuhurta?: { start: string; end: string };
  durMuhurtam?: { start: string; end: string }[];
  durMuhurtamAlt?: { start: string; end: string }[]; // Nirṇaya Sindhu tradition (alternate)
  gandaMoola?: { active: boolean; nakshatra?: LocaleText };
  anandadiYoga?: { number: number; name: LocaleText; nature: 'auspicious' | 'inauspicious' };
  raviYoga?: boolean;
  kaliAhargana?: number;
  kaliyugaYear?: number;
  julianDay?: number;
  // Audit trail / calculation transparency fields
  moonLongitude?: number;      // Sidereal Moon longitude (degrees)
  moonElongation?: number;     // Moon - Sun elongation (degrees), defines tithi
  panchaka?: { active: boolean; type?: LocaleText };
  shivaVaas?: { name: LocaleText; nature: 'auspicious' | 'inauspicious' | 'neutral' | 'mixed'; tithis: number[] };
  agniVaas?: { name: LocaleText; nature: 'auspicious' | 'inauspicious' | 'neutral' | 'mixed'; validUntil?: string };
  chandraVaas?: { name: LocaleText; direction: LocaleText; nature: 'auspicious' | 'inauspicious' | 'neutral' | 'mixed' };
  rahuVaas?: { direction: LocaleText };
  udayaLagna?: { rashi: number; name: LocaleText; start: string; end: string }[];
  tamilYoga?: { name: LocaleText; nature: 'auspicious' | 'inauspicious' };
  mantriMandala?: { king: { planet: number; role: LocaleText }; minister: { planet: number; role: LocaleText }; horas?: { planet: number; start: string; end: string; isDay: boolean }[] };
  homahuti?: { direction: LocaleText; deity: LocaleText };
  dagdhaTithi?: boolean;
  amritSiddhiYoga?: boolean;
  vishaGhatika?: { start: string; end: string };
  bhadra?: { start: string; end: string; endDate?: string };
  bhadraAll?: { start: string; end: string; endDate?: string }[];
  aadalYoga?: { start: string; end: string; endDate?: string };
  vidaalYoga?: { start: string; end: string; endDate?: string };
  raviYogaWindow?: { active: boolean; start?: string; end?: string; endDate?: string };
  // Special daily yogas (Dwipushkar, Tripushkar, Sarvartha Siddhi, Amrit Siddhi, Ravi, Guru Pushya)
  specialYogas?: {
    name: LocaleText;
    isActive: boolean;
    description: LocaleText;
  }[];
  // Festivals & Vrats for this date
  festivals?: {
    name: LocaleText;
    type: string;
    category: string;
    description: LocaleText;
    slug?: string;
    pujaMuhurat?: { start: string; end: string; name: string };
    paranaStart?: string;
    paranaEnd?: string;
    paranaDate?: string;
  }[];
}

export interface ChoghadiyaSlot {
  name: LocaleText;
  type: 'amrit' | 'shubh' | 'labh' | 'char' | 'rog' | 'kaal' | 'udveg';
  nature: 'auspicious' | 'inauspicious' | 'neutral';
  startTime: string;
  endTime: string;
  period: 'day' | 'night';
  /** True when the slot spans midnight (startUT < 24 && endUT > 24 unwrapped) */
  crossesMidnight?: boolean;
}

export interface HoraSlot {
  planet: LocaleText;
  planetId: number;
  startTime: string;
  endTime: string;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
}

export interface DishaShoolInfo {
  direction: LocaleText;
  remedy: LocaleText;
}

export interface BalamResult {
  chandrabalam: {
    house: number;
    favorable: boolean;
    description: LocaleText;
  };
  tarabalam: {
    tara: number;
    taraName: LocaleText;
    favorable: boolean;
    description: LocaleText;
  };
}

export interface Muhurta {
  number: number;
  name: LocaleText;
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
  description: LocaleText;
}

export interface Samvatsara {
  number: number;
  name: LocaleText;
  startYear: number;
}
