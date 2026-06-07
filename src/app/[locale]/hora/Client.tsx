"use client";

import { useState, useMemo, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, Sparkles, Timer, CalendarDays } from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";
import RelatedLinks from "@/components/ui/RelatedLinks";
import { getLearnLinksForTool } from "@/lib/seo/cross-links";
import { Link } from "@/lib/i18n/navigation";
import { useLocationStore } from "@/stores/location-store";
import { formatTime } from "@/lib/ephem/astronomical";
import { getUTCOffsetForDate } from "@/lib/utils/timezone";
import {
  nowMinutesInTimezone,
  todayInTimezone,
} from "@/lib/utils/now-in-timezone";
import { GRAHAS } from "@/lib/constants/grahas";
import { tl } from "@/lib/utils/trilingual";
import { safeJsonLd } from "@/lib/seo/safe-jsonld";
import { generateBreadcrumbLD } from "@/lib/seo/structured-data";
import { isDevanagariLocale } from "@/lib/utils/locale-fonts";
import {
  calculateHoras,
  findBestHorasForActivities,
  parseHHMM,
  type HoraEntry,
  type HoraData,
} from "@/lib/hora/hora-calculator";

// ── Planet colors (inline style, not dynamic Tailwind) ─────────────
const PLANET_COLORS: Record<number, string> = {
  0: "#e67e22", // Sun - orange
  1: "#ecf0f1", // Moon - silver
  2: "#e74c3c", // Mars - red
  3: "#2ecc71", // Mercury - green
  4: "#f39c12", // Jupiter - gold
  5: "#e8e6e3", // Venus - cream
  6: "#3498db", // Saturn - blue
};

