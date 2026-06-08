"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Flame,
  AlertTriangle,
  MapPin,
  ArrowLeft,
  CheckCircle,
  ShieldOff,
  Calendar,
  Sparkles,
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
import {
  checkHolashtak,
  HOLASHTAK_AVOID_ACTIVITIES,
} from "@/lib/panchang/holashtak";
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
    title: "Holashtak Today",
    active: "Holashtak is ACTIVE",
    notActive: "No Holashtak Today",
    activeDescPrefix: "Today is Day ",
    activeDescSuffix:
      "/8 of Holashtak. All auspicious activities are restricted.",
    notActiveDesc:
      "Holashtak is not active today. Holashtak occurs during Phalguna Shukla Ashtami to Purnima (8 days before Holi).",
    currentTithi: "Current Tithi",
    currentMasa: "Current Masa (Amanta)",
    currentPaksha: "Current Paksha",
    dayNumber: "Holashtak Day",
    daysUntilHoli: "Days Until Holi",
    activitiesToAvoid: "Activities to Avoid During Holashtak",
    activitiesOkay: "Activities That Are Okay",
    okayItems:
      "Daily routine and office work|Emergency actions|Spiritual practices (enhanced)|Charity and donations|Studying and learning|Holi preparations",
    eightDaysTitle: "The 8 Days of Holashtak",
    faq: "Frequently Asked Questions",
    faq1q: "When does Holashtak occur?",
    faq1a:
      "Holashtak occurs every year from Phalguna Shukla Ashtami to Phalguna Shukla Purnima (Holi). In the Gregorian calendar, this typically falls in February or March. The exact dates change each year since they follow the lunar calendar.",
    faq2q: "Can I get married during Holashtak?",
    faq2a:
      "Marriage ceremonies are strictly avoided during Holashtak in North Indian tradition. This is one of the most important restrictions. If a wedding date falls during Holashtak, families typically reschedule.",
    faq3q: "Is Holashtak observed in South India?",
    faq3a:
      "Holashtak is primarily a North and Central Indian tradition. In South India, the concept is much less prominent, and Holi itself is celebrated differently (as Kamadahana in Karnataka, or modestly in Tamil Nadu/Kerala).",
    faq4q: "Are spiritual practices affected during Holashtak?",
    faq4a:
      "Spiritual practices are actually considered MORE powerful during Holashtak, not less. Fasting, prayer, mantra chanting, meditation, and charitable acts are encouraged and believed to yield enhanced results.",
    faq5q: "What is the difference between Holashtak and Panchak?",
    faq5a:
      "Panchak is based on the Moon's nakshatra position (nakshatras 23-27) and occurs approximately monthly for ~2.5 days. Holashtak is based on the lunar calendar month and tithi (Phalguna Shukla 8-15) and occurs once a year for 8 days before Holi. They restrict different things  –  Panchak focuses on wood/fuel/travel/cremation, while Holashtak restricts ceremonies and new ventures.",
    learnMore: "Learn More About Holashtak",
    seeAlso: "See Also",
  },
  hi: {
    back: "पंचांग",
    title: "आज का होलाष्टक",
    active: "होलाष्टक सक्रिय है",
    notActive: "आज होलाष्टक नहीं है",
    activeDescPrefix: "आज होलाष्टक का दिन ",
    activeDescSuffix: "/8 है। सभी शुभ कार्य वर्जित हैं।",
    notActiveDesc:
      "आज होलाष्टक सक्रिय नहीं है। होलाष्टक फाल्गुन शुक्ल अष्टमी से पूर्णिमा तक (होली से 8 दिन पहले) होता है।",
    currentTithi: "वर्तमान तिथि",
    currentMasa: "वर्तमान मास (अमान्त)",
    currentPaksha: "वर्तमान पक्ष",
    dayNumber: "होलाष्टक दिवस",
    daysUntilHoli: "होली तक दिन",
    activitiesToAvoid: "होलाष्टक में वर्जित कार्य",
    activitiesOkay: "होलाष्टक में अनुमत कार्य",
    okayItems:
      "दैनिक दिनचर्या और कार्यालय कार्य|आपातकालीन कार्य|आध्यात्मिक साधना (विशेष प्रभावी)|दान और दक्षिणा|अध्ययन और शिक्षा|होली की तैयारी",
    eightDaysTitle: "होलाष्टक के 8 दिन",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    faq1q: "होलाष्टक कब होता है?",
    faq1a:
      "होलाष्टक प्रत्येक वर्ष फाल्गुन शुक्ल अष्टमी से फाल्गुन शुक्ल पूर्णिमा (होली) तक होता है। ग्रेगोरियन कैलेंडर में यह आमतौर पर फरवरी या मार्च में आता है।",
    faq2q: "क्या होलाष्टक में विवाह कर सकते हैं?",
    faq2a:
      "उत्तर भारतीय परम्परा में होलाष्टक में विवाह संस्कार सख्ती से वर्जित है। यह सबसे महत्वपूर्ण प्रतिबंधों में से एक है। यदि विवाह की तिथि होलाष्टक में आती है, तो परिवार आमतौर पर पुनर्निर्धारित करते हैं।",
    faq3q: "क्या दक्षिण भारत में होलाष्टक मनाया जाता है?",
    faq3a:
      "होलाष्टक मुख्य रूप से उत्तर और मध्य भारतीय परम्परा है। दक्षिण भारत में यह अवधारणा बहुत कम प्रमुख है।",
    faq4q: "क्या होलाष्टक में आध्यात्मिक साधना प्रभावित होती है?",
    faq4a:
      "आध्यात्मिक साधनाएँ होलाष्टक में अधिक शक्तिशाली मानी जाती हैं। उपवास, प्रार्थना, मंत्र जप, ध्यान और दान को प्रोत्साहित किया जाता है।",
    faq5q: "होलाष्टक और पंचक में क्या अंतर है?",
    faq5a:
      "पंचक चन्द्रमा की नक्षत्र स्थिति (23-27) पर आधारित है और मासिक ~2.5 दिन होता है। होलाष्टक चान्द्र मास और तिथि (फाल्गुन शुक्ल 8-15) पर आधारित है और वर्ष में एक बार 8 दिन होता है।",
    learnMore: "होलाष्टक के बारे में और जानें",
    seeAlso: "यह भी देखें",
  },
  mai: {
    back: "पंचांग",
    title: "आइ होलाश्टक",
    active: "होलाश्टक सक्रिय अछि",
    notActive: "आइ कोनो होलाश्टक नहि",
    activeDescPrefix: "आइ होलाश्टकक दिन ",
    activeDescSuffix: "/8 अछि। सभ शुभ कार्य प्रतिबंधित अछि।",
    notActiveDesc:
      "आइ होलाश्टक सक्रिय नहि अछि। होलाश्टक फाल्गुन शुक्ल अष्टमी सँ पूर्णिमा (होली सँ ८ दिन पहिने) धरि होइत अछि।",
    currentTithi: "वर्तमान तिथि",
    currentMasa: "वर्तमान मास (अमान्त)",
    currentPaksha: "वर्तमान पक्ष",
    dayNumber: "होलाश्टकक दिन",
    daysUntilHoli: "होली धरि दिन",
    activitiesToAvoid: "होलाश्टकक समयमे टाली जएबाक कार्य",
    activitiesOkay: "जे कार्य कएल जा सकैत अछि",
    okayItems:
      "दैनिक दिनचर्या आ कार्यालयक काज|आपातकालीन कार्य|आध्यात्मिक अभ्यास (वर्धित)|दान आ चंदा|अध्ययन आ सीखनाय|होलीक तैयारी",
    eightDaysTitle: "होलाश्टकक ८ दिन",
    faq: "प्रायः पुछल गेल प्रश्न",
    faq1q: "होलाश्टक कहिया होइत अछि?",
    faq1a:
      "होलाश्टक प्रतिवर्ष फाल्गुन शुक्ल अष्टमी सँ फाल्गुन शुक्ल पूर्णिमा (होली) धरि होइत अछि। ग्रेगोरियन कैलेंडरमे, ई सामान्यतः फरवरी वा मार्चमे पड़ैत अछि। सटीक तिथि प्रत्येक वर्ष बदलैत अछि कियाक तँ ई चंद्र कैलेंडरक पालन करैत अछि।",
    faq2q: "की हम होलाश्टकक समयमे विवाह कऽ सकैत छी?",
    faq2a:
      "उत्तर भारतीय परम्परामे होलाश्टकक समयमे विवाह समारोह सँ कड़ाई सँ बचल जाइत अछि। ई सभसँ महत्वपूर्ण प्रतिबंधमे सँ एक अछि। यदि विवाहक तिथि होलाश्टकक समयमे पड़ैत अछि, तँ परिवार सामान्यतः ओकरा पुनर्निर्धारित करैत अछि।",
    faq3q: "की दक्षिण भारतमे होलाश्टक मनाओल जाइत अछि?",
    faq3a:
      "होलाश्टक मुख्य रूप सँ उत्तर आ मध्य भारतीय परम्परा अछि। दक्षिण भारतमे, ई अवधारणा बहुत कम प्रमुख अछि, आ होली स्वयं भिन्न रूप सँ मनाओल जाइत अछि (कर्नाटकमे कामदहनक रूपमे, वा तमिलनाडु/केरलमे सामान्य रूप सँ)।",
    faq4q: "की होलाश्टकक समयमे आध्यात्मिक अभ्यास प्रभावित होइत अछि?",
    faq4a:
      "आध्यात्मिक अभ्यास वास्तवमे होलाश्टकक समयमे कम नहि, बल्कि बेसी शक्तिशाली मानल जाइत अछि। उपवास, प्रार्थना, मंत्र जप, ध्यान, आ धर्मार्थ कार्य प्रोत्साहित कएल जाइत अछि आ मानल जाइत अछि जे एहि सँ वर्धित परिणाम भेटैत अछि।",
    faq5q: "होलाश्टक आ पंचकमे की अंतर अछि?",
    faq5a:
      "पंचक चंद्रमाक नक्षत्र स्थिति (नक्षत्र २३-२७) पर आधारित अछि आ लगभग मासिक रूप सँ ~२.५ दिन धरि होइत अछि। होलाश्टक चंद्र कैलेंडर मास आ तिथि (फाल्गुन शुक्ल ८-१५) पर आधारित अछि आ होली सँ ८ दिन पहिने वर्षमे एक बेर होइत अछि। ई सभ भिन्न-भिन्न चीजकेँ प्रतिबंधित करैत अछि – पंचक लकड़ी/ईंधन/यात्रा/दाह संस्कार पर केंद्रित अछि, जखन कि होलाश्टक समारोह आ नव उद्यमकेँ प्रतिबंधित करैत अछि।",
    learnMore: "होलाश्टकक बारेमे आओर जानू",
    seeAlso: "ईहो देखू",
  },
  mr: {
    back: "पंचांग",
    title: "आज होळाष्टक",
    active: "होळाष्टक सक्रिय आहे",
    notActive: "आज होळाष्टक नाही",
    activeDescPrefix: "आज होळाष्टकाचा दिवस ",
    activeDescSuffix: "/8 आहे. सर्व शुभ कार्ये प्रतिबंधित आहेत.",
    notActiveDesc:
      "आज होळाष्टक सक्रिय नाही. होळाष्टक फाल्गुन शुक्ल अष्टमी ते पौर्णिमा (होळीच्या ८ दिवस आधी) या काळात येते.",
    currentTithi: "सध्याची तिथी",
    currentMasa: "सध्याचा मास (अमांत)",
    currentPaksha: "सध्याचा पक्ष",
    dayNumber: "होळाष्टकाचा दिवस",
    daysUntilHoli: "होळीपर्यंतचे दिवस",
    activitiesToAvoid: "होळाष्टकादरम्यान टाळायची कार्ये",
    activitiesOkay: "जी कार्ये करता येतात",
    okayItems:
      "दैनंदिन दिनचर्या आणि कार्यालयीन काम|आपत्कालीन कृती|आध्यात्मिक सराव (वर्धित)|दान आणि देणग्या|अभ्यास आणि शिक्षण|होळीची तयारी",
    eightDaysTitle: "होळाष्टकाचे ८ दिवस",
    faq: "वारंवार विचारले जाणारे प्रश्न",
    faq1q: "होळाष्टक कधी येते?",
    faq1a:
      "होळाष्टक दरवर्षी फाल्गुन शुक्ल अष्टमी ते फाल्गुन शुक्ल पौर्णिमा (होळी) या काळात येते. ग्रेगोरियन कॅलेंडरनुसार, हे साधारणपणे फेब्रुवारी किंवा मार्चमध्ये येते. चंद्र कॅलेंडरनुसार असल्याने प्रत्येक वर्षी अचूक तारखा बदलतात.",
    faq2q: "मी होळाष्टकादरम्यान लग्न करू शकतो का?",
    faq2a:
      "उत्तर भारतीय परंपरेत होळाष्टकादरम्यान विवाह समारंभ कठोरपणे टाळले जातात. हा सर्वात महत्त्वाच्या निर्बंधांपैकी एक आहे. जर लग्नाची तारीख होळाष्टकादरम्यान येत असेल, तर कुटुंबे सहसा ती पुढे ढकलतात.",
    faq3q: "दक्षिण भारतात होळाष्टक पाळले जाते का?",
    faq3a:
      "होळाष्टक प्रामुख्याने उत्तर आणि मध्य भारतीय परंपरा आहे. दक्षिण भारतात, ही संकल्पना खूप कमी प्रमाणात प्रचलित आहे आणि होळी स्वतःच वेगळ्या पद्धतीने साजरी केली जाते (कर्नाटकात कामदहन म्हणून, किंवा तामिळनाडू/केरळमध्ये सामान्यपणे).",
    faq4q: "होळाष्टकादरम्यान आध्यात्मिक सरावांवर परिणाम होतो का?",
    faq4a:
      "आध्यात्मिक सराव होळाष्टकादरम्यान कमी नव्हे, तर अधिक शक्तिशाली मानले जातात. उपवास, प्रार्थना, मंत्र जप, ध्यान आणि धर्मादाय कृत्ये यांना प्रोत्साहन दिले जाते आणि त्यांचे वर्धित परिणाम मिळतात असे मानले जाते.",
    faq5q: "होळाष्टक आणि पंचक यांच्यात काय फरक आहे?",
    faq5a:
      "पंचक चंद्राच्या नक्षत्राच्या स्थितीवर (नक्षत्र २३-२७) आधारित आहे आणि अंदाजे मासिक ~२.५ दिवसांसाठी येते. होळाष्टक चंद्र कॅलेंडर महिना आणि तिथीवर (फाल्गुन शुक्ल ८-१५) आधारित आहे आणि होळीच्या ८ दिवस आधी वर्षातून एकदा येते. ते वेगवेगळ्या गोष्टींवर निर्बंध घालतात – पंचक लाकूड/इंधन/प्रवास/दहन यावर लक्ष केंद्रित करते, तर होळाष्टक समारंभ आणि नवीन उद्योगांवर निर्बंध घालते.",
    learnMore: "होळाष्टकाविषयी अधिक जाणून घ्या",
    seeAlso: "हे देखील पहा",
  },
  ta: {
    back: "பஞ்சாங்கம்",
    title: "இன்று ஹோலாஷ்டகம்",
    active: "ஹோலாஷ்டகம் செயலில் உள்ளது",
    notActive: "இன்று ஹோலாஷ்டகம் இல்லை",
    activeDescPrefix: "இன்று ஹோலாஷ்டகத்தின் நாள் ",
    activeDescSuffix: "/8. அனைத்து சுப காரியங்களும் தடைசெய்யப்பட்டுள்ளன.",
    notActiveDesc:
      "ஹோலாஷ்டகம் இன்று செயலில் இல்லை. ஹோலாஷ்டகம் பால்குண சுக்ல அஷ்டமி முதல் பௌர்ணமி வரை (ஹோலிக்கு 8 நாட்களுக்கு முன்) நிகழ்கிறது.",
    currentTithi: "தற்போதைய திதி",
    currentMasa: "தற்போதைய மாசம் (அமாந்தம்)",
    currentPaksha: "தற்போதைய பக்ஷம்",
    dayNumber: "ஹோலாஷ்டக நாள்",
    daysUntilHoli: "ஹோலி வரை உள்ள நாட்கள்",
    activitiesToAvoid: "ஹோலாஷ்டகத்தின் போது தவிர்க்க வேண்டிய செயல்கள்",
    activitiesOkay: "செய்யக்கூடிய செயல்கள்",
    okayItems:
      "தினசரி வழக்கமான மற்றும் அலுவலக வேலை|அவசர நடவடிக்கைகள்|ஆன்மீகப் பயிற்சிகள் (மேம்படுத்தப்பட்டவை)|தர்மம் மற்றும் நன்கொடைகள்|படித்தல் மற்றும் கற்றல்|ஹோலி ஏற்பாடுகள்",
    eightDaysTitle: "ஹோலாஷ்டகத்தின் 8 நாட்கள்",
    faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    faq1q: "ஹோலாஷ்டகம் எப்போது நிகழ்கிறது?",
    faq1a:
      "ஹோலாஷ்டகம் ஒவ்வொரு ஆண்டும் பால்குண சுக்ல அஷ்டமி முதல் பால்குண சுக்ல பௌர்ணமி (ஹோலி) வரை நிகழ்கிறது. கிரிகோரியன் நாட்காட்டியில், இது பொதுவாக பிப்ரவரி அல்லது மார்ச் மாதங்களில் வரும். சந்திர நாட்காட்டியைப் பின்பற்றுவதால் ஒவ்வொரு ஆண்டும் சரியான தேதிகள் மாறும்.",
    faq2q: "ஹோலாஷ்டகத்தின் போது நான் திருமணம் செய்து கொள்ளலாமா?",
    faq2a:
      "வட இந்திய பாரம்பரியத்தில் ஹோலாஷ்டகத்தின் போது திருமண விழாக்கள் கண்டிப்பாக தவிர்க்கப்படுகின்றன. இது மிக முக்கியமான கட்டுப்பாடுகளில் ஒன்றாகும். திருமண தேதி ஹோலாஷ்டகத்தின் போது வந்தால், குடும்பங்கள் பொதுவாக அதை ஒத்திவைக்கும்.",
    faq3q: "ஹோலாஷ்டகம் தென் இந்தியாவில் அனுசரிக்கப்படுகிறதா?",
    faq3a:
      "ஹோலாஷ்டகம் முதன்மையாக வட மற்றும் மத்திய இந்திய பாரம்பரியம். தென் இந்தியாவில், இந்த கருத்து மிகவும் குறைவாகவே உள்ளது, மேலும் ஹோலி கர்நாடகாவில் காமதகனமாகவும், அல்லது தமிழ்நாடு/கேரளாவில் மிதமானதாகவும் வேறுபட்ட முறையில் கொண்டாடப்படுகிறது.",
    faq4q: "ஹோலாஷ்டகத்தின் போது ஆன்மீகப் பயிற்சிகள் பாதிக்கப்படுமா?",
    faq4a:
      "ஆன்மீகப் பயிற்சிகள் ஹோலாஷ்டகத்தின் போது குறைவாக அல்ல, மாறாக மிகவும் சக்திவாய்ந்ததாகக் கருதப்படுகின்றன. விரதம், பிரார்த்தனை, மந்திரம் உச்சரித்தல், தியானம் மற்றும் தொண்டு செயல்கள் ஊக்குவிக்கப்படுகின்றன மற்றும் மேம்படுத்தப்பட்ட விளைவுகளைத் தரும் என்று நம்பப்படுகிறது.",
    faq5q: "ஹோலாஷ்டகத்திற்கும் பஞ்சகத்திற்கும் என்ன வித்தியாசம்?",
    faq5a:
      "பஞ்சகம் சந்திரனின் நட்சத்திர நிலையை (நட்சத்திரங்கள் 23-27) அடிப்படையாகக் கொண்டது மற்றும் தோராயமாக மாதந்தோறும் ~2.5 நாட்களுக்கு நிகழ்கிறது. ஹோலாஷ்டகம் சந்திர நாட்காட்டி மாதம் மற்றும் திதியை (பால்குண சுக்ல 8-15) அடிப்படையாகக் கொண்டது மற்றும் ஹோலிக்கு 8 நாட்களுக்கு முன் வருடத்திற்கு ஒரு முறை நிகழ்கிறது. அவை வெவ்வேறு விஷயங்களைக் கட்டுப்படுத்துகின்றன – பஞ்சகம் மரம்/எரிபொருள்/பயணம்/தகனம் ஆகியவற்றில் கவனம் செலுத்துகிறது, அதேசமயம் ஹோலாஷ்டகம் சடங்குகள் மற்றும் புதிய முயற்சிகளைக் கட்டுப்படுத்துகிறது.",
    learnMore: "ஹோலாஷ்டகம் பற்றி மேலும் அறிக",
    seeAlso: "மேலும் காண்க",
  },
  te: {
    back: "పంచాంగం",
    title: "ఈరోజు హోళాష్టకం",
    active: "హోళాష్టకం సక్రియంగా ఉంది",
    notActive: "ఈరోజు హోళాష్టకం లేదు",
    activeDescPrefix: "ఈరోజు హోళాష్టకం యొక్క రోజు ",
    activeDescSuffix: "/8. అన్ని శుభ కార్యాలు నిషేధించబడ్డాయి.",
    notActiveDesc:
      "ఈరోజు హోళాష్టకం సక్రియంగా లేదు. హోళాష్టకం ఫాల్గుణ శుక్ల అష్టమి నుండి పౌర్ణమి వరకు (హోలీకి 8 రోజుల ముందు) వస్తుంది.",
    currentTithi: "ప్రస్తుత తిథి",
    currentMasa: "ప్రస్తుత మాసం (అమాంతం)",
    currentPaksha: "ప్రస్తుత పక్షం",
    dayNumber: "హోళాష్టకం రోజు",
    daysUntilHoli: "హోలీ వరకు రోజులు",
    activitiesToAvoid: "హోళాష్టకం సమయంలో నివారించాల్సిన కార్యకలాపాలు",
    activitiesOkay: "చేయదగిన కార్యకలాపాలు",
    okayItems:
      "రోజువారీ దినచర్య మరియు కార్యాలయ పని|అత్యవసర చర్యలు|ఆధ్యాత్మిక అభ్యాసాలు (మెరుగుపరచబడినవి)|దానధర్మాలు మరియు విరాళాలు|అధ్యయనం మరియు అభ్యాసం|హోలీ సన్నాహాలు",
    eightDaysTitle: "హోళాష్టకం యొక్క 8 రోజులు",
    faq: "తరచుగా అడిగే ప్రశ్నలు",
    faq1q: "హోళాష్టకం ఎప్పుడు వస్తుంది?",
    faq1a:
      "హోళాష్టకం ప్రతి సంవత్సరం ఫాల్గుణ శుక్ల అష్టమి నుండి ఫాల్గుణ శుక్ల పౌర్ణమి (హోలీ) వరకు వస్తుంది. గ్రెగోరియన్ క్యాలెండర్‌లో, ఇది సాధారణంగా ఫిబ్రవరి లేదా మార్చిలో వస్తుంది. చంద్ర క్యాలెండర్‌ను అనుసరించడం వల్ల ప్రతి సంవత్సరం ఖచ్చితమైన తేదీలు మారుతాయి.",
    faq2q: "హోళాష్టకం సమయంలో నేను వివాహం చేసుకోవచ్చా?",
    faq2a:
      "ఉత్తర భారత సంప్రదాయంలో హోళాష్టకం సమయంలో వివాహ వేడుకలు ఖచ్చితంగా నివారించబడతాయి. ఇది అత్యంత ముఖ్యమైన ఆంక్షలలో ఒకటి. వివాహ తేదీ హోళాష్టకం సమయంలో వస్తే, కుటుంబాలు సాధారణంగా దానిని వాయిదా వేస్తాయి.",
    faq3q: "దక్షిణ భారతదేశంలో హోళాష్టకం ఆచరించబడుతుందా?",
    faq3a:
      "హోళాష్టకం ప్రధానంగా ఉత్తర మరియు మధ్య భారతీయ సంప్రదాయం. దక్షిణ భారతదేశంలో, ఈ భావన చాలా తక్కువ ప్రాముఖ్యత కలిగి ఉంది, మరియు హోలీ కర్ణాటకలో కామదహనం వలె లేదా తమిళనాడు/కేరళలో నిరాడంబరంగా విభిన్నంగా జరుపుకుంటారు.",
    faq4q: "హోళాష్టకం సమయంలో ఆధ్యాత్మిక అభ్యాసాలు ప్రభావితమవుతాయా?",
    faq4a:
      "హోళాష్టకం సమయంలో ఆధ్యాత్మిక అభ్యాసాలు తక్కువ కాకుండా, మరింత శక్తివంతమైనవిగా పరిగణించబడతాయి. ఉపవాసం, ప్రార్థన, మంత్ర జపం, ధ్యానం మరియు దానధర్మాలు ప్రోత్సహించబడతాయి మరియు మెరుగైన ఫలితాలను ఇస్తాయని నమ్ముతారు.",
    faq5q: "హోళాష్టకం మరియు పంచకం మధ్య తేడా ఏమిటి?",
    faq5a:
      "పంచకం చంద్రుని నక్షత్ర స్థానం (నక్షత్రాలు 23-27) ఆధారంగా ఉంటుంది మరియు సుమారుగా నెలవారీగా ~2.5 రోజులు వస్తుంది. హోళాష్టకం చంద్ర క్యాలెండర్ నెల మరియు తిథి (ఫాల్గుణ శుక్ల 8-15) ఆధారంగా ఉంటుంది మరియు హోలీకి 8 రోజుల ముందు సంవత్సరానికి ఒకసారి వస్తుంది. అవి వేర్వేరు విషయాలను నిరోధిస్తాయి – పంచకం కలప/ఇంధనం/ప్రయాణం/దహనంపై దృష్టి పెడుతుంది, అయితే హోళాష్టకం వేడుకలు మరియు కొత్త వెంచర్లను నిరోధిస్తుంది.",
    learnMore: "హోళాష్టకం గురించి మరింత తెలుసుకోండి",
    seeAlso: "కూడా చూడండి",
  },
  bn: {
    back: "পঞ্জিকা",
    title: "আজ হোলাষ্টক",
    active: "হোলাষ্টক সক্রিয় আছে",
    notActive: "আজ কোনো হোলাষ্টক নেই",
    activeDescPrefix: "আজ হোলাষ্টকের দিন ",
    activeDescSuffix: "/8। সমস্ত শুভ কাজ নিষিদ্ধ।",
    notActiveDesc:
      "আজ হোলাষ্টক সক্রিয় নেই। হোলাষ্টক ফাল্গুন শুক্লা অষ্টমী থেকে পূর্ণিমা পর্যন্ত (হোলির 8 দিন আগে) হয়।",
    currentTithi: "বর্তমান তিথি",
    currentMasa: "বর্তমান মাস (অমন্ত)",
    currentPaksha: "বর্তমান পক্ষ",
    dayNumber: "হোলাষ্টকের দিন",
    daysUntilHoli: "হোলি পর্যন্ত দিন",
    activitiesToAvoid: "হোলাষ্টকের সময় এড়িয়ে চলার কাজ",
    activitiesOkay: "যে কাজগুলি করা যেতে পারে",
    okayItems:
      "দৈনন্দিন রুটিন এবং অফিসের কাজ|জরুরী কাজ|আধ্যাত্মিক অনুশীলন (উন্নত)|দান এবং অনুদান|অধ্যয়ন এবং শেখা|হোলির প্রস্তুতি",
    eightDaysTitle: "হোলাষ্টকের 8 দিন",
    faq: "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী",
    faq1q: "হোলাষ্টক কখন হয়?",
    faq1a:
      "হোলাষ্টক প্রতি বছর ফাল্গুন শুক্লা অষ্টমী থেকে ফাল্গুন শুক্লা পূর্ণিমা (হোলি) পর্যন্ত হয়। গ্রেগরিয়ান ক্যালেন্ডার অনুসারে, এটি সাধারণত ফেব্রুয়ারি বা মার্চ মাসে পড়ে। চন্দ্র ক্যালেন্ডার অনুসরণ করার কারণে প্রতি বছর সঠিক তারিখগুলি পরিবর্তিত হয়।",
    faq2q: "আমি কি হোলাষ্টকের সময় বিয়ে করতে পারি?",
    faq2a:
      "উত্তর ভারতীয় ঐতিহ্যে হোলাষ্টকের সময় বিবাহ অনুষ্ঠান কঠোরভাবে এড়িয়ে চলা হয়। এটি সবচেয়ে গুরুত্বপূর্ণ নিষেধাজ্ঞার মধ্যে একটি। যদি বিবাহের তারিখ হোলাষ্টকের সময় পড়ে, তবে পরিবারগুলি সাধারণত এটি পুনরায় নির্ধারণ করে।",
    faq3q: "দক্ষিণ ভারতে কি হোলাষ্টক পালন করা হয়?",
    faq3a:
      "হোলাষ্টক মূলত উত্তর এবং মধ্য ভারতীয় ঐতিহ্য। দক্ষিণ ভারতে, এই ধারণাটি অনেক কম প্রচলিত, এবং হোলি নিজেই ভিন্নভাবে উদযাপিত হয় (কর্ণাটকে কামদহন হিসাবে, বা তামিলনাড়ু/কেরলে বিনম্রভাবে)।",
    faq4q: "হোলাষ্টকের সময় কি আধ্যাত্মিক অনুশীলন প্রভাবিত হয়?",
    faq4a:
      "আধ্যাত্মিক অনুশীলনগুলি হোলাষ্টকের সময় কম নয়, বরং আরও শক্তিশালী বলে বিবেচিত হয়। উপবাস, প্রার্থনা, মন্ত্র জপ, ধ্যান এবং দাতব্য কাজগুলিকে উৎসাহিত করা হয় এবং বিশ্বাস করা হয় যে এগুলি উন্নত ফলাফল দেয়।",
    faq5q: "হোলাষ্টক এবং পঞ্চকের মধ্যে পার্থক্য কী?",
    faq5a:
      "পঞ্চক চাঁদের নক্ষত্র অবস্থানের (নক্ষত্র 23-27) উপর ভিত্তি করে এবং প্রায় মাসিক ~2.5 দিনের জন্য হয়। হোলাষ্টক চন্দ্র ক্যালেন্ডার মাস এবং তিথির (ফাল্গুন শুক্লা 8-15) উপর ভিত্তি করে এবং হোলির 8 দিন আগে বছরে একবার হয়। তারা বিভিন্ন জিনিসকে সীমাবদ্ধ করে – পঞ্চক কাঠ/জ্বালানি/ভ্রমণ/দাহন এর উপর মনোযোগ দেয়, যখন হোলাষ্টক অনুষ্ঠান এবং নতুন উদ্যোগকে সীমাবদ্ধ করে।",
    learnMore: "হোলাষ্টক সম্পর্কে আরও জানুন",
    seeAlso: "আরও দেখুন",
  },
  gu: {
    back: "પંચાંગ",
    title: "આજે હોળાષ્ટક",
    active: "હોળાષ્ટક સક્રિય છે",
    notActive: "આજે કોઈ હોળાષ્ટક નથી",
    activeDescPrefix: "આજે હોળાષ્ટકનો દિવસ ",
    activeDescSuffix: "/8 છે. તમામ શુભ કાર્યો પ્રતિબંધિત છે.",
    notActiveDesc:
      "આજે હોળાષ્ટક સક્રિય નથી. હોળાષ્ટક ફાલ્ગુન શુક્લ અષ્ટમીથી પૂનમ સુધી (હોળીના 8 દિવસ પહેલા) આવે છે.",
    currentTithi: "વર્તમાન તિથિ",
    currentMasa: "વર્તમાન માસ (અમાન્ત)",
    currentPaksha: "વર્તમાન પક્ષ",
    dayNumber: "હોળાષ્ટકનો દિવસ",
    daysUntilHoli: "હોળી સુધીના દિવસો",
    activitiesToAvoid: "હોળાષ્ટક દરમિયાન ટાળવા જેવી પ્રવૃત્તિઓ",
    activitiesOkay: "કરી શકાય તેવી પ્રવૃત્તિઓ",
    okayItems:
      "દૈનિક દિનચર્યા અને ઓફિસનું કામ|આકસ્મિક કાર્યો|આધ્યાત્મિક અભ્યાસ (વધારેલા)|દાન અને ભંડોળ|અભ્યાસ અને શિક્ષણ|હોળીની તૈયારીઓ",
    eightDaysTitle: "હોળાષ્ટકના 8 દિવસ",
    faq: "વારંવાર પૂછાતા પ્રશ્નો",
    faq1q: "હોળાષ્ટક ક્યારે આવે છે?",
    faq1a:
      "હોળાષ્ટક દર વર્ષે ફાલ્ગુન શુક્લ અષ્ટમીથી ફાલ્ગુન શુક્લ પૂનમ (હોળી) સુધી આવે છે. ગ્રેગોરિયન કેલેન્ડરમાં, આ સામાન્ય રીતે ફેબ્રુઆરી અથવા માર્ચમાં આવે છે. ચંદ્ર કેલેન્ડરને અનુસરતા હોવાથી દર વર્ષે ચોક્કસ તારીખો બદલાય છે.",
    faq2q: "શું હું હોળાષ્ટક દરમિયાન લગ્ન કરી શકું?",
    faq2a:
      "ઉત્તર ભારતીય પરંપરામાં હોળાષ્ટક દરમિયાન લગ્ન સમારોહ સખત રીતે ટાળવામાં આવે છે. આ સૌથી મહત્વપૂર્ણ પ્રતિબંધો પૈકી એક છે. જો લગ્નની તારીખ હોળાષ્ટક દરમિયાન આવે છે, તો પરિવારો સામાન્ય રીતે તેને ફરીથી શેડ્યૂલ કરે છે.",
    faq3q: "શું દક્ષિણ ભારતમાં હોળાષ્ટક ઉજવવામાં આવે છે?",
    faq3a:
      "હોળાષ્ટક મુખ્યત્વે ઉત્તર અને મધ્ય ભારતીય પરંપરા છે. દક્ષિણ ભારતમાં, આ ખ્યાલ ઘણો ઓછો પ્રચલિત છે, અને હોળી પોતે અલગ રીતે ઉજવવામાં આવે છે (કર્ણાટકમાં કામદહન તરીકે, અથવા તમિલનાડુ/કેરળમાં સાધારણ રીતે).",
    faq4q: "શું હોળાષ્ટક દરમિયાન આધ્યાત્મિક પ્રથાઓ પ્રભાવિત થાય છે?",
    faq4a:
      "આધ્યાત્મિક પ્રથાઓ ખરેખર હોળાષ્ટક દરમિયાન ઓછી નહીં, પરંતુ વધુ શક્તિશાળી માનવામાં આવે છે. ઉપવાસ, પ્રાર્થના, મંત્ર જાપ, ધ્યાન અને સખાવતી કાર્યોને પ્રોત્સાહન આપવામાં આવે છે અને તેનાથી ઉન્નત પરિણામો મળે છે તેવું માનવામાં આવે છે.",
    faq5q: "હોળાષ્ટક અને પંચક વચ્ચે શું તફાવત છે?",
    faq5a:
      "પંચક ચંદ્રની નક્ષત્ર સ્થિતિ (નક્ષત્રો 23-27) પર આધારિત છે અને આશરે માસિક ~2.5 દિવસ માટે થાય છે. હોળાષ્ટક ચંદ્ર કેલેન્ડર માસ અને તિથિ (ફાલ્ગુન શુક્લ 8-15) પર આધારિત છે અને હોળીના 8 દિવસ પહેલા વર્ષમાં એકવાર થાય છે. તેઓ જુદી જુદી વસ્તુઓને પ્રતિબંધિત કરે છે – પંચક લાકડું/બળતણ/પ્રવાસ/અંતિમ સંસ્કાર પર ધ્યાન કેન્દ્રિત કરે છે, જ્યારે હોળાષ્ટક સમારોહ અને નવા સાહસોને પ્રતિબંધિત કરે છે.",
    learnMore: "હોળાષ્ટક વિશે વધુ જાણો",
    seeAlso: "આ પણ જુઓ",
  },
  kn: {
    back: "ಪಂಚಾಂಗ",
    title: "ಇಂದು ಹೋಲಾಷ್ಟಕ",
    active: "ಹೋಲಾಷ್ಟಕ ಸಕ್ರಿಯವಾಗಿದೆ",
    notActive: "ಇಂದು ಹೋಲಾಷ್ಟಕ ಇಲ್ಲ",
    activeDescPrefix: "ಇಂದು ಹೋಲಾಷ್ಟಕದ ದಿನ ",
    activeDescSuffix: "/8. ಎಲ್ಲಾ ಶುಭ ಕಾರ್ಯಗಳು ನಿರ್ಬಂಧಿತವಾಗಿವೆ.",
    notActiveDesc:
      "ಹೋಲಾಷ್ಟಕ ಇಂದು ಸಕ್ರಿಯವಾಗಿಲ್ಲ. ಹೋಲಾಷ್ಟಕವು ಫಾಲ್ಗುಣ ಶುಕ್ಲ ಅಷ್ಟಮಿಯಿಂದ ಪೂರ್ಣಿಮೆಯವರೆಗೆ (ಹೋಳಿಗೆ 8 ದಿನಗಳ ಮೊದಲು) ಸಂಭವಿಸುತ್ತದೆ.",
    currentTithi: "ಪ್ರಸ್ತುತ ತಿಥಿ",
    currentMasa: "ಪ್ರಸ್ತುತ ಮಾಸ (ಅಮಾಂತ)",
    currentPaksha: "ಪ್ರಸ್ತುತ ಪಕ್ಷ",
    dayNumber: "ಹೋಲಾಷ್ಟಕ ದಿನ",
    daysUntilHoli: "ಹೋಳಿಯವರೆಗಿನ ದಿನಗಳು",
    activitiesToAvoid: "ಹೋಲಾಷ್ಟಕದ ಸಮಯದಲ್ಲಿ ತಪ್ಪಿಸಬೇಕಾದ ಚಟುವಟಿಕೆಗಳು",
    activitiesOkay: "ಮಾಡಬಹುದಾದ ಚಟುವಟಿಕೆಗಳು",
    okayItems:
      "ದೈನಂದಿನ ದಿನಚರಿ ಮತ್ತು ಕಚೇರಿ ಕೆಲಸ|ತುರ್ತು ಕ್ರಮಗಳು|ಆಧ್ಯಾತ್ಮಿಕ ಅಭ್ಯಾಸಗಳು (ವರ್ಧಿತ)|ದಾನ ಮತ್ತು ದೇಣಿಗೆಗಳು|ಅಧ್ಯಯನ ಮತ್ತು ಕಲಿಕೆ|ಹೋಳಿ ಸಿದ್ಧತೆಗಳು",
    eightDaysTitle: "ಹೋಲಾಷ್ಟಕದ 8 ದಿನಗಳು",
    faq: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
    faq1q: "ಹೋಲಾಷ್ಟಕ ಯಾವಾಗ ಸಂಭವಿಸುತ್ತದೆ?",
    faq1a:
      "ಹೋಲಾಷ್ಟಕವು ಪ್ರತಿ ವರ್ಷ ಫಾಲ್ಗುಣ ಶುಕ್ಲ ಅಷ್ಟಮಿಯಿಂದ ಫಾಲ್ಗುಣ ಶುಕ್ಲ ಪೂರ್ಣಿಮೆಯವರೆಗೆ (ಹೋಳಿ) ಸಂಭವಿಸುತ್ತದೆ. ಗ್ರೆಗೋರಿಯನ್ ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ, ಇದು ಸಾಮಾನ್ಯವಾಗಿ ಫೆಬ್ರವರಿ ಅಥವಾ ಮಾರ್ಚ್‌ನಲ್ಲಿ ಬರುತ್ತದೆ. ಚಂದ್ರನ ಕ್ಯಾಲೆಂಡರ್ ಅನ್ನು ಅನುಸರಿಸುವುದರಿಂದ ಪ್ರತಿ ವರ್ಷ ನಿಖರವಾದ ದಿನಾಂಕಗಳು ಬದಲಾಗುತ್ತವೆ.",
    faq2q: "ಹೋಲಾಷ್ಟಕದ ಸಮಯದಲ್ಲಿ ನಾನು ಮದುವೆಯಾಗಬಹುದೇ?",
    faq2a:
      "ಉತ್ತರ ಭಾರತೀಯ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಹೋಲಾಷ್ಟಕದ ಸಮಯದಲ್ಲಿ ವಿವಾಹ ಸಮಾರಂಭಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ತಪ್ಪಿಸಲಾಗುತ್ತದೆ. ಇದು ಪ್ರಮುಖ ನಿರ್ಬಂಧಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ. ಮದುವೆಯ ದಿನಾಂಕ ಹೋಲಾಷ್ಟಕದ ಸಮಯದಲ್ಲಿ ಬಂದರೆ, ಕುಟುಂಬಗಳು ಸಾಮಾನ್ಯವಾಗಿ ಅದನ್ನು ಮರುಹೊಂದಿಸುತ್ತವೆ.",
    faq3q: "ದಕ್ಷಿಣ ಭಾರತದಲ್ಲಿ ಹೋಲಾಷ್ಟಕವನ್ನು ಆಚರಿಸಲಾಗುತ್ತದೆಯೇ?",
    faq3a:
      "ಹೋಲಾಷ್ಟಕವು ಪ್ರಾಥಮಿಕವಾಗಿ ಉತ್ತರ ಮತ್ತು ಮಧ್ಯ ಭಾರತೀಯ ಸಂಪ್ರದಾಯವಾಗಿದೆ. ದಕ್ಷಿಣ ಭಾರತದಲ್ಲಿ, ಈ ಪರಿಕಲ್ಪನೆಯು ಬಹಳ ಕಡಿಮೆ ಪ್ರಾಮುಖ್ಯತೆಯನ್ನು ಹೊಂದಿದೆ, ಮತ್ತು ಹೋಳಿಯನ್ನು ಕರ್ನಾಟಕದಲ್ಲಿ ಕಾಮದಹನವಾಗಿ ಅಥವಾ ತಮಿಳುನಾಡು/ಕೇರಳದಲ್ಲಿ ಸಾಧಾರಣವಾಗಿ ವಿಭಿನ್ನವಾಗಿ ಆಚರಿಸಲಾಗುತ್ತದೆ.",
    faq4q: "ಹೋಲಾಷ್ಟಕದ ಸಮಯದಲ್ಲಿ ಆಧ್ಯಾತ್ಮಿಕ ಅಭ್ಯಾಸಗಳು ಪರಿಣಾಮ ಬೀರುತ್ತವೆಯೇ?",
    faq4a:
      "ಆಧ್ಯಾತ್ಮಿಕ ಅಭ್ಯಾಸಗಳು ಹೋಲಾಷ್ಟಕದ ಸಮಯದಲ್ಲಿ ಕಡಿಮೆ ಅಲ್ಲ, ಬದಲಿಗೆ ಹೆಚ್ಚು ಶಕ್ತಿಶಾಲಿ ಎಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ. ಉಪವಾಸ, ಪ್ರಾರ್ಥನೆ, ಮಂತ್ರ ಜಪ, ಧ್ಯಾನ ಮತ್ತು ದಾನ ಕಾರ್ಯಗಳನ್ನು ಪ್ರೋತ್ಸಾಹಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ವರ್ಧಿತ ಫಲಿತಾಂಶಗಳನ್ನು ನೀಡುತ್ತವೆ ಎಂದು ನಂಬಲಾಗಿದೆ.",
    faq5q: "ಹೋಲಾಷ್ಟಕ ಮತ್ತು ಪಂಚಕದ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?",
    faq5a:
      "ಪಂಚಕವು ಚಂದ್ರನ ನಕ್ಷತ್ರ ಸ್ಥಾನವನ್ನು (ನಕ್ಷತ್ರಗಳು 23-27) ಆಧರಿಸಿದೆ ಮತ್ತು ಸರಿಸುಮಾರು ಮಾಸಿಕವಾಗಿ ~2.5 ದಿನಗಳವರೆಗೆ ಸಂಭವಿಸುತ್ತದೆ. ಹೋಲಾಷ್ಟಕವು ಚಂದ್ರನ ಕ್ಯಾಲೆಂಡರ್ ತಿಂಗಳು ಮತ್ತು ತಿಥಿಯನ್ನು (ಫಾಲ್ಗುಣ ಶುಕ್ಲ 8-15) ಆಧರಿಸಿದೆ ಮತ್ತು ಹೋಳಿಗೆ 8 ದಿನಗಳ ಮೊದಲು ವರ್ಷಕ್ಕೊಮ್ಮೆ ಸಂಭವಿಸುತ್ತದೆ. ಅವು ವಿಭಿನ್ನ ವಿಷಯಗಳನ್ನು ನಿರ್ಬಂಧಿಸುತ್ತವೆ – ಪಂಚಕವು ಮರ/ಇಂಧನ/ಪ್ರಯಾಣ/ದಹನದ ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸುತ್ತದೆ, ಆದರೆ ಹೋಲಾಷ್ಟಕವು ಸಮಾರಂಭಗಳು ಮತ್ತು ಹೊಸ ಉದ್ಯಮಗಳನ್ನು ನಿರ್ಬಂಧಿಸುತ್ತದೆ.",
    learnMore: "ಹೋಲಾಷ್ಟಕದ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    seeAlso: "ಇದನ್ನೂ ನೋಡಿ",
  },
};

