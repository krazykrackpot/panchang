"use client";

/**
 * Eclipse Simulator page  –  educational interactive canvas animation of
 * solar and lunar eclipses, with Jyotish (Rahu/Ketu) context.
 *
 * EclipseSimulator is dynamically imported with ssr:false because it uses
 * canvas + requestAnimationFrame which cannot run server-side.
 */

import dynamic from "next/dynamic";
import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";
import { isDevanagariLocale } from "@/lib/utils/locale-fonts";
import type { Locale } from "@/types/panchang";

// Dynamically load the canvas component  –  cannot SSR
const EclipseSimulator = dynamic(
  () => import("@/components/eclipses/EclipseSimulator"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-video rounded-2xl bg-[#111633] border border-gold-primary/15 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
      </div>
    ),
  },
);

// ─── Labels ────────────────────────────────────────────────────────────────────

const LABELS: Record<string, Record<string, string>> = {
  en: {
    backToCalendar: "← Eclipse Calendar",
    pageTitle: "Eclipse Simulator",
    pageSubtitle: "Interactive visualisation of solar and lunar eclipses",
    howTitle: "How eclipses work",
    solarExplain:
      "A solar eclipse occurs when the Moon passes between Earth and the Sun, blocking sunlight. Because the Moon's orbit is tilted ~5° to the ecliptic, this only happens at specific New Moon moments when the Moon crosses the ecliptic plane  –  near Rahu (north node) or Ketu (south node).",
    lunarExplain:
      "A lunar eclipse occurs when Earth passes between the Sun and Moon, casting its shadow on the Moon. This only happens at Full Moon when the Moon is near a node. The Moon turns copper-red during totality because Earth's atmosphere bends red sunlight into the umbra  –  the same reason sunsets are red.",
    jyotishTitle: "Jyotish significance",
    jyotishText1:
      "In Vedic astrology, eclipses mark the mythological battle between the demon Svarbhānu (who became Rahu and Ketu after being sliced by Vishnu's discus) and the Sun/Moon. Eclipses occurring near natal planets  –  especially the Sun, Moon, or lagna lord  –  are considered powerful transit triggers.",
    jyotishText2:
      "The Sutak period begins 12 hours before a solar eclipse and 9 hours before a lunar eclipse. During this time, traditional observances advise fasting, prayer, and avoiding auspicious activities. Eclipse effects in the birth chart are judged by the house and sign where the eclipse falls.",
    jyotishText3:
      "Rahu causes solar eclipses at ascending nodes; Ketu causes them at descending nodes. Rahu eclipses are considered more externally visible (material upheaval), while Ketu eclipses point inward (spiritual transformation).",
    solarLabel: "Solar Eclipse",
    lunarLabel: "Lunar Eclipse",
    simulatorNote:
      "This simulation is educational  –  it illustrates geometric principles, not precise Besselian elements.",
  },
  hi: {
    backToCalendar: "← ग्रहण पञ्चाङ्ग",
    pageTitle: "ग्रहण अनुकर्त्ता",
    pageSubtitle: "सूर्य एवं चन्द्र ग्रहण का इंटरैक्टिव दृश्य प्रदर्शन",
    howTitle: "ग्रहण कैसे होते हैं",
    solarExplain:
      "सूर्य ग्रहण तब होता है जब चन्द्रमा, पृथ्वी और सूर्य के बीच आ जाता है। चन्द्रमा की कक्षा क्रान्तिवृत्त से ~5° झुकी होने के कारण, यह केवल तभी होता है जब चन्द्रमा राहु या केतु के पास अमावस्या पर होता है।",
    lunarExplain:
      "चन्द्र ग्रहण तब होता है जब पृथ्वी, सूर्य और चन्द्रमा के बीच आ जाती है। पूर्ण ग्रहण में चन्द्रमा रक्तिम (ताम्रवर्ण) हो जाता है क्योंकि पृथ्वी का वायुमंडल सूर्य के लाल प्रकाश को मोड़कर पृथ्वी की छाया में भेज देता है।",
    jyotishTitle: "ज्योतिष महत्त्व",
    jyotishText1:
      "वैदिक ज्योतिष में ग्रहण राहु और केतु की पौराणिक कथा से जुड़े हैं। जन्मकुंडली में जिस भाव में ग्रहण पड़ता है, उस भाव के कारकत्व पर विशेष प्रभाव माना जाता है।",
    jyotishText2:
      "सूर्य ग्रहण से 12 घंटे पहले और चन्द्र ग्रहण से 9 घंटे पहले सूतक काल आरम्भ होता है। इस अवधि में उपवास, मन्त्रजाप और ध्यान का विधान है।",
    jyotishText3:
      "राहु आरोही नोड पर सूर्य ग्रहण करता है; केतु अवरोही नोड पर। राहु ग्रहण बाह्य उथल-पुथल का संकेत देते हैं, जबकि केतु ग्रहण आन्तरिक आध्यात्मिक परिवर्तन की ओर इंगित करते हैं।",
    solarLabel: "सूर्य ग्रहण",
    lunarLabel: "चन्द्र ग्रहण",
    simulatorNote:
      "यह अनुकरण शैक्षणिक है  –  यह ज्यामितीय सिद्धान्त दर्शाता है, सटीक बेसेलियन तत्त्व नहीं।",
  },
  ta: {
    backToCalendar: "← கிரகண நாள்காட்டி",
    pageTitle: "கிரகண உருவகப்படுத்தி",
    pageSubtitle: "சூரிய மற்றும் சந்திர கிரகணங்களின் ஊடாடும் காட்சி",
    howTitle: "கிரகணங்கள் எவ்வாறு நிகழ்கின்றன",
    solarExplain:
      "சந்திரன் பூமிக்கும் சூரியனுக்கும் இடையில் வரும்போது சூரிய கிரகணம் நிகழ்கிறது. சந்திரனின் சுற்றுப்பாதை சுமார் 5° சாய்ந்திருப்பதால், இது ராகு அல்லது கேது அருகே அமாவாசையில் மட்டுமே நிகழ்கிறது.",
    lunarExplain:
      "பூமி சூரியனுக்கும் சந்திரனுக்கும் இடையில் வரும்போது சந்திர கிரகணம் நிகழ்கிறது. முழு கிரகணத்தின்போது சந்திரன் செம்பு-சிவப்பு நிறமாக மாறுகிறது.",
    jyotishTitle: "ஜோதிட முக்கியத்துவம்",
    jyotishText1:
      "வேத ஜோதிடத்தில், கிரகணங்கள் ராகு மற்றும் கேதுவின் புராண வரலாற்றோடு தொடர்புடையவை. ஜாதகத்தில் கிரகணம் விழும் இடம் முக்கியமான வாழ்க்கை மாற்றங்களை குறிக்கும்.",
    jyotishText2:
      "சூரிய கிரகணத்திற்கு 12 மணி நேரம் முன்பும், சந்திர கிரகணத்திற்கு 9 மணி நேரம் முன்பும் சூதக காலம் தொடங்குகிறது.",
    jyotishText3:
      "ராகு ஏறு நோடில் சூரிய கிரகணம் ஏற்படுத்துகிறது; கேது இறங்கு நோடில். ராகு கிரகணங்கள் வெளிப்புற மாற்றங்களை, கேது கிரகணங்கள் ஆன்மீக மாற்றங்களை குறிக்கின்றன.",
    solarLabel: "சூரிய கிரகணம்",
    lunarLabel: "சந்திர கிரகணம்",
    simulatorNote:
      "இந்த உருவகப்படுத்தல் கல்வி நோக்கத்திற்கானது  –  இது வடிவியல் கொள்கைகளை விளக்குகிறது.",
  },
  bn: {
    backToCalendar: "← গ্রহণ পঞ্চাঙ্গ",
    pageTitle: "গ্রহণ সিমুলেটর",
    pageSubtitle: "সূর্য ও চন্দ্রগ্রহণের ইন্টারেক্টিভ দৃশ্য প্রদর্শন",
    howTitle: "গ্রহণ কীভাবে হয়",
    solarExplain:
      "চাঁদ পৃথিবী ও সূর্যের মাঝে এলে সূর্যগ্রহণ হয়। চাঁদের কক্ষপথ ক্রান্তিবৃত্ত থেকে ~৫° হেলে থাকায়, এটি কেবল রাহু বা কেতুর কাছে অমাবস্যায় হয়।",
    lunarExplain:
      "পৃথিবী সূর্য ও চাঁদের মাঝে এলে চন্দ্রগ্রহণ হয়। পূর্ণ গ্রহণে চাঁদ তামাটে-লাল হয় কারণ পৃথিবীর বায়ুমণ্ডল লাল আলোকে ছায়ায় বাঁকিয়ে পাঠায়।",
    jyotishTitle: "জ্যোতিষ গুরুত্ব",
    jyotishText1:
      "বৈদিক জ্যোতিষে গ্রহণ রাহু ও কেতুর পৌরাণিক কাহিনীর সাথে যুক্ত। জন্মকুণ্ডলীতে যে ভাবে গ্রহণ পড়ে, তার কারকত্বে বিশেষ প্রভাব হয়।",
    jyotishText2:
      "সূর্যগ্রহণের ১২ ঘণ্টা আগে ও চন্দ্রগ্রহণের ৯ ঘণ্টা আগে সূতক শুরু হয়।",
    jyotishText3:
      "রাহু আরোহী নোডে সূর্যগ্রহণ ঘটায়; কেতু অবরোহী নোডে। রাহু গ্রহণ বাহ্যিক পরিবর্তন, কেতু গ্রহণ আধ্যাত্মিক রূপান্তরের ইঙ্গিত দেয়।",
    solarLabel: "সূর্যগ্রহণ",
    lunarLabel: "চন্দ্রগ্রহণ",
    simulatorNote:
      "এই সিমুলেশন শিক্ষামূলক  –  এটি জ্যামিতিক নীতি দেখায়, সঠিক বেসেলিয়ান উপাদান নয়।",
  },
  mai: {
    backToCalendar: "← ग्रहण पंचांग",
    pageTitle: "ग्रहण सिम्युलेटर",
    pageSubtitle: "सूर्यग्रहण आ चंद्रग्रहणक संवादात्मक दृश्यीकरण",
    howTitle: "ग्रहण केना होइत अछि",
    solarExplain:
      "सूर्यग्रहण तखन होइत अछि जखन चंद्रमा पृथ्वी आ सूर्यक बीच सँ गुजरैत अछि, सूर्यक प्रकाश केँ रोकैत अछि। चंद्रमाक कक्षा क्रांतिवृत्त सँ लगभग ५° झुकाइल रहबाक कारण, ई केवल विशिष्ट नव चंद्रक क्षण मे होइत अछि जखन चंद्रमा क्रांतिवृत्तक समतल केँ पार करैत अछि – राहु (उत्तरी पात बिंदु) वा केतु (दक्षिणी पात बिंदु) क नजदीक।",
    lunarExplain:
      "चंद्रग्रहण तखन होइत अछि जखन पृथ्वी सूर्य आ चंद्रमाक बीच सँ गुजरैत अछि, चंद्रमा पर अपन छाया डालैत अछि। ई केवल पूर्णिमा मे होइत अछि जखन चंद्रमा कोनो पात बिंदु क नजदीक होइत अछि। पृथ्वीक वायुमंडल लाल सूर्यक प्रकाश केँ अंब्रा मे मोड़ैत अछि – ओही कारणेँ सूर्यास्त लाल होइत अछि – एहि कारणेँ चंद्रमा पूर्णताक समय तांबा-लाल भऽ जाइत अछि।",
    jyotishTitle: "ज्योतिषीय महत्व",
    jyotishText1:
      "वैदिक ज्योतिष मे, ग्रहण राक्षस स्वरभानु (जे विष्णु क चक्र सँ कटलाक बाद राहु आ केतु बनलाह) आ सूर्य/चंद्रमाक बीचक पौराणिक युद्ध केँ चिह्नित करैत अछि। जन्मक ग्रहक नजदीक – विशेष रूप सँ सूर्य, चंद्रमा, वा लग्नक स्वामी – होबयवला ग्रहण केँ शक्तिशाली गोचरक कारक मानल जाइत अछि।",
    jyotishText2:
      "सूतक काल सूर्यग्रहण सँ १२ घंटा पहिने आ चंद्रग्रहण सँ ९ घंटा पहिने शुरू होइत अछि। एहि समय मे, पारंपरिक अनुष्ठान मे उपवास, प्रार्थना, आ शुभ कार्य सँ बचबाक सलाह देल जाइत अछि। जन्म कुंडली मे ग्रहणक प्रभाव केँ ओहि घर आ राशि सँ आँकल जाइत अछि जतय ग्रहण पड़ैत अछि।",
    jyotishText3:
      "राहु उत्तरी पात बिंदु पर सूर्यग्रहणक कारण बनैत अछि; केतु दक्षिणी पात बिंदु पर ओकर कारण बनैत अछि। राहु ग्रहण केँ बेसी बाह्य रूप सँ दृश्यमान (भौतिक उथल-पुथल) मानल जाइत अछि, जखन कि केतु ग्रहण आंतरिक (आध्यात्मिक परिवर्तन) दिस इंगित करैत अछि।",
    solarLabel: "सूर्यग्रहण",
    lunarLabel: "चंद्रग्रहण",
    simulatorNote:
      "ई सिमुलेशन शैक्षिक अछि – ई ज्यामितीय सिद्धांत केँ चित्रित करैत अछि, सटीक बेसेलियन तत्व केँ नहि।",
  },
  mr: {
    backToCalendar: "← ग्रहण दिनदर्शिका",
    pageTitle: "ग्रहण सिम्युलेटर",
    pageSubtitle: "सूर्यग्रहण आणि चंद्रग्रहणांचे परस्परसंवादी दृश्यांकन",
    howTitle: "ग्रहण कसे घडतात",
    solarExplain:
      "सूर्यग्रहण तेव्हा होते जेव्हा चंद्र पृथ्वी आणि सूर्याच्या मधून जातो, ज्यामुळे सूर्यप्रकाश अवरोधित होतो. चंद्राची कक्षा क्रांतिवृत्ताला सुमारे ५° ने झुकलेली असल्यामुळे, हे केवळ विशिष्ट अमावस्येच्या क्षणांमध्ये घडते जेव्हा चंद्र क्रांतिवृत्त समतल ओलांडतो – राहू (उत्तर पातबिंदू) किंवा केतू (दक्षिण पातबिंदू) जवळ.",
    lunarExplain:
      "चंद्रग्रहण तेव्हा होते जेव्हा पृथ्वी सूर्य आणि चंद्राच्या मधून जाते, चंद्रावर आपली सावली टाकते. हे केवळ पौर्णिमेला घडते जेव्हा चंद्र पातबिंदूजवळ असतो. पृथ्वीचे वातावरण लाल सूर्यप्रकाश अंब्रामध्ये वाकवते – सूर्यास्त लाल दिसण्याचे हेच कारण आहे – त्यामुळे पूर्ण ग्रहणाच्या वेळी चंद्र तांबूस-लाल होतो.",
    jyotishTitle: "ज्योतिषीय महत्त्व",
    jyotishText1:
      "वैदिक ज्योतिषशास्त्रानुसार, ग्रहण हे राक्षस स्वरभानू (जो विष्णूच्या चक्राने कापल्यानंतर राहू आणि केतू बनला) आणि सूर्य/चंद्रा यांच्यातील पौराणिक लढाईचे प्रतीक आहे. जन्मकुंडलीतील ग्रहांजवळ – विशेषतः सूर्य, चंद्र किंवा लग्न स्वामी – होणारी ग्रहणे शक्तिशाली गोचर ट्रिगर मानली जातात.",
    jyotishText2:
      "सूतक कालावधी सूर्यग्रहणापूर्वी १२ तास आणि चंद्रग्रहणापूर्वी ९ तास आधी सुरू होतो. या काळात, पारंपरिक पद्धतींमध्ये उपवास, प्रार्थना आणि शुभ कार्यांपासून दूर राहण्याचा सल्ला दिला जातो. जन्मकुंडलीतील ग्रहणाचे परिणाम ते ज्या घरात आणि राशीत पडते त्यानुसार ठरवले जातात.",
    jyotishText3:
      "राहूमुळे उत्तर पातबिंदूंवर सूर्यग्रहण होते; केतूमुळे दक्षिण पातबिंदूंवर ते घडते. राहू ग्रहणे अधिक बाह्यतः दृश्यमान (भौतिक उलथापालथ) मानली जातात, तर केतू ग्रहणे आंतरिक (आध्यात्मिक परिवर्तन) दर्शवतात.",
    solarLabel: "सूर्यग्रहण",
    lunarLabel: "चंद्रग्रहण",
    simulatorNote:
      "हे सिम्युलेशन शैक्षणिक आहे – ते भौमितिक तत्त्वे स्पष्ट करते, अचूक बेसेलियन घटक नाही.",
  },
  te: {
    backToCalendar: "← గ్రహణ క్యాలెండర్",
    pageTitle: "గ్రహణ సిమ్యులేటర్",
    pageSubtitle: "సూర్య మరియు చంద్ర గ్రహణాల ఇంటరాక్టివ్ విజువలైజేషన్",
    howTitle: "గ్రహణాలు ఎలా సంభవిస్తాయి",
    solarExplain:
      "సూర్యగ్రహణం చంద్రుడు భూమి మరియు సూర్యుని మధ్య వచ్చినప్పుడు సంభవిస్తుంది, సూర్యకాంతిని అడ్డుకుంటుంది. చంద్రుని కక్ష్య క్రాంతివృత్తానికి సుమారు 5° వంగి ఉండటం వలన, ఇది రాహువు (ఉత్తర నోడ్) లేదా కేతువు (దక్షిణ నోడ్) దగ్గర, చంద్రుడు క్రాంతివృత్త తలాన్ని దాటినప్పుడు మాత్రమే, నిర్దిష్ట అమావాస్య సమయాలలో జరుగుతుంది.",
    lunarExplain:
      "చంద్రగ్రహణం భూమి సూర్యుడు మరియు చంద్రుని మధ్య వచ్చినప్పుడు సంభవిస్తుంది, చంద్రునిపై దాని నీడను వేస్తుంది. ఇది చంద్రుడు నోడ్ దగ్గర ఉన్నప్పుడు మాత్రమే పౌర్ణమి నాడు జరుగుతుంది. భూమి యొక్క వాతావరణం ఎరుపు సూర్యకాంతిని అంబ్రాలోకి వంచుతుంది – సూర్యాస్తమయాలు ఎరుపు రంగులో ఉండటానికి ఇదే కారణం – దీనివల్ల సంపూర్ణ గ్రహణం సమయంలో చంద్రుడు రాగి-ఎరుపు రంగులోకి మారుతుంది.",
    jyotishTitle: "జ్యోతిష్య ప్రాముఖ్యత",
    jyotishText1:
      "వేద జ్యోతిష్యశాస్త్రంలో, గ్రహణాలు రాక్షసుడు స్వర్భాను (విష్ణువు చక్రంతో ఖండించబడిన తర్వాత రాహువు మరియు కేతువుగా మారాడు) మరియు సూర్యుడు/చంద్రుల మధ్య జరిగిన పౌరాణిక యుద్ధాన్ని సూచిస్తాయి. జన్మ గ్రహాల దగ్గర – ముఖ్యంగా సూర్యుడు, చంద్రుడు లేదా లగ్నాధిపతి – సంభవించే గ్రహణాలు శక్తివంతమైన గోచర ప్రేరేపకాలుగా పరిగణించబడతాయి.",
    jyotishText2:
      "సూర్యగ్రహణానికి 12 గంటల ముందు మరియు చంద్రగ్రహణానికి 9 గంటల ముందు సూతక కాలం ప్రారంభమవుతుంది. ఈ సమయంలో, సాంప్రదాయ ఆచారాలు ఉపవాసం, ప్రార్థన మరియు శుభ కార్యకలాపాలను నివారించమని సలహా ఇస్తాయి. గ్రహణం పడే ఇల్లు మరియు రాశిని బట్టి జన్మ చార్టులో గ్రహణ ప్రభావాలు నిర్ణయించబడతాయి.",
    jyotishText3:
      "రాహువు ఆరోహణ నోడ్‌ల వద్ద సూర్యగ్రహణాలకు కారణమవుతాడు; కేతువు అవరోహణ నోడ్‌ల వద్ద వాటికి కారణమవుతాడు. రాహు గ్రహణాలు బాహ్యంగా మరింత కనిపించేవి (భౌతిక అల్లకల్లోలం) గా పరిగణించబడతాయి, అయితే కేతు గ్రహణాలు అంతర్గతంగా (ఆధ్యాత్మిక పరివర్తన) సూచిస్తాయి.",
    solarLabel: "సూర్యగ్రహణం",
    lunarLabel: "చంద్రగ్రహణం",
    simulatorNote:
      "ఈ సిమ్యులేషన్ విద్యాపరమైనది – ఇది జ్యామితీయ సూత్రాలను వివరిస్తుంది, ఖచ్చితమైన బెసెలియన్ అంశాలను కాదు.",
  },
  gu: {
    backToCalendar: "← ગ્રહણ કેલેન્ડર",
    pageTitle: "ગ્રહણ સિમ્યુલેટર",
    pageSubtitle: "સૂર્ય અને ચંદ્ર ગ્રહણનું ઇન્ટરેક્ટિવ વિઝ્યુલાઇઝેશન",
    howTitle: "ગ્રહણ કેવી રીતે થાય છે",
    solarExplain:
      "સૂર્યગ્રહણ ત્યારે થાય છે જ્યારે ચંદ્ર પૃથ્વી અને સૂર્યની વચ્ચેથી પસાર થાય છે, જેનાથી સૂર્યપ્રકાશ અવરોધાય છે. ચંદ્રની કક્ષા ક્રાંતિવૃતથી લગભગ 5° નમેલી હોવાથી, આ ફક્ત ચોક્કસ અમાસના ક્ષણોમાં જ થાય છે જ્યારે ચંદ્ર ક્રાંતિવૃત સમતલને પાર કરે છે – રાહુ (ઉત્તર નોડ) અથવા કેતુ (દક્ષિણ નોડ) નજીક.",
    lunarExplain:
      "ચંદ્રગ્રહણ ત્યારે થાય છે જ્યારે પૃથ્વી સૂર્ય અને ચંદ્રની વચ્ચેથી પસાર થાય છે, ચંદ્ર પર તેનો પડછાયો પાડે છે. આ ફક્ત પૂર્ણિમાના દિવસે જ થાય છે જ્યારે ચંદ્ર નોડની નજીક હોય છે. પૃથ્વીનું વાતાવરણ લાલ સૂર્યપ્રકાશને અમ્બ્રામાં વાળે છે – સૂર્યાસ્ત લાલ દેખાવાનું આ જ કારણ છે – તેથી પૂર્ણતા દરમિયાન ચંદ્ર તાંબા-લાલ રંગનો બને છે.",
    jyotishTitle: "જ્યોતિષીય મહત્વ",
    jyotishText1:
      "વૈદિક જ્યોતિષશાસ્ત્રમાં, ગ્રહણ રાક્ષસ સ્વર્ભાનુ (જે વિષ્ણુના ચક્ર દ્વારા કાપવામાં આવ્યા પછી રાહુ અને કેતુ બન્યા) અને સૂર્ય/ચંદ્ર વચ્ચેના પૌરાણિક યુદ્ધને ચિહ્નિત કરે છે. જન્મના ગ્રહોની નજીક – ખાસ કરીને સૂર્ય, ચંદ્ર અથવા લગ્ન સ્વામી – થતા ગ્રહણોને શક્તિશાળી ગોચર ટ્રિગર્સ માનવામાં આવે છે.",
    jyotishText2:
      "સૂતક કાળ સૂર્યગ્રહણના 12 કલાક પહેલા અને ચંદ્રગ્રહણના 9 કલાક પહેલા શરૂ થાય છે. આ સમય દરમિયાન, પરંપરાગત રીતિ-રિવાજો ઉપવાસ, પ્રાર્થના અને શુભ પ્રવૃત્તિઓ ટાળવાની સલાહ આપે છે. જન્મકુંડળીમાં ગ્રહણની અસરો તે જે ભાવ અને રાશિમાં પડે છે તેના આધારે નક્કી કરવામાં આવે છે.",
    jyotishText3:
      "રાહુ આરોહણ નોડ પર સૂર્યગ્રહણનું કારણ બને છે; કેતુ અવરોહણ નોડ પર તેનું કારણ બને છે. રાહુ ગ્રહણોને વધુ બાહ્ય રીતે દૃશ્યમાન (ભૌતિક ઉથલપાથલ) માનવામાં આવે છે, જ્યારે કેતુ ગ્રહણો આંતરિક (આધ્યાત્મિક પરિવર્તન) તરફ નિર્દેશ કરે છે.",
    solarLabel: "સૂર્યગ્રહણ",
    lunarLabel: "ચંદ્રગ્રહણ",
    simulatorNote:
      "આ સિમ્યુલેશન શૈક્ષણિક છે – તે ભૌમિતિક સિદ્ધાંતોનું નિરૂપણ કરે છે, ચોક્કસ બેસેલિયન તત્વોનું નહીં.",
  },
  kn: {
    backToCalendar: "← ಗ್ರಹಣ ಕ್ಯಾಲೆಂಡರ್",
    pageTitle: "ಗ್ರಹಣ ಸಿಮ್ಯುಲೇಟರ್",
    pageSubtitle: "ಸೂರ್ಯ ಮತ್ತು ಚಂದ್ರ ಗ್ರಹಣಗಳ ಸಂವಾದಾತ್ಮಕ ದೃಶ್ಯೀಕರಣ",
    howTitle: "ಗ್ರಹಣಗಳು ಹೇಗೆ ಸಂಭವಿಸುತ್ತವೆ",
    solarExplain:
      "ಸೂರ್ಯಗ್ರಹಣವು ಚಂದ್ರನು ಭೂಮಿ ಮತ್ತು ಸೂರ್ಯನ ನಡುವೆ ಹಾದುಹೋದಾಗ ಸಂಭವಿಸುತ್ತದೆ, ಸೂರ್ಯನ ಬೆಳಕನ್ನು ತಡೆಯುತ್ತದೆ. ಚಂದ್ರನ ಕಕ್ಷೆಯು ಕ್ರಾಂತಿವೃತ್ತಕ್ಕೆ ಸುಮಾರು 5° ಓರೆಯಾಗಿರುವುದರಿಂದ, ಇದು ನಿರ್ದಿಷ್ಟ ಅಮಾವಾಸ್ಯೆಯ ಕ್ಷಣಗಳಲ್ಲಿ ಮಾತ್ರ ಸಂಭವಿಸುತ್ತದೆ, ಆಗ ಚಂದ್ರನು ಕ್ರಾಂತಿವೃತ್ತದ ಸಮತಲವನ್ನು ದಾಟುತ್ತಾನೆ – ರಾಹು (ಉತ್ತರ ನೋಡ್) ಅಥವಾ ಕೇತು (ದಕ್ಷಿಣ ನೋಡ್) ಬಳಿ.",
    lunarExplain:
      "ಚಂದ್ರಗ್ರಹಣವು ಭೂಮಿಯು ಸೂರ್ಯ ಮತ್ತು ಚಂದ್ರನ ನಡುವೆ ಹಾದುಹೋದಾಗ ಸಂಭವಿಸುತ್ತದೆ, ಚಂದ್ರನ ಮೇಲೆ ತನ್ನ ನೆರಳನ್ನು ಬೀರುತ್ತದೆ. ಇದು ಚಂದ್ರನು ನೋಡ್ ಬಳಿ ಇರುವಾಗ ಮಾತ್ರ ಹುಣ್ಣಿಮೆಯಂದು ಸಂಭವಿಸುತ್ತದೆ. ಭೂಮಿಯ ವಾತಾವರಣವು ಕೆಂಪು ಸೂರ್ಯನ ಬೆಳಕನ್ನು ಅಂಬ್ರಾಗೆ ಬಾಗಿಸುತ್ತದೆ – ಸೂರ್ಯಾಸ್ತಗಳು ಕೆಂಪಾಗಿ ಕಾಣಲು ಇದೇ ಕಾರಣ – ಇದರಿಂದಾಗಿ ಪೂರ್ಣ ಗ್ರಹಣದ ಸಮಯದಲ್ಲಿ ಚಂದ್ರನು ತಾಮ್ರ-ಕೆಂಪು ಬಣ್ಣಕ್ಕೆ ತಿರುಗುತ್ತದೆ.",
    jyotishTitle: "ಜ್ಯೋತಿಷ್ಯ ಮಹತ್ವ",
    jyotishText1:
      "ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ, ಗ್ರಹಣಗಳು ರಾಕ್ಷಸ ಸ್ವರ್ಭಾನು (ವಿಷ್ಣುವಿನ ಚಕ್ರದಿಂದ ಛೇದಿಸಲ್ಪಟ್ಟ ನಂತರ ರಾಹು ಮತ್ತು ಕೇತುವಾದನು) ಮತ್ತು ಸೂರ್ಯ/ಚಂದ್ರರ ನಡುವಿನ ಪೌರಾಣಿಕ ಯುದ್ಧವನ್ನು ಗುರುತಿಸುತ್ತವೆ. ಜನ್ಮ ಗ್ರಹಗಳ ಬಳಿ – ವಿಶೇಷವಾಗಿ ಸೂರ್ಯ, ಚಂದ್ರ ಅಥವಾ ಲಗ್ನಾಧಿಪತಿ – ಸಂಭವಿಸುವ ಗ್ರಹಣಗಳನ್ನು ಶಕ್ತಿಶಾಲಿ ಗೋಚರ ಪ್ರಚೋದಕಗಳೆಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ.",
    jyotishText2:
      "ಸೂರ್ಯಗ್ರಹಣಕ್ಕೆ 12 ಗಂಟೆಗಳ ಮೊದಲು ಮತ್ತು ಚಂದ್ರಗ್ರಹಣಕ್ಕೆ 9 ಗಂಟೆಗಳ ಮೊದಲು ಸೂತಕ ಅವಧಿಯು ಪ್ರಾರಂಭವಾಗುತ್ತದೆ. ಈ ಸಮಯದಲ್ಲಿ, ಸಾಂಪ್ರದಾಯಿಕ ಆಚರಣೆಗಳು ಉಪವಾಸ, ಪ್ರಾರ್ಥನೆ ಮತ್ತು ಶುಭ ಕಾರ್ಯಗಳನ್ನು ತಪ್ಪಿಸಲು ಸಲಹೆ ನೀಡುತ್ತವೆ. ಜನ್ಮ ಕುಂಡಲಿಯಲ್ಲಿ ಗ್ರಹಣದ ಪರಿಣಾಮಗಳನ್ನು ಗ್ರಹಣವು ಬೀಳುವ ಮನೆ ಮತ್ತು ರಾಶಿಯಿಂದ ನಿರ್ಣಯಿಸಲಾಗುತ್ತದೆ.",
    jyotishText3:
      "ರಾಹು ಆರೋಹಣ ನೋಡ್‌ಗಳಲ್ಲಿ ಸೂರ್ಯಗ್ರಹಣಗಳನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ; ಕೇತು ಅವರೋಹಣ ನೋಡ್‌ಗಳಲ್ಲಿ ಅವುಗಳನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ. ರಾಹು ಗ್ರಹಣಗಳನ್ನು ಬಾಹ್ಯವಾಗಿ ಹೆಚ್ಚು ಗೋಚರಿಸುವ (ಭೌತಿಕ ತಲ್ಲಣ) ಎಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ, ಆದರೆ ಕೇತು ಗ್ರಹಣಗಳು ಆಂತರಿಕವಾಗಿ (ಆಧ್ಯಾತ್ಮಿಕ ಪರಿವರ್ತನೆ) ಸೂಚಿಸುತ್ತವೆ.",
    solarLabel: "ಸೂರ್ಯಗ್ರಹಣ",
    lunarLabel: "ಚಂದ್ರಗ್ರಹಣ",
    simulatorNote:
      "ಈ ಸಿಮ್ಯುಲೇಶನ್ ಶೈಕ್ಷಣಿಕವಾಗಿದೆ – ಇದು ಜ್ಯಾಮಿತೀಯ ತತ್ವಗಳನ್ನು ವಿವರಿಸುತ್ತದೆ, ನಿಖರವಾದ ಬೆಸೆಲಿಯನ್ ಅಂಶಗಳನ್ನಲ್ಲ.",
  },
};

