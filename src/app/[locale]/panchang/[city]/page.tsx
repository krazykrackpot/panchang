import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Sunrise, Sunset, Clock, MapPin, Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import { getCityBySlug, getAllCitySlugs, getPopularCities } from '@/lib/constants/cities';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';
import { generateDailyArticle, type ArticleCityConfig } from '@/lib/horoscope/daily-article';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { Locale, TransitionInfo } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import M from '@/messages/pages/panchang-city.json';

type LocaleText = Record<string, string>;
const msg = (key: string, locale: string) => tl((M as unknown as Record<string, LocaleText>)[key], locale);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

// ──────────────────────────────────────────────────────────────
// Static params — pre-generate all city pages
// ──────────────────────────────────────────────────────────────

export function generateStaticParams() {
  const slugs = getAllCitySlugs();
  const locales = ['en', 'hi', 'sa'];
  return locales.flatMap(locale =>
    slugs.map(city => ({ locale, city }))
  );
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
  const city = getCityBySlug(citySlug);
  if (!city) return {};

  const isHi = isDevanagariLocale(locale);
  const cityName = isHi ? city.name.hi : city.name.en;
  const today = new Date();
  const dateStr = today.toLocaleDateString(msg('localeId', locale), {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const title = tl({ en: `${cityName} Panchang Today — ${dateStr} | Tithi, Nakshatra, Yoga, Karana`, hi: `${cityName} पंचांग आज — ${dateStr} | तिथि, नक्षत्र, योग, करण`, sa: `${cityName} पंचांग आज — ${dateStr} | तिथि, नक्षत्र, योग, करण` }, locale);

  const description = tl({ en: `Today's Panchang for ${cityName}, ${city.state} — accurate sunrise, sunset, tithi, nakshatra, yoga, karana, Rahu Kaal, Yamaganda & Gulika timings. Vedic calculations using Lahiri Ayanamsha.`, hi: `${cityName}, ${city.state} का आज का पंचांग — सटीक सूर्योदय, सूर्यास्त, तिथि, नक्षत्र, योग, करण, राहुकाल, यमगण्ड और गुलिक काल। लाहिरी अयनांश पर आधारित वैदिक गणना।`, sa: `${cityName}, ${city.state} का आज का पंचांग — सटीक सूर्योदय, सूर्यास्त, तिथि, नक्षत्र, योग, करण, राहुकाल, यमगण्ड और गुलिक काल। लाहिरी अयनांश पर आधारित वैदिक गणना।` }, locale);

  const url = `${BASE_URL}/${locale}/panchang/${citySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en/panchang/${citySlug}`,
        hi: `${BASE_URL}/hi/panchang/${citySlug}`,
        'x-default': `${BASE_URL}/en/panchang/${citySlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
  };
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

function formatTransitionEnd(t: TransitionInfo | undefined, locale: string): string {
  const isHi = isDevanagariLocale(locale);
  if (!t) return msg('ended', locale);
  const time = t.endTime;
  if (t.endDate) {
    const [, m, d] = t.endDate.split('-').map(Number);
    const months = isHi
      ? ['जन.', 'फर.', 'मार्च', 'अप्रै.', 'मई', 'जून', 'जुला.', 'अग.', 'सित.', 'अक्टू.', 'नव.', 'दिस.']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${time}, ${d} ${months[m - 1]}`;
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
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const loc = (locale || 'en') as Locale;
  const isHi = isDevanagariLocale(loc);
  const cityName = isHi ? city.name.hi : city.name.en;

  // Compute today's panchang for this city
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);

  const input: PanchangInput = {
    year, month, day,
    lat: city.lat,
    lng: city.lng,
    tzOffset,
    timezone: city.timezone,
    locationName: city.name.en,
  };

  const panchang = computePanchang(input);

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

  // Popular cities for cross-linking (exclude current)
  const popularCities = getPopularCities(16).filter(c => c.slug !== citySlug);

  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${city.name.en} Panchang Today`,
    description: `Daily Vedic Panchang for ${city.name.en}, ${city.state} with tithi, nakshatra, yoga, karana, and muhurta timings.`,
    url: `${BASE_URL}/${locale}/panchang/${citySlug}`,
    mainEntity: {
      '@type': 'Event',
      name: `Panchang — ${city.name.en} — ${now.toISOString().split('T')[0]}`,
      startDate: now.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
      location: {
        '@type': 'Place',
        name: `${city.name.en}, ${city.state}`,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: city.lat,
          longitude: city.lng,
        },
      },
    },
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
          {city.state}
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
          {locale === 'hi' || locale === 'sa'
              ? `${cityName}, ${city.state} के लिए आज का पंचांग — ${cityName} के सटीक निर्देशांक (${latStr}, ${lngStr}) के अनुसार गणना किए गए सूर्योदय, सूर्यास्त, तिथि, नक्षत्र, योग, और करण का समय। सभी वैदिक पंचांग तत्व लाहिरी अयनांश और मीउस खगोलीय एल्गोरिदम द्वारा उप-चाप-सेकंड सटीकता के साथ गणना किए गए हैं। यह पृष्ठ प्रतिदिन ${cityName} के स्थानीय समय के अनुसार अपडेट होता है।`
              : `Today's Panchang for ${city.name.en}, ${city.state} — accurate sunrise, sunset, tithi, nakshatra, yoga, and karana timings computed for ${city.name.en}'s exact coordinates (${latStr}, ${lngStr}). All Vedic calendar elements are calculated using the Lahiri Ayanamsha and Meeus astronomical algorithms for sub-arcsecond accuracy. This page updates daily with ${city.name.en}'s local timings, including Rahu Kaal, Yamaganda Kaal, and Gulika Kaal — essential for planning auspicious activities.`}
        </p>
      </div>

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
          detail={`${msg('pada', locale)} ${panchang.nakshatra.pada ?? '—'} · ${msg('ends', locale)}: ${formatTransitionEnd(panchang.nakshatraTransition, loc)}`}
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
            {panchang.samvatsara?.[loc] || panchang.samvatsara?.en || '—'}
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
            value={panchang.rahuKaal ? `${panchang.rahuKaal.start} – ${panchang.rahuKaal.end}` : '—'}
            colorClass="text-red-400 border-red-500/20 bg-red-500/5"
          />
          <InauspiciousCard
            label={msg('yamaganda', locale)}
            value={panchang.yamaganda ? `${panchang.yamaganda.start} – ${panchang.yamaganda.end}` : '—'}
            colorClass="text-orange-400 border-orange-500/20 bg-orange-500/5"
          />
          <InauspiciousCard
            label={msg('gulikaKaal', locale)}
            value={panchang.gulikaKaal ? `${panchang.gulikaKaal.start} – ${panchang.gulikaKaal.end}` : '—'}
            colorClass="text-amber-400 border-amber-500/20 bg-amber-500/5"
          />
        </div>
      </div>

      {/* ═══ CALCULATION PROOF — TRANSPARENT AUDIT TRAIL ═══ */}
      <div className="mb-10">
        <details className="group rounded-2xl border border-gold-primary/10 bg-bg-secondary/30">
          <summary className="flex items-center gap-3 cursor-pointer px-6 py-4 text-gold-primary text-sm font-medium hover:text-gold-light transition-colors">
            <ChevronRight size={16} className="group-open:rotate-90 transition-transform flex-shrink-0" />
            {isHi ? 'गणना प्रमाण — पारदर्शी लेखा परीक्षा' : 'Calculation Proof — How These Values Were Computed'}
          </summary>
          <div className="px-6 pb-5 space-y-4 text-sm text-text-secondary">
            <p className="text-text-secondary/70">
              {isHi
                ? `सभी मान ${cityName} के सटीक निर्देशांकों से गणना किए गए हैं। कोई सन्निकटन या डिफ़ॉल्ट नहीं।`
                : `All values computed from ${city.name.en}'s exact coordinates using Swiss Ephemeris precision. No approximations or defaults.`}
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-bg-primary/50 rounded-xl p-4 border border-white/5 font-mono text-xs">
              <div className="text-text-secondary/50">{isHi ? 'अक्षांश' : 'Latitude'}</div>
              <div className="text-text-primary">{city.lat.toFixed(4)}°{latDir}</div>
              <div className="text-text-secondary/50">{isHi ? 'देशांतर' : 'Longitude'}</div>
              <div className="text-text-primary">{city.lng.toFixed(4)}°{lngDir}</div>
              <div className="text-text-secondary/50">{isHi ? 'समय क्षेत्र' : 'Timezone'}</div>
              <div className="text-text-primary">{city.timezone} (UTC{tzOffset >= 0 ? '+' : ''}{tzOffset})</div>
              <div className="text-text-secondary/50">{isHi ? 'अयनांश' : 'Ayanamsha'}</div>
              <div className="text-text-primary">Lahiri (Chitrapaksha)</div>
              <div className="text-text-secondary/50">{isHi ? 'सूर्य अवनति' : 'Sun Depression'}</div>
              <div className="text-text-primary">-0.8333° (USNO standard refraction)</div>
              <div className="text-text-secondary/50">{isHi ? 'तिथि सूत्र' : 'Tithi Formula'}</div>
              <div className="text-text-primary">⌊(Moon° − Sun°) / 12⌋ + 1</div>
              <div className="text-text-secondary/50">{isHi ? 'राहुकाल सूत्र' : 'Rahu Kaal'}</div>
              <div className="text-text-primary">{isHi ? 'दिन का 1/8 भाग, वार-अनुसार' : '1/8th of daytime, weekday-indexed segment'}</div>
            </div>
            <p className="text-text-secondary/50 text-xs">
              {isHi
                ? 'तिथि संक्रमण समय 30-पुनरावृत्ति द्विभाजन खोज से निर्धारित, ~1 सेकंड सटीकता। सूर्योदय/सूर्यास्त मीउस एल्गोरिदम (2-पास) + वायुमण्डलीय अपवर्तन।'
                : 'Tithi transitions determined by 30-iteration binary search on Moon-Sun elongation (~1-second precision). Sunrise/sunset via 2-pass Meeus algorithm with atmospheric refraction.'}
            </p>
          </div>
        </details>
      </div>

      {/* ═══ SPECIAL YOGAS (Dwipushkar, Tripushkar, Sarvartha Siddhi, etc.) ═══ */}
      {panchang.specialYogas && panchang.specialYogas.filter(y => y.isActive).length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gold-light mb-5 text-center">
            {isHi ? 'आज के विशेष योग' : 'Special Yogas Today'}
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

      {/* ═══ CTA — DETAILED PANCHANG ═══ */}
      <div className="rounded-2xl bg-gradient-to-r from-gold-primary/10 via-gold-primary/5 to-transparent border border-gold-primary/20 p-6 text-center mb-12">
        <h3 className="text-lg font-bold text-gold-light mb-2">
            {msg('viewDetailed', locale)}
        </h3>
        <p className="text-text-secondary text-sm mb-4">
          {locale === 'en' ? `Planetary positions, Choghadiya, Hora, Disha Shool — everything for ${city.name.en}` : `ग्रह स्थिति, चौघड़िया, होरा, दिशा शूल — ${cityName} के लिए सब कुछ`}
        </p>
        <Link
          href={`/${locale}/panchang?lat=${city.lat}&lng=${city.lng}&name=${encodeURIComponent(city.name.en)}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-primary/20 border border-gold-primary/40 text-gold-light font-bold hover:bg-gold-primary/30 transition-colors"
        >
          {msg('fullPanchang', locale)}
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* ═══ ABOUT THIS CITY PANCHANG — SEO CONTENT ═══ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gold-light mb-4">
          {`${msg('aboutPanchang', locale)} ${city.name.en}`}
        </h2>
        <div className="prose prose-invert max-w-none text-text-primary/75 text-sm leading-relaxed space-y-4">
          {isHi ? (
            <>
              <p>
                {cityName} ({city.state}) के लिए दैनिक वैदिक पंचांग — प्रत्येक दिन {cityName} के अक्षांश {latStr} और देशांतर {lngStr} के अनुसार सटीक गणना। पंचांग के पाँच अंग — तिथि, वार, नक्षत्र, योग, और करण — शुभ मुहूर्त चयन और दैनिक धार्मिक कृत्यों के लिए अनिवार्य हैं।
              </p>
              <p>
                सभी गणनाएँ लाहिरी अयनांश (चित्रपक्ष) पर आधारित हैं, जो भारत के अधिकांश पंचांग कर्ताओं द्वारा प्रयुक्त होता है। सूर्योदय और सूर्यास्त का समय {cityName} के भौगोलिक निर्देशांक और {city.timezone} समय क्षेत्र के अनुसार गणना किया गया है।
              </p>
            </>
          ) : (
            <>
              <p>
                Daily Vedic Panchang for {city.name.en}, {city.state} — calculated each day for the exact latitude {latStr} and longitude {lngStr}. The five limbs of the Panchang — Tithi (lunar day), Vara (weekday), Nakshatra (lunar mansion), Yoga (luni-solar combination), and Karana (half-tithi) — are essential for selecting auspicious timings and daily religious observances.
              </p>
              <p>
                All calculations use the Lahiri Ayanamsha (Chitrapaksha), the most widely used ayanamsha in Indian astrology. Sunrise and sunset times are computed for {city.name.en}{`'`}s geographic coordinates using the {city.timezone} timezone, accounting for daylight saving transitions where applicable. Rahu Kaal, Yamaganda Kaal, and Gulika Kaal are derived from the classical Vara-based formula.
              </p>
              <p>
                This page is server-rendered and updated daily. For personalized readings including planetary transit effects on your birth chart, use the interactive Panchang with your exact location.
              </p>
            </>
          )}
        </div>

        {/* ═══ DAILY NARRATIVE ARTICLE ═══ */}
        {articleBody && (
          <div className="mt-8 border-t border-gold-primary/15 pt-8">
            <div className="space-y-4 text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
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
                {isHi ? c.name.hi : c.name.en}
              </div>
              <div className="text-text-secondary/50 text-xs">{c.state}</div>
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
