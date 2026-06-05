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
import { sunriseUTHours, sunsetUTHours } from './swiss-ephemeris';

const DEG2RAD = Math.PI / 180;

/**
 * Polar day vs polar night detector at solar noon.
 *
 * Returns:
 *   'normal'      — sun rises and sets normally on this date at this lat.
 *   'polar-day'   — sun never sets (cosH < -1: the hour-angle equation has
 *                    no solution; sun above the -0.8333° horizon at all H).
 *   'polar-night' — sun never rises (cosH > 1: sun below horizon at all H).
 *
 * Matches the clamping logic in the legacy
 * `astronomy/sunrise.ts:computeHourAngle` so the fallback we emit lands
 * on the same minute the legacy would have produced.
 */
function polarStateAtNoon(jd: number, lat: number): 'normal' | 'polar-day' | 'polar-night' {
  // Meeus Ch.25 approximate solar longitude → declination. Same
  // formulation as `approximateSunrise` so any drift cancels.
  const T = (jd - 2451545.0) / 36525;
  const obliquity = 23.4393 - 0.0130 * T;
  // Inline the same simplified solar longitude `approximateSunrise` uses.
  // (We keep this local rather than re-export `_meesusSunLongitude` from
  // astronomical.ts — declination only needs ~0.01° precision for the
  // polar check.)
  const M = 357.5291 + 0.98560028 * (jd - 2451545.0);
  const Mr = M * DEG2RAD;
  const C = 1.9148 * Math.sin(Mr) + 0.0200 * Math.sin(2 * Mr) + 0.0003 * Math.sin(3 * Mr);
  const lambda = (280.4665 + 0.98564736 * (jd - 2451545.0) + C) * DEG2RAD;
  const decl = Math.asin(Math.sin(obliquity * DEG2RAD) * Math.sin(lambda));

  const latR = lat * DEG2RAD;
  const h = -0.8333 * DEG2RAD; // standard refraction + upper limb
  const cosH = (Math.sin(h) - Math.sin(latR) * Math.sin(decl)) / (Math.cos(latR) * Math.cos(decl));
  if (cosH > 1) return 'polar-night';
  if (cosH < -1) return 'polar-day';
  return 'normal';
}

/**
 * Local sunrise + sunset minutes-since-midnight at `(lat, lng)` on
 * the given Gregorian date, observing `tzOffsetHours`.
 *
 * At polar latitudes the canonical returns null. We then replicate the
 * legacy `getSunTimes` clamping behavior:
 *
 *   - **polar day** (sun never sets): legacy clamps H₀=180°, producing
 *     `sunriseMinutes = solarNoon-720`, `sunsetMinutes = solarNoon+720`.
 *     After wrap, sunrise ≈ 0 and sunset ≈ 1440 in the local zone of
 *     solar noon. We emit `sunriseMinutes = 0`, `sunsetMinutes = 1440-1`.
 *   - **polar night** (sun never rises): legacy clamps H₀=0°, both at
 *     solar noon. We emit `sunriseMinutes = sunsetMinutes = 720`.
 *
 * Production callers (city festivals, eclipse-compute) never hit these
 * cases — the helper is correct for the realistic |lat| < 66° range and
 * degrades to documented sentinels at extremes. Audit P5d #22 (Gemini).
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
  const srUT = sunriseUTHours(jd, lat, lng, tzOffsetHours);
  const ssUT = sunsetUTHours(jd, lat, lng, tzOffsetHours);

  if (srUT === null || ssUT === null) {
    // Polar regime — canonical can't compute. Distinguish day vs night
    // locally and emit the legacy-compatible sentinels.
    const polar = polarStateAtNoon(jd, lat);
    if (polar === 'polar-day') return { sunriseMinutes: 0, sunsetMinutes: 1440 - 1 };
    if (polar === 'polar-night') return { sunriseMinutes: 720, sunsetMinutes: 720 };
    // 'normal' but canonical returned null → upstream bug. Fail loud.
    throw new Error(
      `[sunrise-sunset-local] canonical returned null at non-polar lat=${lat} on ${year}-${month}-${day}`,
    );
  }

  // `sunriseUTHours` / `sunsetUTHours` return 0-24 UT hours; adding
  // tzOffset can exceed 24 (east of UTC the previous UT day's sunrise
  // is "today" locally) or go negative (west of UTC the next UT day's
  // sunset is "today"). Wrap into [0, 1440) local minutes.
  const srLocalH = ((srUT + tzOffsetHours) % 24 + 24) % 24;
  const ssLocalH = ((ssUT + tzOffsetHours) % 24 + 24) % 24;
  return {
    sunriseMinutes: srLocalH * 60,
    sunsetMinutes: ssLocalH * 60,
  };
}
