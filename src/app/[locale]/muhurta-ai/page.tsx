'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { parseGateError, type GateError } from '@/lib/api/parse-gate-error';
import UsageLimitBanner from '@/components/ui/UsageLimitBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2 } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LocationSearch from '@/components/ui/LocationSearch';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { useBirthDataStore } from '@/stores/birth-data-store';
import type { Locale, LocaleText } from '@/types/panchang';
import type { MuhurtaAIResult, ExtendedActivityId } from '@/types/muhurta-ai';
import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import MSG from '@/messages/pages/muhurta-ai.json';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

const ACTIVITY_LIST: { id: ExtendedActivityId; label: Record<string, string> }[] = [
  { id: 'marriage', label: { en: 'Marriage', hi: 'विवाह', sa: 'विवाहः', ta: 'திருமணம்' } },
  { id: 'griha_pravesh', label: { en: 'Griha Pravesh', hi: 'गृह प्रवेश', sa: 'गृहप्रवेशः', ta: 'கிருஹப் பிரவேசம்' } },
  { id: 'mundan', label: { en: 'Mundan', hi: 'मुण्डन', sa: 'मुण्डनम्', ta: 'சவரம்' } },
  { id: 'vehicle', label: { en: 'Vehicle', hi: 'वाहन', sa: 'वाहनम्', ta: 'வாகனம்' } },
  { id: 'travel', label: { en: 'Travel', hi: 'यात्रा', sa: 'यात्रा', ta: 'பயணம்' } },
  { id: 'property', label: { en: 'Property', hi: 'संपत्ति', sa: 'सम्पत्तिः', ta: 'சொத்து' } },
  { id: 'business', label: { en: 'Business', hi: 'व्यापार', sa: 'व्यापारः', ta: 'வணிகம்' } },
  { id: 'education', label: { en: 'Education', hi: 'शिक्षा', sa: 'शिक्षा', ta: 'கல்வி' } },
  { id: 'namakarana', label: { en: 'Naming', hi: 'नामकरण', sa: 'नामकरणम्', ta: 'நாமகரணம்' } },
  { id: 'upanayana', label: { en: 'Thread', hi: 'उपनयन', sa: 'उपनयनम्', ta: 'உபநயனம்' } },
  { id: 'engagement', label: { en: 'Engagement', hi: 'सगाई', sa: 'वाग्दानम्', ta: 'நிச்சயதார்த்தம்' } },
  { id: 'gold_purchase', label: { en: 'Gold', hi: 'स्वर्ण', sa: 'स्वर्णम्', ta: 'தங்கம்' } },
  { id: 'medical_treatment', label: { en: 'Medical', hi: 'चिकित्सा', sa: 'चिकित्सा', ta: 'மருத்துவம்' } },
  { id: 'court_case', label: { en: 'Court Case', hi: 'न्यायालय', sa: 'न्यायालयः', ta: 'நீதிமன்றம்' } },
  { id: 'exam', label: { en: 'Exam', hi: 'परीक्षा', sa: 'परीक्षा', ta: 'தேர்வு' } },
  { id: 'spiritual_practice', label: { en: 'Spiritual', hi: 'साधना', sa: 'साधना', ta: 'ஆன்மீகம்' } },
  { id: 'agriculture', label: { en: 'Agriculture', hi: 'कृषि', sa: 'कृषिः', ta: 'வேளாண்மை' } },
  { id: 'financial_signing', label: { en: 'Finance', hi: 'वित्त', sa: 'वित्तम्', ta: 'நிதி' } },
  { id: 'surgery', label: { en: 'Surgery', hi: 'शल्य', sa: 'शल्यम्', ta: 'அறுவை' } },
  { id: 'relocation', label: { en: 'Relocation', hi: 'स्थानांतर', sa: 'स्थानान्तरणम्', ta: 'இடமாற்றம்' } },
];

