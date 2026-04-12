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

/** True for locales that use a non-Latin script (Devanagari, Tamil, Telugu, Bengali, Kannada). */
export function isIndicLocale(locale: string): boolean {
  return locale === 'hi' || locale === 'sa' || locale === 'ta' || locale === 'te' || locale === 'bn' || locale === 'kn' || locale === 'mr' || locale === 'gu' || locale === 'mai';
}

/** True only for Devanagari-script locales (Hindi, Sanskrit). */
export function isDevanagariLocale(locale: string): boolean {
  return locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';
}

/**
 * Maps a UI locale to the key used for accessing Trilingual constant data.
 * - Sanskrit has no separate constant data → falls back to Hindi
 * - Hindi uses itself
 * - Tamil/Telugu/Bengali/Kannada have no constant data yet → falls back to English
 * - English uses itself
 *
 * This replaces the pattern: `const lk = locale === 'sa' ? 'hi' : locale;`
 * which does NOT handle Tamil/Telugu/Bengali/Kannada. Use this function instead.
 */
export function dataLocale(locale: string): 'en' | 'hi' {
  if (locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai') return 'hi';
  return 'en';
}
