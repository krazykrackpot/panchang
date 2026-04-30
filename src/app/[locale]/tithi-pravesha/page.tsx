'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Moon, Sun, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { calculateTithiPravesha } from '@/lib/kundali/tithi-pravesha';
import type { TithiPraveshaResult } from '@/lib/kundali/tithi-pravesha';
import { TITHIS } from '@/lib/constants/tithis';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import type { Locale } from '@/types/panchang';

/* ─── Tithi Lord mapping (1-indexed tithi within a paksha) ─── */
const TITHI_LORD_DATA: Record<number, { lord: string; lordHi: string; theme: string; themeHi: string }> = {
  1:  { lord: 'Sun',     lordHi: 'सूर्य',   theme: 'A year of leadership, authority, and taking charge of your destiny.',           themeHi: 'नेतृत्व, अधिकार और अपनी नियति पर नियंत्रण का वर्ष।' },
  2:  { lord: 'Moon',    lordHi: 'चन्द्र',   theme: 'A year of emotional growth, family bonds, and inner nurturing.',                themeHi: 'भावनात्मक विकास, पारिवारिक बन्धन और आन्तरिक पोषण का वर्ष।' },
  3:  { lord: 'Mars',    lordHi: 'मंगल',    theme: 'A year of energy, courage, and launching new ventures.',                        themeHi: 'ऊर्जा, साहस और नए उद्यमों का वर्ष।' },
  4:  { lord: 'Mercury', lordHi: 'बुध',     theme: 'A year of communication, learning, and intellectual pursuits.',                 themeHi: 'संवाद, शिक्षा और बौद्धिक साधना का वर्ष।' },
  5:  { lord: 'Jupiter', lordHi: 'बृहस्पति', theme: 'A year of wisdom, expansion, and good fortune.',                               themeHi: 'ज्ञान, विस्तार और सौभाग्य का वर्ष।' },
  6:  { lord: 'Venus',   lordHi: 'शुक्र',   theme: 'A year of relationships, comforts, and artistic expression.',                   themeHi: 'सम्बन्धों, सुखों और कलात्मक अभिव्यक्ति का वर्ष।' },
  7:  { lord: 'Saturn',  lordHi: 'शनि',    theme: 'A year of discipline, hard work, and karmic reckoning.',                        themeHi: 'अनुशासन, कठोर परिश्रम और कर्मफल का वर्ष।' },
  8:  { lord: 'Rahu',    lordHi: 'राहु',    theme: 'A year of transformation, unexpected changes, and breaking patterns.',          themeHi: 'रूपान्तरण, अप्रत्याशित परिवर्तन और पुराने ढर्रे तोड़ने का वर्ष।' },
  9:  { lord: 'Sun',     lordHi: 'सूर्य',   theme: 'A year of authority, spiritual growth, and self-realization.',                  themeHi: 'अधिकार, आध्यात्मिक विकास और आत्मबोध का वर्ष।' },
  10: { lord: 'Moon',    lordHi: 'चन्द्र',   theme: 'A year of prosperity, emotional fulfillment, and abundance.',                  themeHi: 'समृद्धि, भावनात्मक सन्तुष्टि और प्रचुरता का वर्ष।' },
  11: { lord: 'Mars',    lordHi: 'मंगल',    theme: 'A year of action, determination, and overcoming obstacles.',                    themeHi: 'कर्म, संकल्प और बाधाओं पर विजय का वर्ष।' },
  12: { lord: 'Mercury', lordHi: 'बुध',     theme: 'A year of intellect, trade, and enriching travels.',                           themeHi: 'बुद्धि, व्यापार और समृद्ध यात्राओं का वर्ष।' },
  13: { lord: 'Jupiter', lordHi: 'बृहस्पति', theme: 'A year of fortune, spiritual progress, and higher learning.',                  themeHi: 'भाग्य, आध्यात्मिक प्रगति और उच्च शिक्षा का वर्ष।' },
  14: { lord: 'Venus',   lordHi: 'शुक्र',   theme: 'A year of luxury, partnerships, and creative fulfillment.',                    themeHi: 'विलासिता, साझेदारी और रचनात्मक सन्तुष्टि का वर्ष।' },
  15: { lord: 'Saturn',  lordHi: 'शनि',    theme: 'A year of endings, deep introspection, and karmic closure.',                    themeHi: 'समापन, गहन आत्मनिरीक्षण और कर्म-समापन का वर्ष।' },
};

