'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Layers, ChevronDown, ArrowRight, AlertTriangle, CheckCircle, XCircle, HelpCircle, type LucideIcon } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import { NAKSHATRA_RAJJU, type RajjuGroup } from '@/lib/matching/rajju-dosha';

// ─── Inline LABELS ─────────────────────────────────────────────────────────────
const L: Record<string, LocaleText> = {
  title: { en: 'Advanced Compatibility: Dasha Alignment & Rajju Dosha', hi: 'उन्नत अनुकूलता: दशा संरेखण एवं राज्जु दोष' },
  subtitle: { en: 'Two powerful techniques beyond Ashta Kuta that modern and South Indian traditions use for deeper marriage analysis.', hi: 'अष्ट कूट से परे दो शक्तिशाली तकनीकें जो आधुनिक और दक्षिण भारतीय परम्पराएं गहन विवाह विश्लेषण के लिए उपयोग करती हैं।' },

  // Part 1: Dasha Comparison
  part1Title: { en: 'Part 1: Dasha Comparison in Synastry', hi: 'भाग 1: सिनैस्ट्री में दशा तुलना' },
  dashaIntroTitle: { en: 'Why Dasha Alignment Matters', hi: 'दशा संरेखण क्यों महत्वपूर्ण है' },
  dashaIntroP1: { en: 'Ashta Kuta matching evaluates the static compatibility between two birth charts --- the permanent blueprint of the relationship. But relationships unfold in time, and the quality of that time is governed by Dasha periods. Two people with a perfect 32/36 Ashta Kuta score can still struggle if their dashas are pulling them in opposite directions.', hi: 'अष्ट कूट मिलान दो जन्म कुण्डलियों के बीच स्थिर अनुकूलता का मूल्यांकन करता है --- सम्बन्ध का स्थायी खाका। लेकिन सम्बन्ध समय में विकसित होते हैं, और उस समय की गुणवत्ता दशा अवधियों द्वारा नियंत्रित होती है।' },
  dashaIntroP2: { en: 'Dasha comparison is not part of the traditional Ashta Kuta system, but experienced jyotishis have always considered it. Modern computational tools now make it possible to overlay two dasha timelines and systematically identify windows of harmony and tension.', hi: 'दशा तुलना पारम्परिक अष्ट कूट प्रणाली का भाग नहीं है, लेकिन अनुभवी ज्योतिषियों ने सदैव इसे ध्यान में रखा है। आधुनिक कम्प्यूटेशनल उपकरण अब दो दशा समयरेखाओं को ओवरले करना सम्भव बनाते हैं।' },

  dashaMethodTitle: { en: 'Method: How Dashas Are Compared', hi: 'विधि: दशाओं की तुलना कैसे होती है' },
  dashaMethodP1: { en: 'The comparison focuses on Maha Dasha (major period) lords of both charts over a selected time window --- typically the next 10--20 years from the date of marriage.', hi: 'तुलना दोनों कुण्डलियों के महादशा (प्रमुख अवधि) स्वामियों पर एक चयनित समय विंडो में केन्द्रित होती है --- सामान्यतः विवाह तिथि से अगले 10--20 वर्ष।' },

  dashaRulesTitle: { en: 'Interpretation Rules', hi: 'व्याख्या नियम' },

  dashaSandhiTitle: { en: 'Dasha Sandhi (Junction Points)', hi: 'दशा सन्धि (संक्रमण बिन्दु)' },
  dashaSandhiP1: { en: 'Dasha Sandhi is the junction where one Maha Dasha ends and another begins --- typically a turbulent 6--12 month window. When one partner is in Dasha Sandhi while the other is in a stable mid-period, the stable partner provides an anchor. When BOTH partners hit Dasha Sandhi simultaneously, the relationship faces its most challenging test --- external counselling and mutual patience are essential.', hi: 'दशा सन्धि वह संक्रमण बिन्दु है जहाँ एक महादशा समाप्त होती है और दूसरी शुरू --- सामान्यतः 6--12 महीने का अशान्त समय। जब एक साथी दशा सन्धि में हो और दूसरा स्थिर मध्य-अवधि में, तो स्थिर साथी सहारा देता है।' },

  dashaExampleTitle: { en: 'Worked Example', hi: 'कार्यरत उदाहरण' },
  dashaExampleP1: { en: 'Person A is in Jupiter Maha Dasha (benefic, expansion) from 2024--2040. Person B is in Venus Maha Dasha (benefic, pleasure and harmony) from 2023--2043. Both are in benefic dashas simultaneously --- this is an "aligned" window. The relationship flourishes: shared optimism, travel, financial growth, and family expansion are supported.', hi: 'व्यक्ति A गुरु महादशा (शुभ, विस्तार) में 2024--2040 तक है। व्यक्ति B शुक्र महादशा (शुभ, आनन्द और सामंजस्य) में 2023--2043 तक है। दोनों एक साथ शुभ दशाओं में हैं --- यह एक "संरेखित" विंडो है।' },
  dashaExampleP2: { en: 'Now consider Person C in Saturn Maha Dasha (restriction, karma, discipline) from 2025--2044, paired with Person D in Rahu Maha Dasha (chaos, obsession, unconventional desires) from 2026--2044. Saturn demands structure; Rahu demands freedom. The mismatch creates chronic tension --- one partner feels constrained, the other feels unsupported.', hi: 'अब विचार करें व्यक्ति C शनि महादशा (प्रतिबन्ध, कर्म, अनुशासन) में 2025--2044 तक, और व्यक्ति D राहु महादशा (अराजकता, ग्रसन, अपरम्परागत इच्छाएं) में 2026--2044 तक। शनि संरचना माँगता है; राहु स्वतन्त्रता। बेमेल दीर्घकालिक तनाव बनाता है।' },

  // Part 2: Rajju Dosha
  part2Title: { en: 'Part 2: Rajju Dosha --- South Indian Nakshatra Cord Matching', hi: 'भाग 2: राज्जु दोष --- दक्षिण भारतीय नक्षत्र रज्जु मिलान' },
  rajjuIntroTitle: { en: 'What is Rajju?', hi: 'राज्जु क्या है?' },
  rajjuIntroP1: { en: 'Rajju (Sanskrit: "cord" or "rope") is a classification system that maps each of the 27 nakshatras to one of five body regions --- feet, waist, navel, neck, and head. It originates in the South Indian Jyotish tradition (Tamil Nadu, Kerala, Karnataka) and is NOT part of the standard North Indian Ashta Kuta system.', hi: 'राज्जु (संस्कृत: "रस्सी" या "डोर") एक वर्गीकरण प्रणाली है जो 27 नक्षत्रों में से प्रत्येक को पाँच शरीर क्षेत्रों में से एक पर --- पैर, कमर, नाभि, गर्दन और सिर --- मैप करती है। यह दक्षिण भारतीय ज्योतिष परम्परा से उद्भव होती है।' },
  rajjuIntroP2: { en: 'In South Indian marriage matching, Rajju is often considered more important than the numerical Ashta Kuta score. Families in Tamil Nadu may reject a match with a perfect 36/36 score if Rajju Dosha is present --- particularly Shiro Rajju or Kantha Rajju.', hi: 'दक्षिण भारतीय विवाह मिलान में, राज्जु को अक्सर संख्यात्मक अष्ट कूट अंक से अधिक महत्वपूर्ण माना जाता है। तमिलनाडु में परिवार 36/36 के पूर्ण अंक वाले मिलान को भी अस्वीकार कर सकते हैं यदि राज्जु दोष मौजूद हो।' },

  rajjuCategoriesTitle: { en: 'The Five Rajju Categories', hi: 'पाँच राज्जु वर्ग' },
  rajjuMatchingTitle: { en: 'Matching Rules', hi: 'मिलान नियम' },
  rajjuMatchingP1: { en: 'The rule is straightforward: if both partners\' Moon nakshatras fall in the SAME Rajju group, Rajju Dosha is present. The severity depends on which body part is matched.', hi: 'नियम सीधा है: यदि दोनों साथियों के चन्द्र नक्षत्र एक ही राज्जु समूह में आते हैं, तो राज्जु दोष मौजूद है। गम्भीरता इस पर निर्भर करती है कि कौन-सा शरीर भाग मेल खाता है।' },

  rajjuTableTitle: { en: 'Complete 27-Nakshatra Rajju Mapping', hi: 'सम्पूर्ण 27-नक्षत्र राज्जु मानचित्रण' },

  rajjuCancellationTitle: { en: 'Cancellation Conditions', hi: 'निरसन शर्तें' },
  rajjuCancellationP1: { en: 'Rajju Dosha, like most doshas in Jyotish, has conditions under which its effects are mitigated or cancelled. No single dosha should ever be taken as an absolute verdict.', hi: 'राज्जु दोष, ज्योतिष के अधिकांश दोषों की तरह, ऐसी शर्तें रखता है जिनके तहत इसके प्रभाव कम या रद्द हो जाते हैं। किसी भी एक दोष को कभी पूर्ण निर्णय नहीं मानना चाहिए।' },

  rajjuExampleTitle: { en: 'Worked Example', hi: 'कार्यरत उदाहरण' },
  rajjuExampleP1: { en: 'Groom\'s Moon nakshatra: Ashwini (nakshatra #1). Bride\'s Moon nakshatra: Magha (nakshatra #10). Looking up the Rajju table: Ashwini = Pada Rajju. Magha = Pada Rajju. SAME Rajju group --- Pada Rajju Dosha is present. Severity: Mild. Classical interpretation: wandering, restlessness, frequent relocation. Modern reading: the couple may struggle to settle in one place or one career, but this is manageable with awareness and is the least concerning Rajju match.', hi: 'वर का चन्द्र नक्षत्र: अश्विनी (नक्षत्र #1)। वधू का चन्द्र नक्षत्र: मघा (नक्षत्र #10)। राज्जु तालिका देखें: अश्विनी = पाद राज्जु। मघा = पाद राज्जु। एक ही राज्जु समूह --- पाद राज्जु दोष मौजूद है। गम्भीरता: सौम्य।' },
  rajjuExampleP2: { en: 'Compare with: Groom in Rohini (#4, Kantha Rajju) and Bride in Hasta (#13, Kantha Rajju). Same Rajju = Kantha Dosha = Severe. This match would be rejected in traditional South Indian practice without extremely strong compensating factors.', hi: 'तुलना करें: वर रोहिणी (#4, कण्ठ राज्जु) और वधू हस्त (#13, कण्ठ राज्जु) में। एक ही राज्जु = कण्ठ दोष = गम्भीर। पारम्परिक दक्षिण भारतीय प्रथा में बिना अत्यन्त प्रबल प्रतिसंतुलन कारकों के यह मिलान अस्वीकृत होगा।' },

  flowchartTitle: { en: 'Compatibility Decision Flowchart', hi: 'अनुकूलता निर्णय प्रवाह चित्र' },

  linksTitle: { en: 'Continue Learning', hi: 'आगे सीखें' },
};

