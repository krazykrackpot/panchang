import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/dasha-sandhi', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD route="/learn/dasha-sandhi" locale={locale} title="Dasha Sandhi — Junction Periods Between Planetary Dashas" description="Understanding Dasha Sandhi — the critical transition windows between Maha, Antar, and Pratyantar Dashas." />
      {children}
    </>
  );
}
