/**
 * Blob payload trim + rehydrate for FestivalEntry arrays.
 *
 * Problem: the precomputed festivals-year Blob ships with `description`
 * per entry — a multi-locale LocaleText that duplicates
 * `FESTIVAL_DETAILS[slug]?.significance` (already a runtime constant).
 * Ujjain's 2026 Blob has 358 festival entries × ~600B description per
 * entry = **210 KB** of dead duplication (32% of the 651 KB total).
 *
 * Fix: strip `description` at write time when the slug has FESTIVAL_DETAILS
 * coverage. Rehydrate at read time by looking up the same constant.
 * Net effect: lossless from consumer's perspective; ~210 KB saved per
 * Blob × 59 cities × 3 years = ~37 MB of stored bytes and network egress.
 *
 * Bandwidth math (the 19K/day festival/city invocations as of 2026-06-20):
 *   19,000 × 210 KB = 4 GB/day less Blob egress.
 *   Per-request JSON.parse savings: ~1-2 ms each on throttled Vercel runtime.
 *
 * Roundtrip invariants:
 *   - Live compute path (no Blob): generator emits description as before.
 *     Skips trim, doesn't need rehydrate (description already present).
 *   - Blob path: write trims; read rehydrates. Consumer sees no change.
 *   - Old Blobs (with description still in payload): rehydrate is a no-op
 *     because description is already set. Backwards compatible.
 */

import type { FestivalEntry } from './festival-generator';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details-with-overlay';

/**
 * Strip `description` from festivals whose slug has FESTIVAL_DETAILS coverage.
 * Returns a NEW array; original is not mutated.
 *
 * Festivals without slug coverage (rare ekadashis, category-only entries,
 * solar festivals) keep their description — they don't have a constant to
 * rehydrate from.
 */
export function trimDescriptionsForBlob(festivals: FestivalEntry[]): FestivalEntry[] {
  return festivals.map((f) => {
    if (f.slug && FESTIVAL_DETAILS[f.slug]?.significance) {
      // Strip description; cast through unknown since the type requires it
      // but the on-disk shape allows it to be missing (it's reconstructed on
      // read by rehydrateFestivalDescriptions).
      const { description: _stripped, ...rest } = f;
      return rest as unknown as FestivalEntry;
    }
    return f;
  });
}

/**
 * Rehydrate `description` in place for any entry where it's missing/empty
 * and the slug has FESTIVAL_DETAILS coverage. Mutates input.
 *
 * Safe to call on entries that already have description (no-op for those).
 */
export function rehydrateFestivalDescriptions(festivals: FestivalEntry[]): void {
  for (const f of festivals) {
    // Skip if description is already populated (live-compute or old Blob).
    if (f.description && (f.description.en || f.description.hi)) continue;
    if (!f.slug) continue;
    const significance = FESTIVAL_DETAILS[f.slug]?.significance;
    if (significance) {
      f.description = significance;
    }
  }
}
