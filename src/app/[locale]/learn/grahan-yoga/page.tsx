'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sun, Moon, AlertTriangle, Shield, BookOpen, Brain } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';

// ─── Inline Labels (en + hi) ────────────────────────────────────────────────
const L: Record<string, LocaleText> = {
  title: { en: 'Grahan Yoga', hi: 'ग्रहण योग' },
  subtitle: { en: 'Eclipse Yoga in the Birth Chart', hi: 'जन्म कुण्डली में ग्रहण योग' },
  heroDesc: {
    en: 'When the Sun or Moon is conjoined with Rahu or Ketu in the birth chart, an "eclipse" is permanently encoded in the nativity. This is Grahan Yoga — one of the most discussed and feared combinations in Vedic astrology, yet often misunderstood.',
    hi: 'जब जन्म कुण्डली में सूर्य या चन्द्रमा राहु या केतु के साथ युति में हों, तो जातक में एक "ग्रहण" स्थायी रूप से अंकित होता है। यह ग्रहण योग है — वैदिक ज्योतिष में सबसे चर्चित और भयभीत करने वाले योगों में से एक, फिर भी अक्सर गलत समझा जाता है।'
  },
  introTitle: { en: 'What is Grahan Yoga?', hi: 'ग्रहण योग क्या है?' },
  introP1: {
    en: 'In astronomy, a solar eclipse occurs when the Moon passes between the Earth and the Sun, and a lunar eclipse occurs when the Earth\'s shadow falls on the Moon. Both events require the luminaries to be near the lunar nodes — Rahu (North Node) and Ketu (South Node).',
    hi: 'खगोल विज्ञान में, सूर्य ग्रहण तब होता है जब चन्द्रमा पृथ्वी और सूर्य के बीच से गुजरता है, और चन्द्र ग्रहण तब होता है जब पृथ्वी की छाया चन्द्रमा पर पड़ती है। दोनों घटनाओं के लिए ज्योतियों का चन्द्र पातों — राहु (उत्तर पात) और केतु (दक्षिण पात) — के निकट होना आवश्यक है।'
  },
  introP2: {
    en: 'In the birth chart, when a luminary (Sun or Moon) is in the same sign as a node (Rahu or Ketu), the person is born with an "eclipse signature." The luminary\'s significations — identity, vitality, mind, emotions — are perpetually shadowed by the node\'s karmic energy.',
    hi: 'जन्म कुण्डली में, जब कोई ज्योति (सूर्य या चन्द्रमा) किसी पात (राहु या केतु) के समान राशि में होती है, तो व्यक्ति एक "ग्रहण चिह्न" के साथ जन्म लेता है। ज्योति के कारकत्व — पहचान, जीवन शक्ति, मन, भावनाएँ — पात की कार्मिक ऊर्जा से सदा आच्छादित रहते हैं।'
  },
  introP3: {
    en: 'Grahan Yoga is NOT an automatic curse. Its effects depend heavily on the orb of conjunction, the house placement, the sign involved, aspects from benefics (especially Jupiter), and the overall chart strength. Many successful and spiritually evolved individuals have this yoga.',
    hi: 'ग्रहण योग स्वतः अभिशाप नहीं है। इसके प्रभाव युति की परिधि, भाव स्थिति, सम्बन्धित राशि, शुभ ग्रहों (विशेषतः बृहस्पति) की दृष्टि और समग्र कुण्डली बल पर बहुत निर्भर करते हैं। अनेक सफल और आध्यात्मिक रूप से विकसित व्यक्तियों में यह योग होता है।'
  },
  fourTypes: { en: 'The Four Types', hi: 'चार प्रकार' },
  formationTitle: { en: 'Formation Rules', hi: 'गठन के नियम' },
  formationOrb: {
    en: 'The conjunction must typically be within 8-12 degrees to be effective. The tighter the orb, the stronger the yoga. An exact conjunction (within 1-2 degrees) creates the most powerful effects — both challenging and transformative.',
    hi: 'प्रभावी होने के लिए युति सामान्यतः 8-12 अंशों के भीतर होनी चाहिए। जितनी संकीर्ण परिधि, उतना प्रबल योग। सटीक युति (1-2 अंशों के भीतर) सबसे शक्तिशाली प्रभाव उत्पन्न करती है — चुनौतीपूर्ण और परिवर्तनकारी दोनों।'
  },
  formationSameSign: {
    en: 'Same sign conjunction is the classical definition. Different sign conjunction (where Rahu/Ketu is in the adjacent sign but within orb) is weaker but still relevant. The sign lord\'s strength determines whether the eclipse energy is constructive or destructive.',
    hi: 'समान राशि में युति शास्त्रीय परिभाषा है। भिन्न राशि में युति (जहाँ राहु/केतु निकटवर्ती राशि में पर परिधि के भीतर है) दुर्बल पर प्रासंगिक है। राशि स्वामी की शक्ति निर्धारित करती है कि ग्रहण ऊर्जा रचनात्मक है या विनाशकारी।'
  },
  formationHouses: {
    en: 'The most impactful houses for Grahan Yoga are the 1st (self/health), 5th (children/intelligence), 7th (marriage/partnerships), 9th (fortune/father/dharma), and 10th (career/public life). In the 12th house, it often gives spiritual depth and past-life awareness.',
    hi: 'ग्रहण योग के लिए सबसे प्रभावी भाव हैं — प्रथम (स्वयं/स्वास्थ्य), पंचम (सन्तान/बुद्धि), सप्तम (विवाह/साझेदारी), नवम (भाग्य/पिता/धर्म) और दशम (कैरियर/सार्वजनिक जीवन)। द्वादश भाव में यह प्रायः आध्यात्मिक गहराई और पूर्वजन्म चेतना देता है।'
  },
  effectsTitle: { en: 'Effects by Type', hi: 'प्रकार अनुसार प्रभाव' },
  houseTitle: { en: 'House-wise Effects', hi: 'भाव अनुसार प्रभाव' },
  houseDesc: {
    en: 'The house where Grahan Yoga falls determines which life area is most affected. Below are the primary themes for each house placement.',
    hi: 'जिस भाव में ग्रहण योग पड़ता है, वह निर्धारित करता है कि कौन सा जीवन क्षेत्र सबसे अधिक प्रभावित होता है। नीचे प्रत्येक भाव स्थिति के प्राथमिक विषय हैं।'
  },
  cancellationTitle: { en: 'Cancellation & Mitigation', hi: 'भंग और शमन' },
  cancellationDesc: {
    en: 'Grahan Yoga is not irreversible. Several factors can cancel or significantly reduce its negative effects:',
    hi: 'ग्रहण योग अपरिवर्तनीय नहीं है। कई कारक इसके नकारात्मक प्रभावों को रद्द या काफी कम कर सकते हैं:'
  },
  classicalTitle: { en: 'Classical References', hi: 'शास्त्रीय सन्दर्भ' },
  modernTitle: { en: 'Modern Perspective', hi: 'आधुनिक परिप्रेक्ष्य' },
  modernP1: {
    en: 'In psychological terms, Grahan Yoga represents the "shadow self" — unconscious patterns, repressed fears, and inherited ancestral trauma that surface through the luminary\'s significations. Sun-node contacts challenge the ego structure, while Moon-node contacts disrupt emotional security.',
    hi: 'मनोवैज्ञानिक दृष्टि से, ग्रहण योग "छाया स्व" का प्रतिनिधित्व करता है — अचेतन प्रतिरूप, दमित भय, और वंशानुगत आघात जो ज्योति के कारकत्वों के माध्यम से प्रकट होते हैं।'
  },
  modernP2: {
    en: 'Eclipse cycles in mundane astrology show remarkable correspondence with collective events. Individuals born during actual eclipses carry this energy most intensely, but the natal conjunction creates a lifelong resonance with eclipse seasons — periods when the transiting nodes return to the natal luminary position.',
    hi: 'साम्प्रदायिक ज्योतिष में ग्रहण चक्र सामूहिक घटनाओं के साथ उल्लेखनीय पत्राचार दिखाते हैं। वास्तविक ग्रहणों के दौरान जन्मे व्यक्ति इस ऊर्जा को सबसे तीव्रता से वहन करते हैं।'
  },
  modernP3: {
    en: 'The shadow work metaphor is apt: Grahan Yoga individuals often become healers, counselors, or transformative leaders precisely because they have faced and integrated their shadow. The yoga demands confrontation with uncomfortable truths — and rewards it with depth, authenticity, and the ability to help others through their own darkness.',
    hi: 'छाया कार्य रूपक उपयुक्त है: ग्रहण योग वाले व्यक्ति प्रायः चिकित्सक, परामर्शदाता, या परिवर्तनकारी नेता बनते हैं क्योंकि उन्होंने अपनी छाया का सामना किया और उसे एकीकृत किया है।'
  },
  severityTitle: { en: 'Severity Assessment', hi: 'गम्भीरता आकलन' },
  linksTitle: { en: 'Related Topics', hi: 'सम्बन्धित विषय' },
};

