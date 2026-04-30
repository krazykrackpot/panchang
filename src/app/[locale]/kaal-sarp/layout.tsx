import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD, generateExpertiseArticleLD } from '@/lib/seo/structured-data';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/kaal-sarp', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Kaal Sarp Dosha Calculator',
    'Free Kaal Sarp Dosha checker. Check all 12 types based on Rahu-Ketu axis in your birth chart.',
    `https://dekhopanchang.com/${locale}/kaal-sarp`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/kaal-sarp`, locale);
  const faqLD = generateFAQLD('/kaal-sarp', locale);
  const expertiseLD = generateExpertiseArticleLD({
    title: 'Kaal Sarp Dosha — 12 Serpent Formations of Rahu-Ketu Axis',
    description: 'Comprehensive Kaal Sarp Dosha analysis covering all 12 types (Anant to Sheshnag) based on Rahu-Ketu axis alignment in the birth chart.',
    url: `https://dekhopanchang.com/${locale}/kaal-sarp`,
    locale,
    citations: ['Brihat Parashara Hora Shastra — Rahu-Ketu Chapter', 'Lal Kitab — Sarpa Dosha Remedies'],
    expertise: ['Kaal Sarp Dosha', 'Rahu-Ketu Axis Analysis', 'Dosha Identification', 'Vedic Remedial Measures'],
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
