'use client';

import { useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import type { LocaleText } from '@/types/panchang';
import MSG from '@/messages/pages/tithi.json';
import { FestivalIconDefs, festivalIconFor } from '@/components/icons/FestivalIcons';

// Localised short weekday header (Sun/Mon/Tue... or transliteration into
// the locale's script) via Intl. Falls back to English silently.
function localDayNames(locale: string): string[] {
  try {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    // 2024-01-07 is a Sunday — generate 7 successive days from there.
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 7 + i)));
  } catch {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
}

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
  festivals: { name: LocaleText; type: string; slug?: string; category?: string }[];
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
// Moon phase SVG  –  large, detailed, dramatic
// ---------------------------------------------------------------------------

function MoonIcon({ tithiNumber, paksha, size = 32 }: { tithiNumber: number; paksha: 'shukla' | 'krishna'; size?: number }) {
  const uid = `m${tithiNumber}${paksha[0]}`;

  // Purnima  –  radiant golden full moon with glow
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

  // Amavasya  –  dark void with faint purple ring and tiny stars
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

function isEkadashi(n: number) { return n === 11 || n === 26; }
function isPurnima(n: number) { return n === 15; }
function isAmavasya(n: number) { return n === 30; }
function isChaturthi(n: number) { return n === 4 || n === 19; }

// A day is a "vrat day" if any of its festivals is in the vrat category, or
// the slug indicates a known vrat pattern (ekadashi suffix, teej, chauth,
// savitri). The left-edge bar treatment is driven off this.
function hasVrat(festivals: TithiDayData['festivals']): boolean {
  return festivals.some((f) => {
    if (f.category === 'vrat' || f.category === 'ekadashi') return true;
    const slug = f.slug?.toLowerCase() ?? '';
    return (
      slug.endsWith('-ekadashi') ||
      slug.includes('teej') ||
      slug.includes('chauth') ||
      slug.includes('vrat') ||
      slug === 'karwa-chauth' ||
      slug === 'vat-savitri'
    );
  });
}

// ---------------------------------------------------------------------------
// Cell styling  –  dramatically different per tithi type
// ---------------------------------------------------------------------------

// "Vibrant dark" identity: special days glow from within like a deepa against
// night; regular days are clearly readable charcoal cards with gold accents.
// Baseline is the project's purple mega-card gradient (used across 30+ cards
// in the app — see CLAUDE.md). Special-day variants layer brighter gradients
// on top so glow has a chance to read.
function getCellClasses(cell: TithiDayData): { outer: string; dayCircle: string; tithiText: string; accent: string } {
  const n = cell.tithiNumber;
  const hasMajor = cell.festivals.some(f => f.type === 'major');
  const hasEclipse = cell.festivals.some(f => f.type === 'eclipse');

  if (isPurnima(n)) return {
    outer: 'bg-gradient-to-br from-amber-500/35 via-amber-600/22 to-[#1a1040]/60 border-2 border-amber-400/70 animate-purnima-glow',
    dayCircle: 'bg-amber-400/40 text-amber-50 border-2 border-amber-300/80',
    tithiText: 'text-amber-200 font-black',
    accent: 'border-t-[3px] border-t-amber-300/85',
  };
  if (isAmavasya(n)) return {
    outer: 'bg-gradient-to-br from-violet-700/40 via-indigo-800/30 to-[#0a0e27] border-2 border-violet-400/55 shadow-[0_0_24px_rgba(139,92,246,0.25),inset_0_0_22px_rgba(139,92,246,0.18)]',
    dayCircle: 'bg-violet-500/45 text-violet-50 border-2 border-violet-300/80',
    tithiText: 'text-violet-200 font-black',
    accent: 'border-t-[3px] border-t-violet-400/75',
  };
  if (isEkadashi(n)) return {
    outer: 'bg-gradient-to-br from-emerald-700/32 via-emerald-900/18 to-[#0a0e27] border-2 border-emerald-400/55 shadow-[0_0_18px_rgba(16,185,129,0.18)]',
    dayCircle: 'bg-emerald-500/45 text-emerald-50 border-2 border-emerald-300/75',
    tithiText: 'text-emerald-200 font-bold',
    accent: 'border-l-[4px] border-l-emerald-300/85',
  };
  if (hasEclipse) return {
    outer: 'bg-gradient-to-br from-red-700/38 via-red-900/22 to-[#0a0e27] border-2 border-red-400/60 shadow-[0_0_24px_rgba(239,68,68,0.28)] animate-eclipse-pulse',
    dayCircle: 'bg-red-500/45 text-red-50 border-2 border-red-300/80',
    tithiText: 'text-red-200 font-bold',
    accent: 'border-t-[3px] border-t-red-400/80',
  };
  if (hasMajor) return {
    outer: 'bg-gradient-to-br from-gold-primary/35 via-[#2d1b69]/55 to-[#0a0e27] border-2 border-gold-primary/55 shadow-[0_0_18px_rgba(212,168,83,0.22)]',
    dayCircle: 'bg-gold-primary/40 text-gold-light border-2 border-gold-primary/70',
    tithiText: 'text-gold-light font-semibold',
    accent: 'border-t-[3px] border-t-gold-primary/75',
  };
  // Baseline shukla — uses the project's elevated-surface gradient with
  // a gentle amber tint to differentiate paksha at-a-glance.
  if (cell.paksha === 'shukla') return {
    outer: 'bg-gradient-to-br from-[#3a2880]/40 via-[#1a1040]/55 to-[#0a0e27] border border-gold-primary/15',
    dayCircle: 'bg-amber-500/20 text-amber-100 border border-amber-400/35',
    tithiText: 'text-amber-100/90 font-medium',
    accent: '',
  };
  // Baseline krishna — same gradient family, indigo tilt.
  return {
    outer: 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12',
    dayCircle: 'bg-indigo-500/20 text-indigo-100 border border-indigo-400/30',
    tithiText: 'text-indigo-100/90 font-medium',
    accent: '',
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TithiMonthGrid({ year, month, days, locale, onDayClick }: TithiMonthGridProps) {
  // Day-name labels via Intl — covers all 10 locales with native scripts.
  const dayNames = useMemo(() => localDayNames(locale), [locale]);
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
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
    {/* Festival-icon shared gradient defs — mounted once for the whole grid. */}
    <FestivalIconDefs />
    {/*
     * Grid surface is LIGHTER than the page background (#0a0e27), so the
     * calendar feels like a surface rather than a void. The page background
     * remains the standard navy; the grid sits on a slightly lifted purple
     * gradient consistent with the project's mega-card pattern.
     */}
    <div className="min-w-[700px] sm:min-w-0 rounded-2xl overflow-hidden border border-gold-primary/25 bg-gradient-to-br from-[#171036] via-[#120c2a] to-[#0c0a22] shadow-2xl shadow-black/40">
      {/* Day name headers */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-[#2d1b69] via-[#221451] to-[#2d1b69] border-b border-gold-primary/25">
        {dayNames.map((name, i) => (
          <div key={i} className={`text-center py-3 text-xs sm:text-sm font-bold tracking-[0.18em] ${i === 0 ? 'text-red-300' : 'text-gold-light'}`}>
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7">
          {row.map((cell, ci) => {
            if (!cell) {
              return <div key={ci} className="min-h-[170px] sm:min-h-[190px] lg:min-h-[210px] bg-gradient-to-br from-[#0e0a22] to-[#0a0820] border-r border-b border-gold-primary/[0.04]" />;
            }

            const s = getCellClasses(cell);
            const n = cell.tithiNumber;
            const isSpecial = isPurnima(n) || isAmavasya(n) || isEkadashi(n);
            // Short masa abbreviation for top-right chip
            const masaShort = cell.masa?.amanta
              ? cell.masa.amanta.charAt(0).toUpperCase() + cell.masa.amanta.slice(1, 4)
              : null;
            const cellHasVrat = hasVrat(cell.festivals);

            return (
              <div
                key={ci}
                onClick={() => onDayClick?.(cell.date)}
                className={`min-h-[170px] sm:min-h-[190px] lg:min-h-[210px] p-1 sm:p-2 cursor-pointer transition-all duration-200 hover:brightness-110 hover:z-10 relative border-r border-b border-gold-primary/[0.06] ${s.outer} ${s.accent} ${
                  cell.isToday ? 'ring-2 ring-inset ring-gold-primary shadow-[0_0_28px_rgba(212,168,83,0.4)] z-20' : ''
                }`}
              >
                {/* Vrat marker — purple left-edge bar, hidden when the cell
                    already has a Purnima/Amavasya/Ekadashi/eclipse/major-festival
                    treatment (avoids visual collision). */}
                {cellHasVrat && !isPurnima(n) && !isAmavasya(n) && !isEkadashi(n) && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-violet-400/70 via-violet-500/60 to-violet-700/40 pointer-events-none" aria-hidden="true" />
                )}
                {/* ── Header: Day number + masa chip ── */}
                <div className="flex items-start justify-between mb-1 gap-1">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black shrink-0 ${
                    cell.isToday ? 'bg-gold-primary/55 text-bg-primary border-2 border-gold-light shadow-[0_0_12px_rgba(212,168,83,0.55)]' :
                    s.dayCircle ? s.dayCircle :
                    ci === 0 ? 'bg-red-500/20 text-red-200 border border-red-400/35' :
                    cell.paksha === 'shukla' ? 'bg-amber-500/20 text-amber-100 border border-amber-400/35' :
                    'bg-indigo-500/20 text-indigo-100 border border-indigo-400/30'
                  }`}>
                    {cell.day}
                  </div>
                  {/* Masa chip — gives at-a-glance lunar-month context */}
                  {masaShort && (
                    <div className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded shrink truncate max-w-[60px] ${
                      cell.paksha === 'shukla'
                        ? 'bg-amber-500/15 text-amber-200 border border-amber-400/25'
                        : 'bg-indigo-500/15 text-indigo-200 border border-indigo-400/25'
                    }`} title={cell.masa?.amanta}>
                      {masaShort}{cell.paksha === 'shukla' ? '·S' : '·K'}
                    </div>
                  )}
                  {cell.isToday && !masaShort && (
                    <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-full bg-gold-primary/40 text-bg-primary font-black uppercase tracking-widest animate-pulse">
                      {tl(MSG.today, locale)}
                    </span>
                  )}
                </div>
                {cell.isToday && masaShort && (
                  // Hangs from inside the cell's top edge (rounded-b-full) so
                  // first-row cells don't get the pill clipped by the grid
                  // wrapper's overflow-hidden, and so it never collides with
                  // the day-name header strip.
                  <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
                    <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-b-full bg-gold-primary text-bg-primary font-black uppercase tracking-widest animate-pulse shadow-[0_2px_8px_rgba(212,168,83,0.5)]">
                      {tl(MSG.today, locale)}
                    </span>
                  </div>
                )}

                {/* ── Moon phase  –  centered, prominent ── */}
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
                    {tl(MSG.fullMoon, locale)}
                  </div>
                )}
                {isAmavasya(n) && (
                  <div className="text-[8px] sm:text-[9px] font-black text-violet-200 bg-violet-500/15 border border-violet-400/25 rounded-full px-2 py-0.5 mx-auto mt-0.5 w-fit uppercase tracking-widest">
                    {tl(MSG.newMoon, locale)}
                  </div>
                )}
                {isEkadashi(n) && (
                  <div className="text-[8px] sm:text-[9px] font-black text-emerald-200 bg-emerald-500/15 border border-emerald-400/25 rounded-full px-2 py-0.5 mx-auto mt-0.5 w-fit uppercase tracking-widest">
                    {tl(MSG.ekadashi, locale)}
                  </div>
                )}

                {/* ── Panchang details ── */}
                <div className="mt-1 space-y-0.5 text-[9px] sm:text-[10px]">
                  {/* Sunrise / Sunset */}
                  {cell.sunrise && (
                    <div className="flex items-center gap-0.5 text-amber-200/90">
                      <SunriseIcon /><span className="font-mono">{cell.sunrise}</span>
                      {cell.sunset && (
                        <><span className="text-text-secondary/40 mx-0.5">·</span><SunsetIcon /><span className="font-mono text-amber-300/75">{cell.sunset}</span></>
                      )}
                    </div>
                  )}
                  {/* Nakshatra */}
                  {cell.nakshatra && (
                    <div className="flex items-center gap-1 text-cyan-200/90 truncate">
                      <svg width="12" height="12" viewBox="0 0 16 16" className="shrink-0"><polygon points="8,1 10,6 15,6.5 11,10 12.5,15 8,12 3.5,15 5,10 1,6.5 6,6" fill="#67e8f9" opacity="0.9" /></svg>
                      <span className="truncate">{tl(cell.nakshatra, locale)}</span>
                    </div>
                  )}
                  {/* Moon Rashi */}
                  {cell.moonRashi && (
                    <div className="flex items-center gap-1 text-slate-200/85 truncate">
                      <svg width="11" height="11" viewBox="0 0 16 16" className="shrink-0"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#cbd5e1" strokeWidth="1" /><path d="M9.5 4 A4.5 4.5 0 0 0 9.5 12 A5.5 5.5 0 0 1 9.5 4Z" fill="#cbd5e1" opacity="0.75" /></svg>
                      <span className="truncate">{tl(cell.moonRashi, locale)}</span>
                    </div>
                  )}
                  {/* Yoga — present in data, now finally rendered. Tiny knot
                      icon hints at the joining-of-Sun-and-Moon meaning. */}
                  {cell.yoga && (
                    <div className="flex items-center gap-1 text-fuchsia-200/85 truncate">
                      <svg width="11" height="11" viewBox="0 0 16 16" className="shrink-0">
                        <path d="M5 4 Q8 7 11 4 Q14 8 11 12 Q8 9 5 12 Q2 8 5 4Z" fill="none" stroke="#e879f9" strokeWidth="1.1" opacity="0.85" />
                      </svg>
                      <span className="truncate">{tl(cell.yoga, locale)}</span>
                    </div>
                  )}
                </div>

                {/* ── Festivals ── icon + name in a compact ribbon */}
                {cell.festivals.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {cell.festivals.slice(0, 2).map((f, fi) => {
                      const Icon = festivalIconFor(f.slug);
                      const chipClass =
                        f.type === 'major'
                          ? 'bg-gradient-to-r from-gold-primary/45 to-gold-primary/25 text-gold-light border border-gold-primary/65 shadow-[0_0_8px_rgba(212,168,83,0.18)]'
                          : f.type === 'eclipse'
                            ? 'bg-red-500/35 text-red-100 border border-red-400/60'
                            : 'bg-violet-500/25 text-violet-100 border border-violet-400/40';
                      return (
                        <div
                          key={fi}
                          className={`flex items-center gap-1 text-[9px] sm:text-[10px] leading-tight px-1.5 py-0.5 rounded font-semibold ${chipClass}`}
                        >
                          <Icon size={13} className="shrink-0" />
                          <span className="truncate">{tl(f.name, locale)}</span>
                        </div>
                      );
                    })}
                    {cell.festivals.length > 2 && (
                      <div className="text-[8px] sm:text-[9px] text-gold-light/80 text-center font-bold tracking-wider">
                        +{cell.festivals.length - 2} {tl(MSG.more, locale)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
    </div>
  );
}