// ─── Four Grahan Yoga Types ──────────────────────────────────────────────────
const GRAHAN_TYPES = [
  {
    id: 'sun-rahu',
    name: { en: 'Surya Grahan Yoga (Sun-Rahu)', hi: 'सूर्य ग्रहण योग (सूर्य-राहु)' },
    luminary: 'Sun',
    node: 'Rahu',
    icon: 'sun-rahu' as const,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/8',
    summary: {
      en: 'Rahu amplifies and distorts the Sun\'s energy. The native struggles with authority, father figures, and self-identity. There is a deep hunger for recognition that is never fully satisfied — Rahu\'s insatiable appetite applied to the ego.',
      hi: 'राहु सूर्य की ऊर्जा को बढ़ाता और विकृत करता है। जातक अधिकार, पिता सम्बन्ध और आत्म-पहचान से संघर्ष करता है। मान्यता की गहरी भूख जो पूर्णतः तृप्त नहीं होती।'
    },
    effects: [
      { en: 'Father absent, distant, or a complicated relationship — authority trauma', hi: 'पिता अनुपस्थित, दूर, या जटिल सम्बन्ध — अधिकार आघात' },
      { en: 'Ego inflation followed by deflation cycles — identity confusion', hi: 'अहंकार प्रसार फिर संकुचन चक्र — पहचान भ्रम' },
      { en: 'Unconventional career path — attracted to power, politics, foreign lands', hi: 'अपरम्परागत कैरियर मार्ग — सत्ता, राजनीति, विदेश की ओर आकर्षण' },
      { en: 'Chronic vitality issues, especially heart, spine, eyes', hi: 'दीर्घकालिक जीवन शक्ति समस्याएँ, विशेषतः हृदय, रीढ़, आँखें' },
      { en: 'Deep karmic lessons around leadership and humility', hi: 'नेतृत्व और विनम्रता सम्बन्धी गहरे कार्मिक पाठ' },
    ],
  },
  {
    id: 'sun-ketu',
    name: { en: 'Surya Grahan Yoga (Sun-Ketu)', hi: 'सूर्य ग्रहण योग (सूर्य-केतु)' },
    luminary: 'Sun',
    node: 'Ketu',
    icon: 'sun-ketu' as const,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/20',
    bgColor: 'bg-orange-500/8',
    summary: {
      en: 'Ketu dissolves the Sun\'s worldly ambitions. The native may appear detached from ego pursuits, indifferent to worldly success, or drawn to spirituality. Ketu brings past-life mastery that can manifest as talent but also as disinterest in material achievement.',
      hi: 'केतु सूर्य की सांसारिक महत्वाकांक्षाओं को विघटित करता है। जातक अहंकार के प्रयासों से विरक्त, सांसारिक सफलता के प्रति उदासीन, या आध्यात्मिकता की ओर आकर्षित दिख सकता है।'
    },
    effects: [
      { en: 'Spiritual inclination from early age — monastic or ascetic tendencies', hi: 'बाल्यकाल से आध्यात्मिक रुझान — सन्यासी या तपस्वी प्रवृत्तियाँ' },
      { en: 'Father may be spiritual, absent, or have health issues', hi: 'पिता आध्यात्मिक, अनुपस्थित, या स्वास्थ्य समस्याओं वाले हो सकते हैं' },
      { en: 'Difficulty sustaining worldly ambitions — starts strong, loses interest', hi: 'सांसारिक महत्वाकांक्षाओं को बनाए रखने में कठिनाई' },
      { en: 'Health: fevers, bile disorders, weakened constitution', hi: 'स्वास्थ्य: ज्वर, पित्त विकार, दुर्बल शारीरिक संरचना' },
      { en: 'Past-life gifts surface naturally — sudden intuitive knowledge', hi: 'पूर्वजन्म की प्रतिभाएँ स्वाभाविक रूप से प्रकट होती हैं — अचानक अन्तर्ज्ञान' },
    ],
  },
  {
    id: 'moon-rahu',
    name: { en: 'Chandra Grahan Yoga (Moon-Rahu)', hi: 'चन्द्र ग्रहण योग (चन्द्र-राहु)' },
    luminary: 'Moon',
    node: 'Rahu',
    icon: 'moon-rahu' as const,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    bgColor: 'bg-blue-500/8',
    summary: {
      en: 'Rahu obsesses and magnifies the Moon\'s emotional nature. The native experiences intense emotions, anxiety, fear, and an overactive imagination. The mind is constantly restless — Rahu\'s amplification applied to feelings and perceptions.',
      hi: 'राहु चन्द्रमा की भावनात्मक प्रकृति को ग्रसित और प्रवर्धित करता है। जातक तीव्र भावनाएँ, चिन्ता, भय और अतिसक्रिय कल्पना अनुभव करता है। मन सदा अशान्त रहता है।'
    },
    effects: [
      { en: 'Emotional turbulence — anxiety, phobias, obsessive thinking', hi: 'भावनात्मक उथल-पुथल — चिन्ता, भय, जुनूनी विचार' },
      { en: 'Mother relationship complicated — enmeshment or manipulation themes', hi: 'माता सम्बन्ध जटिल — उलझन या छलपूर्ण प्रवृत्तियाँ' },
      { en: 'Powerful imagination — can manifest as artistic genius or paranoia', hi: 'शक्तिशाली कल्पना — कलात्मक प्रतिभा या भ्रम के रूप में प्रकट हो सकती है' },
      { en: 'Sleep disturbances, vivid dreams, possible psychic sensitivity', hi: 'निद्रा विकार, स्पष्ट स्वप्न, सम्भावित मानसिक संवेदनशीलता' },
      { en: 'Attraction to intoxicants or escapist behaviors', hi: 'मादक पदार्थों या पलायनवादी व्यवहारों की ओर आकर्षण' },
    ],
  },
  {
    id: 'moon-ketu',
    name: { en: 'Chandra Grahan Yoga (Moon-Ketu)', hi: 'चन्द्र ग्रहण योग (चन्द्र-केतु)' },
    luminary: 'Moon',
    node: 'Ketu',
    icon: 'moon-ketu' as const,
    color: 'text-violet-400',
    borderColor: 'border-violet-500/20',
    bgColor: 'bg-violet-500/8',
    summary: {
      en: 'Ketu detaches the Moon from emotional engagement. The native may appear emotionally numb, disconnected, or spiritually otherworldly. There is deep psychic sensitivity but difficulty expressing or even feeling normal human emotions.',
      hi: 'केतु चन्द्रमा को भावनात्मक सम्पर्क से विरक्त करता है। जातक भावनात्मक रूप से जड़, वियुक्त, या आध्यात्मिक रूप से अलौकिक दिख सकता है।'
    },
    effects: [
      { en: 'Emotional numbness or dissociation — feeling "not fully here"', hi: 'भावनात्मक जड़ता या विघटन — "पूर्णतः यहाँ नहीं" का भाव' },
      { en: 'Psychic ability — clairvoyance, past-life memories, intuition', hi: 'मानसिक क्षमता — दिव्यदृष्टि, पूर्वजन्म स्मृतियाँ, अन्तर्ज्ञान' },
      { en: 'Mother may be spiritual or emotionally unavailable', hi: 'माता आध्यात्मिक या भावनात्मक रूप से अनुपलब्ध हो सकती हैं' },
      { en: 'Difficulty bonding — relationships feel karmically heavy', hi: 'बन्धन में कठिनाई — सम्बन्ध कार्मिक रूप से भारी लगते हैं' },
      { en: 'Past-life emotional patterns surface for resolution', hi: 'पूर्वजन्म के भावनात्मक प्रतिरूप समाधान हेतु प्रकट होते हैं' },
    ],
  },
];

