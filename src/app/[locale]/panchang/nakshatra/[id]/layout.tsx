import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { buildHreflangMap } from '@/lib/seo/hreflang';

import { BASE_URL } from '@/lib/seo/base-url';

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
