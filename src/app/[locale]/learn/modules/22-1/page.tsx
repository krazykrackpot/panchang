'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-1.json';

const META: ModuleMeta = {
  id: 'mod_22_1', phase: 9, topic: 'Astronomy', moduleNumber: '22.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q22_1_01', type: 'mcq',
    question: {
      en: 'What is the Julian Day epoch — the date when JD = 0?',
      hi: 'जूलियन दिवस का युगारम्भ — वह तिथि जब JD = 0 — क्या है?',
    },
    options: [
      { en: 'January 1, 1 CE', hi: '1 जनवरी, 1 ई.', sa: '1 जनवरी, 1 सा.यु.', mai: '1 जनवरी, 1 ई.', mr: '1 जानेवारी, 1 इ.स.', ta: '1 ஜனவரி, 1 கி.பி.', te: '1 జనవరి, 1 క్రీ.శ.', bn: '1 জানুয়ারি, 1 খ্রী.', kn: '1 ಜನವರಿ, 1 ಕ್ರಿ.ಶ.', gu: '1 જાન્યુઆરી, 1 ઈ.સ.' },
      { en: 'January 1, 4713 BCE (noon UT)', hi: '1 जनवरी, 4713 ई.पू. (मध्याह्न UT)', sa: '1 जनवरी, 4713 सा.यु.पू. (मध्याह्ने UT)', mai: '1 जनवरी, 4713 ई.पू. (मध्याह्न UT)', mr: '1 जानेवारी, 4713 इ.स.पू. (दुपार UT)', ta: '1 ஜனவரி, 4713 கி.மு. (நண்பகல் UT)', te: '1 జనవరి, 4713 క్రీ.పూ. (మధ్యాహ్నం UT)', bn: '1 জানুয়ারি, 4713 খ্রী.পূ. (দুপুর UT)', kn: '1 ಜನವರಿ, 4713 ಕ್ರಿ.ಪೂ. (ಮಧ್ಯಾಹ್ನ UT)', gu: '1 જાન્યુઆરી, 4713 ઈ.સ.પૂ. (બપોર UT)' },
      { en: 'January 1, 2000 CE', hi: '1 जनवरी, 2000 ई.', sa: '1 जनवरी, 2000 सा.यु.', mai: '1 जनवरी, 2000 ई.', mr: '1 जानेवारी, 2000 इ.स.', ta: '1 ஜனவரி, 2000 கி.பி.', te: '1 జనవరి, 2000 క్రీ.శ.', bn: '1 জানুয়ারি, 2000 খ্রী.', kn: '1 ಜನವರಿ, 2000 ಕ್ರಿ.ಶ.', gu: '1 જાન્યુઆરી, 2000 ઈ.સ.' },
      { en: 'March 21, 0 CE (vernal equinox)', hi: '21 मार्च, 0 ई. (वसन्त विषुव)', sa: '21 मार्च, 0 सा.यु. (वसन्तविषुवम्)', mai: '21 मार्च, 0 ई. (वसन्त विषुव)', mr: '21 मार्च, 0 इ.स. (वसंत विषुववृत्त)', ta: '21 மார்ச், 0 கி.பி. (வசந்த நாள் இரவு சமம்)', te: '21 మార్చి, 0 క్రీ.శ. (వసంత విషువం)', bn: '21 মার্চ, 0 খ্রী. (বসন্ত বিষুব)', kn: '21 ಮಾರ್ಚ್, 0 ಕ್ರಿ.ಶ. (ವಸಂತ ವಿಷುವ)', gu: '21 માર્ચ, 0 ઈ.સ. (વસંત વિષુવ)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'JD = 0 corresponds to January 1, 4713 BCE at noon Universal Time. This date was chosen by Joseph Scaliger in 1583 because it is the start of a combined cycle of three calendrical periods (solar, lunar, and indiction).',
      hi: 'JD = 0 मध्याह्न यूनिवर्सल टाइम पर 1 जनवरी, 4713 ई.पू. से मेल खाता है। यह तिथि जोसेफ स्कैलिजर ने 1583 में चुनी क्योंकि यह तीन पंचांगीय चक्रों (सौर, चान्द्र और इंडिक्शन) के संयुक्त चक्र का आरम्भ है।',
    },
  },
  {
    id: 'q22_1_02', type: 'mcq',
    question: {
      en: 'What is the JD value for the J2000.0 epoch (January 1, 2000, 12:00 UT)?',
      hi: 'J2000.0 युगारम्भ (1 जनवरी, 2000, 12:00 UT) का JD मान क्या है?',
    },
    options: [
      { en: '2,400,000.0', hi: '2,400,000.0', sa: '2,400,000.0', mai: '2,400,000.0', mr: '2,400,000.0', ta: '2,400,000.0', te: '2,400,000.0', bn: '2,400,000.0', kn: '2,400,000.0', gu: '2,400,000.0' },
      { en: '2,451,545.0', hi: '2,451,545.0', sa: '2,451,545.0', mai: '2,451,545.0', mr: '2,451,545.0', ta: '2,451,545.0', te: '2,451,545.0', bn: '2,451,545.0', kn: '2,451,545.0', gu: '2,451,545.0' },
      { en: '2,440,000.5', hi: '2,440,000.5', sa: '2,440,000.5', mai: '2,440,000.5', mr: '2,440,000.5', ta: '2,440,000.5', te: '2,440,000.5', bn: '2,440,000.5', kn: '2,440,000.5', gu: '2,440,000.5' },
      { en: '2,460,000.0', hi: '2,460,000.0', sa: '2,460,000.0', mai: '2,460,000.0', mr: '2,460,000.0', ta: '2,460,000.0', te: '2,460,000.0', bn: '2,460,000.0', kn: '2,460,000.0', gu: '2,460,000.0' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'JD 2,451,545.0 = January 1, 2000, 12:00 UT. This is the J2000.0 epoch, the standard reference point for modern astronomical calculations. All Meeus formulas use this as their zero point for the Julian Century variable T.',
      hi: 'JD 2,451,545.0 = 1 जनवरी, 2000, 12:00 UT। यह J2000.0 युगारम्भ है, आधुनिक खगोलीय गणनाओं का मानक सन्दर्भ बिन्दु। सभी मीयस सूत्र जूलियन शताब्दी चर T के शून्य बिन्दु के रूप में इसका उपयोग करते हैं।',
    },
  },
  {
    id: 'q22_1_03', type: 'true_false',
    question: {
      en: 'The Julian Day system is related to the Julian calendar — both were created by Julius Caesar.',
      hi: 'जूलियन दिवस पद्धति जूलियन कैलेण्डर से सम्बन्धित है — दोनों जूलियस सीज़र द्वारा बनाई गई थीं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The Julian Day system was devised by Joseph Justus Scaliger in 1583 and named after his father, Julius Caesar Scaliger. It has no direct connection to Julius Caesar\'s Julian calendar, despite the shared name.',
      hi: 'असत्य। जूलियन दिवस पद्धति जोसेफ जस्टस स्कैलिजर ने 1583 में बनाई और अपने पिता जूलियस सीज़र स्कैलिजर के नाम पर रखी। समान नाम के बावजूद जूलियस सीज़र के जूलियन कैलेण्डर से इसका कोई सीधा सम्बन्ध नहीं है।',
    },
  },
  {
    id: 'q22_1_04', type: 'mcq',
    question: {
      en: 'In the JD conversion algorithm, why do we treat January and February as months 13 and 14 of the previous year?',
      hi: 'JD रूपान्तरण एल्गोरिदम में जनवरी और फरवरी को पिछले वर्ष के महीने 13 और 14 क्यों माना जाता है?',
    },
    options: [
      { en: 'To account for the Gregorian leap year correction', hi: 'ग्रेगोरियन अधिवर्ष सुधार के लिए', sa: 'ग्रेगोरियनअधिवर्षसंशोधनार्थम्', mai: 'ग्रेगोरियन अधिवर्ष सुधारक लेल', mr: 'ग्रेगोरियन लीप वर्ष दुरुस्तीसाठी', ta: 'கிரிகோரியன் லீப் வருட திருத்தத்திற்காக', te: 'గ్రెగోరియన్ లీప్ సంవత్సర సవరణ కోసం', bn: 'গ্রেগরিয়ান অধিবর্ষ সংশোধনের জন্য', kn: 'ಗ್ರೆಗೊರಿಯನ್ ಅಧಿವರ್ಷ ತಿದ್ದುಪಡಿಗಾಗಿ', gu: 'ગ્રેગોરિયન લીપ વર્ષ સુધારા માટે' },
      { en: 'Because the Roman calendar originally started in March', hi: 'क्योंकि रोमन कैलेण्डर मूलतः मार्च से आरम्भ होता था', sa: 'यतः रोमनपञ्चाङ्गं मूलतः मार्चमासात् आरभत', mai: 'किएक रोमन कैलेण्डर मूलतः मार्च सँ आरम्भ होइत छल', mr: 'कारण रोमन दिनदर्शिका मूळात मार्चपासून सुरू होत असे', ta: 'ரோமன் நாட்காட்டி முதலில் மார்ச் மாதத்தில் தொடங்கியதால்', te: 'రోమన్ క్యాలెండర్ మూలంలో మార్చిలో ప్రారంభమైనందున', bn: 'কারণ রোমান ক্যালেন্ডার মূলত মার্চে শুরু হতো', kn: 'ಏಕೆಂದರೆ ರೋಮನ್ ಕ್ಯಾಲೆಂಡರ್ ಮೂಲತಃ ಮಾರ್ಚ್‌ನಲ್ಲಿ ಪ್ರಾರಂಭವಾಗುತ್ತಿತ್ತು', gu: 'કારણ કે રોમન કેલેન્ડર મૂળ રીતે માર્ચથી શરૂ થતું હતું' },
      { en: 'To simplify the floor(30.6001 x (M+1)) term', hi: 'floor(30.6001 × (M+1)) पद को सरल बनाने के लिए', sa: 'floor(30.6001 × (M+1)) पदस्य सरलीकरणार्थम्', mai: 'floor(30.6001 × (M+1)) पद केँ सरल बनाबय लेल', mr: 'floor(30.6001 × (M+1)) पद सुलभ करण्यासाठी', ta: 'floor(30.6001 × (M+1)) உறுப்பை எளிமையாக்க', te: 'floor(30.6001 × (M+1)) పదాన్ని సరళీకరించడానికి', bn: 'floor(30.6001 × (M+1)) পদকে সরল করতে', kn: 'floor(30.6001 × (M+1)) ಪದವನ್ನು ಸರಳಗೊಳಿಸಲು', gu: 'floor(30.6001 × (M+1)) પદ સરળ કરવા' },
      { en: 'Both B and C are correct', hi: 'B और C दोनों सही हैं', sa: 'B C च उभयं सम्यक्', mai: 'B आ C दुनू सही अछि', mr: 'B आणि C दोन्ही बरोबर', ta: 'B மற்றும் C இரண்டும் சரி', te: 'B మరియు C రెండూ సరి', bn: 'B ও C দুটোই সঠিক', kn: 'B ಮತ್ತು C ಎರಡೂ ಸರಿ', gu: 'B અને C બંને સાચા' },
    ],
    correctAnswer: 3,
    explanation: {
      en: 'Both reasons apply. The Roman calendar started in March (making February the last month), and this convention allows the floor(30.6001 x (M+1)) term to correctly approximate cumulative month lengths without special-casing February\'s variable length.',
      hi: 'दोनों कारण लागू होते हैं। रोमन कैलेण्डर मार्च से शुरू होता था (फरवरी अन्तिम महीना), और यह परम्परा floor(30.6001 × (M+1)) पद को फरवरी की परिवर्तनीय लम्बाई का विशेष प्रबन्ध किए बिना संचयी मास-लम्बाई का सही अनुमान लगाने देती है।',
    },
  },
  {
    id: 'q22_1_05', type: 'mcq',
    question: {
      en: 'What does the Gregorian correction term B = 2 - A + floor(A/4) account for?',
      hi: 'ग्रेगोरियन सुधार पद B = 2 - A + floor(A/4) किसके लिए है?',
    },
    options: [
      { en: 'The precession of equinoxes', hi: 'अयनांश गति', sa: 'अयनचलनम्', mai: 'अयनांश गति', mr: 'अयनचलन', ta: 'அயன சலனம்', te: 'అయన చలనం', bn: 'অয়নচলন', kn: 'ಅಯನ ಚಲನ', gu: 'અયન ચલન' },
      { en: 'The difference between the Julian and Gregorian calendars (dropped leap days)', hi: 'जूलियन और ग्रेगोरियन कैलेण्डर के बीच अन्तर (हटाए गए अधिवर्ष दिन)', sa: 'जूलियनग्रेगोरियनयोः अन्तरम् (त्यक्ताः अधिवर्षदिनाः)', mai: 'जूलियन आ ग्रेगोरियन कैलेण्डरक बीच अन्तर (हटाएल अधिवर्ष दिन)', mr: 'ज्युलियन आणि ग्रेगोरियन दिनदर्शिकांमधील फरक (वगळलेले लीप दिवस)', ta: 'ஜூலியன் மற்றும் கிரிகோரியன் நாட்காட்டிகளுக்கிடையிலான வேறுபாடு (நீக்கப்பட்ட லீப் நாட்கள்)', te: 'జూలియన్ మరియు గ్రెగోరియన్ క్యాలెండర్‌ల మధ్య తేడా (తొలగించిన లీప్ రోజులు)', bn: 'জুলিয়ান ও গ্রেগরিয়ান ক্যালেন্ডারের মধ্যে পার্থক্য (বাদ দেওয়া অধিবর্ষ দিন)', kn: 'ಜೂಲಿಯನ್ ಮತ್ತು ಗ್ರೆಗೊರಿಯನ್ ಕ್ಯಾಲೆಂಡರ್‌ಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸ (ಬಿಟ್ಟ ಅಧಿವರ್ಷ ದಿನಗಳು)', gu: 'જુલિયન અને ગ્રેગોરિયન કેલેન્ડર વચ્ચેનો તફાવત (દૂર કરેલા લીપ દિવસો)' },
      { en: 'Nutation corrections', hi: 'अयन-चलन सुधार', sa: 'अयनांशसंशोधनम्', mai: 'अयन-चलन सुधार', mr: 'अयनचलन दुरुस्ती', ta: 'நியூட்டேஷன் திருத்தங்கள்', te: 'న్యూటేషన్ సవరణలు', bn: 'বিষুবচলন সংশোধন', kn: 'ನ್ಯೂಟೇಶನ್ ತಿದ್ದುಪಡಿ', gu: 'ન્યૂટેશન સુધારા' },
      { en: 'The equation of time', hi: 'समय का समीकरण', sa: 'कालसमीकरणम्', mai: 'समयक समीकरण', mr: 'कालसमीकरण', ta: 'நேர சமன்பாடு', te: 'సమయ సమీకరణం', bn: 'সময়ের সমীকরণ', kn: 'ಸಮಯ ಸಮೀಕರಣ', gu: 'સમયનું સમીકરણ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The B term corrects for the leap day difference between the Julian calendar (leap year every 4 years) and the Gregorian calendar (skips 3 leap days every 400 years). For dates after October 15, 1582, this correction must be applied.',
      hi: 'B पद जूलियन कैलेण्डर (प्रत्येक 4 वर्ष अधिवर्ष) और ग्रेगोरियन कैलेण्डर (400 वर्षों में 3 अधिवर्ष दिन छोड़ता है) के बीच अधिवर्ष दिन के अन्तर को सुधारता है। 15 अक्टूबर, 1582 के बाद की तिथियों के लिए यह सुधार आवश्यक है।',
    },
  },
  {
    id: 'q22_1_06', type: 'true_false',
    question: {
      en: 'A Julian Day value of 2461132.0 corresponds to April 2, 2026, at noon UT.',
      hi: 'जूलियन दिवस मान 2461132.0 दोपहर UT पर 2 अप्रैल, 2026 से मेल खाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Applying the algorithm: Y=2026, M=4, D=2, H=12. A=20, B=-13. JD = floor(365.25 x 6742) + floor(30.6001 x 5) + 2 + 0.5 + (-13) - 1524.5 = 2,461,132.0.',
      hi: 'सत्य। एल्गोरिदम लागू करें: Y=2026, M=4, D=2, H=12। A=20, B=-13। JD = floor(365.25 × 6742) + floor(30.6001 × 5) + 2 + 0.5 + (-13) - 1524.5 = 2,461,132.0।',
    },
  },
  {
    id: 'q22_1_07', type: 'mcq',
    question: {
      en: 'What is a Julian Century (T) and how is it calculated?',
      hi: 'जूलियन शताब्दी (T) क्या है और इसकी गणना कैसे होती है?',
    },
    options: [
      { en: 'T = (JD - 2451545.0) / 365.25', hi: 'T = (JD - 2451545.0) / 365.25', sa: 'T = (JD - 2451545.0) / 365.25', mai: 'T = (JD - 2451545.0) / 365.25', mr: 'T = (JD - 2451545.0) / 365.25', ta: 'T = (JD - 2451545.0) / 365.25', te: 'T = (JD - 2451545.0) / 365.25', bn: 'T = (JD - 2451545.0) / 365.25', kn: 'T = (JD - 2451545.0) / 365.25', gu: 'T = (JD - 2451545.0) / 365.25' },
      { en: 'T = (JD - 2451545.0) / 36525', hi: 'T = (JD - 2451545.0) / 36525', sa: 'T = (JD - 2451545.0) / 36525', mai: 'T = (JD - 2451545.0) / 36525', mr: 'T = (JD - 2451545.0) / 36525', ta: 'T = (JD - 2451545.0) / 36525', te: 'T = (JD - 2451545.0) / 36525', bn: 'T = (JD - 2451545.0) / 36525', kn: 'T = (JD - 2451545.0) / 36525', gu: 'T = (JD - 2451545.0) / 36525' },
      { en: 'T = (JD - 2400000.5) / 36525', hi: 'T = (JD - 2400000.5) / 36525', sa: 'T = (JD - 2400000.5) / 36525', mai: 'T = (JD - 2400000.5) / 36525', mr: 'T = (JD - 2400000.5) / 36525', ta: 'T = (JD - 2400000.5) / 36525', te: 'T = (JD - 2400000.5) / 36525', bn: 'T = (JD - 2400000.5) / 36525', kn: 'T = (JD - 2400000.5) / 36525', gu: 'T = (JD - 2400000.5) / 36525' },
      { en: 'T = JD / 36525', hi: 'T = JD / 36525', sa: 'T = JD / 36525', mai: 'T = JD / 36525', mr: 'T = JD / 36525', ta: 'T = JD / 36525', te: 'T = JD / 36525', bn: 'T = JD / 36525', kn: 'T = JD / 36525', gu: 'T = JD / 36525' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'T = (JD - 2451545.0) / 36525. The numerator is the number of days since J2000.0, and 36525 is the number of days in a Julian century (100 years x 365.25 days/year). This is the standard time variable used in all Meeus astronomical formulas.',
      hi: 'T = (JD - 2451545.0) / 36525। अंश J2000.0 से दिनों की संख्या है, और 36525 एक जूलियन शताब्दी में दिनों की संख्या है (100 वर्ष × 365.25 दिन/वर्ष)। यह सभी मीयस खगोलीय सूत्रों में प्रयुक्त मानक समय चर है।',
    },
  },
  {
    id: 'q22_1_08', type: 'true_false',
    question: {
      en: 'JD values always end in .0 at noon UT and .5 at midnight UT.',
      hi: 'JD मान सदैव मध्याह्न UT पर .0 और मध्यरात्रि UT पर .5 पर समाप्त होते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Julian Days begin at noon UT (not midnight). So JD .0 = noon, and JD .5 = the following midnight. This convention dates back to astronomers who worked at night and wanted the date not to change during an observing session.',
      hi: 'सत्य। जूलियन दिवस मध्याह्न UT (मध्यरात्रि नहीं) से आरम्भ होते हैं। अतः JD .0 = मध्याह्न, और JD .5 = अगली मध्यरात्रि। यह परम्परा उन खगोलविदों से चली आई जो रात्रि में कार्य करते थे और चाहते थे कि प्रेक्षण सत्र के दौरान तिथि न बदले।',
    },
  },
  {
    id: 'q22_1_09', type: 'mcq',
    question: {
      en: 'Why was J2000.0 chosen as the standard epoch for modern astronomy?',
      hi: 'आधुनिक खगोलशास्त्र के मानक युगारम्भ के रूप में J2000.0 क्यों चुना गया?',
    },
    options: [
      { en: 'It marks a total solar eclipse visible from Greenwich', hi: 'यह ग्रीनविच से दृश्य पूर्ण सूर्यग्रहण चिह्नित करता है', sa: 'एतत् ग्रीनविचात् दृश्यं पूर्णसूर्यग्रहणम् चिह्नयति', mai: 'ई ग्रीनविच सँ दृश्य पूर्ण सूर्यग्रहण चिह्नित करैत अछि', mr: 'हे ग्रीनविचवरून दृश्य खग्रास सूर्यग्रहण चिन्हांकित करते', ta: 'இது கிரீன்விச்சிலிருந்து காணக்கூடிய முழு சூரிய கிரகணத்தைக் குறிக்கிறது', te: 'ఇది గ్రీన్‌విచ్ నుండి కనిపించే సంపూర్ణ సూర్యగ్రహణాన్ని సూచిస్తుంది', bn: 'এটি গ্রিনিচ থেকে দৃশ্যমান পূর্ণ সূর্যগ্রহণ চিহ্নিত করে', kn: 'ಇದು ಗ್ರೀನ್‌ವಿಚ್‌ನಿಂದ ಗೋಚರವಾದ ಪೂರ್ಣ ಸೂರ್ಯಗ್ರಹಣವನ್ನು ಗುರುತಿಸುತ್ತದೆ', gu: 'આ ગ્રીનવિચથી દ્રશ્ય પૂર્ણ સૂર્યગ્રહણ ચિહ્નિત કરે છે' },
      { en: 'It is the start of a Mayan calendar cycle', hi: 'यह माया कैलेण्डर चक्र का आरम्भ है', sa: 'एतत् मायापञ्चाङ्गचक्रस्य आरम्भः', mai: 'ई माया कैलेण्डर चक्रक आरम्भ अछि', mr: 'हे माया दिनदर्शिका चक्राची सुरुवात आहे', ta: 'இது மாயா நாட்காட்டி சுழற்சியின் தொடக்கம்', te: 'ఇది మాయా క్యాలెండర్ చక్రం ప్రారంభం', bn: 'এটি মায়া ক্যালেন্ডার চক্রের শুরু', kn: 'ಇದು ಮಾಯಾ ಕ್ಯಾಲೆಂಡರ್ ಚಕ್ರದ ಆರಂಭ', gu: 'આ માયા કેલેન્ડર ચક્રની શરૂઆત છે' },
      { en: 'It is a round date near the present with well-determined star positions and precession', hi: 'यह वर्तमान के निकट एक सुविधाजनक तिथि है जिसके तारा-स्थान और अयनांश सटीक रूप से ज्ञात हैं', sa: 'एषा वर्तमानस्य समीपे सुविधाजनका तिथिः', mai: 'ई वर्तमानक निकट सुविधाजनक तिथि अछि', mr: 'ही सध्याच्या जवळची सोयीस्कर तारीख आहे', ta: 'இது தற்போதைய காலத்திற்கு அருகிலுள்ள வசதியான தேதி', te: 'ఇది ప్రస్తుతానికి సమీపంలో ఒక అనుకూలమైన తేదీ', bn: 'এটি বর্তমানের নিকটবর্তী একটি সুবিধাজনক তারিখ', kn: 'ಇದು ಪ್ರಸ್ತುತಕ್ಕೆ ಸಮೀಪದ ಅನುಕೂಲಕರ ದಿನಾಂಕ', gu: 'આ વર્તમાનની નજીકની સુવિધાજનક તારીખ છે' },
      { en: 'It is when the ayanamsha equals exactly zero', hi: 'यह वह समय है जब अयनांश ठीक शून्य होता है', sa: 'अयनांशः शून्यः भवति तदा', mai: 'ई ओ समय अछि जखन अयनांश ठीक शून्य होइत अछि', mr: 'हा तो काळ जेव्हा अयनांश अचूक शून्य असतो', ta: 'இது அயனாம்சம் சரியாக பூஜ்ஜியமாக இருக்கும் நேரம்', te: 'ఇది అయనాంశం సరిగ్గా సున్నాగా ఉండే సమయం', bn: 'এটি সেই সময় যখন অয়নাংশ ঠিক শূন্য হয়', kn: 'ಇದು ಅಯನಾಂಶ ಸರಿಯಾಗಿ ಶೂನ್ಯವಾಗಿರುವ ಸಮಯ', gu: 'આ તે સમય છે જ્યારે અયનાંશ બરાબર શૂન્ય હોય' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'J2000.0 was chosen because it is a convenient round date near the modern era, with extremely precise star catalogs (Hipparcos) and well-determined Earth orientation parameters available for that epoch.',
      hi: 'J2000.0 इसलिए चुना गया क्योंकि यह आधुनिक युग के निकट एक सुविधाजनक तिथि है, जिसके लिए अत्यन्त सटीक तारा सूचियाँ (हिपार्कोस) और भली-भाँति निर्धारित पृथ्वी अभिविन्यास प्राचल उपलब्ध हैं।',
    },
  },
  {
    id: 'q22_1_10', type: 'mcq',
    question: {
      en: 'In our Panchang app, which function call is the very first step in computing any astronomical quantity?',
      hi: 'हमारे पंचांग ऐप में किसी भी खगोलीय मात्रा की गणना का सबसे पहला चरण कौन-सा फ़ंक्शन कॉल है?',
    },
    options: [
      { en: 'sunLongitude(jd)', hi: 'sunLongitude(jd)', sa: 'sunLongitude(jd)', mai: 'sunLongitude(jd)', mr: 'sunLongitude(jd)', ta: 'sunLongitude(jd)', te: 'sunLongitude(jd)', bn: 'sunLongitude(jd)', kn: 'sunLongitude(jd)', gu: 'sunLongitude(jd)' },
      { en: 'calculateTithi(jd)', hi: 'calculateTithi(jd)', sa: 'calculateTithi(jd)', mai: 'calculateTithi(jd)', mr: 'calculateTithi(jd)', ta: 'calculateTithi(jd)', te: 'calculateTithi(jd)', bn: 'calculateTithi(jd)', kn: 'calculateTithi(jd)', gu: 'calculateTithi(jd)' },
      { en: 'dateToJD(year, month, day, hour)', hi: 'dateToJD(year, month, day, hour)', sa: 'dateToJD(year, month, day, hour)', mai: 'dateToJD(year, month, day, hour)', mr: 'dateToJD(year, month, day, hour)', ta: 'dateToJD(year, month, day, hour)', te: 'dateToJD(year, month, day, hour)', bn: 'dateToJD(year, month, day, hour)', kn: 'dateToJD(year, month, day, hour)', gu: 'dateToJD(year, month, day, hour)' },
      { en: 'getLahiriAyanamsha(jd)', hi: 'getLahiriAyanamsha(jd)', sa: 'getLahiriAyanamsha(jd)', mai: 'getLahiriAyanamsha(jd)', mr: 'getLahiriAyanamsha(jd)', ta: 'getLahiriAyanamsha(jd)', te: 'getLahiriAyanamsha(jd)', bn: 'getLahiriAyanamsha(jd)', kn: 'getLahiriAyanamsha(jd)', gu: 'getLahiriAyanamsha(jd)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Every calculation begins by converting the date/time to a Julian Day number using dateToJD(). Only then can sunLongitude(jd), moonLongitude(jd), or any other function be called, because they all require a JD input.',
      hi: 'प्रत्येक गणना dateToJD() द्वारा तिथि/समय को जूलियन दिवस संख्या में बदलने से आरम्भ होती है। उसके बाद ही sunLongitude(jd), moonLongitude(jd) या कोई अन्य फ़ंक्शन बुलाया जा सकता है, क्योंकि सभी को JD इनपुट चाहिए।',
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
          {tl({ en: 'Why Astronomers Need a Continuous Day Count', hi: 'खगोलविदों को निरन्तर दिन-गणना क्यों चाहिए', sa: 'खगोलविदों को निरन्तर दिन-गणना क्यों चाहिए' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कल्पना करें कि 15 मार्च, 44 ई.पू. (सीज़र की हत्या) और 2 अप्रैल, 2026 के बीच कितने दिन बीते, इसकी गणना करनी है। आपको जूलियन-से-ग्रेगोरियन कैलेण्डर संक्रमण (अक्टूबर 1582), विभिन्न मास-लम्बाइयों (28, 29, 30 या 31 दिन), जूलियन कैलेण्डर में प्रत्येक 4 वर्ष अधिवर्ष किन्तु ग्रेगोरियन में शताब्दी-छोड़ नियमों, और ईस्वी में शून्य वर्ष की अनुपस्थिति से जूझना होगा। इस प्रकार की तिथि गणित एक-अन्तर त्रुटियों का जाल है। खगोलविदों ने शताब्दियों पहले एक सरल, सुन्दर उपकरण से इसे हल किया: जूलियन दिवस संख्या।</> : <>Imagine computing how many days elapsed between March 15, 44 BCE (assassination of Caesar) and April 2, 2026. You would need to navigate the Julian-to-Gregorian calendar transition (October 1582), account for varying month lengths (28, 29, 30, or 31 days), leap years every 4 years in the Julian calendar but with century-skip rules in the Gregorian calendar, and the absence of a year zero in the common era. This kind of date arithmetic is a minefield of off-by-one errors. Astronomers solved this problem centuries ago with a single, elegant tool: the Julian Day number.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>जूलियन दिवस (JD) एक निश्चित प्रारम्भ बिन्दु से दिनों की निरन्तर गणना है: 1 जनवरी, 4713 ई.पू., मध्याह्न यूनिवर्सल टाइम। कोई महीने नहीं, कोई वर्ष नहीं, कोई अधिवर्ष दिन की जटिलता नहीं — बस एक सतत बढ़ती संख्या। JD 0 = 1 जनवरी, 4713 ई.पू., मध्याह्न UT। JD 2,451,545.0 = 1 जनवरी, 2000, मध्याह्न UT — यह प्रसिद्ध J2000.0 युगारम्भ है जिसे आधुनिक खगोलशास्त्र मानक सन्दर्भ के रूप में उपयोग करता है। विद्यमान प्रत्येक खगोलीय गणना — नासा की कक्षा भविष्यवाणियों से लेकर हमारे पंचांग ऐप तक — एक कैलेण्डर तिथि को जूलियन दिवस संख्या में बदलने से आरम्भ होती है।</> : <>The Julian Day (JD) is a continuous count of days since a fixed starting point: January 1, 4713 BCE, at noon Universal Time. There are no months, no years, no leap day complications — just a single, ever-increasing number. JD 0 = January 1, 4713 BCE, noon UT. JD 2,451,545.0 = January 1, 2000, noon UT — this is the famous J2000.0 epoch that modern astronomy uses as its standard reference. Every astronomical calculation in existence — from NASA orbit predictions to our humble Panchang app — begins by converting a calendar date into a Julian Day number.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Why 4713 BCE?', hi: '4713 ई.पू. क्यों?', sa: '4713 ई.पू. क्यों?' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>जोसेफ स्कैलिजर ने 1583 में यह तिथि इसलिए चुनी क्योंकि यह एक संयुक्त महाचक्र का आरम्भ है: 28-वर्षीय सौर चक्र (जूलियन कैलेण्डर का सप्ताह-दिन दोहराव), 19-वर्षीय मेटोनिक चक्र (चन्द्र कलाएँ उन्हीं कैलेण्डर तिथियों पर दोहराती हैं), और 15-वर्षीय रोमन इंडिक्शन (कर चक्र)। गुणनफल 28 × 19 × 15 = 7980 वर्ष। 1 ई. से पीछे गणना करने पर आरम्भ 4713 ई.पू. आता है। इससे प्रत्येक ऐतिहासिक तिथि का JD धनात्मक रहता है — ऋणात्मक दिन संख्या की आवश्यकता नहीं।</> : <>Joseph Scaliger chose this date in 1583 because it is the start of a combined super-cycle: the 28-year solar cycle (Julian calendar day-of-week repeats), the 19-year Metonic cycle (Moon phases repeat on the same calendar dates), and the 15-year Roman indiction (tax cycle). The product 28 x 19 x 15 = 7980 years. Counting backward from 1 CE places the start at 4713 BCE. This guarantees that every historical date has a positive JD — no negative day numbers needed.</>}</p>
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
          {tl({ en: 'The Algorithm Step by Step', hi: 'एल्गोरिदम चरणबद्ध', sa: 'एल्गोरिदम चरणबद्ध' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रेगोरियन तिथि को जूलियन दिवस संख्या में बदलना एक सटीक क्रम का पालन करता है। वर्ष Y, मास M, दिन D, और घण्टा H (UT में) वाली तिथि के लिए: चरण 1 — यदि M = 1 (जनवरी) या 2 (फरवरी) हो तो Y को Y-1 और M को M+12 से बदलें। यह जनवरी और फरवरी को पिछले वर्ष के महीने 13 और 14 मानता है — रोमन कैलेण्डर से विरासत में मिली परम्परा जहाँ मार्च प्रथम महीना था। यह सरलीकरण मास-लम्बाई अनुमान को फरवरी का विशेष प्रबन्ध किए बिना कार्य करने देता है।</> : <>Converting a Gregorian date to a Julian Day number follows a precise sequence. Given a date with year Y, month M, day D, and hour H (in UT): Step 1 — If M is 1 (January) or 2 (February), replace Y with Y-1 and M with M+12. This treats January and February as months 13 and 14 of the preceding year, a convention inherited from the Roman calendar where March was the first month. This simplification allows the month-length approximation to work without special-casing February.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चरण 2 — ग्रेगोरियन सुधार गणित करें: A = floor(Y / 100), B = 2 - A + floor(A / 4)। A पूर्ण शताब्दियों की गणना करता है। सुधार B ग्रेगोरियन सुधार में हटाए गए अधिवर्ष दिनों का लेखा-जोखा है: जूलियन कैलेण्डर प्रत्येक 4 वर्ष अधिवर्ष दिन जोड़ता है, किन्तु ग्रेगोरियन कैलेण्डर 400 से अविभाज्य शताब्दी वर्षों पर इसे छोड़ता है (जैसे 1700, 1800, 1900 अधिवर्ष नहीं थे, किन्तु 2000 था)। 15 अक्टूबर, 1582 (जूलियन कैलेण्डर) से पहले की तिथियों के लिए B = 0।</> : <>Step 2 — Compute the Gregorian correction: A = floor(Y / 100), B = 2 - A + floor(A / 4). The term A counts completed centuries. The correction B accounts for the leap days dropped in the Gregorian reform: the Julian calendar adds a leap day every 4 years, but the Gregorian calendar skips it on century years not divisible by 400 (e.g., 1700, 1800, 1900 were not leap years, but 2000 was). For dates before October 15, 1582 (Julian calendar), B = 0.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Complete Formula', hi: 'सम्पूर्ण सूत्र', sa: 'सम्पूर्ण सूत्र' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 3:</span> JD = floor(365.25 x (Y + 4716)) + floor(30.6001 x (M + 1)) + D + H/24 + B - 1524.5
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>floor(365.25 × (Y+4716)) पद युगारम्भ से अधिवर्ष-सचेत वर्षों के दिनों की गणना करता है। floor(30.6001 × (M+1)) पद बीते महीनों के संचयी दिनों का अनुमान लगाता है। 0.6001 (0.6 नहीं) फ़्लोटिंग-पॉइंट पूर्णांकन त्रुटियों से बचाता है। D + H/24 आंशिक दिन जोड़ता है। B ग्रेगोरियन सुधार है। स्थिरांक -1524.5 परिणाम को JD युगारम्भ से संरेखित करता है।</> : <>The term floor(365.25 x (Y+4716)) counts the days from leap-year-aware years since the epoch. The term floor(30.6001 x (M+1)) approximates the cumulative days of months elapsed. The 0.6001 (not 0.6) avoids floating-point rounding errors. D + H/24 adds the fractional day. B is the Gregorian correction. The constant -1524.5 aligns the result to the JD epoch.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरण कुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">2 अप्रैल, 2026, 12:00 UT:</span> Y = 2026, M = 4, D = 2, H = 12। M &gt; 2 होने से कोई समायोजन नहीं। A = floor(2026/100) = 20। B = 2 - 20 + floor(20/4) = 2 - 20 + 5 = -13। JD = floor(365.25 × 6742) + floor(30.6001 × 5) + 2 + 0.5 + (-13) - 1524.5 = 2,462,979.5 + 153 + 2 + 0.5 - 13 - 1524.5 = 2,461,132.0।</> : <><span className="text-gold-light font-medium">April 2, 2026, 12:00 UT:</span> Y = 2026, M = 4, D = 2, H = 12. Since M &gt; 2, no adjustment needed. A = floor(2026/100) = 20. B = 2 - 20 + floor(20/4) = 2 - 20 + 5 = -13. JD = floor(365.25 x 6742) + floor(30.6001 x 5) + 2 + 0.5 + (-13) - 1524.5 = 2,462,979.5 + 153 + 2 + 0.5 - 13 - 1524.5 = 2,461,132.0.</>}</p>
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
          {tl({ en: 'Julian Centuries and the T Variable', hi: 'जूलियन शताब्दियाँ और T चर', sa: 'जूलियन शताब्दियाँ और T चर' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>जूलियन दिवस संख्या प्राप्त होने पर प्रत्येक खगोलीय सूत्र का अगला चरण इसे J2000.0 युगारम्भ से जूलियन शताब्दियों (T) में बदलना है: T = (JD - 2451545.0) / 36525। हर 36525 बस 100 वर्ष गुणा 365.25 दिन प्रति जूलियन वर्ष है। यह T मान वह सार्वभौमिक समय चर है जो जीन मीयस की &quot;खगोलीय एल्गोरिदम&quot; में सभी स्थिति-खगोलविज्ञान सूत्रों को चलाता है। सूर्य भोगांश, चन्द्र अक्षांश, पृथ्वी की क्रान्तिवृत्त तिर्यकता, अयन-चलन और पुरस्सरण की प्रत्येक बहुपद अभिव्यक्ति T में घात श्रेणी के रूप में व्यक्त होती है।</> : <>Once we have a Julian Day number, the next step in every astronomical formula is converting it to Julian Centuries (T) from the J2000.0 epoch: T = (JD - 2451545.0) / 36525. The denominator 36525 is simply 100 years multiplied by 365.25 days per Julian year. This T value is the universal time variable that drives ALL positional astronomy formulas in Jean Meeus&apos;s &quot;Astronomical Algorithms.&quot; Every polynomial expression for the Sun&apos;s longitude, the Moon&apos;s latitude, Earth&apos;s obliquity, nutation, and precession is expressed as a power series in T.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>J2000.0 क्यों? यह युगारम्भ अन्तर्राष्ट्रीय खगोलीय संघ (IAU) ने अपनाया क्योंकि यह आधुनिक युग में आता है जब तारा-स्थान अत्यन्त सटीकता से ज्ञात हैं (हिपार्कोस उपग्रह सूची के कारण), पृथ्वी अभिविन्यास प्राचल सटीक रूप से मापे गए हैं, और यह एक स्पष्ट गोल संख्या है जो समकालीन तिथियों के लिए T में पूर्णांकन न्यूनतम करती है। 2 अप्रैल, 2026 के लिए: T = (2461132.0 - 2451545.0) / 36525 = 9587.0 / 36525 = 0.26246, अर्थात हम J2000.0 से लगभग 0.262 जूलियन शताब्दी (26.2 वर्ष) आगे हैं।</> : <>Why J2000.0? This epoch was adopted by the International Astronomical Union (IAU) because it falls in the modern era when star positions are known with extreme precision (thanks to the Hipparcos satellite catalog), Earth orientation parameters are precisely measured, and it serves as a clean round number that minimizes rounding in T for contemporary dates. For April 2, 2026: T = (2461132.0 - 2451545.0) / 36525 = 9587.0 / 36525 = 0.26246, meaning we are about 0.262 Julian centuries (26.2 years) past J2000.0.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'How Our App Uses JD', hi: 'हमारा ऐप JD कैसे उपयोग करता है', sa: 'हमारा ऐप JD कैसे उपयोग करता है' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>हमारे कोडबेस में dateToJD() फ़ंक्शन सभी गणना का प्रवेशद्वार है। जब उपयोगकर्ता किसी तिथि का पंचांग देखता है, सबसे पहले होता है: JD = dateToJD(year, month, day, hour)। यह JD फिर sunLongitude(jd) और moonLongitude(jd) को दिया जाता है ताकि सूर्य और चन्द्रमा की सायन स्थितियाँ मिलें। अन्तर (चन्द्र - सूर्य) तिथि देता है। चन्द्रमा की निरयन स्थिति नक्षत्र देती है। संयुक्त सूर्य-चन्द्र भोगांश योग देता है। पंचांग का प्रत्येक अंग इसी एक JD रूपान्तरण से जुड़ा है।</> : <>In our codebase, the function dateToJD() is the gateway to all computation. When a user views the Panchang for a date, the first thing that happens is: JD = dateToJD(year, month, day, hour). This JD is then passed to sunLongitude(jd) and moonLongitude(jd) to get the tropical positions of the Sun and Moon. The difference (Moon - Sun) gives the Tithi. The Moon&apos;s sidereal position gives the Nakshatra. The combined Sun-Moon longitude sum gives the Yoga. Every single element of the Panchang traces back to this one JD conversion.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;जूलियन दिवस बस भिन्न इकाइयों में यूनिक्स टाइमस्टैम्प है।&quot; दोनों निरन्तर समय गणनाएँ हैं, किन्तु यूनिक्स टाइमस्टैम्प 1 जनवरी, 1970 से आरम्भ होकर सेकण्ड गिनता है, जबकि JD 4713 ई.पू. से आरम्भ होकर दिन गिनता है। महत्त्वपूर्ण बात, JD मध्याह्न UT (मध्यरात्रि नहीं) से आरम्भ होता है, अर्थात JD .0 = मध्याह्न और JD .5 = मध्यरात्रि — अधिकांश प्रोग्रामरों की अपेक्षा के विपरीत।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Julian Day is just a Unix timestamp in different units.&quot; While both are continuous time counts, Unix timestamps start at January 1, 1970 and count seconds, while JD starts at 4713 BCE and counts days. More importantly, JD begins at noon UT (not midnight), which means JD .0 = noon and JD .5 = midnight — the opposite of what most programmers expect.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}