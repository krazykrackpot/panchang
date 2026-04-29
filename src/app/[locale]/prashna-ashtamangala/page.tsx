'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { parseGateError, type GateError } from '@/lib/api/parse-gate-error';
import UsageLimitBanner from '@/components/ui/UsageLimitBanner';
import { motion, AnimatePresence } from 'framer-motion';
import ChartNorth from '@/components/kundali/ChartNorth';
import GoldDivider from '@/components/ui/GoldDivider';
import { AshtamangalaIconById } from '@/components/icons/AshtamangalaIcons';
import { useLocationStore } from '@/stores/location-store';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { Locale } from '@/types/panchang';
import type { AshtamangalaPrashnaData, QuestionCategory } from '@/types/prashna';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';

const CATEGORIES: { id: QuestionCategory; label: Record<string, string>; house: number }[] = [
  { id: 'health', label: { en: 'Health', hi: 'स्वास्थ्य', sa: 'स्वास्थ्यम्', ta: 'உடல்நலம்' }, house: 1 },
  { id: 'wealth', label: { en: 'Wealth', hi: 'धन', sa: 'धनम्', ta: 'செல்வம்' }, house: 2 },
  { id: 'siblings', label: { en: 'Siblings', hi: 'भाई-बहन', sa: 'भ्रातरः', ta: 'உடன்பிறப்பு' }, house: 3 },
  { id: 'property', label: { en: 'Property', hi: 'संपत्ति', sa: 'सम्पत्तिः', ta: 'சொத்து' }, house: 4 },
  { id: 'children', label: { en: 'Children', hi: 'संतान', sa: 'सन्तानम्', ta: 'குழந்தைகள்' }, house: 5 },
  { id: 'enemies', label: { en: 'Enemies', hi: 'शत्रु', sa: 'शत्रवः', ta: 'எதிரிகள்' }, house: 6 },
  { id: 'marriage', label: { en: 'Marriage', hi: 'विवाह', sa: 'विवाहः', ta: 'திருமணம்' }, house: 7 },
  { id: 'longevity', label: { en: 'Longevity', hi: 'आयु', sa: 'आयुः', ta: 'ஆயுள்' }, house: 8 },
  { id: 'fortune', label: { en: 'Fortune', hi: 'भाग्य', sa: 'भाग्यम्', ta: 'பாக்கியம்' }, house: 9 },
  { id: 'career', label: { en: 'Career', hi: 'करियर', sa: 'व्यवसायः', ta: 'தொழில்' }, house: 10 },
  { id: 'gains', label: { en: 'Gains', hi: 'लाभ', sa: 'लाभः', ta: 'லாபம்' }, house: 11 },
  { id: 'loss', label: { en: 'Loss/Abroad', hi: 'हानि/विदेश', sa: 'व्ययः', ta: 'இழப்பு/வெளிநாடு' }, house: 12 },
];

