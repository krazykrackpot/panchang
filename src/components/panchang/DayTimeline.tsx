'use client';

import { useMemo } from 'react';
import type { PanchangData } from '@/types/panchang';

// ── Time helpers ──

function currentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function parseTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Midnight-wrap-aware time range check (Lesson R) */
function isInTimeRange(startTime: string, endTime: string): boolean {
  const now = currentMinutes();
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (end < start) return now >= start || now < end;
  return now >= start && now < end;
}

// ── Types ──

interface TimeWindow {
  name: string;
  subtitle: string;
  startTime: string;
  endTime: string;
  type: 'auspicious' | 'inauspicious';
  description: string;
}

interface DayTimelineProps {
  panchang: PanchangData;
  sunrise: string;
  sunset: string;
  mode?: 'full' | 'auspicious' | 'inauspicious';
  compact?: boolean;
  locale?: string;
}

// ── Window collection ──

function collectWindows(panchang: PanchangData): TimeWindow[] {
  const windows: TimeWindow[] = [];

  // — Auspicious —
  if (panchang.brahmaMuhurta) {
    windows.push({
      name: 'Brahma Muhurta',
      subtitle: "Creator's Hour",
      startTime: panchang.brahmaMuhurta.start,
      endTime: panchang.brahmaMuhurta.end,
      type: 'auspicious',
      description: 'Pre-dawn meditation & spiritual practice',
    });
  }

  if (panchang.abhijitMuhurta && panchang.abhijitMuhurta.available !== false) {
    windows.push({
      name: 'Abhijit Muhurta',
      subtitle: 'Victory Moment',
      startTime: panchang.abhijitMuhurta.start,
      endTime: panchang.abhijitMuhurta.end,
      type: 'auspicious',
      description: 'Universally auspicious for all activities',
    });
  }

  if (panchang.vijayaMuhurta) {
    windows.push({
      name: 'Vijaya Muhurta',
      subtitle: 'Triumph Window',
      startTime: panchang.vijayaMuhurta.start,
      endTime: panchang.vijayaMuhurta.end,
      type: 'auspicious',
      description: 'Favorable for victory and success',
    });
  }

  // Amrit Kalam — array or single
  const amritWindows = panchang.amritKalamAll ?? (panchang.amritKalam ? [panchang.amritKalam] : []);
  amritWindows.forEach((w, i) => {
    windows.push({
      name: `Amrit Kalam${amritWindows.length > 1 ? ` ${i + 1}` : ''}`,
      subtitle: 'Nectar Period',
      startTime: w.start,
      endTime: w.end,
      type: 'auspicious',
      description: 'Highly auspicious for initiations & rituals',
    });
  });

  if (panchang.godhuli) {
    windows.push({
      name: 'Godhuli',
      subtitle: 'Cow-Dust Hour',
      startTime: panchang.godhuli.start,
      endTime: panchang.godhuli.end,
      type: 'auspicious',
      description: 'Sacred twilight, favorable for ceremonies',
    });
  }

  if (panchang.sandhyaKaal?.morning) {
    windows.push({
      name: 'Sandhya Kaal',
      subtitle: 'Dawn Transition',
      startTime: panchang.sandhyaKaal.morning.start,
      endTime: panchang.sandhyaKaal.morning.end,
      type: 'auspicious',
      description: 'Twilight prayers & intention setting',
    });
  }

  if (panchang.sandhyaKaal?.evening) {
    windows.push({
      name: 'Sandhya Kaal',
      subtitle: 'Dusk Transition',
      startTime: panchang.sandhyaKaal.evening.start,
      endTime: panchang.sandhyaKaal.evening.end,
      type: 'auspicious',
      description: 'Evening prayers & reflection',
    });
  }

  // — Inauspicious —
  if (panchang.rahuKaal) {
    windows.push({
      name: 'Rahu Kaal',
      subtitle: 'Shadow Period',
      startTime: panchang.rahuKaal.start,
      endTime: panchang.rahuKaal.end,
      type: 'inauspicious',
      description: 'Avoid starting new ventures',
    });
  }

  if (panchang.yamaganda) {
    windows.push({
      name: 'Yamaganda',
      subtitle: 'Restraint Window',
      startTime: panchang.yamaganda.start,
      endTime: panchang.yamaganda.end,
      type: 'inauspicious',
      description: 'Period of caution & restraint',
    });
  }

  if (panchang.gulikaKaal) {
    windows.push({
      name: 'Gulika Kaal',
      subtitle: 'Poison Period',
      startTime: panchang.gulikaKaal.start,
      endTime: panchang.gulikaKaal.end,
      type: 'inauspicious',
      description: 'Unfavorable for auspicious activities',
    });
  }

  // Varjyam — array or single
  const varjyamWindows = panchang.varjyamAll ?? (panchang.varjyam ? [panchang.varjyam] : []);
  varjyamWindows.forEach((w, i) => {
    windows.push({
      name: `Varjyam${varjyamWindows.length > 1 ? ` ${i + 1}` : ''}`,
      subtitle: 'Avoidance Window',
      startTime: w.start,
      endTime: w.end,
      type: 'inauspicious',
      description: 'Unfavorable for important decisions',
    });
  });

  // Dur Muhurtam — array
  if (panchang.durMuhurtam) {
    panchang.durMuhurtam.forEach((w, i) => {
      windows.push({
        name: `Dur Muhurta${panchang.durMuhurtam!.length > 1 ? ` ${i + 1}` : ''}`,
        subtitle: 'Difficult Moment',
        startTime: w.start,
        endTime: w.end,
        type: 'inauspicious',
        description: 'Challenging period for new beginnings',
      });
    });
  }

  if (panchang.vishaGhatika) {
    windows.push({
      name: 'Visha Ghatika',
      subtitle: 'Toxic Interval',
      startTime: panchang.vishaGhatika.start,
      endTime: panchang.vishaGhatika.end,
      type: 'inauspicious',
      description: 'Inauspicious sub-period to avoid',
    });
  }

  // Bhadra — array or single
  const bhadraWindows = panchang.bhadraAll ?? (panchang.bhadra ? [panchang.bhadra] : []);
  bhadraWindows.forEach((w, i) => {
    windows.push({
      name: `Bhadra${bhadraWindows.length > 1 ? ` ${i + 1}` : ''}`,
      subtitle: 'Vishti Period',
      startTime: w.start,
      endTime: w.end,
      type: 'inauspicious',
      description: 'Vishti karana — avoid auspicious work',
    });
  });

  return windows;
}

