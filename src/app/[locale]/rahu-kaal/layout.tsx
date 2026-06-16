import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { pickByScript } from "@/lib/utils/locale-fonts";

import { UJJAIN_REFERENCE } from '@/lib/constants/jyotish-reference';

// Ujjain — reference city for India-wide Rahu Kaal
const REF_LAT = UJJAIN_REFERENCE.lat;
const REF_LNG = UJJAIN_REFERENCE.lng;
const REF_TZ = UJJAIN_REFERENCE.ianaZone;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/rahu-kaal', locale);

  try {
    const now = new Date();
    const tzOffset = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), REF_TZ);
    const istMs = now.getTime() + tzOffset * 3600 * 1000;
    const istDate = new Date(istMs);
    const year = istDate.getUTCFullYear();
    const month = istDate.getUTCMonth() + 1;
    const day = istDate.getUTCDate();

    const p = computePanchang({ year, month, day, lat: REF_LAT, lng: REF_LNG, tzOffset, timezone: REF_TZ, locationName: 'Ujjain' });
    const dateStr = istDate.toLocaleDateString(pickByScript('en-US', 'hi-IN', locale), { month: 'short', day: 'numeric', timeZone: 'UTC' });

    const isHi = locale === 'hi' || locale === 'sa';
    const title = isHi
      ? `आज का राहु काल ${dateStr}: ${p.rahuKaal.start}–${p.rahuKaal.end}`
      : `Rahu Kaal Today ${dateStr}: ${p.rahuKaal.start}–${p.rahuKaal.end}`;

    const desc = isHi
      ? `आज ${dateStr} राहु काल ${p.rahuKaal.start}–${p.rahuKaal.end}। यमगण्ड, गुलिक काल सहित। शहर चुनें, सटीक समय पाएँ।`
      : `Rahu Kaal today ${dateStr}: ${p.rahuKaal.start}–${p.rahuKaal.end}. Plus Yamaganda & Gulika Kaal. Select your city for exact times.`;

    return { ...base, title, description: desc };
  } catch {
    return base;
  }
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faqLD = generateFAQLD('/rahu-kaal', locale);
  const toolLD = generateToolLD(
    'Rahu Kaal Calculator',
    'Check today\'s Rahu Kaal, Yamaganda & Gulika Kaal times for any city. Accurate to the minute.',
    '/rahu-kaal',
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/rahu-kaal`, locale);
  return (
    <>
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {toolLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      )}
      {breadcrumbLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      )}
      {children}
    </>
  );
}
