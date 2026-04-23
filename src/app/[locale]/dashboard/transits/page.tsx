'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Globe, AlertTriangle } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { computeGochar } from '@/lib/personalization/gochar';
import { analyzeGochara, analyzeDoubleTransit } from '@/lib/transit/gochara-engine';
import type { GocharaResult, DoubleTransitResult, TransitInput } from '@/lib/transit/gochara-engine';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { Locale } from '@/types/panchang';
import type { UserSnapshot } from '@/lib/personalization/types';
import type { GocharResult } from '@/lib/personalization/gochar';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: 'Your Transit Analysis',
    subtitle: 'How current planetary transits affect your birth chart',
    loading: 'Computing transit analysis...',
    notSignedIn: 'Sign in to see your transit analysis',
    signIn: 'Sign In',
    noBirthData: 'Set up your birth details to unlock transit analysis',
    setupProfile: 'Set Up Profile',
    back: 'Dashboard',
    planet: 'Planet',
    transitSign: 'Transit Sign',
    house: 'House',
    effect: 'Effect',
    positive: 'Favorable',
    negative: 'Challenging',
    mixed: 'Mixed',
    transitAlerts: 'Transit Alerts',
    noAlerts: 'No significant transit alerts at this time',
    gocharTable: 'Gochar Overview',
    sadeSatiTitle: 'Sade Sati Status',
    sadeSatiActive: 'Sade Sati is currently active',
    sadeSatiInactive: 'Sade Sati is not active',
    phase: 'Phase',
    retro: 'R',
  },
  hi: {
    title: 'आपका गोचर विश्लेषण',
    subtitle: 'वर्तमान ग्रह गोचर आपकी जन्म कुण्डली को कैसे प्रभावित कर रहे हैं',
    loading: 'गोचर विश्लेषण गणना हो रही है...',
    notSignedIn: 'अपना गोचर विश्लेषण देखने के लिए साइन इन करें',
    signIn: 'साइन इन',
    noBirthData: 'गोचर विश्लेषण के लिए अपना जन्म विवरण सेट करें',
    setupProfile: 'प्रोफ़ाइल सेट करें',
    back: 'डैशबोर्ड',
    planet: 'ग्रह',
    transitSign: 'गोचर राशि',
    house: 'भाव',
    effect: 'प्रभाव',
    positive: 'शुभ',
    negative: 'चुनौतीपूर्ण',
    mixed: 'मिश्रित',
    transitAlerts: 'गोचर सूचनाएँ',
    noAlerts: 'इस समय कोई महत्वपूर्ण गोचर सूचना नहीं',
    gocharTable: 'गोचर अवलोकन',
    sadeSatiTitle: 'साढ़े साती स्थिति',
    sadeSatiActive: 'साढ़े साती वर्तमान में सक्रिय है',
    sadeSatiInactive: 'साढ़े साती सक्रिय नहीं है',
    phase: 'चरण',
    retro: 'वक्री',
  },
  sa: {
    title: 'भवतः गोचरविश्लेषणम्',
    subtitle: 'वर्तमानग्रहगोचराः भवतः जन्मकुण्डलीं कथं प्रभावयन्ति',
    loading: 'गोचरविश्लेषणं गण्यते...',
    notSignedIn: 'स्वगोचरविश्लेषणं द्रष्टुं साइन इन कुर्वन्तु',
    signIn: 'साइन इन',
    noBirthData: 'गोचरविश्लेषणार्थं जन्मविवरणं स्थापयतु',
    setupProfile: 'प्रोफ़ाइलं स्थापयतु',
    back: 'पटலம्',
    planet: 'ग्रहः',
    transitSign: 'गोचरराशिः',
    house: 'भावः',
    effect: 'प्रभावः',
    positive: 'शुभम्',
    negative: 'आह्वानपूर्णम्',
    mixed: 'मिश्रितम्',
    transitAlerts: 'गोचरसूचनाः',
    noAlerts: 'अस्मिन् समये महत्त्वपूर्णा गोचरसूचना नास्ति',
    gocharTable: 'गोचरावलोकनम्',
    sadeSatiTitle: 'साढ़ेसातिस्थितिः',
    sadeSatiActive: 'साढ़ेसातिः वर्तमानं सक्रिया अस्ति',
    sadeSatiInactive: 'साढ़ेसातिः सक्रिया नास्ति',
    phase: 'चरणम्',
    retro: 'वक्री',
  },
  ta: {
    title: 'உங்கள் பெயர்ச்சி பகுப்பாய்வு',
    subtitle: 'தற்போதைய கிரக பெயர்ச்சிகள் உங்கள் ஜாதகத்தை எவ்வாறு பாதிக்கின்றன',
    loading: 'பெயர்ச்சி பகுப்பாய்வு கணக்கிடப்படுகிறது...',
    notSignedIn: 'உங்கள் பெயர்ச்சி பகுப்பாய்வைக் காண உள்நுழையவும்',
    signIn: 'உள்நுழை',
    noBirthData: 'பெயர்ச்சி பகுப்பாய்வுக்கு உங்கள் பிறப்பு விவரங்களை அமைக்கவும்',
    setupProfile: 'சுயவிவரத்தை அமை',
    back: 'டாஷ்போர்டு',
    planet: 'கிரகம்',
    transitSign: 'பெயர்ச்சி ராசி',
    house: 'பாவம்',
    effect: 'விளைவு',
    positive: 'சாதகமான',
    negative: 'சவாலான',
    mixed: 'கலப்பு',
    transitAlerts: 'பெயர்ச்சி எச்சரிக்கைகள்',
    noAlerts: 'இப்போது குறிப்பிடத்தக்க பெயர்ச்சி எச்சரிக்கைகள் இல்லை',
    gocharTable: 'கோசார கண்ணோட்டம்',
    sadeSatiTitle: 'சாடே சாதி நிலை',
    sadeSatiActive: 'சாடே சாதி தற்போது செயலில் உள்ளது',
    sadeSatiInactive: 'சாடே சாதி செயலில் இல்லை',
    phase: 'நிலை',
    retro: 'வக்ரம்',
  },
  te: {
    title: 'మీ గోచార విశ్లేషణ',
    subtitle: 'ప్రస్తుత గ్రహ గోచారాలు మీ జన్మ చార్ట్‌ను ఎలా ప్రభావితం చేస్తాయి',
    loading: 'గోచార విశ్లేషణ గణించబడుతోంది...',
    notSignedIn: 'మీ గోచార విశ్లేషణ చూడటానికి సైన్ ఇన్ చేయండి',
    signIn: 'సైన్ ఇన్',
    noBirthData: 'గోచార విశ్లేషణ కోసం మీ జన్మ వివరాలను సెట్ చేయండి',
    setupProfile: 'ప్రొఫైల్ సెట్ చేయండి',
    back: 'డాష్‌బోర్డ్',
    planet: 'గ్రహం',
    transitSign: 'గోచార రాశి',
    house: 'భావం',
    effect: 'ప్రభావం',
    positive: 'శుభం',
    negative: 'సవాలు',
    mixed: 'మిశ్రమం',
    transitAlerts: 'గోచార హెచ్చరికలు',
    noAlerts: 'ప్రస్తుతం ముఖ్యమైన గోచార హెచ్చరికలు లేవు',
    gocharTable: 'గోచార అవలోకనం',
    sadeSatiTitle: 'సాడే సాతి స్థితి',
    sadeSatiActive: 'సాడే సాతి ప్రస్తుతం యాక్టివ్',
    sadeSatiInactive: 'సాడే సాతి యాక్టివ్ కాదు',
    phase: 'దశ',
    retro: 'వక్రం',
  },
  bn: {
    title: 'আপনার গোচর বিশ্লেষণ',
    subtitle: 'বর্তমান গ্রহ গোচর আপনার জন্ম কুণ্ডলীকে কীভাবে প্রভাবিত করছে',
    loading: 'গোচর বিশ্লেষণ গণনা হচ্ছে...',
    notSignedIn: 'আপনার গোচর বিশ্লেষণ দেখতে সাইন ইন করুন',
    signIn: 'সাইন ইন',
    noBirthData: 'গোচর বিশ্লেষণের জন্য আপনার জন্ম বিবরণ সেট করুন',
    setupProfile: 'প্রোফাইল সেট করুন',
    back: 'ড্যাশবোর্ড',
    planet: 'গ্রহ',
    transitSign: 'গোচর রাশি',
    house: 'ভাব',
    effect: 'প্রভাব',
    positive: 'শুভ',
    negative: 'চ্যালেঞ্জিং',
    mixed: 'মিশ্র',
    transitAlerts: 'গোচর সতর্কতা',
    noAlerts: 'এই মুহূর্তে কোনো উল্লেখযোগ্য গোচর সতর্কতা নেই',
    gocharTable: 'গোচর সংক্ষিপ্ত বিবরণ',
    sadeSatiTitle: 'সাড়ে সাতি অবস্থা',
    sadeSatiActive: 'সাড়ে সাতি বর্তমানে সক্রিয়',
    sadeSatiInactive: 'সাড়ে সাতি সক্রিয় নয়',
    phase: 'পর্ব',
    retro: 'বক্র',
  },
  kn: {
    title: 'ನಿಮ್ಮ ಗೋಚಾರ ವಿಶ್ಲೇಷಣೆ',
    subtitle: 'ಪ್ರಸ್ತುತ ಗ್ರಹ ಗೋಚಾರಗಳು ನಿಮ್ಮ ಜನ್ಮ ಜಾತಕವನ್ನು ಹೇಗೆ ಪ್ರಭಾವಿಸುತ್ತವೆ',
    loading: 'ಗೋಚಾರ ವಿಶ್ಲೇಷಣೆ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತಿದೆ...',
    notSignedIn: 'ನಿಮ್ಮ ಗೋಚಾರ ವಿಶ್ಲೇಷಣೆ ನೋಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
    signIn: 'ಸೈನ್ ಇನ್',
    noBirthData: 'ಗೋಚಾರ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳನ್ನು ಹೊಂದಿಸಿ',
    setupProfile: 'ಪ್ರೊಫೈಲ್ ಹೊಂದಿಸಿ',
    back: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    planet: 'ಗ್ರಹ',
    transitSign: 'ಗೋಚಾರ ರಾಶಿ',
    house: 'ಭಾವ',
    effect: 'ಪ್ರಭಾವ',
    positive: 'ಶುಭ',
    negative: 'ಸವಾಲಿನ',
    mixed: 'ಮಿಶ್ರ',
    transitAlerts: 'ಗೋಚಾರ ಎಚ್ಚರಿಕೆಗಳು',
    noAlerts: 'ಪ್ರಸ್ತುತ ಮಹತ್ವದ ಗೋಚಾರ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ',
    gocharTable: 'ಗೋಚಾರ ಅವಲೋಕನ',
    sadeSatiTitle: 'ಸಾಡೆ ಸಾತಿ ಸ್ಥಿತಿ',
    sadeSatiActive: 'ಸಾಡೆ ಸಾತಿ ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ',
    sadeSatiInactive: 'ಸಾಡೆ ಸಾತಿ ಸಕ್ರಿಯವಾಗಿಲ್ಲ',
    phase: 'ಹಂತ',
    retro: 'ವಕ್ರ',
  },
  mr: {
    title: 'आपले गोचर विश्लेषण',
    subtitle: 'सध्याचे ग्रह गोचर आपल्या जन्म कुंडलीवर कसा प्रभाव टाकत आहेत',
    loading: 'गोचर विश्लेषण गणना होत आहे...',
    notSignedIn: 'आपले गोचर विश्लेषण पाहण्यासाठी साइन इन करा',
    signIn: 'साइन इन',
    noBirthData: 'गोचर विश्लेषणासाठी आपले जन्म तपशील सेट करा',
    setupProfile: 'प्रोफाइल सेट करा',
    back: 'डॅशबोर्ड',
    planet: 'ग्रह',
    transitSign: 'गोचर राशी',
    house: 'भाव',
    effect: 'प्रभाव',
    positive: 'शुभ',
    negative: 'आव्हानात्मक',
    mixed: 'मिश्र',
    transitAlerts: 'गोचर सूचना',
    noAlerts: 'सध्या कोणत्याही महत्त्वपूर्ण गोचर सूचना नाहीत',
    gocharTable: 'गोचर अवलोकन',
    sadeSatiTitle: 'साडेसाती स्थिती',
    sadeSatiActive: 'साडेसाती सध्या सक्रिय आहे',
    sadeSatiInactive: 'साडेसाती सक्रिय नाही',
    phase: 'टप्पा',
    retro: 'वक्री',
  },
  gu: {
    title: 'તમારું ગોચર વિશ્લેષણ',
    subtitle: 'વર્તમાન ગ્રહ ગોચર તમારી જન્મ કુંડળીને કેવી રીતે પ્રભાવિત કરે છે',
    loading: 'ગોચર વિશ્લેષણ ગણતરી થઈ રહી છે...',
    notSignedIn: 'તમારું ગોચર વિશ્લેષણ જોવા સાઇન ઇન કરો',
    signIn: 'સાઇન ઇન',
    noBirthData: 'ગોચર વિશ્લેષણ માટે તમારી જન્મ વિગતો સેટ કરો',
    setupProfile: 'પ્રોફાઇલ સેટ કરો',
    back: 'ડૅશબોર્ડ',
    planet: 'ગ્રહ',
    transitSign: 'ગોચર રાશિ',
    house: 'ભાવ',
    effect: 'પ્રભાવ',
    positive: 'શુભ',
    negative: 'પડકારજનક',
    mixed: 'મિશ્ર',
    transitAlerts: 'ગોચર સૂચનાઓ',
    noAlerts: 'હાલમાં કોઈ મહત્વપૂર્ણ ગોચર સૂચના નથી',
    gocharTable: 'ગોચર અવલોકન',
    sadeSatiTitle: 'સાડાસાતી સ્થિતિ',
    sadeSatiActive: 'સાડાસાતી હાલમાં સક્રિય છે',
    sadeSatiInactive: 'સાડાસાતી સક્રિય નથી',
    phase: 'તબક્કો',
    retro: 'વક્રી',
  },
  mai: {
    title: 'अहाँक गोचर विश्लेषण',
    subtitle: 'वर्तमान ग्रह गोचर अहाँक जन्म कुंडलीकेँ कोना प्रभावित करैत अछि',
    loading: 'गोचर विश्लेषण गणना भऽ रहल अछि...',
    notSignedIn: 'अपन गोचर विश्लेषण देखबाक लेल साइन इन करू',
    signIn: 'साइन इन',
    noBirthData: 'गोचर विश्लेषणक लेल अपन जन्म विवरण सेट करू',
    setupProfile: 'प्रोफाइल सेट करू',
    back: 'डैशबोर्ड',
    planet: 'ग्रह',
    transitSign: 'गोचर राशि',
    house: 'भाव',
    effect: 'प्रभाव',
    positive: 'शुभ',
    negative: 'चुनौतीपूर्ण',
    mixed: 'मिश्र',
    transitAlerts: 'गोचर सूचना',
    noAlerts: 'एहि समय कोनो महत्वपूर्ण गोचर सूचना नहि अछि',
    gocharTable: 'गोचर अवलोकन',
    sadeSatiTitle: 'साढ़ेसाती स्थिति',
    sadeSatiActive: 'साढ़ेसाती वर्तमानमे सक्रिय अछि',
    sadeSatiInactive: 'साढ़ेसाती सक्रिय नहि अछि',
    phase: 'चरण',
    retro: 'वक्री',
  },
};

