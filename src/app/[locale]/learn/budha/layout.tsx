import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/budha', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD route="/learn/budha" locale={locale} title="Budha — Mercury in Vedic Astrology" description="Comprehensive guide to Budha (Mercury) in Jyotish — dignities, significations, effects in 12 signs and 12 houses, dasha, remedies, and mythology." />
      {children}
    </>
  );
}
