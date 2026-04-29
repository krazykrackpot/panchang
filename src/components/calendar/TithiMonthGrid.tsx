'use client';

import { useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import type { LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TithiDayData {
  date: string;         // YYYY-MM-DD
  day: number;          // 1-31
  tithiNumber: number;  // 1-30
  tithiName: LocaleText;
  paksha: 'shukla' | 'krishna';
  masa?: { amanta: string; purnimanta: string; isAdhika: boolean };
  festivals: { name: LocaleText; type: string; slug?: string }[];
  isToday: boolean;
  nakshatra?: LocaleText;
  moonRashi?: LocaleText;
  yoga?: LocaleText;
  sunrise?: string;
  sunset?: string;
}

interface TithiMonthGridProps {
  year: number;
  month: number;     // 1-12
  days: TithiDayData[];
  locale: string;
  onDayClick?: (date: string) => void;
}

// ---------------------------------------------------------------------------
// Moon phase SVG — accurate crescent/gibbous based on tithi number
// ---------------------------------------------------------------------------

function MoonIcon({ tithiNumber, paksha, size = 28 }: { tithiNumber: number; paksha: 'shukla' | 'krishna'; size?: number }) {
  const uid = `m${tithiNumber}${paksha[0]}`;

  // Purnima — glowing full moon
  if (tithiNumber === 15) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <defs>
          <radialGradient id={`${uid}-g`} cx="38%" cy="38%">
            <stop offset="0%" stopColor="#fff8e1" />
            <stop offset="60%" stopColor="#f0d48a" />
            <stop offset="100%" stopColor="#d4a853" />
          </radialGradient>
          <filter id={`${uid}-glow`}>
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx="12" cy="12" r="10" fill={`url(#${uid}-g)`} filter={`url(#${uid}-glow)`} />
      </svg>
    );
  }

  // Amavasya — dark with faint ring
  if (tithiNumber === 30 || tithiNumber === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#0d0820" />
        <circle cx="12" cy="12" r="10" fill="none" stroke="#6b5b8d" strokeWidth="1" opacity="0.4" />
        <circle cx="12" cy="12" r="8" fill="none" stroke="#4a3f6b" strokeWidth="0.5" strokeDasharray="1.5 2" opacity="0.3" />
      </svg>
    );
  }

  // Crescent → gibbous phases
  const tithiInPaksha = paksha === 'shukla' ? tithiNumber : tithiNumber - 15;
  const fraction = tithiInPaksha / 15; // 0→1
  const isWaxing = paksha === 'shukla';

  // Compute terminator x position for ellipse-based rendering
  const terminatorX = 12 + (fraction * 2 - 1) * 10;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <clipPath id={`${uid}-c`}><circle cx="12" cy="12" r="10" /></clipPath>
        <linearGradient id={`${uid}-lit`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="#0d0820" />
      <g clipPath={`url(#${uid}-c)`}>
        {isWaxing ? (
          <ellipse cx={terminatorX} cy="12" rx={Math.max(Math.abs(fraction * 2 - 1) * 10, 0.5)} ry="10" fill={`url(#${uid}-lit)`} />
        ) : (
          <ellipse cx={24 - terminatorX} cy="12" rx={Math.max(Math.abs(fraction * 2 - 1) * 10, 0.5)} ry="10" fill={`url(#${uid}-lit)`} />
        )}
      </g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="#8a6d2b" strokeWidth="0.4" opacity="0.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Day names
// ---------------------------------------------------------------------------

const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

// ---------------------------------------------------------------------------
// Special tithi detection helpers
// ---------------------------------------------------------------------------

function isEkadashi(n: number) { return n === 11 || n === 26; }
function isPurnima(n: number) { return n === 15; }
function isAmavasya(n: number) { return n === 30; }
function isChaturthi(n: number) { return n === 4 || n === 19; }
function isAshtami(n: number) { return n === 8 || n === 23; }
function isNavami(n: number) { return n === 9 || n === 24; }

/** Get the background/border classes for a cell based on tithi significance */
function getCellStyle(cell: TithiDayData): { bg: string; border: string; tithiColor: string } {
  const n = cell.tithiNumber;
  const hasMajorFestival = cell.festivals.some(f => f.type === 'major');

  if (isPurnima(n)) return {
    bg: 'bg-gradient-to-br from-amber-500/12 via-amber-400/6 to-[#0a0e27]',
    border: 'border-amber-400/30',
    tithiColor: 'text-amber-300 font-bold',
  };
  if (isAmavasya(n)) return {
    bg: 'bg-gradient-to-br from-violet-600/12 via-violet-500/6 to-[#0a0e27]',
    border: 'border-violet-400/30',
    tithiColor: 'text-violet-300 font-bold',
  };
  if (isEkadashi(n)) return {
    bg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-400/4 to-[#0a0e27]',
    border: 'border-emerald-400/25',
    tithiColor: 'text-emerald-300 font-semibold',
  };
  if (hasMajorFestival) return {
    bg: 'bg-gradient-to-br from-gold-primary/10 via-gold-primary/4 to-[#0a0e27]',
    border: 'border-gold-primary/25',
    tithiColor: 'text-text-secondary',
  };
  if (cell.paksha === 'shukla') return {
    bg: 'bg-[#0e1230]/60',
    border: 'border-gold-primary/8',
    tithiColor: 'text-text-secondary/70',
  };
  return {
    bg: 'bg-[#0a0c22]/60',
    border: 'border-violet-500/8',
    tithiColor: 'text-text-secondary/60',
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TithiMonthGrid({ year, month, days, locale, onDayClick }: TithiMonthGridProps) {
  const isHi = isDevanagariLocale(locale);
  const isEn = !isHi;
  const dayNames = isHi ? DAY_NAMES_HI : DAY_NAMES_EN;

  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const dayMap = useMemo(() => {
    const m = new Map<number, TithiDayData>();
    for (const d of days) m.set(d.day, d);
    return m;
  }, [days]);

  // Build rows
  const rows: (TithiDayData | null)[][] = [];
  let currentRow: (TithiDayData | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) currentRow.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    currentRow.push(dayMap.get(d) || null);
    if (currentRow.length === 7) { rows.push(currentRow); currentRow = []; }
  }
  if (currentRow.length > 0) {
    while (currentRow.length < 7) currentRow.push(null);
    rows.push(currentRow);
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-gold-primary/15 bg-[#080b1e]">
      {/* Day name headers */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-[#1a1040] via-[#15103a] to-[#1a1040]">
        {dayNames.map((name, i) => (
          <div key={i} className={`text-center py-3 text-xs sm:text-sm font-bold tracking-wide ${i === 0 ? 'text-red-400/80' : 'text-gold-primary/70'}`}>
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7">
          {row.map((cell, ci) => {
            if (!cell) {
              return <div key={ci} className="min-h-[110px] sm:min-h-[130px] lg:min-h-[140px] bg-[#080b1e]/80 border-r border-b border-white/[0.03]" />;
            }

            const style = getCellStyle(cell);
            const n = cell.tithiNumber;
            const hasMajorFestival = cell.festivals.some(f => f.type === 'major');
            const hasEclipse = cell.festivals.some(f => f.type === 'eclipse');

            return (
              <div
                key={ci}
                onClick={() => onDayClick?.(cell.date)}
                className={`min-h-[110px] sm:min-h-[130px] lg:min-h-[140px] p-1.5 sm:p-2.5 cursor-pointer transition-all duration-200 hover:brightness-125 hover:scale-[1.01] relative border-r border-b border-white/[0.03] ${style.bg} ${
                  cell.isToday ? 'ring-2 ring-inset ring-gold-primary/50 z-10' : ''
                }`}
              >
                {/* Top row: date number + moon icon */}
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className={`text-sm sm:text-base font-black ${cell.isToday ? 'text-gold-light' : ci === 0 ? 'text-red-400/80' : 'text-text-primary/90'}`}>
                      {cell.day}
                    </span>
                    {cell.isToday && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gold-primary/25 text-gold-light font-bold uppercase tracking-wider">
                        {isEn ? 'today' : 'आज'}
                      </span>
                    )}
                  </div>
                  <MoonIcon tithiNumber={n} paksha={cell.paksha} size={24} />
                </div>

                {/* Tithi name — always shown */}
                <div className={`text-[10px] sm:text-xs leading-tight mb-0.5 ${style.tithiColor}`}>
                  {tl(cell.tithiName, locale)}
                </div>

                {/* Panchang details row: sunrise/sunset + nakshatra + moon rashi */}
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 mb-1 text-[7px] sm:text-[8px]">
                  {cell.sunrise && (
                    <span className="text-amber-400/50" title="Sunrise">
                      ☀ {cell.sunrise}
                    </span>
                  )}
                  {cell.sunset && (
                    <span className="text-violet-400/40" title="Sunset">
                      ☽ {cell.sunset}
                    </span>
                  )}
                </div>
                {cell.nakshatra && (
                  <div className="text-[7px] sm:text-[8px] text-cyan-400/50 leading-tight truncate" title={isEn ? 'Nakshatra' : 'नक्षत्र'}>
                    ✦ {tl(cell.nakshatra, locale)}
                  </div>
                )}
                {cell.moonRashi && (
                  <div className="text-[7px] sm:text-[8px] text-slate-400/50 leading-tight truncate" title={isEn ? 'Moon Sign' : 'चन्द्र राशि'}>
                    ☾ {tl(cell.moonRashi, locale)}
                  </div>
                )}

                {/* Special tithi badges */}
                {isPurnima(n) && (
                  <div className="text-[8px] sm:text-[9px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded px-1 py-0.5 mb-0.5 text-center">
                    {isEn ? 'FULL MOON' : 'पूर्णिमा'}
                  </div>
                )}
                {isAmavasya(n) && (
                  <div className="text-[8px] sm:text-[9px] font-bold text-violet-300 bg-violet-500/10 border border-violet-400/20 rounded px-1 py-0.5 mb-0.5 text-center">
                    {isEn ? 'NEW MOON' : 'अमावस्या'}
                  </div>
                )}
                {isEkadashi(n) && (
                  <div className="text-[8px] sm:text-[9px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 rounded px-1 py-0.5 mb-0.5 text-center">
                    {isEn ? 'EKADASHI' : 'एकादशी'}
                  </div>
                )}

                {/* Festivals */}
                {cell.festivals.length > 0 && (
                  <div className="space-y-0.5 mt-0.5">
                    {cell.festivals.slice(0, 3).map((f, fi) => (
                      <div
                        key={fi}
                        className={`text-[8px] sm:text-[9px] leading-tight px-1.5 py-0.5 rounded truncate ${
                          f.type === 'major'
                            ? 'bg-gold-primary/20 text-gold-light font-bold border border-gold-primary/30 shadow-sm shadow-gold-primary/10'
                            : f.type === 'eclipse'
                              ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30'
                              : 'bg-violet-500/10 text-violet-300/80 border border-violet-500/15'
                        }`}
                      >
                        {tl(f.name, locale)}
                      </div>
                    ))}
                    {cell.festivals.length > 3 && (
                      <div className="text-[8px] text-text-secondary/50 pl-1">+{cell.festivals.length - 3} {isEn ? 'more' : 'और'}</div>
                    )}
                  </div>
                )}

                {/* Corner decorations for special days */}
                {hasMajorFestival && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-t-gold-primary/30 border-l-[12px] border-l-transparent" />
                )}
                {hasEclipse && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-t-red-500/40 border-l-[12px] border-l-transparent" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