// ---------------------------------------------------------------------------
// Planet name lookup for Gochara engine results (IDs 0-6)
// ---------------------------------------------------------------------------
const GOCHARA_PLANET_NAMES: Record<number, Record<string, string>> = {
  0: { en: 'Sun', hi: 'सूर्य', ta: 'சூரியன்', bn: 'সূর্য' },
  1: { en: 'Moon', hi: 'चन्द्र', ta: 'சந்திரன்', bn: 'চন্দ্র' },
  2: { en: 'Mars', hi: 'मंगल', ta: 'செவ்வாய்', bn: 'মঙ্গল' },
  3: { en: 'Mercury', hi: 'बुध', ta: 'புதன்', bn: 'বুধ' },
  4: { en: 'Jupiter', hi: 'गुरु', ta: 'குரு', bn: 'গুরু' },
  5: { en: 'Venus', hi: 'शुक्र', ta: 'சுக்கிரன்', bn: 'শুক্র' },
  6: { en: 'Saturn', hi: 'शनि', ta: 'சனி', bn: 'শনি' },
};

const GOCHARA_I18N: Record<string, Record<string, string>> = {
  classicalTitle: {
    en: 'Classical Gochara (Vedha Analysis)',
    hi: 'शास्त्रीय गोचर (वेध विश्लेषण)',
    ta: 'பாரம்பரிய கோசாரம் (வேத பகுப்பாய்வு)',
    bn: 'শাস্ত্রীয় গোচর (বেধ বিশ্লেষণ)',
  },
  classicalDesc: {
    en: 'Transit quality per BPHS — houses from Moon with classical Vedha obstruction rules.',
    hi: 'BPHS अनुसार गोचर गुणवत्ता — चन्द्र से भावों पर शास्त्रीय वेध नियम।',
    ta: 'BPHS-ன் படி பெயர்ச்சி தரம் — சந்திரனிலிருந்து பாவங்கள் மற்றும் வேத தடை விதிகள்.',
    bn: 'BPHS অনুসারে গোচর মান — চন্দ্র থেকে ভাব এবং শাস্ত্রীয় বেধ নিয়ম।',
  },
  favorable: {
    en: 'Favorable', hi: 'शुभ', ta: 'சாதகமான', bn: 'শুভ',
  },
  challenging: {
    en: 'Challenging', hi: 'चुनौतीपूर्ण', ta: 'சவாலான', bn: 'চ্যালেঞ্জিং',
  },
  vedhaBy: {
    en: 'Vedha by', hi: 'वेध:', ta: 'வேதம்:', bn: 'বেধ:',
  },
  fromMoon: {
    en: 'from Moon', hi: 'चन्द्र से', ta: 'சந்திரனிலிருந்து', bn: 'চন্দ্র থেকে',
  },
  doubleTransitTitle: {
    en: 'Double Transit (Jupiter + Saturn)',
    hi: 'द्वि-गोचर (गुरु + शनि)',
    ta: 'இரட்டை பெயர்ச்சி (குரு + சனி)',
    bn: 'দ্বি-গোচর (গুরু + শনি)',
  },
  doubleTransitDesc: {
    en: 'Houses activated by BOTH Jupiter and Saturn — events in these life areas may manifest.',
    hi: 'गुरु और शनि दोनों द्वारा सक्रिय भाव — इन जीवन क्षेत्रों में घटनाएं प्रकट हो सकती हैं।',
    ta: 'குரு மற்றும் சனி இரண்டாலும் செயல்படுத்தப்பட்ட பாவங்கள் — இந்த வாழ்க்கை பகுதிகளில் நிகழ்வுகள் நடக்கலாம்.',
    bn: 'গুরু ও শনি উভয়ের দ্বারা সক্রিয় ভাব — এই জীবন ক্ষেত্রগুলিতে ঘটনা প্রকাশিত হতে পারে।',
  },
  house: {
    en: 'House', hi: 'भाव', ta: 'பாவம்', bn: 'ভাব',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TransitsPage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const L = LABELS[locale] || LABELS.en;
  const { user, initialized } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [gocharResults, setGocharResults] = useState<GocharResult[]>([]);
  const [classicalGochara, setClassicalGochara] = useState<GocharaResult[]>([]);
  const [doubleTransit, setDoubleTransit] = useState<DoubleTransitResult[]>([]);
  const [sadeSati, setSadeSati] = useState<{ isActive?: boolean; phase?: string } | null>(null);
  const [hasBirthData, setHasBirthData] = useState(false);

  const loadTransits = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) return;

      const { snapshot } = await res.json();
      if (!snapshot || !snapshot.moon_sign) {
        setHasBirthData(false);
        setLoading(false);
        return;
      }
      setHasBirthData(true);

      // Fetch full snapshot
      const { data: fullSnap } = await supabase
        .from('kundali_snapshots')
        .select('sade_sati')
        .eq('user_id', user.id)
        .single();

      // Compute gochar using existing engine
      const results = computeGochar(snapshot.ascendant_sign, snapshot.moon_sign);
      setGocharResults(results);

      // Classical Gochara engine — Vedha + BAV + Double Transit
      // Build TransitInput[] from the old gochar results (planets 0-6 only)
      const transitInputs: TransitInput[] = results
        .filter((r) => r.planetId >= 0 && r.planetId <= 6)
        .map((r) => ({ id: r.planetId, sign: r.transitSign }));

      if (transitInputs.length > 0 && snapshot.moon_sign) {
        const gResults = analyzeGochara(transitInputs, snapshot.moon_sign);
        setClassicalGochara(gResults);

        // Double transit needs Jupiter (4) and Saturn (6) signs
        const jupEntry = transitInputs.find((t) => t.id === 4);
        const satEntry = transitInputs.find((t) => t.id === 6);
        if (jupEntry && satEntry) {
          const dtResults = analyzeDoubleTransit(jupEntry.sign, satEntry.sign, snapshot.moon_sign);
          setDoubleTransit(dtResults);
        }
      }

      // Sade Sati
      if (fullSnap?.sade_sati && typeof fullSnap.sade_sati === 'object') {
        setSadeSati(fullSnap.sade_sati as { isActive?: boolean; phase?: string });
      }
    } catch (err) {
      console.error('Transit load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (initialized && user) {
      loadTransits();
    } else if (initialized && !user) {
      setLoading(false);
    }
  }, [initialized, user, loadTransits]);

  // Not signed in
  if (initialized && !user) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <Globe className="w-12 h-12 text-gold-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {L.notSignedIn}
            </h1>
            <button
              onClick={() => router.push(`/${locale}/settings`)}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              {L.signIn}
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gold-primary animate-spin mx-auto mb-3" />
          <p className="text-text-secondary">{L.loading}</p>
        </div>
      </main>
    );
  }

  // No birth data
  if (!hasBirthData) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <Globe className="w-12 h-12 text-gold-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {L.noBirthData}
            </h1>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              {L.setupProfile}
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          {L.back}
        </Link>

        {/* Header */}
        <motion.div {...fadeUp} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {L.title}
          </h1>
          <p className="text-text-secondary">{L.subtitle}</p>
        </motion.div>

        {/* Sade Sati Status */}
        {sadeSati && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className={`mb-8 p-6 rounded-2xl border backdrop-blur-sm ${
              sadeSati.isActive
                ? 'border-red-500/30 bg-red-500/5 shadow-lg shadow-red-500/10'
                : 'border-emerald-500/20 bg-emerald-500/5'
            }`}
          >
            <h2 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <AlertTriangle className={`w-5 h-5 ${sadeSati.isActive ? 'text-red-400' : 'text-emerald-400'}`} />
              {L.sadeSatiTitle}
            </h2>
            <p className={`text-sm ${sadeSati.isActive ? 'text-red-300' : 'text-emerald-400'}`}>
              {sadeSati.isActive ? L.sadeSatiActive : L.sadeSatiInactive}
            </p>
            {sadeSati.isActive && sadeSati.phase && (
              <p className="text-text-secondary text-sm mt-1">
                {L.phase}: <span className="text-gold-light font-semibold">{sadeSati.phase}</span>
              </p>
            )}
          </motion.div>
        )}

        {/* Gochar Table */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.15 }}
          className="mb-8 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gold-primary/10">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <Globe className="w-5 h-5 text-gold-primary" />
              {L.gocharTable}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/10 bg-bg-primary/30">
                  <th className="text-left p-4 text-text-secondary font-medium">{L.planet}</th>
                  <th className="text-left p-4 text-text-secondary font-medium">{L.transitSign}</th>
                  <th className="text-center p-4 text-text-secondary font-medium">{L.house}</th>
                  <th className="text-left p-4 text-text-secondary font-medium">{L.effect}</th>
                </tr>
              </thead>
              <tbody>
                {gocharResults.map((entry) => {
                  const effectColor = entry.isPositive ? 'text-emerald-400' : 'text-red-400';
                  const effectLabel = entry.isPositive ? L.positive : L.negative;
                  const effectBg = entry.isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10';

                  return (
                    <tr
                      key={entry.planetId}
                      className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <GrahaIconById id={entry.planetId} size={28} />
                          <div>
                            <span className="text-text-primary font-medium">
                              {entry.planetName[locale] || entry.planetName.en}
                            </span>
                            {entry.isRetrograde && (
                              <span className="ml-1.5 text-xs text-amber-400 font-semibold">({L.retro})</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-text-primary">
                        {entry.transitSignName[locale] || entry.transitSignName.en}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-primary/10 text-gold-light font-bold text-sm">
                          {entry.natalHouse}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${effectBg} ${effectColor}`}>
                          {effectLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Transit Alerts */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            {L.transitAlerts}
          </h2>

          {gocharResults.filter((e) => !e.isPositive && [4, 6, 7, 8].includes(e.planetId)).length === 0 ? (
            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
              <p className="text-emerald-400 text-sm">{L.noAlerts}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gocharResults
                .filter((e) => !e.isPositive && [4, 6, 7, 8].includes(e.planetId))
                .map((entry) => {
                  const isSaturn = entry.planetId === 6;
                  return (
                    <div
                      key={`alert-${entry.planetId}`}
                      className={`p-4 rounded-xl border ${
                        isSaturn ? 'border-red-500/30 bg-red-500/10' : 'border-amber-500/30 bg-amber-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <GrahaIconById id={entry.planetId} size={24} />
                        <p className="text-sm text-text-primary">
                          {entry.effect[locale] || entry.effect.en}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </motion.div>

        {/* Classical Gochara (Vedha Analysis) */}
        {classicalGochara.length > 0 && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
              <h3 className="text-gold-light font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                {GOCHARA_I18N.classicalTitle[locale] || GOCHARA_I18N.classicalTitle.en}
              </h3>
              <p className="text-text-secondary text-xs mb-4">
                {GOCHARA_I18N.classicalDesc[locale] || GOCHARA_I18N.classicalDesc.en}
              </p>
              <div className="space-y-2">
                {classicalGochara.map((g) => {
                  const qualColor =
                    g.quality === 'strong'
                      ? 'text-emerald-400'
                      : g.quality === 'moderate'
                        ? 'text-amber-300'
                        : g.quality === 'adverse'
                          ? 'text-red-400'
                          : 'text-text-secondary';
                  return (
                    <div
                      key={g.planet}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <GrahaIconById id={g.planet} size={22} />
                      <span className={`font-medium text-sm w-20 ${qualColor}`}>
                        {GOCHARA_PLANET_NAMES[g.planet]?.[locale] || GOCHARA_PLANET_NAMES[g.planet]?.en || `P${g.planet}`}
                      </span>
                      <span className="text-text-secondary text-xs w-24">
                        H{g.houseFromMoon} {GOCHARA_I18N.fromMoon[locale] || GOCHARA_I18N.fromMoon.en}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          g.isGoodHouse
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {g.isGoodHouse ? (GOCHARA_I18N.favorable[locale] || GOCHARA_I18N.favorable.en) : (GOCHARA_I18N.challenging[locale] || GOCHARA_I18N.challenging.en)}
                      </span>
                      {g.vedhaActive && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20">
                          {GOCHARA_I18N.vedhaBy[locale] || GOCHARA_I18N.vedhaBy.en} {GOCHARA_PLANET_NAMES[g.vedhaPlanet!]?.[locale] || GOCHARA_PLANET_NAMES[g.vedhaPlanet!]?.en || `P${g.vedhaPlanet}`}
                        </span>
                      )}
                      {g.bavScore !== undefined && (
                        <span className="text-xs text-text-secondary/60 ml-auto">
                          BAV: {g.bavScore}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Double Transit (Jupiter + Saturn) */}
        {doubleTransit.some((d) => d.doubleTransitActive) && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 p-5">
              <h3 className="text-purple-300 font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Double Transit (Jupiter + Saturn)
              </h3>
              <p className="text-text-secondary text-xs mb-3">
                Houses activated by BOTH Jupiter and Saturn — events in these life areas may manifest.
              </p>
              <div className="flex flex-wrap gap-2">
                {doubleTransit
                  .filter((d) => d.doubleTransitActive)
                  .map((d) => (
                    <span
                      key={d.house}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/20 text-sm font-medium"
                    >
                      House {d.house}
                    </span>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
