import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/smarta-vaishnava', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <LearnArticleLD route="/learn/smarta-vaishnava" locale={locale} title="Smarta & Vaishnava Calendar Systems — When Festivals Differ" description="Why Smarta and Vaishnava traditions sometimes observe the same festival on different days. Udaya Tithi, Viddha rejection, and Ekadashi rules explained." />
      {children}
    </>
  );
}