// ── Labels ─────────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: "Panchang",
    title: "Hora  –  Planetary Hours",
    subtitle:
      "Each hour of the day is ruled by a planet in the Chaldean sequence. Choose the right hora for your activities.",
    currentHora: "Current Hora",
    timeRemaining: "Time Remaining",
    dayLord: "Day Lord",
    sunrise: "Sunrise",
    sunset: "Sunset",
    dayHoras: "Day Horas",
    nightHoras: "Night Horas",
    timeline: "Full 24-Hour Timeline",
    bestFor: "Best Hora For...",
    activity: "Activity",
    planet: "Planet",
    nextSlot: "Next Slot Today",
    none: "None remaining today",
    noLocation: "Set your location to see hora timings",
    detectLocation: "Detect Location",
    whatIsHora: "What are Planetary Hours?",
    whatIsHoraText:
      "Planetary hours (Hora) are an ancient time-division system used in Vedic and Western astrology. The period from sunrise to sunset is divided into 12 equal parts (day horas), and sunset to next sunrise into 12 more (night horas). Each hora is governed by one of the 7 classical planets following the Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon. The first hora of each day is ruled by the day's planetary lord (e.g., Sunday = Sun, Monday = Moon).",
    howToUse: "How to Use Hora",
    howToUseText:
      "Start important activities during a hora ruled by a favourable planet. Mercury hora is ideal for communication and business. Jupiter hora favours education, law, and spirituality. Venus hora suits arts and relationships. Avoid starting auspicious work during Saturn or Mars hora unless the activity specifically aligns (e.g., construction in Saturn hora).",
    min: "min",
    hr: "hr",
  },
  hi: {
    back: "पंचांग",
    title: "होरा  –  ग्रह घण्टे",
    subtitle:
      "दिन के प्रत्येक घण्टे पर एक ग्रह का शासन होता है। अपने कार्यों के लिए सही होरा चुनें।",
    currentHora: "वर्तमान होरा",
    timeRemaining: "शेष समय",
    dayLord: "दिन का स्वामी",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    dayHoras: "दिवा होरा",
    nightHoras: "रात्रि होरा",
    timeline: "पूर्ण 24-घण्टा समयरेखा",
    bestFor: "किस कार्य के लिए सर्वोत्तम होरा...",
    activity: "कार्य",
    planet: "ग्रह",
    nextSlot: "आज का अगला समय",
    none: "आज शेष नहीं",
    noLocation: "होरा समय देखने के लिए स्थान निर्धारित करें",
    detectLocation: "स्थान पहचानें",
    whatIsHora: "ग्रह होरा क्या है?",
    whatIsHoraText:
      "ग्रह होरा एक प्राचीन काल-विभाजन पद्धति है। सूर्योदय से सूर्यास्त तक 12 समान भागों (दिवा होरा) और सूर्यास्त से अगले सूर्योदय तक 12 भागों (रात्रि होरा) में विभाजित किया जाता है। प्रत्येक होरा का स्वामी कैल्डियन क्रम में 7 शास्त्रीय ग्रहों में से एक होता है। प्रत्येक दिन की पहली होरा उस दिन के ग्रह स्वामी द्वारा शासित होती है।",
    howToUse: "होरा का उपयोग कैसे करें",
    howToUseText:
      "महत्वपूर्ण कार्य अनुकूल ग्रह की होरा में आरम्भ करें। बुध होरा संवाद और व्यापार के लिए उत्तम है। गुरु होरा शिक्षा, कानून और आध्यात्मिकता के लिए अनुकूल है। शुक्र होरा कला और सम्बन्धों के लिए उपयुक्त है।",
    min: "मिनट",
    hr: "घंटा",
  },
  sa: {
    back: "पञ्चाङ्गम्",
    title: "होरा  –  ग्रहघण्टाः",
    subtitle:
      "प्रत्येकं दिनस्य घण्टा एकेन ग्रहेण शासितः। स्वकार्याय उचितां होरां चिनुत।",
    currentHora: "वर्तमानहोरा",
    timeRemaining: "अवशिष्टसमयः",
    dayLord: "दिनस्वामी",
    sunrise: "सूर्योदयः",
    sunset: "सूर्यास्तः",
    dayHoras: "दिवाहोराः",
    nightHoras: "रात्रिहोराः",
    timeline: "पूर्णा चतुर्विंशतिघण्टासमयरेखा",
    bestFor: "कस्मै कार्याय श्रेष्ठा होरा...",
    activity: "कार्यम्",
    planet: "ग्रहः",
    nextSlot: "अद्य आगामिसमयः",
    none: "अद्य न अवशिष्टम्",
    noLocation: "होरासमयार्थं स्थानं निर्धारयतु",
    detectLocation: "स्थानं पहचानयतु",
    whatIsHora: "ग्रहहोरा किम्?",
    whatIsHoraText:
      "ग्रहहोरा प्राचीनकालविभाजनपद्धतिः अस्ति। सूर्योदयात् सूर्यास्तपर्यन्तं द्वादशसमभागेषु विभज्यते। प्रत्येकं होरायाः स्वामी कैल्डियनक्रमेण सप्तशास्त्रीयग्रहेषु एकः भवति।",
    howToUse: "होरायाः उपयोगः कथम्",
    howToUseText:
      "महत्त्वपूर्णानि कार्याणि अनुकूलग्रहस्य होरायां आरभत। बुधहोरा संवादव्यापारयोः उत्तमा। गुरुहोरा शिक्षाविधिआध्यात्मिकतायै अनुकूला।",
    min: "निमेषाः",
    hr: "घण्टा",
  },
  mai: {
    back: "पंचांग",
    title: "होरा – ग्रहीय घंटा",
    subtitle:
      "दिनक प्रत्येक घंटाक शासन एकटा ग्रह द्वारा चाल्डियन क्रममे होइत अछि। अहांक गतिविधिक लेल सही होरा चुनू।",
    currentHora: "वर्तमान होरा",
    timeRemaining: "शेष समय",
    dayLord: "दिनक स्वामी",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    dayHoras: "दिनक होरा",
    nightHoras: "रातिक होरा",
    timeline: "पूर्ण २४-घंटाक समयरेखा",
    bestFor: "एहि लेल सर्वोत्तम होरा...",
    activity: "गतिविधि",
    planet: "ग्रह",
    nextSlot: "आजुक अगला स्लॉट",
    none: "आजु किछो शेष नहि",
    noLocation: "होरा समय देखबाक लेल अपन स्थान निर्धारित करू",
    detectLocation: "स्थान पता लगाउ",
    whatIsHora: "ग्रहीय घंटा की अछि?",
    whatIsHoraText:
      "ग्रहीय घंटा (होरा) वैदिक आ पश्चिमी ज्योतिषमे उपयोग कएल जाएब बला एकटा प्राचीन समय-विभाजन प्रणाली अछि। सूर्योदय सँ सूर्यास्तक अवधि के १२ समान भागमे (दिनक होरा) आ सूर्यास्त सँ अगला सूर्योदय धरि के १२ आओर भागमे (रातिक होरा) विभाजित कएल जाइत अछि। प्रत्येक होरा पर चाल्डियन क्रममे ७टा शास्त्रीय ग्रह शासन करैत छथि: शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चंद्र। प्रत्येक दिनक पहिल होरा पर ओहि दिनक ग्रहीय स्वामी (जकां, रवि दिन = सूर्य, सोम दिन = चंद्र) शासन करैत छथि।",
    howToUse: "होरा केना उपयोग करी?",
    howToUseText:
      "अनुकूल ग्रह द्वारा शासित होराक समय महत्वपूर्ण गतिविधि शुरू करू। बुध होरा संचार आ व्यवसायक लेल आदर्श अछि। गुरु होरा शिक्षा, कानून आ आध्यात्मिकताक पक्षधर अछि। शुक्र होरा कला आ संबंधक लेल उपयुक्त अछि। शनि वा मंगल होराक समय शुभ कार्य शुरू करबा सँ बचू जखन धरि गतिविधि विशेष रूप सँ संरेखित नहि होय (जकां, शनि होरामे निर्माण)।",
    min: "मि.",
    hr: "घं.",
  },
  mr: {
    back: "पंचांग",
    title: "होरा – ग्रहीय तास",
    subtitle:
      "दिवसाचा प्रत्येक तास चाल्डियन क्रमाने एका ग्रहाद्वारे शासित असतो. तुमच्या कार्यांसाठी योग्य होरा निवडा.",
    currentHora: "सध्याचा होरा",
    timeRemaining: "उर्वरित वेळ",
    dayLord: "दिवसाचा स्वामी",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    dayHoras: "दिवसाचे होरा",
    nightHoras: "रात्रीचे होरा",
    timeline: "पूर्ण २४ तासांची टाइमलाइन",
    bestFor: "यासाठी सर्वोत्तम होरा...",
    activity: "क्रियाकलाप",
    planet: "ग्रह",
    nextSlot: "आजचा पुढील स्लॉट",
    none: "आज काहीही शिल्लक नाही",
    noLocation: "होरा वेळ पाहण्यासाठी तुमचे स्थान सेट करा",
    detectLocation: "स्थान शोधा",
    whatIsHora: "ग्रहीय तास काय आहेत?",
    whatIsHoraText:
      "ग्रहीय तास (होरा) ही वैदिक आणि पाश्चात्त्य ज्योतिषशास्त्रात वापरली जाणारी एक प्राचीन वेळ-विभागणी प्रणाली आहे. सूर्योदयापासून सूर्यास्तापर्यंतचा कालावधी १२ समान भागांमध्ये (दिवसाचे होरा) आणि सूर्यास्तापासून पुढील सूर्योदयापर्यंतचा कालावधी आणखी १२ भागांमध्ये (रात्रीचे होरा) विभागला जातो. प्रत्येक होरा चाल्डियन क्रमानुसार ७ शास्त्रीय ग्रहांपैकी एका ग्रहाद्वारे शासित असतो: शनि, गुरु, मंगळ, सूर्य, शुक्र, बुध, चंद्र. प्रत्येक दिवसाचा पहिला होरा त्या दिवसाच्या ग्रहीय स्वामीद्वारे (उदा. रविवार = सूर्य, सोमवार = चंद्र) शासित असतो.",
    howToUse: "होरा कसे वापरावे",
    howToUseText:
      "अनुकूल ग्रहाद्वारे शासित होराच्या वेळी महत्त्वाचे क्रियाकलाप सुरू करा. बुध होरा संवाद आणि व्यवसायासाठी आदर्श आहे. गुरु होरा शिक्षण, कायदा आणि अध्यात्मिकतेला अनुकूल आहे. शुक्र होरा कला आणि संबंधांसाठी योग्य आहे. शनि किंवा मंगळ होराच्या वेळी शुभ कार्य सुरू करणे टाळा, जोपर्यंत क्रियाकलाप विशेषतः संरेखित होत नाही (उदा. शनि होरामध्ये बांधकाम).",
    min: "मि.",
    hr: "ता.",
  },
  ta: {
    back: "பஞ்சாங்கம்",
    title: "ஹோரை – கிரக நேரங்கள்",
    subtitle:
      "ஒவ்வொரு நாளின் ஒவ்வொரு மணிநேரமும் சால்டியன் வரிசையில் ஒரு கிரகத்தால் ஆளப்படுகிறது. உங்கள் செயல்பாடுகளுக்கு சரியான ஹோரையைத் தேர்ந்தெடுக்கவும்.",
    currentHora: "தற்போதைய ஹோரை",
    timeRemaining: "மீதமுள்ள நேரம்",
    dayLord: "நாள் அதிபதி",
    sunrise: "சூரிய உதயம்",
    sunset: "சூரிய அஸ்தமனம்",
    dayHoras: "பகல் ஹோரைகள்",
    nightHoras: "இரவு ஹோரைகள்",
    timeline: "முழு 24 மணிநேர காலவரிசை",
    bestFor: "இதற்கு சிறந்த ஹோரை...",
    activity: "செயல்பாடு",
    planet: "கிரகம்",
    nextSlot: "இன்றைய அடுத்த ஸ்லாட்",
    none: "இன்று எதுவும் இல்லை",
    noLocation: "ஹோரை நேரங்களைப் பார்க்க உங்கள் இருப்பிடத்தை அமைக்கவும்",
    detectLocation: "இருப்பிடத்தைக் கண்டறிக",
    whatIsHora: "கிரக நேரங்கள் என்றால் என்ன?",
    whatIsHoraText:
      "கிரக நேரங்கள் (ஹோரை) என்பது வேத மற்றும் மேற்கத்திய ஜோதிடத்தில் பயன்படுத்தப்படும் ஒரு பண்டைய நேரப் பிரிவு அமைப்பு ஆகும். சூரிய உதயத்திலிருந்து சூரிய அஸ்தமனம் வரையிலான காலம் 12 சம பாகங்களாக (பகல் ஹோரைகள்) பிரிக்கப்படுகிறது, மேலும் சூரிய அஸ்தமனத்திலிருந்து அடுத்த சூரிய உதயம் வரையிலான காலம் மேலும் 12 பாகங்களாக (இரவு ஹோரைகள்) பிரிக்கப்படுகிறது. ஒவ்வொரு ஹோரையும் சால்டியன் வரிசையில் 7 பாரம்பரிய கிரகங்களில் ஒன்றால் ஆளப்படுகிறது: சனி, குரு, செவ்வாய், சூரியன், சுக்கிரன், புதன், சந்திரன். ஒவ்வொரு நாளின் முதல் ஹோரை அந்த நாளின் கிரக அதிபதியால் ஆளப்படுகிறது (எ.கா., ஞாயிறு = சூரியன், திங்கள் = சந்திரன்).",
    howToUse: "ஹோரையை எப்படி பயன்படுத்துவது",
    howToUseText:
      "சாதகமான கிரகத்தால் ஆளப்படும் ஹோரையின் போது முக்கியமான செயல்பாடுகளைத் தொடங்கவும். புதன் ஹோரை தகவல் தொடர்பு மற்றும் வணிகத்திற்கு ஏற்றது. குரு ஹோரை கல்வி, சட்டம் மற்றும் ஆன்மீகத்திற்கு உகந்தது. சுக்கிர ஹோரை கலை மற்றும் உறவுகளுக்குப் பொருந்தும். சனி அல்லது செவ்வாய் ஹோரையின் போது சுப காரியங்களைத் தொடங்குவதைத் தவிர்க்கவும், செயல்பாடு குறிப்பாக ஒத்துப்போகவில்லை என்றால் (எ.கா., சனி ஹோரையில் கட்டுமானம்).",
    min: "நிமி.",
    hr: "ம.",
  },
  te: {
    back: "పంచాంగం",
    title: "హోరా – గ్రహ గంటలు",
    subtitle:
      "రోజులోని ప్రతి గంట చాల్డియన్ క్రమంలో ఒక గ్రహం ద్వారా పాలించబడుతుంది. మీ కార్యకలాపాలకు సరైన హోరాను ఎంచుకోండి.",
    currentHora: "ప్రస్తుత హోరా",
    timeRemaining: "మిగిలిన సమయం",
    dayLord: "దిన అధిపతి",
    sunrise: "సూర్యోదయం",
    sunset: "సూర్యాస్తమయం",
    dayHoras: "పగటి హోరాలు",
    nightHoras: "రాత్రి హోరాలు",
    timeline: "పూర్తి 24 గంటల కాలక్రమం",
    bestFor: "దీనికి ఉత్తమ హోరా...",
    activity: "కార్యకలాపం",
    planet: "గ్రహం",
    nextSlot: "నేటి తదుపరి స్లాట్",
    none: "ఈరోజు ఏమీ మిగిలి లేదు",
    noLocation: "హోరా సమయాలను చూడటానికి మీ స్థానాన్ని సెట్ చేయండి",
    detectLocation: "స్థానాన్ని గుర్తించండి",
    whatIsHora: "గ్రహ గంటలు అంటే ఏమిటి?",
    whatIsHoraText:
      "గ్రహ గంటలు (హోరా) వేద మరియు పాశ్చాత్య జ్యోతిష్యశాస్త్రంలో ఉపయోగించే ఒక పురాతన సమయ-విభజన వ్యవస్థ. సూర్యోదయం నుండి సూర్యాస్తమయం వరకు ఉన్న కాలాన్ని 12 సమాన భాగాలుగా (పగటి హోరాలు) మరియు సూర్యాస్తమయం నుండి తదుపరి సూర్యోదయం వరకు ఉన్న కాలాన్ని మరో 12 భాగాలుగా (రాత్రి హోరాలు) విభజిస్తారు. ప్రతి హోరా చాల్డియన్ క్రమంలో 7 శాస్త్రీయ గ్రహాలలో ఒకదానిచే పాలించబడుతుంది: శని, గురు, కుజుడు, సూర్యుడు, శుక్రుడు, బుధుడు, చంద్రుడు. ప్రతి రోజు మొదటి హోరా ఆ రోజు గ్రహ అధిపతిచే పాలించబడుతుంది (ఉదా., ఆదివారం = సూర్యుడు, సోమవారం = చంద్రుడు).",
    howToUse: "హోరాను ఎలా ఉపయోగించాలి",
    howToUseText:
      "అనుకూలమైన గ్రహం ద్వారా పాలించబడే హోరా సమయంలో ముఖ్యమైన కార్యకలాపాలను ప్రారంభించండి. బుధ హోరా కమ్యూనికేషన్ మరియు వ్యాపారానికి అనువైనది. గురు హోరా విద్య, చట్టం మరియు ఆధ్యాత్మికతకు అనుకూలం. శుక్ర హోరా కళలు మరియు సంబంధాలకు సరిపోతుంది. శని లేదా కుజుడు హోరా సమయంలో శుభ కార్యాలను ప్రారంభించడం మానుకోండి, ఆ కార్యకలాపం ప్రత్యేకంగా సరిపోకపోతే (ఉదా., శని హోరాలో నిర్మాణం).",
    min: "నిమి.",
    hr: "గం.",
  },
  bn: {
    back: "পঞ্জিকা",
    title: "হোরা – গ্রহের ঘন্টা",
    subtitle:
      "দিনের প্রতিটি ঘন্টা চালডিয়ান ক্রম অনুসারে একটি গ্রহ দ্বারা শাসিত হয়। আপনার কার্যকলাপের জন্য সঠিক হোরা বেছে নিন।",
    currentHora: "বর্তমান হোরা",
    timeRemaining: "অবশিষ্ট সময়",
    dayLord: "দিনের অধিপতি",
    sunrise: "সূর্যোদয়",
    sunset: "সূর্যাস্ত",
    dayHoras: "দিনের হোরা",
    nightHoras: "রাতের হোরা",
    timeline: "সম্পূর্ণ ২৪-ঘন্টার সময়রেখা",
    bestFor: "এর জন্য সেরা হোরা...",
    activity: "কার্যকলাপ",
    planet: "গ্রহ",
    nextSlot: "আজকের পরবর্তী স্লট",
    none: "আজ আর কিছু বাকি নেই",
    noLocation: "হোরা সময় দেখতে আপনার অবস্থান সেট করুন",
    detectLocation: "অবস্থান সনাক্ত করুন",
    whatIsHora: "গ্রহের ঘন্টা কী?",
    whatIsHoraText:
      "গ্রহের ঘন্টা (হোরা) হল বৈদিক এবং পশ্চিমা জ্যোতিষশাস্ত্রে ব্যবহৃত একটি প্রাচীন সময়-বিভাজন ব্যবস্থা। সূর্যোদয় থেকে সূর্যাস্ত পর্যন্ত সময়কালকে ১২টি সমান ভাগে (দিনের হোরা) এবং সূর্যাস্ত থেকে পরবর্তী সূর্যোদয় পর্যন্ত সময়কালকে আরও ১২টি ভাগে (রাতের হোরা) ভাগ করা হয়। প্রতিটি হোরা চালডিয়ান ক্রম অনুসারে ৭টি শাস্ত্রীয় গ্রহের মধ্যে একটি দ্বারা শাসিত হয়: শনি, গুরু, মঙ্গল, সূর্য, শুক্র, বুধ, চন্দ্র। প্রতিটি দিনের প্রথম হোরা সেই দিনের গ্রহ অধিপতি দ্বারা শাসিত হয় (যেমন, রবিবার = সূর্য, সোমবার = চন্দ্র)।",
    howToUse: "হোরা কিভাবে ব্যবহার করবেন",
    howToUseText:
      "একটি অনুকূল গ্রহ দ্বারা শাসিত হোরা চলাকালীন গুরুত্বপূর্ণ কার্যকলাপ শুরু করুন। বুধ হোরা যোগাযোগ এবং ব্যবসার জন্য আদর্শ। গুরু হোরা শিক্ষা, আইন এবং আধ্যাত্মিকতার পক্ষে। শুক্র হোরা শিল্পকলা এবং সম্পর্কের জন্য উপযুক্ত। শনি বা মঙ্গল হোরা চলাকালীন শুভ কাজ শুরু করা এড়িয়ে চলুন, যদি না কার্যকলাপটি বিশেষভাবে সারিবদ্ধ হয় (যেমন, শনি হোরায় নির্মাণ)।",
    min: "মি.",
    hr: "ঘ.",
  },
  gu: {
    back: "પંચાંગ",
    title: "હોરા – ગ્રહોના કલાકો",
    subtitle:
      "દિવસનો દરેક કલાક ચાલ્ડિયન ક્રમમાં એક ગ્રહ દ્વારા શાસિત થાય છે. તમારી પ્રવૃત્તિઓ માટે યોગ્ય હોરા પસંદ કરો.",
    currentHora: "વર્તમાન હોરા",
    timeRemaining: "બાકીનો સમય",
    dayLord: "દિવસનો સ્વામી",
    sunrise: "સૂર્યોદય",
    sunset: "સૂર્યાસ્ત",
    dayHoras: "દિવસના હોરા",
    nightHoras: "રાત્રિના હોરા",
    timeline: "સંપૂર્ણ 24-કલાકની સમયરેખા",
    bestFor: "આ માટે શ્રેષ્ઠ હોરા...",
    activity: "પ્રવૃત્તિ",
    planet: "ગ્રહ",
    nextSlot: "આજનો આગલો સ્લોટ",
    none: "આજે કંઈ બાકી નથી",
    noLocation: "હોરાનો સમય જોવા માટે તમારું સ્થાન સેટ કરો",
    detectLocation: "સ્થાન શોધો",
    whatIsHora: "ગ્રહોના કલાકો શું છે?",
    whatIsHoraText:
      "ગ્રહોના કલાકો (હોરા) એ વૈદિક અને પશ્ચિમી જ્યોતિષશાસ્ત્રમાં ઉપયોગમાં લેવાતી એક પ્રાચીન સમય-વિભાજન પ્રણાલી છે. સૂર્યોદયથી સૂર્યાસ્ત સુધીનો સમયગાળો 12 સમાન ભાગોમાં (દિવસના હોરા) અને સૂર્યાસ્તથી આગલા સૂર્યોદય સુધીનો સમયગાળો વધુ 12 ભાગોમાં (રાત્રિના હોરા) વિભાજિત થાય છે. દરેક હોરા ચાલ્ડિયન ક્રમમાં 7 શાસ્ત્રીય ગ્રહોમાંથી એક દ્વારા શાસિત થાય છે: શનિ, ગુરુ, મંગળ, સૂર્ય, શુક્ર, બુધ, ચંદ્ર. દરેક દિવસનો પ્રથમ હોરા તે દિવસના ગ્રહોના સ્વામી દ્વારા શાસિત થાય છે (દા.ત., રવિવાર = સૂર્ય, સોમવાર = ચંદ્ર).",
    howToUse: "હોરાનો ઉપયોગ કેવી રીતે કરવો",
    howToUseText:
      "અનુકૂળ ગ્રહ દ્વારા શાસિત હોરા દરમિયાન મહત્વપૂર્ણ પ્રવૃત્તિઓ શરૂ કરો. બુધ હોરા સંચાર અને વ્યવસાય માટે આદર્શ છે. ગુરુ હોરા શિક્ષણ, કાયદો અને આધ્યાત્મિકતાને અનુકૂળ છે. શુક્ર હોરા કલા અને સંબંધો માટે યોગ્ય છે. શનિ અથવા મંગળ હોરા દરમિયાન શુભ કાર્ય શરૂ કરવાનું ટાળો, સિવાય કે પ્રવૃત્તિ ખાસ કરીને સંરેખિત થાય (દા.ત., શનિ હોરામાં બાંધકામ).",
    min: "મિ.",
    hr: "ક.",
  },
  kn: {
    back: "ಪಂಚಾಂಗ",
    title: "ಹೋರಾ – ಗ್ರಹಗಳ ಗಂಟೆಗಳು",
    subtitle:
      "ದಿನದ ಪ್ರತಿ ಗಂಟೆಯು ಚಾಲ್ಡಿಯನ್ ಅನುಕ್ರಮದಲ್ಲಿ ಒಂದು ಗ್ರಹದಿಂದ ಆಳಲ್ಪಡುತ್ತದೆ. ನಿಮ್ಮ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸರಿಯಾದ ಹೋರಾವನ್ನು ಆರಿಸಿ.",
    currentHora: "ಪ್ರಸ್ತುತ ಹೋರಾ",
    timeRemaining: "ಉಳಿದ ಸಮಯ",
    dayLord: "ದಿನದ ಅಧಿಪತಿ",
    sunrise: "ಸೂರ್ಯೋದಯ",
    sunset: "ಸೂರ್ಯಾಸ್ತ",
    dayHoras: "ಹಗಲಿನ ಹೋರಾ",
    nightHoras: "ರಾತ್ರಿಯ ಹೋರಾ",
    timeline: "ಪೂರ್ಣ 24-ಗಂಟೆಗಳ ಟೈಮ್‌ಲೈನ್",
    bestFor: "ಇದಕ್ಕೆ ಉತ್ತಮ ಹೋರಾ...",
    activity: "ಚಟುವಟಿಕೆ",
    planet: "ಗ್ರಹ",
    nextSlot: "ಇಂದಿನ ಮುಂದಿನ ಸ್ಲಾಟ್",
    none: "ಇಂದು ಏನೂ ಉಳಿದಿಲ್ಲ",
    noLocation: "ಹೋರಾ ಸಮಯಗಳನ್ನು ನೋಡಲು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹೊಂದಿಸಿ",
    detectLocation: "ಸ್ಥಳವನ್ನು ಪತ್ತೆ ಮಾಡಿ",
    whatIsHora: "ಗ್ರಹಗಳ ಗಂಟೆಗಳು ಎಂದರೇನು?",
    whatIsHoraText:
      "ಗ್ರಹಗಳ ಗಂಟೆಗಳು (ಹೋರಾ) ವೈದಿಕ ಮತ್ತು ಪಾಶ್ಚಾತ್ಯ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ ಬಳಸಲಾಗುವ ಒಂದು ಪ್ರಾಚೀನ ಸಮಯ-ವಿಭಾಗ ವ್ಯವಸ್ಥೆಯಾಗಿದೆ. ಸೂರ್ಯೋದಯದಿಂದ ಸೂರ್ಯಾಸ್ತದವರೆಗಿನ ಅವಧಿಯನ್ನು 12 ಸಮಾನ ಭಾಗಗಳಾಗಿ (ಹಗಲಿನ ಹೋರಾ) ಮತ್ತು ಸೂರ್ಯಾಸ್ತದಿಂದ ಮುಂದಿನ ಸೂರ್ಯೋದಯದವರೆಗಿನ ಅವಧಿಯನ್ನು ಮತ್ತಷ್ಟು 12 ಭಾಗಗಳಾಗಿ (ರಾತ್ರಿಯ ಹೋರಾ) ವಿಂಗಡಿಸಲಾಗಿದೆ. ಪ್ರತಿ ಹೋರಾವು ಚಾಲ್ಡಿಯನ್ ಅನುಕ್ರಮದಲ್ಲಿ 7 ಶಾಸ್ತ್ರೀಯ ಗ್ರಹಗಳಲ್ಲಿ ಒಂದರಿಂದ ಆಳಲ್ಪಡುತ್ತದೆ: ಶನಿ, ಗುರು, ಮಂಗಳ, ಸೂರ್ಯ, ಶುಕ್ರ, ಬುಧ, ಚಂದ್ರ. ಪ್ರತಿ ದಿನದ ಮೊದಲ ಹೋರಾವು ಆ ದಿನದ ಗ್ರಹ ಅಧಿಪತಿಯಿಂದ ಆಳಲ್ಪಡುತ್ತದೆ (ಉದಾ., ಭಾನುವಾರ = ಸೂರ್ಯ, ಸೋಮವಾರ = ಚಂದ್ರ).",
    howToUse: "ಹೋರಾ ಹೇಗೆ ಬಳಸುವುದು",
    howToUseText:
      "ಅನುಕೂಲಕರ ಗ್ರಹದಿಂದ ಆಳಲ್ಪಡುವ ಹೋರಾ ಸಮಯದಲ್ಲಿ ಪ್ರಮುಖ ಚಟುವಟಿಕೆಗಳನ್ನು ಪ್ರಾರಂಭಿಸಿ. ಬುಧ ಹೋರಾ ಸಂವಹನ ಮತ್ತು ವ್ಯವಹಾರಕ್ಕೆ ಸೂಕ್ತವಾಗಿದೆ. ಗುರು ಹೋರಾ ಶಿಕ್ಷಣ, ಕಾನೂನು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕತೆಗೆ ಅನುಕೂಲಕರವಾಗಿದೆ. ಶುಕ್ರ ಹೋರಾ ಕಲೆ ಮತ್ತು ಸಂಬಂಧಗಳಿಗೆ ಸೂಕ್ತವಾಗಿದೆ. ಶನಿ ಅಥವಾ ಮಂಗಳ ಹೋರಾ ಸಮಯದಲ್ಲಿ ಶುಭ ಕಾರ್ಯಗಳನ್ನು ಪ್ರಾರಂಭಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ, ಚಟುವಟಿಕೆಯು ನಿರ್ದಿಷ್ಟವಾಗಿ ಹೊಂದಿಕೆಯಾಗದ ಹೊರತು (ಉದಾ., ಶನಿ ಹೋರಾದಲ್ಲಿ ನಿರ್ಮಾಣ).",
    min: "ನಿಮಿ.",
    hr: "ಗಂ.",
  },
};

