import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/mundane', locale);
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Mundane Astrology — National Charts & World Forecast',
    'Explore national foundation charts for 22 nations, Jupiter-Saturn Great Conjunction timeline, and domain-by-domain world forecasts using Vedic mundane astrology.',
    `https://dekhopanchang.com/${locale}/mundane`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/mundane`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
