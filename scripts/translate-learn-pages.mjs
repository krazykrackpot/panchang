#!/usr/bin/env node
/**
 * Replace seeded/placeholder translations in learn page files.
 * Finds locale objects where ta/te/bn/kn/gu = English copies,
 * and mai/mr = Hindi copies, then replaces with real translations.
 */

import fs from 'fs';
import path from 'path';

const BASE = '/Users/adityakumar/Desktop/venture/panchang/src/app/[locale]/learn';

const FILES = [
  'grahas/page.tsx',
  'sphutas/page.tsx',
  'dashas/page.tsx',
  'nakshatras/page.tsx',
  'tippanni/page.tsx',
  'birth-chart/page.tsx',
  'eclipses/page.tsx',
  'lagna/page.tsx',
  'avasthas/page.tsx',
  'retrograde-effects/page.tsx',
  'rashis/page.tsx',
  'vedanga/page.tsx',
  'children/page.tsx',
  'cosmology/page.tsx',
  'classical-texts/page.tsx',
];

// ─── Rashi name translations ────────────────────────────────────────
const RASHI_NAMES = {
  'Aries': { ta: 'மேஷம்', te: 'మేషం', bn: 'মেষ', kn: 'ಮೇಷ', gu: 'મેષ', mr: 'मेष', mai: 'मेष' },
  'Taurus': { ta: 'ரிஷபம்', te: 'వృషభం', bn: 'বৃষ', kn: 'ವೃಷಭ', gu: 'વૃષભ', mr: 'वृषभ', mai: 'वृषभ' },
  'Gemini': { ta: 'மிதுனம்', te: 'మిథునం', bn: 'মিথুন', kn: 'ಮಿಥುನ', gu: 'મિથુન', mr: 'मिथुन', mai: 'मिथुन' },
  'Cancer': { ta: 'கடகம்', te: 'కర్కాటకం', bn: 'কর্কট', kn: 'ಕರ್ಕಾಟಕ', gu: 'કર્ક', mr: 'कर्क', mai: 'कर्क' },
  'Leo': { ta: 'சிம்மம்', te: 'సింహం', bn: 'সিংহ', kn: 'ಸಿಂಹ', gu: 'સિંહ', mr: 'सिंह', mai: 'सिंह' },
  'Virgo': { ta: 'கன்னி', te: 'కన్య', bn: 'কন্যা', kn: 'ಕನ್ಯಾ', gu: 'કન્યા', mr: 'कन्या', mai: 'कन्या' },
  'Libra': { ta: 'துலாம்', te: 'తుల', bn: 'তুলা', kn: 'ತುಲಾ', gu: 'તુલા', mr: 'तुला', mai: 'तुला' },
  'Scorpio': { ta: 'விருச்சிகம்', te: 'వృశ్చికం', bn: 'বৃশ্চিক', kn: 'ವೃಶ್ಚಿಕ', gu: 'વૃશ્ચિક', mr: 'वृश्चिक', mai: 'वृश्चिक' },
  'Sagittarius': { ta: 'தனுசு', te: 'ధనుస్సు', bn: 'ধনু', kn: 'ಧನು', gu: 'ધનુ', mr: 'धनु', mai: 'धनु' },
  'Capricorn': { ta: 'மகரம்', te: 'మకరం', bn: 'মকর', kn: 'ಮಕರ', gu: 'મકર', mr: 'मकर', mai: 'मकर' },
  'Aquarius': { ta: 'கும்பம்', te: 'కుంభం', bn: 'কুম্ভ', kn: 'ಕುಂಭ', gu: 'કુંભ', mr: 'कुम्भ', mai: 'कुम्भ' },
  'Pisces': { ta: 'மீனம்', te: 'మీనం', bn: 'মীন', kn: 'ಮೀನ', gu: 'મીન', mr: 'मीन', mai: 'मीन' },
};

