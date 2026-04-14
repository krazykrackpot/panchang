'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_SYLLABLES } from '@/lib/constants/nakshatra-syllables';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import RashiNakshatraWheel from '@/components/learn/RashiNakshatraWheel';
import NakshatraDashaSpiral from '@/components/learn/NakshatraDashaSpiral';
import { NAKSHATRA_ICONS } from '@/components/icons/NakshatraIcons';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/nakshatras.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;

/** Format decimal degrees as D°M' (e.g. 13.333 → "13°20'") */
function fmtDeg(d: number): string {
  const deg = Math.floor(d);
  const min = Math.round((d - deg) * 60);
  return min === 0 ? `${deg}°` : `${deg}°${min}'`;
}



const NAKSHATRA_GROUPS = [
  { name: { en: 'Deva (Divine)', hi: 'देव (दैवी)', sa: 'देव (दैवी)', mai: 'देव (दैवी)', mr: 'देव (दैवी)', ta: 'தேவ (தெய்வீக)', te: 'దేవ (దైవీయ)', bn: 'দেব (দৈব)', kn: 'ದೇವ (ದೈವೀಯ)', gu: 'દેવ (દૈવી)' }, nakshatras: 'Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, Revati', count: 9 },
  { name: { en: 'Manushya (Human)', hi: 'मनुष्य (मानवी)', sa: 'मनुष्य (मानवी)', mai: 'मनुष्य (मानवी)', mr: 'मनुष्य (मानवी)', ta: 'மனுஷ்ய (மனிதன்)', te: 'మనుష్య (మానవ)', bn: 'মনুষ্য (মানব)', kn: 'ಮನುಷ್ಯ (ಮಾನವ)', gu: 'મનુષ્ય (માનવ)' }, nakshatras: 'Bharani, Rohini, Ardra, P.Phalguni, U.Phalguni, P.Ashadha, U.Ashadha, P.Bhadra, U.Bhadra', count: 9 },
  { name: { en: 'Rakshasa (Fierce)', hi: 'राक्षस (आसुरी)', sa: 'राक्षस (आसुरी)', mai: 'राक्षस (आसुरी)', mr: 'राक्षस (आसुरी)', ta: 'ராக்ஷஸ (கடூரம்)', te: 'రాక్షస (భయంకరం)', bn: 'রাক্ষস (ভয়ঙ্কর)', kn: 'ರಾಕ್ಷಸ (ಭಯಂಕರ)', gu: 'રાક્ષસ (ભયંકર)' }, nakshatras: 'Krittika, Ashlesha, Magha, Chitra, Vishakha, Jyeshtha, Moola, Dhanishta, Shatabhisha', count: 9 },
];

const DASHA_LORDS = [
  { planet: 'Ketu', hi: 'केतु', years: 7, nakshatras: [1, 10, 19], color: '#9ca3af' },
  { planet: 'Venus', hi: 'शुक्र', years: 20, nakshatras: [2, 11, 20], color: '#ec4899' },
  { planet: 'Sun', hi: 'सूर्य', years: 6, nakshatras: [3, 12, 21], color: '#f59e0b' },
  { planet: 'Moon', hi: 'चन्द्र', years: 10, nakshatras: [4, 13, 22], color: '#e2e8f0' },
  { planet: 'Mars', hi: 'मंगल', years: 7, nakshatras: [5, 14, 23], color: '#ef4444' },
  { planet: 'Rahu', hi: 'राहु', years: 18, nakshatras: [6, 15, 24], color: '#6366f1' },
  { planet: 'Jupiter', hi: 'गुरु', years: 16, nakshatras: [7, 16, 25], color: '#f0d48a' },
  { planet: 'Saturn', hi: 'शनि', years: 19, nakshatras: [8, 17, 26], color: '#3b82f6' },
  { planet: 'Mercury', hi: 'बुध', years: 17, nakshatras: [9, 18, 27], color: '#22c55e' },
];

const NAKSHATRA_CATEGORIES = [
  { name: { en: 'Dhruva (Fixed)', hi: 'ध्रुव (स्थिर)', sa: 'ध्रुव (स्थिर)', mai: 'ध्रुव (स्थिर)', mr: 'ध्रुव (स्थिर)', ta: 'த்ருவ (ஸ்திர)', te: 'ధ్రువ (స్థిర)', bn: 'ধ্রুব (স্থির)', kn: 'ಧ್ರುವ (ಸ್ಥಿರ)', gu: 'ધ્રુવ (સ્થિર)' }, color: '#3b82f6', desc: { en: 'Foundation laying, temples, permanent structures, planting trees', hi: 'नींव रखना, मन्दिर, स्थायी संरचनाएँ, वृक्षारोपण', sa: 'नींव रखना, मन्दिर, स्थायी संरचनाएँ, वृक्षारोपण', mai: 'नींव रखना, मन्दिर, स्थायी संरचनाएँ, वृक्षारोपण', mr: 'नींव रखना, मन्दिर, स्थायी संरचनाएँ, वृक्षारोपण', ta: 'அடிக்கல் நாட்டுதல், கோயில்கள், நிரந்தர கட்டமைப்புகள், மரம் நடுதல்', te: 'పునాది వేయడం, దేవాలయాలు, శాశ్వత నిర్మాణాలు, చెట్లు నాటడం', bn: 'ভিত্তিপ্রস্তর স্থাপন, মন্দির, স্থায়ী কাঠামো, বৃক্ষরোপণ', kn: 'ಅಡಿಗಲ್ಲು ಹಾಕುವಿಕೆ, ದೇವಾಲಯಗಳು, ಶಾಶ್ವತ ರಚನೆಗಳು, ಮರ ನೆಡುವಿಕೆ', gu: 'પાયો નાખવો, મંદિરો, કાયમી બાંધકામો, વૃક્ષારોપણ' }, nakshatras: 'Rohini, U.Phalguni, U.Ashadha, U.Bhadrapada' },
  { name: { en: 'Chara (Movable)', hi: 'चर (गतिशील)', sa: 'चर (गतिशील)', mai: 'चर (गतिशील)', mr: 'चर (गतिशील)', ta: 'சர (சலனம்)', te: 'చర (చలనం)', bn: 'চর (চলনশীল)', kn: 'ಚರ (ಚಲನಶೀಲ)', gu: 'ચર (ચલનશીલ)' }, color: '#22c55e', desc: { en: 'Travel, vehicle purchase, moving house, beginning journeys', hi: 'यात्रा, वाहन खरीद, गृह-प्रवेश, यात्रा प्रारम्भ', sa: 'यात्रा, वाहन खरीद, गृह-प्रवेश, यात्रा प्रारम्भ', mai: 'यात्रा, वाहन खरीद, गृह-प्रवेश, यात्रा प्रारम्भ', mr: 'यात्रा, वाहन खरीद, गृह-प्रवेश, यात्रा प्रारम्भ', ta: 'பயணம், வாகனம் வாங்குதல், வீடு மாற்றம், பயணங்களைத் தொடங்குதல்', te: 'ప్రయాణం, వాహనం కొనుగోలు, ఇల్లు మారడం, ప్రయాణాలు ప్రారంభించడం', bn: 'ভ্রমণ, যানবাহন ক্রয়, বাসস্থান পরিবর্তন, যাত্রা শুরু', kn: 'ಪ್ರಯಾಣ, ವಾಹನ ಖರೀದಿ, ಮನೆ ಬದಲಾವಣೆ, ಪ್ರಯಾಣ ಪ್ರಾರಂಭ', gu: 'પ્રવાસ, વાહન ખરીદી, ઘર બદલવું, યાત્રા શરૂ કરવી' }, nakshatras: 'Punarvasu, Swati, Shravana, Dhanishta, Shatabhisha' },
  { name: { en: 'Ugra (Fierce)', hi: 'उग्र (प्रचण्ड)', sa: 'उग्र (प्रचण्ड)', mai: 'उग्र (प्रचण्ड)', mr: 'उग्र (प्रचण्ड)', ta: 'உக்ர (கடுமை)', te: 'ఉగ్ర (భయంకరం)', bn: 'উগ্র (ভয়ঙ্কর)', kn: 'ಉಗ್ರ (ಭಯಂಕರ)', gu: 'ઉગ્ર (ભયંકર)' }, color: '#ef4444', desc: { en: 'Battles, surgery, demolition, confrontation, fire rituals', hi: 'युद्ध, शल्यचिकित्सा, ध्वंस, सामना, अग्नि अनुष्ठान', sa: 'युद्ध, शल्यचिकित्सा, ध्वंस, सामना, अग्नि अनुष्ठान', mai: 'युद्ध, शल्यचिकित्सा, ध्वंस, सामना, अग्नि अनुष्ठान', mr: 'युद्ध, शल्यचिकित्सा, ध्वंस, सामना, अग्नि अनुष्ठान', ta: 'போர்கள், அறுவை சிகிச்சை, இடிப்பு, மோதல், அக்னி சடங்குகள்', te: 'యుద్ధాలు, శస్త్రచికిత్స, కూల్చివేత, ఘర్షణ, అగ్ని కర్మలు', bn: 'যুদ্ধ, অস্ত্রোপচার, ভেঙে ফেলা, সংঘর্ষ, অগ্নি অনুষ্ঠান', kn: 'ಯುದ್ಧಗಳು, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಧ್ವಂಸ, ಮುಖಾಮುಖಿ, ಅಗ್ನಿ ಆಚರಣೆ', gu: 'યુદ્ધો, શસ્ત્રક્રિયા, તોડફોડ, સામનો, અગ્નિ વિધિ' }, nakshatras: 'Bharani, Magha, P.Phalguni, P.Ashadha, P.Bhadrapada' },
  { name: { en: 'Kshipra/Laghu (Swift/Light)', hi: 'क्षिप्र/लघु (शीघ्र)', sa: 'क्षिप्र/लघु (शीघ्र)', mai: 'क्षिप्र/लघु (शीघ्र)', mr: 'क्षिप्र/लघु (शीघ्र)', ta: 'க்ஷிப்ர/லகு (விரைவு/லேசு)', te: 'క్షిప్ర/లఘు (శీఘ్ర/తేలిక)', bn: 'ক্ষিপ্র/লঘু (দ্রুত/হালকা)', kn: 'ಕ್ಷಿಪ್ರ/ಲಘು (ಶೀಘ್ರ/ಹಗುರ)', gu: 'ક્ષિપ્ર/લઘુ (શીઘ્ર/હલકું)' }, color: '#f0d48a', desc: { en: 'Sports, trade, learning, medicine, quick tasks, travel', hi: 'खेल, व्यापार, अध्ययन, चिकित्सा, त्वरित कार्य', sa: 'खेल, व्यापार, अध्ययन, चिकित्सा, त्वरित कार्य', mai: 'खेल, व्यापार, अध्ययन, चिकित्सा, त्वरित कार्य', mr: 'खेल, व्यापार, अध्ययन, चिकित्सा, त्वरित कार्य', ta: 'விளையாட்டு, வணிகம், கற்றல், மருத்துவம், விரைவான பணிகள், பயணம்', te: 'క్రీడలు, వర్తకం, అధ్యయనం, వైద్యం, త్వరిత పనులు, ప్రయాణం', bn: 'খেলাধুলা, ব্যবসা, শিক্ষা, চিকিৎসা, দ্রুত কাজ, ভ্রমণ', kn: 'ಕ್ರೀಡೆ, ವ್ಯಾಪಾರ, ಕಲಿಕೆ, ಔಷಧ, ತ್ವರಿತ ಕಾರ್ಯ, ಪ್ರಯಾಣ', gu: 'રમત, વેપાર, શિક્ષણ, ચિકિત્સા, ઝડપી કાર્ય, પ્રવાસ' }, nakshatras: 'Ashwini, Pushya, Hasta' },
  { name: { en: 'Mridu (Gentle)', hi: 'मृदु (कोमल)', sa: 'मृदु (कोमल)', mai: 'मृदु (कोमल)', mr: 'मृदु (कोमल)', ta: 'ம்ருது (மென்மை)', te: 'మృదు (మృదువు)', bn: 'মৃদু (কোমল)', kn: 'ಮೃದು (ಮೃದು)', gu: 'મૃદુ (કોમળ)' }, color: '#a78bfa', desc: { en: 'Music, art, romance, friendship, wearing new clothes, celebrations', hi: 'संगीत, कला, प्रेम, मित्रता, नये वस्त्र, उत्सव', sa: 'संगीत, कला, प्रेम, मित्रता, नये वस्त्र, उत्सव', mai: 'संगीत, कला, प्रेम, मित्रता, नये वस्त्र, उत्सव', mr: 'संगीत, कला, प्रेम, मित्रता, नये वस्त्र, उत्सव', ta: 'இசை, கலை, காதல், நட்பு, புதிய ஆடை அணிதல், கொண்டாட்டங்கள்', te: 'సంగీతం, కళ, ప్రణయం, స్నేహం, కొత్త బట్టలు ధరించడం, వేడుకలు', bn: 'সংগীত, শিল্প, প্রণয়, বন্ধুত্ব, নতুন পোশাক পরিধান, উৎসব', kn: 'ಸಂಗೀತ, ಕಲೆ, ಪ್ರಣಯ, ಸ್ನೇಹ, ಹೊಸ ಬಟ್ಟೆ ಧರಿಸುವಿಕೆ, ಆಚರಣೆ', gu: 'સંગીત, કળા, પ્રેમ, મિત્રતા, નવા વસ્ત્રો પહેરવા, ઉજવણી' }, nakshatras: 'Mrigashira, Chitra, Anuradha, Revati' },
  { name: { en: 'Tikshna/Daruna (Sharp)', hi: 'तीक्ष्ण/दारुण (तीव्र)', sa: 'तीक्ष्ण/दारुण (तीव्र)', mai: 'तीक्ष्ण/दारुण (तीव्र)', mr: 'तीक्ष्ण/दारुण (तीव्र)', ta: 'தீக்ஷ்ண/தாருண (கூர்மை)', te: 'తీక్ష్ణ/దారుణ (పదునైన)', bn: 'তীক্ষ্ণ/দারুণ (তীব্র)', kn: 'ತೀಕ್ಷ್ಣ/ದಾರುಣ (ತೀಕ್ಷ್ಣ)', gu: 'તીક્ષ્ણ/દારુણ (તીવ્ર)' }, color: '#f97316', desc: { en: 'Tantra, incantation, poisoning enemies, invoking spirits, black magic', hi: 'तन्त्र, मन्त्र, शत्रु-नाश, आत्मा-आवाहन', sa: 'तन्त्र, मन्त्र, शत्रु-नाश, आत्मा-आवाहन', mai: 'तन्त्र, मन्त्र, शत्रु-नाश, आत्मा-आवाहन', mr: 'तन्त्र, मन्त्र, शत्रु-नाश, आत्मा-आवाहन', ta: 'தந்திரம், மந்திரம், எதிரிகளை விஷமிடுதல், ஆவிகளை அழைத்தல், கருமை சூனியம்', te: 'తంత్రం, మంత్రం, శత్రువులను విషప్రయోగం, ఆత్మలను ఆవాహన, నల్లమంత్రం', bn: 'তন্ত্র, মন্ত্র, শত্রুদের বিষ প্রয়োগ, আত্মা আহ্বান, কালো জাদু', kn: 'ತಂತ್ರ, ಮಂತ್ರ, ಶತ್ರುಗಳಿಗೆ ವಿಷಪ್ರಯೋಗ, ಆತ್ಮಗಳ ಆವಾಹನೆ, ಕಪ್ಪು ಮಾಟ', gu: 'તંત્ર, મંત્ર, શત્રુઓને ઝેર આપવું, આત્માઓને બોલાવવી, કાળી જાદુ' }, nakshatras: 'Ardra, Ashlesha, Jyeshtha, Moola' },
  { name: { en: 'Mishra (Mixed)', hi: 'मिश्र (मिश्रित)', sa: 'मिश्र (मिश्रित)', mai: 'मिश्र (मिश्रित)', mr: 'मिश्र (मिश्रित)', ta: 'மிஸ்ர (கலப்பு)', te: 'మిశ్ర (మిశ్రమం)', bn: 'মিশ্র (মিশ্রিত)', kn: 'ಮಿಶ್ರ (ಮಿಶ್ರ)', gu: 'મિશ્ર (મિશ્રિત)' }, color: '#64748b', desc: { en: 'Day-to-day activities, routine work, worship, charity', hi: 'दैनिक गतिविधियाँ, नियमित कार्य, पूजा, दान', sa: 'दैनिक गतिविधियाँ, नियमित कार्य, पूजा, दान', mai: 'दैनिक गतिविधियाँ, नियमित कार्य, पूजा, दान', mr: 'दैनिक गतिविधियाँ, नियमित कार्य, पूजा, दान', ta: 'அன்றாட நடவடிக்கைகள், வழக்கமான வேலை, வழிபாடு, தர்மம்', te: 'రోజువారీ కార్యకలాపాలు, సాధారణ పని, పూజ, దానం', bn: 'দৈনন্দিন কাজকর্ম, নিত্য কাজ, পূজা, দান', kn: 'ದೈನಂದಿನ ಚಟುವಟಿಕೆಗಳು, ಸಾಮಾನ್ಯ ಕೆಲಸ, ಪೂಜೆ, ದಾನ', gu: 'રોજિંદી પ્રવૃત્તિઓ, નિયમિત કાર્ય, પૂજા, દાન' }, nakshatras: 'Krittika, Vishakha' },
];

