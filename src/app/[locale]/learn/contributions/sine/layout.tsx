import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateContributionJsonLd, CONTRIBUTION_JSONLD } from '@/lib/seo/contribution-jsonld';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/contributions/sine', locale);
}

const { articleJsonLd, faqJsonLd, breadcrumbJsonLd } = generateContributionJsonLd(
  CONTRIBUTION_JSONLD['sine']
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
