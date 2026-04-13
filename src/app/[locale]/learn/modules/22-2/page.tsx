'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-2.json';

const META: ModuleMeta = {
  id: 'mod_22_2', phase: 9, topic: 'Astronomy', moduleNumber: '22.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q22_2_01', type: 'mcq',
    question: {
      en: 'Why does the Sun appear to move non-uniformly along the ecliptic?',
      hi: 'सूर्य क्रान्तिवृत्त पर असमान रूप से क्यों गतिमान दिखता है?',
    },
    options: [
      { en: 'Because the Sun orbits the Earth in a circle', hi: 'क्योंकि सूर्य पृथ्वी की वृत्ताकार कक्षा में है', sa: 'क्योंकि सूर्य पृथ्वी की वृत्ताकार कक्षा में है', mai: 'क्योंकि सूर्य पृथ्वी की वृत्ताकार कक्षा में है', mr: 'क्योंकि सूर्य पृथ्वी की वृत्ताकार कक्षा में है', ta: 'சூரியன் பூமியை வட்டப்பாதையில் சுற்றுவதால்', te: 'సూర్యుడు భూమిని వృత్తాకార కక్ష్యలో తిరుగుతాడు కాబట్టి', bn: 'সূর্য পৃথিবীকে বৃত্তাকার কক্ষপথে প্রদক্ষিণ করে বলে', kn: 'ಸೂರ್ಯ ಭೂಮಿಯನ್ನು ವೃತ್ತಾಕಾರ ಕಕ್ಷೆಯಲ್ಲಿ ಸುತ್ತುವುದರಿಂದ', gu: 'સૂર્ય પૃથ્વીની વર્તુળાકાર ભ્રમણકક્ષામાં ફરે છે તેથી' },
      { en: 'Because Earth\'s orbit is elliptical — faster at perihelion, slower at aphelion', hi: 'क्योंकि पृथ्वी की कक्षा दीर्घवृत्तीय है — उपसौर पर तेज़, अपसौर पर धीमी' },
      { en: 'Because of the Moon\'s gravitational pull on the Sun', hi: 'चन्द्रमा के सूर्य पर गुरुत्वाकर्षण खिंचाव के कारण' },
      { en: 'Because of atmospheric refraction', hi: 'वायुमण्डलीय अपवर्तन के कारण', sa: 'वायुमण्डलीय अपवर्तन के कारण', mai: 'वायुमण्डलीय अपवर्तन के कारण', mr: 'वायुमण्डलीय अपवर्तन के कारण', ta: 'வளிமண்டல ஒளிவிலகல் காரணமாக', te: 'వాతావరణ వక్రీభవనం కారణంగా', bn: 'বায়ুমণ্ডলীয় প্রতিসরণের কারণে', kn: 'ವಾತಾವರಣ ವಕ್ರೀಭವನದಿಂದ', gu: 'વાયુમંડળીય વક્રીભવનને કારણે' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Earth orbits the Sun in an ellipse with eccentricity e ≈ 0.017. At perihelion (January), Earth moves faster and the Sun appears to move ~1.02°/day. At aphelion (July), Earth moves slower and the Sun appears to move ~0.95°/day.',
      hi: 'पृथ्वी सूर्य की उत्केन्द्रता e ≈ 0.017 वाली दीर्घवृत्तीय कक्षा में चक्कर लगाती है। उपसौर (जनवरी) में पृथ्वी तेज़ चलती है और सूर्य ~1.02°/दिन गतिमान दिखता है। अपसौर (जुलाई) में पृथ्वी धीमी चलती है और सूर्य ~0.95°/दिन दिखता है।',
    },
  },
  {
    id: 'q22_2_02', type: 'mcq',
    question: {
      en: 'What does the geometric mean longitude L₀ represent?',
      hi: 'ज्यामितीय माध्य भोगांश L₀ क्या दर्शाता है?',
    },
    options: [
      { en: 'The Sun\'s true position at any instant', hi: 'किसी क्षण सूर्य की सत्य स्थिति' },
      { en: 'The Sun\'s average position if the orbit were circular', hi: 'सूर्य की औसत स्थिति यदि कक्षा वृत्ताकार होती' },
      { en: 'The Moon\'s mean longitude', hi: 'चन्द्रमा का माध्य भोगांश' },
      { en: 'The ecliptic longitude of the ascending node', hi: 'आरोही पात का क्रान्तिवृत्तीय भोगांश', sa: 'आरोही पात का क्रान्तिवृत्तीय भोगांश', mai: 'आरोही पात का क्रान्तिवृत्तीय भोगांश', mr: 'आरोही पात का क्रान्तिवृत्तीय भोगांश', ta: 'ஏறு முனையின் கிரகண தீர்க்கரேகை', te: 'ఆరోహణ బిందువు యొక్క క్రాంతివృత్త రేఖాంశం', bn: 'আরোহী বিন্দুর ক্রান্তিবৃত্তীয় দ্রাঘিমাংশ', kn: 'ಆರೋಹಿ ಬಿಂದುವಿನ ಕ್ರಾಂತಿವೃತ್ತ ರೇಖಾಂಶ', gu: 'ઊર્ધ્વ બિંદુનો ક્રાંતિવૃત્ત રેખાંશ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'L₀ = 280.466° + 36000.770° x T is the Sun\'s mean longitude — where it would be if Earth\'s orbit were a perfect circle with uniform motion. The actual position differs due to the elliptical orbit (corrected by the Equation of Center).',
      hi: 'L₀ = 280.466° + 36000.770° × T सूर्य का माध्य भोगांश है — यदि पृथ्वी की कक्षा समान गति वाला पूर्ण वृत्त होता तो सूर्य यहाँ होता। वास्तविक स्थिति दीर्घवृत्तीय कक्षा के कारण भिन्न होती है (केन्द्र समीकरण द्वारा सुधारित)।',
    },
  },
  {
    id: 'q22_2_03', type: 'mcq',
    question: {
      en: 'The mean anomaly M represents:',
      hi: 'माध्य विलम्बिका M दर्शाती है:',
    },
    options: [
      { en: 'The angle between the Sun and Moon', hi: 'सूर्य और चन्द्रमा के बीच का कोण', sa: 'सूर्य और चन्द्रमा के बीच का कोण', mai: 'सूर्य और चन्द्रमा के बीच का कोण', mr: 'सूर्य और चन्द्रमा के बीच का कोण', ta: 'சூரியன் மற்றும் நிலவுக்கு இடையிலான கோணம்', te: 'సూర్య చంద్రుల మధ్య కోణం', bn: 'সূর্য ও চন্দ্রের মধ্যে কোণ', kn: 'ಸೂರ್ಯ ಮತ್ತು ಚಂದ್ರನ ನಡುವಿನ ಕೋನ', gu: 'સૂર્ય અને ચંદ્ર વચ્ચેનો ખૂણો' },
      { en: 'The angle from perihelion along the orbit, as if motion were uniform', hi: 'कक्षा में उपसौर से कोण, मानो गति समान हो', sa: 'कक्षा में उपसौर से कोण, मानो गति समान हो', mai: 'कक्षा में उपसौर से कोण, मानो गति समान हो', mr: 'कक्षा में उपसौर से कोण, मानो गति समान हो', ta: 'சூரிய அண்மையிலிருந்து சுற்றுப்பாதையில் கோணம், சீரான இயக்கம் போல', te: 'సూర్య సమీపం నుండి కక్ష్య వెంట కోణం, చలనం ఏకరీతిగా ఉన్నట్లు', bn: 'অনুসূর্য থেকে কক্ষপথ বরাবর কোণ, যেন গতি সমান হতো', kn: 'ಸೂರ್ಯ ಸಮೀಪದಿಂದ ಕಕ್ಷೆಯುದ್ದಕ್ಕೂ ಕೋನ, ಚಲನೆ ಏಕರೂಪ ಎಂಬಂತೆ', gu: 'સૂર્ય નિકટથી ભ્રમણકક્ષા સાથે ખૂણો, જાણે ગતિ સમાન હોય' },
      { en: 'The declination of the Sun', hi: 'सूर्य का क्रान्ति', sa: 'सूर्य का क्रान्ति', mai: 'सूर्य का क्रान्ति', mr: 'सूर्य का क्रान्ति', ta: 'சூரியனின் விலக்கம்', te: 'సూర్యుని క్రాంతి', bn: 'সূর্যের বিষুবলম্ব', kn: 'ಸೂರ್ಯನ ಕ್ರಾಂತಿ', gu: 'સૂર્યનો ક્રાંતિ' },
      { en: 'The hour angle of the Sun', hi: 'सूर्य का घण्टा कोण', sa: 'सूर्य का घण्टा कोण', mai: 'सूर्य का घण्टा कोण', mr: 'सूर्य का घण्टा कोण', ta: 'சூரியனின் மணி கோணம்', te: 'సూర్యుని గంట కోణం', bn: 'সূর্যের ঘণ্টা কোণ', kn: 'ಸೂರ್ಯನ ಗಂಟೆ ಕೋನ', gu: 'સૂર્યનો કલાક ખૂણો' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Mean anomaly M = 357.529° + 35999.050° x T measures the angle from perihelion as if Earth moved at constant speed. The difference between mean anomaly and true anomaly is the Equation of Center.',
      hi: 'माध्य विलम्बिका M = 357.529° + 35999.050° × T उपसौर से कोण को मापती है मानो पृथ्वी स्थिर गति से चलती हो। माध्य विलम्बिका और सत्य विलम्बिका के बीच अन्तर केन्द्र समीकरण है।',
    },
  },
  {
    id: 'q22_2_04', type: 'mcq',
    question: {
      en: 'The largest term in the Equation of Center for the Sun is approximately:',
      hi: 'सूर्य के केन्द्र समीकरण में सबसे बड़ा पद लगभग कितना है?',
    },
    options: [
      { en: '0.020° x sin(2M)', hi: '0.020° × sin(2M)', sa: '0.020° × sin(2M)', mai: '0.020° × sin(2M)', mr: '0.020° × sin(2M)', ta: '0.020° x sin(2M)', te: '0.020° x sin(2M)', bn: '0.020° x sin(2M)', kn: '0.020° x sin(2M)', gu: '0.020° x sin(2M)' },
      { en: '1.915° x sin(M)', hi: '1.915° × sin(M)', sa: '1.915° × sin(M)', mai: '1.915° × sin(M)', mr: '1.915° × sin(M)', ta: '1.915° x sin(M)', te: '1.915° x sin(M)', bn: '1.915° x sin(M)', kn: '1.915° x sin(M)', gu: '1.915° x sin(M)' },
      { en: '6.289° x sin(M\')', hi: '6.289° × sin(M\')' },
      { en: '0.00478° x sin(Ω)', hi: '0.00478° × sin(Ω)', sa: '0.00478° × sin(Ω)', mai: '0.00478° × sin(Ω)', mr: '0.00478° × sin(Ω)', ta: '0.00478° x sin(Ω)', te: '0.00478° x sin(Ω)', bn: '0.00478° x sin(Ω)', kn: '0.00478° x sin(Ω)', gu: '0.00478° x sin(Ω)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The dominant term is 1.915° x sin(M). This single sine term accounts for most of the difference between the Sun\'s mean and true position. The second term (0.020° x sin(2M)) is nearly 100 times smaller.',
      hi: 'प्रमुख पद 1.915° × sin(M) है। यह एकल ज्या पद सूर्य की माध्य और सत्य स्थिति के बीच अधिकांश अन्तर का कारण है। दूसरा पद (0.020° × sin(2M)) लगभग 100 गुना छोटा है।',
    },
  },
  {
    id: 'q22_2_05', type: 'true_false',
    question: {
      en: 'Nutation is a slow, steady shift in the Sun\'s longitude caused by precession of the equinoxes.',
      hi: 'अयन-चलन सूर्य के भोगांश में विषुव पुरस्सरण के कारण एक धीमा, स्थिर खिसकाव है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Nutation is a short-period oscillation (18.6-year cycle) of Earth\'s rotation axis, not the slow 26,000-year precession. The nutation correction to the Sun\'s longitude is approximately -0.00478° x sin(Ω), where Ω is the longitude of the Moon\'s ascending node.',
      hi: 'असत्य। अयन-चलन पृथ्वी के घूर्णन अक्ष का लघु-अवधि दोलन (18.6 वर्ष चक्र) है, 26,000 वर्ष का धीमा पुरस्सरण नहीं। सूर्य भोगांश में अयन-चलन सुधार लगभग -0.00478° × sin(Ω) है, जहाँ Ω चन्द्र आरोही पात का भोगांश है।',
    },
  },
  {
    id: 'q22_2_06', type: 'mcq',
    question: {
      en: 'What is the aberration correction applied to the Sun\'s true longitude?',
      hi: 'सूर्य के सत्य भोगांश पर लागू विपथन सुधार क्या है?',
    },
    options: [
      { en: '-0.00569°', hi: '-0.00569°', sa: '-0.00569°', mai: '-0.00569°', mr: '-0.00569°', ta: '-0.00569°', te: '-0.00569°', bn: '-0.00569°', kn: '-0.00569°', gu: '-0.00569°' },
      { en: '+1.915°', hi: '+1.915°', sa: '+1.915°', mai: '+1.915°', mr: '+1.915°', ta: '+1.915°', te: '+1.915°', bn: '+1.915°', kn: '+1.915°', gu: '+1.915°' },
      { en: '-24.22°', hi: '-24.22°', sa: '-24.22°', mai: '-24.22°', mr: '-24.22°', ta: '-24.22°', te: '-24.22°', bn: '-24.22°', kn: '-24.22°', gu: '-24.22°' },
      { en: '+0.5°', hi: '+0.5°', sa: '+0.5°', mai: '+0.5°', mr: '+0.5°', ta: '+0.5°', te: '+0.5°', bn: '+0.5°', kn: '+0.5°', gu: '+0.5°' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Aberration is -0.00569° (about 20.5 arcseconds). It occurs because light from the Sun takes ~8.3 minutes to reach Earth, during which Earth moves, causing an apparent displacement in the direction of Earth\'s motion.',
      hi: 'विपथन -0.00569° (लगभग 20.5 कला-सेकण्ड) है। यह इसलिए होता है क्योंकि सूर्य से प्रकाश पृथ्वी तक ~8.3 मिनट लेता है, इस दौरान पृथ्वी गतिमान रहती है, जिससे पृथ्वी की गति की दिशा में दृश्य विस्थापन होता है।',
    },
  },
  {
    id: 'q22_2_07', type: 'mcq',
    question: {
      en: 'What accuracy does the Meeus algorithm achieve for the Sun\'s longitude?',
      hi: 'मीयस एल्गोरिदम सूर्य भोगांश के लिए कितनी सटीकता प्राप्त करता है?',
    },
    options: [
      { en: '~1° (3600 arcseconds)', hi: '~1° (3600 कला-सेकण्ड)', sa: '~1° (3600 कला-सेकण्ड)', mai: '~1° (3600 कला-सेकण्ड)', mr: '~1° (3600 कला-सेकण्ड)', ta: '~1° (3600 arcseconds)', te: '~1° (3600 arcseconds)', bn: '~1° (3600 arcseconds)', kn: '~1° (3600 arcseconds)', gu: '~1° (3600 arcseconds)' },
      { en: '~0.01° (36 arcseconds)', hi: '~0.01° (36 कला-सेकण्ड)', sa: '~0.01° (36 कला-सेकण्ड)', mai: '~0.01° (36 कला-सेकण्ड)', mr: '~0.01° (36 कला-सेकण्ड)', ta: '~0.01° (36 arcseconds)', te: '~0.01° (36 arcseconds)', bn: '~0.01° (36 arcseconds)', kn: '~0.01° (36 arcseconds)', gu: '~0.01° (36 arcseconds)' },
      { en: '~0.001° (3.6 arcseconds)', hi: '~0.001° (3.6 कला-सेकण्ड)', sa: '~0.001° (3.6 कला-सेकण्ड)', mai: '~0.001° (3.6 कला-सेकण्ड)', mr: '~0.001° (3.6 कला-सेकण्ड)', ta: '~0.001° (3.6 arcseconds)', te: '~0.001° (3.6 arcseconds)', bn: '~0.001° (3.6 arcseconds)', kn: '~0.001° (3.6 arcseconds)', gu: '~0.001° (3.6 arcseconds)' },
      { en: '~0.0001° (0.36 arcseconds)', hi: '~0.0001° (0.36 कला-सेकण्ड)', sa: '~0.0001° (0.36 कला-सेकण्ड)', mai: '~0.0001° (0.36 कला-सेकण्ड)', mr: '~0.0001° (0.36 कला-सेकण्ड)', ta: '~0.0001° (0.36 arcseconds)', te: '~0.0001° (0.36 arcseconds)', bn: '~0.0001° (0.36 arcseconds)', kn: '~0.0001° (0.36 arcseconds)', gu: '~0.0001° (0.36 arcseconds)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Meeus low-precision solar algorithm achieves ~0.01° (36 arcseconds, or about 1 minute of time). This is more than sufficient for Panchang calculations where the tithi boundary resolution is ~0.5° (Moon-Sun difference).',
      hi: 'मीयस निम्न-सटीकता सौर एल्गोरिदम ~0.01° (36 कला-सेकण्ड, या लगभग 1 मिनट समय) प्राप्त करता है। यह पंचांग गणनाओं के लिए पर्याप्त से अधिक है जहाँ तिथि सीमा विभेदन ~0.5° (चन्द्र-सूर्य अन्तर) है।',
    },
  },
  {
    id: 'q22_2_08', type: 'true_false',
    question: {
      en: 'Swiss Ephemeris is about 10 times more accurate than Meeus for the Sun\'s position.',
      hi: 'स्विस एफेमेरिस सूर्य की स्थिति के लिए मीयस से लगभग 10 गुना अधिक सटीक है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Swiss Ephemeris achieves ~0.001° accuracy (vs Meeus ~0.01°), making it about 10x more precise. JPL DE440 reaches ~0.0001°, another 10x better. For Panchang use, Meeus accuracy is entirely sufficient.',
      hi: 'सत्य। स्विस एफेमेरिस ~0.001° सटीकता प्राप्त करता है (मीयस ~0.01° की तुलना में), इसे लगभग 10 गुना अधिक सटीक बनाता है। JPL DE440 ~0.0001° तक पहुँचता है, और 10 गुना बेहतर। पंचांग उपयोग के लिए मीयस सटीकता पूर्णतया पर्याप्त है।',
    },
  },
  {
    id: 'q22_2_09', type: 'mcq',
    question: {
      en: 'To convert the Sun\'s tropical longitude to sidereal (Vedic), you:',
      hi: 'सूर्य के सायन भोगांश को निरयन (वैदिक) में बदलने के लिए आप:',
    },
    options: [
      { en: 'Add the Lahiri ayanamsha (~24.22° in 2026)', hi: 'लाहिरी अयनांश (~24.22° 2026 में) जोड़ते हैं', sa: 'लाहिरी अयनांश (~24.22° 2026 में) जोड़ते हैं', mai: 'लाहिरी अयनांश (~24.22° 2026 में) जोड़ते हैं', mr: 'लाहिरी अयनांश (~24.22° 2026 में) जोड़ते हैं', ta: 'லாஹிரி அயனாம்சம் (~24.22° 2026-ல்) கூட்டுக', te: 'లాహిరి అయనాంశ (~24.22° 2026లో) కలపండి', bn: 'লাহিরি অয়নাংশ (~24.22° ২০২৬-এ) যোগ করুন', kn: 'ಲಾಹಿರಿ ಅಯನಾಂಶ (~24.22° 2026ರಲ್ಲಿ) ಸೇರಿಸಿ', gu: 'લાહિરી અયનાંશ (~24.22° 2026માં) ઉમેરો' },
      { en: 'Subtract the Lahiri ayanamsha (~24.22° in 2026)', hi: 'लाहिरी अयनांश (~24.22° 2026 में) घटाते हैं', sa: 'लाहिरी अयनांश (~24.22° 2026 में) घटाते हैं', mai: 'लाहिरी अयनांश (~24.22° 2026 में) घटाते हैं', mr: 'लाहिरी अयनांश (~24.22° 2026 में) घटाते हैं', ta: 'லாஹிரி அயனாம்சம் (~24.22° 2026-ல்) கழிக்க', te: 'లాహిరి అయనాంశ (~24.22° 2026లో) తీయండి', bn: 'লাহিরি অয়নাংশ (~24.22° ২০২৬-এ) বিয়োগ করুন', kn: 'ಲಾಹಿರಿ ಅಯನಾಂಶ (~24.22° 2026ರಲ್ಲಿ) ಕಳೆಯಿರಿ', gu: 'લાહિરી અયનાંશ (~24.22° 2026માં) બાદ કરો' },
      { en: 'Multiply by 12/13.333', hi: '12/13.333 से गुणा करते हैं', sa: '12/13.333 से गुणा करते हैं', mai: '12/13.333 से गुणा करते हैं', mr: '12/13.333 से गुणा करते हैं', ta: '12/13.333 ஆல் பெருக்குக', te: '12/13.333 తో గుణించండి', bn: '12/13.333 দ্বারা গুণ করুন', kn: '12/13.333 ರಿಂದ ಗುಣಿಸಿ', gu: '12/13.333 વડે ગુણો' },
      { en: 'Add 180°', hi: '180° जोड़ते हैं', sa: '180° जोड़ते हैं', mai: '180° जोड़ते हैं', mr: '180° जोड़ते हैं', ta: '180° கூட்டுக', te: '180° కలపండి', bn: '180° যোগ করুন', kn: '180° ಸೇರಿಸಿ', gu: '180° ઉમેરો' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sidereal longitude = Tropical longitude - Ayanamsha. The Lahiri ayanamsha is approximately 24.22° in 2026, representing the accumulated precession of the equinoxes since the reference epoch when tropical and sidereal zodiacs were aligned.',
      hi: 'निरयन भोगांश = सायन भोगांश - अयनांश। लाहिरी अयनांश 2026 में लगभग 24.22° है, जो उस सन्दर्भ युगारम्भ से संचित विषुव पुरस्सरण को दर्शाता है जब सायन और निरयन राशिचक्र संरेखित थे।',
    },
  },
  {
    id: 'q22_2_10', type: 'mcq',
    question: {
      en: 'At which point in its orbit does Earth move fastest (and the Sun appears to move fastest along the ecliptic)?',
      hi: 'अपनी कक्षा में किस बिन्दु पर पृथ्वी सबसे तेज़ चलती है (और सूर्य क्रान्तिवृत्त पर सबसे तेज़ गतिमान दिखता है)?',
    },
    options: [
      { en: 'Aphelion (July)', hi: 'अपसौर (जुलाई)', sa: 'अपसौर (जुलाई)', mai: 'अपसौर (जुलाई)', mr: 'अपसौर (जुलाई)', ta: 'சூரிய தொலைவு (ஜூலை)', te: 'సూర్య దూరం (జూలై)', bn: 'অপসূর্য (জুলাই)', kn: 'ಸೂರ್ಯ ದೂರ (ಜುಲೈ)', gu: 'સૂર્ય દૂર (જુલાઈ)' },
      { en: 'Perihelion (January)', hi: 'उपसौर (जनवरी)', sa: 'उपसौर (जनवरी)', mai: 'उपसौर (जनवरी)', mr: 'उपसौर (जनवरी)', ta: 'சூரிய அண்மை (ஜனவரி)', te: 'సూర్య సమీపం (జనవరి)', bn: 'অনুসূর্য (জানুয়ারি)', kn: 'ಸೂರ್ಯ ಸಮೀಪ (ಜನವರಿ)', gu: 'સૂર્ય નિકટ (જાન્યુઆરી)' },
      { en: 'Vernal equinox (March)', hi: 'वसन्त विषुव (मार्च)', sa: 'वसन्त विषुव (मार्च)', mai: 'वसन्त विषुव (मार्च)', mr: 'वसन्त विषुव (मार्च)', ta: 'வசந்த விஷுவம் (மார்ச்)', te: 'వసంత విషువం (మార్చి)', bn: 'বসন্ত বিষুব (মার্চ)', kn: 'ವಸಂತ ವಿಷುವ (ಮಾರ್ಚ್)', gu: 'વસંત વિષુવ (માર્ચ)' },
      { en: 'Summer solstice (June)', hi: 'ग्रीष्म अयनान्त (जून)', sa: 'ग्रीष्म अयनान्त (जून)', mai: 'ग्रीष्म अयनान्त (जून)', mr: 'ग्रीष्म अयनान्त (जून)', ta: 'கோடை அயன திருப்பம் (ஜூன்)', te: 'గ్రీష్మ అయనాంతం (జూన్)', bn: 'গ্রীষ্ম অয়নান্ত (জুন)', kn: 'ಗ್ರೀಷ್ಮ ಅಯನಾಂತ (ಜೂನ್)', gu: 'ગ્રીષ્મ અયનાંત (જૂન)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'By Kepler\'s second law, Earth moves fastest at perihelion (closest to the Sun, around January 3). This is why winter in the Northern Hemisphere is slightly shorter than summer — Earth traverses that part of its orbit more quickly.',
      hi: 'केप्लर के द्वितीय नियम से पृथ्वी उपसौर (सूर्य के निकटतम, लगभग 3 जनवरी) पर सबसे तेज़ चलती है। इसीलिए उत्तरी गोलार्ध में शीत ऋतु ग्रीष्म से थोड़ी छोटी होती है — पृथ्वी कक्षा के उस भाग को अधिक तेज़ी से पार करती है।',
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
          {isHi ? 'सूर्य की दृश्य गति' : 'The Sun&apos;s Apparent Motion'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पृथ्वी के दृष्टिकोण से सूर्य प्रतिवर्ष आकाश में एक महान वृत्त बनाता प्रतीत होता है। यह पथ क्रान्तिवृत्त है, और सूर्य इस पर लगभग 1 अंश प्रतिदिन (360 अंश / 365.25 दिन) चलता है। किन्तु &quot;लगभग&quot; मुख्य शब्द है — गति समान नहीं है। पृथ्वी सूर्य की उत्केन्द्रता e ≈ 0.017 वाली दीर्घवृत्तीय कक्षा में चक्कर लगाती है। उपसौर (निकटतम बिन्दु, लगभग 3 जनवरी) पर पृथ्वी अपनी कक्षा में तेज़ चलती है, अतः सूर्य लगभग 1.02 अंश प्रतिदिन गतिमान दिखता है। अपसौर (दूरतम बिन्दु, लगभग 4 जुलाई) पर पृथ्वी धीमी होती है और सूर्य केवल लगभग 0.95 अंश प्रतिदिन चलता है। यह ~7% भिन्नता मूल कारण है कि हमें केन्द्र समीकरण की आवश्यकता है।</> : <>From Earth&apos;s perspective, the Sun appears to trace a great circle around the sky once per year. This path is the ecliptic, and the Sun moves along it at roughly 1 degree per day (360 degrees / 365.25 days). But &quot;roughly&quot; is the key word — the motion is NOT uniform. Earth orbits the Sun in an ellipse with eccentricity e ≈ 0.017. At perihelion (closest approach, around January 3), Earth moves faster in its orbit, so the Sun appears to move about 1.02 degrees per day. At aphelion (farthest point, around July 4), Earth slows down and the Sun moves only about 0.95 degrees per day. This ~7% variation is the fundamental reason we need the Equation of Center.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दो मूलभूत मात्राएँ सूर्य की स्थिति को ट्रैक करती हैं। ज्यामितीय माध्य भोगांश L₀ = 280.466° + 36000.770° × T बताता है कि यदि पृथ्वी की कक्षा समान कोणीय गति वाला पूर्ण वृत्त होती तो सूर्य कहाँ होता। माध्य विलम्बिका M = 357.529° + 35999.050° × T बताती है कि पृथ्वी उपसौर से कक्षा में कितनी दूर आई है, पुनः समान गति मानते हुए। ये &quot;माध्य&quot; मात्राएँ हैं — औसत जो वास्तविक दीर्घवृत्तीय भिन्नता की अनदेखी करती हैं। केन्द्र समीकरण इन्हें सुधारेगा।</> : <>Two fundamental quantities track the Sun&apos;s position. The geometric mean longitude L₀ = 280.466° + 36000.770° x T tells us where the Sun would be if Earth&apos;s orbit were a perfect circle with uniform angular speed. The mean anomaly M = 357.529° + 35999.050° x T tracks how far Earth has traveled from perihelion along its orbit, again assuming uniform speed. These are &quot;mean&quot; quantities — averages that ignore the real elliptical variation. The Equation of Center will correct them.</>}</p>
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
          {isHi ? 'केन्द्र समीकरण' : 'Equation of Center'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>केन्द्र समीकरण माध्य विलम्बिका (यदि समान रूप से चलती तो पृथ्वी &quot;कहाँ होती&quot;) को सत्य विलम्बिका (वास्तव में कहाँ है) में बदलता है। सूर्य के लिए सुधार C तीन ज्या पदों में व्यक्त होता है: C = 1.915° × sin(M) + 0.020° × sin(2M) + 0.000289° × sin(3M)। प्रमुख प्रथम पद (1.915°) अकेला सुधार का 99% वहन करता है। द्वितीय पद (0.020°) कक्षा की मामूली विषमता का प्रभाव जोड़ता है। तृतीय पद नगण्य है किन्तु पूर्णता हेतु सम्मिलित है। सत्य भोगांश तब: सत्य भोगांश = L₀ + C।</> : <>The Equation of Center converts the mean anomaly (where Earth &quot;should be&quot; if moving uniformly) to the true anomaly (where it actually is). For the Sun, the correction C is expressed as three sine terms: C = 1.915° x sin(M) + 0.020° x sin(2M) + 0.000289° x sin(3M). The dominant first term (1.915°) alone accounts for 99% of the correction. The second term (0.020°) adds the effect of the orbit&apos;s slight asymmetry. The third term is negligible but included for completeness. The true longitude is then: True Longitude = L₀ + C.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>फिर हम दृश्य भोगांश — वास्तव में प्रेक्षित स्थिति — प्राप्त करने हेतु दो छोटे सुधार लगाते हैं। पहला, अयन-चलन: चन्द्रमा का गुरुत्वाकर्षण पृथ्वी के घूर्णन अक्ष को 18.6 वर्ष की प्रमुख अवधि से डोलाता है। चन्द्र आरोही पात का भोगांश Ω = 125.04° - 1934.136° × T यह सुधार चलाता है। दूसरा, विपथन: सूर्य से प्रकाश पृथ्वी तक लगभग 8.3 मिनट लेता है, और पृथ्वी गतिमान है, अतः सूर्य पृथ्वी की गति की दिशा में थोड़ा विस्थापित दिखता है।</> : <>Next, we apply two small corrections to get the apparent longitude — the position as actually observed. First, nutation: the Moon&apos;s gravitational pull causes Earth&apos;s rotation axis to wobble with a primary period of 18.6 years. The longitude of the Moon&apos;s ascending node Ω = 125.04° - 1934.136° x T drives this correction. Second, aberration: because light from the Sun takes about 8.3 minutes to reach Earth, and Earth is moving, the Sun appears slightly displaced in the direction of Earth&apos;s motion.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सम्पूर्ण सूत्र' : 'The Complete Formula'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Apparent Longitude</span> = True Longitude - 0.00569° - 0.00478° x sin(Ω)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>-0.00569° पद विपथन स्थिरांक (20.5 कला-सेकण्ड) है। -0.00478° × sin(Ω) पद भोगांश में अयन-चलन है, जो 18.6 वर्ष के पात चक्र के साथ लगभग ±0.00478° के बीच दोलन करता है। संयुक्त रूप से ये सुधार सूर्य की स्थिति को 0.01° तक खिसकाते हैं — छोटा, किन्तु उप-अंश सटीकता के लिए महत्त्वपूर्ण।</> : <>The -0.00569° term is the aberration constant (20.5 arcseconds). The -0.00478° x sin(Ω) term is the nutation in longitude, which oscillates between approximately ±0.00478° with the 18.6-year nodal cycle. Combined, these corrections shift the Sun&apos;s position by up to 0.01° — small, but important for sub-degree accuracy.</>}</p>
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
          {isHi ? 'सटीकता और निरयन रूपान्तरण' : 'Accuracy and Sidereal Conversion'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>हमारी सूर्य स्थिति कितनी सटीक है? मीयस निम्न-सटीकता एल्गोरिदम लगभग 0.01° (36 कला-सेकण्ड) प्राप्त करता है। समय के सन्दर्भ में, सूर्य ~1°/दिन चलता है, अतः 0.01° त्रुटि लगभग 1 मिनट समय में बदलती है। इसका अर्थ है कि हमारी सूर्योदय/सूर्यास्त गणनाओं में केवल सौर भोगांश से ~1 मिनट की अन्तर्निहित अनिश्चितता है। इसकी तुलना स्विस एफेमेरिस (~0.001°, अधिकांश व्यावसायिक ज्योतिष सॉफ़्टवेयर द्वारा प्रयुक्त) और JPL DE440 (~0.0001°, नासा द्वारा प्रयुक्त) से करें। पंचांग प्रयोजनों के लिए जहाँ सबसे छोटी सार्थक इकाई तिथि सीमा (~12° चन्द्र-सूर्य पृथक्करण) है, हमारी 0.01° सूर्य सटीकता पर्याप्त से अधिक है।</> : <>How accurate is our Sun position? The Meeus low-precision algorithm achieves approximately 0.01° (36 arcseconds). In time terms, since the Sun moves ~1°/day, a 0.01° error translates to roughly 1 minute of time. This means our sunrise/sunset calculations have an inherent ~1 minute uncertainty from the solar longitude alone. Compare this with Swiss Ephemeris (~0.001°, used by most professional astrology software) and JPL DE440 (~0.0001°, used by NASA). For Panchang purposes where the smallest meaningful unit is a tithi boundary (~12° of Moon-Sun separation), our 0.01° Sun accuracy is more than adequate.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वैदिक ज्योतिष के लिए अन्तिम चरण: सायन से निरयन रूपान्तरण। मीयस एल्गोरिदम हमें सूर्य का सायन (पश्चिमी) भोगांश देता है — वसन्त विषुव से मापा। भारतीय ज्योतिष निरयन राशिचक्र का उपयोग करता है — एक स्थिर तारा सन्दर्भ से मापा। अन्तर अयनांश है, जो पुरस्सरण के कारण प्रतिवर्ष लगभग 50.3 कला-सेकण्ड बढ़ता है। लाहिरी अयनांश (भारत सरकार का मानक) का उपयोग करते हुए: निरयन भोगांश = सायन भोगांश - 24.22° (2026 के लिए)। हमारा ऐप राशि स्थान, भाव स्थिति और दशा गणना निर्धारित करने हेतु प्रत्येक ग्रह के लिए यह गणित करता है।</> : <>The final step for Vedic astrology: converting from tropical to sidereal. The Meeus algorithm gives us the Sun&apos;s tropical (Western) longitude — measured from the vernal equinox. Indian astrology uses the sidereal (nirayana) zodiac — measured from a fixed star reference. The difference is the ayanamsha, which increases by about 50.3 arcseconds per year due to precession. Using the Lahiri ayanamsha (the Indian government standard): Sidereal Longitude = Tropical Longitude - 24.22° (for 2026). Our app computes this for every planet to determine rashi placements, house positions, and dasha calculations.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;अधिक ज्या पद सदैव सूर्य के लिए बेहतर सटीकता देते हैं।&quot; सूर्य के लिए केन्द्र समीकरण में 3 पद पर्याप्त हैं क्योंकि पृथ्वी की कक्षा की उत्केन्द्रता बहुत कम है (e ≈ 0.017)। चौथा पद ~0.000001° होगा — हमारी आवश्यक सटीकता से बहुत नीचे। चन्द्रमा, अपनी अत्यधिक जटिल कक्षा के साथ, वास्तव में 60+ पदों की आवश्यकता रखता है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;More sine terms always mean better accuracy for the Sun.&quot; For the Sun, 3 terms in the Equation of Center are sufficient because Earth&apos;s orbit has very low eccentricity (e ≈ 0.017). The 4th term would be ~0.000001° — far below our needed precision. The Moon, with its much more complex orbit, genuinely needs 60+ terms.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा sunLongitude(jd) फ़ंक्शन ठीक ऊपर वर्णित एल्गोरिदम लागू करता है। यह एक जूलियन दिवस लेता है, T गणित करता है, फिर L₀, M, C, सत्य भोगांश, और अन्ततः दृश्य सायन भोगांश लौटाने हेतु अयन-चलन और विपथन लागू करता है। यह एकल फ़ंक्शन प्रति पृष्ठ लोड सैकड़ों बार बुलाया जाता है — सूर्योदय, सूर्यास्त, तिथि सीमाओं, संक्रान्ति समय और अन्य के लिए। मीयस की सुन्दरता यह है कि 3 ज्या पद और 2 छोटे सुधार न्यूनतम गणना के साथ व्यावसायिक-स्तर के परिणाम देते हैं।</> : <>Our sunLongitude(jd) function implements exactly the algorithm described above. It takes a Julian Day, computes T, then L₀, M, C, true longitude, and finally applies nutation and aberration to return the apparent tropical longitude. This single function is called hundreds of times per page load — for sunrise, sunset, tithi boundaries, sankranti timing, and more. The elegance of Meeus is that 3 sine terms and 2 small corrections give us professional-grade results with minimal computation.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}