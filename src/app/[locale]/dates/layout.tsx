/**
 * /dates hub metadata. Created 2026-06-02 as part of the recovery-plan
 * §2.2 internal-linking pass — the page itself unifies the orphaned
 * /dates/[category] landings + /dates/ganda-mool under one navigable hub.
 *
 * NOTE on layout shape: this layout intentionally renders only `{children}`
 * (no markup). The actual hub UI lives in `page.tsx`. We add the layout
 * solely so we can attach `generateMetadata` at the segment level — the
 * nested `[category]/layout.tsx` already owns its own metadata for the
 * category landings, so it remains unaffected. Sibling `ganda-mool/` has
 * its own layout too.
 */

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale, isSuppressedSeoLocale } from '@/lib/utils/locale-fonts';
import { locales } from '@/lib/i18n/config';
import { BASE_URL } from '@/lib/seo/base-url';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isDevanagari = isDevanagariLocale(locale);

  // Per-locale title — Marathi-fallback bug (PR #329) warned never to
  // use a boolean Devanagari gate for SEO copy at scale. The /dates hub
  // is one URL per locale (low blast radius), so we keep two explicit
  // cases here rather than threading through `panchangDateSeo`-style
  // helpers. If the hub grows to per-category dedicated metadata, lift
  // into a `datesHubSeo()` helper similar to `lib/seo/date-page-seo.ts`.
  const title = isDevanagari
    ? 'तिथि कैलेंडर — एकादशी, पूर्णिमा, अमावस्या, प्रदोष, चतुर्थी | देखो पंचांग'
    : 'Sacred Dates — Ekadashi, Purnima, Amavasya, Pradosham, Chaturthi | Dekho Panchang';

  const description = isDevanagari
    ? 'हिन्दू पंचांग की प्रत्येक प्रमुख तिथि के लिए वर्ष-वार सूची, सूर्योदय-आधारित पालन समय और पारम्परिक मार्गदर्शन। 6 तिथि श्रेणियों के लिए समर्पित पृष्ठ।'
    : 'Year-by-year dates, sunrise-based observance times and classical guidance for every major Hindu tithi. Dedicated pages for 6 tithi categories — Ekadashi, Purnima, Amavasya, Pradosham, Chaturthi and Ganda Mool.';

  const url = `${BASE_URL}/${locale}/dates`;
  const noindex = isSuppressedSeoLocale(locale);

  return {
    title,
    description,
    robots: noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map(l => [l, `${BASE_URL}/${l}/dates`])),
        'x-default': `${BASE_URL}/en/dates`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Dekho Panchang',
    },
  };
}

export default async function DatesHubLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
