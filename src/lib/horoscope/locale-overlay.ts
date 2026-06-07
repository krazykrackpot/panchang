/**
 * Runtime locale-overlay merger for horoscope content.
 *
 * The horoscope source files (templates.ts, rashi-editorial.ts,
 * daily-engine.ts, daily-article.ts) declare the 10-locale LocaleText
 * shape but historically shipped fake en/hi duplicates for the
 * regional Indic locales (ta/te/bn/gu/kn/mr/mai). Google's canonical-
 * consolidation algorithm folded those URLs into the EN/HI canonical
 * — the May 31 2026 impressions cliff.
 *
 * Translations for all 7 regional locales are generated via Gemini
 * 2.5 Flash by scripts/translate-horoscope-via-gemini.py and stored
 * in src/lib/constants/horoscope-{locale}-overlay.json — each is a
 * map from the EN string to its translation.
 *
 * `applyHoroscopeOverlay(target)` walks the target recursively, and
 * for any object that has both `en` and at least one other locale
 * key (i.e. it looks like a LocaleText), replaces the regional locale
 * fields with the corresponding overlay value. Existing real
 * translations (where overlay has the same value as the source) are
 * idempotently re-applied — no information lost.
 *
 * Called once per source file at module load.
 */

import maiOverlay from '@/lib/constants/horoscope-mai-overlay.json';
import mrOverlay from '@/lib/constants/horoscope-mr-overlay.json';
import taOverlay from '@/lib/constants/horoscope-ta-overlay.json';
import teOverlay from '@/lib/constants/horoscope-te-overlay.json';
import knOverlay from '@/lib/constants/horoscope-kn-overlay.json';
import guOverlay from '@/lib/constants/horoscope-gu-overlay.json';
import bnOverlay from '@/lib/constants/horoscope-bn-overlay.json';

type OverlayFile = { translations: Record<string, string> };

const OVERLAY_LOCALES = ['mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const;
type OverlayLocale = (typeof OVERLAY_LOCALES)[number];

const OVERLAYS: Record<OverlayLocale, Record<string, string>> = {
  mai: (maiOverlay as OverlayFile).translations,
  mr:  (mrOverlay  as OverlayFile).translations,
  ta:  (taOverlay  as OverlayFile).translations,
  te:  (teOverlay  as OverlayFile).translations,
  kn:  (knOverlay  as OverlayFile).translations,
  gu:  (guOverlay  as OverlayFile).translations,
  bn:  (bnOverlay  as OverlayFile).translations,
};

type LocaleTextLike = Record<string, string | undefined> & { en?: string };

function looksLikeLocaleText(obj: unknown): obj is LocaleTextLike {
  if (typeof obj !== 'object' || obj === null) return false;
  const rec = obj as Record<string, unknown>;
  if (typeof rec.en !== 'string') return false;
  // Heuristic: has at least one of the locale keys we care about
  return (
    typeof rec.hi === 'string' ||
    typeof rec.sa === 'string' ||
    typeof rec.mai === 'string' ||
    typeof rec.mr === 'string' ||
    typeof rec.ta === 'string' ||
    typeof rec.te === 'string' ||
    typeof rec.kn === 'string' ||
    typeof rec.gu === 'string' ||
    typeof rec.bn === 'string'
  );
}

/**
 * Walk `target` recursively and apply overlay translations to any
 * LocaleText-shaped objects encountered.
 *
 * Safe to call multiple times — the mutation is idempotent (writing
 * the same value twice is a no-op).
 *
 * Defensive guards (Gemini PR #496 round-1 MED):
 *   - `visited` set prevents infinite recursion on circular references.
 *   - Only descends into plain objects + arrays; skips class instances
 *     (e.g. Date, Map, custom classes) by checking the prototype.
 *   - Checks Object.isExtensible() before mutating LocaleText so
 *     frozen overlay targets don't throw in strict mode.
 */
export function applyHoroscopeOverlay(
  target: unknown,
  visited: Set<object> = new Set(),
): void {
  if (typeof target !== 'object' || target === null) return;
  if (visited.has(target as object)) return;
  visited.add(target as object);

  if (Array.isArray(target)) {
    for (const item of target) applyHoroscopeOverlay(item, visited);
    return;
  }

  if (looksLikeLocaleText(target)) {
    const en = target.en;
    if (typeof en !== 'string') return;
    if (!Object.isExtensible(target)) return;
    for (const locale of OVERLAY_LOCALES) {
      // hasOwnProperty.call avoids prototype-chain lookups if `en`
      // happens to collide with Object.prototype properties like
      // "constructor", "toString", "valueOf" — those would otherwise
      // resolve to built-in function references rather than the
      // overlay translation. Gemini PR #496 round-2 MED.
      const overlay = OVERLAYS[locale];
      const tr = Object.prototype.hasOwnProperty.call(overlay, en)
        ? overlay[en]
        : undefined;
      if (typeof tr === 'string' && tr.length > 0) {
        target[locale] = tr;
      }
    }
    return;
  }

  // Restrict descent to plain objects — skip class instances so we
  // don't accidentally mutate framework objects (Date, Map, etc.) or
  // React internals.
  const proto = Object.getPrototypeOf(target);
  if (proto !== null && proto !== Object.prototype) return;

  for (const value of Object.values(target as Record<string, unknown>)) {
    applyHoroscopeOverlay(value, visited);
  }
}
