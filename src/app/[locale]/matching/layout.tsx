import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/matching', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Kundali Matching — Ashta Kuta Compatibility',
    'Free Vedic birth chart compatibility analysis using the 36-point Ashta Kuta system.',
    `https://dekhopanchang.com/${locale}/matching`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/matching`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      {children}
    </>
  );
}
