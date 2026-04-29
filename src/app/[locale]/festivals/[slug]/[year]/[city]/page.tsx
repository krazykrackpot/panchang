import { getCityBySlug, getPopularCities, CITIES } from '@/lib/constants/cities';
import { MAJOR_FESTIVALS, type MuhurtaRule } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS, type FestivalDetail } from '@/lib/constants/festival-details';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { clearTithiTableCache } from '@/lib/calendar/tithi-table';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { getPujaVidhiBySlug } from '@/lib/constants/puja-vidhi';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Sun, Moon, ChevronDown, ChevronRight, Info, BookOpen, Sparkles, Leaf, CheckCircle } from 'lucide-react';
import VratFollowButton from '@/components/vrat/VratFollowButton';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

// Top 20 festival slugs for static generation
const TOP_FESTIVAL_SLUGS = [
  'diwali', 'janmashtami', 'maha-shivaratri', 'ram-navami', 'ganesh-chaturthi',
  'dussehra', 'holi', 'raksha-bandhan', 'dhanteras', 'narak-chaturdashi',
  'govardhan-puja', 'bhai-dooj', 'hanuman-jayanti', 'akshaya-tritiya',
  'guru-purnima', 'vasant-panchami', 'holika-dahan', 'hartalika-teej',
  'chhath-puja', 'makar-sankranti',
];

// Top 15 cities for static generation
const TOP_CITY_SLUGS = [
  'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
  'pune', 'ahmedabad', 'jaipur', 'lucknow', 'varanasi', 'patna',
  'bhopal', 'chandigarh', 'new-york',
];

const VALID_YEARS = [2025, 2026, 2027, 2028, 2029];

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

/** Detailed descriptions of each Kala-Vyapti rule for the Tithi Rule card */
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
      en: `${festivalNameEn} follows the Udaya Tithi rule — the festival is observed on the day when the required tithi prevails at sunrise. This is the default Dharmasindhu convention for festivals without a special time-window requirement.`,
      hi: `${festivalNameEn} उदय तिथि नियम का पालन करता है — जिस दिन आवश्यक तिथि सूर्योदय के समय व्याप्त हो, उस दिन त्योहार मनाया जाता है। यह धर्मसिन्धु का सामान्य नियम है।`,
    }, locale);
  }

  return tl({
    en: `${festivalNameEn} follows the ${ruleLabel} rule. The tithi must be active during the ${ruleLabel} window for the festival to be observed on that day. When the tithi spans two calendar days, the Dharmasindhu tie-breaking rules determine the correct observance date.`,
    hi: `${festivalNameEn} ${ruleLabel} नियम का पालन करता है। त्योहार उस दिन मनाया जाता है जब तिथि ${ruleLabel} की अवधि में व्याप्त हो। जब तिथि दो दिनों में फैलती है तो धर्मसिन्धु के नियमों से सही तिथि निर्धारित होती है।`,
  }, locale);
}

