'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-4.json';

const META: ModuleMeta = {
  id: 'mod_22_4', phase: 9, topic: 'Astronomy', moduleNumber: '22.4',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q22_4_01', type: 'mcq',
    question: {
      en: 'What geometric altitude defines sunrise (Sun\'s upper limb touching the horizon)?',
      hi: 'सूर्योदय (सूर्य का ऊपरी अंग क्षितिज को छूता है) को कौन-सी ज्यामितीय ऊँचाई परिभाषित करती है?',
    },
    options: [
      { en: '0° (geometric horizon)', hi: '0° (ज्यामितीय क्षितिज)', sa: '0° (ज्यामितीय क्षितिज)', mai: '0° (ज्यामितीय क्षितिज)', mr: '0° (ज्यामितीय क्षितिज)', ta: '0° (ஜ்யாமிதீய க்ஷிதிஜ)', te: '0° (జ్యామితీయ క్షితిజ)', bn: '0° (জ্যামিতীয ক্ষিতিজ)', kn: '0° (ಜ್ಯಾಮಿತೀಯ ಕ್ಷಿತಿಜ)', gu: '0° (જ્યામિતીય ક્ષિતિજ)' },
      { en: '-0.8333° (34\' refraction + 16\' semi-diameter)', hi: '-0.8333° (34\' अपवर्तन + 16\' अर्ध-व्यास)' },
      { en: '-6° (civil twilight)', hi: '-6° (नागरिक गोधूलि)', sa: '-6° (नागरिक गोधूलि)', mai: '-6° (नागरिक गोधूलि)', mr: '-6° (नागरिक गोधूलि)', ta: '-6° (நாகரிக கோधூலி)', te: '-6° (నాగరిక గోధూలి)', bn: '-6° (নাগরিক গোধূলি)', kn: '-6° (ನಾಗರಿಕ ಗೋಧೂಲಿ)', gu: '-6° (નાગરિક ગોધૂલિ)' },
      { en: '-0.5667° (refraction only)', hi: '-0.5667° (केवल अपवर्तन)', sa: '-0.5667° (केवल अपवर्तन)', mai: '-0.5667° (केवल अपवर्तन)', mr: '-0.5667° (केवल अपवर्तन)', ta: '-0.5667° (கேவல அபவர்தந)', te: '-0.5667° (కేవల అపవర్తన)', bn: '-0.5667° (কেবল অপবর্তন)', kn: '-0.5667° (ಕೇವಲ ಅಪವರ್ತನ)', gu: '-0.5667° (કેવલ અપવર્તન)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sunrise is defined when the Sun\'s geometric center is at -0.8333° below the horizon. This accounts for 34\' of atmospheric refraction (light bending) and 16\' for the Sun\'s semi-diameter (we see the upper limb, not the center).',
      hi: 'सूर्योदय तब परिभाषित है जब सूर्य का ज्यामितीय केन्द्र क्षितिज से -0.8333° नीचे हो। इसमें 34\' वायुमण्डलीय अपवर्तन (प्रकाश का मुड़ना) और 16\' सूर्य के अर्ध-व्यास (हम ऊपरी अंग देखते हैं, केन्द्र नहीं) सम्मिलित हैं।',
    },
  },
  {
    id: 'q22_4_02', type: 'mcq',
    question: {
      en: 'The hour angle H₀ at sunrise is computed from:',
      hi: 'सूर्योदय पर घण्टा कोण H₀ की गणना किससे होती है?',
    },
    options: [
      { en: 'H₀ = arccos([sin(-0.8333°) - sin(lat) x sin(decl)] / [cos(lat) x cos(decl)])', hi: 'H₀ = arccos([sin(-0.8333°) - sin(अक्षांश) × sin(क्रान्ति)] / [cos(अक्षांश) × cos(क्रान्ति)])', sa: 'H₀ = arccos([sin(-0.8333°) - sin(अक्षांश) × sin(क्रान्ति)] / [cos(अक्षांश) × cos(क्रान्ति)])', mai: 'H₀ = arccos([sin(-0.8333°) - sin(अक्षांश) × sin(क्रान्ति)] / [cos(अक्षांश) × cos(क्रान्ति)])', mr: 'H₀ = arccos([sin(-0.8333°) - sin(अक्षांश) × sin(क्रान्ति)] / [cos(अक्षांश) × cos(क्रान्ति)])', ta: 'H₀ = arccos([sin(-0.8333°) - sin(அக்ஷாம்ஶ) × sin(க்ராந்தி)] / [cos(அக்ஷாம்ஶ) × cos(க்ராந்தி)])', te: 'H₀ = arccos([sin(-0.8333°) - sin(అక్షాంశ) × sin(క్రాన్తి)] / [cos(అక్షాంశ) × cos(క్రాన్తి)])', bn: 'H₀ = arccos([sin(-0.8333°) - sin(অক্ষাংশ) × sin(ক্রান্তি)] / [cos(অক্ষাংশ) × cos(ক্রান্তি)])', kn: 'H₀ = arccos([sin(-0.8333°) - sin(ಅಕ್ಷಾಂಶ) × sin(ಕ್ರಾನ್ತಿ)] / [cos(ಅಕ್ಷಾಂಶ) × cos(ಕ್ರಾನ್ತಿ)])', gu: 'H₀ = arccos([sin(-0.8333°) - sin(અક્ષાંશ) × sin(ક્રાન્તિ)] / [cos(અક્ષાંશ) × cos(ક્રાન્તિ)])' },
      { en: 'H₀ = arctan(sin(decl) / cos(lat))', hi: 'H₀ = arctan(sin(क्रान्ति) / cos(अक्षांश))', sa: 'H₀ = arctan(sin(क्रान्ति) / cos(अक्षांश))', mai: 'H₀ = arctan(sin(क्रान्ति) / cos(अक्षांश))', mr: 'H₀ = arctan(sin(क्रान्ति) / cos(अक्षांश))', ta: 'H₀ = arctan(sin(க்ராந்தி) / cos(அக்ஷாம்ஶ))', te: 'H₀ = arctan(sin(క్రాన్తి) / cos(అక్షాంశ))', bn: 'H₀ = arctan(sin(ক্রান্তি) / cos(অক্ষাংশ))', kn: 'H₀ = arctan(sin(ಕ್ರಾನ್ತಿ) / cos(ಅಕ್ಷಾಂಶ))', gu: 'H₀ = arctan(sin(ક્રાન્તિ) / cos(અક્ષાંશ))' },
      { en: 'H₀ = 15° x (12 - sunrise hour)', hi: 'H₀ = 15° × (12 - सूर्योदय घण्टा)', sa: 'H₀ = 15° × (12 - सूर्योदय घण्टा)', mai: 'H₀ = 15° × (12 - सूर्योदय घण्टा)', mr: 'H₀ = 15° × (12 - सूर्योदय घण्टा)', ta: 'H₀ = 15° × (12 - ஸூர்யோதய घண்டா)', te: 'H₀ = 15° × (12 - సూర్యోదయ ఘణ్టా)', bn: 'H₀ = 15° × (12 - সূর্যোদয ঘণ্টা)', kn: 'H₀ = 15° × (12 - ಸೂರ್ಯೋದಯ ಘಣ್ಟಾ)', gu: 'H₀ = 15° × (12 - સૂર્યોદય ઘણ્ટા)' },
      { en: 'H₀ = 360° / 24 x EoT', hi: 'H₀ = 360° / 24 × EoT', sa: 'H₀ = 360° / 24 × EoT', mai: 'H₀ = 360° / 24 × EoT', mr: 'H₀ = 360° / 24 × EoT', ta: 'H₀ = 360° / 24 × EoT', te: 'H₀ = 360° / 24 × EoT', bn: 'H₀ = 360° / 24 × EoT', kn: 'H₀ = 360° / 24 × EoT', gu: 'H₀ = 360° / 24 × EoT' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'The hour angle formula uses the cosine rule of spherical trigonometry. The arguments are the threshold altitude (-0.8333°), the observer\'s latitude, and the Sun\'s declination. Sunrise = solar noon - H₀/15 (converting degrees to hours).',
      hi: 'घण्टा कोण सूत्र गोलीय त्रिकोणमिति के कोज्या नियम का उपयोग करता है। तर्क हैं: सीमा ऊँचाई (-0.8333°), प्रेक्षक का अक्षांश, और सूर्य की क्रान्ति। सूर्योदय = सौर मध्याह्न - H₀/15 (अंश को घण्टों में बदलते हुए)।',
    },
  },
  {
    id: 'q22_4_03', type: 'true_false',
    question: {
      en: 'A single-pass sunrise calculation (using noon\'s declination) is accurate enough for Panchang purposes.',
      hi: 'एकल-पास सूर्योदय गणना (मध्याह्न की क्रान्ति से) पंचांग प्रयोजनों के लिए पर्याप्त सटीक है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Using noon\'s declination introduces up to ~4 minutes error near the equinoxes, when declination changes ~0.4° in 12 hours. The 2nd pass recalculates declination at the estimated sunrise time, eliminating this error and matching Drik Panchang to the minute.',
      hi: 'असत्य। मध्याह्न की क्रान्ति उपयोग करने से विषुवों के निकट ~4 मिनट तक त्रुटि होती है, जब 12 घण्टों में क्रान्ति ~0.4° बदलती है। दूसरा पास अनुमानित सूर्योदय समय पर क्रान्ति पुनर्गणित करता है, यह त्रुटि दूर करता है और दृक् पंचांग से मिनट-मिलान करता है।',
    },
  },
  {
    id: 'q22_4_04', type: 'mcq',
    question: {
      en: 'Why does the 2-pass algorithm use the Sun\'s declination at the estimated sunrise time instead of at noon?',
      hi: '2-पास एल्गोरिदम मध्याह्न के बजाय अनुमानित सूर्योदय समय पर सूर्य की क्रान्ति क्यों उपयोग करता है?',
    },
    options: [
      { en: 'Because the Sun\'s declination is constant throughout the day', hi: 'क्योंकि सूर्य की क्रान्ति दिन भर स्थिर रहती है' },
      { en: 'Because declination changes ~0.4°/12h near equinoxes, shifting sunrise by ~4 minutes', hi: 'क्योंकि विषुवों के निकट क्रान्ति ~0.4°/12 घण्टे बदलती है, सूर्योदय ~4 मिनट खिसकाती है', sa: 'क्योंकि विषुवों के निकट क्रान्ति ~0.4°/12 घण्टे बदलती है, सूर्योदय ~4 मिनट खिसकाती है', mai: 'क्योंकि विषुवों के निकट क्रान्ति ~0.4°/12 घण्टे बदलती है, सूर्योदय ~4 मिनट खिसकाती है', mr: 'क्योंकि विषुवों के निकट क्रान्ति ~0.4°/12 घण्टे बदलती है, सूर्योदय ~4 मिनट खिसकाती है', ta: 'க்யோம்கி விஷுவோம் கே நிகட க்ராந்தி ~0.4°/12 घண்டே பதலதீ ஹை, ஸூர்யோதய ~4 மிநட खிஸகாதீ ஹை', te: 'క్యోంకి విషువోం కే నికట క్రాన్తి ~0.4°/12 ఘణ్టే బదలతీ హై, సూర్యోదయ ~4 మినట ఖిసకాతీ హై', bn: 'ক্যোংকি বিষুবোং কে নিকট ক্রান্তি ~0.4°/12 ঘণ্টে বদলতী হৈ, সূর্যোদয ~4 মিনট খিসকাতী হৈ', kn: 'ಕ್ಯೋಂಕಿ ವಿಷುವೋಂ ಕೇ ನಿಕಟ ಕ್ರಾನ್ತಿ ~0.4°/12 ಘಣ್ಟೇ ಬದಲತೀ ಹೈ, ಸೂರ್ಯೋದಯ ~4 ಮಿನಟ ಖಿಸಕಾತೀ ಹೈ', gu: 'ક્યોંકિ વિષુવોં કે નિકટ ક્રાન્તિ ~0.4°/12 ઘણ્ટે બદલતી હૈ, સૂર્યોદય ~4 મિનટ ખિસકાતી હૈ' },
      { en: 'To account for atmospheric refraction changes', hi: 'वायुमण्डलीय अपवर्तन परिवर्तनों के लिए', sa: 'वायुमण्डलीय अपवर्तन परिवर्तनों के लिए', mai: 'वायुमण्डलीय अपवर्तन परिवर्तनों के लिए', mr: 'वायुमण्डलीय अपवर्तन परिवर्तनों के लिए', ta: 'வாயுமண்டலீய அபவர்தந பரிவர்தநோம் கே லிஎ', te: 'వాయుమణ్డలీయ అపవర్తన పరివర్తనోం కే లిఏ', bn: 'বাযুমণ্ডলীয অপবর্তন পরিবর্তনোং কে লিএ', kn: 'ವಾಯುಮಣ್ಡಲೀಯ ಅಪವರ್ತನ ಪರಿವರ್ತನೋಂ ಕೇ ಲಿಏ', gu: 'વાયુમણ્ડલીય અપવર્તન પરિવર્તનોં કે લિએ' },
      { en: 'To correct for the observer\'s altitude', hi: 'प्रेक्षक की ऊँचाई सुधारने के लिए' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Near the equinoxes (March and September), the Sun\'s declination changes rapidly — about 0.4° in 12 hours. Since sunrise is ~6 hours before noon, using noon\'s declination introduces a ~0.2° declination error, which translates to ~4 minutes of sunrise time error at mid-latitudes.',
      hi: 'विषुवों (मार्च और सितम्बर) के निकट सूर्य की क्रान्ति तेज़ी से बदलती है — 12 घण्टों में लगभग 0.4°। सूर्योदय मध्याह्न से ~6 घण्टे पहले है, अतः मध्याह्न की क्रान्ति उपयोग करने से ~0.2° क्रान्ति त्रुटि आती है, जो मध्य अक्षांशों पर ~4 मिनट सूर्योदय समय त्रुटि में बदलती है।',
    },
  },
  {
    id: 'q22_4_05', type: 'mcq',
    question: {
      en: 'The Equation of Time (EoT) can swing by how many minutes through the year?',
      hi: 'समय का समीकरण (EoT) वर्ष भर में कितने मिनट तक झूल सकता है?',
    },
    options: [
      { en: '±2 minutes', hi: '±2 मिनट', sa: '±2 मिनट', mai: '±2 मिनट', mr: '±2 मिनट', ta: '±2 மிநட', te: '±2 మినట', bn: '±2 মিনট', kn: '±2 ಮಿನಟ', gu: '±2 મિનટ' },
      { en: '±8 minutes', hi: '±8 मिनट', sa: '±8 मिनट', mai: '±8 मिनट', mr: '±8 मिनट', ta: '±8 மிநட', te: '±8 మినట', bn: '±8 মিনট', kn: '±8 ಮಿನಟ', gu: '±8 મિનટ' },
      { en: '+14 to -16 minutes (30-minute total range)', hi: '+14 से -16 मिनट (30 मिनट कुल परास)', sa: '+14 से -16 मिनट (30 मिनट कुल परास)', mai: '+14 से -16 मिनट (30 मिनट कुल परास)', mr: '+14 से -16 मिनट (30 मिनट कुल परास)', ta: '+14 ஸே -16 மிநட (30 மிநட குல பராஸ)', te: '+14 సే -16 మినట (30 మినట కుల పరాస)', bn: '+14 সে -16 মিনট (30 মিনট কুল পরাস)', kn: '+14 ಸೇ -16 ಮಿನಟ (30 ಮಿನಟ ಕುಲ ಪರಾಸ)', gu: '+14 સે -16 મિનટ (30 મિનટ કુલ પરાસ)' },
      { en: '±60 minutes', hi: '±60 मिनट', sa: '±60 मिनट', mai: '±60 मिनट', mr: '±60 मिनट', ta: '±60 மிநட', te: '±60 మినట', bn: '±60 মিনট', kn: '±60 ಮಿನಟ', gu: '±60 મિનટ' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The EoT ranges from about +14 minutes (February) to -16 minutes (November), a total swing of ~30 minutes. This means solar noon can be as early as 11:44 or as late as 12:16 on the clock, depending on the time of year and longitude.',
      hi: 'EoT लगभग +14 मिनट (फरवरी) से -16 मिनट (नवम्बर) तक होता है, कुल ~30 मिनट का झूला। इसका अर्थ है कि सौर मध्याह्न घड़ी पर 11:44 जितना जल्दी या 12:16 जितना देर हो सकता है, वर्ष के समय और देशान्तर पर निर्भर।',
    },
  },
  {
    id: 'q22_4_06', type: 'true_false',
    question: {
      en: 'Atmospheric refraction makes the Sun visible about 2 minutes before it geometrically crosses the horizon.',
      hi: 'वायुमण्डलीय अपवर्तन सूर्य को ज्यामितीय रूप से क्षितिज पार करने से लगभग 2 मिनट पहले दृश्य बनाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The standard refraction at the horizon is 34 arcminutes. Combined with the Sun\'s 16\' semi-diameter, the Sun appears to rise when it is geometrically 50\' below the horizon. At the Sun\'s average motion, this corresponds to roughly 2 minutes of time.',
      hi: 'सत्य। क्षितिज पर मानक अपवर्तन 34 कला है। सूर्य के 16\' अर्ध-व्यास के साथ, सूर्य तब उदित दिखता है जब वह ज्यामितीय रूप से क्षितिज से 50\' नीचे है। सूर्य की औसत गति पर, यह लगभग 2 मिनट समय के बराबर है।',
    },
  },
  {
    id: 'q22_4_07', type: 'mcq',
    question: {
      en: 'Which two physical effects combine to create the Equation of Time?',
      hi: 'कौन-से दो भौतिक प्रभाव मिलकर समय का समीकरण बनाते हैं?',
    },
    options: [
      { en: 'Refraction and parallax', hi: 'अपवर्तन और लम्बन', sa: 'अपवर्तन और लम्बन', mai: 'अपवर्तन और लम्बन', mr: 'अपवर्तन और लम्बन', ta: 'அபவர்தந ஔர லம்பந', te: 'అపవర్తన ఔర లమ్బన', bn: 'অপবর্তন ঔর লম্বন', kn: 'ಅಪವರ್ತನ ಔರ ಲಮ್ಬನ', gu: 'અપવર્તન ઔર લમ્બન' },
      { en: 'Nutation and precession', hi: 'अयन-चलन और पुरस्सरण', sa: 'अयन-चलन और पुरस्सरण', mai: 'अयन-चलन और पुरस्सरण', mr: 'अयन-चलन और पुरस्सरण', ta: 'அயந-சலந ஔர புரஸ்ஸரண', te: 'అయన-చలన ఔర పురస్సరణ', bn: 'অযন-চলন ঔর পুরস্সরণ', kn: 'ಅಯನ-ಚಲನ ಔರ ಪುರಸ್ಸರಣ', gu: 'અયન-ચલન ઔર પુરસ્સરણ' },
      { en: 'Obliquity of the ecliptic and orbital eccentricity', hi: 'क्रान्तिवृत्त की तिर्यकता और कक्षीय उत्केन्द्रता', sa: 'क्रान्तिवृत्त की तिर्यकता और कक्षीय उत्केन्द्रता', mai: 'क्रान्तिवृत्त की तिर्यकता और कक्षीय उत्केन्द्रता', mr: 'क्रान्तिवृत्त की तिर्यकता और कक्षीय उत्केन्द्रता', ta: 'க்ராந்திவிருத்த கீ திர்யகதா ஔர கக்ஷீய உத்கேந்த்ரதா', te: 'క్రాన్తివృత్త కీ తిర్యకతా ఔర కక్షీయ ఉత్కేన్ద్రతా', bn: 'ক্রান্তিবৃত্ত কী তির্যকতা ঔর কক্ষীয উত্কেন্দ্রতা', kn: 'ಕ್ರಾನ್ತಿವೃತ್ತ ಕೀ ತಿರ್ಯಕತಾ ಔರ ಕಕ್ಷೀಯ ಉತ್ಕೇನ್ದ್ರತಾ', gu: 'ક્રાન્તિવૃત્ત કી તિર્યકતા ઔર કક્ષીય ઉત્કેન્દ્રતા' },
      { en: 'Aberration and parallax', hi: 'विपथन और लम्बन', sa: 'विपथन और लम्बन', mai: 'विपथन और लम्बन', mr: 'विपथन और लम्बन', ta: 'விபथந ஔர லம்பந', te: 'విపథన ఔర లమ్బన', bn: 'বিপথন ঔর লম্বন', kn: 'ವಿಪಥನ ಔರ ಲಮ್ಬನ', gu: 'વિપથન ઔર લમ્બન' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The EoT has two causes: (1) The ecliptic is tilted 23.4° to the equator, causing the Sun\'s right ascension to change non-uniformly even if its ecliptic motion were constant. (2) Earth\'s elliptical orbit makes the Sun\'s ecliptic motion itself non-uniform.',
      hi: 'EoT के दो कारण हैं: (1) क्रान्तिवृत्त विषुवत से 23.4° झुका है, जिससे सूर्य का विषुवांश असमान रूप से बदलता है भले ही क्रान्तिवृत्तीय गति स्थिर हो। (2) पृथ्वी की दीर्घवृत्तीय कक्षा सूर्य की क्रान्तिवृत्तीय गति को स्वयं असमान बनाती है।',
    },
  },
  {
    id: 'q22_4_08', type: 'mcq',
    question: {
      en: 'How is solar noon computed?',
      hi: 'सौर मध्याह्न की गणना कैसे होती है?',
    },
    options: [
      { en: 'Always at 12:00 local time', hi: 'सदैव स्थानीय समय 12:00 पर', sa: 'सदैव स्थानीय समय 12:00 पर', mai: 'सदैव स्थानीय समय 12:00 पर', mr: 'सदैव स्थानीय समय 12:00 पर', ta: 'ஸதைவ ஸ்थாநீய ஸமய 12:00 பர', te: 'సదైవ స్థానీయ సమయ 12:00 పర', bn: 'সদৈব স্থানীয সময 12:00 পর', kn: 'ಸದೈವ ಸ್ಥಾನೀಯ ಸಮಯ 12:00 ಪರ', gu: 'સદૈવ સ્થાનીય સમય 12:00 પર' },
      { en: '12:00 UT + longitude/15 - EoT/60', hi: '12:00 UT + देशान्तर/15 - EoT/60', sa: '12:00 UT + देशान्तर/15 - EoT/60', mai: '12:00 UT + देशान्तर/15 - EoT/60', mr: '12:00 UT + देशान्तर/15 - EoT/60', ta: '12:00 UT + தேஶாந்தர/15 - EoT/60', te: '12:00 UT + దేశాన్తర/15 - EoT/60', bn: '12:00 UT + দেশান্তর/15 - EoT/60', kn: '12:00 UT + ದೇಶಾನ್ತರ/15 - EoT/60', gu: '12:00 UT + દેશાન્તર/15 - EoT/60' },
      { en: '12:00 + timezone offset only', hi: '12:00 + केवल समयक्षेत्र ऑफ़सेट', sa: '12:00 + केवल समयक्षेत्र ऑफ़सेट', mai: '12:00 + केवल समयक्षेत्र ऑफ़सेट', mr: '12:00 + केवल समयक्षेत्र ऑफ़सेट', ta: '12:00 + கேவல ஸமயக்ஷேத்ர ऑफ़ஸேட', te: '12:00 + కేవల సమయక్షేత్ర ऑఫ़సేట', bn: '12:00 + কেবল সমযক্ষেত্র ऑফ়সেট', kn: '12:00 + ಕೇವಲ ಸಮಯಕ್ಷೇತ್ರ ऑಫ़ಸೇಟ', gu: '12:00 + કેવલ સમયક્ષેત્ર ऑફ़સેટ' },
      { en: 'When the Moon is at the zenith', hi: 'जब चन्द्रमा शीर्षबिन्दु पर हो', sa: 'जब चन्द्रमा शीर्षबिन्दु पर हो', mai: 'जब चन्द्रमा शीर्षबिन्दु पर हो', mr: 'जब चन्द्रमा शीर्षबिन्दु पर हो', ta: 'ஜப சந்த்ரமா ஶீர்ஷபிந்து பர ஹோ', te: 'జబ చన్ద్రమా శీర్షబిన్దు పర హో', bn: 'জব চন্দ্রমা শীর্ষবিন্দু পর হো', kn: 'ಜಬ ಚನ್ದ್ರಮಾ ಶೀರ್ಷಬಿನ್ದು ಪರ ಹೋ', gu: 'જબ ચન્દ્રમા શીર્ષબિન્દુ પર હો' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Solar noon = 12:00 UT corrected for the observer\'s longitude (converting to local mean solar time) and then adjusted by the Equation of Time. The EoT correction can shift solar noon by up to ±16 minutes from the mean.',
      hi: 'सौर मध्याह्न = 12:00 UT प्रेक्षक के देशान्तर (स्थानीय माध्य सौर समय में बदलते हुए) और फिर समय के समीकरण द्वारा समायोजित। EoT सुधार सौर मध्याह्न को माध्य से ±16 मिनट तक खिसका सकता है।',
    },
  },
  {
    id: 'q22_4_09', type: 'true_false',
    question: {
      en: 'At the equator, the sunrise hour angle H₀ is always exactly 90°.',
      hi: 'विषुवत रेखा पर सूर्योदय घण्टा कोण H₀ सदैव ठीक 90° होता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. At the equator (lat = 0°), H₀ simplifies but is not exactly 90° because the threshold altitude is -0.8333° (not 0°). Also, declination varies throughout the year. H₀ is very close to 90° at the equator but not exact.',
      hi: 'असत्य। विषुवत रेखा (अक्षांश = 0°) पर H₀ सरल होता है किन्तु ठीक 90° नहीं क्योंकि सीमा ऊँचाई -0.8333° (0° नहीं) है। साथ ही, क्रान्ति वर्ष भर बदलती है। विषुवत पर H₀ 90° के अत्यन्त निकट किन्तु सटीक नहीं है।',
    },
  },
  {
    id: 'q22_4_10', type: 'mcq',
    question: {
      en: 'Our app\'s sunrise matches Drik Panchang to the minute primarily because of:',
      hi: 'हमारे ऐप का सूर्योदय दृक् पंचांग से मिनट-मिलान मुख्यतः किसके कारण करता है:',
    },
    options: [
      { en: 'Using 60 sine terms for the Sun', hi: 'सूर्य के लिए 60 ज्या पद उपयोग करने से', sa: 'सूर्य के लिए 60 ज्या पद उपयोग करने से', mai: 'सूर्य के लिए 60 ज्या पद उपयोग करने से', mr: 'सूर्य के लिए 60 ज्या पद उपयोग करने से', ta: 'ஸூர்ய கே லிஎ 60 ஜ்யா பத உபயோக கரநே ஸே', te: 'సూర్య కే లిఏ 60 జ్యా పద ఉపయోగ కరనే సే', bn: 'সূর্য কে লিএ 60 জ্যা পদ উপযোগ করনে সে', kn: 'ಸೂರ್ಯ ಕೇ ಲಿಏ 60 ಜ್ಯಾ ಪದ ಉಪಯೋಗ ಕರನೇ ಸೇ', gu: 'સૂર્ય કે લિએ 60 જ્યા પદ ઉપયોગ કરને સે' },
      { en: 'The 2-pass algorithm with EoT correction at the estimated sunrise JD', hi: 'अनुमानित सूर्योदय JD पर EoT सुधार सहित 2-पास एल्गोरिदम', sa: 'अनुमानित सूर्योदय JD पर EoT सुधार सहित 2-पास एल्गोरिदम', mai: 'अनुमानित सूर्योदय JD पर EoT सुधार सहित 2-पास एल्गोरिदम', mr: 'अनुमानित सूर्योदय JD पर EoT सुधार सहित 2-पास एल्गोरिदम', ta: 'அநுமாநித ஸூர்யோதய JD பர EoT ஸுधார ஸஹித 2-பாஸ எல்கோரிதம', te: 'అనుమానిత సూర్యోదయ JD పర EoT సుధార సహిత 2-పాస ఏల్గోరిదమ', bn: 'অনুমানিত সূর্যোদয JD পর EoT সুধার সহিত 2-পাস এল্গোরিদম', kn: 'ಅನುಮಾನಿತ ಸೂರ್ಯೋದಯ JD ಪರ EoT ಸುಧಾರ ಸಹಿತ 2-ಪಾಸ ಏಲ್ಗೋರಿದಮ', gu: 'અનુમાનિત સૂર્યોદય JD પર EoT સુધાર સહિત 2-પાસ એલ્ગોરિદમ' },
      { en: 'Using Swiss Ephemeris for the Sun', hi: 'सूर्य के लिए स्विस एफेमेरिस उपयोग करने से', sa: 'सूर्य के लिए स्विस एफेमेरिस उपयोग करने से', mai: 'सूर्य के लिए स्विस एफेमेरिस उपयोग करने से', mr: 'सूर्य के लिए स्विस एफेमेरिस उपयोग करने से', ta: 'ஸூர்ய கே லிஎ ஸ்விஸ எफேமேரிஸ உபயோக கரநே ஸே', te: 'సూర్య కే లిఏ స్విస ఏఫేమేరిస ఉపయోగ కరనే సే', bn: 'সূর্য কে লিএ স্বিস এফেমেরিস উপযোগ করনে সে', kn: 'ಸೂರ್ಯ ಕೇ ಲಿಏ ಸ್ವಿಸ ಏಫೇಮೇರಿಸ ಉಪಯೋಗ ಕರನೇ ಸೇ', gu: 'સૂર્ય કે લિએ સ્વિસ એફેમેરિસ ઉપયોગ કરને સે' },
      { en: 'Ignoring atmospheric refraction', hi: 'वायुमण्डलीय अपवर्तन की अनदेखी से', sa: 'वायुमण्डलीय अपवर्तन की अनदेखी से', mai: 'वायुमण्डलीय अपवर्तन की अनदेखी से', mr: 'वायुमण्डलीय अपवर्तन की अनदेखी से', ta: 'வாயுமண்டலீய அபவர்தந கீ அநதேखீ ஸே', te: 'వాయుమణ్డలీయ అపవర్తన కీ అనదేఖీ సే', bn: 'বাযুমণ্ডলীয অপবর্তন কী অনদেখী সে', kn: 'ವಾಯುಮಣ್ಡಲೀಯ ಅಪವರ್ತನ ಕೀ ಅನದೇಖೀ ಸೇ', gu: 'વાયુમણ્ડલીય અપવર્તન કી અનદેખી સે' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 2-pass algorithm is the key: Pass 1 gives an approximate sunrise using noon\'s solar parameters. Pass 2 recomputes the Sun\'s declination and EoT at the Pass 1 estimate, correcting the ~4 minute error that a single pass would introduce near equinoxes.',
      hi: '2-पास एल्गोरिदम कुंजी है: पास 1 मध्याह्न के सौर प्राचलों से अनुमानित सूर्योदय देता है। पास 2 पास 1 अनुमान पर सूर्य की क्रान्ति और EoT पुनर्गणित करता है, विषुवों के निकट एकल पास से आने वाली ~4 मिनट त्रुटि सुधारता है।',
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
          {tl({ en: 'What Defines Sunrise?', hi: 'सूर्योदय की परिभाषा क्या है?', sa: 'सूर्योदय की परिभाषा क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्योदय आधिकारिक रूप से वह क्षण है जब सूर्य बिम्ब का ऊपरी अंग (शीर्ष किनारा) ज्यामितीय क्षितिज को छूता है, समुद्र तल पर प्रेक्षित। किन्तु जब हम पहली बार सूर्य देखते हैं तब वह वास्तव में क्षितिज पर नहीं होता — वायुमण्डलीय अपवर्तन प्रकाश किरणों को मोड़ता है, सूर्य को तब दृश्य बनाता है जब वह अभी ज्यामितीय रूप से क्षितिज से नीचे है। क्षितिज पर मानक अपवर्तन 34 कला (0.567°) है। इसके अतिरिक्त, हम ऊपरी अंग देखना चाहते हैं, केन्द्र नहीं, अतः सूर्य का दृश्य अर्ध-व्यास 16 कला जोड़ते हैं। संयुक्त सीमा: सूर्य का ज्यामितीय केन्द्र ऊँचाई = -0.8333° (-(34&apos; + 16&apos;) = -50&apos; = -0.8333°) पर होना चाहिए।</> : <>Sunrise is officially defined as the instant when the upper limb (top edge) of the Sun&apos;s disk touches the geometric horizon, as observed at sea level. But the Sun is not actually at the horizon when we first see it — atmospheric refraction bends light rays, making the Sun visible when it is still geometrically below the horizon. The standard refraction at the horizon is 34 arcminutes (0.567°). Additionally, we want to detect the upper limb, not the center, so we add the Sun&apos;s apparent semi-diameter of 16 arcminutes. The combined threshold: the Sun&apos;s geometric center must be at altitude = -0.8333° (-(34&apos; + 16&apos;) = -50&apos; = -0.8333°).</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मूलभूत समीकरण: प्रेक्षक का अक्षांश (lat) और सूर्य की क्रान्ति (decl) दिए हों, तो घण्टा कोण H₀ जिस पर सूर्य ऊँचाई h₀ = -0.8333° पर पहुँचता है: H₀ = arccos([sin(h₀) - sin(lat) × sin(decl)] / [cos(lat) × cos(decl)])। यह खगोलीय त्रिभुज पर लागू गोलीय त्रिकोणमिति का कोज्या नियम है। सूर्योदय समय तब: सूर्योदय = सौर मध्याह्न - H₀/15, जहाँ H₀ अंशों में है और 15 से विभाजन घण्टों में बदलता है (पृथ्वी प्रति घण्टा 15° घूमती है)।</> : <>The fundamental equation: given the observer&apos;s latitude (lat) and the Sun&apos;s declination (decl), the hour angle H₀ at which the Sun reaches altitude h₀ = -0.8333° is: H₀ = arccos([sin(h₀) - sin(lat) x sin(decl)] / [cos(lat) x cos(decl)]). This is the cosine rule from spherical trigonometry applied to the astronomical triangle. The sunrise time is then: Sunrise = Solar Noon - H₀/15, where H₀ is in degrees and dividing by 15 converts to hours (since the Earth rotates 15° per hour).</>}</p>
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
          {tl({ en: 'The 2-Pass Algorithm', hi: '2-पास एल्गोरिदम', sa: '2-पास एल्गोरिदम' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पास 1: मध्याह्न JD पर समय के समीकरण का उपयोग करके सौर मध्याह्न गणित करें। सौर मध्याह्न केवल 12:00 स्थानीय समय नहीं है — यह (अ) समयक्षेत्र याम्योत्तर से प्रेक्षक के देशान्तर अन्तर, और (ब) समय के समीकरण पर निर्भर करता है। EoT +14 मिनट (फरवरी) और -16 मिनट (नवम्बर) के बीच झूलता है। सौर मध्याह्न पर सूर्य की क्रान्ति गणित करें और प्रारम्भिक सूर्योदय अनुमान पाने हेतु घण्टा कोण सूत्र उपयोग करें। यह अनुमान सामान्यतः सही उत्तर से ~4 मिनट के भीतर है।</> : <>Pass 1: Compute solar noon using the Equation of Time at the noon JD. Solar noon is NOT simply 12:00 local time — it depends on (a) the observer&apos;s longitude offset from the timezone meridian, and (b) the Equation of Time. The EoT swings between +14 minutes (February) and -16 minutes (November). At solar noon, compute the Sun&apos;s declination and use the hour angle formula to get an initial sunrise estimate. This estimate is typically within ~4 minutes of the true answer.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पास 2: यहाँ निर्णायक शोधन है। मध्याह्न पर सूर्य की क्रान्ति सूर्योदय पर समान नहीं है — क्रान्ति दिन भर बदलती है, विशेषतः विषुवों के निकट जब यह 12 घण्टों में ~0.4° खिसकती है। पास 1 सूर्योदय अनुमान लें, उस जूलियन दिवस (मध्याह्न नहीं) पर सूर्य की क्रान्ति और EoT गणित करें, और घण्टा कोण व सूर्योदय समय पुनर्गणित करें। यह दूसरा पास ~4 मिनट त्रुटि दूर करता है और व्यावसायिक एफेमेरिस परिणामों से मिलान करता है। तृतीय पास की आवश्यकता नहीं क्योंकि पास 2 के बाद शेष त्रुटि 1 सेकण्ड से कम है।</> : <>Pass 2: Here is the critical refinement. The Sun&apos;s declination at noon is NOT the same as at sunrise — declination changes throughout the day, especially near the equinoxes when it shifts ~0.4° in 12 hours. Take the Pass 1 sunrise estimate, compute the Sun&apos;s declination and EoT at THAT Julian Day (not noon), and recompute the hour angle and sunrise time. This second pass eliminates the ~4 minute error and matches professional ephemeris results. There is no need for a third pass because the residual error after Pass 2 is under 1 second.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरण कुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Location:</span> Corseaux, Switzerland (46.47°N, 6.80°E), April 2, 2026. Timezone: Europe/Zurich (CEST, UTC+2).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Pass 1:</span> Solar noon JD = 2461132.0. EoT at noon ≈ -3.8 min. Solar noon = 12:00 - (-3.8/60) + (15° - 6.8°)/15 = ~13:30 CEST (accounting for timezone). Declination at noon ≈ +5.1°. H₀ = arccos([sin(-0.833°) - sin(46.47°) x sin(5.1°)] / [cos(46.47°) x cos(5.1°)]) ≈ 86.9°. Sunrise estimate ≈ 13:30 - 86.9/15 ≈ 07:41 CEST.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Pass 2:</span> Recompute declination and EoT at JD corresponding to 07:41 CEST. Declination ≈ +5.0° (slightly less than noon). Refined sunrise ≈ 07:40 CEST — within 1 minute of Drik Panchang.
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
          {tl({ en: 'The Equation of Time Explained', hi: 'समय का समीकरण विस्तार से', sa: 'समय का समीकरण विस्तार से' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>समय का समीकरण दृश्य सौर समय (धूपघड़ी समय) और माध्य सौर समय (घड़ी समय) के बीच अन्तर है। यह दो स्वतन्त्र कारणों से उत्पन्न होता है। कारण 1 — कक्षीय उत्केन्द्रता: पृथ्वी की दीर्घवृत्तीय कक्षा सूर्य को उपसौर (जनवरी) के निकट क्रान्तिवृत्त पर तेज़ और अपसौर (जुलाई) के निकट धीमा दिखाती है। यदि यही एकमात्र प्रभाव होता, तो EoT ~365 दिन अवधि की सरल ज्या तरंग होती। कारण 2 — क्रान्तिवृत्त की तिर्यकता: क्रान्तिवृत्त विषुवत से 23.4° झुका है। यदि सूर्य क्रान्तिवृत्त पर समान रूप से चलता भी, तो विषुवत पर इसका प्रक्षेप (जो विषुवांश और इसलिए घड़ी समय निर्धारित करता है) असमान होगा।</> : <>The Equation of Time is the difference between apparent solar time (sundial time) and mean solar time (clock time). It arises from two independent causes. Cause 1 — Orbital eccentricity: Earth&apos;s elliptical orbit makes the Sun appear to move faster along the ecliptic near perihelion (January) and slower near aphelion (July). If this were the only effect, the EoT would be a simple sine wave with a ~365-day period. Cause 2 — Obliquity of the ecliptic: the ecliptic is tilted 23.4° to the equator. Even if the Sun moved uniformly along the ecliptic, its projection onto the equator (which determines right ascension and hence clock time) would be non-uniform.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दोनों प्रभाव मिलकर विशिष्ट द्वि-शिखर EoT वक्र बनाते हैं: यह लगभग 12 फरवरी को +14 मिनट पर शिखर, लगभग 15 अप्रैल को शून्य, लगभग 14 मई को -4 मिनट, लगभग 13 जून को पुनः शून्य, लगभग 26 जुलाई को -6 मिनट, लगभग 1 सितम्बर को शून्य, लगभग 3 नवम्बर को -16 मिनट तक गिरता है, और लगभग 25 दिसम्बर को शून्य लौटता है। ~30 मिनट की कुल परास का अर्थ है कि सौर मध्याह्न 12:00 घड़ी समय से एक चौथाई घण्टे तक भिन्न हो सकता है।</> : <>The two effects combine to create the characteristic double-peaked EoT curve: it peaks at +14 minutes around February 12, crosses zero around April 15, reaches -4 minutes around May 14, crosses zero again around June 13, dips to -6 minutes around July 26, crosses zero around September 1, plunges to -16 minutes around November 3, and returns to zero around December 25. The total range of ~30 minutes means solar noon can differ from 12:00 clock time by up to a quarter of an hour.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Why This Matters for Panchang', hi: 'पंचांग के लिए महत्त्व', sa: 'पंचांग के लिए महत्त्व' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>प्रत्येक समय-आधारित पंचांग तत्व सटीक सूर्योदय पर निर्भर है: राहु काल, यमघण्ट, गुलिक, अभिजित मुहूर्त और होरा क्रम सभी सूर्योदय को अपने प्रारम्भिक सन्दर्भ के रूप में उपयोग करते हैं। 4 मिनट की सूर्योदय त्रुटि इन सभी गणनाओं में प्रसारित होती है। EoT सुधार सहित 2-पास एल्गोरिदम सुनिश्चित करता है कि हमारा सूर्योदय विश्व भर में किसी भी स्थान पर — विषुवतीय चेन्नई से ध्रुवीय ट्रोम्सो से मध्य-अक्षांश कोर्सो तक — दृक् पंचांग से 1 मिनट के भीतर मिलान करता है।</> : <>Every time-based Panchang element depends on accurate sunrise: Rahu Kaal, Yamaghanda, Gulika, Abhijit Muhurta, and the Hora sequence all use sunrise as their starting reference. A 4-minute sunrise error cascades into all these calculations. The 2-pass algorithm with EoT correction ensures our sunrise matches Drik Panchang to within 1 minute at any location worldwide — from equatorial Chennai to polar Tromso to mid-latitude Corseaux.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;सौर मध्याह्न सदैव 12:00 पर होता है।&quot; सौर मध्याह्न तीन कारकों पर निर्भर है: (1) समयक्षेत्र केन्द्रीय याम्योत्तर से आपका देशान्तर अन्तर, (2) समय का समीकरण, और (3) दिवालोक बचत समय। कोर्सो (6.8°E, 15°E पर केन्द्रित समयक्षेत्र) में सौर मध्याह्न ग्रीष्म में सामान्यतः लगभग 13:25-13:35 CEST होता है — घड़ी पर &quot;12:00&quot; से 90 मिनट से अधिक बाद।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Solar noon is always at 12:00.&quot; Solar noon depends on three factors: (1) your longitude offset from the timezone central meridian, (2) the Equation of Time, and (3) daylight saving time. In Corseaux (6.8°E, timezone centered on 15°E), solar noon is typically around 13:25-13:35 CEST in summer — over 90 minutes after &quot;12:00&quot; on the clock.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}