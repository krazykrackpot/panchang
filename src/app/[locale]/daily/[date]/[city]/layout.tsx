import { setRequestLocale } from 'next-intl/server';
import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';
import { getCityBySlug } from '@/lib/constants/cities';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { buildHreflangMap } from '@/lib/seo/hreflang';

import { BASE_URL } from '@/lib/seo/base-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; date: string; city: string }> }): Promise<Metadata> {
  const { locale, date, city } = await params;
  setRequestLocale(locale);
  const cityData = getCityBySlug(city);
  const cityName = cityData ? (isDevanagariLocale(locale) ? cityData.name.hi : cityData.name.en) : city;
  return {
    title: tl({ en: `${cityName} Panchang ${date}  –  Tithi, Nakshatra, Rahu Kaal`, hi: `${cityName} पंचांग ${date}  –  तिथि, नक्षत्र, राहु काल`, sa: `${cityName} पंचांग ${date}  –  तिथि, नक्षत्र, राहु काल` }, locale),
    // Ephemeral templated content  –  intentionally not indexed (see sitemap.ts note).
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${BASE_URL}/${locale}/daily/${date}/${city}`,
      languages: buildHreflangMap(`/daily/${date}/${city}`),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
