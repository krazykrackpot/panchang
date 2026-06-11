// src/app/[locale]/horoscope/[rashi]/page.tsx
// NO 'use client'  –  this is a Server Component for SEO indexability

import { notFound } from 'next/navigation';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { HoroscopeClient } from './HoroscopeClient';
import { RashiArticle } from './RashiArticle';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, pickByLocale } from '@/lib/utils/locale-fonts';
import { scoreLabel, getScoreBgClass } from '@/lib/horoscope/score-utils';
import { Link } from '@/lib/i18n/navigation';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateHoroscopeFAQ } from '@/lib/seo/faq-data';
import { BASE_URL } from '@/lib/seo/base-url';

function ordinal(n: number): string {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

/**
 * "Nth house" per locale. Devanagari group uses "Nवाँ भाव" — short
 * tatsama form is fine for chrome. Dravidian + bn/gu use the locale-
 * native ordinal suffix + house word.
 *
 * Defensive guard: returns '' for missing/NaN inputs rather than
 * rendering "undefinedवाँ भाव" or "NaNமा பாவம்" in the UI.
 * Gemini PR #496 round-1 MED.
 */
function ordinalHouse(n: number | undefined | null, locale: string): string {
  if (n === undefined || n === null || Number.isNaN(n)) return '';
  if (locale === 'hi' || locale === 'mai' || locale === 'mr' || locale === 'sa') {
    return `${n}वाँ भाव`;
  }
  if (locale === 'ta') return `${n}-வது பாவம்`;
  if (locale === 'te') return `${n}వ భావం`;
  if (locale === 'kn') return `${n}ನೆಯ ಭಾವ`;
  if (locale === 'gu') return `${n}મા ભાવ`;
  if (locale === 'bn') return `${n}তম ভাব`;
  return `${ordinal(n)} house`;
}

/**
 * 9-locale chrome labels for the rashi horoscope page. Reads via
 * LABELS[locale] ?? LABELS.en — non-indexable locales fall back to
 * English chrome but body content is still locale-attached via the
 * horoscope overlay merger.
 */
const LABELS: Record<string, Record<string, string>> = {
  en: {
    today: 'Today', score: "Today's Score", transits: "Today's Planetary Transits",
    moon: 'Moon', jupiter: 'Jupiter', saturn: 'Saturn', rahu: 'Rahu',
    career: 'Career', love: 'Love', health: 'Health', finance: 'Finance', spirituality: 'Spirituality',
    doLabel: '✓ Do', avoidLabel: '✗ Avoid',
    luckySection: 'Lucky Indicators & Remedy',
    luckyColour: 'Lucky Colour', luckyNumber: 'Lucky Number',
    luckyTime: 'Lucky Time', luckyDirection: 'Lucky Direction',
    todayRemedy: "Today's Remedy",
    otherRashis: 'Other Rashis',
    todaysPanchang: "Today's Panchang", rahuKaal: 'Rahu Kaal', hora: 'Hora', kundali: 'Kundali',
    relatedAria: 'Related horoscopes',
  },
  hi: {
    today: 'आज', score: 'आज का स्कोर', transits: 'आज का ग्रह गोचर',
    moon: 'चन्द्र', jupiter: 'गुरु', saturn: 'शनि', rahu: 'राहु',
    career: 'करियर', love: 'प्रेम', health: 'स्वास्थ्य', finance: 'वित्त', spirituality: 'आध्यात्म',
    doLabel: '✓ करें', avoidLabel: '✗ न करें',
    luckySection: 'शुभ संकेत और उपाय',
    luckyColour: 'शुभ रंग', luckyNumber: 'शुभ अंक',
    luckyTime: 'शुभ समय', luckyDirection: 'शुभ दिशा',
    todayRemedy: 'आज का उपाय',
    otherRashis: 'अन्य राशिफल',
    todaysPanchang: 'आज का पंचांग', rahuKaal: 'राहु काल', hora: 'होरा', kundali: 'कुण्डली',
    relatedAria: 'सम्बन्धित राशिफल',
  },
  mai: {
    today: 'आइ', score: 'आजुक स्कोर', transits: 'आजुक ग्रह गोचर',
    moon: 'चन्द्र', jupiter: 'गुरु', saturn: 'शनि', rahu: 'राहु',
    career: 'कैरियर', love: 'प्रेम', health: 'स्वास्थ्य', finance: 'धन', spirituality: 'आध्यात्म',
    doLabel: '✓ करू', avoidLabel: '✗ नहि करू',
    luckySection: 'शुभ संकेत आ उपाय',
    luckyColour: 'शुभ रंग', luckyNumber: 'शुभ अंक',
    luckyTime: 'शुभ समय', luckyDirection: 'शुभ दिशा',
    todayRemedy: 'आजुक उपाय',
    otherRashis: 'आन राशिफल',
    todaysPanchang: 'आजुक पंचांग', rahuKaal: 'राहु काल', hora: 'होरा', kundali: 'कुण्डली',
    relatedAria: 'सम्बन्धित राशिफल',
  },
  mr: {
    today: 'आज', score: 'आजचा स्कोर', transits: 'आजचे ग्रह गोचर',
    moon: 'चन्द्र', jupiter: 'गुरु', saturn: 'शनि', rahu: 'राहु',
    career: 'कारकीर्द', love: 'प्रेम', health: 'आरोग्य', finance: 'अर्थ', spirituality: 'आध्यात्म',
    doLabel: '✓ करा', avoidLabel: '✗ टाळा',
    luckySection: 'शुभ संकेत आणि उपाय',
    luckyColour: 'शुभ रंग', luckyNumber: 'शुभ अंक',
    luckyTime: 'शुभ वेळ', luckyDirection: 'शुभ दिशा',
    todayRemedy: 'आजचा उपाय',
    otherRashis: 'इतर राशीभविष्य',
    todaysPanchang: 'आजचा पंचांग', rahuKaal: 'राहु काल', hora: 'होरा', kundali: 'कुंडली',
    relatedAria: 'संबंधित राशीभविष्य',
  },
  ta: {
    today: 'இன்று', score: 'இன்றைய மதிப்பு', transits: 'இன்றைய கிரக சஞ்சாரம்',
    moon: 'சந்திரன்', jupiter: 'குரு', saturn: 'சனி', rahu: 'ராகு',
    career: 'தொழில்', love: 'காதல்', health: 'ஆரோக்கியம்', finance: 'நிதி', spirituality: 'ஆன்மிகம்',
    doLabel: '✓ செய்க', avoidLabel: '✗ தவிர்க்கவும்',
    luckySection: 'அதிர்ஷ்ட குறிப்பு மற்றும் பரிகாரம்',
    luckyColour: 'அதிர்ஷ்ட நிறம்', luckyNumber: 'அதிர்ஷ்ட எண்',
    luckyTime: 'அதிர்ஷ்ட நேரம்', luckyDirection: 'அதிர்ஷ்ட திசை',
    todayRemedy: 'இன்றைய பரிகாரம்',
    otherRashis: 'மற்ற ராசிகள்',
    todaysPanchang: 'இன்றைய பஞ்சாங்கம்', rahuKaal: 'ராகு காலம்', hora: 'ஹோரை', kundali: 'ஜாதகம்',
    relatedAria: 'தொடர்புடைய ராசி பலன்கள்',
  },
  te: {
    today: 'నేడు', score: 'నేటి స్కోర్', transits: 'నేటి గ్రహ గోచారం',
    moon: 'చంద్రుడు', jupiter: 'గురువు', saturn: 'శని', rahu: 'రాహువు',
    career: 'వృత్తి', love: 'ప్రేమ', health: 'ఆరోగ్యం', finance: 'ఆర్థికం', spirituality: 'ఆధ్యాత్మికం',
    doLabel: '✓ చేయండి', avoidLabel: '✗ నివారించండి',
    luckySection: 'శుభ సంకేతాలు మరియు పరిహారం',
    luckyColour: 'శుభ రంగు', luckyNumber: 'శుభ సంఖ్య',
    luckyTime: 'శుభ సమయం', luckyDirection: 'శుభ దిశ',
    todayRemedy: 'నేటి పరిహారం',
    otherRashis: 'ఇతర రాశులు',
    todaysPanchang: 'నేటి పంచాంగం', rahuKaal: 'రాహు కాలం', hora: 'హోర', kundali: 'జాతకం',
    relatedAria: 'సంబంధిత రాశి ఫలాలు',
  },
  kn: {
    today: 'ಇಂದು', score: 'ಇಂದಿನ ಸ್ಕೋರ್', transits: 'ಇಂದಿನ ಗ್ರಹ ಸಂಚಾರ',
    moon: 'ಚಂದ್ರ', jupiter: 'ಗುರು', saturn: 'ಶನಿ', rahu: 'ರಾಹು',
    career: 'ವೃತ್ತಿ', love: 'ಪ್ರೇಮ', health: 'ಆರೋಗ್ಯ', finance: 'ಆರ್ಥಿಕ', spirituality: 'ಆಧ್ಯಾತ್ಮಿಕ',
    doLabel: '✓ ಮಾಡಿ', avoidLabel: '✗ ತಪ್ಪಿಸಿ',
    luckySection: 'ಶುಭ ಸಂಕೇತಗಳು ಮತ್ತು ಪರಿಹಾರ',
    luckyColour: 'ಶುಭ ಬಣ್ಣ', luckyNumber: 'ಶುಭ ಸಂಖ್ಯೆ',
    luckyTime: 'ಶುಭ ಸಮಯ', luckyDirection: 'ಶುಭ ದಿಕ್ಕು',
    todayRemedy: 'ಇಂದಿನ ಪರಿಹಾರ',
    otherRashis: 'ಇತರ ರಾಶಿಗಳು',
    todaysPanchang: 'ಇಂದಿನ ಪಂಚಾಂಗ', rahuKaal: 'ರಾಹು ಕಾಲ', hora: 'ಹೋರ', kundali: 'ಜಾತಕ',
    relatedAria: 'ಸಂಬಂಧಿತ ರಾಶಿ ಫಲ',
  },
  gu: {
    today: 'આજ', score: 'આજનો સ્કોર', transits: 'આજનો ગ્રહ ગોચર',
    moon: 'ચંદ્ર', jupiter: 'ગુરુ', saturn: 'શનિ', rahu: 'રાહુ',
    career: 'કારકિર્દી', love: 'પ્રેમ', health: 'આરોગ્ય', finance: 'નાણાં', spirituality: 'આધ્યાત્મ',
    doLabel: '✓ કરો', avoidLabel: '✗ ટાળો',
    luckySection: 'શુભ સંકેત અને ઉપાય',
    luckyColour: 'શુભ રંગ', luckyNumber: 'શુભ અંક',
    luckyTime: 'શુભ સમય', luckyDirection: 'શુભ દિશા',
    todayRemedy: 'આજનો ઉપાય',
    otherRashis: 'અન્ય રાશિફળ',
    todaysPanchang: 'આજનું પંચાંગ', rahuKaal: 'રાહુ કાળ', hora: 'હોરા', kundali: 'કુંડળી',
    relatedAria: 'સંબંધિત રાશિફળ',
  },
  bn: {
    today: 'আজ', score: 'আজকের স্কোর', transits: 'আজকের গ্রহ গোচর',
    moon: 'চন্দ্র', jupiter: 'বৃহস্পতি', saturn: 'শনি', rahu: 'রাহু',
    career: 'কর্মজীবন', love: 'প্রেম', health: 'স্বাস্থ্য', finance: 'অর্থ', spirituality: 'আধ্যাত্ম',
    doLabel: '✓ করুন', avoidLabel: '✗ এড়িয়ে চলুন',
    luckySection: 'শুভ সংকেত ও প্রতিকার',
    luckyColour: 'শুভ রং', luckyNumber: 'শুভ সংখ্যা',
    luckyTime: 'শুভ সময়', luckyDirection: 'শুভ দিক',
    todayRemedy: 'আজকের প্রতিকার',
    otherRashis: 'অন্যান্য রাশিফল',
    todaysPanchang: 'আজকের পঞ্জিকা', rahuKaal: 'রাহু কাল', hora: 'হোরা', kundali: 'কুণ্ডলী',
    relatedAria: 'সম্পর্কিত রাশিফল',
  },
};

export default async function RashiPage({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  const { locale, rashi: rashiSlug } = await params;
  const rashi = getRashiBySlug(rashiSlug);
  if (!rashi) return notFound();

  // Generate today's horoscope server-side  –  this is the SSR content Google indexes
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const horoscope = generateDailyHoroscope({ moonSign: rashi.id, date: today });

  const vedicName = rashi.name.hi || rashi.name.en;
  const westernName = rashi.name.en;
  const localeName = tl(rashi.name, locale);

  const isHi = isDevanagariLocale(locale);
  const L = LABELS[locale] ?? LABELS.en;
  const ruler = tl(rashi.rulerName, locale);
  const element = tl(rashi.element, locale);

  // Transit summary for context
  const ts = horoscope.transitSummary;
  const moonTransit = tl(ts.moonTransitSignName, locale);
  const jupTransit = tl(ts.jupiterSignName, locale);
  const satTransit = tl(ts.saturnSignName, locale);

  // Breadcrumb + Article + FAQPage JSON-LD all emitted from page.tsx
  // (the most-specific emitter for the bare /horoscope/[rashi] route)
  // so the shared [rashi]/layout.tsx no longer fires them on nested
  // weekly/monthly/[date] children — those children emit their own.
  //
  // FAQ joined this group on 2026-06-11 after an audit found
  // /horoscope/aries and /horoscope/aries/2026-06-11 were serving
  // byte-identical FAQPage markup (7/7 Q&A pairs) — Google's textbook
  // duplicate-schema flag. By the same audit: vedicName here is
  // rashi.name.hi (Devanagari), so the FAQ template's "{rashi} ({en})"
  // slots now read "मेष (Aries)" instead of the previous "Aries (Aries)"
  // (layout was passing tl(r.name, locale) which returns English when
  // locale === 'en').
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/horoscope/${rashiSlug}`, locale);
  const faqLD = generateHoroscopeFAQ(vedicName, westernName, 'daily');
  const articleDateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${vedicName} (${westernName}) Horoscope Today  –  ${articleDateStr}`,
    description: `Daily Vedic horoscope for ${westernName} (${vedicName}) with career, love, health, finance & spirituality predictions based on actual planetary transits.`,
    url: `${BASE_URL}/${locale}/horoscope/${rashiSlug}`,
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
      '@id': `${BASE_URL}/${locale}/horoscope/${rashiSlug}`,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.text-text-primary.text-base'],
    },
  };

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      {/* ═══ SSR: H1 + primary answer ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-8 sm:px-6 lg:px-8">
        <h1 suppressHydrationWarning className="text-2xl sm:text-3xl font-bold text-gold-light text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          {/* The locale-specific branches must come BEFORE the broad
              isHi (Devanagari group) check — otherwise mai/mr fall
              through to the Hindi template and lose their distinct
              "आइ"/"राशीभविष्य" forms (Gemini PR #496 round-2 HIGH). */}
          {locale === 'mai'
            ? `${vedicName} राशिफल ${L.today} — ${today}`
            : locale === 'mr'
            ? `${vedicName} राशीभविष्य ${L.today} — ${today}`
            : isHi
            ? `${vedicName} राशिफल आज — ${today}`
            : pickByLocale({ en: `${vedicName} (${westernName}) Horoscope Today — ${today}`, ta: `${vedicName} ராசிபலன் ${L.today} — ${today}`, te: `${vedicName} రాశిఫలం ${L.today} — ${today}`, kn: `${vedicName} ರಾಶಿಫಲ ${L.today} — ${today}`, gu: `${vedicName} રાશિફળ ${L.today} — ${today}`, bn: `${vedicName} রাশিফল ${L.today} — ${today}` }, locale)}
        </h1>

        {/* Primary answer paragraph — what Google shows in featured snippets */}
        <p suppressHydrationWarning className="text-text-primary text-base sm:text-lg mt-4 text-center leading-relaxed max-w-2xl mx-auto">
          {tl(horoscope.insight, locale)}
        </p>

        {/* ═══ SSR: Overall score + area scores as visual bars ═══ */}
        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
              {`${vedicName} — ${L.score}`}
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gold-light">{horoscope.overallScore}</span>
              <span className="text-text-secondary text-sm">/10</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${horoscope.overallScore >= 6.5 ? 'bg-emerald-500/20 text-emerald-400' : horoscope.overallScore >= 4 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                {scoreLabel(horoscope.overallScore, locale)}
              </span>
            </div>
          </div>

          {/* Area score bars with text descriptions */}
          <div className="space-y-4">
            {(['career', 'love', 'health', 'finance', 'spirituality'] as const).map((key) => {
              const area = horoscope.areas[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-secondary text-sm font-medium">{L[key]}</span>
                    <span className="text-gold-light text-sm font-semibold">{area.score}/10</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getScoreBgClass(area.score)}`} style={{ width: `${area.score * 10}%` }} />
                  </div>
                  {/* Full area prediction text — this is the SEO-critical content */}
                  <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">
                    {tl(area.text, locale)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ SSR: Transit Summary — rich astro context ═══ */}
        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 sm:p-6">
          <h2 className="text-gold-light text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {`${vedicName} — ${L.transits}`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{L.moon}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{moonTransit}</div>
              <div className="text-text-secondary/60 text-xs mt-0.5">
                {ordinalHouse(ts.moonHouseFromNatal, locale)}
              </div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{L.jupiter}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{jupTransit}</div>
              <div className="text-text-secondary/60 text-xs mt-0.5">
                {ordinalHouse(ts.jupiterHouse, locale)}
              </div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{L.saturn}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{satTransit}</div>
              <div className="text-text-secondary/60 text-xs mt-0.5">
                {ordinalHouse(ts.saturnHouse, locale)}
              </div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{L.rahu}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{tl(ts.rahuSignName, locale)}</div>
              <div className="text-text-secondary/60 text-xs mt-0.5">
                {ordinalHouse(ts.rahuHouse, locale)}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SSR: Do's and Don'ts ═══ */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/20 rounded-2xl p-5">
            <h3 className="text-emerald-400 font-semibold mb-3">
              {L.doLabel}
            </h3>
            <ul className="space-y-2">
              {horoscope.dosAndDonts.dos.map((d, i) => (
                <li key={i} className="text-text-secondary text-sm leading-relaxed flex gap-2">
                  <span className="text-emerald-400/60 shrink-0">•</span>
                  <span>{tl(d, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/20 rounded-2xl p-5">
            <h3 className="text-red-400 font-semibold mb-3">
              {L.avoidLabel}
            </h3>
            <ul className="space-y-2">
              {horoscope.dosAndDonts.donts.map((d, i) => (
                <li key={i} className="text-text-secondary text-sm leading-relaxed flex gap-2">
                  <span className="text-red-400/60 shrink-0">•</span>
                  <span>{tl(d, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═══ SSR: Lucky Items + Remedy ═══ */}
        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 sm:p-6">
          <h2 className="text-gold-light text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {`${vedicName} — ${L.luckySection}`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{L.luckyColour}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{tl(horoscope.luckyColor, locale)}</div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{L.luckyNumber}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{horoscope.luckyNumber}</div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{L.luckyTime}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{horoscope.luckyTime}</div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{L.luckyDirection}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{tl(horoscope.luckyDirection, locale)}</div>
            </div>
          </div>

          {/* Remedy */}
          <div className="border-t border-gold-primary/10 pt-4 mt-2">
            <h3 className="text-gold-light text-sm font-semibold mb-2">{L.todayRemedy}</h3>
            <p className="text-amber-300/90 text-sm font-medium">{tl(horoscope.remedy.mantra, locale)}</p>
            <p className="text-text-secondary text-sm mt-1">{tl(horoscope.remedy.practical, locale)}</p>
          </div>
        </div>

        {/* ═══ SSR: Rashi info for SEO context ═══ */}
        <div className="mt-6 text-text-secondary text-sm leading-relaxed space-y-2">
          <p>
            {/* mai + mr branches BEFORE isHi so they aren't swallowed
                by the Devanagari-group fast path (Gemini PR #496
                round-2 HIGH precedent). */}
            {locale === 'mai'
              ? `${vedicName} राशि (${westernName}) ${element} तत्वक राशि अछि जिनकर स्वामी ${ruler} छथि। ई राशिफल ${vedicName} चन्द्र राशि (Moon Sign) वाला लोकनिक लेल अछि — वैदिक ज्योतिषमे चन्द्र राशि सबसँ सटीक दैनिक भविष्यवाणी दैत अछि।`
              : locale === 'mr'
              ? `${vedicName} राशी (${westernName}) ${element} तत्त्वाची राशी आहे, हिचे स्वामी ${ruler} आहेत. हे राशीभविष्य ${vedicName} चन्द्र राशी (Moon Sign) असणाऱ्यांसाठी आहे — वैदिक ज्योतिषात चन्द्र राशी सर्वात अचूक दैनिक भविष्यवाणी देते.`
              : isHi
              ? `${vedicName} राशि (${westernName}) ${element} तत्व की राशि है जिसके स्वामी ${ruler} हैं। यह राशिफल ${vedicName} चन्द्र राशि (Moon Sign) वालों के लिए है — वैदिक ज्योतिष में चन्द्र राशि सबसे सटीक दैनिक भविष्यवाणी देती है।`
              : pickByLocale({ en: `${westernName} (${vedicName}) is a ${tl(rashi.element, 'en')} sign ruled by ${tl(rashi.rulerName, 'en')}. This horoscope is for ${westernName} Moon Sign — in Vedic astrology, the Moon sign provides the most accurate daily predictions based on actual planetary transits.`, ta: `${vedicName} (${westernName}) என்பது ${element} தத்துவத்துடன் கூடிய ராசி, இதன் அதிபதி ${ruler}. இந்த ராசிபலன் ${vedicName} சந்திர ராசி வைத்தவர்களுக்கு — வேத ஜோதிடத்தில் சந்திர ராசி உண்மையான கிரக சஞ்சாரத்தின் அடிப்படையில் மிக துல்லியமான தினசரி கணிப்பு தருகிறது.`, te: `${vedicName} (${westernName}) అనేది ${element} తత్త్వంతో కూడిన రాశి, దీని అధిపతి ${ruler}. ఈ రాశిఫలం ${vedicName} చంద్ర రాశి ఉన్నవారికి — వేద జ్యోతిషంలో చంద్ర రాశి నిజమైన గ్రహ గోచారాన్ని ఆధారం చేసుకుని అత్యంత ఖచ్చితమైన రోజువారీ అంచనా ఇస్తుంది.`, kn: `${vedicName} (${westernName}) ${element} ತತ್ತ್ವದ ರಾಶಿ, ಇದರ ಅಧಿಪತಿ ${ruler}. ಈ ರಾಶಿಫಲ ${vedicName} ಚಂದ್ರ ರಾಶಿಯವರಿಗೆ — ವೇದ ಜ್ಯೋತಿಷದಲ್ಲಿ ಚಂದ್ರ ರಾಶಿಯು ನಿಜವಾದ ಗ್ರಹ ಸಂಚಾರವನ್ನು ಆಧರಿಸಿ ಅತ್ಯಂತ ನಿಖರವಾದ ದೈನಂದಿನ ಭವಿಷ್ಯ ನೀಡುತ್ತದೆ.`, gu: `${vedicName} (${westernName}) એ ${element} તત્વની રાશિ છે જેનો સ્વામી ${ruler} છે. આ રાશિફળ ${vedicName} ચંદ્ર રાશિ ધરાવનારાઓ માટે છે — વૈદિક જ્યોતિષમાં ચંદ્ર રાશિ વાસ્તવિક ગ્રહ ગોચરના આધારે સૌથી ચોક્કસ દૈનિક ભવિષ્યવાણી આપે છે.`, bn: `${vedicName} (${westernName}) হল ${element} তত্ত্বের রাশি যার অধিপতি ${ruler}। এই রাশিফল ${vedicName} চন্দ্র রাশি যাদের জন্য — বৈদিক জ্যোতিষে চন্দ্র রাশি প্রকৃত গ্রহ গোচরের ভিত্তিতে সবচেয়ে নির্ভুল দৈনিক ভবিষ্যৎবাণী দেয়।` }, locale)}
          </p>
        </div>

        {/* ═══ SSR: Internal links — related rashis + tools ═══ */}
        <nav className="mt-6 space-y-3" aria-label={L.relatedAria}>
          <h3 className="text-gold-light text-sm font-semibold">{L.otherRashis}</h3>
          <div className="flex flex-wrap gap-2">
            {RASHIS.filter(r => r.id !== rashi.id).map(r => (
              <Link
                key={r.slug}
                href={`/horoscope/${r.slug}`}
                className="text-xs text-gold-primary/70 hover:text-gold-light transition-colors px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06]"
              >
                {tl(r.name, locale)}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {L.todaysPanchang}
            </Link>
            <span className="text-text-secondary/30">·</span>
            <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {L.rahuKaal}
            </Link>
            <span className="text-text-secondary/30">·</span>
            <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {L.hora}
            </Link>
            <span className="text-text-secondary/30">·</span>
            <Link href="/charts" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {L.kundali}
            </Link>
          </div>
        </nav>
      </div>

      {/* Client island: interactive widget with full functionality */}
      <HoroscopeClient rashi={rashi} locale={locale} initialHoroscope={horoscope} />

      {/* SSR: Static editorial content  –  always indexed */}
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
