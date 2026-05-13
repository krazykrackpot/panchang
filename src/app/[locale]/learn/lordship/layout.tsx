import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/lordship', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD
        route="/learn/lordship"
        locale={locale}
        title="Planet Lordship & Karakas — Vedic Astrology Reference"
        description="Complete reference for sign lordship, exaltation, debilitation, natural house karakas, and functional benefics/malefics per lagna from BPHS."
      />
      {children}
    </>
  );
}
