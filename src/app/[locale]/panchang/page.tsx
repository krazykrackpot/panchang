/**
 * Panchang Page  –  Server Component Wrapper
 *
 * Renders an SEO-visible summary block (server-side, fully crawlable)
 * then mounts the interactive client component below it.
 *
 * The SSR block uses Vercel geo headers to compute today's panchang
 * for the user's approximate location  –  same pattern as the home page.
 */

import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { Link } from '@/lib/i18n/navigation';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getNakshatraActivity } from '@/lib/constants/nakshatra-activities';
import { getLatestVideo } from '@/lib/youtube/latest-video';
import { MapPin } from 'lucide-react';
import { getCitiesByTier } from '@/lib/constants/cities-extended';
import type { PanchangData } from '@/types/panchang';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import LearnConceptsBlock from '@/components/seo/LearnConceptsBlock';
import PanchangClient from './PanchangClient';
import { pickPanchangLabel, formatPanchangLabel } from '@/lib/content/panchang-page-labels';
import { tl } from '@/lib/utils/trilingual';
import { TITHIS } from '@/lib/constants/tithis';

// Inline tithi-name lookups for the Why-Five-Elements links. The
// inline link labels (Ekadashi / Purnima / Amavasya) read from the
// canonical TITHIS table so we get all 9 locales without duplicating
// translations in the labels overlay.
function tithiNameByNumber(n: number, locale: string): string {
  const t = TITHIS.find((x) => x.number === n);
  return tl(t?.name, locale);
}
const ekadashiLabel = (locale: string) => tithiNameByNumber(11, locale);
const purnimaLabel  = (locale: string) => tithiNameByNumber(15, locale);
const amavasyaLabel = (locale: string) => tithiNameByNumber(30, locale);

// NO revalidate here  –  page reads request headers for geo-location.
// ISR would cache one user's city and serve wrong panchang to others.
// CPU protection via API-level caching (s-maxage=43200 on /api/panchang).

// ---------------------------------------------------------------------------
// Server-side panchang computation
// ---------------------------------------------------------------------------

interface ServerPanchangResult {
  panchang: PanchangData | null;
  location: { lat: number; lng: number; name: string; timezone: string } | null;
}

async function getServerPanchang(): Promise<ServerPanchangResult> {
  try {
    const hdrs = await headers();
    const geoLat = hdrs.get('x-vercel-ip-latitude');
    const geoLng = hdrs.get('x-vercel-ip-longitude');
    const geoCity = hdrs.get('x-vercel-ip-city');
    const geoCountry = hdrs.get('x-vercel-ip-country');
    const geoTz = hdrs.get('x-vercel-ip-timezone');

    if (geoLat && geoLng) {
      const lat = parseFloat(geoLat);
      const lng = parseFloat(geoLng);
      const locationName = [geoCity ? decodeURIComponent(geoCity) : '', geoCountry || ''].filter(Boolean).join(', ');
      const timezone = geoTz || 'UTC';
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const tzOffset = getUTCOffsetForDate(year, month, day, timezone);
      const panchang = computePanchang({ year, month, day, lat, lng, tzOffset, timezone, locationName });
      return { panchang, location: { lat, lng, name: locationName, timezone } };
    }
  } catch {
    // Geo headers unavailable (local dev)  –  fallback below
  }
  return { panchang: null, location: null };
}

// ---------------------------------------------------------------------------
// SEO Summary Block (server-rendered, fully crawlable)
// ---------------------------------------------------------------------------

