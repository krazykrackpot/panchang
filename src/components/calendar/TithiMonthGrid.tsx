'use client';

import { useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import type { LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TithiDayData {
  date: string;
  day: number;
  tithiNumber: number;
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
  month: number;
  days: TithiDayData[];
  locale: string;
  onDayClick?: (date: string) => void;
}

// ---------------------------------------------------------------------------
// Moon phase SVG — large, detailed, dramatic
// ---------------------------------------------------------------------------

function MoonIcon({ tithiNumber, paksha, size = 32 }: { tithiNumber: number; paksha: 'shukla' | 'krishna'; size?: number }) {
  const uid = `m${tithiNumber}${paksha[0]}`;

  // Purnima — radiant golden full moon with glow
  if (tithiNumber === 15) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <radialGradient id={`${uid}-g`} cx="35%" cy="35%">
            <stop offset="0%" stopColor="#fff8e1" /><stop offset="40%" stopColor="#f0d48a" /><stop offset="100%" stopColor="#d4a853" />
          </radialGradient>
          <filter id={`${uid}-glow`}><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {/* Outer glow */}
        <circle cx="16" cy="16" r="15" fill="#f0d48a" opacity="0.08" />
        <circle cx="16" cy="16" r="12" fill={`url(#${uid}-g)`} filter={`url(#${uid}-glow)`} />
        {/* Surface detail */}
        <circle cx="13" cy="13" r="2" fill="#d4a853" opacity="0.15" />
        <circle cx="18" cy="14" r="1.2" fill="#d4a853" opacity="0.1" />
        <circle cx="14" cy="19" r="1.5" fill="#d4a853" opacity="0.08" />
      </svg>
    );
  }

  // Amavasya — dark void with faint purple ring and tiny stars
  if (tithiNumber === 30 || tithiNumber === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="12" fill="#0d0820" />
        <circle cx="16" cy="16" r="12" fill="none" stroke="#6b5b8d" strokeWidth="1.2" opacity="0.35" />
        <circle cx="16" cy="16" r="10" fill="none" stroke="#4a3f6b" strokeWidth="0.4" strokeDasharray="1.5 2.5" opacity="0.25" />
        {/* Tiny stars around */}
        <circle cx="5" cy="6" r="0.6" fill="#8b8bba" opacity="0.4" />
        <circle cx="27" cy="8" r="0.5" fill="#8b8bba" opacity="0.3" />
        <circle cx="28" cy="24" r="0.7" fill="#8b8bba" opacity="0.35" />
        <circle cx="4" cy="26" r="0.5" fill="#8b8bba" opacity="0.25" />
      </svg>
    );
  }

  // Crescent → gibbous with gradient fill
  const tithiInPaksha = paksha === 'shukla' ? tithiNumber : tithiNumber - 15;
  const fraction = tithiInPaksha / 15;
  const isWaxing = paksha === 'shukla';
  const terminatorX = 16 + (fraction * 2 - 1) * 12;

  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>
        <clipPath id={`${uid}-c`}><circle cx="16" cy="16" r="12" /></clipPath>
        <linearGradient id={`${uid}-lit`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5e6b8" /><stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="12" fill="#0d0820" />
      <g clipPath={`url(#${uid}-c)`}>
        {isWaxing ? (
          <ellipse cx={terminatorX} cy="16" rx={Math.max(Math.abs(fraction * 2 - 1) * 12, 0.5)} ry="12" fill={`url(#${uid}-lit)`} />
        ) : (
          <ellipse cx={32 - terminatorX} cy="16" rx={Math.max(Math.abs(fraction * 2 - 1) * 12, 0.5)} ry="12" fill={`url(#${uid}-lit)`} />
        )}
      </g>
      <circle cx="16" cy="16" r="12" fill="none" stroke="#8a6d2b" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Inline SVG micro-icons
// ---------------------------------------------------------------------------

function SunriseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" className="inline-block shrink-0">
      <circle cx="8" cy="10" r="3" fill="none" stroke="#d4a853" strokeWidth="1.2" />
      <line x1="8" y1="4" x2="8" y2="6" stroke="#d4a853" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="4" y1="6.5" x2="5.2" y2="7.7" stroke="#d4a853" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="12" y1="6.5" x2="10.8" y2="7.7" stroke="#d4a853" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="2" y1="13" x2="14" y2="13" stroke="#d4a853" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

function SunsetIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" className="inline-block shrink-0">
      <circle cx="8" cy="10" r="3" fill="none" stroke="#8a6d2b" strokeWidth="1.2" />
      <line x1="8" y1="6" x2="8" y2="4" stroke="#8a6d2b" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="2" y1="13" x2="14" y2="13" stroke="#8a6d2b" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Day names & helpers
// ---------------------------------------------------------------------------

const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

function isEkadashi(n: number) { return n === 11 || n === 26; }
function isPurnima(n: number) { return n === 15; }
function isAmavasya(n: number) { return n === 30; }
function isChaturthi(n: number) { return n === 4 || n === 19; }

// ---------------------------------------------------------------------------
// Cell styling — dramatically different per tithi type
// ---------------------------------------------------------------------------

function getCellClasses(cell: TithiDayData): { outer: string; dayCircle: string; tithiText: string; accent: string } {
  const n = cell.tithiNumber;
  const hasMajor = cell.festivals.some(f => f.type === 'major');
  const hasEclipse = cell.festivals.some(f => f.type === 'eclipse');

  if (isPurnima(n)) return {
    outer: 'bg-gradient-to-b from-amber-500/15 via-amber-400/8 to-amber-900/5 border-2 border-amber-400/40 shadow-[inset_0_0_20px_rgba(245,198,88,0.06)]',
    dayCircle: 'bg-amber-400/25 text-amber-100 border-2 border-amber-400/50',
    tithiText: 'text-amber-300 font-black',
    accent: 'border-t-[3px] border-t-amber-400/60',
  };
  if (isAmavasya(n)) return {
    outer: 'bg-gradient-to-b from-violet-900/20 via-indigo-900/10 to-[#060818] border-2 border-violet-500/30 shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]',
    dayCircle: 'bg-violet-500/25 text-violet-100 border-2 border-violet-500/50',
    tithiText: 'text-violet-300 font-black',
    accent: 'border-t-[3px] border-t-violet-500/50',
  };
  if (isEkadashi(n)) return {
    outer: 'bg-gradient-to-br from-emerald-900/12 via-emerald-800/5 to-[#0a0e27] border-2 border-emerald-500/25',
    dayCircle: 'bg-emerald-500/20 text-emerald-100 border-2 border-emerald-500/40',
    tithiText: 'text-emerald-300 font-bold',
    accent: 'border-l-[3px] border-l-emerald-400/60',
  };
  if (hasEclipse) return {
    outer: 'bg-gradient-to-br from-red-900/15 via-red-800/5 to-[#0a0e27] border-2 border-red-500/30',
    dayCircle: 'bg-red-500/20 text-red-100 border-2 border-red-500/40',
    tithiText: 'text-red-300 font-bold',
    accent: 'border-t-[3px] border-t-red-500/50',
  };
  if (hasMajor) return {
    outer: 'bg-gradient-to-br from-gold-primary/12 via-[#1a1040]/30 to-[#0a0e27] border-2 border-gold-primary/35',
    dayCircle: 'bg-gold-primary/20 text-gold-light border-2 border-gold-primary/40',
    tithiText: 'text-gold-light font-semibold',
    accent: 'border-t-[3px] border-t-gold-primary/50',
  };
  if (cell.paksha === 'shukla') return {
    outer: 'bg-gradient-to-br from-amber-950/8 via-[#0e1230]/60 to-[#0a0e27] border-amber-800/10',
    dayCircle: 'bg-amber-500/5 text-text-primary/80 border border-amber-500/10',
    tithiText: 'text-amber-200/60',
    accent: '',
  };
  return {
    outer: 'bg-gradient-to-br from-indigo-950/10 via-[#0a0c22]/60 to-[#080b1e] border-indigo-800/10',
    dayCircle: 'bg-indigo-500/5 text-text-primary/70 border border-indigo-500/10',
    tithiText: 'text-indigo-300/50',
    accent: '',
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
    <div className="rounded-2xl overflow-hidden border border-gold-primary/20 bg-[#060818] shadow-xl shadow-black/30">
      {/* Day name headers */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-[#1a1040] via-[#15103a] to-[#1a1040] border-b border-gold-primary/15">
        {dayNames.map((name, i) => (
          <div key={i} className={`text-center py-3 text-xs sm:text-sm font-bold tracking-wider ${i === 0 ? 'text-red-400/80' : 'text-gold-primary/70'}`}>
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7">
          {row.map((cell, ci) => {
            if (!cell) {
              return <div key={ci} className="min-h-[170px] sm:min-h-[190px] lg:min-h-[210px] bg-[#060818]/80 border-r border-b border-white/[0.02]" />;
            }

            const s = getCellClasses(cell);
            const n = cell.tithiNumber;
            const isSpecial = isPurnima(n) || isAmavasya(n) || isEkadashi(n);

            return (
              <div
                key={ci}
                onClick={() => onDayClick?.(cell.date)}
                className={`min-h-[170px] sm:min-h-[190px] lg:min-h-[210px] p-1 sm:p-2 cursor-pointer transition-all duration-200 hover:brightness-130 hover:z-10 relative border-r border-b border-white/[0.03] ${s.outer} ${s.accent} ${
                  cell.isToday ? 'ring-2 ring-inset ring-gold-primary/60 z-20' : ''
                }`}
              >
                {/* ── Header: Day number (always circled) ── */}
                <div className="flex items-center justify-between mb-1">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black ${
                    cell.isToday ? 'bg-gold-primary/30 text-gold-light border-2 border-gold-primary/60 shadow-sm shadow-gold-primary/20' :
                    s.dayCircle ? s.dayCircle :
                    ci === 0 ? 'bg-red-500/8 text-red-400/70 border border-red-500/15' :
                    cell.paksha === 'shukla' ? 'bg-amber-500/5 text-text-primary/80 border border-amber-500/10' :
                    'bg-indigo-500/5 text-text-primary/70 border border-indigo-500/10'
                  }`}>
                    {cell.day}
                  </div>
                  {cell.isToday && (
                    <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-full bg-gold-primary/25 text-gold-light font-bold uppercase tracking-widest animate-pulse">
                      {isEn ? 'TODAY' : 'आज'}
                    </span>
                  )}
                </div>

                {/* ── Moon phase — centered, prominent ── */}
                <div className="flex justify-center my-1">
                  <MoonIcon tithiNumber={n} paksha={cell.paksha} size={isSpecial ? 42 : 34} />
                </div>

                {/* ── Tithi name ── */}
                <div className={`text-xs sm:text-sm leading-tight text-center truncate ${s.tithiText}`}>
                  {tl(cell.tithiName, locale)}
                </div>

                {/* ── Special badge ── */}
                {isPurnima(n) && (
                  <div className="text-[8px] sm:text-[9px] font-black text-amber-200 bg-amber-500/20 border border-amber-400/30 rounded-full px-2 py-0.5 mx-auto mt-0.5 w-fit uppercase tracking-widest">
                    {isEn ? 'Full Moon' : 'पूर्णिमा'}
                  </div>
                )}
                {isAmavasya(n) && (
                  <div className="text-[8px] sm:text-[9px] font-black text-violet-200 bg-violet-500/15 border border-violet-400/25 rounded-full px-2 py-0.5 mx-auto mt-0.5 w-fit uppercase tracking-widest">
                    {isEn ? 'New Moon' : 'अमावस्या'}
                  </div>
                )}
                {isEkadashi(n) && (
                  <div className="text-[8px] sm:text-[9px] font-black text-emerald-200 bg-emerald-500/15 border border-emerald-400/25 rounded-full px-2 py-0.5 mx-auto mt-0.5 w-fit uppercase tracking-widest">
                    {isEn ? 'Ekadashi' : 'एकादशी'}
                  </div>
                )}

                {/* ── Panchang details ── */}
                <div className="mt-1 space-y-0.5 text-[9px] sm:text-[10px]">
                  {/* Sunrise / Sunset */}
                  {cell.sunrise && (
                    <div className="flex items-center gap-0.5 text-amber-400/50">
                      <SunriseIcon /><span className="font-mono">{cell.sunrise}</span>
                      {cell.sunset && (
                        <><span className="text-text-secondary/20 mx-0.5">·</span><SunsetIcon /><span className="font-mono text-gold-dark/40">{cell.sunset}</span></>
                      )}
                    </div>
                  )}
                  {/* Nakshatra */}
                  {cell.nakshatra && (
                    <div className="flex items-center gap-1 text-cyan-400/55 truncate">
                      <svg width="12" height="12" viewBox="0 0 16 16" className="shrink-0"><polygon points="8,1 10,6 15,6.5 11,10 12.5,15 8,12 3.5,15 5,10 1,6.5 6,6" fill="#22d3ee" opacity="0.5" /></svg>
                      <span className="truncate">{tl(cell.nakshatra, locale)}</span>
                    </div>
                  )}
                  {/* Moon Rashi */}
                  {cell.moonRashi && (
                    <div className="flex items-center gap-1 text-slate-400/45 truncate">
                      <svg width="11" height="11" viewBox="0 0 16 16" className="shrink-0"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#94a3b8" strokeWidth="1" /><path d="M9.5 4 A4.5 4.5 0 0 0 9.5 12 A5.5 5.5 0 0 1 9.5 4Z" fill="#94a3b8" opacity="0.45" /></svg>
                      <span className="truncate">{tl(cell.moonRashi, locale)}</span>
                    </div>
                  )}
                </div>

                {/* ── Festivals ── */}
                {cell.festivals.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {cell.festivals.slice(0, 2).map((f, fi) => (
                      <div
                        key={fi}
                        className={`text-[9px] sm:text-[10px] leading-tight px-1.5 py-0.5 rounded truncate ${
                          f.type === 'major'
                            ? 'bg-gradient-to-r from-gold-primary/25 to-gold-primary/10 text-gold-light font-bold border border-gold-primary/35'
                            : f.type === 'eclipse'
                              ? 'bg-red-500/15 text-red-300 font-bold border border-red-500/25'
                              : 'bg-white/[0.03] text-violet-300/70 border border-violet-500/10'
                        }`}
                      >
                        {tl(f.name, locale)}
                      </div>
                    ))}
                    {cell.festivals.length > 2 && (
                      <div className="text-[6px] text-text-secondary/40 text-center">+{cell.festivals.length - 2}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
