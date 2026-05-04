import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/vrishchika', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD route="/learn/vrishchika" locale={locale} title="Vrishchika (Scorpio) — The Eighth Rashi in Vedic Astrology" description="Comprehensive guide to Vrishchika Rashi (Scorpio) in Jyotish — personality, nakshatras, planetary dignities, each planet's effect, career, compatibility, remedies, and mythology." />
      {children}
    </>
  );
}
