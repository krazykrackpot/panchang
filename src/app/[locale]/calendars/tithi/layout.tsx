import type { Metadata } from 'next';
import { locales } from '@/lib/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHi = locale === 'hi';

  const title = isHi ? 'तिथि पंचांग — मासिक तिथि, नक्षत्र, चन्द्र राशि कैलेंडर' : 'Tithi Calendar — Monthly Tithi, Nakshatra & Moon Sign Grid';
  const description = isHi
    ? 'प्रत्येक दिन की तिथि, नक्षत्र, चन्द्र राशि, सूर्योदय/सूर्यास्त और त्योहार देखें। चन्द्र कला चिह्न के साथ मासिक कैलेंडर दृश्य।'
    : 'View daily Tithi, Nakshatra, Moon sign, sunrise/sunset, and festivals for every day. Monthly calendar grid with moon phase icons.';

  const alternates: Record<string, string> = {};
  for (const l of locales) alternates[l] = `${BASE_URL}/${l}/calendars/tithi`;
  alternates['x-default'] = `${BASE_URL}/en/calendars/tithi`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/${locale}/calendars/tithi`, languages: alternates },
    keywords: ['tithi calendar', 'panchang calendar', 'hindu calendar monthly', 'nakshatra calendar', 'moon phase calendar', 'tithi today'],
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
