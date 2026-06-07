'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Sun, Moon, MapPin, ArrowLeft, Sparkles } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { Link } from '@/lib/i18n/navigation';
import { tl } from '@/lib/utils/trilingual';
import { nowMinutesInTimezone, todayInTimezone } from '@/lib/utils/now-in-timezone';
import { computeGauriPanchang } from '@/lib/gauri/gauri-calculator';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { useLocationStore } from '@/stores/location-store';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale, GauriSlot } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// ─── City selector ───────────────────────────────────────────────
// Gauri Panchang's primary audience is South-Indian — front the list
// with TN/KA/AP/TS/KL cities, then add the top North-Indian metros so
// users elsewhere can still pick a meaningful default.
const CITY_SLUGS = [
  'chennai',
  'bangalore',
  'hyderabad',
  'thiruvananthapuram',
  'coimbatore',
  'madurai',
  'mysore',
  'visakhapatnam',
  'mumbai',
  'delhi',
] as const;
const SELECTOR_CITIES = CITY_SLUGS
  .map(s => CITIES.find(c => c.slug === s))
  .filter((c): c is CityData => Boolean(c));

// Default for the initial render — must match the server (which uses
// Chennai for SSR). After mount we may switch to a stored location.
const DEFAULT_CITY: CityData = CITIES.find(c => c.slug === 'chennai') ?? CITIES[0];

// ─── Nature color mapping (only two tiers in Gauri) ──────────────
const NATURE_STYLES: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  auspicious: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300',
    text: 'text-emerald-400',
  },
  inauspicious: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-300',
    text: 'text-red-400',
  },
};

