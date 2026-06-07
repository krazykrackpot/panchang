import { setRequestLocale } from "next-intl/server";
import { isDevanagariLocale } from "@/lib/utils/locale-fonts";
import { pickRegionalChrome as RC } from "@/lib/content/regional-chrome-labels";

// ═══════════════════════════════════════════════════════════════════════════
// LABELS — EN / HI / TE trilingual
// ═══════════════════════════════════════════════════════════════════════════

const LABELS: Record<string, Record<string, string>> = {
  title: {
    en: "Telugu Calendar (Panchangam) 2026–2027",
    hi: "तेलुगु कैलेंडर (पंचांगम्) 2026–2027",
    te: "తెలుగు పంచాంగం 2026–2027",
    ta: "தெலுங்கு நாட்காட்டி (பஞ்சாங்கம்) 2026–2027",
    bn: "তেলেগু ক্যালেন্ডার (পঞ্চাঙ্গম্) 2026–2027",
    kn: "ತೆಲುಗು ಕ್ಯಾಲೆಂಡರ್ (ಪಂಚಾಂಗಂ) 2026–2027",
    gu: "તેલુગુ કેલેન્ડર (પંચાંગ) 2026–2027",
  },
  intro: {
    en: "The Telugu Panchangam is a lunisolar calendar used by approximately 80 million Telugu speakers across Andhra Pradesh, Telangana, and the global Telugu diaspora. Unlike the Tamil solar calendar, the Telugu system follows the Chandramana (lunar) tradition — months run from one New Moon to the next, and the year begins on Chaitra Shukla Pratipada (the first lunar day after the New Moon in March/April). This day is celebrated as Ugadi, the Telugu New Year. The Telugu calendar is closely aligned with the broader Vedic Panchanga tradition, tracking Tithi, Vara, Nakshatra, Yoga, and Karana alongside month names that correspond to the Sanskrit lunar month sequence. The Panchangam is the authoritative reference for all religious observances, festivals, agricultural planning, and auspicious timings (muhurtas) in Telugu culture, consulted daily by millions of households.",
    hi: "तेलुगु पंचांगम् एक चान्द्र-सौर कैलेंडर है जिसका उपयोग आन्ध्र प्रदेश, तेलंगाना और विश्वभर के लगभग 8 करोड़ तेलुगु भाषियों द्वारा किया जाता है। तमिल सौर कैलेंडर के विपरीत, तेलुगु प्रणाली चान्द्रमान (चन्द्र) परम्परा का पालन करती है — मास एक अमावस्या से अगली तक चलते हैं, और वर्ष चैत्र शुक्ल प्रतिपदा को आरम्भ होता है। इस दिन को उगादि (तेलुगु नव वर्ष) के रूप में मनाया जाता है। पंचांगम् तेलुगु संस्कृति में सभी धार्मिक अनुष्ठानों, त्योहारों, कृषि योजना और शुभ मुहूर्तों का आधिकारिक सन्दर्भ है।",
    te: "తెలుగు పంచాంగం ఆంధ్రప్రదేశ్, తెలంగాణ మరియు ప్రపంచవ్యాప్తంగా ఉన్న సుమారు 8 కోట్ల తెలుగు మాట్లాడేవారు ఉపయోగించే చాంద్రమాన పంచాంగం. తమిళ సౌర పంచాంగానికి భిన్నంగా, తెలుగు వ్యవస్థ చంద్రమాన సంప్రదాయాన్ని అనుసరిస్తుంది — నెలలు ఒక అమావాస్య నుండి తదుపరి అమావాస్య వరకు ఉంటాయి, మరియు సంవత్సరం చైత్ర శుద్ధ పాడ్యమి రోజు ప్రారంభమవుతుంది. ఈ రోజును ఉగాది (తెలుగు నూతన సంవత్సరం) గా జరుపుకుంటారు. పంచాంగం తెలుగు సంస్కృతిలో అన్ని మత ఆచారాలు, పండుగలు, వ్యవసాయ ప్రణాళిక మరియు శుభ ముహూర్తాల కోసం అధికారిక సూచన.",
  },
  monthsTitle: {
    en: "The 12 Telugu Months",
    hi: "12 तेलुगु मास",
    te: "12 తెలుగు నెలలు",
    ta: "12 தெலுங்கு மாதங்கள்",
    bn: "১২টি তেলেগু মাস",
    kn: "12 ತೆಲುಗು ತಿಂಗಳುಗಳು",
    gu: "12 તેલુગુ મહિના",
  },
  monthsIntro: {
    en: "Telugu months follow the Sanskrit lunar month names. Each month begins on the day after Amavasya (New Moon) and ends on the following Amavasya — this is the Amanta (New Moon ending) system, also used in Karnataka, Maharashtra, and Gujarat. When a lunar month has no solar transit (the Sun does not enter a new zodiac sign during the month), an intercalary month (Adhika Masa) is inserted approximately every 33 months to keep the calendar aligned with the seasons. The month in which two solar transits occur is called Kshaya Masa (diminished month), though this is exceedingly rare.",
    hi: "तेलुगु मास संस्कृत चान्द्र मास नामों का अनुसरण करते हैं। प्रत्येक मास अमावस्या के अगले दिन आरम्भ होकर अगली अमावस्या पर समाप्त होता है — यह अमान्त (अमावस्या अन्त) प्रणाली है। जब सौर संरेखण के कारण एक चान्द्र मास छूट जाता है, तो लगभग हर 33 माह में अधिक मास जोड़ा जाता है।",
    te: "తెలుగు నెలలు సంస్కృత చంద్రమాన నెల పేర్లను అనుసరిస్తాయి. ప్రతి నెల అమావాస్య మరుసటి రోజు ప్రారంభమై, తదుపరి అమావాస్యనాడు ముగుస్తుంది — ఇది అమాంత (అమావాస్య ముగింపు) వ్యవస్థ. సౌర అమరికతో ఒక చంద్ర మాసం వదిలిపోయినప్పుడు, సుమారు 33 నెలలకు ఒకసారి అధిక మాసం చేర్చబడుతుంది.",
  },
  festivalsTitle: {
    en: "Major Telugu Festivals by Month",
    hi: "मास अनुसार प्रमुख तेलुगु त्योहार",
    te: "నెల వారీ ముఖ్యమైన తెలుగు పండుగలు",
    ta: "மாதம் வாரியாக முக்கிய தெலுங்கு திருவிழாக்கள்",
    bn: "মাস অনুসারে প্রধান তেলেগু উৎসব",
    kn: "ತಿಂಗಳ ಪ್ರಕಾರ ಪ್ರಮುಖ ತೆಲುಗು ಹಬ್ಬಗಳು",
    gu: "મહિના પ્રમાણે મુખ્ય તેલુગુ તહેવારો",
  },
  ugadiTitle: {
    en: "Ugadi — Telugu New Year",
    hi: "उगादि — तेलुगु नव वर्ष",
    te: "ఉగాది — తెలుగు నూతన సంవత్సరం",
  },
  ugadiText: {
    en: 'Ugadi (from Sanskrit "Yuga Adi" — beginning of an era) falls on Chaitra Shukla Pratipada, typically in late March or early April. It is celebrated simultaneously as the Telugu and Kannada New Year. The day begins with an oil bath (Abhyanga Snanam), followed by prayers and the preparation of "Ugadi Pachadi" — a chutney combining six tastes: raw mango (sourness), jaggery (sweetness), neem flowers (bitterness), tamarind (tartness), green chilli (heat), and salt (pungency). These six tastes symbolise the six experiences of life — joy, sorrow, surprise, fear, disgust, and anger — reminding celebrants to embrace all of life\'s experiences in the year ahead. The Panchangam Sravanam (recitation of the new year\'s almanac) is a central ceremony, where priests read out predictions for the year based on the ruling planet, tithi, and nakshatra of Ugadi.',
    hi: 'उगादि (संस्कृत "युग आदि" — एक युग का आरम्भ) चैत्र शुक्ल प्रतिपदा को मनाया जाता है, आमतौर पर मार्च के अन्त या अप्रैल के आरम्भ में। इसे एक साथ तेलुगु और कन्नड़ नव वर्ष के रूप में मनाया जाता है। "उगादि पचड़ी" — कच्चा आम, गुड़, नीम के फूल, इमली, हरी मिर्च और नमक मिलाकर बनाई जाती है। ये छह स्वाद जीवन के छह अनुभवों का प्रतीक हैं। पंचांगम् श्रवणम् एक केन्द्रीय समारोह है जहाँ पुजारी उगादि के शासक ग्रह, तिथि और नक्षत्र के आधार पर वार्षिक भविष्यवाणियाँ पढ़ते हैं।',
    te: 'ఉగాది (సంస్కృతం "యుగ ఆది" — ఒక యుగం ప్రారంభం) చైత్ర శుద్ధ పాడ్యమి రోజు వస్తుంది, సాధారణంగా మార్చి చివరి లేదా ఏప్రిల్ ప్రారంభంలో. దీన్ని తెలుగు మరియు కన్నడ నూతన సంవత్సరంగా ఏకకాలంలో జరుపుకుంటారు. "ఉగాది పచ్చడి" — పచ్చి మామిడికాయ, బెల్లం, వేప పూలు, చింతపండు, పచ్చి మిరప, ఉప్పు కలిపి తయారు చేస్తారు. ఈ ఆరు రుచులు జీవితంలోని ఆరు అనుభవాలను సూచిస్తాయి. పంచాంగ శ్రవణం ఒక కేంద్ర వేడుక, ఇక్కడ పూజారులు ఉగాది నాటి రాజ్యపాలక గ్రహం, తిథి మరియు నక్షత్రం ఆధారంగా వార్షిక అంచనాలు చదువుతారు.',
  },
  calendarTitle: {
    en: "Calendar Characteristics",
    hi: "कैलेंडर विशेषताएँ",
    te: "పంచాంగ లక్షణాలు",
    ta: "நாட்காட்டி சிறப்பியல்புகள்",
    bn: "পঞ্জিকার বৈশিষ্ট্য",
    kn: "ಪಂಚಾಂಗ ಲಕ್ಷಣಗಳು",
    gu: "પંચાંગ લક્ષણો",
  },
  calendarText: {
    en: "The Telugu Panchangam is lunisolar: months are lunar (New Moon to New Moon, Amanta system), but the year is calibrated against the solar cycle through the addition of Adhika Masa. Telugu months use the Amanta reckoning (month ends on Amavasya), identical to the system used across Karnataka, Maharashtra, and most of South India. The 60-year Jovian cycle (Prabhava through Akshaya) names each year, and Telugu almanacs publish detailed predictions for each named year — agricultural outlooks, rainfall forecasts, and auspicious periods for major life events. The Telugu calendar is used for determining muhurtas (auspicious timings), tithi-based fasting days, and the annual cycle of festivals tied to the agricultural and religious calendar of the Deccan plateau.",
    hi: "तेलुगु पंचांगम् चान्द्र-सौर है: मास चान्द्र हैं (अमावस्या से अमावस्या तक, अमान्त प्रणाली), लेकिन वर्ष अधिक मास जोड़कर सौर चक्र के साथ कैलिब्रेट किया जाता है। 60-वर्षीय गुरु चक्र (प्रभव से अक्षय) प्रत्येक वर्ष का नाम देता है। तेलुगु पंचांगम् मुहूर्त निर्धारण, तिथि-आधारित व्रत दिवसों और दक्कन पठार के कृषि एवं धार्मिक कैलेंडर से जुड़े उत्सवों के वार्षिक चक्र के लिए उपयोग किया जाता है।",
    te: "తెలుగు పంచాంగం చాంద్రమాన సౌర: నెలలు చంద్ర (అమావాస్య నుండి అమావాస్య వరకు, అమాంత వ్యవస్థ), కానీ సంవత్సరం అధిక మాసం జోడించడం ద్వారా సౌర చక్రంతో కాలిబ్రేట్ చేయబడుతుంది. 60 సంవత్సరాల గురు చక్రం (ప్రభవ నుండి అక్షయ వరకు) ప్రతి సంవత్సరానికి పేరు ఇస్తుంది. తెలుగు పంచాంగం ముహూర్తాల నిర్ణయానికి, తిథి ఆధారిత ఉపవాస రోజులకు మరియు దక్కన్ పీఠభూమి కృషి-మత పంచాంగంతో ముడిపడిన పండుగల వార్షిక చక్రానికి ఉపయోగించబడుతుంది.",
  },
  samvatsaraTitle: {
    en: "Samvatsara — The 60-Year Jovian Cycle",
    hi: "संवत्सर — 60-वर्षीय गुरु चक्र",
    te: "సంవత్సరం — 60 సంవత్సరాల గురు చక్రం",
  },
  panchangamSravanamTitle: {
    en: "Panchangam Sravanam — The Sacred Almanac Recitation",
    hi: "पंचांगम् श्रवणम् — पवित्र पंचांग पाठ",
    te: "పంచాంగ శ్రవణం — పవిత్ర పంచాంగ పఠనం",
  },
  monthConversionTitle: {
    en: "Telugu Month to Gregorian Conversion Table (2026–2027)",
    hi: "तेलुगु मास से ग्रेगोरियन रूपान्तरण तालिका (2026–2027)",
    te: "తెలుగు నెలల గ్రెగోరియన్ మార్పిడి పట్టిక (2026–2027)",
  },
  faqTitle: {
    en: "Frequently Asked Questions (FAQ)",
    hi: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
    te: "తరచుగా అడిగే ప్రశ్నలు (FAQ)",
  },
  relatedTitle: {
    en: "Related Regional Calendars",
    hi: "सम्बन्धित कैलेंडर",
    te: "సంబంధిత ప్రాంతీయ పంచాంగాలు",
  },
};

