import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { locales } from '@/lib/i18n/config';

import { BASE_URL } from '@/lib/seo/base-url';

export const revalidate = 86400; // ISR: daily — content is deterministic per date

export function generateStaticParams() {
  // ISR: rendered on-demand, not pre-built (keeps deploy under 10 min)
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; rashi: string; date: string }> }): Promise<Metadata> {
  const { locale, rashi: slug, date } = await params;
  setRequestLocale(locale);
  const r = getRashiBySlug(slug);
  if (!r) return {};

  // Validate date format  –  return empty metadata for non-dates
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return {};

  const vedicName = tl(r.name, locale);
  const westernName = r.name.en;
  const hindiName = r.name.hi;
  // Format date for display: "May 8, 2026"
  const formatted = new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isHi = isDevanagariLocale(locale);

  const title = isHi
    ? `${hindiName} राशिफल ${formatted} | दैनिक राशिफल`
    : `${westernName} Horoscope ${formatted} | Daily Vedic Forecast`;

  // Only show the parenthetical local-name when it differs from the western name —
  // otherwise English locale rendered "Capricorn (Capricorn)" etc.
  const enParen = vedicName && vedicName !== westernName ? ` (${vedicName})` : '';
  const description = isHi
    ? `${formatted} के लिए ${hindiName} (${westernName}) राशिफल। वास्तविक ग्रह गोचर पर आधारित।`
    : `${westernName}${enParen} horoscope for ${formatted}. Based on real Vedic planetary transits.`;

  const url = `${BASE_URL}/${locale}/horoscope/${slug}/${date}`;

  return {
    title,
    description,
    keywords: [
      `${westernName.toLowerCase()} horoscope ${formatted.toLowerCase()}`,
      `${vedicName.toLowerCase()} rashifal ${date}`,
      `${westernName.toLowerCase()} horoscope today`,
      `${hindiName} राशिफल`,
      'vedic horoscope',
      'daily rashifal',
    ],
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          locales.map(l => [l, `${BASE_URL}/${l}/horoscope/${slug}/${date}`])
        ),
        'x-default': `${BASE_URL}/en/horoscope/${slug}/${date}`,
      },
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

export default async function DateLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; rashi: string; date: string }> }) {
  const { locale, rashi: slug, date } = await params;
  setRequestLocale(locale);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/horoscope/${slug}/${date}`, locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
