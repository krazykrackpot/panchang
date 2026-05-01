'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { GRAHAS } from '@/lib/constants/grahas';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/grahas.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;



/* ── Planet detail data (expanded from original) ──────────────────── */
const PLANET_DETAILS: Record<number, {
  orbit: string;
  dignity: Record<string, string>;
  signifies: Record<string, string>;
  dashaYears: number;
  exaltDeg: string;
  debilDeg: string;
  moolatrikona: Record<string, string>;
  ownSigns: Record<string, string>;
  combustionDeg: string;
  karakatva: Record<string, string>;
}> = {
  0: {
    orbit: '1 year', dashaYears: 6,
    dignity: { en: 'Exalted in Aries (10°), Debilitated in Libra (10°)', hi: 'मेष 10° में उच्च, तुला 10° में नीच', sa: 'मेषे 10° उच्चः, तुलायां 10° नीचः' },
    signifies: { en: 'Soul, authority, father, government, health, vitality, gold', hi: 'आत्मा, अधिकार, पिता, सरकार, स्वास्थ्य, जीवन शक्ति', sa: 'आत्मा, अधिकारः, पिता, राज्यं, आरोग्यं, जीवनशक्तिः' },
    exaltDeg: 'Aries 10°', debilDeg: 'Libra 10°',
    moolatrikona: { en: 'Leo 0°-20°', hi: 'सिंह 0°-20°', sa: 'सिंह 0°-20°', mai: 'सिंह 0°-20°', mr: 'सिंह 0°-20°', ta: 'சிம்மம் 0°-20°', te: 'సింహం 0°-20°', bn: 'সিংহ 0°-20°', kn: 'ಸಿಂಹ 0°-20°', gu: 'સિંહ 0°-20°' },
    ownSigns: { en: 'Leo', hi: 'सिंह', sa: 'सिंह', mai: 'सिंह', mr: 'सिंह', ta: 'சிம்மம்', te: 'సింహం', bn: 'সিংহ', kn: 'ಸಿಂಹ', gu: 'સિંહ' },
    combustionDeg: '—',
    karakatva: { en: 'Atmakaraka (soul), father, king, government authority, bones, heart, right eye, copper, ruby, wheat, temple, east direction', hi: 'आत्मकारक, पिता, राजा, सरकारी अधिकार, अस्थि, हृदय, दायाँ नेत्र, ताम्र, माणिक्य', sa: 'आत्मकारक, पिता, राजा, सरकारी अधिकार, अस्थि, हृदय, दायाँ नेत्र, ताम्र, माणिक्य', mai: 'आत्मकारक, पिता, राजा, सरकारी अधिकार, अस्थि, हृदय, दायाँ नेत्र, ताम्र, माणिक्य', mr: 'आत्मकारक, पिता, राजा, सरकारी अधिकार, अस्थि, हृदय, दायाँ नेत्र, ताम्र, माणिक्य', ta: 'ஆத்மகாரகன் (ஆன்மா), தந்தை, அரசன், அரசாங்க அதிகாரம், எலும்புகள், இதயம், வலது கண், செம்பு, மாணிக்கம், கோதுமை, கோயில், கிழக்கு திசை', te: 'ఆత్మకారకుడు (ఆత్మ), తండ్రి, రాజు, ప్రభుత్వ అధికారం, ఎముకలు, హృదయం, కుడి కన్ను, రాగి, మాణిక్యం, గోధుమ, దేవాలయం, తూర్పు దిక్కు', bn: 'আত্মকারক (আত্মা), পিতা, রাজা, সরকারি কর্তৃত্ব, অস্থি, হৃদয়, ডান চোখ, তামা, চুনি, গম, মন্দির, পূর্ব দিক', kn: 'ಆತ್ಮಕಾರಕ (ಆತ್ಮ), ತಂದೆ, ರಾಜ, ಸರ್ಕಾರಿ ಅಧಿಕಾರ, ಮೂಳೆಗಳು, ಹೃದಯ, ಬಲ ಕಣ್ಣು, ತಾಮ್ರ, ಮಾಣಿಕ್ಯ, ಗೋಧಿ, ದೇವಾಲಯ, ಪೂರ್ವ ದಿಕ್ಕು', gu: 'આત્મકારક (આત્મા), પિતા, રાજા, સરકારી સત્તા, હાડકાં, હૃદય, જમણી આંખ, તાંબુ, માણેક, ઘઉં, મંદિર, પૂર્વ દિશા' },
  },
  1: {
    orbit: '27.3 days', dashaYears: 10,
    dignity: { en: 'Exalted in Taurus (3°), Debilitated in Scorpio (3°)', hi: 'वृषभ 3° में उच्च, वृश्चिक 3° में नीच', sa: 'वृषभे 3° उच्चः, वृश्चिके 3° नीचः' },
    signifies: { en: 'Mind, emotions, mother, public, liquids, travel, silver', hi: 'मन, भावनाएँ, माता, जनता, तरल पदार्थ, यात्रा', sa: 'मनः, भावाः, माता, जनता, द्रवपदार्थाः, यात्रा' },
    exaltDeg: 'Taurus 3°', debilDeg: 'Scorpio 3°',
    moolatrikona: { en: 'Taurus 4°-20°', hi: 'वृषभ 4°-20°', sa: 'वृषभ 4°-20°', mai: 'वृषभ 4°-20°', mr: 'वृषभ 4°-20°', ta: 'ரிஷபம் 4°-20°', te: 'వృషభం 4°-20°', bn: 'বৃষ 4°-20°', kn: 'ವೃಷಭ 4°-20°', gu: 'વૃષભ 4°-20°' },
    ownSigns: { en: 'Cancer', hi: 'कर्क', sa: 'कर्क', mai: 'कर्क', mr: 'कर्क', ta: 'கடகம்', te: 'కర్కాటకం', bn: 'কর্কট', kn: 'ಕರ್ಕಾಟಕ', gu: 'કર્ક' },
    combustionDeg: '12°',
    karakatva: { en: 'Mind (Manas), mother, queen, public opinion, water, milk, pearl, silver, left eye, Monday, northwest direction, white things', hi: 'मन, माता, रानी, जनमत, जल, दूध, मोती, चाँदी, बायाँ नेत्र, सोमवार', sa: 'मन, माता, रानी, जनमत, जल, दूध, मोती, चाँदी, बायाँ नेत्र, सोमवार', mai: 'मन, माता, रानी, जनमत, जल, दूध, मोती, चाँदी, बायाँ नेत्र, सोमवार', mr: 'मन, माता, रानी, जनमत, जल, दूध, मोती, चाँदी, बायाँ नेत्र, सोमवार', ta: 'மனம் (மனஸ்), தாய், அரசி, பொது கருத்து, நீர், பால், முத்து, வெள்ளி, இடது கண், திங்கள், வடமேற்கு திசை, வெண்மையான பொருட்கள்', te: 'మనస్సు (మనస్), తల్లి, రాణి, ప్రజాభిప్రాయం, నీరు, పాలు, ముత్యం, వెండి, ఎడమ కన్ను, సోమవారం, వాయువ్య దిక్కు, తెల్లని వస్తువులు', bn: 'মন (মনস), মাতা, রানী, জনমত, জল, দুধ, মুক্তা, রূপা, বাম চোখ, সোমবার, উত্তর-পশ্চিম দিক, সাদা বস্তু', kn: 'ಮನಸ್ಸು (ಮನಸ್), ತಾಯಿ, ರಾಣಿ, ಜನಾಭಿಪ್ರಾಯ, ನೀರು, ಹಾಲು, ಮುತ್ತು, ಬೆಳ್ಳಿ, ಎಡ ಕಣ್ಣು, ಸೋಮವಾರ, ವಾಯವ್ಯ ದಿಕ್ಕು, ಬಿಳಿ ವಸ್ತುಗಳು', gu: 'મન (મનસ), માતા, રાણી, જનમત, જળ, દૂધ, મોતી, ચાંદી, ડાબી આંખ, સોમવાર, વાયવ્ય દિશા, સફેદ વસ્તુઓ' },
  },
  2: {
    orbit: '1.88 years', dashaYears: 7,
    dignity: { en: 'Exalted in Capricorn (28°), Debilitated in Cancer (28°)', hi: 'मकर 28° में उच्च, कर्क 28° में नीच', sa: 'मकरे 28° उच्चः, कर्कटे 28° नीचः' },
    signifies: { en: 'Energy, courage, siblings, property, surgery, military, copper', hi: 'ऊर्जा, साहस, भाई-बहन, सम्पत्ति, शल्य चिकित्सा', sa: 'ऊर्जा, शौर्यं, भ्रातरः, सम्पत्तिः, शल्यचिकित्सा' },
    exaltDeg: 'Capricorn 28°', debilDeg: 'Cancer 28°',
    moolatrikona: { en: 'Aries 0°-12°', hi: 'मेष 0°-12°', sa: 'मेष 0°-12°', mai: 'मेष 0°-12°', mr: 'मेष 0°-12°', ta: 'மேஷம் 0°-12°', te: 'మేషం 0°-12°', bn: 'মেষ 0°-12°', kn: 'ಮೇಷ 0°-12°', gu: 'મેષ 0°-12°' },
    ownSigns: { en: 'Aries, Scorpio', hi: 'मेष, वृश्चिक', sa: 'मेष, वृश्चिक', mai: 'मेष, वृश्चिक', mr: 'मेष, वृश्चिक', ta: 'மேஷம், விருச்சிகம்', te: 'మేషం, వృశ్చికం', bn: 'মেষ, বৃশ্চিক', kn: 'ಮೇಷ, ವೃಶ್ಚಿಕ', gu: 'મેષ, વૃશ્ચિક' },
    combustionDeg: '17°',
    karakatva: { en: 'Courage, brothers, commander, land, blood, surgery, fire, weapons, police, coral, red things, Tuesday, south direction', hi: 'साहस, भाई, सेनापति, भूमि, रक्त, शल्य, अग्नि, शस्त्र, पुलिस, मूँगा, मंगलवार', sa: 'साहस, भाई, सेनापति, भूमि, रक्त, शल्य, अग्नि, शस्त्र, पुलिस, मूँगा, मंगलवार', mai: 'साहस, भाई, सेनापति, भूमि, रक्त, शल्य, अग्नि, शस्त्र, पुलिस, मूँगा, मंगलवार', mr: 'साहस, भाई, सेनापति, भूमि, रक्त, शल्य, अग्नि, शस्त्र, पुलिस, मूँगा, मंगलवार', ta: 'தைரியம், சகோதரர்கள், தளபதி, நிலம், இரத்தம், அறுவை சிகிச்சை, அக்னி, ஆயுதங்கள், காவல், பவளம், சிவப்பு பொருட்கள், செவ்வாய், தெற்கு திசை', te: 'ధైర్యం, సోదరులు, సేనాపతి, భూమి, రక్తం, శస్త్రచికిత్స, అగ్ని, ఆయుధాలు, పోలీసు, పగడం, ఎరుపు వస్తువులు, మంగళవారం, దక్షిణ దిక్కు', bn: 'সাহস, ভাই, সেনাপতি, ভূমি, রক্ত, শল্যচিকিৎসা, অগ্নি, অস্ত্র, পুলিশ, প্রবাল, লাল বস্তু, মঙ্গলবার, দক্ষিণ দিক', kn: 'ಧೈರ್ಯ, ಸಹೋದರರು, ಸೇನಾಪತಿ, ಭೂಮಿ, ರಕ್ತ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಅಗ್ನಿ, ಆಯುಧಗಳು, ಪೊಲೀಸ್, ಹವಳ, ಕೆಂಪು ವಸ್ತುಗಳು, ಮಂಗಳವಾರ, ದಕ್ಷಿಣ ದಿಕ್ಕು', gu: 'સાહસ, ભાઈઓ, સેનાપતિ, ભૂમિ, રક્ત, શસ્ત્રક્રિયા, અગ્નિ, શસ્ત્રો, પોલીસ, પરવાળું, લાલ વસ્તુઓ, મંગળવાર, દક્ષિણ દિશા' },
  },
  3: {
    orbit: '88 days', dashaYears: 17,
    dignity: { en: 'Exalted in Virgo (15°), Debilitated in Pisces (15°)', hi: 'कन्या 15° में उच्च, मीन 15° में नीच', sa: 'कन्यायाम् 15° उच्चः, मीने 15° नीचः' },
    signifies: { en: 'Intelligence, speech, trade, writing, mathematics, friends, green', hi: 'बुद्धि, वाणी, व्यापार, लेखन, गणित, मित्र', sa: 'बुद्धिः, वाक्, वाणिज्यं, लेखनं, गणितं, मित्राणि' },
    exaltDeg: 'Virgo 15°', debilDeg: 'Pisces 15°',
    moolatrikona: { en: 'Virgo 16°-20°', hi: 'कन्या 16°-20°', sa: 'कन्या 16°-20°', mai: 'कन्या 16°-20°', mr: 'कन्या 16°-20°', ta: 'கன்னி 16°-20°', te: 'కన్య 16°-20°', bn: 'কন্যা 16°-20°', kn: 'ಕನ್ಯಾ 16°-20°', gu: 'કન્યા 16°-20°' },
    ownSigns: { en: 'Gemini, Virgo', hi: 'मिथुन, कन्या', sa: 'मिथुन, कन्या', mai: 'मिथुन, कन्या', mr: 'मिथुन, कन्या', ta: 'மிதுனம், கன்னி', te: 'మిథునం, కన్య', bn: 'মিথুন, কন্যা', kn: 'ಮಿಥುನ, ಕನ್ಯಾ', gu: 'મિથુન, કન્યા' },
    combustionDeg: '14° (12° if retro)',
    karakatva: { en: 'Intellect, speech, trade, writing, mathematics, maternal uncle, skin, emerald, green things, Wednesday, north direction, astrology', hi: 'बुद्धि, वाणी, व्यापार, लेखन, गणित, मामा, त्वचा, पन्ना, बुधवार, ज्योतिष', sa: 'बुद्धि, वाणी, व्यापार, लेखन, गणित, मामा, त्वचा, पन्ना, बुधवार, ज्योतिष', mai: 'बुद्धि, वाणी, व्यापार, लेखन, गणित, मामा, त्वचा, पन्ना, बुधवार, ज्योतिष', mr: 'बुद्धि, वाणी, व्यापार, लेखन, गणित, मामा, त्वचा, पन्ना, बुधवार, ज्योतिष', ta: 'புத்தி, பேச்சு, வாணிகம், எழுத்து, கணிதம், மாமா, தோல், மரகதம், பச்சை பொருட்கள், புதன், வடக்கு திசை, ஜோதிடம்', te: 'బుద్ధి, వాక్కు, వ్యాపారం, రచన, గణితం, మేనమామ, చర్మం, మరకతం, ఆకుపచ్చ వస్తువులు, బుధవారం, ఉత్తర దిక్కు, జ్యోతిషం', bn: 'বুদ্ধি, বাক্, বাণিজ্য, লেখা, গণিত, মামা, ত্বক, পান্না, সবুজ বস্তু, বুধবার, উত্তর দিক, জ্যোতিষ', kn: 'ಬುದ್ಧಿ, ವಾಕ್, ವ್ಯಾಪಾರ, ಬರವಣಿಗೆ, ಗಣಿತ, ಸೋದರ ಮಾವ, ಚರ್ಮ, ಮರಕತ, ಹಸಿರು ವಸ್ತುಗಳು, ಬುಧವಾರ, ಉತ್ತರ ದಿಕ್ಕು, ಜ್ಯೋತಿಷ', gu: 'બુદ્ધિ, વાણી, વ્યાપાર, લેખન, ગણિત, મામા, ત્વચા, પન્ના, લીલી વસ્તુઓ, બુધવાર, ઉત્તર દિશા, જ્યોતિષ' },
  },
  4: {
    orbit: '11.86 years', dashaYears: 16,
    dignity: { en: 'Exalted in Cancer (5°), Debilitated in Capricorn (5°)', hi: 'कर्क 5° में उच्च, मकर 5° में नीच', sa: 'कर्कटे 5° उच्चः, मकरे 5° नीचः' },
    signifies: { en: 'Wisdom, fortune, children, dharma, guru, expansion, gold', hi: 'ज्ञान, भाग्य, सन्तान, धर्म, गुरु, विस्तार', sa: 'ज्ञानं, भाग्यं, सन्तानाः, धर्मः, गुरुः, विस्तारः' },
    exaltDeg: 'Cancer 5°', debilDeg: 'Capricorn 5°',
    moolatrikona: { en: 'Sagittarius 0°-10°', hi: 'धनु 0°-10°', sa: 'धनु 0°-10°', mai: 'धनु 0°-10°', mr: 'धनु 0°-10°', ta: 'தனுசு 0°-10°', te: 'ధనుస్సు 0°-10°', bn: 'ধনু 0°-10°', kn: 'ಧನು 0°-10°', gu: 'ધનુ 0°-10°' },
    ownSigns: { en: 'Sagittarius, Pisces', hi: 'धनु, मीन', sa: 'धनु, मीन', mai: 'धनु, मीन', mr: 'धनु, मीन', ta: 'தனுசு, மீனம்', te: 'ధనుస్సు, మీనం', bn: 'ধনু, মীন', kn: 'ಧನು, ಮೀನ', gu: 'ધનુ, મીન' },
    combustionDeg: '11°',
    karakatva: { en: 'Wisdom, children, dharma, guru/teacher, wealth, fortune, fat/liver, yellow sapphire, gold, Thursday, northeast direction, sacred texts', hi: 'ज्ञान, सन्तान, धर्म, गुरु, धन, भाग्य, यकृत, पुखराज, स्वर्ण, गुरुवार, शास्त्र', sa: 'ज्ञान, सन्तान, धर्म, गुरु, धन, भाग्य, यकृत, पुखराज, स्वर्ण, गुरुवार, शास्त्र', mai: 'ज्ञान, सन्तान, धर्म, गुरु, धन, भाग्य, यकृत, पुखराज, स्वर्ण, गुरुवार, शास्त्र', mr: 'ज्ञान, सन्तान, धर्म, गुरु, धन, भाग्य, यकृत, पुखराज, स्वर्ण, गुरुवार, शास्त्र', ta: 'ஞானம், குழந்தைகள், தர்மம், குரு/ஆசிரியர், செல்வம், பாக்கியம், கொழுப்பு/கல்லீரல், புஷ்பராகம், தங்கம், வியாழன், வடகிழக்கு திசை, புனித நூல்கள்', te: 'జ్ఞానం, సంతానం, ధర్మం, గురువు/ఉపాధ్యాయుడు, సంపద, భాగ్యం, కొవ్వు/కాలేయం, పుష్యరాగం, బంగారం, గురువారం, ఈశాన్య దిక్కు, పవిత్ర గ్రంథాలు', bn: 'জ্ঞান, সন্তান, ধর্ম, গুরু/শিক্ষক, সম্পদ, ভাগ্য, মেদ/যকৃৎ, পুষ্পরাগ, স্বর্ণ, বৃহস্পতিবার, ঈশান দিক, পবিত্র গ্রন্থ', kn: 'ಜ್ಞಾನ, ಮಕ್ಕಳು, ಧರ್ಮ, ಗುರು/ಶಿಕ್ಷಕ, ಸಂಪತ್ತು, ಭಾಗ್ಯ, ಕೊಬ್ಬು/ಯಕೃತ್, ಪುಷ್ಯರಾಗ, ಚಿನ್ನ, ಗುರುವಾರ, ಈಶಾನ್ಯ ದಿಕ್ಕು, ಪವಿತ್ರ ಗ್ರಂಥಗಳು', gu: 'જ્ઞાન, સંતાન, ધર્મ, ગુરુ/શિક્ષક, સંપત્તિ, ભાગ્ય, ચરબી/યકૃત, પુષ્પરાગ, સોનું, ગુરુવાર, ઈશાન દિશા, પવિત્ર ગ્રંથો' },
  },
  5: {
    orbit: '225 days', dashaYears: 20,
    dignity: { en: 'Exalted in Pisces (27°), Debilitated in Virgo (27°)', hi: 'मीन 27° में उच्च, कन्या 27° में नीच', sa: 'मीने 27° उच्चः, कन्यायां 27° नीचः' },
    signifies: { en: 'Love, beauty, luxury, art, spouse, vehicles, diamonds', hi: 'प्रेम, सौन्दर्य, विलासिता, कला, जीवनसाथी, वाहन', sa: 'प्रेम, सौन्दर्यं, विलासः, कला, पत्नी, वाहनानि' },
    exaltDeg: 'Pisces 27°', debilDeg: 'Virgo 27°',
    moolatrikona: { en: 'Libra 0°-5°', hi: 'तुला 0°-5°', sa: 'तुला 0°-5°', mai: 'तुला 0°-5°', mr: 'तुला 0°-5°', ta: 'துலாம் 0°-5°', te: 'తులా 0°-5°', bn: 'তুলা 0°-5°', kn: 'ತುಲಾ 0°-5°', gu: 'તુલા 0°-5°' },
    ownSigns: { en: 'Taurus, Libra', hi: 'वृषभ, तुला', sa: 'वृषभ, तुला', mai: 'वृषभ, तुला', mr: 'वृषभ, तुला', ta: 'ரிஷபம், துலாம்', te: 'వృషభం, తులా', bn: 'বৃষ, তুলা', kn: 'ವೃಷಭ, ತುಲಾ', gu: 'વૃષભ, તુલા' },
    combustionDeg: '8° (10° if retro)',
    karakatva: { en: 'Spouse (wife), love, beauty, art, music, luxury, vehicles, diamond, semen, southeast direction, Friday, perfume, flowers', hi: 'पत्नी, प्रेम, सौन्दर्य, कला, संगीत, विलास, वाहन, हीरा, शुक्रवार, सुगन्ध, पुष्प', sa: 'पत्नी, प्रेम, सौन्दर्य, कला, संगीत, विलास, वाहन, हीरा, शुक्रवार, सुगन्ध, पुष्प', mai: 'पत्नी, प्रेम, सौन्दर्य, कला, संगीत, विलास, वाहन, हीरा, शुक्रवार, सुगन्ध, पुष्प', mr: 'पत्नी, प्रेम, सौन्दर्य, कला, संगीत, विलास, वाहन, हीरा, शुक्रवार, सुगन्ध, पुष्प', ta: 'மனைவி, காதல், அழகு, கலை, இசை, ஆடம்பரம், வாகனங்கள், வைரம், விந்து, தென்கிழக்கு திசை, வெள்ளி, நறுமணம், மலர்கள்', te: 'భార్య, ప్రేమ, అందం, కళ, సంగీతం, విలాసం, వాహనాలు, వజ్రం, వీర్యం, ఆగ్నేయ దిక్కు, శుక్రవారం, సుగంధం, పుష్పాలు', bn: 'স্ত্রী, প্রেম, সৌন্দর্য, কলা, সংগীত, বিলাস, যানবাহন, হীরা, বীর্য, দক্ষিণ-পূর্ব দিক, শুক্রবার, সুগন্ধি, ফুল', kn: 'ಪತ್ನಿ, ಪ್ರೇಮ, ಸೌಂದರ್ಯ, ಕಲೆ, ಸಂಗೀತ, ವಿಲಾಸ, ವಾಹನಗಳು, ವಜ್ರ, ವೀರ್ಯ, ಆಗ್ನೇಯ ದಿಕ್ಕು, ಶುಕ್ರವಾರ, ಸುಗಂಧ, ಹೂಗಳು', gu: 'પત્ની, પ્રેમ, સૌંદર્ય, કલા, સંગીત, વિલાસ, વાહનો, હીરો, વીર્ય, અગ્નિ દિશા, શુક્રવાર, સુગંધ, ફૂલો' },
  },
  6: {
    orbit: '29.46 years', dashaYears: 19,
    dignity: { en: 'Exalted in Libra (20°), Debilitated in Aries (20°)', hi: 'तुला 20° में उच्च, मेष 20° में नीच', sa: 'तुलायाम् 20° उच्चः, मेषे 20° नीचः' },
    signifies: { en: 'Discipline, karma, longevity, delays, servants, iron, blue sapphire', hi: 'अनुशासन, कर्म, दीर्घायु, विलम्ब, सेवक', sa: 'अनुशासनं, कर्म, दीर्घायुः, विलम्बः, सेवकाः' },
    exaltDeg: 'Libra 20°', debilDeg: 'Aries 20°',
    moolatrikona: { en: 'Aquarius 0°-20°', hi: 'कुम्भ 0°-20°', sa: 'कुम्भ 0°-20°', mai: 'कुम्भ 0°-20°', mr: 'कुम्भ 0°-20°', ta: 'கும்பம் 0°-20°', te: 'కుంభం 0°-20°', bn: 'কুম্ভ 0°-20°', kn: 'ಕುಂಭ 0°-20°', gu: 'કુંભ 0°-20°' },
    ownSigns: { en: 'Capricorn, Aquarius', hi: 'मकर, कुम्भ', sa: 'मकर, कुम्भ', mai: 'मकर, कुम्भ', mr: 'मकर, कुम्भ', ta: 'மகரம், கும்பம்', te: 'మకరం, కుంభం', bn: 'মকর, কুম্ভ', kn: 'ಮಕರ, ಕುಂಭ', gu: 'મકર, કુંભ' },
    combustionDeg: '15°',
    karakatva: { en: 'Longevity, karma, discipline, servants, old age, sorrow, iron, blue sapphire, Saturday, west direction, oil, black things, democracy', hi: 'आयु, कर्म, अनुशासन, सेवक, वृद्धावस्था, दुःख, लोहा, नीलम, शनिवार, तेल', sa: 'आयु, कर्म, अनुशासन, सेवक, वृद्धावस्था, दुःख, लोहा, नीलम, शनिवार, तेल', mai: 'आयु, कर्म, अनुशासन, सेवक, वृद्धावस्था, दुःख, लोहा, नीलम, शनिवार, तेल', mr: 'आयु, कर्म, अनुशासन, सेवक, वृद्धावस्था, दुःख, लोहा, नीलम, शनिवार, तेल', ta: 'ஆயுள், கர்மா, ஒழுக்கம், பணியாளர்கள், முதுமை, துன்பம், இரும்பு, நீலக்கல், சனி, மேற்கு திசை, எண்ணெய், கருப்பு பொருட்கள், ஜனநாயகம்', te: 'ఆయుష్షు, కర్మ, క్రమశిక్షణ, సేవకులు, వృద్ధాప్యం, దుఃఖం, ఇనుము, నీలమణి, శనివారం, పశ్చిమ దిక్కు, నూనె, నల్లని వస్తువులు, ప్రజాస్వామ్యం', bn: 'আয়ু, কর্ম, শৃঙ্খলা, ভৃত্য, বার্ধক্য, দুঃখ, লোহা, নীলকান্তমণি, শনিবার, পশ্চিম দিক, তেল, কালো বস্তু, গণতন্ত্র', kn: 'ಆಯುಷ್ಯ, ಕರ್ಮ, ಶಿಸ್ತು, ಸೇವಕರು, ವೃದ್ಧಾಪ್ಯ, ದುಃಖ, ಕಬ್ಬಿಣ, ನೀಲಮಣಿ, ಶನಿವಾರ, ಪಶ್ಚಿಮ ದಿಕ್ಕು, ಎಣ್ಣೆ, ಕಪ್ಪು ವಸ್ತುಗಳು, ಪ್ರಜಾಪ್ರಭುತ್ವ', gu: 'આયુષ્ય, કર્મ, અનુશાસન, સેવકો, વૃદ્ધાવસ્થા, દુઃખ, લોખંડ, નીલમ, શનિવાર, પશ્ચિમ દિશા, તેલ, કાળી વસ્તુઓ, લોકશાહી' },
  },
  7: {
    orbit: '18.6 years (nodal cycle)', dashaYears: 18,
    dignity: { en: 'Strong in Taurus, Gemini, Virgo, Aquarius', hi: 'वृषभ/मिथुन/कन्या/कुम्भ में बलवान', sa: 'वृषभ/मिथुन/कन्या/कुम्भराशिषु बलवान्' },
    signifies: { en: 'Obsession, foreign, unconventional, sudden gains, illusion, hessonite', hi: 'आसक्ति, विदेश, अपारम्परिक, आकस्मिक लाभ', sa: 'आसक्तिः, विदेशः, अपारम्परिकं, आकस्मिकलाभः' },
    exaltDeg: 'Taurus/Gemini (varies)', debilDeg: 'Scorpio/Sagittarius',
    moolatrikona: { en: 'Gemini (some authorities)', hi: 'मिथुन (कुछ शास्त्रकारों के अनुसार)', sa: 'मिथुन (कुछ शास्त्रकारों के अनुसार)', mai: 'मिथुन (कुछ शास्त्रकारों के अनुसार)', mr: 'मिथुन (कुछ शास्त्रकारों के अनुसार)', ta: 'மிதுனம் (சில நூல்களின் படி)', te: 'మిథునం (కొన్ని గ్రంథాల ప్రకారం)', bn: 'মিথুন (কিছু শাস্ত্রকার অনুসারে)', kn: 'ಮಿಥುನ (ಕೆಲವು ಶಾಸ್ತ್ರಕಾರರ ಪ್ರಕಾರ)', gu: 'મિથુન (કેટલાક શાસ્ત્રકારો અનુસાર)' },
    ownSigns: { en: 'Aquarius (co-ruler)', hi: 'कुम्भ (सह-स्वामी)', sa: 'कुम्भ (सह-स्वामी)', mai: 'कुम्भ (सह-स्वामी)', mr: 'कुम्भ (सह-स्वामी)', ta: 'கும்பம் (இணை அதிபதி)', te: 'కుంభం (సహ అధిపతి)', bn: 'কুম্ভ (সহ-অধিপতি)', kn: 'ಕುಂಭ (ಸಹ-ಅಧಿಪತಿ)', gu: 'કુંભ (સહ-અધિપતિ)' },
    combustionDeg: 'Never combust',
    karakatva: { en: 'Foreign lands, outcasts, illusion, sudden events, paternal grandfather, serpents, hessonite (gomed), southwest direction, manipulation, obsession', hi: 'विदेश, बहिष्कृत, माया, आकस्मिक घटनाएँ, दादा, सर्प, गोमेद', sa: 'विदेश, बहिष्कृत, माया, आकस्मिक घटनाएँ, दादा, सर्प, गोमेद', mai: 'विदेश, बहिष्कृत, माया, आकस्मिक घटनाएँ, दादा, सर्प, गोमेद', mr: 'विदेश, बहिष्कृत, माया, आकस्मिक घटनाएँ, दादा, सर्प, गोमेद', ta: 'வெளிநாடுகள், புறக்கணிக்கப்பட்டோர், மாயை, திடீர் நிகழ்வுகள், தாத்தா (தந்தை வழி), பாம்புகள், கோமேதகம், தென்மேற்கு திசை, சூழ்ச்சி, பற்று', te: 'విదేశాలు, బహిష్కృతులు, మాయ, ఆకస్మిక సంఘటనలు, తాత (తండ్రి వైపు), సర్పాలు, గోమేధికం, నైఋతి దిక్కు, మోసం, వ్యామోహం', bn: 'বিদেশ, বহিষ্কৃত, মায়া, আকস্মিক ঘটনা, দাদা (পিতামহ), সর্প, গোমেদ, দক্ষিণ-পশ্চিম দিক, কারসাজি, আসক্তি', kn: 'ವಿದೇಶ, ಬಹಿಷ್ಕೃತರು, ಮಾಯೆ, ಆಕಸ್ಮಿಕ ಘಟನೆಗಳು, ತಾತ (ತಂದೆ ಕಡೆ), ಸರ್ಪಗಳು, ಗೋಮೇಧಿಕ, ನೈಋತ್ಯ ದಿಕ್ಕು, ಮೋಸ, ವ್ಯಾಮೋಹ', gu: 'વિદેશ, બહિષ્કૃત, માયા, આકસ્મિક ઘટનાઓ, દાદા (પિતામહ), સર્પ, ગોમેદ, નૈઋત્ય દિશા, છેતરપિંડી, આસક્તિ' },
  },
  8: {
    orbit: '18.6 years (nodal cycle)', dashaYears: 7,
    dignity: { en: 'Strong in Scorpio, Sagittarius, Pisces', hi: 'वृश्चिक/धनु/मीन में बलवान', sa: 'वृश्चिक/धनु/मीनराशिषु बलवान्' },
    signifies: { en: 'Detachment, moksha, past karma, spiritual insight, cat\'s eye', hi: 'वैराग्य, मोक्ष, पूर्व कर्म, आध्यात्मिक अन्तर्दृष्टि', sa: 'वैराग्यं, मोक्षः, पूर्वकर्म, आध्यात्मिकदृष्टिः' },
    exaltDeg: 'Scorpio/Sagittarius (varies)', debilDeg: 'Taurus/Gemini',
    moolatrikona: { en: 'Sagittarius (some authorities)', hi: 'धनु (कुछ शास्त्रकारों के अनुसार)', sa: 'धनु (कुछ शास्त्रकारों के अनुसार)', mai: 'धनु (कुछ शास्त्रकारों के अनुसार)', mr: 'धनु (कुछ शास्त्रकारों के अनुसार)', ta: 'தனுசு (சில நூல்களின் படி)', te: 'ధనుస్సు (కొన్ని గ్రంథాల ప్రకారం)', bn: 'ধনু (কিছু শাস্ত্রকার অনুসারে)', kn: 'ಧನು (ಕೆಲವು ಶಾಸ್ತ್ರಕಾರರ ಪ್ರಕಾರ)', gu: 'ધનુ (કેટલાક શાસ્ત્રકારો અનુસાર)' },
    ownSigns: { en: 'Scorpio (co-ruler)', hi: 'वृश्चिक (सह-स्वामी)', sa: 'वृश्चिक (सह-स्वामी)', mai: 'वृश्चिक (सह-स्वामी)', mr: 'वृश्चिक (सह-स्वामी)', ta: 'விருச்சிகம் (இணை அதிபதி)', te: 'వృశ్చికం (సహ అధిపతి)', bn: 'বৃশ্চিক (সহ-অধিপতি)', kn: 'ವೃಶ್ಚಿಕ (ಸಹ-ಅಧಿಪತಿ)', gu: 'વૃશ્ચિક (સહ-અધિપતિ)' },
    combustionDeg: 'Never combust',
    karakatva: { en: 'Moksha, spiritual liberation, maternal grandfather, ascetics, flag, cat\'s eye (vaidurya), abstract knowledge, sharp objects, epidemics', hi: 'मोक्ष, आध्यात्मिक मुक्ति, नाना, संन्यासी, ध्वज, वैडूर्य, अमूर्त ज्ञान' },
  },
};

