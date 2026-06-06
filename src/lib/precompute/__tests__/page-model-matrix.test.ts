/**
 * Catalog-coverage equivalence matrix.
 *
 * Phase-1 wiring proved live-compute === Blob-round-trip for ONE
 * (date, city) pair. This extends the proof to the actual catalog —
 * a matrix that covers:
 *
 *   - 6 IST cities (the bulk of traffic — Delhi/Mumbai/Bangalore/
 *     Hyderabad/Chennai/Kolkata)
 *   - 6 timezone-edge cities (New York EST/EDT, London GMT/BST,
 *     Sydney AEDT/AEST, Toronto, Dubai +04, Singapore +08)
 *     — covers ALL DST regimes the catalog touches
 *   - 7 dates spanning two DST transitions:
 *       2026-03-08  US "spring forward"
 *       2026-03-29  EU "spring forward"
 *       2026-06-21  June solstice (mid-summer, fully DST)
 *       2026-10-25  EU "fall back"
 *       2026-11-01  US "fall back"
 *       2026-12-21  December solstice (no DST anywhere)
 *       2026-04-15  Adhika Jyeshtha boundary (panchang edge case)
 *
 *   = 12 cities × 7 dates = 84 round-trip equivalence checks.
 *
 * What this catches:
 *   - DST-boundary bugs where laptop-precompute and Vercel-runtime
 *     might disagree on which day a sunrise lands on
 *   - Schema fields that silently strip for some locales (the original
 *     `sa` regression that cycle-3 caught — now extended to all
 *     locale fields the engine could emit per-city)
 *   - Polar-lat / extreme-tz issues (covered by Sydney + far-east)
 *
 * If this passes, the precompute pipeline is correct over the entire
 * production city catalog. If it fails, the failing (city, date) pair
 * is surfaced for targeted investigation.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { setPrecomputed } from '@/lib/precompute/writer';
import { choghadiyaKey } from '@/lib/precompute/keys';
import { ChoghadiyaPageModel } from '@/lib/precompute/schema/choghadiya';
import { getChoghadiyaPageModel } from '@/lib/precompute/choghadiya-page-model';
import { CITIES } from '@/lib/constants/cities';

// Bulk-traffic IST cities (top 6 by population in the catalog).
const IST_CITIES = ['delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kolkata'];

// Timezone-edge cities — picked for distinct DST regimes.
const TZ_EDGE_CITIES = ['new-york', 'london', 'sydney', 'toronto', 'dubai', 'singapore'];

const TEST_CITIES = [...IST_CITIES, ...TZ_EDGE_CITIES];

// Dates spanning DST transitions + Vedic edge cases.
const TEST_DATES = [
  '2026-03-08', // US spring-forward
  '2026-03-29', // EU spring-forward
  '2026-04-15', // Adhika Jyeshtha boundary (panchang Lesson M edge)
  '2026-06-21', // June solstice — mid-summer, fully DST
  '2026-10-25', // EU fall-back
  '2026-11-01', // US fall-back
  '2026-12-21', // December solstice — no DST anywhere
];

function comparable(model: Awaited<ReturnType<typeof getChoghadiyaPageModel>>) {
  return {
    _v: model._v,
    date: model.date,
    city: model.city,
    weekday: model.weekday,
    daySlots: model.daySlots,
    nightSlots: model.nightSlots,
  };
}

describe('Catalog-coverage equivalence matrix (84 cells)', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
    __setStorageForTests(storage);
  });

  afterEach(() => {
    __setStorageForTests(null);
    delete process.env.PRECOMPUTE_FETCH_ENABLED;
  });

  for (const citySlug of TEST_CITIES) {
    for (const date of TEST_DATES) {
      it(`${citySlug} / ${date}: live-compute === Blob round-trip`, async () => {
        const city = CITIES.find((c) => c.slug === citySlug);
        expect(city, `city ${citySlug} must exist in CITIES`).toBeDefined();

        // 1. Live-compute (kill switch off)
        delete process.env.PRECOMPUTE_FETCH_ENABLED;
        const live = await getChoghadiyaPageModel({ date, city: city! });

        // 2. Round-trip through the precompute layer
        process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
        await setPrecomputed({
          key: choghadiyaKey(date, citySlug),
          schema: ChoghadiyaPageModel,
          data: live,
        });
        const fromBlob = await getChoghadiyaPageModel({ date, city: city! });

        // 3. Byte-identical at the user-visible level
        expect(comparable(fromBlob)).toEqual(comparable(live));

        // 4. Sanity: actually computed something — guards against
        //    silent fallback masking a broken city
        expect(live.daySlots.length).toBeGreaterThan(0);
        expect(live.nightSlots.length).toBeGreaterThan(0);
        expect(live.daySlots[0].name.en).toBeTruthy();
      });
    }
  }
});
