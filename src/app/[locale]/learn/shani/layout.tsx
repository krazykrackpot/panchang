import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/shani', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD route="/learn/shani" locale={locale} title="Shani — Saturn in Vedic Astrology" description="Comprehensive guide to Shani (Saturn) in Jyotish — dignities, significations, effects in 12 signs and 12 houses, dasha, Sade Sati, remedies, and mythology." />
      {children}
    </>
  );
}
