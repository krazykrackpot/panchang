import type { Metadata } from 'next';
import Script from 'next/script';
import { locales } from '@/lib/i18n/config';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = 'Hindu Festival Calendar 2026-2029 — Exact Muhurta Times for 55 Cities | Dekho Panchang';
  const description =
    'Exact dates, Tithi, Muhurta & puja timings for 20 major Hindu festivals across 55 cities worldwide. Computed from Vedic algorithms — not fixed tables.';

  const url = `${BASE_URL}/${locale}/festivals`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${BASE_URL}/${l}/festivals`;
  }
  languages['x-default'] = `${BASE_URL}/en/festivals`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dekho Panchang',
      locale:
        ({ hi: 'hi_IN', sa: 'sa_IN', ta: 'ta_IN', te: 'te_IN', bn: 'bn_IN' } as Record<
          string,
          string
        >)[locale] || 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/en/festivals`,
      languages,
    },
  };
}

export default async function FestivalsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
    name: 'Hindu Festival Calendar 2026-2029 — Exact Muhurta Times for 55 Cities | Dekho Panchang',
    description:
      'Exact dates, Tithi, Muhurta & puja timings for 20 major Hindu festivals across 55 cities worldwide. Computed from Vedic algorithms — not fixed tables.',
    url: `${BASE_URL}/${locale}/festivals`,
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    inLanguage: locale === 'hi' ? 'hi' : locale === 'sa' ? 'sa' : locale === 'ta' ? 'ta' : 'en',
  };

  return (
    <>
      <Script id="festivals-breadcrumb-ld" type="application/ld+json" strategy="afterInteractive">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      </Script>
      <Script id="festivals-collection-ld" type="application/ld+json" strategy="afterInteractive">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionLd) }} />
      </Script>
      {children}
    </>
  );
}
