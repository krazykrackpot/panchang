import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/lib/i18n/config';
import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Sunrise, Sunset, Clock, MapPin, Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import WhatsAppShareBanner from '@/components/ui/WhatsAppShareBanner';
import LearnConceptsBlock from '@/components/seo/LearnConceptsBlock';
import {
  getCityBySlugExtended,
  getNearbyCitiesIndexable,
  isSeoIndexableCity,
} from '@/lib/constants/cities-extended';
import { getCityDescriptor } from '@/lib/constants/city-descriptors';
import { getStateLocale } from '@/lib/constants/state-name-locale';
import { hasLocaleNativeCityContent } from '@/lib/seo/city-content-floor';
import { buildCityHreflangMap } from '@/lib/seo/city-hreflang';
import { getPanchangCityPageModel } from '@/lib/precompute/panchang-city-page-model';
import type { PanchangData } from '@/types/panchang';
import { generateDailyArticle, type ArticleCityConfig } from '@/lib/horoscope/daily-article';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { Locale, TransitionInfo } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import M from '@/messages/pages/panchang-city.json';
import CrossSellCTA from '@/components/cta/CrossSellCTA';
import {
  pickPanchangCityLabel as CL,
  formatPanchangCityLabel,
  panchangCityMonthShort,
} from '@/lib/content/panchang-city-labels';

type LocaleText = Record<string, string>;
const msg = (key: string, locale: string) => tl((M as unknown as Record<string, LocaleText>)[key], locale);

import { BASE_URL } from '@/lib/seo/base-url';

/** Convert server UTC time to a city's local date components.
 *  Vercel runs UTC — new Date() gives wrong date for cities ahead of UTC after midnight. */
