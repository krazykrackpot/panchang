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
import type { Locale } from '@/lib/i18n/config';

// ─── Labels ────────────────────────────────────────────────────
const L = (en: string, hi: string, ta?: string, bn?: string) => ({ en, hi, sa: hi, ta: ta ?? en, bn: bn ?? en });

const LABELS = {
  title: L(
    'Dekho Panchang vs AstroSage',
    'देखो पंचांग vs एस्ट्रोसेज',
    'டெக்கோ பஞ்சாங்கம் vs ஆஸ்ட்ரோசேஜ்',
    'দেখো পঞ্চাঙ্গ vs অ্যাস্ট্রোসেজ',
  ),
  subtitle: L(
    'AstroSage is the largest Indian astrology portal  –  a content encyclopedia. Dekho Panchang is a computation engine that reasons about your chart like a classically trained Jyotishi.',
    'एस्ट्रोसेज भारत का सबसे बड़ा ज्योतिष पोर्टल है  –  एक सामग्री विश्वकोश। देखो पंचांग एक गणना इंजन है जो शास्त्रीय रूप से प्रशिक्षित ज्योतिषी की तरह आपकी कुण्डली का विश्लेषण करता है।',
    'ஆஸ்ட்ரோசேஜ் மிகப்பெரிய இந்திய ஜோதிட தளம். டெக்கோ பஞ்சாங்கம் கணக்கீட்டு இயந்திரம்.',
    'অ্যাস্ট্রোসেজ বৃহত্তম ভারতীয় জ্যোতিষ পোর্টাল। দেখো পঞ্চাঙ্গ গণনা ইঞ্জিন।',
  ),
  disclaimer: L(
    'This comparison is based on publicly available features as of May 2026. We respect AstroSage as a pioneering platform that has served millions of users for over 15 years. This page highlights differences to help users choose the right tool for their needs.',
    'यह तुलना मई 2026 तक सार्वजनिक रूप से उपलब्ध सुविधाओं पर आधारित है। हम एस्ट्रोसेज को 15+ वर्षों से लाखों उपयोगकर्ताओं की सेवा करने वाले अग्रणी मंच के रूप में सम्मान करते हैं।',
  ),
  dekho: L('Dekho Panchang', 'देखो पंचांग'),
  competitor: L('AstroSage', 'एस्ट्रोसेज'),
  feature: L('Feature', 'सुविधा', 'அம்சம்', 'বৈশিষ্ট্য'),
  tryFree: L('Try Dekho Panchang Free', 'देखो पंचांग मुफ़्त आज़माएँ', 'டெக்கோ பஞ்சாங்கத்தை இலவசமாக முயற்சிக்கவும்', 'দেখো পঞ্চাঙ্গ বিনামূল্যে চেষ্টা করুন'),
  whyTitle: L('Why Dekho Panchang?', 'देखो पंचांग क्यों?', 'ஏன் டெக்கோ பஞ்சாங்கம்?', 'কেন দেখো পঞ্চাঙ্গ?'),
  bottomLine: L(
    'AstroSage is a content powerhouse with the largest astrology article library in India. Dekho Panchang takes a different approach: computation-first, with documented algorithms (Swiss Ephemeris, NASA JPL DE441), open methodology, and AI-powered interpretation. No registration required for core features. Where AstroSage gives you articles to read, Dekho Panchang gives you a digital Jyotishi that reasons about YOUR chart  –  with 150+ yogas, 15+ dasha systems, Shadbala analysis, and pandit-style muhurta verdicts.',
    'एस्ट्रोसेज भारत की सबसे बड़ी ज्योतिष लेख लाइब्रेरी वाला सामग्री शक्तिकेन्द्र है। देखो पंचांग भिन्न दृष्टिकोण अपनाता है: गणना-प्रथम, दस्तावेज़ीकृत एल्गोरिदम (Swiss Ephemeris, NASA JPL DE441), खुली कार्यप्रणाली और AI-संचालित व्याख्या। मुख्य सुविधाओं के लिए पंजीकरण की आवश्यकता नहीं।',
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
    feature: 'Computation Methodology',
    featureHi: 'गणना कार्यप्रणाली',
    dekho: 'Swiss Ephemeris (NASA JPL DE441)  –  documented, open methodology. Arc-second precision.',
    competitor: 'Proprietary computation  –  methodology not publicly documented',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'Personalized Tippanni (AI Interpretation)',
    featureHi: 'व्यक्तिगत टिप्पणी (AI व्याख्या)',
    dekho: 'AI-powered narrative for YOUR chart  –  personality, career, relationships, remedies with pandit-style reasoning',
    competitor: 'Template-based predictions  –  generic text per planet/sign combination',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '36-Rule Muhurta Engine',
    featureHi: '36-नियम मुहूर्त इंजन',
    dekho: '36 rules from 7 texts with 5-tier cancellation logic. Personalised scoring with Tara Bala + Dasha Harmony.',
    competitor: 'Basic Panchanga Shuddhi check  –  no multi-rule scoring or cancellation logic',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'No Registration Required',
    featureHi: 'पंजीकरण आवश्यक नहीं',
    dekho: 'Full kundali, panchang, matching  –  all without signup. AI features need free account.',
    competitor: 'Account required for saving charts and some premium features',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: '150+ Yoga Detection',
    featureHi: '150+ योग पहचान',
    dekho: '150+ classical yogas with expected-frequency validation  –  no false positives',
    competitor: 'Basic yoga listing  –  limited detection, no frequency validation',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'Shadbala + Ashtakavarga Visuals',
    featureHi: 'षड्बल + अष्टकवर्ग दृश्य',
    dekho: 'Full Shadbala, Bhavabala, SAV heatmap with colour-coded strength rankings',
    competitor: 'Basic Ashtakavarga tables  –  limited visualisation',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: '11 Ayanamsha Systems',
    featureHi: '11 अयनांश पद्धतियाँ',
    dekho: 'Lahiri, KP, Raman, True Chitra, Galactic Center, and 6 more',
    competitor: 'Lahiri primarily  –  limited ayanamsha options',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: '15+ Dasha Systems',
    featureHi: '15+ दशा पद्धतियाँ',
    dekho: 'Vimshottari, Yogini, Chara, Narayana, Kalachakra, Sudarshana, and more',
    competitor: 'Vimshottari + Yogini',
    dekhoYes: true, competitorYes: true, highlight: true,
  },
  {
    feature: 'KP System',
    featureHi: 'केपी पद्धति',
    dekho: 'Full Placidus houses, sub-lord table, significators, ruling planets',
    competitor: 'Basic KP features',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Jaimini System',
    featureHi: 'जैमिनी पद्धति',
    dekho: 'Chara Karakas, Argala, Jaimini aspects, Chara Dasha with interpretations',
    competitor: 'Not available',
    dekhoYes: true, competitorYes: false,
  },
  {
    feature: 'Modern UI / Ad-Free Core',
    featureHi: 'आधुनिक UI / विज्ञापन-मुक्त',
    dekho: 'Dark celestial theme, responsive, animated, PWA-installable, zero ads in core features',
    competitor: 'Traditional layout, heavy ad placement throughout',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Multilingual UI',
    featureHi: 'बहुभाषी इंटरफ़ेस',
    dekho: '10 languages with native terminology  –  EN, HI, SA, TA, TE, BN, KN, MR, GU, Maithili',
    competitor: 'English, Hindi  –  translated English feel',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Content Library',
    featureHi: 'सामग्री पुस्तकालय',
    dekho: 'Focused on structured learning  –  curriculum modules, not magazine articles',
    competitor: 'Largest astrology article library in India  –  thousands of articles, predictions, magazine content',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Learning Curriculum',
    featureHi: 'शिक्षण पाठ्यक्रम',
    dekho: `${TOTAL_MODULES} structured modules across ${PHASE_INFO.length} phases  –  beginner to advanced Jyotish`,
    competitor: 'Articles and tutorials  –  no structured curriculum or progress tracking',
    dekhoYes: true, competitorYes: false, highlight: true,
  },
  {
    feature: 'Transit Playground',
    featureHi: 'गोचर खेल',
    dekho: 'Interactive transit overlay on natal chart with slow-planet tracking',
    competitor: 'Static transit predictions',
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
    feature: 'Birth Chart (Kundali)',
    featureHi: 'जन्म कुण्डली',
    dekho: 'North + South Indian, 16 Varga charts, Shadbala, Avasthas, Jaimini, KP',
    competitor: 'North + South Indian, basic divisional charts',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Ashta Kuta Matching',
    featureHi: 'अष्ट कूट मिलान',
    dekho: '36-point Ashta Kuta with dosha cancellation analysis and partner insights',
    competitor: 'Standard matching with compatibility score',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Page Speed (Core Web Vitals)',
    featureHi: 'पृष्ठ गति',
    dekho: 'Next.js 16 SSR + edge caching, optimised images/fonts, minimal JS payload',
    competitor: 'Legacy stack with heavy JS/ad bundles  –  slower load times',
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
    feature: '255 Festivals  –  All Traditions',
    featureHi: '255 त्योहार  –  सभी परम्पराएँ',
    dekho: '255 festivals across Hindu, Jain, Sikh, Buddhist with tradition/region tagging',
    competitor: 'Major festival dates',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'PWA with Offline Panchang',
    featureHi: 'PWA ऑफ़लाइन पंचांग सहित',
    dekho: 'Installable app, offline cached panchang, home screen shortcuts',
    competitor: 'Native apps available  –  no PWA',
    dekhoYes: true, competitorYes: true,
  },
  {
    feature: 'Free Access',
    featureHi: 'मुफ़्त पहुँच',
    dekho: 'All features free  –  no paywall (AI calls have small daily limits)',
    competitor: 'Free with ads  –  some premium features require payment',
    dekhoYes: true, competitorYes: true,
  },
];

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
    title: 'Computation-First, Not Content-First',
    titleHi: 'गणना-प्रथम, सामग्री-प्रथम नहीं',
    body: 'AstroSage is a content encyclopedia. Dekho Panchang is a computation engine. Every value you see is computed live from planetary positions  –  not pulled from generic templates.',
    bodyHi: 'एस्ट्रोसेज सामग्री विश्वकोश है। देखो पंचांग गणना इंजन है। हर मान ग्रह स्थितियों से सीधे गणना किया जाता है।',
  },
  {
    icon: Shield,
    title: 'Open Methodology',
    titleHi: 'खुली कार्यप्रणाली',
    body: 'Our algorithms are documented. Swiss Ephemeris (NASA JPL DE441) with 11 ayanamsha options. You can verify every computation against reference sources.',
    bodyHi: 'हमारे एल्गोरिदम दस्तावेज़ीकृत हैं। Swiss Ephemeris (NASA JPL DE441) 11 अयनांश विकल्पों के साथ।',
  },
  {
    icon: Sparkles,
    title: 'Digital Pandit Reasoning',
    titleHi: 'डिजिटल पण्डित तर्क',
    body: 'Our muhurta engine does not just say "good" or "bad". It explains WHY  –  citing Muhurta Chintamani, BPHS, Brihat Samhita  –  with cancellation logic that a trained Jyotishi would apply.',
    bodyHi: 'हमारा मुहूर्त इंजन केवल "शुभ" या "अशुभ" नहीं कहता। यह बताता है क्यों  –  मुहूर्त चिंतामणि, BPHS, बृहत् संहिता के उद्धरण सहित।',
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
    body: 'Structured curriculum from beginner to advanced  –  not scattered articles. Progress tracking, interactive labs, spaced repetition.',
    bodyHi: 'शुरुआती से उन्नत तक संरचित पाठ्यक्रम  –  बिखरे लेख नहीं। प्रगति ट्रैकिंग, इंटरैक्टिव लैब्स।',
  },
  {
    icon: Palette,
    title: 'Clean, Ad-Free Experience',
    titleHi: 'स्वच्छ, विज्ञापन-मुक्त अनुभव',
    body: 'Dark celestial theme, smooth animations, installable PWA. Zero ads in core features  –  your chart, not banner ads.',
    bodyHi: 'अंधकार-युक्त खगोलीय थीम, सुचारू एनिमेशन, इंस्टॉल करने योग्य PWA। मुख्य सुविधाओं में शून्य विज्ञापन।',
  },
];

