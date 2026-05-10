// src/app/[locale]/horoscope/[rashi]/weekly/page.tsx
// NO 'use client'  –  this is a Server Component for SEO indexability

import { notFound } from 'next/navigation';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { WeeklyClient } from './WeeklyClient';
import { RashiArticle } from '../RashiArticle';
import type { LocaleText } from '@/types/panchang';

export const revalidate = 3600;

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || obj.en || '';
}

function getWeekRange(): { startLabel: string; endLabel: string; fullLabel: string } {
  const now = new Date();
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dates.push(d);
  }
  const first = dates[0];
  const last = dates[6];
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return {
    startLabel: fmt(first),
    endLabel: fmt(last),
    fullLabel: `${fmt(first)} - ${fmt(last)}, ${first.getFullYear()}`,
  };
}

export default async function WeeklyRashiPage({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  const { locale, rashi: rashiSlug } = await params;
  const rashi = getRashiBySlug(rashiSlug);
  if (!rashi) return notFound();

  const vedicName = rashi.name.hi || rashi.name.en;
  const westernName = rashi.name.en;
  const week = getWeekRange();

  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      {/* SSR: H1 with rashi name and week range  –  Google indexes this */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {isHi
            ? `${vedicName} साप्ताहिक राशिफल  –  ${week.fullLabel}`
            : `${vedicName} (${westernName}) Weekly Horoscope  –  ${week.fullLabel}`}
        </h1>

        {/* SSR: Brief description paragraph for indexing */}
        <p className="mt-4 text-center text-text-secondary text-sm max-w-2xl mx-auto">
          {isHi
            ? `${vedicName} राशि का साप्ताहिक राशिफल ${week.fullLabel} के लिए। वास्तविक ग्रह गोचर पर आधारित दैनिक स्कोर, करियर, प्रेम, स्वास्थ्य एवं वित्त भविष्यवाणी।`
            : `${westernName} (${vedicName}) weekly horoscope for ${week.fullLabel}. Day-by-day scores, career, love, health and finance predictions based on actual Vedic planetary transits.`}
        </p>
      </div>

      {/* Client island: interactive weekly widget with full functionality */}
      <WeeklyClient rashi={rashi} locale={locale} />

      {/* SSR: Static editorial content  –  always indexed */}
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
