import { describe, it, expect } from 'vitest';
import { MUHURTA_TYPES as RAW } from '@/lib/constants/muhurta-types';
import { MUHURTA_TYPES as MERGED } from '@/lib/constants/muhurta-types-with-overlay';
import taOverlay from '@/lib/constants/muhurta-ta-overlay.json';
import teOverlay from '@/lib/constants/muhurta-te-overlay.json';
import bnOverlay from '@/lib/constants/muhurta-bn-overlay.json';
import guOverlay from '@/lib/constants/muhurta-gu-overlay.json';
import knOverlay from '@/lib/constants/muhurta-kn-overlay.json';
import maiOverlay from '@/lib/constants/muhurta-mai-overlay.json';
import mrOverlay from '@/lib/constants/muhurta-mr-overlay.json';

const OVERLAYS = {
  ta: taOverlay as Record<string, string>,
  te: teOverlay as Record<string, string>,
  bn: bnOverlay as Record<string, string>,
  gu: guOverlay as Record<string, string>,
  kn: knOverlay as Record<string, string>,
  mai: maiOverlay as Record<string, string>,
  mr: mrOverlay as Record<string, string>,
};

const VALID_FIELDS = new Set(['name', 'subtitle', 'description']);

describe('muhurta overlays — drift guards', () => {
  it('every overlay key maps to a real (slug, field)', () => {
    const allSlugs = new Set(RAW.map((t) => t.slug));
    const bad: Array<{ locale: string; key: string; reason: string }> = [];
    for (const [locale, overlay] of Object.entries(OVERLAYS)) {
      for (const key of Object.keys(overlay)) {
        const dot = key.lastIndexOf('.');
        if (dot < 0) {
          bad.push({ locale, key, reason: 'no field segment' });
          continue;
        }
        const slug = key.slice(0, dot);
        const field = key.slice(dot + 1);
        if (!allSlugs.has(slug)) bad.push({ locale, key, reason: `unknown slug "${slug}"` });
        else if (!VALID_FIELDS.has(field)) bad.push({ locale, key, reason: `unknown field "${field}"` });
      }
    }
    expect(bad).toEqual([]);
  });

  it('merged preserves all source slugs in order', () => {
    expect(MERGED.map((t) => t.slug)).toEqual(RAW.map((t) => t.slug));
  });

  it('merged does not overwrite pre-existing locale entries', () => {
    const first = RAW[0];
    const merged = MERGED[0];
    expect(merged.name.hi).toBe(first.name.hi);
    expect(merged.name.en).toBe(first.name.en);
  });
});
