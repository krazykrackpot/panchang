'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Layers, Crosshair, BookOpen, FlaskConical, Scale, Clock } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { computeNadiAmsha } from '@/lib/kundali/nadi-amsha';

// ─── Inline LABELS ───────────────────────────────────────────────────────────
const LABELS: Record<string, { en: string; hi: string }> = {
  title: {
    en: 'Nadi Amsha (D-150)',
    hi: 'नाडी अंश (डी-150)',
  },
  subtitle: {
    en: 'The Finest Divisional Chart in Vedic Astrology',
    hi: 'वैदिक ज्योतिष का सूक्ष्मतम वर्ग चार्ट',
  },
  introTitle: {
    en: 'What is Nadi Amsha?',
    hi: 'नाडी अंश क्या है?',
  },
  introP1: {
    en: 'Nadi Amsha is the 150th divisional chart (D-150) in Vedic astrology — the finest division of the zodiac used in classical Jyotish. Each of the 12 signs (30 degrees) is divided into 150 equal parts, making each Nadi Amsha span exactly 0.2 degrees, or 12 arc-minutes.',
    hi: 'नाडी अंश वैदिक ज्योतिष का 150वाँ विभागीय चार्ट (D-150) है — शास्त्रीय ज्योतिष में राशिचक्र का सूक्ष्मतम विभाजन। प्रत्येक 12 राशियों (30 अंश) को 150 समान भागों में विभाजित किया जाता है, जिससे प्रत्येक नाडी अंश ठीक 0.2 अंश या 12 कला-मिनट का होता है।',
  },
  introP2: {
    en: 'The name "Nadi" connects this chart to the ancient Nadi astrology tradition of South India, where palm-leaf manuscripts describe individual destinies with extraordinary precision. The D-150 chart embodies this same quest for granularity — at 0.2 degrees per division, even twins born minutes apart can have different Nadi Amsha placements.',
    hi: '"नाडी" नाम इस चार्ट को दक्षिण भारत की प्राचीन नाडी ज्योतिष परम्परा से जोड़ता है, जहाँ ताड़पत्र पाण्डुलिपियाँ असाधारण सटीकता से व्यक्तिगत भाग्य का वर्णन करती हैं। D-150 चार्ट सूक्ष्मता की इसी खोज का प्रतिनिधित्व करता है — प्रति विभाजन 0.2 अंश पर, मिनटों के अन्तर से जन्मे जुड़वाँ बच्चों की भी अलग-अलग नाडी अंश स्थितियाँ हो सकती हैं।',
  },
  introP3: {
    en: 'Classical sources for D-150 include the Tajika Neelakanthi and the Chandra Kala Nadi. While Parashara mentions divisional charts up to D-60 (Shashtiamsha) in detail, the Nadi tradition extended this framework to 150 divisions to capture the most subtle karmic imprints of the soul.',
    hi: 'D-150 के शास्त्रीय स्रोतों में ताजिक नीलकण्ठी और चन्द्रकला नाडी शामिल हैं। जबकि पराशर ने D-60 (षष्ट्यंश) तक विभागीय चार्ट का विस्तृत वर्णन किया है, नाडी परम्परा ने आत्मा के सूक्ष्मतम कार्मिक संस्कारों को पकड़ने के लिए इसे 150 विभाजनों तक विस्तारित किया।',
  },
  calcTitle: {
    en: 'Calculation Method',
    hi: 'गणना विधि',
  },
  calcStep1Title: {
    en: 'Step 1: Find the degree within the sign',
    hi: 'चरण 1: राशि के अन्दर अंश ज्ञात करें',
  },
  calcStep1: {
    en: 'Given a planet\'s sidereal longitude, subtract the sign boundary. For example, a planet at 15\u00b024\' Aries: the degree within Aries = 15.4\u00b0 (since 24\' = 0.4\u00b0).',
    hi: 'ग्रह की निरयन देशान्तर से राशि सीमा घटाएँ। उदाहरण: मेष में 15\u00b024\' पर ग्रह: मेष के अन्दर अंश = 15.4\u00b0 (क्योंकि 24\' = 0.4\u00b0)।',
  },
  calcStep2Title: {
    en: 'Step 2: Multiply by 5 to get the Nadi Amsha number',
    hi: 'चरण 2: नाडी अंश संख्या प्राप्त करने के लिए 5 से गुणा करें',
  },
  calcStep2: {
    en: 'Each Nadi Amsha spans 0.2\u00b0, so dividing the degree by 0.2 (or equivalently multiplying by 5) gives the index. For 15.4\u00b0: floor(15.4 \u00d7 5) + 1 = floor(77) + 1 = 78th Nadi Amsha.',
    hi: 'प्रत्येक नाडी अंश 0.2\u00b0 का होता है, अतः अंश को 0.2 से भाग (या 5 से गुणा) करने से सूचकांक मिलता है। 15.4\u00b0 के लिए: floor(15.4 \u00d7 5) + 1 = floor(77) + 1 = 78वाँ नाडी अंश।',
  },
  calcStep3Title: {
    en: 'Step 3: Map to the Nadi sign',
    hi: 'चरण 3: नाडी राशि में मैप करें',
  },
  calcStep3: {
    en: 'The 150 divisions cycle through the 12 signs repeatedly (150 / 12 = 12 full cycles + 6 remainder). For ODD signs (Aries, Gemini, Leo, etc.): count forward from Aries. For EVEN signs (Taurus, Cancer, Virgo, etc.): count backward from Pisces. The 78th Nadi Amsha in Aries (odd sign): (78-1) mod 12 = 5, so sign index 5+1 = 6 = Virgo.',
    hi: '150 विभाजन 12 राशियों में चक्रीय रूप से दोहराए जाते हैं (150 / 12 = 12 पूर्ण चक्र + 6 शेष)। विषम राशियों (मेष, मिथुन, सिंह आदि) के लिए: मेष से आगे गिनें। सम राशियों (वृषभ, कर्क, कन्या आदि) के लिए: मीन से पीछे गिनें। मेष (विषम राशि) में 78वाँ नाडी अंश: (78-1) mod 12 = 5, अतः राशि सूचकांक 5+1 = 6 = कन्या।',
  },
  workedTitle: {
    en: 'Worked Example',
    hi: 'हल किया हुआ उदाहरण',
  },
  workedDesc: {
    en: 'Planet at 15\u00b024\' Aries (sidereal longitude 15.4\u00b0)',
    hi: 'मेष में 15\u00b024\' पर ग्रह (निरयन देशान्तर 15.4\u00b0)',
  },
  tableTitle: {
    en: 'First 12 Nadi Divisions of Aries',
    hi: 'मेष की प्रथम 12 नाडी विभाजन',
  },
  significanceTitle: {
    en: 'Why Such Fine Divisions Matter',
    hi: 'इतने सूक्ष्म विभाजन क्यों महत्वपूर्ण हैं',
  },
  sigTwin: {
    en: 'Twin Differentiation',
    hi: 'जुड़वाँ विभेदन',
  },
  sigTwinDesc: {
    en: 'Standard divisional charts (D-1 through D-9) often show identical placements for twins born within 10-15 minutes. D-150 changes sign every 48 seconds of arc — roughly every 3.2 seconds of clock time at the equator. This makes it the only varga capable of reliably distinguishing twin charts.',
    hi: 'मानक विभागीय चार्ट (D-1 से D-9) प्रायः 10-15 मिनट के अन्तर से जन्मे जुड़वाँ बच्चों के लिए समान स्थितियाँ दिखाते हैं। D-150 प्रत्येक 48 कला-सेकण्ड — भूमध्य रेखा पर लगभग प्रत्येक 3.2 घड़ी-सेकण्ड — पर राशि बदलता है। यह एकमात्र वर्ग है जो जुड़वाँ चार्ट को विश्वसनीय रूप से अलग कर सकता है।',
  },
  sigKarma: {
    en: 'Subtle Karmic Imprints',
    hi: 'सूक्ष्म कार्मिक संस्कार',
  },
  sigKarmaDesc: {
    en: 'While D-1 shows the broad life pattern and D-9 reveals the soul\'s deeper purpose, D-150 captures the finest karmic threads — past-life tendencies so subtle that they manifest as unconscious habits, inexplicable attractions, and seemingly random talents. Each planet\'s Nadi Amsha sign reveals a specific domain of past-life mastery or debt.',
    hi: 'जबकि D-1 व्यापक जीवन पैटर्न दिखाता है और D-9 आत्मा के गहरे उद्देश्य को प्रकट करता है, D-150 सूक्ष्मतम कार्मिक धागों को पकड़ता है — पूर्वजन्म की इतनी सूक्ष्म प्रवृत्तियाँ जो अचेतन आदतों, अकथनीय आकर्षणों और प्रतीत होने वाली यादृच्छिक प्रतिभाओं के रूप में प्रकट होती हैं।',
  },
  sigNaadi: {
    en: 'Connection to Naadi Astrology',
    hi: 'नाडी ज्योतिष से सम्बन्ध',
  },
  sigNaadiDesc: {
    en: 'The Naadi tradition of Tamil Nadu uses palm-leaf manuscripts (attributed to sages like Brighu, Agastya, and Vasishtha) that predict individual lives with astonishing specificity. While their exact computational method remains debated, the precision of D-150 aligns naturally with their granularity — and many modern practitioners use D-150 as the computational analog of what the Naadi sages perceived intuitively.',
    hi: 'तमिलनाडु की नाडी परम्परा ताड़पत्र पाण्डुलिपियों (ऋषि भृगु, अगस्त्य और वसिष्ठ को श्रेय) का उपयोग करती है जो आश्चर्यजनक विशिष्टता से व्यक्तिगत जीवन की भविष्यवाणी करती हैं। जबकि उनकी सटीक गणना विधि पर बहस जारी है, D-150 की सटीकता स्वाभाविक रूप से उनकी सूक्ष्मता से मेल खाती है।',
  },
  sigVsD60: {
    en: 'D-150 vs D-60 (Shashtiamsha)',
    hi: 'D-150 बनाम D-60 (षष्ट्यंश)',
  },
  sigVsD60Desc: {
    en: 'D-60 divides each sign into 60 parts (0.5\u00b0 each) and is widely used for karmic analysis. D-150 provides 2.5 times the resolution. Where D-60 might place two planets in the same division, D-150 separates them — revealing finer distinctions in karmic inheritance. However, this extreme precision demands correspondingly accurate birth times.',
    hi: 'D-60 प्रत्येक राशि को 60 भागों (0.5\u00b0 प्रत्येक) में विभाजित करता है और कार्मिक विश्लेषण के लिए व्यापक रूप से उपयोग किया जाता है। D-150 2.5 गुना अधिक विभेदन प्रदान करता है। जहाँ D-60 दो ग्रहों को एक ही विभाजन में रख सकता है, D-150 उन्हें अलग करता है। हालाँकि, इस अत्यधिक सटीकता के लिए तदनुरूप सटीक जन्म समय आवश्यक है।',
  },
  interpTitle: {
    en: 'Interpretation Principles',
    hi: 'व्याख्या सिद्धान्त',
  },
  interpDignity: {
    en: 'Planet Dignity in Nadi Amsha',
    hi: 'नाडी अंश में ग्रह गरिमा',
  },
  interpDignityDesc: {
    en: 'A planet that lands in its own sign or exaltation sign in D-150 carries exceptionally deep karmic merit. Conversely, debilitation in D-150 points to a very specific past-life weakness. Because D-150 is so fine-grained, these dignities represent the most nuanced layer of a planet\'s total strength — they are the "last decimal place" of Vimshopaka Bala.',
    hi: 'D-150 में अपनी या उच्च राशि में स्थित ग्रह असाधारण रूप से गहरा कार्मिक पुण्य रखता है। इसके विपरीत, D-150 में नीच राशि एक बहुत विशिष्ट पूर्वजन्म की दुर्बलता की ओर इशारा करती है। चूँकि D-150 इतना सूक्ष्म है, ये गरिमाएँ ग्रह की कुल शक्ति की सबसे सूक्ष्म परत का प्रतिनिधित्व करती हैं।',
  },
  interpWhen: {
    en: 'When to Use D-150 vs Other Vargas',
    hi: 'D-150 बनाम अन्य वर्गों का उपयोग कब करें',
  },
  interpWhenDesc: {
    en: 'Use D-150 when (a) birth time is known to the second, (b) you need to differentiate twins, (c) other vargas show near-identical charts and you need a tiebreaker, or (d) investigating deep karmic patterns not visible in D-9 or D-60. Do NOT rely on D-150 when birth time has more than \u00b12 minutes of uncertainty — the 0.2\u00b0 divisions make it meaningless with approximate times.',
    hi: 'D-150 का उपयोग करें जब (क) जन्म समय सेकण्ड तक ज्ञात हो, (ख) जुड़वाँ बच्चों को अलग करना हो, (ग) अन्य वर्ग लगभग समान चार्ट दिखाएँ, या (घ) D-9 या D-60 में दिखाई न देने वाले गहरे कार्मिक पैटर्न की जाँच हो। जब जन्म समय में \u00b12 मिनट से अधिक अनिश्चितता हो तो D-150 पर निर्भर न रहें।',
  },
  interpVimshopaka: {
    en: 'Integration with Vimshopaka Strength',
    hi: 'विम्शोपक बल के साथ एकीकरण',
  },
  interpVimshopakaDesc: {
    en: 'In the Shodasha Varga scheme (16 divisional charts), D-150 is not included in the standard Vimshopaka calculation. However, some practitioners use it as a supplementary dignity check — if a planet is strong in Vimshopaka but debilitated in D-150, they note a subtle karmic weakness. The Nadi Amsha acts as a final filter of spiritual quality.',
    hi: 'षोडश वर्ग योजना (16 विभागीय चार्ट) में D-150 मानक विम्शोपक गणना में शामिल नहीं है। हालाँकि, कुछ अभ्यासकर्ता इसे पूरक गरिमा जाँच के रूप में उपयोग करते हैं — यदि कोई ग्रह विम्शोपक में बलवान पर D-150 में नीच है, तो वे एक सूक्ष्म कार्मिक दुर्बलता नोट करते हैं।',
  },
  classicalTitle: {
    en: 'Classical Text References',
    hi: 'शास्त्रीय ग्रन्थ सन्दर्भ',
  },
  classicalTajika: {
    en: 'Tajika Neelakanthi',
    hi: 'ताजिक नीलकण्ठी',
  },
  classicalTajikaDesc: {
    en: 'The Tajika Neelakanthi, composed by Neelakantha in the 16th century, is one of the primary sources that discusses the 150-fold division. While Tajika texts are often associated with Perso-Arabic annual chart techniques (Varshaphal), Neelakantha\'s treatment of sub-divisions draws on the Nadi tradition and provides the computational framework used today.',
    hi: '16वीं शताब्दी में नीलकण्ठ द्वारा रचित ताजिक नीलकण्ठी, 150 गुना विभाजन पर चर्चा करने वाले प्राथमिक स्रोतों में से एक है। जबकि ताजिक ग्रन्थ प्रायः फ़ारसी-अरबी वार्षिक चार्ट तकनीकों (वर्षफल) से जुड़े हैं, नीलकण्ठ का उप-विभाजनों का उपचार नाडी परम्परा पर आधारित है।',
  },
  classicalNadi: {
    en: 'The Nadi Tradition',
    hi: 'नाडी परम्परा',
  },
  classicalNadiDesc: {
    en: 'The Chandra Kala Nadi (attributed to sage Achyuta) and the Brighu Nandi Nadi are palm-leaf compilations from Tamil Nadu that describe individual destinies based on extremely fine planetary positions. The Brighu Nandi Nadi specifically correlates planetary positions at the sub-degree level with life events — a methodology that maps naturally onto D-150 divisions. Modern scholars consider D-150 the mathematical formalization of what these Nadi texts describe qualitatively.',
    hi: 'चन्द्रकला नाडी (ऋषि अच्युत को श्रेय) और भृगु नन्दी नाडी तमिलनाडु की ताड़पत्र संकलन हैं जो अत्यन्त सूक्ष्म ग्रह स्थितियों के आधार पर व्यक्तिगत भाग्य का वर्णन करती हैं। भृगु नन्दी नाडी विशेष रूप से उप-अंश स्तर पर ग्रह स्थितियों को जीवन की घटनाओं से सम्बन्धित करती है — एक पद्धति जो D-150 विभाजनों से स्वाभाविक रूप से मेल खाती है।',
  },
  modernTitle: {
    en: 'Modern Research & Applications',
    hi: 'आधुनिक शोध और अनुप्रयोग',
  },
  modernRectification: {
    en: 'Birth Time Rectification',
    hi: 'जन्म समय शोधन',
  },
  modernRectificationDesc: {
    en: 'Because D-150 changes sign every ~48 seconds of arc (~3.2 seconds of clock time), it provides the most sensitive test for birth time accuracy. Practitioners rectify birth times by checking whether D-150 placements match known life events. If the D-150 ascendant aligns with the person\'s karmic themes better at time T+30s than at T, the rectified time is preferred.',
    hi: 'चूँकि D-150 प्रत्येक ~48 कला-सेकण्ड (~3.2 घड़ी-सेकण्ड) पर राशि बदलता है, यह जन्म समय की सटीकता के लिए सबसे संवेदनशील परीक्षण प्रदान करता है। अभ्यासकर्ता यह जाँच कर जन्म समय शोधित करते हैं कि D-150 स्थितियाँ ज्ञात जीवन घटनाओं से मेल खाती हैं या नहीं।',
  },
  modernComputational: {
    en: 'Computational Challenges',
    hi: 'गणनात्मक चुनौतियाँ',
  },
  modernComputationalDesc: {
    en: 'At 0.2\u00b0 per division (720 arc-seconds), even small errors in planetary longitude become significant. The Moon moves ~0.5\u00b0/hour, meaning its Nadi Amsha changes roughly every 24 minutes. For slow planets like Saturn (~0.03\u00b0/day), the Nadi Amsha is stable for about 6.7 hours. Accurate ephemeris data and precise ayanamsha values are essential — using Lahiri vs Krishnamurti ayanamsha can shift D-150 placements by several divisions.',
    hi: 'प्रति विभाजन 0.2\u00b0 (720 कला-सेकण्ड) पर, ग्रह देशान्तर में छोटी त्रुटियाँ भी महत्वपूर्ण हो जाती हैं। चन्द्रमा ~0.5\u00b0/घण्टा चलता है, अर्थात् इसका नाडी अंश लगभग प्रत्येक 24 मिनट में बदलता है। शनि जैसे मन्द ग्रहों (~0.03\u00b0/दिन) के लिए, नाडी अंश लगभग 6.7 घण्टे तक स्थिर रहता है।',
  },
  modernStatistical: {
    en: 'Statistical Studies',
    hi: 'सांख्यिकीय अध्ययन',
  },
  modernStatisticalDesc: {
    en: 'Rigorous statistical validation of D-150 remains limited, primarily due to the birth-time precision required. Studies by K.N. Rao\'s school and the Nadi tradition practitioners in Chennai have shown correlations between D-150 planet dignities and major life themes, but sample sizes remain small. The chart\'s primary value remains in individual case studies where precise birth time is confirmed through multiple events.',
    hi: 'D-150 का कठोर सांख्यिकीय सत्यापन सीमित है, मुख्य रूप से आवश्यक जन्म-समय सटीकता के कारण। K.N. राव के विद्यालय और चेन्नई के नाडी परम्परा के अभ्यासकर्ताओं के अध्ययनों ने D-150 ग्रह गरिमाओं और प्रमुख जीवन विषयों के बीच सम्बन्ध दिखाए हैं, परन्तु नमूना आकार छोटे रहते हैं।',
  },
  comparisonTitle: {
    en: 'Divisional Chart Comparison',
    hi: 'विभागीय चार्ट तुलना',
  },
  divisionWheel: {
    en: 'Division Wheel: Aries (First 30 Nadi Divisions)',
    hi: 'विभाजन चक्र: मेष (प्रथम 30 नाडी विभाजन)',
  },
  liveCalcTitle: {
    en: 'Live Calculator',
    hi: 'लाइव कैलकुलेटर',
  },
  liveCalcDesc: {
    en: 'Enter a sidereal longitude to see its Nadi Amsha placement:',
    hi: 'नाडी अंश स्थिति देखने के लिए निरयन देशान्तर दर्ज करें:',
  },
  linksTitle: {
    en: 'Explore Further',
    hi: 'और जानें',
  },
};

