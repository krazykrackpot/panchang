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
import { generateFAQLD } from '@/lib/seo/faq-data';
import { CompareOthers } from '@/components/seo/CompareOthers';
import type { Locale } from '@/lib/i18n/config';

// ─── Labels ────────────────────────────────────────────────────
const L = (en: string, hi: string, ta?: string, bn?: string) => ({ en, hi, sa: hi, ta: ta ?? en, bn: bn ?? en });

const LABELS = {
  title: L(
    'Dekho Panchang vs Prokerala',
    'देखो पंचांग vs प्रोकेरला',
    'டெக்கோ பஞ்சாங்கம் vs புரோகேரளா',
    'দেখো পঞ্চাঙ্গ vs প্রোকেরালা',
  ),
  subtitle: L(
    'Prokerala provides a solid South Indian panchang. Dekho Panchang adds AI interpretation, 36-rule muhurta reasoning, 150+ yoga detection, and a structured learning path  –  turning raw data into personalised guidance.',
    'प्रोकेरला एक अच्छा दक्षिण भारतीय पंचांग है। देखो पंचांग AI व्याख्या, 36-नियम मुहूर्त तर्क, 150+ योग पहचान और संरचित शिक्षण पथ जोड़ता है  –  कच्चे डेटा को व्यक्तिगत मार्गदर्शन में बदलता है।',
    'புரோகேரளா நல்ல தென்னிந்திய பஞ்சாங்கம் வழங்குகிறது. டெக்கோ பஞ்சாங்கம் AI விளக்கம், 150+ யோகம் கண்டறிதல் சேர்க்கிறது.',
    'প্রোকেরালা ভালো দক্ষিণ ভারতীয় পঞ্চাঙ্গ। দেখো পঞ্চাঙ্গ AI ব্যাখ্যা, 150+ যোগ সনাক্তকরণ যোগ করে।',
  ),
  disclaimer: L(
    'This comparison is based on publicly available features as of May 2026. We respect Prokerala as a well-established platform serving millions of users. This page highlights differences to help users choose the right tool for their needs.',
    'यह तुलना मई 2026 तक सार्वजनिक रूप से उपलब्ध सुविधाओं पर आधारित है। हम प्रोकेरला को लाखों उपयोगकर्ताओं की सेवा करने वाले एक स्थापित मंच के रूप में सम्मान करते हैं।',
  ),
  dekho: L('Dekho Panchang', 'देखो पंचांग'),
  competitor: L('Prokerala', 'प्रोकेरला'),
  feature: L('Feature', 'सुविधा', 'அம்சம்', 'বৈশিষ্ট্য'),
  tryFree: L('Try Dekho Panchang Free', 'देखो पंचांग मुफ़्त आज़माएँ', 'டெக்கோ பஞ்சாங்கத்தை இலவசமாக முயற்சிக்கவும்', 'দেখো পঞ্চাঙ্গ বিনামূল্যে চেষ্টা করুন'),
  whyTitle: L('Why Dekho Panchang?', 'देखो पंचांग क्यों?', 'ஏன் டெக்கோ பஞ்சாங்கம்?', 'কেন দেখো পঞ্চাঙ্গ?'),
  bottomLine: L(
    'Prokerala is a reliable panchang tool with a strong South Indian user base. Dekho Panchang builds on the same astronomical foundations (Swiss Ephemeris, NASA JPL DE441) but adds layers that Prokerala does not offer: AI-powered birth chart interpretation, a 36-rule muhurta engine with classical cancellation logic, 150+ yoga detection with frequency validation, 15+ dasha systems, and a structured learning curriculum. Where Prokerala gives you data, Dekho Panchang gives you answers.',
    'प्रोकेरला एक विश्वसनीय पंचांग उपकरण है। देखो पंचांग उन्हीं खगोलीय आधारों पर निर्मित है (Swiss Ephemeris, NASA JPL DE441) लेकिन AI व्याख्या, 36-नियम मुहूर्त इंजन, 150+ योग पहचान, 15+ दशा प्रणालियाँ और संरचित शिक्षण पाठ्यक्रम जोड़ता है। जहाँ प्रोकेरला डेटा देता है, देखो पंचांग उत्तर देता है।',
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
    dekho: 'Conversational AI astrologer (Claude Sonnet 4.6) with Layer-2 chart-context routing and a Layer-4 anti-hallucination validator. Quotes BPHS / Saravali / Phaladeepika at every claim. Multi-locale (EN, HI, TA, BN), pandit-style reasoning chains, tier-fallback discipline, no doom-cast safeguards.',
    competitor: 'Panchang and chart data are surfaced as tables. No autonomous AI astrologer with cited classical sources.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Deity Portrait Banners on the Tithi Calendar',
    featureHi: 'तिथि कैलेण्डर पर देवता चित्र बैनर',
    dekho: '18 painterly deity portraits (Vishnu, Shiva, Devi, Lakshmi, Ganesha, Ram, Saraswati, Hanuman, Krishna, Surya, Buddha, Kali, Parashurama, Narasimha, Dattatreya, Skanda, Annapurna, Jagannath) auto-trigger as full-width banners on the matching festival cells. Each banner gets its own colour-themed frame.',
    competitor: 'Generic festival icons; no contextual deity imagery on the calendar.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Hindu Months Calendar with Adhika Sandwich Logic',
    featureHi: 'हिन्दू मास कैलेण्डर  –  अधिक मास सैंडविच तर्क सहित',
    dekho: 'Dedicated /calendars/masa page with all 12 (or 13) lunar months, start/end dates, ritu, ayana, and key festivals. Purnimanta Adhika years correctly expand into a three-layer Nija-Krishna → Adhika → Nija-Shukla sandwich.',
    competitor: 'Festival pages reference Hindu months; no unified masa-grid page; Adhika handling is text.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Vibrant Tithi Calendar (Grid + Mobile List)',
    featureHi: 'जीवन्त तिथि कैलेण्डर (ग्रिड + मोबाइल सूची)',
    dekho: 'Month-grid with sticky day-name header pinned below the navbar, prominent Shukla/Krishna paksha colour wash, embedded per-cell panchang (sunrise/sunset/Rahu Kaal/Nakshatra/Yoga/Karana), personalised Tara+Chandra Bala star, Today pill, and a dedicated mobile list view.',
    competitor: 'Traditional tabular tithi calendar; data only.',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Ephemeris Engine',
    featureHi: 'एफेमेरिस इंजन',
    dekho: 'Swiss Ephemeris (NASA JPL DE441)  –  arc-second precision for all planets',
    competitor: 'Custom computation engine  –  adequate for basic panchang but less precise for outer planets',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'Personalized Tippanni (Interpretive Commentary)',
    featureHi: 'व्यक्तिगत टिप्पणी (व्याख्यात्मक भाष्य)',
    dekho: 'AI-powered narrative for YOUR chart  –  personality, career, relationships, remedies',
    competitor: 'Generic planetary position tables without personalised interpretation',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '36-Rule Muhurta Engine',
    featureHi: '36-नियम मुहूर्त इंजन',
    dekho: '36 rules from 7 texts with 5-tier cancellation logic. Pandit-style reasoning with citations.',
    competitor: 'Basic muhurta lookup  –  no scoring, no cancellation logic, no reasoning',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '150+ Yoga Detection',
    featureHi: '150+ योग पहचान',
    dekho: '150+ classical yogas with frequency validation to prevent false positives',
    competitor: 'Approximately 20 yogas listed',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'Shadbala + Ashtakavarga Analysis',
    featureHi: 'षड्बल + अष्टकवर्ग विश्लेषण',
    dekho: 'Full Shadbala (6-fold strength), Bhavabala, SAV heatmap, strength rankings with visual charts',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '11 Ayanamsha Systems',
    featureHi: '11 अयनांश पद्धतियाँ',
    dekho: 'Lahiri, KP, Raman, BV Raman, Yukteshwar, Fagan-Bradley, True Chitra, and 4 more',
    competitor: 'Lahiri + Raman (2 options)',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: '15+ Dasha Systems',
    featureHi: '15+ दशा पद्धतियाँ',
    dekho: 'Vimshottari, Yogini, Chara, Narayana, Kalachakra, Sudarshana, and more',
    competitor: 'Vimshottari only',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'KP System (Krishnamurti Paddhati)',
    featureHi: 'केपी पद्धति',
    dekho: 'Full Placidus houses, sub-lord table, significators, ruling planets',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Jaimini System',
    featureHi: 'जैमिनी पद्धति',
    dekho: 'Chara Karakas, Argala, Jaimini aspects, Chara Dasha',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Birth Chart (Kundali)',
    featureHi: 'जन्म कुण्डली',
    dekho: 'North + South Indian, 16 Varga charts, Shadbala, Avasthas, Jaimini, KP',
    competitor: 'North + South Indian charts, basic divisional charts',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Ashta Kuta Matching',
    featureHi: 'अष्ट कूट मिलान',
    dekho: '36-point Ashta Kuta with dosha cancellation analysis and partner insights',
    competitor: 'Standard 36-point matching',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Multilingual UI',
    featureHi: 'बहुभाषी इंटरफ़ेस',
    dekho: '10 languages with native terminology  –  EN, HI, SA, TA, TE, BN, KN, MR, GU, Maithili',
    competitor: 'English, Hindi, Malayalam  –  translated English feel',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Panchang Accuracy',
    featureHi: 'पंचांग सटीकता',
    dekho: 'Swiss Ephemeris  –  tithi transitions accurate to +/-1-2 minutes',
    competitor: 'Established computation  –  generally accurate',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Transit Playground',
    featureHi: 'गोचर खेल',
    dekho: 'Interactive transit overlay on natal chart with slow-planet tracking',
    competitor: 'Static transit tables',
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
    feature: 'Learning Curriculum',
    featureHi: 'शिक्षण पाठ्यक्रम',
    dekho: `${TOTAL_MODULES} structured modules across ${PHASE_INFO.length} phases  –  beginner to advanced`,
    competitor: 'Reference articles (unstructured)',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Modern UI / Mobile First',
    featureHi: 'आधुनिक UI / मोबाइल प्रथम',
    dekho: 'Dark celestial theme, responsive, animated, PWA-installable, no ads in core features',
    competitor: 'Clean layout, mobile-responsive, ad-supported',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Nadi Amsha (D-150)',
    featureHi: 'नाड़ी अंश (D-150)',
    dekho: 'D-150 chart with karmic narrative, soul purpose, and 150 Nadi reference',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Premium PDF Kundali Report',
    featureHi: 'प्रीमियम PDF कुण्डली रिपोर्ट',
    dekho: '12-section professional report  –  personality, yogas, doshas, dashas, remedies',
    competitor: 'Basic chart printout',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Free Access',
    featureHi: 'मुफ़्त पहुँच',
    dekho: 'All features free  –  no paywall (AI calls have small daily limits)',
    competitor: 'Free with ads  –  some premium features behind paywall',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: '255 Festivals  –  All Traditions',
    featureHi: '255 त्योहार  –  सभी परम्पराएँ',
    dekho: '255 festivals across Hindu, Jain, Sikh, Buddhist with tradition/region tagging',
    competitor: 'Major festival listing  –  South Indian focus',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Dosha Cancellation Analysis',
    featureHi: 'दोष निवारण विश्लेषण',
    dekho: 'Mangal, Kaal Sarpa, Pitra  –  shows which cancellation conditions are met',
    competitor: 'Basic dosha detection only',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Embeddable Temple Widget',
    featureHi: 'मन्दिर विजेट (एम्बेड)',
    dekho: 'Free iframe widget for temple websites with city panchang',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'PWA with Offline Panchang',
    featureHi: 'PWA ऑफ़लाइन पंचांग सहित',
    dekho: 'Installable app, offline cached panchang, home screen shortcuts',
    competitor: 'Web only  –  no PWA or offline support',
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
    title: 'AI-Powered Interpretation',
    titleHi: 'AI-संचालित व्याख्या',
    body: 'Your chart is not just calculated  –  it is interpreted. Our Tippanni engine generates narrative commentary on your personality, dashas, yogas, and life areas.',
    bodyHi: 'आपकी कुण्डली केवल गणना नहीं  –  व्याख्या की जाती है। हमारा टिप्पणी इंजन आपके व्यक्तित्व, दशा, योग और जीवन क्षेत्रों पर विवरणात्मक भाष्य तैयार करता है।',
  },
  {
    icon: Sparkles,
    title: '150+ Yogas vs ~20',
    titleHi: '150+ योग vs ~20',
    body: 'Prokerala lists around 20 yogas. Dekho Panchang detects 150+ classical yogas with frequency validation  –  no false positives, no missed combinations.',
    bodyHi: 'प्रोकेरला लगभग 20 योग सूचीबद्ध करता है। देखो पंचांग आवृत्ति सत्यापन के साथ 150+ शास्त्रीय योगों की पहचान करता है।',
  },
  {
    icon: Shield,
    title: 'Swiss Ephemeris Precision',
    titleHi: 'Swiss Ephemeris सटीकता',
    body: 'Built on Swiss Ephemeris (NASA JPL DE441)  –  the gold standard for astronomical computation. Planetary positions accurate to arc-seconds.',
    bodyHi: 'स्विस एफेमेरिस (NASA JPL DE441) पर निर्मित  –  खगोलीय गणना का स्वर्ण मानक।',
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
    body: 'From "What is a Tithi?" to advanced Jaimini Chara Dasha  –  structured learning with progress tracking and interactive labs.',
    bodyHi: '"तिथि क्या है?" से लेकर उन्नत जैमिनी चर दशा तक  –  प्रगति ट्रैकिंग और इंटरैक्टिव लैब्स के साथ संरचित शिक्षण।',
  },
  {
    icon: Palette,
    title: 'Beautiful, Modern Experience',
    titleHi: 'सुन्दर, आधुनिक अनुभव',
    body: 'Dark celestial theme, smooth animations, installable PWA, zero ads in core features. Designed for the modern seeker.',
    bodyHi: 'अंधकार-युक्त खगोलीय थीम, सुचारू एनिमेशन, इंस्टॉल करने योग्य PWA, मुख्य सुविधाओं में शून्य विज्ञापन।',
  },
];

// ─── Animation ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function VsProkeralaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const isTa = locale === 'ta';
  const isBn = locale === 'bn';

  const t = (obj: Record<string, string>) =>
    isTa ? (obj.ta ?? obj.en) : isBn ? (obj.bn ?? obj.en) : isDevanagari ? obj.hi : obj.en;

  const headingFont = { fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' };

  // JSON-LD
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/vs/prokerala`, locale);
  const comparisonLD = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Dekho Panchang vs Prokerala  –  Feature Comparison',
    description: 'Objective feature comparison between Dekho Panchang and Prokerala  –  two Vedic astrology platforms.',
    url: `https://dekhopanchang.com/${locale}/vs/prokerala`,
    mainEntity: {
      '@type': 'Table',
      about: 'Feature comparison of Vedic astrology platforms',
    },
  };
  const faqLD = generateFAQLD('/vs/prokerala', locale);

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
          {/* Table header */}
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

          {/* Table rows */}
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

        <CompareOthers currentSlug="prokerala" />

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

        <ShareRow pageTitle="Dekho Panchang vs Prokerala" locale={locale} />
      </div>
    </main>
  );
}
