import { setRequestLocale } from 'next-intl/server';
import { getCityBySlugExtended, getNearbyCities } from '@/lib/constants/cities-extended';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import {
  getMuhurtaMonthPageModel,
  asScanWindows,
} from '@/lib/precompute/muhurta-month-page-model';
import { tl } from '@/lib/utils/trilingual';
import { notFound } from 'next/navigation';
import { ACTIVITY_SLUGS, MONTH_MAP, MONTH_NAMES } from './shared';
import Link from 'next/link';

export const revalidate = 86400; // 24h ISR
export const dynamicParams = true;

export async function generateStaticParams() {
  // ISR-only. The previous seed (10 activities × 2 years × 3 months × 20
  // cities = 1,200 prebuilds per locale × 8 locales = 9,600 pages) was
  // both a build-budget hog AND advertised ~14K thin templated URLs to
  // Google via the sitemap, splattering crawl budget. Sitemap also no
  // longer emits these combos (see src/app/sitemap.ts).
  //
  // `dynamicParams = true` above means every combo still renders on
  // demand and caches via ISR — first hit slow, subsequent hits hit
  // the edge cache, revalidated every 24h.
  return [];
}

interface PageProps {
  params: Promise<{
    locale: string;
    type: string;
    year: string;
    month: string;
    city: string;
  }>;
}

