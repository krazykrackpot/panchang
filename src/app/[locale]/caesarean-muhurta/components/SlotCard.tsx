'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check, X, Clock, Star } from 'lucide-react';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/types/panchang';
import type { ScoredBirthSlot, SlotGrade } from '@/lib/caesarean/types';
import MSG from '@/messages/pages/caesarean-muhurta.json';

const msg = (key: string, locale: string) =>
  lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

/** Colour config per grade */
const GRADE_STYLES: Record<SlotGrade, { bg: string; text: string; border: string; label: string }> = {
  excellent: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'gradeExcellent' },
  good:      { bg: 'bg-green-500/15',   text: 'text-green-400',   border: 'border-green-500/30',   label: 'gradeGood' },
  fair:      { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30',   label: 'gradeFair' },
  marginal:  { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-500/30',  label: 'gradeMarginal' },
  poor:      { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30',     label: 'gradePoor' },
  vetoed:    { bg: 'bg-red-500/20',     text: 'text-red-400',     border: 'border-red-500/40',     label: 'gradeVetoed' },
};

/** Pillar colours for the breakdown bar */
const PILLAR_COLOURS: Record<string, string> = {
  lagna: 'bg-amber-400',
  moon: 'bg-blue-400',
  distribution: 'bg-purple-400',
  dasha: 'bg-emerald-400',
  defects: 'bg-rose-400',
};

const PILLAR_MAX: Record<string, number> = {
  lagna: 30,
  moon: 25,
  distribution: 20,
  dasha: 15,
  defects: 10,
};

const PILLAR_KEYS = ['lagna', 'moon', 'distribution', 'dasha', 'defects'] as const;

interface SlotCardProps {
  slot: ScoredBirthSlot;
  rank: number;
}

export default function SlotCard({ slot, rank }: SlotCardProps) {
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const style = GRADE_STYLES[slot.grade];

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });
  };

  return (
    <div
      className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden transition-all hover:border-gold-primary/40 ${
        slot.isVetoed ? 'opacity-60' : ''
      }`}
    >
      {/* Header row */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Rank badge */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center">
            <span className="text-gold-light font-bold text-sm">#{rank}</span>
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {/* Date + time */}
              <span className="text-gold-light font-semibold text-sm">
                {formatDate(slot.date)}
              </span>
              <span className="text-text-primary text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-text-secondary" />
                {slot.time} &ndash; {slot.endTime}
              </span>
            </div>

            {/* Lagna + Moon Nakshatra */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary mt-1">
              <span>
                {msg('lagnaLabel', locale)}: <span className="text-text-primary">{lt(slot.lagnaSignName, locale)}</span>
              </span>
              <span>
                {msg('moonNakshatraLabel', locale)}: <span className="text-text-primary">{lt(slot.moonNakshatraName, locale)}</span>
              </span>
              <span>
                {msg('dashaLabel', locale)}: <span className="text-text-primary">
                  {slot.dashaInfo.lord} ({slot.dashaInfo.remainingYears.toFixed(1)} {msg('years', locale)} {msg('dashaRemaining', locale)})
                </span>
              </span>
            </div>
          </div>

          {/* Score badge */}
          <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${style.bg} ${style.border} border`}>
            <div className={`text-lg font-bold ${style.text} ${slot.isVetoed ? 'line-through' : ''}`}>
              {slot.score}
            </div>
            <div className={`text-[10px] font-medium ${style.text} text-center`}>
              {msg(style.label, locale)}
            </div>
          </div>
        </div>

        {/* 5-pillar horizontal bar */}
        <div className="mt-3">
          <div className="flex h-2.5 rounded-full overflow-hidden bg-[#0a0e27]/60 border border-gold-primary/8">
            {PILLAR_KEYS.map((key) => {
              const value = slot.pillarBreakdown[key];
              const max = PILLAR_MAX[key];
              const pct = (value / 100) * 100; // proportion of total 100
              return (
                <div
                  key={key}
                  className={`${PILLAR_COLOURS[key]} transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${msg(`pillar${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof MSG, locale)}: ${value}/${max}`}
                />
              );
            })}
          </div>
          {/* Pillar legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
            {PILLAR_KEYS.map((key) => {
              const value = slot.pillarBreakdown[key];
              const max = PILLAR_MAX[key];
              const msgKey = `pillar${key.charAt(0).toUpperCase() + key.slice(1)}`;
              return (
                <span key={key} className="flex items-center gap-1 text-[10px] text-text-secondary">
                  <span className={`w-2 h-2 rounded-sm ${PILLAR_COLOURS[key]}`} />
                  {msg(msgKey, locale)} {value}/{max}
                </span>
              );
            })}
          </div>
        </div>

        {/* Expand/collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs text-gold-primary hover:text-gold-light transition-colors"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
          {expanded ? msg('hideDetails', locale) : msg('showDetails', locale)}
        </button>
      </div>

      {/* Expandable details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' as const }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 border-t border-gold-primary/8 pt-4">
              {/* Strengths */}
              {slot.strengths.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />
                    {msg('strengths', locale)}
                  </h4>
                  <ul className="space-y-1">
                    {slot.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>
                          {lt(s.label, locale)}{' '}
                          <span className="text-emerald-400/70">(+{s.points})</span>
                          <span className="text-text-secondary/50 ml-1">{s.source}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Defects */}
              {slot.defects.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-red-400 mb-1.5 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    {msg('defectsLabel', locale)}
                  </h4>
                  <ul className="space-y-1">
                    {slot.defects.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>
                          {lt(d.label, locale)}{' '}
                          <span className="text-red-400/70">(-{d.deduction})</span>
                          {d.isVeto && <span className="text-red-400 font-semibold ml-1">VETO</span>}
                          <span className="text-text-secondary/50 ml-1">{d.source}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Panchang snapshot */}
              <div>
                <h4 className="text-xs font-semibold text-gold-light mb-1.5">
                  {msg('panchangLabel', locale)}
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-secondary">
                  <span>Tithi: <span className="text-text-primary">{lt(slot.panchang.tithi, locale)}</span></span>
                  <span>Nakshatra: <span className="text-text-primary">{lt(slot.panchang.nakshatra, locale)}</span></span>
                  <span>Yoga: <span className="text-text-primary">{lt(slot.panchang.yoga, locale)}</span></span>
                  <span>Karana: <span className="text-text-primary">{lt(slot.panchang.karana, locale)}</span></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
