import type { LocaleText } from '@/types/panchang';

/**
 * Safe multilingual text accessor.
 * Falls back to 'en' when the requested locale key doesn't exist on the object.
 * Works with both Trilingual (constants) and LocaleText (inline labels).
 */
export function tl(obj: LocaleText | Record<string, string> | null | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || (obj as Record<string, string>).en || '';
}

/**
 * Locales that share the Devanagari script. When a `{ en, hi }`-shaped
 * data structure has no entry for one of these locales, falling back
 * to `.hi` preserves Devanagari rendering instead of downgrading to
 * Latin `.en`.
 *
 * `sa` is retired (HTTP 410) but kept here so any straggling crawler
 * or direct-URL hit still sees Devanagari text.
 *
 * Locales NOT in this set (en, ta, te, kn, gu, bn) have their own
 * scripts and don't share with hi — they fall straight to .en when
 * their own locale field is missing.
 */
const DEVANAGARI_SCRIPT_LOCALES: ReadonlySet<string> = new Set(['hi', 'mai', 'mr', 'sa']);

/**
 * Script-family-aware multilingual accessor.
 *
 * Resolution order:
 *   1. obj[locale]  (direct match — always wins when present)
 *   2. obj.hi       (Devanagari sibling fallback for mai/mr/sa only)
 *   3. obj.en       (final fallback)
 *
 * Effect vs the legacy `isHi ? obj.hi : obj.en` pattern this replaces:
 *   - en, ta, te, kn, gu, bn → `.en`  (identical to today)
 *   - hi → `.hi`                       (identical)
 *   - mai, mr, sa → `.hi`              (identical to today's isHi behaviour)
 *   - future: locale ships its own field → direct match (automatic upgrade)
 *
 * When to use:
 *   - Sanskrit-loanword labels (Brahma Muhurta, Rahu Kaal, planet names,
 *     dignity chips, named windows) — these read identically across
 *     all four Devanagari-script locales.
 *   - Any data structure that ships en/hi today and will incrementally
 *     gain ta/te/kn/gu/bn (and maybe mr/mai) translations over time.
 *
 * When NOT to use:
 *   - Multi-sentence prose where Marathi grammar (आहे/चे) or Maithili
 *     grammar (अछि/मे/सँ) differs from Hindi. Falling back to .hi shows
 *     Hindi prose on /mr/* or /mai/* — same script, wrong grammar.
 *     Use plain `tl()` (English fallback) there until proper .mr/.mai
 *     translations ship. (See lesson PR #391 HIGH.)
 */
export function tlScript(
  obj: LocaleText | Record<string, string> | null | undefined,
  locale: string,
): string {
  if (!obj) return '';
  const m = obj as Record<string, string>;
  const direct = m[locale];
  if (direct) return direct;
  if (DEVANAGARI_SCRIPT_LOCALES.has(locale) && m.hi) return m.hi;
  return m.en ?? '';
}
