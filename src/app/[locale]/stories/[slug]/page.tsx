import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { getStoryBySlug, getAllStorySlugs } from '@/lib/stories/story-data';
import StoryViewer from '@/components/stories/StoryViewer';
import { locales } from '@/lib/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateStaticParams() {
  const slugs = getAllStorySlugs();
  return locales.flatMap(locale =>
    slugs.map(slug => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return {};

  const isHi = locale === 'hi' || locale === 'sa';
  const title = isHi ? story.title.hi : story.title.en;
  const description = isHi ? story.description.hi : story.description.en;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/stories/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${BASE_URL}/${locale}/stories/${slug}`,
      siteName: 'Dekho Panchang',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const isHi = locale === 'hi' || locale === 'sa';
  const title = isHi ? story.title.hi : story.title.en;
  const description = isHi ? story.description.hi : story.description.en;
  const url = `${BASE_URL}/${locale}/stories/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description,
    author: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    url,
    inLanguage: locale === 'hi' ? 'hi' : locale === 'sa' ? 'sa' : 'en',
  };

  return (
    <>
      <Script
        id={`story-jsonld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoryViewer />
    </>
  );
}
