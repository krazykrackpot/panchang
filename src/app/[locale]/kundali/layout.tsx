import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Script from 'next/script';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { pickKundaliLabel as L } from '@/lib/content/kundali-page-labels';

import { BASE_URL } from '@/lib/seo/base-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/kundali', locale);
}

export default async function KundaliLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Dekho Panchang  –  Kundali Generator',
    description: 'Free Vedic birth chart (Kundali) generator with planetary positions, Vimshottari Dasha, Shadbala, Ashtakavarga, divisional charts, and interpretive Tippanni.',
    url: `${BASE_URL}/${locale}/kundali`,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    // BCP-47 language tag — directly use the route locale (all 9 are
    // valid BCP-47 codes per IANA; mai/mr/ta/te/kn/gu/bn are already
    // registered, and they all serve translated chrome).
    inLanguage: locale,
  };

  const faqLD = generateFAQLD('/kundali', locale);

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: L('schemaName', locale),
    description: L('schemaDescription', locale),
    totalTime: 'PT2M',
    tool: { '@type': 'HowToTool', name: 'Dekho Panchang Kundali Generator' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: L('schemaStep1Name', locale),
        text: L('schemaStep1Text', locale),
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: L('schemaStep2Name', locale),
        text: L('schemaStep2Text', locale),
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: L('schemaStep3Name', locale),
        text: L('schemaStep3Text', locale),
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: L('schemaStep4Name', locale),
        text: L('schemaStep4Text', locale),
      },
    ],
  };

  return (
    <>
      <Script id="kundali-ld" type="application/ld+json" strategy="afterInteractive">{JSON.stringify(softwareJsonLd)}</Script>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(howToJsonLd) }} />
      {faqLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }}
        />
      )}
      {children}
    </>
  );
}
