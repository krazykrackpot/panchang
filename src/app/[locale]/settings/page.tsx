'use client';

import { tl } from '@/lib/utils/trilingual';
import SM from '@/messages/pages/settings.json';
import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, MapPin, Calendar, Clock, Save, Trash2, LogOut, Loader2, Bell, Sparkles } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import PushPermission from '@/components/notifications/PushPermission';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { usePersonaMode } from '@/lib/persona/context';
import { dbToPersonaMode, personaModeToDb, type PersonaMode } from '@/lib/persona/types';

interface ProfileData {
  display_name: string;
  date_of_birth: string;
  time_of_birth: string;
  birth_time_known: boolean;
  birth_place: string;
  birth_lat: number | null;
  birth_lng: number | null;
  birth_timezone: string;
  default_location: string;
  ayanamsha: string;
  chart_style: string;
  node_type: 'mean' | 'true';
}

const NOTIF_TYPES = [
  { key: 'dasha_transition', en: 'Dasha Transitions', hi: 'दशा परिवर्तन' },
  { key: 'transit_alert',   en: 'Planetary Transits', hi: 'ग्रह गोचर' },
  { key: 'festival_reminder', en: 'Festival Reminders', hi: 'पर्व स्मरण' },
  { key: 'sade_sati',       en: 'Sade Sati Alerts', hi: 'साढ़े साती सूचना' },
  { key: 'weekly_digest',   en: 'Weekly Email Digest', hi: 'साप्ताहिक सारांश ईमेल' },
  { key: 'daily_panchang', en: 'Daily Panchang Email (Sunrise)', hi: 'दैनिक पंचांग ईमेल (सूर्योदय)' },
] as const;

