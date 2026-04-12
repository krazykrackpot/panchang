'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { localeLabels, type Locale } from '@/lib/i18n/config';
import { getBodyFont } from '@/lib/utils/locale-fonts';

const visibleLocales: Locale[] = ['en', 'hi', 'ta'];

export default function LocaleSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (locale: Locale) => {
    router.replace(pathname, { locale });
  };

  return (
    <div className="flex items-center gap-1 bg-bg-secondary/50 rounded-lg p-1">
      {visibleLocales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-2.5 py-1 text-sm rounded-md transition-all duration-200 ${
            currentLocale === locale
              ? 'bg-gold-primary/20 text-gold-light font-semibold'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50'
          }`}
          style={getBodyFont(locale)}
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
}
