import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/panchang/yoga', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const faqLD = generateFAQLD('/panchang/yoga', locale);
  return (
    <>
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      )}
      {children}
    </>
  );
}