/* ── Friendship table ─────────────────────────────────────────────── */
const FRIENDSHIP_TABLE = [
  { planet: 'Sun / सूर्य', friends: 'Moon, Mars, Jupiter', neutrals: 'Mercury', enemies: 'Venus, Saturn' },
  { planet: 'Moon / चन्द्र', friends: 'Sun, Mercury', neutrals: 'Mars, Jupiter, Venus, Saturn', enemies: 'None' },
  { planet: 'Mars / मंगल', friends: 'Sun, Moon, Jupiter', neutrals: 'Venus, Saturn', enemies: 'Mercury' },
  { planet: 'Mercury / बुध', friends: 'Sun, Venus', neutrals: 'Mars, Jupiter, Saturn', enemies: 'Moon' },
  { planet: 'Jupiter / बृहस्पति', friends: 'Sun, Moon, Mars', neutrals: 'Saturn', enemies: 'Mercury, Venus' },
  { planet: 'Venus / शुक्र', friends: 'Mercury, Saturn', neutrals: 'Mars, Jupiter', enemies: 'Sun, Moon' },
  { planet: 'Saturn / शनि', friends: 'Mercury, Venus', neutrals: 'Jupiter', enemies: 'Sun, Moon, Mars' },
];

/* ── Dignity table ────────────────────────────────────────────────── */
const DIGNITY_TABLE = [
  { planet: 'Sun', exalt: 'Aries 10°', moola: 'Leo 0°-20°', own: 'Leo', debil: 'Libra 10°' },
  { planet: 'Moon', exalt: 'Taurus 3°', moola: 'Taurus 4°-20°', own: 'Cancer', debil: 'Scorpio 3°' },
  { planet: 'Mars', exalt: 'Capricorn 28°', moola: 'Aries 0°-12°', own: 'Aries, Scorpio', debil: 'Cancer 28°' },
  { planet: 'Mercury', exalt: 'Virgo 15°', moola: 'Virgo 16°-20°', own: 'Gemini, Virgo', debil: 'Pisces 15°' },
  { planet: 'Jupiter', exalt: 'Cancer 5°', moola: 'Sagittarius 0°-10°', own: 'Sagittarius, Pisces', debil: 'Capricorn 5°' },
  { planet: 'Venus', exalt: 'Pisces 27°', moola: 'Libra 0°-5°', own: 'Taurus, Libra', debil: 'Virgo 27°' },
  { planet: 'Saturn', exalt: 'Libra 20°', moola: 'Aquarius 0°-20°', own: 'Capricorn, Aquarius', debil: 'Aries 20°' },
];

