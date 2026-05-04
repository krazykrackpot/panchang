'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import ClassicalReference from '@/components/learn/ClassicalReference';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import { Link } from '@/lib/i18n/navigation';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

// ─── Multilingual helper ───────────────────────────────────────────────
type ML = Record<string, string>;
function useML(locale: string) {
  return (obj: ML) => obj[locale] || obj.en || '';
}

// ─── Sanskrit Terms ────────────────────────────────────────────────────
const TERMS = [
  { devanagari: 'कन्या', transliteration: 'Kanyā', meaning: { en: 'Virgin / Maiden — purity through discernment', hi: 'कन्या — विवेक द्वारा शुद्धता' } },
  { devanagari: 'बुध', transliteration: 'Budha', meaning: { en: 'Mercury — ruler of Kanya', hi: 'बुध — कन्या का स्वामी' } },
  { devanagari: 'द्विस्वभाव', transliteration: 'Dvisvabhāva', meaning: { en: 'Dual / Mutable — the modality of Kanya', hi: 'द्विस्वभाव — कन्या की प्रकृति' } },
  { devanagari: 'पृथ्वी', transliteration: 'Pṛthvī', meaning: { en: 'Earth — the element of Kanya', hi: 'पृथ्वी — कन्या का तत्त्व' } },
  { devanagari: 'विवेक', transliteration: 'Viveka', meaning: { en: 'Discrimination / Discernment', hi: 'विवेक — भेद-बुद्धि' } },
  { devanagari: 'सेवा', transliteration: 'Sevā', meaning: { en: 'Service — Virgo\'s highest expression', hi: 'सेवा — कन्या की सर्वोच्च अभिव्यक्ति' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Earth (Prithvi Tattva)', hi: 'पृथ्वी तत्त्व' },
  modality: { en: 'Mutable / Dual (Dvisvabhava)', hi: 'द्विस्वभाव' },
  gender: { en: 'Feminine (Stri)', hi: 'स्त्रीलिंग (स्त्री)' },
  ruler: { en: 'Mercury (Budha)', hi: 'बुध' },
  symbol: { en: 'Virgin / Maiden ♍', hi: 'कन्या ♍' },
  degreeRange: { en: '150° to 180° of the zodiac', hi: 'राशिचक्र के 150° से 180°' },
  direction: { en: 'South', hi: 'दक्षिण' },
  season: { en: 'Varsha (Monsoon / Late Summer)', hi: 'वर्षा ऋतु' },
  color: { en: 'Green, emerald, earthy tones', hi: 'हरा, पन्ना, मिट्टी के रंग' },
  bodyPart: { en: 'Abdomen, intestines, nervous system, lower digestive tract', hi: 'उदर, आँतें, तन्त्रिका तन्त्र, निचला पाचन मार्ग' },
};

// ─── Nakshatras in Kanya ───────────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Uttara Phalguni padas 2-4 (150° – 160°)', hi: 'उत्तर फाल्गुनी पाद 2-4 (150° – 160°)' },
    ruler: { en: 'Sun', hi: 'सूर्य' },
    deity: { en: 'Aryaman (god of contracts and patronage)', hi: 'अर्यमन् (अनुबन्ध और संरक्षण के देव)' },
    desc: {
      en: 'The last three padas of Uttara Phalguni fall in Virgo, creating a bridge between Leo\'s royal display and Virgo\'s humble service. Sun as nakshatra lord in Mercury\'s sign produces administratively gifted individuals who lead through competence rather than charisma. These natives are excellent managers, HR professionals, and organizational architects. Social contracts, friendship obligations, and institutional loyalty define their worldview. The shakti is the power of granting prosperity through organization (chayani shakti).',
      hi: 'उत्तर फाल्गुनी के अन्तिम तीन पाद कन्या में पड़ते हैं, जो सिंह के राजसी प्रदर्शन और कन्या की विनम्र सेवा के बीच सेतु बनाते हैं। बुध की राशि में सूर्य शासित नक्षत्र प्रशासनिक रूप से प्रतिभाशाली व्यक्ति बनाता है जो करिश्मे से नहीं, योग्यता से नेतृत्व करते हैं। ये उत्कृष्ट प्रबन्धक और संस्थागत वास्तुकार होते हैं।',
    },
  },
  {
    name: { en: 'Hasta (160° – 173°20\')', hi: 'हस्त (160° – 173°20\')' },
    ruler: { en: 'Moon', hi: 'चन्द्र' },
    deity: { en: 'Savitar (the creative form of the Sun god)', hi: 'सवितर् (सूर्य देव का सृजनात्मक रूप)' },
    desc: {
      en: 'Hasta is the nakshatra of the skilled hand. Moon as ruler gives emotional sensitivity to craft and dexterity. These natives are artisans, healers, surgeons, and craftspeople who transform raw material into beauty through precision. The five stars of Hasta represent the five fingers — symbolizing the human capacity to shape the world through skill. The shakti is the power to place what one wishes into one\'s hands (hasta sthapaniya agama shakti). Magic, sleight of hand, and therapeutic touch are associated. Mercury\'s earth sign grounds Moon\'s intuition into practical mastery.',
      hi: 'हस्त कुशल हाथ का नक्षत्र है। चन्द्र स्वामी होने से शिल्प और कुशलता में भावनात्मक संवेदनशीलता आती है। ये जातक शिल्पकार, चिकित्सक, शल्य चिकित्सक होते हैं जो सूक्ष्मता से कच्चे माल को सुन्दरता में बदलते हैं। हस्त के पाँच तारे पाँच अंगुलियों का प्रतिनिधित्व करते हैं — कौशल द्वारा संसार को आकार देने की मानवीय क्षमता का प्रतीक। जादू, हस्तकौशल और चिकित्सकीय स्पर्श जुड़े हैं।',
    },
  },
  {
    name: { en: 'Chitra padas 1-2 (173°20\' – 180°)', hi: 'चित्रा पाद 1-2 (173°20\' – 180°)' },
    ruler: { en: 'Mars', hi: 'मंगल' },
    deity: { en: 'Tvashtar (the celestial architect)', hi: 'त्वष्टर् (दिव्य वास्तुकार)' },
    desc: {
      en: 'The first two padas of Chitra fall in Virgo, bringing Mars\'s energy into Mercury\'s analytical domain. Tvashtar, the divine craftsman who fashioned the gods\' weapons, gives this nakshatra the power to create beautiful and functional structures. Architecture, engineering, graphic design, and gemology are natural domains. Mars adds drive and ambition to Virgo\'s precision. The shakti is the power to accumulate merit through creation (punya cayani shakti). These natives build things that endure — bridges, institutions, and artistic legacies.',
      hi: 'चित्रा के पहले दो पाद कन्या में पड़ते हैं, जो बुध के विश्लेषणात्मक क्षेत्र में मंगल की ऊर्जा लाते हैं। त्वष्टर्, जिन्होंने देवताओं के अस्त्र बनाए, इस नक्षत्र को सुन्दर और कार्यात्मक संरचनाएँ बनाने की शक्ति देता है। वास्तुकला, इंजीनियरिंग, ग्राफिक डिज़ाइन और रत्नविज्ञान स्वाभाविक क्षेत्र हैं। ये जातक स्थायी चीज़ें बनाते हैं — पुल, संस्थाएँ और कलात्मक विरासत।',
    },
  },
];

