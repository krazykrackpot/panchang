'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Check, X, Sparkles, Globe, Brain, Palette, Shield, Clock, BookOpen, BarChart3, Trophy } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import type { Locale } from '@/lib/i18n/config';

// ─── Labels ────────────────────────────────────────────────────
const L = (en: string, hi: string, ta?: string, bn?: string) => ({ en, hi, sa: hi, ta: ta ?? en, bn: bn ?? en });

const LABELS = {
  title: L(
    'Dekho Panchang vs Drik Panchang',
    'देखो पंचांग vs दृक् पंचांग',
    'டெக்கோ பஞ்சாங்கம் vs திருக் பஞ்சாங்கம்',
    'দেখো পঞ্চাঙ্গ vs দৃক পঞ্চাঙ্গ',
  ),
  subtitle: L(
    'A feature-by-feature comparison of two modern Vedic astrology platforms',
    'दो आधुनिक वैदिक ज्योतिष मंचों की सुविधा-दर-सुविधा तुलना',
    'இரண்டு நவீன வேத ஜோதிட தளங்களின் அம்ச ஒப்பீடு',
    'দুটি আধুনিক বৈদিক জ্যোতিষ প্ল্যাটফর্মের বৈশিষ্ট্য তুলনা',
  ),
  disclaimer: L(
    'This comparison is based on publicly available features as of May 2026. We respect Drik Panchang as a pioneering platform that has served millions. This page highlights differences to help users choose the right tool for their needs.',
    'यह तुलना मई 2026 तक सार्वजनिक रूप से उपलब्ध सुविधाओं पर आधारित है। हम दृक् पंचांग को एक अग्रणी मंच के रूप में सम्मान करते हैं। यह पृष्ठ उपयोगकर्ताओं को सही उपकरण चुनने में मदद करता है।',
  ),
  dekho: L('Dekho Panchang', 'देखो पंचांग'),
  drik: L('Drik Panchang', 'दृक् पंचांग'),
  feature: L('Feature', 'सुविधा', 'அம்சம்', 'বৈশিষ্ট্য'),
  tryFree: L('Try Dekho Panchang Free', 'देखो पंचांग मुफ़्त आज़माएँ', 'டெக்கோ பஞ்சாங்கத்தை இலவசமாக முயற்சிக்கவும்', 'দেখো পঞ্চাঙ্গ বিনামূল্যে চেষ্টা করুন'),
  scoreTitle: L('Feature Score', 'सुविधा स्कोर', 'அம்ச மதிப்பெண்', 'বৈশিষ্ট্য স্কোর'),
  whyTitle: L('Why Dekho Panchang?', 'देखो पंचांग क्यों?', 'ஏன் டெக்கோ பஞ்சாங்கம்?', 'কেন দেখো পঞ্চাঙ্গ?'),
  bottomLine: L(
    'Drik Panchang is a trusted reference library with 15 years of history. Dekho Panchang is the next generation — 52 features where Drik has 21, powered by Swiss Ephemeris (NASA JPL DE441), 15+ Dasha systems, 150+ Yogas, AI interpretation, 10 languages, and tools no other platform offers. Built on BPHS, Surya Siddhanta, and Muhurta Chintamani — it doesn\'t just show data, it makes Jyotish actionable for your life.',
    'दृक् पंचांग 15 वर्षों के इतिहास वाला एक विश्वसनीय संदर्भ पुस्तकालय है। देखो पंचांग अगली पीढ़ी है — जहाँ दृक् के पास 20 सुविधाएँ हैं, वहाँ देखो के पास 39, AI व्याख्या, 10 भाषाएँ, 106-मॉड्यूल शिक्षण पाठ्यक्रम, और ऐसे उपकरण जो किसी अन्य मंच पर नहीं हैं। यह केवल डेटा नहीं दिखाता — ज्योतिष को आपके जीवन के लिए कार्यशील बनाता है।',
  ),
};

// ─── Comparison rows ───────────────────────────────────────────

