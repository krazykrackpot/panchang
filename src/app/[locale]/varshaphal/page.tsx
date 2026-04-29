'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useAuthStore } from '@/stores/auth-store';
import { authedFetch } from '@/lib/api/authed-fetch';
import { parseGateError, type GateError } from '@/lib/api/parse-gate-error';
import UsageLimitBanner from '@/components/ui/UsageLimitBanner';
import { getSupabase } from '@/lib/supabase/client';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import { motion, AnimatePresence } from 'framer-motion';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LocationSearch from '@/components/ui/LocationSearch';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { Locale } from '@/types/panchang';
import type { VarshaphalData } from '@/types/varshaphal';
import type { ChartStyle } from '@/types/kundali';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import TajikaYogaCard from '@/components/varshaphal/TajikaYogaCard';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';

const LABELS = {
  en: {
    title: 'Varshaphal',
    subtitle: 'Tajika Solar Return — Annual Horoscopy',
    desc: 'Cast your annual chart for the exact moment the Sun returns to its natal position. Includes Muntha, Varsheshvara, Sahams, Tajika Yogas, and Mudda Dasha.',
    generate: 'Generate Varshaphal',
    generating: 'Calculating Solar Return...',
    name: 'Name', date: 'Birth Date', time: 'Birth Time', place: 'Place', lat: 'Latitude', lng: 'Longitude', tz: 'Timezone (hrs)', year: 'Year',
    solarReturn: 'Solar Return Moment', muntha: 'Muntha', varsheshvara: 'Year Lord (Varsheshvara)',
    sahams: 'Tajika Sahams', tajikaYogas: 'Tajika Yogas', muddaDasha: 'Mudda Dasha',
    yearSummary: 'Year Summary', chart: 'Annual Chart', sign: 'Sign', house: 'House', degree: 'Degree',
    planet: 'Planet', start: 'Start', end: 'End', days: 'Days', type: 'Type', favorable: 'Favorable',
    north: 'North Indian', south: 'South Indian', age: 'Age',
    monthlyCharts: 'Monthly Charts (Maasaphal)', varsheshaDasha: 'Varshesha Dasha', patyayiniDasha: 'Patyayini Dasha',
    dashaToggle: 'Dasha View', dashaMudda: 'Mudda', dashaVarshesha: 'Varshesha', dashaPatyayini: 'Patyayini',
    relationship: 'Relationship', degreesTraversed: 'Degrees', lagna: 'Lagna',
    loadMonthly: 'Load Monthly Charts', loadingMonthly: 'Computing Monthly Charts...',
    yogas: 'Yogas', monthLabel: 'Month', returnMoment: 'Return Moment',
    noYogas: 'No Tajika yogas',
  },
  hi: {
    title: 'वर्षफल',
    subtitle: 'ताजिक सूर्य प्रत्यावर्तन — वार्षिक ज्योतिष',
    desc: 'सूर्य जब अपनी जन्म स्थिति पर लौटता है उस क्षण की कुण्डली। मुन्था, वर्षेश्वर, सहम, ताजिक योग और मुद्दा दशा सहित।',
    generate: 'वर्षफल बनाएं',
    generating: 'सूर्य प्रत्यावर्तन की गणना...',
    name: 'नाम', date: 'जन्म तिथि', time: 'जन्म समय', place: 'स्थान', lat: 'अक्षांश', lng: 'देशान्तर', tz: 'समयक्षेत्र', year: 'वर्ष',
    solarReturn: 'सूर्य प्रत्यावर्तन क्षण', muntha: 'मुन्था', varsheshvara: 'वर्षेश्वर',
    sahams: 'ताजिक सहम', tajikaYogas: 'ताजिक योग', muddaDasha: 'मुद्दा दशा',
    yearSummary: 'वर्ष सारांश', chart: 'वार्षिक कुण्डली', sign: 'राशि', house: 'भाव', degree: 'अंश',
    planet: 'ग्रह', start: 'आरम्भ', end: 'अन्त', days: 'दिन', type: 'प्रकार', favorable: 'अनुकूल',
    north: 'उत्तर भारतीय', south: 'दक्षिण भारतीय', age: 'आयु',
    monthlyCharts: 'मासिक चार्ट (मासफल)', varsheshaDasha: 'वर्षेशा दशा', patyayiniDasha: 'पत्यायिनी दशा',
    dashaToggle: 'दशा दृश्य', dashaMudda: 'मुद्दा', dashaVarshesha: 'वर्षेशा', dashaPatyayini: 'पत्यायिनी',
    relationship: 'संबंध', degreesTraversed: 'अंश', lagna: 'लग्न',
    loadMonthly: 'मासिक चार्ट लोड करें', loadingMonthly: 'मासिक चार्ट की गणना...',
    yogas: 'योग', monthLabel: 'माह', returnMoment: 'प्रत्यावर्तन क्षण',
    noYogas: 'कोई ताजिक योग नहीं',
  },
  sa: {
    title: 'वर्षफलम्',
    subtitle: 'ताजिकसूर्यप्रत्यावर्तनम् — वार्षिकज्योतिषम्',
    desc: 'सूर्यः यदा स्वजन्मस्थानं प्रत्यावर्तते तदा कुण्डली। मुन्था वर्षेश्वरः सहमाः ताजिकयोगाः मुद्दादशा च।',
    generate: 'वर्षफलं रचयतु',
    generating: 'सूर्यप्रत्यावर्तनगणना...',
    name: 'नाम', date: 'जन्मतिथिः', time: 'जन्मसमयः', place: 'स्थानम्', lat: 'अक्षांशः', lng: 'देशान्तरः', tz: 'समयक्षेत्रम्', year: 'वर्षम्',
    solarReturn: 'सूर्यप्रत्यावर्तनक्षणम्', muntha: 'मुन्था', varsheshvara: 'वर्षेश्वरः',
    sahams: 'ताजिकसहमाः', tajikaYogas: 'ताजिकयोगाः', muddaDasha: 'मुद्दादशा',
    yearSummary: 'वर्षसारांशः', chart: 'वार्षिककुण्डली', sign: 'राशिः', house: 'भावः', degree: 'अंशः',
    planet: 'ग्रहः', start: 'आरम्भः', end: 'अन्तः', days: 'दिनानि', type: 'प्रकारः', favorable: 'अनुकूलः',
    north: 'उत्तरभारतीयम्', south: 'दक्षिणभारतीयम्', age: 'आयुः',
    monthlyCharts: 'मासिकचार्टाः (मासफलम्)', varsheshaDasha: 'वर्षेशादशा', patyayiniDasha: 'पत्यायिनीदशा',
    dashaToggle: 'दशादृश्यम्', dashaMudda: 'मुद्दा', dashaVarshesha: 'वर्षेशा', dashaPatyayini: 'पत्यायिनी',
    relationship: 'सम्बन्धः', degreesTraversed: 'अंशाः', lagna: 'लग्नम्',
    loadMonthly: 'मासिकचार्टान् लोडयतु', loadingMonthly: 'मासिकचार्टगणना...',
    yogas: 'योगाः', monthLabel: 'मासः', returnMoment: 'प्रत्यावर्तनक्षणम्',
    noYogas: 'कोऽपि ताजिकयोगः नास्ति',
  },
  ta: {
    title: 'வர்ஷபலன்',
    subtitle: 'தாஜிக சூரிய வருடாந்திர மீள்வரவு',
    desc: 'Cast your annual chart for the exact moment the Sun returns to its natal position. Includes Muntha, Varsheshvara, Sahams, Tajika Yogas, and Mudda Dasha.',
    generate: 'வர்ஷபலன் உருவாக்கு',
    generating: 'சூரிய மீள்வரவு கணக்கிடுகிறது...',
    name: 'பெயர்', date: 'பிறந்த தேதி', time: 'பிறந்த நேரம்', place: 'இடம்', lat: 'அட்சரேகை', lng: 'தீர்க்கரேகை', tz: 'நேர வலயம்', year: 'வருடம்',
    solarReturn: 'சூரிய மீள்வரவு தருணம்', muntha: 'முந்தா', varsheshvara: 'வர்ஷேஷ்வரர்',
    sahams: 'தாஜிக சஹாம்கள்', tajikaYogas: 'தாஜிக யோகங்கள்', muddaDasha: 'முத்தா தசா',
    yearSummary: 'வருட சுருக்கம்', chart: 'வருடாந்திர குண்டலி', sign: 'ராசி', house: 'பாவம்', degree: 'பாகை',
    planet: 'கிரகம்', start: 'தொடக்கம்', end: 'முடிவு', days: 'நாட்கள்', type: 'வகை', favorable: 'சாதகமான',
    north: 'வட இந்திய', south: 'தென் இந்திய', age: 'வயது',
    monthlyCharts: 'மாதாந்திர படங்கள் (மாசபலன்)', varsheshaDasha: 'வர்ஷேஷ தசா', patyayiniDasha: 'பட்யாயினி தசா',
    dashaToggle: 'தசா காட்சி', dashaMudda: 'முத்தா', dashaVarshesha: 'வர்ஷேஷ', dashaPatyayini: 'பட்யாயினி',
    relationship: 'உறவு', degreesTraversed: 'பாகைகள்', lagna: 'லக்னம்',
    loadMonthly: 'மாதாந்திர படங்களை ஏற்று', loadingMonthly: 'மாதாந்திர படங்கள் கணக்கிடுகிறது...',
    yogas: 'யோகங்கள்', monthLabel: 'மாதம்', returnMoment: 'மீள்வரவு தருணம்',
    noYogas: 'தாஜிக யோகங்கள் இல்லை',
  },
  te: {
    title: 'వర్షఫలం',
    subtitle: 'తాజిక సూర్య ప్రత్యావర్తనం — వార్షిక జ్యోతిషం',
    desc: 'సూర్యుడు తన జన్మ స్థానానికి తిరిగి వచ్చే ఖచ్చితమైన క్షణం కోసం మీ వార్షిక చార్ట్. ముంథా, వర్షేశ్వర, సహాములు, తాజిక యోగాలు మరియు ముద్ద దశ.',
    generate: 'వర్షఫలం రూపొందించు', generating: 'సూర్య ప్రత్యావర్తనం గణించబడుతోంది...',
    name: 'పేరు', date: 'పుట్టిన తేదీ', time: 'పుట్టిన సమయం', place: 'ప్రదేశం', lat: 'అక్షాంశం', lng: 'రేఖాంశం', tz: 'సమయమండలం', year: 'సంవత్సరం',
    solarReturn: 'సూర్య ప్రత్యావర్తన క్షణం', muntha: 'ముంథా', varsheshvara: 'వర్షేశ్వరుడు',
    sahams: 'తాజిక సహాములు', tajikaYogas: 'తాజిక యోగాలు', muddaDasha: 'ముద్ద దశ',
    yearSummary: 'సంవత్సర సారాంశం', chart: 'వార్షిక చార్ట్', sign: 'రాశి', house: 'భావం', degree: 'డిగ్రీ',
    planet: 'గ్రహం', start: 'ప్రారంభం', end: 'ముగింపు', days: 'రోజులు', type: 'రకం', favorable: 'అనుకూలం',
    north: 'ఉత్తర భారతీయ', south: 'దక్షిణ భారతీయ', age: 'వయసు',
    monthlyCharts: 'నెలవారీ చార్టులు (మాసఫలం)', varsheshaDasha: 'వర్షేశా దశ', patyayiniDasha: 'పత్యాయిని దశ',
    dashaToggle: 'దశ వీక్షణ', dashaMudda: 'ముద్ద', dashaVarshesha: 'వర్షేశా', dashaPatyayini: 'పత్యాయిని',
    relationship: 'సంబంధం', degreesTraversed: 'డిగ్రీలు', lagna: 'లగ్నం',
    loadMonthly: 'నెలవారీ చార్టులు లోడ్ చేయి', loadingMonthly: 'నెలవారీ చార్టులు గణించబడుతున్నాయి...',
    yogas: 'యోగాలు', monthLabel: 'నెల', returnMoment: 'వాపసు క్షణం',
    noYogas: 'తాజిక యోగాలు లేవు',
  },
  bn: {
    title: 'বর্ষফল',
    subtitle: 'তাজিক সূর্য প্রত্যাবর্তন — বার্ষিক জ্যোতিষ',
    desc: 'সূর্য যখন তার জন্ম অবস্থানে ফিরে আসে সেই সুনির্দিষ্ট মুহূর্তের চার্ট। মুন্থা, বর্ষেশ্বর, সহম, তাজিক যোগ ও মুদ্দা দশা সহ।',
    generate: 'বর্ষফল তৈরি করুন', generating: 'সূর্য প্রত্যাবর্তন গণনা হচ্ছে...',
    name: 'নাম', date: 'জন্ম তারিখ', time: 'জন্ম সময়', place: 'স্থান', lat: 'অক্ষাংশ', lng: 'দ্রাঘিমাংশ', tz: 'সময় অঞ্চল', year: 'বছর',
    solarReturn: 'সূর্য প্রত্যাবর্তন মুহূর্ত', muntha: 'মুন্থা', varsheshvara: 'বর্ষেশ্বর',
    sahams: 'তাজিক সহম', tajikaYogas: 'তাজিক যোগ', muddaDasha: 'মুদ্দা দশা',
    yearSummary: 'বছরের সারসংক্ষেপ', chart: 'বার্ষিক কুণ্ডলী', sign: 'রাশি', house: 'ভাব', degree: 'ডিগ্রি',
    planet: 'গ্রহ', start: 'শুরু', end: 'শেষ', days: 'দিন', type: 'ধরন', favorable: 'অনুকূল',
    north: 'উত্তর ভারতীয়', south: 'দক্ষিণ ভারতীয়', age: 'বয়স',
    monthlyCharts: 'মাসিক চার্ট (মাসফল)', varsheshaDasha: 'বর্ষেশা দশা', patyayiniDasha: 'পত্যায়িনী দশা',
    dashaToggle: 'দশা দৃশ্য', dashaMudda: 'মুদ্দা', dashaVarshesha: 'বর্ষেশা', dashaPatyayini: 'পত্যায়িনী',
    relationship: 'সম্পর্ক', degreesTraversed: 'ডিগ্রি', lagna: 'লগ্ন',
    loadMonthly: 'মাসিক চার্ট লোড করুন', loadingMonthly: 'মাসিক চার্ট গণনা হচ্ছে...',
    yogas: 'যোগ', monthLabel: 'মাস', returnMoment: 'প্রত্যাবর্তন মুহূর্ত',
    noYogas: 'কোনো তাজিক যোগ নেই',
  },
  kn: {
    title: 'ವರ್ಷಫಲ',
    subtitle: 'ತಾಜಿಕ ಸೂರ್ಯ ಪ್ರತ್ಯಾವರ್ತನ — ವಾರ್ಷಿಕ ಜ್ಯೋತಿಷ',
    desc: 'ಸೂರ್ಯ ತನ್ನ ಜನ್ಮ ಸ್ಥಾನಕ್ಕೆ ಮರಳುವ ನಿಖರ ಕ್ಷಣದ ಚಾರ್ಟ್. ಮುಂಥಾ, ವರ್ಷೇಶ್ವರ, ಸಹಾಮ್‌ಗಳು, ತಾಜಿಕ ಯೋಗಗಳು ಮತ್ತು ಮುದ್ದಾ ದಶೆ.',
    generate: 'ವರ್ಷಫಲ ರಚಿಸಿ', generating: 'ಸೂರ್ಯ ಪ್ರತ್ಯಾವರ್ತನ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತಿದೆ...',
    name: 'ಹೆಸರು', date: 'ಹುಟ್ಟಿದ ದಿನಾಂಕ', time: 'ಹುಟ್ಟಿದ ಸಮಯ', place: 'ಸ್ಥಳ', lat: 'ಅಕ್ಷಾಂಶ', lng: 'ರೇಖಾಂಶ', tz: 'ಸಮಯ ವಲಯ', year: 'ವರ್ಷ',
    solarReturn: 'ಸೂರ್ಯ ಪ್ರತ್ಯಾವರ್ತನ ಕ್ಷಣ', muntha: 'ಮುಂಥಾ', varsheshvara: 'ವರ್ಷೇಶ್ವರ',
    sahams: 'ತಾಜಿಕ ಸಹಾಮ್‌ಗಳು', tajikaYogas: 'ತಾಜಿಕ ಯೋಗಗಳು', muddaDasha: 'ಮುದ್ದಾ ದಶೆ',
    yearSummary: 'ವರ್ಷ ಸಾರಾಂಶ', chart: 'ವಾರ್ಷಿಕ ಜಾತಕ', sign: 'ರಾಶಿ', house: 'ಭಾವ', degree: 'ಡಿಗ್ರಿ',
    planet: 'ಗ್ರಹ', start: 'ಪ್ರಾರಂಭ', end: 'ಅಂತ್ಯ', days: 'ದಿನಗಳು', type: 'ವಿಧ', favorable: 'ಅನುಕೂಲ',
    north: 'ಉತ್ತರ ಭಾರತೀಯ', south: 'ದಕ್ಷಿಣ ಭಾರತೀಯ', age: 'ವಯಸ್ಸು',
    monthlyCharts: 'ಮಾಸಿಕ ಚಾರ್ಟ್‌ಗಳು (ಮಾಸಫಲ)', varsheshaDasha: 'ವರ್ಷೇಶ ದಶೆ', patyayiniDasha: 'ಪತ್ಯಾಯಿನಿ ದಶೆ',
    dashaToggle: 'ದಶೆ ನೋಟ', dashaMudda: 'ಮುದ್ದಾ', dashaVarshesha: 'ವರ್ಷೇಶ', dashaPatyayini: 'ಪತ್ಯಾಯಿನಿ',
    relationship: 'ಸಂಬಂಧ', degreesTraversed: 'ಡಿಗ್ರಿಗಳು', lagna: 'ಲಗ್ನ',
    loadMonthly: 'ಮಾಸಿಕ ಚಾರ್ಟ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಿ', loadingMonthly: 'ಮಾಸಿಕ ಚಾರ್ಟ್‌ಗಳ ಲೆಕ್ಕಾಚಾರ...',
    yogas: 'ಯೋಗಗಳು', monthLabel: 'ತಿಂಗಳು', returnMoment: 'ಪ್ರತ್ಯಾವರ್ತನ ಕ್ಷಣ',
    noYogas: 'ತಾಜಿಕ ಯೋಗಗಳಿಲ್ಲ',
  },
  mr: {
    title: 'वर्षफल', subtitle: 'ताजिक सूर्य प्रत्यावर्तन — वार्षिक ज्योतिष',
    desc: 'सूर्य जेव्हा त्याच्या जन्म स्थानावर परत येतो त्या क्षणाची कुंडली. मुंथा, वर्षेश्वर, सहम, ताजिक योग आणि मुद्दा दशा.',
    generate: 'वर्षफल बनवा', generating: 'सूर्य प्रत्यावर्तन गणना...',
    name: 'नाव', date: 'जन्मतिथी', time: 'जन्म वेळ', place: 'स्थान', lat: 'अक्षांश', lng: 'रेखांश', tz: 'वेळक्षेत्र', year: 'वर्ष',
    solarReturn: 'सूर्य प्रत्यावर्तन क्षण', muntha: 'मुंथा', varsheshvara: 'वर्षेश्वर',
    sahams: 'ताजिक सहम', tajikaYogas: 'ताजिक योग', muddaDasha: 'मुद्दा दशा',
    yearSummary: 'वर्ष सारांश', chart: 'वार्षिक कुंडली', sign: 'राशी', house: 'भाव', degree: 'अंश',
    planet: 'ग्रह', start: 'आरंभ', end: 'अंत', days: 'दिवस', type: 'प्रकार', favorable: 'अनुकूल',
    north: 'उत्तर भारतीय', south: 'दक्षिण भारतीय', age: 'वय',
    monthlyCharts: 'मासिक चार्ट (मासफल)', varsheshaDasha: 'वर्षेशा दशा', patyayiniDasha: 'पत्यायिनी दशा',
    dashaToggle: 'दशा दृश्य', dashaMudda: 'मुद्दा', dashaVarshesha: 'वर्षेशा', dashaPatyayini: 'पत्यायिनी',
    relationship: 'संबंध', degreesTraversed: 'अंश', lagna: 'लग्न',
    loadMonthly: 'मासिक चार्ट लोड करा', loadingMonthly: 'मासिक चार्ट गणना...',
    yogas: 'योग', monthLabel: 'महिना', returnMoment: 'प्रत्यावर्तन क्षण',
    noYogas: 'कोणताही ताजिक योग नाही',
  },
  gu: {
    title: 'વર્ષફળ', subtitle: 'તાજિક સૂર્ય પ્રત્યાવર્તન — વાર્ષિક જ્યોતિષ',
    desc: 'સૂર્ય જ્યારે તેના જન્મ સ્થાને પાછો આવે ત્યારની ચોક્કસ ક્ષણની કુંડળી. મુંથા, વર્ષેશ્વર, સહામ, તાજિક યોગ અને મુદ્દા દશા.',
    generate: 'વર્ષફળ બનાવો', generating: 'સૂર્ય પ્રત્યાવર્તન ગણતરી...',
    name: 'નામ', date: 'જન્મ તારીખ', time: 'જન્મ સમય', place: 'સ્થળ', lat: 'અક્ષાંશ', lng: 'રેખાંશ', tz: 'સમય ક્ષેત્ર', year: 'વર્ષ',
    solarReturn: 'સૂર્ય પ્રત્યાવર્તન ક્ષણ', muntha: 'મુંથા', varsheshvara: 'વર્ષેશ્વર',
    sahams: 'તાજિક સહામ', tajikaYogas: 'તાજિક યોગ', muddaDasha: 'મુદ્દા દશા',
    yearSummary: 'વર્ષ સારાંશ', chart: 'વાર્ષિક કુંડળી', sign: 'રાશિ', house: 'ભાવ', degree: 'અંશ',
    planet: 'ગ્રહ', start: 'શરૂઆત', end: 'અંત', days: 'દિવસ', type: 'પ્રકાર', favorable: 'અનુકૂળ',
    north: 'ઉત્તર ભારતીય', south: 'દક્ષિણ ભારતીય', age: 'ઉંમર',
    monthlyCharts: 'માસિક ચાર્ટ (માસફળ)', varsheshaDasha: 'વર્ષેશા દશા', patyayiniDasha: 'પત્યાયિની દશા',
    dashaToggle: 'દશા દૃશ્ય', dashaMudda: 'મુદ્દા', dashaVarshesha: 'વર્ષેશા', dashaPatyayini: 'પત્યાયિની',
    relationship: 'સંબંધ', degreesTraversed: 'અંશ', lagna: 'લગ્ન',
    loadMonthly: 'માસિક ચાર્ટ લોડ કરો', loadingMonthly: 'માસિક ચાર્ટ ગણતરી...',
    yogas: 'યોગ', monthLabel: 'મહિનો', returnMoment: 'પ્રત્યાવર્તન ક્ષણ',
    noYogas: 'કોઈ તાજિક યોગ નથી',
  },
  mai: {
    title: 'वर्षफल', subtitle: 'ताजिक सूर्य प्रत्यावर्तन — वार्षिक ज्योतिष',
    desc: 'सूर्य जखन अपन जन्म स्थान पर वापस अबैत छथि ओहि क्षणक कुंडली। मुंथा, वर्षेश्वर, सहम, ताजिक योग आ मुद्दा दशा.',
    generate: 'वर्षफल बनाउ', generating: 'सूर्य प्रत्यावर्तन गणना...',
    name: 'नाम', date: 'जन्म तिथि', time: 'जन्म समय', place: 'स्थान', lat: 'अक्षांश', lng: 'देशान्तर', tz: 'समय क्षेत्र', year: 'वर्ष',
    solarReturn: 'सूर्य प्रत्यावर्तन क्षण', muntha: 'मुंथा', varsheshvara: 'वर्षेश्वर',
    sahams: 'ताजिक सहम', tajikaYogas: 'ताजिक योग', muddaDasha: 'मुद्दा दशा',
    yearSummary: 'वर्ष सारांश', chart: 'वार्षिक कुंडली', sign: 'राशि', house: 'भाव', degree: 'अंश',
    planet: 'ग्रह', start: 'आरंभ', end: 'अंत', days: 'दिन', type: 'प्रकार', favorable: 'अनुकूल',
    north: 'उत्तर भारतीय', south: 'दक्षिण भारतीय', age: 'आयु',
    monthlyCharts: 'मासिक चार्ट (मासफल)', varsheshaDasha: 'वर्षेशा दशा', patyayiniDasha: 'पत्यायिनी दशा',
    dashaToggle: 'दशा दृश्य', dashaMudda: 'मुद्दा', dashaVarshesha: 'वर्षेशा', dashaPatyayini: 'पत्यायिनी',
    relationship: 'संबंध', degreesTraversed: 'अंश', lagna: 'लग्न',
    loadMonthly: 'मासिक चार्ट लोड करू', loadingMonthly: 'मासिक चार्ट गणना...',
    yogas: 'योग', monthLabel: 'मास', returnMoment: 'प्रत्यावर्तन क्षण',
    noYogas: 'कोनो ताजिक योग नहि',
  },
};

