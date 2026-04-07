'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Calendar, Star } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import PrintButton from '@/components/ui/PrintButton';
import LocationSearch from '@/components/ui/LocationSearch';
import { NakshatraIcon } from '@/components/icons/PanchangIcons';
import { computeBirthSigns } from '@/lib/ephem/astronomical';
import InfoBlock from '@/components/ui/InfoBlock';
import type { Locale } from '@/types/panchang';
import type { MatchResult } from '@/lib/matching/ashta-kuta';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';

const L = {
  en: {
    birthMode: 'Calculate from Birth Details',
    directMode: 'I know my Nakshatra & Rashi',
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
    directMode: 'मुझे अपनी नक्षत्र व राशि पता है',
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
    directMode: 'मम नक्षत्रं राशिश्च ज्ञातम्',
    dateOfBirth: 'जन्मतिथिः',
    timeOfBirth: 'जन्मसमयः',
    placeOfBirth: 'जन्मस्थानम्',
    calculated: 'गणितम्',
    calculating: 'गणना प्रचलति...',
    enterBirthDetails: 'स्वयं गणनार्थं जन्मविवरणं दत्तवान्',
    name: 'नाम',
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

function computeMoonFromBirth(birth: PersonBirth): { nakshatra: number; rashi: number } | null {
  if (!birth.date || !birth.time || birth.placeLat === null || birth.placeLng === null || !birth.placeTimezone) return null;
  try {
    const b = computeBirthSigns(birth.date, birth.time, birth.placeLat, birth.placeLng, birth.placeTimezone);
    return { nakshatra: b.moonNakshatra, rashi: b.moonSign };
  } catch { return null; }
}

export default function MatchingPage() {
  const t = useTranslations('matching');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const lbl = L[locale] || L.en;

  const [mode, setMode] = useState<'birth' | 'direct'>('birth');

  // Nakshatra → primary rashi mapping (1-indexed, follows classical assignment)
  // Each nakshatra maps to the rashi that contains its majority padas.
  const NAKSHATRA_TO_RASHI = [
    0,  // placeholder (1-based, index 0 unused)
    1,  // 1  Ashwini → Aries
    1,  // 2  Bharani → Aries
    2,  // 3  Krittika → Taurus (1st pada Aries, rest Taurus)
    2,  // 4  Rohini → Taurus
    2,  // 5  Mrigashira → Taurus (1–2 pada Taurus, 3–4 Gemini; Taurus primary)
    3,  // 6  Ardra → Gemini
    3,  // 7  Punarvasu → Gemini (4th pada Cancer)
    4,  // 8  Pushya → Cancer
    4,  // 9  Ashlesha → Cancer
    5,  // 10 Magha → Leo
    5,  // 11 P.Phalguni → Leo
    6,  // 12 U.Phalguni → Virgo (1st pada Leo)
    6,  // 13 Hasta → Virgo
    6,  // 14 Chitra → Virgo (1–2 pada Virgo, 3–4 Libra; Virgo primary)
    7,  // 15 Swati → Libra
    7,  // 16 Vishakha → Libra (4th pada Scorpio)
    8,  // 17 Anuradha → Scorpio
    8,  // 18 Jyeshtha → Scorpio
    9,  // 19 Mula → Sagittarius
    9,  // 20 P.Ashadha → Sagittarius
    10, // 21 U.Ashadha → Capricorn (1st pada Sagittarius)
    10, // 22 Shravana → Capricorn
    10, // 23 Dhanishtha → Capricorn (1–2 pada Cap, 3–4 Aquarius; Cap primary)
    11, // 24 Shatabhisha → Aquarius
    11, // 25 P.Bhadrapada → Aquarius (4th pada Pisces)
    12, // 26 U.Bhadrapada → Pisces
    12, // 27 Revati → Pisces
  ];

  // Direct mode state
  const [boyNakshatra, setBoyNakshatra] = useState(0);
  const [boyRashi, setBoyRashi] = useState(0);
  const [girlNakshatra, setGirlNakshatra] = useState(0);
  const [girlRashi, setGirlRashi] = useState(0);

  const handleBoyNakshatra = useCallback((n: number) => {
    setBoyNakshatra(n);
    if (n > 0) setBoyRashi(NAKSHATRA_TO_RASHI[n]);
  }, []);

  const handleGirlNakshatra = useCallback((n: number) => {
    setGirlNakshatra(n);
    if (n > 0) setGirlRashi(NAKSHATRA_TO_RASHI[n]);
  }, []);

  // Birth mode state
  const emptyBirth: PersonBirth = { name: '', date: '', time: '06:00', placeName: '', placeLat: null, placeLng: null, placeTimezone: null };
  const [boyBirth, setBoyBirth] = useState<PersonBirth>(emptyBirth);
  const [girlBirth, setGirlBirth] = useState<PersonBirth>(emptyBirth);
  const boyComputed = computeMoonFromBirth(boyBirth);
  const girlComputed = computeMoonFromBirth(girlBirth);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const matchResultRef = useRef<HTMLDivElement>(null);

  const handleMatch = useCallback(async () => {
    const bNak = mode === 'birth' ? boyComputed?.nakshatra : boyNakshatra;
    const bRashi = mode === 'birth' ? boyComputed?.rashi : boyRashi;
    const gNak = mode === 'birth' ? girlComputed?.nakshatra : girlNakshatra;
    const gRashi = mode === 'birth' ? girlComputed?.rashi : girlRashi;
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
      if (!res.ok) { setResult(null); setLoading(false); return; }
      const data = await res.json();
      if (data.error) { setResult(null); setLoading(false); return; }
      setResult(data);
    } catch { setResult(null); }
    setLoading(false);
  }, [mode, boyComputed, girlComputed, boyNakshatra, boyRashi, girlNakshatra, girlRashi]);

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
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
      </motion.div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl border border-gold-primary/20 overflow-hidden">
          <button
            onClick={() => { setMode('birth'); setResult(null); }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all ${mode === 'birth' ? 'bg-gold-primary/20 text-gold-light' : 'text-text-secondary hover:text-gold-light'}`}
          >
            <Calendar className="w-4 h-4" />
            {lbl.birthMode}
          </button>
          <button
            onClick={() => { setMode('direct'); setResult(null); }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all ${mode === 'direct' ? 'bg-gold-primary/20 text-gold-light' : 'text-text-secondary hover:text-gold-light'}`}
          >
            <Star className="w-4 h-4" />
            {lbl.directMode}
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
        {/* Groom */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-5 md:p-6 border border-blue-500/20"
        >
          <h2 className="text-xl font-bold text-blue-400 mb-6 text-center" style={headingFont}>{t('groomDetails')}</h2>

          {mode === 'birth' ? (
            <div className="space-y-4">
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.name}</label>
                <input type="text" value={boyBirth.name} onChange={(e) => setBoyBirth({ ...boyBirth, name: e.target.value })}
                  className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50" placeholder={locale === 'en' ? 'Groom name' : 'वर का नाम'} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.dateOfBirth}</label>
                  <input type="date" value={boyBirth.date} onChange={(e) => setBoyBirth({ ...boyBirth, date: e.target.value })}
                    className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50" />
                </div>
                <div>
                  <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.timeOfBirth}</label>
                  <input type="time" value={boyBirth.time} onChange={(e) => setBoyBirth({ ...boyBirth, time: e.target.value })}
                    className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50" />
                </div>
              </div>
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.placeOfBirth}</label>
                <LocationSearch value={boyBirth.placeName} onSelect={(loc) => setBoyBirth({ ...boyBirth, placeName: loc.name, placeLat: loc.lat, placeLng: loc.lng, placeTimezone: loc.timezone })} />
              </div>
              {boyComputed && (
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-center">
                  <div className="text-blue-300 text-xs uppercase tracking-wider font-bold mb-1">{lbl.calculated}</div>
                  <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {NAKSHATRAS[boyComputed.nakshatra - 1]?.name[locale]}
                  </span>
                  <span className="text-text-secondary mx-2">/</span>
                  <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {RASHIS[boyComputed.rashi - 1]?.name[locale]}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{t('moonNakshatra')}</label>
                <select value={boyNakshatra} onChange={(e) => handleBoyNakshatra(Number(e.target.value))}
                  className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50"
                  style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  <option value={0}>{t('selectNakshatra')}</option>
                  {NAKSHATRAS.map((n) => (<option key={n.id} value={n.id}>{n.name[locale]}</option>))}
                </select>
              </div>
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">
                  {t('moonRashi')}
                  {boyNakshatra > 0 && <span className="text-gold-primary/50 text-xs ml-2 normal-case font-normal">(auto)</span>}
                </label>
                <select value={boyRashi} onChange={(e) => setBoyRashi(Number(e.target.value))}
                  disabled={boyNakshatra > 0}
                  className={`w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50 ${boyNakshatra > 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                  style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  <option value={0}>{t('selectRashi')}</option>
                  {RASHIS.map((r) => (<option key={r.id} value={r.id}>{r.name[locale]}</option>))}
                </select>
              </div>
            </div>
          )}
        </motion.div>

        {/* Bride */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-5 md:p-6 border border-pink-500/20"
        >
          <h2 className="text-xl font-bold text-pink-400 mb-6 text-center" style={headingFont}>{t('brideDetails')}</h2>

          {mode === 'birth' ? (
            <div className="space-y-4">
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.name}</label>
                <input type="text" value={girlBirth.name} onChange={(e) => setGirlBirth({ ...girlBirth, name: e.target.value })}
                  className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50" placeholder={locale === 'en' ? 'Bride name' : 'वधू का नाम'} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.dateOfBirth}</label>
                  <input type="date" value={girlBirth.date} onChange={(e) => setGirlBirth({ ...girlBirth, date: e.target.value })}
                    className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50" />
                </div>
                <div>
                  <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.timeOfBirth}</label>
                  <input type="time" value={girlBirth.time} onChange={(e) => setGirlBirth({ ...girlBirth, time: e.target.value })}
                    className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50" />
                </div>
              </div>
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{lbl.placeOfBirth}</label>
                <LocationSearch value={girlBirth.placeName} onSelect={(loc) => setGirlBirth({ ...girlBirth, placeName: loc.name, placeLat: loc.lat, placeLng: loc.lng, placeTimezone: loc.timezone })} />
              </div>
              {girlComputed && (
                <div className="rounded-lg border border-pink-500/20 bg-pink-500/5 p-3 text-center">
                  <div className="text-pink-300 text-xs uppercase tracking-wider font-bold mb-1">{lbl.calculated}</div>
                  <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {NAKSHATRAS[girlComputed.nakshatra - 1]?.name[locale]}
                  </span>
                  <span className="text-text-secondary mx-2">/</span>
                  <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {RASHIS[girlComputed.rashi - 1]?.name[locale]}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{t('moonNakshatra')}</label>
                <select value={girlNakshatra} onChange={(e) => handleGirlNakshatra(Number(e.target.value))}
                  className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50"
                  style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  <option value={0}>{t('selectNakshatra')}</option>
                  {NAKSHATRAS.map((n) => (<option key={n.id} value={n.id}>{n.name[locale]}</option>))}
                </select>
              </div>
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">
                  {t('moonRashi')}
                  {girlNakshatra > 0 && <span className="text-gold-primary/50 text-xs ml-2 normal-case font-normal">(auto)</span>}
                </label>
                <select value={girlRashi} onChange={(e) => setGirlRashi(Number(e.target.value))}
                  disabled={girlNakshatra > 0}
                  className={`w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50 ${girlNakshatra > 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                  style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  <option value={0}>{t('selectRashi')}</option>
                  {RASHIS.map((r) => (<option key={r.id} value={r.id}>{r.name[locale]}</option>))}
                </select>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Match Button */}
      <div className="text-center mb-12">
        <button
          onClick={handleMatch}
          disabled={loading || (mode === 'birth' ? (!boyComputed || !girlComputed) : (!boyNakshatra || !boyRashi || !girlNakshatra || !girlRashi))}
          className="px-10 py-4 bg-gradient-to-r from-gold-primary/30 to-gold-primary/20 border-2 border-gold-primary/40 rounded-xl text-gold-light font-bold text-lg hover:from-gold-primary/40 hover:to-gold-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={headingFont}
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin inline" /> : t('matchNow')}
        </button>
      </div>

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
                <svg className="w-48 h-48" viewBox="0 0 120 120">
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
                {result.verdictText[locale]}
              </div>
              <div className="text-text-secondary text-sm mt-3">{result.percentage}% {t('compatibility')}</div>
            </div>

            {/* Nadi Dosha Warning */}
            {result.nadiDoshaPresent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border-2 border-red-500/30 bg-red-500/5 mb-8 text-center"
              >
                <div className="text-red-400 font-bold text-lg mb-1" style={headingFont}>{t('nadiDosha')}</div>
                <div className="text-text-secondary text-sm">{t('nadiDoshaDesc')}</div>
              </motion.div>
            )}

            {/* Ashta Kuta Intro */}
            <InfoBlock
              id="matching-ashta-kuta"
              title={locale === 'en' ? 'What is Ashta Kuta (8-Fold Compatibility)?' : 'अष्ट कूट (8-गुण मिलान) क्या है?'}
              defaultOpen={true}
            >
              {locale === 'hi' ? (
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
                        {kuta.name[locale]}
                      </span>
                      <span className="text-text-secondary text-xs ml-3">{kuta.description[locale]}</span>
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
              const bNak = mode === 'birth' ? boyComputed?.nakshatra : boyNakshatra;
              const gNak = mode === 'birth' ? girlComputed?.nakshatra : girlNakshatra;
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
              const lk = locale === 'sa' ? 'hi' : locale;
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

            {/* Print / PDF button */}
            <div className="text-center mt-8">
              <PrintButton
                contentRef={matchResultRef}
                title={locale === 'en' ? 'Kundali Matching Results' : 'कुण्डली मिलान परिणाम'}
                label={locale === 'en' ? 'Print / PDF' : 'प्रिंट / PDF'}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
