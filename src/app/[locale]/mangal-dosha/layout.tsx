import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD, generateExpertiseArticleLD } from '@/lib/seo/structured-data';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/mangal-dosha', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Mangal Dosha Calculator',
    'Free Mangal Dosha (Kuja Dosha) calculator. Check Mars placement in houses 1, 2, 4, 7, 8, 12 from Lagna, Moon, and Venus.',
    `https://dekhopanchang.com/${locale}/mangal-dosha`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/mangal-dosha`, locale);
  const faqLD = generateFAQLD('/mangal-dosha', locale);
  const expertiseLD = generateExpertiseArticleLD({
    title: 'Mangal Dosha (Kuja Dosha) — Mars Affliction Analysis',
    description: 'Comprehensive Mangal Dosha analysis based on Mars placement in houses 1, 2, 4, 7, 8, 12 from Lagna, Moon, and Venus per Brihat Parashara Hora Shastra.',
    url: `https://dekhopanchang.com/${locale}/mangal-dosha`,
    locale,
    citations: ['Brihat Parashara Hora Shastra, Chapter 81 — Mangal Dosha', 'Phaladeepika by Mantreshwara — Kuja Dosha'],
    expertise: ['Mangal Dosha (Kuja Dosha)', 'Vedic Marriage Compatibility', 'Dosha Cancellation Rules', 'Vedic Remedial Measures'],
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(expertiseLD) }} />
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {children}
    </>
  );
}