const T = {
  en: {
    title: 'Ashtamangala Prashna', subtitle: 'Kerala Horary Divination',
    desc: 'Pick 3 numbers (1-108) to invoke the 8 auspicious objects. Combined with the Prashna chart cast at this moment.',
    step1: 'Select Your Question Category', step2: 'Pick Three Numbers',
    num1: 'Primary (Purpose)', num2: 'Supporting (Strength)', num3: 'Timing (When)',
    cast: 'Cast Ashtamangala Prashna', casting: 'Casting Sacred Chart...',
    objects: 'Ashtamangala Objects', chart: 'Prashna Chart', yogas: 'Prashna Yogas',
    interpretation: 'Interpretation', verdict: 'Verdict', timing: 'Timing', remedies: 'Remedies',
    favorable: 'Favorable', unfavorable: 'Unfavorable', mixed: 'Mixed',
    arudaHouse: 'Aruda House', ruler: 'Ruler', element: 'Element',
    primary: 'Primary', supporting: 'Supporting', timingObj: 'Timing',
  },
  hi: {
    title: 'अष्टमंगल प्रश्न', subtitle: 'केरल होरारी दैवज्ञ',
    desc: '3 संख्याएं (1-108) चुनें — 8 शुभ वस्तुओं का आह्वान। इस क्षण की प्रश्न कुण्डली के साथ।',
    step1: 'अपना प्रश्न वर्ग चुनें', step2: 'तीन संख्याएं चुनें',
    num1: 'प्राथमिक (उद्देश्य)', num2: 'सहायक (बल)', num3: 'समय (कब)',
    cast: 'अष्टमंगल प्रश्न करें', casting: 'पवित्र कुण्डली बन रही है...',
    objects: 'अष्टमंगल वस्तुएं', chart: 'प्रश्न कुण्डली', yogas: 'प्रश्न योग',
    interpretation: 'व्याख्या', verdict: 'निर्णय', timing: 'समय', remedies: 'उपाय',
    favorable: 'अनुकूल', unfavorable: 'प्रतिकूल', mixed: 'मिश्रित',
    arudaHouse: 'आरूढ भाव', ruler: 'स्वामी', element: 'तत्त्व',
    primary: 'प्राथमिक', supporting: 'सहायक', timingObj: 'समय',
  },
  sa: {
    title: 'अष्टमङ्गलप्रश्नम्', subtitle: 'केरलहोरारीदैवज्ञम्',
    desc: 'त्रीणि सङ्ख्यानि (1-108) चिनुत — अष्टशुभवस्तूनाम् आह्वानम्। अस्मिन् क्षणे प्रश्नकुण्डली।',
    step1: 'स्वप्रश्नवर्गं चिनुत', step2: 'त्रीणि सङ्ख्यानि चिनुत',
    num1: 'प्राथमिकम् (उद्देश्यम्)', num2: 'सहायकम् (बलम्)', num3: 'समयः (कदा)',
    cast: 'अष्टमङ्गलप्रश्नं कुर्यात्', casting: 'पवित्रकुण्डलीरचना...',
    objects: 'अष्टमङ्गलवस्तूनि', chart: 'प्रश्नकुण्डली', yogas: 'प्रश्नयोगाः',
    interpretation: 'व्याख्या', verdict: 'निर्णयः', timing: 'समयः', remedies: 'उपायाः',
    favorable: 'अनुकூलः', unfavorable: 'प्रतिकूलः', mixed: 'मिश्रः',
    arudaHouse: 'आरूढभावः', ruler: 'स्वामी', element: 'तत्त्वम्',
    primary: 'प्राथमिकम्', supporting: 'सहायकम्', timingObj: 'समयः',
  },
  ta: {
    title: 'அஷ்டமங்கல பிரச்னை', subtitle: 'கேரள ஹோராரி ஜோதிடம்',
    desc: '8 சுப பொருட்களை தொடர்புகொள்ள 3 எண்களை (1-108) தேர்ந்தெடுக்கவும். இந்த தருணத்தில் பிரச்னை குண்டலியுடன் இணைக்கப்படும்.',
    step1: 'உங்கள் கேள்வி வகையைத் தேர்ந்தெடுக்கவும்', step2: 'மூன்று எண்களைத் தேர்ந்தெடுக்கவும்',
    num1: 'முதன்மை (நோக்கம்)', num2: 'துணை (வலிமை)', num3: 'நேரம் (எப்போது)',
    cast: 'அஷ்டமங்கல பிரச்னை செய்', casting: 'புனிதக் குண்டலி உருவாக்குகிறது...',
    objects: 'அஷ்டமங்கல பொருட்கள்', chart: 'பிரச்னை குண்டலி', yogas: 'பிரச்னை யோகங்கள்',
    interpretation: 'விளக்கம்', verdict: 'தீர்ப்பு', timing: 'நேரம்', remedies: 'பரிகாரங்கள்',
    favorable: 'சாதகமான', unfavorable: 'பாதகமான', mixed: 'கலப்பு',
    arudaHouse: 'ஆரூட பாவம்', ruler: 'அதிபதி', element: 'தத்துவம்',
    primary: 'முதன்மை', supporting: 'துணை', timingObj: 'நேரம்',
  },
  te: {
    title: 'అష్టమంగల ప్రశ్న', subtitle: 'కేరళ హోరారీ జ్యోతిషం',
    desc: '8 శుభ వస్తువులను ఆవాహన చేయడానికి 3 సంఖ్యలు (1-108) ఎంచుకోండి. ఈ క్షణం యొక్క ప్రశ్న కుండలితో కలిపి.',
    step1: 'మీ ప్రశ్న వర్గాన్ని ఎంచుకోండి', step2: 'మూడు సంఖ్యలు ఎంచుకోండి',
    num1: 'ప్రాథమిక (ఉద్దేశ్యం)', num2: 'సహాయక (బలం)', num3: 'సమయం (ఎప్పుడు)',
    cast: 'అష్టమంగల ప్రశ్న చేయండి', casting: 'పవిత్ర కుండలి రచిస్తోంది...',
    objects: 'అష్టమంగల వస్తువులు', chart: 'ప్రశ్న కుండలి', yogas: 'ప్రశ్న యోగాలు',
    interpretation: 'వ్యాఖ్యానం', verdict: 'తీర్పు', timing: 'సమయం', remedies: 'పరిహారాలు',
    favorable: 'అనుకూలం', unfavorable: 'ప్రతికూలం', mixed: 'మిశ్రమం',
    arudaHouse: 'ఆరూఢ భావం', ruler: 'అధిపతి', element: 'తత్వం',
    primary: 'ప్రాథమిక', supporting: 'సహాయక', timingObj: 'సమయం',
  },
  bn: {
    title: 'অষ্টমঙ্গল প্রশ্ন', subtitle: 'কেরল হোরারি জ্যোতিষ',
    desc: '৮টি শুভ বস্তুর আবাহনের জন্য ৩টি সংখ্যা (১-১০৮) বেছে নিন। এই মুহূর্তের প্রশ্ন কুণ্ডলীর সাথে মিলিত।',
    step1: 'আপনার প্রশ্ন বিভাগ বেছে নিন', step2: 'তিনটি সংখ্যা বেছে নিন',
    num1: 'প্রাথমিক (উদ্দেশ্য)', num2: 'সহায়ক (বল)', num3: 'সময় (কখন)',
    cast: 'অষ্টমঙ্গল প্রশ্ন করুন', casting: 'পবিত্র কুণ্ডলী রচনা হচ্ছে...',
    objects: 'অষ্টমঙ্গল বস্তু', chart: 'প্রশ্ন কুণ্ডলী', yogas: 'প্রশ্ন যোগ',
    interpretation: 'ব্যাখ্যা', verdict: 'রায়', timing: 'সময়', remedies: 'প্রতিকার',
    favorable: 'অনুকূল', unfavorable: 'প্রতিকূল', mixed: 'মিশ্র',
    arudaHouse: 'আরূঢ় ভাব', ruler: 'অধিপতি', element: 'তত্ত্ব',
    primary: 'প্রাথমিক', supporting: 'সহায়ক', timingObj: 'সময়',
  },
  kn: {
    title: 'ಅಷ್ಟಮಂಗಲ ಪ್ರಶ್ನ', subtitle: 'ಕೇರಳ ಹೋರಾರಿ ಜ್ಯೋತಿಷ',
    desc: '8 ಶುಭ ವಸ್ತುಗಳನ್ನು ಆವಾಹಿಸಲು 3 ಸಂಖ್ಯೆಗಳನ್ನು (1-108) ಆಯ್ಕೆಮಾಡಿ. ಈ ಕ್ಷಣದ ಪ್ರಶ್ನ ಜಾತಕದೊಂದಿಗೆ ಸಂಯೋಜಿತ.',
    step1: 'ನಿಮ್ಮ ಪ್ರಶ್ನ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ', step2: 'ಮೂರು ಸಂಖ್ಯೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    num1: 'ಪ್ರಾಥಮಿಕ (ಉದ್ದೇಶ)', num2: 'ಸಹಾಯಕ (ಬಲ)', num3: 'ಸಮಯ (ಯಾವಾಗ)',
    cast: 'ಅಷ್ಟಮಂಗಲ ಪ್ರಶ್ನ ಮಾಡಿ', casting: 'ಪವಿತ್ರ ಜಾತಕ ರಚನೆಯಾಗುತ್ತಿದೆ...',
    objects: 'ಅಷ್ಟಮಂಗಲ ವಸ್ತುಗಳು', chart: 'ಪ್ರಶ್ನ ಜಾತಕ', yogas: 'ಪ್ರಶ್ನ ಯೋಗಗಳು',
    interpretation: 'ವ್ಯಾಖ್ಯಾನ', verdict: 'ತೀರ್ಪು', timing: 'ಸಮಯ', remedies: 'ಪರಿಹಾರಗಳು',
    favorable: 'ಅನುಕೂಲ', unfavorable: 'ಪ್ರತಿಕೂಲ', mixed: 'ಮಿಶ್ರ',
    arudaHouse: 'ಆರೂಢ ಭಾವ', ruler: 'ಅಧಿಪತಿ', element: 'ತತ್ವ',
    primary: 'ಪ್ರಾಥಮಿಕ', supporting: 'ಸಹಾಯಕ', timingObj: 'ಸಮಯ',
  },
  gu: {
    title: 'અષ્ટમંગલ પ્રશ્ન', subtitle: 'કેરળ હોરારી જ્યોતિષ',
    desc: '8 શુભ વસ્તુઓનું આવાહન કરવા 3 સંખ્યા (1-108) પસંદ કરો. આ ક્ષણની પ્રશ્ન કુંડળી સાથે જોડાયેલ.',
    step1: 'તમારો પ્રશ્ન વર્ગ પસંદ કરો', step2: 'ત્રણ સંખ્યા પસંદ કરો',
    num1: 'પ્રાથમિક (હેતુ)', num2: 'સહાયક (બળ)', num3: 'સમય (ક્યારે)',
    cast: 'અષ્ટમંગલ પ્રશ્ન કરો', casting: 'પવિત્ર કુંડળી રચાઈ રહી છે...',
    objects: 'અષ્ટમંગલ વસ્તુઓ', chart: 'પ્રશ્ન કુંડળી', yogas: 'પ્રશ્ન યોગ',
    interpretation: 'વ્યાખ્યા', verdict: 'ચુકાદો', timing: 'સમય', remedies: 'ઉપાય',
    favorable: 'અનુકૂળ', unfavorable: 'પ્રતિકૂળ', mixed: 'મિશ્ર',
    arudaHouse: 'આરૂઢ ભાવ', ruler: 'અધિપતિ', element: 'તત્ત્વ',
    primary: 'પ્રાથમિક', supporting: 'સહાયક', timingObj: 'સમય',
  },
  mr: {
    title: 'अष्टमंगल प्रश्न', subtitle: 'केरळ होरारी ज्योतिष',
    desc: '8 शुभ वस्तूंचे आवाहन करण्यासाठी 3 संख्या (1-108) निवडा. या क्षणाच्या प्रश्न कुंडलीसह.',
    step1: 'तुमचा प्रश्न वर्ग निवडा', step2: 'तीन संख्या निवडा',
    num1: 'प्राथमिक (उद्देश)', num2: 'सहाय्यक (बल)', num3: 'वेळ (कधी)',
    cast: 'अष्टमंगल प्रश्न करा', casting: 'पवित्र कुंडली रचली जात आहे...',
    objects: 'अष्टमंगल वस्तू', chart: 'प्रश्न कुंडली', yogas: 'प्रश्न योग',
    interpretation: 'व्याख्या', verdict: 'निकाल', timing: 'वेळ', remedies: 'उपाय',
    favorable: 'अनुकूल', unfavorable: 'प्रतिकूल', mixed: 'मिश्र',
    arudaHouse: 'आरूढ भाव', ruler: 'स्वामी', element: 'तत्त्व',
    primary: 'प्राथमिक', supporting: 'सहाय्यक', timingObj: 'वेळ',
  },
  mai: {
    title: 'अष्टमंगल प्रश्न', subtitle: 'केरल होरारी दैवज्ञ',
    desc: '8 शुभ वस्तुक आह्वानक लेल 3 संख्या (1-108) चुनू। एहि क्षणक प्रश्न कुण्डलीक संग।',
    step1: 'अपन प्रश्न वर्ग चुनू', step2: 'तीन संख्या चुनू',
    num1: 'प्राथमिक (उद्देश्य)', num2: 'सहायक (बल)', num3: 'समय (कहिया)',
    cast: 'अष्टमंगल प्रश्न करू', casting: 'पवित्र कुण्डली बनि रहल अछि...',
    objects: 'अष्टमंगल वस्तु', chart: 'प्रश्न कुण्डली', yogas: 'प्रश्न योग',
    interpretation: 'व्याख्या', verdict: 'निर्णय', timing: 'समय', remedies: 'उपाय',
    favorable: 'अनुकूल', unfavorable: 'प्रतिकूल', mixed: 'मिश्रित',
    arudaHouse: 'आरूढ भाव', ruler: 'स्वामी', element: 'तत्त्व',
    primary: 'प्राथमिक', supporting: 'सहायक', timingObj: 'समय',
  },
};

