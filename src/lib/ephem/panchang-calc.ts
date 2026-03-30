import {
  dateToJD, calculateTithi, calculateYoga, calculateKarana,
  sunLongitude, moonLongitude, toSidereal,
  getNakshatraNumber, getNakshatraPada, getRashiNumber,
  approximateSunrise, approximateSunset, formatTime,
  calculateRahuKaal, getPlanetaryPositions,
  getMasa, MASA_NAMES, RITU_NAMES, SAMVATSARA_NAMES,
  getSamvatsara, getRitu, getAyana, lahiriAyanamsha,
} from './astronomical';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS, VARA_DATA } from '@/lib/constants/grahas';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';
import { PanchangData, Muhurta, TransitionInfo, ChoghadiyaSlot, HoraSlot, DishaShoolInfo } from '@/types/panchang';

export interface PanchangInput {
  year: number;
  month: number; // 1-12
  day: number;
  lat: number;
  lng: number;
  tzOffset: number; // hours from UTC (e.g., 5.5 for IST)
  locationName?: string;
}

// ──────────────────────────────────────────────────────────────
// Binary search helpers — find when a panchang element transitions
// ──────────────────────────────────────────────────────────────

/** Find JD when tithi changes from `currentTithi` within [jdStart, jdEnd]. */
function findTithiTransition(currentTithi: number, jdStart: number, jdEnd: number): number {
  let lo = jdStart, hi = jdEnd;
  for (let i = 0; i < 30; i++) { // ~30 iterations gives sub-second precision
    const mid = (lo + hi) / 2;
    const t = calculateTithi(mid).number;
    if (t === currentTithi) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Find JD when nakshatra (by sidereal Moon) changes. */
function findNakshatraTransition(currentNak: number, jdStart: number, jdEnd: number): number {
  let lo = jdStart, hi = jdEnd;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    const moonSid = toSidereal(moonLongitude(mid), mid);
    const n = getNakshatraNumber(moonSid);
    if (n === currentNak) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Find JD when yoga changes. */
function findYogaTransition(currentYoga: number, jdStart: number, jdEnd: number): number {
  let lo = jdStart, hi = jdEnd;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    const y = calculateYoga(mid);
    if (y === currentYoga) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Find JD when karana changes. */
function findKaranaTransition(currentKarana: number, jdStart: number, jdEnd: number): number {
  let lo = jdStart, hi = jdEnd;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    const k = calculateKarana(mid);
    if (k === currentKarana) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Compute transition info for a panchang element.
 * Scans forward from sunrise to find end time, and backward to find start time,
 * then binary-searches for the exact transition JDs.
 */
function computeTransition(
  currentValue: number,
  getter: (jd: number) => number,
  finder: (cur: number, jdStart: number, jdEnd: number) => number,
  jdSunrise: number,
  tzOffset: number,
  dataArray: { name: { en: string; hi: string; sa: string } }[],
  wrapMax: number, // e.g. 30 for tithi, 27 for nakshatra/yoga, 11 for karana
): TransitionInfo | undefined {
  const step = 1 / 48; // ~30 min in JD

  // ── Find END time: scan forward up to 36 hours ──
  const maxJd = jdSunrise + 1.5;
  let foundEnd = false;
  let endTransitionJd = maxJd;

  for (let jd = jdSunrise + step; jd <= maxJd; jd += step) {
    const val = getter(jd);
    if (val !== currentValue) {
      endTransitionJd = finder(currentValue, jd - step, jd);
      foundEnd = true;
      break;
    }
  }

  if (!foundEnd) return undefined;

  // ── Find START time: scan backward up to 36 hours ──
  const minJd = jdSunrise - 1.5;
  let startJdResult = jdSunrise; // fallback

  const valBeforeSunrise = getter(jdSunrise - step);
  if (valBeforeSunrise !== currentValue) {
    let lo = jdSunrise - step, hi = jdSunrise;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (getter(mid) !== currentValue) lo = mid; else hi = mid;
    }
    startJdResult = (lo + hi) / 2;
  } else {
    for (let jd = jdSunrise - 2 * step; jd >= minJd; jd -= step) {
      if (getter(jd) !== currentValue) {
        let lo = jd, hi = jd + step;
        for (let i = 0; i < 30; i++) {
          const mid = (lo + hi) / 2;
          if (getter(mid) !== currentValue) lo = mid; else hi = mid;
        }
        startJdResult = (lo + hi) / 2;
        break;
      }
    }
  }

  // Next value
  const nextValue = getter(endTransitionJd + 0.001);
  const nextIndex = nextValue - 1;
  const nextData = dataArray[nextIndex] || dataArray[0];

  return {
    startTime: formatTime(jdToDecimalHoursUT(startJdResult, jdSunrise), tzOffset),
    startDate: jdToLocalDate(startJdResult, tzOffset),
    endTime: formatTime(jdToDecimalHoursUT(endTransitionJd, jdSunrise), tzOffset),
    endDate: jdToLocalDate(endTransitionJd, tzOffset),
    nextName: nextData.name,
    nextNumber: nextValue,
  };
}

/** Convert a JD to a local date string "YYYY-MM-DD" */
function jdToLocalDate(jd: number, tzOffset: number): string {
  // JD to calendar date (Meeus algorithm)
  const localJd = jd + tzOffset / 24;
  const z = Math.floor(localJd + 0.5);
  const a = z < 2299161 ? z : (() => { const alpha = Math.floor((z - 1867216.25) / 36524.25); return z + 1 + alpha - Math.floor(alpha / 4); })();
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

/** Convert a JD to decimal hours UT on the same day as jdRef */
function jdToDecimalHoursUT(jd: number, jdRef: number): number {
  // jdRef is at sunrise UT. We need the fractional day difference as hours.
  const diff = (jd - Math.floor(jdRef - 0.5) - 0.5) * 24; // hours from midnight UT
  return ((diff % 24) + 24) % 24;
}

// ──────────────────────────────────────────────────────────────
// Choghadiya
// ──────────────────────────────────────────────────────────────

const CHOGHADIYA_TYPES = ['udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog'] as const;

const CHOGHADIYA_NAMES: Record<string, { en: string; hi: string; sa: string }> = {
  amrit:  { en: 'Amrit',  hi: 'अमृत',  sa: 'अमृतम्' },
  shubh:  { en: 'Shubh',  hi: 'शुभ',   sa: 'शुभम्' },
  labh:   { en: 'Labh',   hi: 'लाभ',   sa: 'लाभः' },
  char:   { en: 'Char',   hi: 'चल',    sa: 'चलम्' },
  rog:    { en: 'Rog',    hi: 'रोग',   sa: 'रोगः' },
  kaal:   { en: 'Kaal',   hi: 'काल',   sa: 'कालः' },
  udveg:  { en: 'Udveg',  hi: 'उद्वेग', sa: 'उद्वेगः' },
};

const CHOGHADIYA_NATURE: Record<string, 'auspicious' | 'inauspicious' | 'neutral'> = {
  amrit: 'auspicious', shubh: 'auspicious', labh: 'auspicious',
  char: 'neutral',
  rog: 'inauspicious', kaal: 'inauspicious', udveg: 'inauspicious',
};

// Day choghadiya starting index per weekday (Sun=0 through Sat=6)
const DAY_CHOGHADIYA_START = [0, 4, 1, 5, 2, 6, 3]; // Sun=Udveg, Mon=Amrit, Tue=Rog, ...
const NIGHT_CHOGHADIYA_START = [4, 1, 5, 2, 6, 3, 0]; // Night starts from 5th element after day start

function computeChoghadiya(sunriseUT: number, sunsetUT: number, weekday: number, tzOffset: number): ChoghadiyaSlot[] {
  const dayDuration = sunsetUT - sunriseUT;
  const nightDuration = 24 - dayDuration;
  const daySlotDuration = dayDuration / 8;
  const nightSlotDuration = nightDuration / 8;
  const slots: ChoghadiyaSlot[] = [];

  // Day choghadiya (8 slots from sunrise to sunset)
  const dayStart = DAY_CHOGHADIYA_START[weekday];
  for (let i = 0; i < 8; i++) {
    const typeIdx = (dayStart + i) % 7;
    const type = CHOGHADIYA_TYPES[typeIdx];
    const startUT = sunriseUT + i * daySlotDuration;
    const endUT = startUT + daySlotDuration;
    slots.push({
      name: CHOGHADIYA_NAMES[type],
      type,
      nature: CHOGHADIYA_NATURE[type],
      startTime: formatTime(startUT, tzOffset),
      endTime: formatTime(endUT, tzOffset),
      period: 'day',
    });
  }

  // Night choghadiya (8 slots from sunset to next sunrise)
  const nightStart = NIGHT_CHOGHADIYA_START[weekday];
  for (let i = 0; i < 8; i++) {
    const typeIdx = (nightStart + i) % 7;
    const type = CHOGHADIYA_TYPES[typeIdx];
    const startUT = (sunsetUT + i * nightSlotDuration) % 24;
    const endUT = (sunsetUT + (i + 1) * nightSlotDuration) % 24;
    slots.push({
      name: CHOGHADIYA_NAMES[type],
      type,
      nature: CHOGHADIYA_NATURE[type],
      startTime: formatTime(startUT, tzOffset),
      endTime: formatTime(endUT, tzOffset),
      period: 'night',
    });
  }

  return slots;
}

// ──────────────────────────────────────────────────────────────
// Hora (Planetary Hours)
// ──────────────────────────────────────────────────────────────

// Hora planet sequence: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars (then repeats)
const HORA_PLANET_SEQUENCE = [0, 5, 3, 1, 6, 4, 2]; // planet IDs
const HORA_PLANET_NAMES: Record<number, { en: string; hi: string; sa: string }> = {
  0: { en: 'Sun',     hi: 'सूर्य',   sa: 'सूर्यः' },
  1: { en: 'Moon',    hi: 'चन्द्र',  sa: 'चन्द्रः' },
  2: { en: 'Mars',    hi: 'मंगल',    sa: 'मङ्गलः' },
  3: { en: 'Mercury', hi: 'बुध',     sa: 'बुधः' },
  4: { en: 'Jupiter', hi: 'गुरु',    sa: 'गुरुः' },
  5: { en: 'Venus',   hi: 'शुक्र',   sa: 'शुक्रः' },
  6: { en: 'Saturn',  hi: 'शनि',    sa: 'शनिः' },
};

// Starting hora planet for each weekday (the day's ruling planet)
// Sun=0(Sun), Mon=1(Moon), Tue=2(Mars), Wed=3(Mercury), Thu=4(Jupiter), Fri=5(Venus), Sat=6(Saturn)
const HORA_DAY_START_INDEX = [0, 3, 6, 2, 5, 1, 4]; // index into HORA_PLANET_SEQUENCE

const HORA_NATURE: Record<number, 'auspicious' | 'inauspicious' | 'neutral'> = {
  0: 'auspicious',  // Sun
  1: 'auspicious',  // Moon
  2: 'inauspicious', // Mars
  3: 'neutral',      // Mercury
  4: 'auspicious',  // Jupiter
  5: 'auspicious',  // Venus
  6: 'inauspicious', // Saturn
};

function computeHora(sunriseUT: number, sunsetUT: number, weekday: number, tzOffset: number): HoraSlot[] {
  const dayDuration = sunsetUT - sunriseUT;
  const nightDuration = 24 - dayDuration;
  const dayHoraDuration = dayDuration / 12;
  const nightHoraDuration = nightDuration / 12;
  const slots: HoraSlot[] = [];

  const startIdx = HORA_DAY_START_INDEX[weekday];

  // 12 day horas + 12 night horas = 24 total
  for (let i = 0; i < 24; i++) {
    const seqIdx = (startIdx + i) % 7;
    const planetId = HORA_PLANET_SEQUENCE[seqIdx];
    const isDay = i < 12;
    const slotDuration = isDay ? dayHoraDuration : nightHoraDuration;
    const base = isDay ? sunriseUT : sunsetUT;
    const slotIdx = isDay ? i : i - 12;
    const startUT = (base + slotIdx * slotDuration) % 24;
    const endUT = (base + (slotIdx + 1) * slotDuration) % 24;

    slots.push({
      planet: HORA_PLANET_NAMES[planetId],
      planetId,
      startTime: formatTime(startUT, tzOffset),
      endTime: formatTime(endUT, tzOffset),
      nature: HORA_NATURE[planetId],
    });
  }

  return slots;
}

// ──────────────────────────────────────────────────────────────
// Amrit Kalam & Varjyam
// ──────────────────────────────────────────────────────────────

// These are derived from Nakshatra-Vara combination.
// The time windows are specific portions of the day based on traditional tables.
// Each nakshatra (1-27) has a specific ghati (1 ghati = 24 min) offset for varjyam and amrit kalam.

// Varjyam ghati offset from nakshatra start (in ghatis, 1 ghati = 24 min)
const VARJYAM_GHATI: number[] = [
  50, 44, 30, 20, 32, // Ashwini-Mrigashira
  30, 20, 32, 44, 50, // Ardra-Magha
  20, 32, 44, 50, 30, // P.Phalguni-Swati
  32, 44, 50, 20, 30, // Vishakha-P.Ashadha
  50, 20, 44, 30, 32, // U.Ashadha-P.Bhadra
  50, 44,             // U.Bhadra-Revati
];

// Amrit Kalam ghati offset from nakshatra start
const AMRIT_GHATI: number[] = [
  2, 46, 36, 8, 14,   // Ashwini-Mrigashira
  22, 8, 14, 46, 2,    // Ardra-Magha
  8, 14, 46, 2, 36,    // P.Phalguni-Swati
  14, 46, 2, 8, 36,    // Vishakha-P.Ashadha
  2, 8, 46, 36, 14,    // U.Ashadha-P.Bhadra
  2, 46,               // U.Bhadra-Revati
];

function computeAmritVarjyam(
  nakshatraNum: number, sunriseUT: number, tzOffset: number
): { amritKalam?: { start: string; end: string }; varjyam?: { start: string; end: string } } {
  const nakIdx = nakshatraNum - 1;
  if (nakIdx < 0 || nakIdx >= 27) return {};

  // Convert ghati offset to hours from sunrise (1 ghati = 24 min = 0.4 hr)
  const varjyamOffset = (VARJYAM_GHATI[nakIdx] || 0) * 0.4;
  const amritOffset = (AMRIT_GHATI[nakIdx] || 0) * 0.4;
  const duration = 0.4 * 4; // 4 ghati duration (96 min)

  const varjyamStartUT = sunriseUT + varjyamOffset;
  const amritStartUT = sunriseUT + amritOffset;

  return {
    amritKalam: {
      start: formatTime(amritStartUT % 24, tzOffset),
      end: formatTime((amritStartUT + duration) % 24, tzOffset),
    },
    varjyam: {
      start: formatTime(varjyamStartUT % 24, tzOffset),
      end: formatTime((varjyamStartUT + duration) % 24, tzOffset),
    },
  };
}

// ──────────────────────────────────────────────────────────────
// Named Muhurtas
// ──────────────────────────────────────────────────────────────

function computeNamedMuhurtas(
  sunriseUT: number, sunsetUT: number, tzOffset: number
): {
  brahmaMuhurta: { start: string; end: string };
  godhuli: { start: string; end: string };
  sandhyaKaal: { morning: { start: string; end: string }; evening: { start: string; end: string } };
  nishitaKaal: { start: string; end: string };
} {
  // Brahma Muhurta: 96 min (2 muhurtas) before sunrise
  const brahmaStart = sunriseUT - 96 / 60;
  const brahmaEnd = sunriseUT - 48 / 60;

  // Godhuli (cow-dust time): ~24 min around sunset
  const godhuliStart = sunsetUT - 12 / 60;
  const godhuliEnd = sunsetUT + 12 / 60;

  // Sandhya Kaal: ~24 min before/after sunrise (morning) and sunset (evening)
  const mSandhyaStart = sunriseUT - 24 / 60;
  const mSandhyaEnd = sunriseUT + 24 / 60;
  const eSandhyaStart = sunsetUT - 24 / 60;
  const eSandhyaEnd = sunsetUT + 24 / 60;

  // Nishita Kaal: midnight ± ~24 min
  const midpoint = sunsetUT + (24 - (sunsetUT - sunriseUT)) / 2; // approximate midnight
  const nishitaStart = midpoint - 24 / 60;
  const nishitaEnd = midpoint + 24 / 60;

  return {
    brahmaMuhurta: {
      start: formatTime(((brahmaStart % 24) + 24) % 24, tzOffset),
      end: formatTime(((brahmaEnd % 24) + 24) % 24, tzOffset),
    },
    godhuli: {
      start: formatTime(godhuliStart % 24, tzOffset),
      end: formatTime(godhuliEnd % 24, tzOffset),
    },
    sandhyaKaal: {
      morning: {
        start: formatTime(((mSandhyaStart % 24) + 24) % 24, tzOffset),
        end: formatTime(mSandhyaEnd % 24, tzOffset),
      },
      evening: {
        start: formatTime(eSandhyaStart % 24, tzOffset),
        end: formatTime(eSandhyaEnd % 24, tzOffset),
      },
    },
    nishitaKaal: {
      start: formatTime(((nishitaStart % 24) + 24) % 24, tzOffset),
      end: formatTime(((nishitaEnd % 24) + 24) % 24, tzOffset),
    },
  };
}

// ──────────────────────────────────────────────────────────────
// Disha Shool
// ──────────────────────────────────────────────────────────────

const DISHA_SHOOL_DATA: Record<number, DishaShoolInfo> = {
  0: { // Sunday
    direction: { en: 'West',  hi: 'पश्चिम', sa: 'पश्चिमम्' },
    remedy:    { en: 'Consume jaggery before travel', hi: 'यात्रा से पहले गुड़ खाएं', sa: 'गुडं भक्षयित्वा यात्रां कुर्यात्' },
  },
  1: { // Monday
    direction: { en: 'East',  hi: 'पूर्व',  sa: 'पूर्वम्' },
    remedy:    { en: 'Consume milk before travel', hi: 'यात्रा से पहले दूध पिएं', sa: 'दुग्धं पीत्वा यात्रां कुर्यात्' },
  },
  2: { // Tuesday
    direction: { en: 'North', hi: 'उत्तर',  sa: 'उत्तरम्' },
    remedy:    { en: 'Consume wheat products before travel', hi: 'यात्रा से पहले गेहूं खाएं', sa: 'गोधूमं भक्षयित्वा यात्रां कुर्यात्' },
  },
  3: { // Wednesday
    direction: { en: 'North', hi: 'उत्तर',  sa: 'उत्तरम्' },
    remedy:    { en: 'Consume green vegetables before travel', hi: 'यात्रा से पहले हरी सब्जी खाएं', sa: 'हरितशाकं भक्षयित्वा यात्रां कुर्यात्' },
  },
  4: { // Thursday
    direction: { en: 'South', hi: 'दक्षिण', sa: 'दक्षिणम्' },
    remedy:    { en: 'Consume curd before travel', hi: 'यात्रा से पहले दही खाएं', sa: 'दधि भक्षयित्वा यात्रां कुर्यात्' },
  },
  5: { // Friday
    direction: { en: 'West',  hi: 'पश्चिम', sa: 'पश्चिमम्' },
    remedy:    { en: 'Consume sour items before travel', hi: 'यात्रा से पहले अम्ल पदार्थ खाएं', sa: 'आम्लं भक्षयित्वा यात्रां कुर्यात्' },
  },
  6: { // Saturday
    direction: { en: 'East',  hi: 'पूर्व',  sa: 'पूर्वम्' },
    remedy:    { en: 'Consume iron/sesame before travel', hi: 'यात्रा से पहले तिल खाएं', sa: 'तिलं भक्षयित्वा यात्रां कुर्यात्' },
  },
};

// ──────────────────────────────────────────────────────────────
// Sarvartha Siddhi Yoga
// ──────────────────────────────────────────────────────────────

// Sarvartha Siddhi occurs on specific Nakshatra + Vara combinations
// Key: weekday (0-6) → set of nakshatra numbers that form Sarvartha Siddhi
const SARVARTHA_SIDDHI: Record<number, Set<number>> = {
  0: new Set([2, 5, 7, 9, 12, 16, 21, 26]),     // Sunday
  1: new Set([1, 6, 11, 15, 17, 22, 27]),        // Monday
  2: new Set([3, 7, 12, 14, 18, 23, 25]),        // Tuesday
  3: new Set([2, 5, 8, 13, 17, 19, 24, 26]),     // Wednesday
  4: new Set([1, 4, 7, 10, 14, 16, 20, 25, 27]), // Thursday
  5: new Set([3, 6, 9, 12, 15, 19, 21, 26]),     // Friday
  6: new Set([4, 8, 11, 14, 18, 22, 24, 27]),    // Saturday
};

export function computePanchang(input: PanchangInput): PanchangData {
  const { year, month, day, lat, lng, tzOffset, locationName } = input;

  // Compute Julian Day at midnight UT for this date
  const jd = dateToJD(year, month, day, 12 - tzOffset); // Convert local noon to UT

  // Sunrise and sunset (in UT decimal hours)
  const sunriseUT = approximateSunrise(jd, lat, lng);
  const sunsetUT = approximateSunset(jd, lat, lng);

  // Compute at local sunrise time
  const jdSunrise = dateToJD(year, month, day, sunriseUT);

  // 1. Tithi
  const tithiResult = calculateTithi(jdSunrise);
  const tithiData = TITHIS[tithiResult.number - 1] || TITHIS[0];

  // 2. Nakshatra (of Moon)
  const moonSid = toSidereal(moonLongitude(jdSunrise), jdSunrise);
  const nakshatraNum = getNakshatraNumber(moonSid);
  const nakshatraPada = getNakshatraPada(moonSid);
  const nakshatraData = { ...NAKSHATRAS[nakshatraNum - 1], pada: nakshatraPada };

  // 3. Yoga
  const yogaNum = calculateYoga(jdSunrise);
  const yogaData = YOGAS[yogaNum - 1] || YOGAS[0];

  // 4. Karana
  const karanaNum = calculateKarana(jdSunrise);
  const karanaData = KARANAS[karanaNum - 1] || KARANAS[0];

  // 5. Vara
  const date = new Date(year, month - 1, day);
  const weekday = date.getDay();
  const varaData = VARA_DATA[weekday];

  // Rahu Kaal
  const rahuKaal = calculateRahuKaal(sunriseUT, sunsetUT, weekday);

  // Yamaganda (similar pattern)
  const yamaOrder = [5, 4, 3, 2, 1, 7, 6];
  const yamaDuration = (sunsetUT - sunriseUT) / 8;
  const yamaSegment = yamaOrder[weekday] - 1;
  const yamaganda = {
    start: sunriseUT + yamaSegment * yamaDuration,
    end: sunriseUT + (yamaSegment + 1) * yamaDuration,
  };

  // Gulika Kaal
  const gulikaOrder = [7, 6, 5, 4, 3, 2, 1];
  const gulikaSegment = gulikaOrder[weekday] - 1;
  const gulikaKaal = {
    start: sunriseUT + gulikaSegment * yamaDuration,
    end: sunriseUT + (gulikaSegment + 1) * yamaDuration,
  };

  // Planetary positions
  const planetPositions = getPlanetaryPositions(jdSunrise);
  const planets = planetPositions.map((p) => {
    const graha = GRAHAS[p.id];
    const sidLong = toSidereal(p.longitude, jdSunrise);
    const rashi = getRashiNumber(sidLong);
    const nakshatra = getNakshatraNumber(sidLong);
    return {
      ...graha,
      longitude: sidLong,
      rashi,
      nakshatra,
      isRetrograde: p.isRetrograde,
    };
  });

  // Muhurtas (15 day + 15 night)
  const dayDuration = sunsetUT - sunriseUT;
  const nightDuration = 24 - dayDuration;
  const dayMuhurtaDuration = dayDuration / 15;
  const nightMuhurtaDuration = nightDuration / 15;

  const muhurtas: Muhurta[] = MUHURTA_DATA.map((m) => {
    const isDay = m.period === 'day';
    const idx = isDay ? m.number - 1 : m.number - 16;
    const duration = isDay ? dayMuhurtaDuration : nightMuhurtaDuration;
    const base = isDay ? sunriseUT : sunsetUT;
    const startUT = base + idx * duration;
    const endUT = startUT + duration;
    return {
      number: m.number,
      name: m.name,
      startTime: formatTime(startUT % 24, tzOffset),
      endTime: formatTime(endUT % 24, tzOffset),
      nature: m.nature,
    };
  });

  // Abhijit Muhurta — the 8th daytime muhurta (around midday)
  const abhijitStart = sunriseUT + 7 * dayMuhurtaDuration;
  const abhijitEnd = abhijitStart + dayMuhurtaDuration;
  const abhijitMuhurta = {
    start: formatTime(abhijitStart, tzOffset),
    end: formatTime(abhijitEnd, tzOffset),
  };

  // Masa, Ritu, Samvatsara
  const sunSid = toSidereal(sunLongitude(jdSunrise), jdSunrise);
  const masaIndex = getMasa(sunSid);
  const rituIndex = getRitu(masaIndex);
  const samvatsaraIndex = getSamvatsara(year);
  const ayana = getAyana(sunSid);

  // ── Transition times ──
  const tithiTransition = computeTransition(
    tithiResult.number,
    (jd) => calculateTithi(jd).number,
    findTithiTransition,
    jdSunrise, tzOffset, TITHIS, 30,
  );

  const nakshatraTransition = computeTransition(
    nakshatraNum,
    (jd) => getNakshatraNumber(toSidereal(moonLongitude(jd), jd)),
    findNakshatraTransition,
    jdSunrise, tzOffset, NAKSHATRAS, 27,
  );

  const yogaTransition = computeTransition(
    yogaNum,
    (jd) => calculateYoga(jd),
    findYogaTransition,
    jdSunrise, tzOffset, YOGAS, 27,
  );

  const karanaTransition = computeTransition(
    karanaNum,
    (jd) => calculateKarana(jd),
    findKaranaTransition,
    jdSunrise, tzOffset, KARANAS, 11,
  );

  // ── Choghadiya ──
  const choghadiya = computeChoghadiya(sunriseUT, sunsetUT, weekday, tzOffset);

  // ── Hora ──
  const hora = computeHora(sunriseUT, sunsetUT, weekday, tzOffset);

  // ── Amrit Kalam & Varjyam ──
  const { amritKalam, varjyam } = computeAmritVarjyam(nakshatraNum, sunriseUT, tzOffset);

  // ── Named Muhurtas ──
  const namedMuhurtas = computeNamedMuhurtas(sunriseUT, sunsetUT, tzOffset);

  // ── Disha Shool ──
  const dishaShool = DISHA_SHOOL_DATA[weekday];

  // ── Sarvartha Siddhi Yoga ──
  const sarvarthaSiddhi = SARVARTHA_SIDDHI[weekday]?.has(nakshatraNum) ?? false;

  // ── Enhanced fields (Drikpanchang-style) ──

  // Vikram Samvat: offset ~57 years from CE (Chaitra-based, roughly year+57)
  const vikramSamvat = (month >= 4) ? year + 57 : year + 56;
  // Shaka Samvat: offset ~78 years from CE
  const shakaSamvat = (month >= 4) ? year - 78 : year - 79;

  // Purnimant / Amant masa — same index, different naming in some months
  // Purnimant: lunar month ends on Purnima; Amant: ends on Amavasya
  // For simplicity, Amant = same month, Purnimant may lag by 1
  const purnimantMasa = MASA_NAMES[masaIndex] || MASA_NAMES[0];
  const amantMasaIdx = tithiResult.number > 15 ? (masaIndex + 1) % 12 : masaIndex;
  const amantMasa = MASA_NAMES[amantMasaIdx] || MASA_NAMES[0];

  // Ayanamsha value
  const ayanamsha = lahiriAyanamsha(jdSunrise);

  // Sun sign and nakshatra
  const sunSidLong = toSidereal(sunLongitude(jdSunrise), jdSunrise);
  const sunRashi = getRashiNumber(sunSidLong);
  const sunNakshatra = getNakshatraNumber(sunSidLong);
  const sunSign = { rashi: sunRashi, nakshatra: sunNakshatra };

  // Moon sign and nakshatra (already computed, just package)
  const moonRashi = getRashiNumber(moonSid);
  const moonSign = { rashi: moonRashi, nakshatra: nakshatraNum, pada: nakshatraPada };

  // Day/Night duration (Dinamana/Ratrimana)
  const dayDurationHrs = sunsetUT - sunriseUT;
  const nightDurationHrs = 24 - dayDurationHrs;
  const dinamana = `${Math.floor(dayDurationHrs).toString().padStart(2, '0')}:${Math.round((dayDurationHrs % 1) * 60).toString().padStart(2, '0')}`;
  const ratrimana = `${Math.floor(nightDurationHrs).toString().padStart(2, '0')}:${Math.round((nightDurationHrs % 1) * 60).toString().padStart(2, '0')}`;

  // Madhyahna (local midday)
  const madhyahnaUT = (sunriseUT + sunsetUT) / 2;
  const madhyahna = formatTime(madhyahnaUT, tzOffset);

  // ── New fields ──

  // 1. Vijaya Muhurta (10th daytime muhurta, 0-indexed position 9)
  const muhurtaDuration = dayDuration / 15;
  const vijayaStartUT = sunriseUT + 9 * muhurtaDuration;
  const vijayaEndUT = sunriseUT + 10 * muhurtaDuration;
  const vijayaMuhurta = {
    start: formatTime(vijayaStartUT, tzOffset),
    end: formatTime(vijayaEndUT, tzOffset),
  };

  // 2. Dur Muhurtam (inauspicious muhurta windows by weekday)
  const DUR_MUHURTAM_INDICES: number[][] = [
    [6, 7],  // Sunday
    [6],     // Monday
    [5, 6],  // Tuesday
    [3, 10], // Wednesday
    [4],     // Thursday
    [7, 8],  // Friday
    [2],     // Saturday
  ];
  const durMuhurtam = DUR_MUHURTAM_INDICES[weekday].map(idx => {
    const s = sunriseUT + idx * muhurtaDuration;
    const e = s + muhurtaDuration;
    return { start: formatTime(s, tzOffset), end: formatTime(e, tzOffset) };
  });

  // 3. Ganda Moola
  const GANDA_MOOLA_NAKSHATRAS = new Set([1, 9, 10, 18, 19, 27]);
  const gandaMoolaActive = GANDA_MOOLA_NAKSHATRAS.has(nakshatraNum);
  const gandaMoola = {
    active: gandaMoolaActive,
    nakshatra: gandaMoolaActive ? NAKSHATRAS[nakshatraNum - 1]?.name : undefined,
  };

  // 4. Anandadi Yoga
  const ANANDADI_NAMES: { en: string; hi: string; sa: string }[] = [
    { en: 'Ananda',   hi: 'आनन्द',    sa: 'आनन्दः' },
    { en: 'Kala',     hi: 'काल',      sa: 'कालः' },
    { en: 'Dhwanksha', hi: 'ध्वांक्ष', sa: 'ध्वांक्षः' },
    { en: 'Shoola',   hi: 'शूल',      sa: 'शूलम्' },
    { en: 'Kshema',   hi: 'क्षेम',    sa: 'क्षेमम्' },
    { en: 'Utpata',   hi: 'उत्पात',   sa: 'उत्पातः' },
    { en: 'Mrityu',   hi: 'मृत्यु',   sa: 'मृत्युः' },
    { en: 'Susthira', hi: 'सुस्थिर',  sa: 'सुस्थिरम्' },
    { en: 'Roga',     hi: 'रोग',      sa: 'रोगः' },
  ];
  const ANANDADI_AUSPICIOUS = new Set([0, 4, 7]); // Ananda, Kshema, Susthira
  const anandadiIdx = (tithiResult.number + weekday - 2 + 9 * 100) % 9;
  const anandadiYoga = {
    number: anandadiIdx + 1,
    name: ANANDADI_NAMES[anandadiIdx],
    nature: ANANDADI_AUSPICIOUS.has(anandadiIdx) ? 'auspicious' as const : 'inauspicious' as const,
  };

  // 5. Ravi Yoga (Sun in specific nakshatra on specific weekday)
  const RAVI_YOGA_TABLE: Record<number, Set<number>> = {
    0: new Set([13, 12, 26]),  // Sunday: Hasta, Uttara Phalguni, Uttara Bhadrapada
    1: new Set([4, 5, 8]),     // Monday: Rohini, Mrigashira, Pushya
    2: new Set([1, 14, 23]),   // Tuesday: Ashvini, Chitra, Dhanishtha
    3: new Set([17, 18, 27]),  // Wednesday: Anuradha, Jyeshtha, Revati
    4: new Set([7, 16, 25]),   // Thursday: Punarvasu, Vishakha, Purva Bhadrapada
    5: new Set([2, 11, 20]),   // Friday: Bharani, Purva Phalguni, Purva Ashadha
    6: new Set([8, 21, 24]),   // Saturday: Pushya, Uttara Ashadha, Shatabhisha
  };
  const raviYoga = RAVI_YOGA_TABLE[weekday]?.has(sunNakshatra) ?? false;

  // 6. Kali Ahargana, Kaliyuga Year, Julian Day
  const KALI_YUGA_JD = 588465.5;
  const kaliAhargana = Math.floor(jd - KALI_YUGA_JD);
  const kaliyugaYear = Math.floor(kaliAhargana / 365.25) + 1;
  const julianDay = Math.floor(jd);

  // 7. Panchaka (Moon in nakshatras 23-27)
  const PANCHAKA_NAKSHATRAS = new Set([23, 24, 25, 26, 27]);
  const panchakaActive = PANCHAKA_NAKSHATRAS.has(nakshatraNum);
  const PANCHAKA_TYPE: Record<number, { en: string; hi: string; sa: string }> = {
    0: { en: 'Mrityu Panchaka',  hi: 'मृत्यु पंचक',  sa: 'मृत्युपञ्चकम्' },
    1: { en: 'Raja Panchaka',    hi: 'राज पंचक',     sa: 'राजपञ्चकम्' },
    2: { en: 'Agni Panchaka',    hi: 'अग्नि पंचक',   sa: 'अग्निपञ्चकम्' },
    4: { en: 'Raja Panchaka',    hi: 'राज पंचक',     sa: 'राजपञ्चकम्' },
    5: { en: 'Chora Panchaka',   hi: 'चोर पंचक',     sa: 'चोरपञ्चकम्' },
    6: { en: 'Roga Panchaka',    hi: 'रोग पंचक',     sa: 'रोगपञ्चकम्' },
  };
  const PANCHAKA_DEFAULT = { en: 'Panchaka', hi: 'पंचक', sa: 'पञ्चकम्' };
  const panchaka = {
    active: panchakaActive,
    type: panchakaActive ? (PANCHAKA_TYPE[weekday] || PANCHAKA_DEFAULT) : undefined,
  };

  // 8. Shiva Vaas (based on tithi)
  const tithiMod = ((tithiResult.number - 1) % 5) + 1; // groups of 5: tithi 1,6,11 → 1; 2,7,12 → 2; etc
  const SHIVA_VAAS_MAP: Record<number, { en: string; hi: string; sa: string }> = {
    1: { en: 'Kailash (Mountain)', hi: 'कैलाश पर', sa: 'कैलासे' },
    2: { en: 'Shamshan (Cremation Ground)', hi: 'श्मशान में', sa: 'श्मशाने' },
    3: { en: "Gori's Abode (Auspicious)", hi: 'गौरी गृह में (शुभ)', sa: 'गौरीगृहे (शुभम्)' },
    4: { en: 'Sports & Play', hi: 'क्रीड़ा में', sa: 'क्रीडायाम्' },
    0: { en: 'Deep Meditation (Samadhi)', hi: 'समाधि में (अति शुभ)', sa: 'समाधौ (अतिशुभम्)' },
  };
  // tithi 5,10,15,30 → samadhi (mod 5 = 0); others grouped by (tithi-1)%5 + 1
  const shivaVaasKey = tithiResult.number % 5 === 0 ? 0 : tithiMod;
  const shivaVaas = SHIVA_VAAS_MAP[shivaVaasKey];

  // 9. Agni Vaas (based on weekday)
  const AGNI_VAAS_MAP: Record<number, { en: string; hi: string; sa: string }> = {
    0: { en: 'Sky (Akasha)',   hi: 'आकाश में',  sa: 'आकाशे' },
    1: { en: 'Earth (Bhumi)', hi: 'भूमि पर',   sa: 'भूमौ' },
    2: { en: 'Patala',        hi: 'पाताल में', sa: 'पाताले' },
    3: { en: 'Water (Jal)',   hi: 'जल में',    sa: 'जले' },
    4: { en: 'Sky (Akasha)',  hi: 'आकाश में',  sa: 'आकाशे' },
    5: { en: 'Earth (Bhumi)', hi: 'भूमि पर',   sa: 'भूमौ' },
    6: { en: 'Patala',        hi: 'पाताल में', sa: 'पाताले' },
  };
  const agniVaas = AGNI_VAAS_MAP[weekday];

  // 10. Chandra Vaas (based on nakshatra pada)
  const CHANDRA_VAAS_MAP: Record<number, { en: string; hi: string; sa: string }> = {
    1: { en: "Brahma's Abode", hi: 'ब्रह्म लोक',  sa: 'ब्रह्मस्थाने' },
    2: { en: "Indra's Abode",  hi: 'इन्द्र लोक', sa: 'इन्द्रस्थाने' },
    3: { en: "Yama's Abode",   hi: 'यम लोक',     sa: 'यमस्थाने' },
    4: { en: "Soma's Abode",   hi: 'सोम लोक',    sa: 'सोमस्थाने' },
  };
  const chandraVaas = CHANDRA_VAAS_MAP[nakshatraPada] || CHANDRA_VAAS_MAP[1];

  return {
    date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    location: { lat, lng, name: locationName || `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E` },
    tithi: tithiData,
    nakshatra: nakshatraData,
    yoga: yogaData,
    karana: karanaData,
    vara: { day: weekday, name: varaData.name, ruler: varaData.ruler },
    sunrise: formatTime(sunriseUT, tzOffset),
    sunset: formatTime(sunsetUT, tzOffset),
    moonrise: formatTime(((sunriseUT + (tithiResult.number - 1) * (24 / 29.53)) % 24 + 24) % 24, tzOffset),
    moonset: formatTime(((sunriseUT + (tithiResult.number - 1) * (24 / 29.53) + 12.4) % 24 + 24) % 24, tzOffset),
    rahuKaal: { start: formatTime(rahuKaal.start, tzOffset), end: formatTime(rahuKaal.end, tzOffset) },
    yamaganda: { start: formatTime(yamaganda.start, tzOffset), end: formatTime(yamaganda.end, tzOffset) },
    gulikaKaal: { start: formatTime(gulikaKaal.start, tzOffset), end: formatTime(gulikaKaal.end, tzOffset) },
    muhurtas,
    abhijitMuhurta,
    planets,
    masa: MASA_NAMES[masaIndex] || MASA_NAMES[0],
    samvatsara: SAMVATSARA_NAMES[samvatsaraIndex] || SAMVATSARA_NAMES[0],
    ritu: RITU_NAMES[rituIndex] || RITU_NAMES[0],
    ayana,
    tithiTransition,
    nakshatraTransition,
    yogaTransition,
    karanaTransition,
    choghadiya,
    hora,
    amritKalam,
    varjyam,
    brahmaMuhurta: namedMuhurtas.brahmaMuhurta,
    godhuli: namedMuhurtas.godhuli,
    sandhyaKaal: namedMuhurtas.sandhyaKaal,
    nishitaKaal: namedMuhurtas.nishitaKaal,
    dishaShool,
    sarvarthaSiddhi,
    vikramSamvat,
    shakaSamvat,
    purnimantMasa,
    amantMasa,
    ayanamsha,
    sunSign,
    moonSign,
    dinamana,
    ratrimana,
    madhyahna,
    vijayaMuhurta,
    durMuhurtam,
    gandaMoola,
    anandadiYoga,
    raviYoga,
    kaliAhargana,
    kaliyugaYear,
    julianDay,
    panchaka,
    shivaVaas,
    agniVaas,
    chandraVaas,
  };
}
