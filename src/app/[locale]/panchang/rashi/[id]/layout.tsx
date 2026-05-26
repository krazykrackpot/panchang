import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getPageMetadata } from '@/lib/seo/metadata';
import { buildHreflangMap } from '@/lib/seo/hreflang';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

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
