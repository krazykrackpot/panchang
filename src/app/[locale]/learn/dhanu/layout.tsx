import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/dhanu', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD
        route="/learn/dhanu"
        locale={locale}
        title="Dhanu (Sagittarius) in Vedic Astrology — Complete Rashi Guide"
        description="Comprehensive guide to Dhanu Rashi (Sagittarius) covering planetary dignities, nakshatras, personality, career, compatibility, remedies, and mythology from classical Jyotish sources."
      />
      {children}
    </>
  );
}
