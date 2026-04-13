'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_7_1', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.1',
  title: { en: 'Yoga — The 27 Sun-Moon Combinations', hi: 'योग — सूर्य-चन्द्र के 27 संयोग', sa: 'योग — सूर्य-चन्द्र के 27 संयोग', mai: 'योग — सूर्य-चन्द्र के 27 संयोग', mr: 'योग — सूर्य-चन्द्र के 27 संयोग', ta: 'Yoga — The 27 Sun-Moon Combinations', te: 'Yoga — The 27 Sun-Moon Combinations', bn: 'Yoga — The 27 Sun-Moon Combinations', kn: 'Yoga — The 27 Sun-Moon Combinations', gu: 'Yoga — The 27 Sun-Moon Combinations' },
  subtitle: {
    en: 'The sum of sidereal Sun and Moon longitudes, divided into 27 segments of 13°20\u2032, yields a yoga that colours the day\'s energy',
    hi: 'सायन सूर्य और चन्द्रमा के अंशों का योग, 13°20\u2032 के 27 खण्डों में विभाजित, दिन की ऊर्जा को रंग देने वाला योग प्रदान करता है',
  },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 7-2: Karana', hi: 'मॉड्यूल 7-2: करण', sa: 'मॉड्यूल 7-2: करण', mai: 'मॉड्यूल 7-2: करण', mr: 'मॉड्यूल 7-2: करण', ta: 'Module 7-2: Karana', te: 'Module 7-2: Karana', bn: 'Module 7-2: Karana', kn: 'Module 7-2: Karana', gu: 'Module 7-2: Karana' }, href: '/learn/modules/7-2' },
    { label: { en: 'Module 7-3: Vara', hi: 'मॉड्यूल 7-3: वार', sa: 'मॉड्यूल 7-3: वार', mai: 'मॉड्यूल 7-3: वार', mr: 'मॉड्यूल 7-3: वार', ta: 'Module 7-3: Vara', te: 'Module 7-3: Vara', bn: 'Module 7-3: Vara', kn: 'Module 7-3: Vara', gu: 'Module 7-3: Vara' }, href: '/learn/modules/7-3' },
    { label: { en: 'Yogas Deep Dive', hi: 'योग विस्तार', sa: 'योग विस्तार', mai: 'योग विस्तार', mr: 'योग विस्तार', ta: 'Yogas Deep Dive', te: 'Yogas Deep Dive', bn: 'Yogas Deep Dive', kn: 'Yogas Deep Dive', gu: 'Yogas Deep Dive' }, href: '/learn/yogas' },
    { label: { en: 'Daily Yoga', hi: 'दैनिक योग', sa: 'दैनिक योग', mai: 'दैनिक योग', mr: 'दैनिक योग', ta: 'Daily Yoga', te: 'Daily Yoga', bn: 'Daily Yoga', kn: 'Daily Yoga', gu: 'Daily Yoga' }, href: '/panchang/yoga' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q7_1_01', type: 'mcq',
    question: {
      en: 'Panchang Yoga is computed from which two celestial longitudes?',
      hi: 'पंचांग योग की गणना किन दो खगोलीय अंशों से होती है?',
    },
    options: [
      { en: 'Moon minus Sun (elongation)', hi: 'चन्द्रमा घटा सूर्य (कोणीय दूरी)', sa: 'चन्द्रमा घटा सूर्य (कोणीय दूरी)', mai: 'चन्द्रमा घटा सूर्य (कोणीय दूरी)', mr: 'चन्द्रमा घटा सूर्य (कोणीय दूरी)', ta: 'Moon minus Sun (elongation)', te: 'Moon minus Sun (elongation)', bn: 'Moon minus Sun (elongation)', kn: 'Moon minus Sun (elongation)', gu: 'Moon minus Sun (elongation)' },
      { en: 'Sun plus Moon (sidereal sum)', hi: 'सूर्य जमा चन्द्रमा (सायन योग)', sa: 'सूर्य जमा चन्द्रमा (सायन योग)', mai: 'सूर्य जमा चन्द्रमा (सायन योग)', mr: 'सूर्य जमा चन्द्रमा (सायन योग)', ta: 'Sun plus Moon (sidereal sum)', te: 'Sun plus Moon (sidereal sum)', bn: 'Sun plus Moon (sidereal sum)', kn: 'Sun plus Moon (sidereal sum)', gu: 'Sun plus Moon (sidereal sum)' },
      { en: 'Jupiter plus Saturn', hi: 'बृहस्पति जमा शनि', sa: 'बृहस्पति जमा शनि', mai: 'बृहस्पति जमा शनि', mr: 'बृहस्पति जमा शनि', ta: 'Jupiter plus Saturn', te: 'Jupiter plus Saturn', bn: 'Jupiter plus Saturn', kn: 'Jupiter plus Saturn', gu: 'Jupiter plus Saturn' },
      { en: 'Mars minus Venus', hi: 'मंगल घटा शुक्र', sa: 'मंगल घटा शुक्र', mai: 'मंगल घटा शुक्र', mr: 'मंगल घटा शुक्र', ta: 'Mars minus Venus', te: 'Mars minus Venus', bn: 'Mars minus Venus', kn: 'Mars minus Venus', gu: 'Mars minus Venus' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Yoga is defined as the SUM of the sidereal longitudes of the Sun and Moon, modulo 360°, divided into 27 equal segments. This distinguishes it from Tithi (which uses the difference).',
      hi: 'योग सूर्य और चन्द्रमा के सायन अंशों के योग (mod 360°) से परिभाषित होता है, जिसे 27 समान खण्डों में बाँटा जाता है। यह तिथि (जो अन्तर पर आधारित है) से भिन्न है।',
    },
  },
  {
    id: 'q7_1_02', type: 'mcq',
    question: {
      en: 'How many Panchang Yogas are there in one complete cycle?',
      hi: 'एक पूर्ण चक्र में कितने पंचांग योग होते हैं?',
    },
    options: [
      { en: '12', hi: '12', sa: '12', mai: '12', mr: '12', ta: '12', te: '12', bn: '12', kn: '12', gu: '12' },
      { en: '15', hi: '15', sa: '15', mai: '15', mr: '15', ta: '15', te: '15', bn: '15', kn: '15', gu: '15' },
      { en: '27', hi: '27', sa: '27', mai: '27', mr: '27', ta: '27', te: '27', bn: '27', kn: '27', gu: '27' },
      { en: '30', hi: '30', sa: '30', mai: '30', mr: '30', ta: '30', te: '30', bn: '30', kn: '30', gu: '30' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'There are 27 yogas, each spanning 13°20\u2032 (800 arc-minutes). The first yoga (Vishkambha) begins when the Sun-Moon sum equals 0° and the last (Vaidhriti) ends at 360°.',
      hi: '27 योग होते हैं, प्रत्येक 13°20\u2032 (800 कला) का। प्रथम योग (विष्कम्भ) सूर्य-चन्द्र योग 0° पर आरम्भ होता है और अन्तिम (वैधृति) 360° पर समाप्त होता है।',
    },
  },
  {
    id: 'q7_1_03', type: 'true_false',
    question: {
      en: 'Panchang Yoga and the physical practice of "yoga" (asanas) refer to the same concept.',
      hi: 'पंचांग योग और शारीरिक "योग" (आसन) एक ही अवधारणा को दर्शाते हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Panchang Yoga is a purely astronomical measure — the Sun-Moon sum divided into 27 segments. It has no connection to yogic physical practices (asanas, pranayama). The word "yoga" simply means "combination" or "union" in Sanskrit.',
      hi: 'असत्य। पंचांग योग एक विशुद्ध खगोलीय माप है — सूर्य-चन्द्र योग को 27 खण्डों में विभाजित किया जाता है। इसका शारीरिक योग (आसन, प्राणायाम) से कोई सम्बन्ध नहीं है। "योग" शब्द का अर्थ संस्कृत में "संयोग" या "मिलन" होता है।',
    },
  },
  {
    id: 'q7_1_04', type: 'mcq',
    question: {
      en: 'If the sidereal Sun is at 348° and Moon at 167°, what is the yoga number?',
      hi: 'यदि सायन सूर्य 348° और चन्द्रमा 167° पर है, तो योग संख्या क्या होगी?',
    },
    options: [
      { en: '11 (Vriddhi)', hi: '11 (वृद्धि)', sa: '11 (वृद्धि)', mai: '11 (वृद्धि)', mr: '11 (वृद्धि)', ta: '11 (Vriddhi)', te: '11 (Vriddhi)', bn: '11 (Vriddhi)', kn: '11 (Vriddhi)', gu: '11 (Vriddhi)' },
      { en: '12 (Dhruva)', hi: '12 (ध्रुव)', sa: '12 (ध्रुव)', mai: '12 (ध्रुव)', mr: '12 (ध्रुव)', ta: '12 (Dhruva)', te: '12 (Dhruva)', bn: '12 (Dhruva)', kn: '12 (Dhruva)', gu: '12 (Dhruva)' },
      { en: '13 (Vyaghata)', hi: '13 (व्याघात)', sa: '13 (व्याघात)', mai: '13 (व्याघात)', mr: '13 (व्याघात)', ta: '13 (Vyaghata)', te: '13 (Vyaghata)', bn: '13 (Vyaghata)', kn: '13 (Vyaghata)', gu: '13 (Vyaghata)' },
      { en: '15 (Vajra)', hi: '15 (वज्र)', sa: '15 (वज्र)', mai: '15 (वज्र)', mr: '15 (वज्र)', ta: '15 (Vajra)', te: '15 (Vajra)', bn: '15 (Vajra)', kn: '15 (Vajra)', gu: '15 (Vajra)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sum = 348 + 167 = 515°. Mod 360 = 155°. Yoga number = floor(155 / 13.333) + 1 = floor(11.625) + 1 = 11 + 1 = 12. The 12th yoga is Dhruva, meaning "steady" or "fixed."',
      hi: 'योग = 348 + 167 = 515°। mod 360 = 155°। योग संख्या = floor(155 / 13.333) + 1 = floor(11.625) + 1 = 12। बारहवाँ योग ध्रुव है, जिसका अर्थ "स्थिर" है।',
    },
  },
  {
    id: 'q7_1_05', type: 'mcq',
    question: {
      en: 'Which of the following yogas is considered highly inauspicious?',
      hi: 'निम्नलिखित में से कौन-सा योग अत्यन्त अशुभ माना जाता है?',
    },
    options: [
      { en: 'Siddhi (perfect success)', hi: 'सिद्धि (पूर्ण सफलता)', sa: 'सिद्धि (पूर्ण सफलता)', mai: 'सिद्धि (पूर्ण सफलता)', mr: 'सिद्धि (पूर्ण सफलता)', ta: 'Siddhi (perfect success)', te: 'Siddhi (perfect success)', bn: 'Siddhi (perfect success)', kn: 'Siddhi (perfect success)', gu: 'Siddhi (perfect success)' },
      { en: 'Shubha (auspicious)', hi: 'शुभ (मंगलकारी)', sa: 'शुभ (मंगलकारी)', mai: 'शुभ (मंगलकारी)', mr: 'शुभ (मंगलकारी)', ta: 'Shubha (auspicious)', te: 'Shubha (auspicious)', bn: 'Shubha (auspicious)', kn: 'Shubha (auspicious)', gu: 'Shubha (auspicious)' },
      { en: 'Vyatipata (great calamity)', hi: 'व्यतीपात (महा विपत्ति)', sa: 'व्यतीपात (महा विपत्ति)', mai: 'व्यतीपात (महा विपत्ति)', mr: 'व्यतीपात (महा विपत्ति)', ta: 'Vyatipata (great calamity)', te: 'Vyatipata (great calamity)', bn: 'Vyatipata (great calamity)', kn: 'Vyatipata (great calamity)', gu: 'Vyatipata (great calamity)' },
      { en: 'Dhruva (steady)', hi: 'ध्रुव (स्थिर)', sa: 'ध्रुव (स्थिर)', mai: 'ध्रुव (स्थिर)', mr: 'ध्रुव (स्थिर)', ta: 'Dhruva (steady)', te: 'Dhruva (steady)', bn: 'Dhruva (steady)', kn: 'Dhruva (steady)', gu: 'Dhruva (steady)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Vyatipata (yoga #17) and Vaidhriti (yoga #27) are the two most inauspicious yogas. Their names mean "great calamity" and "adverse" respectively. Auspicious activities are avoided during these periods.',
      hi: 'व्यतीपात (योग #17) और वैधृति (योग #27) दो सर्वाधिक अशुभ योग हैं। इनके नामों का अर्थ क्रमशः "महा विपत्ति" और "प्रतिकूल" है। इन अवधियों में शुभ कार्य वर्जित माने जाते हैं।',
    },
  },
  {
    id: 'q7_1_06', type: 'true_false',
    question: {
      en: 'Siddhi yoga is considered one of the most auspicious yogas, ideal for initiating important ventures.',
      hi: 'सिद्धि योग सर्वाधिक शुभ योगों में से एक माना जाता है, महत्वपूर्ण कार्यों के आरम्भ हेतु आदर्श।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Siddhi (yoga #21) means "accomplishment" or "perfection." It is classified as highly auspicious (shubha) and is recommended for initiating new enterprises, rituals, and significant life events.',
      hi: 'सत्य। सिद्धि (योग #21) का अर्थ "सफलता" या "पूर्णता" है। इसे अत्यन्त शुभ (शुभ) वर्ग में रखा जाता है और नये उद्यम, अनुष्ठान तथा महत्वपूर्ण जीवन-घटनाओं के लिए अनुशंसित है।',
    },
  },
  {
    id: 'q7_1_07', type: 'mcq',
    question: {
      en: 'Each yoga spans how many arc-degrees?',
      hi: 'प्रत्येक योग कितने अंशों का होता है?',
    },
    options: [
      { en: '12°', hi: '12°', sa: '12°', mai: '12°', mr: '12°', ta: '12°', te: '12°', bn: '12°', kn: '12°', gu: '12°' },
      { en: '13°20\u2032', hi: '13°20\u2032', sa: '13°20\u2032', mai: '13°20\u2032', mr: '13°20\u2032', ta: '13°20\u2032', te: '13°20\u2032', bn: '13°20\u2032', kn: '13°20\u2032', gu: '13°20\u2032' },
      { en: '15°', hi: '15°', sa: '15°', mai: '15°', mr: '15°', ta: '15°', te: '15°', bn: '15°', kn: '15°', gu: '15°' },
      { en: '10°', hi: '10°', sa: '10°', mai: '10°', mr: '10°', ta: '10°', te: '10°', bn: '10°', kn: '10°', gu: '10°' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Each of the 27 yogas spans 13°20\u2032 (13.333 degrees or 800 arc-minutes). This is the same span as a nakshatra, because 360° / 27 = 13°20\u2032.',
      hi: 'प्रत्येक 27 योग 13°20\u2032 (13.333 अंश या 800 कला) का होता है। यह नक्षत्र के विस्तार के समान है, क्योंकि 360° / 27 = 13°20\u2032।',
    },
  },
  {
    id: 'q7_1_08', type: 'true_false',
    question: {
      en: 'The first yoga Vishkambha begins when the Sun-Moon sidereal sum equals 0°.',
      hi: 'प्रथम योग विष्कम्भ तब आरम्भ होता है जब सूर्य-चन्द्र सायन योग 0° होता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Vishkambha occupies the range 0° to 13°20\u2032 of the Sun-Moon sidereal sum. Each subsequent yoga occupies the next 13°20\u2032 segment.',
      hi: 'सत्य। विष्कम्भ सूर्य-चन्द्र सायन योग के 0° से 13°20\u2032 तक के क्षेत्र में होता है। प्रत्येक अगला योग अगले 13°20\u2032 खण्ड में आता है।',
    },
  },
  {
    id: 'q7_1_09', type: 'mcq',
    question: {
      en: 'Dhruva yoga means "steady/fixed." For which type of activity is it best suited?',
      hi: 'ध्रुव योग का अर्थ "स्थिर" है। यह किस प्रकार के कार्य हेतु सर्वोत्तम है?',
    },
    options: [
      { en: 'Travel and temporary work', hi: 'यात्रा और अस्थायी कार्य', sa: 'यात्रा और अस्थायी कार्य', mai: 'यात्रा और अस्थायी कार्य', mr: 'यात्रा और अस्थायी कार्य', ta: 'Travel and temporary work', te: 'Travel and temporary work', bn: 'Travel and temporary work', kn: 'Travel and temporary work', gu: 'Travel and temporary work' },
      { en: 'Stable endeavors like housewarming, marriage, planting', hi: 'स्थायी कार्य जैसे गृह-प्रवेश, विवाह, रोपण', sa: 'स्थायी कार्य जैसे गृह-प्रवेश, विवाह, रोपण', mai: 'स्थायी कार्य जैसे गृह-प्रवेश, विवाह, रोपण', mr: 'स्थायी कार्य जैसे गृह-प्रवेश, विवाह, रोपण', ta: 'Stable endeavors like housewarming, marriage, planting', te: 'Stable endeavors like housewarming, marriage, planting', bn: 'Stable endeavors like housewarming, marriage, planting', kn: 'Stable endeavors like housewarming, marriage, planting', gu: 'Stable endeavors like housewarming, marriage, planting' },
      { en: 'Destruction of enemies', hi: 'शत्रु-नाश', sa: 'शत्रु-नाश', mai: 'शत्रु-नाश', mr: 'शत्रु-नाश', ta: 'Destruction of enemies', te: 'Destruction of enemies', bn: 'Destruction of enemies', kn: 'Destruction of enemies', gu: 'Destruction of enemies' },
      { en: 'Fasting and penance', hi: 'उपवास और तपस्या', sa: 'उपवास और तपस्या', mai: 'उपवास और तपस्या', mr: 'उपवास और तपस्या', ta: 'Fasting and penance', te: 'Fasting and penance', bn: 'Fasting and penance', kn: 'Fasting and penance', gu: 'Fasting and penance' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Dhruva means "fixed" or "steady," making it ideal for activities that require permanence and stability — housewarming (griha-pravesha), marriage, planting trees, and laying foundations.',
      hi: 'ध्रुव का अर्थ "स्थिर" है, इसलिए यह स्थायित्व वाले कार्यों के लिए आदर्श है — गृह-प्रवेश, विवाह, वृक्षारोपण और नींव रखना।',
    },
  },
  {
    id: 'q7_1_10', type: 'true_false',
    question: {
      en: 'Yoga changes roughly once every 24 hours, similar to the solar day.',
      hi: 'योग लगभग प्रत्येक 24 घण्टे में बदलता है, सौर दिवस के समान।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Yoga duration is variable, typically ranging from 18 to 27 hours, because both the Sun and Moon are moving. The combined speed of their sidereal motion determines how quickly the sum crosses a 13°20\u2032 boundary.',
      hi: 'असत्य। योग की अवधि परिवर्तनशील होती है, सामान्यतः 18 से 27 घण्टे, क्योंकि सूर्य और चन्द्रमा दोनों गतिमान हैं। उनकी सायन गति की संयुक्त चाल निर्धारित करती है कि योग कितनी शीघ्र 13°20\u2032 सीमा पार करता है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Yoga — The 27 Sun-Moon Combinations</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">In Panchang, the word &quot;yoga&quot; does not refer to asanas or meditation. It is a purely astronomical measure: take the sidereal longitude of the Sun, add the sidereal longitude of the Moon, reduce the sum modulo 360°, and then divide the result into 27 equal segments of 13°20&prime; each. The segment the sum falls into determines the prevailing yoga.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Each of the 27 yogas carries a distinct name and nature — auspicious, inauspicious, or mixed. The sequence runs from Vishkambha (1) through Vaidhriti (27). Some yogas like Siddhi, Shubha, and Shukla are regarded as highly favourable, while Vyatipata and Vaidhriti are considered deeply inauspicious and are avoided for all new beginnings.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The complete list of 27 yogas in order: (1) Vishkambha, (2) Priti, (3) Ayushman, (4) Saubhagya, (5) Shobhana, (6) Atiganda, (7) Sukarma, (8) Dhriti, (9) Shula, (10) Ganda, (11) Vriddhi, (12) Dhruva, (13) Vyaghata, (14) Harshana, (15) Vajra, (16) Siddhi, (17) Vyatipata, (18) Variyan, (19) Parigha, (20) Shiva, (21) Siddha, (22) Sadhya, (23) Shubha, (24) Shukla, (25) Brahma, (26) Indra, (27) Vaidhriti.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">The 27 yogas are enumerated in the Surya Siddhanta and detailed in Brihat Samhita by Varahamihira (6th century CE). Parashara mentions them in BPHS as an essential element of Panchang. The system predates the common era and reflects the ancient insight that the combined luminaries (Sun + Moon) create a distinct quality of time beyond what either body produces individually. The word &quot;yoga&quot; here literally means &quot;union&quot; or &quot;sum&quot; — the joining of two celestial arcs.</p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Classification and Practical Use</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The 27 yogas divide into three broad categories. Auspicious yogas include Priti, Ayushman, Saubhagya, Shobhana, Sukarma, Dhriti, Vriddhi, Dhruva, Harshana, Siddhi, Shiva, Siddha, Sadhya, Shubha, Shukla, Brahma, and Indra. These are suitable for initiating ventures, ceremonies, travel, and celebrations.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Inauspicious yogas include Vishkambha, Atiganda, Shula, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, and Vaidhriti. Among these, Vyatipata and Vaidhriti are considered the worst — classical texts compare their effect to an eclipse on the day&apos;s energy. Activities begun during these yogas are said to face obstacles, delays, and reversals.</p>
        <p className="text-text-secondary text-sm leading-relaxed">In daily Panchang practice, the prevailing yoga is listed alongside Tithi, Nakshatra, Vara, and Karana. When selecting a muhurta (auspicious time window), an astrologer checks that the yoga is favourable for the intended activity. For example, Dhruva (&quot;steady&quot;) suits permanent actions like housewarming, while Shubha (&quot;auspicious&quot;) is universally favourable. Yoga alone does not determine auspiciousness — it works in concert with the other four Panchang elements.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1:</span> Sun sidereal = 348°, Moon sidereal = 167°. Sum = 515°. Mod 360 = 155°. Yoga index = floor(155 / 13.333) = 11. Yoga number = 11 + 1 = 12. The 12th yoga is Dhruva (&quot;fixed/steady&quot;) — auspicious for stable endeavors like purchasing property or planting trees.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 2:</span> Sun = 45°, Moon = 280°. Sum = 325°. Mod 360 = 325°. Index = floor(325 / 13.333) = 24. Yoga = 24 + 1 = 25 (Brahma). Brahma yoga is highly auspicious — ideal for learning, initiations, and spiritual practices.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 3:</span> Sun = 120°, Moon = 100°. Sum = 220°. Index = floor(220 / 13.333) = 16. Yoga = 17 (Vyatipata). This is inauspicious — avoid starting new ventures, journeys, or ceremonies during this yoga.</p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Calculation, Misconceptions, and Modern Practice</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The yoga calculation is straightforward: obtain the sidereal (nirayana) longitude of both the Sun and Moon using Lahiri Ayanamsa. Add the two longitudes. If the sum exceeds 360°, subtract 360°. Divide the result by 13.333° (equivalently 13°20&prime;). The integer part plus one gives the yoga number. Because both luminaries are constantly moving, the yoga changes roughly once a day, though durations vary from about 18 to 27 hours depending on the combined angular speeds.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Our app computes the yoga in real time from the Meeus solar and lunar position algorithms, applying Lahiri Ayanamsa. The yoga start and end times are determined by finding the exact moment the Sun-Moon sum crosses each 13°20&prime; boundary — this requires iterative computation since both bodies move at variable speeds.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Panchang Yoga is related to Yoga asanas.&quot; These are entirely different uses of the Sanskrit word &quot;yoga.&quot; Panchang Yoga is astronomical; yogic practices are spiritual/physical disciplines.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Yoga is the same as Nakshatra because both have 27 divisions.&quot; While both divide into 27 segments of 13°20&prime;, they measure different things — Nakshatra tracks the Moon&apos;s sidereal position alone, while Yoga tracks the combined Sun+Moon sum.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;A bad yoga ruins the entire day regardless of other factors.&quot; In practice, an unfavourable yoga can be mitigated by strong Nakshatra, good Tithi, and auspicious Vara. The Panchang is a five-factor system — no single element is absolute.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Yoga remains a standard element in every printed and digital Panchang across India, Nepal, and Sri Lanka. Modern muhurta-selection software — including our own Muhurta AI engine — factors the yoga into its multi-criteria scoring. Vyatipata and Vaidhriti are automatically flagged as unfavourable windows. For users who consult the daily Panchang, the yoga provides a quick read on the day&apos;s general cosmic flavour alongside the four other limbs.</p>
      </section>
    </div>
  );
}

export default function Module7_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
