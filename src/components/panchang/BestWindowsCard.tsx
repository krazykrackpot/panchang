'use client';

import { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Star, ChevronDown, Sparkles, Zap, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import type { PanchangData } from '@/types/panchang';
import type { TimeSlot, DayVerdict, VerdictRating } from '@/lib/muhurta/verdict-types';
import { computeDayVerdict } from '@/lib/muhurta/verdict-engine';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { nowMinutesInTimezone } from '@/lib/utils/now-in-timezone';

// ── Labels ──

const L = {
  en: {
    title: 'Best Windows Today',
    bestWindow: 'Best Window',
    dayYogas: 'Active Today',
    showAll: (n: number) => `Show all ${n} slots`,
    showLess: 'Show fewer',
    choghadiya: 'Choghadiya',
    overriddenBy: 'overridden by',
    noSlots: 'No verdict data available.',
    poisonedHoney: 'Even honey is useless if poisoned — an auspicious yoga during a hard dosha cannot purify the time.',
    poisonedHoneyHi: 'विषमिश्रित मधु भी व्यर्थ है — कठोर दोष के समय शुभ योग भी समय को शुद्ध नहीं कर सकता।',
    exceptionalWin: 'Abhijit Muhurta claims "sarva doshagnam" — destroyer of all doshas (Muhurta Chintamani). This is the ONE exception where an auspicious factor may override a block.',
    exceptionalWinHi: 'अभिजित मुहूर्त "सर्व दोषघ्नम्" — सभी दोषों का नाशक (मुहूर्त चिंतामणि)। यह एकमात्र अपवाद है जहाँ शुभ कारक दोष को रद्द कर सकता है।',
  },
  hi: {
    title: 'आज की सर्वश्रेष्ठ अवधियाँ',
    bestWindow: 'सर्वश्रेष्ठ अवधि',
    dayYogas: 'आज सक्रिय',
    showAll: (n: number) => `सभी ${n} स्लॉट दिखायें`,
    showLess: 'कम दिखायें',
    choghadiya: 'चौघड़िया',
    overriddenBy: 'द्वारा रद्द',
    noSlots: 'कोई निर्णय डेटा उपलब्ध नहीं।',
  },
} as const;

// ── Colours — BRIGHT, not muted ──

const VERDICT_BG: Record<VerdictRating, string> = {
  avoid: 'bg-red-600/40',
  caution: 'bg-amber-500/40',
  good: 'bg-emerald-500/30',
  very_good: 'bg-emerald-400/40',
  excellent: 'bg-gold-primary/45',
  exceptional: 'bg-gold-primary/60',
};

// Bar segment colours — SOLID hex, not Tailwind opacity (which gets absorbed by dark bg)
const BAR_HEX: Record<VerdictRating, string> = {
  avoid: '#7f1d1d',      // deep red — visible on #0a0e27
  caution: '#78350f',    // deep amber
  good: '#064e3b',       // deep emerald
  very_good: '#065f46',  // brighter emerald
  excellent: '#d4a853',  // ACTUAL gold-primary — matches Dekho Panchang logo
  exceptional: '#f0d48a', // gold-light — brightest
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
  avoid: 0, caution: 0, good: 1, very_good: 2, excellent: 3, exceptional: 3,
};

const VERDICT_LABEL: Record<VerdictRating, { en: string; hi: string }> = {
  avoid: { en: 'Avoid', hi: 'वर्जित' },
  caution: { en: 'Caution', hi: 'सावधान' },
  good: { en: 'Good', hi: 'शुभ' },
  very_good: { en: 'Very Good', hi: 'अति शुभ' },
  excellent: { en: 'Excellent', hi: 'उत्तम' },
  exceptional: { en: 'Exceptional', hi: 'सर्वश्रेष्ठ' },
};

// ── Time helpers ──

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

function fmtShort(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'p' : 'a';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')}${suffix}`;
}

// ── Props ──

interface BestWindowsCardProps {
  panchang: PanchangData;
  locale: string;
  timezone?: string;
}

// ── Component ──

export default function BestWindowsCard({ panchang, locale, timezone }: BestWindowsCardProps) {
  const isHi = isDevanagariLocale(locale);
  const labels = isHi ? { ...L.en, ...L.hi } : L.en;

  const verdict: DayVerdict = useMemo(() => computeDayVerdict(panchang), [panchang]);
  const { slots, bestWindow, dayLevelYogas } = verdict;

  const [showAll, setShowAll] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const slotListRef = useRef<HTMLDivElement>(null);

  // Full 24-hour timeline: midnight to midnight
  const timelineStart = 0;
  const timelineEnd = 1440;
  const timelineSpan = 1440;

  const sunriseMin = toMin(panchang.sunrise);
  const sunsetMin = toMin(panchang.sunset);
  const moonriseMin = panchang.moonrise ? toMin(panchang.moonrise) : null;
  const moonsetMin = panchang.moonset ? toMin(panchang.moonset) : null;

  // Key slots: best, worst, current — deduplicated
  const keySlots = useMemo(() => {
    const now = nowMinutesInTimezone(timezone);
    const currentSlot = slots.find(s => now >= toMin(s.start) && now < toMin(s.end));
    const worstSlot = slots.find(s => s.verdict === 'avoid');
    const seen = new Set<string>();
    const result: TimeSlot[] = [];
    for (const s of [bestWindow, worstSlot, currentSlot].filter(Boolean) as TimeSlot[]) {
      const key = `${s.start}-${s.end}`;
      if (!seen.has(key)) { seen.add(key); result.push(s); }
    }
    if (result.length < 4) {
      for (const s of slots) {
        if (result.length >= 4) break;
        const key = `${s.start}-${s.end}`;
        if (!seen.has(key) && s.verdict !== 'good') { seen.add(key); result.push(s); }
      }
    }
    return result;
  }, [slots, bestWindow, timezone]);

  const displayedSlots = showAll ? slots : keySlots;

  if (slots.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
        <p className="text-text-secondary text-sm text-center">{labels.noSlots}</p>
      </div>
    );
  }

  const nowMin = nowMinutesInTimezone(timezone);
  const nowPct = timelineSpan > 0 ? Math.max(0, Math.min(100, ((nowMin - timelineStart) / timelineSpan) * 100)) : 0;
  const nowInTimeline = nowMin >= timelineStart && nowMin <= timelineEnd;

  // Position helper for markers on the timeline bar
  const pctOf = (min: number) => timelineSpan > 0 ? ((min - timelineStart) / timelineSpan) * 100 : 0;

  function scrollToSlot(slot: TimeSlot) {
    const idx = slots.indexOf(slot);
    if (idx === -1) return;
    if (!showAll) setShowAll(true);
    setTimeout(() => {
      setExpandedIdx(idx);
      slotListRef.current?.querySelector(`[data-slot-idx="${idx}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  // Build a compact one-line summary for a slot
  function slotSummary(slot: TimeSlot): string {
    const parts: string[] = [];
    if (slot.hardBlocks.length > 0) {
      parts.push(slot.hardBlocks.map(b => isHi ? b.nameHi : b.name).join(', '));
    }
    if (slot.conditionalBlocks.length > 0) {
      parts.push(slot.conditionalBlocks.map(b => isHi ? b.nameHi : b.name).join(', '));
    }
    if (slot.positives.length > 0) {
      const posNames = slot.positives.map(p => isHi ? p.nameHi : p.name);
      if (slot.hardBlocks.length > 0) {
        parts.push(`(${posNames.join(', ')} ${isHi ? 'रद्द' : 'overridden'})`);
      } else {
        parts.push(posNames.join(' + '));
      }
    }
    return parts.join(' · ') || (isHi ? 'कोई विशेष कारक नहीं' : 'No significant factors');
  }

  // Does this slot have a "poisoned honey" situation? (positive present but blocked)
  const hasPoisonedHoney = (slot: TimeSlot) =>
    slot.hardBlocks.length > 0 && slot.positives.length > 0 && !slot.conflicts.length;

  // Does this slot have an Abhijit exception? (the one case where positive MAY win)
  const hasAbhijitException = (slot: TimeSlot) => slot.conflicts.length > 0;

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-gold-primary" />
        <h3 className="text-gold-light font-semibold text-base">{labels.title}</h3>
      </div>

      {/* ── Best Window Callout (if any good slot exists) ── */}
      {bestWindow && (
        <div className="border border-gold-primary/30 rounded-xl p-4 bg-gold-primary/[0.07] shadow-[0_0_24px_rgba(212,168,83,0.1)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-text-secondary text-xs uppercase tracking-wider">{labels.bestWindow}</span>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: STAR_COUNT[bestWindow.verdict] }, (_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-gold-primary fill-gold-primary" />
              ))}
              <span className={`text-xs font-bold ml-1.5 ${VERDICT_TEXT[bestWindow.verdict]}`}>
                {VERDICT_LABEL[bestWindow.verdict][isHi ? 'hi' : 'en']}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-light/70" />
            <span className="text-gold-light font-mono text-sm">{fmt12(bestWindow.start)} – {fmt12(bestWindow.end)}</span>
            <span className="text-emerald-400/80 text-xs ml-1">
              {bestWindow.positives.map(p => isHi ? p.nameHi : p.name).join(' + ')}
            </span>
          </div>
          {dayLevelYogas.length > 0 && (
            <p className="text-gold-primary/70 text-xs mt-1">
              ✦ {labels.dayYogas}: {dayLevelYogas.map(y => isHi ? y.nameHi : y.name).join(', ')}
            </p>
          )}
        </div>
      )}

      {/* ── 24-Hour Timeline Bar ── */}
      <div>
        {/* Hour markers */}
        <div className="flex items-center justify-between mb-1 px-0.5">
          {[0, 3, 6, 9, 12, 15, 18, 21].map(h => (
            <span key={h} className="text-text-secondary/50 text-[8px] font-mono" style={{ width: '12.5%', textAlign: h === 0 ? 'left' : h === 21 ? 'right' : 'center' }}>
              {h === 0 ? '12a' : h === 12 ? '12p' : h > 12 ? `${h - 12}p` : `${h}a`}
            </span>
          ))}
        </div>

        {/* The bar — tall, full-width, with icons inside */}
        <div className="relative h-14 sm:h-12 rounded-xl bg-[#0d1230] border border-white/[0.08]">
          {/* Slot segments */}
          {slots.map((slot, i) => {
            const startMin = toMin(slot.start);
            const endMin = toMin(slot.end);
            const leftPct = pctOf(startMin);
            const widthPct = pctOf(endMin) - leftPct;

            return (
              <button
                key={i}
                className="absolute top-0 bottom-0 hover:brightness-130 transition-all cursor-pointer"
                style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: BAR_HEX[slot.verdict] }}
                onClick={() => scrollToSlot(slot)}
                title={`${fmt12(slot.start)} – ${fmt12(slot.end)}: ${VERDICT_LABEL[slot.verdict].en}`}
                aria-label={`${VERDICT_LABEL[slot.verdict].en} from ${fmt12(slot.start)} to ${fmt12(slot.end)}`}
              />
            );
          })}

          {/* ── Event markers WITH icons inside the bar ── */}

          {/* Sunrise */}
          <div className="absolute top-0 bottom-0 flex items-end justify-center pointer-events-none z-10"
            style={{ left: `${pctOf(sunriseMin)}%`, transform: 'translateX(-50%)' }}>
            <div className="absolute top-0 bottom-0 w-px bg-amber-400/70" style={{ left: '50%' }} />
            <div className="flex flex-col items-center mb-0.5">
              <Sunrise className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" />
              <span className="text-[7px] text-amber-300 font-mono font-bold mt-px">{fmtShort(panchang.sunrise)}</span>
            </div>
          </div>

          {/* Sunset */}
          <div className="absolute top-0 bottom-0 flex items-end justify-center pointer-events-none z-10"
            style={{ left: `${pctOf(sunsetMin)}%`, transform: 'translateX(-50%)' }}>
            <div className="absolute top-0 bottom-0 w-px bg-orange-400/70" style={{ left: '50%' }} />
            <div className="flex flex-col items-center mb-0.5">
              <Sunset className="w-3.5 h-3.5 text-orange-400 drop-shadow-[0_0_4px_rgba(251,146,60,0.6)]" />
              <span className="text-[7px] text-orange-300 font-mono font-bold mt-px">{fmtShort(panchang.sunset)}</span>
            </div>
          </div>

          {/* Moonrise */}
          {moonriseMin !== null && (
            <div className="absolute top-0 bottom-0 flex items-start justify-center pointer-events-none z-10"
              style={{ left: `${pctOf(moonriseMin)}%`, transform: 'translateX(-50%)' }}>
              <div className="absolute top-0 bottom-0 w-px bg-blue-400/40" style={{ left: '50%' }} />
              <div className="flex flex-col items-center mt-0.5">
                <Moon className="w-3 h-3 text-blue-300 drop-shadow-[0_0_4px_rgba(147,197,253,0.5)]" />
                <span className="text-[7px] text-blue-300/70 font-mono mt-px">{fmtShort(panchang.moonrise)}</span>
              </div>
            </div>
          )}

          {/* Moonset */}
          {moonsetMin !== null && (
            <div className="absolute top-0 bottom-0 flex items-start justify-center pointer-events-none z-10"
              style={{ left: `${pctOf(moonsetMin)}%`, transform: 'translateX(-50%)' }}>
              <div className="absolute top-0 bottom-0 w-px bg-blue-400/20" style={{ left: '50%' }} />
              <div className="flex flex-col items-center mt-0.5">
                <Moon className="w-3 h-3 text-blue-400/40" />
                <span className="text-[7px] text-blue-300/40 font-mono mt-px">{fmtShort(panchang.moonset)}</span>
              </div>
            </div>
          )}

          {/* NOW marker */}
          {nowInTimeline && (
            <div className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{ left: `${nowPct}%`, transform: 'translateX(-50%)' }}>
              <div className="w-0.5 h-full bg-gold-primary shadow-[0_0_10px_rgba(212,168,83,0.8)]" />
              <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-[7px] font-black text-[#0a0e27] bg-gold-primary px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(212,168,83,0.5)]">
                NOW
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-2.5 flex-wrap">
          {(['avoid', 'caution', 'good', 'excellent'] as VerdictRating[]).map(r => (
            <span key={r} className="flex items-center gap-1 text-[10px] text-text-secondary">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: BAR_HEX[r] }} />
              {VERDICT_LABEL[r][isHi ? 'hi' : 'en']}
            </span>
          ))}
        </div>
      </div>

      {/* ── Slot List — compact 1-2 line cards ── */}
      <div ref={slotListRef} className="space-y-1.5">
        {displayedSlots.map((slot) => {
          const idx = slots.indexOf(slot);
          const isExpanded = expandedIdx === idx;
          const isCurrent = nowMin >= toMin(slot.start) && nowMin < toMin(slot.end);
          const summary = slotSummary(slot);

          return (
            <div
              key={`${slot.start}-${slot.end}`}
              data-slot-idx={idx}
              className={`rounded-lg border transition-all ${VERDICT_BORDER[slot.verdict]} bg-white/[0.02] ${
                isCurrent ? 'ring-1 ring-gold-primary/40' : ''
              }`}
            >
              {/* Slot row — compact: badge | time | summary | NOW | chevron */}
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer"
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                aria-expanded={isExpanded}
              >
                {/* Verdict badge — compact pill */}
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${VERDICT_BG[slot.verdict]} ${VERDICT_TEXT[slot.verdict]}`}>
                  {VERDICT_LABEL[slot.verdict][isHi ? 'hi' : 'en']}
                </span>

                {/* Time range */}
                <span className="text-text-primary text-[11px] font-mono shrink-0 w-[115px]">
                  {fmt12(slot.start)} – {fmt12(slot.end)}
                </span>

                {/* Summary — fills remaining space */}
                <span className="text-text-secondary text-[10px] truncate flex-1 min-w-0">
                  {summary}
                </span>

                {/* NOW badge */}
                {isCurrent && (
                  <span className="text-[8px] font-bold bg-gold-primary/25 text-gold-light px-1.5 py-0.5 rounded-full shrink-0">
                    NOW
                  </span>
                )}

                <ChevronDown className={`w-3.5 h-3.5 text-text-secondary shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
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
                      {/* Factors — compact rows */}
                      {slot.hardBlocks.map(b => (
                        <div key={b.id} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                          <span className="text-red-400 text-xs font-medium">{isHi ? b.nameHi : b.name}</span>
                          <span className="text-red-400/50 text-[10px]">— {isHi ? b.effectHi : b.effect}</span>
                        </div>
                      ))}
                      {slot.conditionalBlocks.map(b => (
                        <div key={b.id} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-amber-400 text-xs font-medium">{isHi ? b.nameHi : b.name}</span>
                          <span className="text-amber-400/50 text-[10px]">— {isHi ? b.effectHi : b.effect}</span>
                        </div>
                      ))}
                      {slot.positives.map(p => (
                        <div key={p.id} className="flex items-start gap-1.5">
                          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-emerald-400 text-xs font-medium">{isHi ? p.nameHi : p.name}</span>
                          {slot.hardBlocks.length > 0 && (
                            <span className="text-red-400/40 text-[10px]">({isHi ? 'रद्द' : 'overridden'})</span>
                          )}
                        </div>
                      ))}

                      {/* Poisoned honey rule — when positive is present but blocked */}
                      {hasPoisonedHoney(slot) && (
                        <div className="flex items-start gap-1.5 bg-red-500/[0.06] rounded-lg px-2 py-1.5 mt-1">
                          <span className="text-red-400/70 text-[10px] leading-snug">
                            ⚗ {isHi ? L.en.poisonedHoneyHi : L.en.poisonedHoney}
                          </span>
                        </div>
                      )}

                      {/* Abhijit exception — when positive MAY override */}
                      {hasAbhijitException(slot) && (
                        <div className="space-y-1 mt-1">
                          {slot.conflicts.map((c, ci) => (
                            <div key={ci} className="flex items-start gap-1.5 bg-amber-500/[0.06] rounded-lg px-2 py-1.5">
                              <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                              <span className="text-amber-300/80 text-[10px] leading-snug">
                                {isHi ? c.explanationHi : c.explanation}
                              </span>
                            </div>
                          ))}
                          <p className="text-amber-400/50 text-[9px] italic px-2">
                            {isHi ? L.en.exceptionalWinHi : L.en.exceptionalWin}
                          </p>
                        </div>
                      )}

                      {/* Choghadiya (separate indicator) */}
                      {slot.choghadiya && (
                        <p className="text-text-secondary/50 text-[10px]">
                          {labels.choghadiya}: {isHi ? slot.choghadiya.nameHi : slot.choghadiya.name}
                          {slot.hardBlocks.length > 0 && slot.choghadiya.nature === 'auspicious' && (
                            <span className="text-amber-400/40"> ({labels.overriddenBy} {isHi ? slot.hardBlocks[0].nameHi : slot.hardBlocks[0].name})</span>
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
            {showAll ? `${labels.showLess} \u25B2` : `${labels.showAll(slots.length)} \u25BC`}
          </button>
        </div>
      )}
    </div>
  );
}
