import { notFound } from "next/navigation";
import { getLocale, setRequestLocale } from "next-intl/server";
import {
  MUHURTA_TYPES,
  getMuhurtaType,
} from "@/lib/constants/muhurta-types-with-overlay";
import type { MuhurtaTypeInfo } from "@/lib/constants/muhurta-types-with-overlay";
import {
  getHeadingFont,
  getBodyFont,
  isDevanagariLocale,
} from "@/lib/utils/locale-fonts";
import { Link } from "@/lib/i18n/navigation";
import GoldDivider from "@/components/ui/GoldDivider";
import AuthorByline from "@/components/ui/AuthorByline";
import {
  BREADCRUMB_HOME,
  BREADCRUMB_MUHURTA,
} from "@/lib/i18n/breadcrumb-labels";
import {
  generateToolLD,
  generateBreadcrumbLD,
} from "@/lib/seo/structured-data";
import { safeJsonLd } from "@/lib/seo/safe-jsonld";
import { FAQ_DATA } from "@/lib/seo/faq-data";
import {
  Calendar,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Sparkles,
  CheckCircle,
  ExternalLink,
  ScrollText,
  Baby,
  Star,
  LinkIcon,
} from "lucide-react";

export function generateStaticParams() {
  return MUHURTA_TYPES.map((t) => ({ type: t.slug }));
}

