import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateContributionJsonLd, CONTRIBUTION_JSONLD } from '@/lib/seo/contribution-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/contributions/earth-rotation', locale);
}

const { articleJsonLd, faqJsonLd, breadcrumbJsonLd } = generateContributionJsonLd(
  CONTRIBUTION_JSONLD['earth-rotation']
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
