'use client';

/**
 * Sign Shift Page — "Why Your Western Horoscope Might Be Wrong"
 *
 * Works two ways:
 * 1. Without data: Shows explainer + CTA to generate chart
 * 2. With data (URL params or sessionStorage): Shows personalized comparison
 *
 * URL params: ?data=<encoded SignShiftData>
 * SessionStorage: 'sign_shift_data' key with JSON SignShiftData
 */

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, RotateCcw, Share2 } from 'lucide-react';

import { dateToJD } from '@/lib/ephem/astronomical';
import { computeComparison } from '@/lib/ephem/comparison-engine';
import { comparisonToSignShift, decodeSignShiftParams, encodeSignShiftParams } from '@/lib/shareable/sign-shift';
import type { SignShiftData } from '@/lib/shareable/sign-shift';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import LocationSearch from '@/components/ui/LocationSearch';
import GoldDivider from '@/components/ui/GoldDivider';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { Locale, LocaleText } from '@/types/panchang';

// ── Planet symbols ────────────────────────────────────────────
const PLANET_SYMBOLS: Record<number, string> = {
  0: '\u2609', 1: '\u263D', 2: '\u2642', 3: '\u263F',
  4: '\u2643', 5: '\u2640', 6: '\u2644', 7: '\u260A', 8: '\u260B',
};