/** Get tithi lord data for a given tithi number (1-30) */
function getTithiLord(tithiNum: number): typeof TITHI_LORD_DATA[1] {
  // Map 1-30 to 1-15 (both pakshas share the same lord pattern)
  const idx = tithiNum <= 15 ? tithiNum : tithiNum - 15;
  return TITHI_LORD_DATA[idx] || TITHI_LORD_DATA[1];
}

/** Get rashi name from sidereal longitude */
function getRashiFromLongitude(longitude: number) {
  const rashiIndex = Math.floor(((longitude % 360) + 360) % 360 / 30);
  return RASHIS[rashiIndex] || RASHIS[0];
}

/** Format degrees as "DD:MM:SS" */
function formatDeg(longitude: number): string {
  const normLng = ((longitude % 360) + 360) % 360;
  const inSign = normLng % 30;
  const deg = Math.floor(inSign);
  const minFull = (inSign - deg) * 60;
  const min = Math.floor(minFull);
  return `${deg}\u00B0${min.toString().padStart(2, '0')}'`;
}

const LABELS = {
  title: { en: 'Tithi Pravesha', hi: 'तिथि प्रवेश', sa: 'तिथिप्रवेशः' },
  subtitle: { en: 'Your Vedic Birthday', hi: 'आपका वैदिक जन्मदिन', sa: 'भवतः वैदिकजन्मदिवसः' },
  description: {
    en: 'Discover the exact date when your birth tithi (lunar day) recurs each year. Unlike the solar calendar birthday, this follows the Moon — shifting by 10-12 days annually.',
    hi: 'प्रत्येक वर्ष अपनी जन्म तिथि (चान्द्र दिवस) की पुनरावृत्ति की सटीक तारीख खोजें। सौर कैलेंडर जन्मदिन के विपरीत, यह चन्द्रमा का अनुसरण करता है।',
    sa: 'प्रतिवर्षं भवतः जन्मतिथेः पुनरावृत्तेः सटीकं दिनाङ्कं ज्ञातुम् अर्हति। सौरपञ्चाङ्गजन्मदिवसात् भिन्नम् इदं चन्द्रमानुसारम्।',
  },
  birthDate: { en: 'Date of Birth', hi: 'जन्म तिथि', sa: 'जन्मदिनाङ्कः' },
  birthTime: { en: 'Time of Birth', hi: 'जन्म समय', sa: 'जन्मसमयः' },
  birthPlace: { en: 'Birth Place', hi: 'जन्म स्थान', sa: 'जन्मस्थानम्' },
  targetYear: { en: 'Year', hi: 'वर्ष', sa: 'वर्षम्' },
  calculate: { en: 'Find Vedic Birthday', hi: 'वैदिक जन्मदिन खोजें', sa: 'वैदिकजन्मदिवसं अन्विष्यतु' },
  resultHeading: { en: 'Your Vedic Birthday in', hi: 'में आपका वैदिक जन्मदिन', sa: 'वर्षे भवतः वैदिकजन्मदिवसः' },
  birthTithi: { en: 'Birth Tithi', hi: 'जन्म तिथि', sa: 'जन्मतिथिः' },
  paksha: { en: 'Paksha', hi: 'पक्ष', sa: 'पक्षः' },
  shukla: { en: 'Shukla (Waxing)', hi: 'शुक्ल (बढ़ता चन्द्र)', sa: 'शुक्लपक्षः' },
  krishna: { en: 'Krishna (Waning)', hi: 'कृष्ण (घटता चन्द्र)', sa: 'कृष्णपक्षः' },
  praveshaDate: { en: 'Pravesha Date', hi: 'प्रवेश तिथि', sa: 'प्रवेशदिनाङ्कः' },
  praveshaTime: { en: 'Pravesha Time', hi: 'प्रवेश समय', sa: 'प्रवेशसमयः' },
  tithiLord: { en: 'Year Lord (Tithi Lord)', hi: 'वर्ष स्वामी (तिथि स्वामी)', sa: 'वर्षस्वामी (तिथिस्वामी)' },
  yearTheme: { en: 'Year Theme', hi: 'वर्ष की थीम', sa: 'वर्षविषयः' },
  sunAt: { en: 'Sun at Pravesha', hi: 'प्रवेश पर सूर्य', sa: 'प्रवेशे सूर्यः' },
  moonAt: { en: 'Moon at Pravesha', hi: 'प्रवेश पर चन्द्र', sa: 'प्रवेशे चन्द्रः' },
  varshaphalLink: { en: 'For detailed annual predictions', hi: 'विस्तृत वार्षिक भविष्यवाणी के लिए', sa: 'विस्तृतवार्षिकभविष्यवाण्यर्थम्' },
  varshaphal: { en: 'Varshaphal', hi: 'वर्षफल', sa: 'वर्षफलम्' },
  noResult: { en: 'Could not find Tithi Pravesha for this year. Try adjusting the birth data.', hi: 'इस वर्ष के लिए तिथि प्रवेश नहीं मिला। जन्म डेटा समायोजित करें।', sa: 'अस्मिन् वर्षे तिथिप्रवेशः न प्राप्तः। जन्मदत्तांशं समायोजयतु।' },
  useSavedData: { en: 'Use Saved Birth Data', hi: 'सहेजा गया जन्म डेटा उपयोग करें', sa: 'संरक्षितजन्मदत्तांशं उपयुज्यताम्' },
  calculating: { en: 'Calculating...', hi: 'गणना हो रही है...', sa: 'गणना प्रचलति...' },
};