const TARA_NAMES = [
  { num: 1, name: { en: 'Janma (Birth)', hi: 'जन्म', sa: 'जन्म', mai: 'जन्म', mr: 'जन्म', ta: 'ஜன்ம (பிறப்பு)', te: 'జన్మ (జన్మ)', bn: 'জন্ম (জন্ম)', kn: 'ಜನ್ಮ (ಜನ್ಮ)', gu: 'જન્મ (જન્મ)' }, effect: { en: 'Moderate -- needs care. Physical health sensitive.', hi: 'मध्यम -- सावधानी। शारीरिक स्वास्थ्य संवेदनशील।', sa: 'मध्यम -- सावधानी। शारीरिक स्वास्थ्य संवेदनशील।', mai: 'मध्यम -- सावधानी। शारीरिक स्वास्थ्य संवेदनशील।', mr: 'मध्यम -- सावधानी। शारीरिक स्वास्थ्य संवेदनशील।', ta: 'மிதமான -- கவனம் தேவை. உடல் நலம் உணர்வுள்ளது.', te: 'మధ్యస్థం -- జాగ్రత్త అవసరం. శారీరక ఆరోగ్యం సున్నితం.', bn: 'মাঝারি -- সতর্কতা প্রয়োজন। শারীরিক স্বাস্থ্য সংবেদনশীল।', kn: 'ಮಧ್ಯಮ -- ಜಾಗ್ರತೆ ಬೇಕು. ದೈಹಿಕ ಆರೋಗ್ಯ ಸೂಕ್ಷ್ಮ.', gu: 'મધ્યમ -- કાળજી જરૂરી. શારીરિક સ્વાસ્થ્ય સંવેદનશીલ.' }, good: false },
  { num: 2, name: { en: 'Sampat (Wealth)', hi: 'सम्पत्', sa: 'सम्पत्', mai: 'सम्पत्', mr: 'सम्पत्', ta: 'சம்பத் (செல்வம்)', te: 'సంపత్ (సంపద)', bn: 'সম্পৎ (সম্পদ)', kn: 'ಸಂಪತ್ (ಸಂಪತ್ತು)', gu: 'સંપત (સંપત્તિ)' }, effect: { en: 'Favorable. Financial gains, prosperity.', hi: 'शुभ। वित्तीय लाभ, समृद्धि।', sa: 'शुभ। वित्तीय लाभ, समृद्धि।', mai: 'शुभ। वित्तीय लाभ, समृद्धि।', mr: 'शुभ। वित्तीय लाभ, समृद्धि।', ta: 'சாதகமான. நிதி ஆதாயம், செழிப்பு.', te: 'అనుకూలం. ఆర్థిక లాభాలు, సమృద్ధి.', bn: 'অনুকূল। আর্থিক লাভ, সমৃদ্ধি।', kn: 'ಅನುಕೂಲ. ಆರ್ಥಿಕ ಲಾಭ, ಸಮೃದ್ಧಿ.', gu: 'અનુકૂળ. આર્થિક લાભ, સમૃદ્ધિ.' }, good: true },
  { num: 3, name: { en: 'Vipat (Danger)', hi: 'विपत्', sa: 'विपत्', mai: 'विपत्', mr: 'विपत्', ta: 'விபத் (ஆபத்து)', te: 'విపత్ (ప్రమాదం)', bn: 'বিপৎ (বিপদ)', kn: 'ವಿಪತ್ (ಅಪಾಯ)', gu: 'વિપત (ખતરો)' }, effect: { en: 'Unfavorable. Obstacles, losses.', hi: 'अशुभ। बाधाएँ, हानि।', sa: 'अशुभ। बाधाएँ, हानि।', mai: 'अशुभ। बाधाएँ, हानि।', mr: 'अशुभ। बाधाएँ, हानि।', ta: 'பாதகமான. தடைகள், இழப்புகள்.', te: 'ప్రతికూలం. అడ్డంకులు, నష్టాలు.', bn: 'প্রতিকূল। বাধা, ক্ষতি।', kn: 'ಪ್ರತಿಕೂಲ. ಅಡ್ಡಿಗಳು, ನಷ್ಟಗಳು.', gu: 'પ્રતિકૂળ. અવરોધો, નુકસાન.' }, good: false },
  { num: 4, name: { en: 'Kshema (Well-being)', hi: 'क्षेम', sa: 'क्षेम', mai: 'क्षेम', mr: 'क्षेम', ta: 'க்ஷேம (நலம்)', te: 'క్షేమ (శుభం)', bn: 'ক্ষেম (মঙ্গল)', kn: 'ಕ್ಷೇಮ (ಶುಭ)', gu: 'ક્ષેમ (કલ્યાણ)' }, effect: { en: 'Favorable. Safety, peace, comfort.', hi: 'शुभ। सुरक्षा, शान्ति, सुख।', sa: 'शुभ। सुरक्षा, शान्ति, सुख।', mai: 'शुभ। सुरक्षा, शान्ति, सुख।', mr: 'शुभ। सुरक्षा, शान्ति, सुख।', ta: 'சாதகமான. பாதுகாப்பு, அமைதி, ஆறுதல்.', te: 'అనుకూలం. భద్రత, శాంతి, సౌకర్యం.', bn: 'অনুকূল। নিরাপত্তা, শান্তি, স্বাচ্ছন্দ্য।', kn: 'ಅನುಕೂಲ. ಸುರಕ್ಷತೆ, ಶಾಂತಿ, ಆರಾಮ.', gu: 'અનુકૂળ. સલામતી, શાંતિ, આરામ.' }, good: true },
  { num: 5, name: { en: 'Pratyari (Obstacle)', hi: 'प्रत्यरि', sa: 'प्रत्यरि', mai: 'प्रत्यरि', mr: 'प्रत्यरि', ta: 'பிரத்யரி (தடை)', te: 'ప్రత్యరి (అడ్డంకి)', bn: 'প্রত্যারি (বাধা)', kn: 'ಪ್ರತ್ಯರಿ (ಅಡ್ಡಿ)', gu: 'પ્રત્યારિ (અવરોધ)' }, effect: { en: 'Unfavorable. Opposition, enemies.', hi: 'अशुभ। विरोध, शत्रुता।', sa: 'अशुभ। विरोध, शत्रुता।', mai: 'अशुभ। विरोध, शत्रुता।', mr: 'अशुभ। विरोध, शत्रुता।', ta: 'பாதகமான. எதிர்ப்பு, பகைவர்.', te: 'ప్రతికూలం. వ్యతిరేకత, శత్రువులు.', bn: 'প্রতিকূল। বিরোধিতা, শত্রু।', kn: 'ಪ್ರತಿಕೂಲ. ವಿರೋಧ, ಶತ್ರುಗಳು.', gu: 'પ્રતિકૂળ. વિરોધ, શત્રુઓ.' }, good: false },
  { num: 6, name: { en: 'Sadhaka (Achievement)', hi: 'साधक', sa: 'साधक', mai: 'साधक', mr: 'साधक', ta: 'சாதக (சாதனை)', te: 'సాధక (సాధన)', bn: 'সাধক (সাফল্য)', kn: 'ಸಾಧಕ (ಸಾಧನೆ)', gu: 'સાધક (સિદ્ધિ)' }, effect: { en: 'Favorable. Accomplishment, success.', hi: 'शुभ। उपलब्धि, सफलता।', sa: 'शुभ। उपलब्धि, सफलता।', mai: 'शुभ। उपलब्धि, सफलता।', mr: 'शुभ। उपलब्धि, सफलता।', ta: 'சாதகமான. சாதனை, வெற்றி.', te: 'అనుకూలం. సాధన, విజయం.', bn: 'অনুকূল। অর্জন, সাফল্য।', kn: 'ಅನುಕೂಲ. ಸಾಧನೆ, ಯಶಸ್ಸು.', gu: 'અનુકૂળ. સિદ્ધિ, સફળતા.' }, good: true },
  { num: 7, name: { en: 'Vadha (Death)', hi: 'वध', sa: 'वध', mai: 'वध', mr: 'वध', ta: 'வத (மரணம்)', te: 'వధ (మరణం)', bn: 'বধ (মৃত্যু)', kn: 'ವಧ (ಮೃತ್ಯು)', gu: 'વધ (મૃત્યુ)' }, effect: { en: 'Unfavorable. Conflict, harm.', hi: 'अशुभ। संघर्ष, हानि।', sa: 'अशुभ। संघर्ष, हानि।', mai: 'अशुभ। संघर्ष, हानि।', mr: 'अशुभ। संघर्ष, हानि।', ta: 'பாதகமான. மோதல், தீங்கு.', te: 'ప్రతికూలం. సంఘర్షణ, హాని.', bn: 'প্রতিকূল। সংঘাত, ক্ষতি।', kn: 'ಪ್ರತಿಕೂಲ. ಸಂಘರ್ಷ, ಹಾನಿ.', gu: 'પ્રતિકૂળ. સંઘર્ષ, નુકસાન.' }, good: false },
  { num: 8, name: { en: 'Mitra (Friend)', hi: 'मित्र', sa: 'मित्र', mai: 'मित्र', mr: 'मित्र', ta: 'மித்ர (நண்பன்)', te: 'మిత్ర (మిత్రుడు)', bn: 'মিত্র (বন্ধু)', kn: 'ಮಿತ್ರ (ಮಿತ್ರ)', gu: 'મિત્ર (મિત્ર)' }, effect: { en: 'Favorable. Friendships, alliances.', hi: 'शुभ। मित्रता, सहयोग।', sa: 'शुभ। मित्रता, सहयोग।', mai: 'शुभ। मित्रता, सहयोग।', mr: 'शुभ। मित्रता, सहयोग।', ta: 'சாதகமான. நட்புகள், கூட்டணிகள்.', te: 'అనుకూలం. స్నేహాలు, పొత్తులు.', bn: 'অনুকূল। বন্ধুত্ব, জোট।', kn: 'ಅನುಕೂಲ. ಸ್ನೇಹ, ಮೈತ್ರಿ.', gu: 'અનુકૂળ. મિત્રતા, ગઠબંધન.' }, good: true },
  { num: 9, name: { en: 'Atimitra (Great friend)', hi: 'अतिमित्र', sa: 'अतिमित्र', mai: 'अतिमित्र', mr: 'अतिमित्र', ta: 'அதிமித்ர (மிக நல்ல நண்பன்)', te: 'అతిమిత్ర (గొప్ప మిత్రుడు)', bn: 'অতিমিত্র (মহামিত্র)', kn: 'ಅತಿಮಿತ್ರ (ಮಹಾ ಮಿತ್ರ)', gu: 'અતિમિત્ર (મહામિત્ર)' }, effect: { en: 'Very favorable. Deep support, blessings.', hi: 'अत्यन्त शुभ। गहन सहयोग, आशीर्वाद।', sa: 'अत्यन्त शुभ। गहन सहयोग, आशीर्वाद।', mai: 'अत्यन्त शुभ। गहन सहयोग, आशीर्वाद।', mr: 'अत्यन्त शुभ। गहन सहयोग, आशीर्वाद।', ta: 'மிகவும் சாதகமான. ஆழமான ஆதரவு, ஆசீர்வாதங்கள்.', te: 'చాలా అనుకూలం. లోతైన మద్దతు, ఆశీర్వాదాలు.', bn: 'অত্যন্ত অনুকূল। গভীর সহায়তা, আশীর্বাদ।', kn: 'ಅತ್ಯಂತ ಅನುಕೂಲ. ಆಳವಾದ ಬೆಂಬಲ, ಆಶೀರ್ವಾದ.', gu: 'ખૂબ અનુકૂળ. ઊંડો ટેકો, આશીર્વાદ.' }, good: true },
];

