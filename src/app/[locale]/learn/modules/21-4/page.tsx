'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/21-4.json';

const META: ModuleMeta = {
  id: 'mod_21_4', phase: 8, topic: 'Varshaphal', moduleNumber: '21.4',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q21_4_01', type: 'mcq',
    question: {
      en: 'What is Tithi Pravesha based on?',
      hi: 'तिथि प्रवेश किस पर आधारित है?',
    },
    options: [
      { en: 'The Sun returning to its natal longitude (solar return)', hi: 'सूर्य का अपने जन्म भोगांश पर लौटना (सौर प्रत्यावर्तन)', sa: 'सूर्य का अपने जन्म भोगांश पर लौटना (सौर प्रत्यावर्तन)', mai: 'सूर्य का अपने जन्म भोगांश पर लौटना (सौर प्रत्यावर्तन)', mr: 'सूर्य का अपने जन्म भोगांश पर लौटना (सौर प्रत्यावर्तन)', ta: 'ஸூர்ய கா அபநே ஜந்ம भோகாம்ஶ பர லௌடநா (ஸௌர ப்ரத்யாவர்தந)', te: 'సూర్య కా అపనే జన్మ భోగాంశ పర లౌటనా (సౌర ప్రత్యావర్తన)', bn: 'সূর্য কা অপনে জন্ম ভোগাংশ পর লৌটনা (সৌর প্রত্যাবর্তন)', kn: 'ಸೂರ್ಯ ಕಾ ಅಪನೇ ಜನ್ಮ ಭೋಗಾಂಶ ಪರ ಲೌಟನಾ (ಸೌರ ಪ್ರತ್ಯಾವರ್ತನ)', gu: 'સૂર્ય કા અપને જન્મ ભોગાંશ પર લૌટના (સૌર પ્રત્યાવર્તન)' },
      { en: 'The Moon returning to its natal longitude (lunar return)', hi: 'चन्द्र का अपने जन्म भोगांश पर लौटना (चान्द्र प्रत्यावर्तन)', sa: 'चन्द्र का अपने जन्म भोगांश पर लौटना (चान्द्र प्रत्यावर्तन)', mai: 'चन्द्र का अपने जन्म भोगांश पर लौटना (चान्द्र प्रत्यावर्तन)', mr: 'चन्द्र का अपने जन्म भोगांश पर लौटना (चान्द्र प्रत्यावर्तन)', ta: 'சந்த்ர கா அபநே ஜந்ம भோகாம்ஶ பர லௌடநா (சாந்த்ர ப்ரத்யாவர்தந)', te: 'చన్ద్ర కా అపనే జన్మ భోగాంశ పర లౌటనా (చాన్ద్ర ప్రత్యావర్తన)', bn: 'চন্দ্র কা অপনে জন্ম ভোগাংশ পর লৌটনা (চান্দ্র প্রত্যাবর্তন)', kn: 'ಚನ್ದ್ರ ಕಾ ಅಪನೇ ಜನ್ಮ ಭೋಗಾಂಶ ಪರ ಲೌಟನಾ (ಚಾನ್ದ್ರ ಪ್ರತ್ಯಾವರ್ತನ)', gu: 'ચન્દ્ર કા અપને જન્મ ભોગાંશ પર લૌટના (ચાન્દ્ર પ્રત્યાવર્તન)' },
      { en: 'The Sun-Moon angular relationship (tithi) recurring annually', hi: 'सूर्य-चन्द्र कोणीय सम्बन्ध (तिथि) का वार्षिक पुनरावर्तन', sa: 'सूर्य-चन्द्र कोणीय सम्बन्ध (तिथि) का वार्षिक पुनरावर्तन', mai: 'सूर्य-चन्द्र कोणीय सम्बन्ध (तिथि) का वार्षिक पुनरावर्तन', mr: 'सूर्य-चन्द्र कोणीय सम्बन्ध (तिथि) का वार्षिक पुनरावर्तन', ta: 'ஸூர்ய-சந்த்ர கோணீய ஸம்பந்ध (திथி) கா வார்ஷிக புநராவர்தந', te: 'సూర్య-చన్ద్ర కోణీయ సమ్బన్ధ (తిథి) కా వార్షిక పునరావర్తన', bn: 'সূর্য-চন্দ্র কোণীয সম্বন্ধ (তিথি) কা বার্ষিক পুনরাবর্তন', kn: 'ಸೂರ್ಯ-ಚನ್ದ್ರ ಕೋಣೀಯ ಸಮ್ಬನ್ಧ (ತಿಥಿ) ಕಾ ವಾರ್ಷಿಕ ಪುನರಾವರ್ತನ', gu: 'સૂર્ય-ચન્દ્ર કોણીય સમ્બન્ધ (તિથિ) કા વાર્ષિક પુનરાવર્તન' },
      { en: 'The Ascendant returning to its natal degree', hi: 'लग्न का अपने जन्म अंश पर लौटना', sa: 'लग्न का अपने जन्म अंश पर लौटना', mai: 'लग्न का अपने जन्म अंश पर लौटना', mr: 'लग्न का अपने जन्म अंश पर लौटना', ta: 'லக்ந கா அபநே ஜந்ம அம்ஶ பர லௌடநா', te: 'లగ్న కా అపనే జన్మ అంశ పర లౌటనా', bn: 'লগ্ন কা অপনে জন্ম অংশ পর লৌটনা', kn: 'ಲಗ್ನ ಕಾ ಅಪನೇ ಜನ್ಮ ಅಂಶ ಪರ ಲೌಟನಾ', gu: 'લગ્ન કા અપને જન્મ અંશ પર લૌટના' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Tithi Pravesha is based on the annual recurrence of the natal tithi — the exact Sun-Moon elongation angle at birth. The chart is cast for the moment this angular relationship repeats each year.',
      hi: 'तिथि प्रवेश जन्म तिथि — जन्म के समय सूर्य-चन्द्र के यथार्थ कोणीय विस्तार — के वार्षिक पुनरावर्तन पर आधारित है। कुण्डली उस क्षण के लिए बनाई जाती है जब यह कोणीय सम्बन्ध प्रत्येक वर्ष दोहराता है।',
    },
  },
  {
    id: 'q21_4_02', type: 'true_false',
    question: {
      en: 'Tithi Pravesha always falls on the same Gregorian date as the native\'s birthday.',
      hi: 'तिथि प्रवेश सदैव जातक के ग्रेगोरियन जन्मदिन की तिथि पर पड़ता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Since Tithi Pravesha is based on the Sun-Moon angular relationship (not the Sun\'s absolute position), it may fall a few days before or after the Gregorian birthday. The lunar calendar shifts relative to the solar calendar each year.',
      hi: 'असत्य। चूँकि तिथि प्रवेश सूर्य-चन्द्र कोणीय सम्बन्ध पर आधारित है (सूर्य की निरपेक्ष स्थिति पर नहीं), यह ग्रेगोरियन जन्मदिन से कुछ दिन पहले या बाद में पड़ सकता है। चान्द्र पंचांग प्रत्येक वर्ष सौर पंचांग के सापेक्ष खिसकता है।',
    },
  },
  {
    id: 'q21_4_03', type: 'mcq',
    question: {
      en: 'How does Tithi Pravesha differ from Varshaphal (solar return)?',
      hi: 'तिथि प्रवेश वर्षफल (सौर प्रत्यावर्तन) से कैसे भिन्न है?',
    },
    options: [
      { en: 'Varshaphal uses the Moon, Tithi Pravesha uses the Sun', hi: 'वर्षफल चन्द्रमा का, तिथि प्रवेश सूर्य का उपयोग करता है', sa: 'वर्षफल चन्द्रमा का, तिथि प्रवेश सूर्य का उपयोग करता है', mai: 'वर्षफल चन्द्रमा का, तिथि प्रवेश सूर्य का उपयोग करता है', mr: 'वर्षफल चन्द्रमा का, तिथि प्रवेश सूर्य का उपयोग करता है', ta: 'வர்ஷफல சந்த்ரமா கா, திथி ப்ரவேஶ ஸூர்ய கா உபயோக கரதா ஹை', te: 'వర్షఫల చన్ద్రమా కా, తిథి ప్రవేశ సూర్య కా ఉపయోగ కరతా హై', bn: 'বর্ষফল চন্দ্রমা কা, তিথি প্রবেশ সূর্য কা উপযোগ করতা হৈ', kn: 'ವರ್ಷಫಲ ಚನ್ದ್ರಮಾ ಕಾ, ತಿಥಿ ಪ್ರವೇಶ ಸೂರ್ಯ ಕಾ ಉಪಯೋಗ ಕರತಾ ಹೈ', gu: 'વર્ષફલ ચન્દ્રમા કા, તિથિ પ્રવેશ સૂર્ય કા ઉપયોગ કરતા હૈ' },
      { en: 'Varshaphal tracks Sun\'s return, Tithi Pravesha tracks the Sun-Moon relationship', hi: 'वर्षफल सूर्य के लौटने को, तिथि प्रवेश सूर्य-चन्द्र सम्बन्ध को ट्रैक करता है' },
      { en: 'They are the same technique with different names', hi: 'ये एक ही तकनीक हैं भिन्न नामों से', sa: 'ये एक ही तकनीक हैं भिन्न नामों से', mai: 'ये एक ही तकनीक हैं भिन्न नामों से', mr: 'ये एक ही तकनीक हैं भिन्न नामों से', ta: 'யே எக ஹீ தகநீக ஹைம் भிந்ந நாமோம் ஸே', te: 'యే ఏక హీ తకనీక హైం భిన్న నామోం సే', bn: 'যে এক হী তকনীক হৈং ভিন্ন নামোং সে', kn: 'ಯೇ ಏಕ ಹೀ ತಕನೀಕ ಹೈಂ ಭಿನ್ನ ನಾಮೋಂ ಸೇ', gu: 'યે એક હી તકનીક હૈં ભિન્ન નામોં સે' },
      { en: 'Tithi Pravesha is for daily predictions, Varshaphal for yearly', hi: 'तिथि प्रवेश दैनिक फलादेश के लिए, वर्षफल वार्षिक', sa: 'तिथि प्रवेश दैनिक फलादेश के लिए, वर्षफल वार्षिक', mai: 'तिथि प्रवेश दैनिक फलादेश के लिए, वर्षफल वार्षिक', mr: 'तिथि प्रवेश दैनिक फलादेश के लिए, वर्षफल वार्षिक', ta: 'திथி ப்ரவேஶ தைநிக फலாதேஶ கே லிஎ, வர்ஷफல வார்ஷிக', te: 'తిథి ప్రవేశ దైనిక ఫలాదేశ కే లిఏ, వర్షఫల వార్షిక', bn: 'তিথি প্রবেশ দৈনিক ফলাদেশ কে লিএ, বর্ষফল বার্ষিক', kn: 'ತಿಥಿ ಪ್ರವೇಶ ದೈನಿಕ ಫಲಾದೇಶ ಕೇ ಲಿಏ, ವರ್ಷಫಲ ವಾರ್ಷಿಕ', gu: 'તિથિ પ્રવેશ દૈનિક ફલાદેશ કે લિએ, વર્ષફલ વાર્ષિક' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Varshaphal casts the chart when the Sun returns to its exact natal longitude. Tithi Pravesha casts the chart when the Sun-Moon elongation (tithi) matches the natal value. They are complementary but different charts.',
      hi: 'वर्षफल तब कुण्डली बनाता है जब सूर्य अपने यथार्थ जन्म भोगांश पर लौटता है। तिथि प्रवेश तब बनाता है जब सूर्य-चन्द्र विस्तार (तिथि) जन्म मान से मेल खाता है। ये पूरक किन्तु भिन्न कुण्डलियाँ हैं।',
    },
  },
  {
    id: 'q21_4_04', type: 'mcq',
    question: {
      en: 'What does the tithi represent astronomically?',
      hi: 'तिथि खगोलीय रूप से क्या प्रदर्शित करती है?',
    },
    options: [
      { en: 'The Sun\'s longitude', hi: 'सूर्य का भोगांश' },
      { en: 'The Moon\'s longitude', hi: 'चन्द्रमा का भोगांश' },
      { en: 'The angular separation between Moon and Sun', hi: 'चन्द्रमा और सूर्य के बीच कोणीय पृथक्करण', sa: 'चन्द्रमा और सूर्य के बीच कोणीय पृथक्करण', mai: 'चन्द्रमा और सूर्य के बीच कोणीय पृथक्करण', mr: 'चन्द्रमा और सूर्य के बीच कोणीय पृथक्करण', ta: 'சந்த்ரமா ஔர ஸூர்ய கே பீச கோணீய பிருथக்கரண', te: 'చన్ద్రమా ఔర సూర్య కే బీచ కోణీయ పృథక్కరణ', bn: 'চন্দ্রমা ঔর সূর্য কে বীচ কোণীয পৃথক্করণ', kn: 'ಚನ್ದ್ರಮಾ ಔರ ಸೂರ್ಯ ಕೇ ಬೀಚ ಕೋಣೀಯ ಪೃಥಕ್ಕರಣ', gu: 'ચન્દ્રમા ઔર સૂર્ય કે બીચ કોણીય પૃથક્કરણ' },
      { en: 'The Ascendant degree', hi: 'लग्न अंश', sa: 'लग्न अंश', mai: 'लग्न अंश', mr: 'लग्न अंश', ta: 'லக்ந அம்ஶ', te: 'లగ్న అంశ', bn: 'লগ্ন অংশ', kn: 'ಲಗ್ನ ಅಂಶ', gu: 'લગ્ન અંશ' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'A tithi is defined by the Moon-Sun elongation (Moon\'s longitude minus Sun\'s longitude). Each tithi spans 12 degrees of elongation. There are 30 tithis in a lunar month (360 degrees / 12 degrees each).',
      hi: 'तिथि चन्द्र-सूर्य विस्तार (चन्द्र भोगांश घटा सूर्य भोगांश) द्वारा परिभाषित है। प्रत्येक तिथि 12 अंश विस्तार में फैली है। एक चान्द्र मास में 30 तिथियाँ हैं (360 अंश / प्रत्येक 12 अंश)।',
    },
  },
  {
    id: 'q21_4_05', type: 'true_false',
    question: {
      en: 'In Hindu tradition, a person\'s "real" birthday is their tithi, not their Gregorian calendar date.',
      hi: 'हिन्दू परम्परा में व्यक्ति का "वास्तविक" जन्मदिन उसकी तिथि है, ग्रेगोरियन तिथि नहीं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Traditional Hindu birthdays (Janma Tithi) are celebrated based on the lunar tithi, not the solar/Gregorian date. This is why Tithi Pravesha honors the same tradition — your cosmic "birthday" is when the Sun-Moon relationship recurs.',
      hi: 'सत्य। पारम्परिक हिन्दू जन्मदिन (जन्म तिथि) चान्द्र तिथि के आधार पर मनाए जाते हैं, सौर/ग्रेगोरियन तिथि पर नहीं। इसीलिए तिथि प्रवेश उसी परम्परा का सम्मान करता है — आपका ब्रह्माण्डीय "जन्मदिन" वह है जब सूर्य-चन्द्र सम्बन्ध पुनरावृत्त होता है।',
    },
  },
  {
    id: 'q21_4_06', type: 'mcq',
    question: {
      en: 'For Tithi Pravesha computation, what two conditions must be met?',
      hi: 'तिथि प्रवेश गणना के लिए कौन-सी दो शर्तें पूरी होनी चाहिए?',
    },
    options: [
      { en: 'Moon must be in natal sign AND Sun in natal sign', hi: 'चन्द्र जन्म राशि में हो और सूर्य जन्म राशि में', sa: 'चन्द्र जन्म राशि में हो और सूर्य जन्म राशि में', mai: 'चन्द्र जन्म राशि में हो और सूर्य जन्म राशि में', mr: 'चन्द्र जन्म राशि में हो और सूर्य जन्म राशि में', ta: 'சந்த்ர ஜந்ம ராஶி மேம் ஹோ ஔர ஸூர்ய ஜந்ம ராஶி மேம்', te: 'చన్ద్ర జన్మ రాశి మేం హో ఔర సూర్య జన్మ రాశి మేం', bn: 'চন্দ্র জন্ম রাশি মেং হো ঔর সূর্য জন্ম রাশি মেং', kn: 'ಚನ್ದ್ರ ಜನ್ಮ ರಾಶಿ ಮೇಂ ಹೋ ಔರ ಸೂರ್ಯ ಜನ್ಮ ರಾಶಿ ಮೇಂ', gu: 'ચન્દ્ર જન્મ રાશિ મેં હો ઔર સૂર્ય જન્મ રાશિ મેં' },
      { en: 'Moon-Sun elongation matches natal AND Sun is in the same sign as natal', hi: 'चन्द्र-सूर्य विस्तार जन्म से मेल खाए और सूर्य जन्म की ही राशि में हो', sa: 'चन्द्र-सूर्य विस्तार जन्म से मेल खाए और सूर्य जन्म की ही राशि में हो', mai: 'चन्द्र-सूर्य विस्तार जन्म से मेल खाए और सूर्य जन्म की ही राशि में हो', mr: 'चन्द्र-सूर्य विस्तार जन्म से मेल खाए और सूर्य जन्म की ही राशि में हो', ta: 'சந்த்ர-ஸூர்ய விஸ்தார ஜந்ம ஸே மேல खாஎ ஔர ஸூர்ய ஜந்ம கீ ஹீ ராஶி மேம் ஹோ', te: 'చన్ద్ర-సూర్య విస్తార జన్మ సే మేల ఖాఏ ఔర సూర్య జన్మ కీ హీ రాశి మేం హో', bn: 'চন্দ্র-সূর্য বিস্তার জন্ম সে মেল খাএ ঔর সূর্য জন্ম কী হী রাশি মেং হো', kn: 'ಚನ್ದ್ರ-ಸೂರ್ಯ ವಿಸ್ತಾರ ಜನ್ಮ ಸೇ ಮೇಲ ಖಾಏ ಔರ ಸೂರ್ಯ ಜನ್ಮ ಕೀ ಹೀ ರಾಶಿ ಮೇಂ ಹೋ', gu: 'ચન્દ્ર-સૂર્ય વિસ્તાર જન્મ સે મેલ ખાએ ઔર સૂર્ય જન્મ કી હી રાશિ મેં હો' },
      { en: 'Ascendant matches natal AND Moon in natal nakshatra', hi: 'लग्न जन्म से मेल खाए और चन्द्र जन्म नक्षत्र में हो', sa: 'लग्न जन्म से मेल खाए और चन्द्र जन्म नक्षत्र में हो', mai: 'लग्न जन्म से मेल खाए और चन्द्र जन्म नक्षत्र में हो', mr: 'लग्न जन्म से मेल खाए और चन्द्र जन्म नक्षत्र में हो', ta: 'லக்ந ஜந்ம ஸே மேல खாஎ ஔர சந்த்ர ஜந்ம நக்ஷத்ர மேம் ஹோ', te: 'లగ్న జన్మ సే మేల ఖాఏ ఔర చన్ద్ర జన్మ నక్షత్ర మేం హో', bn: 'লগ্ন জন্ম সে মেল খাএ ঔর চন্দ্র জন্ম নক্ষত্র মেং হো', kn: 'ಲಗ್ನ ಜನ್ಮ ಸೇ ಮೇಲ ಖಾಏ ಔರ ಚನ್ದ್ರ ಜನ್ಮ ನಕ್ಷತ್ರ ಮೇಂ ಹೋ', gu: 'લગ્ન જન્મ સે મેલ ખાએ ઔર ચન્દ્ર જન્મ નક્ષત્ર મેં હો' },
      { en: 'Only the tithi needs to match', hi: 'केवल तिथि का मिलान आवश्यक', sa: 'केवल तिथि का मिलान आवश्यक', mai: 'केवल तिथि का मिलान आवश्यक', mr: 'केवल तिथि का मिलान आवश्यक', ta: 'கேவல திथி கா மிலாந ஆவஶ்யக', te: 'కేవల తిథి కా మిలాన ఆవశ్యక', bn: 'কেবল তিথি কা মিলান আবশ্যক', kn: 'ಕೇವಲ ತಿಥಿ ಕಾ ಮಿಲಾನ ಆವಶ್ಯಕ', gu: 'કેવલ તિથિ કા મિલાન આવશ્યક' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'For a valid Tithi Pravesha, two conditions must be met: (1) the Moon-Sun elongation must equal the natal elongation (same tithi), and (2) the Sun must be within the same zodiacal sign as at birth. This ensures the correct annual recurrence.',
      hi: 'वैध तिथि प्रवेश के लिए दो शर्तें पूरी होनी चाहिए: (1) चन्द्र-सूर्य विस्तार जन्म विस्तार के बराबर हो (वही तिथि), और (2) सूर्य जन्म की ही राशि में हो। यह सही वार्षिक पुनरावृत्ति सुनिश्चित करता है।',
    },
  },
  {
    id: 'q21_4_07', type: 'mcq',
    question: {
      en: 'Which area of life is Tithi Pravesha considered most relevant for?',
      hi: 'तिथि प्रवेश को जीवन के किस क्षेत्र के लिए सर्वाधिक प्रासंगिक माना जाता है?',
    },
    options: [
      { en: 'Career and public life', hi: 'करियर और सार्वजनिक जीवन', sa: 'करियर और सार्वजनिक जीवन', mai: 'करियर और सार्वजनिक जीवन', mr: 'करियर और सार्वजनिक जीवन', ta: 'கரியர ஔர ஸார்வஜநிக ஜீவந', te: 'కరియర ఔర సార్వజనిక జీవన', bn: 'করিযর ঔর সার্বজনিক জীবন', kn: 'ಕರಿಯರ ಔರ ಸಾರ್ವಜನಿಕ ಜೀವನ', gu: 'કરિયર ઔર સાર્વજનિક જીવન' },
      { en: 'Emotional, domestic, and relationship matters', hi: 'भावनात्मक, घरेलू और सम्बन्ध विषय', sa: 'भावनात्मक, घरेलू और सम्बन्ध विषय', mai: 'भावनात्मक, घरेलू और सम्बन्ध विषय', mr: 'भावनात्मक, घरेलू और सम्बन्ध विषय', ta: 'भாவநாத்மக, घரேலூ ஔர ஸம்பந்ध விஷய', te: 'భావనాత్మక, ఘరేలూ ఔర సమ్బన్ధ విషయ', bn: 'ভাবনাত্মক, ঘরেলূ ঔর সম্বন্ধ বিষয', kn: 'ಭಾವನಾತ್ಮಕ, ಘರೇಲೂ ಔರ ಸಮ್ಬನ್ಧ ವಿಷಯ', gu: 'ભાવનાત્મક, ઘરેલૂ ઔર સમ્બન્ધ વિષય' },
      { en: 'Financial investments', hi: 'वित्तीय निवेश', sa: 'वित्तीय निवेश', mai: 'वित्तीय निवेश', mr: 'वित्तीय निवेश', ta: 'வித்தீய நிவேஶ', te: 'విత్తీయ నివేశ', bn: 'বিত্তীয নিবেশ', kn: 'ವಿತ್ತೀಯ ನಿವೇಶ', gu: 'વિત્તીય નિવેશ' },
      { en: 'Health and longevity only', hi: 'केवल स्वास्थ्य और दीर्घायु', sa: 'केवल स्वास्थ्य और दीर्घायु', mai: 'केवल स्वास्थ्य और दीर्घायु', mr: 'केवल स्वास्थ्य और दीर्घायु', ta: 'கேவல ஸ்வாஸ்थ்ய ஔர தீர்घாயு', te: 'కేవల స్వాస్థ్య ఔర దీర్ఘాయు', bn: 'কেবল স্বাস্থ্য ঔর দীর্ঘাযু', kn: 'ಕೇವಲ ಸ್ವಾಸ್ಥ್ಯ ಔರ ದೀರ್ಘಾಯು', gu: 'કેવલ સ્વાસ્થ્ય ઔર દીર્ઘાયુ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Since Tithi Pravesha tracks the Sun-Moon (emotional/lunar) relationship, it is considered most relevant for emotional wellbeing, family dynamics, relationships, and domestic matters. Varshaphal (solar return) is better for career and external matters.',
      hi: 'चूँकि तिथि प्रवेश सूर्य-चन्द्र (भावनात्मक/चान्द्र) सम्बन्ध को ट्रैक करता है, इसे भावनात्मक कल्याण, पारिवारिक गतिशीलता, सम्बन्ध और घरेलू विषयों के लिए सर्वाधिक प्रासंगिक माना जाता है। वर्षफल (सौर प्रत्यावर्तन) करियर और बाह्य विषयों के लिए बेहतर है।',
    },
  },
  {
    id: 'q21_4_08', type: 'true_false',
    question: {
      en: 'Some astrologers use both Varshaphal and Tithi Pravesha for a complete annual picture.',
      hi: 'कुछ ज्योतिषी सम्पूर्ण वार्षिक चित्र के लिए वर्षफल और तिथि प्रवेश दोनों का उपयोग करते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Varshaphal captures the solar/external energy of the year (career, public life), while Tithi Pravesha captures the lunar/internal energy (emotions, family, relationships). Using both gives a more complete annual forecast.',
      hi: 'सत्य। वर्षफल वर्ष की सौर/बाह्य ऊर्जा (करियर, सार्वजनिक जीवन) को पकड़ता है, जबकि तिथि प्रवेश चान्द्र/आन्तरिक ऊर्जा (भावनाएँ, परिवार, सम्बन्ध) को। दोनों का उपयोग अधिक सम्पूर्ण वार्षिक पूर्वानुमान देता है।',
    },
  },
  {
    id: 'q21_4_09', type: 'mcq',
    question: {
      en: 'What elements of the Tithi Pravesha chart are interpreted for the coming year?',
      hi: 'तिथि प्रवेश कुण्डली के किन तत्त्वों की आगामी वर्ष हेतु व्याख्या होती है?',
    },
    options: [
      { en: 'Only the Ascendant sign', hi: 'केवल लग्न राशि', sa: 'केवल लग्न राशि', mai: 'केवल लग्न राशि', mr: 'केवल लग्न राशि', ta: 'கேவல லக்ந ராஶி', te: 'కేవల లగ్న రాశి', bn: 'কেবল লগ্ন রাশি', kn: 'ಕೇವಲ ಲಗ್ನ ರಾಶಿ', gu: 'કેવલ લગ્ન રાશિ' },
      { en: 'Lagna, planetary placements, and dashas', hi: 'लग्न, ग्रह स्थितियाँ, और दशाएँ', sa: 'लग्न, ग्रह स्थितियाँ, और दशाएँ', mai: 'लग्न, ग्रह स्थितियाँ, और दशाएँ', mr: 'लग्न, ग्रह स्थितियाँ, और दशाएँ', ta: 'லக்ந, க்ரஹ ஸ்थிதியாँ, ஔர தஶாஎँ', te: 'లగ్న, గ్రహ స్థితియాఁ, ఔర దశాఏఁ', bn: 'লগ্ন, গ্রহ স্থিতিযাঁ, ঔর দশাএঁ', kn: 'ಲಗ್ನ, ಗ್ರಹ ಸ್ಥಿತಿಯಾಁ, ಔರ ದಶಾಏಁ', gu: 'લગ્ન, ગ્રહ સ્થિતિયાઁ, ઔર દશાએઁ' },
      { en: 'Only the Moon\'s position', hi: 'केवल चन्द्रमा की स्थिति' },
      { en: 'Only Tajika yogas', hi: 'केवल ताजिक योग', sa: 'केवल ताजिक योग', mai: 'केवल ताजिक योग', mr: 'केवल ताजिक योग', ta: 'கேவல தாஜிக யோக', te: 'కేవల తాజిక యోగ', bn: 'কেবল তাজিক যোগ', kn: 'ಕೇವಲ ತಾಜಿಕ ಯೋಗ', gu: 'કેવલ તાજિક યોગ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Tithi Pravesha chart is interpreted like a full birth chart: the lagna determines the year\'s overall theme, planetary placements show house-wise effects, and Mudda Dasha provides monthly timing.',
      hi: 'तिथि प्रवेश कुण्डली की एक पूर्ण जन्म कुण्डली की तरह व्याख्या होती है: लग्न वर्ष की समग्र विषयवस्तु निर्धारित करता है, ग्रह स्थितियाँ भाव-वार प्रभाव दिखाती हैं, और मुद्दा दशा मासिक समय प्रदान करती है।',
    },
  },
  {
    id: 'q21_4_10', type: 'mcq',
    question: {
      en: 'Why might Tithi Pravesha be preferred over Varshaphal for predicting emotional matters?',
      hi: 'भावनात्मक विषयों के फलादेश हेतु वर्षफल से तिथि प्रवेश को क्यों प्राथमिकता दी जा सकती है?',
    },
    options: [
      { en: 'It uses more planets', hi: 'यह अधिक ग्रहों का उपयोग करता है', sa: 'यह अधिक ग्रहों का उपयोग करता है', mai: 'यह अधिक ग्रहों का उपयोग करता है', mr: 'यह अधिक ग्रहों का उपयोग करता है', ta: 'யஹ அधிக க்ரஹோம் கா உபயோக கரதா ஹை', te: 'యహ అధిక గ్రహోం కా ఉపయోగ కరతా హై', bn: 'যহ অধিক গ্রহোং কা উপযোগ করতা হৈ', kn: 'ಯಹ ಅಧಿಕ ಗ್ರಹೋಂ ಕಾ ಉಪಯೋಗ ಕರತಾ ಹೈ', gu: 'યહ અધિક ગ્રહોં કા ઉપયોગ કરતા હૈ' },
      { en: 'It is based on the Sun-Moon relationship which governs emotions and mind', hi: 'यह सूर्य-चन्द्र सम्बन्ध पर आधारित है जो भावनाओं और मन को नियन्त्रित करता है', sa: 'यह सूर्य-चन्द्र सम्बन्ध पर आधारित है जो भावनाओं और मन को नियन्त्रित करता है', mai: 'यह सूर्य-चन्द्र सम्बन्ध पर आधारित है जो भावनाओं और मन को नियन्त्रित करता है', mr: 'यह सूर्य-चन्द्र सम्बन्ध पर आधारित है जो भावनाओं और मन को नियन्त्रित करता है', ta: 'யஹ ஸூர்ய-சந்த்ர ஸம்பந்ध பர ஆधாரித ஹை ஜோ भாவநாஓம் ஔர மந கோ நியந்த்ரித கரதா ஹை', te: 'యహ సూర్య-చన్ద్ర సమ్బన్ధ పర ఆధారిత హై జో భావనాఓం ఔర మన కో నియన్త్రిత కరతా హై', bn: 'যহ সূর্য-চন্দ্র সম্বন্ধ পর আধারিত হৈ জো ভাবনাওং ঔর মন কো নিযন্ত্রিত করতা হৈ', kn: 'ಯಹ ಸೂರ್ಯ-ಚನ್ದ್ರ ಸಮ್ಬನ್ಧ ಪರ ಆಧಾರಿತ ಹೈ ಜೋ ಭಾವನಾಓಂ ಔರ ಮನ ಕೋ ನಿಯನ್ತ್ರಿತ ಕರತಾ ಹೈ', gu: 'યહ સૂર્ય-ચન્દ્ર સમ્બન્ધ પર આધારિત હૈ જો ભાવનાઓં ઔર મન કો નિયન્ત્રિત કરતા હૈ' },
      { en: 'It is always more accurate', hi: 'यह सदैव अधिक सटीक है', sa: 'यह सदैव अधिक सटीक है', mai: 'यह सदैव अधिक सटीक है', mr: 'यह सदैव अधिक सटीक है', ta: 'யஹ ஸதைவ அधிக ஸடீக ஹை', te: 'యహ సదైవ అధిక సటీక హై', bn: 'যহ সদৈব অধিক সটীক হৈ', kn: 'ಯಹ ಸದೈವ ಅಧಿಕ ಸಟೀಕ ಹೈ', gu: 'યહ સદૈવ અધિક સટીક હૈ' },
      { en: 'It was developed more recently', hi: 'इसका विकास अधिक हाल में हुआ', sa: 'इसका विकास अधिक हाल में हुआ', mai: 'इसका विकास अधिक हाल में हुआ', mr: 'इसका विकास अधिक हाल में हुआ', ta: 'இஸகா விகாஸ அधிக ஹால மேம் ஹுஆ', te: 'ఇసకా వికాస అధిక హాల మేం హుఆ', bn: 'ইসকা বিকাস অধিক হাল মেং হুআ', kn: 'ಇಸಕಾ ವಿಕಾಸ ಅಧಿಕ ಹಾಲ ಮೇಂ ಹುಆ', gu: 'ઇસકા વિકાસ અધિક હાલ મેં હુઆ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Moon in Vedic astrology represents the mind (mana) and emotions. Since Tithi Pravesha is based on the Sun-Moon angular relationship, it is inherently tuned to emotional, psychological, and domestic themes — areas where the Moon\'s influence is paramount.',
      hi: 'वैदिक ज्योतिष में चन्द्रमा मन (मनस) और भावनाओं का प्रतिनिधित्व करता है। चूँकि तिथि प्रवेश सूर्य-चन्द्र कोणीय सम्बन्ध पर आधारित है, यह स्वाभाविक रूप से भावनात्मक, मनोवैज्ञानिक और घरेलू विषयों से अनुकूलित है — ऐसे क्षेत्र जहाँ चन्द्रमा का प्रभाव सर्वोपरि है।',
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
          {tl({ en: 'What Is Tithi Pravesha?', hi: 'तिथि प्रवेश क्या है?', sa: 'तिथि प्रवेश क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>तिथि प्रवेश एक वार्षिक कुण्डली है जो उस क्षण के लिए बनाई जाती है जब जन्म का सूर्य-चन्द्र कोणीय सम्बन्ध (जन्म तिथि) प्रत्येक वर्ष पुनरावृत्त होता है। जहाँ वर्षफल (सौर प्रत्यावर्तन) सूर्य के अपने यथार्थ जन्म भोगांश पर लौटने को ट्रैक करता है, वहीं तिथि प्रवेश सूर्य-चन्द्र सम्बन्ध के लौटने को — वही तिथि, उसी सौर मास में। यह हिन्दू परम्परा में गहराई से निहित है जहाँ व्यक्ति का &quot;वास्तविक&quot; जन्मदिन उसकी जन्म तिथि है, ग्रेगोरियन तिथि नहीं।</>
            : <>Tithi Pravesha is an annual chart cast for the moment when the Sun-Moon angular relationship at birth (the natal tithi) recurs each year. While Varshaphal (solar return) tracks the Sun&apos;s return to its exact natal longitude, Tithi Pravesha tracks the return of the Sun-Moon RELATIONSHIP — the same tithi, in the same solar month. This is deeply rooted in Hindu tradition where a person&apos;s &quot;real&quot; birthday is their Janma Tithi (birth tithi), not the Gregorian date.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'For example, if you were born on Shukla Panchami (5th tithi of the bright half) when the Sun was in Taurus, your Tithi Pravesha each year is the moment when the Moon-Sun elongation again reaches the Panchami value (48-60 degrees) while the Sun is in Taurus. This moment may fall a few days before or after your Gregorian birthday.', hi: 'उदाहरणार्थ, यदि आपका जन्म शुक्ल पंचमी (शुक्ल पक्ष की 5वीं तिथि) पर हुआ जब सूर्य वृषभ में था, तो आपका प्रत्येक वर्ष का तिथि प्रवेश वह क्षण है जब चन्द्र-सूर्य विस्तार पुनः पंचमी मान (48-60 अंश) पर पहुँचता है जबकि सूर्य वृषभ में हो। यह क्षण आपके ग्रेगोरियन जन्मदिन से कुछ दिन पहले या बाद में पड़ सकता है।', sa: 'उदाहरणार्थ, यदि आपका जन्म शुक्ल पंचमी (शुक्ल पक्ष की 5वीं तिथि) पर हुआ जब सूर्य वृषभ में था, तो आपका प्रत्येक वर्ष का तिथि प्रवेश वह क्षण है जब चन्द्र-सूर्य विस्तार पुनः पंचमी मान (48-60 अंश) पर पहुँचता है जबकि सूर्य वृषभ में हो। यह क्षण आपके ग्रेगोरियन जन्मदिन से कुछ दिन पहले या बाद में पड़ सकता है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीय उत्पत्ति' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Tithi Pravesha has deep roots in the Vedic tradition of celebrating birthdays by tithi rather than solar date. The Dharmashastra texts prescribe rituals on the Janma Tithi (birth tithi) each year. The astrological application — casting a predictive chart for the TP moment — was championed by Sanjay Rath and other modern Jyotish scholars who argued that the tithi-based return honors the lunar essence of Vedic astrology better than the purely solar Varshaphal. The TP technique draws from both Parashari principles (houses, lordships) and Tajika methodology (annual chart interpretation).', hi: 'तिथि प्रवेश की जड़ें सौर तिथि के बजाय तिथि द्वारा जन्मदिन मनाने की वैदिक परम्परा में गहरी हैं। धर्मशास्त्र ग्रन्थ प्रत्येक वर्ष जन्म तिथि पर अनुष्ठान निर्धारित करते हैं। ज्योतिषीय अनुप्रयोग — TP क्षण के लिए भविष्यवाणी कुण्डली बनाना — संजय रथ और अन्य आधुनिक ज्योतिष विद्वानों द्वारा प्रचारित किया गया जिन्होंने तर्क दिया कि तिथि-आधारित प्रत्यावर्तन विशुद्ध सौर वर्षफल से बेहतर वैदिक ज्योतिष के चान्द्र सार का सम्मान करता है। TP तकनीक पाराशरी सिद्धान्तों (भाव, स्वामित्व) और ताजिक पद्धति (वार्षिक कुण्डली व्याख्या) दोनों से ग्रहण करती है।', sa: 'तिथि प्रवेश की जड़ें सौर तिथि के बजाय तिथि द्वारा जन्मदिन मनाने की वैदिक परम्परा में गहरी हैं। धर्मशास्त्र ग्रन्थ प्रत्येक वर्ष जन्म तिथि पर अनुष्ठान निर्धारित करते हैं। ज्योतिषीय अनुप्रयोग — TP क्षण के लिए भविष्यवाणी कुण्डली बनाना — संजय रथ और अन्य आधुनिक ज्योतिष विद्वानों द्वारा प्रचारित किया गया जिन्होंने तर्क दिया कि तिथि-आधारित प्रत्यावर्तन विशुद्ध सौर वर्षफल से बेहतर वैदिक ज्योतिष के चान्द्र सार का सम्मान करता है। TP तकनीक पाराशरी सिद्धान्तों (भाव, स्वामित्व) और ताजिक पद्धति (वार्षिक कुण्डली व्याख्या) दोनों से ग्रहण करती है।' }, locale)}
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
          {tl({ en: 'Computing Tithi Pravesha', hi: 'तिथि प्रवेश गणना', sa: 'तिथि प्रवेश गणना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>तिथि प्रवेश क्षण की गणना के लिए वह जूलियन दिन (JD) ज्ञात करना आवश्यक है जब दो शर्तें एक साथ पूरी हों: (1) चन्द्र-सूर्य विस्तार (चन्द्र भोगांश घटा सूर्य भोगांश) जन्म विस्तार के बराबर हो, और (2) सूर्य जन्म की ही राशि में हो। पहली शर्त वही तिथि सुनिश्चित करती है; दूसरी सुनिश्चित करती है कि यह सही वार्षिक चक्र में घटे (वर्ष में किसी भी यादृच्छिक समय पर जब तिथि पुनरावृत्त हो, वहाँ नहीं)।</>
            : <>Computing the Tithi Pravesha moment requires finding the Julian Day (JD) when two conditions simultaneously hold: (1) the Moon-Sun elongation (Moon&apos;s longitude minus Sun&apos;s longitude) equals the natal elongation, AND (2) the Sun is within the same zodiacal sign as at birth. The first condition ensures the same tithi; the second ensures it occurs in the correct annual cycle (not at any random time during the year when the tithi recurs).</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Since the tithi recurs roughly every lunar month (~29.5 days), there are about 12-13 occurrences of your birth tithi each year. The Sun-sign condition filters this down to exactly ONE occurrence — the one when the Sun is in the same sign as at your birth. This is your annual Tithi Pravesha moment.', hi: 'चूँकि तिथि लगभग प्रत्येक चान्द्र मास (~29.5 दिन) में पुनरावृत्त होती है, वर्ष में आपकी जन्म तिथि के लगभग 12-13 अवसर होते हैं। सूर्य-राशि शर्त इसे ठीक एक अवसर तक सीमित करती है — वह जब सूर्य जन्म की ही राशि में हो। यह आपका वार्षिक तिथि प्रवेश क्षण है।', sa: 'चूँकि तिथि लगभग प्रत्येक चान्द्र मास (~29.5 दिन) में पुनरावृत्त होती है, वर्ष में आपकी जन्म तिथि के लगभग 12-13 अवसर होते हैं। सूर्य-राशि शर्त इसे ठीक एक अवसर तक सीमित करती है — वह जब सूर्य जन्म की ही राशि में हो। यह आपका वार्षिक तिथि प्रवेश क्षण है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरण कुण्डली' }, locale)} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">15 अप्रैल को जन्म — सूर्य 1 अंश मेष, चन्द्र 55 अंश (25 अंश वृषभ):</span> जन्म विस्तार = 55 - 1 = 54 अंश (शुक्ल पंचमी)। 2026 तिथि प्रवेश के लिए: वह क्षण ज्ञात करें जब (क) चन्द्र - सूर्य = 54 अंश और (ख) सूर्य मेष (0-30 अंश) में हो। सूर्य लगभग 14 अप्रैल को मेष में प्रवेश करता है और लगभग 14 मई को निकलता है। इस खिड़की में 54 अंश का चन्द्र-सूर्य विस्तार एक बार होगा — सम्भवतः 17 अप्रैल प्रातः 3:42 पर। यही TP क्षण है। जातक के स्थान पर उस क्षण की कुण्डली बनाएँ।</>
            : <><span className="text-gold-light font-medium">Born April 15 — Sun at 1 degree Aries, Moon at 55 degrees (25 degrees Taurus):</span> Natal elongation = 55 - 1 = 54 degrees (Shukla Panchami). For the 2026 Tithi Pravesha: find the moment when (a) Moon - Sun = 54 degrees AND (b) Sun is in Aries (0-30 degrees). The Sun enters Aries around April 14 and leaves around May 14. During this window, the Moon-Sun elongation of 54 degrees will occur once — perhaps on April 17 at 3:42 AM. That&apos;s the TP moment. Cast the chart for that moment at the native&apos;s location.</>}
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
          {tl({ en: 'TP vs Varshaphal: Complementary Perspectives', hi: 'TP बनाम वर्षफल: पूरक दृष्टिकोण', sa: 'TP बनाम वर्षफल: पूरक दृष्टिकोण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>वर्षफल सूर्य के प्रत्यावर्तन को — विशुद्ध सौर ऊर्जा को ट्रैक करता है। सूर्य आत्मा, करियर, अधिकार और स्व के बाह्य प्रक्षेपण का प्रतिनिधित्व करता है। अतः वर्षफल करियर परिवर्तन, सार्वजनिक मान्यता, अधिकार परिवर्तन और बाह्य जीवन घटनाओं की भविष्यवाणी में उत्कृष्ट है। तिथि प्रवेश सूर्य-चन्द्र सम्बन्ध — सौर और चान्द्र ऊर्जा की परस्पर क्रिया को ट्रैक करता है। चन्द्रमा मन (मनस), भावनाओं, माता और घरेलू क्षेत्र का प्रतिनिधित्व करता है। अतः TP भावनात्मक कल्याण, पारिवारिक गतिशीलता, सम्बन्ध परिवर्तन, मानसिक स्वास्थ्य और घरेलू विषयों की भविष्यवाणी में उत्कृष्ट है।</>
            : <>Varshaphal tracks the Sun&apos;s return — pure solar energy. The Sun represents the soul (atma), career, authority, and the external projection of self. Therefore, Varshaphal excels at predicting career changes, public recognition, authority shifts, and external life events. Tithi Pravesha tracks the Sun-Moon relationship — the interplay of solar and lunar energy. The Moon represents the mind (mana), emotions, mother, and domestic sphere. Therefore, TP excels at predicting emotional wellbeing, family dynamics, relationship changes, mental health, and domestic matters.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Many modern astrologers use BOTH charts for a comprehensive annual forecast. When both Varshaphal and TP independently point to the same event (e.g., both indicate a change of residence), the prediction confidence is very high. Our engine computes both charts, allowing users to see where the solar and lunar annual perspectives converge and diverge.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;तिथि प्रवेश वर्षफल के समान ही है।&quot; ये मूलभूत रूप से भिन्न हैं। वर्षफल तब बनता है जब सूर्य अपने जन्म अंश पर लौटता है (सौर घटना)। तिथि प्रवेश तब बनता है जब सूर्य-चन्द्र विस्तार अपने जन्म मान पर लौटता है (सौर-चान्द्र घटना)। ये भिन्न तिथियों पर घटते हैं, भिन्न कुण्डलियाँ बनाते हैं, और भिन्न जीवन क्षेत्रों पर बल देते हैं। इन्हें मिलाने से फलादेश गड्डमड्ड होते हैं।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Tithi Pravesha is the same as Varshaphal.&quot; They are fundamentally different. Varshaphal is cast when the Sun returns to its natal degree (a solar event). Tithi Pravesha is cast when the Sun-Moon elongation returns to its natal value (a lunisolar event). They occur on DIFFERENT dates, produce DIFFERENT charts, and emphasize DIFFERENT life areas. Confusing them leads to mixing up predictions.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>तिथि प्रवेश के सटीक क्षण की मैनुअल गणना के लिए पुनरावर्ती गणना आवश्यक है — ज्ञात करना कि चन्द्र-सूर्य विस्तार जन्म मान से कब यथार्थतः मेल खाता है जबकि सूर्य सही राशि में हो। यह गणितीय रूप से गहन है। हमारा इंजन उसी मीयस-आधारित चान्द्र और सौर स्थिति एल्गोरिदम का उपयोग करके स्वचालित रूप से हल करता है जो दैनिक पंचांग को शक्ति प्रदान करता है, TP क्षण को कला-विकला सटीकता तक ज्ञात करता है। उपयोगकर्ताओं को वर्षफल और तिथि प्रवेश दोनों कुण्डलियाँ साथ-साथ मिलती हैं, भाव-दर-भाव तुलना सहित जो दिखाती है कि सौर और चान्द्र वार्षिक दृष्टिकोण कहाँ सहमत हैं — ये अभिसरण बिन्दु वर्ष के सबसे विश्वसनीय फलादेश हैं।</>
            : <>Computing the exact Tithi Pravesha moment manually requires iterative calculation — finding when the Moon-Sun elongation precisely matches the natal value while the Sun is in the correct sign. This is mathematically intensive. Our engine solves this automatically using the same Meeus-based lunar and solar position algorithms that power the daily Panchang, finding the TP moment to arc-second precision. Users get both the Varshaphal and Tithi Pravesha charts side by side, with house-by-house comparison showing where the solar and lunar annual perspectives agree — these convergence points are the year&apos;s most reliable predictions.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module21_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
