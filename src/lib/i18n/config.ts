// All supported locales (routing + generation)
export const locales = ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'mai'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Locales visible in the language picker — hide unvalidated ones in production
const isDev = process.env.NODE_ENV === 'development';
// Locales shown in the language picker and generated at build time.
// Other locales still route fine (on-demand SSR) but aren't pre-built.
export const visibleLocales: Locale[] = isDev
  ? ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'mai']
  : ['en', 'hi', 'ta', 'te', 'bn'];

export const localeNames: { en: string; [key: string]: string | undefined } = {
  en: 'English',
  hi: 'हिन्दी',
  sa: 'संस्कृतम्',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
  kn: 'ಕನ್ನಡ',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  mai: 'मैथिली',
};

export const localeLabels: { en: string; [key: string]: string | undefined } = {
  en: 'EN',
  hi: 'हिं',
  sa: 'सं',
  ta: 'த',
  te: 'తె',
  bn: 'বা',
  kn: 'ಕ',
  mr: 'म',
  gu: 'ગુ',
  mai: 'मै',
};
