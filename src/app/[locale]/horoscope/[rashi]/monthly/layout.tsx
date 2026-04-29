import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug, VEDIC_TO_WESTERN } from '@/lib/constants/rashi-slugs';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { generateHoroscopeFAQ } from '@/lib/seo/faq-data';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

function getMonthRange(): { start: string; end: string; label: string; labelHi: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const labelEn = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const labelHi = firstDay.toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });

  return {
    start: fmt(firstDay),
    end: fmt(lastDay),
    label: labelEn,
    labelHi,
  };
}

export function generateStaticParams() {
  return RASHIS.map(r => ({ rashi: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; rashi: string }> }): Promise<Metadata> {
  const { locale, rashi } = await params;
  const r = getRashiBySlug(rashi);
  if (!r) return {};

  const vedicName = tl(r.name, locale);
  const westernName = r.name.en;
  const hindiName = r.name.hi;
  const month = getMonthRange();
  const westernSlug = VEDIC_TO_WESTERN[rashi];

  const title = tl({
    en: `${vedicName} (${westernName}) Monthly Horoscope | ${month.label}`,
    hi: `${hindiName} (${westernName}) मासिक राशिफल | ${month.labelHi}`,
    sa: `${hindiName} (${westernName}) मासिक राशिफल | ${month.labelHi}`,
  }, locale);

  const description = tl({
    en: `${westernName} (${vedicName}) monthly horoscope for ${month.label}. Calendar heatmap, career, love, health & finance predictions. Best and worst weeks based on Vedic planetary transits.`,
    hi: `${hindiName} राशि का मासिक राशिफल ${month.labelHi}। कैलेंडर हीटमैप, करियर, प्रेम, स्वास्थ्य एवं वित्त भविष्यवाणी। वैदिक ग्रह गोचर पर आधारित।`,
    sa: `${hindiName} राशि का मासिक राशिफल ${month.labelHi}। कैलेंडर हीटमैप, करियर, प्रेम, स्वास्थ्य एवं वित्त भविष्यवाणी। वैदिक ग्रह गोचर पर आधारित।`,
  }, locale);

  const url = `${BASE_URL}/${locale}/horoscope/${rashi}/monthly`;

  return {
    title,
    description,
    keywords: [
      `${westernName.toLowerCase()} monthly horoscope`,
      `${westernName.toLowerCase()} monthly horoscope ${month.label.toLowerCase()}`,
      `${vedicName.toLowerCase()} masik rashifal`,
      `${westernName.toLowerCase()} horoscope this month`,
      `${rashi} rashi monthly`,
      westernSlug ? `${westernSlug} monthly horoscope` : '',
      'monthly rashifal',
      'vedic monthly horoscope',
      'masik rashifal',
    ].filter(Boolean),
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'mai'].map(l => [l, `${BASE_URL}/${l}/horoscope/${rashi}/monthly`])
      ),
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Dekho Panchang',
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; rashi: string }> }) {
  const { locale, rashi } = await params;
  const r = getRashiBySlug(rashi);
  const name = r ? r.name.en : rashi;
  const vedicName = r ? tl(r.name, locale) : rashi;
  const month = getMonthRange();

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/horoscope/${rashi}/monthly`, locale);
  const faqLD = generateHoroscopeFAQ(vedicName, name, 'monthly');

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${vedicName} (${name}) Monthly Horoscope — ${month.label}`,
    description: `Monthly Vedic horoscope for ${name} (${vedicName}) with calendar heatmap, career, love, health, finance predictions and best/worst weeks.`,
    url: `${BASE_URL}/${locale}/horoscope/${rashi}/monthly`,
    datePublished: month.start,
    dateModified: month.start,
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${locale}/horoscope/${rashi}/monthly`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      {children}
    </>
  );
}
