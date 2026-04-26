'use client';

import { useMemo } from 'react';
import type { DetailWindow } from '@/types/muhurta-ai';

interface DayDrilldownProps {
  windows: DetailWindow[];
  date: string;              // YYYY-MM-DD
  loading: boolean;
  isToday: boolean;
  onWindowSelect: (window: DetailWindow) => void;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function barColorClass(score: number, hasRed: boolean): string {
  if (hasRed) return 'bg-red-500/35';
  if (score >= 75) return 'bg-green-400/80';
  if (score >= 55) return 'bg-green-400/45';
  if (score >= 35) return 'bg-amber-500/50';
  return 'bg-red-500/40';
}

function formatDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = DAY_NAMES[dt.getUTCDay()];
  return `${dow}, ${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

function timeToMinutes(t: string): number {
  const [h, min] = t.split(':').map(Number);
  return h * 60 + min;
}

function nowBarIndex(windows: DetailWindow[]): number {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return windows.findIndex(w => {
    const start = timeToMinutes(w.startTime);
    const end = timeToMinutes(w.endTime);
    return nowMin >= start && nowMin < end;
  });
}

// Derive unique inauspicious periods from all windows
interface PeriodInfo {
  name: string;
  startTime: string;
  endTime: string;
  severity: 'red' | 'amber';
}

function extractPeriods(windows: DetailWindow[]): PeriodInfo[] {
  const seen = new Map<string, PeriodInfo>();
  for (const w of windows) {
    for (const p of w.inauspiciousPeriods) {
      if (!seen.has(p.name)) {
        const severity =
          p.name === 'Rahu Kaal' || p.name === 'Vishti (Bhadra)'
            ? 'red'
            : 'amber';
        seen.set(p.name, { name: p.name, startTime: p.startTime, endTime: p.endTime, severity });
      }
    }
  }
  return Array.from(seen.values());
}

// Generate 2-hour axis labels based on the time range of windows
function buildAxisLabels(windows: DetailWindow[]): string[] {
  if (windows.length === 0) return [];
  const firstStart = timeToMinutes(windows[0].startTime);
  const lastEnd = timeToMinutes(windows[windows.length - 1].endTime);
  const labels: string[] = [];
  // Round up to nearest 2-hour boundary
  let h = Math.ceil(firstStart / 120) * 2;
  while (h * 60 <= lastEnd) {
    labels.push(`${h}:00`);
    h += 2;
  }
  return labels;
}

export default function DayDrilldown({
  windows,
  date,
  loading,
  isToday,
  onWindowSelect,
}: DayDrilldownProps) {
  const dateLabel = useMemo(() => formatDateLabel(date), [date]);

  const panchangCtx = windows[0]?.panchangContext;
  const peakScore = useMemo(
    () => (windows.length ? Math.max(...windows.map(w => w.score)) : 0),
    [windows],
  );

  const nowIdx = useMemo(
    () => (isToday && windows.length ? nowBarIndex(windows) : -1),
    [isToday, windows],
  );

  const periods = useMemo(() => extractPeriods(windows), [windows]);
  const axisLabels = useMemo(() => buildAxisLabels(windows), [windows]);

  if (loading) {
    return (
      <div className="bg-[#111633] border border-[#d4a853]/10 rounded-xl p-5">
        <div className="h-5 w-48 rounded bg-white/[0.04] animate-pulse mb-2" />
        <div className="h-3 w-64 rounded bg-white/[0.03] animate-pulse mb-5" />
        <div className="h-[120px] flex items-end gap-px">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[2px] min-w-[4px] animate-pulse bg-white/[0.03]"
              style={{ height: `${20 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (windows.length === 0) {
    return (
      <div className="bg-[#111633] border border-[#d4a853]/10 rounded-xl p-5">
        <p className="text-[#8a8478] text-sm">No detail windows available for this date.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111633] border border-[#d4a853]/10 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-[Cinzel] text-base text-[#f0d48a]">{dateLabel}</h3>
          {panchangCtx && (
            <p className="text-[11px] text-[#8a8478] mt-0.5">
              {panchangCtx.tithiName} · {panchangCtx.nakshatraName} · {panchangCtx.yogaName}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#8a8478]">Peak Score</span>
          <div
            className={`text-xl font-bold ${
              peakScore >= 70 ? 'text-green-400' : peakScore >= 45 ? 'text-amber-400' : 'text-red-400'
            }`}
          >
            {peakScore}
          </div>
        </div>
      </div>

      {/* Sparkline chart */}
      <div className="flex items-end gap-px h-[120px]">
        {windows.map((w, i) => {
          const hasRed = w.inauspiciousPeriods.some(
            p => p.active && (p.name === 'Rahu Kaal' || p.name === 'Vishti (Bhadra)'),
          );
          const colorClass = barColorClass(w.score, hasRed);
          const heightPct = Math.max(4, w.score);
          const isNow = i === nowIdx;

          return (
            <div
              key={`${w.startTime}-${i}`}
              title={`${w.startTime}–${w.endTime}: ${w.score}`}
              onClick={() => onWindowSelect(w)}
              className={[
                'flex-1 rounded-t-[2px] min-w-[4px] cursor-pointer transition-all hover:brightness-[1.3]',
                colorClass,
                isNow ? 'border-l-2 border-[#f0d48a]' : '',
              ].join(' ')}
              style={{ height: `${heightPct}%` }}
            />
          );
        })}
      </div>

      {/* Time axis */}
      <div className="flex justify-between text-[10px] text-[#8a8478] -mt-1">
        {axisLabels.map(label => (
          <span key={label}>{label}</span>
        ))}
      </div>

      {/* Warning chips */}
      {periods.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {periods.map(p => (
            <span
              key={p.name}
              className={
                p.severity === 'red'
                  ? 'bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] px-2.5 py-1 rounded-md'
                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] px-2.5 py-1 rounded-md'
              }
            >
              {p.name} {p.startTime}–{p.endTime}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
