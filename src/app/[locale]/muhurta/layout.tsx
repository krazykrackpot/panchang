/**
 * /muhurta hub metadata. Created 2026-06-01 as part of the recovery-plan
 * §2.2 internal-linking pass — the page itself unifies the 12 orphaned
 * /muhurta/[type] landings under one navigable hub.
 *
 * NOTE on layout shape: this layout intentionally renders only `{children}`
 * (no markup). The actual hub UI lives in `page.tsx`. We add the layout
 * solely so we can attach `generateMetadata` at the segment level — the
 * dynamic `[type]/layout.tsx` below this one already owns its own
 * metadata so it remains unaffected by the hub.
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

  // Per-locale title that doesn't mass-duplicate. The Marathi-grammar
  // bug (PR #329) was the lesson: never use a boolean Devanagari gate
  // for SEO copy. Until we wire this through `panchangDateSeo` style
  // helpers, keep the surface minimal — 2 explicit cases.
  const title = isDevanagari
    ? 'मुहूर्त — 12 जीवन-संस्कारों के लिए शुभ काल | देखो पंचांग'
    : 'Muhurta — Auspicious Timing for 12 Life-Cycle Ceremonies | Dekho Panchang';

  const description = isDevanagari
    ? 'विवाह, गृह प्रवेश, अन्नप्राशन, मुण्डन सहित 12 प्रमुख संस्कारों के लिए शुभ मुहूर्त। पारम्परिक मुहूर्त शास्त्र पर आधारित मार्गदर्शन।'
    : 'Find the auspicious muhurat for wedding, griha pravesh, annaprashan, mundan and 9 other classical life-cycle ceremonies. Guidance grounded in traditional Muhurta Shastra.';

  const url = `${BASE_URL}/${locale}/muhurta`;
  const noindex = isSuppressedSeoLocale(locale);

  return {
    title,
    description,
    robots: noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map(l => [l, `${BASE_URL}/${l}/muhurta`])),
        'x-default': `${BASE_URL}/en/muhurta`,
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

export default async function MuhurtaHubLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
