/**
 * Page-/API-shaped model for /panchang/[city] + /api/panchang on
 * (date, citySlug) hint.
 *
 * Unlike the other precompute schemas which strictly type every
 * field, this schema captures the entire computePanchang result as
 * an opaque object. Rationale: PanchangData has 100+ fields, many
 * optional, several deeply nested. Building a strict mirror is high
 * maintenance and brittle to engine changes — every new astro field
 * would otherwise need a schema bump.
 *
 * Trade-off accepted: type safety on the inner panchang is lost at
 * the Blob boundary; consumers cast back to PanchangData. The
 * engine-hash Blob prefix (PR #692) covers the freshness story —
 * engine version changes auto-partition reads away from stale
 * Blobs.
 *
 * Strict wrapping fields (date, city, _v, _computedAt) remain
 * validated so a malformed Blob still bails to live compute.
 */

import { z } from 'zod';

/** Permissive inner shape — a non-null object, content is opaque
 *  past the schema. Consumers cast to the canonical PanchangData. */
const InnerPanchang = z.record(z.string(), z.unknown());

/** Tithi-table enrichment payload — see /api/panchang for the shape.
 *  Optional because polar non-rise days skip the enrichment. */
const TithiTableEnrichment = z.record(z.string(), z.unknown());

/** Festivals matched for this date (subset, opaque). */
const Festivals = z.array(z.record(z.string(), z.unknown()));

export const PanchangCityPageModel = z.object({
  _v: z.literal(1),
  _computedAt: z.string(),

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  city: z.string().regex(/^[a-z][a-z0-9-]*$/),

  panchang: InnerPanchang,
  tithiTable: TithiTableEnrichment.optional(),
  festivals: Festivals.optional(),
});

export type PanchangCityPageModel = z.infer<typeof PanchangCityPageModel>;
