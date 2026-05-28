import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { getPageMetadata } from '@/lib/seo/metadata';

import { BASE_URL } from '@/lib/seo/base-url';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  // Use PAGE_META — was hardcoded English title + description even though
  // the /festivals entry has full 8-locale + bilingual coverage.
  return getPageMetadata('/festivals', locale);
}

export default async function FestivalsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Hindu Festivals',
        item: `${BASE_URL}/${locale}/festivals`,
      },
    ],
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Hindu Festival Calendar 2026-2029  –  Exact Muhurta Times for 55 Cities | Dekho Panchang',
    description:
      'Exact dates, Tithi, Muhurta & puja timings for 20 major Hindu festivals across 55 cities worldwide. Computed from Vedic algorithms  –  not fixed tables.',
    url: `${BASE_URL}/${locale}/festivals`,
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    inLanguage: locale,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionLd) }} />
      {children}
    </>
  );
}
