/**
 * Reader wrapper for /muhurta/[type]/[year]/[month]/[city].
 *
 * Wraps scanDateRangeV2 in getPrecomputed; fallback hits the exact
 * same call the inline page handler used.
 */

import { scanDateRangeV2, type ScanV2Window } from '@/lib/muhurta/time-window-scanner';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { ExtendedActivityId } from '@/types/muhurta-ai';
import type { CityData } from '@/lib/constants/cities';
import { getPrecomputed } from './reader';
import { muhurtaMonthKey } from './keys';
import {
  MuhurtaMonthPageModel,
  type MuhurtaMonthPageModel as MuhurtaMonthPageModelT,
} from './schema/muhurta-month';

interface Args {
  /** URL slug for the activity (e.g. 'marriage', 'griha-pravesh'). */
  activitySlug: string;
  /** Internal engine activity id (e.g. 'marriage', 'griha_pravesh'). */
  activityId: ExtendedActivityId;
  year: number;
  /** 1..12 — must be pre-validated. */
  month: number;
  city: CityData;
}

export async function getMuhurtaMonthPageModel(args: Args): Promise<MuhurtaMonthPageModelT> {
  const { activitySlug, activityId, year, month, city } = args;

  return await getPrecomputed({
    key: muhurtaMonthKey(activitySlug, year, month, city.slug),
    schema: MuhurtaMonthPageModel,
    fallback: async () => buildFreshModel(activitySlug, activityId, year, month, city),
  });
}

export function buildFreshModel(
  activitySlug: string,
  activityId: ExtendedActivityId,
  year: number,
  month: number,
  city: CityData,
): MuhurtaMonthPageModelT {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
  const tz = getUTCOffsetForDate(year, month, 1, city.timezone);

  const windows = scanDateRangeV2({
    startDate,
    endDate,
    activity: activityId,
    lat: city.lat,
    lng: city.lng,
    tz,
    windowMinutes: 120,
    preSunriseHours: 0,
    postSunsetHours: 1,
  });

  return {
    _v: 1 as const,
    _computedAt: new Date().toISOString(),
    activity: activitySlug,
    year,
    month,
    city: city.slug,
    windows: windows as unknown as Record<string, unknown>[],
  };
}

/** Cast the opaque inner windows back to the canonical type for
 *  type-safe field access by the page (.score, .date, .startTime). */
export function asScanWindows(windows: Record<string, unknown>[]): ScanV2Window[] {
  return windows as unknown as ScanV2Window[];
}
