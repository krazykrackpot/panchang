/**
 * /[locale]/panchang/date/[date] — date-keyed daily panchang page (SEO step 2).
 *
 * Mirrors the proven /choghadiya/[date] shape so the URL itself matches
 * long-tail queries like "1 june 2026 panchang", "aaj ka panchang",
 * "panchang 27 may 2026". GSC shows /panchang root losing to Drik/
 * Prokerala at position 68 on `aaj ka panchang` (28d) while /choghadiya/
 * [date] wins position 4–6 on the same query shape because the URL
 * matches the query literally.
 *
 * URL shape note: lives under /panchang/date/[date] rather than
 * /panchang/[date] because /panchang already has /panchang/[city] as a
 * sibling dynamic segment (`/panchang/mumbai` etc.). Two dynamic
 * segments at the same path level confuse Next.js routing — every
 * /panchang/2026-06-01 request would otherwise resolve to [city] and
 * silently miss this route. The extra "/date/" prefix is a small SEO
 * tax in exchange for zero risk to the existing city pages.
 *
 * SEO city = Delhi (matches choghadiya/[date]). Real users see their
 * geo-resolved panchang at `/panchang` (root). This dated route is the
 * SEO surface — one URL per date, deterministic output, ISR-cached.
 *
 * REGRESSION GUARDS (CLAUDE.md):
 *   - `generateStaticParams: []` — per the static-page-budget rule. Date
 *     space is infinite; ISR handles cold pages. **Three prior PRs
 *     re-introduced params here and broke the 9k-page build. Do NOT
 *     enumerate dates — keep returning [].**
 *   - All date construction uses `Date.UTC(...)` — Lesson L (never the
 *     local-tz `new Date(y, m-1, d)` constructor in computation code).
 *   - Calls the canonical `computePanchang` engine — same loader the
 *     root /panchang page uses (Lesson B: single source of truth).
 *   - Festival match against `.amanta` (Lesson ZC).
 *
 * Spec: docs/specs/2026-05-27-seo-panchang-kundali-content.md §2.2
 */
import { setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale, pickByScript, getDateGenitive, isSuppressedSeoLocale, formatSeoDate } from '@/lib/utils/locale-fonts';
import { panchangDateSeo } from '@/lib/seo/date-page-seo';
import { locales, type Locale } from '@/lib/i18n/config';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getSeoCityForLocale } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { tl } from '@/lib/utils/trilingual';
import { isStrictYmd } from '@/lib/seo/date-validation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 86400; // 24h ISR
export const dynamicParams = true;

import { BASE_URL } from '@/lib/seo/base-url';
// SEO city resolved per-locale via getSeoCityForLocale() inside the
// handler; see cities.ts SEO_CITY_BY_LOCALE map. Used to be a static
// 'delhi' default which made every /xx/panchang/date/YYYY-MM-DD render
// the same Delhi data — cross-locale duplicate-content risk.

// MONTHS_HI used to live here; moved to `lib/utils/locale-fonts.ts`
// alongside formatSeoDate which now handles all the date rendering
// previously done by the local formatDateHuman helper.

/**
 * Parse YYYY-MM-DD with strict round-trip + a panchang-specific
 * crawlable-year bound. `isStrictYmd` covers shape + rollover (shared
 * with proxy.ts so rollover URLs 404 at the edge). The year bound is
 * narrower than choghadiya/[date] (2020-2035) because panchang spends
 * more CPU per page — don't open the full range to crawl-budget bloat.
 */
function parseDate(dateStr: string): { year: number; month: number; day: number } | null {
  if (!isStrictYmd(dateStr)) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  if (y < 2024 || y > 2030) return null;
  return { year: y, month: m, day: d };
}

// formatDateHuman lived here as a Hindi-or-EN ternary; removed in the
// PR #329 hotfix cycle-5 cleanup. All callers now use formatSeoDate
// from locale-fonts.ts, which handles Marathi correctly too.

// ──────────────────────────────────────────────────────────────
// Static params — MUST RETURN EMPTY
//
// See CLAUDE.md §"Static Page Budget". The build budget is ~9000 pages.
// We're at 7975 today. Date space is infinite; enumerating any subset
// here is a regression risk that has reverted itself THREE times via
// PR merges. ISR (revalidate 86400) handles cold dates without
// pre-rendering. If you want to pre-render hot dates, do it via the
// sitemap, not here.
// ──────────────────────────────────────────────────────────────

