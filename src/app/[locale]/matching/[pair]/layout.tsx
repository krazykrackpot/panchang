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
  const western1 = r1.name.en;
  const western2 = r2.name.en;

  // Title under 60 chars: "Aries & Scorpio — 36-Point Vedic Match Score"
  const title = tl({
    en: `${western1} & ${western2} — 36-Point Vedic Match Score`,
    hi: `${name1} और ${name2} — 36 अंक वैदिक मिलान`,
    sa: `${name1} ${name2} च — ३६ अङ्कवैदिकमेलनम्`,
  }, locale);

  // Description under 155 chars
  const description = tl({
    en: `Free ${western1}-${western2} compatibility: Ashta Kuta 36-point score, Nadi, Bhakut, Gana & 5 more factors. Instant Vedic matching analysis.`,
    hi: `${name1}-${name2} संगतता: अष्ट कूट 36 अंक, नाड़ी, भकूट, गण व 5 अन्य कारक। तुरन्त वैदिक मिलान।`,
    sa: `${name1}-${name2} संगतता: अष्टकूट ३६ अङ्काः नाडी भकूटं गणं च। वैदिकमेलनविश्लेषणम्।`,
  }, locale);

  return {
    title,
    description,
    keywords: [
      `${western1.toLowerCase()} ${western2.toLowerCase()} compatibility`,
      `${western1.toLowerCase()} and ${western2.toLowerCase()} match`,
      `${r1.slug} ${r2.slug} compatibility`,
      `${name1} ${name2} vedic matching`,
      'ashta kuta score',
      'vedic compatibility',
      'rashi matching',
    ],
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
