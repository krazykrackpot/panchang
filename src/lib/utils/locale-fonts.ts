import type { CSSProperties } from 'react';

/**
 * Returns the appropriate body font style for a given locale.
 * - Hindi/Sanskrit → Devanagari
 * - Tamil → Noto Sans Tamil
 * - English → undefined (uses default)
 */
export function getBodyFont(locale: string): CSSProperties | undefined {
  if (locale === 'hi' || locale === 'sa') return { fontFamily: 'var(--font-devanagari-body)' };
  if (locale === 'ta') return { fontFamily: 'var(--font-tamil-body)' };
  return undefined;
}

/**
 * Returns the appropriate heading font style for a given locale.
 * - Hindi/Sanskrit → Devanagari heading
 * - Tamil → Noto Sans Tamil heading
 * - English → Cormorant Garamond heading
 */
export function getHeadingFont(locale: string): CSSProperties {
  if (locale === 'hi' || locale === 'sa') return { fontFamily: 'var(--font-devanagari-heading)' };
  if (locale === 'ta') return { fontFamily: 'var(--font-tamil-heading)' };
  return { fontFamily: 'var(--font-heading)' };
}

/** True for locales that use a non-Latin script (Devanagari or Tamil). */
export function isIndicLocale(locale: string): boolean {
  return locale === 'hi' || locale === 'sa' || locale === 'ta';
}

/** True only for Devanagari-script locales (Hindi, Sanskrit). */
export function isDevanagariLocale(locale: string): boolean {
  return locale === 'hi' || locale === 'sa';
}

/**
 * Maps a UI locale to the key used for accessing Trilingual constant data.
 * - Sanskrit has no separate constant data → falls back to Hindi
 * - Hindi uses itself
 * - Tamil has no constant data yet → falls back to English
 * - English uses itself
 *
 * This replaces the pattern: `const lk = locale === 'sa' ? 'hi' : locale;`
 * which does NOT handle Tamil. Use this function instead.
 */
export function dataLocale(locale: string): 'en' | 'hi' {
  if (locale === 'hi' || locale === 'sa') return 'hi';
  return 'en';
}