// ─── Dasha Combination Data ─────────────────────────────────────────────────
const DASHA_RULES: { rule: LocaleText; quality: 'good' | 'mixed' | 'hard' }[] = [
  { rule: { en: 'Both in benefic dashas (Jupiter, Venus, Moon) = relationship flourishes. Shared optimism, expansion, harmonious rhythms.', hi: 'दोनों शुभ दशाओं (गुरु, शुक्र, चन्द्र) में = सम्बन्ध फलता-फूलता है। साझा आशावादिता, विस्तार, सामंजस्यपूर्ण लय।' }, quality: 'good' },
  { rule: { en: 'Both in malefic dashas (Saturn, Rahu, Ketu) = shared hardship. Can actually bond the couple if faced together consciously.', hi: 'दोनों पाप दशाओं (शनि, राहु, केतु) में = साझा कठिनाई। यदि सचेतन रूप से साथ मिलकर सामना करें तो दम्पति को जोड़ सकती है।' }, quality: 'hard' },
  { rule: { en: 'One in Saturn/Rahu while other in Jupiter/Venus = maximum tension. One feels restricted while the other feels expansive. Different life rhythms.', hi: 'एक शनि/राहु में जबकि दूसरा गुरु/शुक्र में = अधिकतम तनाव। एक प्रतिबन्धित महसूस करता है जबकि दूसरा विस्तारित। भिन्न जीवन लय।' }, quality: 'hard' },
  { rule: { en: 'One in Sun/Mars (neutral, assertive) while other in Moon (emotional) = mixed. The assertive partner can overwhelm the emotional one. Requires conscious calibration.', hi: 'एक सूर्य/मंगल (तटस्थ, मुखर) में जबकि दूसरा चन्द्र (भावनात्मक) में = मिश्रित। मुखर साथी भावनात्मक को अभिभूत कर सकता है। सचेत समायोजन आवश्यक।' }, quality: 'mixed' },
  { rule: { en: 'Dasha Sandhi (junction) in one chart during other\'s stable period = the stable partner becomes the anchor. A supportive dynamic.', hi: 'एक कुण्डली में दशा सन्धि जबकि दूसरे की स्थिर अवधि = स्थिर साथी सहारा बनता है। एक सहायक गतिशीलता।' }, quality: 'good' },
  { rule: { en: 'BOTH in Dasha Sandhi simultaneously = highest vulnerability. External support (counselling, family, spiritual practice) strongly recommended.', hi: 'दोनों एक साथ दशा सन्धि में = सर्वोच्च संवेदनशीलता। बाह्य सहायता (परामर्श, परिवार, आध्यात्मिक अभ्यास) दृढ़ता से अनुशंसित।' }, quality: 'hard' },
];

