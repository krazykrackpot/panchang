/**
 * Page model for /[locale]/muhurta/[type]/[year]/[month]/[city].
 *
 * Wraps the scanDateRangeV2 output — an array of windows for the
 * (activity, month, city) tuple. The page sorts by score descending
 * and surfaces the top 10. We store the full array (it's small, ~10-60
 * entries per month) so consumers can re-sort or slice differently
 * without re-querying the engine.
 *
 * Same opaque-inner posture as panchang-city / festivals-year — the
 * ScanV2Window shape has nested breakdown/inauspiciousPeriods/panchang
 * context fields that would be brittle to mirror in Zod and add no
 * runtime safety beyond the strict outer wrap.
 */

import { z } from 'zod';

const ScanWindowOpaque = z.record(z.string(), z.unknown());

export const MuhurtaMonthPageModel = z.object({
  _v: z.literal(1),
  _computedAt: z.string(),

  activity: z.string().regex(/^[a-z][a-z0-9-]*$/),
  year: z.number().int().min(1900).max(2200),
  month: z.number().int().min(1).max(12),
  city: z.string().regex(/^[a-z][a-z0-9-]*$/),

  /** All windows for the month in engine-emitted order. Page sorts +
   *  slices top 10 at render time; total count is .length. */
  windows: z.array(ScanWindowOpaque),
});

export type MuhurtaMonthPageModel = z.infer<typeof MuhurtaMonthPageModel>;
