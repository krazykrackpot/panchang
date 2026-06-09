import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getDevotionalItem, TYPE_LABELS } from '@/lib/content/devotional-content';
import type { DevotionalType } from '@/lib/content/devotional-content';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { type Locale } from '@/lib/i18n/config';
import { isLocaleIndexable } from '@/lib/seo/indexable-locales';
import { buildIndexableHreflang, buildCanonicalUrl } from '@/lib/seo/hreflang';

import { BASE_URL } from '@/lib/seo/base-url';

// Schema.org `inLanguage` BCP 47 codes for the 9 visible locales.
// Falls back to 'en' on unknown locale. mai/sa share the umbrella 'hi'
// code (no separate ISO 639-1 entry on Schema.org's accepted list).
const INLANGUAGE_TAGS: Record<string, string> = {
  en: 'en', hi: 'hi', sa: 'hi', mai: 'hi', mr: 'mr',
  ta: 'ta', te: 'te', bn: 'bn', gu: 'gu', kn: 'kn',
};

interface Props {
  params: Promise<{ locale: string; type: string; slug: string }>;
}

// Per-locale title + description builders. The previous version
// branched on `locale === 'hi' ? hi : en`, collapsing 7 locales into
// identical English titles — GSC Coverage Validation flagged
// /en/devotional/chalisa/ganesh-chalisa, /gu/devotional/stotram/...
// and others as "Duplicate, Google chose different canonical than
// user". Each locale now gets a structurally distinct title via
// native-script SEO suffix, even though the underlying item title
// stays in en/hi (the source content dict only has those two).
// Lesson 2026-06-01 GSC drop.
interface DevoCopy { title: string; description: string }

