'use client';

import { useMemo, Fragment } from 'react';
import type { HeatmapCell } from '@/types/muhurta-ai';

interface MonthHeatmapProps {
  cells: HeatmapCell[];
  selectedDate: string | null;
  today: string;             // YYYY-MM-DD
  year: number;
  month: number;             // 1-12
  loading: boolean;
  onCellClick: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function scoreToBgClass(score: number): string {
  if (score < 15)  return 'bg-white/[0.03]';
  if (score < 30)  return 'bg-red-500/35';
  if (score < 45)  return 'bg-amber-500/30';
  if (score < 60)  return 'bg-amber-500/55';
  if (score < 75)  return 'bg-green-400/35';
  if (score < 90)  return 'bg-green-400/60';
  return 'bg-green-400/85';
}

function scoreToLabel(score: number): string {
  if (score < 15)  return 'Empty';
  if (score < 30)  return 'Avoid';
  if (score < 45)  return 'Poor';
  if (score < 60)  return 'Fair';
  if (score < 75)  return 'Good';
  if (score < 90)  return 'Very Good';
  return 'Excellent';
}

function formatTimeSlot(startTime: string, endTime: string): string {
  // Convert "08:00" → "8 AM", "14:00" → "2 PM"
  const [h] = startTime.split(':').map(Number);
  const [eh] = endTime.split(':').map(Number);
  const fmt = (hr: number) => {
    if (hr === 0 || hr === 24) return '12 AM';
    if (hr === 12) return '12 PM';
    return hr < 12 ? `${hr} AM` : `${hr - 12} PM`;
  };
  return `${fmt(h)}–${fmt(eh)}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

const LEGEND_STOPS = [
  { label: 'Avoid',     bg: 'bg-red-500/35' },
  { label: 'Poor',      bg: 'bg-amber-500/30' },
  { label: 'Fair',      bg: 'bg-amber-500/55' },
  { label: 'Good',      bg: 'bg-green-400/35' },
  { label: 'Very Good', bg: 'bg-green-400/60' },
  { label: 'Excellent', bg: 'bg-green-400/85' },
];

export default function MonthHeatmap({
  cells,
  selectedDate,
  today,
  year,
  month,
  loading,
  onCellClick,
  onMonthChange,
}: MonthHeatmapProps) {
  const totalDays = daysInMonth(year, month);

  // Derive sorted unique time slots from cells
  const timeSlots: { startTime: string; endTime: string }[] = useMemo(() => {
    const seen = new Map<string, string>();
    for (const c of cells) {
      if (!seen.has(c.startTime)) seen.set(c.startTime, c.endTime);
    }
    return Array.from(seen.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([startTime, endTime]) => ({ startTime, endTime }));
  }, [cells]);

  // Build lookup: date → startTime → cell
  const cellMap = useMemo(() => {
    const map = new Map<string, Map<string, HeatmapCell>>();
    for (const c of cells) {
      if (!map.has(c.date)) map.set(c.date, new Map());
      map.get(c.date)!.set(c.startTime, c);
    }
    return map;
  }, [cells]);

  // Day numbers for the month
  const dayNumbers = useMemo(() => {
    const days: number[] = [];
    for (let d = 1; d <= totalDays; d++) days.push(d);
    return days;
  }, [totalDays]);

  const prevMonth = () => {
    if (month === 1) onMonthChange(year - 1, 12);
    else onMonthChange(year, month - 1);
  };

  const nextMonth = () => {
    if (month === 12) onMonthChange(year + 1, 1);
    else onMonthChange(year, month + 1);
  };

  // Zero-padded date string for a day in this month
  const dateStr = (day: number) =>
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <div className="hidden lg:block bg-[#111633] border border-[#d4a853]/10 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            className="border border-[#d4a853]/20 text-[#d4a853] w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#d4a853]/10 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="text-[#e6e2d8] font-semibold text-sm min-w-[110px] text-center">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="border border-[#d4a853]/20 text-[#d4a853] w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#d4a853]/10 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#8a8478]">Legend:</span>
          <div className="flex items-center gap-1.5">
            {LEGEND_STOPS.map((stop) => (
              <div key={stop.label} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-[2px] ${stop.bg}`} />
                <span className="text-[9px] text-[#8a8478]">{stop.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        role="grid"
        aria-label={`Muhurta heatmap for ${MONTH_NAMES[month - 1]} ${year}`}
        className="overflow-x-auto"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `56px repeat(${totalDays}, minmax(18px, 1fr))`,
            gap: '2px',
          }}
        >
          {/* Top-left corner spacer */}
          <div />

          {/* Day number headers */}
          {dayNumbers.map((day) => {
            const ds = dateStr(day);
            const isToday = ds === today;
            return (
              <div
                key={day}
                className={`text-center text-[9px] pb-1 ${isToday ? 'text-[#f0d48a] font-bold' : 'text-[#8a8478]'}`}
              >
                {day}
              </div>
            );
          })}

          {/* Rows: one per time slot */}
          {timeSlots.map(({ startTime, endTime }) => (
            <Fragment key={`row-${startTime}`}>
              {/* Time label */}
              <div
                key={`label-${startTime}`}
                className="text-[10px] text-[#8a8478] flex items-center pr-2 truncate"
                style={{ height: 22 }}
              >
                {startTime}
              </div>

              {/* Cells for each day */}
              {dayNumbers.map((day) => {
                const ds = dateStr(day);
                const cell = cellMap.get(ds)?.get(startTime);
                const score = cell?.score ?? 0;
                const isToday = ds === today;
                const isSelected = selectedDate === ds;

                let outlineClass = '';
                if (isSelected) outlineClass = 'outline outline-2 outline-white outline-offset-1';
                else if (isToday) outlineClass = 'outline outline-2 outline-[#f0d48a] outline-offset-1';

                const label = `${MONTH_NAMES[month - 1]} ${day}, ${formatTimeSlot(startTime, endTime)}, score ${score}`;

                if (loading) {
                  return (
                    <div
                      key={`${ds}-${startTime}-skeleton`}
                      className="aspect-square rounded-[3px] min-w-[18px] animate-pulse bg-white/[0.03]"
                      style={{ height: 22 }}
                    />
                  );
                }

                return (
                  <div key={`${ds}-${startTime}`} className="group relative" style={{ height: 22 }}>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#0a0e27] border border-[#d4a853]/30 rounded text-[10px] text-[#e6e2d8] whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none z-20">
                      {scoreToLabel(score)} · {score}/100
                    </div>
                    <button
                      role="gridcell"
                      aria-label={label}
                      title={`${scoreToLabel(score)} (${score})`}
                      onClick={() => onCellClick(ds)}
                      onKeyDown={(e) => {
                        if (e.key === ' ') {
                          e.preventDefault(); // prevent page scroll on Space
                          onCellClick(ds);
                        }
                      }}
                      className={[
                        'aspect-square rounded-[3px] min-w-[18px] w-full h-full cursor-pointer transition-all duration-150',
                        'hover:scale-[1.3] hover:z-10 hover:shadow-lg hover:shadow-[#d4a853]/40',
                        'focus:outline-2 focus:outline-[#d4a853] focus:outline-offset-1',
                        scoreToBgClass(score),
                        outlineClass,
                      ].filter(Boolean).join(' ')}
                    />
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {!loading && cells.length === 0 && (
        <div className="text-center text-[#8a8478] text-sm py-8">
          No muhurta data for this month.
        </div>
      )}
    </div>
  );
}
