'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-3.json';

const META: ModuleMeta = {
  id: 'mod_22_3', phase: 9, topic: 'Astronomy', moduleNumber: '22.3',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q22_3_01', type: 'mcq',
    question: {
      en: 'Why is computing the Moon\'s position much harder than the Sun\'s?',
      hi: 'चन्द्रमा की स्थिति की गणना सूर्य से बहुत कठिन क्यों है?',
    },
    options: [
      { en: 'The Moon is farther away than the Sun', hi: 'चन्द्रमा सूर्य से दूर है', sa: 'चन्द्रमा सूर्य से दूर है', mai: 'चन्द्रमा सूर्य से दूर है', mr: 'चन्द्रमा सूर्य से दूर है', ta: 'நிலவு சூரியனை விட தொலைவில் உள்ளது', te: 'చంద్రుడు సూర్యుని కంటే దూరంగా ఉన్నాడు', bn: 'চন্দ্র সূর্যের চেয়ে দূরে', kn: 'ಚಂದ್ರ ಸೂರ್ಯನಿಗಿಂತ ದೂರದಲ್ಲಿದ್ದಾನೆ', gu: 'ચંદ્ર સૂર્ય કરતાં દૂર છે' },
      { en: 'The Moon is close, fast-moving, and strongly perturbed by the Sun\'s gravity', hi: 'चन्द्रमा निकट, तेज़ गतिमान और सूर्य के गुरुत्वाकर्षण से प्रबल रूप से विक्षुब्ध है' },
      { en: 'The Moon has an atmosphere that distorts observations', hi: 'चन्द्रमा का वायुमण्डल प्रेक्षणों को विकृत करता है', sa: 'चन्द्रमा का वायुमण्डल प्रेक्षणों को विकृत करता है', mai: 'चन्द्रमा का वायुमण्डल प्रेक्षणों को विकृत करता है', mr: 'चन्द्रमा का वायुमण्डल प्रेक्षणों को विकृत करता है', ta: 'நிலவுக்கு வளிமண்டலம் உள்ளது அது கவனிப்புகளை திரிக்கிறது', te: 'చంద్రునికి వాతావరణం ఉన్నది పరిశీలనలను వక్రీకరిస్తుంది', bn: 'চন্দ্রের বায়ুমণ্ডল পর্যবেক্ষণ বিকৃত করে', kn: 'ಚಂದ್ರನಿಗೆ ವಾಯುಮಂಡಲ ಇದ್ದು ಅವಲೋಕನಗಳನ್ನು ವಿಕೃತಗೊಳಿಸುತ್ತದೆ', gu: 'ચંદ્રને વાયુમંડળ છે જે અવલોકનોને વિકૃત કરે છે' },
      { en: 'The Moon changes shape each month', hi: 'चन्द्रमा प्रतिमास आकार बदलता है', sa: 'चन्द्रमा प्रतिमास आकार बदलता है', mai: 'चन्द्रमा प्रतिमास आकार बदलता है', mr: 'चन्द्रमा प्रतिमास आकार बदलता है', ta: 'நிலவு ஒவ்வொரு மாதமும் வடிவம் மாறுகிறது', te: 'చంద్రుడు ప్రతి నెలా ఆకారం మారుస్తాడు', bn: 'চন্দ্র প্রতি মাসে আকার পরিবর্তন করে', kn: 'ಚಂದ್ರ ಪ್ರತಿ ತಿಂಗಳು ಆಕಾರ ಬದಲಿಸುತ್ತಾನೆ', gu: 'ચંદ્ર દર મહિને આકાર બદલે છે' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Moon orbits Earth at 356,000-407,000 km (close enough for significant parallax), moves ~13.2°/day (13x faster than the Sun), and is strongly perturbed by the Sun. These factors require 60+ sine terms vs 3 for the Sun.',
      hi: 'चन्द्रमा पृथ्वी की 356,000-407,000 किमी पर कक्षा में है (महत्त्वपूर्ण लम्बन के लिए पर्याप्त निकट), ~13.2°/दिन चलता है (सूर्य से 13 गुना तेज़), और सूर्य द्वारा प्रबल रूप से विक्षुब्ध है। इन कारकों से सूर्य के 3 की तुलना में 60+ ज्या पद चाहिए।',
    },
  },
  {
    id: 'q22_3_02', type: 'mcq',
    question: {
      en: 'What are the five fundamental arguments used in Moon position calculations?',
      hi: 'चन्द्र स्थिति गणना में प्रयुक्त पाँच मूलभूत तर्क कौन-से हैं?',
    },
    options: [
      { en: 'L₀, M, C, Ω, ε', hi: 'L₀, M, C, Ω, ε', sa: 'L₀, M, C, Ω, ε', mai: 'L₀, M, C, Ω, ε', mr: 'L₀, M, C, Ω, ε', ta: 'L₀, M, C, Ω, ε', te: 'L₀, M, C, Ω, ε', bn: 'L₀, M, C, Ω, ε', kn: 'L₀, M, C, Ω, ε', gu: 'L₀, M, C, Ω, ε' },
      { en: 'L\', D, M, M\', F', hi: 'L\', D, M, M\', F' },
      { en: 'α, δ, H, φ, λ', hi: 'α, δ, H, φ, λ', sa: 'α, δ, H, φ, λ', mai: 'α, δ, H, φ, λ', mr: 'α, δ, H, φ, λ', ta: 'α, δ, H, φ, λ', te: 'α, δ, H, φ, λ', bn: 'α, δ, H, φ, λ', kn: 'α, δ, H, φ, λ', gu: 'α, δ, H, φ, λ' },
      { en: 'T, JD, UT, TT, TAI', hi: 'T, JD, UT, TT, TAI', sa: 'T, JD, UT, TT, TAI', mai: 'T, JD, UT, TT, TAI', mr: 'T, JD, UT, TT, TAI', ta: 'T, JD, UT, TT, TAI', te: 'T, JD, UT, TT, TAI', bn: 'T, JD, UT, TT, TAI', kn: 'T, JD, UT, TT, TAI', gu: 'T, JD, UT, TT, TAI' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The five arguments are: L\' (Moon\'s mean longitude), D (mean elongation from Sun), M (Sun\'s mean anomaly), M\' (Moon\'s mean anomaly), and F (Moon\'s argument of latitude — distance from ascending node along orbit).',
      hi: 'पाँच तर्क हैं: L\' (चन्द्र माध्य भोगांश), D (सूर्य से माध्य दीर्घीकरण), M (सूर्य की माध्य विलम्बिका), M\' (चन्द्र माध्य विलम्बिका), और F (चन्द्र अक्षांश तर्क — कक्षा में आरोही पात से दूरी)।',
    },
  },
  {
    id: 'q22_3_03', type: 'mcq',
    question: {
      en: 'The largest correction term for the Moon\'s longitude (+6.289° x sin(M\')) is called:',
      hi: 'चन्द्र भोगांश का सबसे बड़ा सुधार पद (+6.289° × sin(M\')) कहलाता है:',
    },
    options: [
      { en: 'Evection', hi: 'उपवर्तन (इवेक्शन)', sa: 'उपवर्तनम् (इवेक्शन)', mai: 'उपवर्तन (इवेक्शन)', mr: 'उपवर्तन (इवेक्शन)', ta: 'இவெக்ஷன்', te: 'ఇవెక్షన్', bn: 'ইভেকশন', kn: 'ಇವೆಕ್ಷನ್', gu: 'ઇવેક્શન' },
      { en: 'The main inequality (equation of center)', hi: 'मुख्य असमता (केन्द्र समीकरण)', sa: 'मुख्य असमता (केन्द्र समीकरण)', mai: 'मुख्य असमता (केन्द्र समीकरण)', mr: 'मुख्य असमता (केन्द्र समीकरण)', ta: 'முதன்மை சமனின்மை (மைய சமன்பாடு)', te: 'ప్రధాన అసమానత (కేంద్ర సమీకరణం)', bn: 'প্রধান অসমতা (কেন্দ্র সমীকরণ)', kn: 'ಮುಖ್ಯ ಅಸಮಾನತೆ (ಕೇಂದ್ರ ಸಮೀಕರಣ)', gu: 'મુખ્ય અસમાનતા (કેન્દ્ર સમીકરણ)' },
      { en: 'Variation', hi: 'विचरण (वेरिएशन)', sa: 'विचरणम् (वेरिएशन)', mai: 'विचरण (वेरिएशन)', mr: 'विचरण (व्हेरिएशन)', ta: 'மாறுபாடு', te: 'వైవిధ్యం', bn: 'বিচরণ', kn: 'ವ್ಯತ್ಯಯ', gu: 'વિચરણ' },
      { en: 'Annual inequality', hi: 'वार्षिक असमता', sa: 'वार्षिकासमता', mai: 'वार्षिक असमता', mr: 'वार्षिक असमानता', ta: 'வருடாந்திர சமனின்மை', te: 'వార్షిక అసమానత', bn: 'বার্ষিক অসমতা', kn: 'ವಾರ್ಷಿಕ ಅಸಮಾನತೆ', gu: 'વાર્ષિક અસમાનતા' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The +6.289° term is the "main inequality" or equation of center — the correction for the Moon\'s elliptical orbit, analogous to the Sun\'s 1.915° term. It is 3.3x larger because the Moon\'s orbital eccentricity (~0.055) is 3.2x greater than Earth\'s (~0.017).',
      hi: '+6.289° पद "मुख्य असमता" या केन्द्र समीकरण है — चन्द्र दीर्घवृत्तीय कक्षा का सुधार, सूर्य के 1.915° पद के सदृश। यह 3.3 गुना बड़ा है क्योंकि चन्द्र कक्षा की उत्केन्द्रता (~0.055) पृथ्वी की (~0.017) से 3.2 गुना अधिक है।',
    },
  },
  {
    id: 'q22_3_04', type: 'mcq',
    question: {
      en: 'The second-largest term (+1.274° x sin(2D - M\')) is called evection. What causes it?',
      hi: 'दूसरा सबसे बड़ा पद (+1.274° × sin(2D - M\')) उपवर्तन कहलाता है। इसका कारण क्या है?',
    },
    options: [
      { en: 'Jupiter\'s gravitational pull on the Moon', hi: 'बृहस्पति का चन्द्रमा पर गुरुत्वाकर्षण' },
      { en: 'The Sun\'s gravity modulating the Moon\'s orbital eccentricity', hi: 'सूर्य का गुरुत्वाकर्षण चन्द्र कक्षा की उत्केन्द्रता को नियन्त्रित करता है' },
      { en: 'Earth\'s oblateness', hi: 'पृथ्वी की चपटाई' },
      { en: 'Tidal friction', hi: 'ज्वारीय घर्षण', sa: 'ज्वारघर्षणम्', mai: 'ज्वारीय घर्षण', mr: 'भरतीघर्षण', ta: 'அலை உராய்வு', te: 'జ్వార ఘర్షణ', bn: 'জোয়ার ঘর্ষণ', kn: 'ಉಬ್ಬರ ಘರ್ಷಣೆ', gu: 'ભરતી ઘર્ષણ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Evection is caused by the Sun\'s gravitational perturbation of the Moon\'s orbit. The Sun alternately stretches and compresses the Moon\'s orbit, modulating its eccentricity with a period related to the synodic month. This was discovered by Ptolemy around 150 CE.',
      hi: 'उपवर्तन सूर्य के गुरुत्वाकर्षण द्वारा चन्द्र कक्षा के विक्षोभन से होता है। सूर्य बारी-बारी से चन्द्र कक्षा को खींचता और सिकोड़ता है, सिनोडिक मास से सम्बन्धित अवधि में उत्केन्द्रता नियन्त्रित करता है। इसकी खोज टॉलेमी ने लगभग 150 ई. में की थी।',
    },
  },
  {
    id: 'q22_3_05', type: 'true_false',
    question: {
      en: 'The eccentricity correction factor E = 1 - 0.002516 x T is applied to all 60 sine terms equally.',
      hi: 'उत्केन्द्रता सुधार गुणक E = 1 - 0.002516 × T सभी 60 ज्या पदों पर समान रूप से लागू होता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The E factor is only applied to terms that involve the Sun\'s mean anomaly M. Terms with M are multiplied by E; terms with 2M are multiplied by E². Terms not involving M are unaffected. This corrects for the slow decrease in Earth\'s orbital eccentricity over time.',
      hi: 'असत्य। E गुणक केवल उन पदों पर लागू होता है जिनमें सूर्य की माध्य विलम्बिका M शामिल है। M वाले पद E से गुणित; 2M वाले E² से। M रहित पद अप्रभावित रहते हैं। यह समय के साथ पृथ्वी की कक्षीय उत्केन्द्रता की धीमी कमी को सुधारता है।',
    },
  },
  {
    id: 'q22_3_06', type: 'mcq',
    question: {
      en: 'How fast does the Moon move along the ecliptic per day?',
      hi: 'चन्द्रमा प्रतिदिन क्रान्तिवृत्त पर कितना चलता है?',
    },
    options: [
      { en: '~1°/day', hi: '~1°/दिन', sa: '~1°/दिन', mai: '~1°/दिन', mr: '~1°/दिन', ta: '~1°/நாள்', te: '~1°/రోజు', bn: '~1°/দিন', kn: '~1°/ದಿನ', gu: '~1°/દિવસ' },
      { en: '~5°/day', hi: '~5°/दिन', sa: '~5°/दिन', mai: '~5°/दिन', mr: '~5°/दिन', ta: '~5°/நாள்', te: '~5°/రోజు', bn: '~5°/দিন', kn: '~5°/ದಿನ', gu: '~5°/દિવસ' },
      { en: '~13.2°/day', hi: '~13.2°/दिन', sa: '~13.2°/दिन', mai: '~13.2°/दिन', mr: '~13.2°/दिन', ta: '~13.2°/நாள்', te: '~13.2°/రోజు', bn: '~13.2°/দিন', kn: '~13.2°/ದಿನ', gu: '~13.2°/દિવસ' },
      { en: '~30°/day', hi: '~30°/दिन', sa: '~30°/दिन', mai: '~30°/दिन', mr: '~30°/दिन', ta: '~30°/நாள்', te: '~30°/రోజు', bn: '~30°/দিন', kn: '~30°/ದಿನ', gu: '~30°/દિવસ' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Moon moves approximately 13.2° per day (360° / 27.3 days). This is about 13 times faster than the Sun\'s ~1°/day. The actual rate varies from about 11.8° to 14.4° per day due to the Moon\'s elliptical orbit.',
      hi: 'चन्द्रमा प्रतिदिन लगभग 13.2° चलता है (360° / 27.3 दिन)। यह सूर्य के ~1°/दिन से लगभग 13 गुना तेज़ है। वास्तविक दर चन्द्र दीर्घवृत्तीय कक्षा के कारण लगभग 11.8° से 14.4° प्रतिदिन भिन्न होती है।',
    },
  },
  {
    id: 'q22_3_07', type: 'mcq',
    question: {
      en: 'The Moon\'s latitude can swing up to:',
      hi: 'चन्द्रमा का अक्षांश अधिकतम कितना हो सकता है:',
    },
    options: [
      { en: '±1.3°', hi: '±1.3°', sa: '±1.3°', mai: '±1.3°', mr: '±1.3°', ta: '±1.3°', te: '±1.3°', bn: '±1.3°', kn: '±1.3°', gu: '±1.3°' },
      { en: '±5.3°', hi: '±5.3°', sa: '±5.3°', mai: '±5.3°', mr: '±5.3°', ta: '±5.3°', te: '±5.3°', bn: '±5.3°', kn: '±5.3°', gu: '±5.3°' },
      { en: '±23.4°', hi: '±23.4°', sa: '±23.4°', mai: '±23.4°', mr: '±23.4°', ta: '±23.4°', te: '±23.4°', bn: '±23.4°', kn: '±23.4°', gu: '±23.4°' },
      { en: '±0.5°', hi: '±0.5°', sa: '±0.5°', mai: '±0.5°', mr: '±0.5°', ta: '±0.5°', te: '±0.5°', bn: '±0.5°', kn: '±0.5°', gu: '±0.5°' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Moon\'s orbit is tilted about 5.14° to the ecliptic, so its latitude oscillates between approximately ±5.3° (including perturbation effects). This matters for moonrise calculations and eclipse geometry.',
      hi: 'चन्द्र कक्षा क्रान्तिवृत्त से लगभग 5.14° झुकी है, अतः इसका अक्षांश लगभग ±5.3° (विक्षोभ प्रभाव सहित) के बीच दोलन करता है। यह चन्द्रोदय गणना और ग्रहण ज्यामिति के लिए महत्त्वपूर्ण है।',
    },
  },
  {
    id: 'q22_3_08', type: 'true_false',
    question: {
      en: 'The Moon\'s distance from Earth is computed using cosine terms from the same Meeus Table 47.A used for longitude.',
      hi: 'चन्द्रमा की पृथ्वी से दूरी उसी मीयस सारणी 47.A के कोज्या पदों से गणित होती है जो भोगांश के लिए प्रयुक्त है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Table 47.A provides both sine coefficients (for longitude correction ΔL) and cosine coefficients (for distance correction ΔR) using the same D, M, M\', F arguments. The 14 largest cosine terms give the distance, from which horizontal parallax is derived.',
      hi: 'सत्य। सारणी 47.A उन्हीं D, M, M\', F तर्कों का उपयोग करते हुए ज्या गुणांक (भोगांश सुधार ΔL के लिए) और कोज्या गुणांक (दूरी सुधार ΔR के लिए) दोनों प्रदान करती है। 14 सबसे बड़े कोज्या पद दूरी देते हैं, जिससे क्षैतिज लम्बन प्राप्त होता है।',
    },
  },
  {
    id: 'q22_3_09', type: 'mcq',
    question: {
      en: 'What accuracy does the Meeus algorithm achieve for the Moon\'s longitude?',
      hi: 'मीयस एल्गोरिदम चन्द्र भोगांश के लिए कितनी सटीकता प्राप्त करता है?',
    },
    options: [
      { en: '~0.01° (same as Sun)', hi: '~0.01° (सूर्य के समान)', sa: '~0.01° (सूर्य के समान)', mai: '~0.01° (सूर्य के समान)', mr: '~0.01° (सूर्य के समान)', ta: '~0.01° (சூரியனைப் போன்றது)', te: '~0.01° (సూర్యుని వలెనే)', bn: '~0.01° (সূর্যের মতোই)', kn: '~0.01° (ಸೂರ್ಯನಂತೆಯೇ)', gu: '~0.01° (સૂર્ય જેવું જ)' },
      { en: '~0.3° (about 10 arcminutes)', hi: '~0.3° (लगभग 10 कला)', sa: '~0.3° (लगभग 10 कला)', mai: '~0.3° (लगभग 10 कला)', mr: '~0.3° (लगभग 10 कला)', ta: '~0.3° (சுமார் 10 கோண நிமிடங்கள்)', te: '~0.3° (సుమారు 10 ఆర్క్‌నిమిషాలు)', bn: '~0.3° (প্রায় 10 আর্কমিনিট)', kn: '~0.3° (ಸುಮಾರು 10 ಆರ್ಕ್‌ನಿಮಿಷ)', gu: '~0.3° (લગભગ 10 આર્કમિનિટ)' },
      { en: '~1° (about 1 degree)', hi: '~1° (लगभग 1 अंश)', sa: '~1° (लगभग 1 अंश)', mai: '~1° (लगभग 1 अंश)', mr: '~1° (लगभग 1 अंश)', ta: '~1° (சுமார் 1 பாகை)', te: '~1° (సుమారు 1 డిగ్రీ)', bn: '~1° (প্রায় 1 ডিগ্রি)', kn: '~1° (ಸುಮಾರು 1 ಡಿಗ್ರಿ)', gu: '~1° (લગભગ 1 ડિગ્રી)' },
      { en: '~0.001°', hi: '~0.001°', sa: '~0.001°', mai: '~0.001°', mr: '~0.001°', ta: '~0.001°', te: '~0.001°', bn: '~0.001°', kn: '~0.001°', gu: '~0.001°' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 60-term Meeus algorithm gives ~0.3° accuracy for the Moon. This is 30x worse than the Sun\'s 0.01° because of the Moon\'s extremely complex orbit. For Panchang, ~0.3° ≈ ~30 minutes of Moon transit time — acceptable for daily use but not for precise eclipse timing.',
      hi: '60-पद मीयस एल्गोरिदम चन्द्रमा के लिए ~0.3° सटीकता देता है। यह सूर्य के 0.01° से 30 गुना कम है क्योंकि चन्द्र कक्षा अत्यन्त जटिल है। पंचांग के लिए ~0.3° ≈ ~30 मिनट चन्द्र गोचर समय — दैनिक उपयोग हेतु स्वीकार्य किन्तु सटीक ग्रहण समय के लिए नहीं।',
    },
  },
  {
    id: 'q22_3_10', type: 'mcq',
    question: {
      en: 'The horizontal parallax (HP) of the Moon is computed as sin(HP) = 6378/distance. What is its typical value?',
      hi: 'चन्द्रमा का क्षैतिज लम्बन (HP) sin(HP) = 6378/दूरी से गणित होता है। इसका सामान्य मान क्या है?',
    },
    options: [
      { en: '~8.8 arcseconds (like the Sun)', hi: '~8.8 कला-सेकण्ड (सूर्य की तरह)', sa: '~8.8 कला-सेकण्ड (सूर्य की तरह)', mai: '~8.8 कला-सेकण्ड (सूर्य की तरह)', mr: '~8.8 कला-सेकण्ड (सूर्य की तरह)', ta: '~8.8 ஆர்க்செகண்டுகள் (சூரியனைப் போல)', te: '~8.8 ఆర్క్‌సెకన్లు (సూర్యుని వంటిది)', bn: '~8.8 আর্কসেকেন্ড (সূর্যের মতো)', kn: '~8.8 ಆರ್ಕ್‌ಸೆಕೆಂಡ್ (ಸೂರ್ಯನಂತೆ)', gu: '~8.8 આર્કસેકન્ડ (સૂર્ય જેવું)' },
      { en: '~57 arcminutes (about 1°)', hi: '~57 कला (लगभग 1°)', sa: '~57 कला (लगभग 1°)', mai: '~57 कला (लगभग 1°)', mr: '~57 कला (लगभग 1°)', ta: '~57 கோண நிமிடங்கள் (சுமார் 1°)', te: '~57 ఆర్క్‌నిమిషాలు (సుమారు 1°)', bn: '~57 আর্কমিনিট (প্রায় 1°)', kn: '~57 ಆರ್ಕ್‌ನಿಮಿಷ (ಸುಮಾರು 1°)', gu: '~57 આર્કમિનિટ (લગભગ 1°)' },
      { en: '~5 degrees', hi: '~5 अंश', sa: '~5 अंश', mai: '~5 अंश', mr: '~5 अंश', ta: '~5 பாகைகள்', te: '~5 డిగ్రీలు', bn: '~5 ডিগ্রি', kn: '~5 ಡಿಗ್ರಿ', gu: '~5 ડિગ્રી' },
      { en: '~0.1 arcseconds', hi: '~0.1 कला-सेकण्ड', sa: '~0.1 कला-सेकण्ड', mai: '~0.1 कला-सेकण्ड', mr: '~0.1 कला-सेकण्ड', ta: '~0.1 கோண வினாடிகள்', te: '~0.1 ఆర్క్‌సెకన్లు', bn: '~0.1 আর্কসেকেন্ড', kn: '~0.1 ಆರ್ಕ್‌ಸೆಕೆಂಡ್', gu: '~0.1 આર્કસેકન્ડ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Moon\'s horizontal parallax ranges from about 54\' to 61\' (averaging ~57\', nearly 1°). This is huge compared to the Sun\'s 8.8" — it means the Moon\'s observed position from the surface of Earth differs by nearly a full degree from its geocentric position at the horizon.',
      hi: 'चन्द्रमा का क्षैतिज लम्बन लगभग 54\' से 61\' (औसत ~57\', लगभग 1°) तक होता है। सूर्य के 8.8" की तुलना में यह विशाल है — इसका अर्थ है कि पृथ्वी की सतह से चन्द्रमा की प्रेक्षित स्थिति क्षितिज पर भूकेन्द्रीय स्थिति से लगभग एक पूर्ण अंश भिन्न होती है।',
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
          {tl({ en: 'Why the Moon Is the Hardest Object to Track', hi: 'चन्द्रमा सबसे कठिन पिण्ड क्यों है', sa: 'चन्द्रमा सबसे कठिन पिण्ड क्यों है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्य को 0.01 अंश सटीकता के लिए केवल 3 ज्या पद चाहिए। चन्द्रमा को 60 चाहिए। इतना नाटकीय अन्तर क्यों? तीन कारक मिलकर चन्द्र गति को असाधारण रूप से जटिल बनाते हैं। पहला, निकटता: चन्द्रमा 356,000 से 407,000 किमी पर कक्षा में है — इतना निकट कि लम्बन (पृथ्वी सतह पर प्रेक्षक के स्थान से दृश्य स्थिति में खिसकाव) लगभग 1 अंश तक पहुँचता है। दूसरा, गति: चन्द्रमा ~13.2 अंश प्रतिदिन तय करता है, 27.3 दिनों में पूर्ण कक्षा पूर्ण करता है। स्थिति में छोटी प्रतिशत त्रुटि समय में बड़ी त्रुटि बनती है। तीसरा और सबसे महत्त्वपूर्ण, सूर्य का गुरुत्वाकर्षण: सूर्य चन्द्रमा को पृथ्वी के तुल्य बल से खींचता है, जिससे भारी विक्षोभ उत्पन्न होते हैं जो सूर्य की दृश्य गति में विद्यमान ही नहीं हैं।</> : <>The Sun required just 3 sine terms for 0.01-degree accuracy. The Moon needs 60. Why such a dramatic difference? Three factors conspire to make lunar motion extraordinarily complex. First, proximity: the Moon orbits at 356,000 to 407,000 km — close enough that parallax (the shift in apparent position due to the observer&apos;s location on Earth&apos;s surface) reaches nearly 1 degree. Second, speed: the Moon covers ~13.2 degrees per day, completing a full orbit in 27.3 days. A small percentage error in position means a large error in time. Third and most importantly, the Sun&apos;s gravity: the Sun pulls on the Moon with a force comparable to Earth&apos;s, creating massive perturbations that simply don&apos;t exist for the Sun&apos;s apparent motion.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पाँच मूलभूत तर्क सभी चन्द्र स्थिति गणनाओं को चलाते हैं। L&apos; (चन्द्र माध्य भोगांश) ≈ 218.32° + 481267.88° × T — ध्यान दें दर सूर्य के 36000.77° से 13.2 गुना तेज़ है। D (माध्य दीर्घीकरण) = 297.85° + 445267.11° × T चन्द्रमा और सूर्य के बीच कोणीय पृथक्करण मापता है। M (सूर्य माध्य विलम्बिका) = 357.53° + 35999.05° × T — वही M जो सौर एल्गोरिदम में प्रयुक्त है। M&apos; (चन्द्र माध्य विलम्बिका) = 134.96° + 477198.87° × T चन्द्र दीर्घवृत्तीय कक्षा में स्थिति ट्रैक करता है। F (अक्षांश तर्क) = 93.27° + 483202.02° × T चन्द्रमा की कक्षीय आरोही पात से दूरी मापता है।</> : <>Five fundamental arguments drive all Moon position calculations. L&apos; (Moon&apos;s mean longitude) ≈ 218.32° + 481267.88° x T — note the rate is 13.2x faster than the Sun&apos;s 36000.77°. D (mean elongation) = 297.85° + 445267.11° x T measures the angular separation between the Moon and Sun. M (Sun&apos;s mean anomaly) = 357.53° + 35999.05° x T — the same M used in the solar algorithm. M&apos; (Moon&apos;s mean anomaly) = 134.96° + 477198.87° x T tracks position in the Moon&apos;s elliptical orbit. F (argument of latitude) = 93.27° + 483202.02° x T measures the Moon&apos;s distance from its orbital ascending node.</>}</p>
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
          {tl({ en: 'Meeus Table 47.A — The 60 Sine Terms', hi: 'मीयस सारणी 47.A — 60 ज्या पद', sa: 'मीयस सारणी 47.A — 60 ज्या पद' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सारणी 47.A के 60 पदों में से प्रत्येक का रूप है: ΔL = गुणांक × sin(a × D + b × M + c × M&apos; + d × F), जहाँ a, b, c, d छोटे पूर्णांक (सामान्यतः -2 से +4) हैं और गुणांक कला-सेकण्ड में है। सबसे बड़े पद एक भौतिक कथा कहते हैं। प्रथम पद, +6.289° × sin(M&apos;), &quot;मुख्य असमता&quot; है — चन्द्र दीर्घवृत्तीय कक्षा का केन्द्र समीकरण। जैसे सूर्य के पास 1.915° × sin(M) है, चन्द्रमा के पास 6.289° × sin(M&apos;) है — 3.3 गुना बड़ा क्योंकि चन्द्र कक्षा उत्केन्द्रता (0.055) पृथ्वी की (0.017) से 3.2 गुना अधिक है।</> : <>Each of the 60 terms in Table 47.A has the form: ΔL = coefficient x sin(a x D + b x M + c x M&apos; + d x F), where a, b, c, d are small integers (typically -2 to +4) and the coefficient is in arc-seconds. The largest terms tell a physical story. The first term, +6.289° x sin(M&apos;), is the &quot;main inequality&quot; — the equation of center for the Moon&apos;s elliptical orbit. Just as the Sun has 1.915° x sin(M), the Moon has 6.289° x sin(M&apos;) — 3.3 times larger because the Moon&apos;s orbital eccentricity (0.055) is 3.2 times greater than Earth&apos;s (0.017).</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दूसरा पद, +1.274° × sin(2D - M&apos;), &quot;उपवर्तन&quot; (इवेक्शन) है — टॉलेमी द्वारा लगभग 150 ई. में खोजा गया। यह सूर्य का गुरुत्वाकर्षण विक्षोभ है जो चन्द्र कक्षा उत्केन्द्रता को नियन्त्रित करता है। तीसरा पद, +0.658° × sin(2D), &quot;विचरण&quot; (वेरिएशन) है — टाइको ब्राहे ने 1590 में खोजा। इससे अमावस्या और पूर्णिमा पर चन्द्रमा तेज़ और अष्टमी पर धीमा चलता है। ये तीन पद अकेले लगभग 8.2° सुधार करते हैं, किन्तु शेष 57 पद संचयी रूप से ~2° और योगदान करते हैं, इसलिए उप-अंश सटीकता हेतु सभी 60 आवश्यक हैं।</> : <>The second term, +1.274° x sin(2D - M&apos;), is &quot;evection&quot; — discovered by Ptolemy around 150 CE. This is the Sun&apos;s gravitational perturbation modulating the Moon&apos;s orbital eccentricity. The third term, +0.658° x sin(2D), is the &quot;variation&quot; — discovered by Tycho Brahe in 1590. It causes the Moon to speed up at new and full moon and slow down at the quarters. These three terms alone account for about 8.2° of correction, but the remaining 57 terms contribute another ~2° cumulatively, which is why all 60 are needed for sub-degree accuracy.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Eccentricity Correction', hi: 'उत्केन्द्रता सुधार', sa: 'उत्केन्द्रता सुधार' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>एक सूक्ष्म किन्तु महत्त्वपूर्ण विवरण: सूर्य की माध्य विलम्बिका M वाले पदों को पृथ्वी की कक्षीय उत्केन्द्रता की धीमी कमी हेतु सुधारित करना चाहिए। गुणक E = 1 - 0.002516 × T - 0.0000074 × T² लागू होता है: M वाले पद E से गुणित, 2M वाले E² से। हमारे वर्तमान युगारम्भ (T ≈ 0.26) के लिए E ≈ 0.9993 — एक छोटा सुधार, किन्तु यह शताब्दियों में संचित होता है और एल्गोरिदम को ऐतिहासिक और भविष्य की तिथियों के लिए सटीक बनाए रखता है।</> : <>A subtle but important detail: terms involving the Sun&apos;s mean anomaly M must be corrected for the slow decrease in Earth&apos;s orbital eccentricity. The factor E = 1 - 0.002516 x T - 0.0000074 x T² is applied: terms with M are multiplied by E, terms with 2M by E². For our current epoch (T ≈ 0.26), E ≈ 0.9993 — a tiny correction, but it accumulates over centuries and ensures the algorithm remains accurate for historical and future dates.</>}</p>
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
          {tl({ en: 'Latitude, Distance, and Accuracy', hi: 'अक्षांश, दूरी और सटीकता', sa: 'अक्षांश, दूरी और सटीकता' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चन्द्र अक्षांश (क्रान्तिवृत्त के ऊपर या नीचे कोणीय दूरी) मीयस सारणी 47.B से उन्हीं D, M, M&apos;, F तर्कों वाले 13 ज्या पदों द्वारा गणित होता है। चन्द्र कक्षा क्रान्तिवृत्त से ~5.14° झुकी है, अतः इसका अक्षांश ±5.3° (विक्षोभ सहित) तक झूलता है। अक्षांश दो व्यावहारिक कारणों से महत्त्वपूर्ण है: यह चन्द्रोदय समय प्रभावित करता है (+5° अक्षांश पर चन्द्रमा उत्तरी अक्षांशों पर पहले उदित होता है) और यह निर्धारित करता है कि अमावस्या/पूर्णिमा ग्रहण उत्पन्न करेगी (ग्रहण तभी होते हैं जब चन्द्रमा क्रान्तिवृत्त के अत्यन्त निकट हो, अर्थात पात के निकट जहाँ F ≈ 0° या 180°)।</> : <>The Moon&apos;s latitude (angular distance above or below the ecliptic) is computed from Meeus Table 47.B using 13 sine terms with the same D, M, M&apos;, F arguments. The Moon&apos;s orbit is tilted ~5.14° to the ecliptic, so its latitude swings up to ±5.3° (including perturbations). Latitude matters for two practical reasons: it affects moonrise timing (a Moon at +5° latitude rises earlier at northern latitudes) and it determines whether a new/full moon produces an eclipse (eclipses occur only when the Moon is very close to the ecliptic, i.e., near a node where F ≈ 0° or 180°).</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चन्द्र दूरी सारणी 47.A के 14 कोज्या पदों से गणित होती है। माध्य दूरी 385,001 किमी है, किन्तु यह लगभग 356,000 किमी (उपभू) से 407,000 किमी (अपभू) तक भिन्न होती है। दूरी से हम क्षैतिज लम्बन प्राप्त करते हैं: sin(HP) = 6378.14 / दूरी, जहाँ 6378.14 किमी पृथ्वी की विषुवतीय त्रिज्या है। HP लगभग 54&apos; (अपभू) से 61&apos; (उपभू) तक होता है। यह लगभग 1 अंश का लम्बन चन्द्रोदय गणनाओं के लिए अत्यन्त महत्त्वपूर्ण है — इसका अर्थ है कि सतह से चन्द्रमा की प्रेक्षित स्थिति सैद्धान्तिक भूकेन्द्रीय स्थिति से महत्त्वपूर्ण रूप से भिन्न होती है।</> : <>The Moon&apos;s distance is computed from 14 cosine terms in Table 47.A. The mean distance is 385,001 km, but it varies from about 356,000 km (perigee) to 407,000 km (apogee). From the distance we derive the horizontal parallax: sin(HP) = 6378.14 / distance, where 6378.14 km is Earth&apos;s equatorial radius. HP ranges from about 54&apos; (apogee) to 61&apos; (perigee). This nearly 1-degree parallax is critical for moonrise calculations — it means the Moon&apos;s observed position from the surface differs significantly from the theoretical geocentric position.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Accuracy Limits', hi: 'सटीकता सीमाएँ', sa: 'सटीकता सीमाएँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">हमारे इंजन की सटीकता:</span> भोगांश में ~0.3° (लगभग 10 कला)। चन्द्रमा ~13.2°/दिन चलता है, अतः 0.3° त्रुटि गोचर भविष्यवाणियों के लिए लगभग 30 मिनट समय में बदलती है। यह निर्धारित करने के लिए पर्याप्त है कि सूर्योदय पर कौन-सा नक्षत्र, तिथि या योग सक्रिय है, किन्तु इसका अर्थ है कि हमारी तिथि संक्रमण समय उच्च-सटीकता एफेमेरिस से ~30 मिनट तक भिन्न हो सकते हैं।</> : <><span className="text-gold-light font-medium">Our engine&apos;s accuracy:</span> ~0.3° in longitude (about 10 arcminutes). Since the Moon moves ~13.2°/day, a 0.3° error translates to about 30 minutes of time for transit predictions. This is sufficient for determining which Nakshatra, Tithi, or Yoga is active at sunrise, but it means our tithi transition times may be off by up to ~30 minutes from high-precision ephemerides.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा moonLongitude(jd) फ़ंक्शन सारणी 47.A के सभी 60 ज्या पद लागू करता है, उत्केन्द्रता सुधार E गणित करता है, और चन्द्रमा का भूकेन्द्रीय सायन भोगांश लौटाता है। यह प्रत्येक पंचांग तत्व के लिए बुलाया जाता है जो चन्द्रमा पर निर्भर है: तिथि (चन्द्र-सूर्य कोण), नक्षत्र (चन्द्र निरयन स्थिति), योग (सूर्य+चन्द्र योग), करण (अर्ध-तिथि), और चन्द्रोदय/चन्द्रास्त समय। 60-पद गणना आधुनिक हार्डवेयर पर माइक्रोसेकण्ड में चलती है — मीयस ने शताब्दियों के चन्द्र सिद्धान्त को कितनी कुशलता से संक्षिप्त एल्गोरिदम में संकलित किया, इसका प्रमाण।</> : <>Our moonLongitude(jd) function implements all 60 sine terms from Table 47.A, computes the eccentricity correction E, and returns the Moon&apos;s geocentric tropical longitude. This is called for every Panchang element that depends on the Moon: Tithi (Moon-Sun angle), Nakshatra (Moon&apos;s sidereal position), Yoga (Sun+Moon sum), Karana (half-tithi), and moonrise/moonset timing. The 60-term computation runs in microseconds on modern hardware — a testament to how efficiently Meeus distilled centuries of lunar theory into a compact algorithm.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}