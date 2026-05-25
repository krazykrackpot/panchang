import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { RASHIS } from '@/lib/constants/rashis';
import { HubClient } from './HubClient';
import type { LocaleText } from '@/types/panchang';
import { pickByScript } from '@/lib/utils/locale-fonts';

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return obj[locale] || obj.en || '';
}

export default async function HoroscopePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-[#0a0e27] text-text-primary">
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-6">
        {/* SSR: H1 with today's date  –  Google indexes this */}
        <h1 suppressHydrationWarning className="text-3xl sm:text-4xl font-bold text-gold-light text-center">
          {pickByScript(`Daily Horoscope  –  ${today}`, `दैनिक राशिफल  –  ${today}`, locale)}
        </h1>

        {/* SSR: Intro paragraph  –  indexable content explaining methodology */}
        <p className="text-text-secondary text-sm text-center mt-4 max-w-2xl mx-auto leading-relaxed">
          {pickByScript(
            'Today\'s horoscope for all 12 zodiac signs based on real Vedic planetary transits. Select your Moon sign to see your daily forecast. Each prediction is computed from actual planetary positions  –  not generic content.',
            'वास्तविक वैदिक ग्रह गोचर पर आधारित सभी 12 राशियों का आज का राशिफल। अपनी चन्द्र राशि चुनें और आज का फल देखें। प्रत्येक राशिफल वास्तविक ग्रहों की स्थिति से गणना किया जाता है  –  सामान्य भविष्यवाणी नहीं।',
            locale,
          )}
        </p>

        {/* SSR: Philosophical context  –  Siddhantic foundation */}
        <p className="text-text-secondary text-sm text-center mt-3 max-w-2xl mx-auto leading-relaxed">
          {pickByScript(
            'Your Vedic horoscope is computed from the actual sidereal positions of the nine grahas — not seasonal approximations. The daily forecast is driven by real planetary transits computed using algorithms from the Surya Siddhanta, verified against modern ephemeris data. This is Siddhantic Jyotish — mathematical astronomy — applied to daily life guidance.',
            'आपका वैदिक राशिफल नवग्रहों की वास्तविक नाक्षत्रिक स्थितियों से गणना किया जाता है — मौसमी अनुमानों से नहीं। दैनिक फल वास्तविक ग्रह गोचर द्वारा संचालित है, जिनकी गणना सूर्य सिद्धान्त के एल्गोरिदम से होती है और जो आधुनिक पंचांग डेटा से सत्यापित हैं। यह सिद्धान्तिक ज्योतिष है — गणितीय खगोल विज्ञान — जो दैनिक जीवन मार्गदर्शन पर लागू किया गया है।',
            locale,
          )}
        </p>

        {/* SSR: All 12 rashi links  –  Google follows these to every rashi page */}
        <nav
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-8"
          aria-label="Zodiac signs"
        >
          {RASHIS.map(r => (
            <Link
              key={r.id}
              href={`/${locale}/horoscope/${r.slug}`}
              className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 hover:border-gold-primary/40 transition-colors"
            >
              <span className="text-2xl" role="img" aria-label={tl(r.name, 'en')}>
                {r.symbol}
              </span>
              <span className="text-xs text-gold-light font-medium text-center">
                {tl(r.name, locale)}
              </span>
              {locale !== 'en' && (
                <span className="text-[10px] text-text-secondary">
                  {tl(r.name, 'en')}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Client island: person switcher, cosmic weather, interactive TarotCard grid, result panel */}
      <HubClient locale={locale} />
    </main>
  );
}
