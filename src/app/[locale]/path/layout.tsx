// src/app/[locale]/path/layout.tsx
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

// Title chrome for the gated `/path` dashboard. Page is noindex so
// SEO weight is zero — these strings are purely the browser tab + OG
// fallback. en+hi authored; pre-commit Gemini overlay sync (chore
// #589) backfills the 7 regional locales.
const TITLES: Record<string, string> = {
  en: 'Sadhaka Path — Your Progress',
  hi: 'साधक पथ — आपकी प्रगति',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    title: TITLES[locale] ?? TITLES.en,
    robots: { index: false, follow: true },
  };
}
export default async function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
