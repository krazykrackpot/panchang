import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

// Metadata is intentionally STATIC at this layer. The geo-personalized
// title (city + tithi + nakshatra) lives on /panchang/page.tsx where
// `headers()` is called — keeping it on the leaf route means siblings
// (/panchang/[city], /panchang/tithi, /panchang/yoga, …) inherit a
// static base and remain ISR-cacheable per their own revalidate config.
// Prior version had `force-dynamic` here, which cascaded to every
// descendant and silently disabled their ISR (~20 dynamic routes from
// one layout-level dynamic API read).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/panchang', locale);
}

export default async function PanchangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // NOTE: previously emitted a Daily Panchang Event JSON-LD here. Removed
  // 2026-06-03 — a daily reference document is not an Event (Google's
  // rich-result eligibility is for time-bounded happenings; the
  // VirtualLocation also drew "missing address (in location)" warnings
  // in GSC since virtual locations have no addresses by spec). The
  // page-level metadata (canonical, OG, hreflang) carries the SEO weight.
  //
  // FAQ LD intentionally NOT injected here either. Child layouts
  // (nakshatra, rashi, tithi, yoga) inject their own FAQPage schemas.
  // Injecting one here too caused "Duplicate field 'FAQPage'" errors in
  // GSC (34 invalid items). The /panchang page itself gets FAQ from
  // panchang/page.tsx if needed.

  return <>{children}</>;
}
