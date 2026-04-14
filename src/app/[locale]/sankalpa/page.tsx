'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, Printer, Sparkles, ScrollText } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import GoldDivider from '@/components/ui/GoldDivider';
import { useLocationStore } from '@/stores/location-store';
import { useAuthStore } from '@/stores/auth-store';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ── Types ──────────────────────────────────────────────────── */

interface SankalpaResult {
  devanagari: string;
  iast: string;
  english: string;
  components: {
    kalpaText: string;
    samvatsara: string;
    ayana: string;
    ritu: string;
    masa: string;
    paksha: string;
    tithi: string;
    vara: string;
    nakshatra: string;
    desha: string;
    kartaa: string;
    purpose: string;
  };
  panchangDate: string;
  vikramSamvat: number;
}

/* ── Trilingual Labels ──────────────────────────────────────── */

const LABELS = {
  en: {
    title: 'Sankalpa Generator',
    subtitle: 'Sacred Resolution for Puja & Vrata',
    desc: 'Generate a personalized Sankalpa declaration with precise Panchang elements for your ritual, vow, or sacred intention.',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your name',
    gotra: 'Gotra',
    gotraPlaceholder: 'Select or type gotra',
    place: 'Place',
    date: 'Date',
    purpose: 'Purpose',
    forPuja: 'For a Puja',
    forVrat: 'For a Vrat',
    custom: 'Custom',
    selectPuja: 'Select Puja',
    vratName: 'Vrat name',
    vratPlaceholder: 'e.g. Ekadashi Vrat',
    customPurpose: 'Purpose',
    customPlaceholder: 'e.g. For the well-being of my family',
    generate: 'Generate Sankalpa',
    generating: 'Computing Panchang...',
    result: 'Your Sankalpa',
    iast: 'IAST Transliteration',
    meaning: 'English Meaning',
    components: 'Panchang Components',
    copied: 'Copied!',
    copy: 'Copy Sankalpa',
    print: 'Print',
    vikramSamvat: 'Vikram Samvat',
    samvatsara: 'Samvatsara',
    ayana: 'Ayana',
    ritu: 'Ritu',
    masa: 'Masa',
    paksha: 'Paksha',
    tithi: 'Tithi',
    vara: 'Vara',
    nakshatra: 'Nakshatra',
    desha: 'Desha',
    kartaa: 'Kartaa',
    purposeLabel: 'Purpose',
  },
  hi: {
    title: 'संकल्प जनक',
    subtitle: 'पूजा एवं व्रत हेतु पवित्र संकल्प',
    desc: 'अपनी पूजा, व्रत या पवित्र संकल्प के लिए सटीक पंचांग तत्वों सहित व्यक्तिगत संकल्प वाक्य बनाएं।',
    fullName: 'पूरा नाम',
    fullNamePlaceholder: 'अपना नाम लिखें',
    gotra: 'गोत्र',
    gotraPlaceholder: 'गोत्र चुनें या लिखें',
    place: 'स्थान',
    date: 'तिथि',
    purpose: 'प्रयोजन',
    forPuja: 'पूजा हेतु',
    forVrat: 'व्रत हेतु',
    custom: 'अन्य',
    selectPuja: 'पूजा चुनें',
    vratName: 'व्रत का नाम',
    vratPlaceholder: 'जैसे एकादशी व्रत',
    customPurpose: 'प्रयोजन',
    customPlaceholder: 'जैसे परिवार के कल्याण हेतु',
    generate: 'संकल्प बनाएं',
    generating: 'पंचांग गणना हो रही है...',
    result: 'आपका संकल्प',
    iast: 'IAST लिप्यन्तरण',
    meaning: 'अंग्रेजी अर्थ',
    components: 'पंचांग तत्त्व',
    copied: 'कॉपी हुआ!',
    copy: 'संकल्प कॉपी करें',
    print: 'प्रिंट',
    vikramSamvat: 'विक्रम संवत',
    samvatsara: 'संवत्सर',
    ayana: 'अयन',
    ritu: 'ऋतु',
    masa: 'मास',
    paksha: 'पक्ष',
    tithi: 'तिथि',
    vara: 'वार',
    nakshatra: 'नक्षत्र',
    desha: 'देश',
    kartaa: 'कर्ता',
    purposeLabel: 'प्रयोजन',
  },
  sa: {
    title: 'सङ्कल्पजनकम्',
    subtitle: 'पूजाव्रतार्थं पवित्रसङ्कल्पः',
    desc: 'स्वपूजायै व्रताय वा पवित्रसङ्कल्पार्थं सम्यक् पञ्चाङ्गतत्त्वैः सह व्यक्तिगतसङ्कल्पवाक्यं रचयतु।',
    fullName: 'सम्पूर्णनाम',
    fullNamePlaceholder: 'स्वनाम लिखतु',
    gotra: 'गोत्रम्',
    gotraPlaceholder: 'गोत्रं चिनुत',
    place: 'स्थानम्',
    date: 'दिनाङ्कः',
    purpose: 'प्रयोजनम्',
    forPuja: 'पूजार्थम्',
    forVrat: 'व्रतार्थम्',
    custom: 'अन्यत्',
    selectPuja: 'पूजां चिनुत',
    vratName: 'व्रतनाम',
    vratPlaceholder: 'यथा एकादशीव्रतम्',
    customPurpose: 'प्रयोजनम्',
    customPlaceholder: 'यथा कुटुम्बकल्याणार्थम्',
    generate: 'सङ्कल्पं रचयतु',
    generating: 'पञ्चाङ्गगणना प्रवर्तते...',
    result: 'भवतः सङ्कल्पः',
    iast: 'IAST लिप्यन्तरणम्',
    meaning: 'आङ्ग्लार्थः',
    components: 'पञ्चाङ्गतत्त्वानि',
    copied: 'प्रतिलिपितम्!',
    copy: 'सङ्कल्पं प्रतिलिपिकुरुत',
    print: 'मुद्रणम्',
    vikramSamvat: 'विक्रमसंवत्',
    samvatsara: 'संवत्सरः',
    ayana: 'अयनम्',
    ritu: 'ऋतुः',
    masa: 'मासः',
    paksha: 'पक्षः',
    tithi: 'तिथिः',
    vara: 'वासरः',
    nakshatra: 'नक्षत्रम्',
    desha: 'देशः',
    kartaa: 'कर्ता',
    purposeLabel: 'प्रयोजनम्',
  },
  ta: {
    title: 'சங்கல்ப ஜெனரேட்டர்',
    subtitle: 'பூஜை & விரதத்திற்கான புனித சங்கல்பம்',
    desc: 'உங்கள் பூஜை, விரதம் அல்லது புனித நோக்கத்திற்கான துல்லியமான பஞ்சாங்க கூறுகளுடன் தனிப்பட்ட சங்கல்ப அறிவிப்பை உருவாக்கவும்.',
    fullName: 'முழு பெயர்',
    fullNamePlaceholder: 'உங்கள் பெயரை உள்ளிடவும்',
    gotra: 'கோத்ரம்',
    gotraPlaceholder: 'கோத்ரம் தேர்ந்தெடுக்கவும்',
    place: 'இடம்',
    date: 'தேதி',
    purpose: 'நோக்கம்',
    forPuja: 'பூஜைக்காக',
    forVrat: 'விரதத்திற்காக',
    custom: 'தனிப்பயன்',
    selectPuja: 'பூஜையைத் தேர்ந்தெடுக்கவும்',
    vratName: 'விரதம் பெயர்',
    vratPlaceholder: 'எ.கா. ஏகாதசி விரதம்',
    customPurpose: 'நோக்கம்',
    customPlaceholder: 'எ.கா. என் குடும்பத்தின் நலனுக்காக',
    generate: 'சங்கல்பம் உருவாக்கவும்',
    generating: 'பஞ்சாங்கம் கணக்கிடப்படுகிறது...',
    result: 'உங்கள் சங்கல்பம்',
    iast: 'IAST எழுத்துப்பெயர்ப்பு',
    meaning: 'ஆங்கில பொருள்',
    components: 'பஞ்சாங்க கூறுகள்',
    copied: 'நகலெடுக்கப்பட்டது!',
    copy: 'சங்கல்பம் நகலெடுக்கவும்',
    print: 'அச்சிடு',
    vikramSamvat: 'விக்ரம சம்வத்',
    samvatsara: 'சம்வத்சரம்',
    ayana: 'அயனம்',
    ritu: 'ருது',
    masa: 'மாசம்',
    paksha: 'பக்ஷம்',
    tithi: 'திதி',
    vara: 'வாரம்',
    nakshatra: 'நட்சத்திரம்',
    desha: 'தேசம்',
    kartaa: 'கர்த்தா',
    purposeLabel: 'நோக்கம்',
  },
  te: {
    title: 'సంకల్ప జనరేటర్',
    subtitle: 'పూజ & వ్రతం కోసం పవిత్ర సంకల్పం',
    desc: 'మీ పూజ, వ్రతం లేదా పవిత్ర ఉద్దేశం కోసం ఖచ్చితమైన పంచాంగ అంశాలతో వ్యక్తిగత సంకల్ప ప్రకటన రూపొందించండి.',
    fullName: 'పూర్తి పేరు', fullNamePlaceholder: 'మీ పేరు నమోదు చేయండి',
    gotra: 'గోత్రం', gotraPlaceholder: 'గోత్రం ఎంచుకోండి',
    place: 'ప్రదేశం', date: 'తేదీ', purpose: 'ప్రయోజనం',
    forPuja: 'పూజ కోసం', forVrat: 'వ్రతం కోసం', custom: 'ఇతర',
    selectPuja: 'పూజ ఎంచుకోండి', vratName: 'వ్రతం పేరు',
    vratPlaceholder: 'ఉదా. ఏకాదశి వ్రతం',
    customPurpose: 'ప్రయోజనం', customPlaceholder: 'ఉదా. నా కుటుంబ శ్రేయస్సు కోసం',
    generate: 'సంకల్పం రూపొందించు', generating: 'పంచాంగం గణించబడుతోంది...',
    result: 'మీ సంకల్పం', iast: 'IAST లిప్యంతరణ', meaning: 'ఆంగ్ల అర్థం',
    components: 'పంచాంగ అంశాలు', copied: 'కాపీ అయింది!', copy: 'సంకల్పం కాపీ చేయి',
    print: 'ప్రింట్', vikramSamvat: 'విక్రమ సంవత్',
    samvatsara: 'సంవత్సరం', ayana: 'అయనం', ritu: 'ఋతువు',
    masa: 'మాసం', paksha: 'పక్షం', tithi: 'తిథి',
    vara: 'వారం', nakshatra: 'నక్షత్రం', desha: 'దేశం',
    kartaa: 'కర్త', purposeLabel: 'ప్రయోజనం',
  },
  bn: {
    title: 'সংকল্প জেনারেটর',
    subtitle: 'পূজা ও ব্রতের জন্য পবিত্র সংকল্প',
    desc: 'আপনার পূজা, ব্রত বা পবিত্র উদ্দেশ্যের জন্য সঠিক পঞ্চাঙ্গ উপাদান সহ ব্যক্তিগত সংকল্প ঘোষণা তৈরি করুন।',
    fullName: 'পূর্ণ নাম', fullNamePlaceholder: 'আপনার নাম লিখুন',
    gotra: 'গোত্র', gotraPlaceholder: 'গোত্র নির্বাচন করুন',
    place: 'স্থান', date: 'তারিখ', purpose: 'উদ্দেশ্য',
    forPuja: 'পূজার জন্য', forVrat: 'ব্রতের জন্য', custom: 'অন্যান্য',
    selectPuja: 'পূজা নির্বাচন করুন', vratName: 'ব্রতের নাম',
    vratPlaceholder: 'যেমন একাদশী ব্রত',
    customPurpose: 'উদ্দেশ্য', customPlaceholder: 'যেমন আমার পরিবারের মঙ্গলের জন্য',
    generate: 'সংকল্প তৈরি করুন', generating: 'পঞ্চাঙ্গ গণনা হচ্ছে...',
    result: 'আপনার সংকল্প', iast: 'IAST প্রতিবর্ণীকরণ', meaning: 'ইংরেজি অর্থ',
    components: 'পঞ্চাঙ্গ উপাদান', copied: 'কপি হয়েছে!', copy: 'সংকল্প কপি করুন',
    print: 'প্রিন্ট', vikramSamvat: 'বিক্রম সম্বৎ',
    samvatsara: 'সংবৎসর', ayana: 'অয়ন', ritu: 'ঋতু',
    masa: 'মাস', paksha: 'পক্ষ', tithi: 'তিথি',
    vara: 'বার', nakshatra: 'নক্ষত্র', desha: 'দেশ',
    kartaa: 'কর্তা', purposeLabel: 'উদ্দেশ্য',
  },
  kn: {
    title: 'ಸಂಕಲ್ಪ ಜನರೇಟರ್',
    subtitle: 'ಪೂಜೆ & ವ್ರತಕ್ಕಾಗಿ ಪವಿತ್ರ ಸಂಕಲ್ಪ',
    desc: 'ನಿಮ್ಮ ಪೂಜೆ, ವ್ರತ ಅಥವಾ ಪವಿತ್ರ ಉದ್ದೇಶಕ್ಕಾಗಿ ನಿಖರವಾದ ಪಂಚಾಂಗ ಅಂಶಗಳೊಂದಿಗೆ ವೈಯಕ್ತಿಕ ಸಂಕಲ್ಪ ಘೋಷಣೆ ರಚಿಸಿ.',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು', fullNamePlaceholder: 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    gotra: 'ಗೋತ್ರ', gotraPlaceholder: 'ಗೋತ್ರ ಆಯ್ಕೆ ಮಾಡಿ',
    place: 'ಸ್ಥಳ', date: 'ದಿನಾಂಕ', purpose: 'ಉದ್ದೇಶ',
    forPuja: 'ಪೂಜೆಗಾಗಿ', forVrat: 'ವ್ರತಕ್ಕಾಗಿ', custom: 'ಇತರ',
    selectPuja: 'ಪೂಜೆ ಆಯ್ಕೆ ಮಾಡಿ', vratName: 'ವ್ರತ ಹೆಸರು',
    vratPlaceholder: 'ಉದಾ. ಏಕಾದಶಿ ವ್ರತ',
    customPurpose: 'ಉದ್ದೇಶ', customPlaceholder: 'ಉದಾ. ನನ್ನ ಕುಟುಂಬದ ಕ್ಷೇಮಕ್ಕಾಗಿ',
    generate: 'ಸಂಕಲ್ಪ ರಚಿಸಿ', generating: 'ಪಂಚಾಂಗ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತಿದೆ...',
    result: 'ನಿಮ್ಮ ಸಂಕಲ್ಪ', iast: 'IAST ಲಿಪ್ಯಂತರಣ', meaning: 'ಇಂಗ್ಲಿಷ್ ಅರ್ಥ',
    components: 'ಪಂಚಾಂಗ ಅಂಶಗಳು', copied: 'ನಕಲಾಗಿದೆ!', copy: 'ಸಂಕಲ್ಪ ನಕಲಿಸಿ',
    print: 'ಮುದ್ರಿಸಿ', vikramSamvat: 'ವಿಕ್ರಮ ಸಂವತ್',
    samvatsara: 'ಸಂವತ್ಸರ', ayana: 'ಅಯನ', ritu: 'ಋತು',
    masa: 'ಮಾಸ', paksha: 'ಪಕ್ಷ', tithi: 'ತಿಥಿ',
    vara: 'ವಾರ', nakshatra: 'ನಕ್ಷತ್ರ', desha: 'ದೇಶ',
    kartaa: 'ಕರ್ತಾ', purposeLabel: 'ಉದ್ದೇಶ',
  },
  mr: {
    title: 'संकल्प जनक', subtitle: 'पूजा आणि व्रतासाठी पवित्र संकल्प',
    desc: 'आपल्या पूजा, व्रत किंवा पवित्र संकल्पासाठी अचूक पंचांग तत्वांसह वैयक्तिक संकल्प वाक्य बनवा.',
    fullName: 'पूर्ण नाव', fullNamePlaceholder: 'आपले नाव लिहा',
    gotra: 'गोत्र', gotraPlaceholder: 'गोत्र निवडा',
    place: 'स्थान', date: 'तारीख', purpose: 'प्रयोजन',
    forPuja: 'पूजेसाठी', forVrat: 'व्रतासाठी', custom: 'इतर',
    selectPuja: 'पूजा निवडा', vratName: 'व्रताचे नाव',
    vratPlaceholder: 'उदा. एकादशी व्रत',
    customPurpose: 'प्रयोजन', customPlaceholder: 'उदा. कुटुंबाच्या कल्याणासाठी',
    generate: 'संकल्प बनवा', generating: 'पंचांग गणना होत आहे...',
    result: 'आपला संकल्प', iast: 'IAST लिप्यंतरण', meaning: 'इंग्रजी अर्थ',
    components: 'पंचांग तत्वे', copied: 'कॉपी झाले!', copy: 'संकल्प कॉपी करा',
    print: 'प्रिंट', vikramSamvat: 'विक्रम संवत',
    samvatsara: 'संवत्सर', ayana: 'अयन', ritu: 'ऋतू',
    masa: 'मास', paksha: 'पक्ष', tithi: 'तिथी',
    vara: 'वार', nakshatra: 'नक्षत्र', desha: 'देश',
    kartaa: 'कर्ता', purposeLabel: 'प्रयोजन',
  },
  gu: {
    title: 'સંકલ્પ જનરેટર', subtitle: 'પૂજા અને વ્રત માટે પવિત્ર સંકલ્પ',
    desc: 'તમારી પૂજા, વ્રત અથવા પવિત્ર ઉદ્દેશ્ય માટે ચોક્કસ પંચાંગ તત્વો સાથે વ્યક્તિગત સંકલ્પ ઘોષણા બનાવો.',
    fullName: 'પૂરું નામ', fullNamePlaceholder: 'તમારું નામ દાખલ કરો',
    gotra: 'ગોત્ર', gotraPlaceholder: 'ગોત્ર પસંદ કરો',
    place: 'સ્થળ', date: 'તારીખ', purpose: 'હેતુ',
    forPuja: 'પૂજા માટે', forVrat: 'વ્રત માટે', custom: 'અન્ય',
    selectPuja: 'પૂજા પસંદ કરો', vratName: 'વ્રત નામ',
    vratPlaceholder: 'દા.ત. એકાદશી વ્રત',
    customPurpose: 'હેતુ', customPlaceholder: 'દા.ત. મારા કુટુંબના કલ્યાણ માટે',
    generate: 'સંકલ્પ બનાવો', generating: 'પંચાંગ ગણતરી થઈ રહી છે...',
    result: 'તમારો સંકલ્પ', iast: 'IAST લિપ્યંતરણ', meaning: 'અંગ્રેજી અર્થ',
    components: 'પંચાંગ તત્વો', copied: 'કૉપી થયું!', copy: 'સંકલ્પ કૉપી કરો',
    print: 'પ્રિન્ટ', vikramSamvat: 'વિક્રમ સંવત',
    samvatsara: 'સંવત્સર', ayana: 'અયન', ritu: 'ઋતુ',
    masa: 'માસ', paksha: 'પક્ષ', tithi: 'તિથિ',
    vara: 'વાર', nakshatra: 'નક્ષત્ર', desha: 'દેશ',
    kartaa: 'કર્તા', purposeLabel: 'હેતુ',
  },
  mai: {
    title: 'संकल्प जनक', subtitle: 'पूजा आ व्रतक लेल पवित्र संकल्प',
    desc: 'अपन पूजा, व्रत या पवित्र संकल्पक लेल सटीक पंचांग तत्वक संग व्यक्तिगत संकल्प वाक्य बनाउ.',
    fullName: 'पूरा नाम', fullNamePlaceholder: 'अपन नाम लिखू',
    gotra: 'गोत्र', gotraPlaceholder: 'गोत्र चुनू',
    place: 'स्थान', date: 'तिथि', purpose: 'प्रयोजन',
    forPuja: 'पूजाक लेल', forVrat: 'व्रतक लेल', custom: 'अन्य',
    selectPuja: 'पूजा चुनू', vratName: 'व्रतक नाम',
    vratPlaceholder: 'जेना एकादशी व्रत',
    customPurpose: 'प्रयोजन', customPlaceholder: 'जेना परिवारक कल्याणक लेल',
    generate: 'संकल्प बनाउ', generating: 'पंचांग गणना भऽ रहल अछि...',
    result: 'अहाँक संकल्प', iast: 'IAST लिप्यंतरण', meaning: 'अंग्रेजी अर्थ',
    components: 'पंचांग तत्व', copied: 'कॉपी भेल!', copy: 'संकल्प कॉपी करू',
    print: 'प्रिंट', vikramSamvat: 'विक्रम संवत',
    samvatsara: 'संवत्सर', ayana: 'अयन', ritu: 'ऋतु',
    masa: 'मास', paksha: 'पक्ष', tithi: 'तिथि',
    vara: 'वार', nakshatra: 'नक्षत्र', desha: 'देश',
    kartaa: 'कर्ता', purposeLabel: 'प्रयोजन',
  },
} as Record<string, Record<string, string>>;

