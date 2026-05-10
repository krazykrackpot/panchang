/**
 * Panchang Page  –  Server Component Wrapper
 *
 * Renders an SEO-visible summary block (server-side, fully crawlable)
 * then mounts the interactive client component below it.
 *
 * The SSR block uses Vercel geo headers to compute today's panchang
 * for the user's approximate location  –  same pattern as the home page.
 */

import { headers } from 'next/headers';
import { Link } from '@/lib/i18n/navigation';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getNakshatraActivity } from '@/lib/constants/nakshatra-activities';
import { getLatestVideo } from '@/lib/youtube/latest-video';
import { MapPin } from 'lucide-react';
import { getCitiesByTier } from '@/lib/constants/cities-extended';
import type { PanchangData } from '@/types/panchang';
import PanchangClient from './PanchangClient';

// NO revalidate here  –  page uses headers() for geo-location.
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
  return (
    <section className="max-w-4xl mx-auto px-4 pt-6 pb-2">
      {/* Contextual internal links for SEO (Step 4 from spec) */}
      <nav className="flex flex-wrap gap-2 mb-4 text-xs" aria-label="Related pages">
        <Link href="/kundali" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {locale === 'hi' ? 'कुंडली बनाएं' : 'Generate Kundali'}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/calendar" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {locale === 'hi' ? 'त्योहार कैलेंडर' : 'Festival Calendar'}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/muhurta-ai" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {locale === 'hi' ? 'मुहूर्त कैलेंडर' : 'Muhurat Calendar'}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/transits" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {locale === 'hi' ? 'ग्रह गोचर' : 'Planetary Transits'}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {locale === 'hi' ? 'चौघड़िया' : 'Choghadiya'}
        </Link>
        <span className="text-text-secondary/30">·</span>
        <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
          {locale === 'hi' ? 'राहु काल' : 'Rahu Kaal'}
        </Link>
      </nav>

      {/* Nakshatra Activity Guide  –  condensed for SEO */}
      {panchang.nakshatra?.id && (() => {
        const nkActivity = getNakshatraActivity(panchang.nakshatra.id);
        if (!nkActivity) return null;
        return (
          <div className="mt-4 mb-4">
            <p className="text-text-secondary text-xs mb-2">
              {locale === 'hi' ? 'आज का मार्गदर्शन' : "Today's Guidance"}
            </p>
            <p className="text-gold-light text-sm">
              {locale === 'hi' ? nkActivity.theme.hi : nkActivity.theme.en}
            </p>
            {nkActivity.goodFor.length > 0 && (
              <div className="flex gap-2 mt-1 flex-wrap">
                {nkActivity.goodFor.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-emerald-400 bg-emerald-500/10"
                  >
                    {locale === 'hi' ? item.hi : item.en}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Direct answer statements for featured snippet capture */}
      {panchang.tithi?.name && panchang.nakshatra?.name && (() => {
        const tithiName = locale === 'hi' ? panchang.tithi.name.hi : panchang.tithi.name.en;
        const nakName = locale === 'hi' ? panchang.nakshatra.name.hi : panchang.nakshatra.name.en;
        const yogaName = locale === 'hi' ? panchang.yoga?.name?.hi : panchang.yoga?.name?.en;
        const varaName = locale === 'hi' ? panchang.vara?.name?.hi : panchang.vara?.name?.en;
        const nkActivity = getNakshatraActivity(panchang.nakshatra.id);
        const isAuspicious = nkActivity && nkActivity.goodFor.length >= 3;
        const auspLabel = isAuspicious
          ? (locale === 'hi' ? 'शुभ' : 'auspicious')
          : (locale === 'hi' ? 'सामान्य' : 'moderately auspicious');

        return (
          <div className="mt-3 mb-3 text-text-secondary/80 text-xs leading-relaxed space-y-1.5">
            <p>
              {locale === 'hi'
                ? `इस ${varaName || ' – '} को तिथि ${tithiName}, नक्षत्र ${nakName}, और योग ${yogaName || ' – '} है।`
                : `This ${varaName || ' – '} brings ${tithiName} Tithi under ${nakName} Nakshatra, with ${yogaName || ' – '} Yoga.`}
              {' '}
              {locale === 'hi'
                ? `दिन ${auspLabel} है  –  ${nakName} नक्षत्र ${nkActivity ? (nkActivity.goodFor.map(g => g.hi).join(', ') || 'सामान्य कार्यों') : 'सामान्य कार्यों'} के लिए अनुकूल रहता है।`
                : `The day is ${auspLabel}  –  ${nakName} favors ${nkActivity ? (nkActivity.goodFor.map(g => g.en).join(', ') || 'general activities') : 'general activities'}.`}
              {' '}
              {locale === 'hi'
                ? `राहु काल ${panchang.rahuKaal?.start || ' – '} से ${panchang.rahuKaal?.end || ' – '} तक रहेगा, इस दौरान नए शुभ कार्य न आरम्भ करें।`
                : `Rahu Kaal runs ${panchang.rahuKaal?.start || ' – '}–${panchang.rahuKaal?.end || ' – '}; hold off on new beginnings during that window.`}
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
  const { panchang, location: serverLocation } = await getServerPanchang();

  // Fetch latest YouTube video (RSS feed, cached 1h) for VideoObject schema + embed
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const latestVideo = await getLatestVideo();

  // VideoObject schema  –  real video URL makes search result 2x larger on mobile
  const videoLd = latestVideo ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: latestVideo.title,
    description: `Vedic Panchang for ${dateStr}: ${panchang?.tithi?.name?.en || ''}, ${panchang?.nakshatra?.name?.en || ''}, ${panchang?.yoga?.name?.en || ''}. Rahu Kaal ${panchang?.rahuKaal?.start || ''}–${panchang?.rahuKaal?.end || ''}.`,
    thumbnailUrl: latestVideo.thumbnail,
    uploadDate: latestVideo.published.includes('T') ? latestVideo.published : `${latestVideo.published}T00:00:00+00:00`,
    contentUrl: `https://www.youtube.com/watch?v=${latestVideo.videoId}`,
    embedUrl: `https://www.youtube.com/embed/${latestVideo.videoId}`,
    duration: 'PT60S',
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      logo: { '@type': 'ImageObject', url: 'https://dekhopanchang.com/icon-512.png' },
    },
  } : null;

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
      {/* VideoObject JSON-LD  –  real video URL makes search result 2x larger on mobile */}
      {videoLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      )}

      {/* Dynamic FAQ JSON-LD for featured snippet capture */}
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
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

      {/* ═══ WHY FIVE ELEMENTS  –  philosophical context, server-rendered ═══ */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light mb-4">
          {locale === 'hi' ? 'पाँच तत्व क्यों?' : 'Why Five Elements?'}
        </h2>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>
            {locale === 'hi'
              ? 'पंचांग (पञ्च + अङ्ग = पाँच अंग) सूर्य, चन्द्रमा और ब्रह्माण्ड के बीच पाँच — और केवल पाँच — प्रेक्षणीय सम्बन्धों को पकड़ता है। तिथि सूर्य-चन्द्र कोणीय अन्तर मापती है। नक्षत्र स्थिर तारों के सापेक्ष चन्द्रमा को ट्रैक करता है। योग सूर्य और चन्द्र के देशान्तरों को संयोजित करता है। करण तिथि को सूक्ष्मतर स्पन्दनों में विभाजित करता है। वार (सप्ताह दिवस) ग्रह होरा क्रम का पालन करता है।'
              : 'The Panchang (pancha + anga = five limbs) captures the five — and only five — observable relationships between the Sun, Moon, and the cosmos. Tithi measures the Sun-Moon angular separation. Nakshatra tracks the Moon against the fixed stars. Yoga combines the solar and lunar longitudes. Karana divides the tithi into finer pulses. Vara (weekday) follows the planetary hour sequence.'}
          </p>
          <p>
            {locale === 'hi'
              ? 'ये मनमाने विभाजन नहीं हैं — ये इस त्रिकाय प्रणाली में स्वतन्त्र खगोलीय प्रेक्षणों का सम्पूर्ण समुच्चय हैं। प्राचीन खगोलविदों ने पाँच नहीं चुने — पाँच ही सम्भव हैं। प्रत्येक गणना सूर्य सिद्धान्त के एल्गोरिदम पर आधारित है, जिनकी सटीकता आधुनिक उपकरणों ने पुष्ट की है।'
              : 'These are not arbitrary divisions — they are the complete set of independent astronomical observables in this three-body system. The ancient astronomers did not choose five — five is all there is. Each calculation is computed from real planetary positions using Surya Siddhanta algorithms, whose precision modern instruments have confirmed.'}
          </p>
        </div>
      </section>

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
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mai';

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
        {isHi ? 'शहर के अनुसार पंचांग' : 'Panchang by City'}
      </h2>
      <p className="text-text-secondary text-sm text-center mb-8 max-w-2xl mx-auto">
        {isHi
          ? 'अपने शहर के लिए सटीक सूर्योदय, सूर्यास्त, तिथि, नक्षत्र और राहु काल का समय देखें।'
          : 'View accurate sunrise, sunset, tithi, nakshatra, and Rahu Kaal timings for your city.'}
      </p>

      {/* Indian Cities */}
      <h3 className="text-gold-primary text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
        <MapPin size={14} />
        {isHi ? 'भारतीय शहर' : 'Indian Cities'}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
        {indianCities.map(city => (
          <Link
            key={city.slug}
            href={`/${locale}/panchang/${city.slug}`}
            className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] px-4 py-3 text-center hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-all group"
          >
            <div className="text-gold-light text-sm font-medium group-hover:text-gold-primary transition-colors">
              {isHi ? city.name.hi : city.name.en}
            </div>
            <div className="text-text-secondary/50 text-xs">{city.state}</div>
          </Link>
        ))}
      </div>

      {/* Diaspora Cities */}
      <h3 className="text-gold-primary text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
        <MapPin size={14} />
        {isHi ? 'अंतर्राष्ट्रीय शहर' : 'International Cities'}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
        {diasporaCities.map(city => (
          <Link
            key={city.slug}
            href={`/${locale}/panchang/${city.slug}`}
            className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] px-4 py-3 text-center hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-all group"
          >
            <div className="text-gold-light text-sm font-medium group-hover:text-gold-primary transition-colors">
              {isHi ? city.name.hi : city.name.en}
            </div>
            <div className="text-text-secondary/50 text-xs">{city.state}</div>
          </Link>
        ))}
      </div>

      {/* Link to full locations page */}
      <div className="text-center">
        <Link
          href={`/${locale}/panchang/locations`}
          className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light text-sm font-medium transition-colors"
        >
          {isHi ? 'सभी 800+ शहर देखें →' : 'View all 800+ cities →'}
        </Link>
      </div>
    </section>
  );
}
