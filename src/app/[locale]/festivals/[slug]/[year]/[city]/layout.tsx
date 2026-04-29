import type { Metadata } from 'next';
import { getCityBySlug } from '@/lib/constants/cities';
import { MAJOR_FESTIVALS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';
import { tl } from '@/lib/utils/trilingual';
import { locales } from '@/lib/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

type Props = {
  params: Promise<{ locale: string; slug: string; year: string; city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, year, city } = await params;

  const cityData = getCityBySlug(city);
  const detail = FESTIVAL_DETAILS[slug];
  const def = MAJOR_FESTIVALS.find(f => f.slug === slug);

  if (!cityData || !detail || !def) {
    return { title: 'Festival — Dekho Panchang' };
  }

  const festivalName = tl(detail.name, locale);
  const festivalNameEn = tl(detail.name, 'en');
  const cityName = tl(cityData.name, locale) || cityData.name.en;
  const cityNameEn = cityData.name.en;

  const title = `${festivalNameEn} ${year} — Exact Date & Puja Time in ${cityNameEn} | Dekho Panchang`;
  const description = `${festivalNameEn} ${year} in ${cityNameEn}: exact Tithi, Muhurta, Lakshmi Puja timing computed from Vedic algorithms. City-specific accuracy for ${cityNameEn}${cityData.state ? `, ${cityData.state}` : ''}.`.slice(0, 155);

  const url = `${BASE_URL}/${locale}/festivals/${slug}/${year}/${city}`;

  // Build alternates for all locales
  const languages: Record<string, string> = {};
  for (const alt of locales) {
    languages[alt] = `${BASE_URL}/${alt}/festivals/${slug}/${year}/${city}`;
  }
  languages['x-default'] = `${BASE_URL}/en/festivals/${slug}/${year}/${city}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dekho Panchang',
      locale: locale === 'hi' ? 'hi_IN' : locale === 'sa' ? 'sa_IN' : 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/en/festivals/${slug}/${year}/${city}`,
      languages,
    },
  };
}

export default async function FestivalCityLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string; year: string; city: string }>;
}) {
  return <>{children}</>;
}
