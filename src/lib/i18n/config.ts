// All supported locales (routing + generation)
// Dropped sa (Sanskrit), mr (Marathi), mai (Maithili) — insufficient translations,
// wasted crawl budget on hreflang alternates Google couldn't index.
export const locales = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Retired locales — middleware redirects these to 'en' equivalent
export const retiredLocales = ['sa', 'mr', 'mai'] as const;

// Locales visible in the language picker and generated at build time.
export const visibleLocales: Locale[] = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn'];

export const localeNames: { en: string; [key: string]: string | undefined } = {
  en: 'English',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
  kn: 'ಕನ್ನಡ',
  gu: 'ગુજરાતી',
};

export const localeLabels: { en: string; [key: string]: string | undefined } = {
  en: 'EN',
  hi: 'हिं',
  ta: 'த',
  te: 'తె',
  bn: 'বা',
  kn: 'ಕ',
  gu: 'ગુ',
};
