'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/21-1.json';

const META: ModuleMeta = {
  id: 'mod_21_1', phase: 8, topic: 'Varshaphal', moduleNumber: '21.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q21_1_01', type: 'mcq',
    question: {
      en: 'When was the Tajika system absorbed into Indian astrology?',
      hi: 'ताजिक पद्धति भारतीय ज्योतिष में कब समाहित हुई?',
    },
    options: [
      { en: 'Vedic period (c. 1500 BCE)', hi: 'वैदिक काल (लगभग 1500 ई.पू.)', sa: 'वैदिक काल (लगभग 1500 ई.पू.)', mai: 'वैदिक काल (लगभग 1500 ई.पू.)', mr: 'वैदिक काल (लगभग 1500 ई.पू.)', ta: 'வைதிக கால (லகभக 1500 ஈ.பூ.)', te: 'వైదిక కాల (లగభగ 1500 ఈ.పూ.)', bn: 'বৈদিক কাল (লগভগ 1500 ঈ.পূ.)', kn: 'ವೈದಿಕ ಕಾಲ (ಲಗಭಗ 1500 ಈ.ಪೂ.)', gu: 'વૈદિક કાલ (લગભગ 1500 ઈ.પૂ.)' },
      { en: 'Around 12th century CE', hi: 'लगभग 12वीं शताब्दी ई.', sa: 'लगभग 12वीं शताब्दी ई.', mai: 'लगभग 12वीं शताब्दी ई.', mr: 'लगभग 12वीं शताब्दी ई.', ta: 'லகभக 12வீம் ஶதாப்தீ ஈ.', te: 'లగభగ 12వీం శతాబ్దీ ఈ.', bn: 'লগভগ 12বীং শতাব্দী ঈ.', kn: 'ಲಗಭಗ 12ವೀಂ ಶತಾಬ್ದೀ ಈ.', gu: 'લગભગ 12વીં શતાબ્દી ઈ.' },
      { en: '20th century', hi: '20वीं शताब्दी', sa: '20वीं शताब्दी', mai: '20वीं शताब्दी', mr: '20वीं शताब्दी', ta: '20வீம் ஶதாப்தீ', te: '20వీం శతాబ్దీ', bn: '20বীং শতাব্দী', kn: '20ವೀಂ ಶತಾಬ್ದೀ', gu: '20વીં શતાબ્દી' },
      { en: '5th century BCE', hi: '5वीं शताब्दी ई.पू.', sa: '5वीं शताब्दी ई.पू.', mai: '5वीं शताब्दी ई.पू.', mr: '5वीं शताब्दी ई.पू.', ta: '5வீம் ஶதாப்தீ ஈ.பூ.', te: '5వీం శతాబ్దీ ఈ.పూ.', bn: '5বীং শতাব্দী ঈ.পূ.', kn: '5ವೀಂ ಶತಾಬ್ದೀ ಈ.ಪೂ.', gu: '5વીં શતાબ્દી ઈ.પૂ.' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Tajika system was absorbed into Indian astrology around the 12th century CE through Perso-Arabic influences. The term "Tajika" itself derives from "Tajik" (Persian). Key texts include Tajika Neelakanthi by Neelakantha Daivagnya.',
      hi: 'ताजिक पद्धति लगभग 12वीं शताब्दी ई. में फारसी-अरबी प्रभावों से भारतीय ज्योतिष में समाहित हुई। "ताजिक" शब्द स्वयं "ताजिक" (फारसी) से व्युत्पन्न है। प्रमुख ग्रन्थों में नीलकण्ठ दैवज्ञ का ताजिक नीलकण्ठी सम्मिलित है।',
    },
  },
  {
    id: 'q21_1_02', type: 'mcq',
    question: {
      en: 'What does Ithasala (application) indicate in Tajika?',
      hi: 'ताजिक में इत्थशाल (आवेदन) क्या संकेत करता है?',
    },
    options: [
      { en: 'The event window has passed', hi: 'घटना का अवसर बीत चुका है', sa: 'घटना का अवसर बीत चुका है', mai: 'घटना का अवसर बीत चुका है', mr: 'घटना का अवसर बीत चुका है', ta: 'घடநா கா அவஸர பீத சுகா ஹை', te: 'ఘటనా కా అవసర బీత చుకా హై', bn: 'ঘটনা কা অবসর বীত চুকা হৈ', kn: 'ಘಟನಾ ಕಾ ಅವಸರ ಬೀತ ಚುಕಾ ಹೈ', gu: 'ઘટના કા અવસર બીત ચુકા હૈ' },
      { en: 'The event WILL happen — a faster planet is applying to a slower one within orb', hi: 'घटना होगी — तेज़ ग्रह कक्षा में धीमे ग्रह की ओर बढ़ रहा है', sa: 'घटना होगी — तेज़ ग्रह कक्षा में धीमे ग्रह की ओर बढ़ रहा है', mai: 'घटना होगी — तेज़ ग्रह कक्षा में धीमे ग्रह की ओर बढ़ रहा है', mr: 'घटना होगी — तेज़ ग्रह कक्षा में धीमे ग्रह की ओर बढ़ रहा है', ta: 'घடநா ஹோகீ — தேஜ़ க்ரஹ கக்ஷா மேம் धீமே க்ரஹ கீ ஓர பढ़ ரஹா ஹை', te: 'ఘటనా హోగీ — తేజ़ గ్రహ కక్షా మేం ధీమే గ్రహ కీ ఓర బఢ़ రహా హై', bn: 'ঘটনা হোগী — তেজ় গ্রহ কক্ষা মেং ধীমে গ্রহ কী ওর বঢ় রহা হৈ', kn: 'ಘಟನಾ ಹೋಗೀ — ತೇಜ़ ಗ್ರಹ ಕಕ್ಷಾ ಮೇಂ ಧೀಮೇ ಗ್ರಹ ಕೀ ಓರ ಬಢ़ ರಹಾ ಹೈ', gu: 'ઘટના હોગી — તેજ़ ગ્રહ કક્ષા મેં ધીમે ગ્રહ કી ઓર બઢ़ રહા હૈ' },
      { en: 'A third planet blocks the event', hi: 'एक तीसरा ग्रह घटना को अवरुद्ध करता है', sa: 'एक तीसरा ग्रह घटना को अवरुद्ध करता है', mai: 'एक तीसरा ग्रह घटना को अवरुद्ध करता है', mr: 'एक तीसरा ग्रह घटना को अवरुद्ध करता है', ta: 'எக தீஸரா க்ரஹ घடநா கோ அவருத்ध கரதா ஹை', te: 'ఏక తీసరా గ్రహ ఘటనా కో అవరుద్ధ కరతా హై', bn: 'এক তীসরা গ্রহ ঘটনা কো অবরুদ্ধ করতা হৈ', kn: 'ಏಕ ತೀಸರಾ ಗ್ರಹ ಘಟನಾ ಕೋ ಅವರುದ್ಧ ಕರತಾ ಹೈ', gu: 'એક તીસરા ગ્રહ ઘટના કો અવરુદ્ધ કરતા હૈ' },
      { en: 'Neither planet forms an aspect', hi: 'कोई भी ग्रह दृष्टि नहीं बनाता', sa: 'कोई भी ग्रह दृष्टि नहीं बनाता', mai: 'कोई भी ग्रह दृष्टि नहीं बनाता', mr: 'कोई भी ग्रह दृष्टि नहीं बनाता', ta: 'கோஈ भீ க்ரஹ திருஷ்டி நஹீம் பநாதா', te: 'కోఈ భీ గ్రహ దృష్టి నహీం బనాతా', bn: 'কোঈ ভী গ্রহ দৃষ্টি নহীং বনাতা', kn: 'ಕೋಈ ಭೀ ಗ್ರಹ ದೃಷ್ಟಿ ನಹೀಂ ಬನಾತಾ', gu: 'કોઈ ભી ગ્રહ દૃષ્ટિ નહીં બનાતા' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Ithasala (application) means a faster planet is approaching a slower planet within their mutual orb of aspect. This is the strongest positive Tajika yoga — it confirms the event WILL manifest during the year.',
      hi: 'इत्थशाल (आवेदन) का अर्थ है कि तेज़ ग्रह दृष्टि की पारस्परिक कक्षा में धीमे ग्रह की ओर बढ़ रहा है। यह सबसे प्रबल सकारात्मक ताजिक योग है — यह पुष्टि करता है कि घटना वर्ष में अवश्य प्रकट होगी।',
    },
  },
  {
    id: 'q21_1_03', type: 'true_false',
    question: {
      en: 'In Tajika, aspects use fixed full-strength positions like Parashari (7th, 5th, 9th aspects).',
      hi: 'ताजिक में दृष्टियाँ पाराशरी (सप्तम, पंचम, नवम दृष्टि) की तरह स्थिर पूर्ण-बल स्थितियों का उपयोग करती हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Unlike Parashari fixed aspects, Tajika uses applying/separating aspects with ORBS (degree-based proximity). What matters is whether two planets are within their mutual orb and whether the faster planet is approaching or separating.',
      hi: 'असत्य। पाराशरी की स्थिर दृष्टियों के विपरीत, ताजिक कक्षा (अंश-आधारित निकटता) सहित आवेदक/पृथक्करण दृष्टियों का उपयोग करता है। महत्त्वपूर्ण यह है कि दो ग्रह अपनी पारस्परिक कक्षा में हैं या नहीं और तेज़ ग्रह निकट आ रहा है या दूर जा रहा है।',
    },
  },
  {
    id: 'q21_1_04', type: 'mcq',
    question: {
      en: 'What does Easarapha (separation) indicate?',
      hi: 'ईषराफ (पृथक्करण) क्या संकेत करता है?',
    },
    options: [
      { en: 'The event will happen this year', hi: 'घटना इस वर्ष होगी', sa: 'घटना इस वर्ष होगी', mai: 'घटना इस वर्ष होगी', mr: 'घटना इस वर्ष होगी', ta: 'घடநா இஸ வர்ஷ ஹோகீ', te: 'ఘటనా ఇస వర్ష హోగీ', bn: 'ঘটনা ইস বর্ষ হোগী', kn: 'ಘಟನಾ ಇಸ ವರ್ಷ ಹೋಗೀ', gu: 'ઘટના ઇસ વર્ષ હોગી' },
      { en: 'The event was possible but the window has passed', hi: 'घटना सम्भव थी किन्तु अवसर बीत चुका है', sa: 'घटना सम्भव थी किन्तु अवसर बीत चुका है', mai: 'घटना सम्भव थी किन्तु अवसर बीत चुका है', mr: 'घटना सम्भव थी किन्तु अवसर बीत चुका है', ta: 'घடநா ஸம்भவ थீ கிந்து அவஸர பீத சுகா ஹை', te: 'ఘటనా సమ్భవ థీ కిన్తు అవసర బీత చుకా హై', bn: 'ঘটনা সম্ভব থী কিন্তু অবসর বীত চুকা হৈ', kn: 'ಘಟನಾ ಸಮ್ಭವ ಥೀ ಕಿನ್ತು ಅವಸರ ಬೀತ ಚುಕಾ ಹೈ', gu: 'ઘટના સમ્ભવ થી કિન્તુ અવસર બીત ચુકા હૈ' },
      { en: 'A third planet helps the event', hi: 'एक तीसरा ग्रह घटना में सहायता करता है', sa: 'एक तीसरा ग्रह घटना में सहायता करता है', mai: 'एक तीसरा ग्रह घटना में सहायता करता है', mr: 'एक तीसरा ग्रह घटना में सहायता करता है', ta: 'எக தீஸரா க்ரஹ घடநா மேம் ஸஹாயதா கரதா ஹை', te: 'ఏక తీసరా గ్రహ ఘటనా మేం సహాయతా కరతా హై', bn: 'এক তীসরা গ্রহ ঘটনা মেং সহাযতা করতা হৈ', kn: 'ಏಕ ತೀಸರಾ ಗ್ರಹ ಘಟನಾ ಮೇಂ ಸಹಾಯತಾ ಕರತಾ ಹೈ', gu: 'એક તીસરા ગ્રહ ઘટના મેં સહાયતા કરતા હૈ' },
      { en: 'The event will happen next year', hi: 'घटना अगले वर्ष होगी', sa: 'घटना अगले वर्ष होगी', mai: 'घटना अगले वर्ष होगी', mr: 'घटना अगले वर्ष होगी', ta: 'घடநா அகலே வர்ஷ ஹோகீ', te: 'ఘటనా అగలే వర్ష హోగీ', bn: 'ঘটনা অগলে বর্ষ হোগী', kn: 'ಘಟನಾ ಅಗಲೇ ವರ್ಷ ಹೋಗೀ', gu: 'ઘટના અગલે વર્ષ હોગી' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Easarapha (separation) means the two relevant planets have already passed their exact aspect and are now separating. The opportunity existed but the timing has passed — the event will likely NOT manifest this year.',
      hi: 'ईषराफ (पृथक्करण) का अर्थ है कि दो सम्बन्धित ग्रह अपनी यथार्थ दृष्टि पार कर चुके हैं और अब दूर जा रहे हैं। अवसर विद्यमान था किन्तु समय बीत चुका — घटना इस वर्ष सम्भवतः प्रकट नहीं होगी।',
    },
  },
  {
    id: 'q21_1_05', type: 'mcq',
    question: {
      en: 'What is Nakta (transfer of light) in Tajika?',
      hi: 'ताजिक में नक्त (प्रकाश स्थानान्तरण) क्या है?',
    },
    options: [
      { en: 'Two planets forming a direct aspect', hi: 'दो ग्रहों की प्रत्यक्ष दृष्टि', sa: 'दो ग्रहों की प्रत्यक्ष दृष्टि', mai: 'दो ग्रहों की प्रत्यक्ष दृष्टि', mr: 'दो ग्रहों की प्रत्यक्ष दृष्टि', ta: 'தோ க்ரஹோம் கீ ப்ரத்யக்ஷ திருஷ்டி', te: 'దో గ్రహోం కీ ప్రత్యక్ష దృష్టి', bn: 'দো গ্রহোং কী প্রত্যক্ষ দৃষ্টি', kn: 'ದೋ ಗ್ರಹೋಂ ಕೀ ಪ್ರತ್ಯಕ್ಷ ದೃಷ್ಟಿ', gu: 'દો ગ્રહોં કી પ્રત્યક્ષ દૃષ્ટિ' },
      { en: 'A third planet transferring light between two non-aspecting planets', hi: 'एक तीसरा ग्रह दो गैर-दृष्टि ग्रहों के बीच प्रकाश स्थानान्तरित करता है', sa: 'एक तीसरा ग्रह दो गैर-दृष्टि ग्रहों के बीच प्रकाश स्थानान्तरित करता है', mai: 'एक तीसरा ग्रह दो गैर-दृष्टि ग्रहों के बीच प्रकाश स्थानान्तरित करता है', mr: 'एक तीसरा ग्रह दो गैर-दृष्टि ग्रहों के बीच प्रकाश स्थानान्तरित करता है', ta: 'எக தீஸரா க்ரஹ தோ கைர-திருஷ்டி க்ரஹோம் கே பீச ப்ரகாஶ ஸ்थாநாந்தரித கரதா ஹை', te: 'ఏక తీసరా గ్రహ దో గైర-దృష్టి గ్రహోం కే బీచ ప్రకాశ స్థానాన్తరిత కరతా హై', bn: 'এক তীসরা গ্রহ দো গৈর-দৃষ্টি গ্রহোং কে বীচ প্রকাশ স্থানান্তরিত করতা হৈ', kn: 'ಏಕ ತೀಸರಾ ಗ್ರಹ ದೋ ಗೈರ-ದೃಷ್ಟಿ ಗ್ರಹೋಂ ಕೇ ಬೀಚ ಪ್ರಕಾಶ ಸ್ಥಾನಾನ್ತರಿತ ಕರತಾ ಹೈ', gu: 'એક તીસરા ગ્રહ દો ગૈર-દૃષ્ટિ ગ્રહોં કે બીચ પ્રકાશ સ્થાનાન્તરિત કરતા હૈ' },
      { en: 'A planet blocking another\'s application', hi: 'एक ग्रह दूसरे के आवेदन को अवरुद्ध करता है' },
      { en: 'No aspect between any planets', hi: 'किसी भी ग्रह के बीच कोई दृष्टि नहीं', sa: 'किसी भी ग्रह के बीच कोई दृष्टि नहीं', mai: 'किसी भी ग्रह के बीच कोई दृष्टि नहीं', mr: 'किसी भी ग्रह के बीच कोई दृष्टि नहीं', ta: 'கிஸீ भீ க்ரஹ கே பீச கோஈ திருஷ்டி நஹீம்', te: 'కిసీ భీ గ్రహ కే బీచ కోఈ దృష్టి నహీం', bn: 'কিসী ভী গ্রহ কে বীচ কোঈ দৃষ্টি নহীং', kn: 'ಕಿಸೀ ಭೀ ಗ್ರಹ ಕೇ ಬೀಚ ಕೋಈ ದೃಷ್ಟಿ ನಹೀಂ', gu: 'કિસી ભી ગ્રહ કે બીચ કોઈ દૃષ્ટિ નહીં' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Nakta occurs when two significator planets cannot aspect each other directly, but a third intermediary planet separates from one and applies to the other, "transferring" the connection. The event happens through an intermediary.',
      hi: 'नक्त तब होता है जब दो कारक ग्रह परस्पर प्रत्यक्ष दृष्टि नहीं बना सकते, किन्तु एक तृतीय मध्यस्थ ग्रह एक से पृथक होकर दूसरे पर आवेदन करता है, सम्बन्ध "स्थानान्तरित" करते हुए। घटना मध्यस्थ के माध्यम से होती है।',
    },
  },
  {
    id: 'q21_1_06', type: 'mcq',
    question: {
      en: 'What does Yamaya (prohibition) mean in Tajika?',
      hi: 'ताजिक में यमया (निषेध) का क्या अर्थ है?',
    },
    options: [
      { en: 'The event is guaranteed', hi: 'घटना निश्चित है', sa: 'घटना निश्चित है', mai: 'घटना निश्चित है', mr: 'घटना निश्चित है', ta: 'घடநா நிஶ்சித ஹை', te: 'ఘటనా నిశ్చిత హై', bn: 'ঘটনা নিশ্চিত হৈ', kn: 'ಘಟನಾ ನಿಶ್ಚಿತ ಹೈ', gu: 'ઘટના નિશ્ચિત હૈ' },
      { en: 'A third planet intervenes to block the applying aspect', hi: 'एक तीसरा ग्रह आवेदक दृष्टि को अवरुद्ध करने हेतु हस्तक्षेप करता है', sa: 'एक तीसरा ग्रह आवेदक दृष्टि को अवरुद्ध करने हेतु हस्तक्षेप करता है', mai: 'एक तीसरा ग्रह आवेदक दृष्टि को अवरुद्ध करने हेतु हस्तक्षेप करता है', mr: 'एक तीसरा ग्रह आवेदक दृष्टि को अवरुद्ध करने हेतु हस्तक्षेप करता है', ta: 'எக தீஸரா க்ரஹ ஆவேதக திருஷ்டி கோ அவருத்ध கரநே ஹேது ஹஸ்தக்ஷேப கரதா ஹை', te: 'ఏక తీసరా గ్రహ ఆవేదక దృష్టి కో అవరుద్ధ కరనే హేతు హస్తక్షేప కరతా హై', bn: 'এক তীসরা গ্রহ আবেদক দৃষ্টি কো অবরুদ্ধ করনে হেতু হস্তক্ষেপ করতা হৈ', kn: 'ಏಕ ತೀಸರಾ ಗ್ರಹ ಆವೇದಕ ದೃಷ್ಟಿ ಕೋ ಅವರುದ್ಧ ಕರನೇ ಹೇತು ಹಸ್ತಕ್ಷೇಪ ಕರತಾ ಹೈ', gu: 'એક તીસરા ગ્રહ આવેદક દૃષ્ટિ કો અવરુદ્ધ કરને હેતુ હસ્તક્ષેપ કરતા હૈ' },
      { en: 'Two planets are in the same sign', hi: 'दो ग्रह एक ही राशि में हैं', sa: 'दो ग्रह एक ही राशि में हैं', mai: 'दो ग्रह एक ही राशि में हैं', mr: 'दो ग्रह एक ही राशि में हैं', ta: 'தோ க்ரஹ எக ஹீ ராஶி மேம் ஹைம்', te: 'దో గ్రహ ఏక హీ రాశి మేం హైం', bn: 'দো গ্রহ এক হী রাশি মেং হৈং', kn: 'ದೋ ಗ್ರಹ ಏಕ ಹೀ ರಾಶಿ ಮೇಂ ಹೈಂ', gu: 'દો ગ્રહ એક હી રાશિ મેં હૈં' },
      { en: 'The year lord is debilitated', hi: 'वर्ष स्वामी नीच है', sa: 'वर्ष स्वामी नीच है', mai: 'वर्ष स्वामी नीच है', mr: 'वर्ष स्वामी नीच है', ta: 'வர்ஷ ஸ்வாமீ நீச ஹை', te: 'వర్ష స్వామీ నీచ హై', bn: 'বর্ষ স্বামী নীচ হৈ', kn: 'ವರ್ಷ ಸ್ವಾಮೀ ನೀಚ ಹೈ', gu: 'વર્ષ સ્વામી નીચ હૈ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Yamaya occurs when a third planet intervenes between two applying planets, blocking their Ithasala before it perfects. Even though the event was promised (application existed), the intervening planet prevents its fulfillment.',
      hi: 'यमया तब होता है जब एक तीसरा ग्रह दो आवेदक ग्रहों के बीच हस्तक्षेप करता है, उनके इत्थशाल को पूर्ण होने से पहले अवरुद्ध करता है। भले ही घटना वादित थी (आवेदन विद्यमान था), हस्तक्षेपी ग्रह इसकी पूर्ति रोकता है।',
    },
  },
  {
    id: 'q21_1_07', type: 'true_false',
    question: {
      en: 'Manaoo indicates that neither planet applies to the other, so no event will manifest.',
      hi: 'मनऊ संकेत करता है कि कोई भी ग्रह दूसरे पर आवेदन नहीं करता, अतः कोई घटना प्रकट नहीं होगी।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Manaoo means neither of the two relevant planets is applying to the other — they are either separating, not in aspect, or have no mutual connection. This indicates the event will NOT happen this year.',
      hi: 'सत्य। मनऊ का अर्थ है कि दो सम्बन्धित ग्रहों में से कोई भी दूसरे पर आवेदन नहीं कर रहा — वे या तो पृथक हो रहे हैं, दृष्टि में नहीं हैं, या पारस्परिक सम्बन्ध नहीं है। यह संकेत करता है कि घटना इस वर्ष नहीं होगी।',
    },
  },
  {
    id: 'q21_1_08', type: 'mcq',
    question: {
      en: 'How many key Tajika yogas determine event manifestation?',
      hi: 'घटना अभिव्यक्ति निर्धारित करने वाले प्रमुख ताजिक योग कितने हैं?',
    },
    options: [
      { en: '3', hi: '3', sa: '3', mai: '3', mr: '3', ta: '3', te: '3', bn: '3', kn: '3', gu: '3' },
      { en: '5', hi: '5', sa: '5', mai: '5', mr: '5', ta: '5', te: '5', bn: '5', kn: '5', gu: '5' },
      { en: '7', hi: '7', sa: '7', mai: '7', mr: '7', ta: '7', te: '7', bn: '7', kn: '7', gu: '7' },
      { en: '16', hi: '16', sa: '16', mai: '16', mr: '16', ta: '16', te: '16', bn: '16', kn: '16', gu: '16' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'There are 5 key Tajika yogas: Ithasala (application — event happens), Easarapha (separation — window passed), Nakta (transfer of light — event via intermediary), Yamaya (prohibition — event blocked), and Manaoo (no application — no event).',
      hi: '5 प्रमुख ताजिक योग हैं: इत्थशाल (आवेदन — घटना होगी), ईषराफ (पृथक्करण — अवसर बीता), नक्त (प्रकाश स्थानान्तरण — मध्यस्थ द्वारा घटना), यमया (निषेध — घटना अवरुद्ध), और मनऊ (कोई आवेदन नहीं — कोई घटना नहीं)।',
    },
  },
  {
    id: 'q21_1_09', type: 'mcq',
    question: {
      en: 'In a Varshaphal chart, Venus at 10 degrees Taurus and Jupiter at 15 degrees Taurus — Venus is faster. What Tajika yoga is formed?',
      hi: 'वर्षफल कुण्डली में शुक्र 10 अंश वृषभ पर और गुरु 15 अंश वृषभ पर — शुक्र तेज़ है। कौन-सा ताजिक योग बनता है?',
    },
    options: [
      { en: 'Easarapha — they are separating', hi: 'ईषराफ — वे पृथक हो रहे हैं', sa: 'ईषराफ — वे पृथक हो रहे हैं', mai: 'ईषराफ — वे पृथक हो रहे हैं', mr: 'ईषराफ — वे पृथक हो रहे हैं', ta: 'ஈஷராफ — வே பிருथக ஹோ ரஹே ஹைம்', te: 'ఈషరాఫ — వే పృథక హో రహే హైం', bn: 'ঈষরাফ — বে পৃথক হো রহে হৈং', kn: 'ಈಷರಾಫ — ವೇ ಪೃಥಕ ಹೋ ರಹೇ ಹೈಂ', gu: 'ઈષરાફ — વે પૃથક હો રહે હૈં' },
      { en: 'Ithasala — Venus is applying to Jupiter within 5 degrees', hi: 'इत्थशाल — शुक्र 5 अंश के भीतर गुरु पर आवेदन कर रहा है', sa: 'इत्थशाल — शुक्र 5 अंश के भीतर गुरु पर आवेदन कर रहा है', mai: 'इत्थशाल — शुक्र 5 अंश के भीतर गुरु पर आवेदन कर रहा है', mr: 'इत्थशाल — शुक्र 5 अंश के भीतर गुरु पर आवेदन कर रहा है', ta: 'இத்थஶால — ஶுக்ர 5 அம்ஶ கே भீதர குரு பர ஆவேதந கர ரஹா ஹை', te: 'ఇత్థశాల — శుక్ర 5 అంశ కే భీతర గురు పర ఆవేదన కర రహా హై', bn: 'ইত্থশাল — শুক্র 5 অংশ কে ভীতর গুরু পর আবেদন কর রহা হৈ', kn: 'ಇತ್ಥಶಾಲ — ಶುಕ್ರ 5 ಅಂಶ ಕೇ ಭೀತರ ಗುರು ಪರ ಆವೇದನ ಕರ ರಹಾ ಹೈ', gu: 'ઇત્થશાલ — શુક્ર 5 અંશ કે ભીતર ગુરુ પર આવેદન કર રહા હૈ' },
      { en: 'Manaoo — no connection', hi: 'मनऊ — कोई सम्बन्ध नहीं', sa: 'मनऊ — कोई सम्बन्ध नहीं', mai: 'मनऊ — कोई सम्बन्ध नहीं', mr: 'मनऊ — कोई सम्बन्ध नहीं', ta: 'மநஊ — கோஈ ஸம்பந்ध நஹீம்', te: 'మనఊ — కోఈ సమ్బన్ధ నహీం', bn: 'মনঊ — কোঈ সম্বন্ধ নহীং', kn: 'ಮನಊ — ಕೋಈ ಸಮ್ಬನ್ಧ ನಹೀಂ', gu: 'મનઊ — કોઈ સમ્બન્ધ નહીં' },
      { en: 'Yamaya — a third planet blocks them', hi: 'यमया — एक तीसरा ग्रह उन्हें अवरुद्ध करता है', sa: 'यमया — एक तीसरा ग्रह उन्हें अवरुद्ध करता है', mai: 'यमया — एक तीसरा ग्रह उन्हें अवरुद्ध करता है', mr: 'यमया — एक तीसरा ग्रह उन्हें अवरुद्ध करता है', ta: 'யமயா — எக தீஸரா க்ரஹ உந்ஹேம் அவருத்ध கரதா ஹை', te: 'యమయా — ఏక తీసరా గ్రహ ఉన్హేం అవరుద్ధ కరతా హై', bn: 'যমযা — এক তীসরা গ্রহ উন্হেং অবরুদ্ধ করতা হৈ', kn: 'ಯಮಯಾ — ಏಕ ತೀಸರಾ ಗ್ರಹ ಉನ್ಹೇಂ ಅವರುದ್ಧ ಕರತಾ ಹೈ', gu: 'યમયા — એક તીસરા ગ્રહ ઉન્હેં અવરુદ્ધ કરતા હૈ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Venus (faster) is at 10 degrees and approaching Jupiter at 15 degrees — a 5-degree gap within the standard orb. This is a clear Ithasala (application), meaning the event Jupiter signifies (by house lordship) WILL manifest this year.',
      hi: 'शुक्र (तेज़) 10 अंश पर है और 15 अंश पर गुरु की ओर बढ़ रहा है — मानक कक्षा में 5 अंश का अन्तर। यह स्पष्ट इत्थशाल (आवेदन) है, अर्थात गुरु जिसका कारक है (भाव स्वामित्व द्वारा) वह घटना इस वर्ष अवश्य प्रकट होगी।',
    },
  },
  {
    id: 'q21_1_10', type: 'true_false',
    question: {
      en: 'If Saturn at 12 degrees interposes between Venus at 10 degrees and Jupiter at 15 degrees (all in Taurus), this creates a Yamaya that blocks the Ithasala.',
      hi: 'यदि शनि 12 अंश पर शुक्र (10 अंश) और गुरु (15 अंश) के बीच आता है (सभी वृषभ में), तो यह यमया बनाता है जो इत्थशाल को अवरुद्ध करता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Saturn at 12 degrees sits between Venus (10 degrees) and Jupiter (15 degrees). If Saturn aspects or conjoins the path of Venus\'s application to Jupiter, it creates Yamaya — the event is blocked or severely delayed despite the initial promise.',
      hi: 'सत्य। शनि 12 अंश पर शुक्र (10 अंश) और गुरु (15 अंश) के बीच बैठा है। यदि शनि शुक्र के गुरु की ओर आवेदन मार्ग पर दृष्टि या युति बनाता है, तो यमया बनता है — प्रारम्भिक वादे के बावजूद घटना अवरुद्ध या अत्यन्त विलम्बित होती है।',
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
          {tl({ en: 'Tajika: The Perso-Arabic Layer of Indian Astrology', hi: 'ताजिक: भारतीय ज्योतिष की फारसी-अरबी परत', sa: 'ताजिकम्: भारतीयज्योतिषस्य फारसी-अरबी-स्तरः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ताजिक वार्षिक कुण्डली (वर्षफल) की एक पद्धति है जो लगभग 12वीं शताब्दी ई. में फारसी-अरबी विद्वत् आदान-प्रदान द्वारा भारतीय ज्योतिष में समाहित हुई। &quot;ताजिक&quot; शब्द &quot;ताजिक&quot; (फारसी) से व्युत्पन्न है, और यह पद्धति दृष्टियों के लिए पाराशरी परम्परा से मूलभूत रूप से भिन्न दृष्टिकोण लाती है। जहाँ पाराशरी ज्योतिष स्थिर दृष्टियों का उपयोग करता है — सप्तम भाव की प्रतियोग दृष्टि सदैव पूर्ण-बल है, पंचम/नवम त्रिकोण दृष्टियाँ सदैव प्रभावी हैं — वहीं ताजिक अंश-आधारित कक्षाओं के साथ आवेदक और पृथक्करण दृष्टियों का उपयोग करता है।</>
            : <>Tajika is a system of annual horoscopy (Varshaphal) that was absorbed into Indian astrology around the 12th century CE through Perso-Arabic scholarly exchanges. The word &quot;Tajika&quot; derives from &quot;Tajik&quot; (Persian), and the system brings a fundamentally different approach to aspects than the Parashari tradition. While Parashari astrology uses fixed aspects — the 7th house opposition is always full-strength, the 5th/9th trine aspects are always operative — Tajika uses APPLYING and SEPARATING aspects with degree-based orbs, much like the Western horary tradition from which it partly derives.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The key question Tajika answers is: &quot;Will the event promised in the annual chart actually come to pass THIS YEAR?&quot; Five Tajika yogas provide the answer: Ithasala (application — yes, it will happen), Easarapha (separation — opportunity passed), Nakta (transfer of light — event via intermediary), Yamaya (prohibition — event blocked by a third planet), and Manaoo (no application — event will not happen). These yogas transform the static annual chart into a dynamic prediction of what will and will not manifest.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>ताजिक पर मूलभूत भारतीय ग्रन्थ नीलकण्ठ दैवज्ञ (16वीं शताब्दी ई.) की &quot;ताजिक नीलकण्ठी&quot; है, जिसने भारतीय श्रोताओं के लिए ताजिक योगों को व्यवस्थित रूप से प्रस्तुत किया। इससे पहले, समरसिंह का &quot;कर्मप्रकाश&quot; (13वीं शताब्दी) ताजिक सिद्धान्तों को सम्मिलित करने वाली प्रथम भारतीय कृतियों में था। इस पद्धति का अरबी &quot;अल-काबिसी&quot; और टॉलेमी एवं डोरोथियस में पाए जाने वाले हेलेनिस्टिक &quot;आवेदन और पृथक्करण&quot; सिद्धान्तों से साम्य है। शताब्दियों में भारतीय ज्योतिषियों ने पाराशरी ग्रह कारकत्व और विंशोत्तरी दशा ढाँचे को बनाए रखते हुए इन तकनीकों को पूर्णतः आत्मसात कर लिया।</>
            : <>The foundational Indian text on Tajika is the &quot;Tajika Neelakanthi&quot; by Neelakantha Daivagnya (16th century CE), which systematically presented the Tajika yogas for an Indian audience. Earlier, Samarasimha&apos;s &quot;Karmaprakasha&quot; (13th century) was among the first Indian works to incorporate Tajika principles. The system has parallels to the Arabic &quot;al-Qabisi&quot; and the Hellenistic &quot;application and separation&quot; doctrines found in Ptolemy and Dorotheus. Over centuries, Indian astrologers fully assimilated these techniques while maintaining the Parashari planetary significations and Vimshottari dasha framework.</>}
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
          {tl({ en: 'The Five Tajika Yogas', hi: 'पाँच ताजिक योग', sa: 'पञ्च ताजिकयोगाः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>इत्थशाल (आवेदन):</strong> सबसे अनुकूल योग। एक तेज़ ग्रह दृष्टि की पारस्परिक कक्षा में धीमे ग्रह की ओर बढ़ रहा है। तेज़ ग्रह का अंश धीमे ग्रह से कम होना चाहिए (समान या दृष्टि राशियों में)। जब दो कारक ग्रहों के बीच इत्थशाल बनता है, तो वे जिस घटना का वादा करते हैं वह वर्ष में अवश्य प्रकट होगी। जितना निकट आवेदन, उतनी शीघ्र घटना।</>
            : <><strong>Ithasala (Application):</strong> The most favorable yoga. A faster planet is approaching a slower planet within their mutual orb of aspect. The faster planet must be at a LOWER degree than the slower planet (in the same or aspecting signs). When Ithasala forms between two significator planets, the event they promise WILL manifest during the year. The closer the application, the sooner the event.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>ईषराफ (पृथक्करण):</strong> इत्थशाल का विपरीत। दो ग्रह अपनी यथार्थ दृष्टि पार कर चुके हैं और अब दूर जा रहे हैं। तेज़ ग्रह का अंश धीमे ग्रह से अधिक है। इसका अर्थ है कि घटना सम्भव थी — अवसर था — किन्तु अब बीत चुका। छूटे अवसर, वे मुलाकातें जो लगभग हुईं किन्तु नहीं हुईं।</>
            : <><strong>Easarapha (Separation):</strong> The opposite of Ithasala. The two planets have already passed their exact aspect and are now moving apart. The faster planet is at a HIGHER degree than the slower planet. This means the event was possible — the window existed — but has now passed. Opportunities lost, meetings that almost happened but didn&apos;t.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><strong>नक्त (प्रकाश स्थानान्तरण):</strong> जब दो कारक ग्रह परस्पर प्रत्यक्ष दृष्टि नहीं बना सकते, एक तृतीय ग्रह मध्यस्थ बनता है — वह एक से पृथक होकर दूसरे पर आवेदन करता है, &quot;प्रकाश स्थानान्तरित&quot; करता है। घटना होती है किन्तु मध्यस्थ या अप्रत्याशित माध्यम से। <strong>यमया (निषेध):</strong> एक तीसरा ग्रह दो आवेदक ग्रहों के बीच आकर इत्थशाल को पूर्ण होने से रोकता है। <strong>मनऊ (अस्वीकृति):</strong> कोई भी ग्रह दूसरे पर आवेदन नहीं करता — कोई घटना प्रकट नहीं होती।</>
            : <><strong>Nakta (Transfer of Light):</strong> When two significator planets cannot directly aspect each other, a third planet acts as intermediary — it separates from one and applies to the other, &quot;transferring the light.&quot; The event happens but through a mediator or unexpected channel. <strong>Yamaya (Prohibition):</strong> A third planet interposes between two applying planets, blocking the Ithasala before it perfects. <strong>Manaoo (Refusal):</strong> Neither planet applies to the other — no event manifests.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">वर्षफल कुण्डली:</span> वर्ष स्वामी शुक्र 10 अंश वृषभ पर, गुरु 15 अंश वृषभ पर। शुक्र लगभग 1 अंश/दिन, गुरु लगभग 0.08 अंश/दिन — शुक्र तेज़ है। शुक्र कम अंश (10) पर है और गुरु (15) पर आवेदन कर रहा है। अन्तर = 5 अंश, मानक कक्षा में। यह स्पष्ट इत्थशाल है। गुरु भाव स्वामित्व द्वारा जिसका कारक है वह घटना अवश्य प्रकट होगी। यदि गुरु वार्षिक कुण्डली में दशम भाव का स्वामी है, तो करियर उन्नति वादित है। यदि शनि 12 अंश वृषभ पर होता, तो बीच में आकर → यमया → करियर उन्नति अवरुद्ध या विलम्बित।</>
            : <><span className="text-gold-light font-medium">Varshaphal chart:</span> Year lord Venus at 10 degrees Taurus, Jupiter at 15 degrees Taurus. Venus moves approximately 1 degree/day, Jupiter about 0.08 degrees/day — Venus is faster. Venus is at the lower degree (10) and applying to Jupiter (15). Gap = 5 degrees, within standard orb. This forms a clear Ithasala. The event Jupiter signifies by house lordship WILL manifest. If Jupiter rules the 10th house in the annual chart, career advancement is promised. If Saturn were at 12 degrees Taurus, it would interpose → Yamaya → career advancement blocked or delayed.</>}
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
          {tl({ en: 'Applying Tajika in Varshaphal Analysis', hi: 'वर्षफल विश्लेषण में ताजिक का अनुप्रयोग', sa: 'वर्षफलविश्लेषणे ताजिकस्य प्रयोगः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'In practice, the astrologer examines the Varshaphal (annual return) chart and identifies which Tajika yogas form between the year lord (Varsheshvara) and other planets. The year lord is the planet with the highest strength in the annual chart, often determined by the Pancha-vargiya Bala (five-fold strength). Events promised by the year lord are the most significant for the year. If the year lord forms Ithasala with the 7th lord → marriage/partnership year. Ithasala with 10th lord → career year. Easarapha with 5th lord → educational opportunity missed.', hi: 'व्यवहार में, ज्योतिषी वर्षफल (वार्षिक प्रत्यावर्तन) कुण्डली की जाँच करता है और पहचानता है कि वर्ष स्वामी (वर्षेश्वर) और अन्य ग्रहों के बीच कौन-से ताजिक योग बनते हैं। वर्ष स्वामी वार्षिक कुण्डली में सर्वोच्च बल वाला ग्रह है, प्रायः पंचवर्गीय बल द्वारा निर्धारित। वर्ष स्वामी द्वारा वादित घटनाएँ वर्ष की सर्वाधिक महत्त्वपूर्ण हैं। यदि वर्ष स्वामी सप्तम स्वामी से इत्थशाल बनाता है → विवाह/साझेदारी वर्ष। दशम स्वामी से इत्थशाल → करियर वर्ष। पंचम स्वामी से ईषराफ → शैक्षिक अवसर छूटा।', sa: 'व्यवहार में, ज्योतिषी वर्षफल (वार्षिक प्रत्यावर्तन) कुण्डली की जाँच करता है और पहचानता है कि वर्ष स्वामी (वर्षेश्वर) और अन्य ग्रहों के बीच कौन-से ताजिक योग बनते हैं। वर्ष स्वामी वार्षिक कुण्डली में सर्वोच्च बल वाला ग्रह है, प्रायः पंचवर्गीय बल द्वारा निर्धारित। वर्ष स्वामी द्वारा वादित घटनाएँ वर्ष की सर्वाधिक महत्त्वपूर्ण हैं। यदि वर्ष स्वामी सप्तम स्वामी से इत्थशाल बनाता है → विवाह/साझेदारी वर्ष। दशम स्वामी से इत्थशाल → करियर वर्ष। पंचम स्वामी से ईषराफ → शैक्षिक अवसर छूटा।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The timing within the year is refined using Mudda Dasha (Module 21-3). The Tajika yoga tells you IF the event will happen; the Mudda Dasha tells you WHICH MONTH. Together with Sahams (Module 21-2), this creates a comprehensive annual prediction framework that goes far beyond what a natal chart alone can provide.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;ताजिक दृष्टियाँ पाराशरी दृष्टियों को प्रतिस्थापित करती हैं।&quot; ऐसा नहीं है। ताजिक दृष्टियों का उपयोग केवल वर्षफल (वार्षिक कुण्डली) ढाँचे में होता है। जन्म कुण्डली के लिए पाराशरी दृष्टियाँ (सप्तम पूर्ण, पंचम/नवम त्रिकोण, मंगल/गुरु/शनि की विशेष दृष्टियाँ) मानक बनी रहती हैं। ताजिक और पाराशरी पूरक पद्धतियाँ हैं जो भिन्न कुण्डली प्रकारों — क्रमशः वार्षिक और जन्म — पर लागू होती हैं।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Tajika aspects replace Parashari aspects.&quot; They do not. Tajika aspects are used ONLY within the Varshaphal (annual chart) framework. For the natal chart, Parashari aspects (7th full, 5th/9th trine, special aspects of Mars/Jupiter/Saturn) remain the standard. Tajika and Parashari are complementary systems applied to different chart types — annual and natal respectively.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>ताजिक योग वार्षिक भविष्यवाणियों के लिए विशेष रूप से मूल्यवान हैं — भारतीय ज्योतिष में सबसे सामान्य परामर्श अनुरोध। ग्राहक प्रायः अमूर्त आजीवन प्रश्नों के बजाय &quot;इस वर्ष क्या होगा?&quot; पूछते हैं। हमारा वर्षफल उपकरण स्वचालित रूप से वार्षिक कुण्डली में प्रत्येक ग्रह युग्म के बीच सभी ताजिक योगों की गणना करता है, इत्थशाल संरचनाओं (जो घटनाएँ होंगी) और ईषराफ संरचनाओं (छूटे अवसर) को उजागर करता है। यह उपयोगकर्ताओं को शास्त्रीय ताजिक पद्धति पर आधारित तत्काल वार्षिक पूर्वानुमान देता है।</>
            : <>Tajika yogas are particularly valued for annual predictions — the most common consultation request in Indian astrology. Clients typically ask &quot;What will happen THIS year?&quot; rather than abstract lifetime questions. Our Varshaphal tool automatically computes all Tajika yogas between every planet pair in the annual chart, highlighting Ithasala formations (events that WILL happen) and Easarapha formations (missed opportunities). This gives users an immediate year-ahead forecast grounded in classical Tajika methodology.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module21_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
