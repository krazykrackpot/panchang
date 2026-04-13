'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_10_3', phase: 3, topic: 'Vargas', moduleNumber: '10.3',
  title: { en: 'Dasamsha & Other Key Vargas (D10, D7, D12)', hi: 'दशांश एवं अन्य प्रमुख वर्ग (D10, D7, D12)', sa: 'दशांश एवं अन्य प्रमुख वर्ग (D10, D7, D12)', mai: 'दशांश एवं अन्य प्रमुख वर्ग (D10, D7, D12)', mr: 'दशांश एवं अन्य प्रमुख वर्ग (D10, D7, D12)', ta: 'Dasamsha & Other Key Vargas (D10, D7, D12)', te: 'Dasamsha & Other Key Vargas (D10, D7, D12)', bn: 'Dasamsha & Other Key Vargas (D10, D7, D12)', kn: 'Dasamsha & Other Key Vargas (D10, D7, D12)', gu: 'Dasamsha & Other Key Vargas (D10, D7, D12)' },
  subtitle: {
    en: 'Career through D10, children through D7, parents through D12 — each varga illuminates a distinct life domain',
    hi: 'D10 से व्यवसाय, D7 से सन्तान, D12 से माता-पिता — प्रत्येक वर्ग एक विशिष्ट जीवन क्षेत्र को प्रकाशित करता है',
  },
  estimatedMinutes: 17,
  crossRefs: [
    { label: { en: 'Module 10-1: Varga Charts Overview', hi: 'मॉड्यूल 10-1: वर्ग कुण्डली अवलोकन', sa: 'मॉड्यूल 10-1: वर्ग कुण्डली अवलोकन', mai: 'मॉड्यूल 10-1: वर्ग कुण्डली अवलोकन', mr: 'मॉड्यूल 10-1: वर्ग कुण्डली अवलोकन', ta: 'Module 10-1: Varga Charts Overview', te: 'Module 10-1: Varga Charts Overview', bn: 'Module 10-1: Varga Charts Overview', kn: 'Module 10-1: Varga Charts Overview', gu: 'Module 10-1: Varga Charts Overview' }, href: '/learn/modules/10-1' },
    { label: { en: 'Module 10-2: Navamsha Deep Dive', hi: 'मॉड्यूल 10-2: नवांश गहन अध्ययन', sa: 'मॉड्यूल 10-2: नवांश गहन अध्ययन', mai: 'मॉड्यूल 10-2: नवांश गहन अध्ययन', mr: 'मॉड्यूल 10-2: नवांश गहन अध्ययन', ta: 'Module 10-2: Navamsha Deep Dive', te: 'Module 10-2: Navamsha Deep Dive', bn: 'Module 10-2: Navamsha Deep Dive', kn: 'Module 10-2: Navamsha Deep Dive', gu: 'Module 10-2: Navamsha Deep Dive' }, href: '/learn/modules/10-2' },
    { label: { en: 'Vargas Reference', hi: 'वर्ग सन्दर्भ', sa: 'वर्ग सन्दर्भ', mai: 'वर्ग सन्दर्भ', mr: 'वर्ग सन्दर्भ', ta: 'Vargas Reference', te: 'Vargas Reference', bn: 'Vargas Reference', kn: 'Vargas Reference', gu: 'Vargas Reference' }, href: '/learn/vargas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q10_3_01', type: 'mcq',
    question: {
      en: 'Each sign is divided into how many parts to create the Dasamsha (D10)?',
      hi: 'दशांश (D10) बनाने के लिए प्रत्येक राशि को कितने भागों में विभाजित किया जाता है?',
    },
    options: [
      { en: '7 parts of 4°17\'', hi: '7 भाग, प्रत्येक 4°17\' का' },
      { en: '9 parts of 3°20\'', hi: '9 भाग, प्रत्येक 3°20\' का' },
      { en: '10 parts of 3°00\'', hi: '10 भाग, प्रत्येक 3°00\' का' },
      { en: '12 parts of 2°30\'', hi: '12 भाग, प्रत्येक 2°30\' का' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Dasamsha divides each 30-degree sign into 10 equal parts of 3 degrees each. For odd signs, the count starts from the same sign; for even signs, from the 9th sign. This creates the career and professional life chart.',
      hi: 'दशांश प्रत्येक 30 अंश की राशि को 3 अंश के 10 समान भागों में विभाजित करता है। विषम राशियों के लिए गणना उसी राशि से और सम राशियों के लिए 9वीं राशि से आरम्भ होती है। इससे व्यवसाय और पेशेवर जीवन की कुण्डली बनती है।',
    },
  },
  {
    id: 'q10_3_02', type: 'mcq',
    question: {
      en: 'For an odd sign like Aries, the Dasamsha count starts from:',
      hi: 'मेष जैसी विषम राशि के लिए दशांश गणना कहाँ से आरम्भ होती है?',
    },
    options: [
      { en: 'The 9th sign from Aries (Sagittarius)', hi: 'मेष से 9वीं राशि (धनु)', sa: 'मेष से 9वीं राशि (धनु)', mai: 'मेष से 9वीं राशि (धनु)', mr: 'मेष से 9वीं राशि (धनु)', ta: 'The 9th sign from Aries (Sagittarius)', te: 'The 9th sign from Aries (Sagittarius)', bn: 'The 9th sign from Aries (Sagittarius)', kn: 'The 9th sign from Aries (Sagittarius)', gu: 'The 9th sign from Aries (Sagittarius)' },
      { en: 'Aries itself (same sign)', hi: 'स्वयं मेष से (उसी राशि से)', sa: 'स्वयं मेष से (उसी राशि से)', mai: 'स्वयं मेष से (उसी राशि से)', mr: 'स्वयं मेष से (उसी राशि से)', ta: 'Aries itself (same sign)', te: 'Aries itself (same sign)', bn: 'Aries itself (same sign)', kn: 'Aries itself (same sign)', gu: 'Aries itself (same sign)' },
      { en: 'The 7th sign from Aries (Libra)', hi: 'मेष से 7वीं राशि (तुला)', sa: 'मेष से 7वीं राशि (तुला)', mai: 'मेष से 7वीं राशि (तुला)', mr: 'मेष से 7वीं राशि (तुला)', ta: 'The 7th sign from Aries (Libra)', te: 'The 7th sign from Aries (Libra)', bn: 'The 7th sign from Aries (Libra)', kn: 'The 7th sign from Aries (Libra)', gu: 'The 7th sign from Aries (Libra)' },
      { en: 'Always from Aries regardless', hi: 'सदैव मेष से, राशि कोई भी हो', sa: 'सदैव मेष से, राशि कोई भी हो', mai: 'सदैव मेष से, राशि कोई भी हो', mr: 'सदैव मेष से, राशि कोई भी हो', ta: 'Always from Aries regardless', te: 'Always from Aries regardless', bn: 'Always from Aries regardless', kn: 'Always from Aries regardless', gu: 'Always from Aries regardless' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'For odd signs (Aries, Gemini, Leo, etc.), the Dasamsha count begins from the same sign. So for a planet in Aries, the first D10 division (0°-3°) maps to Aries, the second (3°-6°) to Taurus, and so on. For even signs, counting starts from the 9th sign.',
      hi: 'विषम राशियों (मेष, मिथुन, सिंह, आदि) के लिए दशांश गणना उसी राशि से आरम्भ होती है। अतः मेष में स्थित ग्रह का प्रथम D10 विभाग (0°-3°) मेष, द्वितीय (3°-6°) वृषभ में आएगा, इत्यादि। सम राशियों के लिए गणना 9वीं राशि से होती है।',
    },
  },
  {
    id: 'q10_3_03', type: 'mcq',
    question: {
      en: 'The 10th house lord of the D10 chart indicates:',
      hi: 'D10 कुण्डली का दशमेश क्या दर्शाता है?',
    },
    options: [
      { en: 'The native\'s spiritual path', hi: 'जातक का आध्यात्मिक मार्ग' },
      { en: 'The nature and direction of the career', hi: 'व्यवसाय की प्रकृति और दिशा', sa: 'व्यवसाय की प्रकृति और दिशा', mai: 'व्यवसाय की प्रकृति और दिशा', mr: 'व्यवसाय की प्रकृति और दिशा', ta: 'The nature and direction of the career', te: 'The nature and direction of the career', bn: 'The nature and direction of the career', kn: 'The nature and direction of the career', gu: 'The nature and direction of the career' },
      { en: 'The quality of marriage', hi: 'विवाह की गुणवत्ता', sa: 'विवाह की गुणवत्ता', mai: 'विवाह की गुणवत्ता', mr: 'विवाह की गुणवत्ता', ta: 'The quality of marriage', te: 'The quality of marriage', bn: 'The quality of marriage', kn: 'The quality of marriage', gu: 'The quality of marriage' },
      { en: 'The health of the father', hi: 'पिता का स्वास्थ्य', sa: 'पिता का स्वास्थ्य', mai: 'पिता का स्वास्थ्य', mr: 'पिता का स्वास्थ्य', ta: 'The health of the father', te: 'The health of the father', bn: 'The health of the father', kn: 'The health of the father', gu: 'The health of the father' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 10th house of D10 and its lord are the primary indicators of career nature. A D10 10th lord in Virgo might indicate analytical, detail-oriented, or service-related professions. In Leo, creative or leadership roles. The sign, house, and aspects together paint a detailed career picture.',
      hi: 'D10 का दशम भाव और उसका स्वामी व्यवसाय की प्रकृति के प्राथमिक सूचक हैं। D10 का दशमेश कन्या में हो तो विश्लेषणात्मक, विवरण-प्रधान या सेवा-सम्बन्धी पेशा सूचित होता है। सिंह में हो तो सृजनात्मक या नेतृत्व भूमिका। राशि, भाव और दृष्टियाँ मिलकर विस्तृत व्यावसायिक चित्र प्रस्तुत करती हैं।',
    },
  },
  {
    id: 'q10_3_04', type: 'true_false',
    question: {
      en: 'The Saptamsha (D7) chart is created by dividing each sign into 7 parts of approximately 4°17\' each.',
      hi: 'सप्तांश (D7) कुण्डली प्रत्येक राशि को लगभग 4°17\' के 7 भागों में विभाजित करके बनाई जाती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. 30° ÷ 7 = 4°17\'8.57" (approximately 4 degrees 17 minutes). For odd signs, the Saptamsha count starts from the same sign; for even signs, from the 7th sign. This chart is specifically used for analyzing children and progeny.',
      hi: 'सत्य। 30° ÷ 7 = 4°17\'8.57" (लगभग 4 अंश 17 कला)। विषम राशियों के लिए सप्तांश गणना उसी राशि से और सम राशियों के लिए 7वीं राशि से आरम्भ होती है। यह कुण्डली विशेष रूप से सन्तान और वंश के विश्लेषण में प्रयुक्त होती है।',
    },
  },
  {
    id: 'q10_3_05', type: 'mcq',
    question: {
      en: 'Which house in the D7 (Saptamsha) chart represents the first child?',
      hi: 'D7 (सप्तांश) कुण्डली में कौन सा भाव प्रथम सन्तान का प्रतिनिधित्व करता है?',
    },
    options: [
      { en: '1st house', hi: 'प्रथम भाव', sa: 'प्रथम भाव', mai: 'प्रथम भाव', mr: 'प्रथम भाव', ta: '1st house', te: '1st house', bn: '1st house', kn: '1st house', gu: '1st house' },
      { en: '7th house', hi: 'सप्तम भाव', sa: 'सप्तम भाव', mai: 'सप्तम भाव', mr: 'सप्तम भाव', ta: '7th house', te: '7th house', bn: '7th house', kn: '7th house', gu: '7th house' },
      { en: '5th house', hi: 'पञ्चम भाव', sa: 'पञ्चम भाव', mai: 'पञ्चम भाव', mr: 'पञ्चम भाव', ta: '5th house', te: '5th house', bn: '5th house', kn: '5th house', gu: '5th house' },
      { en: '9th house', hi: 'नवम भाव', sa: 'नवम भाव', mai: 'नवम भाव', mr: 'नवम भाव', ta: '9th house', te: '9th house', bn: '9th house', kn: '9th house', gu: '9th house' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The 5th house of D7 represents the first child, just as the 5th house in D1 is the house of children. The 7th house of D7 relates to the second child, the 9th to the third, and so on (each subsequent child is seen from the 3rd house from the previous child\'s house).',
      hi: 'D7 का पञ्चम भाव प्रथम सन्तान का प्रतिनिधित्व करता है, जैसे D1 में पञ्चम भाव सन्तान का भाव है। D7 का सप्तम भाव द्वितीय सन्तान, नवम तृतीय सन्तान से सम्बन्धित है, इत्यादि (प्रत्येक अगली सन्तान पिछली के भाव से तीसरे भाव से देखी जाती है)।',
    },
  },
  {
    id: 'q10_3_06', type: 'mcq',
    question: {
      en: 'Jupiter\'s strength in D7 is considered critical for:',
      hi: 'D7 में बृहस्पति का बल किसके लिए अत्यन्त महत्त्वपूर्ण माना जाता है?',
    },
    options: [
      { en: 'Career advancement and promotions', hi: 'व्यावसायिक उन्नति और पदोन्नति', sa: 'व्यावसायिक उन्नति और पदोन्नति', mai: 'व्यावसायिक उन्नति और पदोन्नति', mr: 'व्यावसायिक उन्नति और पदोन्नति', ta: 'Career advancement and promotions', te: 'Career advancement and promotions', bn: 'Career advancement and promotions', kn: 'Career advancement and promotions', gu: 'Career advancement and promotions' },
      { en: 'Marital compatibility', hi: 'वैवाहिक अनुकूलता', sa: 'वैवाहिक अनुकूलता', mai: 'वैवाहिक अनुकूलता', mr: 'वैवाहिक अनुकूलता', ta: 'Marital compatibility', te: 'Marital compatibility', bn: 'Marital compatibility', kn: 'Marital compatibility', gu: 'Marital compatibility' },
      { en: 'Childbirth timing and progeny prospects', hi: 'सन्तान प्राप्ति का समय और वंशवृद्धि की सम्भावनाएँ', sa: 'सन्तान प्राप्ति का समय और वंशवृद्धि की सम्भावनाएँ', mai: 'सन्तान प्राप्ति का समय और वंशवृद्धि की सम्भावनाएँ', mr: 'सन्तान प्राप्ति का समय और वंशवृद्धि की सम्भावनाएँ', ta: 'Childbirth timing and progeny prospects', te: 'Childbirth timing and progeny prospects', bn: 'Childbirth timing and progeny prospects', kn: 'Childbirth timing and progeny prospects', gu: 'Childbirth timing and progeny prospects' },
      { en: 'Financial investments', hi: 'वित्तीय निवेश', sa: 'वित्तीय निवेश', mai: 'वित्तीय निवेश', mr: 'वित्तीय निवेश', ta: 'Financial investments', te: 'Financial investments', bn: 'Financial investments', kn: 'Financial investments', gu: 'Financial investments' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Jupiter is the Putra Karaka (significator of children) in Jyotish. Its strength in D7 directly affects fertility, the timing of childbirth, and the happiness from children. A well-placed Jupiter in D7 is one of the strongest indicators for progeny — its weakness can cause delays or difficulties.',
      hi: 'ज्योतिष में बृहस्पति पुत्र कारक है। D7 में इसका बल सीधे प्रजनन क्षमता, सन्तान प्राप्ति के समय और सन्तान से सुख को प्रभावित करता है। D7 में सुस्थित बृहस्पति सन्तान प्राप्ति के सबसे बलवान सूचकों में से एक है — इसकी दुर्बलता विलम्ब या कठिनाइयाँ उत्पन्न कर सकती है।',
    },
  },
  {
    id: 'q10_3_07', type: 'mcq',
    question: {
      en: 'The Dwadashamsha (D12) divides each sign into how many parts?',
      hi: 'द्वादशांश (D12) प्रत्येक राशि को कितने भागों में विभाजित करता है?',
    },
    options: [
      { en: '9 parts of 3°20\'', hi: '9 भाग, प्रत्येक 3°20\' का' },
      { en: '10 parts of 3°00\'', hi: '10 भाग, प्रत्येक 3°00\' का' },
      { en: '12 parts of 2°30\'', hi: '12 भाग, प्रत्येक 2°30\' का' },
      { en: '7 parts of 4°17\'', hi: '7 भाग, प्रत्येक 4°17\' का' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Dwadashamsha (D12) divides each 30° sign into 12 equal parts of 2°30\' each. The count always starts from the sign itself. So the first D12 division of Aries (0°-2°30\') maps to Aries, the second to Taurus, through to the 12th division mapping to Pisces.',
      hi: 'द्वादशांश (D12) प्रत्येक 30° की राशि को 2°30\' के 12 समान भागों में विभाजित करता है। गणना सदैव उसी राशि से आरम्भ होती है। अतः मेष का प्रथम D12 विभाग (0°-2°30\') मेष में, द्वितीय वृषभ में, 12वाँ विभाग मीन में आता है।',
    },
  },
  {
    id: 'q10_3_08', type: 'true_false',
    question: {
      en: 'In the D12 chart, the 4th house represents the father and the 9th house represents the mother.',
      hi: 'D12 कुण्डली में चतुर्थ भाव पिता का और नवम भाव माता का प्रतिनिधित्व करता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False — it is the reverse. In D12, the 4th house represents the mother and the 9th house represents the father. This follows the standard Jyotish signification where the 4th house governs the mother (sukha, home, nurturing) and the 9th house governs the father (dharma, guru, fortune).',
      hi: 'असत्य — यह उलटा है। D12 में चतुर्थ भाव माता का और नवम भाव पिता का प्रतिनिधित्व करता है। यह मानक ज्योतिषीय कारकत्व का पालन करता है जहाँ चतुर्थ भाव माता (सुख, गृह, पालन-पोषण) और नवम भाव पिता (धर्म, गुरु, भाग्य) से सम्बन्धित है।',
    },
  },
  {
    id: 'q10_3_09', type: 'mcq',
    question: {
      en: 'A D10 Lagna in Virgo most likely suggests a career oriented toward:',
      hi: 'D10 लग्न कन्या राशि में हो तो सम्भवतः व्यवसाय किस दिशा में होगा?',
    },
    options: [
      { en: 'Entertainment, performance, and creative arts', hi: 'मनोरंजन, प्रदर्शन और सृजनात्मक कलाएँ', sa: 'मनोरंजन, प्रदर्शन और सृजनात्मक कलाएँ', mai: 'मनोरंजन, प्रदर्शन और सृजनात्मक कलाएँ', mr: 'मनोरंजन, प्रदर्शन और सृजनात्मक कलाएँ', ta: 'Entertainment, performance, and creative arts', te: 'Entertainment, performance, and creative arts', bn: 'Entertainment, performance, and creative arts', kn: 'Entertainment, performance, and creative arts', gu: 'Entertainment, performance, and creative arts' },
      { en: 'Analytical work, service, healthcare, or detail-oriented professions', hi: 'विश्लेषणात्मक कार्य, सेवा, स्वास्थ्य या विवरण-प्रधान पेशे', sa: 'विश्लेषणात्मक कार्य, सेवा, स्वास्थ्य या विवरण-प्रधान पेशे', mai: 'विश्लेषणात्मक कार्य, सेवा, स्वास्थ्य या विवरण-प्रधान पेशे', mr: 'विश्लेषणात्मक कार्य, सेवा, स्वास्थ्य या विवरण-प्रधान पेशे', ta: 'Analytical work, service, healthcare, or detail-oriented professions', te: 'Analytical work, service, healthcare, or detail-oriented professions', bn: 'Analytical work, service, healthcare, or detail-oriented professions', kn: 'Analytical work, service, healthcare, or detail-oriented professions', gu: 'Analytical work, service, healthcare, or detail-oriented professions' },
      { en: 'Military, sports, and competitive fields', hi: 'सैन्य, खेल और प्रतिस्पर्धी क्षेत्र', sa: 'सैन्य, खेल और प्रतिस्पर्धी क्षेत्र', mai: 'सैन्य, खेल और प्रतिस्पर्धी क्षेत्र', mr: 'सैन्य, खेल और प्रतिस्पर्धी क्षेत्र', ta: 'Military, sports, and competitive fields', te: 'Military, sports, and competitive fields', bn: 'Military, sports, and competitive fields', kn: 'Military, sports, and competitive fields', gu: 'Military, sports, and competitive fields' },
      { en: 'Judiciary, law, and diplomacy', hi: 'न्यायपालिका, कानून और कूटनीति', sa: 'न्यायपालिका, कानून और कूटनीति', mai: 'न्यायपालिका, कानून और कूटनीति', mr: 'न्यायपालिका, कानून और कूटनीति', ta: 'Judiciary, law, and diplomacy', te: 'Judiciary, law, and diplomacy', bn: 'Judiciary, law, and diplomacy', kn: 'Judiciary, law, and diplomacy', gu: 'Judiciary, law, and diplomacy' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Virgo is ruled by Mercury — the planet of analysis, detail, discrimination, and service. A D10 Lagna in Virgo suggests careers in healthcare, accounting, editing, quality control, data analysis, consulting, or any field requiring meticulous attention to detail and analytical thinking.',
      hi: 'कन्या राशि का स्वामी बुध है — विश्लेषण, विवरण, विवेक और सेवा का ग्रह। D10 लग्न कन्या में हो तो स्वास्थ्य सेवा, लेखाकर्म, सम्पादन, गुणवत्ता नियन्त्रण, डेटा विश्लेषण, परामर्श, या सूक्ष्म ध्यान और विश्लेषणात्मक चिन्तन वाले किसी भी क्षेत्र में व्यवसाय सूचित होता है।',
    },
  },
  {
    id: 'q10_3_10', type: 'mcq',
    question: {
      en: 'The D12 chart is used to understand which type of karmic patterns?',
      hi: 'D12 कुण्डली किस प्रकार के कार्मिक प्रतिरूपों को समझने में प्रयुक्त होती है?',
    },
    options: [
      { en: 'Professional karma from past work efforts', hi: 'पूर्व कार्य प्रयासों से व्यावसायिक कर्म', sa: 'पूर्व कार्य प्रयासों से व्यावसायिक कर्म', mai: 'पूर्व कार्य प्रयासों से व्यावसायिक कर्म', mr: 'पूर्व कार्य प्रयासों से व्यावसायिक कर्म', ta: 'Professional karma from past work efforts', te: 'Professional karma from past work efforts', bn: 'Professional karma from past work efforts', kn: 'Professional karma from past work efforts', gu: 'Professional karma from past work efforts' },
      { en: 'Inherited karma from parents and ancestral lineage', hi: 'माता-पिता और पैतृक वंश से विरासत में मिला कर्म', sa: 'माता-पिता और पैतृक वंश से विरासत में मिला कर्म', mai: 'माता-पिता और पैतृक वंश से विरासत में मिला कर्म', mr: 'माता-पिता और पैतृक वंश से विरासत में मिला कर्म', ta: 'Inherited karma from parents and ancestral lineage', te: 'Inherited karma from parents and ancestral lineage', bn: 'Inherited karma from parents and ancestral lineage', kn: 'Inherited karma from parents and ancestral lineage', gu: 'Inherited karma from parents and ancestral lineage' },
      { en: 'Romantic karma from past-life relationships', hi: 'पूर्वजन्म के सम्बन्धों से रोमांटिक कर्म', sa: 'पूर्वजन्म के सम्बन्धों से रोमांटिक कर्म', mai: 'पूर्वजन्म के सम्बन्धों से रोमांटिक कर्म', mr: 'पूर्वजन्म के सम्बन्धों से रोमांटिक कर्म', ta: 'Romantic karma from past-life relationships', te: 'Romantic karma from past-life relationships', bn: 'Romantic karma from past-life relationships', kn: 'Romantic karma from past-life relationships', gu: 'Romantic karma from past-life relationships' },
      { en: 'Financial karma related to debts and assets', hi: 'ऋण और सम्पत्ति से सम्बन्धित वित्तीय कर्म', sa: 'ऋण और सम्पत्ति से सम्बन्धित वित्तीय कर्म', mai: 'ऋण और सम्पत्ति से सम्बन्धित वित्तीय कर्म', mr: 'ऋण और सम्पत्ति से सम्बन्धित वित्तीय कर्म', ta: 'Financial karma related to debts and assets', te: 'Financial karma related to debts and assets', bn: 'Financial karma related to debts and assets', kn: 'Financial karma related to debts and assets', gu: 'Financial karma related to debts and assets' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The D12 (Dwadashamsha) specifically reveals inherited karma — the karmic patterns passed down through the parental and ancestral lineage. It shows the quality of relationship with parents, the karma inherited from them, and how ancestral blessings or burdens manifest in the native\'s life.',
      hi: 'D12 (द्वादशांश) विशेष रूप से विरासत में मिले कर्म को प्रकट करती है — माता-पिता और पैतृक वंश से प्राप्त कार्मिक प्रतिरूप। यह माता-पिता से सम्बन्ध की गुणवत्ता, उनसे विरासत में मिला कर्म, और पैतृक आशीर्वाद या बोझ जातक के जीवन में कैसे प्रकट होते हैं, यह दिखाती है।',
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
          Dasamsha (D10) — The Career Chart
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Dasamsha is the divisional chart dedicated entirely to <span className="text-gold-light font-medium">career, profession, and public standing</span>. While the 10th house of D1 gives a general picture of one's karma-sthana (house of action), the D10 provides the magnified, detailed view — the specific nature of the profession, career trajectory, peaks and valleys, and professional reputation.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">Construction:</span> Each sign is divided into 10 equal parts of 3° each. The starting point depends on whether the sign is odd or even:
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-bg-primary/40 rounded-lg p-3 border border-white/5">
              <span className="text-gold-light font-bold text-xs">Odd Signs (विषम राशियाँ)</span>
              <p className="text-text-secondary/70 text-xs mt-1">Aries, Gemini, Leo, Libra, Sagittarius, Aquarius</p>
              <p className="text-emerald-400 text-xs mt-1">Count from the same sign</p>
            </div>
            <div className="bg-bg-primary/40 rounded-lg p-3 border border-white/5">
              <span className="text-gold-light font-bold text-xs">Even Signs (सम राशियाँ)</span>
              <p className="text-text-secondary/70 text-xs mt-1">Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces</p>
              <p className="text-emerald-400 text-xs mt-1">Count from the 9th sign</p>
            </div>
          </div>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Example:</span> A planet at 17° Leo. Leo is odd, so we count from Leo. 17 ÷ 3 = 5.67, so the planet is in the 6th D10 division. Counting from Leo: Leo(1), Virgo(2), Libra(3), Scorpio(4), Sagittarius(5), <span className="text-gold-light font-medium">Capricorn(6)</span>. The planet sits in Capricorn in D10 — structured, authority-oriented, corporate career energy. If this were the D10 Lagna, it would suggest a career in management, government, or structured organizations.
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={isHi ? 'उदाहरण कुण्डली' : 'Example Chart'} />
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Reading the D10 Career Chart</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">D10 Lagna sign:</span> Shows the overall professional orientation — Aries D10 Lagna indicates pioneering/entrepreneurial careers; Taurus suggests banking/luxury/agriculture; Gemini points to communication/media/writing.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">10th house of D10:</span> The most powerful indicator of career nature. Planets here dominate the professional expression. Sun here gives government/authority; Moon gives public-facing/nurturing roles; Mars gives engineering/military/surgery; Mercury gives commerce/IT/communication.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">D10 10th lord placement:</span> Shows WHERE the career energy flows. In the 1st house — self-made career. In the 7th — partnerships/consulting. In the 11th — networking/gains-oriented work. In the 12th — foreign lands, research, or behind-the-scenes work.
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
          Saptamsha (D7) — The Chart of Children
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Saptamsha divides each sign into <span className="text-gold-light font-medium">7 equal parts of approximately 4°17'</span> each (precisely 4°17'8.57"). This chart is dedicated to <span className="text-gold-light font-medium">children, progeny, and creative output</span>. Just as D9 is indispensable for marriage and D10 for career, the D7 is the definitive chart for all questions about offspring.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">Construction rules:</span> For odd signs (Aries, Gemini, Leo, etc.), the Saptamsha count begins from the same sign. For even signs (Taurus, Cancer, Virgo, etc.), it begins from the 7th sign. So the first D7 division of Aries (0°-4°17') maps to Aries, while the first D7 division of Taurus maps to Scorpio (the 7th from Taurus).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Key houses:</span> The 5th house of D7 represents the first child. The 7th house shows the second child, the 9th the third — each subsequent child is seen from the 3rd house of the previous (since the 3rd is "next sibling" from any reference point). Jupiter's overall strength in D7 is the single most important factor for progeny — as the Putra Karaka (significator of children), a strong Jupiter in D7 blesses with healthy, well-timed offspring.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Jupiter in D7 — The Decisive Factor</h4>
        <div className="space-y-2">
          {[
            { status: 'Jupiter exalted/own sign in D7', statusHi: 'D7 में बृहस्पति उच्च/स्वगृही', result: 'Strong fertility, timely childbirth, happiness from children', resultHi: 'प्रबल प्रजनन क्षमता, समय पर सन्तान, सन्तान से सुख' },
            { status: 'Jupiter in kendra of D7', statusHi: 'D7 के केन्द्र में बृहस्पति', result: 'Children play a central role in life; supportive parent-child bond', resultHi: 'सन्तान जीवन में केन्द्रीय भूमिका; सहयोगी अभिभावक-सन्तान बन्धन' },
            { status: 'Jupiter debilitated in D7', statusHi: 'D7 में बृहस्पति नीच का', result: 'Delays, difficulty conceiving, or strained relationship with children', resultHi: 'विलम्ब, गर्भधारण में कठिनाई, या सन्तान से तनावपूर्ण सम्बन्ध' },
            { status: 'Jupiter in 6/8/12 of D7', statusHi: 'D7 के 6/8/12 में बृहस्पति', result: 'Obstacles to progeny; medical intervention may be needed; children may live at distance', resultHi: 'सन्तान में बाधाएँ; चिकित्सकीय हस्तक्षेप आवश्यक; सन्तान दूर रह सकती है' },
          ].map((item, i) => (
            <div key={i} className="bg-bg-primary/40 rounded-lg px-3 py-2 border border-white/5">
              <span className="text-gold-light text-xs font-medium">{isHi ? item.statusHi : item.status}</span>
              <p className="text-text-secondary/70 text-xs mt-0.5">{isHi ? item.resultHi : item.result}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Childbirth Timing with D7</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The Dasha of the 5th lord of D7, Jupiter's dasha periods, or the dasha of planets occupying the 5th house of D7 are prime periods for childbirth. When the same planet is simultaneously the 5th lord in D1 and well-placed in D7, the indication becomes very strong.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Transit confirmation:</span> Jupiter transiting over the 5th house of D7 or D1, or over the Saptamsha 5th lord, often provides the final trigger for conception and birth. The convergence of dasha and transit signals is what gives timing precision.
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
          Dwadashamsha (D12) — The Chart of Parents
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Dwadashamsha divides each sign into <span className="text-gold-light font-medium">12 equal parts of 2°30'</span> each. Uniquely among the common vargas, the D12 count always starts from the sign itself regardless of odd/even classification. The first D12 division of Aries maps to Aries, the second to Taurus, and the 12th to Pisces — it cycles through the entire zodiac within each sign.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The D12 chart is dedicated to <span className="text-gold-light font-medium">parents, ancestry, and inherited karma</span>. The 4th house of D12 represents the mother — her health, her relationship with the native, and the karmic bond. The 9th house represents the father. Afflictions to these houses in D12 can indicate parental health issues, strained relationships, or early separation.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Inherited karma:</span> D12 goes beyond just describing parents — it reveals the karmic patterns inherited through the lineage. Benefic planets in the 4th and 9th of D12 suggest ancestral blessings flowing to the native. Malefics or afflicted lords indicate karmic debts that the native carries from the family line. This is why D12 is consulted in remedial astrology when ancestral issues (pitru dosha) are suspected.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Reading the D12 — Parents and Lineage</h4>
        <div className="space-y-2">
          {[
            { house: '4th House (Mother)', houseHi: 'चतुर्थ भाव (माता)', desc: 'Sign, planets in 4th, and 4th lord placement describe mother\'s nature, health, and the emotional bond', descHi: 'राशि, चतुर्थ में ग्रह और चतुर्थेश की स्थिति माता के स्वभाव, स्वास्थ्य और भावनात्मक बन्धन का वर्णन करते हैं' },
            { house: '9th House (Father)', houseHi: 'नवम भाव (पिता)', desc: 'Sign, planets in 9th, and 9th lord placement describe father\'s character, fortune, and guidance role', descHi: 'राशि, नवम में ग्रह और नवमेश की स्थिति पिता के चरित्र, भाग्य और मार्गदर्शक भूमिका का वर्णन करते हैं' },
            { house: '1st House (Self)', houseHi: 'प्रथम भाव (स्वयं)', desc: 'The native\'s own inherited constitution and how ancestral patterns express through them', descHi: 'जातक का विरासत में मिला संविधान और पैतृक प्रतिरूप उनके माध्यम से कैसे अभिव्यक्त होते हैं' },
            { house: '10th House (Legacy)', houseHi: 'दशम भाव (विरासत)', desc: 'What the native does with inherited karma — continuation, transformation, or transcendence of family patterns', descHi: 'विरासत में मिले कर्म से जातक क्या करता है — पारिवारिक प्रतिरूपों की निरन्तरता, रूपान्तरण या पारगमन' },
          ].map((item, i) => (
            <div key={i} className="bg-bg-primary/40 rounded-lg px-3 py-2 border border-white/5">
              <span className="text-gold-light text-xs font-medium">{isHi ? item.houseHi : item.house}</span>
              <p className="text-text-secondary/70 text-xs mt-0.5">{isHi ? item.descHi : item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Timing Parental Events</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The Dasha of the D12 4th lord or planets aspecting/occupying the 4th house often coincides with significant maternal events — health concerns, relocation, or deepening of the bond. Similarly, the 9th lord's dasha period activates paternal themes. When maraka (death-inflicting) planets of D12 are simultaneously activated in D1 dasha, they can indicate serious parental health crises.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Practical note:</span> D12 is not just about difficulties — it equally reveals the gifts flowing from parents. A strong 9th house in D12 with Jupiter's aspect may indicate inheriting the father's wisdom, reputation, or spiritual merit. A strong 4th with Moon well-placed may indicate deep maternal nurturing that shapes the native's emotional foundation for life.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Parashara in BPHS (Chapters 6-7) provides the mathematical rules for all three vargas covered here. He emphasizes that the D10 should be consulted for all questions about profession and status, D7 for children and creative output, and D12 for parents and lineage. Mantreshwara and Varahamihira concur, adding that these vargas should not be read in isolation — the D1 provides the foundation, and each varga deepens a specific dimension of the same fundamental chart.
        </p>
      </section>
    </div>
  );
}

export default function Module10_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