// ─── Dasha Method Steps ─────────────────────────────────────────────────────
const DASHA_STEPS: { step: number; text: LocaleText }[] = [
  { step: 1, text: { en: 'Extract Vimshottari Maha Dasha sequences for both charts (120-year cycle based on Moon\'s nakshatra at birth).', hi: 'दोनों कुण्डलियों के विंशोत्तरी महादशा क्रम निकालें (जन्म के चन्द्र नक्षत्र पर आधारित 120-वर्ष चक्र)।' } },
  { step: 2, text: { en: 'Flatten both timelines to Maha Dasha level and select a comparison window (e.g. 2026--2046).', hi: 'दोनों समयरेखाओं को महादशा स्तर पर समतल करें और तुलना विंडो चुनें (जैसे 2026--2046)।' } },
  { step: 3, text: { en: 'Classify each Maha Dasha lord as benefic (Jupiter, Venus), malefic (Saturn, Rahu, Ketu), or neutral (Sun, Moon, Mars, Mercury).', hi: 'प्रत्येक महादशा स्वामी को शुभ (गुरु, शुक्र), पाप (शनि, राहु, केतु), या तटस्थ (सूर्य, चन्द्र, मंगल, बुध) के रूप में वर्गीकृत करें।' } },
  { step: 4, text: { en: 'Overlay the two timelines and compute alignment for each overlapping interval: "aligned" (both benefic), "tension" (benefic + malefic, or both malefic), "mixed" (one or both neutral).', hi: 'दो समयरेखाओं को ओवरले करें और प्रत्येक अतिव्यापी अंतराल के लिए संरेखण गणना करें: "संरेखित" (दोनों शुभ), "तनाव" (शुभ + पाप, या दोनों पाप), "मिश्रित" (एक या दोनों तटस्थ)।' } },
  { step: 5, text: { en: 'Identify alignment windows (consecutive aligned/tension intervals) and compute summary percentages. 50%+ aligned = strong support. 50%+ tension = challenging period ahead.', hi: 'संरेखण विंडो (लगातार संरेखित/तनाव अंतराल) पहचानें और सारांश प्रतिशत गणना करें। 50%+ संरेखित = मजबूत समर्थन। 50%+ तनाव = आगे चुनौतीपूर्ण अवधि।' } },
];

// ─── Rajju Categories ───────────────────────────────────────────────────────
interface RajjuCategoryInfo {
  group: RajjuGroup;
  bodyPart: LocaleText;
  nakshatraIds: number[];
  severity: 'mild' | 'moderate' | 'severe';
  classicalMeaning: LocaleText;
  modernMeaning: LocaleText;
  color: string;
  bgColor: string;
}

