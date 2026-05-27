import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import Script from 'next/script';
import { getPageMetadata } from '@/lib/seo/metadata';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

// Ujjain — the traditional prime meridian of Hindu astronomy (Surya Siddhanta)
const REF_LAT = 23.1765;
const REF_LNG = 75.7885;
const REF_TZ = 'Asia/Kolkata';

// SEO step 1 + Gemini #239: the metadata reads request headers to get
// the Vercel geo city. Without `force-dynamic`, Next.js static
// generation throws DYNAMIC_SERVER_USAGE inside the try/catch — and
// our catch was swallowing it, causing the layout to be statically
// pre-rendered with the Ujjain fallback (geo extraction never runs at
// runtime). Forcing dynamic rendering aligns with the page's actual
// behaviour (already dynamic per-request via `computePanchang` plus
// request-time JSON-LD).
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/panchang', locale);

  // SEO step 1 — extract city from Vercel geo headers when available so the
  // title can read "Today's Panchang — Mumbai, May 27 — Tithi, Nakshatra"
  // for real users. Crawlers / IPs without geo data get the Ujjain-based
  // title that we've always shipped (no degradation).
  let city: string | null = null;
  try {
    const h = await headers();
    // Vercel exposes the resolved city via `x-vercel-ip-city` (URL-encoded).
    const rawCity = h.get('x-vercel-ip-city');
    if (rawCity) {
      const decoded = decodeURIComponent(rawCity).trim();
      // Guard against placeholder values some edges emit (e.g. literal "-")
      if (decoded && decoded !== '-' && decoded.length <= 40) {
        city = decoded;
      }
    }
  } catch {
    // Reading request headers can throw in static-render contexts; non-fatal.
  }

  // Compute today's panchang for Ujjain to inject live values into title
  try {
    const now = new Date();
    const tzOffset = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), REF_TZ);
    const istMs = now.getTime() + tzOffset * 3600 * 1000;
    const istDate = new Date(istMs);
    const year = istDate.getUTCFullYear();
    const month = istDate.getUTCMonth() + 1;
    const day = istDate.getUTCDate();

    const p = computePanchang({ year, month, day, lat: REF_LAT, lng: REF_LNG, tzOffset, timezone: REF_TZ, locationName: 'Ujjain' });
    const dateStr = istDate.toLocaleDateString((locale === 'hi' || locale === 'sa') ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    const isHi = locale === 'hi' || locale === 'sa';
    const tithi = isHi ? p.tithi.name.hi : p.tithi.name.en;
    const nak = isHi ? p.nakshatra.name.hi : p.nakshatra.name.en;

    // Date is safe — main panchang page is dynamic (request-scoped), so always fresh.
    const cityPrefix = city ? `${city}, ` : '';
    const title = isHi
      ? `आज का पंचांग — ${cityPrefix}${dateStr} — ${tithi}, ${nak}`
      : `Today's Panchang — ${cityPrefix}${dateStr} — ${tithi}, ${nak}`;

    const desc = isHi
      ? `${dateStr} पंचांग: ${tithi}, ${nak}, राहु काल ${p.rahuKaal.start}–${p.rahuKaal.end}। सूर्योदय ${p.sunrise}। सटीक वैदिक गणना, निःशुल्क।`
      : `Panchang today: ${tithi}, ${nak}. Rahu Kaal ${p.rahuKaal.start}–${p.rahuKaal.end}. Sunrise ${p.sunrise}. Accurate Vedic calculation, free.`;

    return { ...base, title, description: desc };
  } catch {
    return base;
  }
}

export default async function PanchangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const today = new Date().toISOString().split('T')[0];

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Daily Panchang  –  ${today}`,
    description: 'Hindu Vedic Panchang with Tithi, Nakshatra, Yoga, Karana, Muhurta timings, sunrise/sunset, and planetary positions.',
    startDate: today,
    endDate: today,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    url: `${BASE_URL}/${locale}/panchang`,
    organizer: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    location: {
      '@type': 'VirtualLocation',
      url: `${BASE_URL}/${locale}/panchang`,
    },
    inLanguage: locale === 'hi' ? 'hi' : locale === 'sa' ? 'sa' : 'en',
  };

  // NOTE: FAQ LD intentionally NOT injected here. Child layouts (nakshatra,
  // rashi, tithi, yoga) inject their own FAQPage schemas. Injecting one here
  // too caused "Duplicate field 'FAQPage'" errors in GSC (34 invalid items).
  // The /panchang page itself gets FAQ from the panchang/page.tsx if needed.

  return (
    <>
      <Script id="panchang-ld" type="application/ld+json" strategy="afterInteractive">{JSON.stringify(eventJsonLd)}</Script>
      {children}
    </>
  );
}
