import { setRequestLocale } from 'next-intl/server';
import { getCityBySlug } from '@/lib/constants/cities';
import { ALL_FESTIVAL_DEFS, FESTIVAL_VALID_YEARS, type MuhurtaRule } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS, type FestivalDetail } from '@/lib/constants/festival-details-with-overlay';
import { type FestivalEntry } from '@/lib/calendar/festival-generator';
import { getFestivalForCity } from '@/lib/precompute/festivals-year-page-model';
import { formatMinutesHHMM } from '@/lib/astronomy/sunrise';
// Audit P5d #22: canonical Swiss+Meeus sunrise pipeline.
import { getSunriseSunsetLocalMinutes } from '@/lib/ephem/sunrise-sunset-local';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateFestivalEventLD } from '@/lib/seo/event-ld';
import { generateHowToLD } from '@/lib/seo/howto-ld';
import { computePersonalizedReading } from '@/lib/festivals/personalized-reading';
import { computeYearContext } from '@/lib/festivals/year-context';
import { FESTIVAL_ASTRO_FOCUS } from '@/lib/festivals/festival-astro-focus';
import { FESTIVAL_WISHES } from '@/lib/festivals/wishes';
import { FESTIVAL_OBSERVANCES } from '@/lib/festivals/observances';
import { findClusterForFestival } from '@/lib/festivals/festival-clusters';
import { HISTORICAL_FESTIVAL_DATES } from '@/lib/festivals/historical-dates';
import FestivalPersonalizedAccordion from '@/components/festivals/FestivalPersonalizedAccordion';
import FestivalWishesCarousel from '@/components/festivals/FestivalWishesCarousel';
import FestivalObservanceCards from '@/components/festivals/FestivalObservanceCards';
import FestivalClusterTimeline from '@/components/festivals/FestivalClusterTimeline';
import FestivalHistoricalArchive from '@/components/festivals/FestivalHistoricalArchive';
import AuthorByline from '@/components/ui/AuthorByline';
import type { Locale } from '@/types/panchang';
import type { PersonalizedFestivalReading } from '@/lib/festivals/types';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { tl } from '@/lib/utils/trilingual';
import { pickFestivalLabel as FL, formatFestivalLabel } from '@/lib/content/festivals-labels';
import { isDevanagariLocale, pickByLocale } from '@/lib/utils/locale-fonts';
import { getPujaVidhiBySlug } from '@/lib/constants/puja-vidhi-with-overlay';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Sun, Moon, ChevronRight, Info, BookOpen, Sparkles, Leaf, CheckCircle } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

import { BASE_URL } from '@/lib/seo/base-url';

// Top 6 cities for the multi-city muhurat table
const TABLE_CITY_SLUGS = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'pune'] as const;

// Imported from festival-defs to keep this list in sync with the
// bare-slug redirect (src/app/[locale]/festivals/[slug]/page.tsx) and the
// sitemap seeding.
const VALID_YEARS = FESTIVAL_VALID_YEARS as readonly number[];

// (TOP_FESTIVAL_SLUGS lives in festival-defs as the single source of truth
// for the sitemap + IndexNow cron; this page reads MAJOR_FESTIVALS instead.)

/** Human-readable names for Kala-Vyapti rules */
const RULE_LABELS: Record<MuhurtaRule, { en: string; hi: string }> = {
  sunrise:     { en: 'Udaya Tithi (Sunrise)', hi: 'उदय तिथि (सूर्योदय)' },
  pratah:      { en: 'Pratah Kaal (Morning)', hi: 'प्रातः काल' },
  madhyahna:   { en: 'Madhyahna (Midday)', hi: 'मध्याह्न' },
  aparahna:    { en: 'Aparahna (Afternoon)', hi: 'अपराह्न' },
  pradosh:     { en: 'Pradosh Kaal (Evening)', hi: 'प्रदोष काल' },
  nishita:     { en: 'Nishita Kaal (Midnight)', hi: 'निशीथ काल' },
  arunodaya:   { en: 'Arunodaya (Pre-dawn)', hi: 'अरुणोदय' },
  chandrodaya: { en: 'Chandrodaya (Moonrise)', hi: 'चन्द्रोदय' },
};

/** Detailed descriptions of each Kala-Vyapti rule */
const RULE_DESCRIPTIONS: Record<MuhurtaRule, { en: string; hi: string }> = {
  sunrise: {
    en: 'The tithi must prevail at sunrise. If the tithi spans two days, the day where it covers sunrise is chosen.',
    hi: 'सूर्योदय के समय तिथि व्याप्त होनी चाहिए। यदि तिथि दो दिनों में फैलती है, तो जिस दिन सूर्योदय पर व्याप्त हो वह दिन चुना जाता है।',
  },
  pradosh: {
    en: 'The tithi must prevail during Pradosh Kaal (evening twilight). This is the primary rule for festivals like Diwali and Dhanteras.',
    hi: 'प्रदोष काल (सन्ध्या समय) में तिथि व्याप्त होनी चाहिए। यह दीपावली और धनतेरस जैसे त्योहारों का प्रमुख नियम है।',
  },
  nishita: {
    en: 'The tithi must prevail during Nishita Kaal (midnight). Used for festivals like Maha Shivaratri and Janmashtami.',
    hi: 'निशीथ काल (मध्यरात्रि) में तिथि व्याप्त होनी चाहिए। महाशिवरात्रि और जन्माष्टमी जैसे त्योहारों के लिए प्रयुक्त।',
  },
  madhyahna: {
    en: 'The tithi must prevail at Madhyahna (midday). Used for festivals like Rama Navami and Ganesh Chaturthi.',
    hi: 'मध्याह्न (दोपहर) में तिथि व्याप्त होनी चाहिए। राम नवमी और गणेश चतुर्थी जैसे त्योहारों के लिए प्रयुक्त।',
  },
  aparahna: {
    en: 'The tithi must prevail during Aparahna (afternoon). Used for festivals like Dussehra.',
    hi: 'अपराह्न (दोपहर बाद) में तिथि व्याप्त होनी चाहिए। दशहरा जैसे त्योहारों के लिए प्रयुक्त।',
  },
  arunodaya: {
    en: 'The tithi must prevail at Arunodaya (96 minutes before sunrise). Used for Narak Chaturdashi and Ekadashi observance.',
    hi: 'अरुणोदय (सूर्योदय से 96 मिनट पहले) में तिथि व्याप्त होनी चाहिए। नरक चतुर्दशी और एकादशी व्रत के लिए प्रयुक्त।',
  },
  chandrodaya: {
    en: 'The tithi must prevail at Chandrodaya (moonrise). Used for Karva Chauth and Sankashti Chaturthi.',
    hi: 'चन्द्रोदय (चन्द्रमा उदय) के समय तिथि व्याप्त होनी चाहिए। करवा चौथ और संकष्टी चतुर्थी के लिए प्रयुक्त।',
  },
  pratah: {
    en: 'The tithi must prevail during Pratah Kaal (morning period after sunrise).',
    hi: 'प्रातः काल (सूर्योदय के बाद का प्रभात) में तिथि व्याप्त होनी चाहिए।',
  },
};

