// src/app/[locale]/horoscope/[rashi]/monthly/page.tsx
// NO 'use client' — this is a Server Component for SEO indexability

import { notFound } from 'next/navigation';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { MonthlyClient } from './MonthlyClient';
import { RashiArticle } from '../RashiArticle';
import type { LocaleText } from '@/types/panchang';

export const revalidate = 3600;

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || obj.en || '';
}

function getMonthLabel(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getMonthLabelHi(): string {
  const now = new Date();
  return now.toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });
}

export default async function MonthlyRashiPage({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  const { locale, rashi: rashiSlug } = await params;
  const rashi = getRashiBySlug(rashiSlug);
  if (!rashi) return notFound();

  const vedicName = tl(rashi.name, locale);
  const westernName = rashi.name.en;

  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';
  const monthLabel = isHi ? getMonthLabelHi() : getMonthLabel();

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      {/* SSR: H1 with rashi name and month — Google indexes this */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {isHi
            ? `${vedicName} मासिक राशिफल — ${monthLabel}`
            : `${vedicName} (${westernName}) Monthly Horoscope — ${monthLabel}`}
        </h1>

        {/* SSR: Brief description paragraph for indexing */}
        <p className="mt-4 text-center text-text-secondary text-sm max-w-2xl mx-auto">
          {isHi
            ? `${vedicName} राशि का मासिक राशिफल ${monthLabel} के लिए। कैलेंडर हीटमैप, करियर, प्रेम, स्वास्थ्य एवं वित्त भविष्यवाणी। वैदिक ग्रह गोचर पर आधारित।`
            : `${westernName} (${vedicName}) monthly horoscope for ${monthLabel}. Calendar heatmap, career, love, health and finance predictions based on actual Vedic planetary transits.`}
        </p>
      </div>

      {/* Client island: interactive monthly widget with full functionality */}
      <MonthlyClient rashi={rashi} locale={locale} />

      {/* SSR: Static editorial content — always indexed */}
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
