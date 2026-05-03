import { getLocale } from 'next-intl/server';
import { MapPin, Globe, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { type CityData } from '@/lib/constants/cities';
import { ALL_CITIES } from '@/lib/constants/cities-extended';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Locale-aware city name with en fallback */
function cityName(city: CityData, locale: string): string {
  return (city.name as Record<string, string>)[locale] || city.name.en;
}

/**
 * International states — cities whose `state` field is a country name rather
 * than an Indian state/UT. We detect by checking against a known set.
 */
const INTERNATIONAL_STATES = new Set([
  'USA', 'UK', 'Singapore', 'UAE', 'Australia', 'Canada',
  'Malaysia', 'Mauritius', 'Fiji', 'Trinidad', 'New Zealand',
]);

function isInternational(city: CityData): boolean {
  return INTERNATIONAL_STATES.has(city.state ?? '');
}

// ─── Labels ─────────────────────────────────────────────────────────────────

const LABELS: Record<string, Record<string, string>> = {
  en: {
    pageTitle: 'Panchang by City',
    pageSubtitle: '55+ locations across India and the global Hindu diaspora',
    intro:
      'Every city-specific Panchang page computes Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Yamaganda, Gulika, sunrise, and sunset for the exact coordinates of that location — using classical Vedic algorithms with Lahiri Ayanamsha. Choose your city below for timings precise to the minute.',
    indiaSection: 'India — by State',
    internationalSection: 'Global Hindu Diaspora',
    internationalSubtitle:
      'Accurate Vedic Panchang for the Hindu diaspora worldwide',
    breadcrumbHome: 'Home',
    breadcrumbPanchang: 'Panchang',
    breadcrumbCurrent: 'Locations',
    viewPanchang: 'View Panchang',
    cities: 'cities',
    whyTitle: 'Why city-specific Panchang?',
    whyText:
      'Panchang timings — especially Rahu Kaal, Yamaganda, Gulika, and Muhurta windows — depend on local sunrise and sunset, which differ by longitude, latitude, and season. A Panchang computed for Delhi can be off by 20–90 minutes for cities like Chennai or Chandigarh. Every page here uses coordinates precise to the city centre.',
  },
  hi: {
    pageTitle: 'शहर के अनुसार पंचांग',
    pageSubtitle: 'भारत और वैश्विक हिंदू डायस्पोरा के 55+ स्थान',
    intro:
      'प्रत्येक शहर-विशिष्ट पंचांग पृष्ठ उस स्थान के सटीक निर्देशांक के आधार पर तिथि, नक्षत्र, योग, करण, राहु काल, यमगण्ड, गुलिक, सूर्योदय और सूर्यास्त की गणना करता है। नीचे से अपना शहर चुनें।',
    indiaSection: 'भारत — राज्य के अनुसार',
    internationalSection: 'वैश्विक हिंदू डायस्पोरा',
    internationalSubtitle: 'विश्वभर में हिंदू डायस्पोरा के लिए सटीक वैदिक पंचांग',
    breadcrumbHome: 'होम',
    breadcrumbPanchang: 'पंचांग',
    breadcrumbCurrent: 'स्थान',
    viewPanchang: 'पंचांग देखें',
    cities: 'शहर',
    whyTitle: 'शहर-विशिष्ट पंचांग क्यों?',
    whyText:
      'पंचांग समय — विशेष रूप से राहु काल, यमगण्ड, गुलिक और मुहूर्त — स्थानीय सूर्योदय और सूर्यास्त पर निर्भर करते हैं। दिल्ली का पंचांग चेन्नई या चंडीगढ़ के लिए 20–90 मिनट तक गलत हो सकता है।',
  },
};

function t(key: string, locale: string): string {
  return (LABELS[locale] ?? LABELS['en'])[key] ?? LABELS['en'][key] ?? key;
}

// ─── Data Processing ─────────────────────────────────────────────────────────

interface StateGroup {
  state: string;
  cities: CityData[];
}

function groupByState(cities: CityData[]): StateGroup[] {
  const map = new Map<string, CityData[]>();
  for (const city of cities) {
    const s = city.state ?? 'Other';
    if (!map.has(s)) map.set(s, []);
    map.get(s)!.push(city);
  }
  // Sort states alphabetically; sort cities within each state by population desc
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, cs]) => ({
      state,
      cities: [...cs].sort((a, b) => (b.population ?? 0) - (a.population ?? 0)),
    }));
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StateCard({
  group,
  locale,
}: {
  group: StateGroup;
  locale: string;
}) {
  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 hover:border-gold-primary/40 transition-colors duration-200">
      {/* State header */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-gold-primary flex-shrink-0" />
        <h3 className="text-gold-light font-semibold text-base leading-tight">
          {group.state}
        </h3>
        <span className="ml-auto text-xs text-text-secondary bg-gold-primary/10 border border-gold-primary/20 rounded-full px-2 py-0.5">
          {group.cities.length} {/* city count badge — label omitted for brevity at small sizes */}
        </span>
      </div>

      {/* City list */}
      <ul className="space-y-1">
        {group.cities.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/panchang/${city.slug}` as '/panchang/[city]'}
              className="group flex items-center justify-between rounded-lg px-3 py-1.5 hover:bg-gold-primary/8 transition-colors duration-150"
            >
              <span className="text-text-primary text-sm group-hover:text-gold-light transition-colors">
                {cityName(city, locale)}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-gold-primary transition-colors flex-shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InternationalCard({
  city,
  locale,
}: {
  city: CityData;
  locale: string;
}) {
  return (
    <Link
      href={`/panchang/${city.slug}` as '/panchang/[city]'}
      className="group bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 hover:border-gold-primary/40 transition-colors duration-200 flex flex-col gap-2"
    >
      <div className="flex items-start gap-2">
        <Globe className="w-4 h-4 text-gold-primary flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-gold-light font-semibold text-sm leading-snug group-hover:text-gold-light truncate">
            {cityName(city, locale)}
          </p>
          <p className="text-text-secondary text-xs mt-0.5">{city.state}</p>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-gold-primary transition-colors flex-shrink-0 ml-auto mt-0.5" />
      </div>
    </Link>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function LocationsPage() {
  const locale = await getLocale();

  const headingFont = getHeadingFont(locale);
  const isDevanagari = isDevanagariLocale(locale);

  const indianCities = ALL_CITIES.filter((c) => !isInternational(c));
  const internationalCities = ALL_CITIES.filter((c) => isInternational(c)).sort(
    (a, b) => (b.population ?? 0) - (a.population ?? 0),
  );

  const stateGroups = groupByState(indianCities);

  return (
    <main className="min-h-screen bg-[#0a0e27] text-text-primary">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-gold-primary/10">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2d1b69]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#1a1040]/40 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-text-secondary mb-6"
          >
            <Link href="/" className="hover:text-gold-light transition-colors">
              {t('breadcrumbHome', locale)}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/panchang"
              className="hover:text-gold-light transition-colors"
            >
              {t('breadcrumbPanchang', locale)}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">{t('breadcrumbCurrent', locale)}</span>
          </nav>

          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-primary/30 to-gold-dark/20 border border-gold-primary/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-gold-primary" />
            </div>
            <div>
              <h1
                className="text-3xl sm:text-4xl font-bold text-gold-light leading-tight"
                style={headingFont}
              >
                {t('pageTitle', locale)}
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                {t('pageSubtitle', locale)}
              </p>
            </div>
          </div>

          {/* Intro */}
          <p
            className="text-text-secondary leading-relaxed max-w-3xl text-sm sm:text-base mt-4"
            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
          >
            {t('intro', locale)}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">

        {/* ── India section ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl" role="img" aria-label="India flag">🇮🇳</span>
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-gold-light"
                style={headingFont}
              >
                {t('indiaSection', locale)}
              </h2>
              <p className="text-text-secondary text-sm mt-0.5">
                {stateGroups.length} states &amp; UTs · {indianCities.length} cities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stateGroups.map((group) => (
              <StateCard key={group.state} group={group} locale={locale} />
            ))}
          </div>
        </section>

        {/* ── Why city-specific callout ── */}
        <div className="bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 sm:p-8">
          <h2
            className="text-xl font-bold text-gold-light mb-3"
            style={headingFont}
          >
            {t('whyTitle', locale)}
          </h2>
          <p
            className="text-text-secondary leading-relaxed text-sm sm:text-base"
            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
          >
            {t('whyText', locale)}
          </p>
        </div>

        {/* ── International section ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-7 h-7 text-gold-primary flex-shrink-0" />
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-gold-light"
                style={headingFont}
              >
                {t('internationalSection', locale)}
              </h2>
              <p className="text-text-secondary text-sm mt-0.5">
                {t('internationalSubtitle', locale)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {internationalCities.map((city) => (
              <InternationalCard key={city.slug} city={city} locale={locale} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
