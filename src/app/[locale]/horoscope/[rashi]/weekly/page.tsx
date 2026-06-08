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
import { pickHoroscopeLabel as HL, formatHoroscopeLabel } from '@/lib/content/horoscope-labels';
import Link from 'next/link';

export const revalidate = 86400;

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || obj.en || '';
}

/**
 * ISO-week-aligned range. Anchors to the Monday-of-current-week so the
 * SSR HTML is stable across the entire week — eliminating the day-by-day
 * drift the previous `new Date() + i` implementation produced and the
 * hydration-mismatch risk it carried. The page's ISR cache (24h revalidate)
 * can still straddle the Sunday→Monday boundary in the brief window
 * before the cache refreshes; that's an acceptable residual.
 */
function getWeekRange(): { startLabel: string; endLabel: string; fullLabel: string } {
  const now = new Date();
  // UTC midnight today, then back up to Monday. getUTCDay(): 0=Sun..6=Sat.
  // Monday-aligned start: subtract (day === 0 ? 6 : day - 1) days.
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayOfWeek = today.getUTCDay();
  const offsetToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() - offsetToMonday);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  return {
    startLabel: fmt(monday),
    endLabel: fmt(sunday),
    fullLabel: `${fmt(monday)} - ${fmt(sunday)}, ${monday.getUTCFullYear()}`,
  };
}

export default async function WeeklyRashiPage({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  const { locale, rashi: rashiSlug } = await params;
  const rashi = getRashiBySlug(rashiSlug);
  if (!rashi) return notFound();

  const vedicName = rashi.name.hi || rashi.name.en;
  const westernName = rashi.name.en;
  const week = getWeekRange();

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      {/* SSR: H1 with rashi name and week range  –  Google indexes this */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* H1 + description use the ISO-week-aligned range above so SSR
            HTML stays stable through the week. suppressHydrationWarning
            removed (Lesson ZD cleanup — was masking the old day-drifting
            getWeekRange). Residual risk: brief Sunday→Monday cache
            straddle before the ISR refresh fires.

            Per-locale templates ship via horoscope-labels — H1 and desc
            both render in the user's native script for all 9 locales. */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {formatHoroscopeLabel('weeklyH1Template', locale, {
            NAME: vedicName, WESTERN_NAME: westernName, RANGE: week.fullLabel,
          })}
        </h1>

        {/* SSR: Brief description paragraph for indexing */}
        <p className="mt-4 text-center text-text-secondary text-sm max-w-2xl mx-auto">
          {formatHoroscopeLabel('weeklyDescTemplate', locale, {
            NAME: vedicName, WESTERN_NAME: westernName, RANGE: week.fullLabel,
          })}
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
              <h2 className="text-gold-light text-base sm:text-lg font-semibold mb-3">
                {HL('festivalsThisWeek', locale)}
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
