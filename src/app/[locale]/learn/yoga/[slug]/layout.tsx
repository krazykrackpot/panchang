import { notFound, permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details';
import { resolveCanonicalYogaSlug } from '@/lib/yogas/canonical-slugs';
import { generateYogaArticleLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { FEATURED_YOGAS, INDEXABLE_LAGNA_LOCALES } from '@/lib/seo/lagna-seo';
import { isLocaleIndexable } from '@/lib/seo/indexable-locales';
import { buildIndexableHreflang, buildCanonicalUrl } from '@/lib/seo/hreflang';
import { tl } from '@/lib/utils/trilingual';

// Strip trailing slash defensively (Gemini #266 leftover MED) — without
// this, a misconfigured env var (`https://example.com/`) yields
// `https://example.com//en/...` double slashes in canonical + OG URLs.
import { BASE_URL } from '@/lib/seo/base-url';

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
  // Resolve hyphen variants (e.g. `gaja-kesari` → `gajakesari`,
  // `chandra-mangala` → `chandra_mangala`) BEFORE the not-found check
  // so soft-404s caused by a missing hyphen become a 308 to the
  // canonical URL. See resolveCanonicalYogaSlug above.
  const canonicalSlug = resolveCanonicalYogaSlug(normalizedSlug);
  // Compare against the raw `slug` (not `normalizedSlug`) so uppercase-
  // only differences also trigger a 308 — `/learn/yoga/Gajakesari`
  // previously slipped through because lowercase(slug) === canonicalSlug,
  // leaving Google with a duplicate-content 200 OK at the uppercase URL.
  // Gemini PR #362 cycle-2 MED.
  if (canonicalSlug && canonicalSlug !== slug) {
    permanentRedirect(`/${locale}/learn/yoga/${canonicalSlug}`);
  }
  const yoga = canonicalSlug ? YOGA_DETAIL_DATA[canonicalSlug] : undefined;
  // Unknown slug → real 404. The previous stub-title return left Google
  // looking at a 200 OK page with a "Yoga not found" client message —
  // textbook soft 404. (GSC flagged /learn/yoga/lagna_mallika 2026-05-28/29.)
  if (!yoga) notFound();

  const name = tl(yoga.name, locale);
  // Optional-chained: a future YOGA_DETAIL_DATA entry with an empty
  // detailedDescription array would crash `.slice` on undefined.
  // Gemini #250 MED — defensive fallback to the EN copy, then ''.
  const descArr =
    (yoga.detailedDescription as Record<string, string[] | undefined>)[locale]
    ?? yoga.detailedDescription.en;
  const desc = (descArr?.[0] ?? yoga.detailedDescription.en?.[0] ?? '').slice(0, 155);
  // Indexability now sourced from the central per-route policy in
  // src/lib/seo/indexable-locales.ts. The /learn/ prefix declares en+hi
  // indexable; this layout used to read the same set from a local
  // INDEXABLE_LAGNA_LOCALES constant, which was a drift surface. Spec
  // 2026-06-04-noindex-thin-translation-locales.md Q4. Migration kept
  // the lagna constant import only for generateStaticParams's prebuild
  // allowlist — that's a different concern (which locales to SSG) from
  // indexability.
  const route = `/learn/yoga/${normalizedSlug}`;
  const isIndexable = isLocaleIndexable(route, locale);

  // Canonical points at the page's own lowercase URL when indexable,
  // else at the default locale (non-indexable copies must point to
  // the canonical default-locale URL).
  const canonicalUrl = buildCanonicalUrl(route, locale);

  // Polished title — leads with "{name} in Vedic Astrology" pattern
  // that matches "what is X yoga" / "X yoga meaning" intent queries.
  // Brand suffix lives in the root layout title template.
  const TITLE_SUFFIX: Record<string, string> = {
    en: 'in Vedic Astrology — Meaning, Formation, Effects & Remedies',
    hi: '— अर्थ, गठन, प्रभाव और उपाय',
  };
  const OG_SUFFIX: Record<string, string> = {
    en: '— Vedic Astrology Yoga',
    hi: '— वैदिक ज्योतिष योग',
  };
  const title = `${name} ${TITLE_SUFFIX[locale] ?? TITLE_SUFFIX.en}`;

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
      title: `${name} ${OG_SUFFIX[locale] ?? OG_SUFFIX.en}`,
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
      // Hreflang restricted to the route's indexable-locale set + x-default
      // via the central policy (Gemini #250 HIGH origin; central policy
      // since spec 2026-06-04). Fanning out to all 9 locales would point
      // hreflang at noindex pages — GSC flags this as "Hreflang to
      // non-indexable page" / "Hreflang conflicts".
      languages: buildIndexableHreflang(route),
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  // Same normalisation as generateMetadata so Article/Breadcrumb JSON-LD
  // URLs match the canonical (Gemini #250 re-review HIGH).
  const normalizedSlug = slug.toLowerCase();
  // Hyphen-variant resolver mirrors generateMetadata. If the user typed
  // `/learn/yoga/gaja-kesari`, redirect 308 to `/learn/yoga/gajakesari`
  // (the canonical key in YOGA_DETAIL_DATA). 2026-06-02 audit.
  const canonicalSlug = resolveCanonicalYogaSlug(normalizedSlug);
  // Compare against the raw `slug` (not `normalizedSlug`) so uppercase-
  // only differences also trigger a 308 — see generateMetadata above.
  // Gemini PR #362 cycle-2 MED.
  if (canonicalSlug && canonicalSlug !== slug) {
    permanentRedirect(`/${locale}/learn/yoga/${canonicalSlug}`);
  }
  const yoga = canonicalSlug ? YOGA_DETAIL_DATA[canonicalSlug] : undefined;

  // Trigger real HTTP 404 (not soft 404). Previously the layout returned
  // <>{children}</> for unknown slugs, which let the `'use client'` page
  // render its "Yoga not found" message with HTTP 200 — Google's textbook
  // soft-404 pattern. GSC flagged /learn/yoga/lagna_mallika that way
  // (2026-05-28/29). Now Next 16 routes the request to the nearest
  // not-found.tsx with a proper 404 status.
  if (!yoga) notFound();

  const name = tl(yoga.name, locale);
  const desc = (
    (yoga.detailedDescription as Record<string, string[] | undefined>)[locale]
    ?? yoga.detailedDescription.en
  )[0];
  const rule = tl(yoga.formationRule, locale);

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
      const area = tl(e.area, locale);
      const edesc = tl(e.description, locale);
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
    if (yoga.remedies.gemstone) parts.push(`Gemstone: ${tl(yoga.remedies.gemstone, locale)}`);
    if (yoga.remedies.charity) parts.push(`Charity: ${tl(yoga.remedies.charity, locale)}`);
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
