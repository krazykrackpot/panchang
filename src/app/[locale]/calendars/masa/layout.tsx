import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

/**
 * Layout for the Hindu Months (Masa) hub page.
 *
 * The page existed without a layout, which meant it inherited the parent
 * `/calendars` metadata and shipped with the wrong canonical, no JSON-LD,
 * and no per-page OG. Added in the May 2026 SEO audit fixes.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/calendars/masa', locale);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