export function generateStaticParams(): Array<{ locale: string; date: string }> {
  return [];
}

// ──────────────────────────────────────────────────────────────
// Metadata
// ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; date: string }> }): Promise<Metadata> {
  const { locale, date: dateStr } = await params;
  setRequestLocale(locale);
  const parsed = parseDate(dateStr);
  if (!parsed) return { title: 'Panchang — Dekho Panchang' };
  const isHi = isDevanagariLocale(locale);
  // formatSeoDate handles Marathi correctly (ICU mr-IN month names) vs the
  // old formatDateHuman which used Hindi MONTHS_HI for every Devanagari
  // locale and mis-spelt Marathi months. Gemini PR #329 MEDIUM.
  const humanDate = formatSeoDate(parsed.year, parsed.month, parsed.day, locale);
  const url = `${BASE_URL}/${locale}/panchang/date/${dateStr}`;
  // cityName must come from the SAME source as the page handler's
  // city (getSeoCityForLocale) and use the SAME script (tl) — otherwise
  // metadata-vs-body cities drift and Google sees inconsistent content.
  const seoCity = getSeoCityForLocale(locale);
  const cityName = tl(seoCity.name, locale);

  // Per-locale title / description / keywords come from the exhaustive
  // `panchangDateSeo()` helper. If a new locale is added to `Locale`,
  // the helper fails to type-check until each new `case` is handled,
  // making it structurally impossible to ship the "Hindi-fallback
  // duplicate title" bug that crashed Marathi + Maithili 2026-05-31.
  // (Replaces the prior ternary cascade. Lesson 2026-06-01 GSC drop.)
  const { title, description, keywords } = panchangDateSeo({
    locale: locale as Locale,
    humanDate,
    cityName,
  });

  // Sanskrit (retired) — suppress from index. Without this Google
  // discovers /sa/... URLs via the dynamic [locale] segment and
  // treats them as near-duplicate Hindi.
  const noindex = isSuppressedSeoLocale(locale);

  return {
    title,
    description,
    keywords,
    robots: noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: {
        // `locales` already excludes retired locales (no `sa`), so the
        // hreflang map is automatically clean. x-default points to EN.
        ...Object.fromEntries(locales.map(l => [l, `${BASE_URL}/${l}/panchang/date/${dateStr}`])),
        'x-default': `${BASE_URL}/en/panchang/date/${dateStr}`,
      },
    },
  };
}

// ──────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────

