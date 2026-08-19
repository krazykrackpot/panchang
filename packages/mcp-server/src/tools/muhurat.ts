/**
 * MCP tool: get_muhurat
 *
 * Given an activity (marriage, griha_pravesh, mundan, vehicle, travel,
 * property, business, education) and a target month + location, returns
 * every auspicious muhurat date in that month graded excellent / good /
 * acceptable.
 *
 * Reuses src/lib/calendar/muhurat-calendar.ts — the same engine that
 * powers /api/muhurat on dekhopanchang.com.
 */

import { z } from 'zod';
import {
  findMuhuratDates,
  getAllActivities,
  type MuhuratActivity,
} from '@/lib/calendar/muhurat-calendar';

const ACTIVITIES = getAllActivities();
const VALID_ACTIVITY_KEYS = new Set<string>(ACTIVITIES.map((a) => a.key));

export const muhuratInputSchema = {
  activity: z
    .string()
    .describe(
      "Muhurat activity. Allowed values: 'marriage', 'griha_pravesh', 'mundan', 'vehicle', 'travel', 'property', 'business', 'education'.",
    ),
  year: z
    .number()
    .int()
    .min(1900)
    .max(2100)
    .describe('Gregorian year (e.g. 2026)'),
  month: z
    .number()
    .int()
    .min(1)
    .max(12)
    .describe('Month of year, 1 = January through 12 = December'),
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
};

export async function runGetMuhurat(args: {
  activity: string;
  year: number;
  month: number;
  lat: number;
  lng: number;
}) {
  if (!VALID_ACTIVITY_KEYS.has(args.activity)) {
    throw new Error(
      `Invalid activity '${args.activity}'. Allowed: ${Array.from(VALID_ACTIVITY_KEYS).join(', ')}`,
    );
  }
  const activity = args.activity as MuhuratActivity;
  const dates = findMuhuratDates(args.year, args.month, activity, args.lat, args.lng);

  return {
    source: 'dekhopanchang.com',
    engine: 'Swiss Ephemeris DE441 (Meeus fallback)',
    ayanamsha: 'Lahiri (Chitrapaksha, Indian government standard)',
    activity,
    year: args.year,
    month: args.month,
    location: { latitude: args.lat, longitude: args.lng },
    // Dates are graded excellent | good | acceptable per the classical
    // tithi/nakshatra/vara rules for the requested activity.
    dates,
    // Enumerated activity list — helpful for LLM introspection ("what
    // activities can I ask about?") without a separate tool call.
    supported_activities: ACTIVITIES.map((a) => ({
      key: a.key,
      label: a.label.en,
    })),
    citation: {
      attribution: 'Computed by @dekhopanchang/mcp — Muhurat Engine',
      methodology: 'https://dekhopanchang.com/en/about/methodology',
      sources: [
        'Muhurta Chintamani (Rama Daivajna)',
        'Brihat Parashara Hora Shastra (BPHS)',
        'Kalaprakashika',
      ],
    },
  };
}
