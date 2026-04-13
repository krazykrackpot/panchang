'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_0_5', phase: 0, topic: 'Foundations', moduleNumber: '0.5',
  title: { en: 'What is a Kundali (Birth Chart)?', hi: 'कुण्डली (जन्म कुण्डली) क्या है?', sa: 'कुण्डली (जन्म कुण्डली) क्या है?', mai: 'कुण्डली (जन्म कुण्डली) क्या है?', mr: 'कुण्डली (जन्म कुण्डली) क्या है?', ta: 'What is a Kundali (Birth Chart)?', te: 'What is a Kundali (Birth Chart)?', bn: 'What is a Kundali (Birth Chart)?', kn: 'What is a Kundali (Birth Chart)?', gu: 'What is a Kundali (Birth Chart)?' },
  subtitle: {
    en: 'A snapshot of the sky at your exact birth moment — houses, planets, and how to read them',
    hi: 'आपके जन्म क्षण का आकाशीय चित्र — भाव, ग्रह, और उन्हें कैसे पढ़ें',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 0-6: Rituals & Astronomy', hi: 'मॉड्यूल 0-6: कर्मकाण्ड और खगोलशास्त्र', sa: 'मॉड्यूल 0-6: कर्मकाण्ड और खगोलशास्त्र', mai: 'मॉड्यूल 0-6: कर्मकाण्ड और खगोलशास्त्र', mr: 'मॉड्यूल 0-6: कर्मकाण्ड और खगोलशास्त्र', ta: 'Module 0-6: Rituals & Astronomy', te: 'Module 0-6: Rituals & Astronomy', bn: 'Module 0-6: Rituals & Astronomy', kn: 'Module 0-6: Rituals & Astronomy', gu: 'Module 0-6: Rituals & Astronomy' }, href: '/learn/modules/0-6' },
    { label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ', sa: 'अपनी कुण्डली बनाएँ', mai: 'अपनी कुण्डली बनाएँ', mr: 'अपनी कुण्डली बनाएँ', ta: 'Generate Your Kundali', te: 'Generate Your Kundali', bn: 'Generate Your Kundali', kn: 'Generate Your Kundali', gu: 'Generate Your Kundali' }, href: '/kundali' },
    { label: { en: 'Module 9-1: Houses Deep Dive', hi: 'मॉड्यूल 9-1: भाव विस्तार', sa: 'मॉड्यूल 9-1: भाव विस्तार', mai: 'मॉड्यूल 9-1: भाव विस्तार', mr: 'मॉड्यूल 9-1: भाव विस्तार', ta: 'Module 9-1: Houses Deep Dive', te: 'Module 9-1: Houses Deep Dive', bn: 'Module 9-1: Houses Deep Dive', kn: 'Module 9-1: Houses Deep Dive', gu: 'Module 9-1: Houses Deep Dive' }, href: '/learn/modules/9-1' },
    { label: { en: 'Module 11-1: Dasha System', hi: 'मॉड्यूल 11-1: दशा पद्धति', sa: 'मॉड्यूल 11-1: दशा पद्धति', mai: 'मॉड्यूल 11-1: दशा पद्धति', mr: 'मॉड्यूल 11-1: दशा पद्धति', ta: 'Module 11-1: Dasha System', te: 'Module 11-1: Dasha System', bn: 'Module 11-1: Dasha System', kn: 'Module 11-1: Dasha System', gu: 'Module 11-1: Dasha System' }, href: '/learn/modules/11-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q0_5_01', type: 'mcq',
    question: {
      en: 'What is the Lagna (Ascendant) in a Kundali?',
      hi: 'कुण्डली में लग्न (उदय राशि) क्या है?',
    },
    options: [
      { en: 'The Sun\'s position at birth', hi: 'जन्म के समय सूर्य की स्थिति' },
      { en: 'The sign rising on the eastern horizon at birth', hi: 'जन्म के समय पूर्वी क्षितिज पर उदय होती राशि', sa: 'जन्म के समय पूर्वी क्षितिज पर उदय होती राशि', mai: 'जन्म के समय पूर्वी क्षितिज पर उदय होती राशि', mr: 'जन्म के समय पूर्वी क्षितिज पर उदय होती राशि', ta: 'The sign rising on the eastern horizon at birth', te: 'The sign rising on the eastern horizon at birth', bn: 'The sign rising on the eastern horizon at birth', kn: 'The sign rising on the eastern horizon at birth', gu: 'The sign rising on the eastern horizon at birth' },
      { en: 'The Moon\'s nakshatra at birth', hi: 'जन्म के समय चन्द्रमा का नक्षत्र' },
      { en: 'The strongest planet in the chart', hi: 'कुण्डली में सबसे बलवान ग्रह', sa: 'कुण्डली में सबसे बलवान ग्रह', mai: 'कुण्डली में सबसे बलवान ग्रह', mr: 'कुण्डली में सबसे बलवान ग्रह', ta: 'The strongest planet in the chart', te: 'The strongest planet in the chart', bn: 'The strongest planet in the chart', kn: 'The strongest planet in the chart', gu: 'The strongest planet in the chart' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Lagna (Ascendant) is the zodiac sign rising on the eastern horizon at the exact moment of birth. It changes approximately every 2 hours, which is why precise birth time matters.',
      hi: 'लग्न (उदय राशि) जन्म के ठीक क्षण पर पूर्वी क्षितिज पर उदय हो रही राशि है। यह लगभग हर 2 घण्टे बदलती है, इसीलिए सटीक जन्म समय महत्त्वपूर्ण है।',
    },
  },
  {
    id: 'q0_5_02', type: 'mcq',
    question: {
      en: 'How many houses (bhavas) are in a Kundali?',
      hi: 'कुण्डली में कितने भाव होते हैं?',
    },
    options: [
      { en: '9', hi: '9', sa: '9', mai: '9', mr: '9', ta: '9', te: '9', bn: '9', kn: '9', gu: '9' },
      { en: '10', hi: '10', sa: '10', mai: '10', mr: '10', ta: '10', te: '10', bn: '10', kn: '10', gu: '10' },
      { en: '12', hi: '12', sa: '12', mai: '12', mr: '12', ta: '12', te: '12', bn: '12', kn: '12', gu: '12' },
      { en: '27', hi: '27', sa: '27', mai: '27', mr: '27', ta: '27', te: '27', bn: '27', kn: '27', gu: '27' },
    ],
    correctAnswer: 2,
    explanation: {
      en: '12 houses, each governing an area of life: self, wealth, siblings, mother/home, children, enemies/disease, marriage, longevity, luck/dharma, career, gains, and loss/spirituality.',
      hi: '12 भाव, प्रत्येक जीवन के एक क्षेत्र का शासक: स्व, धन, भ्रातृ, मातृ/गृह, सन्तान, शत्रु/रोग, विवाह, आयु, भाग्य/धर्म, कर्म, लाभ, और व्यय/मोक्ष।',
    },
  },
  {
    id: 'q0_5_03', type: 'true_false',
    question: {
      en: 'The Lagna (Ascendant) changes approximately every 2 hours, which is why astrologers insist on accurate birth time.',
      hi: 'लग्न (उदय राशि) लगभग हर 2 घण्टे बदलता है, इसीलिए ज्योतिषी सटीक जन्म समय पर बल देते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Aryabhata calculated the ascendant moves at ~1° every 4 minutes. A 10-minute birth time error can shift the lagna by 2.5° — potentially changing the entire chart interpretation.',
      hi: 'सत्य। आर्यभट ने गणना की कि लग्न ~1° प्रत्येक 4 मिनट में चलता है। 10 मिनट की जन्म समय त्रुटि लग्न को 2.5° तक खिसका सकती है — जिससे सम्पूर्ण कुण्डली व्याख्या बदल सकती है।',
    },
  },
  {
    id: 'q0_5_04', type: 'mcq',
    question: {
      en: 'In the North Indian chart style, what is always at the top?',
      hi: 'उत्तर भारतीय कुण्डली शैली में सबसे ऊपर सदैव क्या होता है?',
    },
    options: [
      { en: 'Aries (Mesha)', hi: 'मेष राशि', sa: 'मेष राशि', mai: 'मेष राशि', mr: 'मेष राशि', ta: 'Aries (Mesha)', te: 'Aries (Mesha)', bn: 'Aries (Mesha)', kn: 'Aries (Mesha)', gu: 'Aries (Mesha)' },
      { en: 'The Lagna (Ascendant)', hi: 'लग्न (उदय राशि)', sa: 'लग्न (उदय राशि)', mai: 'लग्न (उदय राशि)', mr: 'लग्न (उदय राशि)', ta: 'The Lagna (Ascendant)', te: 'The Lagna (Ascendant)', bn: 'The Lagna (Ascendant)', kn: 'The Lagna (Ascendant)', gu: 'The Lagna (Ascendant)' },
      { en: 'The Moon', hi: 'चन्द्रमा', sa: 'चन्द्रमा', mai: 'चन्द्रमा', mr: 'चन्द्रमा', ta: 'The Moon', te: 'The Moon', bn: 'The Moon', kn: 'The Moon', gu: 'The Moon' },
      { en: 'The Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'The Sun', te: 'The Sun', bn: 'The Sun', kn: 'The Sun', gu: 'The Sun' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'In the North Indian diamond chart, the house positions are FIXED and the Lagna is always at the top. Signs rotate around the fixed house positions. In the South Indian style, it\'s the opposite — signs are fixed and houses rotate.',
      hi: 'उत्तर भारतीय हीरे की कुण्डली में, भाव स्थान स्थिर हैं और लग्न सदैव ऊपर है। राशियाँ स्थिर भाव स्थानों के चारों ओर घूमती हैं। दक्षिण भारतीय शैली में उलटा है — राशियाँ स्थिर हैं और भाव घूमते हैं।',
    },
  },
  {
    id: 'q0_5_05', type: 'mcq',
    question: {
      en: 'Your Moon sign (Rashi) represents your:',
      hi: 'आपकी चन्द्र राशि आपके किस पक्ष का प्रतिनिधित्व करती है?',
    },
    options: [
      { en: 'Career path', hi: 'व्यावसायिक मार्ग', sa: 'व्यावसायिक मार्ग', mai: 'व्यावसायिक मार्ग', mr: 'व्यावसायिक मार्ग', ta: 'Career path', te: 'Career path', bn: 'Career path', kn: 'Career path', gu: 'Career path' },
      { en: 'Physical appearance', hi: 'शारीरिक रूप', sa: 'शारीरिक रूप', mai: 'शारीरिक रूप', mr: 'शारीरिक रूप', ta: 'Physical appearance', te: 'Physical appearance', bn: 'Physical appearance', kn: 'Physical appearance', gu: 'Physical appearance' },
      { en: 'Emotional core and mind', hi: 'भावनात्मक मूल और मन', sa: 'भावनात्मक मूल और मन', mai: 'भावनात्मक मूल और मन', mr: 'भावनात्मक मूल और मन', ta: 'Emotional core and mind', te: 'Emotional core and mind', bn: 'Emotional core and mind', kn: 'Emotional core and mind', gu: 'Emotional core and mind' },
      { en: 'Financial prospects', hi: 'आर्थिक सम्भावनाएँ', sa: 'आर्थिक सम्भावनाएँ', mai: 'आर्थिक सम्भावनाएँ', mr: 'आर्थिक सम्भावनाएँ', ta: 'Financial prospects', te: 'Financial prospects', bn: 'Financial prospects', kn: 'Financial prospects', gu: 'Financial prospects' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Moon sign (Rashi) represents your emotional nature, mental disposition, and instinctive reactions. In Vedic astrology, the Moon sign is often considered MORE important than the Sun sign for personality analysis.',
      hi: 'चन्द्र राशि आपकी भावनात्मक प्रकृति, मानसिक स्वभाव और सहज प्रतिक्रियाओं का प्रतिनिधित्व करती है। वैदिक ज्योतिष में, व्यक्तित्व विश्लेषण के लिए चन्द्र राशि को प्रायः सूर्य राशि से अधिक महत्त्वपूर्ण माना जाता है।',
    },
  },
  {
    id: 'q0_5_06', type: 'true_false',
    question: {
      en: 'The North Indian and South Indian chart styles display different astrological data.',
      hi: 'उत्तर भारतीय और दक्षिण भारतीय कुण्डली शैलियाँ भिन्न ज्योतिषीय डेटा प्रदर्शित करती हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Both styles display the SAME data — same planets, same houses, same signs. They are just different visual conventions, like metric vs imperial. Once you learn one, the other is just a rotation.',
      hi: 'असत्य। दोनों शैलियाँ एक ही डेटा प्रदर्शित करती हैं — वही ग्रह, वही भाव, वही राशियाँ। ये केवल भिन्न दृश्य परम्पराएँ हैं, जैसे मीट्रिक बनाम इम्पीरियल। एक सीखने पर दूसरी केवल घुमाव है।',
    },
  },
  {
    id: 'q0_5_07', type: 'mcq',
    question: {
      en: 'How many planets (grahas) does Vedic astrology use?',
      hi: 'वैदिक ज्योतिष कितने ग्रहों का उपयोग करता है?',
    },
    options: [
      { en: '7', hi: '7', sa: '7', mai: '7', mr: '7', ta: '7', te: '7', bn: '7', kn: '7', gu: '7' },
      { en: '8', hi: '8', sa: '8', mai: '8', mr: '8', ta: '8', te: '8', bn: '8', kn: '8', gu: '8' },
      { en: '9', hi: '9', sa: '9', mai: '9', mr: '9', ta: '9', te: '9', bn: '9', kn: '9', gu: '9' },
      { en: '12', hi: '12', sa: '12', mai: '12', mr: '12', ta: '12', te: '12', bn: '12', kn: '12', gu: '12' },
    ],
    correctAnswer: 2,
    explanation: {
      en: '9 grahas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn (7 visible), plus Rahu and Ketu (the Moon\'s north and south nodes — mathematical points where eclipses occur).',
      hi: '9 ग्रह: सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि (7 दृश्य), और राहु तथा केतु (चन्द्रमा के उत्तर और दक्षिण पात — गणितीय बिन्दु जहाँ ग्रहण होते हैं)।',
    },
  },
  {
    id: 'q0_5_08', type: 'mcq',
    question: {
      en: 'Parashara\'s Brihat Hora Shastra describes approximately how many yogas (planetary combinations)?',
      hi: 'पराशर की बृहत्होरा शास्त्र में लगभग कितने योग (ग्रह संयोग) वर्णित हैं?',
    },
    options: [
      { en: 'About 30', hi: 'लगभग 30', sa: 'लगभग 30', mai: 'लगभग 30', mr: 'लगभग 30', ta: 'About 30', te: 'About 30', bn: 'About 30', kn: 'About 30', gu: 'About 30' },
      { en: 'About 100', hi: 'लगभग 100', sa: 'लगभग 100', mai: 'लगभग 100', mr: 'लगभग 100', ta: 'About 100', te: 'About 100', bn: 'About 100', kn: 'About 100', gu: 'About 100' },
      { en: 'About 300+', hi: 'लगभग 300+', sa: 'लगभग 300+', mai: 'लगभग 300+', mr: 'लगभग 300+', ta: 'About 300+', te: 'About 300+', bn: 'About 300+', kn: 'About 300+', gu: 'About 300+' },
      { en: 'About 1000', hi: 'लगभग 1000', sa: 'लगभग 1000', mai: 'लगभग 1000', mr: 'लगभग 1000', ta: 'About 1000', te: 'About 1000', bn: 'About 1000', kn: 'About 1000', gu: 'About 1000' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Brihat Hora Shastra describes 300+ yogas across its 97 chapters — wealth yogas (Dhana), spiritual yogas (Raja), inauspicious yogas (Daridra), and more. It is the most comprehensive astrological text ever written in any civilization.',
      hi: 'बृहत्होरा शास्त्र अपने 97 अध्यायों में 300+ योगों का वर्णन करता है — धन योग, राजयोग, दारिद्र्य योग, आदि। यह किसी भी सभ्यता में लिखा गया सबसे व्यापक ज्योतिष ग्रन्थ है।',
    },
  },
  {
    id: 'q0_5_09', type: 'true_false',
    question: {
      en: 'A Kundali is deterministic — it fixes your destiny with no room for free will.',
      hi: 'कुण्डली नियतिवादी है — यह आपके भाग्य को निश्चित करती है, स्वतन्त्र इच्छा के लिए कोई स्थान नहीं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. A Kundali is like a weather forecast — it shows tendencies and seasons, but you choose what to do. Dashas show WHEN themes activate. It\'s about preparation, not fatalism.',
      hi: 'असत्य। कुण्डली मौसम पूर्वानुमान के समान है — यह प्रवृत्तियाँ और ऋतुएँ दिखाती है, पर आप स्वयं चुनते हैं क्या करना है। दशाएँ बताती हैं कब विषय सक्रिय होते हैं। यह तैयारी है, नियतिवाद नहीं।',
    },
  },
  {
    id: 'q0_5_10', type: 'mcq',
    question: {
      en: 'The Indian equal-house system (each house = 30°) has been in continuous use for approximately:',
      hi: 'भारतीय समभाव पद्धति (प्रत्येक भाव = 30°) लगभग कितने वर्षों से निरन्तर प्रयोग में है?',
    },
    options: [
      { en: '500 years', hi: '500 वर्ष', sa: '500 वर्ष', mai: '500 वर्ष', mr: '500 वर्ष', ta: '500 years', te: '500 years', bn: '500 years', kn: '500 years', gu: '500 years' },
      { en: '1000 years', hi: '1000 वर्ष', sa: '1000 वर्ष', mai: '1000 वर्ष', mr: '1000 वर्ष', ta: '1000 years', te: '1000 years', bn: '1000 years', kn: '1000 years', gu: '1000 years' },
      { en: '2000+ years', hi: '2000+ वर्ष', sa: '2000+ वर्ष', mai: '2000+ वर्ष', mr: '2000+ वर्ष', ta: '2000+ years', te: '2000+ years', bn: '2000+ years', kn: '2000+ years', gu: '2000+ years' },
      { en: '200 years', hi: '200 वर्ष', sa: '200 वर्ष', mai: '200 वर्ष', mr: '200 वर्ष', ta: '200 years', te: '200 years', bn: '200 years', kn: '200 years', gu: '200 years' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Indian equal-house system has been used continuously for 2000+ years. The West adopted unequal house systems (Placidus, Koch) only in the 17th century. KP astrology bridges both traditions by using Placidus houses with Vedic nakshatras.',
      hi: 'भारतीय समभाव पद्धति 2000+ वर्षों से निरन्तर प्रयोग में है। पश्चिम ने असमान भाव पद्धतियाँ (प्लासिडस, कोख) केवल 17वीं शताब्दी में अपनाईं। KP ज्योतिष वैदिक नक्षत्रों के साथ प्लासिडस भावों का उपयोग करके दोनों परम्पराओं को जोड़ता है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 mb-2">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'आपका Spotify Wrapped आपके सुनने के डेटा से साल का सारांश देता है। आपका Instagram प्रोफ़ाइल आपका क्यूरेटेड स्व कैप्चर करता है। लेकिन कल्पना करें ऐसी पद्धति जो आपकी पहली साँस के ठीक सेकण्ड पर ब्रह्माण्ड की सम्पूर्ण स्थिति कैप्चर करे — हर ग्रह की स्थिति, हर भाव का संरेखण, हर कोणीय सम्बन्ध — एक ही चित्र में जमा हुआ। यही आपकी कुण्डली है। यह किसी भी ज्योतिषीय परम्परा में सर्वाधिक सूचना-सघन व्यक्तिगत दस्तावेज़ है।'
            : 'Your Spotify Wrapped summarizes your year based on listening data. Your Instagram profile captures your curated self. But imagine a system that captures the ENTIRE state of the cosmos at the exact second you took your first breath \u2014 every planet\'s position, every house alignment, every angular relationship \u2014 frozen in a single diagram. That\'s your Kundali. It\'s the most information-dense personal document in any astrological tradition.'}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'आकाश का एक चित्र, आपके जन्म के ठीक क्षण का' : 'A Snapshot of the Sky, at Your Exact Birth Moment'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'कल्पना करें कि आपके जन्म के ठीक सेकण्ड पर पूरा आकाश जम जाए। कौन-सी राशि पूर्वी क्षितिज पर उदय हो रही थी? ग्रह कहाँ थे? यही आपकी कुण्डली है — आपके जीवन के प्रथम क्षण का खगोलीय मानचित्र।'
            : 'Imagine freezing the entire sky at the second you were born. Which sign was rising on the eastern horizon? Where were the planets? That\'s your Kundali \u2014 an astronomical map of the first moment of your life.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'लग्न (उदय राशि)' : 'The Lagna (Ascendant)'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'लग्न = जन्म के समय पूर्वी क्षितिज पर उदय हो रही राशि। यह लगभग हर ~2 घण्टे बदलती है — इसीलिए जन्म समय महत्त्वपूर्ण है, केवल तिथि नहीं। लग्न आपका "व्यक्तित्व लेंस" है — आप संसार को कैसे देखते हैं और संसार आपको कैसे देखता है।'
            : 'The Lagna = which sign was rising on the eastern horizon at birth. It changes every ~2 hours \u2014 this is why birth TIME matters, not just date. The Lagna is your "personality lens" \u2014 how you see the world and how the world sees you.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '12 भाव — आकाश के 12 टुकड़े' : '12 Houses — 12 Slices of Sky'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्रत्येक भाव जीवन का एक क्षेत्र शासित करता है: 1. स्व (व्यक्तित्व), 2. धन, 3. भ्रातृ, 4. मातृ/गृह, 5. सन्तान/विद्या, 6. शत्रु/रोग, 7. विवाह/साझेदारी, 8. आयु/रहस्य, 9. भाग्य/धर्म, 10. कर्म/व्यवसाय, 11. लाभ, 12. व्यय/मोक्ष। 9 ग्रह इन भावों में रखे जाते हैं = आपके जीवन को आकार देने वाली शक्तियाँ।'
            : 'Each house governs an area of life: 1. Self (personality), 2. Wealth, 3. Siblings, 4. Mother/Home, 5. Children/Education, 6. Enemies/Disease, 7. Marriage/Partnership, 8. Longevity/Secrets, 9. Luck/Dharma, 10. Career, 11. Gains, 12. Loss/Spirituality. 9 planets placed in these houses = the forces shaping your life.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-400/20 bg-gradient-to-br from-purple-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'यही कारण है कि जन्म समय इतना महत्त्वपूर्ण है: लग्न (उदय राशि) लगभग हर 2 घण्टे बदलता है। इसका मतलब 3 घण्टे के अन्तर से जन्मे जुड़वाँ बच्चों की कुण्डली बिल्कुल अलग हो सकती है — भिन्न लग्न, भिन्न भाव स्वामी, भिन्न जीवन कहानी। आर्यभट ने इस दर (1° हर 4 मिनट) की गणना 499 ई. में की, और आधुनिक खगोलीय गणना दशमलव तक इसकी पुष्टि करती है। इसीलिए वैदिक ज्योतिषी उन ग्राहकों को मना कर देते हैं जिन्हें जन्म समय नहीं पता — बिना इसके कुण्डली अविश्वसनीय है।'
            : 'Here\'s why birth TIME is so critical: the Lagna (ascendant sign) changes approximately every 2 hours. That means twins born 3 hours apart can have COMPLETELY different charts \u2014 different lagna, different house rulers, different life story. Aryabhata calculated this rate (1\u00B0 every 4 minutes) in 499 CE, and modern astronomical computation confirms it to decimal precision. This is why Vedic astrologers will turn away clients who don\'t know their birth time \u2014 without it, the chart is unreliable.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'रोचक तथ्य' : 'Key Historical Fact'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'आर्यभट ने गणना की कि लग्न लगभग 1° प्रत्येक 4 मिनट में चलता है — जो आधुनिक खगोलीय गणना से बिल्कुल मेल खाता है। 10 मिनट की जन्म समय त्रुटि लग्न को 2.5° खिसका सकती है — जो सम्भवतः पूरी कुण्डली बदल दे। इसीलिए वैदिक ज्योतिषी मिनट तक जन्म समय की सटीकता पर बल देते हैं।'
            : 'Aryabhata calculated that the Lagna moves at approximately 1\u00B0 every 4 minutes \u2014 which matches modern astronomical computation exactly. A 10-minute birth time error can shift the lagna by 2.5\u00B0 \u2014 potentially changing the entire chart. This is why Vedic astrologers insist on birth time accuracy to the minute.'}
        </p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'कुण्डली शैलियाँ और पहले क्या देखें' : 'Chart Styles & What to Look for First'}
        </h3>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'उत्तर भारतीय बनाम दक्षिण भारतीय कुण्डली' : 'North Indian vs South Indian Chart'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'उत्तर भारतीय (हीरा): भाव स्थिर हैं, राशियाँ घूमती हैं। लग्न सदैव ऊपर है। दक्षिण भारतीय (ग्रिड): राशियाँ स्थिर हैं, भाव घूमते हैं। मेष सदैव ऊपर-बाएँ है। एक ही डेटा, भिन्न दृश्य परम्पराएँ — जैसे मीट्रिक बनाम इम्पीरियल। एक सीखने पर दूसरी केवल घुमाव है।'
            : 'North Indian (diamond): houses are FIXED positions, signs rotate. Lagna is always at the top. South Indian (grid): signs are FIXED positions, houses rotate. Aries is always top-left. SAME DATA, different visual conventions \u2014 like metric vs imperial. Once you learn one, the other is just a rotation.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'अपनी कुण्डली में पहले क्या देखें' : 'What to Look for First in YOUR Chart'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '1. आपकी लग्न राशि — आपका व्यक्तित्व लेंस। यह वह "चश्मा" है जिससे आप संसार देखते हैं।'
              : '1. Your Lagna sign \u2014 your personality lens. This is the "glasses" through which you see the world.'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '2. चन्द्र राशि — आपका भावनात्मक मूल (यही आपकी "राशि" है जो भारत में पूछी जाती है)।'
              : '2. Moon sign \u2014 your emotional core (this is your "rashi" that people ask about in India).'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '3. सबसे बलवान ग्रह (षड्बल द्वारा) — आपके जीवन में प्रमुख शक्ति।'
              : '3. Strongest planet (by Shadbala) \u2014 the dominant force in your life.'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '4. प्रथम भाव में कोई ग्रह — वे सीधे आपके व्यक्तित्व पर छाप छोड़ते हैं।'
              : '4. Any planets in the 1st house \u2014 they directly stamp your personality.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'दृश्य जटिलता से घबराएँ नहीं। कुण्डली बस एक नक्शा है। उत्तर भारतीय शैली = सड़क के नक्शे जैसा जहाँ स्थान (भाव) स्थिर हैं और आप शुरुआती बिन्दु घुमाते हैं। दक्षिण भारतीय शैली = GPS जैसा जहाँ ग्रिड स्थिर है और आप उस पर अपना स्थान रखते हैं। एक ही क्षेत्र, भिन्न नेविगेशन शैली। एक चुनें और उसी से शुरू करें — दूसरी बाद में सीख सकते हैं।'
            : 'Don\'t let the visual complexity intimidate you. A Kundali chart is just a MAP. North Indian style = like a road map where landmarks (houses) are fixed and you rotate the starting point. South Indian style = like a GPS where the grid is fixed and you place yourself on it. Same territory, different navigation style. Pick one and stick with it \u2014 you can always learn the other later.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'रोचक तथ्य' : 'Key Historical Fact'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'भारतीय समभाव पद्धति (प्रत्येक भाव = 30°) 2000+ वर्षों से निरन्तर प्रयोग में है। पश्चिम ने असमान भाव पद्धतियाँ (प्लासिडस, कोख) केवल 17वीं शताब्दी में अपनाईं। KP ज्योतिष प्लासिडस भावों का उपयोग करता है — दोनों परम्पराओं का संगम।'
            : 'The Indian equal-house system (each house = 30\u00B0) has been used continuously for 2000+ years. The West adopted unequal house systems (Placidus, Koch) only in the 17th century. KP astrology uses Placidus houses \u2014 combining both traditions.'}
        </p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अपनी कुण्डली बनाएँ — व्यावहारिक मार्गदर्शिका' : 'Generate YOUR Kundali — Practical Guide'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'हमारे ऐप पर कुण्डली पृष्ठ पर जाएँ। अपना जन्म विवरण भरें (तिथि, समय, स्थान)। ऐप सब कुछ गणित करता है: ग्रह स्थितियाँ, भाव, दशाएँ, योग। कोई बाहरी API नहीं — शुद्ध गणित।'
            : 'Head to the Kundali page on our app. Enter your birth details (date, time, place). The app computes everything: planetary positions, houses, dashas, yogas. No external APIs \u2014 pure mathematics.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'टैब क्या दिखाते हैं' : 'What the Tabs Show'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• चार्ट — दृश्य कुण्डली (उत्तर भारतीय हीरा शैली)। राशियाँ और ग्रह भावों में रखे दिखते हैं।'
              : '• Chart \u2014 the visual Kundali (North Indian diamond style). Signs and planets placed in houses.'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• ग्रह — प्रत्येक ग्रह की सटीक स्थिति (राशि, अंश, नक्षत्र, भाव)।'
              : '• Planets \u2014 exact position of each planet (sign, degree, nakshatra, house).'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• दशाएँ — जीवन काल चक्र (महादशा → अन्तर्दशा → प्रत्यन्तर दशा)। दर्शाती हैं कि जीवन में कब कौन-से विषय सक्रिय होंगे।'
              : '• Dashas \u2014 life timing cycles (Mahadasha \u2192 Antardasha \u2192 Pratyantardasha). Shows WHEN themes activate in life.'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• योग — ग्रह संयोग जो विशेष फल देते हैं (राजयोग, धनयोग, आदि)।'
              : '• Yogas \u2014 planetary combinations that produce special results (Raja Yoga, Dhana Yoga, etc.).'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• बल — षड्बल (छह प्रकार के बल) दिखाता है कि कौन-सा ग्रह सबसे प्रभावशाली है।'
              : '• Strength \u2014 Shadbala (six types of strength) showing which planet is most influential.'}
          </p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          {isHi
            ? 'सब कुछ एक साथ समझने की कोशिश न करें — लग्न + चन्द्र + सबसे बलवान ग्रह से शुरू करें।'
            : 'Don\'t try to interpret everything at once \u2014 start with lagna + Moon + strongest planet.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '3-मिनट की शुरुआती रीडिंग' : 'The Beginner\'s 3-Minute Reading'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'जब आप हमारे ऐप पर पहली बार अपनी कुण्डली बनाएँ, तो सब कुछ एक साथ पढ़ने की कोशिश न करें। यहाँ शुरुआती 3-मिनट रीडिंग है: (1) मेरा लग्न क्या है? यह आपकी "उदय राशि" है — संसार आपको कैसे देखता है। (2) मेरा चन्द्रमा कहाँ है? यह आपका भावनात्मक मूल है और आपकी "वैदिक राशि।" (3) दशा टैब देखें — आप वर्तमान में किस महादशा में हैं? उस ग्रह के विषय आपके जीवन का प्रमुख संगीत हैं अभी। ये तीन चीज़ें अकेले आपको अधिकांश व्यक्तित्व परीक्षणों से अधिक आत्म-ज्ञान देती हैं।'
            : 'When you generate your first Kundali on our app, resist the urge to read everything at once. Here\'s the beginner\'s 3-minute reading: (1) What\'s my lagna? This is your "rising sign" \u2014 how the world sees you. (2) Where\'s my Moon? This is your emotional core and your "Vedic sign." (3) Look at the Dashas tab \u2014 what Mahadasha are you currently in? That planet\'s themes are the dominant soundtrack of your life right now. These three things alone give you more self-insight than most personality tests.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-400/20 bg-gradient-to-br from-red-900/10 to-transparent">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'भ्रान्ति निवारण' : 'Common Misconception'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? '"कुण्डली भाग्य है" — नहीं! यह नियतिवादी नहीं है। इसे मौसम पूर्वानुमान समझें: यह प्रवृत्तियाँ और ऋतुएँ दिखाता है, पर आप स्वयं चुनते हैं क्या करना है। दशाएँ बताती हैं कब विषय सक्रिय होते हैं — यह तैयारी है, नियतिवाद नहीं।'
            : '"Kundali is destiny" \u2014 NOT deterministic. Think of it as a weather forecast: it shows tendencies and seasons, but you still choose what to do. The dashas show WHEN themes activate \u2014 preparation, not fatalism.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'रोचक तथ्य' : 'Key Historical Fact'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'पराशर की बृहत्होरा शास्त्र (लगभग दूसरी शताब्दी ई.) जन्म कुण्डली गणना, ग्रह गरिमा, 300+ योग और उपचार — सब 97 अध्यायों में वर्णित करती है। यह किसी भी सभ्यता में लिखा गया सबसे व्यापक ज्योतिष ग्रन्थ है, और हमारा ऐप इसके अल्गोरिद्म लागू करता है।'
            : 'Parashara\'s Brihat Hora Shastra (c. 2nd century CE) describes how to compute a birth chart, planetary dignities, 300+ yogas, and remedial measures \u2014 all in 97 chapters. It\'s the most comprehensive astrological text ever written in any civilization, and our app implements its algorithms.'}
        </p>
      </section>
    </div>
  );
}

export default function Module0_5() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
