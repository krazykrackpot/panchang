'use client';

import { useMemo } from 'react';
import type { HeatmapCell } from '@/types/muhurta-ai';

interface MobileMonthViewProps {
  cells: HeatmapCell[];
  selectedDate: string | null;
  today: string;
  loading: boolean;
  onDaySelect: (date: string) => void;
}

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function scoreToBgClass(score: number): string {
  if (score < 15)  return 'bg-white/[0.03]';
  if (score < 30)  return 'bg-red-500/35';
  if (score < 45)  return 'bg-amber-500/30';
  if (score < 60)  return 'bg-amber-500/55';
  if (score < 75)  return 'bg-green-400/35';
  if (score < 90)  return 'bg-green-400/60';
  return 'bg-green-400/85';
}

function scoreToBadgeBg(score: number): string {
  if (score < 15)  return 'bg-white/[0.06] text-[#8a8478]';
  if (score < 30)  return 'bg-red-500/25 text-red-300';
  if (score < 45)  return 'bg-amber-500/20 text-amber-400';
  if (score < 60)  return 'bg-amber-500/40 text-amber-300';
  if (score < 75)  return 'bg-green-400/20 text-green-300';
  if (score < 90)  return 'bg-green-400/40 text-green-200';
  return 'bg-green-400/60 text-white';
}

interface DayGroup {
  date: string;
  dayNumber: number;
  weekday: string;
  cells: HeatmapCell[];
  bestScore: number;
}

export default function MobileMonthView({
  cells,
  selectedDate,
  today,
  loading,
  onDaySelect,
}: MobileMonthViewProps) {
  // Group cells by date, sorted ascending
  const dayGroups: DayGroup[] = useMemo(() => {
    const map = new Map<string, HeatmapCell[]>();
    for (const cell of cells) {
      const arr = map.get(cell.date);
      if (arr) arr.push(cell);
      else map.set(cell.date, [cell]);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, dayCells]) => {
        // Sort slots within the day by startTime
        const sorted = [...dayCells].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        );
        const bestScore = sorted.reduce((max, c) => Math.max(max, c.score), 0);
        const [y, m, d] = date.split('-').map(Number);
        const jsDate = new Date(y, m - 1, d);
        return {
          date,
          dayNumber: d,
          weekday: WEEKDAY_SHORT[jsDate.getDay()],
          cells: sorted,
          bestScore,
        };
      });
  }, [cells]);

  if (loading) {
    return (
      <div className="lg:hidden space-y-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2 rounded-lg animate-pulse bg-white/[0.03]"
          >
            <div className="w-10 h-8 rounded bg-white/[0.05]" />
            <div className="flex-1 h-4 rounded bg-white/[0.05]" />
            <div className="w-10 h-5 rounded bg-white/[0.05]" />
          </div>
        ))}
      </div>
    );
  }

  if (dayGroups.length === 0) {
    return (
      <div className="lg:hidden text-center text-[#8a8478] text-sm py-8">
        No muhurta data available.
      </div>
    );
  }

  return (
    <div className="lg:hidden space-y-1">
      {dayGroups.map(({ date, dayNumber, weekday, cells: dayCells, bestScore }) => {
        const isToday = date === today;
        const isSelected = selectedDate === date;

        return (
          <button
            key={date}
            onClick={() => onDaySelect(date)}
            className={[
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-left',
              'hover:bg-white/[0.03]',
              isSelected
                ? 'border border-[#d4a853]/40 bg-[#d4a853]/5'
                : 'border border-transparent',
            ].join(' ')}
            aria-pressed={isSelected}
            aria-label={`${isToday ? 'Today, ' : ''}${weekday} ${dayNumber}, best score ${bestScore}`}
          >
            {/* Date label */}
            <div className="flex flex-col items-center min-w-[36px]">
              <span className={`text-sm font-semibold leading-none ${isToday ? 'text-[#f0d48a]' : 'text-[#e6e2d8]'}`}>
                {dayNumber}
              </span>
              <span className="text-[10px] text-[#8a8478] mt-0.5">{weekday}</span>
              {isToday && (
                <span className="text-[8px] text-[#f0d48a] font-medium mt-0.5 leading-none">
                  Today
                </span>
              )}
            </div>

            {/* Mini dot row */}
            <div className="flex items-center gap-1 flex-1 flex-wrap">
              {dayCells.map((cell) => (
                <div
                  key={`${cell.date}-${cell.startTime}`}
                  className={`w-2 h-2 rounded-full ${scoreToBgClass(cell.score)}`}
                  title={`${cell.startTime}–${cell.endTime}: ${cell.score}`}
                />
              ))}
            </div>

            {/* Best score badge */}
            <div className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${scoreToBadgeBg(bestScore)}`}>
              {bestScore}
            </div>
          </button>
        );
      })}
    </div>
  );
}
