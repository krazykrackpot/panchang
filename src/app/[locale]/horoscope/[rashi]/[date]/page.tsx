// src/app/[locale]/horoscope/[rashi]/[date]/page.tsx
// NO 'use client'  –  Server Component for date-specific long-tail SEO

import { notFound } from 'next/navigation';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { getHoroscopePageModel } from '@/lib/precompute/horoscope-page-model';
import { HoroscopeClient } from '../HoroscopeClient';
import { RashiArticle } from '../RashiArticle';
import type { LocaleText } from '@/types/panchang';
import { formatSeoDate, isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { pickHoroscopeLabel as HL, formatHoroscopeLabel } from '@/lib/content/horoscope-labels';
import { isStrictYmd } from '@/lib/seo/date-validation';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getSeoCityForLocale } from '@/lib/constants/cities';
import TodaySignificanceSection from '@/components/date-content/TodaySignificanceSection';

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || obj.en || '';
}

export default async function DateHoroscopePage({ params }: { params: Promise<{ locale: string; rashi: string; date: string }> }) {
  const { locale, rashi: slug, date } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) return notFound();

  // Date format + strict round-trip in one call. Rejects 'weekly' /
  // 'monthly' (sibling routes) and rollover dates like 2026-02-30.
  // The proxy 404s rollover URLs before they reach this handler — this
  // is defense-in-depth so direct internal navigations still 404.
  if (!isStrictYmd(date)) return notFound();
  const [y, m, d] = date.split('-').map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));

  // Read from precompute Blob when PRECOMPUTE_FETCH_ENABLED, else fall
  // through to live compute. Both paths produce the same DailyHoroscope-
  // shaped model. The page-model loader (getHoroscopePageModel) wraps
  // both branches and returns a byte-identical result.
  const horoscope = await getHoroscopePageModel({ date, rashiSlug: slug, moonSign: rashi.id });
  const vedicName = rashi.name.hi || rashi.name.en;
  const westernName = rashi.name.en;

  const isHi = isDevanagariLocale(locale);

  // Locale-aware date (Marathi uses Marathi month spellings via ICU,
  // Hindi/Maithili/Sanskrit use the tuned MONTHS_HI array). Previously
  // `en-US` was hardcoded → mixed-language H1s. Gemini PR #329 MEDIUM.
  const formatted = formatSeoDate(y, m, d, locale);
  // Weekday rendered separately so it can be localised too. Marathi
  // weekday names differ from Hindi (e.g. सोमवार is the same, but
  // गुरुवार is Hindi vs गुरुवार in Marathi — happen to match here,
  // but other days do diverge). ICU gives the correct Marathi name.
  const weekday = parsed.toLocaleDateString(
    isHi ? `${locale === 'mr' ? 'mr-IN' : 'hi-IN'}-u-nu-latn` : 'en-US',
    { weekday: 'long', timeZone: 'UTC' },
  );

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      {/* SSR: H1 with rashi name and formatted date  –  Google indexes this */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {/* Marathi spells it राशीफल (with ी) vs Hindi राशिफल (with ि).
              The metadata title above already does this; the H1 needs to
              match so Google indexes consistent text. */}
          {formatHoroscopeLabel('dailyDateH1Template', locale, {
            NAME: vedicName, WESTERN_NAME: westernName, WEEKDAY: weekday, DATE: formatted,
          })}
        </h1>

        {/* SSR: Key horoscope data rendered as visible text for indexing */}
        <div className="mt-4 text-center text-text-secondary text-sm">
          <p>
            {formatHoroscopeLabel('overallScoreTemplate', locale, { SCORE: String(horoscope.overallScore) })}
          </p>
          <p className="mt-2">{tl(horoscope.insight, locale)}</p>
        </div>

        {/* SSR: Area scores as indexable text */}
        <div className="mt-4 text-xs text-text-secondary/70 text-center space-x-3">
          <span>{HL('areaCareer', locale)}: {horoscope.areas.career.score}/10</span>
          <span>{HL('areaLove', locale)}: {horoscope.areas.love.score}/10</span>
          <span>{HL('areaHealth', locale)}: {horoscope.areas.health.score}/10</span>
          <span>{HL('areaFinance', locale)}: {horoscope.areas.finance.score}/10</span>
          <span>{HL('areaSpirituality', locale)}: {horoscope.areas.spirituality.score}/10</span>
        </div>
      </div>

      {/* Today's Significance — tithi / weekday / festival differentiator
          inherited from /choghadiya/[date], /panchang/date/[date],
          /gauri-panchang/[date]. Daily horoscope engine output Jaccards
          ~40% between adjacent dates but the rendered page added very
          little body off-template — this section brings the same 30-way
          (tithi) × 7-way (weekday) × festival-week variance to the
          horoscope dates. Closes audit item #4 in docs/specs/
          2026-06-08-seo-audit-followups.md. Wrapped in IIFE so the
          city compute + panchang compute stay self-contained. */}
      {(() => {
        let tithiNumber = 0;
        const city = getSeoCityForLocale(locale);
        try {
          const tzOffset = getUTCOffsetForDate(y, m, d, city.timezone);
          const panchang = computePanchang({
            year: y, month: m, day: d,
            lat: city.lat, lng: city.lng,
            tzOffset, timezone: city.timezone,
            locationName: city.name.en,
          });
          tithiNumber = panchang.tithi.number;
        } catch (err) {
          console.error('[horoscope/rashi/date] tithi compute failed:', err);
        }
        if (tithiNumber <= 0) return null;
        return (
          <div className="max-w-4xl mx-auto px-4">
            <TodaySignificanceSection
              tithiNumber={tithiNumber}
              weekday={parsed.getUTCDay()}
              dateStr={date}
              lat={city.lat}
              lng={city.lng}
              timezone={city.timezone}
              locale={locale}
            />
          </div>
        );
      })()}

      {/* Client island: interactive widget with full functionality */}
      <HoroscopeClient rashi={rashi} locale={locale} initialHoroscope={horoscope} initialDate={date} />

      {/* SSR: Static editorial content  –  always indexed */}
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
