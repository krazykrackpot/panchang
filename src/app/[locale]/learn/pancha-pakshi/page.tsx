'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sun, Moon, Clock, Compass, BookOpen, FlaskConical } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ─── Types ──────────────────────────────────────────────────────────────────────
type Bird = 'vulture' | 'owl' | 'crow' | 'cock' | 'peacock';
type Activity = 'ruling' | 'eating' | 'walking' | 'sleeping' | 'dying';

interface BirdInfo {
  id: Bird;
  name: { en: string; hi: string; sa: string };
  sanskrit: string;
  element: { en: string; hi: string; sa: string };
  color: string;
  bgColor: string;
  borderColor: string;
  description: { en: string; hi: string };
}

// ─── Five Birds Data ────────────────────────────────────────────────────────────
const BIRDS: BirdInfo[] = [
  {
    id: 'vulture',
    name: { en: 'Vulture (Gridhra)', hi: 'गृध्र', sa: 'गृध्रः' },
    sanskrit: 'गृध्रः',
    element: { en: 'Earth (Prithvi)', hi: 'पृथ्वी', sa: 'पृथ्वी' },
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/25',
    description: {
      en: 'The Vulture represents the Earth element. It signifies patience, persistence, and the ability to wait for the right moment. Associated with material stability and grounding energy.',
      hi: 'गृध्र पृथ्वी तत्व का प्रतिनिधित्व करता है। यह धैर्य, दृढ़ता और सही समय की प्रतीक्षा करने की क्षमता का प्रतीक है।',
    },
  },
  {
    id: 'owl',
    name: { en: 'Owl (Uluka)', hi: 'उलूक', sa: 'उलूकः' },
    sanskrit: 'उलूकः',
    element: { en: 'Water (Jala)', hi: 'जल', sa: 'जलम्' },
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/25',
    description: {
      en: 'The Owl represents the Water element. It signifies intuition, wisdom in darkness, and the ability to see what others cannot. Associated with emotional depth and hidden knowledge.',
      hi: 'उलूक जल तत्व का प्रतिनिधित्व करता है। यह अंतर्ज्ञान, अंधकार में ज्ञान और दूसरों की अनदेखी देखने की क्षमता का प्रतीक है।',
    },
  },
  {
    id: 'crow',
    name: { en: 'Crow (Kaka)', hi: 'काक', sa: 'काकः' },
    sanskrit: 'काकः',
    element: { en: 'Fire (Agni)', hi: 'अग्नि', sa: 'अग्निः' },
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/25',
    description: {
      en: 'The Crow represents the Fire element. It signifies intelligence, adaptability, and resourcefulness. Associated with transformation, communication with ancestors, and karmic awareness.',
      hi: 'काक अग्नि तत्व का प्रतिनिधित्व करता है। यह बुद्धि, अनुकूलनशीलता और संसाधनशीलता का प्रतीक है।',
    },
  },
  {
    id: 'cock',
    name: { en: 'Cock (Kukkuta)', hi: 'कुक्कुट', sa: 'कुक्कुटः' },
    sanskrit: 'कुक्कुटः',
    element: { en: 'Air (Vayu)', hi: 'वायु', sa: 'वायुः' },
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/25',
    description: {
      en: 'The Cock represents the Air element. It signifies alertness, courage, and the herald of new beginnings. Associated with discipline, punctuality, and martial energy.',
      hi: 'कुक्कुट वायु तत्व का प्रतिनिधित्व करता है। यह सतर्कता, साहस और नई शुरुआत का प्रतीक है।',
    },
  },
  {
    id: 'peacock',
    name: { en: 'Peacock (Mayura)', hi: 'मयूर', sa: 'मयूरः' },
    sanskrit: 'मयूरः',
    element: { en: 'Ether (Akasha)', hi: 'आकाश', sa: 'आकाशः' },
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/25',
    description: {
      en: 'The Peacock represents the Ether (Space) element. It signifies beauty, grace, and spiritual transcendence. Associated with divine connection, celebration, and auspiciousness.',
      hi: 'मयूर आकाश तत्व का प्रतिनिधित्व करता है। यह सौंदर्य, कृपा और आध्यात्मिक उत्कर्ष का प्रतीक है।',
    },
  },
];

// ─── Activities Data ────────────────────────────────────────────────────────────
const ACTIVITIES: { id: Activity; name: { en: string; hi: string; sa: string }; power: number; auspicious: string; color: string; description: { en: string; hi: string } }[] = [
  {
    id: 'ruling',
    name: { en: 'Ruling', hi: 'राज्य', sa: 'राज्यम्' },
    power: 5,
    auspicious: 'Excellent',
    color: 'text-emerald-400',
    description: {
      en: 'The bird is at its peak power. Supreme period for initiating any important action -- decisions made now succeed. Best for signing agreements, starting ventures, making important requests.',
      hi: 'पक्षी अपनी चरम शक्ति पर है। किसी भी महत्वपूर्ण कार्य के लिए श्रेष्ठ काल। अभी लिए निर्णय सफल होते हैं।',
    },
  },
  {
    id: 'eating',
    name: { en: 'Eating', hi: 'भोजन', sa: 'भोजनम्' },
    power: 4,
    auspicious: 'Good',
    color: 'text-blue-300',
    description: {
      en: 'The bird is nourishing itself. Good for financial matters, creative pursuits, nurturing activities, and food-related work. Moderate success for most undertakings.',
      hi: 'पक्षी स्वयं का पोषण कर रहा है। वित्तीय, सृजनात्मक और पोषण कार्यों के लिए अच्छा। अधिकांश कार्यों में मध्यम सफलता।',
    },
  },
  {
    id: 'walking',
    name: { en: 'Walking', hi: 'गमन', sa: 'गमनम्' },
    power: 3,
    auspicious: 'Good',
    color: 'text-cyan-400',
    description: {
      en: 'The bird is in motion. Favorable for travel, meetings, social activities, and carrying out existing plans. Good for movement and communication.',
      hi: 'पक्षी गतिमान है। यात्रा, बैठक, सामाजिक गतिविधियों और मौजूदा योजनाओं को पूरा करने के लिए अनुकूल।',
    },
  },
  {
    id: 'sleeping',
    name: { en: 'Sleeping', hi: 'शयन', sa: 'शयनम्' },
    power: 2,
    auspicious: 'Neutral',
    color: 'text-text-secondary',
    description: {
      en: 'The bird is dormant. Routine matters proceed normally but avoid major new initiatives. Best used for planning, rest, contemplation, and internal work.',
      hi: 'पक्षी निद्रा में है। नियमित कार्य सामान्य चलते हैं परंतु बड़े नए कार्य न करें। योजना, विश्राम और चिंतन के लिए उपयुक्त।',
    },
  },
  {
    id: 'dying',
    name: { en: 'Dying', hi: 'मृत्यु', sa: 'मृत्युः' },
    power: 1,
    auspicious: 'Avoid',
    color: 'text-red-400',
    description: {
      en: 'The bird is at its weakest -- the most inauspicious period. Avoid all important new actions. Rest, reflect, and wait. Actions started now tend to fail or create obstacles.',
      hi: 'पक्षी सबसे कमजोर है -- सर्वाधिक अशुभ काल। सभी महत्वपूर्ण नए कार्यों से बचें। विश्राम करें, चिंतन करें और प्रतीक्षा करें।',
    },
  },
];

