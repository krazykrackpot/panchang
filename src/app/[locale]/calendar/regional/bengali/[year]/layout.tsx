/**
 * Layout for /[locale]/calendar/regional/bengali/[year].
 *
 * Provides ISR config, metadata (via getPageMetadata), JSON-LD, and the
 * static-params allowlist of years we pre-build. Anything outside the
 * allowlist still resolves via ISR (dynamicParams is the implicit default).
 */
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbLD, generateToolLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export const revalidate = 86400;

export function generateStaticParams() {
  // Same window as VALID_YEARS in page.tsx — keep them in sync.
  return [{ year: '2025' }, { year: '2026' }, { year: '2027' }, { year: '2028' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}): Promise<Metadata> {
  const { locale, year } = await params;
  setRequestLocale(locale);
  return getPageMetadata(`/calendar/regional/bengali/${year}`, locale);
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}) {
  const { locale, year } = await params;
  setRequestLocale(locale);

  const url = `https://dekhopanchang.com/${locale}/calendar/regional/bengali/${year}`;
  const title = `Bangla Calendar ${year} | বাংলা পঞ্জিকা — Bengali Festivals & Dates`;
  const description = `Complete Bangla calendar for ${year} with every Bengali festival — Durga Puja, Kali Puja, Saraswati Puja, Poila Boishakh, Lakshmi Puja — computed from classical panjika rules using Kolkata coordinates.`;

  const toolLD = generateToolLD(title, description, url);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/calendar/regional/bengali/${year}`, locale);

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: 'https://dekhopanchang.com' },
    datePublished: '2026-05-30',
    dateModified: new Date().toISOString().slice(0, 10),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      {children}
    </>
  );
}