function getCityLocalDate(timezone: string) {
  const nowUtc = new Date();
  const tzOff = getUTCOffsetForDate(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth() + 1, nowUtc.getUTCDate(), timezone);
  const shifted = new Date(nowUtc.getTime() + tzOff * 3600_000);
  return {
    date: shifted,
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

// ──────────────────────────────────────────────────────────────
// ISR with 6-hour revalidation. Tithi changes every ~12 hours, so 6h stays
// well under the content-change frequency while halving serverless rebuilds
// vs the previous 1h cadence. The SSR HTML (with tithi/nakshatra in <title>)
// is consumed by Google's crawler. Users see live data because a
// CityPanchangClient component (rendered in the page body) fetches from
// /api/panchang on hydration, overriding the cached SSR values immediately.
// Audit 2026-05-25 §E (perf-cwv-remediation).
// revalidate = false: data comes from a precomputed Blob written by the
// nightly cron (scripts/precompute/panchang-city.ts). The cron POSTs to
// /api/precompute/revalidate which calls revalidatePath on this route
// family after every write. Time-based ISR expiry is therefore redundant
// — and each expiry generates an ISR Write when the next user hits a
// stale page. Blob-driven invalidation only (cron → revalidatePath).
export const revalidate = false;
export const dynamicParams = true;

// Per CLAUDE.md "static page budget" rule: dynamic-segment routes MUST
// return `[]` from generateStaticParams to opt into ISR/static serving.
export function generateStaticParams(): Array<{ locale: string; city: string }> {
  return [];
}

// ──────────────────────────────────────────────────────────────
// Metadata
// ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city: citySlug } = await params;
  setRequestLocale(locale);
  const city = getCityBySlugExtended(citySlug);
  if (!city) return {};

  // city.name is a 10-locale LocaleText; tl() routes to the request locale
  // and degrades to en when a locale is missing.
  const cityName = tl(city.name, locale);
  const { date: cityDate, year, month, day } = getCityLocalDate(city.timezone);
  const dateStr = cityDate.toLocaleDateString(msg('localeId', locale), {
    day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'UTC', // cityDate is already shifted — interpret as UTC to avoid double-shift
  });
  // Precompute lookup mirrors the page handler — Blob is shared across
  // generateMetadata and the page body (both call this loader). Cast
  // mirrors the page handler's cast at the same boundary.
  const metaDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const metaModel = await getPanchangCityPageModel({ date: metaDateStr, city });
  const metaPanchang = metaModel.panchang as unknown as PanchangData;
  // tl() resolves the panchang field names per locale (10-locale ships
  // for tithi/nakshatra; auto-falls back to en where missing).
  const metaTithi = tl(metaPanchang.tithi.name, locale);
  const metaNakshatra = tl(metaPanchang.nakshatra.name, locale);

  // Map IANA timezones to short abbreviations for diaspora cities.
  // Only shown for non-Indian cities  –  Indian cities all share IST and don't need it.
  const TZ_SHORT: Record<string, string> = {
    'America/New_York':       'EST',
    'America/Los_Angeles':    'PST',
    'America/Chicago':        'CST',
    'Europe/London':          'GMT',
    'Australia/Sydney':       'AEST',
    'Australia/Melbourne':    'AEST',
    'America/Toronto':        'EST',
    'Asia/Singapore':         'SGT',
    'Asia/Dubai':             'GST',
    'Asia/Kuala_Lumpur':      'MYT',
    'Indian/Mauritius':       'MUT',
    'Pacific/Fiji':           'FJT',
    'Pacific/Auckland':       'NZST',
    'America/Port_of_Spain':  'AST',
  };
  const isDiaspora = city.timezone !== 'Asia/Kolkata';
  const tzShort = isDiaspora ? TZ_SHORT[city.timezone] : null;

  // Date + tithi + nakshatra in title — staleness bounded by `revalidate=21600`
  // (6h). Tithi changes every ~12h on average, so worst-case the title
  // shows the *previous* tithi for ~6h after a transition. Acceptable
  // tradeoff for CDN-cacheable SSR. Geo-personalized title for the root
  // /panchang lives on its own page.tsx — it stays dynamic because per-user.
  // Per-locale templates (9-locale) so each locale gets a distinct,
  // grammatically-native title — Tamil/Telugu/etc. were previously
  // collapsing onto the EN title (mixed-language duplicate-content
  // signal). The shared label module covers all 10 visible locales.
  const titleTemplate = tzShort ? 'titleDiasporaTemplate' : 'titleDomesticTemplate';
  const title = formatPanchangCityLabel(titleTemplate, locale, {
    CITY: cityName,
    TZ: tzShort ?? '',
    TITHI: metaTithi,
    NAK: metaNakshatra,
    DATE: dateStr,
  });

  // Diaspora descriptions mention Hindu diaspora / NRI context with timezone for relevance
  const description = isDiaspora
    ? formatPanchangCityLabel('descDiasporaTemplate', locale, {
        CITY: cityName,
        TZ_SUFFIX: tzShort
          ? formatPanchangCityLabel('tzSuffixTemplate', locale, { TZ: tzShort })
          : '',
      })
    : formatPanchangCityLabel('descDomesticTemplate', locale, {
        CITY: cityName,
        STATE: getStateLocale(city.state, locale),
      });

  const url = `${BASE_URL}/${locale}/panchang/${citySlug}`;

  // Phase 1 (2026-06-10): the (slug, locale) pair must be in the
  // CITIES_BY_LOCALE curated set — language ≠ city affinity, so Tamil
  // searchers don't expect Delhi panchang, etc. Plus the Phase 0
  // content-floor (locale-native city name + non-empty locale-script
  // descriptor) keeps a final guard in place in case a curated pair
  // somehow lacks proper content. Pairs that fail the curated check
  // AND were in the legacy flat index set are intercepted by proxy.ts
  // for HTTP 410 Gone — explicit dedupe signal to Google. Pairs that
  // fail but were never previously indexable just render with noindex.
  const isIndexable =
    isSeoIndexableCity(citySlug, locale) && hasLocaleNativeCityContent(citySlug, locale);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: buildCityHreflangMap(citySlug),
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    ...(isIndexable ? {} : { robots: { index: false, follow: true } }),
  };
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

function formatTransitionEnd(t: TransitionInfo | undefined, locale: string): string {
  if (!t) return msg('ended', locale);
  const time = t.endTime;
  if (t.endDate) {
    const [, m, d] = t.endDate.split('-').map(Number);
    return `${time}, ${d} ${panchangCityMonthShort(m, locale)}`;
  }
  return time;
}

// ──────────────────────────────────────────────────────────────
// Page Component (Server Component)
// ──────────────────────────────────────────────────────────────

export default async function CityPanchangPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city: citySlug } = await params;
  setRequestLocale(locale);
  const city = getCityBySlugExtended(citySlug);
  if (!city) notFound();

  const loc = (locale || 'en') as Locale;
  const cityName = tl(city.name, locale);
  // Locale-rendered state/country — closes the "मुंबई, Maharashtra के लिए"
  // mixed-script bleed (Phase 0a). JSON-LD blocks below keep `city.state`
  // (English) on purpose — schema.org expects canonical names.
  const stateLocale = getStateLocale(city.state, locale);

  const { date: now, year, month, day } = getCityLocalDate(city.timezone);
  const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);

  // Precompute Blob lookup with live-compute fallback. The inner
  // `panchang` field is opaque-typed at the Blob boundary (full
  // PanchangData has 100+ fields and a strict mirror would be
  // brittle to engine changes) — cast back to the canonical type
  // since every consumer below reads it as PanchangData.
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const model = await getPanchangCityPageModel({ date: dateStr, city });
  const panchang = model.panchang as unknown as PanchangData;

  // Generate daily narrative article for unique content
  const articleCityConfig: ArticleCityConfig = {
    name: city.name.en,
    nameHi: city.name.hi || '',
    lat: city.lat,
    lng: city.lng,
    timezone: city.timezone,
  };
  const dailyArticle = generateDailyArticle(now, articleCityConfig);
  const articleLoc = (isDevanagariLocale(loc) ? 'hi' : 'en') as 'en' | 'hi';
  const articleBody = dailyArticle.body[articleLoc];

  // Date display
  const dateDisplay = now.toLocaleDateString(msg('localeId', locale), {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'UTC', // `now` is already shifted to city TZ — interpret as UTC to avoid double-shift
  });

  // Tithi / Nakshatra / Yoga / Karana names
  const tithiName = panchang.tithi.name[loc] || panchang.tithi.name.en;
  const nakshatraName = panchang.nakshatra.name[loc] || panchang.nakshatra.name.en;
  const yogaName = panchang.yoga.name[loc] || panchang.yoga.name.en;
  const karanaName = panchang.karana.name[loc] || panchang.karana.name.en;

  // Lat/Lng display
  const latDir = city.lat >= 0 ? 'N' : 'S';
  const lngDir = city.lng >= 0 ? 'E' : 'W';
  const latStr = `${Math.abs(city.lat).toFixed(2)}°${latDir}`;
  const lngStr = `${Math.abs(city.lng).toFixed(2)}°${lngDir}`;

  // Nearby cities for cross-linking — restricted to the SEO keep-list so
  // every internal link from this page points at another indexable URL.
  // Stops dropped (noindex) slugs from being kept alive via the link graph,
  // and concentrates PageRank flow on the 44 keep-list cities. 2026-06-07.
  const popularCities = getNearbyCitiesIndexable(citySlug, 15);

  // Structured data for SEO. The graph models the page as a WebPage about
  // a named Place (the city), with the day's panchang as an Event located
  // at that Place. The explicit @id cross-references let Google's knowledge
  // graph link the page to the city entity — important for "<city> panchang"
  // and "panchang near me" queries.
  const dateIso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const pageUrl = `${BASE_URL}/${locale}/panchang/${citySlug}`;
  const placeId = `${pageUrl}#place`;
  // Country handling: cities-extended.ts overloads `state` to hold the
  // country name for international entries (e.g. New York → state: 'USA').
  // Asia/Kolkata is unambiguously India, so we can use timezone as a
  // reliable discriminator. For non-IN cities, `state` IS the country name,
  // so we set addressCountry to that and drop addressRegion (we don't have
  // proper state/region data for international entries).
  const isIndia = city.timezone === 'Asia/Kolkata';
  const stateOrCountry = city.state ?? '';
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: city.name.en,
    addressCountry: isIndia ? 'IN' : (stateOrCountry || 'IN'),
  };
  if (isIndia && stateOrCountry) address.addressRegion = stateOrCountry;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': pageUrl,
        url: pageUrl,
        name: `${city.name.en} Panchang Today`,
        description: `Daily Vedic Panchang for ${city.name.en}, ${city.state} with tithi, nakshatra, yoga, karana, and muhurta timings.`,
        about: { '@id': placeId },
        // mainEntity previously held an Event with the city's panchang
        // — removed 2026-06-03. A panchang for a city is a reference
        // document, not a time-bounded happening; Google's Event rich-
        // result eligibility didn't apply and the nested Event drew GSC
        // "missing performer / image / offers / description" warnings.
        // The WebPage's `about` field already ties it to the Place node
        // below, which is the correct semantic relationship.
      },
      {
        '@type': 'Place',
        '@id': placeId,
        name: `${city.name.en}, ${city.state}`,
        address,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: city.lat,
          longitude: city.lng,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-10 sm:px-6">
      <Script id="city-panchang-ld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>

      {/* ═══ BREADCRUMB ═══ */}
      <nav className="flex items-center gap-2 text-xs text-text-secondary mb-8">
        <Link href={`/${locale}`} className="hover:text-gold-primary transition-colors">
          {msg('home', locale)}
        </Link>
        <ChevronRight size={12} />
        <Link href={`/${locale}/panchang`} className="hover:text-gold-primary transition-colors">
          {msg('panchang', locale)}
        </Link>
        <ChevronRight size={12} />
        <span className="text-gold-primary font-medium">{cityName}</span>
      </nav>

      {/* ═══ HEADER ═══ */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-primary/20 bg-gold-primary/5 text-gold-primary text-xs font-bold mb-4">
          <MapPin size={14} />
          {stateLocale}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-light mb-3">
          {`${cityName} ${msg('panchangTitle', locale)}`}
        </h1>
        <p className="text-text-secondary text-lg mb-2">
          <Calendar size={16} className="inline mr-2 -mt-0.5" />
          {dateDisplay}
        </p>
        <p className="text-text-secondary/60 text-sm">
          {latStr}, {lngStr} &middot; {city.timezone} (UTC{tzOffset >= 0 ? '+' : ''}{tzOffset})
        </p>
      </header>

      {/* ═══ SEO INTRO TEXT ═══ */}
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-6 mb-10">
        <p className="text-text-primary/80 text-sm leading-relaxed">
          {formatPanchangCityLabel('introTemplate', locale, {
            CITY: cityName,
            STATE: stateLocale,
            LAT: latStr,
            LNG: lngStr,
          })}
        </p>
      </div>

      {/* ═══ CITY DESCRIPTOR ═══
          Per-city descriptor (notable temples, local festival traditions,
          regional fast/feast practices, climate notes, NRI/diaspora
          context). Differentiates the page body from the city-name-swap
          pattern documented in
          docs/specs/2026-06-08-seo-audit-followups.md item #2 — two
          Indian cities on the same date were sharing tithi/nakshatra/yoga
          /karana so the only body diff was the city name substitution.
          Data: src/lib/constants/city-descriptors.json (Gemini-authored,
          9-locale; covers the 44 SEO_INDEXABLE_CITY_SLUGS). */}
      {(() => {
        const descriptor = getCityDescriptor(citySlug);
        if (!descriptor) return null;
        const text = descriptor.descriptor[locale as keyof typeof descriptor.descriptor]
          ?? descriptor.descriptor.en;
        if (!text) return null;
        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-6 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-gold-primary" />
              <h2 className="text-gold-light text-base font-semibold">
                {tl(
                  {
                    en: `About ${city.name.en} Panchang`,
                    hi: `${city.name.hi || city.name.en} पंचांग के बारे में`,
                    mai: `${city.name.mai || city.name.hi || city.name.en} पंचांगक बारे मे`,
                    mr: `${city.name.mr || city.name.hi || city.name.en} पंचांगाबद्दल`,
                    ta: `${city.name.ta || city.name.en} பஞ்சாங்கம் பற்றி`,
                    te: `${city.name.te || city.name.en} పంచాంగం గురించి`,
                    bn: `${city.name.bn || city.name.en} পঞ্জিকা সম্পর্কে`,
                    kn: `${city.name.kn || city.name.en} ಪಂಚಾಂಗದ ಬಗ್ಗೆ`,
                    gu: `${city.name.gu || city.name.en} પંચાંગ વિશે`,
                  },
                  locale,
                )}
              </h2>
            </div>
            <p className="text-text-primary/85 text-sm leading-relaxed" style={isDevanagariLocale(loc) ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {text}
            </p>
          </div>
        );
      })()}

      {/* ═══ SUNRISE / SUNSET BANNER ═══ */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/15 p-5 text-center">
          <Sunrise size={28} className="mx-auto mb-2 text-amber-400" />
          <div className="text-xs uppercase tracking-wider text-amber-400/70 font-bold mb-1">
            {msg('sunrise', locale)}
          </div>
          <div className="text-2xl font-bold text-amber-300">{panchang.sunrise}</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent border border-orange-500/15 p-5 text-center">
          <Sunset size={28} className="mx-auto mb-2 text-orange-400" />
          <div className="text-xs uppercase tracking-wider text-orange-400/70 font-bold mb-1">
            {msg('sunset', locale)}
          </div>
          <div className="text-2xl font-bold text-orange-300">{panchang.sunset}</div>
        </div>
      </div>

      {/* ═══ MAIN PANCHANG GRID ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Tithi */}
        <PanchangCard
          label={msg('tithi', locale)}
          value={tithiName}
          detail={`${msg('ends', locale)}: ${formatTransitionEnd(panchang.tithiTransition, loc)}`}
          gradient="from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27]"
        />
        {/* Nakshatra */}
        <PanchangCard
          label={msg('nakshatra', locale)}
          value={nakshatraName}
          detail={`${msg('pada', locale)} ${panchang.nakshatra.pada ?? ' – '} · ${msg('ends', locale)}: ${formatTransitionEnd(panchang.nakshatraTransition, loc)}`}
          gradient="from-[#1b2d69]/50 via-[#101a40]/60 to-[#0a0e27]"
        />
        {/* Yoga */}
        <PanchangCard
          label={msg('yoga', locale)}
          value={yogaName}
          detail={`${msg('ends', locale)}: ${formatTransitionEnd(panchang.yogaTransition, loc)}`}
          gradient="from-[#691b4a]/50 via-[#401030]/60 to-[#0a0e27]"
        />
        {/* Karana */}
        <PanchangCard
          label={msg('karana', locale)}
          value={karanaName}
          detail={`${msg('ends', locale)}: ${formatTransitionEnd(panchang.karanaTransition, loc)}`}
          gradient="from-[#1b6945]/50 via-[#104030]/60 to-[#0a0e27]"
        />
      </div>

      {/* ═══ VARA & VEDIC MONTH ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center">
          <div className="text-xs uppercase tracking-wider text-gold-dark font-bold mb-1">
            {msg('vara', locale)}
          </div>
          <div className="text-xl font-bold text-gold-light">
            {panchang.vara.name[loc] || panchang.vara.name.en}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center">
          <div className="text-xs uppercase tracking-wider text-gold-dark font-bold mb-1">
            {msg('masa', locale)}
          </div>
          <div className="text-xl font-bold text-gold-light">
            {panchang.masa[loc] || panchang.masa.en}
          </div>
          <div className="text-text-secondary text-xs mt-1">
            {panchang.tithi.paksha === 'shukla' ? msg('shukla', locale) : msg('krishna', locale)}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center">
          <div className="text-xs uppercase tracking-wider text-gold-dark font-bold mb-1">
            {msg('samvatsara', locale)}
          </div>
          <div className="text-xl font-bold text-gold-light">
            {panchang.samvatsara?.[loc] || panchang.samvatsara?.en || ' – '}
          </div>
        </div>
      </div>

      {/* ═══ RAHU KAAL / YAMAGANDA / GULIKA ═══ */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gold-light mb-5 text-center">
          {msg('inauspicious', locale)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InauspiciousCard
            label={msg('rahuKaal', locale)}
            value={panchang.rahuKaal ? `${panchang.rahuKaal.start} – ${panchang.rahuKaal.end}` : ' – '}
            colorClass="text-red-400 border-red-500/20 bg-red-500/5"
          />
          <InauspiciousCard
            label={msg('yamaganda', locale)}
            value={panchang.yamaganda ? `${panchang.yamaganda.start} – ${panchang.yamaganda.end}` : ' – '}
            colorClass="text-orange-400 border-orange-500/20 bg-orange-500/5"
          />
          <InauspiciousCard
            label={msg('gulikaKaal', locale)}
            value={panchang.gulikaKaal ? `${panchang.gulikaKaal.start} – ${panchang.gulikaKaal.end}` : ' – '}
            colorClass="text-amber-400 border-amber-500/20 bg-amber-500/5"
          />
        </div>
      </div>

      {/* ═══ WHATSAPP SHARE CTA ═══ */}
      <WhatsAppShareBanner
        shareText={formatPanchangCityLabel('shareTextTemplate', locale, {
          CITY: cityName,
          TITHI: tithiName,
          NAK: nakshatraName,
          SR: panchang.sunrise,
        })}
        url={`${BASE_URL}/${locale}/panchang/${citySlug}`}
        locale={loc}
        className="mb-10"
      />

      {/* ═══ CALCULATION PROOF  –  TRANSPARENT AUDIT TRAIL ═══ */}
      <div className="mb-10">
        <details className="group rounded-2xl border border-gold-primary/10 bg-bg-secondary/30">
          <summary className="flex items-center gap-3 cursor-pointer px-6 py-4 text-gold-primary text-sm font-medium hover:text-gold-light transition-colors">
            <ChevronRight size={16} className="group-open:rotate-90 transition-transform flex-shrink-0" />
            {CL('calcProofHeader', locale)}
          </summary>
          <div className="px-6 pb-5 space-y-4 text-sm text-text-secondary">
            <p className="text-text-secondary/70">
              {formatPanchangCityLabel('calcProofIntroTemplate', locale, { CITY: cityName })}
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-bg-primary/50 rounded-xl p-4 border border-white/5 font-mono text-xs">
              <div className="text-text-secondary/50">{CL('calcLatitude', locale)}</div>
              <div className="text-text-primary">{city.lat.toFixed(4)}°{latDir}</div>
              <div className="text-text-secondary/50">{CL('calcLongitude', locale)}</div>
              <div className="text-text-primary">{city.lng.toFixed(4)}°{lngDir}</div>
              <div className="text-text-secondary/50">{CL('calcTimezone', locale)}</div>
              <div className="text-text-primary">{city.timezone} (UTC{tzOffset >= 0 ? '+' : ''}{tzOffset})</div>
              <div className="text-text-secondary/50">{CL('calcAyanamsha', locale)}</div>
              <div className="text-text-primary">Lahiri (Chitrapaksha)</div>
              <div className="text-text-secondary/50">{CL('calcSunDepression', locale)}</div>
              <div className="text-text-primary">-0.8333° (USNO standard refraction)</div>
              <div className="text-text-secondary/50">{CL('calcTithiFormula', locale)}</div>
              <div className="text-text-primary">⌊(Moon° − Sun°) / 12⌋ + 1</div>
              <div className="text-text-secondary/50">{CL('calcRahuKaalRow', locale)}</div>
              <div className="text-text-primary">{CL('calcRahuKaalFormula', locale)}</div>
            </div>
            <p className="text-text-secondary/50 text-xs">
              {CL('calcProofFootnote', locale)}{' '}
              <Link
                href={`/${locale}/about/methodology`}
                className="text-gold-light/80 underline underline-offset-2 hover:text-gold-primary"
              >
                {locale === 'hi' ? 'सम्पूर्ण पद्धति →' : locale === 'mai' ? 'सम्पूर्ण पद्धति →' : locale === 'mr' ? 'संपूर्ण पद्धती →' : locale === 'ta' ? 'முழு வழிமுறை →' : locale === 'te' ? 'పూర్తి పద్ధతి →' : locale === 'bn' ? 'সম্পূর্ণ পদ্ধতি →' : locale === 'gu' ? 'સંપૂર્ણ પદ્ધતિ →' : locale === 'kn' ? 'ಸಂಪೂರ್ಣ ವಿಧಾನ →' : 'Full methodology →'}
              </Link>
            </p>
          </div>
        </details>
      </div>

      {/* ═══ SPECIAL YOGAS (Dwipushkar, Tripushkar, Sarvartha Siddhi, etc.) ═══ */}
      {panchang.specialYogas && panchang.specialYogas.filter(y => y.isActive).length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gold-light mb-5 text-center">
            {CL('specialYogasHeading', locale)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {panchang.specialYogas.filter(y => y.isActive).map((yoga, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-lg font-bold text-emerald-300">
                    {yoga.name[loc] || yoga.name.en}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {yoga.description[loc] || yoga.description.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ MUHURTA TABLE ═══ */}
      {panchang.muhurtas && panchang.muhurtas.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gold-light mb-5 text-center">
            {msg('muhurtas', locale)}
          </h2>
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-gold-primary/8">
              {panchang.muhurtas.map((m, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${m.nature === 'auspicious' ? 'bg-emerald-400' : m.nature === 'inauspicious' ? 'bg-red-400' : 'bg-amber-400'}`} />
                    <span className="text-text-primary text-sm font-medium">
                      {m.name[loc] || m.name.en}
                    </span>
                  </div>
                  <span className="text-text-secondary text-sm font-mono">{m.startTime}–{m.endTime}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ CTA  –  DETAILED PANCHANG ═══ */}
      <div className="rounded-2xl bg-gradient-to-r from-gold-primary/10 via-gold-primary/5 to-transparent border border-gold-primary/20 p-6 text-center mb-12">
        <h3 className="text-lg font-bold text-gold-light mb-2">
            {msg('viewDetailed', locale)}
        </h3>
        <p className="text-text-secondary text-sm mb-4">
          {formatPanchangCityLabel('ctaSubtextTemplate', locale, { CITY: cityName })}
        </p>
        <Link
          href={`/${locale}/panchang?lat=${city.lat}&lng=${city.lng}&name=${encodeURIComponent(city.name.en)}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-primary/20 border border-gold-primary/40 text-gold-light font-bold hover:bg-gold-primary/30 transition-colors"
        >
          {msg('fullPanchang', locale)}
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* ═══ ABOUT THIS CITY PANCHANG  –  SEO CONTENT ═══ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gold-light mb-4">
          {`${msg('aboutPanchang', locale)} ${cityName}`}
        </h2>
        <div className="prose prose-invert max-w-none text-text-primary/75 text-sm leading-relaxed space-y-4">
          <p>{formatPanchangCityLabel('aboutPara1Template', locale, { CITY: cityName, STATE: stateLocale, LAT: latStr, LNG: lngStr })}</p>
          <p>{formatPanchangCityLabel('aboutPara2Template', locale, { CITY: cityName, TZ: city.timezone })}</p>
          <p>{CL('aboutPara3', locale)}</p>
        </div>

        {/* ═══ DAILY NARRATIVE ARTICLE ═══
            articleBody comes from the daily-article generator which only
            ships en + hi; for non-en locales the prose is in hi script so
            we apply the Devanagari font for the whole 4-locale Devanagari
            family (hi/sa/mai/mr). Generator extension to 9 locales is a
            separate, larger concern. */}
        {articleBody && (
          <div className="mt-8 border-t border-gold-primary/15 pt-8">
            <div className="space-y-4 text-text-secondary text-sm leading-relaxed" style={isDevanagariLocale(loc) ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {articleBody.split('\n').map((line, i) => {
                if (line.startsWith('### ')) return <h3 key={i} className="text-gold-light font-bold text-lg mt-6 mb-2">{line.slice(4)}</h3>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-gold-primary text-xs uppercase tracking-widest font-bold mt-8 mb-3">{line.slice(3)}</h2>;
                if (line.startsWith('- **')) return <div key={i} className="flex gap-2"><span className="text-gold-dark">&#9670;</span><span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-light">$1</strong>') }} /></div>;
                if (line.startsWith('**')) return <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-light">$1</strong>') }} />;
                if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-text-secondary/60 text-xs italic mt-4" dangerouslySetInnerHTML={{ __html: line.slice(1, -1).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gold-primary hover:text-gold-light">$1</a>') }} />;
                if (line.trim() === '') return null;
                return <p key={i}>{line}</p>;
              })}
            </div>
          </div>
        )}
      </div>

      {/* ═══ EMAIL CTA (guests only) ═══ */}
      <div className="mb-10">
        <CrossSellCTA
          headline={CL('emailHeadline', locale)}
          subtext={CL('emailSubtext', locale)}
          buttonLabel={CL('emailButtonLabel', locale)}
          triggerAuth
        />
      </div>

      {/* Learn Vedic concepts — helpful-content signal + internal authority
          to /learn/* hub. Shared with /panchang root + /panchang/date. */}
      <LearnConceptsBlock locale={locale} />

      {/* ═══ OTHER CITIES ═══ */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gold-light mb-6 text-center">
            {msg('otherCities', locale)}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {popularCities.slice(0, 15).map(c => (
            <Link
              key={c.slug}
              href={`/${locale}/panchang/${c.slug}`}
              className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] px-4 py-3 text-center hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-all group"
            >
              <div className="text-gold-light text-sm font-medium group-hover:text-gold-primary transition-colors">
                {tl(c.name, locale)}
              </div>
              <div className="text-text-secondary/50 text-xs">{getStateLocale(c.state, locale)}</div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link
            href={`/${locale}/panchang`}
            className="text-gold-primary text-sm hover:text-gold-light transition-colors inline-flex items-center gap-1"
          >
            {msg('viewAllCities', locale)}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────

function PanchangCard({
  label,
  value,
  detail,
  gradient,
}: {
  label: string;
  value: string;
  detail: string;
  gradient: string;
}) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} border border-gold-primary/12 p-5`}>
      <div className="text-xs uppercase tracking-wider text-gold-dark font-bold mb-1">{label}</div>
      <div className="text-2xl font-bold text-gold-light mb-1">{value}</div>
      <div className="text-text-secondary text-xs">{detail}</div>
    </div>
  );
}

function InauspiciousCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 text-center ${colorClass}`}>
      <Clock size={20} className="mx-auto mb-2 opacity-70" />
      <div className="text-xs uppercase tracking-wider font-bold mb-1 opacity-80">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