/* ── Combustion ranges ────────────────────────────────────────────── */
const COMBUSTION_TABLE = [
  { planet: 'Moon / चन्द्र', degrees: '12°', note: 'Widest range; Amavasya = fully combust' },
  { planet: 'Mars / मंगल', degrees: '17°', note: 'Courage and energy diminished' },
  { planet: 'Mercury / बुध', degrees: '14° (12° retro)', note: 'Frequently combust due to proximity to Sun' },
  { planet: 'Jupiter / बृहस्पति', degrees: '11°', note: 'Wisdom and fortune weakened' },
  { planet: 'Venus / शुक्र', degrees: '8° (10° retro)', note: 'Narrowest; relationships suffer' },
  { planet: 'Saturn / शनि', degrees: '15°', note: 'Discipline and longevity affected' },
];

/* ── Special aspects ──────────────────────────────────────────────── */
const SPECIAL_ASPECTS = [
  { planet: 'Mars / मंगल', aspects: '4th, 7th, 8th', desc: { en: 'Mars aspects the 4th (property, home), 7th (spouse, partnerships), and 8th (longevity, hidden matters) from its position. This makes Mars influential over domestic life, marriage, and transformative events.', hi: 'मंगल अपने स्थान से 4थे (सम्पत्ति), 7वें (जीवनसाथी) और 8वें (आयु, गूढ़ विषय) भाव पर दृष्टि डालता है।', sa: 'मंगल अपने स्थान से 4थे (सम्पत्ति), 7वें (जीवनसाथी) और 8वें (आयु, गूढ़ विषय) भाव पर दृष्टि डालता है।', mai: 'मंगल अपने स्थान से 4थे (सम्पत्ति), 7वें (जीवनसाथी) और 8वें (आयु, गूढ़ विषय) भाव पर दृष्टि डालता है।', mr: 'मंगल अपने स्थान से 4थे (सम्पत्ति), 7वें (जीवनसाथी) और 8वें (आयु, गूढ़ विषय) भाव पर दृष्टि डालता है।', ta: 'செவ்வாய் தனது நிலையிலிருந்து 4வது (சொத்து, வீடு), 7வது (மனைவி, பங்குதாரர்கள்), 8வது (ஆயுள், மறைவான விஷயங்கள்) பாவங்களைப் பார்க்கிறது. இது குடும்ப வாழ்க்கை, திருமணம் மற்றும் மாற்றத்தை ஏற்படுத்தும் நிகழ்வுகளில் செவ்வாயின் ஆதிக்கத்தை உருவாக்குகிறது.', te: 'కుజుడు తన స్థానం నుండి 4వ (ఆస్తి, ఇల్లు), 7వ (భార్య, భాగస్వామ్యాలు), 8వ (ఆయుష్షు, రహస్య విషయాలు) భావాలను చూస్తాడు. ఇది గృహ జీవితం, వివాహం మరియు పరివర్తనాత్మక సంఘటనలపై కుజుడి ప్రభావాన్ని చేస్తుంది.', bn: 'মঙ্গল নিজের স্থান থেকে ৪র্থ (সম্পত্তি, গৃহ), ৭ম (স্ত্রী, অংশীদারিত্ব), ৮ম (আয়ু, গূঢ় বিষয়) ভাবে দৃষ্টি দেয়। এটি গৃহজীবন, বিবাহ এবং রূপান্তরমূলক ঘটনায় মঙ্গলের প্রভাব সৃষ্টি করে।', kn: 'ಕುಜನು ತನ್ನ ಸ್ಥಾನದಿಂದ 4ನೇ (ಆಸ್ತಿ, ಮನೆ), 7ನೇ (ಪತ್ನಿ, ಪಾಲುದಾರಿಕೆ), 8ನೇ (ಆಯುಷ್ಯ, ರಹಸ್ಯ ವಿಷಯಗಳು) ಭಾವಗಳನ್ನು ನೋಡುತ್ತಾನೆ. ಇದು ಗೃಹ ಜೀವನ, ವಿವಾಹ ಮತ್ತು ಪರಿವರ್ತನಾತ್ಮಕ ಘಟನೆಗಳ ಮೇಲೆ ಕುಜನ ಪ್ರಭಾವವನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ.', gu: 'મંગળ પોતાની સ્થિતિમાંથી 4થા (સંપત્તિ, ઘર), 7મા (પત્ની, ભાગીદારી), 8મા (આયુષ્ય, ગુપ્ત વિષયો) ભાવો પર દૃષ્ટિ કરે છે. આ ગૃહ જીવન, લગ્ન અને પરિવર્તનકારી ઘટનાઓ પર મંગળનો પ્રભાવ બનાવે છે.' } },
  { planet: 'Jupiter / बृहस्पति', aspects: '5th, 7th, 9th', desc: { en: 'Jupiter aspects the 5th (children, intelligence), 7th (marriage), and 9th (dharma, fortune). Jupiter\'s aspects are considered highly benefic — they protect and nourish the houses they touch.', hi: 'बृहस्पति 5वें (सन्तान, बुद्धि), 7वें (विवाह) और 9वें (धर्म, भाग्य) भाव पर दृष्टि डालता है। बृहस्पति की दृष्टि अत्यन्त शुभ मानी जाती है।' } },
  { planet: 'Saturn / शनि', aspects: '3rd, 7th, 10th', desc: { en: 'Saturn aspects the 3rd (courage, effort), 7th (partnerships), and 10th (career, authority). Saturn\'s aspects bring discipline, delays, and lessons to these houses — they mature over time.', hi: 'शनि 3रे (साहस), 7वें (साझेदारी) और 10वें (व्यवसाय, अधिकार) भाव पर दृष्टि डालता है। शनि की दृष्टि अनुशासन, विलम्ब और शिक्षा लाती है।' } },
  { planet: 'Rahu / राहु', aspects: '5th, 7th, 9th', desc: { en: 'Rahu casts aspects like Jupiter (5th, 7th, 9th) but with an obsessive, unconventional, and amplifying quality. Some authorities do not accept Rahu\'s special aspects.', hi: 'राहु बृहस्पति जैसी दृष्टि (5, 7, 9) डालता है किन्तु आसक्ति और अपारम्परिकता के साथ। कुछ शास्त्रकार राहु की विशेष दृष्टि स्वीकार नहीं करते।' } },
  { planet: 'Ketu / केतु', aspects: '5th, 7th, 9th', desc: { en: 'Ketu\'s aspects mirror Rahu\'s — 5th, 7th, 9th — but with a spiritual, detaching, and karmic quality. Ketu\'s influence strips away material attachment from the houses it aspects.', hi: 'केतु की दृष्टि राहु जैसी (5, 7, 9) होती है किन्तु आध्यात्मिक, वैरागिक और कार्मिक गुण के साथ।' } },
];

