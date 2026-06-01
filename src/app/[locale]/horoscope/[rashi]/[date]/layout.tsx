import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, isSuppressedSeoLocale, formatSeoDate } from '@/lib/utils/locale-fonts';
import { isStrictYmd } from '@/lib/seo/date-validation';
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

  // Format + strict round-trip. Empty metadata for non-dates ('weekly',
  // 'monthly' — handled by sibling routes) and rollover dates like
  // 2026-02-30. The proxy already 404s rollover URLs at the edge, but
  // we still need empty metadata here to avoid emitting hreflang /
  // canonical for the rare case the metadata renders during build.
  if (!isStrictYmd(date)) return {};
  const [y, m, d] = date.split('-').map(Number);

  const vedicName = tl(r.name, locale);
  const westernName = r.name.en;
  const hindiName = r.name.hi;
  // Locale-aware date — Marathi gets "1 मे 2026", Hindi/Maithili/Sanskrit
  // get the tuned "1 जून 2026", English gets "1 June 2026". Previously
  // `en-US` was hardcoded → Marathi titles read "June 1, 2026 चे..." and
  // Hindi titles read "June 1, 2026" mixed with Hindi grammar.
  // Gemini PR #329 MEDIUM.
  const formatted = formatSeoDate(y, m, d, locale);

  const isHi = isDevanagariLocale(locale);

  // Title — Marathi gets a date-first ordering that mirrors the Marathi
  // SERP pattern (date BEFORE the noun, then `चे राशीफल`). Before the
  // 2026-06-01 hotfix Marathi fell into the Hindi `${hindiName} राशिफल`
  // pattern, which made /mr/ identical to /hi/ → Google deduplicated.
  let title: string;
  if (locale === 'mr') {
    title = `${formatted} चे ${hindiName} राशीफल | दैनिक राशीफल`;
  } else if (isHi) {
    title = `${hindiName} राशिफल ${formatted} | दैनिक राशिफल`;
  } else {
    title = `${westernName} Horoscope ${formatted} | Daily Vedic Forecast`;
  }

  // Only show the parenthetical local-name when it differs from the western name —
  // otherwise English locale rendered "Capricorn (Capricorn)" etc.
  const enParen = vedicName && vedicName !== westernName ? ` (${vedicName})` : '';
  let description: string;
  if (locale === 'mr') {
    description = `${formatted} साठी ${hindiName} (${westernName}) राशीफल. वास्तविक ग्रह गोचरावर आधारित.`;
  } else if (isHi) {
    description = `${formatted} के लिए ${hindiName} (${westernName}) राशिफल। वास्तविक ग्रह गोचर पर आधारित।`;
  } else {
    description = `${westernName}${enParen} horoscope for ${formatted}. Based on real Vedic planetary transits.`;
  }

  const url = `${BASE_URL}/${locale}/horoscope/${slug}/${date}`;

  // Sanskrit (retired) — suppress from index. See locale-fonts.ts.
  const noindex = isSuppressedSeoLocale(locale);

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
    robots: noindex ? { index: false, follow: true } : undefined,
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
