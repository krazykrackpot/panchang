"use client";

import { useState, useMemo, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Star, ArrowLeft, CheckCircle, XCircle, Info } from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";
import RelatedLinks from "@/components/ui/RelatedLinks";
import { getLearnLinksForTool } from "@/lib/seo/cross-links";
import { Link } from "@/lib/i18n/navigation";
import { useLocationStore } from "@/stores/location-store";
import { computePanchang } from "@/lib/ephem/panchang-calc";
import { getUTCOffsetForDate } from "@/lib/utils/timezone";
import { NAKSHATRAS } from "@/lib/constants/nakshatras";
import { NakshatraIconById } from "@/components/icons/NakshatraIcons";
import {
  computeTarabalamGrid,
  TARA_NAMES,
  FAVORABLE_TARAS,
} from "@/lib/panchang/balam";
import { tl } from "@/lib/utils/trilingual";
import { safeJsonLd } from "@/lib/seo/safe-jsonld";
import { generateBreadcrumbLD } from "@/lib/seo/structured-data";
import { isDevanagariLocale } from "@/lib/utils/locale-fonts";
import type { Locale } from "@/lib/i18n/config";

const TARA_COLORS: Record<number, string> = {
  1: "#ef4444", // Janma - red
  2: "#22c55e", // Sampat - green
  3: "#ef4444", // Vipat - red
  4: "#22c55e", // Kshema - green
  5: "#ef4444", // Pratyari - red
  6: "#22c55e", // Sadhana - green
  7: "#ef4444", // Vadha - red
  8: "#22c55e", // Mitra - green
  9: "#22c55e", // Parama Mitra - green
};

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: "Panchang",
    title: "Tarabalam Today",
    subtitle:
      "Star strength for all 27 nakshatras based on today's Moon nakshatra. Find your birth nakshatra to see if today's tara is favorable.",
    moonNakshatra: "Moon Nakshatra",
    favorable: "Favorable",
    unfavorable: "Unfavorable",
    tara: "Tara",
    yourNakshatra: "Your Birth Nakshatra",
    status: "Status",
    noLocation: "Set your location to calculate today's Moon nakshatra",
    whatIs: "What is Tarabalam?",
    whatIsText:
      'Tarabalam (Star Strength) evaluates the relationship between today\'s Moon nakshatra and your birth nakshatra. The 27 nakshatras are grouped into 9 repeating cycles of "taras" (stars). Each tara has a distinct quality  –  some bring prosperity and success, others signal obstacles. The formula is: Tara = ((Transit Nakshatra - Birth Nakshatra + 27) mod 9), yielding values 1-9.',
    howToUse: "How to Use",
    howToUseText:
      "Find your birth nakshatra in the table below. Favorable taras (Sampat, Kshema, Sadhana, Mitra, Parama Mitra) indicate a good day for important activities. Unfavorable taras (Janma, Vipat, Pratyari, Vadha) suggest caution. For best results, combine Tarabalam with Chandrabalam  –  both favorable means an excellent day for major decisions.",
    favorableCount: "favorable",
    unfavorableCount: "unfavorable",
    loading: "Computing Moon nakshatra...",
    nineStars: "The 9 Taras",
    groupFavorable: "Favorable Nakshatras",
    groupUnfavorable: "Unfavorable Nakshatras",
  },
  hi: {
    back: "पंचांग",
    title: "आज का ताराबल",
    subtitle:
      "आज के चन्द्र नक्षत्र पर आधारित सभी 27 नक्षत्रों के लिए ताराबल। अपना जन्म नक्षत्र खोजें और जानें आज की तारा अनुकूल है या नहीं।",
    moonNakshatra: "चन्द्र नक्षत्र",
    favorable: "अनुकूल",
    unfavorable: "प्रतिकूल",
    tara: "तारा",
    yourNakshatra: "आपका जन्म नक्षत्र",
    status: "स्थिति",
    noLocation: "आज के चन्द्र नक्षत्र की गणना के लिए अपना स्थान सेट करें",
    whatIs: "ताराबल क्या है?",
    whatIsText:
      'ताराबल आज के चन्द्र नक्षत्र और आपके जन्म नक्षत्र के सम्बन्ध का मूल्यांकन करता है। 27 नक्षत्रों को 9 "तारा" के चक्रों में विभाजित किया जाता है। प्रत्येक तारा का एक विशिष्ट गुण है  –  कुछ समृद्धि और सफलता लाते हैं, अन्य बाधाओं का संकेत देते हैं।',
    howToUse: "कैसे उपयोग करें",
    howToUseText:
      "नीचे की तालिका में अपना जन्म नक्षत्र खोजें। अनुकूल तारा (सम्पत्, क्षेम, साधन, मित्र, परम मित्र) महत्वपूर्ण कार्यों के लिए शुभ दिन दर्शाते हैं। प्रतिकूल तारा (जन्म, विपत्, प्रत्यरि, वध) सावधानी का संकेत देते हैं। सर्वोत्तम परिणामों के लिए ताराबल को चन्द्रबल के साथ मिलाकर देखें।",
    favorableCount: "अनुकूल",
    unfavorableCount: "प्रतिकूल",
    loading: "चन्द्र नक्षत्र की गणना हो रही है...",
    nineStars: "9 तारा",
    groupFavorable: "अनुकूल नक्षत्र",
    groupUnfavorable: "प्रतिकूल नक्षत्र",
  },
  mai: {
    back: "पंचांग",
    title: "आजुक ताराबल",
    subtitle:
      "आजुक चन्द्र नक्षत्रक आधार पर सभ २७ नक्षत्रक लेल ताराक शक्ति। अहांक जन्म नक्षत्र पता करू जे देखू जे आजुक तारा अनुकूल अछि की नहि।",
    moonNakshatra: "चन्द्र नक्षत्र",
    favorable: "अनुकूल",
    unfavorable: "प्रतिकूल",
    tara: "तारा",
    yourNakshatra: "अहांक जन्म नक्षत्र",
    status: "स्थिति",
    noLocation: "आजुक चन्द्र नक्षत्रक गणना करबाक लेल अपन स्थान निर्धारित करू",
    whatIs: "ताराबल की अछि?",
    whatIsText:
      "ताराबल (तारा शक्ति) आजुक चन्द्र नक्षत्र आ अहांक जन्म नक्षत्रक बीचक संबंधक मूल्यांकन करैत अछि। २७ नक्षत्र सभ 'तारा' (सितारा) क ९टा दोहराओल चक्र मे समूहित अछि। प्रत्येक ताराक एकटा विशिष्ट गुण होइत अछि – किछु समृद्धि आ सफलता लबैत अछि, आन बाधाक संकेत दैत अछि। सूत्र अछि: तारा = ((गोचर नक्षत्र - जन्म नक्षत्र + २७) mod ९), जाहि सं १-९ धरि मान प्राप्त होइत अछि।",
    howToUse: "कनाय उपयोग करी?",
    howToUseText:
      "नीचा देल गेल सारणी मे अहांक जन्म नक्षत्र पता करू। अनुकूल तारा (संपत, क्षेम, साधना, मित्र, परम मित्र) महत्वपूर्ण गतिविधिसभक लेल नीक दिनक संकेत दैत अछि। प्रतिकूल तारा (जन्म, विपत, प्रत्यरि, वध) सावधानीक सुझाव दैत अछि। सर्वोत्तम परिणामक लेल, ताराबल केँ चंद्रबलक संग मिलाउ – दुनू अनुकूलक अर्थ महत्वपूर्ण निर्णयक लेल एकटा उत्कृष्ट दिन होइत अछि।",
    favorableCount: "अनुकूल",
    unfavorableCount: "प्रतिकूल",
    loading: "चन्द्र नक्षत्रक गणना भऽ रहल अछि...",
    nineStars: "९ तारा",
    groupFavorable: "अनुकूल नक्षत्र",
    groupUnfavorable: "प्रतिकूल नक्षत्र",
  },
  mr: {
    back: "पंचांग",
    title: "आजचे ताराबल",
    subtitle:
      "आजच्या चंद्र नक्षत्रावर आधारित सर्व २७ नक्षत्रांसाठी ताऱ्याची शक्ती. आजचा तारा अनुकूल आहे की नाही हे पाहण्यासाठी तुमचे जन्म नक्षत्र शोधा.",
    moonNakshatra: "चंद्र नक्षत्र",
    favorable: "अनुकूल",
    unfavorable: "प्रतिकूल",
    tara: "तारा",
    yourNakshatra: "तुमचे जन्म नक्षत्र",
    status: "स्थिती",
    noLocation: "आजच्या चंद्र नक्षत्राची गणना करण्यासाठी तुमचे स्थान सेट करा",
    whatIs: "ताराबल म्हणजे काय?",
    whatIsText:
      "ताराबल (तारा शक्ती) आजच्या चंद्र नक्षत्राचे आणि तुमच्या जन्म नक्षत्राचे नातेसंबंधाचे मूल्यांकन करते. २७ नक्षत्रे 'तारा' (तारे) च्या ९ पुनरावृत्ती चक्रांमध्ये गटबद्ध केली आहेत. प्रत्येक ताऱ्याची एक विशिष्ट गुणवत्ता असते – काही समृद्धी आणि यश देतात, तर काही अडथळ्यांचे संकेत देतात. सूत्र आहे: तारा = ((गोचर नक्षत्र - जन्म नक्षत्र + २७) mod ९), ज्यातून १-९ पर्यंत मूल्ये मिळतात.",
    howToUse: "कसे वापरावे",
    howToUseText:
      "खालील सारणीमध्ये तुमचे जन्म नक्षत्र शोधा. अनुकूल तारा (संपत, क्षेम, साधना, मित्र, परम मित्र) महत्त्वाच्या कार्यांसाठी चांगला दिवस दर्शवतात. प्रतिकूल तारा (जन्म, विपत, प्रत्यरि, वध) सावधगिरी सुचवतात. सर्वोत्तम परिणामांसाठी, ताराबल आणि चंद्रबल एकत्र करा – दोन्ही अनुकूल असल्यास महत्त्वाच्या निर्णयांसाठी उत्कृष्ट दिवस असतो.",
    favorableCount: "अनुकूल",
    unfavorableCount: "प्रतिकूल",
    loading: "चंद्र नक्षत्राची गणना करत आहे...",
    nineStars: "९ तारे",
    groupFavorable: "अनुकूल नक्षत्रे",
    groupUnfavorable: "प्रतिकूल नक्षत्रे",
  },
  ta: {
    back: "பஞ்சாங்கம்",
    title: "இன்றைய தாராபலம்",
    subtitle:
      "இன்றைய சந்திர நட்சத்திரத்தின் அடிப்படையில் 27 நட்சத்திரங்களுக்கும் உள்ள நட்சத்திர பலம். இன்றைய தாரா உங்களுக்கு சாதகமானதா என்பதை அறிய உங்கள் ஜென்ம நட்சத்திரத்தைக் கண்டறியவும்.",
    moonNakshatra: "சந்திர நட்சத்திரம்",
    favorable: "சாதகமானது",
    unfavorable: "சாதகமற்றது",
    tara: "தாரா",
    yourNakshatra: "உங்கள் ஜென்ம நட்சத்திரம்",
    status: "நிலை",
    noLocation:
      "இன்றைய சந்திர நட்சத்திரத்தைக் கணக்கிட உங்கள் இருப்பிடத்தை அமைக்கவும்",
    whatIs: "தாராபலம் என்றால் என்ன?",
    whatIsText:
      "தாராபலம் (நட்சத்திர பலம்) இன்றைய சந்திர நட்சத்திரத்திற்கும் உங்கள் ஜென்ம நட்சத்திரத்திற்கும் இடையிலான உறவை மதிப்பிடுகிறது. 27 நட்சத்திரங்கள் 9 மீண்டும் மீண்டும் வரும் 'தாரா' (நட்சத்திரங்கள்) சுழற்சிகளாக தொகுக்கப்பட்டுள்ளன. ஒவ்வொரு தாராவிற்கும் ஒரு தனித்துவமான குணம் உண்டு – சில செழிப்பையும் வெற்றியையும் தருகின்றன, மற்றவை தடைகளை சுட்டிக்காட்டுகின்றன. சூத்திரம்: தாரா = ((கோச்சார நட்சத்திரம் - ஜென்ம நட்சத்திரம் + 27) mod 9), இது 1-9 வரையிலான மதிப்புகளை அளிக்கிறது.",
    howToUse: "எப்படி பயன்படுத்துவது",
    howToUseText:
      "கீழே உள்ள அட்டவணையில் உங்கள் ஜென்ம நட்சத்திரத்தைக் கண்டறியவும். சாதகமான தாராக்கள் (சம்பத், க்ஷேம, சாதனா, மித்ரா, பரம மித்ரா) முக்கியமான நடவடிக்கைகளுக்கு ஒரு நல்ல நாளைக் குறிக்கின்றன. சாதகமற்ற தாராக்கள் (ஜன்ம, விபத், பிரத்யாரி, வதா) எச்சரிக்கையை பரிந்துரைக்கின்றன. சிறந்த முடிவுகளுக்கு, தாராபலத்தை சந்திரபலத்துடன் இணைக்கவும் – இரண்டும் சாதகமாக இருந்தால் முக்கிய முடிவுகளுக்கு ஒரு சிறந்த நாள் என்று பொருள்.",
    favorableCount: "சாதகமானது",
    unfavorableCount: "சாதகமற்றது",
    loading: "சந்திர நட்சத்திரம் கணக்கிடப்படுகிறது...",
    nineStars: "9 தாராக்கள்",
    groupFavorable: "சாதகமான நட்சத்திரங்கள்",
    groupUnfavorable: "சாதகமற்ற நட்சத்திரங்கள்",
  },
  te: {
    back: "పంచాంగం",
    title: "నేటి తారాబలం",
    subtitle:
      "నేటి చంద్ర నక్షత్రం ఆధారంగా 27 నక్షత్రాలకు నక్షత్ర బలం. నేటి తార మీకు అనుకూలమా కాదా అని చూడటానికి మీ జన్మ నక్షత్రాన్ని కనుగొనండి.",
    moonNakshatra: "చంద్ర నక్షత్రం",
    favorable: "అనుకూలమైనది",
    unfavorable: "అనుకూలత లేనిది",
    tara: "తార",
    yourNakshatra: "మీ జన్మ నక్షత్రం",
    status: "స్థితి",
    noLocation:
      "నేటి చంద్ర నక్షత్రాన్ని లెక్కించడానికి మీ స్థానాన్ని సెట్ చేయండి",
    whatIs: "తారాబలం అంటే ఏమిటి?",
    whatIsText:
      "తారాబలం (నక్షత్ర బలం) నేటి చంద్ర నక్షత్రం మరియు మీ జన్మ నక్షత్రం మధ్య సంబంధాన్ని అంచనా వేస్తుంది. 27 నక్షత్రాలు 'తారల' (నక్షత్రాలు) 9 పునరావృత చక్రాలుగా వర్గీకరించబడ్డాయి. ప్రతి తారకు ఒక ప్రత్యేకమైన నాణ్యత ఉంటుంది – కొన్ని శ్రేయస్సు మరియు విజయాన్ని తెస్తాయి, మరికొన్ని అడ్డంకులను సూచిస్తాయి. సూత్రం: తార = ((గోచార నక్షత్రం - జన్మ నక్షత్రం + 27) mod 9), ఇది 1-9 విలువలను ఇస్తుంది.",
    howToUse: "ఎలా ఉపయోగించాలి",
    howToUseText:
      "దిగువ పట్టికలో మీ జన్మ నక్షత్రాన్ని కనుగొనండి. అనుకూలమైన తారలు (సంపత్, క్షేమ, సాధన, మిత్ర, పరమ మిత్ర) ముఖ్యమైన కార్యకలాపాలకు మంచి రోజును సూచిస్తాయి. అనుకూలత లేని తారలు (జన్మ, విపత్, ప్రత్యరి, వధ) జాగ్రత్త వహించమని సూచిస్తాయి. ఉత్తమ ఫలితాల కోసం, తారాబలాన్ని చంద్రబలంతో కలపండి – రెండూ అనుకూలంగా ఉంటే ముఖ్యమైన నిర్ణయాలకు అద్భుతమైన రోజు అని అర్థం.",
    favorableCount: "అనుకూలమైనది",
    unfavorableCount: "అనుకూలత లేనిది",
    loading: "చంద్ర నక్షత్రాన్ని లెక్కిస్తోంది...",
    nineStars: "9 తారలు",
    groupFavorable: "అనుకూలమైన నక్షత్రాలు",
    groupUnfavorable: "అనుకూలత లేని నక్షత్రాలు",
  },
  bn: {
    back: "পঞ্জিকা",
    title: "আজকের তারাবালম",
    subtitle:
      "আজকের চন্দ্র নক্ষত্রের উপর ভিত্তি করে ২৭টি নক্ষত্রের তারার শক্তি। আজকের তারা অনুকূল কিনা তা দেখতে আপনার জন্ম নক্ষত্র খুঁজুন।",
    moonNakshatra: "চন্দ্র নক্ষত্র",
    favorable: "অনুকূল",
    unfavorable: "প্রতিকূল",
    tara: "তারা",
    yourNakshatra: "আপনার জন্ম নক্ষত্র",
    status: "স্থিতি",
    noLocation: "আজকের চন্দ্র নক্ষত্র গণনা করতে আপনার অবস্থান সেট করুন",
    whatIs: "তারাবালম কী?",
    whatIsText:
      "তারাবালম (তারার শক্তি) আজকের চন্দ্র নক্ষত্র এবং আপনার জন্ম নক্ষত্রের মধ্যে সম্পর্ক মূল্যায়ন করে। ২৭টি নক্ষত্রকে 'তারা' (নক্ষত্র) এর ৯টি পুনরাবৃত্ত চক্রে বিভক্ত করা হয়েছে। প্রতিটি তারার একটি স্বতন্ত্র গুণ রয়েছে – কিছু সমৃদ্ধি এবং সাফল্য নিয়ে আসে, অন্যগুলি বাধা নির্দেশ করে। সূত্রটি হল: তারা = ((গোচর নক্ষত্র - জন্ম নক্ষত্র + ২৭) mod ৯), যার ফলে ১-৯ পর্যন্ত মান পাওয়া যায়।",
    howToUse: "কীভাবে ব্যবহার করবেন",
    howToUseText:
      "নীচের সারণীতে আপনার জন্ম নক্ষত্র খুঁজুন। অনুকূল তারা (সম্পত, ক্ষেম, সাধনা, মিত্র, পরম মিত্র) গুরুত্বপূর্ণ কার্যকলাপের জন্য একটি ভালো দিন নির্দেশ করে। প্রতিকূল তারা (জন্ম, বিপত, প্রত্যরি, বধ) সতর্কতার পরামর্শ দেয়। সেরা ফলাফলের জন্য, তারাবালমকে চন্দ্রবালমের সাথে একত্রিত করুন – উভয়ই অনুকূল হলে গুরুত্বপূর্ণ সিদ্ধান্তের জন্য একটি চমৎকার দিন বোঝায়।",
    favorableCount: "অনুকূল",
    unfavorableCount: "প্রতিকূল",
    loading: "চন্দ্র নক্ষত্র গণনা করা হচ্ছে...",
    nineStars: "৯টি তারা",
    groupFavorable: "অনুকূল নক্ষত্র",
    groupUnfavorable: "প্রতিকূল নক্ষত্র",
  },
  gu: {
    back: "પંચાંગ",
    title: "આજનું તારાબલ",
    subtitle:
      "આજના ચંદ્ર નક્ષત્રના આધારે તમામ ૨૭ નક્ષત્રો માટે તારાની શક્તિ. આજની તારા અનુકૂળ છે કે નહીં તે જોવા માટે તમારું જન્મ નક્ષત્ર શોધો.",
    moonNakshatra: "ચંદ્ર નક્ષત્ર",
    favorable: "અનુકૂળ",
    unfavorable: "પ્રતિકૂળ",
    tara: "તારા",
    yourNakshatra: "તમારું જન્મ નક્ષત્ર",
    status: "સ્થિતિ",
    noLocation: "આજના ચંદ્ર નક્ષત્રની ગણતરી કરવા માટે તમારું સ્થાન સેટ કરો",
    whatIs: "તારાબલ શું છે?",
    whatIsText:
      "તારાબલ (તારા શક્તિ) આજના ચંદ્ર નક્ષત્ર અને તમારા જન્મ નક્ષત્ર વચ્ચેના સંબંધનું મૂલ્યાંકન કરે છે. ૨૭ નક્ષત્રોને 'તારા' (તારાઓ) ના ૯ પુનરાવર્તિત ચક્રમાં જૂથબદ્ધ કરવામાં આવ્યા છે. દરેક તારાની એક વિશિષ્ટ ગુણવત્તા હોય છે – કેટલાક સમૃદ્ધિ અને સફળતા લાવે છે, અન્ય અવરોધોનો સંકેત આપે છે. સૂત્ર છે: તારા = ((ગોચર નક્ષત્ર - જન્મ નક્ષત્ર + ૨૭) mod ૯), જે ૧-૯ સુધીના મૂલ્યો આપે છે.",
    howToUse: "કેવી રીતે ઉપયોગ કરવો",
    howToUseText:
      "નીચેના કોષ્ટકમાં તમારું જન્મ નક્ષત્ર શોધો. અનુકૂળ તારાઓ (સંપત, ક્ષેમ, સાધના, મિત્ર, પરમ મિત્ર) મહત્વપૂર્ણ પ્રવૃત્તિઓ માટે સારો દિવસ સૂચવે છે. પ્રતિકૂળ તારાઓ (જન્મ, વિપત, પ્રત્યારી, વધ) સાવચેતી સૂચવે છે. શ્રેષ્ઠ પરિણામો માટે, તારાબલને ચંદ્રબલ સાથે જોડો – બંને અનુકૂળ હોય તો મહત્વપૂર્ણ નિર્ણયો માટે ઉત્તમ દિવસનો અર્થ થાય છે.",
    favorableCount: "અનુકૂળ",
    unfavorableCount: "પ્રતિકૂળ",
    loading: "ચંદ્ર નક્ષત્રની ગણતરી થઈ રહી છે...",
    nineStars: "૯ તારાઓ",
    groupFavorable: "અનુકૂળ નક્ષત્રો",
    groupUnfavorable: "પ્રતિકૂળ નક્ષત્રો",
  },
  kn: {
    back: "ಪಂಚಾಂಗ",
    title: "ಇಂದಿನ ತಾರಾಬಲ",
    subtitle:
      "ಇಂದಿನ ಚಂದ್ರ ನಕ್ಷತ್ರವನ್ನು ಆಧರಿಸಿ ಎಲ್ಲಾ 27 ನಕ್ಷತ್ರಗಳ ತಾರಾ ಶಕ್ತಿ. ಇಂದಿನ ತಾರಾ ನಿಮಗೆ ಅನುಕೂಲಕರವಾಗಿದೆಯೇ ಎಂದು ನೋಡಲು ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರವನ್ನು ಹುಡುಕಿ.",
    moonNakshatra: "ಚಂದ್ರ ನಕ್ಷತ್ರ",
    favorable: "ಅನುಕೂಲಕರ",
    unfavorable: "ಅನಾನುಕೂಲಕರ",
    tara: "ತಾರಾ",
    yourNakshatra: "ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರ",
    status: "ಸ್ಥಿತಿ",
    noLocation:
      "ಇಂದಿನ ಚಂದ್ರ ನಕ್ಷತ್ರವನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡಲು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹೊಂದಿಸಿ",
    whatIs: "ತಾರಾಬಲ ಎಂದರೇನು?",
    whatIsText:
      "ತಾರಾಬಲ (ತಾರಾ ಶಕ್ತಿ) ಇಂದಿನ ಚಂದ್ರ ನಕ್ಷತ್ರ ಮತ್ತು ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರದ ನಡುವಿನ ಸಂಬಂಧವನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ. 27 ನಕ್ಷತ್ರಗಳನ್ನು 'ತಾರಾ' (ನಕ್ಷತ್ರಗಳು) ದ 9 ಪುನರಾವರ್ತಿತ ಚಕ್ರಗಳಾಗಿ ವರ್ಗೀಕರಿಸಲಾಗಿದೆ. ಪ್ರತಿ ತಾರಾವು ವಿಶಿಷ್ಟ ಗುಣಮಟ್ಟವನ್ನು ಹೊಂದಿದೆ – ಕೆಲವು ಸಮೃದ್ಧಿ ಮತ್ತು ಯಶಸ್ಸನ್ನು ತರುತ್ತವೆ, ಇತರವು ಅಡೆತಡೆಗಳನ್ನು ಸೂಚಿಸುತ್ತವೆ. ಸೂತ್ರ ಹೀಗಿದೆ: ತಾರಾ = ((ಗೋಚಾರ ನಕ್ಷತ್ರ - ಜನ್ಮ ನಕ್ಷತ್ರ + 27) mod 9), ಇದು 1-9 ಮೌಲ್ಯಗಳನ್ನು ನೀಡುತ್ತದೆ.",
    howToUse: "ಹೇಗೆ ಬಳಸುವುದು",
    howToUseText:
      "ಕೆಳಗಿನ ಕೋಷ್ಟಕದಲ್ಲಿ ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರವನ್ನು ಹುಡುಕಿ. ಅನುಕೂಲಕರ ತಾರಾಗಳು (ಸಂಪತ್, ಕ್ಷೇಮ, ಸಾಧನಾ, ಮಿತ್ರ, ಪರಮ ಮಿತ್ರ) ಪ್ರಮುಖ ಚಟುವಟಿಕೆಗಳಿಗೆ ಉತ್ತಮ ದಿನವನ್ನು ಸೂಚಿಸುತ್ತವೆ. ಅನಾನುಕೂಲಕರ ತಾರಾಗಳು (ಜನ್ಮ, ವಿಪತ್, ಪ್ರತ್ಯಾರಿ, ವಧಾ) ಎಚ್ಚರಿಕೆಯನ್ನು ಸೂಚಿಸುತ್ತವೆ. ಉತ್ತಮ ಫಲಿತಾಂಶಗಳಿಗಾಗಿ, ತಾರಾಬಲವನ್ನು ಚಂದ್ರಬಲದೊಂದಿಗೆ ಸಂಯೋಜಿಸಿ – ಎರಡೂ ಅನುಕೂಲಕರವಾಗಿದ್ದರೆ ಪ್ರಮುಖ ನಿರ್ಧಾರಗಳಿಗೆ ಅತ್ಯುತ್ತಮ ದಿನ ಎಂದರ್ಥ.",
    favorableCount: "ಅನುಕೂಲಕರ",
    unfavorableCount: "ಅನಾನುಕೂಲಕರ",
    loading: "ಚಂದ್ರ ನಕ್ಷತ್ರವನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    nineStars: "9 ತಾರಾಗಳು",
    groupFavorable: "ಅನುಕೂಲಕರ ನಕ್ಷತ್ರಗಳು",
    groupUnfavorable: "ಅನಾನುಕೂಲಕರ ನಕ್ಷತ್ರಗಳು",
  },
};

