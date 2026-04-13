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