interface CompRow {
  feature: string;
  featureHi: string;
  dekho: string;
  drik: string;
  dekhoYes: boolean;
  drikYes: boolean;
  highlight?: boolean;
}

const ROWS: CompRow[] = [
  {
    feature: 'Personalized Tippanni (Interpretive Commentary)',
    featureHi: 'व्यक्तिगत टिप्पणी (व्याख्यात्मक भाष्य)',
    dekho: 'AI-powered narrative for YOUR chart — personality, career, relationships, remedies',
    drik: 'Generic planetary position tables without personalized interpretation',
    dekhoYes: true, drikYes: false, highlight: true,
  },
  {
    feature: 'AI Muhurta Scanner',
    featureHi: 'AI मुहूर्त स्कैनर',
    dekho: 'Ask "When should I buy a house?" — AI scans 30 days of panchang data for your best window',
    drik: 'Manual lookup of daily muhurta tables',
    dekhoYes: true, drikYes: false, highlight: true,
  },
  {
    feature: 'Dasha Synthesis & Life Timeline',
    featureHi: 'दशा संश्लेषण एवं जीवन समयरेखा',
    dekho: 'Visual timeline showing Mahadasha → Antardasha → Pratyantardasha with life-event predictions',
    drik: 'Basic Vimshottari Dasha listing',
    dekhoYes: true, drikYes: false, highlight: true,
  },
  {
    feature: 'Multilingual UI',
    featureHi: 'बहुभाषी इंटरफ़ेस',
    dekho: '10 languages: EN, HI, SA, TA, TE, BN, KN, MR, GU, Maithili — native terminology, not translated English',
    drik: '2 languages: English, Hindi — translated English feel',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Sanskrit Support',
    featureHi: 'संस्कृत समर्थन',
    dekho: 'Full Sanskrit (SA) locale with proper Devanagari rendering and shlokas',
    drik: 'No Sanskrit interface',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Panchang Accuracy',
    featureHi: 'पंचांग सटीकता',
    dekho: 'Swiss Ephemeris (NASA JPL DE441) — planetary positions to arc-seconds. Tithi transitions accurate to \u00b11-2 minutes. 5 Ayanamsha options.',
    drik: 'Established computation engine',
    dekhoYes: true, drikYes: true, highlight: true,
  },
  {
    feature: 'Birth Chart (Kundali)',
    featureHi: 'जन्म कुण्डली',
    dekho: 'North + South Indian styles, 16 Varga charts, Shadbala, Bhavabala, Avasthas, Jaimini, KP System',
    drik: 'North + South Indian basic charts, limited divisional charts',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Ashta Kuta Matching',
    featureHi: 'अष्ट कूट मिलान',
    dekho: '36-point Ashta Kuta with visual scales, partner-specific insights, dosha cancellation analysis',
    drik: 'Standard Ashta Kuta matching with score',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Yoga Detection (50+ Yogas)',
    featureHi: 'योग पहचान (50+ योग)',
    dekho: '50+ classical yogas with expected-frequency validation to prevent false positives',
    drik: 'Limited yoga listing',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Transit Playground',
    featureHi: 'गोचर खेल',
    dekho: 'Interactive transit overlay on your natal chart with slow-planet tracking',
    drik: 'Static transit tables',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Prashna (Horary)',
    featureHi: 'प्रश्न (होरारी)',
    dekho: 'KP Horary + Kerala Ashtamangala Prashna — two distinct horary systems',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Sarvatobhadra Chakra',
    featureHi: 'सर्वतोभद्र चक्र',
    dekho: 'Interactive 28-nakshatra transit analysis grid',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Varshaphal (Annual Chart)',
    featureHi: 'वर्षफल (वार्षिक कुण्डली)',
    dekho: 'Tajika system with Muntha, Sahams, and Mudda Dasha',
    drik: 'Basic Varshaphal',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Learning Curriculum',
    featureHi: 'शिक्षण पाठ्यक्रम',
    dekho: '106 structured modules across 12 phases — from beginner to advanced Jyotish',
    drik: 'Reference articles (unstructured)',
    dekhoYes: true, drikYes: false, highlight: true,
  },
  {
    feature: 'Modern UI / Mobile First',
    featureHi: 'आधुनिक UI / मोबाइल प्रथम',
    dekho: 'Dark celestial theme, responsive, animated, PWA-installable, no ads in core features',
    drik: 'Traditional layout, desktop-oriented, heavy ad placement',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Page Speed (Core Web Vitals)',
    featureHi: 'पृष्ठ गति',
    dekho: 'Next.js 16 SSR + edge caching, optimized images/fonts, minimal JS payload',
    drik: 'Legacy stack with heavier JS/ad bundles',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Open / Free Access',
    featureHi: 'मुफ़्त पहुँच',
    dekho: 'All features free — no paywall (AI calls have small daily limits)',
    drik: 'Free with ads',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Festival Calendar',
    featureHi: 'त्योहार कैलेंडर',
    dekho: 'Festivals with puja vidhi, regional variants, Amanta/Purnimanta toggle',
    drik: 'Comprehensive festival calendar — larger database, more years of historical data',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Devotional Library (55+ Texts)',
    featureHi: 'भक्ति पुस्तकालय (55+ पाठ)',
    dekho: '55+ sacred texts — Devanagari + transliteration + meaning',
    drik: 'Aarti & Chalisa collection (text only)',
    dekhoYes: true, drikYes: true, highlight: true,
  },
  {
    feature: 'Chandrabalam / Tarabalam Daily',
    featureHi: 'चन्द्रबल / ताराबल दैनिक',
    dekho: 'Personalized Moon/Star strength with birth data integration',
    drik: 'Basic Chandrabalam/Tarabalam lookup',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Premium PDF Kundali Report',
    featureHi: 'प्रीमियम PDF कुण्डली रिपोर्ट',
    dekho: '12-section professional report — personality, yogas, doshas, dashas, Nadi Amsha, remedies',
    drik: 'Basic chart printout',
    dekhoYes: true, drikYes: false, highlight: true,
  },
  {
    feature: 'Transit Articles with Moon-Sign Effects',
    featureHi: 'गोचर लेख — चन्द्र राशि प्रभाव सहित',
    dekho: '4 editorial transit articles — Jupiter, Rahu, Ketu with 12 Moon-sign interpretations',
    drik: 'Transit dates only, no interpretation',
    dekhoYes: true, drikYes: false, highlight: true,
  },
  {
    feature: 'Transit Swimlane Timeline',
    featureHi: 'गोचर स्विमलेन टाइमलाइन',
    dekho: 'Visual horizontal swimlane showing all planetary transits for the year',
    drik: 'Basic transit date list',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Nadi Amsha (D-150) with Karmic Synthesis',
    featureHi: 'नाड़ी अंश (D-150) कर्मिक संश्लेषण सहित',
    dekho: 'D-150 chart with karmic narrative, soul purpose, strengths/challenges, 150 Nadi reference',
    drik: 'Not available',
    dekhoYes: true, drikYes: false, highlight: true,
  },
  {
    feature: 'Vrat Katha (Sacred Stories)',
    featureHi: 'व्रत कथा (पवित्र कहानियाँ)',
    dekho: '10 complete vrat stories in Hindi + English',
    drik: 'Vrat Katha collection',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'ISKCON Vaishnava Calendar',
    featureHi: 'इस्कॉन वैष्णव कैलेंडर',
    dekho: 'Gaurabda calendar with Maha Dvadashi rules + acharya dates',
    drik: 'ISKCON calendar',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Panchak & Holashtak Detection',
    featureHi: 'पंचक एवं होलाष्टक पहचान',
    dekho: 'Live detection with warnings on panchang page + dedicated tool pages + learn pages',
    drik: 'Panchak dates page',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Chandra Darshan (Moon Sighting)',
    featureHi: 'चन्द्र दर्शन',
    dekho: 'Moon visibility calculator with Yallop model + upcoming dates',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Special Auspicious Yogas Display',
    featureHi: 'विशेष शुभ योग प्रदर्शन',
    dekho: '7 special yogas highlighted on panchang — Sarvartha Siddhi, Amrit Siddhi, Guru Pushya, etc.',
    drik: 'Listed but not highlighted prominently',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Ganda Mool Dates',
    featureHi: 'गण्ड मूल तिथियाँ',
    dekho: 'Full year calendar with computed Moon nakshatra transition times',
    drik: 'Ganda Mool dates page',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Rudraksha Calculator',
    featureHi: 'रुद्राक्ष कैलकुलेटर',
    dekho: 'Birth chart-based Rudraksha recommendation with mantras + care guide',
    drik: 'Rudraksha calculator',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Embeddable Temple Widget',
    featureHi: 'मन्दिर विजेट (एम्बेड)',
    dekho: 'Free iframe widget for temple websites with city panchang',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Auto Twitter / Social Posting',
    featureHi: 'स्वचालित ट्विटर / सोशल पोस्टिंग',
    dekho: 'Daily rotating content — panchang, nakshatra, yoga, transit, matching tips',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Instagram Image Generation',
    featureHi: 'इंस्टाग्राम छवि निर्माण',
    dekho: 'API-generated 1080x1080 panchang cards, nakshatra spotlights, Moon sign carousels',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'WhatsApp Sharing',
    featureHi: 'व्हाट्सएप शेयरिंग',
    dekho: 'Pre-composed WhatsApp share on festivals, panchang, matching with context',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'PWA with Offline Panchang',
    featureHi: 'PWA ऑफ़लाइन पंचांग सहित',
    dekho: 'Installable app, offline cached panchang, home screen shortcuts',
    drik: 'Native apps (iOS/Android) — no PWA',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Horoscope with Transit Impact + Remedies',
    featureHi: 'राशिफल — गोचर प्रभाव एवं उपाय सहित',
    dekho: 'Daily/weekly/monthly with transit positions, dos/don\'ts, remedies, compatibility',
    drik: 'Basic daily rashifal',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Family Command Center',
    featureHi: 'परिवार कमांड सेंटर',
    dekho: 'Multi-chart family dashboard with transit impact per member',
    drik: 'Not available',
    dekhoYes: true, drikYes: false, highlight: true,
  },
  {
    feature: 'KP System (Krishnamurti Paddhati)',
    featureHi: 'केपी पद्धति (कृष्णमूर्ति)',
    dekho: 'Full Placidus houses, sub-lord table, significators, ruling planets',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Jaimini System',
    featureHi: 'जैमिनी पद्धति',
    dekho: 'Chara Karakas, Argala, Jaimini aspects, Chara Dasha with interpretations',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: '15+ Dasha Systems',
    featureHi: '15+ दशा पद्धतियाँ',
    dekho: 'Vimshottari, Yogini, Chara, Narayana, Shoola, Kalachakra, Sudarshana, and 8 more',
    drik: 'Vimshottari only',
    dekhoYes: true, drikYes: true, highlight: true,
  },
  {
    feature: 'Financial Astrology',
    featureHi: 'वित्तीय ज्योतिष',
    dekho: 'Market cycles, planetary indicators, investment windows',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Medical Astrology',
    featureHi: 'चिकित्सा ज्योतिष',
    dekho: 'Body-planet-disease mapping, health vulnerability analysis',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Mundane Astrology',
    featureHi: 'मुण्डन ज्योतिष',
    dekho: 'Nation/weather/political predictions, ingress charts',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Shadbala + Bhavabala + Ashtakavarga Visuals',
    featureHi: 'षड्बल + भावबल + अष्टकवर्ग दृश्य',
    dekho: 'Color-coded progress bars, SAV heatmap, strength rankings',
    drik: 'Not available',
    dekhoYes: true, drikYes: false, highlight: true,
  },
  {
    feature: 'Live Sky Map / Planisphere',
    featureHi: 'जीवित आकाश मानचित्र',
    dekho: 'Real-time celestial visualization with ecliptic, constellations, planet positions',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Dosha Cancellation Analysis',
    featureHi: 'दोष निवारण विश्लेषण',
    dekho: 'Mangal, Kaal Sarpa, Pitra — shows which cancellation conditions are met',
    drik: 'Basic dosha detection only',
    dekhoYes: true, drikYes: true,
  },
  {
    feature: 'Birth Time Rectification',
    featureHi: 'जन्म समय शोधन',
    dekho: 'Algorithmic birth time correction tool',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Interactive Learning Labs',
    featureHi: 'इंटरैक्टिव शिक्षण प्रयोगशाला',
    dekho: '5 simulators — Panchang, Moon phases, Dasha, Shadbala, KP',
    drik: 'Not available',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: 'Precomputed Tithi Tables',
    featureHi: 'पूर्व-गणित तिथि सारणियाँ',
    dekho: '168 JSON files — 55 cities \u00d7 3 years. Instant panchang, no computation delay.',
    drik: 'Server-computed each request',
    dekhoYes: true, drikYes: false,
  },
  {
    feature: '150+ Yoga Detection',
    featureHi: '150+ योग पहचान',
    dekho: '150+ yogas with interpretations, strength ratings, and frequency analysis',
    drik: 'Basic yoga listing',
    dekhoYes: true, drikYes: true, highlight: true,
  },
  {
    feature: 'Years of Data / Trust',
    featureHi: 'डेटा के वर्ष / विश्वास',
    dekho: 'Launched 2026 — built on Swiss Ephemeris (est. 1997) and classical shastras (2000+ years)',
    drik: '15+ years of platform trust',
    dekhoYes: true, drikYes: true,
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
    title: 'AI-Powered Interpretation',
    titleHi: 'AI-संचालित व्याख्या',
    body: 'Your chart isn\'t just calculated — it\'s interpreted. Our Tippanni engine generates narrative commentary on your personality, dashas, yogas, and life areas.',
    bodyHi: 'आपकी कुण्डली केवल गणना नहीं — व्याख्या की जाती है। हमारा टिप्पणी इंजन आपके व्यक्तित्व, दशा, योग और जीवन क्षेत्रों पर विवरणात्मक भाष्य तैयार करता है।',
  },
  {
    icon: Sparkles,
    title: 'Ask Questions, Get Answers',
    titleHi: 'प्रश्न पूछें, उत्तर पाएँ',
    body: '"When should I start my business?" — our Muhurta AI scans 30 days of panchang data and returns ranked auspicious windows specific to your activity.',
    bodyHi: '"मैं अपना व्यवसाय कब शुरू करूँ?" — हमारा मुहूर्त AI 30 दिनों के पंचांग डेटा को स्कैन करता है और आपकी गतिविधि के लिए शुभ समय बताता है।',
  },
  {
    icon: Globe,
    title: '10 Languages, Native Feel',
    titleHi: '10 भाषाएँ, मूल अनुभव',
    body: 'Not "translated English" — proper terminology in Sanskrit, Tamil, Bengali, Kannada, Maithili, and more. Even URLs use native transliteration.',
    bodyHi: '"अनुवादित अंग्रेज़ी" नहीं — संस्कृत, तमिल, बांग्ला, कन्नड़, मैथिली आदि में उचित शब्दावली। URL भी देशी लिप्यंतरण में हैं।',
  },
  {
    icon: BookOpen,
    title: '106-Module Learning Path',
    titleHi: '106-मॉड्यूल शिक्षण पथ',
    body: 'From "What is a Tithi?" to advanced Jaimini Chara Dasha — structured learning with progress tracking, spaced repetition, and interactive labs.',
    bodyHi: '"तिथि क्या है?" से लेकर उन्नत जैमिनी चर दशा तक — प्रगति ट्रैकिंग, स्पेस्ड रिपिटिशन और इंटरैक्टिव लैब्स के साथ संरचित शिक्षण।',
  },
  {
    icon: Palette,
    title: 'Beautiful, Modern Experience',
    titleHi: 'सुन्दर, आधुनिक अनुभव',
    body: 'Dark celestial theme, smooth animations, installable PWA, zero ads in core features. Designed for the modern seeker, not a 2010s web directory.',
    bodyHi: 'अंधकार-युक्त खगोलीय थीम, सुचारू एनिमेशन, इंस्टॉल करने योग्य PWA, मुख्य सुविधाओं में शून्य विज्ञापन। आधुनिक साधक के लिए डिज़ाइन किया गया।',
  },
  {
    icon: Shield,
    title: 'Verified Accuracy',
    titleHi: 'सत्यापित सटीकता',
    body: 'Built on Swiss Ephemeris (NASA JPL DE441) — the gold standard for astronomical computation. Planetary positions accurate to arc-seconds. Tithi, nakshatra, yoga, and sunrise verified across 3+ timezones. Classical foundations: BPHS, Surya Siddhanta, Muhurta Chintamani.',
    bodyHi: 'स्विस एफेमेरिस (NASA JPL DE441) पर निर्मित — खगोलीय गणना का स्वर्ण मानक। ग्रह स्थितियाँ आर्क-सेकंड तक सटीक। तिथि, नक्षत्र, योग और सूर्योदय 3+ समय क्षेत्रों में सत्यापित। शास्त्रीय आधार: बृहत् पराशर होरा शास्त्र, सूर्य सिद्धांत, मुहूर्त चिंतामणि।',
  },
];

