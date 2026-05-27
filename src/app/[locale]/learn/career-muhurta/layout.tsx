import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/learn/career-muhurta', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  // next-intl requires setRequestLocale on every server layout/page in
  // the [locale] subtree so static generation / ISR resolves the locale
  // consistently with the request. Missing this can cause hydration
  // mismatches or wrong-locale renders under cache hits.
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
