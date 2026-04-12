/**
 * Learn page translation utilities.
 *
 * Each learn page has a JSON file in src/messages/learn/ containing all
 * translatable strings keyed by locale. This module provides typed helpers
 * to consume those files.
 */

import type { Locale } from '@/lib/i18n/config';

/** A single translatable string with all 10 locale variants. */
export type LocaleText = Partial<Record<Locale, string>> & { en: string };

/**
 * Resolve a LocaleText to the best string for `locale`.
 * Falls back to English if the requested locale isn't present.
 */
export function lt(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || obj.en || '';
}

/**
 * Create a scoped translator from a translations object.
 * Usage:
 *   import L from '@/messages/learn/bhavas.json';
 *   const t = learnT(L, locale);
 *   t('title') // => resolved string
 */
export function learnT<T extends Record<string, LocaleText>>(
  translations: T,
  locale: string
): (key: keyof T) => string {
  return (key) => lt(translations[key], locale);
}
