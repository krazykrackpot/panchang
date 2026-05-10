// src/app/[locale]/horoscope/[rashi]/page.tsx
// NO 'use client'  –  this is a Server Component for SEO indexability

import { notFound } from 'next/navigation';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { HoroscopeClient } from './HoroscopeClient';
import { RashiArticle } from './RashiArticle';
import type { LocaleText } from '@/types/panchang';

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || obj.en || '';
}

export default async function RashiPage({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  const { locale, rashi: rashiSlug } = await params;
  const rashi = getRashiBySlug(rashiSlug);
  if (!rashi) return notFound();

  // Generate today's horoscope server-side  –  this is the SSR content Google indexes
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const horoscope = generateDailyHoroscope({ moonSign: rashi.id, date: today });

  const vedicName = rashi.name.hi || rashi.name.en; // Always use Hindi/Sanskrit name as the Vedic name
  const westernName = rashi.name.en;
  const localeName = tl(rashi.name, locale); // Locale-specific name for body text

  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      {/* SSR: H1 with rashi name and date  –  Google indexes this */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {isHi
            ? `${vedicName} राशिफल  –  आज ${today}`
            : `${vedicName} (${westernName}) Horoscope  –  ${today}`}
        </h1>

        {/* SSR: Key horoscope data rendered as visible text for indexing */}
        <div className="mt-4 text-center text-text-secondary text-sm">
          <p>
            {isHi
              ? `आज का समग्र स्कोर: ${horoscope.overallScore}/10`
              : `Today's overall score: ${horoscope.overallScore}/10`}
          </p>
          <p className="mt-2">{tl(horoscope.insight, locale)}</p>
        </div>

        {/* SSR: Area scores as indexable text */}
        <div className="mt-4 text-xs text-text-secondary/70 text-center space-x-3">
          <span>{isHi ? 'करियर' : 'Career'}: {horoscope.areas.career.score}/10</span>
          <span>{isHi ? 'प्रेम' : 'Love'}: {horoscope.areas.love.score}/10</span>
          <span>{isHi ? 'स्वास्थ्य' : 'Health'}: {horoscope.areas.health.score}/10</span>
          <span>{isHi ? 'वित्त' : 'Finance'}: {horoscope.areas.finance.score}/10</span>
          <span>{isHi ? 'आध्यात्म' : 'Spirituality'}: {horoscope.areas.spirituality.score}/10</span>
        </div>
      </div>

      {/* Client island: interactive widget with full functionality */}
      <HoroscopeClient rashi={rashi} locale={locale} initialHoroscope={horoscope} />

      {/* SSR: Static editorial content  –  always indexed */}
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
