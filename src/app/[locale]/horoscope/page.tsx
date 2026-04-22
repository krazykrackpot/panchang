'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Briefcase, Heart, Activity, IndianRupee, Sparkles, Users } from 'lucide-react';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { Link } from '@/lib/i18n/navigation';
import ShareButton from '@/components/ui/ShareButton';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { Locale } from '@/types/panchang';
import type { DailyHoroscope } from '@/lib/horoscope/daily-engine';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/** Saved chart with optional moonSign in birth_data. */
interface SavedPerson {
  id: string;
  label: string;
  moonSign: number | null;
  relationship: string;
  isPrimary: boolean;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: "Today's Horoscope",
    subtitle: 'Based on actual planetary transits — not generic predictions',
    selectSign: 'Select your Moon sign to see your forecast',
    overallScore: 'Overall Score',
    career: 'Career',
    love: 'Love',
    health: 'Health',
    finance: 'Finance',
    spirituality: 'Spirituality',
    luckyColor: 'Lucky Color',
    luckyNumber: 'Lucky Number',
    luckyTime: 'Lucky Time',
    dailyInsight: 'Daily Insight',
    ctaTitle: 'Get personalized horoscope',
    ctaDesc: 'Generate your Kundali to unlock daily predictions tailored to your exact birth chart.',
    ctaButton: 'Generate Kundali',
  },
  hi: {
    title: 'आज का राशिफल',
    subtitle: 'वास्तविक ग्रह गोचर पर आधारित — सामान्य राशिफल नहीं',
    selectSign: 'अपनी चन्द्र राशि चुनें',
    overallScore: 'समग्र स्कोर',
    career: 'करियर',
    love: 'प्रेम',
    health: 'स्वास्थ्य',
    finance: 'वित्त',
    spirituality: 'आध्यात्म',
    luckyColor: 'शुभ रंग',
    luckyNumber: 'शुभ अंक',
    luckyTime: 'शुभ समय',
    dailyInsight: 'दैनिक अंतर्दृष्टि',
    ctaTitle: 'व्यक्तिगत राशिफल प्राप्त करें',
    ctaDesc: 'अपनी सटीक जन्म कुण्डली के अनुरूप दैनिक भविष्यवाणी पाने के लिए कुण्डली बनाएँ।',
    ctaButton: 'कुण्डली बनाएँ',
  },
  sa: {
    title: 'अद्य राशिफलम्',
    subtitle: 'वास्तविकग्रहगोचरेण आधारितम् — सामान्यराशिफलं न',
    selectSign: 'स्वचन्द्रराशिं चिनुत',
    overallScore: 'समग्रः अङ्कः',
    career: 'वृत्तिः',
    love: 'प्रेम',
    health: 'स्वास्थ्यम्',
    finance: 'वित्तम्',
    spirituality: 'आध्यात्मम्',
    luckyColor: 'शुभवर्णः',
    luckyNumber: 'शुभसंख्या',
    luckyTime: 'शुभसमयः',
    dailyInsight: 'दैनिकान्तर्दृष्टिः',
    ctaTitle: 'व्यक्तिगतं राशिफलं प्राप्नुवन्तु',
    ctaDesc: 'स्वसटीकजन्मकुण्डल्यनुरूपं दैनिकभविष्यवाणीं प्राप्तुं कुण्डलीं रचयन्तु।',
    ctaButton: 'कुण्डलीं रचयन्तु',
  },
  ta: {
    title: 'இன்றைய ராசிபலன்',
    subtitle: 'உண்மையான கிரக பெயர்ச்சிகளின் அடிப்படையில் — பொதுவான கணிப்பு அல்ல',
    selectSign: 'உங்கள் சந்திர ராசியைத் தேர்ந்தெடுக்கவும்',
    overallScore: 'ஒட்டுமொத்த மதிப்பெண்',
    career: 'தொழில்',
    love: 'காதல்',
    health: 'ஆரோக்கியம்',
    finance: 'நிதி',
    spirituality: 'ஆன்மீகம்',
    luckyColor: 'அதிர்ஷ்ட நிறம்',
    luckyNumber: 'அதிர்ஷ்ட எண்',
    luckyTime: 'அதிர்ஷ்ட நேரம்',
    dailyInsight: 'தினசரி நுண்ணறிவு',
    ctaTitle: 'தனிப்பயனாக்கப்பட்ட ராசிபலன் பெறுங்கள்',
    ctaDesc: 'உங்கள் துல்லியமான ஜாதகத்திற்கு ஏற்ற தினசரி கணிப்புகளைப் பெற ஜாதகம் உருவாக்குங்கள்.',
    ctaButton: 'ஜாதகம் உருவாக்கு',
  },
  te: {
    title: 'నేటి రాశిఫలం',
    subtitle: 'వాస్తవ గ్రహ గోచారాల ఆధారంగా — సామాన్య అంచనాలు కాదు',
    selectSign: 'మీ చంద్ర రాశిని ఎంచుకోండి',
    overallScore: 'మొత్తం స్కోర్',
    career: 'వృత్తి',
    love: 'ప్రేమ',
    health: 'ఆరోగ్యం',
    finance: 'ఆర్థికం',
    spirituality: 'ఆధ్యాత్మికం',
    luckyColor: 'శుభ రంగు',
    luckyNumber: 'శుభ సంఖ్య',
    luckyTime: 'శుభ సమయం',
    dailyInsight: 'దినసరి అంతర్దృష్టి',
    ctaTitle: 'వ్యక్తిగత రాశిఫలం పొందండి',
    ctaDesc: 'మీ ఖచ్చితమైన జన్మ చార్ట్‌కు అనుగుణమైన దినసరి అంచనాల కోసం జాతకం రూపొందించండి.',
    ctaButton: 'జాతకం రూపొందించు',
  },
  bn: {
    title: 'আজকের রাশিফল',
    subtitle: 'প্রকৃত গ্রহ গোচরের ভিত্তিতে — সাধারণ ভবিষ্যদ্বাণী নয়',
    selectSign: 'আপনার চন্দ্র রাশি নির্বাচন করুন',
    overallScore: 'সামগ্রিক স্কোর',
    career: 'কর্মজীবন',
    love: 'প্রেম',
    health: 'স্বাস্থ্য',
    finance: 'অর্থ',
    spirituality: 'আধ্যাত্মিকতা',
    luckyColor: 'শুভ রঙ',
    luckyNumber: 'শুভ সংখ্যা',
    luckyTime: 'শুভ সময়',
    dailyInsight: 'দৈনিক অন্তর্দৃষ্টি',
    ctaTitle: 'ব্যক্তিগত রাশিফল পান',
    ctaDesc: 'আপনার সুনির্দিষ্ট জন্ম কুণ্ডলী অনুসারে দৈনিক ভবিষ্যদ্বাণী পেতে জাতক তৈরি করুন।',
    ctaButton: 'জাতক তৈরি করুন',
  },
  kn: {
    title: 'ಇಂದಿನ ರಾಶಿಭವಿಷ್ಯ',
    subtitle: 'ನಿಜವಾದ ಗ್ರಹ ಗೋಚಾರಗಳ ಆಧಾರದ ಮೇಲೆ — ಸಾಮಾನ್ಯ ಭವಿಷ್ಯವಲ್ಲ',
    selectSign: 'ನಿಮ್ಮ ಚಂದ್ರ ರಾಶಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    overallScore: 'ಒಟ್ಟಾರೆ ಸ್ಕೋರ್',
    career: 'ವೃತ್ತಿ',
    love: 'ಪ್ರೀತಿ',
    health: 'ಆರೋಗ್ಯ',
    finance: 'ಹಣಕಾಸು',
    spirituality: 'ಆಧ್ಯಾತ್ಮಿಕ',
    luckyColor: 'ಶುಭ ಬಣ್ಣ',
    luckyNumber: 'ಶುಭ ಸಂಖ್ಯೆ',
    luckyTime: 'ಶುಭ ಸಮಯ',
    dailyInsight: 'ದೈನಿಕ ಒಳನೋಟ',
    ctaTitle: 'ವೈಯಕ್ತಿಕ ರಾಶಿಭವಿಷ್ಯ ಪಡೆಯಿರಿ',
    ctaDesc: 'ನಿಮ್ಮ ನಿಖರ ಜನ್ಮ ಜಾತಕಕ್ಕೆ ಅನುಗುಣವಾದ ದೈನಿಕ ಮುನ್ಸೂಚನೆಗಳನ್ನು ಪಡೆಯಲು ಜಾತಕ ರಚಿಸಿ.',
    ctaButton: 'ಜಾತಕ ರಚಿಸಿ',
  },
  mr: {
    title: 'आजचे राशीभविष्य',
    subtitle: 'वास्तविक ग्रह गोचरावर आधारित — सामान्य भविष्य नाही',
    selectSign: 'आपली चंद्र राशी निवडा',
    overallScore: 'एकूण गुण',
    career: 'करिअर',
    love: 'प्रेम',
    health: 'आरोग्य',
    finance: 'वित्त',
    spirituality: 'अध्यात्म',
    luckyColor: 'शुभ रंग',
    luckyNumber: 'शुभ अंक',
    luckyTime: 'शुभ वेळ',
    dailyInsight: 'दैनिक अंतर्दृष्टी',
    ctaTitle: 'वैयक्तिक राशीभविष्य मिळवा',
    ctaDesc: 'आपल्या अचूक जन्म कुंडलीनुसार दैनिक भाकीत मिळवण्यासाठी कुंडली बनवा.',
    ctaButton: 'कुंडली बनवा',
  },
  gu: {
    title: 'આજનું રાશિભવિષ્ય',
    subtitle: 'વાસ્તવિક ગ્રહ ગોચર પર આધારિત — સામાન્ય ભવિષ્ય નહીં',
    selectSign: 'તમારી ચંદ્ર રાશિ પસંદ કરો',
    overallScore: 'કુલ સ્કોર',
    career: 'કારકિર્દી',
    love: 'પ્રેમ',
    health: 'આરોગ્ય',
    finance: 'નાણાં',
    spirituality: 'આધ્યાત્મ',
    luckyColor: 'શુભ રંગ',
    luckyNumber: 'શુભ અંક',
    luckyTime: 'શુભ સમય',
    dailyInsight: 'દૈનિક આંતરદૃષ્ટિ',
    ctaTitle: 'વ્યક્તિગત રાશિભવિષ્ય મેળવો',
    ctaDesc: 'તમારી ચોક્કસ જન્મ કુંડળી અનુસાર દૈનિક ભવિષ્યવાણી મેળવવા કુંડળી બનાવો.',
    ctaButton: 'કુંડળી બનાવો',
  },
  mai: {
    title: 'आइक राशिफल',
    subtitle: 'वास्तविक ग्रह गोचर पर आधारित — सामान्य राशिफल नहि',
    selectSign: 'अपन चंद्र राशि चुनू',
    overallScore: 'समग्र स्कोर',
    career: 'करियर',
    love: 'प्रेम',
    health: 'स्वास्थ्य',
    finance: 'वित्त',
    spirituality: 'अध्यात्म',
    luckyColor: 'शुभ रंग',
    luckyNumber: 'शुभ अंक',
    luckyTime: 'शुभ समय',
    dailyInsight: 'दैनिक अंतर्दृष्टि',
    ctaTitle: 'व्यक्तिगत राशिफल प्राप्त करू',
    ctaDesc: 'अपन सटीक जन्म कुंडलीक अनुरूप दैनिक भविष्यवाणी पाबाक लेल कुंडली बनाउ.',
    ctaButton: 'कुंडली बनाउ',
  },
};