const currentYear = new Date().getFullYear();

export default function TithiPraveshaPage() {
  const locale = useLocale() as Locale;
  const learnLinks = getLearnLinksForTool('/tithi-pravesha');
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const l = useCallback((obj: Record<string, string>) => tl(obj, locale), [locale]);

  // ─── Form state ───
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('12:00');
  const [placeName, setPlaceName] = useState('');
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);
  const [placeTimezone, setPlaceTimezone] = useState<string | null>(null);
  const [targetYear, setTargetYear] = useState(currentYear);
  const [autoFilled, setAutoFilled] = useState(false);

  // ─── Result state ───
  const [result, setResult] = useState<TithiPraveshaResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  // ─── Auto-fill from user profile ───
  const { user, initialized } = useAuthStore();
  useEffect(() => {
    if (!initialized || !user || autoFilled) return;
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.from('user_profiles')
      .select('date_of_birth, time_of_birth, birth_time_known, birth_place, birth_lat, birth_lng')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          console.error('[tithi-pravesha] Failed to load profile:', fetchError);
          return;
        }
        if (data?.date_of_birth && data?.birth_lat != null) {
          setDateStr(data.date_of_birth);
          if (data.time_of_birth && data.birth_time_known) {
            setTimeStr(data.time_of_birth.substring(0, 5));
          }
          setPlaceName(data.birth_place || '');
          setPlaceLat(data.birth_lat);
          setPlaceLng(data.birth_lng);
          // ALWAYS resolve timezone from coordinates — never trust stored birth_timezone
          if (data.birth_lat && data.birth_lng) {
            resolveTimezoneFromCoords(Number(data.birth_lat), Number(data.birth_lng))
              .then(tz => setPlaceTimezone(tz))
              .catch(err => console.error('[tithi-pravesha] Timezone resolve failed:', err));
          }
          setAutoFilled(true);
        }
      });
  }, [initialized, user, autoFilled]);

  // ─── Year options (current ± 5) ───
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = currentYear - 5; y <= currentYear + 5; y++) years.push(y);
    return years;
  }, []);

  // ─── Calculate ───
  const handleCalculate = useCallback(() => {
    if (!dateStr || placeLat === null || placeLng === null) {
      setError(locale === 'hi' ? 'कृपया सभी फ़ील्ड भरें।' : 'Please fill in all fields.');
      return;
    }
    setError('');
    setCalculating(true);
    setResult(null);

    // Use setTimeout to let the UI update with the loading state
    setTimeout(() => {
      try {
        const [yearStr, monthStr, dayStr] = dateStr.split('-');
        const birthYear = parseInt(yearStr, 10);
        const birthMonth = parseInt(monthStr, 10);
        const birthDay = parseInt(dayStr, 10);

        // Resolve timezone offset for the birth date from coordinates
        let tzOffset = 5.5; // safe fallback; will be overridden
        if (placeTimezone) {
          tzOffset = getUTCOffsetForDate(birthYear, birthMonth, birthDay, placeTimezone);
        }

        const res = calculateTithiPravesha(
          birthYear, birthMonth, birthDay,
          targetYear, placeLat, placeLng, tzOffset
        );

        setResult(res);
        setHasCalculated(true);
      } catch (err) {
        console.error('[tithi-pravesha] Calculation error:', err);
        setError(locale === 'hi' ? 'गणना में त्रुटि। कृपया पुनः प्रयास करें।' : 'Calculation error. Please try again.');
      } finally {
        setCalculating(false);
      }
    }, 50);
  }, [dateStr, placeLat, placeLng, placeTimezone, targetYear, locale]);

  // ─── Derived display data ───
  const displayData = useMemo(() => {
    if (!result) return null;

    const tithiObj = TITHIS.find(t => t.number === result.birthTithi);
    const tithiName = tithiObj ? tl(tithiObj.name, locale) : `Tithi ${result.birthTithi}`;
    const lordData = getTithiLord(result.birthTithi);

    const sunRashi = getRashiFromLongitude(result.sunLongitude);
    const moonRashi = getRashiFromLongitude(result.moonLongitude);

    const praveshaDateFormatted = (() => {
      const d = new Date(result.praveshaDate + 'T00:00:00');
      return d.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    })();

    return {
      tithiName,
      lordData,
      sunRashi,
      moonRashi,
      sunDeg: formatDeg(result.sunLongitude),
      moonDeg: formatDeg(result.moonLongitude),
      praveshaDateFormatted,
    };
  }, [result, locale]);

  const canCalculate = dateStr && placeLat !== null && placeLng !== null;

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* ─── Hero Section ─── */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b69]/40 via-bg-primary to-bg-primary" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-gold-primary/20 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-primary/20 bg-gold-primary/5 mb-6">
              <Moon className="w-4 h-4 text-gold-primary" />
              <span className="text-xs font-medium text-gold-primary tracking-wide uppercase" style={bodyFont}>
                {l(LABELS.subtitle)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-4" style={headingFont}>
              {l(LABELS.title)}
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={bodyFont}>
              {l(LABELS.description)}
            </p>
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* ─── Form Section ─── */}
      <section className="max-w-2xl mx-auto px-4 py-10">
        <motion.div
          className="rounded-2xl border border-gold-primary/15 bg-bg-secondary p-6 md:p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
        >
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5" style={bodyFont}>
              {l(LABELS.birthDate)}
            </label>
            <input
              type="date"
              value={dateStr}
              onChange={e => setDateStr(e.target.value)}
              className="w-full rounded-lg border border-gold-primary/20 bg-bg-primary px-4 py-2.5 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
              max={`${currentYear}-12-31`}
            />
          </div>

          {/* Time of Birth */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5" style={bodyFont}>
              {l(LABELS.birthTime)}
            </label>
            <input
              type="time"
              value={timeStr}
              onChange={e => setTimeStr(e.target.value)}
              className="w-full rounded-lg border border-gold-primary/20 bg-bg-primary px-4 py-2.5 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
            />
          </div>

          {/* Birth Place */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5" style={bodyFont}>
              {l(LABELS.birthPlace)}
            </label>
            <LocationSearch
              value={placeName}
              onSelect={(loc) => {
                setPlaceName(loc.name);
                setPlaceLat(loc.lat);
                setPlaceLng(loc.lng);
                setPlaceTimezone(loc.timezone);
              }}
              placeholder={locale === 'hi' ? 'जन्म स्थान खोजें...' : 'Search birth place...'}
            />
          </div>

          {/* Target Year */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5" style={bodyFont}>
              {l(LABELS.targetYear)}
            </label>
            <div className="relative">
              <select
                value={targetYear}
                onChange={e => setTargetYear(parseInt(e.target.value, 10))}
                className="w-full rounded-lg border border-gold-primary/20 bg-bg-primary px-4 py-2.5 text-text-primary focus:outline-none focus:border-gold-primary/50 appearance-none transition-colors"
              >
                {yearOptions.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2 border border-red-500/20" style={bodyFont}>
              {error}
            </div>
          )}

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={!canCalculate || calculating}
            className="w-full py-3 rounded-xl font-semibold text-base transition-all duration-200
              bg-gradient-to-r from-gold-dark via-gold-primary to-gold-light
              text-bg-primary hover:shadow-lg hover:shadow-gold-primary/20
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            style={headingFont}
          >
            {calculating ? l(LABELS.calculating) : l(LABELS.calculate)}
          </button>
        </motion.div>
      </section>

      {/* ─── Results Section ─── */}
      <AnimatePresence mode="wait">
        {hasCalculated && (
          <motion.section
            key="results"
            className="max-w-3xl mx-auto px-4 pb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            {result && displayData ? (
              <div className="space-y-6">
                {/* Main Result Card */}
                <div className="rounded-2xl border border-gold-primary/20 bg-bg-secondary overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#2d1b69]/50 to-bg-secondary px-6 py-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-gold-light" style={headingFont}>
                      {locale === 'hi'
                        ? `${result.year} ${l(LABELS.resultHeading)}`
                        : `${l(LABELS.resultHeading)} ${result.year}`
                      }
                    </h2>
                  </div>

                  <div className="px-6 py-6 space-y-6">
                    {/* Pravesha Date — prominently displayed */}
                    <div className="text-center py-4 rounded-xl bg-gold-primary/5 border border-gold-primary/10">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-gold-primary" />
                        <span className="text-sm text-text-secondary uppercase tracking-wide" style={bodyFont}>
                          {l(LABELS.praveshaDate)}
                        </span>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-gold-light" style={headingFont}>
                        {displayData.praveshaDateFormatted}
                      </p>
                      <p className="text-lg text-gold-primary mt-1" style={bodyFont}>
                        {result.praveshaTime} {locale === 'hi' ? '(स्थानीय समय)' : '(local time)'}
                      </p>
                    </div>

                    {/* Birth Tithi + Paksha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-bg-primary/50 border border-gold-primary/10 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Moon className="w-4 h-4 text-gold-primary/70" />
                          <span className="text-xs text-text-secondary uppercase tracking-wide" style={bodyFont}>{l(LABELS.birthTithi)}</span>
                        </div>
                        <p className="text-lg font-semibold text-text-primary" style={headingFont}>
                          {displayData.tithiName}
                        </p>
                      </div>
                      <div className="rounded-xl bg-bg-primary/50 border border-gold-primary/10 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Moon className="w-4 h-4 text-gold-primary/70" />
                          <span className="text-xs text-text-secondary uppercase tracking-wide" style={bodyFont}>{l(LABELS.paksha)}</span>
                        </div>
                        <p className="text-lg font-semibold text-text-primary" style={headingFont}>
                          {result.birthPaksha === 'shukla' ? l(LABELS.shukla) : l(LABELS.krishna)}
                        </p>
                      </div>
                    </div>

                    <GoldDivider />

                    {/* Tithi Lord + Year Theme */}
                    <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/20 to-bg-primary/50 border border-gold-primary/10 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-gold-primary" />
                        <h3 className="text-base font-semibold text-gold-light" style={headingFont}>
                          {l(LABELS.tithiLord)}
                        </h3>
                      </div>
                      <p className="text-xl font-bold text-gold-primary mb-3" style={headingFont}>
                        {locale === 'hi'
                          ? displayData.lordData.lordHi
                          : displayData.lordData.lord
                        }
                      </p>
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-text-secondary uppercase tracking-wide mt-0.5 shrink-0" style={bodyFont}>
                          {l(LABELS.yearTheme)}:
                        </span>
                        <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
                          {locale === 'hi' ? displayData.lordData.themeHi : displayData.lordData.theme}
                        </p>
                      </div>
                    </div>

                    {/* Sun/Moon positions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-bg-primary/50 border border-gold-primary/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sun className="w-4 h-4 text-amber-400" />
                          <span className="text-xs text-text-secondary uppercase tracking-wide" style={bodyFont}>{l(LABELS.sunAt)}</span>
                        </div>
                        <p className="text-base font-semibold text-text-primary" style={headingFont}>
                          {tl(displayData.sunRashi.name, locale)} {displayData.sunDeg}
                        </p>
                      </div>
                      <div className="rounded-xl bg-bg-primary/50 border border-gold-primary/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Moon className="w-4 h-4 text-blue-300" />
                          <span className="text-xs text-text-secondary uppercase tracking-wide" style={bodyFont}>{l(LABELS.moonAt)}</span>
                        </div>
                        <p className="text-base font-semibold text-text-primary" style={headingFont}>
                          {tl(displayData.moonRashi.name, locale)} {displayData.moonDeg}
                        </p>
                      </div>
                    </div>

                    {/* Varshaphal link */}
                    <div className="pt-2">
                      <Link
                        href="/varshaphal"
                        className="inline-flex items-center gap-2 text-sm text-gold-primary hover:text-gold-light transition-colors group"
                        style={bodyFont}
                      >
                        {l(LABELS.varshaphalLink)} <ArrowRight className="w-4 h-4 text-gold-primary" /> {l(LABELS.varshaphal)}
                        <span className="inline-block transition-transform group-hover:translate-x-1">
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* No result found */
              <div className="rounded-2xl border border-gold-primary/10 bg-bg-secondary p-8 text-center">
                <Moon className="w-10 h-10 text-text-secondary mx-auto mb-3 opacity-50" />
                <p className="text-text-secondary" style={bodyFont}>{l(LABELS.noResult)}</p>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <RelatedLinks type="learn" links={learnLinks} locale={locale} />
    </main>
  );
}