/* ── Upagraha data ───────────────────────────────────────────────── */
const UPAGRAHAS = [
  { name: { en: 'Dhuma', hi: 'धूम', sa: 'धूमः' }, formula: { en: 'Sun + 133°20\'', hi: 'सूर्य + 133°20\'', sa: 'सूर्यः + 133°20\'' }, signifies: { en: 'Smoke, pollution, confusion, inauspiciousness. Dhuma in a house creates haze and unclear outcomes. Associated with obstacles from hidden enemies and confusion in decisions.', hi: 'धुआँ, प्रदूषण, भ्रम, अशुभता। धूम किसी भाव में धुंध और अस्पष्ट परिणाम बनाता है। छिपे शत्रुओं से बाधा और निर्णयों में भ्रम से जुड़ा।', sa: 'धूमः, प्रदूषणम्, भ्रमः, अशुभता।' } },
  { name: { en: 'Vyatipata', hi: 'व्यतीपात', sa: 'व्यतीपातः' }, formula: { en: '360° - Dhuma', hi: '360° - धूम', sa: '360° - धूमः' }, signifies: { en: 'Calamity, extreme misfortune. Vyatipata is considered one of the most inauspicious Upagrahas. Its placement shows where sudden reversals and unexpected disasters may occur. Particularly feared in muhurta calculations.', hi: 'आपदा, अत्यधिक दुर्भाग्य। व्यतीपात सबसे अशुभ उपग्रहों में से एक माना जाता है। इसका स्थान दर्शाता है कहाँ अचानक उलटफेर हो सकते हैं।', sa: 'विपत्तिः, अत्यधिकदुर्भाग्यम्।' } },
  { name: { en: 'Parivesha', hi: 'परिवेश', sa: 'परिवेषः' }, formula: { en: 'Vyatipata + 180°', hi: 'व्यतीपात + 180°', sa: 'व्यतीपातः + 180°' }, signifies: { en: 'Halo, encirclement, boundary. Parivesha can indicate being surrounded by obstacles or protective boundaries. It sometimes shows a sense of entrapment but also divine protection through circles of grace.', hi: 'प्रभामण्डल, परिवेष्टन, सीमा। परिवेश बाधाओं से घिरे होने या रक्षात्मक सीमाओं को दर्शा सकता है।', sa: 'प्रभामण्डलम्, परिवेष्टनम्, सीमा।' } },
  { name: { en: 'Indra Chapa (Indra Dhanus)', hi: 'इन्द्र चाप', sa: 'इन्द्रचापः' }, formula: { en: '360° - Parivesha', hi: '360° - परिवेश', sa: '360° - परिवेषः' }, signifies: { en: 'Rainbow, Indra\'s bow. Associated with sudden fortune or disaster depending on dignity. Can indicate government favor or punishment, dramatic turns of fate, and encounters with authority. Named after Indra, king of the Devas.', hi: 'इन्द्रधनुष, इन्द्र का धनुष। स्थिति के अनुसार अचानक सौभाग्य या आपदा। सरकारी कृपा या दण्ड, भाग्य के नाटकीय मोड़ दर्शा सकता है।', sa: 'इन्द्रधनुः। स्थित्यनुसारं आकस्मिकसौभाग्यम् आपदा वा।' } },
  { name: { en: 'Upaketu', hi: 'उपकेतु', sa: 'उपकेतुः' }, formula: { en: 'Indra Chapa + 16°40\'', hi: 'इन्द्र चाप + 16°40\'', sa: 'इन्द्रचापः + 16°40\'' }, signifies: { en: 'Sub-Ketu, secondary shadow. Functions like a minor Ketu — bringing detachment, spiritual inclination, and sudden events. Upaketu in a house can indicate unexpected losses but also sudden spiritual insights. Its effects are more subtle than Ketu but in a similar vein.', hi: 'उप-केतु, द्वितीयक छाया। लघु केतु जैसा कार्य करता है — वैराग्य, आध्यात्मिक प्रवृत्ति और अचानक घटनाएँ लाता है।', sa: 'उपकेतुः, द्वितीयकच्छाया। लघुकेतुवत् कार्यं करोति — वैराग्यम्, आध्यात्मिकप्रवृत्तिम्, आकस्मिकघटनाश्च आनयति।' } },
];