// ─── 8 day descriptions ───────────────────────────────────────
const EIGHT_DAYS = [
  {
    day: 1,
    tithi: "Ashtami",
    tithiHi: "अष्टमी",
    desc: {
      en: "Beginning of the inauspicious period",
      hi: "अशुभ अवधि की शुरुआत",
    },
  },
  {
    day: 2,
    tithi: "Navami",
    tithiHi: "नवमी",
    desc: {
      en: "Intensity builds. No new ventures",
      hi: "तीव्रता बढ़ती है। कोई नया उद्यम नहीं",
    },
  },
  {
    day: 3,
    tithi: "Dashami",
    tithiHi: "दशमी",
    desc: {
      en: "Focus on existing commitments",
      hi: "मौजूदा प्रतिबद्धताओं पर ध्यान दें",
    },
  },
  {
    day: 4,
    tithi: "Ekadashi",
    tithiHi: "एकादशी",
    desc: {
      en: "Fasting day. Spiritual practices emphasized",
      hi: "उपवास दिवस। आध्यात्मिक साधना पर ज़ोर",
    },
  },
  {
    day: 5,
    tithi: "Dwadashi",
    tithiHi: "द्वादशी",
    desc: { en: "Holi preparations begin", hi: "होली की तैयारी शुरू" },
  },
  {
    day: 6,
    tithi: "Trayodashi",
    tithiHi: "त्रयोदशी",
    desc: {
      en: "Community gathering for Holika Dahan prep",
      hi: "होलिका दहन की तैयारी",
    },
  },
  {
    day: 7,
    tithi: "Chaturdashi",
    tithiHi: "चतुर्दशी",
    desc: {
      en: "Holika Dahan eve  –  pyre assembled",
      hi: "होलिका दहन की पूर्व संध्या",
    },
  },
  {
    day: 8,
    tithi: "Purnima",
    tithiHi: "पूर्णिमा",
    desc: {
      en: "Holika Dahan night, Holi colors next day",
      hi: "होलिका दहन, अगले दिन रंग",
    },
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

export default function HolashtakPage() {
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

  // Round 2 TZ-7 — "today" in the selected city's timezone.
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

  // Check Holashtak from panchang data
  const tithiNumber = panchang.tithi?.number ?? 1;
  const masaAmanta = panchang.amantMasa;
  const paksha = panchang.tithi?.paksha as "shukla" | "krishna" | undefined;

  const holashtakInfo = useMemo(() => {
    return checkHolashtak(tithiNumber, masaAmanta, paksha ?? "krishna");
  }, [tithiNumber, masaAmanta, paksha]);

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

  const tithiName = panchang.tithi?.name
    ? pickByScript(panchang.tithi.name.en, panchang.tithi.name.hi, locale)
    : "";
  const masaName = masaAmanta ? tl(masaAmanta, locale) : "";
  const pakshaDisplay =
    paksha === "shukla"
      ? pickByScript("Shukla", "शुक्ल", locale)
      : pickByScript("Krishna", "कृष्ण", locale);

  const okayItems = L.okayItems.split("|");

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(generateBreadcrumbLD("/holashtak", locale)),
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
            holashtakInfo.isActive
              ? "bg-red-500/10 border-red-500/30"
              : "bg-green-500/10 border-green-500/30"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {holashtakInfo.isActive ? (
              <ShieldOff size={28} className="text-red-400" />
            ) : (
              <CheckCircle size={28} className="text-green-400" />
            )}
            <h2
              className={`text-2xl font-bold ${holashtakInfo.isActive ? "text-red-400" : "text-green-400"}`}
              style={headingFont}
            >
              {holashtakInfo.isActive ? L.active : L.notActive}
            </h2>
          </div>
          <p className="text-text-primary mb-4">
            {holashtakInfo.isActive
              ? `${L.activeDescPrefix}${holashtakInfo.dayNumber}${L.activeDescSuffix}`
              : L.notActiveDesc}
          </p>

          {/* Current panchang info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="text-text-secondary text-sm mb-1">
                {L.currentTithi}
              </p>
              <p className="text-text-primary text-lg font-semibold">
                {tithiName} (#{tithiNumber})
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="text-text-secondary text-sm mb-1">
                {L.currentMasa}
              </p>
              <p className="text-text-primary text-lg font-semibold">
                {masaName}
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="text-text-secondary text-sm mb-1">
                {L.currentPaksha}
              </p>
              <p className="text-text-primary text-lg font-semibold">
                {pakshaDisplay}
              </p>
            </div>
          </div>

          {holashtakInfo.isActive && holashtakInfo.dayNumber && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-gold-primary/10 border border-gold-primary/30 p-4">
                <p className="text-text-secondary text-sm mb-1">
                  {L.dayNumber}
                </p>
                <p className="text-gold-light text-2xl font-bold">
                  {holashtakInfo.dayNumber} / 8
                </p>
              </div>
              <div className="rounded-lg bg-gold-primary/10 border border-gold-primary/30 p-4">
                <p className="text-text-secondary text-sm mb-1">
                  {L.daysUntilHoli}
                </p>
                <p className="text-gold-light text-2xl font-bold">
                  {8 - holashtakInfo.dayNumber}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Activities to avoid */}
        <motion.div
          custom={2}
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
            {L.activitiesToAvoid}
          </h2>
          <ul className="space-y-2 ml-1">
            {HOLASHTAK_AVOID_ACTIVITIES.map((activity, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <span className="text-red-400 mt-1.5 flex-shrink-0">
                  &#8226;
                </span>
                {pickByScript(activity.en, activity.hi, locale)}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Activities that are okay */}
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
            <Sparkles size={20} className="text-green-400" />
            {L.activitiesOkay}
          </h2>
          <ul className="space-y-2 ml-1">
            {okayItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <span className="text-green-400 mt-1.5 flex-shrink-0">
                  &#8226;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <GoldDivider />

        {/* 8 Days breakdown */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mb-8 mt-4"
        >
          <h2
            className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2"
            style={headingFont}
          >
            <Calendar size={20} className="text-gold-primary" />
            {L.eightDaysTitle}
          </h2>
          <div className="space-y-3">
            {EIGHT_DAYS.map((d) => {
              const isCurrent =
                holashtakInfo.isActive && holashtakInfo.dayNumber === d.day;
              return (
                <div
                  key={d.day}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${
                    isCurrent
                      ? "bg-gold-primary/15 border-gold-primary/40"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? "bg-gold-primary/30 border border-gold-primary text-gold-light"
                        : "bg-gold-primary/15 border border-gold-primary/30 text-gold-light"
                    }`}
                  >
                    {d.day}
                  </span>
                  <div>
                    <span
                      className={`font-semibold text-sm ${isCurrent ? "text-gold-light" : "text-text-primary"}`}
                    >
                      {pickByScript(d.tithi, d.tithiHi, locale)}
                      {isCurrent && (
                        <span className="text-xs ml-2 px-1.5 py-0.5 rounded-full bg-gold-primary/20 text-gold-light">
                          TODAY
                        </span>
                      )}
                    </span>
                    <p className="text-text-secondary text-sm mt-0.5">
                      {pickByScript(d.desc.en, d.desc.hi, locale)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <GoldDivider />

        {/* FAQ */}
        <motion.section
          custom={5}
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
              { q: L.faq1q, a: L.faq1a, id: "holashtak-faq1" },
              { q: L.faq2q, a: L.faq2a, id: "holashtak-faq2" },
              { q: L.faq3q, a: L.faq3a, id: "holashtak-faq3" },
              { q: L.faq4q, a: L.faq4a, id: "holashtak-faq4" },
              { q: L.faq5q, a: L.faq5a, id: "holashtak-faq5" },
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
          custom={6}
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
              { href: "/learn/holashtak" as const, label: L.learnMore },
              { href: "/panchang" as const, label: L.back },
              {
                href: "/panchak" as const,
                label: pickByScript("Panchak Today", "आज का पंचक", locale),
              },
              {
                href: "/calendar" as const,
                label:
                  pickByScript("Festival Calendar", "त्योहार कैलेंडर", locale),
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
