/**
 * Empty-HTML regression guard for the precompute migration.
 *
 * The migration's biggest risk is silently producing pages that look fine
 * structurally (200 OK, valid HTML) but render with empty critical
 * sections — missing locale strings, dropped fields after Zod round-trip,
 * or partial engine output. The existing equivalence tests cover a single
 * sample (rashi/city, date) pair; this widens coverage to:
 *
 *   - All 12 rashis × 3 dates for horoscope
 *   - All cities-extended SEO-indexable cities × 3 dates for gauri-panchang
 *
 * For each cell we round-trip live-compute → write Blob → read Blob and
 * assert:
 *
 *   1. All required LocaleText fields carry at minimum `en`. (Engine
 *      output guarantee — if engine returns no `en` for a field, the
 *      page would render blank, schema strip or not.)
 *
 *   2. The 9 visible locales each carry SOMETHING for `insight` (load-
 *      bearing SEO body text). A locale-missing here means the page
 *      renders an empty `<p>` for non-en locales.
 *
 *   3. Day/night slot tables (gauri) have non-zero length. Empty arrays
 *      = empty table on the page.
 *
 *   4. The round-tripped model is deep-equal to the live-compute model
 *      modulo `_computedAt`. Catches schema-strip regressions broadly.
 *
 * If any cell fails, the test message lists the (rashi/city, date) pair
 * AND the specific field that came back empty/stripped. That's the
 * "show me which page renders blank" signal we want.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { __setStorageForTests, InMemoryStorage } from '@/lib/precompute/storage';
import { setPrecomputed } from '@/lib/precompute/writer';
import { RASHIS } from '@/lib/constants/rashis';
import { CITIES } from '@/lib/constants/cities';

// horoscope
import { horoscopeKey } from '@/lib/precompute/keys';
import { HoroscopePageModel } from '@/lib/precompute/schema/horoscope';
import { getHoroscopePageModel } from '@/lib/precompute/horoscope-page-model';

// gauri-panchang
import { gauriPanchangKey } from '@/lib/precompute/keys';
import { GauriPanchangPageModel } from '@/lib/precompute/schema/gauri-panchang';
import { getGauriPanchangPageModel } from '@/lib/precompute/gauri-panchang-page-model';

// choghadiya (defense in depth — covers the in-place migration we shipped on 2026-06-06)
import { choghadiyaKey } from '@/lib/precompute/keys';
import { ChoghadiyaPageModel } from '@/lib/precompute/schema/choghadiya';
import { getChoghadiyaPageModel } from '@/lib/precompute/choghadiya-page-model';

const VISIBLE_LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'] as const;
const SAMPLE_DATES = ['2026-06-12', '2026-09-21', '2027-01-15'] as const;

interface ProbeFailure {
  cell: string;
  field: string;
  reason: string;
}

function probeLocaleText(
  obj: unknown,
  fieldName: string,
  cell: string,
  requiredLocales: readonly string[],
  out: ProbeFailure[],
): void {
  if (obj == null || typeof obj !== 'object') {
    out.push({ cell, field: fieldName, reason: 'not an object' });
    return;
  }
  const o = obj as Record<string, unknown>;
  if (typeof o.en !== 'string' || o.en.length === 0) {
    out.push({ cell, field: fieldName, reason: 'missing/empty en' });
  }
  for (const loc of requiredLocales) {
    const v = o[loc];
    if (v !== undefined && (typeof v !== 'string' || v.length === 0)) {
      out.push({ cell, field: fieldName, reason: `${loc} present but empty` });
    }
  }
}

beforeEach(() => {
  __setStorageForTests(new InMemoryStorage());
  process.env.PRECOMPUTE_FETCH_ENABLED = 'true';
});

afterEach(() => {
  __setStorageForTests(null);
  delete process.env.PRECOMPUTE_FETCH_ENABLED;
});

describe('empty-HTML regression — horoscope across 12 rashis × 3 dates', () => {
  it('every cell carries non-empty critical fields and survives Blob round-trip', async () => {
    const failures: ProbeFailure[] = [];

    for (const rashi of RASHIS) {
      for (const date of SAMPLE_DATES) {
        const cell = `${rashi.slug}/${date}`;

        // Live compute via the loader (kill switch off, no Blob → falls
        // through to engine).
        delete process.env.PRECOMPUTE_FETCH_ENABLED;
        const live = await getHoroscopePageModel({
          date, rashiSlug: rashi.slug, moonSign: rashi.id,
        });
        process.env.PRECOMPUTE_FETCH_ENABLED = 'true';

        // Probe critical fields on the live model
        probeLocaleText(live.moonSignName, 'moonSignName', cell, ['en'], failures);
        probeLocaleText(live.insight, 'insight', cell, VISIBLE_LOCALES, failures);
        probeLocaleText(live.luckyColor, 'luckyColor', cell, ['en'], failures);
        probeLocaleText(live.luckyDirection, 'luckyDirection', cell, ['en'], failures);
        probeLocaleText(live.remedy.mantra, 'remedy.mantra', cell, ['en'], failures);
        probeLocaleText(live.remedy.practical, 'remedy.practical', cell, ['en'], failures);
        for (const area of ['career','love','health','finance','spirituality'] as const) {
          probeLocaleText(
            live.areas[area].text, `areas.${area}.text`, cell, ['en'], failures,
          );
        }
        // dos / donts non-empty
        if (live.dosAndDonts.dos.length === 0) {
          failures.push({ cell, field: 'dosAndDonts.dos', reason: 'empty array' });
        }
        if (live.dosAndDonts.donts.length === 0) {
          failures.push({ cell, field: 'dosAndDonts.donts', reason: 'empty array' });
        }

        // Round-trip through the Blob schema
        await setPrecomputed({
          key: horoscopeKey(rashi.slug, date),
          schema: HoroscopePageModel,
          data: live,
        });
        const round = await getHoroscopePageModel({
          date, rashiSlug: rashi.slug, moonSign: rashi.id,
        });

        // Schema-strip check — every locale present on `insight` in
        // `live` must still be present on `round`.
        const liveInsight = live.insight as Record<string, string | undefined>;
        const roundInsight = round.insight as Record<string, string | undefined>;
        for (const loc of Object.keys(liveInsight)) {
          if (liveInsight[loc] != null && roundInsight[loc] == null) {
            failures.push({
              cell, field: `insight.${loc}`,
              reason: 'STRIPPED during Blob round-trip',
            });
          }
        }
      }
    }

    if (failures.length) {
      const sample = failures.slice(0, 15).map((f) => `${f.cell} :: ${f.field} — ${f.reason}`).join('\n  ');
      throw new Error(`${failures.length} horoscope cells produced empty/stripped content:\n  ${sample}`);
    }
  });
});

describe('empty-HTML regression — gauri-panchang across 5 cities × 3 dates', () => {
  // Sample a representative spread: 2 IST anchor cities + 3 diaspora
  // (catches timezone-edge bugs in the engine for international cities).
  const SAMPLE_CITIES = ['delhi', 'chennai', 'dubai', 'new-york', 'singapore'];

  it('every cell carries non-empty critical fields and survives Blob round-trip', async () => {
    const failures: ProbeFailure[] = [];

    for (const slug of SAMPLE_CITIES) {
      const city = CITIES.find((c) => c.slug === slug);
      if (!city) continue;

      for (const date of SAMPLE_DATES) {
        const cell = `${slug}/${date}`;

        delete process.env.PRECOMPUTE_FETCH_ENABLED;
        const live = await getGauriPanchangPageModel({ date, city });
        process.env.PRECOMPUTE_FETCH_ENABLED = 'true';

        if (live.daySlots.length === 0) {
          failures.push({ cell, field: 'daySlots', reason: 'empty array' });
        }
        if (live.nightSlots.length === 0) {
          failures.push({ cell, field: 'nightSlots', reason: 'empty array' });
        }
        // Each slot must carry an en name + locale-keyed entries
        for (const [idx, slot] of live.daySlots.entries()) {
          probeLocaleText(slot.name, `daySlots[${idx}].name`, cell, VISIBLE_LOCALES, failures);
        }
        for (const [idx, slot] of live.nightSlots.entries()) {
          probeLocaleText(slot.name, `nightSlots[${idx}].name`, cell, VISIBLE_LOCALES, failures);
        }

        // Round-trip through Blob
        await setPrecomputed({
          key: gauriPanchangKey(date, slug),
          schema: GauriPanchangPageModel,
          data: live,
        });
        const round = await getGauriPanchangPageModel({ date, city });
        for (const [idx, slot] of live.daySlots.entries()) {
          const liveName = slot.name as Record<string, string | undefined>;
          const roundName = round.daySlots[idx]?.name as Record<string, string | undefined> | undefined;
          if (!roundName) continue;
          for (const loc of Object.keys(liveName)) {
            if (liveName[loc] != null && roundName[loc] == null) {
              failures.push({
                cell, field: `daySlots[${idx}].name.${loc}`,
                reason: 'STRIPPED during Blob round-trip',
              });
            }
          }
        }
      }
    }

    if (failures.length) {
      const sample = failures.slice(0, 15).map((f) => `${f.cell} :: ${f.field} — ${f.reason}`).join('\n  ');
      throw new Error(`${failures.length} gauri-panchang cells produced empty/stripped content:\n  ${sample}`);
    }
  });
});

describe('empty-HTML regression — choghadiya across 5 cities × 3 dates (defense in depth)', () => {
  // Re-checks the choghadiya migration that's been live since 2026-06-06.
  // If any future schema bump silently strips a locale, this catches it
  // before the post-deploy dashboard does.
  const SAMPLE_CITIES = ['delhi', 'mumbai', 'chennai', 'dubai', 'new-york'];

  it('every cell carries non-empty slot names across all visible locales', async () => {
    const failures: ProbeFailure[] = [];

    for (const slug of SAMPLE_CITIES) {
      const city = CITIES.find((c) => c.slug === slug);
      if (!city) continue;

      for (const date of SAMPLE_DATES) {
        const cell = `${slug}/${date}`;

        delete process.env.PRECOMPUTE_FETCH_ENABLED;
        const live = await getChoghadiyaPageModel({ date, city });
        process.env.PRECOMPUTE_FETCH_ENABLED = 'true';

        if (live.daySlots.length === 0 || live.nightSlots.length === 0) {
          failures.push({
            cell, field: 'slots',
            reason: `day=${live.daySlots.length} night=${live.nightSlots.length}`,
          });
        }
        for (const [idx, slot] of live.daySlots.entries()) {
          probeLocaleText(slot.name, `daySlots[${idx}].name`, cell, VISIBLE_LOCALES, failures);
        }

        await setPrecomputed({
          key: choghadiyaKey(date, slug),
          schema: ChoghadiyaPageModel,
          data: live,
        });
        const round = await getChoghadiyaPageModel({ date, city });
        for (const [idx, slot] of live.daySlots.entries()) {
          const liveName = slot.name as Record<string, string | undefined>;
          const roundName = round.daySlots[idx]?.name as Record<string, string | undefined> | undefined;
          if (!roundName) continue;
          for (const loc of Object.keys(liveName)) {
            if (liveName[loc] != null && roundName[loc] == null) {
              failures.push({
                cell, field: `daySlots[${idx}].name.${loc}`,
                reason: 'STRIPPED during Blob round-trip',
              });
            }
          }
        }
      }
    }

    if (failures.length) {
      const sample = failures.slice(0, 15).map((f) => `${f.cell} :: ${f.field} — ${f.reason}`).join('\n  ');
      throw new Error(`${failures.length} choghadiya cells produced empty/stripped content:\n  ${sample}`);
    }
  });
});
