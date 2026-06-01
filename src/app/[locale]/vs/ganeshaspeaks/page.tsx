'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Check, X, Sparkles, Globe, Brain, Palette, Shield, Clock, BookOpen, BarChart3, Trophy } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { TOTAL_MODULES, PHASE_INFO } from '@/lib/learn/module-sequence';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { CompareOthers } from '@/components/seo/CompareOthers';
import type { Locale } from '@/lib/i18n/config';

// ─── Labels ────────────────────────────────────────────────────
const L = (en: string, hi: string, ta?: string, bn?: string) => ({ en, hi, sa: hi, ta: ta ?? en, bn: bn ?? en });

const LABELS = {
  title: L(
    'Dekho Panchang vs GaneshaSpeaks',
    'देखो पंचांग vs गणेशास्पीक्स',
    'டெக்கோ பஞ்சாங்கம் vs கணேஷாஸ்பீக்ஸ்',
    'দেখো পঞ্চাঙ্গ vs গণেশস্পিকস',
  ),
  subtitle: L(
    'GaneshaSpeaks is a celebrity-astrologer-led horoscope portal with a paid consultation marketplace. Dekho Panchang is an autonomous computation engine that reasons about YOUR chart with classical citations  –  no consultation fees, no celebrity stylings, just a 36-rule muhurta engine and an AI astrologer that quotes BPHS.',
    'गणेशास्पीक्स एक सेलिब्रिटी-ज्योतिषी राशिफल पोर्टल है जो भुगतान-आधारित परामर्श मार्केटप्लेस संचालित करता है। देखो पंचांग एक स्वायत्त गणना इंजन है जो शास्त्रीय उद्धरणों के साथ आपकी कुण्डली पर तर्क करता है  –  कोई परामर्श शुल्क नहीं, बस 36-नियम मुहूर्त इंजन और BPHS उद्धृत करने वाला AI ज्योतिषी।',
    'கணேஷாஸ்பீக்ஸ் ஒரு பிரபல ஜோதிட போர்டல். டெக்கோ பஞ்சாங்கம் சாஸ்திரிய மேற்கோள்களுடன் கூடிய சுயாதீன கணிப்பு இயந்திரம்.',
    'গণেশস্পিকস একটি সেলিব্রিটি জ্যোতিষী পোর্টাল। দেখো পঞ্চাঙ্গ ক্লাসিক্যাল উদ্ধৃতি সহ একটি স্বায়ত্তশাসিত গণনা ইঞ্জিন।',
  ),
  disclaimer: L(
    'This comparison is based on publicly available features as of May 2026. We respect GaneshaSpeaks as a long-running platform that has popularised Vedic astrology for millions. This page highlights structural differences  –  the two products serve different needs, and the right tool depends on what you want.',
    'यह तुलना मई 2026 तक सार्वजनिक रूप से उपलब्ध सुविधाओं पर आधारित है। हम गणेशास्पीक्स को एक स्थापित मंच के रूप में सम्मान करते हैं। दोनों उत्पाद अलग आवश्यकताओं की सेवा करते हैं।',
  ),
  dekho: L('Dekho Panchang', 'देखो पंचांग'),
  competitor: L('GaneshaSpeaks', 'गणेशास्पीक्स'),
  feature: L('Feature', 'सुविधा', 'அம்சம்', 'বৈশিষ্ট্য'),
  tryFree: L('Try Dekho Panchang Free', 'देखो पंचांग मुफ़्त आज़माएँ', 'டெக்கோ பஞ்சாங்கத்தை இலவசமாக முயற்சிக்கவும்', 'দেখো পঞ্চাঙ্গ বিনামূল্যে চেষ্টা করুন'),
  whyTitle: L('Why Dekho Panchang?', 'देखो पंचांग क्यों?', 'ஏன் டெக்கோ பஞ்சாங்கம்?', 'কেন দেখো পঞ্চাঙ্গ?'),
  bottomLine: L(
    'GaneshaSpeaks reaches a wide audience with daily horoscope content and a paid astrologer marketplace  –  its strength is celebrity-style accessible content and the option of human consultation. Dekho Panchang takes the opposite approach: an autonomous classical engine that you can interrogate yourself, with every claim cited from BPHS / Saravali / Phaladeepika, 36 muhurta rules with cancellation logic, 150+ yogas, 15+ dasha systems, and a 100+ module learning path. No consultation fees, no pay-to-read horoscopes  –  the whole engine is free.',
    'गणेशास्पीक्स की शक्ति प्रसिद्ध-ज्योतिषी सामग्री और सशुल्क मानव परामर्श है। देखो पंचांग एक स्वायत्त शास्त्रीय इंजन है जिसे आप स्वयं प्रश्न पूछ सकते हैं, हर दावा BPHS / सारावली / फलदीपिका से उद्धृत है, 36 मुहूर्त नियम निवारण तर्क के साथ, 150+ योग, 15+ दशा प्रणालियाँ। कोई परामर्श शुल्क नहीं  –  पूरा इंजन मुफ़्त।',
  ),
};

