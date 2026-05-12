'use client';

import { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Star, ChevronDown, Sparkles, Zap } from 'lucide-react';
import type { PanchangData } from '@/types/panchang';
import type { TimeSlot, DayVerdict, VerdictRating } from '@/lib/muhurta/verdict-types';
import { computeDayVerdict } from '@/lib/muhurta/verdict-engine';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ── Labels ──

const LABELS = {
  en: {
    title: 'Best Windows Today',
    bestWindow: 'Best Window',
    activeFactors: 'Active Factors',
    dayYogas: 'Active Today',
    showAll: (n: number) => `Show all ${n} slots`,
    showLess: 'Show fewer',
    choghadiya: 'Choghadiya',
    overriddenBy: 'overridden by',
    noSlots: 'No verdict data available.',
    conflicts: 'Conflicts',
  },
  hi: {
    title: 'आज की सर्वश्रेष्ठ अवधियाँ',
    bestWindow: 'सर्वश्रेष्ठ अवधि',
    activeFactors: 'सक्रिय कारक',
    dayYogas: 'आज सक्रिय',
    showAll: (n: number) => `सभी ${n} स्लॉट दिखायें`,
    showLess: 'कम दिखायें',
    choghadiya: 'चौघड़िया',
    overriddenBy: 'द्वारा रद्द',
    noSlots: 'कोई निर्णय डेटा उपलब्ध नहीं।',
    conflicts: 'संघर्ष',
  },
} as const;

// ── Colour map ──

const VERDICT_COLOURS: Record<VerdictRating, string> = {
  avoid: 'bg-red-500/30',
  caution: 'bg-amber-500/30',
  good: 'bg-emerald-500/15',
  very_good: 'bg-emerald-500/25',
  excellent: 'bg-gold-primary/30',
  exceptional: 'bg-gold-primary/45',
};

const VERDICT_TEXT: Record<VerdictRating, string> = {
  avoid: 'text-red-400',
  caution: 'text-amber-400',
  good: 'text-emerald-400',
  very_good: 'text-emerald-300',
  excellent: 'text-gold-light',
  exceptional: 'text-gold-light',
};

const VERDICT_BORDER: Record<VerdictRating, string> = {
  avoid: 'border-red-500/40',
  caution: 'border-amber-500/40',
  good: 'border-emerald-500/30',
  very_good: 'border-emerald-500/40',
  excellent: 'border-gold-primary/40',
  exceptional: 'border-gold-primary/60',
};

const STAR_COUNT: Record<VerdictRating, number> = {
  avoid: 0,
  caution: 0,
  good: 1,
  very_good: 2,
  excellent: 3,
  exceptional: 3,
};

// ── Time helpers ──

function currentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function parseTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function formatTime12h(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

// ── Props ──

interface BestWindowsCardProps {
  panchang: PanchangData;
  locale: string;
}

// ── Component ──

export default function BestWindowsCard({ panchang, locale }: BestWindowsCardProps) {
  const isHi = isDevanagariLocale(locale);
  const l = isHi ? LABELS.hi : LABELS.en;

  const verdict: DayVerdict = useMemo(() => computeDayVerdict(panchang), [panchang]);
  const { slots, bestWindow, dayLevelYogas } = verdict;

  const [showAll, setShowAll] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const slotListRef = useRef<HTMLDivElement>(null);

  const sunriseMin = parseTimeToMinutes(panchang.sunrise);
  const sunsetMin = parseTimeToMinutes(panchang.sunset);
  const daySpan = sunsetMin - sunriseMin;

  // Key slots: best, worst, current — deduplicated
  const keySlots = useMemo(() => {
    const now = currentMinutes();
    const currentSlot = slots.find(
      s => now >= parseTimeToMinutes(s.start) && now < parseTimeToMinutes(s.end)
    );
    const worstSlot = slots.find(s => s.verdict === 'avoid');

    const seen = new Set<string>();
    const result: TimeSlot[] = [];
    for (const s of [bestWindow, worstSlot, currentSlot].filter(Boolean) as TimeSlot[]) {
      const key = `${s.start}-${s.end}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(s);
      }
    }
    // Fill to at least 4 if we have slots
    if (result.length < 4) {
      for (const s of slots) {
        if (result.length >= 4) break;
        const key = `${s.start}-${s.end}`;
        if (!seen.has(key) && s.verdict !== 'good') {
          seen.add(key);
          result.push(s);
        }
      }
    }
    return result;
  }, [slots, bestWindow]);

  const displayedSlots = showAll ? slots : keySlots;

  if (slots.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
        <p className="text-text-secondary text-sm text-center">{l.noSlots}</p>
      </div>
    );
  }

  const nowMin = currentMinutes();
  const nowPct = daySpan > 0 ? Math.max(0, Math.min(100, ((nowMin - sunriseMin) / daySpan) * 100)) : 0;
  const nowInDay = nowMin >= sunriseMin && nowMin <= sunsetMin;

  function scrollToSlot(slot: TimeSlot) {
    const idx = slots.indexOf(slot);
    if (idx === -1) return;
    if (!showAll) setShowAll(true);
    // Wait for render, then expand
    setTimeout(() => {
      setExpandedIdx(idx);
      slotListRef.current?.querySelector(`[data-slot-idx="${idx}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 50);
  }

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-gold-primary" />
        <h3 className="text-gold-light font-semibold text-base">{l.title}</h3>
      </div>

      {/* ── Section 1: Best Window Callout ── */}
      {bestWindow && (
        <div className="border border-gold-primary/30 rounded-xl p-4 bg-gold-primary/[0.06] shadow-[0_0_20px_rgba(212,168,83,0.08)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-xs uppercase tracking-wider">{l.bestWindow}</span>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: STAR_COUNT[bestWindow.verdict] }, (_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-gold-primary fill-gold-primary" />
              ))}
              <span className={`text-xs font-semibold ml-1.5 ${VERDICT_TEXT[bestWindow.verdict]}`}>
                {isHi ? bestWindow.labelHi : bestWindow.label}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gold-light/70" />
            <span className="text-gold-light font-mono text-sm">
              {formatTime12h(bestWindow.start)} – {formatTime12h(bestWindow.end)}
            </span>
          </div>

          {/* Active positives */}
          {bestWindow.positives.length > 0 && (
            <p className="text-emerald-400/80 text-xs">
              {bestWindow.positives.map(p => isHi ? p.nameHi : p.name).join(' + ')}
            </p>
          )}

          {/* Day-level yogas */}
          {dayLevelYogas.length > 0 && (
            <p className="text-gold-primary/70 text-xs mt-1.5">
              ✦ {l.dayYogas}: {dayLevelYogas.map(y => isHi ? y.nameHi : y.name).join(', ')}
            </p>
          )}
        </div>
      )}

      {/* ── Section 2: Verdict Bar ── */}
      <div>
        {/* Sunrise / Sunset labels */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-text-secondary text-[10px] font-mono">{formatTime12h(panchang.sunrise)}</span>
          <span className="text-text-secondary text-[10px] font-mono">{formatTime12h(panchang.sunset)}</span>
        </div>

        {/* Bar */}
        <div className="relative h-5 sm:h-5 rounded-full overflow-hidden flex bg-white/[0.04]"
          style={{ touchAction: 'pan-y' }}
        >
          {slots.map((slot, i) => {
            const startMin = parseTimeToMinutes(slot.start);
            const endMin = parseTimeToMinutes(slot.end);
            const widthPct = daySpan > 0 ? ((endMin - startMin) / daySpan) * 100 : 0;

            return (
              <button
                key={i}
                className={`${VERDICT_COLOURS[slot.verdict]} h-full transition-opacity hover:opacity-80 cursor-pointer border-r border-white/[0.04] last:border-r-0`}
                style={{ width: `${widthPct}%` }}
                onClick={() => scrollToSlot(slot)}
                title={`${formatTime12h(slot.start)} – ${formatTime12h(slot.end)}: ${slot.label}`}
                aria-label={`${slot.label} slot from ${formatTime12h(slot.start)} to ${formatTime12h(slot.end)}`}
              />
            );
          })}

          {/* NOW marker */}
          {nowInDay && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-gold-primary shadow-[0_0_6px_rgba(212,168,83,0.6)] z-10 pointer-events-none"
              style={{ left: `${nowPct}%` }}
            >
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gold-light bg-gold-primary/20 px-1 rounded">
                NOW
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {(['avoid', 'caution', 'good', 'excellent'] as VerdictRating[]).map(r => (
            <span key={r} className="flex items-center gap-1 text-[10px] text-text-secondary">
              <span className={`inline-block w-2 h-2 rounded-sm ${VERDICT_COLOURS[r]}`} />
              {r === 'avoid' ? (isHi ? 'वर्जित' : 'Avoid') :
               r === 'caution' ? (isHi ? 'सावधान' : 'Caution') :
               r === 'good' ? (isHi ? 'शुभ' : 'Good') :
               (isHi ? 'उत्तम' : 'Excellent')}
            </span>
          ))}
        </div>
      </div>

      {/* ── Section 3: Slot List ── */}
      <div ref={slotListRef} className="space-y-2">
        {displayedSlots.map((slot) => {
          const idx = slots.indexOf(slot);
          const isExpanded = expandedIdx === idx;
          const isCurrent = nowMin >= parseTimeToMinutes(slot.start) && nowMin < parseTimeToMinutes(slot.end);

          return (
            <div
              key={`${slot.start}-${slot.end}`}
              data-slot-idx={idx}
              className={`rounded-xl border transition-all ${VERDICT_BORDER[slot.verdict]} bg-white/[0.02] ${
                isCurrent ? 'ring-1 ring-gold-primary/40' : ''
              }`}
            >
              {/* Slot header — always visible */}
              <button
                className="w-full flex items-center gap-3 p-3 text-left cursor-pointer"
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                aria-expanded={isExpanded}
              >
                {/* Verdict badge */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${VERDICT_COLOURS[slot.verdict]} ${VERDICT_TEXT[slot.verdict]}`}>
                  {isHi ? slot.labelHi : slot.label}
                </span>

                {/* Time range */}
                <span className="text-text-primary text-xs font-mono flex-1">
                  {formatTime12h(slot.start)} – {formatTime12h(slot.end)}
                </span>

                {/* NOW badge */}
                {isCurrent && (
                  <span className="text-[9px] font-semibold bg-gold-primary/20 text-gold-light px-1.5 py-0.5 rounded-full">
                    NOW
                  </span>
                )}

                {/* Chevron */}
                <ChevronDown
                  className={`w-4 h-4 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' as const }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-2 border-t border-white/[0.06] pt-2">
                      {/* Hard blocks (red) */}
                      {slot.hardBlocks.length > 0 && (
                        <div className="space-y-1">
                          {slot.hardBlocks.map(b => (
                            <div key={b.id} className="flex items-center gap-1.5">
                              <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                              <span className="text-red-400 text-xs">{isHi ? b.nameHi : b.name}</span>
                              <span className="text-red-400/50 text-[10px]">— {isHi ? b.effectHi : b.effect}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Conditional blocks (amber) */}
                      {slot.conditionalBlocks.length > 0 && (
                        <div className="space-y-1">
                          {slot.conditionalBlocks.map(b => (
                            <div key={b.id} className="flex items-center gap-1.5">
                              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="text-amber-400 text-xs">{isHi ? b.nameHi : b.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Positives (green) */}
                      {slot.positives.length > 0 && (
                        <div className="space-y-1">
                          {slot.positives.map(p => (
                            <div key={p.id} className="flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="text-emerald-400 text-xs">{isHi ? p.nameHi : p.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Conflicts */}
                      {slot.conflicts.length > 0 && (
                        <div className="space-y-1 mt-1">
                          {slot.conflicts.map((c, ci) => (
                            <div key={ci} className="flex items-start gap-1.5 bg-amber-500/[0.06] rounded-lg px-2 py-1.5">
                              <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                              <span className="text-amber-300/80 text-[11px] leading-snug">
                                {isHi ? c.explanationHi : c.explanation}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Explanation */}
                      <p className="text-text-secondary text-[11px] leading-relaxed">
                        {isHi ? slot.explanationHi : slot.explanation}
                      </p>

                      {/* Choghadiya */}
                      {slot.choghadiya && (
                        <p className="text-text-secondary/60 text-[10px]">
                          {l.choghadiya}: {isHi ? slot.choghadiya.nameHi : slot.choghadiya.name}
                          {slot.hardBlocks.length > 0 && slot.choghadiya.nature === 'auspicious' && (
                            <span className="text-amber-400/60">
                              {' '}({l.overriddenBy} {isHi ? slot.hardBlocks[0].nameHi : slot.hardBlocks[0].name})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Show all toggle */}
      {slots.length > keySlots.length && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="text-gold-light/60 text-xs cursor-pointer hover:text-gold-light transition-colors"
          >
            {showAll ? `${l.showLess} \u25B2` : `${l.showAll(slots.length)} \u25BC`}
          </button>
        </div>
      )}
    </div>
  );
}
