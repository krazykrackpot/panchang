import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { generateHoroscopeFAQ } from '@/lib/seo/faq-data';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export function generateStaticParams() {
  return RASHIS.map(r => ({ rashi: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; rashi: string }> }): Promise<Metadata> {
  const { locale, rashi } = await params;
  const r = getRashiBySlug(rashi);
  if (!r) return {};

  const vedicName = tl(r.name, locale);
  const westernName = r.name.en;
  const hindiName = r.name.hi;

  const isHi = isDevanagariLocale(locale);

  const title = tl({ en: `${vedicName} (${hindiName}) Today — ${westernName} Vedic Horoscope | Dekho Panchang`, hi: `${hindiName} (${westernName}) राशिफल आज — वैदिक दैनिक भविष्यवाणी | Dekho Panchang`, sa: `${hindiName} (${westernName}) राशिफल आज — वैदिक दैनिक भविष्यवाणी | Dekho Panchang` }, locale);

  const description = tl({ en: `Today's ${vedicName} horoscope based on actual planetary transits (Swiss Ephemeris precision), not generic predictions. Transit-based daily guidance for career, love, health & finance.`, hi: `${hindiName} राशि का आज का राशिफल वास्तविक ग्रह गोचर पर आधारित — करियर, प्रेम, स्वास्थ्य, वित्त। सटीक वैदिक गणना, न कि सामान्य भविष्यवाणी।`, sa: `${hindiName} राशि का आज का राशिफल वास्तविक ग्रह गोचर पर आधारित — करियर, प्रेम, स्वास्थ्य, वित्त। सटीक वैदिक गणना, न कि सामान्य भविष्यवाणी।` }, locale);

  const url = `${BASE_URL}/${locale}/horoscope/${rashi}`;

  return {
    title,
    description,
    keywords: [
      `${westernName.toLowerCase()} horoscope today`,
      `${vedicName.toLowerCase()} rashifal`,
      `${westernName.toLowerCase()} daily horoscope`,
      `${rashi} rashi today`,
      'vedic horoscope',
      'daily rashifal',
      'moon sign horoscope',
    ],
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'mai'].map(l => [l, `${BASE_URL}/${l}/horoscope/${rashi}`])
      ),
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Dekho Panchang',
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; rashi: string }> }) {
  const { locale, rashi } = await params;
  const r = getRashiBySlug(rashi);
  const name = r ? r.name.en : rashi;
  const vedicName = r ? tl(r.name, locale) : rashi;

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/horoscope/${rashi}`, locale);
  const faqLD = generateHoroscopeFAQ(vedicName, name, 'daily');

  const today = new Date().toISOString().split('T')[0];

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${vedicName} (${name}) Horoscope Today`,
    description: `Daily Vedic horoscope for ${name} (${vedicName}) with career, love, health, finance & spirituality predictions.`,
    url: `${BASE_URL}/${locale}/horoscope/${rashi}`,
    datePublished: today,
    dateModified: today,
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${locale}/horoscope/${rashi}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      {children}
    </>
  );
}
