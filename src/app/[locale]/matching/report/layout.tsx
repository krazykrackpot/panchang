import type { Metadata } from 'next';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const META = {
  en: {
    title: 'Detailed Compatibility Report — Vedic Marriage Analysis | Dekho Panchang',
    description: 'In-depth Vedic compatibility report with Manglik analysis, Nadi Dosha, cross-chart aspects, 7th house analysis, Venus compatibility, and a narrative summary.',
  },
  hi: {
    title: 'विस्तृत अनुकूलता रिपोर्ट — वैदिक विवाह विश्लेषण | देखो पंचांग',
    description: 'मांगलिक विश्लेषण, नाड़ी दोष, क्रॉस-चार्ट पहलू, सप्तम भाव विश्लेषण, शुक्र अनुकूलता और कथात्मक सारांश के साथ गहन वैदिक अनुकूलता रिपोर्ट।',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = locale === 'hi' ? META.hi : META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `https://dekhopanchang.com/${locale}/matching/report`,
      languages: {
        en: 'https://dekhopanchang.com/en/matching/report',
        hi: 'https://dekhopanchang.com/hi/matching/report',
      },
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Detailed Compatibility Report — Vedic Marriage Analysis',
    'In-depth cross-chart compatibility analysis including Manglik, Nadi, aspects, 7th house, and Venus analysis.',
    `https://dekhopanchang.com/${locale}/matching/report`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/matching/report`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