function devoCopyForLocale(
  locale: Locale,
  itemNameEn: string,
  itemNameHi: string,
  typeLabelEn: string,
  typeLabelHi: string,
  deity: string,
): DevoCopy {
  switch (locale) {
    case 'en': return {
      title:       `${itemNameEn}  –  Full Text in Hindi with Meaning | Dekho Panchang`,
      description: `Read ${itemNameEn} (${typeLabelEn})  –  complete Devanagari text, English transliteration, meaning, and significance. Dedicated to ${deity}.`,
    };
    case 'hi': return {
      title:       `${itemNameHi}  –  हिंदी पाठ अर्थ सहित | देखो पंचांग`,
      description: `${itemNameHi} (${typeLabelHi})  –  पूर्ण देवनागरी पाठ, अंग्रेजी लिप्यन्तरण, अर्थ और महत्व। ${deity} को समर्पित।`,
    };
    case 'mr': return {
      title:       `${itemNameEn}  –  हिंदी मजकूर अर्थासह | देखो पंचांग`,
      description: `${itemNameEn} (${typeLabelEn}) वाचा  –  संपूर्ण देवनागरी मजकूर, इंग्रजी लिप्यंतर, अर्थ आणि महत्त्व. ${deity} ला समर्पित.`,
    };
    case 'mai': return {
      title:       `${itemNameHi}  –  हिंदी पाठ अर्थ क संग | देखो पंचांग`,
      description: `${itemNameHi} (${typeLabelHi})  –  पूर्ण देवनागरी पाठ, अंग्रेजी लिप्यन्तरण, अर्थ आ महत्व। ${deity} के समर्पित।`,
    };
    case 'bn': return {
      title:       `${itemNameEn}  –  হিন্দি পাঠ অর্থ সহ | দেখো পঞ্জিকা`,
      description: `${itemNameEn} (${typeLabelEn}) পড়ুন  –  সম্পূর্ণ দেবনাগরী পাঠ, ইংরেজি প্রতিবর্ণীকরণ, অর্থ এবং তাৎপর্য। ${deity} কে উৎসর্গীকৃত।`,
    };
    case 'te': return {
      title:       `${itemNameEn}  –  హిందీ పాఠం అర్థంతో | చూడు పంచాంగం`,
      description: `${itemNameEn} (${typeLabelEn}) చదవండి  –  పూర్తి దేవనాగరి పాఠం, ఆంగ్ల లిప్యంతరీకరణ, అర్థం మరియు ప్రాముఖ్యత. ${deity} కి అంకితం.`,
    };
    case 'gu': return {
      title:       `${itemNameEn}  –  હિન્દી પાઠ અર્થ સહિત | દેખો પંચાંગ`,
      description: `${itemNameEn} (${typeLabelEn}) વાંચો  –  સંપૂર્ણ દેવનાગરી પાઠ, અંગ્રેજી લિપ્યંતરણ, અર્થ અને મહત્વ. ${deity} ને સમર્પિત.`,
    };
    case 'kn': return {
      title:       `${itemNameEn}  –  ಹಿಂದಿ ಪಠ್ಯ ಅರ್ಥ ಸಹಿತ | ದೇಖೋ ಪಂಚಾಂಗ`,
      description: `${itemNameEn} (${typeLabelEn}) ಓದಿ  –  ಸಂಪೂರ್ಣ ದೇವನಾಗರಿ ಪಠ್ಯ, ಇಂಗ್ಲಿಷ್ ಲಿಪ್ಯಂತರಣ, ಅರ್ಥ ಮತ್ತು ಮಹತ್ವ. ${deity}ಗೆ ಸಮರ್ಪಿತ.`,
    };
    case 'ta': return {
      title:       `${itemNameEn}  –  இந்தி உரை அர்த்தத்துடன் | தேக்கோ பஞ்சாங்கம்`,
      description: `${itemNameEn} (${typeLabelEn}) படிக்கவும்  –  முழு தேவநாகரி உரை, ஆங்கில ஒலிபெயர்ப்பு, அர்த்தம் மற்றும் முக்கியத்துவம். ${deity}க்கு அர்ப்பணிக்கப்பட்டது.`,
    };
  }
  // Compile-time exhaustiveness: every Locale must have a case above.
  const _exhaustive: never = locale;
  throw new Error(`[devotional] unhandled locale: ${String(_exhaustive)}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type, slug } = await params;
  setRequestLocale(locale);
  const item = getDevotionalItem(type as DevotionalType, slug);

  // Soft-404 elimination: an unknown slug here used to fall through
  // to a minimal "Not Found" title with HTTP 200 — Google indexed the
  // URL as live thin content and counted it against the property's
  // overall quality signal (sitemap had stale entries like
  // vishnu-chalisa, plus client tools/social posts that linked to
  // typos such as `krishna-chalisa` and `kali-chalisa`). Throwing
  // notFound() in the metadata phase short-circuits to a real 404
  // before the page renders.
  if (!item) notFound();

  const typeLabel = TYPE_LABELS[type as DevotionalType];
  const { title, description } = devoCopyForLocale(
    locale as Locale,
    item.title.en,
    item.title.hi,
    typeLabel?.en ?? type,
    typeLabel?.hi ?? type,
    item.deity,
  );

  const route = `/devotional/${type}/${slug}`;
  const isIndexable = isLocaleIndexable(route, locale);
  const canonicalUrl = buildCanonicalUrl(route, locale);

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
    robots: isIndexable ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl,
      siteName: 'Dekho Panchang',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildIndexableHreflang(route),
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; type: string; slug: string }> }) {
  const { locale, type, slug } = await params;
  setRequestLocale(locale);
  const item = getDevotionalItem(type as DevotionalType, slug);

  // Mirror the metadata-phase notFound() so the Layout itself
  // doesn't render an "empty" tree on misses. The `'use client'`
  // page.tsx still has its own !item guard for any path where the
  // layout's server-side check is bypassed (it isn't today, but
  // defence in depth).
  if (!item) notFound();

  const typeLabel = TYPE_LABELS[type as DevotionalType];
  // Devanagari-script locales (hi/sa/mai/mr) keep the Hindi headline +
  // description; everyone else gets the English title for clean SERP
  // legibility (per-locale SEO chrome lives in devoCopyForLocale above).
  const isDevanagariScript = locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr';
  const title = isDevanagariScript ? item.title.hi : item.title.en;
  const description = isDevanagariScript
    ? `${item.title.hi} (${typeLabel?.hi ?? type})  –  पूर्ण देवनागरी पाठ, अर्थ सहित।`
    : `Read ${item.title.en} (${typeLabel?.en ?? type})  –  complete text, transliteration, and meaning.`;

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    datePublished: '2026-04-20',
    dateModified: '2026-04-28',
    inLanguage: INLANGUAGE_TAGS[locale] ?? 'en',
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