function formatDate(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const loc = locale === 'hi' || locale === 'sa' ? 'hi-IN' : 'en-US';
  return date.toLocaleDateString(loc, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}

function formatTimeHHMM(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Pre-render only a small seed set at build time — top 5 festivals × top 5 cities × 2026.
 * All other combinations are generated on-demand via ISR (Next.js dynamic rendering).
 * This keeps build time under control while seeding the most-searched pages.
 */
export function generateStaticParams() {
  const seedFestivals = TOP_FESTIVAL_SLUGS.slice(0, 5); // diwali, janmashtami, maha-shivaratri, ram-navami, ganesh-chaturthi
  const seedCities = TOP_CITY_SLUGS.slice(0, 5);        // delhi, mumbai, bangalore, chennai, kolkata
  const params: { slug: string; year: string; city: string }[] = [];
  for (const slug of seedFestivals) {
    for (const city of seedCities) {
      params.push({ slug, year: '2026', city });
    }
  }
  return params;
}

export default async function FestivalCityPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; year: string; city: string }>;
}) {
  const { locale, slug, year: yearStr, city: citySlug } = await params;

  // Validate year
  const year = parseInt(yearStr, 10);
  if (isNaN(year) || year < 2024 || year > 2030) notFound();

  // Validate city
  const cityData = getCityBySlug(citySlug);
  if (!cityData) notFound();

  // Find festival definition
  const festivalDef = MAJOR_FESTIVALS.find(f => f.slug === slug);
  if (!festivalDef) notFound();

  const detail = FESTIVAL_DETAILS[slug];
  if (!detail) notFound();

  // Generate festival calendar for this city + year
  const festivals = generateFestivalCalendarV2(year, cityData.lat, cityData.lng, cityData.timezone);
  // Free memory — tithi table is large
  clearTithiTableCache();

  // Find the matching festival entry
  const festivalEntry = festivals.find(f => f.slug === slug);
  if (!festivalEntry) {
    // Festival doesn't occur in this year (rare — e.g., adhika masa shifts)
    notFound();
  }

  const festivalDate = festivalEntry.date;
  const [fy, fm, fd] = festivalDate.split('-').map(Number);

  // Compute sunrise/sunset for the festival date at this city
  const tzOffset = getUTCOffsetForDate(fy, fm, fd, cityData.timezone);
  const sunTimes = getSunTimes(fy, fm, fd, cityData.lat, cityData.lng, tzOffset);

  const isHi = isDevanagariLocale(locale);
  const festivalNameEn = tl(detail.name, 'en');
  const festivalNameLocale = tl(detail.name, locale);
  const cityNameLocale = isHi ? (tl(cityData.name, locale) || cityData.name.en) : cityData.name.en;
  const cityNameEn = cityData.name.en;

  const muhurtaRule = festivalDef.muhurtaRule || 'sunrise';
  const ruleLabel = tl(RULE_LABELS[muhurtaRule], locale);

  // Puja Vidhi data (if available for this festival)
  const pujaVidhi = getPujaVidhiBySlug(slug);

  // Puja muhurat from the festival entry
  const pujaMuhurat = festivalEntry.pujaMuhurat;

  // Tithi info
  const tithiStr = festivalEntry.tithi || '';

  // Format sunrise/sunset
  const sunriseStr = formatTimeHHMM(sunTimes.sunrise);
  const sunsetStr = formatTimeHHMM(sunTimes.sunset);

  // City cross-links: top 15 cities excluding current
  const crossLinkCities = getPopularCities(16).filter(c => c.slug !== citySlug).slice(0, 15);

  // Year navigation
  const yearLinks = VALID_YEARS;

  // Kala explanation
  const kalaExplanation = getKalaExplanation(muhurtaRule, festivalNameEn, detail, locale);

  // ── JSON-LD: Event ──
  const eventDescription = pujaMuhurat
    ? `${festivalNameEn} in ${cityNameEn}. Puja muhurta: ${pujaMuhurat.start}–${pujaMuhurat.end}. Sunrise: ${sunriseStr}, Sunset: ${sunsetStr}.`
    : `${festivalNameEn} in ${cityNameEn} on ${festivalDate}. Sunrise: ${sunriseStr}, Sunset: ${sunsetStr}.`;

  const eventLD = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${festivalNameEn} ${year} in ${cityNameEn}`,
    startDate: festivalDate,
    endDate: festivalDate,
    image: `${BASE_URL}/icon-512.png`,
    location: {
      '@type': 'Place',
      name: cityNameEn,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cityNameEn,
        ...(cityData.state ? { addressRegion: cityData.state } : {}),
        addressCountry: cityData.timezone.startsWith('Asia/Kolkata') ? 'IN'
          : cityData.timezone.startsWith('America/') ? 'US' : undefined,
      },
      geo: { '@type': 'GeoCoordinates', latitude: cityData.lat, longitude: cityData.lng },
    },
    description: eventDescription,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    organizer: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/${locale}/festivals/${slug}/${year}/${citySlug}`,
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
      { '@type': 'ListItem', position: 4, name: String(year), item: `${BASE_URL}/${locale}/festivals/${slug}/${year}/${citySlug}` },
      { '@type': 'ListItem', position: 5, name: cityNameLocale },
    ],
  };

  // ── JSON-LD: FAQPage ──
  const faqLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `When is ${festivalNameEn} ${year} in ${cityNameEn}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${festivalNameEn} ${year} in ${cityNameEn} falls on ${formatDate(festivalDate, 'en')}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What time is ${festivalNameEn} puja in ${cityNameEn}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: pujaMuhurat
            ? `The ${pujaMuhurat.name} in ${cityNameEn} is from ${pujaMuhurat.start} to ${pujaMuhurat.end}.`
            : `Sunrise in ${cityNameEn} on ${festivalNameEn} is at ${sunriseStr}. Observance follows the ${festivalNameEn} tithi window.`,
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(eventLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />

      <article className="space-y-8">
        {/* ── Hero ── */}
        <div className="text-center space-y-3">
          <p className="text-gold-primary text-xs uppercase tracking-widest font-bold">
            <MapPin className="inline-block w-3 h-3 mr-1 -mt-0.5" />
            {cityNameLocale} {cityData.state ? `· ${cityData.state}` : ''}
          </p>
          <h1
            className="text-2xl sm:text-4xl font-bold text-gold-light leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {festivalNameLocale} {year}
            <span className="block text-lg sm:text-xl text-text-secondary mt-1 font-normal">
              {tl({ en: `in ${cityNameLocale}`, hi: `${cityNameLocale} में` }, locale)}
            </span>
          </h1>
          <p className="text-text-secondary text-sm max-w-lg mx-auto" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {tl({
              en: `Exact puja times & muhurta computed for ${cityNameEn} coordinates (${cityData.lat.toFixed(2)}°N, ${cityData.lng.toFixed(2)}°E)`,
              hi: `${cityNameLocale} के निर्देशांकों (${cityData.lat.toFixed(2)}°N, ${cityData.lng.toFixed(2)}°E) के लिए सटीक पूजा समय`,
            }, locale)}
          </p>
          {/* Follow button for vrat/ekadashi festivals */}
          {(festivalDef.type === 'vrat' || festivalDef.category === 'ekadashi') && (
            <div className="pt-2">
              <VratFollowButton slug={slug} name={festivalNameEn} size="md" />
            </div>
          )}
        </div>

        <div className="border-t border-gold-primary/15" />

        {/* ── Key Data Card ── */}
        <div className="bg-bg-secondary rounded-2xl border border-gold-primary/20 p-5 sm:p-6 space-y-4">
          <h2 className="text-gold-light font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <Calendar className="w-5 h-5 text-gold-primary" />
            {tl({ en: 'Key Timings', hi: 'प्रमुख समय' }, locale)}
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

            {/* Puja Muhurta */}
            {pujaMuhurat && (
              <div className="bg-gold-primary/5 rounded-xl p-4 border border-gold-primary/10">
                <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                  {tl({ en: pujaMuhurat.name, hi: pujaMuhurat.name }, locale)}
                </p>
                <p className="text-gold-light font-bold text-lg">
                  <Clock className="inline-block w-4 h-4 mr-1 -mt-0.5 text-gold-primary" />
                  {pujaMuhurat.start} – {pujaMuhurat.end}
                </p>
              </div>
            )}

            {/* Sunrise */}
            <div className="bg-gold-primary/5 rounded-xl p-4 border border-gold-primary/10">
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                {tl({ en: 'Sunrise', hi: 'सूर्योदय' }, locale)}
              </p>
              <p className="text-gold-light font-bold text-lg">
                <Sun className="inline-block w-4 h-4 mr-1 -mt-0.5 text-amber-400" />
                {sunriseStr}
              </p>
            </div>

            {/* Sunset */}
            <div className="bg-gold-primary/5 rounded-xl p-4 border border-gold-primary/10">
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                {tl({ en: 'Sunset', hi: 'सूर्यास्त' }, locale)}
              </p>
              <p className="text-gold-light font-bold text-lg">
                <Moon className="inline-block w-4 h-4 mr-1 -mt-0.5 text-orange-400" />
                {sunsetStr}
              </p>
            </div>
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

        {/* ── "Why This Date?" Section ── */}
        <div className="space-y-3">
          <h2 className="text-gold-light font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({ en: 'Why This Date?', hi: 'यह तिथि क्यों?' }, locale)}
          </h2>
          <div className="bg-bg-secondary rounded-xl border border-gold-primary/10 p-4">
            <p className="text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {kalaExplanation}
            </p>
          </div>
        </div>

        {/* ── Tithi Determination Rule ── */}
        {festivalDef.muhurtaRule && (
          <div className="bg-bg-secondary rounded-2xl border-2 border-gold-primary/30 p-5 sm:p-6 space-y-3">
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
                en: 'Source: Dharmasindhu & Nirnayasindhu — classical Kala-Vyapti system',
                hi: 'स्रोत: धर्मसिन्धु एवं निर्णयसिन्धु — शास्त्रीय काल-व्याप्ति पद्धति',
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
            <Link
              href={`/${locale}/puja/${slug}#start-puja`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/20 border border-gold-primary/40 text-gold-light font-bold text-sm hover:bg-gold-primary/30 hover:border-gold-primary/60 transition-all"
            >
              {tl({
                en: '✦ Start Interactive Puja',
                hi: '✦ इंटरैक्टिव पूजा शुरू करें',
              }, locale)}
            </Link>
          </div>
        )}

        {/* ── Vrat Phala (Benefits) ── */}
        {(() => {
          const phalaText = pujaVidhi?.phala
            ? tl(pujaVidhi.phala, locale)
            : null;
          const isVrat = detail.isFast === true;
          if (!phalaText) return null;
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

        {/* ── Calculation Proof (expandable) ── */}
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer text-gold-primary text-sm font-medium hover:text-gold-light transition-colors">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            {tl({ en: 'Calculation Proof — Transparent Audit Trail', hi: 'गणना प्रमाण — पारदर्शी लेखा परीक्षा' }, locale)}
          </summary>
          <div className="mt-3 bg-bg-secondary rounded-xl border border-gold-primary/10 p-4 space-y-2 text-sm text-text-secondary">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <span className="text-text-secondary/60">{tl({ en: 'Festival', hi: 'त्योहार' }, locale)}</span>
              <span className="text-gold-light">{festivalNameEn}</span>

              <span className="text-text-secondary/60">{tl({ en: 'Tithi', hi: 'तिथि' }, locale)}</span>
              <span className="text-gold-light">{tithiStr || '—'}</span>

              <span className="text-text-secondary/60">{tl({ en: 'Kala Rule', hi: 'काल नियम' }, locale)}</span>
              <span className="text-gold-light">{ruleLabel}</span>

              <span className="text-text-secondary/60">{tl({ en: 'Sunrise', hi: 'सूर्योदय' }, locale)}</span>
              <span className="text-gold-light">{sunriseStr}</span>

              <span className="text-text-secondary/60">{tl({ en: 'Sunset', hi: 'सूर्यास्त' }, locale)}</span>
              <span className="text-gold-light">{sunsetStr}</span>

              <span className="text-text-secondary/60">{tl({ en: 'Coordinates', hi: 'निर्देशांक' }, locale)}</span>
              <span className="text-gold-light">{cityData.lat.toFixed(4)}°N, {cityData.lng.toFixed(4)}°E</span>

              <span className="text-text-secondary/60">{tl({ en: 'Timezone', hi: 'समय क्षेत्र' }, locale)}</span>
              <span className="text-gold-light">{cityData.timezone} (UTC{tzOffset >= 0 ? '+' : ''}{tzOffset})</span>

              {pujaMuhurat && (
                <>
                  <span className="text-text-secondary/60">{tl({ en: 'Puja Window', hi: 'पूजा समय' }, locale)}</span>
                  <span className="text-gold-light">{pujaMuhurat.start} – {pujaMuhurat.end}</span>
                </>
              )}
            </div>
          </div>
        </details>

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

        {/* ── City Cross-Links ── */}
        <div>
          <h2 className="text-gold-light font-bold text-lg mb-4 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({
              en: `${festivalNameEn} ${year} in Other Cities`,
              hi: `अन्य शहरों में ${festivalNameLocale} ${year}`,
            }, locale)}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {crossLinkCities.map(c => {
              const cn = isHi ? (tl(c.name, locale) || c.name.en) : c.name.en;
              return (
                <Link
                  key={c.slug}
                  href={`/${locale}/festivals/${slug}/${year}/${c.slug}`}
                  className="px-3 py-2 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-secondary text-sm text-center hover:text-gold-light hover:border-gold-primary/30 transition-colors"
                >
                  {cn}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Year Navigation ── */}
        <div>
          <h2 className="text-gold-light font-bold text-lg mb-4 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({
              en: `${festivalNameEn} in ${cityNameEn} — Other Years`,
              hi: `${cityNameLocale} में ${festivalNameLocale} — अन्य वर्ष`,
            }, locale)}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {yearLinks.map(y => (
              <Link
                key={y}
                href={`/${locale}/festivals/${slug}/${y}/${citySlug}`}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  y === year
                    ? 'bg-gold-primary/20 border-gold-primary/40 text-gold-light'
                    : 'bg-bg-secondary border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>

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
          <Link
            href={`/${locale}/learn/smarta-vaishnava`}
            className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
          >
            {tl({ en: 'Smarta & Vaishnava Calendars', hi: 'स्मार्त और वैष्णव पंचांग' }, locale)}
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