/* ─── Inline i18n labels ──────────────────────────────────────── */
const L: Record<string, Record<string, string>> = {
  en: {
    findDate: "Find Your Date with Muhurta AI",
    findDateDesc:
      "Our AI-powered engine scans time windows and scores them 0-100 based on Panchang, transits, hora, and choghadiya for your specific activity.",
    upcomingDates: "Upcoming Auspicious Dates in 2026",
    upcomingDesc:
      "Based on traditional Vedic muhurat rules  –  favorable nakshatras, tithis, weekdays, and planetary conditions.",
    guidance: "Traditional Guidance",
    guidanceDesc:
      "What to consider according to Vedic texts and Jyotish Shastras.",
    faq: "Frequently Asked Questions",
    relatedTypes: "Related Muhurat Types",
    viewAll: "View All Muhurat Types",
    ctaButton: "Find Best Muhurat",
    approximate:
      "Note: These dates are approximate. Use our Muhurta AI tool for personalized, location-specific recommendations.",
    learnMore: "Learn more about Muhurat selection",
    aboutTitle: "About This Ceremony",
    exploreRelated: "Explore Related Tools",
    babyNames: "Baby Names by Nakshatra",
    babyNamesDesc:
      "Find auspicious baby names based on birth nakshatra syllables.",
    kundali: "Birth Chart (Kundali)",
    kundaliDesc:
      "Generate your baby's complete Vedic birth chart with interpretations.",
    muhurtaAI: "Muhurta AI Tool",
    muhurtaAIDesc:
      "AI-powered personalised muhurta scoring for 20+ activities.",
    panchangToday: "Today's Panchang",
    panchangTodayDesc: "Check tithi, nakshatra, yoga, and karana for today.",
  },
  hi: {
    findDate: "मुहूर्त AI से अपनी तिथि खोजें",
    findDateDesc:
      "हमारा AI-संचालित इंजन आपकी विशिष्ट गतिविधि के लिए पंचांग, गोचर, होरा और चौघड़िया के आधार पर समय खंडों को 0-100 अंक देता है।",
    upcomingDates: "2026 की आगामी शुभ तिथियां",
    upcomingDesc:
      "पारम्परिक वैदिक मुहूर्त नियमों पर आधारित  –  अनुकूल नक्षत्र, तिथि, वार और ग्रह स्थिति।",
    guidance: "पारम्परिक मार्गदर्शन",
    guidanceDesc:
      "वैदिक ग्रन्थों और ज्योतिष शास्त्रों के अनुसार ध्यान देने योग्य बातें।",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    relatedTypes: "सम्बन्धित मुहूर्त प्रकार",
    viewAll: "सभी मुहूर्त प्रकार देखें",
    ctaButton: "सर्वोत्तम मुहूर्त खोजें",
    approximate:
      "नोट: ये तिथियां अनुमानित हैं। व्यक्तिगत, स्थान-विशिष्ट सिफारिशों के लिए हमारा मुहूर्त AI टूल उपयोग करें।",
    learnMore: "मुहूर्त चयन के बारे में और जानें",
    aboutTitle: "इस संस्कार के बारे में",
    exploreRelated: "सम्बन्धित उपकरण देखें",
    babyNames: "नक्षत्र अनुसार शिशु नाम",
    babyNamesDesc: "जन्म नक्षत्र के अक्षरों पर आधारित शुभ शिशु नाम खोजें।",
    kundali: "जन्म कुण्डली",
    kundaliDesc:
      "अपने शिशु की सम्पूर्ण वैदिक जन्म कुण्डली व्याख्या सहित बनाएं।",
    muhurtaAI: "मुहूर्त AI उपकरण",
    muhurtaAIDesc: "20+ गतिविधियों के लिए AI-संचालित व्यक्तिगत मुहूर्त अंकन।",
    panchangToday: "आज का पंचांग",
    panchangTodayDesc: "आज की तिथि, नक्षत्र, योग और करण देखें।",
  },
  sa: {
    findDate: "मुहूर्तकृत्रिमबुद्ध्या स्वतिथिं अन्विष्यतु",
    findDateDesc:
      "अस्माकं AI-संचालितयन्त्रं भवतः विशिष्टकार्यस्य कृते पञ्चाङ्गगोचरहोराचौघड़ियाधारेण समयखण्डान् ० तः १०० अङ्कान् ददाति।",
    upcomingDates: "२०२६ वर्षस्य आगामिशुभतिथयः",
    upcomingDesc:
      "पारम्परिकवैदिकमुहूर्तनियमाधारिताः  –  अनुकूलनक्षत्रतिथिवारग्रहस्थितयः।",
    guidance: "पारम्परिकमार्गदर्शनम्",
    guidanceDesc:
      "वैदिकग्रन्थानां ज्योतिषशास्त्राणां च अनुसारं विचारणीयाः विषयाः।",
    faq: "प्रायः पृच्छ्यमानाः प्रश्नाः",
    relatedTypes: "सम्बद्धमुहूर्तप्रकाराः",
    viewAll: "सर्वान् मुहूर्तप्रकारान् पश्यतु",
    ctaButton: "सर्वोत्तमं मुहूर्तम् अन्विष्यतु",
    approximate:
      "टिप्पणी: एताः तिथयः अनुमानिताः। व्यक्तिगतस्थानविशिष्टानुशंसनार्थं अस्माकं मुहूर्त AI साधनम् उपयुज्यताम्।",
    learnMore: "मुहूर्तचयनस्य विषये अधिकं जानीयात्",
    aboutTitle: "अस्य संस्कारस्य विषये",
    exploreRelated: "सम्बद्धसाधनानि अवलोकयतु",
    babyNames: "नक्षत्रानुसारं शिशुनामानि",
    babyNamesDesc: "जन्मनक्षत्राक्षराधारितानि शुभशिशुनामानि अन्विष्यतु।",
    kundali: "जन्मकुण्डली",
    kundaliDesc: "शिशोः सम्पूर्णां वैदिकजन्मकुण्डलीं व्याख्यासहितां रचयतु।",
    muhurtaAI: "मुहूर्त-AI-साधनम्",
    muhurtaAIDesc: "२०+ कार्याणां कृते AI-संचालितं व्यक्तिगतमुहूर्ताङ्कनम्।",
    panchangToday: "अद्यतनपञ्चाङ्गम्",
    panchangTodayDesc: "अद्य तिथिं नक्षत्रं योगं करणं च पश्यतु।",
  },
  mai: {
    findDate: "अहांक तिथि मुहूर्त एआई सं खोजू",
    findDateDesc:
      "हमर एआई-संचालित इंजन समय-अवधि सभक स्कैन करैत अछि आ अहांक विशिष्ट गतिविधि के लेल पंचांग, गोचर, होरा, आ चौघड़ियाक आधार पर ओकरा 0-100 स्कोर करैत अछि।",
    upcomingDates: "2026 मे आबय वला शुभ तिथि सभ",
    upcomingDesc:
      "पारंपरिक वैदिक मुहूर्त नियमक आधार पर – अनुकूल नक्षत्र, तिथि, सप्ताहक दिन, आ ग्रहीय स्थिति।",
    guidance: "पारंपरिक मार्गदर्शन",
    guidanceDesc: "वैदिक ग्रंथ आ ज्योतिष शास्त्रक अनुसार की विचार करबाक चाही।",
    faq: "प्रायः पूछल जाय वला प्रश्न",
    relatedTypes: "संबंधित मुहूर्त प्रकार",
    viewAll: "सभ मुहूर्त प्रकार देखू",
    ctaButton: "सर्वोत्तम मुहूर्त खोजू",
    approximate:
      "ध्यान दियौ: ई तिथि सभ अनुमानित छथि। व्यक्तिगत, स्थान-विशिष्ट सिफारिश के लेल हमर मुहूर्त एआई उपकरणक उपयोग करू।",
    learnMore: "मुहूर्त चयनक विषय मे बेसी जानू",
    aboutTitle: "एहि समारोहक विषय मे",
    exploreRelated: "संबंधित उपकरण सभक अन्वेषण करू",
    babyNames: "नक्षत्रक अनुसार बच्चाक नाम",
    babyNamesDesc: "जन्म नक्षत्रक अक्षर सभक आधार पर शुभ बच्चाक नाम खोजू।",
    kundali: "जन्म कुंडली (कुंडली)",
    kundaliDesc:
      "अहांक बच्चाक पूर्ण वैदिक जन्म कुंडली व्याख्याक संग उत्पन्न करू।",
    muhurtaAI: "मुहूर्त एआई उपकरण",
    muhurtaAIDesc: "20+ गतिविधिक लेल एआई-संचालित व्यक्तिगत मुहूर्त स्कोरिंग।",
    panchangToday: "आइ-क पंचांग",
    panchangTodayDesc: "आइ के लेल तिथि, नक्षत्र, योग, आ करण देखू।",
  },
  mr: {
    findDate: "मुहूर्त एआय सह तुमची तारीख शोधा",
    findDateDesc:
      "आमचे एआय-शक्तीवर चालणारे इंजिन तुमच्या विशिष्ट कार्यासाठी पंचांग, ​​गोचर, होरा आणि चौघडियाच्या आधारावर वेळेच्या मर्यादा स्कॅन करते आणि त्यांना 0-100 गुण देते.",
    upcomingDates: "2026 मधील आगामी शुभ तारखा",
    upcomingDesc:
      "पारंपारिक वैदिक मुहूर्त नियमांवर आधारित – अनुकूल नक्षत्रे, तिथी, आठवड्याचे दिवस आणि ग्रहांची स्थिती.",
    guidance: "पारंपारिक मार्गदर्शन",
    guidanceDesc: "वैदिक ग्रंथ आणि ज्योतिष शास्त्रांनुसार काय विचारात घ्यावे.",
    faq: "वारंवार विचारले जाणारे प्रश्न",
    relatedTypes: "संबंधित मुहूर्त प्रकार",
    viewAll: "सर्व मुहूर्त प्रकार पहा",
    ctaButton: "सर्वोत्तम मुहूर्त शोधा",
    approximate:
      "टीप: या तारखा अंदाजित आहेत. वैयक्तिकृत, स्थान-विशिष्ट शिफारसींसाठी आमचे मुहूर्त एआय साधन वापरा.",
    learnMore: "मुहूर्त निवडीबद्दल अधिक जाणून घ्या",
    aboutTitle: "या समारंभाबद्दल",
    exploreRelated: "संबंधित साधने एक्सप्लोर करा",
    babyNames: "नक्षत्रांनुसार बाळांची नावे",
    babyNamesDesc: "जन्म नक्षत्राच्या अक्षरांवर आधारित शुभ बाळांची नावे शोधा.",
    kundali: "जन्म कुंडली",
    kundaliDesc:
      "तुमच्या बाळाची संपूर्ण वैदिक जन्म कुंडली व्याख्यांसह तयार करा.",
    muhurtaAI: "मुहूर्त एआय साधन",
    muhurtaAIDesc:
      "20+ कार्यांसाठी एआय-शक्तीवर चालणारे वैयक्तिकृत मुहूर्त स्कोअरिंग.",
    panchangToday: "आजचे पंचांग",
    panchangTodayDesc: "आजची तिथी, नक्षत्र, योग आणि करण तपासा.",
  },
  ta: {
    findDate: "முகூர்த்த AI உடன் உங்கள் தேதியைக் கண்டறியவும்",
    findDateDesc:
      "எங்கள் AI-இயங்கும் எஞ்சின், உங்கள் குறிப்பிட்ட செயல்பாட்டிற்கான பஞ்சாங்கம், கோச்சாரம், ஹோரை மற்றும் சௌகடியா ஆகியவற்றின் அடிப்படையில் நேர சாளரங்களை ஸ்கேன் செய்து, அவற்றுக்கு 0-100 மதிப்பெண் வழங்குகிறது.",
    upcomingDates: "2026 இல் வரவிருக்கும் சுப தேதிகள்",
    upcomingDesc:
      "பாரம்பரிய வேத முகூர்த்த விதிகளின் அடிப்படையில் – சாதகமான நட்சத்திரங்கள், திதிகள், வார நாட்கள் மற்றும் கிரக நிலைகள்.",
    guidance: "பாரம்பரிய வழிகாட்டுதல்",
    guidanceDesc:
      "வேத நூல்கள் மற்றும் ஜோதிட சாஸ்திரங்களின்படி எதைக் கருத்தில் கொள்ள வேண்டும்.",
    faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    relatedTypes: "தொடர்புடைய முகூர்த்த வகைகள்",
    viewAll: "அனைத்து முகூர்த்த வகைகளையும் காண்க",
    ctaButton: "சிறந்த முகூர்த்தத்தைக் கண்டறியவும்",
    approximate:
      "குறிப்பு: இந்த தேதிகள் தோராயமானவை. தனிப்பயனாக்கப்பட்ட, இருப்பிடம் சார்ந்த பரிந்துரைகளுக்கு எங்கள் முகூர்த்த AI கருவியைப் பயன்படுத்தவும்.",
    learnMore: "முகூர்த்தத் தேர்வு பற்றி மேலும் அறிக",
    aboutTitle: "இந்த சடங்கு பற்றி",
    exploreRelated: "தொடர்புடைய கருவிகளை ஆராயுங்கள்",
    babyNames: "நட்சத்திரத்தின்படி குழந்தை பெயர்கள்",
    babyNamesDesc:
      "பிறந்த நட்சத்திரத்தின் அசைகளின் அடிப்படையில் சுபமான குழந்தை பெயர்களைக் கண்டறியவும்.",
    kundali: "பிறப்பு ஜாதகம் (குண்டலி)",
    kundaliDesc:
      "உங்கள் குழந்தையின் முழுமையான வேத பிறப்பு ஜாதகத்தை விளக்கங்களுடன் உருவாக்கவும்.",
    muhurtaAI: "முகூர்த்த AI கருவி",
    muhurtaAIDesc:
      "20+ செயல்பாடுகளுக்கான AI-இயங்கும் தனிப்பயனாக்கப்பட்ட முகூர்த்த மதிப்பெண்.",
    panchangToday: "இன்றைய பஞ்சாங்கம்",
    panchangTodayDesc:
      "இன்றைய திதி, நட்சத்திரம், யோகம் மற்றும் கரணம் சரிபார்க்கவும்.",
  },
  te: {
    findDate: "ముహూర్త AIతో మీ తేదీని కనుగొనండి",
    findDateDesc:
      "మా AI-శక్తితో పనిచేసే ఇంజిన్ మీ నిర్దిష్ట కార్యకలాపం కోసం పంచాంగం, గోచారం, హోరా మరియు చోఘడియా ఆధారంగా సమయ విండోలను స్కాన్ చేస్తుంది మరియు వాటికి 0-100 స్కోర్ చేస్తుంది.",
    upcomingDates: "2026లో రాబోయే శుభ తేదీలు",
    upcomingDesc:
      "సాంప్రదాయ వైదిక ముహూర్త నియమాల ఆధారంగా – అనుకూల నక్షత్రాలు, తిథులు, వారపు రోజులు మరియు గ్రహ స్థితులు.",
    guidance: "సాంప్రదాయ మార్గదర్శకత్వం",
    guidanceDesc:
      "వేద గ్రంథాలు మరియు జ్యోతిష్య శాస్త్రాల ప్రకారం ఏమి పరిగణించాలి.",
    faq: "తరచుగా అడిగే ప్రశ్నలు",
    relatedTypes: "సంబంధిత ముహూర్త రకాలు",
    viewAll: "అన్ని ముహూర్త రకాలను వీక్షించండి",
    ctaButton: "ఉత్తమ ముహూర్తాన్ని కనుగొనండి",
    approximate:
      "గమనిక: ఈ తేదీలు సుమారుగా ఉంటాయి. వ్యక్తిగతీకరించిన, స్థాన-నిర్దిష్ట సిఫార్సుల కోసం మా ముహూర్త AI సాధనాన్ని ఉపయోగించండి.",
    learnMore: "ముహూర్త ఎంపిక గురించి మరింత తెలుసుకోండి",
    aboutTitle: "ఈ వేడుక గురించి",
    exploreRelated: "సంబంధిత సాధనాలను అన్వేషించండి",
    babyNames: "నక్షత్రం ప్రకారం శిశువు పేర్లు",
    babyNamesDesc:
      "జనన నక్షత్ర అక్షరాల ఆధారంగా శుభకరమైన శిశువు పేర్లను కనుగొనండి.",
    kundali: "జనన చార్ట్ (కుండలి)",
    kundaliDesc:
      "మీ శిశువు యొక్క పూర్తి వైదిక జనన చార్ట్‌ను వివరణలతో రూపొందించండి.",
    muhurtaAI: "ముహూర్త AI సాధనం",
    muhurtaAIDesc:
      "20+ కార్యకలాపాల కోసం AI-శక్తితో పనిచేసే వ్యక్తిగతీకరించిన ముహూర్త స్కోరింగ్.",
    panchangToday: "నేటి పంచాంగం",
    panchangTodayDesc: "నేటి తిథి, నక్షత్రం, యోగం మరియు కరణం తనిఖీ చేయండి.",
  },
  bn: {
    findDate: "মুহূর্ত এআই দিয়ে আপনার তারিখ খুঁজুন",
    findDateDesc:
      "আমাদের এআই-চালিত ইঞ্জিন আপনার নির্দিষ্ট কার্যকলাপের জন্য পঞ্চাঙ্গ, গোচর, হোরা এবং চৌঘড়িয়ার উপর ভিত্তি করে সময় উইন্ডোগুলি স্ক্যান করে এবং সেগুলিকে 0-100 স্কোর করে।",
    upcomingDates: "2026 সালের আসন্ন শুভ তারিখগুলি",
    upcomingDesc:
      "ঐতিহ্যবাহী বৈদিক মুহূর্ত নিয়মের উপর ভিত্তি করে – অনুকূল নক্ষত্র, তিথি, সপ্তাহের দিন এবং গ্রহের অবস্থান।",
    guidance: "ঐতিহ্যবাহী নির্দেশনা",
    guidanceDesc:
      "বৈদিক গ্রন্থ এবং জ্যোতিষ শাস্ত্র অনুসারে কী বিবেচনা করা উচিত।",
    faq: "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী",
    relatedTypes: "সম্পর্কিত মুহূর্তের প্রকারভেদ",
    viewAll: "সমস্ত মুহূর্তের প্রকারভেদ দেখুন",
    ctaButton: "সেরা মুহূর্ত খুঁজুন",
    approximate:
      "দ্রষ্টব্য: এই তারিখগুলি আনুমানিক। ব্যক্তিগতকৃত, স্থান-নির্দিষ্ট সুপারিশের জন্য আমাদের মুহূর্ত এআই টুল ব্যবহার করুন।",
    learnMore: "মুহূর্ত নির্বাচন সম্পর্কে আরও জানুন",
    aboutTitle: "এই অনুষ্ঠান সম্পর্কে",
    exploreRelated: "সম্পর্কিত সরঞ্জামগুলি অন্বেষণ করুন",
    babyNames: "নক্ষত্র অনুযায়ী শিশুর নাম",
    babyNamesDesc:
      "জন্ম নক্ষত্রের অক্ষরগুলির উপর ভিত্তি করে শুভ শিশুর নাম খুঁজুন।",
    kundali: "জন্ম কুণ্ডলী (কুণ্ডলী)",
    kundaliDesc:
      "আপনার শিশুর সম্পূর্ণ বৈদিক জন্ম কুণ্ডলী ব্যাখ্যা সহ তৈরি করুন।",
    muhurtaAI: "মুহূর্ত এআই টুল",
    muhurtaAIDesc:
      "20+ কার্যকলাপের জন্য এআই-চালিত ব্যক্তিগতকৃত মুহূর্ত স্কোরিং।",
    panchangToday: "আজকের পঞ্চাঙ্গ",
    panchangTodayDesc: "আজকের তিথি, নক্ষত্র, যোগ এবং করণ পরীক্ষা করুন।",
  },
  gu: {
    findDate: "મુહૂર્ત AI સાથે તમારી તારીખ શોધો",
    findDateDesc:
      "અમારું AI-સંચાલિત એન્જિન તમારી ચોક્કસ પ્રવૃત્તિ માટે પંચાંગ, ગોચર, હોરા અને ચોઘડિયાના આધારે સમય વિન્ડોઝને સ્કેન કરે છે અને તેમને 0-100 સ્કોર આપે છે.",
    upcomingDates: "2026 માં આવનારી શુભ તારીખો",
    upcomingDesc:
      "પરંપરાગત વૈદિક મુહૂર્ત નિયમો પર આધારિત – અનુકૂળ નક્ષત્રો, તિથિઓ, અઠવાડિયાના દિવસો અને ગ્રહોની સ્થિતિ.",
    guidance: "પરંપરાગત માર્ગદર્શન",
    guidanceDesc:
      "વૈદિક ગ્રંથો અને જ્યોતિષ શાસ્ત્રો અનુસાર શું ધ્યાનમાં લેવું.",
    faq: "વારંવાર પૂછાતા પ્રશ્નો",
    relatedTypes: "સંબંધિત મુહૂર્ત પ્રકારો",
    viewAll: "બધા મુહૂર્ત પ્રકારો જુઓ",
    ctaButton: "શ્રેષ્ઠ મુહૂર્ત શોધો",
    approximate:
      "નોંધ: આ તારીખો આશરે છે. વ્યક્તિગત, સ્થાન-વિશિષ્ટ ભલામણો માટે અમારા મુહૂર્ત AI ટૂલનો ઉપયોગ કરો.",
    learnMore: "મુહૂર્ત પસંદગી વિશે વધુ જાણો",
    aboutTitle: "આ સમારોહ વિશે",
    exploreRelated: "સંબંધિત સાધનોનું અન્વેષણ કરો",
    babyNames: "નક્ષત્ર દ્વારા બાળકના નામ",
    babyNamesDesc: "જન્મ નક્ષત્રના અક્ષરો પર આધારિત શુભ બાળકના નામ શોધો.",
    kundali: "જન્મ કુંડળી (કુંડળી)",
    kundaliDesc: "તમારા બાળકની સંપૂર્ણ વૈદિક જન્મ કુંડળી અર્થઘટન સાથે બનાવો.",
    muhurtaAI: "મુહૂર્ત AI ટૂલ",
    muhurtaAIDesc: "20+ પ્રવૃત્તિઓ માટે AI-સંચાલિત વ્યક્તિગત મુહૂર્ત સ્કોરિંગ.",
    panchangToday: "આજનું પંચાંગ",
    panchangTodayDesc: "આજની તિથિ, નક્ષત્ર, યોગ અને કરણ તપાસો.",
  },
  kn: {
    findDate: "ಮುಹೂರ್ತ AI ನೊಂದಿಗೆ ನಿಮ್ಮ ದಿನಾಂಕವನ್ನು ಹುಡುಕಿ",
    findDateDesc:
      "ನಮ್ಮ AI-ಚಾಲಿತ ಎಂಜಿನ್ ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಚಟುವಟಿಕೆಗಾಗಿ ಪಂಚಾಂಗ, ಗೋಚಾರ, ಹೋರಾ ಮತ್ತು ಚೌಘಡಿಯಾ ಆಧಾರದ ಮೇಲೆ ಸಮಯದ ವಿಂಡೋಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ಅವುಗಳಿಗೆ 0-100 ಅಂಕಗಳನ್ನು ನೀಡುತ್ತದೆ.",
    upcomingDates: "2026 ರಲ್ಲಿ ಮುಂಬರುವ ಶುಭ ದಿನಾಂಕಗಳು",
    upcomingDesc:
      "ಸಾಂಪ್ರದಾಯಿಕ ವೈದಿಕ ಮುಹೂರ್ತ ನಿಯಮಗಳ ಆಧಾರದ ಮೇಲೆ – ಅನುಕೂಲಕರ ನಕ್ಷತ್ರಗಳು, ತಿಥಿಗಳು, ವಾರದ ದಿನಗಳು ಮತ್ತು ಗ್ರಹಗಳ ಸ್ಥಿತಿಗಳು.",
    guidance: "ಸಾಂಪ್ರದಾಯಿಕ ಮಾರ್ಗದರ್ಶನ",
    guidanceDesc:
      "ವೈದಿಕ ಗ್ರಂಥಗಳು ಮತ್ತು ಜ್ಯೋತಿಷ್ಯ ಶಾಸ್ತ್ರಗಳ ಪ್ರಕಾರ ಏನು ಪರಿಗಣಿಸಬೇಕು.",
    faq: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
    relatedTypes: "ಸಂಬಂಧಿತ ಮುಹೂರ್ತ ಪ್ರಕಾರಗಳು",
    viewAll: "ಎಲ್ಲಾ ಮುಹೂರ್ತ ಪ್ರಕಾರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    ctaButton: "ಅತ್ಯುತ್ತಮ ಮುಹೂರ್ತವನ್ನು ಹುಡುಕಿ",
    approximate:
      "ಗಮನಿಸಿ: ಈ ದಿನಾಂಕಗಳು ಅಂದಾಜು. ವೈಯಕ್ತೀಕರಿಸಿದ, ಸ್ಥಳ-ನಿರ್ದಿಷ್ಟ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ನಮ್ಮ ಮುಹೂರ್ತ AI ಉಪಕರಣವನ್ನು ಬಳಸಿ.",
    learnMore: "ಮುಹೂರ್ತ ಆಯ್ಕೆಯ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    aboutTitle: "ಈ ಸಮಾರಂಭದ ಬಗ್ಗೆ",
    exploreRelated: "ಸಂಬಂಧಿತ ಉಪಕರಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    babyNames: "ನಕ್ಷತ್ರದ ಪ್ರಕಾರ ಶಿಶು ಹೆಸರುಗಳು",
    babyNamesDesc:
      "ಜನನ ನಕ್ಷತ್ರದ ಅಕ್ಷರಗಳ ಆಧಾರದ ಮೇಲೆ ಶುಭ ಶಿಶು ಹೆಸರುಗಳನ್ನು ಹುಡುಕಿ.",
    kundali: "ಜನ್ಮ ಕುಂಡಲಿ (ಕುಂಡಲಿ)",
    kundaliDesc:
      "ನಿಮ್ಮ ಮಗುವಿನ ಸಂಪೂರ್ಣ ವೈದಿಕ ಜನ್ಮ ಕುಂಡಲಿಯನ್ನು ವ್ಯಾಖ್ಯಾನಗಳೊಂದಿಗೆ ರಚಿಸಿ.",
    muhurtaAI: "ಮುಹೂರ್ತ AI ಉಪಕರಣ",
    muhurtaAIDesc:
      "20+ ಚಟುವಟಿಕೆಗಳಿಗಾಗಿ AI-ಚಾಲಿತ ವೈಯಕ್ತೀಕರಿಸಿದ ಮುಹೂರ್ತ ಸ್ಕೋರಿಂಗ್.",
    panchangToday: "ಇಂದಿನ ಪಂಚಾಂಗ",
    panchangTodayDesc: "ಇಂದಿನ ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ ಮತ್ತು ಕರಣವನ್ನು ಪರಿಶೀಲಿಸಿ.",
  },
};

