import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details';
import { generateYogaArticleLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import {
  FEATURED_YOGAS,
  INDEXABLE_LAGNA_LOCALES,
  buildIndexableLagnaHreflang,
} from '@/lib/seo/lagna-seo';

// Strip trailing slash defensively (Gemini #266 leftover MED) — without
// this, a misconfigured env var (`https://example.com/`) yields
// `https://example.com//en/...` double slashes in canonical + OG URLs.
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim().replace(/\/$/, '');

// ──────────────────────────────────────────────────────────────
// Static params: pre-render the 10 cross-linked yoga pages × EN+HI
// = 20 pages. Other slugs + locales still resolve via ISR. Lives in
// the LAYOUT because page.tsx is `'use client'` and can't host
// generateStaticParams directly.
//
// Why only the 10 featured yogas: those are the slugs cross-linked
// from /kundali root + every /kundali/lagna/[sign] page (PR-2), so
// they get the highest crawl-priority signal. Pre-rendering ensures
// they have instant TTI when Google's crawler arrives via those
// 250+ internal links.
// ──────────────────────────────────────────────────────────────

export function generateStaticParams(): Array<{ locale: string; slug: string }> {
  return INDEXABLE_LAGNA_LOCALES.flatMap(locale =>
    FEATURED_YOGAS.map(y => ({ locale, slug: y.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  // Normalise slug to lowercase for both lookup AND every URL output
  // (Gemini #250 re-review HIGH). Yoga keys in YOGA_DETAIL_DATA are
  // lowercase-with-underscores; canonical + hreflang must agree.
  const normalizedSlug = slug.toLowerCase();
  const yoga = YOGA_DETAIL_DATA[normalizedSlug];
  if (!yoga) return { title: 'Yoga — Dekho Panchang' };

  const isHi = locale === 'hi';
  const name = isHi ? yoga.name.hi : yoga.name.en;
  // Optional-chained: a future YOGA_DETAIL_DATA entry with an empty
  // detailedDescription array would crash `.slice` on undefined.
  // Gemini #250 MED — defensive fallback to the EN copy, then ''.
  const desc = (
    (isHi ? yoga.detailedDescription.hi?.[0] : yoga.detailedDescription.en?.[0])
    ?? yoga.detailedDescription.en?.[0]
    ?? ''
  ).slice(0, 155);
  const isIndexable = (INDEXABLE_LAGNA_LOCALES as readonly string[]).includes(locale);

  // Canonical points at the page's own lowercase URL when indexable,
  // else at EN (Lesson — non-indexable copies must point to canonical EN).
  const canonicalUrl = isIndexable
    ? `${BASE_URL}/${locale}/learn/yoga/${normalizedSlug}`
    : `${BASE_URL}/en/learn/yoga/${normalizedSlug}`;

  // Polished title — leads with "{name} in Vedic Astrology" pattern
  // that matches "what is X yoga" / "X yoga meaning" intent queries.
  // Brand suffix lives in the root layout title template.
  const title = isHi
    ? `${name} — अर्थ, गठन, प्रभाव और उपाय`
    : `${name} in Vedic Astrology — Meaning, Formation, Effects & Remedies`;

  return {
    title,
    description: desc,
    keywords: [
      yoga.name.en,
      yoga.name.hi,
      `${yoga.name.en.toLowerCase()} meaning`,
      `what is ${yoga.name.en.toLowerCase()}`,
      `${yoga.name.en.toLowerCase()} effects`,
      yoga.category.replace(/_/g, ' '),
      'vedic astrology',
      'jyotish yoga',
      'birth chart yoga',
    ],
    // Match the lagna-page locale strategy: indexable in EN+HI, noindex
    // elsewhere. Other locales render same content but tagged
    // noindex/follow so hreflang stays honest without polluting SERPs.
    robots: isIndexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: isHi
        ? `${name} — वैदिक ज्योतिष योग`
        : `${name} — Vedic Astrology Yoga`,
      description: desc,
      url: canonicalUrl,
      type: 'article',
      siteName: 'Dekho Panchang',
    },
    twitter: {
      card: 'summary',
      title: name,
      description: desc,
    },
    alternates: {
      canonical: canonicalUrl,
      // Hreflang restricted to INDEXABLE_LAGNA_LOCALES + x-default
      // (Gemini #250 HIGH). Fanning out to all 9 locales would point
      // hreflang at noindex pages — GSC flags this as "Hreflang to
      // non-indexable page" / "Hreflang conflicts".
      languages: buildIndexableLagnaHreflang(`/learn/yoga/${normalizedSlug}`),
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  // Same normalisation as generateMetadata so Article/Breadcrumb JSON-LD
  // URLs match the canonical (Gemini #250 re-review HIGH).
  const normalizedSlug = slug.toLowerCase();
  const yoga = YOGA_DETAIL_DATA[normalizedSlug];

  if (!yoga) return <>{children}</>;

  const name = locale === 'hi' ? yoga.name.hi : yoga.name.en;
  const desc = locale === 'hi' ? yoga.detailedDescription.hi[0] : yoga.detailedDescription.en[0];
  const rule = locale === 'hi' ? yoga.formationRule.hi : yoga.formationRule.en;

  const articleLD = generateYogaArticleLD({
    name,
    slug: normalizedSlug,
    locale,
    description: desc,
    category: yoga.category,
    formationRule: rule,
  });

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/learn/yoga/${normalizedSlug}`, locale);

  // FAQ schema — captures "What is [yoga]?" featured snippets
  const faqQuestions: { q: string; a: string }[] = [];
  faqQuestions.push({
    q: `What is ${name}?`,
    a: desc.slice(0, 300),
  });
  faqQuestions.push({
    q: `How is ${name} formed in a birth chart?`,
    a: rule,
  });
  if (yoga.effects?.length > 0) {
    const effectsSummary = yoga.effects.slice(0, 3).map(e => {
      const area = locale === 'hi' ? e.area.hi : e.area.en;
      const edesc = locale === 'hi' ? e.description.hi : e.description.en;
      return `${area}: ${edesc}`;
    }).join('. ');
    faqQuestions.push({
      q: `What are the effects of ${name}?`,
      a: effectsSummary,
    });
  }
  if (yoga.remedies) {
    const parts: string[] = [];
    if (yoga.remedies.mantra) parts.push(`Mantra: ${yoga.remedies.mantra}`);
    if (yoga.remedies.gemstone) parts.push(`Gemstone: ${locale === 'hi' ? yoga.remedies.gemstone.hi : yoga.remedies.gemstone.en}`);
    if (yoga.remedies.charity) parts.push(`Charity: ${locale === 'hi' ? yoga.remedies.charity.hi : yoga.remedies.charity.en}`);
    if (parts.length > 0) {
      faqQuestions.push({
        q: `What are the remedies for ${name}?`,
        a: parts.join('. '),
      });
    }
  }

  const faqLD = faqQuestions.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions.map(fq => ({
      '@type': 'Question',
      name: fq.q,
      acceptedAnswer: { '@type': 'Answer', text: fq.a },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {faqLD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />}
      {children}
    </>
  );
}
