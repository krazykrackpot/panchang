// src/app/[locale]/horoscope/[rashi]/weekly/page.tsx
// NO 'use client'  –  this is a Server Component for SEO indexability

import { notFound } from 'next/navigation';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { WeeklyClient } from './WeeklyClient';
import { RashiArticle } from '../RashiArticle';
import type { LocaleText } from '@/types/panchang';
import { getUpcomingFestivals } from '@/lib/calendar/next-festival';
import { getSeoCityForLocale } from '@/lib/constants/cities';
import { tl as trilingual } from '@/lib/utils/trilingual';
import Link from 'next/link';

export const revalidate = 86400;

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
        <h1 suppressHydrationWarning className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {isHi
            ? `${vedicName} साप्ताहिक राशिफल  –  ${week.fullLabel}`
            : `${vedicName} (${westernName}) Weekly Horoscope  –  ${week.fullLabel}`}
        </h1>

        {/* SSR: Brief description paragraph for indexing */}
        <p suppressHydrationWarning className="mt-4 text-center text-text-secondary text-sm max-w-2xl mx-auto">
          {isHi
            ? `${vedicName} राशि का साप्ताहिक राशिफल ${week.fullLabel} के लिए। वास्तविक ग्रह गोचर पर आधारित दैनिक स्कोर, करियर, प्रेम, स्वास्थ्य एवं वित्त भविष्यवाणी।`
            : `${westernName} (${vedicName}) weekly horoscope for ${week.fullLabel}. Day-by-day scores, career, love, health and finance predictions based on actual Vedic planetary transits.`}
        </p>
      </div>

      {/* SSR: Festivals in the next 7 days. Closes audit item #7 — the
          weekly page's only SSR content above the client island was the
          H1 + 30w description, making it textbook-thin. The festival
          list adds genuine time-window content that varies meaningfully
          across weeks. */}
      {(() => {
        const today = new Date();
        const dateStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;
        const city = getSeoCityForLocale(locale);
        const upcoming = getUpcomingFestivals(dateStr, city.lat, city.lng, city.timezone, {
          count: 7,
          includeVrat: true,
        }).filter(u => u.daysAway <= 7);
        if (upcoming.length === 0) return null;
        return (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-5 sm:p-6">
              <h2 className="text-gold-light text-base sm:text-lg font-semibold mb-3" suppressHydrationWarning>
                {isHi ? 'इस सप्ताह के पर्व एवं व्रत' : 'Festivals & Vrats This Week'}
              </h2>
              <ul className="space-y-1.5 text-sm">
                {upcoming.map((u, i) => (
                  <li key={`${u.festival.date}-${u.festival.slug ?? i}`} className="text-text-primary/85 flex items-baseline gap-2">
                    <span className="text-gold-primary/50 text-xs font-mono shrink-0" aria-hidden>·</span>
                    <span>
                      {u.festival.slug ? (
                        <Link href={`/${locale}/festivals/${u.festival.slug}`} className="text-gold-light hover:text-gold-primary underline-offset-4 hover:underline font-medium">
                          {trilingual(u.festival.name, locale)}
                        </Link>
                      ) : (
                        <span className="text-gold-light font-medium">{trilingual(u.festival.name, locale)}</span>
                      )}
                      <span className="text-text-secondary"> — {u.festival.date}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })()}

      {/* Client island: interactive weekly widget with full functionality */}
      <WeeklyClient rashi={rashi} locale={locale} />

      {/* SSR: Static editorial content  –  always indexed */}
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
