/**
 * Panchang Page — Server Component Wrapper
 *
 * Renders an SEO-visible summary block (server-side, fully crawlable)
 * then mounts the interactive client component below it.
 *
 * The SSR block uses Vercel geo headers to compute today's panchang
 * for the user's approximate location — same pattern as the home page.
 */

import { headers } from 'next/headers';
import { Link } from '@/lib/i18n/navigation';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getNakshatraActivity } from '@/lib/constants/nakshatra-activities';
import type { PanchangData } from '@/types/panchang';
import PanchangClient from './PanchangClient';

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
    // Geo headers unavailable (local dev) — fallback below
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
        <Link href="/muhurat" className="text-gold-primary/70 hover:text-gold-light transition-colors">
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

      {/* Nakshatra Activity Guide — condensed for SEO */}
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
                ? `आज की तिथि ${tithiName} है, नक्षत्र ${nakName} है, और योग ${yogaName || '—'} है। आज ${varaName || '—'} है।`
                : `Today's Tithi is ${tithiName}, Nakshatra is ${nakName}, and Yoga is ${yogaName || '—'}. Today is ${varaName || '—'}.`}
            </p>
            <p>
              {locale === 'hi'
                ? `आज का दिन ${auspLabel} है। ${nakName} नक्षत्र ${nkActivity ? (nkActivity.goodFor.map(g => g.hi).join(', ') || 'सामान्य कार्यों') : 'सामान्य कार्यों'} के लिए अनुकूल है।`
                : `Today is ${auspLabel}. ${nakName} Nakshatra favors ${nkActivity ? (nkActivity.goodFor.map(g => g.en).join(', ') || 'general activities') : 'general activities'}.`}
            </p>
            <p>
              {locale === 'hi'
                ? `राहु काल ${panchang.rahuKaal?.start || '—'} से ${panchang.rahuKaal?.end || '—'} तक है — इस अवधि में शुभ कार्य टालें।`
                : `Rahu Kaal is from ${panchang.rahuKaal?.start || '—'} to ${panchang.rahuKaal?.end || '—'} — avoid starting auspicious activities during this period.`}
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

  // VideoObject schema — links to daily YouTube Short for Google Video/Discover
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const videoLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `Daily Panchang — ${panchang?.tithi?.name?.en || 'Vedic Calendar'} | ${dateStr}`,
    description: `Today's Vedic Panchang: ${panchang?.tithi?.name?.en || ''}, ${panchang?.nakshatra?.name?.en || ''}, ${panchang?.yoga?.name?.en || ''}. Rahu Kaal ${panchang?.rahuKaal?.start || ''}-${panchang?.rahuKaal?.end || ''}.`,
    thumbnailUrl: 'https://dekhopanchang.com/icon-512.png',
    uploadDate: dateStr,
    contentUrl: `https://www.youtube.com/@DekhoPanchang/shorts`,
    embedUrl: `https://www.youtube.com/@DekhoPanchang/shorts`,
    duration: 'PT30S',
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      logo: { '@type': 'ImageObject', url: 'https://dekhopanchang.com/icon-512.png' },
    },
  };

  // Dynamic FAQ schema with today's actual panchang values
  const faqLd = panchang ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is today's Tithi?`,
        acceptedAnswer: { '@type': 'Answer', text: `Today's Tithi is ${panchang.tithi?.name?.en || '—'}.` },
      },
      {
        '@type': 'Question',
        name: `What is today's Nakshatra?`,
        acceptedAnswer: { '@type': 'Answer', text: `Today's Nakshatra is ${panchang.nakshatra?.name?.en || '—'}.` },
      },
      {
        '@type': 'Question',
        name: `What is Rahu Kaal today?`,
        acceptedAnswer: { '@type': 'Answer', text: `Rahu Kaal today is from ${panchang.rahuKaal?.start || '—'} to ${panchang.rahuKaal?.end || '—'}. Avoid starting auspicious activities during this period.` },
      },
      {
        '@type': 'Question',
        name: `Is today auspicious?`,
        acceptedAnswer: { '@type': 'Answer', text: `Today is ${panchang.vara?.name?.en || '—'} with ${panchang.tithi?.name?.en || '—'} Tithi and ${panchang.nakshatra?.name?.en || '—'} Nakshatra. The Yoga is ${panchang.yoga?.name?.en || '—'}. Check the detailed muhurta timings for specific activities.` },
      },
    ],
  } : null;

  return (
    <>
      {/* VideoObject JSON-LD — Google Video/Discover feed */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />

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
        />
      </div>
    </>
  );
}
