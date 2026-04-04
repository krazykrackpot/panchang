'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_5_1', phase: 2, topic: 'Tithi', moduleNumber: '5.1',
  title: { en: 'Tithi — The Lunar Day', hi: 'तिथि — चान्द्र दिवस' },
  subtitle: {
    en: 'The angular separation between Moon and Sun, divided into 12-degree segments, forms the 30 tithis of a lunar month',
    hi: 'चन्द्रमा और सूर्य के बीच का कोणीय अन्तर, 12 अंश के खण्डों में विभक्त, चान्द्र मास की 30 तिथियाँ बनाता है',
  },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 5-2: Paksha', hi: 'मॉड्यूल 5-2: पक्ष' }, href: '/learn/modules/5-2' },
    { label: { en: 'Module 5-3: Tithi Calculations', hi: 'मॉड्यूल 5-3: तिथि गणना' }, href: '/learn/modules/5-3' },
    { label: { en: 'Tithis Deep Dive', hi: 'तिथि विस्तार' }, href: '/learn/tithis' },
    { label: { en: 'Daily Panchang', hi: 'दैनिक पंचांग' }, href: '/panchang' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q5_1_01', type: 'mcq',
    question: {
      en: 'A tithi is defined by the angular separation between which two celestial bodies?',
      hi: 'तिथि की परिभाषा किन दो खगोलीय पिण्डों के कोणीय अन्तर से होती है?',
    },
    options: [
      { en: 'Sun and Mars', hi: 'सूर्य और मंगल' },
      { en: 'Moon and Sun', hi: 'चन्द्रमा और सूर्य' },
      { en: 'Jupiter and Saturn', hi: 'बृहस्पति और शनि' },
      { en: 'Moon and Rahu', hi: 'चन्द्रमा और राहु' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A tithi is determined by the elongation (angular difference) between the Moon and the Sun. Each 12-degree increment of this elongation marks a new tithi.',
      hi: 'तिथि चन्द्रमा और सूर्य के बीच की कोणीय दूरी (elongation) से निर्धारित होती है। इस कोणीय दूरी के प्रत्येक 12 अंश के बाद एक नई तिथि आरम्भ होती है।',
    },
  },
  {
    id: 'q5_1_02', type: 'mcq',
    question: {
      en: 'How many tithis are there in one complete lunar month (Amavasya to Amavasya)?',
      hi: 'एक पूर्ण चान्द्र मास (अमावस्या से अमावस्या) में कितनी तिथियाँ होती हैं?',
    },
    options: [
      { en: '15', hi: '15' },
      { en: '27', hi: '27' },
      { en: '30', hi: '30' },
      { en: '28', hi: '28' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'A complete lunar month has 30 tithis: 15 in Shukla Paksha (waxing) and 15 in Krishna Paksha (waning). The total Moon-Sun elongation of 360 degrees divided by 12 degrees per tithi gives exactly 30.',
      hi: 'एक पूर्ण चान्द्र मास में 30 तिथियाँ होती हैं: शुक्ल पक्ष में 15 और कृष्ण पक्ष में 15। चन्द्र-सूर्य की कुल 360 अंश की कोणीय दूरी को 12 अंश प्रति तिथि से भाग देने पर ठीक 30 प्राप्त होता है।',
    },
  },
  {
    id: 'q5_1_03', type: 'true_false',
    question: {
      en: 'All tithis have the same duration of exactly 24 hours, just like a solar day.',
      hi: 'सभी तिथियाँ सौर दिवस की भाँति ठीक 24 घण्टे की होती हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Tithis vary in duration from approximately 19 to 26 hours because the Moon\'s orbital speed is not constant. When the Moon moves faster, it covers 12 degrees of elongation more quickly, making the tithi shorter.',
      hi: 'असत्य। तिथियों की अवधि लगभग 19 से 26 घण्टे तक भिन्न-भिन्न होती है क्योंकि चन्द्रमा की कक्षीय गति स्थिर नहीं होती। जब चन्द्रमा तेज़ चलता है तो 12 अंश की दूरी शीघ्र पूरी हो जाती है और तिथि छोटी होती है।',
    },
  },
  {
    id: 'q5_1_04', type: 'mcq',
    question: {
      en: 'Shukla Paksha corresponds to which phase of the Moon?',
      hi: 'शुक्ल पक्ष चन्द्रमा की किस कला से सम्बन्धित है?',
    },
    options: [
      { en: 'Waning (decreasing) Moon', hi: 'ह्रासमान (घटता) चन्द्रमा' },
      { en: 'Waxing (increasing) Moon', hi: 'वर्धमान (बढ़ता) चन्द्रमा' },
      { en: 'Eclipsed Moon', hi: 'ग्रहण-ग्रस्त चन्द्रमा' },
      { en: 'Retrograde Moon', hi: 'वक्री चन्द्रमा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Shukla Paksha is the bright (waxing) half of the lunar month, running from Amavasya (new Moon) to Purnima (full Moon). The word "Shukla" means bright or white.',
      hi: 'शुक्ल पक्ष चान्द्र मास का उज्ज्वल (वर्धमान) अर्ध है, जो अमावस्या (नव चन्द्र) से पूर्णिमा तक चलता है। "शुक्ल" शब्द का अर्थ उज्ज्वल या श्वेत होता है।',
    },
  },
  {
    id: 'q5_1_05', type: 'mcq',
    question: {
      en: 'Each tithi spans how many degrees of Moon-Sun elongation?',
      hi: 'प्रत्येक तिथि चन्द्र-सूर्य कोणीय दूरी के कितने अंशों में फैली होती है?',
    },
    options: [
      { en: '13 degrees 20 minutes', hi: '13 अंश 20 कला' },
      { en: '12 degrees', hi: '12 अंश' },
      { en: '15 degrees', hi: '15 अंश' },
      { en: '10 degrees', hi: '10 अंश' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Each tithi spans exactly 12 degrees of Moon-Sun elongation. 360 degrees / 30 tithis = 12 degrees per tithi. Do not confuse this with nakshatra span (13d20m).',
      hi: 'प्रत्येक तिथि चन्द्र-सूर्य कोणीय दूरी के ठीक 12 अंश में फैली होती है। 360 अंश / 30 तिथियाँ = 12 अंश प्रति तिथि। इसे नक्षत्र के विस्तार (13 अंश 20 कला) से भ्रमित न करें।',
    },
  },
  {
    id: 'q5_1_06', type: 'true_false',
    question: {
      en: 'Rikta tithis (Chaturthi, Navami, Chaturdashi) are considered auspicious for initiating new ventures.',
      hi: 'रिक्ता तिथियाँ (चतुर्थी, नवमी, चतुर्दशी) नये कार्यों के आरम्भ हेतु शुभ मानी जाती हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Rikta tithis (4th, 9th, 14th of each paksha) are considered inauspicious or "empty" for new beginnings. The word "Rikta" literally means empty or void. These tithis are suited for destructive or removal-oriented activities.',
      hi: 'असत्य। रिक्ता तिथियाँ (प्रत्येक पक्ष की चौथी, नवमी, चतुर्दशी) नये कार्यों के लिए अशुभ या "रिक्त" मानी जाती हैं। "रिक्ता" शब्द का शाब्दिक अर्थ खाली या शून्य है। ये तिथियाँ विध्वंसक या निवारण-सम्बन्धी कार्यों के लिए उपयुक्त हैं।',
    },
  },
  {
    id: 'q5_1_07', type: 'mcq',
    question: {
      en: 'Which group of tithis is called "Nanda" (joy-giving)?',
      hi: 'कौन-सा तिथि समूह "नन्दा" (आनन्ददायक) कहलाता है?',
    },
    options: [
      { en: 'Pratipada, Shashthi, Ekadashi', hi: 'प्रतिपदा, षष्ठी, एकादशी' },
      { en: 'Dwitiya, Saptami, Dwadashi', hi: 'द्वितीया, सप्तमी, द्वादशी' },
      { en: 'Tritiya, Ashtami, Trayodashi', hi: 'तृतीया, अष्टमी, त्रयोदशी' },
      { en: 'Chaturthi, Navami, Chaturdashi', hi: 'चतुर्थी, नवमी, चतुर्दशी' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Nanda tithis are the 1st, 6th, and 11th of each paksha (Pratipada, Shashthi, Ekadashi). They are associated with joy and are considered favorable for auspicious activities.',
      hi: 'नन्दा तिथियाँ प्रत्येक पक्ष की पहली, छठी और ग्यारहवीं (प्रतिपदा, षष्ठी, एकादशी) हैं। ये आनन्द से जुड़ी हैं और शुभ कार्यों के लिए अनुकूल मानी जाती हैं।',
    },
  },
  {
    id: 'q5_1_08', type: 'true_false',
    question: {
      en: 'Purnima is the 15th tithi of Shukla Paksha and occurs when Moon-Sun elongation is exactly 180 degrees.',
      hi: 'पूर्णिमा शुक्ल पक्ष की 15वीं तिथि है और यह तब होती है जब चन्द्र-सूर्य कोणीय दूरी ठीक 180 अंश होती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Purnima is Shukla Paksha tithi 15, spanning from 168 to 180 degrees of elongation. The moment of exact 180-degree elongation is the astronomical full Moon.',
      hi: 'सत्य। पूर्णिमा शुक्ल पक्ष की 15वीं तिथि है, जो 168 से 180 अंश कोणीय दूरी तक फैली है। ठीक 180 अंश कोणीय दूरी का क्षण खगोलीय पूर्ण चन्द्र है।',
    },
  },
  {
    id: 'q5_1_09', type: 'mcq',
    question: {
      en: 'Why do tithis vary in duration from approximately 19 to 26 hours?',
      hi: 'तिथियों की अवधि लगभग 19 से 26 घण्टे तक क्यों भिन्न होती है?',
    },
    options: [
      { en: 'Because the Earth rotates at different speeds', hi: 'क्योंकि पृथ्वी भिन्न-भिन्न गति से घूमती है' },
      { en: 'Because the Moon\'s orbital speed varies due to its elliptical orbit', hi: 'क्योंकि चन्द्रमा की कक्षीय गति उसकी दीर्घवृत्ताकार कक्षा के कारण बदलती रहती है' },
      { en: 'Because the Sun changes size', hi: 'क्योंकि सूर्य का आकार बदलता है' },
      { en: 'Because tithis are arbitrarily assigned by astrologers', hi: 'क्योंकि तिथियाँ ज्योतिषियों द्वारा मनमाने ढंग से निर्धारित की जाती हैं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Moon\'s orbit is elliptical, so its speed varies from about 11.8 degrees/day (at apogee) to 15.4 degrees/day (at perigee). When the Moon is faster, it covers the 12-degree tithi span more quickly, resulting in shorter tithis.',
      hi: 'चन्द्रमा की कक्षा दीर्घवृत्ताकार है, इसलिए उसकी गति लगभग 11.8 अंश/दिन (अपभू पर) से 15.4 अंश/दिन (उपभू पर) तक बदलती है। जब चन्द्रमा तेज़ होता है तो 12 अंश का तिथि-विस्तार शीघ्र पूरा होता है, फलतः तिथि छोटी होती है।',
    },
  },
  {
    id: 'q5_1_10', type: 'mcq',
    question: {
      en: 'The deity associated with Amavasya (new Moon tithi) is:',
      hi: 'अमावस्या (नव चन्द्र तिथि) के अधिष्ठाता देवता हैं:',
    },
    options: [
      { en: 'Brahma', hi: 'ब्रह्मा' },
      { en: 'Vishnu', hi: 'विष्णु' },
      { en: 'Pitris (ancestors)', hi: 'पितर (पूर्वज)' },
      { en: 'Indra', hi: 'इन्द्र' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Amavasya is dedicated to the Pitris (ancestors). It is the primary day for performing Shraddha (ancestral rites) and tarpan (water offerings to the departed).',
      hi: 'अमावस्या पितरों (पूर्वजों) को समर्पित है। यह श्राद्ध (पितृ कर्म) और तर्पण (दिवंगतों को जलार्पण) करने का प्रमुख दिन है।',
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
          {isHi ? 'तिथि क्या है?' : 'What is a Tithi?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'तिथि हिन्दू चान्द्र पंचांग की मूलभूत इकाई और पंचांग के पाँच अंगों में से प्रथम है। इसे पृथ्वी से देखने पर चन्द्रमा और सूर्य के बीच की कोणीय दूरी द्वारा परिभाषित किया जाता है। जब भी चन्द्रमा अपनी कक्षा में सूर्य से 12 अंश आगे बढ़ता है, एक तिथि पूर्ण होती है और अगली आरम्भ होती है। चूँकि पूर्ण वृत्त 360 अंश का है और प्रत्येक तिथि 12 अंश की है, एक पूर्ण चान्द्र मास (अमावस्या से अमावस्या) में ठीक 30 तिथियाँ होती हैं।'
            : 'A tithi is the fundamental unit of the Hindu lunar calendar and the first of the five limbs (angas) of the Panchang. It is defined by the angular separation between the Moon and the Sun as seen from Earth. Every time the Moon moves 12 degrees ahead of the Sun in its orbit, one tithi is completed and the next begins. Since the full circle is 360 degrees and each tithi spans 12 degrees, there are exactly 30 tithis in a complete lunar month (synodic month), from one Amavasya (new Moon) to the next.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? '30 तिथियाँ दो पक्षों (पखवाड़ों) में विभक्त हैं। शुक्ल पक्ष (उज्ज्वल अर्ध) अमावस्या से पूर्णिमा तक चलता है, जिसमें चन्द्रमा बढ़ते हुए तिथि 1 से 15 तक पूर्ण करता है। कृष्ण पक्ष (अन्धकार अर्ध) पूर्णिमा से अमावस्या तक चलता है, जिसमें चन्द्रमा घटते हुए पुनः तिथि 1 से 15 (अथवा 16 से 30) तक पूर्ण करता है। "शुक्ल" का अर्थ उज्ज्वल (चन्द्रमा बढ़ रहा) और "कृष्ण" का अर्थ अन्धकार (चन्द्रमा घट रहा) है।'
            : 'The 30 tithis are divided into two pakshas (fortnights). Shukla Paksha (the bright half) runs from Amavasya to Purnima, covering tithis 1 through 15 as the Moon waxes. Krishna Paksha (the dark half) runs from Purnima to Amavasya, covering tithis 1 through 15 again (sometimes numbered 16 through 30) as the Moon wanes. The word "Shukla" means bright (the Moon is growing), while "Krishna" means dark (the Moon is diminishing).'}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'तिथियों की अवधि भिन्न क्यों होती है' : 'Why Tithis Vary in Length'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'सौर दिवस के विपरीत जो लगभग 24 घण्टे स्थिर रहता है, एक तिथि लगभग 19 घण्टे से 26 घण्टे तक हो सकती है। यह भिन्नता इसलिए है क्योंकि चन्द्रमा पृथ्वी के चारों ओर दीर्घवृत्ताकार कक्षा में भ्रमण करता है। उपभू (निकटतम बिन्दु) पर चन्द्रमा लगभग 15.4 अंश प्रतिदिन चलता है; अपभू (दूरस्थ बिन्दु) पर वह मन्द होकर लगभग 11.8 अंश प्रतिदिन चलता है। जब चन्द्रमा तीव्र गति से होता है तो 12 अंश शीघ्र पूर्ण होते हैं और तिथि छोटी होती है; जब मन्दगति होता है तो तिथि दीर्घ होती है।'
            : 'Unlike the solar day which is a nearly constant 24 hours, a tithi can last anywhere from about 19 hours to about 26 hours. This variation arises because the Moon travels in an elliptical orbit around the Earth. At perigee (closest approach), the Moon moves at approximately 15.4 degrees per day; at apogee (farthest point), it slows to about 11.8 degrees per day. When the Moon is fast, it sweeps through 12 degrees of elongation quickly, producing a short tithi. When it is slow, covering 12 degrees takes much longer, producing a long tithi.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'तिथि की अवधारणा भारतीय खगोलशास्त्र में प्राचीनतम में से एक है, जिसका उल्लेख वेदांग ज्योतिष (लगभग 1400 ई.पू.) में मिलता है जो ज्ञात प्राचीनतम भारतीय खगोलीय ग्रन्थ है। सूर्य सिद्धान्त सूर्य और चन्द्रमा के स्पष्ट भोगांश से तिथि गणना के सटीक गणितीय सूत्र प्रदान करता है। बृहत् पाराशर होरा शास्त्र (BPHS) ने तिथियों को ज्योतिष के फलादेश ढाँचे में समाहित किया, प्रत्येक तिथि को अधिष्ठाता देवता और विशिष्ट फलादेश प्रदान किए।'
            : 'The concept of tithi is among the oldest in Indian astronomy, mentioned in the Vedanga Jyotisha (c. 1400 BCE), the earliest known Indian astronomical text. Surya Siddhanta, the landmark siddhantic text, provides precise mathematical formulas for computing tithi from the longitudes of the Sun and Moon. Brihat Parashara Hora Shastra (BPHS) integrates tithis into the predictive framework of Jyotish, assigning each tithi a ruling deity and specific significations for mundane and electional astrology.'}
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
          {isHi ? 'तिथि देवता, स्वभाव एवं शुभत्व' : 'Tithi Deities, Natures & Auspiciousness'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्रत्येक तिथि का एक अधिष्ठाता देवता होता है जो उसके मूल स्वभाव को प्रभावित करता है। प्रतिपदा (1ली) अग्नि द्वारा शासित, द्वितीया (2री) ब्रह्मा, तृतीया (3री) गौरी, चतुर्थी (4थी) गणपति, पंचमी (5वीं) नाग, षष्ठी (6ठी) कार्तिकेय, सप्तमी (7वीं) सूर्य, अष्टमी (8वीं) शिव, नवमी (9वीं) दुर्गा, दशमी (10वीं) यम, एकादशी (11वीं) विष्णु, द्वादशी (12वीं) हरि, त्रयोदशी (13वीं) कामदेव, चतुर्दशी (14वीं) शिव, तथा पूर्णिमा/अमावस्या (15वीं/30वीं) क्रमशः चन्द्र/पितरों द्वारा शासित है।'
            : 'Each tithi has a presiding deity who imparts its essential character. Pratipada (1st) is governed by Agni (fire), Dwitiya (2nd) by Brahma, Tritiya (3rd) by Gauri, Chaturthi (4th) by Ganapati, Panchami (5th) by Nagas, Shashthi (6th) by Kartikeya, Saptami (7th) by Surya, Ashtami (8th) by Shiva, Navami (9th) by Durga, Dashami (10th) by Yama, Ekadashi (11th) by Vishnu, Dwadashi (12th) by Hari, Trayodashi (13th) by Kamadeva, Chaturdashi (14th) by Shiva, and Purnima/Amavasya (15th/30th) by the Moon/Pitris respectively. These associations determine which activities are most favorable on each tithi.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? '30 तिथियाँ छह-छह के पाँच समूहों में वर्गीकृत हैं, प्रत्येक समूह का एक समान स्वभाव है। नन्दा (आनन्ददायक) में प्रत्येक पक्ष की 1ली, 6ठी और 11वीं तिथि आती है। भद्रा (शुभ) में 2री, 7वीं और 12वीं। जया (विजयी) में 3री, 8वीं और 13वीं। रिक्ता (शून्य) में 4थी, 9वीं और 14वीं। पूर्णा (सम्पूर्ण) में 5वीं, 10वीं और 15वीं। इनमें रिक्ता तिथियाँ (चतुर्थी, नवमी, चतुर्दशी) नये कार्यों के लिए सामान्यतः अशुभ मानी जाती हैं, जबकि नन्दा और भद्रा तिथियाँ अधिक अनुकूल हैं।'
            : 'The 30 tithis are classified into five groups of six, each group sharing a common nature (svabhava). The Nanda (joy-giving) group includes the 1st, 6th, and 11th tithis of each paksha. Bhadra (auspicious) includes the 2nd, 7th, and 12th. Jaya (victorious) includes the 3rd, 8th, and 13th. Rikta (empty/void) includes the 4th, 9th, and 14th. Purna (complete/full) includes the 5th, 10th, and 15th. Among these, Rikta tithis (Chaturthi, Navami, Chaturdashi) are generally considered inauspicious for initiating new activities, while Nanda and Bhadra tithis are widely favored.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण 1:</span> एक दम्पति विवाह तिथि चुनना चाहता है। द्वितीया (भद्रा समूह, ब्रह्मा शासित) और पंचमी (पूर्णा समूह) उत्तम विकल्प हैं। यदि दोनों शुक्ल पक्ष में अनुकूल नक्षत्र के साथ आएँ तो मुहूर्त अत्यन्त बलवान होता है। चतुर्थी या नवमी जैसी रिक्ता तिथियाँ विवाह हेतु पूर्णतया वर्जित हैं।</> : <><span className="text-gold-light font-medium">Example 1:</span> A couple wishes to choose a wedding date. Dwitiya (Bhadra group, ruled by Brahma the creator) and Panchami (Purna group) are excellent choices. If both fall in Shukla Paksha with a favorable nakshatra, the muhurta is exceptionally strong. Rikta tithis like Chaturthi or Navami would be avoided entirely for marriage.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण 2:</span> एकादशी (11वीं, नन्दा समूह, विष्णु शासित) प्रमुख उपवास तिथि है। भक्त ज्येष्ठ मास में निर्जला (जलरहित) एकादशी का पालन करते हैं। चूँकि एकादशी दोनों पक्षों में आती है, वर्ष में 24 एकादशियाँ होती हैं, प्रत्येक का अपना विशिष्ट महत्त्व और नाम है।</> : <><span className="text-gold-light font-medium">Example 2:</span> Ekadashi (11th, Nanda group, ruled by Vishnu) is the premier fasting tithi. Devotees observe Nirjala (waterless) Ekadashi in Jyeshtha month. Since Ekadashi occurs in both pakshas, there are 24 Ekadashis per year, each with unique significance and name.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;अमावस्या सदैव अशुभ और पूर्णिमा सदैव शुभ होती है।&quot; वास्तव में अमावस्या पितृ कर्म, तान्त्रिक साधना और गहन ध्यान के लिए अत्यन्त शुभ मानी जाती है। दीपावली जैसे अनेक शक्तिशाली त्योहार अमावस्या पर पड़ते हैं। इसी प्रकार पूर्णिमा सर्वत्र शुभ नहीं — गोपनीयता या एकान्तवास चाहने वाले कार्यों के लिए अमावस्या अधिक उपयुक्त है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Amavasya is always bad and Purnima is always good.&quot; In reality, Amavasya is considered highly auspicious for Pitru Karma (ancestral rites), tantric practices, and deep meditation. Many powerful festivals like Diwali fall on Amavasya. Similarly, Purnima is not universally positive — certain activities requiring secrecy or withdrawal are better on Amavasya.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'आधुनिक भारत में तिथि पंचांग का सर्वाधिक परामर्शित अंग बनी हुई है। विवाह तिथि, गृह प्रवेश, व्यापार आरम्भ और धार्मिक अनुष्ठान सभी तिथि के अनुसार नियोजित किये जाते हैं। हमारा अनुप्रयोग मीयस एल्गोरिदम पर आधारित सटीक चन्द्र-सूर्य कोणीय गणना से तिथि की गणना करता है, जो व्यावसायिक पंचांग मूल्यों से एक मिनट के भीतर सटीक है।'
            : 'Tithi remains the most consulted element of the Panchang in modern India. Wedding dates, housewarming ceremonies, business launches, and religious observances are all planned according to tithi. Our application computes tithis using precise Moon-Sun elongation calculations based on Meeus algorithms, achieving accuracy within one minute of professional ephemeris values.'}
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
          {isHi ? 'तिथि गणना विधि' : 'Tithi Calculation Method'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'वर्तमान तिथि गणना हेतु पहले चन्द्रमा और सूर्य के स्पष्ट (दृश्य) सायन भोगांश निकालें। फिर कोणीय दूरी ज्ञात करें: कोणीय दूरी = चन्द्र_भोगांश - सूर्य_भोगांश। यदि परिणाम ऋणात्मक हो तो 360 अंश जोड़ें। तिथि संख्या = floor(कोणीय दूरी / 12) + 1। उदाहरणार्थ, यदि चन्द्रमा 85 अंश पर और सूर्य 37 अंश पर है, तो कोणीय दूरी 48 अंश है, और तिथि = floor(48/12) + 1 = 5 अर्थात् पंचमी।'
            : 'To compute the current tithi, first determine the true (apparent) sidereal longitudes of the Moon and Sun. Then calculate the elongation: Elongation = Moon_longitude - Sun_longitude. If the result is negative, add 360 degrees. The tithi number is then: Tithi = floor(Elongation / 12) + 1. For example, if the Moon is at 85 degrees and the Sun at 37 degrees, the elongation is 48 degrees, and tithi = floor(48/12) + 1 = 5, which is Panchami.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'क्षय (छूटी हुई) तिथि तब होती है जब कोई तिथि दो क्रमागत सूर्योदयों के बीच आरम्भ और समाप्त हो जाती है, अर्थात् उस तिथि के दौरान कोई सूर्योदय नहीं होता। यह तब होता है जब चन्द्रमा अत्यन्त तीव्रगति (उपभू के निकट) से चल रहा हो। इसके विपरीत, अधिक (अतिरिक्त/दोहरी) तिथि तब होती है जब कोई तिथि तीन सूर्योदयों तक फैली हो क्योंकि चन्द्रमा मन्दगति (अपभू के निकट) से चल रहा हो, जिससे एक ही तिथि दो लगातार दिनों पर शासन करती है।'
            : 'A Kshaya (skipped) tithi occurs when a tithi begins and ends between two consecutive sunrises, meaning no sunrise falls during that tithi. This happens when the Moon is moving very fast (near perigee). Conversely, an Adhika (extra/repeated) tithi occurs when a tithi spans three sunrises because the Moon is moving slowly (near apogee), causing the same tithi to govern two consecutive days.'}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'सूर्योदय की तिथि एवं द्वि-तिथि नियम' : 'Tithi at Sunrise & the Dwi-Tithi Rule'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'हिन्दू पंचांग में स्थानीय सूर्योदय के क्षण जो तिथि चल रही होती है, वही उस दिन की अधिकृत तिथि होती है। भले ही कोई तिथि सूर्योदय के बाद केवल कुछ मिनट ही रहे और फिर बदल जाए, सूर्योदय पर उसकी वह संक्षिप्त उपस्थिति ही दिन का निर्धारण करती है। यह सूर्योदय-आधारित गणना सभी क्षेत्रीय पंचांगों में त्योहार तिथि निर्धारण का आधार है। द्वि-तिथि नियम विशिष्ट त्योहारों पर लागू होता है: यदि एक ही तिथि दो दिनों के सूर्योदय पर हो तो एकादशी हेतु दूसरा दिन और अन्य सभी तिथियों हेतु पहला दिन मान्य होता है।'
            : 'In the Hindu Panchang, the tithi prevailing at the moment of local sunrise determines that day\u2019s official tithi. Even if a tithi lasts only a few minutes past sunrise before transitioning, that brief presence at sunrise claims the day. This sunrise-based reckoning is the foundation of festival date calculation across all regional calendars.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">गणना:</span> सूर्योदय पर चन्द्र = 220.5 अंश, सूर्य = 15.3 अंश। कोणीय दूरी = 220.5 - 15.3 = 205.2 अंश। तिथि = floor(205.2 / 12) + 1 = floor(17.1) + 1 = 17 + 1 = 18। यह कृष्ण पक्ष तृतीया है (कृष्ण पक्ष की 3री तिथि: 15 + 3 = कुल 18वीं)।</> : <><span className="text-gold-light font-medium">Calculation:</span> At sunrise, Moon = 220.5 degrees, Sun = 15.3 degrees. Elongation = 220.5 - 15.3 = 205.2 degrees. Tithi = floor(205.2 / 12) + 1 = floor(17.1) + 1 = 17 + 1 = 18. This is Krishna Paksha Tritiya (the 3rd tithi of the dark half: 15 + 3 = 18th overall).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;क्षय तिथि का अर्थ है कि वह तिथि अस्तित्व में ही नहीं आई।&quot; क्षय का अर्थ मात्र इतना है कि वह तिथि दो सूर्योदयों के बीच आरम्भ और समाप्त हो गई, अतः कोई भी दिन उसके नाम पर नहीं रखा जाता। खगोलीय रूप से वह तिथि अवश्य घटित हुई — वह इतनी लघु थी कि किसी सूर्योदय पर उपस्थित न रह सकी। क्षय तिथियाँ दुर्लभ (वर्ष में कुछ ही) होती हैं और उनके त्योहार दायित्व सामान्यतः निकटवर्ती तिथि पर स्थानान्तरित हो जाते हैं।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;A Kshaya tithi means the tithi ceases to exist.&quot; Kshaya simply means that tithi started and ended between two sunrises, so no day is named after it. The tithi still occurred astronomically — it was just too short to be present at any sunrise. Kshaya tithis are uncommon (a few per year) and their festival obligations typically shift to the adjacent tithi.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'किसी भी डिजिटल पंचांग के लिए सटीक तिथि गणना अनिवार्य है। हमारा अनुप्रयोग मीयस एल्गोरिदम द्वारा सूर्य और चन्द्रमा के सटीक भोगांश की गणना करता है, फिर ऊपर वर्णित कोणीय दूरी सूत्र से तिथि निकालता है। द्वि-तिथि नियम प्रोग्रामेटिक रूप से लागू किया गया है ताकि त्योहार सही ग्रेगोरियन तारीख पर निर्धारित हों, जो दृक् पंचांग से एक मिनट के भीतर मेल खाता है।'
            : 'Accurate tithi computation is essential for any digital Panchang. Our application uses the Meeus algorithm to compute precise Sun and Moon longitudes, then derives tithis using the elongation formula described above. The dwi-tithi rule is programmatically implemented to correctly assign festivals to the right Gregorian date, matching results from Drik Panchang to within one minute.'}
        </p>
      </section>
    </div>
  );
}

export default function Module5_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
