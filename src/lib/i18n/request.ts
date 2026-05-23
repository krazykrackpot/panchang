import { getRequestConfig } from 'next-intl/server';
import { Locale, locales } from './config';
import enMessages from '@/messages/en.json';

// English fallback bundle, loaded once. When a key is missing in the active
// locale, the displayed text comes from EN here — never the raw dot-path or
// the bare leaf identifier. (Memory rule: "Locale fallback is non-negotiable
// — render English if regional translation is missing, never undefined or
// key path." Previous behaviour returned the leaf identifier, which surfaced
// as "allTools" / "ruledBy" in non-EN navbars.)
const EN_BUNDLE = enMessages as Record<string, unknown>;

function lookupEnByDottedKey(key: string): string | null {
  const segments = key.split('.');
  let cursor: unknown = EN_BUNDLE;
  for (const seg of segments) {
    if (cursor && typeof cursor === 'object' && seg in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[seg];
    } else {
      return null;
    }
  }
  return typeof cursor === 'string' ? cursor : null;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
    onError(error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[i18n]', error.message);
      }
    },
    getMessageFallback({ key }) {
      const enValue = lookupEnByDottedKey(key);
      if (enValue !== null) return enValue;
      // Last resort: leaf segment beats the dotted path, but EN should always
      // have the key — if this branch fires, file a parity bug.
      const leaf = key.split('.').pop();
      return leaf ?? key;
    },
  };
});
