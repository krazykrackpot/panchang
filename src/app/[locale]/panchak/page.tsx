"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Moon,
  AlertTriangle,
  MapPin,
  ArrowLeft,
  Shield,
  ShieldOff,
  Skull,
  HeartPulse,
  Flame,
  DollarSign,
  Navigation,
  CheckCircle,
} from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";
import InfoBlock from "@/components/ui/InfoBlock";
import { Link } from "@/lib/i18n/navigation";
import { computePanchang, type PanchangInput } from "@/lib/ephem/panchang-calc";
import { getUTCOffsetForDate } from "@/lib/utils/timezone";
import { todayInTimezone } from "@/lib/utils/now-in-timezone";
import { CITIES, type CityData } from "@/lib/constants/cities";
import { getDefaultCityForLocale } from "@/lib/constants/rashi-slugs";
import { useLocationStore } from "@/stores/location-store";
import { generateBreadcrumbLD } from "@/lib/seo/structured-data";
import { checkPanchak } from "@/lib/panchang/panchak";
import type { Locale } from "@/types/panchang";
import { isDevanagariLocale, pickByScript } from "@/lib/utils/locale-fonts";
import { tl } from "@/lib/utils/trilingual";
import { safeJsonLd } from "@/lib/seo/safe-jsonld";

