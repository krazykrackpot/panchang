import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi-with-overlay';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generateHowToLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// OpenGraph BCP 47 codes for the 9 visible locales. `sa` is retired
// but kept here to gracefully tag any legacy redirect.
const OG_LOCALE_TAGS: Record<string, string> = {
  en: 'en_US', hi: 'hi_IN', sa: 'sa_IN', mai: 'mai_IN', mr: 'mr_IN',
  ta: 'ta_IN', te: 'te_IN', bn: 'bn_IN', gu: 'gu_IN', kn: 'kn_IN',
};

export function generateStaticParams() {
  return Object.keys(PUJA_VIDHIS).map(slug => ({ slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const puja = PUJA_VIDHIS[slug];

  if (!puja) {
    return { title: 'Puja Vidhi  –  Dekho Panchang' };
  }

  const loc = locale as 'en' | 'hi';
  const deity = puja.deity[loc] || puja.deity.en;
  const deityEn = puja.deity.en;
  const title = `${deity} Puja Vidhi  –  Step by Step with Mantras | Dekho Panchang`;
  const description = `Complete ${deityEn} puja vidhi with step-by-step procedure, mantras in Devanagari & IAST, samagri list, and auspicious timing. ${puja.muhurtaDescription.en}`.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://dekhopanchang.com/${locale}/puja/${slug}`,
      siteName: 'Dekho Panchang',
      locale: OG_LOCALE_TAGS[locale] ?? 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      // Locale-self canonical — puja-vidhi 9-locale overlay shipped in
      // this same PR. Hreflang now fans out to every visible locale
      // (was hardcoded to en+hi from the bilingual-only era). Built
      // as a Record<string, string> rather than an inline literal
      // because Next's `Languages` map type only admits BCP 47 keys
      // it knows about — the intermediary widens the type.
      canonical: `https://dekhopanchang.com/${locale}/puja/${slug}`,
      languages: ((): Record<string, string> => {
        const out: Record<string, string> = {};
        for (const alt of ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr']) {
          out[alt] = `/${alt}/puja/${slug}`;
        }
        out['x-default'] = `/en/puja/${slug}`;
        return out;
      })(),
    },
  };
}

export default async function PujaSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const puja = PUJA_VIDHIS[slug];

  if (!puja) return <>{children}</>;

  const BASE_URL = 'https://dekhopanchang.com';
  const deityEn = puja.deity.en;
  const description = `Complete ${deityEn} puja vidhi with step-by-step procedure, mantras in Devanagari & IAST, samagri list, and auspicious timing. ${puja.muhurtaDescription.en}`.slice(0, 160);

  const howToJsonLd = generateHowToLD({
    name: `${deityEn} Puja Vidhi`,
    description,
    steps: puja.vidhiSteps.map((s) => ({
      name: s.title.en,
      text: s.description.en,
    })),
  });

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Puja Vidhi', item: `${BASE_URL}/${locale}/puja` },
      { '@type': 'ListItem', position: 3, name: `${deityEn} Puja Vidhi`, item: `${BASE_URL}/${locale}/puja/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