const LABELS = {
  en: {
    title: 'Profile & Settings',
    backHome: 'Back to Home',
    accountInfo: 'Account Information',
    email: 'Email',
    signInMethod: 'Sign-in Method',
    memberSince: 'Member Since',
    personalDetails: 'Personal Details',
    fullName: 'Full Name',
    dateOfBirth: 'Date of Birth',
    timeOfBirth: 'Time of Birth',
    unknownTime: "I don't know my birth time",
    placeOfBirth: 'Place of Birth',
    preferences: 'Preferences',
    ayanamsha: 'Ayanamsha',
    chartStyle: 'Chart Style',
    northIndian: 'North Indian',
    southIndian: 'South Indian',
    nodeType: 'Node Type (Rahu/Ketu)',
    meanNode: 'Mean Node',
    trueNode: 'True Node',
    meanNodeDesc: 'Mean node  –  smooth average path (most traditional systems)',
    trueNodeDesc: 'True node  –  includes nutation oscillation (±1.5°, preferred by some modern astrologers)',
    language: 'Language',
    displayMode: 'Display Mode',
    displayModeHelp: 'How Dekho Panchang presents information. Change anytime — the choice applies sitewide.',
    modeBeginner: 'Beginner',
    modeBeginnerDesc: 'Friendly summaries, no jargon',
    modeEnthusiast: 'Enthusiast',
    modeEnthusiastDesc: 'Depth and narrative',
    modeAcharya: 'Acharya',
    modeAcharyaDesc: 'Classical mode, technical defaults',
    modeUpdated: 'Display mode updated',
    modeUpdateFailed: 'Could not save display mode to your profile. Your local choice is still active.',
    notifications: 'Notification Preferences',
    notifDesc: 'Choose which alerts you receive in the app and by email.',
    dangerZone: 'Danger Zone',
    signOut: 'Sign Out',
    deleteAccount: 'Delete Account',
    deleteConfirmTitle: 'Delete Account?',
    deleteConfirmMsg: 'Are you sure? This will delete all your data permanently. This action cannot be undone.',
    deleteConfirmBtn: 'Yes, Delete Everything',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    saved: 'Changes saved successfully',
    notSignedIn: 'You must be signed in to access settings.',
    signIn: 'Sign In',
  },
  hi: {
    title: 'प्रोफ़ाइल और सेटिंग्स',
    backHome: 'मुख्य पृष्ठ पर वापस',
    accountInfo: 'खाता जानकारी',
    email: 'ईमेल',
    signInMethod: 'साइन-इन विधि',
    memberSince: 'सदस्य बने',
    personalDetails: 'व्यक्तिगत विवरण',
    fullName: 'पूरा नाम',
    dateOfBirth: 'जन्म तिथि',
    timeOfBirth: 'जन्म समय',
    unknownTime: 'मुझे अपना जन्म समय नहीं पता',
    placeOfBirth: 'जन्म स्थान',
    preferences: 'प्राथमिकताएँ',
    ayanamsha: 'अयनांश',
    chartStyle: 'चार्ट शैली',
    northIndian: 'उत्तर भारतीय',
    southIndian: 'दक्षिण भारतीय',
    nodeType: 'नोड प्रकार (राहु/केतु)',
    meanNode: 'मध्य नोड',
    trueNode: 'वास्तविक नोड',
    meanNodeDesc: 'मध्य नोड  –  सम औसत पथ (अधिकांश पारंपरिक पद्धतियाँ)',
    trueNodeDesc: 'वास्तविक नोड  –  अयन दोलन सहित (±1.5°, कुछ आधुनिक ज्योतिषी पसंद करते हैं)',
    language: 'भाषा',
    displayMode: 'प्रदर्शन मोड',
    displayModeHelp: 'देखो पंचांग जानकारी कैसे प्रस्तुत करता है। कभी भी बदलें — यह चुनाव पूरी साइट पर लागू होता है।',
    modeBeginner: 'शुरुआती',
    modeBeginnerDesc: 'सरल सारांश, कोई तकनीकी शब्द नहीं',
    modeEnthusiast: 'जिज्ञासु',
    modeEnthusiastDesc: 'गहराई और विवरण',
    modeAcharya: 'आचार्य',
    modeAcharyaDesc: 'शास्त्रीय मोड, तकनीकी डिफ़ॉल्ट',
    modeUpdated: 'प्रदर्शन मोड अपडेट किया गया',
    modeUpdateFailed: 'प्रदर्शन मोड आपकी प्रोफ़ाइल में सहेजा नहीं जा सका। आपका स्थानीय चयन अभी भी सक्रिय है।',
    notifications: 'सूचना प्राथमिकताएँ',
    notifDesc: 'चुनें कि आप ऐप और ईमेल में कौन-से अलर्ट प्राप्त करना चाहते हैं।',
    dangerZone: 'खतरा क्षेत्र',
    signOut: 'साइन आउट',
    deleteAccount: 'खाता हटाएँ',
    deleteConfirmTitle: 'खाता हटाएँ?',
    deleteConfirmMsg: 'क्या आप सुनिश्चित हैं? यह आपका सारा डेटा स्थायी रूप से हटा देगा। यह क्रिया पूर्ववत नहीं की जा सकती।',
    deleteConfirmBtn: 'हाँ, सब कुछ हटाएँ',
    cancel: 'रद्द करें',
    saveChanges: 'बदलाव सहेजें',
    saving: 'सहेज रहे हैं...',
    saved: 'बदलाव सफलतापूर्वक सहेजे गए',
    notSignedIn: 'सेटिंग्स तक पहुँचने के लिए साइन इन करें।',
    signIn: 'साइन इन',
  },
  sa: {
    title: 'प्रोफ़ाइल तथा सेटिंग्स',
    backHome: 'मुख्यपृष्ठं प्रति',
    accountInfo: 'खातविवरणम्',
    email: 'ईमेल',
    signInMethod: 'प्रवेशविधिः',
    memberSince: 'सदस्यत्वम्',
    personalDetails: 'वैयक्तिकविवरणम्',
    fullName: 'पूर्णनाम',
    dateOfBirth: 'जन्मतिथिः',
    timeOfBirth: 'जन्मसमयः',
    unknownTime: 'जन्मसमयः अज्ञातः',
    placeOfBirth: 'जन्मस्थानम्',
    preferences: 'प्राथमिकताः',
    ayanamsha: 'अयनांशः',
    chartStyle: 'चार्टशैली',
    northIndian: 'उत्तरभारतीय',
    southIndian: 'दक्षिणभारतीय',
    nodeType: 'पातप्रकारः (राहु/केतु)',
    meanNode: 'मध्यपातः',
    trueNode: 'स्फुटपातः',
    meanNodeDesc: 'मध्यपातः  –  समसरणपथः (बहुपारम्परिकपद्धतयः)',
    trueNodeDesc: 'स्फुटपातः  –  अयनचलनसहितः (±1.5°, केचन आधुनिकज्योतिषिणः पसन्दयन्ति)',
    language: 'भाषा',
    displayMode: 'प्रदर्शन-विधा',
    displayModeHelp: 'देखो पंचांग सूचनां कथं प्रदर्शयति। कदापि परिवर्तयतु — एषा चयनं सर्वसाइटे प्रवर्तते।',
    modeBeginner: 'आरम्भकः',
    modeBeginnerDesc: 'सरल-सारांशः, न तकनीकी-शब्दाः',
    modeEnthusiast: 'जिज्ञासुः',
    modeEnthusiastDesc: 'गहनता विस्तरः च',
    modeAcharya: 'आचार्यः',
    modeAcharyaDesc: 'शास्त्रीय-विधा, तकनीकी-प्रामाणिकता',
    modeUpdated: 'प्रदर्शन-विधा परिवर्तिता',
    modeUpdateFailed: 'प्रदर्शन-विधायाः प्रोफाइले संरक्षणं नाभवत्। स्थानीयं चयनं सक्रियम् अस्ति।',
    notifications: 'सूचनाप्राथमिकताः',
    notifDesc: 'ऐप तथा ईमेल-सूचनाः चिनोतु।',
    dangerZone: 'संकटक्षेत्रम्',
    signOut: 'निर्गमनम्',
    deleteAccount: 'खातम् विलोपयतु',
    deleteConfirmTitle: 'खातम् विलोपयतु?',
    deleteConfirmMsg: 'किं निश्चितम्? सर्वं दत्तांशं स्थायिरूपेण विलोपयिष्यति। इयं क्रिया अप्रत्यावर्तनीया।',
    deleteConfirmBtn: 'आम्, सर्वं विलोपयतु',
    cancel: 'रद्दम्',
    saveChanges: 'परिवर्तनानि रक्षतु',
    saving: 'रक्षयति...',
    saved: 'परिवर्तनानि सफलतया रक्षितानि',
    notSignedIn: 'सेटिंग्स प्राप्तुं प्रवेशः आवश्यकः।',
    signIn: 'प्रवेशः',
  },
  ta: {
    title: 'சுயவிவரம் & அமைப்புகள்',
    backHome: 'முகப்புக்குத் திரும்பு',
    accountInfo: 'கணக்கு தகவல்',
    email: 'மின்னஞ்சல்',
    signInMethod: 'உள்நுழைவு முறை',
    memberSince: 'உறுப்பினர் ஆனது',
    personalDetails: 'தனிப்பட்ட விவரங்கள்',
    fullName: 'முழுப் பெயர்',
    dateOfBirth: 'பிறந்த தேதி',
    timeOfBirth: 'பிறந்த நேரம்',
    unknownTime: 'எனக்கு பிறந்த நேரம் தெரியாது',
    placeOfBirth: 'பிறந்த இடம்',
    preferences: 'விருப்பத்தேர்வுகள்',
    ayanamsha: 'அயனாம்சம்',
    chartStyle: 'குண்டலி பாணி',
    northIndian: 'வட இந்திய',
    southIndian: 'தென் இந்திய',
    nodeType: 'நோட் வகை (ராகு/கேது)',
    meanNode: 'சராசரி நோட்',
    trueNode: 'உண்மை நோட்',
    meanNodeDesc: 'சராசரி நோட்  –  மென்மையான சராசரி பாதை (பெரும்பாலான பாரம்பரிய முறைகள்)',
    trueNodeDesc: 'உண்மை நோட்  –  நியூட்டேஷன் அலைவு உள்ளடக்கியது (±1.5°, சில நவீன ஜோதிடர்கள் விரும்புவது)',
    language: 'மொழி',
    displayMode: 'காட்சி முறை',
    displayModeHelp: 'தேக்கோ பஞ்சாங்கம் தகவலை எவ்வாறு வழங்குகிறது. எப்போது வேண்டுமானாலும் மாற்றலாம் — இந்த தேர்வு தளம் முழுவதும் பொருந்தும்.',
    modeBeginner: 'தொடக்கநிலை',
    modeBeginnerDesc: 'நட்பான சுருக்கம், எளிய மொழி',
    modeEnthusiast: 'ஆர்வலர்',
    modeEnthusiastDesc: 'ஆழம் மற்றும் விளக்கம்',
    modeAcharya: 'ஆச்சாரியர்',
    modeAcharyaDesc: 'பாரம்பரிய முறை, தொழில்நுட்ப இயல்புநிலை',
    modeUpdated: 'காட்சி முறை புதுப்பிக்கப்பட்டது',
    modeUpdateFailed: 'காட்சி முறையை உங்கள் சுயவிவரத்தில் சேமிக்க முடியவில்லை. உங்கள் உள்ளூர் தேர்வு இன்னும் செயலில் உள்ளது.',
    notifications: 'அறிவிப்பு விருப்பத்தேர்வுகள்',
    notifDesc: 'செயலி மற்றும் மின்னஞ்சல் மூலம் எந்த எச்சரிக்கைகளைப் பெற விரும்புகிறீர்கள் என்பதைத் தேர்ந்தெடுக்கவும்.',
    dangerZone: 'ஆபத்து மண்டலம்',
    signOut: 'வெளியேறு',
    deleteAccount: 'கணக்கை நீக்கு',
    deleteConfirmTitle: 'கணக்கை நீக்கவா?',
    deleteConfirmMsg: 'உறுதியாக இருக்கிறீர்களா? இது உங்கள் அனைத்து தரவையும் நிரந்தரமாக நீக்கும். இந்தச் செயலை மாற்ற இயலாது.',
    deleteConfirmBtn: 'ஆம், அனைத்தையும் நீக்கு',
    cancel: 'ரத்துசெய்',
    saveChanges: 'மாற்றங்களைச் சேமி',
    saving: 'சேமிக்கிறது...',
    saved: 'மாற்றங்கள் வெற்றிகரமாகச் சேமிக்கப்பட்டன',
    notSignedIn: 'அமைப்புகளை அணுக உள்நுழைய வேண்டும்.',
    signIn: 'உள்நுழை',
  },
  te: {
    title: 'ప్రొఫైల్ & సెట్టింగ్‌లు',
    backHome: 'హోమ్‌కు తిరిగి',
    accountInfo: 'ఖాతా సమాచారం',
    email: 'ఇమెయిల్',
    signInMethod: 'సైన్-ఇన్ పద్ధతి',
    memberSince: 'సభ్యుడైనది',
    personalDetails: 'వ్యక్తిగత వివరాలు',
    fullName: 'పూర్తి పేరు',
    dateOfBirth: 'పుట్టిన తేదీ',
    timeOfBirth: 'పుట్టిన సమయం',
    unknownTime: 'నాకు పుట్టిన సమయం తెలియదు',
    placeOfBirth: 'పుట్టిన ప్రదేశం',
    preferences: 'ప్రాధాన్యతలు',
    ayanamsha: 'అయనాంశ',
    chartStyle: 'చార్ట్ శైలి',
    northIndian: 'ఉత్తర భారతీయ',
    southIndian: 'దక్షిణ భారతీయ',
    nodeType: 'నోడ్ రకం (రాహు/కేతు)',
    meanNode: 'సగటు నోడ్',
    trueNode: 'నిజమైన నోడ్',
    meanNodeDesc: 'సగటు నోడ్  –  సున్నితమైన సగటు మార్గం (చాలా సాంప్రదాయ పద్ధతులు)',
    trueNodeDesc: 'నిజమైన నోడ్  –  న్యూటేషన్ డోలనం కలిగి ఉంటుంది (±1.5°, కొందరు ఆధునిక జ్యోతిషులు ఇష్టపడతారు)',
    language: 'భాష',
    displayMode: 'ప్రదర్శన మోడ్',
    displayModeHelp: 'దేఖో పంచాంగం సమాచారాన్ని ఎలా చూపిస్తుంది. ఎప్పుడైనా మార్చండి — ఈ ఎంపిక సైట్ అంతటా వర్తిస్తుంది.',
    modeBeginner: 'ప్రారంభకుడు',
    modeBeginnerDesc: 'స్నేహపూర్వక సారాంశాలు, సాంకేతిక పదాలు లేవు',
    modeEnthusiast: 'ఔత్సాహికుడు',
    modeEnthusiastDesc: 'లోతు మరియు వివరణ',
    modeAcharya: 'ఆచార్య',
    modeAcharyaDesc: 'శాస్త్రీయ మోడ్, సాంకేతిక డిఫాల్ట్',
    modeUpdated: 'ప్రదర్శన మోడ్ నవీకరించబడింది',
    modeUpdateFailed: 'ప్రదర్శన మోడ్‌ను మీ ప్రొఫైల్‌లో సేవ్ చేయలేకపోయాము. మీ స్థానిక ఎంపిక ఇంకా చురుకుగా ఉంది.',
    notifications: 'నోటిఫికేషన్ ప్రాధాన్యతలు',
    notifDesc: 'యాప్ మరియు ఇమెయిల్ ద్వారా ఏ అలర్ట్‌లను అందుకోవాలో ఎంచుకోండి.',
    dangerZone: 'ప్రమాద ప్రాంతం',
    signOut: 'సైన్ అవుట్',
    deleteAccount: 'ఖాతా తొలగించు',
    deleteConfirmTitle: 'ఖాతా తొలగించాలా?',
    deleteConfirmMsg: 'మీరు నిశ్చయంగా ఉన్నారా? ఇది మీ మొత్తం డేటాను శాశ్వతంగా తొలగిస్తుంది. ఈ చర్య రద్దు చేయలేనిది.',
    deleteConfirmBtn: 'అవును, అన్నీ తొలగించు',
    cancel: 'రద్దు',
    saveChanges: 'మార్పులు సేవ్ చేయి',
    saving: 'సేవ్ అవుతోంది...',
    saved: 'మార్పులు విజయవంతంగా సేవ్ అయ్యాయి',
    notSignedIn: 'సెట్టింగ్‌లను యాక్సెస్ చేయడానికి సైన్ ఇన్ చేయండి.',
    signIn: 'సైన్ ఇన్',
  },
  bn: {
    title: 'প্রোফাইল ও সেটিংস',
    backHome: 'মূল পৃষ্ঠায় ফিরুন',
    accountInfo: 'অ্যাকাউন্ট তথ্য',
    email: 'ইমেল',
    signInMethod: 'সাইন-ইন পদ্ধতি',
    memberSince: 'সদস্য হয়েছেন',
    personalDetails: 'ব্যক্তিগত বিবরণ',
    fullName: 'পূর্ণ নাম',
    dateOfBirth: 'জন্ম তারিখ',
    timeOfBirth: 'জন্ম সময়',
    unknownTime: 'আমার জন্ম সময় জানা নেই',
    placeOfBirth: 'জন্মস্থান',
    preferences: 'পছন্দসমূহ',
    ayanamsha: 'অয়নাংশ',
    chartStyle: 'চার্ট শৈলী',
    northIndian: 'উত্তর ভারতীয়',
    southIndian: 'দক্ষিণ ভারতীয়',
    nodeType: 'নোড প্রকার (রাহু/কেতু)',
    meanNode: 'গড় নোড',
    trueNode: 'প্রকৃত নোড',
    meanNodeDesc: 'গড় নোড  –  মসৃণ গড় পথ (বেশিরভাগ ঐতিহ্যবাহী পদ্ধতি)',
    trueNodeDesc: 'প্রকৃত নোড  –  অয়ন দোলন সহ (±1.5°, কিছু আধুনিক জ্যোতিষী পছন্দ করেন)',
    language: 'ভাষা',
    displayMode: 'প্রদর্শন মোড',
    displayModeHelp: 'দেখো পঞ্জিকা কীভাবে তথ্য উপস্থাপন করে। যেকোনো সময় পরিবর্তন করুন — এই পছন্দ সাইটজুড়ে প্রযোজ্য।',
    modeBeginner: 'নতুন',
    modeBeginnerDesc: 'বন্ধুত্বপূর্ণ সারাংশ, প্রযুক্তিগত শব্দ নেই',
    modeEnthusiast: 'উৎসাহী',
    modeEnthusiastDesc: 'গভীরতা ও বিবরণ',
    modeAcharya: 'আচার্য',
    modeAcharyaDesc: 'শাস্ত্রীয় মোড, প্রযুক্তিগত ডিফল্ট',
    modeUpdated: 'প্রদর্শন মোড আপডেট করা হয়েছে',
    modeUpdateFailed: 'প্রদর্শন মোড আপনার প্রোফাইলে সংরক্ষণ করা যায়নি। আপনার স্থানীয় পছন্দ এখনও সক্রিয় আছে।',
    notifications: 'বিজ্ঞপ্তি পছন্দসমূহ',
    notifDesc: 'অ্যাপ এবং ইমেলে কোন সতর্কতা পেতে চান তা বেছে নিন।',
    dangerZone: 'বিপদ অঞ্চল',
    signOut: 'সাইন আউট',
    deleteAccount: 'অ্যাকাউন্ট মুছুন',
    deleteConfirmTitle: 'অ্যাকাউন্ট মুছবেন?',
    deleteConfirmMsg: 'আপনি কি নিশ্চিত? এটি আপনার সমস্ত ডেটা স্থায়ীভাবে মুছে ফেলবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।',
    deleteConfirmBtn: 'হ্যাঁ, সব মুছুন',
    cancel: 'বাতিল',
    saveChanges: 'পরিবর্তন সংরক্ষণ করুন',
    saving: 'সংরক্ষণ করা হচ্ছে...',
    saved: 'পরিবর্তন সফলভাবে সংরক্ষিত',
    notSignedIn: 'সেটিংস অ্যাক্সেস করতে সাইন ইন করুন।',
    signIn: 'সাইন ইন',
  },
  kn: {
    title: 'ಪ್ರೊಫೈಲ್ & ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    backHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    accountInfo: 'ಖಾತೆ ಮಾಹಿತಿ',
    email: 'ಇಮೇಲ್',
    signInMethod: 'ಸೈನ್-ಇನ್ ವಿಧಾನ',
    memberSince: 'ಸದಸ್ಯರಾದ',
    personalDetails: 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    dateOfBirth: 'ಹುಟ್ಟಿದ ದಿನಾಂಕ',
    timeOfBirth: 'ಹುಟ್ಟಿದ ಸಮಯ',
    unknownTime: 'ನನಗೆ ಹುಟ್ಟಿದ ಸಮಯ ಗೊತ್ತಿಲ್ಲ',
    placeOfBirth: 'ಹುಟ್ಟಿದ ಸ್ಥಳ',
    preferences: 'ಆದ್ಯತೆಗಳು',
    ayanamsha: 'ಅಯನಾಂಶ',
    chartStyle: 'ಚಾರ್ಟ್ ಶೈಲಿ',
    northIndian: 'ಉತ್ತರ ಭಾರತೀಯ',
    southIndian: 'ದಕ್ಷಿಣ ಭಾರತೀಯ',
    nodeType: 'ನೋಡ್ ಪ್ರಕಾರ (ರಾಹು/ಕೇತು)',
    meanNode: 'ಸರಾಸರಿ ನೋಡ್',
    trueNode: 'ನಿಜವಾದ ನೋಡ್',
    meanNodeDesc: 'ಸರಾಸರಿ ನೋಡ್  –  ಮೃದು ಸರಾಸರಿ ಮಾರ್ಗ (ಹೆಚ್ಚಿನ ಸಾಂಪ್ರದಾಯಿಕ ಪದ್ಧತಿಗಳು)',
    trueNodeDesc: 'ನಿಜವಾದ ನೋಡ್  –  ನ್ಯೂಟೇಶನ್ ಆಂದೋಲನ ಒಳಗೊಂಡಿದೆ (±1.5°, ಕೆಲವು ಆಧುನಿಕ ಜ್ಯೋತಿಷಿಗಳು ಆದ್ಯತೆ ನೀಡುತ್ತಾರೆ)',
    language: 'ಭಾಷೆ',
    displayMode: 'ಪ್ರದರ್ಶನ ಮೋಡ್',
    displayModeHelp: 'ದೇಖೋ ಪಂಚಾಂಗ ಮಾಹಿತಿಯನ್ನು ಹೇಗೆ ಪ್ರಸ್ತುತಪಡಿಸುತ್ತದೆ. ಯಾವಾಗ ಬೇಕಾದರೂ ಬದಲಿಸಿ — ಈ ಆಯ್ಕೆ ಸೈಟ್‌ನಾದ್ಯಂತ ಅನ್ವಯಿಸುತ್ತದೆ.',
    modeBeginner: 'ಆರಂಭಿಕ',
    modeBeginnerDesc: 'ಸ್ನೇಹಪರ ಸಾರಾಂಶ, ತಾಂತ್ರಿಕ ಪದಗಳಿಲ್ಲ',
    modeEnthusiast: 'ಉತ್ಸಾಹಿ',
    modeEnthusiastDesc: 'ಆಳ ಮತ್ತು ವಿವರಣೆ',
    modeAcharya: 'ಆಚಾರ್ಯ',
    modeAcharyaDesc: 'ಶಾಸ್ತ್ರೀಯ ಮೋಡ್, ತಾಂತ್ರಿಕ ಡೀಫಾಲ್ಟ್',
    modeUpdated: 'ಪ್ರದರ್ಶನ ಮೋಡ್ ನವೀಕರಿಸಲಾಗಿದೆ',
    modeUpdateFailed: 'ಪ್ರದರ್ಶನ ಮೋಡ್ ಅನ್ನು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ನಿಮ್ಮ ಸ್ಥಳೀಯ ಆಯ್ಕೆ ಇನ್ನೂ ಸಕ್ರಿಯವಾಗಿದೆ.',
    notifications: 'ನೋಟಿಫಿಕೇಶನ್ ಆದ್ಯತೆಗಳು',
    notifDesc: 'ಅಪ್ಲಿಕೇಶನ್ ಮತ್ತು ಇಮೇಲ್ ಮೂಲಕ ಯಾವ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಬೇಕೆಂದು ಆಯ್ಕೆ ಮಾಡಿ.',
    dangerZone: 'ಅಪಾಯ ವಲಯ',
    signOut: 'ಸೈನ್ ಔಟ್',
    deleteAccount: 'ಖಾತೆ ಅಳಿಸಿ',
    deleteConfirmTitle: 'ಖಾತೆ ಅಳಿಸಬೇಕೇ?',
    deleteConfirmMsg: 'ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಇದು ನಿಮ್ಮ ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸುತ್ತದೆ. ಈ ಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ.',
    deleteConfirmBtn: 'ಹೌದು, ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ',
    cancel: 'ರದ್ದು',
    saveChanges: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    saving: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
    saved: 'ಬದಲಾವಣೆಗಳು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿವೆ',
    notSignedIn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಪ್ರವೇಶಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.',
    signIn: 'ಸೈನ್ ಇನ್',
  },
  mr: {
    title: 'प्रोफाइल आणि सेटिंग्ज',
    backHome: 'मुख्यपृष्ठावर परत',
    accountInfo: 'खाते माहिती',
    email: 'ईमेल',
    signInMethod: 'साइन-इन पद्धत',
    memberSince: 'सदस्य झाले',
    personalDetails: 'वैयक्तिक तपशील',
    fullName: 'पूर्ण नाव',
    dateOfBirth: 'जन्मतिथी',
    timeOfBirth: 'जन्म वेळ',
    unknownTime: 'मला माझा जन्म वेळ माहित नाही',
    placeOfBirth: 'जन्मस्थान',
    preferences: 'प्राधान्ये',
    ayanamsha: 'अयनांश',
    chartStyle: 'चार्ट शैली',
    northIndian: 'उत्तर भारतीय',
    southIndian: 'दक्षिण भारतीय',
    nodeType: 'नोड प्रकार (राहु/केतु)',
    meanNode: 'मध्य नोड',
    trueNode: 'वास्तविक नोड',
    meanNodeDesc: 'मध्य नोड  –  सम सरासरी मार्ग (बहुतांश पारंपरिक पद्धती)',
    trueNodeDesc: 'वास्तविक नोड  –  अयन दोलनासह (±1.5°, काही आधुनिक ज्योतिषी पसंत करतात)',
    language: 'भाषा',
    displayMode: 'प्रदर्शन मोड',
    displayModeHelp: 'देखो पंचांग माहिती कशी सादर करते. कधीही बदला — ही निवड संपूर्ण साइटवर लागू होते.',
    modeBeginner: 'नवशिका',
    modeBeginnerDesc: 'मैत्रीपूर्ण सारांश, तांत्रिक शब्द नाहीत',
    modeEnthusiast: 'जिज्ञासू',
    modeEnthusiastDesc: 'खोली आणि वर्णन',
    modeAcharya: 'आचार्य',
    modeAcharyaDesc: 'शास्त्रीय मोड, तांत्रिक डीफॉल्ट',
    modeUpdated: 'प्रदर्शन मोड अद्यतनित केला',
    modeUpdateFailed: 'प्रदर्शन मोड तुमच्या प्रोफाइलमध्ये जतन करता आला नाही. तुमची स्थानिक निवड अद्याप सक्रिय आहे.',
    notifications: 'सूचना प्राधान्ये',
    notifDesc: 'ॲप आणि ईमेलद्वारे कोणत्या सूचना प्राप्त करायच्या ते निवडा.',
    dangerZone: 'धोका क्षेत्र',
    signOut: 'साइन आउट',
    deleteAccount: 'खाते हटवा',
    deleteConfirmTitle: 'खाते हटवायचे?',
    deleteConfirmMsg: 'आपण खात्री आहात? हे आपला सर्व डेटा कायमचा हटवेल. ही क्रिया पूर्ववत करता येत नाही.',
    deleteConfirmBtn: 'होय, सर्व हटवा',
    cancel: 'रद्द करा',
    saveChanges: 'बदल जतन करा',
    saving: 'जतन करत आहे...',
    saved: 'बदल यशस्वीरित्या जतन झाले',
    notSignedIn: 'सेटिंग्ज ऍक्सेस करण्यासाठी साइन इन करा.',
    signIn: 'साइन इन',
  },
  gu: {
    title: 'પ્રોફાઇલ અને સેટિંગ્સ',
    backHome: 'મુખ્ય પૃષ્ઠ પર પાછા',
    accountInfo: 'ખાતા માહિતી',
    email: 'ઇમેલ',
    signInMethod: 'સાઇન-ઇન પદ્ધતિ',
    memberSince: 'સભ્ય બન્યા',
    personalDetails: 'વ્યક્તિગત વિગતો',
    fullName: 'પૂરું નામ',
    dateOfBirth: 'જન્મ તારીખ',
    timeOfBirth: 'જન્મ સમય',
    unknownTime: 'મને મારો જન્મ સમય ખબર નથી',
    placeOfBirth: 'જન્મ સ્થળ',
    preferences: 'પસંદગીઓ',
    ayanamsha: 'અયનાંશ',
    chartStyle: 'ચાર્ટ શૈલી',
    northIndian: 'ઉત્તર ભારતીય',
    southIndian: 'દક્ષિણ ભારતીય',
    nodeType: 'નોડ પ્રકાર (રાહુ/કેતુ)',
    meanNode: 'સરેરાશ નોડ',
    trueNode: 'વાસ્તવિક નોડ',
    meanNodeDesc: 'સરેરાશ નોડ  –  સરળ સરેરાશ માર્ગ (મોટાભાગની પરંપરાગત પદ્ધતિઓ)',
    trueNodeDesc: 'વાસ્તવિક નોડ  –  અયન દોલન સહિત (±1.5°, કેટલાક આધુનિક જ્યોતિષીઓ પસંદ કરે છે)',
    language: 'ભાષા',
    displayMode: 'પ્રદર્શન મોડ',
    displayModeHelp: 'દેખો પંચાંગ માહિતી કેવી રીતે રજૂ કરે છે. ગમે ત્યારે બદલો — આ પસંદગી સાઇટભરમાં લાગુ થાય છે.',
    modeBeginner: 'નવોદિત',
    modeBeginnerDesc: 'મૈત્રીપૂર્ણ સારાંશ, કોઈ ટેકનિકલ શબ્દો નથી',
    modeEnthusiast: 'ઉત્સાહી',
    modeEnthusiastDesc: 'ઊંડાણ અને વર્ણન',
    modeAcharya: 'આચાર્ય',
    modeAcharyaDesc: 'શાસ્ત્રીય મોડ, ટેકનિકલ ડિફોલ્ટ',
    modeUpdated: 'પ્રદર્શન મોડ અપડેટ થયો',
    modeUpdateFailed: 'પ્રદર્શન મોડ તમારી પ્રોફાઇલમાં સાચવી શકાયો નથી. તમારી સ્થાનિક પસંદગી હજુ સક્રિય છે.',
    notifications: 'સૂચના પસંદગીઓ',
    notifDesc: 'એપ અને ઇમેલ દ્વારા કઈ સૂચનાઓ મેળવવી તે પસંદ કરો.',
    dangerZone: 'જોખમ ક્ષેત્ર',
    signOut: 'સાઇન આઉટ',
    deleteAccount: 'ખાતું કાઢી નાખો',
    deleteConfirmTitle: 'ખાતું કાઢી નાખવું?',
    deleteConfirmMsg: 'શું તમે ખાતરી છો? આ તમારો તમામ ડેટા કાયમ માટે કાઢી નાખશે. આ ક્રિયા પાછી ફેરવી શકાતી નથી.',
    deleteConfirmBtn: 'હા, બધું કાઢી નાખો',
    cancel: 'રદ કરો',
    saveChanges: 'ફેરફારો સાચવો',
    saving: 'સાચવી રહ્યા છે...',
    saved: 'ફેરફારો સફળતાપૂર્વક સાચવાયા',
    notSignedIn: 'સેટિંગ્સ ઍક્સેસ કરવા સાઇન ઇન કરો.',
    signIn: 'સાઇન ઇન',
  },
  mai: {
    title: 'प्रोफाइल आ सेटिंग्स',
    backHome: 'मुख्य पृष्ठ पर वापस',
    accountInfo: 'खाता जानकारी',
    email: 'ईमेल',
    signInMethod: 'साइन-इन विधि',
    memberSince: 'सदस्य भेलहुँ',
    personalDetails: 'व्यक्तिगत विवरण',
    fullName: 'पूरा नाम',
    dateOfBirth: 'जन्म तिथि',
    timeOfBirth: 'जन्म समय',
    unknownTime: 'हमरा अपन जन्म समय नहि बुझल अछि',
    placeOfBirth: 'जन्म स्थान',
    preferences: 'प्राथमिकता',
    ayanamsha: 'अयनांश',
    chartStyle: 'चार्ट शैली',
    northIndian: 'उत्तर भारतीय',
    southIndian: 'दक्षिण भारतीय',
    nodeType: 'नोड प्रकार (राहु/केतु)',
    meanNode: 'मध्य नोड',
    trueNode: 'वास्तविक नोड',
    meanNodeDesc: 'मध्य नोड  –  सम औसत पथ (अधिकांश पारंपरिक पद्धति)',
    trueNodeDesc: 'वास्तविक नोड  –  अयन दोलन सहित (±1.5°, किछ आधुनिक ज्योतिषी पसंद करैत छथि)',
    language: 'भाषा',
    displayMode: 'प्रदर्शन मोड',
    displayModeHelp: 'देखो पंचांग जानकारी कोना प्रस्तुत करैत अछि। कखनहु बदलू — ई चुनाव पूरा साइट पर लागू होइत अछि।',
    modeBeginner: 'नवसिखुआ',
    modeBeginnerDesc: 'सरल सारांश, कोनो तकनीकी शब्द नहि',
    modeEnthusiast: 'जिज्ञासु',
    modeEnthusiastDesc: 'गहराई आ विवरण',
    modeAcharya: 'आचार्य',
    modeAcharyaDesc: 'शास्त्रीय मोड, तकनीकी डिफॉल्ट',
    modeUpdated: 'प्रदर्शन मोड अपडेट कएल गेल',
    modeUpdateFailed: 'प्रदर्शन मोड अहाँक प्रोफाइल मे सहेजल नहि जा सकल। अहाँक स्थानीय चुनाव अखनहु सक्रिय अछि।',
    notifications: 'सूचना प्राथमिकता',
    notifDesc: 'ऐप आ ईमेलसँ कोन सूचना प्राप्त करबाक चाही से चुनू.',
    dangerZone: 'खतरा क्षेत्र',
    signOut: 'साइन आउट',
    deleteAccount: 'खाता हटाउ',
    deleteConfirmTitle: 'खाता हटाउ?',
    deleteConfirmMsg: 'की अहाँ सुनिश्चित छी? ई अहाँक सभ डेटा स्थायी रूपसँ हटा देत। ई क्रिया पूर्ववत नहि कएल जा सकैत अछि.',
    deleteConfirmBtn: 'हँ, सभ हटाउ',
    cancel: 'रद्द करू',
    saveChanges: 'बदलाव सहेजू',
    saving: 'सहेज रहल अछि...',
    saved: 'बदलाव सफलतापूर्वक सहेजल गेल',
    notSignedIn: 'सेटिंग्स ऍक्सेस करबाक लेल साइन इन करू.',
    signIn: 'साइन इन',
  },
};

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'sa', label: 'संस्कृतम्' },
  { value: 'ta', label: 'தமிழ்' },
];

