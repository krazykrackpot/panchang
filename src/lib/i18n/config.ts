// All supported locales (routing + generation)
// sa (Sanskrit) retired May 2026 — proxy 301s /sa/* → /en/*.
// mr (Marathi) restored May 2026 — mr.json has substantial translation coverage
// and the previous "insufficient translations" reasoning no longer holds.
// mai (Maithili) re-enabled Apr 2026 — GSC shows strong Maithili traffic.
export const locales = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Retired locales — middleware redirects these to 'en' equivalent.
export const retiredLocales = ['sa'] as const;

// Locales visible in the language picker and generated at build time.
// Derived from `locales` (single source of truth) so adding/removing an
// active locale propagates here automatically.
export const visibleLocales: Locale[] = [...locales];

export const localeNames: { en: string; [key: string]: string | undefined } = {
  en: 'English',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
  kn: 'ಕನ್ನಡ',
  gu: 'ગુજરાતી',
  mai: 'मैथिली',
  mr: 'मराठी',
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
  mr: 'मरा',
};
