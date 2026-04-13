'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/20-4.json';

const META: ModuleMeta = {
  id: 'mod_20_4', phase: 7, topic: 'KP System', moduleNumber: '20.4',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 13,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q20_4_01', type: 'mcq',
    question: {
      en: 'How many ruling planets does KP identify at the moment of judgment?',
      hi: 'केपी निर्णय के क्षण पर कितने शासक ग्रह पहचानता है?',
    },
    options: [
      { en: '3', hi: '3', sa: '3', mai: '3', mr: '3', ta: '3', te: '3', bn: '3', kn: '3', gu: '3' },
      { en: '5', hi: '5', sa: '5', mai: '5', mr: '5', ta: '5', te: '5', bn: '5', kn: '5', gu: '5' },
      { en: '7', hi: '7', sa: '7', mai: '7', mr: '7', ta: '7', te: '7', bn: '7', kn: '7', gu: '7' },
      { en: '9', hi: '9', sa: '9', mai: '9', mr: '9', ta: '9', te: '9', bn: '9', kn: '9', gu: '9' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'KP identifies 5 ruling planets: Moon\'s sign lord, Moon\'s star lord, Lagna (Ascendant) sign lord, Lagna star lord, and the Day lord (planet ruling the weekday).',
      hi: 'केपी 5 शासक ग्रह पहचानता है: चन्द्र का राशि स्वामी, चन्द्र का नक्षत्र स्वामी, लग्न का राशि स्वामी, लग्न का नक्षत्र स्वामी, और दिन स्वामी (सप्ताह के दिन का शासक ग्रह)।',
    },
  },
  {
    id: 'q20_4_02', type: 'mcq',
    question: {
      en: 'Which of these is NOT one of the five KP ruling planets?',
      hi: 'इनमें से कौन पाँच केपी शासक ग्रहों में से एक नहीं है?',
    },
    options: [
      { en: 'Moon\'s sign lord', hi: 'चन्द्र का राशि स्वामी' },
      { en: 'Lagna star lord', hi: 'लग्न का नक्षत्र स्वामी', sa: 'लग्न का नक्षत्र स्वामी', mai: 'लग्न का नक्षत्र स्वामी', mr: 'लग्न का नक्षत्र स्वामी', ta: 'Lagna star lord', te: 'Lagna star lord', bn: 'Lagna star lord', kn: 'Lagna star lord', gu: 'Lagna star lord' },
      { en: 'Sun\'s sign lord', hi: 'सूर्य का राशि स्वामी' },
      { en: 'Day lord', hi: 'दिन स्वामी', sa: 'दिन स्वामी', mai: 'दिन स्वामी', mr: 'दिन स्वामी', ta: 'Day lord', te: 'Day lord', bn: 'Day lord', kn: 'Day lord', gu: 'Day lord' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Sun\'s sign lord is NOT one of the five ruling planets. The five are: Moon\'s sign lord, Moon\'s star lord, Lagna sign lord, Lagna star lord, and Day lord. The Moon and Lagna are used because they change fastest.',
      hi: 'सूर्य का राशि स्वामी पाँच शासक ग्रहों में से एक नहीं है। पाँच हैं: चन्द्र राशि स्वामी, चन्द्र नक्षत्र स्वामी, लग्न राशि स्वामी, लग्न नक्षत्र स्वामी, और दिन स्वामी। चन्द्र और लग्न का उपयोग इसलिए होता है क्योंकि ये सबसे तेज़ बदलते हैं।',
    },
  },
  {
    id: 'q20_4_03', type: 'true_false',
    question: {
      en: 'Ruling planets are derived from the birth chart, not from the moment of analysis.',
      hi: 'शासक ग्रह जन्म कुण्डली से प्राप्त होते हैं, विश्लेषण के क्षण से नहीं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Ruling planets are calculated for the CURRENT moment (time of judgment/query), not from the birth chart. This is what makes them a real-time cosmic pointer — the universe at this moment indicates when the event will occur.',
      hi: 'असत्य। शासक ग्रह वर्तमान क्षण (निर्णय/प्रश्न के समय) के लिए गणित किए जाते हैं, जन्म कुण्डली से नहीं। यही उन्हें वास्तविक समय का ब्रह्माण्डीय संकेतक बनाता है — इस क्षण ब्रह्माण्ड बताता है कि घटना कब घटित होगी।',
    },
  },
  {
    id: 'q20_4_04', type: 'mcq',
    question: {
      en: 'What is the primary use of ruling planets in KP?',
      hi: 'केपी में शासक ग्रहों का प्राथमिक उपयोग क्या है?',
    },
    options: [
      { en: 'To determine the native\'s personality', hi: 'जातक के व्यक्तित्व का निर्धारण' },
      { en: 'To identify WHEN a predicted event will manifest', hi: 'यह पहचानना कि भविष्यवाणित घटना कब प्रकट होगी', sa: 'यह पहचानना कि भविष्यवाणित घटना कब प्रकट होगी', mai: 'यह पहचानना कि भविष्यवाणित घटना कब प्रकट होगी', mr: 'यह पहचानना कि भविष्यवाणित घटना कब प्रकट होगी', ta: 'To identify WHEN a predicted event will manifest', te: 'To identify WHEN a predicted event will manifest', bn: 'To identify WHEN a predicted event will manifest', kn: 'To identify WHEN a predicted event will manifest', gu: 'To identify WHEN a predicted event will manifest' },
      { en: 'To calculate the birth chart', hi: 'जन्म कुण्डली की गणना', sa: 'जन्म कुण्डली की गणना', mai: 'जन्म कुण्डली की गणना', mr: 'जन्म कुण्डली की गणना', ta: 'To calculate the birth chart', te: 'To calculate the birth chart', bn: 'To calculate the birth chart', kn: 'To calculate the birth chart', gu: 'To calculate the birth chart' },
      { en: 'To find compatible partners', hi: 'अनुकूल साथी खोजना', sa: 'अनुकूल साथी खोजना', mai: 'अनुकूल साथी खोजना', mr: 'अनुकूल साथी खोजना', ta: 'To find compatible partners', te: 'To find compatible partners', bn: 'To find compatible partners', kn: 'To find compatible partners', gu: 'To find compatible partners' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Ruling planets are primarily used for TIMING — they indicate which dasha/bhukti/antara sequence will deliver the predicted event. By matching ruling planets with the significator table, KP pinpoints the timing window.',
      hi: 'शासक ग्रहों का प्राथमिक उपयोग समय-निर्धारण है — ये बताते हैं कि कौन-सा दशा/भुक्ति/अन्तरा क्रम भविष्यवाणित घटना लाएगा। शासक ग्रहों को कारक सारणी से मिलाकर केपी समय खिड़की को इंगित करता है।',
    },
  },
  {
    id: 'q20_4_05', type: 'true_false',
    question: {
      en: 'If 3 or more ruling planets match the significators of the queried event, KP considers the prediction high-confidence.',
      hi: 'यदि 3 या अधिक शासक ग्रह पूछी गई घटना के कारकों से मेल खाते हैं, तो केपी फलादेश को उच्च-विश्वसनीय मानता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. When 3+ ruling planets at the moment of judgment also appear as strong significators of the event\'s houses in the birth chart, it provides strong confirmation that the event will occur, and these planets\' dasha periods indicate the timing.',
      hi: 'सत्य। जब निर्णय के क्षण पर 3 या अधिक शासक ग्रह जन्म कुण्डली में घटना के भावों के प्रबल कारक भी हों, तो यह दृढ़ पुष्टि प्रदान करता है कि घटना घटित होगी, और इन ग्रहों की दशा अवधि समय बताती है।',
    },
  },
  {
    id: 'q20_4_06', type: 'mcq',
    question: {
      en: 'Which planet rules Tuesday in the KP weekday lord system?',
      hi: 'केपी सप्ताह दिन स्वामी पद्धति में मंगलवार का शासक कौन-सा ग्रह है?',
    },
    options: [
      { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'Sun', te: 'Sun', bn: 'Sun', kn: 'Sun', gu: 'Sun' },
      { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'Moon', te: 'Moon', bn: 'Moon', kn: 'Moon', gu: 'Moon' },
      { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'Mars', te: 'Mars', bn: 'Mars', kn: 'Mars', gu: 'Mars' },
      { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'Mercury', te: 'Mercury', bn: 'Mercury', kn: 'Mercury', gu: 'Mercury' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Mars rules Tuesday (Mangalvar). The weekday lords follow the standard Vedic assignment: Sun=Sunday, Moon=Monday, Mars=Tuesday, Mercury=Wednesday, Jupiter=Thursday, Venus=Friday, Saturn=Saturday.',
      hi: 'मंगल मंगलवार का शासक है। सप्ताह दिन स्वामी मानक वैदिक आवंटन का पालन करते हैं: सूर्य=रविवार, चन्द्र=सोमवार, मंगल=मंगलवार, बुध=बुधवार, गुरु=गुरुवार, शुक्र=शुक्रवार, शनि=शनिवार।',
    },
  },
  {
    id: 'q20_4_07', type: 'mcq',
    question: {
      en: 'How does KP use ruling planets together with the significator table?',
      hi: 'केपी शासक ग्रहों को कारक सारणी के साथ कैसे उपयोग करता है?',
    },
    options: [
      { en: 'Ruling planets replace the significator table', hi: 'शासक ग्रह कारक सारणी को प्रतिस्थापित करते हैं', sa: 'शासक ग्रह कारक सारणी को प्रतिस्थापित करते हैं', mai: 'शासक ग्रह कारक सारणी को प्रतिस्थापित करते हैं', mr: 'शासक ग्रह कारक सारणी को प्रतिस्थापित करते हैं', ta: 'Ruling planets replace the significator table', te: 'Ruling planets replace the significator table', bn: 'Ruling planets replace the significator table', kn: 'Ruling planets replace the significator table', gu: 'Ruling planets replace the significator table' },
      { en: 'Ruling planets confirm and narrow down the timing from the significator table', hi: 'शासक ग्रह कारक सारणी से समय की पुष्टि और सीमित करते हैं', sa: 'शासक ग्रह कारक सारणी से समय की पुष्टि और सीमित करते हैं', mai: 'शासक ग्रह कारक सारणी से समय की पुष्टि और सीमित करते हैं', mr: 'शासक ग्रह कारक सारणी से समय की पुष्टि और सीमित करते हैं', ta: 'Ruling planets confirm and narrow down the timing from the significator table', te: 'Ruling planets confirm and narrow down the timing from the significator table', bn: 'Ruling planets confirm and narrow down the timing from the significator table', kn: 'Ruling planets confirm and narrow down the timing from the significator table', gu: 'Ruling planets confirm and narrow down the timing from the significator table' },
      { en: 'Only ruling planets are used, the significator table is ignored', hi: 'केवल शासक ग्रह प्रयुक्त होते हैं, कारक सारणी की उपेक्षा होती है', sa: 'केवल शासक ग्रह प्रयुक्त होते हैं, कारक सारणी की उपेक्षा होती है', mai: 'केवल शासक ग्रह प्रयुक्त होते हैं, कारक सारणी की उपेक्षा होती है', mr: 'केवल शासक ग्रह प्रयुक्त होते हैं, कारक सारणी की उपेक्षा होती है', ta: 'Only ruling planets are used, the significator table is ignored', te: 'Only ruling planets are used, the significator table is ignored', bn: 'Only ruling planets are used, the significator table is ignored', kn: 'Only ruling planets are used, the significator table is ignored', gu: 'Only ruling planets are used, the significator table is ignored' },
      { en: 'The significator table replaces ruling planets', hi: 'कारक सारणी शासक ग्रहों को प्रतिस्थापित करती है', sa: 'कारक सारणी शासक ग्रहों को प्रतिस्थापित करती है', mai: 'कारक सारणी शासक ग्रहों को प्रतिस्थापित करती है', mr: 'कारक सारणी शासक ग्रहों को प्रतिस्थापित करती है', ta: 'The significator table replaces ruling planets', te: 'The significator table replaces ruling planets', bn: 'The significator table replaces ruling planets', kn: 'The significator table replaces ruling planets', gu: 'The significator table replaces ruling planets' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The significator table identifies WHICH planets can deliver an event. Ruling planets confirm WHICH of those significators will actually be active and WHEN. The intersection of both systems narrows the prediction to a specific dasha-bhukti-antara window.',
      hi: 'कारक सारणी पहचानती है कि कौन-से ग्रह घटना दे सकते हैं। शासक ग्रह पुष्टि करते हैं कि उन कारकों में से कौन वास्तव में सक्रिय होगा और कब। दोनों पद्धतियों का प्रतिच्छेदन फलादेश को एक विशिष्ट दशा-भुक्ति-अन्तरा खिड़की तक सीमित करता है।',
    },
  },
  {
    id: 'q20_4_08', type: 'true_false',
    question: {
      en: 'Rahu and Ketu can serve as ruling planets by acting as agents of the sign lords they are placed in.',
      hi: 'राहु और केतु जिस राशि स्वामी में स्थित हैं उसके प्रतिनिधि बनकर शासक ग्रह की भूमिका निभा सकते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Since Rahu and Ketu own no signs, they act as agents of the sign lord they occupy. If Rahu is in Taurus (Venus-ruled) and Venus is a ruling planet, Rahu can substitute for Venus in the ruling planet list.',
      hi: 'सत्य। चूँकि राहु और केतु किसी राशि के स्वामी नहीं हैं, वे जिस राशि में बैठे हैं उसके स्वामी के प्रतिनिधि बनते हैं। यदि राहु वृषभ (शुक्र-शासित) में है और शुक्र शासक ग्रह है, तो राहु शासक ग्रह सूची में शुक्र का प्रतिनिधि बन सकता है।',
    },
  },
  {
    id: 'q20_4_09', type: 'mcq',
    question: {
      en: 'What additional technique does KP use after dasha timing to further refine when an event will occur?',
      hi: 'घटना कब होगी इसे और परिशोधित करने के लिए केपी दशा समय के बाद कौन-सी अतिरिक्त तकनीक उपयोग करता है?',
    },
    options: [
      { en: 'Solar return chart', hi: 'सौर प्रत्यावर्तन कुण्डली', sa: 'सौर प्रत्यावर्तन कुण्डली', mai: 'सौर प्रत्यावर्तन कुण्डली', mr: 'सौर प्रत्यावर्तन कुण्डली', ta: 'Solar return chart', te: 'Solar return chart', bn: 'Solar return chart', kn: 'Solar return chart', gu: 'Solar return chart' },
      { en: 'Transit of ruling planets over cusp sub-lords', hi: 'सन्धि उप-स्वामियों पर शासक ग्रहों का गोचर', sa: 'सन्धि उप-स्वामियों पर शासक ग्रहों का गोचर', mai: 'सन्धि उप-स्वामियों पर शासक ग्रहों का गोचर', mr: 'सन्धि उप-स्वामियों पर शासक ग्रहों का गोचर', ta: 'Transit of ruling planets over cusp sub-lords', te: 'Transit of ruling planets over cusp sub-lords', bn: 'Transit of ruling planets over cusp sub-lords', kn: 'Transit of ruling planets over cusp sub-lords', gu: 'Transit of ruling planets over cusp sub-lords' },
      { en: 'Progressed Moon technique', hi: 'प्रगत चन्द्र तकनीक', sa: 'प्रगत चन्द्र तकनीक', mai: 'प्रगत चन्द्र तकनीक', mr: 'प्रगत चन्द्र तकनीक', ta: 'Progressed Moon technique', te: 'Progressed Moon technique', bn: 'Progressed Moon technique', kn: 'Progressed Moon technique', gu: 'Progressed Moon technique' },
      { en: 'Eclipse analysis', hi: 'ग्रहण विश्लेषण', sa: 'ग्रहण विश्लेषण', mai: 'ग्रहण विश्लेषण', mr: 'ग्रहण विश्लेषण', ta: 'Eclipse analysis', te: 'Eclipse analysis', bn: 'Eclipse analysis', kn: 'Eclipse analysis', gu: 'Eclipse analysis' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'After identifying the dasha period, KP uses transits of ruling planets over the relevant cusp sub-lord positions to pinpoint the exact date. When multiple ruling planets simultaneously transit sensitive points, the event manifests.',
      hi: 'दशा अवधि पहचानने के बाद, केपी सम्बन्धित सन्धि उप-स्वामी स्थितियों पर शासक ग्रहों के गोचर का उपयोग सटीक तिथि इंगित करने के लिए करता है। जब अनेक शासक ग्रह एक साथ संवेदनशील बिन्दुओं पर गोचर करें, तब घटना प्रकट होती है।',
    },
  },
  {
    id: 'q20_4_10', type: 'mcq',
    question: {
      en: 'In the worked marriage example, if ruling planets at query time are Venus, Moon, Jupiter, Mercury, and Saturn, and Venus signifies houses 2, 7, 11 — what is the most likely marriage period?',
      hi: 'विवाह के उदाहरण में, यदि प्रश्न समय पर शासक ग्रह शुक्र, चन्द्र, गुरु, बुध और शनि हैं, और शुक्र भाव 2, 7, 11 का कारक है — सर्वाधिक सम्भावित विवाह काल क्या है?',
    },
    options: [
      { en: 'Sun-Mars period', hi: 'सूर्य-मंगल काल', sa: 'सूर्य-मंगल काल', mai: 'सूर्य-मंगल काल', mr: 'सूर्य-मंगल काल', ta: 'Sun-Mars period', te: 'Sun-Mars period', bn: 'Sun-Mars period', kn: 'Sun-Mars period', gu: 'Sun-Mars period' },
      { en: 'Venus-Jupiter or Jupiter-Venus period', hi: 'शुक्र-गुरु या गुरु-शुक्र काल', sa: 'शुक्र-गुरु या गुरु-शुक्र काल', mai: 'शुक्र-गुरु या गुरु-शुक्र काल', mr: 'शुक्र-गुरु या गुरु-शुक्र काल', ta: 'Venus-Jupiter or Jupiter-Venus period', te: 'Venus-Jupiter or Jupiter-Venus period', bn: 'Venus-Jupiter or Jupiter-Venus period', kn: 'Venus-Jupiter or Jupiter-Venus period', gu: 'Venus-Jupiter or Jupiter-Venus period' },
      { en: 'Ketu-Rahu period', hi: 'केतु-राहु काल', sa: 'केतु-राहु काल', mai: 'केतु-राहु काल', mr: 'केतु-राहु काल', ta: 'Ketu-Rahu period', te: 'Ketu-Rahu period', bn: 'Ketu-Rahu period', kn: 'Ketu-Rahu period', gu: 'Ketu-Rahu period' },
      { en: 'Saturn-Saturn period', hi: 'शनि-शनि काल', sa: 'शनि-शनि काल', mai: 'शनि-शनि काल', mr: 'शनि-शनि काल', ta: 'Saturn-Saturn period', te: 'Saturn-Saturn period', bn: 'Saturn-Saturn period', kn: 'Saturn-Saturn period', gu: 'Saturn-Saturn period' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Venus is a ruling planet AND a strong significator of marriage houses (2, 7, 11). Jupiter is also a ruling planet and likely signifies 11th house. The Venus-Jupiter or Jupiter-Venus dasha/bhukti combination is the strongest timing match.',
      hi: 'शुक्र शासक ग्रह भी है और विवाह भावों (2, 7, 11) का प्रबल कारक भी। गुरु भी शासक ग्रह है और सम्भवतः एकादश भाव का कारक। शुक्र-गुरु या गुरु-शुक्र दशा/भुक्ति संयोजन सबसे प्रबल समय मिलान है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'शासक ग्रह क्या हैं?' : 'What Are Ruling Planets?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>शासक ग्रह ज्योतिष के सबसे महत्त्वपूर्ण प्रश्न — भविष्यवाणित घटना वास्तव में कब होगी — का केपी का सुन्दर समाधान हैं। ठीक उस क्षण जब ज्योतिषी कुण्डली विश्लेषण हेतु बैठता है या जब प्रश्नकर्ता प्रश्न पूछता है, ब्रह्माण्ड पाँच संकेतक — पाँच शासक ग्रह — प्रदान करता है जो बताते हैं कि कौन-सी ग्रह अवधि घटना लाएगी। ये शासक ग्रह वर्तमान आकाश से प्राप्त होते हैं, जन्म कुण्डली से नहीं, जिससे ये वास्तविक समय का दिव्य संकेत बनते हैं।</>
            : <>Ruling planets are KP&apos;s elegant solution to the most important question in astrology: WHEN will a predicted event actually happen? At the exact moment when an astrologer sits down to analyze a chart or when a querent asks a question, the cosmos provides five pointers — five ruling planets — that indicate which planetary periods will deliver the event. These ruling planets are derived from the current sky, not from the birth chart, making them a real-time divine signal.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>पाँच शासक ग्रह हैं: (1) चन्द्र का राशि स्वामी — वर्तमान में चन्द्रमा जिस राशि में गोचर कर रहा है उसका शासक ग्रह। (2) चन्द्र का नक्षत्र स्वामी — वर्तमान में चन्द्रमा जिस नक्षत्र में है उसका शासक ग्रह। (3) लग्न का राशि स्वामी — उस क्षण पूर्वी क्षितिज पर उदित राशि का शासक ग्रह। (4) लग्न का नक्षत्र स्वामी — वर्तमान लग्न अंश के नक्षत्र का शासक ग्रह। (5) दिन स्वामी — वर्तमान सप्ताह दिन का शासक ग्रह (रविवार को सूर्य, सोमवार को चन्द्र, आदि)।</>
            : <>The five ruling planets are: (1) Moon&apos;s Sign Lord — the planet ruling the rashi the Moon is currently transiting. (2) Moon&apos;s Star Lord — the planet ruling the nakshatra the Moon is currently in. (3) Lagna Sign Lord — the planet ruling the rashi rising on the eastern horizon at that moment. (4) Lagna Star Lord — the planet ruling the nakshatra of the current Ascendant degree. (5) Day Lord — the planet that rules the current weekday (Sun for Sunday, Moon for Monday, etc.).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'प्रश्न के क्षण में उसका उत्तर निहित है यह विचार वैदिक ज्योतिष की प्राचीन प्रश्न (होरेरी) परम्परा में निहित है। प्रश्न मार्ग और ताजिक नीलकण्ठी जैसे ग्रन्थ बल देते हैं कि प्रश्न के क्षण की कुण्डली परिणाम की सम्पूर्ण सूचना रखती है। कृष्णमूर्ति ने इसे शासक ग्रह अवधारणा में परिशोधित किया — प्रश्न क्षण से पाँच प्रमुख ग्रह संकेतक निकालकर उन्हें जन्म कुण्डली से दशा समय को सीमित करने के फिल्टर के रूप में उपयोग करना। होरेरी सिद्धान्तों का जन्म दशा विश्लेषण के साथ यह संश्लेषण विशिष्ट रूप से केपी है।'
            : 'The idea that the moment of a question carries its own answer is rooted in the ancient Prashna (horary) tradition of Vedic astrology. Texts like Prashna Marga and Tajika Neelakanthi emphasize that the chart cast for the moment of query contains all information about the outcome. Krishnamurti refined this into the ruling planets concept — extracting five key planetary pointers from the query moment and using them as a filter to narrow down dasha timing from the birth chart. This synthesis of horary principles with natal dasha analysis is uniquely KP.'}
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
          {isHi ? 'समय-निर्धारण हेतु शासक ग्रहों का उपयोग' : 'Using Ruling Planets for Timing'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्रक्रिया तीन चरणों में कार्य करती है। पहला, वर्तमान क्षण (जब आप प्रश्न विश्लेषण हेतु बैठते हैं) की कुण्डली बनाएँ और पाँच शासक ग्रह गणित करें। दूसरा, इन शासक ग्रहों की जन्म कुण्डली की कारक सारणी से तुलना करें। ज्ञात करें कि कौन-से शासक ग्रह सम्बन्धित घटना भावों के कारक भी हैं। तीसरा, जिस दशा/भुक्ति/अन्तरा क्रम में सर्वाधिक शासक-ग्रह-कारक मिलान हों वह घटना की समय खिड़की है।'
            : 'The process works in three steps. First, cast a chart for the current moment (when you sit down to analyze the question) and compute the five ruling planets. Second, compare these ruling planets against the significator table from the birth chart. Find which ruling planets are also significators of the relevant event houses. Third, the dasha/bhukti/antara sequence that involves the most ruling-planet-significator matches is the timing window for the event.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          If a ruling planet appears multiple times (e.g., it is both the Moon&apos;s star lord and the Lagna sign lord), it carries extra weight. If 3 or more of the 5 ruling planets also signify the event&apos;s houses, the prediction carries high confidence. If fewer than 2 match, the astrologer may need to wait for a more favorable moment to re-analyze, or the event may be denied.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example'}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={isHi ? 'उदाहरण कुण्डली' : 'Example Chart'} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Query: &quot;When will I get married?&quot;</span> Analysis moment: Tuesday at 10:15 AM. Moon at 22 degrees Taurus (Rohini nakshatra). Ascendant at 8 degrees Cancer (Pushya nakshatra). Ruling planets: (1) Moon&apos;s sign lord = Venus (Taurus). (2) Moon&apos;s star lord = Moon (Rohini). (3) Lagna sign lord = Moon (Cancer). (4) Lagna star lord = Saturn (Pushya). (5) Day lord = Mars (Tuesday). Ruling planets: Venus, Moon (repeated), Saturn, Mars.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">प्रश्न: &quot;मेरा विवाह कब होगा?&quot;</span> विश्लेषण क्षण: मंगलवार प्रातः 10:15। चन्द्रमा 22 अंश वृषभ (रोहिणी नक्षत्र)। लग्न 8 अंश कर्क (पुष्य नक्षत्र)। शासक ग्रह: (1) चन्द्र राशि स्वामी = शुक्र (वृषभ)। (2) चन्द्र नक्षत्र स्वामी = चन्द्र (रोहिणी)। (3) लग्न राशि स्वामी = चन्द्र (कर्क)। (4) लग्न नक्षत्र स्वामी = शनि (पुष्य)। (5) दिन स्वामी = मंगल (मंगलवार)। जन्म कुण्डली से: शुक्र सप्तम (स्तर 1) और द्वितीय (स्तर 3) का कारक। विवाह काल: शुक्र-चन्द्र या चन्द्र-शुक्र दशा/भुक्ति। शुक्र शासक ग्रह और सप्तम का स्तर 1 कारक दोनों = सर्वोच्च विश्वास।</>
            : <><span className="text-gold-light font-medium">Cross-check with birth chart significators:</span> From the birth chart significator table, Venus signifies 7th house (Level 1 — occupies 7th) and 2nd house (Level 3 — owns Taurus on 2nd cusp). Jupiter signifies 11th house (Level 2 — in star of 11th occupant). Venus and Moon are both ruling planets AND strong marriage significators. Marriage timing: Venus-Moon or Moon-Venus dasha/bhukti period. Since Venus repeats as ruling planet and is Level 1 significator of 7th = highest confidence.</>}
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
          {isHi ? 'गोचर द्वारा परिशोधन' : 'Refining with Transits'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>दशा/भुक्ति अवधि पहचान लेने के बाद, केपी सटीक तिथि इंगित करने के लिए एक अन्तिम तकनीक उपयोग करता है: सम्बन्धित सन्धि उप-स्वामी स्थितियों पर शासक ग्रहों का गोचर। घटना तब प्रकट होती है जब एक या अधिक शासक ग्रह सम्बन्धित भाव सन्धि उप-स्वामी के नक्षत्र या उप पर गोचर करें। विवाह के लिए, पहचानी गई दशा अवधि के दौरान ट्रैक करें कि शुक्र (या सबसे प्रबल विवाह कारक) कब सप्तम सन्धि उप-स्वामी की नक्षत्र स्थिति पर गोचर करता है।</>
            : <>Once the dasha/bhukti period is identified, KP uses one final technique to pinpoint the exact date: transit of ruling planets over the relevant cusp sub-lord positions. The event manifests when one or more ruling planets transit over the star or sub of the relevant house cusp sub-lord. For marriage, track when Venus (or the strongest marriage significator) transits over the 7th cusp sub-lord&apos;s nakshatra position during the identified dasha period.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          This three-layer approach — significator table (what), ruling planets (who/when at dasha level), and transits (when at date level) — is what gives KP its reputation for remarkably precise event timing. While no system is infallible, experienced KP practitioners report timing accuracy within weeks, sometimes days, for major life events.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;शासक ग्रह अकेले जन्म कुण्डली के बिना घटनाओं की भविष्यवाणी कर सकते हैं।&quot; यह गलत है। शासक ग्रह समय-निर्धारण का फिल्टर हैं, स्वतन्त्र भविष्यवाणी पद्धति नहीं। आपको अभी भी जन्म कुण्डली की कारक सारणी चाहिए यह जानने के लिए कि कौन-सी घटनाएँ वादित हैं। शासक ग्रह केवल बताते हैं कि सम्भावित दशा अवधियों में से कब घटना साकार होगी। जन्म कुण्डली के बिना, शासक ग्रह ऐसे संकेतक हैं जिनके पास संकेत करने को कुछ नहीं।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Ruling planets alone can predict events without a birth chart.&quot; This is incorrect. Ruling planets are a TIMING FILTER, not a standalone prediction system. You still need the birth chart&apos;s significator table to know WHAT events are promised. Ruling planets only tell you WHEN among the possible dasha periods the event will materialize. Without the birth chart, ruling planets are pointers with nothing to point to.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>शासक ग्रह तकनीक ने केपी को विशेष रूप से जीवन्त परामर्श सत्रों में लोकप्रिय बनाया है। जब ग्राहक पूछता है &quot;मुझे नौकरी कब मिलेगी?&quot;, ज्योतिषी उसी क्षण के शासक ग्रह गणित करता है, जन्म कुण्डली कारकों से क्रॉस-रेफरेंस करता है, और प्रायः एक विशिष्ट माह या सप्ताह तक बता सकता है। हमारा केपी सिस्टम उपकरण शासक ग्रहों की वास्तविक समय में गणना करता है, किसी भी पूछी गई घटना के लिए जन्म कुण्डली की कारक सारणी से उनका मिलान प्रतिशत दिखाता है — यह शक्तिशाली तकनीक प्रत्येक उपयोगकर्ता की उँगलियों पर लाते हुए।</>
            : <>The ruling planets technique has made KP especially popular for live consultation sessions. When a client asks &quot;When will I get a job?&quot;, the astrologer computes ruling planets for that exact moment, cross-references with the birth chart significators, and can often give a specific month or even week. Our KP System tool computes ruling planets in real-time, showing their match percentage with the birth chart&apos;s significator table for any queried event — bringing this powerful technique to every user&apos;s fingertips.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module20_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
