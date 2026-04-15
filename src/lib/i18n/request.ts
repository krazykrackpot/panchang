import { getRequestConfig } from 'next-intl/server';
import { Locale, locales } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
    // Suppress missing-key errors in production — the fallback below handles display
    onError(error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[i18n]', error.message);
      }
    },
    // Show just the leaf key instead of a raw dot-path (e.g. "ruledBy" not "pages.panchangInline.ruledBy")
    getMessageFallback({ key }) {
      return key;
    },
  };
});
