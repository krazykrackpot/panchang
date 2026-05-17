import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const base = getPageMetadata('/chandrabalam', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr, isHi } = seo;
  const nak = isHi ? p.nakshatra.name.hi : p.nakshatra.name.en;

  const title = isHi
    ? `आज का चन्द्रबल ${dateStr} – चन्द्र ${nak} में`
    : `Chandrabalam Today ${dateStr} – Moon in ${nak}`;

  const desc = isHi
    ? `${dateStr} चन्द्रबल: चन्द्रमा ${nak} नक्षत्र में। सभी 12 राशियों के लिए चन्द्र बल देखें। शुभ कार्य शुरू करने से पहले जाँचें।`
    : `${dateStr} Chandrabalam: Moon in ${nak}. Check Moon strength for all 12 signs before starting important work. Free, updated daily.`;

  return { ...base, title, description: desc };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const faqLD = generateFAQLD('/chandrabalam', locale);
  const toolLD = generateToolLD(
    'Chandrabalam Calculator',
    'Check today\'s Chandrabalam (Moon strength) for all 12 zodiac signs based on Muhurta Chintamani rules.',
    `${BASE_URL}/${locale}/chandrabalam`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/chandrabalam`, locale);
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
