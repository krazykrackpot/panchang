/**
 * Muhurta Engine — Context Builder
 *
 * Bridge between raw ephemeris and the rule evaluation layer.
 * Two levels of context:
 *   - DayContext: computed once per day (sunrise, sunset, planets, combustion, masa)
 *   - WindowContext: computed per scoring window (panchang snapshot, lagna, navamsha)
 *
 * The scanner caches DayContext per date to avoid recomputing expensive
 * planetary positions for every 30-minute window.
 */

import {
  dateToJD,
  approximateSunriseSafe,
  approximateSunsetSafe,
  getPlanetaryPositions,
  toSidereal,
  getRashiNumber,
} from '@/lib/ephem/astronomical';
import { getPanchangSnapshot } from '@/lib/muhurta/ai-recommender';
import type { PanchangSnapshot } from '@/lib/muhurta/ai-recommender';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { checkVivahCombustion, scoreLagna, scoreNavamshaShuddhi } from '@/lib/muhurta/classical-checks';
import type { CombustionResult, LagnaResult } from '@/lib/muhurta/classical-checks';
import { getLunarMasaForDate } from '@/lib/calendar/hindu-months';
import type { RuleContext } from './types';
import type { ExtendedActivityId } from '@/types/muhurta-ai';

// ─── Day-Level Context ─────────────────────────────────────────────────────

export interface DayContext {
  date: string;               // 'YYYY-MM-DD'
  year: number;
  month: number;
  day: number;
  jdNoon: number;             // Julian Day at noon UT
  sunriseUT: number;          // Hours UT (0-24)
  sunsetUT: number;           // Hours UT (0-24)
  weekday: number;            // 0=Sunday, 1=Monday, ..., 6=Saturday
  planets: Array<{
    id: number;
    longitude: number;
    latitude: number;
    distance: number;
    speed: number;
    isRetrograde: boolean;
  }>;
  combustion: CombustionResult;
  lunarMasa: { masaIdx: number; name: string; isAdhika: boolean } | null;
  lat: number;
  lng: number;
  tz: number;                 // UTC offset in hours
}

/**
 * Build day-level context — computed once per calendar day.
 *
 * @param year  Gregorian year
 * @param month Gregorian month (1-12)
 * @param day   Gregorian day (1-31)
 * @param lat   Observer latitude
 * @param lng   Observer longitude
 * @param tz    UTC offset in hours (e.g. 5.5 for IST, 1 for CET)
 */
export function buildDayContext(
  year: number,
  month: number,
  day: number,
  lat: number,
  lng: number,
  tz: number,
): DayContext {
  // JD at noon UT for this date
  const jdNoon = dateToJD(year, month, day, 12);

  // Sunrise/sunset in hours UT
  const sunriseUT = approximateSunriseSafe(jdNoon, lat, lng);
  const sunsetUT = approximateSunsetSafe(jdNoon, lat, lng);

  // Weekday: 0=Sun, 1=Mon, ..., 6=Sat
  const weekday = Math.floor(jdNoon + 1.5) % 7; // 0=Sunday

  // Planetary positions at noon — sufficient for combustion + day-level checks
  const planets = getPlanetaryPositions(jdNoon);

  // Venus/Jupiter combustion check
  const combustion = checkVivahCombustion(jdNoon);

  // Lunar masa for festival/season vetoes
  const masaResult = getLunarMasaForDate(year, month, day);
  const lunarMasa = masaResult
    ? { masaIdx: masaResult.masaIdx, name: masaResult.name.en, isAdhika: masaResult.isAdhika }
    : null;

  const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    date,
    year,
    month,
    day,
    jdNoon,
    sunriseUT,
    sunsetUT,
    weekday,
    planets,
    combustion,
    lunarMasa,
    lat,
    lng,
    tz,
  };
}

// ─── Window-Level Context ──────────────────────────────────────────────────

/**
 * Build full RuleContext for a specific time window within a day.
 *
 * @param dayCtx       Pre-computed DayContext (shared across all windows for this day)
 * @param windowStartUT Window start in hours UT (0-24, may exceed 24 for post-midnight)
 * @param windowEndUT   Window end in hours UT
 * @param activity      The muhurta activity being evaluated
 */
export function buildWindowContext(
  dayCtx: DayContext,
  windowStartUT: number,
  windowEndUT: number,
  activity: ExtendedActivityId,
): RuleContext {
  // Midpoint of the window in JD
  const midpointHoursUT = (windowStartUT + windowEndUT) / 2;
  // Convert midpoint hours UT to JD: jdNoon is at 12h UT, so offset accordingly
  const midpointJD = dayCtx.jdNoon + (midpointHoursUT - 12) / 24;

  // Panchang snapshot at the midpoint
  const snap: PanchangSnapshot = getPanchangSnapshot(midpointJD, dayCtx.lat, dayCtx.lng);

  // Lagna (ascendant) at the midpoint
  const lagnaResult: LagnaResult = scoreLagna(midpointJD, dayCtx.lat, dayCtx.lng, activity);

  // Navamsha shuddhi at the midpoint
  // scoreNavamshaShuddhi returns { navamshaRashi: number; score: number }
  const navamshaResult = scoreNavamshaShuddhi(midpointJD, dayCtx.lat, dayCtx.lng, activity);

  // Activity rule set
  const activityRules = getExtendedActivity(activity);

  return {
    date: dayCtx.date,
    jdNoon: dayCtx.jdNoon,
    sunriseUT: dayCtx.sunriseUT,
    sunsetUT: dayCtx.sunsetUT,
    weekday: dayCtx.weekday,

    windowStartUT,
    windowEndUT,
    midpointJD,
    snap,
    lagnaSign: lagnaResult.rashi,
    navamshaSign: navamshaResult.navamshaRashi,

    activity,
    activityRules,

    lat: dayCtx.lat,
    lng: dayCtx.lng,
    tz: dayCtx.tz,

    // Day-level data shared across windows (avoids recomputation)
    planets: dayCtx.planets,
    combustion: dayCtx.combustion,
    lunarMasa: dayCtx.lunarMasa ?? undefined,
  };
}
