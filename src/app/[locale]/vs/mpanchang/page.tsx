'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Check, X, Sparkles, Globe, Brain, Palette, Shield, Clock, BookOpen, BarChart3, Trophy, Smartphone } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { TOTAL_MODULES, PHASE_INFO } from '@/lib/learn/module-sequence';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { CompareOthers } from '@/components/seo/CompareOthers';
import type { Locale } from '@/lib/i18n/config';

// ─── Labels ────────────────────────────────────────────────────
const L = (en: string, hi: string, ta?: string, bn?: string) => ({ en, hi, sa: hi, ta: ta ?? en, bn: bn ?? en });

const LABELS = {
  title: L(
    'Dekho Panchang vs mPanchang',
    'देखो पंचांग vs एमपंचांग',
    'டெக்கோ பஞ்சாங்கம் vs எம்பஞ்சாங்கம்',
    'দেখো পঞ্চাঙ্গ vs এমপঞ্চাঙ্গ',
  ),
  subtitle: L(
    'mPanchang is a clean mobile-first panchang app. Dekho Panchang is a full Vedic astrology platform  –  panchang, kundali, muhurta, matching, learning, and AI interpretation  –  all in the browser with no app install required.',
    'एमपंचांग एक साफ़ मोबाइल-प्रथम पंचांग ऐप है। देखो पंचांग एक पूर्ण वैदिक ज्योतिष मंच है  –  पंचांग, कुण्डली, मुहूर्त, मिलान, शिक्षण और AI व्याख्या  –  सब ब्राउज़र में बिना ऐप इंस्टॉल किए।',
    'எம்பஞ்சாங்கம் மொபைல் பஞ்சாங்க ஆப்ளிகேஷன். டெக்கோ பஞ்சாங்கம் முழு ஜோதிட தளம்.',
    'এমপঞ্চাঙ্গ মোবাইল পঞ্চাঙ্গ অ্যাপ। দেখো পঞ্চাঙ্গ সম্পূর্ণ জ্যোতিষ প্ল্যাটফর্ম।',
  ),
  disclaimer: L(
    'This comparison is based on publicly available features as of June 2026. We respect mPanchang as a well-designed mobile panchang application. This page highlights differences to help users choose the right tool for their needs.',
    'यह तुलना जून 2026 तक सार्वजनिक रूप से उपलब्ध सुविधाओं पर आधारित है। हम एमपंचांग को एक अच्छी तरह डिज़ाइन किए गए मोबाइल पंचांग ऐप के रूप में सम्मान करते हैं।',
  ),
  dekho: L('Dekho Panchang', 'देखो पंचांग'),
  competitor: L('mPanchang', 'एमपंचांग'),
  feature: L('Feature', 'सुविधा', 'அம்சம்', 'বৈশিষ্ট্য'),
  tryFree: L('Try Dekho Panchang Free', 'देखो पंचांग मुफ़्त आज़माएँ', 'டெக்கோ பஞ்சாங்கத்தை இலவசமாக முயற்சிக்கவும்', 'দেখো পঞ্চাঙ্গ বিনামূল্যে চেষ্টা করুন'),
  whyTitle: L('Why Dekho Panchang?', 'देखो पंचांग क्यों?', 'ஏன் டெக்கோ பஞ்சாங்கம்?', 'কেন দেখো পঞ্চাঙ্গ?'),
  bottomLine: L(
    'mPanchang is a clean, focused panchang app  –  great for checking daily tithi and muhurta on your phone. Dekho Panchang is a complete Vedic astrology platform: Swiss Ephemeris accuracy, full kundali with 16 Varga charts, 150+ yoga detection, 15+ dasha systems, AI-powered interpretation, 36-rule muhurta engine, Ashta Kuta matching, and a structured learning curriculum. All web-based with PWA offline support  –  no app store download needed.',
    'एमपंचांग एक साफ़, केन्द्रित पंचांग ऐप है  –  दैनिक तिथि और मुहूर्त जाँचने के लिए अच्छा। देखो पंचांग एक पूर्ण वैदिक ज्योतिष मंच है: Swiss Ephemeris सटीकता, 16 वर्ग चार्ट सहित पूर्ण कुण्डली, 150+ योग पहचान, 15+ दशा प्रणालियाँ, AI व्याख्या, 36-नियम मुहूर्त इंजन, अष्ट कूट मिलान और संरचित शिक्षण पाठ्यक्रम। सब वेब-आधारित PWA ऑफ़लाइन समर्थन के साथ।',
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
    dekho: 'Conversational AI astrologer (Claude Sonnet 4.6) with Layer-2 chart-context routing and a Layer-4 anti-hallucination validator. Every claim cites BPHS / Saravali / Phaladeepika. Multi-locale (EN, HI, TA, BN).',
    competitor: 'Panchang-only platform. No AI astrologer, no chart interpretation engine.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Deity Portrait Banners on the Tithi Calendar',
    featureHi: 'तिथि कैलेण्डर पर देवता चित्र बैनर',
    dekho: '18 painterly deity portraits auto-trigger as full-width banners on the matching festival cells. Each gets a colour-themed frame and a localised caption.',
    competitor: 'Generic festival icons; no contextual deity imagery on the calendar.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Hindu Months Calendar with Adhika Sandwich Logic',
    featureHi: 'हिन्दू मास कैलेण्डर  –  अधिक मास सैंडविच तर्क सहित',
    dekho: 'Dedicated /calendars/masa page with all 12 (or 13) lunar months, start/end dates, ritu, ayana, and key festivals. Purnimanta Adhika years correctly expand into a three-layer Nija-Krishna → Adhika → Nija-Shukla sandwich.',
    competitor: 'Daily panchang covers the current masa; no dedicated 12-masa grid page; Adhika handling is text only.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Vibrant Tithi Calendar (Grid + Mobile List)',
    featureHi: 'जीवन्त तिथि कैलेण्डर (ग्रिड + मोबाइल सूची)',
    dekho: 'Month-grid with sticky day-name header pinned below the navbar, prominent paksha colour wash, embedded per-cell panchang (sunrise/sunset/Rahu Kaal/Nakshatra/Yoga/Karana), and a dedicated mobile list view that auto-scrolls to today.',
    competitor: 'Basic daily panchang view; no immersive month-grid with per-cell panchang aggregation.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'BPHS-Aligned Amanta Boundaries (Kshaya-Aware Pratipada)',
    featureHi: 'BPHS-संरेखित अमान्त मास सीमा (क्षय-तिथि सहित प्रतिपदा)',
    dekho: 'Amanta months begin on Shukla Pratipada (not the preceding Amavasya) with a kshaya-aware sunrise lookup — the classical BPHS / Surya Siddhanta convention. Engine emits Ugadi 2026 = Mar 19, Gudi Padwa 2026 = Mar 19, Bestu Varas 2025 = Oct 22, Bestu Varas 2026 = Nov 10, Adhika Jyeshtha 2026 = May 17 → Jun 15. Backed by Swiss Ephemeris (NASA JPL DE441) for sub-arcsecond sunrise + longitude precision.',
    competitor: 'Standard NM-anchored convention without kshaya-aware day attribution; produces 1-day drift on kshaya-Pratipada years.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '9-Calendar Regional Comparison Hub with Mithila Malmaas',
    featureHi: '9-पंचांग क्षेत्रीय तुलना केन्द्र — मिथिला मलमास सहित',
    dekho: 'Dedicated /regional hub showing all 9 regional Hindu calendars side-by-side — Tamil, Bengali (post-Saha civil), Malayalam, Odia, Telugu, Kannada, Gujarati, Marathi, Mithila — with year picker, current-month highlight, key festivals per calendar, and Mithila Purnimanta Adhika rendered as a Krishna / Malmaas / Shukla 3-layer sandwich.',
    competitor: 'Single national calendar view; no regional comparison.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Career Muhurta Daily Best-Window Card',
    featureHi: 'करियर मुहूर्त — दैनिक सर्वोत्तम अवधि कार्ड',
    dekho: 'Auto-computed daily best window across 8 career activities — job interview, application, salary negotiation, contract signing, first day at job, resignation, business launch, and asking for promotion. Surfaces the highest-rated time + which activity it favours most + inauspicious overlays to avoid (Rahu Kaal). Embedded directly on /panchang for one-click planning.',
    competitor: 'Generic muhurta lookup; no dedicated career-window scorer.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Health Diagnosis Engine (Medical Astrology)',
    featureHi: 'स्वास्थ्य निदान इंजन (आयुर्ज्योतिष)',
    dekho: '22-element multi-axis health diagnosis surfacing classical Jyotish indicators for organ systems, vulnerable transit periods, and constitutional balance. Available on /medical-astrology, the /kundali Health card, via Brihaspati AI queries, and a /learn/health-diagnosis curriculum module.',
    competitor: 'Not available — calculation-focused panchang only.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Web-Based (No Install)',
    featureHi: 'वेब-आधारित (इंस्टॉल नहीं)',
    dekho: 'Works in any browser. PWA installable for home screen access + offline support.',
    competitor: 'Primarily native app  –  requires download from Play Store/App Store',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Ephemeris Engine',
    featureHi: 'एफेमेरिस इंजन',
    dekho: 'Swiss Ephemeris (NASA JPL DE441)  –  arc-second precision for all planets',
    competitor: 'Standard computation  –  adequate for basic panchang',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'Full Kundali Generator',
    featureHi: 'पूर्ण कुण्डली जनरेटर',
    dekho: 'North + South Indian, 16 Varga charts, Shadbala, Bhavabala, Avasthas, Jaimini, KP',
    competitor: 'Basic kundali  –  limited divisional charts, no Shadbala/Jaimini/KP',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'AI-Powered Interpretation',
    featureHi: 'AI-संचालित व्याख्या',
    dekho: 'Narrative Tippanni for YOUR chart  –  personality, career, relationships, remedies',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '36-Rule Muhurta Engine',
    featureHi: '36-नियम मुहूर्त इंजन',
    dekho: '36 rules from 7 texts with cancellation logic. Personalised with Tara Bala + Dasha.',
    competitor: 'Basic muhurta/shubh timings  –  no multi-rule scoring',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '150+ Yoga Detection',
    featureHi: '150+ योग पहचान',
    dekho: '150+ classical yogas with frequency validation to prevent false positives',
    competitor: 'Basic yoga listing',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '15+ Dasha Systems',
    featureHi: '15+ दशा पद्धतियाँ',
    dekho: 'Vimshottari, Yogini, Chara, Narayana, Kalachakra, Sudarshana, and more',
    competitor: 'Vimshottari only',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Ashta Kuta Matching',
    featureHi: 'अष्ट कूट मिलान',
    dekho: '36-point Ashta Kuta with dosha cancellation analysis and partner insights',
    competitor: 'Basic matching feature',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Learning Curriculum',
    featureHi: 'शिक्षण पाठ्यक्रम',
    dekho: `${TOTAL_MODULES} structured modules across ${PHASE_INFO.length} phases  –  beginner to advanced Jyotish`,
    competitor: 'Not available  –  panchang-focused, no learning content',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Multilingual UI',
    featureHi: 'बहुभाषी इंटरफ़ेस',
    dekho: '10 languages with native terminology  –  EN, HI, SA, TA, TE, BN, KN, MR, GU, Maithili',
    competitor: 'English, Hindi',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Daily Panchang',
    featureHi: 'दैनिक पंचांग',
    dekho: 'Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Choghadiya, Hora  –  for any location worldwide',
    competitor: 'Clean daily panchang display with notifications',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Daily Notifications',
    featureHi: 'दैनिक सूचनाएं',
    dekho: 'Daily panchang email + PWA push notifications',
    competitor: 'Native app push notifications  –  one of their key strengths',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: '255 Festivals  –  All Traditions',
    featureHi: '255 त्योहार  –  सभी परम्पराएँ',
    dekho: '255 festivals across Hindu, Jain, Sikh, Buddhist with tradition/region tagging',
    competitor: 'Major festival dates',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: '11 Ayanamsha Systems',
    featureHi: '11 अयनांश पद्धतियाँ',
    dekho: 'Lahiri, KP, Raman, True Chitra, Galactic Center, and 6 more',
    competitor: 'Lahiri (single option)',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Transit Playground',
    featureHi: 'गोचर खेल',
    dekho: 'Interactive transit overlay on natal chart with slow-planet tracking',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Prashna (Horary)',
    featureHi: 'प्रश्न (होरारी)',
    dekho: 'KP Horary + Kerala Ashtamangala Prashna  –  two horary systems',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Nadi Amsha (D-150)',
    featureHi: 'नाड़ी अंश (D-150)',
    dekho: 'D-150 chart with karmic narrative and soul purpose analysis',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Devotional Library',
    featureHi: 'भक्ति पुस्तकालय',
    dekho: '55+ sacred texts  –  Devanagari + transliteration + meaning',
    competitor: 'Aarti/Chalisa collection',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Shadbala + Ashtakavarga',
    featureHi: 'षड्बल + अष्टकवर्ग',
    dekho: 'Full Shadbala, Bhavabala, SAV heatmap with colour-coded strength rankings',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Modern UI',
    featureHi: 'आधुनिक UI',
    dekho: 'Dark celestial theme, responsive, animated, zero ads in core features',
    competitor: 'Clean mobile UI  –  well-designed for phone use',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Free Access',
    featureHi: 'मुफ़्त पहुँच',
    dekho: 'All features free  –  no paywall (AI calls have small daily limits)',
    competitor: 'Free with ads  –  some premium features in paid version',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Embeddable Temple Widget',
    featureHi: 'मन्दिर विजेट (एम्बेड)',
    dekho: 'Free iframe widget for temple websites with city panchang',
    competitor: 'Not available',
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
    icon: Smartphone,
    title: 'Web-Based  –  No Install Required',
    titleHi: 'वेब-आधारित  –  इंस्टॉल की आवश्यकता नहीं',
    body: 'Access everything from your browser. Install as a PWA for offline support and home screen access  –  no app store download needed.',
    bodyHi: 'ब्राउज़र से सब कुछ एक्सेस करें। ऑफ़लाइन समर्थन के लिए PWA के रूप में इंस्टॉल करें  –  ऐप स्टोर डाउनलोड की आवश्यकता नहीं।',
  },
  {
    icon: Brain,
    title: 'Beyond Panchang  –  Full Astrology Platform',
    titleHi: 'पंचांग से परे  –  पूर्ण ज्योतिष मंच',
    body: 'mPanchang focuses on daily panchang. Dekho Panchang adds full kundali, matching, muhurta AI, transit analysis, prashna, and structured learning.',
    bodyHi: 'एमपंचांग दैनिक पंचांग पर केन्द्रित है। देखो पंचांग पूर्ण कुण्डली, मिलान, मुहूर्त AI, गोचर विश्लेषण, प्रश्न और संरचित शिक्षण जोड़ता है।',
  },
  {
    icon: Shield,
    title: 'Swiss Ephemeris Precision',
    titleHi: 'Swiss Ephemeris सटीकता',
    body: 'Built on Swiss Ephemeris (NASA JPL DE441). Planetary positions accurate to arc-seconds. 11 ayanamsha systems.',
    bodyHi: 'स्विस एफेमेरिस (NASA JPL DE441) पर निर्मित। ग्रह स्थितियाँ आर्क-सेकंड तक सटीक। 11 अयनांश पद्धतियाँ।',
  },
  {
    icon: Globe,
    title: '10 Languages, Native Feel',
    titleHi: '10 भाषाएँ, मूल अनुभव',
    body: 'Not "translated English"  –  proper terminology in Sanskrit, Tamil, Bengali, Kannada, Maithili, and more.',
    bodyHi: '"अनुवादित अंग्रेज़ी" नहीं  –  संस्कृत, तमिल, बांग्ला, कन्नड़, मैथिली आदि में उचित शब्दावली।',
  },
  {
    icon: BookOpen,
    title: `${TOTAL_MODULES}-Module Learning Path`,
    titleHi: `${TOTAL_MODULES}-मॉड्यूल शिक्षण पथ`,
    body: 'Structured curriculum from beginner to advanced Jyotish  –  something no panchang app offers.',
    bodyHi: 'शुरुआती से उन्नत ज्योतिष तक संरचित पाठ्यक्रम  –  कोई पंचांग ऐप ऐसा नहीं देता।',
  },
  {
    icon: Palette,
    title: 'Dark Celestial Design',
    titleHi: 'अंधकार-युक्त खगोलीय डिज़ाइन',
    body: 'Immersive dark theme with gold accents, smooth animations, custom SVG icons  –  designed to feel celestial.',
    bodyHi: 'स्वर्ण उच्चारण के साथ गहन अंधकार थीम, सुचारू एनिमेशन, कस्टम SVG आइकन  –  खगोलीय अनुभव।',
  },
];

// ─── Animation ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function VsMPanchangPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const isTa = locale === 'ta';
  const isBn = locale === 'bn';

  const t = (obj: Record<string, string>) =>
    isTa ? (obj.ta ?? obj.en) : isBn ? (obj.bn ?? obj.en) : isDevanagari ? obj.hi : obj.en;

  const headingFont = { fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' };

  // JSON-LD
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/vs/mpanchang`, locale);
  const comparisonLD = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Dekho Panchang vs mPanchang  –  Feature Comparison',
    description: 'Objective feature comparison between Dekho Panchang and mPanchang  –  full astrology platform vs mobile panchang app.',
    url: `https://dekhopanchang.com/${locale}/vs/mpanchang`,
    mainEntity: {
      '@type': 'Table',
      about: 'Feature comparison of Vedic astrology platforms',
    },
  };
  const faqLD = generateFAQLD('/vs/mpanchang', locale);

  return (
    <main className="min-h-screen bg-bg-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(comparisonLD) }} />
      {faqLD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />}

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

        <CompareOthers currentSlug="mpanchang" />

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

        <ShareRow pageTitle="Dekho Panchang vs mPanchang" locale={locale} />
      </div>
    </main>
  );
}