const t = (key: string, locale: string) => {
  const obj = LABELS[key];
  if (!obj) return key;
  return (obj as Record<string, string>)[locale] || obj.en;
};

// ─── Sign Names ─────────────────────────────────────────────────────────────
const SIGN_NAMES = [
  { en: 'Aries', hi: 'मेष', sa: 'मेषम्' },
  { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभम्' },
  { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' },
  { en: 'Cancer', hi: 'कर्क', sa: 'कर्कटम्' },
  { en: 'Leo', hi: 'सिंह', sa: 'सिंहम्' },
  { en: 'Virgo', hi: 'कन्या', sa: 'कन्या' },
  { en: 'Libra', hi: 'तुला', sa: 'तुला' },
  { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकम्' },
  { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः' },
  { en: 'Capricorn', hi: 'मकर', sa: 'मकरम्' },
  { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भम्' },
  { en: 'Pisces', hi: 'मीन', sa: 'मीनम्' },
];

// ─── Comparison Table Data ──────────────────────────────────────────────────
const COMPARISON_DATA = [
  { varga: 'D-1', name: 'Rashi', span: '30\u00b0', parts: 1, use: 'Overall life pattern, personality, health' },
  { varga: 'D-9', name: 'Navamsha', span: '3\u00b020\'', parts: 9, use: 'Marriage, dharma, soul purpose' },
  { varga: 'D-60', name: 'Shashtiamsha', span: '0\u00b030\'', parts: 60, use: 'Past-life karma, deep analysis' },
  { varga: 'D-150', name: 'Nadi Amsha', span: '0\u00b012\'', parts: 150, use: 'Finest karma, twin differentiation, rectification' },
];

// ─── First 12 Nadi Divisions for Aries ──────────────────────────────────────
const ARIES_TABLE = Array.from({ length: 12 }, (_, i) => {
  const num = i + 1;
  const startDeg = (i * 0.2).toFixed(1);
  const endDeg = ((i + 1) * 0.2).toFixed(1);
  const result = computeNadiAmsha(i * 0.2 + 0.001); // tiny offset to land inside the segment
  return {
    num,
    range: `${startDeg}\u00b0 \u2013 ${endDeg}\u00b0`,
    sign: SIGN_NAMES[result.nadiSign - 1],
  };
});

// ─── Worked Example ─────────────────────────────────────────────────────────
const WORKED = computeNadiAmsha(15.4);

// ─── Section Wrapper ────────────────────────────────────────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4 ${className}`}
    >
      {children}
    </motion.section>
  );
}

// ─── SVG Division Wheel ─────────────────────────────────────────────────────
function DivisionWheel() {
  const cx = 150, cy = 150, r = 120, innerR = 70;
  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
    '#8b5cf6', '#ec4899', '#f43f5e', '#06b6d4', '#84cc16', '#a855f7',
  ];

  const slices = Array.from({ length: 30 }, (_, i) => {
    const startAngle = (i / 30) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / 30) * 2 * Math.PI - Math.PI / 2;
    const signIdx = i % 12;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(startAngle);
    const iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle);
    const iy2 = cy + innerR * Math.sin(endAngle);
    const d = `M${ix1},${iy1} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} L${ix2},${iy2} A${innerR},${innerR} 0 0,0 ${ix1},${iy1}`;
    return (
      <path key={i} d={d} fill={`${colors[signIdx]}20`} stroke={colors[signIdx]} strokeWidth={0.5} opacity={0.7}>
        <title>Nadi {i + 1}: {SIGN_NAMES[signIdx].en}</title>
      </path>
    );
  });

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
      <defs>
        <radialGradient id="wheelGlow">
          <stop offset="0%" stopColor="#d4a853" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0a0e27" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r + 5} fill="url(#wheelGlow)" />
      {slices}
      <circle cx={cx} cy={cy} r={innerR} fill="#0a0e27" stroke="#d4a853" strokeWidth={0.5} opacity={0.5} />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#f0d48a" fontSize="11" fontWeight="bold">ARIES</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#8a8478" fontSize="9">30 of 150</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill="#8a8478" fontSize="8">divisions</text>
    </svg>
  );
}

