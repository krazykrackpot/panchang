'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Layers, ArrowLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { computeNadiAmsha } from '@/lib/kundali/nadi-amsha';
import { NADI_TABLE, NADI_GROUP_DESCRIPTIONS } from '@/lib/constants/nadi-reference';

// ─── Bilingual helper ──────────────────────────────────────────────────────
const tl = (obj: { en: string; hi: string }, locale: string) =>
  locale === 'hi' ? obj.hi : obj.en;

// ─── Sign Names ────────────────────────────────────────────────────────────
const SIGN_NAMES: { en: string; hi: string }[] = [
  { en: 'Aries', hi: 'मेष' }, { en: 'Taurus', hi: 'वृषभ' },
  { en: 'Gemini', hi: 'मिथुन' }, { en: 'Cancer', hi: 'कर्क' },
  { en: 'Leo', hi: 'सिंह' }, { en: 'Virgo', hi: 'कन्या' },
  { en: 'Libra', hi: 'तुला' }, { en: 'Scorpio', hi: 'वृश्चिक' },
  { en: 'Sagittarius', hi: 'धनु' }, { en: 'Capricorn', hi: 'मकर' },
  { en: 'Aquarius', hi: 'कुम्भ' }, { en: 'Pisces', hi: 'मीन' },
];

// ─── First 12 Nadi Divisions for Aries ─────────────────────────────────────
const ARIES_TABLE = Array.from({ length: 12 }, (_, i) => {
  const num = i + 1;
  const startDeg = (i * 0.2).toFixed(1);
  const endDeg = ((i + 1) * 0.2).toFixed(1);
  const result = computeNadiAmsha(i * 0.2 + 0.001);
  return { num, range: `${startDeg}\u00b0 \u2013 ${endDeg}\u00b0`, sign: SIGN_NAMES[result.nadiSign - 1] };
});

// ─── Comparison Table ──────────────────────────────────────────────────────
const COMPARISON_DATA = [
  { varga: 'D-1', name: { en: 'Rashi', hi: 'राशि' }, span: '30\u00b0', arc: '1800\'', use: { en: 'Overall life pattern, personality, health', hi: 'समग्र जीवन पैटर्न, व्यक्तित्व, स्वास्थ्य' } },
  { varga: 'D-9', name: { en: 'Navamsha', hi: 'नवांश' }, span: '3\u00b020\'', arc: '200\'', use: { en: 'Marriage, dharma, soul purpose', hi: 'विवाह, धर्म, आत्मा का उद्देश्य' } },
  { varga: 'D-60', name: { en: 'Shashtiamsha', hi: 'षष्ट्यंश' }, span: '0\u00b030\'', arc: '30\'', use: { en: 'Past-life karma, deep analysis', hi: 'पूर्वजन्म कर्म, गहन विश्लेषण' } },
  { varga: 'D-150', name: { en: 'Nadi Amsha', hi: 'नाडी अंश' }, span: '0\u00b012\'', arc: '12\'', use: { en: 'Finest karma, twin differentiation, rectification', hi: 'सूक्ष्मतम कर्म, जुड़वाँ विभेदन, शोधन' } },
];

// ─── Planet Karmic Themes for Section 7 ────────────────────────────────────
const PLANET_KARMIC: { planet: { en: string; hi: string }; theme: { en: string; hi: string } }[] = [
  {
    planet: { en: 'Sun', hi: 'सूर्य' },
    theme: {
      en: 'Soul\'s core mission from past lives. The D-150 sign of the Sun reveals what you were born to become at the deepest level -- the essential dharmic identity your soul chose before incarnation. If the Sun\'s Nadi sign matches its D-1 sign, the soul\'s purpose is clear and reinforced. A different sign suggests the surface personality (D-1) masks a deeper karmic identity that emerges in the second half of life.',
      hi: 'पूर्वजन्मों से आत्मा का मूल मिशन। सूर्य की D-150 राशि प्रकट करती है कि आप गहनतम स्तर पर क्या बनने के लिए जन्मे हैं। यदि सूर्य की नाडी राशि D-1 राशि से मेल खाती है, तो आत्मा का उद्देश्य स्पष्ट है।',
    },
  },
  {
    planet: { en: 'Moon', hi: 'चन्द्रमा' },
    theme: {
      en: 'Emotional karmic baggage. The Moon\'s Nadi Amsha reveals what feelings you carry from before -- the unconscious emotional patterns that drive your reactions before the rational mind engages. Moon in a water Nadi sign (Cancer/Scorpio/Pisces) indicates deep intuitive inheritance. In fire signs, past-life emotional trauma drives present-life courage.',
      hi: 'भावनात्मक कार्मिक बोझ। चन्द्रमा का नाडी अंश प्रकट करता है कि आप पिछले जन्मों से कौन सी भावनाएँ लेकर आए हैं -- अचेतन भावनात्मक पैटर्न जो तर्कशील मन से पहले आपकी प्रतिक्रियाओं को चलाते हैं।',
    },
  },
  {
    planet: { en: 'Mars', hi: 'मंगल' },
    theme: {
      en: 'Action patterns from past lives. Mars in D-150 shows how you instinctively fight, pursue, and assert yourself -- patterns so deep they feel like physical memory. Mars in Aries Nadi = warrior soul reborn. Mars in Libra Nadi = past-life conflict resolution through diplomacy. Mars in Scorpio Nadi = occult warrior with surgical precision.',
      hi: 'पूर्वजन्मों से क्रिया पैटर्न। D-150 में मंगल दिखाता है कि आप सहज रूप से कैसे लड़ते, अनुसरण करते और स्वयं को स्थापित करते हैं -- इतने गहरे पैटर्न कि वे शारीरिक स्मृति जैसे लगते हैं।',
    },
  },
  {
    planet: { en: 'Mercury', hi: 'बुध' },
    theme: {
      en: 'Intellectual karma -- what knowledge you brought with you. Mercury\'s Nadi sign reveals the domain where your mind was trained in previous incarnations. Mercury in Gemini Nadi = master communicator across lifetimes. Mercury in Virgo Nadi = analytical precision from past-life scientific work. Mercury in Pisces Nadi = intuitive knowledge that bypasses logic.',
      hi: 'बौद्धिक कर्म -- आप कौन सा ज्ञान लेकर आए। बुध की नाडी राशि उस क्षेत्र को प्रकट करती है जहाँ पिछले जन्मों में आपका मन प्रशिक्षित था।',
    },
  },
  {
    planet: { en: 'Jupiter', hi: 'गुरु' },
    theme: {
      en: 'Dharmic path -- what wisdom tradition your soul belongs to. Jupiter\'s D-150 sign reveals your deepest philosophical and spiritual orientation, often manifesting as an inexplicable pull toward a specific tradition, teacher, or school of thought. Jupiter in Sagittarius Nadi = the eternal teacher. Jupiter in Pisces Nadi = mystical devotee across lifetimes.',
      hi: 'धार्मिक पथ -- आपकी आत्मा किस ज्ञान परम्परा से सम्बन्धित है। गुरु की D-150 राशि आपकी गहनतम दार्शनिक और आध्यात्मिक अभिमुखता प्रकट करती है।',
    },
  },
  {
    planet: { en: 'Venus', hi: 'शुक्र' },
    theme: {
      en: 'Relationship karma -- who you\'ve loved before and how. Venus in D-150 reveals the pattern of love, beauty, and pleasure that your soul has cultivated across incarnations. Venus in Taurus Nadi = sensual mastery and material beauty. Venus in Scorpio Nadi = tantric transformation through intimacy. Venus in Pisces Nadi = divine love transcending the personal.',
      hi: 'सम्बन्ध कर्म -- आपने पहले किससे और कैसे प्रेम किया। D-150 में शुक्र प्रेम, सौन्दर्य और आनन्द का वह पैटर्न प्रकट करता है जो आपकी आत्मा ने जन्मों में विकसित किया है।',
    },
  },
  {
    planet: { en: 'Saturn', hi: 'शनि' },
    theme: {
      en: 'Karmic debts -- what you must work through in this lifetime. Saturn\'s Nadi Amsha is arguably the most important D-150 placement. It shows the specific area where the soul carries unfinished business, unlearned lessons, and unpaid debts. Saturn in Capricorn Nadi = karmic responsibility through worldly achievement. Saturn in Cancer Nadi = emotional debts around nurturing and family.',
      hi: 'कार्मिक ऋण -- इस जन्म में आपको क्या पूरा करना है। शनि का नाडी अंश सम्भवतः सबसे महत्वपूर्ण D-150 स्थिति है। यह उस विशिष्ट क्षेत्र को दिखाता है जहाँ आत्मा अधूरे कार्य और अनसीखे पाठ लेकर आई है।',
    },
  },
  {
    planet: { en: 'Rahu', hi: 'राहु' },
    theme: {
      en: 'Obsessive karmic desire -- what your soul craves to experience. Rahu in D-150 amplifies the area of life where the soul feels an insatiable hunger born from past-life deprivation. Rahu in Leo Nadi = craving for recognition never received. Rahu in Aquarius Nadi = desperate need to belong to a community. This is the karmic itch that drives worldly ambition.',
      hi: 'जुनूनी कार्मिक इच्छा -- आपकी आत्मा क्या अनुभव करना चाहती है। D-150 में राहु जीवन के उस क्षेत्र को बढ़ाता है जहाँ आत्मा पूर्वजन्म की वंचना से उत्पन्न अतृप्त भूख अनुभव करती है।',
    },
  },
  {
    planet: { en: 'Ketu', hi: 'केतु' },
    theme: {
      en: 'Karmic mastery -- what you\'ve already perfected and must release. Ketu\'s D-150 sign shows the domain where the soul has achieved completion in past lives. The challenge is not to develop this area further, but to let go of attachment to it. Ketu in Sagittarius Nadi = past-life guru who must now be a student. Ketu in Virgo Nadi = analytical mastery that must yield to faith.',
      hi: 'कार्मिक निपुणता -- आपने क्या पूर्ण किया है और क्या छोड़ना है। केतु की D-150 राशि उस क्षेत्र को दिखाती है जहाँ आत्मा ने पूर्वजन्मों में पूर्णता प्राप्त की है। चुनौती इसे और विकसित करना नहीं, बल्कि इससे मोह छोड़ना है।',
    },
  },
  {
    planet: { en: 'Ascendant (Lagna)', hi: 'लग्न' },
    theme: {
      en: 'The karmic lens through which the world sees you. The Ascendant\'s Nadi Amsha reveals the soul\'s chosen interface with the material world -- the karmic costume it wears for this incarnation. When the D-150 Ascendant sign differs from the D-1 Ascendant, the person often feels a disconnect between how others perceive them and who they truly are at the soul level.',
      hi: 'कार्मिक लेंस जिसके माध्यम से संसार आपको देखता है। लग्न का नाडी अंश भौतिक संसार के साथ आत्मा के चुने हुए इण्टरफेस को प्रकट करता है -- इस अवतार के लिए पहनी गई कार्मिक वेशभूषा।',
    },
  },
];

