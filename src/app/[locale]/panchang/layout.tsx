import { setRequestLocale } from 'next-intl/server';
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/panchang', locale);

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
    const dateStr = istDate.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

    const isHi = locale === 'hi' || locale === 'sa';
    const tithi = isHi ? p.tithi.name.hi : p.tithi.name.en;
    const nak = isHi ? p.nakshatra.name.hi : p.nakshatra.name.en;

    const title = isHi
      ? `आज का पंचांग ${dateStr} — ${tithi}, ${nak}`
      : `Today's Panchang ${dateStr} — ${tithi}, ${nak}`;

    const desc = isHi
      ? `${dateStr} पंचांग: ${tithi}, ${nak}, राहु काल ${p.rahuKaal.start}–${p.rahuKaal.end}। सूर्योदय ${p.sunrise}। सटीक गणना, निःशुल्क।`
      : `${dateStr} panchang: ${tithi}, ${nak}. Rahu Kaal ${p.rahuKaal.start}–${p.rahuKaal.end}. Sunrise ${p.sunrise}. Accurate, free.`;

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