// ─── House Effects ───────────────────────────────────────────────────────────
const HOUSE_EFFECTS: { house: number; en: string; hi: string }[] = [
  { house: 1, en: 'Identity crisis, health challenges, unusual personality. The self is eclipsed — the native reinvents themselves repeatedly. Strong drive toward self-discovery.', hi: 'पहचान संकट, स्वास्थ्य चुनौतियाँ, असामान्य व्यक्तित्व। स्वयं ग्रसित — जातक बार-बार स्वयं को पुनः परिभाषित करता है।' },
  { house: 2, en: 'Family discord, speech issues (stammer or harsh speech), financial instability. Inherited family karma. Unconventional eating habits or dietary restrictions.', hi: 'पारिवारिक कलह, वाणी दोष, आर्थिक अस्थिरता। वंशानुगत पारिवारिक कर्म। असामान्य आहार आदतें।' },
  { house: 3, en: 'Courage fluctuates, strained sibling relationships, communication challenges. But potential for powerful writing, media work, or unconventional artistic expression.', hi: 'साहस में उतार-चढ़ाव, भाई-बहन से तनावपूर्ण सम्बन्ध, संवाद चुनौतियाँ। परन्तु शक्तिशाली लेखन, मीडिया कार्य की सम्भावना।' },
  { house: 4, en: 'Domestic instability, mother\'s health or emotional absence, property disputes. Inner peace is hard to find. May live far from birthplace.', hi: 'घरेलू अस्थिरता, माता का स्वास्थ्य या भावनात्मक अनुपस्थिति, सम्पत्ति विवाद। आन्तरिक शान्ति कठिन।' },
  { house: 5, en: 'Children delayed or complicated, education disrupted, intelligence is sharp but erratic. Romance follows unusual patterns. Creative genius possible but unpredictable.', hi: 'सन्तान में विलम्ब या जटिलता, शिक्षा बाधित, बुद्धि तीव्र पर अनियमित। रचनात्मक प्रतिभा सम्भव पर अनिश्चित।' },
  { house: 6, en: 'Can actually be beneficial — the eclipse empowers the native to overcome enemies, diseases, and debts. Healing ability. Good for medical or service professions.', hi: 'वस्तुतः लाभकारी हो सकता है — ग्रहण जातक को शत्रु, रोग और ऋण पर विजय देता है। चिकित्सा क्षमता।' },
  { house: 7, en: 'Marriage faces unusual challenges — partner may be from different culture, or relationship has karmic intensity. Business partnerships need caution.', hi: 'विवाह असामान्य चुनौतियों का सामना करता है — साथी भिन्न संस्कृति का, या सम्बन्ध कार्मिक तीव्रता वाला। व्यापारिक साझेदारी में सावधानी आवश्यक।' },
  { house: 8, en: 'Deep transformations, occult interests, inheritance disputes. Powerful research ability. Near-death experiences or profound life crises that lead to rebirth.', hi: 'गहरे परिवर्तन, गूढ़ रुचियाँ, विरासत विवाद। शक्तिशाली शोध क्षमता। मृत्यु-निकट अनुभव या गहरे जीवन संकट।' },
  { house: 9, en: 'Father\'s health or relationship affected, religious beliefs challenged, guru relationships complicated. May develop unconventional spiritual path.', hi: 'पिता का स्वास्थ्य या सम्बन्ध प्रभावित, धार्मिक विश्वास चुनौतीपूर्ण। अपरम्परागत आध्यात्मिक मार्ग विकसित कर सकता है।' },
  { house: 10, en: 'Career follows non-linear path — sudden rises and falls. Public reputation eclipsed periodically. Success in unconventional fields, foreign lands, or healing professions.', hi: 'कैरियर अरेखीय मार्ग पर — अचानक उतार-चढ़ाव। सार्वजनिक प्रतिष्ठा समय-समय पर ग्रसित। अपरम्परागत क्षेत्रों में सफलता।' },
  { house: 11, en: 'Income fluctuates, elder siblings face challenges, social circle is unusual. Large network but few deep friendships. Gains through foreign or unconventional sources.', hi: 'आय में उतार-चढ़ाव, बड़े भाई-बहन चुनौतियों का सामना, सामाजिक वृत्त असामान्य। विदेशी या अपरम्परागत स्रोतों से लाभ।' },
  { house: 12, en: 'Paradoxically one of the better placements — spiritual depth, vivid dream life, foreign settlement. Expenses on spiritual pursuits. Strong meditation ability. Past-life awareness.', hi: 'विरोधाभासी रूप से बेहतर स्थिति — आध्यात्मिक गहराई, स्पष्ट स्वप्न, विदेश बसावट। आध्यात्मिक साधनाओं पर व्यय। ध्यान क्षमता।' },
];