// ── Labels ────────────────────────────────────────────────────
const LABELS = {
  heroTitle: {
    en: 'Why Your Western Horoscope Might Be Wrong',
    hi: 'आपकी पश्चिमी राशि गलत क्यों हो सकती है',
    ta: 'உங்கள் மேற்கத்திய ஜாதகம் ஏன் தவறாக இருக்கலாம்',
    bn: 'আপনার পশ্চিমা রাশিফল কেন ভুল হতে পারে',
  } as LocaleText,
  heroSubtitle: {
    en: 'See how the 24° shift between tropical and sidereal zodiacs changes your entire chart',
    hi: 'देखें कि सायन और निरयन राशिचक्र के बीच 24° का अंतर आपकी पूरी कुण्डली कैसे बदलता है',
    ta: 'சாயன மற்றும் நிரயன ராசி மண்டலங்களுக்கு இடையே 24° மாற்றம் உங்கள் முழு ஜாதகத்தையும் எவ்வாறு மாற்றுகிறது',
    bn: 'সায়ন ও নিরয়ন রাশিচক্রের মধ্যে 24° পার্থক্য আপনার পুরো কুণ্ডলী কীভাবে বদলায়',
  } as LocaleText,
  explainerTitle: {
    en: 'The Precession of the Equinoxes',
    hi: 'विषुव अयन गति',
    ta: 'விஷுவ அயன கதி',
    bn: 'বিষুব অয়ন গতি',
  } as LocaleText,
  explainerP1: {
    en: 'About 1,700 years ago, the Western (tropical) and Vedic (sidereal) zodiacs were aligned. Since then, Earth\'s axis has wobbled — a phenomenon called "precession of the equinoxes." This has caused the two systems to drift apart by approximately 24 degrees.',
    hi: 'लगभग 1,700 साल पहले, पश्चिमी (सायन) और वैदिक (निरयन) राशिचक्र एक साथ थे। तब से, पृथ्वी की धुरी में हुई "विषुव अयन गति" के कारण दोनों प्रणालियों में लगभग 24 अंशों का अंतर आ गया है।',
    ta: 'சுமார் 1,700 ஆண்டுகளுக்கு முன்பு, மேற்கத்திய (சாயன) மற்றும் வேத (நிரயன) ராசி மண்டலங்கள் ஒன்றாக இருந்தன. அப்போதிருந்து, பூமியின் அச்சு ஆடுவதால் இரண்டு அமைப்புகளும் சுமார் 24 டிகிரி விலகியுள்ளன.',
    bn: 'প্রায় ১,৭০০ বছর আগে, পশ্চিমা (সায়ন) এবং বৈদিক (নিরয়ন) রাশিচক্র একসাথে ছিল। তারপর থেকে, পৃথিবীর অক্ষের কম্পনের কারণে দুটি পদ্ধতি প্রায় ২৪ ডিগ্রি আলাদা হয়ে গেছে।',
  } as LocaleText,
  explainerP2: {
    en: 'This means that if you were born with the Sun at 5° of a sign, the 24° shift pushes it into the PREVIOUS sign in the Vedic system. About 80% of people have a different Sun sign in Vedic astrology compared to Western astrology.',
    hi: 'इसका मतलब है कि यदि आप किसी राशि के 5° पर सूर्य के साथ पैदा हुए, तो 24° का अंतर इसे वैदिक प्रणाली में पिछली राशि में ले जाता है। लगभग 80% लोगों की वैदिक ज्योतिष में पश्चिमी ज्योतिष से अलग सूर्य राशि है।',
    ta: 'அதாவது, நீங்கள் ஒரு ராசியின் 5 டிகிரியில் சூரியனுடன் பிறந்திருந்தால், 24 டிகிரி மாற்றம் வேத முறையில் அதை முந்தைய ராசிக்கு தள்ளுகிறது. சுமார் 80% மக்களுக்கு வேத ஜோதிடத்தில் மேற்கத்திய ஜோதிடத்திலிருந்து வேறுபட்ட சூரிய ராசி உள்ளது.',
    bn: 'এর মানে হল আপনি যদি কোনো রাশির ৫° এ সূর্যের সাথে জন্মগ্রহণ করেন, তাহলে ২৪° পার্থক্য বৈদিক পদ্ধতিতে এটিকে আগের রাশিতে নিয়ে যায়। প্রায় ৮০% মানুষের বৈদিক জ্যোতিষে পশ্চিমা জ্যোতিষ থেকে আলাদা সূর্য রাশি আছে।',
  } as LocaleText,
  explainerP3: {
    en: 'Vedic astrology (Jyotish) uses the actual position of stars as the reference frame, making it astronomically precise. Western astrology uses the seasons as its reference. Both are valid traditions — but if you\'ve only read Western horoscopes, you may not know your true Vedic sign.',
    hi: 'वैदिक ज्योतिष (ज्योतिष) तारों की वास्तविक स्थिति को संदर्भ के रूप में उपयोग करता है, जो इसे खगोलीय रूप से सटीक बनाता है। पश्चिमी ज्योतिष ऋतुओं को अपना संदर्भ मानता है। दोनों मान्य परंपराएँ हैं — लेकिन यदि आपने केवल पश्चिमी राशिफल पढ़ा है, तो शायद आप अपनी असली वैदिक राशि नहीं जानते।',
    ta: 'வேத ஜோதிடம் (ஜ்யோதிஷ்) நட்சத்திரங்களின் உண்மையான நிலையை குறிப்புச் சட்டகமாகப் பயன்படுத்துகிறது. மேற்கத்திய ஜோதிடம் பருவ காலங்களை குறிப்பாகக் கொள்கிறது. இரண்டும் செல்லுபடியான மரபுகள் — ஆனால் நீங்கள் மேற்கத்திய ஜாதகங்களை மட்டுமே படித்திருந்தால், உங்கள் உண்மையான வேத ராசி உங்களுக்குத் தெரியாமல் இருக்கலாம்.',
    bn: 'বৈদিক জ্যোতিষ (জ্যোতিষ) তারাদের প্রকৃত অবস্থানকে রেফারেন্স হিসেবে ব্যবহার করে, যা এটিকে জ্যোতির্বিদ্যাগতভাবে সঠিক করে। পশ্চিমা জ্যোতিষ ঋতুকে রেফারেন্স হিসেবে ব্যবহার করে। দুটোই বৈধ ঐতিহ্য — কিন্তু আপনি যদি শুধু পশ্চিমা রাশিফল পড়ে থাকেন, তাহলে আপনার সত্যিকারের বৈদিক রাশি হয়তো জানেন না।',
  } as LocaleText,
  ctaTitle: {
    en: 'Discover Your Real Vedic Signs',
    hi: 'अपनी असली वैदिक राशि जानें',
    ta: 'உங்கள் உண்மையான வேத ராசிகளை கண்டறியுங்கள்',
    bn: 'আপনার আসল বৈদিক রাশি জানুন',
  } as LocaleText,
  ctaButton: {
    en: 'Enter Birth Details',
    hi: 'जन्म विवरण दर्ज करें',
    ta: 'பிறப்பு விவரங்களை உள்ளிடுங்கள்',
    bn: 'জন্ম বিবরণ লিখুন',
  } as LocaleText,
  orGenerate: {
    en: 'Or generate your full Kundali',
    hi: 'या अपनी पूरी कुण्डली बनाएं',
    ta: 'அல்லது உங்கள் முழு குண்டலியை உருவாக்கவும்',
    bn: 'অথবা আপনার পূর্ণ কুণ্ডলী তৈরি করুন',
  } as LocaleText,
  goToKundali: {
    en: 'Generate Full Kundali',
    hi: 'पूर्ण कुण्डली बनाएं',
    ta: 'முழு குண்டலி உருவாக்கவும்',
    bn: 'পূর্ণ কুণ্ডলী তৈরি করুন',
  } as LocaleText,
  name: { en: 'Name (optional)', hi: 'नाम (वैकल्पिक)', ta: 'பெயர் (விருப்பம்)', bn: 'নাম (ঐচ্ছিক)' } as LocaleText,
  dob: { en: 'Date of Birth', hi: 'जन्म तिथि', ta: 'பிறந்த தேதி', bn: 'জন্ম তারিখ' } as LocaleText,
  tob: { en: 'Time of Birth', hi: 'जन्म समय', ta: 'பிறந்த நேரம்', bn: 'জন্ম সময়' } as LocaleText,
  location: { en: 'Birth Location', hi: 'जन्म स्थान', ta: 'பிறப்பிடம்', bn: 'জন্মস্থান' } as LocaleText,
  reveal: { en: 'Reveal My Real Signs', hi: 'मेरी असली राशि दिखाएं', ta: 'எனது உண்மையான ராசிகளைக் காட்டு', bn: 'আমার আসল রাশি দেখান' } as LocaleText,
  tryDifferent: { en: 'Try different birth data', hi: 'अन्य जन्म विवरण आज़माएं', ta: 'வேறு பிறப்பு விவரங்களை முயற்சிக்கவும்', bn: 'অন্য জন্ম বিবরণ চেষ্টা করুন' } as LocaleText,
  shareTitle: { en: 'Share Your Sign Shift', hi: 'अपनी राशि परिवर्तन साझा करें', ta: 'உங்கள் ராசி மாற்றத்தைப் பகிரவும்', bn: 'আপনার রাশি পরিবর্তন শেয়ার করুন' } as LocaleText,
  western: { en: 'Western (Tropical)', hi: 'पश्चिमी (सायन)', ta: 'மேற்கத்திய (சாயன)', bn: 'পশ্চিমা (সায়ন)' } as LocaleText,
  vedic: { en: 'Vedic (Sidereal)', hi: 'वैदिक (निरयन)', ta: 'வேத (நிரயன)', bn: 'বৈদিক (নিরয়ন)' } as LocaleText,
  planet: { en: 'Planet', hi: 'ग्रह', ta: 'கிரகம்', bn: 'গ্রহ' } as LocaleText,
  shifted: { en: 'Shifted!', hi: 'परिवर्तित!', ta: 'மாறியது!', bn: 'পরিবর্তিত!' } as LocaleText,
  same: { en: 'Same', hi: 'समान', ta: 'அதே', bn: 'একই' } as LocaleText,
  shareText: { en: 'See how your Western and Vedic signs differ!', hi: 'देखें कि आपकी पश्चिमी और वैदिक राशि कैसे भिन्न हैं!', ta: 'உங்கள் மேற்கத்திய மற்றும் வேத ராசிகள் எவ்வாறு வேறுபடுகின்றன என்பதைப் பாருங்கள்!', bn: 'দেখুন আপনার পশ্চিমা ও বৈদিক রাশি কীভাবে আলাদা!' } as LocaleText,
};