// ─── Element Analysis Data ─────────────────────────────────────────────────
const ELEMENT_DATA: { element: { en: string; hi: string }; signs: { en: string; hi: string }; theme: { en: string; hi: string }; color: string }[] = [
  {
    element: { en: 'Fire', hi: 'अग्नि' },
    signs: { en: 'Aries, Leo, Sagittarius', hi: 'मेष, सिंह, धनु' },
    theme: { en: 'Karmic lessons around action, identity, and ego. The soul has been developing willpower, courage, and the ability to initiate across lifetimes. Excess fire = past-life impulsiveness needing temperance.', hi: 'क्रिया, पहचान और अहंकार के कार्मिक पाठ। आत्मा जन्मों में इच्छाशक्ति और साहस विकसित कर रही है।' },
    color: 'border-red-500/30',
  },
  {
    element: { en: 'Earth', hi: 'पृथ्वी' },
    signs: { en: 'Taurus, Virgo, Capricorn', hi: 'वृषभ, कन्या, मकर' },
    theme: { en: 'Lessons around material world, patience, and structure. The soul is learning to build lasting value, work with physical reality, and develop discipline. Excess earth = past-life materialism needing spiritual awakening.', hi: 'भौतिक संसार, धैर्य और संरचना के पाठ। आत्मा स्थायी मूल्य निर्माण और अनुशासन सीख रही है।' },
    color: 'border-emerald-500/30',
  },
  {
    element: { en: 'Air', hi: 'वायु' },
    signs: { en: 'Gemini, Libra, Aquarius', hi: 'मिथुन, तुला, कुम्भ' },
    theme: { en: 'Lessons around communication, relationships, and ideas. The soul is learning to connect, negotiate, and think abstractly. Excess air = past-life detachment from emotional reality needing grounding.', hi: 'संचार, सम्बन्धों और विचारों के पाठ। आत्मा जुड़ना, बातचीत करना और अमूर्त सोचना सीख रही है।' },
    color: 'border-cyan-500/30',
  },
  {
    element: { en: 'Water', hi: 'जल' },
    signs: { en: 'Cancer, Scorpio, Pisces', hi: 'कर्क, वृश्चिक, मीन' },
    theme: { en: 'Lessons around emotions, intuition, and spirituality. The soul is developing empathy, psychic sensitivity, and the ability to surrender. Excess water = past-life emotional overwhelm needing boundaries.', hi: 'भावनाओं, अन्तर्ज्ञान और आध्यात्मिकता के पाठ। आत्मा सहानुभूति और आत्मसमर्पण विकसित कर रही है।' },
    color: 'border-violet-500/30',
  },
];

// ─── D-150 Conjunction Pairs ───────────────────────────────────────────────
const CONJUNCTION_PAIRS: { pair: { en: string; hi: string }; meaning: { en: string; hi: string } }[] = [
  { pair: { en: 'Sun-Moon', hi: 'सूर्य-चन्द्र' }, meaning: { en: 'Unified sense of purpose and emotion. The conscious will and unconscious feeling are aligned at the karmic level -- a rare inner harmony suggesting the soul has resolved the ego-emotion split in past lives.', hi: 'उद्देश्य और भावना की एकता। चेतन इच्छा और अचेतन भावना कार्मिक स्तर पर संरेखित हैं।' } },
  { pair: { en: 'Mars-Venus', hi: 'मंगल-शुक्र' }, meaning: { en: 'Intense past-life romantic or sexual connection. The soul carries powerful attraction-repulsion patterns in relationships. This conjunction in D-150 often indicates that the native will meet a partner who feels deeply familiar.', hi: 'तीव्र पूर्वजन्म रोमांटिक सम्बन्ध। आत्मा सम्बन्धों में शक्तिशाली आकर्षण-विकर्षण पैटर्न रखती है।' } },
  { pair: { en: 'Jupiter-Saturn', hi: 'गुरु-शनि' }, meaning: { en: 'The great karmic tension between expansion and restriction. The soul is working on balancing optimism with discipline, faith with doubt, growth with consolidation. This is the most common D-150 conjunction indicating a mature soul.', hi: 'विस्तार और प्रतिबन्ध के बीच महान कार्मिक तनाव। आत्मा आशावाद और अनुशासन को सन्तुलित करने पर काम कर रही है।' } },
  { pair: { en: 'Sun-Saturn', hi: 'सूर्य-शनि' }, meaning: { en: 'Authority karma. The soul has experienced both power and powerlessness in past lives. This lifetime demands earning authority through sustained effort rather than inheriting or seizing it.', hi: 'अधिकार कर्म। आत्मा ने पूर्वजन्मों में शक्ति और शक्तिहीनता दोनों अनुभव की हैं।' } },
  { pair: { en: 'Mercury-Jupiter', hi: 'बुध-गुरु' }, meaning: { en: 'The scholar-sage conjunction. Past-life teaching and learning are deeply intertwined. The native has an instinctive ability to translate complex wisdom into accessible knowledge.', hi: 'विद्वान-ऋषि युति। पूर्वजन्म का शिक्षण और अध्ययन गहराई से गुंथे हुए हैं।' } },
  { pair: { en: 'Rahu-Ketu axis', hi: 'राहु-केतु अक्ष' }, meaning: { en: 'Always opposite by definition, but their D-150 signs reveal the precise axis of karmic evolution. The Rahu Nadi sign shows what the soul hungers for; the Ketu Nadi sign shows what it must release. The element balance between these two signs is the soul\'s central lesson.', hi: 'परिभाषा के अनुसार सदा विपरीत, परन्तु उनकी D-150 राशियाँ कार्मिक विकास की सटीक धुरी प्रकट करती हैं।' } },
];