export default function VarshaphalPage() {
  const locale = useLocale() as Locale;
  const learnLinks = getLearnLinksForTool('/varshaphal');
  const isTamil = String(locale) === 'ta';
  const t = (LABELS as Record<string, typeof LABELS.en>)[locale] || LABELS.en;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const user = useAuthStore(s => s.user);

  const [form, setForm] = useState({ name: '', date: '1990-01-15', time: '08:00', ayanamsha: 'lahiri' as const });
  const [placeName, setPlaceName] = useState('');
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);
  const [placeTimezone, setPlaceTimezone] = useState<string | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<VarshaphalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north');
  const [dashaTab, setDashaTab] = useState<'mudda' | 'varshesha' | 'patyayini'>('mudda');
  const [gateError, setGateError] = useState<GateError | null>(null);

  // Pre-populate form from user profile
  useEffect(() => {
    if (!user) return;
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.from('user_profiles')
      .select('default_location')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data: profile }) => {
        if (profile?.default_location) {
          const loc = typeof profile.default_location === 'string'
            ? JSON.parse(profile.default_location)
            : profile.default_location;
          setForm(prev => ({
            ...prev,
            date: loc.birth_date && prev.date === '1990-01-15' ? loc.birth_date : prev.date,
            time: loc.birth_time && prev.time === '08:00' ? loc.birth_time : prev.time,
          }));
          if (loc.name && !placeName) setPlaceName(loc.name);
          if (loc.lat != null && placeLat === null) setPlaceLat(loc.lat);
          if (loc.lng != null && placeLng === null) setPlaceLng(loc.lng);
          // ALWAYS resolve timezone from coordinates — never trust stored timezone
          if (loc.lat != null && loc.lng != null && !placeTimezone) {
            resolveTimezoneFromCoords(loc.lat, loc.lng).then(tz => setPlaceTimezone(tz));
          }
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async () => {
    if (placeLat === null || placeLng === null) return;
    setLoading(true);
    setGateError(null);

    const [y, m, d] = form.date.split('-').map(Number);
    if (!placeTimezone) return;
    const tz = getUTCOffsetForDate(y, m, d, placeTimezone);
    try {
      setLoadingMonthly(true);
      const res = await authedFetch('/api/varshaphal', {
        method: 'POST',
        body: JSON.stringify({
          birthData: { ...form, place: placeName, lat: placeLat, lng: placeLng, timezone: String(tz), ayanamsha: form.ayanamsha },
          year,
          detail: 'monthly',
        }),
      });
      const gate = await parseGateError(res);
      if (gate) { setGateError(gate); setLoading(false); setLoadingMonthly(false); return; }
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (e) { console.error('[varshaphal] fetch error:', e); }
    finally { setLoading(false); setLoadingMonthly(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t.title}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto" style={bodyFont}>{t.desc}</p>
      </motion.div>

      {/* Varshaphal Intro */}
      <InfoBlock
        id="varshaphal-intro"
        title={tl({ en: 'What is Varshaphal (Annual Horoscope)?', hi: 'वर्षफल क्या है?', sa: 'वर्षफलम् किम्?' }, locale)}
        defaultOpen={false}
      >
        {isDevanagari ? (
          <p>वर्षफल का अर्थ है &apos;वर्ष का फल&apos; — ताजिक पद्धति पर आधारित आपका वार्षिक कुण्डली फल। प्रत्येक वर्ष जब सूर्य अपनी जन्म-स्थिति पर लौटता है, उस ठीक क्षण की कुण्डली बनती है जो आने वाले 12 महीनों के विषय, चुनौतियां और अवसर दर्शाती है। मुख्य घटक: मुन्था (गतिशील भाग्य बिंदु), सहम (जीवन क्षेत्र के संवेदनशील बिंदु), और मुद्दा दशा (वार्षिक ग्रह अवधि)।</p>
        ) : (
          <p>Varshaphal means &apos;fruit of the year&apos; — your annual horoscope based on the Tajika system. A new chart is cast for the exact moment the Sun returns to its birth position each year, revealing themes, challenges, and opportunities for the coming 12 months. Key components: Muntha (progressed luck point), Sahams (sensitive life-area points), and Mudda Dasha (annual planetary periods).</p>
        )}
      </InfoBlock>

      {/* Birth form */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(['name', 'date', 'time'] as const).map(f => (
            <label key={f} className="block">
              <span className="text-text-secondary text-xs uppercase tracking-wider" style={bodyFont}>{t[f]}</span>
              <input type={f === 'date' ? 'date' : f === 'time' ? 'time' : 'text'} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                className="w-full mt-1 bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none" />
            </label>
          ))}
          <label className="block">
            <span className="text-text-secondary text-xs uppercase tracking-wider" style={bodyFont}>{t.place}</span>
            <LocationSearch value={placeName} onSelect={(loc) => { setPlaceName(loc.name); setPlaceLat(loc.lat); setPlaceLng(loc.lng); setPlaceTimezone(loc.timezone); }} placeholder={tl({ en: 'Search birth place...', hi: 'जन्म स्थान खोजें...', sa: 'जन्म स्थान खोजें...' }, locale)} />
          </label>
          <label className="block">
            <span className="text-text-secondary text-xs uppercase tracking-wider">{t.year}</span>
            <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value) || new Date().getFullYear())}
              className="w-full mt-1 bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none" />
          </label>
        </div>
        <div className="text-center mt-6">
          <motion.button onClick={handleSubmit} disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-light text-lg font-bold hover:bg-gold-primary/30 disabled:opacity-50" style={headingFont}>
            {loading ? t.generating : t.generate}
          </motion.button>
        </div>
      </div>

      {gateError && (
        <div className="mt-8">
          <UsageLimitBanner
            type={gateError.type}
            feature={gateError.feature}
            featureName={gateError.featureName}
            requiredTier={gateError.requiredTier}
            limit={gateError.limit}
            message={gateError.message}
            source="varshaphal"
          />
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6 md:space-y-8">
            <GoldDivider />

            {/* Solar Return Moment + Age */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6 text-center">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-2 font-bold">{t.solarReturn}</h2>
              <p className="text-gold-light text-2xl font-bold" style={headingFont}>{new Date(data.solarReturnMoment).toLocaleString(tl({ en: 'en-IN', hi: 'hi-IN', sa: 'en-IN' }, locale))}</p>
              <p className="text-text-secondary mt-2">{t.age}: <span className="text-gold-light font-bold">{data.age}</span></p>
            </div>

            {/* Chart */}
            <div className="flex justify-center gap-4 mb-2">
              <button onClick={() => setChartStyle('north')} className={`px-5 py-2 rounded-lg text-sm ${chartStyle === 'north' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary'}`}>{t.north}</button>
              <button onClick={() => setChartStyle('south')} className={`px-5 py-2 rounded-lg text-sm ${chartStyle === 'south' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary'}`}>{t.south}</button>
            </div>
            <div className="flex justify-center">
              {chartStyle === 'north'
                ? <ChartNorth data={data.chart.chart} title={`${t.chart} ${data.year}`} size={460} />
                : <ChartSouth data={data.chart.chart} title={`${t.chart} ${data.year}`} size={460} />}
            </div>

            {/* Muntha */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-bold">{t.muntha}</h2>
              <div className="flex items-center gap-4">
                <RashiIconById id={data.muntha.sign} size={40} />
                <div>
                  <p className="text-gold-light font-bold text-lg" style={bodyFont}>{tl(data.muntha.signName, locale)} — {t.house} {data.muntha.house}</p>
                  <p className="text-text-secondary text-sm mt-1" style={bodyFont}>{tl(data.muntha.interpretation, locale)}</p>
                </div>
              </div>
            </div>

            {/* Varsheshvara */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-bold">{t.varsheshvara}</h2>
              <div className="flex items-center gap-4">
                <GrahaIconById id={data.varsheshvara.planetId} size={40} />
                <div>
                  <p className="text-gold-light font-bold text-lg" style={bodyFont}>{tl(data.varsheshvara.planetName, locale)}</p>
                  <p className="text-text-secondary text-sm mt-1" style={bodyFont}>{tl(data.varsheshvara.description, locale)}</p>
                </div>
              </div>
            </div>

            {/* Sahams Table */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6 overflow-x-auto">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.sahams}</h2>
              <table className="w-full text-sm">
                <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                  <th className="text-left py-2 px-2" style={bodyFont}>{t.planet}</th>
                  <th className="text-left py-2 px-2">{t.degree}</th>
                  <th className="text-left py-2 px-2" style={bodyFont}>{t.sign}</th>
                  <th className="text-left py-2 px-2">{t.house}</th>
                </tr></thead>
                <tbody>{data.sahams.map((s, i) => (
                  <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                    <td className="py-2 px-2 text-gold-light font-medium" style={bodyFont}>{tl(s.name, locale)}</td>
                    <td className="py-2 px-2 text-text-secondary font-mono">{s.degree.toFixed(2)}°</td>
                    <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{tl(s.signName, locale)}</td>
                    <td className="py-2 px-2 text-text-secondary">{s.house}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            {/* Tajika Yogas — Enhanced 16-yoga display */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gold-primary text-sm uppercase tracking-wider font-bold">{t.tajikaYogas}</h2>
                {data.tajikaYogas.length > 0 && (
                  <span className="text-xs text-text-secondary bg-gold-primary/10 px-2 py-0.5 rounded-full">
                    {data.tajikaYogas.length} {tl({ en: 'yogas', hi: 'योग', sa: 'योगाः' }, locale)}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                {data.tajikaYogas.map((y, i) => (
                  <TajikaYogaCard key={`${y.type}-${i}`} yoga={y} locale={locale} index={i} />
                ))}
                {data.tajikaYogas.length === 0 && (
                  <p className="text-text-secondary text-sm" style={bodyFont}>
                    {tl({ en: 'No significant Tajika yogas found.', hi: 'कोई महत्वपूर्ण ताजिक योग नहीं मिला।', sa: 'कोई महत्वपूर्ण ताजिक योग नहीं मिला।' }, locale)}
                  </p>
                )}
              </div>
            </div>

            {/* Dasha Section — toggling between Mudda, Varshesha, Patyayini */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6 overflow-x-auto">
              {/* Tab switcher */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-gold-primary text-sm uppercase tracking-wider font-bold">{t.dashaToggle}</h2>
                <div className="flex gap-1 text-xs">
                  {(['mudda', 'varshesha', 'patyayini'] as const).map(tab => (
                    <button key={tab} onClick={() => setDashaTab(tab)}
                      className={`px-3 py-1.5 rounded-lg border transition-colors ${dashaTab === tab ? 'bg-gold-primary/20 border-gold-primary/40 text-gold-light font-bold' : 'border-gold-primary/10 text-text-secondary hover:border-gold-primary/25'}`}>
                      {tab === 'mudda' ? t.dashaMudda : tab === 'varshesha' ? t.dashaVarshesha : t.dashaPatyayini}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mudda Dasha */}
              {dashaTab === 'mudda' && (
                <>
                  <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
                    {data.muddaDasha.map((d, i) => (
                      <div key={i} className="flex-shrink-0 rounded-lg p-2 bg-gold-primary/10 border border-gold-primary/15 text-center min-w-[70px]">
                        <GrahaIconById id={['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'].indexOf(d.planet) === -1 ? 0 : [8,5,0,1,2,7,4,6,3][['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'].indexOf(d.planet)]} size={22} />
                        <p className="text-gold-light text-xs font-bold mt-1" style={bodyFont}>{tl(d.planetName, locale)}</p>
                        <p className="text-text-secondary text-xs">{d.durationDays}d</p>
                      </div>
                    ))}
                  </div>
                  <table className="w-full text-sm">
                    <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                      <th className="text-left py-2 px-2" style={bodyFont}>{t.planet}</th>
                      <th className="text-left py-2 px-2">{t.start}</th>
                      <th className="text-left py-2 px-2">{t.end}</th>
                      <th className="text-left py-2 px-2">{t.days}</th>
                    </tr></thead>
                    <tbody>{data.muddaDasha.map((d, i) => (
                      <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                        <td className="py-2 px-2 text-gold-light font-medium" style={bodyFont}>{tl(d.planetName, locale)}</td>
                        <td className="py-2 px-2 text-text-secondary font-mono text-xs">{d.startDate}</td>
                        <td className="py-2 px-2 text-text-secondary font-mono text-xs">{d.endDate}</td>
                        <td className="py-2 px-2 text-text-secondary">{d.durationDays}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </>
              )}

              {/* Varshesha Dasha */}
              {dashaTab === 'varshesha' && data.varsheshaDasha && (
                <table className="w-full text-sm">
                  <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                    <th className="text-left py-2 px-2" style={bodyFont}>{t.planet}</th>
                    <th className="text-left py-2 px-2">{t.relationship}</th>
                    <th className="text-left py-2 px-2">{t.start}</th>
                    <th className="text-left py-2 px-2">{t.end}</th>
                    <th className="text-left py-2 px-2">{t.days}</th>
                  </tr></thead>
                  <tbody>{data.varsheshaDasha.map((d, i) => (
                    <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                      <td className="py-2 px-2 text-gold-light font-medium" style={bodyFont}>{tl(d.planetName, locale)}</td>
                      <td className="py-2 px-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          d.relationship === 'self' ? 'bg-gold-primary/20 border-gold-primary/30 text-gold-light' :
                          d.relationship === 'friend' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                          d.relationship === 'enemy' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                          'bg-white/[0.06] border-white/10 text-text-secondary'
                        }`}>{d.relationship}</span>
                      </td>
                      <td className="py-2 px-2 text-text-secondary font-mono text-xs">{d.startDate}</td>
                      <td className="py-2 px-2 text-text-secondary font-mono text-xs">{d.endDate}</td>
                      <td className="py-2 px-2 text-text-secondary">{d.days}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}

              {/* Patyayini Dasha */}
              {dashaTab === 'patyayini' && data.patyayiniDasha && (
                <table className="w-full text-sm">
                  <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                    <th className="text-left py-2 px-2" style={bodyFont}>{t.planet}</th>
                    <th className="text-left py-2 px-2">{t.degreesTraversed}</th>
                    <th className="text-left py-2 px-2">{t.start}</th>
                    <th className="text-left py-2 px-2">{t.end}</th>
                    <th className="text-left py-2 px-2">{t.days}</th>
                  </tr></thead>
                  <tbody>{data.patyayiniDasha.map((d, i) => (
                    <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                      <td className="py-2 px-2 text-gold-light font-medium" style={bodyFont}>{tl(d.planetName, locale)}</td>
                      <td className="py-2 px-2 text-text-secondary font-mono text-xs">{d.degreesTraversed}°</td>
                      <td className="py-2 px-2 text-text-secondary font-mono text-xs">{d.startDate}</td>
                      <td className="py-2 px-2 text-text-secondary font-mono text-xs">{d.endDate}</td>
                      <td className="py-2 px-2 text-text-secondary">{d.days}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>

            {/* Monthly Charts (Maasaphal) */}
            {(data.maasaphal || loadingMonthly) && (
              <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6">
                <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.monthlyCharts}</h2>
                {loadingMonthly && (
                  <p className="text-text-secondary text-sm animate-pulse">{t.loadingMonthly}</p>
                )}
                {data.maasaphal && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {data.maasaphal.map((mc) => (
                      <div key={mc.month} className="rounded-xl bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] border border-gold-primary/15 p-3 hover:border-gold-primary/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gold-primary text-xs font-bold uppercase">{t.monthLabel} {mc.month}</span>
                          <RashiIconById id={mc.lagnaSign} size={20} />
                        </div>
                        <p className="text-gold-light text-xs font-medium mb-1">{mc.returnDate}</p>
                        <p className="text-text-secondary text-xs mb-2">{mc.returnTime} UTC</p>
                        {mc.tajikYogas.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {mc.tajikYogas.slice(0, 3).map((yg, yi) => (
                              <span key={yi} className="text-xs bg-gold-primary/10 border border-gold-primary/20 text-gold-light px-1.5 py-0.5 rounded-full">{yg}</span>
                            ))}
                            {mc.tajikYogas.length > 3 && (
                              <span className="text-xs text-text-secondary">+{mc.tajikYogas.length - 3}</span>
                            )}
                          </div>
                        ) : (
                          <p className="text-text-secondary text-xs">{t.noYogas}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Year Summary */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-bold">{t.yearSummary}</h2>
              <p className="text-text-secondary leading-relaxed" style={bodyFont}>{tl(data.yearSummary, locale)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RelatedLinks type="learn" links={learnLinks} locale={locale} />
    </div>
  );
}