const L = {
  en: {
    title: 'Muhurta AI', subtitle: 'Smart Muhurat Finder',
    desc: 'Multi-factor scoring engine that ranks time windows 0-100 for any activity. Combines Panchang, transits, hora, and choghadiya.',
    step1: 'Select Activity', step2: 'Date Range & Location',
    startDate: 'Start Date', endDate: 'End Date',
    location: 'Location', detecting: 'Detecting location...', changeLocation: 'Change',
    find: 'Find Best Muhurat', finding: 'Scanning Time Windows...',
    hero: 'Top Recommendation', score: 'Score', breakdown: 'Score Breakdown',
    panchang: 'Panchang', transit: 'Transit', timing: 'Timing', personal: 'Personal',
    keyFactors: 'Key Factors', results: 'All Recommendations', date: 'Date', time: 'Time',
    noResults: 'No auspicious windows found in this range. Try extending the date range.',
  },
  hi: {
    title: 'मुहूर्त AI', subtitle: 'स्मार्ट मुहूर्त खोजक',
    desc: 'बहु-कारक स्कोरिंग इंजन जो किसी भी गतिविधि के लिए 0-100 अंक देता है। पंचांग, गोचर, होरा और चौघड़िया।',
    step1: 'गतिविधि चुनें', step2: 'तिथि सीमा और स्थान',
    startDate: 'आरम्भ तिथि', endDate: 'अन्तिम तिथि',
    location: 'स्थान', detecting: 'स्थान खोज रहे हैं...', changeLocation: 'बदलें',
    find: 'सर्वोत्तम मुहूर्त खोजें', finding: 'समय खंड स्कैन हो रहे हैं...',
    hero: 'शीर्ष सिफारिश', score: 'अंक', breakdown: 'अंक विश्लेषण',
    panchang: 'पंचांग', transit: 'गोचर', timing: 'समय', personal: 'व्यक्तिगत',
    keyFactors: 'मुख्य कारण', results: 'सभी सिफारिशें', date: 'तिथि', time: 'समय',
    noResults: 'इस अवधि में कोई शुभ समय नहीं मिला। तिथि सीमा बढ़ाएं।',
  },
  sa: {
    title: 'मुहूर्तम् AI', subtitle: 'स्मार्टमुहूर्तखोजकम्',
    desc: 'बहुकारकाङ्कनयन्त्रम् यत् कस्यापि कर्मणः 0-100 अङ्कान् ददाति।',
    step1: 'कर्म चिनुत', step2: 'तिथिसीमा स्थानं च',
    startDate: 'आरम्भतिथिः', endDate: 'अन्तिमतिथिः',
    location: 'स्थानम्', detecting: 'स्थानं खोजयति...', changeLocation: 'परिवर्तयतु',
    find: 'सर्वोत्तमं मुहूर्तं खोजयतु', finding: 'समयखण्डस्कैनम्...',
    hero: 'शीर्षसिफारिशः', score: 'अङ्कः', breakdown: 'अङ्कविश्लेषणम्',
    panchang: 'पञ्चाङ्गम्', transit: 'गोचरः', timing: 'समयः', personal: 'व्यक्तिगतम्',
    keyFactors: 'मुख्यकारणानि', results: 'सर्वसिफारिशाः', date: 'तिथिः', time: 'समयः',
    noResults: 'अस्मिन् अवधौ शुभसमयः न प्राप्तः।',
  },
  ta: {
    title: 'முகூர்த்த AI', subtitle: 'சிறந்த முகூர்த்தம் கண்டறி',
    desc: 'எந்த செயல்பாட்டிற்கும் 0-100 மதிப்பெண் அளிக்கும் பல காரணி மதிப்பீட்டு இயந்திரம். பஞ்சாங்கம், கோசாரம், ஹோரா மற்றும் சோகடியா இணைக்கப்பட்டது.',
    step1: 'செயல்பாட்டைத் தேர்ந்தெடுக்கவும்', step2: 'தேதி வரம்பு & இடம்',
    startDate: 'தொடக்க தேதி', endDate: 'முடிவு தேதி',
    location: 'இடம்', detecting: 'இடம் கண்டறிகிறது...', changeLocation: 'மாற்று',
    find: 'சிறந்த முகூர்த்தம் கண்டறி', finding: 'நேர சாளரங்களை ஸ்கேன் செய்கிறது...',
    hero: 'சிறந்த பரிந்துரை', score: 'மதிப்பெண்', breakdown: 'மதிப்பெண் பகுப்பாய்வு',
    panchang: 'பஞ்சாங்கம்', transit: 'கோசாரம்', timing: 'நேரம்', personal: 'தனிப்பட்ட',
    keyFactors: 'முக்கிய காரணிகள்', results: 'அனைத்து பரிந்துரைகள்', date: 'தேதி', time: 'நேரம்',
    noResults: 'இந்த வரம்பில் சுப நேரம் கிடைக்கவில்லை. தேதி வரம்பை நீட்டிக்கவும்.',
  },
  te: {
    title: 'ముహూర్తం AI', subtitle: 'స్మార్ట్ ముహూర్తం అన్వేషకం',
    desc: 'ఏదైనా కార్యక్రమానికి 0-100 స్కోర్ ఇచ్చే బహుళ-కారక స్కోరింగ్ ఇంజిన్. పంచాంగం, గోచారం, హోర మరియు చౌఘడియా.',
    step1: 'కార్యక్రమం ఎంచుకోండి', step2: 'తేదీ పరిధి & ప్రదేశం',
    startDate: 'ప్రారంభ తేదీ', endDate: 'ముగింపు తేదీ',
    location: 'ప్రదేశం', detecting: 'ప్రదేశం గుర్తిస్తోంది...', changeLocation: 'మార్చు',
    find: 'ఉత్తమ ముహూర్తం కనుగొను', finding: 'సమయ విండోలు స్కాన్ అవుతోంది...',
    hero: 'అగ్ర సిఫార్సు', score: 'స్కోరు', breakdown: 'స్కోరు విశ్లేషణ',
    panchang: 'పంచాంగం', transit: 'గోచారం', timing: 'సమయం', personal: 'వ్యక్తిగత',
    keyFactors: 'ముఖ్య కారకాలు', results: 'అన్ని సిఫార్సులు', date: 'తేదీ', time: 'సమయం',
    noResults: 'ఈ పరిధిలో శుభ సమయం కనుగొనబడలేదు. తేదీ పరిధిని పెంచండి.',
  },
  bn: {
    title: 'মুহূর্ত AI', subtitle: 'স্মার্ট মুহূর্ত অনুসন্ধান',
    desc: 'যেকোনো কাজের জন্য 0-100 স্কোর দেওয়ার বহু-কারক স্কোরিং ইঞ্জিন। পঞ্চাঙ্গ, গোচর, হোরা ও চৌঘড়িয়া সংযুক্ত।',
    step1: 'কর্ম বেছে নিন', step2: 'তারিখ পরিসীমা ও স্থান',
    startDate: 'শুরুর তারিখ', endDate: 'শেষ তারিখ',
    location: 'স্থান', detecting: 'স্থান সনাক্ত হচ্ছে...', changeLocation: 'পরিবর্তন',
    find: 'সর্বোত্তম মুহূর্ত খুঁজুন', finding: 'সময় উইন্ডো স্ক্যান হচ্ছে...',
    hero: 'শীর্ষ সুপারিশ', score: 'স্কোর', breakdown: 'স্কোর বিশ্লেষণ',
    panchang: 'পঞ্চাঙ্গ', transit: 'গোচর', timing: 'সময়', personal: 'ব্যক্তিগত',
    keyFactors: 'মূল কারণ', results: 'সকল সুপারিশ', date: 'তারিখ', time: 'সময়',
    noResults: 'এই পরিসরে কোনো শুভ সময় পাওয়া যায়নি। তারিখ পরিসর বাড়ান।',
  },
  kn: {
    title: 'ಮುಹೂರ್ತ AI', subtitle: 'ಸ್ಮಾರ್ಟ್ ಮುಹೂರ್ತ ಹುಡುಕಾಟ',
    desc: 'ಯಾವುದೇ ಚಟುವಟಿಕೆಗೆ 0-100 ಅಂಕ ನೀಡುವ ಬಹು-ಅಂಶ ಮೌಲ್ಯಮಾಪನ ಎಂಜಿನ್. ಪಂಚಾಂಗ, ಗೋಚಾರ, ಹೋರಾ ಮತ್ತು ಚೌಘಡಿಯಾ.',
    step1: 'ಚಟುವಟಿಕೆ ಆಯ್ಕೆಮಾಡಿ', step2: 'ದಿನಾಂಕ ಶ್ರೇಣಿ ಮತ್ತು ಸ್ಥಳ',
    startDate: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ', endDate: 'ಅಂತ್ಯ ದಿನಾಂಕ',
    location: 'ಸ್ಥಳ', detecting: 'ಸ್ಥಳ ಪತ್ತೆ ಮಾಡುತ್ತಿದೆ...', changeLocation: 'ಬದಲಾಯಿಸಿ',
    find: 'ಅತ್ಯುತ್ತಮ ಮುಹೂರ್ತ ಹುಡುಕಿ', finding: 'ಸಮಯ ವಿಂಡೋಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡುತ್ತಿದೆ...',
    hero: 'ಅಗ್ರ ಶಿಫಾರಸು', score: 'ಅಂಕ', breakdown: 'ಅಂಕ ವಿಶ್ಲೇಷಣೆ',
    panchang: 'ಪಂಚಾಂಗ', transit: 'ಗೋಚಾರ', timing: 'ಸಮಯ', personal: 'ವೈಯಕ್ತಿಕ',
    keyFactors: 'ಮುಖ್ಯ ಕಾರಣಗಳು', results: 'ಎಲ್ಲ ಶಿಫಾರಸುಗಳು', date: 'ದಿನಾಂಕ', time: 'ಸಮಯ',
    noResults: 'ಈ ಶ್ರೇಣಿಯಲ್ಲಿ ಶುಭ ಸಮಯ ಕಂಡುಬಂದಿಲ್ಲ. ದಿನಾಂಕ ಶ್ರೇಣಿಯನ್ನು ವಿಸ್ತರಿಸಿ.',
  },
  gu: {
    title: 'મુહૂર્ત AI', subtitle: 'સ્માર્ટ મુહૂર્ત શોધક',
    desc: 'કોઈપણ પ્રવૃત્તિ માટે 0-100 સ્કોર આપતું બહુ-પરિબળ સ્કોરિંગ એન્જિન. પંચાંગ, ગોચર, હોરા અને ચોઘડિયા.',
    step1: 'પ્રવૃત્તિ પસંદ કરો', step2: 'તારીખ શ્રેણી અને સ્થળ',
    startDate: 'શરૂઆતની તારીખ', endDate: 'છેલ્લી તારીખ',
    location: 'સ્થળ', detecting: 'સ્થળ શોધી રહ્યું છે...', changeLocation: 'બદલો',
    find: 'શ્રેષ્ઠ મુહૂર્ત શોધો', finding: 'સમય વિંડો સ્કેન થઈ રહી છે...',
    hero: 'શ્રેષ્ઠ ભલામણ', score: 'સ્કોર', breakdown: 'સ્કોર વિશ્લેષણ',
    panchang: 'પંચાંગ', transit: 'ગોચર', timing: 'સમય', personal: 'વ્યક્તિગત',
    keyFactors: 'મુખ્ય કારણો', results: 'બધી ભલામણો', date: 'તારીખ', time: 'સમય',
    noResults: 'આ શ્રેણીમાં શુભ સમય મળ્યો નથી. તારીખ શ્રેણી વધારો.',
  },
  mr: {
    title: 'मुहूर्त AI', subtitle: 'स्मार्ट मुहूर्त शोधक',
    desc: 'कोणत्याही कार्यासाठी 0-100 गुण देणारे बहु-घटक स्कोरिंग इंजिन. पंचांग, गोचर, होरा आणि चौघडिया.',
    step1: 'कार्य निवडा', step2: 'तारीख मर्यादा आणि स्थान',
    startDate: 'आरंभ तारीख', endDate: 'अंतिम तारीख',
    location: 'स्थान', detecting: 'स्थान शोधत आहे...', changeLocation: 'बदला',
    find: 'सर्वोत्तम मुहूर्त शोधा', finding: 'वेळ खिडक्या स्कॅन होत आहेत...',
    hero: 'शीर्ष शिफारस', score: 'गुण', breakdown: 'गुण विश्लेषण',
    panchang: 'पंचांग', transit: 'गोचर', timing: 'वेळ', personal: 'वैयक्तिक',
    keyFactors: 'मुख्य कारणे', results: 'सर्व शिफारसी', date: 'तारीख', time: 'वेळ',
    noResults: 'या मर्यादेत शुभ वेळ सापडला नाही. तारीख मर्यादा वाढवा.',
  },
  mai: {
    title: 'मुहूर्त AI', subtitle: 'स्मार्ट मुहूर्त खोजक',
    desc: 'कोनो काजक लेल 0-100 अंक देय वाला बहु-कारक स्कोरिंग इंजन। पंचांग, गोचर, होरा आ चौघड़िया।',
    step1: 'काज चुनू', step2: 'तिथि सीमा आ स्थान',
    startDate: 'आरम्भ तिथि', endDate: 'अन्तिम तिथि',
    location: 'स्थान', detecting: 'स्थान खोजि रहल अछि...', changeLocation: 'बदलू',
    find: 'सर्वोत्तम मुहूर्त खोजू', finding: 'समय खण्ड स्कैन भ रहल अछि...',
    hero: 'शीर्ष सिफारिश', score: 'अंक', breakdown: 'अंक विश्लेषण',
    panchang: 'पंचांग', transit: 'गोचर', timing: 'समय', personal: 'व्यक्तिगत',
    keyFactors: 'मुख्य कारण', results: 'सभ सिफारिश', date: 'तिथि', time: 'समय',
    noResults: 'एहि अवधिमे कोनो शुभ समय नहि भेटल। तिथि सीमा बढ़ाउ।',
  },
};

