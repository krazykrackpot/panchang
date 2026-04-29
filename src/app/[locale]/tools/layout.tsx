import type { Metadata } from 'next';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Jyotish Tools — 20 Vedic Astrology Calculators | Dekho Panchang',
    description:
      'Free Vedic astrology tools: Rahu Kaal, Choghadiya, Hora, Sade Sati, Kaal Sarpa Dosha, Mangal Dosha, Prashna, Sarvatobhadra Chakra, and more.',
    alternates: {
      languages: {
        en: '/en/tools',
        hi: '/hi/tools',
        ta: '/ta/tools',
        bn: '/bn/tools',
      },
      canonical: `${BASE_URL}/${locale}/tools`,
    },
  };
}

export default async function ToolsLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const toolLD = generateToolLD(
    'Dekho Panchang — Jyotish Tools',
    'Free Vedic astrology tools: Rahu Kaal, Choghadiya, Hora, Sade Sati, Prashna, KP System, Varshaphal, Muhurta AI, and 12+ more calculators.',
    `${BASE_URL}/${locale}/tools`,
  );

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/tools`, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }}
      />
      {children}
    </>
  );
}