function t(key: string, locale: string): string {
  return L[locale]?.[key] || L.en[key] || key;
}

function tName(
  obj: { en: string; hi: string; sa: string },
  locale: string,
): string {
  return (obj as Record<string, string>)[locale] || obj.en;
}

export default async function MuhurtaTypePage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { type } = await params;
  const locale = await getLocale();
  setRequestLocale(locale);
  const info = getMuhurtaType(type);
  if (!info) notFound();

  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);
  const isDevanagari = isDevanagariLocale(locale);

  const relatedTypes = info.related
    .map((slug) => getMuhurtaType(slug))
    .filter((r): r is MuhurtaTypeInfo => !!r);

  // JSON-LD structured data
  const toolLD = generateToolLD(
    `${info.name.en}  –  Auspicious Dates 2026`,
    info.description.en,
    `https://dekhopanchang.com/${locale}/muhurta/${type}`,
  );
  const breadcrumbLD = generateBreadcrumbLD(
    `/${locale}/muhurta/${type}`,
    locale,
  );

  // Merge FAQs from muhurta-types + centralised faq-data for richer schema
  const centralFaqs = FAQ_DATA[`/muhurta/${type}`] ?? [];
  const allFaqEntries = [
    ...info.faqs.map((faq) => ({
      q: (faq.question as Record<string, string>)[locale] || faq.question.en,
      a: (faq.answer as Record<string, string>)[locale] || faq.answer.en,
    })),
    ...centralFaqs.map((faq) => ({
      q: faq.question[locale] || faq.question.en,
      a: faq.answer[locale] || faq.answer.en,
    })),
  ];
  // Deduplicate by question text (centralised FAQs may overlap with inline ones)
  const seenQuestions = new Set<string>();
  const uniqueFaqEntries = allFaqEntries.filter((entry) => {
    const key = entry.q.toLowerCase().trim();
    if (seenQuestions.has(key)) return false;
    seenQuestions.add(key);
    return true;
  });
  const faqLD =
    uniqueFaqEntries.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: uniqueFaqEntries.map((entry) => ({
            "@type": "Question",
            name: entry.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: entry.a,
            },
          })),
        }
      : null;

  // Article content for rich SSR (optional per muhurta type)
  const articleParagraphs = info.article
    ? info.article[locale as "en" | "hi"] || info.article.en
    : null;

  // All FAQ items for rendering (inline + centralised, deduplicated)
  // Reuse FAQ items from the JSON-LD (already deduplicated)
  const allFaqsForRender =
    (
      (faqLD as Record<string, unknown>)?.mainEntity as
        | Array<{ name: string; acceptedAnswer: { text: string } }>
        | undefined
    )?.map((q) => ({
      question: q.name,
      answer: q.acceptedAnswer.text,
    })) ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }}
      />
      {faqLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }}
        />
      )}
      <main className="min-h-screen bg-bg-primary" style={bodyFont}>
        {/* ─── Hero Section ────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold-primary/5 via-transparent to-transparent" />
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gold-primary/3 rounded-full blur-[120px]" />
          <div className="absolute top-32 right-1/4 w-48 h-48 bg-gold-primary/5 rounded-full blur-[100px]" />

          <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
            {/* Visible breadcrumb — reinforces the /muhurta hub → /[type]
              landing relationship for users AND crawlers. The
              schema.org breadcrumb LD above describes the same trail
              for machines; this is the human-readable mirror.
              Labels resolve via the shared BREADCRUMB_HOME / MUHURTA
              maps so all 9 active locales render in their own script
              (Gemini PR #365 MEDIUM — the prior t()-based lookup only
              had en/hi/sa). */}
            <nav aria-label="Breadcrumb" className="mb-6 text-sm">
              <ol className="inline-flex items-center gap-2 text-text-secondary">
                <li>
                  <Link
                    href="/"
                    className="hover:text-gold-light transition-colors"
                  >
                    {BREADCRUMB_HOME[locale] ?? "Home"}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-gold-dark">
                  /
                </li>
                <li>
                  <Link
                    href="/muhurta"
                    className="hover:text-gold-light transition-colors"
                  >
                    {BREADCRUMB_MUHURTA[locale] ?? "Muhurta"}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-gold-dark">
                  /
                </li>
                <li aria-current="page" className="text-gold-light">
                  {tName(info.name, locale)}
                </li>
              </ol>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-primary/20 bg-gold-primary/5 text-gold-primary text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Muhurta 2026</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gold-light mb-3 leading-tight"
              style={headingFont}
            >
              {tName(info.name, locale)}
            </h1>

            {locale !== "en" && (
              <p className="text-xl text-text-secondary mb-2">
                {tName(info.name, "en")}
              </p>
            )}

            <p className="text-lg sm:text-xl text-text-primary/80 max-w-3xl mx-auto mt-4 leading-relaxed">
              {tName(info.description, locale)}
            </p>

            <GoldDivider className="mt-8" />
          </div>
        </section>

        {/* ─── Rich Article Section (SSR content for crawlability) ── */}
        {articleParagraphs && articleParagraphs.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 py-10">
            <div className="flex items-center gap-3 mb-6">
              <ScrollText className="w-6 h-6 text-gold-primary" />
              <h2
                className="text-2xl sm:text-3xl font-bold text-gold-light"
                style={headingFont}
              >
                {t("aboutTitle", locale)}
              </h2>
            </div>

            <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 sm:p-8 space-y-5">
              {articleParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-text-primary/85 leading-relaxed text-[15px] sm:text-base"
                >
                  {para}
                </p>
              ))}
            </div>

            <div className="max-w-4xl mx-auto mt-8">
              <GoldDivider />
            </div>
          </section>
        )}

        {/* ─── CTA: Find Your Date ─────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 via-bg-secondary to-bg-secondary p-8 sm:p-10 text-center">
            <h2
              className="text-2xl sm:text-3xl font-bold text-gold-light mb-3"
              style={headingFont}
            >
              {t("findDate", locale)}
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto mb-6">
              {t("findDateDesc", locale)}
            </p>
            <Link
              href={`/muhurta-ai?activity=${info.activityId}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-primary text-bg-primary font-semibold text-lg hover:bg-gold-light transition-colors"
            >
              {t("ctaButton", locale)}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* ─── Upcoming Auspicious Dates ───────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-gold-primary" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-gold-light"
              style={headingFont}
            >
              {t("upcomingDates", locale)}
            </h2>
          </div>
          <p className="text-text-secondary mb-6 ml-9">
            {t("upcomingDesc", locale)}
          </p>

          <div className="space-y-3">
            {info.dates2026.map((d, i) => (
              <div
                key={d.date}
                className="flex items-start gap-4 p-4 rounded-xl border border-gold-primary/10 bg-bg-secondary/60 hover:border-gold-primary/25 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-primary font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <p className="text-text-primary font-medium">
                    {tName(d.label, locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-text-secondary/70 text-sm mt-4 ml-1 italic">
            {t("approximate", locale)}
          </p>
        </section>

        <div className="max-w-4xl mx-auto px-4">
          <GoldDivider />
        </div>

        {/* ─── Traditional Guidance ─────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-gold-primary" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-gold-light"
              style={headingFont}
            >
              {t("guidance", locale)}
            </h2>
          </div>
          <p className="text-text-secondary mb-6 ml-9">
            {t("guidanceDesc", locale)}
          </p>

          <div className="space-y-4">
            {(
              info.guidance[locale as "en" | "hi" | "sa"] || info.guidance.en
            ).map((rule, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border border-gold-primary/10 bg-bg-secondary/40"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-text-primary/90 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4">
          <GoldDivider />
        </div>

        {/* ─── FAQ Section ──────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-gold-primary" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-gold-light"
              style={headingFont}
            >
              {t("faq", locale)}
            </h2>
          </div>

          <div className="space-y-4">
            {allFaqsForRender.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-gold-primary/10 bg-bg-secondary/40 overflow-hidden"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="cursor-pointer p-5 flex items-center justify-between text-text-primary font-medium hover:text-gold-light transition-colors list-none">
                  <span>{faq.question}</span>
                  <span className="text-gold-primary/60 group-open:rotate-45 transition-transform text-xl ml-4 flex-shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-text-secondary leading-relaxed border-t border-gold-primary/5 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4">
          <GoldDivider />
        </div>

        {/* ─── Related Muhurat Types ────────────────────────────── */}
        {relatedTypes.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 py-10">
            <h2
              className="text-2xl sm:text-3xl font-bold text-gold-light mb-6"
              style={headingFont}
            >
              {t("relatedTypes", locale)}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTypes.map((related) => (
                <Link
                  key={related.slug}
                  href={`/muhurta/${related.slug}`}
                  className="group p-5 rounded-xl border border-gold-primary/10 bg-bg-secondary/40 hover:border-gold-primary/30 hover:bg-bg-secondary/70 transition-all"
                >
                  <h3
                    className="text-gold-light font-semibold mb-1 group-hover:text-gold-primary transition-colors"
                    style={headingFont}
                  >
                    {tName(related.name, locale)}
                  </h3>
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {tName(related.description, locale)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-gold-primary/60 text-sm mt-3 group-hover:text-gold-primary transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t("learnMore", locale)}</span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/muhurta-ai"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/5 transition-colors"
              >
                {t("viewAll", locale)}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* ─── Cross-links to Related Tools ──────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6">
            <LinkIcon className="w-6 h-6 text-gold-primary" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-gold-light"
              style={headingFont}
            >
              {t("exploreRelated", locale)}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/baby-names"
              className="group flex items-start gap-4 p-5 rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/30 transition-all"
            >
              <Baby className="w-8 h-8 text-gold-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3
                  className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors"
                  style={headingFont}
                >
                  {t("babyNames", locale)}
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                  {t("babyNamesDesc", locale)}
                </p>
              </div>
            </Link>

            <Link
              href="/kundali"
              className="group flex items-start gap-4 p-5 rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/30 transition-all"
            >
              <Star className="w-8 h-8 text-gold-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3
                  className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors"
                  style={headingFont}
                >
                  {t("kundali", locale)}
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                  {t("kundaliDesc", locale)}
                </p>
              </div>
            </Link>

            <Link
              href="/muhurta-ai"
              className="group flex items-start gap-4 p-5 rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/30 transition-all"
            >
              <Sparkles className="w-8 h-8 text-gold-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3
                  className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors"
                  style={headingFont}
                >
                  {t("muhurtaAI", locale)}
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                  {t("muhurtaAIDesc", locale)}
                </p>
              </div>
            </Link>

            <Link
              href="/panchang"
              className="group flex items-start gap-4 p-5 rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/30 transition-all"
            >
              <Calendar className="w-8 h-8 text-gold-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3
                  className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors"
                  style={headingFont}
                >
                  {t("panchangToday", locale)}
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                  {t("panchangTodayDesc", locale)}
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/*
        2026-06-01 E-E-A-T pass — muhurta pages punch above their weight
        (positions 3-5 on activity queries) but lacked author attribution.
        Named author improves Google's per-page E-E-A-T classifier and
        rich-result eligibility. See docs/specs/2026-06-01-eeat-author-
        credentials.md.
      */}
        <section className="max-w-5xl mx-auto px-4">
          <AuthorByline />
        </section>

        {/* Bottom spacing */}
        <div className="h-16" />
      </main>
    </>
  );
}