// ─── City selector ────────────────────────────────────────────
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
    title: "Panchak Today",
    active: "Panchak is ACTIVE",
    notActive: "No Panchak Today",
    activeDesc:
      "The Moon is currently in a Panchak nakshatra. Avoid the activities listed below.",
    notActiveDesc:
      "The Moon is not in any Panchak nakshatra right now. All activities are unrestricted.",
    currentNakshatra: "Current Moon Nakshatra",
    panchakType: "Panchak Type",
    nakshatrasTable: "The 5 Panchak Nakshatras",
    nakshatra: "Nakshatra",
    fear: "Fear Type",
    avoid: "Activities to Avoid",
    avoidDuring: "Activities to Avoid During Panchak",
    avoidItems:
      "Collecting wood, straw, or fuel|Building or repairing roofs|Starting southward journeys|Making new beds or mattresses|Cremation without special rituals (5 effigies required)",
    faq: "Frequently Asked Questions",
    faq1q: "How long does Panchak last?",
    faq1a:
      "Panchak lasts approximately 2.5 days (about 60 hours) as the Moon transits through 5 consecutive nakshatras  –  Dhanishtha, Shatabhisha, Purva Bhadrapada, Uttara Bhadrapada, and Revati.",
    faq2q: "How often does Panchak occur?",
    faq2a:
      "Panchak occurs approximately every 27 days, since the Moon completes one full cycle through all 27 nakshatras in about 27.3 days. This means Panchak happens roughly once a month.",
    faq3q: "Can I travel during Panchak?",
    faq3a:
      "Only southward journeys are specifically warned against in classical texts. Travel in other directions is not restricted. Emergency travel is always permissible regardless of Panchak.",
    faq4q: "What happens if someone dies during Panchak?",
    faq4a:
      "If death occurs during Panchak, special cremation rituals called Panchak Shanti are performed. Five effigies (putlas) made of grass or cloth are created and cremated alongside the deceased to protect surviving family members.",
    faq5q: "Is Panchak observed all over India?",
    faq5a:
      "Panchak is most strictly observed in North India (UP, Bihar, Rajasthan, MP). In South India, the concept exists but is observed with less strictness. Some communities consider only death-Panchak (Dhanishtha) and fire-Panchak (Purva Bhadrapada) as strictly inauspicious.",
    learnMore: "Learn More About Panchak",
    seeAlso: "See Also",
  },
  hi: {
    back: "पंचांग",
    title: "आज का पंचक",
    active: "पंचक सक्रिय है",
    notActive: "आज पंचक नहीं है",
    activeDesc:
      "चन्द्रमा वर्तमान में पंचक नक्षत्र में है। नीचे सूचीबद्ध कार्यों से बचें।",
    notActiveDesc:
      "चन्द्रमा अभी किसी भी पंचक नक्षत्र में नहीं है। सभी कार्य अप्रतिबंधित हैं।",
    currentNakshatra: "वर्तमान चन्द्र नक्षत्र",
    panchakType: "पंचक प्रकार",
    nakshatrasTable: "पंचक के 5 नक्षत्र",
    nakshatra: "नक्षत्र",
    fear: "भय प्रकार",
    avoid: "वर्जित कार्य",
    avoidDuring: "पंचक में वर्जित कार्य",
    avoidItems:
      "लकड़ी, भूसा या ईंधन संग्रह|छत का निर्माण या मरम्मत|दक्षिण दिशा की यात्रा|नई शय्या या गद्दा बनाना|विशेष विधि के बिना अंत्येष्टि (5 पुतले आवश्यक)",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    faq1q: "पंचक कितने समय तक रहता है?",
    faq1a:
      "पंचक लगभग 2.5 दिन (लगभग 60 घंटे) तक रहता है जब चन्द्रमा 5 लगातार नक्षत्रों  –  धनिष्ठा, शतभिषा, पूर्वा भाद्रपद, उत्तरा भाद्रपद और रेवती से गुज़रता है।",
    faq2q: "पंचक कितनी बार आता है?",
    faq2a:
      "पंचक लगभग हर 27 दिनों में आता है, क्योंकि चन्द्रमा सभी 27 नक्षत्रों का एक पूर्ण चक्र लगभग 27.3 दिनों में पूरा करता है। अर्थात महीने में लगभग एक बार।",
    faq3q: "क्या पंचक में यात्रा कर सकते हैं?",
    faq3a:
      "शास्त्रीय ग्रंथों में केवल दक्षिण दिशा की यात्रा से विशेष चेतावनी है। अन्य दिशाओं में यात्रा प्रतिबंधित नहीं है। आपातकालीन यात्रा सदैव अनुमत है।",
    faq4q: "यदि पंचक में किसी की मृत्यु हो जाए तो?",
    faq4a:
      "यदि पंचक में मृत्यु हो, तो पंचक शांति नामक विशेष अंत्येष्टि अनुष्ठान किए जाते हैं। घास या कपड़े से बने 5 पुतले बनाकर मृतक के साथ दाह किए जाते हैं।",
    faq5q: "क्या पंचक पूरे भारत में मनाया जाता है?",
    faq5a:
      "पंचक सबसे कठोरता से उत्तर भारत (UP, बिहार, राजस्थान, MP) में मनाया जाता है। दक्षिण भारत में यह कम कठोरता से मनाया जाता है।",
    learnMore: "पंचक के बारे में और जानें",
    seeAlso: "यह भी देखें",
  },
  mai: {
    back: "पंचांग",
    title: "आइ-क पंचाक",
    active: "पंचाक सक्रिय अछि",
    notActive: "आइ कोनो पंचाक नहि अछि",
    activeDesc:
      "चंद्रमा वर्तमान मे पंचाक नक्षत्र मे अछि। नीचाँ देल गेल गतिविधि सभ सँ बचू।",
    notActiveDesc:
      "चंद्रमा एखन कोनो पंचाक नक्षत्र मे नहि अछि। सभ गतिविधि अप्रतिबंधित अछि।",
    currentNakshatra: "वर्तमान चंद्रमा नक्षत्र",
    panchakType: "पंचाक-क प्रकार",
    nakshatrasTable: "५ पंचाक नक्षत्र",
    nakshatra: "नक्षत्र",
    fear: "भय-क प्रकार",
    avoid: "बचेबाक गतिविधि सभ",
    avoidDuring: "पंचाक-क समय बचेबाक गतिविधि सभ",
    avoidItems:
      "काठ, पुआल, वा ईंधन जमा करब|छप्पर बनयब वा मरम्मत करब|दक्षिण दिशाक यात्रा शुरू करब|नव पलंग वा गद्दा बनयब|विशेष संस्कारक बिना दाह-संस्कार (५ पुतला आवश्यक)",
    faq: "प्रायः पुछल जायबला प्रश्न",
    faq1q: "पंचाक केतेक काल धरि रहैत अछि?",
    faq1a:
      "चंद्रमा ५ लगातार नक्षत्र – धनिष्ठा, शतभिषा, पूर्वा भाद्रपद, उत्तरा भाद्रपद, आ रेवती सँ गुजरय काल पंचाक लगभग २.५ दिन (लगभग ६० घंटा) धरि रहैत अछि।",
    faq2q: "पंचाक केतेक बेर होइत अछि?",
    faq2a:
      "पंचाक लगभग २७ दिन पर होइत अछि, किएक तँ चंद्रमा लगभग २७.३ दिन मे सभ २७ नक्षत्र सँ एकटा पूर्ण चक्र पूरा करैत अछि। एकर अर्थ अछि जे पंचाक लगभग मास मे एक बेर होइत अछि।",
    faq3q: "की हम पंचाक-क समय यात्रा कऽ सकैत छी?",
    faq3a:
      "शास्त्रीय ग्रंथ मे केवल दक्षिण दिशाक यात्राक लेल विशेष रूप सँ चेतावनी देल गेल अछि। अन्य दिशा मे यात्रा प्रतिबंधित नहि अछि। आपातकालीन यात्रा पंचाक सँ निरपेक्ष हमेशा अनुमेय अछि।",
    faq4q: "यदि कोनो व्यक्ति पंचाक-क समय मरि जाइत अछि तँ की होइत अछि?",
    faq4a:
      "यदि पंचाक-क समय मृत्यु होइत अछि, तँ पंचाक शांति नामक विशेष दाह-संस्कार संस्कार कएल जाइत अछि। घास वा कपड़ा सँ बनल पाँच पुतला बनाओल जाइत अछि आ जीवित परिवारक सदस्य सभक रक्षाक लेल मृतकक संग दाह-संस्कार कएल जाइत अछि।",
    faq5q: "की पंचाक पूरा भारत मे मानल जाइत अछि?",
    faq5a:
      "पंचाक उत्तर भारत (यूपी, बिहार, राजस्थान, एमपी) मे सबसँ कठोरता सँ मानल जाइत अछि। दक्षिण भारत मे, ई अवधारणा अछि मुदा कम कठोरता सँ मानल जाइत अछि। किछु समुदाय केवल मृत्यु-पंचाक (धनिष्ठा) आ अग्नि-पंचाक (पूर्वा भाद्रपद) केँ कठोर रूप सँ अशुभ मानैत अछि।",
    learnMore: "पंचाक-क विषय मे बेसी जानू",
    seeAlso: "ईहो देखू",
  },
  mr: {
    back: "पंचांग",
    title: "आजचे पंचक",
    active: "पंचक सक्रिय आहे",
    notActive: "आज पंचक नाही",
    activeDesc: "चंद्र सध्या पंचक नक्षत्रात आहे. खालील क्रियाकलाप टाळा.",
    notActiveDesc:
      "चंद्र सध्या कोणत्याही पंचक नक्षत्रात नाही. सर्व क्रियाकलाप अप्रतिबंधित आहेत.",
    currentNakshatra: "सध्याचे चंद्र नक्षत्र",
    panchakType: "पंचक प्रकार",
    nakshatrasTable: "५ पंचक नक्षत्रे",
    nakshatra: "नक्षत्र",
    fear: "भीतीचा प्रकार",
    avoid: "टाळायचे क्रियाकलाप",
    avoidDuring: "पंचकादरम्यान टाळायचे क्रियाकलाप",
    avoidItems:
      "लाकूड, गवत किंवा इंधन गोळा करणे|छप्पर बांधणे किंवा दुरुस्त करणे|दक्षिणेकडील प्रवास सुरू करणे|नवीन पलंग किंवा गादी बनवणे|विशेष विधींशिवाय दहन (५ पुतळे आवश्यक)",
    faq: "वारंवार विचारले जाणारे प्रश्न",
    faq1q: "पंचक किती काळ टिकते?",
    faq1a:
      "चंद्र ५ सलग नक्षत्रांमधून – धनिष्ठा, शततारका, पूर्वा भाद्रपदा, उत्तरा भाद्रपदा आणि रेवती – संक्रमण करत असताना पंचक अंदाजे २.५ दिवस (सुमारे ६० तास) टिकते.",
    faq2q: "पंचक किती वेळा येते?",
    faq2a:
      "पंचक अंदाजे दर २७ दिवसांनी येते, कारण चंद्र सुमारे २७.३ दिवसांत सर्व २७ नक्षत्रांमधून एक पूर्ण चक्र पूर्ण करतो. याचा अर्थ पंचक साधारणपणे महिन्यातून एकदा येते.",
    faq3q: "मी पंचकादरम्यान प्रवास करू शकतो का?",
    faq3a:
      "शास्त्रीय ग्रंथांमध्ये केवळ दक्षिणेकडील प्रवासासाठी विशेषतः चेतावणी दिली आहे. इतर दिशांमधील प्रवासावर कोणतेही बंधन नाही. पंचकाची पर्वा न करता आपत्कालीन प्रवास नेहमीच अनुज्ञेय आहे.",
    faq4q: "पंचकादरम्यान कोणी मरण पावल्यास काय होते?",
    faq4a:
      "पंचकादरम्यान मृत्यू झाल्यास, पंचक शांती नावाचे विशेष दहन विधी केले जातात. गवताचे किंवा कापडाचे बनवलेले पाच पुतळे तयार केले जातात आणि जिवंत कुटुंब सदस्यांचे संरक्षण करण्यासाठी मृतासोबत दहन केले जातात.",
    faq5q: "पंचक संपूर्ण भारतात पाळले जाते का?",
    faq5a:
      "पंचक उत्तर भारतात (यूपी, बिहार, राजस्थान, एमपी) सर्वात कठोरपणे पाळले जाते. दक्षिण भारतात, ही संकल्पना अस्तित्वात आहे परंतु कमी कठोरतेने पाळली जाते. काही समुदाय केवळ मृत्यू-पंचक (धनिष्ठा) आणि अग्नि-पंचक (पूर्वा भाद्रपदा) यांनाच कठोरपणे अशुभ मानतात.",
    learnMore: "पंचकाविषयी अधिक जाणून घ्या",
    seeAlso: "हे देखील पहा",
  },
  ta: {
    back: "பஞ்சாங்கம்",
    title: "இன்றைய பஞ்சகம்",
    active: "பஞ்சகம் செயலில் உள்ளது",
    notActive: "இன்று பஞ்சகம் இல்லை",
    activeDesc:
      "சந்திரன் தற்போது பஞ்சக நட்சத்திரத்தில் உள்ளது. கீழே பட்டியலிடப்பட்டுள்ள செயல்களைத் தவிர்க்கவும்.",
    notActiveDesc:
      "சந்திரன் தற்போது எந்த பஞ்சக நட்சத்திரத்திலும் இல்லை. அனைத்து செயல்களும் கட்டுப்பாடற்றவை.",
    currentNakshatra: "தற்போதைய சந்திர நட்சத்திரம்",
    panchakType: "பஞ்சக வகை",
    nakshatrasTable: "5 பஞ்சக நட்சத்திரங்கள்",
    nakshatra: "நட்சத்திரம்",
    fear: "பய வகை",
    avoid: "தவிர்க்க வேண்டிய செயல்கள்",
    avoidDuring: "பஞ்சகத்தின் போது தவிர்க்க வேண்டிய செயல்கள்",
    avoidItems:
      "விறகு, வைக்கோல் அல்லது எரிபொருள் சேகரித்தல்|கூரை கட்டுதல் அல்லது பழுதுபார்த்தல்|தெற்கு நோக்கிய பயணங்களைத் தொடங்குதல்|புதிய படுக்கைகள் அல்லது மெத்தைகள் தயாரித்தல்|சிறப்பு சடங்குகள் இல்லாமல் தகனம் (5 உருவ பொம்மைகள் தேவை)",
    faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    faq1q: "பஞ்சகம் எவ்வளவு காலம் நீடிக்கும்?",
    faq1a:
      "சந்திரன் தொடர்ந்து 5 நட்சத்திரங்கள் – அவிட்டம், சதயம், பூரட்டாதி, உத்திரட்டாதி மற்றும் ரேவதி – வழியாகச் செல்லும்போது பஞ்சகம் தோராயமாக 2.5 நாட்கள் (சுமார் 60 மணிநேரம்) நீடிக்கும்.",
    faq2q: "பஞ்சகம் எவ்வளவு அடிக்கடி நிகழ்கிறது?",
    faq2a:
      "சந்திரன் சுமார் 27.3 நாட்களில் அனைத்து 27 நட்சத்திரங்கள் வழியாக ஒரு முழு சுழற்சியை நிறைவு செய்வதால், பஞ்சகம் தோராயமாக ஒவ்வொரு 27 நாட்களுக்கும் ஒருமுறை நிகழ்கிறது. இதன் பொருள் பஞ்சகம் தோராயமாக மாதத்திற்கு ஒருமுறை நிகழ்கிறது.",
    faq3q: "பஞ்சகத்தின் போது நான் பயணிக்கலாமா?",
    faq3a:
      "பாரம்பரிய நூல்களில் தெற்கு நோக்கிய பயணங்களுக்கு மட்டுமே குறிப்பாக எச்சரிக்கை விடுக்கப்பட்டுள்ளது. மற்ற திசைகளில் பயணம் தடைசெய்யப்படவில்லை. பஞ்சகத்தைப் பொருட்படுத்தாமல் அவசரப் பயணம் எப்போதும் அனுமதிக்கப்படுகிறது.",
    faq4q: "பஞ்சகத்தின் போது ஒருவர் இறந்தால் என்ன நடக்கும்?",
    faq4a:
      "பஞ்சகத்தின் போது மரணம் ஏற்பட்டால், பஞ்சக சாந்தி எனப்படும் சிறப்பு தகன சடங்குகள் செய்யப்படுகின்றன. புல் அல்லது துணியால் செய்யப்பட்ட ஐந்து உருவ பொம்மைகள் உருவாக்கப்பட்டு, உயிருடன் இருக்கும் குடும்ப உறுப்பினர்களைப் பாதுகாக்க இறந்தவருடன் தகனம் செய்யப்படுகின்றன.",
    faq5q: "பஞ்சகம் இந்தியா முழுவதும் அனுசரிக்கப்படுகிறதா?",
    faq5a:
      "பஞ்சகம் வட இந்தியாவில் (உ.பி., பீகார், ராஜஸ்தான், எம்.பி.) மிகவும் கண்டிப்பாக அனுசரிக்கப்படுகிறது. தென் இந்தியாவில், இந்த கருத்து உள்ளது ஆனால் குறைவான கண்டிப்புடன் அனுசரிக்கப்படுகிறது. சில சமூகங்கள் மரண-பஞ்சகம் (அவிட்டம்) மற்றும் அக்னி-பஞ்சகம் (பூரட்டாதி) ஆகியவற்றை மட்டுமே கண்டிப்பாக அசுபமானதாக கருதுகின்றன.",
    learnMore: "பஞ்சகத்தைப் பற்றி மேலும் அறிக",
    seeAlso: "மேலும் பார்க்கவும்",
  },
  te: {
    back: "పంచాంగం",
    title: "నేటి పంచకం",
    active: "పంచకం చురుకుగా ఉంది",
    notActive: "ఈరోజు పంచకం లేదు",
    activeDesc:
      "చంద్రుడు ప్రస్తుతం పంచక నక్షత్రంలో ఉన్నాడు. క్రింద జాబితా చేయబడిన కార్యకలాపాలను నివారించండి.",
    notActiveDesc:
      "చంద్రుడు ప్రస్తుతం ఏ పంచక నక్షత్రంలోనూ లేడు. అన్ని కార్యకలాపాలు uneestricted.",
    currentNakshatra: "ప్రస్తుత చంద్ర నక్షత్రం",
    panchakType: "పంచక రకం",
    nakshatrasTable: "5 పంచక నక్షత్రాలు",
    nakshatra: "నక్షత్రం",
    fear: "భయ రకం",
    avoid: "నివారించాల్సిన కార్యకలాపాలు",
    avoidDuring: "పంచకం సమయంలో నివారించాల్సిన కార్యకలాపాలు",
    avoidItems:
      "కలప, గడ్డి లేదా ఇంధనం సేకరించడం|కప్పులు నిర్మించడం లేదా మరమ్మత్తు చేయడం|దక్షిణ దిశగా ప్రయాణాలు ప్రారంభించడం|కొత్త పడకలు లేదా పరుపులు తయారు చేయడం|ప్రత్యేక ఆచారాలు లేకుండా దహనం (5 దిష్టిబొమ్మలు అవసరం)",
    faq: "తరచుగా అడిగే ప్రశ్నలు",
    faq1q: "పంచకం ఎంతకాలం ఉంటుంది?",
    faq1a:
      "చంద్రుడు ధనిష్ఠ, శతభిష, పూర్వాభాద్రపద, ఉత్తరాభాద్రపద మరియు రేవతి అనే 5 వరుస నక్షత్రాల గుండా సంచరించేటప్పుడు పంచకం సుమారు 2.5 రోజులు (సుమారు 60 గంటలు) ఉంటుంది.",
    faq2q: "పంచకం ఎంత తరచుగా వస్తుంది?",
    faq2a:
      "చంద్రుడు సుమారు 27.3 రోజులలో అన్ని 27 నక్షత్రాల గుండా ఒక పూర్తి చక్రాన్ని పూర్తి చేస్తాడు కాబట్టి, పంచకం సుమారు ప్రతి 27 రోజులకు ఒకసారి వస్తుంది. దీని అర్థం పంచకం సుమారు నెలకు ఒకసారి జరుగుతుంది.",
    faq3q: "పంచకం సమయంలో నేను ప్రయాణించవచ్చా?",
    faq3a:
      "శాస్త్రీయ గ్రంథాలలో దక్షిణ దిశగా ప్రయాణాలకు మాత్రమే ప్రత్యేకంగా హెచ్చరించబడింది. ఇతర దిశలలో ప్రయాణం పరిమితం కాదు. పంచకంతో సంబంధం లేకుండా అత్యవసర ప్రయాణం ఎల్లప్పుడూ అనుమతించబడుతుంది.",
    faq4q: "పంచకం సమయంలో ఎవరైనా మరణిస్తే ఏమి జరుగుతుంది?",
    faq4a:
      "పంచకం సమయంలో మరణం సంభవిస్తే, పంచక శాంతి అని పిలువబడే ప్రత్యేక దహన సంస్కారాలు నిర్వహిస్తారు. గడ్డి లేదా వస్త్రంతో చేసిన ఐదు దిష్టిబొమ్మలను తయారు చేసి, జీవించి ఉన్న కుటుంబ సభ్యులను రక్షించడానికి మరణించిన వారితో పాటు దహనం చేస్తారు.",
    faq5q: "పంచకం భారతదేశం అంతటా పాటించబడుతుందా?",
    faq5a:
      "పంచకం ఉత్తర భారతదేశంలో (యుపి, బీహార్, రాజస్థాన్, ఎంపి) అత్యంత కఠినంగా పాటించబడుతుంది. దక్షిణ భారతదేశంలో, ఈ భావన ఉంది కానీ తక్కువ కఠినత్వంతో పాటించబడుతుంది. కొన్ని సంఘాలు మృత్యు-పంచకం (ధనిష్ఠ) మరియు అగ్ని-పంచకం (పూర్వాభాద్రపద) లను మాత్రమే కఠినంగా అశుభకరమైనవిగా భావిస్తాయి.",
    learnMore: "పంచకం గురించి మరింత తెలుసుకోండి",
    seeAlso: "ఇవి కూడా చూడండి",
  },
  bn: {
    back: "পঞ্জিকা",
    title: "আজকের পঞ্চক",
    active: "পঞ্চক সক্রিয় আছে",
    notActive: "আজ কোনো পঞ্চক নেই",
    activeDesc:
      "চন্দ্র বর্তমানে পঞ্চক নক্ষত্রে আছে। নিচে তালিকাভুক্ত কাজগুলি এড়িয়ে চলুন।",
    notActiveDesc: "চন্দ্র এখন কোনো পঞ্চক নক্ষত্রে নেই। সমস্ত কাজ অবাধ।",
    currentNakshatra: "বর্তমান চন্দ্র নক্ষত্র",
    panchakType: "পঞ্চকের প্রকার",
    nakshatrasTable: "৫টি পঞ্চক নক্ষত্র",
    nakshatra: "নক্ষত্র",
    fear: "ভয়ের প্রকার",
    avoid: "এড়িয়ে চলার কাজ",
    avoidDuring: "পঞ্চকের সময় এড়িয়ে চলার কাজ",
    avoidItems:
      "কাঠ, খড় বা জ্বালানি সংগ্রহ করা|ছাদ তৈরি বা মেরামত করা|দক্ষিণমুখী যাত্রা শুরু করা|নতুন বিছানা বা গদি তৈরি করা|বিশেষ আচার ছাড়া দাহ (৫টি প্রতিমা প্রয়োজন)",
    faq: "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী",
    faq1q: "পঞ্চক কতক্ষণ স্থায়ী হয়?",
    faq1a:
      "চন্দ্র যখন ধনিষ্ঠা, শতভিষা, পূর্ব ভাদ্রপদ, উত্তর ভাদ্রপদ এবং রেবতী – এই ৫টি পরপর নক্ষত্রের মধ্য দিয়ে গমন করে, তখন পঞ্চক প্রায় ২.৫ দিন (প্রায় ৬০ ঘন্টা) স্থায়ী হয়।",
    faq2q: "পঞ্চক কত ঘন ঘন ঘটে?",
    faq2a:
      "পঞ্চক প্রায় ২৭ দিন পর পর ঘটে, কারণ চন্দ্র প্রায় ২৭.৩ দিনে সমস্ত ২৭টি নক্ষত্রের মধ্য দিয়ে একটি পূর্ণ চক্র সম্পন্ন করে। এর অর্থ হল পঞ্চক প্রায় মাসে একবার ঘটে।",
    faq3q: "পঞ্চকের সময় কি আমি ভ্রমণ করতে পারি?",
    faq3a:
      "শাস্ত্রীয় গ্রন্থগুলিতে কেবল দক্ষিণমুখী যাত্রার বিরুদ্ধে বিশেষভাবে সতর্ক করা হয়েছে। অন্যান্য দিকে ভ্রমণ সীমাবদ্ধ নয়। পঞ্চক নির্বিশেষে জরুরি ভ্রমণ সর্বদা অনুমোদিত।",
    faq4q: "পঞ্চকের সময় কেউ মারা গেলে কী হয়?",
    faq4a:
      "পঞ্চকের সময় মৃত্যু হলে, পঞ্চক শান্তি নামক বিশেষ দাহ-সংস্কার করা হয়। ঘাস বা কাপড় দিয়ে তৈরি পাঁচটি প্রতিমা তৈরি করা হয় এবং জীবিত পরিবারের সদস্যদের রক্ষা করার জন্য মৃতের সাথে দাহ করা হয়।",
    faq5q: "পঞ্চক কি সারা ভারতে পালিত হয়?",
    faq5a:
      "পঞ্চক উত্তর ভারতে (ইউপি, বিহার, রাজস্থান, এমপি) সবচেয়ে কঠোরভাবে পালিত হয়। দক্ষিণ ভারতে, এই ধারণা বিদ্যমান কিন্তু কম কঠোরতার সাথে পালিত হয়। কিছু সম্প্রদায় কেবল মৃত্যু-পঞ্চক (ধনিষ্ঠা) এবং অগ্নি-পঞ্চক (পূর্ব ভাদ্রপদ) কে কঠোরভাবে অশুভ বলে মনে করে।",
    learnMore: "পঞ্চক সম্পর্কে আরও জানুন",
    seeAlso: "আরও দেখুন",
  },
  gu: {
    back: "પંચાંગ",
    title: "આજનું પંચક",
    active: "પંચક સક્રિય છે",
    notActive: "આજે કોઈ પંચક નથી",
    activeDesc:
      "ચંદ્ર હાલમાં પંચક નક્ષત્રમાં છે. નીચે સૂચિબદ્ધ પ્રવૃત્તિઓ ટાળો.",
    notActiveDesc:
      "ચંદ્ર હાલમાં કોઈ પંચક નક્ષત્રમાં નથી. બધી પ્રવૃત્તિઓ પ્રતિબંધિત નથી.",
    currentNakshatra: "વર્તમાન ચંદ્ર નક્ષત્ર",
    panchakType: "પંચક પ્રકાર",
    nakshatrasTable: "5 પંચક નક્ષત્રો",
    nakshatra: "નક્ષત્ર",
    fear: "ભયનો પ્રકાર",
    avoid: "ટાળવા જેવી પ્રવૃત્તિઓ",
    avoidDuring: "પંચક દરમિયાન ટાળવા જેવી પ્રવૃત્તિઓ",
    avoidItems:
      "લાકડું, ઘાસ અથવા બળતણ એકત્ર કરવું|છત બનાવવી અથવા સુધારવી|દક્ષિણ દિશાની યાત્રાઓ શરૂ કરવી|નવા પલંગ અથવા ગાદલા બનાવવા|વિશેષ વિધિઓ વિના અગ્નિસંસ્કાર (5 પૂતળાં જરૂરી)",
    faq: "વારંવાર પૂછાતા પ્રશ્નો",
    faq1q: "પંચક કેટલો સમય ચાલે છે?",
    faq1a:
      "ચંદ્ર ધનિષ્ઠા, શતભિષા, પૂર્વ ભાદ્રપદ, ઉત્તર ભાદ્રપદ અને રેવતી – આ 5 ક્રમિક નક્ષત્રોમાંથી પસાર થાય ત્યારે પંચક આશરે 2.5 દિવસ (લગભગ 60 કલાક) ચાલે છે.",
    faq2q: "પંચક કેટલી વાર થાય છે?",
    faq2a:
      "પંચક આશરે દર 27 દિવસે થાય છે, કારણ કે ચંદ્ર લગભગ 27.3 દિવસમાં તમામ 27 નક્ષત્રોમાંથી એક સંપૂર્ણ ચક્ર પૂર્ણ કરે છે. આનો અર્થ એ છે કે પંચક લગભગ મહિનામાં એકવાર થાય છે.",
    faq3q: "શું હું પંચક દરમિયાન મુસાફરી કરી શકું?",
    faq3a:
      "શાસ્ત્રીય ગ્રંથોમાં ફક્ત દક્ષિણ દિશાની યાત્રાઓ સામે ખાસ ચેતવણી આપવામાં આવી છે. અન્ય દિશાઓમાં મુસાફરી પ્રતિબંધિત નથી. પંચકને ધ્યાનમાં લીધા વિના કટોકટીની મુસાફરી હંમેશા માન્ય છે.",
    faq4q: "જો કોઈ પંચક દરમિયાન મૃત્યુ પામે તો શું થાય?",
    faq4a:
      "જો પંચક દરમિયાન મૃત્યુ થાય, તો પંચક શાંતિ નામની વિશેષ અગ્નિસંસ્કાર વિધિઓ કરવામાં આવે છે. ઘાસ અથવા કપડાના બનેલા પાંચ પૂતળાં બનાવવામાં આવે છે અને જીવિત પરિવારના સભ્યોને બચાવવા માટે મૃતકની સાથે અગ્નિસંસ્કાર કરવામાં આવે છે.",
    faq5q: "શું પંચક સમગ્ર ભારતમાં પાળવામાં આવે છે?",
    faq5a:
      "પંચક ઉત્તર ભારતમાં (યુપી, બિહાર, રાજસ્થાન, એમપી) સૌથી કડક રીતે પાળવામાં આવે છે. દક્ષિણ ભારતમાં, આ ખ્યાલ અસ્તિત્વમાં છે પરંતુ ઓછી કડકતા સાથે પાળવામાં આવે છે. કેટલાક સમુદાયો ફક્ત મૃત્યુ-પંચક (ધનિષ્ઠા) અને અગ્નિ-પંચક (પૂર્વ ભાદ્રપદ) ને જ સખત રીતે અશુભ માને છે.",
    learnMore: "પંચક વિશે વધુ જાણો",
    seeAlso: "આ પણ જુઓ",
  },
  kn: {
    back: "ಪಂಚಾಂಗ",
    title: "ಇಂದಿನ ಪಂಚಕ",
    active: "ಪಂಚಕ ಸಕ್ರಿಯವಾಗಿದೆ",
    notActive: "ಇಂದು ಪಂಚಕವಿಲ್ಲ",
    activeDesc:
      "ಚಂದ್ರನು ಪ್ರಸ್ತುತ ಪಂಚಕ ನಕ್ಷತ್ರದಲ್ಲಿದ್ದಾನೆ. ಕೆಳಗೆ ಪಟ್ಟಿ ಮಾಡಲಾದ ಚಟುವಟಿಕೆಗಳನ್ನು ತಪ್ಪಿಸಿ.",
    notActiveDesc:
      "ಚಂದ್ರನು ಈಗ ಯಾವುದೇ ಪಂಚಕ ನಕ್ಷತ್ರದಲ್ಲಿಲ್ಲ. ಎಲ್ಲಾ ಚಟುವಟಿಕೆಗಳು ನಿರ್ಬಂಧಿತವಾಗಿಲ್ಲ.",
    currentNakshatra: "ಪ್ರಸ್ತುತ ಚಂದ್ರ ನಕ್ಷತ್ರ",
    panchakType: "ಪಂಚಕ ಪ್ರಕಾರ",
    nakshatrasTable: "5 ಪಂಚಕ ನಕ್ಷತ್ರಗಳು",
    nakshatra: "ನಕ್ಷತ್ರ",
    fear: "ಭಯದ ಪ್ರಕಾರ",
    avoid: "ತಪ್ಪಿಸಬೇಕಾದ ಚಟುವಟಿಕೆಗಳು",
    avoidDuring: "ಪಂಚಕದ ಸಮಯದಲ್ಲಿ ತಪ್ಪಿಸಬೇಕಾದ ಚಟುವಟಿಕೆಗಳು",
    avoidItems:
      "ಮರ, ಹುಲ್ಲು ಅಥವಾ ಇಂಧನ ಸಂಗ್ರಹಿಸುವುದು|ಛಾವಣಿಗಳನ್ನು ನಿರ್ಮಿಸುವುದು ಅಥವಾ ದುರಸ್ತಿ ಮಾಡುವುದು|ದಕ್ಷಿಣ ದಿಕ್ಕಿನ ಪ್ರಯಾಣಗಳನ್ನು ಪ್ರಾರಂಭಿಸುವುದು|ಹೊಸ ಹಾಸಿಗೆಗಳು ಅಥವಾ ಮೆತ್ತೆಗಳನ್ನು ತಯಾರಿಸುವುದು|ವಿಶೇಷ ವಿಧಿಗಳಿಲ್ಲದೆ ದಹನ (5 ಪ್ರತಿಕೃತಿಗಳು ಅಗತ್ಯವಿದೆ)",
    faq: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
    faq1q: "ಪಂಚಕ ಎಷ್ಟು ಕಾಲ ಇರುತ್ತದೆ?",
    faq1a:
      "ಚಂದ್ರನು ಧನಿಷ್ಠ, ಶತಭಿಷ, ಪೂರ್ವಭಾದ್ರಪದ, ಉತ್ತರಭಾದ್ರಪದ ಮತ್ತು ರೇವತಿ – ಈ 5 ಸತತ ನಕ್ಷತ್ರಗಳ ಮೂಲಕ ಸಾಗುವಾಗ ಪಂಚಕವು ಸುಮಾರು 2.5 ದಿನಗಳವರೆಗೆ (ಸುಮಾರು 60 ಗಂಟೆಗಳು) ಇರುತ್ತದೆ.",
    faq2q: "ಪಂಚಕ ಎಷ್ಟು ಬಾರಿ ಸಂಭವಿಸುತ್ತದೆ?",
    faq2a:
      "ಚಂದ್ರನು ಸುಮಾರು 27.3 ದಿನಗಳಲ್ಲಿ ಎಲ್ಲಾ 27 ನಕ್ಷತ್ರಗಳ ಮೂಲಕ ಒಂದು ಪೂರ್ಣ ಚಕ್ರವನ್ನು ಪೂರ್ಣಗೊಳಿಸುವುದರಿಂದ, ಪಂಚಕವು ಸುಮಾರು ಪ್ರತಿ 27 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಂಭವಿಸುತ್ತದೆ. ಇದರರ್ಥ ಪಂಚಕವು ಸರಿಸುಮಾರು ತಿಂಗಳಿಗೆ ಒಮ್ಮೆ ಸಂಭವಿಸುತ್ತದೆ.",
    faq3q: "ಪಂಚಕದ ಸಮಯದಲ್ಲಿ ನಾನು ಪ್ರಯಾಣಿಸಬಹುದೇ?",
    faq3a:
      "ಶಾಸ್ತ್ರೀಯ ಗ್ರಂಥಗಳಲ್ಲಿ ದಕ್ಷಿಣ ದಿಕ್ಕಿನ ಪ್ರಯಾಣಗಳ ಬಗ್ಗೆ ಮಾತ್ರ ನಿರ್ದಿಷ್ಟವಾಗಿ ಎಚ್ಚರಿಕೆ ನೀಡಲಾಗಿದೆ. ಇತರ ದಿಕ್ಕುಗಳಲ್ಲಿ ಪ್ರಯಾಣ ನಿರ್ಬಂಧಿತವಾಗಿಲ್ಲ. ಪಂಚಕವನ್ನು ಲೆಕ್ಕಿಸದೆ ತುರ್ತು ಪ್ರಯಾಣ ಯಾವಾಗಲೂ ಅನುಮತಿಸಲಾಗಿದೆ.",
    faq4q: "ಪಂಚಕದ ಸಮಯದಲ್ಲಿ ಯಾರಾದರೂ ಮರಣ ಹೊಂದಿದರೆ ಏನಾಗುತ್ತದೆ?",
    faq4a:
      "ಪಂಚಕದ ಸಮಯದಲ್ಲಿ ಮರಣ ಸಂಭವಿಸಿದರೆ, ಪಂಚಕ ಶಾಂತಿ ಎಂಬ ವಿಶೇಷ ದಹನ ಸಂಸ್ಕಾರಗಳನ್ನು ನಡೆಸಲಾಗುತ್ತದೆ. ಹುಲ್ಲು ಅಥವಾ ಬಟ್ಟೆಯಿಂದ ಮಾಡಿದ ಐದು ಪ್ರತಿಕೃತಿಗಳನ್ನು ರಚಿಸಿ, ಬದುಕುಳಿದ ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ರಕ್ಷಿಸಲು ಮೃತರೊಂದಿಗೆ ದಹಿಸಲಾಗುತ್ತದೆ.",
    faq5q: "ಪಂಚಕವನ್ನು ಭಾರತದಾದ್ಯಂತ ಆಚರಿಸಲಾಗುತ್ತದೆಯೇ?",
    faq5a:
      "ಪಂಚಕವನ್ನು ಉತ್ತರ ಭಾರತದಲ್ಲಿ (ಯುಪಿ, ಬಿಹಾರ, ರಾಜಸ್ಥಾನ, ಎಂಪಿ) ಹೆಚ್ಚು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಆಚರಿಸಲಾಗುತ್ತದೆ. ದಕ್ಷಿಣ ಭಾರತದಲ್ಲಿ, ಈ ಪರಿಕಲ್ಪನೆ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ ಆದರೆ ಕಡಿಮೆ ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಆಚರಿಸಲಾಗುತ್ತದೆ. ಕೆಲವು ಸಮುದಾಯಗಳು ಮೃತ್ಯು-ಪಂಚಕ (ಧನಿಷ್ಠ) ಮತ್ತು ಅಗ್ನಿ-ಪಂಚಕ (ಪೂರ್ವಭಾದ್ರಪದ) ಗಳನ್ನು ಮಾತ್ರ ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಅಶುಭವೆಂದು ಪರಿಗಣಿಸುತ್ತವೆ.",
    learnMore: "ಪಂಚಕದ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    seeAlso: "ಇದನ್ನೂ ನೋಡಿ",
  },
};