const MATCHING_KUTAS = [
  { name: { en: 'Yoni Kuta (4 pts)', hi: 'योनि कूट (4 अंक)', sa: 'योनि कूट (4 अंक)', mai: 'योनि कूट (4 अंक)', mr: 'योनि कूट (4 अंक)', ta: 'யோனி கூடம் (4 புள்ளிகள்)', te: 'యోని కూటం (4 పాయింట్లు)', bn: 'যোনি কূট (৪ পয়েন্ট)', kn: 'ಯೋನಿ ಕೂಟ (4 ಅಂಕ)', gu: 'યોની કૂટ (4 પોઈન્ટ)' }, desc: { en: 'Each Nakshatra is mapped to an animal (Yoni): Horse, Elephant, Sheep, Serpent, Dog, Cat, Rat, Cow, Buffalo, Tiger, Deer, Monkey, Mongoose, Lion. Same Yoni = 4 pts. Enemy Yonis (e.g., Cat-Rat, Snake-Mongoose) = 0 pts. This assesses physical and sexual compatibility.', hi: 'प्रत्येक नक्षत्र एक पशु (योनि) से मेल खाता है: अश्व, गज, मेष, सर्प, श्वान, मार्जार, मूषक, गौ, महिष, व्याघ्र, मृग, वानर, नकुल, सिंह। समान योनि = 4 अंक। शत्रु योनियाँ = 0 अंक। यह शारीरिक अनुकूलता का मूल्यांकन करता है।', sa: 'प्रत्येक नक्षत्र एक पशु (योनि) से मेल खाता है: अश्व, गज, मेष, सर्प, श्वान, मार्जार, मूषक, गौ, महिष, व्याघ्र, मृग, वानर, नकुल, सिंह। समान योनि = 4 अंक। शत्रु योनियाँ = 0 अंक। यह शारीरिक अनुकूलता का मूल्यांकन करता है।', mai: 'प्रत्येक नक्षत्र एक पशु (योनि) से मेल खाता है: अश्व, गज, मेष, सर्प, श्वान, मार्जार, मूषक, गौ, महिष, व्याघ्र, मृग, वानर, नकुल, सिंह। समान योनि = 4 अंक। शत्रु योनियाँ = 0 अंक। यह शारीरिक अनुकूलता का मूल्यांकन करता है।', mr: 'प्रत्येक नक्षत्र एक पशु (योनि) से मेल खाता है: अश्व, गज, मेष, सर्प, श्वान, मार्जार, मूषक, गौ, महिष, व्याघ्र, मृग, वानर, नकुल, सिंह। समान योनि = 4 अंक। शत्रु योनियाँ = 0 अंक। यह शारीरिक अनुकूलता का मूल्यांकन करता है।', ta: 'ஒவ்வொரு நட்சத்திரமும் ஒரு விலங்குடன் (யோனி) தொடர்புடையது: குதிரை, யானை, ஆடு, பாம்பு, நாய், பூனை, எலி, பசு, எருமை, புலி, மான், குரங்கு, கீரி, சிங்கம். ஒரே யோனி = 4 புள்ளிகள். எதிரி யோனிகள் (எ.கா., பூனை-எலி, பாம்பு-கீரி) = 0 புள்ளிகள். இது உடல் மற்றும் பாலியல் இணக்கத்தை மதிப்பிடுகிறது.', te: 'ప్రతి నక్షత్రం ఒక జంతువుతో (యోని) అనుసంధానించబడింది: గుర్రం, ఏనుగు, గొర్రె, సర్పం, కుక్క, పిల్లి, ఎలుక, ఆవు, గేదె, పులి, జింక, కోతి, ముంగిస, సింహం. ఒకే యోని = 4 పాయింట్లు. శత్రు యోనులు (ఉదా., పిల్లి-ఎలుక, పాము-ముంగిస) = 0 పాయింట్లు. ఇది శారీరక మరియు లైంగిక అనుకూలతను అంచనా వేస్తుంది.', bn: 'প্রতিটি নক্ষত্র একটি প্রাণীর (যোনি) সাথে সম্পর্কিত: ঘোড়া, হাতি, ভেড়া, সর্প, কুকুর, বিড়াল, ইঁদুর, গরু, মহিষ, বাঘ, হরিণ, বানর, নেউল, সিংহ। একই যোনি = ৪ পয়েন্ট। শত্রু যোনি (যেমন, বিড়াল-ইঁদুর, সাপ-নেউল) = ০ পয়েন্ট। এটি শারীরিক ও যৌন সামঞ্জস্য মূল্যায়ন করে।', kn: 'ಪ್ರತಿ ನಕ್ಷತ್ರವು ಒಂದು ಪ್ರಾಣಿಗೆ (ಯೋನಿ) ನಕ್ಷೆ ಮಾಡಲಾಗಿದೆ: ಕುದುರೆ, ಆನೆ, ಕುರಿ, ಸರ್ಪ, ನಾಯಿ, ಬೆಕ್ಕು, ಇಲಿ, ಹಸು, ಎಮ್ಮೆ, ಹುಲಿ, ಜಿಂಕೆ, ಕೋತಿ, ಮುಂಗುಸಿ, ಸಿಂಹ. ಅದೇ ಯೋನಿ = 4 ಅಂಕ. ಶತ್ರು ಯೋನಿಗಳು (ಉದಾ., ಬೆಕ್ಕು-ಇಲಿ, ಹಾವು-ಮುಂಗುಸಿ) = 0 ಅಂಕ. ಇದು ದೈಹಿಕ ಮತ್ತು ಲೈಂಗಿಕ ಹೊಂದಾಣಿಕೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ.', gu: 'દરેક નક્ષત્ર એક પ્રાણી (યોનિ) સાથે જોડાયેલું છે: ઘોડો, હાથી, ઘેટું, સર્પ, કૂતરો, બિલાડી, ઉંદર, ગાય, ભેંસ, વાઘ, હરણ, વાનર, નોળિયો, સિંહ. સમાન યોનિ = 4 ગુણ. શત્રુ યોનિઓ (દા.ત., બિલાડી-ઉંદર, સાપ-નોળિયો) = 0 ગુણ. આ શારીરિક અને જાતીય સુસંગતતાનું મૂલ્યાંકન કરે છે.' } },
  { name: { en: 'Gana Kuta (6 pts)', hi: 'गण कूट (6 अंक)', sa: 'गण कूट (6 अंक)', mai: 'गण कूट (6 अंक)', mr: 'गण कूट (6 अंक)', ta: 'கண கூடம் (6 புள்ளிகள்)', te: 'గణ కూటం (6 పాయింట్లు)', bn: 'গণ কূট (৬ পয়েন্ট)', kn: 'ಗಣ ಕೂಟ (6 ಅಂಕ)', gu: 'ગણ કૂટ (6 પોઈન્ટ)' }, desc: { en: 'Deva-Deva = 6, Manushya-Manushya = 6, Rakshasa-Rakshasa = 6. Deva-Manushya = 5. Deva-Rakshasa = 0. Manushya-Rakshasa = 1. Assesses temperamental and social compatibility.', hi: 'देव-देव = 6, मनुष्य-मनुष्य = 6, राक्षस-राक्षस = 6। देव-मनुष्य = 5। देव-राक्षस = 0। मनुष्य-राक्षस = 1। स्वभाव और सामाजिक अनुकूलता का मूल्यांकन करता है।', sa: 'देव-देव = 6, मनुष्य-मनुष्य = 6, राक्षस-राक्षस = 6। देव-मनुष्य = 5। देव-राक्षस = 0। मनुष्य-राक्षस = 1। स्वभाव और सामाजिक अनुकूलता का मूल्यांकन करता है।', mai: 'देव-देव = 6, मनुष्य-मनुष्य = 6, राक्षस-राक्षस = 6। देव-मनुष्य = 5। देव-राक्षस = 0। मनुष्य-राक्षस = 1। स्वभाव और सामाजिक अनुकूलता का मूल्यांकन करता है।', mr: 'देव-देव = 6, मनुष्य-मनुष्य = 6, राक्षस-राक्षस = 6। देव-मनुष्य = 5। देव-राक्षस = 0। मनुष्य-राक्षस = 1। स्वभाव और सामाजिक अनुकूलता का मूल्यांकन करता है।', ta: 'தேவ-தேவ = 6, மனுஷ்ய-மனுஷ்ய = 6, ராக்ஷஸ-ராக்ஷஸ = 6. தேவ-மனுஷ்ய = 5. தேவ-ராக்ஷஸ = 0. மனுஷ்ய-ராக்ஷஸ = 1. குண மற்றும் சமூக இணக்கத்தை மதிப்பிடுகிறது.', te: 'దేవ-దేవ = 6, మనుష్య-మనుష్య = 6, రాక్షస-రాక్షస = 6. దేవ-మనుష్య = 5. దేవ-రాక్షస = 0. మనుష్య-రాక్షస = 1. స్వభావ మరియు సామాజిక అనుకూలతను అంచనా వేస్తుంది.', bn: 'দেব-দেব = ৬, মনুষ্য-মনুষ্য = ৬, রাক্ষস-রাক্ষস = ৬। দেব-মনুষ্য = ৫। দেব-রাক্ষস = ০। মনুষ্য-রাক্ষস = ১। স্বভাবগত ও সামাজিক সামঞ্জস্য মূল্যায়ন করে।', kn: 'ದೇವ-ದೇವ = 6, ಮನುಷ್ಯ-ಮನುಷ್ಯ = 6, ರಾಕ್ಷಸ-ರಾಕ್ಷಸ = 6. ದೇವ-ಮನುಷ್ಯ = 5. ದೇವ-ರಾಕ್ಷಸ = 0. ಮನುಷ್ಯ-ರಾಕ್ಷಸ = 1. ಸ್ವಭಾವ ಮತ್ತು ಸಾಮಾಜಿಕ ಹೊಂದಾಣಿಕೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ.', gu: 'દેવ-દેવ = 6, મનુષ્ય-મનુષ્ય = 6, રાક્ષસ-રાક્ષસ = 6. દેવ-મનુષ્ય = 5. દેવ-રાક્ષસ = 0. મનુષ્ય-રાક્ષસ = 1. સ્વભાવગત અને સામાજિક સુસંગતતાનું મૂલ્યાંકન કરે છે.' } },
  { name: { en: 'Nadi Kuta (8 pts)', hi: 'नाडी कूट (8 अंक)', sa: 'नाडी कूट (8 अंक)', mai: 'नाडी कूट (8 अंक)', mr: 'नाडी कूट (8 अंक)', ta: 'நாடி கூடம் (8 புள்ளிகள்)', te: 'నాడి కూటం (8 పాయింట్లు)', bn: 'নাড়ী কূট (৮ পয়েন্ট)', kn: 'ನಾಡಿ ಕೂಟ (8 ಅಂಕ)', gu: 'નાડી કૂટ (8 પોઈન્ટ)' }, desc: { en: 'The highest-weighted factor. Each Nakshatra belongs to one of 3 Nadis: Aadi (Vata), Madhya (Pitta), Antya (Kapha). Same Nadi = 0 (Nadi Dosha -- risk to progeny). Different Nadi = 8. This is the only factor with a binary outcome: full points or zero.', hi: 'सबसे अधिक भार वाला कारक। प्रत्येक नक्षत्र 3 नाडियों में से एक का है: आदि (वात), मध्य (पित्त), अन्त्य (कफ)। समान नाडी = 0 (नाडी दोष)। भिन्न नाडी = 8।', sa: 'सबसे अधिक भार वाला कारक। प्रत्येक नक्षत्र 3 नाडियों में से एक का है: आदि (वात), मध्य (पित्त), अन्त्य (कफ)। समान नाडी = 0 (नाडी दोष)। भिन्न नाडी = 8।', mai: 'सबसे अधिक भार वाला कारक। प्रत्येक नक्षत्र 3 नाडियों में से एक का है: आदि (वात), मध्य (पित्त), अन्त्य (कफ)। समान नाडी = 0 (नाडी दोष)। भिन्न नाडी = 8।', mr: 'सबसे अधिक भार वाला कारक। प्रत्येक नक्षत्र 3 नाडियों में से एक का है: आदि (वात), मध्य (पित्त), अन्त्य (कफ)। समान नाडी = 0 (नाडी दोष)। भिन्न नाडी = 8।', ta: 'அதிக எடை கொண்ட காரணி. ஒவ்வொரு நட்சத்திரமும் 3 நாடிகளில் ஒன்றைச் சேர்ந்தது: ஆதி (வாத), மத்ய (பித்த), அந்த்ய (கப). ஒரே நாடி = 0 (நாடி தோஷம் -- சந்ததிக்கு ஆபத்து). வேறு நாடி = 8. இது முழு புள்ளிகள் அல்லது பூஜ்ஜியம் என்ற இரு முடிவுள்ள ஒரே காரணி.', te: 'అత్యధిక బరువు కలిగిన అంశం. ప్రతి నక్షత్రం 3 నాడులలో ఒకదానికి చెందినది: ఆది (వాత), మధ్య (పిత్త), అంత్య (కఫ). ఒకే నాడి = 0 (నాడి దోషం -- సంతానానికి ప్రమాదం). వేరే నాడి = 8. ఇది పూర్తి పాయింట్లు లేదా సున్నా అనే ద్విపథ ఫలితం ఉన్న ఏకైక అంశం.', bn: 'সর্বোচ্চ ওজনের কারণ। প্রতিটি নক্ষত্র ৩টি নাড়ির একটিতে পড়ে: আদি (বাত), মধ্য (পিত্ত), অন্ত্য (কফ)। একই নাড়ি = ০ (নাড়ি দোষ -- সন্তানের ঝুঁকি)। ভিন্ন নাড়ি = ৮। এটিই একমাত্র কারণ যার দ্বৈত ফলাফল: পূর্ণ পয়েন্ট বা শূন্য।', kn: 'ಅತ್ಯಧಿಕ ತೂಕದ ಅಂಶ. ಪ್ರತಿ ನಕ್ಷತ್ರವು 3 ನಾಡಿಗಳಲ್ಲಿ ಒಂದಕ್ಕೆ ಸೇರಿದೆ: ಆದಿ (ವಾತ), ಮಧ್ಯ (ಪಿತ್ತ), ಅಂತ್ಯ (ಕಫ). ಅದೇ ನಾಡಿ = 0 (ನಾಡಿ ದೋಷ -- ಸಂತಾನಕ್ಕೆ ಅಪಾಯ). ಬೇರೆ ನಾಡಿ = 8. ಇದು ಪೂರ್ಣ ಅಂಕ ಅಥವಾ ಶೂನ್ಯ ಎಂಬ ದ್ವಿಮುಖ ಫಲಿತಾಂಶ ಹೊಂದಿರುವ ಏಕೈಕ ಅಂಶ.', gu: 'સૌથી વધુ ભારિત પરિબળ. દરેક નક્ષત્ર 3 નાડીઓમાંથી એકનું છે: આદિ (વાત), મધ્ય (પિત્ત), અંત્ય (કફ). સમાન નાડી = 0 (નાડી દોષ -- સંતાનને જોખમ). અલગ નાડી = 8. આ એકમાત્ર પરિબળ છે જેનું દ્વિમાર્ગી પરિણામ: પૂર્ણ ગુણ અથવા શૂન્ય.' } },
];

