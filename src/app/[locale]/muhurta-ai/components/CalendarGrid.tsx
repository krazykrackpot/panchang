'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DaySummary } from '@/types/muhurta-ai';

// ---------------------------------------------------------------------------
// ShuddhiDots  –  5 dots showing how many panchanga factors are favourable
// ---------------------------------------------------------------------------
export function ShuddhiDots({ filled }: { filled: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < filled ? 'bg-emerald-400' : 'bg-text-secondary/30'
          }`}
        />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Quality colour maps
// ---------------------------------------------------------------------------
const QUALITY_DOT: Record<DaySummary['quality'], string> = {
  excellent: 'bg-emerald-400',
  good: 'bg-amber-400',
  fair: 'bg-text-secondary/50',
  poor: 'bg-transparent',
};

const QUALITY_CELL_BG: Record<DaySummary['quality'], string> = {
  excellent: 'border-emerald-500/20 bg-emerald-500/8',
  good: 'border-gold-primary/15 bg-gold-primary/8',
  fair: 'border-white/5 bg-white/[0.03]',
  poor: 'border-transparent bg-white/[0.02]',
};

const WEEKDAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MONTH_NAMES_EN = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_NAMES_HI = [
  '', 'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
];

// ---------------------------------------------------------------------------
// CalendarGrid
// ---------------------------------------------------------------------------
interface CalendarGridProps {
  year: number;
  month: number; // 1-12
  days: DaySummary[];
  onMonthChange: (delta: number) => void;
  onDaySelect: (day: DaySummary) => void;
  selectedDate?: string;
  locale: string;
  loading?: boolean;
}

export default function CalendarGrid({
  year,
  month,
  days,
  onMonthChange,
  onDaySelect,
  selectedDate,
  locale,
  loading,
}: CalendarGridProps) {
  const isHi = locale === 'hi';
  const monthLabel = isHi ? MONTH_NAMES_HI[month] : MONTH_NAMES_EN[month];

  // Build grid cells: null = empty padding cell, DaySummary | number = real day
  const grid = useMemo(() => {
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    // 0=Sun .. 6=Sat  –  matches our header order
    const firstDow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();

    const dayMap = new Map<string, DaySummary>();
    for (const d of days) {
      dayMap.set(d.date, d);
    }

    const cells: (DaySummary | null)[] = [];

    // Leading blanks
    for (let i = 0; i < firstDow; i++) cells.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const summary = dayMap.get(dateStr);
      if (summary) {
        cells.push(summary);
      } else {
        // Create a minimal stub so we can still render the day number
        cells.push({
          date: dateStr,
          bestScore: 0,
          quality: 'poor' as const,
          windowCount: 0,
        });
      }
    }

    return cells;
  }, [year, month, days]);

  const todayStr = useMemo(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
  }, []);

  return (
    <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4 sm:p-6 relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[#0a0e27]/70 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      )}

      {/* Month header with navigation */}
      <div className="flex items-center justify-center gap-4 mb-5">
        <button
          onClick={() => onMonthChange(-1)}
          className="p-2.5 rounded-xl border border-gold-primary/20 hover:bg-gold-primary/10 hover:border-gold-primary/40 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-2xl sm:text-3xl font-bold min-w-[220px] text-center">
          <span className="bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] bg-clip-text text-transparent">
            {monthLabel} {year}
          </span>
        </span>
        <button
          onClick={() => onMonthChange(1)}
          className="p-2.5 rounded-xl border border-gold-primary/20 hover:bg-gold-primary/10 hover:border-gold-primary/40 transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_HEADERS.map((d) => (
          <div
            key={d}
            className="text-center text-gold-dark text-xs uppercase tracking-[2px] py-2 font-semibold"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1.5">
        {grid.map((cell, i) => {
          if (!cell) return <div key={`pad-${i}`} className="h-14 sm:h-16" />;

          const dayNum = parseInt(cell.date.split('-')[2]);
          const isAuspicious = cell.quality !== 'poor';
          const isSelected = selectedDate === cell.date;
          const isToday = cell.date === todayStr;

          return (
            <motion.button
              key={cell.date}
              type="button"
              whileTap={isAuspicious ? { scale: 0.95 } : undefined}
              onClick={() => {
                if (isAuspicious) onDaySelect(cell);
              }}
              className={`h-14 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all relative ${
                isSelected
                  ? 'border-gold-primary/60 bg-gold-primary/15 ring-2 ring-gold-primary/30 scale-105 shadow-[0_0_16px_rgba(212,168,83,0.2)]'
                  : isAuspicious
                    ? `${QUALITY_CELL_BG[cell.quality]} cursor-pointer hover:border-gold-primary/40 hover:scale-[1.03]`
                    : 'border-transparent bg-white/[0.02] opacity-35'
              }`}
            >
              {isToday && (
                <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />
              )}

              {/* Day number */}
              <span
                className={`text-sm sm:text-base font-bold leading-none ${
                  isAuspicious ? 'text-gold-light' : 'text-text-secondary/40'
                }`}
              >
                {dayNum}
              </span>

              {/* Tithi name */}
              {cell.tithi && (
                <span
                  className={`text-[8px] sm:text-[9px] leading-none mt-0.5 truncate max-w-full px-0.5 ${
                    isAuspicious ? 'text-text-secondary/60' : 'text-text-secondary/25'
                  }`}
                >
                  {cell.tithi.length > 8
                    ? cell.tithi.slice(0, 7) + '.'
                    : cell.tithi}
                </span>
              )}

              {/* Quality dot */}
              {isAuspicious && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${QUALITY_DOT[cell.quality]}`}
                  />
                  {cell.quality === 'excellent' && (
                    <div
                      className={`w-1 h-1 rounded-full ${QUALITY_DOT[cell.quality]} opacity-50`}
                    />
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-5 mt-6">
        {(['excellent', 'good', 'fair'] as const).map((q) => (
          <div key={q} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${QUALITY_DOT[q]}`} />
            <span className="text-text-secondary text-xs font-medium capitalize">
              {q}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
