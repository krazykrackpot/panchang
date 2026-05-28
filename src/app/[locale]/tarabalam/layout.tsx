import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';

import { BASE_URL } from '@/lib/seo/base-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/tarabalam', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr, isHi } = seo;
  const nak = isHi ? p.nakshatra.name.hi : p.nakshatra.name.en;

  const title = isHi
    ? `आज का तारबल ${dateStr} – चन्द्र ${nak} में`
    : `Tarabalam Today ${dateStr} – Moon in ${nak}`;

  const desc = isHi
    ? `${dateStr} तारबल: चन्द्रमा ${nak} नक्षत्र में। सभी 27 नक्षत्रों के लिए 9-तारा चक्र से शुभ/अशुभ जानें।`
    : `${dateStr} Tarabalam: Moon in ${nak}. Check star strength for all 27 nakshatras using the 9-tara cycle. Free, updated daily.`;

  return { ...base, title, description: desc };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faqLD = generateFAQLD('/tarabalam', locale);
  const toolLD = generateToolLD(
    'Tarabalam Calculator',
    'Check today\'s Tarabalam (star strength) for all 27 nakshatras using the 9-tara cycle.',
    `${BASE_URL}/${locale}/tarabalam`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/tarabalam`, locale);
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
