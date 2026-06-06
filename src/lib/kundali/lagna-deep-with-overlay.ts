/**
 * Runtime merger that overlays per-locale `lagna-{locale}-overlay.json`
 * files onto LAGNA_DEEP, populating `.{locale}` fields on each
 * LocaleText object without touching the canonical tippanni-lagna.ts.
 *
 * Mirrors the pattern in yoga-details-with-overlay.ts. Each overlay
 * file is keyed by sign number (1..12) with one entry per section:
 *
 *   { "1": { "personality": "...", "career": "...", "health": "...",
 *            "relationships": "...", "finances": "...", "spiritual": "..." } }
 *
 * Empty overlay (`{}`) is a no-op: signs with no overlay entry for a
 * given locale fall back to .en via the rendering `tl()` helper.
 *
 * Consumers: `src/app/[locale]/kundali/lagna/[sign]/page.tsx` switches
 * its import from `tippanni-lagna` to this module. For locales with no
 * overlay entry, the merged structure is identical to the original.
 *
 * Wave-1 of /kundali/lagna 9-locale promotion: only Maithili (mai) is
 * populated. Marathi / Tamil / Telugu / Kannada / Gujarati / Bengali
 * land in follow-up PRs as their translations complete.
 *
 * Spec: docs/specs/2026-06-04-noindex-thin-translation-locales.md §3
 * (lifecycle state 2 → 3 — promotion).
 */

import { LAGNA_DEEP } from './tippanni-lagna';
import maiOverlayRaw from '@/lib/constants/lagna-mai-overlay.json';
import mrOverlayRaw from '@/lib/constants/lagna-mr-overlay.json';

type SectionKey =
  | 'personality'
  | 'career'
  | 'health'
  | 'relationships'
  | 'finances'
  | 'spiritual';

const SECTIONS: readonly SectionKey[] = [
  'personality',
  'career',
  'health',
  'relationships',
  'finances',
  'spiritual',
];

type OverlayLocale = 'mai' | 'mr';

/** Shape of each overlay JSON: keyed by sign number (1..12, stringified). */
type LagnaOverlay = Record<string, Partial<Record<SectionKey, string>> & { _meta?: unknown }>;

const OVERLAYS: Record<OverlayLocale, LagnaOverlay> = {
  mai: maiOverlayRaw as unknown as LagnaOverlay,
  mr: mrOverlayRaw as unknown as LagnaOverlay,
};

const OVERLAY_LOCALES: readonly OverlayLocale[] = ['mai', 'mr'];

/**
 * LAGNA_DEEP with `.<locale>` overlay strings attached to every
 * LocaleText section that has a matching entry in the overlay JSON.
 *
 * Deep-clones so the imported LAGNA_DEEP reference stays untouched.
 */
export const LAGNA_DEEP_WITH_OVERLAY: typeof LAGNA_DEEP = (() => {
  const merged = structuredClone(LAGNA_DEEP);
  for (let sign = 1; sign <= 12; sign++) {
    const entry = merged[sign];
    if (!entry) continue;
    for (const locale of OVERLAY_LOCALES) {
      const overlay = OVERLAYS[locale][String(sign)];
      if (!overlay) continue;
      for (const section of SECTIONS) {
        const text = overlay[section];
        if (!text) continue;
        // The LocaleText type is { en, hi, sa? } but extending with a
        // dynamic locale key matches how yoga-details-with-overlay does
        // it — the consuming `tl()` helper reads via index signature.
        (entry[section] as Record<string, string>)[locale] = text;
      }
    }
  }
  return merged;
})();