/* ── Cross-reference links ────────────────────────────────────────── */
const CROSS_REFS = [
  { href: '/learn/nakshatras', label: { en: 'Nakshatras — 27 Lunar Mansions', hi: 'नक्षत्र — 27 चन्द्र गृह', sa: 'नक्षत्र — 27 चन्द्र गृह', mai: 'नक्षत्र — 27 चन्द्र गृह', mr: 'नक्षत्र — 27 चन्द्र गृह', ta: 'நட்சத்திரங்கள் — 27 சந்திர மாளிகைகள்', te: 'నక్షత్రాలు — 27 చంద్ర భవనాలు', bn: 'নক্ষত্র — ২৭ চন্দ্র ভবন', kn: 'ನಕ್ಷತ್ರಗಳು — 27 ಚಂದ್ರ ಭವನಗಳು', gu: 'નક્ષત્રો — 27 ચંદ્ર ભવનો' }, desc: { en: 'Each Nakshatra is ruled by a specific Graha', hi: 'प्रत्येक नक्षत्र एक विशिष्ट ग्रह द्वारा शासित', sa: 'प्रत्येक नक्षत्र एक विशिष्ट ग्रह द्वारा शासित', mai: 'प्रत्येक नक्षत्र एक विशिष्ट ग्रह द्वारा शासित', mr: 'प्रत्येक नक्षत्र एक विशिष्ट ग्रह द्वारा शासित', ta: 'ஒவ்வொரு நட்சத்திரமும் ஒரு குறிப்பிட்ட கிரகத்தால் ஆளப்படுகிறது', te: 'ప్రతి నక్షత్రానికి ఒక నిర్దిష్ట గ్రహం అధిపతి', bn: 'প্রতিটি নক্ষত্র একটি নির্দিষ্ট গ্রহ দ্বারা শাসিত', kn: 'ಪ್ರತಿ ನಕ್ಷತ್ರವನ್ನು ಒಂದು ನಿರ್ದಿಷ್ಟ ಗ್ರಹ ಆಳುತ್ತದೆ', gu: 'દરેક નક્ષત્ર એક ચોક્કસ ગ્રહ દ્વારા શાસિત છે' } },
  { href: '/learn/kundali', label: { en: 'Kundali — Birth Chart Basics', hi: 'कुण्डली — जन्म कुण्डली मूल बातें', sa: 'कुण्डली — जन्म कुण्डली मूल बातें', mai: 'कुण्डली — जन्म कुण्डली मूल बातें', mr: 'कुण्डली — जन्म कुण्डली मूल बातें', ta: 'குண்டலி — ஜாதக அடிப்படைகள்', te: 'కుండలి — జాతక ప్రాథమికాలు', bn: 'কুণ্ডলী — জন্ম কুণ্ডলী মূল বিষয়', kn: 'ಕುಂಡಲಿ — ಜಾತಕ ಮೂಲಾಂಶಗಳು', gu: 'કુંડળી — જન્મ કુંડળી મૂળ બાબતો' }, desc: { en: 'How Grahas are placed in houses and signs', hi: 'ग्रह भावों और राशियों में कैसे स्थित होते हैं', sa: 'ग्रह भावों और राशियों में कैसे स्थित होते हैं', mai: 'ग्रह भावों और राशियों में कैसे स्थित होते हैं', mr: 'ग्रह भावों और राशियों में कैसे स्थित होते हैं', ta: 'கிரகங்கள் பாவங்களிலும் ராசிகளிலும் எவ்வாறு அமைகின்றன', te: 'గ్రహాలు భావాలలో మరియు రాశులలో ఎలా ఉంటాయి', bn: 'গ্রহগুলি ভাব ও রাশিতে কীভাবে স্থিত হয়', kn: 'ಗ್ರಹಗಳು ಭಾವಗಳಲ್ಲಿ ಮತ್ತು ರಾಶಿಗಳಲ್ಲಿ ಹೇಗೆ ಸ್ಥಿತವಾಗಿವೆ', gu: 'ગ્રહો ભાવો અને રાશિઓમાં કેવી રીતે સ્થિત હોય છે' } },
  { href: '/learn/bhavas', label: { en: 'Bhavas — The 12 Houses', hi: 'भाव — 12 भाव', sa: 'भाव — 12 भाव', mai: 'भाव — 12 भाव', mr: 'भाव — 12 भाव', ta: 'பாவங்கள் — 12 பாவங்கள்', te: 'భావాలు — 12 భావాలు', bn: 'ভাব — ১২টি ভাব', kn: 'ಭಾವಗಳು — 12 ಭಾವಗಳು', gu: 'ભાવો — 12 ભાવો' }, desc: { en: 'The houses that Grahas occupy and influence', hi: 'वे भाव जिनमें ग्रह स्थित होते हैं और प्रभावित करते हैं', sa: 'वे भाव जिनमें ग्रह स्थित होते हैं और प्रभावित करते हैं', mai: 'वे भाव जिनमें ग्रह स्थित होते हैं और प्रभावित करते हैं', mr: 'वे भाव जिनमें ग्रह स्थित होते हैं और प्रभावित करते हैं', ta: 'கிரகங்கள் இருக்கும் மற்றும் பாதிக்கும் பாவங்கள்', te: 'గ్రహాలు ఆక్రమించే మరియు ప్రభావితం చేసే భావాలు', bn: 'গ্রহগুলি যে ভাবে অবস্থান করে এবং প্রভাবিত করে', kn: 'ಗ್ರಹಗಳು ಆಕ್ರಮಿಸುವ ಮತ್ತು ಪ್ರಭಾವಿಸುವ ಭಾವಗಳು', gu: 'ગ્રહો જે ભાવોમાં બિરાજે છે અને પ્રભાવિત કરે છે' } },
  { href: '/learn/dashas', label: { en: 'Dashas — Planetary Periods', hi: 'दशा — ग्रह काल', sa: 'दशा — ग्रह काल', mai: 'दशा — ग्रह काल', mr: 'दशा — ग्रह काल', ta: 'தசைகள் — கிரக காலங்கள்', te: 'దశలు — గ్రహ కాలాలు', bn: 'দশা — গ্রহ কাল', kn: 'ದಶೆಗಳು — ಗ್ರಹ ಕಾಲಗಳು', gu: 'દશાઓ — ગ્રહ કાળ' }, desc: { en: 'How planetary periods unfold across life', hi: 'ग्रह काल जीवन में कैसे प्रकट होते हैं', sa: 'ग्रह काल जीवन में कैसे प्रकट होते हैं', mai: 'ग्रह काल जीवन में कैसे प्रकट होते हैं', mr: 'ग्रह काल जीवन में कैसे प्रकट होते हैं', ta: 'கிரக காலங்கள் வாழ்க்கையில் எவ்வாறு விரிகின்றன', te: 'గ్రహ కాలాలు జీవితంలో ఎలా విస్తరిస్తాయి', bn: 'গ্রহ কাল জীবনে কীভাবে প্রকাশ পায়', kn: 'ಗ್ರಹ ಕಾಲಗಳು ಜೀವನದಲ್ಲಿ ಹೇಗೆ ತೆರೆದುಕೊಳ್ಳುತ್ತವೆ', gu: 'ગ્રહ કાળ જીવનમાં કેવી રીતે પ્રગટ થાય છે' } },
  { href: '/learn/yogas', label: { en: 'Yogas — Planetary Combinations', hi: 'योग — ग्रह संयोग', sa: 'योग — ग्रह संयोग', mai: 'योग — ग्रह संयोग', mr: 'योग — ग्रह संयोग', ta: 'யோகங்கள் — கிரக சேர்க்கைகள்', te: 'యోగాలు — గ్రహ కలయికలు', bn: 'যোগ — গ্রহ সংযোগ', kn: 'ಯೋಗಗಳು — ಗ್ರಹ ಸಂಯೋಗಗಳು', gu: 'યોગો — ગ્રહ સંયોગો' }, desc: { en: 'Special combinations formed by Grahas', hi: 'ग्रहों द्वारा बनने वाले विशेष संयोग', sa: 'ग्रहों द्वारा बनने वाले विशेष संयोग', mai: 'ग्रहों द्वारा बनने वाले विशेष संयोग', mr: 'ग्रहों द्वारा बनने वाले विशेष संयोग', ta: 'கிரகங்களால் உருவாகும் சிறப்பு சேர்க்கைகள்', te: 'గ్రహాల వల్ల ఏర్పడే ప్రత్యేక కలయికలు', bn: 'গ্রহগুলির দ্বারা গঠিত বিশেষ সংযোগ', kn: 'ಗ್ರಹಗಳಿಂದ ರಚಿತವಾದ ವಿಶೇಷ ಸಂಯೋಗಗಳು', gu: 'ગ્રહો દ્વારા રચાતા વિશેષ સંયોગો' } },
  { href: '/learn/sade-sati', label: { en: 'Sade Sati — Saturn\'s 7.5-Year Transit', hi: 'साढ़े साती — शनि का गोचर' }, desc: { en: 'Saturn\'s transit over your Moon sign', hi: 'आपकी चन्द्र राशि पर शनि का गोचर' } },
];

