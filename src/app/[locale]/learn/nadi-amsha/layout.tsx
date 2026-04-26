import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/nadi-amsha', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD route="/learn/nadi-amsha" locale={locale} title="Nadi Amsha (D-150) - The Finest Divisional Chart" description="Understanding the 150th divisional chart in Vedic Astrology for subtle karmic analysis." />
      {children}
    </>
  );
}
