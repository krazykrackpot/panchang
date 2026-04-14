'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-6.json';

const META: ModuleMeta = {
  id: 'mod_22_6', phase: 9, topic: 'Astronomy', moduleNumber: '22.6',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q22_6_01', type: 'mcq',
    question: {
      en: 'What is the Equation of Time (EoT)?',
      hi: 'समय का समीकरण (EoT) क्या है?',
    },
    options: [
      { en: 'The formula for converting UTC to local time', hi: 'UTC को स्थानीय समय में बदलने का सूत्र', sa: 'UTC को स्थानीय समय में बदलने का सूत्र', mai: 'UTC को स्थानीय समय में बदलने का सूत्र', mr: 'UTC को स्थानीय समय में बदलने का सूत्र', ta: 'UTC கோ ஸ்थாநீய ஸமய மேம் பதலநே கா ஸூத்ர', te: 'UTC కో స్థానీయ సమయ మేం బదలనే కా సూత్ర', bn: 'UTC কো স্থানীয সময মেং বদলনে কা সূত্র', kn: 'UTC ಕೋ ಸ್ಥಾನೀಯ ಸಮಯ ಮೇಂ ಬದಲನೇ ಕಾ ಸೂತ್ರ', gu: 'UTC કો સ્થાનીય સમય મેં બદલને કા સૂત્ર' },
      { en: 'The difference between apparent solar time (sundial) and mean solar time (clock)', hi: 'दृश्य सौर समय (धूपघड़ी) और माध्य सौर समय (घड़ी) के बीच अन्तर', sa: 'दृश्य सौर समय (धूपघड़ी) और माध्य सौर समय (घड़ी) के बीच अन्तर', mai: 'दृश्य सौर समय (धूपघड़ी) और माध्य सौर समय (घड़ी) के बीच अन्तर', mr: 'दृश्य सौर समय (धूपघड़ी) और माध्य सौर समय (घड़ी) के बीच अन्तर', ta: 'திருஶ்ய ஸௌர ஸமய (धூபघட़ீ) ஔர மாध்ய ஸௌர ஸமய (घட़ீ) கே பீச அந்தர', te: 'దృశ్య సౌర సమయ (ధూపఘడ़ీ) ఔర మాధ్య సౌర సమయ (ఘడ़ీ) కే బీచ అన్తర', bn: 'দৃশ্য সৌর সময (ধূপঘড়ী) ঔর মাধ্য সৌর সময (ঘড়ী) কে বীচ অন্তর', kn: 'ದೃಶ್ಯ ಸೌರ ಸಮಯ (ಧೂಪಘಡ़ೀ) ಔರ ಮಾಧ್ಯ ಸೌರ ಸಮಯ (ಘಡ़ೀ) ಕೇ ಬೀಚ ಅನ್ತರ', gu: 'દૃશ્ય સૌર સમય (ધૂપઘડ़ી) ઔર માધ્ય સૌર સમય (ઘડ़ી) કે બીચ અન્તર' },
      { en: 'The formula for leap second corrections', hi: 'अधिसेकण्ड सुधार का सूत्र', sa: 'अधिसेकण्ड सुधार का सूत्र', mai: 'अधिसेकण्ड सुधार का सूत्र', mr: 'अधिसेकण्ड सुधार का सूत्र', ta: 'அधிஸேகண்ட ஸுधார கா ஸூத்ர', te: 'అధిసేకణ్డ సుధార కా సూత్ర', bn: 'অধিসেকণ্ড সুধার কা সূত্র', kn: 'ಅಧಿಸೇಕಣ್ಡ ಸುಧಾರ ಕಾ ಸೂತ್ರ', gu: 'અધિસેકણ્ડ સુધાર કા સૂત્ર' },
      { en: 'The relationship between sidereal and solar time', hi: 'नाक्षत्र और सौर समय का सम्बन्ध', sa: 'नाक्षत्र और सौर समय का सम्बन्ध', mai: 'नाक्षत्र और सौर समय का सम्बन्ध', mr: 'नाक्षत्र और सौर समय का सम्बन्ध', ta: 'நாக்ஷத்ர ஔர ஸௌர ஸமய கா ஸம்பந்ध', te: 'నాక్షత్ర ఔర సౌర సమయ కా సమ్బన్ధ', bn: 'নাক্ষত্র ঔর সৌর সময কা সম্বন্ধ', kn: 'ನಾಕ್ಷತ್ರ ಔರ ಸೌರ ಸಮಯ ಕಾ ಸಮ್ಬನ್ಧ', gu: 'નાક્ષત્ર ઔર સૌર સમય કા સમ્બન્ધ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The EoT is the difference between the time shown by a sundial (apparent solar time, based on the actual Sun position) and the time shown by a clock (mean solar time, based on a fictitious Sun moving uniformly). It ranges from +14 to -16 minutes through the year.',
      hi: 'EoT धूपघड़ी द्वारा दिखाए गए समय (दृश्य सौर समय, वास्तविक सूर्य स्थिति पर आधारित) और घड़ी द्वारा दिखाए गए समय (माध्य सौर समय, एक काल्पनिक समान गति वाले सूर्य पर आधारित) के बीच अन्तर है। यह वर्ष भर +14 से -16 मिनट तक होता है।',
    },
  },
  {
    id: 'q22_6_02', type: 'mcq',
    question: {
      en: 'Which two effects cause the Equation of Time?',
      hi: 'कौन-से दो प्रभाव समय का समीकरण उत्पन्न करते हैं?',
    },
    options: [
      { en: 'Precession and nutation', hi: 'पुरस्सरण और अयन-चलन', sa: 'पुरस्सरण और अयन-चलन', mai: 'पुरस्सरण और अयन-चलन', mr: 'पुरस्सरण और अयन-चलन', ta: 'புரஸ்ஸரண ஔர அயந-சலந', te: 'పురస్సరణ ఔర అయన-చలన', bn: 'পুরস্সরণ ঔর অযন-চলন', kn: 'ಪುರಸ್ಸರಣ ಔರ ಅಯನ-ಚಲನ', gu: 'પુરસ્સરણ ઔર અયન-ચલન' },
      { en: 'Obliquity of the ecliptic and orbital eccentricity', hi: 'क्रान्तिवृत्त की तिर्यकता और कक्षीय उत्केन्द्रता', sa: 'क्रान्तिवृत्त की तिर्यकता और कक्षीय उत्केन्द्रता', mai: 'क्रान्तिवृत्त की तिर्यकता और कक्षीय उत्केन्द्रता', mr: 'क्रान्तिवृत्त की तिर्यकता और कक्षीय उत्केन्द्रता', ta: 'க்ராந்திவிருத்த கீ திர்யகதா ஔர கக்ஷீய உத்கேந்த்ரதா', te: 'క్రాన్తివృత్త కీ తిర్యకతా ఔర కక్షీయ ఉత్కేన్ద్రతా', bn: 'ক্রান্তিবৃত্ত কী তির্যকতা ঔর কক্ষীয উত্কেন্দ্রতা', kn: 'ಕ್ರಾನ್ತಿವೃತ್ತ ಕೀ ತಿರ್ಯಕತಾ ಔರ ಕಕ್ಷೀಯ ಉತ್ಕೇನ್ದ್ರತಾ', gu: 'ક્રાન્તિવૃત્ત કી તિર્યકતા ઔર કક્ષીય ઉત્કેન્દ્રતા' },
      { en: 'Parallax and refraction', hi: 'लम्बन और अपवर्तन', sa: 'लम्बन और अपवर्तन', mai: 'लम्बन और अपवर्तन', mr: 'लम्बन और अपवर्तन', ta: 'லம்பந ஔர அபவர்தந', te: 'లమ్బన ఔర అపవర్తన', bn: 'লম্বন ঔর অপবর্তন', kn: 'ಲಮ್ಬನ ಔರ ಅಪವರ್ತನ', gu: 'લમ્બન ઔર અપવર્તન' },
      { en: 'Tidal friction and continental drift', hi: 'ज्वारीय घर्षण और महाद्वीपीय विस्थापन', sa: 'ज्वारीय घर्षण और महाद्वीपीय विस्थापन', mai: 'ज्वारीय घर्षण और महाद्वीपीय विस्थापन', mr: 'ज्वारीय घर्षण और महाद्वीपीय विस्थापन', ta: 'ஜ்வாரீய घர்ஷண ஔர மஹாத்வீபீய விஸ்थாபந', te: 'జ్వారీయ ఘర్షణ ఔర మహాద్వీపీయ విస్థాపన', bn: 'জ্বারীয ঘর্ষণ ঔর মহাদ্বীপীয বিস্থাপন', kn: 'ಜ್ವಾರೀಯ ಘರ್ಷಣ ಔರ ಮಹಾದ್ವೀಪೀಯ ವಿಸ್ಥಾಪನ', gu: 'જ્વારીય ઘર્ષણ ઔર મહાદ્વીપીય વિસ્થાપન' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Two effects combine: (1) Obliquity — the 23.4° tilt of the ecliptic means the Sun\'s motion along the ecliptic projects non-uniformly onto the equator. (2) Eccentricity — Earth\'s elliptical orbit makes the Sun appear to move faster in January and slower in July.',
      hi: 'दो प्रभाव मिलते हैं: (1) तिर्यकता — क्रान्तिवृत्त का 23.4° झुकाव अर्थात सूर्य की क्रान्तिवृत्तीय गति विषुवत पर असमान रूप से प्रक्षेपित होती है। (2) उत्केन्द्रता — पृथ्वी की दीर्घवृत्तीय कक्षा सूर्य को जनवरी में तेज़ और जुलाई में धीमा दिखाती है।',
    },
  },
  {
    id: 'q22_6_03', type: 'mcq',
    question: {
      en: 'The EoT reaches its most negative value (sundial behind clock) of about -16 minutes around:',
      hi: 'EoT अपना सर्वाधिक ऋणात्मक मान (धूपघड़ी घड़ी से पीछे) लगभग -16 मिनट किसके आसपास पहुँचता है:',
    },
    options: [
      { en: 'February', hi: 'फरवरी', sa: 'फरवरी', mai: 'फरवरी', mr: 'फरवरी', ta: 'फரவரீ', te: 'ఫరవరీ', bn: 'ফরবরী', kn: 'ಫರವರೀ', gu: 'ફરવરી' },
      { en: 'June', hi: 'जून', sa: 'जून', mai: 'जून', mr: 'जून', ta: 'ஜூந', te: 'జూన', bn: 'জূন', kn: 'ಜೂನ', gu: 'જૂન' },
      { en: 'November', hi: 'नवम्बर', sa: 'नवम्बर', mai: 'नवम्बर', mr: 'नवम्बर', ta: 'நவம்பர', te: 'నవమ్బర', bn: 'নবম্বর', kn: 'ನವಮ್ಬರ', gu: 'નવમ્બર' },
      { en: 'September', hi: 'सितम्बर', sa: 'सितम्बर', mai: 'सितम्बर', mr: 'सितम्बर', ta: 'ஸிதம்பர', te: 'సితమ్బర', bn: 'সিতম্বর', kn: 'ಸಿತಮ್ಬರ', gu: 'સિતમ્બર' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The EoT dips to about -16 minutes around November 3. At this time, both the obliquity and eccentricity effects work in the same direction, creating the year\'s largest departure. Solar noon occurs at about 12:16 on the clock (before timezone and longitude adjustments).',
      hi: 'EoT लगभग 3 नवम्बर को -16 मिनट तक गिरता है। इस समय तिर्यकता और उत्केन्द्रता दोनों प्रभाव एक ही दिशा में कार्य करते हैं, वर्ष का सबसे बड़ा विचलन बनाते हैं। सौर मध्याह्न घड़ी पर लगभग 12:16 (समयक्षेत्र और देशान्तर समायोजन से पहले) पर होता है।',
    },
  },
  {
    id: 'q22_6_04', type: 'true_false',
    question: {
      en: 'The analemma (figure-8 pattern in the sky) is a visual representation of the Equation of Time combined with the Sun\'s changing declination.',
      hi: 'एनालेम्मा (आकाश में अंक-8 आकृति) समय के समीकरण और सूर्य की बदलती क्रान्ति का संयुक्त दृश्य प्रतिनिधित्व है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. If you photograph the Sun at the same clock time every day for a year, it traces a figure-8 (analemma). The horizontal displacement is the EoT (east-west shift), and the vertical displacement is the changing declination (north-south shift through the seasons).',
      hi: 'सत्य। यदि आप प्रतिदिन एक ही घड़ी समय पर एक वर्ष तक सूर्य का चित्र लें, तो यह अंक-8 (एनालेम्मा) बनाता है। क्षैतिज विस्थापन EoT (पूर्व-पश्चिम खिसकाव) है, और ऊर्ध्वाधर विस्थापन बदलती क्रान्ति (ऋतुओं में उत्तर-दक्षिण खिसकाव) है।',
    },
  },
  {
    id: 'q22_6_05', type: 'mcq',
    question: {
      en: 'In the EoT formula, the term y = tan²(ε/2) represents the effect of:',
      hi: 'EoT सूत्र में, y = tan²(ε/2) पद किसका प्रभाव दर्शाता है:',
    },
    options: [
      { en: 'Orbital eccentricity', hi: 'कक्षीय उत्केन्द्रता', sa: 'कक्षीय उत्केन्द्रता', mai: 'कक्षीय उत्केन्द्रता', mr: 'कक्षीय उत्केन्द्रता', ta: 'கக்ஷீய உத்கேந்த்ரதா', te: 'కక్షీయ ఉత్కేన్ద్రతా', bn: 'কক্ষীয উত্কেন্দ্রতা', kn: 'ಕಕ್ಷೀಯ ಉತ್ಕೇನ್ದ್ರತಾ', gu: 'કક્ષીય ઉત્કેન્દ્રતા' },
      { en: 'Obliquity of the ecliptic (ε ≈ 23.4°)', hi: 'क्रान्तिवृत्त की तिर्यकता (ε ≈ 23.4°)', sa: 'क्रान्तिवृत्त की तिर्यकता (ε ≈ 23.4°)', mai: 'क्रान्तिवृत्त की तिर्यकता (ε ≈ 23.4°)', mr: 'क्रान्तिवृत्त की तिर्यकता (ε ≈ 23.4°)', ta: 'க்ராந்திவிருத்த கீ திர்யகதா (ε ≈ 23.4°)', te: 'క్రాన్తివృత్త కీ తిర్యకతా (ε ≈ 23.4°)', bn: 'ক্রান্তিবৃত্ত কী তির্যকতা (ε ≈ 23.4°)', kn: 'ಕ್ರಾನ್ತಿವೃತ್ತ ಕೀ ತಿರ್ಯಕತಾ (ε ≈ 23.4°)', gu: 'ક્રાન્તિવૃત્ત કી તિર્યકતા (ε ≈ 23.4°)' },
      { en: 'Lunar parallax', hi: 'चन्द्र लम्बन', sa: 'चन्द्र लम्बन', mai: 'चन्द्र लम्बन', mr: 'चन्द्र लम्बन', ta: 'சந்த்ர லம்பந', te: 'చన్ద్ర లమ్బన', bn: 'চন্দ্র লম্বন', kn: 'ಚನ್ದ್ರ ಲಮ್ಬನ', gu: 'ચન્દ્ર લમ્બન' },
      { en: 'Atmospheric refraction', hi: 'वायुमण्डलीय अपवर्तन', sa: 'वायुमण्डलीय अपवर्तन', mai: 'वायुमण्डलीय अपवर्तन', mr: 'वायुमण्डलीय अपवर्तन', ta: 'வாயுமண்டலீய அபவர்தந', te: 'వాయుమణ్డలీయ అపవర్తన', bn: 'বাযুমণ্ডলীয অপবর্তন', kn: 'ವಾಯುಮಣ್ಡಲೀಯ ಅಪವರ್ತನ', gu: 'વાયુમણ્ડલીય અપવર્તન' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The y = tan²(ε/2) factor captures the obliquity effect. With ε ≈ 23.44°, y ≈ 0.0431. This drives the sin(2L₀) and sin(4L₀) terms in the EoT formula, which create the semi-annual oscillation in the EoT curve.',
      hi: 'y = tan²(ε/2) गुणक तिर्यकता प्रभाव को पकड़ता है। ε ≈ 23.44° के साथ, y ≈ 0.0431। यह EoT सूत्र में sin(2L₀) और sin(4L₀) पदों को चलाता है, जो EoT वक्र में अर्ध-वार्षिक दोलन बनाते हैं।',
    },
  },
  {
    id: 'q22_6_06', type: 'mcq',
    question: {
      en: 'How is the EoT converted from radians to minutes of time?',
      hi: 'EoT रेडियन से समय के मिनटों में कैसे बदला जाता है?',
    },
    options: [
      { en: 'Multiply by 60', hi: '60 से गुणा', sa: '60 से गुणा', mai: '60 से गुणा', mr: '60 से गुणा', ta: '60 ஸே குணா', te: '60 సే గుణా', bn: '60 সে গুণা', kn: '60 ಸೇ ಗುಣಾ', gu: '60 સે ગુણા' },
      { en: 'Multiply by (180/π) x 4', hi: '(180/π) × 4 से गुणा', sa: '(180/π) × 4 से गुणा', mai: '(180/π) × 4 से गुणा', mr: '(180/π) × 4 से गुणा', ta: '(180/π) × 4 ஸே குணா', te: '(180/π) × 4 సే గుణా', bn: '(180/π) × 4 সে গুণা', kn: '(180/π) × 4 ಸೇ ಗುಣಾ', gu: '(180/π) × 4 સે ગુણા' },
      { en: 'Divide by 15', hi: '15 से विभाजन', sa: '15 से विभाजन', mai: '15 से विभाजन', mr: '15 से विभाजन', ta: '15 ஸே விभாஜந', te: '15 సే విభాజన', bn: '15 সে বিভাজন', kn: '15 ಸೇ ವಿಭಾಜನ', gu: '15 સે વિભાજન' },
      { en: 'Multiply by 24', hi: '24 से गुणा', sa: '24 से गुणा', mai: '24 से गुणा', mr: '24 से गुणा', ta: '24 ஸே குணா', te: '24 సే గుణా', bn: '24 সে গুণা', kn: '24 ಸೇ ಗುಣಾ', gu: '24 સે ગુણા' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'First convert radians to degrees (multiply by 180/π), then convert degrees to minutes of time (multiply by 4, since 1° of Sun motion = 4 minutes of time because the Sun traverses 360° in 24 hours, or 15° per hour, or 1° per 4 minutes).',
      hi: 'पहले रेडियन को अंशों में बदलें (180/π से गुणा), फिर अंशों को समय के मिनटों में बदलें (4 से गुणा, क्योंकि सूर्य गति का 1° = 4 मिनट समय क्योंकि सूर्य 24 घण्टों में 360° पार करता है, या 15° प्रति घण्टा, या 1° प्रति 4 मिनट)।',
    },
  },
  {
    id: 'q22_6_07', type: 'true_false',
    question: {
      en: 'Without the EoT correction, Abhijit Muhurta timing would be off by up to 16 minutes.',
      hi: 'EoT सुधार के बिना, अभिजित मुहूर्त का समय 16 मिनट तक गलत होगा।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Abhijit Muhurta is centered on solar noon. If you assume solar noon is at 12:00 local mean time (ignoring EoT), the muhurta timing is wrong by the full EoT value — up to 16 minutes in November. This cascades to Hora calculations and other solar-noon-based divisions.',
      hi: 'सत्य। अभिजित मुहूर्त सौर मध्याह्न पर केन्द्रित है। यदि आप सौर मध्याह्न 12:00 स्थानीय माध्य समय मान लें (EoT अनदेखा करें), तो मुहूर्त समय पूर्ण EoT मान से गलत होता है — नवम्बर में 16 मिनट तक। यह होरा गणनाओं और अन्य सौर-मध्याह्न-आधारित विभाजनों में प्रसारित होता है।',
    },
  },
  {
    id: 'q22_6_08', type: 'mcq',
    question: {
      en: 'The EoT crosses zero (sundial matches clock) approximately how many times per year?',
      hi: 'EoT प्रतिवर्ष लगभग कितनी बार शून्य पार करता है (धूपघड़ी घड़ी से मिलती है)?',
    },
    options: [
      { en: '1 time', hi: '1 बार', sa: '1 बार', mai: '1 बार', mr: '1 बार', ta: '1 பார', te: '1 బార', bn: '1 বার', kn: '1 ಬಾರ', gu: '1 બાર' },
      { en: '2 times', hi: '2 बार', sa: '2 बार', mai: '2 बार', mr: '2 बार', ta: '2 பார', te: '2 బార', bn: '2 বার', kn: '2 ಬಾರ', gu: '2 બાર' },
      { en: '4 times', hi: '4 बार', sa: '4 बार', mai: '4 बार', mr: '4 बार', ta: '4 பார', te: '4 బార', bn: '4 বার', kn: '4 ಬಾರ', gu: '4 બાર' },
      { en: '12 times', hi: '12 बार', sa: '12 बार', mai: '12 बार', mr: '12 बार', ta: '12 பார', te: '12 బార', bn: '12 বার', kn: '12 ಬಾರ', gu: '12 બાર' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The EoT crosses zero four times per year: around April 15, June 13, September 1, and December 25. On these dates, a sundial and a clock show the same noon time (before longitude and timezone adjustments).',
      hi: 'EoT प्रतिवर्ष चार बार शून्य पार करता है: लगभग 15 अप्रैल, 13 जून, 1 सितम्बर और 25 दिसम्बर। इन तिथियों पर धूपघड़ी और घड़ी एक ही मध्याह्न समय दिखाती हैं (देशान्तर और समयक्षेत्र समायोजन से पहले)।',
    },
  },
  {
    id: 'q22_6_09', type: 'mcq',
    question: {
      en: 'The eccentricity component of the EoT has its largest effect near:',
      hi: 'EoT का उत्केन्द्रता घटक किसके निकट सबसे बड़ा प्रभाव रखता है:',
    },
    options: [
      { en: 'Perihelion (January) and aphelion (July)', hi: 'उपसौर (जनवरी) और अपसौर (जुलाई)', sa: 'उपसौर (जनवरी) और अपसौर (जुलाई)', mai: 'उपसौर (जनवरी) और अपसौर (जुलाई)', mr: 'उपसौर (जनवरी) और अपसौर (जुलाई)', ta: 'உபஸௌர (ஜநவரீ) ஔர அபஸௌர (ஜுலாஈ)', te: 'ఉపసౌర (జనవరీ) ఔర అపసౌర (జులాఈ)', bn: 'উপসৌর (জনবরী) ঔর অপসৌর (জুলাঈ)', kn: 'ಉಪಸೌರ (ಜನವರೀ) ಔರ ಅಪಸೌರ (ಜುಲಾಈ)', gu: 'ઉપસૌર (જનવરી) ઔર અપસૌર (જુલાઈ)' },
      { en: 'The equinoxes (March and September)', hi: 'विषुव (मार्च और सितम्बर)', sa: 'विषुव (मार्च और सितम्बर)', mai: 'विषुव (मार्च और सितम्बर)', mr: 'विषुव (मार्च और सितम्बर)', ta: 'விஷுவ (மார்ச ஔர ஸிதம்பர)', te: 'విషువ (మార్చ ఔర సితమ్బర)', bn: 'বিষুব (মার্চ ঔর সিতম্বর)', kn: 'ವಿಷುವ (ಮಾರ್ಚ ಔರ ಸಿತಮ್ಬರ)', gu: 'વિષુવ (માર્ચ ઔર સિતમ્બર)' },
      { en: 'The solstices (June and December)', hi: 'अयनान्त (जून और दिसम्बर)', sa: 'अयनान्त (जून और दिसम्बर)', mai: 'अयनान्त (जून और दिसम्बर)', mr: 'अयनान्त (जून और दिसम्बर)', ta: 'அயநாந்த (ஜூந ஔர திஸம்பர)', te: 'అయనాన్త (జూన ఔర దిసమ్బర)', bn: 'অযনান্ত (জূন ঔর দিসম্বর)', kn: 'ಅಯನಾನ್ತ (ಜೂನ ಔರ ದಿಸಮ್ಬರ)', gu: 'અયનાન્ત (જૂન ઔર દિસમ્બર)' },
      { en: 'Quadrature points (45° from perihelion)', hi: 'अभिलम्ब बिन्दु (उपसौर से 45°)', sa: 'अभिलम्ब बिन्दु (उपसौर से 45°)', mai: 'अभिलम्ब बिन्दु (उपसौर से 45°)', mr: 'अभिलम्ब बिन्दु (उपसौर से 45°)', ta: 'அभிலம்ப பிந்து (உபஸௌர ஸே 45°)', te: 'అభిలమ్బ బిన్దు (ఉపసౌర సే 45°)', bn: 'অভিলম্ব বিন্দু (উপসৌর সে 45°)', kn: 'ಅಭಿಲಮ್ಬ ಬಿನ್ದು (ಉಪಸೌರ ಸೇ 45°)', gu: 'અભિલમ્બ બિન્દુ (ઉપસૌર સે 45°)' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'The eccentricity effect is a sine wave with period ~1 year, peaking near perihelion (early January) and its negative mirror near aphelion (early July). The amplitude is approximately ±7.7 minutes, driven by the -2e x sin(M) term in the EoT formula.',
      hi: 'उत्केन्द्रता प्रभाव ~1 वर्ष अवधि की ज्या तरंग है, उपसौर (जनवरी आरम्भ) के निकट शिखर और अपसौर (जुलाई आरम्भ) के निकट ऋणात्मक प्रतिबिम्ब। आयाम लगभग ±7.7 मिनट है, EoT सूत्र में -2e × sin(M) पद द्वारा संचालित।',
    },
  },
  {
    id: 'q22_6_10', type: 'mcq',
    question: {
      en: 'In our Panchang app, the EoT is applied in the calculation of:',
      hi: 'हमारे पंचांग ऐप में EoT किसकी गणना में लागू होता है:',
    },
    options: [
      { en: 'Only moonrise', hi: 'केवल चन्द्रोदय', sa: 'केवल चन्द्रोदय', mai: 'केवल चन्द्रोदय', mr: 'केवल चन्द्रोदय', ta: 'கேவல சந்த்ரோதய', te: 'కేవల చన్ద్రోదయ', bn: 'কেবল চন্দ্রোদয', kn: 'ಕೇವಲ ಚನ್ದ್ರೋದಯ', gu: 'કેવલ ચન્દ્રોદય' },
      { en: 'Only the calendar date', hi: 'केवल कैलेण्डर तिथि', sa: 'केवल कैलेण्डर तिथि', mai: 'केवल कैलेण्डर तिथि', mr: 'केवल कैलेण्डर तिथि', ta: 'கேவல கைலேண்டர திथி', te: 'కేవల కైలేణ్డర తిథి', bn: 'কেবল কৈলেণ্ডর তিথি', kn: 'ಕೇವಲ ಕೈಲೇಣ್ಡರ ತಿಥಿ', gu: 'કેવલ કૈલેણ્ડર તિથિ' },
      { en: 'Both sunrise and sunset (and hence all sunrise-dependent timings)', hi: 'सूर्योदय और सूर्यास्त दोनों (और इसलिए सभी सूर्योदय-निर्भर समय)', sa: 'सूर्योदय और सूर्यास्त दोनों (और इसलिए सभी सूर्योदय-निर्भर समय)', mai: 'सूर्योदय और सूर्यास्त दोनों (और इसलिए सभी सूर्योदय-निर्भर समय)', mr: 'सूर्योदय और सूर्यास्त दोनों (और इसलिए सभी सूर्योदय-निर्भर समय)', ta: 'ஸூர்யோதய ஔர ஸூர்யாஸ்த தோநோம் (ஔர இஸலிஎ ஸभீ ஸூர்யோதய-நிர்भர ஸமய)', te: 'సూర్యోదయ ఔర సూర్యాస్త దోనోం (ఔర ఇసలిఏ సభీ సూర్యోదయ-నిర్భర సమయ)', bn: 'সূর্যোদয ঔর সূর্যাস্ত দোনোং (ঔর ইসলিএ সভী সূর্যোদয-নির্ভর সময)', kn: 'ಸೂರ್ಯೋದಯ ಔರ ಸೂರ್ಯಾಸ್ತ ದೋನೋಂ (ಔರ ಇಸಲಿಏ ಸಭೀ ಸೂರ್ಯೋದಯ-ನಿರ್ಭರ ಸಮಯ)', gu: 'સૂર્યોદય ઔર સૂર્યાસ્ત દોનોં (ઔર ઇસલિએ સભી સૂર્યોદય-નિર્ભર સમય)' },
      { en: 'Only Tithi calculations', hi: 'केवल तिथि गणना', sa: 'केवल तिथि गणना', mai: 'केवल तिथि गणना', mr: 'केवल तिथि गणना', ta: 'கேவல திथி கணநா', te: 'కేవల తిథి గణనా', bn: 'কেবল তিথি গণনা', kn: 'ಕೇವಲ ತಿಥಿ ಗಣನಾ', gu: 'કેવલ તિથિ ગણના' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The EoT is applied when computing solar noon, which determines both sunrise and sunset. Since Rahu Kaal, Yamaghanda, Gulika, Abhijit Muhurta, and Hora calculations all depend on sunrise/sunset, the EoT correction propagates through the entire Panchang.',
      hi: 'EoT सौर मध्याह्न गणना में लागू होता है, जो सूर्योदय और सूर्यास्त दोनों निर्धारित करता है। राहु काल, यमघण्ट, गुलिक, अभिजित मुहूर्त और होरा गणनाएँ सभी सूर्योदय/सूर्यास्त पर निर्भर हैं, अतः EoT सुधार सम्पूर्ण पंचांग में प्रसारित होता है।',
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
          {tl({ en: 'Sundial Time vs Clock Time', hi: 'धूपघड़ी समय बनाम घड़ी समय', sa: 'धूपघड़ी समय बनाम घड़ी समय' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>धूपघड़ी &quot;दृश्य सौर समय&quot; बताती है — जब छाया सबसे छोटी हो, वह सौर मध्याह्न है, अर्थात सूर्य अपने उच्चतम बिन्दु पर और ठीक दक्षिण दिशा में (उत्तरी गोलार्ध में)। घड़ी &quot;माध्य सौर समय&quot; बताती है — समान 24-घण्टे के दिन, प्रत्येक मिनट ठीक समान लम्बाई। ये दोनों 16 मिनट तक असहमत होते हैं क्योंकि वास्तविक सूर्य आकाश में स्थिर गति से नहीं चलता। समय का समीकरण (EoT) इस विसंगति को मापता है: EoT = दृश्य सौर समय - माध्य सौर समय। जब EoT धनात्मक हो, धूपघड़ी घड़ी से आगे है (सूर्य 12:00 माध्य समय से पहले अपने उच्चतम बिन्दु पर पहुँचता है)।</> : <>A sundial tells &quot;apparent solar time&quot; — when the shadow is shortest, it is solar noon, meaning the Sun is at its highest point and exactly due south (in the Northern Hemisphere). A clock tells &quot;mean solar time&quot; — uniform 24-hour days, every minute exactly the same length. These two disagree by up to 16 minutes because the real Sun does not move at constant speed across the sky. The Equation of Time (EoT) quantifies this discrepancy: EoT = Apparent Solar Time - Mean Solar Time. When EoT is positive, the sundial is ahead of the clock (the Sun reaches its highest point before 12:00 mean time).</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दो पूर्णतया स्वतन्त्र भौतिक प्रभाव यह विसंगति बनाते हैं। प्रभाव 1 — तिर्यकता: क्रान्तिवृत्त (सूर्य का दृश्य पथ) खगोलीय विषुवत से 23.4° झुका है। यदि सूर्य क्रान्तिवृत्त पर पूर्णतया स्थिर गति से चलता भी, तो विषुवत पर इसका प्रक्षेप (जो विषुवांश और इसलिए घड़ी समय निर्धारित करता है) असमान होगा। अयनान्तों के निकट, क्रान्तिवृत्त विषुवत से लगभग समान्तर है, अतः 1° क्रान्तिवृत्तीय गति ≈ 1° विषुवांश। विषुवों के निकट, क्रान्तिवृत्त विषुवत को एक कोण पर काटता है, अतः 1° क्रान्तिवृत्तीय गति केवल ~0.92° विषुवांश परिवर्तन उत्पन्न करती है। यह EoT में अर्ध-वार्षिक दोलन बनाता है।</> : <>Two completely independent physical effects create this discrepancy. Effect 1 — Obliquity: The ecliptic (the Sun&apos;s apparent path) is tilted 23.4° to the celestial equator. Even if the Sun moved at perfectly constant speed along the ecliptic, its projection onto the equator (which determines right ascension and hence clock time) would be non-uniform. Near the solstices, the ecliptic is nearly parallel to the equator, so 1° of ecliptic motion ≈ 1° of right ascension. Near the equinoxes, the ecliptic crosses the equator at an angle, so 1° of ecliptic motion produces only ~0.92° of right ascension change. This creates a semi-annual oscillation in the EoT.</>}</p>
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
          {tl({ en: 'The Formula', hi: 'सूत्र', sa: 'सूत्र' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रभाव 2 — उत्केन्द्रता: पृथ्वी की कक्षा वृत्त नहीं बल्कि दीर्घवृत्त (e ≈ 0.017) है। केप्लर के द्वितीय नियम से पृथ्वी उपसौर (जनवरी) के निकट तेज़ और अपसौर (जुलाई) के निकट धीमी चलती है। इससे सूर्य क्रान्तिवृत्त पर तेज़ या धीमा गतिमान दिखता है, EoT में ~7.7 मिनट आयाम का वार्षिक दोलन बनाता है। तिर्यकता प्रभाव (~9.9 मिनट अर्ध-वार्षिक) के साथ मिलकर, दोनों विशिष्ट विषम द्वि-शिखर EoT वक्र बनाते हैं।</> : <>Effect 2 — Eccentricity: Earth&apos;s orbit is not a circle but an ellipse (e ≈ 0.017). By Kepler&apos;s second law, Earth moves faster near perihelion (January) and slower near aphelion (July). This makes the Sun appear to move faster or slower along the ecliptic, creating an annual oscillation in the EoT with amplitude ~7.7 minutes. Combined with the obliquity effect (~9.9 minutes semi-annual), the two produce the characteristic asymmetric double-peaked EoT curve.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Mathematical Expression', hi: 'गणितीय अभिव्यक्ति', sa: 'गणितीय अभिव्यक्ति' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Let y = tan²(ε/2) where ε ≈ 23.44° is the obliquity. Let e ≈ 0.01671 be the eccentricity. Let L₀ be the Sun&apos;s mean longitude and M be the mean anomaly. Then:
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2 font-mono">
          EoT = y·sin(2L₀) - 2e·sin(M) + 4ey·sin(M)·cos(2L₀) - 0.5y²·sin(4L₀) - 1.25e²·sin(2M)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>y = tan²(ε/2) जहाँ ε ≈ 23.44° तिर्यकता है। e ≈ 0.01671 उत्केन्द्रता। L₀ सूर्य का माध्य भोगांश और M माध्य विलम्बिका। परिणाम रेडियन में है। मिनटों में बदलने के लिए: EoT_minutes = EoT × (180/π) × 4। गुणक 4 इसलिए क्योंकि सूर्य 1440 मिनट (24 × 60) में 360° पार करता है, अतः 1° = 4 मिनट समय।</> : <>This result is in radians. To convert to minutes: EoT_minutes = EoT × (180/π) × 4. The factor 4 comes from the Sun traversing 360° in 1440 minutes (24 × 60), so 1° = 4 minutes of time.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Term by term:</span> y·sin(2L₀) is the obliquity effect (semi-annual, ~±9.9 min). -2e·sin(M) is the eccentricity effect (annual, ~±7.7 min). The remaining terms are cross-coupling and higher-order corrections (&lt;1 minute each).
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'The Analemma', hi: 'एनालेम्मा', sa: 'एनालेम्मा' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>यदि आप प्रतिदिन एक ही घड़ी समय पर पूरे वर्ष सूर्य का चित्र लें, तो यह उसी स्थान पर नहीं लौटता। इसके बजाय, यह एनालेम्मा नामक अंक-8 आकृति बनाता है। पूर्व-पश्चिम विस्थापन EoT है (EoT &gt; 0 होने पर सूर्य अपनी माध्य स्थिति से पूर्व में, EoT &lt; 0 होने पर पश्चिम में)। उत्तर-दक्षिण विस्थापन बदलती क्रान्ति है (ग्रीष्म में ऊँचा, शीत में नीचा)। एनालेम्मा विषम है क्योंकि उत्केन्द्रता और तिर्यकता प्रभावों की भिन्न अवधियाँ हैं — एक पाश दूसरे से बड़ा है।</> : <>If you photograph the Sun at the same clock time every day for a year, it does NOT return to the same spot. Instead, it traces a figure-8 pattern called the analemma. The east-west displacement is the EoT (the Sun is east of its mean position when EoT &gt; 0, west when EoT &lt; 0). The north-south displacement is the changing declination (high in summer, low in winter). The analemma is asymmetric because the eccentricity and obliquity effects have different periods — one loop is larger than the other.</>}</p>
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
          {tl({ en: 'Why This Matters for Jyotish', hi: 'ज्योतिष के लिए यह क्यों महत्त्वपूर्ण है', sa: 'ज्योतिष के लिए यह क्यों महत्त्वपूर्ण है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सौर मध्याह्न घड़ी पर 12:00 नहीं है। यह 12:00 है जो (1) समयक्षेत्र केन्द्रीय याम्योत्तर से प्रेक्षक का देशान्तर अन्तर, और (2) समय का समीकरण द्वारा सुधारित है। कोर्सो (6.80°E, 15°E पर केन्द्रित CET/CEST समयक्षेत्र) में केवल देशान्तर सौर मध्याह्न ~33 मिनट देर करता है। EoT (+14 से -16 मिनट) जोड़ने पर, कोर्सो में सौर मध्याह्न लगभग 12:50 CET (दिसम्बर) से 13:50 CEST (जुलाई) तक भिन्न होता है। सूर्योदय का सन्दर्भ लेने वाला प्रत्येक पंचांग तत्व यह सुधार विरासत में लेता है।</> : <>Solar noon is not 12:00 on the clock. It is 12:00 corrected by (1) the observer&apos;s longitude offset from the timezone central meridian, and (2) the Equation of Time. In Corseaux (6.80°E, CET/CEST timezone centered on 15°E), the longitude alone shifts solar noon ~33 minutes late. Adding EoT (which ranges from +14 to -16 minutes), solar noon in Corseaux varies from about 12:50 CET (December) to 13:50 CEST (July). Every Panchang element that references sunrise inherits this correction.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>विशिष्ट प्रभाव: अभिजित मुहूर्त सौर मध्याह्न पर केन्द्रित दो घटिका (48 मिनट) है — दिन का सर्वाधिक शुभ समय। EoT सुधार के बिना यह मुहूर्त 16 मिनट तक विस्थापित होगा। होरा गणनाएँ दिन (सूर्योदय से सूर्योदय) को 24 ग्रह घण्टों में विभक्त करती हैं। गलत सूर्योदय सभी होरा सीमाओं को खिसकाता है। राहु काल सूर्योदय के बाद दिन के विशिष्ट अंश से आरम्भ 1.5 घण्टे की खिड़की है — यदि सूर्योदय 4 मिनट गलत हो (EoT के बिना एकल-पास गणना की त्रुटि), तो राहु काल सीमाएँ 4 मिनट खिसकती हैं। हमारा इंजन सूर्योदय और सूर्यास्त दोनों गणनाओं में EoT लागू करता है, जिससे सभी अधोप्रवाह समय सटीक रहें।</> : <>Specific impacts: Abhijit Muhurta is defined as the two ghatikas (48 minutes) centered on solar noon — the most auspicious time of day. Without EoT correction, this muhurta would be misplaced by up to 16 minutes. Hora calculations divide the day (sunrise to sunrise) into 24 planetary hours. An incorrect sunrise shifts all hora boundaries. Rahu Kaal is computed as the 1.5-hour window starting at a specific fraction of the day after sunrise — if sunrise is wrong by 4 minutes (the error from a single-pass calculation without EoT), Rahu Kaal boundaries shift by 4 minutes. Our engine applies EoT in both the sunrise and sunset calculations, ensuring all downstream timings are accurate.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;समय का समीकरण केवल समयक्षेत्रों के बारे में है।&quot; समयक्षेत्र राजनीतिक/प्रशासनिक व्यवस्था है। EoT एक मूलभूत खगोलीय घटना है जो समयक्षेत्रों से स्वतन्त्र विद्यमान है। यदि आप अपने समयक्षेत्र के केन्द्रीय याम्योत्तर पर ठीक रहते भी, तो तिर्यकता और उत्केन्द्रता प्रभावों के कारण आपकी धूपघड़ी अभी भी आपकी घड़ी से 16 मिनट तक असहमत होगी।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The Equation of Time is just about timezones.&quot; Timezones are a political/administrative system. The EoT is a fundamental astronomical phenomenon that exists regardless of timezones. Even if you lived exactly on the central meridian of your timezone, your sundial would still disagree with your clock by up to 16 minutes because of the obliquity and eccentricity effects.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>EoT को समझना प्राचीन भारतीय खगोलशास्त्र को आधुनिक संगणक अभ्यास से जोड़ता है। सूर्य सिद्धान्त पहले से ही अपने मन्दफल (केन्द्र समीकरण) सुधार द्वारा उत्केन्द्रता प्रभाव का लेखा-जोखा रखता है। तिर्यकता प्रभाव क्रान्तिवृत्तीय और विषुवतीय निर्देशांकों के बीच रूपान्तरण (क्रान्ति गणना) में प्रकट होता है। हमारा इंजन दोनों प्रभावों को संक्षिप्त EoT सूत्र में संयोजित करता है, जब भी सूर्योदय या सूर्यास्त गणित करता है इसे लागू करता है — वे आधारभूत सन्दर्भ समय जिन पर सम्पूर्ण पंचांग संरचना टिकी है।</> : <>Understanding the EoT connects ancient Indian astronomy with modern computational practice. The Surya Siddhanta already accounts for the eccentricity effect through its mandaphala (equation of center) correction. The obliquity effect appears in the conversion between ecliptic and equatorial coordinates (kranti calculation). Our engine combines both effects in the compact EoT formula, applying it every time it computes sunrise or sunset — the foundational reference times upon which the entire Panchang structure rests.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_6Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}