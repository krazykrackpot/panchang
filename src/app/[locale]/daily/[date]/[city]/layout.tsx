import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';
import { getCityBySlug } from '@/lib/constants/cities';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; date: string; city: string }> }): Promise<Metadata> {
  const { locale, date, city } = await params;
  const cityData = getCityBySlug(city);
  const cityName = cityData ? (isDevanagariLocale(locale) ? cityData.name.hi : cityData.name.en) : city;
  return {
    title: tl({ en: `${cityName} Panchang ${date} — Tithi, Nakshatra, Rahu Kaal`, hi: `${cityName} पंचांग ${date} — तिथि, नक्षत्र, राहु काल`, sa: `${cityName} पंचांग ${date} — तिथि, नक्षत्र, राहु काल` }, locale),
    alternates: {
      canonical: `${BASE_URL}/${locale}/daily/${date}/${city}`,
      languages: {
        en: `${BASE_URL}/en/daily/${date}/${city}`,
        hi: `${BASE_URL}/hi/daily/${date}/${city}`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
