import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAllPairSlugs, getRashiBySlug, canonicalPairSlug } from '@/lib/constants/rashi-slugs';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export function generateStaticParams() {
  return getAllPairSlugs().map(pair => ({ pair }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; pair: string }> }): Promise<Metadata> {
  const { locale, pair } = await params;
  const parts = pair.split('-and-');
  if (parts.length !== 2) return {};
  const r1 = getRashiBySlug(parts[0]);
  const r2 = getRashiBySlug(parts[1]);
  if (!r1 || !r2) return {};

  // Redirect non-canonical order
  const canonical = canonicalPairSlug(parts[0], parts[1]);
  if (pair !== canonical) {
    redirect(`/${locale}/matching/${canonical}`);
  }

  const name1 = tl(r1.name, locale);
  const name2 = tl(r2.name, locale);
  return {
    title: tl({ en: `${name1} and ${name2} Compatibility — Vedic Astrology`, hi: `${name1} और ${name2} संगतता — वैदिक ज्योतिष`, sa: `${name1} और ${name2} संगतता — वैदिक ज्योतिष` }, locale),
    description: tl({ en: `${name1} and ${name2} Vedic compatibility analysis with Ashta Kuta score, temperament, romance, career partnership.`, hi: `${name1} और ${name2} राशि वैदिक संगतता विश्लेषण। अष्ट कूट स्कोर, स्वभाव, प्रेम, करियर साझेदारी।`, sa: `${name1} और ${name2} राशि वैदिक संगतता विश्लेषण। अष्ट कूट स्कोर, स्वभाव, प्रेम, करियर साझेदारी।` }, locale),
    alternates: { canonical: `${BASE_URL}/${locale}/matching/${canonical}` },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; pair: string }> }) {
  const { locale, pair } = await params;
  const parts = pair.split('-and-');
  const r1 = getRashiBySlug(parts[0]);
  const r2 = getRashiBySlug(parts[1]);
  const name1 = r1 ? tl(r1.name, locale) : parts[0];
  const name2 = r2 ? tl(r2.name, locale) : parts[1];

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/matching/${pair}`, locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Article',
        name: `${name1} and ${name2} Compatibility`,
        description: `Vedic compatibility analysis for ${name1} and ${name2} with Ashta Kuta scoring.`,
        url: `${BASE_URL}/${locale}/matching/${pair}`,
      }) }} />
      {children}
    </>
  );
}
