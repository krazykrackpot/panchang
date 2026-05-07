import type { Metadata } from 'next';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHindi = locale === 'hi';
  return {
    title: isHindi
      ? 'सिजेरियन मुहूर्त — शुभ जन्म समय खोजक | देखो पंचांग'
      : 'Caesarean Muhurta — Auspicious Birth Time Finder | Dekho Panchang',
    description: isHindi
      ? 'नियोजित सिजेरियन प्रसव के लिए शास्त्रीय ज्योतिष सिद्धान्तों द्वारा सर्वोत्तम जन्म समय खोजें। 5-स्तम्भ अंकन: लग्न बल, चन्द्र गुणवत्ता, ग्रह वितरण, दशा प्रक्षेपण।'
      : 'Find the best birth time for a planned C-section delivery using classical Jyotish principles. 5-pillar scoring: lagna strength, Moon quality, planet distribution, dasha trajectory.',
    alternates: {
      canonical: `https://dekhopanchang.com/${locale}/caesarean-muhurta`,
      languages: {
        en: 'https://dekhopanchang.com/en/caesarean-muhurta',
        hi: 'https://dekhopanchang.com/hi/caesarean-muhurta',
      },
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Caesarean Muhurta — Auspicious Birth Time Finder',
    'Find the most auspicious birth time for a planned C-section using classical Jyotish 5-pillar scoring.',
    `https://dekhopanchang.com/${locale}/caesarean-muhurta`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/caesarean-muhurta`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
