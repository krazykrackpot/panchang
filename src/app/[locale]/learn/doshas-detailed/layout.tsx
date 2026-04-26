import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/doshas-detailed', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD route="/learn/doshas-detailed" locale={locale} title="Doshas in Vedic Astrology — Comprehensive Guide" description="In-depth guide to all major Jyotish doshas: Mangal, Kaal Sarpa, Pitra, Kemdrum, Guru Chandal, and Grahan Dosha. Detection, severity, cancellation, remedies, and classical references." />
      {children}
    </>
  );
}
