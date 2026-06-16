import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { buildHreflangMap } from '@/lib/seo/hreflang';

import { BASE_URL } from '@/lib/seo/base-url';

// Pre-render all 27 nakshatras at build time. Page is a client component
// so the static params live on this layout. 27 entries × 9 locales = 243
// pages — tiny fraction of the static-page budget. Without this, Next.js
// treated every request to /panchang/nakshatra/:id as dynamic on demand.
export function generateStaticParams(): Array<{ id: string }> {
  return Array.from({ length: 27 }, (_, i) => ({ id: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const route = `/panchang/nakshatra/${id}`;
  return {
    alternates: {
      canonical: `${BASE_URL}/${locale}${route}`,
      languages: buildHreflangMap(`/panchang/nakshatra/${id}`),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