// ─── Nakshatra to Bird Mapping (from engine: pancha-pakshi.ts) ──────────────
const NAKSHATRA_BIRD_MAP: { range: string; nakshatras: { id: number; name: { en: string; hi: string } }[]; bird: Bird }[] = [
  {
    range: '1-5',
    bird: 'vulture',
    nakshatras: [
      { id: 1, name: { en: 'Ashwini', hi: 'अश्विनी' } },
      { id: 2, name: { en: 'Bharani', hi: 'भरणी' } },
      { id: 3, name: { en: 'Krittika', hi: 'कृत्तिका' } },
      { id: 4, name: { en: 'Rohini', hi: 'रोहिणी' } },
      { id: 5, name: { en: 'Mrigashira', hi: 'मृगशिरा' } },
    ],
  },
  {
    range: '6-10',
    bird: 'owl',
    nakshatras: [
      { id: 6, name: { en: 'Ardra', hi: 'आर्द्रा' } },
      { id: 7, name: { en: 'Punarvasu', hi: 'पुनर्वसु' } },
      { id: 8, name: { en: 'Pushya', hi: 'पुष्य' } },
      { id: 9, name: { en: 'Ashlesha', hi: 'आश्लेषा' } },
      { id: 10, name: { en: 'Magha', hi: 'मघा' } },
    ],
  },
  {
    range: '11-15',
    bird: 'crow',
    nakshatras: [
      { id: 11, name: { en: 'Purva Phalguni', hi: 'पूर्वा फाल्गुनी' } },
      { id: 12, name: { en: 'Uttara Phalguni', hi: 'उत्तरा फाल्गुनी' } },
      { id: 13, name: { en: 'Hasta', hi: 'हस्त' } },
      { id: 14, name: { en: 'Chitra', hi: 'चित्रा' } },
      { id: 15, name: { en: 'Swati', hi: 'स्वाति' } },
    ],
  },
  {
    range: '16-20',
    bird: 'cock',
    nakshatras: [
      { id: 16, name: { en: 'Vishakha', hi: 'विशाखा' } },
      { id: 17, name: { en: 'Anuradha', hi: 'अनुराधा' } },
      { id: 18, name: { en: 'Jyeshtha', hi: 'ज्येष्ठा' } },
      { id: 19, name: { en: 'Mula', hi: 'मूल' } },
      { id: 20, name: { en: 'Purva Ashadha', hi: 'पूर्वाषाढ़ा' } },
    ],
  },
  {
    range: '21-27',
    bird: 'peacock',
    nakshatras: [
      { id: 21, name: { en: 'Uttara Ashadha', hi: 'उत्तराषाढ़ा' } },
      { id: 22, name: { en: 'Shravana', hi: 'श्रवण' } },
      { id: 23, name: { en: 'Dhanishtha', hi: 'धनिष्ठा' } },
      { id: 24, name: { en: 'Shatabhisha', hi: 'शतभिषा' } },
      { id: 25, name: { en: 'Purva Bhadrapada', hi: 'पूर्वभाद्रपद' } },
      { id: 26, name: { en: 'Uttara Bhadrapada', hi: 'उत्तरभाद्रपद' } },
      { id: 27, name: { en: 'Revati', hi: 'रेवती' } },
    ],
  },
];

// ─── Weekday Rulers (from engine) ───────────────────────────────────────────
const WEEKDAY_RULERS: { day: { en: string; hi: string }; bird: Bird }[] = [
  { day: { en: 'Sunday', hi: 'रविवार' }, bird: 'vulture' },
  { day: { en: 'Monday', hi: 'सोमवार' }, bird: 'owl' },
  { day: { en: 'Tuesday', hi: 'मंगलवार' }, bird: 'crow' },
  { day: { en: 'Wednesday', hi: 'बुधवार' }, bird: 'cock' },
  { day: { en: 'Thursday', hi: 'गुरुवार' }, bird: 'peacock' },
  { day: { en: 'Friday', hi: 'शुक्रवार' }, bird: 'vulture' },
  { day: { en: 'Saturday', hi: 'शनिवार' }, bird: 'owl' },
];

// ─── Worked Example Data ────────────────────────────────────────────────────────
const WORKED_EXAMPLE = {
  person: { en: 'Rohini nakshatra, Wednesday', hi: 'रोहिणी नक्षत्र, बुधवार' },
  birthBird: 'vulture' as Bird,
  steps: [
    { en: 'Step 1: Rohini is nakshatra #4, which falls in the 1-5 range, so the Janma Pakshi (birth bird) is Vulture (Gridhra).', hi: 'चरण 1: रोहिणी नक्षत्र #4 है, जो 1-5 सीमा में आता है, अतः जन्म पक्षी गृध्र है।' },
    { en: 'Step 2: On Wednesday, the day ruler is Cock (Kukkuta). This means Cock starts as the ruling bird in Period 1 of the day.', hi: 'चरण 2: बुधवार को दिन का शासक कुक्कुट है। अर्थात् दिन के पहले काल में कुक्कुट शासक पक्षी है।' },
    { en: 'Step 3: The five birds rotate through activities. In Period 1, the bird sequence starts from Cock. Vulture\'s position in this rotated sequence determines its activity.', hi: 'चरण 3: पाँच पक्षी गतिविधियों में घूमते हैं। काल 1 में, क्रम कुक्कुट से आरम्भ होता है। इस घूमे हुए क्रम में गृध्र की स्थिति उसकी गतिविधि निर्धारित करती है।' },
    { en: 'Step 4: In the Cock-first sequence [Cock, Peacock, Vulture, Owl, Crow], Vulture is at position 3 (Walking). So in Period 1, your bird is Walking -- favorable for travel and meetings.', hi: 'चरण 4: कुक्कुट-प्रथम क्रम [कुक्कुट, मयूर, गृध्र, उलूक, काक] में, गृध्र स्थान 3 (गमन) पर है। अतः काल 1 में, आपका पक्षी गमन कर रहा है -- यात्रा और बैठकों के लिए अनुकूल।' },
    { en: 'Step 5: Each subsequent period shifts the ruling bird by 1. In Period 2 (Peacock rules), Vulture would be at position 4 (Sleeping). Continue for all 5 periods to map your full day.', hi: 'चरण 5: प्रत्येक अगले काल में शासक पक्षी 1 से बदलता है। काल 2 (मयूर शासक) में, गृध्र स्थान 4 (शयन) पर होगा। पूरे दिन का मानचित्र बनाने के लिए सभी 5 कालों तक जारी रखें।' },
  ],
};