function formatDate(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const loc = locale === 'hi' || locale === 'sa' ? 'hi-IN' : 'en-US';
  return date.toLocaleDateString(loc, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}

// BCP 47 locale tag from app locale — covers all 10 supported languages
const LOCALE_TO_BCP47: Record<string, string> = {
  en: 'en-US', hi: 'hi-IN', sa: 'hi-IN', ta: 'ta-IN', bn: 'bn-IN',
  te: 'te-IN', kn: 'kn-IN', mr: 'mr-IN', gu: 'gu-IN', mai: 'hi-IN',
};

/** Returns just the weekday name for a YYYY-MM-DD string */
function getWeekday(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString(LOCALE_TO_BCP47[locale] || 'en-US', { weekday: 'long', timeZone: 'UTC' });
}

/** Returns "14 January" style date (no year, no weekday) for prominent display */
function formatDateShort(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString(LOCALE_TO_BCP47[locale] || 'en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function formatTimeHHMM(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** Format HH:MM 24h → "6:12 AM" 12h */
function fmt12h(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/** Explain why the festival falls on this date based on its Kala-Vyapti rule */
function getKalaExplanation(
  rule: MuhurtaRule,
  festivalNameEn: string,
  detail: FestivalDetail | undefined,
  locale: string,
): string {
  if (detail?.observationRule) {
    return tl(detail.observationRule, locale);
  }
  const ruleLabel = tl(RULE_LABELS[rule], locale);
  if (rule === 'sunrise') {
    return tl({
      en: `${festivalNameEn} follows the Udaya Tithi rule  –  the festival is observed on the day when the required tithi prevails at sunrise. This is the default Dharmasindhu convention for festivals without a special time-window requirement.`,
      hi: `${festivalNameEn} उदय तिथि नियम का पालन करता है  –  जिस दिन आवश्यक तिथि सूर्योदय के समय व्याप्त हो, उस दिन त्योहार मनाया जाता है। यह धर्मसिन्धु का सामान्य नियम है।`,
    }, locale);
  }
  return tl({
    en: `${festivalNameEn} follows the ${ruleLabel} rule. The tithi must be active during the ${ruleLabel} window for the festival to be observed on that day. When the tithi spans two calendar days, the Dharmasindhu tie-breaking rules determine the correct observance date.`,
    hi: `${festivalNameEn} ${ruleLabel} नियम का पालन करता है। त्योहार उस दिन मनाया जाता है जब तिथि ${ruleLabel} की अवधि में व्याप्त हो। जब तिथि दो दिनों में फैलती है तो धर्मसिन्धु के नियमों से सही तिथि निर्धारित होती है।`,
  }, locale);
}

/** Data for one city row in the multi-city table */
interface CityRow {
  slug: string;
  nameEn: string;
  nameLocale: string;
  date: string;
  sunrise: string;
  sunset: string;
  pujaMuhurat: { start: string; end: string; name: string } | null;
  tithi: string;
}

// ── Caching strategy ─────────────────────────────────────────────────
// ISR with 24h revalidation. Previously this page was `force-dynamic`
// because it called a `getUserGeoLocation` helper that read Vercel geo
// headers and prepended a "Your Location" row to the multi-city table.
// That made TTFB 2.7-3.3s in production (measured 2026-05-30) and put
// the whole festival cluster outside Google's fast-crawl-budget tier.
//
// Removing the per-request geo branch lets every festival page cache
// for 24h, which crawlers need. The visitor row added trivial visual
// personalisation but produced an SEO downside: SSR HTML varied per
// crawler IP, so canonical content was inconsistent across crawls.
// Removing it consolidates the SSR'd page to a stable set of 6
// reference cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Pune)
// with Delhi as the canonical headline. A client-side visitor row can
// be added later as a hydration-time enhancement without affecting
// indexed HTML.
//
// `generateStaticParams = []` is intentional — the route has a 5-year
// × 20-festival surface (100 URLs) and we don't want to pre-build all
// of them at build time (cf. CLAUDE.md static-page budget).
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export default async function FestivalCanonicalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; year: string }>;
}) {
  const { locale, slug, year: yearStr } = await params;
  setRequestLocale(locale);

  // Validate year
  const year = parseInt(yearStr, 10);
  if (isNaN(year) || !VALID_YEARS.includes(year)) notFound();

  // Look up the festival def. Previously this searched only MAJOR_FESTIVALS,
  // which silently 404'd for festivals defined in other arrays — including
  // `makar-sankranti` (in SOLAR_FESTIVALS). Since the slug appears in
  // TOP_FESTIVAL_SLUGS and is therefore submitted to IndexNow, the 404
  // was actively poisoning our IndexNow reputation. ALL_FESTIVAL_DEFS
  // covers every array (major + solar + regional + jain/sikh + etc.) so
  // any TOP_FESTIVAL_SLUGS addition resolves regardless of where it lives.
  const festivalDef = ALL_FESTIVAL_DEFS.find(f => f.slug === slug);
  if (!festivalDef) notFound();

  const detail = FESTIVAL_DETAILS[slug];
  if (!detail) notFound();

  const isHi = isDevanagariLocale(locale);
  const festivalNameEn = tl(detail.name, 'en');
  const festivalNameLocale = tl(detail.name, locale);
  const muhurtaRule: MuhurtaRule = festivalDef.muhurtaRule ?? 'sunrise';
  const ruleLabel = tl(RULE_LABELS[muhurtaRule], locale);

  // ── Compute data for each table city ──
  const cityRows: CityRow[] = [];
  // Run all 6 city lookups in parallel — each reads from the precomputed
  // Blob (fast, ~100ms) instead of generateFestivalCalendarV2 (90ms/833MB
  // × 6 = the 14s P75 observed in Vercel observability). All 6 TABLE_CITY_SLUGS
  // are in the 59-city precomputed set so Blob hits are expected.
  // Promise.allSettled so a single Blob read failure (network blip, storage
  // downtime) degrades to fewer table rows rather than a 500. Gemini PR #717 MED.
  const citySettled = await Promise.allSettled(
    TABLE_CITY_SLUGS.map(async (citySlug) => {
      const cityData = getCityBySlug(citySlug);
      if (!cityData) return null;
      const entry = await getFestivalForCity({ year, city: cityData, slug });
      return entry ? { citySlug, cityData, entry } : null;
    })
  );

  const cityEntries = citySettled.map((r) => {
    if (r.status === 'rejected') {
      console.error('[festivals/year] city lookup failed:', r.reason);
      return null;
    }
    return r.value;
  });

  for (const result of cityEntries) {
    if (!result) continue;
    const { citySlug, cityData, entry } = result;

    const [fy, fm, fd] = entry.date.split('-').map(Number);
    const tzOffset = getUTCOffsetForDate(fy, fm, fd, cityData.timezone);
    const sunTimes = getSunriseSunsetLocalMinutes(fy, fm, fd, cityData.lat, cityData.lng, tzOffset);

    cityRows.push({
      slug: citySlug,
      nameEn: cityData.name.en,
      nameLocale: isHi ? (tl(cityData.name, locale) || cityData.name.en) : cityData.name.en,
      date: entry.date,
      // tz-safe — formatMinutesHHMM reads the minute fields, not Date accessors.
      // formatTimeHHMM(Date) calls toLocaleTimeString which respects server tz
      // (Audit P0-15 follow-up.)
      sunrise: formatMinutesHHMM(sunTimes.sunriseMinutes),
      sunset: formatMinutesHHMM(sunTimes.sunsetMinutes),
      pujaMuhurat: entry.pujaMuhurat || null,
      tithi: entry.tithi || '',
    });
  }

  // If no cities returned data, the festival doesn't occur this year
  if (cityRows.length === 0) notFound();

  // The visitor-specific "Your Location" row that used to be prepended
  // here was removed to let the page become ISR-cacheable (see top-of-
  // file comment). Canonical SSR uses Delhi as the headline city.
  const refRow = cityRows[0];
  const festivalDate = refRow.date;
  const tithiStr = refRow.tithi;

  // Puja Vidhi data (if available for this festival)
  const pujaVidhi = getPujaVidhiBySlug(slug);

  // Kala explanation
  const kalaExplanation = getKalaExplanation(muhurtaRule, festivalNameEn, detail, locale);

  // ── JSON-LD: Event (extracted to src/lib/seo/event-ld.ts per spec §4E) ──
  const eventDescription = refRow.pujaMuhurat
    ? `${festivalNameEn} ${year}. Puja muhurta: ${refRow.pujaMuhurat.start}–${refRow.pujaMuhurat.end}. City-wise timings for ${cityRows.length}+ cities.`
    : `${festivalNameEn} on ${festivalDate}. City-wise sunrise, sunset & muhurta timings.`;

  const eventLD = generateFestivalEventLD({
    slug,
    year,
    festivalNameEn,
    festivalDate,
    description: eventDescription,
    baseUrl: BASE_URL,
  });

  // ── Personalized 12-rashi readings (server-rendered for SEO per spec §4A) ──
  // Bakes all 12 reads into the SSR HTML so search engines see them
  // without any client compute. Caller-provided festivalDate is the
  // canonical Kala-Vyapti-resolved festival day; the engine uses it for
  // the noon-UT planetary snapshot.
  const personalizedReadings: PersonalizedFestivalReading[] = FESTIVAL_ASTRO_FOCUS[slug]
    ? Array.from({ length: 12 }, (_, i) => computePersonalizedReading(slug, year, i + 1, festivalDate))
        .filter((r): r is PersonalizedFestivalReading => r !== null)
    : [];

  // ── JSON-LD: HowTo (new — wraps existing puja-vidhi data per spec §4D) ──
  // Returns null if no puja-vidhi exists for this slug; the script tag
  // below is conditionally rendered to handle that case. Cast to the
  // canonical Locale type — route params are typed as string but Next.js
  // routes only ever supply a valid Locale value (proxy 301-redirects
  // retired locales to /en/).
  const howToLD = generateHowToLD({
    festivalSlug: slug,
    locale: locale as Locale,
    baseUrl: BASE_URL,
  });

  // ── JSON-LD: BreadcrumbList ──
  const breadcrumbLD = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: FL('festivalsPlural', locale), item: `${BASE_URL}/${locale}/calendar` },
      { '@type': 'ListItem', position: 3, name: festivalNameLocale, item: `${BASE_URL}/${locale}/calendar/${slug}` },
      { '@type': 'ListItem', position: 4, name: String(year) },
    ],
  };

  // ── JSON-LD: FAQPage ──
  // FAQ expanded 2026-06-11 (SEO audit Item 7) from 4 stub answers
  // (shortest 41 chars: "Diwali is observed on ashwina krishna 15.") to
  // 8 answers averaging ~220 chars. Tithi-name proper-cased ("Ashwin
  // Krishna 15" instead of "ashwina krishna 15") on the way through.
  const tithiStrProper = tithiStr ? tithiStr.replace(/\b([a-z])([a-z]+)/g, (_, a, b) => a.toUpperCase() + b) : tithiStr;
  const ctxForFaq = (() => {
    try { return computeYearContext(slug, year, festivalDate); }
    catch { return null; }
  })();
  const faqLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `When is ${festivalNameEn} ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${festivalNameEn} ${year} falls on ${formatDate(festivalDate, 'en')}. The date is derived from the Vedic lunisolar calendar — specifically the ${ruleLabel} rule applied to ${tithiStrProper || 'the festival tithi'} — so it shifts year-on-year as the lunar months drift against the solar year. ${ctxForFaq?.previousYearDate ? `Last year (${year - 1}) it fell on ${ctxForFaq.previousYearDate}.` : ''}`,
        },
      },
      {
        '@type': 'Question',
        name: `What time is ${festivalNameEn} puja muhurat in ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: refRow.pujaMuhurat
            ? `The ${refRow.pujaMuhurat.name} muhurat in Delhi for ${festivalNameEn} ${year} runs from ${fmt12h(refRow.pujaMuhurat.start)} to ${fmt12h(refRow.pujaMuhurat.end)} (${refRow.nameEn}, India Standard Time). These timings are computed from this year's tithi-end clock and the city's sunset/sunrise — they're not lifted from a fixed table. For Mumbai, Bangalore, Kolkata and 50+ other Indian and international cities, see the city-wise muhurat table above on this page.`
            : `${festivalNameEn} observance follows the ${ruleLabel} rule for muhurat selection — the tithi must be present during the relevant time window (sunrise, midday, evening or midnight depending on the festival's central rite). Specific timings vary city-by-city; consult the table above.`,
        },
      },
      {
        '@type': 'Question',
        name: `What tithi is ${festivalNameEn} observed on?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: tithiStrProper
            ? `${festivalNameEn} is observed on ${tithiStrProper}. The tithi (lunar day) is the canonical anchor — the Gregorian date shifts each year, but the tithi assignment stays fixed. A tithi averages 23 hours 37 minutes (because the Moon advances 12° relative to the Sun, not 12° per solar day), so it almost always spans two Gregorian dates; the ${ruleLabel} rule picks which one.`
            : `${festivalNameEn} follows the ${ruleLabel} rule for tithi determination — the tithi must be present during the relevant time window of the chosen day for the festival to fall on that day.`,
        },
      },
      {
        '@type': 'Question',
        name: `Why is ${festivalNameEn} on a different date each year?`,
        acceptedAnswer: { '@type': 'Answer', text: kalaExplanation },
      },
      {
        '@type': 'Question',
        name: `What weekday does ${festivalNameEn} fall on in ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: ctxForFaq?.weekdayEn
            ? `${festivalNameEn} ${year} falls on a ${ctxForFaq.weekdayEn}. ${ctxForFaq.weekdayNoteEn} ${ctxForFaq.previousYearWeekdayEn ? `Last year (${year - 1}) it was a ${ctxForFaq.previousYearWeekdayEn};` : ''} ${ctxForFaq.nextYearWeekdayEn ? `next year (${year + 1}) it will be a ${ctxForFaq.nextYearWeekdayEn}.` : ''}`
            : `${festivalNameEn} ${year} falls on ${formatDate(festivalDate, 'en')}.`,
        },
      },
      {
        '@type': 'Question',
        name: `When was ${festivalNameEn} last year, and when is it next year?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: ctxForFaq?.previousYearDate || ctxForFaq?.nextYearDate
            ? `${ctxForFaq.previousYearDate ? `${festivalNameEn} ${year - 1} fell on ${ctxForFaq.previousYearDate}` : ''}${ctxForFaq.previousYearDate && ctxForFaq.nextYearDate ? `; ` : ''}${ctxForFaq.nextYearDate ? `${festivalNameEn} ${year + 1} will fall on ${ctxForFaq.nextYearDate}` : ''}. The Hindu lunisolar calendar runs ~11 days shorter than the Gregorian year, so most festivals shift earlier year-on-year; in Adhika-masa years (the intercalary 13th month inserted every 2-3 years) they jump ~19 days later instead.`
            : `${festivalNameEn} dates are computed from the lunisolar Vedic calendar; consult the festivals hub for the multi-year date table.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${festivalNameEn} ${year} a regional festival, or is it observed nationwide?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${festivalNameEn} is part of the pan-Indian Hindu festival calendar but its observance style varies by region — North India (the Holi/Diwali/Navratri stream), Bengal (the Durga Puja stream), Maharashtra (the Ganesh Chaturthi tradition), Tamil Nadu (the Pongal/Karthikai cluster) and Kerala (Onam) each contribute distinct regional vidhi. The date computed here applies pan-regionally to the lunar Hindu calendar — the rituals attached to that date differ by community.`,
        },
      },
      {
        '@type': 'Question',
        name: `How are ${festivalNameEn} ${year} timings computed for my city?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Each city's muhurat is derived from that city's exact sunrise, sunset and the tithi-end clock for ${festivalDate}, not from a fixed India-centric table. We compute sunrise and sunset via Swiss Ephemeris using the city's coordinates (latitude, longitude, altitude) and then apply the festival's classical muhurta rule (${ruleLabel}) to identify the auspicious window. Cities further east see earlier sunrise and thus earlier muhurat windows; cities at higher latitudes see broader daytime windows in summer.`,
        },
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(eventLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      {howToLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(howToLD) }} />
      )}

      {/* Visible breadcrumb — pairs with BreadcrumbList JSON-LD above. */}
      <Breadcrumb
        className="mb-6"
        items={[
          { href: '/', label: FL('crumbHome', locale) },
          { href: '/festivals', label: FL('crumbFestivals', locale) },
          { label: `${festivalNameLocale} ${year}` },
        ]}
      />

      {/* ── Quick Answer Box — "Position Zero" featured snippet target ── */}
      <div className="mb-8 rounded-2xl border-2 border-gold-primary/40 bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] p-6 sm:p-8 text-center space-y-3 shadow-[0_0_40px_rgba(212,168,83,0.08)]">
        <p className="text-gold-primary text-xs sm:text-sm uppercase tracking-[0.2em] font-bold">
          {festivalNameLocale} {year}
        </p>
        <p
          className="text-3xl sm:text-5xl font-black text-gold-light leading-tight"
          style={{ fontFamily: isHi ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
        >
          {formatDateShort(festivalDate, locale)}
        </p>
        <p className="text-xl sm:text-2xl text-text-primary font-semibold">
          {getWeekday(festivalDate, locale)}
        </p>
        {refRow.pujaMuhurat && (
          <p className="text-gold-primary text-sm sm:text-base font-medium">
            <Clock className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
            {refRow.pujaMuhurat.name}: {fmt12h(refRow.pujaMuhurat.start)} – {fmt12h(refRow.pujaMuhurat.end)}
            <span className="text-text-secondary ml-1 text-xs">({refRow.nameLocale})</span>
          </p>
        )}
        {(() => { const sig = tl(detail.significance, locale); return (
          <p className="text-text-secondary text-sm max-w-md mx-auto" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {sig.length > 150 ? `${sig.slice(0, 150)}...` : sig}
          </p>
        ); })()}
      </div>

      <article className="space-y-8">
        {/* ── Hero ── */}
        <div className="text-center space-y-3">
          <h1
            className="text-2xl sm:text-4xl font-bold text-gold-light leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {festivalNameLocale} {year}
          </h1>
          {/* Direct-answer paragraph — Google featured-snippet target.
              Lifts the year, exact weekday + date, and puja-muhurat window
              into the first ~45 words after H1 so the snippet bot doesn't
              have to dig past the H1 + cross-link buttons. 2026-06-11
              SEO audit Item G — hartalika teej 0.16% CTR, diwali puja
              0.21% CTR were both losing snippet capture to competing
              SERPs that lead with the answer. */}
          <p
            className="text-text-primary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
          >
            <strong className="text-gold-light">{festivalNameLocale} {year}</strong>
            {' '}{isHi ? 'का पर्व' : 'falls on'}{' '}
            <strong className="text-gold-light">{getWeekday(festivalDate, locale)}, {formatDate(festivalDate, locale)}</strong>
            {refRow.pujaMuhurat && (
              <>
                {'. '}{isHi ? `${refRow.pujaMuhurat.name} मुहूर्त` : `The ${refRow.pujaMuhurat.name} muhurat`}{' '}
                {isHi ? 'का समय' : 'is from'}{' '}
                <strong className="text-gold-light">{fmt12h(refRow.pujaMuhurat.start)} – {fmt12h(refRow.pujaMuhurat.end)}</strong>{' '}
                {isHi ? '(दिल्ली)' : '(Delhi)'}
              </>
            )}
            {tithiStr && (
              <>
                {'. '}{isHi ? 'तिथि' : 'Observed on'}: {tithiStr}
              </>
            )}
            {'.'}
          </p>
          <p className="text-text-secondary text-sm max-w-lg mx-auto" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {formatFestivalLabel('subtitleTemplate', locale, { NAME: festivalNameLocale, YEAR: String(year) })}
          </p>
          {/* Cross-links to core pages */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <a href={`/${locale}/panchang`} className="px-3 py-1 rounded-full text-xs border border-gold-primary/20 text-gold-dark hover:bg-gold-primary/10 transition-colors">
              {FL('linkTodaysPanchang', locale)}
            </a>
            <a href={`/${locale}/ekadashi`} className="px-3 py-1 rounded-full text-xs border border-gold-primary/20 text-gold-dark hover:bg-gold-primary/10 transition-colors">
              {FL('linkEkadashi2026', locale)}
            </a>
            <a href={`/${locale}/muhurta-ai`} className="px-3 py-1 rounded-full text-xs border border-gold-primary/20 text-gold-dark hover:bg-gold-primary/10 transition-colors">
              {FL('linkFindMuhurta', locale)}
            </a>
            <a href={`/${locale}/kundali`} className="px-3 py-1 rounded-full text-xs border border-gold-primary/20 text-gold-dark hover:bg-gold-primary/10 transition-colors">
              {FL('linkGenerateKundali', locale)}
            </a>
          </div>
        </div>

        <div className="border-t border-gold-primary/15" />

        {/* ── Key Data Card ── */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border border-gold-primary/12 p-5 sm:p-6 space-y-4">
          <h2 className="text-gold-light font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <Calendar className="w-5 h-5 text-gold-primary" />
            {FL('keyInformation', locale)}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Festival Date */}
            <div className="bg-gold-primary/5 rounded-xl p-4 border border-gold-primary/10">
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                {FL('festivalDate', locale)}
              </p>
              <p className="text-gold-light font-bold text-lg" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {formatDate(festivalDate, locale)}
              </p>
            </div>

            {/* Puja Muhurta — visitor's city if geo resolved, else Delhi */}
            {refRow.pujaMuhurat && (
              <div className="bg-gold-primary/5 rounded-xl p-4 border border-gold-primary/10">
                <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                  {refRow.pujaMuhurat.name} ({refRow.nameLocale})
                </p>
                <p className="text-gold-light font-bold text-lg">
                  <Clock className="inline-block w-4 h-4 mr-1 -mt-0.5 text-gold-primary" />
                  {fmt12h(refRow.pujaMuhurat.start)} – {fmt12h(refRow.pujaMuhurat.end)}
                </p>
              </div>
            )}
          </div>

          {/* Tithi Info */}
          {tithiStr && (
            <div className="text-text-secondary text-sm">
              <span className="text-gold-primary font-medium">{FL('tithi', locale)}:</span>{' '}
              {tithiStr}
            </div>
          )}

          {/* Observation Rule Badge */}
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Info className="w-3.5 h-3.5 text-gold-dark" />
            <span>{FL('observationRule', locale)}: <span className="text-gold-primary font-medium">{ruleLabel}</span></span>
          </div>
        </div>

        {/* ── Year Context (audit item #5 — closes festival year-variant
             thin-content risk by surfacing year-specific computed facts:
             weekday this year, lunar drift from previous year, Hindu
             calendar year markers) ── */}
        {(() => {
          const ctx = computeYearContext(slug, year, festivalDate);
          if (ctx.weekday < 0) return null;
          // Locale-aware weekday label. ICU is the only way to get correct
          // non-Hindi Indic weekday spellings without a hand-rolled table.
          const fullDateObj = new Date(festivalDate + 'T00:00:00Z');
          const weekdayLoc = (() => {
            const tag = locale === 'mr' ? 'mr-IN'
              : locale === 'hi' || locale === 'mai' ? 'hi-IN'
              : pickByLocale({ en: 'en-US', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', gu: 'gu-IN', kn: 'kn-IN' }, locale);
            return fullDateObj.toLocaleDateString(tag, { weekday: 'long', timeZone: 'UTC' });
          })();
          const driftSentence = (() => {
            if (ctx.driftFromPreviousYear == null || ctx.previousYearDate == null) return null;
            const d = ctx.driftFromPreviousYear;
            const abs = Math.abs(d);
            // Skip insignificant drifts (≤2 days, mostly solar festivals
            // like Makar Sankranti that don't move year-on-year).
            if (abs < 3) return null;
            const direction = d < 0 ? 'earlier' : 'later';
            return tl({
              en: `This year ${festivalNameEn} falls on a ${ctx.weekdayEn}, ${abs} days ${direction} than ${year - 1} (${ctx.previousYearDate}) — typical lunar-calendar drift.`,
              hi: `इस वर्ष ${festivalNameLocale} ${weekdayLoc} को पड़ रहा है, ${year - 1} (${ctx.previousYearDate}) से ${abs} दिन ${d < 0 ? 'पहले' : 'बाद'} — सामान्य चन्द्र-पंचांग बदलाव।`,
            }, locale);
          })();
          return (
            <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] rounded-2xl border border-gold-primary/10 p-5 sm:p-6 space-y-3">
              <h2 className="text-gold-light font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                <Calendar className="w-5 h-5 text-gold-primary" />
                {formatFestivalLabel('yearCalendarContextTemplate', locale, { YEAR: String(year) })}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-gold-primary/5 rounded-xl p-3 border border-gold-primary/10">
                  <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                    {FL('weekday', locale)}
                  </p>
                  <p className="text-gold-light font-bold" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {weekdayLoc}
                  </p>
                </div>
                <div className="bg-gold-primary/5 rounded-xl p-3 border border-gold-primary/10">
                  <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                    {FL('vikramSamvat', locale)}
                  </p>
                  <p className="text-gold-light font-bold">{ctx.vikramSamvat}</p>
                </div>
                <div className="bg-gold-primary/5 rounded-xl p-3 border border-gold-primary/10">
                  <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                    {FL('shakaSamvat', locale)}
                  </p>
                  <p className="text-gold-light font-bold">{ctx.shakaSamvat}</p>
                </div>
              </div>
              {driftSentence && (
                <p className="text-text-primary/80 text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {driftSentence}
                </p>
              )}
              {/* Year-specific prose block — drops YoY duplicate-content
                  exposure (Item 6 of 2026-06-11 SEO audit found 89%
                  byte-identical sentences between /diwali/2026 and /2027
                  because the templated mythology/vidhi blocks dominate;
                  computeYearContext now returns enough year-varying data
                  to compose ~100-120 words of demonstrably different
                  prose per year). EN-only — Google reads this for the
                  duplicate-content signal regardless of locale. */}
              {ctx.weekdayNoteEn && (
                <div className="border-t border-gold-primary/10 pt-3 mt-3 space-y-2">
                  <p className="text-text-primary/85 text-sm leading-relaxed">
                    <span className="text-gold-light font-medium">{ctx.weekdayNoteEn}</span>
                  </p>
                  {(ctx.previousYearDate && ctx.previousYearWeekdayEn) && (
                    <p className="text-text-primary/75 text-sm leading-relaxed">
                      The {year - 1} observance fell on {ctx.previousYearWeekdayEn}, {ctx.previousYearDate}
                      {ctx.driftFromPreviousYear != null && Math.abs(ctx.driftFromPreviousYear) >= 3 ? (
                        <>{` — `}this year arrives {Math.abs(ctx.driftFromPreviousYear)} days {ctx.driftFromPreviousYear > 0 ? 'later' : 'earlier'} in the Gregorian calendar, the {Math.abs(ctx.driftFromPreviousYear) >= 18 ? 'Adhika-masa pattern when an intercalary lunar month pushes the cycle forward' : 'familiar 11-day shift of the unmodified lunar year'}.</>
                      ) : '.'}
                    </p>
                  )}
                  {(ctx.nextYearDate && ctx.nextYearWeekdayEn) && (
                    <p className="text-text-primary/75 text-sm leading-relaxed">
                      Looking ahead to {year + 1}, {festivalNameEn} will fall on {ctx.nextYearWeekdayEn}, {ctx.nextYearDate}
                      {ctx.driftToNextYear != null && Math.abs(ctx.driftToNextYear) >= 3 ? (
                        <>{` (`}{Math.abs(ctx.driftToNextYear)} days {ctx.driftToNextYear > 0 ? 'later' : 'earlier'} than this year)</>
                      ) : ''}
                      {`. `}So planning ritual schedules across years means anchoring to the tithi rather than the Gregorian date.
                    </p>
                  )}
                  {refRow.pujaMuhurat && (
                    <p className="text-text-primary/75 text-sm leading-relaxed">
                      The {year} {refRow.pujaMuhurat.name} window in Delhi runs from {fmt12h(refRow.pujaMuhurat.start)} to {fmt12h(refRow.pujaMuhurat.end)} — these timings are year-specific because they're derived from the tithi-end clock and sunset/sunrise at this date, not a fixed table; other Indian cities shift by ±10-30 minutes from the Delhi reference.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Year-specific astronomical context block (PR A round 2)
             —————————————————————————————————————————————————————————
             Adds 5-7 sentences of year-uniquely-computed prose per
             festival page. The data — sunrise/sunset times at the 6
             canonical cities, daylight span across the country, puja
             muhurat window length — all comes from cityRows which is
             already computed earlier in the page. Each piece varies
             year-on-year because sunrise drifts ~3-4 minutes per year
             at a given Gregorian date due to Earth's orbital geometry,
             and the puja muhurat clock is anchored to the year-specific
             tithi-end time.
             EN-only — Google reads it for the duplicate-content signal
             regardless of locale; non-EN visitors see the same English
             text alongside the localised tables. 2026-06-11 SEO audit
             Item 6 round 2: round 1 dropped Diwali 26/27 byte-overlap
             89% → 82%; this block targets <70% by adding more genuinely
             year-varying prose. */}
        {(() => {
          const sortedBySunrise = [...cityRows]
            .filter(r => r.sunrise && r.sunset)
            .sort((a, b) => a.sunrise.localeCompare(b.sunrise));
          if (sortedBySunrise.length < 2) return null;
          const earliestSunrise = sortedBySunrise[0];
          const latestSunrise = sortedBySunrise[sortedBySunrise.length - 1];
          // Daylight span in minutes — converts HH:MM to minutes
          const hhmmToMin = (s: string) => {
            const [h, m] = s.split(':').map(Number);
            return (h ?? 0) * 60 + (m ?? 0);
          };
          const refRowDaylight = refRow.sunrise && refRow.sunset ? hhmmToMin(refRow.sunset) - hhmmToMin(refRow.sunrise) : null;
          const daylightHours = refRowDaylight != null ? Math.floor(refRowDaylight / 60) : null;
          const daylightMins = refRowDaylight != null ? refRowDaylight % 60 : null;
          const citiesWithMuhurat = cityRows.filter(r => r.pujaMuhurat);
          const muhuratStartMins = citiesWithMuhurat
            .map(r => r.pujaMuhurat && hhmmToMin(r.pujaMuhurat.start))
            .filter((v): v is number => v !== null && v !== undefined);
          const earliestMuhurat = citiesWithMuhurat.find(r => r.pujaMuhurat && hhmmToMin(r.pujaMuhurat.start) === Math.min(...muhuratStartMins));
          const latestMuhurat = citiesWithMuhurat.find(r => r.pujaMuhurat && hhmmToMin(r.pujaMuhurat.start) === Math.max(...muhuratStartMins));
          const muhuratSpanMins = muhuratStartMins.length >= 2 ? Math.max(...muhuratStartMins) - Math.min(...muhuratStartMins) : null;
          return (
            <div className="bg-gradient-to-br from-[#1a1040]/30 via-[#0d1130]/40 to-[#0a0e27] rounded-2xl border border-gold-primary/10 p-5 sm:p-6 space-y-3">
              <h2 className="text-gold-light font-bold text-base sm:text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                <Sun className="w-5 h-5 text-amber-400" />
                Astronomical context for {festivalNameEn} {year}
              </h2>
              <p className="text-text-primary/85 text-sm leading-relaxed">
                On {formatDate(festivalDate, 'en')}, sunrise in Delhi (the reference city for this page) falls at {refRow.sunrise} IST and sunset at {refRow.sunset} IST{daylightHours != null && daylightMins != null && ` — a daylight span of ${daylightHours}h ${daylightMins}m`}. Across the six pan-Indian cities tabulated below, sunrise on this date varies from {earliestSunrise.sunrise} ({earliestSunrise.nameEn}) at the eastern edge to {latestSunrise.sunrise} ({latestSunrise.nameEn}) in the west — a {hhmmToMin(latestSunrise.sunrise) - hhmmToMin(earliestSunrise.sunrise)}-minute difference that drives the city-by-city muhurat shift you see in the table.
              </p>
              {refRow.pujaMuhurat && earliestMuhurat?.pujaMuhurat && latestMuhurat?.pujaMuhurat && muhuratSpanMins != null && (
                <p className="text-text-primary/85 text-sm leading-relaxed">
                  The {refRow.pujaMuhurat.name.toLowerCase()} window for {festivalNameEn} {year} opens earliest at {earliestMuhurat.pujaMuhurat.start} in {earliestMuhurat.nameEn} and latest at {latestMuhurat.pujaMuhurat.start} in {latestMuhurat.nameEn}{muhuratSpanMins >= 1 && ` — a ${muhuratSpanMins}-minute spread driven by each city's sunset clock`}. These windows are tied to {tithiStrProper || 'the festival tithi'}'s exact end-time, not a fixed muhurat table; in a year where the tithi ends earlier in the local day the window narrows accordingly.
                </p>
              )}
              {detail.observance && (
                <p className="text-text-primary/75 text-sm leading-relaxed">
                  For {festivalNameEn} {year}, the central rite of {refRow.pujaMuhurat ? `${refRow.pujaMuhurat.name.toLowerCase()} observance` : ruleLabel.toLowerCase()} depends on the {tithiStrProper || 'festival tithi'} being present during that window on {festivalDate} — confirmed across {citiesWithMuhurat.length || cityRows.length} reference cities in this year's computation pass. Cities further east (Kolkata, Chennai) see the window open ~15-25 minutes before Delhi; cities west of Delhi (Mumbai, Pune, Bangalore) see it start later by a similar margin.
                </p>
              )}
            </div>
          );
        })()}

        {/* ── Multi-City Muhurat Table ── */}
        <div className="space-y-3">
          <h2 className="text-gold-light font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <MapPin className="w-5 h-5 text-gold-primary" />
            {tl({
              en: `City-Wise Timings for ${festivalNameEn} ${year}`,
              hi: `${festivalNameLocale} ${year} — शहर-वार समय`,
            }, locale)}
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27]">
                  <th className="text-left px-4 py-3 text-gold-primary font-bold text-xs uppercase tracking-wider">
                    {FL('city', locale)}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-primary font-bold text-xs uppercase tracking-wider">
                    <Sun className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5 text-amber-400" />
                    {FL('sunrise', locale)}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-primary font-bold text-xs uppercase tracking-wider">
                    <Moon className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5 text-orange-400" />
                    {FL('sunset', locale)}
                  </th>
                  {cityRows.some(r => r.pujaMuhurat) && (
                    <th className="text-left px-4 py-3 text-gold-primary font-bold text-xs uppercase tracking-wider">
                      <Clock className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5" />
                      {FL('pujaMuhurat', locale)}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-primary/8">
                {cityRows.map((row) => (
                  <tr key={row.slug} className="hover:bg-gold-primary/5 transition-colors">
                    <td className="px-4 py-3">
                      {/* City names are no longer linked — the per-city
                          variant pages were retired (308 → year page).
                          This year page IS the canonical surface. */}
                      <span
                        className="text-gold-light font-medium"
                        style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                      >
                        {row.nameLocale}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{fmt12h(row.sunrise)}</td>
                    <td className="px-4 py-3 text-text-secondary">{fmt12h(row.sunset)}</td>
                    {cityRows.some(r => r.pujaMuhurat) && (
                      <td className="px-4 py-3 text-gold-light font-medium">
                        {row.pujaMuhurat
                          ? `${fmt12h(row.pujaMuhurat.start)} – ${fmt12h(row.pujaMuhurat.end)}`
                          : <span className="text-text-secondary/50">–</span>
                        }
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* ── Personalized 12-rashi accordion (spec §4A — section slot #3) ── */}
        {personalizedReadings.length === 12 && (
          <FestivalPersonalizedAccordion
            readings={personalizedReadings}
            festivalNameEn={festivalNameEn}
            festivalNameHi={tl(detail.name, 'hi')}
            year={year}
            festivalSlug={slug}
            locale={locale as Locale}
          />
        )}

        {/* ── Do's & Don'ts (spec §4C — section slot #5) ── */}
        {FESTIVAL_OBSERVANCES[slug] && (
          <FestivalObservanceCards
            observance={FESTIVAL_OBSERVANCES[slug]}
            festivalNameEn={festivalNameEn}
            festivalNameHi={tl(detail.name, 'hi')}
            locale={locale as Locale}
          />
        )}

        {/* ── Wishes & greetings carousel (spec §4B — section slot #7) ── */}
        {FESTIVAL_WISHES[slug] && FESTIVAL_WISHES[slug].length > 0 && (
          <FestivalWishesCarousel
            wishes={FESTIVAL_WISHES[slug]}
            festivalNameEn={festivalNameEn}
            festivalNameHi={tl(detail.name, 'hi')}
            year={year}
            locale={locale as Locale}
          />
        )}

        {/* ── Cluster timeline (spec §4F — section slot #8) ── */}
        {(() => {
          const found = findClusterForFestival(slug);
          if (!found) return null;
          return (
            <FestivalClusterTimeline
              cluster={found.cluster}
              currentSlug={slug}
              year={year}
              locale={locale as Locale}
            />
          );
        })()}

        {/* ── Historical archive 2020-2030 (spec §4G — section slot #9) ── */}
        {HISTORICAL_FESTIVAL_DATES[slug] && (
          <FestivalHistoricalArchive
            slug={slug}
            festivalNameEn={festivalNameEn}
            festivalNameHi={tl(detail.name, 'hi')}
            currentYear={year}
            historicalDates={HISTORICAL_FESTIVAL_DATES[slug]}
            futureYears={FESTIVAL_VALID_YEARS}
            locale={locale as Locale}
          />
        )}

        {/* ── "Why This Date?" Section ── */}
        <div className="space-y-3">
          <h2 className="text-gold-light font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {FL('whyThisDate', locale)}
          </h2>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-xl border border-gold-primary/12 p-4">
            <p className="text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {kalaExplanation}
            </p>
          </div>
        </div>

        {/* ── Tithi Determination Rule ── */}
        {festivalDef.muhurtaRule && (
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border-2 border-gold-primary/30 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-primary" />
              <h2 className="text-gold-light font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                {FL('tithiDeterminationRule', locale)}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gold-primary/15 border border-gold-primary/25 text-gold-light text-xs font-bold uppercase tracking-wider">
                {ruleLabel}
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl(RULE_DESCRIPTIONS[muhurtaRule], locale)}
            </p>
            <p className="text-text-secondary/60 text-xs italic" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl({
                en: 'Source: Dharmasindhu & Nirnayasindhu  –  classical Kala-Vyapti system',
                hi: 'स्रोत: धर्मसिन्धु एवं निर्णयसिन्धु  –  शास्त्रीय काल-व्याप्ति पद्धति',
              }, locale)}
            </p>
          </div>
        )}

        {/* ── Puja Vidhi Preview ── */}
        {pujaVidhi && (
          <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl border border-purple-500/20 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h2 className="text-gold-light font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                {FL('pujaVidhi', locale)}
              </h2>
            </div>

            {/* Samagri preview */}
            {pujaVidhi.samagri.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-purple-300 text-xs uppercase tracking-widest font-bold">
                  {FL('materialsRequired', locale)}
                </h3>
                <ul className="space-y-1.5">
                  {pujaVidhi.samagri.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-text-secondary text-sm" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      <CheckCircle className="w-3.5 h-3.5 text-purple-400/70 flex-shrink-0" />
                      <span>{tl(item.name, locale)}</span>
                      {item.quantity && <span className="text-text-secondary/50 text-xs">({item.quantity})</span>}
                    </li>
                  ))}
                </ul>
                {pujaVidhi.samagri.length > 5 && (
                  <Link
                    href={`/${locale}/puja/${slug}`}
                    className="inline-flex items-center gap-1 text-purple-400 text-xs font-medium hover:text-purple-300 transition-colors"
                  >
                    {tl({
                      en: `See all ${pujaVidhi.samagri.length} items`,
                      hi: `सभी ${pujaVidhi.samagri.length} सामग्री देखें`,
                    }, locale)} <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            )}

            {/* Vidhi steps preview */}
            {pujaVidhi.vidhiSteps.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-purple-300 text-xs uppercase tracking-widest font-bold">
                  {FL('pujaSteps', locale)}
                </h3>
                <ol className="space-y-2">
                  {pujaVidhi.vidhiSteps.slice(0, 3).map((step) => (
                    <li key={step.step} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {step.step}
                      </span>
                      <div>
                        <p className="text-gold-light text-sm font-medium" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {tl(step.title, locale)}
                        </p>
                        <p className="text-text-secondary text-xs leading-relaxed mt-0.5" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {tl(step.description, locale).slice(0, 120)}{tl(step.description, locale).length > 120 ? '...' : ''}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* CTA to full puja page */}
            <Link
              href={`/${locale}/puja/${slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-300 font-medium text-sm hover:bg-purple-500/25 hover:text-purple-200 transition-colors"
            >
              {tl({
                en: 'View Complete Puja Guide',
                hi: 'पूर्ण पूजा विधि देखें',
              }, locale)} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ── Vrat Phala (Benefits) ── */}
        {(() => {
          const phalaText = pujaVidhi?.phala ? tl(pujaVidhi.phala, locale) : null;
          if (!phalaText) return null;
          const isVrat = detail.isFast === true;
          return (
            <div className="bg-emerald-500/5 rounded-2xl border-2 border-emerald-500/20 p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <h2 className="text-gold-light font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                  {isVrat
                    ? FL('vratPhalaFastingBenefits', locale)
                    : FL('phalaBenefits', locale)
                  }
                </h2>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {phalaText}
              </p>
            </div>
          );
        })()}

        {/* ── Festival Details ── */}
        <div className="space-y-5">
          {/* Deity */}
          {detail.deity && (
            <div className="flex items-center gap-3 bg-gold-primary/5 rounded-xl p-4 border border-gold-primary/10">
              <div className="w-10 h-10 rounded-full bg-gold-primary/15 flex items-center justify-center text-gold-light font-bold text-lg">
                {tl(detail.deity, locale).charAt(0)}
              </div>
              <div>
                <p className="text-text-secondary text-xs uppercase tracking-wider">{FL('deity', locale)}</p>
                <p className="text-gold-light font-medium" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(detail.deity, locale)}
                </p>
              </div>
            </div>
          )}

          {/* Legend & History */}
          <div>
            <h2 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
              {FL('legendHistory', locale)}
            </h2>
            {(() => {
              // Long-form mythology may have '\n\n' paragraph breaks (added
              // for the canonical festivals in PR #300 + #304). Summary is
              // the first paragraph or first 200 chars, whichever is shorter;
              // full body is paragraph-split for readability. See CLAUDE.md
              // lesson ZA — same renderer pattern as CalendarSlugClient and
              // FestivalDetailModal.
              const full = tl(detail.mythology, locale);
              const paragraphs = full.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
              const firstBreak = full.indexOf('\n\n');
              const summary = firstBreak > -1 && firstBreak < 200
                ? full.slice(0, firstBreak)
                : full.length > 200 ? full.slice(0, 200) + '…' : full;
              const needsExpand = full.length > 200 || paragraphs.length > 1;
              const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
              if (!needsExpand) {
                return (
                  <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>{full}</p>
                );
              }
              return (
                <details className="group">
                  <summary className="text-text-secondary text-sm leading-relaxed cursor-pointer list-none" style={bodyFont}>
                    {/* Collapsed: show summary + "Read full →".
                        Expanded: hide summary (full body below already
                        repeats it) + show "Show less ↑". Prevents the
                        first paragraph being rendered twice (Gemini
                        feedback on PR #304). */}
                    <span className="group-open:hidden">
                      {summary}
                      <span className="text-gold-primary text-xs font-medium ml-1">
                        {' '}{FL('readFullLegend', locale)}
                      </span>
                    </span>
                    <span className="hidden group-open:inline text-gold-primary text-xs font-medium">
                      {FL('showLessUp', locale)}
                    </span>
                  </summary>
                  <div className="space-y-2 text-text-secondary text-sm leading-relaxed mt-2" style={bodyFont}>
                    {paragraphs.map((p, i) => (<p key={i}>{p}</p>))}
                  </div>
                </details>
              );
            })()}
          </div>

          {/* Observance */}
          <div>
            <h2 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
              {FL('howToObserve', locale)}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl(detail.observance, locale)}
            </p>
          </div>

          {/* Significance */}
          <div>
            <h2 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
              {FL('significance', locale)}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl(detail.significance, locale)}
            </p>
          </div>

          {/* Fasting Note */}
          {detail.isFast && detail.fastNote && (
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
              <p className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-1">
                {FL('fasting', locale)}
              </p>
              <p className="text-text-secondary text-sm" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {tl(detail.fastNote, locale)}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gold-primary/15" />

        {/* ── Year Navigation ── */}
        <div>
          <h2 className="text-gold-light font-bold text-lg mb-4 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({
              en: `${festivalNameEn}  –  Other Years`,
              hi: `${festivalNameLocale}  –  अन्य वर्ष`,
            }, locale)}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {VALID_YEARS.map(y => (
              <Link
                key={y}
                href={`/${locale}/festivals/${slug}/${y}`}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  y === year
                    ? 'bg-gold-primary/20 border-gold-primary/40 text-gold-light'
                    : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Next Year Cross-Link — captures forward-looking searches ── */}
        {(() => {
          const nextYear = year + 1;
          const hasNextYear = VALID_YEARS.includes(nextYear);
          if (!hasNextYear) return null;
          return (
            <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] rounded-xl border border-gold-primary/15 p-5 text-center space-y-2">
              <p className="text-text-secondary text-sm" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {tl({
                  en: `Looking for ${festivalNameEn} ${nextYear}?`,
                  hi: `${festivalNameLocale} ${nextYear} खोज रहे हैं?`,
                }, locale)}
              </p>
              <Link
                href={`/${locale}/festivals/${slug}/${nextYear}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/25 text-gold-light font-bold text-sm hover:bg-gold-primary/20 hover:border-gold-primary/40 transition-colors"
              >
                {tl({
                  en: `${festivalNameEn} ${nextYear} Date & Muhurat`,
                  hi: `${festivalNameLocale} ${nextYear} तिथि व मुहूर्त`,
                }, locale)}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })()}

        {/* ── Learn More Links ── */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text-secondary text-xs">{FL('learnMore', locale)}:</span>
          <Link
            href={`/${locale}/learn/festival-rules`}
            className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
          >
            {FL('festivalTimingRules', locale)}
          </Link>
          <Link
            href={`/${locale}/learn/tithis`}
            className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
          >
            {FL('understandingTithis', locale)}
          </Link>
          <Link
            href={`/${locale}/learn/masa`}
            className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
          >
            {FL('lunarMonthsExplained', locale)}
          </Link>
        </div>

        {/* ── CTA ── */}
        <div className="text-center space-y-3 pt-4">
          <Link
            href={`/${locale}/calendar/${slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light font-bold text-sm hover:bg-gold-primary/25 transition-colors"
          >
            {tl({
              en: `View Full ${festivalNameEn} Details`,
              hi: `पूर्ण ${festivalNameLocale} विवरण देखें`,
            }, locale)}
          </Link>
          <br />
          <Link
            href={`/${locale}/calendar`}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-gold-primary text-sm hover:text-gold-light transition-colors"
          >
            {FL('viewAllFestivalsVrats', locale)}
          </Link>
        </div>

        {/*
          2026-06-01 E-E-A-T pass — festival pages are top-impression
          surfaces with low CTR. Named author improves both rich-result
          eligibility and Google's per-page E-E-A-T classifier signal.
          See docs/specs/2026-06-01-eeat-author-credentials.md.
        */}
        <AuthorByline />
      </article>
    </div>
  );
}
