import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { getMuhurtaType } from '@/lib/constants/muhurta-types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }): Promise<Metadata> {
  const { locale, type } = await params;
  return getPageMetadata(`/muhurta/${type}`, locale);
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  const info = getMuhurtaType(type);
  if (!info) return children;

  const name = info.name.en;
  const toolLD = generateToolLD(
    `${name} — Auspicious Dates 2026`,
    info.description.en,
    `https://dekhopanchang.com/${locale}/muhurta/${type}`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/muhurta/${type}`, locale);

  // Build FAQ JSON-LD directly from muhurta type data
  const faqLD = info.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: info.faqs.map(faq => ({
      '@type': 'Question',
      name: (faq.question as Record<string, string>)[locale] || faq.question.en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: (faq.answer as Record<string, string>)[locale] || faq.answer.en,
      },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {children}
    </>
  );
}
