import { setRequestLocale } from 'next-intl/server';
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
  setRequestLocale(locale);
  return getPageMetadata(`/vivah-muhurat/${year}`, locale);
}

export const revalidate = 86400; // Revalidate daily

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}) {
  const { locale, year } = await params;
  setRequestLocale(locale);

  const toolLD = generateToolLD(
    `Shubh Vivah Muhurat ${year}  –  Auspicious Marriage Dates`,
    `All auspicious Hindu marriage dates for ${year}, computed using classical Muhurta Chintamani rules with 36-factor Vedic scoring.`,
    `https://dekhopanchang.com/${locale}/vivah-muhurat/${year}`
  );
  const breadcrumbLD = generateBreadcrumbLD(
    `/${locale}/vivah-muhurat/${year}`,
    locale
  );
  const faqLD = generateFAQLD(`/vivah-muhurat/${year}`, locale);

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
