/**
 * Runtime locale-overlay merger for devotional content.
 *
 * `devotional-content.ts` ships 55 DevotionalItem entries with title
 * (en/hi only), meaning (EN paragraph), and significance (EN paragraph)
 * fields. The devanagari + transliteration fields are sacred text and
 * intentionally NOT translated — they stay in the source script for
 * all locales.
 *
 * This module attaches Gemini-translated overlays at module-load to
 * the existing items via mutation. After import the items carry
 * locale-keyed fields for the 7 regional Indic locales (mai/mr/ta/te/
 * kn/gu/bn).
 *
 * Lookup helpers (`devotionalTitle`, `devotionalMeaning`,
 * `devotionalSignificance`) resolve a per-locale string with fall-back
 * to hi → en.
 *
 * Spec: docs/specs/2026-06-04-noindex-thin-translation-locales.md §3
 * (lifecycle state 2 → 3 — promotion). Source script for translation:
 * scripts/translate-devotional-via-gemini.py.
 */

import {
  ALL_DEVOTIONAL_ITEMS,
  TYPE_LABELS,
  DAY_NAMES,
  type DevotionalItem,
  type DevotionalType,
} from './devotional-content';
import maiOverlay from '@/lib/constants/devotional-mai-overlay.json';
import mrOverlay from '@/lib/constants/devotional-mr-overlay.json';
import taOverlay from '@/lib/constants/devotional-ta-overlay.json';
import teOverlay from '@/lib/constants/devotional-te-overlay.json';
import knOverlay from '@/lib/constants/devotional-kn-overlay.json';
import guOverlay from '@/lib/constants/devotional-gu-overlay.json';
import bnOverlay from '@/lib/constants/devotional-bn-overlay.json';

type OverlayFile = { translations: Record<string, string> };

export const DEVOTIONAL_OVERLAY_LOCALES = [
  'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn',
] as const;
type OverlayLocale = (typeof DEVOTIONAL_OVERLAY_LOCALES)[number];

const OVERLAYS: Record<OverlayLocale, Record<string, string>> = {
  mai: (maiOverlay as OverlayFile).translations,
  mr:  (mrOverlay  as OverlayFile).translations,
  ta:  (taOverlay  as OverlayFile).translations,
  te:  (teOverlay  as OverlayFile).translations,
  kn:  (knOverlay  as OverlayFile).translations,
  gu:  (guOverlay  as OverlayFile).translations,
  bn:  (bnOverlay  as OverlayFile).translations,
};

// Extended item type carrying the regional-locale fields attached at
// module load. The base DevotionalItem stays unchanged (title.en/hi
// only) so any callers reading `item.title.en` keep working.
export interface DevotionalItemL10n extends DevotionalItem {
  titleLoc: Record<string, string>;
  meaningLoc: Record<string, string>;
  significanceLoc: Record<string, string>;
}

function hasOwn(obj: Record<string, string>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Attach per-locale overlay strings to every item. Mutates the items
 * in `ALL_DEVOTIONAL_ITEMS` in place because they're shared references
 * — readers via `getDevotionalItem` then see the extra fields without
 * a separate cache.
 */
function buildLocalizedItems(): readonly DevotionalItemL10n[] {
  return ALL_DEVOTIONAL_ITEMS.map((item) => {
    const titleLoc: Record<string, string> = { en: item.title.en, hi: item.title.hi };
    const meaningLoc: Record<string, string> = { en: item.meaning };
    const significanceLoc: Record<string, string> = { en: item.significance };
    for (const locale of DEVOTIONAL_OVERLAY_LOCALES) {
      const ov = OVERLAYS[locale];
      const tk = `${item.slug}.title`;
      const mk = `${item.slug}.meaning`;
      const sk = `${item.slug}.significance`;
      if (hasOwn(ov, tk)) titleLoc[locale] = ov[tk];
      if (hasOwn(ov, mk)) meaningLoc[locale] = ov[mk];
      if (hasOwn(ov, sk)) significanceLoc[locale] = ov[sk];
    }
    return { ...item, titleLoc, meaningLoc, significanceLoc };
  });
}

export const DEVOTIONAL_ITEMS_L10N: readonly DevotionalItemL10n[] =
  Object.freeze(buildLocalizedItems());

/**
 * Locale-aware lookup for a devotional item by type + slug. Returns
 * the L10n-extended item; callers can then read .titleLoc[locale],
 * .meaningLoc[locale], .significanceLoc[locale].
 */
export function getDevotionalItemL10n(
  type: DevotionalType,
  slug: string,
): DevotionalItemL10n | undefined {
  return DEVOTIONAL_ITEMS_L10N.find((i) => i.type === type && i.slug === slug);
}

/**
 * Per-locale type labels. Built once at module load from the chrome
 * entries in the overlay JSONs (keys: type.aarti / type.chalisa / etc.).
 */
export const TYPE_LABELS_L10N: Record<
  DevotionalType,
  Record<string, string>
> = (() => {
  const out: Record<DevotionalType, Record<string, string>> = {
    aarti:   { en: TYPE_LABELS.aarti.en,   hi: TYPE_LABELS.aarti.hi },
    chalisa: { en: TYPE_LABELS.chalisa.en, hi: TYPE_LABELS.chalisa.hi },
    stotram: { en: TYPE_LABELS.stotram.en, hi: TYPE_LABELS.stotram.hi },
    mantra:  { en: TYPE_LABELS.mantra.en,  hi: TYPE_LABELS.mantra.hi },
  };
  for (const locale of DEVOTIONAL_OVERLAY_LOCALES) {
    const ov = OVERLAYS[locale];
    for (const type of ['aarti', 'chalisa', 'stotram', 'mantra'] as const) {
      const k = `type.${type}`;
      if (hasOwn(ov, k)) out[type][locale] = ov[k];
    }
  }
  return out;
})();

/** Per-locale day names indexed by 0..6 (Sunday..Saturday). */
export const DAY_NAMES_L10N: Record<number, Record<string, string>> = (() => {
  const out: Record<number, Record<string, string>> = {};
  for (let d = 0; d <= 6; d++) {
    out[d] = { en: DAY_NAMES[d].en, hi: DAY_NAMES[d].hi };
  }
  for (const locale of DEVOTIONAL_OVERLAY_LOCALES) {
    const ov = OVERLAYS[locale];
    for (let d = 0; d <= 6; d++) {
      const k = `day.${d}`;
      if (hasOwn(ov, k)) out[d][locale] = ov[k];
    }
  }
  return out;
})();

/** Pick the best string from a locale map: locale → hi → en → ''. */
export function pickLoc(
  loc: Record<string, string>,
  locale: string,
): string {
  return loc[locale] ?? loc.hi ?? loc.en ?? '';
}
