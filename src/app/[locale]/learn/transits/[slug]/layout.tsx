import type { Metadata } from 'next';
import { TRANSIT_ARTICLES } from '@/lib/content/transit-articles';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = 'https://dekhopanchang.com';

export function generateStaticParams() {
  return Object.keys(TRANSIT_ARTICLES).map(slug => ({ slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = TRANSIT_ARTICLES[slug];
  if (!article) return { title: 'Transit Article — Dekho Panchang' };

  const loc = locale as 'en' | 'hi';
  const title = article.title[loc] || article.title.en;
  const description = article.metaDescription[loc] || article.metaDescription.en;

  return {
    title: `${title} | Dekho Panchang`,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/learn/transits/${slug}`,
      siteName: 'Dekho Panchang',
      locale: locale === 'hi' ? 'hi_IN' : 'en_US',
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `${BASE_URL}/en/learn/transits/${slug}`,
      languages: { en: `/en/learn/transits/${slug}`, hi: `/hi/learn/transits/${slug}` },
    },
  };
}

export default async function TransitArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = TRANSIT_ARTICLES[slug];
  if (!article) return <>{children}</>;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title.en,
    description: article.metaDescription.en,
    datePublished: article.publishDate,
    dateModified: article.publishDate,
    url: `${BASE_URL}/${locale}/learn/transits/${slug}`,
    author: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    inLanguage: locale === 'hi' ? 'hi' : 'en',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: `${BASE_URL}/${locale}/learn` },
      { '@type': 'ListItem', position: 3, name: 'Transits', item: `${BASE_URL}/${locale}/learn/transits` },
      { '@type': 'ListItem', position: 4, name: article.title.en },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
