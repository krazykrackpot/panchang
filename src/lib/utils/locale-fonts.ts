import type { CSSProperties } from 'react';

/**
 * Returns the appropriate body font style for a given locale.
 * - Hindi/Sanskrit → Devanagari
 * - Tamil → Noto Sans Tamil
 * - Telugu → Noto Sans Telugu
 * - Bengali → Noto Sans Bengali
 * - Kannada → Noto Sans Kannada
 * - English → undefined (uses default)
 */
export function getBodyFont(locale: string): CSSProperties | undefined {
  if (locale === 'hi' || locale === 'sa') return { fontFamily: 'var(--font-devanagari-body)' };
  if (locale === 'ta') return { fontFamily: 'var(--font-tamil-body)' };
  if (locale === 'te') return { fontFamily: 'var(--font-telugu-body)' };
  if (locale === 'bn') return { fontFamily: 'var(--font-bengali-body)' };
  if (locale === 'kn') return { fontFamily: 'var(--font-kannada-body)' };
  if (locale === 'mr' || locale === 'mai') return { fontFamily: 'var(--font-devanagari-body)' };
  if (locale === 'gu') return { fontFamily: 'var(--font-gujarati-body)' };
  return undefined;
}

/**
 * Returns the appropriate heading font style for a given locale.
 * - Hindi/Sanskrit → Devanagari heading
 * - Tamil → Noto Sans Tamil heading
 * - Telugu → Noto Sans Telugu heading
 * - Bengali → Noto Sans Bengali heading
 * - Kannada → Noto Sans Kannada heading
 * - English → Cormorant Garamond heading
 */
export function getHeadingFont(locale: string): CSSProperties {
  if (locale === 'hi' || locale === 'sa') return { fontFamily: 'var(--font-devanagari-heading)' };
  if (locale === 'ta') return { fontFamily: 'var(--font-tamil-heading)' };
  if (locale === 'te') return { fontFamily: 'var(--font-telugu-heading)' };
  if (locale === 'bn') return { fontFamily: 'var(--font-bengali-heading)' };
  if (locale === 'kn') return { fontFamily: 'var(--font-kannada-heading)' };
  if (locale === 'mr' || locale === 'mai') return { fontFamily: 'var(--font-devanagari-heading)' };
  if (locale === 'gu') return { fontFamily: 'var(--font-gujarati-heading)' };
  return { fontFamily: 'var(--font-heading)' };
}

/** True for locales that use a non-Latin script (Devanagari, Tamil, Telugu, Bengali, Kannada, Gujarati, Marathi, Maithili). */
export function isIndicLocale(locale: string): boolean {
  return locale === 'hi' || locale === 'sa' || locale === 'ta' || locale === 'te' || locale === 'bn' || locale === 'kn' || locale === 'gu' || locale === 'mr' || locale === 'mai';
}

/** True for Devanagari-script locales: Hindi, Sanskrit, Marathi, Maithili. */
export function isDevanagariLocale(locale: string): boolean {
  return locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';
}

/**
 * Maps a UI locale to the key used for accessing Trilingual constant data.
 * Hindi uses 'hi'; everything else falls back to 'en'.
 */
export function dataLocale(locale: string): 'en' | 'hi' {
  if (locale === 'hi') return 'hi';
  return 'en';
}

/**
 * Pick a string by script family — Devanagari locales (hi/sa/mr/mai) get
 * the `hi` text, everything else gets `en`. Bookend replacement for the
 * inline `isHi ? 'X' : 'Y'` pattern that previously hard-coded the
 * locale list and missed mr/mai/sa cases.
 *
 * For finer-grained per-script labels use `pickByLocale` below.
 * Audit 2026-05-25 §B6.
 */
export function pickByScript(en: string, hi: string, locale: string): string {
  return isDevanagariLocale(locale) ? hi : en;
}

/**
 * Multi-script label picker — covers each of the active non-Latin scripts
 * with an explicit fallback chain. Devanagari locales fall through `hi`;
 * everything else returns the locale's own script when provided, else `en`.
 *
 * Example:
 *   pickByLocale({ en: 'Tools', hi: 'उपकरण', ta: 'கருவிகள்', bn: 'সরঞ্জাম' }, locale)
 *
 * Returns the most specific script available; never `undefined`. Audit §B6.
 */
export function pickByLocale(
  variants: { en: string; hi?: string; ta?: string; te?: string; bn?: string; gu?: string; kn?: string; mai?: string; mr?: string },
  locale: string,
): string {
  const direct = (variants as Record<string, string | undefined>)[locale];
  if (direct) return direct;
  // Devanagari fallback when the active locale uses Devanagari but lacks
  // its own variant (e.g., a `mai` page that only has en + hi).
  if (isDevanagariLocale(locale) && variants.hi) return variants.hi;
  return variants.en;
}
