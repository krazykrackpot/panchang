"use client";

import { useState, useMemo, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Moon, ArrowLeft, CheckCircle, XCircle, Info } from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";
import RelatedLinks from "@/components/ui/RelatedLinks";
import { getLearnLinksForTool } from "@/lib/seo/cross-links";
import { Link } from "@/lib/i18n/navigation";
import { useLocationStore } from "@/stores/location-store";
import { computePanchang } from "@/lib/ephem/panchang-calc";
import { getUTCOffsetForDate } from "@/lib/utils/timezone";
import { RASHIS } from "@/lib/constants/rashis";
import { RashiIconById } from "@/components/icons/RashiIcons";
import {
  computeChandrabalamGrid,
  FAVORABLE_HOUSES,
} from "@/lib/panchang/balam";
import { tl } from "@/lib/utils/trilingual";
import { safeJsonLd } from "@/lib/seo/safe-jsonld";
import { generateBreadcrumbLD } from "@/lib/seo/structured-data";
import { isDevanagariLocale } from "@/lib/utils/locale-fonts";
import type { Locale } from "@/lib/i18n/config";

// ── House descriptions ──
const HOUSE_LABELS: Record<number, { en: string; hi: string }> = {
  1: { en: "Janma (Birth)", hi: "जन्म (1st)" },
  2: { en: "Dhan (Wealth)", hi: "धन (2nd)" },
  3: { en: "Sahaj (Siblings)", hi: "सहज (3rd)" },
  4: { en: "Sukha (Comfort)", hi: "सुख (4th)" },
  5: { en: "Putra (Children)", hi: "पुत्र (5th)" },
  6: { en: "Ari (Enemies)", hi: "अरि (6th)" },
  7: { en: "Yuvati (Partner)", hi: "युवति (7th)" },
  8: { en: "Ayu (Longevity)", hi: "आयु (8th)" },
  9: { en: "Dharma (Fortune)", hi: "धर्म (9th)" },
  10: { en: "Karma (Career)", hi: "कर्म (10th)" },
  11: { en: "Labha (Gains)", hi: "लाभ (11th)" },
  12: { en: "Vyaya (Loss)", hi: "व्यय (12th)" },
};

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: "Panchang",
    title: "Chandrabalam Today",
    subtitle:
      "Moon strength for all 12 signs based on today's Moon transit. Check if the Moon's current position is favorable or unfavorable for your birth rashi.",
    moonIn: "Moon is in",
    favorable: "Favorable",
    unfavorable: "Unfavorable",
    house: "House",
    yourRashi: "Your Moon Sign",
    status: "Status",
    transitHouse: "Transit House",
    noLocation: "Set your location to calculate today's Moon rashi",
    detectLocation: "Detect Location",
    whatIs: "What is Chandrabalam?",
    whatIsText:
      "Chandrabalam (Moon Strength) measures the auspiciousness of the Moon's current transit position relative to your natal Moon sign. The Moon transits through one rashi roughly every 2.25 days. From your birth Moon sign, certain houses (3rd, 6th, 7th, 9th, 10th, 11th) are favorable for the Moon's transit, while others (1st, 2nd, 4th, 5th, 8th, 12th) indicate caution. This is a key factor in Muhurta (electional astrology) for timing important activities.",
    howToUse: "How to Use",
    howToUseText:
      "Find your birth Moon sign (Janma Rashi) in the grid below. Green means the Moon's transit today is supportive for you  –  good for starting new ventures, travel, and important decisions. Red means the transit is challenging  –  better to postpone major initiatives if possible. Chandrabalam is just one factor; combine with Tarabalam and Panchang elements for a complete picture.",
    favorableCount: "favorable",
    unfavorableCount: "unfavorable",
    loading: "Computing Moon position...",
  },
  hi: {
    back: "पंचांग",
    title: "आज का चन्द्रबल",
    subtitle:
      "आज के चन्द्र गोचर पर आधारित सभी 12 राशियों के लिए चन्द्रबल। जानें आपकी जन्म राशि के लिए चन्द्रमा अनुकूल है या प्रतिकूल।",
    moonIn: "चन्द्रमा",
    favorable: "अनुकूल",
    unfavorable: "प्रतिकूल",
    house: "भाव",
    yourRashi: "आपकी चन्द्र राशि",
    status: "स्थिति",
    transitHouse: "गोचर भाव",
    noLocation: "आज की चन्द्र राशि की गणना के लिए अपना स्थान सेट करें",
    detectLocation: "स्थान पता लगाएं",
    whatIs: "चन्द्रबल क्या है?",
    whatIsText:
      "चन्द्रबल चन्द्रमा के वर्तमान गोचर स्थिति की आपकी जन्म चन्द्र राशि से शुभता का मापन करता है। चन्द्रमा लगभग 2.25 दिनों में एक राशि पार करता है। आपकी जन्म राशि से कुछ भाव (3, 6, 7, 9, 10, 11) गोचर के लिए अनुकूल हैं, जबकि अन्य (1, 2, 4, 5, 8, 12) सावधानी के सूचक हैं।",
    howToUse: "कैसे उपयोग करें",
    howToUseText:
      "नीचे दी गई तालिका में अपनी जन्म चन्द्र राशि खोजें। हरा रंग अनुकूल गोचर दर्शाता है  –  नए कार्य, यात्रा और महत्वपूर्ण निर्णयों के लिए शुभ। लाल रंग चुनौतीपूर्ण गोचर दर्शाता है  –  बड़े कार्य टालना उचित। सम्पूर्ण चित्र के लिए ताराबल और पंचांग तत्वों के साथ मिलाकर देखें।",
    favorableCount: "अनुकूल",
    unfavorableCount: "प्रतिकूल",
    loading: "चन्द्र स्थिति की गणना हो रही है...",
  },
  mai: {
    back: "पंचांग",
    title: "चंद्रबल आइ",
    subtitle:
      "आइक चंद्र गोचरक आधार पर सभ १२ राशिक लेल चंद्रक बल। देखू जे चंद्रमाक वर्तमान स्थिति अहांक जन्म राशिक लेल शुभ अछि वा अशुभ।",
    moonIn: "चंद्रमा एहि मे अछि",
    favorable: "शुभ",
    unfavorable: "अशुभ",
    house: "भाव",
    yourRashi: "अहांक चंद्र राशि",
    status: "स्थिति",
    transitHouse: "गोचर भाव",
    noLocation: "आइक चंद्र राशिक गणना करबाक लेल अपन स्थान निर्धारित करू",
    detectLocation: "स्थानक पता लगाउ",
    whatIs: "चंद्रबल की अछि?",
    whatIsText:
      "चंद्रबल (चंद्रमाक बल) अहांक जन्म चंद्र राशिक सापेक्ष चंद्रमाक वर्तमान गोचर स्थितिक शुभता के मापैत अछि। चंद्रमा लगभग प्रत्येक २.२५ दिन मे एक राशि सँ गोचर करैत अछि। अहांक जन्म चंद्र राशि सँ, किछु भाव (तेसर, छठम, सातहम, नवम, दशम, एकादश) चंद्रमाक गोचरक लेल शुभ होइत अछि, जखन कि अन्य (पहल, दोसर, चारिम, पांचम, आठम, बारहहम) सावधानीक संकेत दैत अछि। ई महत्वपूर्ण गतिविधि सभक समय निर्धारणक लेल मुहूर्त (निर्वाचन ज्योतिष) मे एकटा मुख्य कारक अछि।",
    howToUse: "कनाय उपयोग करी?",
    howToUseText:
      "नीचा देल गेल ग्रिड मे अपन जन्म चंद्र राशि (जन्म राशि) खोजू। हरियर रंगक अर्थ अछि जे आइ चंद्रमाक गोचर अहांक लेल सहायक अछि – नवका कार्य शुरू करबाक, यात्रा आ महत्वपूर्ण निर्णय लेबाक लेल नीक। लाल रंगक अर्थ अछि जे गोचर चुनौतीपूर्ण अछि – यदि संभव हो तऽ प्रमुख पहल के स्थगित करनाय नीक। चंद्रबल मात्र एकटा कारक अछि; पूर्ण चित्रक लेल ताराबल आ पंचांग तत्व सभक संग मिलाउ।",
    favorableCount: "शुभ",
    unfavorableCount: "अशुभ",
    loading: "चंद्रमाक स्थिति गणना भऽ रहल अछि...",
  },
  mr: {
    back: "पंचांग",
    title: "आजचे चंद्रबल",
    subtitle:
      "आजच्या चंद्र गोचरावर आधारित सर्व १२ राशींसाठी चंद्राचे बल. चंद्राची सध्याची स्थिती तुमच्या जन्म राशीसाठी अनुकूल आहे की प्रतिकूल ते तपासा.",
    moonIn: "चंद्र आहे",
    favorable: "अनुकूल",
    unfavorable: "प्रतिकूल",
    house: "भाव",
    yourRashi: "तुमची चंद्र रास",
    status: "स्थिती",
    transitHouse: "गोचर भाव",
    noLocation: "आजची चंद्र रास काढण्यासाठी तुमचे स्थान सेट करा",
    detectLocation: "स्थान शोधा",
    whatIs: "चंद्रबल म्हणजे काय?",
    whatIsText:
      "चंद्रबल (चंद्राचे बल) तुमच्या जन्म चंद्र राशीच्या सापेक्ष चंद्राच्या सध्याच्या गोचर स्थितीची शुभता मोजते. चंद्र अंदाजे दर २.२५ दिवसांनी एका राशीतून गोचर करतो. तुमच्या जन्म चंद्र राशीपासून, काही भाव (तिसरा, सहावा, सातवा, नववा, दहावा, अकरावा) चंद्राच्या गोचरासाठी अनुकूल असतात, तर इतर (पहिला, दुसरा, चौथा, पाचवा, आठवा, बारावा) सावधगिरी दर्शवतात. महत्त्वाच्या कार्यांसाठी मुहूर्त (निवडक ज्योतिष) मध्ये वेळेचे नियोजन करण्यासाठी हा एक महत्त्वाचा घटक आहे.",
    howToUse: "कसे वापरावे",
    howToUseText:
      "खालील ग्रिडमध्ये तुमची जन्म चंद्र रास (जन्म रास) शोधा. हिरवा रंग म्हणजे आज चंद्राचे गोचर तुमच्यासाठी सहायक आहे – नवीन उपक्रम सुरू करण्यासाठी, प्रवासासाठी आणि महत्त्वाच्या निर्णयांसाठी चांगले. लाल रंग म्हणजे गोचर आव्हानात्मक आहे – शक्य असल्यास मोठ्या उपक्रमांना पुढे ढकलणे चांगले. चंद्रबल हा फक्त एक घटक आहे; पूर्ण चित्रासाठी ताराबल आणि पंचांग घटकांसह एकत्र करा.",
    favorableCount: "अनुकूल",
    unfavorableCount: "प्रतिकूल",
    loading: "चंद्राच्या स्थितीची गणना करत आहे...",
  },
  ta: {
    back: "பஞ்சாங்கம்",
    title: "இன்றைய சந்திரபலம்",
    subtitle:
      "இன்றைய சந்திர சஞ்சாரத்தின் அடிப்படையில் அனைத்து 12 ராசிகளுக்கும் சந்திரனின் பலம். உங்கள் ஜென்ம ராசிக்கு சந்திரனின் தற்போதைய நிலை சாதகமா அல்லது பாதகமா என்பதை சரிபார்க்கவும்.",
    moonIn: "சந்திரன் உள்ளது",
    favorable: "சாதகமானது",
    unfavorable: "பாதகமானது",
    house: "பாவம்",
    yourRashi: "உங்கள் சந்திர ராசி",
    status: "நிலை",
    transitHouse: "கோச்சார பாவம்",
    noLocation: "இன்றைய சந்திர ராசியைக் கணக்கிட உங்கள் இருப்பிடத்தை அமைக்கவும்",
    detectLocation: "இருப்பிடத்தைக் கண்டறியவும்",
    whatIs: "சந்திரபலம் என்றால் என்ன?",
    whatIsText:
      "சந்திரபலம் (சந்திரனின் பலம்) உங்கள் ஜென்ம சந்திர ராசிக்கு ஏற்ப சந்திரனின் தற்போதைய கோச்சார நிலையின் சுபத்தன்மையை அளவிடுகிறது. சந்திரன் தோராயமாக ஒவ்வொரு 2.25 நாட்களுக்கும் ஒரு ராசியில் சஞ்சரிக்கிறார். உங்கள் ஜென்ம சந்திர ராசியிலிருந்து, சில பாவங்கள் (3, 6, 7, 9, 10, 11) சந்திரனின் சஞ்சாரத்திற்கு சாதகமானவை, மற்றவை (1, 2, 4, 5, 8, 12) எச்சரிக்கையைக் குறிக்கின்றன. முக்கியமான செயல்பாடுகளுக்கு நேரம் நிர்ணயம் செய்ய முகூர்த்தத்தில் (தேர்வு ஜோதிடம்) இது ஒரு முக்கிய காரணியாகும்.",
    howToUse: "எப்படி பயன்படுத்துவது",
    howToUseText:
      "கீழே உள்ள கட்டத்தில் உங்கள் ஜென்ம சந்திர ராசியைக் (ஜென்ம ராசி) கண்டறியவும். பச்சை நிறம் என்பது இன்றைய சந்திர சஞ்சாரம் உங்களுக்கு ஆதரவாக உள்ளது என்பதைக் குறிக்கிறது – புதிய முயற்சிகளைத் தொடங்க, பயணம் செய்ய மற்றும் முக்கியமான முடிவுகளை எடுக்க நல்லது. சிவப்பு நிறம் என்பது சஞ்சாரம் சவாலானது என்பதைக் குறிக்கிறது – முடிந்தால் பெரிய முயற்சிகளை ஒத்திவைப்பது நல்லது. சந்திரபலம் ஒரு காரணி மட்டுமே; முழுமையான படத்திற்கு தாராபலம் மற்றும் பஞ்சாங்க கூறுகளுடன் இணைக்கவும்.",
    favorableCount: "சாதகமானது",
    unfavorableCount: "பாதகமானது",
    loading: "சந்திரனின் நிலை கணக்கிடப்படுகிறது...",
  },
  te: {
    back: "పంచాంగం",
    title: "నేటి చంద్రబలం",
    subtitle:
      "నేటి చంద్ర సంచారం ఆధారంగా అన్ని 12 రాశులకు చంద్రుని బలం. మీ జన్మ రాశికి చంద్రుని ప్రస్తుత స్థానం అనుకూలమా లేదా ప్రతికూలమా అని తనిఖీ చేయండి.",
    moonIn: "చంద్రుడు ఉన్నాడు",
    favorable: "అనుకూలమైనది",
    unfavorable: "ప్రతికూలమైనది",
    house: "భావం",
    yourRashi: "మీ చంద్ర రాశి",
    status: "స్థితి",
    transitHouse: "గోచార భావం",
    noLocation: "నేటి చంద్ర రాశిని లెక్కించడానికి మీ స్థానాన్ని సెట్ చేయండి",
    detectLocation: "స్థానాన్ని గుర్తించండి",
    whatIs: "చంద్రబలం అంటే ఏమిటి?",
    whatIsText:
      "చంద్రబలం (చంద్రుని బలం) మీ జన్మ చంద్ర రాశికి సంబంధించి చంద్రుని ప్రస్తుత గోచార స్థానం యొక్క శుభత్వాన్ని కొలుస్తుంది. చంద్రుడు సుమారు ప్రతి 2.25 రోజులకు ఒక రాశిలో సంచరిస్తాడు. మీ జన్మ చంద్ర రాశి నుండి, కొన్ని భావాలు (3వ, 6వ, 7వ, 9వ, 10వ, 11వ) చంద్రుని సంచారానికి అనుకూలమైనవి, అయితే ఇతరాలు (1వ, 2వ, 4వ, 5వ, 8వ, 12వ) జాగ్రత్తను సూచిస్తాయి. ముఖ్యమైన కార్యకలాపాలకు సమయాన్ని నిర్ణయించడానికి ముహూర్తంలో (ఎలక్షనల్ జ్యోతిష్యం) ఇది ఒక ముఖ్యమైన అంశం.",
    howToUse: "ఎలా ఉపయోగించాలి",
    howToUseText:
      "దిగువ గ్రిడ్‌లో మీ జన్మ చంద్ర రాశిని (జన్మ రాశి) కనుగొనండి. ఆకుపచ్చ రంగు అంటే నేటి చంద్ర సంచారం మీకు మద్దతుగా ఉంది – కొత్త వెంచర్‌లను ప్రారంభించడానికి, ప్రయాణానికి మరియు ముఖ్యమైన నిర్ణయాలకు మంచిది. ఎరుపు రంగు అంటే సంచారం సవాలుతో కూడుకున్నది – వీలైతే ప్రధాన కార్యక్రమాలను వాయిదా వేయడం మంచిది. చంద్రబలం కేవలం ఒక అంశం మాత్రమే; పూర్తి చిత్రం కోసం తారాబలం మరియు పంచాంగ అంశాలతో కలపండి.",
    favorableCount: "అనుకూలమైనది",
    unfavorableCount: "ప్రతికూలమైనది",
    loading: "చంద్రుని స్థానం లెక్కిస్తోంది...",
  },
  bn: {
    back: "পঞ্জিকা",
    title: "আজকের চন্দ্রবল",
    subtitle:
      "আজকের চন্দ্র গোচরের উপর ভিত্তি করে সমস্ত ১২টি রাশির জন্য চন্দ্রের শক্তি। আপনার জন্ম রাশির জন্য চন্দ্রের বর্তমান অবস্থান অনুকূল নাকি প্রতিকূল তা পরীক্ষা করুন।",
    moonIn: "চন্দ্র আছে",
    favorable: "অনুকূল",
    unfavorable: "প্রতিকূল",
    house: "ভাব",
    yourRashi: "আপনার চন্দ্র রাশি",
    status: "স্থিতি",
    transitHouse: "গোচর ভাব",
    noLocation: "আজকের চন্দ্র রাশি গণনা করতে আপনার অবস্থান সেট করুন",
    detectLocation: "অবস্থান সনাক্ত করুন",
    whatIs: "চন্দ্রবল কী?",
    whatIsText:
      "চন্দ্রবল (চন্দ্রের শক্তি) আপনার জন্ম চন্দ্র রাশির সাপেক্ষে চন্দ্রের বর্তমান গোচর অবস্থানের শুভতা পরিমাপ করে। চন্দ্র প্রায় প্রতি ২.২৫ দিনে একটি রাশির মধ্য দিয়ে গোচর করে। আপনার জন্ম চন্দ্র রাশি থেকে, কিছু ভাব (৩য়, ৬ষ্ঠ, ৭ম, ৯ম, ১০ম, ১১শ) চন্দ্রের গোচরের জন্য অনুকূল হয়, যখন অন্যান্য (১ম, ২য়, ৪র্থ, ৫ম, ৮ম, ১২শ) সতর্কতার ইঙ্গিত দেয়। গুরুত্বপূর্ণ কার্যকলাপের সময় নির্ধারণের জন্য এটি মুহূর্ত (নির্বাচনী জ্যোতিষ) এর একটি মূল কারণ।",
    howToUse: "কীভাবে ব্যবহার করবেন",
    howToUseText:
      "নীচের গ্রিডে আপনার জন্ম চন্দ্র রাশি (জন্ম রাশি) খুঁজুন। সবুজ মানে আজকের চন্দ্র গোচর আপনার জন্য সহায়ক – নতুন উদ্যোগ শুরু করতে, ভ্রমণ এবং গুরুত্বপূর্ণ সিদ্ধান্ত নেওয়ার জন্য ভালো। লাল মানে গোচর চ্যালেঞ্জিং – সম্ভব হলে বড় উদ্যোগ স্থগিত করা ভালো। চন্দ্রবল কেবল একটি কারণ; একটি সম্পূর্ণ চিত্রের জন্য তারাবল এবং পঞ্জিকা উপাদানগুলির সাথে একত্রিত করুন।",
    favorableCount: "অনুকূল",
    unfavorableCount: "প্রতিকূল",
    loading: "চন্দ্রের অবস্থান গণনা করা হচ্ছে...",
  },
  gu: {
    back: "પંચાંગ",
    title: "આજનું ચંદ્રબળ",
    subtitle:
      "આજના ચંદ્ર ગોચરના આધારે તમામ ૧૨ રાશિઓ માટે ચંદ્રનું બળ. ચંદ્રની વર્તમાન સ્થિતિ તમારી જન્મ રાશિ માટે અનુકૂળ છે કે પ્રતિકૂળ તે તપાસો.",
    moonIn: "ચંદ્ર માં છે",
    favorable: "અનુકૂળ",
    unfavorable: "પ્રતિકૂળ",
    house: "ભાવ",
    yourRashi: "તમારી ચંદ્ર રાશિ",
    status: "સ્થિતિ",
    transitHouse: "ગોચર ભાવ",
    noLocation: "આજની ચંદ્ર રાશિની ગણતરી કરવા માટે તમારું સ્થાન સેટ કરો",
    detectLocation: "સ્થાન શોધો",
    whatIs: "ચંદ્રબળ શું છે?",
    whatIsText:
      "ચંદ્રબળ (ચંદ્રનું બળ) તમારી જન્મ ચંદ્ર રાશિના સંબંધમાં ચંદ્રની વર્તમાન ગોચર સ્થિતિની શુભતાને માપે છે. ચંદ્ર આશરે દર ૨.૨૫ દિવસે એક રાશિમાંથી ગોચર કરે છે. તમારી જન્મ ચંદ્ર રાશિથી, કેટલાક ભાવ (ત્રીજો, છઠ્ઠો, સાતમો, નવમો, દસમો, અગિયારમો) ચંદ્રના ગોચર માટે અનુકૂળ હોય છે, જ્યારે અન્ય (પ્રથમ, બીજો, ચોથો, પાંચમો, આઠમો, બારમો) સાવચેતી સૂચવે છે. મહત્વપૂર્ણ પ્રવૃત્તિઓનો સમય નક્કી કરવા માટે મુહૂર્ત (ચૂંટણી જ્યોતિષ) માં આ એક મુખ્ય પરિબળ છે.",
    howToUse: "કેવી રીતે ઉપયોગ કરવો",
    howToUseText:
      "નીચેની ગ્રીડમાં તમારી જન્મ ચંદ્ર રાશિ (જન્મ રાશિ) શોધો. લીલો રંગ એટલે કે આજનું ચંદ્ર ગોચર તમારા માટે સહાયક છે – નવા સાહસો શરૂ કરવા, મુસાફરી અને મહત્વપૂર્ણ નિર્ણયો માટે સારું. લાલ રંગ એટલે કે ગોચર પડકારજનક છે – જો શક્ય હોય તો મોટા સાહસોને મુલતવી રાખવું સારું. ચંદ્રબળ ફક્ત એક પરિબળ છે; સંપૂર્ણ ચિત્ર માટે તારાબળ અને પંચાંગ તત્વો સાથે જોડો.",
    favorableCount: "અનુકૂળ",
    unfavorableCount: "પ્રતિકૂળ",
    loading: "ચંદ્રની સ્થિતિની ગણતરી થઈ રહી છે...",
  },
  kn: {
    back: "ಪಂಚಾಂಗ",
    title: "ಇಂದಿನ ಚಂದ್ರಬಲ",
    subtitle:
      "ಇಂದಿನ ಚಂದ್ರ ಸಂಚಾರದ ಆಧಾರದ ಮೇಲೆ ಎಲ್ಲಾ ೧೨ ರಾಶಿಗಳಿಗೆ ಚಂದ್ರನ ಬಲ. ನಿಮ್ಮ ಜನ್ಮ ರಾಶಿಗೆ ಚಂದ್ರನ ಪ್ರಸ್ತುತ ಸ್ಥಾನವು ಅನುಕೂಲಕರವಾಗಿದೆಯೇ ಅಥವಾ ಪ್ರತಿಕೂಲವಾಗಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ.",
    moonIn: "ಚಂದ್ರನಿದ್ದಾನೆ",
    favorable: "ಅನುಕೂಲಕರ",
    unfavorable: "ಪ್ರತಿಕೂಲಕರ",
    house: "ಭಾವ",
    yourRashi: "ನಿಮ್ಮ ಚಂದ್ರ ರಾಶಿ",
    status: "ಸ್ಥಿತಿ",
    transitHouse: "ಗೋಚಾರ ಭಾವ",
    noLocation: "ಇಂದಿನ ಚಂದ್ರ ರಾಶಿಯನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡಲು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹೊಂದಿಸಿ",
    detectLocation: "ಸ್ಥಳವನ್ನು ಪತ್ತೆ ಮಾಡಿ",
    whatIs: "ಚಂದ್ರಬಲ ಎಂದರೇನು?",
    whatIsText:
      "ಚಂದ್ರಬಲ (ಚಂದ್ರನ ಬಲ) ನಿಮ್ಮ ಜನ್ಮ ಚಂದ್ರ ರಾಶಿಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಚಂದ್ರನ ಪ್ರಸ್ತುತ ಗೋಚಾರ ಸ್ಥಾನದ ಶುಭತೆಯನ್ನು ಅಳೆಯುತ್ತದೆ. ಚಂದ್ರನು ಸರಿಸುಮಾರು ಪ್ರತಿ ೨.೨೫ ದಿನಗಳಿಗೊಮ್ಮೆ ಒಂದು ರಾಶಿಯ ಮೂಲಕ ಸಂಚರಿಸುತ್ತಾನೆ. ನಿಮ್ಮ ಜನ್ಮ ಚಂದ್ರ ರಾಶಿಯಿಂದ, ಕೆಲವು ಭಾವಗಳು (೩ನೇ, ೬ನೇ, ೭ನೇ, ೯ನೇ, ೧೦ನೇ, ೧೧ನೇ) ಚಂದ್ರನ ಸಂಚಾರಕ್ಕೆ ಅನುಕೂಲಕರವಾಗಿವೆ, ಆದರೆ ಇತರವುಗಳು (೧ನೇ, ೨ನೇ, ೪ನೇ, ೫ನೇ, ೮ನೇ, ೧೨ನೇ) ಎಚ್ಚರಿಕೆಯನ್ನು ಸೂಚಿಸುತ್ತವೆ. ಪ್ರಮುಖ ಚಟುವಟಿಕೆಗಳ ಸಮಯವನ್ನು ನಿರ್ಧರಿಸಲು ಮುಹೂರ್ತದಲ್ಲಿ (ಚುನಾವಣಾ ಜ್ಯೋತಿಷ್ಯ) ಇದು ಒಂದು ಪ್ರಮುಖ ಅಂಶವಾಗಿದೆ.",
    howToUse: "ಹೇಗೆ ಬಳಸುವುದು",
    howToUseText:
      "ಕೆಳಗಿನ ಗ್ರಿಡ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಜನ್ಮ ಚಂದ್ರ ರಾಶಿಯನ್ನು (ಜನ್ಮ ರಾಶಿ) ಹುಡುಕಿ. ಹಸಿರು ಎಂದರೆ ಇಂದಿನ ಚಂದ್ರ ಸಂಚಾರವು ನಿಮಗೆ ಬೆಂಬಲ ನೀಡುತ್ತದೆ – ಹೊಸ ಉದ್ಯಮಗಳನ್ನು ಪ್ರಾರಂಭಿಸಲು, ಪ್ರಯಾಣಿಸಲು ಮತ್ತು ಪ್ರಮುಖ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ಒಳ್ಳೆಯದು. ಕೆಂಪು ಎಂದರೆ ಸಂಚಾರವು ಸವಾಲಿನದು – ಸಾಧ್ಯವಾದರೆ ಪ್ರಮುಖ ಉಪಕ್ರಮಗಳನ್ನು ಮುಂದೂಡುವುದು ಉತ್ತಮ. ಚಂದ್ರಬಲವು ಕೇವಲ ಒಂದು ಅಂಶವಾಗಿದೆ; ಸಂಪೂರ್ಣ ಚಿತ್ರಕ್ಕಾಗಿ ತಾರಾಬಲ ಮತ್ತು ಪಂಚಾಂಗ ಅಂಶಗಳೊಂದಿಗೆ ಸಂಯೋಜಿಸಿ.",
    favorableCount: "ಅನುಕೂಲಕರ",
    unfavorableCount: "ಪ್ರತಿಕೂಲಕರ",
    loading: "ಚಂದ್ರನ ಸ್ಥಾನವನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡಲಾಗುತ್ತಿದೆ...",
  },
};