export default async function PanchangDatePage({
  params,
}: { params: Promise<{ locale: string; date: string }> }) {
  const { locale, date: dateStr } = await params;
  setRequestLocale(locale);
  const parsed = parseDate(dateStr);
  if (!parsed) notFound();

  const { year, month, day } = parsed;
  const isHi = isDevanagariLocale(locale);
  // Same locale-aware formatter as the metadata above — keeps the H1
  // (line ~273) in sync with the title. Without this Marathi H1 read
  // "1 जून 2026 का पंचांग" (Hindi grammar) while the title fix above
  // emitted Marathi. Mixed-signal duplicate-content risk.
  const humanDate = formatSeoDate(year, month, day, locale);
  const city = getSeoCityForLocale(locale);
  // Locale-correct city name for H1 + description. Must match the
  // cityName passed to panchangDateSeo() in metadata above so SERP title
  // and on-page H1 stay aligned (Marathi मुंबई / Bengali মুম্বই, etc).
  const cityName = tl(city.name, locale);

  // Compute the panchang via the canonical engine. Same loader the root
  // /panchang page uses (Lesson B: single source of truth). city is
  // guaranteed non-null by getSeoCityForLocale.
  let panchang: Awaited<ReturnType<typeof computePanchang>> | null = null;
  try {
    const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);
    panchang = computePanchang({
      year, month, day,
      lat: city.lat, lng: city.lng,
      tzOffset, timezone: city.timezone,
      locationName: cityName,
    });
  } catch (err) {
    console.error('[panchang/date] SSR computation failed for', dateStr, ':', err);
  }

  // Festival match via `.amanta` (Lesson ZC: festival defs use Amant
  // month names; matching against `.purnimanta` shifts Diwali, Dussehra
  // etc. by ~30 days during Krishna Paksha).
  let festivalToday: { name: string; slug: string } | null = null;
  try {
    const fests = generateFestivalCalendarV2(year, city.lat, city.lng, city.timezone);
    const hit = fests.find(f => f.date === dateStr);
    if (hit) {
      festivalToday = { name: tl(hit.name, locale), slug: hit.slug ?? '' };
    }
  } catch (err) {
    console.error('[panchang/date] festival lookup failed:', err);
  }

  // Adjacent date links — the crawl spine. Built via Date.UTC arithmetic
  // (Lesson L) so we never roll into a server-local timezone bug.
  const dayMs = new Date(Date.UTC(year, month - 1, day)).getTime();
  const prevStr = new Date(dayMs - 86_400_000).toISOString().slice(0, 10);
  const nextStr = new Date(dayMs + 86_400_000).toISOString().slice(0, 10);

  // Weekday name via Intl. Auto-picks the right script for the locale.
  //
  // The H1 / SSR description fall back to ENGLISH for non-Devanagari
  // locales (ta/te/bn/gu/kn) — they don't yet have proper translations.
  // If we then render `weekdayName` in the user's native script, the H1
  // reads as mixed-script: e.g. "வியாழன், 1 June 2026 Panchang" (Tamil
  // weekday + English everything else). Gemini PR #329 cycle-8 MEDIUM.
  //
  // Strategy: only use the user's locale for the weekday when the rest
  // of the H1 is also in that locale — i.e. for the Devanagari path
  // (hi / mai / mr / sa). Everything else gets the English weekday.
  const weekdayLocale = isHi ? locale : 'en';
  const weekdayName = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(weekdayLocale, {
    weekday: 'long',
    timeZone: 'UTC',
  });

  // Trilingual fields → pickByScript (Gemini #240 MED): consistent with
  // the rest of the codebase, handles all Devanagari locales uniformly.
  // The `?? '—'` keeps the InfoRow value: string contract intact when
  // a locale's translation is missing.
  const tithiName = panchang ? pickByScript(panchang.tithi.name.en ?? '—', panchang.tithi.name.hi ?? '—', locale) : '—';
  const nakName = panchang ? pickByScript(panchang.nakshatra.name.en ?? '—', panchang.nakshatra.name.hi ?? '—', locale) : '—';
  const yogaName = panchang?.yoga?.name ? pickByScript(panchang.yoga.name.en ?? '—', panchang.yoga.name.hi ?? '—', locale) : '—';
  const karanaName = panchang?.karana?.name ? pickByScript(panchang.karana.name.en ?? '—', panchang.karana.name.hi ?? '—', locale) : '—';
  const varaName = panchang?.vara?.name ? pickByScript(panchang.vara.name.en ?? weekdayName, panchang.vara.name.hi ?? weekdayName, locale) : weekdayName;
  const rkStart = panchang?.rahuKaal?.start ?? '—';
  const rkEnd = panchang?.rahuKaal?.end ?? '—';
  const sunrise = panchang?.sunrise ?? '—';
  const sunset = panchang?.sunset ?? '—';
  const abhijitStart = panchang?.abhijitMuhurta?.start ?? null;
  const abhijitEnd = panchang?.abhijitMuhurta?.end ?? null;

  const rowLabel = (en: string, hi: string) => (isHi ? hi : en);

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <tr className="border-b border-white/[0.04] hover:bg-white/[0.02]">
      <td className="py-2.5 px-4 text-gold-light font-semibold w-44">{label}</td>
      <td className="py-2.5 px-4 text-text-primary">{value}</td>
    </tr>
  );

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-10 sm:px-6 lg:px-8">
        {/* Adjacent-date nav (crawl spine + UX) */}
        <nav className="flex items-center justify-between mb-6 text-sm" aria-label={isHi ? 'दिनांक नेविगेशन' : 'Date navigation'}>
          <Link
            href={`/${locale}/panchang/date/${prevStr}`}
            className="text-gold-primary hover:text-gold-light transition-colors"
            rel="prev"
          >
            ← {isHi ? 'पिछला दिन' : 'Previous day'}
          </Link>
          <Link
            href={`/${locale}/panchang`}
            className="text-text-secondary hover:text-gold-light transition-colors"
          >
            {isHi ? 'आज' : 'Today'}
          </Link>
          <Link
            href={`/${locale}/panchang/date/${nextStr}`}
            className="text-gold-primary hover:text-gold-light transition-colors"
            rel="next"
          >
            {isHi ? 'अगला दिन' : 'Next day'} →
          </Link>
        </nav>

        {/* Per-locale H1 — Marathi uses चे instead of Hindi का; the title
            metadata above does the same, keeping H1 and SERP title aligned. */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi
            ? `${weekdayName}, ${humanDate} ${getDateGenitive(locale)} ${cityName} पंचांग`
            : `${cityName} Panchang for ${weekdayName}, ${humanDate}`}
        </h1>

        {/* Festival callout */}
        {festivalToday && (
          <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-full bg-gold-primary/15 border border-gold-primary/30 text-gold-light text-sm">
            <span className="mr-2">✦</span>
            <span>
              {isHi
                ? `आज ${festivalToday.name} है।`
                : `Today is ${festivalToday.name}.`}{' '}
              {festivalToday.slug && (
                <Link
                  href={`/${locale}/festivals/${festivalToday.slug}/${year}`}
                  className="underline hover:no-underline"
                >
                  {isHi ? 'मुहूर्त देखें' : 'See muhurat'}
                </Link>
              )}
            </span>
          </div>
        )}

        {/* SEO summary paragraph — front-loads the answer for featured-snippet capture */}
        {panchang && (
          <p className="text-text-primary text-base mt-4 leading-relaxed">
            {isHi
              ? `${cityName} में ${weekdayName}, ${humanDate} को तिथि ${tithiName}, नक्षत्र ${nakName}, योग ${yogaName} और करण ${karanaName} है। सूर्योदय ${sunrise}, सूर्यास्त ${sunset}। राहु काल ${rkStart} से ${rkEnd}, इस दौरान नए शुभ कार्य न आरम्भ करें।`
              : `In ${cityName} on ${weekdayName}, ${humanDate} the Tithi is ${tithiName}, Nakshatra is ${nakName}, Yoga is ${yogaName} and Karana is ${karanaName}. Sunrise ${sunrise}, sunset ${sunset}. Rahu Kaal runs ${rkStart}–${rkEnd} — avoid starting new auspicious work during this window.`}
          </p>
        )}

        {/* Info table (Tithi/Nakshatra/Yoga/Karana/Vara + sunrise/sunset + Rahu/Abhijit) */}
        <section className="mt-8 rounded-xl border border-gold-primary/12 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <InfoRow label={rowLabel('Tithi', 'तिथि')} value={tithiName} />
              <InfoRow label={rowLabel('Nakshatra', 'नक्षत्र')} value={nakName} />
              <InfoRow label={rowLabel('Yoga', 'योग')} value={yogaName} />
              <InfoRow label={rowLabel('Karana', 'करण')} value={karanaName} />
              <InfoRow label={rowLabel('Vara', 'वार')} value={varaName} />
              <InfoRow label={rowLabel('Sunrise', 'सूर्योदय')} value={sunrise} />
              <InfoRow label={rowLabel('Sunset', 'सूर्यास्त')} value={sunset} />
              <InfoRow label={rowLabel('Rahu Kaal', 'राहु काल')} value={`${rkStart} – ${rkEnd}`} />
              {abhijitStart && abhijitEnd && (
                <InfoRow label={rowLabel('Abhijit Muhurta', 'अभिजित मुहूर्त')} value={`${abhijitStart} – ${abhijitEnd}`} />
              )}
            </tbody>
          </table>
        </section>

        <p className="text-text-secondary text-xs mt-3">
          {isHi
            ? `${cityName} के लिए गणना। अपने शहर के अनुसार पंचांग देखने के लिए मुख्य पंचांग पेज पर जाएँ।`
            : `Computed for ${cityName}. For your city, visit the main Panchang page.`}
        </p>

        {/* Related links */}
        <nav className="flex flex-wrap gap-2 mt-10 text-xs" aria-label={isHi ? 'सम्बन्धित पृष्ठ' : 'Related pages'}>
          <Link href={`/${locale}/choghadiya/${dateStr}`} className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? `${humanDate} का चौघड़िया` : `${humanDate} Choghadiya`}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/panchang`} className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'आज का पंचांग' : "Today's Panchang"}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/calendar`} className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'त्योहार कैलेंडर' : 'Festival Calendar'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/kundali`} className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'कुंडली' : 'Kundali'}
          </Link>
        </nav>
      </div>
    </main>
  );
}
