import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/kp-system', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'KP System — Krishnamurti Paddhati',
    'KP astrology chart with Placidus houses, sub-lords, and significator analysis.',
    `https://dekhopanchang.com/${locale}/kp-system`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/kp-system`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      {children}
    </>
  );
}
