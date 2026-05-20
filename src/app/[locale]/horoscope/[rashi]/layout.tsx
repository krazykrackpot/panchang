import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { generateHoroscopeFAQ } from '@/lib/seo/faq-data';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

export const revalidate = 86400; // Daily revalidation — horoscope is deterministic per date (saves ~46K invocations/day)

export function generateStaticParams() {
  return RASHIS.map(r => ({ rashi: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; rashi: string }> }): Promise<Metadata> {
  const { locale, rashi } = await params;
  setRequestLocale(locale);
  const r = getRashiBySlug(rashi);
  if (!r) return {};

  const vedicName = tl(r.name, locale);
  const westernName = r.name.en;
  const hindiName = r.name.hi;
  // Native rashi names per locale (from RASHIS constant which has all 10 locales)
  const guName = r.name.gu || r.name.en;
  const knName = r.name.kn || r.name.en;
  const teName = r.name.te || r.name.en;
  const bnName = r.name.bn || r.name.en;

  const isHi = isDevanagariLocale(locale);

  // Root layout template appends " | Dekho Panchang" — don't include it here.
  // Keep titles short and query-focused for CTR ("तुला राशिफल आज", "tula rashifal today").
  const title = tl({
    en: `${westernName} (${hindiName}) Horoscope Today — Daily Vedic Rashifal`,
    hi: `${hindiName} राशिफल आज — ${westernName} दैनिक भविष्यफल`,
    sa: `${hindiName} राशिफल आज — ${westernName} दैनिक भविष्यफल`,
    gu: `${guName} રાશિફળ આજ — ${westernName} દૈનિક ભવિષ્યફળ`,
    kn: `${knName} ರಾಶಿಫಲ ಇಂದು — ${westernName} ದೈನಿಕ ಭವಿಷ್ಯ`,
    te: `${teName} రాశిఫలం నేడు — ${westernName} దైనిక భవిష్యం`,
    bn: `${bnName} রাশিফল আজ — ${westernName} দৈনিক ভবিষ্যৎফল`,
  }, locale);

  const rulerEn = r ? tl(r.rulerName, 'en') : '';
  const rulerHi = r ? tl(r.rulerName, 'hi') : '';
  const elementEn = r ? tl(r.element, 'en') : '';

  const description = tl({
    en: `Today's ${vedicName} (${elementEn} sign, ruled by ${rulerEn}) horoscope based on real planetary transits. Daily scores for career, love, health & finance + lucky colour, number & remedy.`,
    hi: `${hindiName} राशि (${rulerHi} ग्रह) का आज का राशिफल — करियर, प्रेम, स्वास्थ्य, वित्त स्कोर। शुभ रंग, शुभ अंक और उपाय। वास्तविक ग्रह गोचर पर आधारित।`,
    sa: `${hindiName} राशि का आज का राशिफल वास्तविक ग्रह गोचर पर आधारित  –  करियर, प्रेम, स्वास्थ्य, वित्त। सटीक वैदिक गणना, न कि सामान्य भविष्यवाणी।`,
    gu: `${guName} રાશિ માટે આજનું રાશિફળ વાસ્તવિક ગ્રહ ગોચર પર આધારિત  –  કારકિર્દી, પ્રેમ, સ્વાસ્થ્ય, નાણાં.`,
    kn: `${knName} ರಾಶಿಯ ಇಂದಿನ ರಾಶಿಫಲ ನಿಜವಾದ ಗ್ರಹ ಸಂಚಾರ ಆಧಾರಿತ  –  ವೃತ್ತಿ, ಪ್ರೀತಿ, ಆರೋಗ್ಯ, ಹಣಕಾಸು.`,
    te: `${teName} రాశి నేటి రాశిఫలం నిజమైన గ్రహ గోచారం ఆధారంగా  –  వృత్తి, ప్రేమ, ఆరోగ్యం, ఆర్థికం.`,
    bn: `${bnName} রাশির আজকের রাশিফল প্রকৃত গ্রহ গোচরের উপর ভিত্তি করে  –  ক্যারিয়ার, প্রেম, স্বাস্থ্য, অর্থ.`,
  }, locale);

  const url = `${BASE_URL}/${locale}/horoscope/${rashi}`;

  return {
    title,
    description,
    // Dual-script keywords: Latin for EN/global search, Devanagari for HI users searching in Hindi
    keywords: [
      `${westernName.toLowerCase()} horoscope today`,
      `${vedicName.toLowerCase()} rashifal`,
      `${westernName.toLowerCase()} daily horoscope`,
      `${rashi} rashi today`,
      `${hindiName} राशि`,
      `${hindiName} राशिफल`,
      `${hindiName} राशिफल आज`,
      'vedic horoscope',
      'daily rashifal',
      'moon sign horoscope',
    ],
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'mai'].map(l => [l, `${BASE_URL}/${l}/horoscope/${rashi}`])
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
  setRequestLocale(locale);
  const r = getRashiBySlug(rashi);
  const name = r ? r.name.en : rashi;
  const vedicName = r ? tl(r.name, locale) : rashi;

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/horoscope/${rashi}`, locale);
  const faqLD = generateHoroscopeFAQ(vedicName, name, 'daily');

  const today = new Date().toISOString().split('T')[0];
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${vedicName} (${name}) Horoscope Today  –  ${dateStr}`,
    description: `Daily Vedic horoscope for ${name} (${vedicName}) with career, love, health, finance & spirituality predictions based on actual planetary transits.`,
    url: `${BASE_URL}/${locale}/horoscope/${rashi}`,
    datePublished: today,
    dateModified: today,
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon.svg` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${locale}/horoscope/${rashi}`,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.text-text-primary.text-base'],
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