const GOTRAS = [
  // Saptarishi (7 primary)
  { en: 'Atri', sa: 'अत्रि' },
  { en: 'Bharadwaj', sa: 'भारद्वाज' },
  { en: 'Gautam', sa: 'गौतम' },
  { en: 'Jamadagni', sa: 'जमदग्नि' },
  { en: 'Kashyap', sa: 'कश्यप' },
  { en: 'Vasishtha', sa: 'वशिष्ठ' },
  { en: 'Vishwamitra', sa: 'विश्वामित्र' },
  // Other major gotras (alphabetical)
  { en: 'Agastya', sa: 'अगस्त्य' },
  { en: 'Angiras', sa: 'अंगिरस' },
  { en: 'Baijavap', sa: 'बैजवाप' },
  { en: 'Bandhu', sa: 'बन्धु' },
  { en: 'Bhargava', sa: 'भार्गव' },
  { en: 'Bhrigu', sa: 'भृगु' },
  { en: 'Chandilya', sa: 'चान्दिल्य' },
  { en: 'Dhananjaya', sa: 'धनञ्जय' },
  { en: 'Garga', sa: 'गर्ग' },
  { en: 'Harita', sa: 'हारीत' },
  { en: 'Kanva', sa: 'काण्व' },
  { en: 'Katyayan', sa: 'कात्यायन' },
  { en: 'Kaundinya', sa: 'कौण्डिन्य' },
  { en: 'Kaushik', sa: 'कौशिक' },
  { en: 'Kutsa', sa: 'कुत्स' },
  { en: 'Mandavya', sa: 'माण्डव्य' },
  { en: 'Maudgalya', sa: 'मौद्गल्य' },
  { en: 'Mudgal', sa: 'मुद्गल' },
  { en: 'Naidhruva', sa: 'नैधृव' },
  { en: 'Parashara', sa: 'पराशर' },
  { en: 'Sandilya', sa: 'शाण्डिल्य' },
  { en: 'Sankritya', sa: 'सांकृत्य' },
  { en: 'Savarni', sa: 'सावर्णि' },
  { en: 'Shaunaka', sa: 'शौनक' },
  { en: 'Srivatsa', sa: 'श्रीवत्स' },
  { en: 'Upamanyu', sa: 'उपमन्यु' },
  { en: 'Vatsa', sa: 'वत्स' },
  { en: 'Vatsya', sa: 'वात्स्य' },
  { en: 'Vishnu', sa: 'विष्णु' },
  { en: 'Yaska', sa: 'यास्क' },
];

