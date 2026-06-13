/**
 * Reader wrapper for /panchang/[city] + /api/panchang short-circuit.
 *
 * Consumed by the /api/panchang route when the caller supplies a
 * (date, citySlug) hint that maps to a known city. Falls back to
 * live computePanchang on Blob miss or schema mismatch.
 *
 * The inner panchang field is opaque-typed at the Blob boundary —
 * consumers cast to PanchangData. See schema/panchang-city.ts for
 * the rationale.
 */

import { computePanchang } from '@/lib/ephem/panchang-calc';
import { buildYearlyTithiTable, lookupTithiAtSunrise } from '@/lib/calendar/tithi-table';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { dateToJD } from '@/lib/ephem/astronomical';
import { sunriseUTHours } from '@/lib/ephem/swiss-ephemeris';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { CityData } from '@/lib/constants/cities';
import { getPrecomputed } from './reader';
import { panchangCityKey } from './keys';
import {
  PanchangCityPageModel,
  type PanchangCityPageModel as PanchangCityPageModelT,
} from './schema/panchang-city';

interface Args {
  /** YYYY-MM-DD — must be pre-validated by the caller. */
  date: string;
  /** Resolved city — caller has already mapped citySlug → CityData. */
  city: CityData;
}

export async function getPanchangCityPageModel(args: Args): Promise<PanchangCityPageModelT> {
  const { date: dateStr, city } = args;
  const [y, m, d] = dateStr.split('-').map(Number);

  return await getPrecomputed({
    key: panchangCityKey(dateStr, city.slug),
    schema: PanchangCityPageModel,
    fallback: async () => buildFreshModel(dateStr, y, m, d, city),
  });
}

export async function buildFreshModel(
  dateStr: string,
  y: number,
  m: number,
  d: number,
  city: CityData,
): Promise<PanchangCityPageModelT> {
  const tzOffset = getUTCOffsetForDate(y, m, d, city.timezone);
  const panchang = computePanchang({
    year: y, month: m, day: d,
    lat: city.lat, lng: city.lng,
    tzOffset, timezone: city.timezone,
    locationName: city.name.en,
  });

  // Tithi-table enrichment (matches /api/panchang inline logic).
  // Polar non-rise → skip; the engine's coarse-day panchang still
  // ships in the Blob.
  let tithiTable: Record<string, unknown> | undefined;
  try {
    const table = buildYearlyTithiTable(y, city.lat, city.lng, city.timezone);
    const jdApprox = dateToJD(y, m, d, 0);
    const srUT = sunriseUTHours(jdApprox, city.lat, city.lng, tzOffset);
    if (srUT !== null) {
      const sunriseJd = dateToJD(y, m, d, srUT);
      const entry = lookupTithiAtSunrise(table, sunriseJd);
      if (entry) {
        tithiTable = {
          masa: entry.masa,
          tithiStart: entry.startLocal,
          tithiEnd: entry.endLocal,
          tithiStartDate: entry.startDate,
          tithiEndDate: entry.endDate,
          isKshaya: entry.isKshaya,
          durationHours: Math.round(entry.durationHours * 10) / 10,
        };
      }
    }
  } catch (err) {
    console.error('[precompute/panchang-city] tithi-table enrichment failed (non-fatal):', err);
  }

  // Festival match for this date.
  let festivals: Record<string, unknown>[] | undefined;
  try {
    const allFestivals = generateFestivalCalendarV2(y, city.lat, city.lng, city.timezone);
    const todayFestivals = allFestivals.filter((f) => f.date === dateStr);
    if (todayFestivals.length > 0) {
      festivals = todayFestivals.map((f) => ({
        name: f.name,
        type: f.type,
        category: f.category,
        description: f.description,
        slug: f.slug,
        ...(f.pujaMuhurat ? { pujaMuhurat: f.pujaMuhurat } : {}),
        ...(f.paranaStart ? { paranaStart: f.paranaStart, paranaEnd: f.paranaEnd, paranaDate: f.paranaDate } : {}),
      }));
    }
  } catch (err) {
    console.error('[precompute/panchang-city] festival enrichment failed (non-fatal):', err);
  }

  return {
    _v: 1 as const,
    _computedAt: new Date().toISOString(),
    date: dateStr,
    city: city.slug,
    panchang: panchang as unknown as Record<string, unknown>,
    ...(tithiTable ? { tithiTable } : {}),
    ...(festivals ? { festivals } : {}),
  };
}
