export const locales = ['en', 'hi', 'sa', 'ta'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  sa: 'संस्कृतम्',
  ta: 'தமிழ்',
};

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  hi: 'हिं',
  sa: 'सं',
  ta: 'த',
};
