import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/prashna-ashtamangala', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Ashtamangala Prashna',
    'Kerala horary divination using the Ashtamangala Prashna system with 8 sacred numbers.',
    `https://dekhopanchang.com/${locale}/prashna-ashtamangala`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/prashna-ashtamangala`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      {children}
    </>
  );
}
