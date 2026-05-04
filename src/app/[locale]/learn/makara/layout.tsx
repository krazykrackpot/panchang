import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/makara', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD
        route="/learn/makara"
        locale={locale}
        title="Makara (Capricorn) in Vedic Astrology — Complete Rashi Guide"
        description="Comprehensive guide to Makara Rashi (Capricorn) covering planetary dignities, nakshatras, personality, career, compatibility, remedies, and mythology from classical Jyotish sources."
      />
      {children}
    </>
  );
}