// ─── Labels ──────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Panchang',
    title: 'Gauri Panchang Today',
    dayGauri: 'Day Gauri Panchang',
    nightGauri: 'Night Gauri Panchang',
    auspicious: 'Auspicious',
    inauspicious: 'Inauspicious',
    whatIs: 'What is Gauri Panchang?',
    whatIsText: 'Gauri Panchang (also called Gowri Panchangam or Gauri Nalla Neram) is the South-Indian counterpart of Choghadiya — a Vedic time-division system that splits each day and night into 8 equal periods. Five periods are auspicious (Amritha, Siddha, Laabha, Dhanam, Sugam) and three are inauspicious (Marana, Rogam, Sokam). It is widely used across Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, and Kerala to choose auspicious times for new ventures, travel, business, and ceremonies.',
    typesTitle: 'The 8 Gauri Periods Explained',
    types: 'Amritha|Nectar — the most auspicious period, ideal for all new ventures and important beginnings|Siddha|Achievement — excellent for finishing important work, signing agreements, exams|Laabha|Gain — best for business transactions, trade, financial decisions|Dhanam|Wealth — auspicious for investments, purchases, banking activities|Sugam|Comfort — gentle and supportive period, good for travel and social events|Marana|Death — strongly inauspicious; avoid medical procedures, surgeries, journeys|Rogam|Disease — avoid health-related decisions, new diets, or stressful activities|Sokam|Sorrow — avoid arguments, contract signings, emotional commitments',
    bestTitle: 'Best Gauri Period for Each Activity',
    bestText: 'For starting a new venture or moving into a new home, Amritha is universally considered the most powerful. Business and financial activities are best timed during Laabha (gain) or Dhanam (wealth). For travel and family gatherings, Sugam (comfort) is preferred. For finishing exams, certifications, or signing important agreements, Siddha (achievement) brings the strongest support. Avoid Marana, Rogam, and Sokam for any auspicious work — these periods are best reserved for rest, routine maintenance, or activities you wish to conclude rather than begin.',
    seeAlso: 'See Also',
  },
  ta: {
    back: 'பஞ்சாங்கம்',
    title: 'இன்றைய கௌரி பஞ்சாங்கம்',
    dayGauri: 'பகல் கௌரி பஞ்சாங்கம்',
    nightGauri: 'இரவு கௌரி பஞ்சாங்கம்',
    auspicious: 'நல்ல நேரம்',
    inauspicious: 'கெட்ட நேரம்',
    whatIs: 'கௌரி பஞ்சாங்கம் என்றால் என்ன?',
    whatIsText: 'கௌரி பஞ்சாங்கம் (கௌரி நல்ல நேரம்) என்பது தென்னிந்தியாவில் பரவலாகப் பயன்படுத்தப்படும் வைதீக கால-பிரிவு முறையாகும். ஒவ்வொரு பகலும் இரவும் 8 சமமான கால-பகுதிகளாகப் பிரிக்கப்படுகின்றன. அமிர்தம், சித்தம், லாபம், தனம், சுகம் — இவை ஐந்தும் சுபமான நேரங்கள். மரணம், ரோகம், சோகம் — இவை மூன்றும் கெட்ட நேரம். தமிழ்நாடு, கர்நாடகா, ஆந்திரா, தெலங்கானா, கேரளாவில் புதிய காரியங்கள், பயணம், வியாபாரம், சடங்குகளுக்கு உகந்த நேரம் தேர்வு செய்ய பயன்படுகிறது.',
    typesTitle: '8 கௌரி காலங்களின் விளக்கம்',
    types: 'அமிர்தம்|அமுதம் — மிக சுபமான காலம், புதிய காரியங்களுக்கும் முக்கிய தொடக்கங்களுக்கும் சிறந்தது|சித்தம்|சாதனை — முக்கியமான பணிகளை முடிக்க, ஒப்பந்தங்கள் கையெழுத்திட, தேர்வுகளுக்கு சிறந்தது|லாபம்|லாபம் — வியாபாரம், வர்த்தகம், நிதி முடிவுகளுக்கு சிறந்தது|தனம்|செல்வம் — முதலீடு, கொள்முதல், வங்கி செயல்பாடுகளுக்கு சுபம்|சுகம்|சௌகர்யம் — மென்மையான ஆதரவான காலம், பயணம் மற்றும் சமூக நிகழ்வுகளுக்கு நல்லது|மரணம்|மரணம் — மிகவும் அசுபம்; மருத்துவ செயல்முறைகள், அறுவை சிகிச்சை, பயணங்களைத் தவிர்க்கவும்|ரோகம்|நோய் — உடல்நலம் தொடர்பான முடிவுகள், புதிய உணவு முறை, அழுத்தமான செயல்பாடுகளைத் தவிர்க்கவும்|சோகம்|சோகம் — வாதங்கள், ஒப்பந்தம் கையெழுத்திட, உணர்ச்சிபூர்வமான உறுதிமொழிகளைத் தவிர்க்கவும்',
    bestTitle: 'ஒவ்வொரு செயலுக்கும் சிறந்த கௌரி காலம்',
    bestText: 'புதிய காரியம் தொடங்க அல்லது புதிய வீட்டில் குடியேற — அமிர்தம் சர்வசாதாரணமாக மிக சக்திவாய்ந்தது. வியாபாரம் மற்றும் நிதி நடவடிக்கைகள் — லாபம் அல்லது தனம் காலத்தில் சிறந்தது. பயணம் மற்றும் குடும்ப கூட்டங்கள் — சுகம் காலத்தில் உகந்தது. தேர்வுகள், சான்றிதழ்கள், ஒப்பந்தங்கள் — சித்தம் காலத்தில் வலுவான ஆதரவு. மரணம், ரோகம், சோகம் காலங்களில் எந்த சுப காரியத்தையும் தொடங்க வேண்டாம் — இந்த நேரங்கள் ஓய்வு, வழக்கமான பராமரிப்பு, அல்லது நீங்கள் முடிக்க விரும்பும் செயல்பாடுகளுக்காக ஒதுக்கப்பட்டவை.',
    seeAlso: 'மேலும் பார்க்க',
  },
  hi: {
    back: 'पंचांग',
    title: 'आज का गौरी पंचांग',
    dayGauri: 'दिन का गौरी पंचांग',
    nightGauri: 'रात का गौरी पंचांग',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    whatIs: 'गौरी पंचांग क्या है?',
    whatIsText: 'गौरी पंचांग (जिसे गौरी नल्ल नेरम भी कहा जाता है) दक्षिण भारत में प्रचलित चौघड़िया का समकक्ष है — एक वैदिक काल-विभाजन प्रणाली जो प्रत्येक दिन और रात को 8 बराबर भागों में बाँटती है। पाँच काल शुभ हैं (अमृत, सिद्ध, लाभ, धन, सुगम) और तीन अशुभ (मरण, रोग, शोक)। यह तमिलनाडु, कर्नाटक, आंध्र प्रदेश, तेलंगाना और केरल में नए कार्य, यात्रा, व्यापार और अनुष्ठान के लिए शुभ समय चुनने में व्यापक रूप से प्रयुक्त है।',
    typesTitle: '8 गौरी कालों का विस्तृत विवरण',
    types: 'अमृत|अमृत — सबसे शुभ काल, सभी नए कार्यों और महत्वपूर्ण आरम्भ के लिए उत्तम|सिद्ध|कार्य-सिद्धि — महत्वपूर्ण कार्य पूरा करने, अनुबंध हस्ताक्षर, परीक्षा के लिए उत्कृष्ट|लाभ|लाभ — व्यापार, वाणिज्य, वित्तीय निर्णयों के लिए सर्वश्रेष्ठ|धन|धन — निवेश, खरीद, बैंकिंग गतिविधियों के लिए शुभ|सुगम|सुख-सुविधा — सौम्य और सहायक काल, यात्रा और सामाजिक कार्यों के लिए|मरण|मृत्यु-सूचक — दृढ़ता से अशुभ; चिकित्सा प्रक्रिया, शल्य, यात्रा से बचें|रोग|रोग — स्वास्थ्य सम्बन्धी निर्णय, नया आहार, तनावपूर्ण गतिविधियों से बचें|शोक|दुःख — विवाद, अनुबंध हस्ताक्षर, भावनात्मक प्रतिबद्धताओं से बचें',
    bestTitle: 'प्रत्येक कार्य के लिए सर्वश्रेष्ठ गौरी काल',
    bestText: 'नए कार्य आरम्भ या नए घर में प्रवेश के लिए — अमृत सार्वभौमिक रूप से सबसे शक्तिशाली माना जाता है। व्यापार और वित्तीय गतिविधियाँ लाभ या धन काल में सर्वोत्तम। यात्रा और पारिवारिक समारोह — सुगम काल में। परीक्षा, प्रमाणपत्र, महत्वपूर्ण अनुबंध — सिद्ध काल में सबसे मजबूत सहायता। मरण, रोग, शोक काल में कोई भी शुभ कार्य न करें — ये काल विश्राम, नियमित रखरखाव, या जो आप समाप्त करना चाहते हैं उसके लिए उपयुक्त हैं।',
    seeAlso: 'यह भी देखें',
  },
  // The 6 blocks below were translated by Gemini 2.5 Flash on Vertex AI
  // via scripts/translate-gauri-labels-via-gemini.py (78 strings total).
  // Each carries _meta.review_status: pending-native-review until proofread.
  mai: {
    back: 'पंचांग',
    title: 'गौरी पंचांग आजु',
    dayGauri: 'दिनक गौरी पंचांग',
    nightGauri: 'रातिक गौरी पंचांग',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    whatIs: 'गौरी पंचांग की अछि?',
    whatIsText: 'गौरी पंचांग (जेकरा गौरी पंचांगम् वा गौरी नल्ला नेरम् सेहो कहल जाइत अछि) चोघड़ियाक दक्षिण-भारतीय प्रतिरूप अछि — एकटा वैदिक समय-विभाजन प्रणाली जे प्रत्येक दिन आ राति केँ ८ समान कालखंड मे बाँटैत अछि। पाँच कालखंड शुभ होइत अछि (अमृत, सिद्ध, लाभ, धन, सुगम) आ तीनटा अशुभ होइत अछि (मरण, रोग, शोक)। एकर व्यापक उपयोग तमिलनाडु, कर्नाटक, आंध्र प्रदेश, तेलंगाना आ केरल मे नव कार्य, यात्रा, व्यवसाय आ समारोहक लेल शुभ समय चुनबाक लेल कयल जाइत अछि।',
    typesTitle: '८ गौरी कालखंडक व्याख्या',
    types: 'अमृत|अमृत — सबसँ शुभ कालखंड, सबटा नव कार्य आ महत्वपूर्ण शुरुआतक लेल आदर्श|सिद्ध|सिद्धि — महत्वपूर्ण काज समाप्त करबाक, समझौता पर हस्ताक्षर करबाक, परीक्षाक लेल उत्कृष्ट|लाभ|लाभ — व्यावसायिक लेनदेन, व्यापार, वित्तीय निर्णयक लेल सर्वोत्तम|धन|धन — निवेश, खरीद, बैंकिंग गतिविधियक लेल शुभ|सुगम|सुख — कोमल आ सहायक कालखंड, यात्रा आ सामाजिक कार्यक्रमक लेल नीक|मरण|मृत्यु — प्रबल रूप सँ अशुभ; चिकित्सा प्रक्रिया, शल्य चिकित्सा, यात्रा सँ बचू|रोग|रोग — स्वास्थ्य सँ संबंधित निर्णय, नव आहार, वा तनावपूर्ण गतिविधि सँ बचू|शोक|शोक — झगड़ा, अनुबंध पर हस्ताक्षर, भावनात्मक प्रतिबद्धता सँ बचू',
    bestTitle: 'प्रत्येक कार्यक लेल सर्वोत्तम गौरी कालखंड',
    bestText: 'नव कार्य शुरू करबाक वा नव घर मे प्रवेश करबाक लेल, अमृत केँ सार्वभौमिक रूप सँ सबसँ शक्तिशाली मानल जाइत अछि। व्यावसायिक आ वित्तीय गतिविधियक लेल लाभ (लाभ) वा धन (धन) कालखंड सर्वोत्तम मानल जाइत अछि। यात्रा आ पारिवारिक समागमक लेल सुगम (सुख) केँ प्राथमिकता देल जाइत अछि। परीक्षा, प्रमाणीकरण वा महत्वपूर्ण समझौता पर हस्ताक्षर करबाक लेल, सिद्ध (सिद्धि) सबसँ प्रबल समर्थन दैत अछि। कोनो शुभ कार्यक लेल मरण, रोग आ शोक सँ बचू — ई कालखंड आराम, नियमित रखरखाव वा ओहि गतिविधियक लेल सर्वोत्तम अछि जेकरा अहाँ शुरू करबाक बदला मे समाप्त करय चाहैत छी।',
    seeAlso: 'एहो देखू',
  },
  mr: {
    back: 'पंचांग',
    title: 'आजचे गौरी पंचांग',
    dayGauri: 'दिवसाचे गौरी पंचांग',
    nightGauri: 'रात्रीचे गौरी पंचांग',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    whatIs: 'गौरी पंचांग काय आहे?',
    whatIsText: 'गौरी पंचांग (ज्याला गौरी पंचांगम किंवा गौरी नल्ला नेरम असेही म्हणतात) हे चोघडियाचे दक्षिण भारतीय समतुल्य आहे — एक वैदिक काल-विभाजन प्रणाली जी प्रत्येक दिवस आणि रात्रीला 8 समान भागांमध्ये विभागते. पाच कालावधी शुभ आहेत (अमृत, सिद्ध, लाभ, धन, सुगम) आणि तीन अशुभ आहेत (मरण, रोग, शोक). नवीन कार्यारंभ, प्रवास, व्यवसाय आणि समारंभांसाठी शुभ वेळ निवडण्यासाठी हे तामिळनाडू, कर्नाटक, आंध्र प्रदेश, तेलंगणा आणि केरळमध्ये मोठ्या प्रमाणावर वापरले जाते.',
    typesTitle: '8 गौरी कालावधीचे स्पष्टीकरण',
    types: 'अमृत|अमृत — सर्वात शुभ कालावधी, सर्व नवीन कार्यारंभ आणि महत्त्वाच्या सुरुवातीसाठी आदर्श|सिद्ध|सिद्धी — महत्त्वाचे काम पूर्ण करणे, करार करणे, परीक्षांसाठी उत्कृष्ट|लाभ|लाभ — व्यावसायिक व्यवहार, व्यापार, आर्थिक निर्णयांसाठी सर्वोत्तम|धन|धन — गुंतवणूक, खरेदी, बँकिंग कार्यांसाठी शुभ|सुगम|आराम — सौम्य आणि सहायक कालावधी, प्रवास आणि सामाजिक कार्यक्रमांसाठी चांगला|मरण|मरण — अत्यंत अशुभ; वैद्यकीय प्रक्रिया, शस्त्रक्रिया, प्रवास टाळा|रोग|रोग — आरोग्य-संबंधित निर्णय, नवीन आहार किंवा तणावपूर्ण क्रियाकलाप टाळा|शोक|शोक — वादविवाद, करार करणे, भावनिक वचनबद्धता टाळा',
    bestTitle: 'प्रत्येक कार्यासाठी सर्वोत्तम गौरी कालावधी',
    bestText: 'नवीन कार्यारंभ किंवा नवीन घरात प्रवेश करण्यासाठी, अमृत हा सर्वात शक्तिशाली मानला जातो. व्यवसाय आणि आर्थिक कार्यांसाठी लाभ (प्राप्ती) किंवा धन (संपत्ती) कालावधी सर्वोत्तम असतो. प्रवास आणि कौटुंबिक मेळाव्यांसाठी सुगम (आराम) कालावधी पसंत केला जातो. परीक्षा, प्रमाणपत्रे पूर्ण करण्यासाठी किंवा महत्त्वाचे करार करण्यासाठी, सिद्ध (यश) सर्वात मजबूत समर्थन देतो. कोणत्याही शुभ कार्यासाठी मरण, रोग आणि शोक टाळा — हे कालावधी विश्रांती, नियमित देखभाल किंवा सुरू करण्याऐवजी पूर्ण करू इच्छित असलेल्या कार्यांसाठी सर्वोत्तम आहेत.',
    seeAlso: 'हे देखील पहा',
  },
  te: {
    back: 'పంచాంగ్',
    title: 'ఈరోజు గౌరీ పంచాంగ్',
    dayGauri: 'పగటి గౌరీ పంచాంగ్',
    nightGauri: 'రాత్రి గౌరీ పంచాంగ్',
    auspicious: 'శుభ',
    inauspicious: 'అశుభ',
    whatIs: 'గౌరీ పంచాంగ్ అంటే ఏమిటి?',
    whatIsText: 'గౌరీ పంచాంగ్ (గౌరీ పంచాంగం లేదా గౌరీ నల్ల నేరం అని కూడా పిలుస్తారు) చోఘడియాకు దక్షిణ భారత సమానం — ఇది ప్రతి పగలు మరియు రాత్రిని 8 సమాన కాలాలుగా విభజించే వేద కాల విభజన వ్యవస్థ. ఐదు కాలాలు శుభప్రదమైనవి (అమృత, సిద్ధ, లాభ, ధన, సుగమ) మరియు మూడు అశుభప్రదమైనవి (మరణ, రోగ, శోక). కొత్త వ్యాపారాలు, ప్రయాణాలు, వాణిజ్యం మరియు వేడుకలకు శుభ సమయాలను ఎంచుకోవడానికి తమిళనాడు, కర్ణాటక, ఆంధ్రప్రదేశ్, తెలంగాణ మరియు కేరళ అంతటా ఇది విస్తృతంగా ఉపయోగించబడుతుంది.',
    typesTitle: '8 గౌరీ కాలాల వివరణ',
    types: 'అమృత|అమృతం — అత్యంత శుభప్రదమైన కాలం, అన్ని కొత్త వ్యాపారాలకు మరియు ముఖ్యమైన ప్రారంభాలకు అనువైనది|సిద్ధ|విజయం — ముఖ్యమైన పనులు పూర్తి చేయడానికి, ఒప్పందాలపై సంతకాలు చేయడానికి, పరీక్షలకు అద్భుతమైనది|లాభ|లాభం — వ్యాపార లావాదేవీలు, వాణిజ్యం, ఆర్థిక నిర్ణయాలకు ఉత్తమమైనది|ధన|సంపద — పెట్టుబడులు, కొనుగోళ్లు, బ్యాంకింగ్ కార్యకలాపాలకు శుభప్రదం|సుగమ|సౌకర్యం — సున్నితమైన మరియు సహాయక కాలం, ప్రయాణాలకు మరియు సామాజిక కార్యక్రమాలకు మంచిది|మరణ|మరణం — అత్యంత అశుభప్రదం; వైద్య విధానాలు, శస్త్రచికిత్సలు, ప్రయాణాలను నివారించండి|రోగ|వ్యాధి — ఆరోగ్య సంబంధిత నిర్ణయాలు, కొత్త ఆహారాలు లేదా ఒత్తిడితో కూడిన కార్యకలాపాలను నివారించండి|శోక|దుఃఖం — వాదనలు, ఒప్పందాలపై సంతకాలు, భావోద్వేగ కట్టుబాట్లను నివారించండి',
    bestTitle: 'ప్రతి కార్యకలాపానికి ఉత్తమ గౌరీ కాలం',
    bestText: 'కొత్త వ్యాపారం ప్రారంభించడానికి లేదా కొత్త ఇంట్లోకి మారడానికి, అమృత కాలం సార్వత్రికంగా అత్యంత శక్తివంతమైనదిగా పరిగణించబడుతుంది. వ్యాపార మరియు ఆర్థిక కార్యకలాపాలకు లాభ (లాభం) లేదా ధన (సంపద) కాలాలు ఉత్తమమైనవి. ప్రయాణాలు మరియు కుటుంబ సమావేశాలకు, సుగమ (సౌకర్యం) కాలం ప్రాధాన్యత ఇవ్వబడుతుంది. పరీక్షలు, ధృవపత్రాలు పూర్తి చేయడానికి లేదా ముఖ్యమైన ఒప్పందాలపై సంతకాలు చేయడానికి, సిద్ధ (విజయం) కాలం బలమైన మద్దతును అందిస్తుంది. ఏ శుభ కార్యానికైనా మరణ, రోగ మరియు శోక కాలాలను నివారించండి — ఈ కాలాలు విశ్రాంతి, సాధారణ నిర్వహణ లేదా ప్రారంభించదలుచుకోని కార్యకలాపాలకు ఉత్తమంగా కేటాయించబడతాయి.',
    seeAlso: 'ఇవి కూడా చూడండి',
  },
  kn: {
    back: 'ಪಂಚಾಂಗ',
    title: 'ಇಂದಿನ ಗೌರಿ ಪಂಚಾಂಗ',
    dayGauri: 'ಹಗಲಿನ ಗೌರಿ ಪಂಚಾಂಗ',
    nightGauri: 'ರಾತ್ರಿಯ ಗೌರಿ ಪಂಚಾಂಗ',
    auspicious: 'ಶುಭ',
    inauspicious: 'ಅಶುಭ',
    whatIs: 'ಗೌರಿ ಪಂಚಾಂಗ ಎಂದರೇನು?',
    whatIsText: 'ಗೌರಿ ಪಂಚಾಂಗ (ಗೌರಿ ಪಂಚಾಂಗಂ ಅಥವಾ ಗೌರಿ ನಲ್ಲಾ ನೇರಂ ಎಂದೂ ಕರೆಯಲ್ಪಡುತ್ತದೆ) ಚೋಘಡಿಯಾದ ದಕ್ಷಿಣ ಭಾರತದ ಪ್ರತಿರೂಪವಾಗಿದೆ — ಇದು ವೈದಿಕ ಕಾಲ ವಿಭಜನಾ ವ್ಯವಸ್ಥೆಯಾಗಿದ್ದು, ಪ್ರತಿ ಹಗಲು ಮತ್ತು ರಾತ್ರಿಯನ್ನು 8 ಸಮಾನ ಅವಧಿಗಳಾಗಿ ವಿಭಜಿಸುತ್ತದೆ. ಐದು ಅವಧಿಗಳು ಶುಭ (ಅಮೃತ, ಸಿದ್ಧ, ಲಾಭ, ಧನ, ಸುಗಮ) ಮತ್ತು ಮೂರು ಅಶುಭ (ಮರಣ, ರೋಗ, ಶೋಕ). ಹೊಸ ಉದ್ಯಮಗಳು, ಪ್ರಯಾಣ, ವ್ಯಾಪಾರ ಮತ್ತು ಸಮಾರಂಭಗಳಿಗೆ ಶುಭ ಸಮಯಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಇದನ್ನು ತಮಿಳುನಾಡು, ಕರ್ನಾಟಕ, ಆಂಧ್ರಪ್ರದೇಶ, ತೆಲಂಗಾಣ ಮತ್ತು ಕೇರಳದಾದ್ಯಂತ ವ್ಯಾಪಕವಾಗಿ ಬಳಸಲಾಗುತ್ತದೆ.',
    typesTitle: '8 ಗೌರಿ ಅವಧಿಗಳ ವಿವರಣೆ',
    types: 'ಅಮೃತ|ಅಮೃತ — ಅತ್ಯಂತ ಶುಭಕರ ಅವಧಿ, ಎಲ್ಲಾ ಹೊಸ ಉದ್ಯಮಗಳು ಮತ್ತು ಪ್ರಮುಖ ಆರಂಭಗಳಿಗೆ ಸೂಕ್ತವಾಗಿದೆ|ಸಿದ್ಧ|ಸಿದ್ಧಿ — ಪ್ರಮುಖ ಕೆಲಸಗಳನ್ನು ಮುಗಿಸಲು, ಒಪ್ಪಂದಗಳಿಗೆ ಸಹಿ ಹಾಕಲು, ಪರೀಕ್ಷೆಗಳಿಗೆ ಅತ್ಯುತ್ತಮವಾಗಿದೆ|ಲಾಭ|ಲಾಭ — ವ್ಯಾಪಾರ ವಹಿವಾಟುಗಳು, ವಾಣಿಜ್ಯ, ಆರ್ಥಿಕ ನಿರ್ಧಾರಗಳಿಗೆ ಉತ್ತಮವಾಗಿದೆ|ಧನ|ಧನ — ಹೂಡಿಕೆಗಳು, ಖರೀದಿಗಳು, ಬ್ಯಾಂಕಿಂಗ್ ಚಟುವಟಿಕೆಗಳಿಗೆ ಶುಭಕರವಾಗಿದೆ|ಸುಗಮ|ಸುಗಮ — ಸೌಮ್ಯ ಮತ್ತು ಸಹಾಯಕ ಅವಧಿ, ಪ್ರಯಾಣ ಮತ್ತು ಸಾಮಾಜಿಕ ಕಾರ್ಯಕ್ರಮಗಳಿಗೆ ಉತ್ತಮವಾಗಿದೆ|ಮರಣ|ಮರಣ — ಅತ್ಯಂತ ಅಶುಭಕರ; ವೈದ್ಯಕೀಯ ಕಾರ್ಯವಿಧಾನಗಳು, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗಳು, ಪ್ರಯಾಣಗಳನ್ನು ತಪ್ಪಿಸಿ|ರೋಗ|ರೋಗ — ಆರೋಗ್ಯ ಸಂಬಂಧಿತ ನಿರ್ಧಾರಗಳು, ಹೊಸ ಆಹಾರ ಪದ್ಧತಿಗಳು ಅಥವಾ ಒತ್ತಡದ ಚಟುವಟಿಕೆಗಳನ್ನು ತಪ್ಪಿಸಿ|ಶೋಕ|ಶೋಕ — ವಾದಗಳು, ಒಪ್ಪಂದಗಳಿಗೆ ಸಹಿ ಹಾಕುವುದು, ಭಾವನಾತ್ಮಕ ಬದ್ಧತೆಗಳನ್ನು ತಪ್ಪಿಸಿ',
    bestTitle: 'ಪ್ರತಿ ಚಟುವಟಿಕೆಗೆ ಉತ್ತಮ ಗೌರಿ ಅವಧಿ',
    bestText: 'ಹೊಸ ಉದ್ಯಮವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಅಥವಾ ಹೊಸ ಮನೆಗೆ ಪ್ರವೇಶಿಸಲು, ಅಮೃತವನ್ನು ಸಾರ್ವತ್ರಿಕವಾಗಿ ಅತ್ಯಂತ ಶಕ್ತಿಶಾಲಿ ಎಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ. ವ್ಯಾಪಾರ ಮತ್ತು ಆರ್ಥಿಕ ಚಟುವಟಿಕೆಗಳಿಗೆ ಲಾಭ (ಲಾಭ) ಅಥವಾ ಧನ (ಧನ) ಅವಧಿಗಳು ಉತ್ತಮವಾಗಿವೆ. ಪ್ರಯಾಣ ಮತ್ತು ಕುಟುಂಬ ಕೂಟಗಳಿಗೆ, ಸುಗಮ (ಸುಗಮ) ಅವಧಿಯನ್ನು ಆದ್ಯತೆ ನೀಡಲಾಗುತ್ತದೆ. ಪರೀಕ್ಷೆಗಳು, ಪ್ರಮಾಣೀಕರಣಗಳನ್ನು ಮುಗಿಸಲು ಅಥವಾ ಪ್ರಮುಖ ಒಪ್ಪಂದಗಳಿಗೆ ಸಹಿ ಹಾಕಲು, ಸಿದ್ಧ (ಸಿದ್ಧಿ) ಅವಧಿಯು ಬಲವಾದ ಬೆಂಬಲವನ್ನು ನೀಡುತ್ತದೆ. ಯಾವುದೇ ಶುಭ ಕಾರ್ಯಕ್ಕಾಗಿ ಮರಣ, ರೋಗ ಮತ್ತು ಶೋಕ ಅವಧಿಗಳನ್ನು ತಪ್ಪಿಸಿ — ಈ ಅವಧಿಗಳನ್ನು ವಿಶ್ರಾಂತಿ, ದಿನನಿತ್ಯದ ನಿರ್ವಹಣೆ ಅಥವಾ ಪ್ರಾರಂಭಿಸುವ ಬದಲು ಮುಗಿಸಲು ಬಯಸುವ ಚಟುವಟಿಕೆಗಳಿಗೆ ಮೀಸಲಿಡುವುದು ಉತ್ತಮ.',
    seeAlso: 'ಇದನ್ನೂ ನೋಡಿ',
  },
  gu: {
    back: 'પંચાંગ',
    title: 'આજનું ગૌરી પંચાંગ',
    dayGauri: 'દિવસનું ગૌરી પંચાંગ',
    nightGauri: 'રાત્રિનું ગૌરી પંચાંગ',
    auspicious: 'શુભ',
    inauspicious: 'અશુભ',
    whatIs: 'ગૌરી પંચાંગ શું છે?',
    whatIsText: 'ગૌરી પંચાંગ (જેને ગૌરી પંચાંગમ અથવા ગૌરી નલ્લા નેરમ પણ કહેવાય છે) એ ચોઘડિયાનું દક્ષિણ-ભારતીય સમકક્ષ છે — એક વૈદિક સમય-વિભાજન પ્રણાલી છે જે દરેક દિવસ અને રાત્રિને 8 સમાન સમયગાળામાં વિભાજિત કરે છે. પાંચ સમયગાળા શુભ (અમૃત, સિદ્ધ, લાભ, ધન, સુગમ) અને ત્રણ અશુભ (મરણ, રોગ, શોક) છે. તેનો ઉપયોગ તમિલનાડુ, કર્ણાટક, આંધ્રપ્રદેશ, તેલંગાણા અને કેરળમાં નવા સાહસો, મુસાફરી, વ્યવસાય અને સમારોહ માટે શુભ સમય પસંદ કરવા માટે વ્યાપકપણે થાય છે.',
    typesTitle: 'ગૌરીના 8 સમયગાળાની સમજૂતી',
    types: 'અમૃત|અમૃત — સૌથી શુભ સમયગાળો, તમામ નવા સાહસો અને મહત્વપૂર્ણ શરૂઆત માટે આદર્શ|સિદ્ધ|સિદ્ધિ — મહત્વપૂર્ણ કાર્ય પૂર્ણ કરવા, કરારો પર હસ્તાક્ષર કરવા, પરીક્ષાઓ માટે ઉત્તમ|લાભ|લાભ — વ્યવસાયિક વ્યવહારો, વેપાર, નાણાકીય નિર્ણયો માટે શ્રેષ્ઠ|ધન|ધન — રોકાણ, ખરીદી, બેંકિંગ પ્રવૃત્તિઓ માટે શુભ|સુગમ|આરામ — સૌમ્ય અને સહાયક સમયગાળો, મુસાફરી અને સામાજિક પ્રસંગો માટે સારો|મરણ|મૃત્યુ — અત્યંત અશુભ; તબીબી પ્રક્રિયાઓ, શસ્ત્રક્રિયાઓ, યાત્રાઓ ટાળો|રોગ|રોગ — આરોગ્ય સંબંધિત નિર્ણયો, નવા આહાર અથવા તણાવપૂર્ણ પ્રવૃત્તિઓ ટાળો|શોક|દુઃખ — દલીલો, કરાર પર હસ્તાક્ષર, ભાવનાત્મક પ્રતિબદ્ધતાઓ ટાળો',
    bestTitle: 'દરેક પ્રવૃત્તિ માટે શ્રેષ્ઠ ગૌરી સમયગાળો',
    bestText: 'નવું સાહસ શરૂ કરવા અથવા નવા ઘરમાં પ્રવેશ કરવા માટે, અમૃતને સાર્વત્રિક રીતે સૌથી શક્તિશાળી માનવામાં આવે છે. વ્યવસાયિક અને નાણાકીય પ્રવૃત્તિઓ માટે લાભ (લાભ) અથવા ધન (ધન) સમયગાળો શ્રેષ્ઠ છે. મુસાફરી અને કૌટુંબિક મેળાવડા માટે, સુગમ (આરામ) પસંદ કરવામાં આવે છે. પરીક્ષાઓ, પ્રમાણપત્રો પૂર્ણ કરવા અથવા મહત્વપૂર્ણ કરારો પર હસ્તાક્ષર કરવા માટે, સિદ્ધ (સિદ્ધિ) સૌથી મજબૂત સમર્થન લાવે છે. કોઈપણ શુભ કાર્ય માટે મરણ, રોગ અને શોક ટાળો — આ સમયગાળા આરામ, નિયમિત જાળવણી અથવા તમે શરૂ કરવાને બદલે સમાપ્ત કરવા માંગતા હો તેવી પ્રવૃત્તિઓ માટે શ્રેષ્ઠ છે.',
    seeAlso: 'આ પણ જુઓ',
  },
  bn: {
    back: 'পঞ্চাঙ্গ',
    title: 'গৌরী পঞ্চাঙ্গ আজ',
    dayGauri: 'দিনের গৌরী পঞ্চাঙ্গ',
    nightGauri: 'রাতের গৌরী পঞ্চাঙ্গ',
    auspicious: 'শুভ',
    inauspicious: 'অশুভ',
    whatIs: 'গৌরী পঞ্চাঙ্গ কী?',
    whatIsText: 'গৌরী পঞ্চাঙ্গ (গৌরী পঞ্চাঙ্গম বা গৌরী নাল্লা নেরাম নামেও পরিচিত) হলো চোগাড়িয়া-এর দক্ষিণ ভারতীয় প্রতিরূপ — একটি বৈদিক সময়-বিভাজন পদ্ধতি যা দিন ও রাতকে ৮টি সমান ভাগে বিভক্ত করে। পাঁচটি সময়কাল শুভ (অমৃত, সিদ্ধ, লাভ, ধন, সুগম) এবং তিনটি অশুভ (মরণ, রোগ, শোক)। এটি তামিলনাড়ু, কর্ণাটক, অন্ধ্রপ্রদেশ, তেলেঙ্গানা এবং কেরালা জুড়ে ব্যাপকভাবে ব্যবহৃত হয় নতুন উদ্যোগ, ভ্রমণ, ব্যবসা এবং অনুষ্ঠানের জন্য শুভ সময় বেছে নিতে।',
    typesTitle: '৮টি গৌরী কালের ব্যাখ্যা',
    types: 'অমৃত|অমৃত — সবচেয়ে শুভ সময়, সমস্ত নতুন উদ্যোগ এবং গুরুত্বপূর্ণ শুরুর জন্য আদর্শ|সিদ্ধ|সিদ্ধি — গুরুত্বপূর্ণ কাজ শেষ করা, চুক্তি স্বাক্ষর, পরীক্ষার জন্য চমৎকার|লাভ|লাভ — ব্যবসায়িক লেনদেন, বাণিজ্য, আর্থিক সিদ্ধান্তের জন্য সেরা|ধন|ধন — বিনিয়োগ, ক্রয়, ব্যাংকিং কার্যক্রমের জন্য শুভ|সুগম|সুগম — মৃদু এবং সহায়ক সময়, ভ্রমণ এবং সামাজিক অনুষ্ঠানের জন্য ভালো|মরণ|মরণ — অত্যন্ত অশুভ; চিকিৎসা পদ্ধতি, অস্ত্রোপচার, যাত্রা এড়িয়ে চলুন|রোগ|রোগ — স্বাস্থ্য-সম্পর্কিত সিদ্ধান্ত, নতুন খাদ্যতালিকা বা চাপপূর্ণ কার্যকলাপ এড়িয়ে চলুন|শোক|শোক — ঝগড়া, চুক্তি স্বাক্ষর, আবেগপূর্ণ প্রতিশ্রুতি এড়িয়ে চলুন',
    bestTitle: 'প্রতিটি কাজের জন্য সেরা গৌরী কাল',
    bestText: 'নতুন উদ্যোগ শুরু করা বা নতুন বাড়িতে প্রবেশ করার জন্য, অমৃতকে সর্বজনীনভাবে সবচেয়ে শক্তিশালী বলে মনে করা হয়। ব্যবসা এবং আর্থিক কার্যক্রমের জন্য লাভ (লাভ) বা ধন (সম্পদ) সময়কাল সবচেয়ে উপযুক্ত। ভ্রমণ এবং পারিবারিক সমাবেশের জন্য সুগম (আরাম) পছন্দনীয়। পরীক্ষা, শংসাপত্র বা গুরুত্বপূর্ণ চুক্তি স্বাক্ষরের জন্য সিদ্ধ (সিদ্ধি) সবচেয়ে শক্তিশালী সমর্থন নিয়ে আসে। কোনো শুভ কাজের জন্য মরণ, রোগ এবং শোক এড়িয়ে চলুন — এই সময়কালগুলি বিশ্রাম, রুটিন রক্ষণাবেক্ষণ বা যে কাজগুলি আপনি শুরু না করে শেষ করতে চান তার জন্য সবচেয়ে ভালো।',
    seeAlso: 'আরও দেখুন',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' as const },
  }),
};