export default async function MuhurtaActivityPage({ params }: PageProps) {
  const { locale, type: activitySlug, year: yearStr, month: monthStr, city: citySlug } = await params;
  setRequestLocale(locale);

  const activityId = ACTIVITY_SLUGS[activitySlug];
  const monthNum = MONTH_MAP[monthStr.toLowerCase()];
  const year = parseInt(yearStr, 10);
  const cityData = getCityBySlugExtended(citySlug);

  if (!activityId || !monthNum || !cityData || isNaN(year) || year < 2024 || year > 2030) {
    notFound();
  }

  const activity = getExtendedActivity(activityId);

  // Read precomputed scan windows (Blob → live-compute fallback). The
  // fallback delegates to the same scanDateRangeV2 call the page used
  // to inline, so live and Blob paths produce byte-equivalent output
  // (modulo _computedAt). Page does its own sort + top-10 slice below.
  const muhurtaModel = await getMuhurtaMonthPageModel({
    activitySlug,
    activityId,
    year,
    month: monthNum,
    city: cityData,
  });
  const windows = asScanWindows(muhurtaModel.windows);

  // Sort by score descending, take top 10
  const topWindows = [...windows].sort((a, b) => b.score - a.score).slice(0, 10);

  const cityName = tl(cityData.name, locale);
  const activityName = tl(activity.label, locale);
  const monthName = MONTH_NAMES[monthNum - 1];

  // Compute prev/next month links
  const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1;
  const prevYear = monthNum === 1 ? year - 1 : year;
  const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? year + 1 : year;
  const prevMonthSlug = Object.keys(MONTH_MAP)[prevMonthNum - 1];
  const nextMonthSlug = Object.keys(MONTH_MAP)[nextMonthNum - 1];

  // Other activities for cross-linking (exclude current)
  const otherActivities = Object.entries(ACTIVITY_SLUGS)
    .filter(([slug]) => slug !== activitySlug)
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-[#0a0e27] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <h1 className="font-[var(--font-cinzel)] text-2xl md:text-3xl text-[#f0d48a] text-center mb-2">
          Best Muhurta for {activityName}
        </h1>
        <p className="text-center text-[#8a8478] text-sm mb-8">
          {monthName} {year} &mdash; {cityName}
        </p>

        {/* Summary */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-[#d4a853]/15 rounded-2xl p-6 mb-8">
          <p className="text-[#e6e2d8] text-sm leading-relaxed">
            {topWindows.length > 0
              ? `We analyzed ${windows.length} time windows across ${monthName} ${year} for ${activityName} in ${cityName}. The top-scoring window is ${topWindows[0].date} at ${topWindows[0].startTime} with a quality score of ${topWindows[0].score}/100.`
              : `No highly auspicious windows were found for ${activityName} in ${cityName} during ${monthName} ${year}. Consider checking adjacent months.`
            }
          </p>
        </div>

        {/* Top 10 Windows */}
        {topWindows.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-[var(--font-cinzel)] text-lg text-[#f0d48a] mb-4">
              Top {topWindows.length} Auspicious Windows
            </h2>
            {topWindows.map((w, i) => {
              const dateObj = new Date(w.date + 'T12:00:00Z');
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
              const dateDisplay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
              const scoreColor = w.score >= 75 ? 'text-green-400' : w.score >= 50 ? 'text-amber-400' : 'text-red-400';

              return (
                <div key={`${w.date}-${w.startTime}`} className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-[#d4a853]/10 rounded-xl p-4 flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-full bg-[#d4a853]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#d4a853] text-sm font-bold">{i + 1}</span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[#e6e2d8] text-sm font-semibold">
                      {dayName}, {dateDisplay}
                    </div>
                    <div className="text-[#8a8478] text-xs">
                      {w.startTime} &ndash; {w.endTime}
                    </div>
                  </div>

                  {/* Panchang context */}
                  <div className="hidden sm:block text-xs text-[#8a8478] text-right">
                    {w.panchangContext?.tithiName} &middot; {w.panchangContext?.nakshatraName}
                  </div>

                  {/* Score */}
                  <div className={`text-lg font-bold ${scoreColor} shrink-0`}>
                    {w.score}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Scoring methodology */}
        <div className="mt-8 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-[#d4a853]/10 rounded-xl p-5">
          <h3 className="text-[#f0d48a] text-sm font-semibold mb-2">How We Score</h3>
          <p className="text-[#8a8478] text-xs leading-relaxed">
            Each 2-hour window is scored 0&ndash;100 based on Panchang quality (tithi, nakshatra, yoga, karana suitability for {activityName.toLowerCase()}),
            planetary transits, hora/choghadiya alignment, and absence of inauspicious periods (Rahu Kaal, Yamaganda, Gulika Kaal, Vishti Karana).
            Higher scores indicate stronger cosmic alignment for this activity.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/muhurta-ai`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4a853]/15 border border-[#d4a853]/30 text-[#f0d48a] text-sm font-medium hover:bg-[#d4a853]/25 transition-all"
          >
            Personalize with your birth chart &rarr;
          </Link>
        </div>

        {/* Related links */}
        <div className="mt-12 space-y-6">
          {/* Prev / Next month */}
          <div className="flex justify-between items-center">
            {prevYear >= 2024 && (
              <Link
                href={`/${locale}/muhurta/${activitySlug}/${prevYear}/${prevMonthSlug}/${citySlug}`}
                className="text-[#d4a853] text-sm hover:text-[#f0d48a] transition-colors"
              >
                &larr; {MONTH_NAMES[prevMonthNum - 1]} {prevYear}
              </Link>
            )}
            <div />
            {nextYear <= 2030 && (
              <Link
                href={`/${locale}/muhurta/${activitySlug}/${nextYear}/${nextMonthSlug}/${citySlug}`}
                className="text-[#d4a853] text-sm hover:text-[#f0d48a] transition-colors"
              >
                {MONTH_NAMES[nextMonthNum - 1]} {nextYear} &rarr;
              </Link>
            )}
          </div>

          {/* Other activities */}
          <div>
            <h3 className="text-[#f0d48a] text-sm font-semibold mb-3">Other Activities in {cityName}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {otherActivities.map(([slug, id]) => {
                const act = getExtendedActivity(id);
                return (
                  <Link
                    key={slug}
                    href={`/${locale}/muhurta/${slug}/${yearStr}/${monthStr}/${citySlug}`}
                    className="text-xs text-[#8a8478] hover:text-[#f0d48a] bg-[#111633]/50 border border-[#d4a853]/10 rounded-lg px-3 py-2 transition-colors"
                  >
                    {tl(act.label, locale)}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Top cities for same activity */}
          <div>
            <h3 className="text-[#f0d48a] text-sm font-semibold mb-3">{activityName} in Other Cities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {getNearbyCities(citySlug, 5)
                .map(c => (
                  <Link
                    key={c.slug}
                    href={`/${locale}/muhurta/${activitySlug}/${yearStr}/${monthStr}/${c.slug}`}
                    className="text-xs text-[#8a8478] hover:text-[#f0d48a] bg-[#111633]/50 border border-[#d4a853]/10 rounded-lg px-3 py-2 transition-colors"
                  >
                    {tl(c.name, locale)}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
