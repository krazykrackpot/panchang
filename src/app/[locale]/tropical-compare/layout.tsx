import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/tropical-compare', locale);
}

export default async function TropicalCompareLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <ToolStructuredData
        name="Vedic vs Tropical Compare"
        description="Side-by-side comparison of your sidereal (Vedic) chart with the tropical (Western) chart."
        path="/tropical-compare"
        locale={locale}
      />
      {children}
    </>
  );
}
