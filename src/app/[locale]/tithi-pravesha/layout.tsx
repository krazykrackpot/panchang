import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/tithi-pravesha', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const toolLD = generateToolLD(
    'Tithi Pravesha  –  Vedic Birthday Calculator',
    'Find your Vedic birthday  –  the exact date when your birth tithi recurs each year.',
    `https://dekhopanchang.com/${locale}/tithi-pravesha`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/tithi-pravesha`, locale);
  const faqLD = generateFAQLD('/tithi-pravesha', locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      <ToolStructuredData
        name="Tithi Pravesha Birthday Chart"
        description="Vedic birthday chart cast for the moment the Sun-Moon angle returns to its birth value."
        path="/tithi-pravesha"
        locale={locale}
      />
      {children}
    </>
  );
}
