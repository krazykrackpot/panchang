import { getLocale, setRequestLocale } from "next-intl/server";
import { MapPin, Globe, ChevronRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { type CityData } from "@/lib/constants/cities";
import { ALL_CITIES } from "@/lib/constants/cities-extended";
import { isDevanagariLocale, getHeadingFont } from "@/lib/utils/locale-fonts";

export const revalidate = 604800; // 7 days  –  city listing is static

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Locale-aware city name with en fallback */
function cityName(city: CityData, locale: string): string {
  return (city.name as Record<string, string>)[locale] || city.name.en;
}

/**
 * International states  –  cities whose `state` field is a country name rather
 * than an Indian state/UT. We detect by checking against a known set.
 */
const INTERNATIONAL_STATES = new Set([
  "USA",
  "UK",
  "Singapore",
  "UAE",
  "Australia",
  "Canada",
  "Malaysia",
  "Mauritius",
  "Fiji",
  "Trinidad",
  "New Zealand",
]);

function isInternational(city: CityData): boolean {
  return INTERNATIONAL_STATES.has(city.state ?? "");
}

// ─── Labels ─────────────────────────────────────────────────────────────────

const LABELS: Record<string, Record<string, string>> = {
  en: {
    pageTitle: "Panchang by City",
    pageSubtitle: "55+ locations across India and the global Hindu diaspora",
    intro:
      "Every city-specific Panchang page computes Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Yamaganda, Gulika, sunrise, and sunset for the exact coordinates of that location  –  using classical Vedic algorithms with Lahiri Ayanamsha. Choose your city below for timings precise to the minute.",
    indiaSection: "India  –  by State",
    internationalSection: "Global Hindu Diaspora",
    internationalSubtitle:
      "Accurate Vedic Panchang for the Hindu diaspora worldwide",
    breadcrumbHome: "Home",
    breadcrumbPanchang: "Panchang",
    breadcrumbCurrent: "Locations",
    viewPanchang: "View Panchang",
    cities: "cities",
    whyTitle: "Why city-specific Panchang?",
    whyText:
      "Panchang timings  –  especially Rahu Kaal, Yamaganda, Gulika, and Muhurta windows  –  depend on local sunrise and sunset, which differ by longitude, latitude, and season. A Panchang computed for Delhi can be off by 20–90 minutes for cities like Chennai or Chandigarh. Every page here uses coordinates precise to the city centre.",
  },
  hi: {
    pageTitle: "शहर के अनुसार पंचांग",
    pageSubtitle: "भारत और वैश्विक हिंदू डायस्पोरा के 55+ स्थान",
    intro:
      "प्रत्येक शहर-विशिष्ट पंचांग पृष्ठ उस स्थान के सटीक निर्देशांक के आधार पर तिथि, नक्षत्र, योग, करण, राहु काल, यमगण्ड, गुलिक, सूर्योदय और सूर्यास्त की गणना करता है। नीचे से अपना शहर चुनें।",
    indiaSection: "भारत  –  राज्य के अनुसार",
    internationalSection: "वैश्विक हिंदू डायस्पोरा",
    internationalSubtitle:
      "विश्वभर में हिंदू डायस्पोरा के लिए सटीक वैदिक पंचांग",
    breadcrumbHome: "होम",
    breadcrumbPanchang: "पंचांग",
    breadcrumbCurrent: "स्थान",
    viewPanchang: "पंचांग देखें",
    cities: "शहर",
    whyTitle: "शहर-विशिष्ट पंचांग क्यों?",
    whyText:
      "पंचांग समय  –  विशेष रूप से राहु काल, यमगण्ड, गुलिक और मुहूर्त  –  स्थानीय सूर्योदय और सूर्यास्त पर निर्भर करते हैं। दिल्ली का पंचांग चेन्नई या चंडीगढ़ के लिए 20–90 मिनट तक गलत हो सकता है।",
  },
  mai: {
    pageTitle: "शहर अनुसार पंचांग",
    pageSubtitle: "भारत आ विश्वव्यापी हिन्दू डायस्पोरा मे ५५+ स्थान",
    intro:
      "प्रत्येक शहर-विशिष्ट पंचांग पृष्ठ ओ स्थानक सटीक निर्देशांकक लेल तिथि, नक्षत्र, योग, करण, राहु काल, यमगंड, गुलिक, सूर्योदय, आ सूर्यास्तक गणना करैत अछि – लाहिरी अयनांशक संग शास्त्रीय वैदिक एल्गोरिदमक उपयोग करैत। मिनट धरि सटीक समयक लेल नीचाँ सँ अहांक शहर चुनू।",
    indiaSection: "भारत – राज्य अनुसार",
    internationalSection: "विश्वव्यापी हिन्दू डायस्पोरा",
    internationalSubtitle: "विश्वभरि हिन्दू डायस्पोराक लेल सटीक वैदिक पंचांग",
    breadcrumbHome: "होम",
    breadcrumbPanchang: "पंचांग",
    breadcrumbCurrent: "स्थान",
    viewPanchang: "पंचांग देखू",
    cities: "शहर",
    whyTitle: "शहर-विशिष्ट पंचांग किएक?",
    whyText:
      "पंचांगक समय – विशेष रूप सँ राहु काल, यमगंड, गुलिक, आ मुहूर्त विंडो – स्थानीय सूर्योदय आ सूर्यास्तक पर निर्भर करैत अछि, जे देशांतर, अक्षांश, आ मौसमक अनुसार भिन्न होइत अछि। दिल्लीक लेल गणना कएल गेल पंचांग चेन्नई वा चंडीगढ़ जकाँ शहरक लेल २०–९० मिनट धरि भिन्न भऽ सकैत अछि। एतय प्रत्येक पृष्ठ शहरक केंद्रक सटीक निर्देशांकक उपयोग करैत अछि।",
  },
  mr: {
    pageTitle: "शहरानुसार पंचांग",
    pageSubtitle: "भारत आणि जागतिक हिंदू डायस्पोरामधील ५५+ स्थाने",
    intro:
      "प्रत्येक शहर-विशिष्ट पंचांग पृष्ठ त्या स्थानाच्या अचूक निर्देशांकांसाठी तिथी, नक्षत्र, योग, करण, राहु काल, यमगंड, गुलिक, सूर्योदय आणि सूर्यास्ताची गणना करते – लाहिरी अयनांश वापरून शास्त्रीय वैदिक अल्गोरिदमसह. मिनिटापर्यंत अचूक वेळेसाठी खालील तुमचे शहर निवडा.",
    indiaSection: "भारत – राज्यानुसार",
    internationalSection: "जागतिक हिंदू डायस्पोरा",
    internationalSubtitle: "जगभरातील हिंदू डायस्पोरासाठी अचूक वैदिक पंचांग",
    breadcrumbHome: "मुख्यपृष्ठ",
    breadcrumbPanchang: "पंचांग",
    breadcrumbCurrent: "स्थाने",
    viewPanchang: "पंचांग पहा",
    cities: "शहरे",
    whyTitle: "शहर-विशिष्ट पंचांग का?",
    whyText:
      "पंचांगाची वेळ – विशेषतः राहु काल, यमगंड, गुलिक आणि मुहूर्त – स्थानिक सूर्योदय आणि सूर्यास्तावर अवलंबून असते, जे रेखांश, अक्षांश आणि ऋतूनुसार भिन्न असते. दिल्लीसाठी गणना केलेले पंचांग चेन्नई किंवा चंदीगडसारख्या शहरांसाठी २०-९० मिनिटांनी वेगळे असू शकते. येथील प्रत्येक पृष्ठ शहर केंद्राच्या अचूक निर्देशांकांचा वापर करते.",
  },
  ta: {
    pageTitle: "நகரம் வாரியான பஞ்சாங்கம்",
    pageSubtitle:
      "இந்தியா மற்றும் உலகளாவிய இந்து புலம்பெயர் சமூகத்தில் 55+ இடங்கள்",
    intro:
      "ஒவ்வொரு நகரத்திற்க்கான பஞ்சாங்கப் பக்கமும் அந்த இடத்தின் சரியான ஆயத்தொலைவுகளுக்கு திதி, நட்சத்திரம், யோகம், கரணம், ராகு காலம், யமகண்டம், குளிகை, சூரிய உதயம் மற்றும் அஸ்தமனம் ஆகியவற்றை கணக்கிடுகிறது – லஹிரி அயனாம்சம் கொண்ட பாரம்பரிய வேத வழிமுறைகளைப் பயன்படுத்தி. நிமிடத்திற்கு துல்லியமான நேரங்களுக்கு கீழே உங்கள் நகரத்தைத் தேர்ந்தெடுக்கவும்.",
    indiaSection: "இந்தியா – மாநில வாரியாக",
    internationalSection: "உலகளாவிய இந்து புலம்பெயர் சமூகம்",
    internationalSubtitle:
      "உலகம் முழுவதும் உள்ள இந்து புலம்பெயர் சமூகத்திற்கான துல்லியமான வேத பஞ்சாங்கம்",
    breadcrumbHome: "முகப்பு",
    breadcrumbPanchang: "பஞ்சாங்கம்",
    breadcrumbCurrent: "இடங்கள்",
    viewPanchang: "பஞ்சாங்கத்தைப் பார்க்கவும்",
    cities: "நகரங்கள்",
    whyTitle: "நகரம் வாரியான பஞ்சாங்கம் ஏன்?",
    whyText:
      "பஞ்சாங்க நேரங்கள் – குறிப்பாக ராகு காலம், யமகண்டம், குளிகை மற்றும் முகூர்த்த நேரங்கள் – உள்ளூர் சூரிய உதயம் மற்றும் அஸ்தமனத்தைப் பொறுத்தது, இது தீர்க்கரேகை, அட்சரேகை மற்றும் பருவத்திற்கு ஏற்ப மாறுபடும். டெல்லிக்கு கணக்கிடப்பட்ட பஞ்சாங்கம் சென்னை அல்லது சண்டிகர் போன்ற நகரங்களுக்கு 20-90 நிமிடங்கள் வேறுபடலாம். இங்குள்ள ஒவ்வொரு பக்கமும் நகர மையத்தின் துல்லியமான ஆயத்தொலைவுகளைப் பயன்படுத்துகிறது.",
  },
  te: {
    pageTitle: "నగరం వారీగా పంచాంగం",
    pageSubtitle: "భారతదేశం మరియు ప్రపంచవ్యాప్త హిందూ ప్రవాసంలో 55+ స్థానాలు",
    intro:
      "ప్రతి నగరం-నిర్దిష్ట పంచాంగ పేజీ ఆ ప్రదేశం యొక్క ఖచ్చితమైన అక్షాంశాల కోసం తిథి, నక్షత్రం, యోగం, కరణం, రాహు కాలం, యమగండం, గుళిక, సూర్యోదయం మరియు సూర్యాస్తమయాన్ని లెక్కిస్తుంది – లహిరి అయనాంశంతో కూడిన శాస్త్రీయ వైదిక అల్గోరిథంలను ఉపయోగించి. నిమిషానికి ఖచ్చితమైన సమయాల కోసం దిగువ మీ నగరాన్ని ఎంచుకోండి.",
    indiaSection: "భారతదేశం – రాష్ట్రం వారీగా",
    internationalSection: "ప్రపంచవ్యాప్త హిందూ ప్రవాసం",
    internationalSubtitle:
      "ప్రపంచవ్యాప్తంగా ఉన్న హిందూ ప్రవాసానికి ఖచ్చితమైన వైదిక పంచాంగం",
    breadcrumbHome: "హోమ్",
    breadcrumbPanchang: "పంచాంగం",
    breadcrumbCurrent: "స్థానాలు",
    viewPanchang: "పంచాంగం చూడండి",
    cities: "నగరాలు",
    whyTitle: "నగరం-నిర్దిష్ట పంచాంగం ఎందుకు?",
    whyText:
      "పంచాంగ సమయాలు – ముఖ్యంగా రాహు కాలం, యమగండం, గుళిక మరియు ముహూర్త విండోలు – స్థానిక సూర్యోదయం మరియు సూర్యాస్తమయంపై ఆధారపడి ఉంటాయి, ఇవి రేఖాంశం, అక్షాంశం మరియు రుతువుల ప్రకారం మారుతూ ఉంటాయి. ఢిల్లీ కోసం లెక్కించిన పంచాంగం చెన్నై లేదా చండీగఢ్ వంటి నగరాలకు 20–90 నిమిషాలు తేడా ఉండవచ్చు. ఇక్కడ ప్రతి పేజీ నగర కేంద్రం యొక్క ఖచ్చితమైన అక్షాంశాలను ఉపయోగిస్తుంది.",
  },
  bn: {
    pageTitle: "শহর অনুযায়ী পঞ্জিকা",
    pageSubtitle: "ভারত এবং বিশ্বব্যাপী হিন্দু প্রবাসীদের জন্য ৫৫+ অবস্থান",
    intro:
      "প্রতিটি শহর-নির্দিষ্ট পঞ্জিকা পৃষ্ঠা সেই স্থানের সঠিক স্থানাঙ্কের জন্য তিথি, নক্ষত্র, যোগ, করণ, রাহু কাল, যমগণ্ড, গুলিক, সূর্যোদয় এবং সূর্যাস্তের গণনা করে – লাহিড়ী অয়নাংশ সহ শাস্ত্রীয় বৈদিক অ্যালগরিদম ব্যবহার করে। মিনিটের জন্য সঠিক সময়ের জন্য নিচে আপনার শহর নির্বাচন করুন।",
    indiaSection: "ভারত – রাজ্য অনুযায়ী",
    internationalSection: "বিশ্বব্যাপী হিন্দু প্রবাসী",
    internationalSubtitle:
      "বিশ্বজুড়ে হিন্দু প্রবাসীদের জন্য সঠিক বৈদিক পঞ্জিকা",
    breadcrumbHome: "হোম",
    breadcrumbPanchang: "পঞ্জিকা",
    breadcrumbCurrent: "অবস্থান",
    viewPanchang: "পঞ্জিকা দেখুন",
    cities: "শহর",
    whyTitle: "শহর-নির্দিষ্ট পঞ্জিকা কেন?",
    whyText:
      "পঞ্জিকার সময় – বিশেষ করে রাহু কাল, যমগণ্ড, গুলিক এবং মুহূর্তের সময় – স্থানীয় সূর্যোদয় এবং সূর্যাস্তের উপর নির্ভর করে, যা দ্রাঘিমাংশ, অক্ষাংশ এবং ঋতু অনুসারে ভিন্ন হয়। দিল্লির জন্য গণনা করা পঞ্জিকা চেন্নাই বা চণ্ডীগড়ের মতো শহরগুলির জন্য ২০-৯০ মিনিট পর্যন্ত ভিন্ন হতে পারে। এখানকার প্রতিটি পৃষ্ঠা শহরের কেন্দ্রের সঠিক স্থানাঙ্ক ব্যবহার করে।",
  },
  gu: {
    pageTitle: "શહેર પ્રમાણે પંચાંગ",
    pageSubtitle: "ભારત અને વૈશ્વિક હિંદુ ડાયસ્પોરામાં 55+ સ્થાનો",
    intro:
      "દરેક શહેર-વિશિષ્ટ પંચાંગ પૃષ્ઠ તે સ્થાનના ચોક્કસ કોઓર્ડિનેટ્સ માટે તિથિ, નક્ષત્ર, યોગ, કરણ, રાહુ કાળ, યમગંડ, ગુલિક, સૂર્યોદય અને સૂર્યાસ્તની ગણતરી કરે છે – લાહિરી અયનાંશ સાથે શાસ્ત્રીય વૈદિક અલ્ગોરિધમ્સનો ઉપયોગ કરીને. મિનિટ સુધી ચોક્કસ સમય માટે નીચે તમારું શહેર પસંદ કરો.",
    indiaSection: "ભારત – રાજ્ય પ્રમાણે",
    internationalSection: "વૈશ્વિક હિંદુ ડાયસ્પોરા",
    internationalSubtitle: "વિશ્વભરના હિંદુ ડાયસ્પોરા માટે સચોટ વૈદિક પંચાંગ",
    breadcrumbHome: "હોમ",
    breadcrumbPanchang: "પંચાંગ",
    breadcrumbCurrent: "સ્થાનો",
    viewPanchang: "પંચાંગ જુઓ",
    cities: "શહેરો",
    whyTitle: "શહેર-વિશિષ્ટ પંચાંગ શા માટે?",
    whyText:
      "પંચાંગનો સમય – ખાસ કરીને રાહુ કાળ, યમગંડ, ગુલિક અને મુહૂર્ત વિન્ડો – સ્થાનિક સૂર્યોદય અને સૂર્યાસ્ત પર આધાર રાખે છે, જે રેખાંશ, અક્ષાંશ અને ઋતુ પ્રમાણે અલગ પડે છે. દિલ્હી માટે ગણતરી કરાયેલ પંચાંગ ચેન્નઈ અથવા ચંદીગઢ જેવા શહેરો માટે 20–90 મિનિટ સુધી અલગ હોઈ શકે છે. અહીં દરેક પૃષ્ઠ શહેર કેન્દ્રના ચોક્કસ કોઓર્ડિનેટ્સનો ઉપયોગ કરે છે.",
  },
  kn: {
    pageTitle: "ನಗರದ ಪ್ರಕಾರ ಪಂಚಾಂಗ",
    pageSubtitle: "ಭಾರತ ಮತ್ತು ಜಾಗತಿಕ ಹಿಂದೂ ವಲಸೆಗಾರರಲ್ಲಿ 55+ ಸ್ಥಳಗಳು",
    intro:
      "ಪ್ರತಿ ನಗರ-ನಿರ್ದಿಷ್ಟ ಪಂಚಾಂಗ ಪುಟವು ಆ ಸ್ಥಳದ ನಿಖರವಾದ ನಿರ್ದೇಶಾಂಕಗಳಿಗಾಗಿ ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ, ಕರಣ, ರಾಹು ಕಾಲ, ಯಮಗಂಡ, ಗುಳಿಕ, ಸೂರ್ಯೋದಯ ಮತ್ತು ಸೂರ್ಯಾಸ್ತವನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ – ಲಾಹಿರಿ ಅಯನಾಂಶದೊಂದಿಗೆ ಶಾಸ್ತ್ರೀಯ ವೈದಿಕ ಅಲ್ಗಾರಿದಮ್‌ಗಳನ್ನು ಬಳಸಿ. ನಿಮಿಷಕ್ಕೆ ನಿಖರವಾದ ಸಮಯಗಳಿಗಾಗಿ ಕೆಳಗೆ ನಿಮ್ಮ ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    indiaSection: "ಭಾರತ – ರಾಜ್ಯದ ಪ್ರಕಾರ",
    internationalSection: "ಜಾಗತಿಕ ಹಿಂದೂ ವಲಸೆಗಾರರು",
    internationalSubtitle:
      "ಪ್ರಪಂಚದಾದ್ಯಂತದ ಹಿಂದೂ ವಲಸೆಗಾರರಿಗಾಗಿ ನಿಖರವಾದ ವೈದಿಕ ಪಂಚಾಂಗ",
    breadcrumbHome: "ಮುಖಪುಟ",
    breadcrumbPanchang: "ಪಂಚಾಂಗ",
    breadcrumbCurrent: "ಸ್ಥಳಗಳು",
    viewPanchang: "ಪಂಚಾಂಗ ವೀಕ್ಷಿಸಿ",
    cities: "ನಗರಗಳು",
    whyTitle: "ನಗರ-ನಿರ್ದಿಷ್ಟ ಪಂಚಾಂಗ ಏಕೆ?",
    whyText:
      "ಪಂಚಾಂಗದ ಸಮಯಗಳು – ವಿಶೇಷವಾಗಿ ರಾಹು ಕಾಲ, ಯಮಗಂಡ, ಗುಳಿಕ ಮತ್ತು ಮುಹೂರ್ತ ವಿಂಡೋಗಳು – ಸ್ಥಳೀಯ ಸೂರ್ಯೋದಯ ಮತ್ತು ಸೂರ್ಯಾಸ್ತವನ್ನು ಅವಲಂಬಿಸಿರುತ್ತದೆ, ಇದು ರೇಖಾಂಶ, ಅಕ್ಷಾಂಶ ಮತ್ತು ಋತುವಿನ ಪ್ರಕಾರ ಭಿನ್ನವಾಗಿರುತ್ತದೆ. ದೆಹಲಿಗೆ ಲೆಕ್ಕಹಾಕಿದ ಪಂಚಾಂಗವು ಚೆನ್ನೈ ಅಥವಾ ಚಂಡೀಗಢದಂತಹ ನಗರಗಳಿಗೆ 20–90 ನಿಮಿಷಗಳಷ್ಟು ಭಿನ್ನವಾಗಿರಬಹುದು. ಇಲ್ಲಿ ಪ್ರತಿ ಪುಟವು ನಗರ ಕೇಂದ್ರದ ನಿಖರವಾದ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಬಳಸುತ್ತದೆ.",
  },
};

function t(key: string, locale: string): string {
  return (LABELS[locale] ?? LABELS["en"])[key] ?? LABELS["en"][key] ?? key;
}

// ─── Data Processing ─────────────────────────────────────────────────────────

interface StateGroup {
  state: string;
  cities: CityData[];
}

function groupByState(cities: CityData[]): StateGroup[] {
  const map = new Map<string, CityData[]>();
  for (const city of cities) {
    const s = city.state ?? "Other";
    if (!map.has(s)) map.set(s, []);
    map.get(s)!.push(city);
  }
  // Sort states alphabetically; sort cities within each state by population desc
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, cs]) => ({
      state,
      cities: [...cs].sort((a, b) => (b.population ?? 0) - (a.population ?? 0)),
    }));
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StateCard({ group, locale }: { group: StateGroup; locale: string }) {
  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 hover:border-gold-primary/40 transition-colors duration-200">
      {/* State header */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-gold-primary flex-shrink-0" />
        <h3 className="text-gold-light font-semibold text-base leading-tight">
          {group.state}
        </h3>
        <span className="ml-auto text-xs text-text-secondary bg-gold-primary/10 border border-gold-primary/20 rounded-full px-2 py-0.5">
          {group.cities.length}{" "}
          {/* city count badge  –  label omitted for brevity at small sizes */}
        </span>
      </div>

      {/* City list */}
      <ul className="space-y-1">
        {group.cities.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/panchang/${city.slug}` as "/panchang/[city]"}
              className="group flex items-center justify-between rounded-lg px-3 py-1.5 hover:bg-gold-primary/8 transition-colors duration-150"
            >
              <span className="text-text-primary text-sm group-hover:text-gold-light transition-colors">
                {cityName(city, locale)}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-gold-primary transition-colors flex-shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InternationalCard({
  city,
  locale,
}: {
  city: CityData;
  locale: string;
}) {
  return (
    <Link
      href={`/panchang/${city.slug}` as "/panchang/[city]"}
      className="group bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 hover:border-gold-primary/40 transition-colors duration-200 flex flex-col gap-2"
    >
      <div className="flex items-start gap-2">
        <Globe className="w-4 h-4 text-gold-primary flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-gold-light font-semibold text-sm leading-snug group-hover:text-gold-light truncate">
            {cityName(city, locale)}
          </p>
          <p className="text-text-secondary text-xs mt-0.5">{city.state}</p>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-gold-primary transition-colors flex-shrink-0 ml-auto mt-0.5" />
      </div>
    </Link>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function LocationsPage() {
  const locale = await getLocale();
  setRequestLocale(locale);

  const headingFont = getHeadingFont(locale);
  const isDevanagari = isDevanagariLocale(locale);

  const indianCities = ALL_CITIES.filter((c) => !isInternational(c));
  const internationalCities = ALL_CITIES.filter((c) => isInternational(c)).sort(
    (a, b) => (b.population ?? 0) - (a.population ?? 0),
  );

  const stateGroups = groupByState(indianCities);

  return (
    <main className="min-h-screen bg-[#0a0e27] text-text-primary">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-gold-primary/10">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2d1b69]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#1a1040]/40 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-text-secondary mb-6"
          >
            <Link href="/" className="hover:text-gold-light transition-colors">
              {t("breadcrumbHome", locale)}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/panchang"
              className="hover:text-gold-light transition-colors"
            >
              {t("breadcrumbPanchang", locale)}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">
              {t("breadcrumbCurrent", locale)}
            </span>
          </nav>

          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-primary/30 to-gold-dark/20 border border-gold-primary/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-gold-primary" />
            </div>
            <div>
              <h1
                className="text-3xl sm:text-4xl font-bold text-gold-light leading-tight"
                style={headingFont}
              >
                {t("pageTitle", locale)}
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                {t("pageSubtitle", locale)}
              </p>
            </div>
          </div>

          {/* Intro */}
          <p
            className="text-text-secondary leading-relaxed max-w-3xl text-sm sm:text-base mt-4"
            style={
              isDevanagari
                ? { fontFamily: "var(--font-devanagari-body)" }
                : undefined
            }
          >
            {t("intro", locale)}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
        {/* ── India section ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl" role="img" aria-label="India flag">
              🇮🇳
            </span>
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-gold-light"
                style={headingFont}
              >
                {t("indiaSection", locale)}
              </h2>
              <p className="text-text-secondary text-sm mt-0.5">
                {stateGroups.length} states &amp; UTs · {indianCities.length}{" "}
                cities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stateGroups.map((group) => (
              <StateCard key={group.state} group={group} locale={locale} />
            ))}
          </div>
        </section>

        {/* ── Why city-specific callout ── */}
        <div className="bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 sm:p-8">
          <h2
            className="text-xl font-bold text-gold-light mb-3"
            style={headingFont}
          >
            {t("whyTitle", locale)}
          </h2>
          <p
            className="text-text-secondary leading-relaxed text-sm sm:text-base"
            style={
              isDevanagari
                ? { fontFamily: "var(--font-devanagari-body)" }
                : undefined
            }
          >
            {t("whyText", locale)}
          </p>
        </div>

        {/* ── International section ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-7 h-7 text-gold-primary flex-shrink-0" />
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-gold-light"
                style={headingFont}
              >
                {t("internationalSection", locale)}
              </h2>
              <p className="text-text-secondary text-sm mt-0.5">
                {t("internationalSubtitle", locale)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {internationalCities.map((city) => (
              <InternationalCard key={city.slug} city={city} locale={locale} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