// ─── FAQ Data ──────────────────────────────────────────────────────────────
const FAQ: { q: { en: string; hi: string }; a: { en: string; hi: string } }[] = [
  {
    q: { en: 'Is D-150 the same as Nadi astrology from palm-leaf manuscripts?', hi: 'क्या D-150 ताड़पत्र पाण्डुलिपियों की नाडी ज्योतिष के समान है?' },
    a: { en: 'Related but different. Nadi astrology (palm-leaf readings) is a tradition of individual prophecy attributed to ancient sages, preserved on palm leaves in Tamil Nadu. D-150 (Nadi Amsha) is a mathematical divisional chart that shares the same philosophical foundation -- extreme precision in planetary positions. Many modern practitioners consider D-150 the computational formalization of what the Nadi sages perceived intuitively. However, a palm-leaf Nadi reading and a D-150 chart analysis are distinct practices with different methodologies.', hi: 'सम्बन्धित परन्तु भिन्न। नाडी ज्योतिष (ताड़पत्र पठन) प्राचीन ऋषियों को श्रेय दी गई व्यक्तिगत भविष्यवाणी की परम्परा है। D-150 (नाडी अंश) एक गणितीय विभागीय चार्ट है जो समान दार्शनिक आधार साझा करता है।' },
  },
  {
    q: { en: 'My birth time is recorded to the nearest 5 minutes. Can I use D-150?', hi: 'मेरा जन्म समय 5 मिनट तक दर्ज है। क्या मैं D-150 उपयोग कर सकता हूँ?' },
    a: { en: 'For slow-moving planets (Jupiter, Saturn, Rahu, Ketu), a 5-minute error barely affects D-150 positions -- Saturn\'s Nadi Amsha is stable for about 6.7 hours. For the Moon (which changes Nadi Amsha roughly every 24 minutes), a 5-minute uncertainty means your D-150 Moon could be off by one or two divisions. For the Ascendant, which changes D-150 sign every ~48 seconds of clock time, a 5-minute error makes the D-150 Ascendant unreliable. Use D-150 for slow planets, but treat fast-moving positions with caution unless you rectify first.', hi: 'मन्द गति ग्रहों (गुरु, शनि, राहु, केतु) के लिए, 5 मिनट की त्रुटि D-150 स्थितियों को मुश्किल से प्रभावित करती है। चन्द्रमा के लिए, 5 मिनट की अनिश्चितता का अर्थ है कि D-150 चन्द्र एक-दो विभाजन गलत हो सकता है। लग्न के लिए, 5 मिनट की त्रुटि D-150 लग्न को अविश्वसनीय बनाती है।' },
  },
  {
    q: { en: 'How does D-150 differ from D-60 (Shashtiamsha)?', hi: 'D-150 D-60 (षष्ट्यंश) से कैसे भिन्न है?' },
    a: { en: 'D-60 divides each sign into 60 parts (0.5 degrees each) and is the finest division mentioned by Parashara in BPHS. It is widely used for karmic analysis and contributes to Vimshopaka Bala. D-150 provides 2.5 times the resolution (0.2 degrees per division) and comes from the Nadi tradition rather than Parashara. D-60 is more established in mainstream practice; D-150 is more specialized but offers unmatched precision for twin differentiation and birth time rectification.', hi: 'D-60 प्रत्येक राशि को 60 भागों (0.5 अंश प्रत्येक) में विभाजित करता है और BPHS में पराशर द्वारा उल्लिखित सूक्ष्मतम विभाजन है। D-150 2.5 गुना अधिक विभेदन प्रदान करता है और नाडी परम्परा से आता है।' },
  },
  {
    q: { en: 'Can D-150 predict specific events?', hi: 'क्या D-150 विशिष्ट घटनाओं की भविष्यवाणी कर सकता है?' },
    a: { en: 'D-150 is best understood as a karmic fingerprint rather than a predictive tool. It reveals deep soul-level patterns, tendencies, and themes -- not specific events with dates. For timing, traditional methods (Vimshottari Dasha, transits) remain primary. D-150 adds depth to interpretation by showing WHY certain patterns manifest -- the karmic background behind the events D-1 and D-9 describe.', hi: 'D-150 को भविष्यसूचक उपकरण के बजाय कार्मिक फिंगरप्रिंट के रूप में समझना सबसे अच्छा है। यह गहरे आत्मा-स्तर के पैटर्न और विषय प्रकट करता है -- तिथियों सहित विशिष्ट घटनाएँ नहीं।' },
  },
  {
    q: { en: 'Why is D-150 not included in Vimshopaka Bala?', hi: 'D-150 विम्शोपक बल में क्यों शामिल नहीं है?' },
    a: { en: 'Vimshopaka Bala uses the Shodasha Varga (16 charts) or Shad Varga (6 charts) schemes defined by Parashara. D-150 comes from the Nadi tradition, which developed separately. Some practitioners use D-150 as a supplementary dignity check alongside Vimshopaka -- if a planet is strong in standard Vimshopaka but debilitated in D-150, they note a subtle karmic weakness. This approach bridges the two traditions without modifying the classical framework.', hi: 'विम्शोपक बल पराशर द्वारा परिभाषित षोडश वर्ग (16 चार्ट) या षड् वर्ग (6 चार्ट) योजनाओं का उपयोग करता है। D-150 नाडी परम्परा से आता है, जो अलग से विकसित हुई।' },
  },
  {
    q: { en: 'Should I prioritize D-150 over D-9 (Navamsha)?', hi: 'क्या मुझे D-9 (नवांश) पर D-150 को प्राथमिकता देनी चाहिए?' },
    a: { en: 'No. D-9 is the single most important divisional chart after D-1 and should always be analyzed first. D-150 is a specialized tool for specific questions (twin analysis, karmic depth, rectification). Think of it this way: D-1 is the novel, D-9 is the themes and moral of the story, D-60 is the author\'s notes, and D-150 is the DNA of the ink used to write it.', hi: 'नहीं। D-9 D-1 के बाद सबसे महत्वपूर्ण विभागीय चार्ट है और हमेशा पहले विश्लेषित किया जाना चाहिए। D-150 विशिष्ट प्रश्नों के लिए एक विशेष उपकरण है।' },
  },
];