// ─── Animation ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function VsDrikPanchangPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const isTa = locale === 'ta';
  const isBn = locale === 'bn';

  const t = (obj: Record<string, string>) =>
    isTa ? (obj.ta ?? obj.en) : isBn ? (obj.bn ?? obj.en) : isDevanagari ? obj.hi : obj.en;

  const headingFont = { fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' };

  // JSON-LD
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/vs/drik-panchang`, locale);
  const comparisonLD = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Dekho Panchang vs Drik Panchang — Feature Comparison',
    description: 'Objective feature comparison between Dekho Panchang and Drik Panchang — two Vedic astrology platforms.',
    url: `https://dekhopanchang.com/${locale}/vs/drik-panchang`,
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
        {(() => {
          const dekhoCount = ROWS.filter(r => r.dekhoYes).length;
          const drikCount = ROWS.filter(r => r.drikYes).length;
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
                <span className="text-text-secondary font-bold text-lg">{drikCount}</span>
                <span className="text-text-secondary text-sm">{t(LABELS.drik)}</span>
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
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[2fr_3fr_3fr] gap-0 border-b border-gold-primary/20">
            <div className="px-4 py-3 text-xs font-semibold text-gold-dark uppercase tracking-wider">
              {t(LABELS.feature)}
            </div>
            <div className="px-4 py-3 text-xs font-semibold text-gold-light uppercase tracking-wider text-center border-l border-gold-primary/10">
              {t(LABELS.dekho)}
            </div>
            <div className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center border-l border-gold-primary/10">
              {t(LABELS.drik)}
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
              {/* Feature name */}
              <div className="px-4 py-3 flex items-start">
                <span className={`text-sm font-medium ${row.highlight ? 'text-gold-light' : 'text-text-primary'}`}>
                  {isDevanagari ? row.featureHi : row.feature}
                  {row.highlight && <Sparkles size={12} className="inline ml-1 text-gold-primary" />}
                </span>
              </div>

              {/* Dekho column */}
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

              {/* Drik column */}
              <div className="px-4 py-3 border-l border-white/5">
                <div className="flex items-start gap-2">
                  {row.drikYes ? (
                    <Check size={16} className="text-emerald-400/60 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X size={16} className="text-red-400/40 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs text-text-secondary leading-relaxed">{row.drik}</span>
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

        <ShareRow pageTitle="Dekho Panchang vs Drik Panchang" locale={locale} />
      </div>
    </main>
  );
}
