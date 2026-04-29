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
  tithiNumber: number;  // 1-30 (shukla 1-15, krishna 16-30)
  tithiName: LocaleText;
  paksha: 'shukla' | 'krishna';
  masa?: { amanta: string; purnimanta: string; isAdhika: boolean };
  festivals: { name: LocaleText; type: string; slug?: string }[];
  isToday: boolean;
}

interface TithiMonthGridProps {
  year: number;
  month: number;     // 1-12
  days: TithiDayData[];
  locale: string;
  onDayClick?: (date: string) => void;
}

// ---------------------------------------------------------------------------
// Moon phase SVG icons — derived from tithi number
// ---------------------------------------------------------------------------

/** Returns an SVG moon icon based on tithi number (1-30). */
function MoonIcon({ tithiNumber, paksha, size = 22 }: { tithiNumber: number; paksha: 'shukla' | 'krishna'; size?: number }) {
  // Normalize to 1-15 within the paksha
  const tithiInPaksha = paksha === 'shukla' ? tithiNumber : tithiNumber - 15;

  // Purnima (full moon)
  if (tithiNumber === 15) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className="inline-block">
        <circle cx="12" cy="12" r="10" fill="#f0d48a" stroke="#d4a853" strokeWidth="1" />
        <circle cx="12" cy="12" r="10" fill="url(#fullMoonGlow)" />
        <defs>
          <radialGradient id="fullMoonGlow" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#fff8e1" />
            <stop offset="100%" stopColor="#f0d48a" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  // Amavasya (new moon)
  if (tithiNumber === 30 || tithiNumber === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className="inline-block">
        <circle cx="12" cy="12" r="10" fill="#1a1040" stroke="#8a6d2b" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    );
  }

  // Waxing (Shukla) or Waning (Krishna) — crescent to gibbous
  const illumination = tithiInPaksha / 15; // 0 to 1
  const isWaxing = paksha === 'shukla';

  // Calculate the arc for the terminator line
  // illumination 0 = new, 0.5 = half, 1 = full
  // For the terminator, we use a bezier that sweeps from left to right
  const sweep = illumination * 2 - 1; // -1 to 1 (negative = crescent, positive = gibbous)
  const cx = 12 + sweep * 10; // terminator center x

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="inline-block">
      <defs>
        <clipPath id={`moon-clip-${tithiNumber}-${paksha}`}>
          <circle cx="12" cy="12" r="10" />
        </clipPath>
      </defs>
      {/* Dark background */}
      <circle cx="12" cy="12" r="10" fill="#1a1040" stroke="#8a6d2b" strokeWidth="0.5" />
      {/* Illuminated portion */}
      <g clipPath={`url(#moon-clip-${tithiNumber}-${paksha})`}>
        {isWaxing ? (
          // Waxing: illuminated from right
          <ellipse cx={cx} cy="12" rx={Math.abs(sweep) * 10 + 1} ry="10" fill="#f0d48a" />
        ) : (
          // Waning: illuminated from left
          <ellipse cx={24 - cx} cy="12" rx={Math.abs(sweep) * 10 + 1} ry="10" fill="#f0d48a" />
        )}
      </g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="#8a6d2b" strokeWidth="0.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Day names
// ---------------------------------------------------------------------------

const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TithiMonthGrid({ year, month, days, locale, onDayClick }: TithiMonthGridProps) {
  const isHi = isDevanagariLocale(locale);
  const dayNames = isHi ? DAY_NAMES_HI : DAY_NAMES_EN;

  // Build grid: first day of month's weekday (0=Sun)
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  // Create a map for quick lookup
  const dayMap = useMemo(() => {
    const m = new Map<number, TithiDayData>();
    for (const d of days) m.set(d.day, d);
    return m;
  }, [days]);

  // Build grid rows (6 rows max)
  const rows: (TithiDayData | null)[][] = [];
  let currentRow: (TithiDayData | null)[] = [];

  // Fill leading empty cells
  for (let i = 0; i < firstDayOfWeek; i++) currentRow.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    currentRow.push(dayMap.get(d) || null);
    if (currentRow.length === 7) {
      rows.push(currentRow);
      currentRow = [];
    }
  }
  // Fill trailing empty cells
  if (currentRow.length > 0) {
    while (currentRow.length < 7) currentRow.push(null);
    rows.push(currentRow);
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 overflow-hidden">
      {/* Day name headers */}
      <div className="grid grid-cols-7 border-b border-gold-primary/15">
        {dayNames.map((name, i) => (
          <div key={i} className={`text-center py-2.5 text-xs font-bold ${i === 0 ? 'text-red-400/70' : 'text-gold-primary/60'}`}>
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7 border-b border-gold-primary/8 last:border-b-0">
          {row.map((cell, ci) => {
            if (!cell) {
              return <div key={ci} className="min-h-[80px] sm:min-h-[100px] bg-[#0a0e27]/30" />;
            }

            const hasFestivals = cell.festivals.length > 0;
            const isPurnima = cell.tithiNumber === 15;
            const isAmavasya = cell.tithiNumber === 30;

            return (
              <div
                key={ci}
                onClick={() => onDayClick?.(cell.date)}
                className={`min-h-[80px] sm:min-h-[100px] p-1.5 sm:p-2 cursor-pointer transition-colors hover:bg-gold-primary/5 relative ${
                  cell.isToday ? 'bg-gold-primary/8 ring-1 ring-inset ring-gold-primary/30' : ''
                } ${isPurnima ? 'bg-amber-500/5' : ''} ${isAmavasya ? 'bg-violet-500/5' : ''}`}
              >
                {/* Date number + moon icon */}
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs sm:text-sm font-bold ${cell.isToday ? 'text-gold-light' : ci === 0 ? 'text-red-400/70' : 'text-text-primary/80'}`}>
                    {cell.day}
                  </span>
                  <MoonIcon tithiNumber={cell.tithiNumber} paksha={cell.paksha} size={18} />
                </div>

                {/* Tithi name */}
                <div className={`text-[10px] sm:text-xs leading-tight ${isPurnima ? 'text-amber-300 font-bold' : isAmavasya ? 'text-violet-300 font-bold' : 'text-text-secondary/70'}`}>
                  {tl(cell.tithiName, locale)}
                </div>

                {/* Paksha indicator */}
                <div className={`text-[8px] sm:text-[9px] mt-0.5 ${cell.paksha === 'shukla' ? 'text-amber-400/40' : 'text-violet-400/40'}`}>
                  {cell.paksha === 'shukla' ? (isHi ? 'शु' : 'S') : (isHi ? 'कृ' : 'K')}
                </div>

                {/* Festivals */}
                {hasFestivals && (
                  <div className="mt-0.5 space-y-0.5">
                    {cell.festivals.slice(0, 2).map((f, fi) => (
                      <div
                        key={fi}
                        className={`text-[8px] sm:text-[9px] leading-tight px-1 py-0.5 rounded truncate ${
                          f.type === 'major'
                            ? 'bg-gold-primary/15 text-gold-light font-medium border border-gold-primary/20'
                            : f.type === 'eclipse'
                              ? 'bg-red-500/15 text-red-300 border border-red-500/20'
                              : 'bg-violet-500/10 text-violet-300/80 border border-violet-500/15'
                        }`}
                      >
                        {tl(f.name, locale)}
                      </div>
                    ))}
                    {cell.festivals.length > 2 && (
                      <div className="text-[8px] text-text-secondary/50">+{cell.festivals.length - 2}</div>
                    )}
                  </div>
                )}

                {/* Today indicator */}
                {cell.isToday && (
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