const RAJJU_CATEGORIES: RajjuCategoryInfo[] = [
  {
    group: 'pada',
    bodyPart: { en: 'Pada (Feet)', hi: 'पाद (चरण)' },
    nakshatraIds: [1, 9, 10, 18, 19, 27],
    severity: 'mild',
    classicalMeaning: { en: 'Wandering, restlessness, inability to settle. The couple may relocate frequently or struggle to build stable roots.', hi: 'भटकाव, अस्थिरता, स्थिर होने में असमर्थता। दम्पति बार-बार स्थान बदल सकते हैं या स्थिर जड़ें बनाने में संघर्ष कर सकते हैं।' },
    modernMeaning: { en: 'Manageable with awareness. Many modern couples enjoy mobility. Focus on creating emotional rootedness even amid physical change.', hi: 'जागरूकता के साथ प्रबन्धनीय। कई आधुनिक दम्पति गतिशीलता का आनन्द लेते हैं। भौतिक परिवर्तन के बीच भी भावनात्मक जुड़ाव बनाने पर ध्यान दें।' },
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/8 border-cyan-500/20',
  },
  {
    group: 'kati',
    bodyPart: { en: 'Kati (Waist)', hi: 'कटि (कमर)' },
    nakshatraIds: [2, 8, 11, 17, 20, 26],
    severity: 'mild',
    classicalMeaning: { en: 'Poverty, financial hardship, persistent material struggles throughout married life.', hi: 'दरिद्रता, आर्थिक कठिनाई, विवाहित जीवन भर निरन्तर भौतिक संघर्ष।' },
    modernMeaning: { en: 'Financial planning and joint budgeting can mitigate. The dosha signals a tendency, not a destiny. Career counselling and investment discipline help.', hi: 'वित्तीय योजना और संयुक्त बजट बनाकर कम किया जा सकता है। दोष एक प्रवृत्ति का संकेत देता है, भाग्य नहीं।' },
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/8 border-amber-500/20',
  },
  {
    group: 'nabhi',
    bodyPart: { en: 'Nabhi (Navel)', hi: 'नाभि (नाभि)' },
    nakshatraIds: [3, 7, 12, 16, 21, 25],
    severity: 'moderate',
    classicalMeaning: { en: 'Loss of children or difficulties in progeny. Classical texts associate this with fertility challenges and the welfare of offspring.', hi: 'संतान-हानि या संतान सम्बन्धी कठिनाइयाँ। शास्त्रीय ग्रन्थ इसे प्रजनन चुनौतियों और संतान कल्याण से जोड़ते हैं।' },
    modernMeaning: { en: 'Modern medicine addresses many fertility concerns. Traditional remedy: Santana Gopala puja. This dosha warrants attention but not alarm in isolation.', hi: 'आधुनिक चिकित्सा कई प्रजनन चिन्ताओं का समाधान करती है। पारम्परिक उपाय: संतान गोपाल पूजा। यह दोष ध्यान देने योग्य है पर अकेले में भय नहीं।' },
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/8 border-orange-500/20',
  },
  {
    group: 'kantha',
    bodyPart: { en: 'Kantha (Neck)', hi: 'कण्ठ (गर्दन)' },
    nakshatraIds: [4, 6, 13, 15, 22, 24],
    severity: 'severe',
    classicalMeaning: { en: 'Risk to the wife\'s life or health. Classical texts describe this as one of the most severe Rajju combinations, traditionally associated with widowhood.', hi: 'पत्नी के जीवन या स्वास्थ्य पर खतरा। शास्त्रीय ग्रन्थ इसे सबसे गम्भीर राज्जु संयोगों में से एक बताते हैं, पारम्परिक रूप से वैधव्य से जोड़ा जाता है।' },
    modernMeaning: { en: 'The classical fear of widowhood should be understood in its historical context. Modern interpretation: health vigilance for the wife, periodic medical checkups, and remedial measures. An experienced jyotishi should be consulted.', hi: 'वैधव्य का शास्त्रीय भय ऐतिहासिक सन्दर्भ में समझना चाहिए। आधुनिक व्याख्या: पत्नी के स्वास्थ्य पर सतर्कता, नियमित चिकित्सा जांच, और उपचार उपाय।' },
    color: 'text-red-400',
    bgColor: 'bg-red-500/8 border-red-500/20',
  },
  {
    group: 'shiro',
    bodyPart: { en: 'Shiro (Head)', hi: 'शिर (सिर)' },
    nakshatraIds: [5, 14, 23],
    severity: 'severe',
    classicalMeaning: { en: 'Risk to the husband\'s life or health. The most feared Rajju dosha in South Indian tradition, associated with premature loss of the husband.', hi: 'पति के जीवन या स्वास्थ्य पर खतरा। दक्षिण भारतीय परम्परा में सबसे भयंकर राज्जु दोष, पति की अकाल हानि से जोड़ा जाता है।' },
    modernMeaning: { en: 'Same historical context applies. Modern reading: health vigilance for the husband, regular checkups, and Ayush Homam (longevity ritual) is the traditional prescription. Consult a qualified jyotishi before making marriage decisions based solely on this.', hi: 'वही ऐतिहासिक सन्दर्भ लागू होता है। आधुनिक व्याख्या: पति के स्वास्थ्य पर सतर्कता, नियमित जांच, और आयुष होमम् (दीर्घायु अनुष्ठान)। केवल इसके आधार पर विवाह निर्णय लेने से पहले योग्य ज्योतिषी से परामर्श करें।' },
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/8 border-rose-500/20',
  },
];