export default function PrashnaAshtamangalaPage() {
  const locale = useLocale() as Locale;
  const learnLinks = getLearnLinksForTool('/prashna-ashtamangala');
  const isTamil = String(locale) === 'ta';
  const t = (T as Record<string, typeof T.en>)[locale] || T.en;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const locationStore = useLocationStore();

  useEffect(() => { locationStore.detect(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [category, setCategory] = useState<QuestionCategory | null>(null);
  const [numbers, setNumbers] = useState<[number, number, number]>([7, 21, 54]);
  const [data, setData] = useState<AshtamangalaPrashnaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [gateError, setGateError] = useState<GateError | null>(null);

  const handleCast = useCallback(async () => {
    if (!category || locationStore.lat === null || locationStore.lng === null) return;
    setLoading(true);
    setGateError(null);

    const now = new Date();
    const ianaTimezone = locationStore.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tz = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), ianaTimezone);
    try {
      const res = await authedFetch('/api/prashna-ashtamangala', {
        method: 'POST',
        body: JSON.stringify({ numbers, category, lat: locationStore.lat, lng: locationStore.lng, tz, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
      });
      const gate = await parseGateError(res);
      if (gate) { setGateError(gate); setLoading(false); return; }
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [category, numbers, locationStore.lat, locationStore.lng]);

  const verdictColors = { favorable: 'text-green-400', unfavorable: 'text-red-400', mixed: 'text-yellow-400' };
  const objLabels = [t.primary, t.supporting, t.timingObj];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t.title}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto" style={bodyFont}>{t.desc}</p>
      </motion.div>

      {/* Step 1: Category */}
      <div className="mb-8">
        <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold text-center">{t.step1}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => (
            <motion.button key={cat.id} onClick={() => setCategory(cat.id)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border text-center transition-all ${category === cat.id ? 'border-gold-primary/50 bg-gold-primary/15 shadow-lg shadow-gold-primary/10' : 'border-gold-primary/10 bg-bg-primary/40 hover:border-gold-primary/25'}`}>
              <span className="text-2xl font-bold text-gold-light">{cat.house}</span>
              <p className="text-xs mt-1 text-text-secondary" style={bodyFont}>{cat.label[locale] || cat.label.en}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Step 2: Numbers */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 mb-8">
        <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold text-center">{t.step2}</h2>
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[0, 1, 2].map(i => (
            <label key={i} className="block text-center">
              <span className="text-text-secondary text-xs" style={bodyFont}>{[t.num1, t.num2, t.num3][i]}</span>
              <input type="number" min={1} max={108} value={numbers[i]}
                onChange={e => {
                  const v = Math.max(1, Math.min(108, parseInt(e.target.value) || 1));
                  const newNums = [...numbers] as [number, number, number];
                  newNums[i] = v;
                  setNumbers(newNums);
                }}
                className="w-full mt-2 bg-bg-primary/60 border-2 border-gold-primary/30 rounded-xl px-4 py-4 text-gold-light text-3xl font-bold text-center focus:border-gold-primary/60 focus:outline-none" />
            </label>
          ))}
        </div>
        <div className="text-center mt-6">
          <motion.button onClick={handleCast} disabled={loading || !category} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-light text-lg font-bold hover:bg-gold-primary/30 disabled:opacity-50" style={headingFont}>
            {loading ? t.casting : t.cast}
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
            source="prashna-ashtamangala"
          />
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <GoldDivider />

            {/* Objects Revealed */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold text-center">{t.objects}</h2>
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                {data.objects.map((obj, i) => (
                  <motion.div key={i} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ delay: i * 0.3, duration: 0.5 }}
                    className="text-center p-5 rounded-xl bg-gradient-to-b from-gold-primary/10 to-transparent border border-gold-primary/20">
                    <p className="text-text-secondary text-xs mb-2 uppercase tracking-wider">{objLabels[i]}</p>
                    <AshtamangalaIconById id={obj.id} size={56} />
                    <p className="text-gold-light font-bold mt-3" style={bodyFont}>{tl(obj.name, locale)}</p>
                    <p className="text-text-secondary text-xs mt-1" style={bodyFont}>{tl(obj.symbolism, locale)}</p>
                    <div className="mt-2 flex justify-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-dark">{t.ruler}: {tl(obj.planetName, locale)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-dark">{t.arudaHouse}: {data.arudaHouses[i]}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="flex justify-center">
              <ChartNorth data={data.prashnaChart.chart} title={t.chart} size={420} />
            </div>

            {/* Yogas */}
            {data.yogas.length > 0 && (
              <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
                <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.yogas}</h2>
                <div className="grid gap-3">
                  {data.yogas.map((y, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${y.favorable ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-gold-light font-bold text-sm" style={bodyFont}>{tl(y.name, locale)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${y.favorable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {y.favorable ? t.favorable : t.unfavorable}
                        </span>
                      </div>
                      <p className="text-text-secondary text-xs mt-1" style={bodyFont}>{tl(y.description, locale)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interpretation */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.interpretation}</h2>

              <div className="text-center mb-6">
                <p className="text-xs text-text-secondary uppercase tracking-wider">{t.verdict}</p>
                <p className={`text-3xl font-bold mt-1 ${verdictColors[data.interpretation.verdict]}`} style={headingFont}>
                  {t[data.interpretation.verdict]}
                </p>
              </div>

              <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{tl(data.interpretation.summary, locale)}</p>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-bg-primary/40 border border-gold-primary/10">
                  <p className="text-gold-primary text-xs uppercase tracking-wider mb-1 font-bold">{t.timing}</p>
                  <p className="text-text-secondary text-sm" style={bodyFont}>{tl(data.interpretation.timing, locale)}</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-primary/40 border border-gold-primary/10">
                  <p className="text-gold-primary text-xs uppercase tracking-wider mb-1 font-bold">{t.remedies}</p>
                  <ul className="text-text-secondary text-sm space-y-1" style={bodyFont}>
                    {data.interpretation.remedies.map((r, i) => <li key={i}>{tl(r, locale)}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RelatedLinks type="learn" links={learnLinks} locale={locale} />
    </div>
  );
}
