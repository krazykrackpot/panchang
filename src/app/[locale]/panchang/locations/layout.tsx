import type { Metadata } from 'next';
import Script from 'next/script';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `${BASE_URL}/${locale}/panchang/locations`;

  const title =
    locale === 'hi'
      ? 'शहर के अनुसार पंचांग — 55+ स्थानों के लिए सटीक समय'
      : 'Panchang by City — Accurate Timings for 55+ Locations';

  const description =
    locale === 'hi'
      ? 'अपने शहर के लिए दैनिक पंचांग समय खोजें। भारत और हिंदू डायस्पोरा के 55+ शहरों में सूर्योदय, सूर्यास्त, तिथि, नक्षत्र, राहु काल और मुहूर्त।'
      : 'Find daily Panchang timings computed for your exact city. Sunrise, sunset, Tithi, Nakshatra, Rahu Kaal, and Muhurta for 55+ cities across India and the Hindu diaspora.';

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en/panchang/locations`,
        hi: `${BASE_URL}/hi/panchang/locations`,
        'x-default': `${BASE_URL}/en/panchang/locations`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
  };
}

export default async function LocationsLayout({
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
        name: 'Panchang',
        item: `${BASE_URL}/${locale}/panchang`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: locale === 'hi' ? 'शहर के अनुसार पंचांग' : 'Panchang by City',
        item: `${BASE_URL}/${locale}/panchang/locations`,
      },
    ],
  };

  return (
    <>
      <Script id="locations-breadcrumb-ld" type="application/ld+json" strategy="afterInteractive">
        {safeJsonLd(breadcrumbLd)}
      </Script>
      {children}
    </>
  );
}
