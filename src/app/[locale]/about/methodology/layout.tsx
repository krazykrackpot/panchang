import type { Metadata } from 'next';
import { locales } from '@/lib/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isHi = locale === 'hi';

  const title = isHi
    ? 'हमारी गणना पद्धति — पंचांग और कुण्डली कैसे गणित होती है'
    : 'Our Methodology — How We Calculate Panchang & Kundali';
  const description = isHi
    ? 'जानें कैसे देखो पंचांग स्विस एफेमेरिस, मीउस एल्गोरिदम और बृहत् पराशर होरा शास्त्र जैसे शास्त्रीय ग्रन्थों का उपयोग करके ग्रह स्थिति, तिथि, नक्षत्र और जन्म कुण्डली की गणना करता है।'
    : 'Learn how Dekho Panchang computes planetary positions, Tithi, Nakshatra, and birth charts using Swiss Ephemeris, Meeus algorithms, and classical Vedic texts like BPHS.';

  const url = `${BASE_URL}/${locale}/about/methodology`;

  const alternates: Record<string, string> = {};
  for (const l of locales) {
    alternates[l] = `${BASE_URL}/${l}/about/methodology`;
  }
  alternates['x-default'] = `${BASE_URL}/en/about/methodology`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: alternates,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
