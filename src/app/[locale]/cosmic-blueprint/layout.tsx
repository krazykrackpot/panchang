import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/cosmic-blueprint', locale);
}

export default async function CosmicBlueprintLayout({
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
        name="Cosmic Blueprint"
        description="Your celestial signature — Sun, Moon, lagna, dasha lord, and life-domain scores in a single card."
        path="/cosmic-blueprint"
        locale={locale}
      />
      {children}
    </>
  );
}