/** Detect overlapping windows for annotation */
function detectOverlaps(windows: TimeWindow[]): Map<number, string[]> {
  const overlaps = new Map<number, string[]>();
  for (let i = 0; i < windows.length; i++) {
    const iEnd = parseTimeToMinutes(windows[i].endTime);
    for (let j = i + 1; j < windows.length; j++) {
      const jStart = parseTimeToMinutes(windows[j].startTime);
      // j starts before i ends → overlap
      if (jStart < iEnd) {
        const existing = overlaps.get(j) ?? [];
        existing.push(windows[i].name);
        overlaps.set(j, existing);
      }
    }
  }
  return overlaps;
}

// ── Component ──

export default function DayTimeline({
  panchang,
  sunrise,
  sunset,
  mode = 'full',
  compact = false,
}: DayTimelineProps) {
  const allWindows = useMemo(() => collectWindows(panchang), [panchang]);

  const filtered = useMemo(() => {
    let list = allWindows;
    if (mode === 'auspicious') list = list.filter((w) => w.type === 'auspicious');
    if (mode === 'inauspicious') list = list.filter((w) => w.type === 'inauspicious');
    // Sort by start time
    list.sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
    return list;
  }, [allWindows, mode]);

  const overlaps = useMemo(() => detectOverlaps(filtered), [filtered]);

  const displayed = compact ? filtered.slice(0, 6) : filtered;
  const hasMore = compact && filtered.length > 6;

  if (displayed.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-text-secondary text-sm">No time windows available for this day.</p>
      </div>
    );
  }

  return (
    <div className={compact ? '' : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5'}>
      {/* Sunrise / Sunset header bar */}
      {!compact && (
        <div className="flex items-center gap-3 mb-5">
          <span className="text-gold-light/80 text-xs font-mono flex items-center gap-1">
            <SunriseIcon />
            {sunrise}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/40 via-gold-primary/15 to-indigo-500/30" />
          <span className="text-gold-light/80 text-xs font-mono flex items-center gap-1">
            {sunset}
            <SunsetIcon />
          </span>
        </div>
      )}

      {/* Timeline entries */}
      <div className={compact ? 'space-y-2' : 'space-y-3'}>
        {displayed.map((w, i) => {
          const isCurrent = isInTimeRange(w.startTime, w.endTime);
          const overlapWith = overlaps.get(filtered.indexOf(w));
          const isAusp = w.type === 'auspicious';

          return (
            <div
              key={`${w.name}-${w.startTime}-${i}`}
              className={`
                relative rounded-xl transition-all
                ${compact ? 'p-2.5' : 'p-3.5'}
                ${isAusp
                  ? 'border-l-4 border-emerald-500/60 bg-emerald-500/[0.08]'
                  : 'border-l-4 border-red-500/60 bg-red-500/[0.08]'
                }
                ${isCurrent ? 'ring-1 ring-gold-primary/50 shadow-[0_0_12px_rgba(212,168,83,0.15)]' : ''}
              `}
            >
              {/* Time range + NOW badge */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-gold-light/80 text-xs font-mono">
                  {w.startTime} – {w.endTime}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-semibold bg-gold-primary/20 text-gold-light px-2 py-0.5 rounded-full">
                    NOW
                  </span>
                )}
              </div>

              {/* Name + subtitle */}
              <div className="flex items-baseline gap-2">
                <span className={`text-sm font-semibold ${isAusp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isAusp ? '\u2726' : '\u26A0'} {w.name}
                </span>
                <span className={`text-xs ${isAusp ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                  {w.subtitle}
                </span>
              </div>

              {/* Description — hidden in compact mode */}
              {!compact && (
                <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                  {w.description}
                </p>
              )}

              {/* Overlap annotation */}
              {overlapWith && overlapWith.length > 0 && !compact && (
                <p className="text-amber-400/70 text-[11px] mt-1.5">
                  \u26A0 Overlaps with {overlapWith.join(', ')}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* "See all" link in compact mode */}
      {hasMore && (
        <div className="mt-3 text-center">
          <span className="text-gold-light/60 text-xs cursor-pointer hover:text-gold-light transition-colors">
            +{filtered.length - 6} more windows
          </span>
        </div>
      )}

      {/* Legend — only in full mode */}
      {!compact && (
        <div className="flex items-center gap-4 mt-5 pt-3 border-t border-white/[0.06]">
          <span className="flex items-center gap-1.5 text-text-secondary text-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500/40" />
            Inauspicious
          </span>
          <span className="flex items-center gap-1.5 text-text-secondary text-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500/40" />
            Auspicious
          </span>
        </div>
      )}
    </div>
  );
}

// ── Tiny inline SVG icons ──

function SunriseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="inline-block">
      <path d="M8 2v2M8 12v2M3 8H1M15 8h-2M4.5 4.5l1 1M10.5 5.5l1-1" stroke="#f0d48a" strokeWidth="1" strokeLinecap="round" />
      <path d="M4 10a4 4 0 0 1 8 0" stroke="#f0d48a" strokeWidth="1.2" fill="none" />
      <line x1="2" y1="12" x2="14" y2="12" stroke="#f0d48a" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

function SunsetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="inline-block">
      <path d="M8 4v2M3 10H1M15 10h-2M4.5 6.5l1 1M10.5 7.5l1-1" stroke="#d4a853" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M4 12a4 4 0 0 1 8 0" stroke="#d4a853" strokeWidth="1.2" fill="none" opacity="0.6" />
      <line x1="2" y1="14" x2="14" y2="14" stroke="#d4a853" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}
