'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MuhurtaInfo } from '@/lib/constants/muhurtas';
import type { Locale } from '@/types/panchang';
import { ChevronDown } from 'lucide-react';

interface MuhurtaCardProps {
  muhurta: MuhurtaInfo;
  locale: Locale;
}

export default function MuhurtaCard({ muhurta, locale }: MuhurtaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const m = muhurta;

  const natureBadge = m.nature === 'auspicious'
    ? { text: locale === 'en' || String(locale) === 'ta' ? 'Auspicious' : 'शुभ', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
    : m.nature === 'inauspicious'
    ? { text: locale === 'en' || String(locale) === 'ta' ? 'Inauspicious' : 'अशुभ', color: 'bg-red-500/15 text-red-400 border-red-500/30' }
    : { text: locale === 'en' || String(locale) === 'ta' ? 'Neutral' : 'सम', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };

  const isAbhijit = m.number === 8;
  const isBrahma = m.number === 26 || m.number === 27;
  const isDay = m.period === 'day';

  return (
    <motion.div
      layout
      className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl border overflow-hidden ${
        isAbhijit ? 'border-gold-primary/40 ring-1 ring-gold-primary/20' :
        isBrahma ? 'border-indigo-400/30 ring-1 ring-indigo-400/15' :
        'border-gold-primary/10'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-center gap-3 hover:bg-gold-primary/5 transition-colors"
      >
        <span className={`text-xl font-bold w-8 text-center ${isDay ? 'text-gold-primary' : 'text-indigo-300/80'}`}>
          {m.number}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gold-light font-semibold">{m.name[locale]}</span>
            {locale !== 'en' && <span className="text-text-secondary/70 text-xs">({m.name.en})</span>}
            {isAbhijit && <span className="text-xs px-1.5 py-0.5 rounded bg-gold-primary/20 text-gold-primary font-bold">ABHIJIT</span>}
            {isBrahma && <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">{locale === 'en' || String(locale) === 'ta' ? 'BRAHMA' : 'ब्राह्म'}</span>}
          </div>
          <div className="text-text-secondary/75 text-xs">{m.deity[locale]}</div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${natureBadge.color}`}>
          {natureBadge.text}
        </span>
        <ChevronDown className={`w-4 h-4 text-text-secondary/70 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 ml-11 space-y-3 border-t border-gold-primary/5">
              <div className="pt-3">
                <h4 className="text-xs font-semibold text-gold-primary/70 uppercase tracking-wider mb-1">
                  {locale === 'en' || String(locale) === 'ta' ? 'Significance' : 'महत्त्व'}
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed">{m.significance[locale]}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gold-primary/70 uppercase tracking-wider mb-1">
                  {locale === 'en' || String(locale) === 'ta' ? 'Best Activities' : 'सर्वोत्तम कार्य'}
                </h4>
                <p className="text-text-secondary text-sm">{m.bestFor[locale]}</p>
              </div>

              <div className="flex gap-3 text-xs">
                <span className={`px-2 py-1 rounded border ${isDay ? 'border-gold-primary/20 text-gold-light' : 'border-indigo-400/20 text-indigo-300'}`}>
                  {isDay ? (locale === 'en' || String(locale) === 'ta' ? '☀ Daytime' : '☀ दिवा') : (locale === 'en' || String(locale) === 'ta' ? '🌙 Nighttime' : '🌙 रात्रि')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
