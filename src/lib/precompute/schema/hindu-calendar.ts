/**
 * Page model for /[locale]/hindu-calendar/[year].
 *
 * Year-keyed festival list — the page's only server compute is a
 * single generateFestivalCalendarV2(year, UJJAIN_*) call. The Blob
 * holds the raw FestivalEntry array (opaque-typed at the schema
 * boundary, same precedent as panchang-city). Page groups by month
 * and renders `tl(festival.name, locale)` at render time, so one
 * Blob per year serves every locale.
 */

import { z } from 'zod';

/** FestivalEntry has ~15 optional fields covering parana data,
 *  puja muhurta, tithi metadata, masa info. A strict Zod mirror
 *  would be brittle to future engine fields; the strict wrap below
 *  is enough to detect malformed Blobs (which fall back to live
 *  compute anyway). Same opaque-inner approach as panchang-city. */
const FestivalEntryOpaque = z.record(z.string(), z.unknown());

export const HinduCalendarPageModel = z.object({
  _v: z.literal(1),
  _computedAt: z.string(),

  year: z.number().int().min(1900).max(2200),
  /** Flat festival list in chronological order — page does its own
   *  groupByMonth pass on the consumer side. */
  festivals: z.array(FestivalEntryOpaque),
});

export type HinduCalendarPageModel = z.infer<typeof HinduCalendarPageModel>;
