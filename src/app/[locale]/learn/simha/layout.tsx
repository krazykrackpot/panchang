import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/simha', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD route="/learn/simha" locale={locale} title="Simha (Leo) — The Fifth Rashi in Vedic Astrology" description="Comprehensive guide to Simha Rashi (Leo) in Jyotish — personality, nakshatras, planetary dignities, each planet's effect, career, compatibility, remedies, and mythology." />
      {children}
    </>
  );
}