// Server passes both the SSR date AND the pre-computed gauri slots so
// the client's first render is byte-identical with the SSR HTML. Two
// independent reasons forced this:
//
//  1. todayInTimezone() in the render body races against the SSR clock
//     across day boundaries (Lesson ZD).
//  2. computePanchang() returns sub-minute-different sunrise/sunset
//     between Node V8 (server) and Chromium V8 (client) for identical
//     inputs — the floored times can diverge by 1 minute (verified in
//     IST window 2026-06-04: Node→07:18, Chromium→07:17 for Chennai
//     day=5). That's a separate compute-engine drift independent of
//     the date seed; until it's chased down, the server's authoritative
//     output must drive the first paint.
//
// After mount, the useEffect refreshes liveDate, and the useMemo
// recomputes panchang for the live city/date (now safely client-side
// only — server and client no longer have to agree).
export interface GauriPanchangClientProps {
  initialDate: string;          // YYYY-MM-DD, computed server-side in
                                 // the SSR city's timezone (Chennai for
                                 // most locales)
  initialSlots: GauriSlot[];    // server-precomputed slot list for
                                 // DEFAULT_CITY on initialDate — the
                                 // first-paint source of truth
}

export default function GauriPanchangClient({ initialDate, initialSlots }: GauriPanchangClientProps) {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  // Pick the best matching label set. Tamil is first-class for this
  // feature; Telugu/Kannada/Malayalam users will see English labels but
  // Tamil period-names in the table (via the GAURI_NAMES.ta render) —
  // that's still more relevant than Hindi for them. Falls back to en.
  const L = LABELS[locale] || (locale === 'te' || locale === 'kn' ? LABELS.en : LABELS.en);

  const [selectedCity, setSelectedCity] = useState<CityData>(DEFAULT_CITY);

  useEffect(() => {
    const store = useLocationStore.getState();
    if (store.lat !== null && store.lng !== null) {
      setSelectedCity({
        slug: 'current',
        // URL params take priority over cached state — no URL params here, so store wins
        name: {
          en: store.name || 'Current Location',
          hi: store.name || 'वर्तमान स्थान',
          sa: store.name || 'वर्तमानस्थानम्',
        },
        lat: store.lat,
        lng: store.lng,
        timezone: store.timezone || 'UTC',
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track current time in the selected city's TZ for the NOW badge.
  // Init `null` so SSR and the client's first render produce identical
  // HTML (no NOW badge yet). The badge appears only after the useEffect
  // tick post-hydration. Skipping this caused hydration mismatches on
  // every paint that straddled a minute boundary.
  const [nowMin, setNowMin] = useState<number | null>(null);
  useEffect(() => {
    setNowMin(nowMinutesInTimezone(selectedCity.timezone));
    const iv = setInterval(() => setNowMin(nowMinutesInTimezone(selectedCity.timezone)), 60_000);
    return () => clearInterval(iv);
  }, [selectedCity.timezone]);

  // Date used for panchang computation. Initialised to null so SSR and
  // the client's first render both see `effectiveDate === initialDate`
  // — byte-identical with the SSR HTML. The useEffect populates from
  // the live timezone after mount, so subsequent renders pick up the
  // user-selected city's "today". Calling todayInTimezone() in the
  // render body is what caused the React #418 hydration mismatch
  // (Lesson ZD).
  const [liveDate, setLiveDate] = useState<string | null>(null);
  useEffect(() => {
    setLiveDate(todayInTimezone(selectedCity.timezone));
  }, [selectedCity.timezone]);

  const effectiveDate = liveDate ?? initialDate;
  const [year, month, day] = effectiveDate.split('-').map(Number);

  // Server-side sunrise/sunset, fetched via /api/sunrise. The route
  // runs the same sweph-primary engine as every other panchang surface,
  // so the slot times the client renders after a city pick match what
  // the server would have rendered for that same city. This is the
  // "A" half of the B+A architecture documented in this file's header
  // (option D from the 2026-06-04 review): server props power the
  // first paint, this fetch powers every subsequent (city, date)
  // selection — never the in-browser Meeus fallback that drifted by
  // 1 minute against the server's Swiss output.
  //
  // Shape mirrors the hora consumer at src/app/[locale]/hora/Client.tsx
  // so future maintainers can grep one pattern.
  type SunData = { sunriseUT: number; sunsetUT: number } | null;
  const [sunData, setSunData] = useState<SunData>(null);
  const [sunError, setSunError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const url =
      `/api/sunrise?date=${effectiveDate}` +
      `&lat=${selectedCity.lat}&lng=${selectedCity.lng}` +
      `&timezone=${encodeURIComponent(selectedCity.timezone)}`;
    setSunError(null);
    fetch(url)
      .then((r) => r.json())
      .then((body) => {
        if (cancelled) return;
        if (typeof body.sunriseUT !== 'number' || typeof body.sunsetUT !== 'number') {
          // Polar non-rise window — degrade to "no slots", surface
          // banner. Never silently fall back to Meeus client-side.
          setSunData(null);
          setSunError('Sunrise/sunset unavailable for this location and date.');
          return;
        }
        // East-of-UTC cities have sunriseUT on the previous UT day
        // (e.g. Delhi: 23.88) and sunsetUT on the current UT day
        // (e.g. 13.77). The slot generator needs sunsetUT > sunriseUT
        // for dayDuration to be positive — unwrap matches the in-
        // engine fix at panchang-calc.ts:1129.
        const sunriseUT = body.sunriseUT;
        let sunsetUT = body.sunsetUT;
        if (sunsetUT < sunriseUT) sunsetUT += 24;
        setSunData({ sunriseUT, sunsetUT });
      })
      .catch((err: unknown) => {
        console.error('[gauri-panchang] /api/sunrise failed:', err);
        if (!cancelled) setSunError('Could not fetch sunrise/sunset.');
      });
    return () => { cancelled = true; };
  }, [effectiveDate, selectedCity.lat, selectedCity.lng, selectedCity.timezone]);

  // Slots derived from the fetched Swiss sunrise. On first paint —
  // before the /api/sunrise round-trip lands — we render the
  // server-precomputed `initialSlots` so SSR HTML and the client's
  // first DOM are byte-identical (Lesson ZD).
  const liveSlots: GauriSlot[] = useMemo(() => {
    if (!sunData) return initialSlots;
    const tzOffset = getUTCOffsetForDate(year, month, day, selectedCity.timezone);
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    return computeGauriPanchang(sunData.sunriseUT, sunData.sunsetUT, weekday, tzOffset);
  }, [sunData, initialSlots, year, month, day, selectedCity.timezone]);

  // Human-readable formatted date for the heading. Built from the same
  // year/month/day used for the panchang computation above, so the
  // label and the slots always reference the same calendar day.
  const dateLabel = useMemo(() => {
    const d = new Date(year, month - 1, day);
    const LOCALE_MAP: Record<string, string> = {
      en: 'en-IN', hi: 'hi-IN', sa: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
      bn: 'bn-IN', kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN',
    };
    const loc = LOCALE_MAP[locale] || 'en-IN';
    return d.toLocaleDateString(loc, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [year, month, day, locale]);

  const daySlots = liveSlots.filter((s: GauriSlot) => s.period === 'day');
  const nightSlots = liveSlots.filter((s: GauriSlot) => s.period === 'night');

  const natureLabel = (n: string) => n === 'auspicious' ? L.auspicious : L.inauspicious;

  // Parse the 8-entry "name|desc" pipe string into structured entries.
  const typeEntries = useMemo(() => {
    const parts = L.types.split('|');
    const result: { name: string; desc: string }[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      result.push({ name: parts[i], desc: parts[i + 1] || '' });
    }
    return result;
  }, [L.types]);

  // Pick the best regional script variant for the period name. ml
  // (Malayalam) is in the constants for completeness but not yet a
  // supported app locale — Kerala users land on `en` for now.
  const renderName = (slot: GauriSlot): string => {
    const n = slot.name as { en?: string; hi?: string; sa?: string; ta?: string; te?: string; kn?: string; ml?: string };
    if (locale === 'ta' && n.ta) return n.ta;
    if (locale === 'te' && n.te) return n.te;
    if (locale === 'kn' && n.kn) return n.kn;
    return tl(slot.name, locale);
  };

  const renderSlotCard = (slot: GauriSlot, i: number) => {
    const style = NATURE_STYLES[slot.nature] || NATURE_STYLES.auspicious;
    const startMin = timeToMinutes(slot.startTime);
    const endMin = timeToMinutes(slot.endTime);
    // Midnight-wrapping comparison (Lesson R). `nowMin` is null during
    // SSR/first render — no slot is "active" until the client clock tick.
    const isActive = nowMin !== null && (endMin < startMin
      ? nowMin >= startMin || nowMin < endMin
      : nowMin >= startMin && nowMin < endMin);
    return (
      <motion.div
        key={`${slot.period}-${i}`}
        custom={i}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className={`rounded-xl border p-4 ${style.bg} ${style.border} ${isActive ? 'ring-2 ring-gold-primary/60' : ''}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold ${style.text}`} style={headingFont}>
            {renderName(slot)}
          </h3>
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/30 text-gold-light font-bold animate-pulse" suppressHydrationWarning>
                NOW
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>
              {natureLabel(slot.nature)}
            </span>
          </div>
        </div>
        <p className="text-lg font-bold text-text-primary tracking-wide">
          {slot.startTime}  –  {slot.endTime}
        </p>
      </motion.div>
    );
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD breadcrumb */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD('/gauri-panchang', locale)) }}
        />

        {/* Back link */}
        <Link
          href="/panchang"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          {L.back}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-gold-light mb-2"
            style={headingFont}
          >
            {L.title}
          </h2>
          <p className="text-text-secondary text-lg" suppressHydrationWarning>{dateLabel}</p>
          <p className="text-text-secondary flex items-center gap-1.5 mt-1" suppressHydrationWarning>
            <MapPin size={14} className="text-gold-primary" />
            {tl(selectedCity.name, locale)}
          </p>
        </motion.div>

        {/* City selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' as const }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {SELECTOR_CITIES.map((city) => (
            <button
              key={city.slug}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedCity.slug === city.slug
                  ? 'bg-gold-primary/20 border border-gold-primary text-gold-light'
                  : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-secondary hover:border-gold-primary/40 hover:text-text-primary'
              }`}
            >
              {tl(city.name, locale)}
            </button>
          ))}
        </motion.div>

        {/* Day Gauri */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <Sun size={20} className="text-gold-primary" />
            {L.dayGauri}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {daySlots.map((slot, i) => renderSlotCard(slot, i))}
          </div>
        </motion.section>

        {/* Night Gauri */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <Moon size={20} className="text-gold-primary" />
            {L.nightGauri}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {nightSlots.map((slot, i) => renderSlotCard(slot, i + 8))}
          </div>
        </motion.section>

        <GoldDivider />

        {/* Educational section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' as const }}
          className="space-y-8 mt-4"
        >
          {/* What is Gauri Panchang */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.whatIs}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
          </div>

          {/* 8 Types */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>
              <Sparkles size={18} className="inline-block mr-2 text-gold-primary -mt-0.5" />
              {L.typesTitle}
            </h2>
            <div className="space-y-3">
              {typeEntries.map((entry) => (
                <div key={entry.name} className="rounded-lg border border-white/10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4">
                  <h3 className="font-semibold text-gold-light mb-1" style={headingFont}>
                    {entry.name}
                  </h3>
                  <p className="text-text-secondary text-sm">{entry.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Best uses */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.bestTitle}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.bestText}</p>
          </div>
        </motion.section>

        <RelatedLinks type="learn" links={getLearnLinksForTool('/gauri-panchang')} locale={locale} className="mt-8" />

        <GoldDivider className="mt-8" />

        {/* See Also */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' as const }}
          className="mt-4 mb-12"
        >
          <h2 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
            {L.seeAlso}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/choghadiya"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              Choghadiya
            </Link>
            <Link
              href="/rahu-kaal"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              Rahu Kaal
            </Link>
            <Link
              href="/hora"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              Hora
            </Link>
            <Link
              href="/panchang"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              {L.back}
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
