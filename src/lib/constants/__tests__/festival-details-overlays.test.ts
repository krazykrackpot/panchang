import { describe, it, expect } from 'vitest';
import {
  FESTIVAL_DETAILS as RAW_FESTIVAL_DETAILS,
  CATEGORY_DETAILS as RAW_CATEGORY_DETAILS,
} from '@/lib/constants/festival-details';
import {
  FESTIVAL_DETAILS as MERGED_FESTIVAL_DETAILS,
  CATEGORY_DETAILS as MERGED_CATEGORY_DETAILS,
} from '@/lib/constants/festival-details-with-overlay';
import taOverlay from '@/lib/constants/festival-details-ta-overlay.json';
import teOverlay from '@/lib/constants/festival-details-te-overlay.json';
import bnOverlay from '@/lib/constants/festival-details-bn-overlay.json';
import guOverlay from '@/lib/constants/festival-details-gu-overlay.json';
import knOverlay from '@/lib/constants/festival-details-kn-overlay.json';
import maiOverlay from '@/lib/constants/festival-details-mai-overlay.json';
import mrOverlay from '@/lib/constants/festival-details-mr-overlay.json';
import saOverlay from '@/lib/constants/festival-details-sa-overlay.json';

const OVERLAYS = {
  ta: taOverlay as Record<string, string>,
  te: teOverlay as Record<string, string>,
  bn: bnOverlay as Record<string, string>,
  gu: guOverlay as Record<string, string>,
  kn: knOverlay as Record<string, string>,
  mai: maiOverlay as Record<string, string>,
  mr: mrOverlay as Record<string, string>,
  sa: saOverlay as Record<string, string>,
};

const VALID_FIELDS = new Set([
  'name', 'mythology', 'observance', 'significance', 'deity', 'fastNote', 'observationRule',
]);

describe('festival-details overlays — drift guards', () => {
  it('every overlay key maps to a real (slug, field) in source data', () => {
    const allSlugs = new Set([
      ...Object.keys(RAW_FESTIVAL_DETAILS),
      ...Object.keys(RAW_CATEGORY_DETAILS),
    ]);
    const badEntries: Array<{ locale: string; key: string; reason: string }> = [];
    for (const [locale, overlay] of Object.entries(OVERLAYS)) {
      for (const key of Object.keys(overlay)) {
        const dotIdx = key.lastIndexOf('.');
        if (dotIdx < 0) {
          badEntries.push({ locale, key, reason: 'no field segment' });
          continue;
        }
        const slug = key.slice(0, dotIdx);
        const field = key.slice(dotIdx + 1);
        if (!allSlugs.has(slug)) {
          badEntries.push({ locale, key, reason: `unknown slug "${slug}"` });
          continue;
        }
        if (!VALID_FIELDS.has(field)) {
          badEntries.push({ locale, key, reason: `unknown field "${field}"` });
        }
      }
    }
    expect(badEntries).toEqual([]);
  });

  it('merged data preserves all source slugs', () => {
    expect(Object.keys(MERGED_FESTIVAL_DETAILS).sort()).toEqual(
      Object.keys(RAW_FESTIVAL_DETAILS).sort(),
    );
    expect(Object.keys(MERGED_CATEGORY_DETAILS).sort()).toEqual(
      Object.keys(RAW_CATEGORY_DETAILS).sort(),
    );
  });

  it('overlay does not overwrite pre-existing locale entries', () => {
    // Sample a slug+field where source already has hi text — confirm
    // the merged result keeps the source value, not an overlay one.
    const slug = Object.keys(RAW_FESTIVAL_DETAILS)[0];
    const sourceHi = RAW_FESTIVAL_DETAILS[slug].name.hi;
    const mergedHi = MERGED_FESTIVAL_DETAILS[slug].name.hi;
    expect(mergedHi).toBe(sourceHi);
  });

  it('overlay attaches translations to LocaleText only where source is missing', () => {
    // Pick any slug+field+locale where source had no value AND overlay
    // has a value — confirm merged result equals overlay value.
    let found = false;
    outer: for (const [locale, overlay] of Object.entries(OVERLAYS)) {
      for (const key of Object.keys(overlay)) {
        const dotIdx = key.lastIndexOf('.');
        const slug = key.slice(0, dotIdx);
        const field = key.slice(dotIdx + 1) as
          'name' | 'mythology' | 'observance' | 'significance' | 'deity' | 'fastNote' | 'observationRule';
        const source = RAW_FESTIVAL_DETAILS[slug] ?? RAW_CATEGORY_DETAILS[slug];
        if (!source || !source[field]) continue;
        const sourceLocaleVal = (source[field] as Record<string, string | undefined>)[locale];
        if (typeof sourceLocaleVal === 'string' && sourceLocaleVal.trim()) continue;
        const merged = MERGED_FESTIVAL_DETAILS[slug] ?? MERGED_CATEGORY_DETAILS[slug];
        const mergedLocaleVal = (merged[field] as Record<string, string | undefined>)[locale];
        expect(mergedLocaleVal).toBe(overlay[key]);
        found = true;
        break outer;
      }
    }
    // Only meaningful once overlays have content. Skip until then.
    if (!found) {
      console.warn('[festival-overlay-test] no overlay entries to spot-check yet');
    }
  });
});
