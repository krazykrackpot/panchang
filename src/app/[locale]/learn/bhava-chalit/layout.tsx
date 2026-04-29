import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/bhava-chalit', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD route="/learn/bhava-chalit" locale={locale} title="Bhava Chalit — House System Explained" description="Understand the Bhava Chalit chart: how it differs from the Rashi chart, when to use it, and the expert debate on whole-sign vs house-based systems." />
      {children}
    </>
  );
}
