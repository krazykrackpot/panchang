import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

// The generic `/calendar` FAQ JSON-LD used to live here. That was wrong
// — Next.js layouts cascade into every descendant route, which meant
// the same FAQ was emitted on /calendar/regional/bengali (Bengali FAQ
// from page.tsx) + /calendar/regional/gujarati + every other sub-page
// that had its own FAQ. Google's rich-results validator flagged
// "Duplicate field FAQPage" on the top-traffic Bengali page (May 30 →
// Jun 1 ranking collapse). FAQ emission now lives in the page.tsx of
// each route that owns its FAQ content; this layout only owns metadata.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/calendar', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