// ─── Panchak nakshatra table data ─────────────────────────────
const PANCHAK_TABLE = [
  {
    id: 23,
    name: { en: "Dhanishtha", hi: "धनिष्ठा" },
    fear: { en: "Death", hi: "मृत्यु" },
    avoid: { en: "Cremation, funeral rites", hi: "अंत्येष्टि, श्राद्ध कर्म" },
    icon: Skull,
    color: "text-red-400",
  },
  {
    id: 24,
    name: { en: "Shatabhisha", hi: "शतभिषा" },
    fear: { en: "Disease", hi: "रोग" },
    avoid: { en: "Starting medical treatments", hi: "नई चिकित्सा" },
    icon: HeartPulse,
    color: "text-amber-400",
  },
  {
    id: 25,
    name: { en: "Purva Bhadrapada", hi: "पूर्वा भाद्रपद" },
    fear: { en: "Fire", hi: "अग्नि" },
    avoid: {
      en: "Collecting fuel, building roofs",
      hi: "ईंधन संग्रह, छत निर्माण",
    },
    icon: Flame,
    color: "text-orange-400",
  },
  {
    id: 26,
    name: { en: "Uttara Bhadrapada", hi: "उत्तरा भाद्रपद" },
    fear: { en: "Financial Loss", hi: "आर्थिक हानि" },
    avoid: { en: "Major investments, contracts", hi: "बड़े निवेश, अनुबंध" },
    icon: DollarSign,
    color: "text-yellow-400",
  },
  {
    id: 27,
    name: { en: "Revati", hi: "रेवती" },
    fear: { en: "Travel Danger", hi: "यात्रा खतरा" },
    avoid: { en: "Southward journeys", hi: "दक्षिण दिशा की यात्रा" },
    icon: Navigation,
    color: "text-blue-400",
  },
];