type EclipseMode = "solar" | "lunar";

export default function EclipseSimulatorPage() {
  const locale = useLocale() as Locale;
  const L = LABELS[locale] || LABELS.en;
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi
    ? { fontFamily: "var(--font-devanagari-heading)" }
    : { fontFamily: "var(--font-heading)" };
  const bodyFont = isHi
    ? { fontFamily: "var(--font-devanagari-body)" }
    : undefined;

  const [mode, setMode] = useState<EclipseMode>("solar");

  return (
    <div className="min-h-screen bg-[#0a0e27] text-text-primary px-4 py-8 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href={`/${locale}/eclipses`}
        className="inline-flex items-center gap-1 text-gold-primary/70 hover:text-gold-light text-sm mb-6 transition-colors"
        style={bodyFont}
      >
        <ChevronLeft className="w-4 h-4" />
        {L.backToCalendar}
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2"
          style={headingFont}
        >
          {L.pageTitle}
        </h1>
        <p
          className="text-text-secondary text-sm sm:text-base"
          style={bodyFont}
        >
          {L.pageSubtitle}
        </p>
      </div>

      {/* Type selector tabs */}
      <div className="flex gap-2 justify-center mb-6">
        {(["solar", "lunar"] as EclipseMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
              mode === m
                ? m === "solar"
                  ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                  : "bg-indigo-500/20 border-indigo-400/50 text-indigo-300"
                : "border-gold-primary/20 text-text-secondary hover:border-gold-primary/40 hover:text-gold-primary"
            }`}
            style={bodyFont}
          >
            {m === "solar" ? L.solarLabel : L.lunarLabel}
          </button>
        ))}
      </div>

      {/* Simulator */}
      <EclipseSimulator initialMode={mode} locale={locale} key={mode} />

      {/* Simulator note */}
      <p
        className="text-center text-text-secondary/50 text-xs mt-3 italic"
        style={bodyFont}
      >
        {L.simulatorNote}
      </p>

      <GoldDivider className="my-10" />

      {/* Educational content */}
      <div className="space-y-8">
        {/* How it works */}
        <section>
          <h2
            className="text-xl font-bold text-gold-light mb-4"
            style={headingFont}
          >
            {L.howTitle}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Solar */}
            <div className="bg-[#111633] rounded-2xl p-5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-amber-400/80 shadow-[0_0_8px_#FFD700]" />
                <span className="font-semibold text-amber-300" style={bodyFont}>
                  {L.solarLabel}
                </span>
              </div>
              <p
                className="text-text-secondary text-sm leading-relaxed"
                style={bodyFont}
              >
                {L.solarExplain}
              </p>
            </div>
            {/* Lunar */}
            <div className="bg-[#111633] rounded-2xl p-5 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-indigo-400/80 shadow-[0_0_8px_#4169E1]" />
                <span
                  className="font-semibold text-indigo-300"
                  style={bodyFont}
                >
                  {L.lunarLabel}
                </span>
              </div>
              <p
                className="text-text-secondary text-sm leading-relaxed"
                style={bodyFont}
              >
                {L.lunarExplain}
              </p>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* Jyotish significance */}
        <section>
          <h2
            className="text-xl font-bold text-gold-light mb-4"
            style={headingFont}
          >
            {L.jyotishTitle}
          </h2>
          <div className="bg-[#111633] rounded-2xl p-6 border border-gold-primary/15 space-y-4">
            {/* Rahu/Ketu diagram */}
            <div className="flex items-center justify-center gap-6 py-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
                  <span className="text-purple-300 font-bold text-xs">☊</span>
                </div>
                <span className="text-purple-300/80 text-xs">Rahu</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 via-gold-primary/40 to-purple-500/30" />
              <div className="flex flex-col items-center gap-1">
                <svg viewBox="0 0 40 40" className="w-9 h-9">
                  <circle cx="20" cy="20" r="16" fill="#4169E1" opacity="0.7" />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="#6BB8FF"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="text-blue-300/80 text-xs">Earth</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 via-gold-primary/40 to-purple-500/30" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
                  <span className="text-purple-300 font-bold text-xs">☋</span>
                </div>
                <span className="text-purple-300/80 text-xs">Ketu</span>
              </div>
            </div>

            <p
              className="text-text-secondary text-sm leading-relaxed"
              style={bodyFont}
            >
              {L.jyotishText1}
            </p>
            <p
              className="text-text-secondary text-sm leading-relaxed"
              style={bodyFont}
            >
              {L.jyotishText2}
            </p>
            <p
              className="text-text-secondary text-sm leading-relaxed"
              style={bodyFont}
            >
              {L.jyotishText3}
            </p>
          </div>
        </section>
      </div>

      <GoldDivider className="my-10" />

      {/* Cross-link back */}
      <div className="text-center">
        <Link
          href={`/${locale}/eclipses`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/25 text-gold-light hover:bg-gold-primary/20 transition-all font-semibold text-sm"
          style={bodyFont}
        >
          <ChevronLeft className="w-4 h-4" />
          {L.backToCalendar}
        </Link>
      </div>
    </div>
  );
}