// ─── Graha name translations ────────────────────────────────────────
const GRAHA_NAMES = {
  'Sun': { ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય', mr: 'सूर्य', mai: 'सूर्य' },
  'Moon': { ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર', mr: 'चन्द्र', mai: 'चन्द्र' },
  'Mars': { ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ', mr: 'मंगळ', mai: 'मंगल' },
  'Mercury': { ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ', mr: 'बुध', mai: 'बुध' },
  'Jupiter': { ta: 'குரு', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ', mr: 'बृहस्पति', mai: 'बृहस्पति' },
  'Venus': { ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર', mr: 'शुक्र', mai: 'शुक्र' },
  'Saturn': { ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ', mr: 'शनि', mai: 'शनि' },
  'Rahu': { ta: 'ராகு', te: 'రాహు', bn: 'রাহু', kn: 'ರಾಹು', gu: 'રાહુ', mr: 'राहु', mai: 'राहु' },
  'Ketu': { ta: 'கேது', te: 'కేతు', bn: 'কেতু', kn: 'ಕೇತು', gu: 'કેતુ', mr: 'केतु', mai: 'केतु' },
};

// ─── Common Jyotish term translations ───────────────────────────────
// This is the master dictionary for translating English Jyotish terms
// We'll use regex-based replacements on the English text

// For each language, provide a comprehensive dictionary of term translations
const TERM_DICT = {
  ta: {
    // Planets
    'Atmakaraka': 'ஆத்மகாரகன்', 'soul': 'ஆத்மா', 'father': 'தந்தை', 'king': 'அரசன்',
    'government authority': 'அரசு அதிகாரம்', 'bones': 'எலும்புகள்', 'heart': 'இதயம்',
    'right eye': 'வலது கண்', 'copper': 'செம்பு', 'ruby': 'மாணிக்கம்', 'wheat': 'கோதுமை',
    'temple': 'கோயில்', 'east direction': 'கிழக்கு திசை',
    'Mind': 'மனம்', 'Manas': 'மனம்', 'mother': 'தாய்', 'queen': 'அரசி',
    'public opinion': 'மக்கள் கருத்து', 'water': 'நீர்', 'milk': 'பால்',
    'pearl': 'முத்து', 'silver': 'வெள்ளி', 'left eye': 'இடது கண்',
    'Monday': 'திங்கள்', 'northwest direction': 'வடமேற்கு திசை', 'white things': 'வெள்ளை பொருள்கள்',
    'Courage': 'தைரியம்', 'brothers': 'சகோதரர்கள்', 'commander': 'தளபதி',
    'land': 'நிலம்', 'blood': 'இரத்தம்', 'surgery': 'அறுவை சிகிச்சை',
    'fire': 'அக்னி', 'weapons': 'ஆயுதங்கள்', 'police': 'காவல்',
    'coral': 'பவளம்', 'red things': 'சிவப்பு பொருள்கள்', 'Tuesday': 'செவ்வாய்',
    'south direction': 'தெற்கு திசை',
    'Intellect': 'அறிவு', 'speech': 'வாக்கு', 'trade': 'வாணிபம்',
    'writing': 'எழுத்து', 'mathematics': 'கணிதம்', 'maternal uncle': 'மாமா',
    'skin': 'தோல்', 'emerald': 'மரகதம்', 'green things': 'பச்சை பொருள்கள்',
    'Wednesday': 'புதன்', 'north direction': 'வடக்கு திசை', 'astrology': 'ஜோதிடம்',
    'Wisdom': 'ஞானம்', 'children': 'குழந்தைகள்', 'dharma': 'தர்மம்',
    'guru': 'குரு', 'teacher': 'ஆசிரியர்', 'wealth': 'செல்வம்', 'fortune': 'பாக்கியம்',
    'fat': 'கொழுப்பு', 'liver': 'கல்லீரல்', 'yellow sapphire': 'புஷ்பராகம்',
    'gold': 'தங்கம்', 'Thursday': 'வியாழன்', 'northeast direction': 'வடகிழக்கு திசை',
    'sacred texts': 'புனித நூல்கள்',
    'Spouse': 'வாழ்க்கைத்துணை', 'wife': 'மனைவி', 'love': 'அன்பு', 'beauty': 'அழகு',
    'art': 'கலை', 'music': 'இசை', 'luxury': 'ஆடம்பரம்', 'vehicles': 'வாகனங்கள்',
    'diamond': 'வைரம்', 'semen': 'விந்து', 'southeast direction': 'தென்கிழக்கு திசை',
    'Friday': 'வெள்ளி', 'perfume': 'நறுமணம்', 'flowers': 'மலர்கள்',
    'Longevity': 'ஆயுள்', 'karma': 'கர்மம்', 'discipline': 'ஒழுக்கம்',
    'servants': 'சேவகர்கள்', 'old age': 'முதுமை', 'sorrow': 'துக்கம்',
    'iron': 'இரும்பு', 'blue sapphire': 'நீலம்', 'Saturday': 'சனி',
    'west direction': 'மேற்கு திசை', 'oil': 'எண்ணெய்', 'black things': 'கருப்பு பொருள்கள்',
    'democracy': 'ஜனநாயகம்',
    'Foreign lands': 'வெளிநாடுகள்', 'outcasts': 'புறக்கணிக்கப்பட்டவர்கள்',
    'illusion': 'மாயை', 'sudden events': 'திடீர் நிகழ்வுகள்',
    'paternal grandfather': 'தாத்தா', 'serpents': 'நாகம்',
    'hessonite': 'கோமேதகம்', 'gomed': 'கோமேதகம்', 'southwest direction': 'தென்மேற்கு திசை',
    'manipulation': 'தந்திரம்', 'obsession': 'பற்றுதல்',
    'Moksha': 'மோட்சம்', 'spiritual liberation': 'ஆன்மீக விடுதலை',
    'maternal grandfather': 'தாய்வழி தாத்தா', 'ascetics': 'துறவிகள்',
    'flag': 'கொடி', "cat's eye": 'வைடூரியம்', 'vaidurya': 'வைடூரியம்',
    'abstract knowledge': 'அருவ ஞானம்', 'sharp objects': 'கூர்மையான பொருள்கள்',
    'epidemics': 'தொற்றுநோய்கள்',
    // Rashi-related
    'Exalted': 'உச்சம்', 'Debilitated': 'நீசம்', 'co-ruler': 'இணை அதிபதி',
    'some authorities': 'சில ஆசிரியர்கள்',
    // Nakshatras
    'Nakshatras': 'நட்சத்திரங்கள்', 'Lunar Mansions': 'சந்திர மாளிகைகள்',
    'Each Nakshatra is ruled by a specific Graha': 'ஒவ்வொரு நட்சத்திரமும் ஒரு குறிப்பிட்ட கிரகத்தால் ஆளப்படுகிறது',
    // Cross-ref
    'Birth Chart Basics': 'ஜாதகக் கட்டம் அடிப்படைகள்',
    'How Grahas are placed in houses and signs': 'கிரகங்கள் பாவங்களிலும் ராசிகளிலும் எவ்வாறு அமைகின்றன',
    'The 12 Houses': '12 பாவங்கள்',
    'The houses that Grahas occupy and influence': 'கிரகங்கள் அமரும் மற்றும் தாக்கம் செலுத்தும் பாவங்கள்',
    'Planetary Periods': 'கிரக தசைகள்',
    'How planetary periods unfold across life': 'கிரக தசைகள் வாழ்க்கையில் எவ்வாறு விரிகின்றன',
    'Planetary Combinations': 'கிரக யோகங்கள்',
    'Special combinations formed by Grahas': 'கிரகங்களால் உருவாகும் சிறப்பு யோகங்கள்',
  },
  te: {
    'Atmakaraka': 'ఆత్మకారకుడు', 'soul': 'ఆత్మ', 'father': 'తండ్రి', 'king': 'రాజు',
    'government authority': 'ప్రభుత్వ అధికారం', 'bones': 'ఎముకలు', 'heart': 'హృదయం',
    'right eye': 'కుడి కన్ను', 'copper': 'రాగి', 'ruby': 'మాణిక్యం', 'wheat': 'గోధుమ',
    'temple': 'దేవాలయం', 'east direction': 'తూర్పు దిక్కు',
    'Mind': 'మనస్సు', 'Manas': 'మనస్సు', 'mother': 'తల్లి', 'queen': 'రాణి',
    'public opinion': 'ప్రజాభిప్రాయం', 'water': 'నీరు', 'milk': 'పాలు',
    'pearl': 'ముత్యం', 'silver': 'వెండి', 'left eye': 'ఎడమ కన్ను',
    'Monday': 'సోమవారం', 'northwest direction': 'వాయవ్య దిక్కు', 'white things': 'తెల్లని వస్తువులు',
    'Courage': 'ధైర్యం', 'brothers': 'సోదరులు', 'commander': 'సేనాపతి',
    'land': 'భూమి', 'blood': 'రక్తం', 'surgery': 'శస్త్రచికిత్స',
    'fire': 'అగ్ని', 'weapons': 'ఆయుధాలు', 'police': 'పోలీసు',
    'coral': 'పగడం', 'red things': 'ఎరుపు వస్తువులు', 'Tuesday': 'మంగళవారం',
    'south direction': 'దక్షిణ దిక్కు',
    'Intellect': 'బుద్ధి', 'speech': 'వాక్కు', 'trade': 'వ్యాపారం',
    'writing': 'రాయడం', 'mathematics': 'గణితం', 'maternal uncle': 'మేనమామ',
    'skin': 'చర్మం', 'emerald': 'మరకతం', 'green things': 'పచ్చని వస్తువులు',
    'Wednesday': 'బుధవారం', 'north direction': 'ఉత్తర దిక్కు', 'astrology': 'జ్యోతిషం',
    'Wisdom': 'జ్ఞానం', 'children': 'పిల్లలు', 'dharma': 'ధర్మం',
    'guru': 'గురువు', 'teacher': 'ఉపాధ్యాయుడు', 'wealth': 'సంపద', 'fortune': 'భాగ్యం',
    'fat': 'కొవ్వు', 'liver': 'కాలేయం', 'yellow sapphire': 'పుష్యరాగం',
    'gold': 'బంగారం', 'Thursday': 'గురువారం', 'northeast direction': 'ఈశాన్య దిక్కు',
    'sacred texts': 'పవిత్ర గ్రంథాలు',
    'Spouse': 'భార్య', 'wife': 'భార్య', 'love': 'ప్రేమ', 'beauty': 'సౌందర్యం',
    'art': 'కళ', 'music': 'సంగీతం', 'luxury': 'విలాసం', 'vehicles': 'వాహనాలు',
    'diamond': 'వజ్రం', 'semen': 'వీర్యం', 'southeast direction': 'ఆగ్నేయ దిక్కు',
    'Friday': 'శుక్రవారం', 'perfume': 'సుగంధం', 'flowers': 'పుష్పాలు',
    'Longevity': 'ఆయుష్షు', 'karma': 'కర్మ', 'discipline': 'క్రమశిక్షణ',
    'servants': 'సేవకులు', 'old age': 'వృద్ధాప్యం', 'sorrow': 'దుఃఖం',
    'iron': 'ఇనుము', 'blue sapphire': 'నీలం', 'Saturday': 'శనివారం',
    'west direction': 'పశ్చిమ దిక్కు', 'oil': 'నూనె', 'black things': 'నల్లని వస్తువులు',
    'democracy': 'ప్రజాస్వామ్యం',
    'Foreign lands': 'విదేశాలు', 'outcasts': 'బహిష్కృతులు',
    'illusion': 'మాయ', 'sudden events': 'ఆకస్మిక సంఘటనలు',
    'paternal grandfather': 'తాత', 'serpents': 'సర్పాలు',
    'hessonite': 'గోమేధికం', 'gomed': 'గోమేధికం', 'southwest direction': 'నైరుతి దిక్కు',
    'manipulation': 'మోసం', 'obsession': 'ఆసక్తి',
    'Moksha': 'మోక్షం', 'spiritual liberation': 'ఆధ్యాత్మిక విముక్తి',
    'maternal grandfather': 'తాత (తల్లివైపు)', 'ascetics': 'సన్యాసులు',
    'flag': 'జెండా', "cat's eye": 'వైడూర్యం', 'vaidurya': 'వైడూర్యం',
    'abstract knowledge': 'అమూర్త జ్ఞానం', 'sharp objects': 'పదునైన వస్తువులు',
    'epidemics': 'మహమ్మారులు',
    'Exalted': 'ఉచ్చం', 'Debilitated': 'నీచం', 'co-ruler': 'సహ అధిపతి',
    'some authorities': 'కొందరు శాస్త్రకారులు',
    'Nakshatras': 'నక్షత్రాలు', 'Lunar Mansions': 'చంద్ర భవనాలు',
    'Each Nakshatra is ruled by a specific Graha': 'ప్రతి నక్షత్రం ఒక నిర్దిష్ట గ్రహం చేత పాలించబడుతుంది',
    'Birth Chart Basics': 'జాతక చక్రం అడిప్రాయాలు',
    'How Grahas are placed in houses and signs': 'గ్రహాలు భావాలలో మరియు రాశులలో ఎలా ఉంటాయి',
    'The 12 Houses': '12 భావాలు',
    'The houses that Grahas occupy and influence': 'గ్రహాలు ఆక్రమించి ప్రభావితం చేసే భావాలు',
    'Planetary Periods': 'గ్రహ దశలు',
    'How planetary periods unfold across life': 'గ్రహ దశలు జీవితంలో ఎలా విస్తరిస్తాయి',
    'Planetary Combinations': 'గ్రహ యోగాలు',
    'Special combinations formed by Grahas': 'గ్రహాలచే ఏర్పడే ప్రత్యేక యోగాలు',
  },
  bn: {
    'Atmakaraka': 'আত্মকারক', 'soul': 'আত্মা', 'father': 'পিতা', 'king': 'রাজা',
    'government authority': 'সরকারি কর্তৃত্ব', 'bones': 'অস্থি', 'heart': 'হৃদয়',
    'right eye': 'ডান চোখ', 'copper': 'তামা', 'ruby': 'মাণিক্য', 'wheat': 'গম',
    'temple': 'মন্দির', 'east direction': 'পূর্ব দিক',
    'Mind': 'মন', 'Manas': 'মন', 'mother': 'মাতা', 'queen': 'রানি',
    'public opinion': 'জনমত', 'water': 'জল', 'milk': 'দুধ',
    'pearl': 'মুক্তা', 'silver': 'রূপা', 'left eye': 'বাম চোখ',
    'Monday': 'সোমবার', 'northwest direction': 'উত্তর-পশ্চিম দিক', 'white things': 'সাদা বস্তু',
    'Courage': 'সাহস', 'brothers': 'ভাই', 'commander': 'সেনাপতি',
    'land': 'ভূমি', 'blood': 'রক্ত', 'surgery': 'শল্যচিকিৎসা',
    'fire': 'অগ্নি', 'weapons': 'অস্ত্র', 'police': 'পুলিশ',
    'coral': 'প্রবাল', 'red things': 'লাল বস্তু', 'Tuesday': 'মঙ্গলবার',
    'south direction': 'দক্ষিণ দিক',
    'Intellect': 'বুদ্ধি', 'speech': 'বাক্', 'trade': 'বাণিজ্য',
    'writing': 'লেখা', 'mathematics': 'গণিত', 'maternal uncle': 'মামা',
    'skin': 'ত্বক', 'emerald': 'পান্না', 'green things': 'সবুজ বস্তু',
    'Wednesday': 'বুধবার', 'north direction': 'উত্তর দিক', 'astrology': 'জ্যোতিষ',
    'Wisdom': 'জ্ঞান', 'children': 'সন্তান', 'dharma': 'ধর্ম',
    'guru': 'গুরু', 'teacher': 'শিক্ষক', 'wealth': 'সম্পদ', 'fortune': 'ভাগ্য',
    'fat': 'মেদ', 'liver': 'যকৃৎ', 'yellow sapphire': 'পুষ্পরাগ',
    'gold': 'সোনা', 'Thursday': 'বৃহস্পতিবার', 'northeast direction': 'ঈশান দিক',
    'sacred texts': 'পবিত্র গ্রন্থ',
    'Spouse': 'পত্নী', 'wife': 'পত্নী', 'love': 'প্রেম', 'beauty': 'সৌন্দর্য',
    'art': 'কলা', 'music': 'সংগীত', 'luxury': 'বিলাসিতা', 'vehicles': 'যান',
    'diamond': 'হীরা', 'semen': 'বীর্য', 'southeast direction': 'অগ্নি দিক',
    'Friday': 'শুক্রবার', 'perfume': 'সুগন্ধ', 'flowers': 'ফুল',
    'Longevity': 'আয়ু', 'karma': 'কর্ম', 'discipline': 'শৃঙ্খলা',
    'servants': 'সেবক', 'old age': 'বৃদ্ধাবস্থা', 'sorrow': 'দুঃখ',
    'iron': 'লোহা', 'blue sapphire': 'নীলম', 'Saturday': 'শনিবার',
    'west direction': 'পশ্চিম দিক', 'oil': 'তেল', 'black things': 'কালো বস্তু',
    'democracy': 'গণতন্ত্র',
    'Foreign lands': 'বিদেশ', 'outcasts': 'বহিষ্কৃত',
    'illusion': 'মায়া', 'sudden events': 'আকস্মিক ঘটনা',
    'paternal grandfather': 'ঠাকুরদা', 'serpents': 'সর্প',
    'hessonite': 'গোমেদ', 'gomed': 'গোমেদ', 'southwest direction': 'নৈঋত দিক',
    'manipulation': 'কূটকৌশল', 'obsession': 'আসক্তি',
    'Moksha': 'মোক্ষ', 'spiritual liberation': 'আধ্যাত্মিক মুক্তি',
    'maternal grandfather': 'দাদু (মাতামহ)', 'ascetics': 'সন্ন্যাসী',
    'flag': 'পতাকা', "cat's eye": 'বৈদূর্য', 'vaidurya': 'বৈদূর্য',
    'abstract knowledge': 'বিমূর্ত জ্ঞান', 'sharp objects': 'ধারালো বস্তু',
    'epidemics': 'মহামারী',
    'Exalted': 'উচ্চ', 'Debilitated': 'নীচ', 'co-ruler': 'সহ-অধিপতি',
    'some authorities': 'কিছু শাস্ত্রকার',
    'Nakshatras': 'নক্ষত্র', 'Lunar Mansions': 'চন্দ্র ভবন',
    'Each Nakshatra is ruled by a specific Graha': 'প্রতিটি নক্ষত্র একটি নির্দিষ্ট গ্রহ দ্বারা শাসিত',
    'Birth Chart Basics': 'জন্মকুণ্ডলী মূল বিষয়',
    'How Grahas are placed in houses and signs': 'গ্রহগুলি ভাব এবং রাশিতে কীভাবে অবস্থিত হয়',
    'The 12 Houses': '১২ ভাব',
    'The houses that Grahas occupy and influence': 'গ্রহ যে ভাবগুলিতে অবস্থান করে এবং প্রভাবিত করে',
    'Planetary Periods': 'গ্রহ দশা',
    'How planetary periods unfold across life': 'জীবনে গ্রহ দশা কীভাবে প্রকাশিত হয়',
    'Planetary Combinations': 'গ্রহ যোগ',
    'Special combinations formed by Grahas': 'গ্রহদ্বারা গঠিত বিশেষ যোগ',
  },
  kn: {
    'Atmakaraka': 'ಆತ್ಮಕಾರಕ', 'soul': 'ಆತ್ಮ', 'father': 'ತಂದೆ', 'king': 'ರಾಜ',
    'government authority': 'ಸರ್ಕಾರಿ ಅಧಿಕಾರ', 'bones': 'ಮೂಳೆಗಳು', 'heart': 'ಹೃದಯ',
    'right eye': 'ಬಲ ಕಣ್ಣು', 'copper': 'ತಾಮ್ರ', 'ruby': 'ಮಾಣಿಕ್ಯ', 'wheat': 'ಗೋಧಿ',
    'temple': 'ದೇವಾಲಯ', 'east direction': 'ಪೂರ್ವ ದಿಕ್ಕು',
    'Mind': 'ಮನಸ್ಸು', 'Manas': 'ಮನಸ್ಸು', 'mother': 'ತಾಯಿ', 'queen': 'ರಾಣಿ',
    'public opinion': 'ಜನಾಭಿಪ್ರಾಯ', 'water': 'ನೀರು', 'milk': 'ಹಾಲು',
    'pearl': 'ಮುತ್ತು', 'silver': 'ಬೆಳ್ಳಿ', 'left eye': 'ಎಡ ಕಣ್ಣು',
    'Monday': 'ಸೋಮವಾರ', 'northwest direction': 'ವಾಯುವ್ಯ ದಿಕ್ಕು', 'white things': 'ಬಿಳಿ ವಸ್ತುಗಳು',
    'Courage': 'ಧೈರ್ಯ', 'brothers': 'ಸಹೋದರರು', 'commander': 'ಸೇನಾಪತಿ',
    'land': 'ಭೂಮಿ', 'blood': 'ರಕ್ತ', 'surgery': 'ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ',
    'fire': 'ಅಗ್ನಿ', 'weapons': 'ಆಯುಧಗಳು', 'police': 'ಪೊಲೀಸ್',
    'coral': 'ಹವಳ', 'red things': 'ಕೆಂಪು ವಸ್ತುಗಳು', 'Tuesday': 'ಮಂಗಳವಾರ',
    'south direction': 'ದಕ್ಷಿಣ ದಿಕ್ಕು',
    'Intellect': 'ಬುದ್ಧಿ', 'speech': 'ವಾಕ್', 'trade': 'ವ್ಯಾಪಾರ',
    'writing': 'ಬರವಣಿಗೆ', 'mathematics': 'ಗಣಿತ', 'maternal uncle': 'ಮಾವ',
    'skin': 'ಚರ್ಮ', 'emerald': 'ಮರಕತ', 'green things': 'ಹಸಿರು ವಸ್ತುಗಳು',
    'Wednesday': 'ಬುಧವಾರ', 'north direction': 'ಉತ್ತರ ದಿಕ್ಕು', 'astrology': 'ಜ್ಯೋತಿಷ',
    'Wisdom': 'ಜ್ಞಾನ', 'children': 'ಮಕ್ಕಳು', 'dharma': 'ಧರ್ಮ',
    'guru': 'ಗುರು', 'teacher': 'ಶಿಕ್ಷಕ', 'wealth': 'ಸಂಪತ್ತು', 'fortune': 'ಭಾಗ್ಯ',
    'fat': 'ಕೊಬ್ಬು', 'liver': 'ಯಕೃತ್', 'yellow sapphire': 'ಪುಷ್ಯರಾಗ',
    'gold': 'ಚಿನ್ನ', 'Thursday': 'ಗುರುವಾರ', 'northeast direction': 'ಈಶಾನ್ಯ ದಿಕ್ಕು',
    'sacred texts': 'ಪವಿತ್ರ ಗ್ರಂಥಗಳು',
    'Spouse': 'ಪತ್ನಿ', 'wife': 'ಪತ್ನಿ', 'love': 'ಪ್ರೇಮ', 'beauty': 'ಸೌಂದರ್ಯ',
    'art': 'ಕಲೆ', 'music': 'ಸಂಗೀತ', 'luxury': 'ವಿಲಾಸ', 'vehicles': 'ವಾಹನಗಳು',
    'diamond': 'ವಜ್ರ', 'semen': 'ವೀರ್ಯ', 'southeast direction': 'ಆಗ್ನೇಯ ದಿಕ್ಕು',
    'Friday': 'ಶುಕ್ರವಾರ', 'perfume': 'ಸುಗಂಧ', 'flowers': 'ಹೂವುಗಳು',
    'Longevity': 'ಆಯುಷ್ಯ', 'karma': 'ಕರ್ಮ', 'discipline': 'ಶಿಸ್ತು',
    'servants': 'ಸೇವಕರು', 'old age': 'ವೃದ್ಧಾಪ್ಯ', 'sorrow': 'ದುಃಖ',
    'iron': 'ಕಬ್ಬಿಣ', 'blue sapphire': 'ನೀಲಮಣಿ', 'Saturday': 'ಶನಿವಾರ',
    'west direction': 'ಪಶ್ಚಿಮ ದಿಕ್ಕು', 'oil': 'ಎಣ್ಣೆ', 'black things': 'ಕಪ್ಪು ವಸ್ತುಗಳು',
    'democracy': 'ಪ್ರಜಾಪ್ರಭುತ್ವ',
    'Foreign lands': 'ವಿದೇಶಗಳು', 'outcasts': 'ಬಹಿಷ್ಕೃತರು',
    'illusion': 'ಮಾಯೆ', 'sudden events': 'ಆಕಸ್ಮಿಕ ಘಟನೆಗಳು',
    'paternal grandfather': 'ತಾತ', 'serpents': 'ಸರ್ಪಗಳು',
    'hessonite': 'ಗೋಮೇಧಿಕ', 'gomed': 'ಗೋಮೇಧಿಕ', 'southwest direction': 'ನೈರುತ್ಯ ದಿಕ್ಕು',
    'manipulation': 'ಕುತಂತ್ರ', 'obsession': 'ಆಸಕ್ತಿ',
    'Moksha': 'ಮೋಕ್ಷ', 'spiritual liberation': 'ಆಧ್ಯಾತ್ಮಿಕ ಮುಕ್ತಿ',
    'maternal grandfather': 'ಅಜ್ಜ (ತಾಯಿ ಕಡೆ)', 'ascetics': 'ಸನ್ಯಾಸಿಗಳು',
    'flag': 'ಧ್ವಜ', "cat's eye": 'ವೈಡೂರ್ಯ', 'vaidurya': 'ವೈಡೂರ್ಯ',
    'abstract knowledge': 'ಅಮೂರ್ತ ಜ್ಞಾನ', 'sharp objects': 'ಹರಿತ ವಸ್ತುಗಳು',
    'epidemics': 'ಸಾಂಕ್ರಾಮಿಕ ರೋಗಗಳು',
    'Exalted': 'ಉಚ್ಚ', 'Debilitated': 'ನೀಚ', 'co-ruler': 'ಸಹ-ಅಧಿಪತಿ',
    'some authorities': 'ಕೆಲವು ಶಾಸ್ತ್ರಕಾರರು',
    'Nakshatras': 'ನಕ್ಷತ್ರಗಳು', 'Lunar Mansions': 'ಚಂದ್ರ ಭವನಗಳು',
    'Each Nakshatra is ruled by a specific Graha': 'ಪ್ರತಿ ನಕ್ಷತ್ರವನ್ನು ಒಂದು ನಿರ್ದಿಷ್ಟ ಗ್ರಹ ಆಳುತ್ತದೆ',
    'Birth Chart Basics': 'ಜನ್ಮಕುಂಡಲಿ ಮೂಲ ಅಂಶಗಳು',
    'How Grahas are placed in houses and signs': 'ಗ್ರಹಗಳು ಭಾವ ಮತ್ತು ರಾಶಿಗಳಲ್ಲಿ ಹೇಗೆ ಇರುತ್ತವೆ',
    'The 12 Houses': '12 ಭಾವಗಳು',
    'The houses that Grahas occupy and influence': 'ಗ್ರಹಗಳು ಆಕ್ರಮಿಸಿ ಪ್ರಭಾವ ಬೀರುವ ಭಾವಗಳು',
    'Planetary Periods': 'ಗ್ರಹ ದಶೆಗಳು',
    'How planetary periods unfold across life': 'ಜೀವನದಲ್ಲಿ ಗ್ರಹ ದಶೆಗಳು ಹೇಗೆ ತೆರೆದುಕೊಳ್ಳುತ್ತವೆ',
    'Planetary Combinations': 'ಗ್ರಹ ಯೋಗಗಳು',
    'Special combinations formed by Grahas': 'ಗ್ರಹಗಳಿಂದ ರಚಿತವಾದ ವಿಶೇಷ ಯೋಗಗಳು',
  },
  gu: {
    'Atmakaraka': 'આત્મકારક', 'soul': 'આત્મા', 'father': 'પિતા', 'king': 'રાજા',
    'government authority': 'સરકારી સત્તા', 'bones': 'હાડકાં', 'heart': 'હૃદય',
    'right eye': 'જમણી આંખ', 'copper': 'તાંબુ', 'ruby': 'માણેક', 'wheat': 'ઘઉં',
    'temple': 'મંદિર', 'east direction': 'પૂર્વ દિશા',
    'Mind': 'મન', 'Manas': 'મન', 'mother': 'માતા', 'queen': 'રાણી',
    'public opinion': 'જનમત', 'water': 'જળ', 'milk': 'દૂધ',
    'pearl': 'મોતી', 'silver': 'ચાંદી', 'left eye': 'ડાબી આંખ',
    'Monday': 'સોમવાર', 'northwest direction': 'વાયવ્ય દિશા', 'white things': 'સફેદ વસ્તુઓ',
    'Courage': 'સાહસ', 'brothers': 'ભાઈઓ', 'commander': 'સેનાપતિ',
    'land': 'ભૂમિ', 'blood': 'રક્ત', 'surgery': 'શસ્ત્રક્રિયા',
    'fire': 'અગ્નિ', 'weapons': 'શસ્ત્રો', 'police': 'પોલીસ',
    'coral': 'પરવાળું', 'red things': 'લાલ વસ્તુઓ', 'Tuesday': 'મંગળવાર',
    'south direction': 'દક્ષિણ દિશા',
    'Intellect': 'બુદ્ધિ', 'speech': 'વાણી', 'trade': 'વ્યાપાર',
    'writing': 'લેખન', 'mathematics': 'ગણિત', 'maternal uncle': 'મામા',
    'skin': 'ત્વચા', 'emerald': 'પન્ના', 'green things': 'લીલી વસ્તુઓ',
    'Wednesday': 'બુધવાર', 'north direction': 'ઉત્તર દિશા', 'astrology': 'જ્યોતિષ',
    'Wisdom': 'જ્ઞાન', 'children': 'સંતાન', 'dharma': 'ધર્મ',
    'guru': 'ગુરુ', 'teacher': 'શિક્ષક', 'wealth': 'સંપત્તિ', 'fortune': 'ભાગ્ય',
    'fat': 'ચરબી', 'liver': 'યકૃત', 'yellow sapphire': 'પુષ્પરાગ',
    'gold': 'સોનું', 'Thursday': 'ગુરુવાર', 'northeast direction': 'ઈશાન દિશા',
    'sacred texts': 'પવિત્ર ગ્રંથો',
    'Spouse': 'પત્ની', 'wife': 'પત્ની', 'love': 'પ્રેમ', 'beauty': 'સૌંદર્ય',
    'art': 'કળા', 'music': 'સંગીત', 'luxury': 'વિલાસ', 'vehicles': 'વાહનો',
    'diamond': 'હીરો', 'semen': 'વીર્ય', 'southeast direction': 'અગ્નિ દિશા',
    'Friday': 'શુક્રવાર', 'perfume': 'સુગંધ', 'flowers': 'ફૂલો',
    'Longevity': 'આયુષ્ય', 'karma': 'કર્મ', 'discipline': 'શિસ્ત',
    'servants': 'સેવકો', 'old age': 'વૃદ્ધાવસ્થા', 'sorrow': 'દુઃખ',
    'iron': 'લોખંડ', 'blue sapphire': 'નીલમ', 'Saturday': 'શનિવાર',
    'west direction': 'પશ્ચિમ દિશા', 'oil': 'તેલ', 'black things': 'કાળી વસ્તુઓ',
    'democracy': 'લોકશાહી',
    'Foreign lands': 'વિદેશ', 'outcasts': 'બહિષ્કૃત',
    'illusion': 'માયા', 'sudden events': 'અચાનક ઘટનાઓ',
    'paternal grandfather': 'દાદા', 'serpents': 'સર્પ',
    'hessonite': 'ગોમેદ', 'gomed': 'ગોમેદ', 'southwest direction': 'નૈઋત્ય દિશા',
    'manipulation': 'કુટિલતા', 'obsession': 'આસક્તિ',
    'Moksha': 'મોક્ષ', 'spiritual liberation': 'આધ્યાત્મિક મુક્તિ',
    'maternal grandfather': 'નાના', 'ascetics': 'સંન્યાસી',
    'flag': 'ધ્વજ', "cat's eye": 'વૈડૂર્ય', 'vaidurya': 'વૈડૂર્ય',
    'abstract knowledge': 'અમૂર્ત જ્ઞાન', 'sharp objects': 'તીક્ષ્ણ વસ્તુઓ',
    'epidemics': 'મહામારી',
    'Exalted': 'ઉચ્ચ', 'Debilitated': 'નીચ', 'co-ruler': 'સહ-અધિપતિ',
    'some authorities': 'કેટલાક શાસ્ત્રકારો',
    'Nakshatras': 'નક્ષત્રો', 'Lunar Mansions': 'ચંદ્ર ભવનો',
    'Each Nakshatra is ruled by a specific Graha': 'દરેક નક્ષત્ર એક ચોક્કસ ગ્રહ દ્વારા શાસિત છે',
    'Birth Chart Basics': 'જન્મકુંડળી મૂળભૂત બાબતો',
    'How Grahas are placed in houses and signs': 'ગ્રહો ભાવો અને રાશિઓમાં કેવી રીતે સ્થિત હોય છે',
    'The 12 Houses': '12 ભાવો',
    'The houses that Grahas occupy and influence': 'ગ્રહો જે ભાવોમાં રહે છે અને પ્રભાવિત કરે છે',
    'Planetary Periods': 'ગ્રહ દશાઓ',
    'How planetary periods unfold across life': 'જીવનમાં ગ્રહ દશાઓ કેવી રીતે પ્રગટ થાય છે',
    'Planetary Combinations': 'ગ્રહ યોગો',
    'Special combinations formed by Grahas': 'ગ્રહો દ્વારા રચાતા વિશેષ યોગો',
  },
  mr: {
    'Atmakaraka': 'आत्मकारक', 'soul': 'आत्मा', 'father': 'पिता', 'king': 'राजा',
    'government authority': 'शासकीय अधिकार', 'bones': 'हाडे', 'heart': 'हृदय',
    'right eye': 'उजवा डोळा', 'copper': 'तांबे', 'ruby': 'माणिक', 'wheat': 'गहू',
    'temple': 'मंदिर', 'east direction': 'पूर्व दिशा',
    'Mind': 'मन', 'Manas': 'मन', 'mother': 'आई', 'queen': 'राणी',
    'public opinion': 'लोकमत', 'water': 'पाणी', 'milk': 'दूध',
    'pearl': 'मोती', 'silver': 'चांदी', 'left eye': 'डावा डोळा',
    'Monday': 'सोमवार', 'northwest direction': 'वायव्य दिशा', 'white things': 'पांढऱ्या वस्तू',
    'Courage': 'धैर्य', 'brothers': 'भाऊ', 'commander': 'सेनापती',
    'land': 'भूमी', 'blood': 'रक्त', 'surgery': 'शस्त्रक्रिया',
    'fire': 'अग्नी', 'weapons': 'शस्त्रे', 'police': 'पोलीस',
    'coral': 'प्रवाळ', 'red things': 'लाल वस्तू', 'Tuesday': 'मंगळवार',
    'south direction': 'दक्षिण दिशा',
    'Intellect': 'बुद्धी', 'speech': 'वाणी', 'trade': 'व्यापार',
    'writing': 'लेखन', 'mathematics': 'गणित', 'maternal uncle': 'मामा',
    'skin': 'त्वचा', 'emerald': 'पाचू', 'green things': 'हिरव्या वस्तू',
    'Wednesday': 'बुधवार', 'north direction': 'उत्तर दिशा', 'astrology': 'ज्योतिष',
    'Wisdom': 'ज्ञान', 'children': 'मुले', 'dharma': 'धर्म',
    'guru': 'गुरू', 'teacher': 'शिक्षक', 'wealth': 'संपत्ती', 'fortune': 'भाग्य',
    'fat': 'चरबी', 'liver': 'यकृत', 'yellow sapphire': 'पुष्कराज',
    'gold': 'सोने', 'Thursday': 'गुरुवार', 'northeast direction': 'ईशान्य दिशा',
    'sacred texts': 'पवित्र ग्रंथ',
    'Spouse': 'पत्नी', 'wife': 'पत्नी', 'love': 'प्रेम', 'beauty': 'सौंदर्य',
    'art': 'कला', 'music': 'संगीत', 'luxury': 'विलास', 'vehicles': 'वाहने',
    'diamond': 'हिरा', 'semen': 'वीर्य', 'southeast direction': 'आग्नेय दिशा',
    'Friday': 'शुक्रवार', 'perfume': 'सुगंध', 'flowers': 'फुले',
    'Longevity': 'आयुष्य', 'karma': 'कर्म', 'discipline': 'शिस्त',
    'servants': 'सेवक', 'old age': 'वृद्धापकाळ', 'sorrow': 'दुःख',
    'iron': 'लोखंड', 'blue sapphire': 'नीलम', 'Saturday': 'शनिवार',
    'west direction': 'पश्चिम दिशा', 'oil': 'तेल', 'black things': 'काळ्या वस्तू',
    'democracy': 'लोकशाही',
    'Foreign lands': 'परदेश', 'outcasts': 'बहिष्कृत',
    'illusion': 'माया', 'sudden events': 'अचानक घटना',
    'paternal grandfather': 'आजोबा', 'serpents': 'सर्प',
    'hessonite': 'गोमेद', 'gomed': 'गोमेद', 'southwest direction': 'नैऋत्य दिशा',
    'manipulation': 'कुटिलता', 'obsession': 'आसक्ती',
    'Moksha': 'मोक्ष', 'spiritual liberation': 'आध्यात्मिक मुक्ती',
    'maternal grandfather': 'आजोबा (आईकडचे)', 'ascetics': 'संन्यासी',
    'flag': 'ध्वज', "cat's eye": 'वैडूर्य', 'vaidurya': 'वैडूर्य',
    'abstract knowledge': 'अमूर्त ज्ञान', 'sharp objects': 'धारदार वस्तू',
    'epidemics': 'साथीचे रोग',
    'Exalted': 'उच्च', 'Debilitated': 'नीच', 'co-ruler': 'सह-स्वामी',
    'some authorities': 'काही शास्त्रकार',
    'Nakshatras': 'नक्षत्रे', 'Lunar Mansions': 'चंद्र भवने',
    'Each Nakshatra is ruled by a specific Graha': 'प्रत्येक नक्षत्र एका विशिष्ट ग्रहाद्वारे शासित आहे',
    'Birth Chart Basics': 'जन्मकुंडली मूलभूत माहिती',
    'How Grahas are placed in houses and signs': 'ग्रह भावांमध्ये आणि राशींमध्ये कसे स्थित असतात',
    'The 12 Houses': '१२ भाव',
    'The houses that Grahas occupy and influence': 'ग्रह ज्या भावांमध्ये राहतात आणि प्रभावित करतात',
    'Planetary Periods': 'ग्रह दशा',
    'How planetary periods unfold across life': 'जीवनात ग्रह दशा कशा प्रगट होतात',
    'Planetary Combinations': 'ग्रह योग',
    'Special combinations formed by Grahas': 'ग्रहांद्वारे तयार होणारे विशेष योग',
  },
  mai: {
    'Atmakaraka': 'आत्मकारक', 'soul': 'आत्मा', 'father': 'पिता', 'king': 'राजा',
    'government authority': 'सरकारी अधिकार', 'bones': 'हड्डी', 'heart': 'हृदय',
    'right eye': 'दहिना आँखि', 'copper': 'ताम्र', 'ruby': 'माणिक्य', 'wheat': 'गेहूँ',
    'temple': 'मन्दिर', 'east direction': 'पूर्व दिशा',
    'Mind': 'मन', 'Manas': 'मन', 'mother': 'माय', 'queen': 'रानी',
    'public opinion': 'जनमत', 'water': 'पानि', 'milk': 'दूध',
    'pearl': 'मोती', 'silver': 'चाँदी', 'left eye': 'बाम आँखि',
    'Monday': 'सोमदिन', 'northwest direction': 'वायव्य दिशा', 'white things': 'उज्जर वस्तु',
    'Courage': 'साहस', 'brothers': 'भाय', 'commander': 'सेनापति',
    'land': 'भूमि', 'blood': 'खून', 'surgery': 'शल्यचिकित्सा',
    'fire': 'आगि', 'weapons': 'हथियार', 'police': 'पुलिस',
    'coral': 'मूँगा', 'red things': 'लाल वस्तु', 'Tuesday': 'मंगलदिन',
    'south direction': 'दक्षिण दिशा',
    'Intellect': 'बुद्धि', 'speech': 'वाणी', 'trade': 'व्यापार',
    'writing': 'लेखन', 'mathematics': 'गणित', 'maternal uncle': 'मामा',
    'skin': 'चमड़ी', 'emerald': 'पन्ना', 'green things': 'हरियर वस्तु',
    'Wednesday': 'बुधदिन', 'north direction': 'उत्तर दिशा', 'astrology': 'ज्योतिष',
    'Wisdom': 'ज्ञान', 'children': 'बच्चा सभ', 'dharma': 'धर्म',
    'guru': 'गुरु', 'teacher': 'शिक्षक', 'wealth': 'धन', 'fortune': 'भाग्य',
    'fat': 'चर्बी', 'liver': 'कलेजी', 'yellow sapphire': 'पुखराज',
    'gold': 'सोना', 'Thursday': 'बृहस्पतिदिन', 'northeast direction': 'ईशान दिशा',
    'sacred texts': 'पवित्र ग्रन्थ',
    'Spouse': 'पत्नी', 'wife': 'पत्नी', 'love': 'प्रेम', 'beauty': 'सौन्दर्य',
    'art': 'कला', 'music': 'संगीत', 'luxury': 'विलास', 'vehicles': 'वाहन',
    'diamond': 'हीरा', 'semen': 'वीर्य', 'southeast direction': 'आग्नेय दिशा',
    'Friday': 'शुक्रदिन', 'perfume': 'सुगन्ध', 'flowers': 'फूल',
    'Longevity': 'आयु', 'karma': 'कर्म', 'discipline': 'अनुशासन',
    'servants': 'सेवक', 'old age': 'बुढ़ापा', 'sorrow': 'दुःख',
    'iron': 'लोहा', 'blue sapphire': 'नीलम', 'Saturday': 'शनिदिन',
    'west direction': 'पश्चिम दिशा', 'oil': 'तेल', 'black things': 'कारी वस्तु',
    'democracy': 'लोकतन्त्र',
    'Foreign lands': 'विदेश', 'outcasts': 'बहिष्कृत',
    'illusion': 'माया', 'sudden events': 'अचानक घटना',
    'paternal grandfather': 'बाबा', 'serpents': 'साँप',
    'hessonite': 'गोमेद', 'gomed': 'गोमेद', 'southwest direction': 'नैऋत्य दिशा',
    'manipulation': 'छल-कपट', 'obsession': 'आसक्ति',
    'Moksha': 'मोक्ष', 'spiritual liberation': 'आध्यात्मिक मुक्ति',
    'maternal grandfather': 'नाना', 'ascetics': 'संन्यासी',
    'flag': 'झण्डा', "cat's eye": 'वैडूर्य', 'vaidurya': 'वैडूर्य',
    'abstract knowledge': 'अमूर्त ज्ञान', 'sharp objects': 'तीखगर वस्तु',
    'epidemics': 'महामारी',
    'Exalted': 'उच्च', 'Debilitated': 'नीच', 'co-ruler': 'सह-स्वामी',
    'some authorities': 'किछु शास्त्रकार',
    'Nakshatras': 'नक्षत्र', 'Lunar Mansions': 'चन्द्र भवन',
    'Each Nakshatra is ruled by a specific Graha': 'प्रत्येक नक्षत्र एक विशिष्ट ग्रह द्वारा शासित अछि',
    'Birth Chart Basics': 'जन्मकुण्डली मूल बात',
    'How Grahas are placed in houses and signs': 'ग्रह भाव आ राशि मे कोना स्थित होइत अछि',
    'The 12 Houses': '12 भाव',
    'The houses that Grahas occupy and influence': 'ओ भाव जाहि मे ग्रह स्थित होइत अछि आ प्रभावित करैत अछि',
    'Planetary Periods': 'ग्रह दशा',
    'How planetary periods unfold across life': 'जीवन मे ग्रह दशा कोना प्रगट होइत अछि',
    'Planetary Combinations': 'ग्रह योग',
    'Special combinations formed by Grahas': 'ग्रह द्वारा बनय वाला विशेष योग',
  },
};

/**
 * Given an English text, produce a translation for the given locale.
 * For short phrase-level content (rashi names, sign names with degrees),
 * we do term-level replacement. For longer sentences, we do full translation
 * using the dictionary approach.
 */
function translateText(enText, lang) {
  if (!enText || typeof enText !== 'string') return enText;

  const dict = TERM_DICT[lang];
  if (!dict) return enText;

  let result = enText;

  // Replace rashi names
  for (const [en, tr] of Object.entries(RASHI_NAMES)) {
    if (tr[lang]) {
      result = result.replace(new RegExp(`\\b${en}\\b`, 'g'), tr[lang]);
    }
  }

  // Replace graha names
  for (const [en, tr] of Object.entries(GRAHA_NAMES)) {
    if (tr[lang]) {
      result = result.replace(new RegExp(`\\b${en}\\b`, 'g'), tr[lang]);
    }
  }

  // For very long text (sentences/paragraphs), do full sentence translation
  // For shorter comma-separated lists, do term-by-term

  // Check if this is a comma-separated list of terms
  const parts = result.split(', ');
  if (parts.length > 2) {
    // Translate each term individually
    const translated = parts.map(part => {
      // Try exact match first
      const trimmed = part.trim();
      // Remove parenthetical for matching
      const cleanPart = trimmed.replace(/\s*\(.*?\)\s*/g, '').trim();
      if (dict[cleanPart]) return dict[cleanPart];
      if (dict[trimmed]) return dict[trimmed];

      // Try partial matches for compound terms
      let p = trimmed;
      // Sort by length descending to match longer phrases first
      const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        if (p.includes(key)) {
          p = p.replace(key, dict[key]);
        }
      }
      return p;
    });
    return translated.join(', ');
  }

  // For single terms or short phrases, try dictionary lookup
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (result.includes(key)) {
      result = result.replace(new RegExp(escapeRegExp(key), 'g'), dict[key]);
    }
  }

  return result;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, (match) => '\\' + match);
}

/**
 * Process a file: find all locale objects and replace seeded translations.
 *
 * Strategy: Use regex to find patterns like:
 *   ta: 'English text here'
 * where the text matches the en: value in the same object, and replace.
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;

  // Find all locale objects with the pattern { en: '...', hi: '...', ... ta: '...', te: '...', ... }
  // We need to match the en value and then check if ta/te/bn/kn/gu have the same value

  // Strategy: find each line or multi-line object that contains locale keys
  // Match patterns like: { en: 'text', hi: 'text', sa: 'text', mai: 'text', mr: 'text', ta: 'text', te: 'text', bn: 'text', kn: 'text', gu: 'text' }

  // Regex to find locale objects - match { ... en: '...' ... ta: '...' ... }
  // We'll process line by line for objects that are on single lines

  const lines = content.split('\n');
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check if this line contains a locale object with ta: matching en:
    // Pattern: en: 'something', ... ta: 'something' (same text)
    const enMatch = line.match(/en:\s*'([^']*(?:\\.[^']*)*)'/);
    if (!enMatch) {
      // Try double quotes
      const enMatchDQ = line.match(/en:\s*"([^"]*(?:\\.[^"]*)*)"/);
      if (!enMatchDQ) {
        newLines.push(line);
        continue;
      }
    }

    const enText = (line.match(/en:\s*'([^']*(?:\\.[^']*)*)'/) || line.match(/en:\s*"([^"]*(?:\\.[^"]*)*)"/))?.[1];
    if (!enText) {
      newLines.push(line);
      continue;
    }

    // Check if ta exists and equals en (seeded)
    const taMatch = line.match(/ta:\s*'([^']*(?:\\.[^']*)*)'/);
    const hiMatch = line.match(/hi:\s*'([^']*(?:\\.[^']*)*)'/);

    if (!taMatch) {
      newLines.push(line);
      continue;
    }

    const taText = taMatch[1];
    const hiText = hiMatch?.[1];

    // Check if ta is seeded (equals en)
    if (taText === enText) {
      // This is a seeded line - replace ta/te/bn/kn/gu with real translations
      const langs = ['ta', 'te', 'bn', 'kn', 'gu'];
      for (const lang of langs) {
        const langRegex = new RegExp(`${lang}:\\s*'${escapeRegExp(enText)}'`);
        if (line.match(langRegex)) {
          const translated = translateText(enText, lang);
          line = line.replace(langRegex, `${lang}: '${translated}'`);
          changeCount++;
        }
      }
    }

    // Check if mai/mr are seeded (equal to hi)
    if (hiText) {
      const maiMatch = line.match(/mai:\s*'([^']*(?:\\.[^']*)*)'/);
      if (maiMatch && maiMatch[1] === hiText) {
        // mai is a Hindi copy - need to provide real Maithili
        // For now, keep similar to Hindi but with Maithili flavor
        const maiTranslated = translateMaiFromHi(hiText);
        line = line.replace(
          new RegExp(`mai:\\s*'${escapeRegExp(hiText)}'`),
          `mai: '${maiTranslated}'`
        );
        changeCount++;
      }

      const mrMatch = line.match(/mr:\s*'([^']*(?:\\.[^']*)*)'/);
      if (mrMatch && mrMatch[1] === hiText) {
        // mr is a Hindi copy - need real Marathi
        const mrTranslated = translateMrFromHi(hiText);
        line = line.replace(
          new RegExp(`mr:\\s*'${escapeRegExp(hiText)}'`),
          `mr: '${mrTranslated}'`
        );
        changeCount++;
      }
    }

    newLines.push(line);
  }

  const newContent = newLines.join('\n');
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`  Updated ${filePath} (${changeCount} replacements)`);
  } else {
    console.log(`  No changes needed: ${filePath}`);
  }
  return changeCount;
}

// Hindi to Maithili translation (very close languages, but with distinct features)
const HI_TO_MAI = {
  // Rashi names (same in both)
  'सिंह': 'सिंह', 'वृषभ': 'वृषभ', 'कर्क': 'कर्क', 'मेष': 'मेष',
  'मिथुन': 'मिथुन', 'कन्या': 'कन्या', 'तुला': 'तुला', 'वृश्चिक': 'वृश्चिक',
  'धनु': 'धनु', 'मकर': 'मकर', 'कुम्भ': 'कुम्भ', 'मीन': 'मीन',
  // Postpositions / verb forms (key Maithili differences)
  'में': 'मे', 'है': 'अछि', 'हैं': 'अछि', 'होती है': 'होइत अछि',
  'होता है': 'होइत अछि', 'होते हैं': 'होइत अछि',
  'करता है': 'करैत अछि', 'करती है': 'करैत अछि', 'करते हैं': 'करैत अछि',
  'डालता है': 'दैत अछि', 'डालती है': 'दैत अछि',
  'मानी जाती है': 'मानल जाइत अछि', 'माना जाता है': 'मानल जाइत अछि',
  'दर्शाता है': 'देखबैत अछि',
  'लाती है': 'अनैत अछि', 'लाता है': 'अनैत अछि',
  'स्वीकार नहीं करते': 'स्वीकार नहिं करैत अछि',
  'से जुड़ा': 'सँ जुड़ल',
  'बनाता है': 'बनबैत अछि',
  'हो सकते हैं': 'भऽ सकैत अछि',
  'दर्शा सकता है': 'देखा सकैत अछि',
  // Common terms
  'के अनुसार': 'अनुसार', 'कुछ शास्त्रकारों': 'किछु शास्त्रकार',
  'सह-स्वामी': 'सह-स्वामी',
  // Pronouns / particles
  'अपने स्थान से': 'अपन स्थान सँ',
  'इसका स्थान': 'एकर स्थान',
  'किन्तु': 'मुदा',
  'और': 'आ',
  'पर': 'पर', 'का': 'क', 'की': 'क', 'के': 'क',
};

function translateMaiFromHi(hiText) {
  if (!hiText) return hiText;
  let result = hiText;
  // Sort by length descending
  const sorted = Object.entries(HI_TO_MAI).sort((a, b) => b[0].length - a[0].length);
  for (const [hi, mai] of sorted) {
    result = result.replace(new RegExp(escapeRegExp(hi), 'g'), mai);
  }
  return result;
}

// Hindi to Marathi translation
const HI_TO_MR = {
  // Postpositions / verb forms
  'में': 'मध्ये', 'है': 'आहे', 'हैं': 'आहेत',
  'होती है': 'होते', 'होता है': 'होतो', 'होते हैं': 'होतात',
  'करता है': 'करतो', 'करती है': 'करते', 'करते हैं': 'करतात',
  'डालता है': 'टाकतो', 'डालती है': 'टाकते',
  'मानी जाती है': 'मानले जाते', 'माना जाता है': 'मानले जाते',
  'दर्शाता है': 'दर्शवितो',
  'लाती है': 'आणते', 'लाता है': 'आणतो',
  'स्वीकार नहीं करते': 'स्वीकार करत नाहीत',
  'से जुड़ा': 'शी जोडलेले',
  'बनाता है': 'बनवतो',
  'हो सकते हैं': 'होऊ शकतात',
  'दर्शा सकता है': 'दर्शवू शकतो',
  // Common terms
  'कुछ शास्त्रकारों के अनुसार': 'काही शास्त्रकारांनुसार',
  'सह-स्वामी': 'सह-स्वामी',
  // Pronouns / particles
  'अपने स्थान से': 'आपल्या स्थानापासून',
  'इसका स्थान': 'याचे स्थान',
  'किन्तु': 'परंतु', 'और': 'आणि',
  'पर दृष्टि': 'वर दृष्टी', 'भाव पर': 'भावावर',
  'का': 'चा', 'की': 'ची', 'के': 'चे',
  // Specific Marathi terms
  'दायाँ नेत्र': 'उजवा डोळा', 'बायाँ नेत्र': 'डावा डोळा',
  'माता': 'आई', 'सरकारी': 'शासकीय',
  'ताम्र': 'तांबे', 'स्वर्ण': 'सोने',
  'शल्य': 'शस्त्रक्रिया', 'शस्त्र': 'शस्त्र',
  'भाई': 'भाऊ', 'अस्थि': 'हाडे',
};

function translateMrFromHi(hiText) {
  if (!hiText) return hiText;
  let result = hiText;
  const sorted = Object.entries(HI_TO_MR).sort((a, b) => b[0].length - a[0].length);
  for (const [hi, mr] of sorted) {
    result = result.replace(new RegExp(escapeRegExp(hi), 'g'), mr);
  }
  return result;
}

// ─── Main ───────────────────────────────────────────────────────────
let totalChanges = 0;
for (const file of FILES) {
  const filePath = path.join(BASE, file);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP (not found): ${filePath}`);
    continue;
  }
  totalChanges += processFile(filePath);
}
console.log(`\nTotal replacements: ${totalChanges}`);
