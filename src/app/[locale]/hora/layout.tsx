import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';
import { isDevanagariLocale, pickByLocale } from '@/lib/utils/locale-fonts';

const PLANET_NAMES_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const PLANET_NAMES_HI = ['सूर्य', 'चन्द्र', 'मंगल', 'बुध', 'बृहस्पति', 'शुक्र', 'शनि'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/hora', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr } = seo;
  const weekday = p.vara?.day ?? new Date().getUTCDay();
  // Planet names only exist in en/hi (PLANET_NAMES_*) — Devanagari-script locales
  // (hi/mr/mai/sa) share the Hindi rendering (Sanskrit-cognate names work
  // universally in Devanagari). All other scripts fall back to English.
  const lordName = isDevanagariLocale(locale) ? PLANET_NAMES_HI[weekday] : PLANET_NAMES_EN[weekday];

  // Per-locale title/desc strings — never branch on isHi/isDevanagari for titles
  // (collapses 7 locales onto 2 byte-identical strings → Google duplicate-content
  // demotion). See 2026-06-02 dynamic-title-locale-collapse audit.
  const TITLES = {
    en: `Hora Today ${dateStr} – ${lordName} Hora at Sunrise`,
    hi: `आज की होरा ${dateStr} – ${lordName} होरा से आरम्भ`,
    ta: `இன்றைய ஹோரை ${dateStr} – சூரியோதயத்தில் ${lordName} ஹோரை`,
    te: `నేటి హోర ${dateStr} – సూర్యోదయంలో ${lordName} హోర`,
    bn: `আজকের হোরা ${dateStr} – সূর্যোদয়ে ${lordName} হোরা`,
    gu: `આજનું હોરા ${dateStr} – સૂર્યોદય સમયે ${lordName} હોરા`,
    kn: `ಇಂದಿನ ಹೋರಾ ${dateStr} – ಸೂರ್ಯೋದಯದಲ್ಲಿ ${lordName} ಹೋರಾ`,
    mr: `आजची होरा ${dateStr} – सूर्योदयाला ${lordName} होरा`,
    mai: `आजुक होरा ${dateStr} – सूर्योदयस ${lordName} होरा`,
  };
  const DESCS = {
    en: `${dateStr} planetary hours: ${lordName} hora from sunrise ${p.sunrise}. Know which planet rules each hour. Select your city for exact timings.`,
    hi: `${dateStr} होरा: सूर्योदय ${p.sunrise} से ${lordName} होरा। प्रत्येक ग्रह का शुभ समय जानें। शहर चुनें, सटीक गणना पाएँ।`,
    ta: `${dateStr} கிரக ஹோரை: சூரியோதயம் ${p.sunrise} இல் ${lordName} ஹோரை. ஒவ்வொரு கிரகத்தின் சுபவேளையை அறியுங்கள். நகரம் தேர்ந்தெடுக்கவும்.`,
    te: `${dateStr} గ్రహ హోర: సూర్యోదయం ${p.sunrise}లో ${lordName} హోర. ప్రతి గ్రహం యొక్క శుభ సమయం. మీ నగరం ఎంచుకోండి.`,
    bn: `${dateStr} গ্রহ হোরা: সূর্যোদয় ${p.sunrise} থেকে ${lordName} হোরা। প্রত্যেক গ্রহের শুভ সময় জানুন। শহর নির্বাচন করুন।`,
    gu: `${dateStr} ગ્રહ હોરા: સૂર્યોદય ${p.sunrise}થી ${lordName} હોરા. દરેક ગ્રહનો શુભ સમય જાણો. શહેર પસંદ કરો.`,
    kn: `${dateStr} ಗ್ರಹ ಹೋರಾ: ಸೂರ್ಯೋದಯ ${p.sunrise}ರಿಂದ ${lordName} ಹೋರಾ. ಪ್ರತಿ ಗ್ರಹದ ಶುಭ ಸಮಯ. ನಿಮ್ಮ ನಗರ ಆಯ್ಕೆಮಾಡಿ.`,
    mr: `${dateStr} ग्रह होरा: सूर्योदय ${p.sunrise} पासून ${lordName} होरा. प्रत्येक ग्रहाचा शुभ काळ जाणून घ्या. आपले शहर निवडा.`,
    mai: `${dateStr} ग्रह होरा: सूर्योदय ${p.sunrise} सँ ${lordName} होरा। प्रत्येक ग्रहक शुभ समय जानू। अपन शहर चुनू।`,
  };

  const title = pickByLocale(TITLES, locale);
  const desc = pickByLocale(DESCS, locale);

  return { ...base, title, description: desc };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faqLD = generateFAQLD('/hora', locale);
  return (
    <>
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      <ToolStructuredData
        name="Planetary Hora Calculator"
        description="Today's planetary hora chart — 24-hour cycle of graha-ruled hours for any city."
        path="/hora"
        locale={locale}
      />
      {children}
    </>
  );
}
