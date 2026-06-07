"use client";

import { useState, useMemo, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Clock,
  AlertTriangle,
  MapPin,
  ArrowLeft,
  Shield,
  ShieldAlert,
  ShieldOff,
} from "lucide-react";
import {
  nowMinutesInTimezone,
  todayInTimezone,
} from "@/lib/utils/now-in-timezone";
import GoldDivider from "@/components/ui/GoldDivider";
import { Link } from "@/lib/i18n/navigation";
import {
  calculateRahuKaal,
  calculateYamaganda,
  calculateGulikaKaal,
  formatTime,
} from "@/lib/ephem/astronomical";
import { getUTCOffsetForDate } from "@/lib/utils/timezone";
import { CITIES, type CityData } from "@/lib/constants/cities";
import { getDefaultCityForLocale } from "@/lib/constants/rashi-slugs";
import { useLocationStore } from "@/stores/location-store";
import { generateBreadcrumbLD } from "@/lib/seo/structured-data";
import type { Locale } from "@/types/panchang";
import { isDevanagariLocale } from "@/lib/utils/locale-fonts";
import { tl } from "@/lib/utils/trilingual";
import { safeJsonLd } from "@/lib/seo/safe-jsonld";

// ─── City selector list ────────────────────────────────────────
const CITY_SLUGS = [
  "delhi",
  "mumbai",
  "bangalore",
  "chennai",
  "kolkata",
  "hyderabad",
  "pune",
  "ahmedabad",
  "jaipur",
  "varanasi",
] as const;
const SELECTOR_CITIES = CITY_SLUGS.map(
  (s) => CITIES.find((c) => c.slug === s)!,
).filter(Boolean);

