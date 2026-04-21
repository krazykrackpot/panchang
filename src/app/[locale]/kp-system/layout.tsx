import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/kp-system', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'KP System — Krishnamurti Paddhati',
    'KP astrology chart with Placidus houses, sub-lords, and significator analysis.',
    `https://dekhopanchang.com/${locale}/kp-system`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/kp-system`, locale);
  const faqLD = generateFAQLD('/kp-system', locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {children}
    </>
  );
}