function SignShiftPageInner() {
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  // ── Form state ──────────────────────────────────────────────
  const [name, setName] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('12:00');
  const [locName, setLocName] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Result state ────────────────────────────────────────────
  const [shiftData, setShiftData] = useState<SignShiftData | null>(null);

  // ── Load from URL params or sessionStorage ──────────────────
  // URL params take priority over sessionStorage (CLAUDE.md: document precedence)
  useEffect(() => {
    const encoded = searchParams.get('data');
    if (encoded) {
      const decoded = decodeSignShiftParams(encoded);
      if (decoded) {
        setShiftData(decoded);
        return;
      }
    }

    // Fallback: try sessionStorage
    try {
      const stored = sessionStorage.getItem('sign_shift_data');
      if (stored) {
        const parsed = JSON.parse(stored) as SignShiftData;
        if (parsed && parsed.planets && parsed.planets.length > 0) {
          setShiftData(parsed);
        }
      }
    } catch {
      // sessionStorage not available or corrupt — not an error
    }
  }, [searchParams]);

  // ── Compute ─────────────────────────────────────────────────
  const handleCompute = useCallback(async () => {
    if (!dateStr) {
      setError(tl({ en: 'Please enter a date of birth.', hi: 'कृपया जन्म तिथि दर्ज करें।' }, locale));
      return;
    }
    if (lat === null || lng === null) {
      setError(tl({ en: 'Please select a birth location.', hi: 'कृपया जन्म स्थान चुनें।' }, locale));
      return;
    }

    setError(null);
    setComputing(true);

    try {
      const tz = await resolveTimezoneFromCoords(lat, lng);
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);

      // Convert local birth time to UT
      const tempDate = new Date(`${dateStr}T${timeStr}:00`);
      const utcStr = tempDate.toLocaleString('en-US', { timeZone: 'UTC' });
      const tzStr = tempDate.toLocaleString('en-US', { timeZone: tz });
      const utcMs = new Date(utcStr).getTime();
      const tzMs = new Date(tzStr).getTime();
      const offsetHours = (tzMs - utcMs) / 3600000;

      const hourDecimal = hour + minute / 60 - offsetHours;
      const jd = dateToJD(year, month, day, hourDecimal);

      const comp = computeComparison(jd);
      const data = comparisonToSignShift(comp, name);

      setShiftData(data);
      setShowForm(false);

      // Store in sessionStorage for page navigation
      try {
        sessionStorage.setItem('sign_shift_data', JSON.stringify(data));
      } catch {
        // Storage full or unavailable — non-critical
      }
    } catch (err) {
      console.error('[sign-shift] computation failed:', err);
      setError(tl({ en: 'Computation failed. Please check your inputs.', hi: 'गणना विफल। कृपया इनपुट जाँचें।' }, locale));
    } finally {
      setComputing(false);
    }
  }, [dateStr, timeStr, lat, lng, name, locale]);

  // ── Share handler ───────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!shiftData) return;

    const encoded = encodeSignShiftParams(shiftData);
    const shareUrl = `${window.location.origin}/${locale}/sign-shift?data=${encodeURIComponent(encoded)}`;
    const shareText = tl(LABELS.shareText, locale);

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: tl(LABELS.heroTitle, locale),
          text: `${shareText} ${tl(shiftData.hookLine, locale)}`,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('[sign-shift] share failed:', err);
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipErr) {
        console.error('[sign-shift] clipboard fallback failed:', clipErr);
      }
    }
  }, [shiftData, locale]);

  const inputClass = 'w-full rounded-lg border border-gold-primary/20 bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/30 transition-colors';

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,168,83,0.06)_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,168,83,0.04)_0%,transparent_50%)]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.h1
            className="text-3xl font-bold text-gold-light sm:text-4xl lg:text-5xl"
            style={headingFont}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {tl(LABELS.heroTitle, locale)}
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary"
            style={bodyFont}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {tl(LABELS.heroSubtitle, locale)}
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {/* ── RESULTS VIEW ── */}
          {shiftData && !showForm && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hook Line Banner */}
              <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
                <p className="text-xl font-bold text-amber-400 sm:text-2xl" style={headingFont}>
                  {tl(shiftData.hookLine, locale)}
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  ({shiftData.ayanamsha.toFixed(1)}{locale === 'en' ? '\u00B0 Lahiri ayanamsha' : '\u00B0 लाहिरी अयनांश'})
                </p>
              </div>

              {/* Element Contrast — the "you're not who you think you are" moment */}
              {shiftData.elementContrast && shiftData.elementContrast.shifted && (
                <div className="mb-8 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6 text-center">
                  <p className="text-lg font-bold text-violet-300 sm:text-xl" style={headingFont}>
                    {tl(shiftData.elementContrast.contrastLine, locale)}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">{locale === 'hi' ? 'पश्चिमी' : 'Western'}</div>
                      <div className="text-2xl font-bold text-amber-400">{shiftData.elementContrast.tropical.dominant}</div>
                      <div className="text-text-secondary text-xs">{shiftData.elementContrast.tropical.fire}🔥 {shiftData.elementContrast.tropical.earth}🌍 {shiftData.elementContrast.tropical.air}💨 {shiftData.elementContrast.tropical.water}💧</div>
                    </div>
                    <div className="text-2xl text-gold-primary">→</div>
                    <div className="text-center">
                      <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">{locale === 'hi' ? 'वैदिक' : 'Vedic'}</div>
                      <div className="text-2xl font-bold text-emerald-400">{shiftData.elementContrast.sidereal.dominant}</div>
                      <div className="text-text-secondary text-xs">{shiftData.elementContrast.sidereal.fire}🔥 {shiftData.elementContrast.sidereal.earth}🌍 {shiftData.elementContrast.sidereal.air}💨 {shiftData.elementContrast.sidereal.water}💧</div>
                    </div>
                  </div>
                </div>
              )}
              {shiftData.elementContrast && !shiftData.elementContrast.shifted && (
                <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                  <p className="text-sm text-emerald-400">{tl(shiftData.elementContrast.contrastLine, locale)}</p>
                </div>
              )}

              {shiftData.personName && (
                <h2 className="mb-6 text-center text-2xl font-bold text-gold-light" style={headingFont}>
                  {shiftData.personName}
                </h2>
              )}

              {/* Comparison Table */}
              <div className="overflow-hidden rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27]">
                {/* Table header */}
                <div className="flex items-center border-b border-gold-primary/20 bg-gold-primary/5 px-4 py-3 text-sm font-semibold text-gold-dark sm:px-6">
                  <div className="w-1/4">{tl(LABELS.planet, locale)}</div>
                  <div className="w-1/4 text-center">{tl(LABELS.western, locale)}</div>
                  <div className="w-8 text-center" />
                  <div className="w-1/4 text-center">{tl(LABELS.vedic, locale)}</div>
                  <div className="w-1/6 text-center">{locale === 'hi' ? 'स्थिति' : 'Status'}</div>
                </div>

                {/* Planet rows */}
                {shiftData.planets.map((planet, idx) => (
                  <motion.div
                    key={planet.planetId}
                    className={`flex items-center px-4 py-3.5 sm:px-6 ${idx < shiftData.planets.length - 1 ? 'border-b border-gold-primary/10' : ''} ${planet.shifted ? 'bg-amber-500/5' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    {/* Planet */}
                    <div className="flex w-1/4 items-center gap-2">
                      <span className="text-lg">{PLANET_SYMBOLS[planet.planetId] || ''}</span>
                      <div>
                        <span className="text-sm font-semibold text-text-primary" style={bodyFont}>
                          {tl(planet.planetName, locale)}
                        </span>
                        <span className="ml-1.5 text-xs text-text-secondary">
                          {planet.tropicalDeg}
                        </span>
                      </div>
                    </div>

                    {/* Tropical sign */}
                    <div className="flex w-1/4 items-center justify-center gap-1.5">
                      <RashiIconById id={planet.tropicalSignId} className={`h-5 w-5 ${planet.shifted ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span className={`text-sm font-medium ${planet.shifted ? 'text-amber-400' : 'text-emerald-400'}`} style={bodyFont}>
                        {tl(planet.tropicalSign, locale)}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex w-8 justify-center">
                      <span className={`text-sm ${planet.shifted ? 'text-amber-400' : 'text-emerald-400/60'}`}>
                        {planet.shifted ? '\u2192' : '='}
                      </span>
                    </div>

                    {/* Sidereal sign */}
                    <div className="flex w-1/4 items-center justify-center gap-1.5">
                      <RashiIconById id={planet.siderealSignId} className={`h-5 w-5 ${planet.shifted ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span className={`text-sm font-medium ${planet.shifted ? 'font-bold text-amber-300' : 'text-emerald-400'}`} style={bodyFont}>
                        {tl(planet.siderealSign, locale)}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="flex w-1/6 justify-center">
                      {planet.shifted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-400">
                          <Zap className="h-3 w-3" />
                          {tl(LABELS.shifted, locale)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400/80">
                          {tl(LABELS.same, locale)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-lg border border-gold-primary/40 bg-gold-primary/10 px-5 py-2.5 text-sm font-medium text-gold-light transition-colors hover:bg-gold-primary/20"
                >
                  <Share2 className="h-4 w-4" />
                  {copied ? (locale === 'hi' ? 'लिंक कॉपी हुआ!' : 'Link copied!') : tl(LABELS.shareTitle, locale)}
                </button>

                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gold-primary/20 px-5 py-2.5 text-sm text-text-secondary transition-colors hover:bg-gold-primary/10 hover:text-gold-light"
                >
                  <RotateCcw className="h-4 w-4" />
                  {tl(LABELS.tryDifferent, locale)}
                </button>

                <Link
                  href={`/${locale}/kundali`}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-primary/20 to-amber-500/10 border border-gold-primary/40 px-5 py-2.5 text-sm font-medium text-gold-light transition-all hover:from-gold-primary/30 hover:to-amber-500/20"
                >
                  <Sparkles className="h-4 w-4" />
                  {tl(LABELS.goToKundali, locale)}
                </Link>
              </div>

              <GoldDivider className="my-12" />

              {/* Explainer (also shown below results) */}
              <ExplainerSection locale={locale} headingFont={headingFont} bodyFont={bodyFont} />
            </motion.div>
          )}

          {/* ── FORM VIEW ── */}
          {(showForm || !shiftData) && (
            <motion.div
              key="form-and-explainer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Explainer comes first for SEO when no data */}
              {!shiftData && (
                <>
                  <ExplainerSection locale={locale} headingFont={headingFont} bodyFont={bodyFont} />
                  <GoldDivider className="my-12" />
                </>
              )}

              {/* Birth data form */}
              <div className="mx-auto max-w-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-gold-light" style={headingFont}>
                  {tl(LABELS.ctaTitle, locale)}
                </h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary" style={bodyFont}>
                      {tl(LABELS.name, locale)}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      style={bodyFont}
                      placeholder={locale === 'hi' ? 'आपका नाम' : 'Your name'}
                    />
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary" style={bodyFont}>
                      {tl(LABELS.dob, locale)} *
                    </label>
                    <input
                      type="date"
                      value={dateStr}
                      onChange={(e) => setDateStr(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {/* TOB */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary" style={bodyFont}>
                      {tl(LABELS.tob, locale)}
                    </label>
                    <input
                      type="time"
                      value={timeStr}
                      onChange={(e) => setTimeStr(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary" style={bodyFont}>
                      {tl(LABELS.location, locale)} *
                    </label>
                    <LocationSearch
                      onSelect={(loc) => {
                        setLocName(loc.name);
                        setLat(loc.lat);
                        setLng(loc.lng);
                      }}
                      value={locName}
                    />
                    {lat !== null && lng !== null && (
                      <p className="mt-1 text-xs text-text-secondary">
                        {lat.toFixed(4)}, {lng.toFixed(4)}
                      </p>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleCompute}
                    disabled={computing}
                    className="w-full rounded-lg bg-gradient-to-r from-gold-primary to-amber-500 px-6 py-3.5 text-center text-base font-bold text-bg-primary transition-all hover:from-gold-light hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                    style={bodyFont}
                  >
                    {computing ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg-primary/30 border-t-bg-primary" />
                        {locale === 'hi' ? 'गणना हो रही है...' : 'Computing...'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        {tl(LABELS.reveal, locale)}
                      </span>
                    )}
                  </button>
                </div>

                {/* Or go to kundali */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-text-secondary" style={bodyFont}>
                    {tl(LABELS.orGenerate, locale)}
                  </p>
                  <Link
                    href={`/${locale}/kundali`}
                    className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-gold-primary transition-colors hover:text-gold-light"
                  >
                    {tl(LABELS.goToKundali, locale)}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <RelatedLinks type="learn" links={getLearnLinksForTool('/sign-shift')} locale={locale} />
      </div>
    </div>
  );
}

// ── Explainer Section (reusable) ──────────────────────────────
function ExplainerSection({
  locale,
  headingFont,
  bodyFont,
}: {
  locale: string;
  headingFont: React.CSSProperties;
  bodyFont: React.CSSProperties;
}) {
  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold text-gold-light sm:text-3xl" style={headingFont}>
        {tl(LABELS.explainerTitle, locale)}
      </h2>
      <div className="space-y-4 text-base leading-relaxed text-text-secondary sm:text-lg" style={bodyFont}>
        <p>{tl(LABELS.explainerP1, locale)}</p>
        <p>{tl(LABELS.explainerP2, locale)}</p>
        <p>{tl(LABELS.explainerP3, locale)}</p>
      </div>

      {/* Visual: Precession illustration */}
      <div className="mt-8 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-gold-light">~285 AD</span>
            <span className="text-xs text-text-secondary">{locale === 'hi' ? 'शून्य अयनांश' : '0\u00B0 ayanamsha'}</span>
          </div>
          <div className="flex-1 border-t border-dashed border-gold-primary/30 sm:border-l sm:border-t-0" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-amber-400">{'~24.2°'}</span>
            <span className="text-xs text-text-secondary">{locale === 'hi' ? 'वर्तमान अयनांश (2026)' : 'Current ayanamsha (2026)'}</span>
          </div>
          <div className="flex-1 border-t border-dashed border-gold-primary/30 sm:border-l sm:border-t-0" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-text-secondary/60">~25,920 yr</span>
            <span className="text-xs text-text-secondary">{locale === 'hi' ? 'पूर्ण चक्र' : 'Full cycle'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Exported page with Suspense boundary for useSearchParams ──
export default function SignShiftPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-primary/30 border-t-gold-primary" />
      </div>
    }>
      <SignShiftPageInner />
    </Suspense>
  );
}
