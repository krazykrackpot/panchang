export const locales = ['en', 'hi', 'sa'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  sa: 'संस्कृतम्',
};

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  hi: 'हिं',
  sa: 'सं',
};
