import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/karka', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD
        route="/learn/karka"
        locale={locale}
        title="Karka (Cancer) in Vedic Astrology — Complete Rashi Guide"
        description="Comprehensive guide to Karka Rashi (Cancer) covering planetary dignities, nakshatras, personality, career, compatibility, remedies, and mythology from classical Jyotish sources."
      />
      {children}
    </>
  );
}
