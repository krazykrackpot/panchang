import type { Metadata } from 'next';
import { getVratKatha, getAllVratKathaSlugs } from '@/lib/content/vrat-kathas';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { locales } from '@/lib/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const katha = getVratKatha(slug);
  if (!katha) return {};

  const title = (katha.title as Record<string, string>)[locale] || katha.title.en;
  const description = locale === 'hi'
    ? `${title} — विधि, फल और कब करें। Dekho Panchang पर पढ़ें।`
    : `${title} — Vidhi, benefits, and when to observe. Read on Dekho Panchang.`;

  // Build hreflang alternates for ALL locales
  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[l] = `${BASE_URL}/${l}/vrat-katha/${slug}`;
  }
  alternateLanguages['x-default'] = `${BASE_URL}/en/vrat-katha/${slug}`;

  return {
    title: `${title} | Dekho Panchang`,
    description,
    keywords: [
      katha.title.en.toLowerCase(),
      `${slug} vrat katha`,
      'vrat katha in hindi',
      'hindu fasting story',
      'vrat vidhi',
    ],
    openGraph: {
      title: `${title} | Dekho Panchang`,
      description,
      type: 'article',
      url: `${BASE_URL}/${locale}/vrat-katha/${slug}`,
      siteName: 'Dekho Panchang',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Dekho Panchang`,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/vrat-katha/${slug}`,
      languages: alternateLanguages,
    },
  };
}

export async function generateStaticParams() {
  return getAllVratKathaSlugs().map(slug => ({ slug }));
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const katha = getVratKatha(slug);

  if (!katha) return <>{children}</>;

  const title = (katha.title as Record<string, string>)[locale] || katha.title.en;
  const description = locale === 'hi'
    ? `${title} — विधि, फल और कब करें।`
    : `${title} — Vidhi, benefits, and when to observe.`;

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    datePublished: '2026-04-25',
    dateModified: '2026-04-28',
    inLanguage: locale === 'hi' ? 'hi' : 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${locale}/vrat-katha/${slug}` },
    isAccessibleForFree: true,
  };

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/vrat-katha/${slug}`, locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
