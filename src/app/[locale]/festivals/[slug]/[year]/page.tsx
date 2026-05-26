import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { CITIES, getCityBySlug } from '@/lib/constants/cities';
import { MAJOR_FESTIVALS, FESTIVAL_VALID_YEARS, TOP_FESTIVAL_SLUGS, type MuhurtaRule } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS, type FestivalDetail } from '@/lib/constants/festival-details';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { clearTithiTableCache } from '@/lib/calendar/tithi-table';
import { getSunTimes, formatMinutesHHMM } from '@/lib/astronomy/sunrise';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { getUTCOffsetForDate, isValidTimezone } from '@/lib/utils/timezone';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { getPujaVidhiBySlug } from '@/lib/constants/puja-vidhi';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Sun, Moon, ChevronRight, Info, BookOpen, Sparkles, Leaf, CheckCircle } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

// Top 6 cities for the multi-city muhurat table
const TABLE_CITY_SLUGS = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'pune'] as const;

// Imported from festival-defs to keep this list in sync with the
// bare-slug redirect (src/app/[locale]/festivals/[slug]/page.tsx) and the
// sitemap seeding.
const VALID_YEARS = FESTIVAL_VALID_YEARS as readonly number[];

// TOP_FESTIVAL_SLUGS now imported from festival-defs (single source of truth
// — Audit 2026-05-25 §D7). Local copy removed; was drifting from the sitemap copy.

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

// Force dynamic — page reads Vercel geo from the request to render the
// headline puja time for the visitor's location, not Delhi. ISR is
// incompatible with per-request header reads; we accept the per-request
// render cost in exchange for correct localised puja timings. Roughly
// 500 ms per render vs 5 ms cached, but festival pages aren't yet
// high-volume enough for the cache to matter more than correctness. If
// this becomes a bottleneck, the right path is a client-side
// localisation widget that swaps headline times after hydration while
// keeping ISR on the server-rendered canonical version.
export const dynamic = 'force-dynamic';

/**
 * Reads Vercel geo headers to resolve the visitor's lat/lng/timezone.
 * Returns null on local dev (no headers) or when geo is unavailable —
 * caller falls back to Delhi as the historical default.
 */