const TELUGU_MONTHS = [
  {
    name: "Chaitra",
    telugu: "చైత్రం",
    nameHi: "चैत्र",
    rashi: "Mesha–Vrishabha",
    gregorian: "Mar – Apr",
  },
  {
    name: "Vaishakha",
    telugu: "వైశాఖం",
    nameHi: "वैशाख",
    rashi: "Vrishabha–Mithuna",
    gregorian: "Apr – May",
  },
  {
    name: "Jyeshtha",
    telugu: "జ్యేష్ఠం",
    nameHi: "ज्येष्ठ",
    rashi: "Mithuna–Kataka",
    gregorian: "May – Jun",
  },
  {
    name: "Ashadha",
    telugu: "ఆషాఢం",
    nameHi: "आषाढ",
    rashi: "Kataka–Simha",
    gregorian: "Jun – Jul",
  },
  {
    name: "Shravana",
    telugu: "శ్రావణం",
    nameHi: "श्रावण",
    rashi: "Simha–Kanya",
    gregorian: "Jul – Aug",
  },
  {
    name: "Bhadrapada",
    telugu: "భాద్రపదం",
    nameHi: "भाद्रपद",
    rashi: "Kanya–Tula",
    gregorian: "Aug – Sep",
  },
  {
    name: "Ashvija",
    telugu: "ఆశ్వయుజం",
    nameHi: "आश्विन",
    rashi: "Tula–Vrischika",
    gregorian: "Sep – Oct",
  },
  {
    name: "Kartika",
    telugu: "కార్తీకం",
    nameHi: "कार्तिक",
    rashi: "Vrischika–Dhanus",
    gregorian: "Oct – Nov",
  },
  {
    name: "Margashira",
    telugu: "మార్గశిరం",
    nameHi: "मार्गशीर्ष",
    rashi: "Dhanus–Makara",
    gregorian: "Nov – Dec",
  },
  {
    name: "Pushya",
    telugu: "పుష్యం",
    nameHi: "पौष",
    rashi: "Makara–Kumbha",
    gregorian: "Dec – Jan",
  },
  {
    name: "Magha",
    telugu: "మాఘం",
    nameHi: "माघ",
    rashi: "Kumbha–Meena",
    gregorian: "Jan – Feb",
  },
  {
    name: "Phalguna",
    telugu: "ఫాల్గుణం",
    nameHi: "फाल्गुन",
    rashi: "Meena–Mesha",
    gregorian: "Feb – Mar",
  },
];

