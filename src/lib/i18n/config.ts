// All supported locales (routing + generation)
// sa (Sanskrit) and mr (Marathi) retired — insufficient translations.
// mai (Maithili) re-enabled Apr 2026 — GSC shows strong Maithili traffic.
export const locales = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Retired locales — middleware redirects these to 'en' equivalent
export const retiredLocales = ['sa', 'mr'] as const;

// Locales visible in the language picker and generated at build time.
export const visibleLocales: Locale[] = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai'];

export const localeNames: { en: string; [key: string]: string | undefined } = {
  en: 'English',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
  kn: 'ಕನ್ನಡ',
  gu: 'ગુજરાતી',
  mai: 'मैथिली',
};

export const localeLabels: { en: string; [key: string]: string | undefined } = {
  en: 'EN',
  hi: 'हिं',
  ta: 'த',
  te: 'తె',
  bn: 'বা',
  kn: 'ಕ',
  gu: 'ગુ',
  mai: 'मै',
};
