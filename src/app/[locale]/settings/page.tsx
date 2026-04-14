'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, MapPin, Calendar, Clock, Save, Trash2, LogOut, Loader2, Bell } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import PushPermission from '@/components/notifications/PushPermission';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

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
    language: 'Language',
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
    language: 'भाषा',
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
    language: 'भाषा',
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
    language: 'மொழி',
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
    language: 'భాష',
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
    language: 'ভাষা',
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
    language: 'ಭಾಷೆ',
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
    language: 'भाषा',
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
    language: 'ભાષા',
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
    language: 'भाषा',
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
  const router = useRouter();
  const L = (LABELS as Record<string, typeof LABELS.en>)[locale] || LABELS.en;
  const { user, initialized, signOut } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
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
      .then(({ data }) => {
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
          };
          setProfile(loaded);
          setOriginalProfile({ ...loaded });
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
    ? new Date(user.created_at).toLocaleDateString(tl({ en: 'en-IN', hi: 'hi-IN', sa: 'hi-IN' }, locale), {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—';

  const signInMethod = user.app_metadata?.provider === 'google' ? 'Google' : 'Email';

  function birthDataChanged(): boolean {
    if (!originalProfile) return false;
    return (
      profile.date_of_birth !== originalProfile.date_of_birth ||
      profile.time_of_birth !== originalProfile.time_of_birth ||
      profile.birth_time_known !== originalProfile.birth_time_known ||
      profile.birth_place !== originalProfile.birth_place ||
      profile.birth_lat !== originalProfile.birth_lat ||
      profile.birth_lng !== originalProfile.birth_lng
    );
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
        notification_prefs: notifPrefs,
        daily_panchang_email: !!notifPrefs.daily_panchang,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(upsertData, { onConflict: 'id' });

      if (upsertError) throw new Error(upsertError.message);

      // If birth data changed, recompute kundali snapshot
      if (birthDataChanged() && profile.date_of_birth && profile.birth_place && profile.birth_lat != null && profile.birth_lng != null && profile.birth_timezone) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetch('/api/user/profile', {
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
              birthTimezone: profile.birth_timezone, // Server re-resolves from coords — this is for display only
            }),
          });
        }
      }

      setOriginalProfile({ ...profile });
      setSuccessMsg(L.saved);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Save failed:', err);
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
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/70 focus:border-gold-primary/40 focus:outline-none text-sm"
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
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary focus:border-gold-primary/40 focus:outline-none text-sm [color-scheme:dark]"
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
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary focus:border-gold-primary/40 focus:outline-none text-sm disabled:opacity-40 [color-scheme:dark]"
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
                placeholder={tl({ en: 'Search city or place...', hi: 'शहर खोजें...', sa: 'शहर खोजें...' }, locale)}
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
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary focus:border-gold-primary/40 focus:outline-none text-sm [color-scheme:dark]"
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

            {/* Language */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">{L.language}</label>
              <select
                value={locale}
                onChange={(e) => {
                  const newLocale = e.target.value;
                  router.push(`/${newLocale}/settings`);
                }}
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary focus:border-gold-primary/40 focus:outline-none text-sm [color-scheme:dark]"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
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
