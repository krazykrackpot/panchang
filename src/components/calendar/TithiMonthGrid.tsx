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
// Inline SVG mini-icons (no emoji — user preference)
// ---------------------------------------------------------------------------

function SunriseIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="inline-block shrink-0">
      <circle cx="8" cy="9" r="3.5" fill="none" stroke="#d4a853" strokeWidth="1.2" />
      <line x1="8" y1="3" x2="8" y2="5" stroke="#d4a853" strokeWidth="1" strokeLinecap="round" />
      <line x1="3.5" y1="5.5" x2="5" y2="7" stroke="#d4a853" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="12.5" y1="5.5" x2="11" y2="7" stroke="#d4a853" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="2" y1="13" x2="14" y2="13" stroke="#d4a853" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

function SunsetIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="inline-block shrink-0">
      <circle cx="8" cy="9" r="3.5" fill="none" stroke="#8a6d2b" strokeWidth="1.2" />
      <line x1="8" y1="5" x2="8" y2="3" stroke="#8a6d2b" strokeWidth="1" strokeLinecap="round" />
      <line x1="5" y1="7" x2="3.5" y2="5.5" stroke="#8a6d2b" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="11" y1="7" x2="12.5" y2="5.5" stroke="#8a6d2b" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="2" y1="13" x2="14" y2="13" stroke="#8a6d2b" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

function StarIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className="inline-block shrink-0">
      <polygon points="6,1 7.5,4.5 11,4.8 8.3,7.2 9.2,11 6,9 2.8,11 3.7,7.2 1,4.8 4.5,4.5" fill="#60a5fa" opacity="0.6" />
    </svg>
  );
}

function CrescentIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className="inline-block shrink-0">
      <circle cx="6" cy="6" r="4" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
      <path d="M7 3 A3.5 3.5 0 0 0 7 9 A4 4 0 0 1 7 3Z" fill="#94a3b8" opacity="0.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Moon phase SVG
// ---------------------------------------------------------------------------