// ─── Comparison rows ───────────────────────────────────────────

interface CompRow {
  feature: string;
  featureHi: string;
  dekho: string;
  competitor: string;
  dekhoYes: boolean;
  competitorYes: boolean;
  highlight?: boolean;
}

const ROWS: CompRow[] = [
  {
    feature: 'Brihaspati  –  AI Vedic Astrologer with Classical Citations',
    featureHi: 'बृहस्पति  –  शास्त्रीय उद्धरण सहित AI ज्योतिषी',
    dekho: 'Conversational AI astrologer (Claude Sonnet 4.6) with Layer-2 chart-context routing and a Layer-4 anti-hallucination validator. Every claim cites BPHS / Saravali / Phaladeepika. Multi-locale (EN, HI, TA, BN). No consultation fee, no per-question charge.',
    competitor: 'Paid human-astrologer marketplace (per-minute / per-consultation pricing) + daily horoscope content. No autonomous AI astrologer with cited classical sources.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Deity Portrait Banners on the Tithi Calendar',
    featureHi: 'तिथि कैलेण्डर पर देवता चित्र बैनर',
    dekho: '18 painterly deity portraits (Vishnu, Shiva, Devi, Lakshmi, Ganesha, Ram, Saraswati, Hanuman, Krishna, Surya, Buddha, Kali, Parashurama, Narasimha, Dattatreya, Skanda, Annapurna, Jagannath) auto-trigger as full-width banners on matching festival cells.',
    competitor: 'Festival listings as text or generic icons; no contextual deity imagery on the calendar.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Hindu Months Calendar with Adhika Sandwich Logic',
    featureHi: 'हिन्दू मास कैलेण्डर  –  अधिक मास सैंडविच तर्क सहित',
    dekho: 'Dedicated /calendars/masa page with all 12 (or 13) lunar months, start/end dates, ritu, ayana, and key festivals per masa. Purnimanta Adhika years correctly expand into a three-layer Nija-Krishna → Adhika → Nija-Shukla sandwich.',
    competitor: 'No dedicated Hindu months calendar; festival pages reference months in text only.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Vibrant Tithi Calendar (Grid + Mobile List)',
    featureHi: 'जीवन्त तिथि कैलेण्डर (ग्रिड + मोबाइल सूची)',
    dekho: 'Month-grid with sticky day-name header pinned below the navbar, prominent paksha colour wash, embedded per-cell panchang (sunrise/sunset/Rahu Kaal/Nakshatra/Yoga/Karana), personalised Tara+Chandra Bala star, and a dedicated mobile list view.',
    competitor: 'Daily horoscope and panchang surfaces are oriented around content cards, not an immersive tithi grid.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Pricing Model',
    featureHi: 'मूल्य निर्धारण मॉडल',
    dekho: 'Free  –  all features open, no paywall. AI calls have generous daily limits (no per-question charge).',
    competitor: 'Free daily horoscope; paid astrologer consultations (per-minute / per-report charges); some reports behind paywall.',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'Personalized Tippanni (Chart Interpretation)',
    featureHi: 'व्यक्तिगत टिप्पणी (कुण्डली व्याख्या)',
    dekho: 'AI-powered narrative tied to YOUR birth chart  –  personality, career, relationships, dasha context, yogas, doshas, remedies.',
    competitor: 'Generic Sun-sign / Moon-sign daily horoscopes; deep personalised analysis is via paid consultation.',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: '36-Rule Muhurta Engine with Classical Cancellation',
    featureHi: '36-नियम मुहूर्त इंजन  –  शास्त्रीय निवारण सहित',
    dekho: '36 rules from 7 texts (Muhurta Chintamani, Dharma Sindhu, BPHS, Brihat Samhita, Prashna Marga, B.V. Raman, Kalaprakashika). 5-tier authority with cancellation logic (strong lagna cancels weak karana per MC Ch.7). Pandit-style verdict with citations.',
    competitor: 'Generic auspicious-day calendars; no nuanced muhurta scoring engine with cancellation logic.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '150+ Yoga Detection',
    featureHi: '150+ योग पहचान',
    dekho: '150+ classical yogas with frequency validation to prevent false positives. Strength ratings and interpretations.',
    competitor: 'Yoga mentions in personalised reports; not a structured yoga-engine output.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '15+ Dasha Systems',
    featureHi: '15+ दशा प्रणालियाँ',
    dekho: 'Vimshottari, Yogini, Chara, Narayana, Kalachakra, Sudarshana, and 9 more  –  each with interpretation.',
    competitor: 'Vimshottari is the standard offering in reports.',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'Multilingual UI',
    featureHi: 'बहुभाषी इंटरफ़ेस',
    dekho: '10 languages with native terminology  –  EN, HI, SA, TA, TE, BN, KN, MR, GU, Maithili',
    competitor: 'Primarily English + Hindi; daily horoscopes available in several Indian languages.',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Sanskrit Support',
    featureHi: 'संस्कृत समर्थन',
    dekho: 'Full Sanskrit (SA) locale with proper Devanagari rendering and shlokas',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Learning Curriculum',
    featureHi: 'शिक्षण पाठ्यक्रम',
    dekho: `${TOTAL_MODULES} structured modules across ${PHASE_INFO.length} phases  –  beginner to advanced Jyotish, with interactive labs.`,
    competitor: 'Reference articles and blog posts (unstructured)',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'KP System (Krishnamurti Paddhati)',
    featureHi: 'केपी पद्धति (कृष्णमूर्ति)',
    dekho: 'Full Placidus houses, sub-lord table, significators, ruling planets',
    competitor: 'Not a standard offering',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Jaimini System',
    featureHi: 'जैमिनी पद्धति',
    dekho: 'Chara Karakas, Argala, Jaimini aspects, Chara Dasha with interpretations',
    competitor: 'Not a standard offering',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Prashna (Horary)',
    featureHi: 'प्रश्न (होरारी)',
    dekho: 'KP Horary + Kerala Ashtamangala Prashna  –  two horary systems',
    competitor: 'Horary questions handled via paid consultation, not as a standalone tool',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: '11 Ayanamsha Systems',
    featureHi: '11 अयनांश प्रणालियाँ',
    dekho: 'Lahiri, KP, Raman, BV Raman, Yukteshwar, Fagan-Bradley, True Chitra, True Revati, True Pushya, Galactic Center, and more  –  all via Swiss Ephemeris.',
    competitor: 'Lahiri (default)',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'Shadbala / Ashtakavarga Visuals',
    featureHi: 'षड्बल / अष्टकवर्ग दृश्य',
    dekho: 'Colour-coded progress bars, SAV heatmap, strength rankings.',
    competitor: 'Reports may include numeric strength tables; no live interactive visuals.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Dosha Cancellation Analysis',
    featureHi: 'दोष निवारण विश्लेषण',
    dekho: 'Mangal, Kaal Sarpa, Pitra  –  shows which cancellation conditions are met for YOUR chart, not just a yes/no.',
    competitor: 'Basic dosha detection; cancellation explanations through paid consultation.',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Ashta Kuta Matching',
    featureHi: 'अष्ट कूट मिलान',
    dekho: '36-point Ashta Kuta with visual scales, partner-specific insights, dosha cancellation analysis.',
    competitor: 'Standard Ashta Kuta matching with score.',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Birth Chart (Kundali)',
    featureHi: 'जन्म कुण्डली',
    dekho: 'North + South Indian styles, 16 Varga charts, Shadbala, Bhavabala, Avasthas, Jaimini, KP.',
    competitor: 'North + South Indian basic charts; deeper analysis via paid report.',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Modern UI / Mobile First',
    featureHi: 'आधुनिक UI / मोबाइल प्रथम',
    dekho: 'Dark celestial theme, responsive, animated, PWA-installable, zero ads in core features.',
    competitor: 'Content-portal layout, mobile-responsive, ad-supported.',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'PWA with Offline Panchang',
    featureHi: 'PWA ऑफ़लाइन पंचांग सहित',
    dekho: 'Installable progressive web app, offline cached panchang, home-screen shortcuts.',
    competitor: 'Native iOS / Android apps; no PWA / browser-installable option.',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Premium PDF Kundali Report',
    featureHi: 'प्रीमियम PDF कुण्डली रिपोर्ट',
    dekho: '12-section professional report  –  personality, yogas, doshas, dashas, Nadi Amsha, remedies.',
    competitor: 'Paid PDF reports of varying depth; Nadi-level analysis typically not offered.',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Ephemeris Precision',
    featureHi: 'एफेमेरिस सटीकता',
    dekho: 'Swiss Ephemeris (NASA JPL DE441)  –  arc-second precision for all planets, tithi transitions accurate to ±1-2 minutes.',
    competitor: 'Proprietary computation engine  –  precision not publicly documented.',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'Embeddable Temple Widget',
    featureHi: 'मन्दिर विजेट (एम्बेड)',
    dekho: 'Free iframe widget for temple websites with city panchang.',
    competitor: 'Not available.',
    dekhoYes: true, competitorYes: false,
  },
];

