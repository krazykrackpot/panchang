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
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { tl as _tl } from '@/lib/utils/trilingual';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { getNakshatraActivity } from '@/lib/constants/nakshatra-activities';
import type { PanchangData } from '@/types/panchang';
import PanchangClient from './PanchangClient';

// ---------------------------------------------------------------------------
// Server-side panchang computation
// ---------------------------------------------------------------------------

async function getServerPanchang(): Promise<{ panchang: PanchangData | null; locationName: string }> {
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
      return { panchang, locationName };
    }
  } catch {
    // Geo headers unavailable (local dev) — fallback below
  }
  return { panchang: null, locationName: '' };
}

// ---------------------------------------------------------------------------
// SEO Summary Block (server-rendered, fully crawlable)
// ---------------------------------------------------------------------------

function PanchangSEOBlock({
  panchang,
  locationName,
  locale,
  t,
}: {
  panchang: PanchangData;
  locationName: string;
  locale: string;
  t: (key: string) => string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tl = (obj: any): string => {
    if (!obj) return '';
    return _tl(obj, locale);
  };

  const dateFormatted = new Date(panchang.date + 'T00:00:00').toLocaleDateString(
    locale === 'hi' ? 'hi-IN' : locale === 'ta' ? 'ta-IN' : locale === 'bn' ? 'bn-IN' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  );

  return (
    <section className="max-w-4xl mx-auto px-4 pt-6 pb-2" aria-label="Today's Panchang Summary">
      {/* H1 with date for SEO */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gold-light mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        {locale === 'hi' ? 'आज का पंचांग' : locale === 'ta' ? 'இன்றைய பஞ்சாங்கம்' : locale === 'bn' ? 'আজকের পঞ্জিকা' : "Today's Panchang"}
      </h1>
      <p className="text-text-secondary text-sm mb-4">
        {dateFormatted}
        {locationName && <span className="ml-2 text-text-secondary/60">— {locationName}</span>}
      </p>

      {/* Panchang summary grid — fully crawlable static HTML */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <PanchangItem
          label={locale === 'hi' ? 'तिथि' : 'Tithi'}
          value={tl(panchang.tithi?.name)}
          learnHref="/learn/tithis"
          deepDiveHref="/panchang/tithi"
          locale={locale}
        />
        <PanchangItem
          label={locale === 'hi' ? 'नक्षत्र' : 'Nakshatra'}
          value={tl(panchang.nakshatra?.name)}
          learnHref="/learn/nakshatras"
          deepDiveHref="/panchang/nakshatra"
          locale={locale}
        />
        <PanchangItem
          label={locale === 'hi' ? 'योग' : 'Yoga'}
          value={tl(panchang.yoga?.name)}
          learnHref="/learn/yogas"
          deepDiveHref="/panchang/yoga"
          locale={locale}
        />
        <PanchangItem
          label={locale === 'hi' ? 'करण' : 'Karana'}
          value={tl(panchang.karana?.name)}
          learnHref="/learn/karanas"
          deepDiveHref="/panchang/karana"
          locale={locale}
        />
        <PanchangItem
          label={locale === 'hi' ? 'वार' : 'Vara'}
          value={tl(panchang.vara?.name)}
          locale={locale}
        />
        <div className="rounded-lg border border-gold-primary/10 bg-bg-secondary/50 p-3">
          <p className="text-text-secondary text-xs mb-1">{locale === 'hi' ? 'सूर्योदय / सूर्यास्त' : 'Sunrise / Sunset'}</p>
          <p className="text-text-primary text-sm font-medium">
            {panchang.sunrise} / {panchang.sunset}
          </p>
        </div>
      </div>

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
// Panchang item sub-component
// ---------------------------------------------------------------------------

function PanchangItem({
  label,
  value,
  learnHref,
  deepDiveHref,
  locale,
}: {
  label: string;
  value: string;
  learnHref?: string;
  deepDiveHref?: string;
  locale: string;
}) {
  return (
    <div className="rounded-lg border border-gold-primary/10 bg-bg-secondary/50 p-3">
      <p className="text-text-secondary text-xs mb-1">{label}</p>
      <p className="text-gold-light text-sm font-semibold">{value || '—'}</p>
      {(learnHref || deepDiveHref) && (
        <div className="flex gap-2 mt-1.5">
          {deepDiveHref && (
            <Link href={deepDiveHref} className="text-gold-primary/60 text-[10px] hover:text-gold-light transition-colors">
              {locale === 'hi' ? 'विस्तार' : 'Explore'}
            </Link>
          )}
          {learnHref && (
            <Link href={learnHref} className="text-gold-primary/60 text-[10px] hover:text-gold-light transition-colors">
              {locale === 'hi' ? 'सीखें' : 'Learn'}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component (async server component)
// ---------------------------------------------------------------------------

export default async function PanchangPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'panchang' });

  const { panchang, locationName } = await getServerPanchang();

  return (
    <>
      {/* SEO block: server-rendered, fully crawlable by Google */}
      {panchang && (
        <PanchangSEOBlock
          panchang={panchang}
          locationName={locationName}
          locale={locale}
          t={(key: string) => { try { return t(key); } catch { return key; } }}
        />
      )}

      {/* Interactive client component: takes over for full functionality */}
      <PanchangClient />
    </>
  );
}
