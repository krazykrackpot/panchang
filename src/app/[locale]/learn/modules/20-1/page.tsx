'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_20_1', phase: 7, topic: 'KP System', moduleNumber: '20.1',
  title: { en: 'Placidus Houses — Why KP Uses Unequal Houses', hi: 'प्लेसिडस भाव — केपी असमान भावों का उपयोग क्यों करता है' },
  subtitle: {
    en: 'How the KP system replaced equal-house divisions with latitude-sensitive Placidus cusps for more accurate planet-house assignments',
    hi: 'केपी पद्धति ने कैसे समान भाव विभाजन को अक्षांश-संवेदी प्लेसिडस भाव-सन्धियों से प्रतिस्थापित किया ताकि ग्रह-भाव आवंटन अधिक सटीक हो',
  },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: 'Module 20-2: The 249 Sub-Lord Table', hi: 'मॉड्यूल 20-2: 249 उप-स्वामी सारणी' }, href: '/learn/modules/20-2' },
    { label: { en: 'Module 20-3: Significators', hi: 'मॉड्यूल 20-3: कारकत्व' }, href: '/learn/modules/20-3' },
    { label: { en: 'Module 20-4: Ruling Planets', hi: 'मॉड्यूल 20-4: शासक ग्रह' }, href: '/learn/modules/20-4' },
    { label: { en: 'KP System Tool', hi: 'केपी पद्धति उपकरण' }, href: '/kp-system' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q20_1_01', type: 'mcq',
    question: {
      en: 'In the traditional Vedic equal-house system, how wide is each house?',
      hi: 'पारम्परिक वैदिक समान-भाव पद्धति में प्रत्येक भाव कितना चौड़ा होता है?',
    },
    options: [
      { en: '30 degrees', hi: '30 अंश' },
      { en: 'Varies by latitude', hi: 'अक्षांश के अनुसार भिन्न' },
      { en: '13 degrees 20 minutes', hi: '13 अंश 20 कला' },
      { en: '15 degrees', hi: '15 अंश' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'The equal-house system divides the ecliptic into 12 houses of exactly 30 degrees each, starting from the Ascendant degree. This is the standard Vedic approach.',
      hi: 'समान-भाव पद्धति क्रान्तिवृत्त को लग्न अंश से आरम्भ करते हुए ठीक 30 अंश के 12 भावों में विभक्त करती है। यह मानक वैदिक दृष्टिकोण है।',
    },
  },
  {
    id: 'q20_1_02', type: 'mcq',
    question: {
      en: 'What house system does the KP method use?',
      hi: 'केपी पद्धति किस भाव पद्धति का उपयोग करती है?',
    },
    options: [
      { en: 'Whole Sign houses', hi: 'पूर्ण राशि भाव' },
      { en: 'Equal houses', hi: 'समान भाव' },
      { en: 'Placidus houses', hi: 'प्लेसिडस भाव' },
      { en: 'Campanus houses', hi: 'कैम्पेनस भाव' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'KP (Krishnamurti Paddhati) exclusively uses the Placidus house system, where house sizes vary based on the observer\'s geographic latitude.',
      hi: 'केपी (कृष्णमूर्ति पद्धति) विशेष रूप से प्लेसिडस भाव पद्धति का उपयोग करती है, जहाँ भावों का आकार प्रेक्षक के भौगोलिक अक्षांश पर निर्भर करता है।',
    },
  },
  {
    id: 'q20_1_03', type: 'true_false',
    question: {
      en: 'In the Placidus system, the MC (Midheaven) is always the cusp of the 10th house.',
      hi: 'प्लेसिडस पद्धति में MC (मध्य आकाश) सदैव दशम भाव की सन्धि होती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. In Placidus, the MC (meridian crossing point) is always the 10th house cusp, and the IC is always the 4th house cusp. This is a defining feature of the system.',
      hi: 'सत्य। प्लेसिडस में MC (याम्योत्तर बिन्दु) सदैव दशम भाव सन्धि होती है, और IC सदैव चतुर्थ भाव सन्धि। यह इस पद्धति की परिभाषित विशेषता है।',
    },
  },
  {
    id: 'q20_1_04', type: 'mcq',
    question: {
      en: 'How does Placidus calculate intermediate house cusps?',
      hi: 'प्लेसिडस मध्यवर्ती भाव सन्धियों की गणना कैसे करता है?',
    },
    options: [
      { en: 'Divides the ecliptic into equal arcs', hi: 'क्रान्तिवृत्त को समान चापों में विभक्त करता है' },
      { en: 'Trisects the diurnal and nocturnal semi-arcs', hi: 'दिवसीय और रात्रिकालीन अर्ध-चापों को त्रिभाजित करता है' },
      { en: 'Uses fixed star positions', hi: 'स्थिर तारा स्थितियों का उपयोग करता है' },
      { en: 'Divides houses by planetary speed', hi: 'ग्रह गति के अनुसार भाव विभाजित करता है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Placidus works by trisecting the diurnal (daytime) and nocturnal (nighttime) semi-arcs of each degree of the ecliptic as it rises and sets at a given latitude.',
      hi: 'प्लेसिडस प्रत्येक क्रान्तिवृत्त अंश के दिवसीय (दिन) और रात्रिकालीन (रात) अर्ध-चापों को किसी दिए गए अक्षांश पर त्रिभाजित करके कार्य करता है।',
    },
  },
  {
    id: 'q20_1_05', type: 'mcq',
    question: {
      en: 'At what type of location do Placidus houses differ most from equal houses?',
      hi: 'किस प्रकार के स्थान पर प्लेसिडस भाव समान भावों से सर्वाधिक भिन्न होते हैं?',
    },
    options: [
      { en: 'At the equator (0 degrees latitude)', hi: 'भूमध्य रेखा पर (0 अंश अक्षांश)' },
      { en: 'At moderate latitudes (20-30 degrees)', hi: 'मध्यम अक्षांशों पर (20-30 अंश)' },
      { en: 'At high latitudes (50+ degrees)', hi: 'उच्च अक्षांशों पर (50+ अंश)' },
      { en: 'It makes no difference', hi: 'कोई अन्तर नहीं पड़ता' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'At high latitudes, the diurnal arcs become very unequal (long summer days, short winter days), causing Placidus houses to range from as small as 20 degrees to over 40 degrees.',
      hi: 'उच्च अक्षांशों पर दिवसीय चाप बहुत असमान हो जाते हैं (लम्बे ग्रीष्म दिवस, छोटे शीत दिवस), जिससे प्लेसिडस भाव 20 अंश जितने छोटे से 40 अंश से अधिक तक हो सकते हैं।',
    },
  },
  {
    id: 'q20_1_06', type: 'true_false',
    question: {
      en: 'A planet at 25 degrees Aries will always be in the same house regardless of whether you use equal or Placidus house systems.',
      hi: '25 अंश मेष पर स्थित ग्रह समान और प्लेसिडस दोनों भाव पद्धतियों में सदैव एक ही भाव में होगा।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. A planet at 25 degrees Aries might fall in the 1st house under equal houses but in the 12th house under Placidus, depending on the latitude and birth time. This difference changes all predictions.',
      hi: 'असत्य। 25 अंश मेष पर ग्रह समान भावों में प्रथम भाव में हो सकता है किन्तु प्लेसिडस में द्वादश भाव में, अक्षांश और जन्म समय पर निर्भर करते हुए। यह अन्तर सभी फलादेश बदल देता है।',
    },
  },
  {
    id: 'q20_1_07', type: 'mcq',
    question: {
      en: 'Who developed the KP system that adopted Placidus houses for Indian astrology?',
      hi: 'भारतीय ज्योतिष हेतु प्लेसिडस भावों को अपनाने वाली केपी पद्धति किसने विकसित की?',
    },
    options: [
      { en: 'Varahamihira', hi: 'वराहमिहिर' },
      { en: 'K.S. Krishnamurti', hi: 'के.एस. कृष्णमूर्ति' },
      { en: 'Parashara', hi: 'पराशर' },
      { en: 'B.V. Raman', hi: 'बी.वी. रमण' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'K.S. Krishnamurti (1908-1972) developed the Krishnamurti Paddhati (KP system) in the 1960s, integrating Placidus houses with Vedic nakshatra-based sub-lords.',
      hi: 'के.एस. कृष्णमूर्ति (1908-1972) ने 1960 के दशक में कृष्णमूर्ति पद्धति (केपी) विकसित की, जिसमें प्लेसिडस भावों को वैदिक नक्षत्र-आधारित उप-स्वामियों के साथ एकीकृत किया।',
    },
  },
  {
    id: 'q20_1_08', type: 'true_false',
    question: {
      en: 'At the equator, Placidus houses are nearly identical to equal houses.',
      hi: 'भूमध्य रेखा पर प्लेसिडस भाव समान भावों के लगभग समान होते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. At the equator (0 degrees latitude), all diurnal arcs are nearly equal, so Placidus house cusps approximate 30 degrees each, closely matching the equal house system.',
      hi: 'सत्य। भूमध्य रेखा (0 अंश अक्षांश) पर सभी दिवसीय चाप लगभग समान होते हैं, अतः प्लेसिडस भाव सन्धियाँ लगभग 30 अंश प्रत्येक होती हैं, जो समान भाव पद्धति से लगभग मेल खाती हैं।',
    },
  },
  {
    id: 'q20_1_09', type: 'mcq',
    question: {
      en: 'Which two points are always fixed in the Placidus system?',
      hi: 'प्लेसिडस पद्धति में कौन-से दो बिन्दु सदैव स्थिर रहते हैं?',
    },
    options: [
      { en: 'Ascendant and 7th cusp', hi: 'लग्न और सप्तम सन्धि' },
      { en: 'MC (10th) and IC (4th)', hi: 'MC (दशम) और IC (चतुर्थ)' },
      { en: 'Both Ascendant/Descendant and MC/IC', hi: 'लग्न/अस्त और MC/IC दोनों' },
      { en: 'Only the Ascendant', hi: 'केवल लग्न' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'In Placidus, four points are fixed: the Ascendant (1st), Descendant (7th), MC (10th), and IC (4th). The intermediate cusps (2, 3, 5, 6, 8, 9, 11, 12) are calculated by trisection.',
      hi: 'प्लेसिडस में चार बिन्दु स्थिर हैं: लग्न (प्रथम), अस्त (सप्तम), MC (दशम), और IC (चतुर्थ)। मध्यवर्ती सन्धियाँ (2, 3, 5, 6, 8, 9, 11, 12) त्रिभाजन द्वारा गणित होती हैं।',
    },
  },
  {
    id: 'q20_1_10', type: 'mcq',
    question: {
      en: 'Why do KP practitioners argue that Placidus gives better results than equal houses?',
      hi: 'केपी अभ्यासकर्ता क्यों तर्क देते हैं कि प्लेसिडस समान भावों से बेहतर परिणाम देता है?',
    },
    options: [
      { en: 'It uses more planets', hi: 'यह अधिक ग्रहों का उपयोग करता है' },
      { en: 'It accounts for geographic latitude in house sizes', hi: 'यह भाव आकार में भौगोलिक अक्षांश को ध्यान में रखता है' },
      { en: 'It was invented more recently', hi: 'यह अधिक हाल में आविष्कृत हुआ' },
      { en: 'It uses tropical zodiac', hi: 'यह सायन राशिचक्र का उपयोग करता है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'KP practitioners argue that Placidus gives more accurate event timing because it accounts for the observer\'s latitude, making planet-house assignments more precise, especially at non-equatorial locations.',
      hi: 'केपी अभ्यासकर्ताओं का तर्क है कि प्लेसिडस अधिक सटीक घटना समय देता है क्योंकि यह प्रेक्षक के अक्षांश को ध्यान में रखता है, जिससे ग्रह-भाव आवंटन अधिक यथार्थ होता है, विशेषतः गैर-भूमध्यरेखीय स्थानों पर।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'समान बनाम असमान भाव पद्धतियाँ' : 'Equal vs Unequal House Systems'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'पारम्परिक वैदिक ज्योतिष (पाराशरी पद्धति) में कुण्डली को लग्न अंश से आरम्भ करते हुए ठीक 30 अंश के 12 भावों में विभक्त किया जाता है। इसे समान-भाव पद्धति कहते हैं। यदि आपका लग्न 10 अंश मेष पर है, तो प्रथम भाव 10 अंश मेष से 10 अंश वृषभ तक, द्वितीय भाव 10 अंश वृषभ से 10 अंश मिथुन तक, इत्यादि। प्रत्येक भाव ठीक 30 अंश चौड़ा है, जो प्रत्येक राशि की 30 अंश चौड़ाई को प्रतिबिम्बित करता है। यह पद्धति सरल, सुन्दर है और सहस्राब्दियों से भारतीय ज्योतिष का मानक रही है।'
            : 'In traditional Vedic astrology (Parashari system), the chart is divided into 12 houses of exactly 30 degrees each, starting from the Ascendant degree. This is called the equal-house system. If your lagna (Ascendant) is at 10 degrees Aries, the 1st house spans 10 degrees Aries to 10 degrees Taurus, the 2nd house from 10 degrees Taurus to 10 degrees Gemini, and so on. Each house is exactly 30 degrees wide, mirroring the 30-degree width of each rashi (sign). This system is simple, elegant, and has been the standard in Indian astrology for millennia.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'के.एस. कृष्णमूर्ति द्वारा 1960 के दशक में विकसित केपी (कृष्णमूर्ति पद्धति) ने एक क्रान्तिकारी परिवर्तन किया: इसने पाश्चात्य ज्योतिष से प्लेसिडस भाव पद्धति अपनाई। प्लेसिडस में भावों का आकार असमान होता है — ये प्रेक्षक के भौगोलिक अक्षांश के अनुसार भिन्न होते हैं। एक भाव 20 अंश जितना संकीर्ण या 40 अंश जितना चौड़ा हो सकता है। इस चयन का कारण सटीकता था: उच्च अक्षांशों पर (जैसे यूरोप 47 अंश उत्तर, या उत्तर भारत 28-30 अंश उत्तर पर भी), समान भाव एक ग्रह को गलत भाव में रख सकते हैं, जिससे गलत फलादेश होते हैं।'
            : 'The KP (Krishnamurti Paddhati) system, developed by K.S. Krishnamurti in the 1960s, made a radical departure: it adopted the Placidus house system from Western astrology. In Placidus, house sizes are UNEQUAL — they vary based on the observer\'s geographic latitude. A house might be as narrow as 20 degrees or as wide as 40 degrees. The reason for this choice was precision: at higher latitudes (like Europe at 47 degrees N, or even parts of North India at 28-30 degrees N), equal houses can place a planet in the wrong house, leading to incorrect predictions.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'प्लेसिडस भाव पद्धति इतालवी भिक्षु और गणितज्ञ प्लेसिडस दे टिटिस (1603-1668) ने अपनी कृति "फिज़ियोमैथेमैटिका" में विकसित की। तथापि, समय-आधारित भाव विभाजन की मूल अवधारणा टॉलेमी के टेट्राबिब्लोस (द्वितीय शताब्दी ई.) तक जाती है। तमिलनाडु के प्राध्यापक के.एस. कृष्णमूर्ति ने पहचाना कि यह पाश्चात्य तकनीक भारतीय ज्योतिष की एक वास्तविक समस्या — गैर-भूमध्यरेखीय अक्षांशों पर समान भावों की अशुद्धि — का समाधान करती है, और इसे वैदिक नक्षत्र उप-स्वामी पद्धति के साथ प्रतिभापूर्वक एकीकृत कर केपी का निर्माण किया।'
            : 'The Placidus house system was developed by the Italian monk and mathematician Placidus de Titis (1603-1668) in his work "Physiomathematica." However, the underlying concept of time-based house division traces back to Ptolemy\'s Tetrabiblos (2nd century CE). K.S. Krishnamurti, a professor from Tamil Nadu, recognized that this Western technique solved a real problem in Indian astrology — the inaccuracy of equal houses at non-equatorial latitudes — and brilliantly integrated it with the Vedic nakshatra sub-lord system to create KP.'}
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'प्लेसिडस भाव-सन्धि गणना' : 'How Placidus Calculates Cusps'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्लेसिडस विधि चार स्थिर आधार बिन्दुओं से आरम्भ होती है: लग्न (प्रथम भाव सन्धि), अस्त (सप्तम भाव सन्धि), MC या मीडियम कोएली (दशम भाव सन्धि, जहाँ क्रान्तिवृत्त क्षितिज के ऊपर याम्योत्तर को पार करता है), और IC या इमम कोएली (चतुर्थ भाव सन्धि, क्षितिज के नीचे याम्योत्तर)। ये चार बिन्दु लगभग सभी भाव पद्धतियों में समान हैं। प्लेसिडस का वैशिष्ट्य मध्यवर्ती सन्धियों — 2, 3, 5, 6, 8, 9, 11, 12वें भाव की सीमाओं — की गणना में है।'
            : 'The Placidus method starts with four fixed anchor points: the Ascendant (1st house cusp), the Descendant (7th house cusp), the MC or Medium Coeli (10th house cusp, where the ecliptic crosses the meridian above the horizon), and the IC or Imum Coeli (4th house cusp, the meridian below the horizon). These four points are identical in almost all house systems. The magic of Placidus lies in how it calculates the intermediate cusps — the 2nd, 3rd, 5th, 6th, 8th, 9th, 11th, and 12th house boundaries.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'तकनीक: क्रान्तिवृत्त के किसी भी बिन्दु के लिए, उसका दिवसीय चाप (क्षितिज के ऊपर कितनी देर रहता है) और रात्रिकालीन चाप (नीचे कितनी देर) गणित करें। दिवसीय अर्ध-चाप दिवसीय चाप का आधा है। दिवसीय अर्ध-चाप को त्रिभाजित करने से 11वीं और 12वीं भाव सन्धियाँ मिलती हैं; रात्रिकालीन अर्ध-चाप को त्रिभाजित करने से 2री और 3री भाव सन्धियाँ मिलती हैं। क्षितिज के नीचे यही प्रक्रिया 5, 6, 8 और 9वीं सन्धियाँ देती है।'
            : 'The technique: for any point on the ecliptic, calculate its diurnal arc (how long it stays above the horizon) and nocturnal arc (how long below). The diurnal semi-arc is half the diurnal arc. Trisecting the diurnal semi-arc gives the 11th and 12th house cusps; trisecting the nocturnal semi-arc gives the 2nd and 3rd house cusps. The same process below the horizon gives the 5th, 6th, 8th, and 9th cusps.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example'}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={isHi ? 'उदाहरण कुण्डली' : 'Example Chart'} />
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">47 अंश उत्तर अक्षांश की कुण्डली (जैसे स्विट्ज़रलैण्ड):</span> लग्न = 5 अंश कर्क, MC = 15 अंश मीन। समान भावों में प्रत्येक भाव ठीक 30 अंश होता। किन्तु इस अक्षांश पर प्लेसिडस में भाव नाटकीय रूप से असमान हो जाते हैं: प्रथम भाव = 5 अंश कर्क से 28 अंश कर्क (केवल 23 अंश चौड़ा), द्वितीय भाव = 28 अंश कर्क से 25 अंश सिंह (27 अंश), तृतीय भाव = 25 अंश सिंह से 27 अंश कन्या (32 अंश)। वहीं दशम भाव 15 अंश मीन से 20 अंश मेष तक (35 अंश चौड़ा)। 23 से 35 अंश तक का अन्तर दिखाता है कि ग्रह स्थान भावों के बीच कैसे बदल सकता है।</>
            : <><span className="text-gold-light font-medium">Chart at 47 degrees N latitude (e.g., Switzerland):</span> Ascendant = 5 degrees Cancer, MC = 15 degrees Pisces. In equal houses, each house would span exactly 30 degrees. But in Placidus at this latitude, the houses become dramatically unequal: 1st house = 5 degrees Cancer to 28 degrees Cancer (only 23 degrees wide), 2nd house = 28 degrees Cancer to 25 degrees Leo (27 degrees), 3rd house = 25 degrees Leo to 27 degrees Virgo (32 degrees). Meanwhile, the 10th house spans from 15 degrees Pisces to 20 degrees Aries (35 degrees wide). The variation from 23 to 35 degrees shows why planet placement can shift between houses.</>}
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'फलादेश पर प्रभाव' : 'Impact on Predictions'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'ग्रह जिस भाव में बैठता है वह उसके कारकत्व और प्रभावित जीवन क्षेत्रों को निर्धारित करता है। यदि कोई ग्रह प्रथम भाव (स्व, व्यक्तित्व, स्वास्थ्य) से द्वादश भाव (हानि, एकान्त, विदेश) में केवल भाव पद्धति के कारण स्थानान्तरित हो जाए, तो सभी फलादेश बदल जाते हैं। मंगल को 25 अंश मेष पर लें: 5 अंश मेष लग्न वाली समान-भाव कुण्डली में मंगल दृढ़ रूप से प्रथम भाव में है — ऊर्जा, दृढ़ता और शारीरिक बल देते हुए। किन्तु 47 अंश उत्तर पर प्लेसिडस में, यदि 12वीं भाव सन्धि 20 अंश मेष पर आती है, तो 25 अंश मेष का मंगल 12वें भाव में है — छिपे शत्रु, व्यय और विदेश यात्रा का संकेत देते हुए।'
            : 'The house a planet occupies determines its significations and the life areas it influences. If a planet shifts from the 1st house (self, personality, health) to the 12th house (losses, isolation, foreign lands) simply because of the house system used, ALL predictions change. Consider Mars at 25 degrees Aries: in an equal-house chart with Ascendant at 5 degrees Aries, Mars is solidly in the 1st house — giving energy, assertiveness, and physical vitality. But in Placidus at 47 degrees N, if the 12th house cusp falls at 20 degrees Aries, then Mars at 25 degrees Aries is in the 12th house — signifying hidden enemies, expenditure, and foreign travel instead.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'केपी अभ्यासकर्ताओं का तर्क है कि प्लेसिडस वास्तविक-विश्व घटनाओं से अधिक सटीक मेल खाता है क्योंकि यह जन्म स्थान की वास्तविक खगोलीय परिस्थितियों का सम्मान करता है। समान और प्लेसिडस भावों के बीच विवाद जारी है, किन्तु केपी का सटीक घटना-समय निर्धारण — "मुझे नौकरी कब मिलेगी?", "मेरा विवाह कब होगा?" — ने इसे एक समर्पित अनुयायी वर्ग दिया है, विशेषतः दक्षिण भारत में और उन ज्योतिषियों में जो व्यक्तित्व विश्लेषण से अधिक फलादेश को प्राथमिकता देते हैं।'
            : 'KP practitioners argue that Placidus matches real-world events more accurately because it respects the actual astronomical conditions at the birth location. The debate between equal and Placidus houses continues, but KP\'s track record of precise event timing — "when will I get a job?", "when will I marry?" — has earned it a devoted following, especially in South India and among astrologers who prioritize prediction over personality analysis.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;प्लेसिडस पाश्चात्य पद्धति है, अतः वैदिक ज्योतिष में इसका कोई स्थान नहीं।&quot; यद्यपि प्लेसिडस की उत्पत्ति यूरोप में हुई, केपी पद्धति इसे विशुद्ध वैदिक अवधारणाओं — नक्षत्र, विंशोत्तरी दशा अनुपात, और निरयन (लाहिरी) अयनांश — के साथ प्रयोग करती है। केपी एक संकर पद्धति है जो दोनों परम्पराओं का सर्वश्रेष्ठ लेती है। भाव विभाजन तकनीक ज्यामितीय और खगोलीय है — इसमें कोई अन्तर्निहित सांस्कृतिक पूर्वाग्रह नहीं है।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Placidus is a Western system, so it has no place in Vedic astrology.&quot; While Placidus originated in Europe, the KP system uses it alongside purely Vedic concepts — nakshatras, Vimshottari dasha proportions, and sidereal (Lahiri) ayanamsa. KP is a hybrid that takes the best from both traditions. The house division technique is geometric and astronomical — it has no inherent cultural bias.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'आज प्लेसिडस भावों सहित केपी भारत में सर्वाधिक लोकप्रिय फलादेश पद्धतियों में से एक है, विशेषतः प्रश्न (होरेरी) और घटना-समय निर्धारण प्रश्नों के लिए। हमारे केपी सिस्टम उपकरण जैसे सॉफ्टवेयर किसी भी अक्षांश के लिए स्वचालित रूप से प्लेसिडस सन्धियाँ गणित करते हैं, जिससे प्रारम्भिक केपी अभ्यासकर्ताओं को करनी पड़ने वाली मैनुअल सारणी खोज की आवश्यकता समाप्त हो गई। यह पद्धति उच्च अक्षांशों (ब्रिटेन, कनाडा, उत्तरी यूरोप) पर रहने वाले भारतीय प्रवासियों के लिए विशेष रूप से प्रासंगिक है जहाँ समान भाव उत्तरोत्तर अशुद्ध होते जाते हैं।'
            : 'Today, KP with Placidus houses is one of the most popular predictive systems in India, particularly for horary (prashna) and event-timing questions. Software like our KP System tool computes Placidus cusps automatically for any latitude, removing the need for manual table lookups that early KP practitioners had to perform. The system is especially relevant for the Indian diaspora living at high latitudes (UK, Canada, Northern Europe) where equal houses become increasingly inaccurate.'}
        </p>
      </section>
    </div>
  );
}

export default function Module20_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
