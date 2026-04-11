import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/muhurta-ai', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Muhurta AI — Auspicious Time Finder',
    'AI-powered muhurta scanner for finding the best dates and times for important activities.',
    `https://dekhopanchang.com/${locale}/muhurta-ai`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/muhurta-ai`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      {children}
    </>
  );
}