type PurposeTab = 'puja' | 'vrat' | 'custom';

/* ── Puja options from PUJA_VIDHIS ──────────────────────────── */

const PUJA_OPTIONS = Object.entries(PUJA_VIDHIS).map(([slug, puja]) => ({
  slug,
  label: puja.deity,
}));

/* ── Component badge labels ─────────────────────────────────── */

const COMPONENT_KEYS: { key: string; componentKey: keyof SankalpaResult['components']; colorClass: string }[] = [
  { key: 'samvatsara', componentKey: 'samvatsara', colorClass: 'bg-amber-500/15 border-amber-500/25 text-amber-300' },
  { key: 'ayana', componentKey: 'ayana', colorClass: 'bg-sky-500/15 border-sky-500/25 text-sky-300' },
  { key: 'ritu', componentKey: 'ritu', colorClass: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300' },
  { key: 'masa', componentKey: 'masa', colorClass: 'bg-violet-500/15 border-violet-500/25 text-violet-300' },
  { key: 'paksha', componentKey: 'paksha', colorClass: 'bg-rose-500/15 border-rose-500/25 text-rose-300' },
  { key: 'tithi', componentKey: 'tithi', colorClass: 'bg-orange-500/15 border-orange-500/25 text-orange-300' },
  { key: 'vara', componentKey: 'vara', colorClass: 'bg-cyan-500/15 border-cyan-500/25 text-cyan-300' },
  { key: 'nakshatra', componentKey: 'nakshatra', colorClass: 'bg-fuchsia-500/15 border-fuchsia-500/25 text-fuchsia-300' },
  { key: 'desha', componentKey: 'desha', colorClass: 'bg-teal-500/15 border-teal-500/25 text-teal-300' },
  { key: 'kartaa', componentKey: 'kartaa', colorClass: 'bg-gold-primary/15 border-gold-primary/25 text-gold-light' },
  { key: 'purposeLabel', componentKey: 'purpose', colorClass: 'bg-indigo-500/15 border-indigo-500/25 text-indigo-300' },
];

/* ── Main Page ──────────────────────────────────────────────── */

export default function SankalpaPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const t = (LABELS as Record<string, Record<string, string>>)[locale] || LABELS.en;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const locationStore = useLocationStore();
  const authStore = useAuthStore();
  const searchParams = useSearchParams();

  // Pre-fill puja from URL param (e.g., /sankalpa?puja=Diwali)
  const pujaParam = searchParams.get('puja') || '';

  // Pre-fill name from logged-in user
  const userName = authStore.user?.user_metadata?.full_name
    || authStore.user?.user_metadata?.name
    || '';

  // Form state
  const [fullName, setFullName] = useState(userName);
  const [gotra, setGotra] = useState('');
  const [gotraInput, setGotraInput] = useState('');
  const [showGotraDropdown, setShowGotraDropdown] = useState(false);
  const [placeName, setPlaceName] = useState(locationStore.name || '');
  const [placeLat, setPlaceLat] = useState<number | null>(locationStore.lat);
  const [placeLng, setPlaceLng] = useState<number | null>(locationStore.lng);
  const [placeTimezone, setPlaceTimezone] = useState<string | null>(locationStore.timezone);
  const [dateStr, setDateStr] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [masaSystem, setMasaSystem] = useState<'purnimant' | 'amant'>('purnimant');
  const [purposeTab, setPurposeTab] = useState<PurposeTab>('puja');
  const [selectedPuja, setSelectedPuja] = useState('');
  const [vratName, setVratName] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');

  // Pre-fill name when auth loads
  useEffect(() => {
    if (!fullName && userName) setFullName(userName);
  }, [userName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-fill from URL param
  useEffect(() => {
    if (pujaParam) {
      setPurposeTab('puja');
      // Try to match a puja slug by deity name
      const matchedPuja = PUJA_OPTIONS.find(p =>
        p.label.en.toLowerCase().includes(pujaParam.toLowerCase()) ||
        p.label.hi!.includes(pujaParam)
      );
      if (matchedPuja) {
        setSelectedPuja(matchedPuja.slug);
      } else {
        // Fall back to custom with the puja name
        setPurposeTab('custom');
        setCustomPurpose(pujaParam);
      }
    }
  }, [pujaParam]);

  // Result state
  const [result, setResult] = useState<SankalpaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const gotraRef = useRef<HTMLDivElement>(null);

  // Derive the purpose text
  const getPurposeText = (): string => {
    if (purposeTab === 'puja' && selectedPuja) {
      const puja = PUJA_VIDHIS[selectedPuja];
      return puja ? puja.deity.sa || "" : '';
    }
    if (purposeTab === 'vrat') return vratName;
    return customPurpose;
  };

  const canSubmit = placeLat !== null && placeLng !== null && getPurposeText().trim().length > 0;

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/sankalpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          gotra: gotra || gotraInput,
          lat: placeLat,
          lng: placeLng,
          timezone: placeTimezone || undefined,
          placeName: placeName || undefined,
          date: dateStr,
          purposeType: purposeTab,
          purposeText: getPurposeText(),
          pujaSlug: purposeTab === 'puja' ? selectedPuja : undefined,
          masaSystem,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate sankalpa');
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.devanagari);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handlePrint = () => {
    if (!result) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>Sankalpa</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Sanskrit&display=swap');
        body { font-family: 'Tiro Devanagari Sanskrit', serif; max-width: 700px; margin: 40px auto; padding: 20px; text-align: center; color: #1a1a1a; }
        .sankalpa { font-size: 22px; line-height: 2; white-space: pre-line; margin: 30px 0; padding: 30px; border: 2px solid #b8860b; border-radius: 12px; }
        .iast { font-style: italic; color: #666; font-size: 14px; margin: 20px 0; }
        .date { font-size: 12px; color: #999; margin-top: 30px; }
        h1 { color: #b8860b; font-size: 28px; }
        .om { font-size: 48px; color: #b8860b; margin-bottom: 10px; }
      </style></head><body>
      <div class="om">\u0950</div>
      <h1>Sankalpa</h1>
      <div class="sankalpa">${result.devanagari}</div>
      <div class="iast">${result.iast}</div>
      <div class="date">${result.panchangDate} | Vikram Samvat ${result.vikramSamvat}</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Gotra filtering
  const filteredGotras = gotraInput.length > 0
    ? GOTRAS.filter(g =>
        g.en.toLowerCase().includes(gotraInput.toLowerCase()) ||
        g.sa.includes(gotraInput)
      )
    : GOTRAS;

  const inputCls = 'w-full bg-bg-primary/60 border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/20 transition-all placeholder:text-text-secondary/55';
  const labelCls = 'text-text-secondary text-xs uppercase tracking-wider mb-1.5 block';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Header ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-primary/10 border border-gold-primary/20 mb-6">
          <ScrollText className="w-10 h-10 text-gold-primary" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t.title}</span>
        </h1>
        <p className="text-gold-primary/70 text-lg mb-2" style={bodyFont}>{t.subtitle}</p>
        <p className="text-text-secondary text-sm max-w-2xl mx-auto" style={bodyFont}>{t.desc}</p>
      </motion.div>

      {/* ── Form Card ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 sm:p-8 mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <label className="block">
            <span className={labelCls} style={bodyFont}>{t.fullName}</span>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              className={inputCls}
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            />
          </label>

          {/* Gotra with dropdown */}
          <div className="block relative" ref={gotraRef}>
            <span className={labelCls} style={bodyFont}>{t.gotra}</span>
            <input
              type="text"
              value={gotra || gotraInput}
              onChange={e => {
                setGotraInput(e.target.value);
                setGotra('');
                setShowGotraDropdown(true);
              }}
              onFocus={() => setShowGotraDropdown(true)}
              onBlur={() => setTimeout(() => setShowGotraDropdown(false), 200)}
              placeholder={t.gotraPlaceholder}
              className={inputCls}
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            />
            <AnimatePresence>
              {showGotraDropdown && filteredGotras.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-30 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-gold-primary/20 bg-[#0d1230]/95 backdrop-blur-lg shadow-2xl"
                >
                  {filteredGotras.map(g => (
                    <button
                      key={g.en}
                      type="button"
                      onMouseDown={e => {
                        e.preventDefault();
                        setGotra(g.sa);
                        setGotraInput('');
                        setShowGotraDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gold-primary/10 transition-colors flex items-center justify-between"
                    >
                      <span className="text-gold-light" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{g.sa}</span>
                      <span className="text-text-secondary/70 text-xs">{g.en}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Place */}
          <label className="block">
            <span className={labelCls} style={bodyFont}>{t.place}</span>
            <LocationSearch
              value={placeName}
              onSelect={(loc) => {
                setPlaceName(loc.name);
                setPlaceLat(loc.lat);
                setPlaceLng(loc.lng);
                setPlaceTimezone(loc.timezone);
              }}
              placeholder={tl({ en: 'Search city or place...', hi: 'स्थान खोजें...', sa: 'नगरं वा स्थानं मृगयतु...', ta: 'நகரம் அல்லது இடம் தேடு...', te: 'నగరం లేదా ప్రదేశం శోధించండి...', bn: 'শহর বা স্থান খুঁজুন...', kn: 'ನಗರ ಅಥವಾ ಸ್ಥಳ ಹುಡುಕಿ...', gu: 'શહેર અથવા સ્થળ શોધો...', mai: 'शहर या स्थान खोजू...', mr: 'शहर किंवा ठिकाण शोधा...' }, locale)}
            />
          </label>

          {/* Date */}
          <label className="block">
            <span className={labelCls} style={bodyFont}>{t.date}</span>
            <input
              type="date"
              value={dateStr}
              onChange={e => setDateStr(e.target.value)}
              className={inputCls}
            />
          </label>

          {/* Masa System Toggle */}
          <div>
            <span className={labelCls} style={bodyFont}>
              {tl({ en: 'Calendar System', hi: 'पंचांग पद्धति', sa: 'पञ्चाङ्ग-पद्धतिः', ta: 'பஞ்சாங்க முறை', te: 'పంచాంగ పద్ధతి', bn: 'পঞ্চাঙ্গ পদ্ধতি', kn: 'ಪಂಚಾಂಗ ಪದ್ಧತಿ', gu: 'પંચાંગ પ્રણાલી', mai: 'पंचांग पद्धति', mr: 'पंचांग पद्धती' }, locale)}
            </span>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setMasaSystem('purnimant')}
                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  masaSystem === 'purnimant'
                    ? 'bg-gold-primary/15 border-gold-primary/40 text-gold-light'
                    : 'border-gold-primary/10 text-text-secondary hover:border-gold-primary/25'
                }`}
              >
                {tl({ en: 'Purnimant', hi: 'पूर्णिमान्त', sa: 'पूर्णिमान्तः', ta: 'பூர்ணிமாந்த்', te: 'పూర్ణిమాంత', bn: 'পূর্ণিমান্ত', kn: 'ಪೂರ್ಣಿಮಾಂತ', gu: 'પૂર્ણિમાંત', mai: 'पूर्णिमान्त', mr: 'पौर्णिमान्त' }, locale)}
                <span className="block text-xs text-text-secondary/75 mt-0.5">
                  {tl({ en: 'North India', hi: 'उत्तर भारत', sa: 'उत्तर-भारतम्', ta: 'வட இந்தியா', te: 'ఉత్తర భారతదేశం', bn: 'উত্তর ভারত', kn: 'ಉತ್ತರ ಭಾರತ', gu: 'ઉત્તર ભારત', mai: 'उत्तर भारत', mr: 'उत्तर भारत' }, locale)}
                </span>
              </button>
              <button
                onClick={() => setMasaSystem('amant')}
                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  masaSystem === 'amant'
                    ? 'bg-gold-primary/15 border-gold-primary/40 text-gold-light'
                    : 'border-gold-primary/10 text-text-secondary hover:border-gold-primary/25'
                }`}
              >
                {tl({ en: 'Amant', hi: 'अमान्त', sa: 'अमान्तः', ta: 'அமாந்த்', te: 'అమాంత', bn: 'অমান্ত', kn: 'ಅಮಾಂತ', gu: 'અમાંત', mai: 'अमान्त', mr: 'अमांत' }, locale)}
                <span className="block text-xs text-text-secondary/75 mt-0.5">
                  {tl({ en: 'South India', hi: 'दक्षिण भारत', sa: 'दक्षिण-भारतम्', ta: 'தென் இந்தியா', te: 'దక్షిణ భారతదేశం', bn: 'দক্ষিণ ভারত', kn: 'ದಕ್ಷಿಣ ಭಾರತ', gu: 'દક્ષિણ ભારત', mai: 'दक्षिण भारत', mr: 'दक्षिण भारत' }, locale)}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Purpose Tabs ──────────────────────────────────────── */}
        <div className="mt-8">
          <span className={`${labelCls} mb-3`} style={bodyFont}>{t.purpose}</span>
          <div className="flex gap-2 mb-4">
            {(['puja', 'vrat', 'custom'] as PurposeTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setPurposeTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  purposeTab === tab
                    ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30 shadow-lg shadow-gold-primary/5'
                    : 'text-text-secondary/75 hover:text-text-secondary border border-transparent hover:border-gold-primary/10'
                }`}
                style={bodyFont}
              >
                {tab === 'puja' ? t.forPuja : tab === 'vrat' ? t.forVrat : t.custom}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {purposeTab === 'puja' && (
              <motion.div
                key="puja"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <select
                  value={selectedPuja}
                  onChange={e => setSelectedPuja(e.target.value)}
                  className={`${inputCls} appearance-none cursor-pointer`}
                  style={{ fontFamily: 'var(--font-devanagari-body)' }}
                >
                  <option value="" className="bg-[#0a0e27]">{t.selectPuja}</option>
                  {PUJA_OPTIONS.map(p => (
                    <option key={p.slug} value={p.slug} className="bg-[#0a0e27]">
                      {tl(p.label, locale)} ({p.label.en})
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            {purposeTab === 'vrat' && (
              <motion.div
                key="vrat"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <input
                  type="text"
                  value={vratName}
                  onChange={e => setVratName(e.target.value)}
                  placeholder={t.vratPlaceholder}
                  className={inputCls}
                  style={{ fontFamily: 'var(--font-devanagari-body)' }}
                />
              </motion.div>
            )}

            {purposeTab === 'custom' && (
              <motion.div
                key="custom"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <input
                  type="text"
                  value={customPurpose}
                  onChange={e => setCustomPurpose(e.target.value)}
                  placeholder={t.customPlaceholder}
                  className={inputCls}
                  style={{ fontFamily: 'var(--font-devanagari-body)' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Generate Button ───────────────────────────────────── */}
        <div className="text-center mt-8">
          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}
          <motion.button
            onClick={handleGenerate}
            disabled={loading || !canSubmit}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-12 py-4 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-light text-lg font-bold hover:bg-gold-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-3"
            style={headingFont}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' as const }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                {t.generating}
              </>
            ) : (
              <>
                <ScrollText className="w-5 h-5" />
                {t.generate}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Result ────────────────────────────────────────────── */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
            className="space-y-6"
          >
            <GoldDivider />

            {/* Vikram Samvat badge */}
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-gold-primary/10 border border-gold-primary/20 text-gold-primary/80">
                {t.vikramSamvat} {result.vikramSamvat}
              </span>
            </div>

            {/* Main Sankalpa Text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
            >
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold-primary/20 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold-primary/20 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold-primary/20 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold-primary/20 rounded-br-2xl" />

              <h2 className="text-gold-primary text-sm uppercase tracking-[0.2em] mb-8 font-bold" style={bodyFont}>
                {t.result}
              </h2>

              {/* Devanagari Sankalpa */}
              <p
                className="text-gold-light text-xl sm:text-2xl leading-loose whitespace-pre-line"
                style={{ fontFamily: 'var(--font-devanagari-heading)', letterSpacing: '0.02em' }}
              >
                {result.devanagari}
              </p>

              {/* IAST */}
              <div className="mt-8 pt-6 border-t border-gold-primary/10">
                <p className="text-text-secondary/70 text-xs uppercase tracking-wider mb-2">{t.iast}</p>
                <p className="text-text-secondary/70 text-sm italic leading-relaxed">
                  {result.iast}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 mt-8">
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gold-primary/15 hover:bg-gold-primary/25 border border-gold-primary/20 text-gold-light transition-all"
                  style={bodyFont}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? t.copied : t.copy}
                </motion.button>
                <motion.button
                  onClick={handlePrint}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-text-primary transition-all"
                >
                  <Printer className="w-4 h-4" />
                  {t.print}
                </motion.button>
              </div>
            </motion.div>

            {/* English Meaning (Accordion) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setShowMeaning(!showMeaning)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gold-primary/5 transition-colors"
              >
                <span className="text-gold-primary text-sm uppercase tracking-wider font-bold" style={bodyFont}>
                  {t.meaning}
                </span>
                <ChevronDown className={`w-4 h-4 text-gold-primary/60 transition-transform duration-300 ${showMeaning ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showMeaning && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' as const }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-text-secondary/80 text-sm leading-relaxed">
                      {result.english}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Component Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6"
            >
              <h3 className="text-gold-primary text-sm uppercase tracking-wider font-bold mb-5" style={bodyFont}>
                {t.components}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {COMPONENT_KEYS.map(({ key, componentKey, colorClass }, idx) => {
                  const label = (t as Record<string, string>)[key] || key;
                  const value = result.components[componentKey];
                  if (!value) return null;
                  return (
                    <motion.span
                      key={key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + idx * 0.04 }}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs border ${colorClass}`}
                    >
                      <span className="opacity-60 text-xs uppercase tracking-wider">{label}</span>
                      <span
                        className="font-semibold"
                        style={{ fontFamily: 'var(--font-devanagari-body)' }}
                      >
                        {value}
                      </span>
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
