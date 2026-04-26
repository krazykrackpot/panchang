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
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Sun, Moon, ChevronDown, ChevronRight, Info } from 'lucide-react';

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
    location: {
      '@type': 'City',
      name: cityNameEn,
      geo: { '@type': 'GeoCoordinates', latitude: cityData.lat, longitude: cityData.lng },
    },
    description: eventDescription,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
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

          {/* Mythology */}
          <div>
            <h2 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
              {tl({ en: 'Mythology & Legend', hi: 'पौराणिक कथा' }, locale)}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl(detail.mythology, locale)}
            </p>
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