// Score summary precomputed at module scope — the filters were running on
// every client render via an IIFE inline. (Gemini PR #330 cycle-1 MED.)
const DEKHO_COUNT = ROWS.filter(r => r.dekhoYes).length;
const COMP_COUNT = ROWS.filter(r => r.competitorYes).length;

// ─── Why cards ─────────────────────────────────────────────────

interface WhyCard {
  icon: typeof Sparkles;
  title: string;
  titleHi: string;
  body: string;
  bodyHi: string;
}

const WHY_CARDS: WhyCard[] = [
  {
    icon: Brain,
    title: 'AI vs Paid Astrologer',
    titleHi: 'AI vs सशुल्क ज्योतिषी',
    body: 'GaneshaSpeaks routes you to a paid human astrologer for deep questions. Brihaspati answers the same question in seconds, with classical citations, for free. Different model  –  both have a place, but no per-minute charge.',
    bodyHi: 'गणेशास्पीक्स आपको गहन प्रश्नों के लिए सशुल्क मानव ज्योतिषी के पास भेजता है। बृहस्पति वही प्रश्न शास्त्रीय उद्धरणों के साथ सेकंडों में, मुफ़्त में उत्तर देता है।',
  },
  {
    icon: Sparkles,
    title: '36-Rule Muhurta Engine',
    titleHi: '36-नियम मुहूर्त इंजन',
    body: '"When should I start my business?" Our engine evaluates 36 classical rules from 7 texts, applies 5-tier cancellation logic, and gives you a pandit-style verdict with citations. Not a generic "auspicious day" pick.',
    bodyHi: '"मैं अपना व्यवसाय कब शुरू करूँ?" हमारा इंजन 7 ग्रन्थों से 36 शास्त्रीय नियमों का मूल्यांकन करता है, 5-स्तरीय निवारण तर्क लागू करता है।',
  },
  {
    icon: Globe,
    title: '10 Languages, Native Feel',
    titleHi: '10 भाषाएँ, मूल अनुभव',
    body: 'Not "translated English"  –  proper terminology in Sanskrit, Tamil, Bengali, Kannada, Maithili, and more. The UI itself runs in your script.',
    bodyHi: '"अनुवादित अंग्रेज़ी" नहीं  –  संस्कृत, तमिल, बांग्ला, कन्नड़, मैथिली आदि में उचित शब्दावली।',
  },
  {
    icon: BookOpen,
    title: `${TOTAL_MODULES}-Module Learning Path`,
    titleHi: `${TOTAL_MODULES}-मॉड्यूल शिक्षण पथ`,
    body: 'From "What is a Tithi?" to advanced Jaimini Chara Dasha  –  structured learning with interactive labs. You can become your own jyotishi instead of paying for every reading.',
    bodyHi: '"तिथि क्या है?" से लेकर उन्नत जैमिनी चर दशा तक  –  इंटरैक्टिव लैब्स के साथ संरचित शिक्षण।',
  },
  {
    icon: Palette,
    title: 'Beautiful, Modern Experience',
    titleHi: 'सुन्दर, आधुनिक अनुभव',
    body: 'Dark celestial theme, smooth animations, installable PWA, zero ads in core features. Built for the modern seeker, not a content-portal style ad surface.',
    bodyHi: 'अंधकार-युक्त खगोलीय थीम, सुचारू एनिमेशन, इंस्टॉल करने योग्य PWA, मुख्य सुविधाओं में शून्य विज्ञापन।',
  },
  {
    icon: Shield,
    title: 'Verified Accuracy',
    titleHi: 'सत्यापित सटीकता',
    body: 'Built on Swiss Ephemeris (NASA JPL DE441)  –  arc-second planetary positions. Tithi, nakshatra, yoga, and sunrise verified across multiple timezones. Classical foundations: BPHS, Surya Siddhanta, Muhurta Chintamani.',
    bodyHi: 'स्विस एफेमेरिस (NASA JPL DE441) पर निर्मित  –  आर्क-सेकंड ग्रह स्थितियाँ। शास्त्रीय आधार: बृहत् पराशर होरा शास्त्र, सूर्य सिद्धांत, मुहूर्त चिंतामणि।',
  },
];

