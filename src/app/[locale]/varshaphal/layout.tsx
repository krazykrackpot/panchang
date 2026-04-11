import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/varshaphal', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Varshaphal — Annual Horoscope',
    'Tajika annual horoscope with solar return chart, Muntha, Sahams, and Mudda Dasha.',
    `https://dekhopanchang.com/${locale}/varshaphal`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/varshaphal`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      {children}
    </>
  );
}