// ─── Expandable Section ─────────────────────────────────────────────────────
function ExpandableCard({ title, icon: Icon, color, children }: {
  title: string; icon: React.ComponentType<{ className?: string }>; color: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border ${color} overflow-hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gold-primary/5 transition-colors"
      >
        <Icon className="w-5 h-5 text-gold-primary shrink-0" />
        <span className="text-gold-light font-bold text-sm flex-1">{title}</span>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 text-text-secondary text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function LearnNadiAmshaPage() {
  const locale = useLocale();
  const l = (key: string) => t(key, locale);
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  // Live calculator state
  const [inputDeg, setInputDeg] = useState('15.4');
  const parsedDeg = parseFloat(inputDeg);
  const isValidDeg = !isNaN(parsedDeg) && parsedDeg >= 0 && parsedDeg < 360;
  const liveResult = isValidDeg ? computeNadiAmsha(parsedDeg) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* ═══ Hero ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-primary text-xs uppercase tracking-widest font-bold">
          <Layers className="w-4 h-4" />
          D-150
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light" style={headingFont}>
          {l('title')}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{l('subtitle')}</p>
      </motion.div>

      {/* ═══ Introduction ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{l('introTitle')}</h2>
        <p className="text-text-secondary text-sm leading-relaxed">{l('introP1')}</p>
        <p className="text-text-secondary text-sm leading-relaxed">{l('introP2')}</p>
        <p className="text-text-secondary text-sm leading-relaxed">{l('introP3')}</p>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { label: { en: 'Divisions per sign', hi: 'प्रति राशि विभाजन' }, value: '150' },
            { label: { en: 'Arc per division', hi: 'प्रति विभाजन चाप' }, value: "0.2\u00b0 (12')" },
            { label: { en: 'Total divisions', hi: 'कुल विभाजन' }, value: '1,800' },
          ].map((item, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-bg-primary/50 border border-gold-primary/10">
              <div className="text-gold-primary text-xl font-bold font-mono">{item.value}</div>
              <div className="text-text-tertiary text-xs mt-1">{tl(item.label, locale)}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ Calculation Method ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{l('calcTitle')}</h2>
        {[
          { title: l('calcStep1Title'), body: l('calcStep1'), step: 1 },
          { title: l('calcStep2Title'), body: l('calcStep2'), step: 2 },
          { title: l('calcStep3Title'), body: l('calcStep3'), step: 3 },
        ].map((s) => (
          <div key={s.step} className="flex gap-4 p-4 rounded-xl bg-bg-primary/50 border border-gold-primary/8">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-primary text-sm font-bold">
              {s.step}
            </div>
            <div>
              <div className="text-gold-light text-sm font-bold mb-1">{s.title}</div>
              <div className="text-text-secondary text-sm leading-relaxed">{s.body}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* ═══ Worked Example ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{l('workedTitle')}</h2>
        <div className="p-4 rounded-xl bg-gradient-to-r from-gold-primary/8 to-transparent border border-gold-primary/20">
          <div className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-3">{l('workedDesc')}</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: { en: 'Sign', hi: 'राशि' }, value: tl(SIGN_NAMES[WORKED.signIndex], locale) },
              { label: { en: 'Degree in sign', hi: 'राशि में अंश' }, value: `${WORKED.degreeInSign.toFixed(1)}\u00b0` },
              { label: { en: 'Nadi Amsha #', hi: 'नाडी अंश #' }, value: `${WORKED.nadiAmshaNumber}` },
              { label: { en: 'Nadi Sign', hi: 'नाडी राशि' }, value: tl(SIGN_NAMES[WORKED.nadiSign - 1], locale) },
            ].map((item, i) => (
              <div key={i} className="text-center p-3 rounded-lg bg-bg-primary/60 border border-gold-primary/10">
                <div className="text-gold-light text-lg font-bold font-mono">{item.value}</div>
                <div className="text-text-tertiary text-xs mt-1">{tl(item.label, locale)}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ Aries Table ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{l('tableTitle')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left text-gold-dark text-xs uppercase tracking-widest py-2 px-3">#</th>
                <th className="text-left text-gold-dark text-xs uppercase tracking-widest py-2 px-3">{tl({ en: 'Degree Range', hi: 'अंश सीमा' }, locale)}</th>
                <th className="text-left text-gold-dark text-xs uppercase tracking-widest py-2 px-3">{tl({ en: 'Nadi Sign', hi: 'नाडी राशि' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {ARIES_TABLE.map((row) => (
                <tr key={row.num} className="border-b border-gold-primary/6 hover:bg-gold-primary/5 transition-colors">
                  <td className="py-2 px-3 text-gold-primary font-mono font-bold">{row.num}</td>
                  <td className="py-2 px-3 text-text-secondary font-mono">{row.range}</td>
                  <td className="py-2 px-3 text-text-primary">{tl(row.sign, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-tertiary text-xs italic">
          {tl({ en: 'Note the forward cycle Aries \u2192 Pisces for odd signs. Even signs (Taurus, Cancer...) reverse: Pisces \u2192 Aries.', hi: 'ध्यान दें विषम राशियों के लिए आगे का चक्र मेष \u2192 मीन। सम राशियाँ (वृषभ, कर्क...) उलटा: मीन \u2192 मेष।' }, locale)}
        </p>
      </Section>

      {/* ═══ Significance ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{l('significanceTitle')}</h2>
        <div className="space-y-3">
          <ExpandableCard title={l('sigTwin')} icon={Crosshair} color="border-cyan-500/20">
            <p>{l('sigTwinDesc')}</p>
          </ExpandableCard>
          <ExpandableCard title={l('sigKarma')} icon={Layers} color="border-violet-500/20">
            <p>{l('sigKarmaDesc')}</p>
          </ExpandableCard>
          <ExpandableCard title={l('sigNaadi')} icon={BookOpen} color="border-amber-500/20">
            <p>{l('sigNaadiDesc')}</p>
          </ExpandableCard>
          <ExpandableCard title={l('sigVsD60')} icon={Scale} color="border-emerald-500/20">
            <p>{l('sigVsD60Desc')}</p>
          </ExpandableCard>
        </div>
      </Section>

      {/* ═══ Interpretation Principles ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{l('interpTitle')}</h2>
        <div className="space-y-4">
          {[
            { t: l('interpDignity'), d: l('interpDignityDesc'), color: 'border-l-amber-500' },
            { t: l('interpWhen'), d: l('interpWhenDesc'), color: 'border-l-cyan-500' },
            { t: l('interpVimshopaka'), d: l('interpVimshopakaDesc'), color: 'border-l-violet-500' },
          ].map((item, i) => (
            <div key={i} className={`pl-4 border-l-2 ${item.color} space-y-1`}>
              <h3 className="text-gold-light text-sm font-bold">{item.t}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ Classical References ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{l('classicalTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { t: l('classicalTajika'), d: l('classicalTajikaDesc'), icon: BookOpen },
            { t: l('classicalNadi'), d: l('classicalNadiDesc'), icon: BookOpen },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-primary/50 border border-gold-primary/10 space-y-2">
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-gold-primary" />
                <h3 className="text-gold-light text-sm font-bold">{item.t}</h3>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ Modern Research ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{l('modernTitle')}</h2>
        <div className="space-y-3">
          <ExpandableCard title={l('modernRectification')} icon={Clock} color="border-cyan-500/20">
            <p>{l('modernRectificationDesc')}</p>
          </ExpandableCard>
          <ExpandableCard title={l('modernComputational')} icon={FlaskConical} color="border-orange-500/20">
            <p>{l('modernComputationalDesc')}</p>
          </ExpandableCard>
          <ExpandableCard title={l('modernStatistical')} icon={Scale} color="border-emerald-500/20">
            <p>{l('modernStatisticalDesc')}</p>
          </ExpandableCard>
        </div>
      </Section>

      {/* ═══ Comparison Table ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{l('comparisonTitle')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                {['Varga', 'Name', 'Span', 'Parts', 'Primary Use'].map((h) => (
                  <th key={h} className="text-left text-gold-dark text-xs uppercase tracking-widest py-2 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row) => (
                <tr key={row.varga} className={`border-b border-gold-primary/6 ${row.varga === 'D-150' ? 'bg-gold-primary/8' : ''}`}>
                  <td className="py-2 px-3 text-gold-primary font-bold font-mono">{row.varga}</td>
                  <td className="py-2 px-3 text-text-primary">{row.name}</td>
                  <td className="py-2 px-3 text-text-secondary font-mono">{row.span}</td>
                  <td className="py-2 px-3 text-text-secondary font-mono">{row.parts}</td>
                  <td className="py-2 px-3 text-text-secondary text-xs">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ═══ Division Wheel ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light text-center" style={headingFont}>{l('divisionWheel')}</h2>
        <DivisionWheel />
        <p className="text-text-tertiary text-xs text-center italic">
          {tl({ en: 'Each colored slice represents one Nadi Amsha. Colors cycle through 12 signs (Aries=red, Taurus=orange, ... Pisces=purple).', hi: 'प्रत्येक रंगीन खण्ड एक नाडी अंश का प्रतिनिधित्व करता है। रंग 12 राशियों में चक्रीय रूप से दोहराते हैं।' }, locale)}
        </p>
      </Section>

      {/* ═══ Live Calculator ═══ */}
      <Section>
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{l('liveCalcTitle')}</h2>
        <p className="text-text-secondary text-sm">{l('liveCalcDesc')}</p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="space-y-1.5">
            <label className="text-text-tertiary text-xs uppercase tracking-widest">{tl({ en: 'Sidereal Longitude', hi: 'निरयन देशान्तर' }, locale)}</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={0}
                max={359.99}
                step={0.01}
                value={inputDeg}
                onChange={(e) => setInputDeg(e.target.value)}
                className="w-32 px-3 py-2 rounded-lg bg-bg-primary border border-gold-primary/20 text-gold-light font-mono text-sm focus:border-gold-primary/50 outline-none"
              />
              <span className="text-text-tertiary text-sm">{'\u00b0'}</span>
            </div>
          </div>
          {liveResult && (
            <motion.div
              key={`${liveResult.nadiAmshaNumber}-${liveResult.nadiSign}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-3 flex-wrap"
            >
              {[
                { label: { en: 'Sign', hi: 'राशि' }, value: tl(SIGN_NAMES[liveResult.signIndex], locale) },
                { label: { en: 'Deg in sign', hi: 'राशि अंश' }, value: `${liveResult.degreeInSign.toFixed(2)}\u00b0` },
                { label: { en: 'Nadi #', hi: 'नाडी #' }, value: `${liveResult.nadiAmshaNumber}` },
                { label: { en: 'Nadi Sign', hi: 'नाडी राशि' }, value: tl(SIGN_NAMES[liveResult.nadiSign - 1], locale) },
              ].map((item, i) => (
                <div key={i} className="text-center px-3 py-2 rounded-lg bg-gold-primary/8 border border-gold-primary/15">
                  <div className="text-gold-light text-sm font-bold font-mono">{item.value}</div>
                  <div className="text-text-tertiary text-[10px] mt-0.5">{tl(item.label, locale)}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </Section>

      {/* ═══ Links ═══ */}
      <Section className="text-center">
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>{l('linksTitle')}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/kundali' as const, label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएं' } },
            { href: '/learn/vargas' as const, label: { en: 'Divisional Charts (Vargas)', hi: 'विभागीय चार्ट (वर्ग)' } },
            { href: '/learn/shadbala' as const, label: { en: 'Shadbala (Strength)', hi: 'षड्बल (शक्ति)' } },
            { href: '/learn/avasthas' as const, label: { en: 'Planetary Avasthas', hi: 'ग्रह अवस्थाएँ' } },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium">
              {tl(link.label, locale)} &rarr;
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
