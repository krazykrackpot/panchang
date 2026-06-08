import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnLayoutShell from '@/components/learn/LearnLayoutShell';
import { isDevanagariLocale, pickByLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

import { BASE_URL } from '@/lib/seo/base-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/learn', locale);
}

export default async function LearnLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbItems = [
    { name: 'Home', url: `${BASE_URL}/${locale}` },
    { name: 'Learn Jyotish', url: `${BASE_URL}/${locale}/learn` },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Learn Vedic Astrology (Jyotish)',
    description: 'Free interactive course covering foundations of Vedic astrology: grahas, rashis, nakshatras, tithis, yogas, karanas, muhurtas, kundali, and dashas.',
    provider: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    url: `${BASE_URL}/${locale}/learn`,
    inLanguage: pickByLocale({ en: 'en', hi: 'hi', sa: 'sa' }, locale),
    isAccessibleForFree: true,
  };

  // NOTE: FAQ LD intentionally NOT injected here. Emitting one at the
  // /learn layout level produces "Duplicate field 'FAQPage'" in GSC
  // for every child route whose layout emits its own FAQ (e.g.
  // /learn/yoga/[slug], /learn/lagna) — confirmed in the 2026-06-02
  // GSC export. The Course JSON-LD above is the hub-level structured
  // data signal for /learn; the hub-only FAQ was dropped because
  // /learn/page.tsx is a client component and the cost of wrapping it
  // in a server shell to host the FAQ outweighs the value of a generic
  // "what is Vedic astrology?" FAQ at the hub. Children carry their
  // own contextual FAQs. Same pattern as /horoscope/layout.tsx,
  // /panchang/layout.tsx, /matching/layout.tsx. See faq-data.ts for
  // the project-wide rule.
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(courseJsonLd) }} />
      <LearnLayoutShell>{children}</LearnLayoutShell>
    </>
  );
}
