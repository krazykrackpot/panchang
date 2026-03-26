'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { NakshatraIcon } from '@/components/icons/PanchangIcons';
import type { Locale } from '@/types/panchang';
import type { MatchResult } from '@/lib/matching/ashta-kuta';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';

export default function MatchingPage() {
  const t = useTranslations('matching');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [boyNakshatra, setBoyNakshatra] = useState(0);
  const [boyRashi, setBoyRashi] = useState(0);
  const [girlNakshatra, setGirlNakshatra] = useState(0);
  const [girlRashi, setGirlRashi] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleMatch = async () => {
    if (!boyNakshatra || !boyRashi || !girlNakshatra || !girlRashi) return;
    setLoading(true);
    try {
      const res = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boy: { moonNakshatra: boyNakshatra, moonRashi: boyRashi },
          girl: { moonNakshatra: girlNakshatra, moonRashi: girlRashi },
        }),
      });
      if (!res.ok) {
        setResult(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.error) {
        setResult(null);
        setLoading(false);
        return;
      }
      setResult(data);
    } catch {
      setResult(null);
    }
    setLoading(false);
  };

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

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Boy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-2xl p-6 border border-blue-500/20"
        >
          <h2 className="text-xl font-bold text-blue-400 mb-6 text-center" style={headingFont}>{t('groomDetails')}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{t('moonNakshatra')}</label>
              <select
                value={boyNakshatra}
                onChange={(e) => setBoyNakshatra(Number(e.target.value))}
                className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                <option value={0}>{t('selectNakshatra')}</option>
                {NAKSHATRAS.map((n) => (
                  <option key={n.id} value={n.id}>{n.name[locale]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{t('moonRashi')}</label>
              <select
                value={boyRashi}
                onChange={(e) => setBoyRashi(Number(e.target.value))}
                className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                <option value={0}>{t('selectRashi')}</option>
                {RASHIS.map((r) => (
                  <option key={r.id} value={r.id}>{r.name[locale]}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Girl */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-2xl p-6 border border-pink-500/20"
        >
          <h2 className="text-xl font-bold text-pink-400 mb-6 text-center" style={headingFont}>{t('brideDetails')}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{t('moonNakshatra')}</label>
              <select
                value={girlNakshatra}
                onChange={(e) => setGirlNakshatra(Number(e.target.value))}
                className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                <option value={0}>{t('selectNakshatra')}</option>
                {NAKSHATRAS.map((n) => (
                  <option key={n.id} value={n.id}>{n.name[locale]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{t('moonRashi')}</label>
              <select
                value={girlRashi}
                onChange={(e) => setGirlRashi(Number(e.target.value))}
                className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                <option value={0}>{t('selectRashi')}</option>
                {RASHIS.map((r) => (
                  <option key={r.id} value={r.id}>{r.name[locale]}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Match Button */}
      <div className="text-center mb-12">
        <button
          onClick={handleMatch}
          disabled={loading || !boyNakshatra || !boyRashi || !girlNakshatra || !girlRashi}
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
                className="glass-card rounded-xl p-5 border-2 border-red-500/30 bg-red-500/5 mb-8 text-center"
              >
                <div className="text-red-400 font-bold text-lg mb-1" style={headingFont}>{t('nadiDosha')}</div>
                <div className="text-text-secondary text-sm">{t('nadiDoshaDesc')}</div>
              </motion.div>
            )}

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
                  className="glass-card rounded-xl p-5"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
