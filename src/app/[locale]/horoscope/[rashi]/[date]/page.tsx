// src/app/[locale]/horoscope/[rashi]/[date]/page.tsx
// NO 'use client' — Server Component for date-specific long-tail SEO

import { notFound } from 'next/navigation';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { HoroscopeClient } from '../HoroscopeClient';
import { RashiArticle } from '../RashiArticle';
import type { LocaleText } from '@/types/panchang';

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || obj.en || '';
}

export default async function DateHoroscopePage({ params }: { params: Promise<{ locale: string; rashi: string; date: string }> }) {
  const { locale, rashi: slug, date } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) return notFound();

  // Validate date format: must be YYYY-MM-DD — anything else (e.g. "weekly", "monthly") is not a date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return notFound();

  // Validate the date is a real calendar date (not 2026-13-40)
  const parsed = new Date(date + 'T12:00:00Z');
  if (isNaN(parsed.getTime())) return notFound();

  const horoscope = generateDailyHoroscope({ moonSign: rashi.id, date });
  const vedicName = rashi.name.hi || rashi.name.en;
  const westernName = rashi.name.en;

  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  // Format: "Thursday, May 8, 2026"
  const formatted = parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      {/* SSR: H1 with rashi name and formatted date — Google indexes this */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {isHi
            ? `${vedicName} राशिफल — ${formatted}`
            : `${vedicName} (${westernName}) Horoscope — ${formatted}`}
        </h1>

        {/* SSR: Key horoscope data rendered as visible text for indexing */}
        <div className="mt-4 text-center text-text-secondary text-sm">
          <p>
            {isHi
              ? `समग्र स्कोर: ${horoscope.overallScore}/10`
              : `Overall score: ${horoscope.overallScore}/10`}
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
      <HoroscopeClient rashi={rashi} locale={locale} initialHoroscope={horoscope} initialDate={date} />

      {/* SSR: Static editorial content — always indexed */}
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
