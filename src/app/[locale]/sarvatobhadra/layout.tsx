import type { Metadata } from 'next';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titleMap: Record<string, string> = {
    hi: 'सर्वतोभद्र चक्र | देखो पंचांग',
    sa: 'सर्वतोभद्रचक्रम् | देखो पंचांग',
  };
  const descMap: Record<string, string> = {
    hi: 'सर्वतोभद्र चक्र — वैदिक ज्योतिष का शक्तिशाली 9×9 वेध विश्लेषण उपकरण। ग्रहों के गोचर से नक्षत्र, तिथि और वार पर पड़ने वाले प्रभाव का विश्लेषण।',
    sa: 'सर्वतोभद्रचक्रम् — वैदिकज्योतिषस्य 9×9 वेधविश्लेषणसाधनम्।',
  };
  return {
    title: titleMap[locale] || 'Sarvatobhadra Chakra | Dekho Panchang',
    description: descMap[locale] || 'Sarvatobhadra Chakra — a powerful 9x9 Vedic astrology vedha analysis tool. Analyze how planetary transits strike nakshatras, tithis, and weekdays through row, column, and diagonal vedha lines.',
  };
}

export default async function SarvatobhadraLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Sarvatobhadra Chakra',
    'Interactive 9x9 Vedic astrology vedha analysis tool for transit evaluation using the Sarvatobhadra Chakra grid.',
    `https://dekhopanchang.com/${locale}/sarvatobhadra`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/sarvatobhadra`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