function L(key: string, locale: string): string {
  return LABELS[locale]?.[key] ?? LABELS["en"][key] ?? key;
}

// ── Component ─────────────────────────────────────────────────────

export default function HoraClient() {
  const locale = useLocale();
  const devFont = isDevanagariLocale(locale)
    ? { fontFamily: "var(--font-devanagari-body)" }
    : {};
  const {
    lat,
    lng,
    name: locationName,
    timezone,
    confirmed,
    detect,
    detecting,
  } = useLocationStore();

  // Lesson ZD: useState initializers run BOTH server-side (during SSR) and
  // client-side (during hydration). Because `timezone` comes from a Zustand
  // persisted store, it's empty/undefined on the server and the persisted
  // value on the client — the two diverge and React's hydration mismatch
  // (#418) silently kills the tree + analytics. The earlier `mounted` flag
  // was added with this intent but never actually gated anything.
  //
  // Fix: start with empty/zero seeds (byte-identical SSR vs client), then
  // populate via useEffect post-mount. `selectedDate=''` and `nowMinutes=0`
  // render a skeleton for the ~1 frame between mount and first effect, then
  // the real values land and the hora list renders.
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [nowMinutes, setNowMinutes] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    setSelectedDate(todayInTimezone(timezone));
    setNowMinutes(nowMinutesInTimezone(timezone));
  }, [timezone]);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setNowMinutes(nowMinutesInTimezone(timezone));
    }, 30_000);
    return () => clearInterval(timer);
  }, [mounted, timezone]);

  // Round 2 TZ-9 — `isToday` must compare against the panchang-location tz,
  // not the browser's local clock, otherwise the NOW highlight in the hora
  // list runs against the wrong day after midnight. Returns false until
  // `selectedDate` is populated post-mount (the skeleton frame).
  const isToday = useMemo(() => {
    if (!selectedDate) return false;
    return selectedDate === todayInTimezone(timezone);
  }, [selectedDate, timezone]);

  // ── Sunrise/sunset via /api/sunrise (server-side sweph) ──
  // Native sweph can't run in the browser. We fetch from /api/sunrise so
  // hora boundaries match the rest of the engine (which uses sweph since
  // the lagna+sunrise consolidation). `null` means polar non-rise — we
  // surface a banner instead of fabricating a 6 AM fallback.
  type SunData = {
    today: { sunriseUT: number | null; sunsetUT: number | null };
    nextDaySunriseUT: number | null;
    warnings: string[];
  } | null;
  const [sunData, setSunData] = useState<SunData>(null);
  const [sunLoading, setSunLoading] = useState(false);
  const [sunError, setSunError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) {
      setSunData(null);
      return;
    }
    // Lesson ZD: selectedDate is '' during the SSR + first-render frame.
    // The split-into-NaN math below would silently fire fetches with
    // `?date=NaN-NaN-NaN` and surface a sunError banner. Skip until the
    // mount-time useEffect populates the real date.
    if (!selectedDate) return;
    const tz = timezone || "UTC";
    const [y, m, d] = selectedDate.split("-").map(Number);
    const nextDateObj = new Date(Date.UTC(y, m - 1, d + 1));
    const nextDateStr =
      nextDateObj.getUTCFullYear() +
      "-" +
      String(nextDateObj.getUTCMonth() + 1).padStart(2, "0") +
      "-" +
      String(nextDateObj.getUTCDate()).padStart(2, "0");

    let cancelled = false;
    setSunLoading(true);
    setSunError(null);
    const q = (date: string) =>
      `/api/sunrise?date=${date}&lat=${lat}&lng=${lng}&timezone=${encodeURIComponent(tz)}`;
    Promise.all([
      fetch(q(selectedDate)).then((r) => r.json()),
      fetch(q(nextDateStr)).then((r) => r.json()),
    ])
      .then(([today, next]) => {
        if (cancelled) return;
        setSunData({
          today: { sunriseUT: today.sunriseUT, sunsetUT: today.sunsetUT },
          nextDaySunriseUT: next.sunriseUT,
          warnings: [...(today.warnings ?? []), ...(next.warnings ?? [])],
        });
      })
      .catch((err: unknown) => {
        console.error("[hora] /api/sunrise failed:", err);
        if (!cancelled) setSunError("Could not fetch sunrise/sunset times.");
      })
      .finally(() => {
        if (!cancelled) setSunLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng, timezone, selectedDate]);

  // Compute hora data from the fetched sunrise/sunset
  const horaData: HoraData | null = useMemo(() => {
    if (!sunData) return null;
    if (
      sunData.today.sunriseUT === null ||
      sunData.today.sunsetUT === null ||
      sunData.nextDaySunriseUT === null
    ) {
      // Polar non-rise — no hora slots possible. Return null; UI shows banner.
      return null;
    }
    const [y, m, d] = selectedDate.split("-").map(Number);
    const tz = timezone || "UTC";
    const tzOffset = getUTCOffsetForDate(y, m, d, tz);

    const sunriseLocal = formatTime(sunData.today.sunriseUT, tzOffset);
    const sunsetLocal = formatTime(sunData.today.sunsetUT, tzOffset);
    const nextSunriseLocal = formatTime(sunData.nextDaySunriseUT, tzOffset);

    const dateObj = new Date(y, m - 1, d);
    const weekday = dateObj.getDay();

    return calculateHoras(
      dateObj,
      sunriseLocal,
      sunsetLocal,
      nextSunriseLocal,
      weekday,
      isToday ? nowMinutes : -1,
    );
  }, [sunData, selectedDate, timezone, nowMinutes, isToday]);

  // Best horas for activities
  const bestHoras = useMemo(() => {
    if (!horaData || !isToday) return null;
    return findBestHorasForActivities(horaData.horas, nowMinutes);
  }, [horaData, isToday, nowMinutes]);

  // Time remaining in current hora
  const timeRemaining = useMemo(() => {
    if (!horaData?.currentHora) return null;
    const endMin = parseHHMM(horaData.currentHora.endTime);
    const diff = endMin - nowMinutes;
    if (diff <= 0) return null;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    if (hrs > 0) return `${hrs} ${L("hr", locale)} ${mins} ${L("min", locale)}`;
    return `${mins} ${L("min", locale)}`;
  }, [horaData, nowMinutes, locale]);

  // Breadcrumb JSON-LD
  const breadcrumbLD = generateBreadcrumbLD("/hora", locale);

  return (
    <div className="pt-8 pb-16 px-4 sm:px-6" style={devFont}>
      {/* Breadcrumb LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/panchang"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {L("back", locale)}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {L("title", locale)}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mb-6">
            {L("subtitle", locale)}
          </p>
        </motion.div>

        <GoldDivider className="mb-6" />

        {/* Date picker */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gold-primary" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50"
            />
          </div>
          {mounted && confirmed && locationName && (
            <span className="text-text-secondary text-sm">{locationName}</span>
          )}
        </div>

        {/* No location state (only after mount to avoid hydration mismatch) */}
        {mounted && !confirmed && (
          <div className="text-center py-16">
            <Clock className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
            <p className="text-text-secondary mb-4">
              {L("noLocation", locale)}
            </p>
            <button
              onClick={() => detect()}
              disabled={detecting}
              className="px-6 py-2.5 bg-gold-primary/15 border border-gold-primary/30 rounded-lg text-gold-light hover:bg-gold-primary/25 transition-colors text-sm"
            >
              {detecting ? "..." : L("detectLocation", locale)}
            </button>
          </div>
        )}

        {/* Sunrise fetch loading state */}
        {mounted && confirmed && sunLoading && !horaData && (
          <div className="text-center py-12">
            <Clock className="w-8 h-8 text-gold-primary/30 mx-auto mb-3 animate-pulse" />
            <p className="text-text-secondary text-sm">
              Computing sunrise/sunset…
            </p>
          </div>
        )}

        {/* Sunrise fetch error */}
        {mounted && confirmed && sunError && (
          <div className="text-center py-12">
            <p className="text-red-300 text-sm">{sunError}</p>
          </div>
        )}

        {/* Polar non-rise — no canonical horas on this day */}
        {mounted && confirmed && sunData && !horaData && !sunLoading && (
          <div className="mx-auto max-w-xl my-8 p-4 rounded-lg border border-gold-primary/25 bg-bg-secondary/30">
            <p className="text-gold-light text-sm font-medium mb-1">
              No sunrise on this day
            </p>
            <p className="text-text-secondary text-sm">
              At lat {lat?.toFixed(2)}° on {selectedDate} the sun does not rise
              (or does not set) — so the 24 hora slots cannot be drawn. Hora is
              a sunrise-anchored time-division; there is no canonical convention
              for polar non-rise days.
            </p>
            {sunData.warnings.length > 0 && (
              <ul className="mt-2 text-text-secondary/80 text-xs list-disc pl-5">
                {sunData.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Main content */}
        {mounted && confirmed && horaData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Day info bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <InfoCard
                label={L("dayLord", locale)}
                value={tl(horaData.dayLordName, locale)}
                color={PLANET_COLORS[horaData.dayLord]}
              />
              <InfoCard label={L("sunrise", locale)} value={horaData.sunrise} />
              <InfoCard label={L("sunset", locale)} value={horaData.sunset} />
              <InfoCard
                label={
                  isToday ? L("timeRemaining", locale) : L("dayHoras", locale)
                }
                value={
                  isToday
                    ? (timeRemaining ?? "--")
                    : `${horaData.dayDuration} ${L("min", locale)}`
                }
              />
            </div>

            {/* Current hora highlight */}
            {horaData.currentHora && isToday && (
              <CurrentHoraCard
                hora={horaData.currentHora}
                locale={locale}
                timeRemaining={timeRemaining}
              />
            )}

            {/* 24-hour timeline */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gold-light mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5" />
                {L("timeline", locale)}
              </h2>

              {/* Day horas */}
              <h3 className="text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
                {L("dayHoras", locale)}
              </h3>
              <div className="grid gap-1.5 mb-4">
                {horaData.horas
                  .filter((h) => h.isDayHora)
                  .map((h) => (
                    <HoraBar key={h.horaNumber} hora={h} locale={locale} />
                  ))}
              </div>

              {/* Night horas */}
              <h3 className="text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
                {L("nightHoras", locale)}
              </h3>
              <div className="grid gap-1.5">
                {horaData.horas
                  .filter((h) => !h.isDayHora)
                  .map((h) => (
                    <HoraBar key={h.horaNumber} hora={h} locale={locale} />
                  ))}
              </div>
            </section>

            {/* Best hora for activities */}
            {bestHoras && isToday && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gold-light mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {L("bestFor", locale)}
                </h2>
                <div className="bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] border border-gold-primary/10 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-2.5 border-b border-gold-primary/10">
                    <span>{L("activity", locale)}</span>
                    <span>{L("planet", locale)}</span>
                    <span>{L("nextSlot", locale)}</span>
                  </div>
                  {bestHoras.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 px-4 py-2.5 text-sm border-b border-gold-primary/5 last:border-b-0 hover:bg-gold-primary/5 transition-colors"
                    >
                      <span className="text-text-primary">
                        {locale === "hi" || locale === "sa"
                          ? item.activityHi
                          : item.activity}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: PLANET_COLORS[item.planet],
                          }}
                        />
                        {tl(GRAHAS[item.planet].name, locale)}
                      </span>
                      <span className="text-text-secondary">
                        {item.nextHora
                          ? `${item.nextHora.startTime}–${item.nextHora.endTime}`
                          : L("none", locale)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <GoldDivider className="mb-8" />

            {/* Educational content */}
            <section className="space-y-6 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gold-light mb-2">
                  {L("whatIsHora", locale)}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {L("whatIsHoraText", locale)}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gold-light mb-2">
                  {L("howToUse", locale)}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {L("howToUseText", locale)}
                </p>
              </div>
            </section>

            <RelatedLinks
              type="learn"
              links={getLearnLinksForTool("/hora")}
              locale={locale}
              className="mt-8"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function InfoCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] border border-gold-primary/10 rounded-xl px-4 py-3">
      <div className="text-xs text-text-secondary mb-1">{label}</div>
      <div
        className="text-base font-semibold text-text-primary"
        style={color ? { color } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function CurrentHoraCard({
  hora,
  locale,
  timeRemaining,
}: {
  hora: HoraEntry;
  locale: string;
  timeRemaining: string | null;
}) {
  const color = PLANET_COLORS[hora.planet];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6 p-5 rounded-xl border-2"
      style={{
        borderColor: color,
        backgroundColor: `${color}10`,
        boxShadow: `0 0 30px ${color}15`,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">
            {LABELS[locale]?.currentHora ?? LABELS.en.currentHora}
          </div>
          <div className="text-2xl font-bold" style={{ color }}>
            {tl(hora.planetName, locale)}{" "}
            {LABELS[locale]?.currentHora ? "" : ""}
          </div>
          <div className="text-sm text-text-secondary mt-1">
            {hora.startTime} – {hora.endTime}
          </div>
        </div>
        <div className="text-right">
          {timeRemaining && (
            <div>
              <div className="text-xs text-text-secondary">
                {LABELS[locale]?.timeRemaining ?? LABELS.en.timeRemaining}
              </div>
              <div className="text-lg font-semibold text-gold-light">
                {timeRemaining}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-text-secondary mt-3 italic">
        {hora.signification}
      </div>
    </motion.div>
  );
}

function HoraBar({ hora, locale }: { hora: HoraEntry; locale: string }) {
  const color = PLANET_COLORS[hora.planet];
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
        hora.isCurrent
          ? "border-2 ring-1 ring-gold-primary/30"
          : "border border-transparent hover:border-gold-primary/10"
      }`}
      style={{
        backgroundColor: hora.isCurrent ? `${color}18` : `${color}08`,
        borderColor: hora.isCurrent ? color : undefined,
      }}
    >
      {/* Planet dot */}
      <span
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />

      {/* Planet name */}
      <span
        className="w-20 sm:w-28 text-sm font-medium truncate"
        style={{ color }}
      >
        {tl(hora.planetName, locale)}
      </span>

      {/* Time range */}
      <span className="text-sm text-text-secondary font-mono whitespace-nowrap">
        {hora.startTime} – {hora.endTime}
      </span>

      {/* Signification (hidden on small screens) */}
      <span className="hidden sm:block text-xs text-text-secondary truncate ml-auto">
        {hora.signification}
      </span>

      {/* Current indicator */}
      {hora.isCurrent && (
        <span className="ml-auto sm:ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gold-primary/20 text-gold-light whitespace-nowrap">
          NOW
        </span>
      )}
    </div>
  );
}
