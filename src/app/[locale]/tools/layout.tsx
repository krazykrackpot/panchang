import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { getPageMetadata } from '@/lib/seo/metadata';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  // Use the full PAGE_META entry (8-locale title + description + alternates +
  // canonical + hreflang). Previously this layout hardcoded an English-only
  // dict + a 4-locale alternates map, ignoring the full PAGE_META copy.
  return getPageMetadata('/tools', locale);
}

export default async function ToolsLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const toolLD = generateToolLD(
    'Dekho Panchang  –  Jyotish Tools',
    'Free Vedic astrology tools: Rahu Kaal, Choghadiya, Hora, Sade Sati, Prashna, KP System, Varshaphal, Muhurta AI, and 12+ more calculators.',
    `${BASE_URL}/${locale}/tools`,
  );

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/tools`, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }}
      />
      {children}
    </>
  );
}