const YOGATARAS: { id: number; star: string; starHi: string; designation: string; constellation: string; constellationHi: string; magnitude: number }[] = [
  { id: 1, star: 'Mesarthim', starHi: 'मेसार्थिम', designation: 'β Arietis', constellation: 'Aries', constellationHi: 'मेष', magnitude: 2.64 },
  { id: 2, star: 'Bharani (35 Ari)', starHi: 'भरणी', designation: '35 Arietis', constellation: 'Aries', constellationHi: 'मेष', magnitude: 4.66 },
  { id: 3, star: 'Alcyone', starHi: 'अलसीओनी', designation: 'η Tauri', constellation: 'Taurus (Pleiades)', constellationHi: 'वृषभ (कृत्तिका)', magnitude: 2.87 },
  { id: 4, star: 'Aldebaran', starHi: 'रोहिणी / अल्डेबरन', designation: 'α Tauri', constellation: 'Taurus', constellationHi: 'वृषभ', magnitude: 0.85 },
  { id: 5, star: 'Meissa', starHi: 'मेइस्सा', designation: 'λ Orionis', constellation: 'Orion', constellationHi: 'मृगशीर्ष', magnitude: 3.54 },
  { id: 6, star: 'Betelgeuse', starHi: 'आर्द्रा / बेटेलज्यूज़', designation: 'α Orionis', constellation: 'Orion', constellationHi: 'मृगशीर्ष', magnitude: 0.42 },
  { id: 7, star: 'Pollux', starHi: 'पुनर्वसु / पॉलक्स', designation: 'β Geminorum', constellation: 'Gemini', constellationHi: 'मिथुन', magnitude: 1.14 },
  { id: 8, star: 'Asellus Australis', starHi: 'असेलस ऑस्ट्रेलिस', designation: 'δ Cancri', constellation: 'Cancer', constellationHi: 'कर्क', magnitude: 3.94 },
  { id: 9, star: 'Hydrae (ε Hya)', starHi: 'आश्लेषा', designation: 'ε Hydrae', constellation: 'Hydra', constellationHi: 'आश्लेषा', magnitude: 3.38 },
  { id: 10, star: 'Regulus', starHi: 'मघा / रेग्युलस', designation: 'α Leonis', constellation: 'Leo', constellationHi: 'सिंह', magnitude: 1.35 },
  { id: 11, star: 'Zosma', starHi: 'ज़ोस्मा', designation: 'δ Leonis', constellation: 'Leo', constellationHi: 'सिंह', magnitude: 2.56 },
  { id: 12, star: 'Denebola', starHi: 'डेनेबोला', designation: 'β Leonis', constellation: 'Leo', constellationHi: 'सिंह', magnitude: 2.13 },
  { id: 13, star: 'Savitar (δ Crv)', starHi: 'हस्त', designation: 'δ Corvi', constellation: 'Corvus', constellationHi: 'काक', magnitude: 2.95 },
  { id: 14, star: 'Spica', starHi: 'चित्रा / स्पाइका', designation: 'α Virginis', constellation: 'Virgo', constellationHi: 'कन्या', magnitude: 0.97 },
  { id: 15, star: 'Arcturus', starHi: 'स्वाती / आर्कटुरस', designation: 'α Boötis', constellation: 'Boötes', constellationHi: 'गोपालक', magnitude: -0.05 },
  { id: 16, star: 'Zubenelgenubi', starHi: 'ज़ूबेनेल्गेनूबी', designation: 'α Librae', constellation: 'Libra', constellationHi: 'तुला', magnitude: 2.75 },
  { id: 17, star: 'Anuradha (δ Sco)', starHi: 'अनुराधा', designation: 'δ Scorpii', constellation: 'Scorpius', constellationHi: 'वृश्चिक', magnitude: 2.32 },
  { id: 18, star: 'Antares', starHi: 'ज्येष्ठा / एन्टेरीज़', designation: 'α Scorpii', constellation: 'Scorpius', constellationHi: 'वृश्चिक', magnitude: 1.09 },
  { id: 19, star: 'Kaus Media', starHi: 'कौस मीडिया', designation: 'δ Sagittarii', constellation: 'Sagittarius', constellationHi: 'धनु', magnitude: 2.70 },
  { id: 20, star: 'Kaus Australis', starHi: 'कौस ऑस्ट्रेलिस', designation: 'ε Sagittarii', constellation: 'Sagittarius', constellationHi: 'धनु', magnitude: 1.85 },
  { id: 21, star: 'Nunki', starHi: 'नुन्की', designation: 'σ Sagittarii', constellation: 'Sagittarius', constellationHi: 'धनु', magnitude: 2.05 },
  { id: 22, star: 'Altair', starHi: 'श्रवण / अल्टेयर', designation: 'α Aquilae', constellation: 'Aquila', constellationHi: 'गरुड', magnitude: 0.76 },
  { id: 23, star: 'Sualocin', starHi: 'सुआलोसिन', designation: 'β Delphini', constellation: 'Delphinus', constellationHi: 'शिशुमार', magnitude: 3.63 },
  { id: 24, star: 'Sadachbia', starHi: 'सदाछबिया', designation: 'γ Aquarii', constellation: 'Aquarius', constellationHi: 'कुम्भ', magnitude: 3.84 },
  { id: 25, star: 'Markab', starHi: 'मार्कब', designation: 'α Pegasi', constellation: 'Pegasus', constellationHi: 'पेगसस', magnitude: 2.49 },
  { id: 26, star: 'Algenib', starHi: 'अल्जेनिब', designation: 'γ Pegasi', constellation: 'Pegasus', constellationHi: 'पेगसस', magnitude: 2.84 },
  { id: 27, star: 'Revati (ζ Psc)', starHi: 'रेवती', designation: 'ζ Piscium', constellation: 'Pisces', constellationHi: 'मीन', magnitude: 5.24 },
];