// ─── Planetary Dignities Here ──────────────────────────────────────────
const PLANETARY_DIGNITIES_HERE = {
  exalted: {
    planet: { en: 'Mercury (exalted at 15° Virgo)', hi: 'बुध (कन्या 15° पर उच्च)' },
    desc: {
      en: 'Mercury achieves its highest dignity at 15° of Virgo — both ruler and exalted in the same sign. This is the intellect at its absolute peak: analytical, precise, discriminating, and masterfully organized. Mercury here processes information with surgical accuracy. No other planet enjoys this dual advantage. At 15° specifically, Mercury\'s capacity for classification, diagnosis, and practical problem-solving is unmatched. Accountants, data scientists, linguists, and diagnosticians with this placement often reach the top of their fields.',
      hi: 'बुध कन्या 15° पर अपनी उच्चतम गरिमा प्राप्त करता है — एक ही राशि में स्वामी और उच्च दोनों। यह बुद्धि अपने परम शिखर पर: विश्लेषणात्मक, सूक्ष्म, विवेकशील और कुशलता से संगठित। 15° पर विशेष रूप से बुध की वर्गीकरण, निदान और व्यावहारिक समस्या-समाधान क्षमता अद्वितीय है।',
    },
  },
  debilitated: {
    planet: { en: 'Venus (debilitated at 27° Virgo)', hi: 'शुक्र (कन्या 27° पर नीच)' },
    desc: {
      en: 'Venus falls to its lowest dignity at 27° of Virgo. The planet of love, beauty, and pleasure is deeply uncomfortable in the sign of analysis and criticism. Romance becomes transactional, beauty becomes perfectionism, and pleasure is weighed against utility. Venus in Virgo over-analyzes feelings instead of surrendering to them. Marriage may be delayed or chosen on practical grounds. Art becomes technical craft rather than emotional expression. The lesson: love cannot be perfected through analysis — it must be felt. Neecha Bhanga (cancellation) is possible if Mercury is strong.',
      hi: 'शुक्र कन्या 27° पर अपनी न्यूनतम गरिमा में पहुँचता है। प्रेम, सौन्दर्य और आनन्द का ग्रह विश्लेषण और आलोचना की राशि में अत्यन्त असहज है। प्रेम लेन-देन बन जाता है, सौन्दर्य पूर्णतावाद। शुक्र कन्या में भावनाओं का अति-विश्लेषण करता है। विवाह विलम्बित या व्यावहारिक आधार पर चुना जा सकता है। शिक्षा: प्रेम को विश्लेषण से नहीं — अनुभव से समझा जा सकता है।',
    },
  },
  moolatrikona: {
    planet: { en: 'Mercury (16°-20° of Virgo)', hi: 'बुध (कन्या 16°-20°)' },
    desc: {
      en: 'Mercury\'s moolatrikona zone in Virgo spans 16° to 20°, a narrow but extraordinarily potent band just past the exact exaltation degree. In this zone, Mercury functions as the ideal administrator — methodical, articulate, and effortlessly competent. Per BPHS Chapter 4, moolatrikona is the zone of a planet\'s most constructive and reliable expression. Mercury here is the master accountant, the chief diagnostician, the expert editor — precision incarnate.',
      hi: 'कन्या में बुध का मूलत्रिकोण क्षेत्र 16° से 20° तक फैला है, उच्च बिन्दु से ठीक आगे का एक संकीर्ण किन्तु असाधारण रूप से शक्तिशाली पट्टी। इस क्षेत्र में बुध आदर्श प्रशासक के रूप में कार्य करता है — व्यवस्थित, स्पष्टभाषी और सहज रूप से सक्षम।',
    },
  },
  note: {
    en: 'Virgo is the only sign where Mercury is simultaneously ruler, exalted, and has its moolatrikona — a triple dignity unique in the zodiac. This makes Virgo the most Mercury-flavored sign by far. Planets placed here are judged through Mercury\'s lens of analysis, discrimination, and practical utility.',
    hi: 'कन्या एकमात्र राशि है जहाँ बुध एक साथ स्वामी, उच्च और मूलत्रिकोण में है — राशिचक्र में अद्वितीय तिहरी गरिमा। यह कन्या को सर्वाधिक बुध-प्रभावित राशि बनाता है। यहाँ स्थित ग्रहों का मूल्यांकन बुध के विश्लेषण, विवेक और व्यावहारिक उपयोगिता के दृष्टिकोण से होता है।',
  },
};