function ScoreGauge({ score, label, max = 25 }: { score: number; label: string; max?: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 70 ? '#4ade80' : pct >= 40 ? '#facc15' : '#f87171';
  return (
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(212,168,83,0.15)" strokeWidth="3" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${pct}, 100`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color }}>{score}</span>
      </div>
      <p className="text-text-secondary text-xs mt-1">{label}</p>
    </div>
  );
}

export default function MuhurtaAIPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const t = (L as Record<string, typeof L.en>)[locale] || L.en;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const today = new Date();
  const nextMonth = new Date(today); nextMonth.setMonth(today.getMonth() + 1);
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const [activity, setActivity] = useState<ExtendedActivityId | null>(null);
  const [startDate, setStartDate] = useState(fmt(today));
  const [endDate, setEndDate] = useState(fmt(nextMonth));
  const [location, setLocation] = useState({ lat: 0, lng: 0, name: '', tz: 0, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [data, setData] = useState<MuhurtaAIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [gateError, setGateError] = useState<GateError | null>(null);
  const { birthNakshatra, birthRashi, isSet: hasBirthData, loadFromStorage } = useBirthDataStore();

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      setDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const geoData = await res.json();
            const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
            const country = geoData.address?.country || '';
            setLocation({ lat: latitude, lng: longitude, name: [city, country].filter(Boolean).join(', ') || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`, tz: -new Date().getTimezoneOffset() / 60, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
          } catch {
            setLocation({ lat: latitude, lng: longitude, name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`, tz: -new Date().getTimezoneOffset() / 60, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
          }
          setDetectingLocation(false);
        },
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/');
            const ipData = await res.json();
            if (ipData.latitude && ipData.longitude) {
              let name = `${ipData.latitude.toFixed(2)}°, ${ipData.longitude.toFixed(2)}°`;
              try {
                const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${ipData.latitude}&lon=${ipData.longitude}&zoom=10`);
                const geoData = await geo.json();
                const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
                const country = geoData.address?.country || '';
                name = [city, country].filter(Boolean).join(', ') || name;
              } catch { /* use coordinate fallback */ }
              // Parse utc_offset in HHMM format (e.g. "+0530" → 5.5, not 5.3)
              let tz = -new Date().getTimezoneOffset() / 60;
              if (ipData.utc_offset) {
                const sign = ipData.utc_offset[0] === '-' ? -1 : 1;
                const hh = parseInt(ipData.utc_offset.slice(1, 3), 10);
                const mm = parseInt(ipData.utc_offset.slice(3, 5), 10);
                tz = sign * (hh + mm / 60);
              }
              setLocation({ lat: ipData.latitude, lng: ipData.longitude, name, tz, timezone: ipData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone });
            }
          } catch { /* silently fail */ }
          setDetectingLocation(false);
        },
        { timeout: 8000 }
      );
    }
  }, []);

  const handleFind = async () => {
    if (!activity) return;
    setLoading(true);
    setGateError(null);
    try {
      const res = await authedFetch('/api/muhurta-ai', {
        method: 'POST',
        body: JSON.stringify({ activity, startDate, endDate, lat: location.lat, lng: location.lng, tz: location.tz, timezone: location.timezone, ...(hasBirthData ? { birthNakshatra, birthRashi } : {}) }),
      });
      const gate = await parseGateError(res);
      if (gate) { setGateError(gate); setLoading(false); return; }
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const top = data?.topRecommendations[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t.title}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto" style={bodyFont}>{t.desc}</p>
      </motion.div>

      {/* Muhurta Intro */}
      <InfoBlock
        id="muhurta-ai-intro"
        title={msg('infoBlockTitle', locale)}
        defaultOpen={false}
      >
        {isDevanagari ? (
          <p>मुहूर्त सही समय चुनने का वैदिक विज्ञान है। जैसे सही मौसम में बोए गए बीज बेहतर उगते हैं, वैसे ही शुभ समय पर शुरू किए गए कार्य अधिक सफल होते हैं। हमारा AI प्रत्येक समय खंड को 0-100 के पैमाने पर अंकित करता है: तिथि गुण, नक्षत्र प्रकृति, योग शुभता, ग्रह होरा, चौघड़िया और वर्तमान गोचर।</p>
        ) : (
          <p>Muhurta is the Vedic science of choosing the right time. Just as seeds planted in the right season grow better, actions started at auspicious times succeed more easily. Our AI scores each time window (0–100) by combining: tithi quality, nakshatra nature, yoga auspiciousness, planetary hora, choghadiya, and current transits.</p>
        )}
      </InfoBlock>

      {/* Activity Grid */}
      <div className="mb-8">
        <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold text-center">{t.step1}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {ACTIVITY_LIST.map(a => (
            <motion.button key={a.id} onClick={() => setActivity(a.id)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-xl border text-center transition-all ${activity === a.id ? 'border-gold-primary/50 bg-gold-primary/15' : 'border-gold-primary/10 bg-bg-primary/40 hover:border-gold-primary/25'}`}>
              <p className="text-xs text-gold-light font-medium" style={bodyFont}>{a.label[locale] || a.label.en}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 mb-8">
        <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold text-center">{t.step2}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <label className="block">
            <span className="text-text-secondary text-xs">{t.startDate}</span>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full mt-1 bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-text-secondary text-xs">{t.endDate}</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full mt-1 bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none" />
          </label>
          <div className="block">
            <span className="text-text-secondary text-xs">{t.location}</span>
            {showLocationSearch ? (
              <LocationSearch
                value={location.name}
                onSelect={(loc) => {
                  const ianaTimezone = loc.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
                  const now = new Date();
                  const tzOffset = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), ianaTimezone);
                  setLocation({ lat: loc.lat, lng: loc.lng, name: loc.name, tz: tzOffset, timezone: ianaTimezone });
                  setShowLocationSearch(false);
                }}
                placeholder={msg('searchCityPlaceholder', locale)}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-2 mt-1 bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2">
                {detectingLocation ? (
                  <span className="flex items-center gap-2 text-text-secondary text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-gold-primary" />
                    {t.detecting}
                  </span>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 text-gold-primary shrink-0" />
                    <span className="text-text-primary text-sm truncate">{location.name}</span>
                    <button onClick={() => setShowLocationSearch(true)}
                      className="ml-auto text-gold-primary text-xs hover:text-gold-light whitespace-nowrap">
                      {t.changeLocation}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-6">
          <motion.button onClick={handleFind} disabled={loading || !activity} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-light text-lg font-bold hover:bg-gold-primary/30 disabled:opacity-50" style={headingFont}>
            {loading ? t.finding : t.find}
          </motion.button>
        </div>
      </div>

      {gateError && (
        <div className="mt-8">
          <UsageLimitBanner
            type={gateError.type}
            feature={gateError.feature}
            featureName={gateError.featureName}
            requiredTier={gateError.requiredTier}
            limit={gateError.limit}
            message={gateError.message}
            source="muhurta-ai"
          />
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <GoldDivider />

            {top ? (
              <>
                {/* Hero recommendation */}
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 text-center border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
                  <p className="text-gold-primary text-xs uppercase tracking-wider mb-2 font-bold">{t.hero}</p>
                  <p className="text-3xl sm:text-5xl font-bold text-gold-light mb-1" style={headingFont}>{top.totalScore}<span className="text-xl sm:text-2xl text-gold-dark">/100</span></p>
                  <p className="text-text-secondary">{top.date} &middot; {top.startTime} — {top.endTime}</p>

                  {/* Score breakdown gauges */}
                  <div className="flex justify-center gap-8 mt-6">
                    <ScoreGauge score={top.breakdown.panchangScore} label={t.panchang} />
                    <ScoreGauge score={top.breakdown.transitScore} label={t.transit} />
                    <ScoreGauge score={top.breakdown.timingScore} label={t.timing} />
                    <ScoreGauge score={top.breakdown.personalScore} label={t.personal} />
                  </div>

                  {/* Panchanga Shuddhi + Tara Bala + Chandra Bala */}
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {top.panchangaShuddhi !== undefined && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20">
                        <span className="text-text-secondary text-xs">{msg('panchangaShuddhi', locale)}</span>
                        <span className={`font-bold text-sm ${top.panchangaShuddhi >= 4 ? 'text-emerald-400' : top.panchangaShuddhi >= 3 ? 'text-gold-light' : 'text-amber-400'}`}>
                          {top.panchangaShuddhi}/5
                        </span>
                      </div>
                    )}
                    {top.taraBala && (
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${top.taraBala.auspicious ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-red-500/10 border-red-500/20'}`}>
                        <span className="text-text-secondary text-xs">{msg('taraBala', locale)}</span>
                        <span className={`font-bold text-sm ${top.taraBala.auspicious ? 'text-emerald-400' : 'text-red-400'}`}>
                          {top.taraBala.name} {top.taraBala.auspicious ? '✓' : '✗'}
                        </span>
                      </div>
                    )}
                    {top.chandraBala !== undefined && (
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${top.chandraBala ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-amber-500/8 border-amber-500/20'}`}>
                        <span className="text-text-secondary text-xs">{msg('chandraBala', locale)}</span>
                        <span className={`font-bold text-sm ${top.chandraBala ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {top.chandraBala ? msg('chandraPresent', locale) : msg('chandraAbsent', locale)}
                        </span>
                      </div>
                    )}
                    {!hasBirthData && (
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gold-primary/10 bg-bg-secondary/30">
                        <span className="text-text-secondary/70 text-xs">
                          {msg('saveBirthChartNote', locale)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Key Factors */}
                  {top.keyFactors.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {top.keyFactors.map((f, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/15" style={bodyFont}>{tl(f, locale)}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* All recommendations */}
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 overflow-x-auto">
                  <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.results} ({data.topRecommendations.length})</h2>
                  <table className="w-full text-sm">
                    <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                      <th className="text-left py-2 px-2">#</th>
                      <th className="text-left py-2 px-2">{t.date}</th>
                      <th className="text-left py-2 px-2">{t.time}</th>
                      <th className="text-left py-2 px-2">{t.score}</th>
                      <th className="text-left py-2 px-2">{t.panchang}</th>
                      <th className="text-left py-2 px-2">{msg('shuddhi', locale)}</th>
                      {hasBirthData && <th className="text-left py-2 px-2">{msg('tara', locale)}</th>}
                      {hasBirthData && <th className="text-left py-2 px-2">{msg('chandra', locale)}</th>}
                      <th className="text-left py-2 px-2">{t.transit}</th>
                      <th className="text-left py-2 px-2">{t.timing}</th>
                      <th className="text-left py-2 px-2">{t.keyFactors}</th>
                    </tr></thead>
                    <tbody>{data.topRecommendations.map((w, i) => (
                      <tr key={i} className={`border-b border-gold-primary/5 ${i === 0 ? 'bg-gold-primary/5' : 'hover:bg-gold-primary/5'}`}>
                        <td className="py-2 px-2 text-gold-light font-bold">{i + 1}</td>
                        <td className="py-2 px-2 text-text-secondary font-mono text-xs">{w.date}</td>
                        <td className="py-2 px-2 text-text-secondary text-xs">{w.startTime}-{w.endTime}</td>
                        <td className="py-2 px-2">
                          <span className={`font-bold ${w.totalScore >= 70 ? 'text-green-400' : w.totalScore >= 50 ? 'text-yellow-400' : 'text-orange-400'}`}>{w.totalScore}</span>
                        </td>
                        <td className="py-2 px-2 text-text-secondary">{w.breakdown.panchangScore}</td>
                        <td className="py-2 px-2">
                          {w.panchangaShuddhi !== undefined && (
                            <span className={`font-bold text-xs ${w.panchangaShuddhi >= 4 ? 'text-emerald-400' : w.panchangaShuddhi >= 3 ? 'text-gold-light' : 'text-amber-400'}`}>{w.panchangaShuddhi}/5</span>
                          )}
                        </td>
                        {hasBirthData && <td className="py-2 px-2">
                          {w.taraBala && <span className={`text-xs font-semibold ${w.taraBala.auspicious ? 'text-emerald-400' : 'text-red-400'}`}>{w.taraBala.name.slice(0,4)}</span>}
                        </td>}
                        {hasBirthData && <td className="py-2 px-2">
                          {w.chandraBala !== undefined && <span className={`text-xs font-bold ${w.chandraBala ? 'text-emerald-400' : 'text-amber-400'}`}>{w.chandraBala ? '✓' : '✗'}</span>}
                        </td>}
                        <td className="py-2 px-2 text-text-secondary">{w.breakdown.transitScore}</td>
                        <td className="py-2 px-2 text-text-secondary">{w.breakdown.timingScore}</td>
                        <td className="py-2 px-2 text-text-secondary text-xs" style={bodyFont}>{w.keyFactors.map(f => tl(f, locale)).join(', ')}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 text-center">
                <p className="text-text-secondary" style={bodyFont}>{t.noResults}</p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
              <p className="text-text-secondary leading-relaxed" style={bodyFont}>{tl(data.summary, locale)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
