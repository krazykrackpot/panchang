import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';
import { isDevanagariLocale, pickByLocale } from '@/lib/utils/locale-fonts';

import { BASE_URL } from '@/lib/seo/base-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/chandrabalam', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr } = seo;
  // Nakshatra name lives in en/hi/sa only (Trilingual). Devanagari-script locales
  // (hi/mr/mai/sa) share the Hindi rendering; all other scripts fall back to English.
  const nak = isDevanagariLocale(locale) ? p.nakshatra.name.hi : p.nakshatra.name.en;

  // Per-locale title/desc strings — never branch on isHi/isDevanagari for titles
  // (collapses 7 locales onto 2 byte-identical strings → Google duplicate-content
  // demotion). See 2026-06-02 dynamic-title-locale-collapse audit.
  const TITLES = {
    en: `Chandrabalam Today ${dateStr} – Moon in ${nak}`,
    hi: `आज का चन्द्रबल ${dateStr} – चन्द्र ${nak} में`,
    ta: `இன்றைய சந்திரபலம் ${dateStr} – சந்திரன் ${nak} இல்`,
    te: `నేటి చంద్రబలం ${dateStr} – చంద్రుడు ${nak}లో`,
    bn: `আজকের চন্দ্রবল ${dateStr} – চাঁদ ${nak}-এ`,
    gu: `આજનું ચંદ્રબળ ${dateStr} – ચંદ્ર ${nak}માં`,
    kn: `ಇಂದಿನ ಚಂದ್ರಬಲ ${dateStr} – ಚಂದ್ರ ${nak}ನಲ್ಲಿ`,
    mr: `आजचे चंद्रबल ${dateStr} – चंद्र ${nak}मध्ये`,
    mai: `आजुक चन्द्रबल ${dateStr} – चन्द्र ${nak} मे`,
  };
  const DESCS = {
    en: `${dateStr} Chandrabalam: Moon in ${nak}. Check Moon strength for all 12 signs before starting important work. Free, updated daily.`,
    hi: `${dateStr} चन्द्रबल: चन्द्रमा ${nak} नक्षत्र में। सभी 12 राशियों के लिए चन्द्र बल देखें। शुभ कार्य शुरू करने से पहले जाँचें।`,
    ta: `${dateStr} சந்திரபலம்: சந்திரன் ${nak} இல். 12 ராசிகளுக்கான சந்திர பலத்தைப் பாருங்கள். சுபகாரியங்களுக்கு முன் சரிபார்க்கவும்.`,
    te: `${dateStr} చంద్రబలం: చంద్రుడు ${nak}లో. 12 రాశులకు చంద్ర బలం చూడండి. శుభ కార్యం ముందు తనిఖీ చేయండి.`,
    bn: `${dateStr} চন্দ্রবল: চাঁদ ${nak}-এ। ১২ রাশির জন্য চন্দ্র বল দেখুন। শুভ কাজ শুরু করার আগে পরীক্ষা করুন।`,
    gu: `${dateStr} ચંદ્રબળ: ચંદ્ર ${nak}માં. 12 રાશિ માટે ચંદ્ર બળ જુઓ. શુભ કાર્ય શરૂ કરતા પહેલા તપાસો.`,
    kn: `${dateStr} ಚಂದ್ರಬಲ: ಚಂದ್ರ ${nak}ನಲ್ಲಿ. 12 ರಾಶಿಗಳಿಗೆ ಚಂದ್ರ ಬಲ ನೋಡಿ. ಶುಭ ಕಾರ್ಯ ಆರಂಭಿಸುವ ಮುಂಚೆ ಪರಿಶೀಲಿಸಿ.`,
    mr: `${dateStr} चंद्रबल: चंद्र ${nak}मध्ये. सर्व 12 राशींसाठी चंद्र बल पाहा. शुभ कार्य सुरू करण्यापूर्वी तपासा.`,
    mai: `${dateStr} चन्द्रबल: चन्द्र ${nak} मे। सब 12 राशिक चन्द्र बल देखू। शुभ कार्य सँ पहिले देखू।`,
  };

  const title = pickByLocale(TITLES, locale);
  const desc = pickByLocale(DESCS, locale);

  return { ...base, title, description: desc };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
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
