/**
 * Hora (Planetary Hours) Calculator
 *
 * Planetary hours divide the day (sunrise→sunset) and night (sunset→next sunrise)
 * into 12 unequal-length segments each. Each segment is ruled by a planet
 * following the Chaldean order: Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon.
 *
 * The first day-hora ruler is the weekday lord (Sunday = Sun, Monday = Moon, etc.).
 * Subsequent horas cycle through the Chaldean sequence from that starting position.
 */

import type { LocaleText } from '@/types/panchang';
import { GRAHAS } from '@/lib/constants/grahas';

// ── Types ──────────────────────────────────────────────────────────

export interface HoraEntry {
  horaNumber: number;       // 1-24
  planet: number;           // planet ID 0-6 (0=Sun … 6=Saturn). Rahu/Ketu not used in hora.
  planetName: LocaleText;
  startTime: string;        // HH:MM format (local time)
  endTime: string;          // HH:MM format (local time)
  isDayHora: boolean;       // true = day hour, false = night hour
  isCurrent: boolean;       // true if this hora is active right now
  signification: string;    // brief English meaning
}

export interface HoraData {
  date: string;             // YYYY-MM-DD
  sunrise: string;          // HH:MM
  sunset: string;           // HH:MM
  dayDuration: number;      // minutes (sunrise → sunset)
  nightDuration: number;    // minutes (sunset → next sunrise)
  dayLord: number;          // planet ID of the weekday lord
  dayLordName: LocaleText;
  horas: HoraEntry[];       // 24 entries
  currentHora: HoraEntry | null;
}

// ── Chaldean sequence (planet IDs) ─────────────────────────────────
// Saturn(6), Jupiter(4), Mars(2), Sun(0), Venus(5), Mercury(3), Moon(1)
const CHALDEAN_ORDER: number[] = [6, 4, 2, 0, 5, 3, 1];

// Weekday → planet ID mapping  (0=Sunday → Sun=0, 1=Monday → Moon=1, etc.)
const WEEKDAY_LORD: Record<number, number> = {
  0: 0, // Sunday → Sun
  1: 1, // Monday → Moon
  2: 2, // Tuesday → Mars
  3: 3, // Wednesday → Mercury
  4: 4, // Thursday → Jupiter
  5: 5, // Friday → Venus
  6: 6, // Saturday → Saturn
};

// Brief significations per planet (English)
const HORA_SIGNIFICATIONS: Record<number, string> = {
  0: 'Authority, leadership, vitality, government matters',
  1: 'Emotions, travel, public dealings, water-related',
  2: 'Courage, surgery, competition, property disputes',
  3: 'Communication, trade, learning, writing, technology',
  4: 'Teaching, law, expansion, spiritual matters, finance',
  5: 'Arts, love, luxury, beauty, partnerships',
  6: 'Discipline, construction, agriculture, servants',
};

// ── Helpers ─────────────────────────────────────────────────────────

/** Parse "HH:MM" into total minutes from midnight */
export function parseHHMM(hhmm: string): number {
  if (!hhmm || !hhmm.includes(':')) {
    throw new Error(`[hora] Invalid time format: expected "HH:MM", got "${hhmm}"`);
  }
  const [h, m] = hhmm.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) {
    throw new Error(`[hora] Non-numeric time value: "${hhmm}"`);
  }
  return h * 60 + m;
}