// ─── Animation ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function VsAstroSagePage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const isTa = locale === 'ta';
  const isBn = locale === 'bn';

  const t = (obj: Record<string, string>) =>
    isTa ? (obj.ta ?? obj.en) : isBn ? (obj.bn ?? obj.en) : isDevanagari ? obj.hi : obj.en;

  const headingFont = { fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' };

  // JSON-LD
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/vs/astrosage`, locale);
  const comparisonLD = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Dekho Panchang vs AstroSage  –  Feature Comparison',
    description: 'Objective feature comparison between Dekho Panchang and AstroSage  –  computation engine vs content portal.',
    url: `https://dekhopanchang.com/${locale}/vs/astrosage`,
    mainEntity: {
      '@type': 'Table',
      about: 'Feature comparison of Vedic astrology platforms',
    },
  };
  const faqLD = generateFAQLD('/vs/astrosage', locale);

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
        {(() => {
          const dekhoCount = ROWS.filter(r => r.dekhoYes).length;
          const compCount = ROWS.filter(r => r.competitorYes).length;
          return (
            <motion.div
              custom={1.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
            >
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5">
                <Trophy size={20} className="text-emerald-400" />
                <span className="text-emerald-400 font-bold text-lg">{dekhoCount}</span>
                <span className="text-text-secondary text-sm">{t(LABELS.dekho)}</span>
              </div>
              <span className="text-text-secondary text-sm font-medium">vs</span>
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl border border-text-secondary/20 bg-white/[0.02]">
                <BarChart3 size={20} className="text-text-secondary" />
                <span className="text-text-secondary font-bold text-lg">{compCount}</span>
                <span className="text-text-secondary text-sm">{t(LABELS.competitor)}</span>
              </div>
            </motion.div>
          );
        })()}

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

        <ShareRow pageTitle="Dekho Panchang vs AstroSage" locale={locale} />
      </div>
    </main>
  );
}
