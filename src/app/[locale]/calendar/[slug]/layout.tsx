import type { Metadata } from 'next';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';

export function generateStaticParams() {
  return Object.keys(FESTIVAL_DETAILS).map(slug => ({ slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const festival = FESTIVAL_DETAILS[slug];

  if (!festival) {
    return { title: 'Festival Details — Dekho Panchang' };
  }

  const loc = locale as 'en' | 'hi' | 'sa';
  const name = festival.name[loc] || festival.name.en;
  const nameEn = festival.name.en;
  const title = `${name} — Date, Puja Vidhi & Significance | Dekho Panchang`;
  const description = `${nameEn}: ${festival.significance.en}`.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.dekhopanchang.com/${locale}/calendar/${slug}`,
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
      canonical: `https://www.dekhopanchang.com/en/calendar/${slug}`,
      languages: {
        en: `/en/calendar/${slug}`,
        hi: `/hi/calendar/${slug}`,
        sa: `/sa/calendar/${slug}`,
      },
    },
  };
}

export default async function CalendarSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const festival = FESTIVAL_DETAILS[slug];

  if (!festival) return <>{children}</>;

  const BASE_URL = 'https://www.dekhopanchang.com';
  const nameEn = festival.name.en;
  const description = `${nameEn}: ${festival.significance.en}`.slice(0, 160);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${nameEn} — Date, Puja Vidhi & Significance`,
    description,
    url: `${BASE_URL}/${locale}/calendar/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    inLanguage: locale === 'hi' ? 'hi' : locale === 'sa' ? 'sa' : 'en',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Festival Calendar', item: `${BASE_URL}/${locale}/calendar` },
      { '@type': 'ListItem', position: 3, name: nameEn, item: `${BASE_URL}/${locale}/calendar/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
