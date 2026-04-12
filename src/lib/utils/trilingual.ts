/**
 * Safe trilingual text accessor.
 * Falls back to 'en' when the requested locale key doesn't exist on the object.
 * Essential for Tamil ('ta') locale where most Trilingual objects only have {en, hi, sa}.
 */
export function tl(obj: any, locale: string): string {
  if (!obj) return '';
  return obj[locale] || obj.en || '';
}
