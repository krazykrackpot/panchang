import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/financial-astrology', locale);
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Financial Astrology — Dhana Yogas & Wealth Timing',
    'Discover your Dhana (wealth) yoga activations, monthly financial windows, hora-based timing guide, and top sectors based on your Vedic birth chart.',
    `https://dekhopanchang.com/${locale}/financial-astrology`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/financial-astrology`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
