import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/career-muhurta', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faqLD = generateFAQLD('/career-muhurta', locale);
  return (
    <>
      {faqLD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />}
      <ToolStructuredData
        name="Career Muhurta"
        description="Auspicious time finder for career decisions — job interviews, contract signings, salary negotiations, business launches, resignations, promotions."
        path="/career-muhurta"
        locale={locale}
      />
      {children}
    </>
  );
}
