import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/rahu-kaal', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const faqLD = generateFAQLD('/rahu-kaal', locale);
  const toolLD = generateToolLD(
    'Rahu Kaal Calculator',
    'Check today\'s Rahu Kaal, Yamaganda & Gulika Kaal times for any city. Accurate to the minute.',
    '/rahu-kaal',
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/rahu-kaal`, locale);
  return (
    <>
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {toolLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      )}
      {breadcrumbLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      )}
      {children}
    </>
  );
}