// ─── Labels ────────────────────────────────────────────────────────────────
const L: Record<string, { en: string; hi: string }> = {
  back: { en: 'Learn', hi: 'सीखें' },
  title: { en: 'Nadi Amsha (D-150)', hi: 'नाडी अंश (डी-150)' },
  subtitle: { en: 'The Finest Divisional Chart in Vedic Astrology', hi: 'वैदिक ज्योतिष का सूक्ष्मतम वर्ग चार्ट' },
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function LearnNadiAmshaPage() {
  const locale = useLocale();
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  // Reference table state
  const [expandedRefGroup, setExpandedRefGroup] = useState<number | null>(null);

  // Live calculator state
  const [inputDeg, setInputDeg] = useState('45.39375');
  const parsedDeg = parseFloat(inputDeg);
  const isValidDeg = !isNaN(parsedDeg) && parsedDeg >= 0 && parsedDeg < 360;
  const liveResult = isValidDeg ? computeNadiAmsha(parsedDeg) : null;

  // Worked example: Sun at 15 23' 45" Taurus = 30 + 15 + 23/60 + 45/3600 = 45.39583...
  const workedLong = 45 + 23 / 60 + 45 / 3600; // 45.39583...
  const workedResult = computeNadiAmsha(workedLong);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-2">
      {/* Back link */}
      <Link href="/learn" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors text-sm mb-4">
        <ArrowLeft className="w-4 h-4" />
        {tl(L.back, locale)}
      </Link>

      {/* ═══ Hero ═══ */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-primary text-xs uppercase tracking-widest font-bold">
          <Layers className="w-4 h-4" />
          D-150
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light" style={headingFont}>
          {tl(L.title, locale)}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{tl(L.subtitle, locale)}</p>
      </div>

      {/* ═══ Section 1: What is Nadi Amsha? ═══ */}
      <LessonSection number={1} title={tl({ en: 'What is Nadi Amsha?', hi: 'नाडी अंश क्या है?' }, locale)}>
        <p>
          {tl({
            en: 'Nadi Amsha is the 150th divisional chart (D-150) in Vedic astrology -- the finest subdivision of the zodiac used in classical Jyotish. Each of the 12 signs (30 degrees) is divided into 150 equal parts, making each Nadi Amsha span exactly 0.2 degrees, or 12 arc-minutes. Across the full zodiac, this creates 1,800 unique divisions.',
            hi: 'नाडी अंश वैदिक ज्योतिष का 150वाँ विभागीय चार्ट (D-150) है -- शास्त्रीय ज्योतिष में राशिचक्र का सूक्ष्मतम विभाजन। प्रत्येक 12 राशियों (30 अंश) को 150 समान भागों में विभाजित किया जाता है, जिससे प्रत्येक नाडी अंश ठीक 0.2 अंश या 12 कला-मिनट का होता है। पूर्ण राशिचक्र में यह 1,800 अद्वितीय विभाजन बनाता है।',
          }, locale)}
        </p>
        <p>
          {tl({
            en: 'To understand the progression: D-1 (Rashi chart) shows you the broad canvas of life. D-9 (Navamsha) reveals the soul\'s dharmic purpose. D-60 (Shashtiamsha) captures past-life karma at a medium resolution. D-150 (Nadi Amsha) is the ultimate close-up -- like taking the pulse of the chart at the subtlest possible level. The word "Nadi" itself means pulse or channel, reflecting this diagnostic precision.',
            hi: 'क्रम को समझने के लिए: D-1 (राशि चार्ट) जीवन का व्यापक कैनवास दिखाता है। D-9 (नवांश) आत्मा के धार्मिक उद्देश्य को प्रकट करता है। D-60 (षष्ट्यंश) मध्यम विभेदन पर पूर्वजन्म कर्म को पकड़ता है। D-150 (नाडी अंश) सूक्ष्मतम स्तर पर चार्ट की नाड़ी लेने जैसा है। "नाडी" शब्द का अर्थ ही नाड़ी या चैनल है।',
          }, locale)}
        </p>
        <p>
          {tl({
            en: 'The origin of D-150 lies in the Nadi system of South Indian palm-leaf manuscripts. Traditions like Brighu Nandi Nadi, Dhruva Nadi, and Chandra Kala Nadi describe individual destinies with extraordinary specificity -- predicting names of spouses, number of children, and specific career events. While the exact computational methods of these ancient seers remain debated, D-150 is considered by modern practitioners to be the mathematical formalization of their intuitive precision.',
            hi: 'D-150 की उत्पत्ति दक्षिण भारतीय ताड़पत्र पाण्डुलिपियों की नाडी प्रणाली में है। भृगु नन्दी नाडी, ध्रुव नाडी, और चन्द्रकला नाडी जैसी परम्पराएँ असाधारण विशिष्टता से व्यक्तिगत भाग्य का वर्णन करती हैं। D-150 को आधुनिक अभ्यासकर्ता उनकी सहज सटीकता का गणितीय औपचारिकीकरण मानते हैं।',
          }, locale)}
        </p>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { label: { en: 'Divisions per sign', hi: 'प्रति राशि विभाजन' }, value: '150' },
            { label: { en: 'Arc per division', hi: 'प्रति विभाजन चाप' }, value: "0.2\u00b0 (12')" },
            { label: { en: 'Total divisions', hi: 'कुल विभाजन' }, value: '1,800' },
          ].map((item, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-bg-primary/50 border border-gold-primary/10">
              <div className="text-gold-primary text-xl font-bold font-mono">{item.value}</div>
              <div className="text-text-secondary text-xs mt-1">{tl(item.label, locale)}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 2: The Mathematics ═══ */}
      <LessonSection number={2} title={tl({ en: 'The Mathematics', hi: 'गणित' }, locale)} variant="formula">
        <p>
          {tl({
            en: 'The computation of Nadi Amsha is elegant in its simplicity. Given a planet\'s sidereal longitude, the formula involves three steps:',
            hi: 'नाडी अंश की गणना अपनी सरलता में सुन्दर है। ग्रह के निरयन देशान्तर से, सूत्र में तीन चरण हैं:',
          }, locale)}
        </p>

        <div className="bg-bg-primary/80 border border-gold-primary/15 rounded-xl p-4 font-mono text-sm space-y-2">
          <div className="text-gold-light">
            {tl({ en: '// Step 1: Find degree within sign', hi: '// चरण 1: राशि के अन्दर अंश ज्ञात करें' }, locale)}
          </div>
          <div className="text-text-primary">signIndex = floor(longitude / 30)</div>
          <div className="text-text-primary">degreeInSign = longitude - (signIndex * 30)</div>
          <div className="text-gold-light mt-3">
            {tl({ en: '// Step 2: Compute Nadi number (1-150)', hi: '// चरण 2: नाडी संख्या (1-150) गणना करें' }, locale)}
          </div>
          <div className="text-text-primary">nadiNumber = floor(degreeInSign * 5) + 1</div>
          <div className="text-gold-light mt-3">
            {tl({ en: '// Step 3: Map to sign (odd signs forward, even reverse)', hi: '// चरण 3: राशि में मैप करें (विषम आगे, सम उल्टा)' }, locale)}
          </div>
          <div className="text-text-primary">{'if (oddSign): nadiSign = ((nadiNumber - 1) % 12) + 1'}</div>
          <div className="text-text-primary">{'if (evenSign): nadiSign = 12 - ((nadiNumber - 1) % 12)'}</div>
        </div>

        <p className="text-text-secondary text-sm">
          {tl({
            en: 'Why 150? Because 150 = 5 x 30 -- each degree of the zodiac contains exactly 5 Nadi divisions, and each nakshatra pada (3\u00b020\' = 3.333\u00b0) contains approximately 16.67 Nadi divisions. The factor of 5 makes the arithmetic clean while providing extreme granularity.',
            hi: 'क्यों 150? क्योंकि 150 = 5 x 30 -- राशिचक्र के प्रत्येक अंश में ठीक 5 नाडी विभाजन हैं, और प्रत्येक नक्षत्र पाद (3\u00b020\' = 3.333\u00b0) में लगभग 16.67 नाडी विभाजन हैं।',
          }, locale)}
        </p>

        {/* Worked Example */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-gold-primary/8 to-transparent border border-gold-primary/20 mt-4">
          <div className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-3">
            {tl({ en: 'Worked Example: Sun at 15\u00b023\'45" of Taurus', hi: 'हल किया हुआ उदाहरण: सूर्य वृषभ में 15\u00b023\'45"' }, locale)}
          </div>
          <div className="space-y-2 text-sm">
            <div className="text-text-secondary">
              {tl({ en: 'Sidereal longitude = 30\u00b0 (Aries) + 15\u00b023\'45" = 45.39583\u00b0', hi: 'निरयन देशान्तर = 30\u00b0 (मेष) + 15\u00b023\'45" = 45.39583\u00b0' }, locale)}
            </div>
            <div className="text-text-secondary">
              {tl({ en: 'signIndex = floor(45.396 / 30) = 1 (Taurus, even sign)', hi: 'राशि सूचकांक = floor(45.396 / 30) = 1 (वृषभ, सम राशि)' }, locale)}
            </div>
            <div className="text-text-secondary">
              {tl({ en: 'degreeInSign = 45.396 - 30 = 15.396\u00b0', hi: 'राशि में अंश = 45.396 - 30 = 15.396\u00b0' }, locale)}
            </div>
            <div className="text-text-secondary">
              {tl({ en: 'nadiNumber = floor(15.396 * 5) + 1 = floor(76.98) + 1 = 77 + 1 = 78', hi: 'नाडी संख्या = floor(15.396 * 5) + 1 = floor(76.98) + 1 = 77 + 1 = 78' }, locale)}
            </div>
            <div className="text-text-secondary">
              {tl({ en: 'Taurus is even, so reverse: nadiSign = 12 - ((78-1) % 12) = 12 - 5 = 7 (Libra)', hi: 'वृषभ सम है, अतः उल्टा: नाडी राशि = 12 - ((78-1) % 12) = 12 - 5 = 7 (तुला)' }, locale)}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: { en: 'Sign', hi: 'राशि' }, value: tl(SIGN_NAMES[workedResult.signIndex], locale) },
              { label: { en: 'Degree in sign', hi: 'राशि में अंश' }, value: `${workedResult.degreeInSign.toFixed(2)}\u00b0` },
              { label: { en: 'Nadi #', hi: 'नाडी #' }, value: `${workedResult.nadiAmshaNumber}` },
              { label: { en: 'Nadi Sign', hi: 'नाडी राशि' }, value: tl(SIGN_NAMES[workedResult.nadiSign - 1], locale) },
            ].map((item, i) => (
              <div key={i} className="text-center p-3 rounded-lg bg-bg-primary/60 border border-gold-primary/10">
                <div className="text-gold-light text-lg font-bold font-mono">{item.value}</div>
                <div className="text-text-secondary text-xs mt-1">{tl(item.label, locale)}</div>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 3: Nadi Amsha vs Other Vargas ═══ */}
      <LessonSection number={3} title={tl({ en: 'Nadi Amsha vs Other Vargas', hi: 'नाडी अंश बनाम अन्य वर्ग' }, locale)}>
        <p>
          {tl({
            en: 'If D-1 is a satellite photo of a city, D-9 is a neighborhood map, D-60 is a street-level view, and D-150 is a fingerprint scan of one person. Each level of magnification reveals details invisible at coarser resolutions:',
            hi: 'यदि D-1 शहर की उपग्रह तस्वीर है, D-9 मोहल्ले का नक्शा है, D-60 सड़क-स्तर का दृश्य है, तो D-150 एक व्यक्ति का फिंगरप्रिंट स्कैन है।',
          }, locale)}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                {[
                  tl({ en: 'Varga', hi: 'वर्ग' }, locale),
                  tl({ en: 'Name', hi: 'नाम' }, locale),
                  tl({ en: 'Span', hi: 'विस्तार' }, locale),
                  tl({ en: 'Primary Use', hi: 'मुख्य उपयोग' }, locale),
                ].map((h) => (
                  <th key={h} className="text-left text-gold-dark text-xs uppercase tracking-widest py-2 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row) => (
                <tr key={row.varga} className={`border-b border-gold-primary/6 ${row.varga === 'D-150' ? 'bg-gold-primary/8' : ''}`}>
                  <td className="py-2 px-3 text-gold-primary font-bold font-mono">{row.varga}</td>
                  <td className="py-2 px-3 text-text-primary">{tl(row.name, locale)}</td>
                  <td className="py-2 px-3 text-text-secondary font-mono">{row.span}</td>
                  <td className="py-2 px-3 text-text-secondary text-xs">{tl(row.use, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-sm">
          {tl({
            en: 'D-150 matters most in three scenarios: twin studies (where coarser charts show identical placements), birth time rectification (where the extreme sensitivity acts as a diagnostic tool), and advanced karmic analysis (where D-9 and D-60 show ambiguous patterns that D-150 can resolve).',
            hi: 'D-150 तीन परिदृश्यों में सबसे अधिक महत्वपूर्ण है: जुड़वाँ अध्ययन, जन्म समय शोधन, और उन्नत कार्मिक विश्लेषण जहाँ D-9 और D-60 अस्पष्ट पैटर्न दिखाते हैं।',
          }, locale)}
        </p>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 4: Birth Time Sensitivity ═══ */}
      <LessonSection number={4} title={tl({ en: 'Birth Time Sensitivity', hi: 'जन्म समय संवेदनशीलता' }, locale)} variant="highlight">
        <p>
          {tl({
            en: 'The extreme precision of D-150 is both its strength and its limitation. Here is how quickly each divisional chart\'s Ascendant changes sign:',
            hi: 'D-150 की अत्यधिक सटीकता उसकी शक्ति भी है और सीमा भी। यहाँ बताया गया है कि प्रत्येक विभागीय चार्ट का लग्न कितनी जल्दी राशि बदलता है:',
          }, locale)}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { varga: 'D-1', time: { en: '~2 hours', hi: '~2 घण्टे' }, color: 'text-emerald-400' },
            { varga: 'D-9', time: { en: '~13 minutes', hi: '~13 मिनट' }, color: 'text-cyan-400' },
            { varga: 'D-60', time: { en: '~2 minutes', hi: '~2 मिनट' }, color: 'text-amber-400' },
            { varga: 'D-150', time: { en: '~48 seconds', hi: '~48 सेकण्ड' }, color: 'text-red-400' },
          ].map((item) => (
            <div key={item.varga} className="text-center p-3 rounded-xl bg-bg-primary/50 border border-gold-primary/10">
              <div className="text-gold-primary text-sm font-bold font-mono">{item.varga}</div>
              <div className={`${item.color} text-lg font-bold mt-1`}>{tl(item.time, locale)}</div>
            </div>
          ))}
        </div>
        <p>
          {tl({
            en: 'The D-150 Ascendant changes sign every approximately 48 seconds of clock time. This means a birth time must be accurate to plus or minus 1 minute for the D-150 Ascendant to be reliable. Hospital-recorded times, which are typically rounded to the nearest 5-minute interval, make the D-150 Ascendant unreliable -- though slow planets (Saturn, Jupiter, Rahu, Ketu) are barely affected because they move fractions of a degree per day.',
            hi: 'D-150 लग्न लगभग प्रत्येक 48 सेकण्ड पर राशि बदलता है। इसका अर्थ है कि D-150 लग्न विश्वसनीय होने के लिए जन्म समय +/- 1 मिनट तक सटीक होना चाहिए। अस्पताल में दर्ज समय, जो आमतौर पर 5-मिनट तक पूर्णांकित होता है, D-150 लग्न को अविश्वसनीय बनाता है।',
          }, locale)}
        </p>
        <p>
          {tl({
            en: 'This is precisely why Nadi readers in South India traditionally ask for the exact birth second. Rectification techniques -- using known life events to verify and adjust the birth time -- become essential for serious D-150 work. The process involves checking whether major life events (marriage, children, career changes) align with the karmic themes indicated by the D-150 positions at a proposed birth time.',
            hi: 'यही कारण है कि दक्षिण भारत में नाडी पाठक परम्परागत रूप से जन्म का सटीक सेकण्ड पूछते हैं। शोधन तकनीकें -- ज्ञात जीवन घटनाओं का उपयोग करके जन्म समय की जाँच और समायोजन -- गम्भीर D-150 कार्य के लिए आवश्यक हो जाती हैं।',
          }, locale)}
        </p>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 5: The 150 Nadi Divisions -- Structure ═══ */}
      <LessonSection number={5} title={tl({ en: 'The 150 Nadi Divisions -- Structure', hi: '150 नाडी विभाजन -- संरचना' }, locale)}>
        <p>
          {tl({
            en: 'Each sign contains 150 Nadis numbered 1 through 150. These 150 map cyclically to the 12 signs: Nadi 1 maps to Aries (for odd signs) or Pisces (for even signs), Nadi 2 to the next sign, and so on. The pattern repeats 12 full times (12 x 12 = 144) with 6 remaining divisions, creating 12.5 complete cycles within each sign.',
            hi: 'प्रत्येक राशि में 1 से 150 तक संख्यांकित 150 नाडी होती हैं। ये 150 चक्रीय रूप से 12 राशियों में मैप होती हैं: नाडी 1 मेष (विषम राशियों के लिए) या मीन (सम राशियों के लिए) में, नाडी 2 अगली राशि में, इत्यादि। पैटर्न 12 पूर्ण बार दोहराता है।',
          }, locale)}
        </p>
        <p>
          {tl({
            en: 'The direction of cycling is crucial and follows Parashara\'s varga rule: odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius) count forward from Aries to Pisces. Even signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces) count backward from Pisces to Aries. This alternating pattern ensures that each Nadi Amsha is unique across the zodiac.',
            hi: 'चक्रीय दिशा महत्वपूर्ण है और पराशर के वर्ग नियम का पालन करती है: विषम राशियाँ मेष से मीन तक आगे गिनती हैं। सम राशियाँ मीन से मेष तक पीछे गिनती हैं।',
          }, locale)}
        </p>

        {/* First 12 Nadi table */}
        <div className="overflow-x-auto mt-4">
          <div className="text-gold-light text-sm font-bold mb-2">{tl({ en: 'First 12 Nadi Divisions of Aries (Odd Sign, Forward Cycle)', hi: 'मेष की प्रथम 12 नाडी विभाजन (विषम राशि, आगे का चक्र)' }, locale)}</div>
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
        <p className="text-text-secondary text-xs italic">
          {tl({
            en: 'Note the forward cycle Aries, Taurus, Gemini... for Aries (odd sign). For Taurus (even sign), the same 12 divisions would run Pisces, Aquarius, Capricorn... in reverse.',
            hi: 'ध्यान दें मेष (विषम राशि) के लिए आगे का चक्र। वृषभ (सम राशि) के लिए, वही 12 विभाजन मीन, कुम्भ, मकर... उल्टे क्रम में चलेंगे।',
          }, locale)}
        </p>

        {/* Complete 150 Nadi Reference — grouped by cycle */}
        <div className="mt-6 space-y-2">
          <div className="text-gold-light text-sm font-bold">
            {tl({ en: 'Complete 150 Nadi Reference (by cycle)', hi: 'सम्पूर्ण 150 नाडी सन्दर्भ (चक्रानुसार)' }, locale)}
          </div>
          <p className="text-text-secondary text-xs mb-3">
            {tl({
              en: 'Click any group to expand and see individual Nadi divisions with their degree ranges, sign mappings, elements, and karmic qualities.',
              hi: 'प्रत्येक समूह पर क्लिक करके अंश सीमा, राशि मैपिंग, तत्व और कार्मिक गुण देखें।',
            }, locale)}
          </p>
          {NADI_GROUP_DESCRIPTIONS.map((gd) => {
            const isOpen = expandedRefGroup === gd.group;
            const groupNadis = NADI_TABLE.filter(n => n.group === gd.group);
            return (
              <div key={gd.group} className="rounded-lg border border-gold-primary/10 overflow-hidden">
                <button
                  onClick={() => setExpandedRefGroup(isOpen ? null : gd.group)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gold-primary/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gold-primary font-mono text-xs font-bold w-14">{tl({ en: `Nadi ${gd.range}`, hi: `नाडी ${gd.range}` }, locale)}</span>
                    <span className="text-text-secondary text-xs">{gd.description}</span>
                  </div>
                  <svg className={`w-3.5 h-3.5 text-gold-primary/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isOpen && (
                  <div className="overflow-x-auto border-t border-gold-primary/10">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gold-primary/10 bg-bg-primary/30">
                          <th className="text-left px-3 py-1.5 text-gold-dark font-semibold">#</th>
                          <th className="text-left px-3 py-1.5 text-gold-dark font-semibold">{tl({ en: 'Degrees', hi: 'अंश' }, locale)}</th>
                          <th className="text-center px-3 py-1.5 text-gold-dark font-semibold">{tl({ en: 'Odd sign', hi: 'विषम' }, locale)}</th>
                          <th className="text-center px-3 py-1.5 text-gold-dark font-semibold">{tl({ en: 'Even sign', hi: 'सम' }, locale)}</th>
                          <th className="text-center px-3 py-1.5 text-gold-dark font-semibold">{tl({ en: 'Element', hi: 'तत्व' }, locale)}</th>
                          <th className="text-left px-3 py-1.5 text-gold-dark font-semibold hidden sm:table-cell">{tl({ en: 'Karmic Quality', hi: 'कार्मिक गुण' }, locale)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupNadis.map((nadi) => (
                          <tr key={nadi.number} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                            <td className="px-3 py-1.5 font-mono text-gold-primary/70">{nadi.number}</td>
                            <td className="px-3 py-1.5 text-text-secondary font-mono">{nadi.degreeStart.toFixed(2)}&deg;&ndash;{nadi.degreeEnd.toFixed(2)}&deg;</td>
                            <td className="px-3 py-1.5 text-center text-text-primary">{tl(SIGN_NAMES[nadi.signForward - 1], locale)}</td>
                            <td className="px-3 py-1.5 text-center text-text-primary">{tl(SIGN_NAMES[nadi.signReverse - 1], locale)}</td>
                            <td className="px-3 py-1.5 text-center">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                nadi.element === 'fire' ? 'text-orange-400 bg-orange-500/10' :
                                nadi.element === 'earth' ? 'text-emerald-400 bg-emerald-500/10' :
                                nadi.element === 'air' ? 'text-sky-400 bg-sky-500/10' :
                                'text-blue-400 bg-blue-500/10'
                              }`}>
                                {nadi.element}
                              </span>
                            </td>
                            <td className="px-3 py-1.5 text-text-secondary hidden sm:table-cell">{nadi.quality}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 6: How to Read Nadi Amsha Positions ═══ */}
      <LessonSection number={6} title={tl({ en: 'How to Read Nadi Amsha Positions', hi: 'नाडी अंश स्थितियाँ कैसे पढ़ें' }, locale)}>
        <p>
          {tl({
            en: 'Reading D-150 positions follows a systematic five-step process that builds from individual placements to pattern recognition:',
            hi: 'D-150 स्थितियाँ पढ़ना एक व्यवस्थित पाँच-चरणीय प्रक्रिया का अनुसरण करता है:',
          }, locale)}
        </p>
        <div className="space-y-3">
          {[
            {
              step: 1,
              title: { en: 'Note the planet\'s D-150 sign', hi: 'ग्रह की D-150 राशि नोट करें' },
              desc: { en: 'Compute using the formula above. This sign represents the karmic domain where the planet operates at the subtlest level.', hi: 'ऊपर के सूत्र का उपयोग करके गणना करें। यह राशि उस कार्मिक क्षेत्र का प्रतिनिधित्व करती है जहाँ ग्रह सूक्ष्मतम स्तर पर कार्य करता है।' },
            },
            {
              step: 2,
              title: { en: 'Compare with D-1 sign', hi: 'D-1 राशि से तुलना करें' },
              desc: { en: 'Same sign = reinforced themes (the visible personality matches the karmic blueprint). Different sign = karmic tension (the soul\'s deep pattern differs from its surface expression, creating an inner complexity others may not see).', hi: 'समान राशि = प्रबलित विषय। भिन्न राशि = कार्मिक तनाव (आत्मा का गहरा पैटर्न सतही अभिव्यक्ति से भिन्न है)।' },
            },
            {
              step: 3,
              title: { en: 'Check the D-150 sign\'s lord', hi: 'D-150 राशि के स्वामी की जाँच करें' },
              desc: { en: 'The lord of the Nadi sign becomes a hidden karmic ruler for that planet. If Mars is in Pisces Nadi, Jupiter (lord of Pisces) becomes Mars\'s hidden karmic controller -- action guided by wisdom and faith at the deepest level.', hi: 'नाडी राशि का स्वामी उस ग्रह का छिपा कार्मिक शासक बन जाता है।' },
            },
            {
              step: 4,
              title: { en: 'Look for D-150 conjunctions', hi: 'D-150 युतियाँ देखें' },
              desc: { en: 'Multiple planets in the same Nadi sign create karmic bonds between their themes. Even if they are in different D-1 signs, sharing a D-150 sign means their karmic stories are intertwined.', hi: 'एक ही नाडी राशि में अनेक ग्रह उनके विषयों के बीच कार्मिक बन्धन बनाते हैं।' },
            },
            {
              step: 5,
              title: { en: 'Check element balance', hi: 'तत्व सन्तुलन जाँचें' },
              desc: { en: 'Count how many D-150 positions fall in fire, earth, air, and water signs. The dominant element reveals the soul\'s primary karmic learning arena (see Section 8 below).', hi: 'गिनें कि कितनी D-150 स्थितियाँ अग्नि, पृथ्वी, वायु और जल राशियों में हैं। प्रमुख तत्व आत्मा का प्राथमिक कार्मिक शिक्षा क्षेत्र प्रकट करता है।' },
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 p-4 rounded-xl bg-bg-primary/50 border border-gold-primary/8">
              <div className="shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-primary text-sm font-bold">
                {item.step}
              </div>
              <div>
                <div className="text-gold-light text-sm font-bold mb-1">{tl(item.title, locale)}</div>
                <div className="text-text-secondary text-sm leading-relaxed">{tl(item.desc, locale)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Worked reading example */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/8 to-transparent border border-violet-500/20 mt-4">
          <div className="text-violet-300 text-xs uppercase tracking-widest font-bold mb-2">
            {tl({ en: 'Example Reading', hi: 'उदाहरण पठन' }, locale)}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({
              en: 'Moon at 12\u00b015\'30" in Cancer (D-1 sign = Cancer). Nadi computation: degreeInSign = 12.258\u00b0, nadiNumber = floor(12.258 * 5) + 1 = 62. Cancer is even, so nadiSign = 12 - ((62-1) % 12) = 12 - 1 = 11 = Aquarius. Reading: The Moon\'s emotional core (Cancer in D-1) is karmically wired for community service and humanitarian ideals (Aquarius in D-150). Saturn (lord of Aquarius) becomes the hidden karmic ruler of emotions -- discipline and detachment underpin what appears to be pure nurturing.',
              hi: 'चन्द्रमा कर्क में 12\u00b015\'30" (D-1 राशि = कर्क)। नाडी गणना: राशि में अंश = 12.258\u00b0, नाडी संख्या = 62। कर्क सम है, अतः नाडी राशि = 11 = कुम्भ। पठन: चन्द्रमा का भावनात्मक मूल (D-1 में कर्क) कार्मिक रूप से सामुदायिक सेवा और मानवतावादी आदर्शों (D-150 में कुम्भ) से जुड़ा है।',
            }, locale)}
          </p>
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 7: Planet-by-Planet Karmic Themes ═══ */}
      <LessonSection number={7} title={tl({ en: 'Planet-by-Planet Karmic Themes in D-150', hi: 'D-150 में ग्रह-दर-ग्रह कार्मिक विषय' }, locale)} variant="highlight">
        <p>
          {tl({
            en: 'Each planet\'s D-150 placement reveals a specific dimension of past-life karma. While the D-1 placement shows how the planet operates in this life, the D-150 placement shows why -- the karmic backstory:',
            hi: 'प्रत्येक ग्रह की D-150 स्थिति पूर्वजन्म कर्म का एक विशिष्ट आयाम प्रकट करती है। जबकि D-1 स्थिति दिखाती है कि ग्रह इस जन्म में कैसे कार्य करता है, D-150 दिखाता है क्यों:',
          }, locale)}
        </p>
        <div className="space-y-4">
          {PLANET_KARMIC.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-primary/50 border border-gold-primary/8">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-primary text-xs font-bold shrink-0">
                  {i < 9 ? i : 'L'}
                </span>
                <h4 className="text-gold-light font-bold text-sm">{tl(item.planet, locale)}</h4>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{tl(item.theme, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 8: Element Analysis in D-150 ═══ */}
      <LessonSection number={8} title={tl({ en: 'Element Analysis in D-150', hi: 'D-150 में तत्व विश्लेषण' }, locale)}>
        <p>
          {tl({
            en: 'After computing D-150 positions for all planets and the Ascendant, count how many fall in each element. The dominant element reveals the soul\'s primary arena of karmic learning:',
            hi: 'सभी ग्रहों और लग्न के लिए D-150 स्थितियाँ गणना करने के बाद, गिनें कि प्रत्येक तत्व में कितने हैं। प्रमुख तत्व आत्मा के कार्मिक शिक्षा का प्राथमिक क्षेत्र प्रकट करता है:',
          }, locale)}
        </p>
        <div className="space-y-3">
          {ELEMENT_DATA.map((elem, i) => (
            <div key={i} className={`p-4 rounded-xl border ${elem.color} bg-bg-primary/40`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold-light font-bold text-sm">{tl(elem.element, locale)}</span>
                <span className="text-text-secondary text-xs">({tl(elem.signs, locale)})</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{tl(elem.theme, locale)}</p>
            </div>
          ))}
        </div>
        <p className="text-text-secondary text-sm mt-2">
          {tl({
            en: 'A mixed elemental distribution (no single element dominant) indicates the soul is working on multiple karmic fronts simultaneously -- a complex, multi-threaded incarnation with diverse lessons to learn.',
            hi: 'मिश्रित तात्विक वितरण (कोई एकल तत्व प्रमुख नहीं) इंगित करता है कि आत्मा एक साथ अनेक कार्मिक मोर्चों पर काम कर रही है -- विविध पाठों वाला एक जटिल अवतार।',
          }, locale)}
        </p>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 9: D-150 Conjunctions (Karmic Bonds) ═══ */}
      <LessonSection number={9} title={tl({ en: 'D-150 Conjunctions (Karmic Bonds)', hi: 'D-150 युतियाँ (कार्मिक बन्धन)' }, locale)}>
        <p>
          {tl({
            en: 'When two planets share the same D-150 sign, their karmic themes are intertwined at the deepest level. This is a D-150 conjunction -- even if the planets are in completely different signs in D-1. A D-150 conjunction means the soul has woven these two planetary energies together across lifetimes:',
            hi: 'जब दो ग्रह एक ही D-150 राशि साझा करते हैं, तो उनके कार्मिक विषय गहनतम स्तर पर आपस में गुंथे होते हैं। यह D-150 युति है -- भले ही ग्रह D-1 में पूर्णतः भिन्न राशियों में हों:',
          }, locale)}
        </p>
        <div className="space-y-3">
          {CONJUNCTION_PAIRS.map((item, i) => (
            <div key={i} className="pl-4 border-l-2 border-l-gold-primary/30 space-y-1">
              <h4 className="text-gold-light text-sm font-bold">{tl(item.pair, locale)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{tl(item.meaning, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 10: Nadi Astrology Traditions ═══ */}
      <LessonSection number={10} title={tl({ en: 'Nadi Astrology Traditions', hi: 'नाडी ज्योतिष परम्पराएँ' }, locale)}>
        <p>
          {tl({
            en: 'The D-150 chart sits within a broader ecosystem of Nadi astrology traditions, primarily from South India. Understanding these traditions provides context for why D-150 matters:',
            hi: 'D-150 चार्ट नाडी ज्योतिष परम्पराओं के व्यापक पारिस्थितिकी तन्त्र में स्थित है, मुख्य रूप से दक्षिण भारत से:',
          }, locale)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: { en: 'Brighu Nandi Nadi', hi: 'भृगु नन्दी नाडी' },
              desc: { en: 'One of the oldest Nadi traditions, attributed to Sage Brighu (the father of Shukracharya). It correlates sub-degree planetary positions with specific life events -- names of family members, career changes, and health conditions. The BNN system specifically uses planet-in-sign combinations at extreme precision, making D-150 its natural mathematical analog.', hi: 'सबसे प्राचीन नाडी परम्पराओं में से एक, ऋषि भृगु (शुक्राचार्य के पिता) को श्रेय। यह उप-अंश ग्रह स्थितियों को विशिष्ट जीवन घटनाओं से सम्बन्धित करती है।' },
            },
            {
              name: { en: 'Dhruva Nadi', hi: 'ध्रुव नाडी' },
              desc: { en: 'Focuses on the timing of events rather than their nature. Uses planetary positions at extreme precision to determine when major life transitions will occur. The Dhruva system is particularly strong for predicting marriage timing, career shifts, and health crises.', hi: 'घटनाओं की प्रकृति के बजाय उनके समय पर केन्द्रित है। प्रमुख जीवन परिवर्तनों का समय निर्धारित करने के लिए अत्यधिक सटीक ग्रह स्थितियों का उपयोग करती है।' },
            },
            {
              name: { en: 'Chandra Kala Nadi', hi: 'चन्द्रकला नाडी' },
              desc: { en: 'Attributed to Sage Achyuta, this tradition uses the Moon\'s position as the primary reference point. The Moon\'s nakshatra pada and sub-degree position determine the reading. D-150 of the Moon is particularly significant in this system, as the Chandra Kala Nadi essentially reads the Moon\'s karmic fingerprint.', hi: 'ऋषि अच्युत को श्रेय, यह परम्परा चन्द्रमा की स्थिति को प्राथमिक सन्दर्भ बिन्दु के रूप में उपयोग करती है। D-150 में चन्द्रमा इस प्रणाली में विशेष रूप से महत्वपूर्ण है।' },
            },
            {
              name: { en: 'Palm-Leaf Libraries', hi: 'ताड़पत्र पुस्तकालय' },
              desc: { en: 'Physical collections of palm-leaf manuscripts exist in Vaitheeswaran Koil, Thanjavur, and other locations in Tamil Nadu. Seekers visit these libraries, provide their thumb impression, and a reader locates their specific leaf. The academic debate about authenticity continues, but the tradition\'s precision in matching life details remains remarkable regardless of one\'s position on origins.', hi: 'ताड़पत्र पाण्डुलिपियों के भौतिक संग्रह वैथीश्वरन कोइल, तंजावूर और तमिलनाडु के अन्य स्थानों में मौजूद हैं। प्रामाणिकता पर शैक्षिक बहस जारी है, परन्तु जीवन विवरणों के मिलान में परम्परा की सटीकता उल्लेखनीय है।' },
            },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-primary/50 border border-gold-primary/10 space-y-2">
              <h4 className="text-gold-light text-sm font-bold">{tl(item.name, locale)}</h4>
              <p className="text-text-secondary text-xs leading-relaxed">{tl(item.desc, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 11: Practical Applications ═══ */}
      <LessonSection number={11} title={tl({ en: 'Practical Applications', hi: 'व्यावहारिक अनुप्रयोग' }, locale)}>
        <div className="space-y-4">
          {[
            {
              title: { en: 'Twin Differentiation', hi: 'जुड़वाँ विभेदन' },
              desc: { en: 'D-150 is the ONLY chart that reliably distinguishes twins born minutes apart. Standard charts (D-1 through D-9) often show identical placements for twins born within 10-15 minutes. D-150, with its 48-second sensitivity, captures the subtle differences that explain why twins with "identical" charts often have markedly different temperaments, careers, and life trajectories.', hi: 'D-150 एकमात्र चार्ट है जो मिनटों के अन्तर से जन्मे जुड़वाँ बच्चों को विश्वसनीय रूप से अलग करता है।' },
              color: 'border-l-cyan-500',
            },
            {
              title: { en: 'Birth Time Rectification', hi: 'जन्म समय शोधन' },
              desc: { en: 'Because D-150 changes so rapidly, it provides the most sensitive test for birth time accuracy. Practitioners check whether the D-150 positions at a proposed time align with the person\'s known life themes. If shifting the birth time by 30 seconds produces a D-150 Ascendant that better matches the person\'s karmic patterns, the rectified time is preferred.', hi: 'चूँकि D-150 इतनी तीव्रता से बदलता है, यह जन्म समय सटीकता के लिए सबसे संवेदनशील परीक्षण प्रदान करता है।' },
              color: 'border-l-amber-500',
            },
            {
              title: { en: 'Karmic Counseling', hi: 'कार्मिक परामर्श' },
              desc: { en: 'Understanding past-life patterns helps make better choices in the present. If Saturn\'s D-150 placement indicates karmic debts around family nurturing (Saturn in Cancer Nadi), a counselor can guide the person toward consciously developing those qualities rather than unconsciously repeating old avoidance patterns.', hi: 'पूर्वजन्म के पैटर्न समझना वर्तमान में बेहतर निर्णय लेने में सहायता करता है।' },
              color: 'border-l-violet-500',
            },
            {
              title: { en: 'Relationship Analysis', hi: 'सम्बन्ध विश्लेषण' },
              desc: { en: 'Comparing D-150 positions between partners reveals karmic bonds that transcend the current lifetime. If two people share the same D-150 sign for Venus, their love karma is deeply intertwined -- they have likely been romantic partners before. Conversely, opposing D-150 signs for Saturn can indicate karmic debts that must be resolved through the relationship.', hi: 'साथियों के बीच D-150 स्थितियों की तुलना कार्मिक बन्धनों को प्रकट करती है जो वर्तमान जन्म से परे हैं।' },
              color: 'border-l-rose-500',
            },
            {
              title: { en: 'Spiritual Guidance', hi: 'आध्यात्मिक मार्गदर्शन' },
              desc: { en: 'D-150 shows which spiritual practice suits your soul at the deepest level. Jupiter\'s Nadi sign reveals the wisdom tradition the soul resonates with. Ketu\'s Nadi sign shows past-life spiritual mastery. Together, they paint a picture of the soul\'s spiritual journey across incarnations.', hi: 'D-150 दिखाता है कि कौन सा आध्यात्मिक अभ्यास गहनतम स्तर पर आपकी आत्मा के अनुकूल है।' },
              color: 'border-l-emerald-500',
            },
          ].map((item, i) => (
            <div key={i} className={`pl-4 border-l-2 ${item.color} space-y-1`}>
              <h4 className="text-gold-light text-sm font-bold">{tl(item.title, locale)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{tl(item.desc, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 12: Common Misconceptions ═══ */}
      <LessonSection number={12} title={tl({ en: 'Common Misconceptions', hi: 'आम भ्रांतियाँ' }, locale)}>
        <div className="space-y-4">
          {[
            {
              myth: { en: '"D-150 is too fine to be useful"', hi: '"D-150 इतना सूक्ष्म है कि उपयोगी नहीं"' },
              truth: { en: 'Wrong. It is the MOST useful chart for karmic analysis, twin differentiation, and birth time rectification. Its fine resolution is not a weakness -- it is the entire point. Just as a microscope is not "too powerful" for biology, D-150 is not "too fine" for karmic astrology.', hi: 'गलत। यह कार्मिक विश्लेषण, जुड़वाँ विभेदन और जन्म समय शोधन के लिए सबसे उपयोगी चार्ट है।' },
            },
            {
              myth: { en: '"You need the exact birth second"', hi: '"आपको सटीक जन्म सेकण्ड चाहिए"' },
              truth: { en: 'Not entirely. For slow planets like Saturn (D-150 stable for ~6.7 hours), Jupiter (~2.4 hours), and Rahu/Ketu (~9.3 hours), even a 5-minute birth time uncertainty is negligible. Only the Ascendant and Moon require second-level accuracy. A practical approach: use D-150 of slow planets with confidence, and treat fast-body positions as tentative until rectified.', hi: 'पूर्णतः नहीं। शनि जैसे मन्द ग्रहों के लिए (~6.7 घण्टे तक D-150 स्थिर), 5 मिनट की अनिश्चितता नगण्य है। केवल लग्न और चन्द्रमा को सेकण्ड-स्तर की सटीकता चाहिए।' },
            },
            {
              myth: { en: '"Nadi Amsha is the same as Nadi astrology"', hi: '"नाडी अंश और नाडी ज्योतिष एक ही है"' },
              truth: { en: 'Related but different systems. Nadi astrology refers to the palm-leaf manuscript tradition of individual prophecy. Nadi Amsha (D-150) is a mathematical divisional chart. They share a philosophical foundation -- extreme precision in planetary positions -- but are distinct practices with different methodologies.', hi: 'सम्बन्धित परन्तु भिन्न प्रणालियाँ। नाडी ज्योतिष ताड़पत्र पाण्डुलिपि परम्परा को संदर्भित करती है। नाडी अंश (D-150) गणितीय विभागीय चार्ट है।' },
            },
            {
              myth: { en: '"Only Sun and Moon matter in D-150"', hi: '"D-150 में केवल सूर्य और चन्द्रमा मायने रखते हैं"' },
              truth: { en: 'All planets carry karmic themes in D-150. Saturn\'s D-150 placement is arguably the most important (karmic debts), while Jupiter\'s reveals the dharmic path. Rahu and Ketu\'s D-150 signs show the axis of karmic evolution. Ignoring outer planets in D-150 is like reading only the first chapter of a novel.', hi: 'D-150 में सभी ग्रह कार्मिक विषय रखते हैं। शनि की D-150 स्थिति सम्भवतः सबसे महत्वपूर्ण है। बाह्य ग्रहों की उपेक्षा करना उपन्यास का केवल पहला अध्याय पढ़ने जैसा है।' },
            },
            {
              myth: { en: '"D-150 predictions are deterministic"', hi: '"D-150 की भविष्यवाणियाँ नियतिवादी हैं"' },
              truth: { en: 'D-150 shows tendencies, not fixed fate. It reveals the karmic soil from which this life grows -- but what you plant, water, and nurture remains a matter of free will and conscious choice. The chart describes the terrain; you choose the path through it.', hi: 'D-150 प्रवृत्तियाँ दिखाता है, नियत भाग्य नहीं। यह उस कार्मिक मिट्टी को प्रकट करता है जिसमें यह जीवन बढ़ता है -- परन्तु आप क्या रोपते हैं यह स्वतन्त्र इच्छा का विषय है।' },
            },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-primary/50 border border-gold-primary/8">
              <div className="text-gold-light text-sm font-bold mb-1">{tl(item.myth, locale)}</div>
              <p className="text-text-secondary text-sm leading-relaxed">{tl(item.truth, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 13: Live Calculator ═══ */}
      <LessonSection number={13} title={tl({ en: 'Live Calculator', hi: 'लाइव कैलकुलेटर' }, locale)} variant="formula">
        <p>
          {tl({
            en: 'Enter any sidereal longitude (0-360) to see its Nadi Amsha placement instantly:',
            hi: 'नाडी अंश स्थिति तुरन्त देखने के लिए कोई भी निरयन देशान्तर (0-360) दर्ज करें:',
          }, locale)}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="space-y-1.5">
            <label className="text-text-secondary text-xs uppercase tracking-widest">
              {tl({ en: 'Sidereal Longitude', hi: 'निरयन देशान्तर' }, locale)}
            </label>
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
              <span className="text-text-secondary text-sm">{'\u00b0'}</span>
            </div>
          </div>
          {liveResult && (
            <div className="flex gap-3 flex-wrap">
              {[
                { label: { en: 'Sign', hi: 'राशि' }, value: tl(SIGN_NAMES[liveResult.signIndex], locale) },
                { label: { en: 'Deg in sign', hi: 'राशि अंश' }, value: `${liveResult.degreeInSign.toFixed(2)}\u00b0` },
                { label: { en: 'Nadi #', hi: 'नाडी #' }, value: `${liveResult.nadiAmshaNumber}` },
                { label: { en: 'Nadi Sign', hi: 'नाडी राशि' }, value: tl(SIGN_NAMES[liveResult.nadiSign - 1], locale) },
              ].map((item, i) => (
                <div key={i} className="text-center px-3 py-2 rounded-lg bg-gold-primary/8 border border-gold-primary/15">
                  <div className="text-gold-light text-sm font-bold font-mono">{item.value}</div>
                  <div className="text-text-secondary text-[10px] mt-0.5">{tl(item.label, locale)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Section 14: FAQ ═══ */}
      <LessonSection number={14} title={tl({ en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न' }, locale)}>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <InfoBlock key={i} id={`faq-${i}`} title={tl(item.q, locale)}>
              <p>{tl(item.a, locale)}</p>
            </InfoBlock>
          ))}
        </div>
      </LessonSection>

      <GoldDivider />

      {/* ═══ Generate Your Chart CTA ═══ */}
      <div className="text-center py-6">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light font-bold text-sm hover:bg-gold-primary/25 transition-colors"
        >
          {tl({ en: 'Generate your D-150 Nadi Amsha chart', hi: 'अपना D-150 नाडी अंश चार्ट बनाएँ' }, locale)} &rarr;
        </Link>
      </div>

      {/* ═══ Cross-Links ═══ */}
      <div className="text-center space-y-4 py-4">
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>
          {tl({ en: 'Explore Further', hi: 'और जानें' }, locale)}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/kundali' as const, label: { en: 'Generate Your Kundali (includes D-150)', hi: 'कुण्डली बनाएँ (D-150 सहित)' } },
            { href: '/learn/vargas' as const, label: { en: 'Divisional Charts (Vargas)', hi: 'विभागीय चार्ट (वर्ग)' } },
            { href: '/learn/nakshatras' as const, label: { en: 'Nakshatra System', hi: 'नक्षत्र प्रणाली' } },
            { href: '/learn/dashas' as const, label: { en: 'Dashas (Timing of Karma)', hi: 'दशाएँ (कर्म का समय)' } },
            { href: '/learn/doshas' as const, label: { en: 'Doshas (Karmic Debts)', hi: 'दोष (कार्मिक ऋण)' } },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium">
              {tl(link.label, locale)} &rarr;
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
