'use client';

import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { DaySummary } from '@/types/muhurta-ai';
import { ShuddhiDots } from './CalendarGrid';

interface NextBestCardProps {
  day: DaySummary;
  activityLabel: string;
  onSelect: () => void;
  locale: string;
}

const QUALITY_BADGE: Record<DaySummary['quality'], string> = {
  excellent: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  good: 'bg-gold-primary/20 text-gold-light border border-gold-primary/30',
  fair: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  poor: 'bg-text-secondary/20 text-text-secondary border border-text-secondary/30',
};

const QUALITY_LABEL: Record<DaySummary['quality'], { en: string; hi: string }> = {
  excellent: { en: 'Excellent', hi: 'उत्तम' },
  good: { en: 'Good', hi: 'शुभ' },
  fair: { en: 'Fair', hi: 'साधारण' },
  poor: { en: 'Poor', hi: 'अशुभ' },
};

export default function NextBestCard({
  day,
  activityLabel,
  onSelect,
  locale,
}: NextBestCardProps) {
  const isHi = locale === 'hi';

  const dateDisplay = new Date(day.date + 'T00:00:00').toLocaleDateString(
    isHi ? 'hi-IN' : 'en-GB',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  );

  const goodFactorCount = day.factors
    ? day.factors.filter((f) => f.verdict === 'good').length
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
      className="rounded-2xl border border-gold-primary/30 bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] p-6 sm:p-8 shadow-[0_0_40px_rgba(212,168,83,0.08)] hover:border-gold-primary/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-gold-primary flex-shrink-0 mt-0.5" />
        <h2 className="text-sm font-bold text-gold-primary uppercase tracking-[2px]">
          {isHi
            ? `${activityLabel} के लिए अगली शुभ तिथि`
            : `Next Auspicious Date for ${activityLabel}`}
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1">
          {/* Date */}
          <h3 className="text-3xl sm:text-4xl font-bold text-gold-light mb-2">
            {dateDisplay}
          </h3>

          {/* Best window time range */}
          {day.bestWindow && (
            <p className="text-text-secondary text-base sm:text-lg mb-3">
              <span className="text-gold-dark">
                {isHi ? 'सर्वोत्तम समय' : 'Best window'}:
              </span>{' '}
              <span className="text-text-primary font-medium">
                {day.bestWindow.startTime} -- {day.bestWindow.endTime}
              </span>
            </p>
          )}

          {/* Score badge + Shuddhi dots */}
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={`text-sm px-3 py-1 rounded-full font-bold ${QUALITY_BADGE[day.quality]}`}
            >
              {isHi ? QUALITY_LABEL[day.quality].hi : QUALITY_LABEL[day.quality].en} -- {day.bestScore}/100
            </span>

            {day.factors && day.factors.length > 0 && (
              <span className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="text-gold-dark">
                  {isHi ? 'पंचांग शुद्धि' : 'Panchanga Shuddhi'}:
                </span>
                <ShuddhiDots filled={goodFactorCount} />
              </span>
            )}
          </div>

          {/* Tithi & Nakshatra */}
          {(day.tithi || day.nakshatra) && (
            <div className="flex flex-wrap gap-3 mt-3">
              {day.tithi && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/15">
                  {day.tithi}
                </span>
              )}
              {day.nakshatra && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/15">
                  {day.nakshatra}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={onSelect}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-primary hover:text-gold-light transition-colors cursor-pointer"
      >
        {isHi ? 'विवरण देखें' : 'View details'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
