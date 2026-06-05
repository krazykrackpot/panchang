/**
 * Sunrise / sunset for a Gregorian date at a location, returned as
 * **local minutes since midnight** — the format the festival pages and
 * eclipse-compute consumed from the legacy `astronomy/sunrise.ts:
 * getSunTimes` helper.
 *
 * Audit P5d #22: collapses the second sunrise/sunset implementation
 * onto the canonical `sunriseUTHoursOr` / `sunsetUTHoursOr` in
 * `ephem/swiss-ephemeris.ts` (Swiss + Meeus fallback). Before this
 * helper, `getSunTimes` reimplemented a pure Meeus spherical-trig
 * solver — drifting up to 1-2 minutes from the canonical depending on
 * refraction and Equation-of-Time tweaks. Tweaks at the canonical
 * site weren't picked up by the festival surfaces.
 *
 * Scope: festival pages, eclipse-compute. `vedic-time/Client.tsx`
 * also needs dawn / dusk / nextSunrise / deprecated Date objects from
 * the legacy helper — that consolidation is deferred to a follow-up
 * (would require porting Brahma Muhurta + twilight to the canonical).
 */

import { dateToJD } from './astronomical';
import { sunriseUTHoursOr, sunsetUTHoursOr } from './swiss-ephemeris';

const POLAR_SUNRISE_FALLBACK_UT = 0;   // 00:00 UT
const POLAR_SUNSET_FALLBACK_UT = 12;   // 12:00 UT

/**
 * Local sunrise + sunset minutes-since-midnight at `(lat, lng)` on
 * the given Gregorian date, observing `tzOffsetHours`.
 *
 * The polar fallbacks (0 / 12 UT) are arbitrary but match what the
 * legacy `astronomy/sunrise.ts` emitted at extreme latitudes — keep
 * them aligned so the migration is byte-identical at the consumer.
 */
export function getSunriseSunsetLocalMinutes(
  year: number,
  month: number,
  day: number,
  lat: number,
  lng: number,
  tzOffsetHours: number,
): { sunriseMinutes: number; sunsetMinutes: number } {
  const jd = dateToJD(year, month, day, 0);
  const srUT = sunriseUTHoursOr(jd, lat, lng, tzOffsetHours, POLAR_SUNRISE_FALLBACK_UT).value;
  const ssUT = sunsetUTHoursOr(jd, lat, lng, tzOffsetHours, POLAR_SUNSET_FALLBACK_UT).value;
  // `*UTHoursOr` returns 0-24 UT hours; adding tzOffset can exceed 24
  // (east of UTC the previous UT day's sunrise is "today" locally) or
  // go negative (west of UTC the next UT day's sunset is "today").
  // Wrap into [0, 1440) local minutes so consumers see a single
  // canonical day's value — matches the legacy `getSunTimes` shape.
  const srLocalH = ((srUT + tzOffsetHours) % 24 + 24) % 24;
  const ssLocalH = ((ssUT + tzOffsetHours) % 24 + 24) % 24;
  return {
    sunriseMinutes: srLocalH * 60,
    sunsetMinutes: ssLocalH * 60,
  };
}
