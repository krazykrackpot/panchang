import type { Metadata } from 'next';
import LearnLayoutShell from '@/components/learn/LearnLayoutShell';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jyotishpanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: 'Learn Vedic Astrology (Jyotish) — Foundations to Advanced',
    hi: 'वैदिक ज्योतिष सीखें — आधार से उन्नत तक',
    sa: 'वैदिकज्योतिषं पठतु — आधारात् उन्नतपर्यन्तम्',
  };
  const descriptions: Record<string, string> = {
    en: 'Free interactive course on Vedic astrology: grahas, rashis, nakshatras, tithis, yogas, karanas, muhurtas, kundali, dashas, and more.',
    hi: 'वैदिक ज्योतिष का नि:शुल्क पाठ्यक्रम: ग्रह, राशि, नक्षत्र, तिथि, योग, करण, मुहूर्त, कुण्डली, दशा आदि।',
    sa: 'वैदिकज्योतिषस्य नि:शुल्कपाठ्यक्रमः: ग्रहाः, राशयः, नक्षत्राणि, तिथयः, योगाः, करणानि, मुहूर्ताः, कुण्डली, दशाः इत्यादि।',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${BASE_URL}/${locale}/learn`,
    },
  };
}

export default async function LearnLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const breadcrumbItems = [
    { name: 'Home', url: `${BASE_URL}/${locale}` },
    { name: 'Learn Jyotish', url: `${BASE_URL}/${locale}/learn` },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Learn Vedic Astrology (Jyotish)',
    description: 'Free interactive course covering foundations of Vedic astrology: grahas, rashis, nakshatras, tithis, yogas, karanas, muhurtas, kundali, and dashas.',
    provider: {
      '@type': 'Organization',
      name: 'Jyotish Panchang',
      url: BASE_URL,
    },
    url: `${BASE_URL}/${locale}/learn`,
    inLanguage: locale === 'hi' ? 'hi' : locale === 'sa' ? 'sa' : 'en',
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <LearnLayoutShell>{children}</LearnLayoutShell>
    </>
  );
}