// ─── Labels ────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: "Panchang",
    title: "Rahu Kaal Today",
    rahuKaal: "Rahu Kaal",
    yamaganda: "Yamaganda",
    gulika: "Gulika Kaal",
    sunrise: "Sunrise",
    sunset: "Sunset",
    timeline: "Timeline",
    whatIs: "What is Rahu Kaal?",
    whatIsText:
      "Rahu Kaal (also spelled Rahu Kalam) is a period of approximately 90 minutes each day that is considered inauspicious in Vedic astrology. It is ruled by the shadow planet Rahu, one of the nine celestial bodies (Navagraha). During this time, starting new ventures, journeys, or important activities is traditionally avoided. Rahu Kaal occurs at different times each day based on the day of the week and the local sunrise/sunset times.",
    howCalc: "How is it Calculated?",
    howCalcText:
      "The day (sunrise to sunset) is divided into 8 equal parts. Each part is assigned to a planet in a fixed weekly sequence. The segment assigned to Rahu is Rahu Kaal. For example, on Monday, Rahu Kaal falls in the 2nd segment; on Saturday, it falls in the 6th. Yamaganda (ruled by Yama) and Gulika Kaal (ruled by Saturn's son Gulika) are similarly calculated from different segments of the day.",
    avoid: "Activities to Avoid During Rahu Kaal",
    avoidItems:
      "Starting a new business or venture|Signing important contracts or agreements|Beginning a journey or travel|Purchasing property or vehicles|Conducting marriage or engagement ceremonies|Starting construction of a new building|Filing legal documents|Making major financial investments",
    seeAlso: "See Also",
    inauspicious: "Inauspicious",
    caution: "Caution",
  },
  hi: {
    back: "पंचांग",
    title: "आज का राहु काल",
    rahuKaal: "राहु काल",
    yamaganda: "यमगण्ड",
    gulika: "गुलिक काल",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    timeline: "समयरेखा",
    whatIs: "राहु काल क्या है?",
    whatIsText:
      "राहु काल (राहु कालम्) प्रतिदिन लगभग 90 मिनट की एक अवधि है जिसे वैदिक ज्योतिष में अशुभ माना जाता है। यह छाया ग्रह राहु द्वारा शासित है, जो नवग्रहों में से एक है। इस समय नए कार्य, यात्रा या महत्वपूर्ण गतिविधियां शुरू करना परम्परागत रूप से वर्जित है। राहु काल प्रतिदिन सप्ताह के दिन और स्थानीय सूर्योदय/सूर्यास्त समय के आधार पर अलग-अलग समय पर होता है।",
    howCalc: "इसकी गणना कैसे होती है?",
    howCalcText:
      "दिन (सूर्योदय से सूर्यास्त) को 8 समान भागों में विभाजित किया जाता है। प्रत्येक भाग एक निश्चित साप्ताहिक क्रम में एक ग्रह को सौंपा जाता है। राहु को सौंपा गया भाग राहु काल है। यमगण्ड (यम द्वारा शासित) और गुलिक काल (शनि पुत्र गुलिक द्वारा शासित) की गणना भी इसी प्रकार दिन के अलग-अलग भागों से की जाती है।",
    avoid: "राहु काल में टालने योग्य कार्य",
    avoidItems:
      "नया व्यापार या उद्यम शुरू करना|महत्वपूर्ण अनुबंध या समझौतों पर हस्ताक्षर करना|यात्रा या सफर शुरू करना|सम्पत्ति या वाहन खरीदना|विवाह या सगाई समारोह करना|नए भवन का निर्माण शुरू करना|कानूनी दस्तावेज दाखिल करना|बड़ा वित्तीय निवेश करना",
    seeAlso: "यह भी देखें",
    inauspicious: "अशुभ",
    caution: "सावधानी",
  },
  sa: {
    back: "पञ्चाङ्गम्",
    title: "अद्य राहुकालः",
    rahuKaal: "राहुकालः",
    yamaganda: "यमगण्डः",
    gulika: "गुलिककालः",
    sunrise: "सूर्योदयः",
    sunset: "सूर्यास्तः",
    timeline: "समयरेखा",
    whatIs: "राहुकालः किम्?",
    whatIsText:
      "राहुकालः प्रतिदिनं प्रायः नवतिनिमेषाणां कालखण्डमस्ति यत् वैदिकज्योतिषे अशुभं मन्यते। एषः छायाग्रहेण राहुणा शासितः, यः नवग्रहेषु अन्यतमः। अस्मिन् काले नवकार्याणां यात्रायाः महत्त्वपूर्णकार्याणां वा आरम्भः परम्परया वर्जितः।",
    howCalc: "गणना कथं भवति?",
    howCalcText:
      "दिनं (सूर्योदयात् सूर्यास्तपर्यन्तम्) अष्टसमभागेषु विभज्यते। प्रत्येकं भागः निश्चितसाप्ताहिकक्रमेण एकस्मै ग्रहाय दीयते। राहवे दत्तं खण्डं राहुकालः। यमगण्डः गुलिककालश्च एवमेव दिनस्य भिन्नखण्डेभ्यः गण्यन्ते।",
    avoid: "राहुकाले वर्जनीयानि कार्याणि",
    avoidItems:
      "नवव्यापारस्य आरम्भः|महत्त्वपूर्णानुबन्धेषु हस्ताक्षरम्|यात्रायाः आरम्भः|सम्पत्तेः वाहनस्य वा क्रयणम्|विवाहसगाईसमारोहः|नवभवनस्य निर्माणारम्भः|विधिदस्तावेजदाखिला|वृहद्वित्तीयनिवेशः",
    seeAlso: "एतदपि पश्यतु",
    inauspicious: "अशुभम्",
    caution: "सावधानता",
  },
  mai: {
    back: "पंचांग",
    title: "आइ-क राहु काल",
    rahuKaal: "राहु काल",
    yamaganda: "यमगंड",
    gulika: "गुलिक काल",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    timeline: "समयरेखा",
    whatIs: "राहु काल की अछि?",
    whatIsText:
      "राहु काल (राहु कलाम सेहो कहल जाइत अछि) वैदिक ज्योतिष मे लगभग ९० मिनटक एकटा अवधि अछि जेकरा अशुभ मानल जाइत अछि। ई छाया ग्रह राहु द्वारा शासित अछि, जे नवग्रह मे सँ एकटा अछि। एहि समय मे नवका काज, यात्रा, वा महत्वपूर्ण गतिविधि शुरू करबा सँ पारंपरिक रूप सँ बचल जाइत अछि। राहु काल सप्ताहक दिन आ स्थानीय सूर्योदय/सूर्यास्तक समयक आधार पर प्रति दिन भिन्न-भिन्न समय पर होइत अछि।",
    howCalc: "ई केना गणना कएल जाइत अछि?",
    howCalcText:
      "दिन (सूर्योदय सँ सूर्यास्त धरि) कें ८ बराबर भाग मे बाँटल जाइत अछि। प्रत्येक भाग कें एकटा निश्चित साप्ताहिक क्रम मे एकटा ग्रह कें देल जाइत अछि। राहु कें देल गेल खंड राहु काल अछि। उदाहरणक लेल, सोमवार कें, राहु काल दोसर खंड मे पड़ैत अछि; शनिवार कें, ई छठम मे पड़ैत अछि। यमगंड (यम द्वारा शासित) आ गुलिक काल (शनि कें पुत्र गुलिक द्वारा शासित) कें सेहो दिनक विभिन्न खंड सँ एहिना गणना कएल जाइत अछि।",
    avoid: "राहु कालक समय करबा सँ बचबा योग्य गतिविधि",
    avoidItems:
      "नवका व्यवसाय वा उद्यम शुरू करब|महत्वपूर्ण अनुबंध वा समझौता पर हस्ताक्षर करब|यात्रा शुरू करब|संपत्ति वा वाहन खरीदब|विवाह वा सगाई समारोह आयोजित करब|नवका भवनक निर्माण शुरू करब|कानूनी दस्तावेज दाखिल करब|पैघ वित्तीय निवेश करब",
    seeAlso: "ई सेहो देखू",
    inauspicious: "अशुभ",
    caution: "सावधानी",
  },
  mr: {
    back: "पंचांग",
    title: "आजचा राहुकाळ",
    rahuKaal: "राहुकाळ",
    yamaganda: "यमगंड",
    gulika: "गुलिक काळ",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    timeline: "वेळेची नोंद",
    whatIs: "राहुकाळ म्हणजे काय?",
    whatIsText:
      "राहुकाळ (राहुकालम असेही लिहिले जाते) हा वैदिक ज्योतिषानुसार दररोज सुमारे ९० मिनिटांचा एक असा कालावधी आहे जो अशुभ मानला जातो. हा छाया ग्रह राहू द्वारे शासित असतो, जो नवग्रहांपैकी एक आहे. या काळात नवीन उपक्रम, प्रवास किंवा महत्त्वाची कामे सुरू करणे पारंपारिकपणे टाळले जाते. राहुकाळ दररोज आठवड्याच्या दिवसानुसार आणि स्थानिक सूर्योदय/सूर्यास्ताच्या वेळेनुसार वेगवेगळ्या वेळी येतो.",
    howCalc: "तो कसा मोजला जातो?",
    howCalcText:
      "दिवस (सूर्योदयापासून सूर्यास्तापर्यंत) ८ समान भागांमध्ये विभागला जातो. प्रत्येक भाग एका निश्चित साप्ताहिक क्रमाने ग्रहाला दिला जातो. राहूला दिलेला भाग राहुकाळ असतो. उदाहरणार्थ, सोमवारी, राहुकाळ दुसऱ्या भागात येतो; शनिवारी, तो सहाव्या भागात येतो. यमगंड (यमाद्वारे शासित) आणि गुलिक काळ (शनिचा पुत्र गुलिक द्वारे शासित) दिवसाच्या वेगवेगळ्या भागांमधून याचप्रमाणे मोजले जातात.",
    avoid: "राहुकाळात टाळायची कामे",
    avoidItems:
      "नवीन व्यवसाय किंवा उपक्रम सुरू करणे|महत्वाचे करार किंवा समझोते करणे|प्रवास सुरू करणे|मालमत्ता किंवा वाहने खरेदी करणे|विवाह किंवा साखरपुड्याचे समारंभ आयोजित करणे|नवीन इमारतीचे बांधकाम सुरू करणे|कायदेशीर कागदपत्रे दाखल करणे|मोठ्या आर्थिक गुंतवणुकी करणे",
    seeAlso: "हे देखील पहा",
    inauspicious: "अशुभ",
    caution: "सावधगिरी",
  },
  ta: {
    back: "பஞ்சாங்கம்",
    title: "இன்றைய ராகு காலம்",
    rahuKaal: "ராகு காலம்",
    yamaganda: "எமகண்டம்",
    gulika: "குளிக காலம்",
    sunrise: "சூரிய உதயம்",
    sunset: "சூரிய அஸ்தமனம்",
    timeline: "காலவரிசை",
    whatIs: "ராகு காலம் என்றால் என்ன?",
    whatIsText:
      "ராகு காலம் (ராகு காலமும் என்று உச்சரிக்கப்படுகிறது) என்பது வேத ஜோதிடத்தின்படி ஒவ்வொரு நாளும் சுமார் 90 நிமிடங்கள் நீடிக்கும் ஒரு காலப்பகுதியாகும், இது அசுபமானதாகக் கருதப்படுகிறது. இது நிழல் கிரகமான ராகுவால் ஆளப்படுகிறது, இது ஒன்பது வான உடல்களில் (நவக்கிரகம்) ஒன்றாகும். இந்தக் காலத்தில், புதிய முயற்சிகள், பயணங்கள் அல்லது முக்கியமான செயல்பாடுகளைத் தொடங்குவது பாரம்பரியமாகத் தவிர்க்கப்படுகிறது. வாரத்தின் நாள் மற்றும் உள்ளூர் சூரிய உதயம்/அஸ்தமன நேரங்களின் அடிப்படையில் ராகு காலம் ஒவ்வொரு நாளும் வெவ்வேறு நேரங்களில் நிகழ்கிறது.",
    howCalc: "இது எப்படி கணக்கிடப்படுகிறது?",
    howCalcText:
      "ஒரு நாள் (சூரிய உதயம் முதல் சூரிய அஸ்தமனம் வரை) 8 சம பாகங்களாகப் பிரிக்கப்படுகிறது. ஒவ்வொரு பாகமும் ஒரு குறிப்பிட்ட வார வரிசையில் ஒரு கிரகத்திற்கு ஒதுக்கப்படுகிறது. ராகுவுக்கு ஒதுக்கப்பட்ட பகுதி ராகு காலம் ஆகும். உதாரணமாக, திங்கட்கிழமை, ராகு காலம் 2வது பகுதியில் வருகிறது; சனிக்கிழமை, அது 6வது பகுதியில் வருகிறது. எமகண்டம் (எமனால் ஆளப்படுகிறது) மற்றும் குளிக காலம் (சனியின் மகன் குளிகனால் ஆளப்படுகிறது) ஆகியவை நாளின் வெவ்வேறு பகுதிகளிலிருந்து இதேபோல் கணக்கிடப்படுகின்றன.",
    avoid: "ராகு காலத்தில் தவிர்க்க வேண்டிய செயல்கள்",
    avoidItems:
      "புதிய வணிகம் அல்லது முயற்சியைத் தொடங்குதல்|முக்கியமான ஒப்பந்தங்கள் அல்லது உடன்படிக்கைகளில் கையெழுத்திடுதல்|பயணம் அல்லது பயணத்தைத் தொடங்குதல்|சொத்து அல்லது வாகனங்களை வாங்குதல்|திருமணம் அல்லது நிச்சயதார்த்த சடங்குகளை நடத்துதல்|புதிய கட்டிடத்தின் கட்டுமானத்தைத் தொடங்குதல்|சட்ட ஆவணங்களைத் தாக்கல் செய்தல்|முக்கிய நிதி முதலீடுகளைச் செய்தல்",
    seeAlso: "மேலும் காண்க",
    inauspicious: "அசுபமான",
    caution: "எச்சரிக்கை",
  },
  te: {
    back: "పంచాంగం",
    title: "నేటి రాహుకాలం",
    rahuKaal: "రాహుకాలం",
    yamaganda: "యమగండం",
    gulika: "గుళిక కాలం",
    sunrise: "సూర్యోదయం",
    sunset: "సూర్యాస్తమయం",
    timeline: "కాలక్రమం",
    whatIs: "రాహుకాలం అంటే ఏమిటి?",
    whatIsText:
      "రాహుకాలం (రాహు కాలం అని కూడా అంటారు) అనేది వేద జ్యోతిషశాస్త్రంలో ప్రతిరోజూ సుమారు 90 నిమిషాల కాలం, ఇది అశుభకరమైనదిగా పరిగణించబడుతుంది. ఇది ఛాయా గ్రహమైన రాహువుచే పాలించబడుతుంది, ఇది నవగ్రహాలలో ఒకటి. ఈ సమయంలో, కొత్త వ్యాపారాలు, ప్రయాణాలు లేదా ముఖ్యమైన కార్యకలాపాలను ప్రారంభించడం సాంప్రదాయకంగా నివారించబడుతుంది. రాహుకాలం వారంలోని రోజు మరియు స్థానిక సూర్యోదయం/సూర్యాస్తమయ సమయాల ఆధారంగా ప్రతిరోజూ వేర్వేరు సమయాల్లో వస్తుంది.",
    howCalc: "ఇది ఎలా లెక్కించబడుతుంది?",
    howCalcText:
      "రోజు (సూర్యోదయం నుండి సూర్యాస్తమయం వరకు) 8 సమాన భాగాలుగా విభజించబడింది. ప్రతి భాగాన్ని ఒక నిర్దిష్ట వారపు క్రమంలో ఒక గ్రహానికి కేటాయిస్తారు. రాహువుకు కేటాయించిన భాగం రాహుకాలం. ఉదాహరణకు, సోమవారం, రాహుకాలం 2వ భాగంలో వస్తుంది; శనివారం, అది 6వ భాగంలో వస్తుంది. యమగండం (యమునిచే పాలించబడుతుంది) మరియు గుళిక కాలం (శని కుమారుడు గుళికచే పాలించబడుతుంది) కూడా రోజులోని వివిధ భాగాల నుండి ఇదే విధంగా లెక్కించబడతాయి.",
    avoid: "రాహుకాలంలో నివారించాల్సిన కార్యకలాపాలు",
    avoidItems:
      "కొత్త వ్యాపారం లేదా వెంచర్‌ను ప్రారంభించడం|ముఖ్యమైన ఒప్పందాలు లేదా అంగీకార పత్రాలపై సంతకం చేయడం|ప్రయాణం లేదా యాత్రను ప్రారంభించడం|ఆస్తి లేదా వాహనాలను కొనుగోలు చేయడం|వివాహం లేదా నిశ్చితార్థ వేడుకలను నిర్వహించడం|కొత్త భవనం నిర్మాణాన్ని ప్రారంభించడం|చట్టపరమైన పత్రాలను దాఖలు చేయడం|ప్రధాన ఆర్థిక పెట్టుబడులు పెట్టడం",
    seeAlso: "ఇవి కూడా చూడండి",
    inauspicious: "అశుభకరమైన",
    caution: "జాగ్రత్త",
  },
  bn: {
    back: "পঞ্জিকা",
    title: "আজকের রাহু কাল",
    rahuKaal: "রাহু কাল",
    yamaganda: "যমগণ্ড",
    gulika: "গুলিক কাল",
    sunrise: "সূর্যোদয়",
    sunset: "সূর্যাস্ত",
    timeline: "সময়রেখা",
    whatIs: "রাহু কাল কী?",
    whatIsText:
      "রাহু কাল (রাহু কালাম নামেও পরিচিত) হল বৈদিক জ্যোতিষশাস্ত্র অনুসারে প্রতিদিন প্রায় ৯০ মিনিটের একটি সময়কাল যা অশুভ বলে বিবেচিত হয়। এটি ছায়া গ্রহ রাহু দ্বারা শাসিত হয়, যা নবগ্রহের মধ্যে একটি। এই সময়ে, নতুন উদ্যোগ, যাত্রা বা গুরুত্বপূর্ণ কার্যকলাপ শুরু করা ঐতিহ্যগতভাবে এড়ানো হয়। রাহু কাল সপ্তাহের দিন এবং স্থানীয় সূর্যোদয়/সূর্যাস্তের সময়ের উপর ভিত্তি করে প্রতিদিন বিভিন্ন সময়ে ঘটে।",
    howCalc: "এটি কিভাবে গণনা করা হয়?",
    howCalcText:
      "দিন (সূর্যোদয় থেকে সূর্যাস্ত পর্যন্ত) ৮টি সমান ভাগে বিভক্ত। প্রতিটি ভাগ একটি নির্দিষ্ট সাপ্তাহিক ক্রমে একটি গ্রহকে বরাদ্দ করা হয়। রাহুকে বরাদ্দ করা অংশটি রাহু কাল। উদাহরণস্বরূপ, সোমবার, রাহু কাল ২য় ভাগে পড়ে; শনিবার, এটি ৬ষ্ঠ ভাগে পড়ে। যমগণ্ড (যম দ্বারা শাসিত) এবং গুলিক কাল (শনির পুত্র গুলিক দ্বারা শাসিত) দিনের বিভিন্ন অংশ থেকে একইভাবে গণনা করা হয়।",
    avoid: "রাহু কালের সময় এড়ানোর জন্য কার্যকলাপ",
    avoidItems:
      "নতুন ব্যবসা বা উদ্যোগ শুরু করা|গুরুত্বপূর্ণ চুক্তি বা চুক্তিতে স্বাক্ষর করা|যাত্রা বা ভ্রমণ শুরু করা|সম্পত্তি বা যানবাহন ক্রয় করা|বিবাহ বা বাগদান অনুষ্ঠান পরিচালনা করা|নতুন ভবন নির্মাণ শুরু করা|আইনি নথি দাখিল করা|বড় আর্থিক বিনিয়োগ করা",
    seeAlso: "আরও দেখুন",
    inauspicious: "অশুভ",
    caution: "সতর্কতা",
  },
  gu: {
    back: "પંચાંગ",
    title: "આજનો રાહુ કાળ",
    rahuKaal: "રાહુ કાળ",
    yamaganda: "યમગંડ",
    gulika: "ગુલિક કાળ",
    sunrise: "સૂર્યોદય",
    sunset: "સૂર્યાસ્ત",
    timeline: "સમયરેખા",
    whatIs: "રાહુ કાળ શું છે?",
    whatIsText:
      "રાહુ કાળ (રાહુ કાલમ તરીકે પણ ઓળખાય છે) એ વૈદિક જ્યોતિષશાસ્ત્રમાં દરરોજ આશરે 90 મિનિટનો સમયગાળો છે જેને અશુભ માનવામાં આવે છે. તે છાયા ગ્રહ રાહુ દ્વારા શાસિત છે, જે નવગ્રહોમાંનો એક છે. આ સમય દરમિયાન, નવા સાહસો, યાત્રાઓ અથવા મહત્વપૂર્ણ પ્રવૃત્તિઓ શરૂ કરવાનું પરંપરાગત રીતે ટાળવામાં આવે છે. રાહુ કાળ અઠવાડિયાના દિવસ અને સ્થાનિક સૂર્યોદય/સૂર્યાસ્તના સમયના આધારે દરરોજ અલગ-અલગ સમયે થાય છે.",
    howCalc: "તેની ગણતરી કેવી રીતે થાય છે?",
    howCalcText:
      "દિવસ (સૂર્યોદયથી સૂર્યાસ્ત સુધી) ને 8 સમાન ભાગોમાં વિભાજિત કરવામાં આવે છે. દરેક ભાગને નિશ્ચિત સાપ્તાહિક ક્રમમાં એક ગ્રહને સોંપવામાં આવે છે. રાહુને સોંપેલ ભાગ રાહુ કાળ છે. ઉદાહરણ તરીકે, સોમવારે, રાહુ કાળ 2જા ભાગમાં આવે છે; શનિવારે, તે 6ઠ્ઠા ભાગમાં આવે છે. યમગંડ (યમ દ્વારા શાસિત) અને ગુલિક કાળ (શનિના પુત્ર ગુલિક દ્વારા શાસિત) ની ગણતરી પણ દિવસના જુદા જુદા ભાગોમાંથી આ જ રીતે કરવામાં આવે છે.",
    avoid: "રાહુ કાળ દરમિયાન ટાળવા જેવી પ્રવૃત્તિઓ",
    avoidItems:
      "નવો વ્યવસાય અથવા સાહસ શરૂ કરવું|મહત્વપૂર્ણ કરારો અથવા કરારો પર હસ્તાક્ષર કરવા|યાત્રા અથવા પ્રવાસ શરૂ કરવો|સંપત્તિ અથવા વાહનો ખરીદવા|લગ્ન અથવા સગાઈ સમારોહનું આયોજન કરવું|નવી ઇમારતનું બાંધકામ શરૂ કરવું|કાનૂની દસ્તાવેજો દાખલ કરવા|મોટા નાણાકીય રોકાણો કરવા",
    seeAlso: "આ પણ જુઓ",
    inauspicious: "અશુભ",
    caution: "સાવચેતી",
  },
  kn: {
    back: "ಪಂಚಾಂಗ",
    title: "ಇಂದಿನ ರಾಹು ಕಾಲ",
    rahuKaal: "ರಾಹು ಕಾಲ",
    yamaganda: "ಯಮಗಂಡ",
    gulika: "ಗುಳಿಕ ಕಾಲ",
    sunrise: "ಸೂರ್ಯೋದಯ",
    sunset: "ಸೂರ್ಯಾಸ್ತ",
    timeline: "ಕಾಲರೇಖೆ",
    whatIs: "ರಾಹು ಕಾಲ ಎಂದರೇನು?",
    whatIsText:
      "ರಾಹು ಕಾಲ (ರಾಹು ಕಾಲಂ ಎಂದೂ ಉಚ್ಚರಿಸಲಾಗುತ್ತದೆ) ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ ಪ್ರತಿದಿನ ಸುಮಾರು 90 ನಿಮಿಷಗಳ ಅವಧಿಯಾಗಿದ್ದು, ಇದನ್ನು ಅಶುಭವೆಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ. ಇದು ಛಾಯಾ ಗ್ರಹ ರಾಹುವಿನಿಂದ ಆಳಲ್ಪಡುತ್ತದೆ, ಇದು ನವಗ್ರಹಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ. ಈ ಸಮಯದಲ್ಲಿ, ಹೊಸ ಉದ್ಯಮಗಳು, ಪ್ರಯಾಣಗಳು ಅಥವಾ ಪ್ರಮುಖ ಚಟುವಟಿಕೆಗಳನ್ನು ಪ್ರಾರಂಭಿಸುವುದನ್ನು ಸಾಂಪ್ರದಾಯಿಕವಾಗಿ ತಪ್ಪಿಸಲಾಗುತ್ತದೆ. ರಾಹು ಕಾಲವು ವಾರದ ದಿನ ಮತ್ತು ಸ್ಥಳೀಯ ಸೂರ್ಯೋದಯ/ಸೂರ್ಯಾಸ್ತದ ಸಮಯಗಳ ಆಧಾರದ ಮೇಲೆ ಪ್ರತಿದಿನ ವಿಭಿನ್ನ ಸಮಯಗಳಲ್ಲಿ ಸಂಭವಿಸುತ್ತದೆ.",
    howCalc: "ಇದನ್ನು ಹೇಗೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ?",
    howCalcText:
      "ದಿನವನ್ನು (ಸೂರ್ಯೋದಯದಿಂದ ಸೂರ್ಯಾಸ್ತದವರೆಗೆ) 8 ಸಮಾನ ಭಾಗಗಳಾಗಿ ವಿಂಗಡಿಸಲಾಗಿದೆ. ಪ್ರತಿ ಭಾಗವನ್ನು ನಿಗದಿತ ಸಾಪ್ತಾಹಿಕ ಅನುಕ್ರಮದಲ್ಲಿ ಒಂದು ಗ್ರಹಕ್ಕೆ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ. ರಾಹುವಿಗೆ ನಿಗದಿಪಡಿಸಿದ ಭಾಗವೇ ರಾಹು ಕಾಲ. ಉದಾಹರಣೆಗೆ, ಸೋಮವಾರದಂದು, ರಾಹು ಕಾಲವು 2ನೇ ಭಾಗದಲ್ಲಿ ಬರುತ್ತದೆ; ಶನಿವಾರದಂದು, ಅದು 6ನೇ ಭಾಗದಲ್ಲಿ ಬರುತ್ತದೆ. ಯಮಗಂಡ (ಯಮನಿಂದ ಆಳಲ್ಪಡುತ್ತದೆ) ಮತ್ತು ಗುಳಿಕ ಕಾಲ (ಶನಿಯ ಮಗ ಗುಳಿಕನಿಂದ ಆಳಲ್ಪಡುತ್ತದೆ) ದಿನದ ವಿವಿಧ ಭಾಗಗಳಿಂದ ಇದೇ ರೀತಿ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.",
    avoid: "ರಾಹು ಕಾಲದಲ್ಲಿ ತಪ್ಪಿಸಬೇಕಾದ ಚಟುವಟಿಕೆಗಳು",
    avoidItems:
      "ಹೊಸ ವ್ಯಾಪಾರ ಅಥವಾ ಉದ್ಯಮವನ್ನು ಪ್ರಾರಂಭಿಸುವುದು|ಪ್ರಮುಖ ಒಪ್ಪಂದಗಳು ಅಥವಾ ಒಪ್ಪಂದಗಳಿಗೆ ಸಹಿ ಹಾಕುವುದು|ಪ್ರಯಾಣ ಅಥವಾ ಪ್ರವಾಸವನ್ನು ಪ್ರಾರಂಭಿಸುವುದು|ಆಸ್ತಿ ಅಥವಾ ವಾಹನಗಳನ್ನು ಖರೀದಿಸುವುದು|ಮದುವೆ ಅಥವಾ ನಿಶ್ಚಿತಾರ್ಥ ಸಮಾರಂಭಗಳನ್ನು ನಡೆಸುವುದು|ಹೊಸ ಕಟ್ಟಡದ ನಿರ್ಮಾಣವನ್ನು ಪ್ರಾರಂಭಿಸುವುದು|ಕಾನೂನು ದಾಖಲೆಗಳನ್ನು ಸಲ್ಲಿಸುವುದು|ಪ್ರಮುಖ ಆರ್ಥಿಕ ಹೂಡಿಕೆಗಳನ್ನು ಮಾಡುವುದು",
    seeAlso: "ಇದನ್ನೂ ನೋಡಿ",
    inauspicious: "ಅಶುಭ",
    caution: "ಎಚ್ಚರಿಕೆ",
  },
};

