import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { generateArticleLD } from '@/lib/seo/article-ld';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/lagna', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const meta = await getPageMetadata('/learn/lagna', locale);
  const title = typeof meta.title === 'string' ? meta.title : 'Lagna — The Ascendant';
  const description = typeof meta.description === 'string' ? meta.description : '';

  const faqLD = generateFAQLD('/learn/lagna', locale);
  const articleLD = generateArticleLD('/learn/lagna', locale, title, description);

  return (
    <>
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {articleLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      )}
      {children}
    </>
  );
}
