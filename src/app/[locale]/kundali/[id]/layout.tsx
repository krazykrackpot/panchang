import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { buildHreflangMap } from '@/lib/seo/hreflang';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const route = `/kundali/${id}`;
  return {
    alternates: {
      canonical: `${BASE_URL}/${locale}${route}`,
      languages: buildHreflangMap(`/kundali/${id}`),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
