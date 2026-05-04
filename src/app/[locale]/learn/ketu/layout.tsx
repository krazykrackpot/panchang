import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/ketu', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD route="/learn/ketu" locale={locale} title="Ketu — The South Lunar Node in Vedic Astrology" description="Comprehensive guide to Ketu (South Node) in Jyotish — the shadow planet of detachment, moksha, and past-life karma. Dignities, effects in 12 signs and houses, dasha, remedies, and mythology." />
      {children}
    </>
  );
}
