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

  const { p, dateStr } = seo;
  // Tithi name lives in en/hi/sa only (Trilingual). Devanagari-script locales
  // (hi/mr/mai/sa) share the Hindi rendering; all other scripts fall back to English.
  const isDevanagariScript = ['hi', 'mr', 'mai', 'sa'].includes(locale);
  const tithi = isDevanagariScript ? p.tithi.name.hi : p.tithi.name.en;

  // Per-locale title/desc strings — never branch on isHi/isDevanagari for titles
  // (collapses 7 locales onto 2 byte-identical strings → Google duplicate-content
  // demotion). See 2026-06-02 dynamic-title-locale-collapse audit.
  const TITLES: Record<string, string> = {
    en: `Chandra Darshan Today ${dateStr} – ${tithi}`,
    hi: `चन्द्र दर्शन आज ${dateStr} – ${tithi}`,
    ta: `இன்றைய சந்திர தரிசனம் ${dateStr} – ${tithi}`,
    te: `నేటి చంద్ర దర్శనం ${dateStr} – ${tithi}`,
    bn: `আজকের চন্দ্র দর্শন ${dateStr} – ${tithi}`,
    gu: `આજનું ચંદ્ર દર્શન ${dateStr} – ${tithi}`,
    kn: `ಇಂದಿನ ಚಂದ್ರ ದರ್ಶನ ${dateStr} – ${tithi}`,
    mr: `आजचे चंद्र दर्शन ${dateStr} – ${tithi}`,
    mai: `आजुक चन्द्र दर्शन ${dateStr} – ${tithi}`,
  };
  const DESCS: Record<string, string> = {
    en: `${dateStr} Moon sighting: tithi ${tithi}. Moonrise time, visibility & next Chandra Darshan date. Free, location-aware.`,
    hi: `${dateStr} चन्द्र दर्शन: तिथि ${tithi}। चन्द्रोदय समय, दृश्यता, और अगले चन्द्र दर्शन की तिथि। निःशुल्क।`,
    ta: `${dateStr} சந்திர தரிசனம்: திதி ${tithi}. சந்திரோதய நேரம், காண்பிக்கை மற்றும் அடுத்த சந்திர தரிசனம் தேதி.`,
    te: `${dateStr} చంద్ర దర్శనం: తిథి ${tithi}. చంద్రోదయ సమయం, దృశ్యత మరియు తదుపరి చంద్ర దర్శనం తేదీ.`,
    bn: `${dateStr} চন্দ্র দর্শন: তিথি ${tithi}। চন্দ্রোদয় সময়, দৃশ্যতা ও পরবর্তী চন্দ্র দর্শন তারিখ।`,
    gu: `${dateStr} ચંદ્ર દર્શન: તિથિ ${tithi}. ચંદ્રોદય સમય, દૃશ્યતા અને આગામી ચંદ્ર દર્શન તારીખ.`,
    kn: `${dateStr} ಚಂದ್ರ ದರ್ಶನ: ತಿಥಿ ${tithi}. ಚಂದ್ರೋದಯ ಸಮಯ, ಗೋಚರತೆ ಮತ್ತು ಮುಂದಿನ ಚಂದ್ರ ದರ್ಶನ ದಿನಾಂಕ.`,
    mr: `${dateStr} चंद्र दर्शन: तिथी ${tithi}. चंद्रोदय वेळ, दृश्यता आणि पुढील चंद्र दर्शन तारीख.`,
    mai: `${dateStr} चन्द्र दर्शन: तिथि ${tithi}। चन्द्रोदय समय, दृश्यता आ अगिला चन्द्र दर्शन तिथि।`,
  };

  const title = TITLES[locale] ?? TITLES.en;
  const desc = DESCS[locale] ?? DESCS.en;

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