// ─── Classical Sources ──────────────────────────────────────────────────────────
const CLASSICAL_SOURCES = [
  {
    title: { en: 'Pancha Pakshi Shastra', hi: 'पंच पक्षी शास्त्र' },
    description: {
      en: 'The primary text of this system, preserved in Tamil palm leaf manuscripts. It details the complete methodology of bird determination, activity cycles, and practical timing applications. The tradition is primarily oral, passed through Siddha lineages of South India.',
      hi: 'इस प्रणाली का प्राथमिक ग्रंथ, तमिल ताड़पत्र पांडुलिपियों में संरक्षित। यह पक्षी निर्धारण, गतिविधि चक्र और व्यावहारिक समय अनुप्रयोगों की पूर्ण पद्धति का विवरण देता है।',
    },
    color: 'text-amber-400',
  },
  {
    title: { en: 'Kalaprakasika', hi: 'कालप्रकाशिका' },
    description: {
      en: 'A comprehensive treatise on Muhurta (electional astrology) that includes sections on Pancha Pakshi. It provides the systematic framework for weekday-bird correspondences and the rotation rules used in the timing calculations.',
      hi: 'मुहूर्त (निर्वाचन ज्योतिष) पर एक व्यापक ग्रंथ जिसमें पंच पक्षी पर अनुभाग शामिल हैं। यह वार-पक्षी पत्राचार और समय गणना में प्रयुक्त घूर्णन नियमों का व्यवस्थित ढांचा प्रदान करता है।',
    },
    color: 'text-emerald-400',
  },
  {
    title: { en: 'Prasna Marga (Kerala)', hi: 'प्रश्न मार्ग (केरल)' },
    description: {
      en: 'The authoritative Kerala text on Prashna (horary) astrology, compiled in the 16th century. While primarily focused on Prashna methodology, it references Pancha Pakshi principles as part of the broader Kerala astrological tradition, connecting bird timing to horary chart interpretation.',
      hi: 'प्रश्न (होरारी) ज्योतिष पर केरल का प्रामाणिक ग्रंथ, 16वीं शताब्दी में संकलित। यह व्यापक केरल ज्योतिष परंपरा के भाग के रूप में पंच पक्षी सिद्धांतों का संदर्भ देता है।',
    },
    color: 'text-violet-400',
  },
  {
    title: { en: 'Siddha Tradition', hi: 'सिद्ध परंपरा' },
    description: {
      en: 'Pancha Pakshi is deeply embedded in the Siddha tradition of Tamil Nadu and Kerala. The Siddhas -- enlightened masters like Agastya, Bhogar, and Thirumoolar -- developed sophisticated timing systems that integrate astronomy, medicine, and spiritual practice. The five-bird system is one expression of their understanding of cosmic rhythms.',
      hi: 'पंच पक्षी तमिलनाडु और केरल की सिद्ध परंपरा में गहराई से अंतर्निहित है। सिद्ध -- अगस्त्य, भोगर और तिरुमूलर जैसे प्रबुद्ध गुरुओं -- ने परिष्कृत समय प्रणालियाँ विकसित कीं।',
    },
    color: 'text-cyan-400',
  },
];

// ─── Modern Applications ────────────────────────────────────────────────────────
const MODERN_APPLICATIONS = [
  {
    title: { en: 'Business & Meetings', hi: 'व्यापार और बैठकें' },
    description: { en: 'Schedule important negotiations, contract signings, and client meetings during your bird\'s Ruling phase. Avoid critical discussions during the Dying phase.', hi: 'अपने पक्षी के राज्य काल में महत्वपूर्ण बातचीत, अनुबंध और ग्राहक बैठकें निर्धारित करें। मृत्यु काल में महत्वपूर्ण चर्चाओं से बचें।' },
    icon: '1',
  },
  {
    title: { en: 'Travel Planning', hi: 'यात्रा योजना' },
    description: { en: 'Begin journeys during the Walking or Ruling phase for smooth travel. The Walking phase is especially favorable for any kind of movement or relocation.', hi: 'सुगम यात्रा के लिए गमन या राज्य काल में यात्रा आरम्भ करें। गमन काल विशेष रूप से किसी भी प्रकार की गति या स्थानांतरण के लिए अनुकूल है।' },
    icon: '2',
  },
  {
    title: { en: 'Competition & Sports', hi: 'प्रतियोगिता और खेल' },
    description: { en: 'Tamil kings historically used Pancha Pakshi to time battles. In modern context, schedule competitive events, exams, and athletic performances during your Ruling phase for maximum advantage.', hi: 'तमिल राजाओं ने ऐतिहासिक रूप से युद्धों के समय निर्धारण के लिए पंच पक्षी का उपयोग किया। आधुनिक संदर्भ में, अधिकतम लाभ के लिए अपने राज्य काल में प्रतियोगी कार्यक्रम निर्धारित करें।' },
    icon: '3',
  },
  {
    title: { en: 'Rest & Recovery', hi: 'विश्राम और पुनर्प्राप्ति' },
    description: { en: 'Use the Sleeping and Dying phases for rest, meditation, and internal work. These are natural windows for withdrawal from active engagement -- honor them rather than fight them.', hi: 'शयन और मृत्यु काल का उपयोग विश्राम, ध्यान और आंतरिक कार्य के लिए करें। ये सक्रिय सहभागिता से वापसी की प्राकृतिक खिड़कियाँ हैं।' },
    icon: '4',
  },
];