function MoonIcon({ tithiNumber, paksha, size = 26 }: { tithiNumber: number; paksha: 'shukla' | 'krishna'; size?: number }) {
  const uid = `m${tithiNumber}${paksha[0]}`;

  if (tithiNumber === 15) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <defs>
          <radialGradient id={`${uid}-g`} cx="38%" cy="38%">
            <stop offset="0%" stopColor="#fff8e1" /><stop offset="60%" stopColor="#f0d48a" /><stop offset="100%" stopColor="#d4a853" />
          </radialGradient>
          <filter id={`${uid}-glow`}><feGaussianBlur stdDeviation="1.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <circle cx="12" cy="12" r="10" fill={`url(#${uid}-g)`} filter={`url(#${uid}-glow)`} />
      </svg>
    );
  }

  if (tithiNumber === 30 || tithiNumber === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#0d0820" />
        <circle cx="12" cy="12" r="10" fill="none" stroke="#6b5b8d" strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }

  const tithiInPaksha = paksha === 'shukla' ? tithiNumber : tithiNumber - 15;
  const fraction = tithiInPaksha / 15;
  const isWaxing = paksha === 'shukla';
  const terminatorX = 12 + (fraction * 2 - 1) * 10;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <clipPath id={`${uid}-c`}><circle cx="12" cy="12" r="10" /></clipPath>
        <linearGradient id={`${uid}-lit`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5e6b8" /><stop offset="100%" stopColor="#d4a853" />
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
// Special tithi helpers
// ---------------------------------------------------------------------------

function isEkadashi(n: number) { return n === 11 || n === 26; }
function isPurnima(n: number) { return n === 15; }
function isAmavasya(n: number) { return n === 30; }

function getCellStyle(cell: TithiDayData): { bg: string; border: string; tithiColor: string } {
  const n = cell.tithiNumber;
  const hasMajorFestival = cell.festivals.some(f => f.type === 'major');

  if (isPurnima(n)) return { bg: 'bg-gradient-to-br from-amber-500/12 via-amber-400/6 to-[#0a0e27]', border: 'border-amber-400/30', tithiColor: 'text-amber-300 font-bold' };
  if (isAmavasya(n)) return { bg: 'bg-gradient-to-br from-violet-600/12 via-violet-500/6 to-[#0a0e27]', border: 'border-violet-400/30', tithiColor: 'text-violet-300 font-bold' };
  if (isEkadashi(n)) return { bg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-400/4 to-[#0a0e27]', border: 'border-emerald-400/25', tithiColor: 'text-emerald-300 font-semibold' };
  if (hasMajorFestival) return { bg: 'bg-gradient-to-br from-gold-primary/10 via-gold-primary/4 to-[#0a0e27]', border: 'border-gold-primary/25', tithiColor: 'text-text-secondary' };
  if (cell.paksha === 'shukla') return { bg: 'bg-[#0e1230]/60', border: 'border-gold-primary/8', tithiColor: 'text-text-secondary/70' };
  return { bg: 'bg-[#0a0c22]/60', border: 'border-violet-500/8', tithiColor: 'text-text-secondary/60' };
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
              return <div key={ci} className="min-h-[160px] sm:min-h-[185px] lg:min-h-[200px] bg-[#080b1e]/80 border-r border-b border-white/[0.03]" />;
            }

            const style = getCellStyle(cell);
            const n = cell.tithiNumber;
            const hasMajorFestival = cell.festivals.some(f => f.type === 'major');
            const hasEclipse = cell.festivals.some(f => f.type === 'eclipse');

            return (
              <div
                key={ci}
                onClick={() => onDayClick?.(cell.date)}
                className={`min-h-[160px] sm:min-h-[185px] lg:min-h-[200px] p-1.5 sm:p-2 cursor-pointer transition-all duration-200 hover:brightness-125 relative border-r border-b border-white/[0.03] ${style.bg} ${
                  cell.isToday ? 'ring-2 ring-inset ring-gold-primary/50 z-10' : ''
                }`}
              >
                {/* ── Row 1: Date + Moon phase ── */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className={`text-base sm:text-lg font-black leading-none ${cell.isToday ? 'text-gold-light' : ci === 0 ? 'text-red-400/80' : 'text-text-primary/90'}`}>
                      {cell.day}
                    </span>
                    {cell.isToday && (
                      <span className="text-[7px] px-1 py-0.5 rounded-full bg-gold-primary/25 text-gold-light font-bold uppercase">
                        {isEn ? 'today' : 'आज'}
                      </span>
                    )}
                  </div>
                  <MoonIcon tithiNumber={n} paksha={cell.paksha} size={26} />
                </div>

                {/* ── Row 2: Tithi name (primary info) ── */}
                <div className={`text-[10px] sm:text-xs leading-tight mb-1 truncate ${style.tithiColor}`}>
                  {tl(cell.tithiName, locale)}
                </div>

                {/* ── Row 3: Special badge (Purnima/Amavasya/Ekadashi) ── */}
                {isPurnima(n) && (
                  <div className="text-[7px] sm:text-[8px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded px-1 py-0.5 mb-1 text-center w-fit">
                    {isEn ? 'PURNIMA' : 'पूर्णिमा'}
                  </div>
                )}
                {isAmavasya(n) && (
                  <div className="text-[7px] sm:text-[8px] font-bold text-violet-300 bg-violet-500/10 border border-violet-400/20 rounded px-1 py-0.5 mb-1 text-center w-fit">
                    {isEn ? 'AMAVASYA' : 'अमावस्या'}
                  </div>
                )}
                {isEkadashi(n) && (
                  <div className="text-[7px] sm:text-[8px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 rounded px-1 py-0.5 mb-1 text-center w-fit">
                    {isEn ? 'EKADASHI' : 'एकादशी'}
                  </div>
                )}

                {/* ── Row 4: Panchang details (sunrise/sunset, nakshatra, moon sign) ── */}
                <div className="space-y-0.5 mb-1">
                  {/* Sunrise + Sunset on one line */}
                  {(cell.sunrise || cell.sunset) && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-[8px] sm:text-[9px]">
                      {cell.sunrise && (
                        <span className="flex items-center gap-0.5 text-amber-400/60">
                          <SunriseIcon size={11} />
                          <span className="font-mono">{cell.sunrise}</span>
                        </span>
                      )}
                      {cell.sunset && (
                        <span className="flex items-center gap-0.5 text-gold-dark/50">
                          <SunsetIcon size={11} />
                          <span className="font-mono">{cell.sunset}</span>
                        </span>
                      )}
                    </div>
                  )}
                  {/* Nakshatra */}
                  {cell.nakshatra && (
                    <div className="flex items-center gap-0.5 text-[8px] sm:text-[9px] text-cyan-400/60 truncate">
                      <StarIcon size={9} />
                      <span className="truncate">{tl(cell.nakshatra, locale)}</span>
                    </div>
                  )}
                  {/* Moon Rashi */}
                  {cell.moonRashi && (
                    <div className="flex items-center gap-0.5 text-[8px] sm:text-[9px] text-slate-400/50 truncate">
                      <CrescentIcon size={9} />
                      <span className="truncate">{tl(cell.moonRashi, locale)}</span>
                    </div>
                  )}
                </div>

                {/* ── Row 5: Festivals ── */}
                {cell.festivals.length > 0 && (
                  <div className="space-y-0.5">
                    {cell.festivals.slice(0, 2).map((f, fi) => (
                      <div
                        key={fi}
                        className={`text-[7px] sm:text-[8px] leading-tight px-1.5 py-0.5 rounded truncate ${
                          f.type === 'major'
                            ? 'bg-gold-primary/20 text-gold-light font-bold border border-gold-primary/30'
                            : f.type === 'eclipse'
                              ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30'
                              : 'bg-violet-500/10 text-violet-300/80 border border-violet-500/15'
                        }`}
                      >
                        {tl(f.name, locale)}
                      </div>
                    ))}
                    {cell.festivals.length > 2 && (
                      <div className="text-[7px] text-text-secondary/50 pl-1">+{cell.festivals.length - 2} {isEn ? 'more' : 'और'}</div>
                    )}
                  </div>
                )}

                {/* Corner decorations */}
                {hasMajorFestival && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[14px] border-t-gold-primary/35 border-l-[14px] border-l-transparent" />
                )}
                {hasEclipse && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[14px] border-t-red-500/45 border-l-[14px] border-l-transparent" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
