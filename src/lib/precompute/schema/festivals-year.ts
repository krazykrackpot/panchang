/**
 * Page model for /[locale]/festivals/[slug]/[year]/[city].
 *
 * Same shape as hindu-calendar (yearly FestivalEntry list) but with
 * a city axis — one Blob per (year, city) reused across every
 * festival slug. The page does .find(slug) + sunrise compute at
 * render time; both are cheap vs the avoided
 * generateFestivalCalendarV2 yearly tithi-table build.
 */

import { z } from 'zod';

const FestivalEntryOpaque = z.record(z.string(), z.unknown());

export const FestivalsYearPageModel = z.object({
  _v: z.literal(1),
  _computedAt: z.string(),

  year: z.number().int().min(1900).max(2200),
  city: z.string().regex(/^[a-z][a-z0-9-]*$/),
  festivals: z.array(FestivalEntryOpaque),
});

export type FestivalsYearPageModel = z.infer<typeof FestivalsYearPageModel>;
