'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Calendar } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import PrintButton from '@/components/ui/PrintButton';
import LocationSearch from '@/components/ui/LocationSearch';
import ChartNorth from '@/components/kundali/ChartNorth';
import { NakshatraIcon } from '@/components/icons/PanchangIcons';
import { computeBirthSignsAction } from '@/app/actions/birth-signs';
import InfoBlock from '@/components/ui/InfoBlock';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import type { MatchResult } from '@/lib/matching/ashta-kuta';
import type { KundaliData } from '@/types/kundali';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

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

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const matchResultRef = useRef<HTMLDivElement>(null);
  const [boyKundali, setBoyKundali] = useState<KundaliData | null>(null);
  const [girlKundali, setGirlKundali] = useState<KundaliData | null>(null);
  const [showCharts, setShowCharts] = useState(false);

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
        }),
      });
      if (!res.ok) { setMatchError(isTamil ? 'பொருத்தம் தோல்வி. மீண்டும் முயற்சிக்கவும்.' : locale === 'en' ? 'Matching failed. Please try again.' : 'मिलान विफल। कृपया पुनः प्रयास करें।'); setResult(null); setLoading(false); return; }
      const data = await res.json();
      if (data.error) { setMatchError(data.error); setResult(null); setLoading(false); return; }
      setMatchError(null);
      setResult(data);

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
    } catch { setMatchError(isTamil ? 'இணைப்பு பிழை. இணைய இணைப்பை சரிபார்க்கவும்.' : locale === 'en' ? 'Connection error. Please check your internet.' : 'कनेक्शन त्रुटि। कृपया इंटरनेट जाँचें।'); setResult(null); }
    setLoading(false);
  }, [boyComputed, girlComputed, boyBirth, girlBirth]);

  const verdictColors: Record<string, string> = {
    excellent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    good: 'text-green-400 border-green-500/30 bg-green-500/10',
    average: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    below_average: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    not_recommended: 'text-red-400 border-red-500/30 bg-red-500/10',
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
        </div>
      </motion.div>

      {/* Birth details mode only — enter exact birth data for accurate matching */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gold-primary/20 bg-gold-primary/10 text-gold-light text-sm font-bold">
          <Calendar className="w-4 h-4" />
          {lbl.birthMode}
        </div>
      </div>

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

      {/* Results */}
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
            <div className="my-12 text-center">
              <div className="inline-block relative">
                <svg className="w-36 h-36 sm:w-48 sm:h-48" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" className="text-bg-tertiary" />
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - result.percentage / 100)}`}
                    className={
                      result.verdict === 'excellent' || result.verdict === 'good' ? 'stroke-emerald-500' :
                      result.verdict === 'average' ? 'stroke-amber-500' :
                      'stroke-red-500'
                    }
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dashoffset 1s ease-out' }}
                  />
                  <text x="60" y="52" textAnchor="middle" className="fill-gold-light text-3xl font-bold" style={{ fontSize: '28px' }}>
                    {result.totalScore}
                  </text>
                  <text x="60" y="72" textAnchor="middle" className="fill-text-secondary" style={{ fontSize: '11px' }}>
                    / {result.maxScore}
                  </text>
                </svg>
              </div>
              <div className={`inline-block mt-4 px-6 py-2 rounded-xl border text-lg font-bold ${verdictColors[result.verdict]}`} style={headingFont}>
                {tl(result.verdictText, locale)}
              </div>
              <div className="text-text-secondary text-sm mt-3">{result.percentage}% {t('compatibility')}</div>
            </div>

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

            <div className="space-y-4 mb-12">
              {result.kutas.map((kuta, i) => (
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
              <PrintButton
                contentRef={matchResultRef}
                title={isTamil ? 'ஜாதக பொருத்த முடிவுகள்' : locale === 'en' ? 'Kundali Matching Results' : 'कुण्डली मिलान परिणाम'}
                label={isTamil ? 'அச்சிடு / PDF' : locale === 'en' ? 'Print / PDF' : 'प्रिंट / PDF'}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
