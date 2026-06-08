// src/app/[locale]/horoscope/[rashi]/monthly/page.tsx
// NO 'use client'  –  this is a Server Component for SEO indexability

import { notFound } from 'next/navigation';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { MonthlyClient } from './MonthlyClient';
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

/**
 * Month-anchored label. Uses UTC `now` so the same calendar month
 * resolves identically across server regions. Stable through the month;
 * the ISR cache (24h revalidate) can only straddle the month boundary
 * for a brief window before the cache refreshes — acceptable residual.
 */
function getMonthLabel(): string {
  const now = new Date();
  // Construct a UTC-midnight first-of-month and format. timeZone: 'UTC'
  // pins the formatter's reading so the result depends only on `now`'s
  // UTC components, not the server's tz.
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function getMonthLabelHi(): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  return d.toLocaleDateString('hi-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export default async function MonthlyRashiPage({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  const { locale, rashi: rashiSlug } = await params;
  const rashi = getRashiBySlug(rashiSlug);
  if (!rashi) return notFound();

  const vedicName = rashi.name.hi || rashi.name.en;
  const westernName = rashi.name.en;

  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';
  const monthLabel = isHi ? getMonthLabelHi() : getMonthLabel();

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      {/* SSR: H1 with rashi name and month  –  Google indexes this */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {isHi
            ? `${vedicName} मासिक राशिफल  –  ${monthLabel}`
            : `${vedicName} (${westernName}) Monthly Horoscope  –  ${monthLabel}`}
        </h1>

        {/* SSR: Brief description paragraph for indexing */}
        <p className="mt-4 text-center text-text-secondary text-sm max-w-2xl mx-auto">
          {isHi
            ? `${vedicName} राशि का मासिक राशिफल ${monthLabel} के लिए। कैलेंडर हीटमैप, करियर, प्रेम, स्वास्थ्य एवं वित्त भविष्यवाणी। वैदिक ग्रह गोचर पर आधारित।`
            : `${westernName} (${vedicName}) monthly horoscope for ${monthLabel}. Calendar heatmap, career, love, health and finance predictions based on actual Vedic planetary transits.`}
        </p>
      </div>

      {/* SSR: Festivals in the next 30 days. Closes audit item #7 — the
          monthly page's only SSR content above the client island was the
          H1 + 30w description, making it textbook-thin. The festival list
          adds genuine time-window content that varies meaningfully across
          months. */}
      {(() => {
        const today = new Date();
        const dateStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;
        const city = getSeoCityForLocale(locale);
        const upcoming = getUpcomingFestivals(dateStr, city.lat, city.lng, city.timezone, {
          count: 15,
          includeVrat: true,
        }).filter(u => u.daysAway <= 31);
        if (upcoming.length === 0) return null;
        return (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-5 sm:p-6">
              <h2 className="text-gold-light text-base sm:text-lg font-semibold mb-3" >
                {isHi ? 'इस माह के पर्व एवं व्रत' : 'Festivals & Vrats This Month'}
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

      {/* Client island: interactive monthly widget with full functionality */}
      <MonthlyClient rashi={rashi} locale={locale} />

      {/* SSR: Static editorial content  –  always indexed */}
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
