'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_9_3', phase: 3, topic: 'Kundali', moduleNumber: '9.3',
  title: { en: 'Planetary Dignities in the Chart', hi: 'कुण्डली में ग्रह गरिमाएँ', sa: 'कुण्डली में ग्रह गरिमाएँ', mai: 'कुण्डली में ग्रह गरिमाएँ', mr: 'कुण्डली में ग्रह गरिमाएँ', ta: 'Planetary Dignities in the Chart', te: 'Planetary Dignities in the Chart', bn: 'Planetary Dignities in the Chart', kn: 'Planetary Dignities in the Chart', gu: 'Planetary Dignities in the Chart' },
  subtitle: { en: 'Exaltation, debilitation, own sign, and the dignity hierarchy', hi: 'उच्च, नीच, स्वगृह, और गरिमा क्रम', sa: 'उच्च, नीच, स्वगृह, और गरिमा क्रम', mai: 'उच्च, नीच, स्वगृह, और गरिमा क्रम', mr: 'उच्च, नीच, स्वगृह, और गरिमा क्रम', ta: 'Exaltation, debilitation, own sign, and the dignity hierarchy', te: 'Exaltation, debilitation, own sign, and the dignity hierarchy', bn: 'Exaltation, debilitation, own sign, and the dignity hierarchy', kn: 'Exaltation, debilitation, own sign, and the dignity hierarchy', gu: 'Exaltation, debilitation, own sign, and the dignity hierarchy' },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 9.1: Birth Chart Basics', hi: 'मॉड्यूल 9.1: कुण्डली की मूल बातें', sa: 'मॉड्यूल 9.1: कुण्डली की मूल बातें', mai: 'मॉड्यूल 9.1: कुण्डली की मूल बातें', mr: 'मॉड्यूल 9.1: कुण्डली की मूल बातें', ta: 'Module 9.1: Birth Chart Basics', te: 'Module 9.1: Birth Chart Basics', bn: 'Module 9.1: Birth Chart Basics', kn: 'Module 9.1: Birth Chart Basics', gu: 'Module 9.1: Birth Chart Basics' }, href: '/learn/modules/9-1' },
    { label: { en: 'Module 9.2: Houses (Bhavas)', hi: 'मॉड्यूल 9.2: भाव', sa: 'मॉड्यूल 9.2: भाव', mai: 'मॉड्यूल 9.2: भाव', mr: 'मॉड्यूल 9.2: भाव', ta: 'Module 9.2: Houses (Bhavas)', te: 'Module 9.2: Houses (Bhavas)', bn: 'Module 9.2: Houses (Bhavas)', kn: 'Module 9.2: Houses (Bhavas)', gu: 'Module 9.2: Houses (Bhavas)' }, href: '/learn/modules/9-2' },
    { label: { en: 'Learn: Grahas', hi: 'सीखें: ग्रह', sa: 'सीखें: ग्रह', mai: 'सीखें: ग्रह', mr: 'सीखें: ग्रह', ta: 'Learn: Grahas', te: 'Learn: Grahas', bn: 'Learn: Grahas', kn: 'Learn: Grahas', gu: 'Learn: Grahas' }, href: '/learn/grahas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q9_3_01', type: 'mcq',
    question: { en: 'In which sign is the Sun exalted?', hi: 'सूर्य किस राशि में उच्च का होता है?', sa: 'सूर्य किस राशि में उच्च का होता है?', mai: 'सूर्य किस राशि में उच्च का होता है?', mr: 'सूर्य किस राशि में उच्च का होता है?', ta: 'In which sign is the Sun exalted?', te: 'In which sign is the Sun exalted?', bn: 'In which sign is the Sun exalted?', kn: 'In which sign is the Sun exalted?', gu: 'In which sign is the Sun exalted?' },
    options: [
      { en: 'Leo', hi: 'सिंह', sa: 'सिंह', mai: 'सिंह', mr: 'सिंह', ta: 'Leo', te: 'Leo', bn: 'Leo', kn: 'Leo', gu: 'Leo' },
      { en: 'Aries', hi: 'मेष', sa: 'मेष', mai: 'मेष', mr: 'मेष', ta: 'Aries', te: 'Aries', bn: 'Aries', kn: 'Aries', gu: 'Aries' },
      { en: 'Libra', hi: 'तुला', sa: 'तुला', mai: 'तुला', mr: 'तुला', ta: 'Libra', te: 'Libra', bn: 'Libra', kn: 'Libra', gu: 'Libra' },
      { en: 'Cancer', hi: 'कर्क', sa: 'कर्क', mai: 'कर्क', mr: 'कर्क', ta: 'Cancer', te: 'Cancer', bn: 'Cancer', kn: 'Cancer', gu: 'Cancer' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The Sun is exalted in Aries (Mesha) with deep exaltation at 10 degrees. In Aries, the Sun\'s leadership, initiative, and fiery nature find their fullest expression.', hi: 'सूर्य मेष राशि में उच्च का होता है, परम उच्च 10 अंश पर। मेष में सूर्य का नेतृत्व, पहल और अग्नि स्वभाव अपनी पूर्ण अभिव्यक्ति पाता है।' },
  },
  {
    id: 'q9_3_02', type: 'true_false',
    question: { en: 'The debilitation sign of a planet is always the 7th sign (opposite) from its exaltation sign.', hi: 'ग्रह की नीच राशि सदैव उसकी उच्च राशि से 7वीं (विपरीत) राशि होती है।', sa: 'ग्रह की नीच राशि सदैव उसकी उच्च राशि से 7वीं (विपरीत) राशि होती है।', mai: 'ग्रह की नीच राशि सदैव उसकी उच्च राशि से 7वीं (विपरीत) राशि होती है।', mr: 'ग्रह की नीच राशि सदैव उसकी उच्च राशि से 7वीं (विपरीत) राशि होती है।', ta: 'The debilitation sign of a planet is always the 7th sign (opposite) from its exaltation sign.', te: 'The debilitation sign of a planet is always the 7th sign (opposite) from its exaltation sign.', bn: 'The debilitation sign of a planet is always the 7th sign (opposite) from its exaltation sign.', kn: 'The debilitation sign of a planet is always the 7th sign (opposite) from its exaltation sign.', gu: 'The debilitation sign of a planet is always the 7th sign (opposite) from its exaltation sign.' },
    correctAnswer: true,
    explanation: { en: 'This is a fundamental rule. Sun exalted in Aries (1st sign) is debilitated in Libra (7th sign). Moon exalted in Taurus is debilitated in Scorpio. Each exaltation-debilitation pair is exactly 180 degrees apart.', hi: 'यह एक मूलभूत नियम है। सूर्य मेष (1ली राशि) में उच्च, तुला (7वीं राशि) में नीच। चन्द्र वृषभ में उच्च, वृश्चिक में नीच। प्रत्येक उच्च-नीच जोड़ी ठीक 180 अंश अलग होती है।', sa: 'यह एक मूलभूत नियम है। सूर्य मेष (1ली राशि) में उच्च, तुला (7वीं राशि) में नीच। चन्द्र वृषभ में उच्च, वृश्चिक में नीच। प्रत्येक उच्च-नीच जोड़ी ठीक 180 अंश अलग होती है।', mai: 'यह एक मूलभूत नियम है। सूर्य मेष (1ली राशि) में उच्च, तुला (7वीं राशि) में नीच। चन्द्र वृषभ में उच्च, वृश्चिक में नीच। प्रत्येक उच्च-नीच जोड़ी ठीक 180 अंश अलग होती है।', mr: 'यह एक मूलभूत नियम है। सूर्य मेष (1ली राशि) में उच्च, तुला (7वीं राशि) में नीच। चन्द्र वृषभ में उच्च, वृश्चिक में नीच। प्रत्येक उच्च-नीच जोड़ी ठीक 180 अंश अलग होती है।', ta: 'This is a fundamental rule. Sun exalted in Aries (1st sign) is debilitated in Libra (7th sign). Moon exalted in Taurus is debilitated in Scorpio. Each exaltation-debilitation pair is exactly 180 degrees apart.', te: 'This is a fundamental rule. Sun exalted in Aries (1st sign) is debilitated in Libra (7th sign). Moon exalted in Taurus is debilitated in Scorpio. Each exaltation-debilitation pair is exactly 180 degrees apart.', bn: 'This is a fundamental rule. Sun exalted in Aries (1st sign) is debilitated in Libra (7th sign). Moon exalted in Taurus is debilitated in Scorpio. Each exaltation-debilitation pair is exactly 180 degrees apart.', kn: 'This is a fundamental rule. Sun exalted in Aries (1st sign) is debilitated in Libra (7th sign). Moon exalted in Taurus is debilitated in Scorpio. Each exaltation-debilitation pair is exactly 180 degrees apart.', gu: 'This is a fundamental rule. Sun exalted in Aries (1st sign) is debilitated in Libra (7th sign). Moon exalted in Taurus is debilitated in Scorpio. Each exaltation-debilitation pair is exactly 180 degrees apart.' },
  },
  {
    id: 'q9_3_03', type: 'mcq',
    question: { en: 'What is Neecha Bhanga Raja Yoga?', hi: 'नीचभंग राजयोग क्या है?', sa: 'नीचभंग राजयोग क्या है?', mai: 'नीचभंग राजयोग क्या है?', mr: 'नीचभंग राजयोग क्या है?', ta: 'What is Neecha Bhanga Raja Yoga?', te: 'What is Neecha Bhanga Raja Yoga?', bn: 'What is Neecha Bhanga Raja Yoga?', kn: 'What is Neecha Bhanga Raja Yoga?', gu: 'What is Neecha Bhanga Raja Yoga?' },
    options: [
      { en: 'When a debilitated planet gets cancelled and becomes powerful', hi: 'जब नीच ग्रह का नीच भंग हो और वह शक्तिशाली बन जाए', sa: 'जब नीच ग्रह का नीच भंग हो और वह शक्तिशाली बन जाए', mai: 'जब नीच ग्रह का नीच भंग हो और वह शक्तिशाली बन जाए', mr: 'जब नीच ग्रह का नीच भंग हो और वह शक्तिशाली बन जाए', ta: 'When a debilitated planet gets cancelled and becomes powerful', te: 'When a debilitated planet gets cancelled and becomes powerful', bn: 'When a debilitated planet gets cancelled and becomes powerful', kn: 'When a debilitated planet gets cancelled and becomes powerful', gu: 'When a debilitated planet gets cancelled and becomes powerful' },
      { en: 'When an exalted planet loses its strength', hi: 'जब उच्च ग्रह अपनी शक्ति खो दे', sa: 'जब उच्च ग्रह अपनी शक्ति खो दे', mai: 'जब उच्च ग्रह अपनी शक्ति खो दे', mr: 'जब उच्च ग्रह अपनी शक्ति खो दे', ta: 'When an exalted planet loses its strength', te: 'When an exalted planet loses its strength', bn: 'When an exalted planet loses its strength', kn: 'When an exalted planet loses its strength', gu: 'When an exalted planet loses its strength' },
      { en: 'When two debilitated planets conjoin', hi: 'जब दो नीच ग्रह युक्त हों', sa: 'जब दो नीच ग्रह युक्त हों', mai: 'जब दो नीच ग्रह युक्त हों', mr: 'जब दो नीच ग्रह युक्त हों', ta: 'When two debilitated planets conjoin', te: 'When two debilitated planets conjoin', bn: 'When two debilitated planets conjoin', kn: 'When two debilitated planets conjoin', gu: 'When two debilitated planets conjoin' },
      { en: 'A type of financial yoga only', hi: 'केवल एक प्रकार का धन योग', sa: 'केवल एक प्रकार का धन योग', mai: 'केवल एक प्रकार का धन योग', mr: 'केवल एक प्रकार का धन योग', ta: 'A type of financial yoga only', te: 'A type of financial yoga only', bn: 'A type of financial yoga only', kn: 'A type of financial yoga only', gu: 'A type of financial yoga only' },
    ],
    correctAnswer: 0,
    explanation: { en: 'Neecha Bhanga Raja Yoga occurs when a debilitated planet\'s weakness is cancelled by specific conditions (e.g., the ruler of the debilitation sign is in a Kendra). The initial weakness transforms into extraordinary strength — the "phoenix" principle.', hi: 'नीचभंग राजयोग तब होता है जब नीच ग्रह की कमजोरी विशिष्ट शर्तों से रद्द हो जाती है (जैसे, नीच राशि का स्वामी केन्द्र में हो)। प्रारम्भिक दुर्बलता असाधारण शक्ति में बदल जाती है — "फीनिक्स" सिद्धांत।' },
  },
  {
    id: 'q9_3_04', type: 'mcq',
    question: { en: 'Where is Jupiter exalted?', hi: 'बृहस्पति किस राशि में उच्च का है?', sa: 'बृहस्पति किस राशि में उच्च का है?', mai: 'बृहस्पति किस राशि में उच्च का है?', mr: 'बृहस्पति किस राशि में उच्च का है?', ta: 'Where is Jupiter exalted?', te: 'Where is Jupiter exalted?', bn: 'Where is Jupiter exalted?', kn: 'Where is Jupiter exalted?', gu: 'Where is Jupiter exalted?' },
    options: [
      { en: 'Sagittarius', hi: 'धनु', sa: 'धनु', mai: 'धनु', mr: 'धनु', ta: 'Sagittarius', te: 'Sagittarius', bn: 'Sagittarius', kn: 'Sagittarius', gu: 'Sagittarius' },
      { en: 'Pisces', hi: 'मीन', sa: 'मीन', mai: 'मीन', mr: 'मीन', ta: 'Pisces', te: 'Pisces', bn: 'Pisces', kn: 'Pisces', gu: 'Pisces' },
      { en: 'Cancer', hi: 'कर्क', sa: 'कर्क', mai: 'कर्क', mr: 'कर्क', ta: 'Cancer', te: 'Cancer', bn: 'Cancer', kn: 'Cancer', gu: 'Cancer' },
      { en: 'Virgo', hi: 'कन्या', sa: 'कन्या', mai: 'कन्या', mr: 'कन्या', ta: 'Virgo', te: 'Virgo', bn: 'Virgo', kn: 'Virgo', gu: 'Virgo' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Jupiter is exalted in Cancer (Karka) with deep exaltation at 5 degrees. Cancer\'s nurturing, emotional, and protective qualities amplify Jupiter\'s wisdom, generosity, and expansive nature.', hi: 'बृहस्पति कर्क राशि में उच्च का है, परम उच्च 5 अंश पर। कर्क के पोषण, भावनात्मक और सुरक्षात्मक गुण बृहस्पति के ज्ञान, उदारता और विस्तारशील स्वभाव को बढ़ाते हैं।' },
  },
  {
    id: 'q9_3_05', type: 'true_false',
    question: { en: 'A planet in its Moolatrikona sign is stronger than in its own sign (Swakshetra).', hi: 'मूलत्रिकोण राशि में ग्रह अपनी स्वराशि (स्वक्षेत्र) से अधिक शक्तिशाली होता है।', sa: 'मूलत्रिकोण राशि में ग्रह अपनी स्वराशि (स्वक्षेत्र) से अधिक शक्तिशाली होता है।', mai: 'मूलत्रिकोण राशि में ग्रह अपनी स्वराशि (स्वक्षेत्र) से अधिक शक्तिशाली होता है।', mr: 'मूलत्रिकोण राशि में ग्रह अपनी स्वराशि (स्वक्षेत्र) से अधिक शक्तिशाली होता है।', ta: 'A planet in its Moolatrikona sign is stronger than in its own sign (Swakshetra).', te: 'A planet in its Moolatrikona sign is stronger than in its own sign (Swakshetra).', bn: 'A planet in its Moolatrikona sign is stronger than in its own sign (Swakshetra).', kn: 'A planet in its Moolatrikona sign is stronger than in its own sign (Swakshetra).', gu: 'A planet in its Moolatrikona sign is stronger than in its own sign (Swakshetra).' },
    correctAnswer: true,
    explanation: { en: 'The dignity hierarchy is: Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated. Moolatrikona is the sign where a planet performs its highest duty — slightly stronger than merely being "at home."', hi: 'गरिमा क्रम है: उच्च > मूलत्रिकोण > स्वराशि > मित्र > सम > शत्रु > नीच। मूलत्रिकोण वह राशि है जहाँ ग्रह अपना सर्वोच्च कर्तव्य निभाता है — केवल "घर पर" होने से थोड़ा अधिक शक्तिशाली।', sa: 'गरिमा क्रम है: उच्च > मूलत्रिकोण > स्वराशि > मित्र > सम > शत्रु > नीच। मूलत्रिकोण वह राशि है जहाँ ग्रह अपना सर्वोच्च कर्तव्य निभाता है — केवल "घर पर" होने से थोड़ा अधिक शक्तिशाली।', mai: 'गरिमा क्रम है: उच्च > मूलत्रिकोण > स्वराशि > मित्र > सम > शत्रु > नीच। मूलत्रिकोण वह राशि है जहाँ ग्रह अपना सर्वोच्च कर्तव्य निभाता है — केवल "घर पर" होने से थोड़ा अधिक शक्तिशाली।', mr: 'गरिमा क्रम है: उच्च > मूलत्रिकोण > स्वराशि > मित्र > सम > शत्रु > नीच। मूलत्रिकोण वह राशि है जहाँ ग्रह अपना सर्वोच्च कर्तव्य निभाता है — केवल "घर पर" होने से थोड़ा अधिक शक्तिशाली।', ta: 'The dignity hierarchy is: Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated. Moolatrikona is the sign where a planet performs its highest duty — slightly stronger than merely being "at home."', te: 'The dignity hierarchy is: Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated. Moolatrikona is the sign where a planet performs its highest duty — slightly stronger than merely being "at home."', bn: 'The dignity hierarchy is: Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated. Moolatrikona is the sign where a planet performs its highest duty — slightly stronger than merely being "at home."', kn: 'The dignity hierarchy is: Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated. Moolatrikona is the sign where a planet performs its highest duty — slightly stronger than merely being "at home."', gu: 'The dignity hierarchy is: Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated. Moolatrikona is the sign where a planet performs its highest duty — slightly stronger than merely being "at home."' },
  },
  {
    id: 'q9_3_06', type: 'mcq',
    question: { en: 'Saturn is exalted in which sign?', hi: 'शनि किस राशि में उच्च का है?', sa: 'शनि किस राशि में उच्च का है?', mai: 'शनि किस राशि में उच्च का है?', mr: 'शनि किस राशि में उच्च का है?', ta: 'Saturn is exalted in which sign?', te: 'Saturn is exalted in which sign?', bn: 'Saturn is exalted in which sign?', kn: 'Saturn is exalted in which sign?', gu: 'Saturn is exalted in which sign?' },
    options: [
      { en: 'Capricorn', hi: 'मकर', sa: 'मकर', mai: 'मकर', mr: 'मकर', ta: 'Capricorn', te: 'Capricorn', bn: 'Capricorn', kn: 'Capricorn', gu: 'Capricorn' },
      { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भ', mai: 'कुम्भ', mr: 'कुम्भ', ta: 'Aquarius', te: 'Aquarius', bn: 'Aquarius', kn: 'Aquarius', gu: 'Aquarius' },
      { en: 'Libra', hi: 'तुला', sa: 'तुला', mai: 'तुला', mr: 'तुला', ta: 'Libra', te: 'Libra', bn: 'Libra', kn: 'Libra', gu: 'Libra' },
      { en: 'Virgo', hi: 'कन्या', sa: 'कन्या', mai: 'कन्या', mr: 'कन्या', ta: 'Virgo', te: 'Virgo', bn: 'Virgo', kn: 'Virgo', gu: 'Virgo' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Saturn is exalted in Libra (Tula) with deep exaltation at 20 degrees. Libra\'s qualities of balance, fairness, and justice perfectly channel Saturn\'s disciplined, karmic, and structured energy.', hi: 'शनि तुला राशि में उच्च का है, परम उच्च 20 अंश पर। तुला के संतुलन, निष्पक्षता और न्याय के गुण शनि की अनुशासित, कार्मिक और संरचित ऊर्जा को पूर्णतः प्रवाहित करते हैं।' },
  },
  {
    id: 'q9_3_07', type: 'mcq',
    question: { en: 'Which condition can create Neecha Bhanga (debilitation cancellation)?', hi: 'कौन सी स्थिति नीचभंग (नीच का भंग) बना सकती है?', sa: 'कौन सी स्थिति नीचभंग (नीच का भंग) बना सकती है?', mai: 'कौन सी स्थिति नीचभंग (नीच का भंग) बना सकती है?', mr: 'कौन सी स्थिति नीचभंग (नीच का भंग) बना सकती है?', ta: 'Which condition can create Neecha Bhanga (debilitation cancellation)?', te: 'Which condition can create Neecha Bhanga (debilitation cancellation)?', bn: 'Which condition can create Neecha Bhanga (debilitation cancellation)?', kn: 'Which condition can create Neecha Bhanga (debilitation cancellation)?', gu: 'Which condition can create Neecha Bhanga (debilitation cancellation)?' },
    options: [
      { en: 'The debilitated planet is retrograde', hi: 'नीच ग्रह वक्री हो', sa: 'नीच ग्रह वक्री हो', mai: 'नीच ग्रह वक्री हो', mr: 'नीच ग्रह वक्री हो', ta: 'The debilitated planet is retrograde', te: 'The debilitated planet is retrograde', bn: 'The debilitated planet is retrograde', kn: 'The debilitated planet is retrograde', gu: 'The debilitated planet is retrograde' },
      { en: 'The lord of the sign of debilitation is in a Kendra from Lagna or Moon', hi: 'नीच राशि का स्वामी लग्न या चन्द्र से केन्द्र में हो', sa: 'नीच राशि का स्वामी लग्न या चन्द्र से केन्द्र में हो', mai: 'नीच राशि का स्वामी लग्न या चन्द्र से केन्द्र में हो', mr: 'नीच राशि का स्वामी लग्न या चन्द्र से केन्द्र में हो', ta: 'The lord of the sign of debilitation is in a Kendra from Lagna or Moon', te: 'The lord of the sign of debilitation is in a Kendra from Lagna or Moon', bn: 'The lord of the sign of debilitation is in a Kendra from Lagna or Moon', kn: 'The lord of the sign of debilitation is in a Kendra from Lagna or Moon', gu: 'The lord of the sign of debilitation is in a Kendra from Lagna or Moon' },
      { en: 'The debilitated planet is conjunct Rahu', hi: 'नीच ग्रह राहु से युक्त हो', sa: 'नीच ग्रह राहु से युक्त हो', mai: 'नीच ग्रह राहु से युक्त हो', mr: 'नीच ग्रह राहु से युक्त हो', ta: 'The debilitated planet is conjunct Rahu', te: 'The debilitated planet is conjunct Rahu', bn: 'The debilitated planet is conjunct Rahu', kn: 'The debilitated planet is conjunct Rahu', gu: 'The debilitated planet is conjunct Rahu' },
      { en: 'The native was born at night', hi: 'जातक का जन्म रात में हुआ हो', sa: 'जातक का जन्म रात में हुआ हो', mai: 'जातक का जन्म रात में हुआ हो', mr: 'जातक का जन्म रात में हुआ हो', ta: 'The native was born at night', te: 'The native was born at night', bn: 'The native was born at night', kn: 'The native was born at night', gu: 'The native was born at night' },
    ],
    correctAnswer: 1,
    explanation: { en: 'One of the classical Neecha Bhanga conditions from BPHS: if the lord of the sign where the planet is debilitated is placed in a Kendra (1, 4, 7, 10) from the Lagna or Moon, the debilitation is cancelled.', hi: 'BPHS से एक शास्त्रीय नीचभंग शर्त: यदि जिस राशि में ग्रह नीच है उस राशि का स्वामी लग्न या चन्द्र से केन्द्र (1, 4, 7, 10) में हो, तो नीच भंग हो जाता है।', sa: 'BPHS से एक शास्त्रीय नीचभंग शर्त: यदि जिस राशि में ग्रह नीच है उस राशि का स्वामी लग्न या चन्द्र से केन्द्र (1, 4, 7, 10) में हो, तो नीच भंग हो जाता है।', mai: 'BPHS से एक शास्त्रीय नीचभंग शर्त: यदि जिस राशि में ग्रह नीच है उस राशि का स्वामी लग्न या चन्द्र से केन्द्र (1, 4, 7, 10) में हो, तो नीच भंग हो जाता है।', mr: 'BPHS से एक शास्त्रीय नीचभंग शर्त: यदि जिस राशि में ग्रह नीच है उस राशि का स्वामी लग्न या चन्द्र से केन्द्र (1, 4, 7, 10) में हो, तो नीच भंग हो जाता है।', ta: 'One of the classical Neecha Bhanga conditions from BPHS: if the lord of the sign where the planet is debilitated is placed in a Kendra (1, 4, 7, 10) from the Lagna or Moon, the debilitation is cancelled.', te: 'One of the classical Neecha Bhanga conditions from BPHS: if the lord of the sign where the planet is debilitated is placed in a Kendra (1, 4, 7, 10) from the Lagna or Moon, the debilitation is cancelled.', bn: 'One of the classical Neecha Bhanga conditions from BPHS: if the lord of the sign where the planet is debilitated is placed in a Kendra (1, 4, 7, 10) from the Lagna or Moon, the debilitation is cancelled.', kn: 'One of the classical Neecha Bhanga conditions from BPHS: if the lord of the sign where the planet is debilitated is placed in a Kendra (1, 4, 7, 10) from the Lagna or Moon, the debilitation is cancelled.', gu: 'One of the classical Neecha Bhanga conditions from BPHS: if the lord of the sign where the planet is debilitated is placed in a Kendra (1, 4, 7, 10) from the Lagna or Moon, the debilitation is cancelled.' },
  },
  {
    id: 'q9_3_08', type: 'true_false',
    question: { en: 'Venus is exalted in Pisces (Meena).', hi: 'शुक्र मीन राशि में उच्च का है।', sa: 'शुक्र मीन राशि में उच्च का है।', mai: 'शुक्र मीन राशि में उच्च का है।', mr: 'शुक्र मीन राशि में उच्च का है।', ta: 'Venus is exalted in Pisces (Meena).', te: 'Venus is exalted in Pisces (Meena).', bn: 'Venus is exalted in Pisces (Meena).', kn: 'Venus is exalted in Pisces (Meena).', gu: 'Venus is exalted in Pisces (Meena).' },
    correctAnswer: true,
    explanation: { en: 'Venus is exalted in Pisces with deep exaltation at 27 degrees. Pisces\' spiritual, imaginative, and compassionate nature elevates Venus\' love, beauty, and artistic expression to their highest form.', hi: 'शुक्र मीन में उच्च का है, परम उच्च 27 अंश पर। मीन का आध्यात्मिक, कल्पनाशील और करुणामय स्वभाव शुक्र के प्रेम, सौन्दर्य और कलात्मक अभिव्यक्ति को उनके उच्चतम रूप तक ले जाता है।' },
  },
  {
    id: 'q9_3_09', type: 'mcq',
    question: { en: 'What is the correct dignity hierarchy from strongest to weakest?', hi: 'सबसे शक्तिशाली से कमजोर तक सही गरिमा क्रम क्या है?', sa: 'सबसे शक्तिशाली से कमजोर तक सही गरिमा क्रम क्या है?', mai: 'सबसे शक्तिशाली से कमजोर तक सही गरिमा क्रम क्या है?', mr: 'सबसे शक्तिशाली से कमजोर तक सही गरिमा क्रम क्या है?', ta: 'What is the correct dignity hierarchy from strongest to weakest?', te: 'What is the correct dignity hierarchy from strongest to weakest?', bn: 'What is the correct dignity hierarchy from strongest to weakest?', kn: 'What is the correct dignity hierarchy from strongest to weakest?', gu: 'What is the correct dignity hierarchy from strongest to weakest?' },
    options: [
      { en: 'Own > Exalted > Friend > Neutral > Enemy > Debilitated', hi: 'स्व > उच्च > मित्र > सम > शत्रु > नीच', sa: 'स्व > उच्च > मित्र > सम > शत्रु > नीच', mai: 'स्व > उच्च > मित्र > सम > शत्रु > नीच', mr: 'स्व > उच्च > मित्र > सम > शत्रु > नीच', ta: 'Own > Exalted > Friend > Neutral > Enemy > Debilitated', te: 'Own > Exalted > Friend > Neutral > Enemy > Debilitated', bn: 'Own > Exalted > Friend > Neutral > Enemy > Debilitated', kn: 'Own > Exalted > Friend > Neutral > Enemy > Debilitated', gu: 'Own > Exalted > Friend > Neutral > Enemy > Debilitated' },
      { en: 'Exalted > Moolatrikona > Own > Friend > Neutral > Enemy > Debilitated', hi: 'उच्च > मूलत्रिकोण > स्व > मित्र > सम > शत्रु > नीच', sa: 'उच्च > मूलत्रिकोण > स्व > मित्र > सम > शत्रु > नीच', mai: 'उच्च > मूलत्रिकोण > स्व > मित्र > सम > शत्रु > नीच', mr: 'उच्च > मूलत्रिकोण > स्व > मित्र > सम > शत्रु > नीच', ta: 'Exalted > Moolatrikona > Own > Friend > Neutral > Enemy > Debilitated', te: 'Exalted > Moolatrikona > Own > Friend > Neutral > Enemy > Debilitated', bn: 'Exalted > Moolatrikona > Own > Friend > Neutral > Enemy > Debilitated', kn: 'Exalted > Moolatrikona > Own > Friend > Neutral > Enemy > Debilitated', gu: 'Exalted > Moolatrikona > Own > Friend > Neutral > Enemy > Debilitated' },
      { en: 'Moolatrikona > Exalted > Own > Friend > Neutral > Debilitated', hi: 'मूलत्रिकोण > उच्च > स्व > मित्र > सम > नीच', sa: 'मूलत्रिकोण > उच्च > स्व > मित्र > सम > नीच', mai: 'मूलत्रिकोण > उच्च > स्व > मित्र > सम > नीच', mr: 'मूलत्रिकोण > उच्च > स्व > मित्र > सम > नीच', ta: 'Moolatrikona > Exalted > Own > Friend > Neutral > Debilitated', te: 'Moolatrikona > Exalted > Own > Friend > Neutral > Debilitated', bn: 'Moolatrikona > Exalted > Own > Friend > Neutral > Debilitated', kn: 'Moolatrikona > Exalted > Own > Friend > Neutral > Debilitated', gu: 'Moolatrikona > Exalted > Own > Friend > Neutral > Debilitated' },
      { en: 'Exalted > Own > Debilitated > Neutral > Friend', hi: 'उच्च > स्व > नीच > सम > मित्र', sa: 'उच्च > स्व > नीच > सम > मित्र', mai: 'उच्च > स्व > नीच > सम > मित्र', mr: 'उच्च > स्व > नीच > सम > मित्र', ta: 'Exalted > Own > Debilitated > Neutral > Friend', te: 'Exalted > Own > Debilitated > Neutral > Friend', bn: 'Exalted > Own > Debilitated > Neutral > Friend', kn: 'Exalted > Own > Debilitated > Neutral > Friend', gu: 'Exalted > Own > Debilitated > Neutral > Friend' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The seven-tier dignity hierarchy determines a planet\'s ability to deliver its promised results. Exaltation is the peak, Moolatrikona just below, own sign provides comfort, and debilitation is the lowest rung.', hi: 'सात-स्तरीय गरिमा क्रम ग्रह की प्रतिश्रुत फल देने की क्षमता निर्धारित करता है। उच्च शिखर है, मूलत्रिकोण उसके ठीक नीचे, स्वराशि सुविधा देती है, और नीच सबसे निम्न स्तर है।' },
  },
  {
    id: 'q9_3_10', type: 'true_false',
    question: { en: 'Mars is exalted in Capricorn and debilitated in Cancer.', hi: 'मंगल मकर में उच्च और कर्क में नीच होता है।', sa: 'मंगल मकर में उच्च और कर्क में नीच होता है।', mai: 'मंगल मकर में उच्च और कर्क में नीच होता है।', mr: 'मंगल मकर में उच्च और कर्क में नीच होता है।', ta: 'Mars is exalted in Capricorn and debilitated in Cancer.', te: 'Mars is exalted in Capricorn and debilitated in Cancer.', bn: 'Mars is exalted in Capricorn and debilitated in Cancer.', kn: 'Mars is exalted in Capricorn and debilitated in Cancer.', gu: 'Mars is exalted in Capricorn and debilitated in Cancer.' },
    correctAnswer: true,
    explanation: { en: 'Mars is exalted in Capricorn (deep exaltation at 28 degrees) where Saturn\'s disciplined, structured environment channels Mars\' raw energy productively. In Cancer, the emotional, receptive environment weakens Mars\' assertive nature.', hi: 'मंगल मकर में उच्च है (परम उच्च 28 अंश) जहाँ शनि का अनुशासित, संरचित वातावरण मंगल की कच्ची ऊर्जा को उत्पादक रूप से प्रवाहित करता है। कर्क में भावनात्मक, ग्रहणशील वातावरण मंगल के आक्रामक स्वभाव को कमजोर करता है।' },
  },
];

/* ─── Page 1: Exaltation (Uccha) ─────────────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'उच्च — ग्रह की शिखर शक्ति' : 'Exaltation (Uccha) — Peak Planetary Strength'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रत्येक ग्रह की एक विशिष्ट राशि होती है जहाँ वह अपने गुणों को अधिकतम शक्ति और स्पष्टता से व्यक्त करता है — यह उसकी उच्च राशि है। इसे ऐसे समझें कि ग्रह एक सम्मानित अतिथि है ऐसे गृहस्वामी के घर में जहाँ सब कुछ उसके स्वभाव से पूर्णतः मेल खाता है। उच्च ग्रह अपनी सूचकताएँ प्रचुर मात्रा में और सहजता से प्रदान करता है।</> : <>Every planet has one specific sign where it expresses its qualities with maximum power and clarity — this is its sign of exaltation (Uccha Rashi). Think of it as the planet being an honored guest in a host&apos;s home where everything aligns perfectly with its nature. An exalted planet delivers its significations abundantly and with ease.</>}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-gold-light text-left p-2">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-gold-light text-left p-2">{isHi ? 'उच्च' : 'Exalted In'}</th>
                <th className="text-gold-light text-left p-2">{isHi ? 'परम उच्च' : 'Deep Exaltation'}</th>
                <th className="text-gold-light text-left p-2">{isHi ? 'कारण' : 'Why'}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'सूर्य' : 'Sun'}</td><td className="p-2">{isHi ? 'मेष' : 'Aries'}</td><td className="p-2">10°</td><td className="p-2">Fire + initiative = peak authority</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'चन्द्र' : 'Moon'}</td><td className="p-2">{isHi ? 'वृषभ' : 'Taurus'}</td><td className="p-2">3°</td><td className="p-2">Earth stability nourishes emotions</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'मंगल' : 'Mars'}</td><td className="p-2">{isHi ? 'मकर' : 'Capricorn'}</td><td className="p-2">28°</td><td className="p-2">Discipline channels raw courage</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'बुध' : 'Mercury'}</td><td className="p-2">{isHi ? 'कन्या' : 'Virgo'}</td><td className="p-2">15°</td><td className="p-2">Analytical sign perfects intellect</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'बृहस्पति' : 'Jupiter'}</td><td className="p-2">{isHi ? 'कर्क' : 'Cancer'}</td><td className="p-2">5°</td><td className="p-2">Nurturing amplifies wisdom</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'शुक्र' : 'Venus'}</td><td className="p-2">{isHi ? 'मीन' : 'Pisces'}</td><td className="p-2">27°</td><td className="p-2">Spiritual love = highest beauty</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'शनि' : 'Saturn'}</td><td className="p-2">{isHi ? 'तुला' : 'Libra'}</td><td className="p-2">20°</td><td className="p-2">Justice + balance = ideal discipline</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'राहु' : 'Rahu'}</td><td className="p-2">{isHi ? 'वृषभ*' : 'Taurus'}</td><td className="p-2">20°</td><td className="p-2">Material mastery (per BPHS)</td></tr>
              <tr><td className="p-2">{isHi ? 'केतु' : 'Ketu'}</td><td className="p-2">{isHi ? 'वृश्चिक*' : 'Scorpio'}</td><td className="p-2">20°</td><td className="p-2">Occult depth (per BPHS)</td></tr>
            </tbody>
          </table>
          <p className="text-text-tertiary text-xs mt-1">{isHi ? <>* राहु/केतु का उच्च परम्परा अनुसार भिन्न है। कुछ मिथुन/धनु मानते हैं। BPHS वृषभ/वृश्चिक का समर्थन करता है।</> : <>* Rahu/Ketu exaltation varies by tradition. Some use Gemini/Sagittarius. BPHS supports Taurus/Scorpio.</>}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>उच्च अंश BPHS अध्याय 3 (श्लोक 51) और फलदीपिका अध्याय 2 में सूचीबद्ध हैं। ये विशिष्ट राशि-अंश संयोजन सभी ज्योतिष परम्पराओं में 2000 से अधिक वर्षों से अपरिवर्तित हैं। परम उच्च अंश वह है जहाँ ग्रह पूर्ण अधिकतम शक्ति पर पहुँचता है — ठीक 10° मेष सूर्य या 5° कर्क बृहस्पति अपने शिखर पर होता है।</> : <>Exaltation degrees are listed in BPHS Chapter 3 (Shloka 51) and Phaladeepika Chapter 2. These specific sign-degree combinations have remained unchanged for over 2000 years across all Jyotish traditions. The deep exaltation degree is where the planet reaches absolute maximum potency — a planet at exactly 10° Aries Sun or 5° Cancer Jupiter is at its peak.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Debilitation and Neecha Bhanga ─────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'नीच और उसका भंग' : 'Debilitation (Neecha) and Its Cancellation'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>नीच राशि उच्च से ठीक विपरीत (180°) होती है। यहाँ ग्रह दुर्बल होता है — अपने स्वाभाविक गुणों को व्यक्त करने में संघर्ष करता है। तुला में नीच सूर्य समझौते की राशि में अपना निर्णायक अधिकार खो देता है। कर्क में नीच मंगल भावनात्मक, पोषण वातावरण में आक्रामकता को उत्पादक रूप से प्रवाहित नहीं कर पाता।</> : <>The debilitation sign is exactly opposite (180°) from exaltation. Here the planet is weakened — it struggles to express its natural qualities. Sun debilitated in Libra loses its decisive authority in the sign of compromise. Mars debilitated in Cancer cannot channel aggression productively in the emotional, nurturing environment.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          However, Jyotish provides a remarkable escape clause: <strong className="text-gold-light">Neecha Bhanga</strong> (cancellation of debilitation). Five classical conditions from BPHS can cancel the weakness:
        </p>
        <div className="space-y-1.5 text-xs text-text-secondary mb-3">{isHi ? <><p>1. नीच राशि का स्वामी लग्न या चन्द्र से केन्द्र में हो</p>
          <p>2. जिस राशि में नीच ग्रह उच्च होता है उसका स्वामी लग्न या चन्द्र से केन्द्र में हो</p>
          <p>3. नीच ग्रह पर उसकी नीच राशि के स्वामी की दृष्टि हो</p>
          <p>4. नीच ग्रह नवमांश कुण्डली में उच्च का हो</p>
          <p>5. नीच ग्रह किसी उच्च ग्रह से युक्त हो</p></> : <><p>1. The lord of the debilitation sign is in a Kendra from Lagna or Moon</p>
          <p>2. The lord of the sign where the debilitated planet gets exalted is in a Kendra from Lagna or Moon</p>
          <p>3. The debilitated planet is aspected by its debilitation sign lord</p>
          <p>4. The debilitated planet is exalted in the Navamsha chart</p>
          <p>5. The debilitated planet is conjoined with an exalted planet</p></>}</div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण: नीचभंग' : 'Worked Example: Neecha Bhanga'}</h4>
        <ExampleChart
          ascendant={4}
          planets={{ 7: [4], 10: [6] }}
          title={isHi ? 'कर्क लग्न — बृहस्पति नीच सप्तम में, शनि दशम में' : 'Cancer Lagna — Jupiter debilitated in 7th, Saturn in 10th'}
          highlight={[7, 10]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> बृहस्पति मकर में नीच, सप्तम भाव में। मकर का स्वामी शनि है। यदि शनि केन्द्र में हो (मान लें, दशम भाव में मेष में), तो शर्त 1 पूरी होती है — नीचभंग होता है। प्रारम्भ में दुर्बल बृहस्पति शक्तिशाली बल में बदल जाता है। जातक को प्रारम्भ में संबंधों में चुनौतियाँ हो सकती हैं (नीच सप्तम भाव बृहस्पति), लेकिन अंततः प्रारम्भिक बाधाओं को पार करके एक असाधारण अर्थपूर्ण साझेदारी प्राप्त करता है।</> : <><span className="text-gold-light font-medium">Example:</span> Jupiter is debilitated in Capricorn in the 7th house. Capricorn is ruled by Saturn. If Saturn is placed in a Kendra (say, the 10th house in Aries), condition 1 is met — Neecha Bhanga occurs. The initially weak Jupiter transforms into a powerful force. The native may initially face relationship challenges (debilitated 7th house Jupiter), but ultimately achieves an exceptionally meaningful partnership after overcoming early obstacles.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रांतियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;नीच ग्रह का अर्थ है कि वह जीवन क्षेत्र बर्बाद है।&quot; यह दो स्तरों पर गलत है। पहला, नीचभंग की शर्तें बहुत सामान्य हैं — अधिकांश कुण्डलियों में कम से कम एक भंग होता है। दूसरा, भंग के बिना भी, नीच ग्रह ऐसी चुनौतियाँ उत्पन्न करता है जो विकास के लिए बाध्य करती हैं। कई अत्यंत सफल लोगों के पास नीच ग्रह होते हैं जो क्षतिपूर्ति के संघर्ष से उनकी महत्वाकांक्षा को संचालित करते हैं।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;A debilitated planet means that life area is doomed.&quot; This is wrong on two levels. First, Neecha Bhanga conditions are very common — most charts have at least one cancellation. Second, even without cancellation, a debilitated planet produces challenges that force growth. Many highly successful people have debilitated planets driving their ambition through the struggle to compensate.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Own Sign, Moolatrikona, and Dignity Hierarchy ──────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'स्वराशि, मूलत्रिकोण, और पूर्ण क्रम' : 'Own Sign, Moolatrikona, and the Full Hierarchy'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>उच्च और नीच के चरम बिन्दुओं के बीच पाँच मध्यवर्ती गरिमा स्तर हैं। <strong className="text-gold-light">स्वराशि (स्वक्षेत्र)</strong> में ग्रह घर पर होने जैसा है — सुविधाजनक, उत्पादक, आत्मनिर्भर। मेष या वृश्चिक में मंगल, वृषभ या तुला में शुक्र, धनु या मीन में बृहस्पति सभी स्वराशि में हैं। <strong className="text-gold-light">मूलत्रिकोण</strong> राशि में ग्रह अपने &quot;कार्यालय&quot; में है — वह राशि जहाँ वह अपना सबसे आवश्यक कार्य केन्द्रित दक्षता से करता है। यह स्वराशि से थोड़ा अधिक शक्तिशाली है।</> : <>Between the extremes of exaltation and debilitation lie five intermediate dignity levels. A planet in its <strong className="text-gold-light">own sign (Swakshetra)</strong> is like being at home — comfortable, productive, self-sufficient. Mars in Aries or Scorpio, Venus in Taurus or Libra, Jupiter in Sagittarius or Pisces are all in their own signs. A planet in its <strong className="text-gold-light">Moolatrikona</strong> sign is at its &quot;office&quot; — the sign where it performs its most essential function with focused efficiency. This is slightly stronger than own sign.</>}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-gold-light text-left p-2">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-gold-light text-left p-2">{isHi ? 'मूलत्रिकोण' : 'Moolatrikona'}</th>
                <th className="text-gold-light text-left p-2">{isHi ? 'स्वराशि' : 'Own Signs'}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'सूर्य' : 'Sun'}</td><td className="p-2">Leo 0°-20°</td><td className="p-2">{isHi ? 'सिंह' : 'Leo'}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'चन्द्र' : 'Moon'}</td><td className="p-2">Taurus 4°-20°</td><td className="p-2">{isHi ? 'कर्क' : 'Cancer'}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'मंगल' : 'Mars'}</td><td className="p-2">Aries 0°-12°</td><td className="p-2">{isHi ? 'मेष, वृश्चिक' : 'Aries, Scorpio'}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'बुध' : 'Mercury'}</td><td className="p-2">Virgo 16°-20°</td><td className="p-2">{isHi ? 'मिथुन, कन्या' : 'Gemini, Virgo'}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'बृहस्पति' : 'Jupiter'}</td><td className="p-2">Sagittarius 0°-10°</td><td className="p-2">{isHi ? 'धनु, मीन' : 'Sagittarius, Pisces'}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'शुक्र' : 'Venus'}</td><td className="p-2">Libra 0°-15°</td><td className="p-2">{isHi ? 'वृषभ, तुला' : 'Taurus, Libra'}</td></tr>
              <tr><td className="p-2">{isHi ? 'शनि' : 'Saturn'}</td><td className="p-2">Aquarius 0°-20°</td><td className="p-2">{isHi ? 'मकर, कुम्भ' : 'Capricorn, Aquarius'}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3 mt-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'मित्र और शत्रु राशियाँ' : 'Friend and Enemy Signs'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहों की प्राकृतिक मित्रता और शत्रुता होती है। बृहस्पति और सूर्य मित्र हैं — सिंह (सूर्य की राशि) में बृहस्पति सुविधाजनक है। शुक्र और सूर्य शत्रु हैं — सिंह में शुक्र असहज है। BPHS का <strong className="text-gold-light">पंचधा मैत्री</strong> (पाँच-स्तरीय संबंध) प्रणाली परिभाषित करती है: अधि मित्र, मित्र, सम, शत्रु, अधि शत्रु। ये गरिमा को संशोधित करती हैं: मित्र राशि में ग्रह शत्रु राशि की तुलना में अधिक प्रभावी होता है, भले ही कोई भी उच्च या नीच न हो।</> : <>Planets have natural friendships and enmities. Jupiter and Sun are friends — Jupiter in Leo (Sun&apos;s sign) is comfortable. Venus and Sun are enemies — Venus in Leo is uneasy. The <strong className="text-gold-light">Panchadha Maitri</strong> (five-fold relationship) system from BPHS defines: intimate friend, friend, neutral, enemy, bitter enemy. These modify the dignity: a planet in a friendly sign is more effective than in an enemy sign, even if neither is exalted or debilitated.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'पूर्ण गरिमा क्रम' : 'The Complete Hierarchy'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>शक्तिशाली से कमजोर: <strong className="text-gold-light">उच्च</strong> (ग्रह शिखर शक्ति पर) &gt; <strong className="text-gold-light">मूलत्रिकोण</strong> (केन्द्रित कर्तव्य) &gt; <strong className="text-gold-light">स्वराशि</strong> (सुविधाजनक) &gt; <strong className="text-gold-light">मित्र राशि</strong> (स्वागत अतिथि) &gt; <strong className="text-gold-light">सम राशि</strong> (उदासीन) &gt; <strong className="text-gold-light">शत्रु राशि</strong> (अस्वागत अतिथि) &gt; <strong className="text-gold-light">नीच</strong> (ग्रह सबसे कमजोर)।</> : <>From strongest to weakest: <strong className="text-gold-light">Exalted</strong> (planet at peak power) &gt; <strong className="text-gold-light">Moolatrikona</strong> (focused duty) &gt; <strong className="text-gold-light">Own Sign</strong> (comfortable) &gt; <strong className="text-gold-light">Friend&apos;s Sign</strong> (welcome guest) &gt; <strong className="text-gold-light">Neutral Sign</strong> (indifferent) &gt; <strong className="text-gold-light">Enemy&apos;s Sign</strong> (unwelcome guest) &gt; <strong className="text-gold-light">Debilitated</strong> (planet at weakest).</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा कुण्डली इंजन स्वचालित रूप से आपकी कुण्डली में प्रत्येक ग्रह की गरिमा का मूल्यांकन करता है। टिप्पणी उच्च और नीच ग्रहों की पहचान करती है, नीचभंग शर्तों की जाँच करती है, और समझाती है कि गरिमा प्रत्येक ग्रह की अपने भाव में फल देने की क्षमता को कैसे प्रभावित करती है। यह षड्बल शक्ति मूल्यांकन में एकीकृत है।</> : <>Our Kundali engine automatically evaluates every planet&apos;s dignity in your chart. The tippanni commentary identifies exalted and debilitated planets, checks for Neecha Bhanga conditions, and explains how dignity affects each planet&apos;s ability to deliver results in its house. This is integrated into the Shadbala strength assessment for a complete picture of planetary power.</>}</p>
      </section>
    </div>
  );
}

export default function Module9_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
