'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ChevronRight, Diamond, BookOpen, ExternalLink } from 'lucide-react';
import type { Locale } from '@/types/panchang';

type Tri = { en: string; hi: string; sa: string };
interface Section {
  id: string;
  icon: string;
  title: Tri;
  subtitle: Tri;
  modules: { id: string; title: Tri }[];
  refs: { label: Tri; href: string }[];
}

const SECTIONS: Section[] = [
  {
    id: 'basics', icon: '\u25C7',
    title: { en: 'Chart Basics', hi: 'कुण्डली मूल', sa: 'कुण्डलीमूलम्' },
    subtitle: { en: 'Understanding the Birth Chart', hi: 'जन्म कुण्डली को समझना', sa: 'जन्मकुण्डलीं अवगच्छतु' },
    modules: [
      { id: '0-5', title: { en: 'What is a Kundali (Birth Chart)?', hi: 'कुण्डली क्या है?', sa: 'कुण्डली किम्?' } },
      { id: '9-1', title: { en: 'What is a Birth Chart?', hi: 'जन्म कुण्डली क्या है?', sa: 'जन्मकुण्डली किम्?' } },
      { id: '9-2', title: { en: 'Houses (Bhavas) \u2014 12 Life Areas', hi: 'भाव \u2014 12 जीवन क्षेत्र', sa: 'भावाः \u2014 12 जीवनक्षेत्राणि' } },
      { id: '9-3', title: { en: 'Planetary Dignities in the Chart', hi: 'कुण्डली में ग्रह गरिमा', sa: 'कुण्डल्यां ग्रहगरिमा' } },
      { id: '9-4', title: { en: 'Chart Interpretation Framework', hi: 'कुण्डली व्याख्या ढाँचा', sa: 'कुण्डलीव्याख्याढाञ्चः' } },
    ],
    refs: [
      { label: { en: 'Kundali', hi: 'कुण्डली', sa: 'कुण्डली' }, href: '/learn/kundali' },
      { label: { en: 'Bhavas', hi: 'भाव', sa: 'भावाः' }, href: '/learn/bhavas' },
      { label: { en: 'Lagna', hi: 'लग्न', sa: 'लग्नम्' }, href: '/learn/lagna' },
    ],
  },
  {
    id: 'planets-chart', icon: '\u2609',
    title: { en: 'Planets in the Chart', hi: 'कुण्डली में ग्रह', sa: 'कुण्डल्यां ग्रहाः' },
    subtitle: { en: 'Placement & Influence', hi: 'स्थान एवं प्रभाव', sa: 'स्थानं प्रभावश्च' },
    modules: [],
    refs: [
      { label: { en: 'Planets', hi: 'ग्रह विवरण', sa: 'ग्रहविवरणम्' }, href: '/learn/planets' },
      { label: { en: 'Planet in House', hi: 'भाव में ग्रह', sa: 'भावे ग्रहः' }, href: '/learn/planet-in-house' },
      { label: { en: 'Aspects', hi: 'दृष्टि', sa: 'दृष्टिः' }, href: '/learn/aspects' },
    ],
  },
  {
    id: 'vargas', icon: '\u25A8',
    title: { en: 'Divisional Charts (Vargas)', hi: 'वर्ग कुण्डली', sa: 'वर्गकुण्डल्यः' },
    subtitle: { en: 'The 16 Sub-Divisions', hi: '16 उपविभाग', sa: '16 उपविभागाः' },
    modules: [
      { id: '10-1', title: { en: 'Varga Charts \u2014 Why & How', hi: 'वर्ग कुण्डली \u2014 क्यों एवं कैसे', sa: 'वर्गकुण्डल्यः \u2014 कथं किमर्थं च' } },
      { id: '10-2', title: { en: 'Navamsha (D9) Deep Dive', hi: 'नवांश (D9) विस्तृत', sa: 'नवांशः (D9) विस्तृतम्' } },
      { id: '10-3', title: { en: 'Dasamsha, Saptamsha & More', hi: 'दशमांश, सप्तमांश आदि', sa: 'दशमांशः, सप्तमांशः इत्यादि' } },
    ],
    refs: [
      { label: { en: 'Vargas', hi: 'वर्ग', sa: 'वर्गाः' }, href: '/learn/vargas' },
    ],
  },
  {
    id: 'dashas', icon: '\u23F3',
    title: { en: 'Timing (Dashas)', hi: 'दशा (समय)', sa: 'दशाः (समयः)' },
    subtitle: { en: 'The Planetary Periods', hi: 'ग्रह काल', sa: 'ग्रहकालाः' },
    modules: [
      { id: '11-1', title: { en: 'Vimshottari \u2014 The 120-Year Cycle', hi: 'विंशोत्तरी \u2014 120 वर्ष चक्र', sa: 'विंशोत्तरी \u2014 120 वर्षचक्रम्' } },
      { id: '11-2', title: { en: 'Yogini & Char Dasha', hi: 'योगिनी एवं चर दशा', sa: 'योगिनी चरदशा च' } },
      { id: '11-3', title: { en: 'Dasha-Transit Overlay', hi: 'दशा-गोचर सम्मिश्रण', sa: 'दशागोचरसम्मिश्रणम्' } },
    ],
    refs: [
      { label: { en: 'Dashas', hi: 'दशाएँ', sa: 'दशाः' }, href: '/learn/dashas' },
    ],
  },
  {
    id: 'transits', icon: '\u27A4',
    title: { en: 'Transits (Gochar)', hi: 'गोचर', sa: 'गोचरः' },
    subtitle: { en: 'Current Planetary Positions', hi: 'वर्तमान ग्रह स्थिति', sa: 'वर्तमानग्रहस्थितिः' },
    modules: [
      { id: '12-1', title: { en: 'How Transits Work', hi: 'गोचर कैसे काम करता', sa: 'गोचरः कथं कार्यं करोति' } },
      { id: '12-2', title: { en: 'Sade Sati \u2014 Saturn\'s 7.5 Years', hi: 'साढ़े साती', sa: 'साढेसाती' } },
      { id: '12-3', title: { en: 'Jupiter & Rahu-Ketu Transit', hi: 'गुरु एवं राहु-केतु गोचर', sa: 'गुरुराहुकेतुगोचरः' } },
    ],
    refs: [
      { label: { en: 'Gochar', hi: 'गोचर', sa: 'गोचरः' }, href: '/learn/gochar' },
      { label: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साढेसाती' }, href: '/learn/sade-sati' },
      { label: { en: 'Transit Guide', hi: 'गोचर मार्गदर्शिका', sa: 'गोचरमार्गदर्शिका' }, href: '/learn/transit-guide' },
    ],
  },
  {
    id: 'yogas-doshas', icon: '\u2721',
    title: { en: 'Yogas & Doshas', hi: 'योग एवं दोष', sa: 'योगाः दोषाश्च' },
    subtitle: { en: 'Combinations & Afflictions', hi: 'संयोग एवं दोष', sa: 'संयोगाः दोषाश्च' },
    modules: [
      { id: '13-1', title: { en: 'Planetary Yogas \u2014 Raja, Dhana, Arishta', hi: 'ग्रह योग \u2014 राज, धन, अरिष्ट', sa: 'ग्रहयोगाः \u2014 राज, धन, अरिष्ट' } },
      { id: '13-2', title: { en: 'Wealth & Health Yogas', hi: 'धन एवं स्वास्थ्य योग', sa: 'धनस्वास्थ्ययोगाः' } },
      { id: '13-3', title: { en: 'Dosha Detection & Cancellation', hi: 'दोष पहचान एवं शमन', sa: 'दोषपहचानम् शमनं च' } },
    ],
    refs: [
      { label: { en: 'Yogas', hi: 'योग', sa: 'योगाः' }, href: '/learn/yogas' },
      { label: { en: 'Doshas', hi: 'दोष', sa: 'दोषाः' }, href: '/learn/doshas' },
    ],
  },
  {
    id: 'strength', icon: '\u{1F4AA}',
    title: { en: 'Strength Analysis', hi: 'बल विश्लेषण', sa: 'बलविश्लेषणम्' },
    subtitle: { en: 'Quantifying Planetary Power', hi: 'ग्रह शक्ति का मापन', sa: 'ग्रहशक्तिमापनम्' },
    modules: [
      { id: '18-1', title: { en: 'Shadbala \u2014 6-Fold Strength', hi: 'षड्बल \u2014 छह प्रकार का बल', sa: 'षड्बलम्' } },
      { id: '18-2', title: { en: 'Bhavabala \u2014 House Strength', hi: 'भावबल \u2014 भाव शक्ति', sa: 'भावबलम्' } },
      { id: '18-3', title: { en: 'Ashtakavarga \u2014 Bindu Scoring', hi: 'अष्टकवर्ग \u2014 बिन्दु अंक', sa: 'अष्टकवर्गः' } },
      { id: '18-4', title: { en: 'Avasthas \u2014 Planetary States', hi: 'अवस्थाएँ \u2014 ग्रह दशाएँ', sa: 'अवस्थाः' } },
      { id: '18-5', title: { en: 'Vimshopaka \u2014 20-Point Varga Strength', hi: 'विंशोपक बल', sa: 'विंशोपकबलम्' } },
    ],
    refs: [
      { label: { en: 'Shadbala', hi: 'षड्बल', sa: 'षड्बलम्' }, href: '/learn/shadbala' },
      { label: { en: 'Bhavabala', hi: 'भावबल', sa: 'भावबलम्' }, href: '/learn/bhavabala' },
      { label: { en: 'Avasthas', hi: 'अवस्था', sa: 'अवस्थाः' }, href: '/learn/avasthas' },
      { label: { en: 'Sphutas', hi: 'स्फुट', sa: 'स्फुटाः' }, href: '/learn/sphutas' },
      { label: { en: 'Ashtakavarga', hi: 'अष्टकवर्ग', sa: 'अष्टकवर्गः' }, href: '/learn/ashtakavarga' },
    ],
  },
  {
    id: 'jaimini', icon: '\u{1F52E}',
    title: { en: 'Jaimini System', hi: 'जैमिनी पद्धति', sa: 'जैमिनीपद्धतिः' },
    subtitle: { en: 'Sign-Based Astrology', hi: 'राशि-आधारित ज्योतिष', sa: 'राश्याधारितज्योतिषम्' },
    modules: [
      { id: '19-1', title: { en: 'Chara Karakas \u2014 7 Variable Significators', hi: 'चर कारक', sa: 'चरकारकाः' } },
      { id: '19-2', title: { en: 'Rashi Drishti \u2014 Sign-Based Aspects', hi: 'राशि दृष्टि', sa: 'राशिदृष्टिः' } },
      { id: '19-3', title: { en: 'Argala \u2014 Intervention System', hi: 'अर्गला \u2014 हस्तक्षेप पद्धति', sa: 'अर्गला' } },
      { id: '19-4', title: { en: 'Special Lagnas \u2014 Hora, Ghati, Varnada', hi: 'विशेष लग्न', sa: 'विशेषलग्नानि' } },
    ],
    refs: [
      { label: { en: 'Jaimini', hi: 'जैमिनी', sa: 'जैमिनी' }, href: '/learn/jaimini' },
      { label: { en: 'Argala', hi: 'अर्गला', sa: 'अर्गला' }, href: '/learn/argala' },
    ],
  },
  {
    id: 'advanced-systems', icon: '\u2699',
    title: { en: 'Advanced Systems', hi: 'उन्नत पद्धतियाँ', sa: 'उन्नतपद्धतयः' },
    subtitle: { en: 'KP System & Varshaphal', hi: 'केपी पद्धति एवं वर्षफल', sa: 'केपीपद्धतिः वर्षफलं च' },
    modules: [
      { id: '20-1', title: { en: 'Placidus Houses', hi: 'प्लेसिडस भाव', sa: 'प्लेसिडसभावाः' } },
      { id: '20-2', title: { en: '249 Sub-Lord Table', hi: '249 उप-स्वामी तालिका', sa: '249 उपस्वामिसारणी' } },
      { id: '20-3', title: { en: 'Significators \u2014 4-Level System', hi: 'कारक \u2014 चतुर्स्तर', sa: 'कारकाः \u2014 चतुर्स्तराः' } },
      { id: '20-4', title: { en: 'Ruling Planets \u2014 Timing Method', hi: 'शासक ग्रह \u2014 समय विधि', sa: 'शासकग्रहाः \u2014 समयविधिः' } },
      { id: '21-1', title: { en: 'Tajika Aspects', hi: 'ताजिक दृष्टि', sa: 'ताजिकदृष्टिः' } },
      { id: '21-2', title: { en: 'Sahams \u2014 Sensitive Points', hi: 'सहम \u2014 संवेदनशील बिन्दु', sa: 'सहमाः' } },
      { id: '21-3', title: { en: 'Mudda Dasha', hi: 'मुद्दा दशा', sa: 'मुद्दादशा' } },
      { id: '21-4', title: { en: 'Tithi Pravesha \u2014 Birthday Chart', hi: 'तिथि प्रवेश', sa: 'तिथिप्रवेशः' } },
    ],
    refs: [
      { label: { en: 'Advanced', hi: 'उन्नत', sa: 'उन्नतम्' }, href: '/learn/advanced' },
    ],
  },
  {
    id: 'prediction-guides', icon: '\u{1F3AF}',
    title: { en: 'Prediction Guides', hi: 'भविष्यवाणी मार्गदर्शिका', sa: 'भविष्यवाणीमार्गदर्शिका' },
    subtitle: { en: 'Life Area Analysis', hi: 'जीवन क्षेत्र विश्लेषण', sa: 'जीवनक्षेत्रविश्लेषणम्' },
    modules: [],
    refs: [
      { label: { en: 'Career', hi: 'करियर', sa: 'वृत्तिः' }, href: '/learn/career' },
      { label: { en: 'Marriage', hi: 'विवाह', sa: 'विवाहः' }, href: '/learn/marriage' },
      { label: { en: 'Wealth', hi: 'धन', sa: 'धनम्' }, href: '/learn/wealth' },
      { label: { en: 'Health', hi: 'स्वास्थ्य', sa: 'स्वास्थ्यम्' }, href: '/learn/health' },
      { label: { en: 'Children', hi: 'सन्तान', sa: 'सन्तानम्' }, href: '/learn/children' },
    ],
  },
  {
    id: 'matching', icon: '\u2764',
    title: { en: 'Matching & Compatibility', hi: 'मिलान एवं अनुकूलता', sa: 'मेलनम् अनुकूलता च' },
    subtitle: { en: 'Kundali Milan', hi: 'कुण्डली मिलान', sa: 'कुण्डलीमेलनम्' },
    modules: [
      { id: '14-1', title: { en: 'Kundali Milan \u2014 8-Factor Matching', hi: 'कुण्डली मिलान \u2014 अष्ट कूट', sa: 'कुण्डलीमेलनम् \u2014 अष्टकूटम्' } },
      { id: '14-2', title: { en: 'Mangal Dosha in Marriage', hi: 'विवाह में मंगल दोष', sa: 'विवाहे मङ्गलदोषः' } },
      { id: '14-3', title: { en: 'Timing Marriage Events', hi: 'विवाह समय निर्धारण', sa: 'विवाहसमयनिर्धारणम्' } },
    ],
    refs: [
      { label: { en: 'Matching', hi: 'मिलान', sa: 'मेलनम्' }, href: '/learn/matching' },
      { label: { en: 'Compatibility', hi: 'अनुकूलता', sa: 'अनुकूलता' }, href: '/learn/compatibility' },
    ],
  },
  {
    id: 'remedies', icon: '\u{1F48E}',
    title: { en: 'Remedies', hi: 'उपाय', sa: 'उपायाः' },
    subtitle: { en: 'Gemstones, Mantras & Charity', hi: 'रत्न, मन्त्र एवं दान', sa: 'रत्नानि मन्त्राः दानं च' },
    modules: [
      { id: '15-1', title: { en: 'Gemstones (Ratna Shastra)', hi: 'रत्न शास्त्र', sa: 'रत्नशास्त्रम्' } },
      { id: '15-2', title: { en: 'Mantras, Pujas & Charity', hi: 'मंत्र, पूजा एवं दान', sa: 'मन्त्राः, पूजाः, दानं च' } },
    ],
    refs: [
      { label: { en: 'Remedies', hi: 'उपाय', sa: 'उपायाः' }, href: '/learn/remedies' },
      { label: { en: 'Advanced Houses', hi: 'उन्नत भाव', sa: 'उन्नतभावाः' }, href: '/learn/advanced-houses' },
    ],
  },
  {
    id: 'computational', icon: '\u{1F9EE}',
    title: { en: 'Computational Astronomy', hi: 'गणनात्मक खगोल', sa: 'गणनात्मकखगोलम्' },
    subtitle: { en: 'How Our Engine Works', hi: 'हमारा इंजन कैसे काम करता', sa: 'अस्माकं यन्त्रं कथं कार्यं करोति' },
    modules: [
      { id: '22-1', title: { en: 'Julian Day \u2014 Universal Clock', hi: 'जूलियन दिन', sa: 'जूलियनदिनम्' } },
      { id: '22-2', title: { en: 'Finding the Sun \u2014 Meeus Algorithm', hi: 'सूर्य खोज \u2014 Meeus गणित', sa: 'सूर्यान्वेषणम्' } },
      { id: '22-3', title: { en: 'Finding the Moon \u2014 60 Sine Terms', hi: 'चन्द्र खोज \u2014 60 ज्या पद', sa: 'चन्द्रान्वेषणम्' } },
      { id: '22-4', title: { en: 'Sunrise \u2014 2-Pass Algorithm', hi: 'सूर्योदय \u2014 द्विचरणीय गणना', sa: 'सूर्योदयगणना' } },
      { id: '22-5', title: { en: 'Moonrise \u2014 Parallax & Binary Search', hi: 'चन्द्रोदय \u2014 लम्बन एवं द्विभाजन', sa: 'चन्द्रोदयगणना' } },
      { id: '22-6', title: { en: 'Equation of Time', hi: 'समय समीकरण', sa: 'समयसमीकरणम्' } },
    ],
    refs: [
      { label: { en: 'Calculations', hi: 'गणना', sa: 'गणनापद्धतिः' }, href: '/learn/calculations' },
    ],
  },
  {
    id: 'predictive', icon: '\u{1F52D}',
    title: { en: 'Predictive Techniques', hi: 'भविष्यवाणी तकनीक', sa: 'भविष्यवाणीतन्त्रम्' },
    subtitle: { en: 'Eclipse, Retrograde & Advanced', hi: 'ग्रहण, वक्री एवं उन्नत', sa: 'ग्रहणम्, वक्री, उन्नतं च' },
    modules: [
      { id: '23-1', title: { en: 'Eclipse Prediction', hi: 'ग्रहण भविष्यवाणी', sa: 'ग्रहणभविष्यवाणी' } },
      { id: '23-2', title: { en: 'Retrograde & Combustion', hi: 'वक्री एवं अस्त', sa: 'वक्री अस्तं च' } },
      { id: '23-3', title: { en: 'Chakra Systems', hi: 'चक्र पद्धतियाँ', sa: 'चक्रपद्धतयः' } },
      { id: '23-4', title: { en: 'Sphutas \u2014 Yogi & Avayogi', hi: 'स्फुट \u2014 योगी एवं अवयोगी', sa: 'स्फुटाः' } },
      { id: '23-5', title: { en: 'Prashna Yogas', hi: 'प्रश्न योग', sa: 'प्रश्नयोगाः' } },
    ],
    refs: [
      { label: { en: 'Combustion', hi: 'अस्त', sa: 'अस्तम्' }, href: '/learn/combustion' },
      { label: { en: 'Retrograde Effects', hi: 'वक्री प्रभाव', sa: 'वक्रीप्रभावाः' }, href: '/learn/retrograde-effects' },
    ],
  },
  {
    id: 'labs', icon: '\u2699',
    title: { en: 'Interactive Labs', hi: 'इंटरैक्टिव प्रयोगशाला', sa: 'अन्तरक्रियात्मकप्रयोगशाला' },
    subtitle: { en: 'Hands-On Practice', hi: 'प्रायोगिक अभ्यास', sa: 'प्रायोगिकाभ्यासः' },
    modules: [],
    refs: [
      { label: { en: 'Compute Your Panchang', hi: 'अपना पंचांग गणना करें', sa: 'स्वपञ्चाङ्गं गणयतु' }, href: '/learn/labs/panchang' },
      { label: { en: 'Trace Your Moon', hi: 'अपना चन्द्र खोजें', sa: 'स्वचन्द्रम् अन्विष्यतु' }, href: '/learn/labs/moon' },
      { label: { en: 'Your Dasha Timeline', hi: 'आपकी दशा समयरेखा', sa: 'भवतः दशासमयरेखा' }, href: '/learn/labs/dasha' },
      { label: { en: 'Shadbala Breakdown', hi: 'षड्बल विश्लेषण', sa: 'षड्बलविश्लेषणम्' }, href: '/learn/labs/shadbala' },
      { label: { en: 'KP Sub-Lord Lookup', hi: 'केपी उप-स्वामी खोज', sa: 'केपी उपस्वामिखोजः' }, href: '/learn/labs/kp' },
    ],
  },
];

const L = {
  en: {
    badge: 'Track 3',
    title: 'Kundali \u2014 Your Personal Cosmic Map',
    sub: 'From birth chart basics to advanced predictive techniques \u2014 the most comprehensive track',
    startHere: 'Start Here',
    modules: 'modules',
    deepDive: 'Deep Dive',
    backToLearn: 'All Tracks',
    refsOnly: 'Reference pages',
    labLink: 'Lab',
  },
  hi: {
    badge: 'ट्रैक 3',
    title: 'कुण्डली \u2014 आपका ब्रह्माण्डीय मानचित्र',
    sub: 'जन्म कुण्डली की मूल बातों से उन्नत भविष्यवाणी तकनीकों तक \u2014 सबसे व्यापक ट्रैक',
    startHere: 'यहाँ से शुरू करें',
    modules: 'मॉड्यूल',
    deepDive: 'गहन अध्ययन',
    backToLearn: 'सभी ट्रैक',
    refsOnly: 'संदर्भ पृष्ठ',
    labLink: 'प्रयोगशाला',
  },
  sa: {
    badge: 'मार्गः 3',
    title: 'कुण्डली \u2014 भवतः ब्रह्माण्डीयमानचित्रम्',
    sub: 'जन्मकुण्डलीमूलेभ्यः उन्नतभविष्यवाणीतन्त्रपर्यन्तम् \u2014 सर्वाधिकव्यापकमार्गः',
    startHere: 'अत्र आरभतु',
    modules: 'मॉड्यूलाः',
    deepDive: 'गहनाध्ययनम्',
    backToLearn: 'सर्वे मार्गाः',
    refsOnly: 'सन्दर्भपृष्ठानि',
    labLink: 'प्रयोगशाला',
  },
};

export default function KundaliTrackPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const l = L[locale] || L.en;

  return (
    <div>
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-950/90 via-teal-950/70 to-green-950/90 p-8 sm:p-10 mb-10"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-teal-500/8 blur-3xl" />

        <div className="relative z-10">
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-emerald-300/70 hover:text-emerald-200 text-xs uppercase tracking-wider mb-6 transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" />
            {l.backToLearn}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Diamond className="w-6 h-6 text-emerald-300" />
            <span className="text-emerald-300 text-xs uppercase tracking-widest font-bold">{l.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3" style={hf}>
            {l.title}
          </h1>
          <p className="text-emerald-200/60 text-lg max-w-2xl mb-8" style={bf}>{l.sub}</p>

          <Link
            href="/learn/modules/0-5"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors"
            style={hf}
          >
            {l.startHere}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* ── Sections ── */}
      <div className="space-y-8">
        {SECTIONS.map((section, si) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.04 }}
            className="rounded-2xl border border-emerald-500/15 bg-emerald-950/20 overflow-hidden"
          >
            {/* Section header */}
            <div className="px-6 py-4 border-b border-emerald-500/10 flex items-center gap-3">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h2 className="text-lg font-bold text-white" style={hf}>{section.title[locale]}</h2>
                <span className="text-emerald-300/50 text-xs uppercase tracking-wider" style={bf}>{section.subtitle[locale]}</span>
              </div>
              {section.modules.length > 0 && (
                <span className="ml-auto text-emerald-400/40 text-xs font-mono">{section.modules.length} {l.modules}</span>
              )}
              {section.modules.length === 0 && (
                <span className="ml-auto text-emerald-400/30 text-xs italic">{section.id === 'labs' ? l.labLink : l.refsOnly}</span>
              )}
            </div>

            {/* Module cards */}
            {section.modules.length > 0 && (
              <div className="divide-y divide-emerald-500/8">
                {section.modules.map((mod, mi) => (
                  <Link
                    key={mod.id}
                    href={`/learn/modules/${mod.id}`}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-emerald-500/8 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {mi + 1}
                      </span>
                      <span className="text-text-primary text-sm group-hover:text-emerald-200 transition-colors" style={bf}>
                        {mod.title[locale]}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-emerald-300 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}

            {/* Reference deep dives */}
            {section.refs.length > 0 && (
              <div className={`px-6 py-3 ${section.modules.length > 0 ? 'border-t border-emerald-500/10' : ''} flex flex-wrap gap-2`}>
                {section.refs.map(ref => (
                  <Link
                    key={ref.href}
                    href={ref.href}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 border border-teal-500/20 transition-colors"
                    style={bf}
                  >
                    <BookOpen className="w-3 h-3" />
                    {section.id === 'labs' ? '' : `${l.deepDive}: `}{ref.label[locale]}
                    <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
