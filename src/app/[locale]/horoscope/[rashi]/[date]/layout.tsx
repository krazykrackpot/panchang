import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

export const revalidate = 3600; // ISR: revalidate every hour

export function generateStaticParams() {
  const rashiSlugs = RASHIS.map(r => r.slug);
  // Pre-generate next 7 days — ISR handles older/future dates on-demand
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return rashiSlugs.flatMap(rashi => dates.map(date => ({ rashi, date })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; rashi: string; date: string }> }): Promise<Metadata> {
  const { locale, rashi: slug, date } = await params;
  const r = getRashiBySlug(slug);
  if (!r) return {};

  // Validate date format — return empty metadata for non-dates
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

  const description = isHi
    ? `${formatted} के लिए ${hindiName} (${westernName}) राशिफल। वास्तविक ग्रह गोचर पर आधारित।`
    : `${westernName} (${vedicName}) horoscope for ${formatted}. Based on real Vedic planetary transits.`;

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
      languages: Object.fromEntries(
        ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'mai'].map(l => [l, `${BASE_URL}/${l}/horoscope/${slug}/${date}`])
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

export default async function DateLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; rashi: string; date: string }> }) {
  const { locale, rashi: slug, date } = await params;
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/horoscope/${slug}/${date}`, locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