export default function LearnNakshatrasPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tObj = (obj: any) => (obj as { en: string; hi: string; [k: string]: string })[locale] || obj?.en || '';
  const lo = locale === 'hi' || locale === 'sa' ? 'hi' as const : 'en' as const;

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      {/* ─── Sanskrit Key Terms ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Nakshatra" devanagari="नक्षत्र" transliteration="Nak\u1e63atra" meaning="Star / Lunar mansion" />
        <SanskritTermCard term="Pada" devanagari="पाद" transliteration="P\u0101da" meaning="Quarter (3°20')" />
        <SanskritTermCard term="Dasha Lord" devanagari="दशा स्वामी" transliteration="Da\u015b\u0101 Sv\u0101m\u012b" meaning="Period ruler" />
        <SanskritTermCard term="Gana" devanagari="गण" transliteration="Ga\u1e47a" meaning="Temperament group" />
      </div>

      {/* ─── 1. Overview ─── */}
      <LessonSection number={1} title={t('overviewTitle')}>
        <p>{t('overviewContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {lo === 'en' ? 'Key Fact:' : 'मुख्य तथ्य:'} 360° ÷ 27 = 13°20' per Nakshatra
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {lo === 'en'
              ? 'Moon\'s sidereal period \u2248 27.32 days → ~1 Nakshatra per day'
              : 'चन्द्र का नाक्षत्र काल \u2248 27.32 दिन → ~1 नक्षत्र प्रतिदिन'}
          </p>
        </div>
      </LessonSection>

      {/* ─── 2. Span & Geometry ─── */}
      <LessonSection number={2} title={t('spanTitle')}>
        <p>{t('spanContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Nakshatra = floor(Moon_longitude / 13.333°) + 1</p>
          <p className="text-gold-light font-mono text-sm mt-1">Pada = floor((Moon_longitude mod 13.333°) / 3.333°) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {lo === 'en'
              ? 'Example: Moon at 52° → floor(52/13.333)+1 = 4 → Rohini, Pada = floor((52-40)/3.333)+1 = 4'
              : '\u0909\u0926\u093e\u0939\u0930\u0923: \u091a\u0928\u094d\u0926\u094d\u0930 52° \u092a\u0930 → floor(52/13.333)+1 = 4 → \u0930\u094b\u0939\u093f\u0923\u0940, \u092a\u093e\u0926 = floor((52-40)/3.333)+1 = 4'}
          </p>
          <div className="mt-3 pt-3 border-t border-gold-primary/10">
            <p className="text-gold-light font-mono text-sm">27 Nakshatras × 4 Padas = 108 divisions</p>
            <p className="text-gold-light font-mono text-sm">12 Rashis × 9 Navamshas = 108 divisions</p>
            <p className="text-gold-light/60 font-mono text-xs mt-1">
              {lo === 'en'
                ? 'This is why 108 is sacred in Hindu tradition -- it unifies the Nakshatra and Rashi systems'
                : '\u0907\u0938\u0940\u0932\u093f\u090f 108 \u0939\u093f\u0928\u094d\u0926\u0942 \u092a\u0930\u092e\u094d\u092a\u0930\u093e \u092e\u0947\u0902 \u092a\u0935\u093f\u0924\u094d\u0930 \u0939\u0948 -- \u092f\u0939 \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0914\u0930 \u0930\u093e\u0936\u093f \u092a\u094d\u0930\u0923\u093e\u0932\u093f\u092f\u094b\u0902 \u0915\u094b \u090f\u0915\u0940\u0915\u0943\u0924 \u0915\u0930\u0924\u093e \u0939\u0948'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ─── 3. Nakshatra Lords & Dasha ─── */}
      <LessonSection number={3} title={t('dashaTitle')}>
        <p>{t('dashaContent')}</p>
        <div className="mt-4 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 p-4 text-sm text-text-secondary leading-relaxed">
          {lo === 'en' ? (
            <>
              <p className="mb-2"><strong className="text-gold-light">Starting point:</strong> The mapping begins at <strong className="text-gold-primary">Ashwini</strong> — the very first nakshatra at 0° Aries (the start of the sidereal zodiac). <strong className="text-gold-primary">Ketu</strong> is assigned to Ashwini. From there, the remaining 8 planets follow in a fixed sequence, moving forward through the zodiac in nakshatra order:</p>
              <p className="my-2 text-gold-primary font-mono text-xs text-center tracking-wide">Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury</p>
              <p className="mb-2">So the first 9 nakshatras are: <span className="text-text-primary">Ashwini = <strong>Ketu</strong>, Bharani = <strong>Venus</strong>, Krittika = <strong>Sun</strong>, Rohini = <strong>Moon</strong>, Mrigashira = <strong>Mars</strong>, Ardra = <strong>Rahu</strong>, Punarvasu = <strong>Jupiter</strong>, Pushya = <strong>Saturn</strong>, Ashlesha = <strong>Mercury</strong></span>. Then the cycle restarts: Magha (#10) = Ketu again, and so on for a third round from Moola (#19). Three complete rounds × 9 planets = 27 nakshatras covered, each planet ruling exactly 3.</p>
              <p><strong>Why this order and starting point?</strong> This is the <strong>Vimshottari Dasha sequence</strong> — derived by ancient rishis from the relationship between planets and the lunar nodes (Rahu-Ketu). Ketu begins the cycle because it represents the karmic starting point (past life). The dasha years (Ketu=7, Venus=20, Sun=6, Moon=10, Mars=7, Rahu=18, Jupiter=16, Saturn=19, Mercury=17) total exactly <strong>120 years</strong> — the ideal human lifespan per the Vedas. Your birth Moon&apos;s nakshatra lord determines which dasha you&apos;re born into.</p>
            </>
          ) : (
            <>
              <p className="mb-2"><strong className="text-gold-light">प्रारम्भ बिन्दु:</strong> मैपिंग <strong className="text-gold-primary">अश्विनी</strong> — प्रथम नक्षत्र (0° मेष, नाक्षत्र राशिचक्र का आरम्भ) से शुरू होती है। <strong className="text-gold-primary">केतु</strong> अश्विनी को सौंपा जाता है। उसके बाद शेष 8 ग्रह राशिचक्र में आगे बढ़ते हुए एक निश्चित क्रम में आते हैं:</p>
              <p className="my-2 text-gold-primary font-mono text-xs text-center tracking-wide">केतु → शुक्र → सूर्य → चन्द्र → मंगल → राहु → गुरु → शनि → बुध</p>
              <p className="mb-2">प्रथम 9 नक्षत्र: <span className="text-text-primary">अश्विनी = <strong>केतु</strong>, भरणी = <strong>शुक्र</strong>, कृत्तिका = <strong>सूर्य</strong>, रोहिणी = <strong>चन्द्र</strong>, मृगशिरा = <strong>मंगल</strong>, आर्द्रा = <strong>राहु</strong>, पुनर्वसु = <strong>गुरु</strong>, पुष्य = <strong>शनि</strong>, आश्लेषा = <strong>बुध</strong></span>। फिर चक्र पुनः आरम्भ: मघा (#10) = केतु, और तीसरा चक्र मूल (#19) से। तीन चक्र × 9 ग्रह = 27 नक्षत्र।</p>
              <p><strong>यह क्रम और प्रारम्भ बिन्दु क्यों?</strong> यह <strong>विंशोत्तरी दशा क्रम</strong> है — ऋषियों ने चान्द्र नोड्स (राहु-केतु) से ग्रहों के सम्बन्ध से निकाला। केतु चक्र आरम्भ करता है क्योंकि वह कार्मिक प्रारम्भ बिन्दु (पूर्वजन्म) का प्रतिनिधित्व करता है। दशा वर्ष कुल <strong>120 वर्ष</strong> = वैदिक आदर्श जीवनकाल। जन्म चन्द्र का नक्षत्र स्वामी निर्धारित करता है कि आप किस दशा में जन्मे।</p>
            </>
          )}
        </div>
        <div className="mt-6 space-y-2">
          {DASHA_LORDS.map((d, i) => (
            <motion.div
              key={d.planet}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-20 text-right text-sm font-semibold" style={{ color: d.color }}>
                {lo === 'en' ? d.planet : d.hi}
              </div>
              <div
                className="h-8 rounded-md flex items-center px-3 text-xs font-mono text-white/80"
                style={{
                  width: `${(d.years / 20) * 100}%`,
                  minWidth: '60px',
                  backgroundColor: `${d.color}33`,
                  border: `1px solid ${d.color}55`,
                }}
              >
                {d.years} {lo === 'en' ? 'yrs' : '\u0935\u0930\u094d\u0937'}
              </div>
              <div className="text-text-secondary/75 text-xs hidden sm:block" style={lo !== 'en' ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {d.nakshatras.map((nId: number) => NAKSHATRAS[nId - 1]?.name[lo] || `#${nId}`).join(', ')}
              </div>
            </motion.div>
          ))}
          <div className="mt-2 text-center text-text-secondary/70 text-xs font-mono">
            Total: 7+20+6+10+7+18+16+19+17 = 120 {lo === 'en' ? 'years' : '\u0935\u0930\u094d\u0937'}
          </div>
        </div>

        {/* Interactive Nakshatra-Dasha mapping visualization */}
        <div className="mt-8">
          <NakshatraDashaSpiral locale={locale as Locale} />
        </div>
      </LessonSection>

      {/* ─── 4. Padas ─── */}
      <LessonSection number={4} title={t('padaTitle')}>
        <p>{t('padaContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-gold-primary/80 border-b border-gold-primary/20">
                <th className="py-2 px-2 text-left">{lo === 'en' ? 'Nakshatra' : '\u0928\u0915\u094d\u0937\u0924\u094d\u0930'}</th>
                <th className="py-2 px-1 text-center">P1</th>
                <th className="py-2 px-1 text-center">P2</th>
                <th className="py-2 px-1 text-center">P3</th>
                <th className="py-2 px-1 text-center">P4</th>
                <th className="py-2 px-2 text-right">{lo === 'en' ? 'Navamsha Signs' : '\u0928\u0935\u093e\u0902\u0936 \u0930\u093e\u0936\u093f'}</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((nId) => {
                const n = NAKSHATRAS[nId - 1];
                const syllables = NAKSHATRA_SYLLABLES[nId];
                const navamshaStart = ((nId - 1) * 4) % 12;
                const navSigns = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
                return (
                  <tr key={nId} className="border-b border-gold-primary/5 text-text-secondary/80">
                    <td className="py-1.5 px-2 text-gold-light/90 font-medium">{n.name[lo === 'hi' ? 'hi' : 'en']}</td>
                    {syllables?.map((s, si) => (
                      <td key={si} className="py-1.5 px-1 text-center font-mono text-gold-light/60">{lo === 'en' ? s.en : s.hi}</td>
                    ))}
                    <td className="py-1.5 px-2 text-right text-text-secondary/70 font-mono">
                      {[0, 1, 2, 3].map((p) => navSigns[(navamshaStart + p) % 12]).join('-')}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={6} className="py-2 text-center text-text-secondary/65 text-xs italic">
                  {lo === 'en' ? '...showing first 9 of 27. See baby naming section for complete syllable chart.' : '...27 में से प्रथम 9 दिखा रहे हैं। पूर्ण अक्षर तालिका के लिए नामकरण खण्ड देखें।'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ─── 5. Categories ─── */}
      <LessonSection number={5} title={t('categoryTitle')}>
        <p>{t('categoryContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NAKSHATRA_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.name.en}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-lg p-4 border"
              style={{ borderColor: `${cat.color}30`, backgroundColor: `${cat.color}08` }}
            >
              <div className="font-semibold text-sm mb-1" style={{ color: cat.color }}>{cat.name[lo]}</div>
              <p className="text-text-secondary/70 text-xs mb-2">{cat.desc[lo]}</p>
              <p className="text-text-secondary/70 text-xs font-mono">{cat.nakshatras}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ─── 6. Gana Groups ─── */}
      <LessonSection number={6} title={t('ganaTitle')}>
        <p>
          {lo === 'en'
            ? 'Each Nakshatra belongs to one of three Ganas -- Deva (divine/gentle), Manushya (human/balanced), or Rakshasa (fierce/independent). This classification is crucial in Kundali matching (Gana Kuta = 6 points). Same Gana partners are most compatible temperamentally. Deva-Rakshasa pairing scores 0 and is considered the most challenging combination.'
            : '\u092a\u094d\u0930\u0924\u094d\u092f\u0947\u0915 \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0924\u0940\u0928 \u0917\u0923\u094b\u0902 \u092e\u0947\u0902 \u0938\u0947 \u090f\u0915 \u0915\u093e \u0939\u094b\u0924\u093e \u0939\u0948 -- \u0926\u0947\u0935 (\u0926\u0948\u0935\u0940/\u0915\u094b\u092e\u0932), \u092e\u0928\u0941\u0937\u094d\u092f (\u092e\u093e\u0928\u0935\u0940/\u0938\u0928\u094d\u0924\u0941\u0932\u093f\u0924), \u092f\u093e \u0930\u093e\u0915\u094d\u0937\u0938 (\u0909\u0917\u094d\u0930/\u0938\u094d\u0935\u0924\u0928\u094d\u0924\u094d\u0930)\u0964 \u092f\u0939 \u0935\u0930\u094d\u0917\u0940\u0915\u0930\u0923 \u0915\u0941\u0923\u094d\u0921\u0932\u0940 \u092e\u093f\u0932\u093e\u0928 \u092e\u0947\u0902 \u092e\u0939\u0924\u094d\u0935\u092a\u0942\u0930\u094d\u0923 \u0939\u0948 (\u0917\u0923 \u0915\u0942\u091f = 6 \u0905\u0902\u0915)\u0964'}
        </p>
        <div className="mt-4 space-y-2">
          {NAKSHATRA_GROUPS.map((g) => (
            <div key={g.name.en} className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <span className="text-gold-primary font-semibold text-sm">{g.name[lo]} ({g.count})</span>
              <p className="text-text-secondary/70 text-xs mt-1">{g.nakshatras}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ─── Rashi-Nakshatra Wheel ─── */}
      <LessonSection number={7} title={lo === 'en' ? 'Rashi–Nakshatra Relationship' : 'राशि-नक्षत्र सम्बन्ध'}>
        {lo === 'en' ? (
          <div className="space-y-3">
            <p>The zodiac (360°) is divided <strong>two ways simultaneously</strong> — and understanding both is the key to Vedic astrology:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">12</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">Rashis (Signs)</div>
                <div className="text-text-secondary/70 text-xs mt-1">30° each — based on the <strong>Sun&apos;s</strong> annual path. Your &quot;Sun sign&quot; in Western astrology. In Vedic astrology, the <strong>Moon&apos;s</strong> rashi matters more.</div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">27</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">Nakshatras (Stars)</div>
                <div className="text-text-secondary/70 text-xs mt-1">13°20&apos; each — based on the <strong>Moon&apos;s</strong> daily position among star groups. Each has a deity, ruler, and unique personality. The Moon visits one nakshatra per day.</div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">108</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">Padas (Quarters)</div>
                <div className="text-text-secondary/70 text-xs mt-1">3°20&apos; each — 27 × 4 = 108, the sacred number. Each pada maps to one Navamsha (D9) sign. 108 padas ÷ 12 signs = 9 padas per rashi.</div>
              </div>
            </div>
            <p className="text-sm"><strong>The beautiful math:</strong> 12 rashis × 9 padas = 108. 27 nakshatras × 4 padas = 108. This is why 108 is sacred in Hinduism — it&apos;s the meeting point of the solar (rashi) and lunar (nakshatra) systems. A mala has 108 beads for this reason.</p>
            <p className="text-sm">These two systems <strong>overlap</strong> — some nakshatras span two rashis (e.g., Krittika starts in Aries, ends in Taurus). This is why people born in the same nakshatra but different padas can have different rashis. Hover over any segment below to see the relationship.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p>राशिचक्र (360°) <strong>दो तरीकों से एक साथ</strong> विभाजित है — दोनों को समझना वैदिक ज्योतिष की कुंजी है:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">12</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">राशियाँ</div>
                <div className="text-text-secondary/70 text-xs mt-1">30° प्रत्येक — <strong>सूर्य</strong> के वार्षिक पथ पर आधारित। वैदिक ज्योतिष में <strong>चन्द्र</strong> की राशि अधिक महत्वपूर्ण।</div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">27</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">नक्षत्र</div>
                <div className="text-text-secondary/70 text-xs mt-1">13°20&apos; प्रत्येक — <strong>चन्द्रमा</strong> की दैनिक स्थिति। प्रत्येक का एक देवता, स्वामी और अद्वितीय व्यक्तित्व। चन्द्र प्रतिदिन एक नक्षत्र पार करता है।</div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">108</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">पाद (चतुर्थांश)</div>
                <div className="text-text-secondary/70 text-xs mt-1">3°20&apos; प्रत्येक — 27 × 4 = 108, पवित्र संख्या। प्रत्येक पाद एक नवांश (D9) राशि से जुड़ता है। 108 ÷ 12 = 9 पाद प्रति राशि।</div>
              </div>
            </div>
            <p className="text-sm"><strong>सुन्दर गणित:</strong> 12 राशियाँ × 9 पाद = 108। 27 नक्षत्र × 4 पाद = 108। इसीलिए हिन्दू धर्म में 108 पवित्र है — यह सौर (राशि) और चान्द्र (नक्षत्र) प्रणालियों का मिलन बिन्दु है। माला में 108 मनके इसीलिए होते हैं।</p>
            <p className="text-sm">ये दोनों प्रणालियाँ <strong>ओवरलैप</strong> करती हैं — कुछ नक्षत्र दो राशियों में फैले हैं। इसीलिए एक ही नक्षत्र के भिन्न पादों में जन्मे लोगों की राशि भिन्न हो सकती है।</p>
          </div>
        )}
        <div className="mt-6">
          <RashiNakshatraWheel locale={locale as Locale} />
        </div>
      </LessonSection>

      {/* ─── 8. Baby Naming ─── */}
      <LessonSection number={7} title={t('namingTitle')}>
        <p>{t('namingContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-gold-primary/80 border-b border-gold-primary/20">
                <th className="py-2 px-2 text-left">{lo === 'en' ? 'Nakshatra' : '\u0928\u0915\u094d\u0937\u0924\u094d\u0930'}</th>
                <th className="py-2 px-1 text-center">{lo === 'en' ? 'Pada 1' : '\u092a\u093e\u0926 1'}</th>
                <th className="py-2 px-1 text-center">{lo === 'en' ? 'Pada 2' : '\u092a\u093e\u0926 2'}</th>
                <th className="py-2 px-1 text-center">{lo === 'en' ? 'Pada 3' : '\u092a\u093e\u0926 3'}</th>
                <th className="py-2 px-1 text-center">{lo === 'en' ? 'Pada 4' : '\u092a\u093e\u0926 4'}</th>
              </tr>
            </thead>
            <tbody>
              {NAKSHATRAS.map((n) => {
                const syllables = NAKSHATRA_SYLLABLES[n.id];
                if (!syllables) return null;
                return (
                  <tr key={n.id} className="border-b border-gold-primary/5 text-text-secondary/80">
                    <td className="py-1.5 px-2 text-gold-light/90 font-medium whitespace-nowrap">
                      <span className="inline-flex w-5 h-5 mr-1.5 align-middle">{(() => { const Icon = NAKSHATRA_ICONS[n.id]; return Icon ? <Icon size={20} /> : null; })()}</span>
                      {n.name[lo === 'hi' ? 'hi' : 'en']}
                    </td>
                    {syllables.map((s, si) => (
                      <td key={si} className="py-1.5 px-1 text-center">
                        <span className="font-mono text-gold-light/70">{lo === 'en' ? s.en : s.hi}</span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/70 text-xs">
            {lo === 'en'
              ? 'Example: A child born with Moon in Rohini Pada 1 (syllable "O") might be named Om, Omkar, or Ojas. For Pushya Pada 4 (syllable "Da"), names like Daksha, Darpan, or Damini are traditional.'
              : '\u0909\u0926\u093e\u0939\u0930\u0923: \u0930\u094b\u0939\u093f\u0923\u0940 \u092a\u093e\u0926 1 (\u0905\u0915\u094d\u0937\u0930 "\u0913") \u092e\u0947\u0902 \u091c\u0928\u094d\u092e\u0947 \u092c\u093e\u0932\u0915 \u0915\u093e \u0928\u093e\u092e \u0913\u092e, \u0913\u092e\u0915\u093e\u0930, \u092f\u093e \u0913\u091c\u0938 \u0939\u094b \u0938\u0915\u0924\u093e \u0939\u0948\u0964 \u092a\u0941\u0937\u094d\u092f \u092a\u093e\u0926 4 (\u0905\u0915\u094d\u0937\u0930 "\u0921\u093e") \u0915\u0947 \u0932\u093f\u090f \u0926\u0915\u094d\u0937, \u0926\u0930\u094d\u092a\u0923, \u0926\u093e\u092e\u093f\u0928\u0940 \u092a\u093e\u0930\u092e\u094d\u092a\u0930\u093f\u0915 \u0939\u0948\u0902\u0964'}
          </p>
        </div>
      </LessonSection>

      {/* ─── 8. Tara Bala ─── */}
      <LessonSection number={8} title={t('taraTitle')}>
        <p>{t('taraContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10 mb-4">
          <p className="text-gold-light font-mono text-sm mb-1">
            {lo === 'en' ? 'Formula:' : '\u0938\u0942\u0924\u094d\u0930:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            Tara = ((Transit_Nakshatra - Birth_Nakshatra + 27) mod 27) / 3 + 1
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {lo === 'en'
              ? 'If remainder = 0, use Tara 9. Result cycles: 1\u20139, 1\u20139, 1\u20139 across 27 Nakshatras.'
              : '\u092f\u0926\u093f \u0936\u0947\u0937 = 0, \u0924\u093e\u0930\u093e 9 \u0932\u0947\u0902\u0964 \u092a\u0930\u093f\u0923\u093e\u092e \u091a\u0915\u094d\u0930: 27 \u0928\u0915\u094d\u0937\u0924\u094d\u0930\u094b\u0902 \u092e\u0947\u0902 1\u20139, 1\u20139, 1\u20139\u0964'}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TARA_NAMES.map((tara) => (
            <div
              key={tara.num}
              className={`rounded-lg p-3 border ${tara.good ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-red-400/15 bg-red-400/5'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${tara.good ? 'bg-emerald-400/20 text-emerald-400' : 'bg-red-400/15 text-red-400'}`}>
                  {tara.num}
                </span>
                <span className={`text-sm font-semibold ${tara.good ? 'text-emerald-400' : 'text-red-400'}`}>{tara.name[lo]}</span>
              </div>
              <p className="text-text-secondary/70 text-xs">{tara.effect[lo]}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ─── 9. Matching: Yoni, Gana, Nadi ─── */}
      <LessonSection number={9} title={t('matchingTitle')} variant="highlight">
        <p>{t('matchingContent')}</p>
        <div className="mt-4 space-y-3">
          {MATCHING_KUTAS.map((kuta) => (
            <div key={kuta.name.en} className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <div className="text-gold-primary font-semibold text-sm mb-2">{kuta.name[lo]}</div>
              <p className="text-text-secondary/80 text-xs leading-relaxed">{kuta.desc[lo]}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/70 text-xs">
            {lo === 'en'
              ? 'Together: Yoni (4) + Gana (6) + Nadi (8) = 18 out of 36 points are Nakshatra-determined. The remaining 18 come from Varna (1), Vasya (2), Tara (3), Graha Maitri (5), and Bhakoot (7).'
              : '\u0915\u0941\u0932 \u092e\u093f\u0932\u093e\u0915\u0930: \u092f\u094b\u0928\u093f (4) + \u0917\u0923 (6) + \u0928\u093e\u0921\u0940 (8) = 36 \u092e\u0947\u0902 \u0938\u0947 18 \u0905\u0902\u0915 \u0928\u0915\u094d\u0937\u0924\u094d\u0930-\u0928\u093f\u0930\u094d\u0927\u093e\u0930\u093f\u0924 \u0939\u0948\u0902\u0964 \u0936\u0947\u0937 18 \u0935\u0930\u094d\u0923 (1), \u0935\u0936\u094d\u092f (2), \u0924\u093e\u0930\u093e (3), \u0917\u094d\u0930\u0939 \u092e\u0948\u0924\u094d\u0930\u0940 (5), \u0914\u0930 \u092d\u0915\u0942\u091f (7) \u0938\u0947 \u0906\u0924\u0947 \u0939\u0948\u0902\u0964'}
          </p>
        </div>
      </LessonSection>

      {/* ─── 10. Complete Nakshatra List ─── */}
      <LessonSection title={t('completeList')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NAKSHATRAS.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 flex-shrink-0">
                  {(() => { const Icon = NAKSHATRA_ICONS[n.id]; return Icon ? <Icon size={32} /> : <span className="text-lg">{n.symbol}</span>; })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gold-light font-semibold text-sm truncate">
                    {n.id}. {tObj(n.name)}
                  </div>
                  {locale !== 'en' && <div className="text-text-secondary/75 text-xs truncate">{n.name.en}</div>}
                </div>
                <span className="text-gold-primary text-xs font-mono font-bold flex-shrink-0">{fmtDeg(n.startDeg)} – {fmtDeg(n.endDeg)}</span>
              </div>
              <div className="flex flex-wrap gap-x-2 text-xs text-text-secondary/70 ml-[42px]">
                <span>{tObj(n.deity)}</span>
                <span className="text-text-secondary/55">|</span>
                <span>{tObj(n.rulerName)}</span>
                <span className="text-text-secondary/55">|</span>
                <span>{tObj(n.nature)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ─── 11. What Do the Degrees Measure? ─── */}
      <LessonSection title={t('degreeTitle')}>
        <p>{t('degreeContent')}</p>
        <div className="mt-4 p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/70 text-xs font-mono">
            {lo === 'en'
              ? '0° Aries (Mesha) → 360° Pisces (Meena) · Each Nakshatra = 13°20\' · Each Pada = 3°20\''
              : '0° मेष → 360° मीन · प्रत्येक नक्षत्र = 13°20\' · प्रत्येक पाद = 3°20\''}
          </p>
        </div>

        {/* Ayanamsha explanation */}
        <h4 className="text-gold-light font-semibold text-base mt-6 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{t('ayanamshaTitle')}</h4>
        <p>{t('ayanamshaContent')}</p>
        <p className="mt-3">{t('ayanamshaHow')}</p>
        <p className="mt-3">{t('ayanamshaCalc')}</p>

        {/* Worked example */}
        <div className="mt-4 p-4 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] rounded-lg border border-gold-primary/15">
          <div className="text-gold-primary font-semibold text-sm mb-3">
            {lo === 'en' ? 'Worked Example — Finding the Moon\'s Nakshatra' : 'उदाहरण — चन्द्रमा का नक्षत्र ज्ञात करना'}
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-gold-primary font-bold w-5 flex-shrink-0">1.</span>
              <div>
                <span className="text-gold-light font-medium">{lo === 'en' ? 'Tropical longitude of Moon' : 'चन्द्र का सायन देशान्तर'}: </span>
                <span className="text-text-primary font-mono">54°30\'</span>
                <span className="text-text-secondary"> ({lo === 'en' ? 'from astronomical ephemeris' : 'खगोलीय पञ्चाङ्ग से'})</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold-primary font-bold w-5 flex-shrink-0">2.</span>
              <div>
                <span className="text-gold-light font-medium">{lo === 'en' ? 'Subtract Ayanamsha' : 'अयनांश घटाएँ'}: </span>
                <span className="text-text-primary font-mono">54°30\' − 24°07\' = 30°23\'</span>
                <span className="text-text-secondary"> ({lo === 'en' ? 'sidereal longitude' : 'निरयन देशान्तर'})</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold-primary font-bold w-5 flex-shrink-0">3.</span>
              <div>
                <span className="text-gold-light font-medium">{lo === 'en' ? 'Find the Nakshatra' : 'नक्षत्र ज्ञात करें'}: </span>
                <span className="text-text-primary font-mono">30°23\' ÷ 13°20\' = 2.28</span>
                <span className="text-text-secondary"> → {lo === 'en' ? 'Nakshatra #3' : 'नक्षत्र #3'} = </span>
                <span className="text-gold-light font-semibold">{lo === 'en' ? 'Krittika' : 'कृत्तिका'}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold-primary font-bold w-5 flex-shrink-0">4.</span>
              <div>
                <span className="text-gold-light font-medium">{lo === 'en' ? 'Find the Pada' : 'पाद ज्ञात करें'}: </span>
                <span className="text-text-primary font-mono">30°23\' − 26°40\' = 3°43\'</span>
                <span className="text-text-secondary"> → 3°43\' ÷ 3°20\' = 1.12 → </span>
                <span className="text-gold-light font-semibold">{lo === 'en' ? 'Pada 2' : 'पाद 2'}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gold-primary/10 text-xs text-text-secondary">
            {lo === 'en'
              ? 'Result: Moon at tropical 54°30\' is in Krittika Nakshatra, Pada 2 (sidereal 30°23\' in Taurus). Without subtracting the Ayanamsha, the same Moon would appear to be at 54°30\' — in Mrigashira — which is the Western (tropical) position, not the Vedic one.'
              : 'परिणाम: सायन 54°30\' पर चन्द्रमा कृत्तिका नक्षत्र, पाद 2 (निरयन 30°23\' वृषभ) में है। अयनांश घटाए बिना, वही चन्द्रमा 54°30\' — मृगशिरा में प्रतीत होता — जो पश्चिमी (सायन) स्थिति है, वैदिक नहीं।'}
          </div>
        </div>

        {/* Key insight box */}
        <div className="mt-4 p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/15">
          <p className="text-gold-light text-sm font-medium">
            {lo === 'en'
              ? 'The Ayanamsha grows by ~50" (arcseconds) every year. Two millennia ago it was nearly 0° — the tropical and sidereal zodiacs were aligned. Today the gap is ~24°, which is why a Western "Taurus Sun" often becomes an "Aries Sun" in Vedic astrology. This same correction applies to every planet, and determines the correct Nakshatra for each.'
              : 'अयनांश प्रति वर्ष ~50" (कला-विकला) बढ़ता है। दो सहस्राब्दी पूर्व यह लगभग 0° था — सायन और निरयन राशिचक्र संरेखित थे। आज अन्तर ~24° है, इसीलिए पश्चिमी "वृषभ सूर्य" प्रायः वैदिक ज्योतिष में "मेष सूर्य" बन जाता है। यही सुधार प्रत्येक ग्रह पर लागू होता है, और प्रत्येक का सही नक्षत्र निर्धारित करता है।'}
          </p>
        </div>

        {/* Milankovitch connection */}
        <div className="mt-6 p-4 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] rounded-lg border border-gold-primary/15">
          <h4 className="text-gold-light font-semibold text-base mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {lo === 'en' ? 'Precession & the Milankovitch Cycles' : 'अयन-गति और मिलांकोविच चक्र'}
          </h4>
          <p className="text-text-primary text-sm leading-relaxed">
            {lo === 'en'
              ? 'The precession that drives the Ayanamsha is one of three Milankovitch cycles — long-period variations in Earth\'s orbital geometry that govern ice ages and major climate shifts. Serbian mathematician Milutin Milankovitch formalized these in the 1920s, but Indian astronomers had already been tracking precession for over a millennium.'
              : 'अयनांश को चलाने वाली अयन-गति तीन मिलांकोविच चक्रों में से एक है — पृथ्वी की कक्षीय ज्यामिति में दीर्घ-अवधि परिवर्तन जो हिमयुगों और प्रमुख जलवायु परिवर्तनों को नियन्त्रित करते हैं। सर्बियाई गणितज्ञ मिलुटिन मिलांकोविच ने इन्हें 1920 के दशक में सूत्रबद्ध किया, परन्तु भारतीय खगोलविद् इसके एक सहस्राब्दी पूर्व से अयन-गति को ट्रैक कर रहे थे।'}
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Precession */}
            <div className="p-3 rounded-lg bg-gold-primary/8 border border-gold-primary/15">
              <div className="text-gold-primary font-bold text-sm mb-1">
                {lo === 'en' ? 'Precession' : 'अयन-गति (Precession)'}
              </div>
              <div className="text-gold-light font-mono text-xs mb-2">~26,000 {lo === 'en' ? 'years' : 'वर्ष'}</div>
              <p className="text-text-secondary text-xs leading-relaxed">
                {lo === 'en'
                  ? 'Earth\'s axis traces a slow cone, like a wobbling top. This shifts where the equinox falls against the background stars — the exact phenomenon the Ayanamsha measures. One full cycle takes ~26,000 years.'
                  : 'पृथ्वी का अक्ष एक लट्टू की तरह धीरे-धीरे शंकु बनाता है। इससे विषुव बिन्दु पृष्ठभूमि तारों के सापेक्ष खिसकता है — ठीक वही घटना जिसे अयनांश मापता है। एक पूर्ण चक्र ~26,000 वर्ष लेता है।'}
              </p>
              <div className="mt-2 px-2 py-1 rounded bg-gold-primary/10 text-gold-light text-xs font-semibold text-center">
                = {lo === 'en' ? 'Ayanamsha' : 'अयनांश'}
              </div>
            </div>

            {/* Obliquity */}
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
              <div className="text-text-primary font-bold text-sm mb-1">
                {lo === 'en' ? 'Obliquity (Axial Tilt)' : 'अक्षीय झुकाव (Obliquity)'}
              </div>
              <div className="text-text-secondary font-mono text-xs mb-2">~41,000 {lo === 'en' ? 'years' : 'वर्ष'}</div>
              <p className="text-text-secondary text-xs leading-relaxed">
                {lo === 'en'
                  ? 'Earth\'s axial tilt oscillates between 22.1° and 24.5° over ~41,000 years. Currently ~23.44° and decreasing. This changes the intensity of seasons — greater tilt means more extreme summers and winters.'
                  : 'पृथ्वी का अक्षीय झुकाव ~41,000 वर्षों में 22.1° और 24.5° के बीच दोलन करता है। वर्तमान में ~23.44° और घट रहा है। इससे ऋतुओं की तीव्रता बदलती है।'}
              </p>
              <div className="mt-2 px-2 py-1 rounded bg-white/5 text-text-secondary text-xs text-center">
                {lo === 'en' ? 'Governs season intensity' : 'ऋतु तीव्रता नियन्त्रित'}
              </div>
            </div>

            {/* Eccentricity */}
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
              <div className="text-text-primary font-bold text-sm mb-1">
                {lo === 'en' ? 'Eccentricity' : 'विकेन्द्रता (Eccentricity)'}
              </div>
              <div className="text-text-secondary font-mono text-xs mb-2">~100,000 {lo === 'en' ? 'years' : 'वर्ष'}</div>
              <p className="text-text-secondary text-xs leading-relaxed">
                {lo === 'en'
                  ? 'Earth\'s orbit stretches between nearly circular and slightly elliptical over ~100,000 years. This changes how much total solar energy Earth receives. Currently eccentricity is ~0.017 (nearly circular).'
                  : 'पृथ्वी की कक्षा ~100,000 वर्षों में लगभग वृत्ताकार से हल्की दीर्घवृत्ताकार के बीच बदलती है। इससे पृथ्वी को प्राप्त कुल सौर ऊर्जा बदलती है। वर्तमान विकेन्द्रता ~0.017 है।'}
              </p>
              <div className="mt-2 px-2 py-1 rounded bg-white/5 text-text-secondary text-xs text-center">
                {lo === 'en' ? 'Governs orbit shape' : 'कक्षा आकार नियन्त्रित'}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/10 space-y-3">
            <p className="text-gold-light/80 text-xs leading-relaxed">
              {lo === 'en'
                ? 'The Surya Siddhanta (c. 4th century CE) records a precession rate of 54" per year — remarkably close to the modern value of 50.3". The text calls this phenomenon "Ayana Chalana" (movement of the solstices). Indian astronomy independently discovered and quantified precession over 1,500 years before Milankovitch linked it to ice ages.'
                : 'सूर्य सिद्धान्त (लगभग चौथी शताब्दी ई.) में अयन-गति की दर 54" प्रति वर्ष दर्ज है — आधुनिक मान 50.3" के अत्यन्त निकट। ग्रन्थ इस घटना को "अयन चलन" कहता है। भारतीय खगोल विज्ञान ने अयन-गति को मिलांकोविच से 1,500 वर्ष पूर्व स्वतन्त्र रूप से खोजा और मापा।'}
            </p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {lo === 'en'
                ? 'Indian astronomers\' direct contribution was to precession. Obliquity was known implicitly — the Surya Siddhanta gives the ecliptic obliquity as 24° (close to the modern ~23.44°), and this value was essential for converting between ecliptic and equatorial coordinates. However, the slow oscillation of obliquity over 41,000 years was not tracked as a separate cycle. Eccentricity variation (~100,000 year cycle) was not formulated in classical Indian texts — Earth\'s orbit was modeled as having a fixed eccentricity. The insight that all three cycles interlock to drive ice ages was Milankovitch\'s unique contribution in the 1920s.'
                : 'भारतीय खगोलविदों का प्रत्यक्ष योगदान अयन-गति (precession) में था। अक्षीय झुकाव (obliquity) परोक्ष रूप से ज्ञात था — सूर्य सिद्धान्त क्रान्तिवृत्त झुकाव 24° देता है (आधुनिक ~23.44° के निकट), और यह मान क्रान्तिवृत्तीय-विषुवतीय निर्देशांक रूपान्तरण के लिए आवश्यक था। परन्तु 41,000 वर्षों में झुकाव का धीमा दोलन एक पृथक चक्र के रूप में नहीं मापा गया। विकेन्द्रता परिवर्तन (~100,000 वर्ष चक्र) शास्त्रीय भारतीय ग्रन्थों में सूत्रबद्ध नहीं था — पृथ्वी की कक्षा को स्थिर विकेन्द्रता वाला माना गया। तीनों चक्रों का परस्पर गुँथकर हिमयुग चलाना — यह मिलांकोविच का विशिष्ट योगदान (1920 का दशक) था।'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ─── 12. Yogatara — The Junction Stars ─── */}
      <LessonSection title={t('yogataraTitle')}>
        <p>{t('yogataraContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2.5 px-2 text-gold-primary font-semibold">#</th>
                <th className="text-left py-2.5 px-2 text-gold-primary font-semibold">{lo === 'en' ? 'Nakshatra' : 'नक्षत्र'}</th>
                <th className="text-left py-2.5 px-2 text-gold-primary font-semibold">{lo === 'en' ? 'Yogatara' : 'योगतारा'}</th>
                <th className="text-left py-2.5 px-2 text-gold-primary font-semibold">{lo === 'en' ? 'Designation' : 'पदनाम'}</th>
                <th className="text-left py-2.5 px-2 text-gold-primary font-semibold">{lo === 'en' ? 'Constellation' : 'तारामण्डल'}</th>
                <th className="text-right py-2.5 px-2 text-gold-primary font-semibold">{lo === 'en' ? 'Mag.' : 'कान्ति'}</th>
              </tr>
            </thead>
            <tbody>
              {YOGATARAS.map((yt) => {
                const n = NAKSHATRAS[yt.id - 1];
                const Icon = NAKSHATRA_ICONS[yt.id];
                return (
                  <tr key={yt.id} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                    <td className="py-2 px-2 text-text-secondary font-mono text-xs">{yt.id}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        {Icon && <span className="w-5 h-5 flex-shrink-0"><Icon size={20} /></span>}
                        <span className="text-gold-light font-medium text-sm">{n?.name[locale as keyof typeof n.name] || n?.name.en}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-text-primary font-semibold text-sm">{lo === 'en' ? yt.star : yt.starHi}</td>
                    <td className="py-2 px-2 text-text-secondary font-mono text-xs">{yt.designation}</td>
                    <td className="py-2 px-2 text-text-secondary text-sm">{lo === 'en' ? yt.constellation : yt.constellationHi}</td>
                    <td className="py-2 px-2 text-right font-mono text-xs" style={{ color: yt.magnitude <= 1 ? '#f0d48a' : yt.magnitude <= 2.5 ? '#d4a853' : '#8a8478' }}>
                      {yt.magnitude.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/70 text-xs">
            {lo === 'en'
              ? 'Magnitude (Mag.) measures apparent brightness — lower is brighter. Stars below ~1.0 are among the brightest in the sky. Notable: Arcturus (Swati, -0.05) is the 4th brightest star; Aldebaran (Rohini, 0.85) and Spica (Chitra, 0.97) are also first-magnitude stars.'
              : 'कान्ति (Mag.) आभासी चमक को मापती है — कम मान = अधिक चमकीला। ~1.0 से कम वाले तारे आकाश के सबसे चमकीले हैं। उल्लेखनीय: आर्कटुरस (स्वाती, -0.05) चौथा सबसे चमकीला तारा है; अल्डेबरन (रोहिणी, 0.85) और स्पाइका (चित्रा, 0.97) भी प्रथम-कान्ति तारे हैं।'}
          </p>
        </div>
      </LessonSection>

      {/* ─── Cross-References ─── */}
      <LessonSection title={t('crossRefTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {([
            { href: '/learn/dashas' as const, label: lo === 'en' ? 'Dashas -- How Nakshatras drive the timing system' : '\u0926\u0936\u093e -- \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0938\u092e\u092f \u092a\u094d\u0930\u0923\u093e\u0932\u0940 \u0915\u0948\u0938\u0947 \u091a\u0932\u093e\u0924\u0947 \u0939\u0948\u0902' },
            { href: '/learn/matching' as const, label: lo === 'en' ? 'Kundali Matching -- Full Ashtakoota system' : '\u0915\u0941\u0923\u094d\u0921\u0932\u0940 \u092e\u093f\u0932\u093e\u0928 -- \u092a\u0942\u0930\u094d\u0923 \u0905\u0937\u094d\u091f\u0915\u0942\u091f \u092a\u094d\u0930\u0923\u093e\u0932\u0940' },
            { href: '/learn/muhurtas' as const, label: lo === 'en' ? 'Muhurtas -- How Nakshatras shape auspicious timing' : '\u092e\u0941\u0939\u0942\u0930\u094d\u0924 -- \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0936\u0941\u092d \u0938\u092e\u092f \u0915\u0948\u0938\u0947 \u0928\u093f\u0930\u094d\u0927\u093e\u0930\u093f\u0924 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902' },
            { href: '/learn/kundali' as const, label: lo === 'en' ? 'Kundali Foundations -- Birth chart basics' : '\u0915\u0941\u0923\u094d\u0921\u0932\u0940 \u0906\u0927\u093e\u0930 -- \u091c\u0928\u094d\u092e \u0915\u0941\u0923\u094d\u0921\u0932\u0940 \u0915\u0940 \u092e\u0942\u0932 \u092c\u093e\u0924\u0947\u0902' },
            { href: '/baby-names' as const, label: lo === 'en' ? 'Baby Name Finder -- Look up names by Nakshatra' : '\u0936\u093f\u0936\u0941 \u0928\u093e\u092e \u0916\u094b\u091c\u0915 -- \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0915\u0947 \u0905\u0928\u0941\u0938\u093e\u0930 \u0928\u093e\u092e \u0916\u094b\u091c\u0947\u0902' },
          ]).map((ref) => (
            <Link
              key={ref.href}
              href={ref.href}
              className="flex items-center gap-2 p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/10 hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-colors text-sm text-gold-light/80 hover:text-gold-light"
            >
              <span className="text-gold-primary">&rarr;</span>
              {ref.label}
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* ─── CTA ─── */}
      <div className="mt-6 text-center">
        <Link
          href="/panchang"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}
