import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}): Promise<Metadata> {
  const { locale, year } = await params;
  return getPageMetadata(`/hindu-calendar/${year}`, locale);
}

export const revalidate = 86400; // Revalidate daily

export function generateStaticParams() {
  return [{ year: '2026' }, { year: '2027' }];
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}) {
  const { locale, year } = await params;

  const toolLD = generateToolLD(
    `Hindu Calendar ${year}  –  Complete Festival, Vrat & Eclipse Dates`,
    `All Hindu festivals, Ekadashi vrat dates, eclipses, Purnima, Amavasya, and panchang events for ${year}. Month-by-month calendar with exact dates computed using Vedic astronomical algorithms.`,
    `https://dekhopanchang.com/${locale}/hindu-calendar/${year}`
  );
  const breadcrumbLD = generateBreadcrumbLD(
    `/${locale}/hindu-calendar/${year}`,
    locale
  );
  const faqLD = generateFAQLD(`/hindu-calendar/${year}`, locale);

  // Article JSON-LD for rich search appearance
  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Hindu Calendar ${year}  –  Complete Festival & Vrat Dates`,
    description: `Complete month-by-month Hindu calendar for ${year} with all major festivals, Ekadashi vrat dates, eclipses, and panchang events.`,
    url: `https://dekhopanchang.com/${locale}/hindu-calendar/${year}`,
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: 'https://dekhopanchang.com',
    },
    datePublished: '2026-05-07',
    dateModified: new Date().toISOString().slice(0, 10),
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }}
      />
      {faqLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }}
        />
      )}
      {children}
    </>
  );
}