// ─── Animation ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function VsGaneshaSpeaksPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const isTa = locale === 'ta';
  const isBn = locale === 'bn';

  const t = (obj: Record<string, string>) =>
    isTa ? (obj.ta ?? obj.en) : isBn ? (obj.bn ?? obj.en) : isDevanagari ? obj.hi : obj.en;

  const headingFont = { fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' };

  // JSON-LD
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/vs/ganeshaspeaks`, locale);
  const comparisonLD = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Dekho Panchang vs GaneshaSpeaks  –  Feature Comparison',
    description: 'Objective feature comparison between Dekho Panchang and GaneshaSpeaks  –  autonomous Vedic engine vs paid-astrologer marketplace.',
    url: `https://dekhopanchang.com/${locale}/vs/ganeshaspeaks`,
    mainEntity: {
      '@type': 'Table',
      about: 'Feature comparison of Vedic astrology platforms',
    },
  };

  return (
    <main className="min-h-screen bg-bg-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(comparisonLD) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] bg-clip-text text-transparent mb-4"
            style={headingFont}
          >
            {t(LABELS.title)}
          </h1>
          <p className="text-text-secondary text-base max-w-2xl mx-auto">
            {t(LABELS.subtitle)}
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-10 px-4 py-3 rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] text-text-secondary text-xs leading-relaxed text-center"
        >
          {t(LABELS.disclaimer)}
        </motion.div>

        {/* ── Score Summary ── */}
        <motion.div
          custom={1.5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5">
            <Trophy size={20} className="text-emerald-400" />
            <span className="text-emerald-400 font-bold text-lg">{DEKHO_COUNT}</span>
            <span className="text-text-secondary text-sm">{t(LABELS.dekho)}</span>
          </div>
          <span className="text-text-secondary text-sm font-medium">vs</span>
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl border border-text-secondary/20 bg-white/[0.02]">
            <BarChart3 size={20} className="text-text-secondary" />
            <span className="text-text-secondary font-bold text-lg">{COMP_COUNT}</span>
            <span className="text-text-secondary text-sm">{t(LABELS.competitor)}</span>
          </div>
        </motion.div>

        {/* ── Comparison Table ── */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] overflow-hidden mb-12"
        >
          <div className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[2fr_3fr_3fr] gap-0 border-b border-gold-primary/20">
            <div className="px-4 py-3 text-xs font-semibold text-gold-dark uppercase tracking-wider">
              {t(LABELS.feature)}
            </div>
            <div className="px-4 py-3 text-xs font-semibold text-gold-light uppercase tracking-wider text-center border-l border-gold-primary/10">
              {t(LABELS.dekho)}
            </div>
            <div className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center border-l border-gold-primary/10">
              {t(LABELS.competitor)}
            </div>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[2fr_3fr_3fr] gap-0 border-b border-white/5 last:border-b-0 ${
                row.highlight ? 'bg-gold-primary/5' : i % 2 === 0 ? 'bg-white/[0.02]' : ''
              }`}
            >
              <div className="px-4 py-3 flex items-start">
                <span className={`text-sm font-medium ${row.highlight ? 'text-gold-light' : 'text-text-primary'}`}>
                  {isDevanagari ? row.featureHi : row.feature}
                  {row.highlight && <Sparkles size={12} className="inline ml-1 text-gold-primary" />}
                </span>
              </div>
              <div className="px-4 py-3 border-l border-white/5">
                <div className="flex items-start gap-2">
                  {row.dekhoYes ? (
                    <Check size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X size={16} className="text-red-400/60 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs text-text-secondary leading-relaxed">{row.dekho}</span>
                </div>
              </div>
              <div className="px-4 py-3 border-l border-white/5">
                <div className="flex items-start gap-2">
                  {row.competitorYes ? (
                    <Check size={16} className="text-emerald-400/60 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X size={16} className="text-red-400/40 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs text-text-secondary leading-relaxed">{row.competitor}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <GoldDivider />

        {/* ── Why Dekho Panchang Section ── */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-12"
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-gold-light text-center mb-8"
            style={headingFont}
          >
            {t(LABELS.whyTitle)}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  custom={4 + i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 hover:border-gold-primary/30 transition-colors"
                >
                  <Icon size={24} className="text-gold-primary mb-3" />
                  <h3 className="text-gold-light font-semibold text-sm mb-2" style={headingFont}>
                    {isDevanagari ? card.titleHi : card.title}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {isDevanagari ? card.bodyHi : card.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <GoldDivider />

        <CompareOthers currentSlug="ganeshaspeaks" />

        {/* ── Bottom Line ── */}
        <motion.div
          custom={10}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-10 mt-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-gold-primary" />
            <Clock size={20} className="text-gold-primary" />
          </div>
          <p className="text-text-primary text-base leading-relaxed max-w-2xl mx-auto mb-8">
            {t(LABELS.bottomLine)}
          </p>

          <Link
            href="/kundali"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#d4a853] to-[#8a6d2b] text-[#0a0e27] font-bold text-sm hover:from-[#f0d48a] hover:to-[#d4a853] transition-all shadow-lg shadow-gold-primary/20"
          >
            <Sparkles size={16} />
            {t(LABELS.tryFree)}
          </Link>
        </motion.div>

        <ShareRow pageTitle="Dekho Panchang vs GaneshaSpeaks" locale={locale} />
      </div>
    </main>
  );
}
