import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details';
import { generateYogaArticleLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();
const ACTIVE_LOCALES = ['en', 'hi', 'ta', 'bn'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const yoga = YOGA_DETAIL_DATA[slug];
  if (!yoga) return { title: 'Yoga — Dekho Panchang' };

  const name = locale === 'hi' ? yoga.name.hi : yoga.name.en;
  const desc = (locale === 'hi' ? yoga.detailedDescription.hi[0] : yoga.detailedDescription.en[0]).slice(0, 155);
  const url = `${BASE_URL}/${locale}/learn/yoga/${slug}`;

  const languages: Record<string, string> = {};
  for (const loc of ACTIVE_LOCALES) {
    languages[loc] = `${BASE_URL}/${loc}/learn/yoga/${slug}`;
  }

  return {
    title: `${name} — Formation, Effects & Remedies | Dekho Panchang`,
    description: desc,
    keywords: [yoga.name.en, yoga.name.hi, yoga.category.replace(/_/g, ' '), 'vedic astrology', 'jyotish yoga', 'birth chart yoga'],
    openGraph: {
      title: `${name} — Vedic Astrology Yoga`,
      description: desc,
      url,
      type: 'article',
      siteName: 'Dekho Panchang',
    },
    twitter: {
      card: 'summary',
      title: name,
      description: desc,
    },
    alternates: {
      canonical: url,
      languages,
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const yoga = YOGA_DETAIL_DATA[slug];

  if (!yoga) return <>{children}</>;

  const name = locale === 'hi' ? yoga.name.hi : yoga.name.en;
  const desc = locale === 'hi' ? yoga.detailedDescription.hi[0] : yoga.detailedDescription.en[0];
  const rule = locale === 'hi' ? yoga.formationRule.hi : yoga.formationRule.en;

  const articleLD = generateYogaArticleLD({
    name,
    slug,
    locale,
    description: desc,
    category: yoga.category,
    formationRule: rule,
  });

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/learn/yoga/${slug}`, locale);

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
