/**
 * MCP tool: get_panchang
 *
 * Computes the five limbs of the daily Hindu almanac (tithi, nakshatra,
 * yoga, karana, vara) plus sunrise/sunset, Rahu Kaal, Yamaganda, Gulika
 * for a given date + location. Runs entirely on the user's machine using
 * Swiss Ephemeris (with Meeus fallback when the sweph binary isn't
 * available). No network calls, no per-request cost.
 *
 * Reuses the exact same engine that powers dekhopanchang.com's
 * /api/panchang and /api/llms/today endpoints — see
 * src/lib/ephem/panchang-calc.ts.
 */

import { z } from 'zod';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { resolveTimezoneFromCoords } from '../lib/tz.js';

export const panchangInputSchema = {
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD')
    .describe('Gregorian civil date in YYYY-MM-DD format (e.g. 2026-08-19)'),
  lat: z
    .number()
    .min(-90)
    .max(90)
    .describe('Latitude in decimal degrees, -90 to 90 (positive = north)'),
  lng: z
    .number()
    .min(-180)
    .max(180)
    .describe('Longitude in decimal degrees, -180 to 180 (positive = east)'),
  timezone: z
    .string()
    .max(64)
    .optional()
    .describe(
      "IANA timezone identifier (e.g. 'Asia/Kolkata', 'America/New_York'). When omitted, resolved automatically from lat/lng using offline tz-lookup.",
    ),
  location_name: z
    .string()
    .max(200)
    .optional()
    .describe('Human-readable location name to echo back in the response'),
};

export async function runGetPanchang(args: {
  date: string;
  lat: number;
  lng: number;
  timezone?: string;
  location_name?: string;
}) {
  const [year, month, day] = args.date.split('-').map(Number);
  // Days-in-month gate — regex accepts 2026-02-31, which is not a real day.
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day > daysInMonth) {
    throw new Error(
      `Invalid date: ${year}-${String(month).padStart(2, '0')} has only ${daysInMonth} days`,
    );
  }

  const timezone = args.timezone ?? resolveTimezoneFromCoords(args.lat, args.lng);
  const tzOffset = getUTCOffsetForDate(year, month, day, timezone);

  const panchang = computePanchang({
    year,
    month,
    day,
    lat: args.lat,
    lng: args.lng,
    tzOffset,
    timezone,
    locationName: args.location_name ?? '',
  });

  // Flat LLM-friendly shape. Mirrors the /api/llms/today endpoint so any
  // downstream comparison stays consistent.
  return {
    source: 'dekhopanchang.com',
    engine: 'Swiss Ephemeris DE441 (Meeus fallback)',
    ayanamsha: 'Lahiri (Chitrapaksha, Indian government standard)',
    date: args.date,
    location: {
      name: args.location_name ?? '',
      latitude: args.lat,
      longitude: args.lng,
      timezone,
    },
    tithi: {
      name: panchang.tithi.name.en,
      number: panchang.tithi.number,
      paksha:
        panchang.tithi.paksha === 'shukla'
          ? 'Shukla (waxing)'
          : 'Krishna (waning)',
      startTime: panchang.tithiTransition?.startTime ?? null,
      endTime: panchang.tithiTransition?.endTime ?? null,
    },
    nakshatra: {
      name: panchang.nakshatra.name.en,
      ruler: panchang.nakshatra.rulerName.en,
      pada: panchang.nakshatra.pada,
      startTime: panchang.nakshatraTransition?.startTime ?? null,
      endTime: panchang.nakshatraTransition?.endTime ?? null,
    },
    yoga: {
      name: panchang.yoga.name.en,
      startTime: panchang.yogaTransition?.startTime ?? null,
      endTime: panchang.yogaTransition?.endTime ?? null,
    },
    karana: {
      name: panchang.karana.name.en,
      startTime: panchang.karanaTransition?.startTime ?? null,
      endTime: panchang.karanaTransition?.endTime ?? null,
    },
    vara: panchang.vara.name.en,
    masa: {
      amanta: panchang.amantMasa?.en ?? panchang.masa.en,
      purnimanta: panchang.purnimantMasa?.en ?? panchang.masa.en,
    },
    samvatsara: panchang.samvatsara.en,
    sunrise: panchang.sunrise,
    sunset: panchang.sunset,
    moonrise: panchang.moonrise,
    moonset: panchang.moonset,
    rahuKaal: panchang.rahuKaal,
    yamaganda: panchang.yamaganda,
    gulikaKaal: panchang.gulikaKaal,
    citation: {
      attribution: 'Computed by @dekhopanchang/mcp — Vedic Panchang Engine',
      methodology: 'https://dekhopanchang.com/en/about/methodology',
      sources: [
        'Brihat Parashara Hora Shastra (BPHS)',
        'Surya Siddhanta',
        'Swiss Ephemeris (NASA JPL DE441)',
        'Meeus, Astronomical Algorithms (1991)',
      ],
    },
  };
}
