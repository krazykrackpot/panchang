import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/horoscope', locale);
}

// NOTE: FAQ LD intentionally NOT injected here. The hub-specific FAQ
// is now emitted by /horoscope/page.tsx so it only appears on the hub
// itself, not on every nested rashi / date / weekly / monthly page.
// Child layout `/horoscope/[rashi]/layout.tsx` emits its own
// rashi-context FAQ schema which nested pages inherit. Emitting one
// here too produced the "Duplicate field 'FAQPage'" error in GSC for
// 859 /horoscope/{rashi}/{date} URLs (2026-06-02 GSC export). Same
// rule applied earlier on /panchang/layout.tsx and
// /matching/layout.tsx — see those files for the precedent comments.
export default async function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
