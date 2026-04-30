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

  return (
    <>
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
