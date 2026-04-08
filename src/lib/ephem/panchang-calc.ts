import {
  dateToJD, calculateTithi, calculateYoga, calculateKarana,
  sunLongitude, moonLongitude, toSidereal,
  getNakshatraNumber, getNakshatraPada, getRashiNumber,
  approximateSunrise, approximateSunset, formatTime,
  calculateRahuKaal, getPlanetaryPositions,
  getMasa, MASA_NAMES, RITU_NAMES, SAMVATSARA_NAMES,
  getSamvatsara, getRitu, getAyana, lahiriAyanamsha, normalizeDeg,
} from './astronomical';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import { TITHIS } from '@/lib/constants/tithis';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
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
  tzOffset: number; // hours from UTC (e.g., 5.5 for IST) — resolved for this date
  timezone?: string; // IANA timezone (e.g., 'Europe/Zurich') for per-JD DST resolution
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
  timezone?: string, // IANA timezone for per-JD DST resolution
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

  // ── Find START time: scan backward looking for the PREVIOUS value ──
  // PyJHora approach: find when the previous tithi/nakshatra ended (= when ours started).
  // The previous value is currentValue - 1 (with wrapping).
  const prevValue = currentValue === 1 ? wrapMax : currentValue - 1;
  const minJd = jdSunrise - 1.5;
  let startJdResult = jdSunrise; // fallback

  // Scan backward for the previous value, then binary search the transition
  for (let jd = jdSunrise - step; jd >= minJd; jd -= step) {
    const val = getter(jd);
    if (val === prevValue) {
      // Found the previous value — transition is between here and the next step
      let lo = jd, hi = jd + step;
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        if (getter(mid) !== currentValue) lo = mid; else hi = mid;
      }
      startJdResult = (lo + hi) / 2;
      break;
    }
    if (val !== currentValue && val !== prevValue) {
      // Hit a value that's neither current nor previous — very short intermediate tithi.
      // Binary search between here and sunrise for where current value starts.
      let lo = jd, hi = jdSunrise;
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        if (getter(mid) !== currentValue) lo = mid; else hi = mid;
      }
      startJdResult = (lo + hi) / 2;
      break;
    }
  }

  // Next value
  const nextValue = getter(endTransitionJd + 0.001);
  const nextIndex = nextValue - 1;
  const nextData = dataArray[nextIndex] || dataArray[0];

  // Resolve timezone offset per-JD to handle DST transitions correctly
  const resolveOffsetForJd = (jd: number): number => {
    if (!timezone) return tzOffset;
    // Convert JD to approximate date for timezone resolution
    const localJd = jd + tzOffset / 24; // approximate local JD
    const z = Math.floor(localJd + 0.5);
    const a = z < 2299161 ? z : (() => { const alpha = Math.floor((z - 1867216.25) / 36524.25); return z + 1 + alpha - Math.floor(alpha / 4); })();
    const b = a + 1524; const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c); const e = Math.floor((b - d) / 30.6001);
    const dy = b - d - Math.floor(30.6001 * e);
    const mo = e < 14 ? e - 1 : e - 13;
    const yr = mo > 2 ? c - 4716 : c - 4715;
    return getUTCOffsetForDate(yr, mo, dy, timezone);
  };

  const startTz = resolveOffsetForJd(startJdResult);
  const endTz = resolveOffsetForJd(endTransitionJd);

  return {
    startTime: formatTime(jdToDecimalHoursUT(startJdResult, jdSunrise), startTz),
    startDate: jdToLocalDate(startJdResult, startTz),
    endTime: formatTime(jdToDecimalHoursUT(endTransitionJd, jdSunrise), endTz),
    endDate: jdToLocalDate(endTransitionJd, endTz),
    nextName: nextData.name,
    nextNumber: nextValue,
    startJD: startJdResult,
    endJD: endTransitionJd,
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

// Varjyam (Thyajyam) and Amrit Kalam ghati offset tables.
// Source: Drik Panchang Thyajyam tutorial + WisdomLib Prashna Marga.
//
// IMPORTANT: 1 ghati = 1/60th of the nakshatra's ACTUAL duration (NOT fixed 24 min).
// Offset formula: nakshatra_start + (ghati / 60) * nakshatra_duration
// Duration of window: 4 ghatis = (4/60) * nakshatra_duration

// Varjyam (inauspicious) ghati offsets from nakshatra start.
// Some nakshatras have TWO Varjyam windows (dual Thyajyam).
// Primary offset is always used; secondary (if present) gives a second window.
// Drik Panchang shows whichever window falls within the panchang day.
const VARJYAM_GHATI: number[] = [
  50, 24, 30, 40, 15,  // Ashwini(1)-Mrigashira(5) — Mrigashira(5):14→15
  26, 17, 31, 32, 30,  // Ardra(6)-Magha(10) — Ardra(6):21→26, Punarvasu(7):30→17, Pushya(8):20→31
  20, 24, 22, 20, 14,  // P.Phalguni(11)-Swati(15) — U.Phalguni(12): 18→24 Drik verified
  14, 10, 14, 20, 24,  // Vishakha(16)-P.Ashadha(20)
  20, 10, 10, 18, 16,  // U.Ashadha(21)-P.Bhadra(25)
  26, 30,              // U.Bhadra(26)-Revati(27) — U.Bhadra(26): 24→26 Drik verified
];
// Secondary Varjyam offset for nakshatras with dual Thyajyam.
// -1 means no second window. Verified against Drik: Mula has dual at 20+56.
const VARJYAM_GHATI_2: number[] = [
  -1, -1, -1, -1, -1,  // Ashwini(1)-Mrigashira(5)
  -1, -1, -1, -1, -1,  // Ardra(6)-Magha(10)
  -1, -1, -1, -1, -1,  // P.Phalguni(11)-Swati(15)
  -1, -1, -1, 56, -1,  // Vishakha(16)-P.Ashadha(20) — Mula(19) dual verified
  -1, -1, -1, -1, -1,  // U.Ashadha(21)-P.Bhadra(25)
  -1, -1,              // U.Bhadra(26)-Revati(27)
];

// Amrit Kalam (auspicious) ghati offset from nakshatra start
// Source: WisdomLib Amrutha Ghatika (Prashna Marga), verified vs Drik Panchang output
const AMRIT_GHATI: number[] = [
  42, 48, 54, 52, 38,  // Ashwini(1)-Mrigashira(5)
  35, 54, 44, 56, 54,  // Ardra(6)-Magha(10)
  44, 42, 45, 44, 38,  // P.Phalguni(11)-Swati(15)
  38, 34, 38, 44, 48,  // Vishakha(16)-P.Ashadha(20)
  38, 34, 43, 42, 40,  // U.Ashadha(21)-P.Bhadra(25) — U.Ash(21):44→38, Dhanishtha(23):34→43 Drik verified
  49, 54,              // U.Bhadra(26)-Revati(27) — U.Bhadra(26):48→49 Drik verified
];

interface TimeWindow { start: string; end: string }

function computeAmritVarjyamForNakshatra(
  nakshatraNum: number,
  nakshatraStartJD: number,
  nakshatraEndJD: number,
  jdMidnight: number,
  tzOffset: number,
): { amrit?: TimeWindow; varjyam: TimeWindow[] } {
  const nakIdx = nakshatraNum - 1;
  if (nakIdx < 0 || nakIdx >= 27) return { varjyam: [] };
  const nakshatraDurationHrs = (nakshatraEndJD - nakshatraStartJD) * 24;
  if (nakshatraDurationHrs <= 0) return { varjyam: [] };

  const ghatiToHrs = nakshatraDurationHrs / 60;
  const durationHrs = 4 * ghatiToHrs;
  const ingressUT = (nakshatraStartJD - jdMidnight) * 24;

  // Primary Varjyam window
  const varjyamWindows: TimeWindow[] = [];
  const v1Start = ingressUT + VARJYAM_GHATI[nakIdx] * ghatiToHrs;
  varjyamWindows.push({ start: formatTime(v1Start, tzOffset), end: formatTime(v1Start + durationHrs, tzOffset) });

  // Secondary Varjyam window (dual Thyajyam — e.g. Mula has 20 AND 56 ghatis)
  if (VARJYAM_GHATI_2[nakIdx] >= 0) {
    const v2Start = ingressUT + VARJYAM_GHATI_2[nakIdx] * ghatiToHrs;
    varjyamWindows.push({ start: formatTime(v2Start, tzOffset), end: formatTime(v2Start + durationHrs, tzOffset) });
  }

  // Amrit Kalam
  const amritStartUT = ingressUT + AMRIT_GHATI[nakIdx] * ghatiToHrs;

  return {
    amrit: { start: formatTime(amritStartUT, tzOffset), end: formatTime(amritStartUT + durationHrs, tzOffset) },
    varjyam: varjyamWindows,
  };
}

// Compute Amrit Kalam & Varjyam for BOTH nakshatras active during the panchang day.
// Drik Panchang shows windows from the current nakshatra AND the next one if it
// transitions during the day. Returns arrays of windows, not just one.
function computeAllAmritVarjyam(
  nakNum1: number, nak1StartJD: number, nak1EndJD: number,
  nakNum2: number | undefined, nak2EndJD: number | undefined,
  jdMidnight: number, jdSunrise: number, tzOffset: number,
): { amritKalam: TimeWindow[]; varjyam: TimeWindow[] } {
  const amritAll: TimeWindow[] = [];
  const varjyamAll: TimeWindow[] = [];

  // Current nakshatra (may produce 1-2 Varjyam windows for dual-Thyajyam nakshatras)
  const w1 = computeAmritVarjyamForNakshatra(nakNum1, nak1StartJD, nak1EndJD, jdMidnight, tzOffset);
  if (w1.amrit) amritAll.push(w1.amrit);
  varjyamAll.push(...w1.varjyam);

  // Next nakshatra (if it starts during this panchang day, i.e. before next sunrise)
  if (nakNum2 && nak2EndJD) {
    const nak2StartJD = nak1EndJD;
    const w2 = computeAmritVarjyamForNakshatra(nakNum2, nak2StartJD, nak2EndJD, jdMidnight, tzOffset);
    if (w2.amrit) amritAll.push(w2.amrit);
    varjyamAll.push(...w2.varjyam);
  }

  return { amritKalam: amritAll, varjyam: varjyamAll };
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
// Source: Drik Panchang, Prokerala, Shubh Panchang (all three agree)
// Key: weekday (0-6) → set of nakshatra numbers that form Sarvartha Siddhi
const SARVARTHA_SIDDHI: Record<number, Set<number>> = {
  0: new Set([8, 9, 12, 13, 19, 21, 26]),  // Sunday: Pushya, Ashlesha, U.Phalguni, Hasta, Mula, U.Ashadha, U.Bhadra
  1: new Set([4, 5, 8, 17, 22]),            // Monday: Rohini, Mrigashira, Pushya, Anuradha, Shravana
  2: new Set([1, 3, 9, 26]),                // Tuesday: Ashwini, Krittika, Ashlesha, U.Bhadra
  3: new Set([3, 4, 5, 13, 17]),            // Wednesday: Krittika, Rohini, Mrigashira, Hasta, Anuradha
  4: new Set([1, 7, 8, 17, 27]),            // Thursday: Ashwini, Punarvasu, Pushya, Anuradha, Revati
  5: new Set([1, 7, 17, 22, 27]),           // Friday: Ashwini, Punarvasu, Anuradha, Shravana, Revati
  6: new Set([4, 15, 22]),                  // Saturday: Rohini, Swati, Shravana
};

// ──────────────────────────────────────────────────────────────
// Moonrise / Moonset — iterative horizon-crossing calculation
// ──────────────────────────────────────────────────────────────

// ── Helpers for Moon position ──
const _mr = (d: number) => d * Math.PI / 180;
const _md = (r: number) => r * 180 / Math.PI;
const _mn = (d: number) => ((d % 360) + 360) % 360;

/**
 * Compute Moon's fundamental arguments for Meeus Tables 47.A/B
 */
function _moonFundamentals(jdAt: number) {
  const t = (jdAt - 2451545.0) / 36525;
  return {
    t,
    D: _mr(_mn(297.8501921 + 445267.1114034 * t - 0.0018819 * t * t)),
    M: _mr(_mn(357.5291092 + 35999.0502909 * t - 0.0001536 * t * t)),
    Mp: _mr(_mn(134.9633964 + 477198.8675055 * t + 0.0087414 * t * t)),
    F: _mr(_mn(93.2720950 + 483202.0175233 * t - 0.0036539 * t * t)),
    E: 1 - 0.002516 * t,
  };
}

/**
 * Compute Moon's ecliptic latitude using Meeus Table 47.B (top 13 terms).
 */
function _meeusMoonLatitude(jdAt: number): number {
  const { D, M, Mp, F, E } = _moonFundamentals(jdAt);
  const sumB =
    5128122 * Math.sin(F) +
    280602 * Math.sin(Mp + F) +
    277693 * Math.sin(Mp - F) +
    173237 * Math.sin(2 * D - F) +
    55413 * Math.sin(2 * D - Mp + F) +
    46271 * Math.sin(2 * D - Mp - F) +
    32573 * Math.sin(2 * D + F) +
    17198 * Math.sin(2 * Mp + F) +
    9266 * Math.sin(2 * D + Mp - F) +
    8822 * Math.sin(2 * Mp - F) +
    8216 * Math.sin(2 * D - M - F) * E +
    4324 * Math.sin(2 * D - 2 * Mp - F) +
    4200 * Math.sin(2 * D + Mp + F);
  return sumB / 1000000; // degrees
}

/**
 * Compute Moon's horizontal parallax from distance (Meeus Table 47.A cosine terms).
 * Returns parallax in degrees.
 */
function _meeusMoonParallax(jdAt: number): number {
  const { D, M, Mp, F, E } = _moonFundamentals(jdAt);
  const E2 = E * E;

  // Table 47.A cosine (distance) terms — top 14 terms
  // Each: [D, M, Mp, F, cosCoeff] where cosCoeff is in meters
  let sumR = 0;
  const DR: [number, number, number, number, number][] = [
    [0,0,1,0,-20905355], [2,0,-1,0,-3699111], [2,0,0,0,-2955968], [0,0,2,0,-569925],
    [0,1,0,0,48888], [0,0,0,2,-3149], [2,0,-2,0,246158], [2,-1,-1,0,-152138],
    [2,0,1,0,-170733], [2,-1,0,0,-204586], [0,1,-1,0,-129620], [1,0,0,0,108743],
    [0,1,1,0,104755], [2,0,0,-2,10321],
  ];
  for (const [cd, cm, cmp, cf, cr] of DR) {
    const arg = cd * D + cm * M + cmp * Mp + cf * F;
    let coeff = cr;
    const absM = Math.abs(cm);
    if (absM === 1) coeff *= E;
    else if (absM === 2) coeff *= E2;
    sumR += coeff * Math.cos(arg);
  }

  const distanceKm = 385000.56 + sumR / 1000; // km
  // Horizontal parallax: sin(HP) = 6378.14 / distance
  const hp = _md(Math.asin(6378.14 / distanceKm));
  return hp;
}

/**
 * Compute Moon's RA and Dec from ecliptic longitude and latitude.
 * Uses proper nutation-corrected obliquity.
 */
function getMoonEquatorial(jdAt: number): { dec: number; ra: number } {
  const moonLon = moonLongitude(jdAt);
  const moonLat = _meeusMoonLatitude(jdAt);
  const t = (jdAt - 2451545.0) / 36525;
  // Full obliquity with nutation (Meeus Ch. 22)
  const eps0 = 23.0 + 26.0 / 60 + 21.448 / 3600
    - (46.8150 / 3600) * t - (0.00059 / 3600) * t * t + (0.001813 / 3600) * t * t * t;
  const omega = _mr(125.04 - 1934.136 * t);
  const obliquity = _mr(eps0 + 0.00256 * Math.cos(omega)); // nutation in obliquity
  const lonRad = _mr(moonLon);
  const latRad = _mr(moonLat);
  const sinDec = Math.sin(latRad) * Math.cos(obliquity) + Math.cos(latRad) * Math.sin(obliquity) * Math.sin(lonRad);
  const dec = Math.asin(sinDec);
  const y = Math.sin(lonRad) * Math.cos(obliquity) - Math.tan(latRad) * Math.sin(obliquity);
  const x = Math.cos(lonRad);
  let ra = Math.atan2(y, x);
  if (ra < 0) ra += 2 * Math.PI;
  return { dec: _md(dec), ra: _md(ra) };
}

/**
 * Compute Moon's altitude above the horizon at a given JD for a given location.
 * Applies topocentric parallax correction for the Moon's proximity.
 */
function moonAltitude(jdAt: number, latRad: number, lng: number): number {
  const { dec, ra } = getMoonEquatorial(jdAt);
  const decRad = _mr(dec);
  const T = (jdAt - 2451545.0) / 36525;
  const gst = (280.46061837 + 360.98564736629 * (jdAt - 2451545.0) + 0.000387933 * T * T) % 360;
  const lst = ((gst + lng) % 360 + 360) % 360;
  const ha = _mr(lst - ra);
  const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(ha);
  const geoAlt = _md(Math.asin(sinAlt));
  // Topocentric parallax correction: Moon appears lower by ~HP * cos(alt)
  const hp = _meeusMoonParallax(jdAt);
  return geoAlt - hp * Math.cos(_mr(geoAlt));
}

/**
 * Calculate moonrise time for a given date and location.
 * Returns UT decimal hours from midnight, or null if Moon doesn't rise.
 */
export function calculateMoonriseUT(jd: number, lat: number, lng: number): number | null {
  // Moonrise occurs when the Moon's upper limb appears at the horizon.
  // Since moonAltitude() returns topocentric altitude (parallax already applied),
  // we need: h₀ = Moon_semi_diameter - atmospheric_refraction = 16'/60 - 34'/60 ≈ -0.3°
  // (Upper limb at horizon means center is 16' below; refraction lifts by 34'; net = -18')
  const h0 = -0.3;
  const latRad = (lat * Math.PI) / 180;
  const jdMidnight = Math.floor(jd - 0.5) + 0.5;
  const step = 5 / (24 * 60); // 5-minute steps in JD for better precision

  let prevAlt = moonAltitude(jdMidnight, latRad, lng);

  for (let i = 1; i <= 288; i++) { // 288 × 5min = 24 hours
    const jdNow = jdMidnight + i * step;
    const alt = moonAltitude(jdNow, latRad, lng);

    if (prevAlt < h0 && alt >= h0) {
      // Binary search for precise crossing (15 iterations → ~0.03s precision)
      let lo = jdNow - step;
      let hi = jdNow;
      for (let j = 0; j < 15; j++) {
        const mid = (lo + hi) / 2;
        if (moonAltitude(mid, latRad, lng) < h0) lo = mid;
        else hi = mid;
      }
      const riseJd = (lo + hi) / 2;
      return ((riseJd - jdMidnight) * 24 + 24) % 24;
    }
    prevAlt = alt;
  }

  return null; // Moon doesn't rise today
}

/**
 * Calculate moonset time for a given date and location.
 * Returns UT decimal hours from midnight, or null if Moon doesn't set.
 */
function calculateMoonsetUT(jd: number, lat: number, lng: number): number | null {
  const h0 = -0.3;
  const latRad = (lat * Math.PI) / 180;
  const jdMidnight = Math.floor(jd - 0.5) + 0.5;
  const step = 5 / (24 * 60);

  let prevAlt = moonAltitude(jdMidnight, latRad, lng);

  for (let i = 1; i <= 288; i++) {
    const jdNow = jdMidnight + i * step;
    const alt = moonAltitude(jdNow, latRad, lng);

    if (prevAlt >= h0 && alt < h0) {
      let lo = jdNow - step;
      let hi = jdNow;
      for (let j = 0; j < 15; j++) {
        const mid = (lo + hi) / 2;
        if (moonAltitude(mid, latRad, lng) >= h0) lo = mid;
        else hi = mid;
      }
      const setJd = (lo + hi) / 2;
      return ((setJd - jdMidnight) * 24 + 24) % 24;
    }
    prevAlt = alt;
  }

  return null; // Moon doesn't set today
}

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * Moonrise time for panchang display.
 * Scans from SUNRISE (not midnight) to match Drik Panchang convention:
 * the panchang day runs sunrise-to-sunrise, so "today's moonrise" is the
 * first moonrise AFTER this morning's sunrise.
 *
 * Returns "HH:MM" for same local calendar day, or "HH:MM, Mon DD" for next day.
 */
function getMoonriseForDisplay(jd: number, lat: number, lng: number, tzOffset: number, jdSunrise?: number): string {
  const h0 = -0.3;
  const latRad = (lat * Math.PI) / 180;
  // Start scan from sunrise (panchang day convention), not midnight
  const jdStart = jdSunrise ?? (Math.floor(jd - 0.5) + 0.5);
  const jdMidnight = Math.floor(jd - 0.5) + 0.5;
  const step = 5 / (24 * 60);

  let prevAlt = moonAltitude(jdStart, latRad, lng);

  for (let i = 1; i <= 432; i++) { // 432 × 5min = 36 hours from sunrise
    const jdNow = jdStart + i * step;
    const alt = moonAltitude(jdNow, latRad, lng);

    if (prevAlt < h0 && alt >= h0) {
      let lo = jdNow - step;
      let hi = jdNow;
      for (let j = 0; j < 15; j++) {
        const mid = (lo + hi) / 2;
        if (moonAltitude(mid, latRad, lng) < h0) lo = mid;
        else hi = mid;
      }
      const riseJd = (lo + hi) / 2;
      const utHours = (riseJd - jdMidnight) * 24;
      const localHoursRaw = utHours + tzOffset;
      const timeStr = formatTime(utHours % 24, tzOffset);
      if (localHoursRaw >= 24) {
        const dateStr = jdToLocalDate(riseJd, tzOffset);
        const [, mo, dy] = dateStr.split('-');
        return `${timeStr}, ${MONTH_ABBR[parseInt(mo) - 1]} ${parseInt(dy)}`;
      }
      return timeStr;
    }
    prevAlt = alt;
  }

  return '--:--';
}

/**
 * Moonset time for panchang display.
 * Scans 36h to catch moonsets that fall past UT midnight.
 * Returns "HH:MM" for same local calendar day, or "HH:MM, Mon DD" for next day.
 */
function getMoonsetForDisplay(jd: number, lat: number, lng: number, tzOffset: number): string {
  const h0 = -0.3;
  const latRad = (lat * Math.PI) / 180;
  const jdMidnight = Math.floor(jd - 0.5) + 0.5;
  const step = 5 / (24 * 60);

  let prevAlt = moonAltitude(jdMidnight, latRad, lng);

  for (let i = 1; i <= 432; i++) {
    const jdNow = jdMidnight + i * step;
    const alt = moonAltitude(jdNow, latRad, lng);

    if (prevAlt >= h0 && alt < h0) {
      let lo = jdNow - step;
      let hi = jdNow;
      for (let j = 0; j < 15; j++) {
        const mid = (lo + hi) / 2;
        if (moonAltitude(mid, latRad, lng) >= h0) lo = mid;
        else hi = mid;
      }
      const setJd = (lo + hi) / 2;
      const utHours = (setJd - jdMidnight) * 24;
      const localHoursRaw = utHours + tzOffset;
      const timeStr = formatTime(utHours % 24, tzOffset);
      if (localHoursRaw >= 24) {
        const dateStr = jdToLocalDate(setJd, tzOffset);
        const [, mo, dy] = dateStr.split('-');
        return `${timeStr}, ${MONTH_ABBR[parseInt(mo) - 1]} ${parseInt(dy)}`;
      }
      return timeStr;
    }
    prevAlt = alt;
  }

  return '--:--';
}

export function computePanchang(input: PanchangInput): PanchangData {
  const { year, month, day, lat, lng, tzOffset, timezone, locationName } = input;

  // Compute Julian Day at midnight UT for this date
  const jd = dateToJD(year, month, day, 12 - tzOffset); // Convert local noon to UT

  // Sunrise and sunset — use 2-pass algorithm from astronomy module for accuracy
  const sunTimes = getSunTimes(year, month, day, lat, lng, tzOffset);
  const sunriseLocal = sunTimes.sunrise.getHours() + sunTimes.sunrise.getMinutes() / 60 + sunTimes.sunrise.getSeconds() / 3600;
  const sunsetLocal = sunTimes.sunset.getHours() + sunTimes.sunset.getMinutes() / 60 + sunTimes.sunset.getSeconds() / 3600;
  // Convert local time back to UT for internal calculations
  const sunriseUT = sunriseLocal - tzOffset;
  const sunsetUT = sunsetLocal - tzOffset;

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

  // Yamaganda (inauspicious period, similar 1/8-day segment structure to Rahu Kaal)
  //
  // Traditional order from Dharma Sindhu / Muhurta Chintamani:
  //   Sun=5, Mon=4, Tue=3, Wed=7, Thu=2, Fri=1, Sat=6
  //
  // The segment number is 1-based: segment N occupies
  //   [sunrise + (N-1) * 1/8 day, sunrise + N * 1/8 day].
  // Verified against Drik Panchang output (Apr 8 2026 Wed = segment 2).
  // The descending 5→4→3→2→1 pattern from Sunday to Thursday is standard.
  // Friday/Saturday get segments 7 and 6 respectively.
  const yamaOrder = [5, 4, 3, 2, 1, 7, 6]; // Sun Mon Tue Wed Thu Fri Sat
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

  // Abhijit Muhurta — the 8th daytime muhurta (around midday).
  // This is universally considered auspicious EXCEPT on Wednesdays.
  //
  // Classical rule (Muhurta Chintamani, Dharma Sindhu): "On Budha-vara
  // (Wednesday), Abhijit Muhurta is inauspicious and should be avoided."
  //
  // HISTORICAL BUG (now fixed): the Wednesday exclusion was described in a
  // comment nearby but never implemented in code.  The muhurta was returned
  // as auspicious on all 7 weekdays.  Now `available: false` is set on
  // Wednesdays so callers and the UI can present the correct guidance.
  const abhijitStart = sunriseUT + 7 * dayMuhurtaDuration;
  const abhijitEnd = abhijitStart + dayMuhurtaDuration;
  const abhijitMuhurta = {
    start: formatTime(abhijitStart, tzOffset),
    end: formatTime(abhijitEnd, tzOffset),
    // available=false on Wednesday (weekday=3); true all other days
    available: weekday !== 3,
  };

  // Masa, Ritu, Samvatsara
  const sunSid = toSidereal(sunLongitude(jdSunrise), jdSunrise);
  const masaIndex = getMasa(sunSid);
  const rituIndex = getRitu(masaIndex);
  const samvatsaraIndex = getSamvatsara(year);
  const ayana = getAyana(sunSid);

  // ── Transition times (with per-JD DST resolution) ──
  const tithiTransition = computeTransition(
    tithiResult.number,
    (jd) => calculateTithi(jd).number,
    findTithiTransition,
    jdSunrise, tzOffset, TITHIS, 30, timezone,
  );

  const nakshatraTransition = computeTransition(
    nakshatraNum,
    (jd) => getNakshatraNumber(toSidereal(moonLongitude(jd), jd)),
    findNakshatraTransition,
    jdSunrise, tzOffset, NAKSHATRAS, 27, timezone,
  );

  const yogaTransition = computeTransition(
    yogaNum,
    (jd) => calculateYoga(jd),
    findYogaTransition,
    jdSunrise, tzOffset, YOGAS, 27, timezone,
  );

  const karanaTransition = computeTransition(
    karanaNum,
    (jd) => calculateKarana(jd),
    findKaranaTransition,
    jdSunrise, tzOffset, KARANAS, 11, timezone,
  );

  // ── Choghadiya ──
  const choghadiya = computeChoghadiya(sunriseUT, sunsetUT, weekday, tzOffset);

  // ── Hora ──
  const hora = computeHora(sunriseUT, sunsetUT, weekday, tzOffset);

  // ── Amrit Kalam & Varjyam ──
  // Compute for BOTH nakshatras active during the panchang day (sunrise to next sunrise).
  // Drik Panchang shows all Varjyam/Amrit windows from both nakshatras.
  const jdMidnight = Math.floor(jd - 0.5) + 0.5;
  const nak1StartJD = nakshatraTransition?.startJD ?? (jdSunrise - 0.5);
  const nak1EndJD = nakshatraTransition?.endJD ?? (jdSunrise + 0.5);
  const nextNakNum = nakshatraTransition?.nextNumber;
  // Approximate next nakshatra end: same duration as current (~1 day avg)
  const nak2EndJD = nextNakNum ? nak1EndJD + (nak1EndJD - nak1StartJD) : undefined;

  const { amritKalam: amritKalamAll, varjyam: varjyamAll } = computeAllAmritVarjyam(
    nakshatraNum, nak1StartJD, nak1EndJD,
    nextNakNum, nak2EndJD,
    jdMidnight, jdSunrise, tzOffset,
  );
  // For backward compatibility: single-window fields use first entry
  const amritKalam = amritKalamAll[0] ?? undefined;
  const varjyam = varjyamAll[0] ?? undefined;

  // ── Named Muhurtas ──
  const namedMuhurtas = computeNamedMuhurtas(sunriseUT, sunsetUT, tzOffset);

  // ── Disha Shool ──
  const dishaShool = DISHA_SHOOL_DATA[weekday];

  // ── Sarvartha Siddhi Yoga ──
  // Check both sunrise nakshatra AND the next nakshatra (if it transitions during the day).
  // Drik Panchang shows SS from the transition time when the next nakshatra qualifies.
  const ssSet = SARVARTHA_SIDDHI[weekday];
  const sarvarthaSiddhi = (ssSet?.has(nakshatraNum) ?? false)
    || (nakshatraTransition?.nextNumber !== undefined && (ssSet?.has(nakshatraTransition.nextNumber) ?? false));

  // ── Enhanced fields (Drikpanchang-style) ──

  // Vikram Samvat: offset ~57 years from CE (Chaitra-based, roughly year+57)
  const vikramSamvat = (month >= 4) ? year + 57 : year + 56;
  // Shaka Samvat: offset ~78 years from CE
  const shakaSamvat = (month >= 4) ? year - 78 : year - 79;

  // Purnimant vs Amant masa — two competing calendar systems used across India
  //
  // DEFINITIONS:
  //   • Amant (South India, Gujarat, Maharashtra): lunar month ends at Amavasya.
  //     The month name tracks the current solar month (masaIndex).
  //     Month does NOT change during Krishna Paksha — only at Amavasya.
  //
  //   • Purnimant (North India, Punjab, Rajasthan): lunar month ends at Purnima.
  //     After Purnima (i.e., during Krishna Paksha, tithis 16–30), Purnimant has
  //     already entered the NEXT month, even though Amant still shows the old one.
  //     So during Krishna Paksha: purnimantIndex = (masaIndex + 1) % 12.
  //
  // RELATIONSHIP: The two systems are always either in sync (Shukla Paksha)
  // or exactly one month apart (Krishna Paksha).
  //
  // HISTORICAL BUG (now fixed): the code previously advanced Amant (not Purnimant)
  // during Krishna Paksha — exactly backwards.  Both systems are derived from the
  // same masaIndex (Sun's sidereal position); only the advancement rule differs.
  const amantMasa      = MASA_NAMES[masaIndex] || MASA_NAMES[0]; // never changes within the month
  const purnimantMasaIdx = tithiResult.number > 15 ? (masaIndex + 1) % 12 : masaIndex;
  const purnimantMasa  = MASA_NAMES[purnimantMasaIdx] || MASA_NAMES[0];

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

  // 1. Vijaya Muhurta — 11th daytime muhurta (0-indexed 10).
  // Verified: Drik Panchang Apr 8 2026 Bern shows 15:45-16:38 = muhurta index 10.
  const muhurtaDuration = dayDuration / 15;
  const vijayaStartUT = sunriseUT + 10 * muhurtaDuration;
  const vijayaEndUT = sunriseUT + 11 * muhurtaDuration;
  const vijayaMuhurta = {
    start: formatTime(vijayaStartUT, tzOffset),
    end: formatTime(vijayaEndUT, tzOffset),
  };

  // 2. Dur Muhurtam (inauspicious muhurta windows by weekday)
  // Dur Muhurtam (inauspicious muhurta) — 0-indexed muhurta positions from sunrise.
  // Source: Nirṇaya Sindhu / Kaala Prakashika, verified against Drik Panchang
  // (Wednesday Apr 8 2026 = single window 13:02-13:55 = muhurta index 7).
  const DUR_MUHURTAM_INDICES: number[][] = [
    [6, 10], // Sunday    — 7th & 11th muhurta
    [5],     // Monday    — 6th muhurta
    [7],     // Tuesday   — 8th muhurta
    [7],     // Wednesday — 8th muhurta (Drik verified)
    [3],     // Thursday  — 4th muhurta
    [4, 8],  // Friday    — 5th & 9th muhurta
    [1],     // Saturday  — 2nd muhurta
  ];
  const durMuhurtam = (DUR_MUHURTAM_INDICES[weekday] || [6]).map(idx => {
    const s = sunriseUT + idx * muhurtaDuration;
    const e = s + muhurtaDuration;
    return { start: formatTime(s, tzOffset), end: formatTime(e, tzOffset) };
  });

  // 3. Ganda Moola — with time window (sunrise to nakshatra end, or full day if no transition)
  // Drik shows: "Ganda Moola 06:56 AM to 05:18 AM, Apr 09" = sunrise to nakshatra end
  const GANDA_MOOLA_NAKSHATRAS = new Set([1, 9, 10, 18, 19, 27]);
  const gandaMoolaActive = GANDA_MOOLA_NAKSHATRAS.has(nakshatraNum);
  const gandaMoola: {
    active: boolean;
    nakshatra?: { en: string; hi: string; sa: string };
    start?: string;
    end?: string;
    endDate?: string;
  } = { active: gandaMoolaActive };
  if (gandaMoolaActive) {
    gandaMoola.nakshatra = NAKSHATRAS[nakshatraNum - 1]?.name;
    gandaMoola.start = formatTime(sunriseUT, tzOffset); // starts at sunrise (panchang day start)
    if (nakshatraTransition?.endTime) {
      gandaMoola.end = nakshatraTransition.endTime;
      gandaMoola.endDate = nakshatraTransition.endDate;
    }
  }

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

  // Anandadi Yoga index formula (Muhurta Chintamani / Drik Panchang convention):
  //   index = (tithi + vara - 2) % 9
  // where tithi is 1-based (1–30) and vara is 1-based (Sun=1 … Sat=7).
  //
  // JS Date.getDay() returns 0-based (Sun=0 … Sat=6), so vara = weekday + 1.
  // Substituting: (tithi + (weekday+1) - 2) % 9 = (tithi + weekday - 1) % 9
  //
  // HISTORICAL BUG (now fixed): the expression used -2 instead of -1, which
  // shifted every result by -1 mod 9.  Concrete example — Sunday Pratipada:
  //   Wrong:   (1 + 0 - 2 + 900) % 9 = 8  → Roga (inauspicious)
  //   Correct: (1 + 0 - 1 + 900) % 9 = 0  → Ananda (auspicious)
  // Every Anandadi Yoga label shown in the app was wrong before this fix.
  const anandadiIdx = (tithiResult.number + weekday - 1 + 9 * 100) % 9;
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
  // Panchaka type by weekday — Dharma Sindhu / Nirṇaya Sindhu classification.
  // Determines the nature of the Panchaka period when Moon is in nakshatras 23-27.
  //
  // HISTORICAL BUG (now fixed): key 3 (Wednesday = Chora Panchaka) was missing.
  // When the Moon was in Panchaka nakshatras on a Wednesday, the PANCHAKA_TYPE
  // lookup returned undefined, and the `|| PANCHAKA_DEFAULT` fallback silently
  // produced a generic "Panchaka" label with no qualifying type name.  The
  // correct Wednesday type is Chora Panchaka (associated with theft/deception).
  const PANCHAKA_TYPE: Record<number, { en: string; hi: string; sa: string }> = {
    0: { en: 'Mrityu Panchaka',  hi: 'मृत्यु पंचक',  sa: 'मृत्युपञ्चकम्' }, // Sunday
    1: { en: 'Raja Panchaka',    hi: 'राज पंचक',     sa: 'राजपञ्चकम्' },    // Monday
    2: { en: 'Agni Panchaka',    hi: 'अग्नि पंचक',   sa: 'अग्निपञ्चकम्' },  // Tuesday
    3: { en: 'Chora Panchaka',   hi: 'चोर पंचक',     sa: 'चोरपञ्चकम्' },    // Wednesday (was missing)
    4: { en: 'Raja Panchaka',    hi: 'राज पंचक',     sa: 'राजपञ्चकम्' },    // Thursday
    5: { en: 'Chora Panchaka',   hi: 'चोर पंचक',     sa: 'चोरपञ्चकम्' },    // Friday
    6: { en: 'Roga Panchaka',    hi: 'रोग पंचक',     sa: 'रोगपञ्चकम्' },    // Saturday
  };
  const PANCHAKA_DEFAULT = { en: 'Panchaka', hi: 'पंचक', sa: 'पञ्चकम्' };
  const panchaka = {
    active: panchakaActive,
    type: panchakaActive ? (PANCHAKA_TYPE[weekday] || PANCHAKA_DEFAULT) : undefined,
  };

  // 8. Tamil Yoga (Chandrashtama-based) — day quality from Moon-Sun angle modulo
  // (tithiNum + weekday + nakshatraNum) mod 9 → 9 Tamil quality names
  const TAMIL_YOGA_NAMES: { en: string; hi: string; sa: string }[] = [
    { en: 'Siddha Yoga', hi: 'सिद्ध योग', sa: 'सिद्धयोगः' },
    { en: 'Marana Yoga', hi: 'मरण योग', sa: 'मरणयोगः' },
    { en: 'Amrita Yoga', hi: 'अमृत योग', sa: 'अमृतयोगः' },
    { en: 'Prabalarista Yoga', hi: 'प्रबलारिष्ट योग', sa: 'प्रबलारिष्टयोगः' },
    { en: 'Siddha Yoga', hi: 'सिद्ध योग', sa: 'सिद्धयोगः' },
    { en: 'Mrityu Yoga', hi: 'मृत्यु योग', sa: 'मृत्युयोगः' },
    { en: 'Amrita Yoga', hi: 'अमृत योग', sa: 'अमृतयोगः' },
    { en: 'Roga Yoga', hi: 'रोग योग', sa: 'रोगयोगः' },
    { en: 'Siddha Yoga', hi: 'सिद्ध योग', sa: 'सिद्धयोगः' },
  ];
  const TAMIL_YOGA_AUSPICIOUS = new Set([0, 2, 4, 6, 8]); // Siddha and Amrita
  const tamilYogaIdx = (tithiResult.number + weekday + nakshatraNum) % 9;
  const tamilYoga = {
    name: TAMIL_YOGA_NAMES[tamilYogaIdx],
    nature: TAMIL_YOGA_AUSPICIOUS.has(tamilYogaIdx) ? 'auspicious' as const : 'inauspicious' as const,
  };

  // 9. Mantri Mandala (Planetary cabinet) — planet ruling the day acts as "king"
  // The planet ruling the hora at sunrise is the "minister"
  const MANTRI_ROLES: { en: string; hi: string; sa: string }[] = [
    { en: 'King', hi: 'राजा', sa: 'राजा' },
    { en: 'Minister', hi: 'मंत्री', sa: 'मन्त्री' },
    { en: 'Commander', hi: 'सेनापति', sa: 'सेनापतिः' },
    { en: 'Servant', hi: 'सेवक', sa: 'सेवकः' },
    { en: 'Enemy', hi: 'शत्रु', sa: 'शत्रुः' },
  ];

  // Weekday → ruling planet (day lord) mapping.
  // JS weekday: 0=Sunday, 1=Monday, …, 6=Saturday.
  // Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn.
  // This is simply the one-to-one correspondence between day names and their
  // ruling grahas (Sun-day, Moon-day, Mars-day, Mercury-day, Jupiter-day,
  // Venus-day, Saturn-day).
  //
  // HISTORICAL BUG (now fixed): WEEKDAY_PLANET_MAP was identical to the Hora
  // sequence [0,3,6,2,5,1,4], which is a CHALDEAN order used for computing
  // hora lords — NOT weekday lords.  As a result Monday→Mercury(3),
  // Tuesday→Saturn(6), etc., were all wrong.  Only Sunday was accidentally
  // correct because both arrays start with Sun(0).
  const WEEKDAY_PLANET_MAP = [0, 1, 2, 3, 4, 5, 6]; // Sun Mon Tue Wed Thu Fri Sat → planet IDs

  const dayLordPlanet = WEEKDAY_PLANET_MAP[weekday];

  // Chaldean hora sequence: Sun(0)→Venus(5)→Mercury(3)→Moon(1)→Saturn(6)→Jupiter(4)→Mars(2)
  // Each hora lasts 1/12 of daylight (day horas) or 1/12 of night (night horas).
  // The 1st hora at sunrise belongs to the day lord; subsequent horas advance
  // through the Chaldean sequence from the day lord's position.
  const CHALDEAN_SEQ = [0, 5, 3, 1, 6, 4, 2]; // planet IDs in Chaldean order
  const dayLordChaldeanIdx = CHALDEAN_SEQ.indexOf(dayLordPlanet);
  const horaDayLen = sunsetUT - sunriseUT;        // hours of daylight
  const horaNightLen = 24 - horaDayLen;           // hours of night
  const dayHoraDur = horaDayLen / 12;             // each day hora duration
  const nightHoraDur = horaNightLen / 12;         // each night hora duration

  // Compute all 24 horas for the day (12 day + 12 night)
  const horas: { planet: number; start: number; end: number; isDay: boolean }[] = [];
  for (let i = 0; i < 12; i++) {
    const start = sunriseUT + i * dayHoraDur;
    horas.push({ planet: CHALDEAN_SEQ[(dayLordChaldeanIdx + i) % 7], start, end: start + dayHoraDur, isDay: true });
  }
  for (let i = 0; i < 12; i++) {
    const start = sunsetUT + i * nightHoraDur;
    horas.push({ planet: CHALDEAN_SEQ[(dayLordChaldeanIdx + 12 + i) % 7], start, end: start + nightHoraDur, isDay: false });
  }

  // Find current hora (use noon as representative "current" time for daily panchang)
  const noonUT = sunriseUT + horaDayLen / 2;
  const currentHora = horas.find(h => noonUT >= h.start && noonUT < h.end) || horas[0];

  const mantriMandala = {
    king: { planet: dayLordPlanet, role: MANTRI_ROLES[0] },
    minister: { planet: currentHora.planet, role: MANTRI_ROLES[1] },
    horas: horas.map(h => ({
      planet: h.planet,
      start: formatTime(h.start, tzOffset),
      end: formatTime(h.end, tzOffset),
      isDay: h.isDay,
    })),
  };

  // 10. Homahuti (Fire oblation direction)
  // On each weekday, the direction of offering ghee into the fire differs
  const HOMAHUTI_DIR: Record<number, { direction: { en: string; hi: string; sa: string }; deity: { en: string; hi: string; sa: string } }> = {
    0: { direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्' }, deity: { en: 'Surya', hi: 'सूर्य', sa: 'सूर्यः' } },
    1: { direction: { en: 'Northwest', hi: 'वायव्य', sa: 'वायव्यम्' }, deity: { en: 'Chandra', hi: 'चन्द्र', sa: 'चन्द्रः' } },
    2: { direction: { en: 'South', hi: 'दक्षिण', sa: 'दक्षिणम्' }, deity: { en: 'Mangal', hi: 'मंगल', sa: 'मङ्गलः' } },
    3: { direction: { en: 'North', hi: 'उत्तर', sa: 'उत्तरम्' }, deity: { en: 'Budha', hi: 'बुध', sa: 'बुधः' } },
    4: { direction: { en: 'Northeast', hi: 'ईशान', sa: 'ईशानम्' }, deity: { en: 'Guru', hi: 'गुरु', sa: 'गुरुः' } },
    5: { direction: { en: 'Southeast', hi: 'आग्नेय', sa: 'आग्नेयम्' }, deity: { en: 'Shukra', hi: 'शुक्र', sa: 'शुक्रः' } },
    6: { direction: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमम्' }, deity: { en: 'Shani', hi: 'शनि', sa: 'शनिः' } },
  };
  const homahuti = HOMAHUTI_DIR[weekday];

  // 11. Shiva Vaas (based on tithi)
  const tithiMod = ((tithiResult.number - 1) % 5) + 1; // groups of 5: tithi 1,6,11 → 1; 2,7,12 → 2; etc
  const SHIVA_VAAS_DATA: Record<number, { name: { en: string; hi: string; sa: string }; nature: 'auspicious' | 'inauspicious' | 'neutral' | 'mixed'; tithis: number[] }> = {
    1: { name: { en: 'Kailash (Mountain)', hi: 'कैलाश पर', sa: 'कैलासे' }, nature: 'auspicious', tithis: [1, 6, 11] },
    2: { name: { en: 'Shamshan (Cremation Ground)', hi: 'श्मशान में', sa: 'श्मशाने' }, nature: 'inauspicious', tithis: [2, 7, 12] },
    3: { name: { en: "Gori's Abode (Auspicious)", hi: 'गौरी गृह में (शुभ)', sa: 'गौरीगृहे (शुभम्)' }, nature: 'auspicious', tithis: [3, 8, 13] },
    4: { name: { en: 'Sports & Play', hi: 'क्रीड़ा में', sa: 'क्रीडायाम्' }, nature: 'neutral', tithis: [4, 9, 14] },
    0: { name: { en: 'Deep Meditation (Samadhi)', hi: 'समाधि में (अति शुभ)', sa: 'समाधौ (अतिशुभम्)' }, nature: 'mixed', tithis: [5, 10, 15, 30] },
  };
  const shivaVaasKey = tithiResult.number % 5 === 0 ? 0 : tithiMod;
  const shivaVaas = SHIVA_VAAS_DATA[shivaVaasKey];

  // 9. Agni Vaas (based on weekday) — changes at midnight (next sunrise)
  const AGNI_VAAS_DATA: Record<number, { name: { en: string; hi: string; sa: string }; nature: 'auspicious' | 'inauspicious' | 'neutral' | 'mixed' }> = {
    0: { name: { en: 'Sky (Akasha)',   hi: 'आकाश में',  sa: 'आकाशे' }, nature: 'auspicious' },
    1: { name: { en: 'Earth (Bhumi)', hi: 'भूमि पर',   sa: 'भूमौ' }, nature: 'auspicious' },
    2: { name: { en: 'Patala',        hi: 'पाताल में', sa: 'पाताले' }, nature: 'inauspicious' },
    3: { name: { en: 'Water (Jal)',   hi: 'जल में',    sa: 'जले' }, nature: 'mixed' },
    4: { name: { en: 'Sky (Akasha)',  hi: 'आकाश में',  sa: 'आकाशे' }, nature: 'auspicious' },
    5: { name: { en: 'Earth (Bhumi)', hi: 'भूमि पर',   sa: 'भूमौ' }, nature: 'auspicious' },
    6: { name: { en: 'Patala',        hi: 'पाताल में', sa: 'पाताले' }, nature: 'inauspicious' },
  };
  const agniData = AGNI_VAAS_DATA[weekday] || AGNI_VAAS_DATA[0];
  // Next day sunrise as validity end
  const nextDaySunriseUT = approximateSunrise(jdSunrise + 1, lat, lng);
  const agniValidUntil = formatTime(nextDaySunriseUT, tzOffset);
  const agniVaas = { name: agniData.name, nature: agniData.nature, validUntil: agniValidUntil };

  // 10. Chandra Vaas (based on nakshatra pada) — with direction
  const CHANDRA_VAAS_DATA: Record<number, { name: { en: string; hi: string; sa: string }; direction: { en: string; hi: string; sa: string }; nature: 'auspicious' | 'inauspicious' | 'neutral' | 'mixed' }> = {
    1: { name: { en: "Brahma's Abode", hi: 'ब्रह्म लोक',  sa: 'ब्रह्मस्थाने' }, direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्' }, nature: 'auspicious' },
    2: { name: { en: "Indra's Abode",  hi: 'इन्द्र लोक', sa: 'इन्द्रस्थाने' }, direction: { en: 'South', hi: 'दक्षिण', sa: 'दक्षिणम्' }, nature: 'neutral' },
    3: { name: { en: "Yama's Abode",   hi: 'यम लोक',     sa: 'यमस्थाने' }, direction: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमम्' }, nature: 'mixed' },
    4: { name: { en: "Soma's Abode",   hi: 'सोम लोक',    sa: 'सोमस्थाने' }, direction: { en: 'North', hi: 'उत्तर', sa: 'उत्तरम्' }, nature: 'inauspicious' },
  };
  const chandraVaas = CHANDRA_VAAS_DATA[nakshatraPada] || CHANDRA_VAAS_DATA[1];

  // 11. Rahu Vaas (direction Rahu faces, by weekday)
  const RAHU_VAAS_MAP: Record<number, { en: string; hi: string; sa: string }> = {
    0: { en: 'Southwest', hi: 'नैऋत्य', sa: 'नैऋत्यम्' },
    1: { en: 'Northwest', hi: 'वायव्य', sa: 'वायव्यम्' },
    2: { en: 'Northeast', hi: 'ईशान', sa: 'ईशानम्' },
    3: { en: 'North', hi: 'उत्तर', sa: 'उत्तरम्' },
    4: { en: 'Southeast', hi: 'आग्नेय', sa: 'आग्नेयम्' },
    5: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्' },
    6: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमम्' },
  };
  const rahuVaas = { direction: RAHU_VAAS_MAP[weekday] };

  // 12. Udaya Lagna — rising sign windows throughout the day
  // Compute ascendant at 10-min intervals from sunrise to next sunrise
  function calcAscendant(jdAt: number): number {
    const T2 = (jdAt - 2451545.0) / 36525.0;
    const gmst = 280.46061837 + 360.98564736629 * (jdAt - 2451545.0)
      + 0.000387933 * T2 * T2 - T2 * T2 * T2 / 38710000;
    const lst = normalizeDeg(gmst + lng);
    const eps = 23.4393 - 0.013 * T2;
    const epsRad = eps * Math.PI / 180;
    const latRad = lat * Math.PI / 180;
    const lstRad = lst * Math.PI / 180;
    const y = -Math.cos(lstRad);
    const x = Math.sin(epsRad) * Math.tan(latRad) + Math.cos(epsRad) * Math.sin(lstRad);
    let asc = Math.atan2(y, x) * 180 / Math.PI;
    return normalizeDeg(asc);
  }
  const lagnaAyanamsha = lahiriAyanamsha(jdSunrise);
  const udayaLagna: { rashi: number; name: { en: string; hi: string; sa: string }; start: string; end: string }[] = [];
  const STEP = 10 / 60; // 10 minutes in hours
  let prevRashi = -1;
  let segStart = sunriseUT;
  for (let h = 0; h <= 24; h += STEP) {
    const utHour = sunriseUT + h;
    const jdAt = jdSunrise + h / 24;
    const tropAsc = calcAscendant(jdAt);
    const sidAsc = normalizeDeg(tropAsc - lagnaAyanamsha);
    const rashi = Math.floor(sidAsc / 30) + 1; // 1-12
    if (prevRashi === -1) {
      prevRashi = rashi;
      segStart = utHour;
    } else if (rashi !== prevRashi) {
      // Close previous segment
      const r = RASHIS[(prevRashi - 1) % 12];
      udayaLagna.push({
        rashi: prevRashi,
        name: r?.name || { en: `Rashi ${prevRashi}`, hi: `राशि ${prevRashi}`, sa: `राशिः ${prevRashi}` },
        start: formatTime(segStart, tzOffset),
        end: formatTime(utHour, tzOffset),
      });
      prevRashi = rashi;
      segStart = utHour;
    }
  }
  // Close final segment
  if (prevRashi > 0) {
    const r = RASHIS[(prevRashi - 1) % 12];
    udayaLagna.push({
      rashi: prevRashi,
      name: r?.name || { en: `Rashi ${prevRashi}`, hi: `राशि ${prevRashi}`, sa: `राशिः ${prevRashi}` },
      start: formatTime(segStart, tzOffset),
      end: formatTime(sunriseUT + 24, tzOffset),
    });
  }

  // ── Visha Ghatika — 25th Ghatika from sunrise is inauspicious (Muhurta Chintamani) ──
  // 1 Ghatika = 24 minutes. 25th Ghatika starts 24 * 24 = 576 minutes after sunrise.
  const vishaGhatikaStartUT = sunriseUT + 576 / 60; // hours
  const vishaGhatikaEndUT   = vishaGhatikaStartUT + 24 / 60;
  const vishaGhatika = {
    start: formatTime(vishaGhatikaStartUT, tzOffset),
    end: formatTime(vishaGhatikaEndUT, tzOffset),
  };

  // ── Dagdha Tithi — 7 "burnt" Tithi+Vara combos (Muhurta Chintamani) ──
  // Inauspicious for new ventures: Chaturthi+Sun, Panchami+Mon, Saptami+Tue,
  // Ashtami+Wed, Tritiya+Thu, Shashthi+Fri, Dvadashi+Sat
  const DAGDHA_TITHI_TABLE: Record<number, number> = {
    0: 4,   // Sunday + Chaturthi (4)
    1: 5,   // Monday + Panchami (5)
    2: 7,   // Tuesday + Saptami (7)
    3: 8,   // Wednesday + Ashtami (8)
    4: 3,   // Thursday + Tritiya (3)
    5: 6,   // Friday + Shashthi (6)
    6: 12,  // Saturday + Dvadashi (12)
  };
  const currentTithiNum = tithiResult.number > 15 ? tithiResult.number - 15 : tithiResult.number;
  const dagdhaTithi = DAGDHA_TITHI_TABLE[weekday] === currentTithiNum;

  // ── Amrit Siddhi Yoga — 7 supremely auspicious Vara+Nakshatra combos (Muhurta Deepika) ──
  // Sunday+Hasta(13), Monday+Mrigashira(5), Tuesday+Ashwini(1),
  // Wednesday+Anuradha(17), Thursday+Pushya(8), Friday+Revati(27), Saturday+Rohini(4)
  const AMRIT_SIDDHI_TABLE: Record<number, number> = {
    0: 13, // Sunday + Hasta
    1: 5,  // Monday + Mrigashira
    2: 1,  // Tuesday + Ashwini
    3: 17, // Wednesday + Anuradha
    4: 8,  // Thursday + Pushya
    5: 27, // Friday + Revati
    6: 4,  // Saturday + Rohini
  };
  const amritSiddhiYoga = AMRIT_SIDDHI_TABLE[weekday] === nakshatraNum;

  // ── Bhadra (Vishti Karana) — scan entire panchang day for all Vishti windows ──
  // Vishti (#7) recurs every ~7 karanas (~3.5 tithis). Multiple Bhadra windows
  // can fall within one panchang day. Scan sunrise to sunrise+24h.
  const VISHTI_KARANA = 7;
  const bhadraWindows: { start: string; end: string; endDate?: string }[] = [];
  {
    const scanStep = 1 / 48; // 30 min steps
    const scanEnd = jdSunrise + 1.0; // 24h from sunrise
    let inBhadra = calculateKarana(jdSunrise) === VISHTI_KARANA;
    let bhadraStartJD = inBhadra ? jdSunrise : 0;
    const panchMidnight = Math.floor(jd - 0.5) + 0.5;

    for (let scan = jdSunrise + scanStep; scan <= scanEnd; scan += scanStep) {
      const isVishti = calculateKarana(scan) === VISHTI_KARANA;
      if (!inBhadra && isVishti) {
        // Entered Bhadra — refine start
        let lo = scan - scanStep, hi = scan;
        for (let j = 0; j < 12; j++) { const mid = (lo+hi)/2; if (calculateKarana(mid) !== VISHTI_KARANA) lo = mid; else hi = mid; }
        bhadraStartJD = (lo + hi) / 2;
        inBhadra = true;
      } else if (inBhadra && !isVishti) {
        // Exited Bhadra — refine end
        let lo = scan - scanStep, hi = scan;
        for (let j = 0; j < 12; j++) { const mid = (lo+hi)/2; if (calculateKarana(mid) === VISHTI_KARANA) lo = mid; else hi = mid; }
        const bhadraEndJD = (lo + hi) / 2;
        const sUT = ((bhadraStartJD - panchMidnight) * 24) % 24;
        const eUT = ((bhadraEndJD - panchMidnight) * 24) % 24;
        const startDate = jdToLocalDate(bhadraStartJD, tzOffset);
        const endDate = jdToLocalDate(bhadraEndJD, tzOffset);
        const panchDate = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        bhadraWindows.push({
          start: formatTime(sUT, tzOffset),
          end: formatTime(eUT, tzOffset),
          endDate: endDate !== startDate ? endDate : undefined,
        });
        inBhadra = false;
      }
    }
    // If still in Bhadra at scan end, close the window
    if (inBhadra && bhadraStartJD > 0) {
      const sUT = ((bhadraStartJD - panchMidnight) * 24) % 24;
      const eUT = ((scanEnd - panchMidnight) * 24) % 24;
      const endDate = jdToLocalDate(scanEnd, tzOffset);
      const startDate = jdToLocalDate(bhadraStartJD, tzOffset);
      bhadraWindows.push({
        start: formatTime(sUT, tzOffset),
        end: formatTime(eUT, tzOffset),
        endDate: endDate !== startDate ? endDate : undefined,
      });
    }
  }
  const bhadra = bhadraWindows[0] ?? undefined;

  // ── Aadal Yoga & Vidaal Yoga (Ganda Moola related) ──
  // Vidaal Yoga: active when Moon is in a Ganda Moola nakshatra (same window as Ganda Moola)
  // Aadal Yoga: junction period (~96 min) immediately AFTER the Ganda Moola nakshatra ends
  // Both shown by Drik Panchang when Ganda Moola is active.
  let aadalYoga: { start: string; end: string; endDate?: string } | undefined;
  let vidaalYoga: { start: string; end: string; endDate?: string } | undefined;
  if (gandaMoolaActive && nakshatraTransition?.endJD) {
    // Vidaal = same as Ganda Moola window
    vidaalYoga = {
      start: gandaMoola.start!,
      end: gandaMoola.end!,
      endDate: gandaMoola.endDate,
    };
    // Aadal = 96 min after Ganda Moola nakshatra ends
    const aadalStartJD = nakshatraTransition.endJD;
    const aadalEndJD = aadalStartJD + 96 / (24 * 60); // 96 minutes
    const panchMidnight = Math.floor(jd - 0.5) + 0.5;
    const aStartUT = ((aadalStartJD - panchMidnight) * 24) % 24;
    const aEndUT = ((aadalEndJD - panchMidnight) * 24) % 24;
    const aStartDate = jdToLocalDate(aadalStartJD, tzOffset);
    const aEndDate = jdToLocalDate(aadalEndJD, tzOffset);
    aadalYoga = {
      start: formatTime(aStartUT, tzOffset),
      end: formatTime(aEndUT, tzOffset),
      endDate: aEndDate !== aStartDate ? aEndDate : undefined,
    };
  }

  // ── Ravi Yoga time window (when active) ──
  // Ravi Yoga = Sun in specific nakshatra on specific weekday.
  // Active from sunrise to nakshatra end (when Sun moves to next nakshatra, it's no longer active).
  const raviYogaWindow = raviYoga ? {
    active: true,
    start: formatTime(sunriseUT, tzOffset),
    end: nakshatraTransition?.endTime || formatTime(sunsetUT, tzOffset),
    endDate: nakshatraTransition?.endDate,
  } : { active: false };

  return {
    date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    location: { lat, lng, name: locationName || `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E` },
    tithi: tithiData,
    nakshatra: nakshatraData,
    yoga: yogaData,
    karana: karanaData,
    vara: { day: weekday, name: varaData.name, ruler: varaData.ruler },
    sunLongitude: sunSidLong,
    sunrise: formatTime(sunriseUT, tzOffset),
    sunset: formatTime(sunsetUT, tzOffset),
    moonrise: getMoonriseForDisplay(jd, lat, lng, tzOffset, jdSunrise),
    moonset: getMoonsetForDisplay(jd, lat, lng, tzOffset),
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
    amritKalamAll,
    varjyamAll,
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
    rahuVaas,
    udayaLagna,
    tamilYoga,
    mantriMandala,
    homahuti,
    dagdhaTithi,
    amritSiddhiYoga,
    vishaGhatika,
    bhadra,
    bhadraAll: bhadraWindows.length > 0 ? bhadraWindows : undefined,
    aadalYoga,
    vidaalYoga,
    raviYogaWindow,
  };
}