// ─── Scientific Perspective ─────────────────────────────────────────────────────
const SCIENTIFIC_POINTS = [
  {
    title: { en: 'Biorhythm Parallels', hi: 'जैव लय समानताएँ' },
    description: {
      en: 'Modern chronobiology has established that human performance fluctuates in roughly 90-120 minute ultradian cycles throughout the day. The Pancha Pakshi system divides the day into 5 periods of approximately 2.4 hours each -- remarkably close to these observed biological rhythms. While the mechanism proposed (bird assignment by birth nakshatra) lacks empirical validation, the cyclical timing framework itself has structural parallels with observed biorhythmic patterns.',
      hi: 'आधुनिक कालजीवविज्ञान ने स्थापित किया है कि मानव प्रदर्शन दिन भर में लगभग 90-120 मिनट के अल्ट्राडियन चक्रों में उतार-चढ़ाव करता है। पंच पक्षी प्रणाली दिन को लगभग 2.4 घंटे के 5 कालों में विभाजित करती है -- ये देखी गई जैविक लय के उल्लेखनीय रूप से निकट है।',
    },
  },
  {
    title: { en: 'Circadian Rhythm Research', hi: 'सर्कैडियन लय अनुसंधान' },
    description: {
      en: 'The day/night division in Pancha Pakshi mirrors the circadian rhythm research showing distinct hormonal and cognitive profiles between daytime and nighttime hours. The system\'s separate bird sequences for day and night acknowledge that the same person operates differently under solar vs. lunar influence -- a concept now supported by cortisol and melatonin cycle research.',
      hi: 'पंच पक्षी में दिन/रात विभाजन सर्कैडियन लय अनुसंधान को प्रतिबिम्बित करता है जो दिन और रात के घंटों के बीच विशिष्ट हार्मोनल और संज्ञानात्मक प्रोफाइल दर्शाता है।',
    },
  },
  {
    title: { en: 'Statistical Validity', hi: 'सांख्यिकीय वैधता' },
    description: {
      en: 'No peer-reviewed studies have validated the specific claim that birth nakshatra determines optimal activity timing via bird assignment. The system remains in the domain of traditional knowledge. However, the general principle that timing matters for human performance is well-established in psychology and sports science. The Pancha Pakshi framework, at minimum, provides a structured approach to timing awareness that may serve as a useful heuristic.',
      hi: 'किसी भी सहकर्मी-समीक्षित अध्ययन ने विशिष्ट दावे को मान्य नहीं किया है कि जन्म नक्षत्र पक्षी असाइनमेंट के माध्यम से इष्टतम गतिविधि समय निर्धारित करता है। तंत्र पारंपरिक ज्ञान के क्षेत्र में बना हुआ है।',
    },
  },
];

