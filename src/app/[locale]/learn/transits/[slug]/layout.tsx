import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { LOCALIZED_TRANSIT_ARTICLES } from '@/lib/content/transit-articles-with-overlay';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { tl } from '@/lib/utils/trilingual';
import type { Locale } from '@/types/panchang';
import { buildIndexableHreflang } from '@/lib/seo/hreflang';

const BASE_URL = 'https://dekhopanchang.com';

// Open Graph requires a BCP 47-ish underscore-joined locale tag. Indic
// regional locales use `<lang>_IN` per Facebook's convention. Maithili
// (`mai_IN`) is not in Facebook's documented set but is a valid BCP 47
// extension and Facebook accepts unknown tags gracefully.
const OG_LOCALE_TAGS: Record<string, string> = {
  en: 'en_US', hi: 'hi_IN', ta: 'ta_IN', te: 'te_IN',
  bn: 'bn_IN', gu: 'gu_IN', kn: 'kn_IN', mai: 'mai_IN', mr: 'mr_IN',
};

// Schema.org `inLanguage` accepts ISO 639-1 codes. All 9 visible
// locales have a valid 639-1 tag (mai = Maithili).
const INLANGUAGE_TAGS: Record<string, string> = {
  en: 'en', hi: 'hi', ta: 'ta', te: 'te',
  bn: 'bn', gu: 'gu', kn: 'kn', mai: 'mai', mr: 'mr',
};

export function generateStaticParams() {
  return Object.keys(LOCALIZED_TRANSIT_ARTICLES).map(slug => ({ slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = LOCALIZED_TRANSIT_ARTICLES[slug];
  if (!article) return { title: 'Transit Article  –  Dekho Panchang' };

  const localeKey = locale as Locale;
  const title = tl(article.title, localeKey);
  const description = tl(article.metaDescription, localeKey);

  return {
    title: `${title} | Dekho Panchang`,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/learn/transits/${slug}`,
      siteName: 'Dekho Panchang',
      locale: OG_LOCALE_TAGS[locale] ?? 'en_US',
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/transits/${slug}`,
      // Fan out to every locale whose translations exist (puja-PR
      // pattern: overlay coverage + central policy). Previous map was
      // hand-rolled en+hi+ta+bn, out of sync with actual coverage.
      languages: buildIndexableHreflang(`/learn/transits/${slug}`),
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
  setRequestLocale(locale);
  const article = LOCALIZED_TRANSIT_ARTICLES[slug];
  if (!article) return <>{children}</>;

  const localeKey = locale as Locale;
  // Article JSON-LD keeps EN headline/description (Schema.org Article
  // entities are indexed once across locales by Google — locale-aware
  // text would create a multi-Article fork that's not how rich
  // results consume this).
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
    inLanguage: INLANGUAGE_TAGS[locale] ?? 'en',
  };

  // Breadcrumb name uses the localised article title — breadcrumb
  // rich result is shown per-locale-page, unlike Article.
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: `${BASE_URL}/${locale}/learn` },
      { '@type': 'ListItem', position: 3, name: 'Transits', item: `${BASE_URL}/${locale}/learn/transits` },
      { '@type': 'ListItem', position: 4, name: tl(article.title, localeKey) },
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
