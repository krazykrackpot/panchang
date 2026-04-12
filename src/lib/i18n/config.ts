// All supported locales (routing + generation)
export const locales = ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'mai'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Locales visible in the language picker — hide unvalidated ones in production
const isDev = process.env.NODE_ENV === 'development';
export const visibleLocales: Locale[] = isDev
  ? ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'mai']
  : ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'mai'];

export const localeNames: Record<Locale, string> = {
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

export const localeLabels: Record<Locale, string> = {
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