const AYANAMSHA_OPTIONS = [
  { value: 'lahiri', label: 'Lahiri (Chitrapaksha)' },
  { value: 'raman', label: 'Raman' },
  { value: 'kp', label: 'KP (Krishnamurti)' },
];

export default function SettingsPage() {
  const locale = useLocale() as Locale;
  const msg = (key: string) => tl((SM as unknown as Record<string, Record<string, string>>)[key], locale);
  const router = useRouter();
  const L = (LABELS as Record<string, typeof LABELS.en>)[locale] || LABELS.en;
  const { user, initialized, signOut } = useAuthStore();
  const { mode: personaMode, setMode: setPersonaMode, isHydrated: personaHydrated } = usePersonaMode();
  // Once the user explicitly clicks a mode in this session, the
  // profile-load sync below must NOT stomp that choice. Gemini PR
  // #385 cycle-1 HIGH (one of two race vectors).
  const hasUserSetModeRef = useRef(false);
  // Serialise Supabase upserts so rapid clicks don't race — without
  // this, network-jitter could let an earlier write land after a
  // later one, leaving the DB out of order. Gemini PR #385 cycle-1
  // MED.
  const dbSyncPromiseRef = useRef<Promise<void>>(Promise.resolve());
  // Mirror `personaMode` into a ref so the async profile-load
  // callback below sees the latest value, not the one captured at
  // mount. Without this, a hydration-time change to personaMode
  // (e.g., localStorage restore on the first paint after a cookie
  // clear) could be missed and the profile-sync comparison would
  // use a stale value. Gemini PR #385 cycle-2 HIGH.
  const personaModeRef = useRef(personaMode);
  personaModeRef.current = personaMode;
  // Reset the user-set-mode flag when the active user changes
  // (e.g., SPA logout → login as a different user without a full
  // page reload). Without this, the new user's profile-load sync
  // would be incorrectly skipped because the previous user
  // clicked a mode in the same React tree. Gemini PR #385
  // cycle-3 MED.
  useEffect(() => {
    hasUserSetModeRef.current = false;
  }, [user?.id]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({
    dasha_transition: true,
    transit_alert: true,
    festival_reminder: true,
    sade_sati: true,
    weekly_digest: true,
    daily_panchang: false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    display_name: '',
    date_of_birth: '',
    time_of_birth: '12:00',
    birth_time_known: true,
    birth_place: '',
    birth_lat: null,
    birth_lng: null,
    birth_timezone: '',
    default_location: '',
    ayanamsha: 'lahiri',
    chart_style: 'north',
    node_type: 'mean',
  });

  // Original values for comparison
  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!initialized || !user) return;

    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }

    supabase.from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        // Round 3 R3-UI-4 — surface RLS / network errors instead of
        // silently falling through to the new-user empty state.
        if (error) {
          console.error('[settings] profile load failed:', error.message);
        }
        if (data) {
          const loaded: ProfileData = {
            display_name: data.display_name || user.user_metadata?.name || '',
            date_of_birth: data.date_of_birth || '',
            time_of_birth: data.time_of_birth || '12:00',
            birth_time_known: data.birth_time_known ?? true,
            birth_place: data.birth_place || '',
            birth_lat: data.birth_lat ?? null,
            birth_lng: data.birth_lng ?? null,
            birth_timezone: data.birth_timezone || '',
            default_location: data.default_location || '',
            ayanamsha: data.ayanamsha || 'lahiri',
            chart_style: data.chart_style || 'north',
            node_type: data.node_type === 'true' ? 'true' : 'mean',
          };
          setProfile(loaded);
          setOriginalProfile({ ...loaded });
          // Sync the loaded `experience_level` to the local persona
          // context. Without this, a user logging in on a fresh
          // device (or after clearing cookies) sees the default
          // 'enthusiast' selected in the picker even when their
          // profile is `advanced`. Skip the sync if the user has
          // already clicked a mode this session — their explicit
          // choice wins over the (now stale) DB value. Gemini PR
          // #385 cycle-1 HIGH.
          if (
            !hasUserSetModeRef.current &&
            typeof data.experience_level === 'string'
          ) {
            const profileMode = dbToPersonaMode(data.experience_level);
            // Read the LATEST personaMode via ref to avoid the stale
            // closure captured at mount. Gemini PR #385 cycle-2 HIGH.
            if (profileMode !== personaModeRef.current) {
              setPersonaMode(profileMode);
            }
          }
          // Load notification preferences
          if (data.notification_prefs && typeof data.notification_prefs === 'object') {
            setNotifPrefs(prev => ({ ...prev, ...(data.notification_prefs as Record<string, boolean>) }));
          }
        } else {
          const defaults: ProfileData = {
            display_name: user.user_metadata?.name || user.email?.split('@')[0] || '',
            date_of_birth: '',
            time_of_birth: '12:00',
            birth_time_known: true,
            birth_place: '',
            birth_lat: null,
            birth_lng: null,
            birth_timezone: '',
            default_location: '',
            ayanamsha: 'lahiri',
            chart_style: 'north',
            node_type: 'mean',
          };
          setProfile(defaults);
          setOriginalProfile({ ...defaults });
        }
        setLoading(false);
      });

  }, [initialized, user]);

  if (!initialized) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <User className="w-12 h-12 text-gold-primary mx-auto" />
          <p className="text-text-secondary text-lg">{L.notSignedIn}</p>
          <a
            href={`/${locale}`}
            className="inline-block px-6 py-2 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-primary/20 transition-all"
          >
            {L.signIn}
          </a>
        </div>
      </div>
    );
  }

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(msg('localeId'), {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ' – ';

  const signInMethod = user.app_metadata?.provider === 'google' ? 'Google' : 'Email';

  function birthDataChanged(): boolean {
    if (!originalProfile) return false;
    return (
      profile.date_of_birth !== originalProfile.date_of_birth ||
      profile.time_of_birth !== originalProfile.time_of_birth ||
      profile.birth_time_known !== originalProfile.birth_time_known ||
      profile.birth_place !== originalProfile.birth_place ||
      profile.birth_lat !== originalProfile.birth_lat ||
      profile.birth_lng !== originalProfile.birth_lng ||
      // node_type feeds kundali-calc — toggle alone must trigger a recompute
      profile.node_type !== originalProfile.node_type
    );
  }

  /**
   * Persona-mode change handler. Updates the context (cookie +
   * localStorage) immediately and, for logged-in users, syncs to
   * user_profiles.experience_level. Shows a toast (reusing the
   * `successMsg` surface already wired up below). Per spec Q5,
   * the change is silent — no confirmation dialog.
   *
   * Anonymous users get the same context update but no DB write;
   * a subsequent signup will overwrite their choice via the
   * OnboardingModal flow.
   */
  function handleModeChange(nextMode: PersonaMode) {
    if (nextMode === personaMode) return;

    // Block the profile-load sync from stomping this choice if the
    // user clicked before the network round-trip completed.
    hasUserSetModeRef.current = true;

    // Optimistic local update first — the persona context's setMode
    // writes cookie + localStorage synchronously and re-renders
    // every persona-aware surface immediately.
    setPersonaMode(nextMode);
    setSuccessMsg(L.modeUpdated);
    setErrorMsg('');

    // Sync to user_profiles for logged-in users via a serialised
    // promise chain so rapid clicks don't race. Each click queues
    // its upsert behind the previous one's completion, guaranteeing
    // the DB row matches the LAST click regardless of network
    // jitter. Gemini PR #385 cycle-1 MED.
    if (!user) return;
    dbSyncPromiseRef.current = dbSyncPromiseRef.current.then(async () => {
      try {
        const supabase = getSupabase();
        if (!supabase) {
          // Supabase client not configured / failed to initialise.
          // Surface the failure rather than leaving the optimistic
          // success toast on screen. Gemini PR #385 cycle-3 MED.
          setSuccessMsg('');
          setErrorMsg(L.modeUpdateFailed);
          return;
        }
        const { error } = await supabase.from('user_profiles').upsert(
          {
            id: user.id,
            experience_level: personaModeToDb(nextMode),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' },
        );
        if (error) {
          console.error('[settings] persona mode DB sync failed:', error.message);
          // Don't revert the local change — the user's cookie +
          // localStorage still reflect their choice across the
          // site. But DO surface the failure so they know to
          // retry later if they want the choice synced to other
          // devices. Gemini PR #385 cycle-2 MED.
          setSuccessMsg('');
          setErrorMsg(L.modeUpdateFailed);
        }
      } catch (err) {
        console.error('[settings] persona mode DB sync threw:', err);
        setSuccessMsg('');
        setErrorMsg(L.modeUpdateFailed);
      }
    });
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSuccessMsg('');

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase not configured');

      // Upsert user_profiles
      const upsertData: Record<string, unknown> = {
        id: user.id,
        display_name: profile.display_name.trim(),
        date_of_birth: profile.date_of_birth || null,
        time_of_birth: profile.birth_time_known ? profile.time_of_birth : '12:00',
        birth_time_known: profile.birth_time_known,
        birth_place: profile.birth_place || null,
        birth_lat: profile.birth_lat,
        birth_lng: profile.birth_lng,
        birth_timezone: profile.birth_timezone || null,
        ayanamsha: profile.ayanamsha,
        chart_style: profile.chart_style,
        node_type: profile.node_type,
        notification_prefs: notifPrefs,
        daily_panchang_email: !!notifPrefs.daily_panchang,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(upsertData, { onConflict: 'id' });

      if (upsertError) throw new Error(upsertError.message);

      // If birth data changed, recompute kundali snapshot.
      // The POST to /api/user/profile can legitimately 4xx/5xx (validation,
      // kundali compute failure, DB blip). Previously its return was ignored
      // and the user saw a green "Saved" toast while the snapshot was stale
      // or never written, then loaded a dashboard with wrong houses/dashas.
      // Per audit P0-8: check res.ok and throw so the outer catch shows
      // the localised error toast that already exists below. Also pass
      // isRecompute=true so the server-side welcome-email guard fast-paths
      // without re-querying.
      if (birthDataChanged() && profile.date_of_birth && profile.birth_place && profile.birth_lat != null && profile.birth_lng != null && profile.birth_timezone) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const res = await fetch('/api/user/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              name: profile.display_name.trim(),
              dateOfBirth: profile.date_of_birth,
              timeOfBirth: profile.birth_time_known ? profile.time_of_birth : '12:00',
              birthTimeKnown: profile.birth_time_known,
              birthPlace: profile.birth_place,
              birthLat: profile.birth_lat,
              birthLng: profile.birth_lng,
              birthTimezone: profile.birth_timezone, // Server re-resolves from coords  –  this is for display only
              nodeType: profile.node_type,
              isRecompute: true,
            }),
          });
          if (!res.ok) {
            let detail = `${res.status} ${res.statusText}`;
            try {
              const body = await res.json();
              if (body?.error) detail = String(body.error);
            } catch { /* body may not be JSON */ }
            throw new Error(`Kundali recompute failed: ${detail}`);
          }
        }
      }

      setOriginalProfile({ ...profile });
      // Invalidate the shared birth-data status cache so any mounted
      // BirthDetailsBanner / SadhakaBanner picks up the new value
      // immediately — the user just edited birth details here, and the
      // banner watching for missing data must re-fetch.
      try {
        const { invalidateBirthDataStatus } = await import('@/hooks/useBirthDataStatus');
        invalidateBirthDataStatus(user.id);
      } catch (cacheErr) {
        console.error('[settings] birth-data cache invalidate failed (non-critical):', cacheErr);
      }
      setSuccessMsg(L.saved);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('[settings] save failed:', err);
      setSuccessMsg('');
      setErrorMsg(tl({ en: 'Save failed. Please try again.', hi: 'सहेजना विफल। पुनः प्रयास करें।', sa: 'सञ्चयनं विफलम्।' }, locale));
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase not configured');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No session');

      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Delete failed');
      }

      await signOut();
      router.push(`/${locale}`);
    } catch (err) {
      console.error('Delete account failed:', err);
      setErrorMsg(tl({ en: 'Account deletion failed. Please try again.', hi: 'खाता हटाना विफल। पुनः प्रयास करें।', sa: 'खातविलोपनं विफलम्।' }, locale));
      setTimeout(() => setErrorMsg(''), 5000);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push(`/${locale}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href={`/${locale}`}
            className="text-sm text-text-secondary hover:text-gold-light transition-colors"
          >
            &larr; {L.backHome}
          </a>
          <h1 className="text-3xl font-bold mt-2 bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark bg-clip-text text-transparent">
            {L.title}
          </h1>
        </motion.div>

        {/* Section 1: Account Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gold-primary/10 bg-gold-primary/5">
            <h2 className="text-lg font-semibold text-gold-light flex items-center gap-2">
              <User className="w-5 h-5" />
              {L.accountInfo}
            </h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-wider">{L.email}</span>
              <p className="text-text-primary mt-1">{user.email}</p>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-wider">{L.signInMethod}</span>
              <p className="text-text-primary mt-1">{signInMethod}</p>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-wider">{L.memberSince}</span>
              <p className="text-text-primary mt-1">{memberSince}</p>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Personal Details */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gold-primary/10 bg-gold-primary/5">
            <h2 className="text-lg font-semibold text-gold-light flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {L.personalDetails}
            </h2>
          </div>
          <div className="px-6 py-5 space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">{L.fullName}</label>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/70 focus:border-gold-primary/40 focus:outline-none text-base sm:text-sm"
                placeholder="Enter your full name"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">{L.dateOfBirth}</label>
              <input
                type="date"
                value={profile.date_of_birth}
                onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary focus:border-gold-primary/40 focus:outline-none text-base sm:text-sm [color-scheme:dark]"
              />
            </div>

            {/* Time of Birth */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">{L.timeOfBirth}</label>
              <input
                type="time"
                value={profile.birth_time_known ? profile.time_of_birth : '12:00'}
                onChange={(e) => setProfile({ ...profile, time_of_birth: e.target.value })}
                disabled={!profile.birth_time_known}
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary focus:border-gold-primary/40 focus:outline-none text-base sm:text-sm disabled:opacity-40 [color-scheme:dark]"
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!profile.birth_time_known}
                  onChange={(e) => setProfile({
                    ...profile,
                    birth_time_known: !e.target.checked,
                    time_of_birth: e.target.checked ? '12:00' : profile.time_of_birth,
                  })}
                  className="w-4 h-4 rounded border-gold-primary/30 bg-bg-secondary/50 text-gold-primary focus:ring-gold-primary/40 accent-[#d4a853]"
                />
                <span className="text-sm text-text-secondary">{L.unknownTime}</span>
              </label>
            </div>

            {/* Place of Birth */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">{L.placeOfBirth}</label>
              <LocationSearch
                value={profile.birth_place}
                onSelect={(loc) => setProfile({
                  ...profile,
                  birth_place: loc.name,
                  birth_lat: loc.lat,
                  birth_lng: loc.lng,
                  birth_timezone: loc.timezone,
                })}
                placeholder={msg('searchCity')}
              />
              {profile.birth_place && profile.birth_lat != null && (
                <p className="text-xs text-text-secondary/75 mt-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.birth_lat.toFixed(2)}, {profile.birth_lng?.toFixed(2)} ({profile.birth_timezone})
                </p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Section 3: Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gold-primary/10 bg-gold-primary/5">
            <h2 className="text-lg font-semibold text-gold-light flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {L.preferences}
            </h2>
          </div>
          <div className="px-6 py-5 space-y-5">
            {/* Ayanamsha */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">{L.ayanamsha}</label>
              <select
                value={profile.ayanamsha}
                onChange={(e) => setProfile({ ...profile, ayanamsha: e.target.value })}
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary focus:border-gold-primary/40 focus:outline-none text-base sm:text-sm [color-scheme:dark]"
              >
                {AYANAMSHA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Chart Style */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">{L.chartStyle}</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setProfile({ ...profile, chart_style: 'north' })}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                    profile.chart_style === 'north'
                      ? 'border-gold-primary/60 bg-gold-primary/15 text-gold-light'
                      : 'border-gold-primary/15 bg-bg-secondary/50 text-text-secondary hover:border-gold-primary/30'
                  }`}
                >
                  {L.northIndian}
                </button>
                <button
                  onClick={() => setProfile({ ...profile, chart_style: 'south' })}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                    profile.chart_style === 'south'
                      ? 'border-gold-primary/60 bg-gold-primary/15 text-gold-light'
                      : 'border-gold-primary/15 bg-bg-secondary/50 text-text-secondary hover:border-gold-primary/30'
                  }`}
                >
                  {L.southIndian}
                </button>
              </div>
            </div>

            {/* Node Type (Rahu/Ketu) */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">{L.nodeType}</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setProfile({ ...profile, node_type: 'mean' })}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                    profile.node_type === 'mean'
                      ? 'border-gold-primary/60 bg-gold-primary/15 text-gold-light'
                      : 'border-gold-primary/15 bg-bg-secondary/50 text-text-secondary hover:border-gold-primary/30'
                  }`}
                >
                  {L.meanNode}
                </button>
                <button
                  onClick={() => setProfile({ ...profile, node_type: 'true' })}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                    profile.node_type === 'true'
                      ? 'border-gold-primary/60 bg-gold-primary/15 text-gold-light'
                      : 'border-gold-primary/15 bg-bg-secondary/50 text-text-secondary hover:border-gold-primary/30'
                  }`}
                >
                  {L.trueNode}
                </button>
              </div>
              <p className="text-xs text-text-secondary/60 mt-1.5">
                {profile.node_type === 'mean' ? L.meanNodeDesc : L.trueNodeDesc}
              </p>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">{L.language}</label>
              <select
                value={locale}
                onChange={(e) => {
                  const newLocale = e.target.value;
                  router.push(`/${newLocale}/settings`);
                }}
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary focus:border-gold-primary/40 focus:outline-none text-base sm:text-sm [color-scheme:dark]"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.section>

        {/* Section 3.5: Display Mode (persona).
            Sitewide preference that tailors tone + defaults across
            persona-aware surfaces (Daily Briefing register, /matching
            verdict, /sade-sati intro). The /kundali page has its own
            independent toggle (Simple / Detailed / Expert) — this
            picker does NOT override that one. */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gold-primary/10 bg-gold-primary/5">
            <h2 className="text-lg font-semibold text-gold-light flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {L.displayMode}
            </h2>
            <p className="text-text-secondary text-xs mt-1.5">{L.displayModeHelp}</p>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { mode: 'beginner' as const, icon: '✦', name: L.modeBeginner, desc: L.modeBeginnerDesc },
                  { mode: 'enthusiast' as const, icon: '✦✦', name: L.modeEnthusiast, desc: L.modeEnthusiastDesc },
                  { mode: 'acharya' as const, icon: '✦✦✦', name: L.modeAcharya, desc: L.modeAcharyaDesc },
                ]
              ).map((opt) => {
                // Guard with `personaHydrated`: SSR renders with the
                // default mode, the client may resolve to a different
                // mode on hydration. Comparing them directly here
                // produces a React `aria-pressed` hydration mismatch
                // warning AND a visual flicker as the highlighted
                // button shifts. By waiting for hydration before
                // highlighting any button, both SSR and the first
                // post-hydration paint render identically (no
                // selection), then the real selection appears.
                // Gemini PR #385 cycle-1 MED.
                const isSelected = personaHydrated && personaMode === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => handleModeChange(opt.mode)}
                    aria-pressed={isSelected}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border text-center transition-all duration-200 ${
                      isSelected
                        ? 'border-gold-primary/60 bg-gold-primary/15 text-gold-light shadow-inner shadow-gold-primary/10'
                        : 'border-gold-primary/10 bg-bg-secondary/30 text-text-secondary hover:border-gold-primary/25 hover:bg-gold-primary/5'
                    }`}
                  >
                    <span className="text-xs opacity-60">{opt.icon}</span>
                    <span className="text-sm font-semibold">{opt.name}</span>
                    <span className="text-[11px] leading-tight opacity-70">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Section 4: Notification Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gold-primary/10 bg-gold-primary/5">
            <h2 className="text-lg font-semibold text-gold-light flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {L.notifications}
            </h2>
            <p className="text-xs text-text-secondary/75 mt-1">{L.notifDesc}</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <PushPermission locale={locale} />
            {NOTIF_TYPES.map((nt) => (
              <label key={nt.key} className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  {!isDevanagariLocale(locale) ? nt.en : nt.hi}
                </span>
                <button
                  role="switch"
                  aria-checked={notifPrefs[nt.key] !== false}
                  onClick={() => setNotifPrefs(prev => ({ ...prev, [nt.key]: !prev[nt.key] }))}
                  className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
                    notifPrefs[nt.key] !== false ? 'bg-gold-primary/70' : 'bg-bg-tertiary/60'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    notifPrefs[nt.key] !== false ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </label>
            ))}
          </div>
        </motion.section>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {L.saving}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {L.saveChanges}
              </>
            )}
          </button>
          {successMsg && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-green-400 mt-3"
            >
              {successMsg}
            </motion.p>
          )}
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-red-400 mt-3"
            >
              {errorMsg}
            </motion.p>
          )}
        </motion.div>

        {/* Section 5: Account Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm overflow-hidden"
        >
          <div className="px-6 py-5 space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              {L.signOut}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs text-text-secondary/70 hover:text-red-400/70 transition-colors justify-center"
            >
              <Trash2 className="w-3 h-3" />
              {L.deleteAccount}
            </button>
          </div>
        </motion.section>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md rounded-2xl border border-red-500/20 bg-bg-primary p-6 shadow-2xl space-y-4"
            >
              <h3 className="text-xl font-bold text-red-400">{L.deleteConfirmTitle}</h3>
              <p className="text-text-secondary text-sm">{L.deleteConfirmMsg}</p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gold-primary/20 text-text-secondary hover:text-gold-light transition-all text-sm font-medium"
                >
                  {L.cancel}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all text-sm font-medium disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {L.deleteConfirmBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
