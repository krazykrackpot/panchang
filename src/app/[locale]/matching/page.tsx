'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import PrintButton from '@/components/ui/PrintButton';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import LocationSearch from '@/components/ui/LocationSearch';
import ChartNorth from '@/components/kundali/ChartNorth';
import { NakshatraIcon } from '@/components/icons/PanchangIcons';
import { computeBirthSignsAction } from '@/app/actions/birth-signs';
import InfoBlock from '@/components/ui/InfoBlock';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import type { MatchResult } from '@/lib/matching/ashta-kuta';
import type { DashaKootaMatchResult } from '@/lib/matching/dasha-koota';
import type { KundaliData } from '@/types/kundali';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { ShareCardButton } from '@/components/shareable/ShareCardButton';
import { selectHighlightKutas, getKutaInsight, getOverallVerdict } from '@/lib/constants/kuta-insights';

const L = {
  en: {
    birthMode: 'Calculate from Birth Details',
    dateOfBirth: 'Date of Birth',
    timeOfBirth: 'Time of Birth',
    placeOfBirth: 'Place of Birth',
    calculated: 'Calculated',
    calculating: 'Calculating...',
    enterBirthDetails: 'Enter birth details to auto-calculate',
    name: 'Name',
  },
  hi: {
    birthMode: 'जन्म विवरण से गणना करें',
    dateOfBirth: 'जन्म तिथि',
    timeOfBirth: 'जन्म समय',
    placeOfBirth: 'जन्म स्थान',
    calculated: 'गणना',
    calculating: 'गणना हो रही है...',
    enterBirthDetails: 'स्वतः गणना हेतु जन्म विवरण दर्ज करें',
    name: 'नाम',
  },
  sa: {
    birthMode: 'जन्मविवरणात् गणयतु',
    dateOfBirth: 'जन्मतिथिः',
    timeOfBirth: 'जन्मसमयः',
    placeOfBirth: 'जन्मस्थानम्',
    calculated: 'गणितम्',
    calculating: 'गणना प्रचलति...',
    enterBirthDetails: 'स्वयं गणनार्थं जन्मविवरणं दत्तवान्',
    name: 'नाम',
  },
  ta: {
    birthMode: 'பிறப்பு விவரங்களிலிருந்து கணக்கிடுங்கள்',
    dateOfBirth: 'பிறந்த தேதி',
    timeOfBirth: 'பிறந்த நேரம்',
    placeOfBirth: 'பிறந்த இடம்',
    calculated: 'கணிக்கப்பட்டது',
    calculating: 'கணக்கிடுகிறது...',
    enterBirthDetails: 'தானாக கணக்கிட பிறப்பு விவரங்களை உள்ளிடுங்கள்',
    name: 'பெயர்',
  },
};

interface PersonBirth {
  name: string;
  date: string;
  time: string;
  placeName: string;
  placeLat: number | null;
  placeLng: number | null;
  placeTimezone: string | null;
}

async function computeMoonFromBirth(birth: PersonBirth): Promise<{ nakshatra: number; rashi: number } | null> {
  if (!birth.date || !birth.time || birth.placeLat === null || birth.placeLng === null || !birth.placeTimezone) return null;
  try {
    const b = await computeBirthSignsAction(birth.date, birth.time, birth.placeLat, birth.placeLng, birth.placeTimezone);
    return { nakshatra: b.moonNakshatra, rashi: b.moonSign };
  } catch { return null; }
}