// ─── Cancellation Factors ────────────────────────────────────────────────────
const CANCELLATION_FACTORS = [
  {
    title: { en: 'Strong Dispositor', hi: 'बलवान राशि स्वामी' },
    desc: {
      en: 'If the sign lord of the Sun/Moon is strong (in own sign, exalted, or in a kendra), the eclipse energy is channeled constructively rather than destructively. A strong dispositor acts as a protective shield.',
      hi: 'यदि सूर्य/चन्द्रमा का राशि स्वामी बलवान है (स्वराशि, उच्च, या केन्द्र में), तो ग्रहण ऊर्जा विनाशकारी के बजाय रचनात्मक रूप से प्रवाहित होती है।'
    },
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
  },
  {
    title: { en: 'Jupiter\'s Aspect', hi: 'बृहस्पति की दृष्टि' },
    desc: {
      en: 'Jupiter\'s 5th, 7th, or 9th aspect on the Grahan Yoga conjunction is the single most powerful cancellation factor. Jupiter brings wisdom, protection, and grace — transforming the eclipse from a curse into a catalyst for growth.',
      hi: 'ग्रहण योग युति पर बृहस्पति की 5वीं, 7वीं, या 9वीं दृष्टि सबसे शक्तिशाली भंग कारक है। बृहस्पति ज्ञान, सुरक्षा और कृपा लाता है।'
    },
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  {
    title: { en: 'Luminary in Own/Exalted Sign', hi: 'ज्योति स्वराशि/उच्च राशि में' },
    desc: {
      en: 'Sun in Leo or Aries, Moon in Cancer or Taurus — when the eclipsed luminary is inherently strong, it can withstand the nodal shadow. The eclipse manifests as intensity rather than affliction.',
      hi: 'सूर्य सिंह या मेष में, चन्द्रमा कर्क या वृषभ में — जब ग्रसित ज्योति स्वभावतः बलवान हो, तो वह पात की छाया सहन कर सकती है।'
    },
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
  },
  {
    title: { en: 'Benefic Conjunction', hi: 'शुभ ग्रह युति' },
    desc: {
      en: 'Venus or Mercury conjoining the eclipsed luminary can soften the harsh effects. Multiple benefics in the same sign as Grahan Yoga significantly reduce its negativity.',
      hi: 'शुक्र या बुध का ग्रसित ज्योति के साथ युति कठोर प्रभावों को मृदु कर सकता है।'
    },
    color: 'text-pink-400',
    borderColor: 'border-pink-500/20',
  },
  {
    title: { en: 'Eclipse-specific Remedies', hi: 'ग्रहण-विशिष्ट उपाय' },
    desc: {
      en: 'Chanting Surya/Chandra mantras, observing eclipse-day fasting (especially on actual eclipse dates), donating to the blind (for Sun) or mentally ill (for Moon), and performing Rahu/Ketu specific worship on Tuesdays and Saturdays.',
      hi: 'सूर्य/चन्द्र मन्त्र जाप, ग्रहण दिवस उपवास, अन्धों को दान (सूर्य हेतु) या मानसिक रोगियों को (चन्द्र हेतु), और मंगलवार/शनिवार राहु/केतु विशिष्ट पूजा।'
    },
    color: 'text-violet-400',
    borderColor: 'border-violet-500/20',
  },
];

// ─── Classical References ────────────────────────────────────────────────────
const CLASSICAL_REFS = [
  {
    text: { en: 'BPHS (Brihat Parashara Hora Shastra)', hi: 'बृहत् पाराशर होरा शास्त्र' },
    source: {
      en: 'Parashara explicitly discusses Sun-Rahu and Moon-Rahu conjunctions as indicators of health issues, father/mother troubles, and karmic debts from past lives. He prescribes specific remedial measures for each combination.',
      hi: 'पाराशर स्पष्ट रूप से सूर्य-राहु और चन्द्र-राहु युतियों को स्वास्थ्य समस्याओं, पिता/माता कष्ट और पूर्वजन्म कार्मिक ऋणों के सूचक के रूप में चर्चा करते हैं।'
    },
  },
  {
    text: { en: 'Jataka Parijata', hi: 'जातक पारिजात' },
    source: {
      en: 'Notes that a luminary conjoined with nodes gives results "as if born during an eclipse" — the native carries eclipse karma regardless of the actual tithi of birth. Discusses specific house-level results for each node-luminary combination.',
      hi: 'उल्लेख करता है कि पातों के साथ ज्योति युत होने पर "ग्रहण के समय जन्मे" सदृश फल मिलते हैं — जातक जन्म तिथि से निरपेक्ष ग्रहण कर्म वहन करता है।'
    },
  },
  {
    text: { en: 'Phaladeepika', hi: 'फलदीपिका' },
    source: {
      en: 'Mantreshwara describes nodal afflictions to luminaries as causing "persistent shadows" on the life areas governed by the house of conjunction. He notes that Jupiter\'s aspect is the primary remedy prescribed by the ancients.',
      hi: 'मन्त्रेश्वर ज्योतियों पर पातीय पीड़ा को युति भाव द्वारा शासित जीवन क्षेत्रों पर "स्थायी छाया" के रूप में वर्णन करते हैं। वे बृहस्पति की दृष्टि को प्राचीनों द्वारा निर्धारित प्राथमिक उपाय बताते हैं।'
    },
  },
  {
    text: { en: 'Sarvartha Chintamani', hi: 'सर्वार्थ चिन्तामणि' },
    source: {
      en: 'Provides specific timing rules: Grahan Yoga effects intensify during the dasha-bhukti of the involved node, and during actual eclipse seasons when transiting nodes activate the natal conjunction.',
      hi: 'विशिष्ट समय नियम देता है: ग्रहण योग प्रभाव सम्बन्धित पात की दशा-भुक्ति और वास्तविक ग्रहण ऋतुओं में तीव्र होते हैं।'
    },
  },
];

// ─── Severity Levels ─────────────────────────────────────────────────────────
const SEVERITY_LEVELS = [
  {
    level: { en: 'Severe', hi: 'गम्भीर' },
    pct: '80-100%',
    condition: { en: 'Exact conjunction (< 2°), malefic house (1/5/7/9), no Jupiter aspect, weak dispositor, no benefic relief', hi: 'सटीक युति (< 2°), अशुभ भाव (1/5/7/9), बृहस्पति दृष्टि नहीं, दुर्बल राशि स्वामी' },
    color: 'border-red-500/30',
    textColor: 'text-red-400',
  },
  {
    level: { en: 'Moderate', hi: 'मध्यम' },
    pct: '40-70%',
    condition: { en: 'Conjunction within 5-8°, mixed house, partial Jupiter aspect or some benefic support, dispositor in neutral dignity', hi: 'युति 5-8° के भीतर, मिश्रित भाव, आंशिक बृहस्पति दृष्टि या कुछ शुभ सहायता' },
    color: 'border-amber-500/20',
    textColor: 'text-amber-400',
  },
  {
    level: { en: 'Mild', hi: 'मृदु' },
    pct: '15-35%',
    condition: { en: 'Wide orb (8-12°), upachaya house (3/6/10/11), Jupiter aspect present, strong dispositor, benefic conjunction', hi: 'विस्तृत परिधि (8-12°), उपचय भाव (3/6/10/11), बृहस्पति दृष्टि, बलवान राशि स्वामी' },
    color: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
  },
  {
    level: { en: 'Cancelled / Transformed', hi: 'भंग / रूपान्तरित' },
    pct: '0-10%',
    condition: { en: 'Luminary in own/exalted sign, Jupiter conjunct or aspecting, strong dispositor in kendra, multiple benefics involved — yoga becomes a source of depth and spiritual power', hi: 'ज्योति स्वराशि/उच्च में, बृहस्पति युत या दृष्टि, बलवान राशि स्वामी केन्द्र में — योग गहराई और आध्यात्मिक शक्ति का स्रोत बनता है' },
    color: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
  },
];

// ─── Formation Diagram SVG ───────────────────────────────────────────────────
function FormationDiagram({ luminary, node, color }: { luminary: string; node: string; color: string }) {
  const isSun = luminary === 'Sun';
  const isRahu = node === 'Rahu';
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {/* Luminary */}
      <div className={`relative w-14 h-14 rounded-full border-2 ${isSun ? 'border-amber-400/60 bg-amber-500/10' : 'border-blue-400/60 bg-blue-500/10'} flex items-center justify-center`}>
        {isSun ? (
          <Sun className="w-7 h-7 text-amber-400" />
        ) : (
          <Moon className="w-7 h-7 text-blue-400" />
        )}
        <span className={`absolute -bottom-5 text-[10px] font-bold ${isSun ? 'text-amber-400' : 'text-blue-400'}`}>
          {isSun ? 'SU' : 'MO'}
        </span>
      </div>
      {/* Conjunction symbol */}
      <div className="flex flex-col items-center gap-0.5">
        <div className={`w-8 h-0.5 ${color === 'text-amber-400' || color === 'text-orange-400' ? 'bg-amber-500/40' : 'bg-blue-500/40'}`} />
        <span className="text-[9px] text-text-tertiary tracking-widest">CONJ</span>
        <div className={`w-8 h-0.5 ${color === 'text-amber-400' || color === 'text-orange-400' ? 'bg-amber-500/40' : 'bg-blue-500/40'}`} />
      </div>
      {/* Node */}
      <div className={`relative w-14 h-14 rounded-full border-2 ${isRahu ? 'border-slate-400/60 bg-slate-500/10' : 'border-violet-400/60 bg-violet-500/10'} flex items-center justify-center`}>
        <span className={`text-lg font-bold ${isRahu ? 'text-slate-300' : 'text-violet-400'}`}>
          {isRahu ? (
            // Rahu symbol: ascending node
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 18 C4 10, 12 6, 12 6 C12 6, 20 10, 20 18" />
              <circle cx="4" cy="18" r="2" fill="currentColor" />
              <circle cx="20" cy="18" r="2" fill="currentColor" />
            </svg>
          ) : (
            // Ketu symbol: descending node
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6 C4 14, 12 18, 12 18 C12 18, 20 14, 20 6" />
              <circle cx="4" cy="6" r="2" fill="currentColor" />
              <circle cx="20" cy="6" r="2" fill="currentColor" />
            </svg>
          )}
        </span>
        <span className={`absolute -bottom-5 text-[10px] font-bold ${isRahu ? 'text-slate-400' : 'text-violet-400'}`}>
          {isRahu ? 'RA' : 'KE'}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function LearnGrahanYogaPage() {
  const locale = useLocale();
  const t = (key: string) => lt(L[key], locale);
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedType, setExpandedType] = useState<number | null>(0);
  const [expandedHouse, setExpandedHouse] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* ═══ Hero ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-8 sm:p-10"
      >
        {/* Eclipse-themed decorative glow */}
        <div className="absolute top-4 right-4 w-28 h-28 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-slate-900/80 border border-amber-500/20 pointer-events-none" />
        <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />

        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light mb-2" style={headingFont}>{t('title')}</h1>
        <p className="text-gold-dark text-sm uppercase tracking-widest mb-4" style={headingFont}>{t('subtitle')}</p>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">{t('heroDesc')}</p>
      </motion.section>

      {/* ═══ Section 1: Introduction ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('introTitle')}</h2>
        <p className="text-text-secondary text-sm leading-relaxed">{t('introP1')}</p>
        <p className="text-text-secondary text-sm leading-relaxed">{t('introP2')}</p>
        <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-text-secondary text-sm leading-relaxed">{t('introP3')}</p>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 2: Four Types ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gold-light mb-1" style={headingFont}>{t('fourTypes')}</h2>
          <p className="text-text-tertiary text-xs mb-4">{lt({ en: 'Click each type to explore its effects', hi: 'प्रत्येक प्रकार पर क्लिक करें' }, locale)}</p>

          <div className="space-y-3">
            {GRAHAN_TYPES.map((type, i) => (
              <div key={type.id} className={`rounded-xl border ${type.borderColor} overflow-hidden`}>
                <button
                  onClick={() => setExpandedType(expandedType === i ? null : i)}
                  className={`w-full flex items-center justify-between p-4 ${type.bgColor} hover:brightness-110 transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${type.bgColor} border ${type.borderColor} flex items-center justify-center`}>
                      {type.luminary === 'Sun' ? (
                        <Sun className={`w-4 h-4 ${type.color}`} />
                      ) : (
                        <Moon className={`w-4 h-4 ${type.color}`} />
                      )}
                    </div>
                    <span className={`font-bold text-sm ${type.color}`}>{lt(type.name, locale)}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 ${type.color} transition-transform ${expandedType === i ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedType === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        {/* Formation Diagram */}
                        <FormationDiagram luminary={type.luminary} node={type.node} color={type.color} />

                        {/* Summary */}
                        <p className="text-text-secondary text-sm leading-relaxed">{lt(type.summary, locale)}</p>

                        {/* Effects list */}
                        <div className="space-y-2">
                          <div className={`text-xs font-bold uppercase tracking-wider ${type.color}`}>
                            {lt({ en: 'Key Effects', hi: 'प्रमुख प्रभाव' }, locale)}
                          </div>
                          {type.effects.map((effect, j) => (
                            <div key={j} className={`flex items-start gap-2 p-2.5 rounded-lg bg-bg-primary/50 border ${type.borderColor}`}>
                              <AlertTriangle className={`w-3.5 h-3.5 ${type.color} mt-0.5 shrink-0`} />
                              <span className="text-text-secondary text-xs leading-relaxed">{lt(effect, locale)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 3: Formation Rules ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('formationTitle')}</h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              {lt({ en: 'Orb of Conjunction', hi: 'युति परिधि' }, locale)}
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{t('formationOrb')}</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/20">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              {lt({ en: 'Same Sign vs. Different Sign', hi: 'समान राशि बनाम भिन्न राशि' }, locale)}
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{t('formationSameSign')}</p>
          </div>

          <div className="p-4 rounded-xl bg-violet-500/8 border border-violet-500/20">
            <div className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              {lt({ en: 'Critical Houses', hi: 'महत्वपूर्ण भाव' }, locale)}
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{t('formationHouses')}</p>
          </div>
        </div>

        {/* Combination Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-dark text-xs uppercase tracking-wider py-2 px-3">{lt({ en: 'Combination', hi: 'युति' }, locale)}</th>
                <th className="text-left text-gold-dark text-xs uppercase tracking-wider py-2 px-3">{lt({ en: 'Eclipse Type', hi: 'ग्रहण प्रकार' }, locale)}</th>
                <th className="text-left text-gold-dark text-xs uppercase tracking-wider py-2 px-3">{lt({ en: 'Primary Signification', hi: 'प्राथमिक कारकत्व' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { combo: { en: 'Sun + Rahu', hi: 'सूर्य + राहु' }, type: { en: 'Solar Eclipse (Amplified)', hi: 'सूर्य ग्रहण (प्रवर्धित)' }, sig: { en: 'Ego inflation, authority hunger, father karma', hi: 'अहंकार प्रसार, अधिकार की भूख, पिता कर्म' } },
                { combo: { en: 'Sun + Ketu', hi: 'सूर्य + केतु' }, type: { en: 'Solar Eclipse (Dissolved)', hi: 'सूर्य ग्रहण (विघटित)' }, sig: { en: 'Ego dissolution, spiritual calling, worldly detachment', hi: 'अहंकार विघटन, आध्यात्मिक आह्वान, सांसारिक विरक्ति' } },
                { combo: { en: 'Moon + Rahu', hi: 'चन्द्र + राहु' }, type: { en: 'Lunar Eclipse (Amplified)', hi: 'चन्द्र ग्रहण (प्रवर्धित)' }, sig: { en: 'Emotional obsession, anxiety, mother karma', hi: 'भावनात्मक जुनून, चिन्ता, माता कर्म' } },
                { combo: { en: 'Moon + Ketu', hi: 'चन्द्र + केतु' }, type: { en: 'Lunar Eclipse (Dissolved)', hi: 'चन्द्र ग्रहण (विघटित)' }, sig: { en: 'Emotional detachment, psychic gifts, past-life recall', hi: 'भावनात्मक विरक्ति, मानसिक क्षमताएँ, पूर्वजन्म स्मरण' } },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gold-primary/6">
                  <td className="py-2.5 px-3 text-text-primary font-medium">{lt(row.combo, locale)}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{lt(row.type, locale)}</td>
                  <td className="py-2.5 px-3 text-text-tertiary text-xs">{lt(row.sig, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ═══ Section 4: House-wise Effects ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('houseTitle')}</h2>
        <p className="text-text-secondary text-sm">{t('houseDesc')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {HOUSE_EFFECTS.map((h) => (
            <div key={h.house} className="rounded-xl overflow-hidden border border-gold-primary/8">
              <button
                onClick={() => setExpandedHouse(expandedHouse === h.house ? null : h.house)}
                className="w-full flex items-center justify-between p-3 bg-bg-primary/30 hover:bg-bg-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-light text-xs font-bold">
                    {h.house}
                  </span>
                  <span className="text-text-primary text-sm font-medium">
                    {lt({ en: `House ${h.house}`, hi: `भाव ${h.house}` }, locale)}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-text-tertiary transition-transform ${expandedHouse === h.house ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedHouse === h.house && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3">
                      <p className="text-text-secondary text-xs leading-relaxed">{lt({ en: h.en, hi: h.hi }, locale)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Section 5: Cancellation & Mitigation ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('cancellationTitle')}</h2>
        <p className="text-text-secondary text-sm">{t('cancellationDesc')}</p>

        <div className="space-y-3">
          {CANCELLATION_FACTORS.map((factor, i) => (
            <div key={i} className={`p-4 rounded-xl border ${factor.borderColor}`}>
              <div className={`flex items-center gap-2 mb-2`}>
                <Shield className={`w-4 h-4 ${factor.color}`} />
                <span className={`text-sm font-bold ${factor.color}`}>{lt(factor.title, locale)}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{lt(factor.desc, locale)}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Section 6: Classical References ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-gold-primary" />
          <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('classicalTitle')}</h2>
        </div>

        <div className="space-y-3">
          {CLASSICAL_REFS.map((ref, i) => (
            <div key={i} className="p-4 rounded-xl border border-gold-primary/10">
              <div className="text-gold-dark text-xs font-bold uppercase tracking-wider mb-1.5">{lt(ref.text, locale)}</div>
              <p className="text-text-secondary text-sm leading-relaxed">{lt(ref.source, locale)}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Section 7: Modern Perspective ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-violet-400" />
          <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('modernTitle')}</h2>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed">{t('modernP1')}</p>
        <p className="text-text-secondary text-sm leading-relaxed">{t('modernP2')}</p>

        <div className="p-4 rounded-xl bg-violet-500/8 border border-violet-500/20">
          <div className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            {lt({ en: 'Shadow Work & Transformation', hi: 'छाया कार्य और रूपान्तरण' }, locale)}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{t('modernP3')}</p>
        </div>
      </motion.section>

      {/* ═══ Section 8: Severity Assessment ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('severityTitle')}</h2>
        <div className="space-y-3">
          {SEVERITY_LEVELS.map((sev, i) => (
            <div key={i} className={`p-4 rounded-xl border ${sev.color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold text-sm ${sev.textColor}`}>{lt(sev.level, locale)}</span>
                <span className="font-mono text-xs opacity-70">{sev.pct}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{lt(sev.condition, locale)}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Links ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center space-y-4"
      >
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>{t('linksTitle')}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएं' } },
            { href: '/learn/doshas-detailed', label: { en: 'All Doshas Guide', hi: 'सभी दोष मार्गदर्शिका' } },
            { href: '/learn/eclipses', label: { en: 'Eclipses (Grahan)', hi: 'ग्रहण' } },
            { href: '/learn/remedies', label: { en: 'Remedies Guide', hi: 'उपाय मार्गदर्शिका' } },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
            >
              {lt(link.label, locale)} &rarr;
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