// ─── Each Planet in Kanya ──────────────────────────────────────────────
const EACH_PLANET_IN_SIGN: { planet: ML; effect: ML; dignity: string }[] = [
  {
    planet: { en: 'Sun in Kanya', hi: 'कन्या में सूर्य' }, dignity: 'Neutral',
    effect: {
      en: 'The king in the servant\'s quarters — Sun in Virgo produces individuals who lead through competence and service rather than display. Analytical precision replaces grand gestures. These natives shine in healthcare, quality control, auditing, and administrative efficiency. Authority is earned through meticulous work. Can be overly self-critical. Government service in technical or regulatory roles suits them. Father may be in a service profession or have a detail-oriented personality.',
      hi: 'सेवक के कक्ष में राजा — कन्या में सूर्य ऐसे व्यक्ति बनाता है जो प्रदर्शन से नहीं, योग्यता और सेवा से नेतृत्व करते हैं। विश्लेषणात्मक सूक्ष्मता भव्य इशारों का स्थान लेती है। स्वास्थ्य सेवा, गुणवत्ता नियन्त्रण, लेखा परीक्षा में चमकते हैं। अत्यधिक आत्म-आलोचक हो सकते हैं।',
    },
  },
  {
    planet: { en: 'Moon in Kanya', hi: 'कन्या में चन्द्र' }, dignity: 'Neutral',
    effect: {
      en: 'The mind that thinks in lists and categories. Moon in Virgo creates emotionally organized, health-conscious, and service-oriented individuals. They process feelings through analysis rather than intuition. Anxiety and worry are common — the mind constantly inventories what could go wrong. Excellent for nursing, counseling (practical rather than emotional), dietetics, and library science. Mother may be health-conscious or critical. Emotional satisfaction comes through being useful and solving problems.',
      hi: 'सूचियों और वर्गों में सोचने वाला मन। कन्या में चन्द्र भावनात्मक रूप से व्यवस्थित, स्वास्थ्य-सचेत और सेवाभावी व्यक्ति बनाता है। वे अन्तर्ज्ञान से नहीं, विश्लेषण से भावनाओं को संसाधित करते हैं। चिन्ता सामान्य है — मन लगातार सम्भावित त्रुटियों की सूची बनाता है। उपयोगी होने और समस्याएँ हल करने से भावनात्मक सन्तुष्टि आती है।',
    },
  },
  {
    planet: { en: 'Mars in Kanya', hi: 'कन्या में मंगल' }, dignity: 'Neutral',
    effect: {
      en: 'The warrior with a scalpel instead of a sword. Mars in Virgo channels aggression into precision work — surgery, engineering, debugging, forensics, and quality assurance. The native fights with facts and data rather than brute force. Physical energy is directed toward fitness routines and health optimization. Can be argumentative over small details. Excellent for military logistics, medical practice, and any field requiring disciplined technical skill. Anger manifests as sharp criticism rather than physical confrontation.',
      hi: 'तलवार के बजाय शल्य चाकू वाला योद्धा। कन्या में मंगल आक्रामकता को सूक्ष्म कार्य में प्रवाहित करता है — शल्य चिकित्सा, इंजीनियरिंग, डिबगिंग, फोरेंसिक। जातक पाशविक बल से नहीं, तथ्यों और आँकड़ों से लड़ता है। शारीरिक ऊर्जा स्वास्थ्य दिनचर्या की ओर निर्देशित होती है। क्रोध तीखी आलोचना के रूप में प्रकट होता है।',
    },
  },
  {
    planet: { en: 'Mercury in Kanya', hi: 'कन्या में बुध' }, dignity: 'Exalted / Own sign / Moolatrikona',
    effect: {
      en: 'The master intellect at the summit of its powers. Mercury in Virgo — especially near 15°-20° — is the most analytically gifted placement in the entire zodiac. Extraordinary capacity for classification, diagnosis, communication, and practical problem-solving. These natives are natural editors, accountants, programmers, linguists, and medical diagnosticians. The mind works like a high-precision instrument. Can become paralyzed by over-analysis. Speech is articulate but may lack warmth. Writing ability is exceptional. This placement alone can compensate for many chart weaknesses.',
      hi: 'अपनी शक्तियों के शिखर पर मास्टर बुद्धि। कन्या में बुध — विशेषतः 15°-20° के निकट — सम्पूर्ण राशिचक्र में सबसे विश्लेषणात्मक रूप से प्रतिभाशाली स्थिति है। वर्गीकरण, निदान, संवाद और व्यावहारिक समस्या-समाधान की असाधारण क्षमता। ये स्वाभाविक सम्पादक, लेखाकार, प्रोग्रामर और भाषाविद हैं। अति-विश्लेषण से पंगु हो सकता है।',
    },
  },
  {
    planet: { en: 'Jupiter in Kanya', hi: 'कन्या में गुरु' }, dignity: 'Enemy\'s sign',
    effect: {
      en: 'The guru in the laboratory — wisdom constrained by Mercury\'s demand for evidence. Jupiter in Virgo struggles to expand when every intuition must be verified by data. Faith meets skepticism. These natives are excellent researchers, evidence-based teachers, and ethical auditors. Religion becomes comparative theology; philosophy becomes practical ethics. Children may come late or through medical assistance. Wealth accumulates through careful investment rather than generous risk. The lesson: some truths cannot be analyzed into existence — they must be believed.',
      hi: 'प्रयोगशाला में गुरु — बुध की प्रमाण की माँग से बाधित ज्ञान। कन्या में गुरु को विस्तार करने में कठिनाई होती है जब हर अन्तर्ज्ञान को आँकड़ों से सत्यापित करना हो। श्रद्धा सन्देहवाद से मिलती है। ये उत्कृष्ट शोधकर्ता और प्रमाण-आधारित शिक्षक हैं। सन्तान विलम्ब से या चिकित्सा सहायता से हो सकती है।',
    },
  },
  {
    planet: { en: 'Venus in Kanya', hi: 'कन्या में शुक्र' }, dignity: 'Debilitated',
    effect: {
      en: 'Love under a microscope — Venus in Virgo is the most challenging placement for the planet of romance and beauty. At 27° (deepest fall), the native over-analyzes relationships, finds flaws in partners, and struggles to surrender to love\'s imperfections. Beauty is perceived as symmetry rather than feeling. Artistic talent may be technically brilliant but emotionally flat. Marriage is chosen on compatibility checklists rather than heart resonance. The remedy: learn that imperfection is not a defect but a feature of everything alive. Neecha Bhanga occurs when Mercury is strong, dignified, or angular.',
      hi: 'सूक्ष्मदर्शी के नीचे प्रेम — कन्या में शुक्र प्रेम और सौन्दर्य के ग्रह के लिए सबसे कठिन स्थिति है। 27° पर जातक सम्बन्धों का अति-विश्लेषण करता है, साथी में दोष खोजता है। सौन्दर्य अनुभूति के बजाय सममिति के रूप में दिखता है। विवाह हृदय के बजाय अनुकूलता सूची पर चुना जाता है। उपाय: अपूर्णता दोष नहीं, जीवन की विशेषता है।',
    },
  },
  {
    planet: { en: 'Saturn in Kanya', hi: 'कन्या में शनि' }, dignity: 'Friend\'s sign',
    effect: {
      en: 'The disciplinarian in the workshop — Saturn in Virgo is methodical, patient, and relentless in pursuit of quality. This placement creates master craftspeople, career bureaucrats, and systems engineers who build structures that last for decades. Work ethic is extraordinary but can become workaholic. Health anxiety is pronounced — Saturn here fears disease and deterioration. Excellent for regulatory work, tax accounting, infrastructure engineering, and occupational therapy. Service to others is both duty and burden. Chronic digestive or nervous system issues possible.',
      hi: 'कार्यशाला में अनुशासक — कन्या में शनि व्यवस्थित, धैर्यवान और गुणवत्ता की निरन्तर खोज में अथक है। यह मास्टर शिल्पकार, कैरियर नौकरशाह और प्रणाली इंजीनियर बनाता है। कार्य नैतिकता असाधारण किन्तु कार्यहोलिक हो सकती है। स्वास्थ्य चिन्ता प्रबल — शनि यहाँ रोग और क्षय से भय रखता है।',
    },
  },
  {
    planet: { en: 'Rahu in Kanya', hi: 'कन्या में राहु' }, dignity: 'Neutral',
    effect: {
      en: 'The obsessive analyst — Rahu in Virgo amplifies the desire for intellectual mastery and perfection. These natives become consumed by health optimization, data analysis, or technical skill development. Unconventional healing methods, alternative medicine, and technology-driven diagnostics attract them. Can develop hypochondria or obsessive-compulsive tendencies. Foreign connections in healthcare or technology. The native may achieve mastery in niche technical fields that others find too detailed to pursue.',
      hi: 'जुनूनी विश्लेषक — कन्या में राहु बौद्धिक महारत और पूर्णता की इच्छा को बढ़ाता है। ये जातक स्वास्थ्य अनुकूलन, डेटा विश्लेषण या तकनीकी कौशल विकास में लीन हो जाते हैं। अपरम्परागत चिकित्सा पद्धतियाँ और प्रौद्योगिकी-संचालित निदान आकर्षित करते हैं। भयग्रस्तता या बाध्यकारी प्रवृत्तियाँ विकसित हो सकती हैं।',
    },
  },
  {
    planet: { en: 'Ketu in Kanya', hi: 'कन्या में केतु' }, dignity: 'Neutral',
    effect: {
      en: 'The intuitive diagnostician — Ketu in Virgo gives an innate, almost psychic ability to identify problems without formal analysis. Past-life mastery of Virgo\'s skills (healing, craftsmanship, service) means the native doesn\'t need to learn these — they arrive pre-installed. However, Ketu also creates disinterest in the mundane details that Virgo demands. Health may be neglected despite knowledge. The native is drawn toward Pisces (opposite sign) themes — spirituality, surrender, and transcendence of the analytical mind.',
      hi: 'सहजज्ञानी निदानकर्ता — कन्या में केतु औपचारिक विश्लेषण के बिना समस्याओं की पहचान करने की सहज, लगभग मानसिक क्षमता देता है। कन्या कौशलों (चिकित्सा, शिल्प, सेवा) में पूर्वजन्म की महारत। तथापि केतु कन्या द्वारा माँगे गये सूक्ष्म विवरणों में अरुचि भी बनाता है। जातक मीन (विपरीत राशि) विषयों की ओर आकर्षित — आध्यात्मिकता और समर्पण।',
    },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY_TRAITS = {
  strengths: {
    en: 'Analytical brilliance, attention to detail, practical problem-solving, service orientation, health consciousness, organizational skill, reliability, modesty, work ethic, editing and quality control instinct, ability to improve any system they touch',
    hi: 'विश्लेषणात्मक प्रतिभा, विस्तार पर ध्यान, व्यावहारिक समस्या-समाधान, सेवा भाव, स्वास्थ्य चेतना, संगठन कौशल, विश्वसनीयता, विनम्रता, कार्य नैतिकता, सम्पादन और गुणवत्ता नियन्त्रण वृत्ति',
  },
  weaknesses: {
    en: 'Over-critical (of self and others), perfectionism that paralyzes action, anxiety and worry, difficulty expressing emotions, tendency toward hypochondria, can be judgmental disguised as "helpful feedback", misses the forest for the trees, struggles with spontaneity',
    hi: 'अत्यधिक आलोचनात्मक (स्वयं और दूसरों की), पूर्णतावाद जो कार्य को ठप करता है, चिन्ता और व्याकुलता, भावनाओं की अभिव्यक्ति में कठिनाई, भयग्रस्तता की प्रवृत्ति, "सहायक सुझाव" के रूप में आलोचनात्मक, पेड़ों के लिए वन नहीं देखता, सहजता में कठिनाई',
  },
  temperament: {
    en: 'Kanya natives process the world through a filter of "how can this be improved?" They are the editors of the zodiac — every experience, relationship, and environment is scanned for inefficiencies and errors. This makes them invaluable in professional settings but exhausting in personal ones. Their earth element grounds them in practical reality, while Mercury\'s rulership gives them quick, adaptive intelligence. They serve not because they are weak, but because they see service as the highest form of competence. Their anxiety comes not from cowardice but from seeing all the things that could go wrong.',
    hi: 'कन्या जातक संसार को "इसे कैसे सुधारा जा सकता है?" के छन्ने से देखते हैं। वे राशिचक्र के सम्पादक हैं — हर अनुभव, सम्बन्ध और वातावरण को अक्षमताओं और त्रुटियों के लिए जाँचा जाता है। उनका पृथ्वी तत्त्व उन्हें व्यावहारिक वास्तविकता में स्थापित करता है, जबकि बुध का स्वामित्व तीव्र, अनुकूलनशील बुद्धि देता है। वे सेवा इसलिए करते हैं क्योंकि वे सेवा को योग्यता का सर्वोच्च रूप मानते हैं।',
  },
  appearance: {
    en: 'Lean and well-proportioned body, refined features, intelligent and observant eyes, youthful appearance that ages gracefully, neat and well-groomed presentation, modest but tasteful clothing, nervous energy visible in hand gestures and posture adjustments',
    hi: 'दुबला और सुगठित शरीर, परिष्कृत आकृति, बुद्धिमान और सतर्क आँखें, युवा दिखावट जो गरिमापूर्ण ढंग से वृद्ध होती है, स्वच्छ और सुसज्जित प्रस्तुति, विनम्र किन्तु रुचिपूर्ण वस्त्र',
  },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER_TENDENCIES = {
  suited: {
    en: 'Healthcare (medicine, nursing, pharmacy, diagnostics), accounting and auditing, data science and analytics, software engineering and QA, editing and publishing, nutrition and dietetics, veterinary science, environmental science, administrative management, library and information science, craftsmanship and precision manufacturing, regulatory compliance and legal documentation',
    hi: 'स्वास्थ्य सेवा (चिकित्सा, नर्सिंग, फार्मेसी), लेखा और लेखा परीक्षा, डेटा विज्ञान, सॉफ्टवेयर इंजीनियरिंग और QA, सम्पादन और प्रकाशन, पोषण और आहार विज्ञान, पशु चिकित्सा, पर्यावरण विज्ञान, प्रशासनिक प्रबन्धन, शिल्पकला और सूक्ष्म निर्माण',
  },
  insight: {
    en: 'Virgo natives excel in any role that rewards precision, analysis, and systematic improvement. They are the people who make organizations actually work — not the visionaries, but the ones who turn visions into functioning systems. They thrive in environments where quality matters more than speed, where detail is celebrated rather than dismissed, and where service has tangible outcomes. The ideal Virgo career has clear metrics, visible impact, and continuous improvement cycles.',
    hi: 'कन्या जातक किसी भी भूमिका में उत्कृष्ट होते हैं जो सूक्ष्मता, विश्लेषण और व्यवस्थित सुधार को पुरस्कृत करती है। वे वो लोग हैं जो संगठनों को वास्तव में कार्यशील बनाते हैं — दूरदर्शी नहीं, बल्कि वो जो दृष्टि को कार्यशील प्रणालियों में बदलते हैं। आदर्श कन्या करियर में स्पष्ट मापदण्ड, दृश्य प्रभाव और निरन्तर सुधार चक्र होते हैं।',
  },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: {
    en: 'Taurus (Vrishabha): Fellow earth sign — shared practical values, sensual grounding, and financial prudence create a stable partnership. Cancer (Karka): Water nourishes earth — emotional depth meets practical care, mutual nurturing instinct. Capricorn (Makara): Earth with earth — shared ambition, work ethic, and respect for structure. Scorpio (Vrishchika): Water with earth — both value depth and loyalty, shared investigative nature.',
    hi: 'वृषभ: समान पृथ्वी राशि — साझा व्यावहारिक मूल्य और वित्तीय विवेक स्थिर साझेदारी बनाते हैं। कर्क: जल पृथ्वी को पोषित करता है — भावनात्मक गहराई व्यावहारिक देखभाल से मिलती है। मकर: पृथ्वी-पृथ्वी — साझा महत्वाकांक्षा और संरचना का सम्मान। वृश्चिक: गहराई और वफादारी का साझा मूल्य।',
  },
  challenging: {
    en: 'Sagittarius (Dhanu): Fire with earth — Sagittarius\'s big-picture philosophy clashes with Virgo\'s detail obsession. Gemini (Mithuna): Both Mercury-ruled but opposite energies — scattered air versus focused earth. Leo (Simha): Fire\'s need for drama exhausts earth\'s need for order. Pisces (Meena): Opposite sign — Virgo\'s analysis dissolves in Pisces\'s ocean of feeling. Strong attraction but fundamental worldview clash.',
    hi: 'धनु: अग्नि-पृथ्वी — धनु का व्यापक दर्शन कन्या के विस्तार जुनून से टकराता है। मिथुन: दोनों बुध-शासित किन्तु विपरीत ऊर्जा। सिंह: अग्नि की नाटक आवश्यकता पृथ्वी की व्यवस्था आवश्यकता को थका देती है। मीन: विपरीत राशि — कन्या का विश्लेषण मीन की भावना सागर में विलीन।',
  },
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES_AND_WORSHIP = {
  deity: {
    en: 'Lord Vishnu in his Vamana (dwarf) avatar represents Virgo\'s essence — humble appearance concealing cosmic power. Goddess Saraswati, deity of learning and precision, resonates with Mercury\'s intellectual rulership. Lord Ganesha as Vighneshwara (remover of obstacles) aligns with Virgo\'s problem-solving nature. Worshipping these deities strengthens Mercury and the analytical faculties.',
    hi: 'भगवान विष्णु वामन अवतार में कन्या के सार का प्रतिनिधित्व करते हैं — विनम्र स्वरूप में ब्रह्माण्डीय शक्ति। देवी सरस्वती, विद्या और सूक्ष्मता की देवी, बुध के बौद्धिक स्वामित्व से गुंजायमान हैं। भगवान गणेश विघ्नेश्वर रूप में कन्या की समस्या-समाधान प्रकृति से मेल खाते हैं।',
  },
  practices: {
    en: 'Chant the Budha Beej Mantra: Om Braam Breem Braum Sah Budhaya Namah — especially on Wednesdays. Wear emerald (Panna) in gold on the little finger after consulting a Jyotishi. Donate green moong dal, green cloth, and camphor on Wednesdays. Fast on Wednesdays consuming only green vegetables and fruits. Offer green grass to cows. Visit Vishnu temples, particularly during Budha Hora. Practice Pranayama for nervous system health. Keep the workspace organized — external order supports internal Mercury strength.',
    hi: 'बुध बीज मन्त्र जपें: ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः — विशेषतः बुधवार को। ज्योतिषी से परामर्श के बाद कनिष्ठिका में स्वर्ण में पन्ना धारण करें। बुधवार को हरी मूँग दाल, हरा वस्त्र और कपूर दान करें। बुधवार को केवल हरी सब्ज़ियाँ और फल खाकर उपवास रखें। गायों को हरी घास अर्पित करें। विष्णु मन्दिर जाएँ। प्राणायाम का अभ्यास करें।',
  },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: {
    en: 'The Kanya (Virgin) symbol connects to multiple Vedic narratives. In one tradition, Kanya represents Kamadhenu — the wish-fulfilling cow born from the churning of the ocean — who serves selflessly and provides without limit. Another interpretation links Kanya to the harvest maiden, as Virgo appears in the sky during the late monsoon when crops are being gathered and sorted (the quintessential Virgo activity). The maiden carries a sheaf of wheat in Western depictions, paralleling the Hindu concept of Annapurna — the goddess who feeds the world through careful cultivation. In Jyotish, Kanya\'s association with the 6th house of the natural zodiac connects it to Roga (disease) and Ripu (enemies) — not because Virgo causes illness, but because Virgo has the analytical power to diagnose, categorize, and defeat it.',
    hi: 'कन्या (कुमारी) प्रतीक अनेक वैदिक कथाओं से जुड़ता है। एक परम्परा में कन्या कामधेनु का प्रतिनिधित्व करती है — समुद्र मन्थन से जन्मी कामना-पूर्ति गाय — जो निःस्वार्थ सेवा करती है और असीमित प्रदान करती है। दूसरी व्याख्या कन्या को फसल कन्या से जोड़ती है, क्योंकि कन्या राशि आकाश में वर्षा के अन्त में प्रकट होती है जब फसलें एकत्र और छाँटी जा रही होती हैं। ज्योतिष में कन्या का प्राकृतिक राशिचक्र के 6वें भाव से सम्बन्ध इसे रोग और रिपु से जोड़ता है।',
  },
  vedic: {
    en: 'Mercury (Budha) is described in the Puranas as the son of Chandra (Moon) and Tara (wife of Brihaspati/Jupiter). This origin story is itself a Virgo narrative — born from an "improper" union, Budha must prove himself through intelligence and merit rather than lineage. The Skanda Purana describes Mercury as having a greenish complexion, wearing green garments, and possessing supreme eloquence. His day is Wednesday (Budhavara), his gem is emerald, and his direction is north. In Brihat Samhita, Varahamihira associates the Virgo region of the sky with grains, trade, and skilled labor — the practical foundations of civilization that Virgo represents.',
    hi: 'पुराणों में बुध को चन्द्र और तारा (बृहस्पति की पत्नी) का पुत्र बताया गया है। यह उत्पत्ति कथा स्वयं एक कन्या कथा है — "अनुचित" संयोग से जन्मे बुध को वंश से नहीं, बुद्धि और योग्यता से स्वयं को सिद्ध करना होता है। स्कन्द पुराण बुध को हरित वर्ण, हरे वस्त्र और परम वाक्पटुता वाला बताता है। बृहत् संहिता में वराहमिहिर कन्या राशि के आकाशीय क्षेत्र को अनाज, व्यापार और कुशल श्रम से जोड़ते हैं।',
  },
};

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/budha', label: { en: 'Budha — Mercury (Kanya\'s Ruler)', hi: 'बुध — कन्या का स्वामी' } },
  { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { href: '/learn/tula', label: { en: 'Tula (Libra) — Next Rashi', hi: 'तुला — अगली राशि' } },
  { href: '/learn/simha', label: { en: 'Simha (Leo) — Previous Rashi', hi: 'सिंह — पिछली राशि' } },
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/yogas', label: { en: 'Yogas in Vedic Astrology', hi: 'वैदिक ज्योतिष में योग' } },
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function KanyaPage() {
  const locale = useLocale();
  const ml = useML(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale);

  let section = 0;
  const next = () => ++section;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-4">
          <span className="text-4xl">♍</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Kanya — Virgo', hi: 'कन्या राशि' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'The sixth sign of the zodiac — the discerning maiden, ruled by Mercury, embodying analysis, service, and the pursuit of perfection.', hi: 'राशिचक्र की छठवीं राशि — विवेकशील कन्या, बुध द्वारा शासित, विश्लेषण, सेवा और पूर्णता की खोज का मूर्त रूप।' })}
        </p>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {TERMS.map((t, i) => (
          <SanskritTermCard key={i} term={t.devanagari} transliteration={t.transliteration} meaning={ml(t.meaning)} />
        ))}
      </div>

      {/* ── 1. Sign Overview ── */}
      <LessonSection number={next()} title={ml({ en: 'Sign Overview', hi: 'राशि परिचय' })}>
        <p style={bf}>{ml({ en: 'Kanya (Virgo) is the sixth sign of the zodiac, spanning 150° to 180° of the ecliptic. It is a mutable earth sign ruled by Mercury — the planet of intellect, communication, and discrimination. Virgo is the only sign where Mercury achieves triple dignity: ruler, exalted, and moolatrikona. This makes Kanya the most analytical, detail-oriented, and service-focused sign in the zodiac. In the natural chart, Virgo rules the 6th house — the house of disease, enemies, debts, and daily service. This is not weakness; it is the power to diagnose, organize, and heal.', hi: 'कन्या राशिचक्र की छठवीं राशि है, क्रान्तिवृत्त के 150° से 180° तक। यह बुध — बुद्धि, संवाद और विवेक के ग्रह — द्वारा शासित द्विस्वभाव पृथ्वी राशि है। कन्या एकमात्र राशि है जहाँ बुध तिहरी गरिमा प्राप्त करता है: स्वामी, उच्च और मूलत्रिकोण। प्राकृतिक कुण्डली में कन्या 6वें भाव पर शासन करती है — रोग, शत्रु, ऋण और दैनिक सेवा का भाव। यह दुर्बलता नहीं; यह निदान, संगठन और चिकित्सा की शक्ति है।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGN_OVERVIEW).map(([key, val]) => (
            <div key={key} className="bg-emerald-500/5 rounded-lg border border-emerald-500/15 p-3">
              <span className="text-emerald-400 text-xs uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Svarupa (Nature of Signs)" />
      </LessonSection>

      {/* ── 2. Personality Traits ── */}
      <LessonSection number={next()} title={ml({ en: 'Personality & Temperament', hi: 'व्यक्तित्व एवं स्वभाव' })}>
        <p style={bf}>{ml(PERSONALITY_TRAITS.temperament)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strengths', hi: 'गुण' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.strengths)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weaknesses', hi: 'दुर्बलताएँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.weaknesses)}</p>
          </div>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 mt-4">
          <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Physical Appearance', hi: 'शारीरिक स्वरूप' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.appearance)}</p>
        </div>
        <ClassicalReference shortName="PD" chapter="Ch. 2 — Rashi Characteristics" />
      </LessonSection>

      {/* ── 3. Nakshatras in Kanya ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Kanya', hi: 'कन्या में नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Three nakshatras occupy Virgo, each bringing a unique flavor to Mercury\'s analytical domain. Uttara Phalguni provides organizational patronage, Hasta brings skilled craftsmanship, and Chitra adds architectural vision. The nakshatra placement of a planet in Virgo determines whether its Mercurial energy expresses as administration, healing, or creative construction.', hi: 'तीन नक्षत्र कन्या में स्थित हैं, प्रत्येक बुध के विश्लेषणात्मक क्षेत्र को एक अनूठा रंग देता है। उत्तर फाल्गुनी संगठनात्मक संरक्षण देता है, हस्त कुशल शिल्प लाता है, और चित्रा वास्तु दृष्टि जोड़ता है।' })}</p>
        {NAKSHATRAS_IN_SIGN.map((n, i) => (
          <div key={i} className="mb-5 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(n.name)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">{ml(n.ruler)}</span>
              <span className="text-xs text-text-secondary italic">{ml(n.deity)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(n.desc)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 4. Planetary Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Kanya', hi: 'कन्या में ग्रह गरिमा' })}>
        <p style={bf} className="mb-4">{ml(PLANETARY_DIGNITIES_HERE.note)}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-emerald-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(PLANETARY_DIGNITIES_HERE.exalted.planet)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Exalted</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PLANETARY_DIGNITIES_HERE.exalted.desc)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(PLANETARY_DIGNITIES_HERE.moolatrikona.planet)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">Moolatrikona</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PLANETARY_DIGNITIES_HERE.moolatrikona.desc)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-red-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(PLANETARY_DIGNITIES_HERE.debilitated.planet)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">Debilitated</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PLANETARY_DIGNITIES_HERE.debilitated.desc)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18 — Uccha-Neecha and Ch. 4 — Moolatrikona" />
      </LessonSection>

      {/* ── 5. Each Planet in Kanya ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Kanya', hi: 'कन्या में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Every planet placed in Virgo is filtered through Mercury\'s analytical lens. Friends of Mercury (Sun, Venus) find expression through competent service. Enemies (Moon as lord of Cancer — Mercury\'s debilitation sign) create tension between feeling and analysis. Jupiter\'s faith clashes with Mercury\'s demand for evidence. Saturn finds a disciplined ally in Mercury\'s systematic nature.', hi: 'कन्या में स्थित प्रत्येक ग्रह बुध के विश्लेषणात्मक लेंस से छनता है। बुध के मित्र (सूर्य, शुक्र) योग्य सेवा के माध्यम से अभिव्यक्ति पाते हैं। गुरु की श्रद्धा बुध की प्रमाण माँग से टकराती है। शनि को बुध की व्यवस्थित प्रकृति में अनुशासित सहयोगी मिलता है।' })}</p>
        {EACH_PLANET_IN_SIGN.map((p, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                p.dignity.includes('Exalted') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                p.dignity.includes('Debilitated') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                p.dignity.includes('Friend') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                p.dignity.includes('Enemy') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
              }`}>{p.dignity}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Visheshaphala" />
      </LessonSection>

      {/* ── 6. Career ── */}
      <LessonSection number={next()} title={ml({ en: 'Career & Professional Tendencies', hi: 'करियर एवं व्यावसायिक प्रवृत्तियाँ' })}>
        <p style={bf}>{ml(CAREER_TENDENCIES.insight)}</p>
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 mt-4">
          <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Suited Professions', hi: 'उपयुक्त व्यवसाय' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(CAREER_TENDENCIES.suited)}</p>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Virgo natives who suppress their analytical nature in favor of "going with the flow" often develop anxiety. Their path to peace is not through letting go of control, but through directing their precision toward meaningful service. When a Virgo is helping, they are healed.', hi: 'कन्या जातक जो "बहाव में बहने" के लिए अपनी विश्लेषणात्मक प्रकृति को दबाते हैं, प्रायः चिन्ता विकसित करते हैं। शान्ति का मार्ग नियन्त्रण छोड़ने से नहीं, बल्कि अपनी सूक्ष्मता को सार्थक सेवा की ओर निर्देशित करने से है।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 7. Compatibility ── */}
      <LessonSection number={next()} title={ml({ en: 'Compatibility & Relationships', hi: 'अनुकूलता एवं सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Virgo\'s compatibility depends on finding a partner who appreciates their dedication to quality and doesn\'t interpret their analysis as criticism. Earth and water signs generally provide the stability and emotional depth that Virgo needs. Fire and air signs bring excitement but may find Virgo\'s attention to detail stifling.', hi: 'कन्या की अनुकूलता ऐसा साथी खोजने पर निर्भर करती है जो उनकी गुणवत्ता के प्रति समर्पण की सराहना करे और उनके विश्लेषण को आलोचना न समझे। पृथ्वी और जल राशियाँ स्थिरता और भावनात्मक गहराई देती हैं।' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Best Matches', hi: 'सर्वश्रेष्ठ जोड़ी' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.best)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Challenging Matches', hi: 'चुनौतीपूर्ण जोड़ी' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.challenging)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 8. Remedies & Worship ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies & Worship', hi: 'उपाय एवं उपासना' })}>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Presiding Deity', hi: 'अधिष्ठात्र देवता' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.deity)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Recommended Practices', hi: 'अनुशंसित अभ्यास' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.practices)}</p>
          </div>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'The best remedy for a stressed Virgo is meaningful work. When their analytical power is directed toward genuine service — healing, teaching, organizing — their anxiety transforms into purpose. Keep the hands busy and the workspace ordered; Mercury thrives in clean environments.', hi: 'तनावग्रस्त कन्या के लिए सबसे अच्छा उपाय सार्थक कार्य है। जब उनकी विश्लेषणात्मक शक्ति वास्तविक सेवा — चिकित्सा, शिक्षण, संगठन — की ओर निर्देशित होती है, उनकी चिन्ता उद्देश्य में बदल जाती है।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Vedic Context', hi: 'पौराणिक कथा एवं वैदिक संदर्भ' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Maiden in Hindu Tradition', hi: 'हिन्दू परम्परा में कन्या' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Mercury in the Puranas', hi: 'पुराणों में बुध' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.vedic)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BS" chapter="Brihat Samhita — Rashi and Agricultural Associations" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Kanya (Virgo) is the mutable earth sign ruled by Mercury — the seat of analysis, service, and practical perfection in the zodiac.', hi: 'कन्या बुध द्वारा शासित द्विस्वभाव पृथ्वी राशि है — राशिचक्र में विश्लेषण, सेवा और व्यावहारिक पूर्णता का स्थान।' }),
        ml({ en: 'Mercury achieves triple dignity here: ruler, exalted (15°), and moolatrikona (16°-20°). Venus is debilitated at 27°.', hi: 'बुध यहाँ तिहरी गरिमा प्राप्त करता है: स्वामी, उच्च (15°) और मूलत्रिकोण (16°-20°)। शुक्र 27° पर नीच है।' }),
        ml({ en: 'Nakshatras: Uttara Phalguni padas 2-4 (Sun), Hasta (Moon), Chitra padas 1-2 (Mars). Each brings organizational, healing, and creative energies.', hi: 'नक्षत्र: उत्तर फाल्गुनी पाद 2-4 (सूर्य), हस्त (चन्द्र), चित्रा पाद 1-2 (मंगल)। प्रत्येक संगठनात्मक, चिकित्सा और सृजनात्मक ऊर्जा लाता है।' }),
        ml({ en: 'Virgo natives excel through precision and service. Remedy: worship Vishnu and Saraswati, chant Budha Beej Mantra, wear emerald, and direct analytical power toward meaningful work.', hi: 'कन्या जातक सूक्ष्मता और सेवा से उत्कृष्ट होते हैं। उपाय: विष्णु-सरस्वती पूजा, बुध बीज मन्त्र, पन्ना धारण, और विश्लेषणात्मक शक्ति को सार्थक कार्य की ओर निर्देशित करें।' }),
      ]} />

      {/* ── Cross-links ── */}
      <div className="mt-12 border-t border-gold-primary/10 pt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4">{ml({ en: 'Explore Further', hi: 'और जानें' })}</h3>
        <div className="flex flex-wrap gap-2">
          {CROSS_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-sm rounded-lg border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-colors" style={bf}>
              {ml(link.label)}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
