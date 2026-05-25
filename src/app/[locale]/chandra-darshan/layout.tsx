import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/chandra-darshan', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr, isHi } = seo;
  const tithi = isHi ? p.tithi.name.hi : p.tithi.name.en;

  const title = isHi
    ? `चन्द्र दर्शन आज ${dateStr} – ${tithi}`
    : `Chandra Darshan Today ${dateStr} – ${tithi}`;

  const desc = isHi
    ? `${dateStr} चन्द्र दर्शन: तिथि ${tithi}। चन्द्रोदय समय, दृश्यता, और अगले चन्द्र दर्शन की तिथि। निःशुल्क।`
    : `${dateStr} Moon sighting: tithi ${tithi}. Moonrise time, visibility & next Chandra Darshan date. Free, location-aware.`;

  return { ...base, title, description: desc };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faqLD = generateFAQLD('/chandra-darshan', locale);
  return (
    <>
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      <ToolStructuredData
        name="Chandra Darshan Sighting"
        description="New crescent visibility for any date and city — moon sighting tool for Eid + Hindu month boundaries."
        path="/chandra-darshan"
        locale={locale}
      />
      {children}
    </>
  );
}
