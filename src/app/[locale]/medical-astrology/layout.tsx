import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateToolLD, generateBreadcrumbLD, generateExpertiseArticleLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/medical-astrology', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const toolLD = generateToolLD(
    'Medical Astrology — Prakriti & Body Map',
    'Discover your Ayurvedic constitution (Prakriti), body vulnerability map, health timeline, and disease susceptibility patterns from your Vedic birth chart.',
    `https://dekhopanchang.com/${locale}/medical-astrology`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/medical-astrology`, locale);
  const expertiseLD = generateExpertiseArticleLD({
    title: 'Medical Astrology (Chikitsa Jyotish) — Prakriti & Body Map',
    description: 'Vedic medical astrology analysis covering Ayurvedic constitution (Prakriti), body vulnerability mapping, health timeline, and disease susceptibility patterns.',
    url: `https://dekhopanchang.com/${locale}/medical-astrology`,
    locale,
    citations: ['Brihat Parashara Hora Shastra — Disease Chapter', 'Charaka Samhita — Prakriti Classification', 'Jataka Parijata — Medical Indicators'],
    expertise: ['Medical Astrology (Chikitsa Jyotish)', 'Ayurvedic Constitution (Prakriti)', 'Planetary Health Indicators', 'Vedic Disease Analysis'],
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(expertiseLD) }} />
      {children}
    </>
  );
}