function PanchangSEOBlock({
  panchang,
  locale,
}: {
  panchang: PanchangData;
  locale: string;
}) {
  // SEO step 2 cross-link: surface tomorrow's panchang URL so Google
  // discovers /panchang/date/[date] from the root page.
  //
  // Gemini #240 HIGH: derive tomorrow from `panchang.date` (the user's
  // local panchang day for their resolved geo). Using Date.now() would
  // be a UTC-clock instant — an IN user at 02:00 IST is still on the
  // previous UTC day, so the "Tomorrow" link would point at today in
  // their wall-clock. Anchoring to panchang.date eliminates that.
  const [pY, pM, pD] = panchang.date.split('-').map(Number);
  const tomorrowDate = new Date(Date.UTC(pY, pM - 1, pD) + 86_400_000);
  const tomorrowStr =
    `${tomorrowDate.getUTCFullYear()}-${String(tomorrowDate.getUTCMonth() + 1).padStart(2, '0')}-${String(tomorrowDate.getUTCDate()).padStart(2, '0')}`;

  return (
    <section className="max-w-4xl mx-auto px-4 pt-6 pb-2">
      {/* Contextual internal links for SEO (Step 4 from spec) */}
      <nav className="flex flex-wrap gap-2 mb-4 text-xs" aria-label="Related pages">
        <Link href="/kundali" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {pickPanchangLabel('generateKundali', locale)}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/calendar" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {pickPanchangLabel('festivalCalendar', locale)}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/muhurta-ai" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {pickPanchangLabel('muhuratCalendar', locale)}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/transits" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {pickPanchangLabel('planetaryTransits', locale)}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {pickPanchangLabel('choghadiya', locale)}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {pickPanchangLabel('rahuKaal', locale)}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/horoscope" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {pickPanchangLabel('dailyHoroscope', locale)}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/baby-names" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {pickPanchangLabel('babyNames', locale)}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link
          href={`/panchang/date/${tomorrowStr}`}
          className="text-gold-primary/70 hover:text-gold-light transition-colors"
        >
          {pickPanchangLabel('tomorrowsPanchang', locale)}
        </Link>
      </nav>

      {/* Nakshatra Activity Guide  –  condensed for SEO.
          The activity data ships en/hi only (27 nakshatras × N entries); for
          other locales we fall back to hi for Indo-Aryan readers and en
          otherwise. The page chrome around it is fully localised. */}
      {panchang.nakshatra?.id && (() => {
        const nkActivity = getNakshatraActivity(panchang.nakshatra.id);
        if (!nkActivity) return null;
        return (
          <div className="mt-4 mb-4">
            <p className="text-text-secondary text-xs mb-2">
              {pickPanchangLabel('todaysGuidance', locale)}
            </p>
            <p className="text-gold-light text-sm">
              {tl(nkActivity.theme, locale)}
            </p>
            {nkActivity.goodFor.length > 0 && (
              <div className="flex gap-2 mt-1 flex-wrap">
                {nkActivity.goodFor.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-emerald-400 bg-emerald-500/10"
                  >
                    {tl(item, locale)}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Direct answer statements for featured snippet capture */}
      {panchang.tithi?.name && panchang.nakshatra?.name && (() => {
        const tithiName = tl(panchang.tithi.name, locale);
        const nakName = tl(panchang.nakshatra.name, locale);
        const yogaName = tl(panchang.yoga?.name, locale) || ' – ';
        const varaName = tl(panchang.vara?.name, locale) || ' – ';
        const nkActivity = getNakshatraActivity(panchang.nakshatra.id);
        const isAuspicious = nkActivity && nkActivity.goodFor.length >= 3;
        const auspLabel = pickPanchangLabel(
          isAuspicious ? 'auspicious' : 'moderatelyAuspicious',
          locale,
        );
        const activitiesList = nkActivity
          ? nkActivity.goodFor.map(g => tl(g, locale)).join(', ')
            || pickPanchangLabel('snippetActivitiesFallback', locale)
          : pickPanchangLabel('snippetActivitiesFallback', locale);
        const rkStart = panchang.rahuKaal?.start || ' – ';
        const rkEnd = panchang.rahuKaal?.end || ' – ';

        return (
          <div className="mt-3 mb-3 text-text-secondary/80 text-xs leading-relaxed space-y-1.5">
            <p>
              {formatPanchangLabel('snippetIntro', locale, {
                VARA: varaName,
                TITHI: tithiName,
                NAK: nakName,
                YOGA: yogaName,
              })}
              {' '}
              {formatPanchangLabel('snippetActivities', locale, {
                AUSP: auspLabel,
                NAK: nakName,
                ACTIVITIES: activitiesList,
              })}
              {' '}
              {formatPanchangLabel('snippetRahu', locale, {
                START: rkStart,
                END: rkEnd,
              })}
            </p>
          </div>
        );
      })()}

      <div className="border-t border-gold-primary/8" />
    </section>
  );
}


// ---------------------------------------------------------------------------
// Page component (async server component)
// ---------------------------------------------------------------------------

export default async function PanchangPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { panchang, location: serverLocation } = await getServerPanchang();

  // Fetch latest YouTube video (RSS feed, cached 1h) for VideoObject schema + embed
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const latestVideo = await getLatestVideo();

  // VideoObject schema REMOVED — panchang is not a "watch page" (video is secondary content).
  // Google rejects VideoObject on non-watch pages: "Video isn't on a watch page".
  // The YouTube embed stays for users; we just don't claim it as structured data.

  // Dynamic FAQ schema with today's actual panchang values
  const tithiEn = panchang?.tithi?.name?.en || ' – ';
  const nakEn = panchang?.nakshatra?.name?.en || ' – ';
  const yogaEn = panchang?.yoga?.name?.en || ' – ';
  const varaEn = panchang?.vara?.name?.en || ' – ';
  const rkStart = panchang?.rahuKaal?.start || ' – ';
  const rkEnd = panchang?.rahuKaal?.end || ' – ';
  const faqLd = panchang ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is today's Tithi?`,
        acceptedAnswer: { '@type': 'Answer', text: `The Tithi on ${dateStr} is ${tithiEn} (${panchang.tithi?.paksha || ''} Paksha), active until ${panchang.tithi?.endTime || ' – '}.` },
      },
      {
        '@type': 'Question',
        name: `What is today's Nakshatra?`,
        acceptedAnswer: { '@type': 'Answer', text: `${nakEn} Nakshatra is active on ${dateStr}, lasting until ${panchang.nakshatraTransition?.endTime || ' – '}.` },
      },
      {
        '@type': 'Question',
        name: `What time is Rahu Kaal today?`,
        acceptedAnswer: { '@type': 'Answer', text: `Rahu Kaal on ${varaEn} (${dateStr}) runs from ${rkStart} to ${rkEnd}. Avoid initiating auspicious activities during this window.` },
      },
      {
        '@type': 'Question',
        name: `Is today auspicious for new activities?`,
        acceptedAnswer: { '@type': 'Answer', text: `${varaEn} with ${tithiEn} Tithi and ${nakEn} Nakshatra under ${yogaEn} Yoga. Check the detailed muhurta timings on Dekho Panchang for activity-specific guidance.` },
      },
    ],
  } : null;

  return (
    <>
      {/* VideoObject JSON-LD removed — panchang is not a "watch page" */}

      {/* Dynamic FAQ JSON-LD for featured snippet capture */}
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLd) }} />
      )}

      {/* SEO block: server-rendered, fully crawlable by Google */}
      {panchang && (
        <PanchangSEOBlock
          panchang={panchang}
          locale={locale}
        />
      )}

      {/* Interactive client component: takes over for full functionality.
          Server panchang data is passed as props so the page renders immediately
          without waiting for client-side geo detection + API fetch (LCP fix).
          min-h reserves space to prevent CLS while client JS hydrates. */}
      <div className="min-h-[800px] sm:min-h-[600px]">
        <PanchangClient
          serverPanchang={panchang}
          serverLocation={serverLocation}
          latestVideo={latestVideo}
        />
      </div>

      {/* ═══ WHY FIVE ELEMENTS  –  philosophical context, server-rendered.
          The first paragraph wraps three inline <Link>s. To keep the markup
          intact while serving 9 locales we split the surrounding prose into
          Pre / Sep / And / Post chunks; tithi names (एकादशी / Ekadashi /
          ஏகாதசி …) come from existing trilingual constants via tl(). ═══ */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light mb-4">
          {pickPanchangLabel('whyFiveElementsHeading', locale)}
        </h2>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>
            {pickPanchangLabel('whyFiveElementsPara1Pre', locale)}
            <Link href="/dates/ekadashi" className="text-gold-primary hover:text-gold-light underline">{ekadashiLabel(locale)}</Link>
            {pickPanchangLabel('whyFiveElementsPara1Sep', locale)}
            <Link href="/dates/purnima" className="text-gold-primary hover:text-gold-light underline">{purnimaLabel(locale)}</Link>
            {pickPanchangLabel('whyFiveElementsPara1And', locale)}
            <Link href="/dates/amavasya" className="text-gold-primary hover:text-gold-light underline">{amavasyaLabel(locale)}</Link>
            {pickPanchangLabel('whyFiveElementsPara1Post', locale)}
          </p>
          <p>{pickPanchangLabel('whyFiveElementsPara2', locale)}</p>
        </div>
      </section>

      {/* Learn Vedic concepts — helpful-content signal + internal authority
          to /learn/* hub. Shared with /panchang/date and /panchang/[city]. */}
      <LearnConceptsBlock locale={locale} />

      {/* Popular Cities section  –  server-rendered for SEO crawl paths to /panchang/[city] */}
      <PopularCitiesSection locale={locale} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Popular Cities Section (server-rendered, gives Google crawl paths)
// ---------------------------------------------------------------------------

/** Curated city slugs: top Indian cities + key diaspora cities */
const FEATURED_INDIAN_SLUGS = [
  'delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kolkata',
  'ahmedabad', 'pune', 'jaipur', 'lucknow', 'varanasi', 'patna',
  'surat', 'indore', 'nagpur', 'chandigarh', 'bhopal', 'kanpur',
  'coimbatore', 'kochi',
];
const FEATURED_DIASPORA_SLUGS = [
  'new-york', 'london', 'toronto', 'sydney', 'singapore', 'dubai',
];

function PopularCitiesSection({ locale }: { locale: string }) {
  const tier1 = getCitiesByTier(1);

  // Build ordered list: Indian first, then diaspora
  const indianCities = FEATURED_INDIAN_SLUGS
    .map(slug => tier1.find(c => c.slug === slug))
    .filter(Boolean) as typeof tier1;
  const diasporaCities = FEATURED_DIASPORA_SLUGS
    .map(slug => tier1.find(c => c.slug === slug))
    .filter(Boolean) as typeof tier1;

  return (
    <section className="max-w-5xl mx-auto px-4 pb-16 pt-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gold-light text-center mb-3">
        {pickPanchangLabel('panchangByCity', locale)}
      </h2>
      <p className="text-text-secondary text-sm text-center mb-8 max-w-2xl mx-auto">
        {pickPanchangLabel('panchangByCityIntro', locale)}
      </p>

      {/* Indian Cities */}
      <h3 className="text-gold-primary text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
        <MapPin size={14} />
        {pickPanchangLabel('indianCities', locale)}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
        {indianCities.map(city => (
          <Link
            key={city.slug}
            href={`/panchang/${city.slug}` as any}
            className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] px-4 py-3 text-center hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-all group"
          >
            <div className="text-gold-light text-sm font-medium group-hover:text-gold-primary transition-colors">
              {tl(city.name, locale)}
            </div>
            <div className="text-text-secondary/50 text-xs">{city.state}</div>
          </Link>
        ))}
      </div>

      {/* Diaspora Cities */}
      <h3 className="text-gold-primary text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
        <MapPin size={14} />
        {pickPanchangLabel('internationalCities', locale)}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
        {diasporaCities.map(city => (
          <Link
            key={city.slug}
            href={`/panchang/${city.slug}` as any}
            className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] px-4 py-3 text-center hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-all group"
          >
            <div className="text-gold-light text-sm font-medium group-hover:text-gold-primary transition-colors">
              {tl(city.name, locale)}
            </div>
            <div className="text-text-secondary/50 text-xs">{city.state}</div>
          </Link>
        ))}
      </div>

      {/* Link to full locations page */}
      <div className="text-center">
        <Link
          href={'/panchang/locations' as any}
          className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light text-sm font-medium transition-colors"
        >
          {pickPanchangLabel('viewAll800Cities', locale)}
        </Link>
      </div>
    </section>
  );
}