export default function LearnGrahasPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tObj = (obj: any) => (obj as Record<string, string>)[locale] || obj?.en || '';
  const loc = isIndicLocale(locale) ? 'hi' as const : 'en' as const; // fallback sa→hi for inline labels that only have en/hi

  return (
    <div>
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('overviewTitle')}
        </h2>
        <p className="text-text-secondary">{t('grahasSubtitle')}</p>
      </div>

      {/* ── Sanskrit Key Terms ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Graha" devanagari="ग्रह" transliteration="Graha" meaning="That which grasps" />
        <SanskritTermCard term="Uccha" devanagari="उच्च" transliteration="Ucca" meaning="Exalted (strongest)" />
        <SanskritTermCard term="Neecha" devanagari="नीच" transliteration="Nīca" meaning="Debilitated (weakest)" />
        <SanskritTermCard term="Vakri" devanagari="वक्री" transliteration="Vakrī" meaning="Retrograde" />
        <SanskritTermCard term="Asta" devanagari="अस्त" transliteration="Asta" meaning="Combust (near Sun)" />
        <SanskritTermCard term="Drishti" devanagari="दृष्टि" transliteration="Dṛṣṭi" meaning="Aspect (planetary glance)" />
        <SanskritTermCard term="Mitra" devanagari="मित्र" transliteration="Mitra" meaning="Friend (planet)" />
        <SanskritTermCard term="Shatru" devanagari="शत्रु" transliteration="Śatru" meaning="Enemy (planet)" />
        <SanskritTermCard term="Karaka" devanagari="कारक" transliteration="Kāraka" meaning="Significator" />
        <SanskritTermCard term="Dasha" devanagari="दशा" transliteration="Daśā" meaning="Planetary period" />
      </div>

      {/* ── Section 1: Overview ───────────────────────────────────── */}
      <LessonSection number={1} title={!isIndicLocale(locale) ? 'What are the Navagraha?' : isIndicLocale(locale) ? 'नवग्रह क्या हैं?' : 'नवग्रहाः के?'}>
        <p>{t('overviewContent')}</p>
        <p className="mt-3">{t('overviewContent2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-1">
            {!isIndicLocale(locale) ? 'Graha ≠ Planet. Graha = "That which seizes" (√grah = to grasp)' : 'ग्रह ≠ ग्रह। ग्रह = "जो पकड़ता है" (√ग्रह् = ग्रहण करना)'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {!isIndicLocale(locale) ? '7 physical bodies + 2 mathematical shadow points = 9 Grahas' : '7 भौतिक पिण्ड + 2 गणितीय छाया बिन्दु = 9 ग्रह'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 2: Benefics vs Malefics ───────────────────────── */}
      <LessonSection number={2} title={t('beneficMaleficTitle')}>
        <p>{t('beneficMaleficContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-emerald-400/20 bg-emerald-400/5">
            <h4 className="text-emerald-400 font-bold mb-2">{!isIndicLocale(locale) ? 'Natural Benefics (Shubha)' : 'नैसर्गिक शुभ ग्रह'}</h4>
            <div className="space-y-1 text-text-secondary text-sm">
              <p>♃ {!isIndicLocale(locale) ? 'Jupiter — Greatest benefic (Guru)' : 'बृहस्पति — सर्वोत्तम शुभ (गुरु)'}</p>
              <p>♀ {!isIndicLocale(locale) ? 'Venus — Benefic of beauty and love' : 'शुक्र — सौन्दर्य और प्रेम का शुभ ग्रह'}</p>
              <p>☽ {!isIndicLocale(locale) ? 'Moon — Benefic when waxing (Shukla Paksha)' : 'चन्द्र — शुक्ल पक्ष में शुभ'}</p>
              <p>☿ {!isIndicLocale(locale) ? 'Mercury — Benefic when unafflicted' : 'बुध — अपीड़ित होने पर शुभ'}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-red-400/20 bg-red-400/5">
            <h4 className="text-red-400 font-bold mb-2">{!isIndicLocale(locale) ? 'Natural Malefics (Papa)' : 'नैसर्गिक पाप ग्रह'}</h4>
            <div className="space-y-1 text-text-secondary text-sm">
              <p>☉ {!isIndicLocale(locale) ? 'Sun — Separative, burning influence' : 'सूर्य — पृथक करने वाला, दाहक प्रभाव'}</p>
              <p>♂ {!isIndicLocale(locale) ? 'Mars — Aggressive, conflict-prone' : 'मंगल — आक्रामक, संघर्षशील'}</p>
              <p>♄ {!isIndicLocale(locale) ? 'Saturn — Restrictive, delays, karma' : 'शनि — प्रतिबन्धक, विलम्ब, कर्म'}</p>
              <p>☊ {!isIndicLocale(locale) ? 'Rahu — Obsessive, illusory, amplifying' : 'राहु — आसक्तिकर, मायावी, प्रवर्धक'}</p>
              <p>☋ {!isIndicLocale(locale) ? 'Ketu — Detaching, karmic, spiritual' : 'केतु — विरक्तिकर, कार्मिक, आध्यात्मिक'}</p>
              <p>☽ {!isIndicLocale(locale) ? 'Moon — Malefic when waning (Krishna Paksha)' : 'चन्द्र — कृष्ण पक्ष में पाप'}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/80 text-sm italic">{t('beneficNote')}</p>
        </div>
      </LessonSection>

      {/* ── Section 3: Planetary Friendships ──────────────────────── */}
      <LessonSection number={3} title={t('friendshipTitle')}>
        <p>{t('friendshipContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-primary font-semibold">{!isIndicLocale(locale) ? 'Planet' : 'ग्रह'}</th>
                <th className="text-left py-2 px-3 text-emerald-400 font-semibold">{!isIndicLocale(locale) ? 'Friends (Mitra)' : 'मित्र'}</th>
                <th className="text-left py-2 px-3 text-amber-400 font-semibold">{!isIndicLocale(locale) ? 'Neutral (Sama)' : 'सम'}</th>
                <th className="text-left py-2 px-3 text-red-400 font-semibold">{!isIndicLocale(locale) ? 'Enemies (Shatru)' : 'शत्रु'}</th>
              </tr>
            </thead>
            <tbody>
              {FRIENDSHIP_TABLE.map((row) => (
                <tr key={row.planet} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className="py-2 px-3 text-gold-light font-medium">{row.planet}</td>
                  <td className="py-2 px-3 text-emerald-400/80">{row.friends}</td>
                  <td className="py-2 px-3 text-amber-400/80">{row.neutrals}</td>
                  <td className="py-2 px-3 text-red-400/80">{row.enemies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {!isIndicLocale(locale) ? 'Panchada Maitri (5-fold) = Natural + Temporal combined:' : 'पंचधा मैत्री = नैसर्गिक + तात्कालिक संयुक्त:'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en'
              ? 'Friend + Friend = Adhi Mitra (great friend) | Enemy + Enemy = Adhi Shatru (great enemy)'
              : 'मित्र + मित्र = अधिमित्र | शत्रु + शत्रु = अधिशत्रु'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 4: Planetary Dignities ────────────────────────── */}
      <LessonSection number={4} title={t('dignityTitle')}>
        <p>{t('dignityContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-primary font-semibold">{!isIndicLocale(locale) ? 'Planet' : 'ग्रह'}</th>
                <th className="text-left py-2 px-3 text-emerald-400 font-semibold">{!isIndicLocale(locale) ? 'Exaltation (Uccha)' : 'उच्च'}</th>
                <th className="text-left py-2 px-3 text-amber-400 font-semibold">{!isIndicLocale(locale) ? 'Moolatrikona' : 'मूलत्रिकोण'}</th>
                <th className="text-left py-2 px-3 text-blue-400 font-semibold">{!isIndicLocale(locale) ? 'Own Sign (Swakshetra)' : 'स्वक्षेत्र'}</th>
                <th className="text-left py-2 px-3 text-red-400 font-semibold">{!isIndicLocale(locale) ? 'Debilitation (Neecha)' : 'नीच'}</th>
              </tr>
            </thead>
            <tbody>
              {DIGNITY_TABLE.map((row) => (
                <tr key={row.planet} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className="py-2 px-3 text-gold-light font-medium">{row.planet}</td>
                  <td className="py-2 px-3 text-emerald-400/80">{row.exalt}</td>
                  <td className="py-2 px-3 text-amber-400/80">{row.moola}</td>
                  <td className="py-2 px-3 text-blue-400/80">{row.own}</td>
                  <td className="py-2 px-3 text-red-400/80">{row.debil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {!isIndicLocale(locale) ? 'Strength hierarchy: Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated' : 'बल क्रम: उच्च > मूलत्रिकोण > स्वक्षेत्र > मित्र > सम > शत्रु > नीच'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {!isIndicLocale(locale) ? 'Note: Rahu & Ketu dignities are debated; listed signs are from Parashari tradition' : 'नोट: राहु और केतु की गरिमा विवादित है; सूचीबद्ध राशियाँ पाराशरी परम्परा से हैं'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 5: Combustion ─────────────────────────────────── */}
      <LessonSection number={5} title={t('combustionTitle')}>
        <p>{t('combustionContent')}</p>
        <div className="mt-4 space-y-2">
          {COMBUSTION_TABLE.map((row) => (
            <div key={row.planet} className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/5">
              <span className="text-gold-light font-medium text-sm w-36 flex-shrink-0">{row.planet}</span>
              <span className="text-red-400 font-mono text-sm w-28 flex-shrink-0">{!isIndicLocale(locale) ? 'within' : ''} {row.degrees} {!isIndicLocale(locale) ? 'of Sun' : 'सूर्य से'}</span>
              <span className="text-text-secondary/75 text-xs">{!isIndicLocale(locale) ? row.note : ''}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/80 text-sm italic">
            {locale === 'en'
              ? 'Rahu and Ketu are shadow points (lunar nodes) and cannot be combust. Some texts also exempt a planet in its own sign from full combustion effects.'
              : 'राहु और केतु छाया बिन्दु हैं और अस्त नहीं हो सकते। कुछ ग्रन्थ स्वराशि में स्थित ग्रह को पूर्ण अस्त प्रभाव से मुक्त मानते हैं।'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 6: Retrograde ─────────────────────────────────── */}
      <LessonSection number={6} title={t('retrogradeTitle')}>
        <p>{t('retrogradeContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/50 text-center">
            <div className="text-gold-primary font-bold text-lg mb-1">{!isIndicLocale(locale) ? 'Can Be Retrograde' : 'वक्री हो सकते हैं'}</div>
            <p className="text-text-secondary text-sm">Mars, Mercury, Jupiter, Venus, Saturn</p>
          </div>
          <div className="p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/50 text-center">
            <div className="text-gold-primary font-bold text-lg mb-1">{!isIndicLocale(locale) ? 'Never Retrograde' : 'कभी वक्री नहीं'}</div>
            <p className="text-text-secondary text-sm">Sun, Moon</p>
          </div>
          <div className="p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/50 text-center">
            <div className="text-gold-primary font-bold text-lg mb-1">{!isIndicLocale(locale) ? 'Always Retrograde' : 'सदा वक्री'}</div>
            <p className="text-text-secondary text-sm">Rahu, Ketu ({!isIndicLocale(locale) ? 'mean motion' : 'मध्यम गति'})</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/80 text-sm italic">{t('retrogradeNote')}</p>
        </div>
      </LessonSection>

      {/* ── Section 7: Planetary Aspects ──────────────────────────── */}
      <LessonSection number={7} title={t('aspectsTitle')}>
        <p>{t('aspectsContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10 mb-4">
          <p className="text-gold-light font-mono text-sm">
            {!isIndicLocale(locale) ? 'Universal Rule: All planets aspect the 7th house from themselves (full 100% Drishti)' : 'सार्वभौमिक नियम: सभी ग्रह अपने 7वें भाव पर पूर्ण दृष्टि (100%) डालते हैं'}
          </p>
        </div>
        <div className="space-y-4">
          {SPECIAL_ASPECTS.map((item) => (
            <motion.div
              key={item.planet}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gold-light font-semibold">{item.planet}</span>
                <span className="text-gold-primary/70 text-xs font-mono px-2 py-0.5 rounded bg-gold-primary/10">{!isIndicLocale(locale) ? 'Aspects:' : 'दृष्टि:'} {item.aspects}</span>
              </div>
              <p className="text-text-secondary text-sm">{item.desc[loc]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 7b: Aspect Strength ─────────────────────────── */}
      <LessonSection title={t('aspectStrengthTitle')} variant="formula">
        <p>{t('aspectStrengthContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-light font-semibold">{!isIndicLocale(locale) ? 'Planet' : 'ग्रह'}</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">3rd</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">4th</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">5th</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">7th</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">8th</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">9th</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">10th</th>
              </tr>
            </thead>
            <tbody>
              {[
                { planet: 'All Planets', h3: '25%', h4: '75%', h5: '50%', h7: '100%', h8: '25%', h9: '50%', h10: '25%' },
                { planet: 'Mars / मंगल', h3: '25%', h4: '100%', h5: '50%', h7: '100%', h8: '100%', h9: '50%', h10: '25%' },
                { planet: 'Jupiter / बृहस्पति', h3: '25%', h4: '75%', h5: '100%', h7: '100%', h8: '25%', h9: '100%', h10: '25%' },
                { planet: 'Saturn / शनि', h3: '100%', h4: '75%', h5: '50%', h7: '100%', h8: '25%', h9: '50%', h10: '100%' },
              ].map((row) => (
                <tr key={row.planet} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className="py-2 px-3 text-gold-light font-medium text-xs">{row.planet}</td>
                  {[row.h3, row.h4, row.h5, row.h7, row.h8, row.h9, row.h10].map((val, j) => (
                    <td key={j} className={`py-2 px-3 text-center text-xs font-mono ${val === '100%' ? 'text-gold-primary font-bold' : 'text-text-secondary/75'}`}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ── Section 7c: Upagrahas ────────────────────────────────── */}
      <LessonSection title={t('upagrahaTitle')}>
        <p>{t('upagrahaContent')}</p>
        <div className="mt-4 space-y-3">
          {UPAGRAHAS.map((upa, i) => (
            <motion.div
              key={upa.name.en}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gold-light font-semibold">{tObj(upa.name)}</span>
                <span className="text-gold-primary/50 text-xs font-mono px-2 py-0.5 rounded bg-gold-primary/5">{upa.formula[loc]}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{tObj(upa.signifies)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 8: Karakatva ──────────────────────────────────── */}
      <LessonSection number={8} title={t('karakatvaTitle')}>
        <p>{t('karakatvaContent')}</p>
        <div className="mt-4 space-y-3">
          {GRAHAS.map((g) => {
            const details = PLANET_DETAILS[g.id];
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5" style={{ color: g.color }}>{g.symbol}</span>
                <div>
                  <span className="text-gold-light font-semibold text-sm">{tObj(g.name)}</span>
                  <p className="text-text-secondary text-xs mt-1">{details.karakatva[loc]}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* ── Section 9: Complete Planet Profiles ───────────────────── */}
      <LessonSection number={9} title={t('completeList')}>
        <div className="space-y-4">
          {GRAHAS.map((g, i) => {
            const details = PLANET_DETAILS[g.id];
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl" style={{ color: g.color }}>{g.symbol}</span>
                  <div className="flex-1">
                    <div className="text-gold-light font-semibold">{tObj(g.name)}</div>
                    {locale !== 'en' && <div className="text-text-secondary/75 text-xs">{g.name.en}</div>}
                  </div>
                  <div className="text-right">
                    <span className="text-text-secondary/70 text-xs font-mono">{details.orbit}</span>
                    <div className="text-gold-primary/70 text-xs">{details.dashaYears} yr Dasha</div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-2">{tObj(details.signifies)}</p>
                <p className="text-text-secondary/75 text-xs italic mb-2">{tObj(details.dignity)}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary/70">
                  <div><span className="text-gold-primary/60">{!isIndicLocale(locale) ? 'Own Sign:' : 'स्वराशि:'}</span> {details.ownSigns[loc]}</div>
                  <div><span className="text-gold-primary/60">{!isIndicLocale(locale) ? 'Moolatrikona:' : 'मूलत्रिकोण:'}</span> {details.moolatrikona[loc]}</div>
                  <div><span className="text-gold-primary/60">{!isIndicLocale(locale) ? 'Combustion:' : 'अस्त:'}</span> {details.combustionDeg}</div>
                  <div><span className="text-gold-primary/60">{!isIndicLocale(locale) ? 'Dasha:' : 'दशा:'}</span> {details.dashaYears} {!isIndicLocale(locale) ? 'years' : 'वर्ष'}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* ── Section 10: Dasha Brief ───────────────────────────────── */}
      <LessonSection number={10} title={t('dashaTitle')}>
        <p>{t('dashaContent')}</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {[
            { name: 'Ketu', years: 7, color: '#95a5a6' },
            { name: 'Venus', years: 20, color: '#e8e6e3' },
            { name: 'Sun', years: 6, color: '#e67e22' },
            { name: 'Moon', years: 10, color: '#ecf0f1' },
            { name: 'Mars', years: 7, color: '#e74c3c' },
            { name: 'Rahu', years: 18, color: '#8e44ad' },
            { name: 'Jupiter', years: 16, color: '#f39c12' },
            { name: 'Saturn', years: 19, color: '#3498db' },
            { name: 'Mercury', years: 17, color: '#2ecc71' },
          ].map((d) => (
            <div
              key={d.name}
              className="flex flex-col items-center p-2 rounded-lg border border-gold-primary/10 bg-bg-primary/30"
              style={{ minWidth: '70px' }}
            >
              <span className="text-xs font-semibold" style={{ color: d.color }}>{d.name}</span>
              <span className="text-gold-primary text-lg font-bold">{d.years}</span>
              <span className="text-text-secondary/70 text-xs">{!isIndicLocale(locale) ? 'years' : 'वर्ष'}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <p className="text-gold-light/60 font-mono text-xs">
            {!isIndicLocale(locale) ? 'Total: 7+20+6+10+7+18+16+19+17 = 120 years' : 'कुल: 7+20+6+10+7+18+16+19+17 = 120 वर्ष'}
          </p>
        </div>
      </LessonSection>

      {/* ── Significance (preserved) ──────────────────────────────── */}
      <LessonSection title={t('significanceSection')} variant="highlight">
        <p>{t('significanceContent')}</p>
      </LessonSection>

      {/* ── Section 11: Cross References ──────────────────────────── */}
      <LessonSection number={11} title={t('crossRefTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href as '/learn/nakshatras'}
              className="block p-4 rounded-lg border border-gold-primary/10 bg-bg-primary/30 hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all group"
            >
              <div className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors">{ref.label[loc]}</div>
              <p className="text-text-secondary/75 text-xs mt-1">{ref.desc[loc]}</p>
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* ── CTA ───────────────────────────────────────────────────── */}
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