export default function MatchingPage() {
  const t = useTranslations('matching');
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const lbl = (L as Record<string, typeof L.en>)[String(locale)] || L.en;

  // Birth mode state
  const emptyBirth: PersonBirth = { name: '', date: '', time: '06:00', placeName: '', placeLat: null, placeLng: null, placeTimezone: null };
  const [boyBirth, setBoyBirth] = useState<PersonBirth>(emptyBirth);
  const [girlBirth, setGirlBirth] = useState<PersonBirth>(emptyBirth);
  const [boyComputed, setBoyComputed] = useState<{ nakshatra: number; rashi: number } | null>(null);
  const [girlComputed, setGirlComputed] = useState<{ nakshatra: number; rashi: number } | null>(null);

  // Server-side Moon computation for boy
  useEffect(() => {
    let cancelled = false;
    computeMoonFromBirth(boyBirth).then(r => { if (!cancelled) setBoyComputed(r); });
    return () => { cancelled = true; };
  }, [boyBirth.date, boyBirth.time, boyBirth.placeLat, boyBirth.placeLng, boyBirth.placeTimezone]);

  // Server-side Moon computation for girl
  useEffect(() => {
    let cancelled = false;
    computeMoonFromBirth(girlBirth).then(r => { if (!cancelled) setGirlComputed(r); });
    return () => { cancelled = true; };
  }, [girlBirth.date, girlBirth.time, girlBirth.placeLat, girlBirth.placeLng, girlBirth.placeTimezone]);

  const [matchSystem, setMatchSystem] = useState<'ashta-kuta' | 'dasha-koota'>('ashta-kuta');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [dashaResult, setDashaResult] = useState<DashaKootaMatchResult | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const matchResultRef = useRef<HTMLDivElement>(null);
  const [boyKundali, setBoyKundali] = useState<KundaliData | null>(null);
  const [girlKundali, setGirlKundali] = useState<KundaliData | null>(null);
  const [showCharts, setShowCharts] = useState(false);

  // Score counting animation state
  const [displayScore, setDisplayScore] = useState(0);
  const [displayDashaScore, setDisplayDashaScore] = useState(0);

  // Animate score count-up when result changes
  useEffect(() => {
    if (!result) return;
    const end = result.totalScore;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayScore(Math.round(end * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [result]);

  useEffect(() => {
    if (!dashaResult) return;
    const end = dashaResult.totalScored;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayDashaScore(Math.round(end * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [dashaResult]);

  // Validation hints: tell the user which person's details are incomplete
  const boyReady = !!boyComputed;
  const girlReady = !!girlComputed;
  const boyMissing = !boyBirth.date || !boyBirth.time || boyBirth.placeLat === null;
  const girlMissing = !girlBirth.date || !girlBirth.time || girlBirth.placeLat === null;

  const handleMatch = useCallback(async () => {
    const bNak = boyComputed?.nakshatra;
    const bRashi = boyComputed?.rashi;
    const gNak = girlComputed?.nakshatra;
    const gRashi = girlComputed?.rashi;
    if (!bNak || !bRashi || !gNak || !gRashi) return;
    setLoading(true);
    try {
      const res = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boy: { moonNakshatra: bNak, moonRashi: bRashi },
          girl: { moonNakshatra: gNak, moonRashi: gRashi },
          system: matchSystem,
        }),
      });
      if (!res.ok) { setMatchError(isTamil ? 'பொருத்தம் தோல்வி. மீண்டும் முயற்சிக்கவும்.' : locale === 'en' ? 'Matching failed. Please try again.' : 'मिलान विफल। कृपया पुनः प्रयास करें।'); setResult(null); setDashaResult(null); setLoading(false); return; }
      const data = await res.json();
      if (data.error) { setMatchError(data.error); setResult(null); setDashaResult(null); setLoading(false); return; }
      setMatchError(null);
      if (matchSystem === 'dasha-koota') {
        setDashaResult(data as DashaKootaMatchResult);
        setResult(null);
      } else {
        setResult(data as MatchResult);
        setDashaResult(null);
      }

      // Generate kundalis for both partners in parallel (non-blocking)
      const genKundali = async (birth: PersonBirth) => {
        try {
          const r = await fetch('/api/kundali', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: birth.date, time: birth.time, lat: birth.placeLat, lng: birth.placeLng, timezone: birth.placeTimezone, name: birth.name }),
          });
          if (r.ok) return (await r.json()) as KundaliData;
        } catch { /* non-critical */ }
        return null;
      };
      Promise.all([genKundali(boyBirth), genKundali(girlBirth)]).then(([bk, gk]) => {
        setBoyKundali(bk);
        setGirlKundali(gk);
      });
    } catch { setMatchError(isTamil ? 'இணைப்பு பிழை. இணைய இணைப்பை சரிபார்க்கவும்.' : locale === 'en' ? 'Connection error. Please check your internet.' : 'कनेक्शन त्रुटि। कृपया इंटरनेट जाँचें।'); setResult(null); setDashaResult(null); }
    setLoading(false);
  }, [boyComputed, girlComputed, boyBirth, girlBirth, matchSystem]);

  const verdictColors: Record<string, string> = {
    excellent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    good: 'text-green-400 border-green-500/30 bg-green-500/10',
    average: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    below_average: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    not_recommended: 'text-red-400 border-red-500/30 bg-red-500/10',
  };

  // Returns a hex color for the glow ring based on verdict tier
  const getVerdictHex = (verdict: string): string => {
    if (verdict === 'excellent') return '#10b981'; // emerald-500
    if (verdict === 'good') return '#22c55e';      // green-500
    if (verdict === 'average') return '#f59e0b';   // amber-500
    return '#ef4444';                               // red-500
  };

  const scoreBarColor = (scored: number, max: number) => {
    const pct = max > 0 ? scored / max : 0;
    if (pct >= 0.75) return 'bg-emerald-500';
    if (pct >= 0.5) return 'bg-amber-500';
    if (pct >= 0.25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="flex justify-center mb-6"><NakshatraIcon size={80} /></div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
          <Link href="/matching/compatibility" className="text-gold-primary hover:text-gold-light text-sm transition-colors">
            {isTamil ? 'ராசி பொருத்த அட்டவணை பார்க்க →' : isDevanagari ? 'राशि संगतता चार्ट देखें →' : 'View Rashi Compatibility Chart →'}
          </Link>
          <span className="text-text-secondary hidden sm:inline">|</span>
          <Link href="/matching/report" className="text-gold-primary hover:text-gold-light text-sm transition-colors">
            {isTamil ? 'விரிவான பொருத்த அறிக்கை →' : isDevanagari ? 'विस्तृत अनुकूलता रिपोर्ट →' : 'Get Detailed Compatibility Report →'}
          </Link>
          <span className="text-text-secondary hidden sm:inline">|</span>
          <Link href="/learn/matching" className="text-gold-primary/60 text-sm hover:text-gold-light transition-colors">
            {isTamil ? 'குண பொருத்தம் பற்றி அறிக →' : isDevanagari ? 'गुण मिलान के बारे में जानें →' : 'Learn about Kundali Matching →'}
          </Link>
        </div>
      </motion.div>


      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
        {/* Groom */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-blue-500/20 rounded-2xl p-3 sm:p-5 md:p-6"
        >
          <h2 className="text-xl font-bold text-blue-400 mb-6 text-center" style={headingFont}>{t('groomDetails')}</h2>

          <div className="space-y-4">
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.name}</label>
              <input type="text" value={boyBirth.name} onChange={(e) => setBoyBirth({ ...boyBirth, name: e.target.value })}
                className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50" placeholder={isTamil ? 'மணமகன் பெயர்' : locale === 'en' ? 'Groom name' : 'वर का नाम'} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.dateOfBirth}</label>
                <input type="date" value={boyBirth.date} onChange={(e) => setBoyBirth({ ...boyBirth, date: e.target.value })}
                  className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-3 sm:px-4 py-3 text-text-primary text-sm sm:text-base focus:outline-none focus:border-gold-primary/50" />
              </div>
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.timeOfBirth}</label>
                <input type="time" value={boyBirth.time} onChange={(e) => setBoyBirth({ ...boyBirth, time: e.target.value })}
                  className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-3 sm:px-4 py-3 text-text-primary text-sm sm:text-base focus:outline-none focus:border-gold-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.placeOfBirth}</label>
              <LocationSearch value={boyBirth.placeName} onSelect={(loc) => setBoyBirth({ ...boyBirth, placeName: loc.name, placeLat: loc.lat, placeLng: loc.lng, placeTimezone: loc.timezone })} />
            </div>
            {boyComputed ? (
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-center">
                <div className="text-blue-300 text-xs uppercase tracking-wider font-bold mb-1">{lbl.calculated}</div>
                <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(NAKSHATRAS[boyComputed.nakshatra - 1]?.name, locale)}
                </span>
                <span className="text-text-secondary mx-2">/</span>
                <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(RASHIS[boyComputed.rashi - 1]?.name, locale)}
                </span>
              </div>
            ) : boyMissing ? (
              <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-3 text-center">
                <p className="text-text-secondary text-xs">{lbl.enterBirthDetails}</p>
              </div>
            ) : (
              <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-3 text-center">
                <Loader2 className="w-4 h-4 animate-spin inline text-blue-400 mr-2" />
                <span className="text-blue-300 text-xs">{lbl.calculating}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bride */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-pink-500/20 rounded-2xl p-3 sm:p-5 md:p-6"
        >
          <h2 className="text-xl font-bold text-pink-400 mb-6 text-center" style={headingFont}>{t('brideDetails')}</h2>

          <div className="space-y-4">
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.name}</label>
              <input type="text" value={girlBirth.name} onChange={(e) => setGirlBirth({ ...girlBirth, name: e.target.value })}
                className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50" placeholder={isTamil ? 'மணமகள் பெயர்' : locale === 'en' ? 'Bride name' : 'वधू का नाम'} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.dateOfBirth}</label>
                <input type="date" value={girlBirth.date} onChange={(e) => setGirlBirth({ ...girlBirth, date: e.target.value })}
                  className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-3 sm:px-4 py-3 text-text-primary text-sm sm:text-base focus:outline-none focus:border-gold-primary/50" />
              </div>
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.timeOfBirth}</label>
                <input type="time" value={girlBirth.time} onChange={(e) => setGirlBirth({ ...girlBirth, time: e.target.value })}
                  className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-3 sm:px-4 py-3 text-text-primary text-sm sm:text-base focus:outline-none focus:border-gold-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.placeOfBirth}</label>
              <LocationSearch value={girlBirth.placeName} onSelect={(loc) => setGirlBirth({ ...girlBirth, placeName: loc.name, placeLat: loc.lat, placeLng: loc.lng, placeTimezone: loc.timezone })} />
            </div>
            {girlComputed ? (
              <div className="rounded-lg border border-pink-500/20 bg-pink-500/5 p-3 text-center">
                <div className="text-pink-300 text-xs uppercase tracking-wider font-bold mb-1">{lbl.calculated}</div>
                <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(NAKSHATRAS[girlComputed.nakshatra - 1]?.name, locale)}
                </span>
                <span className="text-text-secondary mx-2">/</span>
                <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(RASHIS[girlComputed.rashi - 1]?.name, locale)}
                </span>
              </div>
            ) : girlMissing ? (
              <div className="rounded-lg border border-pink-500/10 bg-pink-500/5 p-3 text-center">
                <p className="text-text-secondary text-xs">{lbl.enterBirthDetails}</p>
              </div>
            ) : (
              <div className="rounded-lg border border-pink-500/10 bg-pink-500/5 p-3 text-center">
                <Loader2 className="w-4 h-4 animate-spin inline text-pink-400 mr-2" />
                <span className="text-pink-300 text-xs">{lbl.calculating}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* System Toggle: North Indian (36pt) vs South Indian (10pt) */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl border border-gold-primary/20 overflow-hidden">
          <button
            onClick={() => setMatchSystem('ashta-kuta')}
            className={`px-5 py-3 text-sm font-bold transition-all ${
              matchSystem === 'ashta-kuta'
                ? 'bg-gold-primary/20 text-gold-light border-r border-gold-primary/20'
                : 'bg-transparent text-text-secondary hover:text-gold-light border-r border-gold-primary/20'
            }`}
          >
            {isTamil ? 'வட இந்திய (36 புள்ளி)' : isDevanagari ? 'उत्तर भारतीय (36 अंक)' : 'North Indian (36 pt)'}
          </button>
          <button
            onClick={() => setMatchSystem('dasha-koota')}
            className={`px-5 py-3 text-sm font-bold transition-all ${
              matchSystem === 'dasha-koota'
                ? 'bg-gold-primary/20 text-gold-light'
                : 'bg-transparent text-text-secondary hover:text-gold-light'
            }`}
          >
            {isTamil ? 'தென் இந்திய (10 புள்ளி)' : isDevanagari ? 'दक्षिण भारतीय (10 अंक)' : 'South Indian (10 pt)'}
          </button>
        </div>
      </div>

      {/* Match Button */}
      <div className="text-center mb-12">
        <button
          onClick={handleMatch}
          disabled={loading || !boyReady || !girlReady}
          className="px-10 py-4 bg-gradient-to-r from-gold-primary/30 to-gold-primary/20 border-2 border-gold-primary/40 rounded-xl text-gold-light font-bold text-lg hover:from-gold-primary/40 hover:to-gold-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={headingFont}
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin inline" /> : t('matchNow')}
        </button>
        {!loading && (!boyReady || !girlReady) && (
          <p className="text-text-secondary text-xs mt-3">
            {isTamil
              ? `${!boyReady && !girlReady ? 'மணமகன் மற்றும் மணமகள் இருவரின்' : !boyReady ? 'மணமகனின்' : 'மணமகளின்'} முழு பிறப்பு விவரங்களை உள்ளிடுங்கள்`
              : locale === 'en'
              ? `Enter complete birth details for ${!boyReady && !girlReady ? 'both groom and bride' : !boyReady ? 'the groom' : 'the bride'}`
              : `${!boyReady && !girlReady ? 'वर और वधू दोनों' : !boyReady ? 'वर' : 'वधू'} का पूर्ण जन्म विवरण दर्ज करें`}
          </p>
        )}
      </div>

      {/* Error */}
      {matchError && !loading && (
        <div className="rounded-xl p-4 border border-red-500/20 bg-red-500/5 text-center">
          <p className="text-red-400 text-sm">{matchError}</p>
        </div>
      )}

      {/* Results — Dasha Koota (South Indian 10pt) */}
      <AnimatePresence>
        {dashaResult && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GoldDivider />
            <div ref={matchResultRef}>

            {/* Score Circle */}
            {(() => {
              const circumference = 2 * Math.PI * 52;
              const targetOffset = circumference * (1 - dashaResult.percentage / 100);
              const verdictHex = getVerdictHex(dashaResult.verdict);
              return (
                <div className="my-12 text-center">
                  <div className="inline-block relative">
                    {/* Pulsing glow ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          `0 0 30px 10px ${verdictHex}20`,
                          `0 0 60px 20px ${verdictHex}30`,
                          `0 0 30px 10px ${verdictHex}20`,
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
                    />
                    <svg className="w-56 h-56 sm:w-72 sm:h-72" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" className="text-bg-tertiary" />
                      <motion.circle
                        cx="60" cy="60" r="52"
                        fill="none"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        stroke={verdictHex}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: targetOffset }}
                        transition={{ duration: 1.5, ease: 'easeOut' as const }}
                      />
                      <text x="60" y="52" textAnchor="middle" className="fill-gold-light text-3xl font-bold" style={{ fontSize: '28px' }}>
                        {displayDashaScore}
                      </text>
                      <text x="60" y="72" textAnchor="middle" className="fill-text-secondary" style={{ fontSize: '11px' }}>
                        / {dashaResult.totalMax}
                      </text>
                    </svg>
                  </div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
                  >
                    <div className={`inline-block mt-4 px-6 py-2 rounded-xl border text-lg font-bold ${verdictColors[dashaResult.verdict]}`} style={headingFont}>
                      {tl(dashaResult.verdictText, locale)}
                    </div>
                  </motion.div>
                  <div className="text-text-secondary text-sm mt-3">{dashaResult.percentage}% {t('compatibility')}</div>
                </div>
              );
            })()}

            {/* Rajju Dosha Warning */}
            {dashaResult.kutas[8]?.scored === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border-2 border-red-500/30 rounded-xl p-5 mb-8 text-center"
              >
                <div className="text-red-400 font-bold text-lg mb-1" style={headingFont}>
                  {isDevanagari ? 'रज्जु दोष' : isTamil ? 'ரஜ்ஜு தோஷம்' : 'Rajju Dosha'}
                </div>
                <div className="text-text-secondary text-sm">
                  {isDevanagari
                    ? 'दोनों नक्षत्र एक ही रज्जु (शरीर अंग) समूह में हैं — यह विवाह की स्थिरता के लिए चिन्ता का विषय है।'
                    : isTamil
                      ? 'இரு நட்சத்திரங்களும் ஒரே ரஜ்ஜு குழுவில் உள்ளன — இது திருமண நிலைத்தன்மைக்கு கவலையளிக்கிறது.'
                      : 'Both nakshatras fall in the same Rajju (body part) group — this is a concern for marital stability.'}
                </div>
              </motion.div>
            )}

            {/* Vedha Dosha Warning */}
            {dashaResult.kutas[9]?.scored === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border-2 border-amber-500/30 rounded-xl p-5 mb-8 text-center"
              >
                <div className="text-amber-400 font-bold text-lg mb-1" style={headingFont}>
                  {isDevanagari ? 'वेध दोष' : isTamil ? 'வேதை தோஷம்' : 'Vedha Dosha'}
                </div>
                <div className="text-text-secondary text-sm">
                  {isDevanagari
                    ? 'नक्षत्र जोड़ी में वेध (पीड़ा) है — शास्त्रीय ग्रन्थों के अनुसार यह अशुभ संयोग है।'
                    : isTamil
                      ? 'நட்சத்திர ஜோடியில் வேதை (பீடை) உள்ளது — சாஸ்திர நூல்களின்படி இது அசுப கூட்டணி.'
                      : 'The nakshatra pair has Vedha (affliction) — considered inauspicious per classical texts.'}
                </div>
              </motion.div>
            )}

            {/* Dasha Koota Intro */}
            <InfoBlock
              id="matching-dasha-koota"
              title={isTamil ? 'தசகூடம் (10-மடங்கு பொருத்தம்) என்றால் என்ன?' : isDevanagari ? 'दशकूट (10-गुण मिलान) क्या है?' : 'What is Dasha Koota (10-Fold Compatibility)?'}
              defaultOpen={true}
            >
              {isDevanagari ? (
                <p>दशकूट पद्धति दक्षिण भारतीय विवाह मिलान प्रणाली है जो 10 कूटों पर संगतता को अंकित करती है (अधिकतम 10 अंक): दिन (1.5 अंक) — नक्षत्र दिवस अनुकूलता, गण (1.5 अंक) — स्वभाव मिलान, महेन्द्र (1 अंक) — समृद्धि, स्त्री दीर्घ (1 अंक) — वधू की दीर्घायु, योनि (1 अंक) — शारीरिक अनुकूलता, राशि (1 अंक) — चन्द्र राशि मिलान, राश्यधिपति (1 अंक) — ग्रह मैत्री, वश्य (1 अंक) — परस्पर आकर्षण, रज्जु (1 अंक) — विवाह स्थिरता, वेध (1 अंक) — नक्षत्र पीड़ा अभाव। 8+ = उत्तम, 5-7 = अच्छा, 5 से कम = चुनौतीपूर्ण।</p>
              ) : (
                <p>The Dasha Koota system is the South Indian marriage matching method that scores compatibility on 10 dimensions (max 10 points): Dina (1.5pts) — nakshatra day compatibility, Gana (1.5pts) — temperament, Mahendra (1pt) — prosperity, Stree Deergha (1pt) — bride&apos;s longevity, Yoni (1pt) — physical compatibility, Rashi (1pt) — Moon sign match, Rashiadhipati (1pt) — sign lord friendship, Vasya (1pt) — mutual attraction, Rajju (1pt) — marriage durability, Vedha (1pt) — absence of nakshatra affliction. 8+ = Excellent, 5-7 = Good, below 5 = Challenging.</p>
              )}
            </InfoBlock>

            {/* Kuta Breakdown */}
            <h2 className="text-3xl font-bold text-gold-gradient mb-8 text-center" style={headingFont}>
              {isTamil ? 'தசகூட விவரம்' : isDevanagari ? 'दशकूट विवरण' : 'Dasha Koota Breakdown'}
            </h2>

            <div className="space-y-4 mb-12">
              {dashaResult.kutas.map((kuta, i) => (
                <motion.div
                  key={kuta.name.en}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                        {tl(kuta.name, locale)}
                      </span>
                      <span className="text-text-secondary text-xs ml-3">{tl(kuta.description, locale)}</span>
                    </div>
                    <span className="font-mono text-lg font-bold text-gold-primary">
                      {kuta.scored} <span className="text-text-secondary text-sm">/ {kuta.maxPoints}</span>
                    </span>
                  </div>
                  <div className="w-full bg-bg-tertiary rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(kuta.scored / kuta.maxPoints) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                      className={`h-full rounded-full ${scoreBarColor(kuta.scored, kuta.maxPoints)}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            </div>

            {/* Share + Print for Dasha Koota */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <PrintButton
                contentRef={matchResultRef}
                title={isTamil ? 'தசகூட பொருத்த முடிவுகள்' : isDevanagari ? 'दशकूट मिलान परिणाम' : 'Dasha Koota Matching Results'}
                label={isTamil ? 'அச்சிடு / PDF' : locale === 'en' ? 'Print / PDF' : 'प्रिंट / PDF'}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results — Ashta Kuta (North Indian 36pt) */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GoldDivider />
            <div ref={matchResultRef}>

            {/* Score Circle */}
            {(() => {
              const circumference = 2 * Math.PI * 52;
              const targetOffset = circumference * (1 - result.percentage / 100);
              const verdictHex = getVerdictHex(result.verdict);
              return (
                <div className="my-12 text-center">
                  <div className="inline-block relative">
                    {/* Pulsing glow ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          `0 0 30px 10px ${verdictHex}20`,
                          `0 0 60px 20px ${verdictHex}30`,
                          `0 0 30px 10px ${verdictHex}20`,
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
                    />
                    <svg className="w-56 h-56 sm:w-72 sm:h-72" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" className="text-bg-tertiary" />
                      <motion.circle
                        cx="60" cy="60" r="52"
                        fill="none"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        stroke={verdictHex}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: targetOffset }}
                        transition={{ duration: 1.5, ease: 'easeOut' as const }}
                      />
                      <text x="60" y="52" textAnchor="middle" className="fill-gold-light text-3xl font-bold" style={{ fontSize: '28px' }}>
                        {displayScore}
                      </text>
                      <text x="60" y="72" textAnchor="middle" className="fill-text-secondary" style={{ fontSize: '11px' }}>
                        / {result.maxScore}
                      </text>
                    </svg>
                  </div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
                  >
                    <div className={`inline-block mt-4 px-6 py-2 rounded-xl border text-lg font-bold ${verdictColors[result.verdict]}`} style={headingFont}>
                      {tl(result.verdictText, locale)}
                    </div>
                  </motion.div>
                  <div className="text-text-secondary text-sm mt-3">{result.percentage}% {t('compatibility')}</div>
                </div>
              );
            })()}

            {/* Narrative verdict — shown before the kuta breakdown */}
            {(() => {
              const verdict = getOverallVerdict(result.totalScore);
              const verdictBorder: Record<string, string> = {
                excellent: 'border-emerald-500/25 bg-emerald-500/5',
                good: 'border-green-500/25 bg-green-500/5',
                average: 'border-amber-500/25 bg-amber-500/5',
                caution: 'border-red-500/25 bg-red-500/5',
              };
              const verdictTextColor: Record<string, string> = {
                excellent: 'text-emerald-400',
                good: 'text-green-400',
                average: 'text-amber-400',
                caution: 'text-red-400',
              };
              const boyName = boyBirth.name || (isTamil ? 'மணமகன்' : locale === 'en' ? 'Groom' : 'वर');
              const girlName = girlBirth.name || (isTamil ? 'மணமகள்' : locale === 'en' ? 'Bride' : 'वधू');
              return (
                <div className={`mt-6 mb-8 rounded-xl border p-5 max-w-lg mx-auto text-left ${verdictBorder[verdict.tier]}`}>
                  <div className={`font-bold text-lg mb-2 ${verdictTextColor[verdict.tier]}`} style={headingFont}>
                    {boyName} &amp; {girlName} — {verdict.headline}
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{verdict.body}</p>
                </div>
              );
            })()}

            {/* Nadi Dosha Warning */}
            {result.nadiDoshaPresent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border-2 border-red-500/30 rounded-xl p-5 mb-8 text-center"
              >
                <div className="text-red-400 font-bold text-lg mb-1" style={headingFont}>{t('nadiDosha')}</div>
                <div className="text-text-secondary text-sm">{t('nadiDoshaDesc')}</div>
              </motion.div>
            )}

            {/* Nadi Dosha Cancelled (N4: same nakshatra + same pada) */}
            {result.nadiDoshaCancelled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border-2 border-emerald-500/30 rounded-xl p-5 mb-8 text-center"
              >
                <div className="text-emerald-400 font-bold text-lg mb-1" style={headingFont}>
                  {locale === 'hi' ? 'नाड़ी दोष निरस्त' : locale === 'ta' ? 'நாடி தோஷம் நீக்கப்பட்டது' : locale === 'bn' ? 'নাড়ী দোষ নিরস্ত' : 'Nadi Dosha Cancelled'}
                </div>
                <div className="text-text-secondary text-sm">
                  {locale === 'hi'
                    ? 'समान नक्षत्र और पाद — आनुवंशिक अनुकूलता। नाड़ी दोष पूर्णतया निरस्त। यह शुभ संकेत है।'
                    : locale === 'ta'
                      ? 'ஒரே நட்சத்திரம் மற்றும் பாதம் — மரபணு இணக்கம். நாடி தோஷம் முற்றிலும் நீக்கப்பட்டது.'
                      : locale === 'bn'
                        ? 'একই নক্ষত্র এবং পাদ জিনগত সামঞ্জস্য নির্দেশ করে। নাড়ী দোষ সম্পূর্ণরূপে নিরস্ত — এটি একটি শুভ সংকেত।'
                        : 'Same nakshatra and pada indicates genetic compatibility. Nadi Dosha is fully cancelled — this is a positive indicator.'}
                </div>
              </motion.div>
            )}

            {/* Ashta Kuta Intro */}
            <InfoBlock
              id="matching-ashta-kuta"
              title={isTamil ? 'அஷ்ட கூடம் (8-மடங்கு பொருத்தம்) என்றால் என்ன?' : locale === 'en' ? 'What is Ashta Kuta (8-Fold Compatibility)?' : 'अष्ट कूट (8-गुण मिलान) क्या है?'}
              defaultOpen={true}
            >
              {isDevanagari ? (
                <p>अष्ट कूट पद्धति 8 आयामों पर संगतता को अंकित करती है (अधिकतम 36 अंक): वर्ण (1 अंक) — आध्यात्मिक अनुकूलता, वश्य (2 अंक) — परस्पर आकर्षण, तारा (3 अंक) — नक्षत्र सामंजस्य, योनि (4 अंक) — शारीरिक अनुकूलता, ग्रह मैत्री (5 अंक) — मानसिक तालमेल, गण (6 अंक) — स्वभाव मिलान (देव/मनुष्य/राक्षस), भकूट (7 अंक) — समग्र समृद्धि, नाड़ी (8 अंक) — स्वास्थ्य व आनुवंशिक अनुकूलता (एक ही नाड़ी = गंभीर दोष)। 28+ = उत्तम, 18-27 = अच्छा, 18 से कम = चुनौतीपूर्ण। ये दिशानिर्देश हैं, फैसले नहीं — कम अंकों वाले कई सफल विवाह हुए हैं।</p>
              ) : (
                <p>The Ashta Kuta system scores compatibility on 8 dimensions (max 36 points): Varna (1pt) — spiritual compatibility, Vashya (2pts) — mutual attraction, Tara (3pts) — birth star harmony, Yoni (4pts) — physical compatibility, Graha Maitri (5pts) — mental wavelength, Gana (6pts) — temperament match (gentle/mixed/intense), Bhakoot (7pts) — overall prosperity, Nadi (8pts) — health and genetic compatibility (same Nadi = serious concern). 28+ = Excellent, 18–27 = Good, below 18 = Challenging. These are guidelines, not verdicts — many happy marriages have low scores.</p>
              )}
            </InfoBlock>

            {/* Kuta Breakdown */}
            <h2 className="text-3xl font-bold text-gold-gradient mb-8 text-center" style={headingFont}>
              {t('kutaBreakdown')}
            </h2>

            {/* Kuta visual scale cards */}
            {(() => {
              // Scale definitions for kutas that have ordinal values
              const KUTA_SCALES: Record<string, string[]> = {
                'Varna': ['Shudra', 'Vaishya', 'Kshatriya', 'Brahmin'],
                'Gana': ['Deva (gentle)', 'Manushya (balanced)', 'Rakshasa (intense)'],
                'Nadi': ['Aadi (Vata)', 'Madhya (Pitta)', 'Antya (Kapha)'],
              };

              return (
                <div className="space-y-3 mb-12">
                  {result.kutas.map((kuta, i) => {
                    const insight = getKutaInsight(kuta.name.en, kuta.scored, kuta.maxPoints);
                    const pct = kuta.maxPoints > 0 ? kuta.scored / kuta.maxPoints : 0;
                    const isMajor = kuta.maxPoints >= 6;
                    const scoreColor = pct >= 0.75 ? 'text-emerald-400' : pct >= 0.5 ? 'text-amber-400' : pct >= 0.25 ? 'text-orange-400' : 'text-red-400';
                    const barColor = scoreBarColor(kuta.scored, kuta.maxPoints);
                    const scale = KUTA_SCALES[kuta.name.en];
                    const boyName = boyBirth.name || (locale === 'hi' ? 'वर' : 'Partner 1');
                    const girlName = girlBirth.name || (locale === 'hi' ? 'कन्या' : 'Partner 2');

                    return (
                      <motion.div
                        key={kuta.name.en}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={`bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4 sm:p-5 ${isMajor ? 'border-l-4 border-l-gold-primary/40' : ''}`}
                      >
                        {/* Header: kuta name + score */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-gold-light font-bold ${isMajor ? 'text-base' : 'text-sm'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                              {tl(kuta.name, locale)}
                            </span>
                            {isMajor && <span className="text-[9px] uppercase tracking-wider text-gold-primary/50 font-bold border border-gold-primary/20 px-1.5 py-0.5 rounded">
                              {locale === 'hi' ? 'प्रमुख' : 'Major'}
                            </span>}
                            <span className="text-text-secondary/60 text-[11px] hidden sm:inline">{tl(kuta.description, locale)}</span>
                          </div>
                          <span className={`font-mono font-black ${scoreColor} ${isMajor ? 'text-lg' : 'text-sm'}`}>
                            {kuta.scored}<span className="text-text-secondary/50 text-xs font-normal">/{kuta.maxPoints}</span>
                          </span>
                        </div>

                        {/* Score bar */}
                        <div className={`w-full bg-bg-tertiary/50 rounded-full overflow-hidden ${isMajor ? 'h-2.5' : 'h-1.5'} mb-4`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct * 100}%` }}
                            transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
                            className={`h-full rounded-full ${barColor}`}
                          />
                        </div>

                        {/* Partner comparison: scale or badges */}
                        {kuta.boyDetail && kuta.girlDetail && (
                          <div className="mb-3">
                            {scale ? (
                              /* Ordinal scale with dots */
                              <div className="relative">
                                {/* Scale track */}
                                <div className="flex items-center justify-between px-2 mb-1">
                                  {scale.map((label, si) => {
                                    const isBoy = kuta.boyDetail === label;
                                    const isGirl = kuta.girlDetail === label;
                                    return (
                                      <div key={si} className="flex flex-col items-center gap-1 relative">
                                        {/* Dot markers */}
                                        <div className="flex gap-1">
                                          {isBoy && (
                                            <div className="w-5 h-5 rounded-full bg-blue-500/80 border-2 border-blue-400 flex items-center justify-center" title={boyName}>
                                              <span className="text-[8px] font-bold text-white">1</span>
                                            </div>
                                          )}
                                          {isGirl && (
                                            <div className="w-5 h-5 rounded-full bg-pink-500/80 border-2 border-pink-400 flex items-center justify-center" title={girlName}>
                                              <span className="text-[8px] font-bold text-white">2</span>
                                            </div>
                                          )}
                                          {!isBoy && !isGirl && (
                                            <div className="w-2 h-2 rounded-full bg-gold-primary/15 mt-1.5" />
                                          )}
                                        </div>
                                        <span className={`text-[9px] leading-tight text-center max-w-[70px] ${isBoy || isGirl ? 'text-text-primary font-semibold' : 'text-text-secondary/40'}`}>
                                          {label.split(' (')[0]}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                                {/* Connecting line */}
                                <div className="absolute top-[10px] left-4 right-4 h-[1px] bg-gold-primary/10 -z-0" />
                              </div>
                            ) : (
                              /* Non-ordinal: two badges side by side */
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-3 h-3 rounded-full bg-blue-500/70 border border-blue-400/50 flex-shrink-0" />
                                  <span className="text-xs text-text-secondary">{boyName}:</span>
                                  <span className="text-xs text-blue-300 font-semibold">{kuta.boyDetail}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-3 h-3 rounded-full bg-pink-500/70 border border-pink-400/50 flex-shrink-0" />
                                  <span className="text-xs text-text-secondary">{girlName}:</span>
                                  <span className="text-xs text-pink-300 font-semibold">{kuta.girlDetail}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interpretation */}
                        <p className={`leading-relaxed ${isMajor ? 'text-xs' : 'text-[11px]'} text-text-secondary/70`}>
                          {insight}
                        </p>
                      </motion.div>
                    );
                  })}

                  {/* Tally */}
                  <div className="bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-gold-light font-bold text-sm" style={headingFont}>
                      {locale === 'hi' ? 'कुल अंक' : 'Total Score'}
                    </span>
                    <span className="font-mono font-black text-gold-primary text-xl">
                      {result.totalScore} <span className="text-text-secondary text-sm font-normal">/ 36</span>
                    </span>
                  </div>
                </div>
              );
            })()}
            </div>
            {/* P2-03: Nakshatra Veda Pairs */}
            {(() => {
              const bNak = boyComputed?.nakshatra;
              const gNak = girlComputed?.nakshatra;
              if (!bNak || !gNak) return null;
              // 11 Veda pairs (each arrows the other — one dominates)
              const VEDA_PAIRS: [number, number][] = [
                [4, 5], // Rohini / Mrigashira
                [6, 7], // Ardra / Punarvasu
                [8, 9], // Pushya / Ashlesha
                [11, 12], // P.Phalguni / U.Phalguni
                [13, 14], // Hasta / Chitra
                [15, 16], // Swati / Vishakha
                [17, 18], // Anuradha / Jyestha
                [20, 21], // Purvashadha / Uttarashadha
                [22, 23], // Shravana / Dhanishtha
                [24, 25], // Shatabhisha / Purva Bhadrapada
                [26, 27], // Uttara Bhadrapada / Revati
              ];
              const NAK_NAMES_EN = ['','Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','P.Phalguni','U.Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyestha','Moola','P.Shadha','U.Shadha','Shravana','Dhanishtha','Shatabhisha','P.Bhadra','U.Bhadra','Revati'];
              const NAK_NAMES_HI = ['','अश्विनी','भरणी','कृत्तिका','रोहिणी','मृगशिरा','आर्द्रा','पुनर्वसु','पुष्य','आश्लेषा','मघा','पू.फाल्गुनी','उ.फाल्गुनी','हस्त','चित्रा','स्वाती','विशाखा','अनुराधा','ज्येष्ठा','मूल','पू.आषाढ़','उ.आषाढ़','श्रवण','धनिष्ठा','शतभिषा','पू.भाद्र','उ.भाद्र','रेवती'];
              const vedaPair = VEDA_PAIRS.find(([a, b]) => (a === bNak && b === gNak) || (a === gNak && b === bNak));
              if (!vedaPair) return null;
              const lk = (isDevanagariLocale(locale)) ? 'hi' as const : 'en' as const;
              const sn = (n: number) => lk === 'en' ? NAK_NAMES_EN[n] : NAK_NAMES_HI[n];
              // In Veda pair: the lower-numbered nakshatra tends to dominate (traditional view)
              const dominant = Math.min(bNak, gNak) === bNak ? 'boy' : 'girl';
              return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/25 p-5">
                  <h3 className="text-amber-300 font-bold text-base mb-1" style={headingFont}>
                    {lk === 'en' ? 'Nakshatra Veda Pair Detected' : 'नक्षत्र वेद जोड़ी पहचानी गई'}
                  </h3>
                  <p className="text-text-secondary/70 text-xs mb-3" style={lk !== 'en' ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {lk === 'en'
                      ? `${sn(bNak)} and ${sn(gNak)} form a classical Nakshatra Veda pair — these stars "arrow" each other in traditional compatibility texts. One partner tends to have greater influence in the relationship. Source: Nakshatra compatibility texts.`
                      : `${sn(bNak)} और ${sn(gNak)} शास्त्रीय नक्षत्र वेध जोड़ी बनाते हैं — ये नक्षत्र पारम्परिक मिलान ग्रन्थों में एक-दूसरे को "वेध" करते हैं। एक साथी का सम्बन्ध में अधिक प्रभाव होता है।`}
                  </p>
                  <div className="flex items-center gap-3 justify-center">
                    <span className="text-amber-300 font-bold">{sn(bNak)}</span>
                    <span className="text-text-secondary/70">↔</span>
                    <span className="text-amber-300 font-bold">{sn(gNak)}</span>
                    <span className="text-amber-400/60 text-xs">({lk === 'en' ? 'Veda pair' : 'वेध जोड़ी'})</span>
                  </div>
                  <p className="text-text-secondary/70 text-xs text-center mt-2" style={lk !== 'en' ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {lk === 'en'
                      ? `The ${dominant === 'boy' ? 'boy/groom' : 'girl/bride'}'s nakshatra (${sn(Math.min(bNak, gNak))}) traditionally has stronger influence. Veda pairs are additional insight — consult the full Ashta Kuta score for the overall picture.`
                      : `${dominant === 'boy' ? 'वर' : 'वधू'} का नक्षत्र (${sn(Math.min(bNak, gNak))}) परम्परागत रूप से अधिक प्रभावशाली। पूर्ण चित्र के लिए अष्ट कूट देखें।`}
                  </p>
                </motion.div>
              );
            })()}

            {/* ── Side-by-side Birth Charts ── */}
            {(boyKundali || girlKundali) && (
              <div className="mt-8">
                <GoldDivider />
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-gold-light font-bold text-sm hover:text-gold-primary transition-colors"
                  style={headingFont}
                >
                  {isTamil ? 'ஜாதகங்களை ஒப்பிடுங்கள்' : locale === 'en' ? 'Compare Birth Charts' : 'जन्म कुण्डली तुलना'}
                  <motion.span animate={{ rotate: showCharts ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {showCharts && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {boyKundali && (
                          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                            <h3 className="text-blue-400 font-bold text-center mb-3" style={headingFont}>
                              {boyBirth.name || (isTamil ? 'மணமகன்' : locale === 'en' ? 'Groom' : 'वर')}
                            </h3>
                            <ChartNorth data={boyKundali.chart} title="" size={400} />
                            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                              {boyKundali.planets.slice(0, 9).map(p => (
                                <div key={p.planet.id} className="rounded-lg bg-bg-tertiary/30 p-1.5">
                                  <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                    {tl(GRAHAS[p.planet.id]?.name, locale)?.slice(0, 6)}
                                  </span>
                                  <span className="text-text-secondary ml-1">
                                    {tl(RASHIS[p.sign - 1]?.name, locale)?.slice(0, 4)}
                                  </span>
                                  {p.isRetrograde && <span className="text-red-400 ml-0.5 text-[9px]">R</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {girlKundali && (
                          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-4">
                            <h3 className="text-pink-400 font-bold text-center mb-3" style={headingFont}>
                              {girlBirth.name || (isTamil ? 'மணமகள்' : locale === 'en' ? 'Bride' : 'वधू')}
                            </h3>
                            <ChartNorth data={girlKundali.chart} title="" size={400} />
                            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                              {girlKundali.planets.slice(0, 9).map(p => (
                                <div key={p.planet.id} className="rounded-lg bg-bg-tertiary/30 p-1.5">
                                  <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                    {tl(GRAHAS[p.planet.id]?.name, locale)?.slice(0, 6)}
                                  </span>
                                  <span className="text-text-secondary ml-1">
                                    {tl(RASHIS[p.sign - 1]?.name, locale)?.slice(0, 4)}
                                  </span>
                                  {p.isRetrograde && <span className="text-red-400 ml-0.5 text-[9px]">R</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Share + Print */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <button
                onClick={() => {
                  const boyName = boyBirth.name || (isTamil ? 'மணமகன்' : locale === 'en' ? 'Groom' : 'वर');
                  const girlName = girlBirth.name || (isTamil ? 'மணமகள்' : locale === 'en' ? 'Bride' : 'வधू');
                  const msg = locale === 'en'
                    ? `${boyName} & ${girlName} — Ashta Kuta Score: ${result.totalScore}/${result.maxScore} (${result.percentage}%) — ${result.verdictText.en}\n\nCheck your compatibility: https://dekhopanchang.com/en/matching`
                    : `${boyName} और ${girlName} — अष्ट कूट अंक: ${result.totalScore}/${result.maxScore} (${result.percentage}%) — ${result.verdictText.hi}\n\nअपनी अनुकूलता जाँचें: https://dekhopanchang.com/hi/matching`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {isTamil ? 'WhatsApp-ல் பகிரவும்' : locale === 'en' ? 'Share on WhatsApp' : 'WhatsApp पर शेयर करें'}
              </button>
              <ShareCardButton
                cardUrl={(() => {
                  // Build compatibility card URL with highlighted kutas.
                  // URL-params take priority over any cached state at the card renderer.
                  const boyNameCard = boyBirth.name || (locale === 'en' ? 'Groom' : isTamil ? 'மணமகன்' : 'वर');
                  const girlNameCard = girlBirth.name || (locale === 'en' ? 'Bride' : isTamil ? 'மணமகள்' : 'वधू');
                  const boySignName = boyComputed ? (RASHIS[boyComputed.rashi - 1]?.name?.en ?? '') : '';
                  const girlSignName = girlComputed ? (RASHIS[girlComputed.rashi - 1]?.name?.en ?? '') : '';
                  const highlights = selectHighlightKutas(
                    result.kutas.map((k) => ({ name: k.name.en, score: k.scored, maxScore: k.maxPoints }))
                  );
                  const cardParams = new URLSearchParams({
                    format: 'story',
                    person1Name: boyNameCard,
                    person1Sign: boySignName,
                    person2Name: girlNameCard,
                    person2Sign: girlSignName,
                    score: String(result.totalScore),
                    maxScore: String(result.maxScore),
                    verdict: result.verdict,
                  });
                  highlights.forEach((h, i) => {
                    cardParams.set(`kuta${i + 1}Name`, h.name);
                    cardParams.set(`kuta${i + 1}Score`, String(h.score));
                    cardParams.set(`kuta${i + 1}Max`, String(h.maxScore));
                    cardParams.set(`kuta${i + 1}Insight`, h.insight);
                  });
                  return `https://dekhopanchang.com/api/card/compatibility?${cardParams.toString()}`;
                })()}
                title={locale === 'en' ? 'Cosmic Compatibility Card' : 'ब्रह्मांडीय अनुकूलता कार्ड'}
                text={locale === 'en'
                  ? `Scored ${result.totalScore}/${result.maxScore} — ${result.verdictText.en}`
                  : `अष्ट कूट अंक: ${result.totalScore}/${result.maxScore}`}
              />
              <PrintButton
                contentRef={matchResultRef}
                title={isTamil ? 'ஜாதக பொருத்த முடிவுகள்' : locale === 'en' ? 'Kundali Matching Results' : 'कुण्डली मिलान परिणाम'}
                label={isTamil ? 'அச்சிடு / PDF' : locale === 'en' ? 'Print / PDF' : 'प्रिंट / PDF'}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO cross-links */}
      <RelatedLinks type="learn" links={getLearnLinksForTool('/matching')} locale={locale} />
    </div>
  );
}