// ─── Bird Cycle SVG Component ───────────────────────────────────────────────────
function BirdCycleWheel({ locale }: { locale: string }) {
  const [hoveredBird, setHoveredBird] = useState<Bird | null>(null);
  const cx = 160, cy = 160, r = 120;
  const birdColors: Record<Bird, string> = {
    vulture: '#f59e0b', owl: '#3b82f6', crow: '#ef4444', cock: '#10b981', peacock: '#8b5cf6',
  };
  const birdSymbols: Record<Bird, string> = {
    vulture: '\u{1F985}', owl: '\u{1F989}', crow: '\u{1F426}', cock: '\u{1F413}', peacock: '\u{1F99A}',
  };
  // NOTE: emoji used for simplicity in the SVG wheel; the main page uses no emoji icons in other places.

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-xs mx-auto" role="img" aria-label="Five bird cycle wheel">
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r + 20} fill="none" stroke="rgba(212,168,83,0.15)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 20} fill="none" stroke="rgba(212,168,83,0.08)" strokeWidth="1" />

      {/* Connecting lines */}
      {BIRDS.map((bird, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const nextAngle = ((i + 1) * 72 - 90) * (Math.PI / 180);
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        const x2 = cx + r * Math.cos(nextAngle);
        const y2 = cy + r * Math.sin(nextAngle);
        return (
          <line key={`line-${bird.id}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={birdColors[bird.id]} strokeWidth="1.5" opacity="0.4" />
        );
      })}

      {/* Bird nodes */}
      {BIRDS.map((bird, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const isHovered = hoveredBird === bird.id;
        return (
          <g key={bird.id}
            onMouseEnter={() => setHoveredBird(bird.id)}
            onMouseLeave={() => setHoveredBird(null)}
            className="cursor-pointer"
          >
            <circle cx={x} cy={y} r={isHovered ? 32 : 28}
              fill={isHovered ? `${birdColors[bird.id]}30` : `${birdColors[bird.id]}15`}
              stroke={birdColors[bird.id]}
              strokeWidth={isHovered ? 2 : 1.5}
              className="transition-all duration-200"
            />
            <text x={x} y={y + 2} textAnchor="middle" dominantBaseline="middle"
              fontSize="22" className="select-none">
              {birdSymbols[bird.id]}
            </text>
            <text x={x} y={y + 44} textAnchor="middle" dominantBaseline="middle"
              fill={birdColors[bird.id]} fontSize="10" fontWeight="600" className="select-none">
              {tl(bird.name, locale)}
            </text>
          </g>
        );
      })}

      {/* Center label */}
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
        fill="#d4a853" fontSize="11" fontWeight="bold" className="select-none">
        {tl({ en: 'Pancha', hi: 'पंच', sa: 'पञ्च' }, locale)}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle"
        fill="#d4a853" fontSize="11" fontWeight="bold" className="select-none">
        {tl({ en: 'Pakshi', hi: 'पक्षी', sa: 'पक्षी' }, locale)}
      </text>
    </svg>
  );
}

// ─── Activity Grid Table ────────────────────────────────────────────────────────
function ActivityGridTable({ locale }: { locale: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gold-primary/20">
            <th className="px-3 py-2 text-left text-gold-light text-xs uppercase tracking-wider">
              {tl({ en: 'Period', hi: 'काल', sa: 'कालः' }, locale)}
            </th>
            <th className="px-3 py-2 text-center text-gold-light text-xs uppercase tracking-wider">
              {tl({ en: 'Ruling', hi: 'राज्य', sa: 'राज्यम्' }, locale)}
            </th>
            <th className="px-3 py-2 text-center text-gold-light text-xs uppercase tracking-wider">
              {tl({ en: 'Eating', hi: 'भोजन', sa: 'भोजनम्' }, locale)}
            </th>
            <th className="px-3 py-2 text-center text-gold-light text-xs uppercase tracking-wider">
              {tl({ en: 'Walking', hi: 'गमन', sa: 'गमनम्' }, locale)}
            </th>
            <th className="px-3 py-2 text-center text-gold-light text-xs uppercase tracking-wider">
              {tl({ en: 'Sleeping', hi: 'शयन', sa: 'शयनम्' }, locale)}
            </th>
            <th className="px-3 py-2 text-center text-gold-light text-xs uppercase tracking-wider">
              {tl({ en: 'Dying', hi: 'मृत्यु', sa: 'मृत्युः' }, locale)}
            </th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((period) => (
            <tr key={period} className="border-b border-gold-primary/8 hover:bg-gold-primary/5 transition-colors">
              <td className="px-3 py-2.5 text-text-secondary font-mono text-xs">
                {tl({ en: `Period ${period}`, hi: `काल ${period}`, sa: `कालः ${period}` }, locale)}
              </td>
              {BIRDS.map((bird) => {
                const birdInfo = BIRDS.find(b => b.id === bird.id)!;
                return (
                  <td key={bird.id} className="px-3 py-2.5 text-center">
                    <span className={`text-xs font-medium ${birdInfo.color}`}>
                      {tl(birdInfo.name, locale)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-text-secondary text-xs mt-2 italic">
        {tl({
          en: 'Note: The actual bird assigned to each activity slot rotates based on the weekday ruler. This table shows the conceptual structure -- one bird occupies each activity in each period.',
          hi: 'नोट: प्रत्येक गतिविधि स्लॉट को असाइन किया गया वास्तविक पक्षी सप्ताह के दिन के शासक के आधार पर घूमता है।',
          sa: 'सूचना: प्रत्येकगतिविधिस्थाने नियुक्तः वास्तविकपक्षी वारशासकस्य आधारेण भ्रमति।',
        }, locale)}
      </p>
    </div>
  );
}

// ─── Collapsible Section Component ──────────────────────────────────────────────
function CollapsibleSection({ title, icon, children, defaultOpen = false }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gold-primary/12 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-5 bg-gradient-to-r from-[#2d1b69]/30 to-[#0a0e27] hover:from-[#2d1b69]/40 transition-colors text-left"
      >
        {icon}
        <span className="text-gold-light font-bold text-lg flex-1">{title}</span>
        <ChevronDown className={`w-5 h-5 text-gold-primary transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' as const }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-2 space-y-4">
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
export default function LearnPanchaPakshiPage() {
  const locale = useLocale();
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedBird, setExpandedBird] = useState<Bird | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* ═══ Hero / Introduction ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-primary text-xs font-medium tracking-wider uppercase">
          {tl({ en: 'Kerala / Tamil Tradition', hi: 'केरल / तमिल परंपरा', sa: 'केरल / तमिल परम्परा' }, locale)}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gold-light leading-tight" style={headingFont}>
          {tl({ en: 'Pancha Pakshi', hi: 'पंच पक्षी', sa: 'पञ्चपक्षी' }, locale)}
        </h1>
        <p className="text-lg text-gold-primary/80 font-medium" style={headingFont}>
          {tl({ en: 'The Five Bird System of South Indian Astrology', hi: 'दक्षिण भारतीय ज्योतिष की पाँच पक्षी प्रणाली', sa: 'दक्षिणभारतीयज्योतिषस्य पञ्चपक्षिप्रणाली' }, locale)}
        </p>
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({
              en: 'Pancha Pakshi Shastra is an ancient timing system rooted in the Tamil Siddha and Kerala astrological traditions. Unlike mainstream Jyotish which focuses on planetary positions and dashas, this system assigns one of five sacred birds to each person based on their birth nakshatra. The bird cycles through five activities throughout the day, creating a personalized timing map that reveals when to act and when to wait.',
              hi: 'पंच पक्षी शास्त्र तमिल सिद्ध और केरल ज्योतिष परंपराओं में निहित एक प्राचीन समय प्रणाली है। मुख्यधारा ज्योतिष से भिन्न, यह प्रणाली जन्म नक्षत्र के आधार पर प्रत्येक व्यक्ति को पाँच पवित्र पक्षियों में से एक प्रदान करती है।',
              sa: 'पञ्चपक्षीशास्त्रं तमिलसिद्धकेरलज्योतिषपरम्परासु निहिता प्राचीनसमयप्रणाली अस्ति।',
            }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({
              en: 'The five birds -- Vulture, Owl, Crow, Cock, and Peacock -- correspond to the five great elements (Pancha Bhuta): Earth, Water, Fire, Air, and Ether. This elemental connection links the system to the broader Vedic framework of creation, where all matter and energy arise from these five fundamental principles.',
              hi: 'पाँच पक्षी -- गृध्र, उलूक, काक, कुक्कुट और मयूर -- पाँच महाभूतों (पंच भूत): पृथ्वी, जल, अग्नि, वायु और आकाश से संबंधित हैं।',
              sa: 'पञ्चपक्षिणः -- गृध्रः, उलूकः, काकः, कुक्कुटः, मयूरः -- पञ्चमहाभूतानां प्रतिनिधयः।',
            }, locale)}
          </p>
        </div>
      </motion.section>

      {/* ═══ Bird Cycle Wheel ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-gold-light text-center mb-4" style={headingFont}>
          {tl({ en: 'The Five Bird Cycle', hi: 'पाँच पक्षी चक्र', sa: 'पञ्चपक्षिचक्रम्' }, locale)}
        </h2>
        <BirdCycleWheel locale={locale} />
        <div className="grid grid-cols-5 gap-2 mt-4">
          {BIRDS.map(bird => (
            <div key={bird.id} className={`text-center p-2 rounded-lg ${bird.bgColor} border ${bird.borderColor}`}>
              <div className={`text-xs font-bold ${bird.color}`}>{tl(bird.element, locale)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Section 1: The Five Birds ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-gold-light" style={headingFont}>
          {tl({ en: 'The Five Birds and Their Nature', hi: 'पाँच पक्षी और उनका स्वभाव', sa: 'पञ्चपक्षिणः तेषां स्वभावश्च' }, locale)}
        </h2>
        <div className="space-y-3">
          {BIRDS.map(bird => (
            <div key={bird.id}
              className={`rounded-xl border ${bird.borderColor} overflow-hidden transition-all duration-200`}>
              <button
                onClick={() => setExpandedBird(expandedBird === bird.id ? null : bird.id)}
                className={`w-full flex items-center gap-4 p-4 ${bird.bgColor} hover:opacity-90 transition-opacity text-left`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bird.bgColor} border ${bird.borderColor}`}>
                  <span className={`text-lg font-bold ${bird.color}`}>{bird.sanskrit.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className={`font-bold ${bird.color}`}>{tl(bird.name, locale)}</div>
                  <div className="text-text-secondary text-xs">{tl(bird.element, locale)}</div>
                </div>
                <ChevronDown className={`w-4 h-4 ${bird.color} transition-transform ${expandedBird === bird.id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedBird === bird.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {tl(bird.description, locale)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Section 2: The Five Activities ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>
          {tl({ en: 'The Five Activities', hi: 'पाँच गतिविधियाँ', sa: 'पञ्चगतिविधयः' }, locale)}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({
            en: 'Each bird cycles through five activities during the day and again during the night. The activity determines the auspiciousness and recommended actions for that time period.',
            hi: 'प्रत्येक पक्षी दिन में और फिर रात में पाँच गतिविधियों से गुजरता है। गतिविधि उस समय अवधि के लिए शुभता और अनुशंसित कार्यों को निर्धारित करती है।',
            sa: 'प्रत्येकः पक्षी दिवसे रात्रौ च पञ्चगतिविधीषु भ्रमति।',
          }, locale)}
        </p>
        <div className="space-y-3">
          {ACTIVITIES.map(activity => (
            <div key={activity.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-bg-primary/50 border border-gold-primary/8"
            >
              <div className="flex flex-col items-center gap-1 shrink-0 w-16">
                <div className={`text-sm font-bold ${activity.color}`}>{tl(activity.name, locale)}</div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i}
                      className={`w-2 h-2 rounded-full ${i <= activity.power ? 'bg-gold-primary' : 'bg-gold-primary/20'}`}
                    />
                  ))}
                </div>
                <div className={`text-xs ${activity.color} font-medium`}>{activity.auspicious}</div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                {tl(activity.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Section 3: How It Works ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-gold-light" style={headingFont}>
          {tl({ en: 'How Pancha Pakshi Works', hi: 'पंच पक्षी कैसे काम करता है', sa: 'पञ्चपक्षी कथं कार्यं करोति' }, locale)}
        </h2>

        <CollapsibleSection
          title={tl({ en: 'Step 1: Birth Nakshatra Determines Your Bird', hi: 'चरण 1: जन्म नक्षत्र आपका पक्षी निर्धारित करता है', sa: 'चरण 1: जन्मनक्षत्रं भवतः पक्षिं निर्धारयति' }, locale)}
          icon={<Compass className="w-5 h-5 text-gold-primary shrink-0" />}
          defaultOpen
        >
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({
              en: 'Your Janma Pakshi (birth bird) is determined by your birth nakshatra. The 27 nakshatras are divided into 5 groups, each assigned to one bird. Nakshatras 1-5 belong to Vulture, 6-10 to Owl, 11-15 to Crow, 16-20 to Cock, and 21-27 to Peacock. This bird remains your ruling bird for life.',
              hi: 'आपका जन्म पक्षी आपके जन्म नक्षत्र द्वारा निर्धारित होता है। 27 नक्षत्रों को 5 समूहों में विभाजित किया गया है। नक्षत्र 1-5 गृध्र, 6-10 उलूक, 11-15 काक, 16-20 कुक्कुट और 21-27 मयूर को सौंपे गए हैं।',
              sa: 'भवतः जन्मपक्षी जन्मनक्षत्रेण निर्धार्यते। सप्तविंशतिनक्षत्राणि पञ्चसमूहेषु विभक्तानि।',
            }, locale)}
          </p>
        </CollapsibleSection>

        <CollapsibleSection
          title={tl({ en: 'Step 2: Weekday Sets the Daily Ruler', hi: 'चरण 2: सप्ताह का दिन दैनिक शासक निर्धारित करता है', sa: 'चरण 2: वारः दैनिकशासकं निर्धारयति' }, locale)}
          icon={<Sun className="w-5 h-5 text-gold-primary shrink-0" />}
        >
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            {tl({
              en: 'Each day of the week has a ruling bird that starts as the "Ruling" bird in the first period. The night ruler is the next bird in sequence after the day ruler.',
              hi: 'सप्ताह के प्रत्येक दिन का एक शासक पक्षी होता है जो पहले काल में "राज्य" पक्षी के रूप में शुरू होता है। रात्रि शासक दिवस शासक के बाद क्रम में अगला पक्षी होता है।',
              sa: 'प्रत्येकवारस्य एकः शासकपक्षी अस्ति यः प्रथमकाले राज्यपक्षिरूपेण आरभते।',
            }, locale)}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="px-3 py-2 text-left text-gold-light text-xs uppercase tracking-wider">
                    {tl({ en: 'Day', hi: 'दिन', sa: 'वारः' }, locale)}
                  </th>
                  <th className="px-3 py-2 text-left text-gold-light text-xs uppercase tracking-wider">
                    {tl({ en: 'Day Ruler', hi: 'दिवस शासक', sa: 'दिवसशासकः' }, locale)}
                  </th>
                  <th className="px-3 py-2 text-left text-gold-light text-xs uppercase tracking-wider">
                    {tl({ en: 'Night Ruler', hi: 'रात्रि शासक', sa: 'रात्रिशासकः' }, locale)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {WEEKDAY_RULERS.map((wd, i) => {
                  const dayBird = BIRDS.find(b => b.id === wd.bird)!;
                  const nightBirdId = BIRDS[(BIRDS.findIndex(b => b.id === wd.bird) + 1) % 5];
                  return (
                    <tr key={i} className="border-b border-gold-primary/8">
                      <td className="px-3 py-2 text-text-secondary text-sm">{tl(wd.day, locale)}</td>
                      <td className={`px-3 py-2 text-sm font-medium ${dayBird.color}`}>{tl(dayBird.name, locale)}</td>
                      <td className={`px-3 py-2 text-sm font-medium ${nightBirdId.color}`}>{tl(nightBirdId.name, locale)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title={tl({ en: 'Step 3: The 5-Phase Day/Night Rotation', hi: 'चरण 3: 5-चरण दिन/रात घूर्णन', sa: 'चरण 3: पञ्चचरणदिवसरात्रिभ्रमणम्' }, locale)}
          icon={<Clock className="w-5 h-5 text-gold-primary shrink-0" />}
        >
          <div className="space-y-3">
            <p className="text-text-secondary text-sm leading-relaxed">
              {tl({
                en: 'The day (sunrise to sunset) is divided into 5 equal periods. The night (sunset to next sunrise) is also divided into 5 equal periods. In each period, one bird "rules" and the others cycle through Eating, Walking, Sleeping, and Dying.',
                hi: 'दिन (सूर्योदय से सूर्यास्त) को 5 समान कालों में विभाजित किया जाता है। रात (सूर्यास्त से अगले सूर्योदय) को भी 5 समान कालों में विभाजित किया जाता है।',
                sa: 'दिवसः (सूर्योदयात् सूर्यास्तपर्यन्तम्) पञ्चसमानकालेषु विभक्तः। रात्रिरपि पञ्चसमानकालेषु विभक्ता।',
              }, locale)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                    {tl({ en: 'Daytime', hi: 'दिन', sa: 'दिवसः' }, locale)}
                  </span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {tl({
                    en: 'Each period = (sunset - sunrise) / 5. In summer, periods are longer (~2.8 hrs). In winter, shorter (~1.9 hrs).',
                    hi: 'प्रत्येक काल = (सूर्यास्त - सूर्योदय) / 5। गर्मी में काल लंबे (~2.8 घंटे)। सर्दी में छोटे (~1.9 घंटे)।',
                    sa: 'प्रत्येकः कालः = (सूर्यास्तः - सूर्योदयः) / ५।',
                  }, locale)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/8 border border-blue-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                    {tl({ en: 'Nighttime', hi: 'रात', sa: 'रात्रिः' }, locale)}
                  </span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {tl({
                    en: 'Each period = (next sunrise - sunset) / 5. Night ruler is shifted by 1 from day ruler. Separate rotation applies.',
                    hi: 'प्रत्येक काल = (अगला सूर्योदय - सूर्यास्त) / 5। रात्रि शासक दिवस शासक से 1 स्थान आगे होता है।',
                    sa: 'प्रत्येकः कालः = (परसूर्योदयः - सूर्यास्तः) / ५।',
                  }, locale)}
                </p>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title={tl({ en: 'Activity Grid: Bird x Activity x Period', hi: 'गतिविधि ग्रिड: पक्षी x गतिविधि x काल', sa: 'गतिविधिजालिका: पक्षी x गतिविधि x कालः' }, locale)}
          icon={<Clock className="w-5 h-5 text-gold-primary shrink-0" />}
        >
          <ActivityGridTable locale={locale} />
        </CollapsibleSection>
      </motion.section>

      {/* ═══ Section 4: Worked Example ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>
          {tl({ en: 'Worked Example', hi: 'उदाहरण', sa: 'उदाहरणम्' }, locale)}
        </h2>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
          <div className="text-amber-400 text-xs font-bold uppercase tracking-wider shrink-0">
            {tl({ en: 'Person', hi: 'व्यक्ति', sa: 'व्यक्तिः' }, locale)}:
          </div>
          <div className="text-text-primary text-sm font-medium">
            {tl(WORKED_EXAMPLE.person, locale)}
          </div>
        </div>
        <div className="space-y-3">
          {WORKED_EXAMPLE.steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-gold-primary text-xs font-bold">{i + 1}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {tl(step, locale)}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Section 5: Nakshatra → Bird Mapping Table ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-gold-light" style={headingFont}>
          {tl({ en: 'Nakshatra to Bird Mapping', hi: 'नक्षत्र से पक्षी मानचित्रण', sa: 'नक्षत्रपक्षिसम्बन्धः' }, locale)}
        </h2>
        <div className="space-y-4">
          {NAKSHATRA_BIRD_MAP.map(group => {
            const bird = BIRDS.find(b => b.id === group.bird)!;
            return (
              <div key={group.bird}
                className={`rounded-xl border ${bird.borderColor} overflow-hidden`}
              >
                <div className={`px-4 py-3 ${bird.bgColor} flex items-center justify-between`}>
                  <div className={`font-bold ${bird.color}`}>{tl(bird.name, locale)}</div>
                  <div className="text-text-secondary text-xs font-mono">
                    {tl({ en: `Nakshatras ${group.range}`, hi: `नक्षत्र ${group.range}`, sa: `नक्षत्राणि ${group.range}` }, locale)}
                  </div>
                </div>
                <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {group.nakshatras.map(nak => (
                    <div key={nak.id} className="flex items-center gap-2 p-2 rounded-lg bg-bg-primary/50">
                      <span className="text-gold-dark text-xs font-mono w-5 text-right">{nak.id}.</span>
                      <span className="text-text-primary text-sm">{tl(nak.name, locale)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ═══ Section 6: Practical Applications ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>
          {tl({ en: 'Practical Applications', hi: 'व्यावहारिक अनुप्रयोग', sa: 'व्यावहारिकप्रयोगाः' }, locale)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODERN_APPLICATIONS.map((app, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-primary/50 border border-gold-primary/8 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center">
                  <span className="text-gold-primary text-xs font-bold">{app.icon}</span>
                </div>
                <h3 className="text-gold-light font-bold text-sm">{tl(app.title, locale)}</h3>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{tl(app.description, locale)}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-red-500/8 border border-red-500/15">
          <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-1">
            {tl({ en: 'Historical Use: Warfare', hi: 'ऐतिहासिक उपयोग: युद्ध', sa: 'ऐतिहासिकप्रयोगः: युद्धम्' }, locale)}
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            {tl({
              en: 'Tamil kings such as those of the Chola and Pandya dynasties reportedly used Pancha Pakshi to time military campaigns. The system was considered a strategic advantage -- attacking when one\'s bird is in its Ruling phase and the opponent\'s bird is in its Dying phase was believed to ensure victory. This martial application gave the system its reputation as a closely guarded royal secret.',
              hi: 'चोल और पाण्ड्य वंशों के तमिल राजाओं ने कथित रूप से सैन्य अभियानों के समय निर्धारण के लिए पंच पक्षी का उपयोग किया। यह प्रणाली एक सामरिक लाभ मानी जाती थी।',
              sa: 'चोलपाण्ड्यवंशानां तमिलनृपाः सैन्याभियानानां समयनिर्धारणाय पञ्चपक्षीप्रणालीम् उपयुक्तवन्तः इति श्रूयते।',
            }, locale)}
          </p>
        </div>
      </motion.section>

      {/* ═══ Section 7: Classical Sources ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-gold-light flex items-center gap-3" style={headingFont}>
          <BookOpen className="w-6 h-6 text-gold-primary" />
          {tl({ en: 'Classical Sources', hi: 'शास्त्रीय स्रोत', sa: 'शास्त्रीयस्रोतांसि' }, locale)}
        </h2>
        <div className="space-y-3">
          {CLASSICAL_SOURCES.map((source, i) => (
            <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/10">
              <h3 className={`font-bold text-sm ${source.color} mb-2`}>{tl(source.title, locale)}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{tl(source.description, locale)}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Section 8: Scientific Perspective ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gold-light flex items-center gap-3" style={headingFont}>
          <FlaskConical className="w-5 h-5 text-gold-primary" />
          {tl({ en: 'Scientific Perspective', hi: 'वैज्ञानिक दृष्टिकोण', sa: 'वैज्ञानिकदृष्टिकोणः' }, locale)}
        </h2>
        <div className="space-y-4">
          {SCIENTIFIC_POINTS.map((point, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-primary/50 border border-gold-primary/8">
              <h3 className="text-gold-light font-bold text-sm mb-2">{tl(point.title, locale)}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{tl(point.description, locale)}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Key Differences from Mainstream Jyotish ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-gold-light" style={headingFont}>
          {tl({ en: 'How It Differs from Mainstream Jyotish', hi: 'मुख्यधारा ज्योतिष से कैसे भिन्न', sa: 'मुख्यधाराज्योतिषात् कथं भिन्नम्' }, locale)}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="px-3 py-2 text-left text-gold-light text-xs uppercase tracking-wider">
                  {tl({ en: 'Aspect', hi: 'पहलू', sa: 'पक्षः' }, locale)}
                </th>
                <th className="px-3 py-2 text-left text-gold-light text-xs uppercase tracking-wider">
                  {tl({ en: 'Mainstream Jyotish', hi: 'मुख्यधारा ज्योतिष', sa: 'मुख्यधाराज्योतिषम्' }, locale)}
                </th>
                <th className="px-3 py-2 text-left text-gold-light text-xs uppercase tracking-wider">
                  {tl({ en: 'Pancha Pakshi', hi: 'पंच पक्षी', sa: 'पञ्चपक्षी' }, locale)}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  aspect: { en: 'Primary input', hi: 'प्राथमिक इनपुट', sa: 'प्राथमिकनिवेशः' },
                  mainstream: { en: 'Planet positions, houses, aspects', hi: 'ग्रह स्थिति, भाव, दृष्टि', sa: 'ग्रहस्थितिः, भावाः, दृष्टयः' },
                  pakshi: { en: 'Birth nakshatra + weekday + time', hi: 'जन्म नक्षत्र + वार + समय', sa: 'जन्मनक्षत्रं + वारः + कालः' },
                },
                {
                  aspect: { en: 'Timing granularity', hi: 'समय सूक्ष्मता', sa: 'कालसूक्ष्मता' },
                  mainstream: { en: 'Dashas (years), transits (months)', hi: 'दशा (वर्ष), गोचर (माह)', sa: 'दशाः (वर्षाणि), गोचरः (मासाः)' },
                  pakshi: { en: '~2-3 hour periods within each day', hi: '~2-3 घंटे के काल प्रतिदिन', sa: '~२-३ होरासु कालाः प्रतिदिनम्' },
                },
                {
                  aspect: { en: 'Origin', hi: 'उत्पत्ति', sa: 'उत्पत्तिः' },
                  mainstream: { en: 'Sanskrit shastras (BPHS, etc.)', hi: 'संस्कृत शास्त्र (BPHS आदि)', sa: 'संस्कृतशास्त्राणि (BPHS इत्यादि)' },
                  pakshi: { en: 'Tamil Siddha / Kerala palm leaf tradition', hi: 'तमिल सिद्ध / केरल ताड़पत्र परंपरा', sa: 'तमिलसिद्ध / केरलताडपत्रपरम्परा' },
                },
                {
                  aspect: { en: 'Complexity', hi: 'जटिलता', sa: 'जटिलता' },
                  mainstream: { en: 'High (12 houses, 9 planets, aspects, yogas)', hi: 'उच्च (12 भाव, 9 ग्रह, दृष्टि, योग)', sa: 'उच्चा (१२ भावाः, ९ ग्रहाः, दृष्टयः, योगाः)' },
                  pakshi: { en: 'Low (1 bird, 5 activities, 5 periods)', hi: 'निम्न (1 पक्षी, 5 गतिविधियाँ, 5 काल)', sa: 'न्यूना (१ पक्षी, ५ गतिविधयः, ५ कालाः)' },
                },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gold-primary/8">
                  <td className="px-3 py-2.5 text-gold-dark text-sm font-medium">{tl(row.aspect, locale)}</td>
                  <td className="px-3 py-2.5 text-text-secondary text-sm">{tl(row.mainstream, locale)}</td>
                  <td className="px-3 py-2.5 text-text-primary text-sm">{tl(row.pakshi, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ═══ Related Links ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center space-y-4"
      >
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>
          {tl({ en: 'Explore Related Topics', hi: 'संबंधित विषय देखें', sa: 'सम्बद्धविषयान् अन्वेषयतु' }, locale)}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/learn/nakshatras', label: { en: 'Nakshatras', hi: 'नक्षत्र', sa: 'नक्षत्राणि' } },
            { href: '/learn/muhurtas', label: { en: 'Muhurtas', hi: 'मुहूर्त', sa: 'मुहूर्ताः' } },
            { href: '/prashna-ashtamangala', label: { en: 'Ashtamangala Prashna', hi: 'अष्टमंगल प्रश्न', sa: 'अष्टमङ्गलप्रश्नः' } },
            { href: '/learn/hora', label: { en: 'Hora (Planetary Hours)', hi: 'होरा (ग्रह घंटे)', sa: 'होरा (ग्रहहोराः)' } },
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएं', sa: 'कुण्डलीं रचयतु' } },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium">
              {tl(link.label, locale)} &rarr;
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
