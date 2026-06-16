import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getPageMetadata } from '@/lib/seo/metadata';
import { buildHreflangMap } from '@/lib/seo/hreflang';

import { BASE_URL } from '@/lib/seo/base-url';

// Pre-render all 12 rashis at build time. Page is a client component so
// the static params live on this layout. 12 entries × 9 locales = 108
// pages — tiny fraction of the static-page budget. Without this, Next.js
// treated every request to /panchang/rashi/:slug as dynamic on demand.
export function generateStaticParams(): Array<{ id: string }> {
  return RASHIS.map((r) => ({ id: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Try to resolve slug to a rashi for richer metadata
  const rashi = RASHIS.find(r => r.slug === id);
  const route = `/panchang/rashi/${id}`;

  // Use PAGE_META if available
  const pageMeta = rashi ? getPageMetadata(route, locale) : {};

  return {
    ...pageMeta,
    alternates: {
      canonical: `${BASE_URL}/${locale}${route}`,
      languages: buildHreflangMap(`/panchang/rashi/${id}`),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