export default function TarabalamPage() {
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
  const [moonNakshatra, setMoonNakshatra] = useState<number | null>(null);
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
      setMoonNakshatra(panchang.nakshatra.id);
    } catch (err) {
      console.error("[tarabalam] Failed to compute panchang:", err);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, ianaTimezone, locationName]);

  const grid = useMemo(
    () => (moonNakshatra ? computeTarabalamGrid(moonNakshatra) : []),
    [moonNakshatra],
  );
  const favEntries = grid.filter((g) => g.favorable);
  const unfavEntries = grid.filter((g) => !g.favorable);

  const moonNakData = moonNakshatra ? NAKSHATRAS[moonNakshatra - 1] : null;

  const learnLinks = getLearnLinksForTool("/tarabalam");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(generateBreadcrumbLD("/tarabalam", locale)),
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
      ) : !moonNakshatra ? (
        <div className="text-center py-20">
          <Star className="w-16 h-16 text-gold-primary/30 mx-auto mb-4" />
          <p className="text-text-secondary mb-4">{L.noLocation}</p>
        </div>
      ) : (
        <>
          {/* Current Moon Nakshatra badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 mb-10"
          >
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 px-8 py-5 flex items-center gap-4">
              <NakshatraIconById id={moonNakshatra} size={56} />
              <div>
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">
                  {L.moonNakshatra}
                </div>
                <div
                  className="text-gold-light font-bold text-2xl"
                  style={headingFont}
                >
                  {tl(moonNakData?.name || { en: "" }, locale)}
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-4 h-4" /> {favEntries.length}{" "}
                {L.favorableCount}
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <XCircle className="w-4 h-4" /> {unfavEntries.length}{" "}
                {L.unfavorableCount}
              </span>
            </div>
          </motion.div>

          <GoldDivider />

          {/* 9 Taras legend */}
          <div className="my-8">
            <h2
              className="text-lg font-bold text-gold-gradient mb-4 text-center"
              style={headingFont}
            >
              {L.nineStars}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {TARA_NAMES.map((tara, i) => {
                const num = i + 1;
                const isFav = FAVORABLE_TARAS.has(num);
                return (
                  <div
                    key={num}
                    className={`rounded-lg border p-2 text-center ${isFav ? "border-emerald-500/25 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}
                  >
                    <div className="text-xs text-text-secondary">{num}</div>
                    <div
                      className={`text-xs font-bold ${isFav ? "text-emerald-400" : "text-red-400"}`}
                      style={
                        isDevanagari
                          ? { fontFamily: "var(--font-devanagari-body)" }
                          : undefined
                      }
                    >
                      {tl(tara, locale)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <GoldDivider />

          {/* Grouped view: Favorable / Unfavorable */}
          {[
            {
              label: L.groupFavorable,
              entries: favEntries,
              color: "emerald" as const,
            },
            {
              label: L.groupUnfavorable,
              entries: unfavEntries,
              color: "red" as const,
            },
          ].map((group) => (
            <div key={group.label} className="my-8">
              <h3
                className={`text-sm font-bold uppercase tracking-widest mb-4 ${group.color === "emerald" ? "text-emerald-400" : "text-red-400"}`}
              >
                {group.color === "emerald" ? (
                  <CheckCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                )}
                {group.label} ({group.entries.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {group.entries.map((entry, i) => {
                  const nak = NAKSHATRAS[entry.nakshatraId - 1];
                  const taraColor = TARA_COLORS[entry.tara] || "#888";
                  return (
                    <motion.div
                      key={entry.nakshatraId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border p-3 flex items-center gap-3 ${
                        group.color === "emerald"
                          ? "border-emerald-500/15"
                          : "border-red-500/12"
                      }`}
                    >
                      <NakshatraIconById id={entry.nakshatraId} size={32} />
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-gold-light text-sm font-bold truncate"
                          style={
                            isDevanagari
                              ? { fontFamily: "var(--font-devanagari-body)" }
                              : undefined
                          }
                        >
                          {tl(nak.name, locale)}
                        </div>
                        <div className="text-text-secondary text-xs">
                          {entry.nakshatraId}. {nak.ruler}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div
                          className="text-xs font-bold"
                          style={{ color: taraColor }}
                        >
                          {tl(entry.taraName, locale)}
                        </div>
                        <div className="text-text-secondary text-[10px]">
                          {L.tara} {entry.tara}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

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
