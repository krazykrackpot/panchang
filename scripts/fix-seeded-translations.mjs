#!/usr/bin/env node
/**
 * Replace seeded (English-copied) translations in ta/te/bn/kn/gu fields
 * with proper Indic script translations across all 15 learn pages.
 *
 * Strategy: For each file, find patterns where ta/te/bn/kn/gu have the same
 * value as the English text, and replace with proper translations derived from
 * the English meaning + Jyotish terminology.
 */

import fs from 'fs';
import path from 'path';

const BASE = '/Users/adityakumar/Desktop/venture/panchang/src/app/[locale]/learn';

const FILES = [
  'birth-chart/page.tsx',
  'tippanni/page.tsx',
  'avasthas/page.tsx',
  'eclipses/page.tsx',
  'lagna/page.tsx',
  'retrograde-effects/page.tsx',
  'rashis/page.tsx',
  'vedanga/page.tsx',
  'classical-texts/page.tsx',
  'children/page.tsx',
  'cosmology/page.tsx',
  'dashas/page.tsx',
  'nakshatras/page.tsx',
  'sphutas/page.tsx',
  'grahas/page.tsx',
];

// ─── Comprehensive Jyotish Translation Dictionary ───────────────────
// Maps English terms/phrases to {ta, te, bn, kn, gu}
// This is built from standard Jyotish vocabulary in each language

const RASHI_NAMES = {
  'Aries': { ta: 'மேஷம்', te: 'మేషం', bn: 'মেষ', kn: 'ಮೇಷ', gu: 'મેષ' },
  'Taurus': { ta: 'ரிஷபம்', te: 'వృషభం', bn: 'বৃষ', kn: 'ವೃಷಭ', gu: 'વૃષભ' },
  'Gemini': { ta: 'மிதுனம்', te: 'మిథునం', bn: 'মিথুন', kn: 'ಮಿಥುನ', gu: 'મિથુન' },
  'Cancer': { ta: 'கடகம்', te: 'కర్కాటకం', bn: 'কর্কট', kn: 'ಕರ್ಕಾಟಕ', gu: 'કર્ક' },
  'Leo': { ta: 'சிம்மம்', te: 'సింహం', bn: 'সিংহ', kn: 'ಸಿಂಹ', gu: 'સિંહ' },
  'Virgo': { ta: 'கன்னி', te: 'కన్య', bn: 'কন্যা', kn: 'ಕನ್ಯಾ', gu: 'કન્યા' },
  'Libra': { ta: 'துலாம்', te: 'తులా', bn: 'তুলা', kn: 'ತುಲಾ', gu: 'તુલા' },
  'Scorpio': { ta: 'விருச்சிகம்', te: 'వృశ్చికం', bn: 'বৃশ্চিক', kn: 'ವೃಶ್ಚಿಕ', gu: 'વૃશ્ચિક' },
  'Sagittarius': { ta: 'தனுசு', te: 'ధనుస్సు', bn: 'ধনু', kn: 'ಧನು', gu: 'ધનુ' },
  'Capricorn': { ta: 'மகரம்', te: 'మకరం', bn: 'মকর', kn: 'ಮಕರ', gu: 'મકર' },
  'Aquarius': { ta: 'கும்பம்', te: 'కుంభం', bn: 'কুম্ভ', kn: 'ಕುಂಭ', gu: 'કુંભ' },
  'Pisces': { ta: 'மீனம்', te: 'మీనం', bn: 'মীন', kn: 'ಮೀನ', gu: 'મીન' },
};

