import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug, VEDIC_TO_WESTERN } from '@/lib/constants/rashi-slugs';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { buildIndexableHreflang } from '@/lib/seo/hreflang';
import { isLocaleIndexable } from '@/lib/seo/indexable-locales';

export const revalidate = 86400;

import { BASE_URL } from '@/lib/seo/base-url';

function getWeekRange(): { start: string; end: string; label: string } {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const shortFmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return {
    start: fmt(monday),
    end: fmt(sunday),
    label: `${shortFmt(monday)} - ${shortFmt(sunday)}, ${monday.getFullYear()}`,
  };
}

export function generateStaticParams() {
  // ISR: rendered on-demand, not pre-built (keeps deploy under 10 min)
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; rashi: string }> }): Promise<Metadata> {
  const { locale, rashi } = await params;
  setRequestLocale(locale);
  const r = getRashiBySlug(rashi);
  if (!r) return {};

  const vedicName = tl(r.name, locale);
  const westernName = r.name.en;
  const hindiName = r.name.hi;
  const week = getWeekRange();
  const isHi = isDevanagariLocale(locale);

  const title = tl({
    en: `${vedicName} (${westernName}) Weekly Horoscope | ${week.label}`,
    hi: `${hindiName} (${westernName}) साप्ताहिक राशिफल | ${week.label}`,
    sa: `${hindiName} (${westernName}) साप्ताहिक राशिफल | ${week.label}`,
  }, locale);

  const description = tl({
    en: `${westernName} (${vedicName}) weekly horoscope for ${week.label}. Day-by-day career, love, health & finance predictions. Best days, lucky colors & weekly trends based on Vedic planetary transits.`,
    hi: `${hindiName} राशि का साप्ताहिक राशिफल ${week.label}। प्रतिदिन करियर, प्रेम, स्वास्थ्य एवं वित्त भविष्यवाणी। वैदिक ग्रह गोचर पर आधारित।`,
    sa: `${hindiName} राशि का साप्ताहिक राशिफल ${week.label}। प्रतिदिन करियर, प्रेम, स्वास्थ्य एवं वित्त भविष्यवाणी। वैदिक ग्रह गोचर पर आधारित।`,
  }, locale);

  const route = `/horoscope/${rashi}/weekly`;
  const isIndexable = isLocaleIndexable(route, locale);
  const canonicalLocale = isIndexable ? locale : 'en';
  const url = `${BASE_URL}/${canonicalLocale}${route}`;
  const westernSlug = VEDIC_TO_WESTERN[rashi];

  return {
    title,
    description,
    keywords: [
      `${westernName.toLowerCase()} weekly horoscope`,
      `${vedicName.toLowerCase()} saptahik rashifal`,
      `${westernName.toLowerCase()} horoscope this week`,
      `${rashi} rashi weekly`,
      westernSlug ? `${westernSlug} weekly horoscope` : '',
      'weekly rashifal',
      'vedic weekly horoscope',
      'saptahik rashifal',
    ].filter(Boolean),
    robots: isIndexable ? undefined : { index: false, follow: true },
    alternates: {
      canonical: url,
      languages: buildIndexableHreflang(route),
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
  setRequestLocale(locale);
  const r = getRashiBySlug(rashi);
  const name = r ? r.name.en : rashi;
  const vedicName = r ? tl(r.name, locale) : rashi;
  const week = getWeekRange();

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/horoscope/${rashi}/weekly`, locale);
  // FAQ LD intentionally NOT injected here. The parent
  // /horoscope/[rashi]/layout.tsx already emits a rashi-context FAQ
  // that nests into this weekly page. Adding a second one produced
  // the "Duplicate field 'FAQPage'" error in GSC (2026-06-02 export).
  // If we ever want a weekly-specific FAQ, we have to remove the
  // rashi-level one first to keep "one FAQ per rendered page."

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${vedicName} (${name}) Weekly Horoscope  –  ${week.label}`,
    description: `Weekly Vedic horoscope for ${name} (${vedicName}) with daily scores, career, love, health, finance predictions and lucky days.`,
    url: `${BASE_URL}/${locale}/horoscope/${rashi}/weekly`,
    datePublished: week.start,
    dateModified: week.start,
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${locale}/horoscope/${rashi}/weekly`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      {children}
    </>
  );
}