// ─── Cancellation Conditions ────────────────────────────────────────────────
const CANCELLATIONS: { condition: LocaleText; explanation: LocaleText }[] = [
  {
    condition: { en: 'Strong Ashta Kuta score (28+ out of 36)', hi: 'मजबूत अष्ट कूट अंक (36 में से 28+)' },
    explanation: { en: 'A very high Ashta Kuta score indicates such strong overall compatibility that it can override a mild or moderate Rajju dosha. Not sufficient for Kantha or Shiro Rajju.', hi: 'बहुत ऊँचा अष्ट कूट अंक इतनी प्रबल समग्र अनुकूलता दर्शाता है कि यह सौम्य या मध्यम राज्जु दोष को निरस्त कर सकता है। कण्ठ या शिर राज्जु के लिए पर्याप्त नहीं।' },
  },
  {
    condition: { en: 'Rashi lord friendship between both Moon signs', hi: 'दोनों चन्द्र राशियों के बीच राशि स्वामी मित्रता' },
    explanation: { en: 'If the lords of the two Moon rashis are natural friends (e.g. Jupiter and Sun, Mercury and Venus), the Rajju dosha is weakened. The friendship between sign lords provides a buffer.', hi: 'यदि दो चन्द्र राशियों के स्वामी प्राकृतिक मित्र हैं (जैसे गुरु और सूर्य, बुध और शुक्र), तो राज्जु दोष कमजोर हो जाता है।' },
  },
  {
    condition: { en: 'Nakshatra lord friendship', hi: 'नक्षत्र स्वामी मित्रता' },
    explanation: { en: 'If the ruling planets of both nakshatras are friends or the same planet, the dosha effect is softened. E.g. both nakshatras ruled by Jupiter (Punarvasu + Vishakha) in the same Rajju = reduced impact.', hi: 'यदि दोनों नक्षत्रों के शासक ग्रह मित्र या एक ही ग्रह हैं, तो दोष प्रभाव कम हो जाता है। जैसे दोनों नक्षत्र गुरु-शासित (पुनर्वसु + विशाखा) एक ही राज्जु में = कम प्रभाव।' },
  },
  {
    condition: { en: 'Benefic aspects on the 7th house in both charts', hi: 'दोनों कुण्डलियों में 7वें भाव पर शुभ दृष्टि' },
    explanation: { en: 'Jupiter\'s aspect on the 7th house of either or both charts provides divine protection to the marriage, weakening Rajju dosha effects.', hi: 'किसी भी या दोनों कुण्डलियों के 7वें भाव पर गुरु की दृष्टि विवाह को दैवी सुरक्षा देती है, राज्जु दोष प्रभाव को कमजोर करती है।' },
  },
  {
    condition: { en: 'Different padas (quarters) within the same nakshatra group', hi: 'एक ही नक्षत्र समूह के भीतर भिन्न पाद (चरण)' },
    explanation: { en: 'Some South Indian traditions consider that if both nakshatras are in the same Rajju but in different padas, the dosha is lessened --- though not all traditions accept this relaxation.', hi: 'कुछ दक्षिण भारतीय परम्पराएँ मानती हैं कि यदि दोनों नक्षत्र एक ही राज्जु में हैं लेकिन भिन्न पादों में, तो दोष कम हो जाता है --- हालांकि सभी परम्पराएँ इस छूट को स्वीकार नहीं करतीं।' },
  },
];

// ─── Nakshatra Name Lookup (English only for table) ─────────────────────────
const NAKSHATRA_NAMES: Record<number, string> = {
  1: 'Ashwini', 2: 'Bharani', 3: 'Krittika', 4: 'Rohini', 5: 'Mrigashira',
  6: 'Ardra', 7: 'Punarvasu', 8: 'Pushya', 9: 'Ashlesha', 10: 'Magha',
  11: 'P.Phalguni', 12: 'U.Phalguni', 13: 'Hasta', 14: 'Chitra', 15: 'Swati',
  16: 'Vishakha', 17: 'Anuradha', 18: 'Jyeshtha', 19: 'Mula', 20: 'P.Ashadha',
  21: 'U.Ashadha', 22: 'Shravana', 23: 'Dhanishtha', 24: 'Shatabhisha',
  25: 'P.Bhadrapada', 26: 'U.Bhadrapada', 27: 'Revati',
};

const RAJJU_GROUP_LABELS: Record<RajjuGroup, { en: string; color: string }> = {
  pada: { en: 'Pada (Feet)', color: 'text-cyan-400' },
  kati: { en: 'Kati (Waist)', color: 'text-amber-400' },
  nabhi: { en: 'Nabhi (Navel)', color: 'text-orange-400' },
  kantha: { en: 'Kantha (Neck)', color: 'text-red-400' },
  shiro: { en: 'Shiro (Head)', color: 'text-rose-400' },
};

const SEVERITY_LABELS: Record<string, { en: string; color: string }> = {
  mild: { en: 'Mild', color: 'text-emerald-400' },
  moderate: { en: 'Moderate', color: 'text-amber-400' },
  severe: { en: 'Severe', color: 'text-red-400' },
};

