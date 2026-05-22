// src/app/[locale]/path/layout.tsx
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    title: locale === 'hi' ? 'साधक पथ — आपकी प्रगति' : 'Sadhaka Path — Your Progress',
    robots: { index: false, follow: true },
  };
}
export default async function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
