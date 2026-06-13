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
import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale, pickByScript, getDateGenitive, isSuppressedSeoLocale, formatSeoDate } from '@/lib/utils/locale-fonts';
import { panchangDateSeo } from '@/lib/seo/date-page-seo';
import { locales, type Locale } from '@/lib/i18n/config';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getSeoCityForLocale } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { getPanchangDatePageModel } from '@/lib/precompute/panchang-date-page-model';
import { tl } from '@/lib/utils/trilingual';
import { pickPanchangDateLabel as PDL, formatPanchangDateLabel } from '@/lib/content/panchang-date-labels';
import { isStrictYmd } from '@/lib/seo/date-validation';
import { isStale } from '@/lib/seo/staleness';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LearnConceptsBlock from '@/components/seo/LearnConceptsBlock';
import TodaySignificanceSection from '@/components/date-content/TodaySignificanceSection';
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
  //
  // Rule 1 — date staleness: URLs more than 14 days from today (past
  // or future) emit noindex so Google drops them from the index over
  // the next 5-14 days. Keeps fresh dates indexable, drops the
  // long-tail of stale dates that dilute crawl budget. Locked at 14d
  // per the 2026-06-03 GSC-drop strategy. ISR (revalidate = 86400)
  // means the flip happens within 24h of crossing the threshold.
  const noindex = isSuppressedSeoLocale(locale) || isStale({ kind: 'date-keyed', urlDate: dateStr });

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
  // `isHi` was kept as a script-family flag for ad-hoc Devanagari-only
  // helpers; all the per-sentence Hindi-grammar branching that used to
  // gate via `useHindiPhrase` is now resolved per-locale via the
  // panchang-date-labels module (Gemini-translated for the 6 regional
  // Indic locales). Keeping `isHi` only for the weekday-locale picker
  // below — locales without an ICU weekday name still fall back to en
  // so the SSR string matches what tl() yields for panchang fields.
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

  // Read precomputed page model (Blob → live-compute fallback). The
  // reader returns a flattened panchang shape that the rest of the
  // handler consumes via the existing fields (tithi.name, nakshatra.name,
  // …). See src/lib/precompute/panchang-date-page-model.ts for the
  // four-state contract (kill switch / cold cache / hot Blob / schema
  // mismatch). One Blob serves every locale that maps to the same
  // SEO city; `tl(name, locale)` at render time picks the script.
  let model: Awaited<ReturnType<typeof getPanchangDatePageModel>> | null = null;
  try {
    model = await getPanchangDatePageModel({ date: dateStr, city });
  } catch (err) {
    console.error('[panchang/date] page-model load failed for', dateStr, ':', err);
  }
  // Keep `panchang` as the local binding the rest of the handler
  // already reads. The Blob shape is a subset of computePanchang's
  // result, but every field the SSR consumes (tithi/nakshatra/yoga/
  // karana/vara/sunrise/sunset/rahuKaal/abhijitMuhurta) is present.
  const panchang = model;
  const festivalToday: { name: string; slug: string } | null =
    model?.festivalToday
      ? { name: tl(model.festivalToday.name, locale), slug: model.festivalToday.slug }
      : null;

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

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <tr className="border-b border-white/[0.04] hover:bg-white/[0.02]">
      <td className="py-2.5 px-4 text-gold-light font-semibold w-44">{label}</td>
      <td className="py-2.5 px-4 text-text-primary">{value}</td>
    </tr>
  );

  // ── FAQPage JSON-LD ──────────────────────────────────────────────────
  // Date-derived FAQ schema. GSC showed `30 may 2026 panchang` at pos
  // 2.20 with 0.37% CTR — the page was ranking but losing the snippet
  // because there were no FAQs Google could lift. All answers come from
  // the already-computed `panchang` object, so per-date drift is
  // structurally impossible. EN-only answers — Google processes the
  // English variant for rich-result eligibility. 2026-06-11 audit Item 8.
  const longDate = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
  const faqPairs: Array<{ q: string; a: string }> = [];
  if (panchang) {
    const tithiEn = panchang.tithi.name.en ?? '—';
    const nakEn = panchang.nakshatra.name.en ?? '—';
    const yogaEn = panchang.yoga?.name?.en ?? '—';
    const karanaEn = panchang.karana?.name?.en ?? '—';
    const sunriseAns = panchang.sunrise ?? '—';
    const sunsetAns = panchang.sunset ?? '—';
    const rkStartAns = panchang.rahuKaal?.start ?? '—';
    const rkEndAns = panchang.rahuKaal?.end ?? '—';
    faqPairs.push({
      q: `What is the tithi on ${longDate}?`,
      a: `The tithi at sunrise on ${longDate} is ${tithiEn} (Vedic lunar day). Tithis change throughout the day as the Moon advances 12° relative to the Sun; the displayed value is the tithi prevailing at sunrise (Udaya Tithi rule) — the standard for daily panchang reading in ${cityName}.`,
    });
    faqPairs.push({
      q: `What time is sunrise and sunset on ${longDate} in ${cityName}?`,
      a: `On ${longDate}, sunrise in ${cityName} is at ${sunriseAns} and sunset is at ${sunsetAns}. These are computed from Swiss Ephemeris using the city's exact coordinates (${city.lat.toFixed(4)}°N, ${city.lng.toFixed(4)}°E), not approximate tables — so they're accurate to the minute.`,
    });
    faqPairs.push({
      q: `What is the nakshatra on ${longDate}?`,
      a: `The nakshatra (lunar mansion) at sunrise on ${longDate} is ${nakEn}. There are 27 nakshatras spanning the zodiac at 13°20' each; the Moon takes about a day to transit one. Each nakshatra has a presiding deity and a ruling planet that flavour the day's activities and muhurta selection.`,
    });
    faqPairs.push({
      q: `What is the Rahu Kaal time on ${longDate} in ${cityName}?`,
      a: `Rahu Kaal on ${longDate} in ${cityName} runs from ${rkStartAns} to ${rkEndAns}. Rahu Kaal is the inauspicious 90-minute window each day during which new ventures are traditionally avoided; its start and end are derived from sunrise and sunset, so they vary by city — the times shown are for ${cityName} specifically.`,
    });
    faqPairs.push({
      q: `What yoga and karana fall on ${longDate}?`,
      a: `On ${longDate}, the yoga at sunrise is ${yogaEn} and the karana is ${karanaEn}. The yoga is one of 27 sum-position combinations of Sun and Moon longitudes; the karana is half a tithi. Both feed muhurta selection — some yogas (like Vyatipata, Vaidhriti) are avoided for new beginnings.`,
    });
    if (festivalToday) {
      faqPairs.push({
        q: `Which festival falls on ${longDate}?`,
        a: `${festivalToday.name} is observed on ${longDate}. Festival dates are computed from the Vedic tithi calendar using city-specific sunrise — so the date here is correct for ${cityName} and may differ by one day from other cities where the relevant tithi falls at a different sunrise.`,
      });
    } else {
      faqPairs.push({
        q: `Is there a festival on ${longDate}?`,
        a: `No major Hindu festival falls on ${longDate} in ${cityName} per the engine's festival calendar (computed from masa + paksha + tithi against the canonical Drik-tradition rule set). For the full festival list for ${year}, see the festivals hub.`,
      });
    }
  }
  const faqLD = faqPairs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqPairs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null;

  // Render a locale-specific summary template with [[1]]..[[5]] markers
  // interleaved as <Link> wrappers around the linkText1..linkText5
  // anchors. Splitting on /\[\[(\d+)\]\]/ keeps the surrounding prose
  // intact while letting each locale's translation rearrange word
  // order around the link insertion points.
  function renderSummary(template: string, anchors: React.ReactNode[]): React.ReactNode {
    const parts = template.split(/\[\[(\d+)\]\]/);
    return parts.map((part, i) => {
      if (i % 2 === 0) return <React.Fragment key={i}>{part}</React.Fragment>;
      const linkIdx = parseInt(part, 10) - 1;
      return <React.Fragment key={i}>{anchors[linkIdx]}</React.Fragment>;
    });
  }

  return (
    <main className="min-h-screen bg-bg-primary">
      {faqLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-10 sm:px-6 lg:px-8">
        {/* Adjacent-date nav (crawl spine + UX) */}
        <nav className="flex items-center justify-between mb-6 text-sm" aria-label={PDL('dateNavAria', locale)}>
          <Link
            href={`/${locale}/panchang/date/${prevStr}`}
            className="text-gold-primary hover:text-gold-light transition-colors"
            rel="prev"
          >
            ← {PDL('prevDay', locale)}
          </Link>
          <Link
            href={`/${locale}/panchang`}
            className="text-text-secondary hover:text-gold-light transition-colors"
          >
            {PDL('today', locale)}
          </Link>
          <Link
            href={`/${locale}/panchang/date/${nextStr}`}
            className="text-gold-primary hover:text-gold-light transition-colors"
            rel="next"
          >
            {PDL('nextDay', locale)} →
          </Link>
        </nav>

        {/* Per-locale H1 — full template is per-locale so each language
            can rearrange CITY/WEEKDAY/DATE around its native grammar
            (Marathi चे, Hindi का, Tamil postpositional, etc.). */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
          {formatPanchangDateLabel('h1Template', locale, {
            CITY: cityName,
            WEEKDAY: weekdayName,
            DATE: humanDate,
          })}
        </h1>

        {/* Festival callout */}
        {festivalToday && (
          <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-full bg-gold-primary/15 border border-gold-primary/30 text-gold-light text-sm">
            <span className="mr-2">✦</span>
            <span>
              {formatPanchangDateLabel('festivalTodayTemplate', locale, { NAME: festivalToday.name })}{' '}
              {festivalToday.slug && (
                <Link
                  href={`/${locale}/festivals/${festivalToday.slug}/${year}`}
                  className="underline hover:no-underline"
                >
                  {PDL('seeMuhurat', locale)}
                </Link>
              )}
            </span>
          </div>
        )}

        {panchang && panchang.tithi.number > 0 ? (
          <TodaySignificanceSection
            tithiNumber={panchang.tithi.number}
            weekday={new Date(Date.UTC(year, month - 1, day)).getUTCDay()}
            dateStr={dateStr}
            lat={city.lat}
            lng={city.lng}
            timezone={city.timezone}
            locale={locale}
          />
        ) : null}

        {/* SEO summary paragraph — front-loads the answer for featured-snippet
            capture. Each panchang concept is an inline link to its /learn page
            (helpful-content signal — Jun 2026 recovery work). The /learn slugs
            are verified live in src/app/[locale]/learn/<slug>/page.tsx.

            All 9 locales now have a per-locale `summaryTemplate` with
            placeholders {CITY}/{WEEKDAY}/{DATE}/{TITHI}/{NAK}/{YOGA}/
            {KARANA}/{SUNRISE}/{SUNSET}/{RK_START}/{RK_END} plus 5 link
            markers [[1]]..[[5]] for the inline <Link>s. The mixed-language
            risk from PR #391 HIGH x2 is now closed for every locale by
            having translated nouns and panchang field values rendered
            via tl(panchang.tithi.name, locale) etc. */}
        {panchang && (
          <p className="text-text-primary text-base mt-4 leading-relaxed">
            {renderSummary(
              formatPanchangDateLabel('summaryTemplate', locale, {
                CITY: cityName,
                WEEKDAY: weekdayName,
                DATE: humanDate,
                TITHI: tithiName,
                NAK: nakName,
                YOGA: yogaName,
                KARANA: karanaName,
                SUNRISE: sunrise,
                SUNSET: sunset,
                RK_START: rkStart,
                RK_END: rkEnd,
              }),
              [
                <Link key="1" href={`/${locale}/learn/tithis` as never} className="text-gold-light underline decoration-gold-primary/40 hover:decoration-gold-primary">{PDL('linkText1', locale)}</Link>,
                <Link key="2" href={`/${locale}/learn/nakshatras` as never} className="text-gold-light underline decoration-gold-primary/40 hover:decoration-gold-primary">{PDL('linkText2', locale)}</Link>,
                <Link key="3" href={`/${locale}/learn/yoga` as never} className="text-gold-light underline decoration-gold-primary/40 hover:decoration-gold-primary">{PDL('linkText3', locale)}</Link>,
                <Link key="4" href={`/${locale}/learn/karanas` as never} className="text-gold-light underline decoration-gold-primary/40 hover:decoration-gold-primary">{PDL('linkText4', locale)}</Link>,
                <Link key="5" href={`/${locale}/learn/rahu-kaal` as never} className="text-gold-light underline decoration-gold-primary/40 hover:decoration-gold-primary">{PDL('linkText5', locale)}</Link>,
              ],
            )}
          </p>
        )}

        {/* Info table (Tithi/Nakshatra/Yoga/Karana/Vara + sunrise/sunset + Rahu/Abhijit) */}
        <section className="mt-8 rounded-xl border border-gold-primary/12 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <InfoRow label={PDL('rowTithi', locale)} value={tithiName} />
              <InfoRow label={PDL('rowNakshatra', locale)} value={nakName} />
              <InfoRow label={PDL('rowYoga', locale)} value={yogaName} />
              <InfoRow label={PDL('rowKarana', locale)} value={karanaName} />
              <InfoRow label={PDL('rowVara', locale)} value={varaName} />
              <InfoRow label={PDL('rowSunrise', locale)} value={sunrise} />
              <InfoRow label={PDL('rowSunset', locale)} value={sunset} />
              <InfoRow label={PDL('rowRahuKaal', locale)} value={`${rkStart} – ${rkEnd}`} />
              {abhijitStart && abhijitEnd && (
                <InfoRow label={PDL('rowAbhijitMuhurta', locale)} value={`${abhijitStart} – ${abhijitEnd}`} />
              )}
            </tbody>
          </table>
        </section>

        <p className="text-text-secondary text-xs mt-3">
          {formatPanchangDateLabel('computedForTemplate', locale, { CITY: cityName })}
        </p>

      </div>

      {/* Learn Vedic concepts — helpful-content signal + internal authority
          to /learn/* hub. Shared with /panchang root + /panchang/[city]. */}
      <LearnConceptsBlock locale={locale} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Related links */}
        <nav className="flex flex-wrap gap-2 mt-10 text-xs" aria-label={PDL('relatedPagesAria', locale)}>
          <Link href={`/${locale}/choghadiya/${dateStr}`} className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {formatPanchangDateLabel('linkChoghadiyaTemplate', locale, { DATE: humanDate })}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/panchang`} className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {PDL('linkTodaysPanchang', locale)}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/calendar`} className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {PDL('linkFestivalCalendar', locale)}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/kundali`} className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {PDL('linkKundali', locale)}
          </Link>
        </nav>
      </div>
    </main>
  );
}
