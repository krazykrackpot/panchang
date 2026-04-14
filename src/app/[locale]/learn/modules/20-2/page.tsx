'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/20-2.json';

const META: ModuleMeta = {
  id: 'mod_20_2', phase: 7, topic: 'KP System', moduleNumber: '20.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q20_2_01', type: 'mcq',
    question: {
      en: 'How many total sub-divisions cover the 360-degree zodiac in the KP system?',
      hi: 'केपी पद्धति में 360 अंश राशिचक्र को कुल कितने उप-विभाग आवृत करते हैं?',
    },
    options: [
      { en: '108', hi: '108', sa: '108', mai: '108', mr: '108', ta: '108', te: '108', bn: '108', kn: '108', gu: '108' },
      { en: '249', hi: '249', sa: '249', mai: '249', mr: '249', ta: '249', te: '249', bn: '249', kn: '249', gu: '249' },
      { en: '360', hi: '360', sa: '360', mai: '360', mr: '360', ta: '360', te: '360', bn: '360', kn: '360', gu: '360' },
      { en: '27', hi: '27', sa: '27', mai: '27', mr: '27', ta: '27', te: '27', bn: '27', kn: '27', gu: '27' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'KP divides the zodiac into 249 sub-divisions (27 nakshatras, each divided into 9 unequal subs based on Vimshottari dasha proportions). Each sub has a unique Sign Lord, Star Lord, and Sub Lord.',
      hi: 'केपी राशिचक्र को 249 उप-विभागों में बाँटता है (27 नक्षत्र, प्रत्येक विंशोत्तरी दशा अनुपात के आधार पर 9 असमान उप-भागों में विभक्त)। प्रत्येक उप-भाग का अद्वितीय राशि स्वामी, नक्षत्र स्वामी और उप-स्वामी होता है।',
    },
  },
  {
    id: 'q20_2_02', type: 'mcq',
    question: {
      en: 'What determines the size of each sub-division within a nakshatra?',
      hi: 'एक नक्षत्र के भीतर प्रत्येक उप-विभाग का आकार क्या निर्धारित करता है?',
    },
    options: [
      { en: 'Equal division (each sub is the same size)', hi: 'समान विभाजन (प्रत्येक उप-भाग समान आकार)', sa: 'समान विभाजन (प्रत्येक उप-भाग समान आकार)', mai: 'समान विभाजन (प्रत्येक उप-भाग समान आकार)', mr: 'समान विभाजन (प्रत्येक उप-भाग समान आकार)', ta: 'ஸமாந விभாஜந (ப்ரத்யேக உப-भாக ஸமாந ஆகார)', te: 'సమాన విభాజన (ప్రత్యేక ఉప-భాగ సమాన ఆకార)', bn: 'সমান বিভাজন (প্রত্যেক উপ-ভাগ সমান আকার)', kn: 'ಸಮಾನ ವಿಭಾಜನ (ಪ್ರತ್ಯೇಕ ಉಪ-ಭಾಗ ಸಮಾನ ಆಕಾರ)', gu: 'સમાન વિભાજન (પ્રત્યેક ઉપ-ભાગ સમાન આકાર)' },
      { en: 'Vimshottari dasha proportions of the 9 planets', hi: '9 ग्रहों के विंशोत्तरी दशा अनुपात', sa: '9 ग्रहों के विंशोत्तरी दशा अनुपात', mai: '9 ग्रहों के विंशोत्तरी दशा अनुपात', mr: '9 ग्रहों के विंशोत्तरी दशा अनुपात', ta: '9 க்ரஹோம் கே விம்ஶோத்தரீ தஶா அநுபாத', te: '9 గ్రహోం కే వింశోత్తరీ దశా అనుపాత', bn: '9 গ্রহোং কে বিংশোত্তরী দশা অনুপাত', kn: '9 ಗ್ರಹೋಂ ಕೇ ವಿಂಶೋತ್ತರೀ ದಶಾ ಅನುಪಾತ', gu: '9 ગ્રહોં કે વિંશોત્તરી દશા અનુપાત' },
      { en: 'The brightness of the nakshatra star', hi: 'नक्षत्र तारे की चमक', sa: 'नक्षत्र तारे की चमक', mai: 'नक्षत्र तारे की चमक', mr: 'नक्षत्र तारे की चमक', ta: 'நக்ஷத்ர தாரே கீ சமக', te: 'నక్షత్ర తారే కీ చమక', bn: 'নক্ষত্র তারে কী চমক', kn: 'ನಕ್ಷತ್ರ ತಾರೇ ಕೀ ಚಮಕ', gu: 'નક્ષત્ર તારે કી ચમક' },
      { en: 'Random assignment by Krishnamurti', hi: 'कृष्णमूर्ति द्वारा यादृच्छिक आवंटन', sa: 'कृष्णमूर्ति द्वारा यादृच्छिक आवंटन', mai: 'कृष्णमूर्ति द्वारा यादृच्छिक आवंटन', mr: 'कृष्णमूर्ति द्वारा यादृच्छिक आवंटन', ta: 'கிருஷ்ணமூர்தி த்வாரா யாதிருச்छிக ஆவம்டந', te: 'కృష్ణమూర్తి ద్వారా యాదృచ్ఛిక ఆవంటన', bn: 'কৃষ্ণমূর্তি দ্বারা যাদৃচ্ছিক আবংটন', kn: 'ಕೃಷ್ಣಮೂರ್ತಿ ದ್ವಾರಾ ಯಾದೃಚ್ಛಿಕ ಆವಂಟನ', gu: 'કૃષ્ણમૂર્તિ દ્વારા યાદૃચ્છિક આવંટન' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Each nakshatra (13 degrees 20 minutes) is divided into 9 subs proportional to the Vimshottari dasha years: Sun gets 6/120, Moon 10/120, Mars 7/120, etc. of the total 13 degrees 20 minutes.',
      hi: 'प्रत्येक नक्षत्र (13 अंश 20 कला) को विंशोत्तरी दशा वर्षों के अनुपात में 9 उप-भागों में बाँटा जाता है: सूर्य को 6/120, चन्द्र को 10/120, मंगल को 7/120, आदि कुल 13 अंश 20 कला का।',
    },
  },
  {
    id: 'q20_2_03', type: 'true_false',
    question: {
      en: 'All 9 sub-divisions within a nakshatra are equal in size.',
      hi: 'एक नक्षत्र के भीतर सभी 9 उप-विभाग आकार में समान होते हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The subs are unequal because they follow Vimshottari dasha proportions. Venus sub (20 years) spans about 2 degrees 13 minutes, while Sun sub (6 years) spans only about 0 degrees 40 minutes within each nakshatra.',
      hi: 'असत्य। उप-भाग असमान हैं क्योंकि वे विंशोत्तरी दशा अनुपात का पालन करते हैं। शुक्र उप (20 वर्ष) लगभग 2 अंश 13 कला में फैलता है, जबकि सूर्य उप (6 वर्ष) प्रत्येक नक्षत्र में केवल लगभग 0 अंश 40 कला में।',
    },
  },
  {
    id: 'q20_2_04', type: 'mcq',
    question: {
      en: 'In KP terminology, what are the three levels of lordship for any zodiac degree?',
      hi: 'केपी शब्दावली में किसी भी राशिचक्र अंश के लिए स्वामित्व के तीन स्तर क्या हैं?',
    },
    options: [
      { en: 'Lagna Lord, Moon Lord, Sun Lord', hi: 'लग्न स्वामी, चन्द्र स्वामी, सूर्य स्वामी', sa: 'लग्न स्वामी, चन्द्र स्वामी, सूर्य स्वामी', mai: 'लग्न स्वामी, चन्द्र स्वामी, सूर्य स्वामी', mr: 'लग्न स्वामी, चन्द्र स्वामी, सूर्य स्वामी', ta: 'லக்ந ஸ்வாமீ, சந்த்ர ஸ்வாமீ, ஸூர்ய ஸ்வாமீ', te: 'లగ్న స్వామీ, చన్ద్ర స్వామీ, సూర్య స్వామీ', bn: 'লগ্ন স্বামী, চন্দ্র স্বামী, সূর্য স্বামী', kn: 'ಲಗ್ನ ಸ್ವಾಮೀ, ಚನ್ದ್ರ ಸ್ವಾಮೀ, ಸೂರ್ಯ ಸ್ವಾಮೀ', gu: 'લગ્ન સ્વામી, ચન્દ્ર સ્વામી, સૂર્ય સ્વામી' },
      { en: 'Sign Lord, Star Lord, Sub Lord', hi: 'राशि स्वामी, नक्षत्र स्वामी, उप स्वामी', sa: 'राशि स्वामी, नक्षत्र स्वामी, उप स्वामी', mai: 'राशि स्वामी, नक्षत्र स्वामी, उप स्वामी', mr: 'राशि स्वामी, नक्षत्र स्वामी, उप स्वामी', ta: 'ராஶி ஸ்வாமீ, நக்ஷத்ர ஸ்வாமீ, உப ஸ்வாமீ', te: 'రాశి స్వామీ, నక్షత్ర స్వామీ, ఉప స్వామీ', bn: 'রাশি স্বামী, নক্ষত্র স্বামী, উপ স্বামী', kn: 'ರಾಶಿ ಸ್ವಾಮೀ, ನಕ್ಷತ್ರ ಸ್ವಾಮೀ, ಉಪ ಸ್ವಾಮೀ', gu: 'રાશિ સ્વામી, નક્ષત્ર સ્વામી, ઉપ સ્વામી' },
      { en: 'Dasha Lord, Bhukti Lord, Antara Lord', hi: 'दशा स्वामी, भुक्ति स्वामी, अन्तरा स्वामी', sa: 'दशा स्वामी, भुक्ति स्वामी, अन्तरा स्वामी', mai: 'दशा स्वामी, भुक्ति स्वामी, अन्तरा स्वामी', mr: 'दशा स्वामी, भुक्ति स्वामी, अन्तरा स्वामी', ta: 'தஶா ஸ்வாமீ, भுக்தி ஸ்வாமீ, அந்தரா ஸ்வாமீ', te: 'దశా స్వామీ, భుక్తి స్వామీ, అన్తరా స్వామీ', bn: 'দশা স্বামী, ভুক্তি স্বামী, অন্তরা স্বামী', kn: 'ದಶಾ ಸ್ವಾಮೀ, ಭುಕ್ತಿ ಸ್ವಾಮೀ, ಅನ್ತರಾ ಸ್ವಾಮೀ', gu: 'દશા સ્વામી, ભુક્તિ સ્વામી, અન્તરા સ્વામી' },
      { en: 'House Lord, Aspect Lord, Yoga Lord', hi: 'भाव स्वामी, दृष्टि स्वामी, योग स्वामी', sa: 'भाव स्वामी, दृष्टि स्वामी, योग स्वामी', mai: 'भाव स्वामी, दृष्टि स्वामी, योग स्वामी', mr: 'भाव स्वामी, दृष्टि स्वामी, योग स्वामी', ta: 'भாவ ஸ்வாமீ, திருஷ்டி ஸ்வாமீ, யோக ஸ்வாமீ', te: 'భావ స్వామీ, దృష్టి స్వామీ, యోగ స్వామీ', bn: 'ভাব স্বামী, দৃষ্টি স্বামী, যোগ স্বামী', kn: 'ಭಾವ ಸ್ವಾಮೀ, ದೃಷ್ಟಿ ಸ್ವಾಮೀ, ಯೋಗ ಸ್ವಾಮೀ', gu: 'ભાવ સ્વામી, દૃષ્ટિ સ્વામી, યોગ સ્વામી' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Every degree in KP has three lords: the Sign Lord (ruler of the rashi), the Star Lord (ruler of the nakshatra), and the Sub Lord (ruler of the specific sub-division). The Sub Lord is KP\'s unique contribution.',
      hi: 'केपी में प्रत्येक अंश के तीन स्वामी हैं: राशि स्वामी (राशि का शासक), नक्षत्र स्वामी (नक्षत्र का शासक), और उप स्वामी (विशिष्ट उप-विभाग का शासक)। उप स्वामी केपी का अद्वितीय योगदान है।',
    },
  },
  {
    id: 'q20_2_05', type: 'mcq',
    question: {
      en: 'For a cusp at 15 degrees 30 minutes Aries, which nakshatra does it fall in?',
      hi: '15 अंश 30 कला मेष पर स्थित सन्धि किस नक्षत्र में आती है?',
    },
    options: [
      { en: 'Ashwini (0 to 13 degrees 20 minutes)', hi: 'अश्विनी (0 से 13 अंश 20 कला)', sa: 'अश्विनी (0 से 13 अंश 20 कला)', mai: 'अश्विनी (0 से 13 अंश 20 कला)', mr: 'अश्विनी (0 से 13 अंश 20 कला)', ta: 'அஶ்விநீ (0 ஸே 13 அம்ஶ 20 கலா)', te: 'అశ్వినీ (0 సే 13 అంశ 20 కలా)', bn: 'অশ্বিনী (0 সে 13 অংশ 20 কলা)', kn: 'ಅಶ್ವಿನೀ (0 ಸೇ 13 ಅಂಶ 20 ಕಲಾ)', gu: 'અશ્વિની (0 સે 13 અંશ 20 કલા)' },
      { en: 'Bharani (13 degrees 20 minutes to 26 degrees 40 minutes)', hi: 'भरणी (13 अंश 20 कला से 26 अंश 40 कला)', sa: 'भरणी (13 अंश 20 कला से 26 अंश 40 कला)', mai: 'भरणी (13 अंश 20 कला से 26 अंश 40 कला)', mr: 'भरणी (13 अंश 20 कला से 26 अंश 40 कला)', ta: 'भரணீ (13 அம்ஶ 20 கலா ஸே 26 அம்ஶ 40 கலா)', te: 'భరణీ (13 అంశ 20 కలా సే 26 అంశ 40 కలా)', bn: 'ভরণী (13 অংশ 20 কলা সে 26 অংশ 40 কলা)', kn: 'ಭರಣೀ (13 ಅಂಶ 20 ಕಲಾ ಸೇ 26 ಅಂಶ 40 ಕಲಾ)', gu: 'ભરણી (13 અંશ 20 કલા સે 26 અંશ 40 કલા)' },
      { en: 'Krittika (26 degrees 40 minutes to 40 degrees)', hi: 'कृत्तिका (26 अंश 40 कला से 40 अंश)', sa: 'कृत्तिका (26 अंश 40 कला से 40 अंश)', mai: 'कृत्तिका (26 अंश 40 कला से 40 अंश)', mr: 'कृत्तिका (26 अंश 40 कला से 40 अंश)', ta: 'கிருத்திகா (26 அம்ஶ 40 கலா ஸே 40 அம்ஶ)', te: 'కృత్తికా (26 అంశ 40 కలా సే 40 అంశ)', bn: 'কৃত্তিকা (26 অংশ 40 কলা সে 40 অংশ)', kn: 'ಕೃತ್ತಿಕಾ (26 ಅಂಶ 40 ಕಲಾ ಸೇ 40 ಅಂಶ)', gu: 'કૃત્તિકા (26 અંશ 40 કલા સે 40 અંશ)' },
      { en: 'Rohini (40 degrees to 53 degrees 20 minutes)', hi: 'रोहिणी (40 अंश से 53 अंश 20 कला)', sa: 'रोहिणी (40 अंश से 53 अंश 20 कला)', mai: 'रोहिणी (40 अंश से 53 अंश 20 कला)', mr: 'रोहिणी (40 अंश से 53 अंश 20 कला)', ta: 'ரோஹிணீ (40 அம்ஶ ஸே 53 அம்ஶ 20 கலா)', te: 'రోహిణీ (40 అంశ సే 53 అంశ 20 కలా)', bn: 'রোহিণী (40 অংশ সে 53 অংশ 20 কলা)', kn: 'ರೋಹಿಣೀ (40 ಅಂಶ ಸೇ 53 ಅಂಶ 20 ಕಲಾ)', gu: 'રોહિણી (40 અંશ સે 53 અંશ 20 કલા)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '15 degrees 30 minutes Aries = 15.5 degrees absolute. Ashwini covers 0 to 13 degrees 20 minutes; Bharani covers 13 degrees 20 minutes to 26 degrees 40 minutes. So 15.5 degrees falls in Bharani, ruled by Venus.',
      hi: '15 अंश 30 कला मेष = 15.5 अंश निरपेक्ष। अश्विनी 0 से 13 अंश 20 कला; भरणी 13 अंश 20 कला से 26 अंश 40 कला। अतः 15.5 अंश भरणी में आता है, जिसका स्वामी शुक्र है।',
    },
  },
  {
    id: 'q20_2_06', type: 'true_false',
    question: {
      en: 'The Sub Lord of a house cusp is the final deciding factor in KP for whether that house\'s significations will manifest.',
      hi: 'भाव सन्धि का उप स्वामी केपी में इस बात का अन्तिम निर्णायक कारक है कि उस भाव के कारकत्व प्रकट होंगे या नहीं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. This is KP\'s core principle: the Sign Lord shows the general area, the Star Lord shows the source of results, but the Sub Lord is the final "yes/no" switch that determines whether the house promise will actually manifest.',
      hi: 'सत्य। यह केपी का मूल सिद्धान्त है: राशि स्वामी सामान्य क्षेत्र दिखाता है, नक्षत्र स्वामी परिणामों का स्रोत दिखाता है, किन्तु उप स्वामी अन्तिम "हाँ/नहीं" स्विच है जो निर्धारित करता है कि भाव का वादा वास्तव में फलित होगा या नहीं।',
    },
  },
  {
    id: 'q20_2_07', type: 'mcq',
    question: {
      en: 'Which planet\'s sub-division is the largest within each nakshatra?',
      hi: 'प्रत्येक नक्षत्र के भीतर किस ग्रह का उप-विभाग सबसे बड़ा है?',
    },
    options: [
      { en: 'Sun (6 years)', hi: 'सूर्य (6 वर्ष)', sa: 'सूर्य (6 वर्ष)', mai: 'सूर्य (6 वर्ष)', mr: 'सूर्य (6 वर्ष)', ta: 'ஸூர்ய (6 வர்ஷ)', te: 'సూర్య (6 వర్ష)', bn: 'সূর্য (6 বর্ষ)', kn: 'ಸೂರ್ಯ (6 ವರ್ಷ)', gu: 'સૂર્ય (6 વર્ષ)' },
      { en: 'Saturn (19 years)', hi: 'शनि (19 वर्ष)', sa: 'शनि (19 वर्ष)', mai: 'शनि (19 वर्ष)', mr: 'शनि (19 वर्ष)', ta: 'ஶநி (19 வர்ஷ)', te: 'శని (19 వర్ష)', bn: 'শনি (19 বর্ষ)', kn: 'ಶನಿ (19 ವರ್ಷ)', gu: 'શનિ (19 વર્ષ)' },
      { en: 'Venus (20 years)', hi: 'शुक्र (20 वर्ष)', sa: 'शुक्र (20 वर्ष)', mai: 'शुक्र (20 वर्ष)', mr: 'शुक्र (20 वर्ष)', ta: 'ஶுக்ர (20 வர்ஷ)', te: 'శుక్ర (20 వర్ష)', bn: 'শুক্র (20 বর্ষ)', kn: 'ಶುಕ್ರ (20 ವರ್ಷ)', gu: 'શુક્ર (20 વર્ષ)' },
      { en: 'Jupiter (16 years)', hi: 'गुरु (16 वर्ष)', sa: 'गुरु (16 वर्ष)', mai: 'गुरु (16 वर्ष)', mr: 'गुरु (16 वर्ष)', ta: 'குரு (16 வர்ஷ)', te: 'గురు (16 వర్ష)', bn: 'গুরু (16 বর্ষ)', kn: 'ಗುರು (16 ವರ್ಷ)', gu: 'ગુરુ (16 વર્ષ)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Venus has the longest Vimshottari dasha period (20 years out of 120 total), so its sub-division is the largest: 20/120 of 13 degrees 20 minutes = approximately 2 degrees 13 minutes per nakshatra.',
      hi: 'शुक्र की विंशोत्तरी दशा अवधि सबसे लम्बी है (कुल 120 में से 20 वर्ष), अतः उसका उप-विभाग सबसे बड़ा है: 13 अंश 20 कला का 20/120 = लगभग 2 अंश 13 कला प्रति नक्षत्र।',
    },
  },
  {
    id: 'q20_2_08', type: 'mcq',
    question: {
      en: 'The sub-divisions within a nakshatra start from which planet\'s sub?',
      hi: 'एक नक्षत्र के भीतर उप-विभाग किस ग्रह के उप-भाग से आरम्भ होते हैं?',
    },
    options: [
      { en: 'Always from Sun', hi: 'सदैव सूर्य से', sa: 'सदैव सूर्य से', mai: 'सदैव सूर्य से', mr: 'सदैव सूर्य से', ta: 'ஸதைவ ஸூர்ய ஸே', te: 'సదైవ సూర్య సే', bn: 'সদৈব সূর্য সে', kn: 'ಸದೈವ ಸೂರ್ಯ ಸೇ', gu: 'સદૈવ સૂર્ય સે' },
      { en: 'Always from Ketu', hi: 'सदैव केतु से', sa: 'सदैव केतु से', mai: 'सदैव केतु से', mr: 'सदैव केतु से', ta: 'ஸதைவ கேது ஸே', te: 'సదైవ కేతు సే', bn: 'সদৈব কেতু সে', kn: 'ಸದೈವ ಕೇತು ಸೇ', gu: 'સદૈવ કેતુ સે' },
      { en: 'From the nakshatra lord itself', hi: 'स्वयं नक्षत्र स्वामी से', sa: 'स्वयं नक्षत्र स्वामी से', mai: 'स्वयं नक्षत्र स्वामी से', mr: 'स्वयं नक्षत्र स्वामी से', ta: 'ஸ்வயம் நக்ஷத்ர ஸ்வாமீ ஸே', te: 'స్వయం నక్షత్ర స్వామీ సే', bn: 'স্বযং নক্ষত্র স্বামী সে', kn: 'ಸ್ವಯಂ ನಕ್ಷತ್ರ ಸ್ವಾಮೀ ಸೇ', gu: 'સ્વયં નક્ષત્ર સ્વામી સે' },
      { en: 'From the sign lord', hi: 'राशि स्वामी से', sa: 'राशि स्वामी से', mai: 'राशि स्वामी से', mr: 'राशि स्वामी से', ta: 'ராஶி ஸ்வாமீ ஸே', te: 'రాశి స్వామీ సే', bn: 'রাশি স্বামী সে', kn: 'ರಾಶಿ ಸ್ವಾಮೀ ಸೇ', gu: 'રાશિ સ્વામી સે' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The sub-divisions within a nakshatra begin from the nakshatra lord itself and then follow the Vimshottari sequence. For example, Bharani (Venus-ruled) starts with Venus sub, then Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury, Ketu.',
      hi: 'एक नक्षत्र के भीतर उप-विभाग स्वयं नक्षत्र स्वामी से आरम्भ होते हैं और फिर विंशोत्तरी क्रम का पालन करते हैं। उदाहरणार्थ, भरणी (शुक्र-शासित) शुक्र उप से आरम्भ होती है, फिर सूर्य, चन्द्र, मंगल, राहु, गुरु, शनि, बुध, केतु।',
    },
  },
  {
    id: 'q20_2_09', type: 'true_false',
    question: {
      en: 'If the Sub Lord of the 7th house cusp signifies houses 2, 7, and 11, KP would predict a successful marriage.',
      hi: 'यदि सप्तम भाव सन्धि का उप स्वामी भाव 2, 7 और 11 का कारक है, तो केपी सफल विवाह का फलादेश करेगा।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. In KP, houses 2, 7, and 11 are the marriage-supporting houses. If the 7th cusp Sub Lord signifies these houses (through occupation, star lord, or ownership), it indicates the promise of marriage exists in the chart.',
      hi: 'सत्य। केपी में भाव 2, 7 और 11 विवाह-सहायक भाव हैं। यदि 7वीं सन्धि का उप स्वामी इन भावों का कारक है (निवास, नक्षत्र स्वामी, या स्वामित्व द्वारा), तो यह संकेत करता है कि कुण्डली में विवाह का वादा विद्यमान है।',
    },
  },
  {
    id: 'q20_2_10', type: 'mcq',
    question: {
      en: 'What is the angular span of the Sun\'s sub-division within one nakshatra?',
      hi: 'एक नक्षत्र के भीतर सूर्य के उप-विभाग का कोणीय विस्तार कितना है?',
    },
    options: [
      { en: 'About 0 degrees 40 minutes', hi: 'लगभग 0 अंश 40 कला', sa: 'लगभग 0 अंश 40 कला', mai: 'लगभग 0 अंश 40 कला', mr: 'लगभग 0 अंश 40 कला', ta: 'லகभக 0 அம்ஶ 40 கலா', te: 'లగభగ 0 అంశ 40 కలా', bn: 'লগভগ 0 অংশ 40 কলা', kn: 'ಲಗಭಗ 0 ಅಂಶ 40 ಕಲಾ', gu: 'લગભગ 0 અંશ 40 કલા' },
      { en: 'About 1 degree 20 minutes', hi: 'लगभग 1 अंश 20 कला', sa: 'लगभग 1 अंश 20 कला', mai: 'लगभग 1 अंश 20 कला', mr: 'लगभग 1 अंश 20 कला', ta: 'லகभக 1 அம்ஶ 20 கலா', te: 'లగభగ 1 అంశ 20 కలా', bn: 'লগভগ 1 অংশ 20 কলা', kn: 'ಲಗಭಗ 1 ಅಂಶ 20 ಕಲಾ', gu: 'લગભગ 1 અંશ 20 કલા' },
      { en: 'About 2 degrees 13 minutes', hi: 'लगभग 2 अंश 13 कला', sa: 'लगभग 2 अंश 13 कला', mai: 'लगभग 2 अंश 13 कला', mr: 'लगभग 2 अंश 13 कला', ta: 'லகभக 2 அம்ஶ 13 கலா', te: 'లగభగ 2 అంశ 13 కలా', bn: 'লগভগ 2 অংশ 13 কলা', kn: 'ಲಗಭಗ 2 ಅಂಶ 13 ಕಲಾ', gu: 'લગભગ 2 અંશ 13 કલા' },
      { en: 'About 3 degrees', hi: 'लगभग 3 अंश', sa: 'लगभग 3 अंश', mai: 'लगभग 3 अंश', mr: 'लगभग 3 अंश', ta: 'லகभக 3 அம்ஶ', te: 'లగభగ 3 అంశ', bn: 'লগভগ 3 অংশ', kn: 'ಲಗಭಗ 3 ಅಂಶ', gu: 'લગભગ 3 અંશ' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Sun\'s Vimshottari period is 6 years out of 120. So Sun sub = 6/120 of 13 degrees 20 minutes = 0 degrees 40 minutes (0.667 degrees). This is the smallest sub-division, making Sun sub very precise for timing.',
      hi: 'सूर्य की विंशोत्तरी अवधि 120 में से 6 वर्ष है। अतः सूर्य उप = 13 अंश 20 कला का 6/120 = 0 अंश 40 कला (0.667 अंश)। यह सबसे छोटा उप-विभाग है, जो समय निर्धारण के लिए सूर्य उप को अत्यन्त सटीक बनाता है।',
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
          {tl({ en: 'Nakshatra Sub-Divisions: The KP Innovation', hi: 'नक्षत्र उप-विभाग: केपी का नवाचार', sa: 'नक्षत्र उप-विभाग: केपी का नवाचार' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'In traditional Vedic astrology, each nakshatra spans 13 degrees 20 minutes and is divided into 4 equal padas (quarters) of 3 degrees 20 minutes each. KP took this further: it divided each nakshatra into 9 UNEQUAL sub-divisions based on the Vimshottari dasha proportions of the 9 planets. Just as the 120-year Vimshottari cycle allocates different periods to each planet (Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17 years), KP allocates proportional slices of each 13-degree-20-minute nakshatra to each planet.', hi: 'पारम्परिक वैदिक ज्योतिष में प्रत्येक नक्षत्र 13 अंश 20 कला में फैला है और 3 अंश 20 कला के 4 समान पादों (चतुर्थांशों) में विभक्त है। केपी ने इसे आगे बढ़ाया: इसने प्रत्येक नक्षत्र को 9 ग्रहों के विंशोत्तरी दशा अनुपातों के आधार पर 9 असमान उप-विभागों में बाँटा। जैसे 120 वर्ष का विंशोत्तरी चक्र प्रत्येक ग्रह को भिन्न अवधि आवंटित करता है (केतु 7, शुक्र 20, सूर्य 6, चन्द्र 10, मंगल 7, राहु 18, गुरु 16, शनि 19, बुध 17 वर्ष), केपी प्रत्येक 13 अंश 20 कला नक्षत्र के आनुपातिक खण्ड प्रत्येक ग्रह को आवंटित करता है।', sa: 'पारम्परिक वैदिक ज्योतिष में प्रत्येक नक्षत्र 13 अंश 20 कला में फैला है और 3 अंश 20 कला के 4 समान पादों (चतुर्थांशों) में विभक्त है। केपी ने इसे आगे बढ़ाया: इसने प्रत्येक नक्षत्र को 9 ग्रहों के विंशोत्तरी दशा अनुपातों के आधार पर 9 असमान उप-विभागों में बाँटा। जैसे 120 वर्ष का विंशोत्तरी चक्र प्रत्येक ग्रह को भिन्न अवधि आवंटित करता है (केतु 7, शुक्र 20, सूर्य 6, चन्द्र 10, मंगल 7, राहु 18, गुरु 16, शनि 19, बुध 17 वर्ष), केपी प्रत्येक 13 अंश 20 कला नक्षत्र के आनुपातिक खण्ड प्रत्येक ग्रह को आवंटित करता है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The result: 27 nakshatras times approximately 9 subs each = 249 unique sub-divisions covering the full 360 degrees. Each sub-division is characterized by three lords: the Sign Lord (planet ruling the rashi in which the degree falls), the Star Lord (planet ruling the nakshatra), and the Sub Lord (planet ruling the specific sub-division). This three-tier lordship system is the backbone of all KP analysis.', hi: 'परिणाम: 27 नक्षत्र गुणा प्रत्येक में लगभग 9 उप-भाग = 249 अद्वितीय उप-विभाग जो पूर्ण 360 अंश आवृत करते हैं। प्रत्येक उप-विभाग तीन स्वामियों द्वारा विशेषित है: राशि स्वामी (उस अंश की राशि का शासक ग्रह), नक्षत्र स्वामी (नक्षत्र का शासक ग्रह), और उप स्वामी (विशिष्ट उप-विभाग का शासक ग्रह)। यह त्रि-स्तरीय स्वामित्व प्रणाली सम्पूर्ण केपी विश्लेषण की रीढ़ है।', sa: 'परिणाम: 27 नक्षत्र गुणा प्रत्येक में लगभग 9 उप-भाग = 249 अद्वितीय उप-विभाग जो पूर्ण 360 अंश आवृत करते हैं। प्रत्येक उप-विभाग तीन स्वामियों द्वारा विशेषित है: राशि स्वामी (उस अंश की राशि का शासक ग्रह), नक्षत्र स्वामी (नक्षत्र का शासक ग्रह), और उप स्वामी (विशिष्ट उप-विभाग का शासक ग्रह)। यह त्रि-स्तरीय स्वामित्व प्रणाली सम्पूर्ण केपी विश्लेषण की रीढ़ है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीय उत्पत्ति' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: "The concept of subdividing nakshatras is not new — Parashari astrology uses the 4-pada system (108 padas total, forming the Navamsha). KP\'s innovation was replacing equal padas with UNEQUAL Vimshottari-proportioned subs. Krishnamurti argued that since the Vimshottari dasha governs the timing of life events, the same proportional logic should govern the spatial division of the zodiac. This elegant unification of temporal (dasha) and spatial (sub-lord) systems using the same Vimshottari ratios is what makes KP internally consistent.", hi: "नक्षत्रों को उप-विभाजित करने की अवधारणा नई नहीं है — पाराशरी ज्योतिष 4-पाद पद्धति (कुल 108 पाद, जो नवांश बनाते हैं) का उपयोग करता है। केपी का नवाचार था समान पादों को असमान विंशोत्तरी-अनुपातित उप-भागों से प्रतिस्थापित करना। कृष्णमूर्ति का तर्क था कि चूँकि विंशोत्तरी दशा जीवन घटनाओं के समय को नियन्त्रित करती है, वही आनुपातिक तर्क राशिचक्र के स्थानिक विभाजन को भी नियन्त्रित करना चाहिए। समान विंशोत्तरी अनुपातों का उपयोग करके कालिक (दशा) और स्थानिक (उप-स्वामी) पद्धतियों का यह सुन्दर एकीकरण ही केपी को आन्तरिक रूप से सुसंगत बनाता है।", sa: "नक्षत्रों को उप-विभाजित करने की अवधारणा नई नहीं है — पाराशरी ज्योतिष 4-पाद पद्धति (कुल 108 पाद, जो नवांश बनाते हैं) का उपयोग करता है। केपी का नवाचार था समान पादों को असमान विंशोत्तरी-अनुपातित उप-भागों से प्रतिस्थापित करना। कृष्णमूर्ति का तर्क था कि चूँकि विंशोत्तरी दशा जीवन घटनाओं के समय को नियन्त्रित करती है, वही आनुपातिक तर्क राशिचक्र के स्थानिक विभाजन को भी नियन्त्रित करना चाहिए। समान विंशोत्तरी अनुपातों का उपयोग करके कालिक (दशा) और स्थानिक (उप-स्वामी) पद्धतियों का यह सुन्दर एकीकरण ही केपी को आन्तरिक रूप से सुसंगत बनाता है।" }, locale)}
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
          {tl({ en: 'Finding the Sub Lord: Step by Step', hi: 'उप स्वामी ज्ञात करना: चरण दर चरण', sa: 'उप स्वामी ज्ञात करना: चरण दर चरण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>किसी भी राशिचक्र अंश का उप स्वामी ज्ञात करने के लिए तीन चरणों का पालन करें। पहला, नक्षत्र पहचानें: निरपेक्ष भोगांश को 13.333 अंश से विभक्त कर ज्ञात करें कि वह अंश 27 नक्षत्रों में से किसमें आता है। दूसरा, नक्षत्र के आरम्भिक अंश को घटाकर नक्षत्र के भीतर स्थिति ज्ञात करें। तीसरा, इस स्थिति को उस नक्षत्र के विंशोत्तरी-अनुपातित उप-विभागों से मिलाएँ, जो स्वयं नक्षत्र स्वामी से आरम्भ होते हैं।</>
            : <>To find the Sub Lord of any zodiac degree, follow three steps. First, identify the nakshatra: divide the absolute longitude by 13.333 degrees to find which of the 27 nakshatras the degree falls in. Second, find the position within the nakshatra by subtracting the nakshatra&apos;s starting degree. Third, map this position against the Vimshottari-proportioned sub-divisions of that nakshatra, starting from the nakshatra lord itself.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>प्रत्येक नक्षत्र के भीतर उप-विभाग नक्षत्र स्वामी से आरम्भ होकर विंशोत्तरी क्रम का पालन करते हैं। भरणी (शुक्र-शासित) के लिए क्रम है: शुक्र उप, सूर्य उप, चन्द्र उप, मंगल उप, राहु उप, गुरु उप, शनि उप, बुध उप, केतु उप। प्रत्येक उप की चौड़ाई उसकी विंशोत्तरी अवधि के अनुपात में है। शुक्र उप = 13 अंश 20 कला का 20/120 = 2 अंश 13 कला 20 विकला। सूर्य उप = 13 अंश 20 कला का 6/120 = 0 अंश 40 कला। इत्यादि।</>
            : <>The sub-divisions within each nakshatra follow the Vimshottari sequence starting from the nakshatra lord. For Bharani (Venus-ruled), the sequence is: Venus sub, Sun sub, Moon sub, Mars sub, Rahu sub, Jupiter sub, Saturn sub, Mercury sub, Ketu sub. Each sub&apos;s width is proportional to its Vimshottari period. Venus sub = 20/120 of 13 degrees 20 minutes = 2 degrees 13 minutes 20 seconds. Sun sub = 6/120 of 13 degrees 20 minutes = 0 degrees 40 minutes. And so on.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरण कुण्डली' }, locale)} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">15 अंश 30 कला मेष का उप स्वामी ज्ञात करें:</span> चरण 1: 15 अंश 30 कला = 15.5 अंश निरपेक्ष। नक्षत्र = floor(15.5 / 13.333) + 1 = floor(1.162) + 1 = 1 + 1 = दूसरा नक्षत्र = भरणी। नक्षत्र स्वामी = शुक्र। चरण 2: भरणी में स्थिति = 15.5 - 13.333 = 2.167 अंश = 2 अंश 10 कला। चरण 3: भरणी के उप-भाग शुक्र (2 अंश 13 कला 20 विकला) से आरम्भ होते हैं। चूँकि 2 अंश 10 कला, 2 अंश 13 कला 20 विकला से कम है, हम अभी शुक्र उप में हैं। अन्तिम उत्तर: राशि स्वामी = मंगल (मेष), नक्षत्र स्वामी = शुक्र (भरणी), उप स्वामी = शुक्र।</>
            : <><span className="text-gold-light font-medium">Find the Sub Lord of 15 degrees 30 minutes Aries:</span> Step 1: 15 degrees 30 minutes = 15.5 degrees absolute. Nakshatra = floor(15.5 / 13.333) + 1 = floor(1.162) + 1 = 1 + 1 = 2nd nakshatra = Bharani. Star Lord = Venus. Step 2: Position within Bharani = 15.5 degrees - 13.333 degrees = 2.167 degrees = 2 degrees 10 minutes. Step 3: Bharani subs start with Venus (2 degrees 13 minutes 20 seconds). Since 2 degrees 10 minutes is less than 2 degrees 13 minutes 20 seconds, we are still within the Venus sub. Final answer: Sign Lord = Mars (Aries), Star Lord = Venus (Bharani), Sub Lord = Venus.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Another example — 16 degrees Aries:</span> Position in Bharani = 16 - 13.333 = 2.667 degrees. Venus sub ends at 2.222 degrees. Sun sub = 0.667 degrees, so Sun sub covers 2.222 to 2.889 degrees. Since 2.667 is within this range, Sub Lord = Sun. Result: Mars / Venus / Sun. Just half a degree apart from the previous example, yet a completely different Sub Lord!
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
          {tl({ en: 'Why the Sub Lord Is the Key', hi: 'उप स्वामी क्यों कुञ्जी है', sa: 'उप स्वामी क्यों कुञ्जी है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>केपी की क्रान्तिकारी अन्तर्दृष्टि यह है कि भाव सन्धि का उप स्वामी निर्णय करता है कि उस भाव के कारकत्व जातक के जीवन में प्रकट होंगे या नहीं। राशि स्वामी सामान्य क्षेत्र या वातावरण दिखाता है। नक्षत्र स्वामी उस स्रोत को प्रकट करता है जहाँ से परिणाम आएँगे। किन्तु उप स्वामी अन्तिम निर्णय देता है: &quot;हाँ, यह घटित होगा&quot; या &quot;नहीं, यह नहीं होगा।&quot;</>
            : <>KP&apos;s revolutionary insight is that the Sub Lord of a house cusp DECIDES whether that house&apos;s significations will manifest in the native&apos;s life. The Sign Lord shows the general area or environment. The Star Lord reveals the source from which results will come. But the Sub Lord delivers the final verdict: &quot;yes, this will happen&quot; or &quot;no, this will not happen.&quot;</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'For example, to judge marriage potential, examine the Sub Lord of the 7th house cusp. If this Sub Lord signifies houses 2, 7, and 11 (the marriage-supporting group), the native WILL marry. If the Sub Lord signifies houses 1, 6, 10 (independent/adverse to partnership), marriage may be denied or severely delayed. The Sign Lord and Star Lord add context, but the Sub Lord is the deciding vote.', hi: 'उदाहरणार्थ, विवाह सम्भावना का आकलन करने के लिए सप्तम भाव सन्धि के उप स्वामी की जाँच करें। यदि यह उप स्वामी भाव 2, 7 और 11 (विवाह-सहायक समूह) का कारक है, तो जातक का विवाह अवश्य होगा। यदि उप स्वामी भाव 1, 6, 10 (स्वतन्त्र/साझेदारी-विरोधी) का कारक है, तो विवाह अस्वीकृत या अत्यन्त विलम्बित हो सकता है। राशि स्वामी और नक्षत्र स्वामी सन्दर्भ जोड़ते हैं, किन्तु उप स्वामी निर्णायक मत है।', sa: 'उदाहरणार्थ, विवाह सम्भावना का आकलन करने के लिए सप्तम भाव सन्धि के उप स्वामी की जाँच करें। यदि यह उप स्वामी भाव 2, 7 और 11 (विवाह-सहायक समूह) का कारक है, तो जातक का विवाह अवश्य होगा। यदि उप स्वामी भाव 1, 6, 10 (स्वतन्त्र/साझेदारी-विरोधी) का कारक है, तो विवाह अस्वीकृत या अत्यन्त विलम्बित हो सकता है। राशि स्वामी और नक्षत्र स्वामी सन्दर्भ जोड़ते हैं, किन्तु उप स्वामी निर्णायक मत है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;249 उप-स्वामी सारणी नवांश जैसा एक और वर्गीय चार्ट है।&quot; यह गलत है। नवांश प्रत्येक राशि को 9 समान भागों में विभक्त करता है और एक नई कुण्डली (D-9) बनाता है। केपी उप-स्वामी प्रत्येक नक्षत्र को 9 असमान भागों में विभक्त करते हैं और कोई पृथक कुण्डली नहीं बनाते — उप-स्वामी सूचना सीधे जन्म कुण्डली में भाव सन्धि विश्लेषण के लिए प्रयुक्त होती है।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The 249 sub-lord table is just another divisional chart like Navamsha.&quot; This is incorrect. The Navamsha divides each sign into 9 EQUAL parts and creates a new chart (D-9). KP sub-lords divide each NAKSHATRA into 9 UNEQUAL parts and do NOT create a separate chart — the sub-lord information is used directly within the birth chart for house cusp analysis.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Before computers, KP practitioners had to manually look up the 249 sub-lord table from printed books — a tedious and error-prone process. Today, our KP System tool instantly computes the Sign Lord, Star Lord, and Sub Lord for every planet and house cusp in the chart. This automation has democratized KP astrology, allowing students to focus on interpretation rather than table lookups. The precision of sub-lord computation demands accurate birth time — even a 2-minute difference can shift a cusp sub-lord, which is why KP astrologers are among the strongest advocates for birth time rectification.', hi: 'कम्प्यूटर से पहले, केपी अभ्यासकर्ताओं को मुद्रित पुस्तकों से 249 उप-स्वामी सारणी मैनुअली खोजनी पड़ती थी — एक थकाऊ और त्रुटि-प्रवण प्रक्रिया। आज हमारा केपी सिस्टम उपकरण कुण्डली में प्रत्येक ग्रह और भाव सन्धि का राशि स्वामी, नक्षत्र स्वामी और उप स्वामी तत्काल गणित करता है। इस स्वचालन ने केपी ज्योतिष का लोकतन्त्रीकरण किया है, जिससे विद्यार्थी सारणी खोज के बजाय व्याख्या पर ध्यान केन्द्रित कर सकते हैं। उप-स्वामी गणना की सटीकता के लिए सही जन्म समय अनिवार्य है — 2 मिनट का अन्तर भी सन्धि उप-स्वामी बदल सकता है, इसीलिए केपी ज्योतिषी जन्म समय शोधन के सबसे प्रबल समर्थकों में हैं।', sa: 'कम्प्यूटर से पहले, केपी अभ्यासकर्ताओं को मुद्रित पुस्तकों से 249 उप-स्वामी सारणी मैनुअली खोजनी पड़ती थी — एक थकाऊ और त्रुटि-प्रवण प्रक्रिया। आज हमारा केपी सिस्टम उपकरण कुण्डली में प्रत्येक ग्रह और भाव सन्धि का राशि स्वामी, नक्षत्र स्वामी और उप स्वामी तत्काल गणित करता है। इस स्वचालन ने केपी ज्योतिष का लोकतन्त्रीकरण किया है, जिससे विद्यार्थी सारणी खोज के बजाय व्याख्या पर ध्यान केन्द्रित कर सकते हैं। उप-स्वामी गणना की सटीकता के लिए सही जन्म समय अनिवार्य है — 2 मिनट का अन्तर भी सन्धि उप-स्वामी बदल सकता है, इसीलिए केपी ज्योतिषी जन्म समय शोधन के सबसे प्रबल समर्थकों में हैं।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module20_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
