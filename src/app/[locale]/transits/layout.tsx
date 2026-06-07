import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';
import { formatTransitLabel } from '@/lib/content/transits-labels';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/transits', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  // Previously branched on the seo.isHi flag — collapsing 7 locales onto
  // 2 byte-identical title strings (Google duplicate-content demotion,
  // per ctr-config.ts:342). Each locale now gets its own translated copy.
  const title = formatTransitLabel('titleTemplate', locale, { DATE: seo.dateStr });
  const description = formatTransitLabel('descTemplate', locale, { DATE: seo.dateStr });

  return { ...base, title, description };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
