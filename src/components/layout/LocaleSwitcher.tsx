'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { localeLabels, visibleLocales, type Locale } from '@/lib/i18n/config';
import { getBodyFont } from '@/lib/utils/locale-fonts';

export default function LocaleSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const switchLocale = (locale: Locale) => {
    router.replace(pathname, { locale });
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger — shows current locale label */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-semibold rounded-lg border border-gold-primary/20 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/40 transition-all"
        aria-label="Change language"
        style={getBodyFont(currentLocale)}
      >
        {localeLabels[currentLocale]}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-bg-secondary border border-gold-primary/20 rounded-xl shadow-xl shadow-black/40 py-1 min-w-[120px] overflow-hidden">
          {visibleLocales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                currentLocale === locale
                  ? 'bg-gold-primary/15 text-gold-light font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
              style={getBodyFont(locale)}
            >
              {localeLabels[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