/** Format total minutes as "HH:MM" (supports >24h via modulo) */
export function formatMinutes(totalMin: number): string {
  const m = ((totalMin % 1440) + 1440) % 1440; // normalise to 0-1439
  const hh = String(Math.floor(m / 60)).padStart(2, '0');
  const mm = String(Math.round(m % 60)).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** Find the index of a planet ID in the Chaldean sequence */
function chaldeanIndex(planetId: number): number {
  const idx = CHALDEAN_ORDER.indexOf(planetId);
  if (idx === -1) throw new Error(`[hora] Planet ID ${planetId} not found in Chaldean order`);
  return idx;
}

// ── Main calculator ─────────────────────────────────────────────────

/**
 * Calculate 24 planetary horas for a given date.
 *
 * @param date       - The calendar date
 * @param sunrise    - "HH:MM" local time of sunrise
 * @param sunset     - "HH:MM" local time of sunset
 * @param nextSunrise - "HH:MM" local time of next day's sunrise
 * @param weekday    - 0=Sunday … 6=Saturday
 * @param nowMinutes - (optional) current time as minutes-from-midnight, for isCurrent detection.
 *                     Pass -1 to skip current-hora detection.
 */
export function calculateHoras(
  date: Date,
  sunrise: string,
  sunset: string,
  nextSunrise: string,
  weekday: number,
  nowMinutes: number = -1,
): HoraData {
  const sunriseMin = parseHHMM(sunrise);
  const sunsetMin = parseHHMM(sunset);

  // Night spans into the next day, so next-sunrise may be < sunset in raw minutes
  let nextSunriseMin = parseHHMM(nextSunrise);
  if (nextSunriseMin <= sunsetMin) {
    nextSunriseMin += 1440; // add 24h
  }

  const dayDuration = sunsetMin - sunriseMin;         // minutes
  const nightDuration = nextSunriseMin - sunsetMin;   // minutes
  const dayHoraLen = dayDuration / 12;
  const nightHoraLen = nightDuration / 12;

  // Starting planet = weekday lord
  const lordId = WEEKDAY_LORD[weekday];
  const startIdx = chaldeanIndex(lordId);

  const horas: HoraEntry[] = [];
  let currentHora: HoraEntry | null = null;

  // Adjust nowMinutes for night hours that cross midnight
  const nowMin = nowMinutes >= 0 ? nowMinutes : -1;
  // For comparison across midnight: if now < sunrise, treat it as next-day offset
  const nowAdj = nowMin >= 0 && nowMin < sunriseMin ? nowMin + 1440 : nowMin;

  for (let i = 0; i < 24; i++) {
    const isDay = i < 12;
    const slotIndex = isDay ? i : i - 12;
    const baseMin = isDay ? sunriseMin : sunsetMin;
    const horaLen = isDay ? dayHoraLen : nightHoraLen;

    const startMin = baseMin + slotIndex * horaLen;
    const endMin = baseMin + (slotIndex + 1) * horaLen;

    const planetIdx = (startIdx + i) % CHALDEAN_ORDER.length;
    const planetId = CHALDEAN_ORDER[planetIdx];
    const graha = GRAHAS[planetId];

    const isCurrent =
      nowAdj >= 0 &&
      nowAdj >= startMin &&
      nowAdj < endMin;

    const entry: HoraEntry = {
      horaNumber: i + 1,
      planet: planetId,
      planetName: graha.name,
      startTime: formatMinutes(startMin),
      endTime: formatMinutes(endMin),
      isDayHora: isDay,
      isCurrent,
      signification: HORA_SIGNIFICATIONS[planetId] ?? '',
    };

    horas.push(entry);
    if (isCurrent) {
      currentHora = entry;
    }
  }

  const dateStr = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

  return {
    date: dateStr,
    sunrise,
    sunset,
    dayDuration: Math.round(dayDuration),
    nightDuration: Math.round(nightDuration),
    dayLord: lordId,
    dayLordName: GRAHAS[lordId].name,
    horas,
    currentHora,
  };
}

// ── Activity recommendations ────────────────────────────────────────

export interface HoraActivity {
  activity: string;
  activityHi: string;
  planets: number[];   // recommended planet IDs
}

export const HORA_ACTIVITIES: HoraActivity[] = [
  { activity: 'Business meetings', activityHi: 'व्यापार बैठकें', planets: [3, 4] },
  { activity: 'Travel', activityHi: 'यात्रा', planets: [1, 5] },
  { activity: 'Medical treatment', activityHi: 'चिकित्सा', planets: [0, 2] },
  { activity: 'Education & study', activityHi: 'शिक्षा एवं अध्ययन', planets: [3, 4] },
  { activity: 'Legal matters', activityHi: 'कानूनी मामले', planets: [4, 0] },
  { activity: 'Romance & relationships', activityHi: 'प्रेम एवं सम्बन्ध', planets: [5, 1] },
  { activity: 'Construction & property', activityHi: 'निर्माण एवं सम्पत्ति', planets: [6, 2] },
  { activity: 'Creative arts', activityHi: 'रचनात्मक कला', planets: [5, 1] },
  { activity: 'Spiritual practice', activityHi: 'आध्यात्मिक साधना', planets: [4, 0] },
  { activity: 'Agriculture & farming', activityHi: 'कृषि एवं खेती', planets: [6, 1] },
];

/**
 * For each activity, find the next hora today whose ruler matches.
 * Returns an array of { activity, planet, nextHora } objects.
 */
export function findBestHorasForActivities(
  horas: HoraEntry[],
  nowMinutes: number,
): { activity: string; activityHi: string; planet: number; nextHora: HoraEntry | null }[] {
  const nowAdj = nowMinutes;

  return HORA_ACTIVITIES.map(({ activity, activityHi, planets }) => {
    // Find the next upcoming hora ruled by one of the recommended planets
    const upcoming = horas.find((h) => {
      const startMin = parseHHMM(h.startTime);
      // Adjust for night horas that cross midnight
      const adjStart = !h.isDayHora && startMin < 720 ? startMin + 1440 : startMin;
      return planets.includes(h.planet) && adjStart >= nowAdj;
    });

    return {
      activity,
      activityHi,
      planet: upcoming?.planet ?? planets[0],
      nextHora: upcoming ?? null,
    };
  });
}