async function getUserGeoLocation(): Promise<{
  lat: number;
  lng: number;
  city: string;
  timezone: string;
} | null> {
  try {
    const hdrs = await headers();
    const latRaw = hdrs.get('x-vercel-ip-latitude');
    const lngRaw = hdrs.get('x-vercel-ip-longitude');
    const cityRaw = hdrs.get('x-vercel-ip-city');
    const countryRaw = hdrs.get('x-vercel-ip-country');
    const tzRaw = hdrs.get('x-vercel-ip-timezone');
    if (!latRaw || !lngRaw) return null;
    const lat = parseFloat(latRaw);
    const lng = parseFloat(lngRaw);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    // decodeURIComponent throws URIError on malformed percent-encoding;
    // fall back to the raw header rather than losing the whole geo block.
    let cityDecoded = '';
    if (cityRaw) {
      try {
        cityDecoded = decodeURIComponent(cityRaw);
      } catch {
        cityDecoded = cityRaw;
      }
    }
    const cityName = [cityDecoded, countryRaw || ''].filter(Boolean).join(', ');

    // Validate timezone before passing it to date-math — an invalid /
    // spoofed value (e.g. 'Garbage/Tz') reaches Intl.DateTimeFormat
    // downstream and throws, returning a 500 to the visitor.
    const timezone = tzRaw && isValidTimezone(tzRaw) ? tzRaw : 'UTC';

    return {
      lat,
      lng,
      // Empty when geo had no city header — caller localises the fallback.
      city: cityName,
      timezone,
    };
  } catch {
    return null;
  }
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

  // Find festival definition
  const festivalDef = MAJOR_FESTIVALS.find(f => f.slug === slug);
  if (!festivalDef) notFound();

  const detail = FESTIVAL_DETAILS[slug];
  if (!detail) notFound();

  const isHi = isDevanagariLocale(locale);
  const festivalNameEn = tl(detail.name, 'en');
  const festivalNameLocale = tl(detail.name, locale);
  const muhurtaRule = festivalDef.muhurtaRule || 'sunrise';
  const ruleLabel = tl(RULE_LABELS[muhurtaRule], locale);

  // ── Compute data for each table city ──
  const cityRows: CityRow[] = [];
  for (const citySlug of TABLE_CITY_SLUGS) {
    const cityData = getCityBySlug(citySlug);
    if (!cityData) continue;

    const festivals = generateFestivalCalendarV2(year, cityData.lat, cityData.lng, cityData.timezone);
    clearTithiTableCache(); // Free memory — tithi table is large

    const entry = festivals.find(f => f.slug === slug);
    if (!entry) continue;

    const [fy, fm, fd] = entry.date.split('-').map(Number);
    const tzOffset = getUTCOffsetForDate(fy, fm, fd, cityData.timezone);
    const sunTimes = getSunTimes(fy, fm, fd, cityData.lat, cityData.lng, tzOffset);

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

  // ── Prepend visitor's own location as the headline row, when available ──
  // Falls back to Delhi (the historical default) when geo is unresolvable
  // — local dev, bot crawls without geo, or static-build paths.
  const userGeo = await getUserGeoLocation();
  if (userGeo) {
    // When geo headers carry no city (rare — usually IP-only), we still
    // show the row with a localised "Your Location" label. The English
    // label feeds JSON-LD / English-locale renders; the localised one
    // feeds the visible UI.
    const FALLBACK_CITY: { en: string; [k: string]: string } = {
      en: 'Your Location',
      hi: 'आपका स्थान',
      ta: 'உங்கள் இருப்பிடம்',
      te: 'మీ స్థానం',
      bn: 'আপনার অবস্থান',
      kn: 'ನಿಮ್ಮ ಸ್ಥಳ',
      gu: 'તમારું સ્થાન',
      mr: 'आपले स्थान',
      mai: 'अहाँक स्थान',
    };
    const visitorCityNameEn = userGeo.city || FALLBACK_CITY.en;
    const visitorCityNameLocale = userGeo.city || tl(FALLBACK_CITY, locale);

    // Skip prepending when geo resolves to a city already in TABLE_CITY_SLUGS
    // (avoids duplicate row + Delhi-as-Delhi noise).
    const matchesExisting = cityRows.some(r =>
      r.nameEn.toLowerCase() === (visitorCityNameEn.split(',')[0] || '').toLowerCase(),
    );
    if (!matchesExisting) {
      const userFestivals = generateFestivalCalendarV2(year, userGeo.lat, userGeo.lng, userGeo.timezone);
      clearTithiTableCache();
      const userEntry = userFestivals.find(f => f.slug === slug);
      if (userEntry) {
        const [uy, um, ud] = userEntry.date.split('-').map(Number);
        const userTzOffset = getUTCOffsetForDate(uy, um, ud, userGeo.timezone);
        const userSun = getSunTimes(uy, um, ud, userGeo.lat, userGeo.lng, userTzOffset);
        cityRows.unshift({
          slug: 'visitor',
          nameEn: visitorCityNameEn,
          nameLocale: visitorCityNameLocale,
          date: userEntry.date,
          sunrise: formatMinutesHHMM(userSun.sunriseMinutes),
          sunset: formatMinutesHHMM(userSun.sunsetMinutes),
          pujaMuhurat: userEntry.pujaMuhurat || null,
          tithi: userEntry.tithi || '',
        });
      }
    }
  }

  // Use the first row as the headline — visitor's city if geo resolved,
  // otherwise Delhi (the long-standing default).
  const refRow = cityRows[0];
  const festivalDate = refRow.date;
  const tithiStr = refRow.tithi;

  // Puja Vidhi data (if available for this festival)
  const pujaVidhi = getPujaVidhiBySlug(slug);

  // Kala explanation
  const kalaExplanation = getKalaExplanation(muhurtaRule, festivalNameEn, detail, locale);

  // ── JSON-LD: Event (national-level, Delhi as reference) ──
  const eventDescription = refRow.pujaMuhurat
    ? `${festivalNameEn} ${year}. Puja muhurta: ${refRow.pujaMuhurat.start}–${refRow.pujaMuhurat.end}. City-wise timings for ${cityRows.length}+ cities.`
    : `${festivalNameEn} on ${festivalDate}. City-wise sunrise, sunset & muhurta timings.`;

  const eventLD = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${festivalNameEn} ${year}`,
    startDate: festivalDate,
    endDate: festivalDate,
    image: `${BASE_URL}/icon-512.png`,
    description: eventDescription,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'India',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    },
    performer: {
      '@type': 'PerformingGroup',
      name: festivalNameEn,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/en/festivals/${slug}/${year}`,
      validFrom: festivalDate,
    },
  };

  // ── JSON-LD: BreadcrumbList ──
  const breadcrumbLD = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: tl({ en: 'Festivals', hi: 'त्योहार' }, locale), item: `${BASE_URL}/${locale}/calendar` },
      { '@type': 'ListItem', position: 3, name: festivalNameLocale, item: `${BASE_URL}/${locale}/calendar/${slug}` },
      { '@type': 'ListItem', position: 4, name: String(year) },
    ],
  };

  // ── JSON-LD: FAQPage ──
  const faqLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `When is ${festivalNameEn} ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${festivalNameEn} ${year} falls on ${formatDate(festivalDate, 'en')}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What time is ${festivalNameEn} puja muhurat?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: refRow.pujaMuhurat
            ? `The ${refRow.pujaMuhurat.name} is from ${fmt12h(refRow.pujaMuhurat.start)} to ${fmt12h(refRow.pujaMuhurat.end)} (${refRow.nameEn}). Timings vary by city — see the city-wise table above.`
            : `${festivalNameEn} observance follows the ${ruleLabel} rule. Timings vary by city.`,
        },
      },
      {
        '@type': 'Question',
        name: `What Tithi is ${festivalNameEn} observed on?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: tithiStr
            ? `${festivalNameEn} is observed on ${tithiStr}.`
            : `${festivalNameEn} follows the ${ruleLabel} rule for Tithi determination.`,
        },
      },
      {
        '@type': 'Question',
        name: `Why is ${festivalNameEn} on this date?`,
        acceptedAnswer: { '@type': 'Answer', text: kalaExplanation },
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(eventLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />

      {/* Visible breadcrumb — pairs with BreadcrumbList JSON-LD above. */}
      <Breadcrumb
        className="mb-6"
        items={[
          { href: '/', label: isHi ? 'मुख्य' : 'Home' },
          { href: '/festivals', label: isHi ? 'त्योहार' : 'Festivals' },
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
          <p className="text-text-secondary text-sm max-w-lg mx-auto" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {tl({
              en: `Exact date, puja muhurat & city-wise timings for ${festivalNameEn} ${year}`,
              hi: `${festivalNameLocale} ${year} की सटीक तिथि, पूजा मुहूर्त व शहर-वार समय`,
            }, locale)}
          </p>
          {/* Cross-links to core pages */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <a href={`/${locale}/panchang`} className="px-3 py-1 rounded-full text-xs border border-gold-primary/20 text-gold-dark hover:bg-gold-primary/10 transition-colors">
              {isHi ? 'आज का पंचांग' : "Today's Panchang"}
            </a>
            <a href={`/${locale}/ekadashi`} className="px-3 py-1 rounded-full text-xs border border-gold-primary/20 text-gold-dark hover:bg-gold-primary/10 transition-colors">
              {isHi ? 'एकादशी 2026' : 'Ekadashi 2026'}
            </a>
            <a href={`/${locale}/muhurta-ai`} className="px-3 py-1 rounded-full text-xs border border-gold-primary/20 text-gold-dark hover:bg-gold-primary/10 transition-colors">
              {isHi ? 'शुभ मुहूर्त खोजें' : 'Find Auspicious Muhurta'}
            </a>
            <a href={`/${locale}/kundali`} className="px-3 py-1 rounded-full text-xs border border-gold-primary/20 text-gold-dark hover:bg-gold-primary/10 transition-colors">
              {isHi ? 'कुण्डली बनाएँ' : 'Generate Kundali'}
            </a>
          </div>
        </div>

        <div className="border-t border-gold-primary/15" />

        {/* ── Key Data Card ── */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border border-gold-primary/12 p-5 sm:p-6 space-y-4">
          <h2 className="text-gold-light font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <Calendar className="w-5 h-5 text-gold-primary" />
            {tl({ en: 'Key Information', hi: 'प्रमुख जानकारी' }, locale)}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Festival Date */}
            <div className="bg-gold-primary/5 rounded-xl p-4 border border-gold-primary/10">
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                {tl({ en: 'Festival Date', hi: 'त्योहार की तिथि' }, locale)}
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
              <span className="text-gold-primary font-medium">{tl({ en: 'Tithi', hi: 'तिथि' }, locale)}:</span>{' '}
              {tithiStr}
            </div>
          )}

          {/* Observation Rule Badge */}
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Info className="w-3.5 h-3.5 text-gold-dark" />
            <span>{tl({ en: 'Observation Rule', hi: 'पालन नियम' }, locale)}: <span className="text-gold-primary font-medium">{ruleLabel}</span></span>
          </div>
        </div>

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
                    {tl({ en: 'City', hi: 'शहर' }, locale)}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-primary font-bold text-xs uppercase tracking-wider">
                    <Sun className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5 text-amber-400" />
                    {tl({ en: 'Sunrise', hi: 'सूर्योदय' }, locale)}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-primary font-bold text-xs uppercase tracking-wider">
                    <Moon className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5 text-orange-400" />
                    {tl({ en: 'Sunset', hi: 'सूर्यास्त' }, locale)}
                  </th>
                  {cityRows.some(r => r.pujaMuhurat) && (
                    <th className="text-left px-4 py-3 text-gold-primary font-bold text-xs uppercase tracking-wider">
                      <Clock className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5" />
                      {tl({ en: 'Puja Muhurat', hi: 'पूजा मुहूर्त' }, locale)}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-primary/8">
                {cityRows.map((row) => (
                  <tr key={row.slug} className="hover:bg-gold-primary/5 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/${locale}/festivals/${slug}/${year}/${row.slug}`}
                        className="text-gold-light font-medium hover:text-gold-primary transition-colors"
                        style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                        rel="nofollow"
                      >
                        {row.nameLocale}
                      </Link>
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

          <p className="text-text-secondary/60 text-xs text-center">
            {tl({
              en: 'Click any city for detailed local timings, puja vidhi & samagri list',
              hi: 'विस्तृत स्थानीय समय, पूजा विधि व सामग्री सूची के लिए किसी भी शहर पर क्लिक करें',
            }, locale)}
          </p>
        </div>

        {/* ── "Why This Date?" Section ── */}
        <div className="space-y-3">
          <h2 className="text-gold-light font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({ en: 'Why This Date?', hi: 'यह तिथि क्यों?' }, locale)}
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
                {tl({ en: 'Tithi Determination Rule', hi: 'तिथि निर्धारण नियम' }, locale)}
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
                {tl({ en: 'Puja Vidhi', hi: 'पूजा विधि' }, locale)}
              </h2>
            </div>

            {/* Samagri preview */}
            {pujaVidhi.samagri.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-purple-300 text-xs uppercase tracking-widest font-bold">
                  {tl({ en: 'Materials Required', hi: 'आवश्यक सामग्री' }, locale)}
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
                  {tl({ en: 'Puja Steps', hi: 'पूजा के चरण' }, locale)}
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
                    ? tl({ en: 'Vrat Phala (Fasting Benefits)', hi: 'व्रत फल (उपवास के लाभ)' }, locale)
                    : tl({ en: 'Phala (Benefits)', hi: 'फल (लाभ)' }, locale)
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
                <p className="text-text-secondary text-xs uppercase tracking-wider">{tl({ en: 'Deity', hi: 'देवता' }, locale)}</p>
                <p className="text-gold-light font-medium" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(detail.deity, locale)}
                </p>
              </div>
            </div>
          )}

          {/* Legend & History */}
          <div>
            <h2 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
              {tl({ en: 'Legend & History', hi: 'कथा एवं इतिहास' }, locale)}
            </h2>
            {tl(detail.mythology, locale).length > 200 ? (
              <details className="group">
                <summary className="text-text-secondary text-sm leading-relaxed cursor-pointer" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(detail.mythology, locale).slice(0, 200)}...
                  <span className="text-gold-primary text-xs font-medium ml-1 group-open:hidden">
                    {tl({ en: 'Read full legend →', hi: 'पूरी कथा पढ़ें →' }, locale)}
                  </span>
                </summary>
                <p className="text-text-secondary text-sm leading-relaxed mt-1" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(detail.mythology, locale)}
                </p>
              </details>
            ) : (
              <p className="text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {tl(detail.mythology, locale)}
              </p>
            )}
          </div>

          {/* Observance */}
          <div>
            <h2 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
              {tl({ en: 'How to Observe', hi: 'कैसे मनाएँ' }, locale)}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl(detail.observance, locale)}
            </p>
          </div>

          {/* Significance */}
          <div>
            <h2 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
              {tl({ en: 'Significance', hi: 'महत्व' }, locale)}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl(detail.significance, locale)}
            </p>
          </div>

          {/* Fasting Note */}
          {detail.isFast && detail.fastNote && (
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
              <p className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-1">
                {tl({ en: 'Fasting', hi: 'व्रत' }, locale)}
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
          <span className="text-text-secondary text-xs">{tl({ en: 'Learn more', hi: 'और जानें' }, locale)}:</span>
          <Link
            href={`/${locale}/learn/festival-rules`}
            className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
          >
            {tl({ en: 'Festival Timing Rules', hi: 'उत्सव काल नियम' }, locale)}
          </Link>
          <Link
            href={`/${locale}/learn/tithis`}
            className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
          >
            {tl({ en: 'Understanding Tithis', hi: 'तिथि को समझें' }, locale)}
          </Link>
          <Link
            href={`/${locale}/learn/masa`}
            className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
          >
            {tl({ en: 'Lunar Months Explained', hi: 'चंद्र मास विवरण' }, locale)}
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
            {tl({ en: 'View All Festivals & Vrats', hi: 'सभी त्योहार और व्रत देखें' }, locale)}
          </Link>
        </div>
      </article>
    </div>
  );
}