// ─── Animation ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function PanchakPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: "var(--font-devanagari-heading)" }
    : { fontFamily: "var(--font-heading)" };
  const L = LABELS[locale] || LABELS.en;

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

  // Round 2 TZ-7 — "today" in the selected city's timezone, not browser's.
  const [year, month, day] = todayInTimezone(selectedCity.timezone)
    .split("-")
    .map(Number);

  const panchang = useMemo(() => {
    const tzOffset = getUTCOffsetForDate(
      year,
      month,
      day,
      selectedCity.timezone,
    );
    const input: PanchangInput = {
      year,
      month,
      day,
      lat: selectedCity.lat,
      lng: selectedCity.lng,
      tzOffset,
      timezone: selectedCity.timezone,
      locationName: selectedCity.name.en,
    };
    return computePanchang(input);
  }, [year, month, day, selectedCity]);

  // Check Panchak from current Moon nakshatra
  const nakshatraId = panchang.nakshatra?.id ?? 1;
  const panchakInfo = useMemo(() => checkPanchak(nakshatraId), [nakshatraId]);

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

  const nakshatraName = panchang.nakshatra?.name
    ? pickByScript(panchang.nakshatra.name.en, panchang.nakshatra.name.hi, locale)
    : "";

  const avoidItems = L.avoidItems.split("|");

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(generateBreadcrumbLD("/panchak", locale)),
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
          <p className="text-text-secondary flex items-center gap-1.5 mt-1">
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

        {/* Status card */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className={`rounded-xl border p-6 mb-8 ${
            panchakInfo.isActive
              ? "bg-red-500/10 border-red-500/30"
              : "bg-green-500/10 border-green-500/30"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {panchakInfo.isActive ? (
              <ShieldOff size={28} className="text-red-400" />
            ) : (
              <CheckCircle size={28} className="text-green-400" />
            )}
            <h2
              className={`text-2xl font-bold ${panchakInfo.isActive ? "text-red-400" : "text-green-400"}`}
              style={headingFont}
            >
              {panchakInfo.isActive ? L.active : L.notActive}
            </h2>
          </div>
          <p className="text-text-primary mb-4">
            {panchakInfo.isActive ? L.activeDesc : L.notActiveDesc}
          </p>

          {/* Current nakshatra info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="text-text-secondary text-sm mb-1">
                {L.currentNakshatra}
              </p>
              <p className="text-text-primary text-lg font-semibold flex items-center gap-2">
                <Moon size={18} className="text-gold-primary" />
                {nakshatraName} (#{nakshatraId})
              </p>
            </div>
            {panchakInfo.isActive && panchakInfo.type && (
              <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                <p className="text-text-secondary text-sm mb-1">
                  {L.panchakType}
                </p>
                <p className="text-text-primary text-lg font-semibold flex items-center gap-2">
                  <Shield size={18} className="text-red-400" />
                  {pickByScript(panchakInfo.description.en, panchakInfo.description.hi, locale)}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Nakshatra table */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mb-8"
        >
          <h2
            className="text-xl font-bold text-gold-light mb-4"
            style={headingFont}
          >
            {L.nakshatrasTable}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-text-secondary font-medium">
                    #
                  </th>
                  <th className="text-left py-2 px-3 text-text-secondary font-medium">
                    {L.nakshatra}
                  </th>
                  <th className="text-left py-2 px-3 text-text-secondary font-medium">
                    {L.fear}
                  </th>
                  <th className="text-left py-2 px-3 text-text-secondary font-medium">
                    {L.avoid}
                  </th>
                </tr>
              </thead>
              <tbody>
                {PANCHAK_TABLE.map((nak) => {
                  const Icon = nak.icon;
                  const isCurrentNak = nakshatraId === nak.id;
                  return (
                    <tr
                      key={nak.id}
                      className={`border-b border-white/5 ${isCurrentNak ? "bg-gold-primary/10" : ""}`}
                    >
                      <td className="py-3 px-3 text-text-secondary">
                        {nak.id}
                      </td>
                      <td className="py-3 px-3 text-text-primary font-medium flex items-center gap-2">
                        <Icon size={16} className={nak.color} />
                        {pickByScript(nak.name.en, nak.name.hi, locale)}
                        {isCurrentNak && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-gold-primary/20 text-gold-light">
                            NOW
                          </span>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${nak.color} font-medium`}>
                        {pickByScript(nak.fear.en, nak.fear.hi, locale)}
                      </td>
                      <td className="py-3 px-3 text-text-secondary">
                        {pickByScript(nak.avoid.en, nak.avoid.hi, locale)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Activities to avoid */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mb-8"
        >
          <h2
            className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2"
            style={headingFont}
          >
            <AlertTriangle size={20} className="text-red-400" />
            {L.avoidDuring}
          </h2>
          <ul className="space-y-2 ml-1">
            {avoidItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <span className="text-red-400 mt-1.5 flex-shrink-0">
                  &#8226;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <GoldDivider />

        {/* FAQ */}
        <motion.section
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 mb-8"
        >
          <h2
            className="text-xl font-bold text-gold-light mb-4"
            style={headingFont}
          >
            {L.faq}
          </h2>
          <div className="space-y-3">
            {[
              { q: L.faq1q, a: L.faq1a, id: "panchak-faq1" },
              { q: L.faq2q, a: L.faq2a, id: "panchak-faq2" },
              { q: L.faq3q, a: L.faq3a, id: "panchak-faq3" },
              { q: L.faq4q, a: L.faq4a, id: "panchak-faq4" },
              { q: L.faq5q, a: L.faq5a, id: "panchak-faq5" },
            ].map((faq, i) => (
              <InfoBlock
                key={faq.id}
                id={faq.id}
                title={faq.q}
                defaultOpen={i === 0}
              >
                <p className="text-text-primary text-sm leading-relaxed">
                  {faq.a}
                </p>
              </InfoBlock>
            ))}
          </div>
        </motion.section>

        <GoldDivider />

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
            {[
              { href: "/learn/panchak" as const, label: L.learnMore },
              { href: "/panchang" as const, label: L.back },
              {
                href: "/holashtak" as const,
                label: pickByScript("Holashtak Today", "होलाष्टक", locale),
              },
              {
                href: "/rahu-kaal" as const,
                label: pickByScript("Rahu Kaal", "राहु काल", locale),
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