// ─── Animation variants ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

// ─── Helpers ───────────────────────────────────────────────────
function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function RahuKaalClient() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: "var(--font-devanagari-heading)" }
    : { fontFamily: "var(--font-heading)" };
  const L = LABELS[locale] || LABELS.en;

  // Default to user's current location if available, otherwise fall back to locale-based city
  const locationStore = useLocationStore();
  const initialCity = (): CityData => {
    if (locationStore.lat !== null && locationStore.lng !== null) {
      return {
        slug: "current",
        name: {
          en: locationStore.name || "Current Location",
          hi: locationStore.name || "वर्तमान स्थान",
          sa: locationStore.name || "वर्तमानस्थानम्",
        },
        lat: locationStore.lat,
        lng: locationStore.lng,
        timezone:
          locationStore.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone ||
          "UTC",
      };
    }
    return getDefaultCityForLocale(locale) || SELECTOR_CITIES[0];
  };
  const [selectedCity, setSelectedCity] = useState<CityData>(initialCity);

  // Track current time in the LOCATION's timezone for NOW highlighting
  const [nowMin, setNowMin] = useState(() =>
    nowMinutesInTimezone(selectedCity.timezone),
  );
  useEffect(() => {
    setNowMin(nowMinutesInTimezone(selectedCity.timezone));
    const iv = setInterval(
      () => setNowMin(nowMinutesInTimezone(selectedCity.timezone)),
      60_000,
    );
    return () => clearInterval(iv);
  }, [selectedCity.timezone]);

  // Round 2 TZ-7 — read "today" in the selected city's timezone, not the
  // browser's. A user in Geneva at 23:30 viewing Delhi panchang would
  // otherwise see the previous Geneva day's panchang for Delhi (which is
  // already next-day in Delhi). The helper already exists for this exact
  // case. (Gemini #162 — single-line destructure for consistency with
  // panchak/chandra-darshan.)
  const [year, month, day] = todayInTimezone(selectedCity.timezone)
    .split("-")
    .map(Number);

  // Sunrise/sunset via /api/sunrise — same server-Swiss path as the
  // gauri-panchang, choghadiya, and hora consumers. Avoids the
  // in-browser Meeus fallback that drifts ~30s from server output
  // and would otherwise misalign with any SEO copy server-rendered
  // for this surface. `null` is the polar non-rise signal — surface a
  // banner via sunError; never fabricate a fallback.
  type SunData = { sunriseUT: number; sunsetUT: number } | null;
  const [sunData, setSunData] = useState<SunData>(null);
  const [sunError, setSunError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const url =
      `/api/sunrise?date=${date}` +
      `&lat=${selectedCity.lat}&lng=${selectedCity.lng}` +
      `&timezone=${encodeURIComponent(selectedCity.timezone)}`;
    setSunError(null);
    fetch(url)
      .then((r) => r.json())
      .then((body) => {
        if (cancelled) return;
        if (
          typeof body.sunriseUT !== "number" ||
          typeof body.sunsetUT !== "number"
        ) {
          setSunData(null);
          setSunError("Sunrise/sunset unavailable for this location and date.");
          return;
        }
        // East-of-UTC cities (Delhi etc.) have sunriseUT on the previous
        // UT day (~23.88) and sunsetUT on the current UT day (~13.77).
        // Unwrap so dayDuration = sunsetUT - sunriseUT stays positive,
        // mirroring the in-engine fix at panchang-calc.ts:1129.
        const sunriseUT = body.sunriseUT;
        let sunsetUT = body.sunsetUT;
        if (sunsetUT < sunriseUT) sunsetUT += 24;
        setSunData({ sunriseUT, sunsetUT });
      })
      .catch((err: unknown) => {
        console.error("[rahu-kaal] /api/sunrise failed:", err);
        if (!cancelled) setSunError("Could not fetch sunrise/sunset.");
      });
    return () => {
      cancelled = true;
    };
  }, [
    year,
    month,
    day,
    selectedCity.lat,
    selectedCity.lng,
    selectedCity.timezone,
  ]);

  // Derive the data the UI consumes — sunrise / sunset display strings
  // and the three inauspicious 1/8-day periods — from the API response.
  // While sunData is null (first paint / cold fetch / fetch error) we
  // hand back a stable empty-string skeleton so the time-axis math
  // below short-circuits to zero-width segments and the page paints
  // without throwing.
  const panchang = useMemo(() => {
    const empty = {
      sunrise: "",
      sunset: "",
      rahuKaal: { start: "", end: "" },
      yamaganda: { start: "", end: "" },
      gulikaKaal: { start: "", end: "" },
    };
    if (!sunData) return empty;
    const tzOffset = getUTCOffsetForDate(
      year,
      month,
      day,
      selectedCity.timezone,
    );
    // Weekday in JD convention (0=Sun..6=Sat) — see CLAUDE.md Lesson O.
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    const rk = calculateRahuKaal(sunData.sunriseUT, sunData.sunsetUT, weekday);
    const ym = calculateYamaganda(sunData.sunriseUT, sunData.sunsetUT, weekday);
    const gk = calculateGulikaKaal(
      sunData.sunriseUT,
      sunData.sunsetUT,
      weekday,
    );
    return {
      sunrise: formatTime(sunData.sunriseUT, tzOffset),
      sunset: formatTime(sunData.sunsetUT, tzOffset),
      rahuKaal: {
        start: formatTime(rk.start, tzOffset),
        end: formatTime(rk.end, tzOffset),
      },
      yamaganda: {
        start: formatTime(ym.start, tzOffset),
        end: formatTime(ym.end, tzOffset),
      },
      gulikaKaal: {
        start: formatTime(gk.start, tzOffset),
        end: formatTime(gk.end, tzOffset),
      },
    };
  }, [sunData, year, month, day, selectedCity.timezone]);

  // Date formatting
  const dateStr = useMemo(() => {
    const d = new Date(year, month - 1, day);
    const LOCALE_MAP: Record<string, string> = {
      en: "en-IN",
      hi: "hi-IN",
      sa: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      bn: "bn-IN",
      kn: "kn-IN",
      gu: "gu-IN",
      mai: "hi-IN",
      mr: "mr-IN",
    };
    const loc = LOCALE_MAP[locale] || "en-IN";
    return d.toLocaleDateString(loc, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [year, month, day, locale]);

  // Timeline calculation
  const sunriseMin = timeToMinutes(panchang.sunrise);
  const sunsetMin = timeToMinutes(panchang.sunset);
  const dayDuration = sunsetMin - sunriseMin;

  const timeCards = [
    {
      label: L.rahuKaal,
      start: panchang.rahuKaal.start,
      end: panchang.rahuKaal.end,
      icon: ShieldOff,
      colorClass: "bg-red-500/10 border-red-500/30",
      textColor: "text-red-400",
      badgeColor: "bg-red-500/20 text-red-300",
      badgeText: L.inauspicious,
    },
    {
      label: L.yamaganda,
      start: panchang.yamaganda.start,
      end: panchang.yamaganda.end,
      icon: ShieldAlert,
      colorClass: "bg-amber-500/10 border-amber-500/30",
      textColor: "text-amber-400",
      badgeColor: "bg-amber-500/20 text-amber-300",
      badgeText: L.caution,
    },
    {
      label: L.gulika,
      start: panchang.gulikaKaal.start,
      end: panchang.gulikaKaal.end,
      icon: Shield,
      colorClass: "bg-orange-500/10 border-orange-500/30",
      textColor: "text-orange-400",
      badgeColor: "bg-orange-500/20 text-orange-300",
      badgeText: L.caution,
    },
  ];

  // Timeline segments for Rahu Kaal, Yamaganda, Gulika
  const segments = [
    {
      start: panchang.rahuKaal.start,
      end: panchang.rahuKaal.end,
      color: "bg-red-500/60",
      label: L.rahuKaal,
    },
    {
      start: panchang.yamaganda.start,
      end: panchang.yamaganda.end,
      color: "bg-amber-500/50",
      label: L.yamaganda,
    },
    {
      start: panchang.gulikaKaal.start,
      end: panchang.gulikaKaal.end,
      color: "bg-orange-500/50",
      label: L.gulika,
    },
  ];

  const avoidItems = L.avoidItems.split("|");

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(generateBreadcrumbLD("/rahu-kaal", locale)),
          }}
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
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="mb-8"
        >
          <h1
            className="text-3xl sm:text-4xl font-bold text-gold-light mb-2"
            style={headingFont}
          >
            {L.title}
          </h1>
          <p className="text-text-secondary text-lg">{dateStr}</p>
          <p
            className="text-text-secondary flex items-center gap-1.5 mt-1"
            suppressHydrationWarning
          >
            <MapPin size={14} className="text-gold-primary" />
            {tl(selectedCity.name, locale)}
          </p>
        </motion.div>

        {/* City selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" as const }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {SELECTOR_CITIES.map((city) => (
            <button
              key={city.slug}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedCity.slug === city.slug
                  ? "bg-gold-primary/20 border border-gold-primary text-gold-light"
                  : "bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-secondary hover:border-gold-primary/40 hover:text-text-primary"
              }`}
            >
              {tl(city.name, locale)}
            </button>
          ))}
        </motion.div>

        {/* Time cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {timeCards.map((card, i) => {
            const Icon = card.icon;
            const startMin = timeToMinutes(card.start);
            const endMin = timeToMinutes(card.end);
            // Midnight-wrapping comparison (Lesson R)
            const isActive =
              endMin < startMin
                ? nowMin >= startMin || nowMin < endMin
                : nowMin >= startMin && nowMin < endMin;
            return (
              <motion.div
                key={card.label}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className={`rounded-xl border p-5 ${card.colorClass} ${isActive ? "ring-2 ring-gold-primary/60" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon size={20} className={card.textColor} />
                    <h2
                      className={`font-semibold ${card.textColor}`}
                      style={headingFont}
                    >
                      {card.label}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/30 text-gold-light font-bold animate-pulse"
                        suppressHydrationWarning
                      >
                        NOW
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${card.badgeColor}`}
                    >
                      {card.badgeText}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-text-primary tracking-wide">
                  {card.start} – {card.end}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Visual timeline */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-white/10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mb-8"
        >
          <h2 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2">
            <Clock size={14} className="text-gold-primary" />
            {L.timeline} &mdash; {panchang.sunrise} ({L.sunrise}) &rarr;{" "}
            {panchang.sunset} ({L.sunset})
          </h2>
          <div className="relative h-8 rounded-full bg-white/5 overflow-hidden">
            {segments.map((seg) => {
              const startMin = timeToMinutes(seg.start);
              const endMin = timeToMinutes(seg.end);
              const leftPct = ((startMin - sunriseMin) / dayDuration) * 100;
              const widthPct = ((endMin - startMin) / dayDuration) * 100;
              return (
                <div
                  key={seg.label}
                  className={`absolute top-0 h-full ${seg.color} rounded-sm`}
                  style={{
                    left: `${Math.max(0, leftPct)}%`,
                    width: `${Math.min(widthPct, 100 - leftPct)}%`,
                  }}
                  title={`${seg.label}: ${seg.start}  –  ${seg.end}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>{panchang.sunrise}</span>
            <span>{panchang.sunset}</span>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-3">
            {segments.map((seg) => (
              <div
                key={seg.label}
                className="flex items-center gap-1.5 text-xs text-text-secondary"
              >
                <span
                  className={`inline-block w-3 h-3 rounded-sm ${seg.color}`}
                />
                {seg.label}
              </div>
            ))}
          </div>
        </motion.div>

        <GoldDivider />

        {/* Educational section */}
        <motion.section
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="space-y-8 mt-4"
        >
          {/* What is Rahu Kaal */}
          <div>
            <h2
              className="text-xl font-bold text-gold-light mb-3"
              style={headingFont}
            >
              {L.whatIs}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
          </div>

          {/* How calculated */}
          <div>
            <h2
              className="text-xl font-bold text-gold-light mb-3"
              style={headingFont}
            >
              {L.howCalc}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.howCalcText}</p>
          </div>

          {/* Activities to avoid */}
          <div>
            <h2
              className="text-xl font-bold text-gold-light mb-3"
              style={headingFont}
            >
              <AlertTriangle
                size={18}
                className="inline-block mr-2 text-red-400 -mt-0.5"
              />
              {L.avoid}
            </h2>
            <ul className="space-y-2 ml-1">
              {avoidItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-text-primary"
                >
                  <span className="text-red-400 mt-1.5 flex-shrink-0">
                    &#8226;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        <GoldDivider className="mt-8" />

        {/* See Also */}
        <motion.section
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 mb-12"
        >
          <h2
            className="text-lg font-bold text-gold-light mb-4"
            style={headingFont}
          >
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
