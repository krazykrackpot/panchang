/**
 * Parana (Fast-Breaking) Computation Engine
 *
 * Computes the optimal time window for breaking a vrat (fast)
 * based on traditional rules tied to sunrise, tithi end, and moonrise.
 */

import { getSunTimes } from '@/lib/astronomy/sunrise';
import { dateObjectToJD } from '@/lib/astronomy/julian';
import { calculateMoonriseUT } from '@/lib/ephem/panchang-calc';
import type { ParanaRule } from '@/lib/constants/puja-vidhi/types';

export interface ComputedParana {
  start: Date;
  end: Date;
  description: string;
}

/**
 * Add minutes to a Date, returning a new Date.
 */
function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/**
 * Add hours to a Date, returning a new Date.
 */
function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 3_600_000);
}

/**
 * Compute the parana (fast-breaking) window for a vrat.
 *
 * @param rule - The parana rule from the PujaVidhi definition
 * @param vratDate - The date of the vrat (fast day)
 * @param lat - Observer latitude (degrees, N positive)
 * @param lng - Observer longitude (degrees, E positive)
 * @param timezoneOffset - Timezone offset from UTC in hours (e.g., 5.5 for IST)
 * @param tithiEndDate - Optional: when the tithi ends (for tithi_end and sunrise_plus_quarter rules)
 */
export function computeParana(
  rule: ParanaRule,
  vratDate: Date,
  lat: number,
  lng: number,
  timezoneOffset: number,
  tithiEndDate?: Date,
): ComputedParana {
  // Next day after vrat
  const nextDay = new Date(vratDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const nextDaySun = getSunTimes(
    nextDay.getFullYear(),
    nextDay.getMonth() + 1,
    nextDay.getDate(),
    lat,
    lng,
    timezoneOffset,
  );

  const { sunrise, dayDurationMinutes } = nextDaySun;

  switch (rule.type) {
    case 'next_sunrise': {
      // Start = next day sunrise, End = sunrise + 4h
      return {
        start: sunrise,
        end: addHours(sunrise, 4),
        description: rule.description.en,
      };
    }

    case 'sunrise_plus_quarter': {
      // Ekadashi parana: start = next day sunrise,
      // end = min(tithiEndDate, sunrise + dayDuration/4)
      const quarterEnd = addMinutes(sunrise, dayDurationMinutes / 4);
      let end = quarterEnd;

      if (tithiEndDate && tithiEndDate.getTime() < quarterEnd.getTime()) {
        end = tithiEndDate;
      }

      // Ensure end is after start
      if (end.getTime() <= sunrise.getTime()) {
        end = quarterEnd;
      }

      return {
        start: sunrise,
        end,
        description: rule.description.en,
      };
    }

    case 'moonrise': {
      // Compute moonrise for next day using accurate binary-search algorithm.
      // calculateMoonriseUT returns UT decimal hours from midnight of the given JD.
      const jd = dateObjectToJD(nextDay);
      const moonriseUT = calculateMoonriseUT(jd, lat, lng);

      if (moonriseUT !== null) {
        // Convert UT hours-from-midnight to a Date in local time
        const jdMidnightUTC = Math.floor(jd - 0.5) + 0.5;
        const moonriseDate = new Date((jdMidnightUTC - 2440587.5) * 86400000 + moonriseUT * 3600000);
        // Parana window: sunrise → moonrise
        const end = moonriseDate.getTime() > sunrise.getTime() ? moonriseDate : addHours(sunrise, 4);
        return {
          start: sunrise,
          end,
          description: rule.description.en,
        };
      }

      // Moon doesn't rise today — fall back to next_sunrise window
      return {
        start: sunrise,
        end: addHours(sunrise, 4),
        description: rule.description.en,
      };
    }

    case 'tithi_end': {
      // Start = next day sunrise, End = tithiEndDate (or sunrise + 4h fallback)
      const end =
        tithiEndDate && tithiEndDate.getTime() > sunrise.getTime()
          ? tithiEndDate
          : addHours(sunrise, 4);

      return {
        start: sunrise,
        end,
        description: rule.description.en,
      };
    }
  }
}
