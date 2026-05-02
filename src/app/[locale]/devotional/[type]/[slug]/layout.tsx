import type { Metadata } from 'next';
import { getDevotionalItem, TYPE_LABELS } from '@/lib/content/devotional-content';
import type { DevotionalType } from '@/lib/content/devotional-content';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { locales } from '@/lib/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

interface Props {
  params: Promise<{ locale: string; type: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type, slug } = await params;
  const item = getDevotionalItem(type as DevotionalType, slug);

  if (!item) {
    return { title: 'Not Found — Dekho Panchang' };
  }

  const typeLabel = TYPE_LABELS[type as DevotionalType];
  const titleEn = `${item.title.en} — Full Text in Hindi with Meaning | Dekho Panchang`;
  const titleHi = `${item.title.hi} — हिंदी पाठ अर्थ सहित | देखो पंचांग`;
  const title = locale === 'hi' ? titleHi : titleEn;

  const descEn = `Read ${item.title.en} (${typeLabel?.en ?? type}) — complete Devanagari text, English transliteration, meaning, and significance. Dedicated to ${item.deity}.`;
  const descHi = `${item.title.hi} (${typeLabel?.hi ?? type}) — पूर्ण देवनागरी पाठ, अंग्रेजी लिप्यन्तरण, अर्थ और महत्व। ${item.deity} को समर्पित।`;
  const description = locale === 'hi' ? descHi : descEn;

  // Build hreflang alternates for ALL locales
  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[l] = `${BASE_URL}/${l}/devotional/${type}/${slug}`;
  }
  alternateLanguages['x-default'] = `${BASE_URL}/en/devotional/${type}/${slug}`;

  return {
    title,
    description,
    keywords: [
      item.title.en.toLowerCase(),
      item.title.hi,
      `${type} lyrics`,
      `${item.deity} ${type}`,
      `${item.title.en} in hindi`,
      `${item.title.en} meaning`,
      `${item.title.en} lyrics`,
      'hindu devotional',
      'vedic prayer',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${BASE_URL}/${locale}/devotional/${type}/${slug}`,
      siteName: 'Dekho Panchang',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/devotional/${type}/${slug}`,
      languages: alternateLanguages,
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; type: string; slug: string }> }) {
  const { locale, type, slug } = await params;
  const item = getDevotionalItem(type as DevotionalType, slug);

  if (!item) return children;

  const typeLabel = TYPE_LABELS[type as DevotionalType];
  const title = locale === 'hi' ? item.title.hi : item.title.en;
  const description = locale === 'hi'
    ? `${item.title.hi} (${typeLabel?.hi ?? type}) — पूर्ण देवनागरी पाठ, अर्थ सहित।`
    : `Read ${item.title.en} (${typeLabel?.en ?? type}) — complete text, transliteration, and meaning.`;

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    datePublished: '2026-04-20',
    dateModified: '2026-04-28',
    inLanguage: locale === 'hi' ? 'hi' : 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${locale}/devotional/${type}/${slug}` },
    isAccessibleForFree: true,
    about: [
      { '@type': 'Thing', name: item.deity },
      { '@type': 'Thing', name: `Hindu ${typeLabel?.en ?? type}` },
    ],
  };

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/devotional/${type}/${slug}`, locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
