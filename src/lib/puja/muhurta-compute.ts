/**
 * Puja Muhurta Computation Engine
 *
 * Computes 6 traditional puja timing windows based on sunrise/sunset
 * for any location:
 *   brahma_muhurta, abhijit, madhyahna, aparahna, pradosh, nishita
 */

import { getSunTimes, type SunTimes } from '@/lib/astronomy/sunrise';
import type { MuhurtaWindowType } from '@/lib/constants/puja-vidhi/types';

export interface ComputedMuhurta {
  start: Date;
  end: Date;
  type: MuhurtaWindowType;
}

/**
 * Add minutes to a Date, returning a new Date.
 */
function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/**
 * Compute a puja muhurta window for the given date and location.
 *
 * @param type - One of 6 muhurta window types
 * @param year - Year
 * @param month - Month (1-12)
 * @param day - Day of month
 * @param latitude - Observer latitude (degrees, N positive)
 * @param longitude - Observer longitude (degrees, E positive)
 * @param timezoneOffset - Timezone offset from UTC in hours (e.g., 5.5 for IST)
 */
export function computePujaMuhurta(
  type: MuhurtaWindowType,
  year: number,
  month: number,
  day: number,
  latitude: number,
  longitude: number,
  timezoneOffset: number,
): ComputedMuhurta {
  const sun: SunTimes = getSunTimes(year, month, day, latitude, longitude, timezoneOffset);
  const { sunrise, sunset, dayDurationMinutes } = sun;

  switch (type) {
    case 'brahma_muhurta': {
      // 96 min before sunrise -> 48 min before sunrise
      return {
        start: addMinutes(sunrise, -96),
        end: addMinutes(sunrise, -48),
        type,
      };
    }

    case 'abhijit': {
      // Midday +/- 24 min (midday = sunrise + dayDuration/2)
      const midday = addMinutes(sunrise, dayDurationMinutes / 2);
      return {
        start: addMinutes(midday, -24),
        end: addMinutes(midday, 24),
        type,
      };
    }

    case 'madhyahna': {
      // sunrise + 2/5 * dayDuration -> sunrise + 3/5 * dayDuration
      return {
        start: addMinutes(sunrise, (2 / 5) * dayDurationMinutes),
        end: addMinutes(sunrise, (3 / 5) * dayDurationMinutes),
        type,
      };
    }

    case 'aparahna': {
      // sunrise + 3/5 * dayDuration -> sunrise + 4/5 * dayDuration
      return {
        start: addMinutes(sunrise, (3 / 5) * dayDurationMinutes),
        end: addMinutes(sunrise, (4 / 5) * dayDurationMinutes),
        type,
      };
    }

    case 'pradosh': {
      // sunset -> sunset + 144 min (2h 24m)
      return {
        start: sunset,
        end: addMinutes(sunset, 144),
        type,
      };
    }

    case 'nishita': {
      // Solar midnight = midpoint between today's sunset and tomorrow's sunrise
      // Midnight +/- 24 min
      const nextDay = new Date(year, month - 1, day + 1);
      const tomorrowSun = getSunTimes(
        nextDay.getFullYear(),
        nextDay.getMonth() + 1,
        nextDay.getDate(),
        latitude,
        longitude,
        timezoneOffset,
      );
      const solarMidnightMs =
        (sunset.getTime() + tomorrowSun.sunrise.getTime()) / 2;
      const solarMidnight = new Date(solarMidnightMs);
      return {
        start: addMinutes(solarMidnight, -24),
        end: addMinutes(solarMidnight, 24),
        type,
      };
    }
  }
}

/**
 * Format a Date as a human-readable time string.
 * @param date - The Date to format
 * @param use24h - If true, use "19:42" format; otherwise "7:42 PM"
 */
export function formatMuhurtaTime(date: Date, use24h = false): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const mm = String(minutes).padStart(2, '0');

  if (use24h) {
    return `${String(hours).padStart(2, '0')}:${mm}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${h12}:${mm} ${period}`;
}

/**
 * Compute the duration in minutes between two Dates.
 */
export function muhurtaDurationMinutes(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / 60_000;
}