export default function ChandrabalamPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const L = LABELS[isDevanagari ? "hi" : "en"] || LABELS.en;
  const headingFont = isDevanagari
    ? { fontFamily: "var(--font-devanagari-heading)" }
    : { fontFamily: "var(--font-heading)" };

  const {
    lat,
    lng,
    name: locationName,
    timezone: ianaTimezone,
  } = useLocationStore();
  const [moonRashi, setMoonRashi] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lng) {
      setLoading(false);
      return;
    }
    try {
      const now = new Date();
      const tz = getUTCOffsetForDate(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        ianaTimezone || "UTC",
      );
      const panchang = computePanchang({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        lat,
        lng,
        tzOffset: tz,
        timezone: ianaTimezone || undefined,
        locationName: locationName || undefined,
      });
      const moonPlanet = panchang.planets.find((p) => p.id === 1);
      setMoonRashi(moonPlanet?.rashi || panchang.moonSign?.rashi || null);
    } catch (err) {
      console.error("[chandrabalam] Failed to compute panchang:", err);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, ianaTimezone, locationName]);

  const grid = useMemo(
    () => (moonRashi ? computeChandrabalamGrid(moonRashi) : []),
    [moonRashi],
  );
  const favCount = grid.filter((g) => g.favorable).length;
  const unfavCount = grid.length - favCount;

  const moonRashiData = moonRashi ? RASHIS[moonRashi - 1] : null;

  const learnLinks = getLearnLinksForTool("/chandrabalam");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(generateBreadcrumbLD("/chandrabalam", locale)),
        }}
      />

      {/* Back link */}
      <Link
        href="/panchang"
        className="inline-flex items-center gap-1.5 text-gold-primary hover:text-gold-light text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {L.back}
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          style={headingFont}
        >
          <span className="text-gold-gradient">{L.title}</span>
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto">
          {L.subtitle}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
          <p className="text-text-secondary text-sm">{L.loading}</p>
        </div>
      ) : !moonRashi ? (
        <div className="text-center py-20">
          <Moon className="w-16 h-16 text-gold-primary/30 mx-auto mb-4" />
          <p className="text-text-secondary mb-4">{L.noLocation}</p>
        </div>
      ) : (
        <>
          {/* Current Moon Rashi badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 mb-10"
          >
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 px-8 py-5 flex items-center gap-4">
              <RashiIconById id={moonRashi} size={56} />
              <div>
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">
                  {L.moonIn}
                </div>
                <div
                  className="text-gold-light font-bold text-2xl"
                  style={headingFont}
                >
                  {tl(moonRashiData?.name || { en: "" }, locale)}
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-4 h-4" /> {favCount}{" "}
                {L.favorableCount}
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <XCircle className="w-4 h-4" /> {unfavCount}{" "}
                {L.unfavorableCount}
              </span>
            </div>
          </motion.div>

          <GoldDivider />

          {/* 12-rashi grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-10">
            {grid.map((entry, i) => {
              const rashi = RASHIS[entry.rashiId - 1];
              const houseLabel = HOUSE_LABELS[entry.house];
              return (
                <motion.div
                  key={entry.rashiId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border p-4 text-center transition-all hover:scale-[1.03] ${
                    entry.favorable
                      ? "border-emerald-500/25 hover:border-emerald-500/50"
                      : "border-red-500/20 hover:border-red-500/40"
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <RashiIconById id={entry.rashiId} size={40} />
                  </div>
                  <div
                    className="text-gold-light font-bold text-sm"
                    style={
                      isDevanagari
                        ? { fontFamily: "var(--font-devanagari-body)" }
                        : undefined
                    }
                  >
                    {tl(rashi.name, locale)}
                  </div>
                  <div className="text-text-secondary text-xs mt-1">
                    {L.house} {entry.house}{" "}
                    {isDevanagari ? houseLabel?.hi : houseLabel?.en}
                  </div>
                  <div
                    className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                      entry.favorable ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {entry.favorable ? L.favorable : L.unfavorable}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <GoldDivider />

          {/* Classical rules reference */}
          <div className="my-10">
            <h2
              className="text-xl font-bold text-gold-gradient mb-4"
              style={headingFont}
            >
              {isDevanagari
                ? "चन्द्रबल नियम (मुहूर्त चिन्तामणि)"
                : "Chandrabalam Rules (Muhurta Chintamani)"}
            </h2>
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((house) => {
                  const isFav = FAVORABLE_HOUSES.has(house);
                  const label = HOUSE_LABELS[house];
                  return (
                    <div
                      key={house}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${isFav ? "bg-emerald-400" : "bg-red-400"}`}
                      />
                      <span className="text-text-secondary">{house}.</span>
                      <span className="text-text-primary text-xs">
                        {isDevanagari ? label?.hi : label?.en}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <GoldDivider />

          {/* Explanation */}
          <div className="space-y-8 my-10">
            <div>
              <h2
                className="text-xl font-bold text-gold-gradient mb-3 flex items-center gap-2"
                style={headingFont}
              >
                <Info className="w-5 h-5 text-gold-primary" /> {L.whatIs}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                {L.whatIsText}
              </p>
            </div>
            <div>
              <h2
                className="text-xl font-bold text-gold-gradient mb-3"
                style={headingFont}
              >
                {L.howToUse}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                {L.howToUseText}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Related links */}
      {learnLinks.length > 0 && (
        <div className="mt-14">
          <RelatedLinks type="learn" links={learnLinks} />
        </div>
      )}
    </div>
  );
}