const GRAHA_NAMES = {
  'Sun': { ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' },
  'Moon': { ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' },
  'Mars': { ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಕುಜ', gu: 'મંગળ' },
  'Mercury': { ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' },
  'Jupiter': { ta: 'குரு', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' },
  'Venus': { ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' },
  'Saturn': { ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' },
  'Rahu': { ta: 'ராகு', te: 'రాహువు', bn: 'রাহু', kn: 'ರಾಹು', gu: 'રાહુ' },
  'Ketu': { ta: 'கேது', te: 'కేతువు', bn: 'কেতু', kn: 'ಕೇತು', gu: 'કેતુ' },
};

// ─── Full phrase translation map ────────────────────────────────────
// Key = exact English string found in seeded field
// Value = { ta, te, bn, kn, gu } proper translations
const TRANSLATIONS = {};

// Helper to add a translation entry
function addT(en, ta, te, bn, kn, gu) {
  TRANSLATIONS[en] = { ta, te, bn, kn, gu };
}

// ─── Rashi sign names with degrees (for moolatrikona, ownSigns) ─────
addT('Leo 0°-20°', 'சிம்மம் 0°-20°', 'సింహం 0°-20°', 'সিংহ 0°-20°', 'ಸಿಂಹ 0°-20°', 'સિંહ 0°-20°');
addT('Leo', 'சிம்மம்', 'సింహం', 'সিংহ', 'ಸಿಂಹ', 'સિંહ');
addT('Taurus 4°-30°', 'ரிஷபம் 4°-30°', 'వృషభం 4°-30°', 'বৃষ 4°-30°', 'ವೃಷಭ 4°-30°', 'વૃષભ 4°-30°');
addT('Cancer', 'கடகம்', 'కర్కాటకం', 'কর্কট', 'ಕರ್ಕಾಟಕ', 'કર્ક');
addT('Aries 0°-12°', 'மேஷம் 0°-12°', 'మేషం 0°-12°', 'মেষ 0°-12°', 'ಮೇಷ 0°-12°', 'મેષ 0°-12°');
addT('Aries, Scorpio', 'மேஷம், விருச்சிகம்', 'మేషం, వృశ్చికం', 'মেষ, বৃশ্চিক', 'ಮೇಷ, ವೃಶ್ಚಿಕ', 'મેષ, વૃશ્ચિક');
addT('Virgo 16°-20°', 'கன்னி 16°-20°', 'కన్య 16°-20°', 'কন্যা 16°-20°', 'ಕನ್ಯಾ 16°-20°', 'કન્યા 16°-20°');
addT('Gemini, Virgo', 'மிதுனம், கன்னி', 'మిథునం, కన్య', 'মিথুন, কন্যা', 'ಮಿಥುನ, ಕನ್ಯಾ', 'મિથુન, કન્યા');
addT('Sagittarius 0°-10°', 'தனுசு 0°-10°', 'ధనుస్సు 0°-10°', 'ধনু 0°-10°', 'ಧನು 0°-10°', 'ધનુ 0°-10°');
addT('Sagittarius, Pisces', 'தனுசு, மீனம்', 'ధనుస్సు, మీనం', 'ধনু, মীন', 'ಧನು, ಮೀನ', 'ધનુ, મીન');
addT('Libra 0°-15°', 'துலாம் 0°-15°', 'తులా 0°-15°', 'তুলা 0°-15°', 'ತುಲಾ 0°-15°', 'તુલા 0°-15°');
addT('Taurus, Libra', 'ரிஷபம், துலாம்', 'వృషభం, తులా', 'বৃষ, তুলা', 'ವೃಷಭ, ತುಲಾ', 'વૃષભ, તુલા');
addT('Aquarius 0°-20°', 'கும்பம் 0°-20°', 'కుంభం 0°-20°', 'কুম্ভ 0°-20°', 'ಕುಂಭ 0°-20°', 'કુંભ 0°-20°');
addT('Capricorn, Aquarius', 'மகரம், கும்பம்', 'మకరం, కుంభం', 'মকর, কুম্ভ', 'ಮಕರ, ಕುಂಭ', 'મકર, કુંભ');
addT('Gemini (some authorities)', 'மிதுனம் (சில நூல்களின் படி)', 'మిథునం (కొన్ని గ్రంథాల ప్రకారం)', 'মিথুন (কিছু শাস্ত্রকার অনুসারে)', 'ಮಿಥುನ (ಕೆಲವು ಶಾಸ್ತ್ರಕಾರರ ಪ್ರಕಾರ)', 'મિથુન (કેટલાક શાસ્ત્રકારો અનુસાર)');
addT('Aquarius (co-ruler)', 'கும்பம் (இணை அதிபதி)', 'కుంభం (సహ అధిపతి)', 'কুম্ভ (সহ-অধিপতি)', 'ಕುಂಭ (ಸಹ-ಅಧಿಪತಿ)', 'કુંભ (સહ-અધિપતિ)');
addT('Sagittarius (some authorities)', 'தனுசு (சில நூல்களின் படி)', 'ధనుస్సు (కొన్ని గ్రంథాల ప్రకారం)', 'ধনু (কিছু শাস্ত্রকার অনুসারে)', 'ಧನು (ಕೆಲವು ಶಾಸ್ತ್ರಕಾರರ ಪ್ರಕಾರ)', 'ધનુ (કેટલાક શાસ્ત્રકારો અનુસાર)');
addT('Scorpio (co-ruler)', 'விருச்சிகம் (இணை அதிபதி)', 'వృశ్చికం (సహ అధిపతి)', 'বৃশ্চিক (সহ-অধিপতি)', 'ವೃಶ್ಚಿಕ (ಸಹ-ಅಧಿಪತಿ)', 'વૃશ્ચિક (સહ-અધિપતિ)');

// ─── Karakatva (signification) translations ─────────────────────────
addT(
  'Atmakaraka (soul), father, king, government authority, bones, heart, right eye, copper, ruby, wheat, temple, east direction',
  'ஆத்மகாரகன் (ஆன்மா), தந்தை, அரசன், அரசாங்க அதிகாரம், எலும்புகள், இதயம், வலது கண், செம்பு, மாணிக்கம், கோதுமை, கோயில், கிழக்கு திசை',
  'ఆత్మకారకుడు (ఆత్మ), తండ్రి, రాజు, ప్రభుత్వ అధికారం, ఎముకలు, హృదయం, కుడి కన్ను, రాగి, మాణిక్యం, గోధుమ, దేవాలయం, తూర్పు దిక్కు',
  'আত্মকারক (আত্মা), পিতা, রাজা, সরকারি কর্তৃত্ব, অস্থি, হৃদয়, ডান চোখ, তামা, চুনি, গম, মন্দির, পূর্ব দিক',
  'ಆತ್ಮಕಾರಕ (ಆತ್ಮ), ತಂದೆ, ರಾಜ, ಸರ್ಕಾರಿ ಅಧಿಕಾರ, ಮೂಳೆಗಳು, ಹೃದಯ, ಬಲ ಕಣ್ಣು, ತಾಮ್ರ, ಮಾಣಿಕ್ಯ, ಗೋಧಿ, ದೇವಾಲಯ, ಪೂರ್ವ ದಿಕ್ಕು',
  'આત્મકારક (આત્મા), પિતા, રાજા, સરકારી સત્તા, હાડકાં, હૃદય, જમણી આંખ, તાંબુ, માણેક, ઘઉં, મંદિર, પૂર્વ દિશા'
);
addT(
  'Mind (Manas), mother, queen, public opinion, water, milk, pearl, silver, left eye, Monday, northwest direction, white things',
  'மனம் (மனஸ்), தாய், அரசி, பொது கருத்து, நீர், பால், முத்து, வெள்ளி, இடது கண், திங்கள், வடமேற்கு திசை, வெண்மையான பொருட்கள்',
  'మనస్సు (మనస్), తల్లి, రాణి, ప్రజాభిప్రాయం, నీరు, పాలు, ముత్యం, వెండి, ఎడమ కన్ను, సోమవారం, వాయువ్య దిక్కు, తెల్లని వస్తువులు',
  'মন (মনস), মাতা, রানী, জনমত, জল, দুধ, মুক্তা, রূপা, বাম চোখ, সোমবার, উত্তর-পশ্চিম দিক, সাদা বস্তু',
  'ಮನಸ್ಸು (ಮನಸ್), ತಾಯಿ, ರಾಣಿ, ಜನಾಭಿಪ್ರಾಯ, ನೀರು, ಹಾಲು, ಮುತ್ತು, ಬೆಳ್ಳಿ, ಎಡ ಕಣ್ಣು, ಸೋಮವಾರ, ವಾಯವ್ಯ ದಿಕ್ಕು, ಬಿಳಿ ವಸ್ತುಗಳು',
  'મન (મનસ), માતા, રાણી, જનમત, જળ, દૂધ, મોતી, ચાંદી, ડાબી આંખ, સોમવાર, વાયવ્ય દિશા, સફેદ વસ્તુઓ'
);
addT(
  'Courage, brothers, commander, land, blood, surgery, fire, weapons, police, coral, red things, Tuesday, south direction',
  'தைரியம், சகோதரர்கள், தளபதி, நிலம், இரத்தம், அறுவை சிகிச்சை, அக்னி, ஆயுதங்கள், காவல், பவளம், சிவப்பு பொருட்கள், செவ்வாய், தெற்கு திசை',
  'ధైర్యం, సోదరులు, సేనాపతి, భూమి, రక్తం, శస్త్రచికిత్స, అగ్ని, ఆయుధాలు, పోలీసు, పగడం, ఎరుపు వస్తువులు, మంగళవారం, దక్షిణ దిక్కు',
  'সাহস, ভাই, সেনাপতি, ভূমি, রক্ত, শল্যচিকিৎসা, অগ্নি, অস্ত্র, পুলিশ, প্রবাল, লাল বস্তু, মঙ্গলবার, দক্ষিণ দিক',
  'ಧೈರ್ಯ, ಸಹೋದರರು, ಸೇನಾಪತಿ, ಭೂಮಿ, ರಕ್ತ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಅಗ್ನಿ, ಆಯುಧಗಳು, ಪೊಲೀಸ್, ಹವಳ, ಕೆಂಪು ವಸ್ತುಗಳು, ಮಂಗಳವಾರ, ದಕ್ಷಿಣ ದಿಕ್ಕು',
  'સાહસ, ભાઈઓ, સેનાપતિ, ભૂમિ, રક્ત, શસ્ત્રક્રિયા, અગ્નિ, શસ્ત્રો, પોલીસ, પરવાળું, લાલ વસ્તુઓ, મંગળવાર, દક્ષિણ દિશા'
);
addT(
  'Intellect, speech, trade, writing, mathematics, maternal uncle, skin, emerald, green things, Wednesday, north direction, astrology',
  'புத்தி, பேச்சு, வாணிகம், எழுத்து, கணிதம், மாமா, தோல், மரகதம், பச்சை பொருட்கள், புதன், வடக்கு திசை, ஜோதிடம்',
  'బుద్ధి, వాక్కు, వ్యాపారం, రచన, గణితం, మేనమామ, చర్మం, మరకతం, ఆకుపచ్చ వస్తువులు, బుధవారం, ఉత్తర దిక్కు, జ్యోతిషం',
  'বুদ্ধি, বাক্, বাণিজ্য, লেখা, গণিত, মামা, ত্বক, পান্না, সবুজ বস্তু, বুধবার, উত্তর দিক, জ্যোতিষ',
  'ಬುದ್ಧಿ, ವಾಕ್, ವ್ಯಾಪಾರ, ಬರವಣಿಗೆ, ಗಣಿತ, ಸೋದರ ಮಾವ, ಚರ್ಮ, ಮರಕತ, ಹಸಿರು ವಸ್ತುಗಳು, ಬುಧವಾರ, ಉತ್ತರ ದಿಕ್ಕು, ಜ್ಯೋತಿಷ',
  'બુદ્ધિ, વાણી, વ્યાપાર, લેખન, ગણિત, મામા, ત્વચા, પન્ના, લીલી વસ્તુઓ, બુધવાર, ઉત્તર દિશા, જ્યોતિષ'
);
addT(
  'Wisdom, children, dharma, guru/teacher, wealth, fortune, fat/liver, yellow sapphire, gold, Thursday, northeast direction, sacred texts',
  'ஞானம், குழந்தைகள், தர்மம், குரு/ஆசிரியர், செல்வம், பாக்கியம், கொழுப்பு/கல்லீரல், புஷ்பராகம், தங்கம், வியாழன், வடகிழக்கு திசை, புனித நூல்கள்',
  'జ్ఞానం, సంతానం, ధర్మం, గురువు/ఉపాధ్యాయుడు, సంపద, భాగ్యం, కొవ్వు/కాలేయం, పుష్యరాగం, బంగారం, గురువారం, ఈశాన్య దిక్కు, పవిత్ర గ్రంథాలు',
  'জ্ঞান, সন্তান, ধর্ম, গুরু/শিক্ষক, সম্পদ, ভাগ্য, মেদ/যকৃৎ, পুষ্পরাগ, স্বর্ণ, বৃহস্পতিবার, ঈশান দিক, পবিত্র গ্রন্থ',
  'ಜ್ಞಾನ, ಮಕ್ಕಳು, ಧರ್ಮ, ಗುರು/ಶಿಕ್ಷಕ, ಸಂಪತ್ತು, ಭಾಗ್ಯ, ಕೊಬ್ಬು/ಯಕೃತ್, ಪುಷ್ಯರಾಗ, ಚಿನ್ನ, ಗುರುವಾರ, ಈಶಾನ್ಯ ದಿಕ್ಕು, ಪವಿತ್ರ ಗ್ರಂಥಗಳು',
  'જ્ઞાન, સંતાન, ધર્મ, ગુરુ/શિક્ષક, સંપત્તિ, ભાગ્ય, ચરબી/યકૃત, પુષ્પરાગ, સોનું, ગુરુવાર, ઈશાન દિશા, પવિત્ર ગ્રંથો'
);
addT(
  'Spouse (wife), love, beauty, art, music, luxury, vehicles, diamond, semen, southeast direction, Friday, perfume, flowers',
  'மனைவி, காதல், அழகு, கலை, இசை, ஆடம்பரம், வாகனங்கள், வைரம், விந்து, தென்கிழக்கு திசை, வெள்ளி, நறுமணம், மலர்கள்',
  'భార్య, ప్రేమ, అందం, కళ, సంగీతం, విలాసం, వాహనాలు, వజ్రం, వీర్యం, ఆగ్నేయ దిక్కు, శుక్రవారం, సుగంధం, పుష్పాలు',
  'স্ত্রী, প্রেম, সৌন্দর্য, কলা, সংগীত, বিলাস, যানবাহন, হীরা, বীর্য, দক্ষিণ-পূর্ব দিক, শুক্রবার, সুগন্ধি, ফুল',
  'ಪತ್ನಿ, ಪ್ರೇಮ, ಸೌಂದರ್ಯ, ಕಲೆ, ಸಂಗೀತ, ವಿಲಾಸ, ವಾಹನಗಳು, ವಜ್ರ, ವೀರ್ಯ, ಆಗ್ನೇಯ ದಿಕ್ಕು, ಶುಕ್ರವಾರ, ಸುಗಂಧ, ಹೂಗಳು',
  'પત્ની, પ્રેમ, સૌંદર્ય, કલા, સંગીત, વિલાસ, વાહનો, હીરો, વીર્ય, અગ્નિ દિશા, શુક્રવાર, સુગંધ, ફૂલો'
);
addT(
  'Longevity, karma, discipline, servants, old age, sorrow, iron, blue sapphire, Saturday, west direction, oil, black things, democracy',
  'ஆயுள், கர்மா, ஒழுக்கம், பணியாளர்கள், முதுமை, துன்பம், இரும்பு, நீலக்கல், சனி, மேற்கு திசை, எண்ணெய், கருப்பு பொருட்கள், ஜனநாயகம்',
  'ఆయుష్షు, కర్మ, క్రమశిక్షణ, సేవకులు, వృద్ధాప్యం, దుఃఖం, ఇనుము, నీలమణి, శనివారం, పశ్చిమ దిక్కు, నూనె, నల్లని వస్తువులు, ప్రజాస్వామ్యం',
  'আয়ু, কর্ম, শৃঙ্খলা, ভৃত্য, বার্ধক্য, দুঃখ, লোহা, নীলকান্তমণি, শনিবার, পশ্চিম দিক, তেল, কালো বস্তু, গণতন্ত্র',
  'ಆಯುಷ್ಯ, ಕರ್ಮ, ಶಿಸ್ತು, ಸೇವಕರು, ವೃದ್ಧಾಪ್ಯ, ದುಃಖ, ಕಬ್ಬಿಣ, ನೀಲಮಣಿ, ಶನಿವಾರ, ಪಶ್ಚಿಮ ದಿಕ್ಕು, ಎಣ್ಣೆ, ಕಪ್ಪು ವಸ್ತುಗಳು, ಪ್ರಜಾಪ್ರಭುತ್ವ',
  'આયુષ્ય, કર્મ, અનુશાસન, સેવકો, વૃદ્ધાવસ્થા, દુઃખ, લોખંડ, નીલમ, શનિવાર, પશ્ચિમ દિશા, તેલ, કાળી વસ્તુઓ, લોકશાહી'
);
addT(
  'Foreign lands, outcasts, illusion, sudden events, paternal grandfather, serpents, hessonite (gomed), southwest direction, manipulation, obsession',
  'வெளிநாடுகள், புறக்கணிக்கப்பட்டோர், மாயை, திடீர் நிகழ்வுகள், தாத்தா (தந்தை வழி), பாம்புகள், கோமேதகம், தென்மேற்கு திசை, சூழ்ச்சி, பற்று',
  'విదేశాలు, బహిష్కృతులు, మాయ, ఆకస్మిక సంఘటనలు, తాత (తండ్రి వైపు), సర్పాలు, గోమేధికం, నైఋతి దిక్కు, మోసం, వ్యామోహం',
  'বিদেশ, বহিষ্কৃত, মায়া, আকস্মিক ঘটনা, দাদা (পিতামহ), সর্প, গোমেদ, দক্ষিণ-পশ্চিম দিক, কারসাজি, আসক্তি',
  'ವಿದೇಶ, ಬಹಿಷ್ಕೃತರು, ಮಾಯೆ, ಆಕಸ್ಮಿಕ ಘಟನೆಗಳು, ತಾತ (ತಂದೆ ಕಡೆ), ಸರ್ಪಗಳು, ಗೋಮೇಧಿಕ, ನೈಋತ್ಯ ದಿಕ್ಕು, ಮೋಸ, ವ್ಯಾಮೋಹ',
  'વિદેશ, બહિષ્કૃત, માયા, આકસ્મિક ઘટનાઓ, દાદા (પિતામહ), સર્પ, ગોમેદ, નૈઋત્ય દિશા, છેતરપિંડી, આસક્તિ'
);

// ─── Cross-reference labels for grahas ──────────────────────────────
addT('Nakshatras — 27 Lunar Mansions', 'நட்சத்திரங்கள் — 27 சந்திர மாளிகைகள்', 'నక్షత్రాలు — 27 చంద్ర భవనాలు', 'নক্ষত্র — ২৭ চন্দ্র ভবন', 'ನಕ್ಷತ್ರಗಳು — 27 ಚಂದ್ರ ಭವನಗಳು', 'નક્ષત્રો — 27 ચંદ્ર ભવનો');
addT('Each Nakshatra is ruled by a specific Graha', 'ஒவ்வொரு நட்சத்திரமும் ஒரு குறிப்பிட்ட கிரகத்தால் ஆளப்படுகிறது', 'ప్రతి నక్షత్రానికి ఒక నిర్దిష్ట గ్రహం అధిపతి', 'প্রতিটি নক্ষত্র একটি নির্দিষ্ট গ্রহ দ্বারা শাসিত', 'ಪ್ರತಿ ನಕ್ಷತ್ರವನ್ನು ಒಂದು ನಿರ್ದಿಷ್ಟ ಗ್ರಹ ಆಳುತ್ತದೆ', 'દરેક નક્ષત્ર એક ચોક્કસ ગ્રહ દ્વારા શાસિત છે');
addT('Kundali — Birth Chart Basics', 'குண்டலி — ஜாதக அடிப்படைகள்', 'కుండలి — జాతక ప్రాథమికాలు', 'কুণ্ডলী — জন্ম কুণ্ডলী মূল বিষয়', 'ಕುಂಡಲಿ — ಜಾತಕ ಮೂಲಾಂಶಗಳು', 'કુંડળી — જન્મ કુંડળી મૂળ બાબતો');
addT('How Grahas are placed in houses and signs', 'கிரகங்கள் பாவங்களிலும் ராசிகளிலும் எவ்வாறு அமைகின்றன', 'గ్రహాలు భావాలలో మరియు రాశులలో ఎలా ఉంటాయి', 'গ্রহগুলি ভাব ও রাশিতে কীভাবে স্থিত হয়', 'ಗ್ರಹಗಳು ಭಾವಗಳಲ್ಲಿ ಮತ್ತು ರಾಶಿಗಳಲ್ಲಿ ಹೇಗೆ ಸ್ಥಿತವಾಗಿವೆ', 'ગ્રહો ભાવો અને રાશિઓમાં કેવી રીતે સ્થિત હોય છે');
addT('Bhavas — The 12 Houses', 'பாவங்கள் — 12 பாவங்கள்', 'భావాలు — 12 భావాలు', 'ভাব — ১২টি ভাব', 'ಭಾವಗಳು — 12 ಭಾವಗಳು', 'ભાવો — 12 ભાવો');
addT('The houses that Grahas occupy and influence', 'கிரகங்கள் இருக்கும் மற்றும் பாதிக்கும் பாவங்கள்', 'గ్రహాలు ఆక్రమించే మరియు ప్రభావితం చేసే భావాలు', 'গ্রহগুলি যে ভাবে অবস্থান করে এবং প্রভাবিত করে', 'ಗ್ರಹಗಳು ಆಕ್ರಮಿಸುವ ಮತ್ತು ಪ್ರಭಾವಿಸುವ ಭಾವಗಳು', 'ગ્રહો જે ભાવોમાં બિરાજે છે અને પ્રભાવિત કરે છે');
addT('Dashas — Planetary Periods', 'தசைகள் — கிரக காலங்கள்', 'దశలు — గ్రహ కాలాలు', 'দশা — গ্রহ কাল', 'ದಶೆಗಳು — ಗ್ರಹ ಕಾಲಗಳು', 'દશાઓ — ગ્રહ કાળ');
addT('How planetary periods unfold across life', 'கிரக காலங்கள் வாழ்க்கையில் எவ்வாறு விரிகின்றன', 'గ్రహ కాలాలు జీవితంలో ఎలా విస్తరిస్తాయి', 'গ্রহ কাল জীবনে কীভাবে প্রকাশ পায়', 'ಗ್ರಹ ಕಾಲಗಳು ಜೀವನದಲ್ಲಿ ಹೇಗೆ ತೆರೆದುಕೊಳ್ಳುತ್ತವೆ', 'ગ્રહ કાળ જીવનમાં કેવી રીતે પ્રગટ થાય છે');
addT('Yogas — Planetary Combinations', 'யோகங்கள் — கிரக சேர்க்கைகள்', 'యోగాలు — గ్రహ కలయికలు', 'যোগ — গ্রহ সংযোগ', 'ಯೋಗಗಳು — ಗ್ರಹ ಸಂಯೋಗಗಳು', 'યોગો — ગ્રહ સંયોગો');
addT('Special combinations formed by Grahas', 'கிரகங்களால் உருவாகும் சிறப்பு சேர்க்கைகள்', 'గ్రహాల వల్ల ఏర్పడే ప్రత్యేక కలయికలు', 'গ্রহগুলির দ্বারা গঠিত বিশেষ সংযোগ', 'ಗ್ರಹಗಳಿಂದ ರಚಿತವಾದ ವಿಶೇಷ ಸಂಯೋಗಗಳು', 'ગ્રહો દ્વારા રચાતા વિશેષ સંયોગો');

// Mars special aspect
addT(
  "Mars aspects the 4th (property, home), 7th (spouse, partnerships), and 8th (longevity, hidden matters) from its position. This makes Mars influential over domestic life, marriage, and transformative events.",
  "செவ்வாய் தனது நிலையிலிருந்து 4வது (சொத்து, வீடு), 7வது (மனைவி, பங்குதாரர்கள்), 8வது (ஆயுள், மறைவான விஷயங்கள்) பாவங்களைப் பார்க்கிறது. இது குடும்ப வாழ்க்கை, திருமணம் மற்றும் மாற்றத்தை ஏற்படுத்தும் நிகழ்வுகளில் செவ்வாயின் ஆதிக்கத்தை உருவாக்குகிறது.",
  "కుజుడు తన స్థానం నుండి 4వ (ఆస్తి, ఇల్లు), 7వ (భార్య, భాగస్వామ్యాలు), 8వ (ఆయుష్షు, రహస్య విషయాలు) భావాలను చూస్తాడు. ఇది గృహ జీవితం, వివాహం మరియు పరివర్తనాత్మక సంఘటనలపై కుజుడి ప్రభావాన్ని చేస్తుంది.",
  "মঙ্গল নিজের স্থান থেকে ৪র্থ (সম্পত্তি, গৃহ), ৭ম (স্ত্রী, অংশীদারিত্ব), ৮ম (আয়ু, গূঢ় বিষয়) ভাবে দৃষ্টি দেয়। এটি গৃহজীবন, বিবাহ এবং রূপান্তরমূলক ঘটনায় মঙ্গলের প্রভাব সৃষ্টি করে।",
  "ಕುಜನು ತನ್ನ ಸ್ಥಾನದಿಂದ 4ನೇ (ಆಸ್ತಿ, ಮನೆ), 7ನೇ (ಪತ್ನಿ, ಪಾಲುದಾರಿಕೆ), 8ನೇ (ಆಯುಷ್ಯ, ರಹಸ್ಯ ವಿಷಯಗಳು) ಭಾವಗಳನ್ನು ನೋಡುತ್ತಾನೆ. ಇದು ಗೃಹ ಜೀವನ, ವಿವಾಹ ಮತ್ತು ಪರಿವರ್ತನಾತ್ಮಕ ಘಟನೆಗಳ ಮೇಲೆ ಕುಜನ ಪ್ರಭಾವವನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ.",
  "મંગળ પોતાની સ્થિતિમાંથી 4થા (સંપત્તિ, ઘર), 7મા (પત્ની, ભાગીદારી), 8મા (આયુષ્ય, ગુપ્ત વિષયો) ભાવો પર દૃષ્ટિ કરે છે. આ ગૃહ જીવન, લગ્ન અને પરિવર્તનકારી ઘટનાઓ પર મંગળનો પ્રભાવ બનાવે છે."
);

// Now we need a smarter approach — instead of mapping every possible string,
// let's write a regex-based replacer that finds the pattern and replaces it.

// The approach: read each file, use regex to find all objects with ta/te/bn/kn/gu
// that match English, and replace them.

// Actually, the most reliable approach: read the file, find EVERY instance where
// a ta/te/bn/kn/gu value is identical to the en value in the same object literal.
// Then replace those with proper translations.

// We'll do this by scanning for the pattern:
//   ta: 'ENGLISH_TEXT', te: 'ENGLISH_TEXT', bn: 'ENGLISH_TEXT', kn: 'ENGLISH_TEXT', gu: 'ENGLISH_TEXT'
// where ENGLISH_TEXT matches the en: value

console.log('Translation dictionary has', Object.keys(TRANSLATIONS).length, 'entries');
console.log('Starting file processing...\n');

let totalReplacements = 0;
let totalFiles = 0;

for (const file of FILES) {
  const fullPath = path.join(BASE, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP: ${file} does not exist`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let fileReplacements = 0;

  // For each translation in our dictionary, do a direct string replacement
  for (const [en, translations] of Object.entries(TRANSLATIONS)) {
    const { ta, te, bn, kn, gu } = translations;

    // Pattern: ta: 'EN_TEXT' — replace with ta: 'TA_TEXT'
    // Handle both single and double quotes
    for (const q of ["'", '"']) {
      const escEn = en.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

      // Replace ta: 'english' with ta: 'tamil'
      const taOld = `ta: ${q}${en}${q}`;
      const taNew = `ta: ${q}${ta}${q}`;
      if (content.includes(taOld) && taOld !== taNew) {
        content = content.split(taOld).join(taNew);
        fileReplacements++;
      }

      const teOld = `te: ${q}${en}${q}`;
      const teNew = `te: ${q}${te}${q}`;
      if (content.includes(teOld) && teOld !== teNew) {
        content = content.split(teOld).join(teNew);
        fileReplacements++;
      }

      const bnOld = `bn: ${q}${en}${q}`;
      const bnNew = `bn: ${q}${bn}${q}`;
      if (content.includes(bnOld) && bnOld !== bnNew) {
        content = content.split(bnOld).join(bnNew);
        fileReplacements++;
      }

      const knOld = `kn: ${q}${en}${q}`;
      const knNew = `kn: ${q}${kn}${q}`;
      if (content.includes(knOld) && knOld !== knNew) {
        content = content.split(knOld).join(knNew);
        fileReplacements++;
      }

      const guOld = `gu: ${q}${en}${q}`;
      const guNew = `gu: ${q}${gu}${q}`;
      if (content.includes(guOld) && guOld !== guNew) {
        content = content.split(guOld).join(guNew);
        fileReplacements++;
      }
    }
  }

  if (fileReplacements > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    totalFiles++;
  }
  totalReplacements += fileReplacements;
  console.log(`${file}: ${fileReplacements} replacements`);
}

console.log(`\nDone: ${totalReplacements} replacements across ${totalFiles} files`);

// Now count remaining seeded values
console.log('\n--- Remaining seeded values ---');
for (const file of FILES) {
  const fullPath = path.join(BASE, file);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');

  // Find ta: 'text' where text looks English (starts with ASCII uppercase or lowercase)
  const taMatches = content.match(/ta: '[A-Z][^']*'/g) || [];
  const teMatches = content.match(/te: '[A-Z][^']*'/g) || [];
  const bnMatches = content.match(/bn: '[A-Z][^']*'/g) || [];
  const knMatches = content.match(/kn: '[A-Z][^']*'/g) || [];
  const guMatches = content.match(/gu: '[A-Z][^']*'/g) || [];

  const total = taMatches.length + teMatches.length + bnMatches.length + knMatches.length + guMatches.length;
  if (total > 0) {
    console.log(`${file}: ${total} remaining (ta:${taMatches.length} te:${teMatches.length} bn:${bnMatches.length} kn:${knMatches.length} gu:${guMatches.length})`);
    // Show sample
    if (taMatches.length > 0) {
      console.log(`  Sample ta: ${taMatches[0]}`);
    }
  }
}
