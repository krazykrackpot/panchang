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

/** True for locales that use a non-Latin script (Devanagari, Tamil, Telugu, Bengali, Kannada, Gujarati). */
export function isIndicLocale(locale: string): boolean {
  return locale === 'hi' || locale === 'ta' || locale === 'te' || locale === 'bn' || locale === 'kn' || locale === 'gu';
}

/** True only for Devanagari-script locales. Only Hindi remains after sa/mr/mai retirement. */
export function isDevanagariLocale(locale: string): boolean {
  return locale === 'hi';
}

/**
 * Maps a UI locale to the key used for accessing Trilingual constant data.
 * Hindi uses 'hi'; everything else falls back to 'en'.
 */
export function dataLocale(locale: string): 'en' | 'hi' {
  if (locale === 'hi') return 'hi';
  return 'en';
}