const FESTIVALS = [
  {
    month: "Chaitra",
    en: "Ugadi (Telugu New Year, Chaitra Shukla Pratipada), Sri Rama Navami (Chaitra Shukla Navami)",
    hi: "उगादि (तेलुगु नव वर्ष), श्री राम नवमी",
    te: "ఉగాది (తెలుగు నూతన సంవత్సరం, చైత్ర శుద్ధ పాడ్యమి), శ్రీ రామ నవమి (చైత్ర శుద్ధ నవమి)",
  },
  {
    month: "Shravana",
    en: "Varalakshmi Vratam (Friday before Shravana Purnima — one of the most important women's festivals in Telugu households)",
    hi: "वरलक्ष्मी व्रतम् (श्रावण पूर्णिमा से पहले शुक्रवार)",
    te: "వరలక్ష్మీ వ్రతం (శ్రావణ పూర్ణిమకు ముందు శుక్రవారం — తెలుగు ఇళ్లలో అత్యంత ముఖ్యమైన స్త్రీల పండుగలలో ఒకటి)",
  },
  {
    month: "Bhadrapada",
    en: "Vinayaka Chaturthi (Ganesh festival — 10-day celebration, immersion on Chaturdashi)",
    hi: "विनायक चतुर्थी (गणेश उत्सव — 10 दिवसीय उत्सव)",
    te: "వినాయక చవితి (గణేశ పండుగ — 10 రోజుల వేడుక, చతుర్దశి నాడు నిమజ్జనం)",
  },
  {
    month: "Ashvija",
    en: "Dasara / Vijayadashami (9-night Navaratri culminating in Vijayadashami — celebration of Mahishasura's defeat)",
    hi: "दशहरा / विजयदशमी (9-रात्रि नवरात्रि)",
    te: "దసరా / విజయదశమి (9 రాత్రుల నవరాత్రి, విజయదశమితో ముగింపు — మహిషాసుర వధ వేడుక)",
  },
  {
    month: "Kartika",
    en: "Deepavali (Kartika Amavasya — festival of lights), Kartika Purnima (sacred bathing in rivers)",
    hi: "दीपावली (कार्तिक अमावस्या), कार्तिक पूर्णिमा (नदी स्नान)",
    te: "దీపావళి (కార్తీక అమావాస్య — దీపాల పండుగ), కార్తీక పూర్ణిమ (నదులలో పవిత్ర స్నానం)",
  },
  {
    month: "Magha",
    en: "Sankranti / Pongal (Makara Sankranti — the most important harvest festival; 3 days: Bhogi, Sankranti, Kanuma)",
    hi: "संक्रान्ति / पोंगल (मकर संक्रान्ति — 3 दिवसीय फसल उत्सव)",
    te: "సంక్రాంతి (మకర సంక్రాంతి — అత్యంత ముఖ్యమైన పంట పండుగ; 3 రోజులు: భోగి, సంక్రాంతి, కనుమ)",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 2026 Telugu Festival Dates with Tithi & Nakshatra
// Sources: mainstream reference panchangs reference for Hyderabad
// ═══════════════════════════════════════════════════════════════════════════

const FESTIVAL_DATES_2026 = [
  {
    en: "Makara Sankranti",
    hi: "मकर संक्रान्ति",
    te: "మకర సంక్రాంతి",
    date: "Wed, 14 Jan 2026",
    tithi: "Paush Krishna Pratipada",
    nakshatra: "Uttara Ashadha",
  },
  {
    en: "Maha Shivaratri",
    hi: "महा शिवरात्रि",
    te: "మహా శివరాత్రి",
    date: "Sat, 14 Feb 2026",
    tithi: "Magha Krishna Chaturdashi",
    nakshatra: "Shatabisha",
  },
  {
    en: "Ugadi (Telugu New Year)",
    hi: "उगादि (तेलुगु नव वर्ष)",
    te: "ఉగాది (తెలుగు నూతన సంవత్సరం)",
    date: "Sat, 28 Mar 2026",
    tithi: "Chaitra Shukla Pratipada",
    nakshatra: "Uttara Bhadrapada",
  },
  {
    en: "Sri Rama Navami",
    hi: "श्री राम नवमी",
    te: "శ్రీ రామ నవమి",
    date: "Mon, 6 Apr 2026",
    tithi: "Chaitra Shukla Navami",
    nakshatra: "Punarvasu",
  },
  {
    en: "Varalakshmi Vratam",
    hi: "वरलक्ष्मी व्रतम्",
    te: "వరలక్ష్మీ వ్రతం",
    date: "Fri, 7 Aug 2026",
    tithi: "Shravana Shukla Dwadashi",
    nakshatra: "Uttara Phalguni",
  },
  {
    en: "Vinayaka Chaturthi",
    hi: "विनायक चतुर्थी",
    te: "వినాయక చవితి",
    date: "Fri, 4 Sep 2026",
    tithi: "Bhadrapada Shukla Chaturthi",
    nakshatra: "Chitra",
  },
  {
    en: "Dasara / Vijayadashami",
    hi: "दशहरा / विजयदशमी",
    te: "దసరా / విజయదశమి",
    date: "Sat, 17 Oct 2026",
    tithi: "Ashvija Shukla Dashami",
    nakshatra: "Vishakha",
  },
  {
    en: "Deepavali",
    hi: "दीपावली",
    te: "దీపావళి",
    date: "Sun, 8 Nov 2026",
    tithi: "Kartika Krishna Amavasya",
    nakshatra: "Swati",
  },
  {
    en: "Kartika Purnima",
    hi: "कार्तिक पूर्णिमा",
    te: "కార్తీక పూర్ణిమ",
    date: "Mon, 23 Nov 2026",
    tithi: "Kartika Purnima",
    nakshatra: "Krittika",
  },
  {
    en: "Subramanya Shashti",
    hi: "सुब्रह्मण्य षष्ठी",
    te: "సుబ్రహ్మణ్య షష్ఠి",
    date: "Sat, 28 Nov 2026",
    tithi: "Margashira Shukla Shashthi",
    nakshatra: "Pushya",
  },
];

const FESTIVAL_DATES_2027 = [
  {
    en: "Makara Sankranti",
    hi: "मकर संक्रान्ति",
    te: "మకర సంక్రాంతి",
    date: "Thu, 14 Jan 2027",
    tithi: "Paush Shukla Dashami",
    nakshatra: "Shravana",
  },
  {
    en: "Maha Shivaratri",
    hi: "महा शिवरात्रि",
    te: "మహా శివరాత్రి",
    date: "Thu, 4 Feb 2027",
    tithi: "Magha Krishna Chaturdashi",
    nakshatra: "Shatabisha",
  },
  {
    en: "Ugadi (Telugu New Year)",
    hi: "उगादि (तेलुगु नव वर्ष)",
    te: "ఉగాది (తెలుగు నూతన సంవత్సరం)",
    date: "Wed, 17 Mar 2027",
    tithi: "Chaitra Shukla Pratipada",
    nakshatra: "Uttara Bhadrapada",
  },
  {
    en: "Sri Rama Navami",
    hi: "श्री राम नवमी",
    te: "శ్రీ రామ నవమి",
    date: "Thu, 25 Mar 2027",
    tithi: "Chaitra Shukla Navami",
    nakshatra: "Punarvasu",
  },
  {
    en: "Varalakshmi Vratam",
    hi: "वरलक्ष्मी व्रतम्",
    te: "వరలక్ష్మీ వ్రతం",
    date: "Fri, 30 Jul 2027",
    tithi: "Shravana Shukla Trayodashi",
    nakshatra: "Hasta",
  },
  {
    en: "Vinayaka Chaturthi",
    hi: "विनायक चतुर्थी",
    te: "వినాయక చవితి",
    date: "Wed, 25 Aug 2027",
    tithi: "Bhadrapada Shukla Chaturthi",
    nakshatra: "Chitra",
  },
  {
    en: "Dasara / Vijayadashami",
    hi: "दशहरा / विजयदशमी",
    te: "దసరా / విజయదశమి",
    date: "Wed, 6 Oct 2027",
    tithi: "Ashvija Shukla Dashami",
    nakshatra: "Vishakha",
  },
  {
    en: "Deepavali",
    hi: "दीपावली",
    te: "దీపావళి",
    date: "Thu, 28 Oct 2027",
    tithi: "Kartika Krishna Amavasya",
    nakshatra: "Chitra",
  },
  {
    en: "Kartika Purnima",
    hi: "कार्तिक पूर्णिमा",
    te: "కార్తీక పూర్ణిమ",
    date: "Fri, 12 Nov 2027",
    tithi: "Kartika Purnima",
    nakshatra: "Krittika",
  },
  {
    en: "Subramanya Shashti",
    hi: "सुब्रह्मण्य षष्ठी",
    te: "సుబ్రహ్మణ్య షష్ఠి",
    date: "Wed, 17 Nov 2027",
    tithi: "Margashira Shukla Shashthi",
    nakshatra: "Pushya",
  },
];

// Telugu Month → Gregorian conversion table for 2026–2027
// Telugu calendar uses Amanta (New Moon ending) system
// Approximate Gregorian boundaries based on lunar month start/end
const MONTH_CONVERSION_2026 = [
  {
    telugu: "Chaitra",
    te: "చైత్రం",
    hi: "चैत्र",
    start: "29 Mar 2026",
    end: "26 Apr 2026",
  },
  {
    telugu: "Vaishakha",
    te: "వైశాఖం",
    hi: "वैशाख",
    start: "27 Apr 2026",
    end: "25 May 2026",
  },
  {
    telugu: "Jyeshtha",
    te: "జ్యేష్ఠం",
    hi: "ज्येष्ठ",
    start: "26 May 2026",
    end: "24 Jun 2026",
  },
  {
    telugu: "Ashadha",
    te: "ఆషాఢం",
    hi: "आषाढ",
    start: "25 Jun 2026",
    end: "23 Jul 2026",
  },
  {
    telugu: "Shravana",
    te: "శ్రావణం",
    hi: "श्रावण",
    start: "24 Jul 2026",
    end: "22 Aug 2026",
  },
  {
    telugu: "Bhadrapada",
    te: "భాద్రపదం",
    hi: "भाद्रपद",
    start: "23 Aug 2026",
    end: "20 Sep 2026",
  },
  {
    telugu: "Ashvija",
    te: "ఆశ్వయుజం",
    hi: "आश्विन",
    start: "21 Sep 2026",
    end: "20 Oct 2026",
  },
  {
    telugu: "Kartika",
    te: "కార్తీకం",
    hi: "कार्तिक",
    start: "21 Oct 2026",
    end: "19 Nov 2026",
  },
  {
    telugu: "Margashira",
    te: "మార్గశిరం",
    hi: "मार्गशीर्ष",
    start: "20 Nov 2026",
    end: "18 Dec 2026",
  },
  {
    telugu: "Pushya",
    te: "పుష్యం",
    hi: "पौष",
    start: "19 Dec 2026",
    end: "17 Jan 2027",
  },
  {
    telugu: "Magha",
    te: "మాఘం",
    hi: "माघ",
    start: "18 Jan 2027",
    end: "15 Feb 2027",
  },
  {
    telugu: "Phalguna",
    te: "ఫాల్గుణం",
    hi: "फाल्गुन",
    start: "16 Feb 2027",
    end: "17 Mar 2027",
  },
];

const MONTH_CONVERSION_2027 = [
  {
    telugu: "Chaitra",
    te: "చైత్రం",
    hi: "चैत्र",
    start: "18 Mar 2027",
    end: "15 Apr 2027",
  },
  {
    telugu: "Vaishakha",
    te: "వైశాఖం",
    hi: "वैशाख",
    start: "16 Apr 2027",
    end: "15 May 2027",
  },
  {
    telugu: "Jyeshtha",
    te: "జ్యేష్ఠం",
    hi: "ज्येष्ठ",
    start: "16 May 2027",
    end: "13 Jun 2027",
  },
  {
    telugu: "Ashadha",
    te: "ఆషాఢం",
    hi: "आषाढ",
    start: "14 Jun 2027",
    end: "13 Jul 2027",
  },
  {
    telugu: "Shravana",
    te: "శ్రావణం",
    hi: "श्रावण",
    start: "14 Jul 2027",
    end: "11 Aug 2027",
  },
  {
    telugu: "Bhadrapada",
    te: "భాద్రపదం",
    hi: "भाद्रपद",
    start: "12 Aug 2027",
    end: "10 Sep 2027",
  },
  {
    telugu: "Ashvija",
    te: "ఆశ్వయుజం",
    hi: "आश्विन",
    start: "11 Sep 2027",
    end: "9 Oct 2027",
  },
  {
    telugu: "Kartika",
    te: "కార్తీకం",
    hi: "कार्तिक",
    start: "10 Oct 2027",
    end: "8 Nov 2027",
  },
  {
    telugu: "Margashira",
    te: "మార్గశిరం",
    hi: "मार्गशीर्ष",
    start: "9 Nov 2027",
    end: "8 Dec 2027",
  },
  {
    telugu: "Pushya",
    te: "పుష్యం",
    hi: "पौष",
    start: "9 Dec 2027",
    end: "6 Jan 2028",
  },
  {
    telugu: "Magha",
    te: "మాఘం",
    hi: "माघ",
    start: "7 Jan 2028",
    end: "5 Feb 2028",
  },
  {
    telugu: "Phalguna",
    te: "ఫాల్గుణం",
    hi: "फाल्गुन",
    start: "6 Feb 2028",
    end: "7 Mar 2028",
  },
];

// FAQ data for structured data and visible FAQ section
const FAQ_DATA = [
  {
    q: {
      en: "When is Ugadi 2026?",
      hi: "उगादि 2026 कब है?",
      te: "ఉగాది 2026 ఎప్పుడు?",
    },
    a: {
      en: "Ugadi 2026 falls on Saturday, 28 March 2026, on Chaitra Shukla Pratipada. This marks the beginning of the Telugu year Shobhakrit. The tithi is Pratipada (first lunar day of the bright fortnight) and the nakshatra is Uttara Bhadrapada. Ugadi Pachadi preparation and Panchangam Sravanam are the central rituals of the day.",
      hi: "उगादि 2026 शनिवार, 28 मार्च 2026 को चैत्र शुक्ल प्रतिपदा पर पड़ता है। यह तेलुगु वर्ष शोभकृत् का आरम्भ है। तिथि प्रतिपदा (शुक्ल पक्ष का पहला चन्द्र दिवस) है और नक्षत्र उत्तर भाद्रपद है।",
      te: "ఉగాది 2026 శనివారం, 28 మార్చి 2026 న చైత్ర శుద్ధ పాడ్యమి నాడు వస్తుంది. ఇది తెలుగు సంవత్సరం శోభకృత్ ప్రారంభం. తిథి పాడ్యమి (శుక్ల పక్షం మొదటి తిథి) మరియు నక్షత్రం ఉత్తర భాద్రపద.",
    },
  },
  {
    q: {
      en: "What is Telugu Panchangam?",
      hi: "तेलुगु पंचांगम् क्या है?",
      te: "తెలుగు పంచాంగం అంటే ఏమిటి?",
    },
    a: {
      en: 'The Telugu Panchangam (from Sanskrit "Pancha Anga" — five limbs) is the traditional lunisolar almanac used by Telugu-speaking people. It tracks five elements daily: Tithi (lunar day), Vara (weekday), Nakshatra (lunar mansion), Yoga (Sun-Moon angular relationship), and Karana (half-tithi). The Panchangam is essential for determining auspicious timings (muhurtas) for weddings, housewarming, travel, and all religious observances. Telugu Panchangams are published annually by traditional scholars (Siddhantis) and are consulted for everything from daily worship timings to agricultural planning.',
      hi: 'तेलुगु पंचांगम् (संस्कृत "पंच अंग" — पांच अंग) तेलुगु भाषियों द्वारा उपयोग किया जाने वाला पारम्परिक चान्द्र-सौर पंचांग है। यह दैनिक पांच तत्वों का अनुसरण करता है: तिथि, वार, नक्षत्र, योग, और करण। पंचांगम् विवाह, गृहप्रवेश, यात्रा और सभी धार्मिक अनुष्ठानों के शुभ मुहूर्त निर्धारित करने के लिए आवश्यक है।',
      te: 'తెలుగు పంచాంగం (సంస్కృతం "పంచ అంగ" — ఐదు అవయవాలు) తెలుగు మాట్లాడే ప్రజలు ఉపయోగించే సంప్రదాయ చాంద్రమాన పంచాంగం. ఇది ప్రతిరోజు ఐదు అంశాలను అనుసరిస్తుంది: తిథి, వారం, నక్షత్రం, యోగం, మరియు కరణం. పంచాంగం వివాహాలు, గృహప్రవేశం, ప్రయాణం మరియు అన్ని మత ఆచారాలకు శుభ ముహూర్తాలను నిర్ణయించడానికి అవసరం.',
    },
  },
  {
    q: {
      en: "When is Vinayaka Chaturthi 2026?",
      hi: "विनायक चतुर्थी 2026 कब है?",
      te: "వినాయక చవితి 2026 ఎప్పుడు?",
    },
    a: {
      en: "Vinayaka Chaturthi 2026 falls on Friday, 4 September 2026, on Bhadrapada Shukla Chaturthi. The nakshatra is Chitra. The festival is a 10-day celebration in Andhra Pradesh and Telangana, beginning with the installation of Ganesha idols and concluding with the immersion procession (Nimajjanam) on Ananta Chaturdashi (Sunday, 13 September 2026). Hyderabad is particularly famous for its grand Ganesh immersion procession at Tank Bund.",
      hi: "विनायक चतुर्थी 2026 शुक्रवार, 4 सितम्बर 2026 को भाद्रपद शुक्ल चतुर्थी पर पड़ती है। नक्षत्र चित्रा है। यह 10 दिवसीय उत्सव अनन्त चतुर्दशी (रविवार, 13 सितम्बर) पर गणेश निमज्जन के साथ समाप्त होता है। हैदराबाद का टैंक बंड निमज्जन विशेष रूप से प्रसिद्ध है।",
      te: "వినాయక చవితి 2026 శుక్రవారం, 4 సెప్టెంబర్ 2026 న భాద్రపద శుద్ధ చవితి నాడు వస్తుంది. నక్షత్రం చిత్ర. ఈ పండుగ 10 రోజుల వేడుక, అనంత చతుర్దశి (ఆదివారం, 13 సెప్టెంబర్ 2026) నాడు నిమజ్జనంతో ముగుస్తుంది. హైదరాబాద్ ట్యాంక్ బండ్ నిమజ్జన ఊరేగింపు ప్రత్యేకంగా ప్రసిద్ధం.",
    },
  },
  {
    q: {
      en: "How does the Telugu calendar differ from the Tamil calendar?",
      hi: "तेलुगु कैलेंडर तमिल कैलेंडर से कैसे भिन्न है?",
      te: "తెలుగు పంచాంగం తమిళ పంచాంగానికి ఎలా భిన్నంగా ఉంటుంది?",
    },
    a: {
      en: "The Telugu and Tamil calendars differ fundamentally in their reckoning system. The Telugu Panchangam follows the Chandramana (lunar) tradition — months run from New Moon to New Moon (Amanta system), and the year begins on Chaitra Shukla Pratipada (Ugadi, typically in March/April). The Tamil calendar follows the Sauramana (solar) tradition — months are determined by the Sun's transit through zodiac signs, and the year begins on Chithirai 1 (mid-April, same as Vishu and Poila Boishakh). This means Telugu months shift by about 15 days each year relative to the Gregorian calendar, while Tamil months have nearly fixed Gregorian dates. Telugu festivals are predominantly tithi-based (lunar), while Tamil festivals mix solar (Pongal, Tamil New Year) and lunar (Vinayagar Chaturthi, Deepavali) reckonings.",
      hi: "तेलुगु और तमिल कैलेंडर अपनी गणना प्रणाली में मूलभूत रूप से भिन्न हैं। तेलुगु पंचांगम् चान्द्रमान परम्परा का अनुसरण करता है — मास अमावस्या से अमावस्या तक चलते हैं, और वर्ष चैत्र शुक्ल प्रतिपदा (उगादि) को आरम्भ होता है। तमिल कैलेंडर सौरमान परम्परा का अनुसरण करता है — मास सूर्य की राशि संक्रमण से निर्धारित होते हैं। तेलुगु मास प्रतिवर्ष ग्रेगोरियन कैलेंडर के सापेक्ष लगभग 15 दिन बदलते हैं, जबकि तमिल मासों की ग्रेगोरियन तिथियां लगभग निश्चित होती हैं।",
      te: "తెలుగు మరియు తమిళ పంచాంగాలు వాటి గణన వ్యవస్థలో మూలభూతంగా భిన్నంగా ఉంటాయి. తెలుగు పంచాంగం చంద్రమాన సంప్రదాయాన్ని అనుసరిస్తుంది — నెలలు అమావాస్య నుండి అమావాస్య వరకు నడుస్తాయి, మరియు సంవత్సరం చైత్ర శుద్ధ పాడ్యమి (ఉగాది) న ప్రారంభమవుతుంది. తమిళ పంచాంగం సౌరమాన సంప్రదాయాన్ని అనుసరిస్తుంది — నెలలు సూర్యుని రాశి సంక్రమణం ద్వారా నిర్ణయించబడతాయి.",
    },
  },
  {
    q: {
      en: "What is the current Telugu year name?",
      hi: "वर्तमान तेलुगु वर्ष का नाम क्या है?",
      te: "ప్రస్తుత తెలుగు సంవత్సరం పేరు ఏమిటి?",
    },
    a: {
      en: 'The current Telugu year is Shobhakrit (శోభకృత్), which began on Ugadi, 28 March 2026, and runs until the next Ugadi in March 2027. Shobhakrit is the 37th year in the 60-year Jovian (Brihaspati) cycle. The name Shobhakrit means "creator of splendour" and is considered a generally auspicious year in traditional Telugu Panchangam predictions. The ruling planet (Rajya Prabhu) and other planetary influences for the year are announced during the Panchangam Sravanam ceremony on Ugadi day.',
      hi: 'वर्तमान तेलुगु वर्ष शोभकृत् (శోభకృత్) है, जो उगादि 28 मार्च 2026 से आरम्भ हुआ और मार्च 2027 में अगले उगादि तक चलेगा। शोभकृत् 60-वर्षीय गुरु (बृहस्पति) चक्र का 37वां वर्ष है। शोभकृत् का अर्थ है "शोभा का रचयिता" और इसे सामान्यतः शुभ वर्ष माना जाता है।',
      te: 'ప్రస్తుత తెలుగు సంవత్సరం శోభకృత్, ఇది ఉగాది 28 మార్చి 2026 న ప్రారంభమై, మార్చి 2027 లో తదుపరి ఉగాది వరకు కొనసాగుతుంది. శోభకృత్ 60 సంవత్సరాల గురు (బృహస్పతి) చక్రంలో 37వ సంవత్సరం. శోభకృత్ అనగా "శోభను సృష్టించేది" మరియు ఇది సాధారణంగా శుభ సంవత్సరంగా పరిగణించబడుతుంది.',
    },
  },
  {
    q: {
      en: "When is Deepavali 2026 in the Telugu calendar?",
      hi: "तेलुगु कैलेंडर में दीपावली 2026 कब है?",
      te: "తెలుగు పంచాంగంలో దీపావళి 2026 ఎప్పుడు?",
    },
    a: {
      en: "Deepavali 2026 falls on Sunday, 8 November 2026, on Kartika Krishna Amavasya. The nakshatra is Swati. In the Telugu tradition, Deepavali is celebrated on the Amavasya (new moon) of Kartika month. The celebrations in Andhra Pradesh and Telangana include an early-morning oil bath (Abhyanga Snanam) before sunrise, followed by new clothes, sweets (especially Chakralu, Sunnundalu, and Ariselu), and fireworks. Naraka Chaturdashi, the day before Deepavali, is also observed as the victory of Lord Krishna over the demon Narakasura.",
      hi: "दीपावली 2026 रविवार, 8 नवम्बर 2026 को कार्तिक कृष्ण अमावस्या पर पड़ती है। नक्षत्र स्वाति है। तेलुगु परम्परा में, दीपावली कार्तिक मास की अमावस्या पर मनाई जाती है। उत्सव में सूर्योदय से पहले तैलाभ्यंग (तेल स्नान), नए वस्त्र, मिठाइयां (चकरालु, सुन्नुन्डालु, अरिसेलु) और आतिशबाजी शामिल है।",
      te: "దీపావళి 2026 ఆదివారం, 8 నవంబర్ 2026 న కార్తీక కృష్ణ అమావాస్య నాడు వస్తుంది. నక్షత్రం స్వాతి. తెలుగు సంప్రదాయంలో, దీపావళి కార్తీక మాసం అమావాస్య నాడు జరుపుకుంటారు. ఆంధ్రప్రదేశ్ మరియు తెలంగాణలో సూర్యోదయానికి ముందు తైలాభ్యంగం (నూనె స్నానం), కొత్త బట్టలు, మిఠాయిలు (చక్రాలు, సున్నుండాలు, అరిసెలు) మరియు బాణసంచా ఉంటాయి.",
    },
  },
];

function L(key: string, locale: string): string {
  const entry = LABELS[key];
  if (!entry) return "";
  const isTe = locale === "te";
  if (isTe && entry.te) return entry.te;
  return entry[locale] || entry.en;
}

export default async function TeluguCalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isTe = locale === "te";
  const isHi = isDevanagariLocale(locale);
  const hf = isHi
    ? { fontFamily: "var(--font-devanagari-heading)" }
    : isTe
      ? { fontFamily: "var(--font-telugu-heading)" }
      : { fontFamily: "var(--font-heading)" };

  // Helper for festival trilingual text
  const fLang = (f: { en: string; hi: string; te: string }) =>
    isTe ? f.te : isHi ? f.hi : f.en;

  // JSON-LD FAQ structured data
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((faq) => ({
      "@type": "Question",
      name: faq.q.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a.en,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* JSON-LD FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        {/* Header */}
        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4"
            style={hf}
          >
            {L("title", locale)}
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
            {L("intro", locale)}
          </p>
        </div>

        {/* Samvatsara Section */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L("samvatsaraTitle", locale)}
          </h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              {isTe
                ? "తెలుగు పంచాంగం ప్రతి సంవత్సరానికి 60 సంవత్సరాల గురు (బృహస్పతి) చక్రం నుండి ఒక పేరు ఇస్తుంది. ఈ చక్రం ప్రభవ నుండి ప్రారంభమై అక్షయతో ముగుస్తుంది, తర్వాత మళ్ళీ ప్రారంభమవుతుంది. ప్రస్తుత సంవత్సరం శోభకృత్ (37వ సంవత్సరం), ఇది 28 మార్చి 2026 (ఉగాది) న ప్రారంభమై మార్చి 2027 లో తదుపరి ఉగాది వరకు కొనసాగుతుంది. తదుపరి సంవత్సరం (2027–28) క్రోధి. ప్రతి సంవత్సర నామం నిర్దిష్ట గుణాలు మరియు ఫలితాలతో ముడిపడి ఉంటుంది, ఇవి పంచాంగ శ్రవణం సందర్భంగా చదివబడతాయి."
                : isHi
                  ? "60-वर्षीय गुरु (बृहस्पति) चक्र तेलुगु पंचांगम् का एक केन्द्रीय अंग है। यह चक्र प्रभव से आरम्भ होकर अक्षय पर समाप्त होता है, फिर पुनः आरम्भ होता है। वर्तमान वर्ष शोभकृत् (37वां वर्ष) है, जो 28 मार्च 2026 (उगादि) से आरम्भ होकर मार्च 2027 में अगले उगादि तक चलता है। अगला वर्ष (2027–28) क्रोधी होगा। प्रत्येक संवत्सर नाम विशिष्ट गुणों और भविष्यवाणियों से जुड़ा होता है, जो पंचांगम् श्रवणम् के दौरान पढ़ी जाती हैं।"
                  : 'The 60-year Jovian (Brihaspati) cycle is a central feature of the Telugu Panchangam. The cycle begins with Prabhava and ends with Akshaya, then restarts. Each year in the cycle carries a unique Sanskrit name that is believed to influence the character of the year — agricultural yields, rainfall patterns, political stability, and general prosperity. The current Telugu year is Shobhakrit (శోభకృత్, the 37th year in the cycle), which began on Ugadi, 28 March 2026, and runs until the next Ugadi in March 2027. The following year (2027–28) will be Krodhi. The name "Shobhakrit" means "creator of splendour" and is traditionally considered a year of general prosperity, artistic achievement, and religious devotion. The 60-year cycle has been used continuously for over 2,000 years in Telugu-speaking regions and forms the backbone of long-term Panchangam predictions.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-bg-primary/40 border border-gold-primary/8 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-lg mb-1">
                  {isTe ? "శోభకృత్" : isHi ? "शोभकृत्" : "Shobhakrit"}
                </div>
                <div className="text-amber-400/80 text-sm mb-1">
                  {isTe
                    ? "37వ సంవత్సరం"
                    : isHi
                      ? "37वां वर्ष"
                      : "37th Year in Cycle"}
                </div>
                <div className="text-text-secondary text-xs">
                  {isTe
                    ? "28 మార్చి 2026 – మార్చి 2027"
                    : isHi
                      ? "28 मार्च 2026 – मार्च 2027"
                      : "28 Mar 2026 – Mar 2027"}
                </div>
              </div>
              <div className="bg-bg-primary/40 border border-gold-primary/8 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-lg mb-1">
                  {isTe ? "క్రోధి" : isHi ? "क्रोधी" : "Krodhi"}
                </div>
                <div className="text-amber-400/80 text-sm mb-1">
                  {isTe
                    ? "38వ సంవత్సరం"
                    : isHi
                      ? "38वां वर्ष"
                      : "38th Year in Cycle"}
                </div>
                <div className="text-text-secondary text-xs">
                  {isTe
                    ? "మార్చి 2027 – మార్చి 2028"
                    : isHi
                      ? "मार्च 2027 – मार्च 2028"
                      : "Mar 2027 – Mar 2028"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Month Table */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L("monthsTitle", locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {L("monthsIntro", locale)}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    #
                  </th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {RC('colMonth', locale)}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {isTe ? "తెలుగు" : "Telugu"}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {RC('colRashi', locale)}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {RC('colGregorian', locale)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {TELUGU_MONTHS.map((m, i) => (
                  <tr
                    key={m.name}
                    className={
                      i % 2 === 0 ? "bg-bg-secondary/20" : "bg-bg-secondary/40"
                    }
                  >
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">
                      {isTe ? m.telugu : isHi ? m.nameHi : m.name}
                    </td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">
                      {m.telugu}
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary">
                      {m.rashi}
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary">
                      {m.gregorian}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Month to Gregorian Conversion Table 2026 */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L("monthConversionTitle", locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {isTe
              ? "తెలుగు సంవత్సరం శోభకృత్ (2026–27) మరియు క్రోధి (2027–28) కాలంలో ప్రతి తెలుగు నెల యొక్క గ్రెగోరియన్ ప్రారంభ మరియు ముగింపు తేదీలు. తెలుగు నెలలు చంద్రమాన (అమాంత) వ్యవస్థను అనుసరిస్తాయి కాబట్టి, ప్రతి సంవత్సరం గ్రెగోరియన్ తేదీలు కొద్దిగా మారుతాయి."
              : isHi
                ? "तेलुगु वर्ष शोभकृत् (2026–27) और क्रोधी (2027–28) के दौरान प्रत्येक तेलुगु मास की ग्रेगोरियन प्रारम्भ और समाप्ति तिथियां। तेलुगु मास चान्द्रमान (अमान्त) प्रणाली का अनुसरण करते हैं, इसलिए ग्रेगोरियन तिथियां प्रतिवर्ष थोड़ी बदलती हैं।"
                : "Start and end dates in the Gregorian calendar for each Telugu month during the Telugu years Shobhakrit (2026–27) and Krodhi (2027–28). Since Telugu months follow the Chandramana (lunar) system, the Gregorian dates shift slightly each year, typically by about 10–11 days earlier or later than the previous year."}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12 mb-6">
            <div className="text-gold-light font-semibold text-sm px-4 py-2 bg-bg-secondary/60 border-b border-gold-primary/12">
              {isTe
                ? "శోభకృత్ సంవత్సరం (2026–27)"
                : isHi
                  ? "शोभकृत् संवत्सर (2026–27)"
                  : "Shobhakrit Year (2026–27)"}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/40 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-2 text-gold-light font-semibold">
                    {RC('colMonth', locale)}
                  </th>
                  <th className="text-left px-4 py-2 text-gold-light font-semibold">
                    {isTe ? "తెలుగు" : "Telugu"}
                  </th>
                  <th className="text-left px-4 py-2 text-gold-light font-semibold">
                    {isTe ? "ప్రారంభం" : isHi ? "प्रारम्भ" : "Start"}
                  </th>
                  <th className="text-left px-4 py-2 text-gold-light font-semibold">
                    {isTe ? "ముగింపు" : isHi ? "समाप्ति" : "End"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {MONTH_CONVERSION_2026.map((m, i) => (
                  <tr
                    key={m.telugu + "2026"}
                    className={
                      i % 2 === 0 ? "bg-bg-secondary/20" : "bg-bg-secondary/40"
                    }
                  >
                    <td className="px-4 py-2.5 text-text-primary font-medium">
                      {isTe ? m.te : isHi ? m.hi : m.telugu}
                    </td>
                    <td className="px-4 py-2.5 text-amber-400/80">{m.te}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">
                      {m.start}
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">
                      {m.end}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <div className="text-gold-light font-semibold text-sm px-4 py-2 bg-bg-secondary/60 border-b border-gold-primary/12">
              {isTe
                ? "క్రోధి సంవత్సరం (2027–28)"
                : isHi
                  ? "क्रोधी संवत्सर (2027–28)"
                  : "Krodhi Year (2027–28)"}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/40 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-2 text-gold-light font-semibold">
                    {RC('colMonth', locale)}
                  </th>
                  <th className="text-left px-4 py-2 text-gold-light font-semibold">
                    {isTe ? "తెలుగు" : "Telugu"}
                  </th>
                  <th className="text-left px-4 py-2 text-gold-light font-semibold">
                    {isTe ? "ప్రారంభం" : isHi ? "प्रारम्भ" : "Start"}
                  </th>
                  <th className="text-left px-4 py-2 text-gold-light font-semibold">
                    {isTe ? "ముగింపు" : isHi ? "समाप्ति" : "End"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {MONTH_CONVERSION_2027.map((m, i) => (
                  <tr
                    key={m.telugu + "2027"}
                    className={
                      i % 2 === 0 ? "bg-bg-secondary/20" : "bg-bg-secondary/40"
                    }
                  >
                    <td className="px-4 py-2.5 text-text-primary font-medium">
                      {isTe ? m.te : isHi ? m.hi : m.telugu}
                    </td>
                    <td className="px-4 py-2.5 text-amber-400/80">{m.te}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">
                      {m.start}
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">
                      {m.end}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Festivals by Month */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {L("festivalsTitle", locale)}
          </h2>
          <div className="space-y-3">
            {FESTIVALS.map((f) => (
              <div
                key={f.month}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4"
              >
                <div className="text-gold-light font-semibold text-sm mb-1.5">
                  {f.month}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {isTe ? f.te || f.en : isHi ? f.hi : f.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 2026 Telugu Festival Dates with Tithi & Nakshatra */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isTe
              ? "తెలుగు పండుగల తేదీలు 2026 — తిథి, నక్షత్రం & ఖచ్చితమైన తేదీలు"
              : isHi
                ? "तेलुगु त्योहार 2026 — तिथि, नक्षत्र और दिनांक"
                : "Telugu Festival Dates 2026 — Tithi, Nakshatra & Exact Dates"}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {isTe
              ? "హైదరాబాద్ సూచన ప్రకారం 2026 లో ముఖ్యమైన తెలుగు పండుగల ఖచ్చితమైన తేదీలు, తిథి (చంద్ర దినం) మరియు నక్షత్రం (చంద్ర నక్షత్రం). మీ పూజా కార్యక్రమాలను ఈ ధృవీకరించిన తేదీలతో ప్రణాళిక చేసుకోండి."
              : isHi
                ? "हैदराबाद सन्दर्भ के साथ 2026 के प्रमुख तेलुगु त्योहारों की सटीक तिथियां, तिथि (चन्द्र दिवस) और नक्षत्र (चन्द्र भवन)। अपनी पूजा की योजना इन सत्यापित तिथियों के साथ बनाएं।"
                : "Exact dates for all major Telugu festivals in 2026 with tithi (lunar day) and nakshatra (lunar mansion) computed for Hyderabad. Plan your puja schedules and family celebrations with these verified dates from the Telugu Panchangam."}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {isTe ? "పండుగ" : isHi ? "त्योहार" : "Festival"}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {isTe ? "తేదీ" : isHi ? "दिनांक" : "Date"}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {isTe ? "తిథి" : isHi ? "तिथि" : "Tithi"}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {isTe ? "నక్షత్రం" : isHi ? "नक्षत्र" : "Nakshatra"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {FESTIVAL_DATES_2026.map((f, i) => (
                  <tr
                    key={f.en}
                    className={
                      i % 2 === 0 ? "bg-bg-secondary/20" : "bg-bg-secondary/40"
                    }
                  >
                    <td className="px-4 py-2.5 text-text-primary font-medium">
                      {fLang(f)}
                    </td>
                    <td className="px-4 py-2.5 text-amber-400/80">{f.date}</td>
                    <td className="px-4 py-2.5 text-text-secondary">
                      {f.tithi}
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary">
                      {f.nakshatra}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2027 Telugu Festival Dates */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isTe
              ? "తెలుగు పండుగల తేదీలు 2027 — తిథి, నక్షత్రం & ఖచ్చితమైన తేదీలు"
              : isHi
                ? "तेलुगु त्योहार 2027 — तिथि, नक्षत्र और दिनांक"
                : "Telugu Festival Dates 2027 — Tithi, Nakshatra & Exact Dates"}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {isTe
              ? "2027 లో ముఖ్యమైన తెలుగు పండుగల తేదీలు. తెలుగు సంవత్సరం క్రోధి మార్చి 2027 లో ఉగాదితో ప్రారంభమవుతుంది."
              : isHi
                ? "2027 में प्रमुख तेलुगु त्योहार। तेलुगु वर्ष क्रोधी मार्च 2027 में उगादि से आरम्भ होगा।"
                : "Major Telugu festival dates for 2027. The Telugu year Krodhi begins with Ugadi in March 2027. All dates computed for Hyderabad with tithi and nakshatra from the Telugu Panchangam."}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {isTe ? "పండుగ" : isHi ? "त्योहार" : "Festival"}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {isTe ? "తేదీ" : isHi ? "दिनांक" : "Date"}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {isTe ? "తిథి" : isHi ? "तिथि" : "Tithi"}
                  </th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">
                    {isTe ? "నక్షత్రం" : isHi ? "नक्षत्र" : "Nakshatra"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {FESTIVAL_DATES_2027.map((f, i) => (
                  <tr
                    key={f.en}
                    className={
                      i % 2 === 0 ? "bg-bg-secondary/20" : "bg-bg-secondary/40"
                    }
                  >
                    <td className="px-4 py-2.5 text-text-primary font-medium">
                      {fLang(f)}
                    </td>
                    <td className="px-4 py-2.5 text-amber-400/80">{f.date}</td>
                    <td className="px-4 py-2.5 text-text-secondary">
                      {f.tithi}
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary">
                      {f.nakshatra}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Ugadi */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L("ugadiTitle", locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L("ugadiText", locale)}
          </p>
        </section>

        {/* Panchangam Sravanam */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L("panchangamSravanamTitle", locale)}
          </h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              {isTe
                ? 'పంచాంగ శ్రవణం ఉగాది రోజున జరిగే అత్యంత ముఖ్యమైన ఆచారాలలో ఒకటి. "శ్రవణం" అనగా "వినడం" — ఈ వేడుకలో పురోహితులు లేదా పండితులు నూతన సంవత్సర పంచాంగాన్ని ప్రజల సమక్షంలో చదువుతారు. ఈ పఠనంలో సంవత్సర రాజు (రాజ్య ప్రభు), మంత్రి, సేనాధిపతి, సస్యాధిపతి (పంటల అధిపతి), ధాన్యాధిపతి, అర్ఘాధిపతి (ధరల అధిపతి), మేఘాధిపతి (వర్షాల అధిపతి) మరియు రసాధిపతి (ద్రవాల అధిపతి) వంటి నవ నాయకుల (తొమ్మిది పాలకుల) వివరాలు ఉంటాయి. ఈ గ్రహ పాలకుల ఆధారంగా, పండితులు సంవత్సరపు వ్యవసాయ అవకాశాలు, వర్షపాతం, రాజకీయ స్థిరత్వం మరియు సాధారణ శ్రేయస్సు గురించి అంచనాలు చేస్తారు. దేవాలయాలలో, సామాజిక హాళ్ళలో మరియు టెలివిజన్ ప్రసారాలలో పంచాంగ శ్రవణం జరుగుతుంది, ఇది కోట్లాది తెలుగు ప్రజలు అత్యంత ఆసక్తితో చూసే కార్యక్రమం.'
                : isHi
                  ? 'पंचांगम् श्रवणम् उगादि के दिन होने वाले सबसे महत्वपूर्ण अनुष्ठानों में से एक है। "श्रवणम्" का अर्थ है "सुनना" — इस समारोह में पुजारी या विद्वान नए वर्ष के पंचांग को जनसमक्ष पढ़ते हैं। इस पाठ में वर्ष के नव नायक (नौ शासक) शामिल होते हैं: राजा (राज्य प्रभु), मन्त्री, सेनाधिपति, सस्याधिपति (फसलों का स्वामी), धान्याधिपति, अर्घाधिपति (मूल्यों का स्वामी), मेघाधिपति (वर्षा का स्वामी) और रसाधिपति। इन ग्रह शासकों के आधार पर पण्डित वर्ष की कृषि, वर्षा, राजनीतिक स्थिरता और सामान्य समृद्धि के बारे में भविष्यवाणियां करते हैं। मन्दिरों, सामुदायिक भवनों और दूरदर्शन प्रसारणों में पंचांगम् श्रवणम् होता है।'
                  : 'Panchangam Sravanam is one of the most important rituals performed on Ugadi day. "Sravanam" means "listening" — in this ceremony, a priest or scholar reads out the new year\'s Panchangam (almanac) to an assembled audience. The recitation covers the Nava Nayakas (nine rulers) of the year: the King (Rajya Prabhu), Minister (Mantri), Commander-in-Chief (Senadhipati), Sasyaadhipati (lord of crops), Dhanyaadhipati (lord of grains), Arghadhipati (lord of prices), Meghadhipati (lord of rains), and Rasadhipati (lord of liquids). Each of these roles is assigned to a specific planet based on the weekday, tithi, nakshatra, and other panchanga elements of Ugadi day. Based on these planetary rulers, the scholar makes predictions about the year\'s agricultural prospects, rainfall patterns, commodity prices, political stability, and general prosperity. Panchangam Sravanam is performed in temples, community halls, and on television broadcasts, watched by tens of millions of Telugu people with keen interest. The tradition dates back centuries and remains one of the most distinctive features of Telugu New Year celebrations, distinguishing Ugadi from other Indian New Year observances.'}
            </p>
          </div>
        </section>

        {/* Calendar Characteristics */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L("calendarTitle", locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L("calendarText", locale)}
          </p>
        </section>

        {/* History & Significance (SEO long-form) */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isTe
              ? "తెలుగు పంచాంగం చరిత్ర మరియు ప్రాముఖ్యత"
              : isHi
                ? "तेलुगु पंचांगम् का इतिहास और महत्व"
                : "History & Significance of the Telugu Panchangam"}
          </h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              {isTe
                ? 'తెలుగు పంచాంగం వేద కాలం నుండి నిరంతరంగా వాడుకలో ఉన్న అత్యంత పురాతన పంచాంగ సంప్రదాయాలలో ఒకటి. ఆంధ్రప్రదేశ్ మరియు తెలంగాణలోని "సిద్ధాంతులు" అని పిలువబడే సంప్రదాయ ఖగోళ శాస్త్రవేత్తలు తరతరాలుగా పంచాంగాన్ని లెక్కించి ప్రచురిస్తున్నారు. ఈ సిద్ధాంతులు సూర్య సిద్ధాంతం మరియు ఇతర ప్రాచీన ఖగోళ శాస్త్ర గ్రంథాలపై ఆధారపడిన సంక్లిష్ట గణితాన్ని ఉపయోగించి, ప్రతి రోజు యొక్క తిథి, నక్షత్రం, యోగం, కరణం మరియు గ్రహ స్థానాలను నిర్ణయిస్తారు.'
                : isHi
                  ? 'तेलुगु पंचांगम् वैदिक काल से निरन्तर उपयोग में रहने वाली सबसे प्राचीन पंचांग परम्पराओं में से एक है। आन्ध्र प्रदेश और तेलंगाना में "सिद्धान्ती" कहे जाने वाले पारम्परिक खगोलविद् पीढ़ियों से पंचांग की गणना और प्रकाशन करते आ रहे हैं। ये सिद्धान्ती सूर्य सिद्धान्त और अन्य प्राचीन खगोलीय ग्रन्थों पर आधारित जटिल गणित का उपयोग करते हैं।'
                  : 'The Telugu Panchangam is one of the oldest continuously maintained almanac traditions in India, tracing its computational methods back to the Vedic period and classical astronomical texts like the Surya Siddhanta and the Arya Bhatiya. Traditional astronomers in Andhra Pradesh and Telangana, known as "Siddhantis," have been computing and publishing Panchangams for generations. These Siddhantis use sophisticated mathematical methods derived from classical Indian astronomy to determine the exact tithi, nakshatra, yoga, karana, and planetary positions for each day. The Telugu Panchangam is not merely a calendar — it is a comprehensive almanac that guides virtually every aspect of traditional Telugu life, from the timing of daily prayers to agricultural sowing dates, from wedding muhurtas to commercial ventures.'}
            </p>
            <p>
              {isTe
                ? 'తెలుగు పంచాంగం ప్రత్యేకమైన లక్షణాలలో ఒకటి దాని అమాంత వ్యవస్థ — నెలలు అమావాస్యతో ముగుస్తాయి, ఇది కర్ణాటక మరియు మహారాష్ట్ర పంచాంగాలతో సమానం కానీ ఉత్తర భారత పూర్ణిమాంత వ్యవస్థకు భిన్నం. దీని వల్ల కొన్ని పండుగలు ఉత్తర భారతదేశంలో భిన్నమైన నెల పేరుతో వస్తాయి — ఉదాహరణకు, తెలుగు పంచాంగంలో కార్తీక అమావాస్య (దీపావళి) ఉత్తర భారతంలో "అశ్విన అమావాస్య" అని పిలువబడుతుంది. ఈ తేడా పూర్ణిమాంత మరియు అమాంత వ్యవస్థల మధ్య అమావాస్య స్థానం భిన్నంగా ఉండటం వల్ల ఏర్పడుతుంది.'
                : isHi
                  ? 'तेलुगु पंचांगम् की अनूठी विशेषताओं में से एक इसकी अमान्त प्रणाली है — मास अमावस्या पर समाप्त होते हैं, जो कर्नाटक और महाराष्ट्र पंचांगों के समान है लेकिन उत्तर भारतीय पूर्णिमान्त प्रणाली से भिन्न है। इसके कारण कुछ त्योहार उत्तर भारत में भिन्न मास नाम से आते हैं — उदाहरणार्थ, तेलुगु पंचांगम् में कार्तिक अमावस्या (दीपावली) उत्तर भारत में "आश्विन अमावस्या" कहलाती है।'
                  : 'One of the distinctive features of the Telugu Panchangam is its Amanta system — months end on Amavasya (New Moon), which is identical to the system used in Karnataka and Maharashtra but differs from the North Indian Purnimanta system where months end on Purnima (Full Moon). This has practical consequences: some festivals fall in a differently-named month in North India versus Telugu regions. For example, Deepavali on Kartika Amavasya in the Telugu Panchangam is called "Ashwin Amavasya" in the Purnimanta system. This difference arises because the Amavasya\'s position within the month differs between the two systems, even though the actual date (and the night sky) are identical.'}
            </p>
            <p>
              {isTe
                ? "ఆధునిక కాలంలో కూడా, తెలుగు పంచాంగం లక్షలాది కుటుంబాలకు అత్యంత ముఖ్యమైనది. ప్రతి సంవత్సరం ఉగాది సమయంలో కొత్త పంచాంగం కొనడం ఒక అనివార్యమైన సంప్రదాయం. నేడు డిజిటల్ పంచాంగ అనువర్తనాలు మరియు వెబ్‌సైట్‌లు ఈ సమాచారాన్ని ప్రపంచవ్యాప్తంగా తెలుగు ప్రవాసులకు అందుబాటులో ఉంచుతున్నాయి, అయినప్పటికీ ముద్రిత పంచాంగం యొక్క అధికారం మరియు సంప్రదాయ విలువ తగ్గలేదు."
                : isHi
                  ? "आधुनिक काल में भी, तेलुगु पंचांगम् लाखों परिवारों के लिए अत्यन्त महत्वपूर्ण है। प्रतिवर्ष उगादि पर नया पंचांग खरीदना एक अनिवार्य परम्परा है। आज डिजिटल पंचांग अनुप्रयोग और वेबसाइटें यह जानकारी विश्वभर के तेलुगु प्रवासियों को उपलब्ध करा रहे हैं, फिर भी मुद्रित पंचांग का अधिकार और पारम्परिक महत्व कम नहीं हुआ है।"
                  : "Even in the modern era, the Telugu Panchangam remains indispensable for millions of households. The annual purchase of a new Panchangam around Ugadi time is a cherished tradition — families discuss the year's predictions over festive meals, and the almanac sits in a place of honour in the home. Today, digital Panchangam apps and websites make this information available to the global Telugu diaspora, yet the authority and traditional value of the printed Panchangam has not diminished. Major Panchangam publishers in Andhra Pradesh and Telangana continue to enjoy significant readership, and the annual Panchangam Sravanam ceremonies at temples draw large crowds both in person and via live television broadcasts."}
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {L("faqTitle", locale)}
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <details
                key={i}
                className="group bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden"
              >
                <summary className="cursor-pointer px-5 py-4 text-gold-light font-medium text-sm flex items-center justify-between hover:border-gold-primary/30">
                  <span>{isTe ? faq.q.te : isHi ? faq.q.hi : faq.q.en}</span>
                  <span className="ml-3 text-gold-primary/50 group-open:rotate-180 transition-transform">
                    &#x25BC;
                  </span>
                </summary>
                <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed border-t border-gold-primary/8 pt-3">
                  {isTe ? faq.a.te : isHi ? faq.a.hi : faq.a.en}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {L("relatedTitle", locale)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                href: `/${locale}/calendar/regional/tamil`,
                label: {
                  en: "Tamil Calendar (Panchangam)",
                  hi: "तमिल कैलेंडर",
                  te: "తమిళ పంచాంగం",
                },
              },
              {
                href: `/${locale}/calendar/regional/kannada`,
                label: {
                  en: "Kannada Calendar (Panchangam)",
                  hi: "कन्नड़ कैलेंडर",
                  te: "కన్నడ పంచాంగం",
                },
              },
              {
                href: `/${locale}/calendar/regional/malayalam`,
                label: {
                  en: "Malayalam Calendar (Kollavarsham)",
                  hi: "मलयालम कैलेंडर",
                  te: "మలయాళం పంచాంగం",
                },
              },
              {
                href: `/${locale}/calendar/regional/bengali`,
                label: {
                  en: "Bengali Calendar (Panjika)",
                  hi: "बंगाली कैलेंडर",
                  te: "బెంగాలీ పంచాంగం",
                },
              },
              {
                href: `/${locale}/calendar`,
                label: {
                  en: "Festival Calendar 2026",
                  hi: "त्योहार कैलेंडर 2026",
                  te: "పండుగల పంచాంగం 2026",
                },
              },
              {
                href: `/${locale}/panchang`,
                label: {
                  en: "Daily Panchangam",
                  hi: "दैनिक पंचांग",
                  te: "దైనిక పంచాంగం",
                },
              },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {isTe
                  ? link.label.te || link.label.en
                  : isHi
                    ? link.label.hi
                    : link.label.en}
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
