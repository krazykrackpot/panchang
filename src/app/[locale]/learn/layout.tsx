import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnLayoutShell from '@/components/learn/LearnLayoutShell';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn', locale);
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
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    url: `${BASE_URL}/${locale}/learn`,
    inLanguage: locale === 'hi' ? 'hi' : locale === 'sa' ? 'sa' : 'en',
    isAccessibleForFree: true,
  };

  const faqLD = generateFAQLD('/learn', locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(courseJsonLd) }} />
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      <LearnLayoutShell>{children}</LearnLayoutShell>
    </>
  );
}