// ─── Flowchart Steps ────────────────────────────────────────────────────────
const FLOWCHART_STEPS: { label: LocaleText; outcome: LocaleText; yes?: string; no?: string; color: string }[] = [
  { label: { en: '1. Ashta Kuta score >= 18/36?', hi: '1. अष्ट कूट अंक >= 18/36?' }, outcome: { en: 'Minimum threshold met', hi: 'न्यूनतम सीमा पूरी' }, yes: 'proceed', no: 'reject', color: 'border-gold-primary/30' },
  { label: { en: '2. Check Rajju Dosha (same Rajju group?)', hi: '2. राज्जु दोष जांचें (एक ही राज्जु समूह?)' }, outcome: { en: 'Rajju check', hi: 'राज्जु जांच' }, yes: 'dosha', no: 'clear', color: 'border-amber-500/30' },
  { label: { en: '3. If Rajju Dosha: Is it Kantha or Shiro?', hi: '3. यदि राज्जु दोष: क्या कण्ठ या शिर है?' }, outcome: { en: 'Severity check', hi: 'गम्भीरता जांच' }, yes: 'consult', no: 'check-cancel', color: 'border-red-500/30' },
  { label: { en: '4. Cancellation conditions apply?', hi: '4. निरसन शर्तें लागू हैं?' }, outcome: { en: 'Override check', hi: 'ओवरराइड जांच' }, yes: 'proceed', no: 'consult', color: 'border-emerald-500/30' },
  { label: { en: '5. Compare Dasha timelines (next 10-20 years)', hi: '5. दशा समयरेखाओं की तुलना करें (अगले 10-20 वर्ष)' }, outcome: { en: 'Temporal compatibility', hi: 'कालिक अनुकूलता' }, color: 'border-purple-500/30' },
  { label: { en: '6. 50%+ aligned = strong match', hi: '6. 50%+ संरेखित = मजबूत मिलान' }, outcome: { en: 'Final assessment', hi: 'अन्तिम मूल्यांकन' }, color: 'border-emerald-500/30' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function Glass({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gold-primary/10 bg-card-dark/60 backdrop-blur-md shadow-lg shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ title, icon: Icon, color }: { title: string; icon: LucideIcon; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-xl bg-gold-primary/10 border border-gold-primary/20">
        <Icon className="w-5 h-5" color={color} />
      </div>
      <h2 className="text-xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function LearnCompatibilityAdvancedPage() {
  const locale = useLocale();
  const t = (key: string) => lt(L[key], locale);
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedRajju, setExpandedRajju] = useState<number | null>(0);
  const [showNakshatraTable, setShowNakshatraTable] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* ═══ Hero ═══ */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/25 text-gold-primary text-xs font-medium tracking-wider uppercase mb-2">
          Advanced Matching
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light leading-tight" style={headingFont}>
          {t('title')}
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════════
           PART 1: DASHA COMPARISON
           ═══════════════════════════════════════════════════════════════════════ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#1a2040]/60 via-[#0f1530]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-5">
        <SectionHeader title={t('part1Title')} icon={Timer} color="#34d399" />

        {/* 1.1 Introduction */}
        <div className="space-y-3">
          <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider">{t('dashaIntroTitle')}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{t('dashaIntroP1')}</p>
          <p className="text-text-secondary text-sm leading-relaxed">{t('dashaIntroP2')}</p>
        </div>

        {/* 1.2 Method */}
        <div className="space-y-3 pt-2 border-t border-gold-primary/8">
          <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider">{t('dashaMethodTitle')}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{t('dashaMethodP1')}</p>
          <div className="space-y-2">
            {DASHA_STEPS.map((s) => (
              <div key={s.step} className="flex items-start gap-3 p-3 rounded-xl bg-bg-primary/50 border border-gold-primary/6">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </span>
                <span className="text-text-secondary text-sm leading-relaxed">{lt(s.text, locale)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 1.3 Interpretation Rules */}
        <div className="space-y-3 pt-2 border-t border-gold-primary/8">
          <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider">{t('dashaRulesTitle')}</h3>
          <div className="space-y-2">
            {DASHA_RULES.map((rule, i) => {
              const qColor = rule.quality === 'good' ? 'border-emerald-500/20 bg-emerald-500/5' : rule.quality === 'hard' ? 'border-red-500/20 bg-red-500/5' : 'border-amber-500/20 bg-amber-500/5';
              const QIcon = rule.quality === 'good' ? CheckCircle : rule.quality === 'hard' ? XCircle : HelpCircle;
              const qIconColor = rule.quality === 'good' ? 'text-emerald-400' : rule.quality === 'hard' ? 'text-red-400' : 'text-amber-400';
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${qColor}`}>
                  <QIcon className={`w-4 h-4 shrink-0 mt-0.5 ${qIconColor}`} />
                  <span className="text-text-secondary text-sm leading-relaxed">{lt(rule.rule, locale)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dasha Sandhi */}
        <div className="space-y-3 pt-2 border-t border-gold-primary/8">
          <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider">{t('dashaSandhiTitle')}</h3>
          <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/5">
            <p className="text-text-secondary text-sm leading-relaxed">{t('dashaSandhiP1')}</p>
          </div>
        </div>

        {/* Dasha Timeline Visual */}
        <div className="space-y-3 pt-2 border-t border-gold-primary/8">
          <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Dasha Timeline Comparison (Illustration)</h3>
          <div className="p-4 rounded-xl bg-bg-primary/70 border border-gold-primary/10 space-y-4">
            {/* Person A */}
            <div>
              <div className="text-xs text-text-tertiary mb-1.5">Person A</div>
              <div className="flex rounded-lg overflow-hidden h-8 border border-gold-primary/10">
                <div className="flex items-center justify-center text-[10px] font-medium text-white bg-emerald-600/70" style={{ width: '30%' }}>Jupiter</div>
                <div className="flex items-center justify-center text-[10px] font-medium text-white bg-purple-600/70" style={{ width: '25%' }}>Saturn</div>
                <div className="flex items-center justify-center text-[10px] font-medium text-white bg-sky-600/70" style={{ width: '25%' }}>Mercury</div>
                <div className="flex items-center justify-center text-[10px] font-medium text-white bg-red-600/70" style={{ width: '20%' }}>Ketu</div>
              </div>
            </div>
            {/* Person B */}
            <div>
              <div className="text-xs text-text-tertiary mb-1.5">Person B</div>
              <div className="flex rounded-lg overflow-hidden h-8 border border-gold-primary/10">
                <div className="flex items-center justify-center text-[10px] font-medium text-white bg-pink-600/70" style={{ width: '35%' }}>Venus</div>
                <div className="flex items-center justify-center text-[10px] font-medium text-white bg-amber-600/70" style={{ width: '15%' }}>Sun</div>
                <div className="flex items-center justify-center text-[10px] font-medium text-white bg-emerald-600/70" style={{ width: '30%' }}>Jupiter</div>
                <div className="flex items-center justify-center text-[10px] font-medium text-white bg-purple-600/70" style={{ width: '20%' }}>Saturn</div>
              </div>
            </div>
            {/* Alignment bar */}
            <div>
              <div className="text-xs text-text-tertiary mb-1.5">Alignment</div>
              <div className="flex rounded-lg overflow-hidden h-5 border border-gold-primary/10">
                <div className="bg-emerald-500/40" style={{ width: '30%' }} title="Aligned: Both benefic" />
                <div className="bg-amber-500/40" style={{ width: '15%' }} title="Mixed: Neutral" />
                <div className="bg-red-500/40" style={{ width: '10%' }} title="Tension" />
                <div className="bg-amber-500/40" style={{ width: '15%' }} title="Mixed" />
                <div className="bg-emerald-500/40" style={{ width: '10%' }} title="Aligned" />
                <div className="bg-red-500/40" style={{ width: '20%' }} title="Tension: Both malefic" />
              </div>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-text-tertiary">
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-emerald-500/50" /> Aligned</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-amber-500/50" /> Mixed</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-red-500/50" /> Tension</span>
              </div>
            </div>
          </div>
        </div>

        {/* Worked Example */}
        <div className="space-y-3 pt-2 border-t border-gold-primary/8">
          <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider">{t('dashaExampleTitle')}</h3>
          <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5">
            <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Aligned Example</div>
            <p className="text-text-secondary text-sm leading-relaxed">{t('dashaExampleP1')}</p>
          </div>
          <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/5">
            <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Tension Example</div>
            <p className="text-text-secondary text-sm leading-relaxed">{t('dashaExampleP2')}</p>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════════
           PART 2: RAJJU DOSHA
           ═══════════════════════════════════════════════════════════════════════ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-5">
        <SectionHeader title={t('part2Title')} icon={Layers} color="#f59e0b" />

        {/* 2.1 Introduction */}
        <div className="space-y-3">
          <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider">{t('rajjuIntroTitle')}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{t('rajjuIntroP1')}</p>
          <p className="text-text-secondary text-sm leading-relaxed">{t('rajjuIntroP2')}</p>
        </div>

        {/* 2.2 The Five Categories */}
        <div className="space-y-3 pt-2 border-t border-gold-primary/8">
          <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider">{t('rajjuCategoriesTitle')}</h3>

          {/* Body diagram SVG */}
          <div className="flex justify-center py-4">
            <svg viewBox="0 0 200 340" className="w-48 h-auto" aria-label="Rajju body diagram showing nakshatra assignments to five body regions">
              {/* Head */}
              <circle cx="100" cy="30" r="22" fill="none" stroke="rgb(244,63,94)" strokeWidth="1.5" opacity="0.6" />
              <text x="100" y="34" textAnchor="middle" fill="rgb(244,63,94)" fontSize="9" fontWeight="bold">Shiro</text>
              {/* Neck */}
              <rect x="85" y="55" width="30" height="30" rx="4" fill="none" stroke="rgb(248,113,113)" strokeWidth="1.5" opacity="0.6" />
              <text x="100" y="74" textAnchor="middle" fill="rgb(248,113,113)" fontSize="8" fontWeight="bold">Kantha</text>
              {/* Navel */}
              <ellipse cx="100" cy="120" rx="35" ry="25" fill="none" stroke="rgb(251,146,60)" strokeWidth="1.5" opacity="0.6" />
              <text x="100" y="124" textAnchor="middle" fill="rgb(251,146,60)" fontSize="8" fontWeight="bold">Nabhi</text>
              {/* Waist */}
              <rect x="60" y="160" width="80" height="30" rx="8" fill="none" stroke="rgb(251,191,36)" strokeWidth="1.5" opacity="0.6" />
              <text x="100" y="179" textAnchor="middle" fill="rgb(251,191,36)" fontSize="8" fontWeight="bold">Kati</text>
              {/* Legs */}
              <line x1="80" y1="195" x2="70" y2="290" stroke="rgb(34,211,238)" strokeWidth="1.5" opacity="0.6" />
              <line x1="120" y1="195" x2="130" y2="290" stroke="rgb(34,211,238)" strokeWidth="1.5" opacity="0.6" />
              {/* Feet */}
              <ellipse cx="65" cy="300" rx="18" ry="10" fill="none" stroke="rgb(34,211,238)" strokeWidth="1.5" opacity="0.6" />
              <ellipse cx="135" cy="300" rx="18" ry="10" fill="none" stroke="rgb(34,211,238)" strokeWidth="1.5" opacity="0.6" />
              <text x="100" y="325" textAnchor="middle" fill="rgb(34,211,238)" fontSize="9" fontWeight="bold">Pada</text>

              {/* Severity labels */}
              <text x="170" y="34" textAnchor="start" fill="rgb(244,63,94)" fontSize="7" opacity="0.8">Severe</text>
              <text x="170" y="74" textAnchor="start" fill="rgb(248,113,113)" fontSize="7" opacity="0.8">Severe</text>
              <text x="170" y="124" textAnchor="start" fill="rgb(251,146,60)" fontSize="7" opacity="0.8">Moderate</text>
              <text x="170" y="179" textAnchor="start" fill="rgb(251,191,36)" fontSize="7" opacity="0.8">Mild</text>
              <text x="170" y="325" textAnchor="start" fill="rgb(34,211,238)" fontSize="7" opacity="0.8">Mild</text>
            </svg>
          </div>

          {/* Category Accordions */}
          <div className="space-y-2">
            {RAJJU_CATEGORIES.map((cat, i) => (
              <div key={cat.group} className={`rounded-xl border ${cat.bgColor} overflow-hidden`}>
                <button
                  onClick={() => setExpandedRajju(expandedRajju === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${cat.color}`}>{lt(cat.bodyPart, locale)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${SEVERITY_LABELS[cat.severity].color} bg-bg-primary/50`}>
                      {SEVERITY_LABELS[cat.severity].en}
                    </span>
                    <span className="text-text-tertiary text-xs">
                      {cat.nakshatraIds.map(id => NAKSHATRA_NAMES[id]).join(', ')}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${expandedRajju === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedRajju === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        <div className="p-3 rounded-lg bg-bg-primary/40">
                          <div className={`text-xs uppercase tracking-wider font-bold mb-1 ${cat.color}`}>Classical Interpretation</div>
                          <p className="text-text-secondary text-sm leading-relaxed">{lt(cat.classicalMeaning, locale)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-bg-primary/40">
                          <div className="text-xs uppercase tracking-wider font-bold mb-1 text-emerald-400">Modern Perspective</div>
                          <p className="text-text-secondary text-sm leading-relaxed">{lt(cat.modernMeaning, locale)}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* 2.3 Matching Rules */}
        <div className="space-y-3 pt-2 border-t border-gold-primary/8">
          <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider">{t('rajjuMatchingTitle')}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{t('rajjuMatchingP1')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'Same Pada/Kati Rajju', severity: 'Mild', icon: AlertTriangle, color: 'text-amber-400', border: 'border-amber-500/20 bg-amber-500/5', desc: 'Wandering or financial stress --- manageable' },
              { label: 'Same Nabhi Rajju', severity: 'Moderate', icon: AlertTriangle, color: 'text-orange-400', border: 'border-orange-500/20 bg-orange-500/5', desc: 'Progeny concerns --- remedies recommended' },
              { label: 'Same Kantha Rajju', severity: 'Severe', icon: XCircle, color: 'text-red-400', border: 'border-red-500/20 bg-red-500/5', desc: 'Wife\'s health risk --- consult jyotishi' },
              { label: 'Same Shiro Rajju', severity: 'Severe', icon: XCircle, color: 'text-rose-400', border: 'border-rose-500/20 bg-rose-500/5', desc: 'Husband\'s health risk --- consult jyotishi' },
            ].map((item) => (
              <div key={item.label} className={`p-3 rounded-xl border ${item.border}`}>
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  <span className={`text-xs font-bold ${item.color}`}>{item.label}</span>
                  <span className={`text-[10px] ml-auto ${item.color}`}>{item.severity}</span>
                </div>
                <p className="text-text-tertiary text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2.4 Full Nakshatra Table */}
        <div className="space-y-3 pt-2 border-t border-gold-primary/8">
          <button
            onClick={() => setShowNakshatraTable(v => !v)}
            className="flex items-center gap-2 text-gold-primary text-sm font-bold uppercase tracking-wider"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showNakshatraTable ? 'rotate-180' : ''}`} />
            {t('rajjuTableTitle')}
          </button>
          <AnimatePresence>
            {showNakshatraTable && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gold-primary/15">
                        <th className="text-left py-2 px-3 text-text-tertiary font-medium">#</th>
                        <th className="text-left py-2 px-3 text-text-tertiary font-medium">Nakshatra</th>
                        <th className="text-left py-2 px-3 text-text-tertiary font-medium">Rajju Group</th>
                        <th className="text-left py-2 px-3 text-text-tertiary font-medium">Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 27 }, (_, i) => i + 1).map((id) => {
                        const group = NAKSHATRA_RAJJU[id];
                        const groupInfo = RAJJU_GROUP_LABELS[group];
                        const severity = group === 'pada' || group === 'kati' ? 'mild' : group === 'nabhi' ? 'moderate' : 'severe';
                        return (
                          <tr key={id} className="border-b border-gold-primary/5 hover:bg-gold-primary/3 transition-colors">
                            <td className="py-2 px-3 text-text-tertiary">{id}</td>
                            <td className="py-2 px-3 text-text-secondary font-medium">{NAKSHATRA_NAMES[id]}</td>
                            <td className={`py-2 px-3 font-medium ${groupInfo.color}`}>{groupInfo.en}</td>
                            <td className={`py-2 px-3 font-medium ${SEVERITY_LABELS[severity].color}`}>{SEVERITY_LABELS[severity].en}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2.5 Cancellation */}
        <div className="space-y-3 pt-2 border-t border-gold-primary/8">
          <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider">{t('rajjuCancellationTitle')}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{t('rajjuCancellationP1')}</p>
          <div className="space-y-2">
            {CANCELLATIONS.map((c, i) => (
              <div key={i} className="p-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 text-xs font-bold">{lt(c.condition, locale)}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed pl-5.5">{lt(c.explanation, locale)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2.6 Worked Example */}
        <div className="space-y-3 pt-2 border-t border-gold-primary/8">
          <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider">{t('rajjuExampleTitle')}</h3>
          <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/5">
            <div className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-2">Pada Rajju Match (Mild)</div>
            <p className="text-text-secondary text-sm leading-relaxed">{t('rajjuExampleP1')}</p>
          </div>
          <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/5">
            <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Kantha Rajju Match (Severe)</div>
            <p className="text-text-secondary text-sm leading-relaxed">{t('rajjuExampleP2')}</p>
          </div>
        </div>
      </motion.section>

      {/* ═══ Decision Flowchart ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#1a2040]/60 via-[#0f1530]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('flowchartTitle')}</h2>
        <div className="space-y-2">
          {FLOWCHART_STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-lg border ${step.color} bg-bg-primary/50 flex items-center justify-center text-xs font-bold text-text-secondary`}>
                  {i + 1}
                </div>
                {i < FLOWCHART_STEPS.length - 1 && <div className="w-px h-6 bg-gold-primary/15" />}
              </div>
              <div className="pt-1.5">
                <span className="text-text-primary text-sm font-medium">{lt(step.label, locale)}</span>
                {step.yes && (
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-text-tertiary">
                    <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3 text-emerald-400" /> Yes: {step.yes}</span>
                    <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3 text-red-400" /> No: {step.no}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Links ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>{t('linksTitle')}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/matching', label: { en: 'Compatibility Matching', hi: 'अनुकूलता मिलान' } },
            { href: '/learn/compatibility', label: { en: 'Advanced Compatibility (Ashta Kuta+)', hi: 'उन्नत अनुकूलता (अष्ट कूट+)' } },
            { href: '/learn/dashas', label: { en: 'Learn Dashas', hi: 'दशाएं सीखें' } },
            { href: '/learn/nakshatras', label: { en: 'Learn Nakshatras', hi: 'नक्षत्र सीखें' } },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium">
              {lt(link.label as LocaleText, locale)} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