const AREA_ICONS = {
  career: Briefcase,
  love: Heart,
  health: Activity,
  finance: IndianRupee,
  spirituality: Sparkles,
};

const AREA_COLORS: Record<string, string> = {
  career: 'from-blue-400 to-blue-600',
  love: 'from-pink-400 to-rose-600',
  health: 'from-emerald-400 to-green-600',
  finance: 'from-amber-400 to-yellow-600',
  spirituality: 'from-purple-400 to-violet-600',
};

function scoreColor(score: number): string {
  if (score >= 7) return 'text-emerald-400';
  if (score >= 4) return 'text-amber-400';
  return 'text-red-400';
}

function barColor(score: number): string {
  if (score >= 7) return 'bg-emerald-500';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function HoroscopePage() {
  const locale = useLocale() as Locale;
  const lk = (isDevanagariLocale(locale)) ? 'hi' as const : 'en' as const;
  const isHi = lk === 'hi';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
  const L = LABELS[locale] || LABELS.en;

  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [activePerson, setActivePerson] = useState<string | null>(null); // 'self' or chart id
  const [savedPeople, setSavedPeople] = useState<SavedPerson[]>([]);
  const [date, setDate] = useState('');
  const autoFetched = useRef(false);

  // Load birth data from localStorage on mount
  const { birthRashi, birthName, loadFromStorage } = useBirthDataStore();
  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  const user = useAuthStore(s => s.user);

  // Fetch saved charts for logged-in users (extract moonSign from birth_data)
  useEffect(() => {
    if (!user) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase
      .from('saved_charts')
      .select('id, label, birth_data, is_primary')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        const people: SavedPerson[] = data
          .map((c: { id: string; label: string; birth_data: Record<string, unknown>; is_primary: boolean }) => ({
            id: c.id,
            label: c.label,
            moonSign: typeof c.birth_data?.moonSign === 'number' ? c.birth_data.moonSign : null,
            relationship: (c.birth_data?.relationship as string) || 'other',
            isPrimary: c.is_primary,
          }))
          .filter((p: SavedPerson) => p.moonSign !== null && p.moonSign >= 1 && p.moonSign <= 12);
        setSavedPeople(people);
      });
  }, [user]);

  // Compute today's date string
  useEffect(() => {
    const now = new Date();
    setDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
  }, []);

  // Auto-select user's birth rashi and fetch horoscope on first load
  useEffect(() => {
    if (autoFetched.current || !date || !birthRashi || birthRashi < 1 || birthRashi > 12) return;
    autoFetched.current = true;
    setSelectedSign(birthRashi);
    setActivePerson('self');
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/horoscope/daily?moonSign=${birthRashi}&date=${date}`);
        if (res.ok) {
          const data: DailyHoroscope = await res.json();
          setHoroscope(data);
        }
      } catch (err) {
        console.error('[horoscope] auto-fetch failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [date, birthRashi]);

  const fetchHoroscope = useCallback(async (signId: number) => {
    setLoading(true);
    setHoroscope(null);
    try {
      const res = await fetch(`/api/horoscope/daily?moonSign=${signId}&date=${date}`);
      if (res.ok) {
        const data: DailyHoroscope = await res.json();
        setHoroscope(data);
      }
    } catch (err) {
      console.error('Failed to fetch daily horoscope:', err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  const handleSelect = (signId: number) => {
    if (selectedSign === signId) {
      setSelectedSign(null);
      setHoroscope(null);
      setActivePerson(null);
      return;
    }
    setSelectedSign(signId);
    setActivePerson(null); // manual selection clears person context
    if (date) fetchHoroscope(signId);
  };

  /** Switch to a saved person's moon sign. */
  const handlePersonSwitch = (person: SavedPerson | 'self') => {
    if (person === 'self') {
      if (!birthRashi || birthRashi < 1) return;
      setSelectedSign(birthRashi);
      setActivePerson('self');
      if (date) fetchHoroscope(birthRashi);
    } else {
      if (!person.moonSign) return;
      setSelectedSign(person.moonSign);
      setActivePerson(person.id);
      if (date) fetchHoroscope(person.moonSign);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient mb-3" style={headingFont}>
              {L.title}
            </h1>
            <p className="text-text-secondary text-sm" style={bodyFont}>{L.subtitle}</p>
            {date && <p className="text-gold-dark text-xs mt-2">{date}</p>}
          </div>

          {/* Person switcher — visible when user has saved charts with moonSign */}
          {(birthRashi > 0 || savedPeople.length > 0) && (
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
              <Users className="w-4 h-4 text-text-secondary shrink-0" />
              {/* Self pill */}
              {birthRashi > 0 && (
                <button
                  onClick={() => handlePersonSwitch('self')}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activePerson === 'self'
                      ? 'bg-gold-primary/20 border-gold-primary/50 text-gold-light'
                      : 'border-gold-primary/15 text-text-secondary hover:border-gold-primary/30 hover:text-text-primary'
                  }`}
                  style={bodyFont}
                >
                  {birthName || (isHi ? 'स्वयं' : 'Me')}
                  <span className="ml-1 text-[10px] opacity-60">
                    {RASHIS[birthRashi - 1]?.name[lk]}
                  </span>
                </button>
              )}
              {/* Saved people pills */}
              {savedPeople
                .filter(p => !(p.isPrimary && p.moonSign === birthRashi)) // don't duplicate self
                .map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePersonSwitch(p)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activePerson === p.id
                      ? 'bg-gold-primary/20 border-gold-primary/50 text-gold-light'
                      : 'border-gold-primary/15 text-text-secondary hover:border-gold-primary/30 hover:text-text-primary'
                  }`}
                  style={bodyFont}
                >
                  {p.label}
                  {p.moonSign && (
                    <span className="ml-1 text-[10px] opacity-60">
                      {RASHIS[p.moonSign - 1]?.name[lk]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Sign grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
            {RASHIS.map((r) => (
              <motion.button key={r.id} onClick={() => handleSelect(r.id)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border rounded-xl p-4 text-center transition-all ${
                  selectedSign === r.id
                    ? 'border-gold-primary/50 ring-1 ring-gold-primary/30 bg-gold-primary/10'
                    : 'border-gold-primary/12 hover:border-gold-primary/25'
                }`}>
                <div className="flex justify-center mb-2"><RashiIconById id={r.id} size={36} /></div>
                <div className="text-gold-light text-xs font-bold" style={headingFont}>{r.name[lk]}</div>
                <Link href={`/horoscope/${r.slug}` as '/horoscope'} onClick={(e) => e.stopPropagation()}
                  className="text-[10px] text-gold-dark hover:text-gold-primary mt-1 block transition-colors">
                  {r.name.en}
                </Link>
              </motion.button>
            ))}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gold-primary mx-auto" />
            </div>
          )}

          {/* Horoscope result */}
          <AnimatePresence mode="wait">
            {horoscope && !loading && (
              <motion.div key={horoscope.moonSign}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto space-y-6">

                {/* Header card with overall score */}
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <RashiIconById id={horoscope.moonSign} size={56} />
                    <div className="flex-1">
                      <h2 className="text-gold-light text-2xl font-bold" style={headingFont}>
                        {horoscope.moonSignName[lk]}
                      </h2>
                      <p className="text-text-secondary text-xs">{horoscope.date}</p>
                      {selectedSign && (
                        <Link href={`/horoscope/${RASHIS[selectedSign - 1]?.slug}` as '/horoscope'}
                          className="text-gold-primary hover:text-gold-light text-xs mt-1 inline-block transition-colors">
                          {lk === 'hi' ? 'पूर्ण राशिफल देखें' : 'View full horoscope'} &rarr;
                        </Link>
                      )}
                    </div>
                    {/* Circular gauge */}
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor"
                          className="text-white/5" strokeWidth="6" />
                        <circle cx="40" cy="40" r="34" fill="none"
                          strokeWidth="6" strokeLinecap="round"
                          className={scoreColor(horoscope.overallScore)}
                          stroke="currentColor"
                          strokeDasharray={`${(horoscope.overallScore / 10) * 213.6} 213.6`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-xl font-bold ${scoreColor(horoscope.overallScore)}`}>
                          {horoscope.overallScore}
                        </span>
                        <span className="text-[10px] text-text-secondary">/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Daily insight */}
                  <div className="bg-gold-primary/5 border border-gold-primary/10 rounded-xl p-4 mb-5">
                    <p className="text-xs text-gold-dark uppercase tracking-wider mb-1 font-semibold">{L.dailyInsight}</p>
                    <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
                      {horoscope.insight[lk]}
                    </p>
                  </div>

                  {/* Lucky trio */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider">{L.luckyColor}</p>
                      <p className="text-gold-light text-sm font-semibold mt-1" style={bodyFont}>
                        {horoscope.luckyColor[lk]}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider">{L.luckyNumber}</p>
                      <p className="text-gold-light text-sm font-semibold mt-1">{horoscope.luckyNumber}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider">{L.luckyTime}</p>
                      <p className="text-gold-light text-sm font-semibold mt-1">{horoscope.luckyTime}</p>
                    </div>
                  </div>
                </div>

                {/* Area cards */}
                <div className="space-y-3">
                  {(['career', 'love', 'health', 'finance', 'spirituality'] as const).map((area) => {
                    const Icon = AREA_ICONS[area];
                    const areaData = horoscope.areas[area];
                    return (
                      <div key={area}
                        className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${AREA_COLORS[area]} bg-opacity-20`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-text-primary text-sm font-semibold flex-1" style={bodyFont}>
                            {L[area]}
                          </span>
                          <span className={`text-sm font-bold ${scoreColor(areaData.score)}`}>
                            {areaData.score}/10
                          </span>
                        </div>
                        {/* Score bar */}
                        <div className="w-full h-1.5 bg-white/5 rounded-full mb-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${areaData.score * 10}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' as const }}
                            className={`h-full rounded-full ${barColor(areaData.score)}`}
                          />
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                          {areaData.text[lk]}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Share buttons */}
                <div className="flex justify-center">
                  <ShareButton
                    title={`${horoscope.moonSignName[lk]} — ${L.title}`}
                    text={`Today's ${horoscope.moonSignName.en} Horoscope — Score: ${horoscope.overallScore}/10 | dekhopanchang.com`}
                    url={`https://dekhopanchang.com/${locale}/horoscope`}
                    locale={locale}
                  />
                </div>

                {/* CTA — generate kundali */}
                <div className="bg-gradient-to-br from-gold-primary/10 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 text-center">
                  <h3 className="text-gold-light text-lg font-bold mb-2" style={headingFont}>{L.ctaTitle}</h3>
                  <p className="text-text-secondary text-sm mb-4" style={bodyFont}>{L.ctaDesc}</p>
                  <Link href="/kundali"
                    className="inline-block px-6 py-2.5 bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold rounded-xl hover:brightness-110 transition-all">
                    {L.ctaButton}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No sign selected prompt */}
          {!selectedSign && !loading && (
            <p className="text-text-secondary text-sm text-center mt-4" style={bodyFont}>
              {L.selectSign}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
