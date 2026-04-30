import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD, generateExpertiseArticleLD } from '@/lib/seo/structured-data';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/pitra-dosha', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Pitra Dosha Checker',
    'Free Pitra Dosha checker. Analyze Sun-Rahu conjunction, 9th house affliction, and ancestral karma indicators.',
    `https://dekhopanchang.com/${locale}/pitra-dosha`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/pitra-dosha`, locale);
  const faqLD = generateFAQLD('/pitra-dosha', locale);
  const expertiseLD = generateExpertiseArticleLD({
    title: 'Pitra Dosha — Ancestral Karma Analysis',
    description: 'Pitra Dosha analysis based on Sun-Rahu conjunction, 9th house affliction, and ancestral karma indicators in the Vedic birth chart.',
    url: `https://dekhopanchang.com/${locale}/pitra-dosha`,
    locale,
    citations: ['Brihat Parashara Hora Shastra — Pitru Dosha', 'Garuda Purana — Ancestral Rites'],
    expertise: ['Pitra Dosha', 'Ancestral Karma (Pitru Rina)', 'Shraddha Remedies', 'Vedic Remedial Measures'],
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
