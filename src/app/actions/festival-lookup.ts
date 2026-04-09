'use server';

import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';

/**
 * Server action: find a specific festival/ekadashi from the computed calendar.
 * Runs on server where Swiss Ephemeris is available for accurate computation.
 * Eliminates hydration mismatch from new Date() differences.
 */
export async function lookupEkadashiAction(params: {
  slug: string;
  dateParam?: string;
  lat: number;
  lng: number;
  timezone: string;
  year: number;
}): Promise<Record<string, unknown> | null> {
  const { slug, dateParam, lat, lng, timezone, year } = params;

  try {
    const todayStr = new Date().toISOString().split('T')[0];

    for (const yr of [year, year + 1]) {
      const festivals = generateFestivalCalendarV2(yr, lat, lng, timezone);
      let entry;
      if (dateParam) {
        entry = festivals.find((f: any) => f.slug?.includes('ekadashi') && f.date === dateParam && f.paranaStart);
      } else {
        entry = festivals.find((f: any) => f.slug?.includes('ekadashi') && f.date >= todayStr && f.paranaStart);
      }
      if (entry?.paranaStart && entry.paranaSunrise && entry.paranaHariVasaraEnd && entry.paranaDwadashiEnd && entry.paranaMadhyahnaStart && entry.paranaMadhyahnaEnd) {
        // Return as plain object (server actions can't return class instances)
        return JSON.parse(JSON.stringify(entry));
      }
    }
  } catch { /* fail silently */ }
  return null;
}
